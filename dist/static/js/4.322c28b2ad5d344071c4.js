webpackJsonp([4],{ZE9d:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={name:"TypeTest",components:{Toolbar:s("djO7").default},data:function(){return{pageHead:"Typing Test",testType:"typeTest",title:"Typing Test",toolbarShow:!0,time:6e4,clock:null,mistakes:0,hover:!1,hoverCh:!1,hoverStyle:"bg-info",hoverStyleCh:"bg-info",showAnswers:!1,showTest:!1,filter:null,answerData:[],currentAnswer:"",testItems:[],settings:{},fields:["Chinese","English","Answer","Time"],startTime:null,endTime:null,qCount:0,sCount:0}},methods:{recordAnswer:function(t,e,s){this.qCount+=1;var i=void 0,n=void 0;s===t||s===t+" "?(i=1,this.sCount+=1,n="safe"):(i=-1,n="alert");var r=this.mistakes/t.length;r>.3&&(i=-1);var a=(6e4-this.time)/1e3,o={English:t,Chinese:e,Answer:s,Score:i,Time:a>98?"> 60s":a+"s",Error:r,_rowVariant:n};this.answerData.push(o),this.filter+1<this.testItems.length?(this.filter+=1,this.mistakes=0,this.currentAnswer=""):this.cancel()},start:function(t){this.sCount=0,this.qCount=0,this.startTime=new Date,this.showAnswers=!1,this.filter=0,this.answerData=[],this.showTest=!0,this.$store.dispatch("testActive",!0),t&&(this.testItems=t.test,this.settings=JSON.parse(t.settings))},cancel:function(){this.filter=null,this.mistakes=0,this.showTest=!1,this.endTime=new Date,this.showModal(),this.currentAnswer="",this.checkAnswers()},checkAnswers:function(){this.showAnswers=!0,this.$store.dispatch("testActive",!1),this.$store.dispatch("updateRecord",{mode:"typeTest",answerData:this.answerData,settingsData:this.settings})},showModal:function(){this.$refs.complete.show()},hideModal:function(t){"complete"===t?this.$refs.complete.hide():(this.$refs.fail.hide(),this.msg=null,this.waiting=!0)},timeSpan:function(){var t=(this.endTime-this.startTime)/1e3,e=0,s=0;return t>59?(e=Math.floor(t/60),s=Math.floor(t-60*e),e.toString()+" minutes "+s.toString()+" seconds"):Math.floor(t).toString()+" seconds"},playAudio:function(t){var e=document.getElementById("audio");e.src=t,e.play()},leave:function(){this.answered=0,this.filter=null,this.showTest=!1,this.$emit("leaveMatch")},setCountdown:function(){this.time=6e4;var t=this;this.clock=setInterval(function(){t.time-=100},100)},validStyle:function(){return"fbComp"!==this.settings.feedback||this.validCheck?"fbComp"===this.settings.feedback&&this.validCheck?"bg-safe-light text-prime":"fbConst"!==this.settings.feedback||this.validAnswer?"fbConst"===this.settings.feedback&&this.validAnswer?"bg-third text-prime":"bg-cream":"bg-alert-light text-prime":"bg-cream"}},computed:{inputStyle:function(){return{"font-size":"30px",width:this.answerLength+"0%","text-align":"center","max-width":"100%"}},answerLength:function(){return this.testItems[this.filter].English.length},validAnswer:function(){var t=null;if(""===this.currentAnswer)return!1;t=this.currentAnswer.length;var e=this.testItems[this.filter].English;if(this.currentAnswer===this.testItems[this.filter].English)return!0;if(this.currentAnswer===e.substr(0,t))return!0;if(t>0){return this.mistakes+=1,!1}},validCheck:function(){var t=this.testItems[this.filter].English;return this.currentAnswer===t}},watch:{filter:function(){clearInterval(this.clock),this.setCountdown();var t=this.testItems[this.filter];t&&"sdEn"===this.settings.sound?this.playAudio(t.sdEn):t&&"sdCh"===this.settings.sound&&this.playAudio(t.sdCh)}},created:function(){this.$store.getters.isAuthenticated||this.$router.push("login")}},n={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"TypeTest"},[s("audio",{attrs:{id:"audio",autoplay:""}}),t._v(" "),s("Toolbar",{attrs:{toolbarShow:t.showTest,showAnswers:t.showAnswers,testType:t.testType,title:t.title},on:{newTest:function(e){return t.start(e)},retry:function(e){return t.start()}}}),t._v(" "),t.showTest?s("b-row",{attrs:{"no-gutters":""}},[s("b-col",{attrs:{cols:"8"}},[s("b-progress",{staticStyle:{height:"30px"},attrs:{value:t.filter,max:t.testItems.length,animated:"",variant:"safe"}})],1),t._v(" "),s("b-col",{attrs:{cols:"3"}},[s("b-progress",{staticStyle:{height:"30px"},attrs:{value:t.time,max:"60000",animated:"",variant:"alert"}})],1),t._v(" "),s("b-col",{attrs:{cols:"1"}},[s("button",{staticClass:"buttonDiv bg-alert",staticStyle:{height:"30px",width:"100%"},on:{click:function(e){return t.cancel()}}},[s("b-icon",{staticClass:"pb-1 pr-1",attrs:{icon:"x-circle",variant:"cream","font-scale":"1.5"}})],1)])],1):t._e(),t._v(" "),t.showTest?s("div",{staticClass:"bg-grey"},t._l(t.testItems,function(e,i){return s("div",{key:i},[t.testItems.indexOf(e)===t.filter?s("div",[s("br"),t._v(" "),s("b-row",{staticClass:"px-5"},[s("button",{staticClass:"questionDiv bg-warn",class:t.hoverStyle,attrs:{align:"center"},on:{click:function(s){return t.playAudio(e.sdEn)}}},[s("h3",[s("div",[s("span",{domProps:{innerHTML:t._s(e.Spelling)}})]),t._v(" "),"sdOnly"==t.settings.sound||"sdOn"==t.settings.sound?s("span",[s("b-icon-soundwave")],1):t._e()])])]),t._v(" "),"all_Off"!==t.settings.display?s("b-row",{staticClass:"px-5 mt-3"},[s("button",{staticClass:"answerBtn bg-third",attrs:{align:"center"},on:{click:function(s){return t.playAudio(e.sdCh)}}},[s("h3",["text_On"===t.settings.display?s("span",{domProps:{innerHTML:t._s(e.Chinese)}}):t._e(),t._v(" "),"label_On"===t.settings.display?s("span",[t._v(" "+t._s(e.Gr))]):t._e()])])]):t._e(),t._v(" "),s("b-row",{staticClass:"mt-4",attrs:{"align-h":"center"}},[s("b-col",{attrs:{cols:"10"}},[s("b-form-group",[s("div",{attrs:{align:"center"}},[s("b-form-input",{class:t.validStyle(),style:t.inputStyle,attrs:{align:"center",onblur:"this.focus()",autofocus:"",autocapitalize:"none",autocomplete:"off",id:"type"},nativeOn:{keyup:function(s){return!s.type.indexOf("key")&&t._k(s.keyCode,"enter",13,s.key,"Enter")?null:t.recordAnswer(e.English,e.Chinese,t.currentAnswer)}},model:{value:t.currentAnswer,callback:function(e){t.currentAnswer=e},expression:"currentAnswer"}}),t._v(" "),s("br"),t._v(" "),s("h6",[t._v("\n                            ("+t._s(t.currentAnswer.length)+"/"+t._s(t.answerLength)+")\n                          ")])],1),t._v(" "),"fbConst"===t.settings.feedback?s("div",{attrs:{align:"center"}},[s("b-form-invalid-feedback",{attrs:{state:t.validAnswer}},[t._v("\n                            checking...\n                          ")]),t._v(" "),s("b-form-valid-feedback",{attrs:{state:t.validAnswer}},[t._v("\n                            Looks Good :)\n                          ")])],1):t._e(),t._v(" "),"fbComp"===t.settings.feedback?s("div",{attrs:{align:"center"}},[s("b-form-invalid-feedback",{attrs:{state:t.validCheck}},[t._v("\n                            checking...\n                          ")]),t._v(" "),s("b-form-valid-feedback",{attrs:{state:t.validCheck}},[t._v("\n                            Looks Good :)\n                          ")])],1):t._e()])],1)],1)],1):t._e()])}),0):t._e(),t._v(" "),t.showAnswers?s("div",{staticClass:"bg-smoke"},[s("b-table",{attrs:{striped:"",hover:"",items:t.answerData,fields:t.fields}})],1):t._e(),t._v(" "),s("b-modal",{ref:"complete",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Test Complete"}},[s("div",{staticClass:"d-block"},[s("h3",[t._v(" "+t._s(t.sCount)+"/"+t._s(t.qCount)+" ")]),t._v(" "),s("h3",[t._v(" "+t._s(t.timeSpan())+"  ")])]),t._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-prime text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("complete")}}},[t._v("Close")])])],1)},staticRenderFns:[]};var r=s("VU/8")(i,n,!1,function(t){s("yFUy")},"data-v-4845c2e2",null);e.default=r.exports},yFUy:function(t,e){}});
//# sourceMappingURL=4.322c28b2ad5d344071c4.js.map