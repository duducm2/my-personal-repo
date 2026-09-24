/**
 * Content script — orchestrates detect → map/payload → fill → review.
 */
(function () {
  "use strict";

  const DEFAULT_COCKPIT = "http://127.0.0.1:8770";
  let busy = false;
  let lastSession = null;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handle(message)
      .then(sendResponse)
      .catch((err) =>
        sendResponse({
          ok: false,
          error: String(err && err.message ? err.message : err),
        }),
      );
    return true;
  });

  async function handle(message) {
    if (!message || !message.type) return { ok: false, error: "no type" };

    if (message.type === "PING") {
      return { ok: true, pong: true, url: location.href };
    }

    if (message.type === "DETECT_FIELDS") {
      const snap = window.CareerAutofillDetector.detectFields();
      return { ok: true, snapshot: snap };
    }

    if (message.type === "CAPTURE_PAGE") {
      return capturePageForAi(message);
    }

    if (message.type === "AUTOFILL_START") {
      const opts = message.options || {};
      if (opts.mode === "payload" && opts.payload) {
        return runPayloadAutofill(message);
      }
      return runAutofill(message);
    }

    if (message.type === "AUTOFILL_FROM_PAYLOAD") {
      return runPayloadAutofill(message);
    }

    return { ok: false, error: `unknown: ${message.type}` };
  }

  async function api(cockpitUrl, path, options) {
    const res = await chrome.runtime.sendMessage({
      type: "API_FETCH",
      cockpitUrl: cockpitUrl || DEFAULT_COCKPIT,
      path,
      method: (options && options.method) || "GET",
      body: options && options.body,
    });
    if (!res || !res.ok) {
      throw new Error((res && res.error) || "API request failed");
    }
    return res.data;
  }

  function capturePageForAi(message) {
    const includeHtml = !(message && message.includeHtml === false);
    const Detector = window.CareerAutofillDetector;
    const snapshot = Detector
      ? Detector.detectFields()
      : { fields: [], fieldCount: 0 };
    const text = (
      document.body && document.body.innerText ? document.body.innerText : ""
    )
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const digestLines = [];
    for (const f of snapshot.fields || []) {
      const bits = [
        `[${f.type || f.tag}]`,
        f.label || f.placeholder || f.name || f.id || "(unlabeled)",
      ];
      if (f.required) bits.push("REQUIRED");
      if (f.name) bits.push(`name=${f.name}`);
      if (f.id) bits.push(`id=${f.id}`);
      if (f.autocomplete) bits.push(`autocomplete=${f.autocomplete}`);
      if (f.options && f.options.length) {
        const opts = f.options
          .slice(0, 20)
          .map((o) => o.label || o.value)
          .filter(Boolean)
          .join(" | ");
        if (opts) bits.push(`options: ${opts}`);
      }
      digestLines.push(`- ${bits.join(" · ")}`);
    }

    let formHtml = "";
    if (includeHtml) {
      const forms = Array.from(document.querySelectorAll("form"));
      const chunks = forms.map((form, i) => {
        const clone = form.cloneNode(true);
        clone
          .querySelectorAll("script, style, svg, img")
          .forEach((n) => n.remove());
        let html = clone.outerHTML || "";
        if (html.length > 40000)
          html = html.slice(0, 40000) + "\n<!-- truncated -->";
        return `<!-- form ${i + 1} -->\n${html}`;
      });
      if (!chunks.length) {
        const roots = document.querySelectorAll(
          "#application, #apply_form, .application-form, [data-qa='application-form'], main",
        );
        for (const root of roots) {
          const clone = root.cloneNode(true);
          clone
            .querySelectorAll("script, style, svg, img, noscript")
            .forEach((n) => n.remove());
          let html = clone.innerHTML || "";
          if (html.length > 50000)
            html = html.slice(0, 50000) + "\n<!-- truncated -->";
          chunks.push(html);
          if (chunks.length >= 2) break;
        }
      }
      formHtml = chunks.join("\n\n");
    }

    const maxText = 120000;
    const pageText =
      text.length > maxText
        ? text.slice(0, maxText) + "\n\n[…truncated]"
        : text;
    const capturedAt = new Date().toISOString().slice(0, 19);

    const parts = [
      "=== CAPTURE META ===",
      `url: ${location.href}`,
      `title: ${document.title}`,
      `captured_at: ${capturedAt}`,
      `field_count: ${snapshot.fieldCount || (snapshot.fields || []).length}`,
      "",
      "=== PAGE TEXT (Ctrl+A equivalent) ===",
      pageText || "(empty)",
      "",
      "=== FORM DIGEST (structured fields for AI) ===",
      digestLines.length
        ? digestLines.join("\n")
        : "(no fillable fields detected)",
    ];
    if (includeHtml && formHtml) {
      parts.push("", "=== FORM HTML (compact) ===", formHtml);
    }

    return {
      ok: true,
      url: location.href,
      title: document.title,
      host: location.hostname,
      fieldCount: snapshot.fieldCount || (snapshot.fields || []).length,
      textChars: pageText.length,
      htmlChars: formHtml.length,
      raw: parts.join("\n"),
    };
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[_\-]+/g, " ")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreMatch(field, answer) {
    const hay = norm(
      [
        field.label,
        field.name,
        field.id,
        field.placeholder,
        field.autocomplete,
        field.nearby,
      ].join(" "),
    );
    const key = norm(answer.key);
    const label = norm(answer.label);
    if (!hay) return 0;
    if (
      key &&
      (field.name === answer.key ||
        field.id === answer.key ||
        field.autocomplete === answer.key)
    ) {
      return 1;
    }
    if (key && (hay === key || hay.includes(key) || key.includes(hay)))
      return 0.95;
    if (label && (hay === label || hay.includes(label) || label.includes(hay)))
      return 0.9;
    // token overlap
    const tokens = label.split(" ").filter((t) => t.length > 2);
    if (!tokens.length) return 0;
    let hit = 0;
    for (const t of tokens) {
      if (hay.includes(t)) hit += 1;
    }
    return hit / tokens.length >= 0.6 ? 0.7 : 0;
  }

  function matchPayloadFields(detectedFields, payloadFields) {
    const usedAnswers = new Set();
    const matched = [];
    const unmatchedDetected = [];

    const ordered = [...detectedFields].sort(
      (a, b) => (a.visualOrder ?? a.index) - (b.visualOrder ?? b.index),
    );

    for (const field of ordered) {
      let best = null;
      let bestScore = 0;
      let bestIdx = -1;
      for (let i = 0; i < payloadFields.length; i += 1) {
        if (usedAnswers.has(i)) continue;
        const ans = payloadFields[i];
        if (ans.value == null || String(ans.value).trim() === "") continue;
        const sc = scoreMatch(field, ans);
        if (sc > bestScore) {
          bestScore = sc;
          best = ans;
          bestIdx = i;
        }
      }
      if (best && bestScore >= 0.7) {
        usedAnswers.add(bestIdx);
        matched.push({
          field,
          value: best.value,
          confidence: bestScore,
          canonicalKey: best.key || best.label,
          source: "payload",
          answer: best,
        });
      } else {
        unmatchedDetected.push(field);
      }
    }

    return { matched, unmatchedDetected, usedAnswers };
  }

  async function runPayloadAutofill(message) {
    if (busy) return { ok: false, error: "Autofill already running" };
    busy = true;

    const cockpitUrl = message.cockpitUrl || DEFAULT_COCKPIT;
    const jobId = message.jobId || null;
    const opts = message.options || {};
    const payload = opts.payload || message.payload;
    const useFallback = opts.useHeuristicFallback !== false;
    const Overlay = window.CareerAutofillOverlay;
    const Detector = window.CareerAutofillDetector;

    try {
      if (
        !payload ||
        !Array.isArray(payload.fields) ||
        !payload.fields.length
      ) {
        throw new Error(
          "No imported form payload. Import AI JSON in the cockpit first.",
        );
      }

      Overlay.clearHighlights();
      Overlay.show(
        {
          phase: "detecting",
          message: "Detecting form fields…",
          progress: 10,
          detected: 0,
          mapped: 0,
          ambiguous: 0,
          filled: 0,
        },
        {},
      );

      const snapshot = Detector.detectFields();
      Overlay.update({
        phase: "mapping",
        message: `Matching ${snapshot.fieldCount} fields to imported JSON (${payload.fields.length} answers)…`,
        progress: 30,
        detected: snapshot.fieldCount,
        mapped: 0,
        ambiguous: 0,
        filled: 0,
      });

      if (!snapshot.fieldCount) {
        Overlay.update({
          phase: "done",
          message: "No fillable fields found on this page.",
          progress: 100,
          detected: 0,
          error:
            "Scroll to the application form or click Apply to reveal fields, then try again.",
        });
        busy = false;
        return { ok: false, error: "no fields" };
      }

      const { matched, unmatchedDetected } = matchPayloadFields(
        snapshot.fields,
        payload.fields,
      );

      let fallbackMappings = [];
      let mapResult = {
        values_by_key: {},
        available_keys: payload.fields.map((f) => ({
          key: f.key,
          label: f.label || f.key,
        })),
        min_confidence: 0.55,
      };

      if (useFallback && unmatchedDetected.length) {
        Overlay.update({
          phase: "mapping",
          message: `Payload matched ${matched.length}. Heuristic fallback for ${unmatchedDetected.length}…`,
          progress: 45,
          detected: snapshot.fieldCount,
          mapped: matched.length,
          ambiguous: unmatchedDetected.length,
          filled: 0,
        });
        mapResult = await api(cockpitUrl, "/api/autofill/map", {
          method: "POST",
          body: {
            job_id: jobId,
            url: snapshot.url,
            host: snapshot.host,
            title: snapshot.title,
            fields: unmatchedDetected,
          },
        });
        fallbackMappings = (mapResult.mappings || []).map((m) => ({
          ...m,
          source: m.source || "heuristic",
        }));
      } else {
        fallbackMappings = unmatchedDetected.map((field) => ({
          field,
          canonicalKey: null,
          value: null,
          confidence: 0,
          source: "none",
        }));
      }

      const confidentFallback = fallbackMappings.filter(
        (m) => m.confidence >= (mapResult.min_confidence || 0.55) && m.value,
      );
      const ambiguous = fallbackMappings.filter(
        (m) =>
          m.value == null || m.confidence < (mapResult.min_confidence || 0.55),
      );

      matched.forEach((m) => Overlay.highlightField(m.field, "payload"));
      confidentFallback.forEach((m) => Overlay.highlightField(m.field, "ok"));
      ambiguous.forEach((m) => Overlay.highlightField(m.field, "warn"));

      const suggestions = (mapResult.available_keys || []).map((k) => ({
        key: k.key,
        label: k.label || k.key,
      }));
      // Also offer payload keys as suggestions
      for (const f of payload.fields) {
        if (f.key && !suggestions.some((s) => s.key === f.key)) {
          suggestions.push({ key: f.key, label: f.label || f.key });
        }
      }

      const ambiguousList = ambiguous.map((m) => ({ ...m, suggestions }));
      const confident = [...matched, ...confidentFallback];

      // Build values_by_key including payload
      const valuesByKey = { ...(mapResult.values_by_key || {}) };
      for (const f of payload.fields) {
        if (f.key && f.value != null && f.value !== "")
          valuesByKey[f.key] = f.value;
      }
      mapResult.values_by_key = valuesByKey;

      lastSession = {
        cockpitUrl,
        jobId,
        host: snapshot.host,
        url: snapshot.url,
        mappings: [...matched, ...fallbackMappings],
        confident,
        ambiguous,
        mapResult,
        mode: "payload",
      };

      Overlay.show(
        {
          phase: "ready",
          message: `Payload: ${matched.length} · Heuristic: ${confidentFallback.length} · Review: ${ambiguous.length}`,
          progress: 60,
          detected: snapshot.fieldCount,
          mapped: confident.length,
          ambiguous: ambiguous.length,
          filled: 0,
          ambiguousList,
        },
        {
          onFill: (choices) => void doFill(choices),
          onSave: (choices) => void doSave(choices),
        },
      );

      // Auto-start fill for payload-ready fields
      await doFill([]);

      busy = false;
      return {
        ok: true,
        detected: snapshot.fieldCount,
        mapped: confident.length,
        ambiguous: ambiguous.length,
        filled: confident.length,
        mode: "payload",
      };
    } catch (err) {
      Overlay.show({
        phase: "error",
        message: "Payload autofill failed",
        progress: 100,
        error: String(err && err.message ? err.message : err),
      });
      busy = false;
      return {
        ok: false,
        error: String(err && err.message ? err.message : err),
      };
    }
  }

  async function runAutofill(message) {
    if (busy) return { ok: false, error: "Autofill already running" };
    busy = true;

    const cockpitUrl = message.cockpitUrl || DEFAULT_COCKPIT;
    const jobId = message.jobId || null;
    const Overlay = window.CareerAutofillOverlay;
    const Detector = window.CareerAutofillDetector;

    try {
      Overlay.clearHighlights();
      Overlay.show(
        {
          phase: "detecting",
          message: "Detecting form fields…",
          progress: 10,
          detected: 0,
          mapped: 0,
          ambiguous: 0,
          filled: 0,
        },
        {},
      );

      const snapshot = Detector.detectFields();
      Overlay.update({
        phase: "mapping",
        message: `Mapping ${snapshot.fieldCount} fields to your career data…`,
        progress: 35,
        detected: snapshot.fieldCount,
        mapped: 0,
        ambiguous: 0,
        filled: 0,
      });

      if (!snapshot.fieldCount) {
        Overlay.update({
          phase: "done",
          message: "No fillable fields found on this page.",
          progress: 100,
          detected: 0,
          error:
            "Scroll to the application form or click Apply to reveal fields, then try again.",
        });
        busy = false;
        return { ok: false, error: "no fields" };
      }

      // Prefer imported payload when URL matches
      try {
        const lookup = await api(
          cockpitUrl,
          `/api/autofill/answers-for-url?${new URLSearchParams({
            url: snapshot.url,
            ...(jobId ? { job_id: jobId } : {}),
          }).toString()}`,
        );
        if (lookup && lookup.payload && lookup.field_count > 0) {
          busy = false;
          return runPayloadAutofill({
            ...message,
            options: {
              mode: "payload",
              payload: lookup.payload,
              useHeuristicFallback: true,
            },
          });
        }
      } catch {
        /* fall through to heuristic-only */
      }

      const mapResult = await api(cockpitUrl, "/api/autofill/map", {
        method: "POST",
        body: {
          job_id: jobId,
          url: snapshot.url,
          host: snapshot.host,
          title: snapshot.title,
          fields: snapshot.fields,
        },
      });

      const mappings = mapResult.mappings || [];
      const confident = mappings.filter(
        (m) => m.confidence >= (mapResult.min_confidence || 0.55) && m.value,
      );
      const ambiguous = mappings.filter(
        (m) =>
          m.value == null || m.confidence < (mapResult.min_confidence || 0.55),
      );

      confident.forEach((m) => Overlay.highlightField(m.field, "ok"));
      ambiguous.forEach((m) => Overlay.highlightField(m.field, "warn"));

      const suggestions = (mapResult.available_keys || []).map((k) => ({
        key: k.key,
        label: k.label || k.key,
      }));

      const ambiguousList = ambiguous.map((m) => ({
        ...m,
        suggestions,
      }));

      lastSession = {
        cockpitUrl,
        jobId,
        host: snapshot.host,
        url: snapshot.url,
        mappings,
        confident,
        ambiguous,
        mapResult,
        mode: "heuristic",
      };

      Overlay.show(
        {
          phase: "ready",
          message: `Mapped ${confident.length} confidently. ${ambiguous.length} need your review.`,
          progress: 60,
          detected: snapshot.fieldCount,
          mapped: confident.length,
          ambiguous: ambiguous.length,
          filled: 0,
          ambiguousList,
        },
        {
          onFill: (choices) => void doFill(choices),
          onSave: (choices) => void doSave(choices),
        },
      );

      busy = false;
      return {
        ok: true,
        detected: snapshot.fieldCount,
        mapped: confident.length,
        ambiguous: ambiguous.length,
      };
    } catch (err) {
      Overlay.show({
        phase: "error",
        message: "Autofill failed",
        progress: 100,
        error: String(err && err.message ? err.message : err),
      });
      busy = false;
      return {
        ok: false,
        error: String(err && err.message ? err.message : err),
      };
    }
  }

  async function doFill(choices) {
    if (!lastSession) return;
    const Overlay = window.CareerAutofillOverlay;
    const Filler = window.CareerAutofillFiller;
    const { confident, ambiguous, mapResult } = lastSession;

    const extra = [];
    const valuesByKey = mapResult.values_by_key || {};
    for (const choice of choices || []) {
      if (choice.skip) continue;
      const amb = ambiguous.find((a) => a.field.uid === choice.uid);
      if (!amb) continue;
      let value = choice.customValue;
      if (!value && choice.canonicalKey) {
        value = valuesByKey[choice.canonicalKey];
      }
      if (value != null && value !== "") {
        extra.push({
          field: amb.field,
          value,
          confidence: 1,
          canonicalKey: choice.canonicalKey || "custom",
          source: "manual",
        });
        Overlay.highlightField(amb.field, "ok");
      }
    }

    const toFill = [...confident, ...extra];
    Overlay.update({
      phase: "filling",
      message: `Filling ${toFill.length} fields…`,
      progress: 70,
      detected: lastSession.mappings.length,
      mapped: confident.length,
      ambiguous: ambiguous.length,
      filled: 0,
      ambiguousList: ambiguous.map((m) => ({
        ...m,
        suggestions: (mapResult.available_keys || []).map((k) => ({
          key: k.key,
          label: k.label || k.key,
        })),
      })),
    });

    busy = true;
    try {
      const results = await Filler.fillMappings(toFill, {
        minConfidence: 0,
        onProgress: ({ current, total, label }) => {
          Overlay.update({
            phase: "filling",
            message: `Filling ${current}/${total}: ${label}`,
            progress: 70 + Math.round((current / Math.max(total, 1)) * 25),
            detected: lastSession.mappings.length,
            mapped: confident.length,
            ambiguous: ambiguous.length,
            filled: current,
          });
        },
      });

      const filled = results.filter((r) => r.ok).length;
      Overlay.show(
        {
          phase: "done",
          message: `Filled ${filled} fields. Review highlighted items, then submit manually.`,
          progress: 100,
          detected: lastSession.mappings.length,
          mapped: confident.length,
          ambiguous: ambiguous.length,
          filled,
          ambiguousList: ambiguous
            .filter((a) => !extra.some((e) => e.field.uid === a.field.uid))
            .map((m) => ({
              ...m,
              suggestions: (mapResult.available_keys || []).map((k) => ({
                key: k.key,
                label: k.label || k.key,
              })),
            })),
        },
        {
          onFill: (c) => void doFill(c),
          onSave: (c) => void doSave(c),
        },
      );
    } catch (err) {
      Overlay.update({
        phase: "error",
        message: "Fill failed",
        error: String(err && err.message ? err.message : err),
        progress: 100,
      });
    } finally {
      busy = false;
    }
  }

  async function doSave(choices) {
    if (!lastSession) return;
    const Overlay = window.CareerAutofillOverlay;
    const corrections = [];
    const sourceTag = lastSession.mode === "payload" ? "payload" : "heuristic";

    for (const m of lastSession.mappings) {
      const choice = (choices || []).find((c) => c.uid === m.field.uid);
      if (
        choice &&
        !choice.skip &&
        (choice.canonicalKey || choice.customValue)
      ) {
        corrections.push({
          field_signature: fieldSignature(m.field),
          canonical_key: choice.canonicalKey || "custom",
          custom_value: choice.customValue || null,
          label: m.field.label,
          name: m.field.name,
          id: m.field.id,
          source: "manual",
        });
      } else if (m.canonicalKey && m.confidence >= 0.55) {
        corrections.push({
          field_signature: fieldSignature(m.field),
          canonical_key: m.canonicalKey,
          label: m.field.label,
          name: m.field.name,
          id: m.field.id,
          source: m.source || sourceTag,
        });
      }
    }

    try {
      await api(lastSession.cockpitUrl, "/api/autofill/feedback", {
        method: "POST",
        body: {
          host: lastSession.host,
          url: lastSession.url,
          job_id: lastSession.jobId,
          corrections,
        },
      });
      Overlay.update({
        phase: "done",
        message: "Saved site mapping for future autofills.",
        progress: 100,
        detected: lastSession.mappings.length,
        mapped: lastSession.confident.length,
        ambiguous: lastSession.ambiguous.length,
        filled: 0,
      });
    } catch (err) {
      Overlay.update({
        phase: "error",
        message: "Could not save mapping",
        error: String(err && err.message ? err.message : err),
        progress: 100,
      });
    }
  }

  function fieldSignature(field) {
    return [
      field.name || "",
      field.id || "",
      (field.label || "").toLowerCase().slice(0, 80),
      field.type || "",
    ].join("|");
  }
})();
