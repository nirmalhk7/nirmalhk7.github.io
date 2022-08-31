
const getItem = (element) => element.childMarkdownRemark.frontmatter;

function slideToggle(mdiv) {
    var slideOpen = true;
    var heightChecked = false;
    var initHeight = 0;
    var intval = null;

    window.clearInterval(intval);
    if (!heightChecked) {
        initHeight = mdiv.offsetHeight;
        heightChecked = true;
    }
    if (slideOpen) {
        var h = initHeight;
        slideOpen = false;
        intval = setInterval(function () {
            h--;
            mdiv.style.height = h + 'px';
            if (h <= 0)
                window.clearInterval(intval);
        }, 1
        );
    }
    else {
        var h = 0;
        slideOpen = true;
        intval = setInterval(function () {
            h++;
            mdiv.style.height = h + 'px';
            if (h >= initHeight)
                window.clearInterval(intval);
        }, 1
        );
    }
}

export { getItem, slideToggle };

