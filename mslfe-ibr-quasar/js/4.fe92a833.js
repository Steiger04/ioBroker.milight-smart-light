(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"3ca1":function(t,e,n){"use strict";var i=function(){var t,e,n,i,o=this,s=o.$createElement,a=o._self._c||s;return a("transition",{attrs:{"enter-active-class":"animated zoomIn","leave-active-class":"animated zoomOut"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:o.visible,expression:"visible"}],staticClass:"column relative-position items-center"},[a("div",{staticClass:"row items-center"},[a("div",{staticClass:"inline-block tw-border-0"},[a("img",{staticClass:"tw-h-12 tw-w-12",attrs:{src:"../statics/img/msl-"+o.boxTypeName+"-web-alpha.png"},on:{click:function(t){return t.stopPropagation(),o.$q.fullscreen.toggle()}}})]),a("div",{staticClass:"inline-block tw-border-0 tw-ml-2"},[a("div",{staticClass:"tw-tracking-widest tw-text-gray-400 tw-text-xl tw-font-medium"},[o._v("\n          "+o._s(o.instance.instance_id)+"\n        ")]),a("div",[a("span",{staticClass:"tw-text-gray-600"},[o._v(o._s(o.boxTypeName))]),a("span",{staticClass:"tw-text-gray-600 text-bold"},[o._v(" | ")]),a("span",{staticClass:"tw-tracking-widest tw-text-gray-600"},[o._v(o._s(o.instance.native.controllerIp))])])])]),a("div",{staticClass:"row items-center tw-mt-2"},[a("div",[a("div",{staticClass:"tw-inline-block tw-mr-1 tw-tracking-wide tw-text-xs tw-text-gray-500 tw-uppercase"},[o._v("\n          connected\n        ")]),a("q-badge",{class:(t={},t["tw-bg-green-700 tw-text-green-100"]=o.connected,t["tw-bg-red-700 tw-text-red-100"]=!o.connected,t)},[o._v("\n          "+o._s(o._f("yesno")(o.connected))+"\n          "),a("q-icon",{class:(e={},e["fas fa-thumbs-up tw-ml-2 tw-my-px"]=o.connected,e["fas fa-frown tw-ml-2 tw-my-px"]=!o.connected,e),attrs:{size:"xs"}})],1)],1),a("div",{},[a("div",{staticClass:"tw-inline-block tw-mr-1 tw-ml-4 tw-text-gray-500 tw-text-xs tw-tracking-wide tw-uppercase"},[o._v("\n          alive\n        ")]),a("q-badge",{class:(n={},n["tw-bg-green-700 tw-text-green-100"]=o.alive,n["tw-bg-red-700 tw-text-red-100"]=!o.alive,n)},[o._v("\n          "+o._s(o._f("yesno")(o.alive))+"\n          "),a("q-icon",{class:(i={},i["fas fa-thumbs-up tw-ml-2 tw-my-px"]=o.alive,i["fas fa-frown tw-ml-2 tw-my-px"]=!o.alive,i),attrs:{size:"xs"}})],1)],1),a("div",{directives:[{name:"show",rawName:"v-show",value:o.isConnectedAndAlive,expression:"isConnectedAndAlive"}],staticClass:"absolute-top-right tw-mr-2 tw-text-grey-10 tw-mt-0 tw-border-0 tw-border-green-0"},[a("q-icon",{staticClass:"float-right fas fa-times-circle tw-ml-2 tw-my-px",attrs:{size:"sm"},on:{click:function(t){return t.stopPropagation(),o.invisible(t)}}})],1)])])])},o=[],s=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("c47a")),a=n.n(s),r=n("2f62");function c(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function l(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?c(Object(n),!0).forEach((function(e){a()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var d={name:"BridgeStatus",data:function(){return{visible:!0}},filters:{yesno:function(t){return t?"yes":"no"}},props:["instance"],computed:l({},Object(r["d"])("msladapter",{statevalues:function(t){return t.ids.statevalues}}),{isConnectedAndAlive:function(){return this.statevalues[this.instance._id+".connected"].val&&this.statevalues[this.instance._id+".alive"].val},alive:function(){return this.statevalues[this.instance._id+".alive"].val},boxTypeName:function(){return"v6"===this.instance.native.controllerType?this.instance.native.iBox:"legacy"},connected:function(){return this.statevalues[this.instance._id+".connected"].val}}),methods:{invisible:function(){this.visible=!1,this.$emit("invisible",this.instance.instance_id)}}},u=d,f=n("2877"),p=n("eebe"),b=n.n(p),h=n("58a8"),m=n("0016"),v=Object(f["a"])(u,i,o,!1,null,null,null);e["a"]=v.exports;b()(v,"components",{QBadge:h["a"],QIcon:m["a"]})},7065:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{"enter-active-class":"animated fadeInRight"}},[n("q-layout",{attrs:{view:"HHH LpR FFF"}},[n("q-header",{staticClass:"bg-black"},[n("bridge-status",{ref:"bridgestatus",staticClass:"tw-mt-1 tw-mb-2",attrs:{instance:t.instances[t.instanceId]}})],1),n("q-page-container",[n("keep-alive",[n("router-view")],1)],1),n("q-footer",{staticClass:"bg-black"},[n("zone-on-off",{staticClass:"tw-mx-2 tw-mb-2",attrs:{picker:t.zones[t.zoneId].picker,zoneCommonName:t.zones[t.zoneId].common.name,zoneId:t.zoneId,left:!0}})],1)],1)],1)},o=[],s=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("c47a")),a=n.n(s),r=n("3ca1"),c=n("b153"),l=n("2f62");function d(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?d(Object(n),!0).forEach((function(e){a()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var f={name:"LayoutZone",components:{BridgeStatus:r["a"],ZoneOnOff:c["a"]},props:["instanceId","zoneId"],computed:u({},Object(l["d"])("msladapter",{instances:function(t){return t.ids.instances},zones:function(t){return t.ids.zones}})),beforeRouteUpdate:function(t,e,n){void 0===t.meta.store.state.msladapter.ids.zones[t.params.zoneId]?n({path:e.path,replace:!0}):n()},activated:function(){this.$refs.bridgestatus.visible=!0}},p=f,b=n("2877"),h=n("eebe"),m=n.n(h),v=n("4d5a"),w=n("e359"),g=n("09e3"),O=n("7ff0"),y=Object(b["a"])(p,i,o,!1,null,null,null);e["default"]=y.exports;m()(y,"components",{QLayout:v["a"],QHeader:w["a"],QPageContainer:g["a"],QFooter:O["a"]})},"7e11":function(t,e,n){"use strict";n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d");var i=n("c47a"),o=n.n(i),s=n("2f62"),a=n("17f5"),r=n("f74f"),c=n("d3fb"),l=n("808d"),d=n("009a"),u=n("ebb6"),f=n("df5a"),p=n("e95d"),b=n("de5c"),h=n("4b59"),m=n("a744"),v=n("d792"),w=n("9f2d"),g=n("bee6"),O=n("373b");function y(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function j(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?y(Object(n),!0).forEach((function(e){o()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):y(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}e["a"]={props:["zoneId"],computed:j({},Object(s["d"])("msladapter",{statevalues:function(t){return t.ids.statevalues},debounceTime:function(t){return t.debounceTime}}),{bindColor:function(){return this.statevalues[this.zoneId+".rgb"].val}}),methods:j({},Object(s["b"])("msladapter",["setStateFromClient"])),domStreams:["touchstart$","touchend$"],subscriptions:function(){var t=this,e=this.$createObservableMethod("setComponentState").pipe(Object(d["a"])(this.debounceTime));this.$subscribeTo(e,(function(e){return t.setStateFromClient({id:t.zoneId+".".concat(e.state),val:e.value})}));var n=this.$createObservableMethod("allZonesOn"),i=n.pipe(Object(u["a"])((function(t){return Object(a["a"])(t)})),Object(f["a"])(),Object(p["a"])((function(t){return Object(r["a"])(Object(c["a"])(t).pipe(Object(b["a"])(!1)),Object(l["a"])(0,200),(function(t,e){return t}))})),Object(h["a"])()),o=i.pipe(Object(u["a"])((function(t){return!1!==t})),Object(m["a"])(!1));this.$subscribeTo(i,(function(e){!1!==e&&t.setStateFromClient({id:e[0]+".on",val:e[1]})}));var s=this.touchstart$.pipe(Object(d["a"])(250),Object(v["a"])((function(e){return Object(l["a"])(0,250).pipe(Object(u["a"])((function(t){return e.data})),Object(w["a"])(t.touchend$.pipe(Object(g["a"])(230))),Object(b["a"])(!1))})),Object(O["a"])());return this.$subscribeTo(s,(function(e){!1!==e&&t.setStateFromClient({id:t.zoneId+".".concat(e),val:!0})})),{disabled$:o,whiteButtons$:s}}}},b153:function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row tw-pb-1"},[n("div",{staticClass:"col-shrink"},[n("q-btn",{directives:[{name:"show",rawName:"v-show",value:t.left,expression:"left"}],staticClass:"tw-mr-1 tw-rounded-lg tw-text-gray-500 tw-bg-gray-800",staticStyle:{height:"100%"},attrs:{icon:"fas fa-angle-double-left",replace:"",to:"/"}})],1),n("div",{staticClass:"col"},[n("q-slide-item",{staticClass:"tw-bg-gray-500 tw-rounded-lg",class:{"tw-bg-gray-700":t.isLight},attrs:{"left-color":"green-6","right-color":"pink-8"},on:{left:function(e){return t.zoneOn(e,!0)},right:function(e){return t.zoneOn(e,!1)}},scopedSlots:t._u([{key:"right",fn:function(){return[n("q-icon",{attrs:{name:"fas fa-toggle-off",size:"sm"}})]},proxy:!0},{key:"left",fn:function(){return[n("q-icon",{attrs:{name:"fas fa-toggle-on",size:"sm"}})]},proxy:!0}])},[n("div",{staticClass:"row items-center",class:{"tw-text-gray-400":t.isLight,"tw-text-gray-800":!t.isLight},staticStyle:{"min-height":"3.2rem"}},[n("div",{staticClass:"col-shrink self-center"},[n("transition",{attrs:{"enter-active-class":"animated flipInX","leave-active-class":"animated flipOutX"}},[n("q-icon",{directives:[{name:"show",rawName:"v-show",value:t.palette,expression:"palette"}],attrs:{size:"md",color:!0===t.statevalues[t.zoneId+".on"].val?"green-6":"pink-8",name:"fas fa-lightbulb"}})],1)],1),n("div",{staticClass:"col"},[n("transition",{attrs:{"enter-active-class":"animated flipInX","leave-active-class":"animated flipOutX"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.palette,expression:"palette"}],staticClass:"ellipsis-2-lines tw-ml-2 q-py-md-md md:tw-text-xl tw-text-base tw-tracking-wide tw-font-medium"},[t._v("\n              "+t._s(t.zoneCommonName)+"\n            ")])])],1),n("div",{staticClass:"col-shrink"},[n("action-palette",{ref:"actionpalette",class:{"tw-pointer-events-none":"#000000"===t.zoneColor&&t.left},attrs:{zoneColor:t.zoneColor,zoneId:t.zoneId,actionItems:t.right?t.modePalette:t.allowedPicker},on:{"actionpalette-show":function(e){t.palette=!1},"actionpalette-hide":function(e){t.palette=!0},"select-mode":function(e){return t.setComponentState({state:e,value:!0})}}})],1)])])],1),n("div",{staticClass:"col-shrink"},[n("q-btn",{directives:[{name:"show",rawName:"v-show",value:t.right,expression:"right"}],staticClass:" tw-ml-1 tw-rounded-lg tw-text-gray-500 tw-bg-gray-800",staticStyle:{height:"100%"},attrs:{icon:"fas fa-angle-double-right",replace:""},on:{click:function(e){return t.activePickerChange()}}})],1)])},o=[],s=(n("8e6e"),n("8a81"),n("ac6a"),n("cadf"),n("06db"),n("456d"),n("a481"),n("c47a")),a=n.n(s),r=n("66cb"),c=n.n(r),l=n("2f62"),d=n("7e11"),u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("q-fab",{ref:"qfab",style:{color:t.zoneColor},attrs:{type:"buttton",flat:"",icon:t.icon,"active-icon":t.actionItems.includes("whiteMode")?"fas fa-cog":"fas fa-palette",direction:"left"},on:{"before-show":function(e){return t.$emit("actionpalette-show")},"before-hide":function(e){return t.$emit("actionpalette-hide")}}},t._l(t.actionItems,(function(e,i){return n("q-fab-action",{key:i,staticClass:"tw-p-0",style:"padding: 0px; margin: 0px -12px;",attrs:{icon:"",flat:"",unelevated:""},on:{click:function(n){return t.selectModeAndPicker(e)}}},[n("q-img",{attrs:{contain:"",width:"62px",ratio:4/3,basic:"",src:"statics/img/msl-"+e.toLowerCase()+"-alpha.png"}})],1)})),1)],1)},f=[];n("6b54");function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function b(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){a()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var h={name:"ActionPalette",props:["actionItems","zoneColor","zoneId"],data:function(){return{}},computed:b({},Object(l["c"])("msladapter",["getActivePickerFromZone"]),{activePicker:function(){return this.getActivePickerFromZone(this.zoneId)},grey:function(){return c()(this.zoneColor).greyscale().toString()}},Object(l["d"])("msladapter",{actionMode:function(t){return t.ids.zones[this.zoneId].actionMode},activePicker:function(t){return t.ids.zones[this.zoneId].picker},isWhiteMode:function(t){return"white"===this.zoneType||t.ids.statevalues[this.zoneId+".whiteMode"].val},isNightMode:function(t){return t.ids.statevalues[this.zoneId+".nightMode"].val},zoneType:function(t){return t.ids.zones[this.zoneId].common["mslZoneType"]}}),{icon:function(){return"whiteMode"===this.actionMode?"fas fa-sun":"nightMode"===this.actionMode?"fas fa-moon":"fas fa-square"}}),watch:{isNightMode:function(){this.isNightMode&&"nightMode"!==this.actionMode&&this.setActionMode({zoneId:this.zoneId,actionMode:"nightMode"}),this.isWhiteMode||this.isNightMode||this.setActionMode({zoneId:this.zoneId,actionMode:"none"})},isWhiteMode:function(){this.isWhiteMode&&"whiteMode"!==this.actionMode&&this.setActionMode({zoneId:this.zoneId,actionMode:"whiteMode"}),this.isWhiteMode||this.isNightMode||this.setActionMode({zoneId:this.zoneId,actionMode:"none"})},zoneColor:function(){this.zoneColor!==this.grey?(this.setActionMode({zoneId:this.zoneId,actionMode:"none"}),"whiteSlider"===this.activePicker&&this.setActivePicker({zoneId:this.zoneId,picker:"wheel"})):"#000000"!==this.zoneColor&&this.setActionMode({zoneId:this.zoneId,actionMode:"whiteMode"})}},methods:b({},Object(l["b"])("msladapter",["setActivePicker","setActionMode"]),{selectModeAndPicker:function(t){"whiteMode"===t||"nightMode"===t?(this.$emit("select-mode",t),"whiteMode"===t&&this.setActivePicker({zoneId:this.zoneId,picker:"whiteSlider"})):this.setActivePicker({zoneId:this.zoneId,picker:t})}})},m=h,v=n("2877"),w=n("eebe"),g=n.n(w),O=n("c294"),y=n("72db"),j=n("068f"),z=Object(v["a"])(m,u,f,!1,null,null,null),P=z.exports;function C(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function k(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?C(Object(n),!0).forEach((function(e){a()(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):C(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}g()(z,"components",{QFab:O["a"],QFabAction:y["a"],QImg:j["a"]});var I={name:"ZoneOnOff",mixins:[d["a"]],components:{actionPalette:P},props:{isPalette:{type:Boolean,default:!0},left:{type:Boolean,default:!1},right:{type:Boolean,default:!1},picker:String,zoneCommonName:String},data:function(){return{palette:!0}},computed:k({},Object(l["d"])("msladapter",{statevalues:function(t){return t.ids.statevalues},zones:function(t){return t.ids.zones}}),{},Object(l["c"])("msladapter",["getColorFromZone","getAllowedPickerFromZone"]),{modePalette:function(){return"white"===this.zones[this.zoneId].common["mslZoneType"]?["nightMode"]:["nightMode","whiteMode"]},allowedPicker:function(){return this.getAllowedPickerFromZone(this.zoneId)},zoneColor:function(){return this.getColorFromZone(this.zoneId)},isLight:function(){return c()(this.zoneColor).isLight()}}),updated:function(){!0===this.$refs.actionpalette.$refs.qfab.showing&&"#000000"===this.zoneColor&&!0===this.left&&this.$refs.actionpalette.$refs.qfab.hide()},methods:k({activePickerChange:function(){this.$router.replace(this.zoneId)}},Object(l["b"])("msladapter",["setStateFromClient","setActivePicker"]),{zoneOn:function(t,e){var n=t.reset;this.setComponentState({state:"on",value:e}),n()}})},x=I,M=n("9c40"),_=n("de1d"),S=n("0016"),A=Object(v["a"])(x,i,o,!1,null,"933d6684",null);e["a"]=A.exports;g()(A,"components",{QBtn:M["a"],QSlideItem:_["a"],QIcon:S["a"]})}}]);