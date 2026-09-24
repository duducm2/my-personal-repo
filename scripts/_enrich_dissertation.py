# -*- coding: utf-8 -*-
"""Enrich dissertation blurbs from the LaTeX thesis abstracts."""
import csv
from pathlib import Path

ROOT = Path("my-data/canonical")


def rewrite(path, update_fn):
    with path.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)
    n = 0
    for row in rows:
        if update_fn(row):
            n += 1
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator="\n")
        w.writeheader()
        w.writerows(rows)
    print(f"{path.name}: {n}")


# --- education.csv (master's row is sort_order 1) ---
def update_education(row):
    if row.get("sort_order") != "1":
        return False
    row["detail_en"] = (
        "Dissertation — Perceived Trust in E-commerce Websites: proposing and validating "
        "an automated evaluation method with AI agents. I used the Interface Trust Quality Model "
        "(ITQM/MQCI, based on ISO/IEC 25000), built the TrustMate web tool to run the questionnaire "
        "and score Usability, Accessibility, and UX, and compared ChatGPT o3 agents with 127 IT students "
        "on three sites. Core question: do AI-agent scores meaningfully match human perceived trust? "
        "Finding: agents don't replace human evaluation, but work as automated triage of interface quality. "
        "Analysis: descriptive, visual, and inferential (Python → Power BI). "
        "Coursework (Grade A in all courses): Academic Writing, Scientific Research, "
        "Innovation & Technology Transfer, Information Visualization "
        "(visual mapping, multivariate data, interaction, graphs/trees, text viz)."
    )
    row["detail_pt"] = (
        "Dissertação — Confiança Percebida em Websites de E-commerce: proposta e validação "
        "de um método automatizado de avaliação com apoio de agentes de IA. Usei o Modelo de Qualidade "
        "da Confiança da Interface (MQCI, baseado na ISO/IEC 25000), construí a ferramenta web TrustMate "
        "para aplicar o questionário e pontuar Usabilidade, Acessibilidade e UX, e comparei agentes "
        "ChatGPT o3 com 127 estudantes de TI em três sites. Pergunta central: as pontuações dos agentes "
        "representam de forma significativa a confiança percebida por humanos? "
        "Achado: agentes não substituem a avaliação humana, mas funcionam como triagem automatizada "
        "da qualidade da interface. Análise: descritiva, visual e inferencial (Python → Power BI). "
        "Disciplinas (nota A em todas): Escrita Acadêmica, Pesquisa Científica, "
        "Inovação & Transferência de Tecnologia, Visualização da Informação "
        "(mapeamento visual, multivariados, interação, grafos/árvores, viz de textos)."
    )
    return True


rewrite(ROOT / "education.csv", update_education)


# --- education_linkedin master's ---
def update_edu_li(row):
    if row.get("id") != "unicamp-msc-2023":
        return False
    row["description_en"] = (
        "Dissertation on perceived trust in e-commerce websites: I proposed and validated "
        "an automated evaluation method with AI agents, using the Interface Trust Quality Model "
        "(ITQM/MQCI, ISO/IEC 25000) and the TrustMate tool I built to score Usability, Accessibility, and UX. "
        "ChatGPT o3 agents were compared with 127 IT students on three sites."
    )
    row["description_detail_en"] = (
        "My Master's dissertation is titled around perceived trust in e-commerce websites—"
        "how interfaces convey trust, and whether AI agents can score that the way people do. "
        "I used the Interface Trust Quality Model (ITQM/MQCI, rooted in ISO/IEC 25000), "
        "built TrustMate to apply the questionnaire and compute hierarchical Usability, Accessibility, "
        "and UX scores, and compared ChatGPT o3 agents with 127 IT students from FATEC Itapetininga "
        "on the same three sites. The study concludes that agents don't replace human evaluation, "
        "but are a promising instrument for automated triage of interface quality—"
        "useful for spotting best and worst attributes before deeper human review. "
        "Master's approved in September 2026; diploma scheduled for December 2026."
    )
    row["description_pt"] = (
        "Dissertação sobre confiança percebida em websites de e-commerce: propus e validei "
        "um método automatizado de avaliação com agentes de IA, usando o Modelo de Qualidade "
        "da Confiança da Interface (MQCI, ISO/IEC 25000) e a ferramenta TrustMate que construí "
        "para pontuar Usabilidade, Acessibilidade e UX. Agentes ChatGPT o3 foram comparados "
        "com 127 estudantes de TI em três sites."
    )
    row["description_detail_pt"] = (
        "Minha dissertação de mestrado gira em torno da confiança percebida em websites de e-commerce—"
        "como as interfaces transmitem confiança e se agentes de IA conseguem pontuar isso como as pessoas. "
        "Usei o Modelo de Qualidade da Confiança da Interface (MQCI, baseado na ISO/IEC 25000), "
        "construí a TrustMate para aplicar o questionário e calcular pontuações hierárquicas de "
        "Usabilidade, Acessibilidade e UX, e comparei agentes ChatGPT o3 com 127 estudantes de TI "
        "da FATEC Itapetininga nos mesmos três sites. O estudo conclui que agentes não substituem "
        "a avaliação humana, mas são um instrumento promissor de triagem automatizada da qualidade "
        "da interface—útil para apontar atributos melhores e piores antes de uma revisão humana mais profunda. "
        "O mestrado foi aprovado em setembro de 2026 (diploma em dezembro de 2026), após aprovação da dissertação."
    )
    return True


