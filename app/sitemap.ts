import type { MetadataRoute } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import { SITE_URL } from '../lib/site';
import { getPosts, postEncodedPath } from '../lib/blog';
import { OPEN_PAGES, openCities, cityEncodedPath, pageEncodedPath, inSitemap } from '../lib/data';

// lastmod = 본문을 만드는 파일들의 수정 시각 (빌드 시각이 아님)
const mtime = (...files: string[]) => new Date(Math.max(...files.map((f) => fs.statSync(path.join(process.cwd(), f)).mtimeMs)));
const PAGE_MOD = mtime('data/site-pages.json', 'data/places.json', 'data/cases.json', 'lib/compose.ts');
const HOME_MOD = mtime('app/page.tsx', 'data/cases.json');

// 빌드 시 out/sitemap.xml — 열린 묶음(OPEN_WAVE)의 대표 페이지만 (표기 변형은 canonical 대상이라 제외)
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: `${SITE_URL}/`, lastModified: HOME_MOD, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/area/`, lastModified: PAGE_MOD, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/cases/`, lastModified: mtime('data/cases.json'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog/`, lastModified: posts[0] ? new Date(posts[0].publishedAt) : HOME_MOD, changeFrequency: 'daily', priority: 0.7 },
    ...posts.map((p) => ({ url: `${SITE_URL}${postEncodedPath(p)}`, lastModified: new Date(p.publishedAt), changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...openCities().map((c) => ({ url: `${SITE_URL}${cityEncodedPath(c)}`, lastModified: PAGE_MOD, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...OPEN_PAGES.filter(inSitemap).map((p) => ({
      url: `${SITE_URL}${pageEncodedPath(p)}`,
      lastModified: PAGE_MOD,
      changeFrequency: 'monthly' as const,
      priority: p.unit === '시·군' ? 0.8 : p.unit === '시·군·구' || p.unit === '생활권' ? 0.7 : 0.6,
    })),
  ];
}
