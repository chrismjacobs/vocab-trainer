webpackJsonp([9],{XdxJ:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={name:"TransMatch",components:{ToolbarMatch:s("LR+Q").default},props:{testType:String,p1:Number,p1name:String,p2:Number,p2name:String,player:String,socket:Object,s3:String},data:function(){return{waiting:0,pageHead:"Translation Match",toolbarShow:!0,showToolbar:!0,showAnswers:!1,showTest:!1,showProgress:!0,timeReset:null,hover:!1,ready:[],answered:0,answerData:[],filter:null,testItems:[],settings:{},fields:["Question","Answer"],time:null,clock:null,progressValues:{p1:0,p2:0,warn:0},p1score:0,p2score:0,btnIDMarker:null}},methods:{nameCut:function(t){var e=t.split(" ")[0];return e.length>7?e[0]:e},setCountdown:function(){this.time=this.timeReset;var t=this;this.clock=setInterval(function(){0===t.time?(clearInterval(t.clock),t.recordDisable()):t.time-=100},100)},start:function(){this.showAnswers=!1,this.filter=0,this.answerData=[],this.showTest=!0},readyCheck:function(){if(console.log("length",this.ready,this.ready.length),2===this.ready.length){this.waiting=2;var t=this;setTimeout(function(){t.start(),t.$store.dispatch("testActive"),t.waiting=0,t.ready=[]},3e3)}},recordAnswer:function(t,e,s){var a=t+s,r=s===e;console.log("RESULT",r),this.socket.emit("answer",{room:this.p1,name:t,answer:e,btnID:a,player:this.player,state:r})},recordDisable:function(){console.log("DISABLE RESULT"),this.socket.emit("answer",{room:this.p1,name:null,answer:null,btnID:null,player:this.player,state:!1})},disableAll:function(){var t=this,e=this.testItems[this.filter].Question,s=this.testItems[this.filter].Answer,a=document.getElementsByName(e);console.log(a);for(var r=0;r<a.length;r++)a[r].disabled=!0;setTimeout(function(){t.answered=0,t.enterResult(e,s,null,!1),t.filterToggle()},2e3)},disable:function(t,e,s,a,r){var i="bg-"+s+"-light",n=document.getElementById(e);if(n){a?n.classList.add("text-safe"):n.classList.add("text-alert"),n.classList.add(i),n.disabled=!0;var o=document.getElementsByName(t);if(console.log(o),s===this.player)for(var l=0;l<o.length;l++)o[l].disabled=!0;else if(a)for(var c=0;c<o.length;c++)o[c].disabled=!0}else{t=this.testItems[this.filter].Question,r=this.testItems[this.filter].Answer;for(var h=document.getElementsByName(t),u=0;u<h.length;u++)h[u].disabled=!0}console.log(a,this.answered),a||1===this.answered?(this.answered=1,this.nextQuestion(t,r,s,a)):0===this.answered?(this.answered=1,this.setCountdown()):console.log("LOGIC ERROR")},nextQuestion:function(t,e,s,a){clearInterval(this.clock),this.answered=2,this.time=null;var r=this;setTimeout(function(){r.answered=0,r.enterResult(t,e,s,a),r.filterToggle()},2e3)},enterResult:function(t,e,s,a){console.log(a);var r="warn";a&&(r=s);var i={Question:t,Answer:e,_rowVariant:r,Score:0};this.progressValues[r]+=1,console.log(r,this.progressValues),this.answerData.push(i)},filterToggle:function(){this.filter+1<this.testItems.length?(console.log(this.filter,this.testItems.length),this.filter+=1):(console.log("filterMax"),this.$store.dispatch("testActive"),this.filter=null,this.showTest=!1,this.checkAnswers())},checkAnswers:function(){this.p1score+=this.progressValues.p1,this.p2score+=this.progressValues.p2;var t=void 0;t=this.p1score===this.p2score?0:this.p1score>=this.p2score&&"p1"===this.player?1:this.p2score>=this.p1score&&"p2"===this.player?1:-1,this.$store.dispatch("updateMatch",{mode:"matchTrans",winnerStatus:t}),this.progressValues.p1=0,this.progressValues.p2=0,this.progressValues.warn=0,this.showAnswers=!0},playAudio:function(t){console.log("PLAY",t);var e=document.getElementById("audio");e.src=t,e.play()},leave:function(){this.$emit("leaveMatch")}},watch:{filter:function(){var t=this.testItems[this.filter];t&&"sdOff"!==this.sound&&this.playAudio(t.sdQue)},hover:function(){if(!0===this.hover){console.log("hover_active");var t=this.testItems[this.filter];this.playAudio(t.sdQue)}}},computed:{isAuthenticated:function(){return this.$store.getters.isAuthenticated}},beforeDestroy:function(){console.log("beforeDestroyTransMatch")},mounted:function(){var t=this;t.socket.on("go",function(e){console.log("roomReady",e,e.testItems.length),t.room=e.room,e.testItems.length>0&&(t.testItems=e.testItems,t.timeReset=1e3*e.timeReset),t.ready.includes(e.player)||(t.ready.push(e.player),console.log(e.player)),t.readyCheck()}),t.socket.on("answer",function(e){e.btnID===t.btnIDMarker?console.log("duplicate answer"):(t.btnIDMarker=e.btnID,t.disable(e.name,e.btnID,e.player,e.state,e.answer))})}},r={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"TransEng"},[s("audio",{attrs:{id:"audio"}}),t._v(" "),s("div",{staticClass:"mt-2 bg-second p-2"},[s("b-row",{attrs:{"align-h":"end"}},[s("b-col",{attrs:{cols:"6",align:"center"}},[s("h2",{staticClass:"text-cream"},[t._v(" Match ")])]),t._v(" "),s("b-col",{attrs:{cols:"3",align:"right"}},[s("button",{staticClass:"buttonDiv bg-warn text-cream",on:{click:function(e){return t.leave()}}},[t._v(" Exit "),s("b-icon-backspace-reverse-fill",{staticClass:"text-cream ml-3",staticStyle:{float:"right"},attrs:{"font-scale":"1.5"}})],1)])],1)],1),t._v(" "),t.showProgress?s("div",{staticClass:"bg-second p-3"},[s("div",{staticClass:"mt-2 bg-third p-2",staticStyle:{height:"100px"}},[s("b-row",{attrs:{"no-gutters":""}},[s("b-col",{staticClass:"mr-3",attrs:{align:"right"}},[s("b-avatar",{attrs:{src:t.s3+t.p1.toString()+".jpg",size:"65px",badge:t.nameCut(t.p1name),"badge-offset":"-0.6em","badge-variant":"p1"}})],1),t._v(" "),s("b-col",{attrs:{align:"left"}},[s("b-badge",{staticClass:"bg-smoke text-prime badge-lg mb-2",staticStyle:{"font-size":"20px",width:"40px"}},[t._v(t._s(t.p1score))]),t._v(" "),s("br"),t._v(" "),t.ready.includes("p1")?s("b-avatar",{attrs:{icon:"person-check",variant:"safe"}}):t._e()],1),t._v(" "),s("b-col",{staticClass:"mr-3",attrs:{align:"right"}},[s("b-avatar",{attrs:{src:t.s3+t.p2.toString()+".jpg",size:"65px",badge:t.nameCut(t.p2name),"badge-offset":"-0.6em","badge-variant":"p2"}})],1),t._v(" "),s("b-col",{attrs:{align:"left"}},[s("b-badge",{staticClass:"bg-smoke text-p2 badge-lg mb-2",staticStyle:{"font-size":"20px",width:"40px"}},[t._v(t._s(t.p2score))]),t._v(" "),s("br"),t._v(" "),t.ready.includes("p2")?s("b-avatar",{attrs:{icon:"person-check",variant:"safe"}}):t._e()],1)],1)],1),t._v(" "),s("div",[s("b-progress",{staticClass:"mt-2",staticStyle:{height:"30px"},attrs:{max:1,"show-value":""}},[s("b-progress-bar",{attrs:{value:t.progressValues.p1,variant:"p1"}}),t._v(" "),s("b-progress-bar",{attrs:{value:t.progressValues.warn,variant:"warn-light"}}),t._v(" "),s("b-progress-bar",{attrs:{value:t.progressValues.p2,variant:"p2"}})],1),t._v(" "),s("br"),t._v(" "),s("div",{staticStyle:{height:"30px"}},[t.time?s("b-progress",{attrs:{value:t.time,max:t.timeReset,animated:"",variant:"warn"}}):t._e()],1)],1)]):t._e(),t._v(" "),s("ToolbarMatch",{attrs:{toolbarShow:t.showTest,p1:t.p1,p2:t.p2,p1name:t.p1name,p2name:t.p2name,socket:t.socket,player:t.player,waiting:t.waiting,showAnswers:t.showAnswers,testType:t.testType},on:{waitUpdate:function(e){t.waiting=1}}}),t._v(" "),t.showTest?s("div",t._l(t.testItems,function(e,a){return s("div",{key:a},[t.testItems.indexOf(e)===t.filter?s("div",{staticClass:"bg-third p-3",class:{active:"active1"},attrs:{align:"center"},on:{mouseover:function(e){t.hover=!0},mouseleave:function(e){t.hover=!1}}},[s("h3",["sdEx"!==t.settings.sound||1==t.hover?s("span",[t._v(" "+t._s(e.Question)+" ")]):t._e(),t._v(" "),"sdEx"==t.settings.sound||"sdOn"==t.settings.sound?s("span",[s("b-icon-soundwave")],1):t._e()])]):t._e(),t._v(" "),t.testItems.indexOf(e)===t.filter?s("div",t._l(e.Choices,function(a,r){return s("div",{key:r},[s("button",{staticClass:"answerBtn bg-grey",attrs:{name:e.Question,id:e.Question+a.Answer,block:""},on:{click:function(s){return t.recordAnswer(e.Question,e.Answer,a.Answer)}}},[t._v("\n              "+t._s(a.Answer)+"\n            ")]),t._v(" "),s("br"),t._v(" "),s("br")])}),0):t._e()])}),0):t._e(),t._v(" "),t.showAnswers?s("div",[s("div",{staticClass:"mt-2"},[s("b-table",{attrs:{striped:"",hover:"",items:t.answerData,fields:t.fields}})],1)]):t._e()],1)},staticRenderFns:[]};var i=s("VU/8")(a,r,!1,function(t){s("aBjO")},"data-v-45f1ba93",null);e.default=i.exports},aBjO:function(t,e){}});
//# sourceMappingURL=9.dcc8a2d697ed952ac97f.js.map