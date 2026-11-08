# UX Research & Design Technologist Playbook for High-Tech Domains

This playbook documents operational workflows, research methodologies, design technologist prototyping practices, and measurement frameworks for conducting UX research and interaction design in technology-intensive domains (AI/ML, complex enterprise SaaS, developer tooling, IoT, and industrial systems).

---

## 1. Executive Framework: The Dual Discovery-Engineering Loop

In deep-tech and AI products, traditional UX waterfall (separate research → static wireframes → engineering handover) fails because:
1. **Mental Model Gaps:** Users struggle to conceptualize stochastic (non-deterministic) AI behavior or complex distributed states without interactive affordances.
2. **Feasibility Asymmetry:** Static design artifacts frequently specify interactions that are computationally unfeasible, have unacceptable latency, or lack underlying training data.
3. **Trust Vulnerability:** User adoption in high-tech relies heavily on **calibrated trust**—neither blind over-reliance nor cynical under-reliance.

### The Solution: The Dual Discovery-Engineering Loop

```
  ┌──────────────────────────────────────────────────────────────┐
  │                 TRACK 1: DISCOVERY (UX Research)              │
  │  Problem Framing ──> Contextual Inquiry ──> Grounded Theory   │
  │           ▲                                          │        │
  │           │                                          ▼        │
  │   Trust Calibration <────────────────── Evaluative Usability │
  └───────────┼──────────────────────────────────────────┼────────┘
              │                                          │
              ▼                                          ▼
  ┌──────────────────────────────────────────────────────────────┐
  │              TRACK 2: DELIVERY (Design Technology)           │
  │   Figma Wireflows ──> Code Prototype Spikes (React / Python) │
  │                              │                                │
  │                              ▼                                │
  │              Production Handoff & Design Systems             │
  └──────────────────────────────────────────────────────────────┘
```

The **Design Technologist** acts as the crucial bridge: translating qualitative research findings not just into static mocks, but into **interactive, data-connected code prototypes** (React, Python, HTML/CSS) that expose real latencies, edge cases, and interaction dynamics before committing engineering squads.

---

## 2. End-to-End Operational Workflow

### Phase 1: Problem Framing & Research Plan
- **Clarify the Core Uncertainty:** Distinguish between *generative questions* ("What problems are users solving?") and *evaluative questions* ("Can users accomplish task X with interface Y?").
- **Stakeholder Alignment Canvas:**
  - **Business Objective:** What business decision or KPI will this research inform?
  - **User Segment:** Internal operators, enterprise domain experts, developers, or B2B clients.
  - **Assumptions vs. Known Facts:** Explicitly catalog beliefs that require validation.
  - **Out-of-Scope Guardrails:** Explicitly bound what the study will *not* investigate to maintain velocity.

### Phase 2: Participant Recruitment & Research Governance
- **Recruitment Criteria:** Define strict screening questionnaires. For B2B/high-tech, prioritize deep domain practitioners over generalists (5–8 participants per persona segment).
- **Ethics & Privacy (LGPD / GDPR):**
  - Anonymize all quotes, transcripts, and telemetry.
  - Obtain informed consent specifying data retention periods and usage scope.
  - Separate raw participant PII from research findings via pseudo-identifiers.

### Phase 3: Field Inquiry & Data Collection
- **Contextual Inquiry (Observation + Interview):** Observe operators within their real work environment with existing tools, multi-monitor setups, and physical interruptions.
- **Cognitive Walkthrough:** Evaluate the sequence of actions required to achieve a goal. For every step, ask:
  1. Will the user know what to do at this step?
  2. Will the user notice that the correct action is available?
  3. Will the user interpret the system response correctly?
- **Concurrent Think-Aloud:** Have participants vocalize reasoning during critical task flows, capturing mental model dissonance in real time.

### Phase 4: Qualitative & Quantitative Synthesis
- **Straussian Grounded Theory Workflow:**
  1. **Open Coding:** Break transcripts, support logs, and interview audio into discrete, descriptive tags (e.g., `friction:service_timeout`, `workaround:export_to_excel`).
  2. **Axial Coding:** Establish relationships between conditions, contexts, action strategies, and consequences (e.g., connecting lack of error explainability to user churn).
  3. **Selective Coding:** Identify the central category that unifies the findings into actionable product implications.
- **AI-Assisted Triangulation:** Utilize Python scripts and LLM embeddings to cluster large-scale qualitative corpora (e.g., hundreds of call-center or support tickets), followed by human verification.

### Phase 5: Design Technologist Prototyping
- **Figma to Code Transition:**
  - Low-fidelity concepts sketched in Figma or FigJam for rapid conceptual divergence.
  - High-fidelity interactive spikes authored in **React + Tailwind/CSS** or lightweight Python web interfaces.
- **Realistic Data Plumbing:** Feed realistic, messy domain data into prototypes (via JSON/CSV or mock APIs) rather than clean placeholder strings ("Lorem Ipsum"), verifying typography, truncation, and layout resilience.

