import isDocumentElement from "./isDocumentElement";

export default function getScrollTop(el: HTMLElement): number {
  if (isDocumentElement(el)) {
    return window.pageYOffset;
  }

  return el.scrollTop;
}
