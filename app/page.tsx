import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, CITIES, OPEN_PAGES, openCities, cityPages, cityPath, pagePath, pageEncodedPath, inSitemap } from '../lib/data';
import { TOOLS } from '../lib/compose';
import { getPosts, postPath } from '../lib/blog';
import { BRAND, CONTACT, BLOG, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead, Ticker } from '../components/Common';

const HOME_TITLE = `${BRAND} | 천안·아산 하수구·변기·싱크대 막힘 고압세척`;
const HOME_DESC = '천안·아산 하수구 막힘, 변기·싱크대 막힘, 공용배관 고압세척. RIDGID 배관내시경으로 원인을 보고 필요한 만큼만 작업한 뒤 다시 촬영해 확인합니다. 24시간 상담, 당일·야간 긴급출동.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 천안·아산 배관 막힘`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 블로그 '우리설비' 글에 나온 작업 종류 그대로 (글 제목·본문 기준)
const WORKS = [
  { t: '하수구·바닥 배수구 막힘', d: '화장실 바닥 배수구 역류, 돌·모래·콘크리트 찌꺼기가 걸린 배관, 외부 맨홀까지 이어진 막힘', svc: '하수구' },
  { t: '변기·소변기 막힘', d: '물티슈·슬러지로 막힌 변기는 변기를 떼어 오수관을 내시경으로 확인하고, 상가 소변기는 요석을 제거', svc: '변기막힘' },
  { t: '싱크대 막힘', d: '아파트·상가 주방 하수관의 기름때와 음식물 찌꺼기를 플렉스샤프트·고압세척으로 걷어 냄', svc: '싱크대' },
  { t: '공용배관·오수관 고압세척', d: '상가 지하 공용배관, 음식점 트렌치·그리스통, 아파트 오수배관과 외부 메인 맨홀까지 세척', svc: '고압세척' },
  { t: '배관내시경 진단', d: 'RIDGID 손잡이형·모니터형 내시경으로 막힌 위치와 원인을 보여 드리고 작업 뒤 다시 촬영', svc: '내시경' },
  { t: '변기 수리 · 세면대 수전 교체', d: '물이 멈추지 않는 변기 볼탑·배수밸브 교체, 하부가 새는 세면대 수전·급수 호스 교체', svc: '변기수리' },
  { t: '언 수도 녹임(해빙)', d: '겨울철 외부 노출 배관 동결을 배관 재질에 맞춰 천천히 녹이고 누수·균열을 재점검', svc: '' },
];

const FAQ = [
  { q: '어느 지역까지 오나요?', a: '블로그에 천안 전 지역, 아산 전 지역 출동으로 적어 두었습니다. 청주·평택·세종·공주·예산은 거리 때문에 출동 가능 여부와 시간을 통화로 먼저 확인합니다.' },
  { q: '비용은 언제 알 수 있나요?', a: '정해진 단가표는 없습니다. 내시경으로 막힌 위치와 원인을 본 뒤 작업 전에 금액을 말씀드리고, 불필요한 공사·추가요금 없이 필요한 작업만 합니다.' },
  { q: '뚫었는데 또 막혀요.', a: '관벽에 붙은 기름·침전물이 그대로 남아 있으면 다시 막힙니다. 원인을 내시경으로 보고, 필요하면 고압세척으로 관 전체와 외부 맨홀까지 씻습니다.' },
  { q: '밤이나 주말에도 오나요?', a: '24시간 상담을 받고, 천안·아산은 당일출동·야간 긴급출동이 가능하다고 블로그에 안내하고 있습니다. 도착 시간은 통화로 정합니다.' },
  { q: '작업 결과를 확인할 수 있나요?', a: '작업 전·후 사진과 내시경 화면을 직접 보여 드립니다. 원인 확인 → 제거 → 재확인 순서로 진행합니다.' },
];

const PRINCIPLES = [
  { t: '사장 직접 출동', d: '상담한 사람이 현장에 와서 상태 설명부터 마무리까지 책임지고 진행합니다.' },
  { t: '내시경 촬영 후 진단', d: '무작정 뚫지 않고 관 속을 먼저 촬영해 막힌 위치와 원인을 보여 드립니다.' },
  { t: '필요한 작업만', d: '타일 철거·배관 교체 같은 불필요한 공사와 과잉 견적 없이 원인 구간만 처리합니다.' },
  { t: '외부 라인까지', d: '실내만 뚫고 끝내지 않고 외부 맨홀·메인 배관까지 흐름을 확인합니다.' },
  { t: '다시 촬영해 확인', d: '작업 뒤 내시경을 다시 넣고 배수 테스트로 역류·악취가 멈췄는지 확인합니다.' },
];

