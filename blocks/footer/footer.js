import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const ICON_BY_ALT = {
  'kaiser permanente': '/icons/kp-logo.svg',
  twitter: '/icons/twitter-white.svg',
  x: '/icons/twitter-white.svg',
  facebook: '/icons/facebook-white.svg',
  youtube: '/icons/youtube-white.svg',
  pinterest: '/icons/pinterest-white.svg',
  instagram: '/icons/instagram-white.svg',
};

function repairBrokenImages(footer) {
  footer.querySelectorAll('img').forEach((img) => {
    if (img.src && img.src !== 'about:error' && img.naturalWidth !== 0) return;
    const key = (img.alt || '').trim().toLowerCase();
    const replacement = ICON_BY_ALT[key];
    if (replacement) {
      // The doc author wraps each image in a <picture> with srcset variants
      // that also point at the broken source — replace the whole picture.
      const picture = img.closest('picture');
      const fresh = document.createElement('img');
      fresh.src = replacement;
      fresh.alt = img.alt;
      fresh.loading = 'lazy';
      (picture || img).replaceWith(fresh);
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  repairBrokenImages(footer);

  block.append(footer);
}
