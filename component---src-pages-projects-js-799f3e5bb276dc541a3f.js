(self.webpackChunknirmalhk7_gitlab=self.webpackChunknirmalhk7_gitlab||[]).push([[853],{7744:function(e,a,t){"use strict";t.r(a);var l=t(3349),n=t(1788),c=t(7294),r=t(296),o=t(3751),s=t(8014),i=t(9519),d=function(e){function a(a){var t;return(t=e.call(this,a)||this).handleClick=function(e){e.preventDefault(),e.persist(),t.state.openIndex===parseInt(e.target.id.split("-")[1])?t.setState({hasClicked:!1,openIndex:-1}):t.setState({hasClicked:!0,openIndex:parseInt(e.target.id.split("-")[1])})},t.state={openIndex:-1,hasClicked:!1},t.handleClick=t.handleClick.bind((0,l.Z)(t)),t}return(0,n.Z)(a,e),a.prototype.render=function(){var e=this;return c.createElement(c.Fragment,null,c.createElement(r.Z,{location:this.props.location},c.createElement(o.Z,{title:"Projects"}),c.createElement("section",{className:"page-header page-hero parallax bootstrap-wrapper",id:"projects-header"},c.createElement("div",{className:"container page-header__content"},c.createElement("article",{className:"col-full"},c.createElement("h1",{className:"page-header__title"},c.createElement("a",{href:"#0",title:"Projects"},"Projects")),c.createElement("div",{className:"page-header__info"},c.createElement("div",{className:"page-header__cat"},"Projects Catalogue of Nirmal Khedkar")),c.createElement("p",{className:"narrow"},"I'm a fullstack and hybrid product developer, currently understanding how ML models are deployed on cloud platforms. I love building stuff! ",c.createElement(i.G,{icon:s.klh,className:"ml-2"}))))),c.createElement("section",{className:"blog-content-wrap bootstrap-wrapper"},c.createElement("div",{className:"container blog-content"},c.createElement("div",{className:""},c.createElement("div",{className:"blog-list block-1-2 block-tab-full"},c.createElement("div",{className:"accordion js-accordion"},c.createElement("div",{className:"row"},this.props.data.allFile.group.map((function(a,t){return c.createElement("div",{className:"col-lg-6 col-md-12",key:t},c.createElement("h6",{id:a.fieldValue},a.fieldValue),a.edges.map((function(a,l){return c.createElement("div",{id:"accordion-"+t+l,key:t+"-"+l,onClick:e.handleClick,className:"accordion__item js-accordion-item "+(e.state.hasClicked&&10*t+l===e.state.openIndex?"active":"")},c.createElement("div",{id:"accordionheader-"+t+l,className:"accordion-header js-accordion-header"},a.node.childMarkdownRemark.frontmatter.title),c.createElement("div",{className:"accordion-body js-accordion-body",style:{display:e.state.hasClicked&&e.state.openIndex===10*t+l?"block":"none"}},c.createElement("div",{className:"accordion-body__contents",dangerouslySetInnerHTML:{__html:a.node.childMarkdownRemark.html}})))})))}))))))))))},a}(c.Component);a.default=d}}]);
//# sourceMappingURL=component---src-pages-projects-js-799f3e5bb276dc541a3f.js.map