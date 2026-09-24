/**
 * Content script — orchestrates detect → map → fill → review.
 */
(function () {
  "use strict";

  const DEFAULT_COCKPIT = "http://127.0.0.1:8770";
  let busy = false;
  let lastSession = null;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handle(message)
      .then(sendResponse)
      .catch((err) => sendResponse({ ok: false, error: String(err && err.message ? err.message : err) }));
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

    if (message.type === "AUTOFILL_START") {
      return runAutofill(message);
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

  async function runAutofill(message) {
    if (busy) return { ok: false, error: "Autofill already running" };
    busy = true;

    const cockpitUrl = message.cockpitUrl || DEFAULT_COCKPIT;
    const jobId = message.jobId || null;
    const Overlay = window.CareerAutofillOverlay;
    const Detector = window.CareerAutofillDetector;
    const Filler = window.CareerAutofillFiller;

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
        {}
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
          error: "Scroll to the application form or click Apply to reveal fields, then try again.",
        });
        busy = false;
        return { ok: false, error: "no fields" };
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
      const confident = mappings.filter((m) => m.confidence >= (mapResult.min_confidence || 0.55) && m.value);
      const ambiguous = mappings.filter(
        (m) => m.value == null || m.confidence < (mapResult.min_confidence || 0.55)
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
        }
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
      return { ok: false, error: String(err && err.message ? err.message : err) };
    }
  }

  async function doFill(choices) {
    if (!lastSession) return;
    const Overlay = window.CareerAutofillOverlay;
    const Filler = window.CareerAutofillFiller;
    const { confident, ambiguous, mapResult } = lastSession;

    // Resolve ambiguous choices into extra mappings
    const extra = [];
    const valuesByKey = (mapResult.values_by_key || {});
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
        suggestions: (mapResult.available_keys || []).map((k) => ({ key: k.key, label: k.label || k.key })),
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
          ambiguousList: ambiguous.filter((a) => !extra.some((e) => e.field.uid === a.field.uid)).map((m) => ({
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
        }
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

    for (const m of lastSession.mappings) {
      const choice = (choices || []).find((c) => c.uid === m.field.uid);
      if (choice && !choice.skip && (choice.canonicalKey || choice.customValue)) {
        corrections.push({
          field_signature: fieldSignature(m.field),
          canonical_key: choice.canonicalKey || "custom",
          custom_value: choice.customValue || null,
          label: m.field.label,
          name: m.field.name,
          id: m.field.id,
        });
      } else if (m.canonicalKey && m.confidence >= 0.55) {
        corrections.push({
          field_signature: fieldSignature(m.field),
          canonical_key: m.canonicalKey,
          label: m.field.label,
          name: m.field.name,
          id: m.field.id,
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
    return [field.name || "", field.id || "", (field.label || "").toLowerCase().slice(0, 80), field.type || ""]
      .join("|");
  }
})();
