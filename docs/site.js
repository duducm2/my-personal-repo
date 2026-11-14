let lang = "en";
try {
  const saved = localStorage.getItem("portfolio-lang");
  if (saved === "en" || saved === "pt") lang = saved;
  else if ((navigator.language || "").toLowerCase().startsWith("pt"))
    lang = "pt";
} catch (error) {
  lang = "en";
}
let stepIndex = 0;

function resolveMedia(src) {
  if (!src) return src;
  return (window.ANON_MAP && window.ANON_MAP[src]) || src;
}

function getLocalCoverMap() {
  try {
    return JSON.parse(localStorage.getItem("portfolio-cover-map") || "{}") || {};
  } catch {
    return {};
  }
}

function setDeliverableCover(itemId, src) {
  const map = getLocalCoverMap();
  map[itemId] = src;
  try {
    localStorage.setItem("portfolio-cover-map", JSON.stringify(map));
  } catch {
    /* ignore */
  }
  renderDeliverables();
}

function orderedDeliverableMedia(item) {
  const media = Array.isArray(item?.media) ? item.media : [];
  if (media.length <= 1) return media;
  const preferred = getLocalCoverMap()[item.id] || (window.COVER_MAP && window.COVER_MAP[item.id]);
  if (!preferred) return media;
  const idx = media.findIndex((m) => m.src === preferred);
  if (idx <= 0) return media;
  return [media[idx], ...media.slice(0, idx), ...media.slice(idx + 1)];
}

function activePath() {
  return PATH_COPY[lang];
}

function applyPath() {
  const pathCopy = activePath();
  if (!pathCopy) return;
  document.title = `Eduardo Figueiredo — ${pathCopy.label}`;
  const set = (id, text) => {
    const node = document.getElementById(id);
    if (node && text) node.textContent = text;
  };
  const eyebrow = document.getElementById("path-eyebrow");
  if (eyebrow && pathCopy.eyebrow) {
    const [role, place] = pathCopy.eyebrow.split(" · ");
    eyebrow.replaceChildren(document.createTextNode(role));
    if (place) {
      const placeNode = document.createElement("span");
      placeNode.className = "eyebrow-place";
      placeNode.textContent = place;
      eyebrow.append(placeNode);
    }
  }
  set("path-role", pathCopy.role);
  set("path-lede", pathCopy.lede);
  set("why-title", pathCopy.whyTitle);
  set("why-a", pathCopy.whyA);
  set("why-b", pathCopy.whyB);
  set("present-title", pathCopy.presentTitle);
  set("present-lead", pathCopy.presentLead);
  set("next-title", pathCopy.nextTitle);
  const contactLead = document.querySelector(
    "#contact > p:not(.fine):not(.kicker)",
  );
  if (contactLead && pathCopy.contactLead)
    contactLead.textContent = pathCopy.contactLead;
  document.querySelectorAll("#steps button").forEach((button, index) => {
    if (pathCopy.steps[index]) button.textContent = pathCopy.steps[index];
  });
  const diagram = document.getElementById("path-diagram");
  if (diagram) {
    diagram.src = resolveMedia(pathCopy.diagram);
    diagram.alt = pathCopy.diagramAlt;
  }
  document.querySelectorAll("img[src]").forEach((img) => {
    const raw = img.getAttribute("src");
    const next = resolveMedia(raw);
    if (next && next !== raw) img.setAttribute("src", next);
  });
}

applyPath();

const railMark = document.querySelector(".rail-mark");
if (railMark) {
  railMark.replaceChildren();
  for (const word of ["Eduardo", "Figueiredo"]) {
    const line = document.createElement("span");
    line.textContent = word;
    railMark.append(line);
  }
}

const chapters = [...document.querySelectorAll("main section")];
const nav = document.getElementById("chapter-nav");
const links = [];

const pathSegments = window.location.pathname.split("/").filter(Boolean);
const currentVariant = pathSegments[pathSegments.length - 1] || "general";
const isCustomizeMode =
  new URLSearchParams(window.location.search).get("customize") === "1";

