---
marp: true
theme: default
paginate: true
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

<p><img src="../pictures/my-photo-rectangle.png" alt="Eduardo Figueiredo" /></p>

- **Name:** Eduardo M. de A. Figueiredo  
- **Role:** UX Researcher & Front-End Developer (Master's in Technology, Unicamp).  
- **Focus:** Integrating UX into **Continuous Improvement (CIP)** and **measuring software trustworthiness**.  
- **Impact:** Led the Americas region to **UX Maturity Level 4**, implemented **AI-driven UX quality gates**, and supported international projects (Hungary).  
- **Location & Contact:** Nova Odessa, SP – Brazil · `edu.evangelista.figueiredo@gmail.com` · LinkedIn / phone on request.  

---

<!-- Slide 3 – Past (Foundations: Education & Profile) -->

<!-- _class: art-top-right -->

## Past – Academic Foundations & Professional Profile

<p><img src="../pictures/academic-writing.jpg" alt="Academic Writing Course - Unicamp" /></p>

- **Master's in Technology – Information & Communication Systems (UX)** – Unicamp (2023–2025).  
  - Thesis: **Benchmark to assess software trustworthiness** via Usability, Accessibility, and UX.  
  - A-grade average across all classes.  
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

<p><img src="../pictures/work/americas-team-2025.jpg" alt="Americas Team 2025 - UX Maturity Level 4" /></p>
<p style="position: absolute; top: 0.5rem; right: 12rem; margin: 0;"><img src="../pictures/work/in-front-of-the-bosch-building.jpg" alt="In front of Bosch building" style="width: 150px; height: auto;" /></p>

- **Role:** UX Research & Design Analyst – Bosch Brasil (May 2023 – present).  
- **UX Maturity Level 4 (Americas):** Led the region to **Level 4** by setting governance, templates, and training for service lines. Demonstrated systematic UX application to auditors.  
- **CIP + UX integration:** Managed **"Integrating UX Quality Gates"** – embedding UX checks into CIP using AI and automation. Impact: stronger customer retention and revenue via user-centric service design.  
- **Collaboration & teaching:** Applied scientific methods to identify service issues and design solutions. Tutor at **SENAI Digital Talent Academy**.  

---

<!-- Slide 6 – Present (CIP, UX & Tooling) -->

<!-- _class: art-top-right -->

## Present – CIP, UX & Tooling

<p><img src="../pictures/digital-ws.jpg" alt="UX Strategy Workshop" /></p>

- **CIP & UX integration:** Connects Continuous Improvement practices with UX research and design activities. Ensures UX is a **mandatory gate**, not an optional step.  
- **Research methodology & Cursor IDE workflows:** Applied structured research methodology using **Cursor IDE** for the CIP and UX integration project. Workflow includes: iterative code-based documentation, AI-assisted analysis of UX maturity data, automated report generation, and version-controlled research artifacts. Cursor IDE enabled rapid prototyping of UX quality gate frameworks, collaborative documentation with AI pair-programming, and systematic tracking of research hypotheses and findings.  
- **Methodology & tools:** Uses AI and automation to enforce UX quality gates within service lines. Supports decision-making with **Power BI dashboards** and structured reports.  
- **Results:** Aligned CAP (Continuous Improvement) and UX into a unified solution. Created a reusable framework for UX governance across projects.  

---

<!-- Slide 7 – Present (Academic Research & TrustMate) -->

<!-- _class: art-top-right -->

## Present – Academic Research (Trust in AI & UI)

<p><img src="../pictures/hfsd-workshop-1.jpg" alt="ISSRE 2025 HFSD Workshop" /></p>

- **Master's research focus:** Creating a **benchmark to assess software trustworthiness** across three parameters: **Usability, Accessibility, and User Experience**. Thesis explores quantitative methods for evaluating perceived trust in e-commerce and software interfaces.  
- **Published articles:** **ISSRE 2025 (HFSD Workshop – IEEE):** *"Measuring Perceived Trust in Websites: A digital tool providing a score for evaluation"* – explores how Agentic AI can emulate trust perception and provides a digital scoring mechanism. **IHC 2025 (SBC SOL):** *"Interface Trustworthiness Score Definition Platform"* (co-authored with Regina Moraes, Andreia Casare) – published in **SOL (SBC Open Lib)**, presents a platform for defining and calculating interface trustworthiness scores.  
- **PowerBI in master's research:** **PowerBI dashboards** used extensively for data visualization and analysis of trust metrics. Dashboards aggregate usability, accessibility, and UX data to generate comprehensive trustworthiness scores. Enables interactive exploration of research findings, trend analysis across different interface types, and validation of trust perception models.  
- **Tooling:** **TrustMate** – digital tool to evaluate perceived trust in interfaces, integrated with PowerBI for real-time score visualization.  
- **Industry connection:** Methods and tools are reusable for UX audits, maturity assessments, and CIP + UX work.  

---

<!-- Slide 8 – Present (Innovation & Awards) -->

<!-- _class: art-top-right compact-list -->

## Present – Innovation & Awards

<p><img src="../pictures/bosch-2018.jpg" alt="Bosch Talent Forum 2018 - 3rd Place Award" /></p>

- **1st Place – X-Games Brazil 2018** – New Business Creation / Consultancy.  
- **3rd Place – Bosch Talent Forum 2018** – Project Management Software.  
- **3rd Place – Bosch Intern Talent Forum 2018** – Intern projects.  
- **Volunteer – NGO Hospitalhaços (Admin)** – social impact and community engagement.  

---

<!-- Slide 9 – Future (Career Aspirations, Vacancy Types & Strategic Views) -->

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

<!-- Slide 10 – Future (AI & Agile in Research) -->
<!-- Mermaid flowchart source: slide-9-diagram.mmd -->

## Future – AI & Agile in Research

- **Motivation:** Research projects often lack repeatable, quality-focused processes and clear accountability.  
- **Proposal:** Combine **AI assistance** with **Scrum practices** to improve throughput, transparency, and quality.  
- **Approach:** Roles: Research Product Owner, Research Scrum Master (me), Research Team (collaborators + AI tools). Ceremonies: sprint planning, backlog refinement, daily check-ins, reviews, retrospectives. Artifacts: research backlog, experiment cards, dashboards/tools, AI-generated drafts (human-reviewed).  
- **Guardrails:** AI outputs treated as drafts; strong focus on reproducibility, data privacy, and explicit quality criteria.  

---

<!-- Slide 11 – Future (Personal Interests as Career Enablers) -->

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

<!-- Slide 12 – Closing & Contact -->

## Closing & Contact

- **What I bring:**  
  - UX Research & Front-End Development  
  - UX Maturity Level 4 leadership across the Americas  
  - CIP + UX integration and AI-assisted processes  
  - Academic research on **trust in interfaces** and data-driven decision-making  
- **Let’s connect:**  
  - Email: `edu.evangelista.figueiredo@gmail.com`  
  - LinkedIn: `https://www.linkedin.com/in/eduardo-figueiredo`  
  - Resume PDF and this portfolio deck available on request.

---

<!-- Slide 13 – Blank Conclusion Page -->

<!-- _class: blank-midnight-blue -->
