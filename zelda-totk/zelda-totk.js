/*
	The legend of Zelda: Tears of the Kingdom savegame editor (last update 2024-02-11)

	by Marc Robledo 2023-2024
*/

var currentEditingItem;

SavegameEditor={
	Name:'The legend of Zelda: Tears of the Kingdom',
	Filename:['progress.sav','caption.sav'],
	Version:20240102,

	/* Settings */
	Settings:{
		lang:'en'
	},

	/* Constants */
	Constants:{
		GAME_VERSIONS:[
			{version:'v1.0', fileSize:2307552, header:0x0046c3c8, metaDataStart:0x0003c050},
			{version:'v1.1.x/v1.2.0', fileSize:2307656, header:0x0047e0f4, metaDataStart:0x0003c088}
		]
	},

	/* Hashes */
	Hashes:[
		0xfbe01da1, 'PlayerStatus.MaxLife', false,
		0xa77921d7, 'PlayerStatus.CurrentRupee', false,
		//0x31ab5580, 'PlayerStatus.Life',
		0xf9212c74, 'PlayerStatus.MaxStamina', false,
		0x15ec5858, 'HorseInnMemberPoint', false,
		0xe573f564, 'Playtime', false, //unknown key
		0xafd01d68, 'PlayerStatus.MaxEnergy', false,

		0xc884818d, 'PlayerStatus.SavePos', true, //Vector3F
		0x1d6189da, 'Sequence_CurrentBanc', true, //String64
		0xd7a3f6ba, 'Pouch.Weapon.ValidNum', true,
		0xc61785c2, 'Pouch.Bow.ValidNum', true,
		0x05271e7d, 'Pouch.Shield.ValidNum', true,

		0x14d7f4c4, 'MapData.IconData.StampData.Type', true,
		0xf24fc2e7, 'MapData.IconData.StampData.Pos', true,
		0xd2025694, 'MapData.IconData.StampData.Layer', true,

		0xd27f8651, 'AutoBuilder.Draft.Content.Index', true, //S32, array length=30
		0xa56722b6, 'AutoBuilder.Draft.Content.CombinedActorInfo', true, //binary data (size=6688)
		0xc5bf2815, 'AutoBuilder.Draft.Content.CameraPos', true, //Vector3F
		0xef74dca7, 'AutoBuilder.Draft.Content.CameraAt', true //Vector3F
	],


	/* read/write data */
	readU32:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number')
			return tempFile.readU32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x04);
		return tempFile.readU32(SavegameEditor.Offsets[hashKey]);
	},
	readS32:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number')
			return tempFile.readS32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x04);
		return tempFile.readS32(SavegameEditor.Offsets[hashKey]);
	},
	readF32:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number')
			return tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x04);
		return tempFile.readF32(SavegameEditor.Offsets[hashKey]);
	},
	readVector2F:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number'){
			return {
				x: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x08),
				y: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x08 + 0x04)
			}
		}
		return {
			x: tempFile.readF32(SavegameEditor.Offsets[hashKey]),
			y: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04)
		}
	},
	readVector3F:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number'){
			return {
				x: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x0c),
				y: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x0c + 0x04),
				z: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x0c + 0x08)
			}
		}
		return {
			x: tempFile.readF32(SavegameEditor.Offsets[hashKey]),
			y: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04),
			z: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x08)
		}
	},
	readString64:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number')
			return tempFile.readString(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x40, 0x40).replace(/\u0000+$/,'');
		return tempFile.readString(SavegameEditor.Offsets[hashKey], 0x40).replace(/\u0000+$/,'');
	},
	readStringUTF8:function(hashKey, arrayIndex){
		var offset=this.Offsets[hashKey];
		if(typeof arrayIndex==='number')
			offset+=0x04 + arrayIndex*0x20;
		var str='';
		for(var i=0; i<0x20; i+=2){
			var charCode=tempFile.readU16(offset);
			if(!charCode)
				break;
			str+=String.fromCharCode(charCode);
			offset+=2;
		}
		return str.replace(/\u0000+$/,'');
	},

	_readArray:function(hashKey, arrayIndex, callback){
		var arraySize=SavegameEditor.readU32(hashKey);
		if(typeof arrayIndex==='number'){
			if(arrayIndex>=0 && arrayIndex<arraySize)
				return callback(hashKey, arrayIndex);
			return null;
		}
		var elems=[];
		for(var i=0; i<arraySize; i++){
			elems.push(callback(hashKey, i));
		}
		return elems;
	},
	readU32Array:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readU32);
	},
	readS32Array:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readS32);
	},
	readVector3FArray:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readVector3F);
	},
	readString64Array:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readString64);
	},
	readStringUTF8Array:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readStringUTF8);
	},
	readBinaryArray:function(hashKey, arrayIndex){
		var allData=[];
		var offset=this.Offsets[hashKey];
		var max=tempFile.readU32(offset);
		offset+=4;
		for(var i=0; i<max; i++){
			var len=tempFile.readU32(offset);
			offset+=4;
			var data=tempFile.readBytes(offset, len);
			if(typeof arrayIndex==='number'){
				if(i===arrayIndex)
					return data;
			}else{
				allData.push(data);
			}
			offset+=len;
		}
		return allData;
	},

	writeU32:function(hashKey, arrayIndex, value){
		if(typeof arrayIndex==='number')
			tempFile.writeU32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x04, value);
		else
			tempFile.writeU32(this.Offsets[hashKey], value);
	},
	writeS32:function(hashKey, arrayIndex, value){
		if(typeof arrayIndex==='number')
			tempFile.writeS32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x04, value);
		else
			tempFile.writeS32(this.Offsets[hashKey], value);
	},
	writeString64:function(hashKey, arrayIndex, value){
		if(typeof arrayIndex==='number')
			tempFile.writeString(this.Offsets[hashKey] + 0x04 + arrayIndex*0x40, value, 0x40);
		else
			tempFile.writeString(this.Offsets[hashKey], value, 0x40);
	},
	writeStringUTF8:function(hashKey, arrayIndex, value){
		var bytes=new Array(0x20);
		for(var i=0; i<value.length; i++){
			var charCode=value.charCodeAt(i);
			bytes[i*2 + 0]=charCode & 0xff;
			bytes[i*2 + 1]=charCode >>> 8;
		}
		for(i=i*2; i<bytes.length; i++){
			bytes[i]=0;
		}

		if(typeof arrayIndex==='number')
			tempFile.writeBytes(this.Offsets[hashKey] + 0x04 + arrayIndex*0x20, bytes);
		else
			tempFile.writeBytes(this.Offsets[hashKey], bytes);
	},
	writeF32:function(hashKey, arrayIndex, value){
		if(typeof arrayIndex==='number')
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x04, value);
		else
			tempFile.writeF32(this.Offsets[hashKey], value);
	},
	writeVector2F:function(hashKey, arrayIndex, vector){
		if(typeof arrayIndex==='number'){
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x08, vector.x);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x08 + 0x04, vector.y);
		}else{
			tempFile.writeF32(this.Offsets[hashKey], vector.x);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04, vector.y);
		}
	},
	writeVector3F:function(hashKey, arrayIndex, vector){
		var offset=tempFile.readF32(SavegameEditor.Offsets[hashKey]);
		if(typeof arrayIndex==='number'){
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x0c, vector.x);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x0c + 0x04, vector.y);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x0c + 0x08, vector.z);
		}else{
			tempFile.writeF32(this.Offsets[hashKey], vector.x);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04, vector.y);
			tempFile.writeF32(this.Offsets[hashKey] + 0x08, vector.z);
		}
	},
	writeBinary:function(hashKey, arrayIndex, data){
		var offset=this.Offsets[hashKey];
		var max=tempFile.readU32(offset);
		offset+=4;
		for(var i=0; i<max; i++){
			var len=tempFile.readU32(offset);
			offset+=4;
			if(arrayIndex===i){
				tempFile.writeBytes(offset, data);
				return true;
			}
			offset+=len;
		}
		return false;
	},


	/* settings */
	loadSettings:function(){
		if(typeof localStorage==='object' && localStorage.getItem('zelda-totk-sge-settings')){
			var loadedSettings=JSON.parse(localStorage.getItem('zelda-totk-sge-settings'));
			if(typeof loadedSettings.lang==='string'){
				this.Settings.lang=loadedSettings.lang.toLowerCase().trim();
			}
		}
	},
	saveSettings:function(){
		if(typeof localStorage==='object'){
			localStorage.setItem('zelda-totk-sge-settings', JSON.stringify(this.Settings));
		}
	},



	/* private functions */
	_getOffsets:function(){
		var ret=true;
		this.Offsets={};
		for(var i=0x000028; i<Variable.hashTableEnd; i+=8){
			var hash=tempFile.readU32(i);
			var foundHashIndex=this.Hashes.indexOf(hash);
			if(hash===0xa3db7114){ //guidsArray
				this.guidsArrayOffset=tempFile.readU32(i+4);
				break;
			}else if(foundHashIndex!==-1){
				if(this.Hashes[foundHashIndex+2]) //isPointer
					this.Offsets[this.Hashes[foundHashIndex+1]]=tempFile.readU32(i+4);
				else
					this.Offsets[this.Hashes[foundHashIndex+1]]=i+4;
			}
		}
		for(var i=0; i<this.Hashes.length; i+=3){
			if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.error('hash '+this.Hashes[i+1]+' not found');
				ret=false;
			}
		}
		this.guidsArray=[];
		for(var i=this.guidsArrayOffset; i<tempFile.fileSize; i+=8){
			var lower=tempFile.readU32(i);
			var upper=tempFile.readU32(i+4);
			if(lower===0 && upper===0){
				break;
			}
			lower=Variable.toHexString(lower).replace('0x','');
			upper=Variable.toHexString(upper);
			this.guidsArray.push(BigInt(upper+lower));
		}
		return ret;
	},
	_getOffsetsByHashes:function(hashes, single){
		var offsets={};
		for(var i=0x000028; i<Variable.hashTableEnd; i+=8){
			var hash=tempFile.readU32(i);
			var foundHashIndex=hashes.indexOf(hash);
			if(hash===0xa3db7114){ //found MetaData.SaveTypeHash
				break;
			}else if(foundHashIndex!==-1){
				if(single)
					return i+4;
				offsets[hashes[foundHashIndex]]=i+4;
			}
		}
		for(var i=0; i<hashes.length; i++){
			if(typeof offsets[hashes[i]] === 'undefined'){
				console.error('hash ['+i+']:'+hashes[i].toString(16)+' not found');
			}
		}
		if(single)
			return false;
		return offsets;
	},
	_findGuid:function(guid){
		if(typeof guid==='string')
			guid=BigInt(guid);
		else if(typeof guid!=='bigint')
			throw new Error('Invalid BigInt value');

		for(var i=0; i<this.guidsArray.length; i++){
			if(guid===this.guidsArray[i])
				return true;
		}
		return false;
	},
	_addGuid:function(guid){
		if(typeof guid==='string')
			guid=BigInt(guid);
		else if(typeof guid!=='bigint')
			throw new Error('Invalid BigInt value');

		this.guidsArray.push(guid);
	},
	_saveGuidsArray:function(){
		this.guidsArray.sort(function(a, b){
			if(a > b)
				return 1;
			else if(a < b)
				return -1;
			else
				return 0;
		});

		var offset=this.guidsArrayOffset;
		for(var i=0; i<this.guidsArray.length; i++){
			var split=Variable.splitUInt64(this.guidsArray[i]);
			tempFile.writeU32(offset, split[0]);
			tempFile.writeU32(offset+4, split[1]);
			offset+=8;
		}
		tempFile.writeU32(offset, 0x00000000);
		tempFile.writeU32(offset+4, 0x00000000);
	},
	_cacheStructOffsets:function(structInfo){
		var allCached=true;
		for(var i=0; i<structInfo.length; i++){
			if(typeof structInfo[i].hash==='string'){
				structInfo[i].hashText=structInfo[i].hash;
				structInfo[i].hash=hash(structInfo[i].hash);
			}

			if(!this.Offsets[structInfo[i].hash])
				allCached=false;
		}

		if(!allCached){
			var offsets=this._getOffsetsByHashes(structInfo.map(function(obj){
				return obj.hash;
			}))
			for(var i=0; i<structInfo.length; i++){
				if(/Array|Vector|String/.test(structInfo[i].type)){
					this.Offsets[structInfo[i].hash]=tempFile.readU32(offsets[structInfo[i].hash]);
				}else{
					this.Offsets[structInfo[i].hash]=offsets[structInfo[i].hash];
				}
			}
		}
	},
	_readStruct:function(structInfo){
		this._cacheStructOffsets(structInfo);

		var ret={};
		for(var i=0; i<structInfo.length; i++){
			var val;

			if(structInfo[i].type==='AnotherType'){
			}else{
				//type not defined, assuming Int/Bool
				val=tempFile.readS32(this.Offsets[structInfo[i].hash]);
			}
			ret[structInfo[i].hashText]=val;
		}
		return ret;
	},

	_removeItem:function(catId, itemToRemove){
		var pouch=this.pouches[catId];
		var removedItem=pouch.remove(itemToRemove);
		if(removedItem){
			document.getElementById('container-'+catId).removeChild(removedItem._htmlRow);
			
			if(catId==='arrows')
				SavegameEditor.refreshAddArrowsButton();
		}
	},

	addItem:function(catId, itemId, quantity){
		var pouch=this.pouches[catId];


		if(typeof itemId==='string'){
			quantity=typeof quantity==='number' && quantity>0? quantity : 1;
			var foundItem=pouch.findItemById(itemId);
			if(foundItem){
				foundItem.quantity+=quantity;
				Pouch.updateItemRow(foundItem);
			}else if(!pouch.isFull()){
				var newItem=pouch.add({id:itemId, quantity:quantity});
				document.getElementById('container-'+catId).appendChild(Pouch.updateItemRow(newItem));
			}
			return quantity;
		}

		if(pouch.isFull()){
			console.warn('not enough space in '+catId);
			return false;
		}

		var lastItem=pouch.getLast();

		var itemListArray=this.getAvailableItems(catId);

		var newId;
		if(lastItem){
			var nextIndexId=itemListArray.indexOf(lastItem.id)+1;
			if(nextIndexId===itemListArray.length)
				nextIndexId=0;

			newId=itemListArray[nextIndexId];

			if(catId==='armors')
				while(Armor.INFO[newId].base !== newId){
					newId=itemListArray[nextIndexId++];
				}
		}else{
			newId=itemListArray[0];
		}

		var newItem;
		if(lastItem){
			var newItemData=lastItem.export();
			newItemData.id=newId;
			newItem=pouch.add(newItemData);
		}else{
			newItem=pouch.add({id:newId});
		}


		var row=Pouch.updateItemRow(newItem);
		document.getElementById('container-'+newItem.category).appendChild(row);
		Pouch.scrollToItem(newItem);

		if(catId==='arrows'){
			var equipIndex=new Variable('Pouch.Arrow.EquipIndex', 'IntArray');
			if(equipIndex.value[0]===-1){
				equipIndex.value[0]=0;
				equipIndex.save();
				UI.toast('Fixed arrows equip index');
			}
			this.refreshAddArrowsButton();
		}

		SavegameEditor.fixItemAvailabilityFlag(newItem);

		return true;
	},
	
	fixItemAvailabilityFlag:function(item){
		if(item.category==='key'){
			var fixed=false;

			var variable;
			if(/^Obj_SubstituteCloth_/.test(item.id)){
				variable=new Variable('OwnedParasailPattern.'+item.id.replace('Obj_SubstituteCloth_','Pattern').replace('PatternDefault','Default'), 'Bool');
			}else if(/^GameRomHorseReins_/.test(item.id)){
				variable=new Variable('OwnedCustomizableHorseTack_Reins.'+item.id, 'Bool');
			}else if(/^GameRomHorseSaddle_/.test(item.id)){
				variable=new Variable('OwnedCustomizableHorseTack_Saddle.'+item.id, 'Bool');
			}
			if(variable && !variable.value){
				variable.value=true;
				variable.save();
				UI.toast(_('Fixed necessary usability flags for %s').replace('%s', '<strong>'+_(item.getItemTranslation())+'</strong>'), 'flags-fixed');
			}
		}
	},
	
	
	
	getAvailableItems:function(catId, query){
		var allItems;
		if(catId==='weapons' || catId==='bows' || catId==='shields')
			allItems=Equipment.AVAILABILITY[catId];
		else if(catId==='armors')
			allItems=Armor.AVAILABILITY;
		else if(catId==='arrows' || catId==='materials' || catId==='food' || catId==='devices' || catId==='key')
			allItems=Item.AVAILABILITY[catId];
		else if(catId==='horses')
			allItems=Horse.AVAILABILITY;
		else
			return null;

		if(query){
			query = query.slug();

			return allItems.filter(function(itemName){
				let nameSlug = SavegameEditor.nameMap.get(itemName);
				if(!nameSlug){
					nameSlug = _(itemName).slug();
					SavegameEditor.nameMap.set(itemName, nameSlug);
				}

				return nameSlug.includes(query)
			});
		}else{
			return allItems;
		}
	},
	editItem:function(item){
		currentEditingItem=item;

		/* prepare edit item selector */
		item._htmlItemId.style.display='none';
		item._htmlRow.children[0].appendChild(this.itemChangeDropdown);

		this.filterDropdownItems('');
		if(SavegameEditor.customItemDropdown){
			this.itemFilterInput.setAttribute('placeholder', _(item.id));
			this.itemFilterInput.value='';
			this.itemFilterInput.focus();
		}else{
			this.itemChangeDropdown.value=item.id;
			this.itemChangeDropdown.click();
			this.itemChangeDropdown.focus();
		}

		item.lastInputChanged='id';
		for(var prop in item._htmlInputs){
			item._htmlInputs[prop].disabled=true;
		}
	},
	editItemEnd:function(newId){
		if(currentEditingItem){
			for(var prop in currentEditingItem._htmlInputs){
				currentEditingItem._htmlInputs[prop].disabled=false;
			}

			if(newId && currentEditingItem.id!==newId){
				currentEditingItem.id=newId;
				Pouch.updateItemIcon(currentEditingItem);
				Pouch.updateItemRow(currentEditingItem);
				SavegameEditor.fixItemAvailabilityFlag(currentEditingItem);
			}

			currentEditingItem._htmlItemId.style.display='inline';
		}

		this.itemFilterInput.parentElement.parentElement.removeChild(this.itemFilterInput.parentElement);

		currentEditingItem=null;
	},
	filterDropdownItems: function(query){
		var itemList=this.getAvailableItems(currentEditingItem.category, query);
		
		if(SavegameEditor.customItemDropdown){
			this.itemFilterResults.innerHTML='';
			var activeEl;

			itemList.forEach(el => {
				var option = document.createElement('div');
				option.className = 'option';
				option.setAttribute('itemId',el);
				option.addEventListener('mousedown', function(event){
					event.preventDefault();
					event.stopPropagation();
					SavegameEditor.editItemEnd(this.getAttribute('itemId'));
				});
				if(el===currentEditingItem.id)
					activeEl=option;

				var itemIcon = new Image();
				itemIcon.className='item-icon';
				itemIcon.loading='lazy';
				itemIcon.onerror=function(){
					this.src=ICON_PATH+'unknown.png';
				}
				if(currentEditingItem instanceof Armor){
					itemIcon.src = Pouch.getItemIcon(new Armor(Object.assign({...currentEditingItem},{id:el})));
				} else {
					itemIcon.src = Pouch.getItemIcon(Object.assign({...currentEditingItem},{id:el}));
				}
				option.appendChild(itemIcon);

				var name = document.createElement('span');
				name.className='item-name';
				name.innerText = _(el);
				option.appendChild(name);

				this.itemFilterResults.appendChild(option);
			});

			if(!activeEl && this.itemFilterResults.children.length){
				activeEl=this.itemFilterResults.children[0];
			}

			if(activeEl){
				activeEl.className+=' active';
				var optionOffsetTop = activeEl.offsetTop;

				this.itemFilterResults.scrollTo(0, optionOffsetTop - 8);
			}
		}else{ //prefer classic dropdown in devices with touch events for UX purposes
			if(this.itemChangeDropdown.lastCategory !== currentEditingItem.category){
				this.itemChangeDropdown.lastCategory=currentEditingItem.category;
				this.itemChangeDropdown.innerHTML='';

				for(var i=0; i<itemList.length; i++){
					var opt=document.createElement('option');
					opt.value=itemList[i];
					opt.innerHTML=_(itemList[i]);
					this.itemChangeDropdown.appendChild(opt);
				}
			}
		}
	},



	restoreDurability:function(equipment){
		if(equipment.restoreDurability()){
			Pouch.updateItemRow(equipment);
			return true;
		}

		return false;
	},
	restoreDurabilityAll:function(catId){
		var nChanges=0;
		this.pouches[catId].items.forEach(function(equipment, i){
			if(SavegameEditor.restoreDurability(equipment))
				nChanges++;
		});

		UI.toast(_('%s '+catId+' were restored').replace('%s', nChanges), 'restore-durability');
		return nChanges;
	},
	restoreDecay:function(equipment){
		if(equipment.restoreDecay()){
			Pouch.updateItemIcon(equipment);
			return true;
		}
		return false;
	},
	restoreDecayAll:function(){
		var nChanges=0;
		this.pouches.weapons.items.forEach(function(equipment, i){
			if(SavegameEditor.restoreDecay(equipment))
				nChanges++;
		});

		UI.toast(_('%s weapons were switched to pristine').replace('%s', nChanges), 'restore-decay');
		return nChanges;
	},
	setInfiniteDurability:function(equipment){
		if(equipment.setInfiniteDurability()){
			Pouch.updateItemRow(equipment);
			return true;
		}

		Pouch.updateItemRow(equipment);
		return false;
	},
	setInfiniteDurabilityAll:function(catId){
		var nChanges=0;
		this.pouches[catId].items.forEach(function(equipment, i){
			if(SavegameEditor.setInfiniteDurability(equipment))
				nChanges++;
		});

		UI.toast(_('%s '+catId+' have now infinite durability').replace('%s', nChanges), 'restore-durability');
		return nChanges;
	},
	upgradeArmor:function(armor){
		if(armor.upgrade()){
			Pouch.updateItemRow(armor);
			return true;
		}

		return false;
	},
	upgradeArmorAll:function(){
		var nChanges=0;
		this.pouches.armors.items.forEach(function(armor, i){
			if(SavegameEditor.upgradeArmor(armor))
				nChanges++;
		});

		UI.toast(_('%s armors were upgraded').replace('%s', nChanges), 'upgrade-armor');
		return nChanges;
	},

	clearAllMapPins:function(onlyIcon){
		var count=0;
		for(var i=0; i<this.mapPins.length; i++){
			if(this.mapPins[i].clear(onlyIcon))
				count++;
		}

		this.refreshCounterMapPins();
		UI.toast(_('%s map pins removed').replace('%s', count), 'map-pin-removed');
		return count;
	},
	addMapPin:function(icon, x, y, z){
		for(var i=0; i<this.mapPins.length; i++){
			if(this.mapPins[i].isFree() && !MapPin.find(this.mapPins, x, y, z)){
				this.mapPins[i].icon=icon;
				this.mapPins[i].coordinates={x:MapPin.formatFloat(x), y:MapPin.formatFloat(y)};
				//console.log(z);
				//console.log(hashReverse(MapPin.getMapByZ(z)));
				this.mapPins[i].map=MapPin.getMapByZ(z);
				return true;
			}
		}
		return false;
	},
	addLocationPins:function(flags, coordinates, icon, limit, valueFalse){
		var guidSearch=typeof flags[0]==='string';

		if(typeof icon==='string')
			icon=hash(icon);

		if(typeof valueFalse==='string')
			valueFalse=hash(valueFalse);
		else if(typeof valueFalse==='number')
			valueFalse=valueFalse;
		else
			valueFalse=0;

		if(typeof icon==='string')
			icon=hash(icon);

		var count=0;
		if(guidSearch){
			for(var i=0; i<flags.length; i++){
				if(!this._findGuid(flags[i]) && this.addMapPin(icon, coordinates[i][0], coordinates[i][2], coordinates[i][1])){ //vector3f is turned into a vector2f --> z->y
					count++;
					if(count===limit)
						break;
				}
			}
		}else{
			var offsets=this._getOffsetsByHashes(flags);
			for(var i=0; i<flags.length; i++){
				if(tempFile.readU32(offsets[flags[i]])===valueFalse && this.addMapPin(icon, coordinates[i][0], coordinates[i][2], coordinates[i][1])){ //vector3f is turned into a vector2f --> z->y
					count++;
					if(count===limit)
						break;
				}
			}
		}

		if(count){
			this.refreshCounterMapPins();
			UI.toast(_('%s map pins added').replace('%s', '<strong>'+count+'</strong>'));
		}else{
			UI.toast(_('No map pins added'), 'map-pins-none');
		}

		return count;
	},
	addPinsTowers:function(){
		return this.addLocationPins(CompletismHashes.TOWERS_FOUND, Coordinates.TOWERS, MapPin.ICON_CRYSTAL, 15);
	},
	addPinsShrines:function(){
		return this.addLocationPins(CompletismHashes.SHRINES_FOUND, Coordinates.SHRINES, MapPin.ICON_CRYSTAL, 50);
	},
	addPinsLightroots:function(){
		return this.addLocationPins(CompletismHashes.LIGHTROOTS_FOUND, Coordinates.LIGHTROOTS, MapPin.ICON_CRYSTAL, 50);
	},
	addPinsKoroksHidden:function(){
		return this.addLocationPins(CompletismHashes.KOROKS_HIDDEN, Coordinates.KOROKS_HIDDEN, MapPin.ICON_LEAF, 50);
	},
	addPinsKoroksCarry:function(){
		return this.addLocationPins(CompletismHashes.KOROKS_CARRY, Coordinates.KOROKS_CARRY, MapPin.ICON_LEAF, 25, 'NotClear');
	},
	addPinsBubbuls:function(){
		return this.addLocationPins(CompletismHashes.BUBBULS_GUIDS, Coordinates.LOCATION_BUBBULS, MapPin.ICON_HEART, 50);
	},
	addPinsLocations:function(){
		return this.addLocationPins(CompletismHashes.LOCATIONS_VISITED, Coordinates.LOCATIONS, MapPin.ICON_DIAMOND, 50);
	},
	addPinsLocationsCaves:function(){
		return this.addLocationPins(CompletismHashes.LOCATION_CAVES_VISITED2, Coordinates.LOCATION_CAVES, MapPin.ICON_DIAMOND, 50);
	},
	addPinsLocationsWells:function(){
		return this.addLocationPins(CompletismHashes.LOCATION_WELLS_VISITED2, Coordinates.LOCATION_WELLS, MapPin.ICON_DIAMOND, 25);
	},
	addPinsLocationsChasms:function(){
		return this.addLocationPins(CompletismHashes.LOCATION_CHASMS_VISITED2, Coordinates.LOCATION_CHASMS, MapPin.ICON_DIAMOND, 20);
	},
	addPinsBossesHinox:function(){
		return this.addLocationPins(CompletismHashes.BOSSES_HINOXES_DEFEATED, Coordinates.BOSSES_HINOXES, MapPin.ICON_SKULL, 25);
	},
	addPinsBossesTalus:function(){
		return this.addLocationPins(CompletismHashes.BOSSES_TALUSES_DEFEATED, Coordinates.BOSSES_TALUSES, MapPin.ICON_SKULL, 25);
	},
	addPinsBossesMolduga:function(){
		return this.addLocationPins(CompletismHashes.BOSSES_MOLDUGAS_DEFEATED, Coordinates.BOSSES_MOLDUGAS, MapPin.ICON_SKULL);
	},
	addPinsBossesFlux:function(){
		return this.addLocationPins(CompletismHashes.BOSSES_FLUX_CONSTRUCT_DEFEATED, Coordinates.BOSSES_FLUX_CONSTRUCT, MapPin.ICON_SKULL, 20);
	},
	addPinsBossesFrox:function(){
		return this.addLocationPins(CompletismHashes.BOSSES_FROXS_DEFEATED, Coordinates.BOSSES_FROXS, MapPin.ICON_SKULL, 20);
	},
	addPinsBossesGleeok:function(){
		return this.addLocationPins(CompletismHashes.BOSSES_GLEEOKS_DEFEATED, Coordinates.BOSSES_GLEEOKS, MapPin.ICON_SKULL, 5);
	},
	addPinsSageWills:function(){
		return this.addLocationPins(CompletismHashes.SAGE_WILLS_FOUND, Coordinates.SAGE_WILLS, MapPin.ICON_CHEST);
	},
	addPinsOldMaps:function(){
		return this.addLocationPins(CompletismHashes.TREASURE_MAPS_FOUND, Coordinates.TREASURE_MAPS, MapPin.ICON_CHEST);
	},
	addPinsAddison:function(){
		return this.addLocationPins(CompletismHashes.ADDISON_COMPLETED, Coordinates.ADDISON, MapPin.ICON_HUMAN, 25);
	},
	addPinsSchematicsStone:function(){
		return this.addLocationPins(CompletismHashes.SCHEMATICS_STONE_FOUND, Coordinates.SCHEMATICS_STONE, MapPin.ICON_CHEST);
	},
	addPinsSchematicsYiga:function(){
		return this.addLocationPins(CompletismHashes.SCHEMATICS_YIGA_FOUND, Coordinates.SCHEMATICS_YIGA, MapPin.ICON_CHEST);
	},

	_refreshCounter:function(container, val, max){
		setValue(container+'-counter', val+'<small>/'+max+'</small>');
		
		var percentage=((val/max) * 100);
		var progressBar=document.createElement('div');
		progressBar.className='progress-bar';
		progressBar.title=Math.floor(percentage)+'%';
		var progress=document.createElement('div');
		if(percentage===100)
			progress.className='progress complete';
		else
			progress.className='progress';
		progress.style.width=percentage+'%';

		progressBar.appendChild(progress);
		getField(container+'-counter').appendChild(progressBar);
	},
	refreshCounterMapPins:function(){
		SavegameEditor._refreshCounter('pin', MapPin.count(SavegameEditor.mapPins), MapPin.MAX);
	},
	refreshCounterTowersFound:function(){
		this._refreshCounter('towers-found', Completism.countTowersFound(), CompletismHashes.TOWERS_FOUND.length);
	},
	refreshCounterTowersClear:function(){
		this._refreshCounter('towers-clear', Completism.countTowersClear(), CompletismHashes.TOWERS_ACTIVATED.length);
	},
	refreshCounterShrinesFound:function(){
		this._refreshCounter('shrines-found', Completism.countShrinesFound(), CompletismHashes.SHRINES_FOUND.length);
	},
	refreshCounterShrinesClear:function(){
		this._refreshCounter('shrines-clear', Completism.countShrinesClear(), CompletismHashes.SHRINES_STATUS.length);
	},
	refreshCounterLighrootsFound:function(){
		this._refreshCounter('lightroots-found', Completism.countLightrootsFound(), CompletismHashes.LIGHTROOTS_FOUND.length);
	},
	refreshCounterLighrootsClear:function(){
		this._refreshCounter('lightroots-clear', Completism.countLightrootsClear(), CompletismHashes.LIGHTROOTS_STATUS.length);
	},
	refreshCounterKoroksHidden:function(){
		this._refreshCounter('korok-hidden', Completism.countKoroksHidden(), CompletismHashes.KOROKS_HIDDEN.length);
	},
	refreshCounterKoroksCarry:function(){
		this._refreshCounter('korok-carry', Completism.countKoroksCarry(), CompletismHashes.KOROKS_CARRY.length);
	},
	refreshCounterBubbuls:function(){
		this._refreshCounter('bubbuls', Completism.countBubbuls(), CompletismHashes.BUBBULS_DEFEATED.length);
	},
	refreshCounterLocations:function(){
		this._refreshCounter('locations', Completism.countLocations(), CompletismHashes.LOCATIONS_VISITED.length);
	},
	refreshCounterLocationCaves:function(){
		this._refreshCounter('location-caves', Completism.countLocationCaves(), CompletismHashes.LOCATION_CAVES_VISITED.length);
	},
	refreshCounterLocationWells:function(){
		this._refreshCounter('location-wells', Completism.countLocationWells(), CompletismHashes.LOCATION_WELLS_VISITED.length);
	},
	refreshCounterLocationChasms:function(){
		this._refreshCounter('location-chasms', Completism.countLocationChasms(), CompletismHashes.LOCATION_CHASMS_VISITED.length);
	},
	refreshCounterBossesHinox:function(){
		this._refreshCounter('boss-hinox', Completism.countBossesHinox(), CompletismHashes.BOSSES_HINOXES_DEFEATED.length);
	},
	refreshCounterBossesTalus:function(){
		this._refreshCounter('boss-talus', Completism.countBossesTalus(), CompletismHashes.BOSSES_TALUSES_DEFEATED.length);
	},
	refreshCounterBossesMolduga:function(){
		this._refreshCounter('boss-molduga', Completism.countBossesMolduga(), CompletismHashes.BOSSES_MOLDUGAS_DEFEATED.length);
	},
	refreshCounterBossesFlux:function(){
		this._refreshCounter('boss-flux', Completism.countBossesFlux(), CompletismHashes.BOSSES_FLUX_CONSTRUCT_DEFEATED.length);
	},
	refreshCounterBossesFrox:function(){
		this._refreshCounter('boss-frox', Completism.countBossesFrox(), CompletismHashes.BOSSES_FROXS_DEFEATED.length);
	},
	refreshCounterBossesGleeok:function(){
		this._refreshCounter('boss-gleeok', Completism.countBossesGleeok(), CompletismHashes.BOSSES_GLEEOKS_DEFEATED.length);
	},
	refreshCounterSageWills:function(){
		this._refreshCounter('sage-wills', Completism.countSageWills(), CompletismHashes.SAGE_WILLS_FOUND.length);
	},
	refreshCounterOldMaps:function(){
		this._refreshCounter('old-maps', Completism.countOldMaps(), CompletismHashes.TREASURE_MAPS_FOUND.length);
	},
	refreshCounterAddison:function(){
		this._refreshCounter('addison', Completism.countAddison(), CompletismHashes.ADDISON_COMPLETED.length);
	},
	refreshCounterSchematicsStone:function(){
		this._refreshCounter('schematics-stone', Completism.countSchematicsStone(), CompletismHashes.SCHEMATICS_STONE_FOUND.length);
	},
	refreshCounterSchematicsYiga:function(){
		this._refreshCounter('schematics-yiga', Completism.countSchematicsYiga(), CompletismHashes.SCHEMATICS_YIGA_FOUND.length);
	},
	refreshCounterCompendium:function(){
		this._refreshCounter('compendium', Completism.countCompendium(), CompletismHashes.COMPENDIUM_STATUS.length);
	},
	refreshCounterPristineWeapons:function(){
		this._refreshCounter('pristine-weapons', ExperienceCalculator.countPristineWeapons(), ExperienceCalculator.BROKEN_WEAPON_HASHES.length);
	},
	refreshCounterAll:function(){
		this.refreshCounterTowersFound();
		this.refreshCounterTowersClear();
		this.refreshCounterShrinesFound();
		this.refreshCounterShrinesClear();
		this.refreshCounterLighrootsFound();
		this.refreshCounterLighrootsClear();
		this.refreshCounterKoroksHidden();
		this.refreshCounterKoroksCarry();
		this.refreshCounterBubbuls();
		this.refreshCounterLocations();
		this.refreshCounterLocationCaves();
		this.refreshCounterLocationWells();
		this.refreshCounterLocationChasms();
		this.refreshCounterBossesHinox();
		this.refreshCounterBossesTalus();
		this.refreshCounterBossesMolduga();
		this.refreshCounterBossesFlux();
		this.refreshCounterBossesFrox();
		this.refreshCounterBossesGleeok();
		this.refreshCounterSageWills();
		this.refreshCounterOldMaps();
		this.refreshCounterAddison();
		this.refreshCounterSchematicsStone();
		this.refreshCounterSchematicsYiga();
		this.refreshCounterCompendium();
		this.refreshCounterPristineWeapons();
		this.refreshMissingPristineWeapons();
	},


	experienceCalculate:function(){
		var totalExperience=ExperienceCalculator.calculate();
		setValue('span-experience', totalExperience);

		document.getElementById('experience-enemy-tiers').innerHTML='';
		ExperienceCalculator.getEnemyTiers(totalExperience).forEach(function(enemy, i){
			var span=document.createElement('span');
			span.innerHTML=_(enemy);
			span.className='text-center';
			span.style.display='inline-block';
			span.style.minWidth='33%';
			document.getElementById('experience-enemy-tiers').appendChild(span);
		});
	},
	refreshMissingPristineWeapons:function(){
		var missingPristineWeapons=ExperienceCalculator.getMissingPristineWeapons();
		
		$('#experience-pristine-weapons').empty();

		if(missingPristineWeapons.length){
			missingPristineWeapons.forEach(function(weaponId){
				var span=document.createElement('span');
				span.innerHTML=_(weaponId);
				span.className='text-center';
				span.style.display='inline-block';
				span.style.minWidth='33%';
				document.getElementById('experience-pristine-weapons').appendChild(span);
			});
		}else{
			$('<div></div>').addClass('text-center').html(_('None')).appendTo($('#experience-pristine-weapons'));
		}
	},


	refreshItemTab:function(catId){
		empty('container-'+catId);
		SavegameEditor.pouches[catId].items.forEach(function(item, j){
			Pouch.updateItemRow(item);
			document.getElementById('container-'+item.category).appendChild(item._htmlRow);
		});
		MarcTooltips.add('#container-'+catId+' select',{position:'left'});
		MarcTooltips.add('#container-'+catId+' input',{position:'left',align:'center'});
	},

	captionReadBoolByHash:function(marcFile, targetHash) {
		for(var i=0x000028; i<0x000001c0; i+=8){
			var hash=marcFile.readU32(i);
			if(hash===targetHash){
				return marcFile.readBytes(i+4, 1)[0] == 1;
			}
		}
		return false;
	},

	captionReadU32ByHash:function(marcFile, targetHash) {
		for(var i=0x000028; i<0x000001c0; i+=8){
			var hash=marcFile.readU32(i);
			if(hash===targetHash){
				return marcFile.readU32(i+4);
			}
		}
	},

	makeImgFromCaption:function(marcFile){
		var jpgOffset = this.captionReadU32ByHash(marcFile, 0x63696a32);
		var jpgSize=marcFile.readU32(jpgOffset);

		var arrayBuffer=marcFile._u8array.buffer.slice(jpgOffset+4, jpgOffset+4+jpgSize);
		var blob=new Blob([arrayBuffer], {type:'image/jpeg'});
		var imageUrl=(window.URL || window.webkitURL).createObjectURL(blob);
		var img=new Image();
		img.src=imageUrl;
		return img;
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		tempFile.littleEndian=true;
		//if(tempFile.fileName==='caption.sav'){
		if(/caption/.test(tempFile.fileName)){
			var img = this.makeImgFromCaption(tempFile);
			if(img){
				document.getElementById('dialog-caption').innerHTML='';
				document.getElementById('dialog-caption').appendChild(img);
				window.setTimeout(function(){
					MarcDialogs.open('caption')
				}, 100);
			}
		}else if(tempFile.readU32(0)===0x01020304 && tempFile.fileSize>=2307552 && tempFile.fileSize<4194304){
			Variable.findHashTableEnd();
			var foundAllHashes=this._getOffsets();
			if(foundAllHashes){
				var header=tempFile.readU32(4);
				var metaDataStart=tempFile.readU32(8);
				var knownSavegameVersion=false;
				for(var i=0; i<this.Constants.GAME_VERSIONS.length; i++){
					if(tempFile.fileSize===this.Constants.GAME_VERSIONS[i].fileSize && header===this.Constants.GAME_VERSIONS[i].header && metaDataStart===this.Constants.GAME_VERSIONS[i].metaDataStart){
						knownSavegameVersion=this.Constants.GAME_VERSIONS[i].version;
						break;
					}
				}
				TOTKMasterEditor.gameMod=!knownSavegameVersion;
				setValue('version', knownSavegameVersion || '*Game mod*');
				return true;
			}
		}

		return false
	},

	showSavegameIndex:async function(droppedFiles) {
		// Parse savegames into their respective slots
		var slotCaptionDate = [];
		var slotCaptionImg = [];
		var slotCaptionIsAutosave = [];
		var slotProgressMarcFile = [];
		for(var i=0; i<droppedFiles.length; i++) {
			var file = droppedFiles[i];
			var filePath = file.webkitRelativePath || ''; // non standard but supported everywhere
			var slotMatch = filePath.match(/slot_0([012345])/);
			if(!slotMatch || slotMatch.length != 2) {
				continue;
			}
			var slot_i = parseInt(slotMatch[1]);

			if(file.name == "caption.sav") {
				var marcFile = await MarcFile.newFromPromise(file);
				marcFile.littleEndian = true; // this gets hardcoded in checkValidSavegame too

				var year = this.captionReadU32ByHash(marcFile, 0x9811A3F7);
				var minute = this.captionReadU32ByHash(marcFile, 0x27853BF7);
				var hour = this.captionReadU32ByHash(marcFile, 0x23F3D75E);
				var month = this.captionReadU32ByHash(marcFile, 0xDFD840D3);
				var day = this.captionReadU32ByHash(marcFile, 0xBD46F485);
				var slotDate = new Date(year, month-1, day, hour, minute);
				slotCaptionDate[slot_i] = slotDate;

				var isAutosave = this.captionReadBoolByHash(marcFile, 0x25F03CAA);
				slotCaptionIsAutosave[slot_i] = isAutosave;
				//console.log(slot_i, slotDate, isAutosave);

				var img = this.makeImgFromCaption(marcFile);
				slotCaptionImg[slot_i] = img;
			} else if(file.name == "progress.sav") {
				var marcFile = await MarcFile.newFromPromise(file);
				marcFile.littleEndian = true; // this gets hardcoded in checkValidSavegame too
				slotProgressMarcFile[slot_i] = marcFile;
			}
		}
		// Sort slot indexes by date descending, ranking hardsaves higher on tie
		var sortedSlots = slotCaptionDate.map((x,i) => [x,i]).sort((a,b) => {
			var cmp = b[0]-a[0];
			if (cmp) { return cmp; }
			return slotCaptionIsAutosave[a[1]]-slotCaptionIsAutosave[b[1]];
		}).map(pair => pair[1]);

		// Show slot picker with caption.sav metadata
		$('#container-savegameslots').html('');
		for(let i=0; i<6; i++) {
			let slot_i = sortedSlots[i];
			var img = slotCaptionImg[slot_i];
			var progressMarcFile = slotProgressMarcFile[slot_i];

			var row = $('<div></div>').addClass('row row-item');
			var columnLeft = $('<div></div>').addClass('row-item-left');
			var columnRight = $('<div></div>').addClass('row-item-right');
			row.append(columnLeft, columnRight);

			if(img){
				columnLeft.append(img);
				var button = $('<button></button>').addClass('btn').text(_('Open') + ' slot_0' + slot_i).on('click', (evt)=>{
					MarcDialogs.close();
					tempFile = slotProgressMarcFile[slot_i];
					_tempFileLoadFunction();
				});

				var slotDate = new Intl.DateTimeFormat(undefined, {
					dateStyle: 'short',
					timeStyle: 'short',
				}).format(slotCaptionDate[slot_i]);
				slotDate = $("<div></div>").text(slotDate);

				columnRight.append(slotDate, button);

				if(slotCaptionIsAutosave[slot_i]) {
					var autosaveTag = $("<div></div>").text(_("Autosave"));
					columnRight.append(autosaveTag);
				}
			}

			$('#container-savegameslots').append(row);
		}

		window.setTimeout(function(){
			MarcDialogs.open('savegameindex')
		}, 100);
	},

	preload:function(){
		/* implement String.slug for item searching purposes */
		String.prototype.slug=function(){
			return this.toLowerCase().trim()
				.replace(/[\xc0\xc1\xc2\xc4\xe0\xe1\xe2\xe4]/g, 'a')
				.replace(/[\xc8\xc9\xca\xcb\xe8\xe9\xea\xeb]/g, 'e')
				.replace(/[\xcc\xcd\xce\xcf\xec\xed\xee\xef]/g, 'i')
				.replace(/[\xd2\xd3\xd4\xd6\xf2\xf3\xf4\xf6]/g, 'o')
				.replace(/[\xd9\xda\xdb\xdc\xf9\xfa\xfb\xfc]/g, 'u')

				.replace(/[\xd1\xf1]/g, 'n')
				.replace(/[\xc7\xe7]/g, 'c')

				.replace(/[\(\)\*]/g, '')
				.replace(/[ _\-]+/g, ' ')
		}

		/* completiosnim mode */
		$('#input-radio-completionism-map, #input-radio-completionism-unlock').on('change', function(evt){
			if(this.value==='unlock'){
				$('.completionism-actions-map').hide();
				$('.completionism-actions-unlock').show();
			}else{
				$('.completionism-actions-map').show();
				$('.completionism-actions-unlock').hide();
			}
		});
		/* dropdown */
		$('#dropdown-item-button-pristine').on('click', function(evt){
			if(SavegameEditor.restoreDecay(currentEditingItem))
				Pouch.updateItemRow(currentEditingItem);
		});
		$('#dropdown-item-button-durability').on('click', function(evt){
			if(SavegameEditor.restoreDurability(currentEditingItem))
				Pouch.updateItemRow(currentEditingItem);
		});
		$('#dropdown-item-button-infinite').on('click', function(evt){
			if(SavegameEditor.setInfiniteDurability(currentEditingItem))
				Pouch.updateItemRow(currentEditingItem);
		});
		$('#dropdown-item-button-upgrade').on('click', function(evt){
			if(SavegameEditor.upgradeArmor(currentEditingItem))
				Pouch.updateItemRow(currentEditingItem);
		});
		$('#dropdown-item-button-duplicate').on('click', function(evt){
			var newItem=SavegameEditor.pouches[currentEditingItem.category].add(currentEditingItem);
			if(newItem){
				UI.toast(_('Item duplicated'), 'duplicate');
				document.getElementById('container-'+newItem.category).appendChild(Pouch.updateItemRow(newItem));
				Pouch.scrollToItem(newItem);
			}
		});
		$('#dropdown-item-button-export').on('click', function(evt){
			var myJson=currentEditingItem.export();
			var blob = new Blob([JSON.stringify(myJson, null, '\t')], {type: 'application/json;charset=utf-8'});
			var fileName='totk_'+currentEditingItem.category.replace(/s$/,'')+'_';
			if(currentEditingItem.category==='horses')
				fileName+=_(currentEditingItem.name);
			else
				fileName+=_(currentEditingItem.id);
			if(currentEditingItem.category==='weapons' || currentEditingItem.category==='bows' || currentEditingItem.category==='shields')
				fileName+='_'+myJson.modifier;

			saveAs(blob, fileName+'.json');
		});
		$('#dropdown-item-button-import').on('click', function(evt){
			$('#input-file-pouch-import').trigger('click');
		});
		$('#input-file-pouch-import').on('change', function(evt){
			var fileReader=new FileReader();
			fileReader.onload=function(evt){
				try{
					var jsonObject=JSON.parse(evt.target.result);
					var pouch=SavegameEditor.pouches[currentEditingItem.category];
					var pouchItems=pouch.items;
					var index=pouchItems.indexOf(currentEditingItem);

					if(Pouch.getCategoryItemStructId(currentEditingItem.category)===jsonObject.totkStruct){
						if(currentEditingItem.category==='weapons' || currentEditingItem.category==='bows' || currentEditingItem.category==='shields'){
							pouchItems[index]=new Equipment(currentEditingItem.category, jsonObject);
						}else if(currentEditingItem.category==='armors'){
							pouchItems[index]=new Armor(jsonObject);
						}else if(currentEditingItem.category==='horses'){
							pouchItems[index]=new Horse(jsonObject);
						}else{
							pouchItems[index]=new Item(currentEditingItem.category, jsonObject);
						}

						Pouch.updateItemRow(pouchItems[index]);
						document.getElementById('container-'+currentEditingItem.category).replaceChild(pouchItems[index]._htmlRow, currentEditingItem._htmlRow);
					}
				}catch(err){
					console.error(err);
				}
			};
			fileReader.readAsText(event.target.files[0]);
		});
		$('#dropdown-item-button-delete').on('click', function(evt){
			var showWarning=$('#checkbox-delete-item-warning').prop('checked');
			if(showWarning){
				$('#modal-delete-item-text').html(_('Are you sure you want to delete %s?').replace('%s', '<strong>'+currentEditingItem.getItemTranslation()+'</strong>'))
				UI.modal('delete-item');
			}else{
				SavegameEditor._removeItem(currentEditingItem.category, currentEditingItem);
			}
		});
		$('#btn-delete-item-confirm').on('click', function(evt){
			SavegameEditor._removeItem(currentEditingItem.category, currentEditingItem);
		});








		/* filter item dropdown */
		SavegameEditor.nameMap=new Map();
		SavegameEditor.customItemDropdown='onmousedown' in window; //browser has mouse events

		if(SavegameEditor.customItemDropdown){
			this.itemChangeDropdown = document.createElement('div');
			this.itemChangeDropdown.className='dropdown-item-container';

			this.itemFilterInput = document.createElement('input');
			this.itemFilterInput.className='search-input';
			this.itemChangeDropdown.appendChild(this.itemFilterInput);

			this.itemFilterResults = document.createElement('div');
			this.itemFilterResults.className='search-filter';
			this.itemChangeDropdown.appendChild(this.itemFilterResults);

			this.itemChangeDropdown.addEventListener('keydown', (event)=>{
				var activeEl = this.itemFilterResults.querySelector('.active');

				if(activeEl){
					var changedEl;

					switch(event.keyCode){
						case 13:
							// enter
							if(activeEl){
								activeEl.dispatchEvent(new Event('mousedown'));
							}
							break;
						case 38:
							// up
							event.preventDefault();
							if(activeEl.previousElementSibling){
								changedEl=activeEl.previousElementSibling;
							} else {
								changedEl=this.itemFilterResults.querySelector('.option:last-child');
							}
							break;
						case 40:
							// down
							event.preventDefault();
							if(activeEl.nextElementSibling){
								changedEl=activeEl.nextElementSibling;
							} else {
								changedEl=this.itemFilterResults.querySelector('.option:first-child');
							}
							break;
						case 33:
							// prevpage
							event.preventDefault();
							var allOptions=this.itemFilterResults.querySelectorAll('.option');
							var indexOf=[].indexOf.call(allOptions, activeEl);
							indexOf-=8;
							if(indexOf<0)
								indexOf=0;
							changedEl=allOptions[indexOf];
							break;
						case 34:
							// nextpage
							event.preventDefault();
							var allOptions=this.itemFilterResults.querySelectorAll('.option');
							var indexOf=[].indexOf.call(allOptions, activeEl);
							indexOf+=8;
							if(indexOf>=allOptions.length)
								indexOf=allOptions.length-1;
							changedEl=allOptions[indexOf];
							break;
						case 36:
							// start
							event.preventDefault();
							changedEl=this.itemFilterResults.querySelector('.option:first-child');
							break;
						case 35:
							// end
							event.preventDefault();
							changedEl=this.itemFilterResults.querySelector('.option:last-child');
							break;
					}

					if(changedEl && changedEl !== activeEl){
						activeEl.classList.remove('active');
						changedEl.classList.add('active');

						// scrollOffset
						var optionOffsetTop = changedEl.offsetTop;
						var optionHeight = changedEl.offsetHeight;
						var optionOffsetBottom = optionOffsetTop + optionHeight;
						var filterScrollTop = this.itemFilterResults.scrollTop;
						var filterHeight = this.itemFilterResults.offsetHeight
						var filterScrollBottom = filterScrollTop + filterHeight;
						if(optionOffsetBottom > filterScrollBottom){
							this.itemFilterResults.scrollTo({
								top: optionOffsetBottom - filterHeight + 8,
								behavior: event.repeat ? 'instant' : 'smooth'
							})
						} else if(optionOffsetTop < filterScrollTop){
							this.itemFilterResults.scrollTo({
								top: optionOffsetTop - 8,
								behavior: event.repeat ? 'instant' : 'smooth'
							})
						}
					}
				}
			});

			this.itemFilterInput.addEventListener('blur', function(evt){
				if(currentEditingItem)
					SavegameEditor.editItemEnd(null);
			});

			this.itemFilterInput.addEventListener('input', function(evt){
				SavegameEditor.filterDropdownItems(this.value);
			});
		}else{
			this.itemChangeDropdown=document.createElement('select');
			this.itemChangeDropdown.addEventListener('change', function(){
				//console.log('change');
				currentEditingItem.id=this.value;
				Pouch.updateItemIcon(currentEditingItem);
			}, false);
			this.itemChangeDropdown.addEventListener('blur', function(){
				//console.log('blur');
				for(var prop in currentEditingItem._htmlInputs){
					currentEditingItem._htmlInputs[prop].disabled=false;
				}
				Pouch.updateItemRow(currentEditingItem);
				SavegameEditor.fixItemAvailabilityFlag(currentEditingItem);
				currentEditingItem._htmlItemId.style.display='inline';
				this.parentElement.removeChild(this);

				currentEditingItem=null;
			}, false);
		}

		setNumericRange('rupees', 0, 999999);
		setNumericRange('pony-points', 0, 999999);

		setNumericRange('pouch-size-swords', 9, 20);
		setNumericRange('pouch-size-bows', 5, 14);
		setNumericRange('pouch-size-shields', 4, 20);



		/* autobuilder */
		$('#input-file-autobuilder-import').on('change', function(evt){
			autobuilderTempFile=new MarcFile(this.files[0], function(){
				var selectedIndex=parseInt(getValue('select-autobuilder-index'));
				var autobuilderOld=AutoBuilder.readSingle(selectedIndex);
				if(autobuilderOld){
					var importedAutobuilder=AutoBuilder.fromFile(autobuilderTempFile);
					if(importedAutobuilder){
						importedAutobuilder._index=autobuilderOld._index;
						importedAutobuilder.index=autobuilderOld.index;
						importedAutobuilder.isFavorite=autobuilderOld.isFavorite;
						importedAutobuilder.save();
						UI.toast('Successfully imported schema at '+(selectedIndex+1));
					}else{
						UI.toast('Error while importing schema at '+(selectedIndex+1));
					}
				}
			});

		});
		$('#button-autobuilder-preview').on('click', function(evt){
			var selectedIndex=parseInt(getValue('select-autobuilder-index'));
			var autobuilder=AutoBuilder.readSingle(selectedIndex);
			if(autobuilder){
				fflate.gzip(
					new Uint8Array(autobuilder.combinedActorInfo),
					{level: 6},
					function(err, data){
						if(err){
							console.error('fflate error: '+err);
						}else{
							var charData = data.reduce((value, char) => value + String.fromCharCode(char), '');
							var base64String = btoa(charData);
							console.log(base64String);
							window.open('https://blehditor.ssmvc.org/?view=true&cai='+encodeURIComponent(base64String), '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
						}
					}
				);
			}
		});
		$('#button-autobuilder-export').on('click', function(evt){
			var selectedIndex=parseInt(getValue('select-autobuilder-index'));
			var autobuilder=AutoBuilder.readSingle(selectedIndex);
			if(autobuilder)
				autobuilder.export().save();
		});
		$('#button-autobuilder-import').on('click', function(evt){
			$('#input-file-autobuilder-import').trigger('click');
		});

		/* experience */
		$('#map-pins-edit').on('click', function(){
			TOTKMasterEditor.mini(
				new Struct('mapPins', [
					{
						structArray:'markers',
						variablesInfo:[
							{hash:'MapData.IconData.MapPinData.Type', type:'EnumArray', label:'Marker color', propertyName:'color', enumValues:['Invalid','Red','Blue','Yellow','Green','Purple','LightBlue']},
							{hash:'MapData.IconData.MapPinData.Pos', type:'Vector3Array', label:'Marker position', propertyName:'position'}
						]
					},{
						structArray:'teleporters',
						variablesInfo:[
							{hash:'MapData.IconData.WarpMarkerData.Index', type:'IntArray', label:'Teleporter index', propertyName:'index'},
							{hash:'MapData.IconData.WarpMarkerData.Pos', type:'Vector3Array', label:'Teleporter position', propertyName:'position'},
							{hash:'MapData.IconData.WarpMarkerData.Rot', type:'Vector3Array', label:'Teleporter rotation', propertyName:'rotation'}
						]
					},{
						structArray:'pins',
						variablesInfo:[
							{hash:'MapData.IconData.StampData.Type', type:'EnumArray', label:'Pin icon', propertyName:'icon', enumValues:['Invalid','Sword','Pot','Human','Rhombus','Heart','Star','TreasureBox','Skull','Leaf','Ore']},
							{hash:'MapData.IconData.StampData.Layer', type:'EnumArray', label:'Pin map', propertyName:'layer', enumValues:['Sky','Ground','Underground']},
							{hash:'MapData.IconData.StampData.Pos', type:'Vector2Array', label:'Pin position', propertyName:'position'}
						]
					}
				]),
				null,
				_('Map pins editor'),
				function(){
					SavegameEditor.mapPins=MapPin.readAll();
					SavegameEditor.refreshCounterMapPins();
				}
			);
		});
		get('pristine-weapons-edit').addEventListener('click', function(){
			TOTKMasterEditor.mini(
				new Struct('brokenWeapons', Object.keys(Equipment.WEAPONS_DECAYED_TO_PRISTINE).map(function(weaponId){
					return {
						hash:'EquipmentDeathCount.'+weaponId,
						label:_('Broken times')+' '+_(weaponId),
						type:'Int'
					};
				})),
				[
					{label:'Unlock all', action:TOTKMasterEditor.miniSetAllToOneAtLeast},
					{
						label:'Reset ghost seeds', action:function(){
							var nChanges=ExperienceCalculator.resetGhostStatuesSeeds();
							if(nChanges)
								UI.alert(nChanges+' ghost seeds were reset');
						}
					},
				],
				_('Broken weapons editor'),
				function(){
					SavegameEditor.refreshCounterPristineWeapons();
					SavegameEditor.refreshMissingPristineWeapons();
				}
			);
		});
		get('span-experience-edit').addEventListener('click', function(){
			TOTKMasterEditor.mini(
				new Struct('experience', ExperienceCalculator.generateHashesTextAll().map(function(hashText){
					return {
						hash:hashText,
						label:ExperienceCalculator.getPrettifiedHashLabel(hashText),
						type:'Int'
					};
				})),
				[{label:'Reset', action:TOTKMasterEditor.miniResetAll}],
				_('Experience editor'),
				SavegameEditor.experienceCalculate
			);
		});

		/* master editor mini */
		$('#button-hash-editor-export').on('click', TOTKMasterEditor.miniExport);
		$('#button-hash-editor-import').on('click', function(evt){
			$('#input-file-hash-editor-import').trigger('click');
		});
		$('#input-file-hash-editor-import').on('change', function(evt){
			var fileReader=new FileReader();
			fileReader.onload=function(evt){
				try{
					var jsonObject=JSON.parse(evt.target.result);
					TOTKMasterEditor.miniImport(jsonObject);
				}catch(err){
					console.error(err);
				}
			};
			fileReader.readAsText(event.target.files[0]);
		});

		MarcTooltips.add('#nav button',{className:'dark',fixed:true});
	},

	_timeToString:function(timeVal){
		var seconds=timeVal%60;
		if(seconds<10)seconds='0'+seconds;
		var minutes=parseInt(timeVal/60)%60;
		if(minutes<10)minutes='0'+minutes;
		return parseInt(timeVal/3600)+':'+minutes+':'+seconds;
	},

	refreshAddArrowsButton:function(){
		document.getElementById('button-add-arrows').disabled=!!this.pouches.arrows.items.length;
	},
	
	retranslateSelectOptions:function(options){
		options.forEach(function(option){
			if(typeof option.originalName==='string'){
				if(typeof option.originalNamePrefix==='string'){
					option.name=_(option.originalNamePrefix)+': '+_(option.originalName);
				}else{
					option.name=_(option.originalName);
				}
			}
		});
	},

	/* load function */
	load:function(){
		tempFile.fileName='progress.sav';

		$('#container-startup').hide();
		Variable.resetCache();
		UI.reset();
		this.retranslateSelectOptions(Equipment.OPTIONS_MODIFIERS.weapons);
		this.retranslateSelectOptions(Equipment.OPTIONS_MODIFIERS.bows);
		this.retranslateSelectOptions(Equipment.OPTIONS_MODIFIERS.shields);
		this.retranslateSelectOptions(Equipment.FUSABLE_ITEMS);
		this.retranslateSelectOptions(Armor.OPTIONS_DYE_COLORS);
		this.retranslateSelectOptions(Item.FOOD_EFFECTS);
		this.retranslateSelectOptions(Horse.OPTIONS_STATS_STAMINA);
		this.retranslateSelectOptions(Horse.MANES);
		this.retranslateSelectOptions(Horse.SADDLES);
		this.retranslateSelectOptions(Horse.REINS);

		this.itemChangeDropdown.lastCategory=null;


		/* prepare editor */
		setValue('playtime', this._timeToString(this.readU32('Playtime')));

		setValue('rupees', this.readU32('PlayerStatus.CurrentRupee'));
		setValue('max-hearts', this.readU32('PlayerStatus.MaxLife'));
		setValue('max-stamina', this.readU32('PlayerStatus.MaxStamina'));
		setValue('max-battery', this.readF32('PlayerStatus.MaxEnergy'));
		setValue('pony-points', this.readU32('HorseInnMemberPoint'));

		setValue('number-pouch-size-swords', this.readU32Array('Pouch.Weapon.ValidNum', 0));
		setValue('number-pouch-size-bows', this.readU32Array('Pouch.Bow.ValidNum', 0));
		setValue('number-pouch-size-shields', this.readU32Array('Pouch.Shield.ValidNum', 0));


		/* parasail pattern */
		this.parasailPattern=new Variable('PlayerStatus.ParasailPattern', 'Enum', ['Default','Pattern00','Pattern01','Pattern02','Pattern03','Pattern04','Pattern05','Pattern06','Pattern07','Pattern08','Pattern09','Pattern10','Pattern11','Pattern12','Pattern13','Pattern14','Pattern15','Pattern16','Pattern17','Pattern18','Pattern19','Pattern20','Pattern21','Pattern22','Pattern23','Pattern24','Pattern25','Pattern26','Pattern27','Pattern28','Pattern29','Pattern30','Pattern31','Pattern32','Pattern33','Pattern34','Pattern35','Pattern36','Pattern37','Pattern38','Pattern39','Pattern40','Pattern41','Pattern43','Pattern45','Pattern46','Pattern48','Pattern49','Pattern51','Pattern52','Pattern53','Pattern55','Pattern56']);
		this._htmlSelectParasailPattern=this.parasailPattern.buildHtmlInputs(true);
		for(var i=1; i<this._htmlSelectParasailPattern.children.length; i++){
			$(this._htmlSelectParasailPattern.children[i]).html(_($(this._htmlSelectParasailPattern.children[i]).html().replace('Pattern', 'Obj_SubstituteCloth_')));
		}
		this._htmlSelectParasailPattern.className='full-width';
		this._htmlSelectParasailPattern.title=_('Fabric');
		$(this._htmlSelectParasailPattern).on('change', function(evt){
			//SavegameEditor.parasailPattern.value=hashReverse(parseInt(SavegameEditor.parasailPattern.value));
			var item=SavegameEditor.pouches.key.findItemById('Parasail');
			if(item)
				Pouch.updateItemIcon(item);
		});

		/* read pouches */
		this.pouches={
			weapons:new Pouch('weapons'),
			bows:new Pouch('bows'),
			shields:new Pouch('shields'),
			armors:new Pouch('armors'),
			arrows:new Pouch('arrows'),
			materials:new Pouch('materials'),
			food:new Pouch('food'),
			devices:new Pouch('devices'),
			key:new Pouch('key'),
			horses:new Pouch('horses')
		}




		/* map pins */
		this.mapPins=MapPin.readAll();
		this.refreshCounterMapPins();



		/* coordinates */
		var playerPos=this.readVector3F('PlayerStatus.SavePos');
		setValue('pos-x', playerPos.x);
		setValue('pos-y', -playerPos.z);
		setValue('pos-z', playerPos.y-105);

		/* completionism */
		this.refreshCounterAll();

		/* experience */
		SavegameEditor.experienceCalculate();



		/* autobuilder favorites */
		var autobuilderFavorites=new Variable('AutoBuilder.Draft.Content.IsFavorite', 'BoolArray');
		var autobuilderIndexes=new Variable('AutoBuilder.Draft.Content.Index', 'IntArray');
		$('#select-autobuilder-index option').each(function(i, elem){
			var str;
			if(i<9)
				str='0'+(i+1);
			else
				str=(i+1).toString();

			var realIndex=autobuilderIndexes.value.indexOf(i);
			if(realIndex!==-1 && autobuilderFavorites.value[realIndex])
				str+=' &#9733;';

			$(elem).html(str);
		});








		if(TOTKMasterEditor.isLoaded())
			TOTKMasterEditor.forceFindOffsets=true;

		UI.showTab('home');
	},

	unload:function(){
		$('#container-startup').show();
	},

	/* save function */
	save:function(){
		if(UI.getCurrentTab()==='master')
			return false;

		/* STATS */
		this.writeU32('PlayerStatus.CurrentRupee', null, getValue('rupees'));
		this.writeU32('PlayerStatus.MaxLife', null, getValue('max-hearts'));
		this.writeU32('PlayerStatus.MaxStamina', null, getValue('max-stamina'));
		this.writeF32('PlayerStatus.MaxEnergy', null, getValue('max-battery'));
		this.writeU32('HorseInnMemberPoint', null, getValue('pony-points'));

		this.writeU32('Pouch.Weapon.ValidNum', 0, getValue('pouch-size-swords'));
		this.writeU32('Pouch.Bow.ValidNum', 0, getValue('pouch-size-bows'));
		this.writeU32('Pouch.Shield.ValidNum', 0, getValue('pouch-size-shields'));


		var playerPos={
			x:getValue('pos-x'),
			z:-getValue('pos-y'),
			y:getValue('pos-z')+105
		};
		this.writeVector3F('PlayerStatus.SavePos', null, playerPos);

		/* COORDINATES */
		/*this._writeString(this.Offsets.MAP, getValue('pos-map'))
		this._writeString(this.Offsets.MAPTYPE, getValue('pos-maptype'))*/


		/* save pouches */
		for(var pouchId in SavegameEditor.pouches){
			SavegameEditor.pouches[pouchId].save();
		};


		/* map pins */
		for(var i=0; i<SavegameEditor.mapPins.length; i++){
			SavegameEditor.mapPins[i].save();
		}
	}
}








