// 사이트 설정 — 연락처·도메인은 이 파일만 고치면 전 페이지에 반영된다.
// 근거: 우리설비 네이버 블로그(blog.naver.com/gook1008) '우리설비' 상호로 쓴 글 28편(2025-12-02 ~ 2026-03-19).
//   상호 '우리설비', 전화 010-9234-7119 (글마다 표기), 글 지도 첨부 위치 2곳(천안 서북구 불당17길 14 / 쌍용13길 21 1층).

// 우리배관설비.com (퓨니코드). 배포: bash scripts/deploy.sh <묶음> <URL>
export const SITE_URL = process.env.SITE_URL || 'https://xn--zb0b83vh1b30ce7elxk.com';
export const BRAND = '우리배관설비'; // 사용자 지정 사이트 이름 (블로그 상호는 '우리설비')
export const SITE_NAME = `${BRAND} | 전국 하수구·변기·싱크대 막힘`;

export const BLOG = 'https://blog.naver.com/gook1008';

export const CONTACT = {
  phone: '010-9234-7119', // 블로그 글마다 적힌 번호
  sms: '010-9234-7119',
  hours: '24시간 상담', // 블로그: '24시간 상담 가능', '당일출동 · 야간 긴급출동 가능'
};

export const BUSINESS = {
  name: BRAND,
  // TODO(확인 필요): 블로그 지도 첨부가 두 곳이라 어느 쪽이 사업장인지 확인 전까지 거리 주소는 쓰지 않는다
  //   불당17길 14 (글 14편) / 쌍용13길 21 1층 (글 6편) — 사용자 확인 후 streetAddress 에 넣기
  region: '충청남도 천안시 서북구',
  streetAddress: '',
  bizNumber: '', // TODO 사업자등록번호 (블로그에 없음)
};

// 순차 오픈: 이 묶음 이하의 페이지만 빌드·사이트맵·내부링크에 포함된다.
//   post-launch 7일 안 4묶음: 1 = 25% (시·군 + 시·군·구 일부) / 2 = 50% / 3 = 75% / 4 = 100% — data/drip.json, scripts/drip/
export const OPEN_WAVE = Number(process.env.OPEN_WAVE || 1);

// 붙여쓰기만 다른 키워드 페이지는 대표 페이지로 canonical + 사이트맵 제외 (지금 원본에는 0건)
export const MERGE_VARIANTS = true;

export const tel = `tel:${CONTACT.phone.replace(/[^0-9]/g, '')}`;
export const smsHref = `sms:${CONTACT.sms.replace(/[^0-9]/g, '')}`;
export const absUrl = (path: string) => `${SITE_URL}${path}`;

// og·트위터 카드: public/og/<key>.jpg (scripts/make_og.py 로 생성)
export const shareMeta = (key: string, alt: string, o: { title?: string; description?: string; url?: string } = {}) => {
  const images = [{ url: `${SITE_URL}/og/${encodeURIComponent(key)}.jpg`, width: 1200, height: 630, alt }];
  return {
    openGraph: { type: 'website' as const, siteName: SITE_NAME, locale: 'ko_KR', ...o, images },
    twitter: { card: 'summary_large_image' as const, title: o.title, description: o.description, images },
  };
};

// 서치어드바이저(네이버)·서치콘솔(구글) HTML 태그 소유확인 — content 값만 (TODO: 도메인 확정 후 받기)
export const NAVER_VERIFY = 'e16698de87f28dd7b54de59705fae263eb555b1c';
export const GOOGLE_VERIFY = 'vOLWdJatuk6JguyeiGL7ou72l9eNOyfliFC68l5DVNU';
