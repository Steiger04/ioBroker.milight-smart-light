(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{276:function(e,t,n){e.exports=n.p+"img/fb0cb74.png"},277:function(e,t){e.exports=function(component,e){var t="function"==typeof component.exports?component.exports.extendOptions:component.options;for(var i in"function"==typeof component.exports&&(t.directives=component.exports.options.directives),t.directives=t.directives||{},e)t.directives[i]=t.directives[i]||e[i]}},281:function(e,t,n){"use strict";n.r(t);n(245),n(262),n(275);var r={name:"Intro",props:{newsize:0},data:function(){return{}},computed:{resize:function(){return this.newsize>600?600:this.newsize}}},o=n(14),c=n(52),l=n.n(c),f=n(41),component=Object(o.a)(r,function(){var e=this.$createElement,t=this._self._c||e;return t("v-avatar",{attrs:{tile:"",size:this.resize+"px"}},[t("img",{attrs:{src:n(276)}})])},[],!1,null,null,null),d=component.exports;l()(component,{VAvatar:f.a});var v={components:{mslIntro:d},data:function(){return{windowSize:0}},mounted:function(){this.onResize()},methods:{onResize:function(){this.windowSize=window.innerWidth-64}}},w=n(42),z=n(43),h=n(44),m=n(277),x=n.n(m),y=n(16),R=Object(o.a)(v,function(){var e=this.$createElement,t=this._self._c||e;return t("v-container",{attrs:{"fill-height":"",fluid:""}},[t("v-layout",{directives:[{name:"resize",rawName:"v-resize",value:this.onResize,expression:"onResize"}],attrs:{row:""}},[t("v-flex",{attrs:{layout:"","align-center":"","justify-center":""}},[t("msl-intro",{attrs:{newsize:this.windowSize}})],1)],1)],1)},[],!1,null,null,null);t.default=R.exports;l()(R,{VContainer:w.a,VFlex:z.a,VLayout:h.a}),x()(R,{Resize:y.a})}}]);