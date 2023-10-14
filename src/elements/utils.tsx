import Link from "next/link";

declare type buttonType = React.ForwardRefExoticComponent<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof InternalLinkProps> & InternalLinkProps & {
  children?: React.ReactNode;
} & React.RefAttributes<HTMLAnchorElement>>;

export default class Utils {
  static getFrontmatter(params: { childMarkdownRemark: { frontmatter: object } }): any {
    return params.childMarkdownRemark.frontmatter;
  }

  static slideToggle(mdiv: HTMLElement) {
    let slideOpen = true;
    let heightChecked = false;
    let initHeight = 0;
    let intval = null;

    window.clearInterval(intval);
    if (!heightChecked) {
      initHeight = mdiv.offsetHeight;
      heightChecked = true;
    }
    if (slideOpen) {
      let height = initHeight;
      slideOpen = false;
      intval = setInterval(() => {
        height--;
        mdiv.style.height = `${height}px`;
        if (height <= 0) window.clearInterval(intval);
      }, 1);
    } else {
      let height = 0;
      slideOpen = true;
      intval = setInterval(() => {
        height++;
        mdiv.style.height = `${h}px`;
        if (height >= initHeight) window.clearInterval(intval);
      }, 1);
    }
  }

  static getHeader({ headerName }: { headerName: string }) {
    return (<><h5 className="mb-2">
      {headerName}
    </h5>
      <hr className="mb-4" /></>);
  }
}
