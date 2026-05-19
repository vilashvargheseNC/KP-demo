import { createOptimizedPicture } from '../../scripts/aem.js';

const ICON_BY_ALT = {
  'open enrollment video': '/icons/video-open-enrollment.png',
  'online tools video': '/icons/video-online-tools.jpg',
  'wellness tools and resources video': '/icons/video-wellness.jpg',
};

function repairBrokenImage(img) {
  if (img.src && img.src !== 'about:error' && img.naturalWidth !== 0) return img;
  const key = (img.alt || '').trim().toLowerCase();
  const replacement = ICON_BY_ALT[key];
  if (!replacement) return img;
  const fresh = document.createElement('img');
  fresh.src = replacement;
  fresh.alt = img.alt;
  fresh.loading = 'lazy';
  img.replaceWith(fresh);
  return fresh;
}

function isImageWrapper(div) {
  // First child is a picture, OR a paragraph that contains only an image.
  if (div.children.length !== 1) return false;
  const only = div.firstElementChild;
  if (only.tagName === 'PICTURE') return true;
  if (only.tagName === 'P' && only.children.length === 1 && only.firstElementChild.tagName === 'IMG') return true;
  return false;
}

export default function decorate(block) {
  // If any card body's first paragraph is the literal "Video" label, treat as video cards
  const isVideo = [...block.children].some((row) => [...row.children].some((cell) => {
    const firstP = cell.querySelector(':scope > p:first-child');
    return firstP && /^video$/i.test(firstP.textContent.trim());
  }));
  if (isVideo) block.classList.add('video-cards');

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (isImageWrapper(div)) {
        div.className = 'cards-resources-card-image';
        // unwrap paragraph if needed
        const p = div.querySelector(':scope > p');
        if (p && p.firstElementChild && p.firstElementChild.tagName === 'IMG') {
          p.replaceWith(p.firstElementChild);
        }
      } else {
        div.className = 'cards-resources-card-body';
      }
    });
    ul.append(li);
  });

  // Repair broken images (about:error or naturalWidth==0) using alt-text map
  ul.querySelectorAll('img').forEach((img) => {
    const repaired = repairBrokenImage(img);
    // Only wrap non-broken images in optimized picture
    if (repaired.src && repaired.src.startsWith('/')) return; // local icon, leave as-is
    if (!repaired.src || repaired.src === 'about:error') return;
    const optimizedPic = createOptimizedPicture(repaired.src, repaired.alt, false, [{ width: '750' }]);
    if (repaired.closest('picture')) {
      repaired.closest('picture').replaceWith(optimizedPic);
    } else {
      repaired.replaceWith(optimizedPic);
    }
  });

  block.textContent = '';
  block.append(ul);
}
