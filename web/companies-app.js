(() => {
  const LANG_KEY = "career-cockpit-lang";

  const FIT_FIELDS = [
    {
      key: "da",
      field: "fit_data_analyst",
      en: "Data Analyst",
      pt: "Data Analyst",
      short: "DA",
    },
    {
      key: "po",
      field: "fit_product_owner",
      en: "Product Owner",
      pt: "Product Owner",
      short: "PO",
    },
    {
      key: "dsa",
      field: "fit_digital_solution_architect",
      en: "Digital Solution Architect",
      pt: "Digital Solution Architect",
      short: "DSA",
    },
  ];

  const HOME_OFFICE_OPTIONS = ["yes", "hybrid", "no", "unknown"];
  const GROWTH_OPTIONS = ["high", "moderate", "unknown"];

  let collections = {};
  let companies = [];
  let dirty = false;
  let saving = false;
  let saveTimer = null;
  let saveGeneration = 0;
  const SAVE_DEBOUNCE_MS = 500;
  let query = "";
  let categoryFilter = "";
  let roleFilter = "";
  let geoFilter = "";
  let trackFilter = "";
  let homeOfficeFilter = "";
  let growthFilter = "";
  let openCompanyId = "";

  function cell(v) {
    return v == null ? "" : String(v);
  }

  function isFitYes(value) {
    return ["yes", "y", "1", "true", "sim"].includes(
      String(value || "")
        .trim()
        .toLowerCase(),
    );
  }

  function getLangMode() {
    if (document.body.classList.contains("lang-pt")) return "pt";
    if (document.body.classList.contains("lang-en")) return "en";
    return "both";
  }

  function setLangMode(mode) {
    document.body.classList.remove("lang-pt", "lang-en");
    if (mode === "pt" || mode === "en") {
      document.body.classList.add(`lang-${mode}`);
    }
    try {
      localStorage.setItem(LANG_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = "en";
    render();
    if (openCompanyId) fillModal();
  }

  function setDirty(next) {
    if (next) {
      dirty = true;
      saveGeneration += 1;
      document.body.classList.add("is-dirty");
      scheduleSave();
      return;
    }
    dirty = false;
    document.body.classList.remove("is-dirty");
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      void saveAll();
    }, SAVE_DEBOUNCE_MS);
  }

  async function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    while (saving) {
      await new Promise((r) => setTimeout(r, 40));
    }
    if (!dirty) return true;
    return saveAll();
  }

  async function doneModal() {
    await flushSave();
    closeModal();
  }

  function syncCollectionsForSave() {
    collections.companies = companies;
  }

  function flushSaveKeepalive() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (!dirty) return;
    syncCollectionsForSave();
    try {
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections }),
        keepalive: true,
      });
      dirty = false;
      document.body.classList.remove("is-dirty");
    } catch {
      /* ignore */
    }
  }

  function setSaveStatus(text, kind) {
    const el = document.getElementById("save-status");
    if (!el) return;
    el.textContent = text || "";
    el.classList.remove("ok", "err");
    if (kind) el.classList.add(kind);
  }

  function openProfileWindow() {
    location.assign("/profile.html");
  }

  function openPortalsWindow() {
    location.assign("/portals.html");
  }

  function openJobsWindow() {
    location.assign("/");
  }

  function searchBarEl() {
    return document.getElementById("search-bar");
  }

  function searchInputEl() {
    return document.getElementById("company-search-input");
  }

  function isSearchBarOpen() {
    return !!searchBarEl()?.classList.contains("is-open");
  }

  function showSearchBar() {
    const bar = searchBarEl();
    if (!bar) return;
    bar.classList.add("is-open");
    bar.setAttribute("aria-hidden", "false");
  }

  const CARD_SEL = "#companies-results .company-tile";
  const FILTER_SEL = "#companies-filters";

  function hideSearchBar(opts = {}) {
    const bar = searchBarEl();
    if (!bar) return;
    const wasOpen = bar.classList.contains("is-open");
    bar.classList.remove("is-open");
    bar.setAttribute("aria-hidden", "true");
    const inp = searchInputEl();
    if (inp && document.activeElement === inp) inp.blur();
    if (wasOpen && opts.focusCard !== false) {
      window.CardNav?.focusFirst(CARD_SEL);
    }
  }

  function focusSearch() {
    const inp = searchInputEl();
    if (!inp) return;
    showSearchBar();
    requestAnimationFrame(() => {
      inp.focus({ preventScroll: true });
      inp.select();
    });
  }

  function toggleSearchBar() {
    const bar = searchBarEl();
    if (!bar) return;
    if (bar.classList.contains("is-open")) {
      hideSearchBar();
      return;
    }
    focusSearch();
  }

  function dismissSearchBar() {
    hideSearchBar();
  }

  function hasActiveCompanyFilters() {
    return !!(
      categoryFilter ||
      roleFilter ||
      geoFilter ||
      trackFilter ||
      homeOfficeFilter ||
      growthFilter ||
      (query || "").trim()
    );
  }

  function clearCompanyFilters() {
    categoryFilter = "";
    roleFilter = "";
    geoFilter = "";
    trackFilter = "";
    homeOfficeFilter = "";
    growthFilter = "";
    query = "";
    const search = searchInputEl();
    if (search) search.value = "";
    hideSearchBar({ focusCard: false });
    render();
    window.CardNav?.focusFirst(CARD_SEL);
  }

  function moveCardFocus(delta) {
    return !!window.CardNav?.moveInContext(CARD_SEL, FILTER_SEL, delta);
  }

  function roleCount(row) {
    return FIT_FIELDS.filter((f) => isFitYes(row[f.field])).length;
  }

  function matchesRole(row) {
    if (!roleFilter) return true;
    if (roleFilter === "multi") return roleCount(row) >= 2;
    const fit = FIT_FIELDS.find((f) => f.key === roleFilter);
    return fit ? isFitYes(row[fit.field]) : true;
  }

  function haystack(row) {
    return [
      row.name_en,
      row.name_pt,
      row.category_en,
      row.category_pt,
      row.city_en,
      row.city_pt,
      row.region_en,
      row.region_pt,
      row.priority,
      row.status,
      row.geo_track,
      row.rec_rank,
      row.website,
      row.skills_match_en,
      row.skills_match_pt,
      row.fit_why_en,
      row.fit_why_pt,
      row.notes_en,
      row.notes_pt,
      row.home_office,
      row.id,
    ]
      .map(cell)
      .join("\n")
      .toLowerCase();
  }

  function companyGeo(row) {
    return window.CountryFlags.resolveCountries(
      row.region_en,
      row.region_pt,
      row.city_en,
      row.city_pt,
      row.notes_en,
      row.notes_pt,
      row.category_en,
    );
  }

  function matchesGeo(row) {
    if (!geoFilter) return true;
    const geo = companyGeo(row);
    if (geoFilter === "br") return geo.primary === "br" || geo.brazilPresence;
    if (geoFilter === "br_industry") return geo.brazilIndustry;
    if (geoFilter === "intl") return geo.primary && geo.primary !== "br";
    if (geoFilter === "near_home") return geo.nearHome;
    return true;
  }

  function homeOfficeValue(row) {
    const v = cell(row.home_office).toLowerCase();
    return HOME_OFFICE_OPTIONS.includes(v) ? v : "unknown";
  }

  function acceptsHomeOffice(row) {
    return homeOfficeValue(row) === "yes" || homeOfficeValue(row) === "hybrid";
  }

  function homeOfficeLabel(value) {
    if (value === "yes") return "Home office";
    if (value === "hybrid") return "Hybrid HO";
    if (value === "no") return "Onsite";
    return "";
  }

  function appendCareerLinks(parent, row, opts = {}) {
    const careers = cell(row.careers_url);
    const website = cell(row.website);
    const atsUrl = cell(row.ats_url);
    const atsName = cell(row.ats_name);
    const stop = !!opts.stopPropagation;
    const links = document.createElement("div");
    links.className = "portal-direct-links";

    const addLink = (href, text, className, title) => {
      if (!href) return;
      const a = document.createElement("a");
      a.className = className;
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = text;
      a.title = title || href;
      if (stop) a.addEventListener("click", (e) => e.stopPropagation());
      links.append(a);
    };

    if (careers) {
      addLink(careers, "Careers", "portal-direct-link", careers);
    } else if (website) {
      addLink(website, "Website", "portal-direct-link", website);
    }

    if (atsUrl) {
      const same =
        careers && atsUrl.replace(/\/$/, "") === careers.replace(/\/$/, "");
      addLink(
        atsUrl,
        same
          ? atsName
            ? `Apply · ${atsName}`
            : "Apply board"
          : `Board · ${atsName || "ATS"}`,
        "portal-direct-link portal-direct-link-ats",
        atsUrl,
      );
    }

    if (links.childNodes.length) parent.append(links);
    return links;
  }

  function primaryCareersUrl(row) {
    return (
      cell(row.careers_url) || cell(row.ats_url) || cell(row.website) || ""
    );
  }

  async function openUrlInNewWindow(url) {
    const href = cell(url);
    if (!href) return false;
    try {
      const res = await fetch("/api/open-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: href }),
      });
      if (res.ok) return true;
    } catch {
      /* fall through */
    }
    try {
      const win = window.open(
        href,
        "_blank",
        "noopener,noreferrer,width=1280,height=900",
      );
      if (win) {
        try {
          win.focus();
        } catch {
          /* ignore */
        }
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  }

  function focusedCompanyCard() {
    const el = document.activeElement;
    if (!el || !el.classList.contains("company-tile")) return null;
    const root = document.getElementById("companies-results");
    if (!root || !root.contains(el)) return null;
    return el;
  }

  async function openFocusedCompanyPortal() {
    const card = focusedCompanyCard();
    if (!card) return false;
    const href = cell(card.dataset.url);
    if (!href) {
      setSaveStatus("No careers / portal URL for this company", "err");
      return true;
    }
    const ok = await openUrlInNewWindow(href);
    if (!ok) setSaveStatus("Could not open careers URL", "err");
    return true;
  }

  function pinTargetCompany() {
    if (openCompanyId) {
      return companies.find((c) => c.id === openCompanyId) || null;
    }
    const card = focusedCompanyCard();
    if (!card) return null;
    return companies.find((c) => c.id === card.dataset.id) || null;
  }

  function pinFocusedCompany() {
    const row = pinTargetCompany();
    if (!row) {
      setSaveStatus("Focus a company card (or open its dossier) to pin", "err");
      return false;
    }
    togglePinned(row);
    const name = cell(row.name_en) || row.id;
    setSaveStatus(
      isPinned(row) ? `Pinned: ${name}` : `Unpinned: ${name}`,
      "ok",
    );
    return true;
  }

  function appendHomeOfficeFlag(parent, row) {
    const value = homeOfficeValue(row);
    const label = homeOfficeLabel(value);
    if (!label) return null;
    const el = document.createElement("span");
    el.className =
      "home-office-flag" +
      (value === "yes"
        ? " is-yes"
        : value === "hybrid"
          ? " is-hybrid"
          : " is-no");
    el.textContent = label;
    el.title =
      value === "yes"
        ? "Normally accepts home office / remote"
        : value === "hybrid"
          ? "Hybrid or remote by team/role"
          : "Typically onsite / limited remote";
    parent.append(el);
    return el;
  }

  function growthValue(row) {
    const v = cell(row.growth).toLowerCase();
    return GROWTH_OPTIONS.includes(v) ? v : "unknown";
  }

  function appendGrowthFlag(parent, row) {
    if (growthValue(row) !== "high") return null;
    const el = document.createElement("span");
    el.className = "growth-tag";
    el.title =
      "Strong recent growth (revenue, hiring, or capex) based on 2025–2026 public signals";
    const img = document.createElement("img");
    img.className = "flag-img flag-img-icon";
    img.src = "flags/growth.svg";
    img.alt = "";
    img.width = 12;
    img.height = 12;
    const label = document.createElement("span");
    label.className = "growth-label";
    label.textContent = "Growing";
    el.append(img, label);
    parent.append(el);
    return el;
  }

  function matchesHomeOffice(row) {
    if (!homeOfficeFilter) return true;
    if (homeOfficeFilter === "accepts") return acceptsHomeOffice(row);
    return homeOfficeValue(row) === homeOfficeFilter;
  }

  function matchesGrowth(row) {
    if (!growthFilter) return true;
    if (growthFilter === "high") return growthValue(row) === "high";
    if (growthFilter === "moderate") return growthValue(row) === "moderate";
    return growthValue(row) === growthFilter;
  }

  function isPinned(row) {
    const v = cell(row?.pinned).toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "y";
  }

  function pinRank(row) {
    return isPinned(row) ? 0 : 1;
  }

  function geoTrackValue(row) {
    return cell(row?.geo_track).trim().toLowerCase();
  }

  function geoTrackSortKey(row) {
    const t = geoTrackValue(row);
    if (t === "international") return 0;
    if (t === "regional") return 1;
    return 2;
  }

  function recRankNumber(row) {
    const n = Number(cell(row?.rec_rank));
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function recRankLabel(row) {
    const n = recRankNumber(row);
    if (n == null) return "";
    const t = geoTrackValue(row);
    if (t === "international") return `I-${n}`;
    if (t === "regional") return `L-${n}`;
    return `#${n}`;
  }

  function appendRecRankChip(parent, row) {
    const label = recRankLabel(row);
    if (!label) return null;
    const el = document.createElement("span");
    el.className =
      "company-chip company-chip-rec-rank" +
      (geoTrackValue(row) === "international"
        ? " is-intl"
        : geoTrackValue(row) === "regional"
          ? " is-regional"
          : "");
    el.textContent = label;
    el.title =
      geoTrackValue(row) === "international"
        ? `International recommendation #${recRankNumber(row)}`
        : geoTrackValue(row) === "regional"
          ? `Regional recommendation #${recRankNumber(row)}`
          : `Recommendation #${recRankNumber(row)}`;
    parent.append(el);
    return el;
  }

  function peersInTrack(track) {
    const t = cell(track).trim().toLowerCase();
    if (!t) return [];
    return companies
      .filter((c) => geoTrackValue(c) === t && recRankNumber(c) != null)
      .sort((a, b) => recRankNumber(a) - recRankNumber(b));
  }

  function moveRecRank(row, delta) {
    const track = geoTrackValue(row);
    const rank = recRankNumber(row);
    if (!track || rank == null) return false;
    const peers = peersInTrack(track);
    const idx = peers.findIndex((p) => p.id === row.id);
    if (idx < 0) return false;
    const other = peers[idx + delta];
    if (!other) return false;
    const otherRank = recRankNumber(other);
    row.rec_rank = String(otherRank);
    other.rec_rank = String(rank);
    setDirty(true);
    setSaveStatus(
      `${recRankLabel(row)} · ${cell(row.name_en) || row.id}`,
      "ok",
    );
    render();
    if (openCompanyId === row.id) fillModal();
    scrollCompanyCardIntoView(row.id);
    return true;
  }

  function appendRecRankControls(parent, row, { stopPropagation = true } = {}) {
    if (recRankNumber(row) == null || !geoTrackValue(row)) return null;
    const wrap = document.createElement("span");
    wrap.className = "rec-rank-controls";
    appendRecRankChip(wrap, row);
    const up = document.createElement("button");
    up.type = "button";
    up.className = "rec-rank-btn";
    up.textContent = "↑";
    up.title = "Move up in this track (higher priority)";
    up.addEventListener("click", (event) => {
      if (stopPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }
      moveRecRank(row, -1);
    });
    const down = document.createElement("button");
    down.type = "button";
    down.className = "rec-rank-btn";
    down.textContent = "↓";
    down.title = "Move down in this track (lower priority)";
    down.addEventListener("click", (event) => {
      if (stopPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }
      moveRecRank(row, 1);
    });
    wrap.append(up, down);
    parent.append(wrap);
    return wrap;
  }

  function scrollCompanyCardIntoView(id) {
    const sid = cell(id);
    if (!sid) return;
    requestAnimationFrame(() => {
      const card = document.querySelector(
        `#companies-results .company-tile[data-id="${CSS.escape(sid)}"]`,
      );
      card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function togglePinned(row, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    row.pinned = isPinned(row) ? "" : "1";
    setDirty(true);
    setSaveStatus("");
    render();
    if (openCompanyId === row.id) fillModal();
    if (isPinned(row)) scrollCompanyCardIntoView(row.id);
  }

  function appendPinControl(parent, row, { stopPropagation = true } = {}) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin-btn" + (isPinned(row) ? " is-on" : "");
    btn.setAttribute("aria-pressed", isPinned(row) ? "true" : "false");
    btn.title = isPinned(row) ? "Unpin from top (Alt+M)" : "Pin to top (Alt+M)";
    btn.textContent = isPinned(row) ? "Pinned" : "Pin";
    btn.addEventListener("click", (event) => {
      if (stopPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }
      togglePinned(row, event);
    });
    parent.append(btn);
    return btn;
  }

  function matchesTrack(row) {
    if (!trackFilter) return true;
    if (trackFilter === "other") {
      const t = geoTrackValue(row);
      return t !== "international" && t !== "regional";
    }
    return geoTrackValue(row) === trackFilter;
  }

  function filteredRows() {
    let rows = companies.slice();
    if (categoryFilter) {
      rows = rows.filter((r) => cell(r.category_en).trim() === categoryFilter);
    }
    rows = rows.filter(matchesRole);
    rows = rows.filter(matchesGeo);
    rows = rows.filter(matchesTrack);
    rows = rows.filter(matchesHomeOffice);
    rows = rows.filter(matchesGrowth);
    const q = query.trim().toLowerCase();
    if (q) {
      const parts = q.split(/\s+/).filter(Boolean);
      rows = rows.filter((r) => {
        const h = haystack(r);
        return parts.every((p) => h.includes(p));
      });
    }
    rows.sort((a, b) => {
      const pr = pinRank(a) - pinRank(b);
      if (pr) return pr;
      const tr = geoTrackSortKey(a) - geoTrackSortKey(b);
      if (tr) return tr;
      const ra = recRankNumber(a);
      const rb = recRankNumber(b);
      if (ra != null && rb != null && ra !== rb) return ra - rb;
      if (ra != null && rb == null) return -1;
      if (ra == null && rb != null) return 1;
      const so =
        Number(cell(a.sort_order) || 0) - Number(cell(b.sort_order) || 0);
      if (so) return so;
      return cell(a.name_en).localeCompare(cell(b.name_en));
    });
    return rows;
  }

  function categories() {
    const seen = new Map();
    for (const row of companies) {
      const key = cell(row.category_en).trim();
      if (!key) continue;
      if (!seen.has(key)) {
        seen.set(key, {
          en: key,
          pt: cell(row.category_pt).trim() || key,
        });
      }
    }
    return [...seen.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }

  function makeChip(chip, activeKey, onSelect) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "filter-chip" + (activeKey === chip.key ? " is-active" : "");
    btn.setAttribute("aria-pressed", activeKey === chip.key ? "true" : "false");
    btn.textContent = getLangMode() === "pt" ? chip.pt || chip.en : chip.en;
    btn.addEventListener("click", () => onSelect(chip.key));
    return btn;
  }

  function appendEn(parent, text, className) {
    const wrap = document.createElement("div");
    if (className) wrap.className = className;
    wrap.textContent = text || "";
    parent.append(wrap);
    return wrap;
  }

  /** Content values only — EN/PT spans switched by CSS lang mode. */
  function appendValues(parent, enText, ptText, className) {
    const wrap = document.createElement("div");
    if (className) wrap.className = className;
    const en = document.createElement("span");
    en.className = "panel-heading-en";
    en.textContent = enText || "";
    const pt = document.createElement("span");
    pt.className = "panel-heading-pt";
    pt.textContent = ptText || enText || "";
    wrap.append(en, pt);
    parent.append(wrap);
    return wrap;
  }

  function renderFilters() {
    const root = document.getElementById("companies-filters");
    if (!root) return;
    root.replaceChildren();

    const catRow = document.createElement("div");
    catRow.className = "company-filter-row";
    const catLabel = document.createElement("span");
    catLabel.className = "company-filter-label";
    appendEn(catLabel, "Category");
    catRow.append(catLabel);
    const catChips = [{ key: "", en: "All", pt: "All" }].concat(
      categories().map(([key, labels]) => ({
        key,
        en: labels.en,
        pt: labels.pt,
      })),
    );
    for (const chip of catChips) {
      catRow.append(
        makeChip(chip, categoryFilter, (key) => {
          categoryFilter = key;
          render();
        }),
      );
    }
    root.append(catRow);

    const roleRow = document.createElement("div");
    roleRow.className = "company-filter-row";
    const roleLabel = document.createElement("span");
    roleLabel.className = "company-filter-label";
    appendEn(roleLabel, "Career path");
    roleRow.append(roleLabel);
    const roleChips = [
      { key: "", en: "All paths", pt: "All paths" },
      { key: "da", en: "Data Analyst", pt: "Data Analyst" },
      { key: "po", en: "Product Owner", pt: "Product Owner" },
      {
        key: "dsa",
        en: "Digital Solution Architect",
        pt: "Digital Solution Architect",
      },
      { key: "multi", en: "Multi-role", pt: "Multi-role" },
    ];
    for (const chip of roleChips) {
      roleRow.append(
        makeChip(chip, roleFilter, (key) => {
          roleFilter = key;
          render();
        }),
      );
    }
    root.append(roleRow);

    const trackRow = document.createElement("div");
    trackRow.className = "company-filter-row";
    const trackLabel = document.createElement("span");
    trackLabel.className = "company-filter-label";
    appendEn(trackLabel, "Rec track");
    trackRow.append(trackLabel);
    for (const chip of [
      { key: "", en: "All" },
      { key: "international", en: "International (I-n)" },
      { key: "regional", en: "Regional (L-n)" },
      { key: "other", en: "Unranked" },
    ]) {
      trackRow.append(
        makeChip(chip, trackFilter, (key) => {
          trackFilter = key;
          render();
        }),
      );
    }
    root.append(trackRow);

    const geoRow = document.createElement("div");
    geoRow.className = "company-filter-row";
    const geoLabel = document.createElement("span");
    geoLabel.className = "company-filter-label";
    appendEn(geoLabel, "Country");
    geoRow.append(geoLabel);
    for (const chip of [
      { key: "", en: "All" },
      { key: "near_home", en: "Near home (Campinas)" },
      { key: "br", en: "Brazil" },
      { key: "br_industry", en: "BR industry (foreign HQ)" },
      { key: "intl", en: "International HQ" },
    ]) {
      geoRow.append(
        makeChip(chip, geoFilter, (key) => {
          geoFilter = key;
          render();
        }),
      );
    }
    root.append(geoRow);

    const hoRow = document.createElement("div");
    hoRow.className = "company-filter-row";
    const hoLabel = document.createElement("span");
    hoLabel.className = "company-filter-label";
    appendEn(hoLabel, "Home office");
    hoRow.append(hoLabel);
    for (const chip of [
      { key: "", en: "All" },
      { key: "accepts", en: "Accepts HO" },
      { key: "yes", en: "Remote / HO" },
      { key: "hybrid", en: "Hybrid" },
      { key: "no", en: "Onsite" },
      { key: "unknown", en: "Unknown" },
    ]) {
      hoRow.append(
        makeChip(chip, homeOfficeFilter, (key) => {
          homeOfficeFilter = key;
          render();
        }),
      );
    }
    root.append(hoRow);

    const growthRow = document.createElement("div");
    growthRow.className = "company-filter-row";
    const growthLabel = document.createElement("span");
    growthLabel.className = "company-filter-label";
    appendEn(growthLabel, "Growth");
    growthRow.append(growthLabel);
    for (const chip of [
      { key: "", en: "All" },
      { key: "high", en: "Growing" },
      { key: "moderate", en: "Steady" },
      { key: "unknown", en: "Unknown" },
    ]) {
      growthRow.append(
        makeChip(chip, growthFilter, (key) => {
          growthFilter = key;
          render();
        }),
      );
    }
    root.append(growthRow);
  }

  function tileSpanClass(row) {
    const multi = roleCount(row) >= 2;
    const high = cell(row.priority).toLowerCase() === "high";
    return multi || high ? " company-tile-wide" : "";
  }

  function renderTile(row) {
    const portalUrl = primaryCareersUrl(row);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "company-tile" +
      tileSpanClass(row) +
      (isPinned(row) ? " is-pinned" : "") +
      (openCompanyId === row.id ? " is-active" : "");
    btn.dataset.id = row.id;
    btn.dataset.url = portalUrl;
    btn.title = portalUrl
      ? "Click to edit · Ctrl/Cmd+click or Ctrl+Enter to open careers"
      : "Click to edit";
    btn.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        if (portalUrl) void openUrlInNewWindow(portalUrl);
        else setSaveStatus("No careers / portal URL for this company", "err");
        return;
      }
      openModal(row.id);
    });

    const title = document.createElement("div");
    title.className = "company-tile-title";
    appendValues(
      title,
      cell(row.name_en) || row.id,
      cell(row.name_pt) || cell(row.name_en) || row.id,
    );

    const geo = companyGeo(row);
    const flagTitle = window.CountryFlags.prependFlags(btn, title, geo);
    const flagRow = flagTitle.querySelector(".country-flags");
    if (flagRow) {
      appendHomeOfficeFlag(flagRow, row);
      appendGrowthFlag(flagRow, row);
    } else {
      const wrap = document.createElement("div");
      wrap.className = "country-flags";
      appendHomeOfficeFlag(wrap, row);
      appendGrowthFlag(wrap, row);
      if (wrap.childNodes.length) flagTitle.insertBefore(wrap, title);
    }

    const meta = document.createElement("div");
    meta.className = "company-tile-meta";
    appendValues(
      meta,
      [cell(row.city_en), cell(row.category_en)].filter(Boolean).join(" · "),
      [
        cell(row.city_pt) || cell(row.city_en),
        cell(row.category_pt) || cell(row.category_en),
      ]
        .filter(Boolean)
        .join(" · "),
    );

    const chips = document.createElement("div");
    chips.className = "company-tile-chips";
    appendPinControl(chips, row);
    appendRecRankControls(chips, row);
    if (row.priority) {
      const p = document.createElement("span");
      p.className = "company-chip company-chip-priority";
      p.textContent = row.priority;
      chips.append(p);
    }
    if (row.status) {
      const s = document.createElement("span");
      s.className = "company-chip";
      s.textContent = row.status;
      chips.append(s);
    }

    const badges = document.createElement("div");
    badges.className = "role-badges";
    for (const fit of FIT_FIELDS) {
      const on = isFitYes(row[fit.field]);
      const badge = document.createElement("span");
      badge.className = "role-badge" + (on ? " is-on" : " is-off");
      badge.textContent = fit.short;
      badge.title = fit.en;
      badges.append(badge);
    }
    const rc = roleCount(row);
    if (rc >= 2) {
      const multi = document.createElement("span");
      multi.className = "role-badge role-badge-multi is-on";
      multi.textContent = `Multi (${rc})`;
      badges.append(multi);
    }

    btn.append(meta, chips, badges);
    appendCareerLinks(btn, row, { stopPropagation: true });
    return btn;
  }

  function renderResults() {
    const root = document.getElementById("companies-results");
    const countEl = document.getElementById("company-result-count");
    if (!root) return;
    root.replaceChildren();
    const rows = filteredRows();
    if (countEl) {
      countEl.replaceChildren();
      countEl.textContent = `${rows.length} compan${rows.length === 1 ? "y" : "ies"}`;
    }
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state company-bento-empty";
      empty.textContent = "No companies match this search.";
      root.append(empty);
      return;
    }
    for (const row of rows) root.append(renderTile(row));
  }

  function currentOpenRow() {
    return companies.find((r) => r.id === openCompanyId) || null;
  }

  function openModal(id) {
    openCompanyId = id;
    const dialog = document.getElementById("company-modal");
    fillModal();
    if (dialog && typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    }
    renderResults();
  }

  function closeModal() {
    openCompanyId = "";
    const dialog = document.getElementById("company-modal");
    if (dialog && dialog.open) dialog.close();
    renderResults();
  }

  function fillModal() {
    const row = currentOpenRow();
    const titleEl = document.getElementById("company-modal-title");
    const body = document.getElementById("company-modal-body");
    if (!titleEl || !body) return;
    titleEl.replaceChildren();
    body.replaceChildren();
    if (!row) return;

    appendValues(
      titleEl,
      cell(row.name_en) || row.id,
      cell(row.name_pt) || cell(row.name_en) || row.id,
    );

    const geo = companyGeo(row);
    const flagRow = window.CountryFlags.renderFlagRow(geo);
    flagRow.classList.add("country-flags-modal");
    appendHomeOfficeFlag(flagRow, row);
    appendGrowthFlag(flagRow, row);
    body.append(flagRow);

    const rankChipRow = document.createElement("div");
    rankChipRow.className = "company-tile-chips company-modal-pin";
    appendRecRankControls(rankChipRow, row, { stopPropagation: false });
    if (rankChipRow.childNodes.length) body.append(rankChipRow);

    const badges = document.createElement("div");
    badges.className = "role-badges company-modal-badges";
    for (const fit of FIT_FIELDS) {
      const on = isFitYes(row[fit.field]);
      const badge = document.createElement("span");
      badge.className = "role-badge" + (on ? " is-on" : " is-off");
      badge.textContent = `${fit.short}: ${on ? "yes" : "no"}`;
      badge.title = fit.en;
      badges.append(badge);
    }
    if (roleCount(row) >= 2) {
      const multi = document.createElement("span");
      multi.className = "role-badge role-badge-multi is-on";
      multi.textContent = `Multi (${roleCount(row)})`;
      badges.append(multi);
    }
    body.append(badges);

    const pinRow = document.createElement("div");
    pinRow.className = "company-tile-chips company-modal-pin";
    appendPinControl(pinRow, row, { stopPropagation: false });
    body.append(pinRow);

    const facts = document.createElement("div");
    facts.className = "company-modal-facts";
    const factPairs = [
      {
        labelEn: "Category",
        labelPt: "Categoria",
        en: cell(row.category_en),
        pt: cell(row.category_pt) || cell(row.category_en),
      },
      {
        labelEn: "City",
        labelPt: "Cidade",
        en: cell(row.city_en),
        pt: cell(row.city_pt) || cell(row.city_en),
      },
      {
        labelEn: "Region",
        labelPt: "Região",
        en: cell(row.region_en),
        pt: cell(row.region_pt) || cell(row.region_en),
      },
    ];
    for (const fact of factPairs) {
      if (!fact.en && !fact.pt) continue;
      const block = document.createElement("div");
      block.className = "company-modal-fact";
      const lab = document.createElement("div");
      lab.className = "company-research-label";
      appendEn(lab, fact.labelEn);
      const val = document.createElement("div");
      val.className = "company-modal-fact-value";
      appendValues(val, fact.en, fact.pt);
      block.append(lab, val);
      facts.append(block);
    }
    body.append(facts);

    if (row.website) {
      const link = document.createElement("a");
      link.className = "company-result-link";
      link.href = row.website;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Website: " + row.website;
      body.append(link);
    }

    appendCareerLinks(body, row);

    const atsKind = cell(row.ats_kind).toLowerCase();
    if (atsKind || cell(row.ats_name)) {
      const ats = document.createElement("div");
      ats.className = "company-tile-meta";
      if (atsKind === "third_party") {
        ats.textContent = cell(row.ats_name)
          ? `[Third-Party ATS] ${cell(row.ats_name)}`
          : "[Third-Party ATS]";
      } else if (atsKind === "proprietary") {
        ats.textContent = cell(row.ats_name)
          ? `[Proprietary] ${cell(row.ats_name)}`
          : "[Proprietary System]";
      } else {
        ats.textContent = "[Unknown]";
      }
      body.append(ats);
    }

    const skillsEn = cell(row.skills_match_en);
    const skillsPt = cell(row.skills_match_pt) || skillsEn;
    const skillsRaw =
      getLangMode() === "pt"
        ? skillsPt
        : getLangMode() === "en"
          ? skillsEn || skillsPt
          : skillsEn || skillsPt;
    const skills = skillsRaw
      .split(/[;|,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (skills.length) {
      const skillsBlock = document.createElement("div");
      skillsBlock.className = "company-skills";
      const lab = document.createElement("div");
      lab.className = "company-research-label";
      appendEn(lab, "Matching skills");
      const pills = document.createElement("div");
      pills.className = "skill-pills";
      for (const s of skills) {
        const pill = document.createElement("span");
        pill.className = "skill-pill";
        pill.textContent = s;
        pills.append(pill);
      }
      skillsBlock.append(lab, pills);
      body.append(skillsBlock);
    }

    const whyEn = cell(row.fit_why_en);
    const whyPt = cell(row.fit_why_pt) || whyEn;
    if (whyEn || whyPt) {
      const whyBlock = document.createElement("div");
      whyBlock.className = "company-fit-why";
      const lab = document.createElement("div");
      lab.className = "company-research-label";
      appendEn(lab, "Why this path fits");
      whyBlock.append(lab);
      if (getLangMode() === "both") {
        const cols = document.createElement("div");
        cols.className = "company-modal-bilingual";
        for (const side of [
          { tag: "EN", text: whyEn },
          { tag: "PT", text: whyPt },
        ]) {
          const p = document.createElement("p");
          p.className = "company-fit-why-text";
          const tag = document.createElement("span");
          tag.className = "profile-summary-lang";
          tag.textContent = side.tag;
          const txt = document.createElement("span");
          txt.textContent = side.text;
          p.append(tag, document.createElement("br"), txt);
          cols.append(p);
        }
        whyBlock.append(cols);
      } else {
        const p = document.createElement("p");
        p.className = "company-fit-why-text";
        p.textContent = getLangMode() === "pt" ? whyPt : whyEn;
        whyBlock.append(p);
      }
      body.append(whyBlock);
    }

    const editRow = document.createElement("div");
    editRow.className = "company-result-edit";
    for (const field of [
      { key: "status", labelEn: "Status", labelPt: "Status" },
      { key: "priority", labelEn: "Priority", labelPt: "Priority" },
    ]) {
      const label = document.createElement("label");
      label.className = "company-edit-field";
      const lab = document.createElement("span");
      appendEn(lab, field.labelEn);
      const input = document.createElement("input");
      input.className = "field-input";
      input.value = cell(row[field.key]);
      input.addEventListener("input", () => {
        row[field.key] = input.value;
        setDirty(true);
        setSaveStatus("");
        renderResults();
      });
      label.append(lab, input);
      editRow.append(label);
    }
    const pinLabel = document.createElement("label");
    pinLabel.className = "company-edit-field";
    const pinLab = document.createElement("span");
    appendEn(pinLab, "Pinned");
    const pinSelect = document.createElement("select");
    pinSelect.className = "field-input";
    for (const opt of [
      { value: "", label: "No" },
      { value: "1", label: "Yes — keep on top" },
    ]) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if ((isPinned(row) ? "1" : "") === opt.value) o.selected = true;
      pinSelect.append(o);
    }
    pinSelect.addEventListener("change", () => {
      row.pinned = pinSelect.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
      fillModal();
    });
    pinLabel.append(pinLab, pinSelect);
    editRow.append(pinLabel);

    const trackLabel = document.createElement("label");
    trackLabel.className = "company-edit-field";
    const trackLab = document.createElement("span");
    appendEn(trackLab, "Rec track");
    const trackSelect = document.createElement("select");
    trackSelect.className = "field-input";
    for (const opt of [
      { value: "", label: "(none)" },
      { value: "international", label: "International" },
      { value: "regional", label: "Regional" },
    ]) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (geoTrackValue(row) === opt.value) o.selected = true;
      trackSelect.append(o);
    }
    trackSelect.addEventListener("change", () => {
      row.geo_track = trackSelect.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
      fillModal();
    });
    trackLabel.append(trackLab, trackSelect);
    editRow.append(trackLabel);

    const rankLabel = document.createElement("label");
    rankLabel.className = "company-edit-field";
    const rankLab = document.createElement("span");
    appendEn(rankLab, "Rec rank");
    const rankInput = document.createElement("input");
    rankInput.className = "field-input";
    rankInput.type = "number";
    rankInput.min = "1";
    rankInput.step = "1";
    rankInput.placeholder = "1…";
    rankInput.value = cell(row.rec_rank);
    rankInput.addEventListener("input", () => {
      row.rec_rank = rankInput.value.trim();
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    rankLabel.append(rankLab, rankInput);
    editRow.append(rankLabel);

    const hoLabel = document.createElement("label");
    hoLabel.className = "company-edit-field";
    const hoLab = document.createElement("span");
    appendEn(hoLab, "Home office");
    const hoSelect = document.createElement("select");
    hoSelect.className = "field-input";
    for (const opt of HOME_OFFICE_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (homeOfficeValue(row) === opt) o.selected = true;
      hoSelect.append(o);
    }
    hoSelect.addEventListener("change", () => {
      row.home_office = hoSelect.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    hoLabel.append(hoLab, hoSelect);
    editRow.append(hoLabel);

    const growthLabel = document.createElement("label");
    growthLabel.className = "company-edit-field";
    const growthLab = document.createElement("span");
    appendEn(growthLab, "Growth");
    const growthSelect = document.createElement("select");
    growthSelect.className = "field-input";
    for (const opt of GROWTH_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (growthValue(row) === opt) o.selected = true;
      growthSelect.append(o);
    }
    growthSelect.addEventListener("change", () => {
      row.growth = growthSelect.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    growthLabel.append(growthLab, growthSelect);
    editRow.append(growthLabel);
    body.append(editRow);

    const notesBlock = document.createElement("div");
    notesBlock.className = "company-modal-notes";
    if (getLangMode() === "both") {
      for (const side of [
        { key: "notes_en", tag: "EN" },
        { key: "notes_pt", tag: "PT" },
      ]) {
        const label = document.createElement("label");
        label.className = "company-edit-field";
        const lab = document.createElement("span");
        lab.className = "profile-summary-lang";
        lab.textContent = side.tag + " notes";
        const ta = document.createElement("textarea");
        ta.className = "field-input tall";
        ta.rows = 4;
        ta.value = cell(row[side.key]);
        ta.addEventListener("input", () => {
          row[side.key] = ta.value;
          setDirty(true);
          setSaveStatus("");
        });
        label.append(lab, ta);
        notesBlock.append(label);
      }
    } else {
      const key = getLangMode() === "pt" ? "notes_pt" : "notes_en";
      const label = document.createElement("label");
      label.className = "company-edit-field";
      const lab = document.createElement("span");
      appendEn(lab, "Notes");
      const ta = document.createElement("textarea");
      ta.className = "field-input tall";
      ta.rows = 4;
      ta.value =
        getLangMode() === "pt"
          ? cell(row.notes_pt) || cell(row.notes_en)
          : cell(row.notes_en);
      ta.addEventListener("input", () => {
        row[key] = ta.value;
        setDirty(true);
        setSaveStatus("");
      });
      label.append(lab, ta);
      notesBlock.append(label);
    }
    body.append(notesBlock);

    // Fit toggles for search curation
    const fitEdit = document.createElement("div");
    fitEdit.className = "company-modal-fits";
    const fitLab = document.createElement("div");
    fitLab.className = "company-research-label";
    appendEn(fitLab, "Path fit (yes/no)");
    fitEdit.append(fitLab);
    const fitRow = document.createElement("div");
    fitRow.className = "company-result-edit";
    for (const fit of FIT_FIELDS) {
      const label = document.createElement("label");
      label.className = "company-edit-field";
      const lab = document.createElement("span");
      lab.textContent = fit.short;
      const input = document.createElement("input");
      input.className = "field-input";
      input.value = cell(row[fit.field]) || "no";
      input.addEventListener("input", () => {
        row[fit.field] = input.value;
        setDirty(true);
        setSaveStatus("");
        fillModal();
        renderResults();
      });
      label.append(lab, input);
      fitRow.append(label);
    }
    fitEdit.append(fitRow);
    body.append(fitEdit);

    const actions = document.createElement("div");
    actions.className = "job-modal-actions";
    const done = document.createElement("button");
    done.type = "button";
    done.className = "save-btn";
    done.textContent = "Done";
    done.title = "Close (Ctrl+Enter) — edits autosave";
    done.addEventListener("click", () => void doneModal());
    const del = document.createElement("button");
    del.type = "button";
    del.className = "panel-delete";
    del.textContent = "Delete company";
    del.title = "Delete company (Shift+Delete)";
    del.addEventListener("click", () => deleteCompany(row.id));
    actions.append(done, del);
    body.append(actions);
  }

  function addCompany() {
    const row = blankCompany();
    companies.push(row);
    categoryFilter = "";
    roleFilter = "";
    geoFilter = "";
    trackFilter = "";
    homeOfficeFilter = "";
    growthFilter = "";
    query = "";
    const search = searchInputEl();
    if (search) search.value = "";
    hideSearchBar({ focusCard: false });
    setDirty(true);
    setSaveStatus("");
    render();
    openModal(row.id);
    return row;
  }

  function deleteCompany(id, { confirmDelete = true } = {}) {
    if (!id) return false;
    if (confirmDelete && !confirm("Delete this company?")) return false;
    const idx = companies.findIndex((c) => c.id === id);
    if (idx < 0) return false;
    companies.splice(idx, 1);
    if (openCompanyId === id) closeModal();
    setDirty(true);
    setSaveStatus("");
    render();
    return true;
  }

  function render() {
    renderFilters();
    renderResults();
  }

  function blankCompany() {
    const id = `companies-${Date.now()}`;
    return {
      id,
      sort_order: String(companies.length + 1),
      pinned: "",
      geo_track: "",
      rec_rank: "",
      category_en: "",
      category_detail_en: "",
      category_pt: "",
      category_detail_pt: "",
      name_en: "New company",
      name_detail_en: "New company",
      name_pt: "Nova empresa",
      name_detail_pt: "Nova empresa",
      city_en: "",
      city_detail_en: "",
      city_pt: "",
      city_detail_pt: "",
      region_en: "",
      region_detail_en: "",
      region_pt: "",
      region_detail_pt: "",
      priority: "medium",
      status: "researching",
      home_office: "unknown",
      growth: "unknown",
      fit_data_analyst: "yes",
      fit_product_owner: "no",
      fit_digital_solution_architect: "no",
      website: "",
      careers_url: "",
      ats_kind: "proprietary",
      ats_name: "",
      ats_url: "",
      skills_match_en: "",
      skills_match_detail_en: "",
      skills_match_pt: "",
      skills_match_detail_pt: "",
      fit_why_en: "",
      fit_why_detail_en: "",
      fit_why_pt: "",
      fit_why_detail_pt: "",
      notes_en: "",
      notes_detail_en: "",
      notes_pt: "",
      notes_detail_pt: "",
    };
  }

  async function loadState() {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error(`GET /api/state failed (${res.status})`);
    const payload = await res.json();
    collections = payload.collections || {};
    companies = Array.isArray(collections.companies)
      ? collections.companies.map((row) => ({ ...row }))
      : [];
    collections.companies = companies;
  }

  async function saveAll() {
    if (saving) return false;
    if (!dirty) return true;
    const gen = saveGeneration;
    saving = true;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    setSaveStatus("Saving…");
    try {
      syncCollectionsForSave();
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.ok === false) {
        throw new Error(payload.error || `HTTP ${res.status}`);
      }
      if (saveGeneration === gen) {
        dirty = false;
        document.body.classList.remove("is-dirty");
      }
      setSaveStatus("Saved.", "ok");
      return true;
    } catch (err) {
      setSaveStatus("Error: " + (err.message || String(err)), "err");
      return false;
    } finally {
      saving = false;
      if (dirty) scheduleSave();
    }
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    );
  }

  function initKeyboard() {
    document.addEventListener("keydown", (event) => {
      const mod = event.ctrlKey || event.metaKey;
      const typing = isTypingTarget(document.activeElement);
      const dialog = document.getElementById("company-modal");
      const modalOpen = !!(dialog && dialog.open);

      if (mod && !event.altKey && event.key === "Enter") {
        event.preventDefault();
        if (modalOpen) {
          void doneModal();
          return;
        }
        void openFocusedCompanyPortal();
        return;
      }

      if (
        modalOpen &&
        event.shiftKey &&
        !mod &&
        !event.altKey &&
        (event.key === "Delete" || event.code === "Delete")
      ) {
        event.preventDefault();
        deleteCompany(openCompanyId);
        return;
      }

      // Add new company — Shift+N
      if (
        !modalOpen &&
        !typing &&
        !mod &&
        !event.altKey &&
        event.shiftKey &&
        event.code === "KeyN"
      ) {
        event.preventDefault();
        event.stopPropagation();
        addCompany();
        return;
      }

      if (event.altKey && !mod && !event.shiftKey) {
        const isS =
          event.code === "KeyS" || (event.key || "").toLowerCase() === "s";
        if (isS) {
          event.preventDefault();
          event.stopPropagation();
          toggleSearchBar();
          return;
        }
        const isF =
          event.code === "KeyF" || (event.key || "").toLowerCase() === "f";
        if (isF) {
          event.preventDefault();
          event.stopPropagation();
          window.CardNav?.toggleCardsFilters(
            CARD_SEL,
            FILTER_SEL,
            "#company-modal[open] .field-input, #company-modal[open] select.field-input, #company-modal[open] textarea.field-input",
          );
          return;
        }
        const isM =
          event.code === "KeyM" || (event.key || "").toLowerCase() === "m";
        if (isM && !typing) {
          event.preventDefault();
          event.stopPropagation();
          pinFocusedCompany();
          return;
        }
        if (
          !typing &&
          (event.key === "ArrowUp" ||
            event.code === "ArrowUp" ||
            event.key === "ArrowDown" ||
            event.code === "ArrowDown")
        ) {
          const row =
            (openCompanyId && companies.find((c) => c.id === openCompanyId)) ||
            (() => {
              const card = focusedCompanyCard();
              return card
                ? companies.find((c) => c.id === card.dataset.id)
                : null;
            })();
          if (row && recRankNumber(row) != null) {
            event.preventDefault();
            event.stopPropagation();
            moveRecRank(
              row,
              event.key === "ArrowUp" || event.code === "ArrowUp" ? -1 : 1,
            );
            return;
          }
        }
      }
      if (event.key === "Escape") {
        if (modalOpen) {
          closeModal();
          return;
        }
        if (isSearchBarOpen() && (query || "").trim()) {
          event.preventDefault();
          query = "";
          const search = searchInputEl();
          if (search) search.value = "";
          dismissSearchBar();
          renderResults();
          return;
        }
        if (isSearchBarOpen()) {
          event.preventDefault();
          dismissSearchBar();
          return;
        }
        if (hasActiveCompanyFilters()) {
          event.preventDefault();
          clearCompanyFilters();
          return;
        }
        event.preventDefault();
        openJobsWindow();
        return;
      }

      if (
        !modalOpen &&
        !typing &&
        !mod &&
        !event.altKey &&
        (event.key === "ArrowRight" ||
          event.key === "ArrowDown" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowUp")
      ) {
        const delta =
          event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
        if (moveCardFocus(delta)) {
          event.preventDefault();
          return;
        }
      }

      if (
        !modalOpen &&
        !typing &&
        window.CardNav?.isJumpKey(event) &&
        window.CardNav.jumpInContext(CARD_SEL, FILTER_SEL, event.key)
      ) {
        event.preventDefault();
        return;
      }

      if (
        !event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        typing
      ) {
        return;
      }
      if (event.code === "Digit1") {
        event.preventDefault();
        setLangMode("pt");
        return;
      }
      if (event.code === "Digit2") {
        event.preventDefault();
        setLangMode("en");
        return;
      }
      if (event.code === "Digit0") {
        event.preventDefault();
        setLangMode("both");
        return;
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        openProfileWindow();
        return;
      }
      if (event.key.toLowerCase() === "j") {
        event.preventDefault();
        openPortalsWindow();
        return;
      }
      if (event.key.toLowerCase() === "g" || event.code === "KeyG") {
        event.preventDefault();
        openJobsWindow();
        return;
      }
      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        location.assign("/help.html");
      }
    });
  }

  function initLangMode() {
    let mode = "both";
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "pt" || saved === "en" || saved === "both") mode = saved;
    } catch {
      /* ignore */
    }
    document.body.classList.remove("lang-pt", "lang-en");
    if (mode === "pt" || mode === "en") {
      document.body.classList.add(`lang-${mode}`);
    }
    try {
      localStorage.setItem(LANG_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = "en";
  }

  function wireModal() {
    const dialog = document.getElementById("company-modal");
    const closeBtn = document.getElementById("company-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal());
    if (dialog) {
      dialog.addEventListener("close", () => {
        openCompanyId = "";
        renderResults();
      });
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeModal();
      });
    }
  }

  async function init() {
    initLangMode();
    wireModal();
    const profileBtn = document.getElementById("open-profile-btn");
    if (profileBtn) {
      profileBtn.addEventListener("click", () => openProfileWindow());
    }
    const portalsBtn = document.getElementById("open-portals-btn");
    if (portalsBtn) {
      portalsBtn.addEventListener("click", () => openPortalsWindow());
    }
    const jobsBtn = document.getElementById("open-jobs-btn");
    if (jobsBtn) {
      jobsBtn.addEventListener("click", () => openJobsWindow());
    }
    document
      .getElementById("open-help-btn")
      ?.addEventListener("click", () => location.assign("/help.html"));
    const search = document.getElementById("company-search-input");
    if (search) {
      search.addEventListener("input", () => {
        query = search.value;
        renderResults();
        if ((search.value || "").trim()) showSearchBar();
      });
      search.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        dismissSearchBar();
      });
      search.addEventListener("blur", () => {
        if (!(search.value || "").trim()) hideSearchBar();
      });
    }
    const addBtn = document.getElementById("company-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => addCompany());
    }
    initKeyboard();
    window.addEventListener("beforeunload", () => {
      flushSaveKeepalive();
    });

    try {
      await loadState();
      render();
      setDirty(false);
      setSaveStatus("");
    } catch (err) {
      setSaveStatus("Load error: " + (err.message || String(err)), "err");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
