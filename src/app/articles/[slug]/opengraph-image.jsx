/* eslint-disable @next/next/no-img-element -- ImageResponse requires a plain image element. */
import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import { getPublicArticleBySlug } from '@/lib/content/publicArticles';

export const alt = 'My Legal Paddy article cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

const siteUrl = 'https://mylegalpaddy.app';

function absoluteUrl(value) {
  if (!value) return `${siteUrl}/team/law-students-group.jpg`;
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return `${siteUrl}/team/law-students-group.jpg`;
  }
}

async function compatibleCover(value) {
  const url = absoluteUrl(value);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Cover request failed with ${response.status}`);
    const png = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(size.width, size.height, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.error('[Open Graph] Could not prepare article cover:', error.message);
    return `${siteUrl}/team/law-students-group.jpg`;
  }
}

export default async function OpenGraphImage({ params }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(slug);
  const title = article?.title || 'My Legal Paddy';
  const category = article?.category || 'Legal insight';
  const cover = await compatibleCover(article?.image);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: '#111111',
        color: '#ffffff',
      }}
    >
      <img
        src={cover}
        alt=""
        width="1200"
        height="630"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'absolute',
          inset: 0,
          padding: '58px 70px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.9) 100%)',
        }}
      >
        <div style={{ display: 'flex', color: '#efd36f', fontSize: 25, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>
          {category}
        </div>
        <div style={{ display: 'flex', maxWidth: 1050, marginTop: 16, fontSize: title.length > 70 ? 48 : 58, fontWeight: 800, lineHeight: 1.08 }}>
          {title}
        </div>
      </div>
    </div>,
    size,
  );
}
