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

  /* Image Styling - Scattered Photo Effect */
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
  section:not(.lead) img:hover { transform: scale(1.05); z-index: 10; }
  section:not(.lead) img[alt*="Future Career Path"] { border: none; box-shadow: none; }

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
  /* Centered slide layout: vertically and horizontally center content on slides with `_class: center` */
  section.center {
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
  }
  section.center > * {
    margin-left: auto;
    margin-right: auto;
  }
  section.center table {
    margin-left: auto !important;
    margin-right: auto !important;
  }
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

  /* CIP and Applied Research Integration – eight images */
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

  /* Thesis topic and Agentic AI emphasis – bold + increased text size */
  .thesis-emphasis, .agentic-ai-emphasis { font-weight: bold !important; font-size: 1.15em !important; }
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

# Why I Work in Technology, Project Management & Applied Research

## Trustworthy, human-centered software for complex services

- I believe software in service organizations should be **trustworthy, usable, and usefull**, especially when it affects real people and businesses.
- My work centers **technology**, **project management**, and **Applied Research**: bringing evidence and user needs into how we build and deliver.
- This portfolio walks through that story.

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
  border: 4px solid white !important;
  box-shadow: 2px 3px 12px rgba(0,0,0,0.3);
}
table thead { display: none !important; }
</style>

## Who I Am – Snapshot

