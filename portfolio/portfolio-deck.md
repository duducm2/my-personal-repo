---
marp: true
theme: default
paginate: false
title: "Eduardo Figueiredo – Portfolio"
author: "Eduardo Figueiredo"
style: |
  /* === IMAGE SIZE & POSITION (img-tune + scoped style for Marp/PDF) ===
   * Theme and PDF export often override inline styles on <img>. For reliable control:
   * (1) On a slide, add <style scoped> and target the image, e.g. img[src*="story-flow"] { width: 60%; margin-top: 10px !important; }
   * (2) Scoped CSS is merged by Marp and applies in PDF. Calibrate by editing values in that block.
   * img-tune class still provides defaults (width: 72%, height: auto) where no scoped rule overrides.
   */
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
    padding: var(--slide-padding);
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
  section.lead img.img-tune {
    margin-left: auto !important;
    margin-right: auto !important;
    height: auto !important;
  }
  section.lead::after {
    display: none;
  }

  /* Second slide: midnight blue */
  section.midnight-blue-slide {
    background-color: #101820; /* Midnight Blue-Black */
    background-image: none;
    border-top: none;
    color: white;
  }
  section.midnight-blue-slide table tr { background-color: transparent !important; }
  section.midnight-blue-slide h2 { color: white; border-color: rgba(255,255,255,0.5); }
  section.midnight-blue-slide p, section.midnight-blue-slide strong { color: white; }
  section.midnight-blue-slide a { color: #a8d4ff; }
  section.midnight-blue-slide table, section.midnight-blue-slide th, section.midnight-blue-slide td { color: white; border-color: rgba(255,255,255,0.3); }
  section.midnight-blue-slide ul, section.midnight-blue-slide li { color: white; }
  section.midnight-blue-slide img { border: 4px solid rgba(255,255,255,0.4); box-shadow: 2px 3px 12px rgba(0,0,0,0.3); }
  section.photo-at-bottom { position: relative; }
  section.photo-at-bottom p.photo-at-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0;
    line-height: 0;
  }
  section.photo-at-bottom p.photo-at-bottom img {
    width: 320px;
    height: auto;
    display: block;
    border: 4px solid rgba(255,255,255,0.4);
    box-shadow: 2px 3px 12px rgba(0,0,0,0.3);
  }

  section.persona-slide img[alt*="Persona 2"] { display: block; margin-left: auto; margin-right: auto; margin-top: -1rem; }
  
  /* Global Decorative Elements */
  section:not(.lead):not(.midnight-blue-slide) {
    /* Subtle dot grid to fill whitespace */
    background-image: radial-gradient(var(--bg-dot) 1px, transparent 1px);
    background-size: 20px 20px;
    /* Top accent bar */
    border-top: 6px solid var(--primary-color);
  }

  section img.img-tune {
    width: 72%;
    height: auto !important;
    object-fit: contain;
    display: inline-block;
    vertical-align: middle;
  }

  /* Image Styling - Scattered Photo Effect with Unique Rotations */
  section:not(.lead):not(.midnight-blue-slide) img {
    border: 4px solid white;
    box-shadow: 2px 3px 8px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  }
  /* Diagrams: no border, no shadow, fit the slide */
  section img[src*="diagrams/"] {
    border: none !important;
    box-shadow: none !important;
  }
  section:not(.lead) img:hover { transform: scale(1.05) rotate(0deg); z-index: 10; }
  
  /* Unique rotation angles for each image - varied degrees for visual interest */
  section:not(.lead) img[alt*="Eduardo Figueiredo"] { transform: rotate(-2.5deg); }
  section:not(.lead) img[alt*="Academic Writing"] { transform: rotate(3.2deg); }
  section:not(.lead) img[alt*="Budapest"] { transform: rotate(-1.8deg); }
  section:not(.lead) img[alt*="Americas Team"] { transform: rotate(2.1deg); }
  section:not(.lead) img[alt*="Research Strategy Workshop"] { transform: rotate(-3.5deg); }
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
  
  /* Final slide – art-background.png, same padding as all slides */
  section.blank-midnight-blue {
    position: relative;
    padding: var(--slide-padding);
    overflow: visible;
    border-top: none;
    background-color: #fff;
  }
  section.blank-midnight-blue .slide-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    z-index: 0;
    pointer-events: none;
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
  section:not(.lead) img[alt*="CIP-Research 1"] { transform: rotate(-2deg); }
  section:not(.lead) img[alt*="CIP-Research 2"] { transform: rotate(1.5deg); }
  section:not(.lead) img[alt*="CIP-Research 3"] { transform: rotate(-1.2deg); }
  section:not(.lead) img[alt*="CIP-Research 4"] { transform: rotate(2deg); }
  section:not(.lead) img[alt*="CIP-Research 5"] { transform: rotate(-1.8deg); }
  section:not(.lead) img[alt*="CIP-Research 6"] { transform: rotate(1.3deg); }
  section:not(.lead) img[alt*="CIP-Research 7"] { transform: rotate(-2.2deg); }
  section:not(.lead) img[alt*="CIP-Research 8"] { transform: rotate(1.7deg); }

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
  section:not(.lead) img[alt*="ETEC logo"],
  section:not(.lead) img[alt*="Unicamp logo"] {
    border: none;
    box-shadow: none;
    transform: none;
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

  /* CIP and Research Integration – eight images */
  section.cip-research-images p {
    display: inline-block;
    margin: 0.25rem;
    vertical-align: top;
  }
  section.cip-research-images img {
    max-width: 18%;
    height: auto;
  }

  /* img-tune: size/position come from inline style (width, margin-top, margin-left) for Marp compatibility */
---

<!-- _class: lead -->

<!--
  HOW TO CALIBRATE IMAGES (Marp/PDF): Every slide with images has a <style scoped> block at the top.
  Edit that block: change width, margin-top, margin-left for the img[src*="..."] selectors.
  Scoped CSS is merged by Marp and applies in PDF export. One place per slide to tune size and position.
-->

<!-- Slide 1 – Why (Golden Circle: Why) -->

<style scoped>
/* Calibrate story-flow image: change width and margin-top here; they apply in Marp/PDF */
img[src*="story-flow"] {
  width: 70% !important;
  height: auto !important;
  margin-top: 70px !important;
  margin-left: 10px !important;
  margin-right: auto !important;
  display: block !important;
  border: none !important;
  box-shadow: none !important;
}
</style>

# Why I Work in Technology, Project Management & Research
## Trustworthy, human-centered software for complex services

- I believe that software used in service organizations must be **trustworthy, usable, and inclusive**, especially when decisions affect people and businesses at scale.
- My work centers **technology**, **project management**, and **in-depth research**, integrating evidence and user needs into processes via systematic delivery.
- This portfolio tells that story:

<p><img src="../pictures/diagrams/story-flow.png" alt="Diagram story-flow: Why story flow" /></p>

<!-- Diagram: story-flow (mermaid/diagrams.md). Export to story-flow.png -->

---

<!-- Slide 2 – Who I Am (Golden Circle: Who/What) -->

<!-- _class: midnight-blue-slide photo-at-bottom -->

<style scoped>
img[src*="my-photo-rectangle"] {
  width: 360px !important;
  height: auto !important;
  display: block !important;
  margin-left: 820px !important;
  margin-bottom: 80px !important;
}
table thead { display: none !important; }
</style>

## Who I Am – Snapshot

| Attribute | Value |
| --------- | ----- |
| Name | Eduardo M. de A. Figueiredo |
| Role | Research, Technology & Project Management |
| Impact | Clearer governance and faster improvement flow; builds scalable research maturity and evidence-based prioritization; uses research to support solid product and service decisions; delivers with data, accountability, and measurable results. |
| Contact | Nova Odessa, SP – Brazil · edu.evangelista.figueiredo@gmail.com · LinkedIn / +55 19 98176-658 |

<p class="photo-at-bottom"><img src="../pictures/personal/my-photo-rectangle.png" alt="Eduardo Figueiredo" /></p>  
<!-- <p><img src="../pictures/personal/my-photo.png" alt="Eduardo Figueiredo" /></p> -->

---

<!-- Slide 3 – Past (Foundations: Education & Profile) -->

<!-- _class: art-top-right -->
<style scoped>
p.logos-together {
  display: flex; align-items: center; gap: 0.5rem;
  margin-top: 1.25rem !important;
  margin-left: -6.5rem !important;
  margin-right: 2.5rem !important;
  margin-bottom: 0.5rem;
  margin-right: auto;
}
p.logos-together img[src*="ETEC.png"] {
  width: 96px !important; height: auto !important;
  transform: rotate(-2.5deg);
}
p.logos-together img[src*="UNICAMP.png"] {
  width: 96px !important; height: auto !important;
  transform: rotate(2deg);
}
p.academic-writing-wrap {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  margin: 0 !important;
  margin-left: 2.5rem !important;
  margin-bottom: 2.5rem !important;
  line-height: 0;
}
p.academic-writing-wrap img {
  width: 400px !important;
  height: auto !important;
  display: block !important;
}
img[src*="academic-timeline"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
section { position: relative; }
p.english-proficiency-wrap {
  position: absolute !important;
  bottom: 0 !important;
  right: 0 !important;
  margin: 0 !important;
  margin-right: 2.5rem !important;
  margin-bottom: 2.5rem;
  line-height: 0;
}
p.english-proficiency-wrap img {
  width: 140px !important;
  height: auto !important;
  display: block !important;
  margin-bottom: 1.5rem !important;
}
p.historico-wrap {
  position: absolute !important;
  bottom: 0 !important;
  right: 12rem !important;
  margin: 0 !important;
  line-height: 0;
}
p.historico-wrap img {
  margin-bottom: 1.5rem !important;
  width: 140px !important;
  height: auto !important;
  display: block !important;
}
</style>

## Past – Academic Foundations & Professional Profile

<p class="logos-together"><img src="../pictures/academia/logos/ETEC.png" alt="ETEC logo – Bento Quirino" /><img src="../pictures/academia/logos/UNICAMP.png" alt="Unicamp logo" /></p>
<p class="academic-writing-wrap"><img src="../pictures/academia/academic-writing.jpg" alt="Academic Writing Course - Unicamp" /></p>

<p><img src="../pictures/diagrams/academic-timeline.png" alt="Diagram academic-timeline: Academic timeline" /></p>

<p class="english-proficiency-wrap"><img src="../pictures/academia/english-proficiency.png" alt="English proficiency – academic credentials" /></p>
<p class="historico-wrap"><img src="../pictures/academia/docs/historico-escolar.png" alt="Academic record – Unicamp" /></p>

I feel proactive, self-reliant and organized.

<p style="text-align: center; margin-top: 1rem;"><strong>Grade 'A' in all Master's coursework</strong>; English proficiency test verification.</p>

<!-- Diagram: academic-timeline (mermaid/diagrams.md). Export to academic-timeline.png -->  

---

<!-- Slide 5 – Present (Role & Strategic Impact) -->

<!-- _class: art-top-right -->

<style scoped>
section { position: relative; }
.slide-art-top-right {
  position: absolute !important;
  bottom: 0.5rem !important;
  right: 0.5rem !important;
  top: auto !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-end !important;
  gap: 0.35rem !important;
  margin: 0 !important;
  line-height: 0 !important;
}
.slide-art-top-right p { position: relative !important; margin: 0 !important; float: none !important; }
.slide-art-top-right .uxgs-logo { order: 1; margin-right: -12px !important; z-index: 1; }
.slide-art-top-right .uxgs-logo img { width: 72px !important; height: auto !important; display: block !important; }
.slide-art-top-right .building-img { order: 2; }
.slide-art-top-right .building-img img { width: 165px !important; height: auto !important; display: block !important; }
.slide-art-top-right .americas-img { order: 3; }
.slide-art-top-right .americas-img img { width: 180px !important; height: auto !important; display: block !important; }
table { margin-top: 0.5rem !important; clear: both !important; }
</style>

## Present – Research & Technology (Bosch Brasil)

<div class="slide-art-top-right">
<p class="uxgs-logo"><img src="../pictures/work/bdu/UXGS%20Logo_verticle.svg" alt="Research area logo" /></p>
<p class="building-img"><img src="../pictures/work/in-front-of-the-bosch-building.jpg" alt="In front of Bosch building" /></p>
<p class="americas-img"><img src="../pictures/work/americas-team-2025.jpg" alt="Americas Team 2025 - Research Maturity Level 4" /></p>
</div>

| Area | Achievement |
| ---- | ----------- |
| Role | Research & Technology – Bosch Brasil (May 2023 – present); Research Project Champion GS/BDU |
| International | Two trips to Germany (2024, 2025) for role-related work |
| CO2 Tracking (GS/Research) | Marketing scouting for CO2 telemetry; finding: lack of market demand |
| Research Maturity | Led Americas to Level 4 – governance, templates, training |
| CIP + Research | Led integration into ServiceNow CIM; research gate in CIP workflow |
| Collaboration | Tutor at SENAI Digital Talent Academy |  

---

<!-- Slide 6 – Present (CIP and Research Integration: Critical Career Milestone) -->

<!-- _class: art-top-right -->

<style scoped>
img[src*="digital-ws"] { width: 250px !important; height: auto !important; }
img[src*="cip-ux-pipeline"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Present – CIP and Research Integration: A Critical Career Milestone

<p><img src="../pictures/work/digital-ws.jpg" alt="Research Strategy Workshop" /></p>
<p><img src="../pictures/work/germany-ws-2024.jpg" alt="Research workshop – Germany 2024" /></p>
<p><img src="../pictures/work/joinville-ws-2024.jpg" alt="Research workshop – Joinville 2024" /></p>

- **Career significance:** This project marks a pivotal evolution into **Senior Researcher** capabilities—combining in-depth, data-oriented investigation with technical execution, project management, and governance.  
- **Project scope:** Integrated **research relevance assessment** into the **Continuous Improvement Process (CIP)** in ServiceNow CIM. A **research gate** sits between Assess and Approve; the method runs at that gate to triage improvement initiatives (Low / Medium / High research relevance).  
- **Methodology—developer skills for research:** Utilized **Cursor IDE**, **AI-assisted coding**, and version-controlled Python pipelines. Workflow:

<p><img src="../pictures/diagrams/cip-ux-pipeline.png" alt="Diagram: CIP-Research methodology pipeline" /></p>

- **Deliverables:**

| Deliverable | Description |
| ----------- | ----------- |
| Research Relevance Quick Method | 10 system-calculated questions from 11 CIM fields; thresholds Low &lt;60, Medium 60–70, High ≥70 |
| 1st Research Report (Jan 2026) | Stakeholder inputs, governance clarity |
| Pipeline | extract_cim_data.py, calculate_relevance_scores.py, aggregate_to_csv.py – reproducible validation |

- **Impact:** Governance clarity, reduced perceived delay, and reusable research governance framework. Aligned CAP and research into a unified, defensible solution.

<!-- Diagram: CIP-Research pipeline (mermaid/diagrams.md). Export to cip-ux-pipeline.png -->  

---

<!-- Slide 6b – Present (CIP and Research Integration: Research Artifacts & Visuals) -->

<!-- _class: dense-content cip-research-images -->

<style scoped>
img[src*="cip-ux/"] { width: 18% !important; height: auto !important; max-width: 18% !important; }
</style>

## Present – CIP and Research Integration: Research Artifacts & Visuals

- **High-quality, data-oriented deliverables** produced using Markdown, Python pipelines, and Cursor IDE: (1) **1st Research Report** (January 2026)—"Make governance clear. Keep improvements moving."—consolidating N=214 records, executive summary, literature benchmark, methodology, findings, and strategic opportunities; (2) **Research Relevance Quick Method** (method.md v2.8)—CIM-to-Q1–Q10 mapping, scoring algorithm, post-evaluation workflow; (3) **Pipeline** (`tests/standalone-tests/pipeline/`)—extraction, aggregation, score calculation, validation. Distribution (N=35): Low 57.1%, Medium 20.0%, High 22.9%.

<p><img src="../pictures/work/cip-ux/cip-ux-1.png" alt="CIP-Research 1 – Report cover: Make governance clear. Keep improvements moving." /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-2.png" alt="CIP-Research 2 – Summary and executive findings" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-3.png" alt="CIP-Research 3 – Context and methodology" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-4.png" alt="CIP-Research 4 – Literature review and benchmark" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-5.png" alt="CIP-Research 5 – Findings and Criticality Index" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-6.png" alt="CIP-Research 6 – Pipeline and data processing" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-7.png" alt="CIP-Research 7 – Conclusions and strategic opportunities" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-8.png" alt="CIP-Research 8 – Additional research visuals" /></p>

---

<!-- Slide 8 – Present (Academic Research & TrustMate) -->

<!-- _class: art-top-right -->

<style scoped>
img[src*="hfsd-workshop-1"] { width: 250px !important; height: auto !important; }
img[src*="academic-research-flow"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Present – Academic Research (Trust in AI & UI)

<p><img src="../pictures/academia/hfsd-workshop-1.jpg" alt="ISSRE 2025 HFSD Workshop" /></p>
<p><img src="../pictures/academia/hfsd-workshop-2.jpg" alt="ISSRE 2025 HFSD Workshop – session" /></p>

<p><img src="../pictures/diagrams/academic-research-flow.png" alt="Diagram academic-research-flow: Academic research flow" /></p>

<p><img src="../pictures/academia/ihc-2025-1.jpg" alt="IHC 2025 SBC SOL" /></p>
<p><img src="../pictures/academia/ihc-2025-2.jpg" alt="IHC 2025 SBC SOL – presentation" /></p>

- **Master's focus:** Benchmark to assess software trustworthiness (usability, accessibility, user-centred research). Thesis: quantitative methods for perceived trust in e-commerce and software interfaces.  
- **Publications:** ISSRE 2025 (HFSD – IEEE), IHC 2025 (SBC SOL). **TrustMate** + Power BI for trust scores; **AI agents as survey respondents**, full-stack development, Figma prototyping.  
- **Industry connection:** Methods and tools reusable for research audits, maturity assessments, and CIP + research work.

<!-- Diagram: academic-research-flow (mermaid/diagrams.md). Export to academic-research-flow.png -->  

---

<!-- Slide 9 – Present (Scientific Publications – Snapshot) -->

<!-- _class: dense-content article-images -->

<style scoped>
img[src*="academia/articles"] { width: 140px !important; height: auto !important; max-width: 145px !important; }
</style>

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

## Present – CSI & NPS Performance (2024–2025)

- **High customer satisfaction** across eight research-led projects delivered in 2024–2025. **Averages: CSI 4.86 / 5, NPS 9.94 / 10.**

| Project | CSI | NPS |
| ------- | --- | --- |
| GS_R2S Financial Portal | 5 | — |
| EXT_PS_CCC Telemetry | 5 | 10 |
| EXT_M-PUR36 Tooling | 5 | 10 |
| EXT_M-PMQ PPAP | 5 | 10 |
| GS_P2P_MovDiv | 5 | 10 |
| GS_P2P_Financial_Portal | 5 | 10 |
| GS Research Bootcamp 2024 | 4.9 | 9.6 |
| GS_B2R_AA CF Automation | 4 | 10 |
| **Averages** | **4.86** | **9.94** |

---

<!-- Slide 11 – Present (Power BI Dashboards at Work) -->

<!-- _class: dense-content work-pbi-images -->

<style scoped>
img[src*="pbi-allocation"], img[src*="pbi-training-evolution"] { width: 48% !important; height: auto !important; max-width: 48% !important; }
</style>

## Theme: Data Visualization – Power BI Dashboards at Work

- **Bosch Research Americas (GS):** Power BI dashboards developed in role for project and resource oversight and for training tracking—supporting data-driven decision-making and governance.

<p><img src="../pictures/work/pbi-allocation.png" alt="Power BI – LA Allocation Dashboard" /></p>
<p><img src="../pictures/work/pbi-training-evolution.png" alt="Power BI – SMTs Evolution training dashboard" /></p>

---

<!-- Slide 12 – Present (Dissertation: Power BI Visualizations) -->

<!-- _class: dense-content dissertation-pbi-images -->

<style scoped>
img[src*="dissertation/dissertation-pbi"] { width: 32% !important; height: auto !important; max-width: 32% !important; }
</style>

## Theme: Data Visualization – Dissertation Power BI

- **Dissertation InfoVis (Power BI):** Dashboards and charts for trust-metrics analysis—variability of human scores across websites (Americanas, MadeiraMadeira, Kabum), AI × human homogeneity by attribute, and line comparisons (human vs AI scores per website). Supports validation of trust perception models and consolidation of research findings.

<p><img src="../pictures/academia/dissertation/dissertation-pbi-1.png" alt="Power BI – variability of human scores between websites" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-2.png" alt="Power BI – AI × human homogeneity by attribute" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-3.png" alt="Power BI – AI × humans comparison lines per website" /></p>

---

<!-- Slide 13 – Present (InfoVis Project – Power BI & PNAD Contínua) -->

<!-- _class: dense-content infovis-pbi-images -->

<style scoped>
img[src*="infovis-pnad-structures"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
img[src*="pbi-infovis"] { width: 48% !important; height: auto !important; max-width: 48% !important; }
</style>

## Theme: Data Visualization – InfoVis Project (PNAD Contínua)

- **InfoVis class project – Power BI:** Built multi-page reports using **PNAD Contínua** (Brazil's National Household Sample Survey). Brazil’s National Household Sample Survey.
<p><img src="../pictures/diagrams/infovis-pnad-structures.png" alt="Diagram infovis-pnad-structures: InfoVis PNAD visual structures" /></p>

- **Impact:** Demonstrates **Power BI** proficiency and **processing complex national research datasets** into clear, actionable visual insights for socioeconomic analysis.

<!-- Diagram: infovis-pnad-structures (mermaid/diagrams.md). Export to infovis-pnad-structures.png -->

<p><img src="../pictures/academia/infovis/pbi-infovis-1.png" alt="Power BI – Education-employment trajectories Sankey" /></p>
<p><img src="../pictures/academia/infovis/pbi-infovis-2.png" alt="Power BI – Family structure and socioeconomic patterns" /></p>

---

<!-- Slide 14 – Present (Dissertation: Technical Implementation & Impact) -->

<style scoped>
img[src*="dissertation-tech.png"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Theme: Technical Implementation – Dissertation (AI & Full Stack)

- **Architecture:** Database design supporting projects, experiments, attributes, scores, and agent runs.

<!-- Diagram: dissertation-tech (mermaid/diagrams.md). Export to dissertation-tech.png -->

<p><img src="../pictures/diagrams/dissertation-tech.png" alt="Diagram dissertation-tech: Dissertation & research technologies" /></p>

---

<!-- Slide 15 – Present (Dissertation: Technical Visuals) -->

<!-- _class: dense-content dissertation-tech-images -->

<style scoped>
img[src*="disseratation-tech"] { width: 20% !important; height: auto !important; max-width: 20% !important; }
</style>

## Theme: Technical Implementation – Visual Evidence

<p><img src="../pictures/academia/disseratation-tech-1-agents-1.png" alt="AI agent survey – e-commerce evaluation" /></p>
<p><img src="../pictures/academia/disseratation-tech-1-agents-2.png" alt="AI agent survey – TrustMate dashboard" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-1.png" alt="E-commerce evaluation – product page" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-2.png" alt="Evaluation metrics – trust and research scores" /></p>
<p><img src="../pictures/academia/disseratation-tech-2-web-3.png" alt="TrustMate – hierarchy of attributes" /></p>
<p><img src="../pictures/academia/disseratation-tech-3-prototype-1.png" alt="TrustMate tool evaluation – prototype" /></p>

---

<!-- Slide 16 – Present (Tooling Project for PT) -->

<!-- _class: dense-content tooling-project-images -->

<style scoped>
img[src*="tooling-pt-workflow"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
img[src*="tooling-project/"] { width: 32% !important; height: auto !important; max-width: 32% !important; }
</style>

## Theme: Technical Implementation – Tooling Project for PT

- **Tooling project for PT:** Key development in **technical delivery and project management**—from requirements to high-fidelity deliverable, with **customer progress review meetings** throughout.

<p><img src="../pictures/diagrams/tooling-pt-workflow.png" alt="Diagram tooling-pt-workflow: Tooling PT delivery workflow" /></p>

<!-- Diagram: tooling-pt-workflow (mermaid/diagrams.md). Export to tooling-pt-workflow.png -->

<p><img src="../pictures/work/tooling-project/tooling-1.png" alt="Tooling project for PT – wireframe or early concept" /></p>
<p><img src="../pictures/work/tooling-project/tooling-2.png" alt="Tooling project for PT – low-fidelity prototype" /></p>
<p><img src="../pictures/work/tooling-project/tooling-3.png" alt="Tooling project for PT – high-fidelity prototype" /></p>
<p><img src="../pictures/work/tooling-project/tooling-4.jpg" alt="Tooling project for PT – deliverable or session" /></p>
<p><img src="../pictures/work/tooling-project/tooling-5.jpg" alt="Tooling project for PT – deliverable or session" /></p>
<p><img src="../pictures/work/tooling-project/tooling-6.jpg" alt="Tooling project for PT – deliverable or session" /></p>

---

<!-- Slide 17 – Present (Proposal Generator – Excel VBA) -->

<!-- _class: art-top-right -->

<style scoped>
img[src*="proposal-generator.png"] { width: 280px !important; height: auto !important; }
img[src*="proposal-generator-phases"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Theme: Technical Implementation – Proposal Generator (Excel VBA)

<p><img src="../pictures/work/proposal-generator.png" alt="Proposal Generator – Excel-based project proposal tool" /></p>

- **Definition:** Excel-based application for **automated proposal creation**—project proposals: define activities, estimate hours, Gantt-style timeline, and generate PowerPoint.
- **Generation logic:** Uses **predefined criteria and historical project data**; outputs (activities, hours, timeline) are driven by that logic.

<p><img src="../pictures/diagrams/proposal-generator-phases.png" alt="Diagram proposal-generator-phases: Proposal Generator research phases" /></p>

- **Technical proficiency:** Developed in **Excel VBA**—macros for automation, calculations, and presentation generation.

<!-- Diagram: proposal-generator-phases (mermaid/diagrams.md). Export to proposal-generator-phases.png -->

---

<!-- Slide 18 – Present (InfoVis Project – PhraseNets Web Visualization) -->

<!-- _class: dense-content phrase-net-images -->

<style scoped>
img[src*="infovis-phrase-netproject"] { width: 32% !important; height: auto !important; max-width: 32% !important; }
</style>

## Theme: Technical Implementation – PhraseNets Web Visualization

- **Course project – Information Visualization (InfoVis):** Developed a web-based PhraseNets visualization to explore relationships in text.\
- **Technique:** Implements PhraseNets pattern-based networks (e.g. subject–verb, verb–object) to reveal co-occurrence structures that standard charts miss.\
- **Why it matters:** Demonstrates proficiency in **web development** (interactive browser-based interface) and **advanced visual structures** beyond standard Power BI capabilities.

<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-1.png" alt="PhraseNets web visualization – interface and controls" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-2.png" alt="PhraseNets visualization – example network 1" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-3.png" alt="PhraseNets visualization – example network 2" /></p>

---

<!-- Slide 19 – Future (AI & Agile in Research) -->
<!-- Diagram: ai-agile-research (mermaid/diagrams.md). Export to ai-agile-research.png -->

<style scoped>
img[src*="ai-agile-research"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Theme: Process & Future – AI & Agile in Research

- **Motivation:** Research projects often lack repeatable, quality-focused processes and clear accountability.  
- **Proposal:** Combine **AI assistance** with **Scrum practices** to improve throughput, transparency, and quality.  
- **Approach:**

<p><img src="../pictures/diagrams/ai-agile-research.png" alt="Diagram ai-agile-research: AI and Agile in Research" /></p>

- **Guardrails:** AI outputs treated as drafts; strong focus on reproducibility, data privacy, and explicit quality criteria.  

---

<!-- Slide 20 – Present (Innovation & Awards) -->

<!-- _class: art-top-right compact-list -->

<style scoped>
img[src*="bosch-2018"] { width: 280px !important; height: auto !important; }
</style>

## Theme: Process & Innovation – Awards

<p><img src="../pictures/work/bosch-2018.jpg" alt="Bosch Talent Forum 2018 - 3rd Place Award" /></p>

| Award | Place | Year / Context |
| ----- | ----- | -------------- |
| X-Games Brazil | 1st | 2018 – New Business Creation / Consultancy |
| Bosch Talent Forum | 3rd | 2018 – Project Management Software |
| Bosch Intern Talent Forum | 3rd | 2018 – Intern projects |
| NGO Hospitalhaços | Volunteer | Admin – social impact and community engagement |  

---

<!-- Slide 21 – Past (Experience Timeline) -->

<!-- _class: art-top-right dense-content -->

<style scoped>
img[src*="budapest-2019"], img[src*="bosch-argentina"] { width: 140px !important; height: auto !important; }
img[src*="experience-timeline"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Theme: Process – Experience Timeline (Condensed)

- **Trajectory across Bosch locations:** Brazil, Hungary (Budapest), Germany, Argentina.

<div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
<p><img src="../pictures/work/budapest-2019.jpg" alt="Bosch Magyarország - Budapest 2019" /></p>
<p><img src="../pictures/work/budapest-2019-2.jpg" alt="Budapest team 2019 – farewell book" /></p>
<p><img src="../pictures/work/bosch-argentina.jpg" alt="Bosch Argentina – We are Bosch" /></p>
</div>

<p><img src="../pictures/diagrams/experience-timeline.png" alt="Diagram experience-timeline: Experience timeline" /></p>

<!-- Diagram: experience-timeline (mermaid/diagrams.md). Export to experience-timeline.png -->  

---

<!-- Slide 22 – Future (Career Aspirations, Vacancy Types & Prioritized Paths to Leadership) -->

<style scoped>
img[src*="future-career-path"] {
  width: 72% !important; height: auto !important; margin-top: 0.5rem !important;
  margin-left: auto !important; margin-right: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Future – Career Aspirations, Vacancy Types & Prioritized Paths to Leadership

<!-- Diagram: future-career-path (mermaid/diagrams.md). Export to future-career-path.png -->

<p><img src="../pictures/diagrams/future-career-path.png" alt="Diagram future-career-path: Prioritized paths to leadership" /></p>

- **Prioritized career paths (all leading to a Lead position):** (1) **Priority 1 – Ideal:** PhD within Bosch supporting the company with Quantum or AI technology; (2) **Priority 2:** Research Scrum Master who also provides technical support; (3) **Priority 3:** Deep Researcher.
- **Future objective:** Work in **technology-focused roles** that integrate **in-depth research, project management, and AI implementation** as a core professional interest.
- **Desired vacancy types (Bosch & external):**

| Type | Bosch examples | External examples |
| ---- | -------------- | ----------------- |
| Researcher / Senior | Global Service Solutions – service platforms, internal tools | Trust & Safety – trust, safety, fairness at scale |
| Technology / PM Lead | Digital / Enterprise Applications – B2B tools for service teams | — |
| Scrum Master / Agile Coach | — | Data-informed, research-oriented facilitation |
| Researcher advanced tech | — | Quantum & AI – technology and human factors |  
- **Target roles:** Researcher, Technology / Project Management Lead, Scrum Master, or Researcher in advanced tech contexts.
- **Scrum Master role – focus:** Data-informed, research-oriented agile facilitation for technology, AI, and trustworthiness projects; project management and delivery quality. Core responsibilities: **data integrity** and **statistical relevance** across experiments; **rigorous application of scientific methods** and **adequate use of AI** (never replacing human judgment); managing timelines to prevent stagnation. Proactive unblocking (e.g. short surveys, mandatory 10-minute sessions); **direct customer contact** and **stakeholder accountability** for deliverables.
- **Shared assets across paths:** Research, CIP + research integration, AI + agile methodology, data-driven decision-making.

---

<!-- Slide 23 – Future (Personal Interests as Career Enablers) -->

<!-- _class: dense-content personal-images -->

<style scoped>
img[src*="personal/"] { width: 165px !important; height: auto !important; max-width: 180px !important; }
</style>

## Future – Personal Interests that Power My Work

- **At home:** Two cats, beginner piano practice, and a split keyboard for macro creation and productivity.

<p><img src="../pictures/personal/my-family.jpg" alt="Family" /></p>
<p><img src="../pictures/personal/friends.jpg" alt="Friends" /></p>
<p><img src="../pictures/personal/germany-2025.jpg" alt="Germany 2025" /></p>
<p><img src="../pictures/personal/budapes-2019-2.jpg" alt="Budapest 2019" /></p>
<p><img src="../pictures/personal/cat-piano.jpg" alt="Cat on piano – beginner piano practice" /></p>
<p><img src="../pictures/personal/cat-slipt-keyboard.jpg" alt="Cat on split keyboard – macro creation and productivity" /></p>

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

<!-- _class: midnight-blue-slide -->

## Closing & Contact

**What I bring**

| Area | Summary |
| ---- | ------- |
| Core | In-depth Research, Technology & Project Management |
| Leadership | Research Maturity Level 4 – Americas |
| Milestone | CIP and Research Integration – Cursor IDE, AI, coding; Senior Researcher evolution |
| Research | Trust in interfaces; data-driven decision-making |

**Let's connect:** Email: edu.evangelista.figueiredo@gmail.com · LinkedIn: https://www.linkedin.com/in/eduardo-figueiredo · Resume PDF and this portfolio deck available on request.

---

<!-- Slide 27 – Blank Conclusion Page -->

<!-- _class: blank-midnight-blue -->

<img src="../arts/art-background.png" alt="" class="slide-bg-img">
