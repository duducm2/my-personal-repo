(() => {
  const LANG_KEY = "career-cockpit-lang";

  const STATUS_OPTIONS = [
    "watching",
    "applied",
    "interviewing",
    "offer",
    "paused",
    "closed",
    "rejected",
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

  function cell(v) {
    return v == null ? "" : String(v);
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

  function renderTile(row) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "company-tile job-tile" +
      tileSpanClass(row) +
      (openJobId === row.id ? " is-active" : "");
    btn.dataset.id = row.id;
    btn.addEventListener("click", () => openModal(row.id));

    const title = document.createElement("div");
    title.className = "company-tile-title";
    title.textContent = cell(row.role_title) || "(untitled role)";

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
      btn.append(title, meta, chips, next);
    } else {
      btn.append(title, meta, chips);
    }
    return btn;
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

  function renderLinks() {
    const root = document.getElementById("job-links-root");
    if (!root) return;
    root.replaceChildren();

    const byCompany = new Map();
    for (const p of platforms) {
      const key = cell(p.company_key) || "other";
      if (!byCompany.has(key)) byCompany.set(key, []);
      byCompany.get(key).push(p);
    }

    for (const [key, list] of [...byCompany.entries()].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      const card = document.createElement("article");
      card.className = "job-link-card";
      const h = document.createElement("h3");
      h.textContent = key;
      card.append(h);
      const ul = document.createElement("ul");
      for (const p of list) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = cell(p.url);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = cell(p.label) || cell(p.url);
        li.append(a);
        ul.append(li);
      }
      card.append(ul);
      root.append(card);
    }

    if (communities.length) {
      const card = document.createElement("article");
      card.className = "job-link-card";
      const h = document.createElement("h3");
      h.textContent = "Communities";
      card.append(h);
      const ul = document.createElement("ul");
      for (const c of communities) {
        const li = document.createElement("li");
        if (cell(c.url)) {
          const a = document.createElement("a");
          a.href = cell(c.url);
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = cell(c.name);
          li.append(a);
        } else {
          li.textContent = cell(c.name);
        }
        ul.append(li);
      }
      card.append(ul);
      root.append(card);
    }
  }

  function render() {
    renderFilters();
    renderResults();
    renderLinks();
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

    grid.append(fieldBlock("Company", textInput(row, "company")));
    grid.append(fieldBlock("Role title", textInput(row, "role_title")));
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
    grid.append(fieldBlock("Location", textInput(row, "location")));
    grid.append(
      fieldBlock("Source", selectInput(row, "source", SOURCE_OPTIONS)),
    );
    grid.append(
      fieldBlock("Found on", textInput(row, "found_on", { type: "date" })),
    );
    grid.append(
      fieldBlock("Applied on", textInput(row, "applied_on", { type: "date" })),
    );
    grid.append(fieldBlock("Next action", textInput(row, "next_action")));
    grid.append(
      fieldBlock(
        "Next action date",
        textInput(row, "next_action_date", { type: "date" }),
      ),
    );
    grid.append(fieldBlock("Salary range", textInput(row, "salary_range")));
    grid.append(
      fieldBlock(
        "Interest (1–5)",
        textInput(row, "fit_interest", { type: "number" }),
      ),
    );
    grid.append(fieldBlock("Contact person", textInput(row, "contact_person")));
    grid.append(fieldBlock("Contact note", textInput(row, "contact_note")));
    body.append(grid);

    if (cell(row.job_url)) {
      const link = document.createElement("a");
      link.className = "company-result-link";
      link.href = cell(row.job_url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open posting →";
      body.append(link);
    }
    body.append(fieldBlock("Job URL", textInput(row, "job_url")));
    body.append(
      fieldBlock(
        "Skills gap / blockers",
        textInput(row, "skills_gap", { tall: true, rows: 3 }),
      ),
    );
    body.append(
      fieldBlock(
        "Job description",
        textInput(row, "job_description", { tall: true, rows: 8 }),
      ),
    );
    body.append(
      fieldBlock("Notes", textInput(row, "notes", { tall: true, rows: 4 })),
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
    del.addEventListener("click", () => {
      if (!confirm("Delete this job opening?")) return;
      const idx = openings.findIndex((r) => r.id === row.id);
      if (idx < 0) return;
      openings.splice(idx, 1);
      setDirty(true);
      setSaveStatus("");
      closeModal();
      render();
    });
    actions.append(del);
    body.append(actions);
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
    };
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
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        saveAll();
        return;
      }
      if (event.key === "Escape") {
        const dialog = document.getElementById("job-modal");
        if (dialog && dialog.open) {
          closeModal();
          return;
        }
        event.preventDefault();
        location.assign("/");
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
        location.assign("/");
        return;
      }
      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        location.assign("/jobs.html");
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
  }

  async function init() {
    initLangMode();
    wireModal();
    initKeyboard();

    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) saveBtn.addEventListener("click", () => saveAll());

    document
      .getElementById("open-portals-btn")
      ?.addEventListener("click", () => location.assign("/"));
    document
      .getElementById("open-profile-btn")
      ?.addEventListener("click", () => location.assign("/profile.html"));
    document
      .getElementById("open-companies-btn")
      ?.addEventListener("click", () => location.assign("/companies.html"));

    const search = document.getElementById("job-search-input");
    if (search) {
      search.addEventListener("input", () => {
        query = search.value;
        renderResults();
      });
    }

    document.getElementById("job-add-btn")?.addEventListener("click", () => {
      const row = blankOpening();
      openings.unshift(row);
      setDirty(true);
      setSaveStatus("");
      statusFilter = "";
      pathFilter = "";
      priorityFilter = "";
      render();
      openModal(row.id);
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

  init();
})();
