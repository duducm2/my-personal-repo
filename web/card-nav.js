(() => {
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

  function focusFirst(selector) {
    const cards = list(selector);
    if (!cards.length) return false;
    requestAnimationFrame(() => {
      cards[0].focus({ preventScroll: false });
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
    return true;
  }

  function jumpPrefix(selector, ch) {
    const prefix = String(ch || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "");
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
    return true;
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
    focusFirst,
    move,
    jumpPrefix,
    isJumpKey,
  };
})();