function loadSectionState() {
  if (isCustomizeMode) {
    try {
      const saved = localStorage.getItem(`portfolio-sections-${currentVariant}`);
      if (saved) return JSON.parse(saved);
    } catch (error) {}
  }
  const defaults = {};
  chapters.forEach((s) => (defaults[s.id] = true));
  return defaults;
}

let sectionState = loadSectionState();

function updateKickers() {
  let visibleIndex = 1;
  chapters.forEach((sec) => {
    if (!sec.hidden) {
      const kicker = sec.querySelector(":scope > .kicker");
      if (kicker) {
        kicker.textContent = String(visibleIndex++).padStart(2, "0");
      }
    }
  });
}

function renderNav() {
  if (!nav) return;
  nav.replaceChildren();
  links.length = 0;
  const copy = UI[lang] || {};
  chapters.forEach((section) => {
    if (section.hidden) return;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.textContent =
      (copy.chapters && copy.chapters[section.id]) || section.dataset.chapter;
    item.append(link);
    nav.append(item);
    links.push(link);
  });
}

function applySectionState(state) {
  sectionState = state;
  if (isCustomizeMode) {
    try {
      localStorage.setItem(
        `portfolio-sections-${currentVariant}`,
        JSON.stringify(state),
      );
    } catch (error) {}
  }

  chapters.forEach((sec) => {
    const isVisible = state[sec.id] !== false;
    sec.hidden = !isVisible;
    sec.classList.toggle("section-excluded", !isVisible);
  });

  updateKickers();
  renderNav();
  updateCustomizerCheckboxes();
}

function updateCustomizerCheckboxes() {
  document
    .querySelectorAll("#customizer-list input[type='checkbox']")
    .forEach((cb) => {
      cb.checked = sectionState[cb.dataset.chapterId] !== false;
    });
}

applySectionState(sectionState);

const spy = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${visible.target.id}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },
  { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
);
chapters.forEach((section) => spy.observe(section));

const bars = document.getElementById("bars");
if (bars) {
  const barObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      bars.querySelectorAll("[data-width]").forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });
      barObserver.disconnect();
    },
    { threshold: 0.4 },
  );
  barObserver.observe(bars);
}

const defaultScores = [
  { name: "GS_R2S Financial Portal", csi: 5, nps: null },
  { name: "EXT_PS_CCC Telemetry", csi: 5, nps: 10 },
  { name: "EXT_M-PUR36 Tooling", csi: 5, nps: 10 },
  { name: "EXT_M-PMQ PPAP", csi: 5, nps: 10 },
  { name: "GS_P2P_MovDiv", csi: 5, nps: 10 },
  { name: "GS_P2P_Financial_Portal", csi: 5, nps: 10 },
  { name: "GS Applied Research Bootcamp 2024", csi: 4.9, nps: 9.6 },
  { name: "GS_B2R_AA CF Automation", csi: 4, nps: 10 },
];

const scores =
  typeof window !== "undefined" &&
  Array.isArray(window.SCORES_DATA) &&
  window.SCORES_DATA.length > 0
    ? window.SCORES_DATA
    : defaultScores;

const tbody = document.querySelector("#score-table tbody");
let sortKey = "csi";
let sortDesc = true;

function renderScores() {
  if (!tbody) return;
  const rows = [...scores].sort((a, b) => {
    const left = a[sortKey];
    const right = b[sortKey];
    if (typeof left === "string") {
      return sortDesc ? right.localeCompare(left) : left.localeCompare(right);
    }
    const ln = left == null ? -1 : left;
    const rn = right == null ? -1 : right;
    return sortDesc ? rn - ln : ln - rn;
  });
  tbody.replaceChildren();
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    [row.name, row.csi, row.nps == null ? UI[lang].na : row.nps].forEach(
      (value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.append(td);
      },
    );
    tbody.append(tr);
  });
}

document.querySelectorAll("#score-table [data-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.sort;
    sortDesc = sortKey === key ? !sortDesc : key !== "name";
    sortKey = key;
    renderScores();
  });
});
renderScores();

