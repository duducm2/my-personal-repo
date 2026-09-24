/**
 * Human-like form filler — native events, typing cadence, react-select/combobox support.
 * Never auto-submits.
 */
(function (global) {
  "use strict";

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function optionMatches(candidate, target) {
    const c = norm(candidate);
    const t = norm(target);
    if (!c || !t) return false;
    if (c === t) return true;
    // "4. Located Elsewhere" vs "Located Elsewhere" / "Brazil" vs "4. Brazil"
    if (c.includes(t) || t.includes(c)) return true;
    const cStrip = c.replace(/^\d+[\.\)]\s*/, "");
    const tStrip = t.replace(/^\d+[\.\)]\s*/, "");
    if (cStrip === tStrip) return true;
    if (cStrip.includes(tStrip) || tStrip.includes(cStrip)) return true;
    return false;
  }

  function dispatchInputEvents(el, value) {
    el.dispatchEvent(new Event("focus", { bubbles: true }));
    el.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }

    const proto =
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) {
      desc.set.call(el, value);
    } else {
      el.value = value;
    }

    el.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        data: value,
        inputType: "insertText",
      }),
    );
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

    const proto =
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    let built = "";

    for (let i = 0; i < value.length; i += 1) {
      built += value[i];
      if (desc && desc.set) desc.set.call(el, built);
      else el.value = built;

      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: value[i],
          cancelable: true,
        }),
      );
      el.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          data: value[i],
          inputType: "insertText",
        }),
      );
      el.dispatchEvent(
        new KeyboardEvent("keyup", {
          bubbles: true,
          key: value[i],
          cancelable: true,
        }),
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
      if (optionMatches(label, target) || optionMatches(opt.value, target)) {
        el.value = opt.value;
        matched = true;
        break;
      }
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return matched;
  }

  function isComboboxLike(el, field) {
    if (!el) return false;
    if ((field && field.type) === "combobox") return true;
    if ((el.getAttribute("role") || "").toLowerCase() === "combobox")
      return true;
    if (el.classList && el.classList.contains("select__input")) return true;
    if (
      el.closest &&
      el.closest(".select__control, .select-shell, .select__container")
    ) {
      return true;
    }
    return false;
  }

  function findComboboxRoot(el) {
    return (
      (el &&
        el.closest &&
        el.closest(
          ".select__container, .select, .select-shell, [class*='-container']",
        )) ||
      (el && el.parentElement) ||
      el
    );
  }

  function findComboboxInput(el) {
    if (!el) return null;
    if (el.matches && el.matches('input.select__input, input[role="combobox"]'))
      return el;
    const root = findComboboxRoot(el);
    return (
      (root &&
        root.querySelector &&
        root.querySelector('input.select__input, input[role="combobox"]')) ||
      el
    );
  }

  async function openCombobox(input) {
    const root = findComboboxRoot(input);
    const control =
      (root && root.querySelector && root.querySelector(".select__control")) ||
      (input && input.closest && input.closest(".select__control"));
    const toggle =
      (root &&
        root.querySelector &&
        root.querySelector(
          'button[aria-label="Toggle flyout"], .select__indicators button',
        )) ||
      null;

    // Prefer clicking the control / toggle so the menu mounts
    if (toggle) {
      toggle.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
      );
      toggle.click();
    } else if (control) {
      control.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
      );
      control.click();
    } else {
      input.click();
    }
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
    // ArrowDown often opens react-select
    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true,
        key: "ArrowDown",
        code: "ArrowDown",
        cancelable: true,
      }),
    );
    await sleep(rand(180, 320));
  }

  function listboxForInput(input) {
    if (!input) return null;
    const controls =
      input.getAttribute("aria-controls") ||
      input.getAttribute("aria-owns") ||
      "";
    for (const id of controls.split(/\s+/).filter(Boolean)) {
      const node = document.getElementById(id);
      if (node) return node;
    }
    // react-select: input id "country" → listbox often "react-select-country-listbox"
    const id = input.id;
    if (id) {
      const byId =
        document.getElementById(`react-select-${id}-listbox`) ||
        document.querySelector(`[id="react-select-${CSS.escape(id)}-listbox"]`);
      if (byId) return byId;
    }
    return (
      document.querySelector(
        ".select__menu, [class*='MenuList'], #react-portal-mount-point [role='listbox']",
      ) || null
    );
  }

  function collectVisibleOptions(input) {
    const scopes = [];
    const listbox = listboxForInput(input);
    if (listbox) scopes.push(listbox);
    const portal = document.getElementById("react-portal-mount-point");
    if (portal) scopes.push(portal);
    scopes.push(document);

    const seen = new Set();
    const out = [];
    for (const scope of scopes) {
      const nodes = scope.querySelectorAll(
        '[role="option"], .select__option, [id*="react-select"][id*="-option-"]',
      );
      for (const n of nodes) {
        if (seen.has(n)) continue;
        seen.add(n);
        const style = window.getComputedStyle(n);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const rect = n.getBoundingClientRect();
        if (rect.width <= 0 && rect.height <= 0) continue;
        out.push(n);
      }
      if (out.length) break;
    }
    return out;
  }

  async function waitForOptions(input, timeoutMs) {
    const start = Date.now();
    while (Date.now() - start < (timeoutMs || 2800)) {
      const expanded = input && input.getAttribute("aria-expanded") === "true";
      const opts = collectVisibleOptions(input);
      if (opts.length && (expanded || opts.length > 0)) return opts;
      await sleep(80);
    }
    return collectVisibleOptions(input);
  }

  async function typeIntoCombobox(input, text) {
    const value = String(text ?? "");
    // Clear existing filter text
    const proto = window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) desc.set.call(input, "");
    else input.value = "";
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "deleteContentBackward",
      }),
    );

    // Type a filter string (helps country lists)
    for (let i = 0; i < value.length; i += 1) {
      const ch = value[i];
      const built = value.slice(0, i + 1);
      if (desc && desc.set) desc.set.call(input, built);
      else input.value = built;
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: ch,
          cancelable: true,
        }),
      );
      input.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          cancelable: true,
          data: ch,
          inputType: "insertText",
        }),
      );
      input.dispatchEvent(
        new KeyboardEvent("keyup", {
          bubbles: true,
          key: ch,
          cancelable: true,
        }),
      );
      await sleep(rand(25, 70));
    }
    await sleep(rand(150, 280));
  }

  async function clickMatchingOption(options, target) {
    let best = null;
    let bestScore = 0;
    for (const opt of options) {
      const label = (opt.textContent || "").replace(/\s+/g, " ").trim();
      if (!label) continue;
      if (optionMatches(label, target)) {
        const exact = norm(label) === norm(target) ? 3 : 2;
        if (exact > bestScore) {
          bestScore = exact;
          best = opt;
        }
      }
    }
    if (!best) return false;
    best.scrollIntoView({ block: "nearest" });
    await sleep(rand(40, 100));
    best.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
    );
    best.dispatchEvent(
      new MouseEvent("mouseup", { bubbles: true, cancelable: true }),
    );
    best.click();
    await sleep(rand(120, 220));
    return true;
  }

  /**
   * Fill Greenhouse / react-select / aria combobox by opening the menu and clicking an option.
   */
  async function fillCombobox(el, value) {
    const target = String(value ?? "").trim();
    if (!target) return false;

    const input = findComboboxInput(el);
    if (!input) return false;

    await openCombobox(input);

    // Short filter first so Yes/No and numbered labels still appear; longer for country lists
    const filterToken =
      target.length > 40
        ? target
            .split(/[,\s/]+/)
            .filter((t) => t.length > 2)
            .slice(0, 3)
            .join(" ")
        : target;
    if (filterToken) {
      await typeIntoCombobox(input, filterToken);
    }

    let options = await waitForOptions(input, 2800);
    let ok = await clickMatchingOption(options, target);

    // Retry without over-filtering: reopen and type a shorter stem
    if (!ok) {
      await openCombobox(input);
      const stem = target.replace(/^\d+[\.\)]\s*/, "").slice(0, 18);
      await typeIntoCombobox(input, stem);
      options = await waitForOptions(input, 2800);
      ok = await clickMatchingOption(options, target);
    }

    if (!ok && options.length) {
      // Keyboard commit: highlight best match then Enter
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "ArrowDown",
          code: "ArrowDown",
          cancelable: true,
        }),
      );
      await sleep(80);
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Enter",
          code: "Enter",
          cancelable: true,
        }),
      );
      await sleep(180);
      const root = findComboboxRoot(input);
      const single =
        root &&
        root.querySelector &&
        root.querySelector(".select__single-value");
      if (single && optionMatches(single.textContent || "", target)) ok = true;
      else if (input.getAttribute("aria-expanded") === "false") {
        // Menu closed after Enter — treat as selected when a single filtered option existed
        ok = options.length === 1;
      }
    }

    // Close leftover menu so the next field can open cleanly
    if (input.getAttribute("aria-expanded") === "true") {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          key: "Escape",
          code: "Escape",
          cancelable: true,
        }),
      );
      await sleep(80);
    }
    return ok;
  }

  async function fillCheckbox(el, value) {
    const want =
      value === true ||
      value === "true" ||
      value === "1" ||
      value === "yes" ||
      value === "on";
    if (el.checked !== want) {
      el.click();
      await sleep(rand(40, 120));
    }
    return true;
  }

  async function fillRadio(el, value) {
    const name = el.name;
    if (!name) return false;
    const radios = document.querySelectorAll(
      `input[type="radio"][name="${CSS.escape(name)}"]`,
    );
    const target = String(value ?? "").toLowerCase();
    for (const r of radios) {
      const lab =
        (window.CareerAutofillDetector &&
          window.CareerAutofillDetector.labelFor(r)) ||
        r.value;
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
    const finder =
      window.CareerAutofillDetector &&
      window.CareerAutofillDetector.findElement;
    const el = finder ? finder(field) : null;
    if (!el) return { ok: false, reason: "element_not_found" };
    if (value == null || value === "")
      return { ok: false, reason: "empty_value" };

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
    await sleep(rand(120, 320));

    const type = field.type || el.type || el.tagName.toLowerCase();

    if (type === "select" || el.tagName === "SELECT") {
      const ok = await fillSelect(el, value);
      await sleep(rand(80, 200));
      return { ok, reason: ok ? "filled" : "no_option_match" };
    }

    if (
      isComboboxLike(el, field) ||
      type === "combobox" ||
      type === "listbox"
    ) {
      const ok = await fillCombobox(el, value);
      await sleep(rand(100, 220));
      return { ok, reason: ok ? "filled" : "no_combobox_option" };
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
  async function fillMappings(
    mappings,
    { onProgress, minConfidence = 0.55, signal } = {},
  ) {
    const ordered = [...mappings]
      .filter(
        (m) =>
          m &&
          m.value != null &&
          m.value !== "" &&
          (m.confidence == null || m.confidence >= minConfidence),
      )
      .sort(
        (a, b) =>
          (a.field.visualOrder ?? a.field.index) -
          (b.field.visualOrder ?? b.field.index),
      );

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
      results.push({
        uid: m.field.uid,
        ...result,
        canonicalKey: m.canonicalKey,
      });
      await sleep(rand(100, 350));
    }
    return results;
  }

  global.CareerAutofillFiller = {
    fillOne,
    fillMappings,
    fillCombobox,
    typeHuman,
    sleep,
  };
})(typeof window !== "undefined" ? window : self);
