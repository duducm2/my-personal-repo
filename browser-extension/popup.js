async function refresh() {
  const tab = await chrome.runtime.sendMessage({ type: "GET_ACTIVE_TAB" });
  const el = document.getElementById("tab");
  el.textContent = tab && tab.title ? tab.title : "No active tab";
}

document.getElementById("open-panel").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" });
  window.close();
});

document.getElementById("run").addEventListener("click", async () => {
  const res = await chrome.runtime.sendMessage({
    type: "RUN_AUTOFILL",
    cockpitUrl: "http://127.0.0.1:8770",
  });
  const el = document.getElementById("tab");
  if (res && res.ok) {
    el.textContent = `Mapped ${res.mapped}, review ${res.ambiguous}`;
  } else {
    el.textContent = (res && res.error) || "Failed";
  }
});

void refresh();
