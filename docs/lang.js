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
    pathTitle: "Bosch, place by place",
    pathLead:
      "The condensed path crosses Bosch locations: Campinas, Hungary, Sorocaba, and Campinas again. Select a stop.",
    stop0: "Campinas",
    stop1: "Hungary",
    storyCap: "The sequence of the portfolio deck",
    pathCap: "The path in the portfolio deck",
    deliverablesTitle: "Deliverables",
    deliverablesLead:
      "These are the pieces I shipped. They stay on this page whichever role you opened.",
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
    modelTitle: "Relevance model",
    modelLead:
      "I built a model to score applied-research relevance for CIP initiatives. CIM (ServiceNow) fields are set by priority. The result is Low, Medium, or High, a triage for when deeper research involvement is needed. Python runs the pipeline on CIM-like data.",
    modelSample: "Sample of 35 projects",
    modelCap: "Relevance model from the portfolio deck",
    bars: ["Low", "Medium", "High"],
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
    scoresLead:
      "Select a column to sort. Averages across these projects: CSI 4.86, NPS 9.94.",
    sortProject: "Project",
    na: "N/A",
    interestsTitle: "What I do outside the job",
    interestsLead:
      "At home: two cats, learning piano, and a split keyboard I use for macros.",
    interests: [
      "Piano",
      "Linguistics",
      "Physics",
      "Acting",
      "Impressionist art",
      "Macros and keyboards",
    ],
    interestCaps: ["Piano practice at home", "Split keyboard and macros"],
    contactTitle: "Let's connect",
    contactLead:
      "I bring applied research, technology, and project delivery. What I care about is work people can trust and use, with clear data and results you can measure.",
    contactFine: "Resume and the slide deck are available on request.",
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
      "Tooling project, PT",
      "CIP research report",
      "Power BI, allocation",
      "Power BI, training",
      "Bosch AI sessions, 2026, with Felipe Oshiro and Gabriel Reis",
    ],
    researchCaps: [
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
    pathTitle: "Bosch, lugar por lugar",
    pathLead:
      "A trajetória resumida passa por unidades Bosch: Campinas, Hungria, Sorocaba e Campinas de novo. Escolha uma parada.",
    stop0: "Campinas",
    stop1: "Hungria",
    storyCap: "A sequência do deck",
    pathCap: "O caminho no deck",
    deliverablesTitle: "Entregas",
    deliverablesLead:
      "Estas são as peças que entreguei. Elas ficam nesta página qualquer que seja o papel que você abriu.",
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
    modelTitle: "Modelo de relevância",
    modelLead:
      "Construí um modelo para avaliar a relevância de pesquisa aplicada em iniciativas CIP. Campos do CIM (ServiceNow) entram por prioridade. O resultado é Baixa, Média ou Alta, uma triagem de quando a pesquisa precisa ir mais fundo. Python executa o pipeline em dados no formato do CIM.",
    modelSample: "Amostra de 35 projetos",
    modelCap: "Modelo de relevância do deck",
    bars: ["Baixa", "Média", "Alta"],
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
    scoresLead:
      "Escolha uma coluna para ordenar. Médias nestes projetos: CSI 4,86, NPS 9,94.",
    sortProject: "Projeto",
    na: "N/D",
    interestsTitle: "O que faço fora do trabalho",
    interestsLead:
      "Em casa: dois gatos, piano iniciante e um teclado dividido que uso para macros.",
    interests: [
      "Piano",
      "Linguística (fonologia e fonética)",
      "Física (relatividade e quântica)",
      "Atuação",
      "Arte impressionista",
      "Criação de macros e teclados",
    ],
    interestCaps: ["Prática de piano em casa", "Teclado dividido e macros"],
    contactTitle: "Vamos conversar",
    contactLead:
      "Trago pesquisa aplicada, tecnologia e entrega de projetos. O que me importa é trabalho em que as pessoas possam confiar e usar, com dados claros e resultados que dá para medir.",
    contactFine: "Currículo e este deck disponíveis sob pedido.",
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
      "Projeto de tooling, PT",
      "Relatório de pesquisa CIP",
      "Power BI, alocação",
      "Power BI, treinamento",
      "Sessões de IA na Bosch, 2026, com Felipe Oshiro e Gabriel Reis",
    ],
    researchCaps: [
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
        src: "../media/timeline.png",
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
