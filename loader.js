(function(){
  var seg = location.pathname.replace(/\/+$/,"").split("/").pop();
  var BASE = "https://aseideman.github.io/bigworks-tools/";

  // Standalone calculators. Add a slug here to ship a new one — nothing else to change.
  // h = initial iframe height in px, before the tool posts its real height back.
  var CALCS = {
    "profit-margin-calculator": { f:"profit-margin-calculator.html", t:"BIG WORKS profit margin calculator", h:700 },
    "fence-calculator":         { f:"fence-calculator.html",         t:"BIG WORKS fence calculator",         h:900 },
    "sod-calculator":           { f:"sod-calculator.html",           t:"BIG WORKS sod calculator",           h:820 },
    "tile-calculator":          { f:"tile-calculator.html",          t:"BIG WORKS tile calculator",          h:980 },
    "roof-shingle-calculator":  { f:"roof-shingle-calculator.html",  t:"BIG WORKS roof shingle calculator",  h:1100 },
    "trade-demand-calendar":    { f:"trade-demand-calendar.html",    t:"BIG WORKS trade demand calendar",    h:1750 },
    "drywall-calculator":       { f:"drywall-calculator.html",       t:"BIG WORKS drywall calculator",       h:1000 },
    "board-foot-calculator":    { f:"board-foot-calculator.html",    t:"BIG WORKS board foot calculator",    h:900 },
    "conduit-fill-calculator":  { f:"conduit-fill-calculator.html",  t:"BIG WORKS conduit fill calculator",  h:900 }
  };

  // Pricing calculators: one engine, many pages. slug -> ?trade= preset.
  var PRICES = {
    "pricing-calculator":                  "",
    "pressure-washing-pricing-calculator": "pressure-washing",
    "house-cleaning-pricing-calculator":   "house-cleaning",
    "lawn-care-pricing-calculator":        "lawn-care",
    "junk-removal-pricing-calculator":     "junk-removal",
    "handyman-pricing-calculator":         "handyman",
    "painting-pricing-calculator":         "painting",
    "gutter-cleaning-pricing-calculator":  "gutter-cleaning",
    "window-cleaning-pricing-calculator":  "window-cleaning",
    "snow-removal-pricing-calculator":     "snow-removal",
    "landscaping-pricing-calculator":      "landscaping",
    "drywall-pricing-calculator":          "drywall"
  };

  // Material/volume calculators: one engine, many pages. slug -> ?material= preset.
  var MATS = {
    "mulch-calculator":      "mulch",
    "topsoil-calculator":    "topsoil",
    "compost-calculator":    "compost",
    "gravel-calculator":     "gravel",
    "stone-calculator":      "stone",
    "river-rock-calculator": "riverrock",
    "sand-calculator":       "sand",
    "dirt-calculator":       "dirt",
    "asphalt-calculator":    "asphalt",
    "concrete-calculator":   "concrete",
    "cubic-yard-calculator": "generic"
  };

  var src, title, h;

  if(MATS[seg]){
    src = BASE + "volume-calculator.html?material=" + MATS[seg];
    title = "BIG WORKS " + seg.replace(/-/g," ");
    h = 860;
  } else if(PRICES.hasOwnProperty(seg)){
    src = BASE + "pricing-calculator.html" + (PRICES[seg] ? "?trade=" + PRICES[seg] : "");
    title = "BIG WORKS " + seg.replace(/-/g," ");
    h = 1250;
  } else if(CALCS[seg]){
    src = BASE + CALCS[seg].f;
    title = CALCS[seg].t;
    h = CALCS[seg].h;
  } else {
    // Invoice/estimate generator: mode + optional trade preset, both derived from the slug.
    var m = "", p = "";
    if(seg === "invoice-generator") m = "invoice";
    else if(seg === "estimate-generator") m = "estimate";
    else if(seg.indexOf("invoice-template-") === 0){ m = "invoice"; p = seg.slice(17); }
    else if(seg.indexOf("estimate-template-") === 0){ m = "estimate"; p = seg.slice(18); }
    if(!m) return;
    src = BASE + "invoice-generator.html?mode=" + m + (p ? "&preset=" + p : "");
    // Lines handed over from a pricing calculator (?bwq= on the page URL) -> generator ?lines=
    var bwq = (location.search.match(/[?&]bwq=([A-Za-z0-9_-]+)/) || [])[1];
    if(bwq){ src += "&lines=" + bwq; }
    title = "BIG WORKS invoice generator";
    h = 1600;
  }

  var mount = document.getElementById("bwig-mount");
  if(!mount) return;

  var f = document.createElement("iframe");
  f.title = title;
  f.setAttribute("scrolling","no");
  f.loading = "lazy";
  f.style.cssText = "width:100%;border:0;height:" + h + "px;display:block;";
  f.src = src;
  mount.appendChild(f);

  window.addEventListener("message", function(e){
    if(e.data && e.data.bwigH){ f.style.height = (e.data.bwigH + 8) + "px"; }
  });
})();
