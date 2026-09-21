(() => {
  const FIT_PATHS = [
    {
      key: "da",
      short: "DA",
      label: "Data Analyst",
      field: "fit_data_analyst",
    },
    {
      key: "po",
      short: "PO",
      label: "Product Owner",
      field: "fit_product_owner",
    },
    {
      key: "dsa",
      short: "DSA",
      label: "Digital Solution Architect",
      field: "fit_digital_solution_architect",
    },
  ];

  let portals = [];
  let companies = [];
  let query = "";
  let scopeFilter = "";
  let pathFilter = "";

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

  function openPortalsHome() {
    location.assign("/");
  }

  function openProfileWindow() {
    location.assign("/profile.html");
  }

  function openCompaniesWindow() {
    location.assign("/companies.html");
  }

  function openOpeningsWindow() {
    location.assign("/jobs.html");
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

  function hideSearchBar() {
    const bar = searchBarEl();
    if (!bar) return;
    bar.classList.remove("is-open");
    bar.setAttribute("aria-hidden", "true");
    const inp = searchInputEl();
    if (inp && document.activeElement === inp) inp.blur();
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
      const inp = searchInputEl();
      if (inp && document.activeElement === inp && !(inp.value || "").trim()) {
        hideSearchBar();
        return;
      }
      focusSearch();
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

  function matchesQuery(haystack) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return haystack.toLowerCase().includes(q);
  }

  function filteredPortals() {
    return portals
      .slice()
      .sort(
        (a, b) =>
          Number(cell(a.sort_order) || 0) - Number(cell(b.sort_order) || 0),
      )
      .filter((row) => {
        const scope = cell(row.scope).toLowerCase();
        if (scopeFilter && scope !== scopeFilter) return false;
        const paths = parseFitPaths(row.fit_paths);
        if (pathFilter && !paths.includes(pathFilter)) return false;
        const hay = [
          row.name,
          row.notes,
          row.ats_name,
          row.system_kind,
          row.scope,
          row.fit_paths,
        ]
          .map(cell)
          .join(" ");
        return matchesQuery(hay);
      });
  }

  function filteredCompanies() {
    return companies
      .slice()
      .sort(
        (a, b) =>
          Number(cell(a.sort_order) || 0) - Number(cell(b.sort_order) || 0),
      )
      .filter((row) => {
        if (pathFilter) {
          const fit = FIT_PATHS.find((f) => f.key === pathFilter);
          if (!fit || !isFitYes(row[fit.field])) return false;
        }
        if (scopeFilter === "brazil") {
          const region = (
            cell(row.region_en) +
            " " +
            cell(row.category_en)
          ).toLowerCase();
          const isIntl =
            region.includes("united states") ||
            region.includes("germany") ||
            region.includes("china") ||
            region.includes("sweden") ||
            region.includes("netherlands") ||
            region.includes("australia") ||
            region.includes("remote-first") ||
            region.includes("global enterprise");
          if (isIntl && !region.includes("brazil")) return false;
        }
        if (scopeFilter === "international") {
          const region = (
            cell(row.region_en) +
            " " +
            cell(row.category_en)
          ).toLowerCase();
          const isLocal =
            region.includes("campinas") ||
            (region.includes("brazil") && !region.includes("global"));
          if (
            isLocal &&
            !region.includes("united states") &&
            !region.includes("germany") &&
            !region.includes("china") &&
            !region.includes("sweden") &&
            !region.includes("netherlands") &&
            !region.includes("australia") &&
            !region.includes("remote")
          ) {
            return false;
          }
        }
        const hay = [
          row.name_en,
          row.name_pt,
          row.city_en,
          row.region_en,
          row.category_en,
          row.careers_url,
          row.website,
          row.ats_name,
          row.ats_kind,
          row.notes_en,
        ]
          .map(cell)
          .join(" ");
        return matchesQuery(hay);
      });
  }

  function appendPathChips(parent, pathsOrFits, mode) {
    const wrap = document.createElement("div");
    wrap.className = "role-badges";
    for (const fit of FIT_PATHS) {
      let on = false;
      if (mode === "paths") {
        on = pathsOrFits.includes(fit.key);
      } else {
        on = isFitYes(pathsOrFits[fit.field]);
      }
      const badge = document.createElement("span");
      badge.className = "role-badge" + (on ? " is-on" : " is-off");
      badge.textContent = fit.short;
      badge.title = fit.label;
      wrap.append(badge);
    }
    parent.append(wrap);
  }

  function renderPortalCard(row) {
    const url = cell(row.job_search_url);
    const card = document.createElement(url ? "a" : "div");
    card.className = "company-tile portal-card";
    if (url) {
      card.href = url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    const title = document.createElement("div");
    title.className = "company-tile-title";
    title.textContent = cell(row.name) || row.id;

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
    const tag = systemTag(row.system_kind, row.ats_name);
    const tagEl = document.createElement("span");
    tagEl.className = tag.className;
    tagEl.textContent = tag.label;
    chips.append(tagEl);

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

    card.append(title, meta, chips);
    appendPathChips(card, parseFitPaths(row.fit_paths), "paths");
    return card;
  }

  function renderCompanyCard(row) {
    const careers = cell(row.careers_url) || cell(row.website);
    const card = document.createElement(careers ? "a" : "div");
    card.className = "company-tile portal-card";
    if (careers) {
      card.href = careers;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    const title = document.createElement("div");
    title.className = "company-tile-title";
    title.textContent = cell(row.name_en) || cell(row.name_pt) || row.id;

    const meta = document.createElement("div");
    meta.className = "company-tile-meta";
    meta.textContent = [cell(row.city_en), cell(row.category_en)]
      .filter(Boolean)
      .join(" · ");

    const chips = document.createElement("div");
    chips.className = "company-tile-chips";
    const tag = systemTag(row.ats_kind, row.ats_name);
    const tagEl = document.createElement("span");
    tagEl.className = tag.className;
    tagEl.textContent = tag.label;
    chips.append(tagEl);

    if (cell(row.priority)) {
      const p = document.createElement("span");
      p.className = "company-chip company-chip-priority";
      p.textContent = row.priority;
      chips.append(p);
    }

    if (
      cell(row.ats_url) &&
      cell(row.ats_kind).toLowerCase() === "third_party"
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

    if (!cell(row.careers_url) && cell(row.website)) {
      const fb = document.createElement("span");
      fb.className = "company-chip";
      fb.textContent = "website fallback";
      chips.append(fb);
    }

    card.append(title, meta, chips);
    appendPathChips(card, row, "fits");
    return card;
  }

  function renderResults() {
    const portalRoot = document.getElementById("portals-results");
    const companyRoot = document.getElementById("company-careers-results");
    const portalCount = document.getElementById("portal-result-count");
    const companyCount = document.getElementById("company-careers-count");
    if (!portalRoot || !companyRoot) return;

    const portalRows = filteredPortals();
    const companyRows = filteredCompanies();

    portalRoot.replaceChildren();
    if (!portalRows.length) {
      const empty = document.createElement("p");
      empty.className = "company-bento-empty muted";
      empty.textContent = "No market portals match these filters.";
      portalRoot.append(empty);
    } else {
      for (const row of portalRows) portalRoot.append(renderPortalCard(row));
    }

    companyRoot.replaceChildren();
    if (!companyRows.length) {
      const empty = document.createElement("p");
      empty.className = "company-bento-empty muted";
      empty.textContent = "No target companies match these filters.";
      companyRoot.append(empty);
    } else {
      for (const row of companyRows) companyRoot.append(renderCompanyCard(row));
    }

    if (portalCount) {
      portalCount.textContent = `${portalRows.length} market portal${
        portalRows.length === 1 ? "" : "s"
      }`;
    }
    if (companyCount) {
      companyCount.textContent = `${companyRows.length} company career link${
        companyRows.length === 1 ? "" : "s"
      }`;
    }
  }

  function render() {
    renderFilters();
    renderResults();
  }

  function initKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        const isS =
          event.code === "KeyS" || (event.key || "").toLowerCase() === "s";
        if (isS) {
          event.preventDefault();
          event.stopPropagation();
          toggleSearchBar();
          return;
        }
      }
      if (event.key === "Escape") {
        if (isSearchBarOpen()) {
          event.preventDefault();
          dismissSearchBar();
          return;
        }
        event.preventDefault();
        openPortalsHome();
        return;
      }
      if (
        !event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isTypingTarget(document.activeElement)
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
      }
    });
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

  async function loadState() {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error(`GET /api/state failed (${res.status})`);
    const payload = await res.json();
    const collections = payload.collections || {};
    portals = Array.isArray(collections.jobPortals)
      ? collections.jobPortals.map((row) => ({ ...row }))
      : [];
    companies = Array.isArray(collections.companies)
      ? collections.companies.map((row) => ({ ...row }))
      : [];
  }

  async function init() {
    initKeyboard();
    document
      .getElementById("open-profile-btn")
      ?.addEventListener("click", () => openProfileWindow());
    document
      .getElementById("open-companies-btn")
      ?.addEventListener("click", () => openCompaniesWindow());
    document
      .getElementById("open-openings-btn")
      ?.addEventListener("click", () => openOpeningsWindow());

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
    } catch (err) {
      const count = document.getElementById("portal-result-count");
      if (count) {
        count.textContent = "Load error: " + (err.message || String(err));
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
