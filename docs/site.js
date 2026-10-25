const PATHS = {
  "data-analyst": {
    label: "Data Analyst",
    eyebrow: "Data Analyst · Nova Odessa, SP, Brazil",
    role: "Data analyst. AI for data manipulation, validation, and applied insights.",
    lede: "I help teams make decisions with clearer numbers. Excel and CSV for the daily work, dashboards for the story, research when we need to go deeper.",
    whyTitle: "Decisions backed by numbers",
    whyA: "Decisions should start from evidence, often in Excel and CSV before they scale to BI and code.",
    whyB: "The work centers data analysis, experimentation, and applied research: measuring outcomes and feeding that insight into delivery.",
    presentTitle: "Data, metrics, and applied research",
    presentLead:
      "Applied Research and Technology at Bosch Brasil, January 2023 to the present. The same role, read through the numbers: CSI, NPS, Power BI, and the relevance model.",
    nextTitle: "How I get to senior data analyst",
    steps: ["Now", "Next", "Method", "Decisions"],
    stepCopy: [
      "Experimental design and inferential statistics on TrustMate (Welch, Cohen's d, FDR, LLM evaluation versus humans). Messy text turned into validated BI. CSI, NPS, Power BI, Python, and SQL at Bosch.",
      "Senior data analyst: insight through the scientific method.",
      "Descriptive, inferential, and visual analysis.",
      "Fast decisions from that evidence.",
    ],
    diagram: "../media/path.png",
    diagramAlt:
      "Path from descriptive, inferential, and visual analysis to senior data analyst and fast decisions",
  },
  "product-owner": {
    label: "Product Owner",
    eyebrow: "Product Owner · Nova Odessa, SP, Brazil",
    role: "Discovery, delivery, and stakeholder outcomes.",
    lede: "I help teams decide what to build next and get it shipped. Research for the call, alignment for the commit, metrics afterward.",
    whyTitle: "Products people can rely on",
    whyA: "Products in service organizations have to be reliable and usable, especially when they affect real people and real businesses.",
    whyB: "The work connects stakeholder needs, priority, and applied research. Evidence shapes what we build, why, and in what order.",
    presentTitle: "Product-shaped work at Bosch Brasil",
    presentLead:
      "Applied Research and Design Analyst, January 2023 to the present. Applied Research Expert and Project Champion at GS/BDU. Discovery through delivery, with customer check-ins on the tooling project.",
    nextTitle: "How I work toward Senior Product Owner",
    steps: ["Discovery", "Priority", "Stakeholders", "Next"],
    stepCopy: [
      "Tooling for PT: requirements, high-fidelity prototypes, and regular customer check-ins.",
      "ServiceNow applied-research intake in CIP. Low, Medium, or High, so the team knows when deeper work is needed.",
      "Americas UX maturity Level 4: governance, templates, and training that stakeholders can reuse.",
      "Senior Product Owner. Discovery, then priority, then validation with the people who use the result. CSI 4.86 and NPS 9.94 across 2024–2025.",
    ],
    diagram: "../media/path-po.png",
    diagramAlt:
      "Path from a need and an evidence-backed priority to a shipped outcome",
  },
  "digital-solution-architect": {
    label: "Digital Solution Architect",
    eyebrow: "Digital Solution Architect · Nova Odessa, SP, Brazil",
    role: "Digital solution architect. Cloud, digitization, and evidence-based delivery.",
    lede: "I help teams design digitization and analytics that hold up in production. Clear boundaries, measurable outcomes, reviews grounded in evidence.",
    whyTitle: "Solutions that survive operations",
    whyA: "Digital solutions in service organizations have to survive real operations. Looking good in a review is not enough.",
    whyB: "The work connects digitization, data paths, and applied-research quality gates. Architecture that teams can actually run.",
    presentTitle: "Digitization, gates, and delivery",
    presentLead:
      "Digitization systems at Bosch Hungary. Architecture gates in ServiceNow CIP. Analytics turned into insight, then delivery with measurable CSI and NPS.",
    nextTitle: "How I get to mid-level digital solution architect",
    steps: ["Now", "Next", "Method", "Decisions"],
    stepCopy: [
      "Digitization systems at Bosch Hungary, architecture gates in ServiceNow CIP, analytics turned into insight, and delivery outcomes at Bosch.",
      "Mid-level digital solution architect: cloud, digitization, and evidence-based delivery.",
      "Boundaries, evidence gates, and designs that survive operations.",
      "Solutions judged by what happens in production.",
    ],
    diagram: "../media/path-dsa.png",
    diagramAlt:
      "Path from a problem and an operable design to a solution teams can run",
  },
};

