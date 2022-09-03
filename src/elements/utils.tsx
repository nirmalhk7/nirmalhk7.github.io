export default class Utils {
  static getFrontmatter(params: { childMarkdownRemark: { frontmatter: object } }): object {
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
      var h = initHeight;
      slideOpen = false;
      intval = setInterval(() => {
        h--;
        mdiv.style.height = `${h}px`;
        if (h <= 0) window.clearInterval(intval);
      }, 1);
    } else {
      var h = 0;
      slideOpen = true;
      intval = setInterval(() => {
        h++;
        mdiv.style.height = `${h}px`;
        if (h >= initHeight) window.clearInterval(intval);
      }, 1);
    }
  }
}
