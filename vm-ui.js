/* vm-ui.js · Vĩ mô TVN: sửa giao diện theo đánh giá UI/UX 27/10/2026 (thư m-20261027-ux7k bản Vĩ mô, i-20261027-ux4v mục 1).
   Tệp độc lập, nạp sau mã trang; chạy được cả bản GitHub lẫn bản trên claude.ai. Không đổi số liệu.
   1. Chỉ trang Tổng quan hiện đủ phần đầu; trang khác có một dòng tiêu đề (quay lại Tổng quan, tên trang, kỳ số liệu, Tìm).
   2. Máy tính: thanh mục 01–10 lên đầu; 7 nút công cụ gom vào "Công cụ", ngôn ngữ, sáng tối, cỡ chữ gom vào "Hiển thị".
   3. Thẻ Lịch số liệu: tiêu đề và nút "Xem thêm" đủ tương phản.
   4. Nhãn thương hiệu cố định không đè chữ; nút Hỏi đáp nhỏ lại, ẩn khi cuộn xuống trên điện thoại.
   5. Bảng rộng trên điện thoại: gợi ý vuốt ngang; trang Phía sản xuất và Dự báo thu bảng phụ vào "Xem bảng".
   6. Sàn chữ 12px (nhãn biểu đồ 11px). 7. Vùng chạm 40px trên điện thoại, 32px trên máy tính.
   9. Bỏ lặp 9,95% và -4,91% ở dải chỉ số; bảng theo dõi quý gộp các cột đang chờ thành một dòng.
   Nhúng trong TVN Insight (embed=1 hoặc nằm trong khung): ẩn đầu trang riêng, thanh 6 mục thành hàng tab trượt ngang ở trên, ẩn nút hỏi đáp riêng. */
