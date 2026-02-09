// =============================================================================
// RESUME LAYOUT — Do not edit for content changes. Edit content.typ only.
// Grid: 32% / 68%. Typography and spacing are fixed for CV Ref.pdf fidelity.
// =============================================================================

#import "content.typ": name, tagline, phone, email, linkedin, linkedin-url, location, profile, strengths, languages, skills, experience, education, publications, additional

#set page(paper: "a4", margin: (left: 0.6in, right: 0.6in, top: 0.5in, bottom: 0.5in))
#set text(font: "Linux Libertine", size: 9pt)
#set par(leading: 0.65em, spacing: 0.4em)

// Section title style (uppercase, bold, small caps feel)
#let section-title(body) = {
  set text(size: 8.5pt, weight: "bold")
  block(above: 0.6em, below: 0.35em)[#block(body)]
}

// Left column: subtle background (optional; match ref)
#let sidebar-block(body) = {
  block(fill: rgb("#f5f5f5"), inset: 0.5em, width: 100%)[#body]
}

#grid(
  columns: (0.32fr, 0.68fr),
  gutter: 1em,
  align: (left, left),
  // Row 1: header spanning both columns
  grid.cell(colspan: 2)[
    #block(bottom: 0.4em)[
      #text(size: 18pt, weight: "bold")[#name]
    ]
    #block(bottom: 0.2em)[
      #text(size: 8pt)[#phone \quad #email \quad #link(url: linkedin-url)[#linkedin] \quad #location]
    ]
    #text(size: 8pt, weight: "bold")[#tagline]
    #block(bottom: 0.5em)[
      #line(length: 100%, stroke: 0.5pt + gray)
    ]
  ],
  // Left column: Profile, Strengths, Languages, Skills
  [
    #section-title[Profile]
    #block(width: 100%)[#profile.at(0)]
    #section-title[Strengths]
    #block(width: 100%)[#strengths.at(0)]
    #section-title[Languages]
    #for lang in languages [#lang \quad]
    #section-title[Skills]
    #for (cat, sub) in skills [
      #block(above: 0.25em)[
        #strong[#cat] #sub.join(", ")
      ]
    ]
  ],
  // Right column: Experience, Education, Publications, Additional
  [
    #section-title[EXPERIENCE]
    #for (date, company, title, bullets) in experience [
      #block(above: 0.5em, below: 0.3em)[
        #text(weight: "bold")[(#date)] #text(weight: "bold")[#company]
        #text(style: "italic")[#title]
        #for b in bullets [#block(inset: (left: 1em))[#b]]
      ]
    ]
    #section-title[EDUCATION]
    #for (degree, inst, thesis) in education [
      #block(above: 0.3em)[
        #strong[#degree] #inst
        #if thesis != "" [#block(inset: (left: 0.5em))[#thesis]]
      ]
    ]
    #section-title[SELECTED PUBLICATIONS]
    #for (venue, desc) in publications [
      #block(above: 0.25em)[#strong[#venue] #desc]
    ]
    #section-title[ADDITIONAL]
    #for a in additional [#block(above: 0.15em)[#a]]
  ]
)
