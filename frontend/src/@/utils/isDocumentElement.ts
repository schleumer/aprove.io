export default function isDocumentElement(el: HTMLElement) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}