/* MarcTooltips.js v20200216 - Marc Robledo 2014-2020 - http://www.marcrobledo.com/license */
var MarcTooltips=function(){var n=/MSIE 8/.test(navigator.userAgent);function d(t,e,o){n?t.attachEvent("on"+e,o):t.addEventListener(e,o,!1)}function u(t){void 0!==t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function g(t){if(/^#[0-9a-zA-Z_\-]+$/.test(t))return[document.getElementById(t.replace("#",""))];var e=document.querySelectorAll(t);if(n){for(var o=[],i=0;i<e.length;i++)o.push(e[i]);return o}return Array.prototype.slice.call(e)}var h=function(t,e,o){t.className=t.className.replace(/position-\w+/,"position-"+e.position).replace(/align-\w+/,"align-"+e.align);var i=(window.pageXOffset||document.documentElement.scrollLeft)-(document.documentElement.clientLeft||0),n=(window.pageYOffset||document.documentElement.scrollTop)-(document.documentElement.clientTop||0);e.fixed&&(n=i=0);var l=t.attachedTo.getBoundingClientRect().left,a=t.attachedTo.getBoundingClientRect().top,s=t.attachedTo.offsetWidth,p=t.attachedTo.offsetHeight;if("up"===e.position?t.style.top=parseInt(a+n-t.offsetHeight)+"px":"down"===e.position?t.style.top=parseInt(a+n+p)+"px":"top"===e.align?t.style.top=parseInt(a+n)+"px":"bottom"===e.align?t.style.top=parseInt(a+n-(t.offsetHeight-p))+"px":t.style.top=parseInt(a+n-parseInt((t.offsetHeight-p)/2))+"px","up"===e.position||"down"===e.position?"left"===e.align?t.style.left=parseInt(l+i)+"px":"right"===e.align?t.style.left=parseInt(l+i-(t.offsetWidth-s))+"px":t.style.left=parseInt(l+i-parseInt((t.offsetWidth-s)/2))+"px":"left"===e.position?t.style.left=parseInt(l+i-t.offsetWidth)+"px":"right"===e.position&&(t.style.left=parseInt(l+i+s)+"px"),o){var r={position:e.position,align:e.align,fixed:e.fixed},c=parseInt(t.style.left.replace("px","")),f=parseInt(t.style.top.replace("px","")),d=c+t.offsetWidth,u=f+t.offsetHeight,g=(i=window.scrollX,n=window.scrollY,Math.max(document.documentElement.clientWidth,window.innerWidth||0)),m=Math.max(document.documentElement.clientHeight,window.innerHeight||0);"up"===e.position||"down"===e.position?(g<d?r.align="right":c<i&&(r.align="left"),f<n?r.position="down":n+m<u&&(r.position="up")):(m<u?r.align="bottom":f<n&&(r.align="top"),c<i?r.position="right":i+g<d&&(r.position="left")),h(t,r,!1)}},m={};d(window,"load",function(){d(n?document:window,"click",function(){for(key in m)/ visible$/.test(m[key].className)&&/:true:/.test(key)&&(m[key].className=m[key].className.replace(" visible",""))}),d(window,"resize",function(){for(key in m)/ visible$/.test(m[key].className)&&m[key].attachedTo&&h(m[key],m[key].tooltipInfo,!0)})});function y(t){var e=t.currentTarget||t.srcElement;e.title&&(e.setAttribute("data-tooltip",e.title),e.title=""),(e.tooltip.attachedTo=e).tooltip.innerHTML=e.getAttribute("data-tooltip"),e.tooltip.className+=" visible",h(e.tooltip,e.tooltip.tooltipInfo,!0)}function w(t){var e=t.currentTarget||t.srcElement;e.tooltip.className=e.tooltip.className.replace(" visible","")}return{add:function(t,e){var o="down",i="center",n=!1,l=!1,a=!1,s=!1,p=!1;e&&(e.position&&/^(up|down|left|right)$/i.test(e.position)&&(o=e.position.toLowerCase()),e.align&&/^(top|bottom|left|right)$/i.test(e.align)&&(("up"!==o&&"down"!==o||"left"!==e.align&&"right"!==e.align)&&("left"!==o&&"right"!==o||"top"!==e.align&&"bottom"!==e.align)||(i=e.align.toLowerCase())),l=e.clickable||e.onClick||e.onclick||!1,a=e.focusable||e.onFocus||e.onfocus||!1,s=e.fixed||e.positionFixed||!1,n=e.class||e.className||e.customClass||e.customClassName||!1,p=e.text||e.customText||!1);for(var r=function(t){if("string"==typeof t)return g(t);if(t.length){for(var e=[],o=0;o<t.length;o++)"string"==typeof t[o]?e=e.concat(g(t[o])):e.push(t[o]);return e}return[t]}(t),c=function(t,e,o,i,n){var l=t+":"+e+":"+o+":"+i;if(m[l])return m[l];var a=document.createElement("div");return a.className="tooltip position-"+t+" align-"+e,a.className+="left"===t||"right"===t?" position-horizontal":" position-vertical",i&&(a.className+=" "+i),a.style.position=n?"fixed":"absolute",a.style.zIndex="9000",a.style.top="0",a.style.left="0",a.attachedTo=null,a.tooltipInfo={position:t,align:e,fixed:n},o&&d(a,"click",u),m[l]=a,document.body.appendChild(a),a}(o,i,l||a,n,s),f=0;f<r.length;f++)p?r[f].setAttribute("data-tooltip",p):r[f].title&&r[f].setAttribute("data-tooltip",r[f].title),r[f].title="",r[f].tooltip=c,a?(d(r[f],"focus",y),d(r[f],"blur",w),d(r[f],"click",u)):l?(d(r[f],"click",y),d(r[f],"click",u)):(d(r[f],"mouseover",y),d(r[f],"mouseout",w))}}}();




window.addEventListener('DOMContentLoaded', function(){
	SavegameEditor.loadSettings();
	$('#select-language').val(SavegameEditor.Settings.lang);
	Locale.set(SavegameEditor.Settings.lang);

	UI._attachEvents();
});










var UI=(function(sge){
	var _attachedEvents=false;

	var REFRESHABLE_TABS=['weapons','bows','shields','armors','materials','food','devices','key','horses'];
	var tabCache;
	var currentTab;
	var _showTab=function (newTab){
		currentTab=newTab;
		$('#nav .nav-link').each(function(i, navLink){
			if(navLink.dataset.target===newTab){
				navLink.className='nav-link active';
				document.getElementById('tab-'+navLink.dataset.target).style.display='block';
			}else{
				navLink.className='nav-link';
				document.getElementById('tab-'+navLink.dataset.target).style.display='none';
			}
		});

		if(!tabCache[newTab] && REFRESHABLE_TABS.indexOf(newTab)!==-1){
			SavegameEditor.refreshItemTab(newTab);
			if(newTab==='bows'){
				SavegameEditor.refreshItemTab('arrows');
				SavegameEditor.refreshAddArrowsButton();
			}
			tabCache[newTab]=true;
		}else if(newTab==='master'){
			if(TOTKMasterEditor.isLoaded()){
				TOTKMasterEditor.toggleImportButton();
				if(TOTKMasterEditor.forceFindOffsets)
					TOTKMasterEditor.findOffsets();
				TOTKMasterEditor.focus();
			}else{
				TOTKMasterEditor.initialize();
			}
		}
	}





	var _setLockScroll=function(status){
		document.body.style.overflow=status? 'hidden':'';
	};
	var _closeMyModal=function(evt){
		$(this).closest('dialog.modal').get(0).close();
	};
	var _showDropdown=function(dropdownMenu){
		var offset=$(dropdownMenu.attachedTo).offset();
		//offset.right=($(window).width() - (offset.left + $(trigger).outerWidth()));
		$(dropdownMenu)
			.css('top', Math.floor(offset.top + 8)+'px')
			//.css('right', Math.floor(offset.right)+'px')
			.css('left', Math.floor(offset.left + 8)+'px');
	};

	return{
		_attachEvents:function(){
			if(_attachedEvents)
				return;

			/* nav */
			$('#toolbar button.nav-link[data-target]').on('click', function(evt){
				_showTab(this.dataset.target);
			});

			/* modals */
			$('button[data-dismiss="modal"]').on('click', _closeMyModal);

			/* dropdowns */
			$(document.body).on('click', function(){
				$('.dropdown-menu').hide();
			});
			$(window).on('resize', function(){
				var dropdownMenus=document.querySelectorAll('.dropdown-menu');
				for(var i=0; i<dropdownMenus.length; i++){
					if(dropdownMenus[i].style.display==='block')
						_showDropdown(dropdownMenus[i]);
				}
			});

			/* language selector */
			$('#select-language').on('change', function(evt){
				SavegameEditor.Settings.lang=this.value;
				Locale.set(this.value);
				SavegameEditor.saveSettings();	
			});
			_attachedEvents=true;
		},
		reset:function(){
			tabCache={};
			$('#checkbox-delete-item-warning').prop('checked', true);
			
			$('.completionism-actions-map, .completionism-actions-unlock').hide();
			$('#input-radio-completionism-map, #input-radio-completionism-unlock').prop('checked', false);
		},
		showTab:function(newTab){
			_showTab(newTab);
		},
		getCurrentTab:function(){
			return currentTab;
		},


		dropdown:function(dropdownId, attachTo){
			var dropdownMenu=document.getElementById('dropdown-'+dropdownId);
			dropdownMenu.attachedTo=attachTo;
			_showDropdown(dropdownMenu);
			dropdownMenu.style.display='block';
		},
		toast:function(msg, id, timeoutClose){
			var toastId='toast-'+(id || (new Date()).getTime());
			var exists=document.getElementById(toastId);

			if(exists && exists.closeTimeout){
				window.clearTimeout(exists.closeTimeout);
			}

			var toast=exists || $('<div></div>').attr('id', toastId).addClass('toast').appendTo($('#toasts-container')).get(0);
			if(msg)
				$(toast).html(msg);
			else
				$(toast).remove();
			

			if(typeof timeoutClose==='undefined')
				timeoutClose=3000;


			if(msg && timeoutClose){
				toast.closeTimeout=window.setTimeout(function(){
					$(toast).remove();
				}, timeoutClose)
			}
		},
		octicon:function(iconId){
			var img=new Image();
			img.src='assets/octicons/octicon_'+iconId+'.svg'
			img.className='octicon';
			return img;
		},
		modal:function(id){
			_setLockScroll(true);
			
			var dialog=document.getElementById('modal-'+id);
			if(!dialog.initialized){
				dialog.addEventListener('close', function(){
					_setLockScroll(false);
				});
				dialog.initialized=true;
			}
			dialog.showModal();
		},
		alert:function(text){
			$('<dialog></dialog>')
				.addClass('modal')
				.append($('<div></div>').addClass('modal-body text-center').html(text))
				.append(
					$('<div></div>')
						.addClass('modal-footer text-center')
						.append($('<button></button>').addClass('btn').html(_('Accept')).on('click', _closeMyModal))
				)
				.appendTo(document.body)
				.on('close', function(evt){
					$(this).remove();
				})
				.get(0).showModal();
		},
		confirm:function(text, onConfirm){
			$('<dialog></dialog>')
				.addClass('modal')
				.append($('<div></div>').addClass('modal-body text-center').html(text))
				.append(
					$('<div></div>')
						.addClass('modal-footer text-center')
						.append($('<button></button>').addClass('btn').html(_('Cancel')).on('click', _closeMyModal))
						.append($('<button></button>').addClass('btn btn-primary').html(_('Accept')).on('click', function(evt){
							_closeMyModal(evt);
							onConfirm.call();
						}))
				)
				.appendTo(document.body)
				.on('close', function(evt){
					$(this).remove();
				})
				.get(0).showModal();
		}
	}
}(SavegameEditor));

function getInternalCategoryId(catId){
	catId=catId.toLowerCase().replace(/s$/, '');
	if(catId==='device')
		return 'SpecialParts';
	else if(catId==='key')
		return 'KeyItem';
	
	
	
	//else: weapon,bow,arrow,armor,material,food
	return (catId.charAt(0).toUpperCase() + catId.substr(1)).replace(/s$/, '')
}