import { SITE_URL, SITE_NAME, BRAND, CONTACT, BUSINESS, BLOG } from './site';

// 업체 — 거리 주소는 사용자 확인 전이라 넣지 않는다(lib/site.ts TODO). 지역·전화·블로그만.
export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Plumber',
  '@id': `${SITE_URL}/#business`,
  name: BRAND,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/img/w01.jpg`,
  telephone: CONTACT.phone,
  address: {
    '@type': 'PostalAddress', addressCountry: 'KR', addressRegion: '충청남도', addressLocality: '천안시 서북구',
    ...(BUSINESS.streetAddress ? { streetAddress: BUSINESS.streetAddress } : {}),
  },
  openingHours: 'Mo-Su 00:00-24:00',
  sameAs: [BLOG],
  areaServed: ['천안시', '아산시'],
  knowsAbout: ['하수구 막힘', '변기 막힘', '싱크대 막힘', '배관 막힘', '고압세척', '배관내시경', '변기 수리', '수전 교체', '언 수도 녹임'],
});

export const webSiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'ko',
  publisher: { '@id': `${SITE_URL}/#business` },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: i === 0 ? BRAND : it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const serviceJsonLd = (o: { name: string; type: string; description: string; path: string; area: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: o.name,
  serviceType: o.type,
  description: o.description,
  url: `${SITE_URL}${o.path}`,
  areaServed: { '@type': 'Place', name: o.area },
  provider: { '@id': `${SITE_URL}/#business` },
});

// 캐러셀 ItemList — 같은 도메인 절대 URL, path 는 인코딩된 경로. image 는 실제 사진이 있을 때만. 개수는 호출하는 쪽에서(메인 30·허브 전체·상세 관련)
export const itemListJsonLd = (items: { name: string; path: string; image?: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${it.path}`, name: it.name,
    ...(it.image ? { image: `${SITE_URL}${it.image}` } : {}),
  })),
});
