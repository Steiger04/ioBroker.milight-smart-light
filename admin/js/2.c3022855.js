(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"17e1":function(e,t,o){"use strict";o("4daf")},"1c6d":function(e,t,o){var r=o("ca46");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=o("499e").default;a("1030ca23",r,!0,{sourceMap:!1})},"3bf8":function(e,t,o){var r=o("24fb");t=r(!1),t.push([e.i,".bridge-card[data-v-4456d26e]{width:600px;max-width:100%}",""]),e.exports=t},"4daf":function(e,t,o){var r=o("3bf8");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=o("499e").default;a("5a18cbb5",r,!0,{sourceMap:!1})},"5bd9":function(e,t,o){var r=o("caad");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=o("499e").default;a("5a56cdc9",r,!0,{sourceMap:!1})},"5ec9":function(e,t,o){var r=o("24fb");t=r(!1),t.push([e.i,".zone-form[data-v-6a72cfba]{width:100%}.sticky-header[data-v-6a72cfba]{max-height:500px}.sticky-header .q-table__bottom[data-v-6a72cfba],.sticky-header .q-table__top[data-v-6a72cfba],.sticky-header thead tr:first-child th[data-v-6a72cfba]{background-color:#bdbdbd}.sticky-header thead tr th[data-v-6a72cfba]{position:-webkit-sticky;position:sticky;z-index:1}.sticky-header thead tr:first-child th[data-v-6a72cfba]{top:0}.sticky-header.q-table--loading thead tr:last-child th[data-v-6a72cfba]{top:48px}",""]),e.exports=t},"753a":function(e,t,o){"use strict";o("5bd9")},bc13:function(e,t,o){"use strict";o.r(t);var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-page",[o("div",{staticClass:"row justify-center q-pa-md"},[o("q-card",{staticClass:"home-card",class:{"bg-grey-5":!e.$q.dark.isActive},attrs:{flat:""}},[o("q-tabs",{class:{"text-grey-1":!e.$q.dark.isActive},attrs:{dense:"","narrow-indicator":"","active-color":"primary",align:"justify"},model:{value:e.formTab,callback:function(t){e.formTab=t},expression:"formTab"}},[o("q-tab",{class:{"text-negative":!e.isValidBridge},attrs:{name:"bridgeForm",label:e.$t("tabs.bridge")}}),o("q-tab",{class:{"text-negative":!e.isValidZones},attrs:{name:"zonesForm",label:e.$t("tabs.zones")}}),o("q-tab",{class:{"text-negative":!e.isValidApp},attrs:{name:"appForm",label:e.$t("tabs.app")}})],1),o("q-separator"),o("q-tab-panels",{class:{pannels:!e.$q.dark.isActive},attrs:{animated:""},model:{value:e.formTab,callback:function(t){e.formTab=t},expression:"formTab"}},[o("q-tab-panel",{attrs:{name:"bridgeForm"}},[o("bridge-form")],1),o("q-tab-panel",{attrs:{name:"zonesForm"}},[o("zones-form")],1),o("q-tab-panel",{attrs:{name:"appForm"}},[o("app-form")],1)],1)],1)],1)])},a=[],s=o("9446"),n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"row justify-center"},[o("q-card",{staticClass:"bridge-card",class:{"bg-grey-4":!e.$q.dark.isActive}},[o("q-card-section",[o("q-select",{attrs:{options:e.controllerTypeOptions,"emit-value":"","map-options":"",label:e.$t("bridgeForm.type"),"transition-show":"scale","transition-hide":"scale",hint:e.$t("bridgeForm.changeMessage")},on:{input:e.deleteAllZones},model:{value:e.controllerType,callback:function(t){e.controllerType=t},expression:"controllerType"}}),e.isVersion6?o("div",{staticClass:"row q-pt-lg justify-around"},[o("div",{staticClass:"row"},[o("div",{staticClass:"col"},[o("q-option-group",{attrs:{options:e.iboxOptions,inline:"",color:"primary"},on:{input:e.deleteAllZones},model:{value:e.iBox,callback:function(t){e.iBox=t},expression:"iBox"}}),o("q-item",[o("q-item-section",[o("q-item-label",{attrs:{caption:""}},[e._v(e._s(e.$t("bridgeForm.changeMessage")))])],1)],1)],1),o("q-separator",{attrs:{vertical:"",inset:""}}),o("div",{staticClass:"col"},[o("q-option-group",{attrs:{options:e.maxZonesOptions,inline:"",color:"primary"},on:{input:e.deleteAllZones},model:{value:e.maxZones,callback:function(t){e.maxZones=t},expression:"maxZones"}}),o("q-item",[o("q-item-section",[o("q-item-label",{attrs:{caption:""}},[e._v(e._s(e.$t("bridgeForm.changeMessage")))])],1)],1)],1)],1)]):e._e()],1),o("q-separator"),o("q-card-section",[o("div",{staticClass:"row"},[o("div",{staticClass:"col"},[o("q-input",{attrs:{label:e.$t("bridgeForm.controllerIp"),error:e.$v.controllerIp.$error,"error-message":e.validationMsg(e.$v.controllerIp,e.$t("bridgeForm.controllerIp"))},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.controllerIp.$model=""}}})]},proxy:!0}]),model:{value:e.$v.controllerIp.$model,callback:function(t){e.$set(e.$v.controllerIp,"$model",t)},expression:"$v.controllerIp.$model"}})],1),o("div",{staticClass:"col-auto q-pl-lg self-center"},[o("q-btn",{ref:"refreshButton",attrs:{round:"",color:"primary",icon:"refresh"},on:{click:e.provideControllerIps}})],1)]),o("q-input",{attrs:{label:e.$t("bridgeForm.controllerPort"),error:e.$v.controllerPort.$error,"error-message":e.validationMsg(e.$v.controllerPort,e.$t("bridgeForm.controllerPort"))},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.controllerPort.$model=""}}})]},proxy:!0}]),model:{value:e.$v.controllerPort.$model,callback:function(t){e.$set(e.$v.controllerPort,"$model",t)},expression:"$v.controllerPort.$model"}}),o("q-input",{attrs:{label:e.$t("bridgeForm.commandRepeat"),error:e.$v.commandRepeat.$error,"error-message":e.validationMsg(e.$v.commandRepeat,e.$t("bridgeForm.commandRepeat"))},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.commandRepeat.$model=""}}})]},proxy:!0}]),model:{value:e.$v.commandRepeat.$model,callback:function(t){e.$set(e.$v.commandRepeat,"$model",t)},expression:"$v.commandRepeat.$model"}}),o("q-input",{attrs:{label:e.$t("bridgeForm.delayBetweenCommands"),error:e.$v.delayBetweenCommands.$error,"error-message":e.validationMsg(e.$v.delayBetweenCommands,e.$t("bridgeForm.delayBetweenCommands"))},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.delayBetweenCommands.$model=""}}})]},proxy:!0}]),model:{value:e.$v.delayBetweenCommands.$model,callback:function(t){e.$set(e.$v.delayBetweenCommands,"$model",t)},expression:"$v.delayBetweenCommands.$model"}})],1)],1)],1)},l=[],i=(o("e6cf"),o("ded3")),c=o.n(i),m=o("b5ae"),d=o("376d"),p=o("2f62"),u=o("3452");const b={required(e,t){return this.$t("validateMsg.required",{field:t})},ipAddress({$model:e}){return this.$t("validateMsg.ip",{field:e})},numeric(e,t){return this.$t("validateMsg.numeric",{field:t})},maxLength({$params:e},t){return this.$t("validateMsg.max",{field:t,length:e.maxLength.max})},between({$params:e},t){return this.$t("validateMsg.between",{field:t,min:e.between.min,max:e.between.max})},minValue({$params:e},t){return this.$t("validateMsg.minValue",{field:t,min:e.minValue.min})},isunique(e,t){return this.$t("validateMsg.isunique",{field:t})},isAllowedZoneNumber({$model:e},t){return this.$t("validateMsg.isAllowedZoneNumber",{field:t,value:this.$t(`zonesForm.zone${e}`)})},isAllowedZoneType({$model:e},t){return this.$t("validateMsg.isAllowedZoneType",{field:t,value:this.$t(`zonesForm.${e}`)})},regexColorOffset({$model:e},t){return this.$t("validateMsg.regexColorOffset",{field:t,value:e})},regexGroupAndName({$model:e},t){return this.$t("validateMsg.regexGroupAndName",{field:t,value:e})}};var $={name:"BridgeForm",mixins:[s["a"],u["a"]],data(){return{controllerIps:[],controllerTypeOptions:[{label:this.$t("bridgeForm.v6"),value:"v6"},{label:this.$t("bridgeForm.legacy"),value:"legacy"}],iboxOptions:[{label:this.$t("bridgeForm.ibox1"),value:"iBox1"},{label:this.$t("bridgeForm.ibox2"),value:"iBox2"}],maxZonesOptions:[{label:this.$t("bridgeForm.4zones"),value:"4"},{label:this.$t("bridgeForm.8zones"),value:"8"}]}},computed:{isVersion6(){return"v6"===this.controllerType},dlgBg(){return this.$q.dark.isActive?"":"bg-grey-4 text-grey-9"}},methods:c()(c()({},Object(p["b"])("template",["deleteAllZones"])),{},{validationMsg:Object(d["validationMessage"])(b),async provideControllerIps(){this.controllerIps=[];const e=await this.$connection.socket.getState("system.adapter.milight-smart-light.0.alive");if(!e||!e.val)return void(this.errorText=this.$t("bridgeForm.startInstance"));this.$refs.refreshButton.$el.disabled=!0;let t=await this.$connection.socket.sendTo(this.$connection.instanceId,"discover");t=t.map((e=>({label:`${e.type}|${e.ip}|${e.mac}`,value:e.ip,color:"primary"}))),this.controllerIps=t,this.controllerIps.length?this.selectIpDlg():this.errorText=this.$t("bridgeForm.noBridgeFound"),this.$refs.refreshButton.$el.disabled=!1},selectIpDlg(){this.$q.dialog({class:this.dlgBg,title:this.$t("tabs.bridge"),options:{type:"radio",model:this.controllerIp,items:this.controllerIps},cancel:!0}).onOk((e=>{this.controllerIp=e}))}}),watch:{isVersion6(e){this.controllerPort=e?"5987":"8899"},"$v.$anyError":function(e){this.isValidBridge=!e}},created(){this.$v.$touch()},validations:{controllerIp:{required:m["required"],ipAddress:m["ipAddress"]},controllerPort:{required:m["required"],numeric:m["numeric"],maxLength:Object(m["maxLength"])(5),between:Object(m["between"])(1024,64738)},commandRepeat:{required:m["required"],numeric:m["numeric"],between:Object(m["between"])(1,9)},delayBetweenCommands:{required:m["required"],numeric:m["numeric"],between:Object(m["between"])(20,1e3)}}},f=$,v=(o("17e1"),o("2877")),h=o("f09f"),g=o("a370"),y=o("ddd8"),x=o("9f0a"),q=o("66e5"),w=o("4074"),k=o("0170"),Z=o("eb85"),z=o("27f9"),C=o("0016"),F=o("9c40"),T=o("eebe"),O=o.n(T),N=Object(v["a"])(f,n,l,!1,null,"4456d26e",null),A=N.exports;O()(N,"components",{QCard:h["a"],QCardSection:g["a"],QSelect:y["a"],QOptionGroup:x["a"],QItem:q["a"],QItemSection:w["a"],QItemLabel:k["a"],QSeparator:Z["a"],QInput:z["a"],QIcon:C["a"],QBtn:F["a"]});var M=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"row justify-center"},[o("q-card",{staticClass:"app-card",class:{"bg-grey-4":!e.$q.dark.isActive}},[o("q-card-section",[o("q-toggle",{attrs:{label:e.$t("appForm.activeApp"),"checked-icon":"check",color:"green","unchecked-icon":"clear"},model:{value:e.activeApp,callback:function(t){e.activeApp=t},expression:"activeApp"}})],1),o("q-separator"),o("q-card-section",{attrs:{disabled:!e.activeApp}},[o("q-input",{attrs:{label:e.$t("appForm.serverPort"),error:e.$v.serverPort.$error,"error-message":e.validationMsg(e.$v.serverPort,e.$t("appForm.serverPort")),disable:!e.activeApp},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.serverPort.$model=""}}})]},proxy:!0}]),model:{value:e.$v.serverPort.$model,callback:function(t){e.$set(e.$v.serverPort,"$model",t)},expression:"$v.serverPort.$model"}}),o("q-input",{attrs:{label:e.$t("appForm.socketPort"),error:e.$v.socketPort.$error,"error-message":e.validationMsg(e.$v.socketPort,e.$t("appForm.socketPort")),disable:!e.activeApp},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.socketPort.$model=""}}})]},proxy:!0}]),model:{value:e.$v.socketPort.$model,callback:function(t){e.$set(e.$v.socketPort,"$model",t)},expression:"$v.socketPort.$model"}}),o("q-input",{attrs:{label:e.$t("appForm.debounceTime"),error:e.$v.debounceTime.$error,"error-message":e.validationMsg(e.$v.debounceTime,e.$t("appForm.debounceTime")),disable:!e.activeApp},scopedSlots:e._u([{key:"append",fn:function(){return[o("q-icon",{staticClass:"cursor-pointer",attrs:{name:"close"},on:{click:function(t){e.$v.debounceTime.$model=""}}})]},proxy:!0}]),model:{value:e.$v.debounceTime.$model,callback:function(t){e.$set(e.$v.debounceTime,"$model",t)},expression:"$v.debounceTime.$model"}})],1)],1)],1)},Q=[],_={name:"AppForm",mixins:[s["a"]],data(){return{}},methods:{validationMsg:Object(d["validationMessage"])(b)},watch:{"$v.$anyError":function(e){this.isValidApp=!e}},validations:{serverPort:{required:m["required"],numeric:m["numeric"],maxLength:Object(m["maxLength"])(5),between:Object(m["between"])(1024,64738)},socketPort:{required:m["required"],numeric:m["numeric"],maxLength:Object(m["maxLength"])(5),between:Object(m["between"])(1024,64738)},debounceTime:{required:m["required"],numeric:m["numeric"],maxLength:Object(m["maxLength"])(4),minValue:Object(m["minValue"])(100)}},created(){this.$v.$touch()}},I=_,P=(o("cf7c"),o("9564")),B=Object(v["a"])(I,M,Q,!1,null,"66261eca",null),j=B.exports;O()(B,"components",{QCard:h["a"],QCardSection:g["a"],QToggle:P["a"],QSeparator:Z["a"],QInput:z["a"],QIcon:C["a"]});var S=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-card",{staticClass:"zone-form",class:{"bg-grey-4":!e.$q.dark.isActive}},[o("q-card-section",[o("q-table",{staticClass:"sticky-header",class:{"bg-grey-4":!e.$q.dark.isActive},attrs:{dense:"","hide-pagination":"","rows-per-page-options":[0],"no-data-label":e.$t("zonesForm.nodata"),separator:"none",flat:"",title:"Zonen","row-key":"name",columns:e.dynColumns,data:e.tableZones},scopedSlots:e._u([{key:"top",fn:function(){return[o("q-btn",{attrs:{disable:e.isMaxZones,icon:"add",color:"primary"},on:{click:function(t){return e.addZone(e.$v.zones.$touch)}}})]},proxy:!0},{key:"header-cell",fn:function(t){return[o("q-th",{attrs:{props:t}},[o("span",{staticClass:"text-primary text-body1 text-weight-bolder"},[e._v("\n                          "+e._s(t.col.label)+"\n                      ")])])]}},{key:"body",fn:function(t){return[o("q-tr",{attrs:{props:t}},[o("q-td",{key:"zoneActive",attrs:{props:t}},[o("q-toggle",{attrs:{"checked-icon":"check",color:"green","unchecked-icon":"clear"},model:{value:t.row.$model.mslZoneActive,callback:function(o){e.$set(t.row.$model,"mslZoneActive",o)},expression:"props.row.$model.mslZoneActive"}})],1),o("q-td",{key:"zoneNumber",attrs:{props:t}},[o("q-select",{attrs:{"transition-show":"scale","transition-hide":"scale","item-aligned":"",dense:"",filled:"",borderless:"","emit-value":"","map-options":"",error:t.row.mslZoneNumber.$error,options:e.zoneNumberOptions},model:{value:t.row.$model.mslZoneNumber,callback:function(o){e.$set(t.row.$model,"mslZoneNumber",o)},expression:"props.row.$model.mslZoneNumber"}})],1),o("q-td",{key:"groupName",attrs:{props:t}},[o("q-input",{attrs:{"item-aligned":"",filled:"",dense:"","bottom-slots":"",error:t.row.mslGroupName.$error},model:{value:t.row.$model.mslGroupName,callback:function(o){e.$set(t.row.$model,"mslGroupName",o)},expression:"props.row.$model.mslGroupName"}})],1),o("q-td",{key:"zoneType",attrs:{props:t}},[o("q-select",{attrs:{"transition-show":"scale","transition-hide":"scale","item-aligned":"",dense:"",filled:"",borderless:"","emit-value":"","map-options":"",error:t.row.mslZoneType.$error,options:e.zoneTypeOptions},model:{value:t.row.$model.mslZoneType,callback:function(o){e.$set(t.row.$model,"mslZoneType",o)},expression:"props.row.$model.mslZoneType"}})],1),o("q-td",{key:"colorOffset",attrs:{props:t}},[o("q-input",{attrs:{"item-aligned":"",dense:"",filled:"",error:t.row.mslColorOffset.$error,disable:!e.isColorOffset(t.row.$model),placeholder:e.isColorOffset(t.row.$model)?"":"-x-x-x-"},model:{value:t.row.$model.mslColorOffset,callback:function(o){e.$set(t.row.$model,"mslColorOffset",o)},expression:"props.row.$model.mslColorOffset"}})],1),o("q-td",{key:"zoneName",attrs:{props:t}},[o("q-input",{attrs:{"item-aligned":"",dense:"",filled:"",error:t.row.mslZoneName.$error},model:{value:t.row.$model.mslZoneName,callback:function(o){e.$set(t.row.$model,"mslZoneName",o)},expression:"props.row.$model.mslZoneName"}})],1),o("q-td",{key:"room",attrs:{props:t}},[o("q-select",{attrs:{"transition-show":"scale","transition-hide":"scale",dense:"",filled:"",borderless:"","emit-value":"","map-options":"",options:e.roomOptions},model:{value:t.row.$model.mslRoom,callback:function(o){e.$set(t.row.$model,"mslRoom",o)},expression:"props.row.$model.mslRoom"}})],1),o("q-td",{key:"func",attrs:{props:t}},[o("q-select",{attrs:{"transition-show":"scale","transition-hide":"scale",dense:"",filled:"","use-chips":"",borderless:"","emit-value":"","map-options":"",multiple:"",value:t.row.$model.mslFunc,options:e.funcOptions},on:{input:function(e){t.row.$model.mslFunc=e.sort()}}})],1),o("q-td",{key:"delete",attrs:{props:t}},[o("q-btn",{attrs:{size:"sm",icon:"delete_forever",round:"",color:"negative"},on:{click:function(o){return e.deleteZone(t.row.$model.id)}}})],1)],1)]}},e.isErrorMessages?{key:"bottom",fn:function(){return[o("div",{staticClass:"row q-pt-sm"},e._l(e.errorMessages,(function(t,r,a){return o("q-chip",{key:a,attrs:{dense:"",color:"red-4","text-color":"grey-1"}},[o("q-avatar",{attrs:{color:"negative","text-color":"white"}},[e._v("\n              "+e._s(t)+"\n            ")]),e._v("\n            "+e._s(r)+"\n          ")],1)})),1)]},proxy:!0}:null,{key:"no-data",fn:function(t){t.icon;var r=t.message;return[o("div",{staticClass:"full-width row flex-center text-negative text-weight-bolder q-pt-md"},[o("q-icon",{attrs:{size:"2em",name:"sentiment_dissatisfied"}}),o("span",[e._v(e._s(r))])],1)]}}],null,!0)})],1)],1)},R=[],E=o("5935");function G(e){let t=0;return this.zones.forEach((o=>{o.mslZoneNumber===e&&t++})),!(t>1)}function V(e,t){return"fullColor"!==e&&"fullColor8Zone"!==e||t.mslColorOffset||(t.mslColorOffset="0x48"),!0}function L(e,t){return"5"===e&&"4"===this.maxZones||"9"===e?"bridge"===t.mslZoneType:"bridge"!==t.mslZoneType}function D(e,t){return"5"===t.mslZoneNumber&&"4"===this.maxZones||"9"===t.mslZoneNumber?"bridge"===e:"bridge"!==e}function J(e,t){return"fullColor"===t.mslZoneType||"fullColor8Zone"===t.mslZoneType?RegExp("^(0x)?[0-9a-f]{2}$","i").test(e):(t.mslColorOffset=null,!0)}function H(e){return!RegExp("[\\]\\[*,;'\"`´<>\\\\?]").test(e)}var K={name:"ZonesForm",mixins:[s["a"]],data(){return{columns:[{name:"zoneActive",label:this.$t("zonesForm.thactive"),field:"$model.mslZoneActive",align:"center"},{name:"zoneNumber",label:this.$t("zonesForm.thzonenumber"),field:"$model.mslZoneNumber",align:"center"},{name:"groupName",label:this.$t("zonesForm.thgroupname"),field:"$model.mslGroupName",sortable:!0,align:"center"},{name:"zoneType",label:this.$t("zonesForm.thzonetype"),field:"$model.mslZoneType",sortable:!0,align:"center"},{name:"colorOffset",label:this.$t("zonesForm.thcoloroffset"),field:"$model.mslColorOffset",align:"center"},{name:"zoneName",label:this.$t("zonesForm.thzonename"),field:"$model.mslZoneName",sortable:!0,align:"center"},{name:"room",label:this.$t("zonesForm.throom"),field:"$model.mslRoom",sortable:!0,align:"center"},{name:"func",label:this.$t("zonesForm.thfunction"),field:"$model.mslFunc",align:"center"},{name:"delete",align:"center"}]}},computed:c()(c()({},Object(E["c"])("template",{zones:"native.zones"})),{},{errorMessages(){const e=[],t={};return this.tableZones.forEach((t=>{t.mslZoneNumber&&t.mslZoneNumber.$error&&e.push(this.validationMsg(t.mslZoneNumber,this.$t("zonesForm.thzonenumber"))),t.mslGroupName&&t.mslGroupName.$error&&e.push(this.validationMsg(t.mslGroupName,this.$t("zonesForm.thgroupname"))),t.mslZoneType&&t.mslZoneType.$error&&e.push(this.validationMsg(t.mslZoneType,this.$t("zonesForm.thzonetype"))),t.mslColorOffset&&t.mslColorOffset.$error&&e.push(this.validationMsg(t.mslColorOffset,this.$t("zonesForm.thcoloroffset"))),t.mslZoneName&&t.mslZoneName.$error&&e.push(this.validationMsg(t.mslZoneName,this.$t("zonesForm.thzonename")))})),e.forEach((e=>{t[e]=(t[e]||0)+1})),t},isErrorMessages(){return Object.keys(this.errorMessages).length},isColorOffset:()=>e=>"fullColor"===e.mslZoneType||"fullColor8Zone"===e.mslZoneType,isMaxZones(){return this.zoneNumberOptions.length===this.zones.length},tableZones(){return Object.values(this.$v.zones.$each.$iter).map((e=>e))},dynColumns(){return"legacy"===this.controllerType?this.columns.filter((e=>"colorOffset"!==e.name)):this.columns},zoneNumberOptions(){const e=[{label:this.$t("zonesForm.zone1"),value:"1"},{label:this.$t("zonesForm.zone2"),value:"2"},{label:this.$t("zonesForm.zone3"),value:"3"},{label:this.$t("zonesForm.zone4"),value:"4"},{label:this.$t("zonesForm.zone5"),value:"5"},{label:this.$t("zonesForm.zone6"),value:"6"},{label:this.$t("zonesForm.zone7"),value:"7"},{label:this.$t("zonesForm.zone8"),value:"8"},{label:this.$t("zonesForm.zone9"),value:"9"}];return"v6"===this.controllerType?"iBox1"===this.iBox?"4"===this.maxZones?e.length=5:e.length=9:"4"===this.maxZones?e.length=4:e.length=8:e.length=4,e},zoneTypeOptions(){const e=[{label:this.$t("zonesForm.white"),value:"white"},{label:this.$t("zonesForm.rgbw"),value:"rgbw"},{label:this.$t("zonesForm.fullColor"),value:"fullColor"},{label:this.$t("zonesForm.fullColor8Zone"),value:"fullColor8Zone"},{label:this.$t("zonesForm.bridge"),value:"bridge"}];return"v6"===this.controllerType?("iBox1"===this.iBox||(e.length=4),e):(e.length=2,e)}}),methods:c()({validationMsg:Object(d["validationMessage"])(b)},Object(p["b"])("template",["addZone","deleteZone"])),watch:{"$v.$anyError":function(e){this.isValidZones=!e}},validations:{zones:{$each:{mslZoneNumber:{required:m["required"],isAllowedZoneNumber:L,isunique:G},mslGroupName:{required:m["required"],regexGroupAndName:H},mslZoneType:{required:m["required"],defaultColorOffset:V,isAllowedZoneType:D},mslColorOffset:{regexColorOffset:J},mslZoneName:{regexGroupAndName:H}}}},created(){this.$v.$touch()}},U=K,W=(o("c507"),o("eaac")),X=o("357e"),Y=o("bd08"),ee=o("db86"),te=o("b047"),oe=o("cb32"),re=Object(v["a"])(U,S,R,!1,null,"6a72cfba",null),ae=re.exports;O()(re,"components",{QCard:h["a"],QCardSection:g["a"],QTable:W["a"],QBtn:F["a"],QTh:X["a"],QTr:Y["a"],QTd:ee["a"],QToggle:P["a"],QSelect:y["a"],QInput:z["a"],QChip:te["a"],QAvatar:oe["a"],QIcon:C["a"]});var se={name:"Home",components:{AppForm:j,BridgeForm:A,ZonesForm:ae},mixins:[s["a"]],data(){return{formTab:"bridgeForm"}}},ne=se,le=(o("753a"),o("9989")),ie=o("429b"),ce=o("7460"),me=o("adad"),de=o("823b"),pe=Object(v["a"])(ne,r,a,!1,null,"40636061",null);t["default"]=pe.exports;O()(pe,"components",{QPage:le["a"],QCard:h["a"],QTabs:ie["a"],QTab:ce["a"],QSeparator:Z["a"],QTabPanels:me["a"],QTabPanel:de["a"]})},c507:function(e,t,o){"use strict";o("cdbc")},ca46:function(e,t,o){var r=o("24fb");t=r(!1),t.push([e.i,".app-card[data-v-66261eca]{width:600px;max-width:100%}",""]),e.exports=t},caad:function(e,t,o){var r=o("24fb");t=r(!1),t.push([e.i,".home-card[data-v-40636061]{width:100%}.pannels[data-v-40636061]{background:#efefef}",""]),e.exports=t},cdbc:function(e,t,o){var r=o("5ec9");"string"===typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);var a=o("499e").default;a("26d17f56",r,!0,{sourceMap:!1})},cf7c:function(e,t,o){"use strict";o("1c6d")}}]);