/*
	savegame-editor.js v20230729
	A library that lets you create easily a savegame editor. Made with vanilla JS.

	by Marc Robledo 2016-2023
	http://www.marcrobledo.com/license
*/

/* LIBRARIES */
/* MODDED VERSION OF MarcFile.js v20181020 - Marc Robledo 2014-2018 - http://www.marcrobledo.com/license */
function MarcFile(a,b){"object"==typeof a&&a.files&&(a=a.files[0]);var c=!1;if("object"==typeof a&&a.name&&a.size){if("function"!=typeof window.FileReader)throw new Error("Incompatible Browser");c=!0,this.fileName=a.name,this.fileType=a.type,this.fileSize=a.size}else if("number"==typeof a)this.fileName="file.bin",this.fileType="application/octet-stream",this.fileSize=a;else throw new Error("Invalid source");if(this.littleEndian=!1,c)this._fileReader=new FileReader,this._fileReader.marcFile=this,this._fileReader.addEventListener("load",function(){this.marcFile._u8array=new Uint8Array(this.result),this.marcFile._dataView=new DataView(this.result),b&&b.call()},!1),this._fileReader.readAsArrayBuffer(a);else if(0<a){var d=new ArrayBuffer(a);this._u8array=new Uint8Array(d),this._dataView=new DataView(d),b&&b.call()}}MarcFile.prototype.IS_MACHINE_LITTLE_ENDIAN=function(){var a=new ArrayBuffer(2);return new DataView(a).setInt16(0,256,!0),256===new Int16Array(a)[0]}(),MarcFile.prototype.save=function(){var a;try{a=new Blob([this._u8array],{type:this.fileType})}catch(c){if(window.BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,"InvalidStateError"===c.name&&window.BlobBuilder){var b=new BlobBuilder;b.append(this._u8array.buffer),a=b.getBlob(this.fileType)}else{throw new Error("Incompatible Browser")}}saveAs(a,this.fileName)},MarcFile.prototype.readU8=function(a){return this._u8array[a]},MarcFile.prototype.readU16=function(a){return this.littleEndian?this._u8array[a]+(this._u8array[a+1]<<8)>>>0:(this._u8array[a]<<8)+this._u8array[a+1]>>>0},MarcFile.prototype.readU24=function(a){return this.littleEndian?this._u8array[a]+(this._u8array[a+1]<<8)+(this._u8array[a+2]<<16)>>>0:(this._u8array[a]<<16)+(this._u8array[a+1]<<8)+this._u8array[a+2]>>>0},MarcFile.prototype.readU32=function(a){return this.littleEndian?this._u8array[a]+(this._u8array[a+1]<<8)+(this._u8array[a+2]<<16)+(this._u8array[a+3]<<24)>>>0:(this._u8array[a]<<24)+(this._u8array[a+1]<<16)+(this._u8array[a+2]<<8)+this._u8array[a+3]>>>0},MarcFile.prototype.readS8=function(a){return this._dataView.getInt8(a,this.littleEndian)},MarcFile.prototype.readS16=function(a){return this._dataView.getInt16(a,this.littleEndian)},MarcFile.prototype.readS32=function(a){return this._dataView.getInt32(a,this.littleEndian)},MarcFile.prototype.readF32=function(a){return this._dataView.getFloat32(a,this.littleEndian)},MarcFile.prototype.readF64=function(a){return this._dataView.getFloat64(a,this.littleEndian)},MarcFile.prototype.readBytes=function(a,b){for(var c=Array(b),d=0;d<b;d++)c[d]=this._u8array[a+d];return c},MarcFile.prototype.readString=function(a,b){for(var c="",d=0;d<b&&a+d<this.fileSize&&0<this._u8array[a+d];d++)c+=String.fromCharCode(this._u8array[a+d]);return c},MarcFile.prototype.writeU8=function(a,b){this._u8array[a]=b},MarcFile.prototype.writeU16=function(a,b){this.littleEndian?(this._u8array[a]=255&b,this._u8array[a+1]=b>>8):(this._u8array[a]=b>>8,this._u8array[a+1]=255&b)},MarcFile.prototype.writeU24=function(a,b){this.littleEndian?(this._u8array[a]=255&b,this._u8array[a+1]=(65280&b)>>8,this._u8array[a+2]=(16711680&b)>>16):(this._u8array[a]=(16711680&b)>>16,this._u8array[a+1]=(65280&b)>>8,this._u8array[a+2]=255&b)},MarcFile.prototype.writeU32=function(a,b){this.littleEndian?(this._u8array[a]=255&b,this._u8array[a+1]=(65280&b)>>8,this._u8array[a+2]=(16711680&b)>>16,this._u8array[a+3]=(4278190080&b)>>24):(this._u8array[a]=(4278190080&b)>>24,this._u8array[a+1]=(16711680&b)>>16,this._u8array[a+2]=(65280&b)>>8,this._u8array[a+3]=255&b)},MarcFile.prototype.writeS8=function(a,b){this._dataView.setInt8(a,b,this.littleEndian)},MarcFile.prototype.writeS16=function(a,b){this._dataView.setInt16(a,b,this.littleEndian)},MarcFile.prototype.writeS32=function(a,b){this._dataView.setInt32(a,b,this.littleEndian)},MarcFile.prototype.writeF32=function(a,b){this._dataView.setFloat32(a,b,this.littleEndian)},MarcFile.prototype.writeF64=function(a,b){this._dataView.setFloat64(a,b,this.littleEndian)},MarcFile.prototype.writeBytes=function(b,c){for(var a=0;a<c.length;a++)this._u8array[b+a]=c[a]},MarcFile.prototype.writeString=function(a,b,c){c=c||b.length;for(var d=0;d<b.length&&d<c;d++)this._u8array[a+d]=b.charCodeAt(d);for(;d<c;d++)this._u8array[a+d]=0};
/* implement U16 string in MarcFile (PROVISIONAL!) */
MarcFile.prototype.readU16String=function(pos,maxLength){
	var cs=new Array(maxLength);
	var str='';
	for(var i=0;i<maxLength && this.readU16(pos+i*2)!=0;i++)
		str+=String.fromCharCode(this.readU16(pos+i*2));
		//cs[i]=this.readU16(pos+i*2);
	return str
}
MarcFile.prototype.writeU16String=function(pos,maxLength,str){
	for(var i=0;i<str.length && i<maxLength-1;i++)
		this.writeU16(pos+i*2,str.charCodeAt(i));
	for(;i<maxLength;i++)
		this.writeU16(pos+i*2,0)
}
MarcFile.newFromPromise=async function(file){
	var ret = await new Promise((resolve, reject) => {
		try {
			var marcFile = new MarcFile(file, function() {
				resolve(marcFile);
			});
		} catch (err) {
			reject(err);
		}
	});
	return ret;
}




