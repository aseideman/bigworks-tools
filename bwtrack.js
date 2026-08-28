/* BIG WORKS — conversion & outbound click tracking
 *
 * Why this exists: as of 2026-08-28 GA4 had NO custom events across 673 pages
 * (`click` fired 3 times in 28 days), so there was no way to tell which pages
 * produce App Store downloads. This emits the events that answer that.
 *
 * Events:
 *   app_store_click  — the money event. Which page sent someone to the App Store.
 *   outbound_click   — any other external link (competitor refs, supplier links).
 *   tool_loaded      — an embedded calculator actually rendered on a tool page.
 *   tool_action      — forwarded from inside a tool iframe (see postMessage below).
 *
 * Internal-traffic opt-out lives in the site HEAD block, not here — it has to run
 * before gtag loads. Visit any page with ?bwnostat=1 to opt a browser out.
 */
(function () {
  function ev(name, params) {
    try {
      if (typeof window.gtag === "function") { window.gtag("event", name, params); return; }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, params));
    } catch (e) { /* never let analytics break the page */ }
  }

  var STORE = /(^|\.)apps\.apple\.com$|(^|\.)play\.google\.com$|(^|\.)itunes\.apple\.com$/i;

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;

    var abs;
    try { abs = new URL(a.getAttribute("href"), location.href); } catch (_) { return; }
    if (!/^https?:$/.test(abs.protocol)) return;

    var label = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);

    if (STORE.test(abs.hostname)) {
      ev("app_store_click", {
        link_url: abs.href,
        link_text: label,
        page_path: location.pathname,
        page_title: document.title
      });
      return;
    }

    if (abs.hostname && abs.hostname !== location.hostname) {
      ev("outbound_click", {
        link_url: abs.href,
        link_domain: abs.hostname,
        link_text: label,
        page_path: location.pathname
      });
    }
  }, true);

  // Did the embedded tool actually render? Distinguishes "visited a tool page"
  // from "the tool loaded", which the loader has silently failed at before.
  function toolCheck() {
    if (!document.getElementById("bwig-mount")) return;
    var f = document.querySelector("#bwig-mount iframe");
    ev(f ? "tool_loaded" : "tool_failed", {
      tool: location.pathname.replace(/\/+$/, "").split("/").pop(),
      page_path: location.pathname
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(toolCheck, 1500); });
  } else { setTimeout(toolCheck, 1500); }

  // Tools live in a cross-origin iframe, so they can't reach gtag themselves.
  // They post {bwigEvent, ...} and we forward it. Only accept our own host.
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data !== "object" || !e.data.bwigEvent) return;
    if (String(e.origin).indexOf("aseideman.github.io") === -1) return;
    ev("tool_action", {
      tool: location.pathname.replace(/\/+$/, "").split("/").pop(),
      action: String(e.data.bwigEvent).slice(0, 60),
      page_path: location.pathname
    });
  });
})();