| Attribute | Value                     |
| --------- | ------------------------- |
| Name      | Eduardo M. de A. Figueiredo    |
| Role      | Applied Research, Technology & Project Management    |
| Impact    | I help teams govern better and improve faster, using Applied Research to prioritize, decide, and deliver with clear data and accountability.  |
| Contact   | Nova Odessa, SP – Brazil · edu.evangelista.figueiredo@gmail.com · [LinkedIn](https://www.linkedin.com/in/eduardo-matos-de-assis-figueiredo-b10b408b) · [Lattes](https://lattes.cnpq.br/2708641049892967) · [ORCID](https://orcid.org/0009-0002-5178-6157) · +55 19 98176-6583 |

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
}
p.logos-together img[src*="UNICAMP.png"] {
  width: 96px !important; height: auto !important;
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

<!-- Slide 4 – Past (Experience Timeline) -->

<style scoped>
.experience-timeline-slide {
  display: flex !important; flex-direction: column !important;
  justify-content: flex-start !important; align-items: center !important;
  gap: 0.75rem !important; min-height: 60vh !important;
  margin-top: 0.75rem !important;
}
section { overflow-x: visible !important; }
.experience-timeline-photos {
  display: flex !important; flex-direction: row !important; gap: 0.5rem !important;
  justify-content: center !important; align-items: center !important;
  margin-top: auto !important; flex-shrink: 0 !important;
  overflow-x: visible !important; min-width: min-content !important;
}
.experience-timeline-photos p { margin: 0 !important; }
.experience-timeline-photos img {
  width: 140px !important; height: auto !important; max-height: 140px !important;
  object-fit: cover !important; display: block !important; border-radius: 4px !important;
  flex-shrink: 0 !important;
}
.experience-timeline-diagram-wrap {
  flex: 0 0 auto !important;
  display: flex !important; justify-content: center !important; align-items: center !important;
}
.experience-timeline-diagram-wrap p { margin: 0 !important; text-align: center !important; }
.experience-timeline-diagram-wrap img {
  width: 86% !important; max-width: 86% !important; height: auto !important;
  display: block !important; margin: 0 auto !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Past – Experience Timeline (Condensed)

- **Trajectory across Bosch locations:** Campinas, Hungary, Sorocaba, and Campinas.

<div class="experience-timeline-slide">
<div class="experience-timeline-diagram-wrap">
<p><img src="../pictures/diagrams/experience-timeline.png" alt="Diagram experience-timeline: Experience timeline" /></p>
</div>
<div class="experience-timeline-photos">
<p><img src="../pictures/work/bosch-2018.jpg" alt="Bosch 2018 – Compartilhando Sucessos RH" /></p>
<p><img src="../pictures/work/budapest-2019.jpg" alt="Bosch Magyarország - Budapest 2019" /></p>
<p><img src="../pictures/work/budapest-2019-2.jpg" alt="Budapest team 2019 – farewell book" /></p>
<p><img src="../pictures/work/bosch-argentina.jpg" alt="Bosch Argentina – We are Bosch" /></p>
<p><img src="../pictures/work/digital-ws.jpg" alt="Digital workspace – Applied Research GS team" /></p>
<p><img src="../pictures/work/joinville-ws-2024.jpg" alt="Joinville workshop 2024" /></p>
<p><img src="../pictures/work/germany-ws-2024.jpg" alt="Germany workshop 2024" /></p>
<p><img src="../pictures/work/americas-team-2025.jpg" alt="Americas team 2025" /></p>
</div>
</div>

<!-- Diagram: experience-timeline (mermaid/diagrams.md). Export to experience-timeline.png -->

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
.slide-art-top-right .uxgs-logo img { width: 58px !important; height: auto !important; display: block !important; }
.slide-art-top-right .building-img { order: 2; }
.slide-art-top-right .building-img img { width: 132px !important; height: auto !important; display: block !important; }
.slide-art-top-right .americas-img { order: 3; }
.slide-art-top-right .americas-img img { width: 144px !important; height: auto !important; display: block !important; }
table { margin-top: 0.5rem !important; clear: both !important; }
</style>

## Present – Applied Research & Technology (Bosch Brasil)

<div class="slide-art-top-right">
<p class="uxgs-logo"><img src="../pictures/work/bdu/UXGS%20Logo_verticle.svg" alt="Applied Research area logo" /></p>
<p class="building-img"><img src="../pictures/work/in-front-of-the-bosch-building.jpg" alt="In front of Bosch building" /></p>
<p class="americas-img"><img src="../pictures/work/americas-team-2025.jpg" alt="Americas Team 2025 - UX Maturity Level 4" /></p>
</div>

| Area                               | Achievement                                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Role                               | Applied Research & Technology – Bosch Brasil (May 2023 – present); Applied Research Expert & Project Champion at GS/BDU            |
| International                      | Two trips to Germany (2024, 2025) for role-related work                                                                            |
| CO2 Tracking (GS/Applied Research) | Marketing scouting for CO2 telemetry; finding: lack of market demand                                                               |
| Tooling project (PT)               | Led technical delivery and project management from requirements through high-fidelity prototypes, with regular customer check-ins. |
| UX Maturity          | Led Americas to Level 4 – governance, templates, training                                                                          |
| CIP + Applied Research             | Led integration into ServiceNow CIM; Applied Research gate in CIP workflow                                                         |
| Collaboration                      | Tutor of Digital Talent Academy Students                                                                                           |

---

<!-- Slide 6 – Present (CIP and Applied Research Integration: diagram only) -->

<!-- _class: diagram-slide-top-title -->

<style scoped>
section.diagram-slide-top-title {
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: stretch !important;
}
section.diagram-slide-top-title h2 {
  margin-top: 0 !important;
  flex-shrink: 0;
}
section.diagram-slide-top-title .diagram-wrapper {
  flex: 1;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 0;
}
section.diagram-slide-top-title .diagram-wrapper img {
  width: 100% !important;
  max-width: 90% !important;
  height: auto !important;
  margin: 0 auto !important;
  display: block !important;
  border: none !important;
  box-shadow: none !important;
}
</style>

## Present – CIP and Applied Research Integration: Methodology Pipeline

<div class="diagram-wrapper">
<p><img src="../pictures/diagrams/cip-ux-pipeline.png" alt="Diagram: CIP-Applied Research methodology pipeline" /></p>
</div>

<!-- Diagram: CIP-Research pipeline (mermaid/diagrams.md). Export to cip-ux-pipeline.png -->

---

<!-- Slide 6a – Present (Applied Research relevance evaluation model) -->

<!-- _class: diagram-slide-top-title -->

<style scoped>
section.diagram-slide-top-title {
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: stretch !important;
}
section.diagram-slide-top-title h2 {
  margin-top: 0 !important;
  flex-shrink: 0;
}
section.diagram-slide-top-title .diagram-wrapper {
  flex: 1;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 0;
}
section.diagram-slide-top-title .diagram-wrapper img {
  width: 100% !important;
  max-width: 90% !important;
  height: auto !important;
  margin: 0 auto !important;
  display: block !important;
  border: none !important;
  box-shadow: none !important;
}
</style>

## Present – Applied Research relevance evaluation model

- I created a **model to evaluate Applied Research relevance** for CIP initiatives: information from **CIM (ServiceNow)** fields → set by priority → result **Low**, **Medium**, or **High** (triage for when deeper Applied Research involvement is needed).
- **Sampling of 35 projects** (pipeline run): **Low 40.0%**, **Medium 37.1%**, **High 22.9%**.
- **Python** used to run the pipeline and test the model in real scenarios (standalone tests, CIM-like data).

<div class="diagram-wrapper">
<p><img src="../pictures/diagrams/ux-relevance-model.png" alt="Diagram: Applied Research relevance evaluation model (CIM fields, priority, Low/Medium/High)" /></p>
</div>

<!-- Diagram: ux-relevance-model (mermaid/diagrams.md). Export to ux-relevance-model.png -->

---

<!-- Slide 6b – Present (CIP and Applied Research: eight pictures – 2 rows of 4, centered) -->

<!-- _class: dense-content -->

<style scoped>
.cip-artifacts-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 0.12rem 0.6rem !important;
  max-width: 81% !important;
  margin: 0 auto !important;
  justify-items: center !important;
  align-items: center !important;
}
.cip-artifacts-grid p { margin: 0 !important; }
.cip-artifacts-grid img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  display: block !important; object-fit: contain !important;
}
.cip-artifacts-grid p.cip-artifacts-large img {
  transform: scale(1.56) !important;
  transform-origin: center center !important;
}
</style>

