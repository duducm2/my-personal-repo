const logEl = document.getElementById("log");
const jobSelect = document.getElementById("job-select");
const cockpitInput = document.getElementById("cockpit-url");
const tabTitle = document.getElementById("tab-title");

function log(msg) {
  const line = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
  logEl.textContent = `${new Date().toLocaleTimeString()}  ${line}\n` + logEl.textContent;
}

async function cockpitUrl() {
  return (cockpitInput.value || "http://127.0.0.1:8770").replace(/\/$/, "");
}

async function refreshTabInfo() {
  const res = await chrome.runtime.sendMessage({ type: "GET_ACTIVE_TAB" });
  const tab = res && res.id != null ? res : res;
  // getActiveTab returns the tab object directly from background
  const t = tab && tab.title != null ? tab : null;
  if (t) {
    tabTitle.textContent = t.title || t.url || "—";
  } else {
    tabTitle.textContent = "—";
  }
}

async function loadJobs() {
  jobSelect.innerHTML = `<option value="">Loading…</option>`;
  try {
    const base = await cockpitUrl();
    const res = await fetch(`${base}/api/autofill/state`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || res.statusText);
    const jobs = data.jobs || [];
    jobSelect.innerHTML = "";
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = jobs.length ? "(auto / none selected)" : "No openings found — is the cockpit running?";
    jobSelect.appendChild(blank);
    for (const j of jobs) {
      const opt = document.createElement("option");
      opt.value = j.id;
      opt.textContent = `${j.company} — ${j.role_title}${j.status ? ` [${j.status}]` : ""}`;
      jobSelect.appendChild(opt);
    }
    log(`Loaded ${jobs.length} openings`);

    const pending = await chrome.runtime.sendMessage({ type: "GET_PENDING_JOB" });
    if (pending && pending.jobId) {
      jobSelect.value = pending.jobId;
      log(`Preselected job ${pending.jobId}`);
    } else if (data.pending && data.pending.job_id) {
      jobSelect.value = data.pending.job_id;
      log(`Preselected pending job ${data.pending.job_id}`);
      try {
        await fetch(`${base}/api/autofill/pending`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "clear" }),
        });
      } catch {
        /* ignore */
      }
    }
  } catch (err) {
    jobSelect.innerHTML = `<option value="">Cockpit unreachable</option>`;
    log(`Error loading jobs: ${err.message || err}`);
  }
}

document.getElementById("refresh-jobs").addEventListener("click", () => void loadJobs());

document.getElementById("detect-btn").addEventListener("click", async () => {
  try {
    await refreshTabInfo();
    const res = await chrome.runtime.sendMessage({ type: "DETECT_FIELDS" });
    if (!res || !res.ok) throw new Error((res && res.error) || "Detect failed");
    log(`Detected ${res.snapshot.fieldCount} fields on ${res.snapshot.host}`);
  } catch (err) {
    log(`Detect error: ${err.message || err}`);
  }
});

document.getElementById("run-btn").addEventListener("click", async () => {
  try {
    await refreshTabInfo();
    const res = await chrome.runtime.sendMessage({
      type: "RUN_AUTOFILL",
      jobId: jobSelect.value || null,
      cockpitUrl: await cockpitUrl(),
    });
    if (!res || !res.ok) throw new Error((res && res.error) || "Autofill failed");
    log(`Mapped ${res.mapped}, ambiguous ${res.ambiguous} (of ${res.detected})`);
  } catch (err) {
    log(`Autofill error: ${err.message || err}`);
  }
});

void (async () => {
  await refreshTabInfo();
  await loadJobs();
})();