const stepButtons = [...document.querySelectorAll("#steps button")];
const stepText = document.getElementById("step-copy");

function showStep(index) {
  stepIndex = index;
  const copy = activePath()?.stepCopy;
  if (!copy || !stepText) return;
  stepButtons.forEach((button, i) => {
    button.setAttribute("aria-pressed", i === index ? "true" : "false");
  });
  stepText.textContent = copy[index];
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => showStep(Number(button.dataset.step)));
});
showStep(0);

const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");
const viewerCap = document.getElementById("viewer-cap");

document.querySelectorAll("figure.zoom").forEach((figure) => {
  const source = figure.querySelector("img:not(.sticker)");
  source.addEventListener("click", () => {
    viewerImg.src = source.currentSrc || source.src;
    viewerImg.alt = source.alt;
    viewerCap.textContent =
      figure.querySelector("figcaption")?.textContent || source.alt;
    viewer.showModal();
  });
});

document.getElementById("viewer-close").addEventListener("click", () => {
  viewer.close();
});

function fillList(nodes, values) {
  nodes.forEach((node, index) => {
    if (values[index] != null) node.textContent = values[index];
  });
}

function applyLanguage() {
  const copy = UI[lang];
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = copy[node.dataset.i18n];
    if (typeof value === "string") node.textContent = value;
  });
  const modelLead = document.querySelector(
    "#model > p:not(.sample):not(.kicker)",
  );
  if (modelLead) modelLead.textContent = copy.modelLead;
  fillList(
    [...document.querySelectorAll("#research > p:not(.kicker)")],
    [...copy.research, ...copy.researchTail],
  );
  fillList(
    [...document.querySelectorAll("#research .plain li")],
    copy.researchItems,
  );
  fillList(
    [...document.querySelectorAll(".facts dt")],
    copy.facts.map((row) => row[0]),
  );
  fillList(
    [...document.querySelectorAll(".facts dd")],
    copy.facts.map((row) => row[1]),
  );
  fillList(
    [...document.querySelectorAll("#present .shots figcaption")],
    copy.presentCaps,
  );
  fillList(
    [...document.querySelectorAll("#research .shots figcaption")],
    copy.researchCaps,
  );
  fillList([...document.querySelectorAll(".bar-row > span")], copy.bars);
  const scoresLead = document.getElementById("scores-lead");
  if (scoresLead) scoresLead.textContent = copy.scoresLead;
  const scoresHint = document.getElementById("scores-hint");
  if (scoresHint && copy.scoresHint) scoresHint.textContent = copy.scoresHint;
  const interestsLead = document.querySelector("#interests > p:not(.kicker)");
  if (interestsLead) interestsLead.textContent = copy.interestsLead;
  fillList(
    [...document.querySelectorAll("#interests .traits li")],
    copy.interests,
  );
  fillList(
    [...document.querySelectorAll("#interests .shots figcaption")],
    copy.interestCaps,
  );
  const contactLead = document.querySelector(
    "#contact > p:not(.fine):not(.kicker)",
  );
  if (contactLead) contactLead.textContent = copy.contactLead;
  const infovis = document.getElementById("infovis-diagram");
  if (infovis) infovis.src = copy.infovis;
  const story = document.getElementById("story-diagram");
  if (story && copy.story) {
    story.src = copy.story;
    if (copy.storyAlt) story.alt = copy.storyAlt;
  }
  const relevance = document.getElementById("relevance-diagram");
  if (relevance && copy.relevance) {
    relevance.src = copy.relevance;
    if (copy.relevanceAlt) relevance.alt = copy.relevanceAlt;
  }
  const langSwitch = document.querySelector(".lang-switch");
  if (langSwitch) langSwitch.setAttribute("aria-label", copy.langLabel);
  document.querySelectorAll(".lang-switch button").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.dataset.lang === lang ? "true" : "false",
    );
  });
  renderNav();
  applyPath();
  renderDeliverables();
  applyPdfLink();
  ensureCustomizerUI();
  showStep(stepIndex);
  renderScores();
  if (new URLSearchParams(location.search).has("print")) {
    prepareForPrint();
  }
}

