(() => {
  const labels = window.CAREER_LABELS;
  const LANG_KEY = "career-cockpit-lang";
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
  ];

  /** CSV column sets (must match python/canonical_store.py). */
  const SCHEMAS = {
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
    languages: ["id", "sort_order", "name_en", "name_pt", "level_en", "level_pt"],
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
  };

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
      { label: "projectDescription", pt: "summary_pt", en: "summary_en", tall: true },
      { label: "projectNotes", pt: "notes_pt", en: "notes_en", tall: true },
      { label: "projectCsi", mono: "csi" },
      { label: "projectNps", mono: "nps" },
    ],
    education: [
      { label: "degree", pt: "degree_pt", en: "degree_en" },
      { label: "institution", pt: "institution_pt", en: "institution_en" },
      { label: "fieldOfStudy", pt: "field_pt", en: "field_en" },
      { label: "dateRange", pt: "date_display_pt", en: "date_display_en" },
      { label: "activities", pt: "activities_pt", en: "activities_en", tall: true },
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
      { label: "recognitionDate", pt: "date_display_pt", en: "date_display_en" },
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
  };

  const SECTION_META = {
    about: { root: "about-root", title: { en: "About", pt: "Sobre" }, canAdd: false },
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
  };

  let state = {};
  let dirty = false;
  let saving = false;

  function stripMarkdown(text) {
    if (text == null || text === "") return "";
    return String(text).replace(/\*\*/g, "");
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
      const text = stripMarkdown(getValue());
      if (!text.trim()) return;
      copyWithFeedback(text, btn);
    });
    return btn;
  }

  function createEditableCell(lang, row, key, tall) {
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
    input.rows = tall ? 4 : 2;
    input.value = cell(row[key]);
    input.addEventListener("input", () => {
      row[key] = input.value;
      setDirty(true);
      setSaveStatus("");
    });

    wrap.append(tag, input);
    cellEl.append(wrap, createCopyButton(() => row[key]));
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
      rowEl.append(
        createEditableCell("PT", row, spec.mono, spec.tall),
        createEditableCell("EN", row, spec.mono, spec.tall),
      );
      // Keep both cells in sync for mono fields
      const inputs = rowEl.querySelectorAll(".field-input");
      inputs.forEach((input) => {
        input.addEventListener("input", () => {
          const v = input.value;
          row[spec.mono] = v;
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
        state[collection].splice(index, 1);
        setDirty(true);
        setSaveStatus("");
        renderAll();
      });
      head.append(del);
    }

    article.append(head);

    for (const spec of FIELD_SPECS[collection]) {
      article.append(createFieldRow(spec.label, row, spec));
    }
    return article;
  }

  function renderSection(collection) {
    const meta = SECTION_META[collection];
    const root = document.getElementById(meta.root);
    if (!root) return;
    root.replaceChildren();
    const rows = state[collection] || [];
    rows.forEach((row, i) => root.append(createPanel(collection, row, i)));
  }

  function renderAll() {
    for (const key of COLLECTION_KEYS) renderSection(key);
  }

  function wireAddButtons() {
    document.querySelectorAll("[data-add-collection]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const collection = btn.getAttribute("data-add-collection");
        if (!SECTION_META[collection]?.canAdd) return;
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
      state.about = [
        { id: "about", sort_order: "1", text_en: "", text_pt: "" },
      ];
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
      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        togglePanelsCollapsed();
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
    initLangMode();
    const saveBtn = document.getElementById("save-btn");
    if (saveBtn) saveBtn.addEventListener("click", () => saveAll());
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
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
