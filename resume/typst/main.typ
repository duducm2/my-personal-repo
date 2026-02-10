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
  margin: (left: 1.5cm, right: 1.5cm, top: 1.5cm, bottom: 1.5cm)
)
#set text(font: "Times New Roman", size: 10pt)
#set par(leading: 0.7em, spacing: 0.45em)

#let accent = rgb("#6A0DAD")

// Section title: uppercase, bold, accent (for main column)
#let section-title(body) = {
  set text(size: 9pt, weight: "bold", fill: accent)
  block(above: 0.7em, below: 0.4em)[#block(body)]
}

// Sidebar subsection (smaller, bold, no accent)
#let sidebar-heading(body) = {
  set text(size: 9pt, weight: "bold")
  block(above: 0.5em, below: 0.25em)[#block(body)]
}

// -----------------------------------------------------------------------------
// 2. Layout Structure (Grid)
// -----------------------------------------------------------------------------
#grid(
  columns: (32%, 1fr),
  gutter: 2em,
  align: (left, left),
  // -------------------------------------------------------------------------
  // 3. Left Column (Sidebar)
  // -------------------------------------------------------------------------
  [
    // Photo placeholder
    #block(below: 1em)[
      #box(
        radius: 50%,
        fill: rgb("#e0e0e0"),
        width: 4em,
        height: 4em
      )[#align(center + horizon)[#text(size: 7pt, fill: gray)[Photo]]]
    ]
    // Contact
    #sidebar-heading[Contact]
    #block(below: 0.5em)[#phone]
    #block(below: 0.25em)[#email]
    #block(below: 0.25em)[#link(linkedin-url)[#linkedin]]
    #block(below: 1em)[#location]
    // Profile & Strengths
    #sidebar-heading[Profile]
    #block(width: 100%, below: 0.5em)[#profile]
    #sidebar-heading[Strengths]
    #block(width: 100%, below: 1em)[#strengths]
    // Languages
    #sidebar-heading[Languages]
    #block(below: 0.25em)[
      #for lang in languages [#lang #linebreak()]
    ]
    #block(below: 1em)[]
    // Skills (category + bulleted items)
    #sidebar-heading[Skills]
    #for (cat, sub) in skills [
      #block(above: 0.35em)[
        #text(weight: "bold", fill: accent)[#cat]
        #linebreak()
        #for item in sub [#block(inset: (left: 0.75em))[• #item]]
      ]
    ]
  ],
  // -------------------------------------------------------------------------
  // 4. Right Column (Main Content)
  // -------------------------------------------------------------------------
  [
    // Header: name + tagline
    #block(below: 0.5em)[
      #text(size: 20pt, weight: "bold")[#name]
    ]
    #block(below: 0.4em)[
      #text(size: 12pt, fill: accent)[#tagline]
    ]
    #block(below: 1em)[
      #line(length: 100%, stroke: 0.5pt + gray)
    ]
    // Experience
    #section-title[EXPERIENCE]
    #for (date, company, title, bullets) in experience [
      #block(above: 0.5em, below: 0.35em)[
        #grid(columns: (1fr, auto), gutter: 1em, align: (left, right))[
          #text(weight: "bold")[#company]
          #text(weight: "bold")[#date]
        ]
        #text(style: "italic", fill: accent)[#title]
        #block(above: 0.25em)[
          #for b in bullets [#block(inset: (left: 1em))[• #b]]
        ]
      ]
    ]
    // Education
    #section-title[EDUCATION]
    #for (degree, inst, thesis) in education [
      #block(above: 0.35em)[
        #strong[#degree] #inst
        #if thesis != "" [#block(inset: (left: 0.5em), above: 0.15em)[#text(size: 9pt, style: "italic")[#thesis]]]
      ]
    ]
    // Publications
    #section-title[SELECTED PUBLICATIONS]
    #for (venue, desc) in publications [
      #block(above: 0.25em)[#strong[#venue] #desc]
    ]
    // Additional
    #section-title[ADDITIONAL]
    #for a in additional [#block(above: 0.2em)[#a]]
  ]
)
