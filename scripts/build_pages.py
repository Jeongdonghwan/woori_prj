"""키워드 원본 엑셀 → data/site-pages.json (사이트 라우트의 단일 출처) + keywords/우리설비_키워드5500_페이지.xlsx

  python -I scripts/build_pages.py

원본: keywords/우리설비_충청7개지역_키워드5500.xlsx (사용자 제공, 키워드 시트 5,500행)
문의점수: source/keywords_score.xlsx (region_kw_prj 같은 파일의 같은 No 행 값 — 원본에는 점수 열이 없음)

오픈 묶음(wave) — post-launch 규칙: 7일 안 4묶음(누적 25→50→75→100%)
  순서 = 지역 단위(시·군 → 시·군·구 → 생활권 → 동·읍면) → 문의점수 높은 순 → No
  그 순서를 scripts/drip/rebatch.py --plan 25,50,75,100 과 같은 방식으로 자른다.
표기 변형: 붙여쓰기만 다른 키워드는 먼저 나온 행을 대표로 두고 variantOf(canonical·사이트맵 제외).
"""
import json, sys
from collections import Counter
from pathlib import Path
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE)); sys.path.insert(0, str(HERE / 'drip'))
from places_src import places  # noqa: E402
from rebatch import rebatch  # noqa: E402

ROOT = HERE.parent
SRC = ROOT / 'keywords' / '우리설비_충청7개지역_키워드5500.xlsx'
SCORE = ROOT / 'source' / 'keywords_score.xlsx'
OUT_XLSX = ROOT / 'keywords' / '우리설비_키워드5500_페이지.xlsx'
SITE_URL = 'https://woori-demo.example'  # TODO: 도메인 확정 후 lib/site.ts 와 함께 바꿀 것
UNIT_TIER = {'시·군': 1, '시·군·구': 2, '생활권': 3, '동·읍면': 4}

# 엑셀 '단어' → 본문 조합기의 서비스 묶음 (lib/compose.ts SVC 키)
SERVICE = {
    '하수구막힘': '하수구', '하수구뚫는곳': '하수구',
    '변기막힘': '변기막힘', '변기뚫는곳': '변기막힘',
    '싱크대막힘': '싱크대', '씽크대막힘': '싱크대', '싱크대뚫는곳': '싱크대', '씽크대뚫는곳': '싱크대',
    '배관막힘': '배관막힘', '배관뚫는곳': '배관막힘',
    '세면대막힘': '세면대', '세면대뚫는곳': '세면대',
    '누수탐지': '누수', '누수': '누수',
    '고압세척': '고압세척', '변기수리': '변기수리', '배관내시경': '내시경', '배관관로탐지': '내시경',
    '수전교체': '수전교체', '변기교체': '변기교체', '세면대수리': '세면대수리',
}

score = {r[0]: r[2] for r in list(load_workbook(SCORE, read_only=True)['키워드'].iter_rows(values_only=True))[1:] if r[0]}
rows = []
for r in list(load_workbook(SRC, read_only=True)['키워드'].iter_rows(values_only=True))[1:]:
    no, kw, joined, prio, sido, city, label, unit, word, mod = r[:10]
    if not kw:
        continue
    assert label in places, f'지역 데이터 없음: {label} ({kw})'
    assert word in SERVICE, word
    rows.append(dict(n=no, kw=kw, joined=joined, prio=prio, sido=sido, city=city, label=label, unit=unit, word=word, mod=mod or '', score=score[no]))
assert len(rows) == 5500, len(rows)

order = sorted(rows, key=lambda r: (UNIT_TIER[r['unit']], -r['score'], r['n']))
pages, rep = [], {}
for i, r in enumerate(order, 1):
    pg = dict(n=r['n'], no=i, kw=r['kw'], slug=r['kw'].replace(' ', '-'), label=r['label'], place=r['label'], city=r['city'],
              word=r['word'], service=SERVICE[r['word']], mod=r['mod'], unit=r['unit'], score=r['score'], prio=r['prio'], wave=UNIT_TIER[r['unit']])
    if r['joined'] in rep:
        pg['variantOf'] = rep[r['joined']]
    else:
        rep[r['joined']] = pg['slug']
    pages.append(pg)
assert all(v == 1 for v in Counter(p['slug'] for p in pages).values())
rebatch(pages, plan=[25, 50, 75, 100])
json.dump({'pages': pages}, open(ROOT / 'data' / 'site-pages.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

# ---- 키워드 엑셀 (첫 시트 = 키워드 시트, 요약 시트 없음). 행 순서 = 원본 No 순서 ----
wb = Workbook()
ws = wb.active
ws.title = '키워드'
head = ['No', '키워드', '붙여쓰기', '문의점수', '시·군', '지역 표기', '지역 단위', '단어', '수식어', 'URL', '오픈 묶음', '대표 페이지']
ws.append(head)
by_n = {p['n']: p for p in pages}
for r in rows:
    p = by_n[r['n']]
    ws.append([r['n'], r['kw'], r['joined'], r['score'], r['city'], r['label'], r['unit'], r['word'], r['mod'],
               f"{SITE_URL}/{p['slug']}/", p['wave'], p.get('variantOf', '')])
for c in ws[1]:
    c.font = Font(bold=True, color='FFFFFF')
    c.fill = PatternFill('solid', fgColor='1B2B6B')
    c.alignment = Alignment(horizontal='center')
for col, w in zip('ABCDEFGHIJKL', [6, 30, 30, 9, 8, 14, 10, 13, 9, 56, 9, 20]):
    ws.column_dimensions[col].width = w
ws.freeze_panes = 'A2'
ws.auto_filter.ref = f'A1:L{len(rows) + 1}'
wb.save(OUT_XLSX)

sys.stdout.reconfigure(encoding='utf-8')
c = Counter(p['wave'] for p in pages)
acc = 0
for w in sorted(c):
    acc += c[w]
    units = Counter(p['unit'] for p in pages if p['wave'] == w)
    print(f'묶음 {w}: {c[w]} (누적 {acc}) {dict(units)}')
print('표기 변형(variantOf):', sum(1 for p in pages if 'variantOf' in p), '/ 대표 페이지:', sum(1 for p in pages if 'variantOf' not in p))
print('엑셀:', OUT_XLSX.name, len(rows), '행')
