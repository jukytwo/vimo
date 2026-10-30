/* vm-widata.js · Vĩ mô TVN: số liệu vĩ mô bổ sung từ WiData MCP (anh Vũ 30/10/2026 "gắn lên luôn").
   Tệp độc lập, nạp sau mã trang, không sửa phần dựng sẵn. Đọc widata.json (xuất bằng C:\hermes\radar\radar\xuat_widata_vimo.py):
   - cuối trang 01 Tổng quan: "Bảng số vĩ mô đầy đủ", gập sẵn, mỗi chỉ tiêu một ô (số mới nhất, kỳ, so kỳ trước, đường 24 kỳ);
   - trang 08 Dự báo: "Dự báo của các tổ chức" (trung vị, thấp – cao, bấm dòng xem từng nơi).
   Mọi khối ghi nguồn "WiData MCP by WiGroup". */
(function () {
  if (window.__vmWidata) return; window.__vmWidata = 1;
  var D = document;
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var le = function (v) { v = Math.abs(v); return v >= 1000 ? 0 : v >= 100 ? 1 : 2; };
  var so = function (v, n) { return v == null || !isFinite(v) ? "—" : Number(v).toLocaleString("vi-VN", { minimumFractionDigits: n, maximumFractionDigits: n }); };
  var dau = function (v, n) { return (v > 0 ? "+" : "") + so(v, n); };
  var ngay = function (s) { return s ? s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4) : ""; };
  var NGUON = 'Nguồn: <b>WiData MCP by WiGroup</b>';

  function duong(ls) {
    var a = (ls || []).filter(function (v) { return v != null && isFinite(v); });
    if (a.length < 2) return "";
    var w = 140, h = 26, lo = Math.min.apply(null, a), hi = Math.max.apply(null, a), r = hi - lo || 1;
    var d = a.map(function (v, i) { return (i / (a.length - 1) * w).toFixed(1) + "," + (h - 2 - (v - lo) / r * (h - 4)).toFixed(1); }).join(" ");
    return '<svg class="wd-l" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="var(--tvn-gold,#E0A126)" stroke-width="1.4" points="' + d + '"/></svg>';
  }
  function o(x) {
    var pt = x.dv === "%" || x.dv === "Điểm", d = x.truoc == null ? null : x.gt - x.truoc, doi = "";
    if (d != null) doi = pt ? dau(d, 2) + " điểm" : x.truoc > 0 && x.gt > 0 ? dau((x.gt / x.truoc - 1) * 100, 1) + "%" : dau(d, le(d));
    return '<div class="wd-o"><div class="wd-t">' + esc(x.ten) + '</div><div class="wd-s">' + so(x.gt, le(x.gt)) + ' <small>' + esc(x.dv) + '</small></div>'
      + '<div class="wd-k">' + esc(x.ky) + (doi ? " · so " + esc(x.ky_truoc || "kỳ trước") + " " + doi : "") + "</div>" + duong(x.ls) + "</div>";
  }
  function nhom(ds) {
    return ds.filter(function (g) { return g.the.length; }).map(function (g) {
      return '<h4 class="wd-h">' + esc(g.ten) + '</h4><div class="wd-g">' + g.the.map(o).join("") + "</div>";
    }).join("");
  }
  function css() {
    var s = D.createElement("style");
    s.textContent = ".wd-card summary{cursor:pointer;font-weight:700;font-size:16px}.wd-card summary small{font-weight:500;color:var(--color-fg-muted)}"
      + ".wd-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.wd-tabs button{border:1px solid var(--color-border-line);background:transparent;color:var(--color-fg);border-radius:999px;padding:6px 14px;min-height:36px;cursor:pointer;font:inherit;font-size:13px}"
      + ".wd-tabs button[aria-pressed=true]{background:var(--tvn-gold,#E0A126);border-color:var(--tvn-gold,#E0A126);color:#0E1C38;font-weight:700}"
      + ".wd-h{margin:16px 0 8px;font-size:13px;letter-spacing:.02em;text-transform:uppercase;color:var(--color-fg-muted)}"
      + ".wd-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,13rem),1fr));gap:8px}"
      + ".wd-o{border:1px solid var(--color-border-line);border-radius:12px;padding:10px 12px;min-width:0}"
      + ".wd-t{font-size:12.5px;color:var(--color-fg-muted);line-height:1.35}.wd-s{font-size:20px;font-weight:700;margin:2px 0}.wd-s small{font-size:12px;font-weight:500;color:var(--color-fg-muted)}"
      + ".wd-k{font-size:12px;color:var(--color-fg-muted)}.wd-l{display:block;width:100%;height:26px;margin-top:4px}"
      + ".wd-db tr[data-i]{cursor:pointer}.wd-db td.so{text-align:right;white-space:nowrap}.wd-db tr.ct td{font-size:12.5px;color:var(--color-fg-muted)}";
    D.head.appendChild(s);
  }
  function tongQuan(w) {
    var p = D.getElementById("p1"); if (!p) return;
    var the = 0; ["tt", "kt"].forEach(function (t) { (w[t] || []).forEach(function (g) { the += g.the.length; }); });
    var c = D.createElement("div"); c.className = "vm-chap";
    c.innerHTML = '<details class="card wd-card"><summary>Bảng số vĩ mô đầy đủ <small>' + the + ' chỉ tiêu: lãi suất điều hành, tín dụng, tỷ giá, rổ CPI, đối ngoại, ngân sách, lao động</small></summary>'
      + '<p class="note">Mỗi ô: số mới nhất, kỳ số liệu, thay đổi so với kỳ trước (chỉ tiêu tính bằng % thì so bằng điểm %), đường 24 kỳ gần nhất. Lãi suất và tỷ giá hằng ngày lấy theo số cuối tháng. '
      + NGUON + ", bản chụp " + ngay(String(w.lay_luc || "").slice(0, 10)) + '.</p>'
      + '<div class="wd-tabs" role="group"><button type="button" data-t="tt" aria-pressed="true">Tiền tệ, tỷ giá</button><button type="button" data-t="kt" aria-pressed="false">Kinh tế</button></div><div class="wd-than"></div></details>';
    p.appendChild(c);
    var than = c.querySelector(".wd-than"), chon = function (t) {
      than.innerHTML = nhom(w[t] || []);
      c.querySelectorAll("[data-t]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-t") === t)); });
    };
    c.querySelectorAll("[data-t]").forEach(function (b) { b.addEventListener("click", function () { chon(b.getAttribute("data-t")); }); });
    chon("tt");
  }
  function duBao(w) {
    var p = D.getElementById("p7"), ds = w.du_bao || []; if (!p || !ds.length) return;
    var c = D.createElement("div"); c.className = "vm-chap";
    c.innerHTML = '<div class="card"><h3>Dự báo của các tổ chức</h3><p class="note">Bản mới nhất của mỗi tổ chức (IMF, World Bank, ngân hàng, công ty chứng khoán). Bấm một dòng để xem từng nơi. ' + NGUON + '.</p>'
      + '<div class="scroll"><table class="vt wd-db"><thead><tr><th>Chỉ tiêu</th><th>Năm</th><th>Trung vị</th><th>Thấp – cao</th><th>Số nơi</th></tr></thead><tbody>'
      + ds.map(function (r, i) {
        var pt = r.dv === "%" ? "%" : "";
        return '<tr data-i="' + i + '"><td>' + esc(r.ten) + '</td><td>' + r.nam + '</td><td class="so"><b>' + so(r.trung_vi, le(r.trung_vi)) + pt + '</b></td><td class="so">' + so(r.thap, le(r.thap)) + " – " + so(r.cao, le(r.cao)) + '</td><td class="so">' + r.n + "</td></tr>"
          + '<tr class="ct" data-ct="' + i + '" hidden><td colspan="5">' + r.ds.map(function (x) { return esc(x.to_chuc) + " <b>" + so(x.gt, le(x.gt)) + "</b> (" + ngay(x.ngay) + ")"; }).join(" · ") + "</td></tr>";
      }).join("") + "</tbody></table></div></div>";
    p.appendChild(c);
    c.querySelectorAll("tr[data-i]").forEach(function (tr) {
      tr.addEventListener("click", function () { var x = c.querySelector('tr[data-ct="' + tr.getAttribute("data-i") + '"]'); x.hidden = !x.hidden; });
    });
  }
  function chay() {
    fetch("widata.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (w) {
      if (!w) return; css(); tongQuan(w); duBao(w);
    }).catch(function () {});
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", chay); else chay();
})();
