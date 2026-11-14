/* Anonymization Studio modal for Edit Resume & Portfolio Content */
(function () {
  "use strict";

  const METHODS = [
    { id: "sensitive_text", label: "Sensitive text (PII & keywords)" },
    { id: "all_text_pixelate", label: "All text · Pixelate" },
    { id: "all_text_lorem", label: "All text · Lorem Ipsum" },
    { id: "faces", label: "Faces (Blur)" },
    { id: "whole_image", label: "Whole image (Soft blur)" },
    { id: "manual", label: "Manual" },
  ];

  const EFFECTS = [
    { id: "lorem", label: "Lorem Ipsum" },
    { id: "pixelate", label: "Pixelate" },
    { id: "solid", label: "Solid bar" },
    { id: "blur", label: "Blur" },
  ];

  let state = null;
  let previewTimer = null;

  function ensureModal() {
    let dlg = document.getElementById("anonymize-studio");
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.id = "anonymize-studio";
    dlg.className = "company-modal anonymize-studio-modal";
    dlg.innerHTML = `
      <div class="company-modal-inner anonymize-studio-inner">
        <header class="company-modal-head anonymize-studio-head">
          <div class="anonymize-head-left">
            <h2 class="company-modal-title" id="anon-studio-title">Anonymize Image</h2>
            <span class="anon-rec-pill" id="anon-rec-pill"></span>
          </div>
          <div class="anonymize-head-right">
            <div class="anon-compare-toggle" role="group" aria-label="Compare mode">
              <button type="button" class="variant-pill is-active" data-compare="side">Side-by-side</button>
              <button type="button" class="variant-pill" data-compare="slider">Slider</button>
            </div>
            <button type="button" class="company-modal-close" id="anon-close-btn" aria-label="Close">✕</button>
          </div>
        </header>

        <div class="anon-controls-bar">
          <div class="anon-methods" id="anon-methods"></div>
          <div class="anon-params">
            <label class="anon-param-item">
              <span>Strength</span>
              <input type="range" id="anon-strength" min="1" max="5" value="3" />
              <span id="anon-strength-val">3</span>
            </label>
            <label class="anon-param-item anon-keywords-wrap">
              <span>Keywords</span>
              <input type="text" id="anon-keywords" placeholder="e.g. Medline, Maxion, Bosch" />
            </label>
            <button type="button" class="mini-action-btn" id="anon-detect-btn">Run auto-detect</button>
          </div>
        </div>

        <div class="anon-manual-bar">
          <div class="anon-tool-group" role="group" aria-label="Manual tools">
            <button type="button" class="mini-action-btn is-active" data-tool="box" title="Drag rectangle to cover area">▭ Box</button>
            <button type="button" class="mini-action-btn" data-tool="brush" title="Paint freehand obfuscation stroke">✎ Brush</button>
            <button type="button" class="mini-action-btn" data-tool="click_text" title="Click detected text to cover with Lorem Ipsum">T Click-to-cover text</button>
          </div>
          <label class="anon-param-item">
            <span>Effect</span>
            <select id="anon-effect"></select>
          </label>
          <label class="anon-param-item" id="anon-brush-wrap" style="display:none;">
            <span>Brush</span>
            <input type="range" id="anon-brush-size" min="8" max="64" value="22" />
          </label>
          <div class="anon-tool-group">
            <button type="button" class="mini-action-btn" id="anon-undo-btn" title="Undo (Ctrl+Z)">↶ Undo</button>
            <button type="button" class="mini-action-btn" id="anon-redo-btn" title="Redo (Ctrl+Y)">↷ Redo</button>
            <button type="button" class="mini-action-btn" id="anon-del-btn" title="Delete selected region (Del)">🗑 Delete selected</button>
            <button type="button" class="mini-action-btn" id="anon-clear-btn">Clear all</button>
          </div>
        </div>

        <div class="anon-stage" id="anon-stage">
          <div class="anon-pane anon-pane-orig" id="anon-pane-orig">
            <div class="anon-pane-label">Original (read-only)</div>
            <div class="anon-img-wrap"><img id="anon-orig-img" alt="Original image" /></div>
          </div>
          <div class="anon-pane anon-pane-prev" id="anon-pane-prev">
            <div class="anon-pane-label">Anonymized preview <span id="anon-preview-badge"></span></div>
            <div class="anon-canvas-wrap" id="anon-canvas-wrap">
              <img id="anon-prev-img" alt="Anonymized preview" />
              <canvas id="anon-overlay"></canvas>
            </div>
          </div>
          <div class="anon-slider-pane" id="anon-slider-pane" style="display:none;">
            <div class="anon-slider-box" id="anon-slider-box">
              <img id="anon-slider-after" alt="Anonymized" />
              <div class="anon-slider-before-clip" id="anon-slider-clip">
                <img id="anon-slider-before" alt="Original" />
              </div>
              <input type="range" id="anon-slider-range" min="0" max="100" value="50" aria-label="Before and after split" />
            </div>
          </div>
        </div>

        <footer class="deliverable-edit-footer">
          <div class="deliverable-footer-status" id="anon-status">Ready.</div>
          <div class="deliverable-footer-actions">
            <button type="button" class="download-btn download-btn-view" id="anon-preview-btn">Generate preview</button>
            <button type="button" class="mini-action-btn" id="anon-reject-btn">Reject</button>
            <button type="button" class="add-btn primary-save-btn" id="anon-confirm-btn" disabled>Confirm &amp; save anonymized</button>
          </div>
        </footer>
      </div>
    `;
    document.body.appendChild(dlg);
    wireEvents(dlg);
    return dlg;
  }

  function snapshotHistory() {
    if (!state) return;
    state.history = state.history.slice(0, state.historyIdx + 1);
    state.history.push(JSON.parse(JSON.stringify(state.regions)));
    state.historyIdx = state.history.length - 1;
  }

  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      generatePreview();
    }, 600);
  }

  function setStatus(msg, isError) {
    const el = document.getElementById("anon-status");
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? "#e74c3c" : "";
  }

  function buildRecipe() {
    const kwRaw = document.getElementById("anon-keywords").value || "";
    const keywords = kwRaw.split(",").map((s) => s.trim()).filter(Boolean);
    return {
      method: state.method,
      strength: Number(document.getElementById("anon-strength").value || 3),
      keywords,
      regions: state.regions,
    };
  }

  async function runDetect(method) {
    if (!state) return;
    state.method = method;
    syncMethodButtons();
    setStatus(`Detecting (${method})…`);
    try {
      const kwRaw = document.getElementById("anon-keywords").value || "";
      const res = await fetch("/api/anonymize/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: state.path,
          method,
          params: { keywords: kwRaw },
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Detection failed");
      state.method = data.method;
      state.ocrRegions = data.ocr_regions || [];
      state.regions = data.regions || [];
      state.selectedIdx = -1;
      snapshotHistory();
      syncMethodButtons();
      const recEl = document.getElementById("anon-rec-pill");
      if (recEl) recEl.textContent = data.recommended ? `Recommended: ${data.recommended}` : "";
      drawOverlay();
      await generatePreview();
    } catch (err) {
      setStatus("Detection error: " + err.message, true);
    }
  }

  async function generatePreview() {
    if (!state) return;
    setStatus("Rendering preview…");
    const confirmBtn = document.getElementById("anon-confirm-btn");
    try {
      const res = await fetch("/api/anonymize/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: state.path, recipe: buildRecipe() }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Render failed");
      state.previewId = data.preview_id;
      state.previewUrl = `${data.preview_url}?t=${Date.now()}`;
      state.imgW = data.width;
      state.imgH = data.height;
      document.getElementById("anon-prev-img").src = state.previewUrl;
      document.getElementById("anon-slider-after").src = state.previewUrl;
      confirmBtn.disabled = false;
      document.getElementById("anon-preview-badge").textContent = `(${state.regions.length} regions)`;
      setStatus(`Preview ready · ${state.regions.length} regions. Review and Confirm or Reject.`);
      drawOverlay();
    } catch (err) {
      setStatus("Render error: " + err.message, true);
    }
  }

  async function confirmSave() {
    if (!state || !state.previewId) return;
    const btn = document.getElementById("anon-confirm-btn");
    btn.disabled = true;
    setStatus("Saving anonymized copy (original preserved)…");
    try {
      const res = await fetch("/api/anonymize/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: state.path,
          preview_id: state.previewId,
          recipe: buildRecipe(),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Confirm failed");
      const cb = state.onConfirmed;
      state = null;
      document.getElementById("anonymize-studio").close();
      if (typeof cb === "function") cb(data.row);
    } catch (err) {
      btn.disabled = false;
      setStatus("Save error: " + err.message, true);
    }
  }

  function syncMethodButtons() {
    document.querySelectorAll("#anon-methods button").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.method === state?.method);
    });
  }

  function drawOverlay() {
    const canvas = document.getElementById("anon-overlay");
    const img = document.getElementById("anon-prev-img");
    if (!canvas || !img || !state) return;
    const rect = img.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    canvas.width = Math.round(rect.width);
    canvas.height = Math.round(rect.height);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const natW = img.naturalWidth || state.imgW || rect.width;
    const natH = img.naturalHeight || state.imgH || rect.height;
    const sx = canvas.width / natW;
    const sy = canvas.height / natH;

    // Subtle hint outlines for OCR text boxes when click-to-cover tool is active
    if (state.tool === "click_text" && state.ocrRegions?.length) {
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 1;
      state.ocrRegions.forEach((r) => {
        ctx.strokeRect(r.x * sx, r.y * sy, r.w * sx, r.h * sy);
      });
      ctx.restore();
    }

    state.regions.forEach((r, idx) => {
      const isSel = idx === state.selectedIdx;
      ctx.save();
      ctx.strokeStyle = isSel ? "#f59e0b" : "rgba(239, 68, 68, 0.85)";
      ctx.lineWidth = isSel ? 2.5 : 1.5;
      ctx.fillStyle = isSel ? "rgba(245, 158, 11, 0.18)" : "rgba(239, 68, 68, 0.10)";
      if (r.type === "stroke" && Array.isArray(r.points) && r.points.length) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(3, (r.width || 20) * sx);
        ctx.strokeStyle = isSel ? "rgba(245,158,11,0.55)" : "rgba(239,68,68,0.40)";
        ctx.beginPath();
        r.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p[0] * sx, p[1] * sy);
          else ctx.lineTo(p[0] * sx, p[1] * sy);
        });
        ctx.stroke();
      } else if (r.type === "ellipse") {
        ctx.beginPath();
        ctx.ellipse((r.x + r.w / 2) * sx, (r.y + r.h / 2) * sy, (r.w / 2) * sx, (r.h / 2) * sy, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(r.x * sx, r.y * sy, r.w * sx, r.h * sy);
        ctx.strokeRect(r.x * sx, r.y * sy, r.w * sx, r.h * sy);
      }
      ctx.restore();
    });

    if (state.draftRect) {
      const d = state.draftRect;
      ctx.save();
      ctx.strokeStyle = "#22c55e";
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 2;
      ctx.strokeRect(d.x * sx, d.y * sy, d.w * sx, d.h * sy);
      ctx.restore();
    }
  }

  function toImageCoords(evt) {
    const img = document.getElementById("anon-prev-img");
    const rect = img.getBoundingClientRect();
    const natW = img.naturalWidth || state.imgW || rect.width;
    const natH = img.naturalHeight || state.imgH || rect.height;
    return [
      Math.max(0, Math.min(natW, ((evt.clientX - rect.left) / rect.width) * natW)),
      Math.max(0, Math.min(natH, ((evt.clientY - rect.top) / rect.height) * natH)),
    ];
  }

  function hitTestRegion(ix, iy) {
    for (let i = state.regions.length - 1; i >= 0; i -= 1) {
      const r = state.regions[i];
      if (r.type === "stroke") continue;
      if (ix >= r.x && ix <= r.x + r.w && iy >= r.y && iy <= r.y + r.h) return i;
    }
    return -1;
  }

  function wireEvents(dlg) {
    const methodsEl = dlg.querySelector("#anon-methods");
    METHODS.forEach((m) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mini-action-btn";
      btn.dataset.method = m.id;
      btn.textContent = m.label;
      btn.onclick = () => {
        if (m.id === "manual") {
          state.method = "manual";
          syncMethodButtons();
          setStatus("Manual mode: draw boxes, brush strokes, or click text to cover.");
        } else {
          runDetect(m.id);
        }
      };
      methodsEl.appendChild(btn);
    });

    const effSel = dlg.querySelector("#anon-effect");
    EFFECTS.forEach((ef) => {
      const opt = document.createElement("option");
      opt.value = ef.id;
      opt.textContent = ef.label;
      effSel.appendChild(opt);
    });

    dlg.querySelector("#anon-strength").oninput = (e) => {
      dlg.querySelector("#anon-strength-val").textContent = e.target.value;
    };
    dlg.querySelector("#anon-strength").onchange = () => schedulePreview();
    dlg.querySelector("#anon-detect-btn").onclick = () => runDetect(state.method === "manual" ? "auto" : state.method);
    dlg.querySelector("#anon-preview-btn").onclick = () => generatePreview();
    dlg.querySelector("#anon-confirm-btn").onclick = () => confirmSave();
    dlg.querySelector("#anon-reject-btn").onclick = () => {
      state = null;
      dlg.close();
    };
    dlg.querySelector("#anon-close-btn").onclick = () => {
      state = null;
      dlg.close();
    };

    dlg.querySelectorAll("[data-compare]").forEach((btn) => {
      btn.onclick = () => {
        dlg.querySelectorAll("[data-compare]").forEach((b) => b.classList.toggle("is-active", b === btn));
        const mode = btn.dataset.compare;
        dlg.querySelector("#anon-pane-orig").style.display = mode === "side" ? "" : "none";
        dlg.querySelector("#anon-pane-prev").style.display = mode === "side" ? "" : "none";
        dlg.querySelector("#anon-slider-pane").style.display = mode === "slider" ? "" : "none";
      };
    });

    dlg.querySelector("#anon-slider-range").oninput = (e) => {
      dlg.querySelector("#anon-slider-clip").style.width = `${e.target.value}%`;
    };

    dlg.querySelectorAll("[data-tool]").forEach((btn) => {
      btn.onclick = async () => {
        dlg.querySelectorAll("[data-tool]").forEach((b) => b.classList.toggle("is-active", b === btn));
        state.tool = btn.dataset.tool;
        dlg.querySelector("#anon-brush-wrap").style.display = state.tool === "brush" ? "" : "none";
        if (state.tool === "click_text" && (!state.ocrRegions || state.ocrRegions.length === 0)) {
          setStatus("Loading text boxes for click-to-cover…");
          const res = await fetch("/api/anonymize/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: state.path, method: "all_text_lorem", params: {} }),
          });
          const data = await res.json();
          if (data.ok) state.ocrRegions = data.ocr_regions || [];
          setStatus("Click any highlighted text box to cover it with Lorem Ipsum.");
        }
        drawOverlay();
      };
    });

    dlg.querySelector("#anon-undo-btn").onclick = () => {
      if (!state || state.historyIdx <= 0) return;
      state.historyIdx -= 1;
      state.regions = JSON.parse(JSON.stringify(state.history[state.historyIdx]));
      state.selectedIdx = -1;
      drawOverlay();
      schedulePreview();
    };
    dlg.querySelector("#anon-redo-btn").onclick = () => {
      if (!state || state.historyIdx >= state.history.length - 1) return;
      state.historyIdx += 1;
      state.regions = JSON.parse(JSON.stringify(state.history[state.historyIdx]));
      state.selectedIdx = -1;
      drawOverlay();
      schedulePreview();
    };
    dlg.querySelector("#anon-del-btn").onclick = () => {
      if (!state || state.selectedIdx < 0) return;
      state.regions.splice(state.selectedIdx, 1);
      state.selectedIdx = -1;
      snapshotHistory();
      drawOverlay();
      schedulePreview();
    };
    dlg.querySelector("#anon-clear-btn").onclick = () => {
      if (!state) return;
      state.regions = [];
      state.selectedIdx = -1;
      snapshotHistory();
      drawOverlay();
      schedulePreview();
    };

    const canvas = dlg.querySelector("#anon-overlay");
    let dragStart = null;
    let activeStroke = null;

    canvas.addEventListener("pointerdown", (e) => {
      if (!state) return;
      const [ix, iy] = toImageCoords(e);
      if (state.tool === "click_text") {
        const ocrHit = (state.ocrRegions || []).find(
          (r) => ix >= r.x && ix <= r.x + r.w && iy >= r.y && iy <= r.y + r.h
        );
        if (ocrHit) {
          state.regions.push({
            id: `manual-${Date.now()}`,
            type: "rect",
            x: ocrHit.x,
            y: ocrHit.y,
            w: ocrHit.w,
            h: ocrHit.h,
            effect: effSel.value || "lorem",
            source: "ocr",
          });
          snapshotHistory();
          drawOverlay();
          schedulePreview();
          return;
        }
      }
      const existing = hitTestRegion(ix, iy);
      if (existing >= 0 && e.shiftKey) {
        state.selectedIdx = existing;
        drawOverlay();
        return;
      }
      if (state.tool === "brush") {
        activeStroke = {
          id: `stroke-${Date.now()}`,
          type: "stroke",
          points: [[Math.round(ix), Math.round(iy)]],
          width: Number(dlg.querySelector("#anon-brush-size").value || 22),
          effect: "pixelate",
          source: "manual",
        };
        state.regions.push(activeStroke);
      } else {
        dragStart = [ix, iy];
        state.draftRect = { x: ix, y: iy, w: 1, h: 1 };
      }
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!state) return;
      const [ix, iy] = toImageCoords(e);
      if (activeStroke) {
        activeStroke.points.push([Math.round(ix), Math.round(iy)]);
        drawOverlay();
      } else if (dragStart) {
        const x = Math.min(dragStart[0], ix);
        const y = Math.min(dragStart[1], iy);
        const w = Math.abs(ix - dragStart[0]);
        const h = Math.abs(iy - dragStart[1]);
        state.draftRect = { x, y, w, h };
        drawOverlay();
      }
    });

    canvas.addEventListener("pointerup", () => {
      if (!state) return;
      if (activeStroke) {
        activeStroke = null;
        snapshotHistory();
        drawOverlay();
        schedulePreview();
      } else if (dragStart) {
        const d = state.draftRect;
        dragStart = null;
        state.draftRect = null;
        if (d && d.w >= 6 && d.h >= 6) {
          state.regions.push({
            id: `box-${Date.now()}`,
            type: "rect",
            x: Math.round(d.x),
            y: Math.round(d.y),
            w: Math.round(d.w),
            h: Math.round(d.h),
            effect: effSel.value || "lorem",
            source: "manual",
          });
          state.selectedIdx = state.regions.length - 1;
          snapshotHistory();
          schedulePreview();
        } else {
          // Click without drag selects existing region
          if (d) state.selectedIdx = hitTestRegion(d.x, d.y);
        }
        drawOverlay();
      }
    });

    dlg.addEventListener("keydown", (e) => {
      if (!state) return;
      if ((e.key === "Delete" || e.key === "Backspace") && document.activeElement.tagName !== "INPUT") {
        if (state.selectedIdx >= 0) {
          e.preventDefault();
          dlg.querySelector("#anon-del-btn").click();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        dlg.querySelector("#anon-undo-btn").click();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        dlg.querySelector("#anon-redo-btn").click();
      }
    });

    dlg.querySelector("#anon-prev-img").addEventListener("load", drawOverlay);
    window.addEventListener("resize", drawOverlay);
  }

  window.openAnonymizeStudio = function openAnonymizeStudio({ path, label, existingRecipe, onConfirmed }) {
    const dlg = ensureModal();
    const normPath = String(path || "").replace(/^\/+/, "");
    state = {
      path: normPath,
      method: existingRecipe?.method || "auto",
      tool: "box",
      regions: JSON.parse(JSON.stringify(existingRecipe?.regions || [])),
      ocrRegions: [],
      selectedIdx: -1,
      history: [],
      historyIdx: -1,
      previewId: null,
      previewUrl: `/${normPath}`,
      onConfirmed,
    };
    snapshotHistory();

    dlg.querySelector("#anon-studio-title").textContent = `Anonymize · ${label || normPath.split("/").pop()}`;
    dlg.querySelector("#anon-rec-pill").textContent = "";
    dlg.querySelector("#anon-confirm-btn").disabled = true;
    dlg.querySelector("#anon-orig-img").src = `/${normPath}?t=${Date.now()}`;
    dlg.querySelector("#anon-prev-img").src = `/${normPath}?t=${Date.now()}`;
    dlg.querySelector("#anon-slider-before").src = `/${normPath}?t=${Date.now()}`;
    dlg.querySelector("#anon-slider-after").src = `/${normPath}?t=${Date.now()}`;
    dlg.querySelector("#anon-strength").value = String(existingRecipe?.strength || 3);
    dlg.querySelector("#anon-strength-val").textContent = String(existingRecipe?.strength || 3);
    dlg.querySelector("#anon-keywords").value = (existingRecipe?.keywords || []).join(", ");

    dlg.showModal();
    if (existingRecipe?.regions?.length) {
      syncMethodButtons();
      generatePreview();
    } else {
      runDetect("auto");
    }
  };
})();