function deliverableIconSvg(iconKey) {
  if (iconKey === "portal") {
    return `<svg class="deliverable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <rect x="6.5" y="12" width="4.5" height="5" rx="1" />
      <path d="M13.5 13h4" />
      <path d="M13.5 16h3" />
    </svg>`;
  }
  if (iconKey === "radar") {
    return `<svg class="deliverable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 12l5.5-5.5" />
    </svg>`;
  }
  return `<svg class="deliverable-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 10h8M8 14h5" />
  </svg>`;
}

let deliverableModal = null;

function ensureDeliverableModal() {
  if (deliverableModal) return deliverableModal;
  deliverableModal = document.createElement("dialog");
  deliverableModal.id = "deliverable-modal";
  deliverableModal.className = "deliverable-modal";
  deliverableModal.innerHTML = `
    <div class="deliverable-modal-content">
      <div class="deliverable-modal-header">
        <h2 id="deliverable-modal-title"></h2>
        <button type="button" class="customizer-close" id="deliverable-modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="deliverable-modal-body" id="deliverable-modal-body"></div>
    </div>
  `;
  document.body.append(deliverableModal);
  deliverableModal
    .querySelector("#deliverable-modal-close")
    .addEventListener("click", () => deliverableModal.close());
  deliverableModal.addEventListener("click", (e) => {
    const rect = deliverableModal.getBoundingClientRect();
    const inside =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!inside) deliverableModal.close();
  });
  return deliverableModal;
}

function openDeliverableModal(item) {
  const modal = ensureDeliverableModal();
  const titleEl = modal.querySelector("#deliverable-modal-title");
  const bodyEl = modal.querySelector("#deliverable-modal-body");
  titleEl.textContent = item.title;
  bodyEl.replaceChildren();

  const desc = document.createElement("p");
  desc.className = "deliverable-modal-desc";
  desc.textContent = item.full || item.short;
  bodyEl.append(desc);

  if (item.metrics && Array.isArray(item.metrics.bars)) {
    const sample = document.createElement("p");
    sample.className = "sample";
    sample.textContent = item.metrics.sample || "";
    const barsWrap = document.createElement("div");
    barsWrap.className = "bars";
    item.metrics.bars.forEach((b) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      const label = document.createElement("span");
      label.textContent = b.label;
      const track = document.createElement("div");
      track.className = "track";
      const fill = document.createElement("span");
      fill.style.width = `${b.pct}%`;
      track.append(fill);
      const strong = document.createElement("strong");
      strong.textContent = `${b.pct.toFixed(1)}%`;
      row.append(label, track, strong);
      barsWrap.append(row);
    });
    bodyEl.append(sample, barsWrap);
  }

  const mediaList = orderedDeliverableMedia(item);
  if (mediaList.length > 0) {
    const gallery = document.createElement("div");
    gallery.className =
      mediaList.length === 1
        ? "deliverable-modal-gallery single"
        : "deliverable-modal-gallery";
    mediaList.forEach((m, idx) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      img.src = resolveMedia(m.src);
      img.alt = m.alt || item.title;
      fig.append(img);
      const cap = document.createElement("figcaption");
      if (m.caption) {
        cap.textContent = m.caption;
      }
      if (mediaList.length > 1) {
        if (idx === 0) {
          const badge = document.createElement("span");
          badge.style.cssText = "font-size:11px;font-weight:600;color:var(--accent,#a3481e);margin-left:8px;";
          badge.textContent = lang === "pt" ? "★ Capa atual" : "★ Current cover";
          cap.append(badge);
        } else {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "media-cover-btn";
          btn.style.cssText = "margin-left:8px;font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid var(--line);background:var(--paper);cursor:pointer;";
          btn.textContent = lang === "pt" ? "★ Definir como capa" : "★ Set as cover";
          btn.onclick = () => {
            setDeliverableCover(item.id, m.src);
            openDeliverableModal(item);
          };
          cap.append(btn);
        }
      }
      if (cap.childNodes.length > 0) fig.append(cap);
      gallery.append(fig);
    });
    bodyEl.append(gallery);
  } else if (item.icon) {
    const iconBox = document.createElement("div");
    iconBox.className = "deliverable-modal-icon";
    iconBox.innerHTML = deliverableIconSvg(item.icon);
    bodyEl.append(iconBox);
  }

  modal.showModal();
}