/* FileSaver.js by eligrey - https://github.com/eligrey/FileSaver.js */
var saveAs=saveAs||function(c){"use strict";if(!(void 0===c||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var t=c.document,f=function(){return c.URL||c.webkitURL||c},s=t.createElementNS("http://www.w3.org/1999/xhtml","a"),d="download"in s,u=/constructor/i.test(c.HTMLElement)||c.safari,l=/CriOS\/[\d]+/.test(navigator.userAgent),p=c.setImmediate||c.setTimeout,v=function(t){p(function(){throw t},0)},w=function(t){setTimeout(function(){"string"==typeof t?f().revokeObjectURL(t):t.remove()},4e4)},m=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},r=function(t,n,e){e||(t=m(t));var r,o=this,a="application/octet-stream"===t.type,i=function(){!function(t,e,n){for(var r=(e=[].concat(e)).length;r--;){var o=t["on"+e[r]];if("function"==typeof o)try{o.call(t,n||t)}catch(t){v(t)}}}(o,"writestart progress write writeend".split(" "))};if(o.readyState=o.INIT,d)return r=f().createObjectURL(t),void p(function(){var t,e;s.href=r,s.download=n,t=s,e=new MouseEvent("click"),t.dispatchEvent(e),i(),w(r),o.readyState=o.DONE},0);!function(){if((l||a&&u)&&c.FileReader){var e=new FileReader;return e.onloadend=function(){var t=l?e.result:e.result.replace(/^data:[^;]*;/,"data:attachment/file;");c.open(t,"_blank")||(c.location.href=t),t=void 0,o.readyState=o.DONE,i()},e.readAsDataURL(t),o.readyState=o.INIT}r||(r=f().createObjectURL(t)),a?c.location.href=r:c.open(r,"_blank")||(c.location.href=r);o.readyState=o.DONE,i(),w(r)}()},e=r.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,e,n){return e=e||t.name||"download",n||(t=m(t)),navigator.msSaveOrOpenBlob(t,e)}:(e.abort=function(){},e.readyState=e.INIT=0,e.WRITING=1,e.DONE=2,e.error=e.onwritestart=e.onprogress=e.onwrite=e.onabort=e.onerror=e.onwriteend=null,function(t,e,n){return new r(t,e||t.name||"download",n)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this);
/* MarcDialogs.js v2016 */
MarcDialogs=function(){function e(e,t,n){a?e.attachEvent("on"+t,n):e.addEventListener(t,n,!1)}function t(){s&&(o?history.go(-1):(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null))}function n(e){for(var t=0;t<s.dialogElements.length;t++){var n=s.dialogElements[t];if("INPUT"===n.nodeName&&"hidden"!==n.type||"INPUT"!==n.nodeName)return n.focus(),!0}return!1}function l(){s&&(s.style.marginLeft="-"+s.offsetWidth/2+"px",s.style.marginTop="-"+s.offsetHeight/2-30+"px")}var a=/MSIE 8/.test(navigator.userAgent),o=navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i)&&"function"==typeof history.pushState,i=["Cancel","Accept"],s=null,c=document.createElement("div");c.className="dialog-overlay",c.style.position="fixed",c.style.top="0",c.style.left="0",c.style.width="100%",c.style.height="100%",c.style.zIndex=8e3,e(c,"click",t),e(window,"load",function(){document.body.appendChild(c),o&&history.replaceState({myDialog:!1},null,null)}),e(window,"resize",l),o&&e(window,"popstate",function(e){e.state.myDialog?(s=e.state.myDialog,MarcDialogs.open(e.state.myDialog)):e.state.myDialog===!1&&s&&(c.className="dialog-overlay",s.className=s.className.replace(/ active/g,""),s=null)}),e(document,"keydown",function(e){s&&(27==e.keyCode?(e.preventDefault?e.preventDefault():e.returnValue=!1,t()):9==e.keyCode&&s.dialogElements[s.dialogElements.length-1]==document.activeElement&&(e.preventDefault?e.preventDefault():e.returnValue=!1,n()))});var d=null,u=null,m=null;return{open:function(e){s&&(s.className=s.className.replace(/ active/g,"")),o&&(s?history.replaceState({myDialog:e},null,null):(console.log("a"),history.pushState({myDialog:e},null,null))),c.className="dialog-overlay active",s="string"==typeof e?document.getElementById("dialog-"+e):e,s.className+=" active",s.style.position="fixed",s.style.top="50%",s.style.left="50%",s.style.zIndex=8001,s.dialogElements||(s.dialogElements=s.querySelectorAll("input,textarea,select")),n(),l(s),l(s)},close:t,alert:function(t){if(!d){d=document.createElement("div"),d.id="dialog-quick-alert",d.className="dialog",d.msg=document.createElement("div"),d.msg.style.textAlign="center",d.appendChild(d.msg),d.buttons=document.createElement("div"),d.buttons.className="buttons";var n=document.createElement("button");n.innerHTML=i[1],e(n,"click",this.close),d.buttons.appendChild(n),d.appendChild(d.buttons),document.body.appendChild(d)}d.msg.innerHTML=t,MarcDialogs.open("quick-alert")},confirm:function(t,n){if(!u){u=document.createElement("div"),u.id="dialog-quick-confirm",u.className="dialog",u.msg=document.createElement("div"),u.msg.style.textAlign="center",u.appendChild(u.msg),u.buttons=document.createElement("div"),u.buttons.className="buttons";var l=document.createElement("button");l.className="button colored blue with-icon icon9",l.innerHTML=i[1],e(l,"click",function(){m()}),u.buttons.appendChild(l);var a=document.createElement("button");a.className="button with-icon icon3",a.innerHTML=i[0],e(a,"click",this.close),u.buttons.appendChild(a),u.appendChild(u.buttons),document.body.appendChild(u)}m=n,u.msg.innerHTML=t,MarcDialogs.open("quick-confirm")}}}();
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

	// Drop handler function to get all files. Thanks xieliming https://stackoverflow.com/a/53058574
	async function getAllFiles(dataTransferItemList) {
		let fileEntries = [];
		// Use BFS to traverse entire directory/file structure
		let queue = [];
		// Unfortunately dataTransferItemList is not iterable i.e. no forEach
		for (let i = 0; i < dataTransferItemList.length; i++) {
			// Note webkitGetAsEntry a non-standard feature and may change
			// Usage is necessary for handling directories
			queue.push(dataTransferItemList[i].webkitGetAsEntry());
		}
		while (queue.length > 0) {
			let entry = queue.shift();
			if (entry.isFile) {
				fileEntries.push(entry);
			} else if (entry.isDirectory) {
				let reader = entry.createReader();
				queue.push(...await readAllDirectoryEntries(reader));
			}
		}
		return await Promise.all(fileEntries.map(entry => toFilePromise(entry)));
	}
	// Get all the entries (files or sub-directories) in a directory by calling readEntries until it returns empty array
	async function readAllDirectoryEntries(directoryReader) {
		let entries = [];
		let readEntries = await readEntriesPromise(directoryReader);
		while (readEntries.length > 0) {
			entries.push(...readEntries);
			readEntries = await readEntriesPromise(directoryReader);
		}
		return entries;
	}
	// Wrap readEntries in a promise to make working with readEntries easier
	async function readEntriesPromise(directoryReader) {
		try {
			return await new Promise((resolve, reject) => {
				directoryReader.readEntries(resolve, reject);
			});
		} catch (err) {
			console.log(err);
		}
	}
	async function toFilePromise(fileEntry) {
		try {
			return await new Promise((resolve, reject) => {
				fileEntry.file(function(file){
					// Patch webkitRelativePath for Chrome which doesn't always set it? https://github.com/ant-design/ant-design/issues/16426
					// TODO could we just pass fileEntry.fullpath out instead of patching this?
					Object.defineProperties(file, {
						webkitRelativePath: {
						writable: true,
						},
					});
					file.webkitRelativePath = file.webkitRelativePath || fileEntry.fullPath.replace(/^\//, '');
					Object.defineProperties(file, {
						webkitRelativePath: {
						writable: false,
						},
					});
					resolve(file);
				}, reject);
			});
		} catch (err) {
			console.log(err);
		}
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

			addEvent(document.getElementById(z),'drop',async function (e) {
				var files = await getAllFiles(e.dataTransfer.items);
				if(files.length==0) {
					return false;
				}
				no(e);
				removeClass();
				f(files);
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

function saveChanges(){
	if(decodeURIComponent(document.cookie).indexOf('hideWarningMessage=1')>=0 || location.protocol==='file:'){ /* chrome does not write cookies in local, so skip warning message in that case */
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
	if(typeof SavegameEditor.unload==='function')
		SavegameEditor.unload();
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
		for(var i=0; i<SavegameEditor.Filename.length; i++){
			if(i){
				if(i===(SavegameEditor.Filename.length-1))
					s+=' or ';
				else
					s+=', ';
			}
			s+=SavegameEditor.Filename[i];
		}
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
	// Requires a folder for "browse window" picking, but this works when running webpage from filesystem on Chrome, where dropping folders does not work.
	// `webkitGetAsEntry` may be a better workaround https://github.com/danialfarid/ng-file-upload/issues/236#issuecomment-45053629
	// inputFile.webkitdirectory = true;
	inputFile.addEventListener('change', async function(evt){
		if(this.files.length == 1 || typeof SavegameEditor.showSavegameIndex === 'undefined') {
			// Load savegame from file
			tempFile=new MarcFile(this.files[0], _tempFileLoadFunction);
		} else {
			// Some games have a complex structure of multiple savegames, so we provide a custom picker+overview
			await SavegameEditor.showSavegameIndex(this.files);
		}
	}, false);

	dragZone.appendChild(dragMessage);
	dragZone.appendChild(inputFile);
	document.body.appendChild(dragZone);


	if(!SavegameEditor.noDemo){
		var demoMessage=document.createElement('button');
		demoMessage.id='demo';
		demoMessage.innerHTML='Do you want to try it out? <u>Try an example savegame</u>';
		demoMessage.addEventListener('click', function(){
			var filename=getSavegameDefaultName();
			if(typeof window.fetch==='function'){
				fetch(filename)
					.then(res => res.arrayBuffer()) // Gets the response and returns it as a blob
					.then(ab => {
						tempFile=new MarcFile(ab.byteLength);
						tempFile.fileName=filename;
						tempFile._u8array=new Uint8Array(ab);
						tempFile._dataView=new DataView(ab);
						_tempFileLoadFunction();
					})
					.catch(function(){
						alert('Unexpected error: can\'t download example savegame');
					});
			}else{
				var oReq=new XMLHttpRequest();
				oReq.open('GET', filename, true);
				oReq.responseType='arraybuffer';

				oReq.onload=function(oEvent){
					if(this.status===200) {
						var ab=oReq.response; //Note: not oReq.responseText

						tempFile=new MarcFile(ab.byteLength);
						tempFile.fileName=filename;
						tempFile._u8array=new Uint8Array(ab);
						tempFile._dataView=new DataView(ab);
						_tempFileLoadFunction();
					}else{
						alert('Unexpected error: can\'t download example savegame');
					}
				};

				oReq.onerror=function(oEvent){
					alert('Unexpected error: can\'t download example savegame');
				};

				oReq.send(null);
			}
		}, false);
		dragZone.appendChild(demoMessage);
	}


	MarcDragAndDrop.add('dragzone', async function(droppedFiles){
		if(droppedFiles.length == 1 || typeof SavegameEditor.showSavegameIndex === 'undefined') {
			// Load savegame from file
			tempFile=new MarcFile(droppedFiles[0], _tempFileLoadFunction);
		} else {
			// Some games have a complex structure of multiple savegames, so we provide a custom picker+overview
			await SavegameEditor.showSavegameIndex(droppedFiles);
		}
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
function select(id,options,func,def){
	var select;
	if(document.getElementById('select-'+id)){
		select=document.getElementById('select-'+id);
	}else{
		select=document.createElement('select');
		select.id='select-'+id;
		select.className='full-width';
	}
	var unknownValue=typeof def!=='undefined';
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

			if(unknownValue && options[i].value==def){
				unknownValue=false;
			}
		}
	}

	if(func)
		select.addEventListener('change',func,false);

	if(unknownValue){
		var option=document.createElement('option');
		option.value=def;
		option.innerHTML='['+(typeof def==='number'? def.toString(16) : def)+']';
		select.appendChild(option);
	}

	if(typeof def!=='undefined')
		select.value=def;

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