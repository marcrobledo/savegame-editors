/*
	savegame-editor.js v201705011
	A library that lets you create easily a savegame editor. Made with vanilla JS.

	by Marc Robledo 2016-2017
	http://www.marcrobledo.com/license
*/

/* LIBRARIES */
/* MarcBinFile.js v2016 */
function MarcBinFile(a,b){if("function"!=typeof window.FileReader)throw console.error("MarcBinFile.js: Browser doesn't support FileReader."),"Invalid browser";if("object"==typeof a&&a.name&&a.size)this.file=a,this.fileName=this.file.name,this.fileSize=this.file.size,this.fileType=a.type;else if("object"==typeof a&&a.files){if(1!=a.files.length){for(var c=[],d=a.files.length,e=function(){d--,0==d&&b&&b.call()},f=0;f<a.files.length;f++)c.push(new MarcBinFile(a.files[f],e));return c}this.file=a.files[0],this.fileName=this.file.name,this.fileSize=this.file.size,this.fileType=this.file.type}else{if("number"!=typeof a)throw console.error("MarcBinFile.js: Invalid type of file."),"Invalid file.";this.file=!1,this.fileName="newfile.hex",this.fileSize=a,this.fileType="application/octet-stream"}this.littleEndian=function(){var a=new ArrayBuffer(2);return new DataView(a).setInt16(0,256,!0),256===new Int16Array(a)[0]}(),this.file?(this.fileReader=new FileReader,this.fileReader.addEventListener("load",function(){this.dataView=new DataView(this.result)},!1),b&&this.fileReader.addEventListener("load",b,!1),this.fileReader.readAsArrayBuffer(this.file)):(this.fileReader=new ArrayBuffer(this.fileSize),this.fileReader.dataView=new DataView(this.fileReader),b&&b.call())}MarcBinFile.prototype.isReady=function(){return 2==this.fileReader.readyState},MarcBinFile.prototype.save=function(){var a;try{a=new Blob([this.fileReader.dataView],{type:this.fileType});}catch(e){if(e.name==="InvalidStateError"){var bb=new MSBlobBuilder();bb.append(this.fileReader.dataView.buffer);a=bb.getBlob('application/octet-stream')}}saveAs(a,this.fileName)},MarcBinFile.prototype.readByte=function(a){return this.fileReader.dataView.getUint8(a)},MarcBinFile.prototype.readByteSigned=function(a){return this.fileReader.dataView.getInt8(a)},MarcBinFile.prototype.readBytes=function(a,b){for(var c=new Array(b),d=0;d<b;d++)c[d]=this.readByte(a+d);return c},MarcBinFile.prototype.readShort=function(a){return this.fileReader.dataView.getUint16(a,this.littleEndian)},MarcBinFile.prototype.readShortSigned=function(a){return this.fileReader.dataView.getInt16(a,this.littleEndian)},MarcBinFile.prototype.readInt=function(a){return this.fileReader.dataView.getUint32(a,this.littleEndian)},MarcBinFile.prototype.readIntSigned=function(a){return this.fileReader.dataView.getInt32(a,this.littleEndian)},MarcBinFile.prototype.readFloat32=function(a){return this.fileReader.dataView.getFloat32(a,this.littleEndian)},MarcBinFile.prototype.readFloat64=function(a){return this.fileReader.dataView.getFloat64(a,this.littleEndian)},MarcBinFile.prototype.readString=function(a,b){for(var c=this.readBytes(a,b),d="",e=0;e<b&&c[e]>0;e++)d+=String.fromCharCode(c[e]);return d},MarcBinFile.prototype.writeByte=function(a,b){this.fileReader.dataView.setUint8(a,b,this.littleEndian)},MarcBinFile.prototype.writeByteSigned=function(a,b){this.fileReader.dataView.setInt8(a,b,this.littleEndian)},MarcBinFile.prototype.writeBytes=function(a,b){for(var c=0;c<b.length;c++)this.writeByte(a+c,b[c])},MarcBinFile.prototype.writeShort=function(a,b){this.fileReader.dataView.setUint16(a,b,this.littleEndian)},MarcBinFile.prototype.writeShortSigned=function(a,b){this.fileReader.dataView.setInt16(a,b,this.littleEndian)},MarcBinFile.prototype.writeInt=function(a,b){this.fileReader.dataView.setUint32(a,b,this.littleEndian)},MarcBinFile.prototype.writeIntSigned=function(a,b){this.fileReader.dataView.setInt32(a,b,this.littleEndian)},MarcBinFile.prototype.writeFloat32=function(a,b){this.fileReader.dataView.setFloat32(a,b,this.littleEndian)},MarcBinFile.prototype.writeFloat64=function(a,b){this.fileReader.dataView.setFloat64(a,b,this.littleEndian)},MarcBinFile.prototype.writeString=function(a,b,c){for(var d=0;d<c;d++)this.writeByte(a+d,0);for(var d=0;d<b.length&&d<c;d++)this.writeByte(a+d,b.charCodeAt(d))};
/* FileSaver.js by eligrey - https://github.com/eligrey/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
/* MarcDialogs.js v2016 */
MarcDialogs=function(){function e(e,t,n){a?e.attachEvent("on"+t,n):e.addEventListener(t,n,!1)}function t(){s&&(o?history.go(-1):(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null))}function n(e){for(var t=0;t<s.dialogElements.length;t++){var n=s.dialogElements[t];if("INPUT"===n.nodeName&&"hidden"!==n.type||"INPUT"!==n.nodeName)return n.focus(),!0}return!1}function l(){s&&(s.style.marginLeft="-"+s.offsetWidth/2+"px",s.style.marginTop="-"+s.offsetHeight/2-30+"px")}var a=/MSIE 8/.test(navigator.userAgent),o=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)&&"function"==typeof history.pushState,i=["Cancel","Accept"],s=null,c=document.createElement("div");c.className="dialog-overlay",c.style.position="fixed",c.style.top="0",c.style.left="0",c.style.width="100%",c.style.height="100%",c.style.zIndex=8e3,e(c,"click",t),e(window,"load",function(){document.body.appendChild(c),o&&history.replaceState({myDialog:!1},null,null)}),e(window,"resize",l),o&&e(window,"popstate",function(e){e.state.myDialog?(s=e.state.myDialog,MarcDialogs.open(e.state.myDialog)):e.state.myDialog===!1&&s&&(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null)}),e(document,"keydown",function(e){s&&(27==e.keyCode?(e.preventDefault?e.preventDefault():e.returnValue=!1,t()):9==e.keyCode&&s.dialogElements[s.dialogElements.length-1]==document.activeElement&&(e.preventDefault?e.preventDefault():e.returnValue=!1,n()))});var d=null,u=null,m=null;return{open:function(e){s&&(s.className=s.className.replace(/ active/g,"")),o&&(s?history.replaceState({myDialog:e},null,null):(console.log("a"),history.pushState({myDialog:e},null,null))),c.className="dialog-overlay active",s="string"==typeof e?document.getElementById("dialog-"+e):e,s.className+=" active",s.style.position="fixed",s.style.top="50%",s.style.left="50%",s.style.zIndex=8001,s.dialogElements||(s.dialogElements=s.querySelectorAll("input,textarea,select")),n(),l(s),l(s)},close:t,alert:function(t){if(!d){d=document.createElement("div"),d.id="dialog-quick-alert",d.className="dialog",d.msg=document.createElement("div"),d.msg.style.textAlign="center",d.appendChild(d.msg),d.buttons=document.createElement("div"),d.buttons.className="buttons";var n=document.createElement("button");n.innerHTML=i[1],e(n,"click",this.close),d.buttons.appendChild(n),d.appendChild(d.buttons),document.body.appendChild(d)}d.msg.innerHTML=t,MarcDialogs.open("quick-alert")},confirm:function(t,n){if(!u){u=document.createElement("div"),u.id="dialog-quick-confirm",u.className="dialog",u.msg=document.createElement("div"),u.msg.style.textAlign="center",u.appendChild(u.msg),u.buttons=document.createElement("div"),u.buttons.className="buttons";var l=document.createElement("button");l.className="button colored blue with-icon icon9",l.innerHTML=i[1],e(l,"click",function(){m()}),u.buttons.appendChild(l);var a=document.createElement("button");a.className="button with-icon icon3",a.innerHTML=i[0],e(a,"click",this.close),u.buttons.appendChild(a),u.appendChild(u.buttons),document.body.appendChild(u)}m=n,u.msg.innerHTML=t,MarcDialogs.open("quick-confirm")}}}();
/* mCreate v20170315 */
function mCreate(a,b){var c=document.createElement(a);if("object"==typeof b)for(var d in b)b.hasOwnProperty(d)&&("html"===d?c.innerHTML=b[d]:"class"===d?c.className=b[d]:d.startsWith("style")||d.startsWith("css")?c.style[d.replace(/^(style|css)(:- )?/,"")]=b[d]:c[d]=b[d]);return c};
/* MarcDragAndDrop.js v20170421 - Marc Robledo 2014-2017 - http://www.marcrobledo.com/license */
MarcDragAndDrop=(function(){
	function addEvent(e,t,f){if(/MSIE 8/.test(navigator.userAgent))e.attachEvent('on'+t,f);else e.addEventListener(t,f,false)}
	var no=function(e){if(typeof e.stopPropagation!=='undefined')e.stopPropagation();else e.cancelBubble=true;if(e.preventDefault)e.preventDefault();else e.returnValue=false}

	function checkIfHasFiles(e){
		if(e.dataTransfer.types)
			for(var i=0;i<e.dataTransfer.types.length;i++)
				if(e.dataTransfer.types[i]==='Files')
					return true;
		return false
	}

	function removeClass(){document.body.className=document.body.className.replace(' dragging-files','')}
	addEvent(document,'dragenter',function(e){
		if(checkIfHasFiles(e)){
			no(e);
			document.body.className+=' dragging-files'
		}
	});
	addEvent(document,'dragexit',function(e){
		//alert('exit');
		no(e);
		removeClass(); /* why!? */
		removeClass();
		removeClass();
		removeClass();
	});
	addEvent(document,'dragover',function(e){
		if(checkIfHasFiles(e))
			no(e)
	});

	var dropOutside=false;
	function enableDropOutside(){
		addEvent(document,'drop',function(e){
			removeClass();
			no(e);
		});
	}
	return{
		add:function(z,f){
			if(!dropOutside){
				enableDropOutside();
			}
			addEvent(document.getElementById(z),'drop',function(e){
				if(!checkIfHasFiles(e))
					return false;
				no(e);
				removeClass();
				f(e.dataTransfer.files)
			});
		},
		addGlobalZone:function(f,t){
			if(!dropOutside){
				enableDropOutside();
			}
			var div=document.createElement('div');
			div.id='drop-overlay';
			div.className='marc-drop-files';
			var span=document.createElement('span');
			if(t)
				span.innerHTML=t;
			else
				span.innerHTML='Drop files here';
			div.appendChild(span);
			document.body.appendChild(div);

			this.add('#drop-overlay',f);
		}
	}
}());





