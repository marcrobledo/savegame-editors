/*
	The legend of Zelda: Tears of the Kingdom - Master editor v20230603

	by Marc Robledo 2023
*/

var TOTKMasterEditor=(function(){
	const HASHES_PER_PAGE=100;

	var loaded=false;	
	var hashes=[];
	var allHashes=[];
	var filteredHashes;

	const BOOL=1;
	//const BOOL_ARRAY=2;
	const S32=3;
	//const S32_ARRAY=4;
	//const F32=5;
	//const F32_ARRAY=6;
	//const VECTOR2F=7;
	//const VECTOR2F_ARRAY=8;
	const VECTOR3F=9;
	//const VECTOR3F_ARRAY=10;
	//const VECTOR4F=11;
	//const VECTOR4F_ARRAY=12;
	//const STRING=13;
	//const STRING_ARRAY=14;
	//const STRING64=15;
	//const STRING64_ARRAY=16;
	//const STRING256=17;
	//const STRING256_ARRAY=18;

	var _addCustomHashesBoolean=function(customHashes, label){
		for(var i=0; i<customHashes.length; i++){
			hashes.push({
				hash:customHashes[i],
				hashHex:customHashes[i].toString(16),
				type:BOOL,
				id: label+' ['+i+']',
				enumValues:null
			})
			allHashes.push(customHashes[i]);
		}
	};

	var _addCustomHashesEnum=function(customHashes, label, options){
		options=options.map(function(value){
			return {value:murmurHash3.x86.hash32(value), name:value};
		});
		for(var i=0; i<customHashes.length; i++){
			hashes.push({
				hash:customHashes[i],
				hashHex:customHashes[i].toString(16),
				type:S32,
				id: label+' ['+i+']',
				enumValues:options
			})
			allHashes.push(customHashes[i]);
		}
	};

	var _parseHashFile=function(responseText){
		var lines=responseText.split('\n');

		for(var i=0; i<lines.length; i++){
			if(lines[i]){
				var data=lines[i].split(';');
				var hashInt=parseInt(data[0], 16);
				var options=null;
				if(data[3]){
					options=data[3].split(',').map(function(value){
						return {value:murmurHash3.x86.hash32(value), name:value};
					});
				}
				hashes.push({
					hash:hashInt,
					hashHex:data[0],
					type:parseInt(data[1]),
					id:data[2],
					enumValues:options
				});
				allHashes.push(hashInt);
			}
		}

		_addCustomHashesBoolean(Korok.HASHES_FOUND_HIDDEN, 'Korok found');
		_addCustomHashesEnum(Korok.HASHES_FOUND_CARRY, 'Korok carried', ['NotClear','Clear']);
		_addCustomHashesBoolean(Shrine.HASHES_FOUND, 'Shrine location found');
		_addCustomHashesEnum(Shrine.HASHES_STATUS, 'Shrine status', ['Hidden','Appear','Open','Enter','Clear']);
		_addCustomHashesBoolean(Lightroot.HASHES_FOUND, 'Lightroot location found');
		_addCustomHashesEnum(Lightroot.HASHES_STATUS, 'Lightroot status', ['Close','Open']);
		_addCustomHashesEnum(Compendium.HASHES_GOT_FLAGS, 'Compendium picture status', ['Unopened','TakePhoto','Buy']);
	};

	var _setBoolean=function(){
		tempFile.writeU32(this.offset, this.checked? 1: 0);
	}
	var _setS32=function(){
		tempFile.writeU32(this.offset, parseInt(this.value));
	}
	var _setF32=function(){
		tempFile.writeF32(this.offset, parseFloat(this.value));
	}
	var _setF32Negative=function(){
		var val=parseFloat(this.value);
		tempFile.writeF32(this.offset, val? -val : 0); //just in case, avoid storing -0
	}

	var _addEditorRow=function(container, left, right1, right2, right3){
		var tr=document.createElement('tr');
		tr.appendChild(document.createElement('td'));
		tr.appendChild(document.createElement('td'));

		tr.children[1].className='text-right';
		if(right1){
			tr.children[0].appendChild(label(right1.id, left));
			tr.children[1].appendChild(right1);
			if(right2)
				tr.children[1].appendChild(right2);
			if(right3)
				tr.children[1].appendChild(right3);
		}else{
			tr.children[0].innerHTML=left;
		}
		container.appendChild(tr);
	}
	var _createHashInput=function(container, hash){
		if(hash.type===BOOL){
			var c=checkbox(hash.hashHex);
			c.offset=hash.offset;
			c.addEventListener('change', _setBoolean);
			if(tempFile.readU32(hash.offset))
				c.checked=true;
			_addEditorRow(container, hash.id, c);
		}else if(hash.type===S32){
			if(hash.enumValues){
				var s=select(hash.hashHex, hash.enumValues, null, tempFile.readU32(hash.offset));
				s.offset=hash.offset;
				s.addEventListener('change', _setS32);
				_addEditorRow(container, hash.id, s);
			}else{
				var inp=inputNumber(hash.hashHex, -2147483648, 2147483647, tempFile.readU32(hash.offset));
				inp.className='text-right';
				inp.offset=hash.offset;
				inp.addEventListener('change', _setS32);
				_addEditorRow(container, hash.id, inp);
			}
		}else if(hash.type===VECTOR3F){
			var metadataOffset=tempFile.readU32(hash.offset);
			var inputX=inputFloat(hash.hashHex+'x', -10000, 10000, tempFile.readF32(metadataOffset));
			inputX.className='text-right';
			inputX.style='width:160px';
			inputX.offset=metadataOffset;
			inputX.addEventListener('change', _setF32);
			inputX.title='X';

			var inputY=inputFloat(hash.hashHex+'y', -10000, 10000, -tempFile.readF32(metadataOffset+8));
			inputY.className='text-right';
			inputY.style='width:160px';
			inputY.offset=metadataOffset+8;
			inputY.addEventListener('change', _setF32Negative);
			inputY.title='Y';

			var inputZ=inputFloat(hash.hashHex+'z', -10000, 10000, tempFile.readF32(metadataOffset+4));
			inputZ.className='text-right';
			inputZ.style='width:160px';
			inputZ.offset=metadataOffset+4;
			inputZ.addEventListener('change', _setF32);
			inputZ.title='Z';

			_addEditorRow(container, hash.id, inputX, inputY, inputZ);
		}else{
			_addEditorRow(container, hash.id+' (unknown)');
		}
	}
	return{
		isLoaded:function(){
			return loaded;
		},
		findOffsets:function(){
			var offsets=SavegameEditor._getOffsetsByHashes(allHashes);
			for(var i=0; i<hashes.length; i++){
				hashes[i].offset=offsets[hashes[i].hash];
			}
			this.forceFindOffsets=false;
		},
		focus:function(){
			this.refreshResults();
			get('input-custom-filter').focus();
		},
		initialize:function(){
			if(this.isLoaded()){
				this.focus();
			}else if(typeof window.fetch==='function'){
				fetch('./zelda-totk.hashes.csv')
					.then(res => res.text()) // Gets the response and returns it as a blob
					.then(responseText => {
						loaded=true;
						_parseHashFile(responseText);
						TOTKMasterEditor.findOffsets();

						document.getElementById('master-editor-loading').style.display='none';
						document.getElementById('master-editor-hidden').style.display='block';
						TOTKMasterEditor.focus();
					})
					.catch(function(){
						alert('Unexpected error: can\'t download master editor hashes file');
					});
			}else{
				alert('your browser doesn\'t support this feature');
			}
		},

		filterHashes:function(regexFilter){
			empty('table');

			if(regexFilter){
				filteredHashes=hashes.filter(function(a){
					return regexFilter.test(a.id);
				});
			}else{
				filteredHashes=hashes;
			}
			
			this.currentPage=0;
			this.nPages=Math.ceil(filteredHashes.length/HASHES_PER_PAGE);

			empty('select-page');
			for(var i=0; i<this.nPages; i++){
				var option=document.createElement('option');
				option.innerHTML=i+1;
				document.getElementById('select-page').appendChild(option);
			}
			this.setPage(0);

			return filteredHashes;
		},

		setPage:function(newPage){
			if(newPage>=0 && newPage<this.nPages){
				document.getElementById('select-page').selectedIndex=newPage;
				this.currentPage=newPage;

				var paginatedHashes=filteredHashes.slice(this.currentPage*HASHES_PER_PAGE, HASHES_PER_PAGE+this.currentPage*HASHES_PER_PAGE);
				empty('table');
				var container=document.createElement('tbody');
				for(var i=0; i<paginatedHashes.length; i++){
					var hash=paginatedHashes[i];

					if(hash.type){
						_createHashInput(container, hash)
					}else{
						_addEditorRow(container, hash.hash);
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