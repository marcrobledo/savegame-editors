/*
	The legend of Zelda: Tears of the Kingdom - Master editor v20240403
	by Marc Robledo 2023-2024
	
	thanks to the immeasurable work, hash crack and research of MacSpazzy, MrCheeze and Karlos007
*/

var TOTKMasterEditor=(function(){
	const HASHES_PER_PAGE=100;

	var loaded=false;	
	var hashes=[];
	var allHashes=[];
	var filteredHashes;

	var currentMini;

	var _parseHashFile=function(responseText){
		var enumValues=[];
		var lines=responseText.split('\n');

		for(var i=0; i<lines.length; i++){
			if(/^EnumValues;/.test(lines[i])){
				var data=lines[i].split(';');
				var matches=data[1].split(',');
				var options=data[2].split(',').map(function(value){
					return {value:hash(value), name:value};
				});
				for(var j=0; j<matches.length; j++){
					enumValues.push({
						regex:new RegExp('^'+matches[j].replace(/\./g, '\\.').replace(/\*/g, '.+?')+'$'),
						options:options
					});
				}
			}else if(/^[0-9a-f]{8};/.test(lines[i])){
				var data=lines[i].split(';');
				var hashInt=parseInt(data[0], 16);
				var options=null;
				if(data[1]==='Enum' || data[1]==='EnumArray'){
					for(var j=0; j<enumValues.length; j++){
						if(enumValues[j].regex.test(data[2])){
							options=enumValues[j].options;
							break;
						}
					}
				}

				if(data[2]==='Unknown')
					data[2]+=' <span class="mono">'+data[0]+'</span>';

				hashes.push({
					hash:hashInt,
					hashHex:data[0],
					hashText:data[2],
					label:data[3],
					type:data[1],
					enumValues:options
				});
				allHashes.push(hashInt);
			}
		}
	};


	var _setBooleanBit=function(){
		var offset=this.offset;
		offset+=Math.floor(this.arrayIndex / 8);
		var fullByte=tempFile.readU8(offset);
		var bitMask=1 << (this.arrayIndex % 8);
		if(this.checked)
			fullByte|=bitMask;
		else
			fullByte&=((~bitMask & 0xff) >>> 0);
		tempFile.writeU8(offset, fullByte);
	}
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

	var _createHashInputRow=function(container, hashInfo, arrayIndex){
		var tr=document.createElement('tr');
		tr.appendChild(document.createElement('td'));
		tr.appendChild(document.createElement('td'));

		var offset=hashInfo.offset;
		if(!offset)
			return;

		var hashType=hashInfo.type;
		if(/UInt64|String|Vector|Array/.test(hashType)){
			offset=tempFile.readU32(hashInfo.offset);
			
			if(/Array$/.test(hashType)){
				if(typeof arrayIndex==='number'){
					offset+=0x04;
					if(/Bool/.test(hashType)){
						//if boolArray, calculate bit offset during checkbox change
					}else if(/UInt64|Vector2/.test(hashType)){
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
						_createHashInputRow(container, hashInfo, i);
					}
					return;
				}
			}
		}

		var fieldId=hashInfo.hashHex+(typeof arrayIndex==='number'? '_'+arrayIndex:'');
		var hashLabel=hashInfo.label || hashInfo.hashText;

		tr.children[0].appendChild(label(fieldId, hashLabel+(typeof arrayIndex==='number'? ' ['+arrayIndex+']':'')));
		tr.children[0].title='Hash: '+hashInfo.hashHex+' - Offset: '+Variable.toHexString(hashInfo.offset);
		tr.children[1].className='text-right';



		if(hashType==='Bool'){
			var field=checkbox(fieldId);
			field.offset=offset;
			field.arrayIndex=arrayIndex;
			if(typeof arrayIndex==='number'){
				field.addEventListener('change', _setBooleanBit);
				
				var byteRead=tempFile.readU8(offset + (Math.floor(arrayIndex / 8)));
				if((byteRead >> ((arrayIndex % 8))) & 0x01)
					field.checked=true;
			}else{
				field.addEventListener('change', _setBoolean);
				if(tempFile.readU32(offset))
					field.checked=true;
			}

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
				field.addEventListener('change',_setS32);
			}

			tr.children[1].appendChild(field);
		}else if(hashType==='Enum' && hashInfo.enumValues){
			var field=select(fieldId, hashInfo.enumValues, null, tempFile.readU32(offset));
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
		}else if(hashType==='UInt64'){
			if(/Timer/.test(hashInfo.hashText)){
				var input1=inputFloat(fieldId, -2147483648, 2147483647, tempFile.readF32(offset));
				input1.addEventListener('change', _setF32);
			}else{
				var input1=inputNumber(fieldId, 0, 4294967295, tempFile.readU32(offset));
				input1.addEventListener('change', _setU32);
			}
			input1.className='text-right';
			input1.style='width:160px';
			input1.offset=offset;
			input1.arrayIndex=arrayIndex;

			var input2=inputNumber(fieldId, 0, 4294967295, tempFile.readU32(offset+4));
			input2.className='text-right';
			input2.style='width:160px';
			input2.offset=offset + 4;
			input2.arrayIndex=arrayIndex;
			input2.addEventListener('change', _setU32);

			if(/Timer/.test(hashInfo.hashText)){
				input1.title='seconds';
				input2.title='days';
			}

			tr.children[1].appendChild(input1);
			tr.children[1].appendChild(input2);
		}else if(hashType==='Vector2'){
			var inputX=inputFloat(fieldId, -2147483648, 2147483647, tempFile.readF32(offset));
			inputX.className='text-right';
			inputX.style='width:160px';
			inputX.offset=offset;
			inputX.arrayIndex=arrayIndex;
			inputX.addEventListener('change', _setF32);
			inputX.title='X';

			var inputY=inputFloat(fieldId+'y', -2147483648, 2147483647, tempFile.readF32(offset+4));
			inputY.className='text-right';
			inputY.style='width:160px';
			inputY.offset=offset+4;
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
					debugText+=hashes[i].hashHex+';'+hashes[i].type+';'+hashes[i].hashText;
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
		toggleImportButton:function(){
			document.getElementById('row-hashes-import').className=this.gameMod? '' : 'hide';
		},
		initialize:function(){
			TOTKMasterEditor.toggleImportButton();

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

						get('input-custom-filter').addEventListener('change', function(){
							this.value=this.value.replace(/[^A-Za-z0-9_\.\*]/g,'').trim();
							TOTKMasterEditor.refreshResults();
						});

						get('button-hashes-import').addEventListener('click', function(){
							document.getElementById('input-file-hashes-import').click();
						});
						get('input-file-hashes-import').addEventListener('change', function(){
							var fr=new FileReader();
							fr.addEventListener('load', function(evt){
								_parseHashFile(fr.result);
								TOTKMasterEditor.findOffsets();
							});
							fr.readAsText(this.files[0]);
						});

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
					return regexFilter.test(a.hashText) || (a.label && regexFilter.test(a.label));
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
					var hashInfo=paginatedHashes[i];

					_createHashInputRow(container, hashInfo, null);
				}
				window.requestAnimationFrame(function(){get('table').appendChild(container)});;
			}			
		},
		prevPage:function(){this.setPage(this.currentPage-1);},
		nextPage:function(){this.setPage(this.currentPage+1);},
		
		refreshResults:function(){
			var customFilter=getValue('custom-filter').trim();
			if(customFilter){
				var regexes=[];
				customFilter.split(' OR ').forEach(function(f){
					regexes.push(f.replace(/\./g, '\\.').replace(/\*/g, '.+?'));
				});
				this.filterHashes(new RegExp(regexes.join('|'), 'i'));
			}else{
				this.filterHashes(null);
			}
		},







		mini:function(struct, buttons, modalTitle, onSave){
			currentMini={
				struct:struct,
				onSave:onSave,
			};

			var container=$('#modal-hash-editor-body').empty();
			struct.buildHtmlInputRows().forEach(function(row){
				container.append(row);
			});

			$('#modal-hash-editor-footer-right').empty();

			$('#modal-hash-editor-footer-right')
				.append(
					$('<button></button>')
						.addClass('btn')
						.html(Locale._('Cancel'))
						.on('click', function(){
							$(this).parent().parent().parent().get(0).close();
						})
				)
			if(buttons){
				if(!buttons.length)
					buttons=[buttons];

				for(var i=0; i<buttons.length; i++){
					$('#modal-hash-editor-footer-right')
						.append(
							$('<button></button>')
								.addClass('btn')
								.html(Locale._(buttons[i].label))
								.on('click', buttons[i].action)
						);
				}
			}
			$('#modal-hash-editor-footer-right')
				.append(
					$('<button></button>')
						.html(Locale._('Save'))
						.addClass('btn btn-primary')
						.on('click', function(){
							currentMini.struct.saveAll();
							if(currentMini.onSave)
								currentMini.onSave.call();
							$(this).parent().parent().parent().get(0).close();
						})
				);

			$('#modal-hash-editor-header').html(modalTitle)
			UI.modal('hash-editor');
		},
		miniResetAll:function(){
			var nChanges=0;
			currentMini.struct.variables.forEach(function(variable){
				if(variable._structId)
					return false;
				if(variable.value!==0){
					variable.value=0;
					variable.updateHtmlInputValue();
					nChanges++;
				}
			});
			return nChanges;
		},
		miniSetAllToOneAtLeast:function(){
			var nChanges=0;
			currentMini.struct.variables.forEach(function(variable){
				if(variable._structId)
					return false;
				if(variable.value===0){
					variable.value=1;
					variable.updateHtmlInputValue();
					nChanges++;
				}
			});
			return nChanges;
		},
		miniExport:function(){
			var myJson=currentMini.struct.export();
			var blob = new Blob([JSON.stringify(myJson, null, '\t')], {type: 'application/json;charset=utf-8'});
			saveAs(blob, 'totk_'+currentMini.struct._structId+'.json');
		},
		miniImport:function(importedObject){
			return currentMini.struct.import(importedObject);
		}
	}
}());