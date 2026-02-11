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
    font-size: 14pt;
    line-height: 1.3;
    color: var(--text-color);
  }
  section {
    background-color: #fff;
    padding: 0.3rem 0.5rem;
    margin: 0;
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
    font-size: 2.2rem;
    border-bottom: 3px solid var(--accent-color);
    display: inline-block;
    padding-bottom: 0.1rem;
  }
  h2 {
    font-size: 1.6rem;
    border-left: 5px solid var(--accent-color);
    padding-left: 0.4rem;
  }
  h3 { font-size: 1.3rem; color: var(--accent-color); }
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
    background-color: var(--primary-color);
    color: white;
  }
  section.lead h1, section.lead h2 { color: white; border-color: var(--accent-color); }
  section.lead {
    background-image: url("../arts/art-5.png");
    background-size: 55% auto;
    background-position: center 58%;
    background-repeat: no-repeat;
  }
  section.lead img { display: block; margin-left: auto; margin-right: auto; }
  section.lead::after {
    display: none;
  }
  section.persona-slide img[alt*="Persona 2"] { display: block; margin-left: auto; margin-right: auto; margin-top: -1rem; }
  
  /* Global Decorative Elements */
  section:not(.lead) {
    /* Subtle dot grid to fill whitespace */
    background-image: radial-gradient(var(--bg-dot) 1px, transparent 1px);
    background-size: 20px 20px;
    /* Top accent bar */
    border-top: 6px solid var(--primary-color);
  }

  /* Image Styling - Scattered Photo Effect with Unique Rotations */
  section:not(.lead) img {
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
    background-color: #2c3e50;
    background-image: none;
    border-top: none;
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

# Why I Work With UX & Research
## Trustworthy, human-centered software for complex services

- I believe that software used in service organizations must be **trustworthy, usable, and inclusive**—especially when decisions affect people and businesses at scale.
- My work connects **UX research**, **front-end development**, and **Continuous Improvement (CIP)** so that user needs are built into processes, not added at the end.
- This portfolio tells that story: **past foundations** → **present impact** → **future directions**.

---

<!-- Slide 2 – Who I Am (Golden Circle: Who/What) -->

<!-- _class: art-top-right -->

## Who I Am – Snapshot

<p><img src="../pictures/personal/my-photo-rectangle.png" alt="Eduardo Figueiredo" /></p>

- **Name:** Eduardo M. de A. Figueiredo  
- **Role:** UX Researcher & Front-End Developer (Master's in Technology, Unicamp).  
- **Focus:** Integrating UX into **Continuous Improvement (CIP)** and **measuring software trustworthiness**.  
- **Impact:** Led the Americas region to **UX Maturity Level 4**, implemented **AI-driven UX quality gates**, and supported international projects (Hungary).  
- **Location & Contact:** Nova Odessa, SP – Brazil · `edu.evangelista.figueiredo@gmail.com` · LinkedIn / phone on request.  

---

<!-- Slide 3 – Past (Foundations: Education & Profile) -->

<!-- _class: art-top-right -->

## Past – Academic Foundations & Professional Profile

<p><img src="../pictures/academia/academic-writing.jpg" alt="Academic Writing Course - Unicamp" /></p>

- **Master's in Technology – Information & Communication Systems (UX)** – Unicamp (2023–2025).  
  - Thesis: **Benchmark to assess software trustworthiness** via Usability, Accessibility, and UX.  
  - **Grade 'A' in all Master's coursework** — Official Unicamp transcript (Histórico Escolar) confirms top evaluation "Aprovado por Conceito e Frequência" in every completed discipline.  
  - **Master's courses:** Academic Writing (*Escrita Acadêmica*); Directed Studies I (*Estudos Dirigidos I*); Innovation and Technology Transfer (*Inovação e Transferência de Tecnologias*); Scientific Research (*Pesquisa Científica*); Information Visualization (*Visualização de Informação*).  
- **English proficiency (UFSC):** Reading comprehension for postgraduate programs – **10/10** (Apr 2024). Certificate in Appendix.  
- **Systems Analysis and Development** – Unicamp (2015–2020).  
- **Technical Degree in Computer Science** – ETEC Bento Quirino (2012–2014).  
- **Professional profile:** Proactive, self-reliant, organized; combines UX research, design, and front-end development with agile practices (Scrum, Kanban) and project management.  

---

<!-- Slide 4 – Past (Experience Timeline) -->

<!-- _class: art-top-right dense-content -->

## Past – Experience Timeline (Condensed)

<p><img src="../pictures/work/budapest-2019.jpg" alt="Bosch Magyarország - Budapest 2019" /></p>

- **Intern – Bosch Brasil (2017–2018):** VBA (Excel) solutions for Continuous Improvement and internal communication.  
- **Digitization Support Analyst – Bosch Magyarország (Budapest, 2019):** Business Excellence digitization using VS Code, SQL Server, and Windows Server (IIS).  
- **Web Developer – Bosch Brasil (2021–2023):** Web solutions with front-end focus; React and Scrum. Worked from **user pain points → prototypes → production** with cross-functional teams.  

---

<!-- Slide 5 – Present (Role & Strategic Impact) -->

<!-- _class: art-top-right -->

## Present – UX Research & Design Analyst (Bosch Brasil)

<p style="position: absolute; top: 0.5rem; left: 0.5rem; margin: 0;"><img src="../pictures/work/bdu/UXGS%20Logo_verticle.svg" alt="UXGS area logo" style="height: 56px; width: auto;" /></p>
<p><img src="../pictures/work/americas-team-2025.jpg" alt="Americas Team 2025 - UX Maturity Level 4" /></p>
<p style="position: absolute; top: 0.5rem; right: 2rem; margin: 0;"><img src="../pictures/work/in-front-of-the-bosch-building.jpg" alt="In front of Bosch building" style="width: 150px; height: auto;" /></p>

- **Role:** UX Research & Design Analyst – Bosch Brasil (May 2023 – present).  
- **UX Project Champion (GS/BDU):** Project Manager for the region.  
- **International assignments:** Two trips to Germany (2024 and 2025) to perform role-related responsibilities.  
- **CO2 Tracking (GS/UX):** First project completed within the UX department at GS. Scope: **marketing scouting for CO2 tracking telemetry**. Primary finding: research indicated a **lack of market demand**; conclusion that continued sales of the telemetry solution would be unsuccessful.  
- **UX Maturity Level 4 (Americas):** Led the region to **Level 4** by setting governance, templates, and training for service lines. Demonstrated systematic UX application to auditors.  
- **CIP + UX integration:** Led **"CIP and UX Integration"** as a critical career milestone—embedding UX checks into the Continuous Improvement workflow in ServiceNow CIM. Impact: stronger customer retention and revenue via user-centric service design; marked evolution toward Senior Researcher capabilities.  
- **Collaboration & teaching:** Applied scientific methods to identify service issues and design solutions. Tutor at **SENAI Digital Talent Academy**.  

---

<!-- Slide 6 – Present (CIP and UX Integration: Critical Career Milestone) -->

<!-- _class: art-top-right -->

## Present – CIP and UX Integration: A Critical Career Milestone

<p><img src="../pictures/work/digital-ws.jpg" alt="UX Strategy Workshop" /></p>

- **Career significance:** This project marks a pivotal evolution into **Senior Researcher** capabilities—combining deep, data-oriented investigation with technical execution and governance design.  
- **Project scope:** Integrated **UX relevance assessment** into the **Continuous Improvement Process (CIP)** in ServiceNow CIM. A **UX gate** sits between Assess and Approve; the method runs at that gate to triage improvement initiatives (Low / Medium / High UX relevance).  
- **Methodology—developer skills for research:** Utilized **Cursor IDE**, **AI-assisted coding**, and version-controlled Python pipelines to conduct research. Workflow: (1) **iterative code-based documentation** (Markdown, method.md v2.8); (2) **AI-assisted analysis** of N=214 research records and UX maturity data; (3) **automated pipeline** (extract → aggregate → calculate scores) producing `ux_relevance_results.csv` (N=35 projects); (4) **high-quality, data-oriented reports** in Markdown with executive summaries, Criticality Index (Severity × Frequency), and validation hypotheses.  
- **Deliverables:** **UX Relevance Quick Method** (10 system-calculated questions from 11 CIM fields; thresholds Low &lt;60, Medium 60–70, High ≥70); **1st Research Report** (January 2026) consolidating stakeholder inputs; **standalone pipeline** (`extract_cim_data.py`, `calculate_ux_scores.py`, `aggregate_to_csv.py`) with reproducible validation.  
- **Impact:** Governance clarity, reduced perceived delay, and reusable UX governance framework. Aligned CAP and UX into a unified, defensible solution.  

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

<!-- Slide 7 – Present (Power BI Dashboards at Work) -->

<!-- _class: dense-content work-pbi-images -->

## Present – Power BI Dashboards at Work

- **Bosch UXGS Americas:** Power BI dashboards developed in role for project and resource oversight and for training tracking—supporting data-driven decision-making and governance.

<p><img src="../pictures/work/pbi-allocation.png" alt="Power BI – LA Allocation Dashboard" /></p>
<p><img src="../pictures/work/pbi-training-evolution.png" alt="Power BI – SMTs Evolution training dashboard" /></p>

---

<!-- Slide 7b – Present (CSI & NPS Performance 2024–2025) -->
<!-- Mermaid diagram source: csi-nps-performance.mmd - render to csi-nps-performance.png -->

## Present – CSI & NPS Performance (2024–2025)

- **High customer satisfaction** across eight UX projects delivered in 2024–2025. **Averages: CSI 4.86 / 5, NPS 9.94 / 10.**
- **Projects:** GS_R2S_TET2-LA UI Design for Financial Portal (CSI 5) · EXT_PS_CCC Telemetry for light vehicles (CSI 5, NPS 10) · EXT_M-PUR36 Tooling Management (CSI 5, NPS 10) · EXT_M-PMQ PPAP Application (CSI 5, NPS 10) · GS_P2P_MovDiv_Improvement part 1 (CSI 5, NPS 10) · GS_P2P_Financial_Portal (CSI 5, NPS 10) · GS_UX Bootcamp 2024 Joinville—95 people (CSI 4.9, NPS 9.6) · GS_B2R_AA CF Automation (CSI 4, NPS 10).

<p><img src="csi-nps-performance.png" alt="CSI and NPS performance metrics 2024–2025 – project table" style="max-width: 95%; height: auto; margin: 0.5rem auto; display: block;" /></p>

---

<!-- Slide 8 – Present (Proposal Generator – Excel VBA) -->

<!-- _class: art-top-right -->

## Present – Proposal Generator (Excel VBA)

<p><img src="../pictures/work/proposal-generator.png" alt="Proposal Generator – Excel-based UX proposal tool" /></p>

- **Definition:** Excel-based application for **automated proposal creation**—project proposals for UX activities: define activities, estimate hours, Gantt-style timeline, and generate PowerPoint.
- **Generation logic:** Uses **predefined criteria and historical project data**; outputs (activities, hours, timeline) are driven by that logic.
- **UX complexity:** Outputs are **categorized by UX complexity** (phases: Planning, Understand, Synthesize, Ideate, Test); the tool supports activity definition and visualization by these categories.
- **Technical proficiency:** Developed in **Excel VBA (Visual Basic for Applications)**—macros for automation, calculations, and presentation generation.

---

<!-- Slide 9 – Present (Tooling Project for PT) -->

<!-- _class: dense-content tooling-project-images -->

## Present – Tooling Project for PT

- **Tooling project for PT:** A key development in **design proficiency**—from wireframe to high-fidelity prototype, with collaborative **customer progress review meetings** throughout.
- **Design workflow:** **Wireframe** → **low-fidelity prototype** → **high-fidelity prototype**; iterative refinement with stakeholder feedback.
- **Collaboration:** Customer progress review meetings used to align on scope, validate flows, and sign off on deliverables at each stage.

<p><img src="../pictures/work/tooling-project/tooling-1.png" alt="Tooling project for PT – wireframe or early concept" /></p>
<p><img src="../pictures/work/tooling-project/tooling-2.png" alt="Tooling project for PT – low-fidelity prototype" /></p>
<p><img src="../pictures/work/tooling-project/tooling-3.png" alt="Tooling project for PT – high-fidelity prototype" /></p>

---

<!-- Slide 10 – Present (Academic Research & TrustMate) -->

<!-- _class: art-top-right -->

## Present – Academic Research (Trust in AI & UI)

<p><img src="../pictures/academia/hfsd-workshop-1.jpg" alt="ISSRE 2025 HFSD Workshop" /></p>

- **Master's research focus:** Creating a **benchmark to assess software trustworthiness** across three parameters: **Usability, Accessibility, and User Experience**. Thesis explores quantitative methods for evaluating perceived trust in e-commerce and software interfaces.  
- **Published articles:** **ISSRE 2025 (HFSD Workshop – IEEE):** *"Measuring Perceived Trust in Websites: A digital tool providing a score for evaluation"* – explores how Agentic AI can emulate trust perception and provides a digital scoring mechanism. **IHC 2025 (SBC SOL):** *"Interface Trustworthiness Score Definition Platform"* (co-authored with Regina Moraes, Andreia Casare) – published in **SOL (SBC Open Lib)**, presents a platform for defining and calculating interface trustworthiness scores.  
- **PowerBI in master's research:** **PowerBI dashboards** used extensively for data visualization and analysis of trust metrics. Dashboards aggregate usability, accessibility, and UX data to generate comprehensive trustworthiness scores. Enables interactive exploration of research findings, trend analysis across different interface types, and validation of trust perception models.  
- **Tooling:** **TrustMate** – digital tool to evaluate perceived trust in interfaces, integrated with PowerBI for real-time score visualization.  
- **Dissertation technologies:** **AI agents as survey respondents** – agentic AI completes trust/usability surveys (e.g. e-commerce evaluation), enabling scalable data collection for the benchmark and TrustMate. **Full-stack development** – frontend (TrustMate UI, survey and dashboard), backend (evaluation pipeline, score calculation), and database architecture for projects, experiments, attributes, scores, and agent runs. **Low-fidelity prototyping (Figma)** – iterative design of survey flows, evaluation screens, and TrustMate interface before implementation.  
- **Industry connection:** Methods and tools are reusable for UX audits, maturity assessments, and CIP + UX work.  

---

<!-- Slide 11 – Present (Dissertation: Technical Implementation & Impact) -->

<!-- _class: dense-content dissertation-tech-images -->

## Present – Dissertation: Technical Implementation & Impact

- **AI agents as survey respondents**, **full-stack development** (frontend, backend, database), and **Figma low-fidelity prototyping** – illustrated below.

<p><img src="../pictures/academia/disseratation-tech-1-agents-1.png" alt="AI agent survey – e-commerce evaluation" /></p>
<p><img src="../pictures/academia/disseratation-tech-1-agents-2.png" alt="AI agent survey – TrustMate dashboard" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-1.png" alt="E-commerce evaluation – product page" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-2.png" alt="Evaluation metrics – trust and UX scores" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-3.png" alt="TrustMate – hierarchy of attributes" /></p>
<p><img src="../pictures/academia/disseratation-tech-3-prototype-1.png" alt="TrustMate tool evaluation – prototype" /></p>

<!-- Mermaid diagram source: dissertation-database-architecture.mmd -->

<p><img src="dissertation-database-architecture.png" alt="Dissertation / TrustMate database architecture" style="max-width: 70%; height: auto; margin: 0.5rem auto; display: block;" /></p>

---

<!-- Slide 12 – Present (Dissertation: Power BI Visualizations) -->

<!-- _class: dense-content dissertation-pbi-images -->

## Present – Dissertation: Power BI Visualizations

- **Dissertation InfoVis (Power BI):** Dashboards and charts for trust-metrics analysis—variability of human scores across websites (Americanas, MadeiraMadeira, Kabum), AI × human homogeneity by attribute, and line comparisons (human vs AI scores per website). Supports validation of trust perception models and consolidation of research findings.

<p><img src="../pictures/academia/dissertation/dissertation-pbi-1.png" alt="Power BI – variability of human scores between websites" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-2.png" alt="Power BI – AI × human homogeneity by attribute" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-3.png" alt="Power BI – AI × humans comparison lines per website" /></p>

---

<!-- Slide 13 – Present (InfoVis Project – PhraseNets Web Visualization) -->

<!-- _class: dense-content phrase-net-images -->

## Present – InfoVis Project – PhraseNets Web Visualization

- **Course project – Information Visualization (InfoVis):** Developed a web-based PhraseNets visualization to explore relationships in text.\
- **Technique:** Implements PhraseNets pattern-based networks (e.g. subject–verb, verb–object) to reveal co-occurrence structures that standard charts miss.\
- **Why it matters:** Demonstrates proficiency in **web development** (interactive browser-based interface) and **advanced visual structures** beyond standard Power BI capabilities.

<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-1.png" alt="PhraseNets web visualization – interface and controls" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-2.png" alt="PhraseNets visualization – example network 1" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-3.png" alt="PhraseNets visualization – example network 2" /></p>

---

<!-- Slide 14 – Present (InfoVis Project – Power BI & PNAD Contínua) -->

<!-- _class: dense-content infovis-pbi-images -->

## Present – InfoVis Project – Power BI & PNAD Contínua

- **InfoVis class project – Power BI:** Built multi-page reports with advanced visual structures using **PNAD Contínua** (Pesquisa Nacional por Amostra de Domicílios Contínua), Brazil’s National Household Sample Survey.
- **Visual structures:** Sankey diagrams (education–employment trajectories; education, household size, and income flows), choropleth map (nuclear vs non-nuclear income by state), and faceted bar charts (monthly income by education, household type, and area). Processed and modeled complex national survey data for insight.
- **Impact:** Demonstrates **Power BI** proficiency and the ability to **process complex national research datasets** into clear, actionable visual insights for socioeconomic analysis.

<p><img src="../pictures/academia/infovis/pbi-infovis-1.png" alt="Power BI – Education-employment trajectories Sankey" /></p>
<p><img src="../pictures/academia/infovis/pbi-infovis-2.png" alt="Power BI – Family structure and socioeconomic patterns" /></p>

---

<!-- Slide 15 – Present (Scientific Publications – Snapshot) -->

<!-- _class: dense-content article-images -->

## Present – Scientific Publications

<p><img src="../pictures/academia/articles/article-1-1.png" alt="Article 1 page 1" /></p>
<p><img src="../pictures/academia/articles/article-1-2.png" alt="Article 1 page 2" /></p>
<p><img src="../pictures/academia/articles/article-2-1.png" alt="Article 2 page 1" /></p>
<p><img src="../pictures/academia/articles/article-2-2.png" alt="Article 2 page 2" /></p>
<p><img src="../pictures/academia/articles/dissertation-page-1.png" alt="Dissertation page 1" /></p>
<p><img src="../pictures/academia/articles/dissertation-page-2.png" alt="Dissertation page 2" /></p>

- Published work in **ISSRE 2025 (HFSD Workshop)** and **IHC 2025 (SBC SOL)**; master's dissertation on software trustworthiness.

---

<!-- Slide 16 – Present (Innovation & Awards) -->

<!-- _class: art-top-right compact-list -->

## Present – Innovation & Awards

<p><img src="../pictures/work/bosch-2018.jpg" alt="Bosch Talent Forum 2018 - 3rd Place Award" /></p>

- **1st Place – X-Games Brazil 2018** – New Business Creation / Consultancy.  
- **3rd Place – Bosch Talent Forum 2018** – Project Management Software.  
- **3rd Place – Bosch Intern Talent Forum 2018** – Intern projects.  
- **Volunteer – NGO Hospitalhaços (Admin)** – social impact and community engagement.  

---

<!-- Slide 17 – Future (Career Aspirations, Vacancy Types & Strategic Views) -->

## Future – Career Aspirations, Vacancy Types & Strategic Views

<!-- Mermaid timeline source: future-career-timeline.mmd -->

<p><img src="future-career-timeline.png" alt="Future Career Path Timeline" style="max-width: 90%; height: auto; margin: 0.5rem auto; display: block;" /></p>

- **Future objective:** Work in **technology-focused roles** that integrate **UX research skills with AI implementation and development** as a core professional interest.  
- **Desired vacancy types (Bosch & external):** UX Researcher / Senior UX Researcher, UX Lead or Manager, Scrum Master or Agile Coach for product teams, and Researcher roles in advanced tech (AI, quantum, data-intensive systems).  
- **Representative vacancy examples – Bosch:**  
  - UX Researcher – Bosch Global Service Solutions: research for service organization platforms and internal tools.  
  - UX Lead – Bosch Digital / Enterprise Applications: lead UX strategy and research for complex B2B tools used by service teams.  
- **Representative vacancy examples – external companies:**  
  - Senior UX Researcher – Trust & Safety at a global product company (e.g. large-scale e-commerce or cloud platform) focusing on **trust, safety, and fairness** in digital experiences.  
  - UX Researcher – Advanced Tech / Quantum & AI at a research-focused lab or big tech company, connecting **human factors, quantum/AI, and interface design**.  
- **Target roles:** UX Researcher, UX Lead, Scrum Master, or Researcher in advanced tech contexts.  
- **Scrum Master role – focus:** Data-informed, research-oriented agile facilitation for UX, AI, and trustworthiness projects, ensuring delivery quality and learning.  
- **Core Scrum Master responsibilities:** Maintain **data integrity** and ensure **statistical relevance** across experiments and project lifecycles; oversee the **rigorous application of scientific methods** and the **adequate use of AI** to accelerate deliverables (never replacing human judgment); manage project timelines to **prevent stagnation and perpetual postponement**.  
- **Proactive strategies for communication blockers:** If appointment requests are not answered, deploy short, targeted surveys to collect decisions and unblock work; if surveys are not completed, schedule **mandatory 10-minute sessions** to secure answers and align expectations.  
- **Stakeholder engagement protocols:** Maintain **direct customer contact** to guarantee delivery of agreed outcomes; ensure customers are held **accountable for supporting project deliverables**, including providing data, approvals, and access needed to move forward.  
- **Strategic View A – "Paradise" (Quantum Computing):** Deep technical research and experimentation in quantum computing and advanced R&D. Leverages analytical skills, experimentation mindset, and physics background.  
- **Strategic View B – "Modest" (Scrum / Agile Leadership):** Scrum Master or agile leader enabling teams to deliver high-quality products. Builds on CIP & UX experience, facilitation, and coaching.  
- **Shared assets:** UX research, CIP + UX integration, AI + agile methodology, and data-driven decision-making.

---

<!-- Slide 18 – Future (AI & Agile in Research) -->
<!-- Mermaid flowchart source: slide-9-diagram.mmd -->

## Future – AI & Agile in Research

- **Motivation:** Research projects often lack repeatable, quality-focused processes and clear accountability.  
- **Proposal:** Combine **AI assistance** with **Scrum practices** to improve throughput, transparency, and quality.  
- **Approach:** Roles: Research Product Owner, Research Scrum Master (me), Research Team (collaborators + AI tools). Ceremonies: sprint planning, backlog refinement, daily check-ins, reviews, retrospectives. Artifacts: research backlog, experiment cards, dashboards/tools, AI-generated drafts (human-reviewed).  
- **Guardrails:** AI outputs treated as drafts; strong focus on reproducibility, data privacy, and explicit quality criteria.  

---

<!-- Slide 19 – Future (Personal Interests as Career Enablers) -->

<!-- _class: dense-content personal-images -->

## Future – Personal Interests that Power My Work

<p><img src="../pictures/personal/my-family.jpg" alt="Family" /></p>
<p><img src="../pictures/personal/friends.jpg" alt="Friends" /></p>
<p><img src="../pictures/personal/germany-2025.jpg" alt="Germany 2025" /></p>
<p><img src="../pictures/personal/budapes-2019-2.jpg" alt="Budapest 2019" /></p>

- **Piano:** Discipline, structured practice, and performance under pressure – mirrors iterative design and delivery.  
- **Linguistics (phonology & phonetics):** Clarity in communication, better UX copy, and insights into speech interfaces and accessibility.  
- **Physics (GR & Quantum):** Comfort with complex systems and abstractions; aligns with research in **quantum computing** and advanced tech.  
- **Acting:** Empathy, storytelling, and presence in interviews, workshops, demos, and Scrum ceremonies.  
- **Impressionist art:** Appreciation for nuanced perception and subjective experience – informs user research and understanding diverse perspectives.  
- **Macro creation:** Expertise in automation and efficiency optimization – translates to workflow improvements and tool development in UX and development contexts.  
- **Specialized keyboard configurations:** Interest in ergonomic design and personalized interfaces – connects to accessibility research and user-centered design thinking.  

---

<!-- Slide 20 – Appendix (Academic Visuals Gallery) -->

<!-- _class: dense-content academic-images -->

## Appendix – Academic Visuals Gallery

- Including **Unicamp Histórico Escolar** (Master's transcript: grade 'A' in all coursework); **UFSC English Proficiency** (reading comprehension for postgraduate programs, 10/10, 2024).

<p><img src="../pictures/academia/docs/historico-escolar.png" alt="Unicamp Histórico Escolar – Master's transcript, grade A in all disciplines" /></p>
<p><img src="../pictures/academia/academic-writing.jpg" alt="Academic writing course - academia" /></p>
<p><img src="../pictures/academia/english-proficiency.png" alt="English proficiency certificate – UFSC 10/10" /></p>
<p><img src="../pictures/academia/hfsd-workshop-1.jpg" alt="HFSD workshop 1 - academia" /></p>
<p><img src="../pictures/academia/hfsd-workshop-2.jpg" alt="HFSD workshop 2 - academia" /></p>
<p><img src="../pictures/academia/ihc-2025-1.jpg" alt="IHC 2025 article 1 page - academia" /></p>
<p><img src="../pictures/academia/ihc-2025-2.jpg" alt="IHC 2025 article 2 page - academia" /></p>

---

<!-- Slide 21 – Appendix (Workshops & Teams Gallery) -->

<!-- _class: dense-content workshop-images -->

## Appendix – Workshops & Teams Gallery

<p><img src="../pictures/work/bosch-argentina.jpg" alt="Bosch Argentina workshop" /></p>
<p><img src="../pictures/work/budapest-2019-2.jpg" alt="Budapest 2019 workshop photo 2" /></p>
<p><img src="../pictures/work/germany-ws-2024.jpg" alt="Germany workshop 2024" /></p>
<p><img src="../pictures/work/joinville-ws-2024.jpg" alt="Joinville workshop 2024" /></p>
<p><img src="../pictures/personal/my-photo-rectangle.png" alt="Portrait rectangle general" /></p>
<p><img src="../pictures/personal/my-photo.png" alt="Portrait square general" /></p>

---

<!-- Slide 22 – Closing & Contact -->

## Closing & Contact

- **What I bring:**  
  - UX Research & Front-End Development  
  - UX Maturity Level 4 leadership across the Americas  
  - **CIP and UX Integration** (critical milestone): deep, data-oriented research using Cursor IDE, AI, and coding; high-quality Markdown reports; Senior Researcher evolution  
  - Academic research on **trust in interfaces** and data-driven decision-making  
- **Let’s connect:**  
  - Email: `edu.evangelista.figueiredo@gmail.com`  
  - LinkedIn: `https://www.linkedin.com/in/eduardo-figueiredo`  
  - Resume PDF and this portfolio deck available on request.

---

<!-- Slide 23 – Blank Conclusion Page -->

<!-- _class: blank-midnight-blue -->
