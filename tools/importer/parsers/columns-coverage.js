/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-coverage
 * Base block: columns
 * Source: https://choose.kaiserpermanente.org/amazon
 * Generated: 2026-05-19
 *
 * Layout: US map image in column 1, two content subsections in column 2
 * (each with heading, bullet list, and CTA link).
 *
 * The selector matches two sibling types within the coverage section:
 *   1. .responsivegrid.two-col .gs-image-core (the map image)
 *   2. .responsivegrid.two-col .responsivegrid.two-col (the nested content grid)
 *
 * Strategy:
 * - When called on .gs-image-core: verify it's the coverage map (sibling has "Care" headings),
 *   then build the full block and replace this element. Also remove the sibling content grid.
 * - When called on nested .responsivegrid.two-col: verify it has "Care" headings,
 *   check if image sibling exists. If so, build the block. If not, element was already handled.
 */
export default function parse(element, { document }) {
  const isImageElement = element.classList.contains('gs-image-core');
  const isContentGrid = element.classList.contains('responsivegrid') && element.classList.contains('two-col');

  if (isImageElement) {
    // Verify this is the coverage section map image by checking siblings for "Care" headings
    const parent = element.parentElement;
    if (!parent) return;

    const siblingGrid = parent.querySelector(':scope > .responsivegrid.two-col');
    if (!siblingGrid) return;

    const careHeading = siblingGrid.querySelector('.cmp-text h3');
    if (!careHeading || !careHeading.textContent.includes('Care')) return;

    // Extract map image
    const mapImage = element.querySelector('img');
    if (!mapImage) return;

    // Extract content from sibling grid's .gs-container elements
    const contentContainers = siblingGrid.querySelectorAll('.gs-container');
    const col2Content = buildCol2Content(contentContainers);

    if (col2Content.length === 0) return;

    // Build cells: single row with 2 columns
    const cells = [[[ mapImage ], col2Content]];

    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-coverage', cells });

    // Remove the sibling content grid since we consumed it
    siblingGrid.remove();

    // Replace this element with the block
    element.replaceWith(block);
  } else if (isContentGrid) {
    // Verify this is the coverage content grid
    const careHeading = element.querySelector('.cmp-text h3');
    if (!careHeading || !careHeading.textContent.includes('Care')) return;

    // Check if the image sibling still exists (means it hasn't been processed yet)
    const parent = element.parentElement;
    if (!parent) return;

    const imageSibling = parent.querySelector(':scope > .gs-image-core');
    if (!imageSibling) {
      // Image element already handled this block - just remove ourselves
      element.remove();
      return;
    }

    // Image sibling exists but hasn't been processed yet - build the full block
    const mapImage = imageSibling.querySelector('img');
    const contentContainers = element.querySelectorAll('.gs-container');
    const col2Content = buildCol2Content(contentContainers);

    if (col2Content.length === 0) return;

    const cells = [mapImage ? [[mapImage], col2Content] : [[], col2Content]];

    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-coverage', cells });

    // Remove the image sibling since we consumed it
    imageSibling.remove();

    // Replace this element with the block
    element.replaceWith(block);
  }
}

/**
 * Builds column 2 content from gs-container elements.
 * Each container has: heading (h3), bullet list (ul), CTA link (a.button).
 */
function buildCol2Content(containers) {
  const content = [];

  containers.forEach((container) => {
    // Extract heading
    const heading = container.querySelector('.cmp-text h3, h3');
    if (heading) {
      content.push(heading);
    }

    // Extract bullet list
    const list = container.querySelector('.cmp-text ul, ul');
    if (list) {
      content.push(list);
    }

    // Extract CTA link and clean up inline icon images
    const ctaLink = container.querySelector('.gs-button a, a.button');
    if (ctaLink) {
      const iconImgs = ctaLink.querySelectorAll('img');
      iconImgs.forEach((img) => img.remove());
      content.push(ctaLink);
    }
  });

  return content;
}
