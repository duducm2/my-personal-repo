# Portfolio deck – Mermaid diagrams

Open this file in an editor or viewer that supports Mermaid (e.g. VS Code with Mermaid preview, GitHub, or [Mermaid Live](https://mermaid.live)) to see all diagrams. Use a second screen to view diagrams while presenting the deck.

## Diagram ID reference (file-naming safe)

| ID                          | Title                                      | Deck slide(s) |
| --------------------------- | ------------------------------------------ | ------------- |
| `story-flow`                | Why story flow                             | 1             |
| `academic-timeline`         | Academic timeline                          | 3             |
| `cip-ux-pipeline`           | CIP-UX methodology pipeline                | 6             |
| `ux-relevance-model`        | UX relevance evaluation model              | 6a            |
| `academic-research-flow`    | Academic research flow                     | 4             |
| `dissertation-tech`         | Dissertation & research – technologies     | 6 & 7         |
| `infovis-pnad-structures`   | InfoVis PNAD visual structures             | 8             |
| `tooling-pt-workflow`       | Tooling PT delivery workflow               | 9             |
| `proposal-generator-phases` | Proposal Generator UX phases               | 10            |
| `ai-agile-research`         | Question, experiment, stakeholder decision | 11            |
| `experience-timeline`       | Experience timeline                        | 12            |
| `future-career-path`        | Path to Data Scientist pleno               | 13            |

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
  C["2023–2026<br/>Master's in Information Systems and Communication<br/> (Unicamp)"]
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
  subgraph tools [" "]
    direction LR
    subgraph tools_col1 [" "]
      direction TB
      T1["Markdown"]
      T2["Python"]
      T3["Cursor IDE"]
      T4["CSV"]
      T5["Power BI"]
    end
    subgraph tools_col2 [" "]
      direction TB
      T6["Mermaid diagrams"]
      T7["Matplotlib"]
      T8["Seaborn"]
      T9["HTML"]
      T10["CSS"]
    end
  end
  style methodologies fill:#ffffff,stroke:#2c3e50,stroke-width:2px,color:#000000
  style tools fill:transparent,stroke:none
  style tools_col1 fill:transparent,stroke:none
  style tools_col2 fill:transparent,stroke:none
  style T1 fill:#2c3e50,stroke:none
  style T2 fill:#2c3e50,stroke:none
  style T3 fill:#2c3e50,stroke:none
  style T4 fill:#2c3e50,stroke:none
  style T5 fill:#2c3e50,stroke:none
  style T6 fill:#2c3e50,stroke:none
  style T7 fill:#2c3e50,stroke:none
  style T8 fill:#2c3e50,stroke:none
  style T9 fill:#2c3e50,stroke:none
  style T10 fill:#2c3e50,stroke:none
```

---

## 3b. [ux-relevance-model] UX relevance evaluation model (Slide 6a)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart LR
  CIM["Information from CIM (ServiceNow CIM fields)"]
  Priority["Set by priority (Prioritization logic)"]
  Low["Low"]
  Medium["Medium"]
  High["High"]
  CIM --> Priority --> Low
  Priority --> Medium
  Priority --> High
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
  E["Tests with Python"]
  F["Azure Cloud Infrastructure"]
  A --- B --- C --- D --- E --- F
```

---

## 6. [infovis-pnad-structures] InfoVis PNAD visual structures (Slide 8)

English export: `infovis-pnad-structures-en.png`.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '28px'}}}%%
flowchart LR
  PNAD["PNAD Continua"]
  Sankey["Sankey Diagram"]
  Choropleth["Choropleth Map"]
  Faceted["Bar Chart"]
  PNAD --> Sankey
  PNAD --> Choropleth
  PNAD --> Faceted
```

Portuguese export: `infovis-pnad-structures-pt.png`.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '28px'}}}%%
flowchart LR
  PNAD["PNAD Contínua"]
  Sankey["Sankey"]
  Choropleth["Mapa coroplético"]
  Faceted["Gráfico de barras"]
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

## 9. [ai-agile-research] Question, experiment, stakeholder decision (Slide 11)

_Narrative for slide:_ The path toward Data Scientist pleno is a working loop: start from a question, run an experiment with statistics and supervised ML, and leave stakeholders with a decision they can use.

English export: `ai-agile-research-en.png`.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '36px'}, 'flowchart': {'padding': 28, 'rankSpacing': 56, 'wrappingWidth': 900}}}%%
flowchart TB
  Q["Question"]
  E["Experiment · stats and supervised ML"]
  D["Stakeholder decision"]
  Q --> E --> D
```

Portuguese export: `ai-agile-research-pt.png`.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '36px'}, 'flowchart': {'padding': 28, 'rankSpacing': 56, 'wrappingWidth': 900}}}%%
flowchart TB
  Q["Pergunta"]
  E["Experimento · estatística e ML supervisionado"]
  D["Decisão com stakeholders"]
  Q --> E --> D
```

---

## 10. [experience-timeline] Experience timeline (Slide 12)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato'}}}%%
flowchart TD
  D1["2017-2018"] -.-> E1["Intern – Bosch Brasil<br/>VBA, Continuous Improvement, internal communication"]
  D2["2019 - Bosch Magyarország Budapest"] -.-> E2["Digitization Support Analyst<br/>Business Excellence, VS Code, SQL Server, IIS"]
  D3["2020-2023"] -.-> E3["Web Developer – Bosch Brasil<br/>Front-end, React, Scrum, UX"]
  D4["2023-2026"] -.-> E4["UX Researcher, Designer, and Project Manager"]
```

---

## 11. [future-career-path] Path to Data Scientist pleno (Slide 13)

English export: `future-career-path-en.png`.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '36px'}, 'flowchart': {'padding': 28, 'rankSpacing': 56, 'wrappingWidth': 900}}}%%
flowchart TB
  Now["Now · Applied research and analytics"]
  Next["Next · Data Scientist pleno"]
  Seniors["With seniors · Production monitoring"]
  Now --> Next --> Seniors
```

Portuguese export: `future-career-path-pt.png`.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#2c3e50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#bdc3c7', 'lineColor': '#2c3e50', 'fontFamily': 'Lato', 'fontSize': '36px'}, 'flowchart': {'padding': 28, 'rankSpacing': 56, 'wrappingWidth': 900}}}%%
flowchart TB
  Now["Agora · Pesquisa aplicada e analytics"]
  Next["Próximo · Cientista de Dados pleno"]
  Seniors["Com seniores · Monitoramento de produção"]
  Now --> Next --> Seniors
```
