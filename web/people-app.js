(() => {
  const STATUSES = [
    { id: "to-contact", label: "To contact" },
    { id: "contacted", label: "Contacted" },
    { id: "replied", label: "Replied" },
    { id: "paused", label: "Paused" },
  ];
  const KINDS = [
    { id: "hiring", label: "Hiring" },
    { id: "network", label: "Network" },
  ];

  let collections = {};
  let people = [];
  let dirty = false;
  let saving = false;
  let saveTimer = null;
  let saveGeneration = 0;
  const SAVE_DEBOUNCE_MS = 500;
  const HUMAN_VOICE = [
    "=== VOICE (mandatory) ===",
    "Every sentence you write must sound like a person wrote it, and stay professional.",
    "An ATS should not be able to flag the text as generated.",
    "Use short sentences and the concrete facts already in the source: tools, dates, employers, outcomes.",
    "Do not open with excitement, passion, or a claim that you are thrilled.",
    "Do not glue clauses with an em dash.",
    'Do not use leverage, delve, robust, seamless, cutting-edge, holistic, foster, pivotal, landscape, tapestry, synergy, teamwork-driven, end-to-end ownership, or "not only ... but".',
    "No stacked adjectives and no padded lists of three.",
    "Copied facts stay exact: names, titles, URLs, dates, requisition numbers, and wording taken straight from the paste.",
    "This applies in English and in Portuguese.",
  ].join("\n");
  let companyFilter = "";
  let statusFilter = "";
  let kindFilter = "";
  let editingId = "";

  function cell(v) {
    return v == null ? "" : String(v);
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function slug(text) {
    const base = cell(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    return base || "person";
  }

  function companies() {
    return Array.isArray(collections.companies) ? collections.companies : [];
  }

  function openings() {
    return Array.isArray(collections.jobOpenings)
      ? collections.jobOpenings
      : [];
  }

  function companyById(id) {
    const key = cell(id);
    return companies().find((c) => cell(c.id) === key) || null;
  }

  function companyLabel(row) {
    const linked = companyById(row.company_key);
    if (linked)
      return (
        cell(linked.name_en) || cell(linked.name_pt) || cell(row.company_name)
      );
    return cell(row.company_name) || "No company";
  }

  function splitIds(raw) {
    return cell(raw)
      .split(/[|;,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function setDirty(next) {
    if (next) {
      dirty = true;
      saveGeneration += 1;
      document.body.classList.add("is-dirty");
      scheduleSave();
      return;
    }
    dirty = false;
    document.body.classList.remove("is-dirty");
  }

  function setSaveStatus(message, kind) {
    const el = document.getElementById("save-status");
    if (!el) return;
    el.textContent = message || "";
    el.className = "save-status" + (kind ? " " + kind : "");
  }

  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      void saveAll();
    }, SAVE_DEBOUNCE_MS);
  }

  async function saveAll() {
    if (saving) return false;
    if (!dirty) return true;
    const gen = saveGeneration;
    saving = true;
    setSaveStatus("Saving…");
    try {
      collections.hiringPeople = people;
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.ok === false) {
        throw new Error(payload.error || `HTTP ${res.status}`);
      }
      if (saveGeneration === gen) {
        dirty = false;
        document.body.classList.remove("is-dirty");
      }
      setSaveStatus("Saved.", "ok");
      return true;
    } catch (err) {
      setSaveStatus("Error: " + (err.message || String(err)), "err");
      return false;
    } finally {
      saving = false;
      if (dirty) scheduleSave();
    }
  }

  function personKind(row) {
    return cell(row && row.kind).toLowerCase() === "network"
      ? "network"
      : "hiring";
  }

  function blankPerson() {
    return {
      id: "",
      sort_order: String(people.length + 1),
      pinned: "",
      kind: kindFilter || "hiring",
      company_key: "",
      company_name: "",
      full_name: "",
      headline: "",
      linkedin_url: "",
      hiring_for: "",
      opening_ids: "",
      location: "",
      status: "to-contact",
      notes: "",
      found_on: today(),
    };
  }

  function uniqueId(base) {
    let id = base;
    let n = 2;
    const taken = new Set(people.map((p) => cell(p.id)));
    while (taken.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    return id;
  }

  function visiblePeople() {
    return people.filter((row) => {
      if (
        companyFilter &&
        cell(row.company_key) !== companyFilter &&
        companyLabel(row) !== companyFilter
      ) {
        return false;
      }
      if (kindFilter && personKind(row) !== kindFilter) return false;
      if (statusFilter && cell(row.status) !== statusFilter) return false;
      return true;
    });
  }

  function renderFilters() {
    const host = document.getElementById("people-filters");
    if (!host) return;
    host.replaceChildren();

    const kindRow = document.createElement("div");
    kindRow.className = "company-filter-row";
    const kindLabelEl = document.createElement("span");
    kindLabelEl.className = "company-filter-label";
    kindLabelEl.textContent = "Category";
    kindRow.append(kindLabelEl);
    for (const kind of KINDS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "filter-chip" + (kindFilter === kind.id ? " is-active" : "");
      btn.textContent = kind.label;
      btn.addEventListener("click", () => {
        kindFilter = kindFilter === kind.id ? "" : kind.id;
        render();
      });
      kindRow.append(btn);
    }

    const companyRow = document.createElement("div");
    companyRow.className = "company-filter-row";
    const companyLabelEl = document.createElement("span");
    companyLabelEl.className = "company-filter-label";
    companyLabelEl.textContent = "Company";
    const company = document.createElement("select");
    company.className = "field-input";
    company.setAttribute("aria-label", "Company");
    const all = document.createElement("option");
    all.value = "";
    all.textContent = "All companies";
    company.append(all);
    const seen = new Set();
    for (const row of people) {
      const key = cell(row.company_key) || companyLabel(row);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = companyLabel(row);
      company.append(opt);
    }
    company.value = [...company.options].some((o) => o.value === companyFilter)
      ? companyFilter
      : "";
    company.addEventListener("change", () => {
      companyFilter = company.value;
      render();
    });
    companyRow.append(companyLabelEl, company);

    const statusRow = document.createElement("div");
    statusRow.className = "company-filter-row";
    const statusLabel = document.createElement("span");
    statusLabel.className = "company-filter-label";
    statusLabel.textContent = "Status";
    statusRow.append(statusLabel);
    for (const status of STATUSES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "filter-chip" + (statusFilter === status.id ? " is-active" : "");
      btn.textContent = status.label;
      btn.addEventListener("click", () => {
        statusFilter = statusFilter === status.id ? "" : status.id;
        render();
      });
      statusRow.append(btn);
    }

    host.append(kindRow, companyRow, statusRow);
  }

  function render() {
    renderFilters();
    const host = document.getElementById("people-results");
    const count = document.getElementById("people-count");
    const rows = visiblePeople();
    if (count) {
      const companiesInView = new Set(rows.map(companyLabel)).size;
      const hiringCount = rows.filter(
        (row) => personKind(row) === "hiring",
      ).length;
      const networkCount = rows.length - hiringCount;
      const peopleWord = rows.length === 1 ? "person" : "people";
      const companyWord = companiesInView === 1 ? "company" : "companies";
      count.textContent = rows.length
        ? `${rows.length} ${peopleWord} · ${hiringCount} hiring · ${networkCount} network · ${companiesInView} ${companyWord}`
        : "No people yet. Alt+R pastes a LinkedIn profile.";
    }
    if (!host) return;
    host.replaceChildren();
    if (!rows.length) return;
    for (const kind of KINDS) {
      const kindRows = rows.filter((row) => personKind(row) === kind.id);
      if (!kindRows.length) continue;
      const kindSection = document.createElement("section");
      kindSection.className = "people-kind";
      const kindHeading = document.createElement("h2");
      kindHeading.className = "people-kind-title";
      kindHeading.textContent = `${kind.label} · ${kindRows.length}`;
      kindSection.append(kindHeading);
      const groups = new Map();
      for (const row of kindRows) {
        const label = companyLabel(row);
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label).push(row);
      }
      for (const [label, group] of [...groups.entries()].sort((a, b) =>
        a[0].localeCompare(b[0]),
      )) {
        const section = document.createElement("section");
        section.className = "people-group";
        const heading = document.createElement("h3");
        heading.className = "section-title";
        heading.textContent = `${label} · ${group.length}`;
        section.append(heading);
        const grid = document.createElement("div");
        grid.className = "company-bento";
        for (const row of group) {
          const card = document.createElement("button");
          card.type = "button";
          card.className = "company-tile";
          const badge = document.createElement("span");
          badge.className = `person-kind is-${kind.id}`;
          badge.textContent = kind.label;
          const title = document.createElement("span");
          title.className = "company-tile-title";
          title.textContent = cell(row.full_name) || "Unnamed";
          const meta = document.createElement("span");
          meta.className = "company-tile-meta";
          const status = STATUSES.find((s) => s.id === cell(row.status));
          const linked = splitIds(row.opening_ids)
            .map((id) => openings().find((o) => cell(o.id) === id))
            .filter(Boolean)
            .map((o) => cell(o.role_title));
          meta.textContent = [
            cell(row.headline),
            cell(row.hiring_for) ? `Hiring: ${cell(row.hiring_for)}` : "",
            linked.length ? linked.join(" · ") : "",
            status ? status.label : "",
          ]
            .filter(Boolean)
            .join(" · ");
          card.append(badge, title, meta);
          card.addEventListener("click", () => openEditor(row.id));
          grid.append(card);
        }
        section.append(grid);
        kindSection.append(section);
      }
      host.append(kindSection);
    }
  }

  function fillCompanySelect(select, selected) {
    select.replaceChildren();
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "No linked company";
    select.append(blank);
    for (const company of [...companies()].sort((a, b) =>
      cell(a.name_en).localeCompare(cell(b.name_en)),
    )) {
      const opt = document.createElement("option");
      opt.value = cell(company.id);
      opt.textContent = cell(company.name_en) || cell(company.id);
      select.append(opt);
    }
    if ([...select.options].some((o) => o.value === selected))
      select.value = selected;
  }

  function fillOpeningSelect(select, companyKey, selectedIds) {
    select.replaceChildren();
    const pool = openings().filter(
      (o) => !companyKey || cell(o.company_key) === companyKey,
    );
    const source = pool.length ? pool : openings();
    for (const opening of source) {
      const opt = document.createElement("option");
      opt.value = cell(opening.id);
      opt.textContent = `${cell(opening.role_title)} · ${cell(opening.location)}`;
      opt.selected = selectedIds.includes(opt.value);
      select.append(opt);
    }
  }

  function fillStatusSelect(select, selected) {
    select.replaceChildren();
    for (const status of STATUSES) {
      const opt = document.createElement("option");
      opt.value = status.id;
      opt.textContent = status.label;
      select.append(opt);
    }
    select.value = STATUSES.some((s) => s.id === selected)
      ? selected
      : "to-contact";
  }

  function readEditor(row) {
    row.full_name = cell(document.getElementById("people-edit-name")?.value);
    row.headline = cell(document.getElementById("people-edit-headline")?.value);
    row.company_key = cell(
      document.getElementById("people-edit-company")?.value,
    );
    row.company_name = cell(
      document.getElementById("people-edit-company-name")?.value,
    );
    const linked = companyById(row.company_key);
    if (linked && !row.company_name) row.company_name = cell(linked.name_en);
    row.linkedin_url = cell(
      document.getElementById("people-edit-linkedin")?.value,
    );
    row.kind = personKind({
      kind: document.getElementById("people-edit-kind")?.value,
    });
    row.hiring_for = cell(document.getElementById("people-edit-need")?.value);
    row.location = cell(document.getElementById("people-edit-location")?.value);
    row.status =
      cell(document.getElementById("people-edit-status")?.value) ||
      "to-contact";
    row.notes = cell(document.getElementById("people-edit-notes")?.value);
    const openingSelect = document.getElementById("people-edit-openings");
    row.opening_ids = openingSelect
      ? [...openingSelect.selectedOptions].map((o) => o.value).join("|")
      : row.opening_ids;
  }

  function openEditor(id) {
    const row = people.find((p) => cell(p.id) === id);
    if (!row) return;
    editingId = id;
    const kindSelect = document.getElementById("people-edit-kind");
    if (kindSelect) kindSelect.value = personKind(row);
    document.getElementById("people-edit-name").value = cell(row.full_name);
    document.getElementById("people-edit-headline").value = cell(row.headline);
    fillCompanySelect(
      document.getElementById("people-edit-company"),
      cell(row.company_key),
    );
    document.getElementById("people-edit-company-name").value = cell(
      row.company_name,
    );
    document.getElementById("people-edit-linkedin").value = cell(
      row.linkedin_url,
    );
    document.getElementById("people-edit-need").value = cell(row.hiring_for);
    document.getElementById("people-edit-location").value = cell(row.location);
    fillStatusSelect(
      document.getElementById("people-edit-status"),
      cell(row.status),
    );
    document.getElementById("people-edit-notes").value = cell(row.notes);
    fillOpeningSelect(
      document.getElementById("people-edit-openings"),
      cell(row.company_key),
      splitIds(row.opening_ids),
    );
    const link = document.getElementById("people-edit-open-link");
    const url = cell(row.linkedin_url);
    link.href = url || "#";
    link.hidden = !url;
    document.getElementById("people-edit-modal")?.showModal();
  }

  function closeEditor() {
    const row = people.find((p) => cell(p.id) === editingId);
    if (row) {
      readEditor(row);
      setDirty(true);
      render();
    }
    editingId = "";
    document.getElementById("people-edit-modal")?.close();
  }

  function addPerson() {
    const row = blankPerson();
    row.id = uniqueId("person");
    row.full_name = "New person";
    people.push(row);
    setDirty(true);
    render();
    openEditor(row.id);
  }

  function deleteEditing() {
    people = people.filter((p) => cell(p.id) !== editingId);
    editingId = "";
    document.getElementById("people-edit-modal")?.close();
    setDirty(true);
    render();
  }

  function selectedKind(id) {
    return personKind({ kind: document.getElementById(id)?.value });
  }

  function buildPrompt(rawText) {
    const kind = selectedKind("people-prompt-kind");
    const lines = [];
    lines.push(
      "You extract one person from a pasted LinkedIn profile into a people list.",
    );
    lines.push(
      "Return ONLY a JSON object. No markdown fence and no prose. The user will import it and delete anything wrong.",
    );
    lines.push("");
    lines.push(HUMAN_VOICE);
    lines.push(
      "hiring_for and notes follow VOICE. full_name, headline, and linkedin_url are copied from the paste, not rewritten.",
    );
    lines.push(
      "Keys: kind, full_name, headline, company_name, company_key, linkedin_url, hiring_for, opening_ids, location, notes.",
    );
    lines.push(`kind is exactly "${kind}".`);
    if (kind === "network") {
      lines.push(
        "This person is in the user's network. They are not being imported as someone who is hiring.",
      );
      lines.push(
        "Leave hiring_for and opening_ids empty unless the paste explicitly says this person is hiring for a listed opening.",
      );
    } else {
      lines.push(
        "This person is hiring. hiring_for is the role or team they are hiring for, taken from the profile. Leave it empty when the paste does not say.",
      );
      lines.push(
        "opening_ids is a pipe-separated list of ids from OPENINGS that this person is clearly hiring for. Leave it empty when that link is not explicit.",
      );
    }
    lines.push(
      "Both categories can have a company. company_key must be an id from COMPANIES or an empty string. Never invent an id.",
    );
    lines.push(
      "Do not invent a LinkedIn URL. Copy one only if it is in the paste.",
    );
    lines.push("full_name is required.");
    lines.push("");
    lines.push("=== COMPANIES ===");
    for (const company of companies()) {
      lines.push(
        `- ${cell(company.id)} | ${cell(company.name_en) || cell(company.name_pt)}`,
      );
    }
    lines.push("");
    lines.push("=== OPENINGS ===");
    for (const opening of openings()) {
      lines.push(
        `- ${cell(opening.id)} | ${cell(opening.company_key)} | ${cell(opening.role_title)} | ${cell(opening.location)}`,
      );
    }
    lines.push("");
    lines.push("=== LINKEDIN PROFILE ===");
    const text = cell(rawText).trim();
    lines.push(text.length > 50000 ? text.slice(0, 50000) : text || "(empty)");
    return lines.join("\n");
  }

  function openPrompt() {
    const status = document.getElementById("people-prompt-status");
    if (status) {
      status.textContent = "";
      status.className = "save-status";
    }
    const kindSelect = document.getElementById("people-prompt-kind");
    if (kindSelect) kindSelect.value = kindFilter || "hiring";
    document.getElementById("people-prompt-modal")?.showModal();
    document.getElementById("people-prompt-raw")?.focus();
  }

  function openImport(note) {
    const status = document.getElementById("people-import-status");
    const raw = document.getElementById("people-import-raw");
    if (status) {
      status.textContent = note || "";
      status.className = note ? "save-status ok" : "save-status";
    }
    const kindSelect = document.getElementById("people-import-kind");
    if (kindSelect) kindSelect.value = selectedKind("people-prompt-kind");
    document.getElementById("people-import-modal")?.showModal();
    requestAnimationFrame(() => {
      raw?.focus();
      raw?.select();
    });
  }

  async function sendPrompt() {
    const raw = cell(document.getElementById("people-prompt-raw")?.value);
    const status = document.getElementById("people-prompt-status");
    const button = document.getElementById("people-prompt-send");
    if (!raw.trim()) {
      if (status) {
        status.textContent = "Paste a LinkedIn profile first.";
        status.className = "save-status err";
      }
      return;
    }
    if (button) button.disabled = true;
    const dialog = document.getElementById("people-prompt-modal");
    if (dialog) {
      dialog.classList.add("is-generating");
      dialog.setAttribute("aria-busy", "true");
    }
    if (status) {
      status.textContent = "Generating the prompt…";
      status.className = "save-status";
    }
    try {
      const res = await fetch("/api/prompt-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: buildPrompt(raw) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        throw new Error(
          data.error || res.statusText || "Could not send the prompt",
        );
      }
      document.getElementById("people-prompt-modal")?.close();
      openImport("Prompt sent. Paste the companion’s JSON here.");
    } catch (err) {
      if (status) {
        status.textContent = err.message || String(err);
        status.className = "save-status err";
      }
    } finally {
      if (dialog) {
        dialog.classList.remove("is-generating");
        dialog.setAttribute("aria-busy", "false");
      }
      if (button) button.disabled = false;
    }
  }

  function parseImport(raw) {
    let text = cell(raw).trim();
    text = text
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    const data = JSON.parse(text);
    const list = Array.isArray(data)
      ? data
      : data && Array.isArray(data.people)
        ? data.people
        : [data];
    return list.filter((item) => item && typeof item === "object");
  }

  function importPeople() {
    const status = document.getElementById("people-import-status");
    const raw = cell(document.getElementById("people-import-raw")?.value);
    try {
      const list = parseImport(raw);
      if (!list.length) throw new Error("JSON has no person.");
      let count = 0;
      for (const item of list) {
        const fullName = cell(item.full_name).trim();
        if (!fullName) throw new Error("full_name is required.");
        const linkedin = cell(item.linkedin_url).trim();
        let row = linkedin
          ? people.find((p) => cell(p.linkedin_url).trim() === linkedin)
          : null;
        if (!row) {
          row = blankPerson();
          const companyKey = cell(item.company_key).trim();
          row.id = uniqueId(
            slug(`${fullName}-${companyKey || cell(item.company_name)}`),
          );
          people.push(row);
        }
        row.full_name = fullName;
        row.headline = cell(item.headline);
        row.company_name = cell(item.company_name);
        const companyKey = cell(item.company_key).trim();
        row.company_key = companyById(companyKey) ? companyKey : "";
        if (!row.company_name && row.company_key)
          row.company_name = companyLabel(row);
        row.linkedin_url = linkedin;
        row.kind = selectedKind("people-import-kind");
        row.hiring_for = cell(item.hiring_for);
        const ids = Array.isArray(item.opening_ids)
          ? item.opening_ids.map((id) => cell(id).trim()).filter(Boolean)
          : splitIds(item.opening_ids);
        const known = new Set(openings().map((o) => cell(o.id)));
        row.opening_ids = ids.filter((id) => known.has(id)).join("|");
        row.location = cell(item.location);
        row.notes = cell(item.notes);
        if (!row.found_on) row.found_on = today();
        if (!row.status) row.status = "to-contact";
        count += 1;
      }
      setDirty(true);
      render();
      document.getElementById("people-import-modal")?.close();
      setSaveStatus(`Imported ${count} person${count === 1 ? "" : "s"}.`, "ok");
    } catch (err) {
      if (status) {
        status.textContent = err.message || String(err);
        status.className = "save-status err";
      }
    }
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

  function init() {
    document
      .getElementById("people-add-btn")
      ?.addEventListener("click", addPerson);
    document
      .getElementById("people-prompt-btn")
      ?.addEventListener("click", openPrompt);
    document
      .getElementById("people-prompt-close")
      ?.addEventListener("click", () => {
        document.getElementById("people-prompt-modal")?.close();
      });
    document
      .getElementById("people-prompt-send")
      ?.addEventListener("click", () => void sendPrompt());
    document
      .getElementById("people-import-close")
      ?.addEventListener("click", () => {
        document.getElementById("people-import-modal")?.close();
      });
    document
      .getElementById("people-import-run")
      ?.addEventListener("click", importPeople);
    document
      .getElementById("people-edit-close")
      ?.addEventListener("click", closeEditor);
    document
      .getElementById("people-edit-delete")
      ?.addEventListener("click", deleteEditing);
    document
      .getElementById("people-edit-company")
      ?.addEventListener("change", () => {
        const key = cell(document.getElementById("people-edit-company")?.value);
        const name = document.getElementById("people-edit-company-name");
        const linked = companyById(key);
        if (name && linked && !cell(name.value).trim())
          name.value = cell(linked.name_en);
        fillOpeningSelect(
          document.getElementById("people-edit-openings"),
          key,
          [
            ...(document.getElementById("people-edit-openings")
              ?.selectedOptions || []),
          ].map((o) => o.value),
        );
      });
    document.addEventListener("keydown", (event) => {
      const modalOpen = [
        "people-prompt-modal",
        "people-import-modal",
        "people-edit-modal",
      ].some((id) => document.getElementById(id)?.open);
      if (
        (event.ctrlKey || event.metaKey || event.shiftKey) &&
        event.key === "Enter"
      ) {
        if (document.getElementById("people-prompt-modal")?.open) {
          event.preventDefault();
          void sendPrompt();
        } else if (document.getElementById("people-import-modal")?.open) {
          event.preventDefault();
          importPeople();
        }
        return;
      }
      if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;
      if (event.code !== "KeyR") return;
      if (modalOpen || isTypingTarget(document.activeElement)) return;
      event.preventDefault();
      openPrompt();
    });
    window.addEventListener("beforeunload", () => {
      if (!dirty) return;
      collections.hiringPeople = people;
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections }),
        keepalive: true,
      });
    });
  }

  async function load() {
    const res = await fetch("/api/state");
    if (!res.ok) throw new Error(`GET /api/state failed (${res.status})`);
    const payload = await res.json();
    collections = payload.collections || {};
    people = Array.isArray(collections.hiringPeople)
      ? collections.hiringPeople.map((row) => ({
          ...row,
          kind: personKind(row),
        }))
      : [];
    collections.hiringPeople = people;
    render();
  }

  init();
  load().catch((err) =>
    setSaveStatus("Load error: " + (err.message || String(err)), "err"),
  );
})();
