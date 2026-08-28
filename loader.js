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
    "trade-demand-calendar":    { f:"trade-demand-calendar.html",    t:"BIG WORKS trade demand calendar",    h:1750 }
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
