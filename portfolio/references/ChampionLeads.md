---
marp: true
style: |
  section.lead {
    background-image: url("../../images/arts/art-5.png");
    background-size: 55% auto;
    background-position: center 58%;
    background-repeat: no-repeat;
  }
  section.lead img { display: block; margin-left: auto; margin-right: auto; }
  section.persona-slide img[alt*="Persona 2"] { display: block; margin-left: auto; margin-right: auto; margin-top: -1rem; }
  section.art-top-right {
    position: relative;
    --art-top: 1rem;        /* margin from top (e.g. 0, 0.5rem, 1rem) */
    --art-right: 1rem;     /* margin from right (e.g. 0, 0.5rem, 1rem) */
    --art-size: 200px;  /* image width */
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
  /* Let this slide show content that overflows (image past bottom) */
  section.allow-overflow { overflow: visible !important; }
  /* Parent container (e.g. Marp viewer) must not clip */
  div:has(> section.allow-overflow) { overflow: visible !important; }
  section.quick-recall img { display: block; margin-left: auto; margin-right: auto; max-width: 90%; height: auto; border: 2px solid black; }
  section.flow-diagram-fit { display: flex; align-items: center; justify-content: center; }
  section.flow-diagram-fit img { display: block; margin: 0 auto; height: auto; object-fit: contain; }
  section.relevance-summary-with-doodle { position: relative; }
  section.relevance-summary-with-doodle p.doodle-right { position: absolute; right: 5rem; top: 50%; transform: translateY(-50%); margin: 0; line-height: 0; }
  section.relevance-summary-with-doodle p.doodle-right img { width: 220px; height: auto; display: block; }
---

<!-- _class: lead -->

# UX & CIP Integration — For UX Champion Leads

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<img src="../../images/ux@gs/UXGS%20Logo_verticle.svg" alt="UX @ GS" width="90" style="display: block; margin-left: auto;" align="right" />

---

<!-- _class: quick-recall -->

## Quick recall

<p><img src="../../images/to-be-journey.svg" alt="To-be journey" /></p>

---

<!-- _class: flow-diagram-fit -->

<p><img src="../images/quick-flow-diagram.png" alt="UX relevance decision flow" width="770" /></p>

---

<!-- _class: art-top-right compact-list relevance-summary-with-doodle -->

## 35-Project UX Relevance Summary

<p><img src="../../1st-report/assets/personas/persona-13.png" alt="" style="width: 320px; max-width: 50vw;" /></p>

<p class="doodle-right"><img src="../images/doodle.png" alt="UX champion doodle" /></p>

| UX Relevance Level | Percentage |
|--------------------|------------|
| **Low Relevance**  | 50%        |
| **Medium Relevance** | 30%      |
| **High Relevance** | 20%        |
| **Total**          | 100%       |

---

<!-- ## Recommended Next Actions (Sequenced)

<p><img src="../../images/arts/art-7/art-7-3.png" alt="" width="100" /></p>

- **Now: Governance clarity first**
  - Finalize role definitions, decision rights, and escalation paths; publish a one-page governance reference
  - Confirm ownership for routing rules and SLA enforcement in ServiceNow (**routing** = auto-assign the right task to the right people; **SLA enforcement** = time limits with reminders/escalations if overdue)

- **Next: Reduce perceived delay**
  - Implement routing + notifications + SLA tracking; ensure "fast by default" guidance for low-risk items
  - Improve form guidance and defaults to reduce coordinator rework loops

- **Before launch: Validate + calibrate**
  - Run the planned validation cycle; calibrate relevance thresholds and capacity rules; lock the operating model for launch

--- -->

<!-- _class: art-bottom-right-overflow -->


<!-- _class: persona-slide -->

<!-- ## Persona / Coordinator Takeaway

- **Largest user group needs clearer guidance and fewer loops**: Persona 2 (CIP coordinators struggling with the UX relevance evaluation) represents 43.9% of records — this data was collected with a previous version of the method using a prototype.
- **Persona 12 (Supportive CIP Coordinator)**: Highest positive sentiment (0.58) and lowest severity (0.92)—leverage as champions; they ask for examples, showcases, and training so others can succeed
- **Persona 13 (System-impact aware CIP Coordinator)**: Negative sentiment (−0.56) and high severity (2.33)—address concerns about SLA management, resource optimization, and process complexity; design for simplicity and minimal workflow disruption -->

<!-- --- -->

<!-- _class: allow-overflow -->
<!-- _style: section { overflow: visible !important; min-height: 100%; } -->

## Next Steps / References


**Inform which region you plan to roll out the UX quality gate in and who will be responsible for handling the medium relevant projects.**

<section class="art-bottom-right-overflow art-push-down">
  <p>
    <img src="../../1st-report/assets/personas/persona-13.png" alt="Persona 2: CIP coordinator struggling with the UX relevance evaluation" style="width:85vw; max-width:500px; min-width:600px; opacity:0.92;" />
  </p>
</section>
