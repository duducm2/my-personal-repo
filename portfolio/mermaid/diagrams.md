# Portfolio deck – Mermaid diagrams

Open this file in an editor or viewer that supports Mermaid (e.g. VS Code with Mermaid preview, GitHub, or [Mermaid Live](https://mermaid.live)) to see all diagrams. Use a second screen to view diagrams while presenting the deck.

## Diagram ID reference (file-naming safe)

| ID | Title | Deck slide(s) |
|----|-------|----------------|
| `story-flow` | Why story flow | 1 |
| `academic-timeline` | Academic timeline | 3 |
| `cip-ux-pipeline` | CIP-UX methodology pipeline | 6 |
| `academic-research-flow` | Academic research flow | 4 |
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
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'subgraphBg': '#ffffff', 'subgraphBorder': '#2c3e50', 'subgraphTextColor': '#000000', 'subgraphTitleColor': '#000000'}}}%%
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
  style methodologies fill:#ffffff,stroke:#2c3e50,stroke-width:2px,color:#000000
  style tools fill:#ffffff,stroke:#2c3e50,stroke-width:2px,color:#000000
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

## 5. [dissertation-tech] Dissertation & research – technologies (Slides 6 & 7)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  A["AI Agents"]
  B["Full-stack"]
  C["Figma"]
  D["Database"]
  E["Tests (Python)"]
  F["Azure Cloud Infrastructure"]
  A --- B --- C --- D --- E --- F
```

---

## 6. [infovis-pnad-structures] InfoVis PNAD visual structures (Slide 8)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  PNAD["PNAD Continua"]
  Sankey["Sankey Diagram"]
  Choropleth["Choropleth Map"]
  Faceted["Bar Chart"]
  PNAD --> Sankey
  PNAD --> Choropleth
  PNAD --> Faceted
```

---

## 7. [tooling-pt-workflow] Tooling PT delivery workflow (Slide 9)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  W["Wireframe"]
  L["Low-fidelity prototype"]
  H["High-fidelity prototype"]
  W --> L --> H
  H --> Review["Customer progress review meetings"]
  Review --> W
```

---

## 8. [proposal-generator-phases] Proposal Generator UX phases (Slide 10)

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

## 9. [ai-agile-research] AI and Agile in Research (Slide 11)

*Narrative for slide:* The **Research Scrum Master** facilitates the process (sprint planning, backlog refinement, daily check-ins, reviews, retrospectives) and evaluates whether the team is using tools and tech correctly (e.g. AI, AR). The research team works with AI tools and participates in ceremonies; outcomes include research backlog, experiment cards, dashboards, and human-reviewed AI drafts.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'subgraphBg': 'transparent', 'subgraphBorder': '#bdc3c7'}}}%%
flowchart TD
  RSM["Research Scrum Master"]
  RT["Research Team + AI tools"]
  C1["Sprint planning, Backlog refinement"]
  C2["Daily check-ins, Reviews, Retrospectives"]
  C3["Tool & tech usage evaluation (AI, etc.)"]
  A1["Research backlog, Experiment cards"]
  A2["Dashboards, AI drafts, human-reviewed"]
  RSM --> C1
  RSM --> C2
  RSM --> C3
  C3 --> RT
  RT --> C2
  C1 --> A1
  C2 --> A2
```

---

## 10. [experience-timeline] Experience timeline (Slide 12)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart TD
  D1["2017-2018"] -.-> E1["Intern – Bosch Brasil<br/>VBA, Continuous Improvement, internal communication"]
  D2["2019 - Bosch Magyarország Budapest"] -.-> E2["Digitization Support Analyst<br/>Business Excellence, VS Code, SQL Server, IIS"]
  D3["2020-2023"] -.-> E3["Web Developer – Bosch Brasil<br/>Front-end, React, Scrum; user pain points to production"]
  D4["2023-2026"] -.-> E4["UX Researcher, Designer, and Project Manager"]
```

---

## 11. [future-career-path] Future career path (Slide 13)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart TD
  D1["2026-2027"] -.-> E1["Deepen UX research leadership at Bosch (UX researcher / UX lead focus)"]
  D2["2026-2027"] -.-> E2["Grow Scrum master experience in technology-focused product teams"]
  D3["2028-2030"] -.-> E3["Assume regional UX leadership or research lead roles"]
  D4["2028-2030"] -.-> E4["Move into UX researcher roles at global product companies in AI / data-intensive domains"]
  D5["2031+"] -.-> E5["Specialize in advanced tech research (quantum computing, AI & UX trustworthiness)"]
  D6["2031+"] -.-> E6["Hybrid leadership across UX research, AI implementation, and agile governance"]
```

---

## 12. [future-career-strategic-views] Future career – strategic views (Slide 14)

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