## Present – CIP and Applied Research Integration: Applied Research Artifacts

<div class="cip-artifacts-grid">
<p><img src="../pictures/work/cip-ux/cip-ux-1.png" alt="CIP-Applied Research 1 – Report cover" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-2.png" alt="CIP-Applied Research 2 – Summary and executive findings" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-3.png" alt="CIP-Applied Research 3 – Context and methodology" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-4.png" alt="CIP-Applied Research 4 – Literature review and benchmark" /></p>
<p class="cip-artifacts-large"><img src="../pictures/work/cip-ux/cip-ux-5.png" alt="CIP-Applied Research 5 – Findings and Criticality Index" /></p>
<p class="cip-artifacts-large"><img src="../pictures/work/cip-ux/cip-ux-6.png" alt="CIP-Applied Research 6 – Pipeline and data processing" /></p>
<p class="cip-artifacts-large"><img src="../pictures/work/cip-ux/cip-ux-7.png" alt="CIP-Applied Research 7 – Conclusions and strategic opportunities" /></p>
<p><img src="../pictures/work/cip-ux/cip-ux-8.png" alt="CIP-Applied Research 8 – Additional Applied Research visuals" /></p>
</div>

---

<!-- Slide 8 – Present (Academic Applied Research & TrustMate) -->

<!-- _class: dense-content -->

<style scoped>
section { position: relative; }
.academic-research-diagram {
  text-align: center !important;
  margin: 0.5rem auto 0.75rem auto !important;
  padding-bottom: 5rem !important;
}
.academic-research-diagram img {
  width: 75% !important; max-width: 78% !important; height: auto !important;
  display: block !important; margin: 0 auto !important;
  border: none !important; box-shadow: none !important;
}
.academic-research-images-bottom {
  position: absolute !important;
  bottom: 0.5rem !important;
  right: 0.5rem !important;
  left: auto !important;
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 0.4rem 0.6rem !important;
  line-height: 0 !important;
}
.academic-research-images-bottom p { margin: 0 !important; }
.academic-research-images-bottom img {
  width: auto !important; max-width: 138px !important; height: auto !important;
  display: block !important;
  border: 3px solid #f0f0f0 !important;
  box-shadow: 2px 3px 10px rgba(0,0,0,0.15) !important;
}
</style>

## Present – Academic Applied Research (Trust in AI & UI)

<p class="academic-research-diagram"><img src="../pictures/diagrams/academic-research-flow.png" alt="Diagram academic-research-flow: Academic Applied Research flow" /></p>

<div class="academic-research-images-bottom">
<p><img src="../pictures/academia/hfsd-workshop-1.jpg" alt="ISSRE 2025 HFSD Workshop" /></p>
<p><img src="../pictures/academia/hfsd-workshop-2.jpg" alt="ISSRE 2025 HFSD Workshop – session" /></p>
<p><img src="../pictures/academia/ihc-2025-1.jpg" alt="IHC 2025 SBC SOL" /></p>
<p><img src="../pictures/academia/ihc-2025-2.jpg" alt="IHC 2025 SBC SOL – presentation" /></p>
</div>

<!-- Diagram: academic-research-flow (mermaid/diagrams.md). Export to academic-research-flow.png -->

---

<!-- Slide 9 – Present (Scientific Publications – Snapshot) -->

<!-- _class: dense-content -->

<style scoped>
.publications-intro {
  margin: 0 0 0.6rem 0 !important; font-size: 0.95em !important;
  color: var(--color-fg-muted, #555) !important; line-height: 1.35 !important;
}
.publications-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 0.6rem 1.25rem !important;
  max-width: 92% !important;
  margin: 0 auto 0 !important;
  justify-items: center !important;
  align-items: center !important;
}
.publications-grid p { margin: 0 !important; }
.publications-grid img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  max-height: 39vh !important; object-fit: contain !important;
  display: block !important; border-radius: 4px !important;
}
.publications-grid p:nth-child(n+4) img { max-height: 34vh !important; }
</style>

