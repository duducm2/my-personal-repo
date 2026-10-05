(() => {
  const FIT_PATHS = [
    { key: "da", short: "DA", label: "Data Analyst" },
    { key: "po", short: "PO", label: "Product Owner" },
    { key: "dsa", short: "DSA", label: "Digital Solution Architect" },
    { key: "ds", short: "DS", label: "Data Scientist" },
  ];

  const SCOPE_OPTIONS = ["brazil", "international"];
  const SYSTEM_KIND_OPTIONS = ["proprietary", "third_party", "unknown"];

  let collections = {};
  let portals = [];
  let platforms = [];
  let communities = [];
  let dirty = false;
  let saving = false;
  let saveTimer = null;
  let saveGeneration = 0;
  const SAVE_DEBOUNCE_MS = 500;
  let query = "";
  let scopeFilter = "";
  let pathFilter = "";
  let openPortalId = "";

  function cell(v) {
    return v == null ? "" : String(v);
  }

  function parseFitPaths(raw) {
    return cell(raw)
      .toLowerCase()
      .split(/[;|,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function systemTag(kind, atsName) {
    const k = cell(kind).toLowerCase();
    if (k === "third_party") {
      return {
        label: atsName ? `[Third-Party ATS] ${atsName}` : "[Third-Party ATS]",
        className: "company-chip company-chip-ats",
      };
    }
    if (k === "proprietary") {
      return {
        label: "[Proprietary System]",
        className: "company-chip company-chip-priority",
      };
    }
    return {
      label: "[Unknown]",
      className: "company-chip",
    };
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
    collections.jobPortals = portals;
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

  function openPortalsHome() {
    location.assign("/portals.html");
  }

  function openProfileWindow() {
    location.assign("/profile.html");
  }

  function openCompaniesWindow() {
    location.assign("/companies.html");
  }

  function openOpeningsWindow() {
    location.assign("/");
  }

  function searchBarEl() {
    return document.getElementById("search-bar");
  }

  function searchInputEl() {
    return document.getElementById("portal-search-input");
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

  const CARD_SEL = "#portals-results .company-tile";
  const FILTER_SEL = "#portals-filters";

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

  function hasActivePortalFilters() {
    return !!(scopeFilter || pathFilter || (query || "").trim());
  }

  function clearPortalFilters() {
    scopeFilter = "";
    pathFilter = "";
    query = "";
    const search = searchInputEl();
    if (search) search.value = "";
    hideSearchBar({ focusCard: false });
    render();
    window.CardNav?.focusFirst(CARD_SEL);
  }

  function makeChip(chip, activeKey, onPick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "filter-chip" + (chip.key === activeKey ? " is-active" : "");
    const en = document.createElement("span");
    en.className = "filter-chip-en";
    en.textContent = chip.en;
    btn.append(en);
    btn.addEventListener("click", () => onPick(chip.key));
    return btn;
  }

  function renderFilters() {
    const root = document.getElementById("portals-filters");
    if (!root) return;
    root.replaceChildren();

    const scopeRow = document.createElement("div");
    scopeRow.className = "company-filter-row";
    const scopeLabel = document.createElement("span");
    scopeLabel.className = "company-filter-label";
    const scopeEn = document.createElement("span");
    scopeEn.className = "filter-chip-en";
    scopeEn.textContent = "Scope";
    scopeLabel.append(scopeEn);
    scopeRow.append(scopeLabel);
    for (const chip of [
      { key: "", en: "All" },
      { key: "brazil", en: "Brazil" },
      { key: "international", en: "International" },
    ]) {
      scopeRow.append(
        makeChip(chip, scopeFilter, (key) => {
          scopeFilter = key;
          render();
        }),
      );
    }
    root.append(scopeRow);

    const pathRow = document.createElement("div");
    pathRow.className = "company-filter-row";
    const pathLabel = document.createElement("span");
    pathLabel.className = "company-filter-label";
    const pathEn = document.createElement("span");
    pathEn.className = "filter-chip-en";
    pathEn.textContent = "Career path";
    pathLabel.append(pathEn);
    pathRow.append(pathLabel);
    for (const chip of [
      { key: "", en: "All paths" },
      { key: "da", en: "Data Analyst" },
      { key: "po", en: "Product Owner" },
      { key: "dsa", en: "Digital Solution Architect" },
      { key: "ds", en: "Data Scientist" },
    ]) {
      pathRow.append(
        makeChip(chip, pathFilter, (key) => {
          pathFilter = key;
          render();
        }),
      );
    }
    root.append(pathRow);
  }

  function cardKindTag(kind) {
    if (kind === "watch") {
      return {
        label: "[Watch page]",
        className: "company-chip company-chip-watch",
      };
    }
    if (kind === "community") {
      return {
        label: "[Community]",
        className: "company-chip company-chip-community",
      };
    }
    return null;
  }

  function watchAndCommunityCards() {
    const watch = platforms.map((p) => ({
      card_kind: "watch",
      id: cell(p.id),
      sort_order: cell(p.sort_order) || "0",
      name: cell(p.label) || cell(p.company_key) || cell(p.id),
      job_search_url: cell(p.url),
      scope: "",
      notes: cell(p.company_key)
        ? `Employer / campus · ${cell(p.company_key)}`
        : "",
      system_kind: "",
      ats_name: "",
      ats_url: "",
      fit_paths: "da;po;dsa;ds",
    }));
    const comm = communities.map((c) => ({
      card_kind: "community",
      id: cell(c.id),
      sort_order: cell(c.sort_order) || "0",
      name: cell(c.name) || cell(c.id),
      job_search_url: cell(c.url),
      scope: "",
      notes: cell(c.notes),
      system_kind: "",
      ats_name: "",
      ats_url: "",
      fit_paths: "da;po;dsa;ds",
    }));
    return [...watch, ...comm];
  }

  function matchesQuery(haystack) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return haystack.toLowerCase().includes(q);
  }

  function isPinned(row) {
    const v = cell(row?.pinned).toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "y";
  }

  function pinRank(row) {
    if (row?.card_kind && row.card_kind !== "portal") {
      return 1;
    }
    const live = portals.find((p) => cell(p.id) === cell(row?.id)) || row;
    return isPinned(live) ? 0 : 1;
  }

  function scrollPortalCardIntoView(id) {
    const sid = cell(id);
    if (!sid) return;
    requestAnimationFrame(() => {
      const card = document.querySelector(
        `#portals-results .portal-card[data-id="${CSS.escape(sid)}"]`,
      );
      card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function togglePinned(row, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (row.card_kind && row.card_kind !== "portal") return;
    const target = portals.find((p) => cell(p.id) === cell(row.id)) || null;
    if (!target) return;
    target.pinned = isPinned(target) ? "" : "1";
    setDirty(true);
    setSaveStatus("");
    render();
    if (openPortalId === cell(target.id)) fillModal();
    if (isPinned(target)) scrollPortalCardIntoView(target.id);
  }

  function appendPinControl(parent, row, { stopPropagation = true } = {}) {
    if (row.card_kind && row.card_kind !== "portal") return null;
    const live = portals.find((p) => cell(p.id) === cell(row.id)) || row;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin-btn" + (isPinned(live) ? " is-on" : "");
    btn.setAttribute("aria-pressed", isPinned(live) ? "true" : "false");
    btn.title = isPinned(live)
      ? "Unpin from top (Alt+M)"
      : "Pin to top (Alt+M)";
    btn.textContent = isPinned(live) ? "Pinned" : "Pin";
    btn.addEventListener("click", (event) => {
      if (stopPropagation) {
        event.preventDefault();
        event.stopPropagation();
      }
      togglePinned(live, event);
    });
    parent.append(btn);
    return btn;
  }

  function filteredPortals() {
    const market = portals.map((row) => ({ ...row, card_kind: "portal" }));
    const extra = watchAndCommunityCards();
    return [...market, ...extra]
      .slice()
      .sort((a, b) => {
        const pr = pinRank(a) - pinRank(b);
        if (pr) return pr;
        const kindRank = (k) => (k === "portal" ? 0 : k === "watch" ? 1 : 2);
        const kr = kindRank(a.card_kind) - kindRank(b.card_kind);
        if (kr) return kr;
        return (
          Number(cell(a.sort_order) || 0) - Number(cell(b.sort_order) || 0)
        );
      })
      .filter((row) => {
        const scope = cell(row.scope).toLowerCase();
        if (scopeFilter && scope && scope !== scopeFilter) return false;
        const paths = parseFitPaths(row.fit_paths);
        if (pathFilter && paths.length && !paths.includes(pathFilter)) {
          return false;
        }
        const hay = [
          row.name,
          row.notes,
          row.ats_name,
          row.system_kind,
          row.scope,
          row.fit_paths,
          row.id,
          row.card_kind,
        ]
          .map(cell)
          .join(" ");
        return matchesQuery(hay);
      });
  }

  function appendPathChips(parent, paths) {
    const wrap = document.createElement("div");
    wrap.className = "role-badges";
    for (const fit of FIT_PATHS) {
      const on = paths.includes(fit.key);
      const badge = document.createElement("span");
      badge.className = "role-badge" + (on ? " is-on" : " is-off");
      badge.textContent = fit.short;
      badge.title = fit.label;
      wrap.append(badge);
    }
    parent.append(wrap);
  }

  async function openUrlInNewTab(url) {
    const href = cell(url);
    if (!href) return false;
    // Ask the local server to launch a new browser window so Chrome
    // switches away from the cockpit tab (window.open only adds a background tab).
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
    // Fallback when the server is old / offline: still try a client popup window.
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

  function openCardUrl(row) {
    return openUrlInNewTab(row.job_search_url);
  }

  function moveCardFocus(delta) {
    return !!window.CardNav?.moveInContext(CARD_SEL, FILTER_SEL, delta);
  }

  function focusedPortalCard() {
    const el = document.activeElement;
    const card = el?.closest?.("#portals-results .company-tile");
    return card || null;
  }

  async function openFocusedPortal() {
    const card = focusedPortalCard();
    if (!card) return false;
    return openUrlInNewTab(card.dataset.url);
  }

  function pinTargetPortal() {
    if (openPortalId) {
      return portals.find((p) => cell(p.id) === cell(openPortalId)) || null;
    }
    const card = focusedPortalCard();
    if (!card || cell(card.dataset.kind) !== "portal") return null;
    return portals.find((p) => cell(p.id) === cell(card.dataset.id)) || null;
  }

  function pinFocusedPortal() {
    const row = pinTargetPortal();
    if (!row) {
      setSaveStatus("Focus a portal card (or open its dossier) to pin", "err");
      return false;
    }
    togglePinned(row);
    setSaveStatus(
      isPinned(row)
        ? `Pinned: ${cell(row.name) || row.id}`
        : `Unpinned: ${cell(row.name) || row.id}`,
      "ok",
    );
    return true;
  }

  function renderPortalCard(row) {
    const isLinkCard =
      row.card_kind === "watch" || row.card_kind === "community";
    const card = document.createElement("button");
    card.type = "button";
    card.className =
      "company-tile portal-card" +
      (isPinned(row) ? " is-pinned" : "") +
      (openPortalId === row.id && !isLinkCard ? " is-active" : "");
    card.dataset.id = cell(row.id);
    card.dataset.url = cell(row.job_search_url);
    card.dataset.kind = cell(row.card_kind) || "portal";
    card.addEventListener("click", (event) => {
      if (isLinkCard) {
        event.preventDefault();
        openCardUrl(row);
        return;
      }
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        openCardUrl(row);
        return;
      }
      openModal(row.id);
    });
    if (cell(row.job_search_url)) {
      card.title = isLinkCard
        ? "Click / Ctrl+Enter to open in a new window"
        : "Click to edit · Ctrl/Cmd+click or Ctrl+Enter to open in a new window";
    }

    const title = document.createElement("div");
    title.className = "company-tile-title";
    title.textContent = cell(row.name) || row.id;

    const geo = window.CountryFlags.resolveCountries(
      row.scope,
      row.name,
      row.notes,
    );
    window.CountryFlags.prependFlags(card, title, geo);

    const meta = document.createElement("div");
    meta.className = "company-tile-meta";
    const scopeLabel =
      cell(row.scope).toLowerCase() === "brazil"
        ? "Brazil"
        : cell(row.scope).toLowerCase() === "international"
          ? "International"
          : cell(row.scope);
    meta.textContent = [scopeLabel, cell(row.notes)]
      .filter(Boolean)
      .join(" · ");

    const chips = document.createElement("div");
    chips.className = "company-tile-chips";
    appendPinControl(chips, row);
    const special = cardKindTag(row.card_kind);
    if (special) {
      const tagEl = document.createElement("span");
      tagEl.className = special.className;
      tagEl.textContent = special.label;
      chips.append(tagEl);
    } else {
      const tag = systemTag(row.system_kind, row.ats_name);
      const tagEl = document.createElement("span");
      tagEl.className = tag.className;
      tagEl.textContent = tag.label;
      chips.append(tagEl);
    }

    if (
      cell(row.ats_url) &&
      cell(row.system_kind).toLowerCase() === "third_party"
    ) {
      const atsLink = document.createElement("a");
      atsLink.className = "portal-ats-link";
      atsLink.href = row.ats_url;
      atsLink.target = "_blank";
      atsLink.rel = "noopener noreferrer";
      atsLink.textContent = cell(row.ats_name) || "ATS";
      atsLink.addEventListener("click", (e) => e.stopPropagation());
      chips.append(atsLink);
    }

    card.append(meta, chips);
    if (!isLinkCard) {
      appendPathChips(card, parseFitPaths(row.fit_paths));
    }
    return card;
  }

  function renderResults() {
    const portalRoot = document.getElementById("portals-results");
    const portalCount = document.getElementById("portal-result-count");
    if (!portalRoot) return;

    const portalRows = filteredPortals();

    portalRoot.replaceChildren();
    if (!portalRows.length) {
      const empty = document.createElement("p");
      empty.className = "company-bento-empty muted";
      empty.textContent = "No portals match these filters.";
      portalRoot.append(empty);
    } else {
      for (const row of portalRows) portalRoot.append(renderPortalCard(row));
    }

    if (portalCount) {
      portalCount.textContent = `${portalRows.length} portal${
        portalRows.length === 1 ? "" : "s"
      }`;
    }
  }

  function render() {
    renderFilters();
    renderResults();
  }

  function currentOpenRow() {
    return portals.find((r) => r.id === openPortalId) || null;
  }

  function openModal(id) {
    openPortalId = id;
    const dialog = document.getElementById("portal-modal");
    fillModal();
    if (dialog && typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    }
    renderResults();
  }

  function closeModal() {
    openPortalId = "";
    const dialog = document.getElementById("portal-modal");
    if (dialog && dialog.open) dialog.close();
    renderResults();
  }

  function fieldLabel(text) {
    const lab = document.createElement("span");
    lab.textContent = text;
    return lab;
  }

  function bindTextField(row, key, input, { rerender = false } = {}) {
    input.addEventListener("input", () => {
      row[key] = input.value;
      setDirty(true);
      setSaveStatus("");
      if (key === "name") {
        const titleEl = document.getElementById("portal-modal-title");
        if (titleEl) titleEl.textContent = cell(row.name) || row.id;
      }
      if (rerender) {
        fillModal();
        renderResults();
      } else {
        renderResults();
      }
    });
  }

  function fillModal() {
    const row = currentOpenRow();
    const titleEl = document.getElementById("portal-modal-title");
    const body = document.getElementById("portal-modal-body");
    if (!titleEl || !body) return;
    if (!row) {
      titleEl.textContent = "";
      body.replaceChildren();
      return;
    }

    titleEl.textContent = cell(row.name) || row.id;
    body.replaceChildren();

    const pinRow = document.createElement("div");
    pinRow.className = "company-tile-chips company-modal-pin";
    appendPinControl(pinRow, row, { stopPropagation: false });
    body.append(pinRow);

    const editGrid = document.createElement("div");
    editGrid.className = "company-result-edit";

    const nameLabel = document.createElement("label");
    nameLabel.className = "company-edit-field";
    nameLabel.append(fieldLabel("Name"));
    const nameInput = document.createElement("input");
    nameInput.className = "field-input";
    nameInput.value = cell(row.name);
    bindTextField(row, "name", nameInput);
    nameLabel.append(nameInput);
    editGrid.append(nameLabel);

    const pinLabel = document.createElement("label");
    pinLabel.className = "company-edit-field";
    pinLabel.append(fieldLabel("Pinned"));
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
    pinLabel.append(pinSelect);
    editGrid.append(pinLabel);

    const scopeLabel = document.createElement("label");
    scopeLabel.className = "company-edit-field";
    scopeLabel.append(fieldLabel("Scope"));
    const scopeSelect = document.createElement("select");
    scopeSelect.className = "field-input";
    for (const opt of SCOPE_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt === "brazil" ? "Brazil" : "International";
      if (cell(row.scope).toLowerCase() === opt) o.selected = true;
      scopeSelect.append(o);
    }
    if (!SCOPE_OPTIONS.includes(cell(row.scope).toLowerCase())) {
      const o = document.createElement("option");
      o.value = cell(row.scope);
      o.textContent = cell(row.scope) || "(blank)";
      o.selected = true;
      scopeSelect.append(o);
    }
    scopeSelect.addEventListener("change", () => {
      row.scope = scopeSelect.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    scopeLabel.append(scopeSelect);
    editGrid.append(scopeLabel);

    const kindLabel = document.createElement("label");
    kindLabel.className = "company-edit-field";
    kindLabel.append(fieldLabel("Board type"));
    const kindSelect = document.createElement("select");
    kindSelect.className = "field-input";
    const kindLabels = {
      proprietary: "Own careers site",
      third_party: "Third-party ATS",
      unknown: "Unknown",
    };
    for (const opt of SYSTEM_KIND_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = kindLabels[opt] || opt;
      if (cell(row.system_kind).toLowerCase() === opt) o.selected = true;
      kindSelect.append(o);
    }
    if (!SYSTEM_KIND_OPTIONS.includes(cell(row.system_kind).toLowerCase())) {
      const o = document.createElement("option");
      o.value = cell(row.system_kind);
      o.textContent = cell(row.system_kind) || "(blank)";
      o.selected = true;
      kindSelect.append(o);
    }
    kindSelect.addEventListener("change", () => {
      row.system_kind = kindSelect.value;
      setDirty(true);
      setSaveStatus("");
      fillModal();
      renderResults();
    });
    kindLabel.append(kindSelect);
    editGrid.append(kindLabel);

    body.append(editGrid);

    const urls = document.createElement("div");
    urls.className = "company-result-edit";

    const urlLabel = document.createElement("label");
    urlLabel.className = "company-edit-field";
    urlLabel.append(fieldLabel("Job search URL"));
    const urlInput = document.createElement("input");
    urlInput.className = "field-input";
    urlInput.value = cell(row.job_search_url);
    bindTextField(row, "job_search_url", urlInput);
    urlLabel.append(urlInput);
    urls.append(urlLabel);

    const atsNameLabel = document.createElement("label");
    atsNameLabel.className = "company-edit-field";
    atsNameLabel.append(fieldLabel("ATS name"));
    const atsNameInput = document.createElement("input");
    atsNameInput.className = "field-input";
    atsNameInput.value = cell(row.ats_name);
    bindTextField(row, "ats_name", atsNameInput, { rerender: true });
    atsNameLabel.append(atsNameInput);
    urls.append(atsNameLabel);

    const atsUrlLabel = document.createElement("label");
    atsUrlLabel.className = "company-edit-field";
    atsUrlLabel.append(fieldLabel("ATS URL"));
    const atsUrlInput = document.createElement("input");
    atsUrlInput.className = "field-input";
    atsUrlInput.value = cell(row.ats_url);
    bindTextField(row, "ats_url", atsUrlInput, { rerender: true });
    atsUrlLabel.append(atsUrlInput);
    urls.append(atsUrlLabel);

    const pathsLabel = document.createElement("label");
    pathsLabel.className = "company-edit-field";
    pathsLabel.append(fieldLabel("Career paths"));
    const pathsInput = document.createElement("input");
    pathsInput.className = "field-input";
    pathsInput.value = cell(row.fit_paths);
    pathsInput.placeholder = "e.g. da;po;dsa;ds";
    pathsInput.addEventListener("input", () => {
      row.fit_paths = pathsInput.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    pathsLabel.append(pathsInput);
    urls.append(pathsLabel);

    body.append(urls);

    if (cell(row.job_search_url)) {
      const openLink = document.createElement("a");
      openLink.className = "company-result-link";
      openLink.href = row.job_search_url;
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";
      openLink.textContent = "Open URL: " + row.job_search_url;
      body.append(openLink);
    }

    appendPathChips(body, parseFitPaths(row.fit_paths));

    const notesLabel = document.createElement("label");
    notesLabel.className = "company-edit-field";
    notesLabel.append(fieldLabel("Notes"));
    const notesInput = document.createElement("textarea");
    notesInput.className = "field-input tall";
    notesInput.rows = 4;
    notesInput.value = cell(row.notes);
    notesInput.addEventListener("input", () => {
      row.notes = notesInput.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    notesLabel.append(notesInput);
    body.append(notesLabel);

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
    del.textContent = "Delete portal";
    del.title = "Delete portal (Shift+Delete)";
    del.addEventListener("click", () => deletePortal(row.id));
    actions.append(done, del);
    body.append(actions);
  }

  function blankPortal() {
    const maxSort = portals.reduce(
      (m, p) => Math.max(m, Number(cell(p.sort_order) || 0)),
      0,
    );
    return {
      id: `portal-${Date.now()}`,
      sort_order: String(maxSort + 1),
      pinned: "",
      scope: "brazil",
      name: "New portal",
      job_search_url: "",
      system_kind: "proprietary",
      ats_name: "",
      ats_url: "",
      fit_paths: "da;po;dsa;ds",
      notes: "",
    };
  }

  function addPortal() {
    const row = blankPortal();
    portals.push(row);
    scopeFilter = "";
    pathFilter = "";
    query = "";
    const search = searchInputEl();
    if (search) search.value = "";
    hideSearchBar({ focusCard: false });
    setDirty(true);
    setSaveStatus("");
    render();
    openModal(row.id);
  }

  function deletePortal(id, { confirmDelete = true } = {}) {
    if (!id) return false;
    if (confirmDelete && !confirm("Delete this job portal?")) return false;
    const idx = portals.findIndex((p) => p.id === id);
    if (idx < 0) return false;
    portals.splice(idx, 1);
    if (openPortalId === id) closeModal();
    setDirty(true);
    setSaveStatus("");
    render();
    return true;
  }

  async function loadState() {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error(`GET /api/state failed (${res.status})`);
    const payload = await res.json();
    collections = payload.collections || {};
    portals = Array.isArray(collections.jobPortals)
      ? collections.jobPortals.map((row) => ({ ...row }))
      : [];
    platforms = Array.isArray(collections.jobPlatforms)
      ? collections.jobPlatforms.map((row) => ({ ...row }))
      : [];
    communities = Array.isArray(collections.jobCommunities)
      ? collections.jobCommunities.map((row) => ({ ...row }))
      : [];
    collections.jobPortals = portals;
    collections.jobPlatforms = platforms;
    collections.jobCommunities = communities;
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
      const dialog = document.getElementById("portal-modal");
      const modalOpen = !!(dialog && dialog.open);

      if (mod && !event.altKey && event.key === "Enter") {
        event.preventDefault();
        if (modalOpen) {
          void doneModal();
          return;
        }
        void openFocusedPortal();
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
        deletePortal(openPortalId);
        return;
      }

      // Add new portal — Shift+N
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
        addPortal();
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
            "#portal-modal[open] .field-input, #portal-modal[open] select.field-input, #portal-modal[open] textarea.field-input",
          );
          return;
        }
        const isM =
          event.code === "KeyM" || (event.key || "").toLowerCase() === "m";
        if (isM) {
          event.preventDefault();
          event.stopPropagation();
          pinFocusedPortal();
          return;
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
        if (hasActivePortalFilters()) {
          event.preventDefault();
          clearPortalFilters();
          return;
        }
        event.preventDefault();
        openOpeningsWindow();
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
      const k = event.key.toLowerCase();
      if (k === "j") {
        event.preventDefault();
        openPortalsHome();
        return;
      }
      if (k === "g" || event.code === "KeyG") {
        event.preventDefault();
        openOpeningsWindow();
        return;
      }
      if (k === "c") {
        event.preventDefault();
        openCompaniesWindow();
        return;
      }
      if (k === "p") {
        event.preventDefault();
        openProfileWindow();
        return;
      }
      if (k === "h") {
        event.preventDefault();
        location.assign("/help.html");
        return;
      }
      if (k === "a") {
        event.preventDefault();
        location.assign("/advice.html");
      }
    });
  }

  function wireModal() {
    const dialog = document.getElementById("portal-modal");
    const closeBtn = document.getElementById("portal-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal());
    if (dialog) {
      dialog.addEventListener("close", () => {
        openPortalId = "";
        renderResults();
      });
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeModal();
      });
    }
  }

  async function init() {
    initKeyboard();
    wireModal();
    window.addEventListener("beforeunload", () => {
      flushSaveKeepalive();
    });
    document
      .getElementById("open-profile-btn")
      ?.addEventListener("click", () => openProfileWindow());
    document
      .getElementById("open-companies-btn")
      ?.addEventListener("click", () => openCompaniesWindow());
    document
      .getElementById("open-openings-btn")
      ?.addEventListener("click", () => openOpeningsWindow());
    document
      .getElementById("open-help-btn")
      ?.addEventListener("click", () => location.assign("/help.html"));
    document
      .getElementById("open-advice-btn")
      ?.addEventListener("click", () => location.assign("/advice.html"));
    document
      .getElementById("portal-add-btn")
      ?.addEventListener("click", () => addPortal());

    const search = document.getElementById("portal-search-input");
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

    try {
      await loadState();
      render();
      setDirty(false);
      setSaveStatus("");
    } catch (err) {
      const count = document.getElementById("portal-result-count");
      if (count) {
        count.textContent = "Load error: " + (err.message || String(err));
      }
      setSaveStatus("Load error: " + (err.message || String(err)), "err");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
