/* Khóa phần trả phí của Vĩ mô (anh Vũ duyệt mở bán từng phần 23/10/2026; chốt chia 24/10 thư i-20261023-v4mp, i-20261024-k7pz).
 * Miễn phí: 01 Tổng quan, 03 Chiếc bánh C+G+I+NX (và 03b, Clip). Gói TVN-Trading (quyền vi_mo_full): 02, 04–09, các nút Báo cáo PDF,
 * Ảnh 1 trang, Xuất Excel, In và PDF 1 trang, bộ báo cáo tổng thể, xuất kịch bản. Hỏi đáp: chỉ quyền hoi_dap_full ("tk miễn phí ko
 * được hỏi đáp ở bất cứ trang nào").
 * Đăng nhập dùng chung ba app qua https://taikhoan.103-110-85-100.sslip.io/tvn-auth.js (data-app="vimo").
 * BẬT: tự bật lúc 17:30 thứ Hai 26/10/2026 (sau bản chốt phiên 17:00), cùng TVN Insight và Hub. Trước đó chỉ chạy khi mở ?thu=1
 * (nhớ trong máy; tắt ?thu=0). Cần lùi ngày bật hoặc tắt khẩn: sửa dòng BAT dưới đây.
 * Lưu ý: đây là khóa giao diện; số liệu các mục trả phí vẫn nằm trong mã trang cho tới khi tách sang /api/p/vi_mo (việc sau ngày bật).
 * Tệp riêng, nạp bằng một thẻ <script src="khoa-tra-phi.js" defer> cuối index.html: bản dựng mới của Vĩ mô phải giữ thẻ này.
 */
