import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CITIES, CASES, PLACES, openCities, cityPages, cityEncodedPath, pagePath, pageEncodedPath, inSitemap } from '../../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../../lib/jsonld';
import { Actions, IconArrow, JsonLd, SectionHead, PhotoTop, pickPhotos } from '../../../components/Common';
import { BRAND, shareMeta } from '../../../lib/site';

export const dynamicParams = false;
export function generateStaticParams() {
  return openCities().map((city) => ({ city }));
}
const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
const KIND: Record<string, string> = { 시군: '시·군', 시군구: '시·군·구', 생활권: '생활권', 동읍면: '동·읍면' };

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = dec(params.city);
  if (!CITIES[city]) return {};
  const title = `${city} 하수구·변기·싱크대 막힘 지역 안내 | ${BRAND}`;
  const description = `${CITIES[city].full} 동네별 하수구 막힘·변기 막힘·싱크대 막힘·고압세척·배관내시경 안내. ${city} 비용·업체·24시·긴급 페이지로 이어집니다.`;
  return { title, description, alternates: { canonical: cityEncodedPath(city) }, ...shareMeta(`area-${city}`, `${city} 배관 막힘 지역 안내`, { title, description, url: cityEncodedPath(city) }) };
}

// 시·군 허브 — 그 시·군의 열린 키워드 페이지 전부로 가는 크롤 경로
export default function CityHub({ params }: { params: { city: string } }) {
  const city = dec(params.city);
  const C = CITIES[city];
  if (!C) notFound();
  const pages = cityPages(city);
  const keys = Array.from(new Set(pages.map((p) => p.place)));
  const kinds = ['시군', '시군구', '생활권', '동읍면'].filter((k) => keys.some((x) => PLACES[x].kind === k));
  const photos = CASES.filter((c) => c.city === city).slice(0, 4);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '지역', path: '/area/' }, { name: `${city} 배관 막힘`, path: cityEncodedPath(city) }]),
        itemListJsonLd(pages.filter(inSitemap).map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PhotoTop photos={pickPhotos(city)} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><Link href="/area/">지역</Link><span>/</span><span>{city}</span><span>·</span><span className="crumbs-where">{C.full}</span></nav>
        <h1 className="page-title">{city} 하수구·변기·싱크대 막힘 지역 안내</h1>
        <p className="page-lead">{C.full}는 {C.traits}입니다. {C.route}. 아래에서 동네와 궁금한 내용(비용·업체·24시·긴급·뚫음)을 고르세요.</p>
        <Actions />
      </PhotoTop>
      <div className="wrap content">
        {photos.length > 0 && (
          <div className="shots hub-shots">
            {photos.map((k) => (
              <figure key={k.id}>
                <div className="ph"><img src={`/img/${k.id}.webp`} alt={`${city} ${BRAND} 시공 사진 - ${k.where} ${k.space}`} loading="lazy" width={k.w} height={k.h} /></div>
                <figcaption><b>{k.where}</b>{k.space}</figcaption>
              </figure>
            ))}
          </div>
        )}
        {kinds.map((k, i) => (
          <section key={k} className="sec">
            <SectionHead title={`${city} ${KIND[k]}`} />
            {keys.filter((x) => PLACES[x].kind === k).map((key) => (
              <div key={key} className="area-block" id={key} data-reveal>
                <h3>{PLACES[key].name} <small>· {PLACES[key].homes}</small></h3>
                <ul className="area-list">
                  {pages.filter((p) => p.place === key).map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}</Link></li>)}
                </ul>
              </div>
            ))}
          </section>
        ))}
        <p><Link href="/area/" className="more">다른 시·군 보기 <IconArrow /></Link></p>
      </div>
    </main>
  );
}
