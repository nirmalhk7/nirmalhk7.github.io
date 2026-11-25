import React from "react";
import { m, useReducedMotion } from "framer-motion";
import portfolioStyles from "@/components/Home/portfolio.module.scss";
import styles from "./commandPalette.module.scss";
import type { CommandItem } from "./CommandPalette";

interface PanelProps {
  containerRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  searchQuery: string;
  filteredItems: CommandItem[];
  selectedIndex: number;
  close: (reason: string) => void;
  selectItem: (item: CommandItem, method: string) => void;
  setSelectedIndex: (index: number) => void;
  handleSearchKeyDown: (event: React.KeyboardEvent) => void;
  changeQuery: (query: string) => void;
}

export function CommandPalettePanel({ containerRef, inputRef, searchQuery, filteredItems, selectedIndex, close, selectItem, setSelectedIndex, handleSearchKeyDown, changeQuery }: PanelProps) {
  const reduceMotion = useReducedMotion();
  const restingY = reduceMotion ? 0 : -12;
  return (
  <div data-analytics-skip-global="true" className={`${portfolioStyles.shell} ${styles.overlay}`}>
    {/* Backdrop */}
    <m.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => close('backdrop')}
      className={styles.backdrop}
    />

    {/* Search panel */}
    <m.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      initial={{ opacity: 0, y: restingY }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: restingY }}
      transition={{ duration: reduceMotion ? 0.1 : 0.18, ease: "easeOut" }}
      className={styles.panel}
    >
      {/* Search Header */}
      <div className={styles.header}>
        <div className={styles.inputGroup}>
          <svg className={styles.searchIcon} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search pages, skills, or quick actions"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="command-palette-listbox"
            aria-activedescendant={
              filteredItems[selectedIndex]
                ? `cmd-item-${filteredItems[selectedIndex].id}`
                : undefined
            }
            value={searchQuery}
            onChange={(event) => changeQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search pages, skills, or quick actions..."
            className={styles.input}
          />
        </div>
        <button type="button" className={styles.close} onClick={() => close("control")} aria-label="Close search">
          <span>Close</span><kbd>Esc</kbd>
        </button>
      </div>

      {/* Search results */}
      <div
        id="command-palette-listbox"
        role="listbox"
        aria-label="Search results"
        className={styles.results}
      >
        {filteredItems.length === 0 ? (
          <div className={styles.empty}>
            No matching results found.
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <button
              key={item.id}
              id={`cmd-item-${item.id}`}
              role="option"
              aria-selected={selectedIndex === index}
              type="button"
              onClick={(event) => selectItem(item,event.detail===0?'keyboard':'pointer')}
              onMouseEnter={() => setSelectedIndex(index)}
              className={styles.result}
            >
              <div className={styles.resultCopy}>
                <div className={styles.title}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className={styles.subtitle}>
                    {item.subtitle}
                  </div>
                )}
              </div>
              <span className={styles.category}>
                {item.category}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Footer Tip */}
      <div className={styles.footer}>
        <span>Use arrow keys <strong >↑ ↓</strong> to navigate, <strong >Enter</strong> to select</span>
        <span>Command Palette</span>
      </div>
    </m.div>
  </div>
  );
}
