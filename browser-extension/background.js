/**
 * Career Cockpit Autofill — background service worker.
 * Bridges the career cockpit page, side panel, and content scripts.
 */

const DEFAULT_COCKPIT = "http://127.0.0.1:8770";

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch(() => {});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((err) =>
      sendResponse({
        ok: false,
        error: String(err && err.message ? err.message : err),
      }),
    );
  return true;
});

chrome.runtime.onMessageExternal.addListener(
  (message, _sender, sendResponse) => {
    handleMessage(message, null)
      .then(sendResponse)
      .catch((err) =>
        sendResponse({
          ok: false,
          error: String(err && err.message ? err.message : err),
        }),
      );
    return true;
  },
);

async function handleMessage(message, sender) {
  if (!message || !message.type) {
    return { ok: false, error: "missing message type" };
  }

  switch (message.type) {
    case "GET_ACTIVE_TAB":
      return getActiveTab();

    case "OPEN_SIDEPANEL": {
      const tab = await getActiveTab();
      if (tab.id != null) {
        await chrome.sidePanel.open({ tabId: tab.id });
      }
      if (message.jobId) {
        await chrome.storage.session.set({ pendingJobId: message.jobId });
      }
      return { ok: true, tab };
    }

    case "RUN_AUTOFILL": {
      const tab = message.tabId
        ? await chrome.tabs.get(message.tabId)
        : await getActiveTab();
      if (!tab || tab.id == null) {
        return { ok: false, error: "No active tab" };
      }
      if (
        tab.url &&
        (tab.url.startsWith("chrome://") ||
          tab.url.startsWith("chrome-extension://") ||
          tab.url.startsWith("edge://"))
      ) {
        return {
          ok: false,
          error:
            "Cannot autofill browser internal pages. Open a job application form first.",
        };
      }
      await ensureContentScripts(tab.id);
      const result = await chrome.tabs.sendMessage(tab.id, {
        type: "AUTOFILL_START",
        jobId: message.jobId || null,
        cockpitUrl: message.cockpitUrl || DEFAULT_COCKPIT,
        options: message.options || {},
      });
      return result || { ok: true };
    }

    case "DETECT_FIELDS": {
      const tab = message.tabId
        ? await chrome.tabs.get(message.tabId)
        : await getActiveTab();
      if (!tab || tab.id == null) {
        return { ok: false, error: "No active tab" };
      }
      await ensureContentScripts(tab.id);
      return chrome.tabs.sendMessage(tab.id, { type: "DETECT_FIELDS" });
    }

    case "CAPTURE_PAGE": {
      const tab = message.tabId
        ? await chrome.tabs.get(message.tabId)
        : await getActiveTab();
      if (!tab || tab.id == null) {
        return { ok: false, error: "No active tab" };
      }
      if (
        tab.url &&
        (tab.url.startsWith("chrome://") ||
          tab.url.startsWith("chrome-extension://") ||
          tab.url.startsWith("edge://"))
      ) {
        return { ok: false, error: "Cannot capture browser internal pages." };
      }
      await ensureContentScripts(tab.id);
      return chrome.tabs.sendMessage(tab.id, {
        type: "CAPTURE_PAGE",
        includeHtml: message.includeHtml !== false,
      });
    }

    case "PING_CONTENT": {
      const tab = await getActiveTab();
      if (!tab || tab.id == null) return { ok: false, error: "No active tab" };
      try {
        await ensureContentScripts(tab.id);
        return await chrome.tabs.sendMessage(tab.id, { type: "PING" });
      } catch (err) {
        return {
          ok: false,
          error: String(err && err.message ? err.message : err),
        };
      }
    }

    case "GET_PENDING_JOB": {
      const data = await chrome.storage.session.get(["pendingJobId"]);
      const jobId = data.pendingJobId || null;
      if (jobId) await chrome.storage.session.remove(["pendingJobId"]);
      return { ok: true, jobId };
    }

    case "API_FETCH": {
      const cockpitUrl = (message.cockpitUrl || DEFAULT_COCKPIT).replace(
        /\/$/,
        "",
      );
      const path = message.path || "/";
      const url = `${cockpitUrl}${path.startsWith("/") ? path : `/${path}`}`;
      const init = {
        method: message.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...(message.headers || {}),
        },
      };
      if (message.body != null && init.method !== "GET") {
        init.body =
          typeof message.body === "string"
            ? message.body
            : JSON.stringify(message.body);
      }
      const res = await fetch(url, init);
      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          error: (data && data.error) || text || res.statusText,
          data,
        };
      }
      return { ok: true, status: res.status, data };
    }

    case "FROM_CONTENT":
      return {
        ok: true,
        received: true,
        fromTab: sender && sender.tab ? sender.tab.id : null,
      };

    default:
      return { ok: false, error: `Unknown message type: ${message.type}` };
  }
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function ensureContentScripts(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "PING" });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["detector.js", "filler.js", "overlay.js", "content.js"],
    });
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ["overlay.css"],
    });
  }
}
