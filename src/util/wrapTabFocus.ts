export function wrapTabFocus(event: KeyboardEvent, elements: NodeListOf<HTMLElement>) {
  if (event.key !== 'Tab' || !elements.length) return;
  const first = elements[0];
  const last = elements[elements.length - 1];
  const from = event.shiftKey ? first : last;
  if (document.activeElement !== from) return;
  event.preventDefault();
  (event.shiftKey ? last : first).focus();
}
