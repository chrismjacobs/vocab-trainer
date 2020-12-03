webpackJsonp([15],{dIqY:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("YaEn"),r={name:"app",data:function(){return{form:{username:"",email:"",password:"",confirm:""},show:!0,waiting:!0,vocabs:[{text:"ESP Tourism 1",value:"tourism"},{text:"ESP Food (Vietnamese)",value:"food"}],msg:null}},computed:{validName:function(){return this.form.username.length>2&&this.form.username.length<20},validPass:function(){return this.form.password===this.form.confirm}},methods:{showModal:function(t){this.msg=t,this.$refs.success.show()},showAlert:function(t){this.msg=t,this.$refs.fail.show()},hideModal:function(t){"success"===t?(this.$refs.success.hide(),a.a.push("/login")):(this.$refs.fail.hide(),this.msg=null,this.waiting=!0)},onSubmit:function(t){t.preventDefault(),this.validName&&this.validPass?this.register():alert("form is not complete")},onReset:function(t){var e=this;for(var s in t.preventDefault(),this.form)this.form[s]="";this.show=!1,this.$nextTick(function(){e.show=!0})},register:function(){this.waiting=!1;var t=this;this.$store.dispatch("register",{userData:this.form}).then(function(e){e.err?t.showAlert(e.msg):t.showModal(e.msg)})}}},i={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"register"},[t.waiting?s("b-card",{attrs:{header:"Register","header-bg-variant":"prime","header-text-variant":"cream","header-tag":"h3"}},[t.show?s("b-form",{on:{submit:t.onSubmit,reset:t.onReset}},[s("b-input-group",{staticClass:"my-4",attrs:{label:"Username:","label-for":"exampleInput1"}},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"person-fill"}})],1),t._v(" "),s("b-form-input",{attrs:{id:"username",required:"",placeholder:"Enter username"},model:{value:t.form.username,callback:function(e){t.$set(t.form,"username",e)},expression:"form.username"}}),t._v(" "),s("b-form-invalid-feedback",{attrs:{state:t.validName}},[t._v("\n                Your username must be 3-20 characters long.\n              ")]),t._v(" "),s("b-form-valid-feedback",{attrs:{state:t.validName}},[t._v("\n                Looks Good.\n              ")])],1),t._v(" "),s("b-input-group",{staticClass:"my-4",attrs:{label:"Email address:","label-for":"exampleInput4"}},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"envelope"}})],1),t._v(" "),s("b-form-input",{attrs:{type:"email",required:"",placeholder:"Enter email"},model:{value:t.form.email,callback:function(e){t.$set(t.form,"email",e)},expression:"form.email"}})],1),t._v(" "),s("b-input-group",{attrs:{id:"password",label:"Password:","label-for":"exampleInput2"}},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"lock-fill"}})],1),t._v(" "),s("b-form-input",{attrs:{id:"exampleInput2",type:"password",placeholder:"Password",required:""},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}})],1),t._v(" "),s("b-input-group",{staticClass:"my-4",attrs:{id:"exampleInputGroup3",label:"Confirm Password:","label-for":"exampleInput3"}},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"lock-fill"}})],1),t._v(" "),s("b-form-input",{attrs:{id:"exampleInput3",type:"password",placeholder:"Password",required:""},model:{value:t.form.confirm,callback:function(e){t.$set(t.form,"confirm",e)},expression:"form.confirm"}}),t._v(" "),s("b-form-invalid-feedback",{attrs:{state:t.validPass}},[t._v("\n                You must enter the same password\n              ")])],1),t._v(" "),s("div",{staticClass:"d-flex justify-content-between"},[s("div",[s("button",{staticClass:"buttonDiv bg-second px-3",staticStyle:{width:"140px"},attrs:{type:"submit"}},[s("b-icon-forward",{attrs:{variant:"cream","font-scale":"1.5"}})],1),t._v("\n                \n              "),s("button",{staticClass:"buttonDiv bg-alert px-3",staticStyle:{width:"60px"},attrs:{type:"reset"}},[s("b-icon-x-circle",{attrs:{variant:"cream","font-scale":"1.5"}})],1)])])],1):t._e()],1):s("div",{attrs:{align:"center"}},[s("h4",{staticClass:"text-prime"},[t._v(" Registering ")]),t._v(" "),s("b-icon",{attrs:{icon:"three-dots",animation:"cylon",variant:"prime","font-scale":"6"}})],1),t._v(" "),s("b-modal",{ref:"success",attrs:{align:"center","hide-footer":"",title:"Registration Complete","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[t._v(" "+t._s(t.msg)+" ")])]),t._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-third text-prime",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("success")}}},[t._v("Close")])]),t._v(" "),s("b-modal",{ref:"fail",attrs:{align:"center","hide-footer":"",title:"Problem Found","hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":""}},[s("div",{staticClass:"d-block"},[s("h3",[t._v(" "+t._s(t.msg)+" ")])]),t._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("fail")}}},[t._v("Close")])])],1)},staticRenderFns:[]},o=s("VU/8")(r,i,!1,null,null,null);e.default=o.exports}});
//# sourceMappingURL=15.39ff8192043a476500c9.js.map