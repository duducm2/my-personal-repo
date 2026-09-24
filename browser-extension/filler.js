/**
 * Human-like form filler — native events, typing cadence, scroll, no auto-submit.
 */
(function (global) {
  "use strict";

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function dispatchInputEvents(el, value) {
    el.dispatchEvent(new Event("focus", { bubbles: true }));
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }

    const proto = el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) {
      desc.set.call(el, value);
    } else {
      el.value = value;
    }

    el.dispatchEvent(new InputEvent("input", { bubbles: true, cancelable: true, data: value, inputType: "insertText" }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  async function typeHuman(el, text, { onChar } = {}) {
    const value = String(text ?? "");
    if (value.length <= 24) {
      dispatchInputEvents(el, value);
      el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
      return;
    }

    el.dispatchEvent(new Event("focus", { bubbles: true }));
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }

    const proto = el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    let built = "";

    for (let i = 0; i < value.length; i += 1) {
      built += value[i];
      if (desc && desc.set) desc.set.call(el, built);
      else el.value = built;

      el.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: value[i], cancelable: true })
      );
      el.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          data: value[i],
          inputType: "insertText",
        })
      );
      el.dispatchEvent(
        new KeyboardEvent("keyup", { bubbles: true, key: value[i], cancelable: true })
      );

      if (onChar) onChar(i + 1, value.length);
      await sleep(rand(30, 120));
      if (i > 0 && i % 40 === 0) await sleep(rand(200, 600));
    }

    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  async function fillSelect(el, value) {
    const target = String(value ?? "");
    let matched = false;
    for (const opt of el.options) {
      const label = (opt.textContent || "").trim();
      if (
        opt.value === target ||
        label === target ||
        label.toLowerCase() === target.toLowerCase() ||
        opt.value.toLowerCase() === target.toLowerCase()
      ) {
        el.value = opt.value;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Partial match
      for (const opt of el.options) {
        const label = (opt.textContent || "").trim().toLowerCase();
        if (label.includes(target.toLowerCase()) || target.toLowerCase().includes(label)) {
          el.value = opt.value;
          matched = true;
          break;
        }
      }
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return matched;
  }

  async function fillCheckbox(el, value) {
    const want = value === true || value === "true" || value === "1" || value === "yes" || value === "on";
    if (el.checked !== want) {
      el.click();
      await sleep(rand(40, 120));
    }
    return true;
  }

  async function fillRadio(el, value) {
    const name = el.name;
    if (!name) return false;
    const radios = document.querySelectorAll(`input[type="radio"][name="${CSS.escape(name)}"]`);
    const target = String(value ?? "").toLowerCase();
    for (const r of radios) {
      const lab = (window.CareerAutofillDetector && window.CareerAutofillDetector.labelFor(r)) || r.value;
      if (
        r.value.toLowerCase() === target ||
        (lab && lab.toLowerCase() === target) ||
        (lab && lab.toLowerCase().includes(target))
      ) {
        r.click();
        await sleep(rand(40, 120));
        return true;
      }
    }
    return false;
  }

  async function fillOne(field, value, opts = {}) {
    const finder = window.CareerAutofillDetector && window.CareerAutofillDetector.findElement;
    const el = finder ? finder(field) : null;
    if (!el) return { ok: false, reason: "element_not_found" };
    if (value == null || value === "") return { ok: false, reason: "empty_value" };

    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    await sleep(rand(120, 320));

    const type = field.type || el.type || el.tagName.toLowerCase();

    if (type === "select" || el.tagName === "SELECT") {
      const ok = await fillSelect(el, value);
      await sleep(rand(80, 200));
      return { ok, reason: ok ? "filled" : "no_option_match" };
    }
    if (type === "checkbox") {
      await fillCheckbox(el, value);
      return { ok: true, reason: "filled" };
    }
    if (type === "radio") {
      const ok = await fillRadio(el, value);
      return { ok, reason: ok ? "filled" : "no_radio_match" };
    }
    if (el.getAttribute("contenteditable") === "true") {
      el.focus();
      el.textContent = String(value);
      el.dispatchEvent(new InputEvent("input", { bubbles: true }));
      return { ok: true, reason: "filled" };
    }

    await typeHuman(el, String(value), {
      onChar: opts.onChar,
    });
    await sleep(rand(60, 180));
    return { ok: true, reason: "filled" };
  }

  /**
   * Fill mappings in visual order with jitter. Never submits forms.
   * mappings: [{ field, value, confidence }]
   */
  async function fillMappings(mappings, { onProgress, minConfidence = 0.55, signal } = {}) {
    const ordered = [...mappings]
      .filter((m) => m && m.value != null && m.value !== "" && (m.confidence == null || m.confidence >= minConfidence))
      .sort((a, b) => (a.field.visualOrder ?? a.field.index) - (b.field.visualOrder ?? b.field.index));

    // Small random jitter in order for adjacent fields
    for (let i = ordered.length - 1; i > 0; i -= 1) {
      if (Math.random() < 0.15) {
        const j = Math.max(0, i - 1);
        const tmp = ordered[i];
        ordered[i] = ordered[j];
        ordered[j] = tmp;
      }
    }

    const results = [];
    for (let i = 0; i < ordered.length; i += 1) {
      if (signal && signal.aborted) break;
      const m = ordered[i];
      if (onProgress) {
        onProgress({
          phase: "filling",
          current: i + 1,
          total: ordered.length,
          label: m.field.label || m.field.name || m.field.id,
        });
      }
      const result = await fillOne(m.field, m.value);
      results.push({ uid: m.field.uid, ...result, canonicalKey: m.canonicalKey });
      await sleep(rand(100, 350));
    }
    return results;
  }

  global.CareerAutofillFiller = {
    fillOne,
    fillMappings,
    typeHuman,
    sleep,
  };
})(typeof window !== "undefined" ? window : self);
