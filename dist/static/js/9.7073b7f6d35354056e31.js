webpackJsonp([9],{B7aS:function(e,t){},dHcL:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("mvHQ"),a=s.n(n),r=s("XdxJ"),i=s("ZE+q"),o=s("OLUw"),l=s("gyMJ"),c={name:"Match",props:{s3:String},components:{TransMatch:r.default,TypeMatch:i.default},data:function(){return{pageHead:"Match Area",friends:{},friendAdder:!1,friendDeleter:!1,friend:{username:null,userID:null},username:null,userID:null,onlineUsers:{},userList:[],challengeUsers:{},challengeList:[],challengeMarker:null,socket:null,testType:null,p1:null,p2:null,p1name:null,p2name:null,player:null,message:null,waiting:!0,msg:null,gameSelect:"TransEng",gameTypes:[{value:"TransEng",text:"En -> Ch"},{value:"TransCh",text:"Ch -> En"},{value:"TypeMatch",text:"Spelling"}],gameNames:{TransEng:"En -> Ch",TransCh:"Ch -> En",TypeMatch:"Spelling"}}},methods:{showModal:function(){this.$refs.success.show()},showAlert:function(){this.$refs.fail.show()},showQuit:function(){this.$refs.quit.show()},hideModal:function(e){"success"===e?(this.$refs.success.hide(),this.waiting=!0):"success"===e?(this.$refs.fail.hide(),this.waiting=!0):(this.$refs.quit.hide(),this.$emit("resetMatch"))},startSocket:function(){console.log("STARTSOCKET"),this.socket=Object(o.a)(),this.socket.emit("checkOnline",{userID:this.userID})},closeSocket:function(){this.socket.close()},leaveMatch:function(){console.log("leave activated")},challenge:function(e,t){this.challengeMarker=e;var s={userID:this.userID,username:this.username,targetID:e,mode:t};console.log("send challenge",s),this.socket.emit("challenge",s)},declineChallenge:function(e){delete this.challengeUsers[e],this.challengeUsers=JSON.parse(a()(this.challengeUsers))},acceptChallenge:function(e,t,s){this.socket.emit("accept",{p2:this.userID,p2name:this.username,p1:e,p1name:t,mode:s})},addFriend:function(){this.waiting=!1;var e=this,t=this.friend.username,s=this.friend.userID;return Object(l.c)({friendName:t,friendID:s,userID:e.userID}).then(function(n){n.data.check&&n.data.friendID!==e.userID?(console.log("response",n.data),e.friends=JSON.parse(n.data.friends),e.$store.dispatch("addFriend",{friendData:JSON.parse(n.data.friends)}),e.msg="Friend added:"+t+" #"+s,e.$emit("resetMatch"),e.showModal()):(e.msg="Cannot add friend. Please check username and user ID",e.showAlert())}).catch(function(e){console.log("Error Registering: ",e)})},deleteFriend:function(e){this.waiting=!1;var t=this;return Object(l.d)({friendID:e,userID:t.userID}).then(function(e){e.data.check?(console.log("response",e.data),t.friends=JSON.parse(e.data.friends),t.$store.dispatch("addFriend",{friendData:JSON.parse(e.data.friends)}),t.msg="Friend Deleted",t.showModal()):(t.msg="Cannot delete friend right now",t.showAlert())}).catch(function(e){console.log("Error Deleting: ",e)})}},created:function(){if(console.log(this.s3),!this.$store.getters.isAuthenticated)return this.$router.push("login"),!1;var e=this;window.onbeforeunload=function(){e.isAuthenticated&&!1===e.$store.state.updateStatus&&e.closeSocket()}},beforeDestroy:function(){console.log("beforeDestroyMatch"),this.closeSocket()},mounted:function(){this.userID=this.$store.state.userProfile.userID,this.username=this.$store.state.userProfile.username,this.friends=this.$store.state.logsRecord.friends,this.startSocket();var e=this;e.socket.on("onlineUsers",function(t){console.log("onlineUsers0",e.onlineUsers),e.friends[t.userID]&&(console.log("onlineUsers",t),e.onlineUsers[t.userID]=t.username,e.onlineUsers=JSON.parse(a()(e.onlineUsers)))}),e.socket.on("offlineUsers",function(t){console.log("offlineUsers",t),delete e.onlineUsers[t.userID],e.onlineUsers=JSON.parse(a()(e.onlineUsers))}),e.socket.on("disconnect",function(e){console.log("disconnect")}),e.socket.on("challengeMatch",function(t){if(console.log("challengeMatch",t),console.log("challengeMarker",e.challengeMarker),e.challengeMarker===t.userID)return e.challengeMarker=null,console.log("challenge blocked"),!1;var s={sender:t.sender,mode:t.mode,userID:t.userID};for(var n in e.challengeUsers)if(console.log(e.challengeUsers[n],s),e.challengeUsers[n].userID===s.userID)return console.log("found"),!1;e.challengeMarker=null,e.challengeUsers[s.userID]=s,e.challengeUsers=JSON.parse(a()(e.challengeUsers))}),e.socket.on("start",function(t){console.log("start",t),e.$store.dispatch("testActive",!0),e.challengeMarker=null,e.testType=t.mode,e.p1=t.p1,e.p1name=t.p1name,e.p2=t.p2,e.p2name=t.p2name,e.p1===e.$store.state.userProfile.userID?e.player="p1":e.p2===e.$store.state.userProfile.userID?e.player="p2":console.log("PLAYER ERROR"),console.log("player",e.player)}),e.socket.on("reset",function(t){e.$store.dispatch("testActive",!1),e.testType&&(console.log("reset",t),e.msg="Game Ended, "+t.opponent+" has left the game",e.showQuit())})}},d={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"matchArea"},[e.testType&&"r"===e.testType[1]?s("TransMatch",{attrs:{testType:e.testType,p1:e.p1,p2:e.p2,p1name:e.p1name,p2name:e.p2name,player:e.player,socket:e.socket,s3:e.s3}}):e._e(),e._v(" "),e.testType&&"y"===e.testType[1]?s("TypeMatch",{attrs:{testType:e.testType,p1:e.p1,p2:e.p2,p1name:e.p1name,p2name:e.p2name,player:e.player,socket:e.socket,s3:e.s3}}):e._e(),e._v(" "),e.waiting?[null===e.testType?s("div",[e._m(0),e._v(" "),s("div",{staticClass:"bg-third text-third p-2"},[s("b-row",{attrs:{align:"left"}},[s("b-col",{attrs:{cols:"7"}},[s("div",{staticStyle:{color:"red !important"}},[s("b-form-radio-group",{attrs:{id:"btn-radios-2",options:e.gameTypes,buttons:"","button-variant":"p1",name:"radio-btn-outline"},model:{value:e.gameSelect,callback:function(t){e.gameSelect=t},expression:"gameSelect"}})],1)]),e._v(" "),s("b-col",{attrs:{align:"right"}},[s("button",{staticClass:"buttonDiv bg-warn mt-2",on:{click:function(t){e.friendAdder=!e.friendAdder}}},[e._v(" Add "),s("b-icon",{attrs:{icon:"person"}})],1),e._v(" "),s("button",{staticClass:"buttonDiv bg-alert mt-2",on:{click:function(t){e.friendDeleter=!e.friendDeleter}}},[e._v(" Del "),s("b-icon",{attrs:{icon:"x-square-fill"}})],1)])],1)],1),e._v(" "),e.friendAdder?s("div",{staticClass:"bg-prime p-2"},[s("b-row",{attrs:{no:"",gutters:""}},[s("b-col",[s("b-form",{attrs:{inline:""}},[s("b-input",{staticClass:"mb-2 mr-sm-2 mb-sm-0",attrs:{id:"inline-form-input-name",placeholder:"Friend name"},model:{value:e.friend.username,callback:function(t){e.$set(e.friend,"username",t)},expression:"friend.username"}}),e._v(" "),s("b-input-group",{staticClass:"mb-2 mr-sm-2 mb-sm-0",attrs:{prepend:"#"}},[s("b-input",{attrs:{id:"inline-form-input-username",placeholder:"user ID"},model:{value:e.friend.userID,callback:function(t){e.$set(e.friend,"userID",t)},expression:"friend.userID"}})],1)],1)],1),e._v(" "),s("b-col",[s("button",{staticClass:"buttonDiv bg-third",staticStyle:{width:"100px"},on:{click:function(t){return e.addFriend()}}},[e._v("Add")])])],1)],1):e._e(),e._v(" "),s("div",{staticClass:"bg-smoke text-prime p-2"},[e._l(e.challengeUsers,function(t,n){return s("div",{key:n},[e.onlineUsers[n]?s("div",{staticClass:"d-flex align-items-center mt-2 p-2"},[s("b-avatar",{attrs:{src:e.s3+n.toString()+"/avatar.jpg",size:"50px",badge:t.sender,"badge-offset":"-0.5em","badge-variant":"p1"}}),e._v("\n                  \n                "),s("button",{staticClass:"buttonDiv bg-smoke mx-1 ",attrs:{disabled:""}},[e._v(" "+e._s(e.gameNames[t.mode]))]),e._v(" "),s("button",{staticClass:"buttonDiv bg-p2 mx-2",staticStyle:{width:"15%"},on:{click:function(s){return e.acceptChallenge(t.userID,t.sender,t.mode)}}},[s("b-icon",{attrs:{icon:"caret-right-square-fill"}})],1),e._v(" "),s("button",{staticClass:"buttonDiv bg-alert mx-1",staticStyle:{width:"15%"},on:{click:function(s){return e.declineChallenge(t.userID)}}},[e._v(" Del "),s("b-icon",{attrs:{icon:"x-square-fill"}})],1)],1):e._e()])}),e._v(" "),e._l(e.onlineUsers,function(t,n){return s("div",{key:n},[e.challengeUsers[n]?e._e():s("div",{staticClass:"d-flex align-items-center p-3 mt-2"},[s("b-avatar",{attrs:{src:e.s3+n+"/avatar.jpg",size:"50px",badge:t,"badge-offset":"-0.5em","badge-variant":"safe"}}),e._v(" "),e.gameSelect?s("button",{staticClass:"buttonDiv bg-prime mx-3",staticStyle:{width:"15%"},on:{click:function(t){return e.challenge(n,e.gameSelect)}}},[s("b-icon",{staticClass:"text-p1",attrs:{icon:"box-arrow-in-right"}})],1):e._e(),e._v(" "),e.friendDeleter?s("button",{staticClass:"buttonDiv bg-alert mx-3",staticStyle:{width:"100px"},on:{click:function(t){return e.deleteFriend(n)}}},[s("b-icon",{attrs:{icon:"x-square-fill"}})],1):e._e()],1)])}),e._v(" "),e._l(e.friends,function(t,n){return s("div",{key:n},[e.onlineUsers[n]?e._e():s("div",{staticClass:"d-flex align-items-center p-3 mt-2"},[s("b-avatar",{attrs:{src:e.s3+n+"/avatar.jpg",size:"50px",badge:t,"badge-offset":"-0.5em","badge-variant":"alert"}}),e._v(" "),e.friendDeleter?s("button",{staticClass:"buttonDiv bg-alert mx-3",staticStyle:{width:"100px"},on:{click:function(t){return e.deleteFriend(n)}}},[s("b-icon",{attrs:{icon:"x-square-fill"}})],1):e._e()],1)])})],2)]):e._e()]:[s("div",{staticClass:"mt-5",attrs:{align:"center"}},[s("h4",{staticClass:"text-prime"},[e._v(" Updating friends.... ")]),e._v(" "),s("b-icon",{attrs:{icon:"person",animation:"throb",variant:"prime","font-scale":"6"}})],1)],e._v(" "),s("b-modal",{ref:"success",attrs:{align:"center","hide-footer":"",title:"Complete","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-safe text-cream",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("success")}}},[e._v("Close")])]),e._v(" "),s("b-modal",{ref:"fail",attrs:{align:"center","hide-footer":"",title:"Problem Found","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("fail")}}},[e._v("Close")])]),e._v(" "),s("b-modal",{ref:"quit",attrs:{align:"center","hide-footer":"",title:"Game Over","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[e._v(" "+e._s(e.msg)+" ")])]),e._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-third text-prime",staticStyle:{width:"60%"},on:{click:function(t){return e.hideModal("quit")}}},[e._v("Close")])])],2)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"mt-2 p-2 bg-grape head"},[t("h2",{staticClass:"text-cream",attrs:{align:"center"}},[this._v("\n            Match Zone\n          ")])])}]};var u=s("VU/8")(c,d,!1,function(e){s("B7aS")},"data-v-104fbd36",null);t.default=u.exports}});
//# sourceMappingURL=9.7073b7f6d35354056e31.js.map