/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroWelcomeParser from './parsers/hero-welcome.js';
import columnsSupportParser from './parsers/columns-support.js';
import columnsVideoParser from './parsers/columns-video.js';
import tabsFeaturesParser from './parsers/tabs-features.js';
import columnsCoverageParser from './parsers/columns-coverage.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsResourcesParser from './parsers/cards-resources.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/kaiserpermanente-cleanup.js';
import sectionsTransformer from './transformers/kaiserpermanente-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-welcome': heroWelcomeParser,
  'columns-support': columnsSupportParser,
  'columns-video': columnsVideoParser,
  'tabs-features': tabsFeaturesParser,
  'columns-coverage': columnsCoverageParser,
  'hero-banner': heroBannerParser,
  'cards-resources': cardsResourcesParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'amazon-landing',
  description: 'Kaiser Permanente Amazon enrollment landing page with partner-specific content and CTAs',
  urls: [
    'https://choose.kaiserpermanente.org/amazon',
  ],
  blocks: [
    {
      name: 'hero-welcome',
      instances: ['.promo-v2-versionB-main-frame'],
    },
    {
      name: 'columns-support',
      instances: ['.planSupport-mainFrame'],
    },
    {
      name: 'columns-video',
      instances: ['.video-component-container'],
    },
    {
      name: 'tabs-features',
      instances: ['.tabbed-content.panelcontainer'],
    },
    {
      name: 'columns-coverage',
      instances: ['.responsivegrid.two-col .gs-image-core, .responsivegrid.two-col .responsivegrid.two-col'],
    },
    {
      name: 'hero-banner',
      instances: ['.banner-component-mainFrame'],
    },
    {
      name: 'cards-resources',
      instances: ['#card-pattern-component-mainFrame'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Section',
      selector: '.promo.aem-GridColumn',
      style: null,
      blocks: ['hero-welcome'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Plan Support Section',
      selector: '.container-content.pale-blue',
      style: 'pale-blue',
      blocks: ['columns-support'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Video Section',
      selector: '.video-component.aem-GridColumn',
      style: null,
      blocks: ['columns-video'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Why Kaiser Permanente Section',
      selector: ['.text.aem-GridColumn #text-d28e84b210', '.tabbed-content.panelcontainer'],
      style: null,
      blocks: ['tabs-features'],
      defaultContent: ['#text-d28e84b210 h2'],
    },
    {
      id: 'section-5',
      name: 'Everything in One Place Section',
      selector: '#promo-2016534242',
      style: null,
      blocks: [],
      defaultContent: ['.promo-title.sectionTitle', '.body-details.sectionBody', '.button-font-healthy'],
    },
    {
      id: 'section-6',
      name: 'Coverage Section',
      selector: ['#text-45604a82ca', '.responsivegrid.two-col'],
      style: null,
      blocks: ['columns-coverage'],
      defaultContent: ['#text-45604a82ca h2', '#text-45604a82ca p'],
    },
    {
      id: 'section-7',
      name: 'Experience Banner Section',
      selector: '.banner-component.aem-GridColumn',
      style: 'dark-blue',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Additional Information Section',
      selector: '.card-pattern-component.aem-GridColumn',
      style: null,
      blocks: ['cards-resources'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Footnotes Section',
      selector: '.footnotes-component.aem-GridColumn',
      style: null,
      blocks: [],
      defaultContent: ['.footnotes-hrLine', '.footnotes-sectionHeader', '.footnotes-sectionBody'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
