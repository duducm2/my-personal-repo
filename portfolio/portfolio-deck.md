---
marp: true
theme: default
paginate: false
title: "Eduardo Figueiredo – Portfolio"
author: "Eduardo Figueiredo"
style: |
  :root {
    font-family: "Lato", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --primary-color: #2c3e50; /* Midnight Blue */
    --accent-color: #2c3e50;  /* Midnight Blue */
    --text-color: #333333;
    --bg-dot: #e5e5e5;
    --slide-padding: 40pt;
    font-size: 16pt;
    line-height: 1.3;
    color: var(--text-color);
  }
  section {
    background-color: #fff;
    padding: var(--slide-padding);
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  section > * {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
  }
  ul, ol {
    margin-top: 0.15rem;
    margin-bottom: 0.15rem;
    padding-left: 1rem;
  }
  li {
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
    line-height: 1.25;
  }
  h1, h2, h3 {
    color: var(--primary-color);
    font-family: "Lato", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    margin-top: 0.4rem;
    margin-bottom: 0.3rem;
    line-height: 1.2;
  }
  h1 {
    font-size: 2.05rem;
    border-bottom: 3px solid var(--accent-color);
    display: inline-block;
    padding-bottom: 0.1rem;
  }
  h2 {
    font-size: 1.525rem;
    border-left: 5px solid var(--accent-color);
    padding-left: 0.4rem;
  }
  h3 { font-size: 1.2625rem; color: var(--accent-color); }
  p {
    margin-top: 0.15rem;
    margin-bottom: 0.15rem;
    line-height: 1.3;
  }
  section.dense-content {
    padding: 0.25rem 0.4rem;
  }
  section.dense-content ul, section.dense-content ol {
    margin-top: 0.1rem;
    margin-bottom: 0.1rem;
  }
  section.dense-content li {
    margin-top: 0.08rem;
    margin-bottom: 0.08rem;
  }
  section.lead {
    background-color: #fff;
    color: var(--text-color);
  }
  section.lead h1, section.lead h2 { color: var(--primary-color); border-color: var(--accent-color); }
  section.lead {
    background-image: url("../arts/art-5.png");
    background-size: 28% auto;
    background-position: right bottom;
    background-repeat: no-repeat;
  }
  section.lead img { display: block; margin-left: auto; margin-right: auto; }
  section.lead::after {
    display: none;
  }

  /* Second slide: midnight blue */
  section.midnight-blue-slide {
    background-color: #2c3e50;
    background-image: none;
    border-top: none;
    color: white;
  }
  section.midnight-blue-slide h2 { color: white; border-color: rgba(255,255,255,0.5); }
  section.midnight-blue-slide table, section.midnight-blue-slide th, section.midnight-blue-slide td { color: white; border-color: rgba(255,255,255,0.3); }
  section.midnight-blue-slide ul, section.midnight-blue-slide li { color: white; }
  section.midnight-blue-slide img { border: 4px solid rgba(255,255,255,0.4); box-shadow: 2px 3px 12px rgba(0,0,0,0.3); }

  section.persona-slide img[alt*="Persona 2"] { display: block; margin-left: auto; margin-right: auto; margin-top: -1rem; }
  
  /* Global Decorative Elements */
  section:not(.lead):not(.midnight-blue-slide) {
    /* Subtle dot grid to fill whitespace */
    background-image: radial-gradient(var(--bg-dot) 1px, transparent 1px);
    background-size: 20px 20px;
    /* Top accent bar */
    border-top: 6px solid var(--primary-color);
  }

  /* Image Styling - Scattered Photo Effect with Unique Rotations */
  section:not(.lead):not(.midnight-blue-slide) img {
    border: 4px solid white;
    box-shadow: 2px 3px 8px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  }
  section:not(.lead) img:hover { transform: scale(1.05) rotate(0deg); z-index: 10; }
  
  /* Unique rotation angles for each image - varied degrees for visual interest */
  section:not(.lead) img[alt*="Eduardo Figueiredo"] { transform: rotate(-2.5deg); }
  section:not(.lead) img[alt*="Academic Writing"] { transform: rotate(3.2deg); }
  section:not(.lead) img[alt*="Budapest"] { transform: rotate(-1.8deg); }
  section:not(.lead) img[alt*="Americas Team"] { transform: rotate(2.1deg); }
  section:not(.lead) img[alt*="UX Strategy Workshop"] { transform: rotate(-3.5deg); }
  section:not(.lead) img[alt*="ISSRE 2025"] { transform: rotate(1.7deg); }
  section:not(.lead) img[alt*="Bosch Talent Forum"] { transform: rotate(-2.8deg); }
  section:not(.lead) img[alt*="Family"] { transform: rotate(2.9deg); }
  section:not(.lead) img[alt*="Friends"] { transform: rotate(-1.6deg); }
  section:not(.lead) img[alt*="Germany 2025"] { transform: rotate(2.4deg); }
  section:not(.lead) img[alt*="Budapest 2019"] { transform: rotate(-2.3deg); }
  section:not(.lead) img[alt*="Bosch Argentina"] { transform: rotate(1.8deg); }
  section:not(.lead) img[alt*="Cat on piano"] { transform: rotate(1.5deg); }
  section:not(.lead) img[alt*="Cat on split keyboard"] { transform: rotate(-2deg); }
  section:not(.lead) img[alt*="In front of Bosch building"] { transform: rotate(1.9deg); }
  section:not(.lead) img[alt*="Future Career Path"] { transform: rotate(0deg); border: none; box-shadow: none; }

  section.art-top-right {
    position: relative;
    --art-top: 0.5rem;        /* margin from top (e.g. 0, 0.5rem, 1rem) */
    --art-right: 0.5rem;     /* margin from right (e.g. 0, 0.5rem, 1rem) */
    --art-size: 180px;  /* image width - reduced for more text space */
  }
  section.art-top-right > p:first-of-type {
    position: absolute;
    top: var(--art-top);
    right: var(--art-right);
    margin: 0;
  }
  section.art-top-right > p:first-of-type img {
    width: var(--art-size);
    height: auto;
    border: 4px solid white;
    box-shadow: 2px 3px 8px rgba(0,0,0,0.15);
  }
  section.art-bottom-right-overflow {
    position: relative;
    overflow: visible !important;
  }
  section.art-bottom-right-overflow > p:first-of-type {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0;
    line-height: 0;
  }
  section.art-bottom-right-overflow > p:first-of-type img {
    width: 85vw;
    max-width: 900px;
    height: auto;
    display: block;
    transform: translate(25%, 25%);
    opacity: 0.85;
  }
  /* Overflow slide: image extends past bottom of page */
  section.art-bottom-right-overflow.art-push-down {
    overflow: visible !important;
  }
  section.art-bottom-right-overflow.art-push-down > p:first-of-type {
    position: absolute;
    bottom: -180px;
    right: 0;
    top: auto;
    margin: 0;
    line-height: 0;
  }
  section.art-bottom-right-overflow.art-push-down > p:first-of-type img {
    transform: translate(25%, 25%) translateY(80px);
    width: 85vw !important;
    max-width: 1200px !important;
    min-width: 600px !important;
    opacity: 0.92;
  }
  section.compact-list ul { font-size: 0.82em; line-height: 1.35; }
  section.compact-list li { margin-top: 0.08rem; margin-bottom: 0.08rem; }
  /* Let this slide show content that overflows (image past bottom) */
  section.allow-overflow { overflow: visible !important; }
  /* Parent container (e.g. Marp viewer) must not clip */
  div:has(> section.allow-overflow) { overflow: visible !important; }
  section.quick-recall img { 
    display: block; margin-left: auto; margin-right: auto; max-width: 90%; height: auto; 
    /* Override rotation for diagrams if needed, or keep for style */
  }
  section.flow-diagram-fit { display: flex; align-items: center; justify-content: center; }
  section.flow-diagram-fit img { display: block; margin: 0 auto; height: auto; object-fit: contain; }
  section.relevance-summary-with-doodle { position: relative; }
  section.relevance-summary-with-doodle p.doodle-right { position: absolute; right: 5rem; top: 50%; transform: translateY(-50%); margin: 0; line-height: 0; }
  section.relevance-summary-with-doodle p.doodle-right img { width: 220px; height: auto; display: block; }
  
  /* Blank midnight blue conclusion page */
  section.blank-midnight-blue {
    background-color: #fff;
    background-image: url("../arts/art-background.png");
    background-size: 110%;
    background-position: center;
    background-repeat: no-repeat;
    border-top: none;
    overflow: visible;
  }
  
  /* Personal images layout - scattered photo effect */
  section.personal-images p {
    display: inline-block;
    margin: 0.3rem;
    vertical-align: top;
  }
  section.personal-images p:nth-of-type(1) img { width: 180px; }
  section.personal-images p:nth-of-type(2) img { width: 160px; }
  section.personal-images p:nth-of-type(3) img { width: 170px; }
  section.personal-images p:nth-of-type(4) img { width: 165px; }
  section.personal-images p:nth-of-type(5) img { width: 165px; }
  section.personal-images p:nth-of-type(6) img { width: 165px; }
  
  /* Article images layout - scattered group (scientific publications) */
  section.article-images p {
    display: inline-block;
    margin: 0.25rem;
    vertical-align: top;
  }
  section.article-images p:nth-of-type(1) img { width: 140px; }
  section.article-images p:nth-of-type(2) img { width: 130px; }
  section.article-images p:nth-of-type(3) img { width: 145px; }
  section.article-images p:nth-of-type(4) img { width: 135px; }
  section.article-images p:nth-of-type(5) img { width: 138px; }
  section.article-images p:nth-of-type(6) img { width: 142px; }
  section:not(.lead) img[alt*="Article 1 page 1"] { transform: rotate(-1.2deg); }
  section:not(.lead) img[alt*="Article 1 page 2"] { transform: rotate(2deg); }
  section:not(.lead) img[alt*="Article 2 page 1"] { transform: rotate(-2.1deg); }
  section:not(.lead) img[alt*="Article 2 page 2"] { transform: rotate(1.4deg); }
  section:not(.lead) img[alt*="Dissertation page 1"] { transform: rotate(-1.6deg); }
  section:not(.lead) img[alt*="Dissertation page 2"] { transform: rotate(2.3deg); }
  section:not(.lead) img[alt*="CIP-UX 1"] { transform: rotate(-2deg); }
  section:not(.lead) img[alt*="CIP-UX 2"] { transform: rotate(1.5deg); }
  section:not(.lead) img[alt*="CIP-UX 3"] { transform: rotate(-1.2deg); }
  section:not(.lead) img[alt*="CIP-UX 4"] { transform: rotate(2deg); }
  section:not(.lead) img[alt*="CIP-UX 5"] { transform: rotate(-1.8deg); }
  section:not(.lead) img[alt*="CIP-UX 6"] { transform: rotate(1.3deg); }
  section:not(.lead) img[alt*="CIP-UX 7"] { transform: rotate(-2.2deg); }
  section:not(.lead) img[alt*="CIP-UX 8"] { transform: rotate(1.7deg); }

  /* Academic gallery layout - scattered group */
  section.academic-images p {
    display: inline-block;
    margin: 0.25rem;
    vertical-align: top;
  }
  section.academic-images img {
    max-width: 18%;
    height: auto;
  }

  /* Workshop & teams gallery layout - scattered group */
  section.workshop-images p {
    display: inline-block;
    margin: 0.25rem;
    vertical-align: top;
  }
  section.workshop-images img {
    max-width: 22%;
    height: auto;
  }

  /* Dissertation technical implementation – six images + diagram placeholder */
  section.dissertation-tech-images p {
    display: inline-block;
    margin: 0.25rem;
    vertical-align: top;
  }
  section.dissertation-tech-images img {
    max-width: 20%;
    height: auto;
  }
  section:not(.lead) img[alt*="database architecture"] {
    transform: none;
    border: none;
    box-shadow: none;
  }

  /* Dissertation Power BI – three visualization placeholders */
  section.dissertation-pbi-images p {
    display: inline-block;
    margin: 0.3rem;
    vertical-align: top;
  }
  section.dissertation-pbi-images img {
    max-width: 32%;
    height: auto;
  }

  /* InfoVis course – PhraseNets visualizations (three images) */
  section.phrase-net-images p {
    display: inline-block;
    margin: 0.3rem;
    vertical-align: top;
  }
  section.phrase-net-images img {
    max-width: 32%;
    height: auto;
  }

  /* InfoVis Power BI (PNAD) – two visualization images */
  section.infovis-pbi-images p {
    display: inline-block;
    margin: 0.3rem;
    vertical-align: top;
  }
  section.infovis-pbi-images img {
    max-width: 48%;
    height: auto;
  }

  /* Work Power BI – two dashboard images */
  section.work-pbi-images p {
    display: inline-block;
    margin: 0.3rem;
    vertical-align: top;
  }
  section.work-pbi-images img {
    max-width: 48%;
    height: auto;
  }

  /* Tooling project for PT – three images */
  section.tooling-project-images p {
    display: inline-block;
    margin: 0.3rem;
    vertical-align: top;
  }
  section.tooling-project-images img {
    max-width: 32%;
    height: auto;
  }

  /* CIP and UX Integration – eight images */
  section.cip-ux-images p {
    display: inline-block;
    margin: 0.25rem;
    vertical-align: top;
  }
  section.cip-ux-images img {
    max-width: 18%;
    height: auto;
  }
---

<!-- _class: lead -->

<!-- Slide 1 – Why (Golden Circle: Why) -->

# Why I Work in Technology, Project Management & Research
## Trustworthy, human-centered software for complex services

- I believe that software used in service organizations must be **trustworthy, usable, and inclusive**—especially when decisions affect people and businesses at scale.
- My work centers **technology**, **project management**, and **in-depth research**—integrating evidence and user needs into processes via **Continuous Improvement (CIP)** and systematic delivery.
- This portfolio tells that story:

[INSERT DIAGRAM HERE: Why story flow]

<!-- Mermaid source: why-story-flow.mmd - render to why-story-flow.png
flowchart LR
  Past["Past Foundations"]
  Present["Present Impact"]
  Future["Future Directions"]
  Past --> Present --> Future
-->

---

<!-- Slide 2 – Who I Am (Golden Circle: Who/What) -->

<!-- _class: art-top-right midnight-blue-slide -->

## Who I Am – Snapshot

<p><img src="../pictures/personal/my-photo-rectangle.png" alt="Eduardo Figueiredo" /></p>

[INSERT TABLE HERE: Who I Am snapshot]

| Attribute | Value |
| --------- | ----- |
| Name | Eduardo M. de A. Figueiredo |
| Role | Research, Technology & Project Management (Master's, Unicamp) |
| Focus | Technology, CIP governance, in-depth research, and measuring software trustworthiness |
| Impact | Americas UX Maturity Level 4; AI-driven UX quality gates; international projects |
| Contact | Nova Odessa, SP – Brazil · edu.evangelista.figueiredo@gmail.com · LinkedIn / phone on request |  

---

<!-- Slide 3 – Past (Foundations: Education & Profile) -->

<!-- _class: art-top-right -->

## Past – Academic Foundations & Professional Profile

<p><img src="../pictures/academia/academic-writing.jpg" alt="Academic Writing Course - Unicamp" /></p>

[INSERT DIAGRAM HERE: Academic timeline]

- **Master's thesis:** Benchmark to assess software trustworthiness via Usability, Accessibility, and UX. Grade 'A' in all Master's coursework (Unicamp transcript available on request).
- **Professional profile:** Proactive, self-reliant, organized; combines **in-depth research**, **technology**, and **project management** with agile practices (Scrum, Kanban) and delivery leadership.

<!-- Mermaid source: academic-timeline.mmd - render to academic-timeline.png
timeline
    title Academic Foundations
    2012-2014 : Technical Degree in Computer Science – ETEC Bento Quirino
    2015-2020 : Systems Analysis and Development – Unicamp
    2023-2025 : Master's in Technology – Information and Communication Systems UX – Unicamp
    2024 : English proficiency UFSC – Reading 10/10
-->  

---

<!-- Slide 5 – Present (Role & Strategic Impact) -->

<!-- _class: art-top-right -->

## Present – Research & Technology (Bosch Brasil)

<p style="position: absolute; top: 0.5rem; left: 0.5rem; margin: 0;"><img src="../pictures/work/bdu/UXGS%20Logo_verticle.svg" alt="UXGS area logo" style="height: 56px; width: auto;" /></p>
<p><img src="../pictures/work/americas-team-2025.jpg" alt="Americas Team 2025 - UX Maturity Level 4" style="max-width: 280px; width: 100%; height: auto;" /></p>
<p style="position: absolute; top: 0.5rem; right: 2rem; margin: 0;"><img src="../pictures/work/in-front-of-the-bosch-building.jpg" alt="In front of Bosch building" style="width: 150px; height: auto;" /></p>

[INSERT TABLE HERE: Present role achievements]

| Area | Achievement |
| ---- | ----------- |
| Role | Research & Technology – Bosch Brasil (May 2023 – present); UX Project Champion GS/BDU |
| International | Two trips to Germany (2024, 2025) for role-related work |
| CO2 Tracking (GS/UX) | Marketing scouting for CO2 telemetry; finding: lack of market demand |
| UX Maturity | Led Americas to Level 4 – governance, templates, training |
| CIP + UX | Led integration into ServiceNow CIM; UX gate in CIP workflow |
| Collaboration | Tutor at SENAI Digital Talent Academy; scientific methods and project delivery |  

---

<!-- Slide 6 – Present (CIP and UX Integration: Critical Career Milestone) -->

<!-- _class: art-top-right -->

## Present – CIP and UX Integration: A Critical Career Milestone

<p><img src="../pictures/work/digital-ws.jpg" alt="UX Strategy Workshop" /></p>

- **Career significance:** This project marks a pivotal evolution into **Senior Researcher** capabilities—combining in-depth, data-oriented investigation with technical execution, project management, and governance.  
- **Project scope:** Integrated **UX relevance assessment** into the **Continuous Improvement Process (CIP)** in ServiceNow CIM. A **UX gate** sits between Assess and Approve; the method runs at that gate to triage improvement initiatives (Low / Medium / High UX relevance).  
- **Methodology—developer skills for research:** Utilized **Cursor IDE**, **AI-assisted coding**, and version-controlled Python pipelines. Workflow:

[INSERT DIAGRAM HERE: CIP-UX methodology pipeline]

- **Deliverables:**

[INSERT TABLE HERE: CIP-UX deliverables]

| Deliverable | Description |
| ----------- | ----------- |
| UX Relevance Quick Method | 10 system-calculated questions from 11 CIM fields; thresholds Low &lt;60, Medium 60–70, High ≥70 |
| 1st Research Report (Jan 2026) | Stakeholder inputs, governance clarity |
| Pipeline | extract_cim_data.py, calculate_ux_scores.py, aggregate_to_csv.py – reproducible validation |

- **Impact:** Governance clarity, reduced perceived delay, and reusable UX governance framework. Aligned CAP and UX into a unified, defensible solution.

<!-- Mermaid source: cip-ux-pipeline.mmd - render to cip-ux-pipeline.png
flowchart LR
  A["(1) Iterative code-based documentation\nMarkdown, method.md v2.8"]
  B["(2) AI-assisted analysis\nN=214 records, UX maturity data"]
  C["(3) Automated pipeline\nextract to aggregate to calculate\nux_relevance_results.csv N=35"]
  D["(4) High-quality reports\nMarkdown, executive summaries\nCriticality Index"]
  A --> B --> C --> D
-->  

---

<!-- Slide 6b – Present (CIP and UX Integration: Research Artifacts & Visuals) -->

<!-- _class: dense-content cip-ux-images -->

## Present – CIP and UX Integration: Research Artifacts & Visuals

- **High-quality, data-oriented deliverables** produced using Markdown, Python pipelines, and Cursor IDE: (1) **1st Research Report** (January 2026)—"Make governance clear. Keep improvements moving."—consolidating N=214 records, executive summary, literature benchmark, methodology, findings, and strategic opportunities; (2) **UX Relevance Quick Method** (method.md v2.8)—CIM-to-Q1–Q10 mapping, scoring algorithm, post-evaluation workflow; (3) **Pipeline** (`tests/standalone-tests/pipeline/`)—extraction, aggregation, score calculation, validation. Distribution (N=35): Low 57.1%, Medium 20.0%, High 22.9%.

<p><img src="../pictures/work/cip-ux/cip-ux-1.png" alt="CIP-UX 1 – Report cover: Make governance clear. Keep improvements moving." /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-2.png" alt="CIP-UX 2 – Summary and executive findings" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-3.png" alt="CIP-UX 3 – Context and methodology" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-4.png" alt="CIP-UX 4 – Literature review and benchmark" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-5.png" alt="CIP-UX 5 – Findings and Criticality Index" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-6.png" alt="CIP-UX 6 – Pipeline and data processing" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-7.png" alt="CIP-UX 7 – Conclusions and strategic opportunities" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-8.png" alt="CIP-UX 8 – Additional research visuals" /></p>

---

<!-- Slide 8 – Present (Academic Research & TrustMate) -->

<!-- _class: art-top-right -->

## Present – Academic Research (Trust in AI & UI)

<p><img src="../pictures/academia/hfsd-workshop-1.jpg" alt="ISSRE 2025 HFSD Workshop" /></p>

[INSERT DIAGRAM HERE: Academic research flow]

- **Master's focus:** Benchmark to assess software trustworthiness (Usability, Accessibility, UX). Thesis: quantitative methods for perceived trust in e-commerce and software interfaces.  
- **Publications:** ISSRE 2025 (HFSD – IEEE), IHC 2025 (SBC SOL). **TrustMate** + Power BI for trust scores; **AI agents as survey respondents**, full-stack development, Figma prototyping.  
- **Industry connection:** Methods and tools reusable for UX audits, maturity assessments, and CIP + UX work.

<!-- Mermaid source: academic-research-flow.mmd - render to academic-research-flow.png
flowchart TD
  Focus["Benchmark: Trustworthiness\nUsability, Accessibility, UX"]
  Pub["Publications\nISSRE 2025 HFSD, IHC 2025 SOL"]
  Tool["TrustMate + Power BI\nAI agents, full-stack, Figma"]
  Industry["Industry reuse\nUX audits, maturity, CIP+UX"]
  Focus --> Pub
  Focus --> Tool
  Pub --> Industry
  Tool --> Industry
-->  

---

<!-- Slide 9 – Present (Scientific Publications – Snapshot) -->

<!-- _class: dense-content article-images -->

## Present – Scientific Publications (Visual Evidence)

<p><img src="../pictures/academia/articles/article-1-1.png" alt="Article 1 page 1" /></p>
<p><img src="../pictures/academia/articles/article-1-2.png" alt="Article 1 page 2" /></p>
<p><img src="../pictures/academia/articles/article-2-1.png" alt="Article 2 page 1" /></p>
<p><img src="../pictures/academia/articles/article-2-2.png" alt="Article 2 page 2" /></p>
<p><img src="../pictures/academia/articles/dissertation-page-1.png" alt="Dissertation page 1" /></p>
<p><img src="../pictures/academia/articles/dissertation-page-2.png" alt="Dissertation page 2" /></p>

- Published work in **ISSRE 2025 (HFSD Workshop)** and **IHC 2025 (SBC SOL)**; master's dissertation on software trustworthiness.

---

<!-- Slide 10 – Present (CSI & NPS Performance 2024–2025) -->
<!-- Mermaid diagram source: csi-nps-performance.mmd - render to csi-nps-performance.png -->

## Present – CSI & NPS Performance (2024–2025)

- **High customer satisfaction** across eight UX projects delivered in 2024–2025. **Averages: CSI 4.86 / 5, NPS 9.94 / 10.** (Details in table below.)

<p><img src="csi-nps-performance.png" alt="CSI and NPS performance metrics 2024–2025 – project table" style="max-width: 95%; height: auto; margin: 0.5rem auto; display: block;" /></p>

---

<!-- Slide 11 – Present (Power BI Dashboards at Work) -->

<!-- _class: dense-content work-pbi-images -->

## Theme: Data Visualization – Power BI Dashboards at Work

- **Bosch UXGS Americas:** Power BI dashboards developed in role for project and resource oversight and for training tracking—supporting data-driven decision-making and governance.

<p><img src="../pictures/work/pbi-allocation.png" alt="Power BI – LA Allocation Dashboard" /></p>
<p><img src="../pictures/work/pbi-training-evolution.png" alt="Power BI – SMTs Evolution training dashboard" /></p>

---

<!-- Slide 12 – Present (Dissertation: Power BI Visualizations) -->

<!-- _class: dense-content dissertation-pbi-images -->

## Theme: Data Visualization – Dissertation Power BI

- **Dissertation InfoVis (Power BI):** Dashboards and charts for trust-metrics analysis—variability of human scores across websites (Americanas, MadeiraMadeira, Kabum), AI × human homogeneity by attribute, and line comparisons (human vs AI scores per website). Supports validation of trust perception models and consolidation of research findings.

<p><img src="../pictures/academia/dissertation/dissertation-pbi-1.png" alt="Power BI – variability of human scores between websites" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-2.png" alt="Power BI – AI × human homogeneity by attribute" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-3.png" alt="Power BI – AI × humans comparison lines per website" /></p>

---

<!-- Slide 13 – Present (InfoVis Project – Power BI & PNAD Contínua) -->

<!-- _class: dense-content infovis-pbi-images -->

## Theme: Data Visualization – InfoVis Project (PNAD Contínua)

- **InfoVis class project – Power BI:** Built multi-page reports using **PNAD Contínua** (Brazil's National Household Sample Survey). Brazil’s National Household Sample Survey.
[INSERT DIAGRAM HERE: InfoVis PNAD visual structures]

- **Impact:** Demonstrates **Power BI** proficiency and **processing complex national research datasets** into clear, actionable visual insights for socioeconomic analysis.

<!-- Mermaid source: infovis-pnad-structures.mmd - render to infovis-pnad-structures.png
flowchart LR
  PNAD["PNAD Continua\nNational Survey Data"]
  Sankey["Sankey\nEducation-employment\nIncome flows"]
  Choropleth["Choropleth\nIncome by state"]
  Faceted["Faceted bar charts\nIncome by education\nhousehold, area"]
  PNAD --> Sankey
  PNAD --> Choropleth
  PNAD --> Faceted
-->

<p><img src="../pictures/academia/infovis/pbi-infovis-1.png" alt="Power BI – Education-employment trajectories Sankey" /></p>
<p><img src="../pictures/academia/infovis/pbi-infovis-2.png" alt="Power BI – Family structure and socioeconomic patterns" /></p>

---

<!-- Slide 14 – Present (Dissertation: Technical Implementation & Impact) -->

## Theme: Technical Implementation – Dissertation (AI & Full Stack)

[INSERT DIAGRAM HERE: Dissertation tech pillars]

- **Architecture:** Database design supporting projects, experiments, attributes, scores, and agent runs.

<!-- Mermaid source: dissertation-tech-pillars.mmd - render to dissertation-tech-pillars.png optional
flowchart LR
  A["AI agents as\nsurvey respondents"]
  B["Full-stack\ndevelopment"]
  C["Figma\nlow-fidelity prototyping"]
  A --- B --- C
-->

<!-- Mermaid diagram source: dissertation-database-architecture.mmd -->

<p><img src="dissertation-database-architecture.png" alt="Dissertation / TrustMate database architecture" style="max-width: 70%; height: auto; margin: 0.5rem auto; display: block;" /></p>

---

<!-- Slide 15 – Present (Dissertation: Technical Visuals) -->

<!-- _class: dense-content dissertation-tech-images -->

## Theme: Technical Implementation – Visual Evidence

<p><img src="../pictures/academia/disseratation-tech-1-agents-1.png" alt="AI agent survey – e-commerce evaluation" /></p>
<p><img src="../pictures/academia/disseratation-tech-1-agents-2.png" alt="AI agent survey – TrustMate dashboard" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-1.png" alt="E-commerce evaluation – product page" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-2.png" alt="Evaluation metrics – trust and UX scores" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-3.png" alt="TrustMate – hierarchy of attributes" /></p>
<p><img src="../pictures/academia/disseratation-tech-3-prototype-1.png" alt="TrustMate tool evaluation – prototype" /></p>

---

<!-- Slide 16 – Present (Tooling Project for PT) -->

<!-- _class: dense-content tooling-project-images -->

## Theme: Technical Implementation – Tooling Project for PT

- **Tooling project for PT:** Key development in **technical delivery and project management**—from requirements to high-fidelity deliverable, with **customer progress review meetings** throughout.

[INSERT DIAGRAM HERE: Tooling PT delivery workflow]

<!-- Mermaid source: tooling-pt-workflow.mmd - render to tooling-pt-workflow.png
flowchart LR
  W["Wireframe"]
  L["Low-fidelity\nprototype"]
  H["High-fidelity\nprototype"]
  W --> L --> H
  H --> Review["Customer progress\nreview meetings"]
  Review --> W
-->

<p><img src="../pictures/work/tooling-project/tooling-1.png" alt="Tooling project for PT – wireframe or early concept" /></p>
<p><img src="../pictures/work/tooling-project/tooling-2.png" alt="Tooling project for PT – low-fidelity prototype" /></p>
<p><img src="../pictures/work/tooling-project/tooling-3.png" alt="Tooling project for PT – high-fidelity prototype" /></p>

---

<!-- Slide 17 – Present (Proposal Generator – Excel VBA) -->

<!-- _class: art-top-right -->

## Theme: Technical Implementation – Proposal Generator (Excel VBA)

<p><img src="../pictures/work/proposal-generator.png" alt="Proposal Generator – Excel-based project proposal tool" /></p>

- **Definition:** Excel-based application for **automated proposal creation**—project proposals: define activities, estimate hours, Gantt-style timeline, and generate PowerPoint.
- **Generation logic:** Uses **predefined criteria and historical project data**; outputs (activities, hours, timeline) are driven by that logic.

[INSERT DIAGRAM HERE: Proposal Generator UX phases]

- **Technical proficiency:** Developed in **Excel VBA**—macros for automation, calculations, and presentation generation.

<!-- Mermaid source: proposal-generator-phases.mmd - render to proposal-generator-phases.png
flowchart LR
  P["Planning"]
  U["Understand"]
  S["Synthesize"]
  I["Ideate"]
  T["Test"]
  P --> U --> S --> I --> T
-->

---

<!-- Slide 18 – Present (InfoVis Project – PhraseNets Web Visualization) -->

<!-- _class: dense-content phrase-net-images -->

## Theme: Technical Implementation – PhraseNets Web Visualization

- **Course project – Information Visualization (InfoVis):** Developed a web-based PhraseNets visualization to explore relationships in text.\
- **Technique:** Implements PhraseNets pattern-based networks (e.g. subject–verb, verb–object) to reveal co-occurrence structures that standard charts miss.\
- **Why it matters:** Demonstrates proficiency in **web development** (interactive browser-based interface) and **advanced visual structures** beyond standard Power BI capabilities.

<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-1.png" alt="PhraseNets web visualization – interface and controls" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-2.png" alt="PhraseNets visualization – example network 1" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-3.png" alt="PhraseNets visualization – example network 2" /></p>

---

<!-- Slide 19 – Future (AI & Agile in Research) -->
<!-- Mermaid flowchart source: ai-agile-research.mmd - render to ai-agile-research.png -->

## Theme: Process & Future – AI & Agile in Research

- **Motivation:** Research projects often lack repeatable, quality-focused processes and clear accountability.  
- **Proposal:** Combine **AI assistance** with **Scrum practices** to improve throughput, transparency, and quality.  
- **Approach:**

[INSERT DIAGRAM HERE: AI and Agile in Research]

- **Guardrails:** AI outputs treated as drafts; strong focus on reproducibility, data privacy, and explicit quality criteria.

<!-- Mermaid source: ai-agile-research.mmd
flowchart TD
  subgraph roles [Roles]
    RPO["Research Product Owner"]
    RSM["Research Scrum Master"]
    RT["Research Team\ncollaborators + AI tools"]
  end
  subgraph ceremonies [Ceremonies]
    C1["Sprint planning\nBacklog refinement"]
    C2["Daily check-ins\nReviews\nRetrospectives"]
  end
  subgraph artifacts [Artifacts]
    A1["Research backlog\nExperiment cards"]
    A2["Dashboards and tools\nAI-generated drafts\nhuman-reviewed"]
  end
  roles --> ceremonies
  ceremonies --> artifacts
-->  

---

<!-- Slide 20 – Present (Innovation & Awards) -->

<!-- _class: art-top-right compact-list -->

## Theme: Process & Innovation – Awards

<p><img src="../pictures/work/bosch-2018.jpg" alt="Bosch Talent Forum 2018 - 3rd Place Award" /></p>

[INSERT TABLE HERE: Awards]

| Award | Place | Year / Context |
| ----- | ----- | -------------- |
| X-Games Brazil | 1st | 2018 – New Business Creation / Consultancy |
| Bosch Talent Forum | 3rd | 2018 – Project Management Software |
| Bosch Intern Talent Forum | 3rd | 2018 – Intern projects |
| NGO Hospitalhaços | Volunteer | Admin – social impact and community engagement |  

---

<!-- Slide 21 – Past (Experience Timeline) -->

<!-- _class: art-top-right dense-content -->

## Theme: Process – Experience Timeline (Condensed)

- **Trajectory across Bosch locations:** Brazil, Hungary (Budapest), Germany, Argentina.

<p><img src="../pictures/work/budapest-2019.jpg" alt="Bosch Magyarország - Budapest 2019" /></p>
<p><img src="../pictures/work/budapest-2019-2.jpg" alt="Budapest team 2019 – farewell book" style="max-width: 200px; height: auto;" /></p>
<p><img src="../pictures/work/bosch-argentina.jpg" alt="Bosch Argentina – We are Bosch" style="max-width: 200px; height: auto;" /></p>

[INSERT DIAGRAM HERE: Experience timeline]

<!-- Mermaid source: experience-timeline.mmd - render to experience-timeline.png
timeline
    title Experience Timeline
    2017-2018 : Intern – Bosch Brasil : VBA, Continuous Improvement, internal communication
    2019 : Digitization Support Analyst – Bosch Magyarország Budapest : Business Excellence, VS Code, SQL Server, IIS
    2021-2023 : Web Developer – Bosch Brasil : Technology, React, Scrum; requirements to production
-->  

---

<!-- Slide 22 – Future (Career Aspirations, Vacancy Types & Strategic Views) -->

## Future – Career Aspirations, Vacancy Types & Strategic Views

<!-- Mermaid timeline source: future-career-timeline.mmd -->

<p><img src="future-career-timeline.png" alt="Future Career Path Timeline" style="max-width: 90%; height: auto; margin: 0.5rem auto; display: block;" /></p>

- **Future objective:** Work in **technology-focused roles** that integrate **in-depth research, project management, and AI implementation** as a core professional interest.  
- **Desired vacancy types (Bosch & external):**

[INSERT TABLE HERE: Future vacancy types and examples]

| Type | Bosch examples | External examples |
| ---- | -------------- | ----------------- |
| Researcher / Senior | Global Service Solutions – service platforms, internal tools | Trust & Safety – trust, safety, fairness at scale |
| Technology / PM Lead | Digital / Enterprise Applications – B2B tools for service teams | — |
| Scrum Master / Agile Coach | — | Data-informed, research-oriented facilitation |
| Researcher advanced tech | — | Quantum & AI – technology and human factors |  
- **Target roles:** Researcher, Technology / Project Management Lead, Scrum Master, or Researcher in advanced tech contexts.  
- **Scrum Master role – focus:** Data-informed, research-oriented agile facilitation for technology, AI, and trustworthiness projects; project management and delivery quality.  
- **Core Scrum Master responsibilities:** Maintain **data integrity** and ensure **statistical relevance** across experiments and project lifecycles; oversee the **rigorous application of scientific methods** and the **adequate use of AI** to accelerate deliverables (never replacing human judgment); manage project timelines to **prevent stagnation and perpetual postponement**.  
- **Proactive strategies for communication blockers:** If appointment requests are not answered, deploy short, targeted surveys to collect decisions and unblock work; if surveys are not completed, schedule **mandatory 10-minute sessions** to secure answers and align expectations.  
- **Stakeholder engagement protocols:** Maintain **direct customer contact** to guarantee delivery of agreed outcomes; ensure customers are held **accountable for supporting project deliverables**, including providing data, approvals, and access needed to move forward.  
- **Strategic View A – "Paradise" (Quantum Computing):** Deep technical research and experimentation in quantum computing and advanced R&D. Leverages analytical skills, experimentation mindset, and physics background.  
- **Strategic View B – "Modest" (Scrum / Agile Leadership):** Scrum Master or agile leader enabling teams to deliver high-quality products. Builds on CIP, project management, facilitation, and coaching.  
- **Shared assets:** In-depth research, technology, project management, CIP integration, AI + agile methodology, and data-driven decision-making.

---

<!-- Slide 23 – Future (Personal Interests as Career Enablers) -->

<!-- _class: dense-content personal-images -->

## Future – Personal Interests that Power My Work

- **At home:** Two cats, beginner piano practice, and a split keyboard for macro creation and productivity.

<p><img src="../pictures/personal/my-family.jpg" alt="Family" /></p>
<p><img src="../pictures/personal/friends.jpg" alt="Friends" /></p>
<p><img src="../pictures/personal/germany-2025.jpg" alt="Germany 2025" /></p>
<p><img src="../pictures/personal/budapes-2019-2.jpg" alt="Budapest 2019" /></p>
<p><img src="../pictures/personal/cat-piano.jpg" alt="Cat on piano – beginner piano practice" /></p>
<p><img src="../pictures/personal/cat-slipt-keyboard.jpg" alt="Cat on split keyboard – macro creation and productivity" /></p>

[INSERT TABLE HERE: Personal interests and career enablers]

| Interest | Career enabler |
| -------- | -------------- |
| Piano | Discipline, structured practice, performance under pressure |
| Linguistics (phonology & phonetics) | Clarity in copy; speech interfaces and accessibility |
| Physics (GR & Quantum) | Complex systems; quantum computing and advanced tech research |
| Acting | Empathy, storytelling, presence in interviews and workshops |
| Impressionist art | Nuanced perception and diverse perspectives in research |
| Macro creation | Automation and workflow optimization |
| Specialized keyboards | Ergonomics, productivity, technology and accessibility |  

---

<!-- Slide 26 – Closing & Contact -->

## Closing & Contact

[INSERT TABLE HERE: Closing – What I bring and contact]

**What I bring**

| Area | Summary |
| ---- | ------- |
| Core | In-depth Research, Technology & Project Management |
| Leadership | UX Maturity Level 4 – Americas |
| Milestone | CIP and UX Integration – Cursor IDE, AI, coding; Senior Researcher evolution |
| Research | Trust in interfaces; data-driven decision-making |

**Let's connect:** Email: edu.evangelista.figueiredo@gmail.com · LinkedIn: https://www.linkedin.com/in/eduardo-figueiredo · Resume PDF and this portfolio deck available on request.

---

<!-- Slide 27 – Blank Conclusion Page -->

<!-- _class: blank-midnight-blue -->
