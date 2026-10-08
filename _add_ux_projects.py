# -*- coding: utf-8 -*-
import csv
import io
from pathlib import Path

path = Path("my-data/canonical/projects.csv")
text = path.read_text(encoding="utf-8")
newline = "\r\n" if "\r\n" in text else "\n"
reader = csv.DictReader(io.StringIO(text))
fieldnames = reader.fieldnames
rows = list(reader)
existing = {row["id"] for row in rows}

workspace = {
    "id": "ux-practice-workspace",
    "pinned": "",
    "name_en": "UX practice workspace",
    "name_detail_en": "UX practice workspace",
    "name_pt": "Área de trabalho da prática de UX",
    "name_detail_pt": "Área de trabalho da prática de UX",
    "summary_en": "Local web app that turns articles into proposal drafts, reads the businesses behind them, opens meeting drafts from availability checks, and keeps lead and lag KPIs for each project.",
    "summary_detail_en": "I built a local web application for the daily work of a UX practice. It reads one or more articles, or pasted text when a page cannot be read, copies a prompt for an AI companion, and imports the structured reply as a lead card. From a card I review the fields, generate a proposal deck and a PDF, and open an email draft without sending it. A businesses view shows services, signals, personas, and opportunities taken from those files. Scheduling takes a project name and participant emails, imports availability, and opens meeting drafts that stay unsent. A measures view keeps lead indicators, which estimate performance before the result, and lag indicators, which record the outcome after the solution. Settings hold the hourly rate, the currency, and the hours in a week.",
    "summary_pt": "App web local que transforma artigos em rascunhos de proposta, lê os negócios por trás deles, abre rascunhos de reunião a partir de checagens de disponibilidade e guarda KPIs de entrada e de resultado por projeto.",
    "summary_detail_pt": "Construí uma aplicação web local para o dia a dia de uma prática de UX. Ela lê um ou mais artigos, ou texto colado quando a página não pode ser lida, copia um prompt para um companheiro de IA e importa a resposta estruturada como um cartão de oportunidade. A partir do cartão eu reviso os campos, gero um deck de proposta e um PDF, e abro um rascunho de e-mail sem enviá-lo. Uma visão de negócios mostra serviços, sinais, personas e oportunidades extraídos desses arquivos. O agendamento recebe o nome do projeto e os e-mails dos participantes, importa a disponibilidade e abre rascunhos de reunião que permanecem sem envio. Uma visão de medidas guarda indicadores de entrada, que estimam o desempenho antes do resultado, e indicadores de resultado, que registram o desfecho depois da solução. As configurações guardam o valor da hora, a moeda e as horas da semana.",
    "csi": "",
    "nps": "",
    "notes_en": "Local web application for proposal, scheduling, and measurement work. No CSI or NPS.",
    "notes_detail_en": "Self-built tool for a UX practice. It does not send email or calendar invitations. The person reviews the draft and sends it themselves.",
    "notes_pt": "Aplicação web local para proposta, agendamento e medição. Sem CSI ou NPS.",
    "notes_detail_pt": "Ferramenta feita para uma prática de UX. Ela não envia e-mail nem convites de calendário. A pessoa revisa o rascunho e envia por conta própria.",
}

portal = {
    "id": "ux-results-portal",
    "pinned": "",
    "name_en": "UX results portal",
    "name_detail_en": "UX results portal",
    "name_pt": "Portal de resultados de UX",
    "name_detail_pt": "Portal de resultados de UX",
    "summary_en": "Local web portal that publishes UX findings as browsable cards, a recommendations library, and a task timeline, instead of a static PDF.",
    "summary_detail_en": "I built a local site so UX results could be read as a portal rather than handed over as a PDF. Findings appear as cards with a category, an evaluation, the observation, an analysis of the experience and the business process, and a supporting quote. A second page works as a short reference library. Each card has the observation, the heuristic it relates to, a recommendation, and the source page. A third page is a timeline of tasks. Selecting a bar shows status, dates, and notes. The content lives in spreadsheets outside the app, so a result can be updated without rebuilding a document.",
    "summary_pt": "Portal web local que publica achados de UX como cartões navegáveis, uma biblioteca de recomendações e uma linha do tempo de tarefas, em vez de um PDF estático.",
    "summary_detail_pt": "Construí um site local para que resultados de UX fossem lidos como um portal, e não entregues como PDF. Os achados aparecem em cartões com categoria, avaliação, observação, uma análise da experiência e do processo de negócio, e uma fala de apoio. Uma segunda página funciona como uma biblioteca curta de referência. Cada cartão traz a observação, a heurística relacionada, uma recomendação e a página de origem. Uma terceira página é uma linha do tempo de tarefas. Ao selecionar uma barra, aparecem status, datas e notas. O conteúdo vive em planilhas fora do app, então um resultado pode ser atualizado sem reconstruir um documento.",
    "csi": "",
    "nps": "",
    "notes_en": "Local web portal for sharing UX results. Spreadsheet-backed. No CSI or NPS.",
    "notes_detail_en": "Built so research output stays browsable. Updating a spreadsheet updates the portal on reload.",
    "notes_pt": "Portal web local para compartilhar resultados de UX. Alimentado por planilhas. Sem CSI ou NPS.",
    "notes_detail_pt": "Feito para que a entrega de pesquisa continue navegável. Atualizar a planilha atualiza o portal ao recarregar.",
}

buf = io.StringIO()
writer = csv.DictWriter(
    buf, fieldnames=fieldnames, lineterminator="\n", extrasaction="ignore"
)
added = []
for row in (workspace, portal):
    if row["id"] in existing:
        continue
    writer.writerow(row)
    added.append(buf.getvalue().rstrip("\n").split("\n")[-1])

if not added:
    raise SystemExit("already present")

lines = text.splitlines()
lines.extend(added)
out = newline.join(lines)
if text.endswith(("\n", "\r\n")):
    out += newline
path.write_text(out, encoding="utf-8")
print(
    "added",
    ", ".join(row["id"] for row in (workspace, portal) if row["id"] not in existing),
)
