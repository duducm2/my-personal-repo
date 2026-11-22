// =============================================================================
// RESUME LAYOUT — Do not edit for content changes. Edit content.typ only.
// HARD RULE: every resume must fit on ONE A4 page (compact-layout always on).
// Two-column grid (32% Sidebar / 68% Main)
// =============================================================================

#import sys.inputs.at("content", default: "content.en.typ"): *

// -----------------------------------------------------------------------------
// 1. Setup and Global Styles
// -----------------------------------------------------------------------------
#let page-margin = if compact-layout {
  (left: 0.38cm, right: 0.38cm, top: 0.38cm, bottom: 0.38cm)
} else {
  (left: 0.4cm, right: 0.4cm, top: 0.4cm, bottom: 0.4cm)
}
#set page(paper: "a4", margin: page-margin)
#set text(font: "Lato", size: 10pt)
#set par(leading: 0.58em, spacing: 0em)

// Palette: grey + brownish-beige (Alfredo-style); accent for optional highlight
#let sidebar-header-bg = rgb("#fff")
#let accent-line = rgb("#7A5C3A")
#let accent-color = rgb("#6A0DAD")
#let footer-bg = rgb("#34495e")
#let heading-color = rgb("#2D2D2D")
#let sidebar-bg = rgb("#F5F5F5")
#let highlight-blue = rgb("#34495e")
#let pill-bg = rgb("#E8EEF2")

#show strong: it => text(weight: "bold", fill: highlight-blue)[#it]

#let sec-title-above = if compact-layout { 0.48em } else { 0.58em }
#let sec-title-below = if compact-layout { 0.42em } else { 0.54em }
#let exp-role-above = if compact-layout { 0.62em } else { 0.68em }
#let exp-role-below = if compact-layout { 0.28em } else { 0.36em }
#let role-title-above = if compact-layout { 0.35em } else { 0.38em }
#let role-title-below = if compact-layout { 0.32em } else { 0.36em }
#let bullet-above = if compact-layout { 0.34em } else { 0.42em }
#let edu-above = if compact-layout { 0.44em } else { 0.52em }
#let edu-thesis-above = if compact-layout { 0.28em } else { 0.34em }
#let divider-above = if compact-layout { 0.34em } else { 0.42em }
#let divider-below = if compact-layout { 0.22em } else { 0.28em }
#let pub-above = if compact-layout { 0.36em } else { 0.42em }
#let add-above = if compact-layout { 0.34em } else { 0.40em }
#let footer-above = if compact-layout { 0.40em } else { 0.50em }
#let sidebar-head-above = if compact-layout { 0.42em } else { 0.46em }
#let sidebar-head-below = if compact-layout { 0.22em } else { 0.26em }
#let sidebar-head-line = if compact-layout { 0.44em } else { 0.50em }

#let section-title(body) = {
  set text(size: 9pt, weight: "bold", fill: highlight-blue)
  block(above: sec-title-above, below: sec-title-below)[#block(body)]
}

#let sidebar-heading(body) = {
  set text(size: 9pt, weight: "bold", fill: highlight-blue)
  block(above: sidebar-head-above, below: sidebar-head-below)[#block(body)]
  block(below: sidebar-head-line)[#line(length: 1.5em, stroke: (paint: highlight-blue, thickness: 0.5pt))]
}

#let sidebar-text(body) = {
  set text(size: 8.5pt, fill: rgb("#444444"))
  set par(leading: 0.58em, spacing: 0em)
  body
}

#let body-emphasis(it) = text(weight: "bold", fill: highlight-blue)[#it]

#let body-prose(body) = {
  set text(size: 9.5pt, fill: heading-color)
  set par(leading: 0.58em, spacing: 0em)
  show strong: body-emphasis
  body
}

#let bullet-item(body) = block(
  above: bullet-above,
  below: 0.04em,
)[
  #grid(
    columns: (0.55em, 1fr),
    gutter: 0.35em,
    align: (top + right, left),
    [•],
    [#body-prose[#body]],
  )
]

