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
      "Technical school at ETEC Bento Quirino, then Unicamp. Grade A in all master's coursework. English proficiency verified. Portuguese is native, English is fluent.",
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
        title: "UX Super Portal & X-Tower Service Blueprint",
        short:
          "Custom UX practice portal (offerings, personas, KPIs) applied to X-Tower discovery: blueprint & evaluation saving 150k EUR/quarter and 240h/month.",
        full:
          "Built the UX Super practice portal to organize businesses, offerings, personas, opportunities, and baseline-to-target project KPIs, and applied it to end-to-end UX research and architecture discovery for the X-Tower platform across global PS-BDO teams. Conducted a heuristic evaluation of 8 core screens (33 flaws uncovered), stakeholder interviews, global survey, concentric stakeholder and ecosystem mapping, and an as-is service blueprint exposing 240-row parallel Excel workarounds—establishing unified governance and impact projections of 150,000 EUR/quarter in avoided rework and 240 hours/month saved.",
        media: [
          {
            src: "../media/x-tower-summary.png",
            alt: "X-Tower project overview and consolidated before-and-after impact results",
            caption: "BeaconTower impact summary: 150k EUR/quarter & 240h/month saved",
          },
          {
            src: "../media/x-tower-ecosystem.png",
            alt: "X-Tower platform ecosystem map across modules, leadership, and Bosch organization",
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
            src: "../media/ux-super-businesses.jpg",
            alt: "UX Super businesses view, with offerings, personas, and opportunities",
            caption: "UX Practice Portal: businesses, offerings & personas",
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
        title: "Relevance model",
        short:
          "Automated Python triage pipeline scoring CIP initiatives in ServiceNow (Low, Medium, High).",
        full:
          "I built a model to score applied-research relevance for CIP initiatives. CIM (ServiceNow) fields are set by priority and evaluated into Low, Medium, or High—a triage for when deeper research involvement is needed. Also evaluated strategic CIP dashboards with the UX team so leadership could spot main issues and efficiency gains.",
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
        title: "UX Maturity Audit & Governance Dashboards",
        short:
          "Power BI audit dashboards (2+ years of data) tracking template adoption & PM compliance that drove UX Maturity Level 4/5.",
        full:
          "Built automated Power BI audit and governance dashboards (connected to Microsoft Lists) to track whether teams were using standardized UX templates and completing required project-management documentation. Over two years of continuous governance data, training evolution tracking, and resource allocation oversight directly enabled the Global Services Americas unit to achieve UX Maturity Level 4 out of 5.",
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
        category: "data",
        title: "CO₂ tracking scouting",
        short:
          "Market scouting for CO₂ telemetry at GS; validated lack of market demand.",
        full:
          "Conducted marketing and demand scouting for CO₂ telemetry at GS. Finding: lack of market demand—preventing unnecessary engineering investment.",
        icon: "radar",
        media: [],
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
      "Escola técnica na ETEC Bento Quirino, depois a Unicamp. Nota A em todas as disciplinas do mestrado. Proficiência em inglês comprovada. Português nativo, inglês fluente.",
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
        title: "Portal UX Super e Service Blueprint X-Tower",
        short:
          "Portal da prática de UX (ofertas, personas, KPIs) aplicado à descoberta do X-Tower: blueprint e avaliação com economia de 150 mil EUR/trimestre e 240h/mês.",
        full:
          "Desenvolvi o portal UX Super para estruturar negócios, ofertas, personas, oportunidades e KPIs de projeto (linha de base à meta), aplicando-o na pesquisa de UX e descoberta de arquitetura ponta a ponta da plataforma X-Tower em times globais PS-BDO. Incluiu avaliação heurística de 8 telas principais (33 falhas mapeadas), entrevistas com stakeholders, survey global, mapeamento concêntrico de stakeholders e ecossistema, e service blueprint as-is expondo planilhas paralelas de 240 linhas—estruturando governança unificada com impacto projetado de 150.000 EUR/trimestre em retrabalho evitado e 240 horas/mês economizadas.",
        media: [
          {
            src: "../media/x-tower-summary.png",
            alt: "Resumo do projeto X-Tower e resultados consolidados de impacto antes e depois",
            caption: "Resumo de impacto BeaconTower: 150 mil EUR/trimestre e 240h/mês",
          },
          {
            src: "../media/x-tower-ecosystem.png",
            alt: "Mapa do ecossistema X-Tower entre módulos, liderança e organização Bosch",
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
            src: "../media/ux-super-businesses.jpg",
            alt: "Visão de negócios do UX Super, com ofertas, personas e oportunidades",
            caption: "Portal de Prática UX: negócios, ofertas e personas",
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
        title: "Modelo de relevância",
        short:
          "Pipeline em Python para triagem de iniciativas CIP no ServiceNow (Baixa, Média, Alta).",
        full:
          "Construí um modelo para avaliar a relevância de pesquisa aplicada em iniciativas CIP. Campos do CIM (ServiceNow) entram por prioridade, gerando uma triagem em Baixa, Média ou Alta. Também avaliei dashboards estratégicos de CIP com o time de UX para a liderança identificar gargalos e ganhos de eficiência.",
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
        title: "Dashboards de Auditoria e Maturidade UX",
        short:
          "Dashboards de auditoria em Power BI (2+ anos de dados) rastreando uso de templates e gestão de projetos rumo à Maturidade UX Nível 4/5.",
        full:
          "Desenvolvi dashboards automatizados de auditoria e governança em Power BI (integrados ao Microsoft Lists) para monitorar se as equipes utilizavam os templates padronizados e cumpriam a documentação obrigatória de gestão de projetos. Mais de dois anos de dados contínuos de auditoria, evolução de treinamentos e gestão de alocação foram decisivos para a unidade Global Services Américas alcançar a Maturidade em UX Nível 4 de 5.",
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
        category: "data",
        title: "Prospecção de rastreamento de CO₂",
        short:
          "Prospecção de mercado para telemetria de CO₂ na GS; validada ausência de demanda.",
        full:
          "Prospecção de mercado e demanda para telemetria de CO₂ na GS. Resultado: ausência de demanda de mercado, evitando investimento desnecessário.",
        icon: "radar",
        media: [],
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
