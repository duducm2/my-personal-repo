(() => {
  const FIT_PATHS = [
    { key: "da", short: "DA", label: "Data Analyst" },
    { key: "po", short: "PO", label: "Product Owner" },
    { key: "dsa", short: "DSA", label: "Digital Solution Architect" },
  ];

  const SCOPE_OPTIONS = ["brazil", "international"];
  const SYSTEM_KIND_OPTIONS = ["proprietary", "third_party", "unknown"];

  let collections = {};
  let portals = [];
  let platforms = [];
  let communities = [];
  let dirty = false;
  let saving = false;
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
    dirty = next;
    const btn = document.getElementById("save-btn");
    if (btn) btn.disabled = !dirty || saving;
    document.body.classList.toggle("is-dirty", dirty);
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
      fit_paths: "da;po;dsa",
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
      fit_paths: "da;po;dsa",
    }));
    return [...watch, ...comm];
  }

  function matchesQuery(haystack) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return haystack.toLowerCase().includes(q);
  }

  function filteredPortals() {
    const market = portals.map((row) => ({ ...row, card_kind: "portal" }));
    const extra = watchAndCommunityCards();
    return [...market, ...extra]
      .slice()
      .sort((a, b) => {
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

  function openCardUrl(row) {
    const url = cell(row.job_search_url);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function moveCardFocus(delta) {
    return !!window.CardNav?.moveInContext(CARD_SEL, FILTER_SEL, delta);
  }

  function focusedPortalCard() {
    const el = document.activeElement;
    if (!el || !el.classList.contains("company-tile")) return null;
    const root = document.getElementById("portals-results");
    if (!root || !root.contains(el)) return null;
    return el;
  }

  function openFocusedPortal() {
    const card = focusedPortalCard();
    if (!card) return false;
    const url = cell(card.dataset.url);
    if (!url) return false;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  function renderPortalCard(row) {
    const isLinkCard =
      row.card_kind === "watch" || row.card_kind === "community";
    const card = document.createElement("button");
    card.type = "button";
    card.className =
      "company-tile portal-card" +
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
        ? "Click / Ctrl+Enter to open"
        : "Click to edit · Ctrl/Cmd+click or Ctrl+Enter to open";
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

    const editGrid = document.createElement("div");
    editGrid.className = "company-result-edit";

    const idLabel = document.createElement("label");
    idLabel.className = "company-edit-field";
    idLabel.append(fieldLabel("ID"));
    const idInput = document.createElement("input");
    idInput.className = "field-input";
    idInput.value = cell(row.id);
    idInput.addEventListener("input", () => {
      const nextId = idInput.value.trim() || row.id;
      if (portals.some((p) => p !== row && p.id === nextId)) {
        setSaveStatus("ID already exists.", "err");
        return;
      }
      const wasOpen = openPortalId === row.id;
      row.id = nextId;
      if (wasOpen) openPortalId = nextId;
      setDirty(true);
      setSaveStatus("");
      titleEl.textContent = cell(row.name) || row.id;
      renderResults();
    });
    idLabel.append(idInput);
    editGrid.append(idLabel);

    const nameLabel = document.createElement("label");
    nameLabel.className = "company-edit-field";
    nameLabel.append(fieldLabel("Name"));
    const nameInput = document.createElement("input");
    nameInput.className = "field-input";
    nameInput.value = cell(row.name);
    bindTextField(row, "name", nameInput);
    nameLabel.append(nameInput);
    editGrid.append(nameLabel);

    const sortLabel = document.createElement("label");
    sortLabel.className = "company-edit-field";
    sortLabel.append(fieldLabel("Sort order"));
    const sortInput = document.createElement("input");
    sortInput.className = "field-input";
    sortInput.type = "number";
    sortInput.value = cell(row.sort_order);
    sortInput.addEventListener("input", () => {
      row.sort_order = sortInput.value;
      setDirty(true);
      setSaveStatus("");
      renderResults();
    });
    sortLabel.append(sortInput);
    editGrid.append(sortLabel);

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
    kindLabel.append(fieldLabel("System kind"));
    const kindSelect = document.createElement("select");
    kindSelect.className = "field-input";
    for (const opt of SYSTEM_KIND_OPTIONS) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
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
    pathsLabel.append(fieldLabel("Fit paths (da;po;dsa)"));
    const pathsInput = document.createElement("input");
    pathsInput.className = "field-input";
    pathsInput.value = cell(row.fit_paths);
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
    const del = document.createElement("button");
    del.type = "button";
    del.className = "panel-delete";
    del.textContent = "Delete portal";
    del.title = "Delete portal (Shift+Delete)";
    del.addEventListener("click", () => deletePortal(row.id));
    actions.append(del);
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
      scope: "brazil",
      name: "New portal",
      job_search_url: "",
      system_kind: "proprietary",
      ats_name: "",
      ats_url: "",
      fit_paths: "da;po;dsa",
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
    if (saving || !dirty) return;
    saving = true;
    setDirty(true);
    const btn = document.getElementById("save-btn");
    if (btn) btn.disabled = true;
    setSaveStatus("Saving…");
    try {
      collections.jobPortals = portals;
      collections.jobPlatforms = platforms;
      collections.jobCommunities = communities;
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.ok === false) {
        throw new Error(payload.error || `HTTP ${res.status}`);
      }
      setDirty(false);
      setSaveStatus("Saved.", "ok");
    } catch (err) {
      setSaveStatus("Error: " + (err.message || String(err)), "err");
      setDirty(true);
    } finally {
      saving = false;
      const saveBtn = document.getElementById("save-btn");
      if (saveBtn) saveBtn.disabled = !dirty;
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
        if (!modalOpen && openFocusedPortal()) return;
        saveAll();
        return;
      }

      if (mod && !event.altKey && (event.key || "").toLowerCase() === "s") {
        event.preventDefault();
        saveAll();
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
          window.CardNav?.toggleCardsFilters(CARD_SEL, FILTER_SEL);
          return;
        }
      }
      if (event.key === "Escape") {
        if (modalOpen) {
          closeModal();
          return;
        }
        if (isSearchBarOpen()) {
          event.preventDefault();
          dismissSearchBar();
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
        window.CardNav.jumpPrefix(CARD_SEL, event.key)
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
      if (k === "o") {
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
    document
      .getElementById("save-btn")
      ?.addEventListener("click", () => saveAll());
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

    window.addEventListener("beforeunload", (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    });

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