/* implement U16 string in MarcBinFile (PROVISIONAL!) */
MarcBinFile.prototype.readU16String=function(pos,maxLength){
	var cs=new Array(maxLength);
	var str='';
	for(var i=0;i<maxLength && this.readShort(pos+i*2)!=0;i++)
		str+=String.fromCharCode(this.readShort(pos+i*2));
		//cs[i]=this.readShort(pos+i*2);
	return str
}
MarcBinFile.prototype.writeU16String=function(pos,maxLength,str){
	for(var i=0;i<str.length && i<maxLength-1;i++)
		this.writeShort(pos+i*2,str.charCodeAt(i));
	for(;i<maxLength;i++)
		this.writeShort(pos+i*2,0)
}


/* savegame load/save */
var tempFile,hasBeenLoaded=false;
function _tempFileLoadFunction(){
	if(SavegameEditor.checkValidSavegame()){
		hide('dragzone');

		if(SavegameEditor.preload && !hasBeenLoaded){
			SavegameEditor.preload();
			hasBeenLoaded=true;
		}
		SavegameEditor.load();
		show('the-editor');
		show('toolbar');
	}else{
		MarcDialogs.alert('Invalid savegame file');
	}
}

function loadSavegameFromInput(input){
	tempFile=new MarcBinFile(input.files[0], _tempFileLoadFunction);
}

