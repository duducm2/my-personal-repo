(() => {
  const LANG_KEY = "career-cockpit-lang";

  const FIT_FIELDS = [
    {
      key: "uxr",
      field: "fit_ux_researcher",
      en: "UX Researcher",
      pt: "UX Researcher",
      short: "UXR",
    },
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
  let openings = [];
  let lastOpeningByCompany = new Map();
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
  let daOpeningsFilter = "";
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
      daOpeningsFilter ||
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
    daOpeningsFilter = "";
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

  function urlEditField(row, key, label, opts = {}) {
    const wrap = document.createElement("label");
    wrap.className = "company-edit-field company-url-field";
    const lab = document.createElement("span");
    appendEn(lab, label);
    const line = document.createElement("div");
    line.className = "company-url-row";
    const input = document.createElement("input");
    input.className = "field-input";
    input.type = "url";
    input.spellcheck = false;
    input.autocomplete = "off";
    input.placeholder = opts.placeholder || "https://…";
    input.value = cell(row[key]);
    const open = document.createElement("a");
    open.className = "nav-btn company-url-open";
    open.textContent = "Open";
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    const syncOpen = () => {
      const href = cell(input.value);
      if (href) {
        open.href = href;
        open.hidden = false;
      } else {
        open.removeAttribute("href");
        open.hidden = true;
      }
    };
    syncOpen();
    input.addEventListener("input", () => {
      row[key] = input.value.trim();
      setDirty(true);
      setSaveStatus("");
      syncOpen();
      renderResults();
    });
    line.append(input, open);
    wrap.append(lab, line);
    if (opts.hint) {
      const hint = document.createElement("span");
      hint.className = "company-url-hint";
      hint.textContent = opts.hint;
      wrap.append(hint);
    }
    return wrap;
  }

  function primaryCareersUrl(row) {
    return (
      cell(row.careers_url) || cell(row.ats_url) || cell(row.website) || ""
    );
  }

  function openUrlInNewWindow(url) {
    const href = cell(url);
    if (!href) return false;

    // 1. Browser-native anchor click: immune to popup blockers during key/click gestures
    try {
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.append(a);
      a.click();
      a.remove();
      return true;
    } catch {
      /* fall through */
    }

    // 2. Direct window.open in the active browser tab
    try {
      const win = window.open(href, "_blank", "noopener,noreferrer");
      if (win) {
        try {
          win.focus();
        } catch {
          /* ignore */
        }
        return true;
      }
    } catch {
      /* fall through */
    }

    // 3. Last resort fallback to local server
    try {
      fetch("/api/open-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: href }),
      });
      return true;
    } catch {
      /* ignore */
    }
    return false;
  }

  function focusedCompanyCard() {
    const el = document.activeElement;
    const card = el?.closest?.("#companies-results .company-tile");
    if (card) return card;

    const hovered = window.CardNav?.getHoveredCard?.();
    if (hovered && hovered.closest?.("#companies-results")) {
      return hovered.closest(".company-tile");
    }

    try {
      const qHover = document.querySelector(
        "#companies-results .company-tile:hover",
      );
      if (qHover) return qHover;
    } catch {
      /* ignore */
    }

    const last = window.CardNav?.getLastCard?.();
    if (last && last.closest?.("#companies-results")) {
      return last.closest(".company-tile");
    }

    if (openCompanyId) {
      const openCard = document.querySelector(
        `#companies-results .company-tile[data-id="${CSS.escape(openCompanyId)}"]`,
      );
      if (openCard) return openCard;
    }

    return null;
  }

  function targetCompany() {
    if (openCompanyId) {
      return companies.find((c) => c.id === openCompanyId) || null;
    }
    const card = focusedCompanyCard();
    if (card?.dataset?.id) {
      return companies.find((c) => c.id === card.dataset.id) || null;
    }
    const activeTile = document.querySelector(
      "#companies-results .company-tile.is-active",
    );
    if (activeTile?.dataset?.id) {
      return companies.find((c) => c.id === activeTile.dataset.id) || null;
    }
    return null;
  }

  async function openFocusedCompanyPortal() {
    const card = focusedCompanyCard();
    const row = targetCompany();
    const href = card?.dataset?.url || (row ? primaryCareersUrl(row) : "");
    if (!href) {
      const name = row ? cell(row.name_en) || row.id : "this company";
      setSaveStatus(`No careers / portal URL for ${name}`, "err");
      return false;
    }
    if (openCompanyId) {
      await flushSave();
    }
    const ok = openUrlInNewWindow(href);
    if (!ok) {
      setSaveStatus("Could not open careers URL", "err");
      return false;
    }
    const name = row ? cell(row.name_en) || row.id : "";
    if (name) setSaveStatus(`Opened careers: ${name}`, "ok");
    return true;
  }

  function openCompanyOpeningsInCockpit(companyId) {
    const id = cell(companyId);
    if (!id) return;
    location.assign(`/jobs.html?company=${encodeURIComponent(id)}`);
  }

  function pinTargetCompany() {
    return targetCompany();
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
    const value = growthValue(row);
    if (value === "unknown") return null;
    const copy = {
      high: [
        "Growing",
        "Em crescimento",
        "Strong recent growth (revenue, hiring, or capex) based on 2025–2026 public signals",
      ],
      moderate: [
        "Steady",
        "Estável",
        "Established employer without a clear 2025–2026 expansion wave",
      ],
    };
    const spec = copy[value];
    if (!spec) return null;
    const [en, pt, title] = spec;
    const el = document.createElement("span");
    el.className = "growth-tag" + (value === "high" ? "" : " is-" + value);
    el.title = title;
    if (value === "high") {
      const img = document.createElement("img");
      img.className = "flag-img flag-img-icon";
      img.src = "flags/growth.svg";
      img.alt = "";
      img.width = 12;
      img.height = 12;
      el.append(img);
    }
    const label = document.createElement("span");
    label.className = "growth-label";
    label.textContent = getLangMode() === "pt" ? pt : en;
    el.append(label);
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

  const OPENING_MONTHS_EN = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const OPENING_MONTHS_PT = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  function indexLastOpenings() {
    const map = new Map();
    for (const opening of openings) {
      const key = cell(opening.company_key);
      const found = cell(opening.found_on);
      if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(found)) continue;
      const prev = map.get(key);
      if (!prev || found > prev) map.set(key, found);
    }
    lastOpeningByCompany = map;
  }

  function lastOpeningIso(row) {
    return lastOpeningByCompany.get(cell(row?.id)) || "";
  }

  function formatOpeningDate(iso) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!match) return null;
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return {
      en: `${day} ${OPENING_MONTHS_EN[month - 1]} ${match[1]}`,
      pt: `${day} ${OPENING_MONTHS_PT[month - 1]} ${match[1]}`,
    };
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
    btn.setAttribute("aria-label", btn.title);
    const icon = document.createElement("img");
    icon.className = "pin-btn-icon";
    icon.src = "icons/pin-pen.png?v=3";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    btn.append(icon);
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

  function daOpeningsCount(row) {
    const raw = cell(row.da_openings).trim();
    if (!/^\d+$/.test(raw)) return null;
    return Number(raw);
  }

  function subscribedOpeningCount(row) {
    const id = cell(row?.id);
    if (!id) return 0;
    let count = 0;
    for (const opening of openings) {
      if (cell(opening.company_key) !== id) continue;
      if (cell(opening.status).toLowerCase() !== "subscribed") continue;
      count += 1;
    }
    return count;
  }

  function matchesDaOpenings(row) {
    if (!daOpeningsFilter) return true;
    if (daOpeningsFilter === "with") return (daOpeningsCount(row) || 0) > 0;
    return true;
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
    rows = rows.filter(matchesDaOpenings);
    const q = query.trim().toLowerCase();
    if (q) {
      const parts = q.split(/\s+/).filter(Boolean);
      rows = rows.filter((r) => {
        const h = haystack(r);
        return parts.every((p) => h.includes(p));
      });
    }
    if (daOpeningsFilter === "with") {
      rows.sort(
        (a, b) =>
          (daOpeningsCount(b) || 0) - (daOpeningsCount(a) || 0) ||
          cell(a.name_en).localeCompare(cell(b.name_en)),
      );
      return rows;
    }
    rows.sort((a, b) => {
      const pr = pinRank(a) - pinRank(b);
      if (pr) return pr;
      if (isPinned(a) && isPinned(b)) {
        const da = lastOpeningIso(a);
        const db = lastOpeningIso(b);
        if (!da && db) return -1;
        if (da && !db) return 1;
        if (da && db && da !== db) return da < db ? -1 : 1;
      }
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
    const label = getLangMode() === "pt" ? chip.pt || chip.en : chip.en;
    if (window.CareerPathIcons && chip.key) {
      btn.append(window.CareerPathIcons.labelWithIcon(chip.key, label));
    } else {
      btn.textContent = label;
    }
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

  /** Content values only — EN/PT spans switched by CSS lang mode.
   * Identical strings use one span with no language class, so Portuguese
   * mode cannot hide the only remaining copy. */
  function appendValues(parent, enText, ptText, className) {
    const wrap = document.createElement("div");
    if (className) wrap.className = className;
    const en = String(enText || "");
    const pt = String(ptText || enText || "");
    if (en.trim().toLowerCase() === pt.trim().toLowerCase()) {
      const same = document.createElement("span");
      same.textContent = en || pt;
      wrap.append(same);
    } else {
      const enSpan = document.createElement("span");
      enSpan.className = "panel-heading-en";
      enSpan.textContent = en;
      const ptSpan = document.createElement("span");
      ptSpan.className = "panel-heading-pt";
      ptSpan.textContent = pt;
      wrap.append(enSpan, ptSpan);
    }
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
    for (const chip of [
      { key: "", en: "All paths", pt: "All paths" },
      { key: "da", en: "Data Analyst", pt: "Data Analyst" },
      { key: "po", en: "Product Owner", pt: "Product Owner" },
      {
        key: "dsa",
        en: "Digital Solution Architect",
        pt: "Digital Solution Architect",
      },
      { key: "multi", en: "Multi-role", pt: "Multi-role" },
    ]) {
      roleRow.append(
        makeChip(chip, roleFilter, (key) => {
          roleFilter = key;
          render();
        }),
      );
    }
    root.append(roleRow);

    const daRow = document.createElement("div");
    daRow.className = "company-filter-row";
    const daLabel = document.createElement("span");
    daLabel.className = "company-filter-label";
    appendValues(daLabel, "DA openings", "Vagas de análise");
    daRow.append(daLabel);
    for (const chip of [
      { key: "", en: "All", pt: "Todas" },
      { key: "with", en: "With openings", pt: "Com vagas" },
    ]) {
      daRow.append(
        makeChip(chip, daOpeningsFilter, (key) => {
          daOpeningsFilter = key;
          render();
        }),
      );
    }
    root.append(daRow);

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
      { key: "accepts", en: "Accepts remote / HO" },
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
      { key: "", en: "All", pt: "Todas" },
      { key: "high", en: "Growing", pt: "Em crescimento" },
      { key: "moderate", en: "Steady", pt: "Estável" },
      { key: "unknown", en: "Unknown", pt: "Desconhecido" },
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
    const subscribedCount = subscribedOpeningCount(row);
    btn.className =
      "company-tile" +
      tileSpanClass(row) +
      (isPinned(row) ? " is-pinned" : "") +
      (openCompanyId === row.id ? " is-active" : "");
    btn.dataset.id = row.id;
    btn.dataset.url = portalUrl;
    btn.title = portalUrl
      ? "Click to edit · Alt+R to generate openings · Ctrl/Cmd+click or Ctrl+Enter to open careers"
      : "Click to edit · Alt+R to generate openings";
    btn.addEventListener("pointerenter", () => {
      window.CardNav?.setLastCard?.(btn);
    });
    btn.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        if (portalUrl) {
          void openUrlInNewWindow(portalUrl);
          const name = cell(row.name_en) || row.id;
          setSaveStatus(`Opened careers: ${name}`, "ok");
        } else {
          setSaveStatus("No careers / portal URL for this company", "err");
        }
        return;
      }
      openModal(row.id);
    });

    const head = document.createElement("div");
    head.className = "company-tile-head";

    const enName = cell(row.name_en) || row.id;
    const ptName = cell(row.name_pt) || enName;
    const title = document.createElement("div");
    title.className = "company-tile-title";
    appendValues(title, enName, ptName);

    const signals = document.createElement("div");
    signals.className = "company-tile-signals";
    const geo = companyGeo(row);
    const flagRow = window.CountryFlags.renderFlagRow(geo);
    appendHomeOfficeFlag(flagRow, row);
    appendGrowthFlag(flagRow, row);
    if (flagRow.childNodes.length) {
      flagRow.hidden = false;
      signals.append(flagRow);
    }
    head.append(title);
    if (signals.childNodes.length) head.append(signals);

    const lastIso = lastOpeningIso(row);
    const lastLabel = formatOpeningDate(lastIso);
    let lastOpening = null;
    if (lastLabel) {
      lastOpening = document.createElement("div");
      lastOpening.className = "company-last-opening";
      lastOpening.title =
        "Date the latest job opening was added for this company";
      appendValues(
        lastOpening,
        `Last opening · ${lastLabel.en}`,
        `Última vaga · ${lastLabel.pt}`,
      );
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

    const subTag = document.createElement("span");
    subTag.className =
      "company-sub-count" +
      (subscribedCount > 3
        ? " is-over"
        : subscribedCount === 3
          ? " is-max"
          : "");
    subTag.textContent = `${subscribedCount} subscribed`;
    subTag.title =
      (subscribedCount > 3
        ? "More than 3 subscribed openings. Exclude some or change their status to clear the red tag."
        : subscribedCount === 3
          ? "3 subscribed openings, the maximum for this company."
          : "Subscribed openings at this company.") +
      " Click to view openings in the job board.";
    subTag.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openCompanyOpeningsInCockpit(row.id);
    });
    btn.append(subTag);

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
    const daCount = daOpeningsCount(row);
    if (daCount != null) {
      const da = document.createElement("span");
      da.className = "company-chip company-chip-da-openings";
      da.title = "Click to view openings in the job board.";
      da.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openCompanyOpeningsInCockpit(row.id);
      });
      const en = document.createElement("span");
      en.className = "panel-heading-en";
      en.textContent = `${daCount} DA`;
      const pt = document.createElement("span");
      pt.className = "panel-heading-pt";
      pt.textContent = `${daCount} AD`;
      da.append(en, pt);
      chips.append(da);
    }

    const badges = document.createElement("div");
    badges.className = "role-badges";
    for (const fit of FIT_FIELDS) {
      const on = isFitYes(row[fit.field]);
      const badge = document.createElement("span");
      badge.className = "role-badge" + (on ? " is-on" : " is-off");
      if (window.CareerPathIcons) {
        badge.append(window.CareerPathIcons.labelWithIcon(fit.key, fit.short));
      } else {
        badge.textContent = fit.short;
      }
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

    btn.append(head);
    if (lastOpening) btn.append(lastOpening);
    btn.append(meta, chips, badges);
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

    const urls = document.createElement("div");
    urls.className = "company-url-edits";
    urls.append(
      urlEditField(row, "careers_url", "Job openings portal", {
        placeholder: "https://…/careers",
        hint: "Opened from the company card (Ctrl+click). Change this when the portal link is wrong.",
      }),
      urlEditField(row, "website", "Company website", {
        placeholder: "https://…",
        hint: "Main company site. Used only if no job openings portal is set.",
      }),
      urlEditField(row, "ats_url", "ATS apply board", {
        placeholder: "https://…",
      }),
    );
    body.append(urls);

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
    const growthLabels = {
      high: ["Growing", "Em crescimento"],
      moderate: ["Steady", "Estável"],
      unknown: ["Unknown", "Desconhecido"],
    };
    for (const opt of GROWTH_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      const pair = growthLabels[opt] || [opt, opt];
      o.textContent = getLangMode() === "pt" ? pair[1] : pair[0];
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
    const openPortalBtn = document.createElement("button");
    openPortalBtn.type = "button";
    openPortalBtn.className = "nav-btn";
    openPortalBtn.textContent = "Open careers";
    openPortalBtn.title = "Open company careers / portal (Shift+C)";
    openPortalBtn.addEventListener(
      "click",
      () => void openFocusedCompanyPortal(),
    );
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
    actions.append(openPortalBtn, done, del);
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
    daOpeningsFilter = "";
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
      fit_ux_researcher: "no",
      da_openings: "",
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
    openings = Array.isArray(collections.jobOpenings)
      ? collections.jobOpenings
      : [];
    indexLastOpenings();
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
      const isEnter =
        event.key === "Enter" ||
        event.code === "Enter" ||
        event.code === "NumpadEnter";

      // Ctrl/Cmd+Shift+Enter: open company portal even while in modal
      if (mod && event.shiftKey && !event.altKey && isEnter) {
        event.preventDefault();
        event.stopPropagation();
        void openFocusedCompanyPortal();
        return;
      }

      // Ctrl/Cmd+Enter: close modal (when open) or open focused company portal (when viewing board)
      if (mod && !event.altKey && isEnter) {
        event.preventDefault();
        event.stopPropagation();
        if (modalOpen) {
          void doneModal();
          return;
        }
        void openFocusedCompanyPortal();
        return;
      }

      // Shift+C: open company portal (dossier open or card focused/hovered)
      if (
        (modalOpen || focusedCompanyCard()) &&
        !typing &&
        !mod &&
        !event.altKey &&
        event.shiftKey &&
        (event.code === "KeyC" || (event.key || "").toLowerCase() === "c")
      ) {
        event.preventDefault();
        event.stopPropagation();
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
        (event.code === "KeyN" || (event.key || "").toLowerCase() === "n")
      ) {
        event.preventDefault();
        event.stopPropagation();
        addCompany();
        return;
      }

      if (event.altKey && !mod && !event.shiftKey) {
        // OPENINGS prompt shortcut: focused card or open dossier
        const isR =
          event.code === "KeyR" || (event.key || "").toLowerCase() === "r";
        if (isR) {
          const row = pinTargetCompany();
          if (!row) {
            event.preventDefault();
            event.stopPropagation();
            setSaveStatus(
              "Focus a company card (or open its dossier) first",
              "err",
            );
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          const params = new URLSearchParams({
            action: "prompt",
            company: row.id,
          });
          location.assign(`/jobs.html?${params}`);
          return;
        }
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
        if (isM) {
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
      if (event.key.toLowerCase() === "p" || event.code === "KeyP") {
        event.preventDefault();
        openProfileWindow();
        return;
      }
      if (event.key.toLowerCase() === "o" || event.code === "KeyO") {
        event.preventDefault();
        location.assign("/people.html");
        return;
      }
      if (event.key.toLowerCase() === "j" || event.code === "KeyJ") {
        event.preventDefault();
        openPortalsWindow();
        return;
      }
      if (event.key.toLowerCase() === "g" || event.code === "KeyG") {
        event.preventDefault();
        openJobsWindow();
        return;
      }
      if (event.key.toLowerCase() === "c" || event.code === "KeyC") {
        event.preventDefault();
        openCompaniesHome();
        return;
      }
      if (event.key.toLowerCase() === "h" || event.code === "KeyH") {
        event.preventDefault();
        location.assign("/help.html");
        return;
      }
      if (event.key.toLowerCase() === "a" || event.code === "KeyA") {
        event.preventDefault();
        location.assign("/advice.html");
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
    window.CardNav?.configureHome(CARD_SEL, FILTER_SEL);
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
    const openingsBtn = document.getElementById("open-openings-btn");
    if (openingsBtn) {
      openingsBtn.addEventListener("click", () => openJobsWindow());
    }
    const companiesBtn = document.getElementById("open-companies-btn");
    if (companiesBtn) {
      companiesBtn.addEventListener("click", () => openCompaniesHome());
    }
    document
      .getElementById("open-help-btn")
      ?.addEventListener("click", () => location.assign("/help.html"));
    document
      .getElementById("open-advice-btn")
      ?.addEventListener("click", () => location.assign("/advice.html"));
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
