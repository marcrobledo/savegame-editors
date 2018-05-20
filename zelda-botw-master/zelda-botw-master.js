/*
	The legend of Zelda: Breath of the wild - Master editor v20180520
	by Marc Robledo 2017-2018
*/
var currentEditingItem=0;

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild (Master editor)',
	Filename:'game_data.sav',
	Version:20180520,


	/* Constants */
	Constants:{
		STRING_SIZE:0x20,
		STRING64_SIZE:0x80,

		/*						 v1.0    v1.1    v1.2    v1.3    v1.3.3   v1.4     v1.5 */
		FILESIZE:				[896976, 897160, 897112, 907824, 1020648, 1027208, 1027208],
		HEADER:					[0x24e2, 0x24ee, 0x2588, 0x29c0, 0x3ef8,  0x471a,  0x471b],
		VERSION:				['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.3.3','v1.4',  'v1.5']
	},

	Hashes:[],



	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayPos){if(arrayPos)tempFile.writeInt(offset+8*arrayPos,val?1:0);else tempFile.writeInt(offset,val?1:0)},
	_writeValue:function(offset,val,arrayPos){if(arrayPos)tempFile.writeInt(offset+8*arrayPos,val);else tempFile.writeInt(offset,val)},
	_writeString:function(offset,str){
		for(var i=0; i<8; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeByte(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},
	_writeString64:function(offset,str){
		for(var i=0; i<16; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeByte(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},

	_readString:function(offset){
		var txt='';
		for(var j=0; j<8; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},
	_readString64:function(offset){
		var txt='';
		for(var j=0; j<16; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},


	/* check if savegame is valid */
	_checkValidSavegameByConsole:function(switchMode){
		var CONSOLE=switchMode?'Switch':'Wii U';
		tempFile.littleEndian=switchMode;
		for(var i=0; i<this.Constants.FILESIZE.length; i++){
			var versionHash=tempFile.readInt(0);
			if(versionHash===0x2a46) //v1.3.0 switch?
				versionHash=0x29c0;
			if(versionHash===0x3ef9) //v1.3.3 switch?
				versionHash=0x3ef8;

			if(tempFile.fileSize===this.Constants.FILESIZE[i] && versionHash===this.Constants.HEADER[i] && tempFile.readInt(4)===0xffffffff){
				setValue('version', this.Constants.VERSION[i]+' ('+CONSOLE+')');
				return true;
			}
		}

		return false
	},
	checkValidSavegame:function(){
		return this._checkValidSavegameByConsole(false) || this._checkValidSavegameByConsole(true);
	},


	preload:function(){
	},


	/* load function */
	load:function(){
		tempFile.fileName='game_data.sav';

		this.Hashes=[];

		//var textarea=document.createElement('textarea');
		//document.body.appendChild(textarea);
		var previousHashValue=0;
		for(var i=0x0c; i<tempFile.fileSize-4; i+=8){
			var hashValue=tempFile.readInt(i);
			if(hashValue===previousHashValue)
				continue;

			if(HASHES[hashValue]){
				this.Hashes.push({
					type:HASHES[hashValue][0],
					id:HASHES[hashValue][1],
					offset:i
				});
			}else{
				this.Hashes.push({
					id:'* '+this._toHexInt(hashValue)
				});
			}
			previousHashValue=hashValue;

			/*if(/ \(NEW!\)/.test(hashId)){
				textarea.value+=this._toHexInt(hashValue)+',\"'+hashId+'\",//'+hashType+'\n';
			}*/
		}
		this.Hashes.sort(function(a,b){
		if(a.id<b.id)return -1;
		if(a.id>b.id)return 1;
		return 0;
		});
		
		empty('table');
		var placeholder=document.createElement('div');
		for(var i=0; i<this.Hashes.length; i++){
			var hash=this.Hashes[i];

			if(hash.type){
				createHashInput(placeholder, hash.id, hash.type, hash.offset)
			}else{
				addEditorRow(placeholder, hash.id);
			}
		}
		get('table').appendChild(placeholder);
	},

	/* save function */
	save:function(){}
}

function addEditorRow(container, left, right){
	var tr=document.createElement('tr');
	tr.appendChild(document.createElement('td'));
	tr.appendChild(document.createElement('td'));

	if(right){
		tr.children[0].appendChild(label(right.id, left));
		tr.children[1].appendChild(right);
	}else{
		tr.children[0].innerHTML=left;
	}
	container.appendChild(tr);
}
function createHashInput(container, hashId, type, offset){
	if(type===BOOL){
		var c=checkbox(hashId);
		c.offset=offset+4;
		c.addEventListener('change', setBoolean);
		if(tempFile.readInt(offset+4))
			c.checked=true;
		addEditorRow(container, hashId, c);
	}else if(type===S32){
		var inp=inputNumber(hashId, 0, 0xffffffff, tempFile.readInt(offset+4));
		inp.offset=offset+4;
		inp.addEventListener('change', setS32);
		addEditorRow(container, hashId, inp);
	}else if(type===STRING){
		var inp=input(hashId, SavegameEditor._readString(offset+4));
		inp.offset=offset+4;
		inp.maxLength=32;
		inp.addEventListener('change', setString);
		addEditorRow(container, hashId, inp);
	}else if(type===STRING64){
		var inp=input(hashId, SavegameEditor._readString64(offset+4));
		inp.offset=offset+4;
		inp.maxLength=64;
		inp.addEventListener('change', setString64);
		addEditorRow(container, hashId, inp);
	}else if(type===BOOL_ARRAY){
		var hash=tempFile.readInt(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', BOOL, offset+i*8);
			i++;
			nextHash=tempFile.readInt(offset+i*8);
		}
	}else if(type===S32_ARRAY){
		var hash=tempFile.readInt(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', S32, offset+i*8);
			i++;
			nextHash=tempFile.readInt(offset+i*8);
		}
	}else if(type===STRING64_ARRAY){
		var hash=tempFile.readInt(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', STRING64, offset+i*128);
			i++;
			nextHash=tempFile.readInt(offset+i*128);
		}
	}else{
		addEditorRow(container, hashId+' ('+DATA_TYPES[type]+')');
	}
}



function onScroll(){
	var h=document.getElementById('header-top').getBoundingClientRect().height;
	if(window.scrollY>h){
		document.getElementById('header').style.position='fixed';
		document.getElementById('header').style.top='-'+h+'px';
	}else{
		document.getElementById('header').style.position='absolute';
		document.getElementById('header').style.top='0px';
	}
}

window.addEventListener('load',function(){
	/* service worker */
	if(location.protocol==='http:')
		location.href=window.location.href.replace('http:','https:');
	if('serviceWorker' in navigator)
		navigator.serviceWorker.register('_cache_service_worker.js');

	window.addEventListener('scroll',onScroll,false);
}, false);





function setBoolean(){
	SavegameEditor._writeBoolean(this.offset, this.checked, 0);
}
function setS32(){
	SavegameEditor._writeValue(this.offset, this.value, 0);
}
function setString(){
	SavegameEditor._writeString(this.offset, this.value);
}
function setString64(){
	SavegameEditor._writeString64(this.offset, this.value);
}