(function () {
  "use strict";
  // Hủy tự bật 17:30 26/10 (anh Vũ 25/10/2026, thư i-20261025-mo9k): mở toàn bộ tới khi hoàn thiện; bật lại theo thư hẹn giờ mới.
  var BAT = false;
  var q = new URLSearchParams(location.search);
  try { if (q.get("thu") === "1") localStorage.setItem("tvn_thu", "1"); if (q.get("thu") === "0") localStorage.removeItem("tvn_thu"); } catch (e) { /* bỏ */ }
  var thu = false;
  try { thu = localStorage.getItem("tvn_thu") === "1"; } catch (e) { /* bỏ */ }
  if (!BAT && !thu) return;
  var nhung = q.get("embed") === "1";
  try { nhung = nhung || window.self !== window.top; } catch (e) { nhung = true; }
  var MIEN_PHI = { p1: 1, p2: 1, p10: 1, p11: 1 };
  var NUT = "#vm-report,#vm-onepage,#vm-excel,#vm-print,#vm-a4pdf,#vm-tong summary,#vm-tong a,.sim-xb";
  var A = null;

  var css = document.createElement("style");
  css.textContent = ".tvnK-khoa>:not(.tvnK-o){display:none!important}.tvnK-o{margin:12px 0 18px}.vm-tab .tvnK-i{margin-left:4px;font-size:.85em;opacity:.8}" +
    ".tvnK-nen{position:fixed;inset:0;z-index:2147483002;background:rgba(10,18,35,.55);display:flex;align-items:center;justify-content:center;padding:16px}" +
    ".tvnK-hop{width:100%;max-width:420px;position:relative}.tvnK-x{position:absolute;top:6px;right:10px;background:none;border:0;font-size:22px;cursor:pointer;color:#5b667a;z-index:1}";
  document.head.appendChild(css);

  function co(qq) { return !!(A && A.co(qq)); }
  function hopKhoa(quyen) {
    var n = document.createElement("div"); n.className = "tvnK-nen";
    n.innerHTML = "<div class='tvnK-hop'><button type='button' class='tvnK-x' aria-label='Đóng'>×</button><div></div></div>";
    n.addEventListener("click", function (e) { if (e.target === n || e.target.className === "tvnK-x") n.remove(); });
    document.body.appendChild(n);
    if (A) A.khoa(n.querySelector(".tvnK-hop>div"), quyen, quyen === "hoi_dap_full" ? {} : { tieu_de: "Xuất báo cáo dành cho gói TVN-Trading" });
  }
  function apDung() {
    var vm = co("vi_mo_full");
    document.querySelectorAll(".vm-tab[data-page]").forEach(function (t) {
      var khoa = !vm && !MIEN_PHI[t.dataset.page], i = t.querySelector(".tvnK-i");
      if (khoa && !i) { i = document.createElement("span"); i.className = "tvnK-i"; i.textContent = "🔒"; t.appendChild(i); }
      if (!khoa && i) i.remove();
    });
    document.querySelectorAll("section.vm-page[id]").forEach(function (s) {
      var khoa = !vm && !MIEN_PHI[s.id], o = s.querySelector(":scope>.tvnK-o");
      s.classList.toggle("tvnK-khoa", khoa);
      if (khoa && !o) {
        o = document.createElement("div"); o.className = "tvnK-o"; s.insertBefore(o, s.firstChild);
        var tab = document.getElementById("tab-" + s.id), ten = "";
        if (tab) { var c = tab.cloneNode(true); c.querySelectorAll(".n,.new,.tvnK-i").forEach(function (x) { x.remove(); }); ten = c.textContent.trim(); }
        A.khoa(o, "vi_mo_full", { tieu_de: (ten ? ten + ": " : "") + "dành cho gói TVN-Trading",
          mo_ta: "Bản miễn phí xem được 01 Tổng quan và 03 Chiếc bánh. Gói TVN-Trading 3 tháng, 3 triệu đồng mở đủ các mục phân tích, dự báo, kịch bản, xuất báo cáo và Hỏi đáp." });
      }
      if (!khoa && o) o.remove();
    });
    var hd = co("hoi_dap_full");
    document.querySelectorAll(".qa-home-h").forEach(function (h) {
      var box = h.parentElement; if (!box) return;
      box.classList.toggle("tvnK-khoa", !hd);
      var o = box.querySelector(":scope>.tvnK-o");
      if (!hd && !o) { o = document.createElement("div"); o.className = "tvnK-o"; box.insertBefore(o, box.firstChild); A.khoa(o, "hoi_dap_full"); }
      if (hd && o) o.remove();
    });
  }
  // Chặn nút xuất báo cáo và nút Hỏi đáp trước khi mã của trang xử lý (bắt ở pha capture)
  document.addEventListener("click", function (e) {
    if (!A) return;
    var t = e.target.closest ? e.target.closest(NUT + ",.qa-fab") : null;
    if (!t) return;
    var quyen = t.classList.contains("qa-fab") ? "hoi_dap_full" : "vi_mo_full";
    if (co(quyen)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var d = t.closest("details"); if (d) d.open = false;
    hopKhoa(quyen);
  }, true);

  var cho = null;
  new MutationObserver(function () { if (A && !cho) cho = setTimeout(function () { cho = null; apDung(); }, 150); })
    .observe(document.documentElement, { childList: true, subtree: true });

  var s = document.createElement("script");
  s.src = "https://taikhoan.103-110-85-100.sslip.io/tvn-auth.js";
  s.dataset.app = "vimo";
  if (nhung) s.dataset.dai = "0"; else s.dataset.chip = "#tvnF-chip, .vm-top";   // khung chung TVN Insight (tvn-khung.js) có chỗ cho nút tài khoản
  s.onload = function () { A = window.TVNAuth; if (A) A.theo(apDung); };
  s.onerror = function () { /* máy chủ tài khoản không tải được: coi như khách */ A = { co: function () { return false; }, khoa: function (el) { el.innerHTML = "<div style='border:1px dashed #C9A227;border-radius:14px;padding:16px;text-align:center'>🔒 Phần này dành cho gói TVN-Trading. Đăng ký: <a href='tel:0938004541'>093 800 4541</a></div>"; } }; apDung(); };
  document.body.appendChild(s);
})();
