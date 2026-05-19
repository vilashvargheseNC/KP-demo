/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-amazon-landing.js
  var import_amazon_landing_exports = {};
  __export(import_amazon_landing_exports, {
    default: () => import_amazon_landing_default
  });

  // tools/importer/parsers/hero-welcome.js
  function parse(element, { document }) {
    const image = element.querySelector('img.versionB-image, img[class*="versionB-image"], img[id="versionB-image"]');
    const heading = element.querySelector('h1.versionB-heading, h1.promo-header1, h1[class*="heading"], h2[class*="heading"]');
    const description = element.querySelector('.versionB-description, div[class*="description"]');
    const cta = element.querySelector("a.versionB-button, .versionB-button-div a, a.button");
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentContainer = document.createElement("div");
    if (heading) contentContainer.append(heading);
    if (description) contentContainer.append(description);
    if (cta) contentContainer.append(cta);
    cells.push([contentContainer]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-welcome", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-support.js
  function parse2(element, { document }) {
    const columns = Array.from(element.querySelectorAll(
      '.planSupport-column1, .planSupport-column2, .planSupport-column3, [class*="planSupport-column"]'
    ));
    const populatedColumns = columns.filter((col) => {
      const heading = col.querySelector(".planSupport-field-heading, h3, h2");
      const description = col.querySelector(".planSupport-field-description, p");
      const hasHeadingContent = heading && heading.textContent.trim().length > 0;
      const hasDescriptionContent = description && description.textContent.trim().length > 0;
      return hasHeadingContent || hasDescriptionContent;
    });
    const row = populatedColumns.map((col) => {
      const cellContent = [];
      const heading = col.querySelector(".planSupport-field-heading, h3, h2");
      const description = col.querySelector(".planSupport-field-description, p");
      if (heading && heading.textContent.trim().length > 0) {
        cellContent.push(heading);
      }
      if (description && description.textContent.trim().length > 0) {
        cellContent.push(description);
      }
      return cellContent;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-support", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-video.js
  function parse3(element, { document }) {
    const iframe = element.querySelector(".video-section iframe, iframe.video-iframe, iframe");
    let videoCell = [];
    if (iframe) {
      let videoSrc = iframe.getAttribute("src") || "";
      const cleanUrl = videoSrc.split("?")[0];
      const videoLink = document.createElement("a");
      videoLink.href = cleanUrl;
      videoLink.textContent = cleanUrl;
      videoCell.push(videoLink);
    }
    const contentCell = [];
    const heading = element.querySelector(".content-section h2, h2.video-header, .content-wrapper h2");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    }
    const textContainer = element.querySelector(".video-text, .content-wrapper .video-text");
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll("p");
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && text !== "\xA0" && text !== "") {
          const link = p.querySelector("a[href]");
          if (link && link.getAttribute("href") && link.textContent.trim()) {
            contentCell.push(link);
          } else if (!p.querySelector("a")) {
            const para = document.createElement("p");
            para.textContent = text;
            contentCell.push(para);
          }
        }
      });
    }
    const cells = [
      [videoCell, contentCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-features.js
  function parse4(element, { document }) {
    const tabLinks = element.querySelectorAll(".tabs__list-item a.tabs__link");
    const tabPanels = element.querySelectorAll(".tabs__content > .tabs__panel");
    const cells = [];
    tabLinks.forEach((link, index) => {
      const label = link.getAttribute("title") || link.textContent.replace(/[+−]\s*/, "").trim();
      const panel = tabPanels[index];
      if (!panel) return;
      const contentCell = [];
      const heading = panel.querySelector(".cmp-text h3, h3");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.innerHTML = heading.innerHTML;
        contentCell.push(h3);
      }
      const textContainer = panel.querySelector(".cmp-text");
      if (textContainer) {
        const bodyElements = textContainer.querySelectorAll(":scope > div, :scope > p");
        bodyElements.forEach((el) => {
          if (el.querySelector("h3") || el.tagName === "H3") return;
          const text = el.textContent.trim();
          if (!text || text === "\xA0") return;
          const linkEl = el.querySelector("a");
          if (linkEl && el.textContent.trim() === linkEl.textContent.trim()) {
            const a = document.createElement("a");
            a.href = linkEl.getAttribute("href");
            a.textContent = linkEl.textContent.trim();
            if (linkEl.getAttribute("title")) a.title = linkEl.getAttribute("title");
            contentCell.push(a);
          } else {
            const p = document.createElement("p");
            p.innerHTML = el.innerHTML;
            contentCell.push(p);
          }
        });
      }
      const image = panel.querySelector(".cmp-image img, img");
      if (image) {
        const img = document.createElement("img");
        img.src = image.getAttribute("src");
        if (image.getAttribute("alt")) img.alt = image.getAttribute("alt");
        contentCell.push(img);
      }
      cells.push([label, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-features", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-coverage.js
  function parse5(element, { document }) {
    const isImageElement = element.classList.contains("gs-image-core");
    const isContentGrid = element.classList.contains("responsivegrid") && element.classList.contains("two-col");
    if (isImageElement) {
      const parent = element.parentElement;
      if (!parent) return;
      const siblingGrid = parent.querySelector(":scope > .responsivegrid.two-col");
      if (!siblingGrid) return;
      const careHeading = siblingGrid.querySelector(".cmp-text h3");
      if (!careHeading || !careHeading.textContent.includes("Care")) return;
      const mapImage = element.querySelector("img");
      if (!mapImage) return;
      const contentContainers = siblingGrid.querySelectorAll(".gs-container");
      const col2Content = buildCol2Content(contentContainers);
      if (col2Content.length === 0) return;
      const cells = [[[mapImage], col2Content]];
      const block = WebImporter.Blocks.createBlock(document, { name: "columns-coverage", cells });
      siblingGrid.remove();
      element.replaceWith(block);
    } else if (isContentGrid) {
      const careHeading = element.querySelector(".cmp-text h3");
      if (!careHeading || !careHeading.textContent.includes("Care")) return;
      const parent = element.parentElement;
      if (!parent) return;
      const imageSibling = parent.querySelector(":scope > .gs-image-core");
      if (!imageSibling) {
        element.remove();
        return;
      }
      const mapImage = imageSibling.querySelector("img");
      const contentContainers = element.querySelectorAll(".gs-container");
      const col2Content = buildCol2Content(contentContainers);
      if (col2Content.length === 0) return;
      const cells = [mapImage ? [[mapImage], col2Content] : [[], col2Content]];
      const block = WebImporter.Blocks.createBlock(document, { name: "columns-coverage", cells });
      imageSibling.remove();
      element.replaceWith(block);
    }
  }
  function buildCol2Content(containers) {
    const content = [];
    containers.forEach((container) => {
      const heading = container.querySelector(".cmp-text h3, h3");
      if (heading) {
        content.push(heading);
      }
      const list = container.querySelector(".cmp-text ul, ul");
      if (list) {
        content.push(list);
      }
      const ctaLink = container.querySelector(".gs-button a, a.button");
      if (ctaLink) {
        const iconImgs = ctaLink.querySelectorAll("img");
        iconImgs.forEach((img) => img.remove());
        content.push(ctaLink);
      }
    });
    return content;
  }

  // tools/importer/parsers/hero-banner.js
  function parse6(element, { document }) {
    const heading = element.querySelector(".banner-component-mainHeading, h2");
    const subHeading = element.querySelector(".banner-component-subHeading, h3");
    const description = element.querySelector(".banner-component-discription, .banner-component-innerFrame p");
    const ctaLink = element.querySelector("a.banner-button-font, a.button-bannerComponent, .banner-component-innerFrame > a.button");
    const iconCards = Array.from(element.querySelectorAll(".banner-component-iconDiv"));
    const contentContainer = document.createElement("div");
    if (heading) contentContainer.appendChild(heading);
    if (subHeading) contentContainer.appendChild(subHeading);
    if (description) contentContainer.appendChild(description);
    if (ctaLink) {
      const ctaPara = document.createElement("p");
      ctaPara.appendChild(ctaLink);
      contentContainer.appendChild(ctaPara);
    }
    iconCards.forEach((card) => {
      const iconImg = card.querySelector(".banner-component-roundDiv img, .banner-component-icon");
      const iconLabel = card.querySelector(".banner-component-iconText b");
      const iconLink = card.querySelector(".banner-component-iconText a");
      const cardPara = document.createElement("p");
      if (iconImg) cardPara.appendChild(iconImg.cloneNode(true));
      if (iconLabel) {
        const strong = document.createElement("strong");
        strong.textContent = iconLabel.textContent.trim();
        cardPara.appendChild(strong);
        cardPara.appendChild(document.createTextNode(" "));
      }
      if (iconLink) cardPara.appendChild(iconLink.cloneNode(true));
      contentContainer.appendChild(cardPara);
    });
    const cells = [[contentContainer]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resources.js
  function parse7(element, { document }) {
    const cards = element.querySelectorAll(".feature-card-container");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".feature-thumbnail-image img, img.feature-card-image");
      const titleEl = card.querySelector(".feature-card-title");
      const summaryEl = card.querySelector(".feature-card-summary");
      const ctaLink = card.querySelector(".CTA-link-container a, a.CTA-configurable-text");
      const imageCell = image ? image : "";
      const contentCell = [];
      if (titleEl) {
        const strong = document.createElement("strong");
        strong.textContent = titleEl.textContent.trim();
        contentCell.push(strong);
      }
      if (summaryEl) {
        const descP = document.createElement("p");
        descP.textContent = summaryEl.textContent.trim();
        contentCell.push(descP);
      }
      if (ctaLink) {
        const link = document.createElement("a");
        link.href = ctaLink.href;
        link.textContent = ctaLink.textContent.trim();
        if (ctaLink.title) link.title = ctaLink.title;
        contentCell.push(link);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/kaiserpermanente-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".global-alert-component",
        ".zipcode-lookup"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".experience-fragment_header",
        ".experience-fragment_footer",
        ".print-only",
        ".chat-co-browse",
        ".concierge-component",
        ".wellness-rewards",
        'link[href*="clientlibs"]',
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/kaiserpermanente-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorValue = section.selector;
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
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadataBlock, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadataBlock);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-amazon-landing.js
  var parsers = {
    "hero-welcome": parse,
    "columns-support": parse2,
    "columns-video": parse3,
    "tabs-features": parse4,
    "columns-coverage": parse5,
    "hero-banner": parse6,
    "cards-resources": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "amazon-landing",
    description: "Kaiser Permanente Amazon enrollment landing page with partner-specific content and CTAs",
    urls: [
      "https://choose.kaiserpermanente.org/amazon"
    ],
    blocks: [
      {
        name: "hero-welcome",
        instances: [".promo-v2-versionB-main-frame"]
      },
      {
        name: "columns-support",
        instances: [".planSupport-mainFrame"]
      },
      {
        name: "columns-video",
        instances: [".video-component-container"]
      },
      {
        name: "tabs-features",
        instances: [".tabbed-content.panelcontainer"]
      },
      {
        name: "columns-coverage",
        instances: [".responsivegrid.two-col .gs-image-core, .responsivegrid.two-col .responsivegrid.two-col"]
      },
      {
        name: "hero-banner",
        instances: [".banner-component-mainFrame"]
      },
      {
        name: "cards-resources",
        instances: ["#card-pattern-component-mainFrame"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Section",
        selector: ".promo.aem-GridColumn",
        style: null,
        blocks: ["hero-welcome"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Plan Support Section",
        selector: ".container-content.pale-blue",
        style: "pale-blue",
        blocks: ["columns-support"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Video Section",
        selector: ".video-component.aem-GridColumn",
        style: null,
        blocks: ["columns-video"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Why Kaiser Permanente Section",
        selector: [".text.aem-GridColumn #text-d28e84b210", ".tabbed-content.panelcontainer"],
        style: null,
        blocks: ["tabs-features"],
        defaultContent: ["#text-d28e84b210 h2"]
      },
      {
        id: "section-5",
        name: "Everything in One Place Section",
        selector: "#promo-2016534242",
        style: null,
        blocks: [],
        defaultContent: [".promo-title.sectionTitle", ".body-details.sectionBody", ".button-font-healthy"]
      },
      {
        id: "section-6",
        name: "Coverage Section",
        selector: ["#text-45604a82ca", ".responsivegrid.two-col"],
        style: null,
        blocks: ["columns-coverage"],
        defaultContent: ["#text-45604a82ca h2", "#text-45604a82ca p"]
      },
      {
        id: "section-7",
        name: "Experience Banner Section",
        selector: ".banner-component.aem-GridColumn",
        style: "dark-blue",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Additional Information Section",
        selector: ".card-pattern-component.aem-GridColumn",
        style: null,
        blocks: ["cards-resources"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Footnotes Section",
        selector: ".footnotes-component.aem-GridColumn",
        style: null,
        blocks: [],
        defaultContent: [".footnotes-hrLine", ".footnotes-sectionHeader", ".footnotes-sectionBody"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_amazon_landing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_amazon_landing_exports);
})();
