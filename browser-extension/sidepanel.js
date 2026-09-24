const logEl = document.getElementById("log");
const cockpitInput = document.getElementById("cockpit-url");
const jobSelect = document.getElementById("job-select");
const tabTitle = document.getElementById("tab-title");
const tabUrl = document.getElementById("tab-url");
const banner = document.getElementById("state-banner");
const payloadInfo = document.getElementById("payload-info");
const matchJob = document.getElementById("match-job");
const matchMeta = document.getElementById("match-meta");
const runBtn = document.getElementById("run-btn");
const captureBtn = document.getElementById("capture-btn");
const hint = document.getElementById("hint");
const stepper = document.getElementById("stepper");
const includeHtml = document.getElementById("include-html");

let lastMatch = null;
let lastTab = null;
let jobsCache = [];

function log(msg) {
  const line = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
  logEl.textContent =
    `${new Date().toLocaleTimeString()}  ${line}\n` + logEl.textContent;
}

async function cockpitUrl() {
  return (cockpitInput.value || "http://127.0.0.1:8770").replace(/\/$/, "");
}

function setStepper(activeStep, doneThrough) {
  for (const li of stepper.querySelectorAll("li")) {
    const n = Number(li.getAttribute("data-step"));
    li.classList.remove("is-active", "is-done");
    if (n <= doneThrough) li.classList.add("is-done");
    if (n === activeStep) li.classList.add("is-active");
  }
}

function setBanner(kind, text) {
  banner.className = `banner banner-${kind}`;
  banner.textContent = text;
}

async function getActiveTab() {
  const tab = await chrome.runtime.sendMessage({ type: "GET_ACTIVE_TAB" });
  return tab && tab.id != null ? tab : null;
}

function selectedJobId() {
  return jobSelect.value || null;
}

function fillJobSelect(jobs, preferId) {
  jobsCache = jobs || [];
  const prev = preferId || jobSelect.value || "";
  jobSelect.innerHTML = "";
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = jobsCache.length
    ? "(pick opening for capture / fill)"
    : "No openings — start the cockpit";
  jobSelect.appendChild(blank);
  for (const j of jobsCache) {
    const opt = document.createElement("option");
    opt.value = j.id;
    const mark = j.has_payload === "1" || j.has_payload === true ? " ●" : "";
    opt.textContent = `${j.company} — ${j.role_title}${mark}`;
    jobSelect.appendChild(opt);
  }
  if (prev && [...jobSelect.options].some((o) => o.value === prev)) {
    jobSelect.value = prev;
  }
}

async function loadJobs(preferId) {
  try {
    const base = await cockpitUrl();
    const res = await chrome.runtime.sendMessage({
      type: "API_FETCH",
      cockpitUrl: base,
      path: "/api/autofill/state",
      method: "GET",
    });
    if (!res || !res.ok) throw new Error((res && res.error) || "state failed");
    const jobs = res.data.jobs || [];
    let prefer = preferId;
    if (!prefer && res.data.pending && res.data.pending.job_id) {
      prefer = res.data.pending.job_id;
    }
    fillJobSelect(jobs, prefer);
    return res.data;
  } catch (err) {
    fillJobSelect([], "");
    log(`Load jobs error: ${err.message || err}`);
    return null;
  }
}

async function refreshMatch() {
  lastTab = await getActiveTab();
  if (!lastTab) {
    tabTitle.textContent = "No active tab";
    tabUrl.textContent = "—";
    lastMatch = null;
    payloadInfo.hidden = true;
    runBtn.disabled = true;
    setBanner("warn", "No active tab. Open an application form page first.");
    setStepper(1, 0);
    return;
  }

  tabTitle.textContent = lastTab.title || "(untitled)";
  tabUrl.textContent = lastTab.url || "—";

  if (
    lastTab.url &&
    (lastTab.url.startsWith("chrome://") ||
      lastTab.url.startsWith("chrome-extension://") ||
      lastTab.url.startsWith("edge://"))
  ) {
    lastMatch = null;
    payloadInfo.hidden = true;
    runBtn.disabled = true;
    setBanner(
      "err",
      "Cannot use browser internal pages. Switch to the application form tab.",
    );
    setStepper(1, 0);
    return;
  }

  try {
    const pending = await chrome.runtime.sendMessage({
      type: "GET_PENDING_JOB",
    });
    const pendingId = (pending && pending.jobId) || null;
    await loadJobs(pendingId || selectedJobId());

    const jobId = selectedJobId() || pendingId;
    const base = await cockpitUrl();
    const qs = new URLSearchParams();
    if (lastTab.url) qs.set("url", lastTab.url);
    if (jobId) qs.set("job_id", jobId);
    const res = await chrome.runtime.sendMessage({
      type: "API_FETCH",
      cockpitUrl: base,
      path: `/api/autofill/answers-for-url?${qs.toString()}`,
      method: "GET",
    });
    if (!res || !res.ok) {
      throw new Error(
        (res && res.error) || "Lookup failed — is the cockpit running?",
      );
    }
    lastMatch = res.data;
    if (lastMatch.job && lastMatch.job.id && !selectedJobId()) {
      jobSelect.value = lastMatch.job.id;
    }
    renderMatchState(lastMatch);
  } catch (err) {
    lastMatch = null;
    payloadInfo.hidden = true;
    runBtn.disabled = true;
    setBanner("err", String(err.message || err));
    setStepper(1, 0);
    log(`Lookup error: ${err.message || err}`);
  }
}

