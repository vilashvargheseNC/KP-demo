/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Kaiser Permanente cleanup.
 * Removes non-authorable site chrome and widgets from the DOM.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner (found at line 1731: <div id="onetrust-consent-sdk">)
    // Remove global alert component (found at line 452: <div class="global-alert-component ...">)
    // Remove zipcode lookup widget (found at line 466: <div class="zipcode-lookup ...">)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.global-alert-component',
      '.zipcode-lookup',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site header (found at line 5: <div class="experience-fragment_header experiencefragment">)
    // Remove site footer (found at line 1114: <div class="experience-fragment_footer experiencefragment">)
    // Remove print-only div (found at line 2: <div class="print-only">)
    // Remove chat widget (found at line 1103: <div class="chat-co-browse ...">)
    // Remove empty concierge component (found at line 925: <div class="concierge-component ...">)
    // Remove empty wellness rewards widget (found at line 943: <div class="wellness-rewards ...">)
    // Remove AEM clientlib CSS link elements (found throughout)
    // Remove noscript elements
    WebImporter.DOMUtils.remove(element, [
      '.experience-fragment_header',
      '.experience-fragment_footer',
      '.print-only',
      '.chat-co-browse',
      '.concierge-component',
      '.wellness-rewards',
      'link[href*="clientlibs"]',
      'noscript',
    ]);
  }
}
