const fs = require('fs');
const path = require('path');

function stripXmlDeclaration(raw) {
  return raw.replace(/^<\?xml[^>]*\?>\s*/i, '');
}

function decodeEntities(value) {
  if (!value) return '';

  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function extractText(content, tagName) {
  if (!content) return '';

  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = content.match(pattern);

  if (!match) return '';

  return decodeEntities(match[1].trim());
}

function extractContentBody(entryXml) {
  const contentMatch = entryXml.match(/<content\b[^>]*>([\s\S]*?)<\/content>/i);
  if (!contentMatch) return '';

  let body = contentMatch[1].trim();

  if (body.startsWith('<![CDATA[') && body.endsWith(']]>')) {
    body = body.slice(9, -3);
  }

  return decodeEntities(body.trim());
}

function extractFirstImage(content) {
  if (!content) return null;

  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return imgMatch ? imgMatch[1] : null;
}

function getSlugFromHref(href) {
  if (!href) return '';

  try {
    const parsedUrl = new URL(href);
    const pathname = parsedUrl.pathname.replace(/\/+$/, '');
    const lastSegment = pathname.split('/').filter(Boolean).pop() || '';

    if (!lastSegment) return '';

    return lastSegment.replace(/\.html?$/i, '').replace(/\.xml$/i, '');
  } catch {
    return href;
  }
}

function extractLabels(entryXml) {
  const categoryMatches = [...entryXml.matchAll(/<category\b[^>]*term=["']([^"']+)["'][^>]*>/gi)];
  const labels = categoryMatches
    .map((match) => match[1])
    .filter((term) => !/kind#(post|page|comment|settings|template)/i.test(term))
    .filter(Boolean);

  return labels;
}

function isPostEntry(entryXml) {
  const kindMatches = [...entryXml.matchAll(/<category\b[^>]*term=["']([^"']+)["'][^>]*>/gi)];
  const kindTerms = kindMatches.map((match) => match[1].toLowerCase());

  if (kindTerms.some((term) => term.includes('#post'))) {
    return true;
  }

  if (kindTerms.some((term) => term.includes('#page') || term.includes('#comment') || term.includes('#settings') || term.includes('#template'))) {
    return false;
  }

  return /<published>/i.test(entryXml) && /<title\b/i.test(entryXml);
}

function parseBloggerFeed(feedPath) {
  const resolvedPath = path.resolve(feedPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Blogger feed not found at ${resolvedPath}`);
  }

  const feedXml = fs.readFileSync(resolvedPath, 'utf8');
  const normalizedXml = stripXmlDeclaration(feedXml);
  const entryMatches = [...normalizedXml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)];

  return entryMatches
    .map((match) => match[1])
    .filter(isPostEntry)
    .map((entryXml) => {
      const id = extractText(entryXml, 'id');
      const title = extractText(entryXml, 'title');
      const published = extractText(entryXml, 'published');
      const updated = extractText(entryXml, 'updated');
      const author = extractText(entryXml, 'name');
      const content = extractContentBody(entryXml);
      const labels = extractLabels(entryXml);
      const alternateLinkMatch = entryXml.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*>/i);
      const slug = getSlugFromHref(alternateLinkMatch ? alternateLinkMatch[1] : '');
      const featuredImage = extractFirstImage(content);

      return {
        id,
        title,
        slug,
        published,
        updated,
        author,
        labels,
        content,
        featuredImage,
      };
    });
}

module.exports = {
  parseBloggerFeed,
};
