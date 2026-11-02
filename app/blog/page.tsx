import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts, postPath, postEncodedPath } from '../../lib/blog';
import { OPEN_PAGES, inSitemap, pagePath, pageEncodedPath } from '../../lib/data';
import { breadcrumbJsonLd, itemListJsonLd } from '../../lib/jsonld';
import { Actions, IconArrow, JsonLd, PhotoTop, pickPhotos } from '../../components/Common';
import { BRAND, BLOG, shareMeta } from '../../lib/site';

const TITLE = `배관 막힘 궁금증 블로그 | ${BRAND}`;
const DESC = `하수구가 반복해서 막히는 이유, 변기에 물티슈를 버리면 안 되는 이유, 싱크대 기름때 관리, 고압세척이 필요한 경우처럼 ${BRAND}가 상담 때 자주 받는 질문을 글로 정리합니다.`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/blog/', types: { 'application/rss+xml': '/rss.xml' } },
  ...shareMeta('blog', `${BRAND} 배관 막힘 궁금증 블로그`, { title: TITLE, description: DESC, url: '/blog/' }),
};

const fmt = (d: string) => d.replace(/-/g, '.');

export default function BlogIndex() {
  const posts = getPosts();
  // 글이 없을 때도 목록이 비지 않게 열린 대표 페이지로 이어 준다
  const hubs = OPEN_PAGES.filter((p) => inSitemap(p) && p.unit === '시·군' && !p.mod).slice(0, 8);
  return (
    <main>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: '홈', path: '/' }, { name: '블로그', path: '/blog/' }]),
        itemListJsonLd(posts.length
          ? posts.map((p) => ({ name: p.title, path: postEncodedPath(p) }))
          : hubs.map((p) => ({ name: p.kw, path: pageEncodedPath(p) }))),
      ]} />
      <PhotoTop photos={pickPhotos('blog')} className="page-hero">
        <nav className="crumbs" aria-label="경로"><Link href="/">홈</Link><span>/</span><span>블로그</span></nav>
        <h1 className="page-title">배관 막힘 궁금증 블로그</h1>
        <p className="page-lead">상담 전화에서 자주 듣는 질문을 한 편에 하나씩 답합니다. 막힘 원인·예방·업체 부르기 전 확인할 것처럼 집집마다 공통인 내용이고, 현장마다 다른 비용 숫자는 적지 않습니다.</p>
      </PhotoTop>
      <div className="wrap content">
        <section className="sec">
          <h2 className="area-h">최근 글</h2>
          {posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((p) => (
                <li key={p.slug} data-reveal>
                  <Link href={postPath(p)}>
                    <span className="meta">{fmt(p.publishedAt)}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="prose-p">첫 글을 준비하고 있습니다. 그동안 아래 안내 페이지와 <a href={BLOG} target="_blank" rel="noopener noreferrer">네이버 블로그 시공 글</a>을 참고해 주세요.</p>
          )}
        </section>
        <section className="sec">
          <h2 className="area-h">하수구·변기·싱크대 막힘 안내 페이지</h2>
          <ul className="linklist">{hubs.map((p) => <li key={p.slug}><Link href={pagePath(p)}>{p.kw}<IconArrow /></Link></li>)}</ul>
          <Actions />
        </section>
      </div>
    </main>
  );
}
