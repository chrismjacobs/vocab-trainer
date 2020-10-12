webpackJsonp([10],{"ZE+q":function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n={name:"TypeMatch",components:{ToolbarMatch:s("LR+Q").default},props:{testType:String,p1:Number,p1name:String,p2:Number,p2name:String,player:String,socket:Object,s3:String},data:function(){return{waiting:0,pageHead:"Typing Match",toolbarShow:!0,showToolbar:!0,showAnswers:!1,showTest:!1,showProgress:!0,timeReset:30,hover:!1,ready:[],answered:0,blocker:!1,loadNew:!1,answerData:[],filter:null,testItems:[],currentAnswerHome:null,currentAnswerAway:null,awayStyle:"bg-alert-light",feedback:null,sound:null,fields:["English","Chinese","Time"],time:null,clock:null,progressValues:{p1:0,p2:0,warn:0},p1score:0,p2score:0,btnIDMarker:null}},methods:{updateSettings:function(t){console.log("update active",t),this.feedback=t.feedback,this.timeReset=t.timeReset},nameCut:function(t){var e=t.split(" ")[0];return e.length>7?e[0]:e},setCountdown:function(){this.time=this.timeReset;var t=this;this.clock=setInterval(function(){0===t.time?t.clock&&t.recordDraw():t.time-=100},100)},start:function(){this.showAnswers=!1,this.filter=0,this.answerData=[],this.showTest=!0,this.setCountdown()},readyCheck:function(){if(console.log("length",this.ready,this.ready.length),2===this.ready.length){this.waiting=2;var t=this;setTimeout(function(){t.start(),t.waiting=0,t.ready=[]},3e3)}},submitAnswer:function(){console.log("sub action"),document.getElementById("homeInput").disabled=!0,this.socket.emit("answerSend",{room:this.p1,opponent:this.opponent,player:this.player,state:this.validCheck})},recordAnswer:function(t){console.log("record action"),this.loadNew=!0;var e=(this.timeReset-this.time)/1e3;clearInterval(this.clock),this.clock=null,this.time=null;var s=t.player,n={English:this.testItems[this.filter].English,Chinese:this.testItems[this.filter].Chinese,_rowVariant:s,Time:e+"s"};this.progressValues[s]+=1,this.answerData.push(n),this.nextQuestion()},recordDraw:function(){console.log("record draw"),this.loadNew=!0,clearInterval(this.clock),this.clock=null,this.time=null;var t={English:this.testItems[this.filter].English,Chinese:this.testItems[this.filter].Chinese,_rowVariant:"warn",Time:"---"};this.progressValues.warn+=1,this.answerData.push(t),this.nextQuestion()},nextQuestion:function(){document.getElementById("homeInput").disabled=!0,document.getElementById("awayInput").type="text";var t=this;setTimeout(function(){t.currentAnswerHome="",t.currentAnswerAway="",document.getElementById("homeInput").disabled=!1,document.getElementById("awayInput").type="password",t.loadNew=!1,t.answered=0,t.filterToggle()},3e3)},filterToggle:function(){this.filter+1<this.testItems.length?(this.filter+=1,this.setCountdown()):(this.filter=null,this.showTest=!1,this.blocker=null,this.checkAnswers())},checkAnswers:function(){this.p1score+=this.progressValues.p1,this.p2score+=this.progressValues.p2;var t={mode:"matchType",winnerStatus:this.p1score===this.p2score?0:this.p1score>=this.p2score&&"p1"===this.player?1:this.p2score>=this.p1score&&"p2"===this.player?1:-1};console.log(t),this.$store.dispatch("updateMatch",t),this.progressValues.p1=0,this.progressValues.p2=0,this.progressValues.warn=0,this.showAnswers=!0},playAudio:function(t){var e=document.getElementById("audio");e.src=t,e.play()},leave:function(){this.$emit("leaveMatch")},validStyle:function(t){var e=this.validCheck,s=this.validAnswer;return"fbComp"!==t||e?"fbComp"===t&&e?"bg-safe-light":"fbConst"!==t||s?"fbConst"===t&&s?"bg-safe-light":"bg-cream":"bg-alert-light":"bg-cream"}},watch:{filter:function(){var t=this.testItems[this.filter];t&&"sdOff"!==this.sound&&this.playAudio(t.sdQue)},currentAnswerHome:function(){this.socket.emit("updateType",{room:this.p1,opponent:this.opponent,current:this.currentAnswerHome,player:this.player,state:this.validStyle("fbConst")})}},computed:{validAnswer:function(){var t=null,e=this.currentAnswerHome;if(!e)return!1;t=e.length;var s=this.testItems[this.filter].English;return e===this.testItems[this.filter].English||e===this.testItems[this.filter].English+" "||(e===s.substr(0,t)||!(t>0)&&void 0)},validCheck:function(){var t=this.testItems[this.filter].English;return this.currentAnswerHome===t||this.currentAnswerHome===t+" "},opponent:function(){return"p1"===this.player?"p2":"p1"}},beforeDestroy:function(){clearInterval(this.clock),this.clock=null},mounted:function(){var t=this;t.socket.on("go",function(e){t.room=e.room,e.testItems.length>0&&(t.testItems=e.testItems,t.timeReset=1e3*e.timeReset),t.ready.includes(e.player)||t.ready.push(e.player),t.readyCheck()}),t.socket.on("updateSignal",function(e){t.player===e.opponent&&(t.currentAnswerAway=e.current,t.awayStyle=e.state)}),t.socket.on("answerComplete",function(e){if(e.state){if(t.blocker===e.English)return console.log("blocked"),!1;t.blocker=e.English,console.log("action 1"),t.recordAnswer(e)}else 0===t.answered?(console.log("action 2"),document.getElementById("awayInput").type="text",t.answered+=1):(console.log("action 3"),t.recordDraw())})}},r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"TypeMatch"},[s("audio",{attrs:{id:"audio"}}),t._v(" "),s("div",{staticClass:"mt-2 bg-grape p-2"},[s("b-row",{attrs:{"align-h":"end"}},[s("b-col",{attrs:{cols:"6",align:"center"}},[s("h2",{staticClass:"text-cream"},[t._v(" Match ")])]),t._v(" "),s("b-col",{attrs:{cols:"3",align:"right"}},[s("button",{staticClass:"buttonDiv bg-warn text-cream",on:{click:function(e){return t.leave()}}},[s("span",{staticClass:"d-none d-md-inline"},[t._v("Exit")]),s("b-icon-backspace-reverse-fill",{staticClass:"text-cream ml-3",staticStyle:{float:"right"},attrs:{"font-scale":"1.5"}})],1)])],1)],1),t._v(" "),t.showProgress?s("div",{staticClass:"bg-second"},[s("div",{staticClass:"bg-third"},[s("b-progress",{staticStyle:{height:"20px"},attrs:{max:1,"show-value":""}},[s("b-progress-bar",{attrs:{value:t.progressValues.p1,variant:"p1"}}),t._v(" "),s("b-progress-bar",{attrs:{value:t.progressValues.warn,variant:"warn-light"}}),t._v(" "),s("b-progress-bar",{attrs:{value:t.progressValues.p2,variant:"p2"}})],1)],1),t._v(" "),s("div",{staticClass:"bg-third p-3 ",staticStyle:{height:"100px"}},[s("b-row",{attrs:{"no-gutters":""}},[s("b-col",{staticClass:"mr-3",attrs:{align:"right"}},[s("b-avatar",{attrs:{src:t.s3+t.p1.toString()+".jpg",size:"65px",badge:t.nameCut(t.p1name),"badge-offset":"-0.6em","badge-variant":"p1"}})],1),t._v(" "),s("b-col",{attrs:{align:"left"}},[s("b-badge",{staticClass:"bg-smoke text-prime badge-lg mb-2",staticStyle:{"font-size":"20px",width:"40px"}},[t._v(t._s(t.p1score))]),t._v(" "),s("br"),t._v(" "),t.ready.includes("p1")?s("b-avatar",{attrs:{icon:"person-check",variant:"safe"}}):t._e()],1),t._v(" "),s("b-col",{staticClass:"mr-3",attrs:{align:"right"}},[s("b-avatar",{attrs:{src:t.s3+t.p2.toString()+".jpg",size:"65px",badge:t.nameCut(t.p2name),"badge-offset":"-0.6em","badge-variant":"p2"}})],1),t._v(" "),s("b-col",{attrs:{align:"left"}},[s("b-badge",{staticClass:"bg-smoke text-p2 badge-lg mb-2",staticStyle:{"font-size":"20px",width:"40px"}},[t._v(t._s(t.p2score))]),t._v(" "),s("br"),t._v(" "),t.ready.includes("p2")?s("b-avatar",{attrs:{icon:"person-check",variant:"safe"}}):t._e()],1)],1)],1),t._v(" "),s("div",{staticStyle:{height:"25px"}},[t.time?s("b-progress",{attrs:{value:t.time,max:t.timeReset,variant:"warn"}}):t._e()],1)]):t._e(),t._v(" "),s("ToolbarMatch",{attrs:{toolbarShow:t.showTest,p1:t.p1,p2:t.p2,p1name:t.p1name,p2name:t.p2name,socket:t.socket,player:t.player,waiting:t.waiting,showAnswers:t.showAnswers,testType:t.testType},on:{waitUpdate:function(e){t.waiting=1},settings:function(e){return t.updateSettings(e)}}}),t._v(" "),t.showTest?s("div",{staticClass:"bg-grey"},t._l(t.testItems,function(e,n){return s("div",{key:n},[t.testItems.indexOf(e)===t.filter?s("div",[s("br"),t._v(" "),s("b-row",{staticClass:"px-5"},[s("button",{staticClass:"questionDiv bg-warn",on:{click:function(s){return t.playAudio(e.sdQue)}}},[s("h3",[s("div",[s("span",{domProps:{innerHTML:t._s(e.Spelling)}})]),t._v(" "),"sdOnly"==t.sound||"sdOn"==t.sound?s("span",[s("b-icon-soundwave")],1):t._e()])])]),t._v(" "),s("b-row",{staticClass:"px-5 mt-3"},[s("button",{staticClass:"answerBtn bg-third",attrs:{align:"center"},on:{click:function(s){return t.playAudio(e.sdAns)}}},[s("h3",[s("span",{domProps:{innerHTML:t._s(e.Chinese)}})])])]),t._v(" "),s("b-row",{staticClass:"mt-4",attrs:{"align-h":"center"}},[s("b-col",{attrs:{cols:"10"}},[s("b-form-group",[s("div",[s("b-form-input",{class:t.awayStyle,staticStyle:{"font-size":"30px",width:"100%","text-align":"center"},attrs:{align:"center",type:"password",disabled:"",id:"awayInput"},model:{value:t.currentAnswerAway,callback:function(e){t.currentAnswerAway=e},expression:"currentAnswerAway"}})],1)])],1)],1),t._v(" "),s("b-row",{staticClass:"mt-4",attrs:{"align-h":"center"}},[s("b-col",{attrs:{cols:"10"}},[s("b-form-group",[s("div",[s("b-form-input",{class:t.validStyle(t.feedback),staticStyle:{"font-size":"30px",width:"100%","text-align":"center"},attrs:{align:"center",onblur:"this.focus()",autofocus:"",autocapitalize:"none",autocomplete:"off",id:"homeInput"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.submitAnswer()}},model:{value:t.currentAnswerHome,callback:function(e){t.currentAnswerHome=e},expression:"currentAnswerHome"}})],1)])],1)],1),t._v(" "),s("b-row",{staticStyle:{height:"800px"}},[s("b-col",[t.loadNew?s("div",{class:"text-center text-primary"},[s("b-spinner",{staticClass:"align-middle"}),t._v(" "),s("strong",[t._v("Loading...")])],1):t._e()])],1)],1):t._e()])}),0):t._e(),t._v(" "),t.showAnswers?s("div",[s("div",{staticClass:"mt-2"},[s("b-table",{attrs:{striped:"",hover:"",items:t.answerData,fields:t.fields}})],1)]):t._e()],1)},staticRenderFns:[]};var i=s("VU/8")(n,r,!1,function(t){s("z1IS")},"data-v-0c618d6b",null);e.default=i.exports},z1IS:function(t,e){}});
//# sourceMappingURL=10.a4190c6a3ac5ca7738e7.js.map