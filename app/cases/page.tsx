import type { Metadata } from 'next';
import Link from 'next/link';
import { CASES, OPEN_PAGES, inSitemap, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd } from '../../components/Common';
import { BRAND, SITE_URL, shareMeta } from '../../lib/site';

const posts = Array.from(new Set(CASES.map((c) => c.logNo))).map((log) => CASES.filter((c) => c.logNo === log));
const TITLE = `시공 사례 | ${BRAND} 천안·아산 하수구·변기·싱크대 막힘`;
const DESC = `${BRAND} 네이버 블로그 시공 글 ${posts.length}편의 현장 사진 ${CASES.length}장. 배관내시경으로 원인을 보고 고압세척·변기 탈거·플렉스샤프트로 막힘을 해결한 과정을 사진으로 봅니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/cases/' },
  ...shareMeta('cases', `${BRAND} 시공 사례`, { title: TITLE, description: DESC, url: '/cases/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');
// 사진의 장소·서비스로 이어지는 열린 대표 페이지 하나
const linkFor = (place: string | null, tag: string, city: string) =>
  (place && OPEN_PAGES.find((p) => inSitemap(p) && p.place === place && p.service === tag))
  || OPEN_PAGES.find((p) => inSitemap(p) && p.city === city && p.service === tag && p.unit === '시·군');

export default function Cases() {
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '시공 사례', path: '/cases/' }]),
        {
          '@context': 'https://schema.org', '@type': 'ItemList',
          itemListElement: CASES.map((k, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'ImageObject', contentUrl: `${SITE_URL}/img/${k.id}.webp`, name: `${k.where} ${k.space}`, description: k.scene, uploadDate: k.date } })),
        },
        itemListJsonLd(OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시·군' && !p.mod).slice(0, 20).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>시공 사례</span><span>·</span><span className="crumbs-where">네이버 블로그 gook1008</span></nav>
          <h1 className="page-title">시공 사례</h1>
          <p className="page-lead">{BRAND} 상호로 블로그에 올린 글({fmt(posts[posts.length - 1][0].date)} ~ {fmt(posts[0][0].date)})의 현장 사진입니다. 지도 캡처, 출동 차량(번호판이 보일 수 있는 사진), 화면 캡처는 뺐습니다. 글마다 원문 링크를 붙였습니다.</p>
        </div>
      </section>
      <div className="wrap content">
        <ol className="case-list">
          {posts.map((g, i) => {
            const k = g[0];
            const lk = linkFor(k.place, g[0].tags[0], k.city);
            return (
              <li key={k.logNo} data-reveal>
                <div className="case-photos">
                  {g.slice(0, 3).map((c, j) => <figure key={c.id}><img src={`/img/${c.id}.webp`} alt={`${k.where} ${c.space} - ${BRAND} 시공 사진`} loading={i < 2 ? 'eager' : 'lazy'} width={c.w} height={c.h} /><figcaption>{c.space}</figcaption></figure>)}
                </div>
                <div>
                  <p className="meta">{String(i + 1).padStart(2, '0')} · {fmt(k.date)} · {k.where}</p>
                  <h2>{k.post}</h2>
                  <ul className="case-scenes">{g.map((c) => <li key={c.id}>{c.scene}</li>)}</ul>
                  <p className="meta">관련 작업: {Array.from(new Set(g.flatMap((c) => c.tags))).join(' · ')}</p>
                  <p>
                    <a href={k.url} className="more" target="_blank" rel="noopener noreferrer">블로그 원문 <IconArrow /></a>
                    {lk && <> &nbsp; <Link href={pagePath(lk)} className="more">{lk.kw} 안내 <IconArrow /></Link></>}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <section className="sec">
          <h2 className="area-h">막힌 곳 사진을 보내 주시면</h2>
          <p className="prose-p">막힌 배수구, 물이 고인 모습, 하부장 배관을 찍어 문자로 보내 주시면 통화 때 바로 이어서 설명드립니다.</p>
          <Actions />
        </section>
      </div>
    </main>
  );
}
