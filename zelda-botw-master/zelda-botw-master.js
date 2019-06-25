/*
	The legend of Zelda: Breath of the wild - Master editor v20190625
	by Marc Robledo 2017-2019
*/
var currentEditingItem=0;

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild (Master editor)',
	Filename:'game_data.sav',
	Version:20190625,


	/* Constants */
	Constants:{
		STRING_SIZE:0x20,
		STRING64_SIZE:0x80,

		//missing versions: 1.1.1, 1.1.2 and 1.4.1
		VERSION:				['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.3.1', 'Kiosk', 'v1.3.3','v1.3.4', 'v1.4',  'v1.5',  'v1.6',  'v1.6*', 'v1.6**','v1.6***'],
		FILESIZE:				[896976, 897160, 897112, 907824, 907824,  916576,  1020648, 1020648,   1027208, 1027208, 1027216, 1027216, 1027216, 1027216],
		HEADER:					[0x24e2, 0x24ee, 0x2588, 0x29c0, 0x2a46,  0x2f8e,  0x3ef8,  0x3ef9,    0x471a,  0x471b,  0x471e, 0x0f423d, 0x0f423e,0x0f423f]
	},
	
	HashFilters:[
		['Amiibo',				/WolfLink_|Amiibo/],
		['Display flag names',	/_DispNameFlag$/],
		['DLC1',				/100enemy/],
		['DLC2',				/Motorcycle/],
		['Horses',				/Horse_/],
		['Defeated enemies',	/Defeat_Enemy_|Defeated.+Num/],
		['Items',				/Porch|Cook/],
		['Get flags',			/IsGet_/],
		['Korok',				/HiddenKorok|OldKorok_/],
		['Visited locations',	/^Location_/],
		['Compendium',			/AlbumPicture|PictureBook/]
	],

	Hashes:[],



	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayPos){if(arrayPos)tempFile.writeU32(offset+8*arrayPos,val?1:0);else tempFile.writeU32(offset,val?1:0)},
	_writeValue:function(offset,val,arrayPos){if(arrayPos)tempFile.writeU32(offset+8*arrayPos,val);else tempFile.writeU32(offset,val)},
	_writeFloat32:function(offset,val,arrayPos){if(arrayPos)tempFile.writeF32(offset+8*arrayPos,val);else tempFile.writeF32(offset,val)},
	_writeString:function(offset,str){
		for(var i=0; i<8; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeU8(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},
	_writeString64:function(offset,str){
		for(var i=0; i<16; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeU8(offset+j, fourBytes.charCodeAt(j));
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


	changeEndianess:function(){
		var tempFileByteSwapped=new MarcFile(tempFile.fileSize);
		tempFileByteSwapped.fileType=tempFile.fileType;
		tempFileByteSwapped.fileName=tempFile.fileName;
		tempFileByteSwapped.littleEndian=!tempFile.littleEndian;
		for(var i=0; i<tempFile.fileSize; i+=4){
			tempFileByteSwapped.writeU32(i, tempFile.readU32(i));
		}
		tempFile=tempFileByteSwapped;
		this.checkValidSavegame();
	},


	/* check if savegame is valid */
	_checkValidSavegameByConsole:function(switchMode){
		var CONSOLE=switchMode?'Switch':'Wii U';
		tempFile.littleEndian=switchMode;
		for(var i=0; i<this.Constants.FILESIZE.length; i++){
			var versionHash=tempFile.readU32(0);
			if(versionHash===0x2a46) //v1.3.0 switch?
				versionHash=0x29c0;
			else if(versionHash===0x3ef9) //v1.3.3 switch?
				versionHash=0x3ef8;
			else if(versionHash===0x471b) //v1.5 is the same as 1.4
				versionHash=0x471a;

			if(tempFile.fileSize===this.Constants.FILESIZE[i] && versionHash===this.Constants.HEADER[i] && tempFile.readU32(4)===0xffffffff){
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
		for(var i=0; i<this.HashFilters.length; i++){
			var option=document.createElement('option');
			option.value=i;
			option.innerHTML=this.HashFilters[i][0];
			document.getElementById('select-filters').appendChild(option);
		}
	},


	showHashes:function(regexFilter, page){
		var findHashesIn;
		empty('table');
		this.Hashes=[];

		if(regexFilter===-1){
			findHashesIn=HASHES;
		}else if(regexFilter>-1){
			findHashesIn={};
			for(var hash in HASHES){
				if(this.HashFilters[regexFilter][1].test(HASHES[hash][1])){
					findHashesIn[hash]=true;
				}
			}

		}

		var previousHashValue=0;
		for(var i=0x0c; i<tempFile.fileSize-4; i+=8){
			var hashValue=tempFile.readU32(i);

			if(hashValue===previousHashValue)
				continue;
			previousHashValue=hashValue;

			if(findHashesIn[hashValue]){
				this.Hashes.push({
					type:HASHES[hashValue][0],
					id:HASHES[hashValue][1],
					offset:i
				});
			}else if(regexFilter===-1){
				this.Hashes.push({
					id:'* '+this._toHexInt(hashValue)
				});
			}
		}
		this.Hashes.sort(function(a,b){
			if(a.id<b.id)return -1;
			if(a.id>b.id)return 1;
			return 0;
		});

		
		var HASHES_PER_PAGE=100;
		var nPages=parseInt(this.Hashes.length/HASHES_PER_PAGE);
		if(this.Hashes.length%HASHES_PER_PAGE!==0){
			nPages++;
		}

		empty('select-page');
		for(var i=0; i<nPages; i++){
			var option=document.createElement('option');
			option.value=i;
			option.innerHTML=i+1;
			document.getElementById('select-page').appendChild(option);
		}
		document.getElementById('select-page').selectedIndex=page;
		
		this.Hashes=this.Hashes.splice(page*HASHES_PER_PAGE, HASHES_PER_PAGE);
		var placeholder=document.createElement('tbody');
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

	/* load function */
	load:function(){
		tempFile.fileName='game_data.sav';
		this.showHashes(-1, 0);
		document.getElementById('select-filters').value=-1;
	},

	/* save function */
	save:function(){}
}

function addEditorRow(container, left, right){
	var tr=document.createElement('tr');
	tr.appendChild(document.createElement('td'));
	tr.appendChild(document.createElement('td'));

	tr.children[1].className='text-right';
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
		if(tempFile.readU32(offset+4))
			c.checked=true;
		addEditorRow(container, hashId, c);
	}else if(type===S32){
		var inp=inputNumber(hashId, 0, 0xffffffff, tempFile.readU32(offset+4));
		inp.offset=offset+4;
		inp.addEventListener('change', setS32);
		addEditorRow(container, hashId, inp);
	}else if(type===F32){
		var inp=inputNumber(hashId, 0, 0xffffffff, tempFile.readF32(offset+4));
		inp.offset=offset+4;
		inp.addEventListener('change', setF32);
		addEditorRow(container, hashId, inp);
	}else if(type===VECTOR2F){
		createHashInput(container, hashId+'[0]', F32, offset);
		createHashInput(container, hashId+'[1]', F32, offset+8);
	}else if(type===VECTOR3F){
		createHashInput(container, hashId+'[0]', F32, offset);
		createHashInput(container, hashId+'[1]', F32, offset+8);
		createHashInput(container, hashId+'[2]', F32, offset+16);
	}else if(type===VECTOR4F){
		createHashInput(container, hashId+'[0]', F32, offset);
		createHashInput(container, hashId+'[1]', F32, offset+8);
		createHashInput(container, hashId+'[2]', F32, offset+16);
		createHashInput(container, hashId+'[3]', F32, offset+24);
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
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', BOOL, offset+i*8);
			i++;
			nextHash=tempFile.readU32(offset+i*8);
		}
	}else if(type===S32_ARRAY){
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', S32, offset+i*8);
			i++;
			nextHash=tempFile.readU32(offset+i*8);
		}
	}else if(type===F32_ARRAY){
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', F32, offset+i*8);
			i++;
			nextHash=tempFile.readU32(offset+i*8);
		}
	}else if(type===VECTOR2F_ARRAY){
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', VECTOR2F, offset+i*16);
			i++;
			nextHash=tempFile.readU32(offset+i*16);
		}
	}else if(type===VECTOR3F_ARRAY){
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', VECTOR3F, offset+i*24);
			i++;
			nextHash=tempFile.readU32(offset+i*24);
		}
	}else if(type===STRING64_ARRAY){
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		while(nextHash===hash){
			createHashInput(container, hashId+'['+i+']', STRING64, offset+i*128);
			i++;
			nextHash=tempFile.readU32(offset+i*128);
		}
	}else{
		addEditorRow(container, hashId+' ('+DATA_TYPES[type]+')');
	}
}




function setBoolean(){
	SavegameEditor._writeBoolean(this.offset, this.checked, 0);
}
function setS32(){
	SavegameEditor._writeValue(this.offset, this.value, 0);
}
function setF32(){
	SavegameEditor._writeFloat32(this.offset, this.value, 0);
}
function setString(){
	SavegameEditor._writeString(this.offset, this.value);
}
function setString64(){
	SavegameEditor._writeString64(this.offset, this.value);
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
window.addEventListener('scroll', onScroll, false);