const pathKey = document.body.dataset.path;
const pathCopy = PATHS[pathKey];

function applyPath() {
  if (!pathCopy) return;
  document.title = `Eduardo Figueiredo — ${pathCopy.label}`;
  const set = (id, text) => {
    const node = document.getElementById(id);
    if (node && text) node.textContent = text;
  };
  set("path-eyebrow", pathCopy.eyebrow);
  set("path-role", pathCopy.role);
  set("path-lede", pathCopy.lede);
  set("why-title", pathCopy.whyTitle);
  set("why-a", pathCopy.whyA);
  set("why-b", pathCopy.whyB);
  set("present-title", pathCopy.presentTitle);
  set("present-lead", pathCopy.presentLead);
  set("next-title", pathCopy.nextTitle);
  document.querySelectorAll("#steps button").forEach((button, index) => {
    if (pathCopy.steps[index]) button.textContent = pathCopy.steps[index];
  });
  const diagram = document.getElementById("path-diagram");
  if (diagram) {
    diagram.src = pathCopy.diagram;
    diagram.alt = pathCopy.diagramAlt;
  }
  const switcher = document.getElementById("rail-paths");
  if (switcher) {
    Object.entries(PATHS).forEach(([key, item]) => {
      const link = document.createElement("a");
      link.href = `../${key}/`;
      link.textContent = item.label;
      if (key === pathKey) link.setAttribute("aria-current", "page");
      switcher.append(link);
    });
  }
}

applyPath();

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

const stops = [
  {
    text: "Campinas, 2018. Team recognition with Bosch.",
    src: "media/bosch-2018.jpg",
    alt: "Eduardo Figueiredo with the Bosch team in Campinas, 2018",
    diagram: false,
  },
  {
    text: "Hungary, 2019, with the Budapest team.",
    src: "media/budapest-2019.jpg",
    alt: "Bosch team in Budapest, 2019",
    diagram: false,
  },
  {
    text: "The condensed path: Campinas, Hungary, Sorocaba, then Campinas again.",
    src: "media/timeline.png",
    alt: "Experience timeline across Bosch locations",
    diagram: true,
  },
  {
    text: "Back in Campinas. Germany workshops in 2024 and 2025, and the Americas team in 2025.",
    src: "media/americas-2025.jpg",
    alt: "Americas team, 2025",
    diagram: false,
  },
];
const stopButtons = [...document.querySelectorAll(".stops button")];
const stopNote = document.getElementById("stop-note");
const stopPhoto = document.getElementById("stop-photo");

function showStop(index) {
  const stop = stops[index];
  stopButtons.forEach((button, i) => {
    button.setAttribute("aria-selected", i === index ? "true" : "false");
  });
  stopNote.textContent = stop.text;
  stopPhoto.src = stop.src;
  stopPhoto.alt = stop.alt;
  stopPhoto.classList.toggle("is-diagram", stop.diagram);
}

stopButtons.forEach((button) => {
  button.addEventListener("click", () => showStop(Number(button.dataset.stop)));
});
showStop(0);

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
    [row.name, row.csi, row.nps == null ? "N/A" : row.nps].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.append(td);
    });
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

const stepCopy = pathCopy
  ? pathCopy.stepCopy
  : [
      "Experimental design and inferential statistics on TrustMate (Welch, Cohen's d, FDR, LLM evaluation versus humans). Messy text turned into validated BI. CSI, NPS, Power BI, Python, and SQL at Bosch.",
      "Senior data analyst: insight through the scientific method.",
      "Descriptive, inferential, and visual analysis.",
      "Fast decisions from that evidence.",
    ];
const stepButtons = [...document.querySelectorAll("#steps button")];
const stepText = document.getElementById("step-copy");

function showStep(index) {
  stepButtons.forEach((button, i) => {
    button.setAttribute("aria-pressed", i === index ? "true" : "false");
  });
  stepText.textContent = stepCopy[index];
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => showStep(Number(button.dataset.step)));
});
showStep(0);

const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewer-img");
const viewerCap = document.getElementById("viewer-cap");

document.querySelectorAll("figure.zoom").forEach((figure) => {
  const source = figure.querySelector("img");
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
