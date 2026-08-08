const fs = require('fs');
const path = require('path');
const { parseBloggerFeed } = require('../../blogger/parseBloggerFeed');

const FALLBACK_IMAGE = '/brand/my-legal-paddy-dark.png';

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'untitled-article';
}

function plainText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFrom(content) {
  const text = plainText(content);
  if (text.length <= 220) return text;
  return `${text.slice(0, 217).replace(/\s+\S*$/, '')}...`;
}

function normalizeMediaName(value) {
  return value
    .toLowerCase()
    .replace(/\(\d+\)(?=\.[^.]+$)/, '')
    .replace(/[^a-z0-9.]+/g, '-');
}

function safePublicName(value, usedNames) {
  const extension = path.extname(value).toLowerCase();
  const base = slugify(path.basename(value, extension));
  let candidate = `${base}${extension}`;
  let counter = 2;
  while (usedNames.has(candidate)) candidate = `${base}-${counter++}${extension}`;
  usedNames.add(candidate);
  return candidate;
}

function buildMediaMap(mediaDir, publicDir) {
  fs.mkdirSync(publicDir, { recursive: true });
  const map = new Map();
  const usedNames = new Set();
  const mediaFiles = fs.readdirSync(mediaDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.toLowerCase().endsWith('.json'));

  for (const entry of mediaFiles) {
    const publicName = safePublicName(entry.name, usedNames);
    fs.copyFileSync(path.join(mediaDir, entry.name), path.join(publicDir, publicName));
    const publicPath = `/blogger/${publicName}`;
    map.set(entry.name.toLowerCase(), publicPath);
    map.set(normalizeMediaName(entry.name), publicPath);
  }

  return map;
}

function localImageFor(url, mediaMap) {
  if (!url) return null;
  try {
    const fileName = decodeURIComponent(new URL(url).pathname.split('/').pop() || '').replace(/\+/g, ' ');
    return mediaMap.get(fileName.toLowerCase()) || mediaMap.get(normalizeMediaName(fileName)) || null;
  } catch {
    return null;
  }
}

function rewriteImages(html, mediaMap) {
  return html.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (match, before, url, after) => {
    return `${before}${localImageFor(url, mediaMap) || url}${after}`;
  });
}

function categoryFor(post) {
  const label = post.labels.find((item) => item && !item.includes('http://schemas.google.com'));
  return label || 'Legal Education';
}

function main() {
  const [feedPath, mediaDir, outputPath, publicDir] = process.argv.slice(2).map((item) => path.resolve(item));
  if (!feedPath || !mediaDir || !outputPath || !publicDir) {
    throw new Error('Usage: node convert.js <feed.atom> <media-dir> <output.js> <public-media-dir>');
  }

  const mediaMap = buildMediaMap(mediaDir, publicDir);
  const seenSlugs = new Map();
  const posts = parseBloggerFeed(feedPath)
    .filter((post) => post.title.trim() && plainText(post.content).length > 0)
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map((post, index) => {
      const baseSlug = slugify(post.title);
      const occurrence = (seenSlugs.get(baseSlug) || 0) + 1;
      seenSlugs.set(baseSlug, occurrence);
      const slug = occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}`;
      const body = rewriteImages(post.content, mediaMap);
      const words = plainText(body).split(/\s+/).filter(Boolean).length;
      const image = localImageFor(post.featuredImage, mediaMap) || post.featuredImage || FALLBACK_IMAGE;

      return {
        id: `blogger-${String(index + 1).padStart(3, '0')}`,
        slug,
        title: plainText(post.title),
        excerpt: excerptFrom(body),
        category: categoryFor(post),
        author: plainText(post.author) || 'My Legal Paddy',
        date: new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.published)),
        publishedAt: post.published,
        readingTime: `${Math.max(1, Math.ceil(words / 220))} min read`,
        image,
        featured: index === 0,
        content: body,
      };
    });

  const serializedPosts = JSON.stringify(posts, null, 2);
  const usedMedia = new Set(
    [...serializedPosts.matchAll(/["']\/blogger\/([^"']+)/g)].map((match) => match[1])
  );
  for (const fileName of fs.readdirSync(publicDir)) {
    if (!usedMedia.has(fileName)) fs.rmSync(path.join(publicDir, fileName));
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `// Generated from the My Legal Paddy Blogger Takeout export.\n// Run tools/migration/blogger/convert.js to regenerate.\n\nexport const articles = ${serializedPosts};\n`);
  console.log(`Imported ${posts.length} Blogger articles and retained ${usedMedia.size} referenced local media files.`);
}

main();
