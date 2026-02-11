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
#set text(font: "Times New Roman", size: 10pt)
#set par(leading: 0.88em, spacing: 0.52em)

// Palette: grey + brownish-beige (Alfredo-style); accent for optional highlight
#let sidebar-header-bg = rgb("#E0E0E0")
#let accent-line = rgb("#7A5C3A")
#let accent-color = rgb("#6A0DAD")
#let footer-bg = rgb("#004170")
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
    #block(fill: sidebar-bg, width: 100%, height: 98%, inset: (left: 0.6em, right: 0.6em, top: 0.6em, bottom: 0.6em))[
      // Grey header block: photo only (square, border, centered)
      #block(fill: sidebar-header-bg, inset: 0.75em, below: 0.9em)[
        #align(center)[
          #box(
            width: 8.5em,
            height: 8.5em,
            stroke: (paint: rgb("#004170"), thickness: 10pt)
          )[#image("pictures/my-photo.png", width: 8.5em, height: 8.5em)]
        ]
      ]
      // Contact (short labels before each line)
      #sidebar-heading[Contact]
      #block(below: 0.45em)[#text(weight: "bold", size: 9pt)[Ph.] \quad #phone]
      #block(below: 0.3em)[#text(weight: "bold", size: 9pt)[E-mail] \quad #email]
      #block(below: 0.3em)[#text(weight: "bold", size: 9pt)[LinkedIn] \quad #link(linkedin-url)[#linkedin]]
      #block(below: 0.9em)[#text(weight: "bold", size: 9pt)[Location] \quad #location]
      // Profile & Strengths
      #sidebar-heading[Profile]
      #block(width: 100%, below: 0.6em)[#profile]
      #sidebar-heading[Strengths]
      #block(width: 100%, below: 0.9em)[#strengths]
      // Languages
      #sidebar-heading[Languages]
      #block(below: 0.3em)[
        #for lang in languages [#lang #linebreak()]
      ]
      #block(below: 0.9em)[]
      // Skills (category + bulleted items)
      #sidebar-heading[Skills]
      #for (cat, sub) in skills [
        #block(above: 0.4em)[
          #text(weight: "bold", fill: heading-color)[#cat]
          #linebreak()
          #for item in sub [#block(inset: (left: 0.75em), above: 0.12em)[• #item]]
        ]
      ]
    ]
  ],
  // -------------------------------------------------------------------------
  // 4. Right Column (Main Content)
  // -------------------------------------------------------------------------
  [
    // Header (Plan §4): name 20pt, tagline 12pt; accent line under name
    #block(below: 0.35em)[
      #text(size: 20pt, weight: "bold", fill: heading-color)[#upper(name)]
    ]
    #block(below: 0.25em)[
      #line(length: 2.5em, stroke: (paint: accent-line, thickness: 0.6pt))
    ]
    #block(below: 0.5em)[
      #text(size: 12pt, fill: heading-color)[#upper(tagline)]
    ]
    #block(below: 0.9em)[
      #line(length: 100%, stroke: (paint: gray, thickness: 0.4pt))
    ]
    // Experience
    #section-title[EXPERIENCE]
    #for (date, company, title, bullets) in experience [
      #block(above: 0.65em, below: 0.55em)[
        #grid(columns: (1fr, auto), gutter: 1em, align: (left, right))[
          #text(weight: "bold", fill: heading-color)[#company]
          #text(weight: "bold", fill: gray)[#date]
        ]
        #block(above: 0.15em)[#text(style: "italic", fill: heading-color)[#title]]
        #block(above: 0.4em)[
          #for b in bullets [#block(inset: (left: 1em), above: 0.22em)[#text(fill: heading-color)[• #b]]]
        ]
      ]
    ]
    #block(above: 0.5em, below: 0.25em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    // Education
    #section-title[EDUCATION]
    #for (degree, inst, thesis) in education [
      #block(above: 0.45em)[
        #strong[#degree] #inst
        #if thesis != "" [#block(inset: (left: 0.5em), above: 0.2em)[#text(size: 9pt, style: "italic", fill: gray)[#thesis]]]
      ]
    ]
    #block(above: 0.4em, below: 0.2em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    // Publications
    #section-title[SELECTED PUBLICATIONS]
    #for (venue, desc) in publications [
      #block(above: 0.4em)[#strong[#venue] #desc]
    ]
    #block(above: 0.4em, below: 0.2em)[#line(length: 100%, stroke: (paint: gray, thickness: 0.35pt))]
    // Additional
    #section-title[ADDITIONAL]
    #for a in additional [#block(above: 0.35em)[#a]]
  ]
)

// Full-width dark footer bar (reduced top space to help fit one page)
#block(above: 1em, width: 100%, height: 0.45em, fill: footer-bg)[]
