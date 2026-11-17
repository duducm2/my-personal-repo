(() => {
  let lastCard = null;
  let lastFilter = null;
  let hoveredCard = null;
  /** @type {{ cardSel: string, filterRootSel: string } | null} */
  let homeTargets = null;

  const CARD_HOVER_SELECTOR = ".company-tile, .job-tile, .panel[data-id]";
  let tooltipEl = null;
  let tooltipTimer = null;
  let tooltipCard = null;

  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement("div");
    tooltipEl.id = "card-hover-tooltip";
    tooltipEl.className = "card-hover-tooltip";
    tooltipEl.setAttribute("role", "tooltip");
    tooltipEl.hidden = true;
    document.body.append(tooltipEl);
    return tooltipEl;
  }

  function suppressNativeTitles(card) {
    if (!card) return;
    const targets = [card, card.querySelector(".company-tile-title")].filter(
      Boolean,
    );
    for (const el of targets) {
      if (el.hasAttribute("title") && !el.dataset.cardNativeTitle) {
        el.dataset.cardNativeTitle = el.getAttribute("title") || "";
        el.removeAttribute("title");
      }
    }
  }

  function restoreNativeTitles(card) {
    if (!card) return;
    const targets = [card, card.querySelector(".company-tile-title")].filter(
      Boolean,
    );
    for (const el of targets) {
      if (el.dataset.cardNativeTitle !== undefined) {
        el.setAttribute("title", el.dataset.cardNativeTitle);
        delete el.dataset.cardNativeTitle;
      }
    }
  }

  function cleanText(el, removeSelectors) {
    if (!el) return "";
    const clone = el.cloneNode(true);
    if (removeSelectors) {
      clone.querySelectorAll(removeSelectors).forEach((n) => n.remove());
    }
    return String(clone.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractCardTooltipData(card) {
    if (!card) return null;
    if (card.matches(".panel[data-id]")) {
      const heading =
        cleanText(card.querySelector(".panel-heading-en")) ||
        cleanText(card.querySelector(".panel-heading"));
      const lines = [];
      for (const row of card.querySelectorAll(".field-row")) {
        const valEl = row.querySelector(".field-value");
        if (!valEl || valEl.classList.contains("empty")) continue;
        const val = String(valEl.textContent || "").trim();
        if (!val) continue;
        const label = cleanText(row.querySelector(".field-label"));
        lines.push(label ? `${label}: ${val}` : val);
        if (lines.length >= 8) break;
      }
      if (!heading && !lines.length) return null;
      return {
        kicker: [],
        title: heading,
        meta: [],
        chips: [],
        body: lines.join("\n"),
      };
    }

    const kicker = [];
    const statusEl = card.querySelector(".job-tile-status");
    if (statusEl) {
      const s =
        statusEl.getAttribute("aria-label") ||
        statusEl.getAttribute("title") ||
        cleanText(statusEl);
      if (s) kicker.push(s);
    }
    const newBadge = cleanText(card.querySelector(".job-new-badge"));
    if (newBadge) kicker.push(newBadge);
    const matchEl = card.querySelector(".job-tile-match");
    if (matchEl) {
      const m = cleanText(matchEl);
      if (m) kicker.push(m);
    }
    const personKind = cleanText(card.querySelector(".person-kind"));
    if (personKind) kicker.push(personKind);
    const subCount = cleanText(card.querySelector(".company-sub-count"));
    if (subCount) kicker.push(subCount);

    const title = cleanText(
      card.querySelector(".company-tile-title"),
      ".job-new-badge, .country-flags",
    );
    const meta = [
      cleanText(card.querySelector(".company-tile-meta")),
      cleanText(card.querySelector(".company-last-opening")),
    ].filter(Boolean);

    const chips = [];
    const chipsHost = card.querySelector(".company-tile-chips");
    if (chipsHost) {
      for (const child of chipsHost.children) {
        if (
          child.matches(
            "button, .pin-btn, .ring-btn, .rec-rank-controls, .rec-rank-btn",
          )
        ) {
          continue;
        }
        const t = cleanText(child);
        if (t) chips.push(t);
      }
    }

    let body = "";
    const nextEl = card.querySelector(".job-tile-next");
    if (nextEl) {
      const label = cleanText(nextEl.querySelector(".job-tile-next-label"));
      const nextBody = cleanText(nextEl.querySelector(".job-tile-next-body"));
      body = label && nextBody ? `${label}: ${nextBody}` : cleanText(nextEl);
    }

    if (!title && !meta.length && !chips.length && !body) return null;
    return { kicker, title, meta, chips, body };
  }

  function hideCardTooltip() {
    clearTimeout(tooltipTimer);
    tooltipTimer = null;
    if (tooltipCard) {
      restoreNativeTitles(tooltipCard);
      tooltipCard = null;
    }
    if (tooltipEl) {
      tooltipEl.hidden = true;
      tooltipEl.replaceChildren();
    }
  }

  function positionTooltip(card) {
    if (!tooltipEl || tooltipEl.hidden || !card.isConnected) return;
    const rect = card.getBoundingClientRect();
    const tipRect = tooltipEl.getBoundingClientRect();
    const margin = 12;
    const gap = 8;

    let top = rect.bottom + gap;
    if (top + tipRect.height > window.innerHeight - margin) {
      const above = rect.top - tipRect.height - gap;
      if (above >= margin) {
        top = above;
      } else {
        top = Math.max(margin, window.innerHeight - tipRect.height - margin);
      }
    }
    const left = Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - tipRect.width - margin),
    );
    tooltipEl.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
  }

  function showCardTooltip(card) {
    if (!card || !card.isConnected) return;
    if (document.querySelector("dialog[open]")) return;
    const data = extractCardTooltipData(card);
    if (!data) return;

    const tip = ensureTooltip();
    tip.replaceChildren();

    if (data.kicker.length) {
      const kicker = document.createElement("div");
      kicker.className = "card-hover-tooltip-kicker";
      kicker.textContent = data.kicker.join(" · ");
      tip.append(kicker);
    }
    if (data.title) {
      const title = document.createElement("div");
      title.className = "card-hover-tooltip-title";
      title.textContent = data.title;
      tip.append(title);
    }
    for (const m of data.meta) {
      const meta = document.createElement("div");
      meta.className = "card-hover-tooltip-meta";
      meta.textContent = m;
      tip.append(meta);
    }
    if (data.chips.length) {
      const chips = document.createElement("div");
      chips.className = "card-hover-tooltip-chips";
      for (const c of data.chips) {
        const chip = document.createElement("span");
        chip.className = "card-hover-tooltip-chip";
        chip.textContent = c;
        chips.append(chip);
      }
      tip.append(chips);
    }
    if (data.body) {
      const body = document.createElement("div");
      body.className = "card-hover-tooltip-body";
      body.textContent = data.body;
      tip.append(body);
    }

    suppressNativeTitles(card);
    tooltipCard = card;
    tip.hidden = false;
    positionTooltip(card);
  }

  function scheduleCardTooltip(card) {
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => {
      if (hoveredCard === card) {
        showCardTooltip(card);
      }
    }, 110);
  }

  document.addEventListener(
    "pointerover",
    (event) => {
      const card = event.target?.closest?.(CARD_HOVER_SELECTOR);
      if (card) {
        const changed = hoveredCard !== card;
        hoveredCard = card;
        lastCard = card;
        if (isTypingTarget(event.target)) {
          hideCardTooltip();
          return;
        }
        if (changed) {
          hideCardTooltip();
          scheduleCardTooltip(card);
        }
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      const card = event.target?.closest?.(CARD_HOVER_SELECTOR);
      if (!card) return;
      if (event.relatedTarget && card.contains(event.relatedTarget)) {
        return;
      }
      if (hoveredCard === card) {
        hoveredCard = null;
      }
      if (tooltipCard === card || !hoveredCard) {
        hideCardTooltip();
      }
    },
    { passive: true },
  );

  window.addEventListener("scroll", hideCardTooltip, {
    capture: true,
    passive: true,
  });
  window.addEventListener("blur", hideCardTooltip);
  document.addEventListener("mousedown", hideCardTooltip, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideCardTooltip();
  });

  document.addEventListener(
    "focusin",
    (event) => {
      const card = event.target?.closest?.(
        ".company-tile, .job-tile, .panel[data-id]",
      );
      if (card) {
        lastCard = card;
      }
    },
    { passive: true },
  );

  function titleOf(card) {
    if (!card) return "";
    const title = card.querySelector(".company-tile-title");
    if (!title) {
      return String(card.textContent || "")
        .replace(/\s+/g, " ")
        .trim();
    }
    const en = title.querySelector(".panel-heading-en, .section-title-en");
    if (en && en.textContent.trim()) return en.textContent.trim();
    const clone = title.cloneNode(true);
    clone
      .querySelectorAll(".job-new-badge, .country-flags, .panel-heading-pt")
      .forEach((el) => el.remove());
    return String(clone.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function list(selector) {
    return [...document.querySelectorAll(selector)];
  }

  function filterChips(filterRootSel) {
    return list(`${filterRootSel} .filter-chip`);
  }

  function inFilters(el, filterRootSel) {
    const root = document.querySelector(filterRootSel);
    return !!(root && el && root.contains(el));
  }

  function inCards(el, cardSel) {
    return list(cardSel).includes(el);
  }

  function focusFirst(selector) {
    const cards = list(selector);
    if (!cards.length) return false;
    requestAnimationFrame(() => {
      cards[0].focus({ preventScroll: false });
      lastCard = cards[0];
    });
    return true;
  }

  function focusFirstFilter(filterRootSel) {
    const chips = filterChips(filterRootSel);
    if (!chips.length) return false;
    requestAnimationFrame(() => {
      chips[0].focus({ preventScroll: false });
      lastFilter = chips[0];
    });
    return true;
  }

  function configureHome(cardSel, filterRootSel) {
    homeTargets = {
      cardSel: cardSel || "",
      filterRootSel: filterRootSel || "",
    };
  }

  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      el.isContentEditable
    );
  }

  /** Home: jump to the first card in the list (or first filter chip if filters are focused). */
  function goHome() {
    if (!homeTargets?.cardSel) return false;
    const active = document.activeElement;
    if (isTypingTarget(active)) return false;
    if (active?.closest?.("dialog[open]")) return false;

    const { cardSel, filterRootSel } = homeTargets;
    if (filterRootSel && inFilters(active, filterRootSel)) {
      return focusFirstFilter(filterRootSel);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return focusFirst(cardSel);
  }

  function move(selector, delta) {
    const cards = list(selector);
    if (!cards.length) return false;
    const active = document.activeElement;
    let i = cards.indexOf(active);
    if (i < 0) i = delta > 0 ? -1 : 0;
    const next = Math.max(0, Math.min(cards.length - 1, i + delta));
    cards[next].focus({ preventScroll: false });
    lastCard = cards[next];
    return true;
  }

  function moveFilters(filterRootSel, delta) {
    const chips = filterChips(filterRootSel);
    if (!chips.length) return false;
    const active = document.activeElement;
    let i = chips.indexOf(active);
    if (i < 0) i = delta > 0 ? -1 : 0;
    const next = Math.max(0, Math.min(chips.length - 1, i + delta));
    chips[next].focus({ preventScroll: false });
    lastFilter = chips[next];
    return true;
  }

  function moveInContext(cardSel, filterRootSel, delta) {
    const active = document.activeElement;
    if (inFilters(active, filterRootSel)) {
      return moveFilters(filterRootSel, delta);
    }
    return move(cardSel, delta);
  }

  function inMain(el, mainEls) {
    return !!(el && mainEls.includes(el));
  }

  function focusEl(el, asFilter) {
    if (!el) return false;
    el.focus({ preventScroll: false });
    if (asFilter) lastFilter = el;
    else lastCard = el;
    return true;
  }

  /**
   * Toggle focus between filter chips and the "main" area.
   * mainSel: cards (default) or field inputs when a modal/profile editor is active.
   * fieldSel: when this matches any elements (e.g. open modal fields), those win over cards.
   */
  function toggleCardsFilters(cardSel, filterRootSel, fieldSel) {
    const active = document.activeElement;
    const chips = filterChips(filterRootSel);
    const fields = fieldSel ? list(fieldSel) : [];
    const cards = cardSel ? list(cardSel) : [];
    const mains = fields.length ? fields : cards;
    if (!chips.length && !mains.length) return false;

    const onMain = inMain(active, mains);
    const onFilter = inFilters(active, filterRootSel);

    if (onMain || (!onFilter && mains.length)) {
      if (onMain) lastCard = active;
      const filterRoot = document.querySelector(filterRootSel);
      const dock = filterRoot?.closest(".filters-dock");
      if (dock && !dock.classList.contains("is-open")) setFiltersOpen(true);
      const target =
        lastFilter && chips.includes(lastFilter) ? lastFilter : chips[0];
      if (!target) return focusEl(mains[0], false);
      return focusEl(target, true);
    }

    if (onFilter && chips.includes(active)) lastFilter = active;
    const target = lastCard && mains.includes(lastCard) ? lastCard : mains[0];
    if (!target) {
      if (!chips[0]) return false;
      return focusEl(chips[0], true);
    }
    return focusEl(target, false);
  }

  function toggleFiltersMain(filterRootSel, mainSel) {
    return toggleCardsFilters(null, filterRootSel, mainSel);
  }

  const FILTERS_OPEN_KEY = "career-filters-open";

  function filtersAreOpen() {
    try {
      return sessionStorage.getItem(FILTERS_OPEN_KEY) === "1";
    } catch {
      return false;
    }
  }

  function rememberFiltersOpen(open) {
    try {
      sessionStorage.setItem(FILTERS_OPEN_KEY, open ? "1" : "0");
    } catch {
      /* private mode */
    }
  }

  function activeFilterCount(root) {
    let count = 0;
    root.querySelectorAll(".company-filter-row").forEach((row) => {
      const chips = row.querySelectorAll(".filter-chip");
      chips.forEach((chip, index) => {
        if (index > 0 && chip.classList.contains("is-active")) count += 1;
      });
    });
    return count;
  }

  function syncFilterDock(dock, open) {
    const root = dock.querySelector(".company-filters");
    const btn = dock.querySelector(".filters-toggle");
    if (!root || !btn) return;
    dock.classList.toggle("is-open", open);
    root.classList.toggle("is-contracted", !open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.title = open
      ? "Hide filters (Alt+Shift+K)"
      : "Show filters (Alt+Shift+K)";
    const count = activeFilterCount(root);
    const badge = btn.querySelector(".filters-toggle-count");
    if (badge) {
      badge.hidden = count === 0;
      badge.textContent = count ? String(count) : "";
    }
    if (!open && root.contains(document.activeElement)) btn.focus();
  }

  function setFiltersOpen(open) {
    rememberFiltersOpen(open);
    document.querySelectorAll(".filters-dock").forEach((dock) => {
      syncFilterDock(dock, open);
    });
  }

  function toggleFilterDock() {
    setFiltersOpen(!filtersAreOpen());
  }

  function mountFilterDocks() {
    document.querySelectorAll(".company-filters").forEach((root) => {
      if (root.closest(".filters-dock")) return;
      const dock = document.createElement("div");
      dock.className = "filters-dock";
      root.parentNode.insertBefore(dock, root);
      dock.append(root);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filters-toggle";
      if (root.id) btn.setAttribute("aria-controls", root.id);
      const mark = document.createElement("span");
      mark.className = "filters-toggle-mark";
      mark.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = "Filters";
      const kbd = document.createElement("kbd");
      kbd.className = "btn-kbd";
      kbd.textContent = "Alt+Shift+K";
      const badge = document.createElement("span");
      badge.className = "filters-toggle-count";
      badge.hidden = true;
      btn.append(mark, label, kbd, badge);
      btn.addEventListener("click", () => toggleFilterDock());
      dock.insertBefore(btn, root);

      const refresh = () => syncFilterDock(dock, filtersAreOpen());
      const observer = new MutationObserver(refresh);
      observer.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });
      refresh();
    });
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.ctrlKey || event.metaKey || !event.altKey || !event.shiftKey) {
        return;
      }
      if (event.code !== "KeyK") return;
      if (!document.querySelector(".filters-dock, .company-filters")) return;
      event.preventDefault();
      event.stopPropagation();
      toggleFilterDock();
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return;
      }
      if (event.key !== "Home" && event.code !== "Home") return;
      if (!goHome()) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFilterDocks);
  } else {
    mountFilterDocks();
  }

  function filterLabel(chip) {
    if (!chip) return "";
    const en = chip.querySelector(".filter-chip-en, .section-title-en");
    if (en && en.textContent.trim()) return en.textContent.trim();
    const clone = chip.cloneNode(true);
    clone
      .querySelectorAll(".filter-chip-pt, kbd, .btn-kbd")
      .forEach((el) => el.remove());
    return String(clone.textContent || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeJumpChar(ch) {
    return String(ch || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");
  }

  function jumpPrefix(selector, ch) {
    const prefix = normalizeJumpChar(ch);
    if (!prefix || prefix.length !== 1) return false;
    if (!/[\p{L}\p{N}]/u.test(prefix)) return false;

    const cards = list(selector);
    if (!cards.length) return false;

    const matches = cards.filter((card) => {
      const t = titleOf(card)
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{M}/gu, "");
      return t.startsWith(prefix);
    });
    if (!matches.length) return false;

    const active = document.activeElement;
    const cur = matches.indexOf(active);
    const next = matches[(cur + 1) % matches.length];
    next.focus({ preventScroll: false });
    lastCard = next;
    return true;
  }

  function jumpFilterPrefix(filterRootSel, ch) {
    const prefix = normalizeJumpChar(ch);
    if (!prefix || prefix.length !== 1) return false;
    if (!/[\p{L}\p{N}]/u.test(prefix)) return false;

    const chips = filterChips(filterRootSel);
    if (!chips.length) return false;

    const matches = chips.filter((chip) => {
      const t = filterLabel(chip)
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{M}/gu, "");
      return t.startsWith(prefix);
    });
    if (!matches.length) return false;

    const active = document.activeElement;
    const cur = matches.indexOf(active);
    const next = matches[(cur + 1) % matches.length];
    next.focus({ preventScroll: false });
    lastFilter = next;
    return true;
  }

  function jumpInContext(cardSel, filterRootSel, ch) {
    const active = document.activeElement;
    if (inFilters(active, filterRootSel)) {
      return jumpFilterPrefix(filterRootSel, ch);
    }
    return jumpPrefix(cardSel, ch);
  }

  function isJumpKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
      return false;
    }
    if (event.key.length !== 1) return false;
    return /[\p{L}\p{N}]/u.test(event.key);
  }

  window.CardNav = {
    titleOf,
    filterLabel,
    focusFirst,
    focusFirstFilter,
    configureHome,
    goHome,
    move,
    moveFilters,
    moveInContext,
    toggleCardsFilters,
    toggleFiltersMain,
    toggleFilterDock,
    setFiltersOpen,
    jumpPrefix,
    jumpFilterPrefix,
    jumpInContext,
    isJumpKey,
    getLastCard: () => lastCard,
    setLastCard: (card) => {
      lastCard = card;
    },
    getHoveredCard: () => hoveredCard,
  };
})();