function createDeliverableCard(item) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "deliverable-card";
  card.setAttribute("aria-label", item.title);

  const thumb = document.createElement("div");
  thumb.className = "deliverable-thumb";
  const orderedMedia = orderedDeliverableMedia(item);
  if (orderedMedia.length > 0) {
    const img = document.createElement("img");
    img.className = "deliverable-main-img";
    img.src = resolveMedia(orderedMedia[0].src);
    img.alt = orderedMedia[0].alt || item.title;
    thumb.append(img);

    const extras = orderedMedia.slice(1, 3);
    extras.forEach((extra, idx) => {
      const sticker = document.createElement("img");
      sticker.className = `deliverable-sticker deliverable-sticker-${idx + 1}`;
      sticker.src = resolveMedia(extra.src);
      sticker.alt = "";
      sticker.setAttribute("aria-hidden", "true");
      thumb.append(sticker);
    });

    if (orderedMedia.length > 3) {
      const more = document.createElement("span");
      more.className = "deliverable-more-badge";
      more.textContent = `+${orderedMedia.length - 3}`;
      thumb.append(more);
    }
  } else {
    thumb.classList.add("is-icon");
    thumb.innerHTML = deliverableIconSvg(item.icon);
  }

  const body = document.createElement("div");
  body.className = "deliverable-body";
  const h3 = document.createElement("h3");
  h3.textContent = item.title;
  const p = document.createElement("p");
  p.textContent = item.short;
  body.append(h3, p);

  card.append(thumb, body);
  card.addEventListener("click", () => openDeliverableModal(item));
  return card;
}

function renderDeliverables() {
  const root = document.getElementById("deliverables-grid");
  if (!root) return;
  const items = UI[lang]?.deliverablesItems || [];
  const categories = UI[lang]?.deliverableCategories || [];
  root.replaceChildren();

  if (categories.length === 0) {
    root.className = "deliverables-grid";
    items.forEach((item) => root.append(createDeliverableCard(item)));
    return;
  }

  root.className = "deliverables-categories";
  categories.forEach((cat) => {
    const catItems = items.filter((item) => item.category === cat.id);
    if (catItems.length === 0) return;

    const group = document.createElement("div");
    group.className = "deliverable-category";

    const header = document.createElement("div");
    header.className = "deliverable-category-header";
    const title = document.createElement("h3");
    title.className = "deliverable-category-title";
    title.textContent = cat.title;
    const count = document.createElement("span");
    count.className = "deliverable-category-count";
    count.textContent = String(catItems.length);
    header.append(title, count);

    const grid = document.createElement("div");
    grid.className = "deliverables-grid";
    catItems.forEach((item) => grid.append(createDeliverableCard(item)));

    group.append(header, grid);
    root.append(group);
  });
}

function applyPdfLink() {
  const link = document.getElementById("pdf-export");
  if (!link) return;
  link.removeAttribute("href");
  link.setAttribute("role", "button");
  link.textContent = UI[lang]?.pdfButton || "Download PDF";
  link.onclick = (e) => {
    e.preventDefault();
    downloadDynamicPdf();
  };
}

let customizerModal = null;

