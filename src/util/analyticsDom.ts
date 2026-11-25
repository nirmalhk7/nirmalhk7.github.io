export const analyticsContentId = (element: Element) =>
  element.closest('[data-analytics-exposure]')?.getAttribute('data-analytics-exposure') || undefined;

export const analyticsPlacement = (element: Element) => {
  if (element.closest('nav')) return 'navigation';
  return element.closest('footer') ? 'footer' : 'content';
};

export const containingElement = (node: Node | null | undefined) =>
  node instanceof Element ? node : node?.parentElement;
