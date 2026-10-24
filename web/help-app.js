(() => {
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

  function initKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        location.assign("/");
        return;
      }
      if (
        !event.shiftKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isTypingTarget(document.activeElement)
      ) {
        return;
      }
      const k = (event.key || "").toLowerCase();
      if (k === "j") {
        event.preventDefault();
        location.assign("/portals.html");
        return;
      }
      if (k === "g" || event.code === "KeyG") {
        event.preventDefault();
        location.assign("/");
        return;
      }
      if (k === "c") {
        event.preventDefault();
        location.assign("/companies.html");
        return;
      }
      if (k === "p") {
        event.preventDefault();
        location.assign("/profile.html");
        return;
      }
      if (k === "o" || event.code === "KeyO") {
        event.preventDefault();
        location.assign("/people.html");
        return;
      }
      if (k === "h") {
        event.preventDefault();
        location.assign("/help.html");
        return;
      }
      if (k === "a") {
        event.preventDefault();
        location.assign("/advice.html");
      }
    });
  }

  function init() {
    initKeyboard();
    document
      .getElementById("open-portals-btn")
      ?.addEventListener("click", () => location.assign("/portals.html"));
    document
      .getElementById("open-openings-btn")
      ?.addEventListener("click", () => location.assign("/"));
    document
      .getElementById("open-companies-btn")
      ?.addEventListener("click", () => location.assign("/companies.html"));
    document
      .getElementById("open-profile-btn")
      ?.addEventListener("click", () => location.assign("/profile.html"));
    document
      .getElementById("open-advice-btn")
      ?.addEventListener("click", () => location.assign("/advice.html"));
  }

  init();
})();