function ensureCustomizerUI() {
  const copy = UI[lang] || {};

  // 1. Add Customize button to hero export only in customize mode
  const heroExport = document.querySelector(".hero-export");
  const existingHeroCust = document.getElementById("hero-customize-btn");
  if (isCustomizeMode) {
    if (heroExport && !existingHeroCust) {
      const custBtn = document.createElement("button");
      custBtn.type = "button";
      custBtn.id = "hero-customize-btn";
      custBtn.className = "btn-customize";
      custBtn.setAttribute("data-i18n", "customizePortfolio");
      custBtn.textContent = copy.customizePortfolio || "Customize";
      custBtn.addEventListener("click", () => openCustomizer());
      heroExport.append(custBtn);
    } else if (existingHeroCust) {
      existingHeroCust.textContent = copy.customizePortfolio || "Customize";
    }
  } else if (existingHeroCust) {
    existingHeroCust.remove();
  }

  // 2. Add tools into rail (Customize only in customize mode; PDF always)
  const rail = document.querySelector(".rail");
  if (rail && !document.querySelector(".rail-tools")) {
    const tools = document.createElement("div");
    tools.className = "rail-tools";

    if (isCustomizeMode) {
      const railCustBtn = document.createElement("button");
      railCustBtn.type = "button";
      railCustBtn.className = "rail-customize-btn";
      railCustBtn.setAttribute("data-i18n", "customizePortfolio");
      railCustBtn.textContent = copy.customizePortfolio || "Customize";
      railCustBtn.addEventListener("click", () => openCustomizer());
      tools.append(railCustBtn);
    }

    const railPdfBtn = document.createElement("button");
    railPdfBtn.type = "button";
    railPdfBtn.className = "rail-pdf-btn";
    railPdfBtn.setAttribute("data-i18n", "pdfButton");
    railPdfBtn.textContent = copy.pdfButton || "Download PDF";
    railPdfBtn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadDynamicPdf();
    });

    tools.append(railPdfBtn);
    rail.append(tools);
  } else if (document.querySelector(".rail-tools")) {
    const cust = document.querySelector(".rail-customize-btn");
    const pdf = document.querySelector(".rail-pdf-btn");
    if (cust) cust.textContent = copy.customizePortfolio || "Customize";
    if (pdf) pdf.textContent = copy.pdfButton || "Download PDF";
  }

  if (!isCustomizeMode) return;

  // 3. Inject modal if missing (customize mode only)
  if (!document.getElementById("customizer-modal")) {
    customizerModal = document.createElement("dialog");
    customizerModal.id = "customizer-modal";
    customizerModal.className = "customizer-modal";

    customizerModal.innerHTML = `
      <div class="customizer-content">
        <div class="customizer-header">
          <h2 id="customizer-title" data-i18n="customizeModalTitle">${copy.customizeModalTitle || "Customize Portfolio"}</h2>
          <button type="button" class="customizer-close" id="customizer-close" aria-label="Close">&times;</button>
        </div>
        <p class="customizer-sub" id="customizer-sub" data-i18n="customizeSubtitle">${copy.customizeSubtitle || "Select which chapters to include in your portfolio and exported PDF:"}</p>
        <div class="customizer-actions">
          <button type="button" id="select-all-btn" class="btn-subtle" data-i18n="selectAll">${copy.selectAll || "Select All"}</button>
          <button type="button" id="reset-btn" class="btn-subtle" data-i18n="resetSelection">${copy.resetSelection || "Reset"}</button>
        </div>
        <div class="customizer-list" id="customizer-list"></div>
        <div class="customizer-footer">
          <button type="button" id="customizer-pdf-btn" class="pdf-export" data-i18n="downloadCustomPdf">${copy.downloadCustomPdf || "Download PDF"}</button>
          <button type="button" id="customizer-done-btn" class="btn-done" data-i18n="closeCustomizer">${copy.closeCustomizer || "Done"}</button>
        </div>
      </div>
    `;
    document.body.append(customizerModal);

    customizerModal
      .querySelector("#customizer-close")
      .addEventListener("click", () => customizerModal.close());
    customizerModal
      .querySelector("#customizer-done-btn")
      .addEventListener("click", () => customizerModal.close());
    customizerModal
      .querySelector("#customizer-pdf-btn")
      .addEventListener("click", () => downloadDynamicPdf());

    customizerModal
      .querySelector("#select-all-btn")
      .addEventListener("click", () => {
        const all = {};
        chapters.forEach((s) => (all[s.id] = true));
        applySectionState(all);
      });

    customizerModal.querySelector("#reset-btn").addEventListener("click", () => {
      const all = {};
      chapters.forEach((s) => (all[s.id] = true));
      applySectionState(all);
    });

    customizerModal.addEventListener("click", (e) => {
      const rect = customizerModal.getBoundingClientRect();
      const inside =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inside) {
        customizerModal.close();
      }
    });
  } else {
    customizerModal = document.getElementById("customizer-modal");
    const t = document.getElementById("customizer-title");
    const s = document.getElementById("customizer-sub");
    const sa = document.getElementById("select-all-btn");
    const rb = document.getElementById("reset-btn");
    const pb = document.getElementById("customizer-pdf-btn");
    const db = document.getElementById("customizer-done-btn");
    if (t) t.textContent = copy.customizeModalTitle || "Customize Portfolio";
    if (s)
      s.textContent =
        copy.customizeSubtitle || "Select which chapters to include:";
    if (sa) sa.textContent = copy.selectAll || "Select All";
    if (rb) rb.textContent = copy.resetSelection || "Reset";
    if (pb) pb.textContent = copy.downloadCustomPdf || "Download PDF";
    if (db) db.textContent = copy.closeCustomizer || "Done";
  }

  // Populate checklist
  const list = document.getElementById("customizer-list");
  if (list) {
    list.replaceChildren();
    chapters.forEach((sec, idx) => {
      const item = document.createElement("label");
      item.className = "customizer-item";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = sectionState[sec.id] !== false;
      cb.dataset.chapterId = sec.id;
      cb.addEventListener("change", () => {
        sectionState[sec.id] = cb.checked;
        applySectionState(sectionState);
      });

      const num = document.createElement("span");
      num.className = "customizer-num";
      num.textContent = String(idx + 1).padStart(2, "0");

      const label = document.createElement("span");
      label.className = "customizer-label";
      label.textContent =
        (copy.chapters && copy.chapters[sec.id]) || sec.dataset.chapter;

      item.append(cb, num, label);
      list.append(item);
    });
  }
}

