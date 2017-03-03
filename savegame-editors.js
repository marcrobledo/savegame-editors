/*
	HTML5 Savegame Editor v20170228
	by Marc Robledo 2016-2017
*/

var EDITORS=[
	'hyrule-warriors',
	'kid-icarus-uprising',
	'picross-3d-round-2',
	'pokemon-picross',
	'pokemon-shuffle',
	'rhythm-paradise-megamix',
	'streetpass-mii-plaza'
];

/* LIBRARIES */
/* MarcBinFile.js by Marc */
function MarcBinFile(e,t){if("function"!=typeof window.FileReader)throw console.error("MarcBinFile.js: Browser doesn't support FileReader."),"Invalid browser";if("object"==typeof e&&e.name&&e.size)this.file=e,this.fileName=this.file.name,this.fileSize=this.file.size,this.fileType=e.type;else if("object"==typeof e&&e.files){if(1!=e.files.length){for(var i=[],n=e.files.length,r=function(){n--,0==n&&t&&t.call()},a=0;a<e.files.length;a++)i.push(new MarcBinFile(e.files[a],r));return i}this.file=e.files[0],this.fileName=this.file.name,this.fileSize=this.file.size,this.fileType=this.file.type}else{if("number"!=typeof e)throw console.error("MarcBinFile.js: Invalid type of file."),"Invalid file.";this.file=!1,this.fileName="newfile.hex",this.fileSize=e,this.fileType="application/octet-stream"}this.littleEndian=function(){var e=new ArrayBuffer(2);return new DataView(e).setInt16(0,256,!0),256===new Int16Array(e)[0]}(),this.file?(this.fileReader=new FileReader,this.fileReader.addEventListener("load",function(){this.dataView=new DataView(this.result)},!1),t&&this.fileReader.addEventListener("load",t,!1),this.fileReader.readAsArrayBuffer(this.file)):(this.fileReader=new ArrayBuffer(this.fileSize),this.fileReader.dataView=new DataView(this.fileReader),t&&t.call())}var saveAs=saveAs||function(e){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var t=e.document,i=function(){return e.URL||e.webkitURL||e},n=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in n,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},o=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),l=e.webkitRequestFileSystem,f=e.requestFileSystem||l||e.mozRequestFileSystem,s=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},d="application/octet-stream",c=0,u=500,h=function(t){var n=function(){"string"==typeof t?i().revokeObjectURL(t):t.remove()};e.chrome?n():setTimeout(n,u)},p=function(e,t,i){t=[].concat(t);for(var n=t.length;n--;){var r=e["on"+t[n]];if("function"==typeof r)try{r.call(e,i||e)}catch(a){s(a)}}},w=function(e){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e},y=function(t,s,u){u||(t=w(t));var y,v,R,B=this,F=t.type,g=!1,S=function(){p(B,"writestart progress write writeend".split(" "))},m=function(){if(v&&o&&"undefined"!=typeof FileReader){var n=new FileReader;return n.onloadend=function(){var e=n.result;v.location.href="data:attachment/file"+e.slice(e.search(/[,;]/)),B.readyState=B.DONE,S()},n.readAsDataURL(t),void(B.readyState=B.INIT)}if((g||!y)&&(y=i().createObjectURL(t)),v)v.location.href=y;else{var r=e.open(y,"_blank");void 0==r&&o&&(e.location.href=y)}B.readyState=B.DONE,S(),h(y)},E=function(e){return function(){return B.readyState!==B.DONE?e.apply(this,arguments):void 0}},M={create:!0,exclusive:!1};return B.readyState=B.INIT,s||(s="download"),r?(y=i().createObjectURL(t),void setTimeout(function(){n.href=y,n.download=s,a(n),S(),h(y),B.readyState=B.DONE})):(e.chrome&&F&&F!==d&&(R=t.slice||t.webkitSlice,t=R.call(t,0,t.size,d),g=!0),l&&"download"!==s&&(s+=".download"),(F===d||l)&&(v=e),f?(c+=t.size,void f(e.TEMPORARY,c,E(function(e){e.root.getDirectory("saved",M,E(function(e){var i=function(){e.getFile(s,M,E(function(e){e.createWriter(E(function(i){i.onwriteend=function(t){v.location.href=e.toURL(),B.readyState=B.DONE,p(B,"writeend",t),h(e)},i.onerror=function(){var e=i.error;e.code!==e.ABORT_ERR&&m()},"writestart progress write abort".split(" ").forEach(function(e){i["on"+e]=B["on"+e]}),i.write(t),B.abort=function(){i.abort(),B.readyState=B.DONE},B.readyState=B.WRITING}),m)}),m)};e.getFile(s,{create:!1},E(function(e){e.remove(),i()}),E(function(e){e.code===e.NOT_FOUND_ERR?i():m()}))}),m)}),m)):void m())},v=y.prototype,R=function(e,t,i){return new y(e,t,i)};return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,i){return i||(e=w(e)),navigator.msSaveOrOpenBlob(e,t||"download")}:(v.abort=function(){var e=this;e.readyState=e.DONE,p(e,"abort")},v.readyState=v.INIT=0,v.WRITING=1,v.DONE=2,v.error=v.onwritestart=v.onprogress=v.onwrite=v.onabort=v.onerror=v.onwriteend=null,R)}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!=define.amd&&define([],function(){return saveAs}),MarcBinFile.prototype.isReady=function(){return 2==this.fileReader.readyState},MarcBinFile.prototype.save=function(){var e=new Blob([this.fileReader.dataView],{type:this.fileType});saveAs(e,this.fileName)},MarcBinFile.prototype.getByte=function(e){return this.fileReader.dataView.getUint8(e)},MarcBinFile.prototype.getByteSigned=function(e){return this.fileReader.dataView.getInt8(e)},MarcBinFile.prototype.readByte=function(e){var t=this.fileReader.dataView.getUint8(e);return t},MarcBinFile.prototype.readByteSigned=function(e){var t=this.fileReader.dataView.getInt8(e);return t},MarcBinFile.prototype.readBytes=function(e,t){for(var i=new Array(t),n=0;t>n;n++)i[n]=this.readByte(e+n);return i},MarcBinFile.prototype.readShort=function(e){var t=this.fileReader.dataView.getUint16(e,this.littleEndian);return t},MarcBinFile.prototype.readShortSigned=function(e){var t=this.fileReader.dataView.getInt16(e,this.littleEndian);return t},MarcBinFile.prototype.readInt=function(e){var t=this.fileReader.dataView.getUint32(e,this.littleEndian);return t},MarcBinFile.prototype.readIntSigned=function(e){var t=this.fileReader.dataView.getInt32(e,this.littleEndian);return t},MarcBinFile.prototype.readFloat32=function(e){var t=this.fileReader.dataView.getFloat32(e,this.littleEndian);return t},MarcBinFile.prototype.readFloat64=function(e){var t=this.fileReader.dataView.getFloat64(e,this.littleEndian);return t},MarcBinFile.prototype.readString=function(e){for(var t=this.readBytes(e),i="",n=0;e>n&&t[n]>0;n++)i+=String.fromCharCode(t[n]);return i},MarcBinFile.prototype.writeByte=function(e,t){this.fileReader.dataView.setUint8(e,t,this.littleEndian)},MarcBinFile.prototype.writeByteSigned=function(e,t){this.fileReader.dataView.setInt8(e,t,this.littleEndian)},MarcBinFile.prototype.writeBytes=function(e,t){for(var i=0;i<t.length;i++)this.writeByte(e+i,t[i])},MarcBinFile.prototype.writeShort=function(e,t){this.fileReader.dataView.setUint16(e,t,this.littleEndian)},MarcBinFile.prototype.writeShortSigned=function(e,t){this.fileReader.dataView.setInt16(e,t,this.littleEndian)},MarcBinFile.prototype.writeInt=function(e,t){this.fileReader.dataView.setUint32(e,t,this.littleEndian)},MarcBinFile.prototype.writeIntSigned=function(e,t){this.fileReader.dataView.setInt32(e,t,this.littleEndian)},MarcBinFile.prototype.writeFloat32=function(e,t){this.fileReader.dataView.setFloat32(e,t,this.littleEndian)},MarcBinFile.prototype.writeFloat64=function(e,t){this.fileReader.dataView.setFloat64(e,t,this.littleEndian)},MarcBinFile.prototype.writeString=function(e,t,i){for(var n=0;i>n;n++)this.writeByte(e+n,0);for(var n=0;n<t.length&&i>t;n++)this.writeByte(e+n,t.charCodeAt(0))},window.addEventListener("load",function(){},!0);
/* MarcDialogs.js */
MarcDialogs=function(){function e(e,t,n){a?e.attachEvent("on"+t,n):e.addEventListener(t,n,!1)}function t(){s&&(o?history.go(-1):(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null))}function n(e){for(var t=0;t<s.dialogElements.length;t++){var n=s.dialogElements[t];if("INPUT"===n.nodeName&&"hidden"!==n.type||"INPUT"!==n.nodeName)return n.focus(),!0}return!1}function l(){s&&(s.style.marginLeft="-"+s.offsetWidth/2+"px",s.style.marginTop="-"+s.offsetHeight/2-30+"px")}var a=/MSIE 8/.test(navigator.userAgent),o=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)&&"function"==typeof history.pushState,i=["Cancel","Accept"],s=null,c=document.createElement("div");c.className="dialog-overlay",c.style.position="fixed",c.style.top="0",c.style.left="0",c.style.width="100%",c.style.height="100%",c.style.zIndex=8e3,e(c,"click",t),e(window,"load",function(){document.body.appendChild(c),o&&history.replaceState({myDialog:!1},null,null)}),e(window,"resize",l),o&&e(window,"popstate",function(e){e.state.myDialog?(s=e.state.myDialog,MarcDialogs.open(e.state.myDialog)):e.state.myDialog===!1&&s&&(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null)}),e(document,"keydown",function(e){s&&(27==e.keyCode?(e.preventDefault?e.preventDefault():e.returnValue=!1,t()):9==e.keyCode&&s.dialogElements[s.dialogElements.length-1]==document.activeElement&&(e.preventDefault?e.preventDefault():e.returnValue=!1,n()))});var d=null,u=null,m=null;return{open:function(e){s&&(s.className=s.className.replace(/ active/g,"")),o&&(s?history.replaceState({myDialog:e},null,null):(console.log("a"),history.pushState({myDialog:e},null,null))),c.className="dialog-overlay active",s="string"==typeof e?document.getElementById("dialog-"+e):e,s.className+=" active",s.style.position="fixed",s.style.top="50%",s.style.left="50%",s.style.zIndex=8001,s.dialogElements||(s.dialogElements=s.querySelectorAll("input,textarea,select")),n(),l(s),l(s)},close:t,alert:function(t){if(!d){d=document.createElement("div"),d.id="dialog-quick-alert",d.className="dialog",d.msg=document.createElement("div"),d.msg.style.textAlign="center",d.appendChild(d.msg),d.buttons=document.createElement("div"),d.buttons.className="buttons";var n=document.createElement("input");n.type="button",n.className="button button-accept",n.value=i[1],e(n,"click",this.close),d.buttons.appendChild(n),d.appendChild(d.buttons),document.body.appendChild(d)}d.msg.innerHTML=t,MarcDialogs.open("quick-alert")},confirm:function(t,n){if(!u){u=document.createElement("div"),u.id="dialog-quick-confirm",u.className="dialog",u.msg=document.createElement("div"),u.msg.style.textAlign="center",u.appendChild(u.msg),u.buttons=document.createElement("div"),u.buttons.className="buttons";var l=document.createElement("input");l.type="button",l.className="button button-accept",l.value=i[1],e(l,"click",function(){m()}),u.buttons.appendChild(l);var a=document.createElement("input");a.type="button",a.className="button",a.value=i[0],e(a,"click",this.close),u.buttons.appendChild(a),u.appendChild(u.buttons),document.body.appendChild(u)}m=n,u.msg.innerHTML=t,MarcDialogs.open("quick-confirm")}}}();
/* mQuery.js v20150504 - Marc Robledo 2015-2016 - http://www.marcrobledo.com/license */
function MQ(t){this.q=Marq._buildQuery(t),this._ul(),this.q[0]&&(this.style=this.q[0].style),this._isArray=!1}function m(t){return new MQ(t)}function mCreate(t,e){var r=document.createElement(t);if("object"==typeof e)for(var i in e)e.hasOwnProperty(i)&&("html"===i?r.innerHTML=e[i]:"class"===i?r.className=e[i]:i.startsWith("style")||i.startsWith("css")?r.style[i.replace(/^(style|css)(:- )?/,"")]=e[i]:r[i]=e[i]);return m(r)}var Marq=function(){var t=navigator.userAgent.match(/MSIE (\d+)/),e=t?parseInt(t[1]):!1;return Array.prototype.indexOf||(Array.prototype.indexOf=function(t){var e=this.length>>>0,r=Number(arguments[1])||0;for(r=0>r?Math.ceil(r):Math.floor(r),0>r&&(r+=e);e>r;r++)if(r in this&&this[r]===t)return r;return-1}),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),r=this,i=function(){},n=function(){return r.apply(this instanceof i&&t?this:t,e.concat(Array.prototype.slice.call(arguments)))};return i.prototype=this.prototype,n.prototype=new i,n}),String.prototype.toCamel||(String.prototype.toCamel=function(){return this.replace(/(?:^\w|[A-Z]|\b\w)/g,function(t,e){return 0==e?t.toLowerCase():t.toUpperCase()}).replace(/\s|-+/g,"")}),{isCompatible:document.querySelectorAll,isIE:e,isMobile:/(Mobi|Android|WiiU|3DS|Playstation Vita)/.test(navigator.userAgent),_buildQuery:function(t){if("string"==typeof t){if(/^#[\w\-]+$/.test(t)){var e;return(e=document.getElementById(t.replace("#","")))?[e]:[]}return/^\w+$/.test(t)?document.getElementsByTagName(t):document.querySelectorAll(t)}return t.q?t.q:t.length?t:[t]},_forceToArray:function(t){if(8===e){for(var r=[],i=0;i<t.length;i++)r.push(t[i]);return r}return Array.prototype.slice.call(t)},_getBlockType:function(t){return"LI"===t.nodeName?"list-item":"TABLE"===t.nodeName?"table":"TR"===t.nodeName?"table-row":"TD"===t.nodeName?"table-cell":"block"},_getCSSNumVal:function(t,e){var r;return t.style[e]?r=t.style[e]:t.currentStyle?r=t.currentStyle[e]:document.defaultView&&document.defaultView.getComputedStyle?(s=document.defaultView.getComputedStyle(t,""),r=s&&s.getPropertyValue(e.toCamel())):r=0,r=parseInt(r.replace(/[^\d\-\.]/g,"")),r||(r=0),r},_hasClass:function(t,e){return t.className&&t.className.split(/ +/).indexOf(e)>=0},setOpacity:function(t,r){8===e?t.style.filter="alpha(opacity="+parseInt(100*r)+")":t.style.opacity=r},preventDefault:function(t){t.preventDefault?t.preventDefault():t.returnValue=!1},stopPropagation:function(t){"undefined"!=typeof t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},setWarnOnLeaving:function(t){t?window.onbeforeunload=function(t){return t=t||window.event,t&&(t.returnValue=!0),!0}:window.onbeforeunload=null},currentTarget:function(t){return t.currentTarget?t.currentTarget:t.srcElement}}}();MQ.prototype._ta=function(){this._isArray||(this.q=Marq._forceToArray(this.q),this._isArray=!0)},MQ.prototype._ul=function(){this.length=this.q.length},MQ.prototype.get=function(t){return 0==this.q.length?null:"undefined"!=typeof t?this.q[t]:this.q[0]},MQ.prototype.getAll=function(t){return this._ta(),this.q},MQ.prototype.first=function(){return this.q=[this.q[0]],this.length=1,this._isArray=!0,this},MQ.prototype.last=function(){return this.q=[this.q[this.q.length-1]],this.length=1,this._isArray=!0,this},MQ.prototype.eq=function(t){return this.q=[this.q[t]],this.length=1,this._isArray=!0,this},MQ.prototype.gt=function(t){return this._ta(),this.q=this.q.slice(t+1),this._ul(),this},MQ.prototype.lt=function(t){return this._ta(),this.q=this.q.slice(0,t),this._ul(),this},MQ.prototype.slice=function(t,e){return this._ta(),this.q=this.q.splice(t,e),this._ul(),this},MQ.prototype.children=function(){for(var t=[],e=0;e<this.q.length;e++)t=t.concat(Marq._forceToArray(this.q[e].children));return this.q=t,this._ul(),this._isArray=!0,this},MQ.prototype.find=function(t){for(var e=[],r=0;r<this.q.length;r++)e=e.concat(Marq._forceToArray(this.q[r].querySelectorAll(t)));return this.q=e,this._ul(),this._isArray=!0,this},MQ.prototype.add=function(t){return this._ta(),this.q=this.q.concat(Marq._forceToArray(Marq._buildQuery(t))),this._ul(),this},MQ.prototype.append=function(t){for(var e=Marq._buildQuery(t),r=0;r<e.length;r++)e[r].parentElement&&e[r].parentElement.removeChild(e[r]),this.q[0].appendChild(e[r]);return this},MQ.prototype.appendTo=function(t){for(var e=Marq._buildQuery(t),r=0;r<this.q.length;r++)this.q[r].parentElement&&this.q[r].parentElement.removeChild(this.q[r]),e[0].appendChild(this.q[r]);return this},MQ.prototype.prepend=function(t){for(var e=Marq._buildQuery(t),r=0;r<e.length;r++)e[r].parentElement&&e[r].parentElement.removeChild(e[r]),this.q[0].insertBefore(e[r],this.q[0].children[0]);return this},MQ.prototype.prependTo=function(t){for(var e=Marq._buildQuery(t),r=0;r<this.q.length;r++)this.q[r].parentElement&&this.q[r].parentElement.removeChild(this.q[r]),e[0].insertBefore(this.q[r],e[0].children[0]);return this},MQ.prototype.empty=function(){for(var t=0;t<this.q.length;t++)for(;this.q[t].firstChild;)this.q[t].removeChild(this.q[t].firstChild);return this},MQ.prototype.remove=function(t){if("string"==typeof t)for(var e=0;e<this.q.length;e++)for(var r=this.q[e].querySelectorAll(t),i=0;i<r.length;i++)this.q[e].removeChild(r[i]);else for(var e=0;e<this.q.length;e++)this.q[e].parentElement.removeChild(this.q[e]);return this},MQ.prototype.info=function(t){var e=this.q[0].offsetWidth,r=this.q[0].offsetHeight;return t&&(e+=Marq._getCSSNumVal(this.q[0],"borderLeftWidth")+Marq._getCSSNumVal(this.q[0],"borderRightWidth"),r+=Marq._getCSSNumVal(this.q[0],"borderTopWidth")+Marq._getCSSNumVal(this.q[0],"borderBottomWidth")),{width:e,height:r,offsetTop:Math.round(this.q[0].getBoundingClientRect().top),offsetLeft:Math.round(this.q[0].getBoundingClientRect().left),positionTop:this.q[0].offsetTop,positionLeft:this.q[0].offsetLeft}},MQ.prototype.addEvent=function(t,e,r){for(var i=0;i<this.q.length;i++){var n;n=r?e.bind(this.q[i]):e,8===Marq.isIE?this.q[i].attachEvent("on"+t,n):this.q[i].addEventListener(t,n,!1)}return this},MQ.prototype.removeEvent=function(t,e){for(var r=0;r<this.q.length;r++)8===Marq.isIE?this.q[r].detachEvent("on"+t,e):this.q[r].removeEventListener(t,e);return this},MQ.prototype.show=function(){for(var t=0;t<this.q.length;t++)this.q[t].style.display=Marq._getBlockType(this.q[t]);return this},MQ.prototype.hide=function(){for(var t=0;t<this.q.length;t++)this.q[t].style.display="none";return this},MQ.prototype.toggle=function(){for(var t=0;t<this.q.length;t++)this.q[t].style.display!==Marq._getBlockType(this.q[t])?this.q[t].style.display=Marq._getBlockType(this.q[t]):this.q[t].style.display="none";return this},MQ.prototype.html=function(t){if(void 0===t)return this.q[0].innerHTML;for(var e=0;e<this.q.length;e++)this.q[e].innerHTML=t;return this},MQ.prototype.css=function(t,e){if(void 0===e)return this.q[0].style[t];t=t.toCamel();for(var r=0;r<this.q.length;r++)this.q[r].style[t]=e;return this},MQ.prototype.hasClass=function(t){for(var e=0;e<this.q.length;e++)if(Marq._hasClass(this.q[e],t))return!0;return!1},MQ.prototype.addClass=function(t){for(var e=t.replace(/^ +| +$/g,"").split(/ +/),r=0;r<this.q.length;r++)for(var i=0;i<e.length;i++)this.q[r].className?Marq._hasClass(this.q[r],e[i])||(this.q[r].className+=" "+e[i]):this.q[r].className=e[i];return this},MQ.prototype.removeClass=function(t){for(var e=/^ +| +$/g,r=t.replace(e,"").split(/ +/),i=0;i<r.length;i++)r[i]="^"+r[i]+"$|^"+r[i]+" +| +"+r[i]+" +| +"+r[i]+"$";for(var n=new RegExp(r.join("|"),"g"),i=0;i<this.q.length;i++)this.q[i].className&&(this.q[i].className=this.q[i].className.replace(n," ").replace(e,""));return this},MQ.prototype.toggleClass=function(t){for(var e=/^ +| +$/g,r=t.replace(e,"").split(/ +/),i=new Array(r.length),n=0;n<r.length;n++)i[n]="^"+r[n]+"$|^"+r[n]+" +| +"+r[n]+" +| +"+r[n]+"$";for(var s=new RegExp(i.join("|"),"g"),n=0;n<this.q.length;n++)for(var o=0;o<r.length;o++)this.q[n].className?Marq._hasClass(this.q[n],r[o])?this.q[n].className=this.q[n].className.replace(s," ").replace(e,""):this.q[n].className+=" "+r[o]:this.q[n].className=r[o]};

/* savegame load/save */
var tempFile;
function _tempFileLoadFunction(){
	SavegameEditor=null;
	for(g in SavegameEditors){
		if(SavegameEditors[g].checkValidSavegame()){
			SavegameEditor=SavegameEditors[g];
			m('#'+g+'Editor').removeClass('hidden');
			break;
		}
	}
	if(SavegameEditor){
		SavegameEditor.load();
		m('#card-warning').hide();
		m('#card-home').hide();
		m('#card-savechanges').removeClass('hidden');
		m('#savegame-name').html(SavegameEditor.Name);

		m('.editor').show();
	}else{
		MarcDialogs.alert('Invalid file.');
	}
}

function loadSavegameFromInput(input){
	tempFile=new MarcBinFile(input.files[0], _tempFileLoadFunction);
}
function saveSavegame(){
	SavegameEditor.save();
	tempFile.save();
}




/* initialize */
var SavegameEditors={},pendingEditors;
var _isReady=function(){
	pendingEditors--;
	if(pendingEditors==0){
		m('#loading-message').remove();
		m('#file-loader').show();
	}
}
m(window).addEvent('load',function(){
	pendingEditors=EDITORS.length;

	var head=document.getElementsByTagName('head')[0];

	for(var i=0; i<EDITORS.length; i++){
		var script=document.createElement('script');
		script.type='text/javascript';
		script.src='./editors/'+EDITORS[i]+'.js';

		script.onreadystatechange=_isReady;
		script.onload=_isReady;

		head.appendChild(script);

		m('#thumb-'+EDITORS[i]).append(mCreate('img',{src:'./editors/'+EDITORS[i]+'.jpg'}));
	}
});



/* binary helpers */
function compareBytes(offset,a2){
	var a1=tempFile.readBytes(offset, a2.length);

	for(var i=0;i<a1.length;i++)
		if(a1[i]!=a2[i])
			return false;
	return true
}



/* DOM manipulation */
var COL_SIZES=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve']
function intToHex(i){var s=i.toString(16);while(s.length%2!=0)s='0'+s;return '0x'+s}
function row(sizes){var mRow=mCreate('div',{class:'row'});for(var i=0;i<sizes.length;i++)mRow.append(mCreate('div',{class:COL_SIZES[sizes[i]-1]+' columns'}).append(arguments[i+1]));return mRow}
function col(size,inner){return mCreate('div',{class:COL_SIZES[size-1]+' columns'}).append(inner)}
function span(text){return mCreate('span',{html:text})}
function label(id,text){return mCreate('label',{htmlFor:id,html:text})}

function select(id,a,start){
	var add=0;
	if(start)
		add+=start;
	var s=mCreate('select',{id:'select-'+id});
	for(var i=0; i<a.length; i++){
		if(/^\d+=/.test(a[i])){
			var strs=a[i].match(/^(\d+)=(.+)/);
			s.append(mCreate('option', {value:strs[1], html:strs[2]}));			
		}else{
			s.append(mCreate('option', {value:i+add, html:a[i]}));
		}
	}
	return s
}

function genRange(min,max){var a=[];for(var i=min;i<=max;i++)a.push(i);return a}



function inputNumber(id,min,max,val){
	var input=mCreate('input', {id:'input-'+id, type:'number', min:min, max:max, value:val});
	var cleanNumber=function(){getInputNumber(id, min, max)};
	input.addEvent('keyup', cleanNumber).addEvent('change', cleanNumber);
	return input;
}
function inputFloat(id,min,max,val){
	var input=mCreate('input', {id:'input-'+id, type:'number', min:min, max:max, step:0.1, value:val});
	return input;
}



function getSelect(s){return document.getElementById('select-'+s).value}
function getInputNumber(i, min, max){
	var input=m('#input-'+i).get();

	input.value=input.value.replace(/[^\d]/g,'');

	if(!input.value || input.value < min){
		input.value=min;
	}else if(input.value > max){
		input.value=max;
	}
	return parseInt(input.value);
}
function getInputFloat(i, min, max){
	var input=m('#input-'+i).get();

	input.value=input.value.replace(/[^\d\,\.]/g,'');

	var realFloat=parseFloat(input.value.replace(/,/g,'.'));
	
	if(!realFloat || realFloat < min){
		input.value=min;
	}else if(realFloat > max){
		input.value=max;
	}
	return realFloat;
}


function updateInput(i,val){
	document.getElementById('input-'+i).value=val;
}
