"""우리설비 네이버 블로그(gook1008) 글 본문·이미지 주소 수집 → source/blog/<logNo>.json
   python -I scripts/fetch_blog.py            # 우리설비 상호로 쓴 글(2025-12 이후)만
Playwright 기본 UA, 요청 사이 2.5초. 429·차단 페이지가 나오면 그 자리에서 멈춘다(우회하지 않음).
"""
import json, sys, time, datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'source' / 'blog'
posts = json.loads((SRC / 'posts_list.json').read_text(encoding='utf-8'))
since = datetime.datetime(2025, 12, 1).timestamp() * 1000
todo = [p for p in posts if p['addDate'] >= since and not (SRC / f"{p['logNo']}.json").exists()]
print('대상', len(todo))
with sync_playwright() as pw:
    br = pw.chromium.launch()
    pg = br.new_page()
    for p in todo:
        url = f"https://m.blog.naver.com/gook1008/{p['logNo']}"
        r = pg.goto(url, wait_until='domcontentloaded', timeout=30000)
        if r is None or r.status == 429 or r.status >= 400:
            print('중단: 응답', r and r.status, url); break
        try:
            pg.wait_for_selector('.se-main-container, #viewTypeSelector, .post_ct', timeout=15000)
        except Exception:
            print('중단: 본문 없음(차단 가능)', url); break
        data = pg.evaluate("""() => {
          const root = document.querySelector('.se-main-container') || document.querySelector('#viewTypeSelector') || document.body;
          const text = Array.from(root.querySelectorAll('.se-text-paragraph, p')).map(e => e.innerText.trim()).filter(Boolean);
          const imgs = Array.from(root.querySelectorAll('img')).map(i => i.getAttribute('data-lazy-src') || i.getAttribute('src') || '')
            .filter(s => s.includes('pstatic.net') && !s.includes('sticker') && !s.includes('static/'));
          const caps = Array.from(root.querySelectorAll('.se-caption')).map(e => e.innerText.trim());
          const place = Array.from(root.querySelectorAll('.se-map-title, .se-place-title, .se-map-address')).map(e => e.innerText.trim());
          return { text, imgs, caps, place };
        }""")
        data.update(logNo=p['logNo'], title=p['titleWithInspectMessage'], date=datetime.datetime.fromtimestamp(p['addDate'] / 1000).strftime('%Y-%m-%d'), url=url)
        (SRC / f"{p['logNo']}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
        print(p['logNo'], len(data['text']), '문단', len(data['imgs']), '사진', data['title'][:30])
        time.sleep(2.5)
    br.close()