## Present – Scientific Publications

<p class="publications-intro">Published work in <strong>ISSRE 2025 (HFSD Workshop)</strong> and <strong>IHC 2025 (SBC SOL)</strong>; <span class="thesis-emphasis">master's dissertation on software trustworthiness and Agentic AI</span>.</p>

<div class="publications-grid">
<p><img src="../pictures/academia/articles/article-1-1.png" alt="Article 1 page 1" /></p>
<p><img src="../pictures/academia/articles/article-1-2.png" alt="Article 1 page 2" /></p>
<p><img src="../pictures/academia/articles/article-2-1.png" alt="Article 2 page 1" /></p>
<p><img src="../pictures/academia/articles/article-2-2.png" alt="Article 2 page 2" /></p>
<p><img src="../pictures/academia/articles/dissertation-page-1.png" alt="Dissertation page 1" /></p>
<p><img src="../pictures/academia/articles/dissertation-page-2.png" alt="Dissertation page 2" /></p>
</div>

---

<!-- Slide 10 – Present (CSI & NPS Performance 2024–2025) -->

<!-- _class: diagram-slide-top-title -->

<style scoped>
section.diagram-slide-top-title {
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: stretch !important;
}
section.diagram-slide-top-title h2 {
  margin-top: 0 !important;
  flex-shrink: 0;
}
section.diagram-slide-top-title .diagram-wrapper {
  flex: 1;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-height: 0;
}
section.diagram-slide-top-title .csi-table-wrapper table {
  font-size: 1.15em !important;
  width: 85% !important;
  max-width: 90% !important;
  margin: 0 auto !important;
}
</style>

## Present – CSI & NPS Performance (2024–2025)

<div class="diagram-wrapper csi-table-wrapper">

| Project                           | CSI      | NPS      |
| --------------------------------- | -------- | -------- |
| GS_R2S Financial Portal           | 5        | N/A      |
| EXT_PS_CCC Telemetry              | 5        | 10       |
| EXT_M-PUR36 Tooling               | 5        | 10       |
| EXT_M-PMQ PPAP                    | 5        | 10       |
| GS_P2P_MovDiv                     | 5        | 10       |
| GS_P2P_Financial_Portal           | 5        | 10       |
| GS Applied Research Bootcamp 2024 | 4.9      | 9.6      |
| GS_B2R_AA CF Automation           | 4        | 10       |
| **Averages**                      | **4.86** | **9.94** |

</div>

---

<!-- Slide 11 – Present (Power BI Dashboards at Work) -->

<!-- _class: dense-content -->

<style scoped>
.pbi-dashboards-row {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  justify-content: center !important;
  align-items: flex-start !important;
  gap: 0.75rem !important;
  margin: 0.5rem auto !important;
  max-width: 98% !important;
}
.pbi-dashboards-row p { margin: 0 !important; flex: 1 1 0; min-width: 0; }
.pbi-dashboards-row img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  display: block !important; object-fit: contain !important;
}
</style>

## Data Visualization – Power BI Dashboards at Work

- **Bosch Applied Research Americas (GS):** Built Power BI dashboards for project and resource oversight and training tracking, so the team can see the numbers and make better calls.

<div class="pbi-dashboards-row">
<p><img src="../pictures/work/pbi-allocation.png" alt="Power BI – LA Allocation Dashboard" /></p>
<p><img src="../pictures/work/pbi-training-evolution.png" alt="Power BI – SMTs Evolution training dashboard" /></p>
</div>

---

<!-- Slide 12 – Present (Dissertation: Power BI Visualizations) -->

<!-- _class: dense-content -->