rewrite(ROOT / "education_linkedin.csv", update_edu_li)


# --- projects ---
def update_projects(row):
    if row.get("id") != "dissertation-trustmate-stats":
        return False
    row["name_en"] = "Dissertation — Perceived trust in e-commerce (TrustMate)"
    row["name_detail_en"] = "Dissertation — Perceived trust in e-commerce (TrustMate)"
    row["name_pt"] = "Dissertação — Confiança percebida em e-commerce (TrustMate)"
    row["name_detail_pt"] = (
        "Dissertação — Confiança percebida em e-commerce (TrustMate)"
    )
    row["summary_en"] = (
        "Automated ITQM/MQCI trust scoring with AI agents; TrustMate tool; "
        "ChatGPT o3 vs 127 IT students on three sites; descriptive, visual, and inferential analysis."
    )
    row["summary_pt"] = (
        "Pontuação automatizada de confiança MQCI com agentes de IA; ferramenta TrustMate; "
        "ChatGPT o3 vs 127 estudantes de TI em três sites; análise descritiva, visual e inferencial."
    )
    row["summary_detail_en"] = (
        "For my Master's dissertation I studied perceived trust on e-commerce interfaces—"
        "whether AI agents can score what humans feel when they land on a site. "
        "I used the Interface Trust Quality Model (ITQM/MQCI, ISO/IEC 25000), built TrustMate "
        "to run the questionnaire and compute hierarchical Usability, Accessibility, and UX scores, "
        "and compared ChatGPT o3 agents with 127 IT students on three sites. "
        "The short finding: agents don't replace human evaluation, but they work as automated triage "
        "(directional alignment on best/worst attributes, with a stricter bias on most leaf scores). "
        "On the analysis track I built descriptive, visual, and inferential reporting—"
        "normality checks, attribute-level tests with FDR control, and Power BI with 50+ visual structures—"
        "aligned with the Information Visualization coursework."
    )
    row["summary_detail_pt"] = (
        "Na dissertação de mestrado estudei confiança percebida em interfaces de e-commerce—"
        "se agentes de IA conseguem pontuar o que humanos sentem ao chegar em um site. "
        "Usei o Modelo de Qualidade da Confiança da Interface (MQCI, ISO/IEC 25000), construí a TrustMate "
        "para aplicar o questionário e calcular pontuações hierárquicas de Usabilidade, Acessibilidade e UX, "
        "e comparei agentes ChatGPT o3 com 127 estudantes de TI em três sites. "
        "Achado resumido: agentes não substituem a avaliação humana, mas funcionam como triagem automatizada "
        "(alinhamento direcional nos melhores/piores atributos, com viés mais rigoroso na maior parte das folhas). "
        "Na trilha de análise montei reporting descritivo, visual e inferencial—"
        "checagens de normalidade, testes por atributo com controle FDR e Power BI com 50+ estruturas visuais—"
        "alinhado à disciplina de Visualização da Informação."
    )
    return True


rewrite(ROOT / "projects.csv", update_projects)