function renderMatchState(data) {
  if (!data) return;

  if (data.payload && data.field_count > 0) {
    payloadInfo.hidden = false;
    const job = data.job || {};
    matchJob.textContent = `${job.company || "?"} — ${job.role_title || "?"}`;
    const bits = [
      `${data.field_count} fields imported`,
      data.match_reason ? `matched via ${data.match_reason}` : null,
      data.form_url ? `form: ${data.form_url}` : null,
    ].filter(Boolean);
    matchMeta.textContent = bits.join(" · ");

    if (data.url_matches_form || (data.url_matches_job && !data.form_url)) {
      setBanner(
        "ok",
        `Ready to fill: ${data.field_count} imported fields match this tab.`,
      );
      setStepper(4, 3);
      runBtn.disabled = false;
      hint.innerHTML =
        "Imported JSON is loaded. Click <strong>Fill this page</strong>. Review highlighted fields; never auto-submits.";
    } else {
      setBanner(
        "warn",
        `Payload found, but form URL may differ. Form URL: ${data.form_url || "(none)"}. Update Application form URL on the dossier if needed.`,
      );
      setStepper(3, 3);
      runBtn.disabled = false;
    }
    log(`Matched ${job.id}: ${data.field_count} fields (${data.match_reason})`);
    return;
  }

  payloadInfo.hidden = true;
  runBtn.disabled = true;
  setBanner(
    "info",
    "No imported JSON for this tab yet. Capture the page, then Generate form prompt → Import JSON in the cockpit.",
  );
  setStepper(1, 0);
  hint.innerHTML =
    "Step 1: <strong>Capture page for AI</strong> on this form tab (saves text + form digest to the selected opening).";
}

document
  .getElementById("refresh-btn")
  .addEventListener("click", () => void refreshMatch());

document.getElementById("detect-btn").addEventListener("click", async () => {
  try {
    const res = await chrome.runtime.sendMessage({ type: "DETECT_FIELDS" });
    if (!res || !res.ok) throw new Error((res && res.error) || "Detect failed");
    log(`Detected ${res.snapshot.fieldCount} fields on ${res.snapshot.host}`);
  } catch (err) {
    log(`Detect error: ${err.message || err}`);
  }
});

captureBtn.addEventListener("click", async () => {
  try {
    const jobId =
      selectedJobId() || (lastMatch && lastMatch.job && lastMatch.job.id);
    if (!jobId) {
      setBanner("warn", "Pick a job opening before capturing.");
      return;
    }
    setBanner("info", "Capturing page text + form digest…");
    captureBtn.disabled = true;
    const cap = await chrome.runtime.sendMessage({
      type: "CAPTURE_PAGE",
      includeHtml: !!(includeHtml && includeHtml.checked),
    });
    if (!cap || !cap.ok)
      throw new Error((cap && cap.error) || "Capture failed");

    const base = await cockpitUrl();
    const saved = await chrome.runtime.sendMessage({
      type: "API_FETCH",
      cockpitUrl: base,
      path: "/api/autofill/capture-page",
      method: "POST",
      body: {
        job_id: jobId,
        form_url: cap.url,
        url: cap.url,
        raw: cap.raw,
      },
    });
    if (!saved || !saved.ok) {
      throw new Error((saved && saved.error) || "Save to cockpit failed");
    }

    // Also copy to clipboard for immediate paste into AI if desired
    try {
      await navigator.clipboard.writeText(cap.raw);
    } catch {
      /* ignore */
    }

    setBanner(
      "ok",
      `Captured ${cap.fieldCount} fields (${cap.textChars} chars text` +
        (cap.htmlChars ? `, ${cap.htmlChars} HTML` : "") +
        `). Saved to opening + clipboard. Form URL set. Next: Generate form prompt in cockpit.`,
    );
    setStepper(2, 1);
    log(
      `Captured → ${jobId}: fields=${cap.fieldCount} text=${cap.textChars} html=${cap.htmlChars}`,
    );
    await refreshMatch();
  } catch (err) {
    setBanner("err", String(err.message || err));
    log(`Capture error: ${err.message || err}`);
  } finally {
    captureBtn.disabled = false;
  }
});

document.getElementById("run-btn").addEventListener("click", async () => {
  try {
    if (!lastMatch || !lastMatch.payload) {
      setBanner("warn", "Import AI form JSON in the cockpit before filling.");
      return;
    }
    setBanner("info", "Filling form fields…");
    runBtn.disabled = true;
    const res = await chrome.runtime.sendMessage({
      type: "RUN_AUTOFILL",
      jobId: (lastMatch.job && lastMatch.job.id) || selectedJobId(),
      cockpitUrl: await cockpitUrl(),
      options: {
        mode: "payload",
        payload: lastMatch.payload,
        useHeuristicFallback: true,
      },
    });
    if (!res || !res.ok) throw new Error((res && res.error) || "Fill failed");
    setBanner(
      "ok",
      `Filled ${res.filled ?? res.mapped ?? 0} fields` +
        (res.ambiguous ? `; ${res.ambiguous} need review` : "") +
        ". Submit manually when ready.",
    );
    setStepper(4, 4);
    log(
      `Fill done: mapped=${res.mapped} ambiguous=${res.ambiguous} filled=${res.filled}`,
    );
  } catch (err) {
    setBanner("err", String(err.message || err));
    log(`Fill error: ${err.message || err}`);
  } finally {
    runBtn.disabled = !(lastMatch && lastMatch.payload);
  }
});

jobSelect.addEventListener("change", () => void refreshMatch());

void refreshMatch();
