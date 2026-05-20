const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { TwitterApi } = require('twitter-api-v2');

// Check for required environment variables
const {
  TWITTER_APP_KEY,
  TWITTER_APP_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET,
  BLUESKY_IDENTIFIER,
  BLUESKY_PASSWORD,
} = process.env;

const BASE_URL = 'https://nirmalhk7.com';

async function postToTwitter(text) {
  if (!TWITTER_APP_KEY || !TWITTER_APP_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
    console.log('Twitter credentials missing, skipping...');
    return;
  }
  try {
    const client = new TwitterApi({
      appKey: TWITTER_APP_KEY,
      appSecret: TWITTER_APP_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_SECRET,
    });
    await client.v2.tweet(text);
    console.log('Successfully posted to Twitter!');
  } catch (error) {
    console.error('Error posting to Twitter:', error);
  }
}

async function postToBluesky(text) {
  if (!BLUESKY_IDENTIFIER || !BLUESKY_PASSWORD) {
    console.log('Bluesky credentials missing, skipping...');
    return;
  }
  // Bluesky API is straightforward with fetch
  try {
    const loginRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: BLUESKY_IDENTIFIER, password: BLUESKY_PASSWORD }),
    });
    const session = await loginRes.json();
    
    await fetch('https://bsky.social/xrpc/app.bsky.feed.post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessJwt}`,
      },
      body: JSON.stringify({
        repo: session.did,
        record: {
          text: text,
          createdAt: new Date().toISOString(),
          $type: 'app.bsky.feed.post',
        },
      }),
    });
    console.log('Successfully posted to Bluesky!');
  } catch (error) {
    console.error('Error posting to Bluesky:', error);
  }
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.log('No files provided.');
    return;
  }

  for (const file of files) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, 'utf8');
    const { data: frontmatter } = matter(content);
    const slug = path.basename(file, '.md');
    const title = frontmatter.title || 'New Blog Post';
    const url = `${BASE_URL}/blog/${slug}`;
    
    const message = `🚀 New blog post: "${title}"\n\nRead more here: ${url}\n\n#webdev #softwareengineering #coding`;

    console.log(`Processing: ${title}`);
    await postToTwitter(message);
    await postToBluesky(message);
  }
}

main();
