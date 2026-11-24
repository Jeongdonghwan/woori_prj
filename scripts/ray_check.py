"""키워드 페이지 점검 (h1 수식어·레이 모범 구조, 2026-11-24) — 빌드 결과(out/)를 읽는다.

  python -I scripts/ray_check.py [out] [--group word,mod] [--group2 place]

- 열린 키워드 페이지 전부: h1(키워드+수식어) 중복 수, 수식어 없는 h1 수
- 구조: h2 수, 키워드 전체가 든 h2 수, 절 문단 길이(공백 제외), 본문 글자, 문단(p) 수와 200자당 비율, 본문 내부링크 수
- 같은 문장 비율: 같은 주제(--group 필드가 같은 페이지)끼리 무작위 3,000쌍, 문장 단위 겹침 / 더 짧은 쪽 문장 수
- title: `{키워드} {h1 수식어} | {상호}` — 중복, 앞부분 == h1 글자, 전체 40자 이하(넘으면 상호 없이)
- description: 길이 45~80자(공백 포함)·중복 (composer-patterns §5-3)
- 조사 의심: 받침과 안 맞는 을/를·과/와·은·으로
기준: h1 중복 0, description 45~80자·중복 0, 같은 주제 같은 문장 최대 30% 이하, 조사 의심 0. 하나라도 어기면 종료 코드 1.
"""
import html, json, os, random, re, sys
from collections import Counter

for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding='utf-8')
    except Exception: pass
args = sys.argv[1:]
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
pos = [a for i, a in enumerate(args) if not a.startswith('--') and (i == 0 or not args[i - 1].startswith('--'))]
root = pos[0] if pos else 'out'
G1 = opt('--group', 'word,mod').split(',')
G2 = opt('--group2', 'place').split(',')
pages = [p for p in json.load(open('data/site-pages.json', encoding='utf-8'))['pages'] if os.path.exists(os.path.join(root, p['slug'], 'index.html'))]

tag = lambda t: html.unescape(re.sub(r'<[^>]+>', '', t)).strip()
nsp = lambda t: len(re.sub(r'\s', '', t))


def read(p):
    t = open(os.path.join(root, p['slug'], 'index.html'), encoding='utf-8').read()
    tm = re.search(r'<title>(.*?)</title>', t, re.S)
    title = html.unescape(tm.group(1)) if tm else ''
    dm = re.search(r'<meta name="description" content="([^"]*)"', t)
    desc = html.unescape(dm.group(1)) if dm else ''
    m = re.search(r'<main[^>]*>(.*?)</main>', t, re.S)
    main = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', m.group(1), flags=re.S)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', main, re.S).group(1)
    sub = re.search(r'class="hero-sub"[^>]*>(.*?)</span>', h1, re.S)
    h2 = [tag(x) for x in re.findall(r'<h2[^>]*>(.*?)</h2>', main, re.S)]
    art = re.search(r'class="ray-article"[^>]*>(.*?)</article>', main, re.S)
    secp = [tag(x) for x in re.findall(r'<p[^>]*>(.*?)</p>', art.group(1), re.S)] if art else []
    ps = [tag(x) for x in re.findall(r'<p[^>]*>(.*?)</p>', main, re.S)]
    body = tag(re.sub(r'<(nav|figure)[^>]*>.*?</\1>', ' ', main, flags=re.S))
    links = re.findall(r'<a [^>]*href="/[^"]*"', re.sub(r'<nav[^>]*>.*?</nav>', '', main, flags=re.S))
    text = ' '.join(ps + [tag(x) for x in re.findall(r'<summary[^>]*>(.*?)</summary>', main, re.S)])
    sents = {x.strip() for x in re.split(r'(?<=[.?!])\s+', text) if len(x.strip()) > 12}
    return dict(title=title, desc=desc, h1=tag(h1), sub=bool(sub), h2=h2, secp=secp, p=len(ps), body=nsp(body), links=len(links), sents=sents, text=text)


