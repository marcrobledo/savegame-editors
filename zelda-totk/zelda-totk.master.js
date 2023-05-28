/*
	The legend of Zelda: Tears of the Kingdom - Master editor v20230526

	by Marc Robledo 2023
*/

const BOOL=1;
const BOOL_ARRAY=2;
const S32=3;
const S32_ARRAY=4;
const F32=5;
const F32_ARRAY=6;
const VECTOR2F=7;
const VECTOR2F_ARRAY=8;
const VECTOR3F=9;
const VECTOR3F_ARRAY=10;
const VECTOR4F=11;
const VECTOR4F_ARRAY=12;
const STRING=13;
const STRING_ARRAY=14;
const STRING64=15;
const STRING64_ARRAY=16;
const STRING256=17;
const STRING256_ARRAY=18;








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
		return 8;
	}else if(type===S32){
		var inp=inputNumber(hashId, 0, 0xffffffff, tempFile.readU32(offset+4));
		inp.offset=offset+4;
		inp.addEventListener('change', setS32);
		addEditorRow(container, hashId, inp);
		return 8;
	}else if(type===F32){
		var inp=inputNumber(hashId, 0, 0xffffffff, tempFile.readF32(offset+4));
		inp.offset=offset+4;
		inp.addEventListener('change', setF32);
		addEditorRow(container, hashId, inp);
		return 8;
	}else if(type===VECTOR2F){
		createHashInput(container, hashId+'[x]', F32, offset);
		createHashInput(container, hashId+'[y]', F32, offset+8);
		return 16;
	}else if(type===VECTOR3F){
		createHashInput(container, hashId+'[x]', F32, offset);
		createHashInput(container, hashId+'[y]', F32, offset+8);
		createHashInput(container, hashId+'[z]', F32, offset+16);
		return 24;
	}else if(type===VECTOR4F){
		createHashInput(container, hashId+'[x]', F32, offset);
		createHashInput(container, hashId+'[y]', F32, offset+8);
		createHashInput(container, hashId+'[z]', F32, offset+16);
		createHashInput(container, hashId+'[t]', F32, offset+24);
		return 32;
	}else if(type===STRING){
		var inp=input(hashId, SavegameEditor._readString(offset+4));
		inp.offset=offset+4;
		inp.maxLength=32;
		inp.addEventListener('change', setString);
		addEditorRow(container, hashId, inp);
		return 0x20;
	}else if(type===STRING64){
		var inp=input(hashId, SavegameEditor._readString64(offset+4));
		inp.offset=offset+4;
		inp.maxLength=64;
		inp.addEventListener('change', setString64);
		addEditorRow(container, hashId, inp);
		return 0x80;
	}else if(type===STRING256){
		var inp=input(hashId, SavegameEditor._readString256(offset+4));
		inp.offset=offset+4;
		inp.maxLength=256;
		inp.addEventListener('change', setString256);
		addEditorRow(container, hashId, inp);
		return 0x0200;
	}else if(type && type%2===0){ /* array */
		var hash=tempFile.readU32(offset);
		var nextHash=hash;
		var i=0;
		var size=0;
		while(nextHash===hash){
			size=createHashInput(container, hashId+'['+i+']', type-1, offset+i*size);
			i++;
			nextHash=tempFile.readU32(offset+i*size);
		}
	}else{
		addEditorRow(container, hashId+' (unknown)');
	}
}




function setBoolean(){
	tempFile.writeU32(this.offset, this.checked? 1: 0);
}
function setS32(){
	tempFile.writeU32(this.offset, parseInt(this.value));
}
/*function setF32(){
	SavegameEditor._writeFloat32(this.offset, this.value, 0);
}
function setString(){
	SavegameEditor._writeString(this.offset, this.value);
}
function setString64(){
	SavegameEditor._writeString64(this.offset, this.value);
}
function setString256(){
	SavegameEditor._writeString256(this.offset, this.value);
}*/

