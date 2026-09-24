// Cover letter — one A4 page. Content file via --input content=...
#import sys.inputs.at("content"): *

#set page(paper: "a4", margin: (left: 2.2cm, right: 2.2cm, top: 2cm, bottom: 2cm))
#set text(font: "Lato", size: 11pt, fill: rgb("#2D2D2D"))
#set par(leading: 0.85em, justify: true)

#let accent = rgb("#34495e")

#align(left)[
  #text(size: 14pt, weight: "bold", fill: accent)[#cover-name]
  #v(0.35em)
  #text(size: 9pt, fill: rgb("#555555"))[
    #if cover-location != "" [#cover-location]
    #if cover-phone != "" [ · #cover-phone]
    #if cover-email != "" [ · #cover-email]
    #if cover-linkedin != "" [ · #link(cover-linkedin)[LinkedIn]]
  ]
]

#v(1.1em)
#line(length: 100%, stroke: (paint: accent, thickness: 0.6pt))
#v(0.9em)

#if cover-date != "" [
  #text(size: 10pt)[#cover-date]
  #v(0.85em)
]

#if cover-company != "" or cover-role != "" [
  #text(size: 10pt)[
    #if cover-company != "" [*#cover-company*]
    #if cover-role != "" [
      \
      #if cover-lang == "pt" [Vaga: ] else [Role: ]
      #cover-role
    ]
  ]
  #v(0.9em)
]

#if cover-greeting != "" [
  #cover-greeting
  #v(0.7em)
]

#let paragraphs = cover-body.split("\n\n").filter(p => p.trim() != "")
#for (i, p) in paragraphs.enumerate() {
  [#p]
  if i < paragraphs.len() - 1 { v(0.75em) }
}

#v(1em)

#if cover-closing != "" [
  #let closing-lines = cover-closing.split("\n")
  #for (i, line) in closing-lines.enumerate() {
    [#line]
    if i < closing-lines.len() - 1 { linebreak() }
  }
] else [
  #if cover-lang == "pt" [Atenciosamente,] else [Sincerely,]
  #v(1.4em)
  #cover-name
]
