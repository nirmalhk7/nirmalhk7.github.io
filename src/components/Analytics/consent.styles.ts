// Tailwind classes shared by this component family. Hooks support descendant/state variants.
const styles = {
  "banner": [
    "consent-banner",
    "fixed z-[110] bottom-[16px] left-[16px] right-[16px] max-w-[768px] m-[0_auto] p-[20px] text-body-px text-[#25241f] bg-[#f5f2eb] [border:1px_solid_#b8b4a8] max-h-[calc(100dvh_-_32px)] overflow-auto [box-shadow:0_6px_24px_rgba(0,_0,_0,_0.12)]",
    "[&_h2]:text-[20px] [&_h2]:m-[0_0_8px]",
    "[&_p]:text-[14px] [&_p]:leading-[1.6] [&_p]:m-[0_0_16px]",
    "[&_a]:text-inherit [&_a]:underline",
    "[&_button]:[font:inherit] [&_button]:[&]:text-[14px] [&_button]:normal-case [&_button]:tracking-[normal] [&_button]:[border:1px_solid_#777469] [&_button]:p-[10px_14px] [&_button]:min-h-[44px] [&_button]:bg-transparent [&_button]:text-inherit",
    "[&_button:focus-visible]:[outline:2px_solid_#a44125] [&_button:focus-visible]:outline-offset-[3px]",
    "[&_input:focus-visible]:[outline:2px_solid_#a44125] [&_input:focus-visible]:outline-offset-[3px]",
    "[&_a:focus-visible]:[outline:2px_solid_#a44125] [&_a:focus-visible]:outline-offset-[3px]",
  ].join(" "),
  "actions": [
    "consent-actions",
    "flex flex-wrap gap-[8px]",
  ].join(" "),
  "options": [
    "consent-options",
    "flex gap-[24px] mb-[16px] text-[14px]",
    "[&_label]:flex [&_label]:items-center [&_label]:gap-[8px]",
    "[&_input]:w-[18px] [&_input]:h-[18px] [&_input]:[accent-color:#a44125]",
  ].join(" "),
};

export default styles;
