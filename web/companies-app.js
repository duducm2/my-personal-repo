(() => {
  const LANG_KEY = "career-cockpit-lang";
  const WIN_NAME_PROFILE = "career-profile";
  const WIN_NAME_COMPANIES = "career-companies-search";

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

  let collections = {};
  let companies = [];
  let dirty = false;
  let saving = false;
  let query = "";
  let categoryFilter = "";
  let roleFilter = "";
  let expandedId = "";

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
    document.documentElement.lang = mode === "en" ? "en" : "pt-BR";
    render();
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

  function openProfileWindow() {
    const w = window.open("/", "career-profile");
    if (w) w.focus();
    return w;
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
      row.website,
      row.skills_match_en,
      row.skills_match_pt,
      row.fit_why_en,
      row.fit_why_pt,
      row.notes_en,
      row.notes_pt,
      row.id,
    ]
      .map(cell)
      .join("\n")
      .toLowerCase();
  }

  function filteredRows() {
    let rows = companies.slice();
    if (categoryFilter) {
      rows = rows.filter((r) => cell(r.category_en).trim() === categoryFilter);
    }
    rows = rows.filter(matchesRole);
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
    const en = document.createElement("span");
    en.className = "filter-chip-en";
    en.textContent = chip.en;
    const pt = document.createElement("span");
    pt.className = "filter-chip-pt";
    pt.textContent = chip.pt;
    btn.append(en, pt);
    btn.addEventListener("click", () => onSelect(chip.key));
    return btn;
  }

  function renderFilters() {
    const root = document.getElementById("companies-filters");
    if (!root) return;
    root.replaceChildren();

    const catRow = document.createElement("div");
    catRow.className = "company-filter-row";
    const catLabel = document.createElement("span");
    catLabel.className = "company-filter-label";
    const ce = document.createElement("span");
    ce.className = "filter-chip-en";
    ce.textContent = "Category";
    const cp = document.createElement("span");
    cp.className = "filter-chip-pt";
    cp.textContent = "Categoria";
    catLabel.append(ce, cp);
    catRow.append(catLabel);
    const catChips = [{ key: "", en: "All", pt: "Todas" }].concat(
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
    const re = document.createElement("span");
    re.className = "filter-chip-en";
    re.textContent = "Career path";
    const rp = document.createElement("span");
    rp.className = "filter-chip-pt";
    rp.textContent = "Trilha";
    roleLabel.append(re, rp);
    roleRow.append(roleLabel);
    const roleChips = [
      { key: "", en: "All paths", pt: "Todas as trilhas" },
      { key: "da", en: "Data Analyst", pt: "Data Analyst" },
      { key: "po", en: "Product Owner", pt: "Product Owner" },
      {
        key: "dsa",
        en: "Digital Solution Architect",
        pt: "Digital Solution Architect",
      },
      { key: "multi", en: "Multi-role", pt: "Multi-trilha" },
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
  }

  function pick(row, enKey, ptKey) {
    const mode = getLangMode();
    if (mode === "pt") return cell(row[ptKey]) || cell(row[enKey]);
    if (mode === "en") return cell(row[enKey]) || cell(row[ptKey]);
    return { en: cell(row[enKey]), pt: cell(row[ptKey]) || cell(row[enKey]) };
  }

  function appendBilingual(parent, enText, ptText, className) {
    const wrap = document.createElement("div");
    wrap.className = className || "";
    const en = document.createElement("span");
    en.className = "panel-heading-en";
    en.textContent = enText || "";
    const pt = document.createElement("span");
    pt.className = "panel-heading-pt";
    pt.textContent = ptText || enText || "";
    wrap.append(en, pt);
    parent.append(wrap);
  }

  function renderResultCard(row) {
    const article = document.createElement("article");
    article.className =
      "company-result" + (expandedId === row.id ? " is-open" : "");
    article.dataset.id = row.id;

    const head = document.createElement("button");
    head.type = "button";
    head.className = "company-result-head";
    head.addEventListener("click", () => {
      expandedId = expandedId === row.id ? "" : row.id;
      renderResults();
    });

    const title = document.createElement("div");
    title.className = "company-result-title";
    appendBilingual(
      title,
      cell(row.name_en) || row.id,
      cell(row.name_pt) || cell(row.name_en) || row.id,
    );

    const meta = document.createElement("div");
    meta.className = "company-result-meta";
    const city = pick(row, "city_en", "city_pt");
    const cat = pick(row, "category_en", "category_pt");
    if (typeof city === "string") {
      meta.textContent = [city, cat, row.priority, row.status]
        .filter(Boolean)
        .join(" · ");
    } else {
      appendBilingual(
        meta,
        [city.en, cat.en, row.priority, row.status].filter(Boolean).join(" · "),
        [city.pt, cat.pt, row.priority, row.status].filter(Boolean).join(" · "),
      );
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
    if (roleCount(row) >= 2) {
      const multi = document.createElement("span");
      multi.className = "role-badge role-badge-multi is-on";
      multi.textContent = `Multi (${roleCount(row)})`;
      badges.append(multi);
    }

    head.append(title, meta, badges);
    article.append(head);

    if (expandedId === row.id) {
      const body = document.createElement("div");
      body.className = "company-result-body";

      const skillsRaw =
        getLangMode() === "pt"
          ? cell(row.skills_match_pt) || cell(row.skills_match_en)
          : cell(row.skills_match_en) || cell(row.skills_match_pt);
      const skills = skillsRaw
        .split(/[;|,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (skills.length) {
        const skillsBlock = document.createElement("div");
        skillsBlock.className = "company-skills";
        const lab = document.createElement("div");
        lab.className = "company-research-label";
        appendBilingual(lab, "Matching skills", "Competências alinhadas");
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

      const why =
        getLangMode() === "pt"
          ? cell(row.fit_why_pt) || cell(row.fit_why_en)
          : cell(row.fit_why_en) || cell(row.fit_why_pt);
      if (why) {
        const whyBlock = document.createElement("div");
        whyBlock.className = "company-fit-why";
        const lab = document.createElement("div");
        lab.className = "company-research-label";
        appendBilingual(lab, "Why this path fits", "Por que a trilha encaixa");
        const p = document.createElement("p");
        p.className = "company-fit-why-text";
        p.textContent = why;
        whyBlock.append(lab, p);
        body.append(whyBlock);
      }

      if (row.website) {
        const link = document.createElement("a");
        link.className = "company-result-link";
        link.href = row.website;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = row.website;
        body.append(link);
      }

      const editRow = document.createElement("div");
      editRow.className = "company-result-edit";
      for (const field of [
        { key: "status", labelEn: "Status", labelPt: "Status" },
        { key: "priority", labelEn: "Priority", labelPt: "Prioridade" },
      ]) {
        const label = document.createElement("label");
        label.className = "company-edit-field";
        const lab = document.createElement("span");
        appendBilingual(lab, field.labelEn, field.labelPt);
        const input = document.createElement("input");
        input.className = "field-input";
        input.value = cell(row[field.key]);
        input.addEventListener("input", () => {
          row[field.key] = input.value;
          setDirty(true);
          setSaveStatus("");
        });
        label.append(lab, input);
        editRow.append(label);
      }
      body.append(editRow);

      const noteLabel = document.createElement("label");
      noteLabel.className = "company-edit-field company-edit-notes";
      const nl = document.createElement("span");
      appendBilingual(nl, "Search notes", "Notas de busca");
      const ta = document.createElement("textarea");
      ta.className = "field-input tall";
      ta.rows = 3;
      ta.value =
        getLangMode() === "pt"
          ? cell(row.notes_pt) || cell(row.notes_en)
          : cell(row.notes_en);
      ta.addEventListener("input", () => {
        if (getLangMode() === "pt") row.notes_pt = ta.value;
        else row.notes_en = ta.value;
        setDirty(true);
        setSaveStatus("");
      });
      noteLabel.append(nl, ta);
      body.append(noteLabel);

      article.append(body);
    }

    return article;
  }

  function renderResults() {
    const root = document.getElementById("companies-results");
    const countEl = document.getElementById("company-result-count");
    if (!root) return;
    root.replaceChildren();
    const rows = filteredRows();
    if (countEl) {
      const en = `${rows.length} result${rows.length === 1 ? "" : "s"}`;
      const pt = `${rows.length} resultado${rows.length === 1 ? "" : "s"}`;
      countEl.replaceChildren();
      appendBilingual(countEl, en, pt);
    }
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent =
        getLangMode() === "en"
          ? "No companies match this search."
          : "Nenhuma empresa corresponde a esta busca.";
      root.append(empty);
      return;
    }
    for (const row of rows) root.append(renderResultCard(row));
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
      category_en: "",
      category_pt: "",
      name_en: "",
      name_pt: "",
      city_en: "",
      city_pt: "",
      region_en: "",
      region_pt: "",
      priority: "medium",
      status: "researching",
      fit_data_analyst: "yes",
      fit_product_owner: "no",
      fit_digital_solution_architect: "no",
      website: "",
      skills_match_en: "",
      skills_match_pt: "",
      fit_why_en: "",
      fit_why_pt: "",
      notes_en: "",
      notes_pt: "",
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
    if (saving || !dirty) return;
    saving = true;
    setDirty(true);
    const btn = document.getElementById("save-btn");
    if (btn) btn.disabled = true;
    setSaveStatus(getLangMode() === "en" ? "Saving…" : "Salvando…");
    try {
      collections.companies = companies;
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
      setSaveStatus(getLangMode() === "en" ? "Saved." : "Salvo.", "ok");
    } catch (err) {
      setSaveStatus(
        (getLangMode() === "en" ? "Error: " : "Erro: ") +
          (err.message || String(err)),
        "err",
      );
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
        openProfileWindow();
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

  async function init() {
    try {
      window.name = WIN_NAME_COMPANIES;
    } catch {
      /* ignore */
    }
    initLangMode();
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) saveBtn.addEventListener("click", () => saveAll());
    const profileBtn = document.getElementById("open-profile-btn");
    if (profileBtn) {
      profileBtn.addEventListener("click", () => openProfileWindow());
    }
    const search = document.getElementById("company-search-input");
    if (search) {
      search.addEventListener("input", () => {
        query = search.value;
        renderResults();
      });
      search.focus();
    }
    const addBtn = document.getElementById("company-add-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const row = blankCompany();
        companies.push(row);
        expandedId = row.id;
        categoryFilter = "";
        roleFilter = "";
        query = "";
        if (search) search.value = "";
        setDirty(true);
        render();
      });
    }
    initKeyboard();
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
      setSaveStatus(
        (getLangMode() === "en" ? "Load error: " : "Erro ao carregar: ") +
          (err.message || String(err)),
        "err",
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
