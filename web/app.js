(() => {
  const data = window.CAREER_DATA;
  const EMPTY = "—";

  function stripMarkdown(text) {
    if (text == null || text === "") return "";
    return String(text).replace(/\*\*/g, "");
  }

  function displayValue(raw) {
    const cleaned = stripMarkdown(raw);
    return cleaned === "" ? EMPTY : cleaned;
  }

  function isEmpty(raw) {
    return raw == null || String(raw).trim() === "";
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
    try {
      await copyText(text);
      button.textContent = "Copiado";
      button.classList.add("ok");
      button.classList.remove("err");
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("ok");
      }, 1200);
    } catch {
      button.textContent = "Erro";
      button.classList.add("err");
      button.classList.remove("ok");
      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("err");
      }, 1500);
    }
  }

  function createCopyButton(raw) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.dataset.label = "Copy";
    btn.textContent = "Copy";

    if (isEmpty(raw)) {
      btn.disabled = true;
      btn.title = "No value to copy";
      return btn;
    }

    const text = stripMarkdown(raw);
    btn.title = "Copy to clipboard";
    btn.addEventListener("click", () => copyWithFeedback(text, btn));
    return btn;
  }

  function createFieldCell(lang, raw) {
    const cell = document.createElement("div");
    cell.className = "field-cell";

    const wrap = document.createElement("div");
    wrap.style.minWidth = "0";
    wrap.style.flex = "1";

    const tag = document.createElement("span");
    tag.className = "lang-tag";
    tag.textContent = lang;

    const value = document.createElement("p");
    value.className = "field-value" + (isEmpty(raw) ? " empty" : "");
    value.textContent = displayValue(raw);

    wrap.append(tag, value);
    cell.append(wrap, createCopyButton(raw));
    return cell;
  }

  function createFieldRow(label, ptValue, enValue) {
    const row = document.createElement("div");
    row.className = "field-row";

    const labelEl = document.createElement("div");
    labelEl.className = "field-label";

    const en = document.createElement("span");
    en.className = "field-label-en";
    en.textContent = label.en;

    const pt = document.createElement("span");
    pt.className = "field-label-pt";
    pt.textContent = label.pt;

    labelEl.append(en, pt);
    row.append(
      labelEl,
      createFieldCell("PT", ptValue),
      createFieldCell("EN", enValue),
    );
    return row;
  }

  function createPanel(title, fields) {
    const article = document.createElement("article");
    article.className = "panel";

    const heading = document.createElement("h3");
    heading.className = "panel-heading";
    heading.textContent = title;

    article.append(heading);
    for (const field of fields) {
      article.append(createFieldRow(field.label, field.pt, field.en));
    }
    return article;
  }

  function renderAbout(root) {
    root.replaceChildren();
    const { labels, about } = data;
    root.append(
      createPanel("Sobre / About", [
        { label: labels.aboutText, pt: about.text_pt, en: about.text_en },
      ]),
    );
  }

  function renderTargetTitles(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const t of data.targetTitles) {
      const title = t.title_en || t.title_pt || t.id;
      root.append(
        createPanel(title, [
          { label: labels.targetTitle, pt: t.title_pt, en: t.title_en },
          {
            label: labels.careerPath,
            pt: t.path_pt,
            en: t.path_en,
          },
          { label: labels.titleKind, pt: t.kind_pt, en: t.kind_en },
          {
            label: labels.titleSource,
            pt: t.source_pt,
            en: t.source_en,
          },
        ]),
      );
    }
  }

  function renderProjects(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const p of data.projects) {
      const title = p.name_en || p.name_pt || p.id;
      root.append(
        createPanel(title, [
          { label: labels.projectName, pt: p.name_pt, en: p.name_en },
          {
            label: labels.projectDescription,
            pt: p.summary_pt,
            en: p.summary_en,
          },
          { label: labels.projectStart, pt: p.start_pt, en: p.start_en },
          { label: labels.projectEnd, pt: p.end_pt, en: p.end_en },
        ]),
      );
    }
  }

  function renderEducation(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const e of data.education) {
      const title = e.degree_en || e.degree_pt || e.id;
      root.append(
        createPanel(title, [
          { label: labels.degree, pt: e.degree_pt, en: e.degree_en },
          {
            label: labels.institution,
            pt: e.institution_pt,
            en: e.institution_en,
          },
          {
            label: labels.fieldOfStudy,
            pt: e.field_pt,
            en: e.field_en,
          },
          { label: labels.dateRange, pt: e.date_pt, en: e.date_en },
          {
            label: labels.activities,
            pt: e.activities_pt,
            en: e.activities_en,
          },
          {
            label: labels.educationDescription,
            pt: e.description_pt,
            en: e.description_en,
          },
          {
            label: labels.relatedSkills,
            pt: e.skills_pt,
            en: e.skills_en,
          },
        ]),
      );
    }
  }

  function renderExperience(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const x of data.experience) {
      const title = x.title_en || x.title_pt || x.id;
      root.append(
        createPanel(title, [
          { label: labels.jobTitle, pt: x.title_pt, en: x.title_en },
          {
            label: labels.company,
            pt: x.company_pt,
            en: x.company_en,
          },
          {
            label: labels.employmentType,
            pt: x.employment_type_pt,
            en: x.employment_type_en,
          },
          { label: labels.dateRange, pt: x.date_pt, en: x.date_en },
          {
            label: labels.location,
            pt: x.location_pt,
            en: x.location_en,
          },
          {
            label: labels.workArrangement,
            pt: x.work_arrangement_pt,
            en: x.work_arrangement_en,
          },
          {
            label: labels.experienceDescription,
            pt: x.description_pt,
            en: x.description_en,
          },
          {
            label: labels.relatedSkills,
            pt: x.skills_pt,
            en: x.skills_en,
          },
          { label: labels.media, pt: x.media_pt, en: x.media_en },
        ]),
      );
    }
  }

  function renderLanguages(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const lang of data.languages) {
      const title = lang.name_en || lang.name_pt || lang.id;
      root.append(
        createPanel(title, [
          { label: labels.language, pt: lang.name_pt, en: lang.name_en },
          { label: labels.proficiency, pt: lang.level_pt, en: lang.level_en },
        ]),
      );
    }
  }

  function renderRecognitions(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const r of data.recognitions) {
      const title = r.title_en || r.title_pt || r.id;
      root.append(
        createPanel(title, [
          { label: labels.recognitionTitle, pt: r.title_pt, en: r.title_en },
          { label: labels.issuer, pt: r.issuer_pt, en: r.issuer_en },
          { label: labels.recognitionDate, pt: r.date_pt, en: r.date_en },
          {
            label: labels.associatedWith,
            pt: r.associated_with,
            en: r.associated_with,
          },
          {
            label: labels.recognitionDescription,
            pt: r.description_pt,
            en: r.description_en,
          },
        ]),
      );
    }
  }

  function renderCourses(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const c of data.courses) {
      const title = c.title_en || c.title_pt || c.id;
      root.append(
        createPanel(title, [
          { label: labels.courseTitle, pt: c.title_pt, en: c.title_en },
          {
            label: labels.associatedWith,
            pt: c.associated_pt,
            en: c.associated_en,
          },
        ]),
      );
    }
  }

  function renderCompetences(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const c of data.competences) {
      const title = c.name_en || c.name_pt || c.id;
      const assessmentEn = c.linkedin_assessment
        ? "Passed LinkedIn skill assessment"
        : null;
      const assessmentPt = c.linkedin_assessment
        ? "Passou na avaliação de competências do LinkedIn"
        : null;
      const endorsementsEn =
        c.endorsements != null ? String(c.endorsements) : null;
      const endorsementsPt = endorsementsEn;
      root.append(
        createPanel(title, [
          { label: labels.competenceName, pt: c.name_pt, en: c.name_en },
          {
            label: labels.competenceCategory,
            pt: c.category_pt,
            en: c.category_en,
          },
          {
            label: labels.associatedWith,
            pt: c.associated_pt,
            en: c.associated_en,
          },
          {
            label: labels.endorsements,
            pt: endorsementsPt,
            en: endorsementsEn,
          },
          {
            label: labels.linkedinAssessment,
            pt: assessmentPt,
            en: assessmentEn,
          },
        ]),
      );
    }
  }

  function renderVolunteering(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const v of data.volunteering) {
      const title = v.title_en || v.title_pt || v.id;
      root.append(
        createPanel(title, [
          { label: labels.volunteerTitle, pt: v.title_pt, en: v.title_en },
          {
            label: labels.organization,
            pt: v.organization_pt,
            en: v.organization_en,
          },
          { label: labels.dateRange, pt: v.date_pt, en: v.date_en },
          { label: labels.cause, pt: v.cause_pt, en: v.cause_en },
          {
            label: labels.volunteerDescription,
            pt: v.description_pt,
            en: v.description_en,
          },
        ]),
      );
    }
  }

  function renderCertifications(root) {
    root.replaceChildren();
    const { labels } = data;
    for (const c of data.certifications) {
      const title = c.title_en || c.title_pt || c.id;
      root.append(
        createPanel(title, [
          {
            label: labels.certificationTitle,
            pt: c.title_pt,
            en: c.title_en,
          },
          { label: labels.issuer, pt: c.issuer_pt, en: c.issuer_en },
          { label: labels.issuedOn, pt: c.issued_pt, en: c.issued_en },
          { label: labels.expiresOn, pt: c.expires_pt, en: c.expires_en },
          {
            label: labels.credentialId,
            pt: c.credential_id,
            en: c.credential_id,
          },
          {
            label: labels.relatedSkills,
            pt: c.skills_pt,
            en: c.skills_en,
          },
          {
            label: labels.credentialFile,
            pt: c.credential_file,
            en: c.credential_file,
          },
        ]),
      );
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
      if (
        !event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }
      if (event.key.toLowerCase() !== "e") return;
      event.preventDefault();
      togglePanelsCollapsed();
    });
  }

  function init() {
    renderAbout(document.getElementById("about-root"));
    renderTargetTitles(document.getElementById("titles-root"));
    renderProjects(document.getElementById("projects-root"));
    renderEducation(document.getElementById("education-root"));
    renderExperience(document.getElementById("experience-root"));
    renderLanguages(document.getElementById("languages-root"));
    renderRecognitions(document.getElementById("recognitions-root"));
    renderCourses(document.getElementById("courses-root"));
    renderCompetences(document.getElementById("competences-root"));
    renderVolunteering(document.getElementById("volunteering-root"));
    renderCertifications(document.getElementById("certifications-root"));
    initKeyboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
