/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-welcome
 * Base block: hero
 * Source: https://choose.kaiserpermanente.org/amazon
 * Selector: .promo-v2-versionB-main-frame
 * Generated: 2026-05-19
 *
 * Structure (from block library):
 *   Row 1: Image (background/hero image)
 *   Row 2: Content (heading + description + CTA)
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  const image = element.querySelector('img.versionB-image, img[class*="versionB-image"], img[id="versionB-image"]');

  // Extract heading
  const heading = element.querySelector('h1.versionB-heading, h1.promo-header1, h1[class*="heading"], h2[class*="heading"]');

  // Extract description text
  const description = element.querySelector('.versionB-description, div[class*="description"]');

  // Extract CTA button/link
  const cta = element.querySelector('a.versionB-button, .versionB-button-div a, a.button');

  // Build cells to match block library structure:
  // Row 1 = image, Row 2 = content (heading + description + CTA)
  const cells = [];

  // Row 1: Image
  if (image) {
    cells.push([image]);
  }

  // Row 2: Content cell (heading + description + CTA combined in single cell)
  const contentContainer = document.createElement('div');
  if (heading) contentContainer.append(heading);
  if (description) contentContainer.append(description);
  if (cta) contentContainer.append(cta);
  cells.push([contentContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-welcome', cells });
  element.replaceWith(block);
}