function openCustomizer() {
  ensureCustomizerUI();
  if (customizerModal) {
    customizerModal.showModal();
  }
}

function prepareForPrint() {
  document.body.classList.add("for-print");
  if (!document.querySelector(".print-mark")) {
    const mark = document.createElement("p");
    mark.className = "print-mark";
    mark.textContent = "Eduardo Figueiredo";
    document.body.append(mark);
  }
  if (!document.getElementById("print-bleed")) {
    const bleed = document.createElement("div");
    bleed.id = "print-bleed";
    bleed.className = "print-bleed";
    document.body.prepend(bleed);
  }

  const steps = document.getElementById("steps");
  const stepCopy = document.getElementById("step-copy");
  const pathCopy = activePath();
  let printedSteps = document.getElementById("print-steps");
  if (!printedSteps && stepCopy) {
    printedSteps = document.createElement("div");
    printedSteps.id = "print-steps";
    printedSteps.className = "print-steps";
    stepCopy.after(printedSteps);
  }
  if (printedSteps && pathCopy) {
    printedSteps.replaceChildren();
    (pathCopy.steps || []).forEach((label, index) => {
      const heading = document.createElement("h3");
      heading.textContent = label;
      const paragraph = document.createElement("p");
      paragraph.textContent =
        (pathCopy.stepCopy && pathCopy.stepCopy[index]) || "";
      printedSteps.append(heading, paragraph);
    });
  }
  if (steps) steps.hidden = true;
  if (stepCopy) stepCopy.hidden = true;

  const lead = document.getElementById("path-lead");
  if (lead) {
    lead.textContent = lead.textContent
      .replace(/\s*Select a stop\.?/, "")
      .replace(/\s*Escolha uma parada\.?/, "")
      .trim();
  }

  document.querySelectorAll(".shots").forEach((grid) => {
    if (grid.dataset.paired === "1" || grid.classList.contains("shots-apps")) {
      return;
    }
    const step = grid.classList.contains("shots-three") ? 3 : 2;
    const figures = [...grid.querySelectorAll(":scope > figure")];
    for (let index = 0; index < figures.length; index += step) {
      const row = document.createElement("div");
      row.className = "shot-row";
      grid.insertBefore(row, figures[index]);
      for (let offset = 0; offset < step; offset += 1) {
        if (figures[index + offset]) row.append(figures[index + offset]);
      }
    }
    grid.dataset.paired = "1";
  });
}