# --- narratives dissertation intros + one finding bullet ---
INTROS = {
    "general": (
        "My Master's dissertation asks whether AI agents can stand in for humans when scoring "
        "perceived trust on e-commerce interfaces—the kind of trust a reputable site has to convey "
        "through Usability, Accessibility, and UX. I used the Interface Trust Quality Model "
        "(ITQM / MQCI, rooted in ISO/IEC 25000), built the TrustMate web tool to run the questionnaire "
        "and compute attribute scores, and compared ChatGPT o3 agents with 127 IT students on three sites. "
        "Finding in short: agents don't replace human evaluation, but they're useful for automated triage.",
        "Minha dissertação de mestrado pergunta se agentes de IA conseguem representar a percepção "
        "de confiança de humanos em interfaces de e-commerce—a confiança que um site idôneo precisa "
        "transmitir por Usabilidade, Acessibilidade e UX. Usei o Modelo de Qualidade da Confiança "
        "da Interface (MQCI, baseado na ISO/IEC 25000), construí a ferramenta web TrustMate para aplicar "
        "o questionário e calcular as pontuações, e comparei agentes ChatGPT o3 com 127 estudantes de TI "
        "em três sites. Em resumo: agentes não substituem a avaliação humana, mas servem para triagem automatizada.",
    ),
    "product-owner": (
        "My Master's dissertation looks at perceived trust on e-commerce interfaces: can AI agents "
        "score what humans feel? Using ITQM/MQCI (ISO/IEC 25000) and the TrustMate tool I built, "
        "I compared ChatGPT o3 agents with 127 IT students on the same three sites. "
        "The research stays close to discovery and validation—whether automated triage is good enough "
        "before human judgment. Short answer from the study: triage yes, full replacement no.",
        "Minha dissertação de mestrado olha a confiança percebida em interfaces de e-commerce: "
        "agentes de IA conseguem pontuar o que humanos sentem? Com o MQCI (ISO/IEC 25000) e a TrustMate "
        "que construí, comparei agentes ChatGPT o3 com 127 estudantes de TI nos mesmos três sites. "
        "A pergunta fica perto de descoberta e validação—se a triagem automatizada basta antes do "
        "julgamento humano. Resposta curta do estudo: triagem sim, substituição total não.",
    ),
    "data-analyst": (
        "My Master's dissertation compares human and AI-agent scores of perceived trust on e-commerce "
        "interfaces. TrustMate applies the ITQM/MQCI questionnaire (ISO/IEC 25000) and computes "
        "hierarchical Usability, Accessibility, and UX scores; ChatGPT o3 agents and 127 IT students "
        "evaluated the same three sites. Beyond the method, the takeaway is practical: agents showed "
        "directional alignment on best/worst attributes, but were not statistically interchangeable "
        "with humans on most scores—so triage, not replacement. Analysis covers descriptive stats, "
        "visuals, and inference from Python into Power BI.",
        "Minha dissertação de mestrado compara pontuações humanas e de agentes de IA sobre confiança "
        "percebida em interfaces de e-commerce. A TrustMate aplica o questionário do MQCI (ISO/IEC 25000) "
        "e calcula pontuações hierárquicas de Usabilidade, Acessibilidade e UX; agentes ChatGPT o3 e "
        "127 estudantes de TI avaliaram os mesmos três sites. Além do método, o aprendizado é prático: "
        "os agentes mostraram alinhamento direcional nos melhores/piores atributos, mas não foram "
        "estatisticamente intercambiáveis com humanos na maior parte das pontuações—triagem, não substituição. "
        "A análise cobre descritivas, visuais e inferência de Python ao Power BI.",
    ),
    "digital-solution-architect": (
        "My Master's dissertation measures perceived trust in e-commerce interfaces with ITQM/MQCI "
        "(ISO/IEC 25000) and TrustMate, then compares ChatGPT o3 AI agents with 127 IT students on "
        "three sites. The architecture angle: can automated interface-quality triage support decisions "
        "before you scale AI features—without pretending agents replace human evaluation? "
        "The study's answer is yes to triage, no to substitution.",
        "Minha dissertação de mestrado mensura confiança percebida em interfaces de e-commerce com o MQCI "
        "(ISO/IEC 25000) e a TrustMate, depois compara agentes ChatGPT o3 com 127 estudantes de TI em "
        "três sites. O ângulo de arquitetura: a triagem automatizada de qualidade de interface consegue "
        "apoiar decisões antes de escalar features de IA—sem fingir que agentes substituem avaliação humana? "
        "A resposta do estudo é sim à triagem, não à substituição.",
    ),
}

FINDING_BULLET = {
    "en": (
        "- Finding: AI agents don't replace human evaluation; they are a promising automated triage "
        "for interface quality (directional alignment on top/bottom attributes; stricter bias on most leaf scores)."
    ),
    "pt": (
        "- Achado: agentes de IA não substituem a avaliação humana; são triagem automatizada promissora "
        "da qualidade da interface (alinhamento direcional nos melhores/piores atributos; viés mais rigoroso "
        "na maior parte das pontuações folha)."
    ),
}


def update_narratives(row):
    field = row.get("field")
    variant = row.get("variant")
    if field == "dissertation_pbi_intro" and variant in INTROS:
        en, pt = INTROS[variant]
        row["text_en"] = en
        row["text_pt"] = pt
        return True
    if field == "dissertation_pbi_bullets":
        en = row.get("text_en") or ""
        pt = row.get("text_pt") or ""
        if "Finding:" not in en and "Achado:" not in pt:
            # Insert finding after first topic bullet
            en_lines = en.split("\n")
            pt_lines = pt.split("\n")
            if en_lines:
                en_lines.insert(1, FINDING_BULLET["en"])
            if pt_lines:
                pt_lines.insert(1, FINDING_BULLET["pt"])
            row["text_en"] = "\n".join(en_lines)
            row["text_pt"] = "\n".join(pt_lines)
            return True
    return False


rewrite(ROOT / "narratives.csv", update_narratives)
print("done")
