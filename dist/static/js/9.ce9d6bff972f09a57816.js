webpackJsonp([9],{K47E:function(e,t){},dHcL:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("fZjL"),a=s.n(n),i=s("Dd8w"),r=s.n(i),l=s("XdxJ"),o=s("ZE+q"),c=s("OLUw"),u=s("gyMJ"),d={name:"Match",props:{s3:String,friends:Object},components:{TransMatch:l.default,TypeMatch:o.default},data:function(){return{fields:[{key:"id"}],selected:"true",waiter:[],challenger:[],pageHead:"Match Area",friendAdder:!1,friendDeleter:!1,friend:{username:null,userID:null},username:null,userID:null,socket:null,testType:null,p1:null,p2:null,p1name:null,p2name:null,player:null,gameOver:!1,message:null,waiting:!0,msg:null,challengeMode:null,gameSelect:"TransEng",gameTypes:[{value:"TransEng",text:"En > Ch"},{value:"TransCh",text:"Ch > En"},{value:"TypeMatch",text:"Spelling"}],gameColors:{TransEng:"info",TransCh:"warn",TypeMatch:"safe"},classColors:{TransEng:"buttonDiv bg-info",TransCh:"butotnDiv bg-warn",TypeMatch:"buttonDiv bg-safe"}}},methods:{filterOnline:function(e){if(1===e.status||2===e.status)return!0},filterOffline:function(e){if(0===e.status)return!0},filterChallenge:function(e){if(3===e.status)return!0},filterWaiting:function(e){if(4===e.status)return!0},showModal:function(){this.$refs.success.show()},showAlert:function(){this.$refs.fail.show()},showQuit:function(){this.$refs.quit.show()},hideModal:function(e){"success"===e?(this.$refs.success.hide(),this.waiting=!0):"success"===e?(this.$refs.fail.hide(),this.waiting=!0):"cancel"===e?this.$refs.quit.hide():"quit"===e&&this.gameOver?(this.$refs.quit.hide(),this.$emit("resetMatch",{friends:this.friends}),this.closeSocket()):"quit"===e&&(console.log("FRIENDS",this.friends),this.$refs.quit.hide(),this.$emit("resetMatch",{friends:this.friends}),this.socket.emit("resetEmit",{player:this.username}))},getName:function(e){var t=e.split(" ");return t[1]?t[0]+" "+t[1][0]:(console.log(t[0]),e)},startSocket:function(){console.log("STARTSOCKET"),this.socket=Object(c.a)(),this.socket.emit("checkOnline",{userID:this.userID})},closeSocket:function(){this.socket.close()},leaveMatch:function(){this.$store.dispatch("testActive",!1),console.log("leaveActivated"),this.msg="Warning, you are about to leave the game",this.showQuit()},challengeSend:function(e,t){var s={userID:this.userID,username:this.username,targetID:e,mode:t,action:"send"};console.log("send challenge",s),this.socket.emit("challenge",s),this.friends.find(function(t){return t.id===e}).status=3},challengeRetract:function(e,t){var s={userID:this.userID,username:this.username,targetID:e,mode:"mode",action:"retract"};console.log("retract challenge",s),this.socket.emit("challenge",s),this.friends.find(function(t){return t.id===e}).status=1},declineChallenge:function(e,t){var s={userID:this.userID,username:this.username,targetID:e,mode:"mode",action:"decline"};console.log("decline challenge",s),this.socket.emit("challenge",s),this.friends.find(function(t){return t.id===e}).status=1},acceptChallenge:function(e,t){var s={userID:this.userID,username:this.username,targetID:e,mode:t,action:"accept"};console.log(" accept challenge",s),this.socket.emit("challenge",s)},addFriend:function(){this.waiting=!1;var e=this,t=this.friend.username,s=this.friend.userID;return Object(u.d)({friendName:t,friendID:s,userID:e.userID}).then(function(n){n.data.check&&n.data.friendID!==e.userID?(console.log("response",n.data),e.friends=JSON.parse(n.data.friends),e.$store.dispatch("addFriend",{friendData:JSON.parse(n.data.friends)}),e.msg="Friend added:"+t+" #"+s,e.$emit("resetMatch"),e.showModal()):(e.msg="Cannot add friend. Please check username and user ID",e.showAlert())}).catch(function(e){console.log("Error Registering: ",e)})},deleteFriend:function(e){this.waiting=!1;var t=this;return Object(u.e)({friendID:e,userID:t.userID}).then(function(e){e.data.check?(console.log("response",e.data),t.friends=JSON.parse(e.data.friends),t.$store.dispatch("addFriend",{friendData:JSON.parse(e.data.friends)}),t.msg="Friend Deleted",t.showModal()):(t.msg="Cannot delete friend right now",t.showAlert())}).catch(function(e){console.log("Error Deleting: ",e)})}},created:function(){var e=this;window.onbeforeunload=function(){e.isAuthenticated&&!1===e.$store.state.updateStatus&&e.closeSocket()}},beforeDestroy:function(){console.log("beforeDestroyMatch"),this.closeSocket()},mounted:function(){this.userID=this.$store.state.userProfile.userID,this.username=this.$store.state.userProfile.username,this.startSocket();var e=this;e.socket.on("offlineUsers",function(t){console.log("offlineUsers",t),e.friends.find(function(e){return e.id===t.userID}).status=0}),e.socket.on("onlineUsers",function(t){(console.log("onlineUsers",t,r()({},e.friends)),t.friends)?0===a()(e.friends).length&&(e.friends=t.friends):e.friends.find(function(e){return e.id===t.userID}).status=1}),e.socket.on("busy",function(t){console.log("busy",t);var s=e.friends.find(function(e){return e.id===t.userID}),n=e.friends.find(function(e){return e.id===t.targetID});"send"===t.action?(s.status=2,n.status=2):"decline"===t.action?s.status=1:(s.status=1,n.status=1)}),e.socket.on("challengeMatch",function(t){console.log("challengeMatch",t);var s=e.friends.find(function(e){return e.id===t.userID});"decline"===t.action?s.status=1:"retract"===t.action?s.status=1:(s.status=4,s.mode=t.mode,e.challengeMode=t.mode)}),e.socket.on("start",function(t){console.log("start",t),e.$store.dispatch("testActive",!0),e.testType=t.mode;var s=e.friends.find(function(e){return e.id===t.p1});s?(e.player="p2",e.p1=t.p1,e.p1name=s.name):void 0===s?(e.player="p1",e.p1=t.p1,e.p1name=e.username):console.log("PLAYER ERROR"),e.p2=t.p2,e.p2name=t.p2name,console.log("player",e.player)}),e.socket.on("leaveRoom",function(t){e.gameOver=!0,console.log("reset",t),e.msg="Game Ended, "+t.opponent+" has left the game",e.showQuit()})}},f={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"matchArea"},[e.testType&&"r"===e.testType[1]?s("TransMatch",{attrs:{testType:e.testType,gameOver:e.gameOver,p1:e.p1,p2:e.p2,p1name:e.p1name,p2name:e.p2name,player:e.player,socket:e.socket,s3:e.s3},on:{leave:function(t){return e.leaveMatch()}}}):e._e(),e._v(" "),e.testType&&"y"===e.testType[1]?s("TypeMatch",{attrs:{testType:e.testType,gameOver:e.gameOver,p1:e.p1,p2:e.p2,p1name:e.p1name,p2name:e.p2name,player:e.player,socket:e.socket,s3:e.s3},on:{leave:function(t){return e.leaveMatch()}}}):e._e(),e._v(" "),e.waiting&&null!==e.friends?[null===e.testType?s("div",[e._m(0),e._v(" "),s("div",{staticClass:"bg-grey text-third p-2"},[s("b-row",{attrs:{align:"center"}},[s("b-col",[s("div",{staticStyle:{color:"red !important"}},[s("b-form-radio-group",{attrs:{id:"btn-radios-2",options:e.gameTypes,buttons:"","button-variant":e.gameColors[e.gameSelect],name:"radio-btn-outline"},model:{value:e.gameSelect,callback:function(t){e.gameSelect=t},expression:"gameSelect"}})],1)])],1)],1),e._v(" "),e.friendAdder?s("div",{staticClass:"bg-prime p-2"},[s("b-row",{attrs:{no:"",gutters:""}},[s("b-col",[s("b-form",{attrs:{inline:""}},[s("b-input",{staticClass:"mb-2 mr-sm-2 mb-sm-0",attrs:{id:"inline-form-input-name",placeholder:"Friend name"},model:{value:e.friend.username,callback:function(t){e.$set(e.friend,"username",t)},expression:"friend.username"}}),e._v(" "),s("b-input-group",{staticClass:"mb-2 mr-sm-2 mb-sm-0",attrs:{prepend:"#"}},[s("b-input",{attrs:{id:"inline-form-input-username",placeholder:"user ID"},model:{value:e.friend.userID,callback:function(t){e.$set(e.friend,"userID",t)},expression:"friend.userID"}})],1)],1)],1),e._v(" "),s("b-col",[s("button",{staticClass:"buttonDiv bg-third",staticStyle:{width:"100px"},on:{click:function(t){return e.addFriend()}}},[e._v("Add")])])],1)],1):e._e(),e._v(" "),s("div",{staticClass:"bg-smoke text-prime p-2"},[s("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterWaiting},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[s("b-row",[s("b-col",{attrs:{cols:"8"}},[s("div",{staticClass:"nameTag bg-p1 pt-2"},[s("b-row",[s("b-col",{attrs:{cols:"3"}},[s("b-avatar",{staticClass:"ml-2",attrs:{src:e.s3+t.value+"/avatar.jpg",size:"1.5rem"}})],1),e._v(" "),s("b-col",[s("span",[e._v(" "+e._s(e.getName(t.item.name))+" ")]),e._v(" "),s("b-icon",{staticClass:"mr-2 mt-1",staticStyle:{float:"right"},attrs:{icon:"circle-fill",animation:"throb"}})],1)],1)],1)]),e._v(" "),s("b-col",[s("button",{class:e.classColors[e.challengeMode],staticStyle:{width:"60%",height:"40px"},on:{click:function(s){return e.acceptChallenge(t.item.id,t.item.mode)}}},[s("b-icon",{staticClass:"text-prime",attrs:{icon:"box-arrow-in-left"}})],1),e._v(" "),s("b-icon",{staticClass:"text-alert mt-1",staticStyle:{float:"right"},attrs:{"font-scale":"1.5",icon:"x-square-fill"},on:{click:function(s){return e.declineChallenge(t.item.id)}}})],1)],1)]}}],null,!1,642041815),model:{value:e.waiter,callback:function(t){e.waiter=t},expression:"waiter"}}),e._v(" "),s("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterChallenge},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[s("b-row",[s("b-col",{attrs:{cols:"8"}},[s("div",{staticClass:"nameTag bg-p2 pt-2"},[s("b-row",[s("b-col",{attrs:{cols:"3"}},[s("b-avatar",{staticClass:"ml-2",attrs:{src:e.s3+t.value+"/avatar.jpg",size:"1.5rem"}})],1),e._v(" "),s("b-col",[s("span",[e._v(" "+e._s(e.getName(t.item.name))+" ")]),e._v(" "),s("b-icon",{staticClass:"mr-2 mt-1",staticStyle:{float:"right"},attrs:{icon:"circle-fill",animation:"throb"}})],1)],1)],1)]),e._v(" "),s("b-col",[s("b-icon",{staticClass:"text-alert mt-2",staticStyle:{float:"right"},attrs:{"font-scale":"1.5",icon:"x-square-fill"},on:{click:function(s){return e.challengeRetract(t.item.id)}}})],1)],1)]}}],null,!1,143342247),model:{value:e.challenger,callback:function(t){e.challenger=t},expression:"challenger"}}),e._v(" "),0===e.waiter.length&&0===e.challenger.length?s("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterOnline},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[1===t.item.status?s("b-row",[s("b-col",{attrs:{cols:"8"}},[s("div",{staticClass:"nameTag bg-safe pt-2"},[s("b-row",[s("b-col",{attrs:{cols:"3"}},[s("b-avatar",{staticClass:"ml-2",attrs:{src:e.s3+t.value+"/avatar.jpg",size:"1.5rem"}})],1),e._v(" "),s("b-col",[s("span",[e._v(" "+e._s(e.getName(t.item.name))+" ")]),e._v(" "),s("b-icon",{staticClass:"mr-2 mt-1",staticStyle:{float:"right"},attrs:{icon:"circle-fill",animation:"throb"}})],1)],1)],1)]),e._v(" "),s("b-col",[s("button",{class:e.classColors[e.gameSelect],staticStyle:{width:"60%",height:"40px"},on:{click:function(s){return e.challengeSend(t.value,e.gameSelect)}}},[s("b-icon",{staticClass:"text-prime",attrs:{icon:"box-arrow-in-right"}})],1)])],1):s("b-row",[s("b-col",{attrs:{cols:"8"}},[s("div",{staticClass:"nameTag bg-warn pt-2"},[s("b-row",[s("b-col",{attrs:{cols:"3"}},[s("b-avatar",{staticClass:"ml-2",attrs:{src:e.s3+t.value+"/avatar.jpg",size:"1.5rem"}})],1),e._v(" "),s("b-col",[s("span",[e._v(" "+e._s(e.getName(t.item.name))+" ")]),e._v(" "),s("b-icon",{staticClass:"mr-2 mt-1",staticStyle:{float:"right"},attrs:{icon:"circle-fill",animation:"throb"}})],1)],1)],1)])],1)]}}],null,!1,1061017918)}):e._e(),e._v(" "),0===e.waiter.length&&0===e.challenger.length?s("b-table",{attrs:{items:e.friends,fields:e.fields,"thead-class":"d-none",filter:e.selected,"filter-function":e.filterOffline},scopedSlots:e._u([{key:"cell(id)",fn:function(t){return[s("b-row",[s("b-col",{attrs:{cols:"8"}},[s("div",{staticClass:"nameTag bg-alert pt-2"},[s("b-row",[s("b-col",{attrs:{cols:"3"}},[s("b-avatar",{staticClass:"ml-2",attrs:{src:e.s3+t.value+"/avatar.jpg",size:"1.5rem"}})],1),e._v(" "),s("b-col",[s("span",[e._v(" "+e._s(e.getName(t.item.name))+" ")]),e._v(" "),s("b-icon",{staticClass:"mr-2 mt-1",staticStyle:{float:"right"},attrs:{icon:"exclamation-circle"}})],1)],1)],1)])],1)]}}],null,!1,2228653753)}):e._e()],1)]):e._e()]:[s("div",{staticClass:"mt-5",attrs:{align:"center"}},[s("h4",{staticClass:"text-prime"},[e._v(" Updating.... ")]),e._v(" "),s("b-icon",{attrs:{icon:"person",animation:"throb",variant:"prime","font-scale":"6"}})],1)],e._v(" "),s("b-modal",{ref:"success",attrs:{align:"center","hide-footer":"",title:"Complete","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-safe text-cream",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("success")}}},[e._v("Close")])]),e._v(" "),s("b-modal",{ref:"fail",attrs:{align:"center","hide-footer":"",title:"Problem Found","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("fail")}}},[e._v("Close")])]),e._v(" "),s("b-modal",{ref:"quit",attrs:{align:"center","hide-footer":"",title:"Game Over","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-alert text-prime",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("quit")}}},[e._v("Quit")]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-grey text-prime",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("cancel")}}},[e._v("Cancel")])])],2)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"mt-2 p-2 bg-grape head"},[t("h2",{staticClass:"text-cream",attrs:{align:"center"}},[this._v("\n              Match Zone\n            ")])])}]};var h=s("VU/8")(d,f,!1,function(e){s("K47E")},"data-v-1f5a46b1",null);t.default=h.exports}});
//# sourceMappingURL=9.ce9d6bff972f09a57816.js.map