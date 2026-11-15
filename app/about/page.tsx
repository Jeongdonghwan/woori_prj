// 소개 — 사실만 평서문으로 (무엇을·어디서·어떻게 연락). site.ts 와 페이지 데이터에 있는 것만 쓴다. 없는 정보는 줄을 내지 않는다.
import type { Metadata } from 'next';
import Link from 'next/link';
import { openCities } from '../../lib/data';
import { BLOG, BRAND, BUSINESS, CONTACT, UPDATED, shareMeta, tel, smsHref } from '../../lib/site';
import { breadcrumbJsonLd, businessJsonLd } from '../../lib/jsonld';
import { JsonLd, PhotoTop, pickPhoto } from '../../components/Common';

const TITLE = `소개 | ${BRAND}`;
const DESC = `${BRAND}는 하수구·변기·싱크대 막힘을 뚫는 배관 설비 업체입니다. 하는 일, 다니는 지역, 연락 방법을 정리했습니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/about/' },
  ...shareMeta('home', `${BRAND} 소개`, { title: TITLE, description: DESC, url: '/about/' }),
};

export default function About() {
  const cities = openCities();
  return (
    <main>
      <JsonLd data={[businessJsonLd(), breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '소개', path: '/about/' }])]} />
      <PhotoTop photo={pickPhoto('about')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>소개</span></nav>
        <h1 className="page-title">{BRAND} 소개</h1>
        <p className="page-lead">{BRAND}는 막힌 하수구·변기·싱크대 배관을 뚫고 세척하는 배관 설비 업체입니다.</p>
      </PhotoTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="area-h">하는 일</h2>
          <p className="prose-p">하수구 막힘, 변기 막힘, 싱크대 막힘, 고압세척, 누수탐지, 배관내시경 작업을 합니다. 작업한 현장 사진은 <Link href="/cases/">시공 사례</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">다니는 지역</h2>
          <p className="prose-p">사업장은 {BUSINESS.region}에 있습니다. {cities.join(', ')} 지역 안내는 <Link href="/area/">지역 안내</Link>에 있습니다.</p>
        </section>
        <section className="sec">
          <h2 className="area-h">연락 방법</h2>
          <p className="prose-p">전화 <a href={tel}>{CONTACT.phone}</a>, 문자 <a href={smsHref}>{CONTACT.sms}</a>{CONTACT.hours && ` (${CONTACT.hours})`}로 받습니다.</p>
          <p className="prose-p">상호는 {BUSINESS.name}입니다.</p>
          {BUSINESS.streetAddress && <p className="prose-p">주소는 {BUSINESS.region} {BUSINESS.streetAddress}입니다.</p>}
          {BUSINESS.bizNumber && <p className="prose-p">사업자등록번호는 {BUSINESS.bizNumber}입니다.</p>}
          <p className="prose-p"><a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그</a></p>
          <p className="prose-p">이 페이지의 최종 수정일은 <time dateTime={UPDATED}>{UPDATED}</time>입니다.</p>
        </section>
      </div>
    </main>
  );
}
