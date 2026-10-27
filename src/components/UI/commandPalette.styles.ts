// Tailwind classes shared by this component family. Hooks support descendant/state variants.
const styles = {
  "overlay": [
    "command-overlay",
    "fixed z-[100] inset-[0] flex items-start justify-center p-[clamp(24px,_10vh,_96px)_24px] bg-transparent",
    "[@media(max-width:_600px)]:p-[16px_12px]",
  ].join(" "),
  "backdrop": [
    "command-backdrop",
    "absolute inset-[0] bg-[rgba(25,_33,_31,_0.68)]",
  ].join(" "),
  "panel": [
    "command-panel",
    "relative flex flex-col w-full max-w-[820px] max-h-[calc(100dvh_-_clamp(24px,_10vh,_96px)_*_2)] overflow-hidden text-portfolio-ink bg-portfolio-paper [box-shadow:0_24px_72px_rgba(25,_33,_31,_0.28)]",
    "[&_.command-input]:w-full [&_.command-input]:min-w-[0] [&_.command-input]:h-auto [&_.command-input]:min-h-[48px] [&_.command-input]:m-[0] [&_.command-input]:p-[8px_0] [&_.command-input]:[border:0] [&_.command-input]:rounded-none [&_.command-input]:text-portfolio-ink [&_.command-input]:bg-transparent [&_.command-input]:caret-portfolio-red [&_.command-input]:[font:400_clamp(18px,_2.3vw,_24px)/1.35_var(--portfolio-body)] [&_.command-input]:[box-shadow:none]",
    "[&_.command-input::placeholder]:text-portfolio-muted [&_.command-input::placeholder]:opacity-100",
    "[&_.command-input:focus]:[outline:none] [&_.command-input:focus]:[box-shadow:inset_0_-2px_var(--portfolio-red)]",
    "[&_.command-close]:inline-flex [&_.command-close]:min-w-[44px] [&_.command-close]:min-h-[44px] [&_.command-close]:items-center [&_.command-close]:gap-[8px] [&_.command-close]:m-[0] [&_.command-close]:p-[0_10px] [&_.command-close]:[border:1px_solid_rgba(32,_35,_33,_0.24)] [&_.command-close]:rounded-none [&_.command-close]:text-portfolio-muted [&_.command-close]:bg-transparent [&_.command-close]:[font:400_13px/1_var(--portfolio-body)] [&_.command-close]:tracking-[normal] [&_.command-close]:normal-case [&_.command-close]:cursor-pointer",
    "[&_.command-close:hover]:border-portfolio-red [&_.command-close:hover]:text-portfolio-red",
    "[&_button:focus-visible]:[outline:2px_solid_var(--portfolio-red)] [&_button:focus-visible]:outline-offset-[-4px]",
    "[&_.command-result]:flex [&_.command-result]:w-full [&_.command-result]:min-h-[86px] [&_.command-result]:items-center [&_.command-result]:justify-between [&_.command-result]:gap-[24px] [&_.command-result]:m-[0] [&_.command-result]:p-[18px_12px] [&_.command-result]:[border:0] [&_.command-result]:[&]:[border-bottom:1px_solid_rgba(32,_35,_33,_0.18)] [&_.command-result]:rounded-none [&_.command-result]:text-portfolio-ink [&_.command-result]:bg-transparent [&_.command-result]:[font:400_16px/1.4_var(--portfolio-body)] [&_.command-result]:tracking-[normal] [&_.command-result]:text-left [&_.command-result]:normal-case [&_.command-result]:cursor-pointer [&_.command-result]:[transition:background-color_160ms_ease-out,_color_160ms_ease-out]",
    "[&_.command-result[aria-selected=true]]:text-portfolio-red [&_.command-result[aria-selected=true]]:bg-portfolio-surface",
    "[&_.command-result:hover]:text-portfolio-red [&_.command-result:hover]:bg-portfolio-surface",
    "[@media(max-width:_600px)]:max-h-[calc(100dvh_-_32px)]",
    "[@media(max-width:_600px)]:[&_.command-result]:gap-[12px] [@media(max-width:_600px)]:[&_.command-result]:p-[16px_10px]",
    "[@media(prefers-reduced-motion:_reduce)]:[&_.command-result]:[transition:none]",
  ].join(" "),
  "header": [
    "command-header",
    "flex flex-shrink-0 items-center gap-[16px] p-[22px_28px] [border-bottom:1px_solid_rgba(32,_35,_33,_0.24)]",
    "[@media(max-width:_600px)]:gap-[8px] [@media(max-width:_600px)]:p-[12px_16px]",
  ].join(" "),
  "inputGroup": [
    "command-inputGroup",
    "flex flex-[1] min-w-[0] items-center gap-[16px]",
    "[@media(max-width:_600px)]:gap-[10px]",
  ].join(" "),
  "searchIcon": [
    "command-searchIcon",
    "w-[24px] h-[24px] flex-shrink-0 text-portfolio-red",
  ].join(" "),
  "input": [
    "command-input",
  ].join(" "),
  "close": [
    "command-close",
    "[&_kbd]:[font:11px_var(--portfolio-mono)]",
    "[@media(max-width:_600px)]:[&_span]:hidden",
  ].join(" "),
  "results": [
    "command-results",
    "min-h-[0] p-[0_28px] overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--portfolio-red)_var(--portfolio-muted-surface)]",
    "[@media(max-width:_600px)]:p-[0_12px]",
  ].join(" "),
  "result": [
    "command-result",
  ].join(" "),
  "resultCopy": [
    "command-resultCopy",
    "min-w-[0]",
  ].join(" "),
  "title": [
    "command-title",
    "text-[clamp(20px,_2.5vw,_27px)] font-semibold tracking-[-0.02em] leading-[1.15]",
  ].join(" "),
  "subtitle": [
    "command-subtitle",
    "max-w-[68ch] mt-[6px] text-portfolio-muted text-[14px] leading-[1.45]",
  ].join(" "),
  "category": [
    "command-category",
    "flex-shrink-0 text-portfolio-muted text-label-px",
    "[@media(max-width:_600px)]:text-[11px]",
  ].join(" "),
  "empty": [
    "command-empty",
    "p-[64px_12px] text-portfolio-muted text-[18px] text-center",
  ].join(" "),
  "footer": [
    "command-footer",
    "flex flex-shrink-0 justify-between gap-[20px] p-[16px_28px] [border-top:1px_solid_rgba(32,_35,_33,_0.24)] text-portfolio-muted text-label-px leading-normal",
    "[&_strong]:text-portfolio-ink [&_strong]:font-semibold",
    "[@media(max-width:_600px)]:p-[14px_16px]",
    "[@media(max-width:_600px)]:[&_>_span:last-child]:hidden",
  ].join(" "),
};

export default styles;
