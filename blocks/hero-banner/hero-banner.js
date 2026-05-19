export default function decorate(block) {
  // Add no-image class if no picture in a dedicated image row
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Get the single cell containing all content
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const children = [...cell.children];

  // Find the boundary between main content and icon items
  // Icon items are paragraphs that contain: picture + strong + a
  const iconParagraphs = [];
  const contentElements = [];
  let ctaParagraph = null;

  children.forEach((child) => {
    const hasPicture = child.querySelector(':scope > picture');
    const hasStrong = child.querySelector(':scope > strong');
    const hasLink = child.querySelector(':scope > a');

    if (hasPicture && hasStrong && hasLink) {
      // This is an icon item (picture + strong label + link)
      iconParagraphs.push(child);
    } else if (
      child.tagName === 'P'
      && hasLink
      && !hasStrong
      && child.textContent.trim().match(/^(Enroll|Sign up|Register|Get started)/i)
    ) {
      // This is the CTA button paragraph
      ctaParagraph = child;
    } else {
      contentElements.push(child);
    }
  });

  // Fix links that had their text split out by EDS decoration
  // Pattern: text node "Link text" followed by <a><picture></picture></a>
  // Fix: move the text node into the <a> before the picture
  function fixSplitLinks(container) {
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      // Check if link only contains a picture (external link icon)
      if (link.children.length === 1 && link.children[0].tagName === 'PICTURE') {
        const prevNode = link.previousSibling;
        if (prevNode && prevNode.nodeType === 3 && prevNode.textContent.trim()) {
          // Move text into the link before the picture
          const textSpan = document.createElement('span');
          textSpan.textContent = prevNode.textContent.trim();
          link.insertBefore(textSpan, link.firstChild);
          prevNode.remove();
        }
      }
    });
  }

  // Build the content wrapper (h3, body text)
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-banner-content';

  // Move content elements (except h2) into the content wrapper
  const h2 = cell.querySelector('h2');
  contentElements.forEach((el) => {
    if (el !== h2) {
      contentWrapper.appendChild(el);
    }
  });

  // Fix split links in the content area
  fixSplitLinks(contentWrapper);

  // Add CTA if found
  if (ctaParagraph) {
    // Fix the CTA link - move text into the anchor
    const ctaLink = ctaParagraph.querySelector('a');
    if (ctaLink && ctaLink.children.length === 1 && ctaLink.children[0].tagName === 'PICTURE') {
      const prevNode = ctaLink.previousSibling;
      if (prevNode && prevNode.nodeType === 3 && prevNode.textContent.trim()) {
        const textSpan = document.createElement('span');
        textSpan.textContent = prevNode.textContent.trim();
        ctaLink.insertBefore(textSpan, ctaLink.firstChild);
        prevNode.remove();
      }
    }
    ctaParagraph.classList.add('hero-banner-cta');
    contentWrapper.appendChild(ctaParagraph);
  }

  // Build the icons section
  let iconsWrapper = null;
  if (iconParagraphs.length > 0) {
    iconsWrapper = document.createElement('div');
    iconsWrapper.className = 'hero-banner-icons';

    iconParagraphs.forEach((p) => {
      const item = document.createElement('div');
      item.className = 'hero-banner-icon-item';

      // Get the first picture (the icon)
      const iconPicture = p.querySelector(':scope > picture');
      if (iconPicture) {
        item.appendChild(iconPicture);
      }

      // Create text container for strong + link
      const textDiv = document.createElement('div');
      textDiv.className = 'hero-banner-icon-text';

      const strong = p.querySelector(':scope > strong');
      const link = p.querySelector(':scope > a');

      if (strong) textDiv.appendChild(strong);
      if (link) {
        // Fix split link text - move preceding text into the anchor
        if (link.children.length === 1 && link.children[0].tagName === 'PICTURE') {
          // The link text might be a text node before the link in the original <p>
          // Look for remaining text nodes in p
          const textNodes = [...p.childNodes].filter(
            (n) => n.nodeType === 3 && n.textContent.trim(),
          );
          const linkTextNode = textNodes.find(
            (n) => n.textContent.trim().match(/^(Find|Get|Learn|See|View|Contact)/i),
          );
          if (linkTextNode) {
            const textSpan = document.createElement('span');
            textSpan.textContent = linkTextNode.textContent.trim();
            link.insertBefore(textSpan, link.firstChild);
            linkTextNode.remove();
          }
        }
        textDiv.appendChild(link);
      }

      item.appendChild(textDiv);
      iconsWrapper.appendChild(item);
    });
  }

  // Rebuild the cell
  cell.innerHTML = '';
  if (h2) cell.appendChild(h2);
  cell.appendChild(contentWrapper);
  if (iconsWrapper) cell.appendChild(iconsWrapper);
}
