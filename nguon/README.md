# Nguồn duy nhất của trang Vĩ mô TVN

Từ 03/11/2026, trang Vĩ mô có bốn bản và tất cả được dựng từ thư mục này. Không sửa tay riêng từng bản.

| Bản | Ở đâu | Dựng ra từ |
|---|---|---|
| GitHub | `index.html`, `sw.js` ở gốc kho này | `nguon/data` + mã trong `index.html` |
| Web app | https://claude.ai/artifact/9TF3fiAxhWLBg3JJ4pwn91 | `nguon/data` + `nguon/khung/web.html.txt` |
| Bản offline | https://claude.ai/artifact/S5PDz2x69Nyp79a3rFNze2 | `nguon/data` + `nguon/khung/offline.html.txt` |
| Dashboard | https://claude.ai/artifact/AGyQN82eej4rHWtj8sNhQ1 (bộ `datasets`) | `nguon/data` |

`nguon/data/<bộ>.json` là số liệu gốc, 14 bộ: kpi, gdp, check, credit, people, policy, sectors, forecast, meta, series, i18n, supplyside, kb, model.

Hai bản trên claude.ai dùng đường dẫn clip đầy đủ (`https://jukytwo.github.io/vimo/...`); `dung.py` tự đổi, không ghi đường dẫn đầy đủ vào `nguon/data`.

## Cập nhật số liệu

1. Sửa `nguon/data/<bộ>.json` bằng Python: đọc, sửa đúng dòng theo cặp (table, id), ghi lại với `ensure_ascii=False, indent=1`. Giữ nguyên mọi dòng và trường khác.
2. `python3 nguon/dung.py` ghi số vào `index.html`, đổi bản `sw.js`, xuất `nguon/out/web.html`, `nguon/out/offline.html`, `nguon/out/dashboard/<bộ>.json`.
3. `python3 nguon/dung.py --kiem` phải báo KHỚP.
4. Commit `nguon/data`, `index.html`, `sw.js` (tác giả jukytwo), push lên main.
5. Đăng lên claude.ai (phiên phải đọc artifact trước khi đăng, bằng Artifact action read):
   - Web app: Artifact publish, url web app, file_path `nguon/out/web.html`.
   - Bản offline: Artifact publish, url bản offline, file_path `nguon/out/offline.html`.
   - Dashboard, với mỗi bộ đã đổi: ArtifactData get `datasets/<bộ>` (lấy version và id tài sản cũ trong source.url); Artifact publish url dashboard, asset true, file_path `nguon/out/dashboard/<bộ>.json`; ArtifactData update `datasets/<bộ>` với `{"source": {"kind": "file", "name": "<bộ>.json", "url": "/_blob/<id mới>"}, "updated": {"at": "<giờ ISO +07:00>", "by": "Claude"}}` và if_version; xong mới xóa tài sản cũ.
6. Đối chiếu sau khi đăng: đọc lại hai trang claude.ai, chạy `python3 nguon/dung.py --kiem <web.html đã lưu> <offline.html đã lưu>`.

## Sửa giao diện

- Bản GitHub: sửa `index.html` hoặc các tệp js riêng (`vm-ui.js`, `vm-widata.js`, `khoa-tra-phi.js`).
- Web app và bản offline: sửa `nguon/khung/<bản>.html.txt`, giữ đúng một chỗ `__VM_DATA__`. Đuôi `.txt` để GitHub Pages không chạy khung như một trang.
- Rồi chạy dựng, kiểm, commit, đăng như trên.

## Mã nguồn đọc được (bản cũ)

Bộ mã chưa làm rối nằm trong dashboard, bộ `files` (index.html, tools.js, i18n.js, ux.js, share.js, report.js, qa.js, extra.js) và bộ `kit` (build_app.py, build_offline.py, build_gh.py, protect.py, ...). Bộ này dừng ở khoảng 23/10/2026: thiếu các sửa đổi sau đó (khung TVN Insight, sửa giao diện 27/10, sửa nền tối, Bảng số WiData, kết luận xuống dòng theo câu...). KHÔNG dựng lại trang từ bộ này, vì làm thế sẽ mất các sửa đổi trên. Gộp bộ này về khớp với bản đang chạy là việc của đợt dọn mã tiếp theo.
