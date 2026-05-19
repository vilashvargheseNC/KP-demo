/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-support
 * Base block: columns
 * Source: https://choose.kaiserpermanente.org/amazon
 * Selector: .planSupport-mainFrame
 * Generated: 2026-05-19
 *
 * Extracts plan support contact columns (pre-enrollment specialist phone info
 * and enrollment link) into a Columns block with side-by-side layout.
 */
export default function parse(element, { document }) {
  // Extract non-empty columns from the source structure
  const columns = Array.from(element.querySelectorAll(
    '.planSupport-column1, .planSupport-column2, .planSupport-column3, [class*="planSupport-column"]'
  ));

  // Filter to only columns that have meaningful content (non-empty heading or description)
  const populatedColumns = columns.filter((col) => {
    const heading = col.querySelector('.planSupport-field-heading, h3, h2');
    const description = col.querySelector('.planSupport-field-description, p');
    const hasHeadingContent = heading && heading.textContent.trim().length > 0;
    const hasDescriptionContent = description && description.textContent.trim().length > 0;
    return hasHeadingContent || hasDescriptionContent;
  });

  // Build cells array - one row with N columns (matching library example structure)
  // Library example: | Column 1 content | Column 2 content |
  const row = populatedColumns.map((col) => {
    const cellContent = [];
    const heading = col.querySelector('.planSupport-field-heading, h3, h2');
    const description = col.querySelector('.planSupport-field-description, p');

    if (heading && heading.textContent.trim().length > 0) {
      cellContent.push(heading);
    }
    if (description && description.textContent.trim().length > 0) {
      cellContent.push(description);
    }
    return cellContent;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-support', cells });
  element.replaceWith(block);
}
