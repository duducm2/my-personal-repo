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
    fetch:
      '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  };

  if (!document.getElementById("open-batch-fetch-btn")) {
    const fetchBtn = document.createElement("button");
    fetchBtn.type = "button";
    fetchBtn.id = "open-batch-fetch-btn";
    fetchBtn.className = "nav-btn";
    fetchBtn.title = "Select companies and batch-extract openings to Desktop (.txt)";
    const labelSpan = document.createElement("span");
    labelSpan.className = "section-title-en";
    labelSpan.textContent = "Fetch Openings";
    fetchBtn.append(labelSpan);
    const saveStatus = actions.querySelector("#save-status");
    if (saveStatus) actions.insertBefore(fetchBtn, saveStatus);
    else actions.append(fetchBtn);
  }

  function iconKeyFor(el) {
    const id = el.id || "";
    const href = el.getAttribute("href") || "";
    if (id === "open-batch-fetch-btn") return "fetch";
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

  // Batch Fetch Openings Modal (Phase 2)
  function ensureBatchFetchModal() {
    let dlg = document.getElementById("batch-fetch-modal");
    if (dlg) return dlg;

    dlg = document.createElement("dialog");
    dlg.id = "batch-fetch-modal";
    dlg.className = "company-modal batch-fetch-modal";
    dlg.innerHTML = `
      <div class="company-modal-head">
        <div>
          <h2 class="company-modal-title">Fetch Job Openings to Desktop</h2>
          <p class="batch-fetch-sub" id="batch-fetch-desktop-path"></p>
        </div>
        <button type="button" class="company-modal-close" id="batch-fetch-close" aria-label="Close">×</button>
      </div>
      <div class="batch-fetch-toolbar">
        <button type="button" class="nav-btn" id="batch-fetch-pinned">All pinned</button>
        <button type="button" class="nav-btn" id="batch-fetch-all">Select all</button>
        <button type="button" class="nav-btn" id="batch-fetch-none">Deselect all</button>
        <span class="batch-fetch-count" id="batch-fetch-count"></span>
      </div>
      <div class="batch-fetch-filters">
        <div class="batch-fetch-filter-pills" id="batch-fetch-filter-pills">
          <button type="button" class="filter-chip is-active" data-filter="all">All</button>
          <button type="button" class="filter-chip" data-filter="verified">Verified</button>
          <button type="button" class="filter-chip" data-filter="untested">Untested</button>
          <button type="button" class="filter-chip" data-filter="pinned">Pinned</button>
          <button type="button" class="filter-chip" data-filter="ready">.txt ready</button>
        </div>
        <input type="search" id="batch-fetch-search" class="batch-fetch-search" placeholder="Filter companies…" autocomplete="off" />
      </div>
      <div class="batch-fetch-list" id="batch-fetch-list"></div>
      <div class="batch-fetch-foot">
        <span class="save-status" id="batch-fetch-status"></span>
        <button type="button" class="save-btn" id="batch-fetch-run">Run Batch Extraction</button>
      </div>
    `;
    document.body.append(dlg);

    dlg.querySelector("#batch-fetch-close").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });

    const updateCount = () => {
      const boxes = [...dlg.querySelectorAll('input[name="batch-company"]')];
      const checked = boxes.filter((b) => b.checked).length;
      const countEl = dlg.querySelector("#batch-fetch-count");
      if (countEl) countEl.textContent = `${checked} of ${boxes.length} selected`;
    };

    dlg.querySelector("#batch-fetch-pinned").addEventListener("click", () => {
      for (const b of dlg.querySelectorAll('input[name="batch-company"]')) {
        b.checked = b.dataset.pinned === "1";
      }
      updateCount();
    });
    dlg.querySelector("#batch-fetch-all").addEventListener("click", () => {
      for (const b of dlg.querySelectorAll('input[name="batch-company"]')) {
        const row = b.closest(".batch-fetch-row");
        if (!row || !row.hidden) b.checked = true;
      }
      updateCount();
    });
    dlg.querySelector("#batch-fetch-none").addEventListener("click", () => {
      for (const b of dlg.querySelectorAll('input[name="batch-company"]')) {
        const row = b.closest(".batch-fetch-row");
        if (!row || !row.hidden) b.checked = false;
      }
      updateCount();
    });

    dlg.querySelector("#batch-fetch-filter-pills").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter]");
      if (!chip) return;
      for (const btn of dlg.querySelectorAll("#batch-fetch-filter-pills [data-filter]")) {
        btn.classList.toggle("is-active", btn === chip);
      }
      applyBatchFetchFilters(dlg);
    });

    dlg.querySelector("#batch-fetch-search").addEventListener("input", () => {
      applyBatchFetchFilters(dlg);
    });

    dlg.querySelector("#batch-fetch-list").addEventListener("change", updateCount);

    dlg.querySelector("#batch-fetch-list").addEventListener("click", async (e) => {
      const toggle = e.target.closest(".batch-fetch-toggle");
      if (!toggle) return;
      e.preventDefault();
      e.stopPropagation();
      const row = toggle.closest(".batch-fetch-row");
      const cid = toggle.dataset.id || "";
      const nextVerified = toggle.getAttribute("aria-pressed") !== "true";
      toggle.disabled = true;
      try {
        const res = await fetch("/api/openings-batch/verified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_id: cid, verified: nextVerified }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.ok === false) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        const isVer = !!data.verified;
        toggle.setAttribute("aria-pressed", isVer ? "true" : "false");
        toggle.classList.toggle("is-verified", isVer);
        toggle.classList.toggle("is-untested", !isVer);
        toggle.textContent = isVer ? "✓ Verified" : "Untested";
        toggle.title = isVer && data.verified_at
          ? `Tested & working (${data.verified_at}) — click to mark untested`
          : "Click to mark as tested & working";
        if (row) row.dataset.verified = isVer ? "1" : "0";
        updateBatchFetchPillCounts(dlg);
        applyBatchFetchFilters(dlg);
      } catch (err) {
        const statusEl = dlg.querySelector("#batch-fetch-status");
        if (statusEl) {
          statusEl.textContent = err.message || String(err);
          statusEl.className = "save-status err";
        }
      } finally {
        toggle.disabled = false;
      }
    });

    dlg.querySelector("#batch-fetch-run").addEventListener("click", async () => {
      const ids = [...dlg.querySelectorAll('input[name="batch-company"]:checked')].map(
        (b) => b.value
      );
      const statusEl = dlg.querySelector("#batch-fetch-status");
      const runBtn = dlg.querySelector("#batch-fetch-run");
      if (!ids.length) {
        if (statusEl) {
          statusEl.textContent = "Select at least one company.";
          statusEl.className = "save-status err";
        }
        return;
      }
      if (runBtn) runBtn.disabled = true;
      if (statusEl) {
        statusEl.textContent = `Running UIA extraction for ${ids.length} companies…`;
        statusEl.className = "save-status";
      }
      try {
        const res = await fetch("/api/openings-batch/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_ids: ids }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.ok === false) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        const items = Array.isArray(data.items) ? data.items : [];
        const okCount = items.filter((it) => it.ok).length;
        if (statusEl) {
          statusEl.textContent = `Done: ${okCount}/${items.length} saved to Desktop. Use Alt+R per company to ingest.`;
          statusEl.className = "save-status ok";
        }
        await populateBatchFetchModal(dlg, { preserveSelection: true });
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = err.message || String(err);
          statusEl.className = "save-status err";
        }
      } finally {
        if (runBtn) runBtn.disabled = false;
      }
    });

    return dlg;
  }

  function updateBatchFetchPillCounts(dlg) {
    const rows = [...dlg.querySelectorAll("#batch-fetch-list .batch-fetch-row")];
    const verifiedCount = rows.filter((r) => r.dataset.verified === "1").length;
    const untestedCount = rows.length - verifiedCount;
    const pinnedCount = rows.filter((r) => r.dataset.pinned === "1").length;
    const readyCount = rows.filter((r) => r.dataset.ready === "1").length;
    const pillLabels = {
      all: `All (${rows.length})`,
      verified: `Verified (${verifiedCount})`,
      untested: `Untested (${untestedCount})`,
      pinned: `Pinned (${pinnedCount})`,
      ready: `.txt ready (${readyCount})`,
    };
    for (const pill of dlg.querySelectorAll("#batch-fetch-filter-pills [data-filter]")) {
      const key = pill.dataset.filter;
      if (pillLabels[key]) pill.textContent = pillLabels[key];
    }
  }

  function applyBatchFetchFilters(dlg) {
    const activeChip = dlg.querySelector("#batch-fetch-filter-pills [data-filter].is-active");
    const mode = activeChip ? activeChip.dataset.filter : "all";
    const q = (dlg.querySelector("#batch-fetch-search")?.value || "").trim().toLowerCase();
    for (const row of dlg.querySelectorAll("#batch-fetch-list .batch-fetch-row")) {
      const pinned = row.dataset.pinned === "1";
      const verified = row.dataset.verified === "1";
      const ready = row.dataset.ready === "1";
      let match = true;
      if (mode === "verified") match = verified;
      else if (mode === "untested") match = !verified;
      else if (mode === "pinned") match = pinned;
      else if (mode === "ready") match = ready;
      if (match && q) {
        match = (row.dataset.search || "").includes(q);
      }
      row.hidden = !match;
    }
  }

  async function populateBatchFetchModal(dlg, opts = {}) {
    const listEl = dlg.querySelector("#batch-fetch-list");
    const subEl = dlg.querySelector("#batch-fetch-desktop-path");
    const statusEl = dlg.querySelector("#batch-fetch-status");
    const countEl = dlg.querySelector("#batch-fetch-count");
    const prevChecked = opts.preserveSelection
      ? new Set(
          [...dlg.querySelectorAll('input[name="batch-company"]:checked')].map(
            (b) => b.value
          )
        )
      : null;

    if (!opts.preserveSelection && statusEl) {
      statusEl.textContent = "Loading companies…";
      statusEl.className = "save-status";
    }

    try {
      const res = await fetch("/api/openings-batch/status");
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (subEl) {
        subEl.textContent = `Output folder: ${data.desktop_dir} (<company_id>-openings.txt)`;
      }
      listEl.replaceChildren();
      const companies = Array.isArray(data.companies) ? data.companies : [];
      let verifiedCount = 0;
      let untestedCount = 0;
      let pinnedCount = 0;
      let readyCount = 0;
      for (const c of companies) {
        if (c.verified) verifiedCount += 1;
        else untestedCount += 1;
        if (c.pinned) pinnedCount += 1;
        if (c.txt_exists) readyCount += 1;

        const row = document.createElement("label");
        row.className = "batch-fetch-row" + (c.pinned ? " is-pinned" : "");
        row.dataset.pinned = c.pinned ? "1" : "0";
        row.dataset.verified = c.verified ? "1" : "0";
        row.dataset.ready = c.txt_exists ? "1" : "0";
        row.dataset.search = `${c.name} ${c.id} ${c.family} ${c.city}`.toLowerCase();

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.name = "batch-company";
        cb.value = c.id;
        cb.dataset.pinned = c.pinned ? "1" : "0";
        cb.checked = prevChecked ? prevChecked.has(c.id) : !!c.pinned;

        const main = document.createElement("span");
        main.className = "batch-fetch-main";
        const title = document.createElement("strong");
        title.textContent = c.name;
        const meta = document.createElement("span");
        meta.className = "batch-fetch-meta";
        meta.textContent = `${c.family} · ${c.strategy}${c.city ? " · " + c.city : ""}`;
        main.append(title, meta);

        const badges = document.createElement("span");
        badges.className = "batch-fetch-badges";

        const verBadge = document.createElement("button");
        verBadge.type = "button";
        verBadge.className =
          "batch-fetch-badge batch-fetch-toggle " +
          (c.verified ? "is-verified" : "is-untested");
        verBadge.dataset.id = c.id;
        verBadge.setAttribute("aria-pressed", c.verified ? "true" : "false");
        verBadge.textContent = c.verified ? "✓ Verified" : "Untested";
        verBadge.title =
          c.verified && c.verified_at
            ? `Tested & working (${c.verified_at}) — click to mark untested`
            : "Click to mark as tested & working";
        badges.append(verBadge);

        const badge = document.createElement("span");
        badge.className =
          "batch-fetch-badge" + (c.txt_exists ? " is-ready" : "");
        badge.textContent = c.txt_exists
          ? `.txt ready (${c.txt_mtime})`
          : c.pinned
            ? "Pinned"
            : "Unpinned";
        badges.append(badge);

        row.append(cb, main, badges);
        listEl.append(row);
      }

      const pillLabels = {
        all: `All (${companies.length})`,
        verified: `Verified (${verifiedCount})`,
        untested: `Untested (${untestedCount})`,
        pinned: `Pinned (${pinnedCount})`,
        ready: `.txt ready (${readyCount})`,
      };
      for (const pill of dlg.querySelectorAll("#batch-fetch-filter-pills [data-filter]")) {
        const key = pill.dataset.filter;
        if (pillLabels[key]) pill.textContent = pillLabels[key];
      }
      applyBatchFetchFilters(dlg);

      const checkedCount = [...listEl.querySelectorAll('input[name="batch-company"]:checked')].length;
      if (countEl) countEl.textContent = `${checkedCount} of ${companies.length} selected`;
      if (!opts.preserveSelection && statusEl) statusEl.textContent = "";
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = err.message || String(err);
        statusEl.className = "save-status err";
      }
    }
  }

  const batchBtn = document.getElementById("open-batch-fetch-btn");
  if (batchBtn) {
    batchBtn.addEventListener("click", async () => {
      const dlg = ensureBatchFetchModal();
      if (!dlg.open) dlg.showModal();
      await populateBatchFetchModal(dlg);
    });
  }
})();
