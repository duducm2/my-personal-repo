const UI = {
  en: {
    chapters: {
      why: "Why",
      foundations: "Foundations",
      path: "Path",
      present: "Present",
      deliverables: "Deliverables",
      model: "Model",
      research: "Research",
      scores: "Scores",
      next: "Next",
      interests: "Interests",
      contact: "Contact",
    },
    skip: "Skip to the story",
    foundationsTitle: "Academic foundations",
    foundationsLead:
      "Technical school at ETEC Bento Quirino, then Unicamp. Grade A in all master's coursework. English proficiency verified. Portuguese is native; English is fluent (General American accent, with a highlight in phonetics).",
    trait0: "Proactive",
    trait1: "Self-reliant",
    trait2: "Organized",
    academicCap: "Academic writing, Unicamp",
    ftCap:
      "Undergraduate degree in Systems Analysis and Development, School of Technology, Unicamp, with colleagues",
    tccCap:
      "Defending my technical course conclusion work (TCC), ETEC Bento Quirino",
    tccDelivery: "Internal social network, built as a web application",
    ftDelivery:
      "Web application for student activities, with traditional project management",
    thesisDelivery: "Master's dissertation on perceived trust, with TrustMate",
    gradeSticker: "Best score in every discipline",
    degreesTitle: "University Degrees & Official Credentials",
    degreesLead:
      "Official Unicamp diplomas with front conferrals and back registry sheets, digital verification hashes, and rectorate authentication.",
    capMestradoFrente:
      "Master's in Technology – Information & Communication Systems (Unicamp, 2026)",
    capMestradoVerso:
      "Master's Registry Verso – DAC RD-057530 & Digital Verification Key",
    capGraduacaoFrente:
      "Technologist in Systems Analysis & Development (Unicamp, 2020)",
    capGraduacaoVerso:
      "Undergraduate Registry Verso – DAC RD-026702 & Digital Verification Key",
    internCap0: "Starting as an intern at Bosch Campinas, with colleagues",
    internCap1: "The intern group at Bosch Campinas, when I started",
    pathTitle: "Bosch, place by place",
    pathLead:
      "The path crosses Bosch locations: Campinas, Hungary, Sorocaba, and Campinas again.",
    pathCap2018: "Campinas, 2018. Team recognition with Bosch.",
    pathCapHungary: "Hungary, 2019, with the Budapest team.",
    pathCapDev: "With the development team, 2020 to 2022.",
    pathCapReturn:
      "Back in Campinas. Germany workshops in 2024 and 2025, and the Americas team in 2025.",
    stop0: "Campinas",
    stop1: "Hungary",
    story: "../media/story-flow.png",
    storyAlt: "Past foundations, present impact, and future directions",
    relevance: "../media/relevance.png",
    relevanceAlt:
      "Applied research relevance model: CIM fields, priority, then Low, Medium, or High",
    storyCap: "Past, present, and what comes next",
    pathCap: "How the next step is shaped",
    deliverablesTitle: "Deliverables",
    deliverablesLead: "These are the pieces I shipped.",
    uxTitle: "UX Super",
    uxLead:
      "A portal for the UX practice. It keeps each business with its offerings, personas, and opportunities, and it tracks project KPIs from a baseline to a target.",
    uxCapBusinesses: "UX Super, businesses",
    uxCapKpis: "UX Super, project KPIs",
    deliverable0:
      "Tooling for Power Tools, from requirements through high-fidelity prototypes.",
    deliverable1:
      "CIP research report, and the relevance model used in ServiceNow.",
    deliverable2: "Power BI for allocation, training, and the TrustMate study.",
    deliverable3:
      "A results portal that publishes UX findings as cards, a recommendations library, and a task timeline, instead of a static PDF.",
    appsTitle: "Personal apps",
    appsLead:
      "Tools I built for my own work: a task board, a finance cockpit, and a personal study-progress web app.",
    appsCapTasks: "Tasks, personal board",
    appsCapFinance: "Finance cockpit, budgets and spending",
    modelTitle: "Relevance model",
    modelLead:
      "I built a model to score applied-research relevance for CIP initiatives. CIM (ServiceNow) fields are set by priority. The result is Low, Medium, or High, a triage for when deeper research involvement is needed. Python runs the pipeline on CIM-like data.",
    modelSample: "Sample of 35 projects",
    modelCap: "Relevance model for CIP initiatives",
    bars: ["Low", "Medium", "High"],
    deliverablesHint: "Select any deliverable to expand details and visuals.",
    privacyDisclaimer:
      "All images are anonymized in order to respect the data privacy for the project.",
    featuredCaseStudy: {
      badge: "Flagship Case Study · Research × Data × Product Ownership",
      title: "Project BeaconTower — UX Practice Portal & Service Blueprint",
      lead:
        "This project brings together everything I do best: leading a team of 3 researchers across 20+ interviews, 4+ focus groups, and a global survey to align stakeholders with empirical data, while acting as Product Owner to build a real platform solution.",
      pillars: [
        {
          label: "01 · Research Leadership & Stakeholders",
          text: "Acted as Research Lead guiding 3 other researchers through 20+ stakeholder interviews and 4+ focus group sessions, alongside a global survey, coding matrices, concentric stakeholder mapping, and an as-is service blueprint exposing 240-row parallel Excel workarounds.",
        },
        {
          label: "02 · Data & Quant Evidence",
          text: "Combined survey data with a heuristic audit of 8 core screens (33 flaws quantified) and baseline-to-target KPI tracking.",
        },
        {
          label: "03 · Product Ownership & Solution",
          text: "Built the PracticeHub UX portal (offerings, personas, opportunities, KPIs) and shaped unified governance with projected savings of 150k EUR/quarter and 240h/month.",
        },
      ],
    },
    deliverableCategories: [
      { id: "platforms", title: "Product, Platforms & Governance" },
      { id: "data", title: "Data, Analytics & Models" },
      { id: "training", title: "Training, Workshops & Presentations" },
      { id: "personal", title: "Personal Apps & Productivity" },
    ],
    deliverablesItems: [
      {
        id: "astra",
        category: "platforms",
        title: "Astra (AgriTech IoT & Cattle Telemetry)",
        short:
          "AgriTech field ethnography across 3 cattle ranches, AgriShow benchmark, 6-dimension PMF validation, and MVP requirements.",
        full:
          "In the Astra project (AgriTech livestock telemetry at Bosch), I conducted field research to solve operational bottlenecks in premium cattle ranching and turn qualitative evidence into hardware and software product strategy. Fieldwork included on-site ethnography and semi-structured interviews across 3 premium cattle ranches (including Fazenda Sindi da Porangaba), competitor benchmarking at AgriShow Brazil in Ribeirão Preto, and strategic partnership discovery in veterinary pharma. I delivered the formal research report defining dual personas (Premium Breeder vs. Farm Cowboy), an as-is journey with 10 operational pain points, a future-state journey with 10 IoT solutions, a 6-dimension Product-Market Fit (PMF) validation ('GO for targeted pilot'), and scoped MVP requirements with pilot metrics.",
        media: [
          {
            src: "../media/astra-iot-device.jpg",
            alt: "Bosch Astra IoT telemetry hardware evaluation in field conditions",
            caption: "HerdSense IoT telemetry device & hardware evaluation",
          },
          {
            src: "../media/astra-current-journey.png",
            alt: "Astra as-is journey map and 10 operational pain points",
            caption: "As-is journey & 10 operational pain points map",
          },
          {
            src: "../media/astra-mvp-requirements.png",
            alt: "Astra scoped MVP requirements and pilot success metrics",
            caption: "Scoped MVP requirements & pilot success metrics",
          },
        ],
      },
      {
        id: "x-tower",
        category: "platforms",
        title: "Project BeaconTower — UX Practice Portal & Service Blueprint",
        short:
          "End-to-end UX discovery & architecture: 8-tool benchmark, 11-screen heuristic audit + 103-observation doc audit, Grounded Theory coding, 5 personas, and blueprint saving 150k EUR/quarter & 240h/month.",
        full:
          "Built the PracticeHub UX portal and led a team of three researchers on my behalf to execute end-to-end UX research and information architecture for the BeaconTower enterprise capacity and portfolio platform. I authored the 57.5-person-day (460h) briefing, questions-hypotheses-evidence matrix, 8-tool competitive benchmark (16 screens, 17 features), 5 empirical personas and 7 stakeholder profiles, moderated 4 cross-regional focus groups, built a Straussian Grounded Theory open/axial coding dashboard, executed an 11-screen platform heuristic evaluation plus a 103-observation wiki manual audit across 12 pages, and defined the target system architecture—projecting 150,000 EUR/quarter and 240h/month in savings.",
        media: [
          {
            src: "../media/x-tower-summary.png",
            alt: "BeaconTower project overview and baseline-to-target KPI scorecards",
            caption: "BeaconTower executive summary and baseline-to-target KPI scorecards",
          },
          {
            src: "../media/x-tower-ecosystem.png",
            alt: "BeaconTower platform ecosystem map across modules, leadership, and enterprise operations",
            caption: "BeaconTower ecosystem map",
          },
          {
            src: "../media/x-tower-as-is-journey.png",
            alt: "X-Tower as-is service blueprint across User, Frontstage, Backstage, and Support",
            caption: "As-is journey service blueprint",
          },
          {
            src: "../media/x-tower-stakeholders.png",
            alt: "Concentric stakeholder map for X-Tower showing Core team, Core user, Direct and Indirect stakeholders",
            caption: "Stakeholder proximity map",
          },
          {
            src: "../media/x-tower-plan.png",
            alt: "5-phase UX research and design plan timeline for X-Tower",
            caption: "5-phase UX research plan",
          },
          {
            src: "../media/x-tower-survey.png",
            alt: "X-Tower Microsoft Forms survey invitation and structured question insights",
            caption: "Stakeholder survey & insight mapping",
          },
          {
            src: "../media/x-tower-interviews.png",
            alt: "Cross-participant interview matrix for X-Tower research",
            caption: "Interview coding matrix",
          },
          {
            src: "../media/ux-super-kpis.jpg",
            alt: "UX Super project KPIs, with baseline and target",
            caption: "UX Practice Portal: project KPIs (baseline & target)",
          },
        ],
      },
      {
        id: "rise-automation",
        category: "platforms",
        title: "SO Automação Prototype (Rise)",
        short:
          "Low-fidelity wireframe prototype for an automation intake and impact-tracking dashboard.",
        full:
          "Designed the Dashboard SO Automação wireframe prototype to standardize how automation initiatives are registered, owned, and tracked—capturing organizational structure, go-live lifecycle dates, and monthly hours saved (e.g., SAP report extraction and HR onboarding automations).",
        media: [
          {
            src: "../media/rise-so-automacao.png",
            alt: "Wireframe prototype for Dashboard SO Automação and automation registration form",
            caption: "FlowPulse — Automation intake wireframe prototype",
          },
        ],
      },
      {
        id: "data-insights",
        category: "data",
        title: "Data Insights (Power Tools CX)",
        short:
          "Grounded Theory qualitative analysis of call-center transcripts using Python, AI-assisted coding, and Power BI.",
        full:
          "Led a Customer Experience analysis for the power tools segment focused on unstructured call-center transcriptions. Applied Grounded Theory (Strauss and Corbin open and axial coding) with Python and AI-assisted coding, then synthesized customer journey phases, causal conditions, and action strategies in Power BI.",
        media: [
          {
            src: "../media/data-insights-powerbi.png",
            alt: "Power BI Grounded Theory CX report showing customer journey phase, boleto payment friction, and causal conditions",
            caption: "VoiceLens — Power BI Grounded Theory CX synthesis",
          },
          {
            src: "../media/data-insights-funnel.png",
            alt: "Evidence-to-insight funnel showing 10 audio transcripts distilled into 242 evidences and 7 insights",
            caption: "Evidence-to-insight funnel: 10 transcripts → 242 evidences → 7 insights",
          },
          {
            src: "../media/data-insights-summary.png",
            alt: "Overview table of the 7 CX insights with risk levels, evidence counts, and verbatim quotes",
            caption: "Overview of the 7 CX insights & risk levels",
          },
          {
            src: "../media/data-insights-journey.png",
            alt: "5-phase customer journey map across QMAI call-center evidence",
            caption: "VoiceLens — Customer journey evidence mapping",
          },
        ],
      },
      {
        id: "cim-journey",
        category: "data",
        title: "CIM Journey & Evidence Synthesis",
        short:
          "Power BI synthesis of 1,045 CIM research evidence units into executive reporting and data-quality insights.",
        full:
          "Synthesized 1,045 qualitative and operational evidence units from CIM research across CSDs, intervention levers, themes, risks, and success metrics in Power BI, distilling executive insight cards on reporting visibility and data standardization.",
        media: [
          {
            src: "../media/cim-journey-dashboard.png",
            alt: "Power BI dashboard analyzing 1,045 CIM evidence units by CSD, intervention lever, theme, risk, and success metric",
            caption: "SignalMap — Continuous improvement evidence dashboard (1,045 units)",
          },
          {
            src: "../media/cim-journey-insight-1.png",
            alt: "Insight 1 slide: highest-relevance evidence converges on reporting and visibility",
            caption: "Insight 1: Reporting & visibility convergence",
          },
          {
            src: "../media/cim-journey-insight-2.png",
            alt: "Insight 2 slide: focus on data quality, consistency, and standardization-related evidence",
            caption: "Insight 2: Data quality & standardization",
          },
        ],
      },
      {
        id: "relevance-model",
        category: "data",
        title: "Project PulseGate — UX, Continuous Improvement & Automation Unification",
        short:
          "Unified UX, Continuous Improvement & Automation across 4,000+ initiatives: Ideation Lab & Digital Automation Workshop upgrades, 10-risk heatmap, and automated UX scoring (r ≈ -0.84).",
        full:
          "I led two initiatives bridging UX and Continuous Improvement (CIP): (1) Enhancing the enterprise Ideation Lab AI/automation platform through a 5-step UX assessment and upgrading the Digital Automation Workshop with a True North prep session, standardized process mapping template, SWOT matrix, and post-workshop desirability/feasibility/viability gates; (2) Unifying UX, CIP, and Automation into a single intake workflow across 4,000+ global initiatives (2,500+ in Latin America), authoring a 10-risk probability-vs-impact heatmap, and statistically comparing CIP intake fields against UX criteria via parallel-coordinates analysis (r ≈ -0.84) to enable automatic UX relevance scoring.",
        metrics: {
          sample: "Sample of 35 projects",
          bars: [
            { label: "Low", pct: 40.0 },
            { label: "Medium", pct: 37.1 },
            { label: "High", pct: 22.9 },
          ],
        },
        media: [
          {
            src: "../media/relevance.png",
            alt: "Applied research relevance model: CIM fields, priority, then Low, Medium, or High",
            caption: "Relevance model for CIP initiatives",
          },
          {
            src: "../media/ux-relevance-flow.png",
            alt: "ServiceNow CIM workflow showing UX quality gate, AI triage, and UX champion check",
            caption: "PulseGate — UX quality gate & ServiceNow intake relevance workflow",
          },
          {
            src: "../media/ux-relevance-wireframe.png",
            alt: "Hand-drawn wireframe of the Proposed UX Relevance Quick Method V1 and V2",
            caption: "UX Relevance Quick Method V1 & V2 wireframe",
          },
          {
            src: "../media/ux-relevance-scoring.png",
            alt: "Flowchart of CIM auto-fill, scoring normalization, and Low/Medium/High decision bands",
            caption: "Scoring algorithm & Low/Medium/High decision bands",
          },
        ],
      },
      {
        id: "tooling-pt",
        category: "platforms",
        title: "Tooling, Power Tools",
        short:
          "Technical delivery and project management from requirements through high-fidelity prototypes.",
        full:
          "Led technical delivery and project management for Power Tools (EXT_M-PUR36 Tooling) from requirements through high-fidelity prototypes, with regular customer check-ins (CSI 5.0, NPS 10).",
        media: [
          {
            src: "../media/projects/tooling-pt__tooling-1.png",
            alt: "Wireframe & Information Architecture",
            caption: "Wireframe & Information Architecture",
          },
        ],
      },
      {
        id: "power-bi",
        category: "data",
        title: "Project MaturityPulse — Regional UX Project Management, Maturity Audit & Governance",
        short:
          "Latin America UX Project Management, standardized templates, strategy platform workflows, and Power BI audit dashboards lifting regional UX maturity from 2.96 to 3.96/4.00 (Level 4/5).",
        full:
          "Acting as Project Manager supporting UX teams across Latin America, I organized standardized documentation templates, guided cross-functional teams on applying project management workflows inside the enterprise strategy execution platform, and tracked UX usage reported by regional service line units alongside automated Power BI audit dashboards (connected to Microsoft Lists). By ensuring UX researchers and designers properly documented findings, feedback hubs, and co-creation workshops across 17 audit criteria, I helped lift regional maturity from a 2.96 baseline to 3.96/4.00, formally achieving UX Maturity Level 4 out of 5.",
        media: [
          {
            src: "../media/pbi-allocation.jpg",
            alt: "Power BI UX maturity audit and project governance dashboard",
            caption: "Power BI — UX maturity audit & PM compliance",
          },
          {
            src: "../media/pbi-training.jpg",
            alt: "Power BI dashboard tracking UX training adoption and evolution",
            caption: "Power BI — UX training evolution",
          },
          {
            src: "../media/digital-ws.jpg",
            alt: "UX training session empowering teams to apply UX in daily activities",
            caption: "UX training session — empowering daily UX practice",
          },
        ],
      },
      {
        id: "personal-apps",
        category: "personal",
        title: "Personal apps",
        short:
          "Task board, finance cockpit, and a personal study-progress web app built for daily workflows and learning.",
        full:
          "Tools I built for my own work: a Kanban-style task board tracking personal projects in columns, a finance cockpit with budgets and spending by category, and a personal web app for studying where I track my learning progress across phases and tasks.",
        media: [
          {
            src: "../media/tasks-board.jpg",
            alt: "Tasks board, with personal projects in columns",
            caption: "Tasks, personal board",
          },
          {
            src: "../media/finance-cockpit.jpg",
            alt: "Finance cockpit, with budgets and spending by category",
            caption: "Finance cockpit, budgets and spending",
          },
          {
            src: "../media/ahk-finance-menu.png",
            alt: "AutoHotkey Finance launcher menu with keyboard shortcuts",
            caption: "AutoHotkey Finance launcher & quick-key menu",
          },
          {
            src: "../media/study-progress-app.png",
            alt: "Personal web app for studying showing study phases, tasks, and overall learning progress",
            caption: "Personal study-progress web app",
          },
        ],
      },
      {
        id: "trustmate-cloud",
        category: "platforms",
        title: "TrustMate (Azure Cloud Architecture & Platform)",
        short:
          "Full-stack Microsoft Azure cloud architecture (Static Web Apps, App Service, Azure SQL, Application Insights & metric alerts) supporting human and AI evaluations.",
        full:
          "Built and deployed the TrustMate research platform on Microsoft Azure to support empirical perceived-trust evaluations (ISO/IEC 25000 MQCI) across 127 human participants and 150 low-context AI agent runs. The cloud architecture separates a Vue 3 SPA frontend on Azure Static Web Apps (trustmate), a Python Flask REST API backend on Azure App Service (TrustMateRestAPI), and relational scoring storage on Azure SQL Database (trust-mate-sql-server), instrumented with Application Insights and 6 Azure Monitor metric alert rules (HTTP errors, health check, failed DB connections, DTU %, data space usage, and CPU %) to guarantee availability during live experiments and feed CSV exports into Python nonparametric analysis and Power BI.",
        media: [
          {
            src: "../media/trustmate-cloud-arch.png",
            alt: "TrustMate Microsoft Azure cloud architecture diagram: Static Web Apps, App Service, Azure SQL, Application Insights, and downstream Python/Power BI analytics",
            caption: "TrustMate Azure cloud architecture (Static Web Apps, App Service, Azure SQL & Monitor)",
          },
          {
            src: "../media/trustmate-azure-portal.png",
            alt: "Microsoft Azure Portal showing deployed TrustMate resources: trustmate Static Web App, TrustMateRestAPI App Service, trust-mate-sql-server, Application Insights, and 6 metric alert rules",
            caption: "Microsoft Azure Portal: deployed TrustMate resources, Application Insights & 6 metric alerts",
          },
        ],
      },
      {
        id: "results-portal",
        category: "platforms",
        title: "Results portal",
        short:
          "Publishes UX findings as cards, a recommendations library, and a task timeline instead of a static PDF.",
        full:
          "A results portal that publishes UX findings as structured cards, a searchable recommendations library, and a task timeline—replacing static PDF handoffs with a living deliverable.",
        icon: "portal",
        media: [],
      },
      {
        id: "ai-training",
        category: "training",
        title: "AI tools & agents training",
        short:
          "Tutor for Digital Talent Academy; trained 100+ people (4.88 / 5) and led 2026 AI agent sessions.",
        full:
          "Tutor for Digital Talent Academy students. Delivered AI tools training for 100+ people with a 4.88 / 5 satisfaction score. In 2026, led eight sessions at Bosch with Felipe Oshiro and Gabriel Reis where participants learned AI concepts and applied them with agents.",
        media: [
          {
            src: "../media/ai-agents-sessions-2026.jpg",
            alt: "Bosch colleagues in the 2026 AI training sessions",
            caption: "Bosch AI sessions, 2026, with Felipe Oshiro and Gabriel Reis",
          },
        ],
      },
      {
        id: "talent-forum",
        category: "training",
        title: "Bosch Talent Forum (3rd place)",
        short:
          "Awarded Excel VBA project management tool based on the Project Model Canvas.",
        full:
          "Third place at the Bosch Campinas Talent Forum in September 2018, which recognizes the plant's best internship projects. Built an internal Excel VBA tool for project management based on the Project Model Canvas to help teams organize project information and reach their goals.",
        media: [
          {
            src: "../media/talent-forum-boss-2018.jpg",
            alt: "Eduardo Figueiredo receiving the third-place award at the Bosch Talent Forum with his boss, September 2018",
            caption: "3rd place, Bosch Talent Forum, Campinas, September 2018",
          },
        ],
      },
      {
        id: "international",
        category: "training",
        title: "International & cross-site workshops",
        short:
          "Two work trips to Germany (2024, 2025) and alignment workshops across Bosch sites.",
        full:
          "Two trips to Germany in 2024 and 2025 for role-related work, alongside cross-site workshops in Joinville and Campinas.",
        media: [
          {
            src: "../media/germany-2024.jpg",
            alt: "Germany workshop, 2024",
            caption: "Germany workshop, 2024",
          },
          {
            src: "../media/joinville-2024.jpg",
            alt: "Joinville workshop, 2024",
            caption: "Joinville workshop, 2024",
          },
          {
            src: "../media/bosch-building.jpg",
            alt: "Eduardo Figueiredo in front of the Bosch building",
            caption: "Bosch Brasil",
          },
        ],
      },
      {
        id: "presentations",
        category: "training",
        title: "UX & digital services roadshows",
        short:
          "Presented UX services, digital solution journeys, and software capabilities across Americas.",
        full:
          "Presented UX services to the GS UX team (2023), the GS/TET-LA digital solution journey to Purchasing (2022), Technology & Enabling services at GS Service Day (August 2022), and digital solutions & software development services in Buenos Aires, Argentina (August 2022).",
        media: [
          {
            src: "../media/ux-services-gs-2023.jpg",
            alt: "Eduardo Figueiredo presenting UX services to the GS team in 2023",
            caption: "UX services, GS, 2023",
          },
          {
            src: "../media/digital-journey-gs-tet-2022.jpg",
            alt: "Eduardo Figueiredo presenting the GS/TET-LA digital journey to a Purchasing team",
            caption: "Digital journey for Purchasing, GS/TET-LA, 2022",
          },
          {
            src: "../media/gs-service-day-2022.jpg",
            alt: "Eduardo Figueiredo at GS Service Day, August 2022",
            caption: "GS Service Day, Technology & Enabling, August 2022",
          },
          {
            src: "../media/buenos-aires-2022.jpg",
            alt: "Eduardo Figueiredo presenting services to a group in Buenos Aires, August 2022",
            caption: "Presenting our services in Buenos Aires, August 2022",
          },
        ],
      },
      {
        id: "cip-training",
        category: "training",
        title: "CIP fundamentals training",
        short:
          "Trained the Bosch Sorocaba HR team on Continuous Improvement macro and micro concepts.",
        full:
          "In August 2020, trained the HR team at the Bosch plant in Sorocaba on the fundamentals of Continuous Improvement, covering the macro and micro concepts of the CIP process.",
        media: [
          {
            src: "../media/cip-fundamentals-sorocaba-2020.jpg",
            alt: "Eduardo Figueiredo presenting CIP fundamentals to the HR team at Bosch Sorocaba, August 2020",
            caption: "CIP fundamentals for HR, Bosch Sorocaba, August 2020",
          },
        ],
      },
      {
        id: "co2-scouting",
        category: "platforms",
        title: "Project EcoTrace — Fleet Carbon Telemetry & Willingness-to-Pay Market Research",
        short:
          "Led 3 researchers in mixed-methods Willingness-to-Pay (WTP) research across 10 mobility/fleet segments, validating low standalone CO2 WTP (56.25%) and pivoting to Predictive Maintenance & Fuel Quality.",
        full:
          "Led a team of three researchers working on my behalf to execute mixed quantitative and qualitative market research for an already-built vehicle CO2 telemetry device across 10 B2B and public-sector segments (ride-hailing platforms, car rental fleets, public universities, municipal transport authorities, automotive workshop networks, and e-commerce/FMCG fleet operators). Evaluating Willingness to Pay (56.25% WTP index) and Importance vs. Current Solution Level across 9 telemetry features, we proved companies would not pay solely for CO2 tracking and pivoted product strategy toward Predictive Failure Maintenance, Fault Diagnosis, and Fuel Quality Detection.",
        media: [
          {
            src: "../media/projects/co2-telemetry-scouting.png",
            alt: "Project EcoTrace fleet carbon telemetry scouting concept",
            caption: "Project EcoTrace fleet carbon telemetry & market validation",
          },
        ],
      },
      {
        id: "ux-bootcamp",
        category: "training",
        title: "Project DesignIgnite — Enterprise Design Thinking & UX Maturity Bootcamps",
        short:
          "Two hands-on Design Thinking & UX bootcamps for Accounts Payable and Revenue Operations cohorts (CSI 4.9/5, NPS 9.6), producing formal audit evidence for UX Maturity Level 4.",
        full:
          "Designed and facilitated two intensive Design Thinking and applied UX research bootcamps tailored for the Accounts Payable & Procurement Operations and Revenue & Billing Operations service lines (excluding Financial Reporting). I delivered UX theory uniting the Double Diamond and Continuous Improvement cycles alongside hands-on workshops where participants built their own method boards and opportunity sticky-note matrices—creating formal audit evidence that enabled the Global Business Services unit to achieve UX Maturity Level 4 out of 5 before an internal auditor (CSI 4.9/5.0, NPS 9.6).",
        media: [
          {
            src: "../media/projects/ux-bootcamp__ux-bootcamp-framework-lecture.jpg",
            alt: "Presenting the integrated Double Diamond and Continuous Improvement UX framework during the bootcamp",
            caption: "Presenting the integrated Double Diamond and Continuous Improvement UX framework during the bootcamp",
          },
        ],
      },
      {
        id: "pd-calculator",
        category: "platforms",
        title: "Project EffortGauge — Automated UX Person-Day Calculator & Gantt Estimator",
        short:
          "Excel/VBA effort estimation tool mapping UX activities by complexity across 5 Design Thinking phases to auto-calculate Person-Days and generate Gantt charts.",
        full:
          "Developed an Excel/VBA project estimation tool in collaboration with UX researchers to standardize effort scoping across the practice. I mapped preparation, execution, and synthesis hours for every UX technique across 5 Design Thinking phases by complexity tier (Low, Medium, High, Exceptional), delivery mode, and quantity—automatically calculating daily capacity, total Person-Days, and generating a multi-week visual Gantt chart.",
        media: [
          {
            src: "../media/projects/pd-calculator__pd-calculator-gantt-output.png",
            alt: "Automated 6-week project Gantt chart dynamically generated from selected UX phases, techniques, and complexity levels",
            caption: "Automated 6-week project Gantt chart dynamically generated from selected UX phases, techniques, and complexity levels",
          },
        ],
      },
      {
        id: "recipient-manifest",
        category: "platforms",
        title: "Project ManifestGuard — Inbound Receiving Compliance & Fiscal Manifest UX Research",
        short:
          "End-to-end UX research for Inbound Logistics & Accounts Payable tackling R$ 1.32M+ in delayed fiscal manifest risk via KPIs, CSD matrix, survey, top 8 findings, and ideation.",
        full:
          "Led an end-to-end UX research project for the Accounts Payable & Inbound Logistics service line focused on the mandatory fiscal receiving manifest process. Because delayed manifest submissions by factory and office receivers caused payment blocks and over R$ 1.32M in out-of-deadline processing risk, I authored the KPI matrix, Question Zero, CSD Matrix, concentric Stakeholder Map, mixed-methods survey design, Top 8 empirical findings, and facilitated Value-vs-Complexity and Impact-vs-Feasibility prioritization workshops.",
        media: [
          {
            src: "../media/projects/recipient-manifest__manifest-ux-project-kpis.png",
            alt: "UX and Project KPI matrix targeting a 15% reduction in R$ 1.32M out-of-deadline processing volume",
            caption: "UX and Project KPI matrix targeting a 15% reduction in R$ 1.32M out-of-deadline processing volume and 60%+ manual usefulness",
          },
        ],
      },
      {
        id: "activity-handover",
        category: "platforms",
        title: "Project SmoothRelay — Employee Activity Handover & Knowledge Transfer Research",
        short:
          "Mixed-methods UX research (5/5 CSAT, 37 findings, 45 opportunities, 2 journeys) spanning academic/internal benchmarks, surveys, interviews, personas, journeys, and user testing.",
        full:
          "Conducted an end-to-end mixed-methods UX research investigation (5/5 CSAT, 37 top findings, 45 mapped opportunities, 2 user journeys) to make employee activity handovers seamless during departures, role transitions, and vacations. I executed an academic literature benchmark (Role Competency Matrix), external and internal benchmarks, stakeholder map and KPIs (targeting 33–50% faster handovers and 67% fewer unplanned transitions), quantitative surveys and qualitative interviews with sentiment analysis, personas (Denise & Pedro), As-Is (Maria) and To-Be storyboarded journeys, and user testing of the redesigned checklist.",
        media: [
          {
            src: "../media/projects/activity-handover__handover-executive-overview.png",
            alt: "Executive project overview one-pager highlighting 5/5 CSAT, 37 top findings, and 45 mapped opportunities",
            caption: "Executive project overview one-pager highlighting 5/5 CSAT, 37 top findings, 45 mapped opportunities, and learning organization strategy",
          },
        ],
      },
      {
        id: "cf-automation",
        category: "platforms",
        title: "Project ForecastFlow — Financial Current Forecast (CF) Automation & End-to-End UX",
        short:
          "End-to-end UX research, Controller & Buyer personas, As-Is/To-Be user journeys, and 5-screen interactive wireframes cutting forecast cycle time by 42% and boosting accuracy by 80%.",
        full:
          "Executed all UX research and design deliverables for Financial Current Forecast (CF) Automation, replacing the manual coordination of 19 spreadsheets/systems across 11 teams and 36 file interactions. I delivered UX discovery, top findings, Controller and Buyer personas, As-Is and To-Be user journeys (specifically internal employee user journeys), and 5 interactive wireframe screens (Kanban board, milestone timeline, consolidated forecast table, macroeconomic premises, and template upload/risk warning)—reducing operational time by 42% (40h to 28h) and improving accuracy by 80%.",
        media: [
          {
            src: "../media/projects/cf-automation__cf-executive-impact-summary.png",
            alt: "Executive impact one-pager summarizing 42% operational time reduction and 80% accuracy gain",
            caption: "Executive impact one-pager summarizing 42% operational time reduction, 80% accuracy gain, 4/5 user satisfaction, and business drivers",
          },
        ],
      },
      {
        id: "b-travel",
        category: "platforms",
        title: "Project TripFlow — Corporate Travel-to-Expense (T2E) UX Research & Journey Mapping",
        short:
          "Cross-country UX research across Spain and Portugal analyzing corporate Travel-to-Expense pain points across 13 subcategories, survey keyword cloud, persona, and an 8-moment User Journey with 24 opportunities.",
        full:
          "Conducted cross-country mixed-methods UX research across Iberian operations (Spain and Portugal) investigating friction in the corporate Travel-to-Expense (T2E) booking and reimbursement lifecycle. Combining qualitative interviews, quantitative pain-point categorization across 13 subcategories, survey keyword-convergence analysis (25% convergence on post-trip expense and receipt friction), Travel Coordinator persona definition (Ana Vitória), and an 8-moment User Journey across Pre-Trip, On-Trip, and Post-Trip, I mapped 24 digital improvement opportunities.",
        media: [
          {
            src: "../media/projects/b-travel__btravel-end-to-end-journey-map.png",
            alt: "End-to-end Travel-to-Expense User Journey Map across 8 moments",
            caption: "End-to-end Travel-to-Expense User Journey Map across 8 moments (Pre-Trip, On-Trip, Post-Trip) charting emotional curve and 24 opportunities",
          },
        ],
      },
      {
        id: "workspace-efficiency",
        category: "personal",
        title: "Workspace setup for efficiency",
        short:
          "Ergonomic hardware, split keyboard macros, and tooling setup engineered for high efficiency.",
        full:
          "Custom workspace setup combining hardware, split keyboard macro workflows, and productivity tooling designed for sustained focus and high-throughput delivery.",
        media: [
          {
            src: "../media/workspace-efficiency.jpg",
            alt: "Workspace setup of tools and hardware for high efficiency",
            caption: "Workspace setup for efficiency",
          },
        ],
      },
      {
        id: "home-management-system",
        category: "personal",
        title: "Home — First Home & Renovation Management System",
        short:
          "Local web app managing my first home purchase and renovation: executive dashboard, 76-item multi-quote expense tracker, interactive 3D floor plan, and full Gantt schedule.",
        full:
          "Built a local web system to plan and manage the purchase and renovation of my first home. It brings together four integrated views: (1) an executive Dashboard combining a macro Gantt timeline, quick tasks, and budget coverage; (2) an Expenses workspace with 76 categorized items, multi-supplier price quotations, and median cost tracking; (3) an interactive 3D floor plan viewer to inspect rooms and layout; and (4) a full macro/micro Gantt schedule with task dependencies, per-activity costs, and PDF/JSON export.",
        media: [
          {
            src: "../media/projects/home-dashboard.png",
            alt: "Home management system executive dashboard with macro Gantt, quick tasks, and budget overview",
            caption: "Executive Dashboard: macro timeline, quick tasks & budget overview",
          },
          {
            src: "../media/projects/home-expenses.png",
            alt: "Home expenses workspace with 76 categorized items and multi-supplier quotations",
            caption: "Expenses & Quotations: 76 categorized items with supplier medians",
          },
          {
            src: "../media/projects/home-gantt.png",
            alt: "Full Gantt schedule with macro and micro activities, costs, and timeline scale",
            caption: "Full Gantt Schedule: phased activities, costs & PDF/JSON export",
          },
          {
            src: "../media/projects/home-3d-model.png",
            alt: "Interactive 3D floor plan model of the house with room labels",
            caption: "Interactive 3D Floor Plan: room layout & renovation visualization",
          },
        ],
      },
      {
        id: "memorization-book",
        category: "personal",
        title: "Memorize with AI (Book in Progress)",
        short:
          "Book in progress combining memory-palace techniques with AI-assisted mnemonic workflows for exams and deep learning.",
        full:
          "An ongoing book project ('Memorize com IA, passe na prova, pense melhor') structured into 4 parts. It pairs classic spatial memory methods (real-world memory palaces, visual associations, micro-loci) with an AI-assisted mnemonic generation workflow for exam preparation and long-term retention.",
        media: [
          {
            src: "../media/projects/memorization-book-cover.png",
            alt: "Hardcover concept for the book Memorize com IA, passe na prova, pense melhor by Eduardo Figueiredo",
            caption: "Book concept & working title — structured in 4 parts",
          },
        ],
      },
      {
        id: "my-python-scripts",
        category: "personal",
        title: "My-Python-Scripts (Automation & Media Toolkit)",
        short:
          "Reusable Python CLI and AI-assisted scripts for CSV-to-Gantt timelines, audio transcription, RealESRGAN image upscaling/de-haloing, and PPTX/PDF generation.",
        full:
          "A personal collection of single-purpose Python utilities built to automate recurring data, media, and reporting tasks—including CSV-to-Gantt chart generation (timeline-gantt), batch audio transcription and processing (transcription), AI image super-resolution and de-haloing (image-upscale, image-dehalo-upscale), verbatim CSV checks (verbatting-check), and programmatic PowerPoint/PDF creation (generate-pptx, generate-image, pdf-merge).",
        media: [
          {
            src: "../media/projects/my-python-scripts-showcase.png",
            alt: "Overview card of My-Python-Scripts automation toolkit across data, audio transcription, vision, and document generation",
            caption: "My-Python-Scripts: Data, Transcription, Vision & Reporting Toolkit",
          },
        ],
      },
      {
        id: "daily-automation-suite",
        category: "personal",
        title: "Daily Automation & Productivity Suite (AutoHotkey v2 + UIA + Python IPC)",
        short:
          "Personal daily-driver automation toolkit unifying resilient UI Automation (UIA-v2), AI-to-IDE bridges, multi-monitor window management, context-aware cheat sheets across 30+ apps, and Python IPC daemons.",
        full:
          "Built and maintain a modular AutoHotkey v2 + Python IPC automation suite used every day to boost speed and reduce cognitive load. Key capabilities include: (1) cross-app UI Automation bridges (Gemini/AI-to-IDE handoffs, Microsoft Teams mic/camera state verification, Outlook & WhatsApp helpers); (2) instant context-aware shortcut cheat sheets across 30+ apps (Power BI, Excel, Cursor, VS Code, Chrome, Figma); (3) multi-monitor window snapping, cursor halo, and Pomodoro tracking; and (4) optional Named-Pipe/MMF Python IPC daemons with bounded timeouts and fail-safe overlays.",
        media: [
          {
            src: "../media/projects/daily-automation-scripts-showcase.png",
            alt: "Overview card of the Daily Automation & Productivity Suite covering AI bridges, context cheat sheets, window management, and Python IPC",
            caption: "Daily Automation Suite: UIA-v2, Context Cheat Sheets, Window Flow & Python IPC",
          },
        ],
      },
      {
        id: "proj-vba-suite",
        category: "platforms",
        title: "Proj. — Excel/VBA Project Management Application (Budapest)",
        short:
          "Built in Budapest: full Excel/VBA suite digitalizing project management with Project Model Canvas, automated WBS tree, Planned-vs-Actual Gantt schedule, A3 reports, and OTD/FPY tracking.",
        full:
          "Created while working in Budapest to digitalize end-to-end project management inside Excel/VBA. The application unifies Project Model Canvas (interactive sticky-note planning for justification, SMART objectives, stakeholders, risks, and costs), an automated Work Breakdown Structure (WBS) tree generator, a Planned-vs-Actual Gantt Schedule with completion tracking, A3 problem-solving reports, 5-phase PM documentation workflows (Project Request, Charter, Risk, PM-QG Checklist, Lessons Learned), baseline snapshots, and OTD & FPY metrics.",
        media: [
          {
            src: "../media/projects/proj-main-menu.png",
            alt: "Proj. v4.1 Excel/VBA main menu with Project Model Canvas, WBS, Schedule, A3 Create, Baseline, and OTD&FPY",
            caption: "Main Hub (Proj. v4.1): Canvas, WBS, Schedule, A3 & OTD/FPY",
          },
          {
            src: "../media/projects/proj-project-model-canvas.png",
            alt: "Project Model Canvas built in Excel/VBA with sticky-note blocks for justification, objectives, risks, and costs",
            caption: "Project Model Canvas: visual sticky-note planning in Excel",
          },
          {
            src: "../media/projects/proj-wbs.png",
            alt: "Automated Work Breakdown Structure (WBS) tree generated in Excel/VBA",
            caption: "Automated WBS: hierarchical work breakdown tree",
          },
          {
            src: "../media/projects/proj-schedule-gantt.png",
            alt: "Automated Schedule and Gantt chart comparing Planned vs. Actual dates and completion percentage",
            caption: "Automated Schedule & Gantt: Planned vs. Actual tracking",
          },
          {
            src: "../media/projects/proj-a3-report.png",
            alt: "Structured A3 report template linked to Project Model Canvas fields",
            caption: "A3 Report: Problem Definition, Actual/Future State & Action Plan",
          },
          {
            src: "../media/projects/proj-documentation-flow.png",
            alt: "5-phase Project Management documentation hub covering Request, Charter, WBS, Risk, PM-QG, and Closure",
            caption: "5-Phase PM Documentation Hub & Change Request tracking",
          },
          {
            src: "../media/projects/proj-request-form.png",
            alt: "VBA Project Request UserForm with metadata, multi-currency (BRL/EUR/USD/HUF), and scope inputs",
            caption: "VBA Project Request Form: structured intake & multi-currency",
          },
        ],
      },
    ],
    researchTitle: "Trust in AI and interfaces",
    research: [
      "The master's dissertation asks whether AI agents can stand in for humans when scoring perceived trust on e-commerce interfaces. The model is ITQM / MQCI, rooted in ISO/IEC 25000. TrustMate collects the questionnaire and scores Usability, Accessibility, and UX.",
      "ChatGPT o3 agents were compared with 127 IT students on three sites. Agents do not replace human evaluation. They are a useful automated triage: directional alignment on the top and bottom attributes, and a stricter bias on most leaf scores.",
    ],
    researchItems: [
      "Shapiro-Wilk on attribute scores before inferential tests.",
      "Python computed Welch (human vs AI), paired t-tests (human vs human), and independent t-tests (AI vs AI), with Cohen's d and Benjamini-Hochberg FDR.",
      "Results went into Power BI: mean, SD, variance, standard error, confidence intervals, and more than 50 chart structures.",
    ],
    researchTail: [
      "Published at ISSRE 2025 (HFSD Workshop) and IHC 2025 (SBC SOL).",
      "InfoVis coursework at Unicamp (grade A) used PNAD Contínua in Power BI: Sankey, choropleth, and faceted views of education and employment.",
    ],
    infovisCap: "Visual structures from the InfoVis course",
    infovis: "../media/infovis-structures.png",
    scoresTitle: "CSI and NPS, 2024–2025",
    scoresLead: "Averages across these projects: CSI 4.86, NPS 9.94.",
    scoresHint: "Select a column to sort.",
    sortProject: "Project",
    na: "N/A",
    interestsTitle: "What I do outside the job",
    interestsLead:
      "At home: my dog Moka, my two cats Baby and Faísca, learning piano, and a split keyboard I use for macros.",
    interests: [
      "Piano",
      "Linguistics",
      "Physics",
      "Impressionist art",
      "Macros and keyboards",
    ],
    interestCaps: [
      "Baby during piano practice at home",
      "Faísca on my split keyboard and macros",
      "Me and my dog Moka",
    ],
    booksHallTitle: "Reading Hall",
    booksHallLead:
      "A few books that shaped how I think about data, design, memory, and decision-making. Click any cover to read a quick takeaway.",
    contactTitle: "Let's connect",
    contactLead:
      "I bring applied research, technology, and project delivery. What I care about is work people can trust and use, with clear data and results you can measure.",
    pdfButton: "Download PDF",
    contactFine: "The PDF button saves a print-ready copy of this portfolio.",
    customizePortfolio: "Customize",
    customizeModalTitle: "Customize Portfolio",
    customizeSubtitle: "Select which chapters to include in your portfolio and exported PDF:",
    selectAll: "Select All",
    resetSelection: "Reset",
    downloadCustomPdf: "Download PDF",
    closeCustomizer: "Done",
    viewerClose: "Close",
    langLabel: "Language",
    facts: [
      [
        "International",
        "Two trips to Germany, in 2024 and 2025, for role-related work.",
      ],
      [
        "CO2 tracking",
        "Marketing scouting for CO2 telemetry at GS. Finding: lack of market demand.",
      ],
      [
        "Tooling, PT",
        "Led technical delivery and project management from requirements through high-fidelity prototypes, with regular customer check-ins.",
      ],
      [
        "UX maturity",
        "Led the Americas to Level 4: governance, templates, training.",
      ],
      [
        "UX services",
        "In 2023 I presented our UX services to the GS UX team. Heading toward remarkable experiences. Each interaction shapes the path to a more human and engaging design. Grateful for the welcome from the team and for a productive week with neighboring areas.",
      ],
      [
        "Digital journey",
        "I presented the GS/TET-LA digital solution journey to a Purchasing customer team.",
      ],
      [
        "Service Day",
        "At GS Service Day in August 2022 I presented our technology and enabling services for the business unit.",
      ],
      [
        "Buenos Aires",
        "In August 2022 I presented our digital solutions and software development services in Buenos Aires, Argentina.",
      ],
      [
        "Talent Forum",
        "Third place at the Bosch Campinas Talent Forum in September 2018. The forum recognizes the plant's best internship projects. The awarded work was an internal Excel VBA tool for project management, based on the Project Model Canvas. It helped teams organize project information and reach their goals.",
      ],
      [
        "CIP training",
        "In August 2020 I trained the HR team at the Bosch plant in Sorocaba on the fundamentals of Continuous Improvement, covering the macro and micro concepts of the CIP process.",
      ],
      [
        "CIP dashboards",
        "With the UX team, evaluated strategic CIP dashboards for GS initiatives so leadership could spot main issues and efficiency gains. UX relevance in ServiceNow uses property-based weights.",
      ],
      [
        "Teaching",
        "Tutor for Digital Talent Academy students. AI tools training for 100+ people, satisfaction 4.88 / 5. In 2026, eight sessions at Bosch with Felipe Oshiro and Gabriel Reis: the group learned AI terms and applied them with agents.",
      ],
    ],
    presentCaps: [
      "Bosch Brasil",
      "Germany workshop, 2024",
      "Joinville workshop, 2024",
      "Applied Research, GS",
      "UX services, GS, 2023",
      "Digital journey for Purchasing, GS/TET-LA, 2022",
      "GS Service Day, Technology & Enabling, August 2022",
      "Presenting our services in Buenos Aires, August 2022",
      "3rd place, Bosch Talent Forum, Campinas, September 2018, with my boss at the time",
      "CIP fundamentals for HR, Bosch Sorocaba, August 2020",
      "Tooling project, PT",
      "Delivery report for my research",
      "Power BI, allocation",
      "Power BI, training",
      "Bosch AI sessions, 2026, with Felipe Oshiro and Gabriel Reis",
    ],
    researchCaps: [
      "Dissertation charts in Python and Power BI",
      "TrustMate, the web application",
      "TrustMate, Power BI",
      "AI and human scores",
      "Published article",
      "IHC 2025",
      "ISSRE 2025, HFSD",
      "PNAD Contínua, Power BI",
    ],
    stops: [
      {
        text: "Campinas, 2018. Team recognition with Bosch.",
        src: "../media/bosch-2018.jpg",
        alt: "Eduardo Figueiredo with the Bosch team in Campinas, 2018",
        diagram: false,
      },
      {
        text: "Hungary, 2019, with the Budapest team.",
        src: "../media/budapest-2019.jpg",
        alt: "Bosch team in Budapest, 2019",
        diagram: false,
      },
      {
        text: "The condensed path: Campinas, Hungary, Sorocaba, then Campinas again.",
        src: "../media/timeline.png",
        alt: "Experience timeline across Bosch locations",
        diagram: true,
      },
      {
        text: "Back in Campinas. Germany workshops in 2024 and 2025, and the Americas team in 2025.",
        src: "../media/americas-2025.jpg",
        alt: "Americas team, 2025",
        diagram: false,
      },
    ],
  },
  pt: {
    chapters: {
      why: "Por quê",
      foundations: "Formação",
      path: "Trajetória",
      present: "Presente",
      deliverables: "Entregas",
      model: "Modelo",
      research: "Pesquisa",
      scores: "Resultados",
      next: "Próximo",
      interests: "Interesses",
      contact: "Contato",
    },
    skip: "Ir para a história",
    foundationsTitle: "Formação acadêmica",
    foundationsLead:
      "Escola técnica na ETEC Bento Quirino, depois a Unicamp. Nota A em todas as disciplinas do mestrado. Proficiência em inglês comprovada. Português nativo; inglês fluente (sotaque General American, com destaque em fonética).",
    trait0: "Proativo",
    trait1: "Autônomo",
    trait2: "Organizado",
    academicCap: "Escrita acadêmica, Unicamp",
    ftCap:
      "Graduação em Análise e Desenvolvimento de Sistemas, Faculdade de Tecnologia, Unicamp, com colegas",
    tccCap: "Defesa do TCC do curso técnico, ETEC Bento Quirino",
    tccDelivery: "Rede social interna, feita como aplicação web",
    ftDelivery:
      "Aplicação web para atividades estudantis, com gestão tradicional de projetos",
    thesisDelivery:
      "Dissertação de mestrado sobre confiança percebida, com o TrustMate",
    gradeSticker: "Melhor nota em todas as disciplinas",
    degreesTitle: "Diplomas Universitários e Registros Oficiais",
    degreesLead:
      "Diplomas oficiais da Unicamp com anverso cerimonial e verso com registro DAC, chaves de autenticação digital e assinaturas da reitoria.",
    capMestradoFrente:
      "Mestrado em Tecnologia – Sistemas de Informação e Comunicação (Unicamp, 2026)",
    capMestradoVerso:
      "Verso do Diploma de Mestrado – Registro DAC RD-057530 e Chave de Autenticação Digital",
    capGraduacaoFrente:
      "Graduação – Tecnólogo em Análise e Desenvolvimento de Sistemas (Unicamp, 2020)",
    capGraduacaoVerso:
      "Verso do Diploma de Graduação – Registro DAC RD-026702 e Chave de Autenticação Digital",
    internCap0: "Começando como estagiário na Bosch Campinas, com os colegas",
    internCap1: "O grupo de estagiários na Bosch Campinas, quando comecei",
    pathTitle: "Bosch, lugar por lugar",
    pathLead:
      "A trajetória passa por unidades Bosch: Campinas, Hungria, Sorocaba e Campinas de novo.",
    pathCap2018: "Campinas, 2018. Reconhecimento de equipe na Bosch.",
    pathCapHungary: "Hungria, 2019, com o time de Budapeste.",
    pathCapDev: "Com o time de desenvolvimento, 2020 a 2022.",
    pathCapReturn:
      "De volta a Campinas. Workshops na Alemanha em 2024 e 2025, e o time das Américas em 2025.",
    stop0: "Campinas",
    stop1: "Hungria",
    story: "../media/story-flow-pt.png",
    storyAlt: "Fundamentos passados, impacto presente e direções futuras",
    relevance: "../media/relevance-pt.png",
    relevanceAlt:
      "Modelo de relevância da pesquisa aplicada: campos do CIM, prioridade, depois Baixa, Média ou Alta",
    storyCap: "Passado, presente e o que vem depois",
    pathCap: "Como o próximo passo se desenha",
    deliverablesTitle: "Entregas",
    deliverablesLead: "Estas são as peças que entreguei.",
    uxTitle: "UX Super",
    uxLead:
      "Um portal para a prática de UX. Guarda cada negócio com ofertas, personas e oportunidades, e acompanha KPIs do projeto de uma linha de base até a meta.",
    uxCapBusinesses: "UX Super, negócios",
    uxCapKpis: "UX Super, KPIs do projeto",
    deliverable0:
      "Tooling para Power Tools, dos requisitos aos protótipos de alta fidelidade.",
    deliverable1:
      "Relatório de pesquisa CIP e o modelo de relevância usado no ServiceNow.",
    deliverable2: "Power BI para alocação, treinamento e o estudo TrustMate.",
    deliverable3:
      "Um portal de resultados que publica achados de UX em cartões, uma biblioteca de recomendações e uma linha do tempo de tarefas, em vez de um PDF estático.",
    appsTitle: "Aplicativos pessoais",
    appsLead:
      "Ferramentas que construí para o meu próprio uso: um quadro de tarefas, um cockpit financeiro e um app web pessoal de estudos.",
    appsCapTasks: "Tarefas, quadro pessoal",
    appsCapFinance: "Cockpit financeiro, orçamentos e gastos",
    modelTitle: "Modelo de relevância",
    modelLead:
      "Construí um modelo para avaliar a relevância de pesquisa aplicada em iniciativas CIP. Campos do CIM (ServiceNow) entram por prioridade. O resultado é Baixa, Média ou Alta, uma triagem de quando a pesquisa precisa ir mais fundo. Python executa o pipeline em dados no formato do CIM.",
    modelSample: "Amostra de 35 projetos",
    modelCap: "Modelo de relevância para iniciativas CIP",
    bars: ["Baixa", "Média", "Alta"],
    deliverablesHint: "Clique em qualquer entrega para expandir os detalhes e imagens.",
    privacyDisclaimer:
      "Todas as imagens são anonimizadas para respeitar a privacidade dos dados do projeto.",
    featuredCaseStudy: {
      badge: "Caso em Destaque · Pesquisa × Dados × Product Ownership",
      title: "Projeto BeaconTower — Portal de Prática UX & Service Blueprint",
      lead:
        "Este projeto reúne o melhor do meu trabalho: liderar uma equipe de 3 pesquisadores em mais de 20 entrevistas, mais de 4 grupos focais e survey global para alinhar stakeholders com dados empíricos, atuando como Product Owner na construção de uma solução real.",
      pillars: [
        {
          label: "01 · Liderança em Pesquisa & Stakeholders",
          text: "Atuei como Research Lead orientando outros 3 pesquisadores em mais de 20 entrevistas com stakeholders e mais de 4 sessões de grupos focais, além de survey global, matriz de codificação, mapeamento concêntrico e service blueprint as-is expondo planilhas paralelas de 240 linhas.",
        },
        {
          label: "02 · Dados & Evidência Quantitativa",
          text: "Combinei os dados do survey com avaliação heurística de 8 telas centrais (33 falhas quantificadas) e acompanhamento de KPIs da linha de base à meta.",
        },
        {
          label: "03 · Product Ownership & Solução",
          text: "Construí o portal PracticeHub (ofertas, personas, oportunidades e KPIs) e estruturei a governança com economia projetada de 150 mil EUR/trimestre e 240h/mês.",
        },
      ],
    },
    deliverableCategories: [
      { id: "platforms", title: "Produtos, Plataformas e Governança" },
      { id: "data", title: "Dados, Analytics e Modelos" },
      { id: "training", title: "Treinamentos, Workshops e Apresentações" },
      { id: "personal", title: "Apps Pessoais e Produtividade" },
    ],
    deliverablesItems: [
      {
        id: "astra",
        category: "platforms",
        title: "Projeto Astra (AgriTech IoT e Telemetria Bovina)",
        short:
          "Etnografia em 3 fazendas de gado de elite, benchmark na Agrishow, validação de PMF em 6 dimensões e requisitos de MVP.",
        full:
          "No projeto Astra (telemetria pecuária AgriTech na Bosch), conduzi pesquisa de campo completa para resolver gargalos operacionais na pecuária de elite e transformar evidências qualitativas em estratégia de produto de hardware e software. O trabalho incluiu etnografia in loco e entrevistas semiestruturadas em 3 fazendas de gado de elite (como a Fazenda Sindi da Porangaba), benchmarking competitivo na feira Agrishow Brasil em Ribeirão Preto e prospecção de parcerias em medicamentos veterinários. Entreguei o relatório formal definindo personas duplas (Pecuarista Premium vs. Peão de Fazenda), jornada atual com 10 dores operacionais, jornada futura com 10 soluções IoT, validação de Product-Market Fit (PMF) em 6 dimensões ('GO para piloto direcionado') e especificação de MVP com métricas do piloto.",
        media: [
          {
            src: "../media/astra-iot-device.jpg",
            alt: "Avaliação de hardware e dispositivo IoT de telemetria Bosch Astra em campo",
            caption: "Dispositivo e avaliação de hardware IoT HerdSense",
          },
          {
            src: "../media/astra-current-journey.png",
            alt: "Mapa da jornada atual e 10 dores operacionais do projeto Astra",
            caption: "Jornada atual e mapa de 10 dores operacionais",
          },
          {
            src: "../media/astra-mvp-requirements.png",
            alt: "Requisitos de MVP e métricas de sucesso do piloto do projeto Astra",
            caption: "Requisitos de MVP e métricas de sucesso do piloto",
          },
        ],
      },
      {
        id: "x-tower",
        category: "platforms",
        title: "Projeto BeaconTower — Portal da Prática de UX & Service Blueprint",
        short:
          "Descoberta de UX e arquitetura ponta a ponta: benchmark de 8 ferramentas, avaliação heurística de 11 telas + 103 observações em manuais, Grounded Theory, 5 personas e blueprint economizando 150 mil EUR/trimestre e 240h/mês.",
        full:
          "Desenvolvi o portal PracticeHub e liderei uma equipe de três pesquisadores em meu nome na pesquisa de UX e arquitetura da informação ponta a ponta da plataforma corporativa BeaconTower. Elaborei o briefing de 57,5 pessoas-dia (460h), matriz de perguntas-hipóteses-evidências, benchmark de 8 ferramentas (16 telas, 17 critérios), 5 personas empíricas e 7 perfis de stakeholders, moderei 4 grupos focais inter-regionais, construí painel de codificação aberta e axial em Grounded Theory Straussiana, executei avaliação heurística em 11 telas e auditoria de 103 observações em 12 páginas de manuais, definindo a arquitetura alvo—projetando economia de 150 mil EUR/trimestre e 240h/mês.",
        media: [
          {
            src: "../media/x-tower-summary.png",
            alt: "Resumo executivo do BeaconTower e scorecards de KPIs (linha de base vs. meta)",
            caption: "Resumo executivo do BeaconTower e scorecards de KPIs (linha de base vs. meta)",
          },
          {
            src: "../media/x-tower-ecosystem.png",
            alt: "Mapa do ecossistema BeaconTower entre módulos, liderança e operações corporativas",
            caption: "Mapa de ecossistema BeaconTower",
          },
          {
            src: "../media/x-tower-as-is-journey.png",
            alt: "Service blueprint da jornada atual do X-Tower em User, Frontstage, Backstage e Support",
            caption: "Service blueprint da jornada atual (as-is)",
          },
          {
            src: "../media/x-tower-stakeholders.png",
            alt: "Mapa concêntrico de stakeholders do X-Tower com Core team, Core user, diretos e indiretos",
            caption: "Mapa de proximidade de stakeholders",
          },
          {
            src: "../media/x-tower-plan.png",
            alt: "Cronograma em 5 fases do plano de pesquisa e design UX do X-Tower",
            caption: "Plano de pesquisa UX em 5 fases",
          },
          {
            src: "../media/x-tower-survey.png",
            alt: "Convite de survey no Microsoft Forms e mapeamento de insights do X-Tower",
            caption: "Survey com stakeholders e mapeamento de insights",
          },
          {
            src: "../media/x-tower-interviews.png",
            alt: "Matriz de codificação de entrevistas entre participantes do X-Tower",
            caption: "Matriz de codificação de entrevistas",
          },
          {
            src: "../media/ux-super-kpis.jpg",
            alt: "KPIs de projeto no UX Super, com linha de base e meta",
            caption: "Portal de Prática UX: KPIs de projeto (linha de base e meta)",
          },
        ],
      },
      {
        id: "rise-automation",
        category: "platforms",
        title: "Protótipo SO Automação (Rise)",
        short:
          "Protótipo de wireframe para painel de cadastro, governança e horas economizadas por automações.",
        full:
          "Desenvolvimento do protótipo de wireframe do Dashboard SO Automação para padronizar o cadastro, responsabilidade, datas de go-live e medição de horas economizadas por mês (como extração de relatórios SAP e onboarding no RH).",
        media: [
          {
            src: "../media/rise-so-automacao.png",
            alt: "Protótipo de wireframe do Dashboard SO Automação e formulário de cadastro",
            caption: "FlowPulse — Protótipo de wireframe de entrada de automação",
          },
        ],
      },
      {
        id: "data-insights",
        category: "data",
        title: "Data Insights (CX Power Tools)",
        short:
          "Análise qualitativa com Teoria Fundamentada em transcrições de call center via Python, IA e Power BI.",
        full:
          "Análise de Customer Experience no segmento de power tools a partir de transcrições não estruturadas de call center. Aplicação de Teoria Fundamentada (codificação aberta e axial de Strauss e Corbin) com Python e codificação assistida por IA, sintetizando fases da jornada, condições causais e estratégias em Power BI.",
        media: [
          {
            src: "../media/data-insights-powerbi.png",
            alt: "Relatório em Power BI de Teoria Fundamentada para CX mostrando jornada, atrito com boleto e condições causais",
            caption: "VoiceLens — Síntese em Power BI com Teoria Fundamentada",
          },
          {
            src: "../media/data-insights-funnel.png",
            alt: "Funil de evidências ao insight: 10 transcrições de áudio gerando 242 evidências e 7 insights",
            caption: "Funil de evidências ao insight: 10 transcrições → 242 evidências → 7 insights",
          },
          {
            src: "../media/data-insights-summary.png",
            alt: "Visão geral dos 7 insights de CX com nível de risco, contagem de evidências e verbatims",
            caption: "Visão geral dos 7 insights de CX e níveis de risco",
          },
          {
            src: "../media/data-insights-journey.png",
            alt: "Mapa da jornada do cliente em 5 fases com base nas evidências QMAI",
            caption: "VoiceLens — Mapeamento da jornada do cliente",
          },
        ],
      },
      {
        id: "cim-journey",
        category: "data",
        title: "Jornada CIM e Síntese de Evidências",
        short:
          "Síntese em Power BI de 1.045 unidades de evidência de pesquisa CIM em insights executivos.",
        full:
          "Síntese de 1.045 unidades de evidência qualitativa e operacional da pesquisa CIM por CSD, alavancas de intervenção, temas, riscos e métricas de sucesso no Power BI, gerando cards executivos sobre visibilidade de reporting e padronização de dados.",
        media: [
          {
            src: "../media/cim-journey-dashboard.png",
            alt: "Dashboard Power BI analisando 1.045 evidências CIM por CSD, alavanca, tema, risco e métrica",
            caption: "SignalMap — Dashboard de síntese de evidências (1.045 unidades)",
          },
          {
            src: "../media/cim-journey-insight-1.png",
            alt: "Slide Insight 1: evidências de maior relevância convergem para reporting e visibilidade",
            caption: "Insight 1: Convergência em reporting e visibilidade",
          },
          {
            src: "../media/cim-journey-insight-2.png",
            alt: "Slide Insight 2: foco em qualidade de dados, consistência e padronização",
            caption: "Insight 2: Qualidade de dados e padronização",
          },
        ],
      },
      {
        id: "relevance-model",
        category: "data",
        title: "Projeto PulseGate — Unificação de UX, Melhoria Contínua e Automação",
        short:
          "Unificação de UX, Melhoria Contínua e Automação em 4.000+ iniciativas: melhorias no Ideation Lab e Workshop de Automação Digital, mapa de 10 riscos e pontuação automática (r ≈ -0,84).",
        full:
          "Conduzi duas frentes integrando UX e Melhoria Contínua (CIP): (1) Aprimoramento da plataforma Ideation Lab de IA/automação em 5 etapas e evolução do Workshop de Automação Digital com sessão True North, template padronizado de mapeamento de processos, matriz SWOT e gates pós-workshop de desejabilidade, viabilidade e exequibilidade; (2) Unificação de UX, CIP e Automação em um fluxo único para 4.000+ iniciativas globais (2.500+ na América Latina), elaborando mapa de 10 riscos (probabilidade vs. impacto) e comparando estatisticamente campos da plataforma CIP com critérios de UX via coordenadas paralelas (r ≈ -0,84) para automatizar a pontuação de relevância.",
        metrics: {
          sample: "Amostra de 35 projetos",
          bars: [
            { label: "Baixa", pct: 40.0 },
            { label: "Média", pct: 37.1 },
            { label: "Alta", pct: 22.9 },
          ],
        },
        media: [
          {
            src: "../media/relevance-pt.png",
            alt: "Modelo de relevância de pesquisa aplicada: campos do CIM, prioridade e classificação Baixa, Média ou Alta",
            caption: "Modelo de relevância para iniciativas CIP",
          },
          {
            src: "../media/ux-relevance-flow.png",
            alt: "Fluxo no ServiceNow CIM com portão de qualidade UX, triagem com IA e rede de UX champions",
            caption: "PulseGate — Portão de qualidade UX e fluxo de relevância no ServiceNow",
          },
          {
            src: "../media/ux-relevance-wireframe.png",
            alt: "Wireframe do método rápido de relevância UX (V1 e V2)",
            caption: "Wireframe do UX Relevance Quick Method (V1 e V2)",
          },
          {
            src: "../media/ux-relevance-scoring.png",
            alt: "Fluxograma de preenchimento automático via CIM, normalização e faixas Baixa/Média/Alta",
            caption: "Algoritmo de pontuação e faixas Baixa/Média/Alta",
          },
        ],
      },
      {
        id: "tooling-pt",
        category: "platforms",
        title: "Tooling, Power Tools",
        short:
          "Entrega técnica e gestão de projeto dos requisitos aos protótipos de alta fidelidade.",
        full:
          "Liderança da entrega técnica e gestão de projeto para Power Tools (EXT_M-PUR36 Tooling), dos requisitos aos protótipos de alta fidelidade, com alinhamentos regulares com o cliente (CSI 5,0, NPS 10).",
        media: [
          {
            src: "../media/projects/tooling-pt__tooling-1.png",
            alt: "Wireframe e Arquitetura de Informação",
            caption: "Wireframe e Arquitetura de Informação",
          },
        ],
      },
      {
        id: "power-bi",
        category: "data",
        title: "Projeto MaturityPulse — Gestão Regional de Projetos de UX, Auditoria de Maturidade & Governança",
        short:
          "Gestão de Projetos de UX na América Latina, templates padronizados, fluxos em plataforma estratégica e dashboards Power BI elevando a maturidade regional de 2,96 para 3,96/4,00 (Nível 4/5).",
        full:
          "Atuando como Gerente de Projetos apoiando equipes de UX na América Latina, organizei templates padronizados de documentação, orientei times na aplicação de ferramentas de gestão na plataforma corporativa de execução estratégica e monitorei o uso de UX reportado pelas unidades regionais com dashboards automatizados de auditoria em Power BI (conectados ao Microsoft Lists). Garantindo a documentação de achados, hubs de feedback e workshops nos 17 critérios de auditoria, elevei a maturidade regional de 2,96 para 3,96/4,00, conquistando o Nível 4 de 5.",
        media: [
          {
            src: "../media/pbi-allocation.jpg",
            alt: "Dashboard Power BI de auditoria de maturidade UX e conformidade de projetos",
            caption: "Power BI — auditoria de maturidade UX e conformidade",
          },
          {
            src: "../media/pbi-training.jpg",
            alt: "Dashboard Power BI de evolução de treinamentos em UX",
            caption: "Power BI — evolução de treinamentos em UX",
          },
          {
            src: "../media/digital-ws.jpg",
            alt: "Sessão de treinamento em UX capacitando equipes para o uso no dia a dia",
            caption: "Treinamento em UX — capacitando equipes no dia a dia",
          },
        ],
      },
      {
        id: "personal-apps",
        category: "personal",
        title: "Apps pessoais",
        short:
          "Quadro de tarefas, cockpit financeiro e um app web pessoal para acompanhar o progresso dos meus estudos.",
        full:
          "Ferramentas que construí para o meu próprio uso: um quadro de tarefas em colunas para projetos pessoais, um cockpit financeiro com orçamentos e gastos por categoria e uma aplicação web pessoal para estudos onde acompanho meu progresso por fases e tarefas.",
        media: [
          {
            src: "../media/tasks-board.jpg",
            alt: "Quadro de tarefas com projetos pessoais em colunas",
            caption: "Tarefas, quadro pessoal",
          },
          {
            src: "../media/finance-cockpit.jpg",
            alt: "Cockpit financeiro com orçamentos e gastos por categoria",
            caption: "Cockpit financeiro, orçamentos e gastos",
          },
          {
            src: "../media/ahk-finance-menu.png",
            alt: "Menu inicial do Finance em AutoHotkey com atalhos de teclado",
            caption: "Menu rápido do Finance em AutoHotkey",
          },
          {
            src: "../media/study-progress-app.png",
            alt: "Aplicação web pessoal para estudos mostrando fases, tarefas e progresso geral de aprendizagem",
            caption: "App web pessoal de progresso nos estudos",
          },
        ],
      },
      {
        id: "trustmate-cloud",
        category: "platforms",
        title: "TrustMate (Arquitetura Cloud Azure & Plataforma)",
        short:
          "Arquitetura cloud full-stack no Microsoft Azure (Static Web Apps, App Service, Azure SQL, Application Insights e alertas de métricas) para avaliações humanas e de IA.",
        full:
          "Arquitetada e implantada no Microsoft Azure, a plataforma TrustMate viabilizou avaliações empíricas de confiança percebida (MQCI / ISO/IEC 25000) com 127 participantes humanos e 150 execuções de agentes de IA de baixo contexto. A arquitetura separa o front-end SPA em Vue 3 no Azure Static Web Apps (trustmate), o back-end API REST em Flask/Python no Azure App Service (TrustMateRestAPI) e o banco relacional no Azure SQL Database (trust-mate-sql-server), com observabilidade via Application Insights e 6 regras de alerta de métricas no Azure Monitor (erros HTTP, health check, falhas de conexão, DTU %, uso de espaço e CPU %) para garantir disponibilidade durante os experimentos, alimentando análises estatísticas em Python e visualizações em Power BI.",
        media: [
          {
            src: "../media/trustmate-cloud-arch-pt.png",
            alt: "Diagrama da arquitetura cloud do TrustMate no Microsoft Azure: Static Web Apps, App Service, Azure SQL, Application Insights e analytics em Python/Power BI",
            caption: "Arquitetura cloud do TrustMate no Azure (Static Web Apps, App Service, Azure SQL e Monitor)",
          },
          {
            src: "../media/trustmate-azure-portal.png",
            alt: "Portal do Microsoft Azure mostrando os recursos implantados do TrustMate: Static Web App, App Service, SQL Server, Application Insights e 6 regras de alerta",
            caption: "Portal Microsoft Azure: recursos implantados, Application Insights e 6 alertas de métricas",
          },
        ],
      },
      {
        id: "results-portal",
        category: "platforms",
        title: "Portal de resultados",
        short:
          "Publica achados de UX em cards, biblioteca de recomendações e linha do tempo em vez de PDF estático.",
        full:
          "Um portal de resultados que publica achados de UX em cards estruturados, biblioteca de recomendações pesquisável e linha do tempo de tarefas, substituindo entregas em PDF estático.",
        icon: "portal",
        media: [],
      },
      {
        id: "ai-training",
        category: "training",
        title: "Treinamentos de IA e agentes",
        short:
          "Tutor na Digital Talent Academy; capacitação para 100+ pessoas (4,88 / 5) e sessões de 2026.",
        full:
          "Tutor para estudantes do programa Digital Talent Academy. Treinamento em ferramentas de IA para mais de 100 pessoas, com satisfação de 4,88 / 5. Em 2026, oito sessões na Bosch com Felipe Oshiro e Gabriel Reis aplicando conceitos de IA com agentes.",
        media: [
          {
            src: "../media/ai-agents-sessions-2026.jpg",
            alt: "Colegas da Bosch nas sessões de treinamento em IA de 2026",
            caption: "Sessões de IA na Bosch, 2026, com Felipe Oshiro e Gabriel Reis",
          },
        ],
      },
      {
        id: "talent-forum",
        category: "training",
        title: "Talent Forum Bosch (3º lugar)",
        short:
          "Ferramenta em Excel VBA premiada para gestão de projetos baseada no Project Model Canvas.",
        full:
          "Terceiro lugar no Talent Forum da Bosch Campinas em setembro de 2018, que reconhece os melhores projetos de estágio da planta. Ferramenta interna em Excel VBA baseada no Project Model Canvas para ajudar equipes a organizar projetos e atingir metas.",
        media: [
          {
            src: "../media/talent-forum-boss-2018.jpg",
            alt: "Eduardo Figueiredo recebendo o terceiro lugar no Talent Forum Bosch com sua chefe, setembro de 2018",
            caption: "3º lugar, Talent Forum Bosch, Campinas, setembro de 2018",
          },
        ],
      },
      {
        id: "international",
        category: "training",
        title: "Workshops internacionais e entre plantas",
        short:
          "Duas viagens à Alemanha (2024 e 2025) e workshops de alinhamento entre unidades da Bosch.",
        full:
          "Duas viagens à Alemanha em 2024 e 2025 por trabalho do cargo, além de workshops presenciais em Joinville e Campinas.",
        media: [
          {
            src: "../media/germany-2024.jpg",
            alt: "Workshop na Alemanha, 2024",
            caption: "Workshop na Alemanha, 2024",
          },
          {
            src: "../media/joinville-2024.jpg",
            alt: "Workshop em Joinville, 2024",
            caption: "Workshop em Joinville, 2024",
          },
          {
            src: "../media/bosch-building.jpg",
            alt: "Eduardo Figueiredo em frente ao prédio da Bosch",
            caption: "Bosch Brasil",
          },
        ],
      },
      {
        id: "presentations",
        category: "training",
        title: "Apresentações de serviços UX e digitais",
        short:
          "Apresentações de serviços UX, jornadas digitais e desenvolvimento de software nas Américas.",
        full:
          "Apresentação de serviços UX para o time GS UX (2023), jornada de soluções digitais GS/TET-LA para Compras (2022), serviços de Tecnologia e Enabling no GS Service Day (agosto de 2022) e serviços digitais em Buenos Aires, Argentina (agosto de 2022).",
        media: [
          {
            src: "../media/ux-services-gs-2023.jpg",
            alt: "Eduardo Figueiredo apresentando serviços UX para a equipe GS em 2023",
            caption: "Serviços UX, GS, 2023",
          },
          {
            src: "../media/digital-journey-gs-tet-2022.jpg",
            alt: "Eduardo Figueiredo apresentando a jornada digital GS/TET-LA para o time de Compras",
            caption: "Jornada digital para Compras, GS/TET-LA, 2022",
          },
          {
            src: "../media/gs-service-day-2022.jpg",
            alt: "Eduardo Figueiredo no GS Service Day em agosto de 2022",
            caption: "GS Service Day, Technology & Enabling, agosto de 2022",
          },
          {
            src: "../media/buenos-aires-2022.jpg",
            alt: "Eduardo Figueiredo apresentando serviços em Buenos Aires em agosto de 2022",
            caption: "Apresentando nossos serviços em Buenos Aires, agosto de 2022",
          },
        ],
      },
      {
        id: "cip-training",
        category: "training",
        title: "Treinamento de fundamentos CIP",
        short:
          "Capacitação do time de RH da Bosch Sorocaba nos conceitos macro e micro de Melhoria Contínua.",
        full:
          "Em agosto de 2020, treinei o time de RH da planta da Bosch em Sorocaba nos fundamentos de Melhoria Contínua, cobrindo os conceitos macro e micro do processo CIP.",
        media: [
          {
            src: "../media/cip-fundamentals-sorocaba-2020.jpg",
            alt: "Eduardo Figueiredo apresentando fundamentos de CIP para o time de RH na Bosch Sorocaba, agosto de 2020",
            caption: "Fundamentos de CIP para RH, Bosch Sorocaba, agosto de 2020",
          },
        ],
      },
      {
        id: "co2-scouting",
        category: "platforms",
        title: "Projeto EcoTrace — Pesquisa de Mercado e Disposição a Pagar em Telemetria de Carbono para Frotas",
        short:
          "Liderei 3 pesquisadores em pesquisa mista de Disposição a Pagar (WTP) em 10 segmentos de frotas e mobilidade, validando baixo WTP isolado por CO2 (56,25%) e pivotando para Manutenção Preditiva e Combustível.",
        full:
          "Liderei uma equipe de três pesquisadores executando em meu nome pesquisa de mercado quantitativa e qualitativa para um dispositivo já construído de telemetria veicular de CO2 em 10 segmentos (plataformas de mobilidade por app, locadoras de veículos, universidades públicas, autoridades municipais de transporte, redes de oficinas e frotas de e-commerce/FMCG). Avaliando Disposição a Pagar (índice WTP de 56,25%) e Importância vs. Solução Atual em 9 funcionalidades, provamos que empresas não pagariam apenas por rastreamento de CO2 e pivotamos a estratégia para Manutenção Preditiva, Diagnóstico de Falhas e Qualidade de Combustível.",
        media: [
          {
            src: "../media/projects/co2-telemetry-scouting.png",
            alt: "Conceito de telemetria de CO₂ em logística e frotas do Projeto EcoTrace",
            caption: "Projeto EcoTrace — telemetria de carbono para frotas e validação de mercado",
          },
        ],
      },
      {
        id: "ux-bootcamp",
        category: "training",
        title: "Projeto DesignIgnite — Bootcamps Corporativos de Design Thinking & Maturidade em UX",
        short:
          "Dois bootcamps práticos de Design Thinking e UX para linhas de Compras/Contas a Pagar e Faturamento (CSI 4,9/5, NPS 9,6), gerando evidências formais para Maturidade em UX Nível 4.",
        full:
          "Desenhei e facilitei dois bootcamps intensivos de Design Thinking e pesquisa aplicada em UX para as linhas de Operações de Compras e Contas a Pagar e Operações de Faturamento e Receita (excluindo Reporte Financeiro). Ministrei teoria de UX unindo Duplo Diamante e Melhoria Contínua com exercícios práticos onde os participantes construíram seus próprios quadros e matrizes de post-its—gerando evidência formal de auditoria para a unidade conquistar a Maturidade em UX Nível 4 de 5 perante auditor interno (CSI 4,9/5,0, NPS 9,6).",
        media: [
          {
            src: "../media/projects/ux-bootcamp__ux-bootcamp-framework-lecture.jpg",
            alt: "Apresentando o framework integrado de Duplo Diamante e Melhoria Contínua durante o bootcamp de UX",
            caption: "Apresentando o framework integrado de Duplo Diamante e Melhoria Contínua durante o bootcamp de UX",
          },
        ],
      },
      {
        id: "pd-calculator",
        category: "platforms",
        title: "Projeto EffortGauge — Calculadora Automatizada de Pessoas-Dia em UX & Gerador de Gantt",
        short:
          "Ferramenta Excel/VBA de estimativa mapeando atividades de UX por complexidade em 5 fases de Design Thinking para calcular Pessoas-Dia e gerar Gantt.",
        full:
          "Desenvolvi uma ferramenta de estimativa em Excel/VBA em colaboração com pesquisadores de UX para padronizar o dimensionamento de esforço da prática. Mapeei horas de preparação, execução e síntese para cada técnica de UX em 5 fases de Design Thinking por nível de complexidade (Baixa, Média, Alta, Excepcional), modalidade e quantidade—calculando automaticamente capacidade diária, Pessoas-Dia totais e gerando um gráfico de Gantt semanal.",
        media: [
          {
            src: "../media/projects/pd-calculator__pd-calculator-gantt-output.png",
            alt: "Gráfico de Gantt automatizado de 6 semanas gerado dinamicamente a partir das fases, técnicas e níveis de complexidade selecionados",
            caption: "Gráfico de Gantt automatizado de 6 semanas gerado dinamicamente a partir das fases, técnicas e níveis de complexidade selecionados",
          },
        ],
      },
      {
        id: "recipient-manifest",
        category: "platforms",
        title: "Projeto ManifestGuard — Pesquisa de UX em Conformidade de Recebimento e Manifesto Fiscal",
        short:
          "Pesquisa de UX ponta a ponta para Compras e Recebimento atacando R$ 1,32M+ em risco de manifesto fiscal atrasado via KPIs, matriz CSD, survey, top 8 achados e ideação.",
        full:
          "Conduzi pesquisa de UX ponta a ponta para Compras e Logística de Recebimento focada no processo obrigatório do Manifesto do Destinatário. Como atrasos de registro por recebedores causavam bloqueios de pagamento e mais de R$ 1,32M em risco de processamento fora do prazo, elaborei matriz de KPIs, Pergunta Zero, Matriz CSD, Mapa Concêntrico de Stakeholders, desenho de survey misto, Top 8 achados empíricos e facilitei workshops de priorização Valor vs. Complexidade e Impacto vs. Viabilidade.",
        media: [
          {
            src: "../media/projects/recipient-manifest__manifest-ux-project-kpis.png",
            alt: "Matriz de KPIs de UX e de projeto visando redução de 15% em R$ 1,32M de volume fora do prazo",
            caption: "Matriz de KPIs de UX e de projeto visando redução de 15% em R$ 1,32M de volume fora do prazo e +60% de utilidade percebida do manual",
          },
        ],
      },
      {
        id: "activity-handover",
        category: "platforms",
        title: "Projeto SmoothRelay — Pesquisa de UX para Handover de Atividades e Transferência de Conhecimento",
        short:
          "Pesquisa mista de UX (CSAT 5/5, 37 achados, 45 oportunidades, 2 jornadas) cobrindo benchmarks acadêmicos/internos, surveys, entrevistas, personas, jornadas e testes com usuários.",
        full:
          "Conduzi investigação mista aprofundada de UX (CSAT 5/5, 37 principais descobertas, 45 oportunidades mapeadas, 2 jornadas) para tornar fluido o handover de atividades em desligamentos, transições e férias. Executei benchmark acadêmico (Matriz de Competências por Função), benchmarks externos e internos, mapa de stakeholders e KPIs (visando handovers 33–50% mais rápidos e 67% menos transições não planejadas), surveys quantitativos e entrevistas qualitativas com análise de sentimento, personas (Denise e Pedro), jornadas As-Is (Maria) e To-Be em storyboard, e testes com usuários do novo checklist.",
        media: [
          {
            src: "../media/projects/activity-handover__handover-executive-overview.png",
            alt: "One-pager executivo do projeto destacando CSAT 5/5, 37 principais descobertas e 45 oportunidades mapeadas",
            caption: "One-pager executivo do projeto destacando CSAT 5/5, 37 principais descobertas, 45 oportunidades mapeadas e estratégia de organização que aprende",
          },
        ],
      },
      {
        id: "cf-automation",
        category: "platforms",
        title: "Projeto ForecastFlow — Automação do Current Forecast (CF) Financeiro & UX Ponta a Ponta",
        short:
          "Pesquisa de UX ponta a ponta, personas Controller & Buyer, jornadas do usuário As-Is/To-Be e 5 telas de wireframes reduzindo o ciclo do forecast em 42% e elevando acurácia em 80%.",
        full:
          "Executei todas as entregas de pesquisa e design de UX para Automação do Current Forecast (CF) Financeiro, substituindo a coordenação manual de 19 planilhas/sistemas entre 11 equipes e 36 interações. Entreguei pesquisa de descoberta, principais achados, personas Controller e Comprador, jornadas do usuário As-Is e To-Be (especificamente jornadas do usuário interno) e 5 telas de wireframes interativos—reduzindo o tempo operacional em 42% (40h para 28h) e elevando a acurácia em 80%.",
        media: [
          {
            src: "../media/projects/cf-automation__cf-executive-impact-summary.png",
            alt: "One-pager executivo de impacto resumindo 42% de redução no tempo operacional e 80% de ganho em acurácia",
            caption: "One-pager executivo de impacto resumindo 42% de redução no tempo operacional, 80% de ganho em acurácia, satisfação 4/5 e direcionadores de negócio",
          },
        ],
      },
      {
        id: "b-travel",
        category: "platforms",
        title: "Projeto TripFlow — Pesquisa de UX e Mapeamento de Jornada Travel-to-Expense (T2E)",
        short:
          "Pesquisa de UX na Espanha e Portugal analisando dores corporativas de Travel-to-Expense em 13 subcategorias, nuvem de survey, persona e Jornada do Usuário em 8 momentos com 24 oportunidades.",
        full:
          "Conduzi pesquisa mista de UX em operações ibéricas (Espanha e Portugal) investigando gargalos no ciclo corporativo de viagens e reembolso de despesas (Travel-to-Expense / T2E). Combinando entrevistas qualitativas, categorização de dores em 13 subcategorias, análise de nuvem de palavras em survey (25% de convergência em atritos de prestação de contas e recibos), definição da persona de Coordenadora de Viagens (Ana Vitória) e uma Jornada do Usuário de 8 momentos (Pré, Durante e Pós-Viagem), mapeei 24 oportunidades digitais.",
        media: [
          {
            src: "../media/projects/b-travel__btravel-end-to-end-journey-map.png",
            alt: "Mapa de Jornada do Usuário Travel-to-Expense ponta a ponta em 8 momentos",
            caption: "Mapa de Jornada do Usuário Travel-to-Expense ponta a ponta em 8 momentos (Pré, Durante e Pós-Viagem) traçando curva emocional e 24 oportunidades",
          },
        ],
      },
      {
        id: "workspace-efficiency",
        category: "personal",
        title: "Setup de trabalho e eficiência",
        short:
          "Setup de hardware, teclado dividido com macros e ferramentas voltado para alta eficiência.",
        full:
          "Ambiente de trabalho personalizado combinando hardware ergonômico, macros em teclado dividido e ferramentas de produtividade para foco contínuo e entregas de alta eficiência.",
        media: [
          {
            src: "../media/workspace-efficiency.jpg",
            alt: "Setup de ferramentas e hardware para alta eficiência no trabalho",
            caption: "Setup de trabalho e eficiência",
          },
        ],
      },
      {
        id: "home-management-system",
        category: "personal",
        title: "Home — Sistema de Gestão da Primeira Casa",
        short:
          "App web local para gerenciar a compra e reforma da minha primeira casa: dashboard executivo, 76 despesas com cotações, modelo 3D interativo e cronograma Gantt completo.",
        full:
          "Construí um sistema web local para planejar e gerenciar a compra e a reforma da minha primeira casa. Ele integra quatro visões: (1) Dashboard executivo com cronograma macro, tarefas rápidas e cobertura orçamentária; (2) Workspace de Despesas com 76 itens categorizados, comparação de múltiplos fornecedores e cálculo de mediana; (3) Modelo 3D interativo da planta da casa; e (4) Cronograma Gantt completo com macro/microatividades, custos por etapa e exportação em PDF/JSON.",
        media: [
          {
            src: "../media/projects/home-dashboard.png",
            alt: "Dashboard executivo do sistema Home com Gantt macro, tarefas rápidas e visão financeira",
            caption: "Dashboard Executivo: cronograma macro, tarefas rápidas e orçamento",
          },
          {
            src: "../media/projects/home-expenses.png",
            alt: "Workspace de despesas com 76 itens categorizados e cotações de fornecedores",
            caption: "Despesas e Cotações: 76 itens categorizados com mediana por fornecedor",
          },
          {
            src: "../media/projects/home-gantt.png",
            alt: "Cronograma Gantt completo com atividades, custos e escala temporal",
            caption: "Cronograma Gantt Completo: etapas, custos e exportação PDF/JSON",
          },
          {
            src: "../media/projects/home-3d-model.png",
            alt: "Modelo 3D interativo da planta da casa com rótulos dos cômodos",
            caption: "Modelo 3D Interativo: visualização espacial dos cômodos e reforma",
          },
        ],
      },
      {
        id: "memorization-book",
        category: "personal",
        title: "Memorize com IA (Livro em Construção)",
        short:
          "Livro em construção que combina técnicas clássicas de palácio da memória com fluxos de IA para gerar mnemônicos para provas e estudo.",
        full:
          "Projeto de livro em construção ('Memorize com IA, passe na prova, pense melhor') estruturado em 4 partes. O plano une métodos espaciais clássicos de memorização (ruas reais, associações visuais, micro-loci) a um fluxo prático com IA para criar mnemônicos voltados a provas e retenção de longo prazo.",
        media: [
          {
            src: "../media/projects/memorization-book-cover.png",
            alt: "Conceito de capa dura do livro Memorize com IA, passe na prova, pense melhor de Eduardo Figueiredo",
            caption: "Conceito e título do livro — estruturado em 4 partes",
          },
        ],
      },
      {
        id: "my-python-scripts",
        category: "personal",
        title: "My-Python-Scripts (Toolkit de Automação e Mídia)",
        short:
          "Coleção de scripts Python reutilizáveis para cronogramas Gantt via CSV, transcrição de áudio, upscale/de-halo de imagens com IA e geração de PPTX/PDF.",
        full:
          "Conjunto de utilitários Python criados para automatizar tarefas recorrentes de dados, mídia e relatórios — incluindo geração de gráficos Gantt a partir de CSV (timeline-gantt), transcrição e processamento em lote de áudios (transcription), super-resolução e remoção de halos com IA (image-upscale, image-dehalo-upscale), checagem de verbatims (verbatting-check) e criação programática de apresentações e PDFs (generate-pptx, generate-image, pdf-merge).",
        media: [
          {
            src: "../media/projects/my-python-scripts-showcase.png",
            alt: "Painel resumo do toolkit My-Python-Scripts cobrindo dados, transcrição, visão computacional e geração de documentos",
            caption: "My-Python-Scripts: Toolkit de Dados, Transcrição, Visão e Relatórios",
          },
        ],
      },
      {
        id: "daily-automation-suite",
        category: "personal",
        title: "Suíte de Automação Diária e Produtividade (AutoHotkey v2 + UIA + Python IPC)",
        short:
          "Toolkit pessoal usado diariamente que integra UI Automation resiliente (UIA-v2), pontes IA-para-IDE, gestão de janelas multimonitor, cheat sheets contextuais para 30+ apps e daemons Python IPC.",
        full:
          "Desenvolvi e mantenho uma suíte modular em AutoHotkey v2 + Python IPC usada diariamente para acelerar entregas e reduzir carga cognitiva. Inclui: (1) pontes entre apps via UI Automation (fluxos IA-para-IDE, verificação de microfone/câmera no Microsoft Teams, atalhos para Outlook e WhatsApp); (2) cheat sheets contextuais instantâneos com busca em mais de 30 apps (Power BI, Excel, Cursor, VS Code, Chrome, Figma); (3) organização de janelas multimonitor, cursor halo e Pomodoro; e (4) daemons Python IPC (Named Pipes/MMF) com timeouts limitados e fallbacks seguros.",
        media: [
          {
            src: "../media/projects/daily-automation-scripts-showcase.png",
            alt: "Painel resumo da Suíte de Automação Diária cobrindo fluxos de IA, cheat sheets contextuais, gestão de janelas e Python IPC",
            caption: "Suíte de Automação Diária: UIA-v2, Cheat Sheets, Janelas e Python IPC",
          },
        ],
      },
      {
        id: "proj-vba-suite",
        category: "platforms",
        title: "Proj. — Aplicação de Gestão de Projetos em Excel/VBA (Budapeste)",
        short:
          "Criada em Budapeste: suíte completa em Excel/VBA para digitalizar a gestão de projetos com Project Model Canvas, EAP (WBS) automática, cronograma Gantt Planejado vs. Real, A3 e OTD/FPY.",
        full:
          "Desenvolvida durante minha atuação em Budapeste para digitalizar a gestão de projetos ponta a ponta em Excel/VBA. A aplicação integra Project Model Canvas (planejamento visual em post-its para justificativa, objetivos SMART, stakeholders, riscos e custos), gerador automático de EAP/WBS em árvore, cronograma Gantt comparando Planejado vs. Real, relatórios A3, fluxo documental em 5 fases (Solicitação, Charter, Riscos, Checklist PM-QG, Lições Aprendidas), criação de baseline e indicadores de OTD e FPY.",
        media: [
          {
            src: "../media/projects/proj-main-menu.png",
            alt: "Menu principal do Proj. v4.1 em Excel/VBA com Project Model Canvas, WBS, Schedule, A3 Create, Baseline e OTD&FPY",
            caption: "Menu Principal (Proj. v4.1): Canvas, WBS, Cronograma, A3 e OTD/FPY",
          },
          {
            src: "../media/projects/proj-project-model-canvas.png",
            alt: "Project Model Canvas em Excel/VBA com blocos visuais para justificativa, objetivos, riscos e custos",
            caption: "Project Model Canvas: planejamento visual em post-its no Excel",
          },
          {
            src: "../media/projects/proj-wbs.png",
            alt: "Estrutura Analítica do Projeto (WBS) gerada automaticamente em Excel/VBA",
            caption: "EAP / WBS Automática: árvore hierárquica de entregas",
          },
          {
            src: "../media/projects/proj-schedule-gantt.png",
            alt: "Cronograma e gráfico de Gantt automático comparando Planejado vs. Real",
            caption: "Cronograma & Gantt Automático: acompanhamento Planejado vs. Real",
          },
          {
            src: "../media/projects/proj-a3-report.png",
            alt: "Template estruturado de relatório A3 conectado ao Project Model Canvas",
            caption: "Relatório A3: Definição do Problema, Estado Atual/Futuro e Plano de Ação",
          },
          {
            src: "../media/projects/proj-documentation-flow.png",
            alt: "Hub documental de gestão de projetos em 5 fases cobrindo Request, Charter, WBS, Riscos, PM-QG e Encerramento",
            caption: "Hub Documental em 5 Fases & Controle de Mudanças",
          },
          {
            src: "../media/projects/proj-request-form.png",
            alt: "Formulário VBA de Solicitação de Projeto com metadados, múltiplas moedas (BRL/EUR/USD/HUF) e escopo",
            caption: "Formulário VBA de Solicitação: entrada estruturada e multimoda",
          },
        ],
      },
    ],
    researchTitle: "Confiança em IA e interfaces",
    research: [
      "A dissertação de mestrado compara pontuações humanas e de agentes de IA sobre confiança percebida em interfaces de e-commerce. A TrustMate aplica o questionário do MQCI (ISO/IEC 25000) e calcula Usabilidade, Acessibilidade e UX.",
      "Agentes ChatGPT o3 e 127 estudantes de TI avaliaram os mesmos três sites. Os agentes não substituem a avaliação humana. São uma triagem automatizada: alinhamento direcional nos melhores e piores atributos, e um viés mais rigoroso na maior parte das pontuações.",
    ],
    researchItems: [
      "Shapiro-Wilk nas distribuições de scores por atributo antes dos testes inferenciais.",
      "Python calculou Welch (humano e IA), t pareado (humano e humano) e t independente (IA e IA), com d de Cohen e FDR de Benjamini-Hochberg.",
      "Os resultados foram para o Power BI: média, desvio padrão, variância, erro padrão, intervalos de confiança e mais de 50 estruturas de gráfico.",
    ],
    researchTail: [
      "Publicado no ISSRE 2025 (Workshop HFSD) e no IHC 2025 (SBC SOL).",
      "A disciplina de Visualização da Informação na Unicamp (nota A) usou a PNAD Contínua no Power BI: Sankey, coropleta e visões facetadas de educação e emprego.",
    ],
    infovisCap: "Estruturas visuais do curso de InfoVis",
    infovis: "../media/infovis-structures-pt.png",
    scoresTitle: "CSI e NPS, 2024–2025",
    scoresLead: "Médias nestes projetos: CSI 4,86, NPS 9,94.",
    scoresHint: "Escolha uma coluna para ordenar.",
    sortProject: "Projeto",
    na: "N/D",
    interestsTitle: "O que faço fora do trabalho",
    interestsLead:
      "Em casa: minha cachorra Moka, meus dois gatos Baby e Faísca, piano iniciante e um teclado dividido que uso para macros.",
    interests: [
      "Piano",
      "Linguística (fonologia e fonética)",
      "Física (relatividade e quântica)",
      "Arte impressionista",
      "Criação de macros e teclados",
    ],
    interestCaps: [
      "Baby durante a prática de piano em casa",
      "Faísca no meu teclado dividido e macros",
      "Eu e minha cachorra Moka",
    ],
    booksHallTitle: "Hall de Leitura",
    booksHallLead:
      "Alguns livros que moldaram minha forma de pensar sobre dados, design, memória e tomada de decisão. Clique em qualquer capa para ver uma síntese.",
    contactTitle: "Vamos conversar",
    contactLead:
      "Trago pesquisa aplicada, tecnologia e entrega de projetos. O que me importa é trabalho em que as pessoas possam confiar e usar, com dados claros e resultados que dá para medir.",
    pdfButton: "Baixar PDF",
    contactFine: "O botão de PDF salva uma cópia em PDF deste portfólio.",
    customizePortfolio: "Personalizar",
    customizeModalTitle: "Personalizar Portfólio",
    customizeSubtitle: "Escolha quais capítulos incluir no seu portfólio e no PDF exportado:",
    selectAll: "Selecionar Todas",
    resetSelection: "Restaurar",
    downloadCustomPdf: "Baixar PDF",
    closeCustomizer: "Concluído",
    viewerClose: "Fechar",
    langLabel: "Idioma",
    facts: [
      [
        "Internacional",
        "Duas viagens à Alemanha, em 2024 e 2025, por trabalho do cargo.",
      ],
      [
        "Rastreamento de CO2",
        "Prospecção de mercado para telemetria de CO2 na GS. Achado: falta de demanda.",
      ],
      [
        "Tooling, PT",
        "Conduzi a entrega técnica e a gestão do projeto, dos requisitos aos protótipos de alta fidelidade, com check-ins regulares.",
      ],
      [
        "Maturidade em UX",
        "Levei as Américas ao Nível 4: governança, templates e treinamento.",
      ],
      [
        "Serviços de UX",
        "Em 2023 apresentei nossos serviços de UX ao time de UX da GS. Navegando em direção a experiências incríveis. Cada interação molda nosso caminho para um design mais humano e envolvente. Imensamente grato pela recepção no time e pela semana produtiva de interação com áreas adjacentes.",
      ],
      [
        "Jornada digital",
        "Apresentação da jornada digital da GS/TET-LA para o time de Compras.",
      ],
      [
        "Service Day",
        "No GS Service Day, em agosto de 2022, apresentei nossos serviços de tecnologia e enabling da unidade de negócio.",
      ],
      [
        "Buenos Aires",
        "Em agosto de 2022 apresentei nossos serviços de soluções digitais e desenvolvimento de software em Buenos Aires, na Argentina.",
      ],
      [
        "Fórum de Talentos",
        "3º lugar no Fórum de Talentos dos estagiários da Bosch Campinas, em setembro de 2018. O fórum reconhece os melhores projetos de estágio da planta. O projeto premiado foi uma ferramenta interna em VBA para Excel, de gestão de projetos, baseada no Project Model Canvas. Ajudou times a organizar as informações dos projetos e a alcançar seus objetivos.",
      ],
      [
        "Treinamento de CIP",
        "Em agosto de 2020 ofereci ao time de RH da planta Bosch em Sorocaba o treinamento Fundamentos da Melhoria Contínua, com os conceitos macro e micro do processo de CIP.",
      ],
      [
        "Dashboards CIP",
        "Com a equipe de UX, avaliei dashboards estratégicos de CIP para a liderança da GS identificar problemas e ganhos de eficiência. A relevância de UX no ServiceNow usa pesos por propriedade.",
      ],
      [
        "Formação",
        "Tutor de estudantes da Digital Talent Academy. Treinamento de ferramentas de IA para mais de 100 pessoas, satisfação 4,88 / 5. Em 2026, oito sessões na Bosch com Felipe Oshiro e Gabriel Reis: o grupo aprendeu termos de IA e aplicou na prática com agentes.",
      ],
    ],
    presentCaps: [
      "Bosch Brasil",
      "Workshop na Alemanha, 2024",
      "Workshop em Joinville, 2024",
      "Pesquisa Aplicada, GS",
      "Serviços de UX, GS, 2023",
      "Jornada digital da GS/TET-LA para Compras, 2022",
      "GS Service Day, Technology & Enabling, agosto de 2022",
      "Apresentação dos nossos serviços em Buenos Aires, agosto de 2022",
      "3º lugar, Fórum de Talentos da Bosch, Campinas, setembro de 2018, com meu chefe na época",
      "Fundamentos de CIP para o RH, Bosch Sorocaba, agosto de 2020",
      "Projeto de tooling, PT",
      "Relatório de entrega da minha pesquisa",
      "Power BI, alocação",
      "Power BI, treinamento",
      "Sessões de IA na Bosch, 2026, com Felipe Oshiro e Gabriel Reis",
    ],
    researchCaps: [
      "Gráficos da dissertação em Python e Power BI",
      "TrustMate, a aplicação web",
      "TrustMate, Power BI",
      "Pontuações de IA e humanos",
      "Artigo publicado",
      "IHC 2025",
      "ISSRE 2025, HFSD",
      "PNAD Contínua, Power BI",
    ],
    stops: [
      {
        text: "Campinas, 2018. Reconhecimento de equipe na Bosch.",
        src: "../media/bosch-2018.jpg",
        alt: "Eduardo Figueiredo com o time da Bosch em Campinas, 2018",
        diagram: false,
      },
      {
        text: "Hungria, 2019, com o time de Budapeste.",
        src: "../media/budapest-2019.jpg",
        alt: "Time da Bosch em Budapeste, 2019",
        diagram: false,
      },
      {
        text: "A trajetória resumida: Campinas, Hungria, Sorocaba e Campinas de novo.",
        src: "../media/timeline-pt.png",
        alt: "Linha do tempo entre unidades Bosch",
        diagram: true,
      },
      {
        text: "De volta a Campinas. Workshops na Alemanha em 2024 e 2025, e o time das Américas em 2025.",
        src: "../media/americas-2025.jpg",
        alt: "Time das Américas, 2025",
        diagram: false,
      },
    ],
  },
};
