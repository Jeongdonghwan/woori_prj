// 키워드 페이지 title 점검 (2026-11-24) — 빌드 없이 조합기(lib/compose.ts 의 ray)를 직접 돌린다.
//   OPEN_WAVE=<묶음> node scripts/title_check.js
// 기준: title = "{키워드} {h1 수식어} | {상호}", 중복 0, 앞부분 == h1 글자, 앞부분 40자·전체 60자 이하. 어기면 종료 코드 1.
const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const out = path.join(os.tmpdir(), `title_check_${path.basename(process.cwd())}`);
try { execSync(`npx tsc lib/compose.ts --outDir "${out}" --rootDir . --module commonjs --target es2020 --resolveJsonModule --esModuleInterop --skipLibCheck --moduleResolution node`, { stdio: 'ignore' }); } catch (e) { /* 형 검사 경고는 무시(결과 js 는 나온다) */ }
const { OPEN_PAGES } = require(path.join(out, 'lib', 'data.js'));
const { ray } = require(path.join(out, 'lib', 'compose.js'));
const rows = OPEN_PAGES.map((p) => { const r = ray(p); return { title: r.title, h1: `${p.kw} ${r.h1sub}` }; });
const len = rows.map((x) => x.title.length);
const dup = rows.length - new Set(rows.map((x) => x.title)).size;
const diff = rows.filter((x) => x.title.slice(0, x.title.lastIndexOf(' | ')) !== x.h1).length;
const long = rows.filter((x) => x.title.length > 60 || x.h1.length > 40).length;
console.log(`열린 키워드 페이지 ${rows.length} | title 길이 ${Math.min(...len)}~${Math.max(...len)}자 · 중복 ${dup} · h1 과 다른 것 ${diff} · 길이 초과(전체 60·앞 40) ${long}`);
console.log(`예) ${rows[0].title}\n예) ${rows[rows.length - 1].title}`);
process.exit(dup || diff || long ? 1 : 0);
