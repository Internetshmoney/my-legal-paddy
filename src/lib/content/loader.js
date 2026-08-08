/**
 * Content loader for markdown posts (Next.js 16 compatible)
 * - Recursively scans content/posts for index.md files
 * - Validates posts using schema.js
 * - Falls back to demo articles if no markdown posts exist
 * - Provides getPosts(), getPostBySlug(), getFeaturedPosts()
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { validatePost } from './schema.js';

let _postsCache = null;

/**
 * Load all markdown posts
 * Falls back to demo articles if no markdown exists
 * @returns {Promise<Array>} Array of post objects
 */
export async function getPosts() {
  // Return cached posts if already loaded
  if (_postsCache !== null) {
    return _postsCache;
  }

  try {
    // Try to load markdown posts
    const markdownPosts = await _loadMarkdownPosts();

    if (markdownPosts.length > 0) {
      _postsCache = markdownPosts;
      return _postsCache;
    }
  } catch (error) {
    console.warn('[Content Loader] Error loading markdown posts:', error.message);
  }

  // Fallback to demo articles
  console.log('[Content Loader] No markdown posts found, using demo articles');
  const demoPosts = await _loadDemoArticles();
  _postsCache = demoPosts;
  return _postsCache;
}

/**
 * Get a single post by slug
 * @param {string} slug - Post slug
 * @returns {Promise<Object|null>} Post object or null if not found
 */
export async function getPostBySlug(slug) {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get all featured posts
 * @returns {Promise<Array>} Array of featured post objects
 */
export async function getFeaturedPosts() {
  const posts = await getPosts();
  return posts.filter((post) => post.featured === true);
}

/**
 * Recursively find all index.md files in a directory
 * @param {string} dir - Directory to scan
 * @returns {string[]} Array of markdown file paths
 * @private
 */
function _findMarkdownFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      files.push(..._findMarkdownFiles(fullPath));
    } else if (entry.name === 'index.md') {
      // Found a markdown file
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Load markdown posts from content/posts directory
 * Recursively discovers all index.md files
 * @returns {Promise<Array>} Array of validated post objects
 * @private
 */
async function _loadMarkdownPosts() {
  const posts = [];
  const postsDir = path.join(process.cwd(), 'content', 'posts');

  // Check if posts directory exists
  if (!fs.existsSync(postsDir)) {
    console.warn('[Content Loader] Posts directory not found:', postsDir);
    return [];
  }

  try {
    // Find all index.md files recursively
    const markdownFiles = _findMarkdownFiles(postsDir);

    if (markdownFiles.length === 0) {
      console.warn('[Content Loader] No index.md files found in', postsDir);
      return [];
    }

    // Process each markdown file
    for (const markdownPath of markdownFiles) {
      try {
        // Read markdown file
        const content = fs.readFileSync(markdownPath, 'utf-8');
        const { data, content: markdown } = matter(content);

        // Validate post metadata using schema.js
        const validation = validatePost(data);
        if (!validation.valid) {
          console.warn(`[Content Loader] Invalid post at ${markdownPath}:`);
          validation.errors.forEach((error) => console.warn(`  - ${error}`));
          continue;
        }

        // Convert markdown to HTML
        const html = await marked(markdown);

        // Extract directory name as fallback slug
        // path: content/posts/article-slug/index.md -> article-slug
        const dirName = path.basename(path.dirname(markdownPath));

        posts.push({
          slug: data.slug || dirName,
          title: data.title,
          excerpt: data.excerpt,
          date: data.date,
          cover: data.cover,
          featured: data.featured || false,
          published: data.published !== false, // default true
          content: html,
          path: markdownPath,
        });
      } catch (error) {
        console.error(
          `[Content Loader] Error processing ${markdownPath}:`,
          error.message
        );
      }
    }

    // Sort by date, newest first
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log(`[Content Loader] Loaded ${posts.length} markdown posts`);
    return posts;
  } catch (error) {
    console.warn('[Content Loader] Failed to load markdown posts:', error.message);
    return [];
  }
}

/**
 * Load demo articles from src/data/articles.js
 * Used as fallback when no markdown posts exist
 * @returns {Promise<Array>} Array of article objects
 * @private
 */
async function _loadDemoArticles() {
  try {
    const { articles } = await import('../data/articles.js');

    // Transform articles to match post schema, preserving all metadata
    const transformedArticles = articles
      .map((article) => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        date: article.date,
        cover: article.image,
        featured: article.featured || false,
        published: true,
        content: null, // Demo articles don't have full HTML content
        isDemoArticle: true,
        // Preserve additional fields from demo articles for component compatibility
        category: article.category,
        author: article.author,
        readTime: article.readingTime,
      }))
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    console.log(`[Content Loader] Loaded ${transformedArticles.length} demo articles`);
    return transformedArticles;
  } catch (error) {
    console.error('[Content Loader] Failed to load demo articles:', error.message);
    return [];
  }
}

/**
 * Load demo articles from src/data/articles.js
 * Used as fallback when no markdown posts exist
 * @returns {Promise<Array>} Array of article objects
 * @private
 */
async function _loadDemoArticles() {
  try {
    const { articles } = await import('../data/articles.js');

    // Transform articles to match post schema, preserving all metadata
    return articles
      .map((article) => ({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        date: article.date,
        cover: article.image,
        featured: article.featured || false,
        published: true,
        content: null, // Demo articles don't have full HTML content
        isDemoArticle: true,
        // Preserve additional fields from demo articles
        category: article.category,
        author: article.author,
        readTime: article.readingTime,
      }))
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  } catch (error) {
    console.error('[Content Loader] Failed to load demo articles:', error.message);
    return [];
  }
}
