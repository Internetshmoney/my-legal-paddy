# Blogger Migration Tools

This directory contains tools for migrating articles from Blogger Takeout exports to the My Legal Paddy markdown-based content system.

## Process

1. **Export your Blogger data**
   - Download your Blogger Takeout data (XML format)
   - Place the XML file in this directory or a subdirectory

2. **Run the converter**
   - Use `convert.js` to transform Blogger XML → Markdown posts
   - Converts HTML content to Markdown syntax
   - Extracts metadata and creates frontmatter
   - Places each post in `content/posts/{slug}/index.md`

3. **Verify**
   - The site will automatically load markdown posts once they exist
   - No component changes needed — the loader handles it

## File Structure

- `README.md` — This file, migration documentation
- `convert.js` — (To be created) Blogger XML → Markdown converter
- `data/` — Place your Blogger Takeout XML files here

## Post Structure After Migration

Each migrated post will look like:

```
content/posts/
  article-slug/
    index.md           # Markdown file with frontmatter
    cover.jpg          # Cover image (if available)
```

## Frontmatter Format

```yaml
---
title: Article Title
slug: article-slug
excerpt: Short summary
date: 2026-07-08
cover: cover.jpg
featured: true
published: true
---

# Article content in markdown...
```

## Status

- [x] Architecture ready
- [x] Loader implemented (with auto-fallback to demo articles)
- [ ] Blogger converter (convert.js) — to be implemented
- [ ] Migration guide — to be documented

## Notes

- Until migration is complete, the site uses demo articles automatically
- The content loader is independent and tested separately
- Component integration happens only after at least one markdown post exists