R = {p['slug']: read(p) for p in pages}
n = len(pages)
h1c = Counter(r['h1'] for r in R.values())
dup = sum(1 for v in h1c.values() if v > 1)
nosub = sum(1 for r in R.values() if not r['sub'])
avg = lambda a: sum(a) / len(a) if a else 0
kwh2 = [sum(1 for h in R[p['slug']]['h2'] if p['kw'] in h) for p in pages]
lens = [nsp(x) for r in R.values() for x in r['secp']]
print(f'열린 키워드 페이지 {n} | h1 중복 {dup} | 수식어 없는 h1 {nosub}')
tl = [len(r['title']) for r in R.values()]
tdup = n - len({r['title'] for r in R.values()})
tdiff = sum(1 for r in R.values() if r['title'].split(' | ')[0] != r['h1'])
tlong = sum(1 for r in R.values() if len(r['title']) > 40)
print(f'title 길이 {min(tl)}~{max(tl)}자 · 중복 {tdup} · h1 과 다른 것 {tdiff} · 40자 초과 {tlong}')
dl = [len(r['desc']) for r in R.values()]
dbad = sum(1 for x in dl if x < 45 or x > 80)
ddup = n - len({r['desc'] for r in R.values()})
print(f'description 길이 {min(dl)}~{max(dl)}자 · 범위 밖 {dbad} · 중복 {ddup}')
print(f'h2 평균 {avg([len(r["h2"]) for r in R.values()]):.1f} | 키워드 든 h2 평균 {avg(kwh2):.1f} | 절 문단 {avg([len(r["secp"]) for r in R.values()]):.1f}개')
if lens:
    s = sorted(lens); print(f'절 문단 길이(공백 제외) 평균 {avg(lens):.0f} · 10% {s[len(s) // 10]} · 90% {s[len(s) * 9 // 10]} · 최소 {s[0]} · 최대 {s[-1]}')
print(f'본문 글자 평균 {avg([r["body"] for r in R.values()]):.0f} | p 평균 {avg([r["p"] for r in R.values()]):.1f} (200자당 {avg([r["p"] / (r["body"] / 200) for r in R.values()]):.2f}) | 본문 내부링크 평균 {avg([r["links"] for r in R.values()]):.1f} (최소 {min(r["links"] for r in R.values())} 최대 {max(r["links"] for r in R.values())})')


def share(a, b):
    A, B = R[a]['sents'], R[b]['sents']
    return len(A & B) / max(1, min(len(A), len(B)))


random.seed(7)
worst_all = 0
for name, keys in (('같은 주제(' + ','.join(G1) + ')', G1), ('같은 ' + ','.join(G2), G2)):
    g = {}
    for p in pages: g.setdefault(tuple(p.get(k, '') for k in keys), []).append(p['slug'])
    gs = [v for v in g.values() if len(v) > 1]
    if not gs: print(name, '묶음 없음'); continue
    v = []
    for _ in range(3000):
        x = random.choice(gs); a, b = random.sample(x, 2); v.append((share(a, b), a, b))
    v.sort(reverse=True)
    print(f'{name} 같은 문장: 평균 {avg([x[0] for x in v]) * 100:.1f}% · 최대 {v[0][0] * 100:.1f}% ({v[0][1]} / {v[0][2]})')
    if keys is G1: worst_all = v[0][0]

OKW = re.compile(r'(마을|가을|효과|결과|사과|도로|경로|통로|관로|진로|수로|배수로|좁은|같은|작은|많은|낮은|높은|깊은|넓은|짧은|좋은|늦은|굳은|남은|묵은|모은|지은|나은|부은)$')
fc = lambda ch: (ord(ch) - 0xAC00) % 28 if 0xAC00 <= ord(ch) <= 0xD7A3 else -1
bad = Counter()
for r in R.values():
    for w, js in re.findall(r'([가-힣]+?)(을|를|과|와|은|으로)(?=[\s.,·)\'"])', r['text'] + ' ' + ' '.join(r['h2']) + ' ' + r['h1']):
        if OKW.search(w + js): continue
        f = fc(w[-1])
        if (js in '을과은' and f == 0) or (js in '를와' and f > 0) or (js == '으로' and f in (0, 8)): bad[w + js] += 1
print('조사 의심', dict(bad.most_common(20)) if bad else 0)
ok = tdup == 0 and tdiff == 0 and tlong == 0 and dup == 0 and nosub == 0 and dbad == 0 and ddup == 0 and worst_all <= .30 and not bad
print('판정:', '통과' if ok else '미달')
sys.exit(0 if ok else 1)
