import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, CITIES, OPEN_PAGES, openCities, cityPages, cityPath, pagePath, pageEncodedPath, inSitemap } from '../lib/data';
import { TOOLS } from '../lib/compose';
import { getPosts, postPath } from '../lib/blog';
import { BRAND, CONTACT, BLOG, shareMeta } from '../lib/site';
import { faqJsonLd, itemListJsonLd } from '../lib/jsonld';
import { Actions, CaseImg, IconArrow, JsonLd, PhotoTop, SectionHead } from '../components/Common';

const HOME_TITLE = `${BRAND} | 천안·아산 하수구·변기·싱크대 막힘 고압세척`;
const HOME_DESC = '천안·아산 하수구·변기·싱크대 막힘, 공용배관 고압세척, 누수탐지. 내시경으로 원인을 보고 작업합니다. 24시간 상담, 당일·야간 출동.';
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESC,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('home', `${BRAND} 천안·아산 배관 막힘`, { title: HOME_TITLE, description: HOME_DESC, url: '/' }),
};

// 블로그 시공 글에 나온 작업 종류 그대로 (글 제목·본문 기준), ph = 그 작업 사진(data/cases.json)
const WORKS = [
  { t: '하수구·바닥 배수구 막힘', d: '화장실 바닥 배수구 역류, 돌·모래·콘크리트 찌꺼기가 걸린 배관, 외부 맨홀까지 이어진 막힘', svc: '하수구', ph: 'w06' },
  { t: '변기·소변기 막힘', d: '물티슈·슬러지로 막힌 변기는 변기를 떼어 오수관을 내시경으로 확인하고, 상가 소변기는 요석을 제거', svc: '변기막힘', ph: 'w44' },
  { t: '싱크대 막힘', d: '아파트·상가 주방 하수관의 기름때와 음식물 찌꺼기를 플렉스샤프트·고압세척으로 걷어 냄', svc: '싱크대', ph: 'w36' },
  { t: '공용배관·오수관 고압세척', d: '상가 지하 공용배관, 음식점 트렌치·그리스통, 아파트 오수배관과 외부 메인 맨홀까지 세척', svc: '고압세척', ph: 'h02' },
  { t: '배관내시경 진단', d: 'RIDGID 손잡이형·모니터형 내시경으로 막힌 위치와 원인을 보여 드리고 작업 뒤 다시 촬영', svc: '내시경', ph: 'w47' },
  { t: '누수탐지', d: '바닥·벽·천장으로 새는 물의 위치를 찾고, 수전·급수 호스·변기 부속·막힘 역류처럼 원인이 된 곳을 고침', svc: '누수', ph: 'w40' },
  { t: '변기 수리 · 세면대 수전 교체', d: '물이 멈추지 않는 변기 볼탑·배수밸브 교체, 하부가 새는 세면대 수전·급수 호스 교체', svc: '변기수리', ph: 'w61' },
  { t: '언 수도 녹임(해빙)', d: '겨울철 외부 노출 배관 동결을 배관 재질에 맞춰 천천히 녹이고 누수·균열을 재점검', svc: '', ph: 'w62' },
];

