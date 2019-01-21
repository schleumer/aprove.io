import isDocumentElement from "./isDocumentElement";

export default function getScrollLeft(el: HTMLElement): number {
  if (isDocumentElement(el)) {
    return window.pageXOffset;
  }
  return el.scrollLeft;
}