function saveChanges(){
	if(decodeURIComponent(document.cookie).indexOf('hideWarningMessage=1')>=0){
		SavegameEditor.save();
		tempFile.save();
	}else{
		MarcDialogs.open('warning');
	}
}

function closeFileConfirm(){
	MarcDialogs.confirm('All changes will be lost.', function(){
		closeFile();
		MarcDialogs.close()
	});
}
function closeFile(){
	show('dragzone');
	hide('the-editor');
	hide('toolbar');	
}

function getSavegameDefaultName(){
	if(typeof SavegameEditor.Filename==='string')
		return SavegameEditor.Filename;
	return SavegameEditor.Filename[0]
}
function getSavegameAllNames(){
	if(typeof SavegameEditor.Filename==='string')
		return SavegameEditor.Filename;
	else{
		var s='';
		for(var i=0; i<SavegameEditor.Filename.length; i++)
			s+=SavegameEditor.Filename[i]+', ';
		return s
	}
}


window.addEventListener('load', function(){
	var dragZone=document.createElement('div');
	dragZone.id='dragzone';
	dragZone.className='wrapper';
	var dragMessage=document.createElement('div');
	dragMessage.id='dragzone-message';
	dragMessage.innerHTML='<button class="close" onclick="document.getElementById(\'file-load\').click()"><i class=\"icon disk\"></i> Browse '+getSavegameAllNames()+'</button> or drop it here';

	var inputFile=document.createElement('input');
	inputFile.type='file';
	inputFile.className='hidden';
	inputFile.id='file-load';
	inputFile.addEventListener('change', function(){
		loadSavegameFromInput(this);
	}, false);

	var demoMessage=document.createElement('a');
	demoMessage.id='demo';
	demoMessage.href=SavegameEditor.Filename;
	demoMessage.download=SavegameEditor.Filename;
	demoMessage.innerHTML='Do you want to try it out? <u>Download an example savegame</u>';

	dragZone.appendChild(dragMessage);
	dragZone.appendChild(inputFile);
	dragZone.appendChild(demoMessage);
	document.body.appendChild(dragZone);



	MarcDragAndDrop.add('dragzone', function(droppedFiles){
		tempFile=new MarcBinFile(droppedFiles[0], _tempFileLoadFunction);
	});


	var warningDialog=document.createElement('div');
	warningDialog.className='dialog';
	warningDialog.id='dialog-warning';
	warningDialog.innerHTML='Use this tool at your own risk. By using it, you are responsible of any data lost.';
	var divButtons=document.createElement('div');
	divButtons.className='buttons';
	var understandButton=document.createElement('button');
	understandButton.innerHTML='I understand';
	understandButton.addEventListener('click',function(){
		var EXPIRE_DAYS=3;
		var d=new Date();
		d.setTime(d.getTime()+(EXPIRE_DAYS*24*60*60*1000));
		document.cookie="hideWarningMessage=1;expires="+d.toUTCString();//+";path=./";
		MarcDialogs.close();
		saveChanges();
	}, false);
	divButtons.appendChild(understandButton);
	warningDialog.appendChild(divButtons);
	document.body.appendChild(warningDialog);
}, false);




