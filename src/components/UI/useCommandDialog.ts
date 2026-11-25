import { useCallback, useEffect, useRef } from "react";
import { trackEvent } from "@/util/analytics";
import { wrapTabFocus } from "@/util/wrapTabFocus";

function handleShortcut(event: KeyboardEvent, isOpen: boolean, open: (method: string) => void, close: (reason: string) => void) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (isOpen) close('shortcut');
    else open('keyboard');
  } else if (event.key === "Escape" && isOpen) {
    close('escape');
  }
}

export function useCommandDialog(isOpen: boolean, setIsOpen: (open: boolean) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback((reason: string) => { trackEvent('command_palette', { action: 'close', interaction_type: reason }); setIsOpen(false); }, [setIsOpen]);
  const open = useCallback((method: string) => { trackEvent('command_palette', { action: 'open', action_method: method }); setIsOpen(true); }, [setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => handleShortcut(event, isOpen, open, close);

    const handleCustomOpen = () => open('control');

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen, close, open]);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const timer=window.setTimeout(() => inputRef.current?.focus(),50);
      return () => window.clearTimeout(timer);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleFocusTrap = (event: KeyboardEvent) => {
      const focusable = containerRef.current?.querySelectorAll<HTMLElement>('input, button, [tabindex="0"]');
      if (focusable) wrapTabFocus(event, focusable);
    };
    window.addEventListener("keydown", handleFocusTrap);
    return () => window.removeEventListener("keydown", handleFocusTrap);
  }, [isOpen]);

  return { inputRef, containerRef, close };
}
