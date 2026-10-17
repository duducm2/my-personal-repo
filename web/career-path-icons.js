(() => {
  const ALIASES = {
    general: "general",
    gen: "general",
    "data-analyst": "data-analyst",
    da: "data-analyst",
    "product-owner": "product-owner",
    po: "product-owner",
    "digital-solution-architect": "digital-solution-architect",
    dsa: "digital-solution-architect",
  };

  // Simple 16×16 stroke icons (currentColor) for path chips / downloads.
  const ICONS = {
    general:
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2.5 5.5h11v8h-11z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>' +
      '<path d="M5.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>' +
      "</svg>",
    "product-owner":
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="1.75" y="2.5" width="3.5" height="11" rx="0.6" stroke="currentColor" stroke-width="1.25"/>' +
      '<rect x="6.25" y="2.5" width="3.5" height="7" rx="0.6" stroke="currentColor" stroke-width="1.25"/>' +
      '<rect x="10.75" y="2.5" width="3.5" height="9" rx="0.6" stroke="currentColor" stroke-width="1.25"/>' +
      "</svg>",
    "data-analyst":
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2.5 13.25h11" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/>' +
      '<path d="M4 11V7.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M8 11V4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M12 11V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
      "</svg>",
    "digital-solution-architect":
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M2.5 5.5 8 2.75 13.5 5.5 8 8.25 2.5 5.5Z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>' +
      '<path d="M2.5 8.25 8 11l5.5-2.75" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>' +
      '<path d="M2.5 10.75 8 13.5l5.5-2.75" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>' +
      "</svg>",
  };

  function resolveKey(key) {
    if (!key) return "";
    return ALIASES[String(key).trim().toLowerCase()] || "";
  }

  function pathIconHtml(key) {
    const resolved = resolveKey(key);
    const svg = ICONS[resolved];
    if (!svg) return "";
    return `<span class="path-icon" aria-hidden="true">${svg}</span>`;
  }

  function pathIconNode(key) {
    const html = pathIconHtml(key);
    if (!html) return null;
    const wrap = document.createElement("span");
    wrap.innerHTML = html;
    return wrap.firstElementChild;
  }

  function labelWithIcon(key, text) {
    const frag = document.createDocumentFragment();
    const icon = pathIconNode(key);
    if (icon) frag.append(icon);
    const span = document.createElement("span");
    span.className = "path-icon-label";
    span.textContent = text;
    frag.append(span);
    return frag;
  }

  window.CareerPathIcons = {
    resolveKey,
    pathIconHtml,
    pathIconNode,
    labelWithIcon,
  };
})();
