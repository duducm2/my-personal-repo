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
    diagram.src = pathCopy.diagram;
    diagram.alt = pathCopy.diagramAlt;
  }
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

chapters.forEach((section) => {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#${section.id}`;
  link.textContent = section.dataset.chapter;
  item.append(link);
  nav.append(item);
});

const links = [...nav.querySelectorAll("a")];
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

const scores = [
  { name: "GS_R2S Financial Portal", csi: 5, nps: null },
  { name: "EXT_PS_CCC Telemetry", csi: 5, nps: 10 },
  { name: "EXT_M-PUR36 Tooling", csi: 5, nps: 10 },
  { name: "EXT_M-PMQ PPAP", csi: 5, nps: 10 },
  { name: "GS_P2P_MovDiv", csi: 5, nps: 10 },
  { name: "GS_P2P_Financial_Portal", csi: 5, nps: 10 },
  { name: "GS Applied Research Bootcamp 2024", csi: 4.9, nps: 9.6 },
  { name: "GS_B2R_AA CF Automation", csi: 4, nps: 10 },
];

const tbody = document.querySelector("#score-table tbody");
let sortKey = "csi";
let sortDesc = true;

function renderScores() {
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
  if (!copy) return;
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
  links.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    if (copy.chapters[id]) link.textContent = copy.chapters[id];
  });
  applyPath();
  applyPdfLink();
  showStep(stepIndex);
  renderScores();
  expandForPrint();
}

function applyPdfLink() {
  const link = document.getElementById("pdf-export");
  const pathCopy = activePath();
  if (!link || !pathCopy || !pathCopy.pdf) return;
  link.href = pathCopy.pdf;
  link.textContent = UI[lang].pdfButton || link.textContent;
}

function expandForPrint() {
  if (!new URLSearchParams(location.search).has("print")) return;
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
    const figures = [...grid.querySelectorAll(":scope > figure")];
    for (let index = 0; index < figures.length; index += 2) {
      const row = document.createElement("div");
      row.className = "shot-row";
      grid.insertBefore(row, figures[index]);
      row.append(figures[index]);
      if (figures[index + 1]) row.append(figures[index + 1]);
    }
    grid.dataset.paired = "1";
  });
}

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

applyLanguage();
