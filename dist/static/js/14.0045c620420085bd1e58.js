webpackJsonp([14],{BKbF:function(t,s){},"as+C":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("fZjL"),n=e.n(i),o=e("Dd8w"),c=e.n(o),r=e("xEZN"),a={name:"InstSent",props:{s3:String,group:String},components:{InstPicts:r.default},data:function(){return{counterKeys:{transEng:"English Test",transCh:"Chinese Test",typeTest:"Type Test",matchTrans:"Match",matchType:"Type Match"},scoreShow:{},pictShow:{},pictShowOne:null}},methods:{showPicts:function(t){this.pictShow[t]&&0!==this.pictShow[t]?this.pictShow[t]=0:this.pictShow[t]=1,this.pictShow=c()({},this.pictShow),console.log(t,this.pictShow)},showPictsOne:function(t){this.pictShowOne?this.pictShowOne=null:this.pictShowOne=t},getLength:function(t){return delete t.add,n()(t).length},saveRecords:function(){this.$store.state.instructor.studentNotes!=={}&&this.$store.dispatch("instructorLogs",{group:this.$store.state.instructor.classLoad,action:"setNotes",notes:this.$store.state.instructor.studentNotes})}},computed:{classRecords:function(){return this.$store.getters.classRecords},classGroups:function(){return this.$store.getters.classGroups}},created:function(){this.$store.dispatch("instructorLogs",{group:this.group,action:"getNotesInstructor"})},beforeDestroy:function(){}},h={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{attrs:{id:"instSent"}},[e("div",{staticClass:"bg-white mt-0 p-0"},[e("div",{staticClass:"bg-grey p-2"},[e("b-row",[e("b-col",{attrs:{align:"right"}},[e("button",{staticClass:"buttonDiv bg-safe-light text-prime px-3",staticStyle:{width:"auto",height:"auto"},on:{click:function(s){return t.saveRecords()}}},[t._v("\n                  Save Picture Notes\n          ")])])],1)],1),t._v(" "),e("table",{staticClass:"table table-striped"},[t._m(0),t._v(" "),e("tbody",[t._l(t.classRecords,function(s,i){return[e("tr",{key:i},[e("td",{staticStyle:{width:"150px"}},[t._v(t._s(s.studentID))]),t._v(" "),e("td",{staticStyle:{width:"150px"}},[t._v(t._s(s.user))]),t._v(" "),e("td",[e("div",{staticStyle:{width:"70px",display:"inline-block"}},[e("b-icon-images",{attrs:{variant:"safe","font-scale":"1.5"}}),t._v(" "+t._s(t.getLength(s.setRecord.dictRecord))+"\n                          ")],1),t._v(" "),e("div",{staticStyle:{display:"inline-block"}},[e("b-form-select",{staticStyle:{width:"100px","overflow-y":"hidden",display:"inline"}},t._l(s.setRecord.dictRecord,function(s,i){return e("option",{key:i},[t._v(" "+t._s(i)+" ")])}),0)],1)]),t._v(" "),e("td",{attrs:{align:"left"}},[e("button",{staticClass:"buttonDiv bg-safe text-cream px-3",staticStyle:{width:"auto",height:"auto"},on:{click:function(s){return t.showPictsOne(i)}}},[t._v("\n                                OPEN\n                          ")])])]),t._v(" "),e("transition",{key:i,attrs:{name:"tableboard"}},[i.toString()===t.pictShowOne?e("tr",[e("td",{attrs:{colspan:"6"}},[e("InstPicts",{attrs:{student:i,itemMaster:s}})],1)]):t._e()])]})],2)])])])},staticRenderFns:[function(){var t=this.$createElement,s=this._self._c||t;return s("thead",[s("tr",[s("th",{attrs:{scope:"col"}},[this._v("ID")]),this._v(" "),s("th",{attrs:{scope:"col"}},[this._v("Student")]),this._v(" "),s("th",{attrs:{scope:"col"}},[this._v("Pics")])])])}]};var l=e("VU/8")(a,h,!1,function(t){e("BKbF")},"data-v-1fb788ac",null);s.default=l.exports}});
//# sourceMappingURL=14.0045c620420085bd1e58.js.map