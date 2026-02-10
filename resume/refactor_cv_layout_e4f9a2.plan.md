---
id: refactor_cv_layout_e4f9a2
title: Refactor CV to Two-Column Typst Layout
status: done
target_file: resume/typst/main.typ
dependencies: [resume/typst/content.typ]
context: Transform linear layout to 32/68 grid matching CV Ref.pdf
---

# Execution Plan: Typst CV Layout Refactor

This plan directs the transformation of `resume/typst/main.typ` into a two-column layout (Sidebar + Main) while preserving data separation in `content.typ`.

## 1. Setup and Global Styles
- [ ] **Initialize Page Settings**:
    - Set page margins to `(x: 1.5cm, y: 1.5cm)`.
    - Set default text font to `"Linux Libertine"` (or `"Liberation Serif"` as fallback) and size to `10pt`.
    - Define a global `accent-color` variable (e.g., `rgb("#6A0DAD")` or similar purple/magenta from reference).
- [ ] **Import Content**:
    - Ensure `#import "content.typ": *` is at the top of the file.

## 2. Layout Structure (Grid)
- [ ] **Create Main Grid**:
    - Replace the linear document flow with a `grid()` function.
    - Set `columns: (32%, 1fr)` to create the Sidebar (left) and Main Content (right).
    - Set `column-gutter: 2em` (approx) for spacing.

## 3. Left Column Implementation (Sidebar)
- [ ] **Photo Placeholder**:
    - At the top of the first grid cell, add a circular container (using `box(radius: 50%)` or `circle()`) with a placeholder text or image.
- [ ] **Contact Info**:
    - Move contact details (`phone`, `email`, `linkedin`, `location`) below the photo.
    - Stack them vertically with icons (optional) or simple text labels.
- [ ] **Profile & Strengths**:
    - Render the `profile` variable.
    - Render the `strengths` variable under a "Strengths" sub-header.
- [ ] **Languages**:
    - Iterate through the `languages` array and display them as a list.
- [ ] **Skills**:
    - Iterate through the `skills` tuple structure `(category, items)`.
    - Display the category (e.g., "Core:") in bold/accent color.
    - Display the items (e.g., "UX Research", "React") as a bulleted list below each category.

## 4. Right Column Implementation (Main Content)
- [ ] **Header**:
    - At the top of the second grid cell, display `name` in `20pt` bold.
    - Display `tagline` immediately below in `12pt` text (possibly accent color).
- [ ] **Experience Section**:
    - Create a section header "EXPERIENCE" (uppercase, bold, underlined or bordered).
    - Iterate through the `experience` tuple `(date, company, title, bullets)`.
    - **Layout per entry**:
        - Row 1: `company` (Bold) | `date` (Right-aligned).
        - Row 2: `title` (Italic/Accent).
        - Row 3: `bullets` (Iterate and display as list items).
- [ ] **Education Section**:
    - Create a section header "EDUCATION".
    - Iterate through `education` tuple `(degree, school, details)`.
    - Format: `degree` (Bold), `school` (Regular), `details` (Italic/Small).
- [ ] **Publications Section**:
    - Create a section header "SELECTED PUBLICATIONS".
    - Iterate through `publications` tuple `(venue, description)`.
    - Format: `venue` (Bold) + `description`.
- [ ] **Additional Section**:
    - Create a section header "ADDITIONAL".
    - Iterate through `additional` list and display items.

## 5. Styling Refinement
- [ ] **Typography**:
    - Ensure Section Headers in the Main Column use the `accent-color` and are uppercase.
    - Ensure dates in Experience are strictly right-aligned (use `h(1fr)` or grid alignment).
- [ ] **Visual Polish**:
    - Adjust spacing (using `v(1em)` or `par(leading: ...)`).
    - Verify that the 32/68 split looks balanced.

## 6. Verification
- [ ] **Compile**: Run `typst compile resume/typst/main.typ` and check for errors.
- [ ] **Visual Check**: Compare output against `CV Ref.pdf` requirements (Sidebar vs Main separation).