/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kaiser Permanente sections.
 * Splits the page into sections based on template definitions and adds
 * section-metadata blocks where sections have style values.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Template sections (from page-templates.json):
 *   section-1: .promo.aem-GridColumn (Hero Section) - no style
 *   section-2: .container-content.pale-blue (Plan Support) - style: pale-blue
 *   section-3: .video-component.aem-GridColumn (Video) - no style
 *   section-4: [#text-d28e84b210, .tabbed-content.panelcontainer] (Why KP) - no style
 *   section-5: #promo-2016534242 (Everything in One Place) - no style
 *   section-6: [#text-45604a82ca, .responsivegrid.two-col] (Coverage) - no style
 *   section-7: .banner-component.aem-GridColumn (Experience Banner) - style: dark-blue
 *   section-8: .card-pattern-component.aem-GridColumn (Additional Info) - no style
 *   section-9: .footnotes-component.aem-GridColumn (Footnotes) - no style
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const template = payload.template;

    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const sections = template.sections;

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectorValue = section.selector;

      // Find the first element matching this section's selector
      let sectionEl = null;
      if (Array.isArray(selectorValue)) {
        for (const sel of selectorValue) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(selectorValue);
      }

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });

        // Insert section-metadata after the section element (at end of section)
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadataBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadataBlock);
        }
      }

      // Insert <hr> before the section element (section break) for all sections except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