(function () {
  if (window.__vmUi27) return; window.__vmUi27 = 1;
  var D = document, H = D.documentElement, W = window;
  /* chỉ coi là "nhúng trong TVN Insight" khi trang mẹ là jukytwo.github.io (bantin/xem/?p=vimo) hoặc có embed=1;
     bản trên claude.ai cũng chạy trong khung nhưng không phải nhúng Insight */
  var EMB = /[?&]embed=1/.test(location.search), inF = false;
  try { inF = W.self !== W.top; } catch (e) { inF = true; }
  if (inF && !EMB) {
    var par = D.referrer || ''; try { if (location.ancestorOrigins && location.ancestorOrigins.length) par = location.ancestorOrigins[0] + ' ' + par; } catch (e) {}
    EMB = /jukytwo\.github\.io|127\.0\.0\.1|localhost/.test(par);
  }
  if (EMB) H.classList.add('vmx-embed');
  var mob = function () { return W.innerWidth <= 760; };

  var css = [
    /* 1 · trang không phải Tổng quan: thu phần đầu */
    'html.vmx-on:not([data-vmp="p1"]) #tong-quan-dau,html.vmx-on:not([data-vmp="p1"]) #vm-status,html.vmx-on:not([data-vmp="p1"]) #x-pbar,html.vmx-on:not([data-vmp="p1"]) #x-upd,html.vmx-on:not([data-vmp="p1"]) #vm-focus,html.vmx-on:not([data-vmp="p1"]) #x-search{display:none!important}',
    'html.vmx-on.vmx-s:not([data-vmp="p1"]) #x-search{display:block!important}',
    '.vmx-bar{display:none}',
    'html.vmx-on:not([data-vmp="p1"]) .vmx-bar{display:flex;align-items:center;gap:8px 10px;flex-wrap:wrap;margin:6px 0 14px;padding:8px 12px;border-radius:14px;background:var(--color-panel,#fff);border:1px solid var(--color-border-line,#dfe5ef);font-family:var(--font-anthropic-sans,"Be Vietnam Pro",system-ui,sans-serif)}',
    '.vmx-bar button{font:inherit;font-size:13.5px;font-weight:700;min-height:40px;padding:0 14px;border-radius:12px;border:1px solid var(--color-border-line,#dfe5ef);background:transparent;color:var(--color-fg,#13213b);cursor:pointer}',
    '.vmx-bar .t{font-size:15px;font-weight:800;color:var(--color-fg,#13213b);flex:1 1 0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.vmx-bar .k{font-size:12.5px;color:var(--color-muted,#5b6577);flex:1 1 100%;order:3}',
    '@media(min-width:761px){.vmx-bar .k{flex:0 1 auto;order:0}}',
    /* 2 · máy tính: công cụ gom menu */
    '.vmx-dd{position:relative;display:inline-block}',
    '.vmx-dd>summary{list-style:none;cursor:pointer}.vmx-dd>summary::-webkit-details-marker{display:none}',
    '.vmx-ddl{position:fixed;z-index:90;max-height:70vh;overflow:auto;min-width:240px;display:grid;gap:6px;padding:10px;border-radius:14px;background:var(--color-panel,#fff);border:1px solid var(--color-border-line,#dfe5ef);box-shadow:0 18px 40px -18px rgba(0,0,0,.45)}',
    '.vmx-ddl{width:300px;box-sizing:border-box}.vmx-ddl>.vm-tool,.vmx-ddl>details>summary,.vmx-ddl>details{width:100%;box-sizing:border-box;justify-content:flex-start;text-align:left}',
    '.vmx-ddl .vm-menu-l{position:static!important;margin-top:6px}',
    '.vm-tools.vmx-g{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    /* 3 · thẻ Lịch số liệu */
    '.x-cal .xc-hd h3{color:#fff!important}',
    '.x-cal .xc-more{color:#13213b!important;background:#fff!important;border:1px solid #c8992f!important;font-weight:700}',
    /* 4 · nhãn thương hiệu, nút Hỏi đáp */
    '.vmx-brand{transform:scale(.72);transform-origin:left bottom;opacity:.85}',
    '.vmx-brand.vmx-off{display:none!important}',
    '@media print{.vmx-brand.vmx-off{display:block!important}}',
    '@media(max-width:760px){.qa-fab{width:40px!important;height:40px!important;min-width:40px!important;transition:transform .2s,opacity .2s}html.vmx-down .qa-fab{transform:translateY(90px);opacity:0;pointer-events:none}.vm-page .card{scroll-margin-top:120px}}',
    /* 5 · bảng rộng trên điện thoại */
    '.vmx-tw{overflow-x:auto;-webkit-overflow-scrolling:touch;position:relative;max-width:100%}',
    '.vmx-hint{display:none;font-size:12px;color:var(--color-muted,#5b6577);margin:4px 0;font-weight:600}',
    '@media(max-width:760px){.vmx-hint{display:block}.vmx-tw{background:linear-gradient(to right,var(--color-panel,#fff) 30%,transparent),linear-gradient(to left,rgba(0,0,0,.14),transparent 14px) right/14px 100% no-repeat;background-attachment:local,scroll}}',
    '.vmx-more{margin:10px 0;border:1px solid var(--color-border-line,#dfe5ef);border-radius:12px;padding:0 12px}',
    '.vmx-more>summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-weight:700;font-size:13.5px;color:var(--color-fg,#13213b)}',
    /* 7 · vùng chạm */
    '.vmx-tap{min-height:40px!important;min-width:40px!important}',
    '.x-cc{display:inline-flex!important;align-items:center;min-height:40px}@media(min-width:761px){.x-cc{min-height:32px}}',
    '@media(max-width:760px){.app-bar button span{font-size:12px!important;white-space:nowrap}}',
    '.vmx-tap.vmx-il{display:inline-flex!important;align-items:center;justify-content:center}',
    '@media(min-width:761px){.vmx-tap{min-height:32px!important;min-width:32px!important}}',
    /* 9 · bảng theo dõi quý: ghi chú cột đang chờ */
    '.vmx-wait-hide{display:none!important}',
    '.vmx-wnote{font-size:12.5px;color:var(--color-muted,#5b6577);margin:6px 0 0;font-weight:600}',
    /* nhúng trong TVN Insight */
    'html.vmx-embed .vm-top .vm-logo,html.vmx-embed #vmBack,html.vmx-embed #vmBackF,html.vmx-embed .qa-fab{display:none!important}',
    '@media(max-width:760px){html.vmx-embed .app-bar{display:flex!important;position:sticky!important;top:0!important;bottom:auto!important;left:auto;right:auto;z-index:75;overflow-x:auto;gap:6px;padding:6px 8px!important;border-top:0!important;border-bottom:3px solid #c8992f!important;box-shadow:0 10px 24px -14px rgba(0,0,0,.55)!important;scrollbar-width:none}',
    'html.vmx-embed .app-bar::-webkit-scrollbar{display:none}',
    'html.vmx-embed .app-bar button{display:inline-flex!important;flex:0 0 auto;align-items:center;gap:6px;min-height:40px!important;padding:6px 12px!important;font-size:13px!important;border-radius:20px!important}',
    'html.vmx-embed .app-bar svg{width:16px!important;height:16px!important}',
    'html.vmx-embed .app-bar,html.vmx-embed .app-bar button{font-family:var(--font-anthropic-sans,"Be Vietnam Pro",system-ui,sans-serif)!important}',
    'html.vmx-embed body>a[href="https://tvnpartners.com.vn"][data-noi18n]{display:none!important}html.vmx-embed body{padding-top:0!important}',
    'html.vmx-embed #dash-root{padding-bottom:24px!important}',
    'html.vmx-embed .sim-dock{bottom:0!important}}'
  ].join('\n');
  var st = D.createElement('style'); st.id = 'vmx-css'; st.textContent = css; (D.head || H).appendChild(st);

  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function act() { var p = $('.vm-page:not([hidden])'); return p && p.id; }
  function vis(e) { return e && e.offsetParent !== null; }

  /* thanh một dòng cho trang không phải Tổng quan */
  function bar() {
    var hero = $('#tong-quan-dau'); if (!hero) return null;
    var b = $('.vmx-bar');
    if (!b) {
      b = D.createElement('div'); b.className = 'vmx-bar'; b.setAttribute('data-noi18n', '');
      b.innerHTML = '<button type="button" class="vmx-back">‹ Tổng quan</button><span class="t"></span><span class="k"></span><button type="button" class="vmx-find" aria-expanded="false">Tìm</button>';
      hero.parentNode.insertBefore(b, hero);
      b.querySelector('.vmx-back').addEventListener('click', function () {
        var t = $('#tab-p1') || $('.app-bar button[data-k="p1"]'); if (t) t.click();
        W.scrollTo(0, 0);
      });
      b.querySelector('.vmx-find').addEventListener('click', function () {
        var on = H.classList.toggle('vmx-s'); this.setAttribute('aria-expanded', on);
        if (on) { var i = $('#x-search input'); if (i) setTimeout(function () { i.focus(); }, 30); }
      });
    }
    return b;
  }
  function fillBar(id) {
    var b = bar(); if (!b) return;
    var tab = $('#tab-' + id), ten = '';
    if (tab) { ten = tab.innerText.replace(/\s+/g, ' ').trim().replace(/^\d+b?\s*/, '').replace(/Mới$/, '').trim(); }
    if (!ten) { var ab = $('.app-bar button[data-k="' + id + '"]'); if (ab) ten = ab.innerText.trim(); }
    if (!ten) { var ch = $('#' + id + ' .vm-chap'); if (ch) ten = ch.innerText.split('\n')[0].trim(); }
    b.querySelector('.t').textContent = ten;
    var pill = $('#vm-pill'); b.querySelector('.k').textContent = pill ? pill.innerText.trim() : '';
    var en = (H.lang || '').indexOf('en') === 0 || !!$('#vm-lang button[aria-pressed="true"]:last-child');
    b.querySelector('.vmx-back').textContent = en ? '‹ Overview' : '‹ Tổng quan';
    b.querySelector('.vmx-find').textContent = en ? 'Search' : 'Tìm';
  }

  function topOffset() {
    var o = 0;
    ['#tvnF-dau', '.app-bar', '.vm-tabs'].forEach(function (s) {
      var e = $(s); if (!vis(e)) return; var cs = getComputedStyle(e);
      if (cs.position === 'sticky' || (cs.position === 'fixed' && parseFloat(cs.top) < 5 && cs.bottom === 'auto')) {
        var r = e.getBoundingClientRect(); if (r.top < 140) o = Math.max(o, r.bottom);
      }
    });
    return o;
  }
  function toPageTop(id) {
    var pg = $('#' + id); if (!pg) return;
    var tgt = id === 'p1' ? null : ($('.vmx-bar') || pg);
    setTimeout(function () {
      if (!tgt) { return; }
      var y = tgt.getBoundingClientRect().top + W.scrollY - topOffset() - 8;
      W.scrollTo(0, Math.max(0, y));
    }, 70);
  }

  /* 2 · thanh mục lên đầu, gom công cụ (máy tính) */
  function desk() {
    var tabs = $('.vm-tabs'), hero = $('#tong-quan-dau');
    if (tabs && hero && !tabs.__vmx && hero.parentNode) {
      tabs.__vmx = 1; hero.parentNode.insertBefore(tabs, hero);
    }
    var tools = $('.vm-tools');
    if (tools && !tools.__vmx) {
      tools.__vmx = 1;
      var cc = ['#vm-refresh', '#vm-report', '#vm-onepage', '#vm-excel', '.vm-tools > details.vm-menu:not(#vm-tong)', '#vm-tong', '#vm-gloss'].map(function (s) { return $(s); }).filter(Boolean);
      var hs = ['#vm-lang', '#vm-theme', '.vm-tools > .x-fs'].map(function (s) { return $(s); }).filter(Boolean);
      var mk = function (lab, alt) {
        var d = D.createElement('details'); d.className = 'vmx-dd';
        d.innerHTML = '<summary class="vm-tool' + (alt ? ' alt' : '') + '" data-noi18n>' + lab + '</summary><div class="vmx-ddl"></div>';
        d.addEventListener('toggle', function () {
          if (!d.open) return; var r = d.firstChild.getBoundingClientRect(), l = d.lastChild;
          l.style.left = Math.min(r.left, W.innerWidth - 260) + 'px';
          var below = W.innerHeight - r.bottom - 16;
          if (below > 260) { l.style.top = (r.bottom + 6) + 'px'; l.style.bottom = 'auto'; l.style.maxHeight = below + 'px'; }
          else { l.style.top = 'auto'; l.style.bottom = (W.innerHeight - r.top + 6) + 'px'; l.style.maxHeight = (r.top - 16) + 'px'; }
        });
        return d;
      };
      if (cc.length) { var d1 = mk('Công cụ ▾'); cc.forEach(function (n) { d1.lastChild.appendChild(n); }); tools.insertBefore(d1, tools.firstChild); }
      if (hs.length) { var d2 = mk('⚙ Hiển thị', 1); hs.forEach(function (n) { d2.lastChild.appendChild(n); }); tools.appendChild(d2); }
      tools.classList.add('vmx-g');
      W.addEventListener('scroll', function () { $$('.vmx-dd[open]').forEach(function (d) { d.removeAttribute('open'); }); }, { passive: true });
      D.addEventListener('click', function (e) {
        $$('.vmx-dd[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
      });
    }
  }

  /* 4 · nhãn thương hiệu cố định */
  function brand() {
    var a = $$('a[href^="https://tvnpartners.com.vn"]').filter(function (e) { return getComputedStyle(e).position === 'fixed'; })[0];
    if (!a) return;
    var col = $('.vm') || $('#dash-root'); if (!col) return;
    var room = col.getBoundingClientRect().left, need = a.offsetWidth * 0.72 + 16;
    if (!a.__vmxw) a.__vmxw = a.offsetWidth;
    if (room < a.__vmxw * 0.62 + 16) { a.style.setProperty('display', 'none', 'important'); }
    else { a.style.removeProperty('display'); a.style.setProperty('transform', 'scale(.62)', 'important'); a.style.setProperty('transform-origin', 'left bottom', 'important'); }
  }

  /* 9a · dải chỉ số: bỏ hai số đã có ở cặp số lớn */
  function tick() {
    var g = $('#nghich-ly .big.g'), r = $('#nghich-ly .big.r');
    var gv = g && g.textContent.trim(), rv = r && r.textContent.trim();
    $$('#vm-tick .tk').forEach(function (t) {
      var b = t.querySelector('b'); var v = b && b.textContent.trim();
      t.style.display = (v && (v === gv || v === rv)) ? 'none' : '';
    });
  }

  /* 5 · bảng rộng */
  function tables(pg) {
    $$('table', pg).forEach(function (t) {
      if (t.__vmx || t.closest('.vmx-more') && t.__vmxw) return;
      var p = t.parentElement; if (!p) return;
      var ov = getComputedStyle(p).overflowX;
      if (!t.parentElement.classList.contains('vmx-tw') && !(ov === 'auto' || ov === 'scroll')) {
        var w = D.createElement('div'); w.className = 'vmx-tw'; p.insertBefore(w, t); w.appendChild(t); p = w;
      } else if (ov === 'auto' || ov === 'scroll') { p.classList.add('vmx-tw'); }
      t.__vmx = 1;
      if (!p.previousElementSibling || !p.previousElementSibling.classList.contains('vmx-hint')) {
        var h = D.createElement('div'); h.className = 'vmx-hint'; h.setAttribute('data-noi18n', '');
        h.textContent = 'Vuốt ngang để xem thêm cột ›'; p.parentNode.insertBefore(h, p);
      }
    });
    $$('.vmx-hint', pg).forEach(function (h) {
      var w = h.nextElementSibling; var t = w && w.querySelector('table');
      h.style.visibility = (t && t.scrollWidth > w.clientWidth + 4) ? '' : 'hidden';
      if (h.style.visibility === 'hidden') h.style.display = 'none'; else h.style.display = '';
    });
  }
  /* 5b · Phía sản xuất trên điện thoại: thu bảng và biểu đồ phụ của từng thẻ vào "Xem số liệu", giữ tiêu đề, ghi chú, Nhận định */
  function fold(pg) {
    if (!mob() || pg.id !== 'p11') return;
    $$('.card', pg).forEach(function (c) {
      if (c.__vmxf || /^(ss-khuvuc|ss-quy4|ss-tonghop)$/.test(c.id) || c.querySelector('input[type="range"]')) return;
      var keep = function (k, i) {
        return (i === 0 && /^H\d$/.test(k.tagName)) || (k.tagName === 'P' && k.classList.contains('note') && i < 3) ||
          k.classList.contains('x-cc') || k.classList.contains('ss-ndw') || k.classList.contains('x-share') || k.tagName === 'DETAILS' && k.classList.contains('vmx-more');
      };
      var kids = Array.prototype.slice.call(c.children), mv = kids.filter(function (k, i) { return !keep(k, i); });
      if (!mv.length) return;
      c.__vmxf = 1;
      var d = D.createElement('details'); d.className = 'vmx-more';
      d.innerHTML = '<summary data-noi18n>Xem bảng và số liệu của thẻ này</summary>';
      c.insertBefore(d, mv[0]); mv.forEach(function (k) { d.appendChild(k); });
    });
  }

  /* 9b · bảng theo dõi quý: cột đang chờ gộp một dòng */
  function waits(pg) {
    $$('table', pg).forEach(function (t) {
      if (!t.querySelector('td.wait') || t.__vmxq) return;
      var rows = $$('tbody tr', t); if (!rows.length) return;
      var hr = t.querySelector('thead tr'); if (!hr) return;
      var ths = $$('th', hr), notes = [];
      ths.forEach(function (th, i) {
        if (i === 0) return;
        var all = rows.every(function (r) { var c = r.children[i]; return c && c.classList.contains('wait'); });
        if (!all) return;
        var c0 = rows[0].children[i]; var day = c0.querySelector('b');
        notes.push(th.textContent.trim() + (day ? ' công bố ' + day.textContent.trim() : ': chưa có số'));
        th.classList.add('vmx-wait-hide'); rows.forEach(function (r) { r.children[i].classList.add('vmx-wait-hide'); });
      });
      t.__vmxq = 1;
      if (notes.length) {
        var n = D.createElement('p'); n.className = 'vmx-wnote'; n.setAttribute('data-noi18n', '');
        n.textContent = 'Chưa có số: ' + notes.join(' · ') + '. Số sẽ hiện trong bảng khi công bố.';
        var w = t.closest('.vmx-tw') || t; w.parentNode.insertBefore(n, w.nextSibling);
      }
    });
  }

  /* nhãn thanh ngang tràn mép phải trên điện thoại */
  function bars(pg) {
    $$('.ss-bar em', pg).forEach(function (e) {
      var row = e.closest('.card') || pg; var rr = row.getBoundingClientRect(), r = e.getBoundingClientRect();
      if (r.right > rr.right - 2) { e.style.left = 'auto'; e.style.right = '4px'; e.style.color = '#fff'; e.style.textShadow = '0 1px 2px rgba(0,0,0,.6)'; }
    });
  }
  /* nút "Xem thêm n mốc" lặp hai lần */
  function dups(pg) {
    $$('.card', pg).forEach(function (c) {
      var a = c.querySelector('.app-more'), b = c.querySelector('.x-insmore');
      if (a && b && vis(a) && vis(b) && a.textContent.trim() === b.textContent.trim()) b.style.display = 'none';
    });
  }

  /* 6 · sàn chữ */
  function fonts(root) {
    var els = root.querySelectorAll('*');
    for (var i = 0; i < els.length; i++) {
      var e = els[i]; if (e.__vmxF) continue;
      var tag = e.tagName.toLowerCase();
      if (tag === 'text' || tag === 'tspan') {
        var f0 = parseFloat(getComputedStyle(e).fontSize); if (f0 && f0 < 11) e.style.setProperty('font-size', '11px', 'important');
        e.__vmxF = 1; continue;
      }
      if (e.closest('svg') || tag === 'script' || tag === 'style') continue;
      var has = false; for (var k = 0; k < e.childNodes.length; k++) { var n = e.childNodes[k]; if (n.nodeType === 3 && n.nodeValue.trim()) { has = true; break; } }
      if (!has) continue;
      var f = parseFloat(getComputedStyle(e).fontSize);
      if (f && f < 11.95) e.style.setProperty('font-size', '12px', 'important');
      e.__vmxF = 1;
    }
  }
  /* 7 · vùng chạm */
  function taps(root) {
    var lim = mob() ? 40 : 32;
    $$('button,summary,[role="button"],a', root).forEach(function (e) {
      if (e.__vmxT || !vis(e) || e.closest('svg')) return;
      if (e.tagName === 'A') { var p = e.parentElement; if (p && p.textContent.trim().length > e.textContent.trim().length + 4) return; }
      var r = e.getBoundingClientRect(); if (!r.width) return;
      e.__vmxT = 1;
      if (r.height < lim || r.width < lim) {
        e.classList.add('vmx-tap');
        if (getComputedStyle(e).display.indexOf('inline') === 0 || getComputedStyle(e).display === 'inline') e.classList.add('vmx-il');
      }
    });
  }

  var last = null, busy = false;
  function run() {
    busy = true;
    try {
      var id = act(); if (!id) return;
      H.classList.add('vmx-on'); H.dataset.vmp = id;
      if (id !== 'p1') fillBar(id); else bar();
      if (!mob()) desk();
      tick(); brand();
      var pg = $('#' + id);
      if (pg) { tables(pg); waits(pg); fold(pg); dups(pg); fonts(pg); taps(pg); bars(pg); }
      var hd = $('.vm'); if (hd) { $$('#tong-quan-dau,#vm-status,#x-pbar,#x-upd,#vm-focus,#x-search,.vmx-bar,.vm-tabs,.x-cal,.vm-foot').forEach(function (e) { fonts(e); taps(e); }); }
      if (last !== null && id !== last) toPageTop(id);
      last = id;
      if (EMB && mob()) {
        var ab = $('.app-bar'); if (ab && D.body.firstElementChild !== ab) D.body.insertBefore(ab, D.body.firstElementChild);
      }
    } finally { setTimeout(function () { busy = false; }, 0); }
  }
  var tm = 0;
  function sched() { if (busy) return; clearTimeout(tm); tm = setTimeout(run, 120); }
  function start() {
    if (!$('#dash-root') && !$('.vm-page')) { setTimeout(start, 300); return; }
    run();
    var root = $('#dash-root') || D.body;
    new MutationObserver(sched).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    new MutationObserver(function () { brand(); }).observe(D.body, { childList: true });
    setTimeout(brand, 1500); setTimeout(brand, 4000);
    W.addEventListener('resize', sched);
    var ly = W.scrollY;
    W.addEventListener('scroll', function () {
      var y = W.scrollY; if (Math.abs(y - ly) < 8) return;
      H.classList.toggle('vmx-down', y > ly && y > 300); ly = y;
    }, { passive: true });
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', function () { setTimeout(start, 200); });
  else setTimeout(start, 200);
})();
