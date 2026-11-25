// Utilities compiled into the portfolio's semantic component hooks.
export const componentUtilities = {
  // consent
  "tw-consent-banner": [
    "fixed z-[110] bottom-[16px] left-[16px] right-[16px] max-w-[768px] m-[0_auto] p-[20px] text-body-px text-[#25241f] bg-[#f5f2eb] [border:1px_solid_#b8b4a8]",
    "max-h-[calc(100dvh_-_32px)] overflow-auto [box-shadow:0_6px_24px_rgba(0,_0,_0,_0.12)] [&_h2]:text-[20px] [&_h2]:m-[0_0_8px] [&_p]:text-[14px] [&_p]:leading-[1.6]",
    "[&_p]:m-[0_0_16px] [&_a]:text-inherit [&_a]:underline [&_button]:[font:inherit] [&_button]:[&]:text-[14px] [&_button]:normal-case [&_button]:tracking-[normal]",
    "[&_button]:[border:1px_solid_#777469] [&_button]:p-[10px_14px] [&_button]:min-h-[44px] [&_button]:bg-transparent [&_button]:text-inherit",
    "[&_button:focus-visible]:[outline:2px_solid_#a44125] [&_button:focus-visible]:outline-offset-[3px] [&_input:focus-visible]:[outline:2px_solid_#a44125]",
    "[&_input:focus-visible]:outline-offset-[3px] [&_a:focus-visible]:[outline:2px_solid_#a44125] [&_a:focus-visible]:outline-offset-[3px]",
  ],
  "tw-consent-actions": [
    "flex flex-wrap gap-[8px]",
  ],
  "tw-consent-options": [
    "flex gap-[24px] mb-[16px] text-[14px] [&_label]:flex [&_label]:items-center [&_label]:gap-[8px] [&_input]:w-[18px] [&_input]:h-[18px] [&_input]:[accent-color:#a44125]",
  ],
  // portfolio
  "tw-portfolio-shell": [
    "text-portfolio-ink bg-portfolio-paper font-body text-body-px leading-[1.55] [&_::selection]:[color:var(--portfolio-selection-color,#fff)]",
    "[&_::selection]:[background:var(--portfolio-selection-background,var(--portfolio-red))] [&_.portfolio-contact]:[--portfolio-selection-color:var(--portfolio-red)]",
    "[&_.portfolio-contact]:[--portfolio-selection-background:#fff] [&_.portfolio-contact]:!p-[108px_clamp(28px,_10vw,_160px)_94px] [&_.portfolio-contact]:!text-white",
    "[&_.portfolio-contact]:!bg-portfolio-red [&_.portfolio-contact]:scroll-mt-[72px] [&_.portfolio-contact-content]:!transform-none [&_.portfolio-contact-layout]:w-full",
    "[&_.portfolio-contact-layout]:max-w-content [&_.portfolio-contact-layout]:m-[0_auto] [&_.portfolio-contact-intro]:w-full [&_.portfolio-contact-heading]:max-w-content",
    "[&_.portfolio-contact-heading]:m-[0_auto] [&_.portfolio-contact-heading_h2]:m-[0_0_24px] [&_.portfolio-contact-heading_h2]:text-white",
    "[&_.portfolio-contact-heading_h2]:font-display [&_.portfolio-contact-heading_h2]:text-[clamp(38px,_5.3vw,_78px)] [&_.portfolio-contact-heading_h2]:font-semibold",
    "[&_.portfolio-contact-heading_h2]:tracking-[-0.03em] [&_.portfolio-contact-heading_h2]:leading-[1.06] [&_.portfolio-contact-grid]:max-w-content",
    "[&_.portfolio-contact-grid]:m-[32px_auto_0] [&_.portfolio-contact-grid]:grid-cols-[minmax(0,_1.2fr)_minmax(220px,_0.8fr)] [&_.portfolio-contact-grid]:[align-items:start]",
    "[&_.portfolio-contact-grid]:gap-[60px] [&_.portfolio-contact_form]:grid [&_.portfolio-contact_form]:grid-cols-[1fr_1fr] [&_.portfolio-contact_form]:gap-[18px]",
    "[&_.portfolio-contact_form_>_input]:col-[1/-1] [&_.portfolio-contact_form_>_.shell-form-field:last-of-type]:col-[1/-1] [&_.portfolio-contact_form_>_button]:col-[1/-1]",
    "[&_.portfolio-contact_form_.shell-form-field]:m-[0] [&_.portfolio-contact_input]:min-h-[54px] [&_.portfolio-contact_input]:m-[0] [&_.portfolio-contact_input]:p-[10px_2px]",
    "[&_.portfolio-contact_input]:[border:0] [&_.portfolio-contact_input]:[&]:[border-bottom:1px_solid_rgba(255,_255,_255,_0.75)] [&_.portfolio-contact_input]:rounded-none",
    "[&_.portfolio-contact_input]:text-white [&_.portfolio-contact_input]:bg-transparent [&_.portfolio-contact_input]:font-portfolio-sans",
    "[&_.portfolio-contact_input]:text-body-px [&_.portfolio-contact_textarea]:m-[0] [&_.portfolio-contact_textarea]:p-[10px_2px] [&_.portfolio-contact_textarea]:[border:0]",
    "[&_.portfolio-contact_textarea]:[&]:[border-bottom:1px_solid_rgba(255,_255,_255,_0.75)] [&_.portfolio-contact_textarea]:rounded-none",
    "[&_.portfolio-contact_textarea]:text-white [&_.portfolio-contact_textarea]:bg-transparent [&_.portfolio-contact_textarea]:font-portfolio-sans",
    "[&_.portfolio-contact_textarea]:text-body-px [&_.portfolio-contact_textarea]:min-h-[100px] [&_.portfolio-contact_textarea]:resize-y",
    "[&_.portfolio-contact_input::placeholder]:text-[rgba(255,_255,_255,_0.86)] [&_.portfolio-contact_textarea::placeholder]:text-[rgba(255,_255,_255,_0.86)]",
    "[&_.portfolio-contact_input:focus]:[outline:2px_solid_#fff] [&_.portfolio-contact_input:focus]:outline-offset-4",
    "[&_.portfolio-contact_textarea:focus]:[outline:2px_solid_#fff] [&_.portfolio-contact_textarea:focus]:outline-offset-4 [&_.portfolio-contact_form_button]:w-fit",
    "[&_.portfolio-contact_form_button]:min-h-[48px] [&_.portfolio-contact_form_button]:m-[8px_0_0] [&_.portfolio-contact_form_button]:p-[0_24px]",
    "[&_.portfolio-contact_form_button]:[border:0] [&_.portfolio-contact_form_button]:text-portfolio-red [&_.portfolio-contact_form_button]:bg-white",
    "[&_.portfolio-contact_form_button]:font-portfolio-sans [&_.portfolio-contact_form_button]:text-[14px] [&_.portfolio-contact_form_button]:font-bold",
    "[&_.portfolio-contact_form_button]:tracking-[0.01em] [&_.portfolio-contact_form_button]:normal-case [&_.portfolio-contact_form_button:disabled]:cursor-wait",
    "[&_.portfolio-contact_form_button:disabled]:opacity-[0.65] [&_.portfolio-contact-info_h5]:m-[0_0_8px] [&_.portfolio-contact-info_h5]:text-[rgba(255,_255,_255,_0.8)]",
    "[&_.portfolio-contact-info_h5]:[font-family:ui-monospace,_'SFMono-Regular',_monospace] [&_.portfolio-contact-info_h5]:text-label-px",
    "[&_.portfolio-contact-info_h5]:leading-[1.4] [&_.portfolio-contact-info_a]:text-white [&_.portfolio-contact-info_a]:text-[clamp(18px,_2vw,_26px)]",
    "[&_.portfolio-contact-invitation]:max-w-[58ch] [&_.portfolio-contact-invitation]:m-[24px_0_0] [&_.portfolio-contact-invitation]:text-white",
    "[&_.portfolio-contact-invitation]:text-[clamp(18px,_2vw,_23px)] [&_.portfolio-contact-invitation]:leading-normal [&_.portfolio-contact-info_nav]:mt-[24px]",
    "[&_.portfolio-contact-info_nav]:flex-col [&_.portfolio-contact-info_nav]:items-start [&_.portfolio-contact-info_nav_a]:text-[17px]",
    "[&_.portfolio-contact_.contact-shooting-stars]:hidden [&_.portfolio-resume-link]:inline-flex [&_.portfolio-resume-link]:min-h-[38px]",
    "[&_.portfolio-resume-link]:items-center [&_.portfolio-resume-link]:p-[0_13px] [&_.portfolio-resume-link]:!text-white [&_.portfolio-resume-link]:bg-portfolio-red",
    "[&_.portfolio-resume-link]:[text-decoration:none] [&_.portfolio-resume-link:hover]:bg-[#a92c24] [&_.shell-portfolioFooter]:!p-[48px_clamp(24px,_8vw,_126px)_28px]",
    "[&_.shell-portfolioFooter]:text-portfolio-ink [&_.shell-portfolioFooter]:bg-portfolio-paper [&_.shell-portfolioFooter]:font-portfolio-sans",
    "[&_.shell-portfolioFooter]:text-left [@media(max-width:_767px)]:[&_.portfolio-contact]:!p-[78px_22px_60px]",
    "[@media(max-width:_767px)]:[&_.portfolio-contact-grid]:grid-cols-[1fr] [@media(max-width:_767px)]:[&_.portfolio-contact-grid]:gap-[38px]",
    "[@media(max-width:_767px)]:[&_.portfolio-contact_form]:grid-cols-[1fr]",
  ],
  "tw-portfolio-portfolioNav": [
    "fixed z-50 top-[0] left-[0] flex w-full h-[64px] items-center justify-between p-[0_clamp(24px,_7.8vw,_126px)] [border-bottom:1px_solid_rgba(255,_255,_255,_0.13)]",
    "text-white bg-[rgba(18,_23,_26,_0.73)] font-portfolio-sans text-[13px] tracking-[0.015em] leading-none [backdrop-filter:blur(22px)_saturate(1.15)]",
    "[-webkit-backdrop-filter:blur(22px)_saturate(1.15)] [transition:background-color_220ms_ease,_border-color_220ms_ease,_backdrop-filter_220ms_ease]",
    "[&[data-over-hero=true]]:border-b-transparent [&[data-over-hero=true]]:bg-transparent [&[data-over-hero=true]]:[backdrop-filter:none]",
    "[&[data-over-hero=true]]:[-webkit-backdrop-filter:none] [@media(prefers-reduced-motion:_reduce)]:[transition:none]",
    "[&_a:focus-visible]:[outline:2px_solid_var(--portfolio-red)] [&_a:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:[outline:2px_solid_var(--portfolio-red)]",
    "[&_button:focus-visible]:outline-offset-[3px] [@media(max-width:_1023px)]:h-[60px] [@media(max-width:_1023px)]:p-[0_22px] [@media(max-width:_767px)]:p-[0_18px]",
  ],
  "tw-portfolio-portfolioBrand": [
    "inline-flex min-h-[44px] items-center text-white text-body-px font-bold tracking-[-0.035em] [text-decoration:none]",
  ],
  "tw-portfolio-portfolioDesktopNav": [
    "flex h-full items-center gap-[clamp(14px,_2vw,_28px)] [&_a]:inline-flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:text-[rgba(255,_255,_255,_0.86)]",
    "[&_a]:[text-decoration:none] [&_a]:[transition:color_150ms_ease-out] [&_a:hover]:text-white [&_a:hover]:underline [&_a:hover]:decoration-portfolio-red",
    "[&_a:hover]:decoration-2 [&_a:hover]:underline-offset-8 [&_a[aria-current]]:text-white [&_a[aria-current]]:underline [&_a[aria-current]]:decoration-portfolio-red",
    "[&_a[aria-current]]:decoration-2 [&_a[aria-current]]:underline-offset-8 [&_.shell-portfolioResume:hover]:text-white [&_.shell-portfolioResume:hover]:border-portfolio-red",
    "[&_.shell-portfolioResume:hover]:bg-portfolio-red [&_.shell-portfolioResume:hover]:[text-decoration:none] [@media(max-width:_1023px)]:hidden",
  ],
  "tw-portfolio-portfolioResume": [
    "inline-flex min-h-[44px] items-center p-[0_16px] [border:1px_solid_rgba(255,_255,_255,_0.53)] !text-white bg-transparent",
  ],
  "tw-portfolio-portfolioSearch": [
    "inline-flex min-h-[44px] items-center gap-[14px] p-[0_10px] [border:1px_solid_rgba(255,_255,_255,_0.24)] text-white bg-transparent [font:inherit] cursor-pointer",
    "[&_kbd]:text-[rgba(255,_255,_255,_0.65)] [&_kbd]:[font:11px_ui-monospace,_'SFMono-Regular',_monospace]",
  ],
  "tw-portfolio-portfolioMenuActions": [
    "[&_kbd]:text-[#666] [&_kbd]:[font:11px_ui-monospace,_'SFMono-Regular',_monospace] flex gap-[14px] [&_a]:flex [&_a]:min-h-[48px] [&_a]:flex-[1] [&_a]:items-center",
    "[&_a]:justify-between [&_a]:p-[0_14px] [&_a]:[border:1px_solid_rgba(23,_23,_23,_0.19)] [&_a]:text-portfolio-ink [&_a]:bg-transparent",
    "[&_a]:[font:13px_var(--portfolio-sans)] [&_a]:[text-decoration:none] [&_button]:flex [&_button]:min-h-[48px] [&_button]:flex-[1] [&_button]:items-center",
    "[&_button]:justify-between [&_button]:p-[0_14px] [&_button]:[border:1px_solid_rgba(23,_23,_23,_0.19)] [&_button]:text-portfolio-ink [&_button]:bg-transparent",
    "[&_button]:[font:13px_var(--portfolio-sans)] [&_button]:[text-decoration:none]",
  ],
  "tw-portfolio-portfolioMenuTrigger": [
    "hidden [@media(max-width:_1023px)]:inline-flex [@media(max-width:_1023px)]:min-w-[74px] [@media(max-width:_1023px)]:min-h-[44px] [@media(max-width:_1023px)]:items-center",
    "[@media(max-width:_1023px)]:justify-center [@media(max-width:_1023px)]:gap-[10px] [@media(max-width:_1023px)]:p-[0_10px]",
    "[@media(max-width:_1023px)]:[border:1px_solid_rgba(255,_255,_255,_0.38)] [@media(max-width:_1023px)]:text-white [@media(max-width:_1023px)]:bg-transparent",
    "[@media(max-width:_1023px)]:[font:12px_var(--portfolio-sans)] [@media(max-width:_1023px)]:cursor-pointer",
  ],
  "tw-portfolio-portfolioMenuOverlay": [
    "fixed z-[60] inset-[0] grid place-items-stretch text-portfolio-ink bg-[rgba(20,_21,_22,_0.44)] [backdrop-filter:blur(8px)] [@media(max-width:_1023px)]:top-[0]",
    "[@media(max-width:_1023px)]:left-[0] [@media(max-width:_1023px)]:w-full [@media(max-width:_1023px)]:h-[100dvh]",
  ],
  "tw-portfolio-portfolioMenuPanel": [
    "w-full h-[100dvh] min-h-[0] p-[18px_24px_max(36px,_env(safe-area-inset-bottom))] bg-portfolio-paper overflow-y-auto overscroll-contain [&_ul]:grid",
    "[&_ul]:m-[clamp(45px,_10vh,_100px)_0_30px] [&_ul]:p-[0] [&_ul]:[border-top:1px_solid_rgba(23,_23,_23,_0.16)] [&_ul]:[list-style:none]",
    "[&_li]:[&]:[border-bottom:1px_solid_rgba(23,_23,_23,_0.16)] [&_li_a]:grid [&_li_a]:min-h-[76px] [&_li_a]:grid-cols-[38px_1fr_24px] [&_li_a]:items-center",
    "[&_li_a]:text-portfolio-ink [&_li_a]:text-[clamp(28px,_8vw,_42px)] [&_li_a]:tracking-[-0.045em] [&_li_a]:[text-decoration:none]",
    "[&_:is(li_a,button,.shell-portfolioMenuActions_a)]:[transition:color_180ms_ease-out]",
    "[&_:is(li_a,button,.shell-portfolioMenuActions_a):is(:hover,:focus-visible)]:text-portfolio-red",
    "[&_li_a:is(:hover,:focus-visible)_.shell-portfolioMenuIndex]:text-portfolio-red motion-reduce:[&_:is(li_a,button,.shell-portfolioMenuActions_a)]:[transition:none]",
    "[&_li_a_>_span:last-child]:text-portfolio-red [&_li_a_>_span:last-child]:[font:16px_ui-monospace,_'SFMono-Regular',_monospace]",
  ],
  "tw-portfolio-portfolioMenuHeader": [
    "flex h-[52px] items-center justify-between text-[14px] font-bold [&_button]:inline-flex [&_button]:min-w-[48px] [&_button]:min-h-[44px] [&_button]:items-center",
    "[&_button]:justify-center [&_button]:gap-[8px] [&_button]:[border:0] [&_button]:text-portfolio-ink [&_button]:bg-transparent [&_button]:[font:inherit]",
    "[&_button]:cursor-pointer",
  ],
  "tw-portfolio-portfolioMenuGlyph": [
    "relative inline-block w-[18px] h-[18px] flex-[0_0_18px] [&_>_span]:absolute [&_>_span]:top-[8px] [&_>_span]:left-[0] [&_>_span]:w-[18px] [&_>_span]:h-[2px]",
    "[&_>_span]:[background:currentColor] [&_>_span]:origin-center",
  ],
  "tw-portfolio-portfolioMenuIndex": [
    "self-center text-[#74716d] [font:10px_ui-monospace,_'SFMono-Regular',_monospace] tracking-[0] [transition:color_180ms_ease-out] motion-reduce:[transition:none]",
  ],
  "tw-portfolio-footerInner": [
    "max-w-content m-[0_auto] [&_small]:text-portfolio-muted [&_small]:[font:11px_'Portfolio_Plex_Mono',_ui-monospace,_monospace]",
  ],
  "tw-portfolio-footerTop": [
    "flex justify-between gap-[24px] items-baseline pb-[32px] [border-bottom:1px_solid_rgba(23,_23,_23,_0.2)] [&_p]:m-[0] [&_p]:text-portfolio-muted [&_p]:text-[14px]",
    "[@media(max-width:_767px)]:block [@media(max-width:_767px)]:[&_p]:mt-[12px]",
  ],
  "tw-portfolio-footerBrand": [
    "!text-portfolio-ink text-[22px] font-bold tracking-[-0.055em] [text-decoration:none]",
  ],
  "tw-portfolio-footerLinks": [
    "flex flex-wrap gap-[12px_28px] !m-[28px_0] p-[0] [list-style:none] [&_a]:inline-flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:gap-[8px] [&_a]:!text-portfolio-ink",
    "[&_a]:text-[14px] [&_a]:[text-decoration:none] [&_a:hover]:!text-portfolio-red [@media(max-width:_767px)]:gap-[4px_18px]",
  ],
  // editorial
  "tw-editorial-page": [
    "text-portfolio-ink bg-portfolio-paper font-body text-body-px leading-normal [&_:where(a,_button)]:[-webkit-tap-highlight-color:transparent]",
    "[&_:where(a,_button):focus-visible]:[outline:2px_solid_var(--portfolio-red)] [&_:where(a,_button):focus-visible]:outline-offset-4",
    "[@media(prefers-reduced-motion:_reduce)]:[&_*]:!scroll-auto [@media(prefers-reduced-motion:_reduce)]:[&_*]:![animation-duration:0.01ms]",
    "[@media(prefers-reduced-motion:_reduce)]:[&_*]:![transition-duration:0.01ms] [@media(prefers-reduced-motion:_reduce)]:[&_*::before]:!scroll-auto",
    "[@media(prefers-reduced-motion:_reduce)]:[&_*::before]:![animation-duration:0.01ms] [@media(prefers-reduced-motion:_reduce)]:[&_*::before]:![transition-duration:0.01ms]",
    "[@media(prefers-reduced-motion:_reduce)]:[&_*::after]:!scroll-auto [@media(prefers-reduced-motion:_reduce)]:[&_*::after]:![animation-duration:0.01ms]",
    "[@media(prefers-reduced-motion:_reduce)]:[&_*::after]:![transition-duration:0.01ms]",
  ],
  "tw-editorial-hero": [
    "relative flex min-h-[min(680px,_76svh)] items-end overflow-hidden p-[160px_clamp(24px,_8vw,_126px)_76px] text-white bg-[#202628] isolate",
    "[&_.editorial-eyebrow]:text-[#ff776b] [&_h1]:max-w-[1050px] [&_h1]:m-[18px_0_0] [&_h1]:text-white [&_h1]:font-display [&_h1]:text-[clamp(54px,_8vw,_96px)] [&_h1]:font-bold",
    "[&_h1]:tracking-[-0.035em] [&_h1]:leading-[0.94] [&_h1]:[text-wrap:balance] [&.editorial-heroArticle]:pt-[128px] [&.editorial-heroArticle]:pb-[56px]",
    "[&.editorial-heroArticle_h1]:max-w-[24ch] [&.editorial-heroArticle_h1]:text-[clamp(36px,_4.5vw,_64px)] [&.editorial-heroArticle_h1]:leading-[1.08]",
    "[@media(max-width:_767px)]:min-h-[560px] [@media(max-width:_767px)]:p-[120px_22px_50px] [@media(max-width:_767px)]:[&_h1]:text-[clamp(50px,_13vw,_75px)]",
    "[@media(max-width:_767px)]:[&.editorial-heroArticle_h1]:text-[clamp(32px,_8.5vw,_44px)]",
  ],
  "tw-editorial-heroCompact": [
    "[&.editorial-heroCompact]:min-h-[460px] [@media(width>767px)]:[&_h1]:text-[clamp(48px,_7.2vw,_96px)] [@media(max-width:_767px)]:[&.editorial-heroCompact]:min-h-[430px]",
  ],
  "tw-editorial-heroImage": [
    "z-[-2] object-cover object-center",
  ],
  "tw-editorial-heroShade": [
    "absolute z-[-1] inset-[0]",
    "[background:linear-gradient(90deg,_rgba(13,_20,_24,_0.88)_0%,_rgba(13,_20,_24,_0.66)_45%,_rgba(13,_20,_24,_0.18)_100%),_linear-gradient(0deg,_rgba(13,_20,_24,_0.42),_transparent_50%)]",
    "[@media(max-width:_767px)]:[background:linear-gradient(0deg,_rgba(13,_20,_24,_0.92)_0%,_rgba(13,_20,_24,_0.6)_50%,_rgba(13,_20,_24,_0.18)_100%)]",
  ],
  "tw-editorial-heroContent": [
    "w-[min(100%,_1120px)]",
  ],
  "tw-editorial-eyebrow": [
    "text-portfolio-red [font-family:'Portfolio_Plex_Mono',_ui-monospace,_monospace] text-label-px font-normal tracking-[0.16em] leading-normal uppercase",
  ],
  "tw-editorial-heroArticle": [
    "[&_.editorial-heroDescription]:max-w-[60ch] [&_.editorial-heroDescription]:text-[clamp(17px,_1.6vw,_21px)] [&_.editorial-heroDescription]:!leading-normal",
  ],
  "tw-editorial-heroDescription": [
    "max-w-[700px] !mt-[26px] text-[rgba(255,_255,_255,_0.85)] text-[clamp(17px,_2vw,_24px)] !leading-[1.35] [@media(max-width:_767px)]:text-[17px]",
  ],
  "tw-editorial-heroActions": [
    "flex flex-wrap gap-[16px] mt-[34px] [&_:where(a,_button)]:inline-flex [&_:where(a,_button)]:min-h-[48px] [&_:where(a,_button)]:items-center",
    "[&_:where(a,_button)]:justify-center [&_:where(a,_button)]:gap-[18px] [&_:where(a,_button)]:p-[0_20px] [&_:where(a,_button)]:[border:1px_solid_currentColor]",
    "[&_:where(a,_button)]:text-inherit [&_:where(a,_button)]:bg-transparent [&_:where(a,_button)]:[font:700_14px_var(--portfolio-sans)]",
    "[&_:where(a,_button)]:[text-decoration:none] [&_:where(a,_button)]:[transition:background_150ms_ease,_color_150ms_ease,_border-color_150ms_ease]",
    "[&_:where(a,_button):hover]:text-portfolio-ink [&_:where(a,_button):hover]:bg-white [&_:where(a,_button):hover]:[text-decoration:none]",
    "[&_.editorial-actionPrimary]:border-portfolio-red [&_.editorial-actionPrimary]:text-white [&_.editorial-actionPrimary]:bg-portfolio-red",
    "[&_.editorial-actionPrimary:hover]:border-portfolio-red-hover [&_.editorial-actionPrimary:hover]:text-white [&_.editorial-actionPrimary:hover]:bg-portfolio-red-hover",
  ],
  "tw-editorial-action": [
    "inline-flex min-h-[48px] items-center justify-center gap-[18px] p-[0_20px] [border:1px_solid_currentColor] text-inherit bg-transparent",
    "[font:700_14px_var(--portfolio-sans)] [text-decoration:none] [transition:background_150ms_ease,_color_150ms_ease,_border-color_150ms_ease]",
  ],
  "tw-editorial-section": [
    "!p-[100px_clamp(24px,_8vw,_126px)] scroll-mt-[64px] [@media(max-width:_767px)]:!p-[70px_22px]",
  ],
  "tw-editorial-sectionInner": [
    "max-w-content m-[0_auto]",
  ],
  "tw-editorial-tonepaper": [
    "bg-portfolio-paper text-portfolio-ink",
  ],
  "tw-editorial-tonemuted": [
    "bg-portfolio-surface text-portfolio-ink",
  ],
  "tw-editorial-toneink": [
    "bg-portfolio-night text-white [&_.editorial-sectionHeading_>_p:last-child]:text-[rgba(255,_255,_255,_0.7)]",
    "[&_.editorial-tagList_li]:[border-color:rgba(245,_242,_235,_0.28)] [&_.editorial-tagList_li]:text-[rgba(245,_242,_235,_0.82)]",
  ],
  "tw-editorial-sectionHeading": [
    "grid grid-cols-[minmax(0,_1.4fr)_minmax(200px,_0.6fr)] items-end gap-[48px] mb-[52px] [&_.editorial-eyebrow]:col-[1/-1] [&_.editorial-eyebrow]:mb-[-30px]",
    "[&_h2]:max-w-[850px] [&_h2]:text-inherit [&_h2]:font-display [&_h2]:text-[clamp(48px,_6vw,_82px)] [&_h2]:font-[650] [&_h2]:tracking-[-0.035em] [&_h2]:leading-[1.01]",
    "[&_h2]:[text-wrap:balance] [&_>_p:last-child]:max-w-[420px] [&_>_p:last-child]:text-portfolio-muted [&_>_p:last-child]:text-[18px] [&_>_p:last-child]:leading-[1.45]",
    "[@media(max-width:_767px)]:grid-cols-[1fr] [@media(max-width:_767px)]:gap-[18px] [@media(max-width:_767px)]:mb-[34px]",
    "[@media(max-width:_767px)]:[&_.editorial-eyebrow]:mb-[0] [@media(max-width:_767px)]:[&_h2]:text-[clamp(42px,_10vw,_64px)]",
  ],
  "tw-editorial-row": [
    "[border-top:1px_solid_rgba(32,_35,_33,_0.18)] [transition:background-color_280ms_ease-out] [&:last-child]:[border-bottom:1px_solid_rgba(32,_35,_33,_0.18)]",
    "[@media(prefers-reduced-motion:_reduce)]:[transition:none]",
  ],
  "tw-editorial-rowControl": [
    "grid relative w-full min-h-[156px] grid-cols-[54px_minmax(0,_1fr)_auto_minmax(100px,_200px)_30px] items-center gap-[clamp(14px,_2vw,_34px)] p-[24px_8px] [border:0]",
    "text-inherit bg-transparent [font:inherit] text-left [text-decoration:none] cursor-pointer [transition:background_150ms_ease] [&::after]:absolute [&::after]:right-[8px]",
    "[&::after]:bottom-[0] [&::after]:left-[8px] [&::after]:h-px [&::after]:bg-portfolio-red [&::after]:[content:''] [&::after]:[transform:scaleX(0)]",
    "[&::after]:origin-[left_center] [&::after]:[transition:transform_420ms_cubic-bezier(0.16,_1,_0.3,_1)] [&::after]:pointer-events-none [&:hover]:bg-[rgba(196,_59,_49,_0.04)]",
    "[&:hover]:[text-decoration:none] [&:focus-visible]:bg-[rgba(196,_59,_49,_0.04)] [&:focus-visible]:[text-decoration:none] [&:hover::after]:[transform:scaleX(1)]",
    "[&:focus-visible::after]:[transform:scaleX(1)] [&:hover_.editorial-rowArrow]:[transform:translate(3px,_-3px)] [&:hover_.editorial-rowTitle]:tracking-[-0.015em]",
    "[&:focus-visible_.editorial-rowTitle]:tracking-[-0.015em] [&:hover_.editorial-rowImage_img]:[transform:scale(1.045)]",
    "[&:focus-visible_.editorial-rowImage_img]:[transform:scale(1.045)] [@media(max-width:_767px)]:grid-cols-[30px_minmax(0,_1fr)_24px] [@media(max-width:_767px)]:min-h-[140px]",
    "[@media(max-width:_767px)]:gap-[12px] [@media(max-width:_767px)]:p-[20px_0]",
  ],
  "tw-editorial-rowArrow": [
    "col-[-2/-1] justify-self-end text-portfolio-red text-[24px] [transition:transform_150ms_ease]",
  ],
  "tw-editorial-rowIndex": [
    "text-portfolio-muted [font-family:'Portfolio_Plex_Mono',_ui-monospace,_monospace] text-[11px] tracking-[0.06em] leading-normal uppercase",
  ],
  "tw-editorial-rowEyebrow": [
    "[font-family:'Portfolio_Plex_Mono',_ui-monospace,_monospace] text-[11px] tracking-[0.06em] leading-normal uppercase text-portfolio-red",
  ],
  "tw-editorial-rowMeta": [
    "text-portfolio-muted [font-family:'Portfolio_Plex_Mono',_ui-monospace,_monospace] text-[11px] tracking-[0.06em] leading-normal uppercase max-w-[200px]",
    "[overflow-wrap:anywhere] [@media(max-width:_767px)]:hidden",
  ],
  "tw-editorial-rowCopy": [
    "grid gap-[6px] min-w-[0]",
  ],
  "tw-editorial-rowTitle": [
    "text-inherit font-display text-[clamp(27px,_3vw,_43px)] font-semibold tracking-[-0.03em] leading-[1.04] [transition:letter-spacing_220ms_ease]",
    "[@media(max-width:_767px)]:text-[clamp(27px,_8vw,_36px)]",
  ],
  "tw-editorial-rowDescription": [
    "max-w-[68ch] text-portfolio-muted text-body-px leading-[1.55] [@media(max-width:_767px)]:text-[15px]",
  ],
  "tw-editorial-rowImage": [
    "relative w-[140px] h-[90px] overflow-hidden bg-[#242b2e] [&_img]:object-cover [&_img]:[transition:transform_520ms_cubic-bezier(0.16,_1,_0.3,_1)]",
    "[@media(max-width:_767px)]:hidden",
  ],
  "tw-editorial-rowDetailMotion": [
    "overflow-hidden",
  ],
  "tw-editorial-rowToggle": [
    "col-[-2/-1] justify-self-end w-[24px] h-[24px] text-portfolio-red",
  ],
  "tw-editorial-rowToggleVertical": [
    "origin-[12px_12px] [transition:transform_280ms_cubic-bezier(0.16,_1,_0.3,_1)] [@media(prefers-reduced-motion:_reduce)]:[transition:none]",
  ],
  "tw-editorial-rowExpanded": [
    "[&_.editorial-rowToggleVertical]:[transform:rotate(90deg)] bg-portfolio-surface",
  ],
  "tw-editorial-rowDetail": [
    "p-[0_40px_50px_62px] [&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:max-w-[45ch] [&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:m-[32px_0_12px]",
    "[&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:text-portfolio-ink [&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:font-display [&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:font-semibold",
    "[&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:tracking-[-0.02em] [&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:leading-tight [&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:normal-case",
    "[&_:where(h1,_h2,_h3,_h4,_h5,_h6)]:[text-wrap:balance] [&_:where(h1,_h2)]:text-[clamp(25px,_2.2vw,_30px)] [&_h3]:text-[clamp(22px,_2vw,_26px)]",
    "[&_h4]:text-[clamp(20px,_1.8vw,_23px)] [&_h5]:text-[19px] [&_h6]:text-[18px] [&_:where(p,_li)]:m-[0_0_14px] [&_:where(p,_li)]:text-portfolio-ink",
    "[&_:where(p,_li)]:text-[17px] [&_:where(p,_li)]:leading-[1.65] [&_:where(p,_ul,_ol,_blockquote)]:max-w-[72ch] [&_:where(ul,_ol)]:pl-[22px]",
    "[&_:where(ul,_ol)]:[list-style:disc] [&_a]:text-portfolio-red [&_:where(pre,_img)]:max-w-full [&_:where(pre,_img)]:overflow-x-auto",
    "[@media(max-width:_767px)]:p-[0_16px_34px_42px]",
  ],
  "tw-editorial-searchInput": [
    "w-full !h-[56px] !p-[0_16px] ![border:1px_solid_rgba(23,_23,_23,_0.32)] rounded-none !text-portfolio-ink !bg-white ![font:16px_var(--portfolio-sans)]",
    "[&::placeholder]:text-[#666] [&:focus]:![outline:2px_solid_var(--portfolio-red)] [&:focus]:outline-offset-2",
  ],
  "tw-editorial-filterBar": [
    "flex flex-wrap gap-[8px] m-[20px_0_44px]",
  ],
  "tw-editorial-filterButton": [
    "min-h-[44px] p-[0_14px] [border:1px_solid_rgba(23,_23,_23,_0.24)] text-portfolio-ink bg-transparent [font:12px_var(--portfolio-body)] cursor-pointer",
    "[&:hover]:border-portfolio-ink [&:hover]:text-white [&:hover]:bg-portfolio-ink",
  ],
  "tw-editorial-filterButtonActive": [
    "[&.editorial-filterButtonActive]:border-portfolio-ink [&.editorial-filterButtonActive]:text-white [&.editorial-filterButtonActive]:bg-portfolio-ink",
  ],
  "tw-editorial-emptyState": [
    "p-[70px_0] text-portfolio-muted text-[20px]",
  ],
  "tw-editorial-searchStatus": [
    "flex min-h-[56px] justify-between items-center gap-[16px] text-portfolio-muted text-[14px] [@media(max-width:_767px)]:items-start [@media(max-width:_767px)]:flex-col",
    "[@media(max-width:_767px)]:pt-[16px]",
  ],
  "tw-editorial-technologyFilters": [
    "m-[-20px_0_32px] [&_summary]:w-fit [&_summary]:min-h-[44px] [&_summary]:p-[12px_0] [&_summary]:cursor-pointer [&_summary]:text-[15px]",
    "[&_summary:focus-visible]:[outline:2px_solid_var(--portfolio-red)] [&_summary:focus-visible]:outline-offset-4",
  ],
  "tw-editorial-featured": [
    "grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] gap-[clamp(28px,_6vw,_100px)] items-center [@media(max-width:_767px)]:grid-cols-[1fr]",
  ],
  "tw-editorial-featuredImage": [
    "relative block min-h-[410px] overflow-hidden bg-[#252d2f] [&_img]:object-cover [&_img]:[transition:transform_500ms_ease] [&:hover_img]:[transform:scale(1.025)]",
    "[@media(max-width:_767px)]:min-h-[300px]",
  ],
  "tw-editorial-featuredCopy": [
    "[&_h2]:m-[20px_0] [&_h2]:text-inherit [&_h2]:font-display [&_h2]:text-[clamp(40px,_5vw,_72px)] [&_h2]:font-semibold [&_h2]:tracking-[-0.035em] [&_h2]:leading-[1.03]",
    "[&_>_p]:text-[rgba(255,_255,_255,_0.72)] [&_>_p]:text-[18px] [&_>_p]:leading-normal [@media(max-width:_767px)]:[&_>_p:not(.editorial-eyebrow)]:[display:-webkit-box]",
    "[@media(max-width:_767px)]:[&_>_p:not(.editorial-eyebrow)]:[-webkit-box-orient:vertical] [@media(max-width:_767px)]:[&_>_p:not(.editorial-eyebrow)]:[-webkit-line-clamp:4]",
    "[@media(max-width:_767px)]:[&_>_p:not(.editorial-eyebrow)]:overflow-hidden [@media(max-width:_767px)]:[&_.editorial-eyebrow]:tracking-[0.04em]",
  ],
  "tw-editorial-textLink": [
    "inline-flex items-center gap-[28px] mt-[28px] text-inherit text-body-px font-bold underline decoration-1 underline-offset-[6px] [&:hover]:text-portfolio-red",
  ],
  "tw-editorial-tagList": [
    "flex flex-wrap gap-[8px] m-[20px_0] p-[0] [list-style:none] [&_li]:p-[5px_9px] [&_li]:[border:1px_solid_rgba(23,_23,_23,_0.2)] [&_li]:text-portfolio-muted",
    "[&_li]:[font:11px_'Portfolio_Plex_Mono',_ui-monospace,_monospace] [&_li]:uppercase",
  ],
  "tw-editorial-contactBand": [
    "[--portfolio-selection-color:var(--portfolio-red)] [--portfolio-selection-background:#fff] flex items-end justify-between gap-[48px] p-[88px_clamp(24px,_8vw,_126px)]",
    "text-white bg-portfolio-red [&_.editorial-eyebrow]:text-white [&_h2]:max-w-[860px] [&_h2]:m-[14px_0_0] [&_h2]:text-white [&_h2]:font-display",
    "[&_h2]:text-[clamp(48px,_6vw,_88px)] [&_h2]:font-[650] [&_h2]:tracking-[-0.035em] [&_h2]:leading-[0.98] [&_>_a]:inline-flex [&_>_a]:min-w-[180px] [&_>_a]:min-h-[50px]",
    "[&_>_a]:items-center [&_>_a]:justify-between [&_>_a]:gap-[20px] [&_>_a]:p-[0_18px] [&_>_a]:[border:1px_solid_#fff] [&_>_a]:text-white [&_>_a]:text-[15px] [&_>_a]:font-bold",
    "[&_>_a]:[text-decoration:none] [&_>_a:hover]:text-portfolio-red [&_>_a:hover]:bg-white [&_p]:max-w-[52ch] [&_p]:m-[22px_0_0] [&_p]:text-white [&_p]:text-[18px]",
    "[&_p]:leading-normal [&_.editorial-hiringLinks]:flex-shrink-0 [&_.editorial-hiringLinks]:flex-col [&_.editorial-hiringLinks]:items-start",
    "[&_.editorial-hiringLinks_a:first-child]:min-h-[50px] [&_.editorial-hiringLinks_a:first-child]:p-[0_18px] [&_.editorial-hiringLinks_a:first-child]:[border:1px_solid_#fff]",
    "[&_.editorial-hiringLinks_a:first-child]:[text-decoration:none] [&_.editorial-hiringLinks_a:first-child:hover]:text-portfolio-red",
    "[&_.editorial-hiringLinks_a:first-child:hover]:bg-white [@media(max-width:_767px)]:block [@media(max-width:_767px)]:p-[70px_22px] [@media(max-width:_767px)]:[&_>_a]:w-fit",
    "[@media(max-width:_767px)]:[&_>_a]:mt-[30px] [@media(max-width:_767px)]:[&_.editorial-hiringLinks]:mt-[30px]",
  ],
  "tw-editorial-hiringLinks": [
    "flex flex-wrap items-center gap-[8px_20px] [&_a]:inline-flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:text-inherit [&_a]:text-body-px [&_a]:font-semibold",
    "[&_a]:underline [&_a]:underline-offset-[5px] [&_a:focus-visible]:[outline:2px_solid_currentColor] [&_a:focus-visible]:outline-offset-4",
  ],
  "tw-editorial-resumePreview": [
    "block w-full h-[100dvh] [border:0] bg-portfolio-night",
  ],
  // commandPalette
  "tw-commandPalette-overlay": [
    "fixed z-[100] inset-[0] flex items-start justify-center p-[clamp(24px,_10vh,_96px)_24px] bg-transparent [@media(max-width:_600px)]:p-[16px_12px]",
  ],
  "tw-commandPalette-backdrop": [
    "absolute inset-[0] bg-[rgba(25,_33,_31,_0.68)]",
  ],
  "tw-commandPalette-panel": [
    "relative flex flex-col w-full max-w-[820px] max-h-[calc(100dvh_-_clamp(24px,_10vh,_96px)_*_2)] overflow-hidden text-portfolio-ink bg-portfolio-paper",
    "[box-shadow:0_24px_72px_rgba(25,_33,_31,_0.28)] [&_.command-input]:w-full [&_.command-input]:min-w-[0] [&_.command-input]:h-auto [&_.command-input]:min-h-[48px]",
    "[&_.command-input]:m-[0] [&_.command-input]:p-[8px_0] [&_.command-input]:[border:0] [&_.command-input]:rounded-none [&_.command-input]:text-portfolio-ink",
    "[&_.command-input]:bg-transparent [&_.command-input]:caret-portfolio-red [&_.command-input]:[font:400_clamp(18px,_2.3vw,_24px)/1.35_var(--portfolio-body)]",
    "[&_.command-input]:[box-shadow:none] [&_.command-input::placeholder]:text-portfolio-muted [&_.command-input::placeholder]:opacity-100",
    "[&_.command-input:focus]:[outline:none] [&_.command-input:focus]:[box-shadow:inset_0_-2px_var(--portfolio-red)] [&_.command-close]:inline-flex",
    "[&_.command-close]:min-w-[44px] [&_.command-close]:min-h-[44px] [&_.command-close]:items-center [&_.command-close]:gap-[8px] [&_.command-close]:m-[0]",
    "[&_.command-close]:p-[0_10px] [&_.command-close]:[border:1px_solid_rgba(32,_35,_33,_0.24)] [&_.command-close]:rounded-none [&_.command-close]:text-portfolio-muted",
    "[&_.command-close]:bg-transparent [&_.command-close]:[font:400_13px/1_var(--portfolio-body)] [&_.command-close]:tracking-[normal] [&_.command-close]:normal-case",
    "[&_.command-close]:cursor-pointer [&_.command-close:hover]:border-portfolio-red [&_.command-close:hover]:text-portfolio-red",
    "[&_button:focus-visible]:[outline:2px_solid_var(--portfolio-red)] [&_button:focus-visible]:outline-offset-[-4px] [&_.command-result]:flex [&_.command-result]:w-full",
    "[&_.command-result]:min-h-[86px] [&_.command-result]:items-center [&_.command-result]:justify-between [&_.command-result]:gap-[24px] [&_.command-result]:m-[0]",
    "[&_.command-result]:p-[18px_12px] [&_.command-result]:[border:0] [&_.command-result]:[&]:[border-bottom:1px_solid_rgba(32,_35,_33,_0.18)] [&_.command-result]:rounded-none",
    "[&_.command-result]:text-portfolio-ink [&_.command-result]:bg-transparent [&_.command-result]:[font:400_16px/1.4_var(--portfolio-body)]",
    "[&_.command-result]:tracking-[normal] [&_.command-result]:text-left [&_.command-result]:normal-case [&_.command-result]:cursor-pointer",
    "[&_.command-result]:[transition:background-color_160ms_ease-out,_color_160ms_ease-out] [&_.command-result[aria-selected=true]]:text-portfolio-red",
    "[&_.command-result[aria-selected=true]]:bg-portfolio-surface [&_.command-result:hover]:text-portfolio-red [&_.command-result:hover]:bg-portfolio-surface",
    "[@media(max-width:_600px)]:max-h-[calc(100dvh_-_32px)] [@media(max-width:_600px)]:[&_.command-result]:gap-[12px]",
    "[@media(max-width:_600px)]:[&_.command-result]:p-[16px_10px] [@media(prefers-reduced-motion:_reduce)]:[&_.command-result]:[transition:none]",
  ],
  "tw-commandPalette-header": [
    "flex flex-shrink-0 items-center gap-[16px] p-[22px_28px] [border-bottom:1px_solid_rgba(32,_35,_33,_0.24)] [@media(max-width:_600px)]:gap-[8px]",
    "[@media(max-width:_600px)]:p-[12px_16px]",
  ],
  "tw-commandPalette-inputGroup": [
    "flex flex-[1] min-w-[0] items-center gap-[16px] [@media(max-width:_600px)]:gap-[10px]",
  ],
  "tw-commandPalette-searchIcon": [
    "w-[24px] h-[24px] flex-shrink-0 text-portfolio-red",
  ],
  "tw-commandPalette-close": [
    "[&_kbd]:[font:11px_var(--portfolio-mono)] [@media(max-width:_600px)]:[&_span]:hidden",
  ],
  "tw-commandPalette-results": [
    "min-h-[0] p-[0_28px] overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:var(--portfolio-red)_var(--portfolio-muted-surface)]",
    "[@media(max-width:_600px)]:p-[0_12px]",
  ],
  "tw-commandPalette-resultCopy": [
    "min-w-[0]",
  ],
  "tw-commandPalette-title": [
    "text-[clamp(20px,_2.5vw,_27px)] font-semibold tracking-[-0.02em] leading-[1.15]",
  ],
  "tw-commandPalette-subtitle": [
    "max-w-[68ch] mt-[6px] text-portfolio-muted text-[14px] leading-[1.45]",
  ],
  "tw-commandPalette-category": [
    "flex-shrink-0 text-portfolio-muted text-label-px [@media(max-width:_600px)]:text-[11px]",
  ],
  "tw-commandPalette-empty": [
    "p-[64px_12px] text-portfolio-muted text-[18px] text-center",
  ],
  "tw-commandPalette-footer": [
    "flex flex-shrink-0 justify-between gap-[20px] p-[16px_28px] [border-top:1px_solid_rgba(32,_35,_33,_0.24)] text-portfolio-muted text-label-px leading-normal",
    "[&_strong]:text-portfolio-ink [&_strong]:font-semibold [@media(max-width:_600px)]:p-[14px_16px] [@media(max-width:_600px)]:[&_>_span:last-child]:hidden",
  ],
};
