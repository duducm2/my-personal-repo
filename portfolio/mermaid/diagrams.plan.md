# Plan: Update Portfolio Diagrams

This plan outlines the necessary updates to `portfolio/mermaid/diagrams.md` to align with the "AI B (Technical Architect)" requirements.

## 1. Academic Timeline (Slide 3 / Section 2)
- **Current State:** `timeline` chart.
- **Changes:**
    - **Content:** Remove "English proficiency" and "Score 10/10" entries.
    - **Refactor:** Convert from `timeline` to `flowchart LR` to introduce explicit arrows/connectors between educational stages, addressing the "missing arrows" issue.

## 2. CIP UX Methodology Pipeline (Slide 6 / Section 3)
- **Current State:** `flowchart LR` with descriptive text steps.
- **Changes:**
    - **Content:** Replace descriptive text (e.g., "(1) Iterative code-based documentation...") with specific technology stacks (e.g., "Markdown", "Python", "Cursor IDE", "CSV").
    - **Style:** Simplify the layout to a linear flow with minimal text.

## 3. Academic Research Flow (Slide 4 / Section 4)
- **Current State:** `flowchart TD` with broad categories.
- **Changes:**
    - **Content:** Explicitly add nodes for "Technologies Used" (e.g., Power BI, Figma, Python) and "Soft Skills Learned" (e.g., Critical Thinking, Scientific Method).
    - **Style:** Simplify visual presentation.

## 4. CSI and NPS Performance (Slide 5 / Section 5)
- **Current State:** `block-beta` diagram (causing rendering issues).
- **Changes:**
    - **Refactor:** Replace `block-beta` with a stable `flowchart` or `classDiagram` structure that mimics a table layout, ensuring compatibility with standard Mermaid renderers.

## 5. Dissertation & Research (Slides 6 & 7 / Sections 6 & 7)
- **Current State:** Separate `erDiagram` (Database) and `flowchart LR` (Tech Pillars).
- **Changes:**
    - **Merge:** Combine Sections 6 and 7 into a single diagram.
    - **Filter:** Remove database schema details. Focus exclusively on the **Technologies** used (e.g., AI Agents, Full-stack, Figma, Database type).
    - **Style:** Maintain a very simple design.

## 6. InfoVis Visual Structures (Slide 8 / Section 8)
- **Current State:** `flowchart LR` with generic descriptions.
- **Changes:**
    - **Content:** Update nodes to specific visualization names (e.g., "Sankey Diagram", "Choropleth Map", "Faceted Bar Chart").
    - **Style:** Simplify connections.

## 7. AI and Agile in Research (Slide 11 / Section 11)
- **Current State:** `flowchart TD` with subgraphs.
- **Changes:**
    - **Style:** Simplify complexity (reduce subgraph nesting).
    - **Fix:** Adjust color/contrast for the "Midnight Blue" theme. Ensure subgraph backgrounds are transparent or high-contrast to prevent clashing with the dark slide background.

## 8. Experience Timeline (Experience Timeline / Section 12)
- **Current State:** `timeline` ending in 2023.
- **Changes:**
    - **Update:** Extend range to include 2023–2026.
    - **Add Role:** "UX Researcher, Designer, and Project Manager" at Bosch.

## 9. No Changes Required
- **Slide 2 (Story Flows)**
- **Slides 9 & 10**
- **Slides 13 & 14**