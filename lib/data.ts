// 데이터 로더 — data/site-pages.json(키워드 페이지), places.json(지역), cases.json(블로그 시공 사진). 빌드 전용.
import pagesData from '../data/site-pages.json';
import placesData from '../data/places.json';
import casesData from '../data/cases.json';
import { OPEN_WAVE, MERGE_VARIANTS } from './site';

export interface Page {
  n: number; no: number; kw: string; slug: string; label: string; place: string; city: string;
  word: string; service: string; mod: string; unit: string; score: number; prio: number; wave: number; variantOf?: string;
}
export interface Place { key: string; name: string; city: string; admin: string; kind: string; homes: string; spots: string[]; note: string; blog: string[] }
export interface City { full: string; served: boolean; route: string; traits: string }
export interface Case {
  id: string; logNo: string; date: string; where: string; city: string; place: string | null; post: string;
  space: string; scene: string; tags: string[]; w: number; h: number; url: string;
}

export const ALL_PAGES = pagesData.pages as Page[];
export const OPEN_PAGES = ALL_PAGES.filter((p) => p.wave <= OPEN_WAVE);
const openSet = new Set(OPEN_PAGES.map((p) => p.slug));
export const isOpen = (slug: string) => openSet.has(slug);

export const PLACES = placesData.places as Record<string, Place>;
export const CITIES = placesData.cities as Record<string, City>;
export const CITY_ORDER = placesData.cityOrder as string[];
export const CASES = casesData.cases as Case[];

export const pagePath = (p: Page) => `/${p.slug}/`;
export const pageEncodedPath = (p: Page) => `/${encodeURIComponent(p.slug)}/`;
export const cityPath = (city: string) => `/area/${city}/`;
export const cityEncodedPath = (city: string) => `/area/${encodeURIComponent(city)}/`;

// canonical: 스위치가 켜져 있고 대표 페이지가 열려 있으면 대표 페이지로
export const canonicalPath = (p: Page) =>
  MERGE_VARIANTS && p.variantOf && openSet.has(p.variantOf) ? `/${encodeURIComponent(p.variantOf)}/` : pageEncodedPath(p);
export const inSitemap = (p: Page) => canonicalPath(p) === pageEncodedPath(p);

const bySlug = new Map(OPEN_PAGES.map((p) => [p.slug, p]));
export function getPage(slug: string): Page | undefined {
  let key = slug;
  try { key = decodeURIComponent(slug); } catch {}
  return bySlug.get(key);
}

export const openCities = () => CITY_ORDER.filter((c) => OPEN_PAGES.some((p) => p.city === c));
export const cityPages = (city: string) => OPEN_PAGES.filter((p) => p.city === city);

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
};
export const seedOf = hash;
export const rotate = <T,>(arr: T[], seed: string, salt = ''): T[] => {
  if (!arr.length) return arr;
  const k = hash(`${seed}::${salt}`) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// 관련 페이지 — 열린 대표 페이지만. 같은 장소 다른 서비스 / 같은 시·군 이웃 장소 같은 키워드 / 다른 시·군 같은 서비스
const POOL = OPEN_PAGES.filter(inSitemap);
const byPlace = new Map<string, Page[]>();
for (const x of POOL) { const a = byPlace.get(x.place) || []; a.push(x); byPlace.set(x.place, a); }
export function related(p: Page) {
  const same = (byPlace.get(p.place) || []).filter((x) => x.slug !== p.slug);
  const samePlace = rotate(same, p.slug, 'sp').slice(0, 6);
  const sameCity = rotate(POOL.filter((x) => x.city === p.city && x.place !== p.place && x.word === p.word && x.mod === p.mod), p.slug, 'rel').slice(0, 8);
  const otherCities = rotate(POOL.filter((x) => x.city !== p.city && PLACES[x.place].kind === '시군' && x.service === p.service), p.slug, 'oc').slice(0, 6);
  return { samePlace, sameCity, otherCities };
}

// 시공 사진 배정 — 같은 동네 글 사진 → 서비스 태그 맞는 사진 → 나머지 (슬러그 해시로 돌린다)
export function casesFor(p: Page, n = 4): Case[] {
  const local = rotate(CASES.filter((c) => c.place === p.place), p.slug, 'loc');
  const fit = rotate(CASES.filter((c) => c.place !== p.place && c.tags.includes(p.service)), p.slug, 'case');
  const rest = rotate(CASES.filter((c) => c.place !== p.place && !c.tags.includes(p.service)), p.slug, 'case2');
  const out: Case[] = [];
  for (const c of [...local.slice(0, 2), ...fit, ...rest]) if (!out.includes(c)) out.push(c);
  return out.slice(0, n);
}
