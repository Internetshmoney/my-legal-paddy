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

function structuredText(html) {
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/(?:div|p|h[1-6]|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
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

function highResolutionUrl(url) {
  if (!url || !/^https?:\/\//i.test(url)) return url;
  return url
    .replace(/\/(?:s\d+(?:-[a-z0-9-]+)?|w\d+-h\d+(?:-[a-z0-9-]+)?)\//i, '/s1600/')
    .replace(/=s\d+(?:-[a-z0-9-]+)?$/i, '=s1600');
}

function rewriteImages(html, mediaMap) {
  return html.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi, (match, before, url, after) => {
    return `${before}${localImageFor(url, mediaMap) || highResolutionUrl(url)}${after}`;
  });
}

function categoryFor(post) {
  const text = `${post.title} ${plainText(post.content).slice(0, 1600)}`.toLowerCase();
  const rules = [
    ['Intellectual Property', /intellectual property|copyright|trademark|patent|creators? and the law|entertainment law/],
    ['Human Rights', /human rights|women and girl|sexual violence|religious freedom|abortion|euthanasia|right to die|armed conflict|inmates condemned|suicide/],
    ['Legal Skills & Study', /legal writing|legal research|answer legal questions|study habit|law student|networking|stress and anxiety|career opportunit|irac method/],
    ['Environmental Law', /environment|climate change|nesrea|pollution/],
    ['Law of Torts', /law of tort|tortious|defamation|eggshell|negligence|conversion and detinue|duty of care/],
    ['Criminal Law & Procedure', /criminal law|double jeopardy|\bbail\b|rights of a suspect|accused|law enforcement|electoral act|evidence|\befcc\b/],
    ['Constitutional Law', /constitution|judicial review|separation of powers|state of emergency|fair hearing|state police|protester|public power/],
    ['Commercial & Corporate Law', /contract|corporate|business|tax law|mortgage|banking|negotiable instrument|exchange rate|company|commercial/],
    ['Land Law', /land law|land use|adverse possession|real estate|property management/],
    ['Technology & Law', /artificial intelligence|\bai\b|chatgpt|technology|digital|cyber|data privacy|social media|online courtroom|cryptocurrency/],
    ['Jurisprudence', /jurisprudence|law and justice|sources of law|legal system/],
  ];
  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'Legal Commentary';
}

const INSTITUTION_PATTERN = /\b(?:University of (?:Jos|Lagos|Nigeria|Uyo|Port Harcourt)|University Of (?:Jos|Uyo|Niger)|University of Port-Harcourt|Adekunle Ajasin University(?:,? Akungba Akoko)?|Topfaith University|Philomath University|Prince Abubakar Audu University|Ebonyi State University|Ahmadu Bello University(?: Zaria)?|Nasarawa State University(?: Keffi)?|Imo State University|Fountain University|Lagos State University)\b/i;

function cleanAuthorCandidate(value, title) {
  let candidate = value
    .replace(/^\s*(?:article\s+)?by\s*:?\s*/i, '')
    .replace(/\b(?:email|abstract|introduction)\b[\s\S]*$/i, '')
    .replace(/[|,:;.-]+$/g, '')
    .replace(/\s+MMDS$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  const normalizedTitle = title.replace(/\s+/g, ' ').trim().toLowerCase();
  if (candidate.toLowerCase().startsWith(normalizedTitle)) {
    candidate = candidate.slice(title.replace(/\s+/g, ' ').trim().length).trim();
  }

  const tokens = candidate.split(' ').filter(Boolean);
  if (tokens.length > 5) candidate = tokens.slice(-4).join(' ');
  if (!candidate || candidate.length < 3 || candidate.length > 70 || /^(abstract|introduction)$/i.test(candidate)) return null;
  const letters = candidate.replace(/[^a-z]/gi, '');
  if (letters && letters === letters.toUpperCase()) candidate = candidate.toLowerCase();
  return candidate.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function authorFor(post) {
  const lines = structuredText(post.content).slice(0, 14);
  const opening = lines.join(' ');
  const emailByline = opening.match(/^\s*(?:article\s+)?by\s+([a-z .'-]{3,60})\s+[^\s@]+@[^\s@]+/i);
  if (emailByline) return cleanAuthorCandidate(emailByline[1], post.title) || 'Contributing Writer';
  const explicitBy = opening.match(/^\s*(?:article\s+)?by\s*:?\s*([a-z][a-z .'-]{2,60}?)(?=\s+(?:university|topfaith|philomath|prince abubakar|ebonyi|ahmadu|nasarawa|imo|fountain|lagos state|abstract|introduction|email|in the|in this|the doctrine)\b|\s*[.,]|$)/i);
  if (explicitBy) {
    const author = cleanAuthorCandidate(explicitBy[1], post.title);
    if (author) return author;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const institutionMatch = lines[index].match(INSTITUTION_PATTERN);
    if (!institutionMatch) continue;
    const sameLine = lines[index].slice(0, institutionMatch.index).trim();
    const candidate = sameLine || lines[index - 1] || '';
    const author = cleanAuthorCandidate(candidate, post.title);
    if (author) return author;
  }

  const titleText = post.title.replace(/\s+/g, ' ').trim();
  if (opening.toLowerCase().startsWith(titleText.toLowerCase())) {
    const afterTitle = opening.slice(titleText.length).trim();
    const beforeIntro = afterTitle.match(/^([a-z][a-z .'-]{2,60}?)(?=\s+(?:abstract|introduction)\b)/i);
    const author = cleanAuthorCandidate(beforeIntro?.[1] || '', post.title);
    if (author) return author;
  }

  const finalCredit = plainText(post.content).match(/article\s+by\s*:\s*([a-z][a-z .'-]{2,60})/i);
  return cleanAuthorCandidate(finalCredit?.[1] || '', post.title) || 'Contributing Writer';
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
    .filter((post) => !/^(?:100|200|300|400|500)\s*level(?:\s+past questions)?\.?$/i.test(post.title.trim()))
    .filter((post) => !/^contact us\.?$/i.test(post.title.trim()))
    .filter((post) => !/material bank|^welcome to mylegalpaddy/i.test(post.title.trim()))
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map((post, index) => {
      const baseSlug = slugify(post.title);
      const occurrence = (seenSlugs.get(baseSlug) || 0) + 1;
      seenSlugs.set(baseSlug, occurrence);
      const slug = occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}`;
      const body = rewriteImages(post.content, mediaMap);
      const words = plainText(body).split(/\s+/).filter(Boolean).length;
      const image = localImageFor(post.featuredImage, mediaMap) || highResolutionUrl(post.featuredImage) || FALLBACK_IMAGE;

      return {
        id: `blogger-${String(index + 1).padStart(3, '0')}`,
        slug,
        title: plainText(post.title),
        excerpt: excerptFrom(body),
        category: categoryFor(post),
        author: authorFor(post),
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
