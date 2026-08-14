(function(){
  var seg = location.pathname.replace(/\/+$/,"").split("/").pop(), m="", p="", tool="invoice-generator.html", qs="";
  if(seg==="invoice-generator") m="invoice";
  else if(seg==="estimate-generator") m="estimate";
  else if(seg.indexOf("invoice-template-")===0){ m="invoice"; p=seg.slice(17); }
  else if(seg.indexOf("estimate-template-")===0){ m="estimate"; p=seg.slice(18); }
  else if(seg==="profit-margin-calculator"){ tool="profit-margin-calculator.html"; m="calc"; }
  if(!m) return;
  var mount = document.getElementById("bwig-mount");
  if(!mount) return;
  var f = document.createElement("iframe");
  f.title = tool==="profit-margin-calculator.html" ? "BIG WORKS profit margin calculator" : "BIG WORKS invoice generator";
  f.setAttribute("scrolling","no");
  f.loading = "lazy";
  f.style.cssText = "width:100%;border:0;height:"+(tool==="profit-margin-calculator.html"?"700":"1600")+"px;display:block;";
  if(tool==="profit-margin-calculator.html"){
    f.src = "https://aseideman.github.io/bigworks-tools/profit-margin-calculator.html";
  } else {
    f.src = "https://aseideman.github.io/bigworks-tools/invoice-generator.html?mode="+m+(p?"&preset="+p:"");
  }
  mount.appendChild(f);
  window.addEventListener("message", function(e){ if(e.data && e.data.bwigH){ f.style.height = (e.data.bwigH+8)+"px"; } });
})();
