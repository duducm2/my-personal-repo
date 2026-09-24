/**
 * Generic DOM form-field detector.
 * Works across Greenhouse, Lever, Workday, Gupy, SuccessFactors, and custom forms.
 */
(function (global) {
  "use strict";

  const SKIP_TYPES = new Set([
    "hidden",
    "submit",
    "button",
    "image",
    "reset",
    "file",
  ]);

  function visible(el) {
    if (!el || el.disabled) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  }

  function textOf(node) {
    if (!node) return "";
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function labelFor(el) {
    if (el.id) {
      const byFor = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (byFor) return textOf(byFor);
    }
    const wrapping = el.closest("label");
    if (wrapping) return textOf(wrapping);

    const aria = el.getAttribute("aria-labelledby");
    if (aria) {
      const parts = aria.split(/\s+/).map((id) => {
        const n = document.getElementById(id);
        return n ? textOf(n) : "";
      });
      const joined = parts.filter(Boolean).join(" ");
      if (joined) return joined;
    }

    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel.trim();

    // Greenhouse / common ATS: label sibling or previous sibling
    const prev = el.previousElementSibling;
    if (prev && (prev.tagName === "LABEL" || prev.classList.contains("label"))) {
      return textOf(prev);
    }

    // Parent container with a label-like child
    const parent = el.parentElement;
    if (parent) {
      const lab = parent.querySelector(":scope > label, :scope > .label, :scope > span.label");
      if (lab) return textOf(lab);
    }

    return "";
  }

  function nearbyText(el, maxLen) {
    const bits = [];
    let node = el.parentElement;
    let depth = 0;
    while (node && depth < 4) {
      const heading = node.querySelector("h1,h2,h3,h4,legend,.section-header,.application-question");
      if (heading) bits.push(textOf(heading));
      if (node.tagName === "FIELDSET") {
        const leg = node.querySelector("legend");
        if (leg) bits.push(textOf(leg));
      }
      node = node.parentElement;
      depth += 1;
    }
    const joined = bits.filter(Boolean).join(" · ");
    return joined.slice(0, maxLen || 200);
  }

  function fieldType(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === "textarea") return "textarea";
    if (tag === "select") return "select";
    if (tag === "input") {
      const t = (el.getAttribute("type") || "text").toLowerCase();
      if (t === "checkbox") return "checkbox";
      if (t === "radio") return "radio";
      return t;
    }
    if (el.getAttribute("contenteditable") === "true") return "contenteditable";
    if (el.getAttribute("role") === "combobox") return "combobox";
    if (el.getAttribute("role") === "listbox") return "listbox";
    return tag;
  }

  function selectOptions(el) {
    if (el.tagName !== "SELECT") return [];
    return Array.from(el.options)
      .filter((o) => o.value !== "" || o.text)
      .map((o) => ({ value: o.value, label: (o.textContent || "").trim() }))
      .slice(0, 80);
  }

  function radioGroupOptions(el) {
    if ((el.getAttribute("type") || "").toLowerCase() !== "radio" || !el.name) return [];
    const radios = document.querySelectorAll(`input[type="radio"][name="${CSS.escape(el.name)}"]`);
    return Array.from(radios).map((r) => ({
      value: r.value,
      label: labelFor(r) || r.value,
    }));
  }

  function stableId(el, index) {
    if (el.id) return `id:${el.id}`;
    if (el.name) return `name:${el.name}:${el.type || el.tagName}:${index}`;
    return `idx:${index}:${el.tagName}`;
  }

  function detectFields(root) {
    const scope = root || document;
    const candidates = scope.querySelectorAll(
      "input, textarea, select, [contenteditable='true'], [role='combobox'], [role='textbox']"
    );

    const fields = [];
    const seenRadios = new Set();
    let index = 0;

    for (const el of candidates) {
      if (!visible(el)) continue;
      const type = fieldType(el);
      if (SKIP_TYPES.has(type)) continue;

      // One entry per radio group
      if (type === "radio") {
        const key = el.name || el.id || `radio-${index}`;
        if (seenRadios.has(key)) continue;
        seenRadios.add(key);
      }

      const rect = el.getBoundingClientRect();
      const field = {
        uid: stableId(el, index),
        index,
        tag: el.tagName.toLowerCase(),
        type,
        id: el.id || "",
        name: el.name || "",
        autocomplete: el.getAttribute("autocomplete") || "",
        placeholder: el.getAttribute("placeholder") || "",
        label: labelFor(el),
        nearby: nearbyText(el),
        required: el.required || el.getAttribute("aria-required") === "true",
        value: type === "checkbox" || type === "radio" ? "" : String(el.value || "").slice(0, 200),
        options: type === "select" ? selectOptions(el) : type === "radio" ? radioGroupOptions(el) : [],
        checked: type === "checkbox" ? !!el.checked : undefined,
        rect: { top: Math.round(rect.top + window.scrollY), left: Math.round(rect.left), width: Math.round(rect.width), height: Math.round(rect.height) },
      };
      fields.push(field);
      index += 1;
    }

    // Sort top-to-bottom, left-to-right
    fields.sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
    fields.forEach((f, i) => {
      f.visualOrder = i;
    });

    return {
      url: location.href,
      title: document.title,
      host: location.hostname,
      fieldCount: fields.length,
      fields,
    };
  }

  function findElement(field) {
    if (!field) return null;
    if (field.id) {
      const byId = document.getElementById(field.id);
      if (byId) return byId;
    }
    if (field.name) {
      const nodes = document.querySelectorAll(`[name="${CSS.escape(field.name)}"]`);
      if (nodes.length === 1) return nodes[0];
      if (field.type === "radio" && nodes.length) return nodes[0];
      if (field.type && nodes.length) {
        for (const n of nodes) {
          if ((n.getAttribute("type") || n.tagName.toLowerCase()) === field.type || n.tagName.toLowerCase() === field.tag) {
            return n;
          }
        }
      }
      if (nodes.length) return nodes[0];
    }
    // Fallback: re-detect and match by uid
    const snap = detectFields();
    const match = snap.fields.find((f) => f.uid === field.uid);
    if (match && match.id) return document.getElementById(match.id);
    return null;
  }

  global.CareerAutofillDetector = {
    detectFields,
    findElement,
    labelFor,
    visible,
  };
})(typeof window !== "undefined" ? window : self);
