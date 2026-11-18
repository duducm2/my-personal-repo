(() => {
  const LANG_KEY = "career-cockpit-lang";

  const STATUS_OPTIONS = [
    "saved",
    "subscribed",
    "watching",
    "applied",
    "interviewing",
    "offer",
    "paused",
    "closed",
    "rejected",
    "excluded",
  ];
  const PRIORITY_OPTIONS = ["high", "medium", "low"];
  const PATH_OPTIONS = [
    { key: "uxr", label: "UX Researcher & Design Technologist" },
    { key: "da", label: "Data Analyst" },
    { key: "po", label: "Product Owner" },
    { key: "dsa", label: "Digital Solution Architect" },
    { key: "other", label: "Other" },
  ];
  const WORK_MODE_OPTIONS = ["remote", "hybrid", "onsite", "unknown"];
  const SOURCE_OPTIONS = [
    "linkedin",
    "company_site",
    "referral",
    "community",
    "recruiter",
    "other",
  ];
  const RESUME_OPTIONS = [
    "ux-researcher",
    "data-analyst",
    "product-owner",
    "digital-solution-architect",
  ];
  const HUMAN_VOICE = [
    "=== VOICE (mandatory) ===",
    "Every sentence you write must sound like a person wrote it, and stay professional.",
    "An ATS should not be able to flag the text as generated.",
    "Use short sentences and the concrete facts already in the source: tools, dates, employers, outcomes.",
    "Do not open with excitement, passion, or a claim that you are thrilled.",
    "Do not glue clauses with an em dash.",
    'Do not use leverage, delve, robust, seamless, cutting-edge, holistic, foster, pivotal, landscape, tapestry, synergy, teamwork-driven, end-to-end ownership, or "not only ... but".',
    "No stacked adjectives and no padded lists of three.",
    "Copied facts stay exact: names, titles, URLs, dates, requisition numbers, and wording taken straight from the paste.",
    "This applies in English and in Portuguese.",
  ].join("\n");
  const RESULT_OPTIONS = [
    { key: "", label: "(none — in progress)" },
    { key: "hired", label: "Hired" },
    { key: "offer_declined", label: "Offer declined" },
    { key: "rejected", label: "Rejected" },
    { key: "withdrew", label: "Withdrew" },
    { key: "ghosted", label: "Ghosted" },
    { key: "position_filled", label: "Position filled" },
    { key: "not_pursued", label: "Not pursued" },
    { key: "other", label: "Other" },
  ];
  const OPENING_FIELDS = [
    "id",
    "sort_order",
    "pinned",
    "company",
    "company_key",
    "role_title",
    "career_path",
    "job_url",
    "form_url",
    "status",
    "priority",
    "work_mode",
    "location",
    "source",
    "found_on",
    "applied_on",
    "applied_date",
    "next_action",
    "next_action_date",
    "salary_range",
    "fit_interest",
    "skills_gap",
    "job_description",
    "notes",
    "contact_person",
    "contact_note",
    "is_new",
    "match_score",
    "match_reason",
    "recommended_resume",
    "result",
    "result_on",
    "application_answers",
    "application_form_raw",
    "cover_letter",
    "cover_letter_lang",
    "cover_letter_greeting",
    "cover_letter_closing",
  ];
  const PATH_TO_VARIANT = {
    uxr: "ux-researcher",
    da: "data-analyst",
    po: "product-owner",
    dsa: "digital-solution-architect",
    other: "ux-researcher",
  };

  let collections = {};
  let openings = [];
  let platforms = [];
  let communities = [];
  let dirty = false;
  let saving = false;
  let saveTimer = null;
  let saveGeneration = 0;
  const SAVE_DEBOUNCE_MS = 500;
  let query = "";
  let statusFilter = "";
  let pathFilter = "";
  let priorityFilter = "";
  let resultFilter = "";
  let openJobId = "";
  let bulkMode = false;
  let selectedIds = new Set();
  let promptContextCache = null;
  let downloadsCache = null;
  let promptAutoCloseTimer = null;
  let promptAutoCloseSecondsLeft = 0;
  let promptAutoCloseTick = null;
  let launchCompanyKey = "";

  function cell(v) {
    return v == null ? "" : String(v);
  }

  function searchBarEl() {
    return document.getElementById("search-bar");
  }

  function searchInputEl() {
    return document.getElementById("job-search-input");
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

  const CARD_SEL = "#jobs-results .company-tile";
  const FILTER_SEL = "#jobs-filters";

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

  function clearJobFilters() {
    statusFilter = "";
    pathFilter = "";
    priorityFilter = "";
    resultFilter = "";
    query = "";
    const search = searchInputEl();
    if (search) search.value = "";
    hideSearchBar({ focusCard: false });
    render();
    window.CardNav?.focusFirst(CARD_SEL);
  }

  function hasActiveJobFilters() {
    return !!(
      statusFilter ||
      pathFilter ||
      priorityFilter ||
      resultFilter ||
      (query || "").trim()
    );
  }

  function moveCardFocus(delta) {
    return !!window.CardNav?.moveInContext(CARD_SEL, FILTER_SEL, delta);
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

  function focusedJobCard() {
    const el = document.activeElement;
    const card = el?.closest?.("#jobs-results .company-tile");
    if (card) return card;

    const hovered = window.CardNav?.getHoveredCard?.();
    if (hovered && hovered.closest?.("#jobs-results")) {
      return hovered.closest(".company-tile");
    }

    if (!window.CardNav?.isHoverCleared?.()) {
      try {
        const qHover = document.querySelector(
          "#jobs-results .company-tile:hover",
        );
        if (qHover) return qHover;
      } catch {
        /* ignore */
      }
    }

    const last = window.CardNav?.getLastCard?.();
    if (last && last.closest?.("#jobs-results")) {
      return last.closest(".company-tile");
    }

    return null;
  }

  async function openFocusedJobUrl() {
    const card = focusedJobCard();
    if (!card) return false;
    const href = cell(card.dataset.url);
    if (!href) {
      setSaveStatus("No job URL for this opening", "err");
      return true;
    }
    const ok = await openUrlInNewWindow(href);
    if (!ok) setSaveStatus("Could not open job URL", "err");
    return true;
  }

  function selectedOpening() {
    if (openJobId) {
      return openings.find((r) => r.id === openJobId) || null;
    }
    const card = focusedJobCard();
    if (card) return openings.find((r) => r.id === card.dataset.id) || null;
    if (selectedIds.size === 1) {
      const id = [...selectedIds][0];
      return openings.find((r) => r.id === id) || null;
    }
    return null;
  }

  /** Open dossier, focused card, or single bulk selection — for dossier-style shortcuts. */
  function activeOpening() {
    return selectedOpening();
  }

  function activeOpeningId() {
    return cell(activeOpening()?.id);
  }

  function requireActiveOpening(actionLabel) {
    const row = activeOpening();
    if (row) return row;
    showToast(
      `Focus a job card (or open its dossier) first to ${actionLabel}`,
      2500,
    );
    return null;
  }

  function companyPortalUrl(company) {
    if (!company) return "";
    return (
      cell(company.careers_url) ||
      cell(company.ats_url) ||
      cell(company.website) ||
      ""
    );
  }

  async function openSelectedCompanyPortal() {
    const row = selectedOpening();
    if (!row) return false;
    const href = companyPortalUrl(resolveLinkedCompany(row));
    if (!href) {
      setSaveStatus("No careers portal for this company", "err");
      return true;
    }
    const ok = await openUrlInNewWindow(href);
    if (!ok) setSaveStatus("Could not open company portal", "err");
    return true;
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
    collections.jobOpenings = openings;
    collections.jobPlatforms = platforms;
    collections.jobCommunities = communities;
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

  function pathLabel(key) {
    return PATH_OPTIONS.find((p) => p.key === key)?.label || key || "Other";
  }

  function resultLabel(key) {
    const k = cell(key);
    if (!k) return "";
    return RESULT_OPTIONS.find((r) => r.key === k)?.label || k;
  }

  function haystack(row) {
    return [
      row.company,
      row.role_title,
      row.career_path,
      row.status,
      row.priority,
      row.work_mode,
      row.location,
      row.source,
      row.next_action,
      row.skills_gap,
      row.job_description,
      row.notes,
      row.contact_person,
      row.job_url,
      row.result,
      row.id,
    ]
      .map(cell)
      .join("\n")
      .toLowerCase();
  }

  function filteredRows() {
    let rows = openings.slice();
    if (statusFilter) {
      rows = rows.filter((r) => cell(r.status).toLowerCase() === statusFilter);
    }
    if (pathFilter) {
      rows = rows.filter(
        (r) => cell(r.career_path).toLowerCase() === pathFilter,
      );
    }
    if (priorityFilter) {
      rows = rows.filter(
        (r) => cell(r.priority).toLowerCase() === priorityFilter,
      );
    }
    if (resultFilter === "__none__") {
      rows = rows.filter((r) => !cell(r.result));
    } else if (resultFilter) {
      rows = rows.filter((r) => cell(r.result).toLowerCase() === resultFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      const parts = q.split(/\s+/).filter(Boolean);
      rows = rows.filter((r) => {
        const h = haystack(r);
        return parts.every((p) => h.includes(p));
      });
    }
    return rows;
  }

  function makeChip(chip, activeKey, onSelect) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "filter-chip" + (activeKey === chip.key ? " is-active" : "");
    btn.setAttribute("aria-pressed", activeKey === chip.key ? "true" : "false");
    const icon = statusIcon(chip.key);
    if (icon) btn.append(icon);
    if (
      !icon &&
      window.CareerPathIcons &&
      window.CareerPathIcons.resolveKey(chip.key)
    ) {
      btn.append(window.CareerPathIcons.labelWithIcon(chip.key, chip.label));
    } else {
      btn.append(document.createTextNode(chip.label));
    }
    btn.addEventListener("click", () => onSelect(chip.key));
    return btn;
  }

  function renderFilters() {
    const root = document.getElementById("jobs-filters");
    if (!root) return;
    root.replaceChildren();

    const statusRow = document.createElement("div");
    statusRow.className = "company-filter-row";
    const statusLab = document.createElement("span");
    statusLab.className = "company-filter-label";
    statusLab.textContent = "Status";
    statusRow.append(statusLab);
    for (const chip of [
      { key: "", label: "All" },
      ...STATUS_OPTIONS.map((s) => ({ key: s, label: s })),
    ]) {
      statusRow.append(
        makeChip(chip, statusFilter, (key) => {
          statusFilter = key;
          render();
        }),
      );
    }
    root.append(statusRow);

    const pathRow = document.createElement("div");
    pathRow.className = "company-filter-row";
    const pathLab = document.createElement("span");
    pathLab.className = "company-filter-label";
    pathLab.textContent = "Career path";
    pathRow.append(pathLab);
    for (const chip of [
      { key: "", label: "All paths" },
      ...PATH_OPTIONS.map((p) => ({ key: p.key, label: p.label })),
    ]) {
      pathRow.append(
        makeChip(chip, pathFilter, (key) => {
          pathFilter = key;
          render();
        }),
      );
    }
    root.append(pathRow);

    const priRow = document.createElement("div");
    priRow.className = "company-filter-row";
    const priLab = document.createElement("span");
    priLab.className = "company-filter-label";
    priLab.textContent = "Priority";
    priRow.append(priLab);
    for (const chip of [
      { key: "", label: "All" },
      ...PRIORITY_OPTIONS.map((p) => ({ key: p, label: p })),
    ]) {
      priRow.append(
        makeChip(chip, priorityFilter, (key) => {
          priorityFilter = key;
          render();
        }),
      );
    }
    root.append(priRow);

    const resultRow = document.createElement("div");
    resultRow.className = "company-filter-row";
    const resultLab = document.createElement("span");
    resultLab.className = "company-filter-label";
    resultLab.textContent = "Result";
    resultRow.append(resultLab);
    for (const chip of [
      { key: "", label: "All" },
      { key: "__none__", label: "In progress" },
      ...RESULT_OPTIONS.filter((r) => r.key).map((r) => ({
        key: r.key,
        label: r.label,
      })),
    ]) {
      resultRow.append(
        makeChip(chip, resultFilter, (key) => {
          resultFilter = key;
          render();
        }),
      );
    }
    root.append(resultRow);
  }

  function tileSpanClass(row) {
    const high = cell(row.priority).toLowerCase() === "high";
    const hot = ["applied", "interviewing", "offer"].includes(
      cell(row.status).toLowerCase(),
    );
    return high || hot ? " company-tile-wide" : "";
  }

  function resolveLinkedCompany(row) {
    const key = cell(row.company_key).toLowerCase();
    const name = cell(row.company).toLowerCase();
    const companies = Array.isArray(collections.companies)
      ? collections.companies
      : [];
    return (
      companies.find((c) => cell(c.id).toLowerCase() === key) ||
      companies.find((c) => {
        const id = cell(c.id).toLowerCase();
        return (
          key && (id === key || id.startsWith(key + "-") || id.includes(key))
        );
      }) ||
      companies.find(
        (c) =>
          name &&
          (cell(c.name_en).toLowerCase().includes(name) ||
            cell(c.name_pt).toLowerCase().includes(name)),
      ) ||
      null
    );
  }

  function resolveOpeningGeo(row) {
    const parts = [row.location, row.company, row.notes, row.source];
    const linked = resolveLinkedCompany(row);
    if (linked) {
      parts.push(
        linked.region_en,
        linked.region_pt,
        linked.city_en,
        linked.city_pt,
        linked.notes_en,
        linked.notes_pt,
      );
    }
    if (
      !cell(row.location) &&
      /gupy|catho|infojobs|vagas/i.test(cell(row.source))
    ) {
      parts.push("brazil");
    }
    return window.CountryFlags.resolveCountries(...parts);
  }

  function appendGrowthFlag(parent, company) {
    if (!company || cell(company.growth).toLowerCase() !== "high") return;
    const cue = document.createElement("span");
    cue.className = "growth-tag";
    cue.title =
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
    cue.append(img, label);
    parent.append(cue);
  }

  function statusIcon(status) {
    const key = cell(status).toLowerCase();
    if (!STATUS_OPTIONS.includes(key)) return null;
    const img = document.createElement("img");
    img.className = "status-icon";
    img.src = `icons/status-${key}.png?v=3`;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function statusTone(status) {
    const s = cell(status).toLowerCase();
    if (s === "offer" || s === "interviewing") return "hot";
    if (s === "applied" || s === "subscribed") return "active";
    if (s === "watching" || s === "saved") return "watch";
    if (s === "paused") return "muted";
    if (s === "closed" || s === "rejected" || s === "excluded") return "cold";
    return "default";
  }

  function makeTileChip(text, className) {
    const c = document.createElement("span");
    c.className = className;
    c.textContent = text;
    return c;
  }

  function isPinned(row) {
    const v = cell(row?.pinned).toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "y";
  }

  function pinRank(row) {
    return isPinned(row) ? 0 : 1;
  }

  function scoreRank(row) {
    const raw = cell(row?.match_score);
    if (!raw) return -Infinity;
    const n = Number(raw.replace(",", "."));
    return Number.isFinite(n) ? n : -Infinity;
  }

  function focusJobCard(id) {
    const sid = cell(id);
    if (!sid) return;
    requestAnimationFrame(() => {
      const card = document.querySelector(
        `#jobs-results .company-tile[data-id="${CSS.escape(sid)}"]`,
      );
      if (!card) return;
      card.focus();
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function togglePinned(row) {
    row.pinned = isPinned(row) ? "" : "1";
    setDirty(true);
    const name = cell(row.role_title) || row.id;
    setSaveStatus(
      isPinned(row) ? `Pinned: ${name}` : `Unpinned: ${name}`,
      "ok",
    );
    if (openJobId === row.id) fillModal();
    renderResults();
  }

  function pinTargetOpening() {
    if (openJobId) {
      return openings.find((r) => r.id === openJobId) || null;
    }
    const card = focusedJobCard();
    if (!card) return null;
    return openings.find((r) => r.id === card.dataset.id) || null;
  }

  function pinFocusedOpening() {
    const row = pinTargetOpening();
    if (!row) {
      setSaveStatus(
        "Focus an opening card (or open its dossier) to pin",
        "err",
      );
      return;
    }
    const fromCard = !openJobId;
    togglePinned(row);
    if (fromCard) focusJobCard(row.id);
  }

  function appendPinControl(parent, row) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin-btn" + (isPinned(row) ? " is-on" : "");
    btn.setAttribute("aria-pressed", isPinned(row) ? "true" : "false");
    btn.title = isPinned(row)
      ? "Unpin from this status (Alt+M)"
      : "Pin to top of this status (Alt+M)";
    btn.setAttribute("aria-label", btn.title);
    const icon = document.createElement("img");
    icon.className = "pin-btn-icon";
    icon.src = "icons/pin-pen.png?v=3";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    btn.append(icon);
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      togglePinned(row);
    });
    parent.append(btn);
    return btn;
  }

  function renderTile(row) {
    const status = cell(row.status).toLowerCase();
    const priority = cell(row.priority).toLowerCase();
    const matchScore = cell(row.match_score);
    const wrap = document.createElement("div");
    wrap.className =
      "job-tile-wrap" +
      tileSpanClass(row) +
      (openJobId === row.id ? " is-active" : "") +
      (selectedIds.has(row.id) ? " is-selected" : "");
    wrap.dataset.id = row.id;

    if (bulkMode) {
      const check = document.createElement("input");
      check.type = "checkbox";
      check.className = "job-tile-check";
      check.checked = selectedIds.has(row.id);
      check.title = "Select for bulk action";
      check.addEventListener("click", (e) => e.stopPropagation());
      check.addEventListener("change", () => {
        if (check.checked) selectedIds.add(row.id);
        else selectedIds.delete(row.id);
        updateBulkBar();
        wrap.classList.toggle("is-selected", check.checked);
      });
      wrap.append(check);
    }

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "company-tile job-tile" +
      (status ? ` job-tile--${statusTone(status)}` : "") +
      (priority === "high" ? " job-tile--high" : "") +
      (isPinned(row) ? " is-pinned" : "") +
      (isStaleOpening(row) ? " is-stale" : "");
    btn.dataset.id = row.id;
    btn.dataset.url = cell(row.job_url);
    const roleTitle = cell(row.role_title) || "(untitled role)";
    const hints = cell(row.job_url)
      ? "Click to edit · Right-click status · Alt+M pin · Alt+F form · Alt+C cover · Shift+C company portal · Ctrl/Cmd+Enter job URL · Ctrl/Cmd+click bulk"
      : "Click to edit · Right-click status · Alt+M pin · Alt+F form · Alt+C cover · Shift+C company portal · Ctrl/Cmd+click bulk";
    btn.title = `${roleTitle}\n${hints}`;
    btn.addEventListener("click", (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && !bulkMode) {
        e.preventDefault();
        selectedIds.add(row.id);
        setBulkMode(true);
        return;
      }
      if (bulkMode) {
        if (selectedIds.has(row.id)) selectedIds.delete(row.id);
        else selectedIds.add(row.id);
        updateBulkBar();
        renderResults();
        return;
      }
      openModal(row.id);
    });
    const onStatusMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showJobStatusMenu(e, row);
    };
    btn.addEventListener("contextmenu", onStatusMenu);
    wrap.addEventListener("contextmenu", onStatusMenu);

    const top = document.createElement("div");
    top.className = "job-tile-top";
    if (status) {
      const chip = document.createElement("span");
      chip.className = `job-tile-status job-tile-status--${statusTone(status)}`;
      chip.title = statusLabel(status);
      chip.setAttribute("aria-label", statusLabel(status));
      const icon = statusIcon(status);
      if (icon) {
        icon.alt = statusLabel(status);
        icon.removeAttribute("aria-hidden");
        chip.append(icon);
      } else chip.textContent = status;
      top.append(chip);
    }
    if (isNewOpening(row)) {
      const badge = document.createElement("span");
      badge.className = "job-new-badge";
      const companyLabel =
        cell(row.company) || cell(row.company_key) || "import";
      badge.textContent = `New · ${companyLabel}`;
      badge.title = `New for ${companyLabel}`;
      top.append(badge);
    }
    const topEnd = document.createElement("div");
    topEnd.className = "job-tile-top-end";
    appendRingControl(topEnd, row);
    if (matchScore) {
      const match = document.createElement("span");
      match.className = "job-tile-match";
      match.title = "Match score";
      const n = document.createElement("span");
      n.className = "job-tile-match-n";
      n.textContent = matchScore;
      const l = document.createElement("span");
      l.className = "job-tile-match-l";
      l.textContent = "match";
      match.append(n, l);
      topEnd.append(match);
    }
    appendPinControl(topEnd, row);
    top.append(topEnd);
    btn.append(top);

    const title = document.createElement("div");
    title.className = "company-tile-title";
    title.textContent = roleTitle;
    title.title = roleTitle;

    const geo = resolveOpeningGeo(row);
    const flagTitle = window.CountryFlags.prependFlags(btn, title, geo);
    const flagRow = flagTitle.querySelector(".country-flags");
    const linked = resolveLinkedCompany(row);
    if (flagRow) appendGrowthFlag(flagRow, linked);
    else if (linked && cell(linked.growth).toLowerCase() === "high") {
      const flagsWrap = document.createElement("div");
      flagsWrap.className = "country-flags";
      appendGrowthFlag(flagsWrap, linked);
      if (flagsWrap.childNodes.length) flagTitle.insertBefore(flagsWrap, title);
    }

    const meta = document.createElement("div");
    meta.className = "company-tile-meta job-tile-meta";
    const companyName = cell(row.company);
    const location = cell(row.location);
    if (companyName) {
      const co = document.createElement("span");
      co.className = "job-tile-company";
      co.textContent = companyName;
      meta.append(co);
    }
    if (location) {
      if (companyName) {
        const sep = document.createElement("span");
        sep.className = "job-tile-sep";
        sep.textContent = "·";
        sep.setAttribute("aria-hidden", "true");
        meta.append(sep);
      }
      const loc = document.createElement("span");
      loc.className = "job-tile-location";
      loc.textContent = location;
      meta.append(loc);
    }

    const chips = document.createElement("div");
    chips.className = "company-tile-chips job-tile-chips";
    if (priority) {
      chips.append(
        makeTileChip(
          priority,
          `company-chip company-chip-priority job-chip-priority--${priority}`,
        ),
      );
    }
    if (cell(row.work_mode)) {
      chips.append(makeTileChip(cell(row.work_mode), "company-chip"));
    }
    const path = pathLabel(row.career_path);
    if (path) chips.append(makeTileChip(path, "company-chip"));
    if (status === "subscribed") {
      const subscribedOn = subscriptionDate(row);
      if (subscribedOn) {
        const chip = makeTileChip(
          `Subscribed ${formatSubscriptionDate(subscribedOn)}`,
          "company-chip",
        );
        chip.title = `Subscribed on ${subscribedOn}`;
        chips.append(chip);
      }
    }
    const outcome = resultLabel(row.result);
    if (outcome) {
      chips.append(
        makeTileChip(
          cell(row.result_on) ? `${outcome} · ${cell(row.result_on)}` : outcome,
          "company-chip job-chip-result",
        ),
      );
    }

    btn.append(meta);
    if (chips.childNodes.length) btn.append(chips);

    if (cell(row.next_action)) {
      const next = document.createElement("div");
      next.className = "job-tile-next";
      const label = document.createElement("span");
      label.className = "job-tile-next-label";
      label.textContent = "Next";
      const body = document.createElement("span");
      body.className = "job-tile-next-body";
      body.textContent =
        cell(row.next_action) +
        (cell(row.next_action_date) ? ` · ${cell(row.next_action_date)}` : "");
      next.append(label, body);
      btn.append(next);
    }
    wrap.append(btn);
    return wrap;
  }

  const STALE_AFTER_DAYS = 30;

  function todayISO() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function parseISODate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cell(value).trim());
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  }

  function subscriptionDate(row) {
    const subscribed = cell(row.applied_date);
    if (parseISODate(subscribed)) return subscribed;
    const found = cell(row.found_on);
    if (parseISODate(found)) return found;
    return "";
  }

  function formatSubscriptionDate(iso) {
    const date = parseISODate(iso);
    if (!date) return cell(iso);
    const months = [
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
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function ensureSubscriptionDate(row) {
    if (cell(row.status).toLowerCase() !== "subscribed") return false;
    if (parseISODate(row.applied_date)) return false;
    const found = cell(row.found_on);
    row.applied_date = parseISODate(found) ? found : todayISO();
    return true;
  }

  function isStaleOpening(row) {
    const start = parseISODate(row.applied_date);
    if (!start) return false;
    const today = parseISODate(todayISO());
    const days = Math.round((today - start) / 86400000);
    return days >= STALE_AFTER_DAYS;
  }

  function ringOpening(row) {
    row.applied_date = todayISO();
    setDirty(true);
    setSaveStatus("");
    render();
  }

  function appendRingControl(parent, row) {
    const stale = isStaleOpening(row);
    const started = cell(row.applied_date);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ring-btn" + (stale ? " is-due" : "");
    btn.title = stale
      ? `Stale since ${started}. Ring to confirm you are still monitoring and restart the 30-day timer.`
      : started
        ? `Subscribed on ${started}. Ring to restart the 30-day timer.`
        : "Ring to start the 30-day monitoring timer.";
    btn.setAttribute("aria-label", btn.title);
    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.setAttribute("aria-hidden", "true");
    icon.classList.add("ring-btn-icon");
    const outer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    outer.setAttribute("cx", "12");
    outer.setAttribute("cy", "12");
    outer.setAttribute("r", "7.2");
    outer.setAttribute("fill", "none");
    outer.setAttribute("stroke", "currentColor");
    outer.setAttribute("stroke-width", "1.7");
    const inner = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    inner.setAttribute("cx", "12");
    inner.setAttribute("cy", "12");
    inner.setAttribute("r", "2.3");
    inner.setAttribute("fill", "currentColor");
    icon.append(outer, inner);
    btn.append(icon);
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      ringOpening(row);
    });
    parent.append(btn);
    return btn;
  }

  function isNewOpening(row) {
    const v = cell(row.is_new).toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "y";
  }

  function statusLabel(status) {
    const s = cell(status);
    if (!s) return "Unknown";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  function groupRowsByStatus(rows) {
    const by = new Map();
    for (const row of rows) {
      const key = cell(row.status).toLowerCase() || "unknown";
      if (!by.has(key)) by.set(key, []);
      by.get(key).push(row);
    }
    for (const list of by.values()) {
      list.sort((a, b) => {
        const byPin = pinRank(a) - pinRank(b);
        if (byPin !== 0) return byPin;
        return scoreRank(b) - scoreRank(a);
      });
    }
    const order = STATUS_OPTIONS.slice();
    for (const key of by.keys()) {
      if (!order.includes(key)) order.push(key);
    }
    return order
      .filter((key) => by.has(key))
      .map((key) => ({ status: key, rows: by.get(key) }));
  }

  function renderResults() {
    const root = document.getElementById("jobs-results");
    const countEl = document.getElementById("job-result-count");
    if (!root) return;
    root.replaceChildren();
    const rows = filteredRows();
    if (countEl) {
      countEl.textContent = `${rows.length} opening${rows.length === 1 ? "" : "s"}`;
    }
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state company-bento-empty";
      empty.textContent = "No openings match this search.";
      root.append(empty);
      return;
    }
    for (const group of groupRowsByStatus(rows)) {
      const head = document.createElement("div");
      head.className =
        "job-status-group-head" +
        (group.status !== "unknown"
          ? ` job-status-group-head--${statusTone(group.status)}`
          : "");
      head.setAttribute("role", "heading");
      head.setAttribute("aria-level", "3");
      const title = document.createElement("span");
      title.className = "job-status-group-title";
      title.textContent = statusLabel(group.status);
      const count = document.createElement("span");
      count.className = "job-status-group-count";
      count.textContent = String(group.rows.length);
      const icon = statusIcon(group.status);
      if (icon) head.append(icon);
      head.append(title, count);
      root.append(head);
      for (const row of group.rows) root.append(renderTile(row));
    }
  }

  function toggleStatusFilter(status) {
    statusFilter = statusFilter === status ? "" : status;
    render();
  }

  function render() {
    renderFilters();
    renderResults();
  }

  function currentOpenRow() {
    return openings.find((r) => r.id === openJobId) || null;
  }

  function openModal(id) {
    openJobId = id;
    const dialog = document.getElementById("job-modal");
    fillModal();
    if (dialog && typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    }
    renderResults();
  }

  function closeModal() {
    openJobId = "";
    const dialog = document.getElementById("job-modal");
    if (dialog && dialog.open) dialog.close();
    renderResults();
  }

  function fieldBlock(labelText, control) {
    const wrap = document.createElement("label");
    wrap.className = "company-edit-field";
    const lab = document.createElement("span");
    lab.className = "company-research-label";
    lab.textContent = labelText;
    wrap.append(lab, control);
    return wrap;
  }

  function textInput(row, key, opts = {}) {
    const el = opts.tall
      ? document.createElement("textarea")
      : document.createElement("input");
    el.className = "field-input" + (opts.tall ? " tall" : "");
    if (opts.tall) el.rows = opts.rows || 4;
    if (opts.type) el.type = opts.type;
    if (opts.placeholder) el.placeholder = opts.placeholder;
    el.value = cell(row[key]);
    el.addEventListener("input", () => {
      row[key] = el.value;
      if (key === "company") {
        const isNew = String(row.id || "").startsWith("job-new-");
        if (isNew || !cell(row.company_key)) {
          row.company_key = slugCompanyKey(el.value);
        }
      }
      setDirty(true);
      setSaveStatus("");
      if (
        [
          "role_title",
          "company",
          "status",
          "priority",
          "next_action",
          "result",
          "applied_date",
        ].includes(key)
      ) {
        renderResults();
        const titleEl = document.getElementById("job-modal-title");
        if (titleEl) {
          titleEl.textContent =
            (cell(row.role_title) || "(untitled)") +
            (cell(row.company) ? ` · ${cell(row.company)}` : "");
        }
      }
    });
    return el;
  }

  function slugCompanyKey(name) {
    const slug = String(name || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || `company-${Date.now()}`;
  }

  function selectInput(row, key, options) {
    const el = document.createElement("select");
    el.className = "field-input";
    for (const opt of options) {
      const o = document.createElement("option");
      const value = typeof opt === "string" ? opt : opt.key;
      const label = typeof opt === "string" ? opt : opt.label;
      o.value = value;
      o.textContent = label;
      if (cell(row[key]) === value) o.selected = true;
      el.append(o);
    }
    if (
      !options.some(
        (opt) => (typeof opt === "string" ? opt : opt.key) === cell(row[key]),
      )
    ) {
      const o = document.createElement("option");
      o.value = cell(row[key]);
      o.textContent = cell(row[key]) || "(blank)";
      o.selected = true;
      el.append(o);
    }
    el.addEventListener("change", () => {
      if (key === "status" && cell(el.value).toLowerCase() === "excluded") {
        excludeOpenings([row]);
        return;
      }
      row[key] = el.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    return el;
  }

  function fillModal() {
    const row = currentOpenRow();
    const titleEl = document.getElementById("job-modal-title");
    const body = document.getElementById("job-modal-body");
    if (!titleEl || !body) return;
    titleEl.replaceChildren();
    body.replaceChildren();
    if (!row) return;

    titleEl.textContent =
      (cell(row.role_title) || "(untitled)") +
      (cell(row.company) ? ` · ${cell(row.company)}` : "");

    const pinRow = document.createElement("div");
    pinRow.className = "company-tile-chips company-modal-pin";
    appendPinControl(pinRow, row);
    body.append(pinRow);

    const grid = document.createElement("div");
    grid.className = "company-result-edit job-modal-grid";

    grid.append(
      fieldBlock(
        "Company",
        textInput(row, "company", { placeholder: "Company name" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Role title",
        textInput(row, "role_title", { placeholder: "Job title" }),
      ),
    );
    grid.append(
      fieldBlock("Career path", selectInput(row, "career_path", PATH_OPTIONS)),
    );
    grid.append(
      fieldBlock("Status", selectInput(row, "status", STATUS_OPTIONS)),
    );
    grid.append(
      fieldBlock("Priority", selectInput(row, "priority", PRIORITY_OPTIONS)),
    );
    grid.append(
      fieldBlock("Work mode", selectInput(row, "work_mode", WORK_MODE_OPTIONS)),
    );
    grid.append(
      fieldBlock(
        "Location",
        textInput(row, "location", { placeholder: "City, country, remote…" }),
      ),
    );
    grid.append(
      fieldBlock("Source", selectInput(row, "source", SOURCE_OPTIONS)),
    );
    grid.append(
      fieldBlock("Found on", textInput(row, "found_on", { type: "date" })),
    );
    grid.append(
      fieldBlock("Applied on", textInput(row, "applied_on", { type: "date" })),
    );
    grid.append(
      fieldBlock(
        "Subscribed on",
        textInput(row, "applied_date", { type: "date" }),
      ),
    );
    grid.append(
      fieldBlock("Result", selectInput(row, "result", RESULT_OPTIONS)),
    );
    grid.append(
      fieldBlock("Result on", textInput(row, "result_on", { type: "date" })),
    );
    grid.append(
      fieldBlock(
        "Next action",
        textInput(row, "next_action", { placeholder: "What to do next" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Next action date",
        textInput(row, "next_action_date", { type: "date" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Salary range",
        textInput(row, "salary_range", { placeholder: "e.g. R$ 12–15k" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Interest (1–5)",
        textInput(row, "fit_interest", { type: "number" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Match score (1–10)",
        textInput(row, "match_score", { type: "number" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Recommended resume",
        selectInput(row, "recommended_resume", [
          { key: "", label: "(none)" },
          ...RESUME_OPTIONS.map((r) => ({ key: r, label: r })),
        ]),
      ),
    );
    grid.append(
      fieldBlock(
        "New import tag",
        selectInput(row, "is_new", [
          { key: "1", label: "Yes (show New badge)" },
          { key: "", label: "No" },
        ]),
      ),
    );
    grid.append(
      fieldBlock(
        "Contact person",
        textInput(row, "contact_person", { placeholder: "Name" }),
      ),
    );
    grid.append(
      fieldBlock(
        "Contact note",
        textInput(row, "contact_note", { placeholder: "How you know them" }),
      ),
    );
    body.append(grid);

    const urlBlock = document.createElement("div");
    urlBlock.className = "job-url-block";
    const urlField = fieldBlock(
      "Job posting URL (source page)",
      textInput(row, "job_url", { placeholder: "https://…/jobs/…" }),
    );
    urlBlock.append(urlField);
    if (cell(row.job_url)) {
      const link = document.createElement("a");
      link.className = "company-result-link";
      link.href = cell(row.job_url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open posting →";
      urlBlock.append(link);
    }
    body.append(urlBlock);

    body.append(
      fieldBlock(
        "Match reason",
        textInput(row, "match_reason", {
          tall: true,
          rows: 3,
          placeholder: "Why this score…",
        }),
      ),
    );
    body.append(
      fieldBlock(
        "Skills gap / blockers",
        textInput(row, "skills_gap", {
          tall: true,
          rows: 3,
          placeholder: "What you still need…",
        }),
      ),
    );
    body.append(
      fieldBlock(
        "Job / project description",
        textInput(row, "job_description", {
          tall: true,
          rows: 8,
          placeholder: "Paste JD / project description here…",
        }),
      ),
    );
    body.append(
      fieldBlock(
        "Notes",
        textInput(row, "notes", {
          tall: true,
          rows: 4,
          placeholder: "Free notes…",
        }),
      ),
    );

    renderApplicationFormPanel(row, body);
    renderCoverLetterPanel(row, body);

    const related = platforms.filter(
      (p) => cell(p.company_key) === cell(row.company_key),
    );
    if (related.length) {
      const block = document.createElement("div");
      block.className = "job-related-platforms";
      const lab = document.createElement("div");
      lab.className = "company-research-label";
      lab.textContent = "Career pages for this company";
      block.append(lab);
      const ul = document.createElement("ul");
      for (const p of related) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = cell(p.url);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = cell(p.label) || cell(p.url);
        li.append(a);
        ul.append(li);
      }
      block.append(ul);
      body.append(block);
    }

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
    del.textContent = "Delete opening";
    del.title = "Delete opening (Alt+Delete)";
    del.addEventListener("click", () => deleteOpening(row.id));
    actions.append(done, del);
    body.append(actions);
  }

  function unwrapSameMarkdownLink(raw) {
    const text = cell(raw).trim();
    const md = text.match(/^\[([^\[\]]+)\]\(([^)]+)\)$/);
    if (!md) return cell(raw);
    const label = md[1].trim();
    const target = md[2].trim();
    if (label && label === target) return label;
    return cell(raw);
  }

  function cleanUrlValue(raw) {
    let u = cell(raw).trim();
    if (!u) return "";
    const md = u.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (md) {
      const a = md[1].trim();
      const b = md[2].trim();
      if (/^https?:\/\//i.test(a)) return a;
      if (/^https?:\/\//i.test(b) && !/google\.com\/search/i.test(b)) return b;
    }
    const found = u.match(/https?:\/\/[^\s\]\)"'<>]+/i);
    return found ? found[0].replace(/[.,);'"]+$/, "") : u;
  }

  async function startAutofillForOpening(row) {
    if (!row || !row.id) return;
    const parsed = parseApplicationAnswers(row.application_answers);
    const formUrl =
      cleanUrlValue(row.form_url) || cleanUrlValue(parsed?.form_url) || "";
    const jobUrl = cleanUrlValue(row.job_url);
    const openUrl = formUrl || jobUrl;
    const hasPayload = !!(parsed && parsed.fields && parsed.fields.length);
    try {
      const res = await fetch("/api/autofill/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set",
          job_id: row.id,
          job_url: jobUrl,
          form_url: formUrl,
          role_title: cell(row.role_title),
          company: cell(row.company),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);

      const extId = window.localStorage.getItem("career-autofill-extension-id");
      if (
        extId &&
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.sendMessage
      ) {
        try {
          chrome.runtime.sendMessage(extId, {
            type: "OPEN_SIDEPANEL",
            jobId: row.id,
          });
        } catch {
          /* fall through */
        }
      }

      if (openUrl) {
        try {
          await fetch("/api/open-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: openUrl }),
          });
        } catch {
          window.open(openUrl, "_blank", "noopener,noreferrer");
        }
      }

      setSaveStatus(
        hasPayload
          ? "Payload ready — open the extension side panel on the form tab and click Fill this page."
          : "No imported JSON yet — generate a form prompt, import AI JSON, then fill.",
      );
      window.alert(
        [
          hasPayload
            ? `Ready to fill (${parsed.fields.length} fields):`
            : "No form answers imported yet:",
          `${cell(row.company)} — ${cell(row.role_title)}`,
          "",
          formUrl
            ? `Form page: ${formUrl}`
            : "No application form URL set — edit “Application form URL” on this dossier.",
          jobUrl && jobUrl !== formUrl ? `Source page: ${jobUrl}` : "",
          "",
          hasPayload
            ? [
                "1) Confirm the form tab is open (must match Application form URL).",
                "2) Open Career Cockpit Autofill → side panel.",
                "3) Click Fill this page.",
              ].join("\n")
            : [
                "1) Set Application form URL on this dossier.",
                "2) Generate form prompt → Import form JSON.",
                "3) Then click Fill with extension again.",
              ].join("\n"),
          "",
          "The extension never clicks Submit/Apply.",
        ]
          .filter(Boolean)
          .join("\n"),
      );
    } catch (err) {
      window.alert(`Could not prepare autofill: ${err.message || err}`);
    }
  }

  function addOpening() {
    const row = blankOpening();
    openings.unshift(row);
    setDirty(true);
    setSaveStatus("");
    statusFilter = "";
    pathFilter = "";
    priorityFilter = "";
    resultFilter = "";
    query = "";
    const search = document.getElementById("job-search-input");
    if (search) search.value = "";
    hideSearchBar({ focusCard: false });
    render();
    openModal(row.id);
    return row;
  }

  function deleteOpening(id, { confirmDelete = true } = {}) {
    const targetId = id || openJobId;
    if (!targetId) return false;
    if (confirmDelete && !confirm("Delete this job opening?")) return false;
    const idx = openings.findIndex((r) => r.id === targetId);
    if (idx < 0) return false;
    openings.splice(idx, 1);
    setDirty(true);
    setSaveStatus("");
    if (openJobId === targetId) closeModal();
    else render();
    return true;
  }

  function blankOpening() {
    const n = openings.length + 1;
    return {
      id: `job-new-${Date.now()}`,
      sort_order: String(n),
      pinned: "",
      company: "",
      company_key: "",
      role_title: "",
      career_path: "other",
      job_url: "",
      form_url: "",
      status: "watching",
      priority: "medium",
      work_mode: "unknown",
      location: "",
      source: "other",
      found_on: "",
      applied_on: "",
      applied_date: todayISO(),
      next_action: "Capture JD",
      next_action_date: "",
      salary_range: "",
      fit_interest: "3",
      skills_gap: "",
      job_description: "",
      notes: "",
      contact_person: "",
      contact_note: "",
      is_new: "1",
      match_score: "",
      match_reason: "",
      recommended_resume: "",
      result: "",
      result_on: "",
      application_answers: "",
      application_form_raw: "",
      cover_letter: "",
      cover_letter_lang: "",
      cover_letter_greeting: "",
      cover_letter_closing: "",
    };
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through */
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  async function signalPromptCopied() {
    try {
      await fetch("/api/prompt-hotkey", { method: "POST" });
    } catch {
      /* AutoHotkey chord is optional */
    }
  }

  function showToast(message, ms = 2000) {
    const el = document.getElementById("job-toast");
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      el.hidden = true;
      el.textContent = "";
    }, ms);
  }

  function companyOptions() {
    const companies = Array.isArray(collections.companies)
      ? collections.companies
      : [];
    return [...companies].sort((a, b) =>
      cell(a.name_en || a.id).localeCompare(cell(b.name_en || b.id)),
    );
  }

  function fillPromptCompanySelect() {
    const sel = document.getElementById("prompt-company");
    if (!sel) return;
    const prev = sel.value;
    sel.replaceChildren();
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Select a company…";
    sel.append(blank);
    for (const c of companyOptions()) {
      const o = document.createElement("option");
      o.value = cell(c.id);
      o.textContent = cell(c.name_en) || cell(c.id);
      sel.append(o);
    }
    if (prev && [...sel.options].some((o) => o.value === prev)) {
      sel.value = prev;
    }
  }

  async function fetchPromptContext() {
    if (promptContextCache) return promptContextCache;
    const res = await fetch("/api/prompt-context");
    if (!res.ok)
      throw new Error(`GET /api/prompt-context failed (${res.status})`);
    promptContextCache = await res.json();
    return promptContextCache;
  }

  async function fetchDownloads() {
    if (downloadsCache) return downloadsCache;
    const res = await fetch("/api/downloads");
    if (!res.ok) throw new Error(`GET /api/downloads failed (${res.status})`);
    downloadsCache = await res.json();
    return downloadsCache;
  }

  function preferredResumeLang() {
    return getLangMode() === "pt" ? "pt" : "en";
  }

  /**
   * Language for materials sent to the employer (résumé, cover letter).
   * Driven by the opening/company locale — not the cockpit UI language.
   */
  function guessApplicationLang(opening) {
    const location = cell(opening?.location);
    const company = cell(opening?.company);
    const role = cell(opening?.role_title);
    const jd = cell(opening?.job_description);
    const blob = [location, company, role, jd].join(" ").toLowerCase();

    const ptSignals =
      /\b(brasil|brazil|brasileir|campinas|são paulo|sao paulo|rio de janeiro|curitiba|belo horizonte|porto alegre|brasília|brasilia|remot[oa]\s*(no\s*)?brasil|work\s*mode.*brasil)/i.test(
        blob,
      ) ||
      /\b(sp|rj|mg|pr|rs|sc|df)\b[,.]?\s*(brasil|brazil)?/i.test(location) ||
      (/[áàâãéêíóôõúç]/i.test(jd) &&
        !/\b(united states|usa|u\.s\.|united kingdom|uk|canada|remote,\s*united)/i.test(
          blob,
        ));

    const enSignals =
      /\b(united states|usa|u\.s\.a?\.?|united kingdom|u\.k\.|england|scotland|ireland|canada|germany|netherlands|remote,\s*united|english[- ]speaking)/i.test(
        blob,
      ) ||
      /\b(gitlab|google|microsoft|amazon|meta|apple|netflix|spotify)\b/i.test(
        company,
      );

    if (ptSignals && !enSignals) return "pt";
    if (enSignals) return "en";
    if (ptSignals) return "pt";

    const saved = cell(opening?.cover_letter_lang).toLowerCase();
    if (saved === "pt" || saved === "en") return saved;
    return preferredResumeLang();
  }

  function guessCoverLang(opening) {
    return guessApplicationLang(opening);
  }

  function joinFsPath(root, ...parts) {
    const base = cell(root).replace(/[\\/]+$/, "");
    const sep = base.includes("\\") ? "\\" : "/";
    return [base, ...parts.map((p) => cell(p).replace(/^[/\\]+/, ""))].join(
      sep,
    );
  }

  async function resolveResumeFile(variant, opening) {
    const v = cell(variant);
    if (!v || !RESUME_OPTIONS.includes(v)) return null;
    // Always refresh — build status / abs_path can change without a full reload
    downloadsCache = null;
    const data = await fetchDownloads();
    const items = Array.isArray(data.items) ? data.items : [];
    const outputDir = cell(data.output_dir);
    const lang = opening
      ? guessApplicationLang(opening)
      : preferredResumeLang();
    const resumes = items.filter(
      (it) => cell(it.kind) === "resume" && cell(it.variant) === v,
    );
    if (!resumes.length) return { error: "unknown_variant" };
    const preferred =
      resumes.find((it) => cell(it.lang) === lang) ||
      resumes.find((it) => cell(it.lang) === "en") ||
      resumes.find((it) => it.available !== false) ||
      resumes[0];
    const available = preferred && preferred.available !== false;
    let absPath = cell(preferred?.abs_path);
    if (
      !absPath &&
      outputDir &&
      preferred &&
      cell(preferred.filename) &&
      cell(preferred.variant)
    ) {
      absPath = joinFsPath(
        outputDir,
        cell(preferred.variant),
        cell(preferred.filename),
      );
    }
    if (!available && !absPath) {
      return { error: "missing_pdf", variant: v };
    }
    if (!absPath) {
      return { error: "no_abs_path", variant: v };
    }
    return {
      absPath,
      filename: cell(preferred.filename),
      lang: cell(preferred.lang) || lang,
      requestedLang: lang,
      url: cell(preferred.url),
      viewUrl:
        cell(preferred.view_url) ||
        (cell(preferred.url)
          ? `${cell(preferred.url)}${cell(preferred.url).includes("?") ? "&" : "?"}inline=1`
          : ""),
      available: !!available,
    };
  }

  function existingOpeningsForCompany(companyKey) {
    const key = cell(companyKey).toLowerCase();
    if (!key) return [];
    return openings.filter((o) => {
      const ck = cell(o.company_key).toLowerCase();
      const cid = cell(o.company).toLowerCase();
      return (
        ck === key || ck.includes(key) || key.includes(ck) || cid.includes(key)
      );
    });
  }

  function buildAiInstructions(careerPaths, hasIgnoreRules) {
    const paths = careerPaths.length
      ? careerPaths.join(" | ")
      : "uxr | da | po | dsa | other";
    const steps = [
      "=== AIB PROCESSING INSTRUCTIONS (mandatory) ===",
      "Return every IT opening. The user deletes what they do not want.",
      "Profile, target titles, skills, and career path are scoring context only.",
      "They never remove an opening. A weak match is still returned.",
      "Omitting an IT title, including a software or data architect, is a failed answer.",
      "1. Extract every distinct job opening from the UNSTRUCTURED JOB DATA below.",
      "   Each role title is its own opening. A different requisition number is a different",
      "   opening. Do not merge 'Arquitetura de Software e Dados' into another",
      "   'Desenvolvimento Tecnológico' title.",
      "2. Skip an EXISTING OPENING only when the requisition number matches, or the full",
      "   title and location match. A related title is not a duplicate.",
      "3. KEEP every IT or UX opening. IT means software, data, architecture, automation,",
      "   development, digital, systems, analytics, AI, technology, or research that the",
      "   paste does not clearly place outside IT. UX means user research, UX/UI or product design,",
      "   interaction design, design technologist, service design, HCI, usability, accessibility,",
      "   or design systems. Junior, pleno, and especialista all stay.",
      "   Seniority and how close the title is to the profile do not matter.",
      "4. DROP only a posting that is not IT or UX: compensation, HR, legal, finance, facilities,",
      "   a pure trade such as electrical maintenance, or a talent bank with no role title.",
      "   Required keeps from a mixed paste: 'Analista de Desenvolvimento Tecnológico Jr",
      "   (445882)', 'Especialista Desenvolvimento Tecnológico (Arquitetura de Software e",
      "   Dados) nº 424918', and 'Especialista Desenvolvimento Tecnológico (Automação e",
      "   Software de Controle) nº 425100'. Also keep 'Pesquisador' or 'UX Researcher'.",
      "   Drop 'Remuneração', 'Manutenção Elétrica', and 'Banco de Talentos' with no role.",
    ];
    let n = 5;
    if (hasIgnoreRules) {
      steps.push(
        `${n}. IGNORE / DO NOT CONSIDER removes only non-IT and non-UX postings. It never removes software,`,
        "   data, architecture, automation, development, UX, research, or any other IT/UX title.",
      );
      n += 1;
    }
    steps.push(
      `${n}. For every kept opening, set match_score from 1 to 10 against PROFILE CONTEXT`,
      "   and explain the fit briefly in match_reason. Use 1-4 for a slight or uncertain fit.",
      "   match_score never decides inclusion. A score of 1 is still returned.",
      "   match_reason follows VOICE. When the paste already describes the role,",
      "   job_description keeps that wording instead of a rewritten summary.",
      `${n + 1}. Set career_path to exactly one of the selected contexts: ${paths}.`,
      "   Pick the closest selected path. This label is not a reason to drop the opening.",
      `${n + 2}. Set recommended_resume to exactly one of:`,
      "   ux-researcher | general | data-analyst | product-owner | digital-solution-architect.",
      `${n + 3}. Set is_new to "1", status to "saved", source to "company_site" unless`,
      "   another source is obvious, and fill found_on with today's date (YYYY-MM-DD).",
      "   Leave applied_date empty. The cockpit records the subscription date on import.",
      "   Leave result and result_on empty (historic outcome is set manually later).",
      `${n + 4}. Return ONLY a JSON array (no markdown fences, no prose before/after).`,
      "   The array must contain every kept opening, not a top-1 or top-N sample.",
      "   Every object MUST include exactly these keys:",
      OPENING_FIELDS.join(", "),
      `${n + 5}. Use empty strings for unknown optional fields. Do not invent job_url values;`,
      "   leave job_url empty when not present in the source text.",
      `${n + 6}. company_key must match the selected company id provided above.`,
      `${n + 7}. Prefer concise job_description (requirements + responsibilities).`,
      "   If the paste has only a title and location, keep the opening and leave the",
      "   description short. Missing detail is not a reason to drop it.",
    );
    return steps.join("\n");
  }

  function pathSlugFor(careerPath) {
    if (careerPath === "uxr") return "ux-researcher";
    if (careerPath === "da") return "data-analyst";
    if (careerPath === "po") return "product-owner";
    if (careerPath === "dsa") return "digital-solution-architect";
    return "";
  }

  async function buildJobPrompt(companyKey, careerPaths, rawText, ignoreText) {
    const paths = (Array.isArray(careerPaths) ? careerPaths : [careerPaths])
      .map((p) => cell(p).toLowerCase())
      .filter(Boolean);
    const effectivePaths = paths.length ? paths : ["uxr"];
    const ignoreRules = (() => {
      const DEFAULT_IGNORE =
        "- not IT / technology (compensation, HR, legal, finance, facilities, pure trades such as electrical maintenance). Every technology title stays, including UX research, design technology, software architecture, data, automation, and product.";
      const custom = cell(ignoreText).trim();
      if (!custom) return DEFAULT_IGNORE;
      const lower = custom.toLowerCase();
      if (
        lower.includes("nothing non it related") ||
        lower.includes("clearly outside technology") ||
        lower.includes("every it title stays")
      ) {
        return custom;
      }
      return `${DEFAULT_IGNORE}\n${custom}`;
    })();

    const ctx = await fetchPromptContext();
    const companies = Array.isArray(collections.companies)
      ? collections.companies
      : [];
    const company = companies.find((c) => cell(c.id) === companyKey) || null;
    const companyName = company
      ? cell(company.name_en) || companyKey
      : companyKey;

    const variants = new Set(
      effectivePaths.map((p) => PATH_TO_VARIANT[p] || "ux-researcher"),
    );

    const skills = (ctx.skills || []).filter((s) =>
      variants.has(cell(s.variant) || "ux-researcher"),
    );
    const narratives = (ctx.narratives || []).filter((n) =>
      variants.has(cell(n.variant) || "ux-researcher"),
    );
    const pathSlugs = new Set(
      effectivePaths.map(pathSlugFor).filter(Boolean).concat(effectivePaths),
    );
    const titles = (ctx.targetTitles || []).filter((t) => {
      if (effectivePaths.includes("other") && effectivePaths.length === 1) {
        return true;
      }
      const p = cell(t.path);
      return pathSlugs.has(p);
    });
    const experience = (ctx.experience || []).slice(0, 6);
    const existing = existingOpeningsForCompany(companyKey);

    const focusLabel = effectivePaths
      .map((p) => `${pathLabel(p)} (${PATH_TO_VARIANT[p] || "ux-researcher"})`)
      .join("; ");

    const profile = (ctx.profile && ctx.profile[0]) || {};
    const lines = [];
    lines.push("You are my AI companion (AIB) for job-opening extraction.");
    lines.push(
      "Return every IT opening in the paste. Profile, target titles, skills, and career path fill scores and labels only. They never decide which openings to drop.",
    );
    lines.push("");
    lines.push(HUMAN_VOICE);
    lines.push("");
    lines.push("=== PROFILE CONTEXT ===");
    lines.push(
      `Name: ${cell(profile.display_name) || cell(profile.full_name)}`,
    );
    lines.push(`Location: ${cell(profile.location_en)}`);
    lines.push(`Languages: ${cell(profile.languages_en)}`);
    lines.push(`Email: ${cell(profile.email)}`);
    lines.push(`LinkedIn: ${cell(profile.linkedin_url)}`);
    lines.push(`Career path focus (label only, not a filter): ${focusLabel}`);
    lines.push("");

    const tagline = narratives.find((n) => cell(n.field) === "tagline");
    const summary = narratives.find((n) => cell(n.field) === "profile");
    if (tagline) lines.push(`Tagline: ${cell(tagline.text_en)}`);
    if (summary) lines.push(`Profile summary: ${cell(summary.text_en)}`);
    lines.push("");

    lines.push("=== TARGET TITLES ===");
    for (const t of titles) {
      lines.push(`- ${cell(t.title_en)} (${cell(t.kind_en) || "title"})`);
    }
    if (!titles.length) lines.push("- (none listed)");
    lines.push("");

    lines.push("=== SKILLS ===");
    const core = skills.filter((s) => cell(s.category) === "Core");
    const tech = skills.filter((s) => cell(s.category) === "Tech");
    lines.push("Core:");
    for (const s of core) lines.push(`- ${cell(s.label_en)}`);
    lines.push("Tech:");
    for (const s of tech) lines.push(`- ${cell(s.label_en)}`);
    lines.push("");

    lines.push("=== RECENT EXPERIENCE ===");
    for (const e of experience) {
      lines.push(
        `- ${cell(e.title_en)} @ ${cell(e.company_en)} (${cell(e.date_display_en)})`,
      );
      if (cell(e.description_en)) {
        lines.push(`  ${cell(e.description_en).slice(0, 280)}`);
      }
    }
    lines.push("");

    lines.push("=== SELECTED COMPANY ===");
    lines.push(`company_key / id: ${companyKey}`);
    lines.push(`name: ${companyName}`);
    if (company) {
      lines.push(`careers_url: ${cell(company.careers_url)}`);
      lines.push(`ats_url: ${cell(company.ats_url)}`);
      lines.push(`website: ${cell(company.website)}`);
      lines.push(`skills_match: ${cell(company.skills_match_en)}`);
    }
    lines.push("");

    lines.push(
      "=== EXISTING OPENINGS FOR THIS COMPANY (skip only an exact duplicate) ===",
    );
    if (!existing.length) {
      lines.push("(none yet)");
    } else {
      for (const o of existing) {
        lines.push(
          `- id=${cell(o.id)} | ${cell(o.role_title)} | ${cell(o.location)} | status=${cell(o.status)} | url=${cell(o.job_url)}`,
        );
      }
    }
    lines.push("");

    if (ignoreRules) {
      lines.push("=== IGNORE / DO NOT CONSIDER ===");
      lines.push(
        "Drop an opening only when it is not IT. An IT title always stays:",
      );
      lines.push(ignoreRules);
      lines.push("");
    }

    lines.push("=== UNSTRUCTURED JOB DATA ===");
    lines.push(rawText.trim() || "(empty)");
    lines.push("");
    lines.push(buildAiInstructions(effectivePaths, !!ignoreRules));
    return lines.join("\n");
  }

  function promptPathBoxes() {
    return [
      ...document.querySelectorAll(
        '#prompt-paths input[type="checkbox"][name="prompt-path"]',
      ),
    ];
  }

  function syncSelectAllPaths() {
    const all = document.getElementById("prompt-path-all");
    if (!all) return;
    const boxes = promptPathBoxes();
    const checked = boxes.filter((el) => el.checked).length;
    all.checked = boxes.length > 0 && checked === boxes.length;
    all.indeterminate = checked > 0 && checked < boxes.length;
  }

  function selectedPromptPaths() {
    return promptPathBoxes()
      .filter((el) => el.checked)
      .map((el) => cell(el.value).toLowerCase());
  }

  async function handleCopyPrompt() {
    const companyKey = cell(document.getElementById("prompt-company")?.value);
    const careerPaths = selectedPromptPaths();
    const ignoreText = cell(document.getElementById("prompt-ignore")?.value);
    const rawText = cell(document.getElementById("prompt-raw")?.value);
    const status = document.getElementById("prompt-status");
    if (!companyKey) {
      if (status) {
        status.textContent = "Pick a company first.";
        status.className = "save-status err";
      }
      return;
    }
    if (!careerPaths.length) {
      if (status) {
        status.textContent = "Pick at least one career path.";
        status.className = "save-status err";
      }
      return;
    }
    if (!rawText.trim()) {
      if (status) {
        status.textContent = "Paste unstructured job data first.";
        status.className = "save-status err";
      }
      return;
    }
    const button = document.getElementById("prompt-copy-btn");
    if (button) button.disabled = true;
    setPromptGenerating("prompt-modal", true);
    if (status) {
      status.textContent = "Generating the prompt…";
      status.className = "save-status";
    }
    let prompt = "";
    try {
      prompt = await buildJobPrompt(
        companyKey,
        careerPaths,
        rawText,
        ignoreText,
      );

      // Always copy to clipboard first as a guaranteed baseline
      try {
        await navigator.clipboard.writeText(prompt);
      } catch {
        /* ignore */
      }

      let sentOk = false;
      try {
        const res = await fetch("/api/prompt-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: prompt }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok !== false) {
          sentOk = true;
        }
      } catch {
        /* backend send failed, clipboard fallback will proceed */
      }

      if (sentOk) {
        showToast(
          "Prompt sent to AI companion. Paste the JSON reply here.",
          3000,
        );
      } else {
        showToast(
          "Prompt copied to clipboard. Paste into your AI companion.",
          3500,
        );
      }
      closePromptModal();
      openImportModal({
        note: sentOk
          ? "Prompt sent. Paste the companion’s JSON here."
          : "Prompt copied to clipboard. Paste into your companion, then paste the JSON here.",
      });
    } catch (err) {
      if (prompt) {
        try {
          await navigator.clipboard.writeText(prompt);
          showToast("Prompt copied to clipboard.", 3000);
          closePromptModal();
          openImportModal({
            note: "Prompt copied to clipboard. Paste into your companion, then paste the JSON here.",
          });
          return;
        } catch {
          /* ignore */
        }
      }
      if (status) {
        status.textContent = err.message || String(err);
        status.className = "save-status err";
      }
    } finally {
      setPromptGenerating("prompt-modal", false);
      if (button) button.disabled = false;
    }
  }

  function stripMarkdownFences(text) {
    let t = String(text || "").trim();
    if (t.startsWith("```")) {
      t = t.replace(/^```(?:json|xml)?\s*/i, "");
      t = t.replace(/\s*```$/i, "");
    }
    return t.trim();
  }

  function parseImportPayload(text) {
    const cleaned = stripMarkdownFences(text);
    if (!cleaned) throw new Error("Empty import payload");
    if (cleaned.trimStart().startsWith("<")) {
      throw new Error(
        "XML import is not enabled yet. Return a JSON array instead.",
      );
    }
    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("JSON parse failed: " + (err.message || String(err)));
    }
    if (!Array.isArray(data)) {
      if (data && typeof data === "object" && Array.isArray(data.openings)) {
        data = data.openings;
      } else {
        throw new Error("Payload must be a JSON array of openings");
      }
    }
    if (!data.length) throw new Error("JSON array is empty");
    return data;
  }

  function normalizeImportedRow(raw, index, stamp) {
    if (!raw || typeof raw !== "object") {
      throw new Error(`Row ${index} is not an object`);
    }
    const row = {};
    for (const key of OPENING_FIELDS) {
      row[key] = cell(raw[key]);
    }
    if (!cell(row.company_key) && launchCompanyKey) {
      row.company_key = launchCompanyKey;
      if (!cell(row.company)) {
        const company = companyOptions().find(
          (c) => cell(c.id) === launchCompanyKey,
        );
        row.company = company
          ? cell(company.name_en) || launchCompanyKey
          : launchCompanyKey;
      }
    }
    const companyKey = row.company_key || "company";
    if (!row.id) row.id = `job-${companyKey}-${stamp}-${index}`;
    if (!row.sort_order) row.sort_order = String(openings.length + index);
    if (!row.status) row.status = "saved";
    if (!row.priority) row.priority = "medium";
    if (!row.career_path) row.career_path = "other";
    if (!row.work_mode) row.work_mode = "unknown";
    if (!row.source) row.source = "company_site";
    row.is_new = "1";
    row.applied_date = todayISO();
    row.result = "";
    row.result_on = "";
    row.application_answers = "";
    row.application_form_raw = "";
    if (!cell(row.role_title)) {
      throw new Error(`Row ${index} missing role_title`);
    }
    return row;
  }

  function openingDedupeKey(row) {
    const url = cell(row.job_url).trim().toLowerCase();
    if (url) return `url:${url}`;
    return [
      cell(row.company_key).toLowerCase(),
      cell(row.role_title).toLowerCase(),
      cell(row.location).toLowerCase(),
    ].join("|");
  }

  function buildAiFixPrompt(errorMsg, brokenInput) {
    const sample = {
      id: "job-bosch-100",
      sort_order: "1",
      company: "Bosch",
      company_key: "bosch-brasil",
      role_title: "Data Analyst",
      career_path: "da",
      job_url: "",
      form_url: "",
      status: "saved",
      priority: "medium",
      work_mode: "hybrid",
      location: "Campinas, SP",
      source: "company_site",
      found_on: "2026-09-22",
      applied_on: "",
      applied_date: "",
      next_action: "Review JD",
      next_action_date: "",
      salary_range: "",
      fit_interest: "4",
      skills_gap: "",
      job_description: "Short JD…",
      notes: "",
      contact_person: "",
      contact_note: "",
      is_new: "1",
      match_score: "8",
      match_reason: "Strong SQL/Power BI overlap",
      recommended_resume: "data-analyst",
      result: "",
      result_on: "",
      application_answers: "",
      application_form_raw: "",
      cover_letter: "",
      cover_letter_lang: "en",
      cover_letter_greeting: "",
      cover_letter_closing: "",
    };
    return [
      "The Job Openings importer rejected my last AI output. Fix and re-deliver.",
      "",
      "IMPORT ERROR",
      errorMsg,
      "",
      "BROKEN INPUT (truncated)",
      String(brokenInput || "").slice(0, 4000),
      "",
      "WHAT YOU MUST DO",
      HUMAN_VOICE,
      "- Return ONLY a valid JSON array (no markdown fences, no commentary).",
      "- Every object must include exactly these keys:",
      OPENING_FIELDS.join(", "),
      "- Use empty strings for unknown optional fields.",
      '- Keep is_new as "1" and status as "saved" for new imports.',
      "- Leave applied_date empty. The cockpit sets the subscription date on import.",
      "- Leave result and result_on empty for new imports (historic outcome is set later).",
      "",
      "EXAMPLE ROW",
      JSON.stringify(sample, null, 2),
      "",
      "DELIVERY RULES (mandatory)",
      "- Output the full corrected JSON array in one message.",
      "- Do not claim the data was saved; I will import it myself.",
    ].join("\n");
  }

  const AI_FIX_COPIED = "AI fix copied. Paste it into your AI companion.";
  const AI_FIX_COPY_FAILED =
    "Could not copy the AI fix. It is in the import box.";

  function importBoxForStatus(statusElId) {
    const boxes = {
      "import-status": "import-raw",
      "form-import-status": "form-import-raw",
      "cover-import-status": "cover-import-raw",
    };
    const id = boxes[statusElId];
    return id ? document.getElementById(id) : null;
  }

  async function deliverAiFixNote(kind, fixPrompt, statusElId) {
    const okCopy = await copyText(fixPrompt);
    if (okCopy) await signalPromptCopied();
    let desktopPath = "";
    try {
      const res = await fetch("/api/ai-fix-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, content: fixPrompt }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok && payload.ok) desktopPath = cell(payload.path);
    } catch {
      /* local write optional */
    }
    const status = statusElId ? document.getElementById(statusElId) : null;
    if (okCopy) {
      const note = desktopPath
        ? `${AI_FIX_COPIED} Desktop note: ${desktopPath}`
        : AI_FIX_COPIED;
      if (status) {
        status.textContent = note;
        status.className = "save-status ok";
      }
      showToast(
        desktopPath
          ? `${AI_FIX_COPIED} Desktop note: ${desktopPath}`
          : AI_FIX_COPIED,
        5000,
      );
    } else {
      const box = importBoxForStatus(statusElId);
      if (box) {
        box.value = fixPrompt;
        box.focus();
        box.select();
      }
      if (status) {
        status.textContent = AI_FIX_COPY_FAILED;
        status.className = "save-status err";
      }
      showToast(AI_FIX_COPY_FAILED, 5000);
    }
    return { okCopy, desktopPath };
  }

  function isAiCompanionImportError(message) {
    const msg = String(message || "").toLowerCase();
    if (!msg) return false;
    // Cockpit / server / tooling — not the AI companion's fault.
    // Every other thrown import error is bad AI output, including duplicates.
    const cockpitHints = [
      "not found",
      "não encontrado",
      "failed to fetch",
      "networkerror",
      "typst",
      "cover letter build failed",
      "cover letter pdf",
      "saving",
      "load error",
      "http error",
      "(404)",
      "(500)",
      "(502)",
      "(503)",
    ];
    return !cockpitHints.some((h) => msg.includes(h));
  }

  async function reportImportFailure(opts) {
    const {
      errorMsg,
      brokenInput,
      kind,
      statusElId,
      buildFixPrompt,
      cockpitLabel,
    } = opts;
    const msg = errorMsg || "Unknown error";
    if (isAiCompanionImportError(msg) && typeof buildFixPrompt === "function") {
      const fix = buildFixPrompt(msg, brokenInput);
      await deliverAiFixNote(kind, fix, statusElId);
      return;
    }
    const status = statusElId ? document.getElementById(statusElId) : null;
    const label = cockpitLabel || "Cockpit error (not AI)";
    if (status) {
      status.textContent = `${label}: ${msg}`;
      status.className = "save-status err";
    }
    showToast(`${label} — not an AI companion issue`, 4500);
  }

  async function failImportWithAiFix(errorMsg, brokenInput) {
    await reportImportFailure({
      errorMsg,
      brokenInput,
      kind: "openings-import",
      statusElId: "import-status",
      buildFixPrompt: buildAiFixPrompt,
      cockpitLabel: "Cockpit error (not AI)",
    });
  }

  function showAlreadyNotice(rows) {
    const bar = document.getElementById("job-already-notice");
    const text = document.getElementById("job-already-notice-text");
    if (!bar || !text) return;
    const titles = rows.map((row) => cell(row.role_title)).filter(Boolean);
    const lead =
      titles.length === 1
        ? `"${titles[0]}" is already on this Job openings page.`
        : `These openings are already on this Job openings page: ${titles.join("; ")}.`;
    text.textContent = `${lead} Hit X to close this notification.`;
    bar.hidden = false;
    bar.scrollIntoView({ block: "nearest" });
  }

  function hideAlreadyNotice() {
    const bar = document.getElementById("job-already-notice");
    if (bar) bar.hidden = true;
  }

  async function importOpenings(text) {
    const rows = parseImportPayload(text);
    const stamp = Date.now();
    const priorKeys = new Set(openings.map(openingDedupeKey));
    const existingKeys = new Set(priorKeys);
    const existingIds = new Set(openings.map((o) => cell(o.id)));
    const imported = [];
    const already = [];
    let skipped = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = normalizeImportedRow(rows[i], i + 1, stamp);
      while (existingIds.has(row.id)) {
        row.id = `${row.id}-${i}`;
      }
      const key = openingDedupeKey(row);
      if (cell(row.status).toLowerCase() === "excluded") {
        skipped += 1;
        continue;
      }
      if (priorKeys.has(key)) {
        skipped += 1;
        already.push(row);
        continue;
      }
      if (existingKeys.has(key)) {
        skipped += 1;
        continue;
      }
      existingKeys.add(key);
      existingIds.add(row.id);
      imported.push(row);
    }
    if (!imported.length && !already.length) {
      throw new Error("No openings to import");
    }
    if (imported.length) {
      openings = [...imported, ...openings];
      collections.jobOpenings = openings;
      setDirty(true);
      setSaveStatus("");
      render();
    }
    return { imported: imported.length, skipped, already };
  }

  async function handleImportRun() {
    const raw = cell(document.getElementById("import-raw")?.value);
    const status = document.getElementById("import-status");
    if (!raw.trim()) {
      if (status) {
        status.textContent = "Paste AI JSON first.";
        status.className = "save-status err";
      }
      return;
    }
    try {
      const result = await importOpenings(raw);
      if (result.already.length) showAlreadyNotice(result.already);
      const dialog = document.getElementById("import-modal");
      if (!result.imported) {
        if (dialog && dialog.open) dialog.close();
        return;
      }
      if (status) {
        status.textContent = `Imported ${result.imported} (skipped ${result.skipped} duplicates).`;
        status.className = "save-status";
      }
      const saved = await flushSave();
      if (saved) {
        if (status) {
          status.textContent = `Imported ${result.imported} (skipped ${result.skipped} duplicates).`;
          status.className = "save-status ok";
        }
        showToast(`Imported ${result.imported} openings`, 2500);
        if (dialog && dialog.open) dialog.close();
      } else if (status) {
        status.textContent = `Imported ${result.imported}, but autosave failed.`;
        status.className = "save-status err";
      }
    } catch (err) {
      await failImportWithAiFix(err.message || String(err), raw);
    }
  }

  function parseApplicationAnswers(raw) {
    const text = cell(raw).trim();
    if (!text) return null;
    try {
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") return null;
      const fields = Array.isArray(data.fields) ? data.fields : null;
      if (!fields) return null;
      return {
        opening_id: cell(data.opening_id),
        recommended_resume: cell(data.recommended_resume),
        form_url: cell(data.form_url),
        source_url: cell(data.source_url),
        imported_at: cell(data.imported_at),
        fields: fields
          .filter((f) => f && typeof f === "object")
          .map((f) => ({
            key: cell(f.key),
            label: cell(f.label) || cell(f.key),
            value: unwrapSameMarkdownLink(f.value),
            source: cell(f.source),
            note: cell(f.note),
          })),
      };
    } catch {
      return null;
    }
  }

  function selectedFormPromptPaths() {
    const id =
      cell(document.getElementById("form-prompt-opening")?.value) ||
      cell(openJobId);
    const row = openings.find((r) => cell(r.id) === id);
    const path = cell(row?.career_path).toLowerCase();
    return path ? [path] : ["other"];
  }

  function fillFormPromptOpeningSelect() {
    const sel = document.getElementById("form-prompt-opening");
    if (!sel) return;
    // Prefer open dossier or focused card so path/raw match the target opening
    const prev = activeOpeningId() || cell(sel.value);
    sel.replaceChildren();
    const rows = openings.slice().sort((a, b) => {
      const ca = cell(a.company).localeCompare(cell(b.company));
      if (ca) return ca;
      return cell(a.role_title).localeCompare(cell(b.role_title));
    });
    if (!rows.length) {
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "(no openings)";
      sel.append(o);
      syncFormPromptPathsFromOpening();
      return;
    }
    for (const row of rows) {
      const o = document.createElement("option");
      o.value = cell(row.id);
      o.textContent =
        (cell(row.company) || cell(row.company_key) || "?") +
        " · " +
        (cell(row.role_title) || "(untitled)");
      sel.append(o);
    }
    if (prev && [...sel.options].some((o) => o.value === prev)) {
      sel.value = prev;
    }
    syncFormPromptPathsFromOpening();
    syncFormPromptRawFromOpening();
  }

  function syncFormPromptPathsFromOpening() {
    const id = cell(document.getElementById("form-prompt-opening")?.value);
    const row = openings.find((r) => cell(r.id) === id);
    const path = cell(row?.career_path).toLowerCase() || "other";
    const labelEl = document.getElementById("form-prompt-path-label");
    if (labelEl) {
      labelEl.textContent = row ? `${pathLabel(path)} (${path})` : "—";
    }
  }

  function syncFormPromptRawFromOpening() {
    void syncFormWindowName();
  }

  async function postCareerAutofill(path, body) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || res.statusText || "Request failed");
    }
    return data;
  }

  function formPromptOpeningId() {
    return (
      cell(document.getElementById("form-prompt-opening")?.value) ||
      activeOpeningId()
    );
  }

  function setFormPromptStatus(text, kind) {
    const status = document.getElementById("form-prompt-status");
    if (!status) return;
    status.textContent = text || "";
    status.className = kind ? `save-status ${kind}` : "save-status";
  }

  async function syncFormWindowName() {
    const input = document.getElementById("form-prompt-window-name");
    const openingId = formPromptOpeningId();
    if (!input || !openingId) return;
    try {
      const res = await fetch(
        "/api/career-autofill/session?" +
          new URLSearchParams({ opening_id: openingId }),
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.window_name) {
        input.value = data.window_name;
        return;
      }
    } catch {
      /* cockpit server offline */
    }
    try {
      const capRes = await fetch("/api/career-autofill/capture-window", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opening_id: openingId }),
      });
      const capData = await capRes.json().catch(() => ({}));
      if (capRes.ok && capData.window_name && !input.value) {
        input.value = capData.window_name;
      }
    } catch {
      /* ignore */
    }
  }

  async function handleBuildAndSendFormPrompt() {
    const openingId = formPromptOpeningId();
    const windowName = cell(
      document.getElementById("form-prompt-window-name")?.value,
    );
    if (!openingId) {
      setFormPromptStatus("Pick an opening first.", "err");
      return;
    }
    if (!windowName) {
      setFormPromptStatus("Type the application tab title first.", "err");
      return;
    }
    const button = document.getElementById("form-prompt-send-btn");
    if (button) button.disabled = true;
    setPromptGenerating("form-prompt-modal", true);
    setFormPromptStatus("Generating the prompt…");
    try {
      const data = await postCareerAutofill(
        "/api/career-autofill/build-and-send",
        { opening_id: openingId, window_name: windowName },
      );
      console.log("[Career Cockpit] build-and-send response:", data);
      showToast("Prompt sent. Paste the JSON reply here.", 2800);
      closeFormPromptModal();
      openFormImportModal({
        openingId,
        note: "Prompt sent. Paste the companion’s JSON here.",
      });
    } catch (err) {
      console.error("[Career Cockpit] build-and-send error:", err);
      setFormPromptStatus(err.message || String(err), "err");
    } finally {
      setPromptGenerating("form-prompt-modal", false);
      if (button) button.disabled = false;
    }
  }

  async function fillFormWithAhk(row) {
    if (!row || !row.id) return;
    setSaveStatus("Filling the application form…");
    try {
      const data = await postCareerAutofill("/api/career-autofill/fill-form", {
        opening_id: row.id,
      });
      const note =
        data.skipped > 0
          ? `Filled ${data.filled}, skipped ${data.skipped}.`
          : `Filled ${data.filled} fields.`;
      setSaveStatus(note, "ok");
      showToast(`${note} The form was not submitted.`, 3500);
      if (data.errors && data.errors.length) {
        window.alert([note, "", ...data.errors].join("\n"));
      }
    } catch (err) {
      const message = err.message || String(err);
      setSaveStatus(message, "err");
      window.alert(message);
    }
  }

  function buildFormFillInstructions(openingId, careerPaths) {
    const paths = careerPaths.length
      ? careerPaths.join(" | ")
      : "uxr | da | po | dsa | other";
    const resumes = RESUME_OPTIONS.join(" | ");
    return [
      "=== AIB FORM-FILL INSTRUCTIONS (mandatory) ===",
      "1. Read ATS / APPLICATION PAGE TEXT and list every distinct form field",
      "   (required and optional) by its on-page label.",
      "2. Resolve each field from PROFILE / EDUCATION / EXPERIENCE / EXPERIENCE BULLETS / NARRATIVES.",
      "   Prefer exact stored values. Never invent email, phone, or URLs.",
      "   Put URLs as the bare https link only. Do not wrap a URL as markdown",
      "   [url](url) when both sides are the same address.",
      "   For Website / Personal Website / Portfolio URL fields, use the",
      "   Portfolio URL from PROFILE CONTEXT matching your chosen",
      "   recommended_resume (never LinkedIn unless the field asks for LinkedIn).",
      "3. Split full_name into first_name / last_name when the form asks for them.",
      "4. For email confirmation fields, repeat the same email value.",
      "5. For phone country / dial code, derive from profile phone when present",
      "   (e.g. +55). Leave empty when unknown.",
      "6. For education / experience multi-entry blocks, use paste-ready facts",
      "   from the context (institution, degree, dates, title, company).",
      "   Keep those rows factual. Do not replace a description with a vague line.",
      "7. Free-text fields that address people are a sales note, not a courtesy",
      "   line. This includes message to the hiring team, cover note, motivation,",
      "   why this role, why this company, additional information, and comments.",
      "   - Write them dense. Name several concrete overlaps with THIS opening:",
      "     tools, methods, and outcomes taken from EDUCATION descriptions,",
      "     EXPERIENCE descriptions, EXPERIENCE BULLETS, and NARRATIVES.",
      "   - Lead with the fit. Do not open with excitement, passion, or alignment.",
      "   - Those answers follow VOICE. Plain and specific. No adjective stacks.",
      "     Never invent employers, dates, degrees, or metrics.",
      "   - If the form shows a character limit, spend most of it on the strongest",
      "     matches. If it does not, write about 120-180 words.",
      "   - Use the page language, and the EN or PT description that matches it.",
      `8. Prefer narratives/skills for career paths: ${paths}.`,
      "9. Choose exactly one résumé variant to upload for this opening.",
      `   Set top-level recommended_resume to one of: ${resumes}.`,
      "   Pick the best match for the role title, career path, and ATS text",
      "   (not only the current opening.recommended_resume if a better fit exists).",
      "10. For résumé / file upload fields, set value to empty string and put a",
      "   note naming the chosen variant, e.g.:",
      '   "Upload manually — use ux-researcher resume".',
      "11. Match label language to the page (PT or EN). Keep key as snake_case English.",
      "12. Return ONLY one JSON object (no markdown fences, no prose):",
      '    { "opening_id": "' +
        openingId +
        '", "recommended_resume": "<one of the variants>",',
      '      "form_url": "<exact URL of the application form page>",',
      '      "source_url": "<job posting URL if different>",',
      '      "fields": [ { "key", "label", "value", "source", "note?" } ] }',
      "13. Include every visible form field. Use empty value when unknown.",
      "14. opening_id must equal the selected opening id provided above.",
      "15. form_url must be the page you extracted (application form). source_url",
      "    is the main job posting URL when it differs from the form page.",
    ].join("\n");
  }

  async function buildFormFillPrompt(openingId, careerPaths, rawFormText) {
    const paths = (Array.isArray(careerPaths) ? careerPaths : [careerPaths])
      .map((p) => cell(p).toLowerCase())
      .filter(Boolean);
    const effectivePaths = paths.length ? paths : ["dsa"];
    const opening =
      openings.find((r) => cell(r.id) === cell(openingId)) || null;
    if (!opening) throw new Error("Opening not found");

    const ctx = await fetchPromptContext();
    const variants = new Set(
      effectivePaths.map((p) => PATH_TO_VARIANT[p] || "ux-researcher"),
    );

    const skills = (ctx.skills || []).filter((s) =>
      variants.has(cell(s.variant) || "ux-researcher"),
    );
    const narratives = (ctx.narratives || []).filter((n) =>
      variants.has(cell(n.variant) || "ux-researcher"),
    );
    const experience = (ctx.experience || []).slice(0, 8);
    const education = (ctx.education || []).slice(0, 8);
    const profile = (ctx.profile && ctx.profile[0]) || {};

    const focusLabel = effectivePaths
      .map((p) => `${pathLabel(p)} (${PATH_TO_VARIANT[p] || "ux-researcher"})`)
      .join("; ");

    const lines = [];
    lines.push(
      "You are my AI companion (AIB) for ATS application form field extraction.",
    );
    lines.push("");
    lines.push(HUMAN_VOICE);
    lines.push("");
    lines.push("=== SELECTED OPENING ===");
    lines.push(`opening_id: ${cell(opening.id)}`);
    lines.push(`company: ${cell(opening.company)}`);
    lines.push(`company_key: ${cell(opening.company_key)}`);
    lines.push(`role_title: ${cell(opening.role_title)}`);
    lines.push(`career_path: ${cell(opening.career_path)}`);
    lines.push(`location: ${cell(opening.location)}`);
    lines.push(`job_url: ${cell(opening.job_url)}`);
    lines.push(`form_url: ${cell(opening.form_url)}`);
    lines.push(
      `recommended_resume (current): ${cell(opening.recommended_resume) || "(none)"}`,
    );
    lines.push(
      `Available résumé variants to choose from: ${RESUME_OPTIONS.join(", ")}`,
    );
    lines.push("");
    lines.push("=== PROFILE CONTEXT ===");
    lines.push(
      `Name: ${cell(profile.display_name) || cell(profile.full_name)}`,
    );
    lines.push(`Full name: ${cell(profile.full_name)}`);
    lines.push(
      `Location: ${cell(profile.location_en) || cell(profile.location_pt)}`,
    );
    lines.push(
      `Languages: ${cell(profile.languages_en) || cell(profile.languages_pt)}`,
    );
    lines.push(`Email: ${cell(profile.email)}`);
    lines.push(`Phone: ${cell(profile.phone)}`);
    lines.push(`RG: ${cell(profile.rg)}`);
    lines.push(`CPF: ${cell(profile.cpf)}`);
    lines.push(`LinkedIn: ${cell(profile.linkedin_url)}`);
    lines.push(`Lattes: ${cell(profile.lattes_url)}`);
    lines.push(`ORCID: ${cell(profile.orcid_url)}`);
    const portfolioBase = "https://duducm2.github.io/my-personal-repo";
    const portfolioByVariant = {
      "ux-researcher": `${portfolioBase}/ux-researcher/`,
      "data-analyst": `${portfolioBase}/data-analyst/`,
      "product-owner": `${portfolioBase}/product-owner/`,
      "digital-solution-architect": `${portfolioBase}/digital-solution-architect/`,
    };
    const defaultVariant = portfolioByVariant[cell(opening.recommended_resume)]
      ? cell(opening.recommended_resume)
      : PATH_TO_VARIANT[effectivePaths[0]] || "ux-researcher";
    lines.push(
      `Portfolio / Personal Website (matched to career path): ${portfolioByVariant[defaultVariant]}`,
    );
    lines.push(
      `Portfolio URLs by résumé variant: ${Object.entries(portfolioByVariant)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ")}`,
    );
    lines.push(`Career path focus: ${focusLabel}`);
    lines.push("");

    const tagline = narratives.find((n) => cell(n.field) === "tagline");
    const summary = narratives.find((n) => cell(n.field) === "profile");
    if (tagline || summary) {
      lines.push("=== NARRATIVES (for hiring message / motivation) ===");
      if (tagline) {
        lines.push(`Tagline: ${cell(tagline.text_en)}`);
      }
      if (summary) {
        lines.push(`Summary: ${cell(summary.text_en)}`);
      }
      lines.push("");
    }

    if (education.length) {
      lines.push("=== EDUCATION ===");
      for (const e of education) {
        lines.push(
          `- ${cell(e.institution_en) || cell(e.institution_pt)} | ${cell(e.location_en) || cell(e.location_pt)} | ${cell(e.degree_en) || cell(e.degree_pt)} | ${cell(e.field_en) || cell(e.field_pt)} | ${cell(e.date_display_en) || cell(e.date_display_pt)}`,
        );
        const eduEn = cell(e.description_detail_en) || cell(e.description_en);
        const eduPt = cell(e.description_detail_pt) || cell(e.description_pt);
        if (eduEn) lines.push(`  EN: ${eduEn}`);
        if (eduPt && eduPt !== eduEn) lines.push(`  PT: ${eduPt}`);
      }
      lines.push("");
    }

    if (experience.length) {
      lines.push("=== EXPERIENCE (recent) ===");
      for (const e of experience) {
        lines.push(
          `- ${cell(e.title_en) || cell(e.title_pt)} @ ${cell(e.company_en) || cell(e.company_pt)} | ${cell(e.date_display_en) || cell(e.date_display_pt)} | ${cell(e.location_en) || cell(e.location_pt)}`,
        );
        const expEn = cell(e.description_detail_en) || cell(e.description_en);
        const expPt = cell(e.description_detail_pt) || cell(e.description_pt);
        if (expEn) lines.push(`  EN: ${expEn}`);
        if (expPt && expPt !== expEn) lines.push(`  PT: ${expPt}`);
      }
      lines.push("");
    }

    const bullets = (ctx.experienceBullets || [])
      .filter((b) => variants.has(cell(b.variant) || "general"))
      .sort((a, b) => {
        const byRole = cell(a.experience_id).localeCompare(
          cell(b.experience_id),
        );
        if (byRole) return byRole;
        return Number(a.sort_order) - Number(b.sort_order);
      });
    if (bullets.length) {
      lines.push("=== EXPERIENCE BULLETS (evidence for hiring messages) ===");
      for (const b of bullets) {
        const bulletEn = cell(b.text_en);
        const bulletPt = cell(b.text_pt);
        if (bulletEn) lines.push(`- ${bulletEn}`);
        if (bulletPt && bulletPt !== bulletEn) lines.push(`  PT: ${bulletPt}`);
      }
      lines.push("");
    }

    if (skills.length) {
      lines.push("=== SKILLS (path-filtered) ===");
      lines.push(
        skills
          .slice(0, 40)
          .map((s) => cell(s.label_en) || cell(s.label_pt))
          .filter(Boolean)
          .join(", "),
      );
      lines.push("");
    }

    lines.push("=== ATS / APPLICATION PAGE TEXT ===");
    lines.push(cell(rawFormText).trim() || "(empty)");
    lines.push("");
    lines.push(buildFormFillInstructions(cell(opening.id), effectivePaths));
    return lines.join("\n");
  }

  async function handleCopyFormPrompt() {
    const openingId = cell(
      document.getElementById("form-prompt-opening")?.value,
    );
    const careerPaths = selectedFormPromptPaths();
    const rawText = cell(document.getElementById("form-prompt-raw")?.value);
    const status = document.getElementById("form-prompt-status");
    if (!openingId) {
      if (status) {
        status.textContent = "Pick an opening first.";
        status.className = "save-status err";
      }
      return;
    }
    if (!careerPaths.length) {
      if (status) {
        status.textContent = "Opening has no career path set.";
        status.className = "save-status err";
      }
      return;
    }
    if (!rawText.trim()) {
      if (status) {
        status.textContent = "Paste ATS / application page text first.";
        status.className = "save-status err";
      }
      return;
    }
    const opening = openings.find((r) => cell(r.id) === openingId);
    if (opening) {
      opening.application_form_raw = rawText;
      setDirty(true);
    }
    if (status) {
      status.textContent = "Building prompt…";
      status.className = "save-status";
    }
    try {
      const prompt = await buildFormFillPrompt(openingId, careerPaths, rawText);
      const ok = await copyText(prompt);
      if (ok) {
        await signalPromptCopied();
        if (status) {
          status.textContent = "Prompt copied — closing in 3s…";
          status.className = "save-status ok";
        }
        showToast("Form prompt copied — paste into your AI companion", 2500);
        startFormPromptAutoClose();
      } else {
        const rawEl = document.getElementById("form-prompt-raw");
        if (rawEl) {
          rawEl.value = prompt;
          rawEl.focus();
          rawEl.select();
        }
        if (status) {
          status.textContent =
            "Clipboard blocked — prompt filled in the box; press Ctrl+C.";
          status.className = "save-status ok";
        }
        showToast("Prompt ready — press Ctrl+C to copy", 3500);
        cancelFormPromptAutoClose();
      }
    } catch (err) {
      if (status) {
        status.textContent = "Error: " + (err.message || String(err));
        status.className = "save-status err";
      }
    }
  }

  function parseFormImportPayload(text) {
    const cleaned = stripMarkdownFences(text);
    if (!cleaned) throw new Error("Empty form import payload");
    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("Invalid JSON: " + (err.message || String(err)));
    }
    if (Array.isArray(data)) {
      throw new Error(
        "Expected a JSON object with fields[], not an array (openings import shape).",
      );
    }
    if (!data || typeof data !== "object") {
      throw new Error("Expected a JSON object");
    }
    if (!Array.isArray(data.fields)) {
      throw new Error('Missing "fields" array');
    }
    const fields = [];
    for (let i = 0; i < data.fields.length; i++) {
      const f = data.fields[i];
      if (!f || typeof f !== "object") {
        throw new Error(`fields[${i}] is not an object`);
      }
      const key = cell(f.key);
      const label = cell(f.label) || key;
      if (!key && !label) {
        throw new Error(`fields[${i}] missing key/label`);
      }
      fields.push({
        key: key || `field_${i + 1}`,
        label,
        value: unwrapSameMarkdownLink(f.value),
        source: cell(f.source),
        note: cell(f.note),
      });
    }
    return {
      opening_id: cell(data.opening_id),
      recommended_resume: cell(data.recommended_resume),
      form_url: cell(data.form_url),
      source_url: cell(data.source_url),
      imported_at: cell(data.imported_at),
      fields,
    };
  }

  function applyFormAnswers(payload) {
    let openingId = cell(payload.opening_id);
    if (!openingId) openingId = openJobId;
    if (!openingId) {
      openingId = cell(document.getElementById("form-prompt-opening")?.value);
    }
    let row = openings.find((r) => cell(r.id) === openingId) || null;
    if (!row && activeOpeningId()) {
      row = activeOpening();
      openingId = activeOpeningId();
    }
    if (!row) {
      throw new Error(
        "No matching opening for opening_id — focus a card, open a dossier, or set opening_id.",
      );
    }
    const resume = cell(payload.recommended_resume);
    if (resume) {
      if (!RESUME_OPTIONS.includes(resume)) {
        throw new Error(
          `recommended_resume must be one of: ${RESUME_OPTIONS.join(", ")} (got "${resume}")`,
        );
      }
      row.recommended_resume = resume;
    }

    const formUrlInput = cell(
      document.getElementById("form-import-form-url")?.value,
    );
    // Prefer explicit dossier form_url, then import modal, then JSON, never invent.
    const formUrl = cleanUrlValue(
      formUrlInput || payload.form_url || row.form_url || "",
    );
    const sourceUrl = cleanUrlValue(
      payload.source_url || row.job_url || formUrl || "",
    );
    if (!formUrl) {
      throw new Error(
        "Application form URL required — set it on the dossier or in the import modal (field “Form page URL”).",
      );
    }
    // Persist on the opening so autofill matches this URL even if JSON is re-imported later.
    row.form_url = formUrl;

    const importedAt =
      cell(payload.imported_at) || new Date().toISOString().slice(0, 19);

    row.application_answers = JSON.stringify({
      opening_id: cell(row.id),
      recommended_resume: cell(row.recommended_resume),
      form_url: formUrl,
      source_url: sourceUrl,
      imported_at: importedAt,
      fields: payload.fields,
    });
    collections.jobOpenings = openings;
    setDirty(true);
    return row;
  }

  function buildFormAiFixPrompt(errorMsg, brokenInput) {
    const sample = {
      opening_id:
        openJobId || "bosch-brasil-mid-level-digital-solution-architect-33992",
      recommended_resume: "digital-solution-architect",
      form_url: "https://example.com/jobs/123/apply",
      source_url: "https://example.com/jobs/123",
      fields: [
        {
          key: "first_name",
          label: "Nome",
          value: "Eduardo",
          source: "profile.full_name",
        },
        {
          key: "last_name",
          label: "Sobrenome",
          value: "Matos de Assis Figueiredo",
          source: "profile.full_name",
        },
        {
          key: "email",
          label: "E-mail",
          value: "edu.evangelista.figueiredo@gmail.com",
          source: "profile.email",
        },
        {
          key: "resume",
          label: "Currículo",
          value: "",
          source: "",
          note: "Upload manually — use digital-solution-architect resume",
        },
      ],
    };
    return [
      "The Job Openings form-fill importer rejected my last AI output. Fix and re-deliver.",
      "",
      "IMPORT ERROR",
      errorMsg,
      "",
      "BROKEN INPUT (truncated)",
      String(brokenInput || "").slice(0, 4000),
      "",
      "WHAT YOU MUST DO",
      HUMAN_VOICE,
      "- Return ONLY a valid JSON object (no markdown fences, no commentary).",
      '- Shape: { "opening_id": string, "recommended_resume": one of ' +
        RESUME_OPTIONS.join(" | ") +
        ",",
      '  "form_url": string, "source_url"?: string,',
      '  "fields": [ { "key", "label", "value", "source", "note?" } ] }',
      "- form_url is the application form page URL the Chrome extension will match.",
      "- Use empty strings for unknown values. Never invent email/phone.",
      "",
      "EXAMPLE",
      JSON.stringify(sample, null, 2),
    ].join("\n");
  }

  async function failFormImportWithAiFix(errorMsg, brokenInput) {
    await reportImportFailure({
      errorMsg,
      brokenInput,
      kind: "form-import",
      statusElId: "form-import-status",
      buildFixPrompt: buildFormAiFixPrompt,
      cockpitLabel: "Cockpit error (not AI)",
    });
  }

  function buildCoverAiFixPrompt(errorMsg, brokenInput) {
    const sample = {
      opening_id: openJobId || "cloud-hq-paulinia-data-analyst",
      lang: "en",
      greeting: "Dear Hiring Team,",
      body: "Paragraph 1.\n\nParagraph 2.",
      closing: "Sincerely,\nEduardo Matos de Assis Figueiredo",
    };
    return [
      "The Job Openings cover-letter importer rejected my last AI output. Fix and re-deliver.",
      "",
      "IMPORT ERROR",
      errorMsg,
      "",
      "BROKEN INPUT (truncated)",
      String(brokenInput || "").slice(0, 4000),
      "",
      "WHAT YOU MUST DO",
      HUMAN_VOICE,
      "- Return ONLY a valid JSON object (no markdown fences, no commentary).",
      '- Shape: { "opening_id": string, "lang": "en"|"pt", "greeting": string, "body": string, "closing": string }',
      "- body is required (cover letter paragraphs). greeting/closing optional but preferred.",
      "- opening_id must match an existing opening id, or leave it blank if a dossier is already open.",
      "",
      "EXAMPLE",
      JSON.stringify(sample, null, 2),
    ].join("\n");
  }

  async function failCoverImportWithAiFix(errorMsg, brokenInput) {
    await reportImportFailure({
      errorMsg,
      brokenInput,
      kind: "cover-import",
      statusElId: "cover-import-status",
      buildFixPrompt: buildCoverAiFixPrompt,
      cockpitLabel: "Cockpit error (not AI)",
    });
  }

  async function handleImportFormRun() {
    const raw = cell(document.getElementById("form-import-raw")?.value);
    const status = document.getElementById("form-import-status");
    if (!raw.trim()) {
      if (status) {
        status.textContent = "Paste AI JSON first.";
        status.className = "save-status err";
      }
      return;
    }
    try {
      const payload = parseFormImportPayload(raw);
      const row = applyFormAnswers(payload);
      if (status) {
        status.textContent = `Imported ${payload.fields.length} fields.`;
        status.className = "save-status";
      }
      const saved = await flushSave();
      if (saved) {
        if (status) {
          status.textContent = `Imported ${payload.fields.length} fields.`;
          status.className = "save-status ok";
        }
        showToast(
          `Imported ${payload.fields.length} fields. Filling the saved window…`,
          2500,
        );
        const dialog = document.getElementById("form-import-modal");
        if (dialog && dialog.open) dialog.close();
        openModal(row.id);
        const panel =
          document.getElementById("job-application-form") ||
          document.getElementById("job-form-answers");
        if (panel)
          panel.scrollIntoView({ block: "nearest", behavior: "smooth" });
        await fillFormWithAhk(row);
      } else if (status) {
        status.textContent = "Answers applied, but autosave failed.";
        status.className = "save-status err";
        openModal(row.id);
      }
    } catch (err) {
      await failFormImportWithAiFix(err.message || String(err), raw);
    }
  }

  function cancelFormPromptAutoClose(opts = {}) {
    const keepStatus = !!opts.keepStatus;
    if (promptAutoCloseTimer) {
      clearTimeout(promptAutoCloseTimer);
      promptAutoCloseTimer = null;
    }
    if (promptAutoCloseTick) {
      clearInterval(promptAutoCloseTick);
      promptAutoCloseTick = null;
    }
    promptAutoCloseSecondsLeft = 0;
    const bar = document.getElementById("form-prompt-close-bar");
    const fill = document.getElementById("form-prompt-close-bar-fill");
    const stayBtn = document.getElementById("form-prompt-stay-btn");
    if (bar) {
      bar.hidden = true;
      bar.classList.remove("is-running");
      bar.setAttribute("aria-valuenow", "3");
    }
    if (fill) fill.style.animation = "none";
    if (stayBtn) stayBtn.hidden = true;
    if (!keepStatus) {
      const status = document.getElementById("form-prompt-status");
      if (status && /closing in/i.test(status.textContent || "")) {
        status.textContent = "Prompt copied.";
        status.className = "save-status ok";
      }
    }
  }

  function startFormPromptAutoClose() {
    cancelPromptAutoClose({ keepStatus: true });
    cancelFormPromptAutoClose({ keepStatus: true });
    const bar = document.getElementById("form-prompt-close-bar");
    const fill = document.getElementById("form-prompt-close-bar-fill");
    const stayBtn = document.getElementById("form-prompt-stay-btn");
    const status = document.getElementById("form-prompt-status");
    promptAutoCloseSecondsLeft = 3;
    if (stayBtn) stayBtn.hidden = false;
    if (bar) {
      bar.hidden = false;
      bar.setAttribute("aria-valuenow", "3");
      bar.classList.remove("is-running");
      if (fill) {
        fill.style.animation = "none";
        void fill.offsetWidth;
        fill.style.animation = "";
      }
      bar.classList.add("is-running");
    }
    if (status) {
      status.textContent = "Prompt copied — closing in 3s…";
      status.className = "save-status ok";
    }
    promptAutoCloseTick = setInterval(() => {
      promptAutoCloseSecondsLeft = Math.max(0, promptAutoCloseSecondsLeft - 1);
      if (bar) {
        bar.setAttribute("aria-valuenow", String(promptAutoCloseSecondsLeft));
      }
      if (status && promptAutoCloseSecondsLeft > 0) {
        status.textContent = `Prompt copied — closing in ${promptAutoCloseSecondsLeft}s…`;
      }
    }, 1000);
    promptAutoCloseTimer = setTimeout(() => {
      promptAutoCloseTimer = null;
      cancelFormPromptAutoClose({ keepStatus: true });
      closeFormPromptModal();
    }, 3000);
  }

  function fillCoverPromptOpeningSelect() {
    const sel = document.getElementById("cover-prompt-opening");
    if (!sel) return;
    // Prefer open dossier or focused card so cover letter matches the target opening
    const prev = activeOpeningId() || cell(sel.value);
    sel.replaceChildren();
    const rows = openings.slice().sort((a, b) => {
      const ca = (cell(a.company) || cell(a.company_key)).toLowerCase();
      const cb = (cell(b.company) || cell(b.company_key)).toLowerCase();
      if (ca !== cb) return ca.localeCompare(cb);
      return cell(a.role_title).localeCompare(cell(b.role_title));
    });
    if (!rows.length) {
      const o = document.createElement("option");
      o.value = "";
      o.textContent = "(no openings)";
      sel.append(o);
      return;
    }
    for (const row of rows) {
      const o = document.createElement("option");
      o.value = cell(row.id);
      o.textContent =
        (cell(row.company) || cell(row.company_key) || "?") +
        " · " +
        (cell(row.role_title) || "(untitled)");
      sel.append(o);
    }
    if (prev && [...sel.options].some((o) => o.value === prev)) {
      sel.value = prev;
    }
    syncCoverPromptFromOpening();
  }

  function syncCoverPromptFromOpening() {
    const id = cell(document.getElementById("cover-prompt-opening")?.value);
    const row = openings.find((r) => cell(r.id) === id);
    const langEl = document.getElementById("cover-prompt-lang");
    const jdEl = document.getElementById("cover-prompt-jd");
    if (!row) return;
    if (langEl) langEl.value = guessCoverLang(row);
    if (jdEl) jdEl.value = cell(row.job_description);
  }

  function buildCoverLetterInstructions(openingId, lang) {
    return [
      "=== AIB COVER LETTER INSTRUCTIONS (mandatory) ===",
      "1. Write a tailored cover letter for the SELECTED OPENING using PROFILE CONTEXT,",
      "   NARRATIVES, EXPERIENCE, EDUCATION, and the JOB / PROJECT DESCRIPTION.",
      "2. Do not invent employers, degrees, dates, or metrics. Prefer evidence from context.",
      "3. Keep the letter one page when printed (~250–400 words). No markdown headings.",
      "4. Separate body paragraphs with a blank line (\\n\\n).",
      `5. Write the letter in language code: ${lang} (en = English, pt = Portuguese).`,
      "6. Follow VOICE. Professional, specific, and plain.",
      "7. Mention 2–3 concrete matches between my background and the job/project needs.",
      "8. NEVER use nicknames, shortened forms, or parenthetical aliases (e.g. Edu, (Edu)).",
      "   In the closing signature, use the exact Sign-off name from PROFILE CONTEXT.",
      "9. Return ONLY one JSON object (no markdown fences, no prose):",
      "   {",
      `     "opening_id": "${openingId}",`,
      `     "lang": "${lang}",`,
      '     "greeting": "<salutation>",',
      '     "body": "<paragraphs separated by blank lines>",',
      '     "closing": "<sign-off; last line = exact Sign-off name>"',
      "   }",
      "10. opening_id must equal the selected opening id provided above.",
    ].join("\n");
  }

  async function buildCoverLetterPrompt(openingId, lang, jdOverride) {
    const opening =
      openings.find((r) => cell(r.id) === cell(openingId)) || null;
    if (!opening) throw new Error("Opening not found");
    const letterLang = lang === "pt" ? "pt" : "en";
    const jd = cell(jdOverride) || cell(opening.job_description);
    if (!jd.trim()) {
      throw new Error(
        "Add a job / project description on this opening (or in the prompt box) first.",
      );
    }

    const path = cell(opening.career_path).toLowerCase() || "dsa";
    const variant = PATH_TO_VARIANT[path] || "ux-researcher";
    const ctx = await fetchPromptContext();
    const variants = new Set([variant]);
    const skills = (ctx.skills || []).filter((s) =>
      variants.has(cell(s.variant) || "ux-researcher"),
    );
    const narratives = (ctx.narratives || []).filter((n) =>
      variants.has(cell(n.variant) || "ux-researcher"),
    );
    const experience = (ctx.experience || []).slice(0, 8);
    const education = (ctx.education || []).slice(0, 6);
    const profile = (ctx.profile && ctx.profile[0]) || {};

    const lines = [];
    lines.push(
      "You are my AI companion (AIB) for writing a job-application cover letter.",
    );
    lines.push("");
    lines.push(HUMAN_VOICE);
    lines.push("");
    lines.push(buildCoverLetterInstructions(cell(opening.id), letterLang));
    lines.push("");
    lines.push("=== SELECTED OPENING ===");
    lines.push(`opening_id: ${cell(opening.id)}`);
    lines.push(`company: ${cell(opening.company)}`);
    lines.push(`role_title: ${cell(opening.role_title)}`);
    lines.push(`career_path: ${cell(opening.career_path)}`);
    lines.push(`location: ${cell(opening.location)}`);
    lines.push(`job_url: ${cell(opening.job_url)}`);
    lines.push(`form_url: ${cell(opening.form_url)}`);
    lines.push(`skills_gap: ${cell(opening.skills_gap)}`);
    lines.push("");
    lines.push("=== JOB / PROJECT DESCRIPTION ===");
    lines.push(jd.trim());
    lines.push("");
    lines.push("=== PROFILE CONTEXT ===");
    lines.push(
      `Sign-off name (exact — use this in closing, no nicknames): ${
        cell(profile.display_name) || cell(profile.full_name)
      }`,
    );
    lines.push(`Full legal name: ${cell(profile.full_name)}`);
    lines.push(
      `Location: ${cell(profile.location_en) || cell(profile.location_pt)}`,
    );
    lines.push(
      `Languages: ${cell(profile.languages_en) || cell(profile.languages_pt)}`,
    );
    lines.push(`Email: ${cell(profile.email)}`);
    lines.push(`Phone: ${cell(profile.phone)}`);
    lines.push(`LinkedIn: ${cell(profile.linkedin_url)}`);
    lines.push(
      `Résumé variant hint: ${cell(opening.recommended_resume) || variant}`,
    );
    lines.push("");

    const tagline = narratives.find((n) => cell(n.field) === "tagline");
    const summary = narratives.find((n) => cell(n.field) === "profile");
    if (tagline || summary) {
      lines.push("=== NARRATIVES ===");
      if (tagline) {
        lines.push(
          `Tagline: ${letterLang === "pt" ? cell(tagline.text_pt) || cell(tagline.text_en) : cell(tagline.text_en)}`,
        );
      }
      if (summary) {
        lines.push(
          `Summary: ${letterLang === "pt" ? cell(summary.text_pt) || cell(summary.text_en) : cell(summary.text_en)}`,
        );
      }
      lines.push("");
    }

    if (skills.length) {
      lines.push("=== SKILLS (core + tech for path) ===");
      for (const s of skills.slice(0, 40)) {
        const label =
          letterLang === "pt"
            ? cell(s.label_pt) || cell(s.label_en)
            : cell(s.label_en) || cell(s.label_pt);
        if (label) lines.push(`- [${cell(s.category) || "?"}] ${label}`);
      }
      lines.push("");
    }

    if (education.length) {
      lines.push("=== EDUCATION ===");
      for (const e of education) {
        lines.push(
          `- ${cell(e.institution_en) || cell(e.institution_pt)} | ${cell(e.location_en) || cell(e.location_pt)} | ${cell(e.degree_en) || cell(e.degree_pt)} | ${cell(e.date_display_en) || cell(e.date_display_pt)}`,
        );
      }
      lines.push("");
    }

    if (experience.length) {
      lines.push("=== EXPERIENCE (recent) ===");
      for (const e of experience) {
        lines.push(
          `- ${cell(e.title_en) || cell(e.title_pt)} @ ${cell(e.company_en) || cell(e.company_pt)} | ${cell(e.date_display_en) || cell(e.date_display_pt)}`,
        );
        const desc =
          letterLang === "pt"
            ? cell(e.description_pt) || cell(e.description_en)
            : cell(e.description_en) || cell(e.description_pt);
        if (desc) lines.push(`  ${desc.slice(0, 320)}`);
      }
      lines.push("");
    }

    lines.push(buildCoverLetterInstructions(cell(opening.id), letterLang));
    return lines.join("\n");
  }

  async function handleCoverPromptCopy() {
    const openingId = cell(
      document.getElementById("cover-prompt-opening")?.value,
    );
    const lang =
      cell(document.getElementById("cover-prompt-lang")?.value) || "en";
    const jd = cell(document.getElementById("cover-prompt-jd")?.value);
    const status = document.getElementById("cover-prompt-status");
    if (!openingId) {
      if (status) {
        status.textContent = "Select an opening";
        status.className = "save-status err";
      }
      return;
    }
    const button = document.getElementById("cover-prompt-copy-btn");
    if (button) button.disabled = true;
    setPromptGenerating("cover-prompt-modal", true);
    if (status) {
      status.textContent = "Generating the prompt…";
      status.className = "save-status";
    }
    try {
      const opening = openings.find((r) => cell(r.id) === openingId);
      if (opening && jd.trim()) {
        opening.job_description = jd.trim();
        setDirty(true);
      }
      const prompt = await buildCoverLetterPrompt(openingId, lang, jd);
      try {
        await navigator.clipboard.writeText(prompt);
      } catch {
        /* ignore */
      }
      const res = await fetch("/api/prompt-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(
          data.error || res.statusText || "Could not send the prompt",
        );
      }
      showToast("Prompt sent. Paste the JSON reply here.", 2800);
      closeCoverPromptModal();
      openCoverImportModal({
        note: "Prompt sent. Paste the companion’s JSON here.",
      });
    } catch (err) {
      if (status) {
        status.textContent = err.message || String(err);
        status.className = "save-status err";
      }
    } finally {
      setPromptGenerating("cover-prompt-modal", false);
      if (button) button.disabled = false;
    }
  }

  function stripNicknameParens(text) {
    return String(text || "")
      .replace(/\s*\([^)]{1,24}\)/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  function normalizeCoverClosing(closing, formalName, lang) {
    const formal =
      stripNicknameParens(formalName) || String(formalName || "").trim();
    const raw = cell(closing).trim();
    if (!raw) {
      const salutation = lang === "pt" ? "Atenciosamente," : "Sincerely,";
      return formal ? `${salutation}\n${formal}` : salutation;
    }
    const lines = raw
      .split("\n")
      .map((line) => (line.trim() ? stripNicknameParens(line) : line));
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    if (formal) {
      if (!lines.length) {
        lines.push(formal);
      } else {
        const last = lines[lines.length - 1].trim();
        const looksLikeName =
          /[A-Za-zÀ-ÿ]/.test(last) && last.split(/\s+/).length >= 2;
        const firstToken = formal.toLowerCase().split(/\s+/)[0] || "";
        if (
          looksLikeName ||
          (firstToken && last.toLowerCase().includes(firstToken)) ||
          formal.toLowerCase().includes(last.toLowerCase())
        ) {
          lines[lines.length - 1] = formal;
        } else if (last.endsWith(",")) {
          lines.push(formal);
        } else {
          lines.push(formal);
        }
      }
    }
    return lines.join("\n");
  }

  function parseCoverImportPayload(text) {
    const cleaned = stripMarkdownFences(text);
    if (!cleaned) throw new Error("Empty cover letter payload");
    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("Invalid JSON: " + (err.message || String(err)));
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Expected a JSON object");
    }
    const body = cell(data.body) || cell(data.letter) || cell(data.text);
    if (!body.trim()) throw new Error('Missing "body" (cover letter text)');
    const lang = cell(data.lang).toLowerCase() || "en";
    if (lang !== "en" && lang !== "pt") {
      throw new Error('lang must be "en" or "pt"');
    }
    return {
      opening_id: cell(data.opening_id),
      lang,
      greeting: cell(data.greeting),
      body: body.trim(),
      closing: cell(data.closing),
    };
  }

  async function compileCoverLetterPdf(row) {
    const lang = cell(row.cover_letter_lang) || "en";
    const today = new Date();
    const dateStr =
      lang === "pt"
        ? today.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
    const res = await fetch("/api/cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opening_id: cell(row.id),
        lang,
        company: cell(row.company),
        role: cell(row.role_title),
        greeting: cell(row.cover_letter_greeting),
        body: cell(row.cover_letter),
        closing: cell(row.cover_letter_closing),
        date: dateStr,
      }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok || !payload.ok) {
      throw new Error(
        payload.error || `Cover letter build failed (${res.status})`,
      );
    }
    return payload;
  }

  async function handleCoverImportRun() {
    const status = document.getElementById("cover-import-status");
    const rawEl = document.getElementById("cover-import-raw");
    try {
      const payload = parseCoverImportPayload(cell(rawEl?.value));
      let openingId = payload.opening_id || activeOpeningId();
      let row = openings.find((r) => cell(r.id) === openingId) || null;
      if (!row && activeOpeningId()) {
        row = activeOpening();
        openingId = activeOpeningId();
      }
      if (!row) {
        throw new Error(
          "No matching opening for opening_id — focus a card, open a dossier, or set opening_id.",
        );
      }
      row.cover_letter = payload.body;
      row.cover_letter_lang = payload.lang;
      row.cover_letter_greeting = payload.greeting;
      {
        const profileRow =
          (collections.profile && collections.profile[0]) || {};
        const formal =
          cell(profileRow.display_name) || cell(profileRow.full_name);
        row.cover_letter_closing = normalizeCoverClosing(
          payload.closing,
          formal,
          payload.lang,
        );
      }
      collections.jobOpenings = openings;
      setDirty(true);
      if (status) {
        status.textContent = "Building PDF…";
        status.className = "save-status";
      }
      await flushSave();
      const pdf = await compileCoverLetterPdf(row);
      if (status) {
        status.textContent = "Cover letter PDF ready";
        status.className = "save-status ok";
      }
      showToast(
        pdf.desktop_path
          ? `Cover letter saved to Desktop`
          : "Cover letter PDF built",
        2800,
      );
      closeCoverImportModal();
      if (openJobId === cell(row.id)) openModal(row.id);
      openResumeViewer({
        label: `Cover letter · ${cell(row.company) || cell(row.role_title) || "Opening"}`,
        lang: pdf.lang,
        filename: pdf.filename,
        view_url: pdf.view_url,
        url: pdf.url,
        abs_path: pdf.abs_path,
      });
    } catch (err) {
      await failCoverImportWithAiFix(
        err.message || String(err),
        cell(rawEl?.value),
      );
    }
  }

  function openCoverPromptModal() {
    if (!requireActiveOpening("generate a cover letter")) return;
    fillCoverPromptOpeningSelect();
    const dialog = document.getElementById("cover-prompt-modal");
    const status = document.getElementById("cover-prompt-status");
    setPromptGenerating("cover-prompt-modal", false);
    if (status) {
      status.textContent = "";
      status.className = "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
  }

  function closeCoverPromptModal() {
    setPromptGenerating("cover-prompt-modal", false);
    const dialog = document.getElementById("cover-prompt-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function openCoverImportModal(opts = {}) {
    if (!requireActiveOpening("import a cover letter")) return;
    const dialog = document.getElementById("cover-import-modal");
    const status = document.getElementById("cover-import-status");
    const rawEl = document.getElementById("cover-import-raw");
    const note = cell(opts.note);
    if (status) {
      status.textContent = note;
      status.className = note ? "save-status ok" : "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    requestAnimationFrame(() => {
      if (!rawEl) return;
      rawEl.focus();
      rawEl.select();
    });
  }

  function closeCoverImportModal() {
    const dialog = document.getElementById("cover-import-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function renderCoverLetterPanel(row, parent) {
    const section = document.createElement("section");
    section.className = "job-form-answers";
    section.setAttribute("aria-label", "Cover letter");

    const head = document.createElement("div");
    head.className = "job-form-answers-head";
    const title = document.createElement("h3");
    title.className = "company-research-label";
    title.textContent = "Cover letter";
    head.append(title);
    const actions = document.createElement("div");
    actions.className = "job-form-answers-actions";
    const gen = document.createElement("button");
    gen.type = "button";
    gen.className = "nav-btn";
    gen.textContent = "Generate prompt";
    gen.title = "Generate cover letter prompt (Alt+C)";
    gen.addEventListener("click", () => openCoverPromptModal());
    const imp = document.createElement("button");
    imp.type = "button";
    imp.className = "nav-btn";
    imp.textContent = "Import & PDF";
    imp.title = "Import a cover-letter JSON reply and build the PDF";
    imp.addEventListener("click", () => openCoverImportModal());
    actions.append(gen, imp);
    head.append(actions);
    section.append(head);

    const body = cell(row.cover_letter);
    if (!body) {
      const hint = document.createElement("p");
      hint.className = "job-modal-hint";
      hint.textContent =
        "No cover letter yet. Alt+C sends the prompt. The import box opens when the send finishes.";
      section.append(hint);
      parent.append(section);
      return;
    }

    const meta = document.createElement("div");
    meta.className = "job-form-answer-note";
    meta.textContent = `Language: ${(cell(row.cover_letter_lang) || "en").toUpperCase()}`;
    section.append(meta);

    if (cell(row.cover_letter_greeting)) {
      const g = document.createElement("div");
      g.className = "job-form-answer-value";
      g.textContent = cell(row.cover_letter_greeting);
      section.append(g);
    }
    const preview = document.createElement("div");
    preview.className = "job-form-answer-value";
    preview.style.whiteSpace = "pre-wrap";
    preview.textContent = body.slice(0, 1200) + (body.length > 1200 ? "…" : "");
    section.append(preview);

    const rebuild = document.createElement("button");
    rebuild.type = "button";
    rebuild.className = "nav-btn";
    rebuild.textContent = "Rebuild PDF";
    rebuild.addEventListener("click", async () => {
      try {
        const pdf = await compileCoverLetterPdf(row);
        showToast(
          pdf.desktop_path
            ? "Cover letter saved to Desktop"
            : "Cover letter PDF rebuilt",
          2200,
        );
        openResumeViewer({
          label: `Cover letter · ${cell(row.company) || "Opening"}`,
          lang: pdf.lang,
          filename: pdf.filename,
          view_url: pdf.view_url,
          url: pdf.url,
          abs_path: pdf.abs_path,
        });
      } catch (err) {
        showToast(err.message || "PDF build failed", 3000);
      }
    });
    section.append(rebuild);
    parent.append(section);
  }

  function clearOpeningFormAnswers(row, { refresh = true } = {}) {
    if (!row || !cell(row.application_answers).trim()) return false;
    row.application_answers = "";
    setDirty(true);
    setSaveStatus("");
    if (refresh && openJobId && cell(openJobId) === cell(row.id)) {
      fillModal();
    }
    return true;
  }

  function openFormPromptModal() {
    if (!requireActiveOpening("generate a form prompt")) return;
    fillFormPromptOpeningSelect();
    const openingId =
      cell(document.getElementById("form-prompt-opening")?.value) ||
      activeOpeningId();
    const row = openings.find((r) => cell(r.id) === openingId);
    if (clearOpeningFormAnswers(row, { refresh: true })) {
      showToast("Cleared previous form answers for a fresh prompt", 2200);
    }
    const dialog = document.getElementById("form-prompt-modal");
    const status = document.getElementById("form-prompt-status");
    const nameEl = document.getElementById("form-prompt-window-name");
    setPromptGenerating("form-prompt-modal", false);
    cancelFormPromptAutoClose({ keepStatus: true });
    if (status) {
      status.textContent = "";
      status.className = "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    void syncFormWindowName();
    requestAnimationFrame(() => {
      if (!nameEl) return;
      nameEl.focus();
      if (cell(nameEl.value).trim()) nameEl.select();
    });
  }

  function closeFormPromptModal() {
    cancelFormPromptAutoClose({ keepStatus: true });
    setPromptGenerating("form-prompt-modal", false);
    const dialog = document.getElementById("form-prompt-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function openFormImportModal(opts = {}) {
    const forcedId = cell(opts.openingId);
    const row = forcedId
      ? openings.find((r) => cell(r.id) === forcedId)
      : requireActiveOpening("import form answers");
    if (!row) return;
    const dialog = document.getElementById("form-import-modal");
    const status = document.getElementById("form-import-status");
    const rawEl = document.getElementById("form-import-raw");
    const formUrlEl = document.getElementById("form-import-form-url");
    const note = cell(opts.note);
    if (status) {
      status.textContent = note;
      status.className = note ? "save-status ok" : "save-status";
    }
    if (formUrlEl) {
      const parsed = parseApplicationAnswers(row.application_answers);
      formUrlEl.value =
        cleanUrlValue(row?.form_url) ||
        cleanUrlValue(parsed?.form_url) ||
        formUrlEl.value ||
        "";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    requestAnimationFrame(() => {
      if (!rawEl) return;
      rawEl.focus();
      rawEl.select();
    });
  }

  function closeFormImportModal() {
    const dialog = document.getElementById("form-import-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function openResumeViewer(item) {
    const dialog = document.getElementById("resume-viewer-modal");
    const frame = document.getElementById("resume-viewer-frame");
    const title = document.getElementById("resume-viewer-title");
    const dl = document.getElementById("resume-viewer-download");
    const copyBtn = document.getElementById("resume-viewer-copy-path");
    if (!dialog || !frame || !title || !dl) {
      const url = cell(item?.view_url) || cell(item?.url);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const lang = cell(item.lang) ? ` · ${String(item.lang).toUpperCase()}` : "";
    title.textContent = `${cell(item.label) || cell(item.label_en) || "Resume"}${lang}`;
    const baseViewUrl = cell(item.view_url) || cell(item.url) || "";
    if (baseViewUrl) {
      const sep = baseViewUrl.includes("?") ? "&" : "?";
      frame.src = `${baseViewUrl}${sep}t=${Date.now()}`;
    }
    dl.href = cell(item.url) || cell(item.view_url);
    if (item.filename) dl.setAttribute("download", cell(item.filename));
    else dl.removeAttribute("download");
    const absPath = cell(item.abs_path) || cell(item.absPath);
    if (copyBtn) {
      copyBtn.hidden = !absPath;
      copyBtn.disabled = !absPath;
      copyBtn.dataset.path = absPath;
      copyBtn.dataset.label = "Copy path";
      copyBtn.textContent = "Copy path";
      copyBtn.classList.remove("ok", "err");
      copyBtn.title = absPath
        ? `Copy path:\n${absPath}`
        : "PDF path unavailable";
      if (!copyBtn.dataset.wired) {
        copyBtn.dataset.wired = "1";
        copyBtn.addEventListener("click", async () => {
          const path = cell(copyBtn.dataset.path);
          if (!path) return;
          const original = copyBtn.dataset.label || "Copy path";
          const ok = await copyText(path);
          copyBtn.textContent = ok ? "Copied" : "Error";
          copyBtn.classList.toggle("ok", ok);
          copyBtn.classList.toggle("err", !ok);
          setTimeout(() => {
            copyBtn.textContent = original;
            copyBtn.classList.remove("ok", "err");
          }, 1200);
          if (ok) showToast("Full path copied", 1800);
        });
      }
    }
    if (typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
  }

  function closeResumeViewer() {
    const dialog = document.getElementById("resume-viewer-modal");
    const frame = document.getElementById("resume-viewer-frame");
    if (frame) frame.src = "about:blank";
    if (dialog && dialog.open) dialog.close();
  }

  function renderApplicationFormPanel(row, parent) {
    const section = document.createElement("section");
    section.id = "job-application-form";
    section.className = "job-application-form";
    section.setAttribute("aria-label", "Application form fill");

    const head = document.createElement("div");
    head.className = "job-form-answers-head";
    const title = document.createElement("h3");
    title.className = "company-research-label";
    title.textContent = "Application form fill";
    head.append(title);

    const actions = document.createElement("div");
    actions.className = "job-form-answers-actions";
    const formPromptBtn = document.createElement("button");
    formPromptBtn.type = "button";
    formPromptBtn.className = "nav-btn";
    formPromptBtn.textContent = "Generate form prompt";
    formPromptBtn.title =
      "Type the application tab title and send the form prompt to the AI companion (Alt+F)";
    formPromptBtn.addEventListener("click", () => openFormPromptModal());
    const formImportBtn = document.createElement("button");
    formImportBtn.type = "button";
    formImportBtn.className = "nav-btn";
    formImportBtn.textContent = "Import form JSON";
    formImportBtn.title =
      "Import the AI JSON and start filling the saved Chrome window";
    formImportBtn.addEventListener("click", () => openFormImportModal());
    const autofill = document.createElement("button");
    autofill.type = "button";
    autofill.className = "save-btn";
    autofill.textContent = "Fill this form";
    autofill.title =
      "Type the imported answers into the saved Chrome window again. Shows a loading bar and does not submit.";
    autofill.addEventListener("click", () => void fillFormWithAhk(row));
    actions.append(formPromptBtn, formImportBtn, autofill);
    head.append(actions);
    section.append(head);

    const formUrlField = fieldBlock(
      "Application form URL (autofill target — may differ / change)",
      textInput(row, "form_url", {
        placeholder: "https://…/apply or …/jobs/…#app",
      }),
    );
    section.append(formUrlField);
    if (cell(row.form_url)) {
      const formLink = document.createElement("a");
      formLink.className = "company-result-link";
      formLink.href = cell(row.form_url);
      formLink.target = "_blank";
      formLink.rel = "noopener noreferrer";
      formLink.textContent = "Open form →";
      section.append(formLink);
    }
    const urlHint = document.createElement("p");
    urlHint.className = "job-modal-hint";
    urlHint.textContent =
      "Saved with the import. Filling uses the Chrome tab title from Alt+F, not this URL.";
    section.append(urlHint);
    const windowHint = document.createElement("p");
    windowHint.className = "job-modal-hint";
    windowHint.textContent = "Form window: …";
    section.append(windowHint);
    const openingId = cell(row.id);
    if (openingId) {
      void fetch(
        "/api/career-autofill/session?" +
          new URLSearchParams({ opening_id: openingId }),
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!windowHint.isConnected) return;
          const name = data && cell(data.window_name);
          windowHint.textContent = name
            ? `Form window: ${name}`
            : "Form window: not saved yet. Type the tab title in Alt+F.";
        })
        .catch(() => {
          if (windowHint.isConnected) {
            windowHint.textContent = "Form window: unavailable.";
          }
        });
    }

    renderFormAnswersContent(row, section);
    parent.append(section);
  }

  function renderFormAnswersContent(row, parent) {
    const answers = document.createElement("div");
    answers.id = "job-form-answers";
    answers.className = "job-form-answers-inner";
    answers.setAttribute("aria-label", "Application form answers");

    const parsed = parseApplicationAnswers(row.application_answers);
    if (!parsed || !parsed.fields.length) {
      const hint = document.createElement("p");
      hint.className = "job-modal-hint";
      hint.style.marginBottom = "0";
      hint.textContent =
        "No form answers yet. Alt+F sends this window to the AI companion. The import box opens when the send finishes.";
      answers.append(hint);
      parent.append(answers);
      return;
    }

    const answersHead = document.createElement("div");
    answersHead.className = "job-form-answers-head";
    const answersTitle = document.createElement("h4");
    answersTitle.className = "company-research-label";
    answersTitle.textContent = "Imported answers";
    answersHead.append(answersTitle);
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "nav-btn";
    clearBtn.textContent = "Clear answers";
    clearBtn.addEventListener("click", () => {
      clearOpeningFormAnswers(row, { refresh: true });
    });
    answersHead.append(clearBtn);
    answers.append(answersHead);

    if (parsed.form_url || parsed.source_url || parsed.imported_at) {
      const urls = document.createElement("div");
      urls.className = "job-form-answer-note";
      const parts = [];
      if (parsed.imported_at) {
        parts.push(`Imported: ${parsed.imported_at}`);
      }
      const srcShown =
        cleanUrlValue(parsed.source_url) || cleanUrlValue(row.job_url);
      const formShown = cleanUrlValue(parsed.form_url);
      if (formShown && formShown !== cleanUrlValue(row.form_url)) {
        parts.push(`JSON form_url: ${formShown}`);
      }
      if (srcShown && srcShown !== cleanUrlValue(row.form_url)) {
        parts.push(`Source page: ${srcShown}`);
      }
      if (parts.length) {
        urls.textContent = parts.join(" · ");
        answers.append(urls);
      }
    }

    const resumeChoice =
      cell(parsed.recommended_resume) || cell(row.recommended_resume);
    if (resumeChoice) {
      const resumeLang = guessApplicationLang(row);
      const resumeLangLabel = resumeLang.toUpperCase();
      const resumeBar = document.createElement("div");
      resumeBar.className = "job-form-resume-pick";
      const resumeLab = document.createElement("span");
      resumeLab.className = "job-form-resume-pick-label";
      resumeLab.textContent = `Upload this résumé (${resumeLangLabel})`;
      resumeLab.title =
        resumeLang === "pt"
          ? "Matched to this opening’s locale (Portuguese materials)"
          : "Matched to this opening’s locale (English materials)";
      const resumeVal = document.createElement("strong");
      resumeVal.textContent = `${resumeChoice} · ${resumeLangLabel}`;
      const pathEl = document.createElement("code");
      pathEl.className = "job-form-resume-path";
      pathEl.textContent = "Resolving path…";
      const pathCopy = document.createElement("button");
      pathCopy.type = "button";
      pathCopy.className = "nav-btn";
      pathCopy.textContent = "Copy full path";
      pathCopy.disabled = true;
      pathCopy.title = "Copy absolute PDF path for the OS file picker (Ctrl+V)";
      const nameCopy = document.createElement("button");
      nameCopy.type = "button";
      nameCopy.className = "nav-btn";
      nameCopy.textContent = "Copy name";
      nameCopy.addEventListener("click", async () => {
        const ok = await copyText(resumeChoice);
        showToast(ok ? `Copied: ${resumeChoice}` : "Copy failed", 1800);
      });
      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "save-btn";
      openBtn.textContent = "Open résumé";
      openBtn.disabled = true;
      openBtn.title = `Open the ${resumeLangLabel} PDF recommended for this opening`;
      resumeBar.append(
        resumeLab,
        resumeVal,
        pathEl,
        openBtn,
        pathCopy,
        nameCopy,
      );
      answers.append(resumeBar);

      resolveResumeFile(resumeChoice, row)
        .then((file) => {
          if (!file || file.error || !file.absPath) {
            const err = file?.error || "missing_pdf";
            if (err === "no_abs_path") {
              pathEl.textContent =
                "Restart the career cockpit server, then reopen this dossier";
            } else if (err === "unknown_variant") {
              pathEl.textContent = `Unknown résumé variant: ${resumeChoice}`;
            } else {
              pathEl.textContent =
                "PDF not found under output/ — run: python scripts/build_outputs.py";
            }
            pathEl.classList.add("is-missing");
            return;
          }
          const fileLang = (cell(file.lang) || resumeLang).toUpperCase();
          resumeVal.textContent = `${resumeChoice} · ${fileLang}`;
          resumeLab.textContent = `Upload this résumé (${fileLang})`;
          pathEl.textContent = file.absPath;
          pathEl.title = `${file.filename} (${fileLang})`;
          pathCopy.disabled = false;
          pathCopy.addEventListener("click", async () => {
            const ok = await copyText(file.absPath);
            showToast(
              ok
                ? "Full path copied — paste in the file dialog"
                : "Copy failed",
              2200,
            );
          });
          const viewUrl = cell(file.viewUrl) || cell(file.url);
          if (viewUrl) {
            openBtn.disabled = false;
            openBtn.title = `Open ${file.filename}`;
            openBtn.addEventListener("click", () => {
              openResumeViewer({
                label: `${resumeChoice} (${fileLang})`,
                lang: file.lang,
                filename: file.filename,
                view_url: viewUrl,
                url: cell(file.url) || viewUrl.replace(/[?&]inline=1/, ""),
                abs_path: file.absPath,
              });
            });
          }
        })
        .catch(() => {
          pathEl.textContent = "Could not resolve resume path";
          pathEl.classList.add("is-missing");
        });
    }

    const list = document.createElement("div");
    list.className = "job-form-answer-list";
    for (const field of parsed.fields) {
      const rowEl = document.createElement("div");
      rowEl.className = "job-form-answer-row";
      const meta = document.createElement("div");
      meta.className = "job-form-answer-meta";
      const lab = document.createElement("div");
      lab.className = "job-form-answer-label";
      lab.textContent = field.label || field.key;
      meta.append(lab);
      if (field.note) {
        const note = document.createElement("div");
        note.className = "job-form-answer-note";
        note.textContent = field.note;
        meta.append(note);
      }
      const val = document.createElement("div");
      val.className = "job-form-answer-value";
      val.textContent = field.value || "(empty)";
      if (!field.value) val.classList.add("is-empty");
      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "nav-btn job-form-answer-copy";
      copyBtn.textContent = "Copy";
      copyBtn.disabled = !field.value;
      copyBtn.title = field.value
        ? `Copy ${field.label || field.key}`
        : "Nothing to copy";
      copyBtn.addEventListener("click", async () => {
        const ok = await copyText(field.value);
        showToast(
          ok ? `Copied: ${field.label || field.key}` : "Copy failed",
          1800,
        );
      });
      rowEl.append(meta, val, copyBtn);
      list.append(rowEl);
    }
    answers.append(list);
    parent.append(answers);
  }

  function cancelPromptAutoClose(opts = {}) {
    const keepStatus = !!opts.keepStatus;
    if (promptAutoCloseTimer) {
      clearTimeout(promptAutoCloseTimer);
      promptAutoCloseTimer = null;
    }
    if (promptAutoCloseTick) {
      clearInterval(promptAutoCloseTick);
      promptAutoCloseTick = null;
    }
    promptAutoCloseSecondsLeft = 0;
    const bar = document.getElementById("prompt-close-bar");
    const fill = document.getElementById("prompt-close-bar-fill");
    const stayBtn = document.getElementById("prompt-stay-btn");
    if (bar) {
      bar.hidden = true;
      bar.classList.remove("is-running");
      bar.setAttribute("aria-valuenow", "3");
    }
    if (fill) fill.style.animation = "none";
    if (stayBtn) stayBtn.hidden = true;
    if (!keepStatus) {
      const status = document.getElementById("prompt-status");
      if (status && /closing in/i.test(status.textContent || "")) {
        status.textContent = "Prompt copied.";
        status.className = "save-status ok";
      }
    }
  }

  function startPromptAutoClose() {
    cancelFormPromptAutoClose({ keepStatus: true });
    cancelPromptAutoClose({ keepStatus: true });
    const bar = document.getElementById("prompt-close-bar");
    const fill = document.getElementById("prompt-close-bar-fill");
    const stayBtn = document.getElementById("prompt-stay-btn");
    const status = document.getElementById("prompt-status");
    promptAutoCloseSecondsLeft = 3;
    if (stayBtn) stayBtn.hidden = false;
    if (bar) {
      bar.hidden = false;
      bar.setAttribute("aria-valuenow", "3");
      // Restart CSS animation
      bar.classList.remove("is-running");
      if (fill) {
        fill.style.animation = "none";
        void fill.offsetWidth;
        fill.style.animation = "";
      }
      bar.classList.add("is-running");
    }
    if (status) {
      status.textContent = "Prompt copied — closing in 3s…";
      status.className = "save-status ok";
    }
    promptAutoCloseTick = setInterval(() => {
      promptAutoCloseSecondsLeft = Math.max(0, promptAutoCloseSecondsLeft - 1);
      if (bar) {
        bar.setAttribute("aria-valuenow", String(promptAutoCloseSecondsLeft));
      }
      if (status && promptAutoCloseSecondsLeft > 0) {
        status.textContent = `Prompt copied — closing in ${promptAutoCloseSecondsLeft}s…`;
      }
    }, 1000);
    promptAutoCloseTimer = setTimeout(() => {
      promptAutoCloseTimer = null;
      cancelPromptAutoClose({ keepStatus: true });
      closePromptModal();
    }, 3000);
  }

  function selectAllPromptPaths() {
    const all = document.getElementById("prompt-path-all");
    if (all) {
      all.checked = true;
      all.indeterminate = false;
    }
    for (const box of promptPathBoxes()) box.checked = true;
    syncSelectAllPaths();
  }

  function setPromptGenerating(dialogId, on) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;
    dialog.classList.toggle("is-generating", !!on);
    dialog.setAttribute("aria-busy", on ? "true" : "false");
  }

  async function tryLoadDesktopTxtForPrompt(companyId, { autoSend = true } = {}) {
    const cid = cell(companyId);
    if (!cid) return false;
    try {
      const res = await fetch(
        `/api/openings-batch/desktop-txt?company=${encodeURIComponent(cid)}`,
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.exists || !cell(data.content).trim()) {
        return false;
      }
      const sel = document.getElementById("prompt-company");
      if (sel && [...sel.options].some((o) => o.value === cid)) {
        sel.value = cid;
      }
      selectAllPromptPaths();
      const rawEl = document.getElementById("prompt-raw");
      if (rawEl) rawEl.value = data.content;
      const status = document.getElementById("prompt-status");
      if (status) {
        status.textContent = `Loaded ${data.file_name} (${data.mtime || "Desktop"})`;
        status.className = "save-status ok";
      }
      if (autoSend) {
        showToast(`Loaded ${data.file_name} — sending to AI companion…`, 2500);
        await handleCopyPrompt();
      }
      return true;
    } catch {
      return false;
    }
  }

  function openPromptModal(opts = {}) {
    fillPromptCompanySelect();
    const dialog = document.getElementById("prompt-modal");
    const status = document.getElementById("prompt-status");
    const ignoreEl = document.getElementById("prompt-ignore");
    cancelPromptAutoClose({ keepStatus: true });
    if (opts.companyId) {
      const sel = document.getElementById("prompt-company");
      if (sel && [...sel.options].some((o) => o.value === opts.companyId)) {
        sel.value = opts.companyId;
      }
    }
    if (opts.selectAllPaths) selectAllPromptPaths();
    if (ignoreEl && !cell(ignoreEl.value).trim()) {
      ignoreEl.value =
        "- not IT / technology (compensation, HR, legal, finance, facilities, pure trades such as electrical maintenance). Every technology title stays, including UX research, design technology, software architecture, data, automation, and product.";
    }
    if (status) {
      status.textContent = "";
      status.className = "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    if (opts.companyId) {
      void tryLoadDesktopTxtForPrompt(opts.companyId, {
        autoSend: opts.autoIngest !== false,
      });
    }
  }

  function closePromptModal() {
    cancelPromptAutoClose({ keepStatus: true });
    setPromptGenerating("prompt-modal", false);
    const dialog = document.getElementById("prompt-modal");
    if (dialog && dialog.open) dialog.close();
  }

  const IMPORT_HINT_BASE =
    "Paste the JSON array returned by your AI companion. A successful import saves automatically. Invalid formatting triggers an AI-fix prompt copied to your clipboard.";

  function companyDisplayName(companyId) {
    const company = companyOptions().find((c) => cell(c.id) === companyId);
    return company ? cell(company.name_en) || companyId : companyId;
  }

  function syncImportCompanyHint() {
    const hint = document.getElementById("import-hint");
    if (!hint) return;
    if (!launchCompanyKey) {
      hint.textContent = IMPORT_HINT_BASE;
      return;
    }
    hint.textContent = `${IMPORT_HINT_BASE} Openings missing company_key will be filed under ${companyDisplayName(launchCompanyKey)}.`;
  }

  function openImportModal(opts = {}) {
    const dialog = document.getElementById("import-modal");
    const status = document.getElementById("import-status");
    const rawEl = document.getElementById("import-raw");
    const note = cell(opts.note);
    syncImportCompanyHint();
    if (status) {
      status.textContent = note;
      status.className = note ? "save-status ok" : "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
    requestAnimationFrame(() => {
      if (!rawEl) return;
      rawEl.focus();
      rawEl.select();
    });
  }

  function closeImportModal() {
    const dialog = document.getElementById("import-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function setBulkMode(next) {
    bulkMode = !!next;
    const btn = document.getElementById("job-bulk-btn");
    if (btn) {
      btn.classList.toggle("is-active", bulkMode);
      btn.setAttribute("aria-pressed", bulkMode ? "true" : "false");
    }
    if (!bulkMode) selectedIds.clear();
    updateBulkBar();
    renderResults();
  }

  function updateBulkBar() {
    const bar = document.getElementById("job-bulk-bar");
    const count = document.getElementById("job-bulk-count");
    if (!bar) return;
    bar.hidden = !bulkMode;
    if (count) {
      const n = selectedIds.size;
      count.textContent = `${n} selected`;
    }
  }

  function excludeOpenings(rows) {
    const ids = new Set(
      (rows || []).map((row) => row && row.id).filter(Boolean),
    );
    if (!ids.size) return 0;
    const before = openings.length;
    openings = openings.filter((row) => !ids.has(row.id));
    collections.jobOpenings = openings;
    for (const id of ids) selectedIds.delete(id);
    const removed = before - openings.length;
    if (!removed) return 0;
    setDirty(true);
    setSaveStatus("");
    if (openJobId && ids.has(openJobId)) closeModal();
    else render();
    updateBulkBar();
    showToast(`Removed ${removed} opening${removed === 1 ? "" : "s"}`, 2200);
    return removed;
  }

  function bulkSetStatus(status) {
    const next = cell(status).toLowerCase();
    if (!selectedIds.size || !STATUS_OPTIONS.includes(next)) return;
    if (next === "excluded") {
      excludeOpenings(openings.filter((row) => selectedIds.has(row.id)));
      return;
    }
    let n = 0;
    for (const row of openings) {
      if (selectedIds.has(row.id)) {
        row.status = next;
        if (next === "subscribed") ensureSubscriptionDate(row);
        n += 1;
      }
    }
    if (!n) return;
    setDirty(true);
    setSaveStatus("");
    render();
    showToast(`Set ${n} opening${n === 1 ? "" : "s"} to ${next}`, 2200);
  }

  function setOpeningStatus(row, status) {
    const next = cell(status).toLowerCase();
    if (!row || !STATUS_OPTIONS.includes(next)) return false;
    if (next === "excluded") {
      excludeOpenings([row]);
      return true;
    }
    if (cell(row.status).toLowerCase() === next) return false;
    row.status = next;
    if (next === "subscribed") ensureSubscriptionDate(row);
    setDirty(true);
    setSaveStatus("");
    render();
    showToast(
      `Status → ${next}${cell(row.role_title) ? ` · ${cell(row.role_title)}` : ""}`,
      2000,
    );
    return true;
  }

  let jobStatusMenuEl = null;
  let jobStatusMenuOutsideBound = false;

  function ensureJobStatusMenu() {
    if (jobStatusMenuEl) return jobStatusMenuEl;
    const menu = document.createElement("div");
    menu.id = "job-status-menu";
    menu.className = "job-status-menu";
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Set opening status");
    document.body.append(menu);
    jobStatusMenuEl = menu;
    if (!jobStatusMenuOutsideBound) {
      jobStatusMenuOutsideBound = true;
      document.addEventListener(
        "pointerdown",
        (e) => {
          if (!jobStatusMenuEl || jobStatusMenuEl.hidden) return;
          if (jobStatusMenuEl.contains(e.target)) return;
          hideJobStatusMenu();
        },
        true,
      );
      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Escape") hideJobStatusMenu();
        },
        true,
      );
      window.addEventListener("scroll", () => hideJobStatusMenu(), true);
      window.addEventListener("resize", () => hideJobStatusMenu());
    }
    return menu;
  }

  function hideJobStatusMenu() {
    if (!jobStatusMenuEl) return;
    jobStatusMenuEl.hidden = true;
    jobStatusMenuEl.replaceChildren();
  }

  function showJobStatusMenu(event, row) {
    const menu = ensureJobStatusMenu();
    hideJobStatusMenu();
    menu.hidden = false;
    const bulk = selectedIds.size > 1 && row && selectedIds.has(row.id);

    const head = document.createElement("div");
    head.className = "job-status-menu-head";
    head.textContent = bulk
      ? `Set status for ${selectedIds.size} openings`
      : "Set status";
    menu.append(head);

    const selectedRows = bulk
      ? openings.filter((item) => selectedIds.has(item.id))
      : [];
    const current = bulk
      ? selectedRows.every(
          (item) =>
            cell(item.status).toLowerCase() ===
            cell(selectedRows[0].status).toLowerCase(),
        )
        ? cell(selectedRows[0].status).toLowerCase()
        : ""
      : cell(row.status).toLowerCase();
    for (const status of STATUS_OPTIONS) {
      const item = document.createElement("button");
      item.type = "button";
      item.className =
        "job-status-menu-item" +
        (status === current ? " is-current" : "") +
        ` job-status-menu-item--${statusTone(status)}`;
      item.setAttribute("role", "menuitemradio");
      item.setAttribute("aria-checked", status === current ? "true" : "false");
      const label = document.createElement("span");
      label.className = "job-status-menu-label";
      const icon = statusIcon(status);
      if (icon) label.append(icon);
      label.append(document.createTextNode(status));
      item.append(label);
      if (status === current) {
        const mark = document.createElement("span");
        mark.className = "job-status-menu-check";
        mark.textContent = "✓";
        mark.setAttribute("aria-hidden", "true");
        item.append(mark);
      }
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideJobStatusMenu();
        if (bulk) bulkSetStatus(status);
        else setOpeningStatus(row, status);
      });
      menu.append(item);
    }

    // Position near cursor, keep on-screen
    const pad = 8;
    menu.style.left = "0px";
    menu.style.top = "0px";
    const rect = menu.getBoundingClientRect();
    let x = event.clientX;
    let y = event.clientY;
    if (x + rect.width + pad > window.innerWidth) {
      x = Math.max(pad, window.innerWidth - rect.width - pad);
    }
    if (y + rect.height + pad > window.innerHeight) {
      y = Math.max(pad, window.innerHeight - rect.height - pad);
    }
    menu.style.left = `${Math.max(pad, x)}px`;
    menu.style.top = `${Math.max(pad, y)}px`;
  }

  function wireBulkStatusSelect() {
    const sel = document.getElementById("job-bulk-status");
    if (!sel) return;
    sel.replaceChildren();
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose…";
    sel.append(blank);
    for (const s of STATUS_OPTIONS) {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      sel.append(opt);
    }
    sel.addEventListener("change", () => {
      const v = cell(sel.value);
      if (!v) return;
      bulkSetStatus(v);
      sel.value = "";
    });
  }

  function bulkClearNew() {
    if (!selectedIds.size) return;
    for (const row of openings) {
      if (selectedIds.has(row.id)) row.is_new = "";
    }
    setDirty(true);
    setSaveStatus("");
    render();
  }

  function bulkDeleteSelected() {
    bulkSetStatus("excluded");
  }

  function bulkSelectAllVisible() {
    for (const row of filteredRows()) selectedIds.add(row.id);
    updateBulkBar();
    renderResults();
  }

  function bulkDeselectAll() {
    selectedIds.clear();
    updateBulkBar();
    renderResults();
  }

  async function loadState() {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error(`GET /api/state failed (${res.status})`);
    const payload = await res.json();
    collections = payload.collections || {};
    openings = Array.isArray(collections.jobOpenings)
      ? collections.jobOpenings.map((row) => ({ ...row }))
      : [];
    const kept = openings.filter(
      (row) => cell(row.status).toLowerCase() !== "excluded",
    );
    const removedExcluded = openings.length - kept.length;
    openings = kept;
    platforms = Array.isArray(collections.jobPlatforms)
      ? collections.jobPlatforms.map((row) => ({ ...row }))
      : [];
    communities = Array.isArray(collections.jobCommunities)
      ? collections.jobCommunities.map((row) => ({ ...row }))
      : [];
    collections.jobOpenings = openings;
    collections.jobPlatforms = platforms;
    collections.jobCommunities = communities;
    let dated = 0;
    for (const row of openings) {
      if (ensureSubscriptionDate(row)) dated += 1;
    }
    if (removedExcluded || dated) setDirty(true);
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
      const dialog = document.getElementById("job-modal");
      const modalOpen = !!(dialog && dialog.open);

      // Ctrl/Cmd+Enter or Shift+Enter: proceed on the open prompt or import modal
      const isEnter =
        event.key === "Enter" ||
        event.code === "Enter" ||
        event.code === "NumpadEnter";
      if (isEnter && !event.altKey && (mod || event.shiftKey)) {
        const proceed = [
          ["form-import-modal", handleImportFormRun],
          ["form-prompt-modal", handleBuildAndSendFormPrompt],
          ["cover-import-modal", handleCoverImportRun],
          ["cover-prompt-modal", handleCoverPromptCopy],
          ["import-modal", handleImportRun],
          ["prompt-modal", handleCopyPrompt],
        ].find(([id]) => document.getElementById(id)?.open);
        if (proceed) {
          event.preventDefault();
          proceed[1]();
          return;
        }
      }

      // Ctrl/Cmd+Enter: close dossier / open focused job URL
      if (mod && !event.altKey) {
        if (isEnter) {
          if (modalOpen) {
            event.preventDefault();
            void doneModal();
            return;
          }
          event.preventDefault();
          void openFocusedJobUrl();
          return;
        }
      }

      // Delete open dossier or focused card — Alt+Delete
      if (
        event.altKey &&
        !mod &&
        !event.shiftKey &&
        (event.key === "Delete" || event.code === "Delete")
      ) {
        const row = activeOpening();
        if (row && (modalOpen || (!typing && focusedJobCard()))) {
          event.preventDefault();
          deleteOpening(row.id);
          return;
        }
      }

      // Bulk selection — Delete sets every selected opening to excluded.
      if (
        !event.altKey &&
        !event.shiftKey &&
        !mod &&
        !typing &&
        !modalOpen &&
        selectedIds.size > 1 &&
        (event.key === "Delete" || event.code === "Delete")
      ) {
        event.preventDefault();
        bulkSetStatus("excluded");
        return;
      }

      // Openings page actions — Alt+letter (Shift reserved for global nav)
      if (event.altKey && !mod && !event.shiftKey) {
        const code = event.code;
        const targetOpening = activeOpening();
        const hasCardOrDossier = !!(modalOpen || focusedJobCard());
        const isM =
          event.code === "KeyM" || (event.key || "").toLowerCase() === "m";
        if (isM) {
          event.preventDefault();
          event.stopPropagation();
          pinFocusedOpening();
          return;
        }

        // Add new opening — Alt+N
        if (!modalOpen && !typing && code === "KeyN") {
          event.preventDefault();
          event.stopPropagation();
          addOpening();
          return;
        }

        // Generate prompt — Alt+R. The import box opens after a successful send.
        if (code === "KeyR") {
          event.preventDefault();
          event.stopPropagation();
          openPromptModal({
            companyId: cell(targetOpening?.company_key),
            selectAllPaths: true,
          });
          return;
        }

        // Form / cover prompts: open dossier OR focused card.
        // Allow while typing only inside an open dossier (modal fields).
        // Import boxes open after a successful send, so they have no shortcut.
        const dossierShortcutOk = hasCardOrDossier && (modalOpen || !typing);
        if (dossierShortcutOk && code === "KeyF") {
          event.preventDefault();
          event.stopPropagation();
          openFormPromptModal();
          return;
        }
        if (dossierShortcutOk && code === "KeyC") {
          event.preventDefault();
          event.stopPropagation();
          openCoverPromptModal();
          return;
        }

        // Search — Alt+S
        const isS = code === "KeyS" || (event.key || "").toLowerCase() === "s";
        if (isS) {
          event.preventDefault();
          event.stopPropagation();
          toggleSearchBar();
          return;
        }
      }

      // Toggle cards ↔ filters — Alt+Shift+F (Alt+F is form prompt on openings)
      if (
        event.altKey &&
        event.shiftKey &&
        !mod &&
        (event.code === "KeyF" || (event.key || "").toLowerCase() === "f")
      ) {
        event.preventDefault();
        event.stopPropagation();
        window.CardNav?.toggleCardsFilters(
          CARD_SEL,
          FILTER_SEL,
          "#job-modal[open] .field-input, #job-modal[open] select.field-input, #job-modal[open] textarea.field-input",
        );
        return;
      }
      if (event.key === "Escape") {
        const resumeOpen = document.getElementById("resume-viewer-modal")?.open;
        if (resumeOpen) {
          closeResumeViewer();
          return;
        }
        const formPromptOpen =
          document.getElementById("form-prompt-modal")?.open;
        if (formPromptOpen) {
          closeFormPromptModal();
          return;
        }
        const formImportOpen =
          document.getElementById("form-import-modal")?.open;
        if (formImportOpen) {
          closeFormImportModal();
          return;
        }
        const coverPromptOpen =
          document.getElementById("cover-prompt-modal")?.open;
        if (coverPromptOpen) {
          closeCoverPromptModal();
          return;
        }
        const coverImportOpen =
          document.getElementById("cover-import-modal")?.open;
        if (coverImportOpen) {
          closeCoverImportModal();
          return;
        }
        const promptOpen = document.getElementById("prompt-modal")?.open;
        if (promptOpen) {
          closePromptModal();
          return;
        }
        const importOpen = document.getElementById("import-modal")?.open;
        if (importOpen) {
          closeImportModal();
          return;
        }
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
        if (bulkMode && selectedIds.size) {
          event.preventDefault();
          bulkDeselectAll();
          return;
        }
        if (bulkMode) {
          event.preventDefault();
          setBulkMode(false);
          renderResults();
          return;
        }
        if (hasActiveJobFilters()) {
          event.preventDefault();
          clearJobFilters();
          return;
        }
        window.CardNav?.clearFocus?.();
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

      if (event.altKey || mod || typing) return;

      if (!event.shiftKey) return;

      if (
        !modalOpen &&
        (event.code === "KeyS" || event.key.toLowerCase() === "s")
      ) {
        event.preventDefault();
        toggleStatusFilter("saved");
        return;
      }
      if (
        !modalOpen &&
        (event.code === "KeyR" || event.key.toLowerCase() === "r")
      ) {
        event.preventDefault();
        toggleStatusFilter("subscribed");
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
        location.assign("/profile.html");
        return;
      }
      if (event.key.toLowerCase() === "o" || event.code === "KeyO") {
        event.preventDefault();
        location.assign("/people.html");
        return;
      }
      if (event.code === "KeyC" || event.key.toLowerCase() === "c") {
        event.preventDefault();
        if (selectedOpening()) {
          void openSelectedCompanyPortal();
          return;
        }
        location.assign("/companies.html");
        return;
      }
      if (event.key.toLowerCase() === "j" || event.code === "KeyJ") {
        event.preventDefault();
        location.assign("/portals.html");
        return;
      }
      if (event.key.toLowerCase() === "g" || event.code === "KeyG") {
        event.preventDefault();
        location.assign("/");
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
    setLangMode(mode);
  }

  function wireModal() {
    const dialog = document.getElementById("job-modal");
    const closeBtn = document.getElementById("job-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal());
    if (dialog) {
      dialog.addEventListener("close", () => {
        openJobId = "";
        renderResults();
      });
      dialog.addEventListener("click", (e) => {
        if (e.target === dialog) closeModal();
      });
    }

    const promptDialog = document.getElementById("prompt-modal");
    document
      .getElementById("prompt-modal-close")
      ?.addEventListener("click", () => closePromptModal());
    if (promptDialog) {
      promptDialog.addEventListener("click", (e) => {
        if (e.target === promptDialog) closePromptModal();
      });
    }
    document
      .getElementById("prompt-path-all")
      ?.addEventListener("change", (event) => {
        const on = !!event.target.checked;
        event.target.indeterminate = false;
        for (const box of promptPathBoxes()) box.checked = on;
      });
    document
      .getElementById("prompt-paths")
      ?.addEventListener("change", (event) => {
        if (event.target?.name !== "prompt-path") return;
        syncSelectAllPaths();
      });
    syncSelectAllPaths();
    document
      .getElementById("prompt-copy-btn")
      ?.addEventListener("click", () => handleCopyPrompt());
    document
      .getElementById("prompt-stay-btn")
      ?.addEventListener("click", () => cancelPromptAutoClose());

    const importDialog = document.getElementById("import-modal");
    document
      .getElementById("import-modal-close")
      ?.addEventListener("click", () => closeImportModal());
    if (importDialog) {
      importDialog.addEventListener("click", (e) => {
        if (e.target === importDialog) closeImportModal();
      });
    }
    document
      .getElementById("import-run-btn")
      ?.addEventListener("click", () => handleImportRun());

    const formPromptDialog = document.getElementById("form-prompt-modal");
    document
      .getElementById("form-prompt-modal-close")
      ?.addEventListener("click", () => closeFormPromptModal());
    if (formPromptDialog) {
      formPromptDialog.addEventListener("click", (e) => {
        if (e.target === formPromptDialog) closeFormPromptModal();
      });
    }
    document
      .getElementById("form-prompt-send-btn")
      ?.addEventListener("click", () => void handleBuildAndSendFormPrompt());
    document
      .getElementById("form-prompt-opening")
      ?.addEventListener("change", () => {
        syncFormPromptPathsFromOpening();
        void syncFormWindowName();
      });

    const formImportDialog = document.getElementById("form-import-modal");
    document
      .getElementById("form-import-modal-close")
      ?.addEventListener("click", () => closeFormImportModal());
    if (formImportDialog) {
      formImportDialog.addEventListener("click", (e) => {
        if (e.target === formImportDialog) closeFormImportModal();
      });
    }
    document
      .getElementById("form-import-run-btn")
      ?.addEventListener("click", () => handleImportFormRun());

    const resumeDialog = document.getElementById("resume-viewer-modal");
    document
      .getElementById("resume-viewer-close")
      ?.addEventListener("click", () => closeResumeViewer());
    if (resumeDialog) {
      resumeDialog.addEventListener("close", () => {
        const frame = document.getElementById("resume-viewer-frame");
        if (frame) frame.src = "about:blank";
      });
      resumeDialog.addEventListener("click", (e) => {
        if (e.target === resumeDialog) closeResumeViewer();
      });
    }
  }

  function decoratePromptPathIcons() {
    if (!window.CareerPathIcons) return;
    document
      .querySelectorAll("#prompt-paths label.prompt-path-check")
      .forEach((label) => {
        const input = label.querySelector('input[name="prompt-path"]');
        if (!input || !window.CareerPathIcons.resolveKey(input.value)) return;
        if (label.querySelector(".path-icon")) return;
        const icon = window.CareerPathIcons.pathIconNode(input.value);
        if (!icon) return;
        // Place icon after the checkbox input
        input.insertAdjacentElement("afterend", icon);
      });
  }

  async function init() {
    decoratePromptPathIcons();
    initLangMode();
    wireModal();
    window.CardNav?.configureHome(CARD_SEL, FILTER_SEL);
    initKeyboard();

    window.addEventListener("beforeunload", () => {
      flushSaveKeepalive();
    });

    document
      .getElementById("open-portals-btn")
      ?.addEventListener("click", () => location.assign("/portals.html"));
    document
      .getElementById("open-profile-btn")
      ?.addEventListener("click", () => location.assign("/profile.html"));
    document
      .getElementById("open-companies-btn")
      ?.addEventListener("click", () => location.assign("/companies.html"));
    document
      .getElementById("open-help-btn")
      ?.addEventListener("click", () => location.assign("/help.html"));
    document
      .getElementById("open-advice-btn")
      ?.addEventListener("click", () => location.assign("/advice.html"));
    document
      .getElementById("open-openings-btn")
      ?.addEventListener("click", () => location.assign("/"));
    document
      .getElementById("open-jobs-btn")
      ?.addEventListener("click", () => location.assign("/"));

    const search = document.getElementById("job-search-input");
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

    document
      .getElementById("job-add-btn")
      ?.addEventListener("click", () => addOpening());
    document
      .getElementById("job-prompt-btn")
      ?.addEventListener("click", () => openPromptModal());
    document
      .getElementById("job-import-btn")
      ?.addEventListener("click", () => openImportModal());
    document
      .getElementById("job-already-notice-close")
      ?.addEventListener("click", () => hideAlreadyNotice());
    document
      .getElementById("cover-prompt-modal-close")
      ?.addEventListener("click", () => closeCoverPromptModal());
    document
      .getElementById("cover-import-modal-close")
      ?.addEventListener("click", () => closeCoverImportModal());
    document
      .getElementById("cover-prompt-copy-btn")
      ?.addEventListener("click", () => handleCoverPromptCopy());
    document
      .getElementById("cover-import-run-btn")
      ?.addEventListener("click", () => handleCoverImportRun());
    document
      .getElementById("cover-prompt-opening")
      ?.addEventListener("change", () => syncCoverPromptFromOpening());
    document
      .getElementById("job-bulk-btn")
      ?.addEventListener("click", () => setBulkMode(!bulkMode));

    document
      .getElementById("job-bulk-select-all")
      ?.addEventListener("click", () => bulkSelectAllVisible());
    document
      .getElementById("job-bulk-deselect")
      ?.addEventListener("click", () => bulkDeselectAll());
    wireBulkStatusSelect();
    document
      .getElementById("job-bulk-clear-new")
      ?.addEventListener("click", () => bulkClearNew());
    document
      .getElementById("job-bulk-delete")
      ?.addEventListener("click", () => bulkDeleteSelected());

    try {
      fetch("/api/debug/environment")
        .then((r) => r.json())
        .then((env) => {
          console.log("[Career Cockpit] Active environment:", env);
        })
        .catch(() => {});
      await loadState();
      render();
      setDirty(false);
      setSaveStatus("");
      updateBulkBar();
      consumeLaunchQuery();
    } catch (err) {
      setSaveStatus("Load error: " + (err.message || String(err)), "err");
    }
  }

  function consumeLaunchQuery() {
    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const company = cell(params.get("company"));
    const qParam = cell(params.get("q"));
    if (company) {
      launchCompanyKey = company;
      query = company;
      const search = searchInputEl();
      if (search) search.value = company;
    } else if (qParam) {
      query = qParam;
      const search = searchInputEl();
      if (search) search.value = qParam;
    }
    if (action !== "prompt" && action !== "import") {
      if (company || qParam) renderResults();
      return;
    }
    history.replaceState(null, "", location.pathname);
    if (action === "prompt") {
      openPromptModal({
        companyId: company,
        selectAllPaths: true,
        autoIngest: params.get("autoIngest") !== "0",
      });
      requestAnimationFrame(() => {
        document.getElementById("prompt-raw")?.focus();
      });
      return;
    }
    openImportModal();
  }

  init();
})();
