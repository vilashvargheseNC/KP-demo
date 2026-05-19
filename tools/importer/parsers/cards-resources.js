/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resources
 * Base block: cards
 * Source: https://choose.kaiserpermanente.org/amazon
 * Generated: 2026-05-19
 *
 * Extracts card items from #card-pattern-component-mainFrame.
 * Each card has an image, title, description, and CTA link.
 * Structure: 2 columns per row (image | text content with title, description, CTA link), one row per card.
 */
export default function parse(element, { document }) {
  // Find all card containers within the feature card row
  const cards = element.querySelectorAll('.feature-card-container');

  const cells = [];

  cards.forEach((card) => {
    // Extract image from .feature-thumbnail-image
    const image = card.querySelector('.feature-thumbnail-image img, img.feature-card-image');

    // Extract title from .feature-card-title
    const titleEl = card.querySelector('.feature-card-title');

    // Extract description/summary from .feature-card-summary
    const summaryEl = card.querySelector('.feature-card-summary');

    // Extract CTA link from .CTA-link-container
    const ctaLink = card.querySelector('.CTA-link-container a, a.CTA-configurable-text');

    // Build the image cell (column 1)
    const imageCell = image ? image : '';

    // Build the text content cell (column 2): title (bold) + description + CTA link
    const contentCell = [];

    if (titleEl) {
      // Create a bold element for the title to match the library example format
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      contentCell.push(strong);
    }

    if (summaryEl) {
      const descP = document.createElement('p');
      descP.textContent = summaryEl.textContent.trim();
      contentCell.push(descP);
    }

    if (ctaLink) {
      // Create a clean link without the inline arrow image
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      if (ctaLink.title) link.title = ctaLink.title;
      contentCell.push(link);
    }

    // Each card is one row with 2 columns: [image, textContent]
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resources', cells });
  element.replaceWith(block);
}
