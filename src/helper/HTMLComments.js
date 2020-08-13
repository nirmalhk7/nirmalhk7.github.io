import React from "react";
var HTMLComment = React.createClass({
  componentDidMount: function () {
    var htmlComment = "<!--" + this.props.comment + "-->";
    this.span.innerHTML = htmlComment;
  },

  render: function () {
    return <span ref={(span) => (this.span = span)}></span>;
  },
});
export default HTMLComment;
