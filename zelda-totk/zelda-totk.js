/*
	The legend of Zelda: Tears of the Kingdom savegame editor v20230604

	by Marc Robledo 2023
*/
var currentEditingItem;

SavegameEditor={
	Name:'The legend of Zelda: Tears of the Kingdom',
	Filename:['progress.sav','caption.sav'],
	Version:20230604,
	noDemo:true,

	/* Settings */
	Settings:{
		lang:'en',
		removeWarning:true
	},

	/* Constants */
	Constants:{
		GAME_VERSIONS:[
			{version:'v1.0', fileSize:2307552, header:0x0046c3c8, metaDataStart:0x0003c050},
			{version:'v1.1.x', fileSize:2307656, header:0x0047e0f4, metaDataStart:0x0003c088}
		],

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
		0xd2025694, 'ArrayMapPinMap',

		//0xe5b21993, 'ActiveMode', //???
		//0x84328ce6, 'AutoBuilder',
		//0x8ad36c62, 'AutoBuilder.Draft',
		//0x55cb3b43, 'AutoBuilder.Draft.Content',
		0xd27f8651, 'AutoBuilder.Draft.Content.Index', //S32, length=30
		0xa56722b6, 'AutoBuilder.Draft.Content.CombinedActorInfo', //binary data (size=6688), length=0?
		0xc5bf2815, 'AutoBuilder.Draft.Content.CameraPos', //Vector3F, length=30
		0xef74dca7, 'AutoBuilder.Draft.Content.CameraAt', //Vector3F, length=30
		0x67f4b46b, 'AutoBuilder.Draft.Content.IsFavorite' //S32?, length=30
		//0x4058267a, 'AutoBuilder.Draft.Content.SerialNumber',
		//0xb1c6f532, 'AutoBuilder.Draft.Content.IsValid'
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
	readDynamicDataArray:function(hashKey, arrayIndex){
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
	writeDynamicData:function(hashKey, arrayIndex, data){
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
			if(typeof loadedSettings.removeWarning==='boolean'){
				this.Settings.removeWarning=loadedSettings.removeWarning;
			}
		}
	},
	saveSettings:function(){
		if(typeof localStorage==='object'){
			localStorage.setItem('zelda-totk-sge-settings', JSON.stringify(this.Settings));
		}
	},



	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_getOffsets:function(){
		var ret=true;
		this.Offsets={};
		for(var i=0x000028; i<0x03c800; i+=8){
			var hash=tempFile.readU32(i);
			var foundHashIndex=this.Hashes.indexOf(hash);
			if(hash===0xa3db7114){ //found MetaData.SaveTypeHash
				break;
			}else if(foundHashIndex!==-1){
				if(/^(Array|PlayerPos|AutoBuilder)/.test(this.Hashes[foundHashIndex+1]))
					this.Offsets[this.Hashes[foundHashIndex+1]]=tempFile.readU32(i+4);
				else
					this.Offsets[this.Hashes[foundHashIndex+1]]=i+4;
			}
		}
		for(var i=0; i<this.Hashes.length; i+=2){
			if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.error('hash '+this.Hashes[i+1]+' not found');
				ret=false;
			}
		}
		return ret;
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
				if(SavegameEditor.Settings.removeWarning){
					MarcDialogs.confirm('Are you sure you want to delete <strong>'+item.getItemTranslation()+'</strong>?<br/><div style="color:red">Warning: use this feature at your own risk</div>', function(){
						MarcDialogs.close();
						SavegameEditor._removeItem(item.category, item.index);
					});
				}else{
					SavegameEditor._removeItem(item.category, item.index);
				}
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

	_findItem:function(catId, itemId){
		var items=this.currentItems[catId];
		for(var i=0; i<items.length; i++){
			if(items[i].id===itemId)
				return items[i];
		}
		return false;
	},

	addItem:function(catId, itemId, quantity){
		var categoryHash=capitalizeCategoryId(catId);
		var maxItems=SavegameEditor.readU32('Array'+categoryHash+'Ids');

		var lastItem=this.getLastItem(catId);

		if(lastItem && lastItem.index===(maxItems -1)){
			console.warn('not enough space in '+catId);
			return false;
		}


		if(typeof itemId==='string'){
			quantity=typeof quantity==='number' && quantity>0? quantity : 1;
			var foundItem=SavegameEditor._findItem(catId,itemId);
			if(foundItem){
				foundItem.quantity+=quantity;
				foundItem._htmlInputQuantity.value=foundItem.quantity;
			}else{
				var newItem=new Item(catId, SavegameEditor.currentItems[catId].length, itemId, quantity);
				newItem.removable=true;
				SavegameEditor.currentItems[catId].push(newItem);
				document.getElementById('container-'+catId).appendChild(SavegameEditor._createItemRow(newItem));
			}
			return quantity;
		}

		var itemList=this.getTranslationHash(catId);
		var itemListArray=[];
		for(var id in itemList){
			itemListArray.push(id);
		}

		var newId;
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

		return true;
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
				opt.innerHTML=Locale._(itemId) || itemList[itemId];
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
		if(typeof item.fixValues==='function'){
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
	addLocationPins:function(flags, coordinates, icon){
		var count=0;
		var offsets=this._getOffsetsByHashes(flags);
		for(var i=0; i<flags.length; i++){
			if(!tempFile.readU32(offsets[flags[i]]) && this.addMapPin(icon, coordinates[i][0], coordinates[i][2], coordinates[i][1])) //vector3f is turned into a vector2f --> z->y
				count++;
		}

		this.refreshMapPinsCounter();
		MarcDialogs.alert(count+' map pins added');
		return count;
	},
	addPinsKoroksHidden:function(){
		return this.addLocationPins(Korok.HASHES_FOUND_HIDDEN, Korok.COORDINATES_HIDDEN, MapPin.ICON_LEAF);
	},
	addPinsKoroksCarry:function(){
		var count=0;
		var offsets=this._getOffsetsByHashes(Korok.HASHES_FOUND_CARRY);
		for(var i=0; i<Korok.HASHES_FOUND_CARRY.length; i++){
			if(tempFile.readU32(offsets[Korok.HASHES_FOUND_CARRY[i]])===Korok.CARRY_STATUS_FALSE && this.addMapPin(MapPin.ICON_LEAF, Korok.COORDINATES_CARRY[i][0], Korok.COORDINATES_CARRY[i][2], Korok.COORDINATES_CARRY[i][1])) //vector3f is turned into a vector2f --> z->y
				count++;
		}

		this.refreshMapPinsCounter();
		MarcDialogs.alert(count+' map pins added');
		return count;
	},
	addPinsShrines:function(){
		return this.addLocationPins(Shrine.HASHES_FOUND, Shrine.COORDINATES, MapPin.ICON_CRYSTAL);
	},
	addPinsLightroots:function(){
		return this.addLocationPins(Lightroot.HASHES_FOUND, Lightroot.COORDINATES, MapPin.ICON_CRYSTAL);
	},
	addPinsSchematics:function(){
		return this.addLocationPins(Schematics.HASHES_FOUND, Schematics.COORDINATES, MapPin.ICON_DIAMOND);
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
	refreshKoroksCounter:function(){
		this._refreshCounter('korok-hidden', Korok.countHidden(), Korok.HASHES_FOUND_HIDDEN.length);
		this._refreshCounter('korok-carry', Korok.countCarry(), Korok.HASHES_FOUND_CARRY.length);
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
	refreshSchematicsCounters:function(){
		this._refreshCounter('schematics', Schematics.count(), Schematics.HASHES_FOUND.length);
	},
	refreshItemTab:function(catId){
		empty('container-'+catId);
		SavegameEditor.currentItems[catId].forEach(function(item, j){
			document.getElementById('container-'+item.category).appendChild(
				SavegameEditor._createItemRow(item)
			);
		});
		MarcTooltips.add('#container-'+catId+' select',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-'+catId+' input',{position:'bottom',align:'right'});
	},
	refreshItemTabs:function(){
		if(this.currentItems){
			var ITEM_CATS=['weapons','bows','shields','armors','arrows','materials','food','devices','key','horses'];
			ITEM_CATS.forEach(function(catId, i){
				SavegameEditor.refreshItemTab(catId);
			});
		}
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		tempFile.littleEndian=true;
		//if(tempFile.fileName==='caption.sav'){
		if(/caption/.test(tempFile.fileName)){
			for(var i=0x000028; i<0x000001c0; i+=8){
				var hash=tempFile.readU32(i);
				if(hash===0x63696a32){ //found JPG hash
					var jpgOffset=tempFile.readU32(i+4);
					var jpgSize=tempFile.readU32(jpgOffset);

					var arrayBuffer=tempFile._u8array.buffer.slice(jpgOffset+4, jpgOffset+4+jpgSize);
					var blob=new Blob([arrayBuffer], {type:'image/jpeg'});
					var imageUrl=(window.URL || window.webkitURL).createObjectURL(blob);
					var img=new Image();
					img.src=imageUrl;
					document.getElementById('dialog-caption').innerHTML='';
					document.getElementById('dialog-caption').appendChild(img);
					window.setTimeout(function(){
						MarcDialogs.open('caption')
					}, 100);

					break;
				}
			}
		}else if(tempFile.readU32(0)===0x01020304 && tempFile.fileSize>=2307552 && tempFile.fileSize<4194304){
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
				setValue('version', knownSavegameVersion || 'Unknown');
				return true;
			}
		}

		return false
	},


	preload:function(){
		this.loadSettings();
		Locale.set(this.Settings.lang);

		this.selectItem=document.createElement('select');
		this.selectItem.addEventListener('blur', function(){
			//console.log('blur');
			SavegameEditor.editItem2(currentEditingItem, this.value);
			//document.getElementById('item-name-'+currentEditingItem.category+'-'+currentEditingItem.index).innerHTML=SavegameEditor._getItemTranslation(currentEditingItem.id);
			//this.parentElement.removeChild(this);
			currentEditingItem=null;
		}, false);

		/* prepare fusable items list */
		Equipment.KNOWN_FUSABLE_MATERIALS.forEach(function(itemId){
			Equipment.FUSABLE_ITEMS.push({value:itemId,name:'*Material: '+Item.TRANSLATIONS.materials[itemId] || itemId})
		});

		Equipment.KNOWN_FUSABLE_OBJECTS.forEach(function(itemId){
			Equipment.FUSABLE_ITEMS.push({value:itemId,name:'Environment: '+itemId})
		});
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
			Equipment.FUSABLE_ITEMS.push({value:itemId.replace('_Capsule',''), name:'Zonai device: '+Item.TRANSLATIONS.devices[itemId]})
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



		/* autobuilder */
		get('input-file-autobuilder-import').addEventListener('change', function(evt){
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
						MarcDialogs.alert('Successfully imported schema at '+(importedAutobuilder.index+1));
					}else{
						MarcDialogs.alert('Error while importing schema at '+(importedAutobuilder.index+1));
					}
				}
			});

		});
		get('button-autobuilder-export').addEventListener('click', function(evt){
			var selectedIndex=parseInt(getValue('select-autobuilder-index'));
			var autobuilder=AutoBuilder.readSingle(selectedIndex);
			if(autobuilder)
				autobuilder.export().save();
		});
		get('button-autobuilder-import').addEventListener('click', function(evt){
			get('input-file-autobuilder-import').click();
		});

		/* settings */
		select('language').value=this.Settings.lang;
		get('checkbox-warning-delete').checked=this.Settings.removeWarning;
		select('language').addEventListener('change', function(evt){
			SavegameEditor.Settings.lang=this.value;
			Locale.set(this.value);
			SavegameEditor.saveSettings();
		});
		get('checkbox-warning-delete').addEventListener('change', function(evt){
			SavegameEditor.Settings.removeWarning=this.checked;
			SavegameEditor.saveSettings();
		});

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

		/* map pins */
		this.refreshMapPinsCounter();

		/* completionism */
		this.refreshKoroksCounter();
		this.refreshCompendiumCounter();
		this.refreshShrineCounters();
		this.refreshLightrootCounters();
		this.refreshSchematicsCounters();

		/* build item containers */
		this.refreshItemTabs();

		if(TOTKMasterEditor.isLoaded())
			TOTKMasterEditor.forceFindOffsets=true;

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
var availableTabs=['home','weapons','bows','shields','armors','materials','food','devices','key','horses','master','settings'];


var currentTab;
function showTab(newTab){
	currentTab=newTab;
	for(var i=0; i<availableTabs.length; i++){
		document.getElementById('tab-button-'+availableTabs[i]).className=currentTab===availableTabs[i]?'tab-button active':'tab-button';
		document.getElementById('tab-'+availableTabs[i]).style.display=currentTab===availableTabs[i]?'block':'none';
	}

	if(newTab==='master'){
		if(TOTKMasterEditor.isLoaded()){
			if(TOTKMasterEditor.forceFindOffsets)
				TOTKMasterEditor.findOffsets();
			TOTKMasterEditor.focus();
		}else{
			TOTKMasterEditor.initialize();
		}
	}
}



/* MarcTooltips.js v20200216 - Marc Robledo 2014-2020 - http://www.marcrobledo.com/license */
var MarcTooltips=function(){var n=/MSIE 8/.test(navigator.userAgent);function d(t,e,o){n?t.attachEvent("on"+e,o):t.addEventListener(e,o,!1)}function u(t){void 0!==t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function g(t){if(/^#[0-9a-zA-Z_\-]+$/.test(t))return[document.getElementById(t.replace("#",""))];var e=document.querySelectorAll(t);if(n){for(var o=[],i=0;i<e.length;i++)o.push(e[i]);return o}return Array.prototype.slice.call(e)}var h=function(t,e,o){t.className=t.className.replace(/position-\w+/,"position-"+e.position).replace(/align-\w+/,"align-"+e.align);var i=(window.pageXOffset||document.documentElement.scrollLeft)-(document.documentElement.clientLeft||0),n=(window.pageYOffset||document.documentElement.scrollTop)-(document.documentElement.clientTop||0);e.fixed&&(n=i=0);var l=t.attachedTo.getBoundingClientRect().left,a=t.attachedTo.getBoundingClientRect().top,s=t.attachedTo.offsetWidth,p=t.attachedTo.offsetHeight;if("up"===e.position?t.style.top=parseInt(a+n-t.offsetHeight)+"px":"down"===e.position?t.style.top=parseInt(a+n+p)+"px":"top"===e.align?t.style.top=parseInt(a+n)+"px":"bottom"===e.align?t.style.top=parseInt(a+n-(t.offsetHeight-p))+"px":t.style.top=parseInt(a+n-parseInt((t.offsetHeight-p)/2))+"px","up"===e.position||"down"===e.position?"left"===e.align?t.style.left=parseInt(l+i)+"px":"right"===e.align?t.style.left=parseInt(l+i-(t.offsetWidth-s))+"px":t.style.left=parseInt(l+i-parseInt((t.offsetWidth-s)/2))+"px":"left"===e.position?t.style.left=parseInt(l+i-t.offsetWidth)+"px":"right"===e.position&&(t.style.left=parseInt(l+i+s)+"px"),o){var r={position:e.position,align:e.align,fixed:e.fixed},c=parseInt(t.style.left.replace("px","")),f=parseInt(t.style.top.replace("px","")),d=c+t.offsetWidth,u=f+t.offsetHeight,g=(i=window.scrollX,n=window.scrollY,Math.max(document.documentElement.clientWidth,window.innerWidth||0)),m=Math.max(document.documentElement.clientHeight,window.innerHeight||0);"up"===e.position||"down"===e.position?(g<d?r.align="right":c<i&&(r.align="left"),f<n?r.position="down":n+m<u&&(r.position="up")):(m<u?r.align="bottom":f<n&&(r.align="top"),c<i?r.position="right":i+g<d&&(r.position="left")),h(t,r,!1)}},m={};d(window,"load",function(){d(n?document:window,"click",function(){for(key in m)/ visible$/.test(m[key].className)&&/:true:/.test(key)&&(m[key].className=m[key].className.replace(" visible",""))}),d(window,"resize",function(){for(key in m)/ visible$/.test(m[key].className)&&m[key].attachedTo&&h(m[key],m[key].tooltipInfo,!0)})});function y(t){var e=t.currentTarget||t.srcElement;e.title&&(e.setAttribute("data-tooltip",e.title),e.title=""),(e.tooltip.attachedTo=e).tooltip.innerHTML=e.getAttribute("data-tooltip"),e.tooltip.className+=" visible",h(e.tooltip,e.tooltip.tooltipInfo,!0)}function w(t){var e=t.currentTarget||t.srcElement;e.tooltip.className=e.tooltip.className.replace(" visible","")}return{add:function(t,e){var o="down",i="center",n=!1,l=!1,a=!1,s=!1,p=!1;e&&(e.position&&/^(up|down|left|right)$/i.test(e.position)&&(o=e.position.toLowerCase()),e.align&&/^(top|bottom|left|right)$/i.test(e.align)&&(("up"!==o&&"down"!==o||"left"!==e.align&&"right"!==e.align)&&("left"!==o&&"right"!==o||"top"!==e.align&&"bottom"!==e.align)||(i=e.align.toLowerCase())),l=e.clickable||e.onClick||e.onclick||!1,a=e.focusable||e.onFocus||e.onfocus||!1,s=e.fixed||e.positionFixed||!1,n=e.class||e.className||e.customClass||e.customClassName||!1,p=e.text||e.customText||!1);for(var r=function(t){if("string"==typeof t)return g(t);if(t.length){for(var e=[],o=0;o<t.length;o++)"string"==typeof t[o]?e=e.concat(g(t[o])):e.push(t[o]);return e}return[t]}(t),c=function(t,e,o,i,n){var l=t+":"+e+":"+o+":"+i;if(m[l])return m[l];var a=document.createElement("div");return a.className="tooltip position-"+t+" align-"+e,a.className+="left"===t||"right"===t?" position-horizontal":" position-vertical",i&&(a.className+=" "+i),a.style.position=n?"fixed":"absolute",a.style.zIndex="9000",a.style.top="0",a.style.left="0",a.attachedTo=null,a.tooltipInfo={position:t,align:e,fixed:n},o&&d(a,"click",u),m[l]=a,document.body.appendChild(a),a}(o,i,l||a,n,s),f=0;f<r.length;f++)p?r[f].setAttribute("data-tooltip",p):r[f].title&&r[f].setAttribute("data-tooltip",r[f].title),r[f].title="",r[f].tooltip=c,a?(d(r[f],"focus",y),d(r[f],"blur",w),d(r[f],"click",u)):l?(d(r[f],"click",y),d(r[f],"click",u)):(d(r[f],"mouseover",y),d(r[f],"mouseout",w))}}}();





var UI={
	setLoading:function(fileName){
		if(fileName){
			setValue('span-loading-filename', fileName);
			document.getElementById('toast-loading').style.display='block';
		}else{
			document.getElementById('toast-loading').style.display='none';
		}
	}
};


function capitalizeCategoryId(catId){
	return (catId.charAt(0).toUpperCase() + catId.substr(1)).replace(/s$/, '')
}
