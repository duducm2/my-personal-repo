(() => {
  let lastCard = null;
  let lastFilter = null;

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
    const target =
      lastCard && mains.includes(lastCard) ? lastCard : mains[0];
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
      ? "Hide filters (Alt+Shift+B)"
      : "Show filters (Alt+Shift+B)";
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
      kbd.textContent = "Alt+Shift+B";
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
      if (event.code !== "KeyB") return;
      if (!document.querySelector(".filters-dock, .company-filters")) return;
      event.preventDefault();
      event.stopPropagation();
      toggleFilterDock();
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
  };
})();
