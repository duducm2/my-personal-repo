(() => {
  const labels = window.CAREER_LABELS;
  const LANG_KEY = "career-cockpit-lang";
  const DETAIL_KEY = "career-cockpit-detail";
  const PATH_KEY = "career-cockpit-path";
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
    "jobPortals",
    "jobOpenings",
    "jobPlatforms",
    "jobCommunities",
  ];

  /** Profile window renders these; companies/jobs/portals live in their own windows */
  const PROFILE_RENDER_KEYS = COLLECTION_KEYS.filter(
    (k) =>
      ![
        "companies",
        "jobPortals",
        "jobOpenings",
        "jobPlatforms",
        "jobCommunities",
      ].includes(k),
  );

  const STRUCTURAL = new Set([
    "id",
    "sort_order",
    "pinned",
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
    "careers_url",
    "ats_kind",
    "ats_name",
    "ats_url",
    "fit_data_analyst",
    "fit_product_owner",
    "fit_digital_solution_architect",
    "scope",
    "job_search_url",
    "system_kind",
    "fit_paths",
    "name",
    "notes",
    "is_new",
    "match_score",
    "match_reason",
    "recommended_resume",
  ]);

  /** Base (summary) columns — must match python/canonical_store._BASE */
  const BASE_SCHEMAS = {
    about: ["id", "sort_order", "text_en", "text_pt"],
    targetTitles: [
      "id",
      "sort_order",
      "pinned",
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
      "pinned",
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
      "pinned",
      "institution_en",
      "institution_pt",
      "location_en",
      "location_pt",
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
      "pinned",
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
      "pinned",
      "name_en",
      "name_pt",
      "level_en",
      "level_pt",
    ],
    recognitions: [
      "id",
      "sort_order",
      "pinned",
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
      "pinned",
      "title_en",
      "title_pt",
      "associated_en",
      "associated_pt",
    ],
    competences: [
      "id",
      "sort_order",
      "pinned",
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
      "pinned",
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
      "pinned",
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
      "careers_url",
      "ats_kind",
      "ats_name",
      "ats_url",
      "skills_match_en",
      "skills_match_pt",
      "fit_why_en",
      "fit_why_pt",
      "notes_en",
      "notes_pt",
    ],
    jobPortals: [
      "id",
      "sort_order",
      "scope",
      "name",
      "job_search_url",
      "system_kind",
      "ats_name",
      "ats_url",
      "fit_paths",
      "notes",
    ],
    jobOpenings: [
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
    ],
    jobPlatforms: ["id", "sort_order", "company_key", "label", "url"],
    jobCommunities: ["id", "sort_order", "name", "url", "notes"],
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
      { label: "location", pt: "location_pt", en: "location_en" },
      { label: "fieldOfStudy", pt: "field_pt", en: "field_en" },
      { label: "dateRange", pt: "date_display_pt", en: "date_display_en" },
      {
        label: "educationDescription",
        pt: "description_pt",
        en: "description_en",
        tall: true,
        important: true,
      },
      { label: "relatedSkills", pt: "skills_pt", en: "skills_en" },
      {
        label: "activities",
        pt: "activities_pt",
        en: "activities_en",
        tall: true,
      },
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
      {
        label: "fitDigitalSolutionArchitect",
        mono: "fit_digital_solution_architect",
      },
      { label: "companyWebsite", mono: "website" },
      { label: "careersUrl", mono: "careers_url" },
      { label: "atsKind", mono: "ats_kind" },
      { label: "atsName", mono: "ats_name" },
      { label: "atsUrl", mono: "ats_url" },
      {
        label: "skillsMatch",
        pt: "skills_match_pt",
        en: "skills_match_en",
        tall: true,
      },
      { label: "fitWhy", pt: "fit_why_pt", en: "fit_why_en", tall: true },
      { label: "companyNotes", pt: "notes_pt", en: "notes_en", tall: true },
    ],
  };

  const SECTION_META = {
    about: {
      root: "about-root",
      title: { en: "About", pt: "About" },
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
  let saveTimer = null;
  let saveGeneration = 0;
  const SAVE_DEBOUNCE_MS = 500;
  let detailMode = false;
  /** Profile career path filter (`""` = All). */
  let pathFilter = "";
  /** Local-only filters for companies (`""` = All). */
  let companyCategoryFilter = "";
  let companyRoleFilter = "";
  /** Profile map text search. */
  let profileQuery = "";
  let profileMapScrolledQuery = "";
  /** Identity row from profile.csv, for copy-paste on the map. */
  let contactProfile = {};

  const CAREER_PATHS = [
    {
      key: "data-analyst",
      short: "DA",
      en: "Data Analyst",
      pt: "Data Analyst",
    },
    {
      key: "product-owner",
      short: "PO",
      en: "Product Owner",
      pt: "Product Owner",
    },
    {
      key: "digital-solution-architect",
      short: "DSA",
      en: "Digital Solution Architect",
      pt: "Digital Solution Architect",
    },
    { key: "general", short: "GEN", en: "General", pt: "General" },
  ];

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

  let downloadsCache = { items: [], policy: null };

  function getLangMode() {
    if (document.body.classList.contains("lang-pt")) return "pt";
    if (document.body.classList.contains("lang-en")) return "en";
    return "both";
  }

  function setLangMode(mode, rerender) {
    const next =
      mode === "pt" || mode === "en" || mode === "both" ? mode : "en";
    document.body.classList.remove("lang-pt", "lang-en");
    if (next === "pt" || next === "en") {
      document.body.classList.add(`lang-${next}`);
    }
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      /* ignore */
    }
    // Document lang stays English — UI chrome is always EN; mode only toggles values.
    document.documentElement.lang = "en";
    updateLangIndicator();
    if (rerender) {
      renderAll();
      renderDownloads(downloadsCache.items, downloadsCache.policy);
    }
  }

  function updateLangIndicator() {
    const el = document.getElementById("lang-mode-label");
    if (!el) return;
    const mode = getLangMode();
    el.textContent =
      mode === "pt"
        ? "Showing PT values"
        : mode === "en"
          ? "Showing EN values"
          : "Showing EN + PT";
  }

  function updateDetailIndicator() {
    const summaryBtn = document.getElementById("detail-mode-summary");
    const detailBtn = document.getElementById("detail-mode-detail");
    if (summaryBtn) {
      summaryBtn.classList.toggle("is-active", !detailMode);
      summaryBtn.setAttribute("aria-pressed", !detailMode ? "true" : "false");
    }
    if (detailBtn) {
      detailBtn.classList.toggle("is-active", detailMode);
      detailBtn.setAttribute("aria-pressed", detailMode ? "true" : "false");
    }
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

  function flushSaveKeepalive() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    if (!dirty) return;
    try {
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections: state }),
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
    if (collection === "competences") {
      row.category_en = "Tools and technologies";
      row.category_pt = "Ferramentas e tecnologias";
      row.category_detail_en = row.category_en;
      row.category_detail_pt = row.category_pt;
    }
    if (collection === "targetTitles" && pathFilter) {
      const pathMeta = CAREER_PATHS.find((p) => p.key === pathFilter);
      row.path = pathFilter;
      if (pathMeta) {
        row.path_label_en = pathMeta.en;
        row.path_label_pt = pathMeta.pt;
        row.path_label_detail_en = pathMeta.en;
        row.path_label_detail_pt = pathMeta.pt;
      }
    }
    return row;
  }

  function slugifySkillId(text) {
    const base = String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    return base || `skill-${Date.now()}`;
  }

  function uniqueCompetenceId(preferred, excludeId) {
    const used = new Set(
      (state.competences || [])
        .filter((r) => r.id !== excludeId)
        .map((r) => cell(r.id)),
    );
    let id = preferred;
    let n = 2;
    while (used.has(id)) {
      id = `${preferred}-${n}`;
      n += 1;
    }
    return id;
  }

  function syncCompetenceIdFromName(row) {
    const name = cell(row.name_en) || cell(row.name_pt);
    if (!name.trim()) return;
    const current = cell(row.id);
    if (current && !current.startsWith("competences-")) return;
    row.id = uniqueCompetenceId(slugifySkillId(name), current);
  }

  function addCompetence(opts) {
    const row = blankRow("competences");
    if (opts?.name_en) {
      row.name_en = opts.name_en;
      row.name_detail_en = opts.name_en;
    }
    if (opts?.name_pt) {
      row.name_pt = opts.name_pt;
      row.name_detail_pt = opts.name_pt;
    } else if (opts?.name_en) {
      row.name_pt = opts.name_en;
      row.name_detail_pt = opts.name_en;
    }
    if (opts?.category_en) {
      row.category_en = opts.category_en;
      row.category_detail_en = opts.category_en;
    }
    if (opts?.category_pt) {
      row.category_pt = opts.category_pt;
      row.category_detail_pt = opts.category_pt;
    }
    syncCompetenceIdFromName(row);
    state.competences.push(row);
    setDirty(true);
    setSaveStatus("");
    renderAll();
    jumpToProfileTarget({ headingId: "competences-heading", rowId: row.id });
    const panel = document.querySelector(
      `#competences-root .panel[data-id="${CSS.escape(row.id)}"]`,
    );
    const firstInput = panel?.querySelector(".field-input");
    if (firstInput) firstInput.focus();
    return row;
  }

  function removeCompetence(id) {
    const idx = (state.competences || []).findIndex((r) => r.id === id);
    if (idx < 0) return false;
    const name =
      cell(state.competences[idx].name_en) ||
      cell(state.competences[idx].name_pt) ||
      id;
    if (!confirm(`Remove skill “${name}”?`)) return false;
    state.competences.splice(idx, 1);
    setDirty(true);
    setSaveStatus("");
    renderAll();
    return true;
  }

  function promptAddSkill() {
    const nameEn = window.prompt("New skill name (EN):");
    if (nameEn == null) return;
    const trimmed = nameEn.trim();
    if (!trimmed) return;
    const namePtRaw = window.prompt("Nome da habilidade (PT):", trimmed);
    if (namePtRaw == null) return;
    addCompetence({
      name_en: trimmed,
      name_pt: namePtRaw.trim() || trimmed,
    });
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
    const okLabel = "Copied";
    const errLabel = "Error";
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

    const input = document.createElement("textarea");
    input.className = "field-input" + (tall ? " tall" : "");
    input.rows = 2;
    let shown = cell(row[key]);
    if (detailMode && !shown.trim() && key !== baseKey) {
      shown = cell(row[baseKey]);
      if (shown.trim()) row[key] = shown;
    }
    input.value = shown;
    input.addEventListener("input", () => {
      row[key] = input.value;
      if (
        (baseKey === "name_en" || baseKey === "name_pt") &&
        String(row.id || "").startsWith("competences-")
      ) {
        syncCompetenceIdFromName(row);
        const panel = input.closest(".panel");
        if (panel) panel.dataset.id = row.id;
      }
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
    rowEl.className = "field-row" + (spec.important ? " is-important" : "");

    const labelEl = document.createElement("div");
    labelEl.className = "field-label";
    const en = document.createElement("span");
    en.className = "field-label-en";
    en.textContent = labels[label].en;
    labelEl.append(en);
    rowEl.append(labelEl);

    const mode = getLangMode();
    if (spec.mono) {
      if (mode === "both") {
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
          createEditableCell(
            mode === "pt" ? "PT" : "EN",
            row,
            spec.mono,
            spec.tall,
          ),
        );
      }
    } else if (mode === "both") {
      rowEl.append(
        createEditableCell("PT", row, spec.pt, spec.tall),
        createEditableCell("EN", row, spec.en, spec.tall),
      );
    } else {
      const baseKey = mode === "pt" ? spec.pt : spec.en;
      rowEl.append(
        createEditableCell(
          mode === "pt" ? "PT" : "EN",
          row,
          baseKey,
          spec.tall,
        ),
      );
    }
    return rowEl;
  }

  function panelTitle(collection, row, meta) {
    if (meta.title) return meta.title;
    const en = cell(row[meta.titleKey.en]) || cell(row.id) || "New";
    const pt = cell(row[meta.titleKey.pt]) || cell(row.id) || "New";
    return { en, pt };
  }

  function isRowPinned(row) {
    const v = cell(row?.pinned).toLowerCase();
    return v === "1" || v === "true" || v === "yes" || v === "y";
  }

  function collectionCanPin(collection) {
    return (SCHEMAS[collection] || []).includes("pinned");
  }

  function sortPinnedFirst(rows) {
    return rows
      .map((row, index) => ({ row, index }))
      .sort((a, b) => {
        const pin = (isRowPinned(a.row) ? 0 : 1) - (isRowPinned(b.row) ? 0 : 1);
        return pin || a.index - b.index;
      })
      .map((item) => item.row);
  }

  function toggleProfilePin(collection, row) {
    if (!collectionCanPin(collection)) return false;
    const live = (state[collection] || []).find((r) => r.id === row.id);
    if (!live) return false;
    live.pinned = isRowPinned(live) ? "" : "1";
    setDirty(true);
    setSaveStatus(isRowPinned(live) ? "Pinned" : "Unpinned", "ok");
    renderSection(collection);
    const rootId = SECTION_META[collection]?.root;
    const panel = rootId
      ? document.querySelector(
          `#${rootId} .panel[data-id="${CSS.escape(live.id)}"]`,
        )
      : null;
    panel?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    const field = panel?.querySelector(".field-input");
    if (field) {
      window.setTimeout(() => {
        try {
          field.focus({ preventScroll: true });
        } catch {
          field.focus();
        }
      }, 0);
    }
    return true;
  }

  function pinFocusedProfileRecord() {
    const panel = document.activeElement?.closest?.(".panel[data-id]");
    if (!panel) {
      setSaveStatus("Focus a record, then Alt+M to pin it", "err");
      return;
    }
    const host = panel.parentElement;
    const collection = Object.keys(SECTION_META).find(
      (key) => SECTION_META[key].root === host?.id,
    );
    const row = collection
      ? (state[collection] || []).find((r) => r.id === panel.dataset.id)
      : null;
    if (!row || !toggleProfilePin(collection, row)) {
      setSaveStatus("This record cannot be pinned", "err");
    }
  }

  function createPanel(collection, row, index) {
    const meta = SECTION_META[collection];
    const article = document.createElement("article");
    article.className = "panel" + (isRowPinned(row) ? " is-pinned" : "");
    article.dataset.id = row.id;
    article.tabIndex = 0;

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
        badge.title = role.en;
        badge.textContent = role.shortEn;
        badges.append(badge);
      }
      if (activeCount >= 2) {
        const multi = document.createElement("span");
        multi.className = "role-badge role-badge-multi is-on";
        multi.textContent = `Multi (${activeCount})`;
        multi.title = "Fits multiple career paths";
        badges.append(multi);
      }
      head.append(badges);
    }

    if (collectionCanPin(collection)) {
      const pinned = isRowPinned(row);
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "pin-btn" + (pinned ? " is-on" : "");
      pin.setAttribute("aria-pressed", pinned ? "true" : "false");
      pin.title = pinned ? "Unpin from top (Alt+M)" : "Pin to top (Alt+M)";
      pin.setAttribute("aria-label", pin.title);
      const icon = document.createElement("img");
      icon.className = "pin-btn-icon";
      icon.src = "icons/pin-pen.png?v=3";
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      pin.append(icon);
      pin.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleProfilePin(collection, row);
      });
      head.append(pin);
    }

    if (collection !== "about") {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "panel-delete";
      del.title = "Delete";
      del.setAttribute("aria-label", "Delete");
      del.textContent = "✕";
      del.addEventListener("click", () => {
        if (collection === "competences") {
          removeCompetence(row.id);
          return;
        }
        const msg = "Delete this record?";
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
        skillsLabel.textContent = "Matching skills";
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
        cell(row[activeCol(whyKey)]) || cell(row[whyKey]) || cell(row[whyAlt]);
      if (whyText.trim()) {
        const whyBlock = document.createElement("div");
        whyBlock.className = "company-fit-why";
        const whyLabel = document.createElement("div");
        whyLabel.className = "company-research-label";
        whyLabel.textContent = "Why this path fits";
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
    catLabel.textContent = "Category";
    catRow.append(catLabel);

    const cats = companyCategories();
    const catChips = [{ key: "", en: "All", pt: "All" }].concat(
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
    roleLabel.textContent = "Career path";
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

  function renderSection(collection) {
    const meta = SECTION_META[collection];
    const root = document.getElementById(meta.root);
    if (!root) return;
    root.replaceChildren();
    let rows = state[collection] || [];
    const parts = profileQueryParts();
    if (!parts.length) {
      setSectionSearchVisibility(root, true);
    } else {
      rows = filterRowsByProfileSearch(collection, rows);
      if (!rows.length) {
        setSectionSearchVisibility(root, false);
        return;
      }
      setSectionSearchVisibility(root, true);
    }

    if (collectionCanPin(collection)) {
      rows = sortPinnedFirst(rows);
    }

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
        empty.textContent = "No companies match these filters.";
        root.append(empty);
        return;
      }
      filtered.forEach((row, i) => {
        const index = rows.indexOf(row);
        root.append(createPanel(collection, row, index >= 0 ? index : i));
      });
      return;
    }

    if (collection === "targetTitles") {
      const filtered = rows.filter((r) => matchesPathFilter(r.path));
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = pathFilter
          ? "No titles for this career path."
          : "No titles yet.";
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
    renderPathFilters();
    renderProfileSummary();
    for (const key of PROFILE_RENDER_KEYS) renderSection(key);
    syncDownloadsSearch();
  }

  function matchesPathFilter(pathValue) {
    if (!pathFilter) return true;
    return cell(pathValue).trim() === pathFilter;
  }

  function setPathFilter(key) {
    pathFilter = key || "";
    try {
      localStorage.setItem(PATH_KEY, pathFilter);
    } catch {
      /* ignore */
    }
    renderAll();
    renderDownloads(downloadsCache.items, downloadsCache.policy);
  }

  function searchBarEl() {
    return document.getElementById("search-bar");
  }

  function searchInputEl() {
    return document.getElementById("profile-search-input");
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
      hideSearchBar();
      return;
    }
    focusSearch();
  }

  function clearProfileSearch() {
    profileQuery = "";
    profileMapScrolledQuery = "";
    const inp = searchInputEl();
    if (inp) inp.value = "";
    hideSearchBar();
    renderProfileSearch();
  }

  function profileQueryParts() {
    return profileQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }

  function textHasParts(text, parts) {
    const hay = (text || "").toLowerCase();
    return parts.every((part) => hay.includes(part));
  }

  const SECTION_SEARCH_TITLES = {
    about: ["About"],
    targetTitles: ["Target titles", "Possible titles"],
    projects: ["Projects"],
    education: ["Education"],
    experience: ["Experience"],
    languages: ["Languages"],
    recognitions: ["Recognitions", "Honors", "Awards"],
    courses: ["Courses"],
    competences: ["Competences", "Skills"],
    volunteering: ["Volunteering"],
    certifications: ["Licenses", "Certifications"],
  };

  const HEADING_COLLECTION = {
    "about-heading": "about",
    "titles-heading": "targetTitles",
    "projects-heading": "projects",
    "education-heading": "education",
    "experience-heading": "experience",
    "languages-heading": "languages",
    "recognitions-heading": "recognitions",
    "courses-heading": "courses",
    "competences-heading": "competences",
    "volunteering-heading": "volunteering",
    "certifications-heading": "certifications",
  };

  function titleTokens(title) {
    return String(title)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 3);
  }

  function partMatchesTitles(part, titles) {
    const p = String(part || "").toLowerCase();
    if (p.length < 3) return false;
    return titles.some((title) =>
      titleTokens(title).some(
        (token) => token === p || token.startsWith(p) || p.startsWith(token),
      ),
    );
  }

  function profileSearchCatalogs() {
    return [
      ["Contact"],
      ["Resumes", "Portfolios"],
      ...Object.values(SECTION_SEARCH_TITLES),
    ];
  }

  function splitProfileQuery(parts) {
    const catalogs = profileSearchCatalogs();
    const scopeWords = [];
    const contentWords = [];
    for (const part of parts) {
      if (catalogs.some((titles) => partMatchesTitles(part, titles))) {
        scopeWords.push(part);
      } else {
        contentWords.push(part);
      }
    }
    return { scopeWords, contentWords };
  }

  function filterRowsByProfileSearch(collection, rows) {
    const titles = SECTION_SEARCH_TITLES[collection];
    const parts = profileQueryParts();
    if (!titles || !parts.length) return rows;
    const { scopeWords, contentWords } = splitProfileQuery(parts);
    const inScope =
      !scopeWords.length ||
      scopeWords.some((part) => partMatchesTitles(part, titles));
    if (!inScope) return [];
    const words = scopeWords.length ? contentWords : parts;
    if (!words.length) return rows;
    return rows.filter((row) => textHasParts(rowHay(row), words));
  }

  function setSectionSearchVisibility(root, show) {
    const sectionEl = root?.closest(".section");
    if (sectionEl) sectionEl.hidden = !show;
  }

  function syncDownloadsSearch() {
    const section = document
      .getElementById("downloads-heading")
      ?.closest(".section");
    if (!section) return;
    const parts = profileQueryParts();
    if (!parts.length) {
      section.hidden = false;
      return;
    }
    const { scopeWords } = splitProfileQuery(parts);
    const titles = ["Resumes", "Portfolios"];
    section.hidden = scopeWords.length
      ? !scopeWords.some((part) => partMatchesTitles(part, titles))
      : !parts.some((part) => partMatchesTitles(part, titles));
  }

  function renderProfileSearch() {
    renderProfileSummary();
    for (const key of PROFILE_RENDER_KEYS) renderSection(key);
    syncDownloadsSearch();
  }

  function hasActiveProfileFilters() {
    return !!(
      pathFilter ||
      companyCategoryFilter ||
      companyRoleFilter ||
      profileQuery.trim()
    );
  }

  function clearProfileFilters() {
    pathFilter = "";
    companyCategoryFilter = "";
    companyRoleFilter = "";
    profileQuery = "";
    profileMapScrolledQuery = "";
    const inp = searchInputEl();
    if (inp) inp.value = "";
    hideSearchBar();
    try {
      localStorage.setItem(PATH_KEY, "");
    } catch {
      /* ignore */
    }
    renderAll();
    renderDownloads(downloadsCache.items, downloadsCache.policy);
  }

  function initPathFilter() {
    let saved = "";
    try {
      saved = localStorage.getItem(PATH_KEY) || "";
    } catch {
      /* ignore */
    }
    const known = CAREER_PATHS.some((p) => p.key === saved);
    pathFilter = known ? saved : "";
  }

  function renderPathFilters() {
    const root = document.getElementById("path-filters");
    if (!root) return;
    root.replaceChildren();

    const row = document.createElement("div");
    row.className = "company-filter-row";
    const label = document.createElement("span");
    label.className = "company-filter-label";
    label.textContent = "Career path";
    row.append(label);

    const chips = [
      { key: "", en: "All paths", pt: "All paths" },
      ...CAREER_PATHS.map((p) => ({ key: p.key, en: p.en, pt: p.pt })),
    ];
    for (const chip of chips) {
      row.append(makeFilterChip(chip, pathFilter, (key) => setPathFilter(key)));
    }
    root.append(row);
  }

  function openCompaniesWindow() {
    location.assign("/companies.html");
  }

  function openPortalsWindow() {
    location.assign("/portals.html");
  }

  function openJobsWindow() {
    location.assign("/");
  }

  function rowHay(row) {
    if (!row) return "";
    return Object.values(row).map(cell).join("\n").toLowerCase();
  }

  function listPlain(rows, enKey, ptKey, limit) {
    return (rows || [])
      .slice(0, limit || 99)
      .map((r) => ({
        id: r.id,
        en: cell(r[enKey]) || cell(r.id),
        pt: cell(r[ptKey]) || cell(r[enKey]) || cell(r.id),
        hay: rowHay(r),
      }))
      .filter((x) => x.en || x.pt);
  }

  async function copyProfileValue(text, btn) {
    const value = cell(text);
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    const previous = btn.title;
    btn.classList.add("is-copied");
    btn.title = "Copied";
    window.setTimeout(() => {
      btn.classList.remove("is-copied");
      btn.title = previous;
    }, 1200);
  }

  let profileJumpToken = 0;

  function jumpToProfileTarget(opts) {
    const { headingId, rowId } = opts || {};
    const token = ++profileJumpToken;
    let target = null;
    if (rowId) {
      target = document.querySelector(
        `.panel[data-id="${CSS.escape(String(rowId))}"]`,
      );
    }
    if (!target && headingId) {
      const heading = document.getElementById(headingId);
      target = heading?.closest(".section") || heading;
    }
    if (!target) return;

    setSectionsCollapsed(false);

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    target.classList.remove("profile-jump-flash");
    // reflow so animation can retrigger
    void target.offsetWidth;
    target.classList.add("profile-jump-flash");
    window.setTimeout(
      () => target.classList.remove("profile-jump-flash"),
      1400,
    );

    if (rowId) {
      const input = target.querySelector(".field-input");
      if (input) {
        window.setTimeout(() => {
          if (token !== profileJumpToken) return;
          try {
            input.focus({ preventScroll: true });
          } catch {
            input.focus();
          }
        }, 350);
      }
    }
  }

  function jumpToFirstProfileRecord(collection) {
    const meta = SECTION_META[collection];
    const root = meta ? document.getElementById(meta.root) : null;
    const panel = root?.querySelector(".panel");
    const headingId = collection + "-heading";
    if (panel?.dataset.id) {
      jumpToProfileTarget({ headingId, rowId: panel.dataset.id });
      return;
    }
    jumpToProfileTarget({ headingId });
  }

  function renderProfileSummary() {
    const root = document.getElementById("profile-summary-root");
    if (!root) return;
    root.replaceChildren();

    const about = (state.about || [])[0] || {};
    const titleRows = (state.targetTitles || []).filter((r) =>
      matchesPathFilter(r.path),
    );
    const titles = listPlain(titleRows, "title_en", "title_pt", 8);
    const projects = listPlain(state.projects, "name_en", "name_pt", 12);
    const education = listPlain(state.education, "degree_en", "degree_pt", 8);
    const experience = (state.experience || []).map((r) => ({
      id: r.id,
      en: [cell(r.title_en), cell(r.company_en)].filter(Boolean).join(" @ "),
      pt: [
        cell(r.title_pt) || cell(r.title_en),
        cell(r.company_pt) || cell(r.company_en),
      ]
        .filter(Boolean)
        .join(" @ "),
      hay: rowHay(r),
    }));
    const languages = (state.languages || []).map((r) => ({
      id: r.id,
      en: [cell(r.name_en), cell(r.level_en)].filter(Boolean).join(" — "),
      pt: [
        cell(r.name_pt) || cell(r.name_en),
        cell(r.level_pt) || cell(r.level_en),
      ]
        .filter(Boolean)
        .join(" — "),
      hay: rowHay(r),
    }));
    const competences = listPlain(state.competences, "name_en", "name_pt");
    const courses = listPlain(state.courses, "title_en", "title_pt", 10);
    const recognitions = listPlain(
      state.recognitions,
      "title_en",
      "title_pt",
      8,
    );
    const volunteering = listPlain(
      state.volunteering,
      "title_en",
      "title_pt",
      6,
    );
    const certifications = listPlain(
      state.certifications,
      "title_en",
      "title_pt",
      10,
    );

    const aboutEn = cell(about.text_en);
    const aboutPt = cell(about.text_pt) || aboutEn;
    const contactName = cell(contactProfile.full_name);
    const contactPhone = cell(contactProfile.phone);
    const contactAddressEn = cell(contactProfile.location_en);
    const contactAddressPt =
      cell(contactProfile.location_pt) || contactAddressEn;
    const bosch =
      (state.companies || []).find((row) => cell(row.id) === "bosch-brasil") ||
      {};
    const siteAddress = (notes, markers) => {
      const text = cell(notes);
      for (const marker of markers) {
        const idx = text.indexOf(marker);
        if (idx >= 0) return text.slice(idx + marker.length).trim();
      }
      return "";
    };
    const boschAddressEn = siteAddress(bosch.notes_en, [
      "Site address:",
      "Endereço do site:",
    ]);
    const boschAddressPt =
      siteAddress(bosch.notes_pt, ["Endereço do site:", "Site address:"]) ||
      boschAddressEn;
    const hungary =
      (state.experience || []).find(
        (row) => cell(row.id) === "bosch-hu-digitization-2019",
      ) || {};
    const budapestEn = cell(hungary.location_en);
    const budapestPt = cell(hungary.location_pt) || budapestEn;
    const contactItems = [
      {
        id: "contact-name",
        label: "Name",
        en: contactName,
        pt: contactName,
        hay: `name nome ${contactName}`.toLowerCase(),
      },
      {
        id: "contact-address",
        label: "Address",
        en: contactAddressEn,
        pt: contactAddressPt,
        hay: `address endereço endereco location ${contactAddressEn} ${contactAddressPt}`.toLowerCase(),
      },
      {
        id: "contact-phone",
        label: "Phone",
        en: contactPhone,
        pt: contactPhone,
        hay: `phone number telefone número numero ${contactPhone}`.toLowerCase(),
      },
      {
        id: "contact-linkedin",
        label:
          cell(contactProfile.linkedin_label_en) ||
          cell(contactProfile.linkedin_label_pt) ||
          "LinkedIn",
        en: cell(contactProfile.linkedin_url),
        pt: cell(contactProfile.linkedin_url),
        hay: `linkedin profile perfil ${cell(contactProfile.linkedin_url)}`.toLowerCase(),
      },
      {
        id: "contact-lattes",
        label:
          cell(contactProfile.lattes_label_en) ||
          cell(contactProfile.lattes_label_pt) ||
          "Lattes",
        en: cell(contactProfile.lattes_url),
        pt: cell(contactProfile.lattes_url),
        hay: `lattes cnpq curriculum curriculo ${cell(contactProfile.lattes_url)}`.toLowerCase(),
      },
      {
        id: "contact-orcid",
        label:
          cell(contactProfile.orcid_label_en) ||
          cell(contactProfile.orcid_label_pt) ||
          "ORCID",
        en: cell(contactProfile.orcid_url),
        pt: cell(contactProfile.orcid_url),
        hay: `orcid researcher id ${cell(contactProfile.orcid_url)}`.toLowerCase(),
      },
      {
        id: "contact-bosch-campinas",
        label: "Bosch Campinas",
        en: boschAddressEn,
        pt: boschAddressPt,
        hay: `bosch address endereço endereco site campinas ${boschAddressEn} ${boschAddressPt}`.toLowerCase(),
      },
      {
        id: "contact-bosch-budapest",
        label: "Bosch Budapest",
        en: budapestEn,
        pt: budapestPt,
        hay: `bosch budapest hungary hungria utca address endereço ${budapestEn} ${budapestPt}`.toLowerCase(),
      },
    ].filter((item) => item.en || item.pt);
    const sections = [
      {
        titleEn: "Contact",
        headingId: "",
        span: 12,
        layout: "pills",
        copy: true,
        items: contactItems,
      },
      {
        titleEn: "About",
        headingId: "about-heading",
        span: 12,
        layout: "prose",
        items: about.id
          ? [
              { id: about.id, en: aboutEn, pt: aboutPt, hay: rowHay(about) },
            ].filter((x) => x.en || x.pt)
          : [],
      },
      {
        titleEn: "Target titles",
        headingId: "titles-heading",
        span: 4,
        layout: "pills",
        items: titles,
      },
      {
        titleEn: "Languages",
        headingId: "languages-heading",
        span: 4,
        layout: "pills",
        items: languages.filter((x) => x.en || x.pt),
      },
      {
        titleEn: "Education",
        headingId: "education-heading",
        span: 4,
        layout: "pills",
        items: education,
      },
      {
        titleEn: "Experience",
        headingId: "experience-heading",
        span: 6,
        layout: "pills",
        items: experience.filter((x) => x.en || x.pt),
      },
      {
        titleEn: "Projects",
        headingId: "projects-heading",
        span: 6,
        layout: "pills",
        items: projects,
      },
      {
        titleEn: "Competences / skills",
        headingId: "competences-heading",
        span: 12,
        layout: "pills",
        items: competences,
      },
      {
        titleEn: "Courses",
        headingId: "courses-heading",
        span: 6,
        layout: "pills",
        items: courses,
      },
      {
        titleEn: "Licenses & certifications",
        headingId: "certifications-heading",
        span: 6,
        layout: "pills",
        items: certifications,
      },
      {
        titleEn: "Recognitions",
        headingId: "recognitions-heading",
        span: 6,
        layout: "pills",
        items: recognitions,
      },
      {
        titleEn: "Volunteering",
        headingId: "volunteering-heading",
        span: 6,
        layout: "pills",
        items: volunteering,
      },
    ];

    const parts = profileQueryParts();
    const { scopeWords, contentWords } = splitProfileQuery(parts);
    const itemWords = scopeWords.length ? contentWords : parts;
    const visible = [];
    for (const sec of sections) {
      const isSkills = sec.headingId === "competences-heading";
      const titles = sec.headingId
        ? SECTION_SEARCH_TITLES[HEADING_COLLECTION[sec.headingId]] || []
        : ["Contact"];
      const inScope =
        !parts.length ||
        !scopeWords.length ||
        scopeWords.some((part) => partMatchesTitles(part, titles));
      if (parts.length && !inScope) continue;
      const items = !itemWords.length
        ? sec.items
        : sec.items.filter((item) =>
            textHasParts(item.hay || `${item.en}\n${item.pt}`, itemWords),
          );
      if (parts.length) {
        if (!items.length) continue;
      } else if (!items.length && !isSkills) {
        continue;
      }
      const titleMatch =
        scopeWords.length > 0 &&
        inScope &&
        scopeWords.some((part) => partMatchesTitles(part, titles));
      visible.push({ ...sec, items, titleMatch });
    }

    if (parts.length && !visible.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Nothing on the profile map matches.";
      root.append(empty);
      profileMapScrolledQuery = "";
      return;
    }

    const grid = document.createElement("div");
    grid.className = "profile-summary-grid profile-map-grid";
    const rendered = [];

    for (const sec of visible) {
      const isSkills = sec.headingId === "competences-heading";
      const isProse = sec.layout === "prose";
      const card = document.createElement("article");
      card.className =
        "profile-summary-card profile-map-card profile-summary-span-" +
        (sec.span || 6) +
        (isProse ? " is-prose" : " is-pills") +
        (isSkills ? " is-skills" : "");

      const head = document.createElement("div");
      head.className = "profile-summary-card-head";
      const h = document.createElement(sec.copy ? "h3" : "button");
      if (!sec.copy) h.type = "button";
      h.className =
        "profile-summary-card-title" +
        (sec.copy ? "" : " profile-map-section-btn");
      h.textContent = sec.titleEn;
      if (!sec.copy) {
        h.title = `Jump to ${sec.titleEn}`;
        h.addEventListener("click", () =>
          jumpToProfileTarget({ headingId: sec.headingId }),
        );
      }
      head.append(h);
      if (isSkills) {
        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "profile-summary-add-skill";
        addBtn.textContent = "+ Add skill";
        addBtn.title = "Add a skill to your profile";
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          promptAddSkill();
        });
        head.append(addBtn);
      }
      card.append(head);

      if (sec.copy) {
        const wrap = document.createElement("div");
        wrap.className = "profile-summary-pills";
        const mode = getLangMode();
        const langs =
          mode === "both" ? ["en", "pt"] : [mode === "pt" ? "pt" : "en"];
        const seen = new Set();
        for (const item of sec.items) {
          for (const lang of langs) {
            const text =
              lang === "pt" ? item.pt || item.en : item.en || item.pt;
            const key = `${item.id}:${text}`;
            if (!text || seen.has(key)) continue;
            seen.add(key);
            const showLang = langs.length > 1 && item.en !== item.pt;
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className =
              "profile-summary-pill profile-map-item profile-map-copy";
            const label = document.createElement("span");
            label.className = "profile-map-copy-label";
            label.textContent = showLang
              ? `${item.label} ${lang.toUpperCase()}`
              : item.label;
            const value = document.createElement("span");
            value.textContent = text;
            btn.append(label, value);
            btn.title = `Copy ${item.label}`;
            btn.addEventListener("click", () => copyProfileValue(text, btn));
            wrap.append(btn);
          }
        }
        card.append(wrap);
        grid.append(card);
        rendered.push({
          card,
          titleMatch: sec.titleMatch,
          headingId: sec.headingId,
        });
        continue;
      }

      const cols = document.createElement("div");
      cols.className =
        "profile-summary-cols" +
        (isProse ? "" : " profile-summary-cols--pills");

      const mode = getLangMode();
      const addCol = (lang) => {
        const col = document.createElement("div");
        col.className =
          "profile-summary-col " +
          (lang === "pt" ? "profile-summary-pt" : "profile-summary-en");
        const langLabel = document.createElement("div");
        langLabel.className = "profile-summary-lang";
        langLabel.textContent = lang === "pt" ? "PT" : "EN";
        col.append(langLabel);

        const items = sec.items
          .map((item) => ({
            id: item.id,
            text: lang === "pt" ? item.pt || item.en : item.en || item.pt,
          }))
          .filter((x) => x.text);

        if (isProse && items.length === 1) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "profile-map-item profile-map-item-block";
          btn.textContent = items[0].text;
          btn.title = `Jump to ${sec.titleEn}`;
          btn.addEventListener("click", () =>
            jumpToProfileTarget({
              headingId: sec.headingId,
              rowId: items[0].id,
            }),
          );
          col.append(btn);
        } else {
          const wrap = document.createElement("div");
          wrap.className = "profile-summary-pills";
          for (const item of items) {
            if (isSkills) {
              const chip = document.createElement("span");
              chip.className = "profile-summary-pill-wrap";
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "profile-summary-pill profile-map-item";
              btn.textContent = item.text;
              btn.title = `Jump to edit · ${item.text}`;
              btn.addEventListener("click", () =>
                jumpToProfileTarget({
                  headingId: sec.headingId,
                  rowId: item.id,
                }),
              );
              const rm = document.createElement("button");
              rm.type = "button";
              rm.className = "profile-summary-pill-remove";
              rm.setAttribute("aria-label", `Remove ${item.text}`);
              rm.title = `Remove ${item.text}`;
              rm.textContent = "×";
              rm.addEventListener("click", (e) => {
                e.stopPropagation();
                removeCompetence(item.id);
              });
              chip.append(btn, rm);
              wrap.append(chip);
            } else {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "profile-summary-pill profile-map-item";
              btn.textContent = item.text;
              btn.title = `Jump to this ${sec.titleEn.slice(0, -1) || "item"}`;
              btn.addEventListener("click", () =>
                jumpToProfileTarget({
                  headingId: sec.headingId,
                  rowId: item.id,
                }),
              );
              wrap.append(btn);
            }
          }
          if (isSkills && lang === (mode === "pt" ? "pt" : "en")) {
            const addPill = document.createElement("button");
            addPill.type = "button";
            addPill.className = "profile-summary-pill is-add";
            addPill.textContent = "+ Add";
            addPill.title = "Add a skill";
            addPill.addEventListener("click", () => promptAddSkill());
            wrap.append(addPill);
          }
          col.append(wrap);
        }
        cols.append(col);
      };

      if (mode === "both" || mode === "en") addCol("en");
      if (mode === "both" || mode === "pt") addCol("pt");

      card.append(cols);
      grid.append(card);
      rendered.push({
        card,
        titleMatch: sec.titleMatch,
        headingId: sec.headingId,
      });
    }

    root.append(grid);

    const titleHits = rendered.filter((entry) => entry.titleMatch);
    const only = rendered.length === 1 ? rendered[0] : null;
    const scrollCard =
      only?.card || (titleHits.length === 1 ? titleHits[0].card : null);
    const queryKey = parts.join(" ");
    if (scrollCard && profileMapScrolledQuery !== queryKey) {
      profileMapScrolledQuery = queryKey;
      const headingId = only?.headingId || "";
      requestAnimationFrame(() => {
        const pageHeading = headingId
          ? document.getElementById(headingId)
          : null;
        const pageSection = pageHeading?.closest(".section");
        const el =
          pageHeading && pageSection && !pageSection.hidden
            ? pageHeading
            : scrollCard;
        const offset = 8;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      });
    } else if (!scrollCard) {
      profileMapScrolledQuery = "";
    }
  }

  function wireAddButtons() {
    document.querySelectorAll("[data-add-collection]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const collection = btn.getAttribute("data-add-collection");
        if (!SECTION_META[collection]?.canAdd) return;
        if (collection === "competences") {
          addCompetence();
          return;
        }
        if (collection === "companies") {
          companyCategoryFilter = "";
          companyRoleFilter = "";
        }
        state[collection].push(blankRow(collection));
        setDirty(true);
        setSaveStatus("");
        if (collection === "targetTitles") {
          renderProfileSummary();
        }
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

  async function loadContact() {
    try {
      const res = await fetch("/api/prompt-context");
      if (!res.ok) return;
      const payload = await res.json();
      contactProfile = (payload.profile || [])[0] || {};
    } catch {
      contactProfile = {};
    }
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
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections: state }),
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

  function sectionsAreCollapsed() {
    return document.body.classList.contains("sections-collapsed");
  }

  function syncSectionsToggleBtn() {
    const btn = document.getElementById("sections-collapse-btn");
    if (!btn) return;
    const collapsed = sectionsAreCollapsed();
    btn.setAttribute("aria-pressed", collapsed ? "true" : "false");
    btn.classList.toggle("is-active", collapsed);
    btn.title = collapsed
      ? "Expand all profile sections (Shift+E)"
      : "Collapse all profile sections (Shift+E)";
    const en = btn.querySelector(".sections-collapse-label");
    if (en) en.textContent = collapsed ? "Expand" : "Collapse";
  }

  function clearSectionOpenFlags() {
    document
      .querySelectorAll("main > .section.is-open")
      .forEach((section) => section.classList.remove("is-open"));
  }

  function setSectionsCollapsed(collapsed) {
    document.body.classList.toggle("sections-collapsed", !!collapsed);
    document.body.classList.toggle("panels-collapsed", !!collapsed);
    document.body.setAttribute("aria-expanded", collapsed ? "false" : "true");
    clearSectionOpenFlags();
    syncSectionsToggleBtn();
  }

  function togglePanelsCollapsed() {
    setSectionsCollapsed(!sectionsAreCollapsed());
  }

  function initSectionAccordionClicks() {
    document.querySelector("main")?.addEventListener("click", (event) => {
      if (!sectionsAreCollapsed()) return;
      const head = event.target.closest(".section-head");
      if (!head) return;
      const section = head.closest("main > .section");
      if (!section) return;
      if (event.target.closest("a, button, input, textarea, select, label")) {
        return;
      }
      event.preventDefault();
      section.classList.toggle("is-open");
    });
  }

  function scrollProfileToTop() {
    if (window.CardNav?.goHome()) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function initKeyboard() {
    document.addEventListener("keydown", (event) => {
      const mod = event.ctrlKey || event.metaKey;
      const typing = isTypingTarget(document.activeElement);

      if (
        event.altKey &&
        !mod &&
        !event.shiftKey &&
        (event.code === "KeyM" || (event.key || "").toLowerCase() === "m")
      ) {
        event.preventDefault();
        event.stopPropagation();
        pinFocusedProfileRecord();
        return;
      }

      if (event.key === "Escape") {
        const resumeDialog = document.getElementById("resume-viewer-modal");
        if (resumeDialog && resumeDialog.open) {
          closeResumeViewer();
          return;
        }
        if (
          profileQuery.trim() ||
          searchBarEl()?.classList.contains("is-open")
        ) {
          event.preventDefault();
          clearProfileSearch();
          return;
        }
        if (hasActiveProfileFilters()) {
          event.preventDefault();
          clearProfileFilters();
          return;
        }
        event.preventDefault();
        openJobsWindow();
        return;
      }

      if (event.altKey && !mod && !event.shiftKey) {
        const isF =
          event.code === "KeyF" || (event.key || "").toLowerCase() === "f";
        if (isF) {
          event.preventDefault();
          event.stopPropagation();
          window.CardNav?.toggleFiltersMain(
            "#path-filters",
            "main .field-input",
          );
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
      }

      // Alt+E opens the Chrome menu and Ctrl+E focuses the address bar.
      // Alt+Shift+U / Alt+Shift+X are unused there.
      if (event.altKey && event.shiftKey && !mod) {
        if (event.code === "KeyU") {
          event.preventDefault();
          event.stopPropagation();
          jumpToFirstProfileRecord("education");
          return;
        }
        if (event.code === "KeyX") {
          event.preventDefault();
          event.stopPropagation();
          jumpToFirstProfileRecord("experience");
          return;
        }
      }

      if (!event.shiftKey || mod || event.altKey || typing) {
        return;
      }

      if (event.code === "Digit1" || event.code === "Numpad1") {
        event.preventDefault();
        setLangMode("pt", true);
        return;
      }
      if (event.code === "Digit2" || event.code === "Numpad2") {
        event.preventDefault();
        setLangMode("en", true);
        return;
      }
      if (event.code === "Digit0" || event.code === "Numpad0") {
        event.preventDefault();
        setLangMode("both", true);
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
        return;
      }
      if (event.key.toLowerCase() === "a") {
        event.preventDefault();
        location.assign("/advice.html");
      }
    });
  }

  function initLangMode() {
    let mode = "en";
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
      downloadsCache = {
        items: payload.items || [],
        policy: payload.resume_policy || null,
      };
      renderDownloads(downloadsCache.items, downloadsCache.policy);
    } catch (err) {
      downloadsCache = { items: [], policy: null };
      const p = document.createElement("p");
      p.className = "downloads-error";
      p.textContent =
        "Could not load downloads: " + (err.message || String(err));
      root.append(p);
    }
  }

  function openResumeViewer(item) {
    const dialog = document.getElementById("resume-viewer-modal");
    const frame = document.getElementById("resume-viewer-frame");
    const title = document.getElementById("resume-viewer-title");
    const dl = document.getElementById("resume-viewer-download");
    const copyBtn = document.getElementById("resume-viewer-copy-path");
    if (!dialog || !frame || !title || !dl) return;
    const pages = item.page_count != null ? ` · ${item.page_count} page` : "";
    title.textContent = `${item.label_en} · ${item.lang.toUpperCase()}${pages}`;
    frame.src = item.view_url || item.url + "?inline=1";
    dl.href = item.url;
    dl.setAttribute("download", item.filename);
    const absPath = String(item.abs_path || "").trim();
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

  function wireResumeViewer() {
    const dialog = document.getElementById("resume-viewer-modal");
    const closeBtn = document.getElementById("resume-viewer-close");
    const copyBtn = document.getElementById("resume-viewer-copy-path");
    if (closeBtn) closeBtn.addEventListener("click", () => closeResumeViewer());
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const path = String(copyBtn.dataset.path || "").trim();
        if (!path) return;
        copyWithFeedback(path, copyBtn);
      });
    }
    if (dialog) {
      dialog.addEventListener("close", () => {
        const frame = document.getElementById("resume-viewer-frame");
        if (frame) frame.src = "about:blank";
      });
      dialog.addEventListener("click", (e) => {
        if (e.target === dialog) closeResumeViewer();
      });
    }
  }

  function renderDownloads(items, policy) {
    const root = document.getElementById("downloads-root");
    if (!root) return;
    root.replaceChildren();

    const order = [
      "digital-solution-architect",
      "data-analyst",
      "product-owner",
      "general",
    ].filter((variant) => matchesPathFilter(variant));
    const byVariant = {};
    for (const item of items) {
      if (!matchesPathFilter(item.variant)) continue;
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
      if (window.CareerPathIcons) {
        heading.append(
          window.CareerPathIcons.labelWithIcon(variant, group[0].label_en),
        );
      } else {
        heading.textContent = group[0].label_en;
      }
      card.append(heading);

      const resumes = group.filter((i) => i.kind === "resume");
      const portfolios = group.filter((i) => i.kind === "portfolio");

      card.append(
        buildDownloadRow("Resume", resumes, { isResume: true, policy }),
      );
      card.append(
        buildDownloadRow("Portfolio", portfolios, { isResume: false }),
      );
      root.append(card);
    }

    if (!root.childElementCount) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = pathFilter
        ? "No resumes or portfolios for this career path."
        : "No resume or portfolio files found.";
      root.append(empty);
    }
  }

  function buildDownloadRow(labelEn, items, opts) {
    const row = document.createElement("div");
    row.className = "download-row";
    const label = document.createElement("div");
    label.className = "download-row-label";
    const en = document.createElement("span");
    en.className = "field-label-en";
    en.textContent = labelEn;
    label.append(en);
    if (opts?.isResume) {
      const hint = document.createElement("span");
      hint.className = "download-row-hint";
      hint.textContent = "1-page limit";
      label.append(hint);
    }
    row.append(label);

    const actions = document.createElement("div");
    actions.className = "download-actions";
    const mode = getLangMode();
    const filtered =
      mode === "both"
        ? items || []
        : (items || []).filter(
            (item) => String(item.lang || "").toLowerCase() === mode,
          );
    for (const item of filtered) {
      const group = document.createElement("div");
      group.className = "download-lang-group";

      const viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.className =
        "download-btn download-btn-view" + (item.available ? "" : " missing");
      viewBtn.textContent = `View ${item.lang.toUpperCase()}`;
      if (!item.available) {
        viewBtn.disabled = true;
        viewBtn.title = "PDF not found — run python scripts/build_outputs.py";
      } else {
        if (item.page_count != null) {
          viewBtn.title = `${item.filename} · ${item.page_count} page(s)`;
          if (opts?.isResume && item.one_page_ok === false) {
            viewBtn.classList.add("page-over");
          } else if (opts?.isResume && item.one_page_ok === true) {
            viewBtn.classList.add("page-ok");
          }
        } else {
          viewBtn.title = item.filename;
        }
        viewBtn.addEventListener("click", () => openResumeViewer(item));
      }
      group.append(viewBtn);

      if (opts?.isResume && item.page_count != null) {
        const badge = document.createElement("span");
        badge.className =
          "page-count-badge" +
          (item.one_page_ok === false
            ? " is-bad"
            : item.one_page_ok
              ? " is-ok"
              : "");
        badge.textContent = `${item.page_count}p`;
        group.append(badge);
      }

      actions.append(group);
    }
    if (!filtered.length) {
      const empty = document.createElement("span");
      empty.className = "download-btn missing";
      empty.textContent = mode === "both" ? "—" : mode.toUpperCase();
      empty.title =
        mode === "both"
          ? "No files for this variant"
          : `No ${mode.toUpperCase()} file for this variant`;
      actions.append(empty);
    }
    row.append(actions);
    return row;
  }

  async function init() {
    initLangMode();
    initDetailMode();
    initPathFilter();
    wireResumeViewer();
    document
      .getElementById("detail-mode-summary")
      ?.addEventListener("click", () => {
        if (!detailMode) return;
        setDetailMode(false, true);
      });
    document
      .getElementById("detail-mode-detail")
      ?.addEventListener("click", () => {
        if (detailMode) return;
        setDetailMode(true, true);
      });
    document
      .getElementById("sections-collapse-btn")
      ?.addEventListener("click", () => togglePanelsCollapsed());
    initSectionAccordionClicks();
    syncSectionsToggleBtn();
    const openCompaniesBtn = document.getElementById("open-companies-btn");
    if (openCompaniesBtn) {
      openCompaniesBtn.addEventListener("click", () => openCompaniesWindow());
    }
    const openPortalsBtn = document.getElementById("open-portals-btn");
    if (openPortalsBtn) {
      openPortalsBtn.addEventListener("click", () => openPortalsWindow());
    }
    const openJobsBtn = document.getElementById("open-jobs-btn");
    if (openJobsBtn) {
      openJobsBtn.addEventListener("click", () => openJobsWindow());
    }
    document
      .getElementById("open-help-btn")
      ?.addEventListener("click", () => location.assign("/help.html"));
    document
      .getElementById("open-advice-btn")
      ?.addEventListener("click", () => location.assign("/advice.html"));
    document
      .getElementById("scroll-top-btn")
      ?.addEventListener("click", () => scrollProfileToTop());
    const search = searchInputEl();
    if (search) {
      search.addEventListener("input", () => {
        profileQuery = search.value;
        renderProfileSearch();
        if ((search.value || "").trim()) showSearchBar();
      });
      search.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        clearProfileSearch();
      });
      search.addEventListener("blur", () => {
        if (!(search.value || "").trim()) hideSearchBar();
      });
    }
    wireAddButtons();
    window.CardNav?.configureHome("main .panel[data-id]", "#path-filters");
    initKeyboard();
    window.addEventListener("beforeunload", () => {
      flushSaveKeepalive();
    });

    try {
      await loadState();
      await loadContact();
      renderAll();
      setDirty(false);
      setSaveStatus("");
    } catch (err) {
      setSaveStatus("Load error: " + (err.message || String(err)), "err");
    }
    await loadDownloads();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
