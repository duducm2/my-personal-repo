# Cursor Rules for Resume (Code-Based CV)

**Use this content in your project’s `.cursorrules` file or in a `.cursor/rules/resume.mdc` rule** so the AI modifies only resume *content* and never breaks the strict visual layout or grid.

---

## Copy-paste block for `.cursorrules`

```markdown
## Resume / CV (Typst workflow)

- **Content-only edits:** When the user asks to update, add, or change resume/CV content (e.g. experience, education, skills, profile text, publications, contact info), make changes ONLY in `resume/typst/content.typ`. Do not edit `resume/typst/main.typ` for content updates.
- **Layout is fixed:** The file `resume/typst/main.typ` defines the grid (32% / 68% two-column layout), typography, section order, and spacing. Do not change grid columns, gutters, section structure, or styling in `main.typ` when performing resume content edits. Treat `main.typ` as layout-only.
- **Preserve content structure:** In `content.typ`, keep the existing variable names and data shapes:
  - `experience`: tuple of (date, company, title, bullets) where `bullets` is a tuple of content blocks.
  - `education`: tuple of (degree, institution_line, thesis_or_empty).
  - `skills`: tuple of (category_label, tuple of strings).
  - `publications`: tuple of (venue, description).
  - `additional`: tuple of content blocks.
  Changing these shapes may break the layout or require edits to `main.typ`, which is forbidden for content-only tasks.
- **Reference files:** Use `resume/CV Ref.pdf` as the visual reference for layout intent. Use `resume/CV-Eduardo-Figueiredo-EN.md` or user instructions as the source for updated copy; migrate that copy into `content.typ` without altering `main.typ`.
- **If using HTML/Tailwind alternative:** If the project uses an HTML + Tailwind resume, do not change grid or column classes (e.g. keep `w-1/3` and `w-2/3` or the defined 32/68 ratio). Edit only the text/content nodes inside the existing structure.
```

---

## Optional: Tailwind / HTML resume rule

If you add an HTML + Tailwind + Paged.js resume later, append:

```markdown
- **Resume HTML layout:** For any resume built with HTML/Tailwind, never replace or remove the grid/column utility classes (e.g. `w-1/3`, `w-2/3`, or equivalent 32/68 split). Do not introduce arbitrary width values that change the column ratio. Only the text content, list items, and data attributes may be changed when the user asks for resume content updates.
```
