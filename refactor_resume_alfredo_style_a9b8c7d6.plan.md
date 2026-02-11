---
name: Refactor Resume to Alfredo Torres Style
overview: Re-implement the Typst layout to match the Alfredo Torres reference, featuring a persistent grey sidebar, minimized margins, and specific content mapping (Education/Skills in sidebar).
todos:
  - id: setup_page_and_background
    content: Configure page dimensions, minimal margins, and a persistent grey sidebar background using the page background property.
    status: pending
    dependencies: []
  - id: define_typography_and_styles
    content: Create helper functions for section headers (uppercase, tracking), job titles, and body text with tight leading for space optimization.
    status: pending
    dependencies: [setup_page_and_background]
  - id: implement_sidebar_content
    content: Implement the left column content function including Photo, Contact Info, Education, and Skills.
    status: pending
    dependencies: [define_typography_and_styles]
  - id: implement_main_content
    content: Implement the right column content function including Name/Title Header, Profile, Experience, and Publications.
    status: pending
    dependencies: [define_typography_and_styles]
  - id: assemble_grid_layout
    content: Combine sidebar and main content into a master grid layout within the main file.
    status: pending
    dependencies: [implement_sidebar_content, implement_main_content]
---

# Refactor Resume to Alfredo Torres Style

## Analysis / Context
The current resume layout (`CV-Eduardo-Figueiredo-EN-typst.pdf`) needs to be transformed to match the visual aesthetic of `alfredo-torres-ref.png`.

**Key Visual Characteristics of Reference:**
1.  **Asymmetric Layout:** ~30% Left Sidebar (Light Grey Background), ~70% Right Content (White Background).
2.  **Content Mapping:**
    *   **Sidebar:** Contact, Education, Skills.
    *   **Main:** Profile, Work Experience, References (Publications).
3.  **Typography:** Clean sans-serif, uppercase section headers, compact text.
4.  **Space Optimization:** The user requested minimal margins to maximize content density.

## Files to Modify
*   `resume/typst/main.typ` (Complete rewrite/refactor)
*   `resume/typst/content.typ` (Read-only source of data)

## Implementation Strategy

### 1. Page Setup & Background (Step: `setup_page_and_background`)
*   **File:** `resume/typst/main.typ`
*   **Action:** Set `page` margins to `(x: 1cm, y: 1cm)` (or smaller if possible, e.g., 0.8cm) to satisfy "Space Optimization".
*   **Background:** Use `page(background: ...)` to draw a rectangle filling the left 30% of the page. This ensures the sidebar color persists even if content is short.
    *   Color: Light Grey (e.g., `rgb("f4f4f4")`).
    *   Width: `30%`.
    *   Height: `100%`.

### 2. Typography & Styles (Step: `define_typography_and_styles`)
*   **Font:** Use a sans-serif font like "Roboto", "Arial", or "Linux Biolinum".
*   **Helpers:**
    *   `section_title(text)`: Uppercase, bold, slightly increased letter spacing (`tracking`), dark grey color.
    *   `job_header(company, date, title)`: Bold company, italic title, right-aligned date.
    *   `skill_pill(text)`: Optional, or simple bullet points as per reference.

### 3. Sidebar Implementation (Step: `implement_sidebar_content`)
*   **Content Mapping:**
    *   **Photo:** Circular crop, top of sidebar.
    *   **Contact:** Vertical list with icons (Phone, Email, Location, LinkedIn).
    *   **Education:** Move from main content to sidebar. Format: Degree (Bold), School, Year.
    *   **Skills:** Render the `skills` variable here.
*   **Styling:** Ensure text contrasts well with the grey background.

### 4. Main Content Implementation (Step: `implement_main_content`)
*   **Header:**
    *   Place `name` (Large, Bold, Uppercase) and `tagline` at the top of the right column.
    *   Add a horizontal separator line if needed.
*   **Profile:** Render `profile` text.
*   **Experience:** Iterate through `experience`.
    *   Format: Date range on the right (or inline). Reference uses "2030 - PRESENT" aligned right.
    *   Bullet points: Compact, minimal spacing.
*   **Publications/Additional:** Render after Experience.

### 5. Assembly (Step: `assemble_grid_layout`)
*   **Grid:** Use `grid(columns: (30%, 1fr), column-gutter: 1em, ...)` to hold the content.
*   **Alignment:** Ensure the text in the grid aligns with the visual background strip created in Step 1.

## Code Snippet Examples for AI C

**Background Logic:**
```typst
#set page(
  margin: (x: 1cm, y: 1cm),
  background: place(left + top, rect(
    fill: rgb("f4f4f4"),
    height: 100%,
    width: 32% // Match column width + margin adjustment
  ))
)
```