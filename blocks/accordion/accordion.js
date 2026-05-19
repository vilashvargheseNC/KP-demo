/**
 * Accordion block
 * Each row is rendered as a <details>/<summary> pair.
 * Row structure (from authored content):
 *   <div>
 *     <div>label / title</div>
 *     <div>body content</div>
 *   </div>
 */
function hasWrapper(el) {
  return el.firstElementChild && el.firstElementChild.tagName === 'DIV' && el.children.length === 1;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // label cell (first), body cell (second)
    const label = row.children[0];
    const body = row.children[1];
    if (!label || !body) return;

    // build details/summary
    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    // move children of label cell into the summary
    while (label.firstChild) summary.append(label.firstChild);

    const content = document.createElement('div');
    content.className = 'accordion-item-body';
    while (body.firstChild) content.append(body.firstChild);

    // Unwrap a single redundant div wrapper
    if (hasWrapper(content)) {
      const inner = content.firstElementChild;
      while (inner.firstChild) content.append(inner.firstChild);
      inner.remove();
    }

    details.append(summary, content);
    row.replaceWith(details);
  });
}
