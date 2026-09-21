/**
 * Local country flags + inference from region / scope / location text.
 * Assets live in /flags/{code}.svg
 */
(() => {
  const FLAG_BASE = "/flags";

  const COUNTRY_META = {
    br: { name: "Brazil", code: "br" },
    us: { name: "United States", code: "us" },
    de: { name: "Germany", code: "de" },
    cn: { name: "China", code: "cn" },
    se: { name: "Sweden", code: "se" },
    nl: { name: "Netherlands", code: "nl" },
    au: { name: "Australia", code: "au" },
    eu: { name: "Europe", code: "eu" },
    gb: { name: "United Kingdom", code: "gb" },
    fr: { name: "France", code: "fr" },
    ca: { name: "Canada", code: "ca" },
    in: { name: "India", code: "in" },
    jp: { name: "Japan", code: "jp" },
    pt: { name: "Portugal", code: "pt" },
    es: { name: "Spain", code: "es" },
    mx: { name: "Mexico", code: "mx" },
    ar: { name: "Argentina", code: "ar" },
    cl: { name: "Chile", code: "cl" },
    uy: { name: "Uruguay", code: "uy" },
    un: { name: "International / remote", code: "un" },
  };

  /** HQ / market detectors — HQ-shaped phrases win over loose Brazil mentions. */
  const HQ_RULES = [
    { code: "us", re: /\bunited states\s*hq\b|\busa\s*hq\b|\bu\.s\.?\s*hq\b/i },
    { code: "de", re: /\bgermany\s*hq\b|\bgerman\s*hq\b/i },
    { code: "cn", re: /\bchina\s*hq\b/i },
    { code: "se", re: /\bsweden\s*hq\b/i },
    { code: "nl", re: /\bnetherlands\s*hq\b/i },
    { code: "au", re: /\baustralia\s*(roots|hq)\b/i },
    { code: "gb", re: /\b(united kingdom|uk)\s*hq\b/i },
    { code: "fr", re: /\bfrance\s*hq\b/i },
    { code: "eu", re: /\beurope\s*remote\b|\beuropean\b/i },
  ];

  const PRIMARY_RULES = [
    { code: "us", re: /\b(united states|\busa\b|\bu\.s\.?\b)\b/i },
    { code: "de", re: /\b(germany|deutschland)\b/i },
    { code: "cn", re: /\b(china)\b/i },
    { code: "se", re: /\b(sweden)\b/i },
    { code: "nl", re: /\b(netherlands|holland)\b/i },
    { code: "au", re: /\b(australia)\b/i },
    { code: "gb", re: /\b(united kingdom|\buk\b|britain)\b/i },
    { code: "fr", re: /\b(france)\b/i },
    { code: "ca", re: /\b(canada)\b/i },
    { code: "in", re: /\b(india)\b/i },
    { code: "jp", re: /\b(japan)\b/i },
    { code: "pt", re: /\b(portugal)\b/i },
    { code: "es", re: /\b(spain)\b/i },
    { code: "mx", re: /\b(mexico)\b/i },
    { code: "ar", re: /\b(argentina)\b/i },
    { code: "cl", re: /\b(chile)\b/i },
    { code: "uy", re: /\b(uruguay)\b/i },
    { code: "eu", re: /\b(europe|european|cet\b)\b/i },
    {
      code: "br",
      re: /\b(brazil|brasil|campinas|são paulo|sao paulo|nova odessa|sumaré|sumare|paulínia|paulinia)\b/i,
    },
    { code: "un", re: /\b(international|global|remote|worldwide|anywhere)\b/i },
  ];

  const BR_PRESENCE_RE =
    /\b(brazil|brasil|campinas|são paulo|sao paulo|sp metro|nova odessa|sumaré|sumare|paulínia|paulinia|barão geraldo|barao geraldo|techno park)\b/i;

  function textOf(...parts) {
    return parts
      .flat()
      .filter((p) => p != null && String(p).trim())
      .map((p) => String(p))
      .join(" · ");
  }

  function hasBrazilPresence(text) {
    return BR_PRESENCE_RE.test(text || "");
  }

  function detectPrimary(text) {
    const t = text || "";
    for (const rule of HQ_RULES) {
      if (rule.re.test(t)) return rule.code;
    }
    for (const rule of PRIMARY_RULES) {
      if (rule.re.test(t)) return rule.code;
    }
    return "";
  }

  /**
   * @param {...string} parts region / scope / location / notes
   * @returns {{
   *   primary: string,
   *   codes: string[],
   *   brazilPresence: boolean,
   *   brazilIndustry: boolean,
   *   labels: string[]
   * }}
   */
  function resolveCountries(...parts) {
    const text = textOf(...parts);
    let primary = detectPrimary(text);
    const brazilPresence = hasBrazilPresence(text);

    // Scope shorthand used by portals
    const lower = text.toLowerCase();
    if (!primary && /\bbrazil\b/.test(lower)) primary = "br";
    if (!primary && /\binternational\b/.test(lower)) primary = "un";

    const codes = [];
    if (primary) codes.push(primary);
    // Foreign HQ with local Brazilian industry / ops / hiring footprint
    const brazilIndustry = brazilPresence && primary !== "br";
    if (brazilIndustry && !codes.includes("br")) codes.push("br");
    if (!codes.length && text.trim()) codes.push("un");

    return {
      primary: primary || (codes[0] || ""),
      codes,
      brazilPresence,
      brazilIndustry,
      labels: codes.map((c) => COUNTRY_META[c]?.name || c.toUpperCase()),
    };
  }

  function flagUrl(code) {
    return `${FLAG_BASE}/${code}.svg`;
  }

  function makeFlagImg(code, { title } = {}) {
    const meta = COUNTRY_META[code] || { name: code.toUpperCase(), code };
    const img = document.createElement("img");
    img.className = "flag-img";
    img.src = flagUrl(code);
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.title = title || meta.name;
    img.dataset.country = code;
    return img;
  }

  /**
   * Compact flag row for tiles. Optional BR industry cue when HQ ≠ Brazil
   * but text indicates ops / market in Brazil.
   */
  function renderFlagRow(resolved, { showBrazilCue = true } = {}) {
    const wrap = document.createElement("div");
    wrap.className = "country-flags";
    if (!resolved || !resolved.codes.length) {
      wrap.hidden = true;
      return wrap;
    }

    for (const code of resolved.codes) {
      const isExtraBr =
        code === "br" &&
        resolved.brazilIndustry &&
        resolved.primary &&
        resolved.primary !== "br";
      const title = isExtraBr
        ? "Industry / ops in Brazil"
        : COUNTRY_META[code]?.name || code.toUpperCase();
      wrap.append(makeFlagImg(code, { title }));
    }

    if (showBrazilCue && resolved.brazilIndustry) {
      const cue = document.createElement("span");
      cue.className = "brazil-presence";
      cue.title = "Has industry, offices, or active market in Brazil";
      cue.textContent = "BR industry";
      wrap.append(cue);
    }

    wrap.title = resolved.labels.join(" · ");
    return wrap;
  }

  /** Place flags before an existing title node (tile header). */
  function prependFlags(parent, titleEl, resolved, opts) {
    const row = document.createElement("div");
    row.className = "tile-flag-title";
    row.append(renderFlagRow(resolved, opts), titleEl);
    parent.append(row);
    return row;
  }

  window.CountryFlags = {
    COUNTRY_META,
    resolveCountries,
    hasBrazilPresence,
    flagUrl,
    makeFlagImg,
    renderFlagRow,
    prependFlags,
  };
})();
