(() => {
  const labels = window.CAREER_LABELS;
  const LANG_KEY = "career-cockpit-lang";
  const DETAIL_KEY = "career-cockpit-detail";
  const COLLECTION_KEYS = [
    "about",
    "targetTitles",
    "projects",
    "education",
    "experience",
    "languages",
    "recognitions",
    "courses",
    "competences",
    "volunteering",
    "certifications",
    "companies",
  ];

  /** Profile window renders these; companies live in companies.html */
  const PROFILE_RENDER_KEYS = COLLECTION_KEYS.filter((k) => k !== "companies");


  const STRUCTURAL = new Set([
    "id",
    "sort_order",
    "path",
    "csi",
    "nps",
    "endorsements",
    "linkedin_assessment",
    "credential_id",
    "credential_file",
    "associated_with",
    "priority",
    "status",
    "website",
    "fit_data_analyst",
    "fit_product_owner",
    "fit_digital_solution_architect",
  ]);

  /** Base (summary) columns — must match python/canonical_store._BASE */
  const BASE_SCHEMAS = {
    about: ["id", "sort_order", "text_en", "text_pt"],
    targetTitles: [
      "id",
      "sort_order",
      "path",
      "path_label_en",
      "path_label_pt",
      "kind_en",
      "kind_pt",
      "title_en",
      "title_pt",
      "source_en",
      "source_pt",
    ],
    projects: [
      "id",
      "name_en",
      "name_pt",
      "summary_en",
      "summary_pt",
      "csi",
      "nps",
      "notes_en",
      "notes_pt",
    ],
    education: [
      "id",
      "sort_order",
      "institution_en",
      "institution_pt",
      "degree_en",
      "degree_pt",
      "field_en",
      "field_pt",
      "date_display_en",
      "date_display_pt",
      "activities_en",
      "activities_pt",
      "description_en",
      "description_pt",
      "skills_en",
      "skills_pt",
    ],
    experience: [
      "id",
      "sort_order",
      "company_en",
      "company_pt",
      "title_en",
      "title_pt",
      "employment_type_en",
      "employment_type_pt",
      "date_display_en",
      "date_display_pt",
      "location_en",
      "location_pt",
      "work_arrangement_en",
      "work_arrangement_pt",
      "description_en",
      "description_pt",
      "skills_en",
      "skills_pt",
      "media_en",
      "media_pt",
    ],
    languages: [
      "id",
      "sort_order",
      "name_en",
      "name_pt",
      "level_en",
      "level_pt",
    ],
    recognitions: [
      "id",
      "sort_order",
      "title_en",
      "title_pt",
      "issuer_en",
      "issuer_pt",
      "date_display_en",
      "date_display_pt",
      "associated_with",
      "description_en",
      "description_pt",
    ],
    courses: [
      "id",
      "sort_order",
      "title_en",
      "title_pt",
      "associated_en",
      "associated_pt",
    ],
    competences: [
      "id",
      "sort_order",
      "category_en",
      "category_pt",
      "name_en",
      "name_pt",
      "associated_en",
      "associated_pt",
      "endorsements",
      "linkedin_assessment",
    ],
    volunteering: [
      "id",
      "sort_order",
      "title_en",
      "title_pt",
      "organization_en",
      "organization_pt",
      "date_display_en",
      "date_display_pt",
      "cause_en",
      "cause_pt",
      "description_en",
      "description_pt",
    ],
    certifications: [
      "id",
      "sort_order",
      "title_en",
      "title_pt",
      "issuer_en",
      "issuer_pt",
      "issued_en",
      "issued_pt",
      "expires_en",
      "expires_pt",
      "credential_id",
      "skills_en",
      "skills_pt",
      "credential_file",
    ],
    companies: [
      "id",
      "sort_order",
      "category_en",
      "category_pt",
      "name_en",
      "name_pt",
      "city_en",
      "city_pt",
      "region_en",
      "region_pt",
      "priority",
      "status",
      "fit_data_analyst",
      "fit_product_owner",
      "fit_digital_solution_architect",
      "website",
      "skills_match_en",
      "skills_match_pt",
      "fit_why_en",
      "fit_why_pt",
      "notes_en",
      "notes_pt",
    ],
  };

  function expandColumns(cols) {
    const out = [];
    for (const c of cols) {
      out.push(c);
      if (STRUCTURAL.has(c)) continue;
      if (c.endsWith("_en")) out.push(c.slice(0, -3) + "_detail_en");
      else if (c.endsWith("_pt")) out.push(c.slice(0, -3) + "_detail_pt");
    }
    return out;
  }

  const SCHEMAS = {};
  for (const key of Object.keys(BASE_SCHEMAS)) {
    SCHEMAS[key] = expandColumns(BASE_SCHEMAS[key]);
  }

  function detailTwin(col) {
    if (!col || STRUCTURAL.has(col)) return null;
    if (col.endsWith("_en")) return col.slice(0, -3) + "_detail_en";
    if (col.endsWith("_pt")) return col.slice(0, -3) + "_detail_pt";
    return null;
  }

  function activeCol(col) {
    if (!detailMode) return col;
    return detailTwin(col) || col;
  }

  /** Editable field rows: bilingual pairs or mono (same value both cells). */
  const FIELD_SPECS = {
    about: [{ label: "aboutText", pt: "text_pt", en: "text_en", tall: true }],
    targetTitles: [
      { label: "targetTitle", pt: "title_pt", en: "title_en", tall: true },
      { label: "careerPath", pt: "path_label_pt", en: "path_label_en" },
      { label: "careerPathId", mono: "path" },
      { label: "titleKind", pt: "kind_pt", en: "kind_en" },
      { label: "titleSource", pt: "source_pt", en: "source_en" },
    ],
    projects: [
      { label: "projectName", pt: "name_pt", en: "name_en" },
      {
        label: "projectDescription",
        pt: "summary_pt",
        en: "summary_en",
        tall: true,
      },
      { label: "projectNotes", pt: "notes_pt", en: "notes_en", tall: true },
      { label: "projectCsi", mono: "csi" },
      { label: "projectNps", mono: "nps" },
    ],
    education: [
      { label: "degree", pt: "degree_pt", en: "degree_en" },
      { label: "institution", pt: "institution_pt", en: "institution_en" },
      { label: "fieldOfStudy", pt: "field_pt", en: "field_en" },
      { label: "dateRange", pt: "date_display_pt", en: "date_display_en" },
      {
        label: "activities",
        pt: "activities_pt",
        en: "activities_en",
        tall: true,
      },
      {
        label: "educationDescription",
        pt: "description_pt",
        en: "description_en",
        tall: true,
      },
      { label: "relatedSkills", pt: "skills_pt", en: "skills_en" },
    ],
    experience: [
      { label: "jobTitle", pt: "title_pt", en: "title_en" },
      { label: "company", pt: "company_pt", en: "company_en" },
      {
        label: "employmentType",
        pt: "employment_type_pt",
        en: "employment_type_en",
      },
      { label: "dateRange", pt: "date_display_pt", en: "date_display_en" },
      { label: "location", pt: "location_pt", en: "location_en" },
      {
        label: "workArrangement",
        pt: "work_arrangement_pt",
        en: "work_arrangement_en",
      },
      {
        label: "experienceDescription",
        pt: "description_pt",
        en: "description_en",
        tall: true,
      },
      { label: "relatedSkills", pt: "skills_pt", en: "skills_en" },
      { label: "media", pt: "media_pt", en: "media_en" },
    ],
    languages: [
      { label: "language", pt: "name_pt", en: "name_en" },
      { label: "proficiency", pt: "level_pt", en: "level_en" },
    ],
    recognitions: [
      { label: "recognitionTitle", pt: "title_pt", en: "title_en" },
      { label: "issuer", pt: "issuer_pt", en: "issuer_en" },
      {
        label: "recognitionDate",
        pt: "date_display_pt",
        en: "date_display_en",
      },
      { label: "associatedWith", mono: "associated_with" },
      {
        label: "recognitionDescription",
        pt: "description_pt",
        en: "description_en",
        tall: true,
      },
    ],
    courses: [
      { label: "courseTitle", pt: "title_pt", en: "title_en" },
      { label: "associatedWith", pt: "associated_pt", en: "associated_en" },
    ],
    competences: [
      { label: "competenceName", pt: "name_pt", en: "name_en" },
      { label: "competenceCategory", pt: "category_pt", en: "category_en" },
      { label: "associatedWith", pt: "associated_pt", en: "associated_en" },
      { label: "endorsements", mono: "endorsements" },
      { label: "linkedinAssessment", mono: "linkedin_assessment" },
    ],
    volunteering: [
      { label: "volunteerTitle", pt: "title_pt", en: "title_en" },
      { label: "organization", pt: "organization_pt", en: "organization_en" },
      { label: "dateRange", pt: "date_display_pt", en: "date_display_en" },
      { label: "cause", pt: "cause_pt", en: "cause_en" },
      {
        label: "volunteerDescription",
        pt: "description_pt",
        en: "description_en",
        tall: true,
      },
    ],
    certifications: [
      { label: "certificationTitle", pt: "title_pt", en: "title_en" },
      { label: "issuer", pt: "issuer_pt", en: "issuer_en" },
      { label: "issuedOn", pt: "issued_pt", en: "issued_en" },
      { label: "expiresOn", pt: "expires_pt", en: "expires_en" },
      { label: "credentialId", mono: "credential_id" },
      { label: "relatedSkills", pt: "skills_pt", en: "skills_en" },
      { label: "credentialFile", mono: "credential_file" },
    ],
    companies: [
      { label: "companyName", pt: "name_pt", en: "name_en" },
      { label: "companyCategory", pt: "category_pt", en: "category_en" },
      { label: "companyCity", pt: "city_pt", en: "city_en" },
      { label: "companyRegion", pt: "region_pt", en: "region_en" },
      { label: "companyPriority", mono: "priority" },
      { label: "companyStatus", mono: "status" },
      { label: "fitDataAnalyst", mono: "fit_data_analyst" },
      { label: "fitProductOwner", mono: "fit_product_owner" },
      { label: "fitDigitalSolutionArchitect", mono: "fit_digital_solution_architect" },
      { label: "companyWebsite", mono: "website" },
      { label: "skillsMatch", pt: "skills_match_pt", en: "skills_match_en", tall: true },
      { label: "fitWhy", pt: "fit_why_pt", en: "fit_why_en", tall: true },
      { label: "companyNotes", pt: "notes_pt", en: "notes_en", tall: true },
    ],
  };

  const SECTION_META = {
    about: {
      root: "about-root",
      title: { en: "About", pt: "Sobre" },
      canAdd: false,
    },
    targetTitles: {
      root: "titles-root",
      titleKey: { en: "title_en", pt: "title_pt" },
      canAdd: true,
    },
    projects: {
      root: "projects-root",
      titleKey: { en: "name_en", pt: "name_pt" },
      canAdd: true,
    },
    education: {
      root: "education-root",
      titleKey: { en: "degree_en", pt: "degree_pt" },
      canAdd: true,
    },
    experience: {
      root: "experience-root",
      titleKey: { en: "title_en", pt: "title_pt" },
      canAdd: true,
    },
    languages: {
      root: "languages-root",
      titleKey: { en: "name_en", pt: "name_pt" },
      canAdd: true,
    },
    recognitions: {
      root: "recognitions-root",
      titleKey: { en: "title_en", pt: "title_pt" },
      canAdd: true,
    },
    courses: {
      root: "courses-root",
      titleKey: { en: "title_en", pt: "title_pt" },
      canAdd: true,
    },
    competences: {
      root: "competences-root",
      titleKey: { en: "name_en", pt: "name_pt" },
      canAdd: true,
    },
    volunteering: {
      root: "volunteering-root",
      titleKey: { en: "title_en", pt: "title_pt" },
      canAdd: true,
    },
    certifications: {
      root: "certifications-root",
      titleKey: { en: "title_en", pt: "title_pt" },
      canAdd: true,
    },
    companies: {
      root: "companies-root",
      titleKey: { en: "name_en", pt: "name_pt" },
      canAdd: true,
    },
  };

  let state = {};
  let dirty = false;
  let saving = false;
  let detailMode = false;
  /** Local-only filters for companies (`""` = All). */
  let companyCategoryFilter = "";
  let companyRoleFilter = "";

  const COMPANY_ROLES = [
    {
      key: "da",
      field: "fit_data_analyst",
      shortEn: "DA",
      shortPt: "DA",
      en: "Data Analyst",
      pt: "Data Analyst",
    },
    {
      key: "po",
      field: "fit_product_owner",
      shortEn: "PO",
      shortPt: "PO",
      en: "Product Owner",
      pt: "Product Owner",
    },
    {
      key: "dsa",
      field: "fit_digital_solution_architect",
      shortEn: "DSA",
      shortPt: "DSA",
      en: "Digital Solution Architect",
      pt: "Digital Solution Architect",
    },
  ];

  function isFitYes(value) {
    return ["yes", "y", "1", "true", "sim"].includes(
      String(value || "")
        .trim()
        .toLowerCase(),
    );
  }

  function companyRoleCount(row) {
    return COMPANY_ROLES.filter((role) => isFitYes(row[role.field])).length;
  }

  function companyMatchesRoleFilter(row) {
    if (!companyRoleFilter) return true;
    if (companyRoleFilter === "multi") return companyRoleCount(row) >= 2;
    const role = COMPANY_ROLES.find((r) => r.key === companyRoleFilter);
    if (!role) return true;
    return isFitYes(row[role.field]);
  }

  function plainText(text) {
    if (text == null || text === "") return "";
    return String(text)
      .replace(/\*\*/g, "")
      .replace(/→/g, "->")
      .replace(/←/g, "<-")
      .replace(/[—–−]/g, "-")
      .replace(/·/g, " - ")
      .replace(/…/g, "...")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/ {2,}/g, " ");
  }

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
    document.documentElement.lang = mode === "en" ? "en" : "pt-BR";
  }

  function updateDetailIndicator() {
    const el = document.getElementById("detail-mode-label");
    if (!el) return;
    const en = getLangMode() === "en";
    el.textContent = detailMode
      ? en
        ? "Detail"
        : "Detalhado"
      : en
        ? "Summary"
        : "Resumo";
  }

  function setDetailMode(next, rerender) {
    detailMode = !!next;
    document.body.classList.toggle("detail-mode", detailMode);
    document.body.classList.toggle("summary-mode", !detailMode);
    try {
      localStorage.setItem(DETAIL_KEY, detailMode ? "detail" : "summary");
    } catch {
      /* ignore */
    }
    updateDetailIndicator();
    if (rerender) renderAll();
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

  function blankRow(collection) {
    const row = {};
    for (const col of SCHEMAS[collection]) row[col] = "";
    row.id = `${collection}-${Date.now()}`;
    if ("sort_order" in row) {
      row.sort_order = String((state[collection] || []).length + 1);
    }
    if (collection === "companies") {
      row.priority = "medium";
      row.status = "researching";
      row.fit_data_analyst = "no";
      row.fit_product_owner = "no";
      row.fit_digital_solution_architect = "no";
      row.region_en = "Campinas metro";
      row.region_pt = "Região metropolitana de Campinas";
      row.region_detail_en = row.region_en;
      row.region_detail_pt = row.region_pt;
    }
    return row;
  }

  function copyViaTextarea(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    if (!ok) throw new Error("execCommand copy failed");
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        /* fall through */
      }
    }
    copyViaTextarea(text);
  }

  async function copyWithFeedback(text, button) {
    const original = button.dataset.label || button.textContent;
    const okLabel = getLangMode() === "en" ? "Copied" : "Copiado";
    const errLabel = getLangMode() === "en" ? "Error" : "Erro";
    try {
      await copyText(text);
      button.textContent = okLabel;
      button.classList.add("ok");
      button.classList.remove("err");
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("ok");
      }, 1200);
    } catch {
      button.textContent = errLabel;
      button.classList.add("err");
      button.classList.remove("ok");
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("err");
      }, 1500);
    }
  }

  function createCopyButton(getValue) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.dataset.label = "Copy";
    btn.textContent = "Copy";
    btn.title = "Copy to clipboard";
    btn.addEventListener("click", () => {
      const text = plainText(getValue());
      if (!text.trim()) return;
      copyWithFeedback(text, btn);
    });
    return btn;
  }

  function createEditableCell(lang, row, baseKey, tall) {
    const key = activeCol(baseKey);
    const cellEl = document.createElement("div");
    cellEl.className =
      "field-cell " + (lang === "PT" ? "field-cell-pt" : "field-cell-en");

    const wrap = document.createElement("div");
    wrap.className = "field-edit-wrap";

    const tag = document.createElement("span");
    tag.className = "lang-tag";
    tag.textContent = lang;

    const useTall = tall || detailMode;
    const input = document.createElement("textarea");
    input.className = "field-input" + (useTall ? " tall" : "");
    input.rows = useTall ? 6 : 2;
    let shown = cell(row[key]);
    if (detailMode && !shown.trim() && key !== baseKey) {
      shown = cell(row[baseKey]);
      if (shown.trim()) row[key] = shown;
    }
    input.value = shown;
    input.addEventListener("input", () => {
      row[key] = input.value;
      setDirty(true);
      setSaveStatus("");
    });

    wrap.append(tag, input);
    cellEl.append(
      wrap,
      createCopyButton(() => row[key]),
    );
    return cellEl;
  }

  function createFieldRow(label, row, spec) {
    const rowEl = document.createElement("div");
    rowEl.className = "field-row";

    const labelEl = document.createElement("div");
    labelEl.className = "field-label";
    const en = document.createElement("span");
    en.className = "field-label-en";
    en.textContent = labels[label].en;
    const pt = document.createElement("span");
    pt.className = "field-label-pt";
    pt.textContent = labels[label].pt;
    labelEl.append(en, pt);
    rowEl.append(labelEl);

    if (spec.mono) {
      const baseKey = spec.mono;
      const key = activeCol(baseKey);
      rowEl.append(
        createEditableCell("PT", row, baseKey, spec.tall),
        createEditableCell("EN", row, baseKey, spec.tall),
      );
      const inputs = rowEl.querySelectorAll(".field-input");
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          const v = input.value;
          row[key] = v;
          inputs.forEach((other) => {
            if (other !== input) other.value = v;
          });
        });
      });
    } else {
      rowEl.append(
        createEditableCell("PT", row, spec.pt, spec.tall),
        createEditableCell("EN", row, spec.en, spec.tall),
      );
    }
    return rowEl;
  }

  function panelTitle(collection, row, meta) {
    if (meta.title) return meta.title;
    const en = cell(row[meta.titleKey.en]) || cell(row.id) || "New";
    const pt = cell(row[meta.titleKey.pt]) || cell(row.id) || "Novo";
    return { en, pt };
  }

  function createPanel(collection, row, index) {
    const meta = SECTION_META[collection];
    const article = document.createElement("article");
    article.className = "panel";
    article.dataset.id = row.id;

    const head = document.createElement("div");
    head.className = "panel-head";

    const heading = document.createElement("h3");
    heading.className = "panel-heading";
    const title = panelTitle(collection, row, meta);
    const en = document.createElement("span");
    en.className = "panel-heading-en";
    en.textContent = title.en;
    const pt = document.createElement("span");
    pt.className = "panel-heading-pt";
    pt.textContent = title.pt;
    heading.append(en, pt);

    head.append(heading);

    if (collection === "companies") {
      const badges = document.createElement("div");
      badges.className = "role-badges";
      badges.setAttribute("aria-label", "Career path fit");
      const activeCount = companyRoleCount(row);
      for (const role of COMPANY_ROLES) {
        const on = isFitYes(row[role.field]);
        const badge = document.createElement("span");
        badge.className = "role-badge" + (on ? " is-on" : " is-off");
        badge.title = `${role.en} / ${role.pt}`;
        const en = document.createElement("span");
        en.className = "role-badge-en";
        en.textContent = role.shortEn;
        const pt = document.createElement("span");
        pt.className = "role-badge-pt";
        pt.textContent = role.shortPt;
        badge.append(en, pt);
        badges.append(badge);
      }
      if (activeCount >= 2) {
        const multi = document.createElement("span");
        multi.className = "role-badge role-badge-multi is-on";
        const en = document.createElement("span");
        en.className = "role-badge-en";
        en.textContent = `Multi (${activeCount})`;
        const pt = document.createElement("span");
        pt.className = "role-badge-pt";
        pt.textContent = `Multi (${activeCount})`;
        multi.append(en, pt);
        multi.title =
          getLangMode() === "en"
            ? "Fits multiple career paths"
            : "Combina com múltiplas trilhas";
        badges.append(multi);
      }
      head.append(badges);
    }

    if (collection !== "about") {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "panel-delete";
      del.title = "Delete";
      del.setAttribute("aria-label", "Delete");
      del.textContent = "✕";
      del.addEventListener("click", () => {
        const msg =
          getLangMode() === "en"
            ? "Delete this record?"
            : "Excluir este registro?";
        if (!confirm(msg)) return;
        const idx = state[collection].findIndex((r) => r.id === row.id);
        if (idx < 0) return;
        state[collection].splice(idx, 1);
        setDirty(true);
        setSaveStatus("");
        renderAll();
      });
      head.append(del);
    }

    article.append(head);

    if (collection === "companies") {
      const research = document.createElement("div");
      research.className = "company-research";

      const skillsKey =
        getLangMode() === "pt" ? "skills_match_pt" : "skills_match_en";
      const skillsAlt =
        getLangMode() === "pt" ? "skills_match_en" : "skills_match_pt";
      const skillsRaw =
        cell(row[activeCol(skillsKey)]) ||
        cell(row[skillsKey]) ||
        cell(row[skillsAlt]);
      const skills = skillsRaw
        .split(/[;|,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (skills.length) {
        const skillsBlock = document.createElement("div");
        skillsBlock.className = "company-skills";
        const skillsLabel = document.createElement("div");
        skillsLabel.className = "company-research-label";
        const sle = document.createElement("span");
        sle.className = "filter-chip-en";
        sle.textContent = "Matching skills";
        const slp = document.createElement("span");
        slp.className = "filter-chip-pt";
        slp.textContent = "Competências alinhadas";
        skillsLabel.append(sle, slp);
        const pills = document.createElement("div");
        pills.className = "skill-pills";
        for (const skill of skills) {
          const pill = document.createElement("span");
          pill.className = "skill-pill";
          pill.textContent = skill;
          pills.append(pill);
        }
        skillsBlock.append(skillsLabel, pills);
        research.append(skillsBlock);
      }

      const whyKey = getLangMode() === "pt" ? "fit_why_pt" : "fit_why_en";
      const whyAlt = getLangMode() === "pt" ? "fit_why_en" : "fit_why_pt";
      const whyText =
        cell(row[activeCol(whyKey)]) ||
        cell(row[whyKey]) ||
        cell(row[whyAlt]);
      if (whyText.trim()) {
        const whyBlock = document.createElement("div");
        whyBlock.className = "company-fit-why";
        const whyLabel = document.createElement("div");
        whyLabel.className = "company-research-label";
        const wle = document.createElement("span");
        wle.className = "filter-chip-en";
        wle.textContent = "Why this path fits";
        const wlp = document.createElement("span");
        wlp.className = "filter-chip-pt";
        wlp.textContent = "Por que a trilha encaixa";
        whyLabel.append(wle, wlp);
        const whyBody = document.createElement("p");
        whyBody.className = "company-fit-why-text";
        whyBody.textContent = whyText;
        whyBlock.append(whyLabel, whyBody);
        research.append(whyBlock);
      }

      if (research.childElementCount) article.append(research);
    }

    for (const spec of FIELD_SPECS[collection]) {
      article.append(createFieldRow(spec.label, row, spec));
    }
    return article;
  }

  function companyCategories() {
    const seen = new Map();
    for (const row of state.companies || []) {
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

  function renderCompanyFilters() {
    const root = document.getElementById("companies-filters");
    if (!root) return;
    root.replaceChildren();

    const catRow = document.createElement("div");
    catRow.className = "company-filter-row";
    const catLabel = document.createElement("span");
    catLabel.className = "company-filter-label";
    const catEn = document.createElement("span");
    catEn.className = "filter-chip-en";
    catEn.textContent = "Category";
    const catPt = document.createElement("span");
    catPt.className = "filter-chip-pt";
    catPt.textContent = "Categoria";
    catLabel.append(catEn, catPt);
    catRow.append(catLabel);

    const cats = companyCategories();
    const catChips = [{ key: "", en: "All", pt: "Todas" }].concat(
      cats.map(([key, labels]) => ({
        key,
        en: labels.en,
        pt: labels.pt,
      })),
    );
    for (const chip of catChips) {
      catRow.append(
        makeFilterChip(chip, companyCategoryFilter, (key) => {
          companyCategoryFilter = key;
          renderSection("companies");
        }),
      );
    }
    root.append(catRow);

    const roleRow = document.createElement("div");
    roleRow.className = "company-filter-row";
    const roleLabel = document.createElement("span");
    roleLabel.className = "company-filter-label";
    const roleEn = document.createElement("span");
    roleEn.className = "filter-chip-en";
    roleEn.textContent = "Career path";
    const rolePt = document.createElement("span");
    rolePt.className = "filter-chip-pt";
    rolePt.textContent = "Trilha";
    roleLabel.append(roleEn, rolePt);
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
        makeFilterChip(chip, companyRoleFilter, (key) => {
          companyRoleFilter = key;
          renderSection("companies");
        }),
      );
    }
    root.append(roleRow);
  }

  function makeFilterChip(chip, activeKey, onSelect) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "filter-chip" + (activeKey === chip.key ? " is-active" : "");
    btn.setAttribute(
      "aria-pressed",
      activeKey === chip.key ? "true" : "false",
    );
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

  function renderSection(collection) {
    const meta = SECTION_META[collection];
    const root = document.getElementById(meta.root);
    if (!root) return;
    root.replaceChildren();
    const rows = state[collection] || [];

    if (collection === "companies") {
      renderCompanyFilters();
      let filtered = rows;
      if (companyCategoryFilter) {
        filtered = filtered.filter(
          (r) => cell(r.category_en).trim() === companyCategoryFilter,
        );
      }
      filtered = filtered.filter(companyMatchesRoleFilter);
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent =
          getLangMode() === "en"
            ? "No companies match these filters."
            : "Nenhuma empresa corresponde a estes filtros.";
        root.append(empty);
        return;
      }
      filtered.forEach((row, i) => {
        const index = rows.indexOf(row);
        root.append(createPanel(collection, row, index >= 0 ? index : i));
      });
      return;
    }

    rows.forEach((row, i) => root.append(createPanel(collection, row, i)));
  }

  function renderAll() {
    renderProfileSummary();
    for (const key of PROFILE_RENDER_KEYS) renderSection(key);
  }

  function openCompaniesWindow() {
    const w = window.open("/companies.html", "career-companies-search");
    if (w) w.focus();
    return w;
  }

  function listPlain(rows, enKey, ptKey, limit) {
    const items = (rows || []).slice(0, limit || 99);
    return {
      en: items.map((r) => cell(r[enKey]) || cell(r.id)).filter(Boolean),
      pt: items.map((r) => cell(r[ptKey]) || cell(r[enKey]) || cell(r.id)).filter(Boolean),
    };
  }

  function renderProfileSummary() {
    const root = document.getElementById("profile-summary-root");
    if (!root) return;
    root.replaceChildren();

    const about = (state.about || [])[0] || {};
    const titles = listPlain(state.targetTitles, "title_en", "title_pt", 8);
    const projects = listPlain(state.projects, "name_en", "name_pt", 12);
    const education = listPlain(state.education, "degree_en", "degree_pt", 8);
    const experience = (state.experience || []).map((r) => ({
      en: [cell(r.title_en), cell(r.company_en)].filter(Boolean).join(" @ "),
      pt: [cell(r.title_pt) || cell(r.title_en), cell(r.company_pt) || cell(r.company_en)]
        .filter(Boolean)
        .join(" @ "),
    }));
    const languages = (state.languages || []).map((r) => ({
      en: [cell(r.name_en), cell(r.level_en)].filter(Boolean).join(" — "),
      pt: [cell(r.name_pt) || cell(r.name_en), cell(r.level_pt) || cell(r.level_en)]
        .filter(Boolean)
        .join(" — "),
    }));
    const competences = listPlain(state.competences, "name_en", "name_pt", 20);
    const courses = listPlain(state.courses, "title_en", "title_pt", 10);
    const recognitions = listPlain(state.recognitions, "title_en", "title_pt", 8);
    const volunteering = listPlain(state.volunteering, "title_en", "title_pt", 6);
    const certifications = listPlain(state.certifications, "title_en", "title_pt", 10);

    const sections = [
      {
        titleEn: "About",
        titlePt: "Sobre",
        en: [cell(about.text_en)].filter(Boolean),
        pt: [cell(about.text_pt) || cell(about.text_en)].filter(Boolean),
      },
      {
        titleEn: "Target titles",
        titlePt: "Títulos-alvo",
        en: titles.en,
        pt: titles.pt,
      },
      {
        titleEn: "Experience",
        titlePt: "Experiência",
        en: experience.map((x) => x.en).filter(Boolean),
        pt: experience.map((x) => x.pt).filter(Boolean),
      },
      {
        titleEn: "Education",
        titlePt: "Formação",
        en: education.en,
        pt: education.pt,
      },
      {
        titleEn: "Projects",
        titlePt: "Projetos",
        en: projects.en,
        pt: projects.pt,
      },
      {
        titleEn: "Languages",
        titlePt: "Idiomas",
        en: languages.map((x) => x.en).filter(Boolean),
        pt: languages.map((x) => x.pt).filter(Boolean),
      },
      {
        titleEn: "Competences / skills",
        titlePt: "Competências",
        en: competences.en,
        pt: competences.pt,
      },
      {
        titleEn: "Courses",
        titlePt: "Cursos",
        en: courses.en,
        pt: courses.pt,
      },
      {
        titleEn: "Recognitions",
        titlePt: "Reconhecimentos",
        en: recognitions.en,
        pt: recognitions.pt,
      },
      {
        titleEn: "Volunteering",
        titlePt: "Voluntariado",
        en: volunteering.en,
        pt: volunteering.pt,
      },
      {
        titleEn: "Licenses & certifications",
        titlePt: "Licenças e certificados",
        en: certifications.en,
        pt: certifications.pt,
      },
    ];

    const grid = document.createElement("div");
    grid.className = "profile-summary-grid";

    for (const sec of sections) {
      if (!sec.en.length && !sec.pt.length) continue;
      const card = document.createElement("article");
      card.className = "profile-summary-card";

      const h = document.createElement("h3");
      h.className = "profile-summary-card-title";
      const he = document.createElement("span");
      he.className = "panel-heading-en";
      he.textContent = sec.titleEn;
      const hp = document.createElement("span");
      hp.className = "panel-heading-pt";
      hp.textContent = sec.titlePt;
      h.append(he, hp);
      card.append(h);

      const cols = document.createElement("div");
      cols.className = "profile-summary-cols";

      const enCol = document.createElement("div");
      enCol.className = "profile-summary-col profile-summary-en";
      const enLabel = document.createElement("div");
      enLabel.className = "profile-summary-lang";
      enLabel.textContent = "EN";
      enCol.append(enLabel);
      if (sec.en.length === 1 && sec.en[0].length > 160) {
        const p = document.createElement("p");
        p.textContent = sec.en[0];
        enCol.append(p);
      } else {
        const ul = document.createElement("ul");
        for (const item of sec.en) {
          const li = document.createElement("li");
          li.textContent = item;
          ul.append(li);
        }
        enCol.append(ul);
      }

      const ptCol = document.createElement("div");
      ptCol.className = "profile-summary-col profile-summary-pt";
      const ptLabel = document.createElement("div");
      ptLabel.className = "profile-summary-lang";
      ptLabel.textContent = "PT";
      ptCol.append(ptLabel);
      if (sec.pt.length === 1 && sec.pt[0].length > 160) {
        const p = document.createElement("p");
        p.textContent = sec.pt[0];
        ptCol.append(p);
      } else {
        const ul = document.createElement("ul");
        for (const item of sec.pt) {
          const li = document.createElement("li");
          li.textContent = item;
          ul.append(li);
        }
        ptCol.append(ul);
      }

      cols.append(enCol, ptCol);
      card.append(cols);
      grid.append(card);
    }

    root.append(grid);
  }

  function wireAddButtons() {
    document.querySelectorAll("[data-add-collection]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const collection = btn.getAttribute("data-add-collection");
        if (!SECTION_META[collection]?.canAdd) return;
        if (collection === "companies") {
          companyCategoryFilter = "";
          companyRoleFilter = "";
        }
        state[collection].push(blankRow(collection));
        setDirty(true);
        setSaveStatus("");
        renderSection(collection);
        const root = document.getElementById(SECTION_META[collection].root);
        const last = root?.lastElementChild;
        if (last) {
          last.scrollIntoView({ behavior: "smooth", block: "nearest" });
          const firstInput = last.querySelector(".field-input");
          if (firstInput) firstInput.focus();
        }
      });
    });
  }

  async function loadState() {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error(`GET /api/state failed (${res.status})`);
    const payload = await res.json();
    const collections = payload.collections || {};
    state = {};
    for (const key of COLLECTION_KEYS) {
      state[key] = Array.isArray(collections[key])
        ? collections[key].map((row) => {
            const out = {};
            for (const col of SCHEMAS[key]) out[col] = cell(row[col]);
            return out;
          })
        : [];
    }
    if (state.about.length === 0) {
      state.about = [blankRow("about")];
      state.about[0].id = "linkedin-about";
      state.about[0].sort_order = "1";
    }
  }

  async function saveAll() {
    if (saving || !dirty) return;
    saving = true;
    setDirty(true);
    const btn = document.getElementById("save-btn");
    if (btn) btn.disabled = true;
    setSaveStatus(getLangMode() === "en" ? "Saving…" : "Salvando…");
    try {
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections: state }),
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

  function togglePanelsCollapsed() {
    const collapsed = document.body.classList.toggle("panels-collapsed");
    document.body.setAttribute("aria-expanded", collapsed ? "false" : "true");
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
        updateDetailIndicator();
        return;
      }
      if (event.code === "Digit2") {
        event.preventDefault();
        setLangMode("en");
        updateDetailIndicator();
        return;
      }
      if (event.code === "Digit0") {
        event.preventDefault();
        setLangMode("both");
        updateDetailIndicator();
        return;
      }
      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        togglePanelsCollapsed();
        return;
      }
      if (event.key.toLowerCase() === "d") {
        event.preventDefault();
        setDetailMode(!detailMode, true);
        return;
      }
      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        openCompaniesWindow();
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

  function initDetailMode() {
    let detail = false;
    try {
      detail = localStorage.getItem(DETAIL_KEY) === "detail";
    } catch {
      /* ignore */
    }
    setDetailMode(detail, false);
  }

  async function loadDownloads() {
    const root = document.getElementById("downloads-root");
    if (!root) return;
    root.replaceChildren();
    try {
      const res = await fetch("/api/downloads");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      renderDownloads(payload.items || []);
    } catch (err) {
      const p = document.createElement("p");
      p.className = "downloads-error";
      p.textContent =
        (getLangMode() === "en" ? "Could not load downloads: " : "Falha ao carregar downloads: ") +
        (err.message || String(err));
      root.append(p);
    }
  }

  function renderDownloads(items) {
    const root = document.getElementById("downloads-root");
    if (!root) return;
    root.replaceChildren();

    const order = [
      "digital-solution-architect",
      "data-analyst",
      "product-owner",
      "general",
    ];
    const byVariant = {};
    for (const item of items) {
      if (!byVariant[item.variant]) byVariant[item.variant] = [];
      byVariant[item.variant].push(item);
    }

    for (const variant of order) {
      const group = byVariant[variant];
      if (!group || !group.length) continue;
      const card = document.createElement("article");
      card.className = "download-card";

      const heading = document.createElement("h3");
      heading.className = "download-card-title";
      const en = document.createElement("span");
      en.className = "panel-heading-en";
      en.textContent = group[0].label_en;
      const pt = document.createElement("span");
      pt.className = "panel-heading-pt";
      pt.textContent = group[0].label_pt;
      heading.append(en, pt);
      card.append(heading);

      const resumes = group.filter((i) => i.kind === "resume");
      const portfolios = group.filter((i) => i.kind === "portfolio");

      card.append(buildDownloadRow("Resume", "Currículo", resumes));
      card.append(buildDownloadRow("Portfolio", "Portfólio", portfolios));
      root.append(card);
    }
  }

  function buildDownloadRow(labelEn, labelPt, items) {
    const row = document.createElement("div");
    row.className = "download-row";
    const label = document.createElement("div");
    label.className = "download-row-label";
    const en = document.createElement("span");
    en.className = "field-label-en";
    en.textContent = labelEn;
    const pt = document.createElement("span");
    pt.className = "field-label-pt";
    pt.textContent = labelPt;
    label.append(en, pt);
    row.append(label);

    const actions = document.createElement("div");
    actions.className = "download-actions";
    for (const item of items) {
      const a = document.createElement(item.available ? "a" : "span");
      a.className = "download-btn" + (item.available ? "" : " missing");
      a.textContent = item.lang.toUpperCase();
      if (item.available) {
        a.href = item.url;
        a.setAttribute("download", item.filename);
        a.title = item.filename;
      } else {
        a.title =
          getLangMode() === "en"
            ? "PDF not found — run python scripts/build_outputs.py"
            : "PDF ausente — rode python scripts/build_outputs.py";
      }
      actions.append(a);
    }
    row.append(actions);
    return row;
  }

  async function init() {
    try {
      window.name = "career-profile";
    } catch {
      /* ignore */
    }
    initLangMode();
    initDetailMode();
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) saveBtn.addEventListener("click", () => saveAll());
    const openCompaniesBtn = document.getElementById("open-companies-btn");
    if (openCompaniesBtn) {
      openCompaniesBtn.addEventListener("click", () => openCompaniesWindow());
    }
    wireAddButtons();
    initKeyboard();
    window.addEventListener("beforeunload", (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    });

    try {
      await loadState();
      renderAll();
      setDirty(false);
      setSaveStatus("");
    } catch (err) {
      setSaveStatus(
        (getLangMode() === "en" ? "Load error: " : "Erro ao carregar: ") +
          (err.message || String(err)),
        "err",
      );
    }
    await loadDownloads();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
