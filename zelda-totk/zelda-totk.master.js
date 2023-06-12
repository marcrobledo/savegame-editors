/*
	The legend of Zelda: Tears of the Kingdom - Master editor v20230612
	by Marc Robledo 2023	
	
	thanks to the immeasurable work, hash crack and research of MacSpazzy, MrCheeze and Karlos007
*/

var TOTKMasterEditor=(function(){
	const HASHES_PER_PAGE=100;

	const buildEnumOptions=function(value){
		return {value:murmurHash3.x86.hash32(value), name:value};
	};
	const COMMON_ENUMS={
		ShrineStatus:['Hidden','Appear','Open','Enter','Clear'],
		ShrineCrystalStatus:['Hidden','Point','Unlock','Open','Enter','Clear','UnlockToOpen','PointAndActiveWarp','ChangeToKeyStone','PresentedKeyCrystal'],
		LightrootStatus:['Close','Open'],
		KorokCarry:['NotClear','Clear'],
		CompendiumPhotos:['Unopened','TakePhoto','Buy'],
		
		HorseListBodyEyeColor:['Black','Blue'],
		HorseListBodyPattern:['00','01','02','03','04','05','06'],
		HorseListMane:['None','Horse_Link_Mane','Horse_Link_Mane_01','Horse_Link_Mane_02','Horse_Link_Mane_03','Horse_Link_Mane_04','Horse_Link_Mane_05','Horse_Link_Mane_06','Horse_Link_Mane_07','Horse_Link_Mane_08','Horse_Link_Mane_09','Horse_Link_Mane_00L','Horse_Link_Mane_00S','Horse_Link_Mane_10','Horse_Link_Mane_11','Horse_Link_Mane_12','Horse_Link_Mane_01L'],
		HorseListRein:['None','GameRomHorseReins_00','GameRomHorseReins_01','GameRomHorseReins_02','GameRomHorseReins_03','GameRomHorseReins_04','GameRomHorseReins_05','GameRomHorseReins_06','GameRomHorseReins_00L','GameRomHorseReins_00S'],
		HorseListSaddle:['None','GameRomHorseSaddle_00','GameRomHorseSaddle_01','GameRomHorseSaddle_02','GameRomHorseSaddle_03','GameRomHorseSaddle_04','GameRomHorseSaddle_05','GameRomHorseSaddle_06','GameRomHorseSaddle_00L','GameRomHorseSaddle_00S','GameRomHorseSaddle_07']
	};

	var loaded=false;	
	var hashes=[];
	var allHashes=[];
	var filteredHashes;

	var _parseHashFile=function(responseText){
		var lines=responseText.split('\n');

		for(var i=0; i<lines.length; i++){
			if(lines[i]){
				var data=lines[i].split(';');
				var hashInt=parseInt(data[0], 16);
				var options=null;
				if(data[1]==='Enum' || data[1]==='EnumArray'){
					if(data[3]){
						options=data[3].split(',').map(buildEnumOptions);
					}else if(/^KeyCrystalDungeonState\.Dungeon/.test(data[2])){
						options=COMMON_ENUMS.ShrineCrystalStatus;
					}else if(/^DungeonState\.Dungeon/.test(data[2])){
						options=COMMON_ENUMS.ShrineStatus;
					}else if(/^ArrivalPointState\.CheckPoint/.test(data[2])){
						options=COMMON_ENUMS.LightrootStatus;
					}else if(/^KorokCarryProgress\./.test(data[2])){
						options=COMMON_ENUMS.KorokCarry;
					}else if(/^PictureBookData\.(.*?)\.State/.test(data[2])){
						options=COMMON_ENUMS.CompendiumPhotos;
					}else if(/HorseList\.Body\.EyeColor/.test(data[2])){
						options=COMMON_ENUMS.HorseListBodyEyeColor;
					}else if(/HorseList\.Body\.Pattern/.test(data[2])){
						options=COMMON_ENUMS.HorseListBodyPattern;
					}else if(/HorseList\.Mane/.test(data[2])){
						options=COMMON_ENUMS.HorseListMane;
					}else if(/HorseList\.Rein/.test(data[2])){
						options=COMMON_ENUMS.HorseListRein;
					}else if(/HorseList\.Saddle/.test(data[2])){
						options=COMMON_ENUMS.HorseListSaddle;
					}
				}
				
				if(data[2]==='Unknown')
					data[2]+=' <span class="mono">'+data[0]+'</span>';
				hashes.push({
					hash:hashInt,
					hashHex:data[0],
					type:data[1],
					id:data[2],
					enumValues:options
				});
				allHashes.push(hashInt);
			}
		}
	};

	var _setBoolean=function(){
		tempFile.writeU32(this.offset, this.checked? 1: 0);
	}
	var _setU32=function(){
		tempFile.writeU32(this.offset, parseInt(this.value));
	}
	var _setS32=function(){
		tempFile.writeS32(this.offset, parseInt(this.value));
	}
	var _setF32=function(){
		tempFile.writeF32(this.offset, parseFloat(this.value));
	}
	var _setString64=function(){
		tempFile.writeString(this.offset, this.value, 0x40);
	}
	var _setWString16=function(){
		var bytes=new Array(0x20);
		for(var i=0; i<this.value.length; i++){
			var charCode=this.value.charCodeAt(i);
			bytes[i*2 + 0]=charCode & 0xff;
			bytes[i*2 + 1]=charCode >>> 8;
		}
		for(i=i*2; i<bytes.length; i++){
			bytes[i]=0;
		}
		tempFile.writeBytes(this.offset, bytes);
	}
	var _setF32Negative=function(){
		var val=parseFloat(this.value);
		tempFile.writeF32(this.offset, val? -val : 0); //just in case, avoid storing -0
	}

	var _createHashInputRow=function(container, hash, arrayIndex){
		var tr=document.createElement('tr');
		tr.appendChild(document.createElement('td'));
		tr.appendChild(document.createElement('td'));

		var offset=hash.offset;
		if(!offset)
			return;

		var hashType=hash.type;
		if(/String|Vector|Array/.test(hashType)){
			offset=tempFile.readU32(hash.offset);
			
			if(/Array$/.test(hashType)){
				if(typeof arrayIndex==='number'){
					offset+=0x04;
					if(/Vector2/.test(hashType)){
						offset+=arrayIndex*0x08;
					}else if(/Vector3/.test(hashType)){
						offset+=arrayIndex*0x0c;
					}else if(/String64/.test(hashType)){
						offset+=arrayIndex*0x40;
					}else if(/WString16/.test(hashType)){
						offset+=arrayIndex*0x20;
					}else{
						offset+=arrayIndex*0x04;
					}
					
					hashType=hashType.replace(/(ean)?Array$/, '');
				}else{
					var len=tempFile.readU32(offset);
					for(var i=0; i<len; i++){
						_createHashInputRow(container, hash, i);
					}
					return;
				}
			}
		}

		var fieldId=hash.hashHex+(typeof arrayIndex==='number'? '_'+arrayIndex:'');

		tr.children[0].appendChild(label(fieldId, hash.id+(typeof arrayIndex==='number'? ' ['+arrayIndex+']':'')));
		tr.children[1].className='text-right';



		if(hashType==='Bool'){
			var field=checkbox(fieldId);
			field.offset=offset;
			field.arrayIndex=arrayIndex;
			field.addEventListener('change', _setBoolean);
			if(tempFile.readU32(offset))
				field.checked=true;

			tr.children[1].appendChild(field);
		}else if(hashType==='Int' || hashType==='UInt'){
			var field;
			if(hashType==='UInt'){
				field=inputNumber(fieldId, 0, 4294967295, tempFile.readU32(offset));
				field.className='text-right';
				field.offset=offset;
				field.arrayIndex=arrayIndex;
				field.addEventListener('change', _setU32);
			}else{
				field=inputNumber(fieldId, -2147483648, 2147483647, tempFile.readU32(offset));
				field.className='text-right';
				field.offset=offset;
				field.arrayIndex=arrayIndex;
				field.addEventListener('change', _setS32);
			}

			tr.children[1].appendChild(field);
		}else if(hashType==='Enum' && hash.enumValues){
			var field=select(fieldId, hash.enumValues, null, tempFile.readU32(offset));
			field.offset=offset;
			field.arrayIndex=arrayIndex;
			field.addEventListener('change', _setU32);

			tr.children[1].appendChild(field);
		}else if(hashType==='Float'){
			var field=inputFloat(fieldId, -2147483648, 2147483647, tempFile.readF32(offset));
			field.className='text-right';
			field.offset=offset;
			field.arrayIndex=arrayIndex;
			field.addEventListener('change', _setF32);

			tr.children[1].appendChild(field);
		}else if(hashType==='Vector2'){
			var inputX=inputFloat(fieldId, -2147483648, 2147483647, tempFile.readF32(offset));
			inputX.className='text-right';
			inputX.style='width:160px';
			inputX.offset=offset;
			inputX.arrayIndex=arrayIndex;
			inputX.addEventListener('change', _setF32);
			inputX.title='X';

			var inputY=inputFloat(fieldId+'y', -2147483648, 2147483647, tempFile.readF32(offset+8));
			inputY.className='text-right';
			inputY.style='width:160px';
			inputY.offset=offset+8;
			inputY.arrayIndex=arrayIndex;
			inputY.addEventListener('change', _setF32);
			inputY.title='Y';

			tr.children[1].appendChild(inputX);
			tr.children[1].appendChild(inputY);
		}else if(hashType==='Vector3'){
			var inputX=inputFloat(fieldId, -2147483648, 2147483647, tempFile.readF32(offset));
			inputX.className='text-right';
			inputX.style='width:160px';
			inputX.offset=offset;
			inputX.arrayIndex=arrayIndex;
			inputX.addEventListener('change', _setF32);
			inputX.title='X';

			var inputY=inputFloat(fieldId+'y', -2147483648, 2147483647, -tempFile.readF32(offset+8));
			inputY.className='text-right';
			inputY.style='width:160px';
			inputY.offset=offset+8;
			inputY.arrayIndex=arrayIndex;
			inputY.addEventListener('change', _setF32Negative);
			inputY.title='Y';

			var inputZ=inputFloat(fieldId+'z', -2147483648, 2147483647, tempFile.readF32(offset+4));
			inputZ.className='text-right';
			inputZ.style='width:160px';
			inputZ.offset=offset+4;
			inputZ.arrayIndex=arrayIndex;
			inputZ.addEventListener('change', _setF32);
			inputZ.title='Z';

			tr.children[1].appendChild(inputX);
			tr.children[1].appendChild(inputY);
			tr.children[1].appendChild(inputZ);
		}else if(hashType==='String64'){
			var field=input(fieldId, tempFile.readString(offset, 0x40));
			field.className='text-right';
			field.offset=offset;
			field.arrayIndex=arrayIndex;
			field.addEventListener('change', _setString64);

			tr.children[1].appendChild(field);
		}else if(hashType==='WString16'){
			var str='';
			for(var i=0; i<0x20; i+=2){
				var charCode=tempFile.readU16(offset+i);
				if(!charCode)
					break;
				str+=String.fromCharCode(charCode);
			}

			var field=input(fieldId, str.replace(/\u0000+$/,''));
			field.className='text-right';
			field.offset=offset;
			field.arrayIndex=arrayIndex;
			field.addEventListener('change', _setWString16);

			tr.children[1].appendChild(field);
		}else{
			var span=document.createElement('span');
			span.innerHTML='Type: '+hashType;

			tr.children[1].appendChild(span);
		}

		container.appendChild(tr);
	}

	return{
		isLoaded:function(){
			return loaded;
		},
		findOffsets:function(){
			//var debugText=''; //remove not found hashes
			var offsets=SavegameEditor._getOffsetsByHashes(allHashes);
			for(var i=0; i<hashes.length; i++){
				hashes[i].offset=offsets[hashes[i].hash];

				/*if(hashes[i].offset){
					debugText+=hashes[i].hashHex+';'+hashes[i].type+';'+hashes[i].id;
					if(hashes[i].enumValues)
						debugText+=';'+hashes[i].enumValues.map(function(a){return a.name}).join(',');
					debugText+='\n<br/>';
				}*/
			}
			this.forceFindOffsets=false;
			//document.body.innerHTML=debugText;
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
						for(var field in COMMON_ENUMS){
							COMMON_ENUMS[field]=COMMON_ENUMS[field].map(buildEnumOptions);
						}
						
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

					_createHashInputRow(container, hash, null);
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