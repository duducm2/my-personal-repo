// =============================================================================
// RESUME LAYOUT — Do not edit for content changes. Edit content.typ only.
// Two-column grid (32% Sidebar / 68% Main) matching CV Ref.pdf.
// =============================================================================

#import "content.typ": *

// -----------------------------------------------------------------------------
// 1. Setup and Global Styles
// -----------------------------------------------------------------------------
#set page(
  paper: "a4",
  margin: (left: 1.2cm, right: 1.2cm, top: 1.2cm, bottom: 1.2cm)
)
#set text(font: "Arial", size: 10pt)
#set par(leading: 0.72em, spacing: 0.42em)

// Palette (reference resume: grey + brownish-beige accents)
// Use explicit stroke paint so PDF shows color; slightly stronger brown for visibility
#let sidebar-header-bg = rgb("#E0E0E0")
#let accent-line = rgb("#7A5C3A")
#let footer-bg = rgb("#333333")
#let heading-color = rgb("#2D2D2D")

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
// 2. Layout Structure (Grid)
// -----------------------------------------------------------------------------
#grid(
  columns: (32%, 1fr),
  gutter: 1.75em,
  align: (left, left),
  // -------------------------------------------------------------------------
  // 3. Left Column (Sidebar)
  // -------------------------------------------------------------------------
  [
    // Grey header block: photo only (square, border, centered)
    #block(fill: sidebar-header-bg, inset: 0.75em, below: 0.9em)[
      #align(center)[
        #box(
          width: 8.5em,
          height: 8.5em,
          stroke: (paint: gray, thickness: 0.5pt)
        )[#image("pictures/my-photo.png", width: 8.5em, height: 8.5em)]
      ]
    ]
    // Contact (short labels before each line)
    #sidebar-heading[Contact]
    #block(below: 0.45em)[#text(weight: "bold", size: 9pt)[Ph.] \quad #phone]
    #block(below: 0.25em)[#text(weight: "bold", size: 9pt)[E-mail] \quad #email]
    #block(below: 0.25em)[#text(weight: "bold", size: 9pt)[LinkedIn] \quad #link(linkedin-url)[#linkedin]]
    #block(below: 0.9em)[#text(weight: "bold", size: 9pt)[Location] \quad #location]
    // Profile & Strengths
    #sidebar-heading[Profile]
    #block(width: 100%, below: 0.5em)[#profile]
    #sidebar-heading[Strengths]
    #block(width: 100%, below: 0.9em)[#strengths]
    // Languages
    #sidebar-heading[Languages]
    #block(below: 0.25em)[
      #for lang in languages [#lang #linebreak()]
    ]
    #block(below: 0.9em)[]
    // Skills (category + bulleted items)
    #sidebar-heading[Skills]
    #for (cat, sub) in skills [
      #block(above: 0.35em)[
        #text(weight: "bold", fill: heading-color)[#cat]
        #linebreak()
        #for item in sub [#block(inset: (left: 0.75em))[• #item]]
      ]
    ]
  ],
  // -------------------------------------------------------------------------
  // 4. Right Column (Main Content)
  // -------------------------------------------------------------------------
  [
    // Header: name (uppercase) + accent line + tagline (smaller, uppercase, dark)
    #block(below: 0.35em)[
      #text(size: 18pt, weight: "bold", fill: heading-color)[#upper(name)]
    ]
    #block(below: 0.25em)[
      #line(length: 2.5em, stroke: (paint: accent-line, thickness: 0.6pt))
    ]
    #block(below: 0.45em)[
      #text(size: 9.5pt, fill: heading-color)[#upper(tagline)]
    ]
    #block(below: 0.9em)[
      #line(length: 100%, stroke: (paint: accent-line, thickness: 0.5pt))
    ]
    // Experience
    #section-title[EXPERIENCE]
    #for (date, company, title, bullets) in experience [
      #block(above: 0.45em, below: 0.35em)[
        #grid(columns: (1fr, auto), gutter: 1em, align: (left, right))[
          #text(weight: "bold", fill: heading-color)[#company]
          #text(weight: "bold", fill: gray)[#date]
        ]
        #text(style: "italic", fill: heading-color)[#title]
        #block(above: 0.25em)[
          #for b in bullets [#block(inset: (left: 1em), above: 0.1em)[#text(fill: heading-color)[• #b]]]
        ]
      ]
    ]
    // Education
    #section-title[EDUCATION]
    #for (degree, inst, thesis) in education [
      #block(above: 0.3em)[
        #strong[#degree] #inst
        #if thesis != "" [#block(inset: (left: 0.5em), above: 0.12em)[#text(size: 9pt, style: "italic", fill: gray)[#thesis]]]
      ]
    ]
    // Publications
    #section-title[SELECTED PUBLICATIONS]
    #for (venue, desc) in publications [
      #block(above: 0.25em)[#strong[#venue] #desc]
    ]
    // Additional
    #section-title[ADDITIONAL]
    #for a in additional [#block(above: 0.15em)[#a]]
  ]
)

// Full-width dark footer bar (reduced top space to help fit one page)
#block(above: 1em, width: 100%, height: 0.45em, fill: footer-bg)[]
