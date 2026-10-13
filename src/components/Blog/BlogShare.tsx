import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faFacebook, faLinkedin, faBluesky, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { trackEvent, trackShare } from '@/util/analytics';
import styles from '@/components/Site/editorial.module.scss';

export default function BlogShare({ slug, title }: { slug: string; title: string }) {
  const [status, setStatus] = React.useState('');
  const [manualUrl, setManualUrl] = React.useState('');
  const [copying, setCopying] = React.useState(false);
  const getShare = (method: string) => {
    const tags = {
      utm_source: method,
      utm_medium: method === 'email' ? 'email' : method === 'copy' ? 'referral' : 'social',
      utm_campaign: 'blog_share',
      utm_content: 'article_footer',
      utm_term: slug,
    };
    return {
      tags,
      url: `https://nirmalhk7.com/blog/${encodeURIComponent(slug)}?${new URLSearchParams(tags)}`,
    };
  };
  const recordShare = (method: string, action: string, failed = false) => {
    const { tags } = getShare(method);
    const details = {
      ...tags,
      share_action: action,
      share_placement: 'article_footer',
      shared_at: new Date().toISOString(),
      // GA4 string parameters have a 100-character limit; tags are sent separately.
      shared_path: `/blog/${slug}`,
      transport_type: 'beacon',
    };
    if (failed) {
      trackEvent('share_error', { method, content_type: 'blog_post', item_id: slug, ...details });
    } else {
      trackShare(method, 'blog_post', slug, details);
    }
  };
  const copyLink = async (method: 'copy' | 'instagram') => {
    setCopying(true);
    setManualUrl('');
    const { url } = getShare(method);
    try {
      await navigator.clipboard.writeText(url);
      setStatus(method === 'instagram'
        ? 'Instagram link copied. Paste it into a Story link sticker, bio, or message in Instagram.'
        : 'Link copied. Ready to share.');
      recordShare(method, 'link_copied');
    } catch {
      setManualUrl(url);
      setStatus('Could not copy automatically. Select and copy the tagged link below.');
      recordShare(method, 'copy_failed', true);
    } finally {
      setCopying(false);
    }
  };
  const buttons = [
    { name: 'X', method: 'x', icon: faXTwitter, href: `https://twitter.com/intent/tweet?${new URLSearchParams({ url: getShare('x').url, text: title })}` },
    { name: 'Facebook', method: 'facebook', icon: faFacebook, href: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: getShare('facebook').url })}` },
    { name: 'LinkedIn', method: 'linkedin', icon: faLinkedin, href: `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url: getShare('linkedin').url })}` },
    { name: 'Bluesky', method: 'bluesky', icon: faBluesky, href: `https://bsky.app/intent/compose?${new URLSearchParams({ text: `${title}\n\n${getShare('bluesky').url}` })}` },
    { name: 'Email', method: 'email', icon: faEnvelope, href: `mailto:?${new URLSearchParams({ subject: title, body: `${title}\n\n${getShare('email').url}` })}` },
  ];

  return (
    <div data-analytics-skip-global="true">
      <div className={styles.shareLinks} aria-label="Share this article">
        <button type="button" disabled={copying} onClick={() => copyLink('copy')}>Copy link</button>
        {buttons.map(share => (
          <a key={share.method} href={share.href} target="_blank" rel="noopener noreferrer"
            aria-label={`Share on ${share.name}`} title={`Share on ${share.name}`}
            onClick={() => recordShare(share.method, 'composer_opened')}>
            <FontAwesomeIcon icon={share.icon} aria-hidden="true" />
            <span className="sr-only">{share.name}</span>
          </a>
        ))}
        <button type="button" disabled={copying} aria-label="Copy link for Instagram"
          onClick={() => copyLink('instagram')}>
          <FontAwesomeIcon icon={faInstagram} aria-hidden="true" /> Instagram
        </button>
      </div>
      <p role="status">{status}</p>
      {manualUrl && <input aria-label="Share link to copy" value={manualUrl} readOnly
        onFocus={event => event.currentTarget.select()} className={styles.shareCopyInput} />}
    </div>
  );
}
