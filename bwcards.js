/* BIG WORKS — hub card affordance + icons
 * Upgrades .bw-feat-why-card links on /features, /tools, /learn, /trades so they
 * read as clickable: bordered, lift + shadow on hover, an icon tile, and an arrow.
 * Icon is chosen from the card's href, so new cards get one automatically.
 * Injected site-wide as a registered script, same pattern as bw_global_css_fixes.
 */
(function () {
  var CSS = [
    // Radius stays at the existing 8px on purpose: this change is about affordance,
    // not restyling. Icons follow the brand system's documented Lucide convention
    // (24x24, 2px stroke, round caps/joins) — see brand/design-system-readme.md.
    '.bw-feat-why-card[data-bwc]{position:relative;border:1.5px solid #E6E6EA;border-radius:8px;',
      'transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;',
      'text-decoration:none;overflow:hidden}',
    '.bw-feat-why-card[data-bwc]:before{content:"";position:absolute;left:0;top:0;height:3px;width:100%;',
      'background:#FFC20F;transform:scaleX(0);transform-origin:left;transition:transform .18s ease}',
    '.bw-feat-why-card[data-bwc]:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.10);border-color:#D9D9DF}',
    '.bw-feat-why-card[data-bwc]:hover:before{transform:scaleX(1)}',
    '.bw-feat-why-card[data-bwc]:focus-visible{outline:3px solid #FFC20F;outline-offset:3px}',

    '.bwc-ico{width:44px;height:44px;border-radius:10px;background:#FFF4D6;color:#111114;',
      'display:flex;align-items:center;justify-content:center;margin-bottom:16px;',
      'transition:background .16s ease,color .16s ease}',
    '.bw-feat-why-card[data-bwc]:hover .bwc-ico{background:#FFC20F}',
    '.bwc-ico svg{width:23px;height:23px;display:block}',

    '.bwc-arrow{position:absolute;top:26px;right:26px;width:26px;height:26px;border-radius:50%;',
      'display:flex;align-items:center;justify-content:center;color:#A9A9B2;',
      'transition:color .16s ease,transform .16s ease,background .16s ease}',
    '.bwc-arrow svg{width:15px;height:15px;display:block}',
    '.bw-feat-why-card[data-bwc]:hover .bwc-arrow{color:#111114;transform:translate(3px,-3px)}',

    '@media (prefers-reduced-motion:reduce){',
      '.bw-feat-why-card[data-bwc],.bw-feat-why-card[data-bwc]:before,.bwc-ico,.bwc-arrow{transition:none}',
      '.bw-feat-why-card[data-bwc]:hover{transform:none}',
      '.bw-feat-why-card[data-bwc]:hover .bwc-arrow{transform:none}}',

    '@media (max-width:479px){.bwc-arrow{top:20px;right:20px}.bwc-ico{width:38px;height:38px;border-radius:9px;margin-bottom:12px}.bwc-ico svg{width:20px;height:20px}}'
  ].join('');

  var P = { // 24x24, stroke-based
    doc:      'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z|M14 3v5h5|M9 13h6|M9 17h4',
    docPlus:  'M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z|M14 3v5h5|M12 12v6|M9 15h6',
    calc:     'M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z|M9 7h6|M9 12h.01|M12 12h.01|M15 12h.01|M9 16h.01|M12 16h.01|M15 16h.01',
    fence:    'M4 10h16|M4 15h16|M7 6v15|M12 6v15|M17 6v15',
    grass:    'M6 21c0-4 1-7 3-9|M12 21c0-7 1-10 2-12|M18 21c0-4-1-7-3-9|M3 21h18',
    tile:     'M4 4h7v7H4z|M13 4h7v7h-7z|M4 13h7v7H4z|M13 13h7v7h-7z',
    roof:     'M3 12l9-8 9 8|M5 12v8h14v-8|M9 20v-5h6v5',
    cube:     'M12 3l8 4.5v9L12 21l-8-4.5v-9z|M12 12l8-4.5|M12 12v9|M12 12L4 7.5',
    leaf:     'M20 4C11 4 5 9 5 17c0 0 1.5 1.5 5 1.5C18 18.5 20 11 20 4z|M4 21c3-6 7-9 11-11',
    pebbles:  'M8 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M16 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z|M14 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    layers:   'M12 3l9 4.5-9 4.5-9-4.5z|M3 12.5l9 4.5 9-4.5|M3 17l9 4.5 9-4.5',
    road:     'M7 3L4 21|M17 3l3 18|M12 4v3|M12 11v3|M12 18v3',
    droplet:  'M12 3s6.5 6.8 6.5 11a6.5 6.5 0 0 1-13 0C5.5 9.8 12 3 12 3z',
    bolt:     'M13 2L4 14h7l-1 8 9-12h-7z',
    wind:     'M3 8h11a3 3 0 1 0-3-3|M3 13h14a3 3 0 1 1-3 3|M3 18h8',
    roller:   'M5 4h12v5H5z|M11 9v3|M8.5 12h5v9h-5z',
    tree:     'M12 3l5 7h-3l4 6H6l4-6H7z|M12 16v5',
    hammer:   'M14 3l7 7-3 3-7-7z|M11.5 6.5L3 15l3 3 8.5-8.5',
    wrench:   'M15 3a5 5 0 0 0-4.6 7L3 17.4 6.6 21l7.4-7.4A5 5 0 1 0 15 3z',
    spray:    'M9 8h6v13H9z|M9 8V5h4v3|M16 4h3|M16 8h2|M16 12h2',
    hardhat:  'M3 18h18|M6 18a6 6 0 0 1 12 0|M10 6h4v5|M12 3v3',
    person:   'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z|M4 21c0-4 3.5-6 8-6s8 2 8 6',
    chart:    'M4 21h17|M6 21V12|M11 21V5|M16 21v-6|M21 21V9',
    tag:      'M20 12l-8 8-9-9V4h7z|M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    dollar:   'M12 2v20|M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    megaphone:'M4 10v4h4l6 4V6l-6 4z|M18 9a4 4 0 0 1 0 6',
    briefcase:'M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2|M3 13h18',
    book:     'M5 4a2 2 0 0 1 2-2h12v17H7a2 2 0 0 0-2 2z|M7 19h12v3H7a2 2 0 0 1 0-3z',
    ruler:    'M15 3l6 6L9 21l-6-6z|M15 9l-2-2|M12 12l-2-2|M9 15l-2-2'
  };

  // Most specific first — first match wins.
  function pick(href) {
    var h = (href || '').toLowerCase();
    var m = [
      ['fence-calculator', 'fence'], ['sod-calculator', 'grass'], ['tile-calculator', 'tile'],
      ['roof-shingle', 'roof'], ['concrete-calculator', 'cube'], ['cubic-yard', 'cube'],
      ['mulch', 'leaf'], ['compost', 'leaf'],
      ['gravel', 'pebbles'], ['stone', 'pebbles'], ['river-rock', 'pebbles'], ['sand', 'pebbles'],
      ['topsoil', 'layers'], ['dirt', 'layers'], ['asphalt', 'road'],
      ['profit-margin', 'calc'], ['calculator', 'calc'],
      ['invoice-generator', 'docPlus'], ['estimate-generator', 'docPlus'],
      ['invoice-template', 'doc'], ['estimate-template', 'doc'],
      ['/features/invoicing', 'doc'], ['/features/estimates', 'ruler'],
      ['/features/clients', 'person'], ['/features/items', 'tag'], ['/features/reports', 'chart'],
      ['plumb', 'droplet'], ['electric', 'bolt'], ['hvac', 'wind'],
      ['roofing', 'roof'], ['painter', 'roller'], ['paint', 'roller'],
      ['landscap', 'tree'], ['carpent', 'hammer'], ['handyman', 'wrench'],
      ['clean', 'spray'], ['general-contract', 'hardhat'], ['contractor', 'hardhat'],
      ['getting-paid', 'dollar'], ['marketing', 'megaphone'],
      ['starting-your-business', 'briefcase'], ['estimating', 'ruler'], ['invoicing', 'doc'],
      ['/topics/', 'book'], ['/learn', 'book'], ['/trades/', 'hardhat'], ['/tools/', 'doc']
    ];
    for (var i = 0; i < m.length; i++) { if (h.indexOf(m[i][0]) !== -1) return m[i][1]; }
    return 'doc';
  }

  function svg(key) {
    var d = P[key] || P.doc;
    var paths = d.split('|').map(function (p) { return '<path d="' + p + '"/>'; }).join('');
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
              'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
              '<path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>';

  function run() {
    var cards = document.querySelectorAll('.bw-feat-why-card');
    if (!cards.length) return;

    if (!document.getElementById('bwc-style')) {
      var s = document.createElement('style');
      s.id = 'bwc-style';
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    Array.prototype.forEach.call(cards, function (card) {
      if (card.getAttribute('data-bwc')) return;

      // Only treat real links. The same class is reused for non-clickable FAQ
      // cards on /pricing — giving those an arrow would imply navigation that
      // does not exist. All styling is scoped to [data-bwc], so those stay as-is.
      var href = card.getAttribute('href');
      if (!href || href === '#') return;

      card.setAttribute('data-bwc', '1');

      var ico = document.createElement('div');
      ico.className = 'bwc-ico';
      ico.innerHTML = svg(pick(card.getAttribute('href')));
      card.insertBefore(ico, card.firstChild);

      var arr = document.createElement('span');
      arr.className = 'bwc-arrow';
      arr.innerHTML = ARROW;
      card.appendChild(arr);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();
