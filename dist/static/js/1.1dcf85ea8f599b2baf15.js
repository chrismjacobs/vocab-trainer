webpackJsonp([1,9],{"/bQp":function(t,e){t.exports={}},"3fs2":function(t,e,n){var i=n("RY/4"),s=n("dSzd")("iterator"),r=n("/bQp");t.exports=n("FeBl").getIteratorMethod=function(t){if(void 0!=t)return t[s]||t["@@iterator"]||r[i(t)]}},"5zde":function(t,e,n){n("zQR9"),n("qyJz"),t.exports=n("FeBl").Array.from},"880/":function(t,e,n){t.exports=n("hJx8")},"94VQ":function(t,e,n){"use strict";var i=n("Yobk"),s=n("X8DO"),r=n("e6n0"),o={};n("hJx8")(o,n("dSzd")("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=i(o,{next:s(1,n)}),r(t,e+" Iterator")}},Gu7T:function(t,e,n){"use strict";e.__esModule=!0;var i,s=n("c/Tr"),r=(i=s)&&i.__esModule?i:{default:i};e.default=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return(0,r.default)(t)}},IkJW:function(t,e){},Mhyx:function(t,e,n){var i=n("/bQp"),s=n("dSzd")("iterator"),r=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||r[s]===t)}},PzxK:function(t,e,n){var i=n("D2L2"),s=n("sB3e"),r=n("ax3d")("IE_PROTO"),o=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=s(t),i(t,r)?t[r]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?o:null}},RPLV:function(t,e,n){var i=n("7KvD").document;t.exports=i&&i.documentElement},"RY/4":function(t,e,n){var i=n("R9M2"),s=n("dSzd")("toStringTag"),r="Arguments"==i(function(){return arguments}());t.exports=function(t){var e,n,o;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),s))?n:r?i(e):"Object"==(o=i(e))&&"function"==typeof e.callee?"Arguments":o}},UIH9:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("Dd8w"),s=n.n(i),r=n("Gu7T"),o=n.n(r),a=n("c2yy"),l={name:"Dictionary",props:{s3:String},components:{DictPict:a.default},data:function(){return{fields:[{key:"English",label:"Vocab",sortable:!0},{key:"ChineseExt",label:"Chinese",sortable:!0}],pields:[{key:"link",label:"Picture",sortable:!0},{key:"def",label:"Info",sortable:!0}],visibleRows:[],selected:[null,null,null],optionsA:[{value:null,text:"---"}],gValue:"---",optionsG:[{value:null,text:"---"},{value:"n.",text:"nouns"},{value:"v.",text:"verbs"},{value:"adj.",text:"adjectives"},{value:"adv.",text:"adverbs"},{value:"conj.",text:"conjunctions"},{value:"prep.",text:"prepositions"},{value:"phr.",text:"phrases"}],optionsP:[{value:null,text:"---"},{value:"v.",text:"verbs"},{value:"adj.",text:"adjectives"},{value:"n.",text:"nouns"},{value:"phr.",text:"phrases"},{value:"abbr.",text:"abbreviations"},{value:"prop.",text:"proper nouns"}],optionsR:[{value:-2,text:"--"},{value:-1,text:"-"},{value:0,text:"o"},{value:1,text:"+"},{value:2,text:"++"}],color:{2:"safe",1:"third",0:"smoke","-1":"warn","-2":"alert"},wordDetails:{gl:null,defch1:null,defch2:"",added:!1},vocabList:null,picture:!1,pictWord:null,pictCh:null,note:null,audioMarker:[null,null],soundCount:0,addWait:!1,showPictures:!1}},computed:{generalGet:function(){return this.$store.getters.generalGet},starGet:function(){return console.log("stars",this.$store.getters.starGet),this.$store.getters.starGet},tableItems:function(){return this.$store.getters.makeList},optionsCheck:function(){return"g"===this.vocabList[0]?this.optionsG:this.optionsP},pictList:function(){var t=this.$store.getters.pictGet;console.log(t);var e=[];for(var n in t.length>1&&delete t.add,t)e.push(this.$store.getters.pictGet[n]);return console.log("pictList",e),e}},methods:{showAlert:function(){this.$refs.alert.show()},hideAlert:function(t){this.$refs.alert.hide(),this.note=null},showClear:function(){this.$refs.clear.show()},hideClear:function(t){this.$refs.clear.hide(),"clear"===t&&this.$store.dispatch("newStar",{word:null,set:3})},getIcon:function(t){return this.selected[1]===t?{"*":"warn","+":"info",p:"safe"}[t]:"cream"},getSoundwave:function(){return 0===this.soundCount?"cream":1===this.soundCount?"info":"alert"},getSoundButton:function(){return 0===this.soundCount?"buttonDiv bg-second px-3":"buttonDiv bg-cream px-3"},getImage:function(t,e){if("add"===e)return"https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/add.jpg";var n=this.$store.state.userProfile,i=this.s3+n.userID+"/"+n.vocab+"/"+t+e+".jpg";return console.log(i),i},tapSound:function(){2===this.soundCount?this.soundCount=0:this.soundCount+=1},filterPicture:function(t,e){this.pictWord=t,this.pictCh=e,this.selected[2]=null,this.selected[1]=t,this.selected[0]=t,this.selected=[].concat(o()(this.selected))},changeSelected:function(t){if(!this.$store.state.userProfile.classroom&&["+","p"].includes(t))return this.note="Please join a classroom to access extra features",this.showAlert(),!1;this.selected[0]="",this.picture=!1,this.showPictures=!1,this.selected[1]="grade"===t?null:t,this.selected=[].concat(o()(this.selected)),console.log(this.selected)},nullClick:function(t,e){console.log("NULL"),this.selected=[null,null,null],this.selected=[].concat(o()(this.selected)),this.picture=!1},randomLet:function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");this.shuffle(t),console.log(t),this.selected=[t[0],null,null]},filterTable:function(t,e){if(null===e[0])return!1;if("*"===e[1]){if(t.Star)return!0}else if("+"===e[1]){if("new"===t.Origin)return!0}else{if(e[1]===t.English)return!0;if("p"===e[1]){if(t.Picture)return!0}else if("abbr."===e[1]||"prop."===e[1]){if(t.Gr===e[1])return!0}else if(null!=e[2]){if(t.totalScore===e[2]&&t.tested)return!0}else{if(null===e[0].trim()||""===e[0].trim())return!1;if(null!=e[0].trim()&&1===e[0].trim().length){if(t.English[0].trim().toLowerCase()===e[0].trim().toLowerCase()){if(e[1]&&t.Gr===e[1])return!0;if(!e[1])return!0}}else{if(null==e[0].trim())return!1;if(t.English.toLowerCase().includes(e[0].trim().toLowerCase())){if(e[1]&&t.Gr===e[1])return!0;if(!e[1])return!0}}}}},filterPics:function(t,e){if(null===e[0])return!0;if(null!=e[0].trim()&&1===e[0].trim().length){if(t.word[0].trim().toLowerCase()===e[0].trim().toLowerCase())return!0}else if(null!=e[0].trim()&&t.word.toLowerCase().includes(e[0].trim().toLowerCase()))return!0},alphabet:function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(var e in t)this.optionsA.push({value:t[e],text:t[e]})},getVariant:function(t){var e="prime";return t&&(e="success"),e},playAudio:function(t,e,n,i){var s=document.getElementById(this.audioMarker[0]+this.audioMarker[1]);console.log(s,n),s&&s.setAttribute("class","text-prime");var r=void 0;r=i?"text-warn":"text-"+this.getSoundwave(),this.audioMarker=[t,e];var o=document.getElementById(t+e);o.setAttribute("class",r);var a=document.getElementById("audio");a.src=n;var l=this;a.addEventListener("error",function(t){console.log("Logging playback error: "+t),o.setAttribute("class","text-prime"),l.note="Sorry, no audio available",l.showAlert()}),a.play(),a.onended=function(){o.setAttribute("class","text-prime")}},onAdd:function(t){t.preventDefault(),null===this.wordDetails.gl||null===this.wordDetails.defch1?(this.note="Please make sure Grammar Label and Chinese are complete",this.showAlert()):this.addWord(null,1)},addStar:function(t,e){this.$store.dispatch("newStar",{word:t,set:e})},addWord:function(t,e){console.log(t,e,this.wordDetails,this.generalGet[t]);var n=this.selected[0].trim();if(0===e)this.note="Your entry -"+t+"- has been removed from the dictionary",this.showAlert(),this.$store.dispatch("newAdd",{word:t,details:this.wordDetails,set:e});else if(this.generalGet[n])this.wordDetails.added=!1,this.sendAdd(e,n);else{this.wordDetails.added=!0,this.addWait=!0;var i=this;this.$store.dispatch("newAudio",{word:n,chinese:this.wordDetails.defch1,set:e}).then(function(t){console.log("AUDIO RESPONSE",t),t.defch2?t.defch2!==i.wordDetails.defch1&&(i.wordDetails.defch2=t.defch2):console.log("No chinese audio added"),i.sendAdd(e,n),i.addWait=!1})}},sendAdd:function(t,e){this.$store.dispatch("newAdd",{word:e,details:s()({},this.wordDetails),set:t}),this.wordDetails.gl=null,this.wordDetails.defch1=null},shuffle:function(t){for(var e=t.length-1;e>0;e--){var n=Math.floor(Math.random()*(e+1)),i=[t[n],t[e]];t[e]=i[0],t[n]=i[1]}return t}},created:function(){this.randomLet(),this.vocabList=this.$store.state.userProfile.vocab,this.$store.getters.isAuthenticated||this.$router.push("login")},beforeMount:function(){this.$store.getters.isAuthenticated||this.$router.push("login")},beforeDestroy:function(){}},c={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dict"},[n("audio",{attrs:{id:"audio"}}),t._v(" "),n("div",{staticClass:"mt-2 bg-second p-2 head"},[n("div",{attrs:{align:"center"}},[n("b-row",[n("b-col",[n("h3",{staticClass:"text-cream"},[t._v(" Word List ")])])],1)],1)]),t._v(" "),n("div",{staticClass:"bg-grey p-2"},[n("b-row",{staticClass:"mb-2",attrs:{align:"center"}},[n("b-col",[n("b-form-input",{staticStyle:{"font-size":"30px",width:"70%","text-align":"center"},attrs:{align:"center",autocapitalize:"none",autocomplete:"off",id:"type"},on:{focus:function(e){return t.nullClick()},change:function(e){t.selected[2]=null}},model:{value:t.selected[0],callback:function(e){t.$set(t.selected,0,e)},expression:"selected[0]"}})],1)],1),t._v(" "),n("b-row",[n("b-col",{attrs:{align:"center"}},[n("button",{staticClass:"buttonDiv bg-second px-3",staticStyle:{width:"60px"},on:{click:function(e){return t.changeSelected("p")}}},[n("b-icon-images",{attrs:{variant:t.getIcon("p"),"font-scale":"1.5"}})],1),t._v(" "),n("button",{staticClass:"buttonDiv bg-second px-3",staticStyle:{width:"60px"},on:{click:function(e){return t.changeSelected("*")}}},[n("b-icon-star-fill",{attrs:{variant:t.getIcon("*"),"font-scale":"1.5"}})],1),t._v(" "),"g"===t.vocabList[0]?n("button",{staticClass:"buttonDiv bg-second px-3",staticStyle:{width:"60px"},on:{click:function(e){return t.changeSelected("+")}}},[n("b-icon-arrow-up-circle-fill",{attrs:{variant:t.getIcon("+"),"font-scale":"1.5"}})],1):t._e(),t._v(" "),n("button",{class:t.getSoundButton(),staticStyle:{width:"60px"},on:{click:function(e){return t.tapSound()}}},[n("b-icon-soundwave",{attrs:{variant:t.getSoundwave(),"font-scale":"1.5"}})],1),t._v(" "),n("b-form-select",{staticClass:"bg-second text-cream",staticStyle:{width:"10%","overflow-y":"hidden"},attrs:{options:t.optionsCheck,"select-size":1},on:{change:function(e){t.selected[2]=null}},model:{value:t.selected[1],callback:function(e){t.$set(t.selected,1,e)},expression:"selected[1]"}})],1)],1),t._v(" "),n("b-row",{staticClass:"mt-3",attrs:{align:"center"}},[n("b-col",[n("b-form-group",[n("b-form-radio-group",{staticStyle:{width:"100%",color:"red"},attrs:{id:"btn-radios-2",options:t.optionsR,buttons:"","button-variant":t.color[t.selected[2]],size:"lg",name:"radio-btn-outline"},on:{change:function(e){return t.changeSelected("grade")}},model:{value:t.selected[2],callback:function(e){t.$set(t.selected,2,e)},expression:"selected[2]"}})],1)],1)],1)],1),t._v(" "),"p"!==t.selected[1]||t.showPictures?t._e():n("div",{attrs:{align:"center"}},[n("button",{staticClass:"buttonDiv bg-success px-3",staticStyle:{width:"100%"},on:{click:function(e){t.showPictures=!t.showPictures}}},[n("b-icon-images",{attrs:{variant:"cream","font-scale":"1.5"}}),t._v(" "),n("span",{staticClass:"text-cream"},[t._v("See all Images")])],1)]),t._v(" "),t.showPictures?n("div",{attrs:{align:"center"}},[n("button",{staticClass:"buttonDiv bg-warn px-3",staticStyle:{width:"100%"},on:{click:function(e){t.showPictures=!t.showPictures}}},[n("b-icon-images",{attrs:{variant:"cream","font-scale":"1.5"}}),t._v(" "),n("span",{staticClass:"text-cream"},[t._v("Hide Images")])],1)]):t._e(),t._v(" "),"*"===t.selected[1]?n("div",{attrs:{align:"center"}},[n("button",{staticClass:"buttonDiv bg-secondary px-3",staticStyle:{width:"100%"},on:{click:function(e){return t.showClear()}}},[n("b-icon-star-fill",{attrs:{variant:"warn","font-scale":"1.5"}}),t._v(" "),n("span",{staticClass:"text-cream"},[t._v(" Clear all stars ")])],1)]):t._e(),t._v(" "),n("transition",{attrs:{name:"board"}},[t.picture?n("DictPict",{attrs:{s3:t.s3,vocabList:t.vocabList,pictWord:t.pictWord,pictCh:t.pictCh},on:{pictureFalse:function(e){t.picture=!1}}}):t._e()],1),t._v(" "),t.showPictures?n("div",[n("b-table",{attrs:{striped:"",hover:"",items:t.pictList,fields:t.pields,filter:t.selected,"filter-function":t.filterPics,"head-variant":"dark"},scopedSlots:t._u([{key:"cell(link)",fn:function(e){return[n("h5",[t._v(" "+t._s(e.item.word)+" ")]),t._v(" "),n("h5",[t._v(" "+t._s(e.item.chinese)+" ")]),t._v(" "),n("b-img",{staticStyle:{"max-width":"100px"},attrs:{thumbnail:"",fluid:"",src:t.getImage(e.item.word,e.item.link),alt:t.pictWord}})]}},{key:"cell(def)",fn:function(e){return[n("span",{staticStyle:{color:"green"}},[t._v(" "+t._s(e.value)+" ")]),t._v(" "),n("hr"),t._v("\n       "+t._s(e.item.text)+"\n       ")]}}])})],1):n("div",{staticClass:"mb-0"},[n("b-table",{attrs:{striped:"",hover:"",items:t.tableItems,fields:t.fields,filter:t.selected,"filter-function":t.filterTable,"show-empty":"",fixed:"","head-variant":"dark"},scopedSlots:t._u([{key:"cell(english)",fn:function(e){return[n("b-row",{attrs:{"no-gutters":""}},[n("b-col",{attrs:{cols:"3"}},[e.item.Star?[n("b-icon-star-fill",{attrs:{variant:"warn"},on:{click:function(n){return t.addStar(e.value,0)}}}),t._v(" "),n("span",{staticClass:"d-lg-none"},[t._v("   "),n("br")])]:[n("b-icon-star",{on:{click:function(n){return t.addStar(e.value,1)}}}),t._v("   "),n("br",{staticClass:"d-lg-none"})],t._v(" "),n("b-icon-card-image",{attrs:{variant:t.getVariant(e.item.Picture)},on:{click:function(n){t.picture=!t.picture,t.filterPicture(e.value,e.item.Chinese)}}}),t._v("    "),n("br",{staticClass:"d-lg-none"})],2),t._v(" "),n("b-col",[1!==t.soundCount?n("span",{attrs:{id:e.value+"_en/"},on:{click:function(n){return t.playAudio(e.value,"_en/",e.item.mp3en,!0)}}},[t._v(" "+t._s(e.value)+" "),n("br"),t._v(" ("+t._s(e.item.Gr)+") ")]):n("span",{attrs:{align:"center"}},[n("b-icon-soundwave",{staticClass:"text-prime",attrs:{"font-scale":"1.5",id:e.value+"_en/"},on:{click:function(n){return t.playAudio(e.value,"_en/",e.item.mp3en,!1)}}})],1)])],1)]}},{key:"cell(chineseext)",fn:function(e){return[n("b-row",[n("b-col",[2!==t.soundCount?n("span",{attrs:{id:e.item.English+"_ch/"},on:{click:function(n){return t.playAudio(e.item.English,"_ch/",e.item.mp3ch,!0)}}},[t._v(" "+t._s(e.value)+" ")]):n("span",{attrs:{align:"center"}},[n("b-icon-soundwave",{staticClass:"text-prime",attrs:{"font-scale":"1.5",id:e.item.English+"_ch/"},on:{click:function(n){return t.playAudio(e.item.English,"_ch/",e.item.mp3ch,!1)}}})],1),t._v(" "),"new"===e.item.Origin?n("b-icon-trash-fill",{staticStyle:{float:"right"},attrs:{variant:"info"},on:{click:function(n){return t.addWord(e.item.English,0)}}}):t._e(),t._v(" "),n("br",{staticClass:"d-lg-none"})],1)],1)]}}],null,!1,4249928876),model:{value:t.visibleRows,callback:function(e){t.visibleRows=e},expression:"visibleRows"}})],1),t._v(" "),n("transition",{attrs:{name:"board"}},[!1===t.addWait&&t.visibleRows.length<5&&null!==t.selected[0]&&t.selected[0].length>1&&!t.visibleRows.find(function(e){return e.English===t.selected[0]})&&null===t.selected[1]&&"g"===t.vocabList[0]?n("div",{staticClass:"bg-third p-2"},[n("b-form",{on:{submit:t.onAdd}},[n("b-input-group",{staticClass:"my-2 p-6"},[n("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[n("b-icon",{attrs:{icon:"hash"}})],1),t._v(" "),n("b-form-input",{attrs:{disabled:""},model:{value:t.selected[0],callback:function(e){t.$set(t.selected,0,e)},expression:"selected[0]"}})],1),t._v(" "),n("b-input-group",{staticClass:"my-2 p-6",attrs:{label:"Chinese","label-for":"exampleInput2"}},[n("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[n("b-icon",{attrs:{icon:"filter-left"}})],1),t._v(" "),n("b-form-textarea",{attrs:{placeholder:"Add Chinese",rows:"2"},model:{value:t.wordDetails.defch1,callback:function(e){t.$set(t.wordDetails,"defch1",e)},expression:"wordDetails.defch1"}})],1),t._v(" "),n("b-row",[n("b-col",{attrs:{align:"center"}},[n("b-form-select",{staticClass:"bg-grey",staticStyle:{width:"100%","overflow-y":"hidden"},attrs:{options:t.optionsG,"select-size":1},model:{value:t.wordDetails.gl,callback:function(e){t.$set(t.wordDetails,"gl",e)},expression:"wordDetails.gl"}}),t._v(" "),n("button",{staticClass:"buttonDiv bg-info px-3 mt-2",attrs:{type:"submit"}},[n("b-icon-arrow-up-circle-fill",{attrs:{variant:"cream","font-scale":"1.5"}}),t._v(" "),n("span",{staticClass:"text-cream",staticStyle:{"font-weight":"bold"}},[t._v("Add to Dictionary ")])],1)],1)],1)],1)],1):t.addWait?n("div",{staticClass:"p-3 bg-third",attrs:{align:"center"}},[n("h4",{staticClass:"text-prime"},[t._v(" Adding New Word ")]),t._v(" "),n("b-icon",{attrs:{icon:"three-dots",animation:"cylon",variant:"prime","font-scale":"6"}})],1):t._e()]),t._v(" "),n("b-modal",{ref:"alert",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Alert"}},[n("div",{staticClass:"d-block"},[n("h3",[t._v(" "+t._s(t.note)+" ")])]),t._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideAlert("alert")}}},[t._v("Close")])]),t._v(" "),n("b-modal",{ref:"clear",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Alert"}},[n("div",{staticClass:"d-block"},[n("h3",[t._v(" Are you sure you want to clear your star list? ")])]),t._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideClear("clear")}}},[t._v("Clear")]),t._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-secondary text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideClear("cancel")}}},[t._v("Cancel")])])],1)},staticRenderFns:[]};var u=n("VU/8")(l,c,!1,function(t){n("eF7V")},"data-v-1a13b882",null);e.default=u.exports},Yobk:function(t,e,n){var i=n("77Pl"),s=n("qio6"),r=n("xnc9"),o=n("ax3d")("IE_PROTO"),a=function(){},l=function(){var t,e=n("ON07")("iframe"),i=r.length;for(e.style.display="none",n("RPLV").appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),l=t.F;i--;)delete l.prototype[r[i]];return l()};t.exports=Object.create||function(t,e){var n;return null!==t?(a.prototype=i(t),n=new a,a.prototype=null,n[o]=t):n=l(),void 0===e?n:s(n,e)}},"c/Tr":function(t,e,n){t.exports={default:n("5zde"),__esModule:!0}},c2yy:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("Dd8w"),s=n.n(i),r=n("mvHQ"),o=n.n(r),a=n("0xDb"),l=n("gyMJ"),c={name:"DictPict",props:{s3:String,pictWord:String,pictCh:String,vocabList:String},data:function(){return{imageData:null,msg:"Action Complete",waiting:!1,newWord:{word:this.pictWord,text:null,def:null,chinese:this.pictCh,link:null,code:this.codeGen(),vocab:this.vocabList}}},computed:{pictGet:function(){return console.log("pictGet",this.$store.state.setRecord.dictRecord),this.$store.getters.pictGet},getPict:function(){if("add"===this.newWord.link)return"https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/add.jpg";if(this.newWord.link){var t=this.s3+this.$store.state.userProfile.userID+"/"+this.newWord.vocab+"/"+this.pictWord+this.newWord.link+".jpg";return console.log(t),t}return"https://vocab-lms.s3-ap-northeast-1.amazonaws.com/public/standin.png"}},methods:{showModal:function(){this.$refs.success.show()},showDelete:function(){this.$refs.delete.show()},hideModal:function(t){"success"===t?this.$refs.success.hide():"cancel"===t?(this.$refs.delete.hide(),this.msg=null):(this.$refs.delete.hide(),this.msg=null,this.deletePict(),this.$emit("pictureFalse"))},deleteAlert:function(){this.msg="Are you you sure you want to delete picture?",this.showDelete()},deletePict:function(){this.$store.dispatch("deletePict",{word:this.pictWord}),console.log(this.pictGet),this.showModal()},onSubmit:function(t){t.preventDefault()},codeGen:function(){var t=new Date,e=t.getMinutes().toString()+t.getSeconds().toString();return console.log(e),e},getText:function(t){return this.pictGet[t]?this.pictGet[t].text:""},handleFileUpload:function(){Object(a.c)(document.getElementById("file"))},saveWord:function(){var t=this;return"null"===localStorage.imageData&&null===this.newWord.link?(alert("please add image"),!1):null===this.newWord.text?(alert("please add sentence"),!1):localStorage.imageData.length<1?void t.$store.dispatch("newPicture",{newWord:o()(t.newWord)}):(this.waiting=!0,Object(l.b)({imageData:localStorage.imageData,wordData:t.newWord,userID:t.$store.state.userProfile.userID}).then(function(e){console.log("response",e.data),localStorage.imageData&&1===e.data.status&&t.$store.dispatch("newPicture",{newWord:o()(t.newWord)}),t.newWord=s()({},e.data.obj),t.waiting=!1,t.msg="New image/sentence added",t.showModal()}).catch(function(e){t.waiting=!1,t.msg="sorry, new image/sentence could not be added",t.showModal(),console.log("Error Registering: ",e)}))}},created:function(){localStorage.imageData=null,this.pictGet[this.pictWord]&&(this.newWord=this.pictGet[this.pictWord],this.newWord.code=this.codeGen())}},u={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dictpict"},[n("div",{staticClass:"bg-safe-light p-2"},[t.waiting?n("div",{attrs:{align:"center"}},[n("h4",{staticClass:"text-prime"},[t._v(" Adding Picture ")]),t._v(" "),n("b-icon",{attrs:{icon:"three-dots",animation:"cylon",variant:"prime","font-scale":"6"}})],1):n("div",[n("b-form",{on:{submit:t.onSubmit}},[n("b-row",[n("b-col",{attrs:{align:"center"}},[t.newWord.link?n("div",[n("b-img",{staticStyle:{"max-height":"200px"},attrs:{thumbnail:"",fluid:"",src:t.getPict,alt:t.pictWord}})],1):t._e(),t._v(" "),n("div",{staticStyle:{"max-width":"250px"},attrs:{align:"left"}},[n("b-form-file",{ref:"file",attrs:{accept:"image/*",placeholder:"",type:"file",id:"file"},on:{change:function(e){return t.handleFileUpload()}}})],1)]),t._v(" "),n("b-col",{attrs:{md:"7"}},[n("b-input-group",{staticClass:"my-2 p-6",attrs:{"label-for":"exampleInput2"}},[n("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[n("b-icon",{attrs:{icon:"filter-left"}})],1),t._v(" "),n("b-form-textarea",{attrs:{placeholder:"Add Definition / Synonyms",rows:"2"},model:{value:t.newWord.def,callback:function(e){t.$set(t.newWord,"def",e)},expression:"newWord.def"}})],1),t._v(" "),n("b-input-group",{staticClass:"my-2 p-6",attrs:{"label-for":"exampleInput3"}},[n("b-input-group-prepend",{attrs:{inline:"","is-text":""}},[n("b-icon",{attrs:{icon:"filter-left"}})],1),t._v(" "),n("b-form-textarea",{attrs:{placeholder:"Add Sentence",rows:"4"},model:{value:t.newWord.text,callback:function(e){t.$set(t.newWord,"text",e)},expression:"newWord.text"}})],1),t._v(" "),n("div",{staticClass:" mt-2"},[n("button",{staticClass:"buttonDiv bg-success px-3",staticStyle:{width:"120px"},on:{click:function(e){return t.saveWord()}}},[n("b-icon",{attrs:{variant:"cream","font-scale":"1.5",icon:"arrow-up"}}),n("b-icon-card-image",{attrs:{variant:"cream","font-scale":"1.5"}})],1),t._v(" "),t.newWord.link?n("button",{staticClass:"buttonDiv bg-danger px-3",staticStyle:{width:"60px",float:"right"},on:{click:function(e){return t.deleteAlert()}}},[n("b-icon",{attrs:{variant:"cream","font-scale":"1.5",icon:"trash-fill"}})],1):t._e()])],1)],1)],1)],1)]),t._v(" "),n("b-modal",{ref:"success",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Image Adder"}},[n("div",{staticClass:"d-block"},[n("h3",[t._v(" "+t._s(t.msg)+" ")])]),t._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-warn text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("success")}}},[t._v("Close")])]),t._v(" "),n("b-modal",{ref:"delete",attrs:{"hide-header-close":"","no-close-on-esc":"","no-close-on-backdrop":"",align:"center","hide-footer":"",title:"Delete Picture"}},[n("div",{staticClass:"d-block"},[n("h3",[t._v(" "+t._s(t.msg)+" ")])]),t._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-grey text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("cancel")}}},[t._v("Cancel")]),t._v(" "),n("button",{staticClass:"buttonDiv mt-3 bg-alert text-cream",staticStyle:{width:"60%"},on:{click:function(e){return t.hideModal("delete")}}},[t._v("Delete")])])],1)},staticRenderFns:[]};var d=n("VU/8")(c,u,!1,function(t){n("IkJW")},"data-v-31e819b9",null);e.default=d.exports},dSzd:function(t,e,n){var i=n("e8AB")("wks"),s=n("3Eo+"),r=n("7KvD").Symbol,o="function"==typeof r;(t.exports=function(t){return i[t]||(i[t]=o&&r[t]||(o?r:s)("Symbol."+t))}).store=i},dY0y:function(t,e,n){var i=n("dSzd")("iterator"),s=!1;try{var r=[7][i]();r.return=function(){s=!0},Array.from(r,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!s)return!1;var n=!1;try{var r=[7],o=r[i]();o.next=function(){return{done:n=!0}},r[i]=function(){return o},t(r)}catch(t){}return n}},e6n0:function(t,e,n){var i=n("evD5").f,s=n("D2L2"),r=n("dSzd")("toStringTag");t.exports=function(t,e,n){t&&!s(t=n?t:t.prototype,r)&&i(t,r,{configurable:!0,value:e})}},eF7V:function(t,e){},fBQ2:function(t,e,n){"use strict";var i=n("evD5"),s=n("X8DO");t.exports=function(t,e,n){e in t?i.f(t,e,s(0,n)):t[e]=n}},h65t:function(t,e,n){var i=n("UuGF"),s=n("52gC");t.exports=function(t){return function(e,n){var r,o,a=String(s(e)),l=i(n),c=a.length;return l<0||l>=c?t?"":void 0:(r=a.charCodeAt(l))<55296||r>56319||l+1===c||(o=a.charCodeAt(l+1))<56320||o>57343?t?a.charAt(l):r:t?a.slice(l,l+2):o-56320+(r-55296<<10)+65536}}},msXi:function(t,e,n){var i=n("77Pl");t.exports=function(t,e,n,s){try{return s?e(i(n)[0],n[1]):e(n)}catch(e){var r=t.return;throw void 0!==r&&i(r.call(t)),e}}},qio6:function(t,e,n){var i=n("evD5"),s=n("77Pl"),r=n("lktj");t.exports=n("+E39")?Object.defineProperties:function(t,e){s(t);for(var n,o=r(e),a=o.length,l=0;a>l;)i.f(t,n=o[l++],e[n]);return t}},qyJz:function(t,e,n){"use strict";var i=n("+ZMJ"),s=n("kM2E"),r=n("sB3e"),o=n("msXi"),a=n("Mhyx"),l=n("QRG4"),c=n("fBQ2"),u=n("3fs2");s(s.S+s.F*!n("dY0y")(function(t){Array.from(t)}),"Array",{from:function(t){var e,n,s,d,f=r(t),h="function"==typeof this?this:Array,v=arguments.length,p=v>1?arguments[1]:void 0,b=void 0!==p,g=0,m=u(f);if(b&&(p=i(p,v>2?arguments[2]:void 0,2)),void 0==m||h==Array&&a(m))for(n=new h(e=l(f.length));e>g;g++)c(n,g,b?p(f[g],g):f[g]);else for(d=m.call(f),n=new h;!(s=d.next()).done;g++)c(n,g,b?o(d,p,[s.value,g],!0):s.value);return n.length=g,n}})},"vIB/":function(t,e,n){"use strict";var i=n("O4g8"),s=n("kM2E"),r=n("880/"),o=n("hJx8"),a=n("/bQp"),l=n("94VQ"),c=n("e6n0"),u=n("PzxK"),d=n("dSzd")("iterator"),f=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,v,p,b,g){l(n,e,v);var m,w,x,y=function(t){if(!f&&t in k)return k[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},_=e+" Iterator",C="values"==p,S=!1,k=t.prototype,D=k[d]||k["@@iterator"]||p&&k[p],A=D||y(p),P=p?C?y("entries"):A:void 0,W="Array"==e&&k.entries||D;if(W&&(x=u(W.call(new t)))!==Object.prototype&&x.next&&(c(x,_,!0),i||"function"==typeof x[d]||o(x,d,h)),C&&D&&"values"!==D.name&&(S=!0,A=function(){return D.call(this)}),i&&!g||!f&&!S&&k[d]||o(k,d,A),a[e]=A,a[_]=h,p)if(m={values:C?A:y("values"),keys:b?A:y("keys"),entries:P},g)for(w in m)w in k||r(k,w,m[w]);else s(s.P+s.F*(f||S),e,m);return m}},zQR9:function(t,e,n){"use strict";var i=n("h65t")(!0);n("vIB/")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=i(e,n),this._i+=t.length,{value:t,done:!1})})}});
//# sourceMappingURL=1.1dcf85ea8f599b2baf15.js.map