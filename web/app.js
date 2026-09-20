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
          { label: labels.company, pt: x.company, en: x.company },
          { label: labels.dateRange, pt: x.date_pt, en: x.date_en },
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
    renderProjects(document.getElementById("projects-root"));
    renderEducation(document.getElementById("education-root"));
    renderExperience(document.getElementById("experience-root"));
    renderLanguages(document.getElementById("languages-root"));
    initKeyboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
