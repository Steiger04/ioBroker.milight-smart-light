(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{206:function(t,e,n){"use strict";n.r(e);var r=n(15),a=n.n(r),l=n(126),o=n.n(l),s=n(3),i={data:function(){return{sliderSettings:{tooltip:!1,min:1,max:100,height:90,dotWidth:32,dotHeight:86,processStyle:{backgroundColor:"transparent"},bgStyle:{borderRadius:"6px",backgroundImage:"-webkit-linear-gradient(left, #000000, #ffffff)"},sliderStyle:{borderRadius:"6px",backgroundColor:"transparent",boxShadow:"1px 1px 8px 1px rgba(0, 0, 0, 0.6)"}}}},components:{mslSlider:o.a},computed:a()({},Object(s.c)(["LOADED_ZONE","DPS"]),{brightnessOnly:function(){return this.DPS[this.LOADED_ZONE._id+".brightnessOnly"].val}}),methods:a()({},Object(s.b)(["UPDATE_DP_FROM_CLIENT","UPDATE_DP"]),{bo:function(t){this.UPDATE_DP_FROM_CLIENT({value:t,dp:"brightnessOnly",delay:500})}})},d=n(5),c=Object(d.a)(i,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{attrs:{"fill-height":"",fluid:"","grid-list-xl":""}},[n("v-layout",{attrs:{column:""}},[n("v-flex",{attrs:{xs4:"","d-inline-flex":"","align-center":""}},[n("v-layout",{attrs:{row:"","justify-space-around":"","text-xs-center":""}},[n("v-flex",{attrs:{xs12:""}},[n("v-btn",{attrs:{round:"",dark:"",large:"",color:"blue darken-2"},on:{click:function(e){t.UPDATE_DP_FROM_CLIENT({value:!0,dp:"effectModeNext",delay:500})}}},[n("v-icon",{attrs:{left:"",dark:""}},[t._v("arrow_upward")]),t._v("\n            next mode\n          ")],1)],1)],1)],1),t._v(" "),n("v-flex",{attrs:{xs4:"","d-inline-flex":"","align-center":""}},[n("msl-slider",t._b({staticStyle:{padding:"0"},attrs:{value:t.brightnessOnly},on:{callback:t.bo}},"msl-slider",t.sliderSettings,!1))],1),t._v(" "),n("v-flex",{attrs:{xs4:"","d-inline-flex":"","align-center":""}},[n("v-layout",{attrs:{row:"","justify-space-around":"","text-xs-center":""}},[n("v-flex",{attrs:{xs4:""}},[n("v-btn",{attrs:{fab:"",dark:"",large:"",color:"light-blue lighten-2"},on:{click:function(e){t.UPDATE_DP_FROM_CLIENT({value:!0,dp:"effectSpeedUp",delay:500})}}},[n("v-icon",{attrs:{dark:""}},[t._v("keyboard_arrow_up")])],1)],1),t._v(" "),n("v-flex",{attrs:{xs4:""}},[n("v-btn",{attrs:{fab:"",dark:"",large:"",color:"blue darken-4"},on:{click:function(e){t.UPDATE_DP_FROM_CLIENT({value:!0,dp:"effectSpeedDown",delay:500})}}},[n("v-icon",{attrs:{dark:""}},[t._v("keyboard_arrow_down")])],1)],1)],1)],1)],1)],1)},[],!1,null,"7b03bdda",null);c.options.__file="index.vue";e.default=c.exports}}]);