/* binary and other helpers */
function compareBytes(offset,a2){
	var a1=tempFile.readBytes(offset, a2.length);

	for(var i=0;i<a1.length;i++)
		if(a1[i]!=a2[i])
			return false;
	return true
}
function intToHex(i){var s=i.toString(16);while(s.length%2!=0)s='0'+s;return '0x'+s}
function genRange(min,max){var a=[];for(var i=min;i<=max;i++)a.push(i);return a}


/* DOM manipulation */
function show(e,p){document.getElementById(e).style.display=p||'block'}
function hide(e){document.getElementById(e).style.display='none'}
function empty(e){var el=document.getElementById(e);while(el.firstChild)el.removeChild(el.firstChild)}

function row(sizes){
	var r=document.createElement('div');
	r.className='row';
	for(var i=0;i<sizes.length;i++)
		r.appendChild(col(sizes[i], arguments[i+1]));
	return r
}
function col(size,inner){
	var c=document.createElement('div');
	c.className='columns c'+size;
	c.appendChild(inner);
	return c
}



function fixNumericFieldValue(field){
	var val=field.value.replace(/[^0-9\-\.]/g,'');
	if(/^float-/.test(field.id)){
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
function fixNumericFieldValueFromEvent(){fixNumericFieldValue(this)}


function inputNumber(id,min,max,def){
	var input=document.createElement('input');
	input.id='number-'+id;
	input.className='full-width text-right';
	input.type='text'; /* type='number' validation breaks getting input value when it's not valid */
	input.minValue=min;
	input.maxValue=max;
	input.value=def;
	input.addEventListener('change', fixNumericFieldValueFromEvent, false);
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
	input.addEventListener('change', fixNumericFieldValueFromEvent, false);
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
	var select;
	if(document.getElementById('select-'+id)){
		select=document.getElementById('select-'+id);
	}else{
		select=document.createElement('select');
		select.id='select-'+id;
		select.className='full-width';
	}
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





	
function getValue(f){
	var field=getField(f);
	if(/^number-/.test(field.id)){
		fixNumericFieldValue(field);
		return parseInt(field.value);

	}else if(/^float-/.test(field.id)){
		fixNumericFieldValue(field);
		return parseFloat(field.value);

	}else if(/^input-/.test(field.id) || /^select-/.test(field.id)){
		return field.value
	}else if(/^span-/.test(field.id)){
		return field.innerHTML
	}
}
function get(e){return document.getElementById(e)}
function getField(field){
	return document.getElementById('input-'+field) || document.getElementById('number-'+field) || document.getElementById('float-'+field) || document.getElementById('checkbox-'+field) || document.getElementById('select-'+field) || document.getElementById('span-'+field) || document.getElementById(field)
}
function setValue(f,val){
	var field=getField(f);
	if(/^span-/.test(field.id)){
		field.innerHTML=val;
	}else{
		field.value=val;
	}
}

function setNumericRange(f,min,max){
	var field=getField(f);
	field.className+=' text-right';
	field.minValue=min;
	field.maxValue=max;
	field.addEventListener('change', fixNumericFieldValueFromEvent, false);
	fixNumericFieldValue(field);
}