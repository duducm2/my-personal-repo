from pathlib import Path

BLOCK = """        <section id="deliverables" data-chapter="Deliverables">
          <p class="kicker">05</p>
          <h2 id="deliverables-title" data-i18n="deliverablesTitle">Deliverables</h2>
          <p id="deliverables-lead" data-i18n="deliverablesLead">
            These are the pieces I shipped. They stay on this page whichever
            role you opened.
          </p>
          <h3 id="ux-title" data-i18n="uxTitle">UX Super</h3>
          <p id="ux-lead" data-i18n="uxLead">
            A portal for the UX practice. It keeps each business with its
            offerings, personas, and opportunities, and it tracks project KPIs
            from a baseline to a target.
          </p>
          <div class="shots shots-two">
            <figure class="zoom">
              <img
                src="../media/ux-super-businesses.jpg"
                alt="UX Super businesses view, with offerings, personas, and opportunities"
              />
              <figcaption data-i18n="uxCapBusinesses">UX Super, businesses</figcaption>
            </figure>
            <figure class="zoom">
              <img
                src="../media/ux-super-kpis.jpg"
                alt="UX Super project KPIs, with baseline and target"
              />
              <figcaption data-i18n="uxCapKpis">UX Super, project KPIs</figcaption>
            </figure>
          </div>
          <ul class="plain" id="deliverable-list">
            <li data-i18n="deliverable0">
              Tooling for Power Tools, from requirements through high-fidelity
              prototypes.
            </li>
            <li data-i18n="deliverable1">
              CIP research report, and the relevance model used in ServiceNow.
            </li>
            <li data-i18n="deliverable2">
              Power BI for allocation, training, and the TrustMate study.
            </li>
            <li data-i18n="deliverable3">
              A results portal that publishes UX findings as cards, a
              recommendations library, and a task timeline, instead of a static
              PDF.
            </li>
          </ul>
        </section>

"""
ANCHOR = '        <section id="model" data-chapter="Model">'

for key in ("data-analyst", "product-owner", "digital-solution-architect"):
    path = Path("docs") / key / "index.html"
    html = path.read_text(encoding="utf-8")
    for number in range(10, 4, -1):
        old = f'<p class="kicker">{number:02d}</p>'
        new = f'<p class="kicker">{number + 1:02d}</p>'
        if html.count(old) != 1:
            raise SystemExit(f"{key} kicker {number} count {html.count(old)}")
        html = html.replace(old, new, 1)
    if ANCHOR not in html:
        raise SystemExit(f"model missing in {key}")
    html = html.replace(ANCHOR, BLOCK + ANCHOR, 1)
    path.write_text(html, encoding="utf-8")
    print("updated", key)
