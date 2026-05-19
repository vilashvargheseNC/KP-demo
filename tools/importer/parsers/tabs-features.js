/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-features
 * Base block: tabs
 * Source: https://choose.kaiserpermanente.org/amazon
 * Selector: .tabbed-content.panelcontainer
 * Generated: 2026-05-19
 *
 * Source structure:
 * - .tabs__nav > .tabs__list > .tabs__list-item > a.tabs__link (tab labels via title attr)
 * - .tabs__content > .tabs__panel (tab panels with text + image content)
 * Each panel has: .cmp-text (h3, body, links) and .cmp-image > img
 *
 * Target structure (from library):
 * | Tabs |
 * |---|---|
 * | Tab Label | Tab Content |
 * One row per tab, two columns: label and content.
 */
export default function parse(element, { document }) {
  // Extract tab labels from navigation
  const tabLinks = element.querySelectorAll('.tabs__list-item a.tabs__link');
  // Extract tab panels
  const tabPanels = element.querySelectorAll('.tabs__content > .tabs__panel');

  const cells = [];

  // Build one row per tab: [label, content]
  tabLinks.forEach((link, index) => {
    // Get tab label from title attribute or text content (excluding icon span)
    const label = link.getAttribute('title') || link.textContent.replace(/[+−]\s*/, '').trim();

    // Get corresponding panel content
    const panel = tabPanels[index];
    if (!panel) return;

    // Build content cell with all meaningful elements from the panel
    const contentCell = [];

    // Extract heading (h3) from the panel
    const heading = panel.querySelector('.cmp-text h3, h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.innerHTML = heading.innerHTML;
      contentCell.push(h3);
    }

    // Extract body text (divs and paragraphs that are not headings, not empty)
    const textContainer = panel.querySelector('.cmp-text');
    if (textContainer) {
      const bodyElements = textContainer.querySelectorAll(':scope > div, :scope > p');
      bodyElements.forEach((el) => {
        // Skip the heading we already captured, and skip empty/whitespace-only elements
        if (el.querySelector('h3') || el.tagName === 'H3') return;
        const text = el.textContent.trim();
        if (!text || text === ' ') return;

        // Check if element contains a link (CTA)
        const linkEl = el.querySelector('a');
        if (linkEl && el.textContent.trim() === linkEl.textContent.trim()) {
          // Standalone link - create as link element
          const a = document.createElement('a');
          a.href = linkEl.getAttribute('href');
          a.textContent = linkEl.textContent.trim();
          if (linkEl.getAttribute('title')) a.title = linkEl.getAttribute('title');
          contentCell.push(a);
        } else {
          // Regular text content - preserve as paragraph
          const p = document.createElement('p');
          p.innerHTML = el.innerHTML;
          contentCell.push(p);
        }
      });
    }

    // Extract image from the panel
    const image = panel.querySelector('.cmp-image img, img');
    if (image) {
      const img = document.createElement('img');
      img.src = image.getAttribute('src');
      if (image.getAttribute('alt')) img.alt = image.getAttribute('alt');
      contentCell.push(img);
    }

    cells.push([label, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-features', cells });
  element.replaceWith(block);
}
