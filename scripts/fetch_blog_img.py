"""블로그 글 사진 받기 → source/blog_img/<logNo>_<n>.jpg  (글마다 고르게 최대 5장, 요청 사이 2.5초, 429면 멈춤)
   python -I scripts/fetch_blog_img.py
"""
import glob, json, sys, time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'source' / 'blog_img'
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as pw:
    rq = pw.request.new_context()
    for f in sorted(glob.glob(str(ROOT / 'source' / 'blog' / '22*.json'))):
        d = json.loads(Path(f).read_text(encoding='utf-8'))
        imgs = d['imgs']
        idx = sorted({round(i * (len(imgs) - 1) / 4) for i in range(5)}) if len(imgs) > 5 else range(len(imgs))
        for i in idx:
            dst = OUT / f"{d['logNo']}_{i:02d}.jpg"
            if dst.exists():
                continue
            r = rq.get(imgs[i])
            if r.status == 429 or r.status >= 400:
                print('중단: 응답', r.status, imgs[i]); sys.exit(1)
            dst.write_bytes(r.body())
            print(dst.name, len(r.body()))
            time.sleep(2.5)
