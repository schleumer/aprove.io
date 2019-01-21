export default function getScrollParent(element: HTMLElement): HTMLElement {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRx = /(auto|scroll)/;

  const docEl = document.documentElement;

  if (style.position === "fixed") { return docEl; }

  let parent = element;

  while (parent !== null) {
    style = getComputedStyle(parent);

    if (excludeStaticParent && style.position === "static") {
      continue;
    }

    if (overflowRx.test(style.overflow + style.overflowY + style.overflowX)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return docEl;
}