export default function Home() {
  const cities = openCities();
  const posts = getPosts().slice(0, 5);
  const hubs = OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시·군' && !p.mod).slice(0, 30);
  const carousel = hubs.length >= 10 ? hubs : OPEN_PAGES.filter(inSitemap).slice(0, 30);
  const logs = new Set(CASES.map((c) => c.logNo)).size;
  const svcLink = (svc: string) => OPEN_PAGES.find((p) => inSitemap(p) && p.city === '천안' && p.service === svc && p.unit === '시·군' && !p.mod)
    || OPEN_PAGES.find((p) => inSitemap(p) && p.service === svc);
  const tickerNames = ['천안', '아산', '불당동', '두정동', '성정동', '쌍용동', '백석동', '신방동', '차암동', '구성동', '목천읍', '성거읍', '입장면', '배방읍', '탕정', '모종동', '음봉면', '둔포', '인주'];

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(carousel.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />
      <section className="hero hero-home">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow">천안 · 아산 하수구 막힘 · 고압세척</p>
            <h1><span><i>막힌 원인부터 보고</i></span><span><i>뚫는 {BRAND}</i></span></h1>
            <p className="hero-lead">하수구·변기·싱크대 막힘과 공용배관 고압세척. RIDGID 배관내시경으로 관 속을 먼저 보여 드리고, 필요한 만큼만 작업한 뒤 다시 촬영해 확인합니다.</p>
            <Actions blog />
            <dl className="hero-specs">
              {[['지역', '천안·아산 전 지역'], ['장비', '배관내시경 · 고압세척기'], ['상담', '24시간 · 당일·야간 출동']].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
          <figure className="hero-photo mask">
            <img src="/img/w03.webp" alt={`${BRAND} 기사가 천안 불당동 매장 외부 맨홀 옆에 배관내시경을 세팅한 모습`} width={CASES[2].w} height={CASES[2].h} />
            <figcaption><b>블로그 시공 사진</b>천안 불당동 매장 · 2025.12.03</figcaption>
          </figure>
        </div>
      </section>

      <section className="stats-band">
        <dl className="wrap stats">
          <div><dt>블로그 시공 글</dt><dd><span data-count={logs}>{logs}</span>편</dd></div>
          <div><dt>현장 사진</dt><dd><span data-count={CASES.length}>{CASES.length}</span>장</dd></div>
          <div><dt>현장 장비</dt><dd><span data-count={TOOLS.length}>{TOOLS.length}</span>종</dd></div>
          <div><dt>지역 안내</dt><dd><span data-count={OPEN_PAGES.length}>{OPEN_PAGES.length.toLocaleString()}</span>쪽</dd></div>
        </dl>
      </section>

      <Ticker items={tickerNames} />

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="01" title="뚫어도 다시 막히는 이유를 화면으로 보여 드립니다" />
          <div className="cols">
            <div className="prose" data-reveal>
              <p className="first">하수구가 막히면 대부분 뚫어뻥·스프링·약품으로 급하게 물길을 냅니다. 하지만 관벽에 붙은 기름때와 침전물, 모래·시멘트 가루는 그대로 남아 며칠 뒤 같은 자리가 다시 막힙니다.</p>
              <p>{BRAND}는 천안·아산의 아파트, 상가, 회사, 음식점, 주택 현장에서 RIDGID 배관내시경으로 관 속을 먼저 촬영합니다. 원인이 보이면 필요한 구간만 뚫고, 굳은 슬러지는 고압세척으로 관벽째 씻어 내고, 외부 맨홀과 메인 배관까지 흐름을 확인합니다.</p>
              <p>블로그(blog.naver.com/gook1008)에 현장마다 작업 전·후 사진과 내시경 화면을 올려 두었습니다. 이 사이트의 시공 사진은 모두 그 글에서 가져왔습니다.</p>
            </div>
            <figure className="memo-photo mask" data-reveal>
              <img src="/img/w11.webp" alt={`${BRAND}가 천안 차암동 매장 배관에서 꺼낸 굳은 기름덩어리`} width={CASES[10].w} height={CASES[10].h} loading="lazy" />
              <figcaption>천안 차암동 매장 · 배관을 막고 있던 기름덩어리</figcaption>
            </figure>
          </div>
        </section>

        <section className="sec mist">
          <SectionHead no="02" title="하는 일" sub="블로그 '우리설비' 시공 글에 올라온 작업입니다." />
          <ol className="works">
            {WORKS.map((w, i) => {
              const lk = w.svc ? svcLink(w.svc) : undefined;
              return (
                <li key={w.t} data-reveal style={{ transitionDelay: `${(i % 2) * 80}ms` }}>
                  <span className="works-no">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3>{w.t}</h3><p>{w.d}</p>{lk && <Link href={pagePath(lk)} className="more">{lk.kw} 안내 <IconArrow /></Link>}</div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead no="03" title="현장 장비" sub="블로그 글과 사진에 나오는 장비입니다." />
          <ol className="tools reveal-group">{TOOLS.map((t, i) => <li key={t.name}><div><h3>{t.name}</h3><p>{t.d[i % 3]('천안·아산', '막힘')}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="cta-band" data-reveal>
        <div className="wrap cta-band-in">
          <p>물이 천천히 내려가고, 냄새가 올라오고, 뚫어도 또 막힌다면<br />관 속부터 확인할 때입니다</p>
          <Actions sms={false} />
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead no="04" title="블로그 시공 사례" sub="2025년 12월부터 블로그에 올린 천안·아산 현장입니다." />
          <div className="rail-nav">
            <button type="button" data-scroll="-1" data-target="case-rail" aria-label="이전 사진">←</button>
            <button type="button" data-scroll="1" data-target="case-rail" aria-label="다음 사진">→</button>
          </div>
          <div className="rail" id="case-rail">
            {CASES.filter((_, i) => i % 3 === 0).slice(0, 14).map((k, i) => (
              <figure key={k.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <div className="ph"><img src={`/img/${k.id}.webp`} alt={`${BRAND} 시공 사진 - ${k.where} ${k.space}`} loading="lazy" width={k.w} height={k.h} /></div>
                <figcaption><b>{k.where}</b>{k.space}</figcaption>
              </figure>
            ))}
          </div>
          <p data-reveal><Link href="/cases/" className="more">시공 사례 전체 보기 <IconArrow /></Link></p>
        </section>

        <section className="sec mist">
          <SectionHead no="05" title="작업 원칙" sub="블로그에 적어 둔 우리설비 작업 원칙입니다." />
          <ol className="timeline reveal-group">
            {PRINCIPLES.map((x) => <li key={x.t}><strong>{x.t}</strong><p>{x.d}</p></li>)}
          </ol>
        </section>

        <section className="sec">
          <SectionHead no="06" title="지역" sub="지역을 고르면 동네별 하수구·변기·싱크대 막힘 안내로 이어집니다." />
          <div className="cities">
            {cities.map((city) => (
              <Link key={city} href={cityPath(city)} className="city-row" data-reveal>
                <div><b>{city}</b><span>{CITIES[city].full}{CITIES[city].served ? '' : ' · 출동 통화 확인'}</span></div>
                <em>{cityPages(city).length.toLocaleString()}</em>
              </Link>
            ))}
          </div>
          <ul className="linklist" style={{ marginTop: 28 }}>
            {hubs.slice(0, 10).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
          </ul>
          <p data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>

        <section className="sec mist">
          <SectionHead no="07" title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec">
          <SectionHead no="08" title="배관 막힘 궁금증 블로그" sub="막힘 원인, 예방법, 업체 부르기 전 확인할 것처럼 상담 때 자주 받는 질문을 글로 정리합니다." />
          {posts.length > 0
            ? <ul className="linklist">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)}</ul>
            : <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 <a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그 시공 글</a>을 참고해 주세요.</p>}
          <p data-reveal><Link href="/blog/" className="more">블로그 글 전체 보기 <IconArrow /></Link></p>
        </section>
      </div>

      <section className="closing">
        <div className="wrap" data-reveal>
          <h2>주소와 막힌 곳만 알려 주세요</h2>
          <p>{CONTACT.hours}. 막힌 배수구 사진을 문자로 먼저 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </div>
      </section>
    </main>
  );
}