<style scoped>
.dissertation-pbi-intro { margin-bottom: 1rem !important; font-size: 0.95em !important; color: var(--color-fg-muted, #666) !important; }
.dissertation-pbi-row {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 1rem !important;
  margin: 1.25rem auto 0 !important;
  max-width: 96% !important;
  padding: 0 0.5rem !important;
}
.dissertation-pbi-row p { margin: 0 !important; flex: 1 1 0; min-width: 0; }
.dissertation-pbi-row img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  display: block !important; object-fit: contain !important;
  border-radius: 4px !important;
}
</style>

## Data Visualization – Dissertation Power BI

<p class="dissertation-pbi-intro"><span class="thesis-emphasis">My dissertation asks whether <span class="agentic-ai-emphasis">Agentic AI</span> behaves like humans.</span></p>

<div class="dissertation-pbi-row">
<p><img src="../pictures/academia/dissertation/dissertation-pbi-1.png" alt="Power BI – variability of human scores between websites" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-2.png" alt="Power BI – AI × human homogeneity by attribute" /></p>
<p><img src="../pictures/academia/dissertation/dissertation-pbi-3.png" alt="Power BI – AI × humans comparison lines per website" /></p>
</div>

---

<!-- Slide 13 – Present (InfoVis Project – Power BI & PNAD Contínua) -->

<!-- _class: dense-content -->

<style scoped>
.infovis-split {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 1.5rem !important;
  margin-top: 0.5rem !important;
  max-width: 100% !important;
}
.infovis-split .infovis-left {
  flex: 0 1 48% !important;
  min-width: 0 !important;
}
.infovis-split .infovis-left img {
  width: 100% !important; height: auto !important; display: block !important;
  border: none !important; box-shadow: none !important;
}
.infovis-split .infovis-right {
  flex: 0 1 48% !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.35rem !important;
  justify-content: flex-start !important;
}
.infovis-split .infovis-right p { margin: 0 !important; }
.infovis-split .infovis-right p:last-child { margin-top: -0.4rem !important; }
.infovis-split .infovis-right img {
  width: 80% !important; max-width: 80% !important; height: auto !important;
  display: block !important; margin: 0 auto !important;
  object-fit: contain !important;
}
</style>

## Data Visualization – InfoVis Project (PNAD Contínua)

<div class="infovis-split">
<div class="infovis-left">
<p><img src="../pictures/diagrams/infovis-pnad-structures.png" alt="InfoVis PNAD visual structures" /></p>
</div>
<div class="infovis-right">
<p><img src="../pictures/academia/infovis/pbi-infovis-1.png" alt="Power BI – Education-employment trajectories Sankey" /></p>
<p><img src="../pictures/academia/infovis/pbi-infovis-2.png" alt="Power BI – Family structure and socioeconomic patterns" /></p>
</div>
</div>

---

<!-- Slide 14 – Present (Dissertation: Technical Implementation & Impact) -->

<style scoped>
.dissertation-tech-wrap {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-height: 58vh !important;
  width: 100% !important;
  margin: -0.5rem auto 0 !important;
  padding: 0 1rem !important;
  box-sizing: border-box !important;
}
.dissertation-tech-wrap p {
  margin: 0 auto !important;
  flex: 0 1 auto !important;
  text-align: center !important;
}
.dissertation-tech-wrap img {
  width: 103% !important; max-width: 103% !important; height: auto !important;
  display: block !important; margin: 0 auto !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Technical Implementation – Dissertation (<span class="agentic-ai-emphasis">Agentic AI</span> & Full Stack)

- **Architecture:** Database design supporting projects, experiments, attributes, scores, and <span class="agentic-ai-emphasis">Agentic AI</span> runs.

<!-- Diagram: dissertation-tech (mermaid/diagrams.md). Export to dissertation-tech.png -->

<div class="dissertation-tech-wrap">
<p><img src="../pictures/diagrams/dissertation-tech.png" alt="Diagram dissertation-tech: Dissertation & Applied Research technologies" /></p>
</div>

---

<!-- Slide 15 – Present (Dissertation: Technical Visuals) -->

<!-- _class: dense-content -->

<style scoped>
.tech-evidence-grid {
  display: grid !important;
  grid-template-columns: 0.9fr 0.9fr 1.2fr !important;
  grid-template-rows: 1fr 1fr !important;
  gap: 0.4rem 1rem !important;
  max-width: 95% !important;
  margin: 0.2rem auto 0 !important;
  justify-items: center !important;
  align-items: center !important;
  min-height: 0 !important;
}
.tech-evidence-grid p { margin: 0 !important; }
.tech-evidence-grid img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  max-height: 32vh !important; display: block !important; object-fit: contain !important;
  border-radius: 4px !important;
}
.tech-evidence-grid p:nth-child(n+4) img { max-height: 60vh !important; }
/* Nudge prototype image up slightly for better alignment */
.tech-evidence-grid img[src*="dissertation-tech-3-prototype-1"] {
  margin-top: -30px !important;
}
</style>

## Technical Implementation

<div class="tech-evidence-grid">
<p><img src="../pictures/academia/dissertation-tech-1-agents-1.png" alt="Agentic AI survey – e-commerce evaluation" /></p>
<p><img src="../pictures/academia/dissertation-tech-1-agents-2.png" alt="Agentic AI survey – TrustMate dashboard" /></p>
<p><img src="../pictures/academia/dissertation-tech-2-web-1.png" alt="E-commerce evaluation – product page" /></p>
<p><img src="../pictures/academia/dissertation-tech-2-web-2.png" alt="Evaluation metrics – trust and Applied Research scores" /></p>
<p><img src="../pictures/academia/dissertation-tech-2-web-3.png" alt="TrustMate – hierarchy of attributes" /></p>
<!-- Prototype image (TrustMate tool evaluation) – bottom-right in dissertation technical implementation -->
<p><img src="../pictures/academia/dissertation-tech-3-prototype-1.png" alt="TrustMate tool evaluation – prototype" /></p>
</div>

---

<!-- Slide 16 – Present (Tooling Project for PT) -->

<!-- _class: dense-content -->

<style scoped>
.tooling-pt-layout {
  display: flex !important; flex-direction: column !important;
  gap: 0.4rem !important; margin-top: 0.35rem !important;
  max-width: 100% !important; position: relative !important;
  padding: 0 !important; padding-bottom: 0.5rem !important;
}
.tooling-pt-main {
  display: flex !important; flex-direction: row !important;
  align-items: flex-start !important; justify-content: flex-start !important;
  gap: 1rem !important; min-height: 0 !important; flex: 1 1 auto !important;
  padding: 0 !important; margin: 0 !important;
}
.tooling-pt-prototypes {
  flex: 0 0 42% !important; min-width: 0 !important;
  display: flex !important; flex-direction: column !important;
  gap: 0.5rem !important; justify-content: flex-start !important;
  padding: 0 !important; margin: 0 !important;
}
.tooling-pt-prototypes p { margin: 0 !important; padding: 0 !important; }
.tooling-pt-prototypes img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  max-height: 24vh !important; object-fit: cover !important;
  display: block !important; border-radius: 4px !important;
  margin: 0 !important; padding: 0 !important;
}
.tooling-pt-right {
  flex: 1 1 auto !important; min-width: 0 !important;
  display: flex !important; flex-direction: column !important;
  align-items: flex-start !important; justify-content: space-between !important;
  gap: 0.5rem !important; min-height: 50vh !important;
}
.tooling-pt-diagram { flex: 0 0 auto !important; text-align: left !important; margin: 0 !important; }
.tooling-pt-diagram p { margin: 0 !important; }
.tooling-pt-diagram img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  max-height: 28vh !important; object-fit: contain !important;
  display: block !important; border: none !important; box-shadow: none !important;
  margin-top: 15px !important;
}
.tooling-pt-workshops {
  flex: 0 0 auto !important; margin-top: auto !important;
  display: flex !important; flex-direction: row !important;
  gap: 0.5rem !important; align-items: center !important;
}
.tooling-pt-workshops p { margin: 0 !important; }
.tooling-pt-workshops img {
  width: auto !important; height: 200px !important; max-height: 200px !important;
  object-fit: cover !important; display: block !important;
  border-radius: 4px !important; border: 1px solid rgba(0,0,0,0.08) !important;
}
</style>

