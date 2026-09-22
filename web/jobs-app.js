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
    "general",
    "data-analyst",
    "product-owner",
    "digital-solution-architect",
  ];
  const OPENING_FIELDS = [
    "id",
    "sort_order",
    "company",
    "company_key",
    "role_title",
    "career_path",
    "job_url",
    "status",
    "priority",
    "work_mode",
    "location",
    "source",
    "found_on",
    "applied_on",
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
  ];
  const PATH_TO_VARIANT = {
    da: "data-analyst",
    po: "product-owner",
    dsa: "digital-solution-architect",
    other: "general",
  };

  let collections = {};
  let openings = [];
  let platforms = [];
  let communities = [];
  let dirty = false;
  let saving = false;
  let query = "";
  let statusFilter = "";
  let pathFilter = "";
  let priorityFilter = "";
  let openJobId = "";
  let bulkMode = false;
  let selectedIds = new Set();
  let promptContextCache = null;

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

  function clearJobFilters() {
    statusFilter = "";
    pathFilter = "";
    priorityFilter = "";
    query = "";
    const search = searchInputEl();
    if (search) search.value = "";
    hideSearchBar();
    render();
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

  function pathLabel(key) {
    return PATH_OPTIONS.find((p) => p.key === key)?.label || key || "Other";
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
    btn.textContent = chip.label;
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

  function renderTile(row) {
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
    btn.className = "company-tile job-tile";
    btn.addEventListener("click", () => {
      if (bulkMode) {
        if (selectedIds.has(row.id)) selectedIds.delete(row.id);
        else selectedIds.add(row.id);
        updateBulkBar();
        renderResults();
        return;
      }
      openModal(row.id);
    });

    const title = document.createElement("div");
    title.className = "company-tile-title";
    title.textContent = cell(row.role_title) || "(untitled role)";

    if (isNewOpening(row)) {
      const badge = document.createElement("span");
      badge.className = "job-new-badge";
      const companyLabel =
        cell(row.company) || cell(row.company_key) || "import";
      badge.textContent = `New for ${companyLabel}`;
      title.prepend(badge);
    }

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
    meta.className = "company-tile-meta";
    meta.textContent = [cell(row.company), cell(row.location)]
      .filter(Boolean)
      .join(" · ");

    const chips = document.createElement("div");
    chips.className = "company-tile-chips";
    for (const [val, cls] of [
      [row.status, "company-chip"],
      [row.priority, "company-chip company-chip-priority"],
      [row.work_mode, "company-chip"],
      [pathLabel(row.career_path), "company-chip"],
      [
        cell(row.match_score) ? `match ${cell(row.match_score)}` : "",
        "company-chip company-chip-match",
      ],
    ]) {
      if (!cell(val)) continue;
      const c = document.createElement("span");
      c.className = cls;
      c.textContent = val;
      chips.append(c);
    }

    if (cell(row.next_action)) {
      const next = document.createElement("div");
      next.className = "job-tile-next";
      next.textContent =
        "Next: " +
        cell(row.next_action) +
        (cell(row.next_action_date) ? ` · ${cell(row.next_action_date)}` : "");
      btn.append(meta, chips, next);
    } else {
      btn.append(meta, chips);
    }
    wrap.append(btn);
    return wrap;
  }

  function isNewOpening(row) {
    const v = cell(row.is_new).toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "y";
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
    for (const row of rows) root.append(renderTile(row));
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
      setDirty(true);
      setSaveStatus("");
      if (
        ["role_title", "company", "status", "priority", "next_action"].includes(
          key,
        )
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

    const grid = document.createElement("div");
    grid.className = "company-result-edit job-modal-grid";

    grid.append(
      fieldBlock(
        "Company key",
        textInput(row, "company_key", {
          placeholder: "e.g. bosch",
        }),
      ),
    );
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
      "Job URL (paste direct posting link)",
      textInput(row, "job_url", { placeholder: "https://…" }),
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
        "Job description",
        textInput(row, "job_description", {
          tall: true,
          rows: 8,
          placeholder: "Paste JD here…",
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
    const del = document.createElement("button");
    del.type = "button";
    del.className = "panel-delete";
    del.textContent = "Delete opening";
    del.title = "Delete opening";
    del.addEventListener("click", () => deleteOpening(row.id));
    actions.append(del);
    body.append(actions);
  }

  function addOpening() {
    const row = blankOpening();
    openings.unshift(row);
    setDirty(true);
    setSaveStatus("");
    statusFilter = "";
    pathFilter = "";
    priorityFilter = "";
    query = "";
    const search = document.getElementById("job-search-input");
    if (search) search.value = "";
    hideSearchBar();
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
      company: "",
      company_key: "",
      role_title: "",
      career_path: "other",
      job_url: "",
      status: "watching",
      priority: "medium",
      work_mode: "unknown",
      location: "",
      source: "other",
      found_on: "",
      applied_on: "",
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

  function buildAiInstructions() {
    return [
      "=== AIB PROCESSING INSTRUCTIONS (mandatory) ===",
      "1. Extract every distinct job opening from the UNSTRUCTURED JOB DATA below.",
      "2. Cross-reference EXISTING OPENINGS FOR THIS COMPANY and SKIP duplicates",
      "   (same role_title + company + location, or same job_url).",
      "3. For each kept opening, set match_score (1-10) vs the PROFILE CONTEXT and",
      "   explain it briefly in match_reason.",
      "4. Set career_path to exactly one of: da | po | dsa | other.",
      "5. Set recommended_resume to exactly one of:",
      "   general | data-analyst | product-owner | digital-solution-architect.",
      '6. Set is_new to "1", status to "saved", source to "company_site" unless',
      "   another source is obvious, and fill found_on with today's date (YYYY-MM-DD).",
      "7. Return ONLY a JSON array (no markdown fences, no prose before/after).",
      "   Every object MUST include exactly these keys:",
      OPENING_FIELDS.join(", "),
      "8. Use empty strings for unknown optional fields. Do not invent job_url values;",
      "   leave job_url empty when not present in the source text.",
      "9. company_key must match the selected company id provided above.",
      "10. Prefer concise job_description (requirements + responsibilities).",
    ].join("\n");
  }

  async function buildJobPrompt(companyKey, careerPath, rawText) {
    const ctx = await fetchPromptContext();
    const companies = Array.isArray(collections.companies)
      ? collections.companies
      : [];
    const company = companies.find((c) => cell(c.id) === companyKey) || null;
    const companyName = company
      ? cell(company.name_en) || companyKey
      : companyKey;
    const variant = PATH_TO_VARIANT[careerPath] || "general";
    const profile = (ctx.profile && ctx.profile[0]) || {};
    const skills = (ctx.skills || []).filter(
      (s) => cell(s.variant) === variant || cell(s.variant) === "general",
    );
    const narratives = (ctx.narratives || []).filter(
      (n) => cell(n.variant) === variant,
    );
    const pathSlug =
      careerPath === "da"
        ? "data-analyst"
        : careerPath === "po"
          ? "product-owner"
          : careerPath === "dsa"
            ? "digital-solution-architect"
            : "";
    const titles = (ctx.targetTitles || []).filter((t) => {
      const p = cell(t.path);
      if (!pathSlug) return true;
      return p === pathSlug || p === careerPath;
    });
    const experience = (ctx.experience || []).slice(0, 6);
    const existing = existingOpeningsForCompany(companyKey);

    const lines = [];
    lines.push("You are my AI companion (AIB) for job-opening extraction.");
    lines.push("");
    lines.push("=== PROFILE CONTEXT ===");
    lines.push(
      `Name: ${cell(profile.display_name) || cell(profile.full_name)}`,
    );
    lines.push(`Location: ${cell(profile.location_en)}`);
    lines.push(`Languages: ${cell(profile.languages_en)}`);
    lines.push(`Email: ${cell(profile.email)}`);
    lines.push(`LinkedIn: ${cell(profile.linkedin_url)}`);
    lines.push(`Career path focus: ${pathLabel(careerPath)} (${variant})`);
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

    lines.push("=== EXISTING OPENINGS FOR THIS COMPANY (do not re-import) ===");
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

    lines.push("=== UNSTRUCTURED JOB DATA ===");
    lines.push(rawText.trim() || "(empty)");
    lines.push("");
    lines.push(buildAiInstructions());
    return lines.join("\n");
  }

  async function handleCopyPrompt() {
    const companyKey = cell(document.getElementById("prompt-company")?.value);
    const careerPath =
      cell(document.getElementById("prompt-path")?.value) || "da";
    const rawText = cell(document.getElementById("prompt-raw")?.value);
    const status = document.getElementById("prompt-status");
    if (!companyKey) {
      if (status) {
        status.textContent = "Pick a company first.";
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
    if (status) {
      status.textContent = "Building prompt…";
      status.className = "save-status";
    }
    try {
      const prompt = await buildJobPrompt(companyKey, careerPath, rawText);
      const ok = await copyText(prompt);
      if (ok) {
        if (status) {
          status.textContent = "Prompt copied.";
          status.className = "save-status ok";
        }
        showToast("Prompt copied — paste into your AI companion", 2500);
      } else {
        // Restricted browser clipboard: select raw field with prompt for manual Ctrl+C
        const rawEl = document.getElementById("prompt-raw");
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
      }
    } catch (err) {
      if (status) {
        status.textContent = "Error: " + (err.message || String(err));
        status.className = "save-status err";
      }
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
    const companyKey = row.company_key || "company";
    if (!row.id) row.id = `job-${companyKey}-${stamp}-${index}`;
    if (!row.sort_order) row.sort_order = String(openings.length + index);
    if (!row.status) row.status = "saved";
    if (!row.priority) row.priority = "medium";
    if (!row.career_path) row.career_path = "other";
    if (!row.work_mode) row.work_mode = "unknown";
    if (!row.source) row.source = "company_site";
    row.is_new = "1";
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
      status: "saved",
      priority: "medium",
      work_mode: "hybrid",
      location: "Campinas, SP",
      source: "company_site",
      found_on: "2026-09-22",
      applied_on: "",
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
      "- Return ONLY a valid JSON array (no markdown fences, no commentary).",
      "- Every object must include exactly these keys:",
      OPENING_FIELDS.join(", "),
      "- Use empty strings for unknown optional fields.",
      '- Keep is_new as "1" and status as "saved" for new imports.',
      "",
      "EXAMPLE ROW",
      JSON.stringify(sample, null, 2),
      "",
      "DELIVERY RULES (mandatory)",
      "- Output the full corrected JSON array in one message.",
      "- Do not claim the data was saved; I will import it myself.",
    ].join("\n");
  }

  async function failImportWithAiFix(errorMsg, brokenInput) {
    const fix = buildAiFixPrompt(errorMsg, brokenInput);
    const ok = await copyText(fix);
    const status = document.getElementById("import-status");
    const rawEl = document.getElementById("import-raw");
    if (!ok && rawEl) {
      rawEl.value = fix;
      rawEl.focus();
      rawEl.select();
    }
    if (status) {
      status.textContent = ok
        ? "Import failed — AI fix copied to clipboard."
        : "Import failed — AI fix filled in the box; press Ctrl+C.";
      status.className = "save-status err";
    }
    showToast(
      ok
        ? "AI fix copied — paste into your AI companion to regenerate"
        : "AI fix ready — press Ctrl+C, then paste into your AI companion",
      5000,
    );
  }

  async function importOpenings(text) {
    const rows = parseImportPayload(text);
    const stamp = Date.now();
    const existingKeys = new Set(openings.map(openingDedupeKey));
    const existingIds = new Set(openings.map((o) => cell(o.id)));
    const imported = [];
    let skipped = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = normalizeImportedRow(rows[i], i + 1, stamp);
      while (existingIds.has(row.id)) {
        row.id = `${row.id}-${i}`;
      }
      const key = openingDedupeKey(row);
      if (existingKeys.has(key)) {
        skipped += 1;
        continue;
      }
      existingKeys.add(key);
      existingIds.add(row.id);
      imported.push(row);
    }
    if (!imported.length) {
      throw new Error(
        skipped
          ? `All ${skipped} openings were duplicates of existing rows`
          : "No openings to import",
      );
    }
    openings = [...imported, ...openings];
    collections.jobOpenings = openings;
    setDirty(true);
    setSaveStatus("");
    render();
    return { imported: imported.length, skipped };
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
      if (status) {
        status.textContent = `Imported ${result.imported} (skipped ${result.skipped} duplicates). Save to persist.`;
        status.className = "save-status ok";
      }
      showToast(`Imported ${result.imported} openings`, 2500);
      const dialog = document.getElementById("import-modal");
      if (dialog && dialog.open) dialog.close();
    } catch (err) {
      await failImportWithAiFix(err.message || String(err), raw);
    }
  }

  function openPromptModal() {
    fillPromptCompanySelect();
    const dialog = document.getElementById("prompt-modal");
    const status = document.getElementById("prompt-status");
    if (status) {
      status.textContent = "";
      status.className = "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
  }

  function closePromptModal() {
    const dialog = document.getElementById("prompt-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function openImportModal() {
    const dialog = document.getElementById("import-modal");
    const status = document.getElementById("import-status");
    if (status) {
      status.textContent = "";
      status.className = "save-status";
    }
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    }
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

  function bulkSetStatus(status) {
    if (!selectedIds.size) return;
    for (const row of openings) {
      if (selectedIds.has(row.id)) row.status = status;
    }
    setDirty(true);
    setSaveStatus("");
    render();
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
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} selected opening(s)?`)) return;
    openings = openings.filter((r) => !selectedIds.has(r.id));
    collections.jobOpenings = openings;
    selectedIds.clear();
    setDirty(true);
    setSaveStatus("");
    render();
    updateBulkBar();
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
    platforms = Array.isArray(collections.jobPlatforms)
      ? collections.jobPlatforms.map((row) => ({ ...row }))
      : [];
    communities = Array.isArray(collections.jobCommunities)
      ? collections.jobCommunities.map((row) => ({ ...row }))
      : [];
    collections.jobOpenings = openings;
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
      collections.jobOpenings = openings;
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
      const dialog = document.getElementById("job-modal");
      const modalOpen = !!(dialog && dialog.open);

      // Save / update — works while typing
      if (
        mod &&
        !event.altKey &&
        (event.key === "Enter" || (event.key || "").toLowerCase() === "s")
      ) {
        event.preventDefault();
        saveAll();
        return;
      }

      // Delete open dossier — Shift+Delete (works while typing in modal)
      if (
        modalOpen &&
        event.shiftKey &&
        !mod &&
        !event.altKey &&
        (event.key === "Delete" || event.code === "Delete")
      ) {
        event.preventDefault();
        deleteOpening(openJobId);
        return;
      }

      if (event.altKey && !mod && !event.shiftKey) {
        const isS =
          event.code === "KeyS" || (event.key || "").toLowerCase() === "s";
        if (isS) {
          event.preventDefault();
          event.stopPropagation();
          clearJobFilters();
          return;
        }
      }
      if (event.key === "Escape") {
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
        event.preventDefault();
        clearJobFilters();
        return;
      }
      if (event.altKey || mod || typing) return;

      // Add new opening
      if (
        !event.shiftKey &&
        (event.key.toLowerCase() === "n" || event.code === "KeyN")
      ) {
        event.preventDefault();
        addOpening();
        return;
      }

      if (!event.shiftKey) return;

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
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        addOpening();
        return;
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        location.assign("/profile.html");
        return;
      }
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        location.assign("/companies.html");
        return;
      }
      if (event.key.toLowerCase() === "j") {
        event.preventDefault();
        location.assign("/portals.html");
        return;
      }
      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        location.assign("/");
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
      .getElementById("prompt-copy-btn")
      ?.addEventListener("click", () => handleCopyPrompt());

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
  }

  async function init() {
    initLangMode();
    wireModal();
    initKeyboard();

    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) saveBtn.addEventListener("click", () => saveAll());

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
      .getElementById("job-bulk-btn")
      ?.addEventListener("click", () => setBulkMode(!bulkMode));

    document
      .getElementById("job-bulk-select-all")
      ?.addEventListener("click", () => bulkSelectAllVisible());
    document
      .getElementById("job-bulk-deselect")
      ?.addEventListener("click", () => bulkDeselectAll());
    document
      .getElementById("job-bulk-saved")
      ?.addEventListener("click", () => bulkSetStatus("saved"));
    document
      .getElementById("job-bulk-watching")
      ?.addEventListener("click", () => bulkSetStatus("watching"));
    document
      .getElementById("job-bulk-excluded")
      ?.addEventListener("click", () => bulkSetStatus("excluded"));
    document
      .getElementById("job-bulk-clear-new")
      ?.addEventListener("click", () => bulkClearNew());
    document
      .getElementById("job-bulk-delete")
      ?.addEventListener("click", () => bulkDeleteSelected());

    try {
      await loadState();
      render();
      setDirty(false);
      setSaveStatus("");
      updateBulkBar();
    } catch (err) {
      setSaveStatus("Load error: " + (err.message || String(err)), "err");
    }
  }

  init();
})();
