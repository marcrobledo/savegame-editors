/*
	HTML5 Savegame Editor v20170416
	by Marc Robledo 2016-2017
*/

var EDITORS=[
	{id:'hyrule-warriors', isValid:function(){return tempFile.fileSize===3145728}},
	{id:'zelda-botw', isValid:function(){return tempFile.fileSize===897160 || tempFile.fileSize===896976 || tempFile.fileSize===897112}},
	{id:'kid-icarus-uprising', isValid:function(){return tempFile.fileSize===66296}},
	{id:'picross-3d-round-2', isValid:function(){return tempFile.fileSize===45688}},
	{id:'pokemon-picross', isValid:function(){return tempFile.fileSize===14920}},
	{id:'pokemon-shuffle', isValid:function(){return (tempFile.fileSize===42039 || tempFile.fileSize===74807)}},
	{id:'rhythm-paradise-megamix', isValid:function(){return tempFile.fileSize===30040}},
	{id:'streetpass-mii-plaza', isValid:function(){return tempFile.fileSize===393216}},
	{id:'team-kirby-clash-dx', isValid:function(){return tempFile.fileSize===8464}}
];

/* LIBRARIES */
/* MarcBinFile.js by Marc */
function MarcBinFile(a,b){if("function"!=typeof window.FileReader)throw console.error("MarcBinFile.js: Browser doesn't support FileReader."),"Invalid browser";if("object"==typeof a&&a.name&&a.size)this.file=a,this.fileName=this.file.name,this.fileSize=this.file.size,this.fileType=a.type;else if("object"==typeof a&&a.files){if(1!=a.files.length){for(var c=[],d=a.files.length,e=function(){d--,0==d&&b&&b.call()},f=0;f<a.files.length;f++)c.push(new MarcBinFile(a.files[f],e));return c}this.file=a.files[0],this.fileName=this.file.name,this.fileSize=this.file.size,this.fileType=this.file.type}else{if("number"!=typeof a)throw console.error("MarcBinFile.js: Invalid type of file."),"Invalid file.";this.file=!1,this.fileName="newfile.hex",this.fileSize=a,this.fileType="application/octet-stream"}this.littleEndian=function(){var a=new ArrayBuffer(2);return new DataView(a).setInt16(0,256,!0),256===new Int16Array(a)[0]}(),this.file?(this.fileReader=new FileReader,this.fileReader.addEventListener("load",function(){this.dataView=new DataView(this.result)},!1),b&&this.fileReader.addEventListener("load",b,!1),this.fileReader.readAsArrayBuffer(this.file)):(this.fileReader=new ArrayBuffer(this.fileSize),this.fileReader.dataView=new DataView(this.fileReader),b&&b.call())}MarcBinFile.prototype.isReady=function(){return 2==this.fileReader.readyState},MarcBinFile.prototype.save=function(){var a=new Blob([this.fileReader.dataView],{type:this.fileType});saveAs(a,this.fileName)},MarcBinFile.prototype.readByte=function(a){return this.fileReader.dataView.getUint8(a)},MarcBinFile.prototype.readByteSigned=function(a){return this.fileReader.dataView.getInt8(a)},MarcBinFile.prototype.readBytes=function(a,b){for(var c=new Array(b),d=0;d<b;d++)c[d]=this.readByte(a+d);return c},MarcBinFile.prototype.readShort=function(a){return this.fileReader.dataView.getUint16(a,this.littleEndian)},MarcBinFile.prototype.readShortSigned=function(a){return this.fileReader.dataView.getInt16(a,this.littleEndian)},MarcBinFile.prototype.readInt=function(a){return this.fileReader.dataView.getUint32(a,this.littleEndian)},MarcBinFile.prototype.readIntSigned=function(a){return this.fileReader.dataView.getInt32(a,this.littleEndian)},MarcBinFile.prototype.readFloat32=function(a){return this.fileReader.dataView.getFloat32(a,this.littleEndian)},MarcBinFile.prototype.readFloat64=function(a){return this.fileReader.dataView.getFloat64(a,this.littleEndian)},MarcBinFile.prototype.readString=function(a,b){for(var c=this.readBytes(a,b),d="",e=0;e<b&&c[e]>0;e++)d+=String.fromCharCode(c[e]);return d},MarcBinFile.prototype.writeByte=function(a,b){this.fileReader.dataView.setUint8(a,b,this.littleEndian)},MarcBinFile.prototype.writeByteSigned=function(a,b){this.fileReader.dataView.setInt8(a,b,this.littleEndian)},MarcBinFile.prototype.writeBytes=function(a,b){for(var c=0;c<b.length;c++)this.writeByte(a+c,b[c])},MarcBinFile.prototype.writeShort=function(a,b){this.fileReader.dataView.setUint16(a,b,this.littleEndian)},MarcBinFile.prototype.writeShortSigned=function(a,b){this.fileReader.dataView.setInt16(a,b,this.littleEndian)},MarcBinFile.prototype.writeInt=function(a,b){this.fileReader.dataView.setUint32(a,b,this.littleEndian)},MarcBinFile.prototype.writeIntSigned=function(a,b){this.fileReader.dataView.setInt32(a,b,this.littleEndian)},MarcBinFile.prototype.writeFloat32=function(a,b){this.fileReader.dataView.setFloat32(a,b,this.littleEndian)},MarcBinFile.prototype.writeFloat64=function(a,b){this.fileReader.dataView.setFloat64(a,b,this.littleEndian)},MarcBinFile.prototype.writeString=function(a,b,c){for(var d=0;d<c;d++)this.writeByte(a+d,0);for(var d=0;d<b.length&&d<c;d++)this.writeByte(a+d,b.charCodeAt(d))};
/* FileSaver.js by eligrey - https://github.com/eligrey/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
/* MarcDialogs.js */
MarcDialogs=function(){function e(e,t,n){a?e.attachEvent("on"+t,n):e.addEventListener(t,n,!1)}function t(){s&&(o?history.go(-1):(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null))}function n(e){for(var t=0;t<s.dialogElements.length;t++){var n=s.dialogElements[t];if("INPUT"===n.nodeName&&"hidden"!==n.type||"INPUT"!==n.nodeName)return n.focus(),!0}return!1}function l(){s&&(s.style.marginLeft="-"+s.offsetWidth/2+"px",s.style.marginTop="-"+s.offsetHeight/2-30+"px")}var a=/MSIE 8/.test(navigator.userAgent),o=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)&&"function"==typeof history.pushState,i=["Cancel","Accept"],s=null,c=document.createElement("div");c.className="dialog-overlay",c.style.position="fixed",c.style.top="0",c.style.left="0",c.style.width="100%",c.style.height="100%",c.style.zIndex=8e3,e(c,"click",t),e(window,"load",function(){document.body.appendChild(c),o&&history.replaceState({myDialog:!1},null,null)}),e(window,"resize",l),o&&e(window,"popstate",function(e){e.state.myDialog?(s=e.state.myDialog,MarcDialogs.open(e.state.myDialog)):e.state.myDialog===!1&&s&&(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null)}),e(document,"keydown",function(e){s&&(27==e.keyCode?(e.preventDefault?e.preventDefault():e.returnValue=!1,t()):9==e.keyCode&&s.dialogElements[s.dialogElements.length-1]==document.activeElement&&(e.preventDefault?e.preventDefault():e.returnValue=!1,n()))});var d=null,u=null,m=null;return{open:function(e){s&&(s.className=s.className.replace(/ active/g,"")),o&&(s?history.replaceState({myDialog:e},null,null):(console.log("a"),history.pushState({myDialog:e},null,null))),c.className="dialog-overlay active",s="string"==typeof e?document.getElementById("dialog-"+e):e,s.className+=" active",s.style.position="fixed",s.style.top="50%",s.style.left="50%",s.style.zIndex=8001,s.dialogElements||(s.dialogElements=s.querySelectorAll("input,textarea,select")),n(),l(s),l(s)},close:t,alert:function(t){if(!d){d=document.createElement("div"),d.id="dialog-quick-alert",d.className="dialog",d.msg=document.createElement("div"),d.msg.style.textAlign="center",d.appendChild(d.msg),d.buttons=document.createElement("div"),d.buttons.className="buttons";var n=document.createElement("button");n.innerHTML=i[1],e(n,"click",this.close),d.buttons.appendChild(n),d.appendChild(d.buttons),document.body.appendChild(d)}d.msg.innerHTML=t,MarcDialogs.open("quick-alert")},confirm:function(t,n){if(!u){u=document.createElement("div"),u.id="dialog-quick-confirm",u.className="dialog",u.msg=document.createElement("div"),u.msg.style.textAlign="center",u.appendChild(u.msg),u.buttons=document.createElement("div"),u.buttons.className="buttons";var l=document.createElement("input");l.type="button",l.className="button button-accept",l.value=i[1],e(l,"click",function(){m()}),u.buttons.appendChild(l);var a=document.createElement("input");a.type="button",a.className="button",a.value=i[0],e(a,"click",this.close),u.buttons.appendChild(a),u.appendChild(u.buttons),document.body.appendChild(u)}m=n,u.msg.innerHTML=t,MarcDialogs.open("quick-confirm")}}}();
/* Marq.js v20170315 - Marc Robledo 2015-2017 - http://www.marcrobledo.com/license */
function MQ(a){this.q=Marq._buildQuery(a),this._ul(),this.q[0]&&(this.style=this.q[0].style),this._isArray=!1}function m(a){return new MQ(a)}function mCreate(a,b){var c=document.createElement(a);if("object"==typeof b)for(var d in b)b.hasOwnProperty(d)&&("html"===d?c.innerHTML=b[d]:"class"===d?c.className=b[d]:d.startsWith("style")||d.startsWith("css")?c.style[d.replace(/^(style|css)(:- )?/,"")]=b[d]:c[d]=b[d]);return m(c)}var Marq=function(){var a=navigator.userAgent.match(/MSIE (\d+)/),b=!!a&&parseInt(a[1]);return Array.prototype.indexOf||(Array.prototype.indexOf=function(a){var b=this.length>>>0,c=Number(arguments[1])||0;for(c=c<0?Math.ceil(c):Math.floor(c),c<0&&(c+=b);c<b;c++)if(c in this&&this[c]===a)return c;return-1}),Function.prototype.bind||(Function.prototype.bind=function(a){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var b=Array.prototype.slice.call(arguments,1),c=this,d=function(){},e=function(){return c.apply(this instanceof d&&a?this:a,b.concat(Array.prototype.slice.call(arguments)))};return d.prototype=this.prototype,e.prototype=new d,e}),String.prototype.toCamel||(String.prototype.toCamel=function(){return this.replace(/(?:^\w|[A-Z]|\b\w)/g,function(a,b){return 0==b?a.toLowerCase():a.toUpperCase()}).replace(/\s|-+/g,"")}),{isCompatible:document.querySelectorAll,isIE:b,isMobile:/(Mobi|Android|WiiU|3DS|Playstation Vita)/.test(navigator.userAgent),_buildQuery:function(a){if("string"==typeof a){if(/^#[A-Z\w\-]+$/.test(a)){var b;return(b=document.getElementById(a.replace("#","")))?[b]:[]}return/^\w+$/.test(a)?document.getElementsByTagName(a):document.querySelectorAll(a)}return a.q?a.q:a.constructor===Array?a:[a]},_forceToArray:function(a){if(8===b){for(var c=[],d=0;d<a.length;d++)c.push(a[d]);return c}return Array.prototype.slice.call(a)},_getBlockType:function(a){return"LI"===a.nodeName?"list-item":"TABLE"===a.nodeName?"table":"TR"===a.nodeName?"table-row":"TD"===a.nodeName?"table-cell":"block"},_hasClass:function(a,b){return a.className&&a.className.split(/ +/).indexOf(b)>=0},preventDefault:function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},stopPropagation:function(a){"undefined"!=typeof a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},setWarnOnLeaving:function(a){a?window.onbeforeunload=function(a){return a=a||window.event,a&&(a.returnValue=!0),!0}:window.onbeforeunload=null},currentTarget:function(a){return a.currentTarget?a.currentTarget:a.srcElement}}}();MQ.prototype._ta=function(){this._isArray||(this.q=Marq._forceToArray(this.q),this._isArray=!0)},MQ.prototype._ul=function(){this.length=this.q.length},MQ.prototype.get=function(a){return 0==this.q.length?null:"number"==typeof a?this.q[a]:this.q[0]},MQ.prototype.getAll=function(a){return this._ta(),this.q},MQ.prototype.eq=function(a){return this.q=[this.q[a]],this.length=1,this._isArray=!0,this},MQ.prototype.first=function(){return this.eq(0)},MQ.prototype.last=function(){return this.eq(this.q.length-1)},MQ.prototype.gt=function(a){return this._ta(),this.q=this.q.slice(a+1),this._ul(),this},MQ.prototype.lt=function(a){return this._ta(),this.q=this.q.slice(0,a),this._ul(),this},MQ.prototype.slice=function(a,b){return this._ta(),this.q=this.q.splice(a,b),this._ul(),this},MQ.prototype.children=function(){for(var a=[],b=0;b<this.q.length;b++)a=a.concat(Marq._forceToArray(this.q[b].children));return this.q=a,this._ul(),this._isArray=!0,this},MQ.prototype.find=function(a){for(var b=[],c=0;c<this.q.length;c++)b=b.concat(Marq._forceToArray(this.q[c].querySelectorAll(a)));return this.q=b,this._ul(),this._isArray=!0,this},MQ.prototype.add=function(a){return this._ta(),this.q=this.q.concat(Marq._forceToArray(Marq._buildQuery(a))),this._ul(),this},MQ.prototype.append=function(a){for(var b=Marq._buildQuery(a),c=0;c<b.length;c++)b[c].parentElement&&b[c].parentElement.removeChild(b[c]),this.q[0].appendChild(b[c]);return this},MQ.prototype.appendTo=function(a){for(var b=Marq._buildQuery(a),c=0;c<this.q.length;c++)this.q[c].parentElement&&this.q[c].parentElement.removeChild(this.q[c]),b[0].appendChild(this.q[c]);return this},MQ.prototype.prepend=function(a){for(var b=Marq._buildQuery(a),c=0;c<b.length;c++)b[c].parentElement&&b[c].parentElement.removeChild(b[c]),this.q[0].insertBefore(b[c],this.q[0].children[0]);return this},MQ.prototype.prependTo=function(a){for(var b=Marq._buildQuery(a),c=0;c<this.q.length;c++)this.q[c].parentElement&&this.q[c].parentElement.removeChild(this.q[c]),b[0].insertBefore(this.q[c],b[0].children[0]);return this},MQ.prototype.empty=function(){for(var a=0;a<this.q.length;a++)for(;this.q[a].firstChild;)this.q[a].removeChild(this.q[a].firstChild);return this},MQ.prototype.remove=function(a){if("string"==typeof a)for(var b=0;b<this.q.length;b++)for(var c=this.q[b].querySelectorAll(a),d=0;d<c.length;d++)this.q[b].removeChild(c[d]);else for(var b=0;b<this.q.length;b++)this.q[b].parentElement.removeChild(this.q[b]);return this},MQ.prototype.info=function(a){return this.q[0].getBoundingClientRect()},MQ.prototype.addEvent=function(a,b,c){for(var d=0;d<this.q.length;d++){var e;e=c?b.bind(this.q[d]):b,8===Marq.isIE?this.q[d].attachEvent("on"+a,e):this.q[d].addEventListener(a,e,!1)}return this},MQ.prototype.removeEvent=function(a,b){for(var c=0;c<this.q.length;c++)8===Marq.isIE?this.q[c].detachEvent("on"+a,b):this.q[c].removeEventListener(a,b);return this},MQ.prototype.show=function(){for(var a=0;a<this.q.length;a++)this.q[a].style.display=Marq._getBlockType(this.q[a]);return this},MQ.prototype.hide=function(){for(var a=0;a<this.q.length;a++)this.q[a].style.display="none";return this},MQ.prototype.toggle=function(){for(var a=0;a<this.q.length;a++)this.q[a].style.display!==Marq._getBlockType(this.q[a])?this.q[a].style.display=Marq._getBlockType(this.q[a]):this.q[a].style.display="none";return this},MQ.prototype.html=function(a){if(void 0===a)return this.q[0].innerHTML;for(var b=0;b<this.q.length;b++)this.q[b].innerHTML=a;return this},MQ.prototype.css=function(a,b){if(void 0===b)return this.q[0].style[a];a=a.toCamel();for(var c=0;c<this.q.length;c++)this.q[c].style[a]=b;return this},MQ.prototype.hasClass=function(a){for(var b=0;b<this.q.length;b++)if(Marq._hasClass(this.q[b],a))return!0;return!1},MQ.prototype.addClass=function(a){for(var b=a.replace(/^ +| +$/g,"").split(/ +/),c=0;c<this.q.length;c++)for(var d=0;d<b.length;d++)this.q[c].className?Marq._hasClass(this.q[c],b[d])||(this.q[c].className+=" "+b[d]):this.q[c].className=b[d];return this},MQ.prototype.removeClass=function(a){for(var b=/^ +| +$/g,c=a.replace(b,"").split(/ +/),d=0;d<c.length;d++)c[d]="^"+c[d]+"$|^"+c[d]+" +| +"+c[d]+" +| +"+c[d]+"$";for(var e=new RegExp(c.join("|"),"g"),d=0;d<this.q.length;d++)this.q[d].className&&(this.q[d].className=this.q[d].className.replace(e," ").replace(b,""));return this},MQ.prototype.toggleClass=function(a){for(var b=/^ +| +$/g,c=a.replace(b,"").split(/ +/),d=new Array(c.length),e=0;e<c.length;e++)d[e]="^"+c[e]+"$|^"+c[e]+" +| +"+c[e]+" +| +"+c[e]+"$";for(var f=new RegExp(d.join("|"),"g"),e=0;e<this.q.length;e++)for(var g=0;g<c.length;g++)this.q[e].className?Marq._hasClass(this.q[e],c[g])?this.q[e].className=this.q[e].className.replace(f," ").replace(b,""):this.q[e].className+=" "+c[g]:this.q[e].className=c[g]};
/* MarcStringCleaner.js v2016 - Marc Robledo 2013-2016 - http://www.marcrobledo.com/license */
MarcStringCleaner=function(){var a=[/[\xc0\xc1\xc2\xc4\xe0\xe1\xe2\xe4]/g,"a",/[\xc8\xc9\xca\xcb\xe8\xe9\xea\xeb]/g,"e",/[\xcc\xcd\xce\xcf\xec\xed\xee\xef]/g,"i",/[\xd2\xd3\xd4\xd6\xf2\xf3\xf4\xf6]/g,"o",/[\xd9\xda\xdb\xdc\xf9\xfa\xfb\xfc]/g,"u",/[\xd1\xf1]/g,"n",/[\xc7\xe7]/g,"c",/[\xc6\xe6]/g,"ae",/\x26/g,"and",/\u20ac/g,"euro",/[^\w- ]/g,"",/( |-)/g,"_",/_+/g,"_",/^_|_$/g,""];String.prototype.clean||(String.prototype.clean=function(){for(var b=this.toLowerCase(),c=0;c<a.length;c+=2)b=b.replace(a[c],a[c+1]);return b})}();

/* savegame load/save */
var tempFile,currentEditorId;
function _tempFileLoadFunction(){
	var isValid=false;
	for(var i=0; i<EDITORS.length && !isValid; i++){
		if(EDITORS[i].isValid()){
			currentEditorId=EDITORS[i].id;

			m('#card-warning').hide();
			m('#card-home').hide();
			m('#card-loading').removeClass('hidden');

			var head=document.getElementsByTagName('head')[0];
			var script=document.createElement('script');
			script.type='text/javascript';
			script.src='./editors/'+EDITORS[i].id+'.js';
			//script.onreadystatechange=_isReady;
			script.onload=_isReady;
			head.appendChild(script);

			break;
		}
	}

	if(i===EDITORS.length){
		MarcDialogs.alert('Compatible savegame not found');
	}
}

function loadSavegameFromInput(input){
	tempFile=new MarcBinFile(input.files[0], _tempFileLoadFunction);
}
function saveChanges(){
	SavegameEditor.save();
	tempFile.save();
}




/* initialize */
var _isReady=function(){
	m('#card-loading').addClass('hidden');
	m('#the-editor').show();
	m('#card-savechanges').removeClass('hidden');
	m('#savegame-name').html(SavegameEditor.Name);
	SavegameEditor.load();

	m('#editor-'+currentEditorId).removeClass('hidden');
}
m(window).addEvent('load',function(){
	for(var i=0; i<EDITORS.length; i++){
		m('#thumb-'+EDITORS[i].id).append(mCreate('img',{src:'./editors/'+EDITORS[i].id+'.jpg'}));
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
function intToHex(i){var s=i.toString(16);while(s.length%2!=0)s='0'+s;return '0x'+s}



/* DOM manipulation */
var COL_SIZES=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
function row(sizes){
	var r=document.createElement('div');
	r.className='row';
	for(var i=0;i<sizes.length;i++)
		r.appendChild(col(sizes[i], arguments[i+1]));
	return r
}
function col(size,inner){
	var c=document.createElement('div');
	c.className=COL_SIZES[size-1]+' columns';
	c.appendChild(inner);
	return c
}


var numberOfCards=0;
var CARD_COLORS=['red','green','yellow'];
function card(text){
	var card=document.createElement('div');
	var elementsStart=0;
	if(typeof text === 'string'){
		card.id='card-'+text.clean();
		var h3=document.createElement('h3');
		h3.innerHTML=text;
		card.appendChild(h3);
		elementsStart++;
	}
	card.className='card card-'+CARD_COLORS[numberOfCards%3];
	for(var i=elementsStart; i<arguments.length; i++)
		card.appendChild(arguments[i]);

	document.getElementById('the-editor').appendChild(card);
	numberOfCards++;
	return card;
}

function fixNumericFieldValueEvent(){
	fixNumericFieldValue(this);
}
function fixNumericFieldValue(field){
	var val=field.value.replace(/[^0-9\-\.]/g,'');
	if(field.id.startsWith('float-')){
		val=parseFloat(val);
	}else{
		val=parseInt(val);
	}
	

	if(isNaN(val) || val<field.minValue){
		val=field.minValue;
	}else if(val > field.maxValue){
		val=field.maxValue;
	}
	field.value=val;
}
function inputNumber(id,min,max,def){
	var input=document.createElement('input');
	input.id='number-'+id;
	input.className='full-width text-right';
	input.type='text'; /* type='number' validation breaks getting input value when it's not valid */
	input.minValue=min;
	input.maxValue=max;
	input.value=def;
	input.addEventListener('change', fixNumericFieldValueEvent, false);
	return input;
}
function inputFloat(id,min,max,def){
	var input=document.createElement('input');
	input.id='float-'+id;
	input.className='full-width text-right';
	input.type='text';
	input.minValue=min;
	input.maxValue=max;
	input.value=def;
	input.addEventListener('change', fixNumericFieldValueEvent, false);
	return input
}
function input(id,def){
	var input=document.createElement('input');
	input.id='input-'+id;
	input.className='full-width';
	input.type='text';
	input.value=def;
	return input
}
function checkbox(id,val){
	var input=document.createElement('input');
	input.id='checkbox-'+id;
	input.type='checkbox';
	if(val)
		input.value=val;
	return input
}
function select(id,options,func){
	var select=document.createElement('select');
	select.id='select-'+id;
	select.className='full-width';
	if(options){
		for(var i=0; i<options.length; i++){
			if(typeof options[i] === 'number'){
				var option=document.createElement('option');
				option.value=options[i];
				option.innerHTML=options[i];
				select.appendChild(option);
			}else if(typeof options[i] === 'string'){
				var option=document.createElement('option');
				option.value=i;
				option.innerHTML=options[i];
				select.appendChild(option);
			}else if(typeof options[i] === 'object' && typeof options[i].value!=='undefined' && typeof options[i].name!=='undefined'){
				var option=document.createElement('option');
				option.value=options[i].value;
				option.innerHTML=options[i].name;
				select.appendChild(option);
			}else if(typeof options[i] === 'object'){
				select.appendChild(options[i]);
			}
			
		}
	}

	if(func)
		select.addEventListener('change',func,false);

	return select
}
function dialog(id){
	var dialog=document.createElement('div');
	dialog.className='dialog';
	dialog.id='dialog-'+id;
	for(var i=1; i<arguments.length; i++)
		dialog.appendChild(arguments[i]);
	document.getElementById('the-editor').appendChild(dialog);
	return dialog
}
function div(className){
	var div=document.createElement('div');
	var elementsStart=0;
	if(typeof arguments[0]==='string'){
		div.className=arguments[0];
		elementsStart++;
	}
	for(var i=elementsStart; i<arguments.length; i++)
		div.appendChild(arguments[i]);
	return div
}
function button(text, className, func){
	var button=document.createElement('button');
	button.innerHTML=text;
	if(typeof className === 'string')
		button.className=className;
	button.addEventListener('click', func, false);
	return button
}
function label(forId,text){
	var label=document.createElement('label');
	label.htmlFor=forId;
	label.innerHTML=text;
	return label
}
function span(text){
	var span=document.createElement('span');
	span.innerHTML=text;
	return span
}
function hr(){return document.createElement('hr')}


function create(type){
	if(type==='number'){
		var input=document.createElement('input');
		input.id='number-'+arguments[1];
		input.className='text-right';
		input.type='text'; /* type='number' validation breaks getting input value when it's not valid */
		input.minValue=arguments[2];
		input.maxValue=arguments[3];
		input.addEventListener('change', fixNumericFieldValueEvent, false);
		input.value=(typeof arguments[4]!==undefined)?arguments[4]:0;
		if(input.maxValue<1000)
			input.className+=' small';
		return input;

	}else if(type==='float'){
		var input=document.createElement('input');
		input.id='float-'+arguments[1];
		input.className='text-right';
		input.type='text';
		input.minValue=arguments[2];
		input.maxValue=arguments[3];
		input.addEventListener('change', fixNumericFieldValueEvent, false);
		input.value=(typeof arguments[4]==='number')?arguments[4]:0;
		return input;

	}else if(type==='select'){
		var STR_REGEX=/^(\d+)=(.+)$/;
		var arr=arguments[2];

		var select=document.createElement('select');
		select.id='select-'+arguments[1];
		for(var i=0; i<arr.length; i++){
			if(typeof arr[i] === 'number'){
				var option=document.createElement('option');
				option.value=arr[i];
				option.innerHTML=arr[i];
				select.appendChild(option);
			}else if(typeof arr[i] === 'string'){
				var option=document.createElement('option');
				option.value=i;
				option.innerHTML=arr[i];
				select.appendChild(option);
			}else if(typeof arr[i] === 'object' && typeof arr[i].value!=='undefined'){
				var option=document.createElement('option');
				option.value=arr[i].value;
				option.innerHTML=arr[i].name;
				select.appendChild(option);
			}
			
		}

		if(arguments[3]){
			select.addEventListener('change',arguments[3],false);
		}
		return select

	}else if(type==='label'){
		var label=document.createElement('label');
		label.htmlFor=arguments[1];
		label.innerHTML=arguments[2];
		return label

	}else if(type==='span'){
		var span=document.createElement('span');
		span.innerHTML=arguments[1];
		return span

	}
}

function genRange(min,max){var a=[];for(var i=min;i<=max;i++)a.push(i);return a}




	
function getValue(f){
	var field=getField(f);
	if(field.id.startsWith('number-')){
		fixNumericFieldValue(field);
		return parseInt(field.value);

	}else if(field.id.startsWith('float-')){
		fixNumericFieldValue(field);
		return parseFloat(field.value);

	}else if(field.id.startsWith('input-') || field.id.startsWith('select-')){
		return field.value
	}else if(field.id.startsWith('span-')){
		return field.innerHTML
	}
}

function getField(field){
	return document.getElementById('input-'+field) || document.getElementById('number-'+field) || document.getElementById('float-'+field) || document.getElementById('checkbox-'+field) || document.getElementById('select-'+field) || document.getElementById('span-'+field) || document.getElementById(field)
}
function setValue(f,val){
	var field=getField(f);
	if(field.id.startsWith('span-')){
		field.innerHTML=val;
	}else{
		field.value=val;

		/* if defining range for the first time, this is very dirty, needs a real fix */
		if(typeof arguments[2]!=='undefined'){
			field.minValue=arguments[2];
			field.maxValue=arguments[3];
			field.addEventListener('change', fixNumericFieldValueEvent, false);
			fixNumericFieldValue(field);
		}
	}
}