// -----------------------------------------------------------------------------
// 2. Layout Structure (Grid)
// -----------------------------------------------------------------------------
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
          )[#align(bottom)[#image("/resume/typst/pictures/my-photo-rectangle.png", width: 100%, height: 8.2em)]]
        ]
      ]
      #sidebar-heading[#ui.contact]
      #block(below: 0.45em)[#text(weight: "bold", size: 9pt, fill: highlight-blue)[#ui.phone_abbr] #h(0.5em) #text(size: 9pt)[#phone]]
      #block(below: 0.45em)[#link("mailto:" + email)[#text(size: 7.5pt, fill: highlight-blue)[#email]]]
      #block(above: 0.45em, below: 0.55em)[
        #grid(
          columns: (1fr, 1fr, 1fr),
          gutter: 0.35em,
          align: (center, center, center),
          [#link(linkedin-url)[#text(size: 9pt, fill: highlight-blue)[#linkedin]]],
          [#link(lattes-url)[#text(size: 9pt, fill: highlight-blue)[#lattes]]],
          [#link(portfolio-url)[#text(size: 9pt, fill: highlight-blue)[#portfolio]]],
        )
      ]
      #block(below: 0.55em)[#text(weight: "bold", size: 9pt, fill: highlight-blue)[#ui.location:] #h(0.5em) #text(size: 9pt)[#location]]
      #sidebar-heading[#ui.profile]
      #block(width: 100%, below: 0.5em)[#sidebar-text[#profile]]
      #sidebar-heading[#ui.languages]
      #block(below: 0.3em)[
        #text(size: 9pt, fill: rgb("#444444"))[#languages]
      ]
      #block(below: 0.35em)[]
      #sidebar-heading[#ui.skills]
      #for (key, cat, sub) in skills [
        #block(above: 0.4em)[
          #text(weight: "bold", size: 9pt, fill: highlight-blue)[#cat]
          #linebreak()
          #if key == "Tech" [
            #block(above: 0.2em)[
              #columns(2, gutter: 0.4em)[
                #for (i, item) in sub.enumerate() [
                  #if i == calc.ceil(sub.len() / 2) [#colbreak()]
                  #block(fill: pill-bg, radius: 0.18em, inset: (left: 0.25em, right: 0.25em, top: 0.08em, bottom: 0.08em), below: 0.18em)[#text(size: 8.5pt, fill: rgb("#444444"))[#item]]
                ]
              ]
            ]
          ] else [
            #for item in sub [#block(inset: (left: 0.75em), above: 0.28em)[#text(size: 9pt, fill: rgb("#444444"))[• #item]]]
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
    #block(below: 0.6em)[
      #text(size: 12pt, fill: highlight-blue)[#upper(tagline)]
    ]
    #block(below: 0.6em)[
      #line(length: 100%, stroke: (paint: gray, thickness: 0.4pt))
    ]
    #section-title[#ui.experience]
    #for (date, company, title, bullets) in experience [
      #block(above: exp-role-above, below: exp-role-below)[
        #grid(columns: (1fr, auto), gutter: 1em, align: (left, right))[
          #text(weight: "bold", fill: highlight-blue)[#company]
          #text(weight: "bold", fill: rgb("#555555"))[#date]
        ]
        #block(above: role-title-above, below: role-title-below)[#text(style: "italic", fill: highlight-blue)[#title]]
        #for b in bullets [#bullet-item[#b]]
      ]
    ]
    #block(above: divider-above, below: divider-below)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    #section-title[#ui.education]
    #for (degree, inst, thesis) in education [
      #block(above: edu-above, below: 0.12em)[
        #strong[#degree] #inst
        #if thesis != none [
          #block(inset: (left: 0.65em), above: edu-thesis-above)[
            #set text(size: 9pt, style: "italic", fill: rgb("#444444"))
            #set par(leading: 0.58em, spacing: 0em)
            #thesis
          ]
        ]
      ]
    ]
    #block(above: divider-above, below: divider-below)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    #section-title[#ui.publications]
    #for (venue, desc) in publications [
      #block(above: pub-above)[#body-prose[#strong[#venue] #desc]]
    ]
    #block(above: divider-above, below: divider-below)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    #section-title[#ui.additional]
    #for a in additional [#block(above: add-above)[#body-prose[#a]]]
  ]
)

#block(above: footer-above, width: 100%, height: 0.45em, fill: footer-bg)[]
