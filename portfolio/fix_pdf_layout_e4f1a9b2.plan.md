---
name: Fix PDF Layout Anomalies
overview: Resolve scaling, disorder, and cropping issues in the portfolio deck by removing placeholder text and enforcing image constraints.
todos:
  - id: remove_placeholders
    content: Remove all '[INSERT TABLE HERE...]' placeholder text strings from the markdown body.
    status: pending
    dependencies: []
  - id: fix_slide_3_scaling
    content: Resize 'academic-writing.jpg' in Slide 3 to prevent overflow and cropping.
    status: pending
    dependencies: []
  - id: fix_slide_6_8_scaling
    content: Add max-width/height constraints to 'digital-ws.jpg' (Slide 6) and 'hfsd-workshop-1.jpg' (Slide 8) to prevent gigantic scaling.
    status: pending
    dependencies: []
  - id: fix_slide_20_layout
    content: Refactor Slide 20 images into a flex row container and constrain 'budapest-2019.jpg' to fix cropping and scaling.
    status: pending
    dependencies: []
---

# Fix PDF Layout Anomalies

## Analysis / Context
*   **Disorder (Artifacts):** The text `[INSERT TABLE HERE: ...]` appears on Slides 5, 6, 19, 21, and 22, cluttering the visual output.
*   **Scaling ("Gigantic" Images):**
    *   **Slide 20:** `budapest-2019.jpg` has no size attributes and renders at full resolution, dominating the slide.
    *   **Slide 3:** `academic-writing.jpg` is unconstrained, pushing the timeline diagram off the bottom (Cropping).
    *   **Slide 6 & 8:** `digital-ws.jpg` and `hfsd-workshop-1.jpg` lack constraints and may consume too much vertical space.
*   **Cropping (Overflow):**
    *   **Slide 20:** Three images stacked vertically + a diagram + text causes severe overflow.
    *   **Slide 3:** Stacked logos and photos push the main content (timeline) out of view.

## Proposed Changes
1.  **Clean Content:** Delete all occurrences of the `[INSERT TABLE HERE: ...]` pattern.
2.  **Slide 3 (Academic):** Set `academic-writing.jpg` height to `100px` to fit inline with logos.
3.  **Slide 6 & 8:** Apply `style="max-height: 250px; width: auto;"` to the identified unconstrained images.
4.  **Slide 20 (Timeline):** Wrap the three location photos in a `div` with `display: flex; justify-content: center; gap: 10px;` and enforce a uniform height (e.g., `140px`) on all three images to create a neat horizontal strip.

## Files to Modify
*   `c:\Users\fie7ca\OneDrive - Bosch Group\13 - General workspace\my-personal-repo\portfolio\portfolio-deck.md`

## Implementation Strategy
1.  **Search & Replace:** Remove the 5 placeholder strings.
2.  **Slide 3 Update:** Locate `academic-writing.jpg` and add `style="height: 100px; width: auto;"`.
3.  **Slide 6 Update:** Locate `digital-ws.jpg` and add `style="max-height: 250px; width: auto;"`.
4.  **Slide 8 Update:** Locate `hfsd-workshop-1.jpg` and add `style="max-height: 250px; width: auto;"`.
5.  **Slide 20 Refactor:**
    *   Locate the three `<p><img ...></p>` blocks for Budapest and Argentina.
    *   Replace the wrapping `<p>` tags with a single `<div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1rem;">`.
    *   Update `budapest-2019.jpg` to have `style="height: 140px; width: auto;"`.
    *   Update `budapest-2019-2.jpg` and `bosch-argentina.jpg` to have `style="height: 140px; width: auto;"` (replacing existing max-width if necessary for uniformity).