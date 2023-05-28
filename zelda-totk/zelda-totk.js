/*
	The legend of Zelda: Tears of the Kingdom savegame editor v20230528

	by Marc Robledo 2023
*/
var currentEditingItem;

SavegameEditor={
	Name:'The legend of Zelda: Tears of the Kingdom',
	Filename:['progress.sav','caption.sav'],
	Version:20230521,
	noDemo:true,

	/* Constants */
	Constants:{
		VERSION:				['v1.0', 'v1.1'],
		FILESIZE:				[2307552, 2307656],
		HEADER:					[0x0046c3c8, 0x0047e0f4],

		//ICON_TYPES:{SWORD: 27, BOW:28, SHIELD:29, POT:30, STAR:31, CHEST:32,SKULL:33,LEAF:34,TOWER:35},
		
		BLANK_ICON_PATH:'./assets/_blank.png'
	},

	/* Hashes */
	Hashes:[
		0xfbe01da1, 'MaxHearts',
		0xa77921d7, 'CurrentRupees',
		//0x31ab5580, 'CurrentHearts',
		0xf9212c74, 'MaxStamina',
		0x15ec5858, 'PonyPoints',
		0xe573f564, 'Playtime',
		0xafd01d68, 'MaxBattery',

		0xc884818d, 'PlayerPos', //Vector3F
		0xd7a3f6ba, 'ArrayPouchSwords',
		0xc61785c2, 'ArrayPouchBows',
		0x05271e7d, 'ArrayPouchShields',

		0x65efd0be, 'ArrayWeaponIds',
		0x8b12d062, 'ArrayWeaponDurabilities',
		0xdd846288, 'ArrayWeaponModifiers',
		0xfda1d214, 'ArrayWeaponModifierValues',
		0x80707cad, 'ArrayWeaponFuseIds',
		0x791c4a0b, 'ArrayBowIds',
		0x60589200, 'ArrayBowDurabilities',
		0xd59aeed5, 'ArrayBowModifiers',
		0xdfd216f2, 'ArrayBowModifierValues',
		0x273190f4, 'ArrayShieldIds',
		0xc3416d19, 'ArrayShieldDurabilities',
		0x464b410c, 'ArrayShieldModifiers',
		0xa6a38304, 'ArrayShieldModifierValues',
		0xc95833d9, 'ArrayShieldFuseIds',
		0x754e8549, 'ArrayArmorIds',
		0x183e2a32, 'ArrayArmorDyeColors',
		0x24dd3262, 'ArrayArrowIds',
		0x53b27d94, 'ArrayArrowQuantities',
		0xd96ebf12, 'ArrayMaterialIds',
		0xde2d8500, 'ArrayMaterialQuantities',
		0x7c0f89ad, 'ArrayFoodIds',
		0x2a952a60, 'ArrayFoodQuantities',
		0x6f743e98, 'ArrayFoodEffects',
		0x9d3b5847, 'ArrayFoodEffectsHearts',
		0x904a7213, 'ArrayFoodEffectsMultiplier',
		0xf097cefa, 'ArrayFoodEffectsTime', // in seconds
		0x2e470848, 'ArrayFoodEffectsUnknown1', //???
		0xa86f2f10, 'ArrayDeviceIds',
		0x60d16ab0, 'ArrayDeviceQuantities',
		0x22c6530a, 'ArrayKeyIds',
		0x60fac288, 'ArrayKeyQuantities',

		0x7bde80e9, 'ArrayHorseIds',
		0xd2ddb868, 'ArrayHorseNames',
		0x54049354, 'ArrayHorseManes',
		0x1daf6cb4, 'ArrayHorseSaddles',
		0xfee5cd77, 'ArrayHorseReins',
		0xdcd9f005, 'ArrayHorseBonds',
		0xcea848b6, 'ArrayHorseSpecialTypes',
		0xafe462c3, 'ArrayHorseStatsStrength',
		0xc0775abf, 'ArrayHorseStatsSpeed',
		0xc8454f7c, 'ArrayHorseStatsStamina',
		0x10d564d7, 'ArrayHorseStatsPull',
		0xfbf44df2, 'ArrayHorseIconPatterns',
		0x48bfcf08, 'ArrayHorseIconEyeColors',
		0xa0e854ea, 'WildTammedHorseId',


		0x14d7f4c4, 'ArrayMapPinIcons',
		0xf24fc2e7, 'ArrayMapPinCoordinates',
		0xd2025694, 'ArrayMapPinMap'
	],


	/* read/write data */
	readU32:function(hashKey, arrayIndex){
		if(typeof arrayIndex==='number')
			return tempFile.readU32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x04);
		return tempFile.readU32(SavegameEditor.Offsets[hashKey]);
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
		/*if(typeof arrayIndex==='number'){
			return {
				x: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x0c),
				y: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x0c + 0x04),
				z: tempFile.readF32(SavegameEditor.Offsets[hashKey] + 0x04 + arrayIndex*0x0c + 0x08)
			}
		}*/
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
	readString64Array:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readString64);
	},
	readStringUTF8Array:function(hashKey, arrayIndex){
		return this._readArray(hashKey, arrayIndex, this.readStringUTF8);
	},

	writeU32:function(hashKey, arrayIndex, value){
		if(typeof arrayIndex==='number')
			tempFile.writeU32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x04, value);
		else
			tempFile.writeU32(this.Offsets[hashKey], value);
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
			/*tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x08, vector.x);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04 + arrayIndex*0x08 + 0x04, vector.y);*/
		}else{
			tempFile.writeF32(this.Offsets[hashKey], vector.x);
			tempFile.writeF32(this.Offsets[hashKey] + 0x04, vector.y);
			tempFile.writeF32(this.Offsets[hashKey] + 0x08, vector.z);
		}
	},


	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_getOffsets:function(){
		this.Offsets={};
		for(var i=0x000028; i<0x03c800; i+=8){
			var hash=tempFile.readU32(i);
			var foundHashIndex=this.Hashes.indexOf(hash);
			if(hash===0xa3db7114){ //found MetaData.SaveTypeHash
				break;
			}else if(foundHashIndex!==-1){
				if(/^(Array|PlayerPos)/.test(this.Hashes[foundHashIndex+1]))
					this.Offsets[this.Hashes[foundHashIndex+1]]=tempFile.readU32(i+4);
				else
					this.Offsets[this.Hashes[foundHashIndex+1]]=i+4;
			}
		}
		for(var i=0; i<this.Hashes.length; i+=2){
			if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.error('hash '+this.Hashes[i+1]+' not found');
			}
		}
	},
	_getOffsetsByHashes:function(hashes, single){
		var offsets={};
		for(var i=0x000028; i<0x03c800; i+=8){
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

	_createItemRow:function(item){
		var img=new Image();
		img.id='icon-'+item.category+'-'+item.index;
		img.loading='lazy';
		img.onerror=function(){
			this.removeEventListener('error', this.onerror);
			//console.error('icon '+this.src+' not found');
			img.src=SavegameEditor.Constants.BLANK_ICON_PATH;
		}
		if(item.category==='armors')
			img.src='./assets/icons/'+item.category+'/'+Armor.ICONS[item.id]+'.png';
		else
			img.src='./assets/icons/'+item.category+'/'+item.id+'.png';

		var itemNumber=document.createElement('span');
		itemNumber.className='item-number';
		itemNumber.innerHTML='#'+item.index;

		var spanItemId=document.createElement('span');
		spanItemId.className='item-name clickable';
		spanItemId.id='item-name-'+item.category+'-'+item.index;
		spanItemId.innerHTML=item.getItemTranslation();
		if(item.getItemTranslation()===item.id){
			spanItemId.style.color='red';
		}
		spanItemId.addEventListener('click', function(){
			SavegameEditor.editItem(item);
		}, false);


		var lastColumn=document.createElement('div');
		if(item.category==='weapons' || item.category==='bows' || item.category==='shields'){
			lastColumn.appendChild(item._htmlInputDurability);
			lastColumn.appendChild(item._htmlSelectModifier);
			lastColumn.appendChild(item._htmlInputModifierValue);
			if(item.isFusable()){
				lastColumn.appendChild(item._htmlSelectFusion);
			}
		}else if(item.quantity!==0xffffffff && (item.category==='arrows' || item.category==='materials' || item.category==='food' || item.category==='devices' || item.category==='key')){
			lastColumn.appendChild(item._htmlInputQuantity);
			if(item.category==='food'){
				lastColumn.appendChild(item._htmlSelectFoodEffect);
				lastColumn.appendChild(item._htmlInputFoodEffectHearts);
				lastColumn.appendChild(item._htmlInputFoodEffectMultiplier);
				lastColumn.appendChild(item._htmlInputFoodEffectTime);
				//lastColumn.appendChild(item._htmlSpanFoodEffectUnknownValue);
			}
		}else if(item.category==='armors'){
			lastColumn.appendChild(item._htmlSpanColor);
			lastColumn.appendChild(item._htmlSelectDyeColor);
		}else if(item.category==='horses'){
			lastColumn.appendChild(item._htmlInputName);
			lastColumn.appendChild(item._htmlSelectMane);
			lastColumn.appendChild(item._htmlSelectSaddles);
			lastColumn.appendChild(item._htmlSelectReins);
			lastColumn.appendChild(item._htmlInputBond);
			lastColumn.appendChild(item._htmlInputStatsStrength);
			lastColumn.appendChild(item._htmlSelectStatsSpeed);
			lastColumn.appendChild(item._htmlSelectStatsStamina);
			lastColumn.appendChild(item._htmlSelectStatsPull);
			lastColumn.appendChild(item._htmlSelectIconPattern);
			lastColumn.appendChild(item._htmlSelectIconEyeColor);
		}
		
		if(item.removable){
			item._htmlDeleteButton=document.createElement('button');
			item._htmlDeleteButton.className='button colored red with-icon icon3 floating';
			item._htmlDeleteButton.addEventListener('click', function(){
				MarcDialogs.confirm('Are you sure you want to delete <strong>'+item.getItemTranslation()+'</strong>?<br/><div style="color:red">Warning: use this feature at your own risk</div>', function(){
					MarcDialogs.close();
					SavegameEditor._removeItem(item.category, item.index);
				});
			});
			lastColumn.appendChild(item._htmlDeleteButton);
		}

		var r=row([1,6,3,2],
			img,
			spanItemId,
			document.createElement('div'), /* modifier column */
			lastColumn
		);
		r.className+=' row-items';
		r.id='row-item-'+item.category+'-'+item.index;
		r.children[1].appendChild(itemNumber);
		
		return r;
	},

	_removeItem:function(catId, index){
		var items=this.currentItems[catId];
		if(typeof index==='object')
			index=items.indexOf(index);

		items.splice(index, 1);
		document.getElementById('container-'+catId).removeChild(document.getElementById('container-'+catId).children[index]);

		for(var i=index; i<items.length; i++){
			items[i].index--;
			document.getElementById('container-'+catId).children[i].querySelector('.item-number').innerHTML='#'+items[i].index;
		}

		var fakeItem;
		if(catId==='weapons' || catId==='bows' || catId==='shields'){
			fakeItem=new Equipment(catId, items.length, '', 0xffffffff, Equipment.MODIFIER_NO_BONUS, 0xffffffff);
		}else if(catId==='armors'){
			fakeItem=new Armor(items.length, '', Armor.DYE_NONE);
		}else if(catId==='materials' || catId==='food' || catId==='devices' || catId==='key'){
			fakeItem=new Item(catId, items.length, '', 0xffffffff)
		}
		fakeItem.save();
	},

	addItem:function(catId){
		var categoryHash=capitalizeCategoryId(catId);
		var maxItems=SavegameEditor.readU32('Array'+categoryHash+'Ids');

		var lastItem=this.getLastItem(catId);
		var newId;

		if(lastItem && lastItem.index===(maxItems -1)){
			console.warn('not enough space in '+catId);
			return false;
		}

		var itemList=this.getTranslationHash(catId);
		var itemListArray=[];
		for(var id in itemList){
			itemListArray.push(id);
		}

		if(lastItem){
			var nextIndexId=itemListArray.indexOf(lastItem.id)+1;
			if(nextIndexId===itemListArray.length)
				nextIndexId=0;
			newId=itemListArray[nextIndexId];
		}else{
			newId=itemListArray[0];
		}

		var newItem, maxItems;
		if(catId==='weapons' || catId==='bows' || catId==='shields'){
			newItem=lastItem? lastItem.copy(lastItem.index+1, newId) : new Equipment(catId, 0, newId);
			if(lastItem)
				newItem.restoreDurability();
		}else if(catId==='armors'){
			newItem=lastItem? lastItem.copy(lastItem.index+1, newId) : new Armor(0, newId);
		}else if(catId==='arrows' || catId==='materials' || catId==='food' || catId==='devices' || catId==='key'){
			newItem=lastItem? lastItem.copy(lastItem.index+1, newId) : new Item(catId, 0, newId);
		}
		newItem.removable=true;

	

		this.currentItems[catId].push(newItem);
		var row=this._createItemRow(newItem);
		document.getElementById('container-'+newItem.category).appendChild(row);
		row.scrollIntoView({behavior:'smooth',block:'center'});
	},


	getLastItem:function(catId){
		var lastIndex=-1;
		for(var i=0; i<SavegameEditor.currentItems[catId].length; i++){
			if(SavegameEditor.currentItems[catId][i].index > lastIndex)
				lastIndex=SavegameEditor.currentItems[catId][i].index;
		}
		if((lastIndex+1)===SavegameEditor.currentItems[catId].length)
			return SavegameEditor.currentItems[catId][lastIndex];
		console.error('invalid '+catId+' index');
		return null;
	},

	getTranslationHash:function(catId){
		if(catId==='weapons' || catId==='bows' || catId==='shields')
			return Equipment.TRANSLATIONS[catId];
		else if(catId==='armors')
			return Armor.TRANSLATIONS;
		else if(catId==='arrows' || catId==='materials' || catId==='food' || catId==='devices' || catId==='key')
			return Item.TRANSLATIONS[catId];
		else if(catId==='horses')
			return Horse.TRANSLATIONS;
		return null;
	},

	editItem:function(item){
		currentEditingItem=item;

		/* prepare edit item selector */		
		if(this.selectItem.lastCategory !== item.category){
			this.selectItem.innerHTML='';
			var itemList=this.getTranslationHash(item.category);
			for(var itemId in itemList){
				var opt=document.createElement('option');
				opt.value=itemId;
				opt.innerHTML=itemList[itemId];
				this.selectItem.appendChild(opt);
			}

			this.selectItem.lastCategory=item.category;
		}
		this.selectItem.value=item.id;
		if(!this.selectItem.value){
			var opt=document.createElement('option');
			opt.value=item.id;
			opt.innerHTML='Unknown: '+item.id;
			this.selectItem.appendChild(opt);
			this.selectItem.value=item.id;
		}

		document.getElementById('item-name-'+item.category+'-'+item.index).innerHTML='';
		document.getElementById('item-name-'+item.category+'-'+item.index).parentElement.appendChild(this.selectItem);
		this.selectItem.focus();
		this.selectItem.click();
	},
	editItem2:function(item, newId){
		item.id=newId;
		if(item.category==='horses'){
			item.fixValues();
		}

		var oldRow=document.getElementById('row-item-'+item.category+'-'+item.index);
		var newRow=this._createItemRow(item);
		oldRow.parentElement.replaceChild(newRow, oldRow);

		//TOTK_Icons.setIcon(document.getElementById('icon'+i), newId);
		//if(document.getElementById('number-item'+i))
		//	document.getElementById('number-item'+i).maxValue=this._getItemMaximumQuantity(newId);
	},

	restoreDurability:function(catId){
		this.currentItems[catId].forEach(function(equipment, i){
			equipment.restoreDurability();
		});
	},

	addMapPin:function(icon, x, y, z){
		for(var i=0; i<this.currentItems.mapPins.length; i++){
			if(this.currentItems.mapPins[i].isFree() && !MapPin.find(this.currentItems.mapPins, x, y, z)){
				this.currentItems.mapPins[i].icon=icon;
				this.currentItems.mapPins[i].coordinates={x:x, y:y};
				this.currentItems.mapPins[i].map=MapPin.getMapByZ(z);
				this.refreshMapPinsCounter();
				return true;
			}
		}
		return false;
	},
	addKorokPins:function(start, end){
		var count=0;
		for(var i=start; i<=end && i<Korok.COORDINATES.length; i++){
			if(this.addMapPin(MapPin.ICON_LEAF, Korok.COORDINATES[i][2], Korok.COORDINATES[i][4], Korok.COORDINATES[i][3])) //vector3f is turned into a vector2f --> z->y
				count++;
		}

		this.refreshMapPinsCounter();
		MarcDialogs.alert(count+' map pins added');
		return count;
	},
	clearAllMapPins:function(){
		var count=0;
		for(var i=0; i<this.currentItems.mapPins.length; i++){
			if(this.currentItems.mapPins[i].clear())
				count++;
		}

		this.refreshMapPinsCounter();
		MarcDialogs.alert(count+' map pins removed');
		return count;
	},

	_refreshCounter:function(container, val, max){
		setValue(container+'-counter', val+'<small>/'+max+'</small>');
	},
	refreshMapPinsCounter:function(){
		this._refreshCounter('pin', MapPin.count(this.currentItems.mapPins), MapPin.MAX);
	},
	refreshCompendiumCounter:function(){
		this._refreshCounter('compendium', Compendium.count().total, Compendium.HASHES_GOT_FLAGS.length);
	},
	refreshShrineCounters:function(){
		this._refreshCounter('shrines-found', Shrine.countFound(), Shrine.HASHES_FOUND.length);
		this._refreshCounter('shrines-clear', Shrine.countClear(), Shrine.HASHES_STATUS.length);
	},
	refreshLightrootCounters:function(){
		this._refreshCounter('lightroots-found', Lightroot.countFound(), Lightroot.HASHES_FOUND.length);
		this._refreshCounter('lightroots-clear', Lightroot.countClear(), Lightroot.HASHES_STATUS.length);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		tempFile.littleEndian=true;
		//if(tempFile.fileName==='caption.sav'){
		if(/caption/.test(tempFile.fileName)){
			var startOffset=0x0474;
			if(tempFile.readU32(startOffset)===0xe0ffd8ff){
				var endOffset=startOffset+4;
				var found=false;
				while(endOffset<(tempFile.fileSize-2) && !found){
					if(tempFile.readU8(endOffset)===0xff && tempFile.readU8(endOffset + 1)===0xd9){
						found=true;
					}else{
						endOffset++;
					}
				}
				
				if(found){
					var arrayBuffer=tempFile._u8array.buffer.slice(startOffset, endOffset+2);
					var blob=new Blob([arrayBuffer], {type:'image/jpeg'});
					var imageUrl=(window.URL || window.webkitURL).createObjectURL(blob);
					var img=new Image();
					img.src=imageUrl;
					document.getElementById('dialog-caption').innerHTML='';
					document.getElementById('dialog-caption').appendChild(img);
					window.setTimeout(function(){
						MarcDialogs.open('caption')
					}, 100);
				}
			}
		}else{
			for(var i=0; i<this.Constants.FILESIZE.length; i++){
				var dummyHeader=tempFile.readU32(0);
				var versionHash=tempFile.readU32(4);

				if(tempFile.fileSize===this.Constants.FILESIZE[i] && dummyHeader===0x01020304 && versionHash===this.Constants.HEADER[i]){
					this._getOffsets();
					setValue('version', this.Constants.VERSION[i]);
					return true;
				}
			}
		}

		return false
	},


	preload:function(){
		this.selectItem=document.createElement('select');
		this.selectItem.addEventListener('blur', function(){
			//console.log('blur');
			SavegameEditor.editItem2(currentEditingItem, this.value);
			//document.getElementById('item-name-'+currentEditingItem.category+'-'+currentEditingItem.index).innerHTML=SavegameEditor._getItemTranslation(currentEditingItem.id);
			//this.parentElement.removeChild(this);
			currentEditingItem=null;
		}, false);

		/* prepare fusable items list */
		for(var itemId in Equipment.TRANSLATIONS.weapons){
			if(!/^Weapon_Sword_07/.test(itemId))
				Equipment.FUSABLE_ITEMS.push({value:itemId, name:'Weapon: '+Equipment.TRANSLATIONS.weapons[itemId]})
		}
		for(var itemId in Equipment.TRANSLATIONS.shields){
			Equipment.FUSABLE_ITEMS.push({value:itemId, name:'Shield: '+Equipment.TRANSLATIONS.shields[itemId]})
		}
		for(var itemId in Item.TRANSLATIONS.materials){
			Equipment.FUSABLE_ITEMS.push({value:itemId, name:'Material: '+Item.TRANSLATIONS.materials[itemId]})
		}
		for(var itemId in Item.TRANSLATIONS.devices){
			Equipment.FUSABLE_ITEMS.push({value:itemId.replace('_Capsule',''), name:'Zonai: '+Item.TRANSLATIONS.devices[itemId]})
		}

		setNumericRange('rupees', 0, 999999);
		setNumericRange('pony-points', 0, 999999);

		setNumericRange('pouch-size-swords', 9, 20);
		setNumericRange('pouch-size-bows', 5, 14);
		setNumericRange('pouch-size-shields', 4, 20);
		getField('pouch-size-swords').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=9)
				SavegameEditor.currentItems.pouchSword=newVal;
		});
		getField('pouch-size-bows').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=5)
				SavegameEditor.currentItems.pouchBow=newVal;
		});
		getField('pouch-size-shields').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=4)
				SavegameEditor.currentItems.pouchShield=newVal;
		});


		/*setNumericRange('mons', 0, 999999);
		setNumericRange('relic-gerudo', 0, 99);
		setNumericRange('relic-goron', 0, 99);
		setNumericRange('relic-rito', 0, 99);*/

		/* map position selectors */
		/*select(
			'pos-maptype',
			[
				'?',
				{value:'MainField',name:'MainField'},
				{value:'MainFieldDungeon',name:'MainFieldDungeon'}
			],
			function(){
				if(this.value==='MainField'){
					setValue('pos-map','A-1');
				}else if(this.value==='MainFieldDungeon'){
					setValue('pos-map','RemainsElectric');
					fixDungeonCoordinates();
				}
			}
		);*/

		/*var maps=['?'];
		for(var i=0; i<10; i++){
			for(var j=0; j<8; j++){
				var map=(String.fromCharCode(65+i))+'-'+(j+1);
				maps.push({value:map,name:map});
			}
		}
		for(var i=0; i<120; i++){
			var map='Dungeon'
			if(i<100)
				map+='0';
			if(i<10)
				map+='0';
			map+=i;
			maps.push({value:map,name:map});
		}
		maps.push({value:'RemainsElectric',name:'RemainsElectric'});
		maps.push({value:'RemainsFire',name:'RemainsFire'});
		maps.push({value:'RemainsWater',name:'RemainsWater'});
		maps.push({value:'RemainsWind',name:'RemainsWind'});
		select('pos-map', maps, function(){
			if(/^.-\d$/.test(this.value)){
				setValue('pos-maptype','MainField');
			}else if(/^Remains/.test(this.value)){
				setValue('pos-maptype','MainFieldDungeon');
				fixDungeonCoordinates();
			}else if(/^Dungeon/.test(this.value)){
				setValue('pos-maptype','MainFieldDungeon');
			}
		});*/

		MarcTooltips.add('.tab-button',{className:'dark',fixed:true});
	},

	_timeToString:function(timeVal){
		var seconds=timeVal%60;
		if(seconds<10)seconds='0'+seconds;
		var minutes=parseInt(timeVal/60)%60;
		if(minutes<10)minutes='0'+minutes;
		return parseInt(timeVal/3600)+':'+minutes+':'+seconds;
	},

	/* load function */
	load:function(){
		tempFile.fileName='progress.sav';

		this.selectItem.lastCategory=null;

		/* empty item containers */
		var ITEM_CATS=['weapons','bows','shields','armors','arrows','materials','food','devices','key','horses'];
		ITEM_CATS.forEach(function(catId, i){
			empty('container-'+catId);
		});

		/* read items */
		this.currentItems={
			'weapons':Equipment.readAll('weapons'),
			'bows':Equipment.readAll('bows'),
			'shields':Equipment.readAll('shields'),
			'armors':Armor.readAll(),
			'arrows':Item.readAll('arrows'),
			'materials':Item.readAll('materials'),
			'food':Item.readAll('food'),
			'devices':Item.readAll('devices'),
			'key':Item.readAll('key'),
			
			'horses':Horse.readAll(),
			
			'mapPins':MapPin.readAll()
		};
	
		/* prepare editor */
		setValue('playtime', this._timeToString(this.readU32('Playtime')));

		setValue('rupees', this.readU32('CurrentRupees'));
		/*setValue('mons', this.readU32(this.Offsets.MONS));*/
		setValue('max-hearts', this.readU32('MaxHearts'));
		setValue('max-stamina', this.readU32('MaxStamina'));
		setValue('max-battery', this.readF32('MaxBattery'));
		setValue('pony-points', this.readU32('PonyPoints'));

		setValue('number-pouch-size-swords', this.readU32Array('ArrayPouchSwords', 0));
		setValue('number-pouch-size-bows', this.readU32Array('ArrayPouchBows', 0));
		setValue('number-pouch-size-shields', this.readU32Array('ArrayPouchShields', 0));



		/* coordinates */
		var playerPos=this.readVector3F('PlayerPos');
		setValue('pos-x', playerPos.x);
		setValue('pos-y', -playerPos.z);
		setValue('pos-z', playerPos.y-105);




		/*setValue('relic-gerudo', tempFile.readU32(this.Offsets.RELIC_GERUDO));
		setValue('relic-goron', tempFile.readU32(this.Offsets.RELIC_GORON));
		setValue('relic-rito', tempFile.readU32(this.Offsets.RELIC_RITO));

		setValue('koroks', tempFile.readU32(this.Offsets.KOROK_SEED_COUNTER));
		setValue('defeated-hinox', tempFile.readU32(this.Offsets.DEFEATED_HINOX_COUNTER));
		setValue('defeated-talus', tempFile.readU32(this.Offsets.DEFEATED_TALUS_COUNTER));
		setValue('defeated-molduga', tempFile.readU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER));*/



		/*var map=this._readString(this.Offsets.MAP);
		var mapType=this._readString(this.Offsets.MAPTYPE);
		getField('pos-map').children[0].value=map;
		getField('pos-map').children[0].innerHTML='* '+map+' *';
		getField('pos-maptype').children[0].value=mapType;
		getField('pos-maptype').children[0].innerHTML='* '+mapType+' *';
		setValue('pos-map',map)
		setValue('pos-maptype',mapType);*/


		/* map pins */
		this.refreshMapPinsCounter();

		/* shrines/lightroots */
		this.refreshShrineCounters();
		this.refreshLightrootCounters();
		
		/* compendium */
		this.refreshCompendiumCounter();

		/* build item containers */
		ITEM_CATS.forEach(function(catId, i){
			SavegameEditor.currentItems[catId].forEach(function(item, j){
				document.getElementById('container-'+item.category).appendChild(
					SavegameEditor._createItemRow(item)
				);
			});
			MarcTooltips.add('#container-'+catId+' select',{position:'bottom',align:'right'});
			MarcTooltips.add('#container-'+catId+' input',{position:'bottom',align:'right'});
		});

		showTab('home');
	},

	/* save function */
	save:function(){
		/* STATS */
		this.writeU32('CurrentRupees', null, getValue('rupees'));
		/*this.writeU32('Mons', getValue('mons'));*/
		this.writeU32('MaxHearts', null, getValue('max-hearts'));
		this.writeU32('MaxStamina', null, getValue('max-stamina'));
		this.writeF32('MaxBattery', null, getValue('max-battery'));
		this.writeU32('PonyPoints', null, getValue('pony-points'));

		this.writeU32('ArrayPouchSwords', 0, getValue('pouch-size-swords'));
		this.writeU32('ArrayPouchBows', 0, getValue('pouch-size-bows'));
		this.writeU32('ArrayPouchShields', 0, getValue('pouch-size-shields'));


		var playerPos={
			x:getValue('pos-x'),
			z:-getValue('pos-y'),
			y:getValue('pos-z')+105
		};
		this.writeVector3F('PlayerPos', null, playerPos);

		/*tempFile.writeU32(this.Offsets.RELIC_GERUDO, getValue('relic-gerudo'));
		tempFile.writeU32(this.Offsets.RELIC_GORON, getValue('relic-goron'));
		tempFile.writeU32(this.Offsets.RELIC_RITO, getValue('relic-rito'));
		
		tempFile.writeU32(this.Offsets.KOROK_SEED_COUNTER, getValue('koroks'));
		tempFile.writeU32(this.Offsets.DEFEATED_HINOX_COUNTER, getValue('defeated-hinox'));
		tempFile.writeU32(this.Offsets.DEFEATED_TALUS_COUNTER, getValue('defeated-talus'));
		tempFile.writeU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER, getValue('defeated-molduga'));*/


		/* COORDINATES */
		/*this._writeString(this.Offsets.MAP, getValue('pos-map'))
		this._writeString(this.Offsets.MAPTYPE, getValue('pos-maptype'))*/


		/* ITEMS */
		['weapons','bows','shields','armors','arrows','materials','food','devices','key'].forEach(function(catId, i){
			SavegameEditor.currentItems[catId].forEach(function(item, j){
				item.save();
			});
		});
		Item.fixKeyAvailabilityFlags();


		/* HORSES */
		for(var i=0; i<SavegameEditor.currentItems.horses.length; i++){
			SavegameEditor.currentItems.horses[i].save();
		}


		/* MAP PINS */
		for(var i=0; i<SavegameEditor.currentItems.mapPins.length; i++){
			SavegameEditor.currentItems.mapPins[i].save();
		}
	}
}