## Technical Implementation – Tooling Project for PT

- **Tooling project for PT:** Led **technical delivery and project management** from requirements through high-fidelity prototypes, with **regular customer check-ins**.

<!-- - **Workshop facilitation:** Ran strategy and team workshops with large groups (e.g. Digital WS, Joinville 2024). -->

<div class="tooling-pt-layout">
<div class="tooling-pt-main">
<div class="tooling-pt-prototypes">
<p><img src="../pictures/work/tooling-project/tooling-1.png" alt="Tooling project for PT – wireframe or early concept" /></p>
<p><img src="../pictures/work/tooling-project/tooling-2.png" alt="Tooling project for PT – low-fidelity prototype" /></p>
<p><img src="../pictures/work/tooling-project/tooling-3.png" alt="Tooling project for PT – high-fidelity prototype" /></p>
</div>
<div class="tooling-pt-right">
<p class="tooling-pt-diagram"><img src="../pictures/diagrams/tooling-pt-workflow.png" alt="Diagram tooling-pt-workflow: Tooling PT delivery workflow" /></p>
<div class="tooling-pt-workshops">
<p><img src="../pictures/work/tooling-project/tooling-4.jpg" alt="Tooling project for PT – customer workshop" /></p>
<p><img src="../pictures/work/tooling-project/tooling-5.jpg" alt="Tooling project for PT – customer workshop" /></p>
<p><img src="../pictures/work/tooling-project/tooling-6.jpg" alt="Tooling project for PT – customer workshop" /></p>
</div>
</div>
</div>
</div>

<!-- Diagram: tooling-pt-workflow (mermaid/diagrams.md). Export to tooling-pt-workflow.png -->

---

<!-- Slide 17 – Present (Proposal Generator – Excel VBA) -->

