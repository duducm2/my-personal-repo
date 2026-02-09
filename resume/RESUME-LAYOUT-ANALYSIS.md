# Resume Layout Analysis: CV Ref.pdf vs CV-Eduardo-Figueiredo-EN.md

## 1. Visual Hierarchy Comparison

| Element | CV Ref.pdf | CV-Eduardo-Figueiredo-EN.md |
|--------|------------|-----------------------------|
| **Header** | Name (largest); contact line (phone, email, address, LinkedIn); possible icons | Same structure; inline CSS for .cv-name, .cv-contact; 32% / 68% grid below |
| **Left column** | Profile, Career Objectives, Strengths, Languages, Skills (nested bullets) | Profile, Strengths, Languages, Skills (flat + nested list in HTML) |
| **Right column** | EXPERIENCE (date-first, company, title, body); ADDITIONAL; ACADEMIC EDUCATION | EXPERIENCE → EDUCATION → SELECTED PUBLICATIONS → ADDITIONAL |
| **Section titles** | Uppercase (e.g. EXPERIENCE, ADDITIONAL, ACADEMIC EDUCATION); underlined or bold | Uppercase for EXPERIENCE, EDUCATION, etc.; border-bottom in CSS |
| **Temporal data** | Inline `(MM/YYYY - present)` or `(MM/YYYY - MM/YYYY)` before company name | Same pattern; .cv-job-dates, .cv-job-company, .cv-job-title |

## 2. Grid Topology

- **Reference PDF:** Asymmetrical two-column layout; investigation specifies **32% / 68%** (or 30/70). Left column is the "sidebar" (often with distinct background in designer CVs). Content flows top-to-bottom in each column.
- **Current MD:** CSS `grid-template-columns: 32% 1fr` with gap; semantically equivalent. No explicit background bleed; ref may use a tinted sidebar.
- **Requirement for replication:** Fixed ratio (e.g. `0.32fr` / `0.68fr` in Typst, or `w-1/3` / `w-2/3` in Tailwind) so that content edits cannot collapse or shift the columns.

## 3. Nested Lists (Skills)

- **Ref PDF:** Skills use two levels:
  - Level 1: bullet (•) — e.g. "User Experience:", "Communication.", "Web Development (focus on front-end):"
  - Level 2: hollow/circle (o) — e.g. "Research: Problem Definition, User Journey...", "Design Tools: Figma..."
- **Current MD:** Skills are in HTML `<ul>` and `<ul class="cv-list-nested">` with `<li>`; "Core:" and "Tech:" as single-level bullets. Content is consolidated (no nested sub-items).
- **Replication:** Layout engine must support at least two list levels (main category + sub-items). Content file should allow nested arrays or nested markup for Skills so the ref’s "delightful" hierarchy can be restored or preserved.

## 4. Content Mapping (Ref → Current MD)

- **Ref** uses older copy (e.g. "27 years old, Brazilian, and engaged", "Career Objectives" paragraph, older experience dates). **Current MD** uses updated copy (UX Maturity Level 4, UX Quality Gates, Web Developer, Digitization Support Analyst, Publications, X-Games award).
- **Migration:** Use **CV-Eduardo-Figueiredo-EN.md** as the source of truth for *content*; use **CV Ref.pdf** as the source of truth for *layout and typography* (grid, section order, nested skills, date alignment, section title style).

## 5. Typography and "Delightful" Details

- **Ref:** Clean sans-serif; consistent spacing; section titles stand out; dates/company names likely bold or weight contrast; body text compact but readable.
- **Implementation:** Typst or Tailwind must enforce: (1) single font stack for body and headings, (2) fixed line-height and section spacing, (3) no arbitrary margin/padding changes when editing content. All dimensional and typographic choices live in the layout file only.

## 6. Conclusion for Implementation

- **Content source:** `CV-Eduardo-Figueiredo-EN.md` (current HTML/MD).
- **Design source:** `CV Ref.pdf` (grid 32/68, section order, nested skills, temporal format).
- **AI safety:** Only the *content* file (e.g. `content.typ` or `data.yml`/`data.json`) may be edited for resume updates; the *layout* file (`main.typ` or Tailwind/HTML structure) is off-limits for content-driven edits to avoid breaking the grid or typography.