const FAQ = [
  { q: '어느 지역까지 오나요?', a: '천안 전 지역, 아산 전 지역 출동합니다. 청주·평택·세종·공주·예산은 거리 때문에 출동 가능 여부와 시간을 통화로 먼저 확인합니다.' },
  { q: '비용은 언제 알 수 있나요?', a: '정해진 단가표는 없습니다. 내시경으로 막힌 위치와 원인을 본 뒤 작업 전에 금액을 말씀드리고, 불필요한 공사·추가요금 없이 필요한 작업만 합니다.' },
  { q: '뚫었는데 또 막혀요.', a: '관벽에 붙은 기름·침전물이 그대로 남아 있으면 다시 막힙니다. 원인을 내시경으로 보고, 필요하면 고압세척으로 관 전체와 외부 맨홀까지 씻습니다.' },
  { q: '밤이나 주말에도 오나요?', a: '24시간 상담을 받고, 천안·아산은 당일출동·야간 긴급출동이 가능합니다. 도착 시간은 통화로 정합니다.' },
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
  const svcLink = (svc: string) => OPEN_PAGES.find((p) => inSitemap(p) && p.city === '천안' && p.service === svc && p.unit === '시·군' && !p.mod)
    || OPEN_PAGES.find((p) => inSitemap(p) && p.service === svc);
  const gallery = CASES.filter((_, i) => i % 3 === 0).slice(0, 9);

  return (
    <main>
      <JsonLd data={[faqJsonLd(FAQ), itemListJsonLd(carousel.map((p) => ({ name: p.kw, path: pageEncodedPath(p) })))]} />
      <PhotoTop photo="w03" className="hero hero-home">
        <div className="hero-text">
          <h1><span><i>막힌 원인부터 보고</i></span><span><i>뚫는 {BRAND}</i></span></h1>
          <p className="hero-lead">하수구·변기·싱크대 막힘, 공용배관 고압세척, 누수탐지. RIDGID 배관내시경으로 관 속을 먼저 보여 드리고, 필요한 만큼만 작업한 뒤 다시 촬영해 확인합니다.</p>
          <Actions blog />
        </div>
        <dl className="hero-specs">
          {[['분야', '누수탐지 · 누수보험상담 · 피해복구', 'w37'], ['장비', '배관내시경 · 고압세척기', 'w12'], ['상담', '24시간 · 당일·야간 출동', 'w29']].map(([k, v, ph]) => <div key={k}><CaseImg id={ph} className="spec-ph" lazy={false} /><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </PhotoTop>

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="뚫어도 다시 막히는 이유를 화면으로 보여 드립니다" />
          <div className="cols">
            <div className="prose" data-reveal>
              <p className="first">하수구가 막히면 대부분 뚫어뻥·스프링·약품으로 급하게 물길을 냅니다. 하지만 관벽에 붙은 기름때와 침전물, 모래·시멘트 가루는 그대로 남아 며칠 뒤 같은 자리가 다시 막힙니다.</p>
              <p>{BRAND}는 천안·아산의 아파트, 상가, 회사, 음식점, 주택 현장에서 RIDGID 배관내시경으로 관 속을 먼저 촬영합니다. 원인이 보이면 필요한 구간만 뚫고, 굳은 슬러지는 고압세척으로 관벽째 씻어 내고, 외부 맨홀과 메인 배관까지 흐름을 확인합니다.</p>
              <ol className="why-steps">
                <li><b>원인 촬영</b>배관내시경으로 막힌 위치와 원인을 화면으로 보여 드립니다</li>
                <li><b>필요한 구간만</b>막힌 구간을 뚫고, 굳은 찌꺼기는 고압세척으로 관벽째 씻어 냅니다</li>
                <li><b>다시 촬영</b>작업 뒤 내시경을 다시 넣고 배수 테스트로 확인합니다</li>
              </ol>
            </div>
            <figure className="memo-photo mask" data-reveal>
              <img src="/img/w11.webp" alt={`${BRAND}가 천안 차암동 매장 배관에서 꺼낸 굳은 기름덩어리`} width={CASES[10].w} height={CASES[10].h} loading="lazy" />
              <figcaption>천안 차암동 매장 · 배관을 막고 있던 기름덩어리</figcaption>
            </figure>
          </div>
        </section>

        <section className="sec mist">
          <SectionHead title="하는 일" />
          <ol className="works">
            {WORKS.map((w, i) => {
              const lk = w.svc ? svcLink(w.svc) : undefined;
              return (
                <li key={w.t} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                  <CaseImg id={w.ph} className="works-ph" />
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                  {lk && <Link href={pagePath(lk)} className="more">{lk.kw} 안내 <IconArrow /></Link>}
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <section className="band">
        <div className="wrap">
          <SectionHead title="현장 장비" />
          <ol className="tools reveal-group">{TOOLS.map((t, i) => <li key={t.name}><CaseImg id={t.ph} className="tools-ph" /><h3>{t.name}</h3><p>{t.d[i % 3]('천안·아산', '막힘')}</p></li>)}</ol>
        </div>
      </section>

      <div className="wrap content">
        <section className="sec">
          <SectionHead title="시공 사례" sub="천안·아산에서 작업한 현장입니다." />
          <div className="gallery">
            {gallery.map((k, i) => (
              <figure key={k.id} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                <img src={`/img/${k.id}.webp`} alt={`${BRAND} 시공 사진 - ${k.where} ${k.space}`} loading="lazy" width={k.w} height={k.h} />
                <figcaption><b>{k.where}</b>{k.space}</figcaption>
              </figure>
            ))}
          </div>
          <p className="center" data-reveal><Link href="/cases/" className="more">시공 사례 전체 보기 <IconArrow /></Link></p>
        </section>
      </div>

      <section className="cta-band" data-reveal>
        <div className="wrap"><div className="cta-band-in">
          <p>물이 천천히 내려가고, 냄새가 올라오고, 뚫어도 또 막힌다면<br />관 속부터 확인할 때입니다</p>
          <Actions sms={false} />
        </div></div>
      </section>

      <div className="wrap content">
        <section className="sec mist">
          <SectionHead title="작업 원칙" />
          <ol className="timeline reveal-group">
            {PRINCIPLES.map((x) => <li key={x.t}><strong>{x.t}</strong><p>{x.d}</p></li>)}
          </ol>
        </section>

        <section className="sec">
          <SectionHead title="지역" sub="지역을 고르면 동네별 하수구·변기·싱크대 막힘 안내로 이어집니다." />
          <div className="cities">
            {cities.map((city) => (
              <Link key={city} href={cityPath(city)} className="city-row" data-reveal>
                <div><b>{city}</b><span>{CITIES[city].full}{CITIES[city].served ? '' : ' · 출동 통화 확인'}</span></div>
                <IconArrow />
              </Link>
            ))}
          </div>
          <ul className="linklist cols2">
            {hubs.slice(0, 10).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}
          </ul>
          <p className="center" data-reveal><Link href="/area/" className="more">전체 지역 페이지 <IconArrow /></Link></p>
        </section>

        <section className="sec mist">
          <SectionHead title="자주 묻는 질문" />
          <div className="faq">{FAQ.map((f) => <details key={f.q} data-reveal><summary>{f.q}<i /></summary><p>{f.a}</p></details>)}</div>
        </section>

        <section className="sec">
          <SectionHead title="배관 막힘 궁금증 블로그" sub="막힘 원인, 예방법, 업체 부르기 전 확인할 것처럼 상담 때 자주 받는 질문을 글로 정리합니다." />
          {posts.length > 0
            ? <ul className="linklist narrow">{posts.map((p) => <li key={p.slug}><Link href={postPath(p)}>{p.title}<IconArrow /></Link></li>)}</ul>
            : <p className="prose-p center">첫 글을 준비하고 있습니다. 그동안 <a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그 시공 글</a>을 참고해 주세요.</p>}
          <p className="center" data-reveal><Link href="/blog/" className="more">블로그 글 전체 보기 <IconArrow /></Link></p>
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