<style scoped>
.proposal-gen-wrap {
  display: flex !important; flex-direction: column !important;
  justify-content: space-between !important; align-items: center !important;
  min-height: 65vh !important; margin-top: 0.25rem !important;
}
.proposal-gen-wrap .proposal-gen-diagram {
  flex: 0 0 auto !important;
  text-align: center !important; margin: 0 !important; margin-top: 1.5rem !important;
}
.proposal-gen-wrap .proposal-gen-diagram img {
  width: 72% !important; max-width: 72% !important; height: auto !important;
  display: inline-block !important; border: none !important; box-shadow: none !important;
}
.proposal-gen-wrap .proposal-gen-screenshot {
  flex: 0 0 auto !important;
  text-align: center !important; margin: 0 !important; margin-top: 0.5rem !important;
}
.proposal-gen-wrap .proposal-gen-screenshot img {
  width: 784px !important; max-width: 95% !important; height: auto !important;
  display: block !important; margin: 0 auto !important;
}
</style>

## Technical Implementation – Proposal Generator (Excel VBA)

<div class="proposal-gen-wrap">
<p class="proposal-gen-diagram"><img src="../pictures/diagrams/proposal-generator-phases.png" alt="Diagram proposal-generator-phases: Proposal Generator Applied Research phases" /></p>
<p class="proposal-gen-screenshot"><img src="../pictures/work/proposal-generator.png" alt="Proposal Generator – Excel-based project proposal tool" /></p>
</div>

<!-- Diagram: proposal-generator-phases (mermaid/diagrams.md). Export to proposal-generator-phases.png -->

---

<!-- Slide 18 – Present (InfoVis Project – PhraseNets Web Visualization) -->

<!-- _class: dense-content phrase-net-images -->

<style scoped>
.phrase-net-row {
  display: flex !important; flex-direction: row !important;
  justify-content: space-between !important; align-items: center !important;
  gap: 0.75rem !important; margin-top: 0.5rem !important;
  max-width: 98% !important;
}
.phrase-net-row p { margin: 0 !important; flex: 1 1 0 !important; min-width: 0 !important; text-align: center !important; }
.phrase-net-row img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  display: block !important; object-fit: contain !important; border-radius: 4px !important;
}
</style>

## Technical Implementation – PhraseNets Web Visualization

- **Course project – Information Visualization (InfoVis):** Built a web-based PhraseNets visualization to explore how words connect in text.
- **Technique:** Uses pattern-based networks to surface co-occurrences that standard charts miss.
- **Relevance:** Interactive web tooling and visual structures beyond Power BI.

<div class="phrase-net-row">
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-1.png" alt="PhraseNets web visualization – interface and controls" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-2.png" alt="PhraseNets visualization – example network 1" /></p>
<p><img src="../pictures/academia/infovis/infovis-phrase-netproject-3.png" alt="PhraseNets visualization – example network 2" /></p>
</div>

---

<!-- Slide 19 – Future (AI & Agile in Applied Research) -->
<!-- Diagram: ai-agile-research (mermaid/diagrams.md). Export to ai-agile-research.png -->

