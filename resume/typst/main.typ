// =============================================================================
// RESUME LAYOUT — Do not edit for content changes. Edit content.typ only.
// Two-column grid (32% Sidebar / 68% Main) per refactor_cv_layout_e4f9a2 plan.
// =============================================================================

#import "content.typ": *

// -----------------------------------------------------------------------------
// 1. Setup and Global Styles (Plan §1)
// -----------------------------------------------------------------------------
#set page(
  paper: "a4",
  margin: (left: 0.4cm, right: 0.4cm, top: 0.4cm, bottom: 0.4cm)
)
// Lato: put Lato *.ttf (e.g. Lato-Regular, Lato-Bold, Lato-Italic) in typst/fonts/ and compile with --font-path
#set text(font: "Lato", size: 10pt)
#set par(leading: 1.2em, spacing: 0.7em)

// Palette: grey + brownish-beige (Alfredo-style); accent for optional highlight
#let sidebar-header-bg = rgb("#fff")
#let accent-line = rgb("#7A5C3A")
#let accent-color = rgb("#6A0DAD")
#let footer-bg = rgb("#2c3e50")
#let heading-color = rgb("#2D2D2D")
#let sidebar-bg = rgb("#F5F5F5")

// Section title: uppercase, bold, dark grey; accent line below (main column)
// Explicit stroke paint so accent color renders in PDF
#let section-title(body) = {
  set text(size: 9pt, weight: "bold", fill: heading-color)
  block(above: 0.6em, below: 0.25em)[#block(body)]
  block(below: 0.25em)[#line(length: 2.5em, stroke: (paint: accent-line, thickness: 0.6pt))]
}

// Sidebar subsection: bold, dark grey; short accent line below
#let sidebar-heading(body) = {
  set text(size: 9pt, weight: "bold", fill: heading-color)
  block(above: 0.5em, below: 0.2em)[#block(body)]
  block(below: 0.15em)[#line(length: 1.5em, stroke: (paint: accent-line, thickness: 0.5pt))]
}
// Sidebar body text: slightly smaller, comfortable line height
#let sidebar-text(body) = {
  set text(size: 9pt, fill: rgb("#444444"))
  set par(leading: 1.4em, spacing: 0.55em)
  body
}

// -----------------------------------------------------------------------------
// 2. Layout Structure (Grid) — Plan §2
// -----------------------------------------------------------------------------
#grid(
  columns: (32%, 1fr),
  gutter: 2em,
  align: (left, left),
  // -------------------------------------------------------------------------
  // 3. Left Column (Sidebar) — full-height light grey background to remove empty gap
  // -------------------------------------------------------------------------
  [
    #block(fill: sidebar-bg, width: 100%, height: 98%, inset: (left: 0.6em, right: 0.6em, top: 0.6em, bottom: 0.6em), stroke: (paint: rgb("#D3D3D3"), thickness: 1pt))[
      // Photo: width 90% of container, rectangular, margins, container visible
      #block(width: 100%, inset: 0.75em, below: 0.9em)[
        #align(center)[
          #box(
            width: 100%,
            height: 7.7em,
            stroke: (paint: rgb("#2c3e50"), thickness: 4pt),
            clip: true
          )[#align(bottom)[#image("pictures/my-photo-rectangle.png", width: 100%, height: 8.2em)]]
        ]
      ]
      // Contact (short labels before each line)
      #sidebar-heading[Contact]
      #block(below: 0.6em)[#text(weight: "bold", size: 9pt, fill: heading-color)[Ph.] #h(0.5em) #text(size: 9pt)[#phone]]
      #block(below: 0.55em)[#text(weight: "bold", size: 9pt, fill: heading-color)[E-mail] #h(0.5em) #text(size: 9pt)[#email]]
      #block(below: 0.55em)[#text(weight: "bold", size: 9pt, fill: heading-color)[LinkedIn] #h(0.5em) #link(linkedin-url)[#text(size: 9pt, fill: rgb("#2c3e50"))[#linkedin]]]
      #block(below: 1.2em)[#text(weight: "bold", size: 9pt, fill: heading-color)[Location] #h(0.5em) #text(size: 9pt)[#location]]
      // Profile & Strengths
      #sidebar-heading[Profile]
      #block(width: 100%, below: 1em)[#sidebar-text[#profile]]
      #sidebar-heading[Strengths]
      #block(width: 100%, below: 1.3em)[#sidebar-text[#strengths]]
    // Languages
    #sidebar-heading[Languages]
    #block(below: 0.5em)[
      #for lang in languages [#text(size: 9pt, fill: rgb("#444444"))[#lang] #linebreak()]
    ]
    #block(below: 1.2em)[]
    // Skills (category + bulleted items)
    #sidebar-heading[Skills]
    #for (cat, sub) in skills [
      #block(above: 0.65em)[
        #text(weight: "bold", size: 9pt, fill: heading-color)[#cat]
        #linebreak()
        #for item in sub [#block(inset: (left: 0.75em), above: 0.35em)[#text(size: 9pt, fill: rgb("#444444"))[• #item]]]
      ]
    ]
    ]
  ],
  // -------------------------------------------------------------------------
  // 4. Right Column (Main Content)
  // -------------------------------------------------------------------------
  [
    // Header: name (tighter line spacing), then accent line, tagline
    #block(above: 0em, below: 0.15em)[
      #set par(leading: 0.72em)
      #text(size: 20pt, weight: "bold", fill: heading-color)[#upper(name)]
    ]
    #block(below: 0.2em)[
      #line(length: 2.5em, stroke: (paint: accent-line, thickness: 0.6pt))
    ]
    #block(below: 0.4em)[
      #text(size: 12pt, fill: heading-color)[#upper(tagline)]
    ]
    #block(below: 0.9em)[
      #line(length: 100%, stroke: (paint: gray, thickness: 0.4pt))
    ]
    // Experience
    #section-title[EXPERIENCE]
    #for (date, company, title, bullets) in experience [
      #block(above: 1em, below: 0.9em)[
        #grid(columns: (1fr, auto), gutter: 1em, align: (left, right))[
          #text(weight: "bold", fill: heading-color)[#company]
          #text(weight: "bold", fill: gray)[#date]
        ]
        #block(above: 0.2em)[#text(style: "italic", fill: heading-color)[#title]]
        #block(above: 0.5em)[
          #for b in bullets [#block(inset: (left: 1em), above: 0.45em)[#text(fill: heading-color)[• #b]]]
        ]
      ]
    ]
    #block(above: 0.5em, below: 0.25em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    // Education
    #section-title[EDUCATION]
    #for (degree, inst, thesis) in education [
      #block(above: 0.75em)[
        #strong[#degree] #inst
        #if thesis != none [#block(inset: (left: 0.5em), above: 0.4em)[#text(size: 9pt, style: "italic", fill: gray)[#thesis]]]
      ]
    ]
    #block(above: 0.4em, below: 0.2em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    // Publications
    #section-title[SELECTED PUBLICATIONS]
    #for (venue, desc) in publications [
      #block(above: 0.65em)[#strong[#venue] #desc]
    ]
    #block(above: 0.4em, below: 0.2em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    // Additional
    #section-title[ADDITIONAL]
    #for a in additional [#block(above: 0.6em)[#a]]
  ]
)

// Full-width dark footer bar (reduced top space to help fit one page)
#block(above: 1em, width: 100%, height: 0.45em, fill: footer-bg)[]
