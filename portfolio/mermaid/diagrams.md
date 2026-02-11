# Portfolio deck – Mermaid diagrams

Open this file in an editor or viewer that supports Mermaid (e.g. VS Code with Mermaid preview, GitHub, or [Mermaid Live](https://mermaid.live)) to see all diagrams. Use a second screen to view diagrams while presenting the deck.

## Diagram ID reference (file-naming safe)

| ID | Title | Deck slide(s) |
|----|-------|----------------|
| `story-flow` | Why story flow | 1 |
| `academic-timeline` | Academic timeline | 3 |
| `cip-ux-pipeline` | CIP-UX methodology pipeline | 6 |
| `academic-research-flow` | Academic research flow | 4 |
| `csi-nps-performance` | CSI and NPS performance | 5 |
| `dissertation-tech` | Dissertation & research – technologies | 6 & 7 |
| `infovis-pnad-structures` | InfoVis PNAD visual structures | 8 |
| `tooling-pt-workflow` | Tooling PT delivery workflow | 9 |
| `proposal-generator-phases` | Proposal Generator UX phases | 10 |
| `ai-agile-research` | AI and Agile in Research | 11 |
| `experience-timeline` | Experience timeline | 12 |
| `future-career-path` | Future career path | 13 |
| `future-career-strategic-views` | Future career – strategic views | 14 |

**File naming:** Use the ID for sources and exports (e.g. `story-flow.mmd`, `story-flow.png`). All deck references use these IDs.

---

## 1. [story-flow] Why story flow (Slide 1)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  Past["Past Foundations"]
  Present["Present Impact"]
  Future["Future Directions"]
  Past --> Present --> Future
```

---

## 2. [academic-timeline] Academic timeline (Slide 3)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  A["2012–2014<br/>Technical Degree<br/>Informatics<br/>(ETEC Bento Quirino)"]
  B["2015–2020<br/>Systems Analysis<br/>and Development<br/>(Unicamp)"]
  C["2023–2025<br/>Master's in Information Systems and Communication<br/> (Unicamp)"]
  A --> B --> C
```

---

## 3. [cip-ux-pipeline] CIP-UX methodology pipeline (Slide 6)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'subgraphBg': '#ffffff', 'subgraphBorder': '#2c3e50'}}}%%
flowchart TB
  subgraph methodologies [Methodologies]
    M1["Iterative code-based documentation"]
    M2["AI-assisted analysis"]
    M3["Automated pipeline"]
    M4["Data-driven reports"]
  end
  subgraph tools [Technical tools]
    T1["Markdown"]
    T2["Python"]
    T3["Cursor IDE"]
    T4["CSV"]
    T5["Power BI"]
  end
  style methodologies fill:#ffffff,stroke:#2c3e50,stroke-width:2px
  style tools fill:#ffffff,stroke:#2c3e50,stroke-width:2px
```

---

## 4. [academic-research-flow] Academic research flow (Slide 4)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart TD
  Focus["Benchmark: Trustworthiness, Usability, Accessibility, UX"]
  Tech["Technologies Used: Power BI, Figma, Python"]
  Soft["Soft Skills Learned: Critical Thinking, Scientific Method"]
  Pub["Publications: ISSRE 2025 HFSD, IHC 2025 SOL"]
  Industry["Industry reuse: UX audits, maturity, CIP+UX"]
  Focus --> Tech
  Focus --> Soft
  Focus --> Pub
  Tech --> Industry
  Soft --> Industry
  Pub --> Industry
```

---

## 5. [csi-nps-performance] CSI and NPS performance (Slide 5)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart TD
  H["Project | CSI | NPS"]
  R1["GS_R2S Financial Portal | 5 | —"]
  R2["EXT_PS_CCC Telemetry | 5 | 10"]
  R3["EXT_M-PUR36 Tooling | 5 | 10"]
  R4["EXT_M-PMQ PPAP | 5 | 10"]
  R5["GS_P2P_MovDiv | 5 | 10"]
  R6["GS_P2P_Financial_Portal | 5 | 10"]
  R7["GS_UX Bootcamp 2024 | 4.9 | 9.6"]
  R8["GS_B2R_AA CF Automation | 4 | 10"]
  AVG["Averages | 4.86 | 9.94"]
  H --> R1 --> R2 --> R3 --> R4 --> R5 --> R6 --> R7 --> R8 --> AVG
```

---

## 6. [dissertation-tech] Dissertation & research – technologies (Slides 6 & 7)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  A["AI Agents"]
  B["Full-stack"]
  C["Figma"]
  D["Database"]
  A --- B --- C --- D
```

---

## 7. [infovis-pnad-structures] InfoVis PNAD visual structures (Slide 8)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  PNAD["PNAD Continua"]
  Sankey["Sankey Diagram"]
  Choropleth["Choropleth Map"]
  Faceted["Faceted Bar Chart"]
  PNAD --> Sankey
  PNAD --> Choropleth
  PNAD --> Faceted
```

---

## 8. [tooling-pt-workflow] Tooling PT delivery workflow (Slide 9)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  W["Wireframe"]
  L["Low-fidelity\nprototype"]
  H["High-fidelity\nprototype"]
  W --> L --> H
  H --> Review["Customer progress\nreview meetings"]
  Review --> W
```

---

## 9. [proposal-generator-phases] Proposal Generator UX phases (Slide 10)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  P["Planning"]
  U["Understand"]
  S["Synthesize"]
  I["Ideate"]
  T["Test"]
  P --> U --> S --> I --> T
```

---

## 10. [ai-agile-research] AI and Agile in Research (Slide 11)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'subgraphBg': 'transparent', 'subgraphBorder': '#bdc3c7'}}}%%
flowchart TD
  RPO["Research Product Owner"]
  RSM["Research Scrum Master"]
  RT["Research Team + AI tools"]
  C1["Sprint planning, Backlog refinement"]
  C2["Daily check-ins, Reviews, Retrospectives"]
  A1["Research backlog, Experiment cards"]
  A2["Dashboards, AI drafts, human-reviewed"]
  RPO --> C1
  RSM --> C1
  RT --> C2
  C1 --> A1
  C2 --> A2
```

---

## 11. [experience-timeline] Experience timeline (Slide 12)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'cScale0': '#2c3e50', 'cScale1': '#2c3e50', 'cScale2': '#2c3e50', 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'fontFamily': 'Lato'}}}%%
timeline
    title Experience Timeline
    2017-2018 : Intern – Bosch Brasil : VBA, Continuous Improvement, internal communication
    2019 : Digitization Support Analyst – Bosch Magyarország Budapest : Business Excellence, VS Code, SQL Server, IIS
    2021-2023 : Web Developer – Bosch Brasil : Front-end, React, Scrum; user pain points to production
    2023-2026 : UX Researcher, Designer, and Project Manager – Bosch
```

---

## 12. [future-career-path] Future career path (Slide 13)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'cScale0': '#2c3e50', 'cScale1': '#2c3e50', 'cScale2': '#2c3e50', 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'fontFamily': 'Lato'}}}%%
timeline
    title Future Career Path
    2026-2027 : "Deepen UX research leadership at Bosch (UX researcher / UX lead focus)"
    2026-2027 : "Grow Scrum master experience in technology-focused product teams"
    2028-2030 : "Assume regional UX leadership or research lead roles"
    2028-2030 : "Move into UX researcher roles at global product companies in AI / data-intensive domains"
    2031+ : "Specialize in advanced tech research (quantum computing, AI & UX trustworthiness)"
    2031+ : "Hybrid leadership across UX research, AI implementation, and agile governance"
```

---

## 13. [future-career-strategic-views] Future career – strategic views (Slide 14)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart TD
    Objective["Future Objective:<br/>Technology-Focused Roles<br/>Integrating UX Research<br/>with AI Implementation<br/>& Development"]
    
    Roles["Target Roles:<br/>UX Researcher<br/>UX Lead<br/>Scrum Master<br/>Researcher in<br/>Advanced Tech"]
    
    ViewA["Strategic View A<br/>Paradise<br/>Quantum Computing"]
    ViewA1["Deep technical research<br/>& experimentation<br/>in quantum computing<br/>& advanced R&D"]
    ViewA2["Leverages:<br/>Analytical skills<br/>Experimentation mindset<br/>Physics background"]
    
    ViewB["Strategic View B<br/>Modest<br/>Scrum / Agile Leadership"]
    ViewB1["Scrum Master or<br/>agile leader enabling<br/>high-quality products"]
    ViewB2["Builds on:<br/>CIP & UX experience<br/>Facilitation<br/>Coaching"]
    
    Assets["Shared Assets:<br/>UX Research<br/>CIP + UX Integration<br/>AI + Agile Methodology<br/>Data-Driven Decision-Making"]
    
    Objective --> Roles
    Objective --> ViewA
    Objective --> ViewB
    Objective --> Assets
    
    ViewA --> ViewA1
    ViewA --> ViewA2
    ViewB --> ViewB1
    ViewB --> ViewB2
    
    Assets -.-> ViewA
    Assets -.-> ViewB
    
    style Objective fill:#2c3e50,stroke:#bdc3c7,stroke-width:3px,color:#fff
    style ViewA fill:#2c3e50,stroke:#bdc3c7,stroke-width:2px,color:#fff
    style ViewB fill:#2c3e50,stroke:#bdc3c7,stroke-width:2px,color:#fff
    style Assets fill:#2c3e50,stroke:#bdc3c7,stroke-width:2px,color:#fff
    style Roles fill:#2c3e50,stroke:#bdc3c7,stroke-width:2px,color:#fff
```
