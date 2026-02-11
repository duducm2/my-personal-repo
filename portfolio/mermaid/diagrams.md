# Portfolio deck – Mermaid diagrams

Open this file in an editor or viewer that supports Mermaid (e.g. VS Code with Mermaid preview, GitHub, or [Mermaid Live](https://mermaid.live)) to see all diagrams. Use a second screen to view diagrams while presenting the deck.

---

## 1. Why story flow (Slide 1)

```mermaid
flowchart LR
  Past["Past Foundations"]
  Present["Present Impact"]
  Future["Future Directions"]
  Past --> Present --> Future
```

---

## 2. Academic timeline (Slide 3)

```mermaid
timeline
    title Academic Foundations
    2012-2014 : Technical Degree in Computer Science – ETEC Bento Quirino
    2015-2020 : Systems Analysis and Development – Unicamp
    2023-2025 : Master's in Technology – Information and Communication Systems UX – Unicamp
    2024 : English proficiency UFSC – Reading 10/10
```

---

## 3. CIP-UX methodology pipeline (Slide 6)

```mermaid
flowchart LR
  A["(1) Iterative code-based documentation\nMarkdown, method.md v2.8"]
  B["(2) AI-assisted analysis\nN=214 records, UX maturity data"]
  C["(3) Automated pipeline\nextract to aggregate to calculate\nux_relevance_results.csv N=35"]
  D["(4) High-quality reports\nMarkdown, executive summaries\nCriticality Index"]
  A --> B --> C --> D
```

---

## 4. Academic research flow (Slide 8)

```mermaid
flowchart TD
  Focus["Benchmark: Trustworthiness\nUsability, Accessibility, UX"]
  Pub["Publications\nISSRE 2025 HFSD, IHC 2025 SOL"]
  Tool["TrustMate + Power BI\nAI agents, full-stack, Figma"]
  Industry["Industry reuse\nUX audits, maturity, CIP+UX"]
  Focus --> Pub
  Focus --> Tool
  Pub --> Industry
  Tool --> Industry
```

---

## 5. CSI and NPS performance (Slide 10)

```mermaid
block-beta
    columns 3
    "Project" "CSI" "NPS"
    "GS_R2S_TET2-LA UI Design Financial Portal" "5" "-"
    "EXT_PS_CCC Telemetry light vehicles" "5" "10"
    "EXT_M-PUR36 Tooling Management" "5" "10"
    "EXT_M-PMQ PPAP Application" "5" "10"
    "GS_P2P_MovDiv_Improvement part 1" "5" "10"
    "GS_P2P_Financial_Portal" "5" "10"
    "GS_UX Bootcamp 2024 Joinville 95 people" "4.9" "9.6"
    "GS_B2R_AA CF Automation" "4" "10"
    "Averages" "4.86" "9.94"
```

---

## 6. Dissertation database architecture (Slide 14)

```mermaid
erDiagram
  Projects {
    string id PK
    string name
    string category
    string url
  }

  Experiments {
    string id PK
    string project_id FK
    string name
    datetime created_at
  }

  SurveyDefinitions {
    string id PK
    string name
    string section
    string question_text
    int scale_min
    int scale_max
  }

  SurveyResponses {
    string id PK
    string experiment_id FK
    string survey_definition_id FK
    string respondent_type
    int value
    datetime responded_at
  }

  AgentSessions {
    string id PK
    string experiment_id FK
    string agent_id
    datetime started_at
    datetime completed_at
  }

  Attributes {
    string id PK
    string parent_id FK
    string name
    string category
    float weight
  }

  Scores {
    string id PK
    string experiment_id FK
    string attribute_id FK
    float value
    string source
  }

  Emulations {
    string id PK
    string experiment_id FK
    string config_key
    string config_value
  }

  Projects ||--o{ Experiments : has
  Experiments ||--o{ SurveyResponses : contains
  Experiments ||--o{ AgentSessions : uses
  Experiments ||--o{ Scores : produces
  Experiments ||--o{ Emulations : has
  SurveyDefinitions ||--o{ SurveyResponses : defines
  Attributes ||--o{ Scores : measured_by
```

---

## 7. Dissertation tech pillars (Slide 14, optional)

```mermaid
flowchart LR
  A["AI agents as\nsurvey respondents"]
  B["Full-stack\ndevelopment"]
  C["Figma\nlow-fidelity prototyping"]
  A --- B --- C
```

---

## 8. InfoVis PNAD visual structures (Slide 13)

```mermaid
flowchart LR
  PNAD["PNAD Continua\nNational Survey Data"]
  Sankey["Sankey\nEducation-employment\nIncome flows"]
  Choropleth["Choropleth\nIncome by state"]
  Faceted["Faceted bar charts\nIncome by education\nhousehold, area"]
  PNAD --> Sankey
  PNAD --> Choropleth
  PNAD --> Faceted
```

---

## 9. Tooling PT delivery workflow (Slide 16)

```mermaid
flowchart LR
  W["Wireframe"]
  L["Low-fidelity\nprototype"]
  H["High-fidelity\nprototype"]
  W --> L --> H
  H --> Review["Customer progress\nreview meetings"]
  Review --> W
```

---

## 10. Proposal Generator UX phases (Slide 17)

```mermaid
flowchart LR
  P["Planning"]
  U["Understand"]
  S["Synthesize"]
  I["Ideate"]
  T["Test"]
  P --> U --> S --> I --> T
```

---

## 11. AI and Agile in Research (Slide 19)

```mermaid
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
```

---

## 12. Experience timeline (Slide 21)

```mermaid
timeline
    title Experience Timeline
    2017-2018 : Intern – Bosch Brasil : VBA, Continuous Improvement, internal communication
    2019 : Digitization Support Analyst – Bosch Magyarország Budapest : Business Excellence, VS Code, SQL Server, IIS
    2021-2023 : Web Developer – Bosch Brasil : Front-end, React, Scrum; user pain points to production
```

---

## 13. Future career path (Slide 22)

```mermaid
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

## 14. Future career – strategic views (Slide 22)

```mermaid
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
    
    style Objective fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    style ViewA fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style ViewB fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style Assets fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style Roles fill:#fce4ec,stroke:#880e4f,stroke-width:2px
```
