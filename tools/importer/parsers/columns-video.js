/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-video
 * Base block: columns
 * Source: https://choose.kaiserpermanente.org/amazon
 * Selector: .video-component-container
 * Generated: 2026-05-19
 *
 * Structure: 2 columns per row
 *   Column 1: Video embed link (extracted from iframe src)
 *   Column 2: Heading + description paragraph
 */
export default function parse(element, { document }) {
  // Column 1: Extract video URL from iframe
  const iframe = element.querySelector('.video-section iframe, iframe.video-iframe, iframe');
  let videoCell = [];
  if (iframe) {
    // Extract the video URL, removing autoplay parameter for clean embed link
    let videoSrc = iframe.getAttribute('src') || '';
    // Remove query params to get clean embed URL
    const cleanUrl = videoSrc.split('?')[0];
    const videoLink = document.createElement('a');
    videoLink.href = cleanUrl;
    videoLink.textContent = cleanUrl;
    videoCell.push(videoLink);
  }

  // Column 2: Extract heading and description text
  const contentCell = [];

  // Heading - source has h2.video-header containing nested p > b
  const heading = element.querySelector('.content-section h2, h2.video-header, .content-wrapper h2');
  if (heading) {
    // Create a clean heading element with just the text content
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    contentCell.push(h2);
  }

  // Description paragraph(s) from .video-text
  const textContainer = element.querySelector('.video-text, .content-wrapper .video-text');
  if (textContainer) {
    const paragraphs = textContainer.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent.trim();
      // Skip empty paragraphs and non-breaking space only paragraphs
      if (text && text !== ' ' && text !== '') {
        // Check if the paragraph contains a meaningful link
        const link = p.querySelector('a[href]');
        if (link && link.getAttribute('href') && link.textContent.trim()) {
          contentCell.push(link);
        } else if (!p.querySelector('a')) {
          // Regular text paragraph (no link inside)
          const para = document.createElement('p');
          para.textContent = text;
          contentCell.push(para);
        }
      }
    });
  }

  // Build cells: single row with 2 columns [video | content]
  const cells = [
    [videoCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-video', cells });
  element.replaceWith(block);
}
