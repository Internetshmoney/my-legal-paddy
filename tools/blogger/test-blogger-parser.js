const path = require('path');
const { parseBloggerFeed } = require('../src/lib/blogger/parseBloggerFeed');

const feedPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, '..', 'Takeout', 'Blogger', 'Blogs', 'My Legal Paddy', 'feed.atom');

try {
  const articles = parseBloggerFeed(feedPath);

  console.log('Total posts:', articles.length);
  console.log('First 3 titles:');
  articles.slice(0, 3).forEach((article, index) => {
    console.log(`${index + 1}. ${article.title || '(no title)'}`);
  });

  console.log('First 3 slugs:');
  articles.slice(0, 3).forEach((article, index) => {
    console.log(`${index + 1}. ${article.slug || '(no slug)'}`);
  });

  console.log('First 3 dates:');
  articles.slice(0, 3).forEach((article, index) => {
    console.log(`${index + 1}. ${article.published || article.updated || '(no date)'}`);
  });
} catch (error) {
  console.error('Failed to parse Blogger feed:', error.message);
  process.exitCode = 1;
}