/* TABS */
var availableTabs=['home','weapons','bows','shields','armors','materials','food','devices','key','horses','master'/*,'help'*/];


var currentTab;
function showTab(newTab){
	currentTab=newTab;
	for(var i=0; i<availableTabs.length; i++){
		document.getElementById('tab-button-'+availableTabs[i]).className=currentTab===availableTabs[i]?'tab-button active':'tab-button';
		document.getElementById('tab-'+availableTabs[i]).style.display=currentTab===availableTabs[i]?'block':'none';
	}

	if(newTab==='master'){
		if(TOTKMasterEditor.isLoaded()){
			TOTKMasterEditor.refreshResults();
			get('input-custom-filter').focus();
		}else{
			TOTKMasterEditor.loadHashes();
		}
	}
}



/* MarcTooltips.js v20200216 - Marc Robledo 2014-2020 - http://www.marcrobledo.com/license */
var MarcTooltips=function(){var n=/MSIE 8/.test(navigator.userAgent);function d(t,e,o){n?t.attachEvent("on"+e,o):t.addEventListener(e,o,!1)}function u(t){void 0!==t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function g(t){if(/^#[0-9a-zA-Z_\-]+$/.test(t))return[document.getElementById(t.replace("#",""))];var e=document.querySelectorAll(t);if(n){for(var o=[],i=0;i<e.length;i++)o.push(e[i]);return o}return Array.prototype.slice.call(e)}var h=function(t,e,o){t.className=t.className.replace(/position-\w+/,"position-"+e.position).replace(/align-\w+/,"align-"+e.align);var i=(window.pageXOffset||document.documentElement.scrollLeft)-(document.documentElement.clientLeft||0),n=(window.pageYOffset||document.documentElement.scrollTop)-(document.documentElement.clientTop||0);e.fixed&&(n=i=0);var l=t.attachedTo.getBoundingClientRect().left,a=t.attachedTo.getBoundingClientRect().top,s=t.attachedTo.offsetWidth,p=t.attachedTo.offsetHeight;if("up"===e.position?t.style.top=parseInt(a+n-t.offsetHeight)+"px":"down"===e.position?t.style.top=parseInt(a+n+p)+"px":"top"===e.align?t.style.top=parseInt(a+n)+"px":"bottom"===e.align?t.style.top=parseInt(a+n-(t.offsetHeight-p))+"px":t.style.top=parseInt(a+n-parseInt((t.offsetHeight-p)/2))+"px","up"===e.position||"down"===e.position?"left"===e.align?t.style.left=parseInt(l+i)+"px":"right"===e.align?t.style.left=parseInt(l+i-(t.offsetWidth-s))+"px":t.style.left=parseInt(l+i-parseInt((t.offsetWidth-s)/2))+"px":"left"===e.position?t.style.left=parseInt(l+i-t.offsetWidth)+"px":"right"===e.position&&(t.style.left=parseInt(l+i+s)+"px"),o){var r={position:e.position,align:e.align,fixed:e.fixed},c=parseInt(t.style.left.replace("px","")),f=parseInt(t.style.top.replace("px","")),d=c+t.offsetWidth,u=f+t.offsetHeight,g=(i=window.scrollX,n=window.scrollY,Math.max(document.documentElement.clientWidth,window.innerWidth||0)),m=Math.max(document.documentElement.clientHeight,window.innerHeight||0);"up"===e.position||"down"===e.position?(g<d?r.align="right":c<i&&(r.align="left"),f<n?r.position="down":n+m<u&&(r.position="up")):(m<u?r.align="bottom":f<n&&(r.align="top"),c<i?r.position="right":i+g<d&&(r.position="left")),h(t,r,!1)}},m={};d(window,"load",function(){d(n?document:window,"click",function(){for(key in m)/ visible$/.test(m[key].className)&&/:true:/.test(key)&&(m[key].className=m[key].className.replace(" visible",""))}),d(window,"resize",function(){for(key in m)/ visible$/.test(m[key].className)&&m[key].attachedTo&&h(m[key],m[key].tooltipInfo,!0)})});function y(t){var e=t.currentTarget||t.srcElement;e.title&&(e.setAttribute("data-tooltip",e.title),e.title=""),(e.tooltip.attachedTo=e).tooltip.innerHTML=e.getAttribute("data-tooltip"),e.tooltip.className+=" visible",h(e.tooltip,e.tooltip.tooltipInfo,!0)}function w(t){var e=t.currentTarget||t.srcElement;e.tooltip.className=e.tooltip.className.replace(" visible","")}return{add:function(t,e){var o="down",i="center",n=!1,l=!1,a=!1,s=!1,p=!1;e&&(e.position&&/^(up|down|left|right)$/i.test(e.position)&&(o=e.position.toLowerCase()),e.align&&/^(top|bottom|left|right)$/i.test(e.align)&&(("up"!==o&&"down"!==o||"left"!==e.align&&"right"!==e.align)&&("left"!==o&&"right"!==o||"top"!==e.align&&"bottom"!==e.align)||(i=e.align.toLowerCase())),l=e.clickable||e.onClick||e.onclick||!1,a=e.focusable||e.onFocus||e.onfocus||!1,s=e.fixed||e.positionFixed||!1,n=e.class||e.className||e.customClass||e.customClassName||!1,p=e.text||e.customText||!1);for(var r=function(t){if("string"==typeof t)return g(t);if(t.length){for(var e=[],o=0;o<t.length;o++)"string"==typeof t[o]?e=e.concat(g(t[o])):e.push(t[o]);return e}return[t]}(t),c=function(t,e,o,i,n){var l=t+":"+e+":"+o+":"+i;if(m[l])return m[l];var a=document.createElement("div");return a.className="tooltip position-"+t+" align-"+e,a.className+="left"===t||"right"===t?" position-horizontal":" position-vertical",i&&(a.className+=" "+i),a.style.position=n?"fixed":"absolute",a.style.zIndex="9000",a.style.top="0",a.style.left="0",a.attachedTo=null,a.tooltipInfo={position:t,align:e,fixed:n},o&&d(a,"click",u),m[l]=a,document.body.appendChild(a),a}(o,i,l||a,n,s),f=0;f<r.length;f++)p?r[f].setAttribute("data-tooltip",p):r[f].title&&r[f].setAttribute("data-tooltip",r[f].title),r[f].title="",r[f].tooltip=c,a?(d(r[f],"focus",y),d(r[f],"blur",w),d(r[f],"click",u)):l?(d(r[f],"click",y),d(r[f],"click",u)):(d(r[f],"mouseover",y),d(r[f],"mouseout",w))}}}();

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





function capitalizeCategoryId(catId){
	return (catId.charAt(0).toUpperCase() + catId.substr(1)).replace(/s$/, '')
}
