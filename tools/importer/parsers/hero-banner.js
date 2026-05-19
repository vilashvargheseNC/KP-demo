/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://choose.kaiserpermanente.org/amazon
 * Selector: .banner-component-mainFrame
 * Generated: 2026-05-19
 *
 * Dark blue banner with heading, subheading, description paragraph,
 * CTA button, and three icon cards (Location, Support, Doctors).
 * No background image - uses section-metadata dark-blue for styling.
 */
export default function parse(element, { document }) {
  // Extract main heading (h2.banner-component-mainHeading)
  const heading = element.querySelector('.banner-component-mainHeading, h2');

  // Extract subheading (h3.banner-component-subHeading)
  const subHeading = element.querySelector('.banner-component-subHeading, h3');

  // Extract description paragraph
  const description = element.querySelector('.banner-component-discription, .banner-component-innerFrame p');

  // Extract CTA button link
  const ctaLink = element.querySelector('a.banner-button-font, a.button-bannerComponent, .banner-component-innerFrame > a.button');

  // Extract icon cards from .banner-component-iconContainerDiv
  const iconCards = Array.from(element.querySelectorAll('.banner-component-iconDiv'));

  // Build content container: heading + subheading + description + CTA + icon cards
  // All content goes in a single cell (single-column hero block)
  const contentContainer = document.createElement('div');

  if (heading) contentContainer.appendChild(heading);
  if (subHeading) contentContainer.appendChild(subHeading);
  if (description) contentContainer.appendChild(description);
  if (ctaLink) {
    const ctaPara = document.createElement('p');
    ctaPara.appendChild(ctaLink);
    contentContainer.appendChild(ctaPara);
  }

  // Add icon cards as structured content
  iconCards.forEach((card) => {
    const iconImg = card.querySelector('.banner-component-roundDiv img, .banner-component-icon');
    const iconLabel = card.querySelector('.banner-component-iconText b');
    const iconLink = card.querySelector('.banner-component-iconText a');

    const cardPara = document.createElement('p');
    if (iconImg) cardPara.appendChild(iconImg.cloneNode(true));
    if (iconLabel) {
      const strong = document.createElement('strong');
      strong.textContent = iconLabel.textContent.trim();
      cardPara.appendChild(strong);
      cardPara.appendChild(document.createTextNode(' '));
    }
    if (iconLink) cardPara.appendChild(iconLink.cloneNode(true));
    contentContainer.appendChild(cardPara);
  });

  // Build cells array - no background image row (section uses dark-blue metadata)
  // Structure: single content row with all content in one cell
  const cells = [[contentContainer]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
