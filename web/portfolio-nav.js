const portfolioButton = document.getElementById("open-portfolio-btn");
const portfolioMenu = document.getElementById("portfolio-menu");
if (portfolioButton && portfolioMenu) {
  // Pair each public portfolio link with a private Customize action
  const menuLinks = [...portfolioMenu.querySelectorAll("a[role='menuitem']")];
  menuLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || link.closest(".portfolio-menu-row")) return;

    const row = document.createElement("div");
    row.className = "portfolio-menu-row";
    link.parentNode.insertBefore(row, link);
    row.append(link);

    const cust = document.createElement("a");
    cust.setAttribute("role", "menuitem");
    cust.className = "portfolio-customize-link";
    cust.href = `${href}${href.includes("?") ? "&" : "?"}customize=1`;
    cust.target = "_blank";
    cust.rel = "noopener";
    cust.title = "Customize sections and export PDF";
    cust.textContent = "Customize";
    row.append(cust);
  });

  portfolioMenu.addEventListener("click", (event) => {
    if (event.target.closest("a[role='menuitem']")) {
      closePortfolioMenu();
    }
  });

function placePortfolioMenu() {
  const rect = portfolioButton.getBoundingClientRect();
  portfolioMenu.style.top = `${rect.bottom + 4}px`;
  portfolioMenu.style.left = `${Math.max(8, rect.right - portfolioMenu.offsetWidth)}px`;
}

function openPortfolioMenu(event) {
  event.preventDefault();
  portfolioMenu.hidden = false;
  portfolioButton.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    placePortfolioMenu();
    portfolioMenu.querySelector("a")?.focus();
  });
}

function closePortfolioMenu() {
  portfolioMenu.hidden = true;
  portfolioButton.setAttribute("aria-expanded", "false");
}

portfolioButton.addEventListener("click", (event) => {
  if (portfolioMenu.hidden) openPortfolioMenu(event);
  else closePortfolioMenu();
});

portfolioButton.addEventListener("contextmenu", openPortfolioMenu);

document.addEventListener("click", (event) => {
  if (portfolioMenu.hidden) return;
  if (portfolioButton.contains(event.target) || portfolioMenu.contains(event.target)) return;
  closePortfolioMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !portfolioMenu.hidden) {
    closePortfolioMenu();
    portfolioButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (!portfolioMenu.hidden) placePortfolioMenu();
});
}

// Ensure every portal page header has Publish and LinkedIn Plan buttons
(() => {
  const actions = document.querySelector(".hero-actions");
  if (!actions) return;

  const ensureHeaderLink = (href, label, title, afterEl) => {
    const existing = actions.querySelector(`a[href="${href}"]`);
    if (existing) {
      if (location.pathname === href) {
        existing.classList.add("is-active");
        existing.setAttribute("aria-current", "page");
      }
      return existing;
    }
    const link = document.createElement("a");
    link.className = "nav-btn";
    if (location.pathname === href) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
    link.href = href;
    link.title = title;
    const span = document.createElement("span");
    span.className = "section-title-en";
    span.textContent = label;
    link.append(span);
    if (afterEl && afterEl.nextSibling) {
      actions.insertBefore(link, afterEl.nextSibling);
    } else if (afterEl) {
      actions.append(link);
    } else {
      actions.append(link);
    }
    return link;
  };

  const portfolioNav = actions.querySelector(".portfolio-nav");
  const publishLink = ensureHeaderLink(
    "/publish.html",
    "Publish",
    "Step-by-step GitHub Pages publishing guide",
    portfolioNav
  );
  ensureHeaderLink(
    "/linkedin-plan.html",
    "LinkedIn Plan",
    "LinkedIn Premium Business plan & AI job-search context",
    publishLink
  );

  // Add crisp 12x12 SVG icons to every header navigation button
  const ICON_PATHS = {
    portals:
      '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    jobs:
      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
    companies:
      '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M14 9h4a2 2 0 0 1 2 2v10"/><path d="M2 21h20"/><path d="M7.5 7.5h1M10.5 7.5h1M7.5 11.5h1M10.5 11.5h1M7.5 15.5h1M10.5 15.5h1"/>',
    profile:
      '<circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    people:
      '<circle cx="9" cy="8" r="3.5"/><path d="M3 19a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 5 4.5"/>',
    hiring:
      '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    portfolio:
      '<rect x="3" y="4" width="7" height="7" rx="1"/><rect x="14" y="4" width="7" height="7" rx="1"/><rect x="3" y="15" width="7" height="7" rx="1"/><rect x="14" y="15" width="7" height="7" rx="1"/>',
    publish:
      '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
    linkedin:
      '<path d="M12 3l2.4 5.1 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z"/>',
    advice:
      '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.2 1.4 1.3 2.4h5c.1-1 .6-1.8 1.3-2.4A6 6 0 0 0 12 3z"/>',
    help:
      '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7"/><circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none"/>',
  };

  function iconKeyFor(el) {
    const id = el.id || "";
    const href = el.getAttribute("href") || "";
    if (id === "open-portals-btn" || href === "/portals.html") return "portals";
    if (
      id === "open-openings-btn" ||
      id === "open-jobs-btn" ||
      href === "/jobs.html"
    )
      return "jobs";
    if (id === "open-companies-btn" || href === "/companies.html")
      return "companies";
    if (id === "open-profile-btn" || href === "/profile.html") return "profile";
    if (href === "/people.html") return "people";
    if (href === "/hiring.html") return "hiring";
    if (id === "open-portfolio-btn") return "portfolio";
    if (href === "/publish.html") return "publish";
    if (href === "/linkedin-plan.html") return "linkedin";
    if (id === "open-advice-btn" || href === "/advice.html") return "advice";
    if (id === "open-help-btn" || href === "/help.html") return "help";
    return null;
  }

  for (const btn of actions.querySelectorAll(".nav-btn")) {
    if (btn.querySelector(".nav-btn-icon")) continue;
    const key = iconKeyFor(btn);
    if (!key || !ICON_PATHS[key]) continue;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "nav-btn-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.9");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = ICON_PATHS[key];
    btn.prepend(svg);
  }
})();
