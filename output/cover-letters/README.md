# Cover letter PDFs

Transient one-page Typst letters from Job Openings → **Import cover letter**.

## Storage policy (avoid repo bloat)

1. **Desktop (primary deliverable)** — each build writes/copies the PDF to your
   local Desktop. Cover letters are not archived in git.
2. **Single repo temp** — `Cover-Letter-current.pdf` in this folder is overwritten
   on every build so the cockpit viewer can serve it. Older per-opening PDFs are
   deleted automatically. Do not commit cover-letter PDFs.

- Template: `resume/typst/cover-letter.typ`
- Content snippet (overwritten): `resume/typst/_generated/cover-current.typ`
