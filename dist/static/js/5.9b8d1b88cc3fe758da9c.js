webpackJsonp([5],{ZE9d:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={name:"TypeTest",components:{Toolbar:s("djO7").default},data:function(){return{pageHead:"Typing Test",toolbarShow:!0,testType:"TypeTest",time:6e4,clock:null,hover:!1,mistakes:0,hoverCh:!0,showAnswers:!1,showTest:!1,filter:null,answerData:[],currentAnswer:null,testItems:[],settings:{},fields:["Chinese","English","Choice","Time"]}},methods:{recordAnswer:function(t,e,s){var n=void 0,i=void 0;s===t||s===t+" "?(n=1,i="success"):(n=-1,i="danger");var r=this.mistakes/t.length;r>.3&&(n=-1);var a=(6e4-this.time)/1e3,o={English:t,Chinese:e,Choice:s,Score:n,Time:a>98?"> 60s":a+"s",Error:r,_rowVariant:i};this.answerData.push(o),this.filter+1<this.testItems.length?(console.log(this.filter,this.testItems.length),this.filter+=1,this.mistakes=0,document.getElementById("type").value=""):(console.log("filterMax"),this.filter=null,this.mistakes=0,this.showTest=!1,document.getElementById("type").value="",this.checkAnswers())},start:function(t){this.showAnswers=!1,this.filter=0,this.answerData=[],this.showTest=!0,t&&(this.testItems=t.test,this.settings=JSON.parse(t.settings))},cancel:function(){this.showAnswers=!1,this.filter=null,this.answerData=[],this.showTest=!1,document.getElementById("type").value=""},checkAnswers:function(){this.showAnswers=!0,this.$store.dispatch("updateRecord",{mode:"type",answerData:this.answerData,settingsData:this.settings})},playAudio:function(t){document.getElementById("audio").src=t},setCountdown:function(){this.time=6e4;var t=this;this.clock=setInterval(function(){t.time-=100},100)}},computed:{validAnswer:function(){var t=null;if(!this.currentAnswer)return!1;t=this.currentAnswer.length;var e=this.testItems[this.filter].English;if(this.currentAnswer===this.testItems[this.filter].English||this.currentAnswer===this.testItems[this.filter].English+" ")return!0;if(this.currentAnswer===e.substr(0,t))return!0;if(t>0){return this.mistakes+=1,!1}},validCheck:function(){var t=this.testItems[this.filter].English;return this.currentAnswer===t||this.currentAnswer===t+" "}},watch:{filter:function(){clearInterval(this.clock),this.setCountdown();var t=this.testItems[this.filter];t&&"sdEn"===this.settings.sound?this.playAudio(t.sdEn):t&&"sdCh"===this.settings.sound&&this.playAudio(t.sdCh)},hover:function(){if(!0===this.hover){console.log("hover_active");var t=this.testItems[this.filter];this.playAudio(t.sdEn)}},hoverCh:function(){if(!0===this.hoverCh){console.log("hover2_active");var t=this.testItems[this.filter];this.playAudio(t.sdCh)}}}},i={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"test1"},[s("b-container",[s("audio",{attrs:{id:"audio",autoplay:""}}),t._v(" "),s("b-card",{staticClass:"my-2"},[s("h2",[t._v("\n        "+t._s(t.pageHead)+"\n      ")])])],1),t._v(" "),s("Toolbar",{attrs:{toolbarShow:t.showTest,showAnswers:t.showAnswers,testType:t.testType},on:{newTest:function(e){return t.start(e)},retry:function(e){return t.start()}}}),t._v(" "),s("b-container",[t.showTest?s("b-card",{staticClass:"my-2",attrs:{cols:"10"}},[s("b-progress",{attrs:{value:t.filter,max:t.testItems.length,animated:""}}),t._v(" "),s("br"),t._v(" "),s("b-progress",{attrs:{value:t.time,max:"60000",animated:"",variant:"danger"}})],1):t._e()],1),t._v(" "),s("b-container",t._l(t.testItems,function(e,n){return s("div",{key:n},[t.testItems.indexOf(e)===t.filter?s("b-card",{staticClass:"my-2"},[s("b-row",[s("b-card",{staticClass:"mx-auto",class:{active:t.hover},attrs:{align:"center"},on:{mouseover:function(e){t.hover=!0},mouseleave:function(e){t.hover=!1}}},[s("h3",[s("span",{domProps:{innerHTML:t._s(e.Spelling)}}),t._v(" "),"sdOnly"==t.settings.sound||"sdOn"==t.settings.sound?s("span",[s("b-icon-soundwave")],1):t._e()])])],1),t._v(" "),s("br"),t._v(" "),s("b-row",[s("b-card",{staticClass:"mx-auto",class:{active2:t.hoverCh},attrs:{align:"center"},on:{mouseover:function(e){t.hoverCh=!0},mouseleave:function(e){t.hoverCh=!1}}},[s("h3",["ch_text_On"===t.settings.display||"ch_lb_On"===t.settings.display?s("span",{domProps:{innerHTML:t._s(e.Chinese)}}):t._e(),t._v(" "),"ch_lb_On"===t.settings.display||"lb_On"===t.settings.display?s("span",[t._v("   ("+t._s(e.Gr)+") ")]):t._e()])])],1),t._v(" "),s("b-row",[s("b-form-group",{staticClass:"mx-auto"},[s("b-form-input",{staticClass:"mt-5",attrs:{onblur:"this.focus()",autofocus:"",autocomplete:"off",size:"lg",id:"type"},on:{keyup:function(s){return!s.type.indexOf("key")&&t._k(s.keyCode,"enter",13,s.key,"Enter")?null:t.recordAnswer(e.English,e.Chinese,t.currentAnswer)}},model:{value:t.currentAnswer,callback:function(e){t.currentAnswer=e},expression:"currentAnswer"}}),t._v(" "),"fbConst"===t.settings.feedback?s("div",[s("b-form-invalid-feedback",{attrs:{state:t.validAnswer}},[t._v("\n              checking...\n            ")]),t._v(" "),s("b-form-valid-feedback",{attrs:{state:t.validAnswer}},[t._v("\n              Looks Good :)\n            ")])],1):t._e(),t._v(" "),"fbComp"===t.settings.feedback?s("div",[s("b-form-invalid-feedback",{attrs:{state:t.validCheck}},[t._v("\n              checking...\n            ")]),t._v(" "),s("b-form-valid-feedback",{attrs:{state:t.validCheck}},[t._v("\n              Looks Good :)\n            ")])],1):t._e()],1)],1)],1):t._e()],1)}),0),t._v(" "),t.showAnswers?s("b-container",[s("b-card",{staticClass:"my-2"},[s("b-table",{attrs:{striped:"",hover:"",items:t.answerData,fields:t.fields}})],1)],1):t._e()],1)},staticRenderFns:[]};var r=s("VU/8")(n,i,!1,function(t){s("dOWX")},"data-v-1bde0391",null);e.default=r.exports},dOWX:function(t,e){}});
//# sourceMappingURL=5.9b8d1b88cc3fe758da9c.js.map