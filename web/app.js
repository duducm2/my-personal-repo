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
    "hiringPeople",
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
        "hiringPeople",
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
    "fit_ux_researcher",
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
      "fantasy_name_en",
      "fantasy_name_pt",
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
      "fit_ux_researcher",
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
    hiringPeople: [
      "id",
      "sort_order",
      "pinned",
      "kind",
      "company_key",
      "company_name",
      "full_name",
      "headline",
      "linkedin_url",
      "hiring_for",
      "opening_ids",
      "location",
      "status",
      "notes",
      "found_on",
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
      { label: "projectFantasyName", pt: "fantasy_name_pt", en: "fantasy_name_en" },
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
      {
        label: "fitUxResearcher",
        mono: "fit_ux_researcher",
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
      key: "ux-researcher",
      short: "UXR",
      en: "UX Researcher & Design Technologist",
      pt: "Pesquisador de UX e Design Technologist",
    },
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
  ];

  const COMPANY_ROLES = [
    {
      key: "uxr",
      field: "fit_ux_researcher",
      shortEn: "UXR",
      shortPt: "UXR",
      en: "UX Researcher",
      pt: "UX Researcher",
    },
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

  let downloadsCache = { items: [], policy: null, priority: null };
  let deliverablesCache = null;
  let portfolioImagesCache = [];
  let currentEditorState = {
    variant: "ux-researcher",
    tab: "resume",
    dirty: false,
    saving: false,
  };

  async function fetchDeliverables() {
    const res = await fetch("/api/deliverables/content");
    if (!res.ok) throw new Error(`GET /api/deliverables/content failed (${res.status})`);
    deliverablesCache = await res.json();
    if (deliverablesCache?.deliverables?.portfolioImages) {
      portfolioImagesCache = deliverablesCache.deliverables.portfolioImages;
    }
    return deliverablesCache;
  }

  async function loadPortfolioImages() {
    try {
      await fetchDeliverables();
    } catch {
      /* ignore */
    }
  }

  function closeDeliverableEditor() {
    if (currentEditorState.dirty) {
      if (!confirm("You have unsaved changes in the Deliverable Editor. Are you sure you want to discard them?")) {
        return;
      }
    }
    const modal = document.getElementById("deliverable-edit-modal");
    if (modal && modal.open) modal.close();
    currentEditorState.dirty = false;
  }

  async function openDeliverableEditor(opts) {
    const modal = document.getElementById("deliverable-edit-modal");
    if (!modal) return;
    const variant = opts?.variant || currentEditorState.variant || "ux-researcher";
    const tab = opts?.tab || currentEditorState.tab || "resume";
    currentEditorState.variant = variant;
    currentEditorState.tab = tab;
    currentEditorState.dirty = false;

    if (typeof modal.showModal === "function" && !modal.open) {
      modal.showModal();
    }

    setDeliverableFooterStatus("Loading deliverable content…");
    try {
      await fetchDeliverables();
      renderDeliverableEditor();
      setDeliverableFooterStatus("Ready.");
    } catch (err) {
      setDeliverableFooterStatus("Error loading: " + (err.message || String(err)), "err");
    }
  }

  function setDeliverableFooterStatus(text, kind) {
    const el = document.getElementById("deliverable-footer-status");
    if (!el) return;
    el.textContent = text;
    el.className = "deliverable-footer-status" + (kind ? ` is-${kind}` : "");
  }

  function renderDeliverableEditor() {
    if (!deliverablesCache || !deliverablesCache.deliverables) return;
    const { variant, tab } = currentEditorState;
    const data = deliverablesCache.deliverables;
    const settings = deliverablesCache.resumeSettings || {};
    const maxPages = settings[variant] || 1;

    // 1. Sync Variant Pills
    document.querySelectorAll(".deliverable-variant-pills .variant-pill").forEach((btn) => {
      const active = btn.dataset.variant === variant;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });

    // 2. Sync Tab Buttons
    document.querySelectorAll(".deliverable-tabs-bar .deliverable-tab").forEach((btn) => {
      const active = btn.dataset.tab === tab;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    // 3. Sync Page Constraint Buttons & Badge
    const btn1p = document.getElementById("constraint-1p");
    const btn2p = document.getElementById("constraint-2p");
    const pageBadge = document.getElementById("deliverable-page-status");
    const constraintContainer = document.getElementById("page-constraint-container");

    if (constraintContainer) {
      constraintContainer.style.display = tab === "portfolio" ? "none" : "inline-flex";
    }
    if (btn1p) btn1p.classList.toggle("is-active", maxPages === 1);
    if (btn2p) btn2p.classList.toggle("is-active", maxPages === 2);

    const variantEntry = deliverablesCache.priorityIndex?.variants?.[variant];
    const actualPages = variantEntry?.pages ? `${variantEntry.pages.en || 1}p EN / ${variantEntry.pages.pt || 1}p PT` : `${maxPages}p`;
    if (pageBadge) {
      pageBadge.textContent = actualPages;
      const ok = variantEntry?.page_limit_ok !== false;
      pageBadge.className = `page-count-badge ${ok ? "is-ok" : "is-bad"}`;
    }

    // 4. Render Tab Content
    const body = document.getElementById("deliverable-edit-body");
    if (!body) return;
    body.replaceChildren();

    if (tab === "resume") {
      renderResumeTab(body, variant, data);
    } else if (tab === "portfolio") {
      renderPortfolioTab(body, variant, data);
    } else {
      renderSharedTab(body, data);
    }
  }

  function markDeliverableDirty() {
    currentEditorState.dirty = true;
    setDeliverableFooterStatus("Unsaved changes. Press Save & Regenerate (Ctrl+S).", "warn");
  }

  function renderInlineFormattedPreview(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }

  // --- Zero-Markdown WYSIWYG Rich Text Component ---
  function mdToHtml(mdText) {
    if (!mdText) return "";
    let s = String(mdText)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\n/g, "<br>");
    return s;
  }

  function htmlToMd(html) {
    if (!html) return "";
    const container = document.createElement("div");
    container.innerHTML = html;

    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || "";
      }
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return "";
      }
      const tag = node.tagName.toLowerCase();
      if (tag === "br") return "\n";
      if (tag === "strong" || tag === "b") {
        const inner = Array.from(node.childNodes).map(walk).join("").trim();
        return inner ? `**${inner}**` : "";
      }
      if (tag === "div" || tag === "p") {
        const inner = Array.from(node.childNodes).map(walk).join("");
        return (inner ? "\n" + inner : "");
      }
      return Array.from(node.childNodes).map(walk).join("");
    }

    let out = Array.from(container.childNodes).map(walk).join("");
    out = out.replace(/\n\n+/g, "\n").replace(/^\n+/, "").replace(/\n+$/, "");
    return out;
  }

  function createWysiwygInput(initialMd, onChange, opts) {
    const wrap = document.createElement("div");
    wrap.className = "wysiwyg-field-container";

    const toolbar = document.createElement("div");
    toolbar.className = "wysiwyg-toolbar";

    const bBtn = document.createElement("button");
    bBtn.type = "button";
    bBtn.className = "wysiwyg-btn";
    bBtn.innerHTML = "<strong>B</strong>";
    bBtn.title = "Bold (Ctrl+B)";

    const hint = document.createElement("span");
    hint.className = "wysiwyg-hint";
    hint.textContent = "Select text and click B (or press Ctrl+B) to bold";

    toolbar.append(bBtn, hint);
    wrap.append(toolbar);

    const editor = document.createElement("div");
    editor.className = "wysiwyg-editor" + (opts?.tall ? " is-tall" : "");
    editor.contentEditable = "true";
    editor.spellcheck = true;
    editor.dataset.placeholder = opts?.placeholder || "Type text here…";
    if (opts?.singleLine) {
      editor.dataset.singleLine = "true";
    }

    editor.innerHTML = mdToHtml(initialMd || "");

    const notify = () => {
      const md = htmlToMd(editor.innerHTML);
      onChange(md);
      markDeliverableDirty();
    };

    bBtn.onmousedown = (e) => {
      e.preventDefault();
      document.execCommand("bold", false, null);
      notify();
    };

    editor.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        document.execCommand("bold", false, null);
        notify();
      } else if (opts?.singleLine && e.key === "Enter") {
        e.preventDefault();
      }
    });

    editor.addEventListener("input", notify);
    editor.addEventListener("blur", notify);
    editor.addEventListener("keyup", notify);

    editor.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text/plain");
      document.execCommand("insertText", false, text);
      notify();
    });

    wrap.append(editor);

    return {
      element: wrap,
      getValue: () => htmlToMd(editor.innerHTML),
      setValue: (val) => {
        editor.innerHTML = mdToHtml(val || "");
      },
    };
  }

  // Slide-Aware Table Parser & Formatter for present_table
  function parsePresentTables(text) {
    if (!text || typeof text !== "string") {
      return { headers: ["Area", "Achievement"], rows: [] };
    }
    const lines = text.split("\n");
    const rows = [];
    let headers = ["Area", "Achievement"];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith("|")) continue;
      const parts = line.split("|").slice(1, -1).map((p) => p.trim());
      if (parts.length < 2) continue;
      // Skip separator dashes
      if (parts.every((p) => /^[-: ]+$/.test(p))) continue;
      // Skip header rows
      const lower0 = parts[0].toLowerCase();
      if (lower0 === "area" || lower0 === "área" || lower0.includes("competenc") || lower0.includes("role")) {
        headers = parts;
        continue;
      }
      rows.push({
        col1: parts[0].replace(/\\\|/g, "|"),
        col2: parts.slice(1).join(" | ").replace(/\\\|/g, "|"),
      });
    }
    return { headers, rows };
  }

  function formatPresentTables(headers, rows, lang) {
    const h1 = lang === "pt" ? "Área" : "Area";
    const h2 = lang === "pt" ? "Conquista" : "Achievement";
    if (!rows || rows.length === 0) {
      return `| ${h1} | ${h2} |\n|---|---|`;
    }

    const formatRow = (r) => {
      const c1 = (r.col1 || "").replace(/\n/g, " ").replace(/\|/g, "\\|").trim();
      const c2 = (r.col2 || "").replace(/\n/g, " ").replace(/\|/g, "\\|").trim();
      return `| ${c1} | ${c2} |`;
    };

    if (rows.length <= 5) {
      let md = `| ${h1} | ${h2} |\n|---|---|\n`;
      md += rows.map(formatRow).join("\n");
      return md.trim();
    }

    // Split across 2 slides with clean Marp slide separator and continuation header
    const first5 = rows.slice(0, 5);
    const rest = rows.slice(5);

    let md1 = `| ${h1} | ${h2} |\n|---|---|\n` + first5.map(formatRow).join("\n");
    const contTitle = lang === "pt"
      ? "## Presente – Liderança de Produto & Engenharia (continuação)"
      : "## Present – Product & Engineering Leadership (continued)";

    let md2 = `\n\n---\n\n<!-- _class: dense-content -->\n\n<style scoped>\ntable {\n  font-size: 0.88rem;\n}\n</style>\n\n${contTitle}\n\n| ${h1} | ${h2} |\n|---|---|\n` + rest.map(formatRow).join("\n");

    return (md1 + md2).trim();
  }

  function parseMarkdownBullets(text) {
    if (!text || typeof text !== "string") return [];
    return text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- ") || l.startsWith("* "))
      .map((l) => l.replace(/^[-*]\s+/, ""));
  }

  function formatMarkdownBullets(bullets) {
    return (bullets || [])
      .map((b) => b.trim())
      .filter(Boolean)
      .map((b) => `- ${b}`)
      .join("\n");
  }

  function createBilingualInputRow(labelEn, valueEn, valuePt, onChange, opts) {
    const row = document.createElement("div");
    row.className = "deliverable-edit-field-group" + (opts?.tall ? " is-tall" : "");

    const header = document.createElement("div");
    header.className = "deliverable-field-header";
    const title = document.createElement("strong");
    title.textContent = labelEn;
    header.append(title);
    if (opts?.badge) {
      const b = document.createElement("span");
      b.className = "field-badge";
      b.textContent = opts.badge;
      header.append(b);
    }
    row.append(header);

    const inputsWrap = document.createElement("div");
    inputsWrap.className = "deliverable-inputs-grid";

    let valEn = (valueEn || "").replace(/\\\|/g, "|");
    let valPt = (valuePt || "").replace(/\\\|/g, "|");

    const notify = () => {
      onChange(valEn, valPt);
      markDeliverableDirty();
    };

    // EN input
    const enCol = document.createElement("div");
    enCol.className = "deliverable-input-col";
    const enTag = document.createElement("span");
    enTag.className = "lang-tag";
    enTag.textContent = "EN";
    enCol.append(enTag);

    const enEditor = createWysiwygInput(
      valEn,
      (newEn) => {
        valEn = newEn;
        notify();
      },
      { tall: opts?.tall, singleLine: !opts?.tall, placeholder: "English text…" }
    );
    enCol.append(enEditor.element);

    // PT input
    const ptCol = document.createElement("div");
    ptCol.className = "deliverable-input-col";
    const ptTag = document.createElement("span");
    ptTag.className = "lang-tag";
    ptTag.textContent = "PT";
    ptCol.append(ptTag);

    const ptEditor = createWysiwygInput(
      valPt,
      (newPt) => {
        valPt = newPt;
        notify();
      },
      { tall: opts?.tall, singleLine: !opts?.tall, placeholder: "Texto em português…" }
    );
    ptCol.append(ptEditor.element);

    inputsWrap.append(enCol, ptCol);
    row.append(inputsWrap);
    return row;
  }

  function createStructuredTableEditor(label, valueEn, valuePt, onChange) {
    const block = document.createElement("div");
    block.className = "structured-editor-block";

    const head = document.createElement("div");
    head.className = "structured-editor-head";

    const title = document.createElement("h4");
    title.textContent = label;

    const tip = document.createElement("p");
    tip.className = "structured-editor-tip";
    tip.textContent = "Structured achievements: edit Domain and Impact separately with rich-text bolding (no markdown | pipes or --- slide breaks).";

    head.append(title, tip);
    block.append(head);

    const parsedEn = parsePresentTables(valueEn);
    const parsedPt = parsePresentTables(valuePt);

    const maxRows = Math.max(parsedEn.rows.length, parsedPt.rows.length, 1);
    const rowsEn = [...parsedEn.rows];
    const rowsPt = [...parsedPt.rows];
    while (rowsEn.length < maxRows) rowsEn.push({ col1: "", col2: "" });
    while (rowsPt.length < maxRows) rowsPt.push({ col1: "", col2: "" });

    const rowsContainer = document.createElement("div");
    rowsContainer.className = "structured-table-rows";

    const syncAndNotify = () => {
      const outEn = formatPresentTables(parsedEn.headers, rowsEn, "en");
      const outPt = formatPresentTables(parsedPt.headers, rowsPt, "pt");
      onChange(outEn, outPt);
      markDeliverableDirty();
    };

    const renderRowCards = () => {
      rowsContainer.replaceChildren();
      rowsEn.forEach((rowEn, index) => {
        const rowPt = rowsPt[index] || { col1: "", col2: "" };

        // Visual divider when rows split into Slide 6 continuation
        if (index === 5) {
          const divider = document.createElement("div");
          divider.style.cssText = "grid-column: 1 / -1; padding: 6px 12px; margin: 8px 0; background: color-mix(in srgb, var(--gold) 15%, transparent); border: 1px dashed var(--gold); border-radius: 4px; font-size: 11px; font-weight: 600; color: var(--gold); text-align: center;";
          divider.textContent = "▼ Slides Break: Rows below automatically continue on Slide 6 ▼";
          rowsContainer.append(divider);
        }

        const card = document.createElement("div");
        card.className = "structured-table-row-card";

        const cardHead = document.createElement("div");
        cardHead.className = "structured-table-row-head";

        const num = document.createElement("span");
        num.className = "structured-row-num";
        num.textContent = `Achievement #${index + 1}: ${rowEn.col1 || "Area"}`;

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "structured-row-delete-btn";
        delBtn.textContent = "✕ Remove";
        delBtn.title = "Delete this achievement row";
        delBtn.onclick = () => {
          rowsEn.splice(index, 1);
          rowsPt.splice(index, 1);
          renderRowCards();
          syncAndNotify();
        };

        cardHead.append(num, delBtn);
        card.append(cardHead);

        const inputsGrid = document.createElement("div");
        inputsGrid.className = "structured-row-inputs";

        // EN inputs (Area + Impact)
        const enPair = document.createElement("div");
        enPair.className = "structured-field-pair";

        const enAreaRow = document.createElement("div");
        enAreaRow.className = "structured-field-row";
        const enTag1 = document.createElement("span");
        enTag1.className = "lang-tag";
        enTag1.textContent = "EN";
        const enAreaInput = document.createElement("input");
        enAreaInput.type = "text";
        enAreaInput.placeholder = "Focus Area / Domain…";
        enAreaInput.value = rowEn.col1 || "";
        enAreaInput.oninput = () => {
          rowEn.col1 = enAreaInput.value;
          num.textContent = `Achievement #${index + 1}: ${rowEn.col1 || "Area"}`;
          syncAndNotify();
        };
        enAreaRow.append(enTag1, enAreaInput);

        const enImpactWrap = document.createElement("div");
        const enImpactWysiwyg = createWysiwygInput(
          rowEn.col2 || "",
          (val) => {
            rowEn.col2 = val;
            syncAndNotify();
          },
          { tall: true, placeholder: "Impact, metrics, and evidence…" }
        );
        enImpactWrap.append(enImpactWysiwyg.element);

        enPair.append(enAreaRow, enImpactWrap);

        // PT inputs (Area + Impact)
        const ptPair = document.createElement("div");
        ptPair.className = "structured-field-pair";

        const ptAreaRow = document.createElement("div");
        ptAreaRow.className = "structured-field-row";
        const ptTag1 = document.createElement("span");
        ptTag1.className = "lang-tag";
        ptTag1.textContent = "PT";
        const ptAreaInput = document.createElement("input");
        ptAreaInput.type = "text";
        ptAreaInput.placeholder = "Área de Foco / Domínio…";
        ptAreaInput.value = rowPt.col1 || "";
        ptAreaInput.oninput = () => {
          rowPt.col1 = ptAreaInput.value;
          syncAndNotify();
        };
        ptAreaRow.append(ptTag1, ptAreaInput);

        const ptImpactWrap = document.createElement("div");
        const ptImpactWysiwyg = createWysiwygInput(
          rowPt.col2 || "",
          (val) => {
            rowPt.col2 = val;
            syncAndNotify();
          },
          { tall: true, placeholder: "Impacto, métricas e evidências…" }
        );
        ptImpactWrap.append(ptImpactWysiwyg.element);

        ptPair.append(ptAreaRow, ptImpactWrap);

        inputsGrid.append(enPair, ptPair);
        card.append(inputsGrid);
        rowsContainer.append(card);
      });
    };

    renderRowCards();
    block.append(rowsContainer);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "structured-add-row-btn";
    addBtn.textContent = "+ Add Achievement Row";
    addBtn.onclick = () => {
      rowsEn.push({ col1: "", col2: "" });
      rowsPt.push({ col1: "", col2: "" });
      renderRowCards();
      syncAndNotify();
    };
    block.append(addBtn);

    return block;
  }

  function createStructuredBulletsEditor(label, valueEn, valuePt, onChange) {
    const block = document.createElement("div");
    block.className = "structured-editor-block";

    const head = document.createElement("div");
    head.className = "structured-editor-head";

    const title = document.createElement("h4");
    title.textContent = label;

    const tip = document.createElement("p");
    tip.className = "structured-editor-tip";
    tip.textContent = "Bullet points: add key highlights with bold text formatting without typing markdown dashes (-).";

    head.append(title, tip);
    block.append(head);

    let bulletsEn = parseMarkdownBullets(valueEn);
    let bulletsPt = parseMarkdownBullets(valuePt);

    const maxItems = Math.max(bulletsEn.length, bulletsPt.length, 1);
    while (bulletsEn.length < maxItems) bulletsEn.push("");
    while (bulletsPt.length < maxItems) bulletsPt.push("");

    const listContainer = document.createElement("div");
    listContainer.className = "structured-table-rows";

    const syncAndNotify = () => {
      onChange(formatMarkdownBullets(bulletsEn), formatMarkdownBullets(bulletsPt));
      markDeliverableDirty();
    };

    const renderItems = () => {
      listContainer.replaceChildren();
      bulletsEn.forEach((itemEn, index) => {
        const itemPt = bulletsPt[index] || "";
        const card = document.createElement("div");
        card.className = "structured-bullet-item";

        const controls = document.createElement("div");
        controls.className = "structured-bullet-controls";

        const num = document.createElement("span");
        num.className = "structured-row-num";
        num.textContent = `Highlight #${index + 1}`;
        controls.append(num);

        const actions = document.createElement("div");
        actions.className = "bullet-item-controls";

        if (index > 0) {
          const upBtn = document.createElement("button");
          upBtn.type = "button";
          upBtn.className = "bullet-ctrl-btn";
          upBtn.textContent = "↑";
          upBtn.title = "Move up";
          upBtn.onclick = () => {
            const tmpEn = bulletsEn[index - 1];
            bulletsEn[index - 1] = bulletsEn[index];
            bulletsEn[index] = tmpEn;
            const tmpPt = bulletsPt[index - 1];
            bulletsPt[index - 1] = bulletsPt[index];
            bulletsPt[index] = tmpPt;
            renderItems();
            syncAndNotify();
          };
          actions.append(upBtn);
        }

        if (index < bulletsEn.length - 1) {
          const downBtn = document.createElement("button");
          downBtn.type = "button";
          downBtn.className = "bullet-ctrl-btn";
          downBtn.textContent = "↓";
          downBtn.title = "Move down";
          downBtn.onclick = () => {
            const tmpEn = bulletsEn[index + 1];
            bulletsEn[index + 1] = bulletsEn[index];
            bulletsEn[index] = tmpEn;
            const tmpPt = bulletsPt[index + 1];
            bulletsPt[index + 1] = bulletsPt[index];
            bulletsPt[index] = tmpPt;
            renderItems();
            syncAndNotify();
          };
          actions.append(downBtn);
        }

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "bullet-ctrl-btn is-delete";
        delBtn.textContent = "✕";
        delBtn.title = "Delete highlight";
        delBtn.onclick = () => {
          bulletsEn.splice(index, 1);
          bulletsPt.splice(index, 1);
          renderItems();
          syncAndNotify();
        };
        actions.append(delBtn);

        controls.append(actions);
        card.append(controls);

        const inputsGrid = document.createElement("div");
        inputsGrid.className = "structured-row-inputs";

        // EN
        const enCol = document.createElement("div");
        enCol.className = "structured-field-row";
        const enTag = document.createElement("span");
        enTag.className = "lang-tag";
        enTag.textContent = "EN";
        enCol.append(enTag);
        const enWysiwyg = createWysiwygInput(
          itemEn || "",
          (val) => {
            bulletsEn[index] = val;
            syncAndNotify();
          },
          { tall: true, placeholder: "Highlight in English…" }
        );
        enCol.append(enWysiwyg.element);

        // PT
        const ptCol = document.createElement("div");
        ptCol.className = "structured-field-row";
        const ptTag = document.createElement("span");
        ptTag.className = "lang-tag";
        ptTag.textContent = "PT";
        ptCol.append(ptTag);
        const ptWysiwyg = createWysiwygInput(
          itemPt || "",
          (val) => {
            bulletsPt[index] = val;
            syncAndNotify();
          },
          { tall: true, placeholder: "Destaque em português…" }
        );
        ptCol.append(ptWysiwyg.element);

        inputsGrid.append(enCol, ptCol);
        card.append(inputsGrid);
        listContainer.append(card);
      });
    };

    renderItems();
    block.append(listContainer);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "structured-add-row-btn";
    addBtn.textContent = "+ Add Highlight Bullet";
    addBtn.onclick = () => {
      bulletsEn.push("");
      bulletsPt.push("");
      renderItems();
      syncAndNotify();
    };
    block.append(addBtn);

    return block;
  }

  function createStructuredFutureCareerEditor(label, valueEn, valuePt, onChange) {
    const isBulletStyle = (valueEn || "").includes("Conduct UX Research") || !(valueEn || "").includes("|");

    if (isBulletStyle) {
      // UX Researcher format: leading heading + bullets
      const block = document.createElement("div");
      block.className = "structured-editor-block";

      const head = document.createElement("div");
      head.className = "structured-editor-head";
      const title = document.createElement("h4");
      title.textContent = "Future – UX Research & Design Rigor (Principles & Methodologies)";
      head.append(title);
      block.append(head);

      // Extract optional heading and bullets
      const extractHAndB = (txt) => {
        const lines = (txt || "").split("\n");
        let h = "";
        const b = [];
        for (const l of lines) {
          const trimmed = l.trim();
          if (trimmed.startsWith("## ")) {
            h = trimmed.replace(/^##\s+/, "");
          } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            b.push(trimmed.replace(/^[-*]\s+/, ""));
          }
        }
        return { h, b };
      };

      const parsedEn = extractHAndB(valueEn);
      const parsedPt = extractHAndB(valuePt);

      let hEn = parsedEn.h || "Future – How I Conduct UX Research & Design in High-Tech";
      let hPt = parsedPt.h || "Futuro – Como Conduzo Pesquisa e Design de UX em Alta Tecnologia";
      let bulletsEn = parsedEn.b;
      let bulletsPt = parsedPt.b;

      const syncAndNotify = () => {
        const outEn = `## ${hEn}\n\n` + formatMarkdownBullets(bulletsEn);
        const outPt = `## ${hPt}\n\n` + formatMarkdownBullets(bulletsPt);
        onChange(outEn, outPt);
        markDeliverableDirty();
      };

      const hRow = createBilingualInputRow("Slide Section Heading", hEn, hPt, (newEn, newPt) => {
        hEn = newEn;
        hPt = newPt;
        syncAndNotify();
      });
      block.append(hRow);

      const bulletsEditor = createStructuredBulletsEditor("Method Principles & Rigor Bullets", formatMarkdownBullets(bulletsEn), formatMarkdownBullets(bulletsPt), (newBEn, newBPt) => {
        bulletsEn = parseMarkdownBullets(newBEn);
        bulletsPt = parseMarkdownBullets(newBPt);
        syncAndNotify();
      });
      block.append(bulletsEditor);

      return block;
    }

    // Table progression variant (general, product-owner, data-analyst, digital-solution-architect)
    const block = document.createElement("div");
    block.className = "structured-editor-block";

    const head = document.createElement("div");
    head.className = "structured-editor-head";

    const title = document.createElement("h4");
    title.textContent = "Future Career Progression Steps";

    const tip = document.createElement("p");
    tip.className = "structured-editor-tip";
    tip.textContent = "Step-by-step career path progression. No markdown tables or HTML tags needed.";

    head.append(title, tip);
    block.append(head);

    const parsedEn = parsePresentTables(valueEn);
    const parsedPt = parsePresentTables(valuePt);

    const maxRows = Math.max(parsedEn.rows.length, parsedPt.rows.length, 1);
    const rowsEn = [...parsedEn.rows];
    const rowsPt = [...parsedPt.rows];
    while (rowsEn.length < maxRows) rowsEn.push({ col1: "", col2: "" });
    while (rowsPt.length < maxRows) rowsPt.push({ col1: "", col2: "" });

    const rowsContainer = document.createElement("div");
    rowsContainer.className = "structured-table-rows";

    const syncAndNotify = () => {
      // Re-wrap in the proper HTML/table structure expected by portfolio template
      const buildWrapped = (headers, rows, originalText, lang) => {
        const tMd = formatPresentTables(headers, rows, lang);
        // Preserve surrounding markup if present
        const match = (originalText || "").match(/([\s\S]*?<div class="future-[a-z0-9-]+-bullets">)[\s\S]*?(<\/div>[\s\S]*)/i);
        if (match) {
          return `${match[1]}\n\n${tMd}\n\n${match[2]}`;
        }
        return tMd;
      };

      const outEn = buildWrapped(parsedEn.headers, rowsEn, valueEn, "en");
      const outPt = buildWrapped(parsedPt.headers, rowsPt, valuePt, "pt");
      onChange(outEn, outPt);
      markDeliverableDirty();
    };

    const renderRowCards = () => {
      rowsContainer.replaceChildren();
      rowsEn.forEach((rowEn, index) => {
        const rowPt = rowsPt[index] || { col1: "", col2: "" };
        const card = document.createElement("div");
        card.className = "structured-table-row-card";

        const cardHead = document.createElement("div");
        cardHead.className = "structured-table-row-head";

        const num = document.createElement("span");
        num.className = "structured-row-num";
        num.textContent = `Career Stage #${index + 1}: ${rowEn.col1 || "Stage"}`;

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "structured-row-delete-btn";
        delBtn.textContent = "✕ Remove";
        delBtn.onclick = () => {
          rowsEn.splice(index, 1);
          rowsPt.splice(index, 1);
          renderRowCards();
          syncAndNotify();
        };

        cardHead.append(num, delBtn);
        card.append(cardHead);

        const inputsGrid = document.createElement("div");
        inputsGrid.className = "structured-row-inputs";

        // EN
        const enPair = document.createElement("div");
        enPair.className = "structured-field-pair";
        const enRow1 = document.createElement("div");
        enRow1.className = "structured-field-row";
        const enTag1 = document.createElement("span");
        enTag1.className = "lang-tag";
        enTag1.textContent = "EN";
        const enStepInput = document.createElement("input");
        enStepInput.type = "text";
        enStepInput.placeholder = "Stage name (e.g. Now, Next, Method)…";
        enStepInput.value = rowEn.col1 || "";
        enStepInput.oninput = () => {
          rowEn.col1 = enStepInput.value;
          num.textContent = `Career Stage #${index + 1}: ${rowEn.col1 || "Stage"}`;
          syncAndNotify();
        };
        enRow1.append(enTag1, enStepInput);

        const enRow2 = document.createElement("div");
        const enDescWysiwyg = createWysiwygInput(
          rowEn.col2 || "",
          (val) => {
            rowEn.col2 = val;
            syncAndNotify();
          },
          { tall: true, placeholder: "What it is / Evidence…" }
        );
        enRow2.append(enDescWysiwyg.element);
        enPair.append(enRow1, enRow2);

        // PT
        const ptPair = document.createElement("div");
        ptPair.className = "structured-field-pair";
        const ptRow1 = document.createElement("div");
        ptRow1.className = "structured-field-row";
        const ptTag1 = document.createElement("span");
        ptTag1.className = "lang-tag";
        ptTag1.textContent = "PT";
        const ptStepInput = document.createElement("input");
        ptStepInput.type = "text";
        ptStepInput.placeholder = "Nome da etapa (ex: Agora, Próximo, Método)…";
        ptStepInput.value = rowPt.col1 || "";
        ptStepInput.oninput = () => {
          rowPt.col1 = ptStepInput.value;
          syncAndNotify();
        };
        ptRow1.append(ptTag1, ptStepInput);

        const ptRow2 = document.createElement("div");
        const ptDescWysiwyg = createWysiwygInput(
          rowPt.col2 || "",
          (val) => {
            rowPt.col2 = val;
            syncAndNotify();
          },
          { tall: true, placeholder: "O que é / Evidência…" }
        );
        ptRow2.append(ptDescWysiwyg.element);
        ptPair.append(ptRow1, ptRow2);

        inputsGrid.append(enPair, ptPair);
        card.append(inputsGrid);
        rowsContainer.append(card);
      });
    };

    renderRowCards();
    block.append(rowsContainer);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "structured-add-row-btn";
    addBtn.textContent = "+ Add Career Step";
    addBtn.onclick = () => {
      rowsEn.push({ col1: "", col2: "" });
      rowsPt.push({ col1: "", col2: "" });
      renderRowCards();
      syncAndNotify();
    };
    block.append(addBtn);

    return block;
  }
  function renderResumeTab(container, variant, data) {
    const narratives = data.narratives || [];
    const bullets = data.experienceBullets || [];
    const skills = data.skills || [];
    const experience = data.experience || [];

    // Tagline and Profile
    const taglineRow = narratives.find((r) => r.variant === variant && r.field === "tagline") || {};
    const profileRow = narratives.find((r) => r.variant === variant && r.field === "profile") || {};

    const secTop = document.createElement("div");
    secTop.className = "deliverable-section-card";
    const hTop = document.createElement("h3");
    hTop.textContent = "Headline & Profile Summary";
    secTop.append(hTop);

    secTop.append(
      createBilingualInputRow("Tagline / Headline", taglineRow.text_en, taglineRow.text_pt, (en, pt) => {
        taglineRow.text_en = en;
        taglineRow.text_pt = pt;
      })
    );
    secTop.append(
      createBilingualInputRow("Profile Summary", profileRow.text_en, profileRow.text_pt, (en, pt) => {
        profileRow.text_en = en;
        profileRow.text_pt = pt;
      }, { tall: true })
    );
    container.append(secTop);

    // Bullets per experience role
    const secBullets = document.createElement("div");
    secBullets.className = "deliverable-section-card";
    const hBullets = document.createElement("h3");
    hBullets.textContent = "Work Experience Bullets";
    secBullets.append(hBullets);

    for (const exp of experience) {
      const expBlock = document.createElement("div");
      expBlock.className = "deliverable-exp-role-block";
      const expTitle = document.createElement("h4");
      expTitle.textContent = `${exp.title_en || exp.title_pt} @ ${exp.company} (${exp.date_display_en || exp.date_display_pt})`;
      expBlock.append(expTitle);

      const expBullets = bullets
        .filter((b) => b.experience_id === exp.id && b.variant === variant)
        .sort((a, b) => parseInt(a.sort_order || 0, 10) - parseInt(b.sort_order || 0, 10));

      const bulletsList = document.createElement("div");
      bulletsList.className = "deliverable-bullets-list";

      const renderBulletRows = () => {
        bulletsList.replaceChildren();
        expBullets.forEach((bullet, index) => {
          bullet.sort_order = String(index + 1);
          const bRow = document.createElement("div");
          bRow.className = "deliverable-bullet-item";

          const controlBar = document.createElement("div");
          controlBar.className = "bullet-item-controls";
          const num = document.createElement("span");
          num.className = "bullet-num";
          num.textContent = `#${index + 1}`;
          controlBar.append(num);

          if (index > 0) {
            const upBtn = document.createElement("button");
            upBtn.type = "button";
            upBtn.className = "bullet-ctrl-btn";
            upBtn.textContent = "↑";
            upBtn.title = "Move bullet up";
            upBtn.onclick = () => {
              const temp = expBullets[index - 1];
              expBullets[index - 1] = expBullets[index];
              expBullets[index] = temp;
              renderBulletRows();
              markDeliverableDirty();
            };
            controlBar.append(upBtn);
          }

          if (index < expBullets.length - 1) {
            const downBtn = document.createElement("button");
            downBtn.type = "button";
            downBtn.className = "bullet-ctrl-btn";
            downBtn.textContent = "↓";
            downBtn.title = "Move bullet down";
            downBtn.onclick = () => {
              const temp = expBullets[index + 1];
              expBullets[index + 1] = expBullets[index];
              expBullets[index] = temp;
              renderBulletRows();
              markDeliverableDirty();
            };
            controlBar.append(downBtn);
          }

          const delBtn = document.createElement("button");
          delBtn.type = "button";
          delBtn.className = "bullet-ctrl-btn is-delete";
          delBtn.textContent = "✕";
          delBtn.title = "Delete bullet";
          delBtn.onclick = () => {
            const globalIdx = bullets.indexOf(bullet);
            if (globalIdx >= 0) bullets.splice(globalIdx, 1);
            const localIdx = expBullets.indexOf(bullet);
            if (localIdx >= 0) expBullets.splice(localIdx, 1);
            renderBulletRows();
            markDeliverableDirty();
          };
          controlBar.append(delBtn);

          const inputs = createBilingualInputRow(
            `Bullet #${index + 1}`,
            bullet.text_en,
            bullet.text_pt,
            (en, pt) => {
              bullet.text_en = en;
              bullet.text_pt = pt;
            },
            { tall: true }
          );

          bRow.append(controlBar, inputs);
          bulletsList.append(bRow);
        });
      };

      renderBulletRows();
      expBlock.append(bulletsList);

      const addBulletBtn = document.createElement("button");
      addBulletBtn.type = "button";
      addBulletBtn.className = "add-btn secondary-add-btn";
      addBulletBtn.textContent = "+ Add Bullet";
      addBulletBtn.onclick = () => {
        const newB = {
          experience_id: exp.id,
          variant,
          sort_order: String(expBullets.length + 1),
          text_en: "",
          text_pt: "",
        };
        bullets.push(newB);
        expBullets.push(newB);
        renderBulletRows();
        markDeliverableDirty();
      };
      expBlock.append(addBulletBtn);
      secBullets.append(expBlock);
    }
    container.append(secBullets);

    // Skills Section (Core & Tech)
    const secSkills = document.createElement("div");
    secSkills.className = "deliverable-section-card";
    const hSkills = document.createElement("h3");
    hSkills.textContent = "Skills (Core & Tech)";
    secSkills.append(hSkills);

    for (const cat of ["Core", "Tech"]) {
      const catBlock = document.createElement("div");
      catBlock.className = "deliverable-skill-cat-block";
      const catH = document.createElement("h4");
      catH.textContent = `${cat} Skills`;
      catBlock.append(catH);

      const catSkills = skills
        .filter((s) => s.variant === variant && s.category === cat)
        .sort((a, b) => parseInt(a.sort_order || 0, 10) - parseInt(b.sort_order || 0, 10));

      const skillsList = document.createElement("div");
      skillsList.className = "deliverable-skills-grid";

      const renderSkillPills = () => {
        skillsList.replaceChildren();
        catSkills.forEach((skill, index) => {
          skill.sort_order = String(index + 1);
          const pill = document.createElement("div");
          pill.className = "deliverable-skill-edit-item";

          const enInput = document.createElement("input");
          enInput.type = "text";
          enInput.className = "field-input skill-inline-input";
          enInput.value = skill.label_en || "";
          enInput.placeholder = "EN skill";
          enInput.oninput = () => {
            skill.label_en = enInput.value;
            markDeliverableDirty();
          };

          const ptInput = document.createElement("input");
          ptInput.type = "text";
          ptInput.className = "field-input skill-inline-input";
          ptInput.value = skill.label_pt || "";
          ptInput.placeholder = "PT skill";
          ptInput.oninput = () => {
            skill.label_pt = ptInput.value;
            markDeliverableDirty();
          };

          const delSkillBtn = document.createElement("button");
          delSkillBtn.type = "button";
          delSkillBtn.className = "bullet-ctrl-btn is-delete";
          delSkillBtn.textContent = "✕";
          delSkillBtn.onclick = () => {
            const gIdx = skills.indexOf(skill);
            if (gIdx >= 0) skills.splice(gIdx, 1);
            const lIdx = catSkills.indexOf(skill);
            if (lIdx >= 0) catSkills.splice(lIdx, 1);
            renderSkillPills();
            markDeliverableDirty();
          };

          pill.append(enInput, ptInput, delSkillBtn);
          skillsList.append(pill);
        });
      };

      renderSkillPills();
      catBlock.append(skillsList);

      const addSkillBtn = document.createElement("button");
      addSkillBtn.type = "button";
      addSkillBtn.className = "add-btn secondary-add-btn";
      addSkillBtn.textContent = `+ Add ${cat} Skill`;
      addSkillBtn.onclick = () => {
        const first = catSkills[0] || {};
        const newS = {
          variant,
          category: cat,
          category_label_en: first.category_label_en || cat,
          category_label_pt: first.category_label_pt || (cat === "Core" ? "Núcleo" : "Tecnologias"),
          sort_order: String(catSkills.length + 1),
          label_en: "",
          label_pt: "",
        };
        skills.push(newS);
        catSkills.push(newS);
        renderSkillPills();
        markDeliverableDirty();
      };
      catBlock.append(addSkillBtn);
      secSkills.append(catBlock);
    }
    container.append(secSkills);
  }

  // --- Contextual Media Manager (Images & Artifacts) ---
  function createProjectMediaEditor(projectId, projectTitle, imagesList, allowedCategories, defaultCategory) {
    const section = document.createElement("div");
    section.className = "contextual-media-section";

    const head = document.createElement("div");
    head.className = "contextual-media-header";

    const titleEl = document.createElement("div");
    titleEl.className = "contextual-media-title";
    titleEl.innerHTML = `<span>📷</span> <span>${projectTitle}</span>`;

    const actions = document.createElement("div");
    actions.className = "portfolio-project-actions";

    const countBadge = document.createElement("span");
    countBadge.className = "portfolio-img-count-badge";

    const updateBadge = () => {
      const projImgs = imagesList.filter((i) => i.project_id === projectId);
      const sel = projImgs.filter((i) => (i.selected || "").toLowerCase() === "true" || i.selected === "1").length;
      countBadge.textContent = `${sel} of ${projImgs.length} active in deck`;
      countBadge.className = `portfolio-img-count-badge ${sel > 0 ? "has-selected" : "none-selected"}`;
    };

    const addImgBtn = document.createElement("button");
    addImgBtn.type = "button";
    addImgBtn.className = "mini-action-btn";
    addImgBtn.textContent = "+ Add / Upload Image";
    addImgBtn.title = "Upload an image or pick from workspace";
    addImgBtn.onclick = () => openMediaUploadOrPickModal(projectId, allowedCategories, defaultCategory, imagesList, () => {
      renderCards();
      updateBadge();
      markDeliverableDirty();
    });

    const selectAllBtn = document.createElement("button");
    selectAllBtn.type = "button";
    selectAllBtn.className = "mini-action-btn";
    selectAllBtn.textContent = "Select All";
    selectAllBtn.onclick = () => {
      imagesList.filter((i) => i.project_id === projectId).forEach((i) => (i.selected = "true"));
      renderCards();
      updateBadge();
      markDeliverableDirty();
    };

    const deselectAllBtn = document.createElement("button");
    deselectAllBtn.type = "button";
    deselectAllBtn.className = "mini-action-btn";
    deselectAllBtn.textContent = "Deselect All";
    deselectAllBtn.onclick = () => {
      imagesList.filter((i) => i.project_id === projectId).forEach((i) => (i.selected = "false"));
      renderCards();
      updateBadge();
      markDeliverableDirty();
    };

    actions.append(countBadge, addImgBtn, selectAllBtn, deselectAllBtn);
    head.append(titleEl, actions);
    section.append(head);

    const grid = document.createElement("div");
    grid.className = "contextual-media-grid";

    const renderCards = () => {
      grid.replaceChildren();
      const projImgs = imagesList
        .filter((i) => i.project_id === projectId)
        .sort((a, b) => parseInt(a.sort_order || 999, 10) - parseInt(b.sort_order || 999, 10));

      projImgs.forEach((img, idx) => {
        img.sort_order = String(idx + 1);
        const isSel = (img.selected || "").toLowerCase() === "true" || img.selected === "1";

        const card = document.createElement("div");
        card.className = "media-item-card" + (isSel ? "" : " is-disabled");

        const previewWrap = document.createElement("div");
        previewWrap.className = "media-item-preview-wrap";
        previewWrap.title = "Click to preview large image";

        const thumb = document.createElement("img");
        thumb.src = `/${img.path}`;
        thumb.alt = img.caption_en || "";
        thumb.loading = "lazy";
        previewWrap.append(thumb);

        const statusPill = document.createElement("span");
        statusPill.className = "portfolio-image-status-pill";
        statusPill.textContent = isSel ? "✓ In Deck" : "✕ Excluded";
        previewWrap.append(statusPill);

        previewWrap.onclick = (e) => {
          e.stopPropagation();
          openImageLightbox(`/${img.path}`, img.caption_en || img.caption_pt || img.path);
        };

        const info = document.createElement("div");
        info.className = "portfolio-image-info";

        // Top bar: toggle & order buttons
        const topBar = document.createElement("div");
        topBar.style.cssText = "display: flex; align-items: center; justify-content: space-between; gap: 6px;";

        const chkLabel = document.createElement("label");
        chkLabel.style.cssText = "display: inline-flex; align-items: center; gap: 4px; font-size: 11px; cursor: pointer;";
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.checked = isSel;
        chk.onchange = () => {
          img.selected = chk.checked ? "true" : "false";
          card.classList.toggle("is-disabled", !chk.checked);
          statusPill.textContent = chk.checked ? "✓ In Deck" : "✕ Excluded";
          updateBadge();
          markDeliverableDirty();
        };
        chkLabel.append(chk, document.createTextNode("Include"));

        const orderWrap = document.createElement("div");
        orderWrap.className = "media-item-order-actions";

        const leftBtn = document.createElement("button");
        leftBtn.type = "button";
        leftBtn.className = "media-btn-small";
        leftBtn.textContent = "←";
        leftBtn.title = "Move earlier in sequence";
        leftBtn.disabled = idx === 0;
        leftBtn.onclick = () => {
          const prev = projImgs[idx - 1];
          const tmp = prev.sort_order;
          prev.sort_order = img.sort_order;
          img.sort_order = tmp;
          renderCards();
          markDeliverableDirty();
        };

        const rightBtn = document.createElement("button");
        rightBtn.type = "button";
        rightBtn.className = "media-btn-small";
        rightBtn.textContent = "→";
        rightBtn.title = "Move later in sequence";
        rightBtn.disabled = idx === projImgs.length - 1;
        rightBtn.onclick = () => {
          const next = projImgs[idx + 1];
          const tmp = next.sort_order;
          next.sort_order = img.sort_order;
          img.sort_order = tmp;
          renderCards();
          markDeliverableDirty();
        };

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "media-btn-small";
        delBtn.textContent = "✕";
        delBtn.title = "Remove image from project";
        delBtn.onclick = () => {
          const globalIdx = imagesList.indexOf(img);
          if (globalIdx >= 0) imagesList.splice(globalIdx, 1);
          renderCards();
          updateBadge();
          markDeliverableDirty();
        };

        if (projImgs.length > 1) {
          if (idx === 0) {
            const coverTag = document.createElement("span");
            coverTag.className = "media-btn-small";
            coverTag.style.cssText = "color:#fbbf24; border-color:#f59e0b; cursor:default;";
            coverTag.textContent = "★ Cover";
            coverTag.title = "Front / cover image";
            orderWrap.append(coverTag);
          } else {
            const coverBtn = document.createElement("button");
            coverBtn.type = "button";
            coverBtn.className = "media-btn-small";
            coverBtn.textContent = "★";
            coverBtn.title = "Set as cover (up front)";
            coverBtn.onclick = async () => {
              const reordered = [img, ...projImgs.filter((_, j) => j !== idx)];
              reordered.forEach((item, j) => {
                item.sort_order = String(j + 1);
              });
              renderCards();
              markDeliverableDirty();
              const projToDeliv = {
                "agritech-iot-cattle": "astra",
                "tooling-pt": "tooling-pt",
                "data-insights-pt": "data-insights",
                "cip-research-gate": "relevance-model",
              };
              const delivId = projToDeliv[img.project_id];
              if (delivId && img.path) {
                const rel = String(img.path).replace(/\\/g, "/").replace(/^\/+/, "");
                const aliases = {
                  "pictures/work/astra-project/IMG_20260415_182229.jpg": "../media/astra-iot-device.jpg",
                  "pictures/work/astra-project/astra-report-page-4-current-journey.png": "../media/astra-current-journey.png",
                  "pictures/work/astra-project/astra-report-page-7-mvp-requirements.png": "../media/astra-mvp-requirements.png",
                  "pictures/work/data-insights/data-insights-overview.png": "../media/data-insights-overview.png",
                  "pictures/work/data-insights/data-insights-results.png": "../media/data-insights-results.png",
                  "pictures/work/data-insights/data-insights-journey.png": "../media/data-insights-journey.png",
                  "pictures/work/cip-ux/ux-relevance-wireframe.png": "../media/ux-relevance-wireframe.png",
                  "pictures/work/cip-ux/ux-relevance-scoring.png": "../media/ux-relevance-scoring.png",
                };
                const fname = rel.split("/").pop();
                const webSrc = aliases[rel] || `../media/projects/${delivId}__${fname}`;
                try {
                  const cur = await fetch("/api/deliverables/covers").then((r) => r.json());
                  const covers = Object.assign({}, (cur && cur.covers) || {});
                  covers[delivId] = webSrc;
                  await fetch("/api/deliverables/covers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ covers }),
                  });
                } catch {
                  /* ignore */
                }
              }
            };
            orderWrap.append(coverBtn);
          }
        }
        orderWrap.append(leftBtn, rightBtn, delBtn);
        topBar.append(chkLabel, orderWrap);
        info.append(topBar);

        // Anonymization controls on media card
        const anonEntry = (window.__anonCatalogByPath || {})[String(img.path || "").replace(/^\/+/, "")];
        const anonRow = document.createElement("div");
        anonRow.style.cssText = "display:flex; align-items:center; justify-content:space-between; gap:4px; margin-top:4px;";
        const anonBtn = document.createElement("button");
        anonBtn.type = "button";
        anonBtn.className = "media-btn-small";
        anonBtn.textContent = anonEntry?.anonymized ? "🛡 Re-edit" : "🛡 Anonymize";
        anonBtn.title = "Open Anonymization Studio (original is never overwritten)";
        anonBtn.onclick = () => {
          if (typeof window.openAnonymizeStudio === "function") {
            window.openAnonymizeStudio({
              path: img.path,
              label: img.caption_en || img.path,
              existingRecipe: anonEntry?.recipe || null,
              onConfirmed: async () => {
                await refreshAnonCatalog();
                renderCards();
              },
            });
          }
        };
        anonRow.append(anonBtn);
        if (anonEntry?.anonymized) {
          thumb.src = `${anonEntry.display_url}?t=${Date.now()}`;
          const anonBadge = document.createElement("span");
          anonBadge.className = "anon-card-badge";
          anonBadge.textContent = "🛡 Anonymized";
          previewWrap.append(anonBadge);
          const revBtn = document.createElement("button");
          revBtn.type = "button";
          revBtn.className = "media-btn-small";
          revBtn.textContent = "Revert";
          revBtn.title = "Use original image instead (keeps original untouched)";
          revBtn.onclick = async () => {
            await fetch("/api/anonymize/revert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path: img.path }),
            });
            await refreshAnonCatalog();
            renderCards();
          };
          anonRow.append(revBtn);
        }
        info.append(anonRow);

        // Category dropdown
        if (allowedCategories && allowedCategories.length > 0) {
          const catRow = document.createElement("div");
          catRow.style.cssText = "display: flex; align-items: center; gap: 4px; font-size: 11px;";
          const catLabel = document.createElement("span");
          catLabel.textContent = "Slot:";
          catLabel.style.color = "var(--muted)";
          const select = document.createElement("select");
          select.className = "media-category-select";
          allowedCategories.forEach((cat) => {
            const opt = document.createElement("option");
            opt.value = cat.value;
            opt.textContent = cat.label;
            opt.selected = img.category === cat.value;
            select.append(opt);
          });
          select.onchange = () => {
            img.category = select.value;
            markDeliverableDirty();
          };
          catRow.append(catLabel, select);
          info.append(catRow);
        }

        // Bilingual captions
        const captionsBox = document.createElement("div");
        captionsBox.className = "portfolio-card-caption-edit";

        const enInput = document.createElement("input");
        enInput.type = "text";
        enInput.placeholder = "Caption (EN)…";
        enInput.value = img.caption_en || "";
        enInput.oninput = () => {
          img.caption_en = enInput.value;
          markDeliverableDirty();
        };

        const ptInput = document.createElement("input");
        ptInput.type = "text";
        ptInput.placeholder = "Legenda (PT)…";
        ptInput.value = img.caption_pt || "";
        ptInput.oninput = () => {
          img.caption_pt = ptInput.value;
          markDeliverableDirty();
        };

        captionsBox.append(enInput, ptInput);
        info.append(captionsBox);

        card.append(previewWrap, info);
        grid.append(card);
      });
    };

    renderCards();
    updateBadge();
    section.append(grid);
    return section;
  }

  // Upload or Pick Modal for Media
  async function openMediaUploadOrPickModal(projectId, allowedCategories, defaultCategory, imagesList, onAdded) {
    const modal = document.createElement("div");
    modal.className = "image-lightbox-modal";

    const content = document.createElement("div");
    content.className = "image-lightbox-content";
    content.style.maxWidth = "760px";
    content.style.maxHeight = "80vh";
    content.style.padding = "20px";
    content.style.overflowY = "auto";
    content.style.background = "var(--panel)";
    content.style.borderRadius = "8px";
    content.style.border = "1px solid var(--line)";

    const title = document.createElement("h3");
    title.style.margin = "0 0 12px";
    title.textContent = `Add Image to ${projectId}`;
    content.append(title);

    // Option A: Upload from local machine
    const uploadSec = document.createElement("div");
    uploadSec.style.cssText = "padding: 12px; background: #18181b; border: 1px dashed var(--line); border-radius: 6px; margin-bottom: 16px;";
    const upTitle = document.createElement("strong");
    upTitle.textContent = "Upload New Image from Disk:";
    const upInput = document.createElement("input");
    upInput.type = "file";
    upInput.accept = "image/*";
    upInput.style.marginTop = "8px";

    const upStatus = document.createElement("div");
    upStatus.style.cssText = "font-size: 11px; margin-top: 6px; color: var(--muted);";

    upInput.onchange = async () => {
      const file = upInput.files?.[0];
      if (!file) return;
      upStatus.textContent = `Reading ${file.name}…`;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          upStatus.textContent = `Uploading ${file.name} to pictures/work/${projectId}…`;
          const res = await fetch("/api/deliverables/upload-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              project_id: projectId,
              data_base64: reader.result,
            }),
          });
          const resData = await res.json();
          if (!resData.ok) throw new Error(resData.error || "Upload failed");
          // Add to imagesList
          const newRow = {
            project_id: projectId,
            path: resData.url.replace(/^\//, ""),
            category: defaultCategory || (allowedCategories?.[0]?.value || ""),
            selected: "true",
            sort_order: String(imagesList.filter((i) => i.project_id === projectId).length + 1),
            caption_en: file.name.replace(/\.[^/.]+$/, ""),
            caption_pt: file.name.replace(/\.[^/.]+$/, ""),
          };
          imagesList.push(newRow);
          modal.remove();
          if (onAdded) onAdded();
        } catch (err) {
          upStatus.textContent = "Error: " + err.message;
          upStatus.style.color = "#e74c3c";
        }
      };
      reader.readAsDataURL(file);
    };

    uploadSec.append(upTitle, document.createElement("br"), upInput, upStatus);
    content.append(uploadSec);

    // Option B: Pick existing image from workspace catalog
    const pickSec = document.createElement("div");
    const pickTitle = document.createElement("strong");
    pickTitle.textContent = "Or Pick Existing Image from Workspace Catalog:";
    pickSec.append(pickTitle);

    const catalogGrid = document.createElement("div");
    catalogGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; margin-top: 10px; max-height: 280px; overflow-y: auto; padding: 6px; background: #121214; border-radius: 6px;";

    try {
      const res = await fetch("/api/deliverables/media-catalog");
      const catData = await res.json();
      if (catData.ok && catData.files) {
        catData.files.forEach((f) => {
          const item = document.createElement("div");
          item.style.cssText = "cursor: pointer; padding: 4px; border: 1px solid var(--line); border-radius: 4px; text-align: center; background: #1c1c1f;";
          const img = document.createElement("img");
          img.src = f.url;
          img.style.cssText = "width: 100%; height: 70px; object-fit: contain; background: #0a0a0c; border-radius: 2px;";
          const fn = document.createElement("div");
          fn.style.cssText = "font-size: 10px; color: var(--muted); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
          fn.textContent = f.filename;
          item.append(img, fn);

          item.onclick = () => {
            const newRow = {
              project_id: projectId,
              path: f.rel_path,
              category: defaultCategory || (allowedCategories?.[0]?.value || ""),
              selected: "true",
              sort_order: String(imagesList.filter((i) => i.project_id === projectId).length + 1),
              caption_en: f.filename.replace(/\.[^/.]+$/, ""),
              caption_pt: f.filename.replace(/\.[^/.]+$/, ""),
            };
            imagesList.push(newRow);
            modal.remove();
            if (onAdded) onAdded();
          };
          catalogGrid.append(item);
        });
      }
    } catch {
      catalogGrid.textContent = "Could not load workspace catalog.";
    }

    pickSec.append(catalogGrid);
    content.append(pickSec);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "mini-action-btn";
    closeBtn.style.marginTop = "14px";
    closeBtn.textContent = "Cancel";
    closeBtn.onclick = () => modal.remove();
    content.append(closeBtn);

    modal.append(content);
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
    document.body.append(modal);
  }

  async function refreshAnonCatalog() {
    try {
      const res = await fetch("/api/anonymize/list");
      const data = await res.json();
      if (data.ok && Array.isArray(data.images)) {
        const map = {};
        data.images.forEach((it) => { map[it.path] = it; });
        window.__anonCatalog = data.images;
        window.__anonCatalogByPath = map;
      }
    } catch {
      /* ignore if offline */
    }
  }

  function renderImagePrivacySection(container, data) {
    const sec = document.createElement("details");
    sec.className = "deliverable-section-card";
    sec.style.marginBottom = "16px";
    const sum = document.createElement("summary");
    sum.style.cssText = "cursor:pointer; font-weight:600; font-size:13px; padding:4px 0;";
    sum.textContent = "🛡 Image Privacy & Anonymization (Website + Deck Images)";
    sec.append(sum);

    const grid = document.createElement("div");
    grid.className = "anon-catalog-grid";
    sec.append(grid);

    const drawList = () => {
      grid.replaceChildren();
      const items = window.__anonCatalog || [];
      if (!items.length) {
        grid.textContent = "No images found.";
        return;
      }
      items.forEach((it) => {
        const card = document.createElement("div");
        card.className = "anon-catalog-card";
        const img = document.createElement("img");
        img.src = `${it.anonymized ? it.display_url : it.url}?t=${Date.now()}`;
        img.loading = "lazy";
        img.alt = it.label;
        const meta = document.createElement("div");
        meta.className = "anon-catalog-meta";
        meta.innerHTML = `<div class="anon-catalog-name" title="${it.path}">${it.label}</div><div class="anon-catalog-sub">${it.source} · ${it.anonymized ? `🛡 Anonymized (${it.method})` : "Original"}</div>`;
        const actions = document.createElement("div");
        actions.className = "anon-catalog-actions";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mini-action-btn";
        btn.textContent = it.anonymized ? "Re-edit" : "Anonymize";
        btn.onclick = () => {
          window.openAnonymizeStudio({
            path: it.path,
            label: it.label,
            existingRecipe: it.recipe || null,
            onConfirmed: async () => {
              await refreshAnonCatalog();
              drawList();
            },
          });
        };
        actions.append(btn);
        if (it.anonymized) {
          const rev = document.createElement("button");
          rev.type = "button";
          rev.className = "mini-action-btn";
          rev.textContent = "Revert";
          rev.onclick = async () => {
            await fetch("/api/anonymize/revert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path: it.path }),
            });
            await refreshAnonCatalog();
            drawList();
          };
          actions.append(rev);
        }
        card.append(img, meta, actions);
        grid.append(card);
      });
    };

    refreshAnonCatalog().then(drawList);
    container.append(sec);
  }

  function renderPortfolioTab(container, variant, data) {
    const narratives = data.narratives || [];
    const images = data.portfolioImages || [];
    refreshAnonCatalog();

    // Quick-jump navigation bar (aligned with Web Portfolio Chapters & Deliverables)
    const quickNav = document.createElement("nav");
    quickNav.className = "deliverable-quicknav-bar";
    const navLabel = document.createElement("span");
    navLabel.className = "deliverable-quicknav-label";
    navLabel.textContent = "Jump to Chapter:";
    quickNav.append(navLabel);

    const chaptersList = [
      { id: "slide-1", name: "Intro · Hero" },
      { id: "slide-3", name: "01 · Why This Work" },
      { id: "chapter-deliverables", name: "04 · Deliverables" },
      { id: "slide-closing", name: "07 · Contact" },
    ];

    chaptersList.forEach((s) => {
      const pill = document.createElement("a");
      pill.className = "quicknav-pill";
      pill.textContent = s.name;
      pill.href = `#${s.id}`;
      pill.onclick = (e) => {
        e.preventDefault();
        const target = document.getElementById(s.id);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      quickNav.append(pill);
    });

    container.append(quickNav);
    renderImagePrivacySection(container, data);

    const getNarrative = (key, defaultLabel) => {
      let row = narratives.find((r) => r.variant === variant && r.field === key);
      if (!row) {
        row = { variant, field: key, label_en: defaultLabel, label_pt: defaultLabel, text_en: "", text_pt: "" };
        narratives.push(row);
      }
      return row;
    };

    // Helper to create slide cards
    const createSlideCard = (id, badgeText, titleText) => {
      const card = document.createElement("div");
      card.id = id;
      card.className = "portfolio-slide-card";
      const header = document.createElement("div");
      header.className = "portfolio-slide-card-header";
      const badge = document.createElement("span");
      badge.className = "portfolio-slide-badge";
      badge.textContent = badgeText;
      const title = document.createElement("h3");
      title.style.margin = "0";
      title.textContent = titleText;
      header.append(badge, title);
      card.append(header);
      return card;
    };

    // --- Intro · Hero ---
    const card1 = createSlideCard("slide-1", "Intro", "Hero & Role Positioning");
    const whoRole = getNarrative("who_role", "Hero Role");
    card1.append(
      createBilingualInputRow("Hero Role & Page Title", whoRole.text_en, whoRole.text_pt, (en, pt) => {
        whoRole.text_en = en;
        whoRole.text_pt = pt;
      })
    );
    const deckTitle = getNarrative("deck_title", "Deck Title");
    card1.append(
      createBilingualInputRow("Fallback Label", deckTitle.text_en, deckTitle.text_pt, (en, pt) => {
        deckTitle.text_en = en;
        deckTitle.text_pt = pt;
      })
    );
    container.append(card1);

    // --- 01 · Why This Work ---
    const card3 = createSlideCard("slide-3", "01 · Why This Work", "Why This Work");
    const whyH1 = getNarrative("why_h1", "Why Heading");
    card3.append(
      createBilingualInputRow("Section Title", whyH1.text_en, whyH1.text_pt, (en, pt) => {
        whyH1.text_en = en;
        whyH1.text_pt = pt;
      })
    );
    const whyBullets = getNarrative("why_bullets", "Why Paragraphs");
    card3.append(
      createStructuredBulletsEditor(
        "Why Paragraphs (Rendered as Paragraph 1 & 2)",
        whyBullets.text_en,
        whyBullets.text_pt,
        (en, pt) => {
          whyBullets.text_en = en;
          whyBullets.text_pt = pt;
        }
      )
    );
    container.append(card3);

    // --- 04 · Deliverables (Unified Deliverables Manager) ---
    const card04 = createSlideCard(
      "chapter-deliverables",
      "04 · Deliverables",
      "All Portfolio Deliverables (Fantasy Names, Copy, Covers & Attached Images)"
    );
    const catalog = deliverablesCache?.deliverableCatalog || { categories: [], items: [] };
    const catalogItems = Array.isArray(catalog.items) ? catalog.items : [];
    const catalogCats = Array.isArray(catalog.categories) ? catalog.categories : [];
    const projRows = Array.isArray(data.projects) ? data.projects : [];
    if (!data.deliverablesOverrides || typeof data.deliverablesOverrides !== "object") {
      data.deliverablesOverrides = {};
    }
    if (!data.deliverableCovers || typeof data.deliverableCovers !== "object") {
      data.deliverableCovers = {};
    }
    const overrides = data.deliverablesOverrides;
    const covers = data.deliverableCovers;

    const filterBar = document.createElement("div");
    filterBar.style.cssText = "display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-bottom:12px;";
    const searchInp = document.createElement("input");
    searchInp.type = "search";
    searchInp.placeholder = "Search deliverables (e.g. UX Super, Astra, X-Tower)...";
    searchInp.style.cssText = "flex:1 1 220px; padding:6px 10px; border-radius:6px; border:1px solid var(--line); background:#09090b; color:var(--ink); font-size:12px;";
    filterBar.append(searchInp);

    let activeCat = "all";
    const catBtns = [];
    const mkCatBtn = (id, label) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quicknav-pill";
      b.textContent = label;
      b.onclick = () => {
        activeCat = id;
        catBtns.forEach((btn) => {
          btn.style.borderColor = btn === b ? "var(--gold)" : "";
          btn.style.color = btn === b ? "var(--gold)" : "";
        });
        renderDeliverableCards();
      };
      catBtns.push(b);
      filterBar.append(b);
      return b;
    };
    const allBtn = mkCatBtn("all", `All (${catalogItems.length})`);
    allBtn.style.borderColor = "var(--gold)";
    allBtn.style.color = "var(--gold)";
    catalogCats.forEach((c) => mkCatBtn(c.id, c.title));
    card04.append(filterBar);

    const delivListWrap = document.createElement("div");
    delivListWrap.style.cssText = "display:flex; flex-direction:column; gap:10px;";
    card04.append(delivListWrap);

    const projMediaConfigs = {
      "cip-research-gate": {
        label: "CIP UX Artifacts & Report Visuals",
        cats: [{ value: "artifact", label: "UX Artifact Report" }],
        def: "artifact",
      },
      "tooling-pt": {
        label: "Tooling PT Prototypes & Workshop Photos",
        cats: [
          { value: "prototype", label: "Prototype Row (Wireframes/Figma)" },
          { value: "workshop", label: "Workshop Row (Co-design/Reviews)" },
        ],
        def: "prototype",
      },
      "agritech-iot-cattle": {
        label: "Astra Fieldwork & Telemetry Photos",
        cats: [
          { value: "fieldwork", label: "Fazenda Sindi Fieldwork" },
          { value: "telemetry", label: "IoT Telemetry Hardware" },
          { value: "report", label: "Research Report & Deliverables" },
        ],
        def: "fieldwork",
      },
    };

    const renderDeliverableCards = () => {
      delivListWrap.replaceChildren();
      const q = (searchInp.value || "").trim().toLowerCase();
      const filtered = catalogItems.filter((d) => {
        if (overrides[d.id]?.hidden === true) return false;
        const curCat = (overrides[d.id]?.category) || d.category;
        if (activeCat !== "all" && curCat !== activeCat) return false;
        if (!q) return true;
        const proj = d.project_id ? projRows.find((p) => p.id === d.project_id) : null;
        const hay = [
          d.id,
          d.title_en,
          d.title_pt,
          d.short_en,
          proj?.name_en,
          proj?.fantasy_name_en,
          overrides[d.id]?.fantasy_name_en,
        ].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      });

      if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.style.cssText = "font-size:12px; color:var(--muted); margin:8px 0;";
        empty.textContent = "No deliverables match this filter.";
        delivListWrap.append(empty);
        return;
      }

      filtered.forEach((d) => {
        const proj = d.project_id ? projRows.find((p) => p.id === d.project_id) : null;
        const ov = overrides[d.id] || {};
        const ensureOv = () => {
          if (!overrides[d.id]) overrides[d.id] = {};
          return overrides[d.id];
        };

        const det = document.createElement("details");
        det.className = "deliverable-section-card";
        det.style.marginBottom = "0";

        const sum = document.createElement("summary");
        sum.style.cssText = "cursor:pointer; display:flex; align-items:center; gap:10px; padding:4px 0; list-style:none;";

        const mediaList = Array.isArray(d.media) ? d.media : [];
        const currentCover = covers[d.id] || (mediaList[0] && mediaList[0].src) || "";

        const sumThumb = document.createElement("img");
        if (currentCover) {
          sumThumb.src = `/${currentCover.replace(/^\.\.\//, "portfolio/")}`;
          sumThumb.style.cssText = "width:44px; height:32px; object-fit:contain; background:#14110e; border:1px solid var(--line); border-radius:4px; flex-shrink:0;";
        } else {
          sumThumb.style.display = "none";
        }

        const displayTitle = (proj?.fantasy_name_en || ov.fantasy_name_en || d.title_en || d.id).trim();
        const sumTitle = document.createElement("span");
        sumTitle.style.cssText = "font-weight:600; font-size:13px; flex:1 1 auto;";
        sumTitle.textContent = displayTitle;

        const sumMeta = document.createElement("span");
        sumMeta.style.cssText = "font-size:11px; color:var(--muted); display:inline-flex; gap:8px; align-items:center;";
        const catObj = catalogCats.find((c) => c.id === (ov.category || d.category));
        sumMeta.textContent = `${catObj ? catObj.title : (ov.category || d.category)} · ${mediaList.length} img${mediaList.length === 1 ? "" : "s"}`;

        sum.append(sumThumb, sumTitle, sumMeta);
        det.append(sum);

        const body = document.createElement("div");
        body.style.cssText = "display:flex; flex-direction:column; gap:10px; margin-top:10px; padding-top:10px; border-top:1px solid var(--line);";

        const topActionRow = document.createElement("div");
        topActionRow.style.cssText = "display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;";
        if (proj) {
          const origNotice = document.createElement("div");
          origNotice.style.cssText = "flex:1 1 auto; font-size:11px; color:var(--muted); padding:6px 8px; border-radius:4px; background:#09090b; border:1px solid var(--line);";
          origNotice.textContent = `Original Name (preserved): ${proj.name_en || proj.name_pt || proj.id}${proj.name_pt && proj.name_pt !== proj.name_en ? ` / ${proj.name_pt}` : ""}`;
          topActionRow.append(origNotice);
        } else {
          topActionRow.append(document.createElement("span"));
        }
        const removeDelivBtn = document.createElement("button");
        removeDelivBtn.type = "button";
        removeDelivBtn.className = "mini-action-btn";
        removeDelivBtn.style.cssText = "color:#f87171; border-color:rgba(248,113,113,0.45);";
        removeDelivBtn.textContent = "🗑️ Remove from Portfolio";
        removeDelivBtn.onclick = () => {
          if (!confirm(`Remove "${displayTitle}" from your portfolio?\n\nThis will hide it from the public portfolio and PDF.`)) {
            return;
          }
          if (!confirm(`Are you 100% sure you want to remove "${displayTitle}"?\n\nPlease confirm a second time to proceed (Save & Regenerate to apply).`)) {
            return;
          }
          ensureOv().hidden = true;
          markDeliverableDirty();
          renderDeliverableCards();
        };
        topActionRow.append(removeDelivBtn);
        body.append(topActionRow);

        // Fantasy Name EN / PT + Category
        const metaGrid = document.createElement("div");
        metaGrid.style.cssText = "display:grid; grid-template-columns:1fr 1fr 180px; gap:8px;";
        const mkFantasyInp = (langKey, placeholder) => {
          const wrap = document.createElement("label");
          wrap.style.cssText = "display:flex; flex-direction:column; gap:3px; font-size:11px; color:var(--muted);";
          wrap.textContent = langKey === "en" ? "Fantasy Name (EN)" : "Nome Fantasia (PT)";
          const inp = document.createElement("input");
          inp.type = "text";
          inp.value = (proj && proj[`fantasy_name_${langKey}`]) || ov[`fantasy_name_${langKey}`] || "";
          inp.placeholder = placeholder;
          inp.style.cssText = "padding:6px 8px; border-radius:4px; border:1px solid var(--line); background:#09090b; color:var(--ink); font-size:12px;";
          inp.oninput = () => {
            ensureOv()[`fantasy_name_${langKey}`] = inp.value;
            if (proj) proj[`fantasy_name_${langKey}`] = inp.value;
            if (langKey === "en") sumTitle.textContent = inp.value.trim() || d.title_en || d.id;
            markDeliverableDirty();
          };
          wrap.append(inp);
          return wrap;
        };
        const catWrap = document.createElement("label");
        catWrap.style.cssText = "display:flex; flex-direction:column; gap:3px; font-size:11px; color:var(--muted);";
        catWrap.textContent = "Category";
        const catSel = document.createElement("select");
        catSel.style.cssText = "padding:6px 8px; border-radius:4px; border:1px solid var(--line); background:#09090b; color:var(--ink); font-size:12px;";
        catalogCats.forEach((c) => {
          const opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.title;
          if (c.id === (ov.category || d.category)) opt.selected = true;
          catSel.append(opt);
        });
        catSel.onchange = () => {
          ensureOv().category = catSel.value;
          markDeliverableDirty();
        };
        catWrap.append(catSel);
        metaGrid.append(
          mkFantasyInp("en", `Default: ${d.title_en}`),
          mkFantasyInp("pt", `Padrão: ${d.title_pt}`),
          catWrap
        );
        body.append(metaGrid);

        // Short Summary & Full Description (EN / PT)
        body.append(
          createBilingualInputRow(
            "Short Card Summary",
            ov.short_en !== undefined ? ov.short_en : d.short_en,
            ov.short_pt !== undefined ? ov.short_pt : d.short_pt,
            (en, pt) => {
              const target = ensureOv();
              target.short_en = en;
              target.short_pt = pt;
            }
          ),
          createBilingualInputRow(
            "Full Modal Description",
            ov.full_en !== undefined ? ov.full_en : d.full_en,
            ov.full_pt !== undefined ? ov.full_pt : d.full_pt,
            (en, pt) => {
              const target = ensureOv();
              target.full_en = en;
              target.full_pt = pt;
            },
            { tall: true }
          )
        );

        const appendAttachedImagesStrip = (list, headingLabel) => {
          if (!list.length) return;
          const imgBox = document.createElement("div");
          imgBox.style.cssText = "padding:8px; border:1px solid var(--line); border-radius:6px; background:#09090b;";
          const imgHdr = document.createElement("div");
          imgHdr.style.cssText = "font-size:11px; font-weight:600; color:var(--muted); margin-bottom:8px;";
          imgBox.append(imgHdr);

          const strip = document.createElement("div");
          strip.style.cssText = "display:flex; flex-wrap:wrap; gap:10px;";
          const renderStrip = () => {
            strip.replaceChildren();
            const curCov = covers[d.id] || list[0].src;
            const excludedList = Array.isArray(ov.excluded_media) ? ov.excluded_media : [];
            const activeCount = list.filter((m) => !excludedList.includes(m.src)).length;
            imgHdr.textContent = `${headingLabel} (${activeCount}/${list.length} active) — Cover, Anonymize & Exclude`;
            list.forEach((m) => {
              const isCov = m.src === curCov;
              const isExcl = excludedList.includes(m.src);
              const relGuess = m.src.replace(/^\.\.\//, "docs/");
              const anonEntry = (window.__anonCatalogByPath || {})[relGuess];
              const isAnon = Boolean(anonEntry && anonEntry.anonymized);
              const tile = document.createElement("div");
              tile.style.cssText = `width:148px; padding:6px; border-radius:6px; background:#141417; border:2px solid ${isCov ? "#f59e0b" : "var(--line)"}; opacity:${isExcl ? "0.45" : "1"}; display:flex; flex-direction:column; gap:5px;`;
              const im = document.createElement("img");
              const previewUrl = isAnon && anonEntry.display_url ? anonEntry.display_url : `/${m.src.replace(/^\.\.\//, "portfolio/")}`;
              im.src = previewUrl;
              im.alt = m.caption || m.alt || d.title_en;
              im.style.cssText = "width:100%; height:78px; object-fit:contain; background:#09090b; border-radius:4px; cursor:pointer;";
              im.onclick = () => openImageLightbox(previewUrl, m.caption || d.title_en);

              const cap = document.createElement("div");
              cap.style.cssText = "font-size:10px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
              cap.title = m.caption || m.src;
              cap.textContent = (isExcl ? "[Excluded] " : "") + (m.caption || m.src.split("/").pop());

              const btnRow = document.createElement("div");
              btnRow.style.cssText = "display:flex; gap:4px; align-items:center;";
              const covBtn = document.createElement("button");
              covBtn.type = "button";
              covBtn.className = "media-btn-small";
              covBtn.style.cssText = `flex:1; font-size:10px; ${isCov ? "color:#fbbf24; border-color:#f59e0b;" : ""}`;
              covBtn.textContent = isCov ? "★ Cover" : "★ Set front";
              covBtn.onclick = async () => {
                covers[d.id] = m.src;
                sumThumb.src = `/${m.src.replace(/^\.\.\//, "portfolio/")}`;
                renderStrip();
                markDeliverableDirty();
                try {
                  await fetch("/api/deliverables/covers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ covers }),
                  });
                } catch {
                  /* ignore */
                }
              };
              btnRow.append(covBtn);

              const anBtn = document.createElement("button");
              anBtn.type = "button";
              anBtn.className = "media-btn-small";
              anBtn.style.cssText = `font-size:10px; ${isAnon ? "color:#34d399; border-color:#10b981;" : ""}`;
              anBtn.title = isAnon ? "Edit anonymization" : "Anonymize this image";
              anBtn.textContent = isAnon ? "🛡️✓" : "🛡️";
              anBtn.onclick = async () => {
                if (!window.__anonCatalogByPath) {
                  await refreshAnonCatalog();
                }
                const entry = (window.__anonCatalogByPath || {})[relGuess];
                if (typeof window.openAnonymizeStudio === "function") {
                  window.openAnonymizeStudio({
                    path: entry ? entry.path : relGuess,
                    label: (entry && entry.label) || m.caption || d.title_en,
                    existingRecipe: (entry && entry.recipe) || null,
                    onConfirmed: async () => {
                      await refreshAnonCatalog();
                      renderStrip();
                    },
                  });
                }
              };
              btnRow.append(anBtn);

              const exclBtn = document.createElement("button");
              exclBtn.type = "button";
              exclBtn.className = "media-btn-small";
              exclBtn.style.cssText = `font-size:10px; ${isExcl ? "color:#f87171; border-color:#ef4444;" : ""}`;
              exclBtn.title = isExcl ? "Re-include image in portfolio" : "Exclude image from portfolio";
              exclBtn.textContent = isExcl ? "↩" : "✕";
              exclBtn.onclick = () => {
                const target = ensureOv();
                const cur = Array.isArray(target.excluded_media) ? [...target.excluded_media] : [];
                const idx = cur.indexOf(m.src);
                if (idx >= 0) cur.splice(idx, 1);
                else cur.push(m.src);
                target.excluded_media = cur;
                renderStrip();
                markDeliverableDirty();
              };
              btnRow.append(exclBtn);

              tile.append(im, cap, btnRow);
              strip.append(tile);
            });
          };
          renderStrip();
          if (!window.__anonCatalogByPath) {
            refreshAnonCatalog().then(renderStrip);
          }
          imgBox.append(strip);
          body.append(imgBox);
        };

        // Attached Images: use canonical portfolio_images.csv editor when linked, plus any extra lang.js images
        const hasProjMediaEditor = Boolean(d.project_id && projMediaConfigs[d.project_id]);
        if (hasProjMediaEditor) {
          const cfg = projMediaConfigs[d.project_id];
          body.append(
            createProjectMediaEditor(
              d.project_id,
              `${cfg.label} (Cover, Anonymize, Add / Toggle / Reorder)`,
              images,
              cfg.cats,
              cfg.def
            )
          );
          const projSrcSet = new Set(
            images
              .filter((i) => i.project_id === d.project_id)
              .flatMap((i) => {
                const fname = String(i.path || "").replace(/\\/g, "/").split("/").pop();
                if (!fname) return [];
                return [`../media/${fname}`, `../media/projects/${d.id}__${fname}`];
              })
          );
          const extraLangMedia = mediaList.filter((m) => m && m.src && !projSrcSet.has(m.src));
          if (extraLangMedia.length > 0) {
            appendAttachedImagesStrip(extraLangMedia, "Additional Portfolio Images");
          }
        } else if (mediaList.length > 0) {
          appendAttachedImagesStrip(mediaList, "Attached Images");
        }

        det.append(body);
        delivListWrap.append(det);
      });
    };

    searchInp.oninput = renderDeliverableCards;
    renderDeliverableCards();
    container.append(card04);

    // --- 07 · Contact ---
    const cardClose = createSlideCard("slide-closing", "07 · Contact", "Let's Connect (Contact Lead)");
    const closingSummary = getNarrative("closing_summary", "Contact Lead");
    cardClose.append(
      createBilingualInputRow("Contact Lead Paragraph", closingSummary.text_en, closingSummary.text_pt, (en, pt) => {
        closingSummary.text_en = en;
        closingSummary.text_pt = pt;
      }, { tall: true })
    );
    container.append(cardClose);
  }

  function openImageLightbox(src, caption) {
    const existing = document.querySelector(".image-lightbox-modal");
    if (existing) existing.remove();

    const overlay = document.createElement("dialog");
    overlay.className = "image-lightbox-modal";

    const content = document.createElement("div");
    content.className = "image-lightbox-content";

    const img = document.createElement("img");
    img.className = "image-lightbox-img";
    img.src = src;
    img.alt = caption || "";

    const footer = document.createElement("div");
    footer.className = "image-lightbox-footer";

    const capSpan = document.createElement("span");
    capSpan.className = "image-lightbox-caption";
    capSpan.textContent = caption || "";

    const closeLightbox = () => {
      if (overlay.open) overlay.close();
      overlay.remove();
    };

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "image-lightbox-close";
    closeBtn.textContent = "✕ Close";
    closeBtn.onclick = closeLightbox;

    footer.append(capSpan, closeBtn);
    content.append(img, footer);
    overlay.append(content);

    overlay.onclick = (e) => {
      if (e.target === overlay) closeLightbox();
    };
    overlay.addEventListener("close", () => overlay.remove());

    document.body.append(overlay);
    overlay.showModal();
  }

  function renderSharedTab(container, data) {
    // 0. Experience Roles & Headers
    const secRoles = document.createElement("div");
    secRoles.className = "deliverable-section-card";
    const hRoles = document.createElement("h3");
    hRoles.textContent = "Experience Roles & Dates (Shared across resumes)";
    secRoles.append(hRoles);

    const experiences = data.experience || [];
    experiences.forEach((exp) => {
      const block = document.createElement("div");
      block.className = "deliverable-exp-role-block";
      const h = document.createElement("h4");
      h.textContent = `${exp.company || exp.id} · ${exp.title_en || exp.title_pt}`;
      block.append(h);
      block.append(
        createBilingualInputRow("Role Title", exp.title_en, exp.title_pt, (en, pt) => {
          exp.title_en = en;
          exp.title_pt = pt;
          markDeliverableDirty();
        })
      );
      block.append(
        createBilingualInputRow("Date Display", exp.date_display_en, exp.date_display_pt, (en, pt) => {
          exp.date_display_en = en;
          exp.date_display_pt = pt;
          markDeliverableDirty();
        })
      );
      secRoles.append(block);
    });
    container.append(secRoles);

    // 1. Education
    const secEdu = document.createElement("div");
    secEdu.className = "deliverable-section-card";
    const headEdu = document.createElement("div");
    headEdu.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;";
    const hEdu = document.createElement("h3");
    hEdu.style.margin = "0";
    hEdu.textContent = "Education (Shared across resumes)";
    const addEduBtn = document.createElement("button");
    addEduBtn.type = "button";
    addEduBtn.className = "mini-action-btn";
    addEduBtn.textContent = "+ Add Education";
    headEdu.append(hEdu, addEduBtn);
    secEdu.append(headEdu);

    const eduList = data.education || [];
    const renderEduRows = () => {
      secEdu.querySelectorAll(".deliverable-exp-role-block").forEach((el) => el.remove());
      eduList.forEach((edu, idx) => {
        const block = document.createElement("div");
        block.className = "deliverable-exp-role-block";
        const topBar = document.createElement("div");
        topBar.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
        const h = document.createElement("h4");
        h.style.margin = "0";
        h.textContent = `${edu.degree_en || edu.degree_pt || "Degree"} · ${edu.institution_en || edu.institution_pt || "Institution"}`;
        
        const actWrap = document.createElement("div");
        actWrap.style.cssText = "display: flex; gap: 4px;";
        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.className = "media-btn-small";
        upBtn.textContent = "↑";
        upBtn.disabled = idx === 0;
        upBtn.onclick = () => {
          const tmp = eduList[idx - 1];
          eduList[idx - 1] = edu;
          eduList[idx] = tmp;
          eduList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderEduRows();
          markDeliverableDirty();
        };
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "media-btn-small";
        downBtn.textContent = "↓";
        downBtn.disabled = idx === eduList.length - 1;
        downBtn.onclick = () => {
          const tmp = eduList[idx + 1];
          eduList[idx + 1] = edu;
          eduList[idx] = tmp;
          eduList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderEduRows();
          markDeliverableDirty();
        };
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "media-btn-small";
        delBtn.textContent = "✕";
        delBtn.onclick = () => {
          eduList.splice(idx, 1);
          eduList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderEduRows();
          markDeliverableDirty();
        };
        actWrap.append(upBtn, downBtn, delBtn);
        topBar.append(h, actWrap);
        block.append(topBar);

        block.append(
          createBilingualInputRow("Degree Title", edu.degree_en, edu.degree_pt, (en, pt) => {
            edu.degree_en = en;
            edu.degree_pt = pt;
            markDeliverableDirty();
          })
        );
        block.append(
          createBilingualInputRow("Institution & Dates", edu.institution_en, edu.institution_pt, (en, pt) => {
            edu.institution_en = en;
            edu.institution_pt = pt;
            markDeliverableDirty();
          })
        );
        block.append(
          createBilingualInputRow("Detail / Thesis", edu.detail_en, edu.detail_pt, (en, pt) => {
            edu.detail_en = en;
            edu.detail_pt = pt;
            markDeliverableDirty();
          }, { tall: true })
        );
        secEdu.append(block);
      });
    };
    addEduBtn.onclick = () => {
      eduList.push({
        sort_order: String(eduList.length + 1),
        degree_en: "New Degree",
        degree_pt: "Novo Grau",
        institution_en: "Institution (Year)",
        institution_pt: "Instituição (Ano)",
        detail_en: "",
        detail_pt: "",
      });
      renderEduRows();
      markDeliverableDirty();
    };
    renderEduRows();
    container.append(secEdu);

    // 2. Publications
    const secPubs = document.createElement("div");
    secPubs.className = "deliverable-section-card";
    const headPubs = document.createElement("div");
    headPubs.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;";
    const hPubs = document.createElement("h3");
    hPubs.style.margin = "0";
    hPubs.textContent = "Publications (Shared across resumes)";
    const addPubBtn = document.createElement("button");
    addPubBtn.type = "button";
    addPubBtn.className = "mini-action-btn";
    addPubBtn.textContent = "+ Add Publication";
    headPubs.append(hPubs, addPubBtn);
    secPubs.append(headPubs);

    const pubsList = data.publications || [];
    const renderPubRows = () => {
      secPubs.querySelectorAll(".deliverable-exp-role-block").forEach((el) => el.remove());
      pubsList.forEach((pub, idx) => {
        const block = document.createElement("div");
        block.className = "deliverable-exp-role-block";
        const topBar = document.createElement("div");
        topBar.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
        const h = document.createElement("h4");
        h.style.margin = "0";
        h.textContent = pub.venue_en || `Publication #${idx + 1}`;

        const actWrap = document.createElement("div");
        actWrap.style.cssText = "display: flex; gap: 4px;";
        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.className = "media-btn-small";
        upBtn.textContent = "↑";
        upBtn.disabled = idx === 0;
        upBtn.onclick = () => {
          const tmp = pubsList[idx - 1];
          pubsList[idx - 1] = pub;
          pubsList[idx] = tmp;
          pubsList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderPubRows();
          markDeliverableDirty();
        };
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "media-btn-small";
        downBtn.textContent = "↓";
        downBtn.disabled = idx === pubsList.length - 1;
        downBtn.onclick = () => {
          const tmp = pubsList[idx + 1];
          pubsList[idx + 1] = pub;
          pubsList[idx] = tmp;
          pubsList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderPubRows();
          markDeliverableDirty();
        };
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "media-btn-small";
        delBtn.textContent = "✕";
        delBtn.onclick = () => {
          pubsList.splice(idx, 1);
          pubsList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderPubRows();
          markDeliverableDirty();
        };
        actWrap.append(upBtn, downBtn, delBtn);
        topBar.append(h, actWrap);
        block.append(topBar);

        block.append(
          createBilingualInputRow("Venue", pub.venue_en, pub.venue_pt, (en, pt) => {
            pub.venue_en = en;
            pub.venue_pt = pt;
            markDeliverableDirty();
          })
        );
        block.append(
          createBilingualInputRow("Citation / Paper Title", pub.citation_en, pub.citation_pt, (en, pt) => {
            pub.citation_en = en;
            pub.citation_pt = pt;
            markDeliverableDirty();
          })
        );
        secPubs.append(block);
      });
    };
    addPubBtn.onclick = () => {
      pubsList.push({
        sort_order: String(pubsList.length + 1),
        venue_en: "Conference / Journal (Year)",
        venue_pt: "Conferência / Periódico (Ano)",
        citation_en: "Paper title and author citation",
        citation_pt: "Título do artigo e citação dos autores",
      });
      renderPubRows();
      markDeliverableDirty();
    };
    renderPubRows();
    container.append(secPubs);

    // 3. Additional / Awards
    const secAdd = document.createElement("div");
    secAdd.className = "deliverable-section-card";
    const headAdd = document.createElement("div");
    headAdd.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;";
    const hAdd = document.createElement("h3");
    hAdd.style.margin = "0";
    hAdd.textContent = "Additional / Awards (Shared across resumes)";
    const addLineBtn = document.createElement("button");
    addLineBtn.type = "button";
    addLineBtn.className = "mini-action-btn";
    addLineBtn.textContent = "+ Add Award / Line";
    headAdd.append(hAdd, addLineBtn);
    secAdd.append(headAdd);

    const addList = data.additional || [];
    const renderAddRows = () => {
      secAdd.querySelectorAll(".deliverable-exp-role-block").forEach((el) => el.remove());
      addList.forEach((add, idx) => {
        const block = document.createElement("div");
        block.className = "deliverable-exp-role-block";
        const topBar = document.createElement("div");
        topBar.style.cssText = "display: flex; justify-content: space-between; align-items: center;";
        const h = document.createElement("h4");
        h.style.margin = "0";
        h.textContent = `Award / Line #${idx + 1}`;

        const actWrap = document.createElement("div");
        actWrap.style.cssText = "display: flex; gap: 4px;";
        const upBtn = document.createElement("button");
        upBtn.type = "button";
        upBtn.className = "media-btn-small";
        upBtn.textContent = "↑";
        upBtn.disabled = idx === 0;
        upBtn.onclick = () => {
          const tmp = addList[idx - 1];
          addList[idx - 1] = add;
          addList[idx] = tmp;
          addList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderAddRows();
          markDeliverableDirty();
        };
        const downBtn = document.createElement("button");
        downBtn.type = "button";
        downBtn.className = "media-btn-small";
        downBtn.textContent = "↓";
        downBtn.disabled = idx === addList.length - 1;
        downBtn.onclick = () => {
          const tmp = addList[idx + 1];
          addList[idx + 1] = add;
          addList[idx] = tmp;
          addList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderAddRows();
          markDeliverableDirty();
        };
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "media-btn-small";
        delBtn.textContent = "✕";
        delBtn.onclick = () => {
          addList.splice(idx, 1);
          addList.forEach((r, i) => (r.sort_order = String(i + 1)));
          renderAddRows();
          markDeliverableDirty();
        };
        actWrap.append(upBtn, downBtn, delBtn);
        topBar.append(h, actWrap);
        block.append(topBar);

        block.append(
          createBilingualInputRow(`Award / Line #${idx + 1}`, add.text_en, add.text_pt, (en, pt) => {
            add.text_en = en;
            add.text_pt = pt;
            markDeliverableDirty();
          })
        );
        secAdd.append(block);
      });
    };
    addLineBtn.onclick = () => {
      addList.push({
        sort_order: String(addList.length + 1),
        text_en: "New award or recognition line",
        text_pt: "Nova linha de premiação ou reconhecimento",
      });
      renderAddRows();
      markDeliverableDirty();
    };
    renderAddRows();
    container.append(secAdd);
  }

  async function saveDeliverableContent() {
    if (currentEditorState.saving) return;
    currentEditorState.saving = true;
    setDeliverableFooterStatus("Saving canonical CSVs and regenerating PDFs…");

    const saveBtn = document.getElementById("deliverable-save-btn");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Compiling…";
    }

    try {
      const { variant, tab } = currentEditorState;
      const settings = deliverablesCache.resumeSettings || {};
      const maxPages = settings[variant] || 1;
      const kind = tab === "portfolio" ? "portfolio" : "resume";
      const variantToSend = (tab === "shared") ? "all" : variant;

      const res = await fetch("/api/deliverables/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant: variantToSend,
          kind,
          max_pages: maxPages,
          deliverables: deliverablesCache.deliverables,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.ok === false) {
        throw new Error(result.error || `HTTP ${res.status}`);
      }

      deliverablesCache.deliverables = result.deliverables;
      deliverablesCache.resumeSettings = result.resumeSettings;
      deliverablesCache.priorityIndex = result.priority;
      downloadsCache = { items: result.downloads, policy: downloadsCache.policy, priority: result.priority };

      renderDownloads(downloadsCache.items, downloadsCache.policy);
      loadFreezeStatus();
      renderDeliverableEditor();
      currentEditorState.dirty = false;
      setDeliverableFooterStatus("Saved and successfully recompiled! Ready.", "ok");

      // Reload iframe if viewer open
      const viewerFrame = document.getElementById("resume-viewer-frame");
      if (viewerFrame && currentViewerItem && viewerFrame.src && !viewerFrame.src.includes("about:blank")) {
        const baseSrc = viewerFrame.src.split("?")[0];
        viewerFrame.src = `${baseSrc}?inline=1&t=${Date.now()}`;
      }
    } catch (err) {
      setDeliverableFooterStatus("Save failed: " + (err.message || String(err)), "err");
    } finally {
      currentEditorState.saving = false;
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save & Regenerate (Ctrl+S)";
      }
    }
  }

  function wireDeliverableEditor() {
    const modal = document.getElementById("deliverable-edit-modal");
    const closeBtn = document.getElementById("deliverable-edit-close");
    const saveBtn = document.getElementById("deliverable-save-btn");
    const previewEnBtn = document.getElementById("deliverable-preview-en-btn");
    const previewPtBtn = document.getElementById("deliverable-preview-pt-btn");
    const rebuildAllBtn = document.getElementById("rebuild-all-deliverables-btn");

    if (closeBtn) closeBtn.onclick = () => closeDeliverableEditor();
    if (saveBtn) saveBtn.onclick = () => saveDeliverableContent();

    if (rebuildAllBtn) {
      rebuildAllBtn.onclick = async () => {
        rebuildAllBtn.disabled = true;
        rebuildAllBtn.textContent = "Compiling all…";
        try {
          const res = await fetch("/api/deliverables/regenerate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ variant: "all", kind: "both" }),
          });
          await loadDownloads();
          setSaveStatus("All PDFs rebuilt.", "ok");
        } catch (err) {
          setSaveStatus("Rebuild error: " + (err.message || String(err)), "err");
        } finally {
          rebuildAllBtn.disabled = false;
          rebuildAllBtn.textContent = "Rebuild all PDFs";
        }
      };
    }

    // Variant pills
    document.querySelectorAll(".deliverable-variant-pills .variant-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentEditorState.variant = btn.dataset.variant;
        renderDeliverableEditor();
      });
    });

    // Tab buttons
    document.querySelectorAll(".deliverable-tabs-bar .deliverable-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentEditorState.tab = btn.dataset.tab;
        renderDeliverableEditor();
      });
    });

    // Constraint buttons
    const btn1p = document.getElementById("constraint-1p");
    const btn2p = document.getElementById("constraint-2p");
    if (btn1p) {
      btn1p.onclick = () => {
        if (!deliverablesCache.resumeSettings) deliverablesCache.resumeSettings = {};
        deliverablesCache.resumeSettings[currentEditorState.variant] = 1;
        // Also sync resumeSettings row in data
        let rows = deliverablesCache.deliverables.resumeSettings || [];
        let r = rows.find((x) => x.variant === currentEditorState.variant);
        if (!r) {
          r = { variant: currentEditorState.variant, max_pages: "1" };
          rows.push(r);
        } else {
          r.max_pages = "1";
        }
        deliverablesCache.deliverables.resumeSettings = rows;
        renderDeliverableEditor();
        markDeliverableDirty();
      };
    }
    if (btn2p) {
      btn2p.onclick = () => {
        if (!deliverablesCache.resumeSettings) deliverablesCache.resumeSettings = {};
        deliverablesCache.resumeSettings[currentEditorState.variant] = 2;
        let rows = deliverablesCache.deliverables.resumeSettings || [];
        let r = rows.find((x) => x.variant === currentEditorState.variant);
        if (!r) {
          r = { variant: currentEditorState.variant, max_pages: "2" };
          rows.push(r);
        } else {
          r.max_pages = "2";
        }
        deliverablesCache.deliverables.resumeSettings = rows;
        renderDeliverableEditor();
        markDeliverableDirty();
      };
    }

    // Preview EN / PT buttons
    const handlePreview = (lang) => {
      const { variant, tab } = currentEditorState;
      const kind = tab === "portfolio" ? "portfolio" : "resume";
      const item = (downloadsCache.items || []).find(
        (it) => it.variant === variant && it.kind === kind && it.lang === lang
      );
      if (item && item.available) {
        openResumeViewer(item);
      } else {
        alert(`${variant} ${kind} (${lang.toUpperCase()}) PDF is not yet compiled. Click 'Save & Regenerate' first.`);
      }
    };
    if (previewEnBtn) previewEnBtn.onclick = () => handlePreview("en");
    if (previewPtBtn) previewPtBtn.onclick = () => handlePreview("pt");

    // Shortcut Ctrl+S inside modal
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (modal && modal.open) {
          e.preventDefault();
          saveDeliverableContent();
        }
      }
    });
  }

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
      loadFreezeStatus();
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
      row.fit_ux_researcher = "no";
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

    if (collection === "projects") {
      const pImages = (portfolioImagesCache || []).filter((i) => i.project_id === row.id);
      if (pImages.length > 0) {
        const selCount = pImages.filter(
          (i) => (i.selected || "").toLowerCase() === "true" || i.selected === "1"
        ).length;
        const strip = document.createElement("div");
        strip.className = "project-portfolio-images-strip";

        const stripHead = document.createElement("div");
        stripHead.className = "project-images-strip-head";

        const stripLabel = document.createElement("span");
        stripLabel.className = "project-images-strip-label";
        stripLabel.textContent = `📷 Portfolio Images (${selCount}/${pImages.length} selected for deck)`;

        const manageBtn = document.createElement("button");
        manageBtn.type = "button";
        manageBtn.className = "project-images-manage-btn";
        manageBtn.textContent = "Manage in Portfolio";
        manageBtn.title = "Open Portfolio Editor to choose images";
        manageBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDeliverableEditor({ variant: "ux-researcher", tab: "portfolio" });
        };

        stripHead.append(stripLabel, manageBtn);
        strip.append(stripHead);

        const thumbs = document.createElement("div");
        thumbs.className = "project-images-thumbs-row";

        for (const img of pImages) {
          const isSel = (img.selected || "").toLowerCase() === "true" || img.selected === "1";
          const thumbCard = document.createElement("div");
          thumbCard.className = "project-thumb-item" + (isSel ? " is-selected" : " is-excluded");
          thumbCard.title = `${img.caption_en || img.path} — Click to toggle for portfolio deck`;

          const imgEl = document.createElement("img");
          imgEl.src = `/${img.path}`;
          imgEl.loading = "lazy";
          imgEl.alt = img.caption_en || "";

          const badge = document.createElement("span");
          badge.className = "thumb-mini-badge";
          badge.textContent = isSel ? "✓ In Deck" : "✕";

          thumbCard.append(imgEl, badge);

          thumbCard.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const nextSel = !((img.selected || "").toLowerCase() === "true" || img.selected === "1");
            img.selected = nextSel ? "true" : "false";
            thumbCard.classList.toggle("is-selected", nextSel);
            thumbCard.classList.toggle("is-excluded", !nextSel);
            badge.textContent = nextSel ? "✓ In Deck" : "✕";
            const newSelCount = pImages.filter(
              (i) => (i.selected || "").toLowerCase() === "true" || i.selected === "1"
            ).length;
            stripLabel.textContent = `📷 Portfolio Images (${newSelCount}/${pImages.length} selected for deck)`;
            // Save to server
            if (deliverablesCache?.deliverables) {
              stripLabel.textContent = `📷 Portfolio Images (${newSelCount}/${pImages.length}) — Saving & updating decks…`;
              deliverablesCache.deliverables.portfolioImages = portfolioImagesCache;
              try {
                await fetch("/api/deliverables/content", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    variant: "all",
                    kind: "portfolio",
                    deliverables: deliverablesCache.deliverables,
                  }),
                });
                stripLabel.textContent = `📷 Portfolio Images (${newSelCount}/${pImages.length} selected for deck) ✓`;
              } catch (err) {
                stripLabel.textContent = `📷 Portfolio Images (${newSelCount}/${pImages.length} selected) ✕ Save error`;
              }
            }
          };

          thumbs.append(thumbCard);
        }

        strip.append(thumbs);
        article.append(strip);
      }
    }

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
    const titles = ["Resumes", "Resume"];
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
        id: "contact-rg",
        label: "RG",
        en: cell(contactProfile.rg),
        pt: cell(contactProfile.rg),
        hay: `rg registro geral identidade ${cell(contactProfile.rg)}`.toLowerCase(),
      },
      {
        id: "contact-cpf",
        label: "CPF",
        en: cell(contactProfile.cpf),
        pt: cell(contactProfile.cpf),
        hay: `cpf cadastro de pessoas físicas ${cell(contactProfile.cpf)}`.toLowerCase(),
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
        id: "contact-site-da",
        label: "Data Analyst site",
        en: cell(contactProfile.site_data_analyst_url),
        pt: cell(contactProfile.site_data_analyst_url),
        hay: `site website portfolio github pages data analyst ${cell(contactProfile.site_data_analyst_url)}`.toLowerCase(),
      },
      {
        id: "contact-site-po",
        label: "Product Owner site",
        en: cell(contactProfile.site_product_owner_url),
        pt: cell(contactProfile.site_product_owner_url),
        hay: `site website portfolio github pages product owner ${cell(contactProfile.site_product_owner_url)}`.toLowerCase(),
      },
      {
        id: "contact-site-dsa",
        label: "Digital Solution Architect site",
        en: cell(contactProfile.site_digital_solution_architect_url),
        pt: cell(contactProfile.site_digital_solution_architect_url),
        hay: `site website portfolio github pages digital solution architect ${cell(contactProfile.site_digital_solution_architect_url)}`.toLowerCase(),
      },
      {
        id: "contact-site-uxr",
        label: "UX Researcher site",
        en: cell(contactProfile.site_ux_researcher_url),
        pt: cell(contactProfile.site_ux_researcher_url),
        hay: `site website portfolio github pages ux researcher design technologist ${cell(contactProfile.site_ux_researcher_url)}`.toLowerCase(),
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

  function closeResumePriority() {
    const dialog = document.getElementById("resume-priority-modal");
    if (dialog && dialog.open) dialog.close();
  }

  function initKeyboard() {
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") return;
        const priorityDialog = document.getElementById("resume-priority-modal");
        if (!priorityDialog || !priorityDialog.open) return;
        event.preventDefault();
        event.stopPropagation();
        priorityDialog.close();
      },
      true,
    );
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
        const priorityDialog = document.getElementById("resume-priority-modal");
        if (priorityDialog && priorityDialog.open) {
          event.preventDefault();
          closeResumePriority();
          return;
        }
        const resumeDialog = document.getElementById("resume-viewer-modal");
        if (resumeDialog && resumeDialog.open) {
          event.preventDefault();
          closeResumeViewer();
          return;
        }
        const lightboxDialog = document.querySelector(
          ".image-lightbox-modal[open]",
        );
        if (lightboxDialog) {
          event.preventDefault();
          lightboxDialog.close();
          lightboxDialog.remove();
          return;
        }
        const anonymizeDialog = document.getElementById("anonymize-studio");
        if (anonymizeDialog && anonymizeDialog.open) {
          event.preventDefault();
          anonymizeDialog.close();
          return;
        }
        const deliverableDialog = document.getElementById(
          "deliverable-edit-modal",
        );
        if (deliverableDialog && deliverableDialog.open) {
          event.preventDefault();
          closeDeliverableEditor();
          return;
        }
        const openDialog = document.querySelector("dialog[open]");
        if (openDialog) {
          event.preventDefault();
          openDialog.close();
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
      if (event.key.toLowerCase() === "p" || event.code === "KeyP") {
        event.preventDefault();
        scrollProfileToTop();
        return;
      }
      if (event.key.toLowerCase() === "c" || event.code === "KeyC") {
        event.preventDefault();
        openCompaniesWindow();
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
      let priority = downloadsCache.priority || null;
      try {
        const priorityRes = await fetch("/api/resume-priority");
        if (priorityRes.ok) priority = await priorityRes.json();
      } catch (err) {
        priority = downloadsCache.priority || null;
      }
      downloadsCache = {
        items: payload.items || [],
        policy: payload.resume_policy || null,
        priority,
      };
      renderDownloads(downloadsCache.items, downloadsCache.policy);
      loadFreezeStatus();
    } catch (err) {
      downloadsCache = { items: [], policy: null };
      const p = document.createElement("p");
      p.className = "downloads-error";
      p.textContent =
        "Could not load downloads: " + (err.message || String(err));
      root.append(p);
    }
  }

  let currentViewerItem = null;

  function openResumeViewer(item) {
    currentViewerItem = item;
    const dialog = document.getElementById("resume-viewer-modal");
    const frame = document.getElementById("resume-viewer-frame");
    const title = document.getElementById("resume-viewer-title");
    const dl = document.getElementById("resume-viewer-download");
    const copyBtn = document.getElementById("resume-viewer-copy-path");
    const editBtn = document.getElementById("resume-viewer-edit-btn");
    if (!dialog || !frame || !title || !dl) return;
    const pages = item.page_count != null ? ` · ${item.page_count} page` : "";
    title.textContent = `${item.label_en} · ${item.lang.toUpperCase()}${pages}`;
    const baseViewUrl = item.view_url || (item.url + "?inline=1");
    const sep = baseViewUrl.includes("?") ? "&" : "?";
    frame.src = `${baseViewUrl}${sep}t=${Date.now()}`;
    dl.href = item.url;
    dl.setAttribute("download", item.filename);
    if (editBtn) {
      editBtn.onclick = () => {
        closeResumeViewer();
        openDeliverableEditor({
          variant: item.variant,
          tab: item.kind === "portfolio" ? "portfolio" : "resume",
        });
      };
    }
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
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeResumeViewer();
      });
    }
    const priorityDialog = document.getElementById("resume-priority-modal");
    const priorityClose = document.getElementById("resume-priority-close");
    if (priorityClose) {
      priorityClose.addEventListener("click", () => {
        if (priorityDialog && priorityDialog.open) priorityDialog.close();
      });
    }
  }

  function topicLine(topic) {
    const mode = getLangMode();
    if (mode === "pt") return topic.text_pt || topic.text_en || "";
    return topic.text_en || topic.text_pt || "";
  }

  function topicSection(topic) {
    const mode = getLangMode();
    if (mode === "pt") return topic.section_pt || topic.section_en || "";
    return topic.section_en || topic.section_pt || "";
  }

  function priorityTile(title, count, className) {
    const tile = document.createElement("section");
    tile.className = `priority-tile ${className || ""}`.trim();
    const head = document.createElement("h3");
    head.textContent = title;
    if (count != null) {
      const mark = document.createElement("span");
      mark.className = "priority-count";
      mark.textContent = String(count);
      head.append(mark);
    }
    tile.append(head);
    return tile;
  }

  function priorityCard(topic, variant, canRaise) {
    const card = document.createElement("article");
    card.className = "priority-card";
    const kicker = document.createElement("div");
    kicker.className = "priority-card-kicker";
    kicker.textContent = topicSection(topic);
    const text = document.createElement("p");
    text.className = "priority-card-text";
    text.textContent = topicLine(topic);
    card.append(kicker, text);
    if (
      getLangMode() === "both" &&
      topic.text_pt &&
      topic.text_pt !== topic.text_en
    ) {
      const pt = document.createElement("p");
      pt.className = "priority-card-pt";
      pt.textContent = topic.text_pt;
      card.append(pt);
    }
    if (canRaise) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "download-btn download-btn-view";
      button.textContent = "Prioritize";
      button.addEventListener("click", () =>
        raiseResumeTopic(variant, topic.id),
      );
      card.append(button);
    }
    return card;
  }

  function groupTopics(topics) {
    const groups = [];
    const index = new Map();
    for (const topic of topics) {
      const key = topicSection(topic) || "Other";
      if (!index.has(key)) {
        const group = { title: key, topics: [] };
        index.set(key, group);
        groups.push(group);
      }
      index.get(key).topics.push(topic);
    }
    const rank = (group) => {
      const kind = group.topics[0] && group.topics[0].kind;
      const title = group.title.toLowerCase();
      if (title.startsWith("core") || title.startsWith("núcleo")) return 0;
      if (kind === "bullet") return 1;
      if (kind === "extra") return 2;
      return 3;
    };
    groups.sort((a, b) => {
      const byKind = rank(a) - rank(b);
      if (byKind) return byKind;
      const aMax = Math.max(...a.topics.map((topic) => topic.priority || 0));
      const bMax = Math.max(...b.topics.map((topic) => topic.priority || 0));
      return bMax - aMax;
    });
    return groups;
  }

  function appendGroupTile(parent, group) {
    const skills = group.topics.filter((topic) => topic.kind === "skill");
    const prose = group.topics.filter((topic) => topic.kind !== "skill");
    const tile = document.createElement("section");
    tile.className =
      "priority-tile priority-tile-group" +
      (prose.length ? " is-copy" : " is-chips");
    const head = document.createElement("h3");
    head.textContent = group.title;
    const mark = document.createElement("span");
    mark.className = "priority-count";
    mark.textContent = String(group.topics.length);
    head.append(mark);
    tile.append(head);
    if (skills.length) {
      const chips = document.createElement("div");
      chips.className = "priority-chips";
      for (const topic of skills) {
        const chip = document.createElement("span");
        chip.className = "priority-chip";
        chip.textContent = topicLine(topic);
        chips.append(chip);
      }
      tile.append(chips);
    }
    for (const topic of prose) {
      const line = document.createElement("p");
      line.className = "priority-line";
      line.textContent = topicLine(topic);
      tile.append(line);
    }
    parent.append(tile);
  }

  async function openResumePriority(variant, label) {
    const dialog = document.getElementById("resume-priority-modal");
    const title = document.getElementById("resume-priority-title");
    const body = document.getElementById("resume-priority-body");
    if (!dialog || !title || !body) return;
    title.textContent = `${label} · left off this page`;
    body.replaceChildren();
    const loading = document.createElement("p");
    loading.className = "resume-priority-intro";
    loading.textContent = "Loading the priority list…";
    body.append(loading);
    if (typeof dialog.showModal === "function" && !dialog.open)
      dialog.showModal();
    try {
      const res = await fetch("/api/resume-priority");
      const data = await res.json();
      renderResumePriority(variant, label, data);
    } catch (err) {
      body.replaceChildren();
      const fail = document.createElement("p");
      fail.className = "resume-priority-intro";
      fail.textContent = "The priority list could not be loaded.";
      body.append(fail);
    }
  }

  function renderResumePriority(variant, label, data) {
    const title = document.getElementById("resume-priority-title");
    const body = document.getElementById("resume-priority-body");
    if (!title || !body) return;
    title.textContent = `${label} · left off this page`;
    body.replaceChildren();
    const entry = data && data.variants ? data.variants[variant] : null;
    if (!entry) {
      const empty = document.createElement("p");
      empty.className = "resume-priority-intro";
      empty.textContent =
        "The priority list has not been built for this resume yet.";
      body.append(empty);
      return;
    }
    const off = entry.deprioritized || [];
    const kept = (entry.kept || []).filter((topic) => !topic.pinned);
    const edge = kept.slice(0, 6);
    const rest = kept.slice(6);
    const pages = entry.pages || {};

    const bento = document.createElement("div");
    bento.className = "priority-bento";

    const stats = document.createElement("div");
    stats.className = "priority-stats";
    const stat = (value, caption, extra) => {
      const box = document.createElement("div");
      box.className = `priority-stat ${extra || ""}`.trim();
      const strong = document.createElement("strong");
      strong.textContent = value;
      const label = document.createElement("span");
      label.textContent = caption;
      box.append(strong, label);
      return box;
    };
    stats.append(
      stat(String(off.length), "Left off the page", "is-off"),
      stat(String(kept.length), "On this page", "is-on"),
      stat(
        entry.one_page ? `${pages.en || 1} · ${pages.pt || 1}` : "Over",
        entry.one_page ? "EN and PT pages" : "Still over one page",
      ),
    );
    bento.append(stats);

    const offTile = priorityTile(
      "Left off the page",
      off.length,
      "priority-tile-off",
    );
    if (!off.length) {
      const none = document.createElement("p");
      none.className = "priority-tile-note";
      none.textContent = "Every topic still fits on the one page.";
      offTile.append(none);
    } else {
      for (const topic of off)
        offTile.append(priorityCard(topic, variant, true));
    }
    bento.append(offTile);

    const edgeTile = priorityTile(
      "Lowest on this page",
      edge.length,
      "priority-tile-edge",
    );
    const edgeNote = document.createElement("p");
    edgeNote.className = "priority-tile-note";
    edgeNote.textContent = "These stay on the page and would leave first.";
    edgeTile.append(edgeNote);
    const edgeSkills = edge.filter((topic) => topic.kind === "skill");
    const edgeProse = edge.filter((topic) => topic.kind !== "skill");
    if (edgeSkills.length) {
      const chips = document.createElement("div");
      chips.className = "priority-chips";
      for (const topic of edgeSkills) {
        const chip = document.createElement("span");
        chip.className = "priority-chip";
        chip.textContent = topicLine(topic);
        chips.append(chip);
      }
      edgeTile.append(chips);
    }
    for (const topic of edgeProse)
      edgeTile.append(priorityCard(topic, variant, false));
    bento.append(edgeTile);

    const onTile = priorityTile(
      "On this page",
      rest.length,
      "priority-tile-on",
    );
    const groups = document.createElement("div");
    groups.className = "priority-groups";
    for (const group of groupTopics(rest)) appendGroupTile(groups, group);
    onTile.append(groups);
    const pin = document.createElement("p");
    pin.className = "priority-tile-note";
    pin.textContent = "The opening line of the current role stays on the page.";
    onTile.append(pin);
    bento.append(onTile);

    body.append(bento);
  }

  async function raiseResumeTopic(variant, topicId) {
    const body = document.getElementById("resume-priority-body");
    const title = document.getElementById("resume-priority-title");
    const label = title
      ? title.textContent.replace(/ · left off this page$/, "")
      : variant;
    if (body) {
      body.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
      const status = document.createElement("p");
      status.className = "resume-priority-intro";
      status.textContent = "Rebuilding the one-page resume…";
      body.prepend(status);
    }
    const res = await fetch("/api/resume-priority", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variant, topic_id: topicId }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      if (body) {
        const fail = document.createElement("p");
        fail.className = "resume-priority-intro";
        fail.textContent =
          "The resume could not be rebuilt. Close the PDF if it is open, then try again.";
        body.prepend(fail);
      }
      return;
    }
    const index = await fetch("/api/resume-priority").then((response) =>
      response.json(),
    );
    renderResumePriority(variant, label, index);
    loadDownloads();
  }

  function leftOffCount(variant) {
    const entry = downloadsCache.priority?.variants?.[variant];
    if (!entry) return null;
    return (entry.deprioritized || []).length;
  }

  function buildLeftOffControl(variant, label) {
    const count = leftOffCount(variant);
    const known = Number.isFinite(count);
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "resume-priority-open" + (known && count > 0 ? " has-left" : "");
    button.textContent =
      known && count > 0 ? `Left off · ${count}` : "Left off";
    button.title =
      known && count > 0
        ? `${count} topic${count === 1 ? "" : "s"} left off this one-page resume`
        : "Topics on this page, and any that had to wait";
    button.addEventListener("click", () => openResumePriority(variant, label));
    return button;
  }

  function renderDownloads(items, policy) {
    const root = document.getElementById("downloads-root");
    if (!root) return;
    root.replaceChildren();

    const order = [
      "ux-researcher",
      "digital-solution-architect",
      "data-analyst",
      "product-owner",
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

      const head = document.createElement("div");
      head.className = "download-card-header-row";

      const heading = document.createElement("h3");
      heading.className = "download-card-title";
      if (window.CareerPathIcons) {
        heading.append(
          window.CareerPathIcons.labelWithIcon(variant, group[0].label_en),
        );
      } else {
        heading.textContent = group[0].label_en;
      }

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "download-edit-btn";
      editBtn.textContent = "Edit content";
      editBtn.title = `Edit content for ${group[0].label_en} (Resume)`;
      editBtn.addEventListener("click", () => {
        openDeliverableEditor({ variant, tab: "resume" });
      });

      head.append(heading, editBtn);
      card.append(head);
      card.append(buildLeftOffControl(variant, group[0].label_en));

      const resumes = group.filter((i) => i.kind === "resume");

      card.append(
        buildDownloadRow("Resume", resumes, { isResume: true, policy, variant }),
      );
      root.append(card);
    }

    if (!root.childElementCount) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = pathFilter
        ? "No resumes for this career path."
        : "No resume files found.";
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
    row.append(label);

    const actions = document.createElement("div");
    actions.className = "download-actions";

    if (opts?.variant) {
      const rowEditBtn = document.createElement("button");
      rowEditBtn.type = "button";
      rowEditBtn.className = "download-btn download-btn-edit";
      rowEditBtn.textContent = "Edit";
      rowEditBtn.title = `Edit ${opts.isResume ? "resume" : "portfolio"} content`;
      rowEditBtn.addEventListener("click", () => {
        openDeliverableEditor({
          variant: opts.variant,
          tab: opts.isResume ? "resume" : "portfolio",
        });
      });
      actions.append(rowEditBtn);
    }

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
    wireDeliverableEditor();
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
    const openOpeningsBtn = document.getElementById("open-openings-btn");
    if (openOpeningsBtn) {
      openOpeningsBtn.addEventListener("click", () => openJobsWindow());
    }
    const openProfileBtn = document.getElementById("open-profile-btn");
    if (openProfileBtn) {
      openProfileBtn.addEventListener("click", () => scrollProfileToTop());
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
      await loadPortfolioImages();
      renderAll();
      setDirty(false);
      setSaveStatus("");
    } catch (err) {
      setSaveStatus("Load error: " + (err.message || String(err)), "err");
    }
    await loadDownloads();
    wireFreezeControls();
    await loadFreezeStatus();
  }

  let freezeCache = null;
  let freezeActiveTab = "all";

  function formatFreezeDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function loadFreezeStatus() {
    const badge = document.getElementById("freeze-status-badge");
    if (!badge) return;
    try {
      const res = await fetch("/api/freeze/status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      freezeCache = await res.json();
      renderFreezeBadge();
      const modal = document.getElementById("freeze-diff-modal");
      if (modal && modal.open) {
        renderFreezeModal();
      }
    } catch (err) {
      badge.textContent = "Freeze status unavailable";
      badge.className = "freeze-status-badge is-warn";
    }
  }

  function renderFreezeBadge() {
    const badge = document.getElementById("freeze-status-badge");
    if (!badge || !freezeCache) return;
    if (!freezeCache.frozen) {
      badge.textContent = "Not frozen yet";
      badge.className = "freeze-status-badge is-warn";
      badge.title = "Click Freeze to save the current baseline";
      return;
    }
    const when = formatFreezeDate(freezeCache.manifest?.frozen_at);
    const total = freezeCache.summary?.total_changed || 0;
    if (total === 0) {
      badge.textContent = `Frozen (${when}) · In sync`;
      badge.className = "freeze-status-badge is-ok";
    } else {
      badge.textContent = `Frozen (${when}) · ${total} changed`;
      badge.className = "freeze-status-badge is-changed";
    }
    badge.title = freezeCache.manifest?.note
      ? `Frozen note: ${freezeCache.manifest.note}`
      : "Baseline comparison status";
  }

  function renderFreezeModal() {
    const body = document.getElementById("freeze-diff-body");
    const meta = document.getElementById("freeze-modal-meta");
    if (!body || !freezeCache) return;

    if (meta) {
      if (!freezeCache.frozen) {
        meta.textContent = "No frozen baseline saved yet.";
      } else {
        const when = formatFreezeDate(freezeCache.manifest?.frozen_at);
        const note = freezeCache.manifest?.note
          ? ` — “${freezeCache.manifest.note}”`
          : "";
        const total = freezeCache.summary?.total_changed || 0;
        meta.textContent = `Baseline: ${when}${note} (${total} changed)`;
      }
    }

    body.replaceChildren();

    if (freezeActiveTab === "history") {
      const history = freezeCache.history || [];
      if (!history.length) {
        const empty = document.createElement("p");
        empty.className = "freeze-empty";
        empty.textContent = "No freeze checkpoints recorded yet.";
        body.append(empty);
        return;
      }
      for (const entry of history) {
        const card = document.createElement("div");
        card.className = "freeze-history-card";
        const head = document.createElement("div");
        head.className = "freeze-history-head";
        const title = document.createElement("strong");
        title.textContent = formatFreezeDate(entry.frozen_at);
        const count = document.createElement("span");
        count.className = "freeze-diff-counts";
        count.textContent = `${entry.changed_count || 0} changed files`;
        head.append(title, count);
        card.append(head);
        if (entry.note) {
          const noteEl = document.createElement("p");
          noteEl.className = "freeze-history-note";
          noteEl.textContent = entry.note;
          card.append(noteEl);
        }
        const files = entry.changed_files || [];
        if (files.length) {
          const ul = document.createElement("ul");
          ul.className = "freeze-history-files";
          for (const f of files) {
            const li = document.createElement("li");
            li.textContent = `[${f.category}] ${f.path} (+${f.additions}/-${f.deletions})`;
            ul.append(li);
          }
          card.append(ul);
        }
        body.append(card);
      }
      return;
    }

    if (!freezeCache.frozen) {
      const empty = document.createElement("p");
      empty.className = "freeze-empty";
      empty.textContent =
        "No frozen baseline yet. Click 'Freeze current version' below to create one.";
      body.append(empty);
      return;
    }

    const changes = (freezeCache.changes || []).filter(
      (c) => freezeActiveTab === "all" || c.category === freezeActiveTab,
    );

    if (!changes.length) {
      const empty = document.createElement("p");
      empty.className = "freeze-empty";
      empty.textContent =
        freezeActiveTab === "all"
          ? "Everything matches the frozen baseline (0 changes)."
          : `No changes in ${freezeActiveTab} compared to the frozen baseline.`;
      body.append(empty);
      return;
    }

    for (const item of changes) {
      const card = document.createElement("div");
      card.className = "freeze-diff-card";

      const head = document.createElement("div");
      head.className = "freeze-diff-head";
      const pathEl = document.createElement("code");
      pathEl.className = "freeze-diff-path";
      pathEl.textContent = item.path;

      const metaWrap = document.createElement("span");
      metaWrap.className = "freeze-diff-counts";
      metaWrap.textContent = `${item.category} · ${item.status} · +${item.additions} / -${item.deletions}`;

      head.append(pathEl, metaWrap);
      card.append(head);

      const pre = document.createElement("pre");
      pre.className = "freeze-diff-pre";
      for (const line of item.diff_lines || []) {
        const span = document.createElement("span");
        span.className = "freeze-diff-line";
        if (line.startsWith("+") && !line.startsWith("+++")) {
          span.classList.add("is-add");
        } else if (line.startsWith("-") && !line.startsWith("---")) {
          span.classList.add("is-del");
        } else if (line.startsWith("@@")) {
          span.classList.add("is-hunk");
        }
        span.textContent = line + "\n";
        pre.append(span);
      }
      if (item.truncated) {
        const trunc = document.createElement("span");
        trunc.className = "freeze-diff-line is-hunk";
        trunc.textContent = "… (diff truncated for display)\n";
        pre.append(trunc);
      }
      card.append(pre);
      body.append(card);
    }
  }

  async function openFreezeModal() {
    await loadFreezeStatus();
    const modal = document.getElementById("freeze-diff-modal");
    if (!modal) return;
    renderFreezeModal();
    if (typeof modal.showModal === "function" && !modal.open) {
      modal.showModal();
    }
  }

  async function triggerFreezeNow(noteValue) {
    const note =
      typeof noteValue === "string"
        ? noteValue
        : window.prompt("Optional review note for this frozen baseline:", "") ?? null;
    if (note === null) return;
    try {
      setSaveStatus("Freezing baseline…");
      const res = await fetch("/api/freeze/now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      freezeCache = {
        ok: true,
        ...(data.status || {}),
        history: data.history || [],
      };
      renderFreezeBadge();
      const noteInput = document.getElementById("freeze-note-input");
      if (noteInput) noteInput.value = "";
      const modal = document.getElementById("freeze-diff-modal");
      if (modal && modal.open) {
        renderFreezeModal();
      }
      setSaveStatus("Baseline frozen", "ok");
    } catch (err) {
      setSaveStatus("Freeze failed: " + (err.message || String(err)), "err");
    }
  }

  function wireFreezeControls() {
    const compareBtn = document.getElementById("freeze-compare-btn");
    const freezeBtn = document.getElementById("freeze-now-btn");
    const modal = document.getElementById("freeze-diff-modal");
    const closeBtn = document.getElementById("freeze-diff-close");
    const modalFreezeBtn = document.getElementById("freeze-modal-freeze-btn");

    if (compareBtn) {
      compareBtn.addEventListener("click", () => openFreezeModal());
    }
    if (freezeBtn) {
      freezeBtn.addEventListener("click", () => triggerFreezeNow());
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.close());
    }
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.close();
      });
    }
    if (modalFreezeBtn) {
      modalFreezeBtn.addEventListener("click", () => {
        const noteInput = document.getElementById("freeze-note-input");
        triggerFreezeNow(noteInput ? noteInput.value : "");
      });
    }
    document.querySelectorAll("[data-freeze-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        freezeActiveTab = btn.dataset.freezeTab || "all";
        document.querySelectorAll("[data-freeze-tab]").forEach((b) => {
          const active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        renderFreezeModal();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
