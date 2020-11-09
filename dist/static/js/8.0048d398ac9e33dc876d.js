webpackJsonp([8],{JDz2:function(t,e){},UIH9:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("Dd8w"),n=s.n(i),o=s("mvHQ"),l=s.n(o),a=s("0xDb"),r=s("gyMJ"),c={name:"Dictionary",props:{s3:String},data:function(){return{fields:[{key:"English",label:"Vocab",sortable:!0},{key:"ChineseExt",label:"Chinese",sortable:!0}],visibleRows:[],selected:[null,null,null],sMarker:null,optionsA:[{value:null,text:"---"}],gValue:"---",optionsG:[{value:null,text:"---"},{value:"*",text:"stars"},{value:"+",text:"added"},{value:"v.",text:"verbs"},{value:"adj.",text:"adjectives"},{value:"n.",text:"nouns"},{value:"phr.",text:"phrases"},{value:"abbr.",text:"abbreviations"},{value:"prop.",text:"proper nouns"}],labels:[{value:"v.",text:"verb"},{value:"adj.",text:"adjective"},{value:"n.",text:"noun"},{value:"phr.",text:"phrase"},{value:"abbr.",text:"abbreviation"},{value:"prop.",text:"proper noun"}],optionsR:[{value:-2,text:"--"},{value:-1,text:"-"},{value:0,text:"o"},{value:1,text:"+"},{value:2,text:"++"}],color:{2:"safe",1:"third",0:"smoke","-1":"warn","-2":"alert"},entry:!0,imageData:null,newWord:{word:null,text:null,chinese:null,link:null,code:this.codeGen(),vocab:null},wordDetails:{gl:null,defch1:null,defch2:""},vocabList:null,waiting:!0,msg:"Action Complete",edit:!1,del:!1,audioMarker:[null,null]}},computed:{dictGet:function(){return console.log("dictGet",this.$store.state.setRecord.dictRecord),this.$store.getters.dictGet},starGet:function(){return console.log("starGet",this.$store.state.setRecord.starRecord),this.$store.getters.starGet},tableItems:function(){return this.$store.getters.makeList}},methods:{codeGen:function(){var t=new Date,e=t.getMinutes().toString()+t.getSeconds().toString();return console.log(e),e},imageLink:function(t,e){if(void 0===e)return"https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/standin.png";console.log("IMAGE_LINK",e,this.dictGet[t]);var s=this.$store.state.userProfile;return e?this.s3+s.userID+"/"+e.vocab+"/"+t+e.link+".jpg":this.s3+"blank.jpg"},nullClick:function(t,e){console.log("NULL"),this.selected=[null,null,null]},randomLet:function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");this.shuffle(t),console.log(t),this.selected=[t[0],null,null]},filterTable:function(t,e){if("*"===e[1]){if(t.English in this.starGet)return!0}else if("+"===e[1]){if("new"===t.Origin)return!0}else if("abbr."===e[1]||"prop."===e[1]){if(t.Gr===e[1])return!0}else if(null!=e[2]){if(t.totalScore===e[2]&&t.tested)return!0}else{if(null===e[0]||""===e[0])return!1;if(null!=e[0]&&1===e[0].length){if(t.English[0].toLowerCase()===e[0].toLowerCase()){if(e[1]&&t.Gr===e[1])return!0;if(!e[1])return!0}}else{if(null==e[0])return!1;if(t.English.toLowerCase().includes(e[0].toLowerCase())){if(e[1]&&t.Gr===e[1])return!0;if(!e[1])return!0}}}},alphabet:function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(var e in t)this.optionsA.push({value:t[e],text:t[e]})},getVariant:function(t){var e="prime";return t&&(e="safe"),e},playAudio:function(t,e){var s=document.getElementById(this.audioMarker[0]+this.audioMarker[1]);console.log(s),s&&s.setAttribute("class","text-prime"),this.audioMarker=[t,e];var i=document.getElementById(t+e);i.setAttribute("class","text-warn");var n=this.$store.state.userProfile.vocab[0],o="https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/"+this.$store.state.audioLinks[n]+e+t+".mp3",l=document.getElementById("audio");l.src=o,l.play(),l.onended=function(){i.setAttribute("class","text-prime")}},onSubmit:function(t){t.preventDefault(),this.saveWord()},onAdd:function(t){t.preventDefault(),this.addWord()},handleFileUpload:function(){Object(a.c)(document.getElementById("file"))},saveWord:function(){var t=this;return localStorage.imageData.length<1&&null===this.newWord.link?(alert("please add image"),!1):null===this.newWord.text?(alert("please add sentence"),!1):localStorage.imageData.length<1?void t.$store.dispatch("newPicture",{newWord:l()(t.newWord)}):(this.waiting=!1,Object(r.a)({imageData:localStorage.imageData,wordData:t.newWord,userID:t.$store.state.userProfile.userID}).then(function(e){console.log("response",e.data),console.table(t.newWord),localStorage.imageData&&t.$store.dispatch("newPicture",{newWord:l()(t.newWord)}),t.newWord.word="a",t.newWord.text=null,t.newWord.link=null,t.newWord.chinese=null,t.newWord.vocab=null,localStorage.imageData={},t.waiting=!0,t.msg="New picture/sentence added",t.showModal()}).catch(function(e){t.msg="New picture/sentence could not be added",t.showAlert(),console.log("Error Registering: ",e)}))},addStar:function(t,e){this.$store.dispatch("newStar",{word:t,set:e})},addWord:function(t,e){0===e?(this.msg="Your entry -"+t+"- has been removed from the dictionary",this.showAlert(),this.$store.dispatch("newAdd",{word:t,details:this.wordDetails,set:e})):(this.$store.dispatch("newAdd",{word:this.selected[0],details:n()({},this.wordDetails),set:e}),this.wordDetails.gl=null,this.wordDetails.defch1=null)},showModal:function(){this.$refs.success.show()},showAlert:function(){this.$refs.alert.show()},hideModal:function(t){"success"===t?this.$refs.success.hide():(this.$refs.alert.hide(),this.msg=null,this.waiting=!0)},editWord:function(t,e){this.newWord.word=t,this.newWord.chinese=null,localStorage.setItem("imageData",l()({})),console.log(this.codeGen()),this.dictGet[t]?(this.newWord.text=this.dictGet[t].text,this.newWord.link=this.dictGet[t].link,this.newWord.chinese=this.dictGet[t].chinese,this.newWord.code=this.codeGen(),this.newWord.vocab=this.dictGet[t].vocab):(this.newWord.code=this.codeGen(),this.newWord.chinese=e,this.newWord.vocab=this.$store.state.userProfile.vocab)},deleteWord:function(t){this.$store.dispatch("deleteWord",{word:t}),console.log(this.dictGet),this.msg=t+" Deleted",this.showModal()},shuffle:function(t){for(var e=t.length-1;e>0;e--){var s=Math.floor(Math.random()*(e+1)),i=[t[s],t[e]];t[e]=i[0],t[s]=i[1]}return t}},watch:{selected:function(){this.selected[0]!==this.sMarker&&(this.selected[2]=null,this.sMarker=this.selected[0]),null!==this.selected[1]&&(this.selected[2]=null)}},created:function(){this.randomLet(),this.vocabList=this.$store.state.userProfile.vocab,this.$store.getters.isAuthenticated||this.$router.push("login")},beforeMount:function(){this.$store.getters.isAuthenticated||this.$router.push("login")},beforeDestroy:function(){}},d={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"dict"},[s("audio",{attrs:{id:"audio"}}),t._v(" "),s("div",{staticClass:"mt-2 bg-second p-2 head"},[t.newWord.word?s("div",[s("b-row",[s("b-col",{attrs:{cols:"3",align:"left"}},[s("h2",{staticClass:"text-cream ml-3"},[t._v(" My Words ")])]),t._v(" "),s("b-col",{attrs:{align:"right"}},[s("button",{staticClass:"buttonDiv bg-third text-prime  mr-2",staticStyle:{height:"40px",width:"70px"},on:{click:function(e){t.edit=!t.edit,t.scroll(0,0)}}},[t._v("Edit")]),t._v(" "),s("button",{staticClass:"buttonDiv bg-alert text-cream  mr-2",staticStyle:{height:"40px",width:"70px"},on:{click:function(e){t.del=!t.del}}},[t._v("Delete")]),t._v(" "),s("button",{staticClass:"buttonDiv bg-warn px-3",staticStyle:{height:"40px",width:"60px"},on:{click:function(e){t.newWord.word=null}}},[s("b-icon-card-list",{attrs:{variant:"cream","font-scale":"1.5"}})],1)])],1)],1):s("div",{attrs:{align:"center"}},[s("b-row",{attrs:{"align-h":"end"}},[s("b-col",{attrs:{cols:"6"}},[s("h3",{staticClass:"text-cream"},[t._v(" Word List ")])]),t._v(" "),s("b-col",{attrs:{cols:"3"}},[s("button",{staticClass:"buttonDiv bg-warn px-3",staticStyle:{width:"60px",float:"right"},on:{click:function(e){t.newWord.word="a",t.selected[0]=""}}},[s("b-icon-images",{attrs:{variant:"cream","font-scale":"1.5"}})],1)])],1)],1)]),t._v(" "),t.newWord.word?t._e():s("div",{staticClass:"bg-grey p-2"},[s("b-row",{staticClass:"mb-2",attrs:{align:"center"}},[s("b-col",[s("b-form-input",{staticStyle:{"font-size":"30px",width:"70%","text-align":"center"},attrs:{align:"center",autocapitalize:"none",autocomplete:"off",id:"type"},on:{focus:function(e){return t.nullClick()},change:function(e){t.selected[2]=null,t.sMarker=t.selected[0]}},model:{value:t.selected[0],callback:function(e){t.$set(t.selected,0,e)},expression:"selected[0]"}})],1)],1),t._v(" "),s("b-row",{attrs:{align:"center"}},[s("b-col",[s("b-form-select",{staticClass:"bg-third",staticStyle:{width:"70%","overflow-y":"hidden"},attrs:{options:t.optionsG,"select-size":1},on:{change:function(e){t.selected[2]=null}},model:{value:t.selected[1],callback:function(e){t.$set(t.selected,1,e)},expression:"selected[1]"}})],1)],1),t._v(" "),s("b-row",{staticClass:"mt-3",attrs:{align:"center"}},[s("b-col",[s("b-form-group",[s("b-form-radio-group",{staticStyle:{width:"100%",color:"red"},attrs:{id:"btn-radios-2",options:t.optionsR,buttons:"","button-variant":t.color[this.selected[2]],size:"lg",name:"radio-btn-outline"},on:{change:function(e){t.selected[1]=null,t.selected[0]=null}},model:{value:t.selected[2],callback:function(e){t.$set(t.selected,2,e)},expression:"selected[2]"}})],1)],1)],1)],1),t._v(" "),0===t.visibleRows.length&&null!==t.selected[0]&&t.selected[0].length>1?s("div",{staticClass:"bg-grey p-2"},[s("h3",[t._v(" Add to Dictionary ")]),t._v(" "),s("b-form",{on:{submit:t.onAdd}},[s("b-input-group",{staticClass:"my-2 p-6"},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"hash"}})],1),t._v(" "),s("b-form-input",{attrs:{disabled:""},model:{value:t.selected[0],callback:function(e){t.$set(t.selected,0,e)},expression:"selected[0]"}})],1),t._v(" "),s("b-input-group",{staticClass:"my-2 p-6",attrs:{label:"Chinese","label-for":"exampleInput2"}},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"filter-left"}})],1),t._v(" "),s("b-form-textarea",{attrs:{placeholder:"Add Chinese",rows:"2"},model:{value:t.wordDetails.defch1,callback:function(e){t.$set(t.wordDetails,"defch1",e)},expression:"wordDetails.defch1"}})],1),t._v(" "),s("b-row",[s("b-col",[s("b-form-select",{staticClass:"bg-third",staticStyle:{width:"100%","overflow-y":"hidden"},attrs:{options:t.labels,"select-size":1},model:{value:t.wordDetails.gl,callback:function(e){t.$set(t.wordDetails,"gl",e)},expression:"wordDetails.gl"}})],1),t._v(" "),s("b-col",[s("button",{staticClass:"buttonDiv bg-warn px-3",staticStyle:{width:"120px"},attrs:{type:"submit"}},[s("b-icon-plus",{attrs:{variant:"cream","font-scale":"1.5"}})],1)])],1),t._v(" "),s("br")],1)],1):t._e(),t._v(" "),t.newWord.word?t._e():s("div",[s("b-table",{attrs:{striped:"",hover:"",items:t.tableItems,fields:t.fields,filter:t.selected,"filter-function":t.filterTable,"show-empty":"","head-variant":"dark"},scopedSlots:t._u([{key:"cell(english)",fn:function(e){return[s("b-row",{attrs:{"no-gutters":""}},[s("b-col",{attrs:{cols:"3"}},[e.item.Star?[s("b-icon-star-fill",{attrs:{variant:"warn"},on:{click:function(s){return t.addStar(e.value,0)}}}),t._v("   "),s("br",{staticClass:"d-lg-none"})]:[s("b-icon-star",{on:{click:function(s){return t.addStar(e.value,1)}}}),t._v("   "),s("br",{staticClass:"d-lg-none"})],t._v(" "),s("b-icon-card-image",{attrs:{variant:t.getVariant(e.item.Picture)},on:{click:function(s){return t.editWord(e.value,e.item.ChineseExt)}}}),t._v("    "),s("br",{staticClass:"d-lg-none"})],2),t._v(" "),s("b-col",[t._v("\n            "+t._s(e.value)+" "),s("br"),t._v(" ("+t._s(e.item.Gr)+")\n             "),s("b-icon-soundwave",{staticClass:"text-prime",attrs:{id:e.value+"_en/"},on:{click:function(s){return t.playAudio(e.value,"_en/")}}})],1)],1)]}},{key:"cell(chineseext)",fn:function(e){return[s("b-row",[s("b-col",[t._v("\n            "+t._s(e.value)+"\n          ")]),t._v(" "),s("b-col",{attrs:{align:"right"}},["new"===e.item.Origin?s("b-icon-trash-fill",{attrs:{variant:"alert"},on:{click:function(s){return t.addWord(e.item.English,0)}}}):t._e(),t._v(" "),s("br",{staticClass:"d-lg-none"})],1)],1)]}}],null,!1,867828950),model:{value:t.visibleRows,callback:function(e){t.visibleRows=e},expression:"visibleRows"}})],1),t._v(" "),t.newWord.word&&"a"!==t.newWord.word?s("div",{staticClass:"bg-grey p-2"},[t.waiting?s("div",[s("b-form",{on:{submit:t.onSubmit}},[s("b-input-group",{staticClass:"my-2 p-6"},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"hash"}})],1),t._v(" "),s("b-form-input",{attrs:{disabled:""},model:{value:t.newWord.word,callback:function(e){t.$set(t.newWord,"word",e)},expression:"newWord.word"}})],1),t._v(" "),s("b-row",[s("b-col",{staticStyle:{"max-width":"200px"},attrs:{cols:"4"}},[s("b-img",{attrs:{thumbnail:"",fluid:"",src:t.imageLink(t.newWord.word,t.dictGet[t.newWord.word]),alt:t.newWord.word}})],1),t._v(" "),s("b-col",[s("div",{staticClass:"mt-9",attrs:{align:"left"}},[s("b-form-file",{ref:"file",attrs:{accept:"image/*",placeholder:"Change Image",type:"file",id:"file"},on:{change:function(e){return t.handleFileUpload()}}})],1)])],1),t._v(" "),s("b-input-group",{staticClass:"my-2 p-6",attrs:{label:"Student ID:","label-for":"exampleInput2"}},[s("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[s("b-icon",{attrs:{icon:"filter-left"}})],1),t._v(" "),s("b-form-textarea",{attrs:{placeholder:"Add Sentence",rows:"2"},model:{value:t.newWord.text,callback:function(e){t.$set(t.newWord,"text",e)},expression:"newWord.text"}})],1),t._v(" "),s("div",{staticClass:"d-flex justify-content-between"},[s("div",[s("button",{staticClass:"buttonDiv bg-warn px-3",staticStyle:{width:"120px"},attrs:{type:"submit"}},[s("b-icon-plus",{attrs:{variant:"cream","font-scale":"1.5"}})],1)])])],1)],1):s("div",{attrs:{align:"center"}},[s("h4",{staticClass:"text-prime"},[t._v(" Adding Picture ")]),t._v(" "),s("b-icon",{attrs:{icon:"three-dots",animation:"cylon",variant:"prime","font-scale":"6"}})],1)]):t._e(),t._v(" "),t.newWord.word?s("div",[s("table",{staticClass:"table table-striped table-hover table-sm table-borderless"},[s("tbody",t._l(t.dictGet,function(e,i){return s("tr",{key:i},[s("td",{staticStyle:{width:"200px"}},[s("span",[s("b-img",{attrs:{thumbnail:"",fluid:"",src:t.imageLink(i,e),alt:i}})],1)]),t._v(" "),s("td",{staticStyle:{width:"70%"}},[s("h5",[t._v(t._s(i))]),t._v(" "),s("span",{staticClass:"pr-5"},[t._v(t._s(e.text))])]),t._v(" "),s("td",[t.edit?s("button",{staticClass:"buttonDiv bg-third text-second px-3",on:{click:function(e){return t.editWord(i)}}},[s("b-icon",{attrs:{icon:"pencil"}})],1):t._e(),t._v(" "),t.del?s("button",{staticClass:"buttonDiv bg-alert text-cream px-3",on:{click:function(e){return t.deleteWord(i)}}},[s("b-icon",{attrs:{icon:"trash-fill"}})],1):t._e()])])}),0)])]):t._e(),t._v(" "),s("b-modal",{ref:"success",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Picture Added"}},[s("div",{staticClass:"d-block"},[s("h3",[t._v(" "+t._s(t.msg)+" ")])]),t._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-warn text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("success")}}},[t._v("Close")])]),t._v(" "),s("b-modal",{ref:"alert",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Alert"}},[s("div",{staticClass:"d-block"},[s("h3",[t._v(" "+t._s(t.msg)+" ")])]),t._v(" "),s("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("alert")}}},[t._v("Close")])])],1)},staticRenderFns:[]};var u=s("VU/8")(c,d,!1,function(t){s("JDz2")},"data-v-51b99869",null);e.default=u.exports}});
//# sourceMappingURL=8.0048d398ac9e33dc876d.js.map