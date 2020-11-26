webpackJsonp([3,11],{"+8Ct":function(e,t){},Wj6p:function(e,t){},dHcL:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("XdxJ"),i=n("ZE+q"),a=n("OLUw"),r=n("gyMJ"),l={name:"Match",props:{s3:String},components:{TransMatch:s.default,TypeMatch:i.default},data:function(){return{fields:[{key:"id"}],selected:"true",waiter:[],challenger:[],pageHead:"Match Area",friends:null,friendAdder:!1,friendDeleter:!1,friend:{username:null,userID:null},username:null,userID:null,socket:null,testType:null,p1:null,p2:null,p1name:null,p2name:null,player:null,quitter:null,message:null,waiting:!0,msg:null,gameSelect:"TransEng",gameTypes:[{value:"TransEng",text:"En -> Ch"},{value:"TransCh",text:"Ch -> En"},{value:"TypeMatch",text:"Spelling"}],gameNames:{TransEng:"En -> Ch",TransCh:"Ch -> En",TypeMatch:"Spelling"}}},methods:{filterOnline:function(e){if(1===e.status||2===e.status)return!0},filterOffline:function(e){if(0===e.status)return!0},filterChallenge:function(e){if(3===e.status)return!0},filterWaiting:function(e){if(4===e.status)return!0},showModal:function(){this.$refs.success.show()},showAlert:function(){this.$refs.fail.show()},showQuit:function(){this.$refs.quit.show()},hideModal:function(e){"success"===e?(this.$refs.success.hide(),this.waiting=!0):"success"===e?(this.$refs.fail.hide(),this.waiting=!0):(this.$refs.quit.hide(),this.player===this.quitter&&this.$emit("resetMatch"))},startSocket:function(){console.log("STARTSOCKET"),this.socket=Object(a.a)(),this.socket.emit("checkOnline",{userID:this.userID})},closeSocket:function(){this.socket.close()},leaveMatch:function(){this.socket.emit("resetEmit",{player:this.player}),console.log("leave activated")},challengeSend:function(e,t){var n={userID:this.userID,username:this.username,targetID:e,mode:t,action:"send"};console.log("send challenge",n),this.socket.emit("challenge",n),this.friends.find(function(t){return t.id===e}).status=3},challengeRetract:function(e,t){var n={userID:this.userID,username:this.username,targetID:e,mode:"mode",action:"retract"};console.log("retract challenge",n),this.socket.emit("challenge",n),this.friends.find(function(t){return t.id===e}).status=1},declineChallenge:function(e,t){var n={userID:this.userID,username:this.username,targetID:e,mode:"mode",action:"decline"};console.log("decline challenge",n),this.socket.emit("challenge",n),this.friends.find(function(t){return t.id===e}).status=1},acceptChallenge:function(e,t){var n={userID:this.userID,username:this.username,targetID:e,mode:t,action:"accept"};console.log(" accept challenge",n),this.socket.emit("challenge",n)},addFriend:function(){this.waiting=!1;var e=this,t=this.friend.username,n=this.friend.userID;return Object(r.d)({friendName:t,friendID:n,userID:e.userID}).then(function(s){s.data.check&&s.data.friendID!==e.userID?(console.log("response",s.data),e.friends=JSON.parse(s.data.friends),e.$store.dispatch("addFriend",{friendData:JSON.parse(s.data.friends)}),e.msg="Friend added:"+t+" #"+n,e.$emit("resetMatch"),e.showModal()):(e.msg="Cannot add friend. Please check username and user ID",e.showAlert())}).catch(function(e){console.log("Error Registering: ",e)})},deleteFriend:function(e){this.waiting=!1;var t=this;return Object(r.e)({friendID:e,userID:t.userID}).then(function(e){e.data.check?(console.log("response",e.data),t.friends=JSON.parse(e.data.friends),t.$store.dispatch("addFriend",{friendData:JSON.parse(e.data.friends)}),t.msg="Friend Deleted",t.showModal()):(t.msg="Cannot delete friend right now",t.showAlert())}).catch(function(e){console.log("Error Deleting: ",e)})}},created:function(){if(console.log(this.s3),!this.$store.getters.isAuthenticated)return this.$router.push("login"),!1;var e=this;window.onbeforeunload=function(){e.isAuthenticated&&!1===e.$store.state.updateStatus&&e.closeSocket()}},beforeDestroy:function(){console.log("beforeDestroyMatch"),this.closeSocket()},mounted:function(){this.userID=this.$store.state.userProfile.userID,this.username=this.$store.state.userProfile.username,this.startSocket();var e=this;e.socket.on("offlineUsers",function(t){console.log("offlineUsers",t),e.friends.find(function(e){return e.id===t.userID}).status=0}),e.socket.on("onlineUsers",function(t){(console.log("onlineUsers",t),t.friends)?e.friends=t.friends:e.friends.find(function(e){return e.id===t.userID}).status=1}),e.socket.on("busy",function(t){console.log("busy",t);var n=e.friends.find(function(e){return e.id===t.userID}),s=e.friends.find(function(e){return e.id===t.targetID});"send"===t.action?(n.status=2,s.status=2):"decline"===t.action?n.status=1:(n.status=1,s.status=1)}),e.socket.on("challengeMatch",function(t){console.log("challengeMatch",t);var n=e.friends.find(function(e){return e.id===t.userID});"decline"===t.action?n.status=1:"retract"===t.action?n.status=1:(n.status=4,n.mode=t.mode)}),e.socket.on("start",function(t){console.log("start",t),e.$store.dispatch("testActive",!0),e.testType=t.mode;var n=e.friends.find(function(e){return e.id===t.p1});n?(e.player="p2",e.p1=t.p1,e.p1name=n.name):void 0===n?(e.player="p1",e.p1=t.p1,e.p1name=e.username):console.log("PLAYER ERROR"),e.p2=t.p2,e.p2name=t.p2name,console.log("player",e.player)}),e.socket.on("reset",function(t){e.$store.dispatch("testActive",!1),e.testType&&(console.log("reset",t),e.quitter=t.player,e.msg="Game Ended, "+t.opponent+" has left the game",e.showQuit())})}},o={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"matchArea"},[e.testType&&"r"===e.testType[1]?n("TransMatch",{attrs:{testType:e.testType,quitter:e.quitter,p1:e.p1,p2:e.p2,p1name:e.p1name,p2name:e.p2name,player:e.player,socket:e.socket,s3:e.s3},on:{leave:function(t){return e.leaveMatch()}}}):e._e(),e._v(" "),e.testType&&"y"===e.testType[1]?n("TypeMatch",{attrs:{testType:e.testType,quitter:e.quitter,p1:e.p1,p2:e.p2,p1name:e.p1name,p2name:e.p2name,player:e.player,socket:e.socket,s3:e.s3},on:{leave:function(t){return e.leaveMatch()}}}):e._e(),e._v(" "),e.waiting&&null!==e.friends?[null===e.testType?n("div",[e._m(0),e._v(" "),n("div",{staticClass:"bg-third text-third p-2"},[n("b-row",{attrs:{align:"left"}},[n("b-col",{attrs:{cols:"10"}},[n("div",{staticStyle:{color:"red !important"}},[n("b-form-radio-group",{attrs:{id:"btn-radios-2",options:e.gameTypes,buttons:"","button-variant":"p1",name:"radio-btn-outline"},model:{value:e.gameSelect,callback:function(t){e.gameSelect=t},expression:"gameSelect"}})],1)]),e._v(" "),n("b-col",{staticStyle:{display:"none"},attrs:{align:"right"}},[n("button",{staticClass:"buttonDiv bg-warn mt-2",on:{click:function(t){e.friendAdder=!e.friendAdder}}},[e._v(" Add "),n("b-icon",{attrs:{icon:"person"}})],1),e._v(" "),n("button",{staticClass:"buttonDiv bg-alert mt-2",on:{click:function(t){e.friendDeleter=!e.friendDeleter}}},[e._v(" Del "),n("b-icon",{attrs:{icon:"x-square-fill"}})],1)])],1)],1),e._v(" "),e.friendAdder?n("div",{staticClass:"bg-prime p-2"},[n("b-row",{attrs:{no:"",gutters:""}},[n("b-col",[n("b-form",{attrs:{inline:""}},[n("b-input",{staticClass:"mb-2 mr-sm-2 mb-sm-0",attrs:{id:"inline-form-input-name",placeholder:"Friend name"},model:{value:e.friend.username,callback:function(t){e.$set(e.friend,"username",t)},expression:"friend.username"}}),e._v(" "),n("b-input-group",{staticClass:"mb-2 mr-sm-2 mb-sm-0",attrs:{prepend:"#"}},[n("b-input",{attrs:{id:"inline-form-input-username",placeholder:"user ID"},model:{value:e.friend.userID,callback:function(t){e.$set(e.friend,"userID",t)},expression:"friend.userID"}})],1)],1)],1),e._v(" "),n("b-col",[n("button",{staticClass:"buttonDiv bg-third",staticStyle:{width:"100px"},on:{click:function(t){return e.addFriend()}}},[e._v("Add")])])],1)],1):e._e(),e._v(" "),n("div",{staticClass:"bg-smoke text-prime p-2"},[n("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterWaiting},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[n("b-row",[n("b-col",[n("b-avatar",{attrs:{src:e.s3+t.value+"/avatar.jpg",size:"2rem"}}),e._v(" "),n("div",{staticClass:"nameTag bg-p1 text-prime",attrs:{align:"center"},on:{click:function(n){return e.acceptChallenge(t.item.id,t.item.mode)}}},[e._v(e._s(t.item.name)+" "),n("b-icon",{attrs:{icon:"circle-fill",animation:"throb"}})],1)],1),e._v(" "),n("b-col",{staticClass:"pr-3",attrs:{cols:"3",align:"right"}},[n("button",{staticClass:"buttonDiv bg-alert mx-1",staticStyle:{width:"40px"},on:{click:function(n){return e.declineChallenge(t.item.id)}}},[n("b-icon",{attrs:{icon:"x-square-fill"}})],1)])],1)]}}],null,!1,669141204),model:{value:e.waiter,callback:function(t){e.waiter=t},expression:"waiter"}}),e._v(" "),n("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterChallenge},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[n("b-row",[n("b-col",[n("b-avatar",{attrs:{src:e.s3+t.value+"/avatar.jpg",size:"2rem"}}),e._v(" "),n("div",{staticClass:"nameTag bg-p2 text-cream",attrs:{align:"center"}},[e._v(e._s(t.item.name)+" "),n("b-icon",{attrs:{icon:"circle-fill",animation:"throb"}})],1)],1),e._v(" "),n("b-col",{staticClass:"pr-3",attrs:{cols:"3",align:"right"}},[n("button",{staticClass:"buttonDiv bg-alert mx-1",staticStyle:{width:"40px"},on:{click:function(n){return e.challengeRetract(t.item.id)}}},[n("b-icon",{attrs:{icon:"x-square-fill"}})],1)])],1)]}}],null,!1,298218501),model:{value:e.challenger,callback:function(t){e.challenger=t},expression:"challenger"}}),e._v(" "),0===e.waiter.length&&0===e.challenger.length?n("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterOnline},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[1===t.item.status?n("div",[n("b-avatar",{attrs:{src:e.s3+t.value+"/avatar.jpg",size:"2rem"}}),e._v(" "),n("div",{staticClass:"nameTag bg-safe text-cream",attrs:{align:"center"}},[e._v(e._s(t.item.name))]),e.gameSelect?n("button",{staticClass:"buttonDiv bg-prime mx-3",staticStyle:{width:"15%"},on:{click:function(n){return e.challengeSend(t.value,e.gameSelect)}}},[n("b-icon",{staticClass:"text-p1",attrs:{icon:"box-arrow-in-right"}})],1):e._e(),e._v(" "),e.friendDeleter?n("button",{staticClass:"buttonDiv bg-alert mx-3",staticStyle:{width:"100px"},on:{click:function(t){return e.deleteFriend()}}},[n("b-icon",{attrs:{icon:"x-square-fill"}})],1):e._e()],1):n("div",[n("b-avatar",{attrs:{src:e.s3+t.value+"/avatar.jpg",size:"2rem"}}),e._v(" "),n("div",{staticClass:"nameTag bg-warn text-cream",attrs:{align:"center"}},[e._v(e._s(t.item.name))])],1)]}}],null,!1,782018501)}):e._e(),e._v(" "),0===e.waiter.length&&0===e.challenger.length?n("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterOffline},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[n("b-avatar",{attrs:{src:e.s3+t.value+"/avatar.jpg",size:"2rem"}}),e._v(" "),n("div",{staticClass:"nameTag bg-alert text-cream",attrs:{align:"center"}},[e._v(e._s(t.item.name))])]}}],null,!1,2583985919)}):e._e()],1)]):e._e()]:[n("div",{staticClass:"mt-5",attrs:{align:"center"}},[n("h4",{staticClass:"text-prime"},[e._v(" Updating.... ")]),e._v(" "),n("b-icon",{attrs:{icon:"person",animation:"throb",variant:"prime","font-scale":"6"}})],1)],e._v(" "),n("b-modal",{ref:"success",attrs:{align:"center","hide-footer":"",title:"Complete","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[n("div",{staticClass:"d-block"},[n("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-safe text-cream",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("success")}}},[e._v("Close")])]),e._v(" "),n("b-modal",{ref:"fail",attrs:{align:"center","hide-footer":"",title:"Problem Found","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[n("div",{staticClass:"d-block"},[n("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("fail")}}},[e._v("Close")])]),e._v(" "),n("b-modal",{ref:"quit",attrs:{align:"center","hide-footer":"",title:"Game Over","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[n("div",{staticClass:"d-block"},[n("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-third text-prime",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("quit")}}},[e._v("Close")])])],2)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"mt-2 p-2 bg-grape head"},[t("h2",{staticClass:"text-cream",attrs:{align:"center"}},[this._v("\n              Match Zone\n            ")])])}]};var c=n("VU/8")(l,o,!1,function(e){n("Wj6p")},"data-v-1294c673",null);t.default=c.exports},taOX:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n("dHcL"),i={name:"MatchBase",props:{s3:String},components:{Match:s.default},data:function(){return{marker:!0,startTimer:null}},methods:{reset:function(){console.log("RESET ACTIVE"),this.marker=!1;var e=this;e.startTimer=setTimeout(function(){e.marker=!0},2e3)}},beforeDestroy:function(){this.startTimer&&(clearTimeout(this.startTimer),this.startTimer=null)}},a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"matchBase"},[e.marker?n("Match",{attrs:{s3:e.s3},on:{resetMatch:function(t){return e.reset()}}}):n("div",{attrs:{align:"center"}},[n("h4",{staticClass:"text-prime"},[e._v(" Reloading ")]),e._v(" "),n("b-icon",{attrs:{icon:"three-dots",animation:"cylon",variant:"prime","font-scale":"6"}})],1)],1)},staticRenderFns:[]};var r=n("VU/8")(i,a,!1,function(e){n("+8Ct")},"data-v-9d43b2ee",null);t.default=r.exports}});
//# sourceMappingURL=3.d94c745af2e948ac8cf9.js.map