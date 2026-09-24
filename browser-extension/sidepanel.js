const logEl = document.getElementById("log");
const cockpitInput = document.getElementById("cockpit-url");
const tabTitle = document.getElementById("tab-title");
const tabUrl = document.getElementById("tab-url");
const banner = document.getElementById("state-banner");
const payloadInfo = document.getElementById("payload-info");
const matchJob = document.getElementById("match-job");
const matchMeta = document.getElementById("match-meta");
const runBtn = document.getElementById("run-btn");
const hint = document.getElementById("hint");
const stepper = document.getElementById("stepper");

let lastMatch = null;
let lastTab = null;

function log(msg) {
  const line = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
  logEl.textContent = `${new Date().toLocaleTimeString()}  ${line}\n` + logEl.textContent;
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
    setBanner("err", "Cannot fill browser internal pages. Switch to the application form tab.");
    setStepper(1, 0);
    return;
  }

  try {
    const pending = await chrome.runtime.sendMessage({ type: "GET_PENDING_JOB" });
    const jobId = (pending && pending.jobId) || null;
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
      throw new Error((res && res.error) || "Lookup failed — is the cockpit running?");
    }
    lastMatch = res.data;
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

    const urlOk = data.url_matches_form || data.url_matches_job || data.match_reason === "job_id";
    if (data.url_matches_form || (data.url_matches_job && !data.form_url)) {
      setBanner(
        "ok",
        `Ready to fill: ${data.field_count} imported fields match this tab. Complete any yellow fields manually after fill.`
      );
      setStepper(4, 3);
      runBtn.disabled = false;
      hint.innerHTML =
        "Imported JSON is loaded. Click <strong>Fill this page</strong>. Review highlighted fields; never auto-submits.";
    } else if (data.match_reason === "job_id" && !urlOk) {
      setBanner(
        "warn",
        `Payload found for this opening, but form URL does not match this tab. Open ${data.form_url || data.source_url || "the form page"} or update form_url in the cockpit.`
      );
      setStepper(3, 3);
      runBtn.disabled = false;
      hint.textContent =
        "You can still attempt a fill, but field labels may not match. Prefer navigating to the imported form URL.";
    } else {
      setBanner(
        "warn",
        `Imported form URL differs from this tab. Update form_url in the cockpit or open: ${data.form_url || "(none)"}`
      );
      setStepper(3, 3);
      runBtn.disabled = false;
    }
    log(`Matched ${job.id}: ${data.field_count} fields (${data.match_reason})`);
    return;
  }

  payloadInfo.hidden = true;
  runBtn.disabled = true;
  const suggestions = (data.suggestions || []).filter((s) => s.has_payload);
  if (suggestions.length) {
    setBanner(
      "warn",
      `No payload matches this URL. ${suggestions.length} opening(s) have imported answers — open their form URL or re-import with this page’s URL as form_url.`
    );
    setStepper(3, 2);
    hint.textContent =
      "In the cockpit: open the job → Import form JSON → set Form page URL to this tab’s URL.";
    log(`No URL match. Suggestions: ${suggestions.slice(0, 3).map((s) => s.id).join(", ")}`);
  } else {
    setBanner(
      "info",
      "No imported form JSON yet. In the cockpit: Generate form prompt → paste into AI → Import form JSON (with form URL)."
    );
    setStepper(1, 0);
    hint.innerHTML =
      "Steps 1–3 in Career Cockpit first. Then return here and click <strong>Fill this page</strong>.";
    log("No payloads available");
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => void refreshMatch());

document.getElementById("detect-btn").addEventListener("click", async () => {
  try {
    const res = await chrome.runtime.sendMessage({ type: "DETECT_FIELDS" });
    if (!res || !res.ok) throw new Error((res && res.error) || "Detect failed");
    log(`Detected ${res.snapshot.fieldCount} fields on ${res.snapshot.host}`);
  } catch (err) {
    log(`Detect error: ${err.message || err}`);
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
      jobId: (lastMatch.job && lastMatch.job.id) || null,
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
        ". Submit manually when ready."
    );
    setStepper(4, 4);
    log(`Fill done: mapped=${res.mapped} ambiguous=${res.ambiguous} filled=${res.filled}`);
  } catch (err) {
    setBanner("err", String(err.message || err));
    log(`Fill error: ${err.message || err}`);
  } finally {
    runBtn.disabled = !(lastMatch && lastMatch.payload);
  }
});

void refreshMatch();
