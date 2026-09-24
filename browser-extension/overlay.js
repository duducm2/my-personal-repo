/**
 * In-page overlay: progress, mapped/ambiguous counts, manual fallback.
 */
(function (global) {
  "use strict";

  const ROOT_ID = "career-cockpit-autofill-overlay";
  let root = null;

  function ensureRoot() {
    if (root && document.body.contains(root)) return root;
    root = document.getElementById(ROOT_ID);
    if (root) return root;
    root = document.createElement("div");
    root.id = ROOT_ID;
    root.setAttribute("data-career-autofill", "1");
    document.documentElement.appendChild(root);
    return root;
  }

  function clearHighlights() {
    document.querySelectorAll("[data-cc-autofill-hl]").forEach((el) => {
      el.removeAttribute("data-cc-autofill-hl");
      el.classList.remove("cc-autofill-hl-ok", "cc-autofill-hl-warn", "cc-autofill-hl-skip");
    });
  }

  function highlightField(field, kind) {
    const finder = window.CareerAutofillDetector && window.CareerAutofillDetector.findElement;
    const el = finder ? finder(field) : null;
    if (!el) return;
    el.setAttribute("data-cc-autofill-hl", kind || "warn");
    el.classList.add(
      kind === "ok" ? "cc-autofill-hl-ok" : kind === "skip" ? "cc-autofill-hl-skip" : "cc-autofill-hl-warn"
    );
  }

  function render(state) {
    const el = ensureRoot();
    const {
      phase = "idle",
      message = "",
      detected = 0,
      mapped = 0,
      ambiguous = 0,
      filled = 0,
      progress = 0,
      ambiguousList = [],
      error = null,
    } = state || {};

    const ambRows = (ambiguousList || [])
      .map((item, idx) => {
        const label = escapeHtml(item.field.label || item.field.name || item.field.id || `Field ${idx + 1}`);
        const guess = escapeHtml(item.canonicalKey || "(unknown)");
        const conf = item.confidence != null ? Math.round(item.confidence * 100) : "?";
        const suggestions = (item.suggestions || [])
          .map(
            (s) =>
              `<option value="${escapeAttr(s.key)}">${escapeHtml(s.label || s.key)}</option>`
          )
          .join("");
        return `<div class="cc-amb-row" data-uid="${escapeAttr(item.field.uid)}">
          <div class="cc-amb-label">${label}</div>
          <div class="cc-amb-meta">guess: ${guess} · ${conf}%</div>
          <div class="cc-amb-actions">
            <select class="cc-amb-select" data-uid="${escapeAttr(item.field.uid)}">
              <option value="">Skip / leave empty</option>
              ${suggestions}
            </select>
            <input type="text" class="cc-amb-custom" data-uid="${escapeAttr(item.field.uid)}" placeholder="Custom value…" />
          </div>
        </div>`;
      })
      .join("");

    el.innerHTML = `
      <div class="cc-panel" role="dialog" aria-label="Career Cockpit Autofill">
        <div class="cc-header">
          <strong>Career Cockpit Autofill</strong>
          <button type="button" class="cc-close" title="Close">×</button>
        </div>
        <div class="cc-status">${escapeHtml(message || phase)}</div>
        ${error ? `<div class="cc-error">${escapeHtml(error)}</div>` : ""}
        <div class="cc-progress-wrap"><div class="cc-progress" style="width:${Math.max(0, Math.min(100, progress))}%"></div></div>
        <div class="cc-stats">
          <span>Detected <b>${detected}</b></span>
          <span>Mapped <b>${mapped}</b></span>
          <span>Ambiguous <b>${ambiguous}</b></span>
          <span>Filled <b>${filled}</b></span>
        </div>
        ${
          ambiguousList && ambiguousList.length
            ? `<div class="cc-amb-list"><div class="cc-amb-title">Needs your review</div>${ambRows}</div>`
            : ""
        }
        <div class="cc-footer">
          <button type="button" class="cc-btn cc-btn-primary" id="cc-fill-btn" ${phase === "ready" || phase === "review" ? "" : "disabled"}>Fill mapped fields</button>
          <button type="button" class="cc-btn" id="cc-save-map-btn" ${phase === "review" || phase === "done" ? "" : "disabled"}>Save mapping</button>
          <button type="button" class="cc-btn" id="cc-dismiss-btn">Done</button>
        </div>
        <p class="cc-note">Never auto-submits. Review everything before you click Apply.</p>
      </div>
    `;

    el.querySelector(".cc-close")?.addEventListener("click", hide);
    el.querySelector("#cc-dismiss-btn")?.addEventListener("click", hide);
    el.querySelector("#cc-fill-btn")?.addEventListener("click", () => {
      if (typeof el._onFill === "function") el._onFill(collectAmbiguousChoices(el));
    });
    el.querySelector("#cc-save-map-btn")?.addEventListener("click", () => {
      if (typeof el._onSave === "function") el._onSave(collectAmbiguousChoices(el));
    });

    return el;
  }

  function collectAmbiguousChoices(el) {
    const choices = [];
    el.querySelectorAll(".cc-amb-row").forEach((row) => {
      const uid = row.getAttribute("data-uid");
      const select = row.querySelector(".cc-amb-select");
      const custom = row.querySelector(".cc-amb-custom");
      const customVal = custom && custom.value.trim();
      const key = customVal ? "__custom__" : (select && select.value) || "";
      choices.push({
        uid,
        canonicalKey: key === "__custom__" ? null : key || null,
        customValue: customVal || null,
        skip: !key && !customVal,
      });
    });
    return choices;
  }

  function show(state, handlers = {}) {
    const el = render(state);
    el._onFill = handlers.onFill || null;
    el._onSave = handlers.onSave || null;
    el.classList.add("cc-visible");
    return el;
  }

  function update(state) {
    if (!root) return show(state);
    const onFill = root._onFill;
    const onSave = root._onSave;
    render(state);
    root._onFill = onFill;
    root._onSave = onSave;
    root.classList.add("cc-visible");
  }

  function hide() {
    clearHighlights();
    if (root) {
      root.classList.remove("cc-visible");
      root.innerHTML = "";
    }
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  global.CareerAutofillOverlay = {
    show,
    update,
    hide,
    highlightField,
    clearHighlights,
  };
})(typeof window !== "undefined" ? window : self);
