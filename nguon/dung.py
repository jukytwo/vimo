"""Dựng trang Vĩ mô TVN từ MỘT nguồn: nguon/data/*.json (số liệu) và khung trang hiện hành.

Chạy từ gốc kho vimo:
  python3 nguon/dung.py            dựng: ghi số liệu vào index.html, đổi bản sw.js, xuất
                                   nguon/out/web.html, nguon/out/offline.html (để đăng lên hai
                                   trang claude.ai) và nguon/out/dashboard/<bộ>.json (để đăng lên dashboard)
  python3 nguon/dung.py --kiem [web.html] [offline.html] [thư mục json dashboard]
                                   chỉ đối chiếu: số liệu trong index.html (và các bản đưa vào)
                                   có đúng bằng nguon/data hay không; không ghi gì.

Quy tắc: muốn đổi số thì sửa nguon/data/<bộ>.json rồi chạy dựng; không vá tay vào từng bản.
Muốn đổi mã giao diện của web app hay bản offline thì sửa nguon/khung/<bản>.html.txt
(giữ nguyên chỗ __VM_DATA__), của bản GitHub thì sửa index.html; rồi chạy dựng.
"""
import json, os, re, sys, time
from datetime import datetime, timedelta, timezone

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = os.path.join(GOC, "nguon")
THU_TU = ["kpi", "gdp", "check", "credit", "people", "policy", "sectors", "forecast",
          "meta", "series", "i18n", "supplyside", "kb", "model"]
PAT = re.compile(r'(<script type="application/json" id="vm-data">)(.*?)(</script>)', re.S)
GH = "https://jukytwo.github.io/vimo/"


def doc_data():
    return {k: json.load(open(os.path.join(N, "data", k + ".json"), encoding="utf-8")) for k in THU_TU}


def ban_claude(ds):
    """Bản trên claude.ai không có thư mục clip/ và audio/ đi kèm: đường dẫn clip phải là địa chỉ đầy đủ."""
    ds = json.loads(json.dumps(ds))
    for r in ds["meta"]:
        if r.get("series") in ("sx", "tt"):
            for k in ("file", "file_vi"):
                v = r.get(k)
                if v and not v.startswith("http"):
                    r[k] = GH + v
    return ds


def khoi(ds):
    return json.dumps({"datasets": ds}, ensure_ascii=False).replace("</", "<\\/")


def doc_khoi(html):
    ms = list(PAT.finditer(html))
    assert len(ms) == 1, f"phải có đúng 1 khối vm-data, thấy {len(ms)}"
    return json.loads(ms[0].group(2).replace("<\\/", "</"))["datasets"]


def gan(html, ds):
    ms = list(PAT.finditer(html))
    assert len(ms) == 1, f"phải có đúng 1 khối vm-data, thấy {len(ms)}"
    return html[:ms[0].start(2)] + khoi(ds) + html[ms[0].end(2):]


def dung():
    ds = doc_data()
    # bản GitHub
    p = os.path.join(GOC, "index.html")
    moi = gan(open(p, encoding="utf-8").read(), ds)
    open(p, "w", encoding="utf-8").write(moi)
    ver = (datetime.now(timezone.utc) + timedelta(hours=7)).strftime("%Y%m%d%H%M")
    sw = os.path.join(GOC, "sw.js")
    s = open(sw, encoding="utf-8").read()
    s2 = re.sub(r"tvn-vimo-\d{12}", "tvn-vimo-" + ver, s)
    assert s2 != s or "tvn-vimo-" + ver in s, "không thấy chuỗi tvn-vimo-<số> trong sw.js"
    open(sw, "w", encoding="utf-8").write(s2)
    # hai bản trên claude.ai
    out = os.path.join(N, "out"); os.makedirs(os.path.join(out, "dashboard"), exist_ok=True)
    dc = ban_claude(ds)
    for ten in ("web", "offline"):
        k = open(os.path.join(N, "khung", ten + ".html.txt"), encoding="utf-8").read()
        assert k.count("__VM_DATA__") == 1, ten
        open(os.path.join(out, ten + ".html"), "w", encoding="utf-8").write(k.replace("__VM_DATA__", khoi(dc)))
    # dashboard: mỗi bộ một tệp JSON (đăng làm tài sản rồi trỏ datasets/<bộ>.source.url tới nó).
    # Dashboard giữ đường dẫn clip tương đối như bản GitHub.
    for k, v in ds.items():
        json.dump(v, open(os.path.join(out, "dashboard", k + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Đã dựng: index.html, sw.js (tvn-vimo-%s), nguon/out/web.html, nguon/out/offline.html, nguon/out/dashboard/*.json" % ver)


def kiem(args):
    ds = doc_data(); loi = 0
    def so(ten, a, b):
        nonlocal loi
        for k in THU_TU:
            if a.get(k) != b.get(k):
                loi += 1; print(f"LỆCH  {ten}: bộ {k}")
        if not any(a.get(k) != b.get(k) for k in THU_TU):
            print(f"KHỚP  {ten}")
    so("index.html (GitHub)", doc_khoi(open(os.path.join(GOC, "index.html"), encoding="utf-8").read()), ds)
    dc = ban_claude(ds)
    for a in args:
        if os.path.isdir(a):
            b = {k: json.load(open(os.path.join(a, k + ".json"), encoding="utf-8")) for k in THU_TU
                 if os.path.exists(os.path.join(a, k + ".json"))}
            so("dashboard " + a, b, {k: ds[k] for k in b})
        else:
            so(a, doc_khoi(open(a, encoding="utf-8").read()), dc)
    sys.exit(1 if loi else 0)


if __name__ == "__main__":
    if "--kiem" in sys.argv:
        kiem([a for a in sys.argv[1:] if a != "--kiem"])
    else:
        dung()