function downloadDynamicPdf() {
  if (customizerModal && customizerModal.open) {
    customizerModal.close();
  }

  prepareForPrint();

  const originalTitle = document.title;
  const pathCopy = activePath();
  const roleLabel = pathCopy?.role
    ? pathCopy.role.split(" | ")[0].trim()
    : "Portfolio";
  document.title = `Eduardo Figueiredo — ${roleLabel} (${lang.toUpperCase()})`;

  window.print();

  window.addEventListener(
    "afterprint",
    () => {
      document.title = originalTitle;
    },
    { once: true },
  );
}

window.addEventListener("beforeprint", prepareForPrint);

document.querySelectorAll(".lang-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.lang === lang) return;
    lang = button.dataset.lang;
    try {
      localStorage.setItem("portfolio-lang", lang);
    } catch (error) {
      lang = button.dataset.lang;
    }
    applyLanguage();
  });
});

function snakeArrowSvg(dir) {
  if (dir === "down") {
    return `<svg viewBox="0 0 16 28" preserveAspectRatio="none" aria-hidden="true">
      <line x1="8" y1="0" x2="8" y2="21" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" />
      <polygon points="3,20 13,20 8,28" fill="currentColor" />
    </svg>`;
  }
  if (dir === "left") {
    return `<svg viewBox="0 0 28 16" preserveAspectRatio="none" aria-hidden="true">
      <line x1="28" y1="8" x2="7" y2="8" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" />
      <polygon points="8,3 8,13 0,8" fill="currentColor" />
    </svg>`;
  }
  return `<svg viewBox="0 0 28 16" preserveAspectRatio="none" aria-hidden="true">
    <line x1="0" y1="8" x2="21" y2="8" stroke="currentColor" stroke-width="2" stroke-dasharray="4 3" />
    <polygon points="20,3 20,13 28,8" fill="currentColor" />
  </svg>`;
}

function initSnakeTimelines() {
  const cols = 3;
  document.querySelectorAll(".school-line").forEach((line) => {
    line.classList.add("snake-timeline");
    const shots = [...line.querySelectorAll(":scope > .school-shot")];
    shots.forEach((shot, i) => {
      const row = Math.floor(i / cols);
      const posInRow = i % cols;
      const isReversed = row % 2 === 1;
      const col = isReversed ? cols - posInRow : posInRow + 1;

      shot.style.setProperty("--snake-row", String(row + 1));
      shot.style.setProperty("--snake-col", String(col));

      if (!shot.querySelector(".snake-step")) {
        const badge = document.createElement("span");
        badge.className = "snake-step";
        badge.textContent = String(i + 1).padStart(2, "0");
        shot.append(badge);
      }

      let dir = "end";
      if (i === shots.length - 1) {
        dir = "end";
      } else if (posInRow === cols - 1) {
        dir = "down";
      } else {
        dir = isReversed ? "left" : "right";
      }
      shot.dataset.snakeDir = dir;

      const existingArrow = shot.querySelector(".snake-arrow");
      if (existingArrow) existingArrow.remove();
      if (dir !== "end") {
        const arrow = document.createElement("span");
        arrow.className = `snake-arrow snake-arrow-${dir}`;
        arrow.innerHTML = snakeArrowSvg(dir);
        shot.append(arrow);
      }
    });
  });
}

initSnakeTimelines();
applyLanguage();

if (isCustomizeMode) {
  openCustomizer();
}
