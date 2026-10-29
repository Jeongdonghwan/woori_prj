// 공통 UI — 이모지 없이 선 아이콘, 각진 버튼, 번호 붙은 섹션 머리.
import Link from 'next/link';
import { BRAND, CONTACT, BUSINESS, BLOG, tel, smsHref } from '../lib/site';

export const JsonLd = ({ data }: { data: object | object[] }) => (
  <>{(Array.isArray(data) ? data : [data]).map((d, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />)}</>
);

const Svg = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconPhone = () => <Svg d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />;
export const IconMsg = () => <Svg d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
export const IconArrow = () => <Svg d="M5 12h14M13 6l6 6-6 6" size={16} />;
export const IconDoc = () => <Svg d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" size={17} />;

// 본문 버튼 묶음 — 주 행동(전화) 슬랩 1개 + 보조 텍스트 링크
export const Actions = ({ sms = true, blog = false }: { sms?: boolean; blog?: boolean }) => (
  <div className="actions">
    <a className="btn-primary" href={tel}><IconPhone /><span>{CONTACT.phone}</span></a>
    {sms && <a className="btn-text" href={smsHref}><IconMsg /><span>막힌 곳 사진 문자로 보내기</span><IconArrow /></a>}
    {blog && <a className="btn-text" href={BLOG} target="_blank" rel="noopener noreferrer"><IconDoc /><span>블로그 시공 글 보기</span></a>}
  </div>
);

export const SectionHead = ({ no, title, sub }: { no: string; title: string; sub?: string }) => (
  <header className="sh" data-reveal>
    <span className="sh-no" aria-hidden="true">{no}</span>
    <h2>{title}</h2>
    {sub && <p>{sub}</p>}
  </header>
);

export const Ticker = ({ items }: { items: string[] }) => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">{[...items, ...items].map((x, i) => <span key={i}>{x}</span>)}</div>
  </div>
);

export const Header = () => (
  <header className="site-header">
    <div className="wrap header-inner">
      <Link href="/" className="logo" aria-label={`${BRAND} 홈`}>
        <span className="logo-mark" aria-hidden="true">W</span>
        <span className="logo-text"><b>{BRAND}</b><small>하수구·변기·싱크대 막힘 · 고압세척</small></span>
      </Link>
      <nav className="nav" aria-label="주 메뉴">
        <Link href="/cases/" className="hide-m">시공 사례</Link>
        <Link href="/area/" className="hide-m">지역</Link>
        <Link href="/blog/" className="hide-m">블로그</Link>
        <a href={tel} className="nav-call" aria-label={`전화 ${CONTACT.phone}`}><IconPhone /><span>{CONTACT.phone}</span></a>
      </nav>
    </div>
  </header>
);

export const Footer = () => (
  <footer className="site-footer">
    <div className="wrap foot-grid">
      <div>
        <strong className="foot-brand">{BRAND}</strong>
        <p>하수구 막힘 · 변기 막힘 · 싱크대 막힘 · 고압세척 · 배관내시경<br />천안·아산 전 지역 출동 · {CONTACT.hours} · 당일·야간 긴급출동</p>
        <p><Link href="/area/">지역 안내</Link> · <Link href="/cases/">시공 사례</Link> · <Link href="/blog/">블로그</Link> · <a href="/rss.xml">RSS</a></p>
      </div>
      <ul className="foot-info">
        <li><span>상호</span>{BRAND}</li>
        {BUSINESS.bizNumber && <li><span>사업자</span>{BUSINESS.bizNumber}</li>}
        <li><span>지역</span>{BUSINESS.streetAddress || BUSINESS.region}</li>
        <li><span>전화</span><a href={tel}>{CONTACT.phone}</a></li>
        <li><span>블로그</span><a href={BLOG} target="_blank" rel="noopener noreferrer">blog.naver.com/gook1008</a></li>
      </ul>
    </div>
    <div className="wrap foot-bottom">© {new Date().getFullYear()} {BRAND} · 상담 때 받은 주소·연락처는 출동과 비용 안내에만 씁니다.</div>
  </footer>
);

export const StickyBar = () => (
  <div className="sticky-bar">
    <a href={tel} className="sb-call"><IconPhone />{CONTACT.phone}</a>
    <a href={smsHref} className="sb-sms"><IconMsg />사진 문자</a>
  </div>
);
