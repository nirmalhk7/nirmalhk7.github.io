(self.webpackChunknirmalhk7_gitlab=self.webpackChunknirmalhk7_gitlab||[]).push([[853],{7744:function(e,t,a){"use strict";a.r(t);var n=a(3349),c=a(3552),l=a(7294),r=a(296),o=a(3751),i=a(8014),s=a(9519),d=function(e){function t(t){var a;return(a=e.call(this,t)||this).handleClick=function(e){e.preventDefault(),e.persist();var t=e.target.id.split("@")[1];a.state.openIndex===t&&a.state.hasClicked?a.setState({hasClicked:!1,openIndex:-1}):a.setState({hasClicked:!0,openIndex:t})},a.state={openIndex:-1,hasClicked:!1,routeKey:new URLSearchParams(t.location.search).get("id")},a.handleClick=a.handleClick.bind((0,n.Z)(a)),a}(0,c.Z)(t,e);var a=t.prototype;return a.componentDidMount=function(){-1===this.state.openIndex&&this.state.routeKey&&this.setState({openIndex:this.state.routeKey,hasClicked:!0})},a.render=function(){var e=this;return l.createElement(r.Z,{location:this.props.location},l.createElement(o.Z,{title:"Projects"}),l.createElement("section",{className:"page-header page-hero parallax bootstrap-wrapper",id:"projects-header"},l.createElement("div",{className:"container page-header__content"},l.createElement("article",{className:""},l.createElement("h1",{className:"page-header__title"},l.createElement("a",{href:"#0",title:"Projects"},"Projects")),l.createElement("div",{className:"page-header__info"},l.createElement("div",{className:"page-header__cat"},"Projects Catalogue of Nirmal Khedkar")),l.createElement("p",{className:"narrow"},"I'm a fullstack and hybrid product developer, currently understanding and exploring cloud platforms. I love building stuff!"," ",l.createElement(s.G,{className:"ml-2 text-accent",icon:i.klh}))))),l.createElement("section",{className:"blog-content-wrap bootstrap-wrapper"},l.createElement("div",{className:"container blog-content"},l.createElement("div",{className:"blog-list block-1-2 block-tab-full"},l.createElement("div",{className:"accordion js-accordion"},l.createElement("div",{className:"row"},this.props.data.allFile.group.map((function(t,a){return l.createElement("div",{className:"col-lg-6 col-md-12",key:a},l.createElement("h6",{id:t.fieldValue},t.fieldValue),t.edges.map((function(t,a){return l.createElement("div",{className:"accordion__item js-accordion-item "+(e.state.hasClicked&&t.node.id===e.state.openIndex?"active":""),id:"acc@"+t.node.id,key:a},l.createElement("div",{className:"accordion-header js-accordion-header",id:"header@"+t.node.id,onClick:e.handleClick,onKeyDown:e.handleClick,role:"button",tabIndex:0},t.node.childMarkdownRemark.frontmatter.title),l.createElement("div",{className:"accordion-body js-accordion-body bg-gray",style:{display:e.state.hasClicked&&e.state.openIndex===t.node.id?"block":"none"}},l.createElement("div",{className:"accordion-body__contents",dangerouslySetInnerHTML:{__html:t.node.childMarkdownRemark.html}})))})))}))))))))},t}(l.Component);t.default=d}}]);
//# sourceMappingURL=component---src-pages-projects-js-c46367c6528bf53f37ab.js.map