var TOTKMasterEditor=(function(){
	var HASHES_PER_PAGE=100;
	var loaded=false;
	
	var HASHES=[];

	var parseHashFile=function(responseText){
		var lines=responseText.split('\n');

		for(var i=0; i<lines.length; i++){
			if(lines[i]){
				var data=lines[i].split(';');
				HASHES[parseInt(data[0], 16)]=[
					parseInt(data[1]),
					data[2]
				];
			}
		}
		loaded=true;

		document.getElementById('master-editor-loading').style.display='none';
		document.getElementById('master-editor-hidden').style.display='block';

		TOTKMasterEditor.refreshResults();
		get('input-custom-filter').focus();
	};

	return{
		isLoaded:function(){
			return loaded;
		},
		loadHashes:function(){
			if(this.isLoaded()){
				this.refreshResults();
				get('input-custom-filter').focus();
			}else if(typeof window.fetch==='function'){
				fetch('./zelda-totk.hashes.csv')
					.then(res => res.text()) // Gets the response and returns it as a blob
					.then(responseText => {
						parseHashFile(responseText);
					})
					.catch(function(){
						alert('Unexpected error: can\'t download hash file');
					});
			}else{
				var oReq=new XMLHttpRequest();
				oReq.open('GET', './zelda-totk.hashes.csv', true);
				oReq.responseType='text';

				oReq.onload=function(oEvent){
					if(this.status===200) {
						parseHashFile(responseText);
					}else{
						alert('Unexpected error: can\'t download hash file');
					}
				};

				oReq.onerror=function(oEvent){
					alert('Unexpected error: can\'t download hash file');
				};

				oReq.send(null);
			}
		},

		filterHashes:function(regexFilter){
			var findHashesIn;
			empty('table');
			this.filteredHashes=[];

			if(regexFilter){
				findHashesIn={};
				for(var hash in HASHES){
					if(regexFilter.test(HASHES[hash][1])){
						findHashesIn[hash]=true;
					}
				}
			}else{
				findHashesIn=HASHES;
			}

			var previousHashValue=0;
			for(var i=0x28; i<tempFile.fileSize-4; i+=8){
				var hashValue=tempFile.readU32(i);

				if(hashValue===previousHashValue)
					continue;
				previousHashValue=hashValue;

				if(findHashesIn[hashValue]){
					this.filteredHashes.push({
						type:HASHES[hashValue][0],
						id:HASHES[hashValue][1],
						offset:i
					});
				}else if(regexFilter===-1){
					this.filteredHashes.push({
						id:'* '+this._toHexInt(hashValue)
					});
				}
			}
			this.filteredHashes.sort(function(a,b){
				if(a.id<b.id)return -1;
				if(a.id>b.id)return 1;
				return 0;
			});
			
			this.currentPage=0;
			this.nPages=parseInt(this.filteredHashes.length/HASHES_PER_PAGE);
			if(this.filteredHashes.length%HASHES_PER_PAGE!==0){
				this.nPages++;
			}

			empty('select-page');
			for(var i=0; i<this.nPages; i++){
				var option=document.createElement('option');
				option.innerHTML=i+1;
				document.getElementById('select-page').appendChild(option);
			}
			this.setPage(0);

			return this.filteredHashes;
		},

		setPage:function(newPage){
			if(newPage>=0 && newPage<this.nPages){
				document.getElementById('select-page').selectedIndex=newPage;
				this.currentPage=newPage;

				var filteredHashes=this.filteredHashes.slice(this.currentPage*HASHES_PER_PAGE, HASHES_PER_PAGE+this.currentPage*HASHES_PER_PAGE);
				empty('table');
				var container=document.createElement('tbody');
				for(var i=0; i<filteredHashes.length; i++){
					var hash=filteredHashes[i];

					if(hash.type){
						createHashInput(container, hash.id, hash.type, hash.offset)
					}else{
						addEditorRow(container, hash.id);
					}
				}
				get('table').appendChild(container);
			}			
		},
		prevPage:function(){this.setPage(this.currentPage-1);},
		nextPage:function(){this.setPage(this.currentPage+1);},
		
		refreshResults:function(){
			var customFilter=getValue('custom-filter').trim();
			if(customFilter){
				this.filterHashes(new RegExp(customFilter, 'i'));
			}else{
				this.filterHashes(null);
			}
		}
	}
}());