### Phase 6: Evaluative Testing & Trust Calibration
- **Benchmarking Protocol:**
  - Standardized task scenarios with clear success criteria.
  - Record: Task Completion Rate (%), Time-on-Task (seconds), Error Frequency, and Assisted vs. Unassisted Completions.
- **Standardized Questionnaires:**
  - **SUS (System Usability Scale):** 10-item standard benchmark (target score ≥ 75).
  - **UMUX-Lite:** Compact 2-item usability survey ("This system's capabilities meet my requirements", "This system is easy to use").
  - **Empirical Trust Scales:** Post-task trust rating across competence, predictability, and transparency.

### Phase 7: ResearchOps & Insight Traceability
- **Atomic Research Nuggets:** Structure research findings into reusable units:
  `Fact (Observation) + Evidence (Video/Quote) + Insight (Meaning) + Recommendation (Action)`.
- **Intake & Governance Gates:** Instrument intake scoring (e.g., ServiceNow relevance scoring) so design and UX requests are evaluated systematically against organizational impact.

---

## 3. High-Tech & Emerging Technology Specializations

### A. Human-AI Interaction & Calibrated Trust
Designing for AI is fundamentally different from traditional deterministic software:
- **Calibrated Trust:** The user's trust in the AI must match its actual capabilities.
  - *Over-reliance (Automation Bias):* User blindly accepts incorrect AI output.
  - *Under-reliance (Algorithm Aversion):* User rejects useful AI assistance due to one error.
- **Microsoft HAX Principles (Human-AI eXperience):**
  - *Initially:* Set realistic expectations regarding capability and accuracy.
  - *During Interaction:* Match interaction context (ambient vs. proactive); explain *why* the AI acted.
  - *When Wrong:* Provide graceful fallbacks and frictionless correction mechanisms.
  - *Over Time:* Learn from user corrections and retain user control.
- **Google PAIR (People + AI Research) Guidelines:**
  - Design for error states as first-class citizens.
  - Expose model uncertainty through confidence intervals, alternate choices, and clear attribution.

### B. Complex Enterprise & Industrial Systems (Bosch Context)
- **Multi-Stakeholder Ergonomics:** Enterprise tools serve plant managers, compliance officers, and line engineers simultaneously. Map user permissions, auditing requirements, and reporting horizons early.
- **Continuous Improvement Integration (CIP / CIM):** Connect UX findings directly to operational efficiency metrics (reduction in processing hours, reduction in manual data re-entry).

### C. Developer Tools & Data Interfaces
- **Shneiderman's Information Seeking Mantra:**
  1. *Overview first:* Provide high-level system state, anomaly summaries, and critical metrics.
  2. *Zoom and filter:* Allow granular slicing by timestamp, service, customer, or error code.
  3. *Details on demand:* Expose full logs, stack traces, and raw parameters via slide-out panels or inspect drawers without leaving context.

---

## 4. UX Metrics & Business KPI Matrix

| Metric Category | Metric | Definition & Purpose | Collection Frequency |
| --------------- | ------ | -------------------- | -------------------- |
| **Usability (Core)** | **SUS** | System Usability Scale (0–100 score). General usability benchmark. | Quarterly / Major releases |
| **Usability (Lite)** | **UMUX-Lite** | 2-item agile metric converted to SUS scale. | Per sprint / post-feature |
| **Satisfaction** | **CSI** | Customer/User Satisfaction Index (1–5 scale). Measures satisfaction with delivered solutions. | Post-project / delivery |
| **Advocacy** | **NPS** | Net Promoter Score (-100 to +100). Evaluates long-term product loyalty. | Bi-annual |
| **Operational** | **Time on Task** | Seconds/minutes to complete critical workflows. Measures efficiency. | Usability lab / telemetry |
| **Operational** | **Error Rate** | Number of slips or mistakes per workflow execution. Identifies interface friction. | Continuous logging |
| **AI Ergonomics** | **Acceptance Rate** | Ratio of AI suggestions accepted vs. edited vs. rejected. | Daily telemetry |
| **AI Trust** | **Trust Calibration Index** | Agreement rate with correct AI output minus acceptance of incorrect output. | Experimental benchmarks |

---

## 5. ResearchOps & Quality Checklist

Before closing any research or design initiative:
- [ ] **Method-Problem Fit:** Was the chosen research method appropriate for the question type (generative vs. evaluative)?
- [ ] **Sample Representation:** Did participants cover the full distribution of target user proficiencies (novice to power user)?
- [ ] **Data Integrity & LGPD:** Are transcripts de-identified? Are video/audio recordings stored securely with restricted access?
- [ ] **Prototype Validation:** Has the design technologist validated interactive behavior under realistic data conditions and latency constraints?
- [ ] **Traceable Backlog Items:** Are UX recommendations translated into prioritized Jira/ADO user stories with concrete acceptance criteria?
- [ ] **Closed Feedback Loop:** Were research findings communicated back to participants and executive stakeholders in an accessible, digestible format?

