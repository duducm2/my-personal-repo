// =============================================================================
// RESUME LAYOUT — Product Owner variant entry.
// Content: content.typ in this folder. Photo: shared from resume/typst/pictures/.
// General resume layout source remains resume/typst/main.typ (unchanged).
// =============================================================================

#import sys.inputs.at("content", default: "content.en.typ"): *

// -----------------------------------------------------------------------------
// 1. Setup and Global Styles (Plan §1)
// -----------------------------------------------------------------------------
#set page(
  paper: "a4",
  margin: (left: 0.4cm, right: 0.4cm, top: 0.4cm, bottom: 0.4cm)
)
// Lato: put Lato *.ttf in resume/typst/fonts/ and compile with --font-path
#set text(font: "Lato", size: 10pt)
#set par(leading: 1.2em, spacing: 0.7em)

#let sidebar-header-bg = rgb("#fff")
#let accent-line = rgb("#7A5C3A")
#let accent-color = rgb("#6A0DAD")
#let footer-bg = rgb("#34495e")
#let heading-color = rgb("#2D2D2D")
#let sidebar-bg = rgb("#F5F5F5")
#let highlight-blue = rgb("#34495e")
#let pill-bg = rgb("#E8EEF2")

#show strong: it => text(weight: "bold", fill: highlight-blue)[#it]

#let section-title(body) = {
  set text(size: 9pt, weight: "bold", fill: highlight-blue)
  block(above: 0.75em, below: 0.9em)[#block(body)]
}

#let sidebar-heading(body) = {
  set text(size: 9pt, weight: "bold", fill: highlight-blue)
  block(above: 0.4em, below: 0.3em)[#block(body)]
  block(below: 0.65em)[#line(length: 1.5em, stroke: (paint: highlight-blue, thickness: 0.5pt))]
}

#let sidebar-text(body) = {
  set text(size: 9pt, fill: rgb("#444444"))
  set par(leading: 1.62em, spacing: 0.62em)
  body
}

#grid(
  columns: (32%, 1fr),
  gutter: 2em,
  align: (left, left),
  [
    #block(fill: sidebar-bg, width: 100%, height: 98%, inset: (left: 0.8em, right: 0.8em, top: 0.6em, bottom: 0.6em), stroke: (paint: rgb("#D3D3D3"), thickness: 1pt))[
      #block(width: 100%, inset: 0.5em, below: 0.6em)[
        #align(center)[
          #box(
            width: 100%,
            height: 7.7em,
            stroke: (paint: highlight-blue, thickness: 4pt),
            clip: true
          )[#align(bottom)[#image("../../typst/pictures/my-photo-rectangle.png", width: 100%, height: 8.2em)]]
        ]
      ]
      #sidebar-heading[#ui.contact]
      #block(below: 0.45em)[#text(weight: "bold", size: 9pt, fill: highlight-blue)[#ui.phone_abbr] #h(0.5em) #text(size: 9pt)[#phone]]
      #block(below: 0.45em)[#link("mailto:" + email)[#text(size: 7.5pt, fill: highlight-blue)[#email]]]
      #block(above: 1.05em, below: 1.65em)[
        #grid(
          columns: (1fr, 1fr, 1fr),
          gutter: 0.35em,
          align: (center, center, center),
          [#link(linkedin-url)[#text(size: 9pt, fill: highlight-blue)[#linkedin]]],
          [#link(lattes-url)[#text(size: 9pt, fill: highlight-blue)[#lattes]]],
          [#link(orcid-url)[#text(size: 9pt, fill: highlight-blue)[#orcid]]],
        )
      ]
      #block(below: 0.9em)[#text(weight: "bold", size: 9pt, fill: highlight-blue)[#ui.location:] #h(0.5em) #text(size: 9pt)[#location]]
      #sidebar-heading[#ui.profile]
      #block(width: 100%, below: 0.75em)[#sidebar-text[#profile]]
    #sidebar-heading[#ui.languages]
    #block(below: 0.4em)[
      #text(size: 9pt, fill: rgb("#444444"))[#languages]
    ]
    #block(below: 0.5em)[]
    #sidebar-heading[#ui.skills]
    #for (key, cat, sub) in skills [
      #block(above: 0.65em)[
        #text(weight: "bold", size: 9pt, fill: highlight-blue)[#cat]
        #linebreak()
        #if key == "Tech" [
          #block(above: 0.3em)[
            #columns(2, gutter: 0.4em)[
              #for (i, item) in sub.enumerate() [
                #if i == ((sub.len() + 1) / 2) [#colbreak()]
                #block(fill: pill-bg, radius: 0.18em, inset: (left: 0.25em, right: 0.25em, top: 0.08em, bottom: 0.08em), below: 0.22em)[#text(size: 9pt, fill: rgb("#444444"))[#item]]
              ]
            ]
          ]
        ] else [
          #for item in sub [#block(inset: (left: 0.75em), above: 0.4em)[#text(size: 9pt, fill: rgb("#444444"))[• #item]]]
        ]
      ]
    ]
    ]
  ],
  [
    #block(above: 0em, below: 0.6em)[
      #set par(leading: 0.72em)
        #text(size: 20pt, weight: "bold", fill: highlight-blue)[#upper(name)]
    ]
    #block(below: 0.35em)[
      #line(length: 2.5em, stroke: (paint: highlight-blue, thickness: 0.6pt))
    ]
    #block(below: 0.5em)[
      #text(size: 12pt, fill: highlight-blue)[#upper(tagline)]
    ]
    #block(below: 1.1em)[
      #line(length: 100%, stroke: (paint: gray, thickness: 0.4pt))
    ]
    #section-title[#ui.experience]
    #for (date, company, title, bullets) in experience [
      #block(above: 1em, below: 0.9em)[
        #grid(columns: (1fr, auto), gutter: 1em, align: (left, right))[
          #text(weight: "bold", fill: highlight-blue)[#company]
          #text(weight: "bold", fill: rgb("#555555"))[#date]
        ]
        #block(above: 0.2em)[#text(style: "italic", fill: highlight-blue)[#title]]
        #block(above: 0.5em)[
          #set par(leading: 1.2em)
          #for b in bullets [#block(inset: (left: 1em), above: 0.5em)[#text(fill: heading-color)[• #b]]]
        ]
      ]
    ]
    #block(above: 0.7em, below: 0.35em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    #section-title[#ui.education]
    #for (degree, inst, thesis) in education [
      #block(above: 0.75em)[
        #strong[#degree] #inst
        #if thesis != none [#block(inset: (left: 0.5em), above: 0.4em)[#text(size: 9pt, style: "italic", fill: rgb("#444444"))[#thesis]]]
      ]
    ]
    #block(above: 0.7em, below: 0.35em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    #section-title[#ui.publications]
    #for (venue, desc) in publications [
      #block(above: 0.65em)[#strong[#venue] #desc]
    ]
    #block(above: 0.7em, below: 0.35em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    #section-title[#ui.additional]
    #for a in additional [#block(above: 0.6em)[#a]]
  ]
)

#block(above: 1em, width: 100%, height: 0.45em, fill: footer-bg)[]