<style scoped>
.ai-agile-wrap {
  display: flex !important; justify-content: center !important; align-items: center !important;
  min-height: 62vh !important; width: 100% !important; margin-top: -0.25rem !important;
}
.ai-agile-wrap p { margin: 0 !important; text-align: center !important; }
.ai-agile-wrap img {
  width: 58% !important; max-width: 58% !important; height: auto !important;
  display: block !important; margin: 0 auto !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Future



<div class="ai-agile-wrap">
<p><img src="../pictures/diagrams/ai-agile-research.png" alt="Diagram ai-agile-research: AI and Agile in Applied Research, AI Scrum Master role" /></p>
</div>

---

<!-- Slide 21 – Future (Career) -->

<style scoped>
.future-career-wrap {
  display: flex !important; justify-content: center !important; align-items: center !important;
  min-height: 62vh !important; width: 100% !important; margin-top: 0.75rem !important;
}
.future-career-wrap p { margin: 0 !important; text-align: center !important; }
.future-career-wrap img {
  width: 43% !important; max-width: 43% !important; height: auto !important;
  display: block !important; margin: 20px auto 0 !important;
  border: none !important; box-shadow: none !important;
}
</style>

## Future – Career Aspirations, Vacancy Types & Prioritized Paths to Leadership

<div class="future-career-wrap">
<p><img src="../pictures/diagrams/future-career-path.png" alt="Diagram future-career-path: Prioritized paths to leadership, including AI Scrum Master" /></p>
</div>

<!-- Diagram: future-career-path (mermaid/diagrams.md). Export to future-career-path.png -->

---

<!-- Slide 23 – Future (Personal Interests as Career Enablers) -->

<!-- _class: dense-content -->

<style scoped>
.personal-interests-layout {
  display: flex !important; flex-direction: row !important;
  align-items: center !important; justify-content: center !important;
  gap: 1.5rem !important; margin: 0.4rem auto 0.5rem !important;
  max-width: 98% !important; min-height: 48vh !important;
}
.personal-interests-left { flex: 0 1 auto !important; min-width: 0 !important; }
.personal-interests-left table { font-size: 0.92em !important; margin: 0 !important; }
.personal-interests-grid {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 0.5rem 1rem !important;
  flex: 1 1 auto !important; max-width: 62% !important;
  justify-items: center !important; align-items: center !important;
}
.personal-interests-grid p { margin: 0 !important; }
.personal-interests-grid img {
  width: 100% !important; max-width: 100% !important; height: auto !important;
  max-height: 36vh !important; object-fit: contain !important;
  display: block !important; border-radius: 4px !important;
}
.personal-interests-grid p:nth-child(n+4) img { max-height: 32vh !important; }
</style>

## Personal Interests that Power My Work

- **At home:** Two cats, learning piano, and a split keyboard I use for macros and productivity.

<div class="personal-interests-layout">
<div class="personal-interests-left">
<table>
<thead><tr><th>Interest</th></tr></thead>
<tbody>
<tr><td>Piano</td></tr>
<tr><td>Linguistics (phonology & phonetics)</td></tr>
<tr><td>Physics (GR & Quantum)</td></tr>
<tr><td>Acting</td></tr>
<tr><td>Impressionist art</td></tr>
<tr><td>Macro creation</td></tr>
<tr><td>Specialized keyboards</td></tr>
</tbody>
</table>
</div>
<div class="personal-interests-grid">
<p><img src="../pictures/personal/my-family.jpg" alt="Family" /></p>
<p><img src="../pictures/personal/friends.jpg" alt="Friends" /></p>
<p><img src="../pictures/personal/germany-2025.jpg" alt="Germany 2025" /></p>
<p><img src="../pictures/personal/me-cooking.jpeg" alt="Budapest 2019" /></p>
<p><img src="../pictures/personal/cat-piano.jpg" alt="Cat on piano – beginner piano practice" /></p>
<p><img src="../pictures/personal/cat-split-keyboard.jpg" alt="Cat on split keyboard – macro creation and productivity" /></p>
</div>
</div>

---

<!-- Slide 26 – Closing & Contact -->

<!-- _class: midnight-blue-slide closing-redesign -->

<style scoped>
section.closing-redesign {
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  align-items: center !important;
  text-align: center !important;
  min-height: 80vh !important;
}
section.closing-redesign h2 {
  text-align: left !important;
  align-self: flex-start !important;
  width: 100% !important;
}
.closing-summary {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 2rem 1rem !important;
}
.closing-summary p {
  font-size: 1.65rem !important;
  line-height: 1.45 !important;
  max-width: 90% !important;
  margin: 0 !important;
  font-weight: 500 !important;
}
.closing-contact {
  flex-shrink: 0 !important;
  width: 100% !important;
  padding: 1.25rem 0 0 !important;
  border-top: 1px solid rgba(255,255,255,0.25) !important;
  text-align: center !important;
}
.closing-contact p { margin: 0.35rem 0 !important; }
.closing-contact strong { display: block; margin-bottom: 0.5rem !important; font-size: 1.1em !important; }
.closing-contact a { color: #a8d4ff !important; }
</style>

## Closing & Contact

<div class="closing-summary">
<p>I bring Applied Research-driven evidence, technology support, and project delivery to help teams build solutions. Solutions that are trustworthy, user-centered, with clear data, accountability, and measurable impact.</p>
</div>

<div class="closing-contact">
<p><strong>Let's connect</strong></p>
<p>edu.evangelista.figueiredo@gmail.com</p>
<p><a href="https://www.linkedin.com/in/eduardo-matos-de-assis-figueiredo-b10b408b">linkedin.com/in/eduardo-matos-de-assis-figueiredo-b10b408b</a></p>
<p><a href="https://lattes.cnpq.br/2708641049892967">Lattes</a> · <a href="https://orcid.org/0009-0002-5178-6157">ORCID</a></p>
<p>+55 (19) 98176-6583</p>
<p style="margin-top: 0.75rem !important; font-size: 0.9em; opacity: 0.9;">Resume and this deck available on request.</p>
</div>

---

<!-- Slide 27 – Blank Conclusion Page -->

<!-- _class: blank-midnight-blue -->
