"use strict";(self.webpackChunknirmalhk7_personal_website=self.webpackChunknirmalhk7_personal_website||[]).push([[410],{8529:function(e,t,a){var l=a(7294),n=a(1597),r=a(2978),o={mini:function(){return l.createElement("div",null)},Max:function(e){var t=e.bgImg,a=e.orangeText,o=e.HeadingTextComponent,i=e.buttonDetails,c=e.showScrollDown;return l.createElement("section",{className:"s-home   bg-fixed bg-center bg-no-repeat "+t+" bg-cover relative z-10"},l.createElement("div",{className:"z-0 bg-black h-full left-0 opacity-40 absolute top-0 w-full"}),l.createElement("div",{className:"home-content  pt-40 z-10"},l.createElement("div",{className:"tablet:container mx-auto home-content__main"},l.createElement("h3",{className:"ital-hover"},a),o,l.createElement("div",{className:"static text-left gap-4 right-0 bottom-8  text-button font-blocky uppercase font-bold"},i&&i.map((function(e){return l.createElement(n.Link,{className:"inline-block mr-4 border-4 no-underline px-5 text-white border-white hover:bg-white hover:text-black",key:e[0],to:e[1]},e[0])}))),c?l.createElement("div",{className:"home-content__scroll"},l.createElement(n.Link,{className:"scroll-link no-underline hover:text-white",to:"#about"},l.createElement("span",null,"Scroll Down"))):null)),l.createElement(r.Z,null))}};t.Z=o},124:function(e,t,a){a.r(t),a.d(t,{default:function(){return b}});var l=a(7294),n=a(6056),r=a(9625),o=a(1597),i=a(396),c=function(e){var t=e.relativeDirectory,a=e.frontmatter;return l.createElement("section",{className:"bg-gradient-to-r from-accent to-accentLight",id:"blog-first",style:{textDecoration:"none",paddingTop:"2em",paddingBottom:"2em"}},l.createElement("div",{className:"container mx-auto"},l.createElement("div",{className:"grid laptop:grid-cols-2 tablet:grid-cols-2 mobile-l:grid-cols-1 py-10"},l.createElement("div",null,l.createElement(i.G,{alt:"Latest Blog",image:(0,i.d)(a.img),style:{width:"70%",height:"auto"}})),l.createElement("div",{className:"laptop:text-right tablet:text-right relative"},l.createElement("div",{className:"absolute bottom-10"},l.createElement("h1",{className:"font-bold leading-snug mt-0 font-heading text-white",style:{textDecoration:"none"}},a.title),l.createElement("div",{className:"entry-content text-white no-underline mb-10",style:{textDecoration:"none"}},l.createElement("p",null,a.description)),l.createElement(o.Link,{className:"font-blocky uppercase font-bold mr-4 border-4 no-underline p-5 text-white border-white hover:bg-white hover:text-black",to:"/blog/"+t},"Read More"))))))},m=a(7397),s=function(e){var t=e.blogItems,a=e.sitename;return l.createElement("section",{className:"bg-gray"},l.createElement("div",null,l.createElement("div",{className:" m-auto",style:{maxWidth:"1500px"}},l.createElement("div",{className:"section_intro has-bottom-sep",style:{paddingTop:"5em"}},l.createElement("div",{className:"text-center"},l.createElement("h3",null,a),l.createElement("h1",null,"All Posts"))),l.createElement("div",null,l.createElement("div",{className:"columns-4"},t.map((function(e,t){return l.createElement("div",{className:"break-inside-avoid-column",key:t},l.createElement("div",{className:" overflow-hidden relative hover:opacity-100 hover:visible"},l.createElement("div",{className:" before:bg-black before:z-10"},l.createElement(o.Link,{title:m.Z.getFrontmatter(e).description,to:"/blog/"+e.relativeDirectory},l.createElement(i.G,{alt:m.Z.getFrontmatter(e).title,image:(0,i.d)(m.Z.getFrontmatter(e).img),layout:"fill"}))),l.createElement("div",{className:"pt-0 pb-0 pl-12 pr-12 z-10 bottom-12\tleft-0 absolute"},l.createElement("h3",{className:"text-white text-base font-semibold m-0 uppercase font-blocky"},m.Z.getFrontmatter(e).title),l.createElement("strong",{className:"text-accent"},m.Z.getFrontmatter(e).category))))})))))))},d=a(8529),b=function(e){var t=e.location,a=e.data;return a?l.createElement(n.Z,{location:t},l.createElement(r.Z,{title:a.site.siteMetadata.blogName}),l.createElement(d.Z.Max,{HeadingTextComponent:l.createElement("h1",{className:"page-header__title"},l.createElement(o.Link,{title:"",to:"/blog"},a.site.siteMetadata.blogName)),bgImg:"bg-blogWallpaper",buttonDetails:[["Explore","#blog-first"]],orangeText:"Official Blog of Nirmal Khedkar"}),l.createElement(c,{frontmatter:m.Z.getFrontmatter(a.blogs.nodes[0]),relativeDirectory:a.blogs.nodes[0].relativeDirectory}),l.createElement(s,{blogItems:a.blogs.nodes,sitename:a.site.siteMetadata.blogName})):null}}}]);
//# sourceMappingURL=component---src-pages-blog-tsx-9d2c0d76749538d476f8.js.map