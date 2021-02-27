/*
	The legend of Zelda: Breath of the wild v20200218
	by Marc Robledo 2017-2020
*/
var currentEditingItem=0;

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',
	Version:20200218,

	/* Constants */
	Constants:{
		MAX_ITEMS:420,
		STRING_SIZE:0x20,
		STRING64_SIZE:0x80,

		//missing versions: 1.1.1, 1.1.2 and 1.4.1
		VERSION:				['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.3.1', 'Kiosk', 'v1.3.3','v1.3.4', 'v1.4',  'v1.5',  'v1.5*',  'v1.6',  'v1.6*', 'v1.6**','v1.6***'],
		FILESIZE:				[896976, 897160, 897112, 907824, 907824,  916576,  1020648, 1020648,   1027208, 1027208, 1027248, 1027216, 1027216, 1027216, 1027216],
		HEADER:					[0x24e2, 0x24ee, 0x2588, 0x29c0, 0x2a46,  0x2f8e,  0x3ef8,  0x3ef9,    0x471a,  0x471b, 0x471b,  0x471e, 0x0f423d, 0x0f423e,0x0f423f],

		ICON_TYPES:{SWORD: 27, BOW:28, SHIELD:29, POT:30, STAR:31, CHEST:32,SKULL:33,LEAF:34,TOWER:35}
	},

	/* Hashes */
	Hashes:[
		0x0bee9e46, 'MAP',
		0x0cbf052a, 'FLAGS_BOW',
		0x1e3fd294, 'FLAGSV_BOW',
		0x23149bf8, 'RUPEES',
		0x2906f327, 'MAX_HEARTS',
		0x333aa6e5, 'HORSE_SADDLES',
		0x3adff047, 'MAX_STAMINA',
		0x441b7231, 'DEFEATED_MOLDUGA_COUNTER',
		0x54679940, 'DEFEATED_HINOX_COUNTER',
		0x57ee221d, 'FLAGS_WEAPON',
		0x5f283289, 'ITEMS',
		0x6150c6be, 'HORSE_REINS',
		0x698266be, 'DEFEATED_TALUS_COUNTER',
		0x69f17e8a, 'FLAGSV_SHIELD',
		0x6a09fc59, 'ITEMS_QUANTITY',
		0x73c29681, 'PLAYTIME',
		0x7b74e117, 'HORSE_NAMES',
		0x8a94e07a, 'KOROK_SEED_COUNTER',
		0x9383490e, 'MapApp_MapIconNo',
		0x97f925c3, 'RELIC_GERUDO',
		0x982ba201, 'HORSE_POSITION',
		0x9c6cfd3f, 'HORSE_MANES',
		0xa40ba103, 'PLAYER_POSITION',
		0xa6d926bc, 'FLAGSV_WEAPON',
		0xc247b696, 'HORSE_TYPES',
		0xc5238d2b, 'FLAGS_SHIELD',
		0xc9328299, 'MOTORCYCLE', /* IsGet_Obj_Motorcycle */
		0xce7afed3, 'MONS',
		0xd913b769, 'MAPTYPE',
		0xe1a0ca54, 'HORSE_BONDS', /* max=0x3f80 */
		0xea9def3f, 'MapApp_MapIconPos',
		0xf1cf4807, 'RELIC_GORON',
		0xfda0cde4, 'RELIC_RITO'
	],

	/* Document utils */

	_getRowFromItemNumber: function(itemNumber){
		var nameSpan, spanContainer, row;
		nameSpan = document.getElementById("item-name"+itemNumber);
		if(nameSpan.parentElement){
			spanContainer = nameSpan.parentElement;
			if(spanContainer.parentElement){
				row = spanContainer.parentElement;
			}
		}
		return row;
	},
	_getItemNumberFromRow: function(rowElement){
		var rawItemNumber = rowElement
			.children[1] // Name column
			.children[1] // span with the item number
			.innerHTML;
		return rawItemNumber.match(/#([0-9]*)/)[1];
	},
	_getItemNameFromDoc: function(itemNumber){
		var element = document.getElementById("item-name"+itemNumber);
		if(element && element.innerText){
			return element.innerText;
        }
		return null;
	},
	_setItemNameInDoc: function(itemNumber, itemName){
		var element = document.getElementById("item-name"+itemNumber);
		if(element){
			element.innerText = itemName;
        }
	},
	_getItemModifierFromDoc: function(itemNumber, itemCategory){
		var element = document.getElementById("select-modifier-"+itemCategory+"-"+itemNumber);
		if(element && element.value){
			return element.value;
        }
		return null;
	},
	_setItemModifierInDoc: function(itemNumber, itemCategory, itemModifier){
		var element = document.getElementById("select-modifier-"+itemCategory+"-"+itemNumber);
		if(element && element.value){
			element.value = itemModifier;
			return;
        }
	},
	_getItemModifierValueFromDoc: function(itemNumber, itemCategory){
		var element = document.getElementById("number-modifier-"+itemCategory+"-value-"+itemNumber);
		if(element && element.value){
			return element.value;
        }
		return null;
	},
	_setItemModifierValueInDoc: function(itemNumber, itemCategory, itemModifierValue){
		var element = document.getElementById("number-modifier-"+itemCategory+"-value-"+itemNumber);
		if(element && element.value){
			element.value = itemModifierValue;
			return;
        }
	},
	_getItemDurabilityFromDoc: function(itemNumber){
		var element = document.getElementById("number-item"+itemNumber);
		if(element && element.value){
			return element.value;
        }
		return null;
	},
	_setItemDurabilityInDoc: function(itemNumber, itemDurability){
		var element = document.getElementById("number-item"+itemNumber);
		if(element && element.value){
			element.value = itemDurability;
			return;
        }
	},

	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeU32(offset+8*arrayIndex,val?1:0);else tempFile.writeU32(offset,val?1:0)},
	_writeValue:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeU32(offset+8*arrayIndex,val);else tempFile.writeU32(offset,val)},
	_writeFloat32:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeF32(offset+8*arrayIndex,val);else tempFile.writeF32(offset,val)},
	_writeString:function(offset,str,len){
		len=len || 8;
		for(var i=0; i<len; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeU8(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},
	_writeString64:function(offset,str,arrayIndex){if(typeof arrayIndex==='number')offset+=this.Constants.STRING64_SIZE*arrayIndex;this._writeString(offset,str, 16);},
	_writeString256:function(offset,str){this._writeString(offset,str, 64);},

	_searchHash:function(hash){
		for(var i=0x0c; i<tempFile.fileSize; i+=8)
			if(hash===tempFile.readU32(i))
				return i;
		return false;
	},
	_readFromHash:function(hash){
		var offset=this._searchHash(hash);
		if(typeof offset === 'number')
			return tempFile.readU32(offset+4);
		return false;
	},
	_writeValueAtHash:function(hash,val){
		var offset=this._searchHash(hash);
		if(typeof offset==='number')
			this._writeValue(offset+4,val);
	},

	_getOffsets:function(){
		this.Offsets={};
		this.Headers={};
		var startSearchOffset=0x0c;
		for(var i=0; i<this.Hashes.length; i+=2){
			for(var j=startSearchOffset; j<tempFile.fileSize; j+=8){
				if(this.Hashes[i]===tempFile.readU32(j)){
					this.Offsets[this.Hashes[i+1]]=j+4;
					this.Headers[this.Hashes[i+1]]=this.Hashes[i];
					startSearchOffset=j+8;
					break;
				}
			}
			/*if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.log(this.Hashes[i+1]+' not found');
			}*/
		}
	},

	_getItemTranslation:function(itemId){
		for(var i=0; i<BOTW_Data.Translations.length; i++)
			if(BOTW_Data.Translations[i].items[itemId])
				return BOTW_Data.Translations[i].items[itemId];
		return '<span style="color:red">'+itemId+'</span>'
	},
	_getItemCategory:function(itemId){
		for(var i=0; i<BOTW_Data.Translations.length; i++)
			if(BOTW_Data.Translations[i].items[itemId])
				return BOTW_Data.Translations[i].id;
		return 'other'
	},

	_readString:function(offset, len){
		len=len || 8;
		var txt='';
		for(var j=0; j<len; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},
	_readString64:function(offset,arrayIndex){
		if(typeof arrayIndex==='number')
			offset+=this.Constants.STRING64_SIZE*arrayIndex;
		return this._readString(offset, 16);
	},
	_readString256:function(offset,){
		return this._readString(offset, 64);
	},

	_loadItemName:function(i){
		return this._readString64(this.Offsets.ITEMS+i*0x80);
	},
	_writeItemName:function(i,newItemNameId){
		this._writeString64(this.Offsets.ITEMS, newItemNameId, i);
	},
	_getItemMaximumQuantity:function(itemId){
		var cat=this._getItemCategory(itemId);
		if(itemId.endsWith('Arrow') || itemId.endsWith('Arrow_A') || cat==='materials' || cat==='food'){
			return 999;
		}else if(cat==='weapons' || cat==='bows' || cat==='shields'){
			return 6553500;
		}else if(itemId==='Obj_DungeonClearSeal'){
			return 120
		}else if(itemId==='Obj_KorokNuts'){
			return 900
		}else{
			return 0xffffffff;
		}
	},
	_getItemQuantityOffset:function(i){
		return this.Offsets.ITEMS_QUANTITY+i*0x08;
	},
	_getItemRow:function(i){
		return getField('number-item'+i).parentElement.parentElement
	},
	_createItemRow:function(i,itemCat){
		var itemNameId=this._loadItemName(i);
		var itemVal=itemCat===false?1:tempFile.readU32(this._getItemQuantityOffset(i));

		var img=new Image();
		img.id='icon'+i;
		img.src=BOTW_Icons.getBlankIcon();

		/*img.addEventListener('error', function(){
			img.src=BOTW_Icons.getBlankIcon();
		}, false);*/

		var itemNumber=document.createElement('span');
		itemNumber.className='item-number';
		itemNumber.innerHTML='#'+i;

		var span=document.createElement('span');
		span.className='item-name clickable';
		span.id='item-name'+i;
		span.innerHTML=this._getItemTranslation(itemNameId);
		span.addEventListener('click', function(){
			SavegameEditor.editItem(i);
		}, false);


		var input;
		if(itemCat && itemCat==='clothes'){
			input=select('item'+i, BOTW_Data.DYE_COLORS, function(){
				BOTW_Icons.setIcon(img, SavegameEditor._loadItemName(i), parseInt(this.value));
			});
			input.value=itemVal;

			BOTW_Icons.setIcon(img, itemNameId, itemVal);
		}else{
			input=inputNumber('item'+i, 0, this._getItemMaximumQuantity(itemNameId), itemVal);
			BOTW_Icons.setIcon(img, itemNameId);
		}

		var r=row([1,6,3,2],
			img,
			span,
			document.createElement('div'), /* modifier column */
			input
		);
		r.className+=' row-items';
		r.children[1].appendChild(itemNumber);
		return r;
	},

	addItem:function(){
		var i=0;
		while(document.getElementById('number-item'+i) || document.getElementById('select-item'+i)){
			i++;
		}
		if(i<this.Constants.MAX_ITEMS){
			if(this._getItemCategory(this.selectItem.value)===currentTab){
				this.selectItem.selectedIndex++;
				if(this._getItemCategory(this.selectItem.value)!==currentTab || this.selectItem.value==='')
					this.selectItem.value=this.selectItem.categories[currentTab].children[0].value;
			}else{
				this.selectItem.value=this.selectItem.categories[currentTab].children[0].value;
			}
			var itemNameId=this.selectItem.value;
			this._writeItemName(i,itemNameId);
			var row=this._createItemRow(i, false);
			document.getElementById('container-'+this._getItemCategory(itemNameId)).appendChild(row);

			//add modifier fields
			var newItemCategory = this._getItemCategory(itemNameId);
			var modifierColumns=['weapons','bows','shields'];
			if(modifierColumns.indexOf(newItemCategory)>=0){
				if(newItemCategory === "bows" && !itemNameId.startsWith('Weapon_')){
					// do nothing (arrows do not have modifiers)
				}else{
					var category = currentTab;
					var categorySingular = category.replace(/s$/,"");
					var modifier=tempFile.readU32(this.Offsets['FLAGS_'+categorySingular.toUpperCase()]+i*8);
					var modifierSelect=select('modifier-'+category+'-'+i, BOTW_Data.MODIFIERS.concat({value:modifier,name:this._toHexInt(modifier)}));
					modifierSelect.value=modifier;
					var modifierContainer=this._getRowFromItemNumber(i).children[2];
					modifierContainer.appendChild(modifierSelect);
					modifierContainer.appendChild(inputNumber('modifier-'+category+'-value-'+i, 0, 0xffffffff, tempFile.readU32(this.Offsets['FLAGSV_'+categorySingular.toUpperCase()]+i*8)));
				}
			}

			(row.previousElementSibling || row).scrollIntoView({block:'start', behavior:'smooth'});
			this.editItem(i);
		}
	},

	editItem:function(i){
		currentEditingItem=i;
		this.selectItem.value=this._loadItemName(i);
		document.getElementById('item-name'+i).innerHTML='';
		document.getElementById('item-name'+i).parentElement.appendChild(this.selectItem);
		this.selectItem.focus();
		this.selectItem.click();
	},
	editItem2:function(i,nameId){
		var oldCat=this._getItemCategory(this._loadItemName(i));
		var newCat=this._getItemCategory(nameId);

		if(oldCat!==newCat){
			var row=this._getItemRow(i);
			row.parentElement.removeChild(row);
			document.getElementById('container-'+newCat).appendChild(row);
			showTab(newCat);
			(row.previousElementSibling || row).scrollIntoView({block:'start', behavior:'smooth'});
		}
		this._writeItemName(i, nameId);
		document.getElementById('item-name'+i).innerHTML=this._getItemTranslation(nameId);
		BOTW_Icons.setIcon(document.getElementById('icon'+i), nameId);
		if(document.getElementById('number-item'+i))
			document.getElementById('number-item'+i).maxValue=this._getItemMaximumQuantity(nameId);
	},

	filterItems:function(category){
	},

	_getModifierOffset1:function(type){
		if(type==='bows')
			return this.Offsets.FLAGS_BOW;
		else if(type==='shields')
			return this.Offsets.FLAGS_SHIELDS;
		else
			return this.Offsets.FLAGS_WEAPON;
	},
	_getModifierOffset2:function(type){
		if(type==='bows')
			return this.Offsets.FLAGSV_BOW;
		else if(type==='shields')
			return this.Offsets.FLAGSV_SHIELD;
		else
			return this.Offsets.FLAGSV_WEAPON;
	},

	editModifier2:function(type,i,modifier,val){
		tempFile.writeU32(this._getModifierOffset1(type)+i*0x08, modifier);
		tempFile.writeU32(this._getModifierOffset2(type)+i*0x08, val);
	},

	setHorseName:function(i,val){
		if(i<5)
			this._writeString64(this.Offsets.HORSE_NAMES, val, i);
	},
	setHorseSaddle:function(i,val){
		if(i<5)
			this._writeString64(this.Offsets.HORSE_SADDLES, val, i);
	},
	setHorseReins:function(i,val){
		if(i<5)
			this._writeString64(this.Offsets.HORSE_REINS, val, i);
	},
	setHorseType:function(i,val){
		if(currentEditingItem<6){
			this._writeString64(this.Offsets.HORSE_TYPES, val, i);
			/* fix mane */
			this._writeString64(this.Offsets.HORSE_MANES, (val==='GameRomHorse00L'?'Horse_Link_Mane_00L':'Horse_Link_Mane'), i);
		}
	},

	_arrayToSelectOpts:function(arr){
		var arr2=[];
		for(var i=0; i<arr.length; i++){
			var name=BOTW_Data.Translations[6].items[arr[i]] || arr[i];
			arr2.push({name:name, value:arr[i]});
		}
		return arr2;
	},

	changeEndianess:function(){
		// Save item data in clipboard
		BOTW_Clipboard.fillClipboardWithItems();

		var tempFileByteSwapped=new MarcFile(tempFile.fileSize);
		tempFileByteSwapped.fileType=tempFile.fileType;
		tempFileByteSwapped.fileName=tempFile.fileName;
		tempFileByteSwapped.littleEndian=!tempFile.littleEndian;
		for(var i=0; i<tempFile.fileSize; i+=4){
			tempFileByteSwapped.writeU32(i, tempFile.readU32(i));
		}
		tempFile=tempFileByteSwapped;
		this.checkValidSavegame();

		// reload save to apply changes
		this.load();
		// after changing endianess and reloading save, items get corrupted and all of them go to the other tab
		empty('container-other');
		// overwrite corrupted items with the ones in the clipboard
		BOTW_Clipboard.overwriteItemsWithClipboard();

	},

	/* check if savegame is valid */
	_checkValidSavegameByConsole:function(switchMode){
		var CONSOLE=switchMode?'Switch':'Wii U';
		tempFile.littleEndian=switchMode;
		for(var i=0; i<this.Constants.FILESIZE.length; i++){
			var versionHash=tempFile.readU32(0);

			if(tempFile.fileSize===this.Constants.FILESIZE[i] && versionHash===this.Constants.HEADER[i] && tempFile.readU32(4)===0xffffffff){
				this._getOffsets(i);
				setValue('version', this.Constants.VERSION[i]+' ('+CONSOLE+')');
				return true;
			}else if((tempFile.fileSize>=896976 && tempFile.fileSize<=1500000) && versionHash===this.Constants.HEADER[i] && tempFile.readU32(4)===0xffffffff){ /* check for mods, filesizes vary */
				this._getOffsets(i);
				setValue('version', this.Constants.VERSION[i]+'<small>mod</small> ('+CONSOLE+')');
				return true;
			}
		}

		return false
	},
	checkValidSavegame:function(){
		return this._checkValidSavegameByConsole(false) || this._checkValidSavegameByConsole(true);
	},


	preload:function(){
		this.selectItem=document.createElement('select');
		this.selectItem.addEventListener('blur', function(){
			//console.log('blur');
			SavegameEditor.editItem2(currentEditingItem, this.value);
			this.parentElement.removeChild(this);
			currentEditingItem=null;
		}, false);

		setNumericRange('rupees', 0, 999999);
		setNumericRange('mons', 0, 999999);
		setNumericRange('relic-gerudo', 0, 99);
		setNumericRange('relic-goron', 0, 99);
		setNumericRange('relic-rito', 0, 99);

		/* prepare edit item selector */
		this.selectItem.categories={};
		for(var i=0; i<BOTW_Data.Translations.length; i++){
			var optGroup=document.createElement('optgroup');
			optGroup.label=BOTW_Data.Translations[i].id;

			for(var item in BOTW_Data.Translations[i].items){
				var opt=document.createElement('option');
				opt.value=item;
				opt.group=BOTW_Data.Translations[i].id;
				opt.innerHTML=BOTW_Data.Translations[i].items[item];
				optGroup.appendChild(opt);
			}
			this.selectItem.appendChild(optGroup);
			this.selectItem.categories[BOTW_Data.Translations[i].id]=optGroup;
		}
		this.selectItem.value='Armor_180_Lower';

		/* map position selectors */
		select(
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
		);

		var maps=['?'];
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
		});


		/* horses */
		for(var i=0; i<6; i++){
			if(i<5){
				get('input-horse'+i+'-name').horseIndex=i;
				get('input-horse'+i+'-name').addEventListener('change', function(){SavegameEditor.setHorseName(this.horseIndex, this.value)}, false);
				get('select-horse'+i+'-saddles').horseIndex=i;
				get('select-horse'+i+'-saddles').addEventListener('change', function(){SavegameEditor.setHorseSaddle(this.horseIndex, this.value)}, false);
				get('select-horse'+i+'-reins').horseIndex=i;
				get('select-horse'+i+'-reins').addEventListener('change', function(){SavegameEditor.setHorseReins(this.horseIndex, this.value)}, false);
			}
			get('select-horse'+i+'-type').horseIndex=i;
			get('select-horse'+i+'-type').addEventListener('change', function(){SavegameEditor.setHorseType(this.horseIndex, this.value)}, false);

			select('horse'+i+'-saddles', this._arrayToSelectOpts(BOTW_Data.HORSE_SADDLES));
			select('horse'+i+'-reins', this._arrayToSelectOpts(BOTW_Data.HORSE_REINS));
			select('horse'+i+'-type', this._arrayToSelectOpts(i===5?BOTW_Data.HORSE_TYPES.concat(BOTW_Data.HORSE_TYPES_UNTAMMED):BOTW_Data.HORSE_TYPES));
		}



		MarcTooltips.add('.tab-button',{className:'dark',fixed:true});
	},

	_timeToString:function(timeVal){
		var seconds=timeVal%60;
		if(seconds<10)seconds='0'+seconds;
		var minutes=parseInt(timeVal/60)%60;
		if(minutes<10)seconds='0'+seconds;
		return parseInt(timeVal/3600)+':'+minutes+':'+seconds;
	},

	/* Load data from the savegame file */
	load:function(){
		tempFile.fileName='game_data.sav';


		/* prepare editor */
		setValue('rupees', tempFile.readU32(this.Offsets.RUPEES));
		setValue('mons', tempFile.readU32(this.Offsets.MONS));
		setValue('max-hearts', tempFile.readU32(this.Offsets.MAX_HEARTS));
		setValue('max-stamina', tempFile.readU32(this.Offsets.MAX_STAMINA));

		setValue('relic-gerudo', tempFile.readU32(this.Offsets.RELIC_GERUDO));
		setValue('relic-goron', tempFile.readU32(this.Offsets.RELIC_GORON));
		setValue('relic-rito', tempFile.readU32(this.Offsets.RELIC_RITO));

		setValue('koroks', tempFile.readU32(this.Offsets.KOROK_SEED_COUNTER));
		setValue('defeated-hinox', tempFile.readU32(this.Offsets.DEFEATED_HINOX_COUNTER));
		setValue('defeated-talus', tempFile.readU32(this.Offsets.DEFEATED_TALUS_COUNTER));
		setValue('defeated-molduga', tempFile.readU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER));
		setValue('playtime',this._timeToString(tempFile.readU32(this.Offsets.PLAYTIME)));


		/* motorcycle */
		document.getElementById('checkbox-motorcycle').checked=!!tempFile.readU32(this.Offsets.MOTORCYCLE);
		if(this.Offsets.MOTORCYCLE){
			document.getElementById('row-motorcycle').style.display='flex';
		}else{
			document.getElementById('row-motorcycle').style.display='none';
		}


		/* coordinates */
		setValue('pos-x', tempFile.readF32(this.Offsets.PLAYER_POSITION));
		setValue('pos-y', tempFile.readF32(this.Offsets.PLAYER_POSITION+8));
		setValue('pos-z', tempFile.readF32(this.Offsets.PLAYER_POSITION+16));

		var map=this._readString(this.Offsets.MAP);
		var mapType=this._readString(this.Offsets.MAPTYPE);
		getField('pos-map').children[0].value=map;
		getField('pos-map').children[0].innerHTML='* '+map+' *';
		getField('pos-maptype').children[0].value=mapType;
		getField('pos-maptype').children[0].innerHTML='* '+mapType+' *';
		setValue('pos-map',map)
		setValue('pos-maptype',mapType)

		setValue('pos-x-horse', tempFile.readF32(this.Offsets.HORSE_POSITION));
		setValue('pos-y-horse', tempFile.readF32(this.Offsets.HORSE_POSITION+8));
		setValue('pos-z-horse', tempFile.readF32(this.Offsets.HORSE_POSITION+16));


		/* map pins */
		loadMapPins();


		/* items */
		empty('container-weapons');
		empty('container-bows');
		empty('container-shields');
		empty('container-clothes');
		empty('container-materials');
		empty('container-food');
		empty('container-other');

		// Since item of the same category are not necessarily adjacent, store item number instead of just a counter
		var modifiersArray=[[],[],[]];
		var search=0; //0:weapons, 1:bows, 2:shields
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			var itemNameId=this._loadItemName(i);
			if(itemNameId==='')
				break;

			var itemCat=this._getItemCategory(itemNameId);
			document.getElementById('container-'+itemCat).appendChild(
				this._createItemRow(i, itemCat)
			);

			if(itemCat==='weapons'){
				modifiersArray[0].push(i);
			}else if(itemCat==='bows' && itemNameId.startsWith('Weapon_')){
				modifiersArray[1].push(i);
			}else if(itemCat==='shields'){
				modifiersArray[2].push(i);
			}
		}

		MarcTooltips.add('#container-weapons input',{text:'Weapon durability',position:'bottom',align:'right'});
		MarcTooltips.add('#container-bows input',{text:'Bow durability',position:'bottom',align:'right'});
		MarcTooltips.add('#container-shields input',{text:'Shield durability',position:'bottom',align:'right'});
		BOTW_Icons.startLoadingIcons();

		/* modifier column */
		var modifierColumns=['weapon','bow','shield'];
		for(var j=0; j<3; j++){
			var modifierColumn=modifierColumns[j];
			for(var i=0; i<modifiersArray[j].length; i++){
				var itemNumber = modifiersArray[j][i];
				//Adapt this because indexes are not sequential (the same as in save())
				var modifier=tempFile.readU32(this.Offsets['FLAGS_'+modifierColumn.toUpperCase()]+itemNumber*8);
				var modifierSelect=select('modifier-'+modifierColumn+'s-'+itemNumber, BOTW_Data.MODIFIERS.concat({value:modifier,name:this._toHexInt(modifier)}));
				modifierSelect.value=modifier;

				var row = this._getRowFromItemNumber(itemNumber);
				var additional = row.children[2];
				additional.appendChild(modifierSelect);
				additional.appendChild(inputNumber('modifier-'+modifierColumn+'s-value-'+itemNumber, 0, 0xffffffff, tempFile.readU32(this.Offsets['FLAGSV_'+modifierColumn.toUpperCase()]+itemNumber*8)));
			}
		}

		/* horses */
		for(var i=0; i<6; i++){
			if(i<5){
				setValue('horse'+i+'-name',this._readString64(this.Offsets.HORSE_NAMES, i));
				setValue('horse'+i+'-saddles',this._readString64(this.Offsets.HORSE_SADDLES, i));
				setValue('horse'+i+'-reins',this._readString64(this.Offsets.HORSE_REINS, i));
			}
			var horseType=this._readString64(this.Offsets.HORSE_TYPES, i);
			if(horseType){
				setValue('horse'+i+'-type',horseType);
				get('row-horse'+i).style.visibility='visible';
			}else{
				get('row-horse'+i).style.visibility='hidden';
			}
		}

		showTab('home');
	},

	/* save function */
	save:function(){
		/* STATS */
		tempFile.writeU32(this.Offsets.RUPEES, getValue('rupees'));
		tempFile.writeU32(this.Offsets.MONS, getValue('mons'));
		tempFile.writeU32(this.Offsets.MAX_HEARTS, getValue('max-hearts'));
		tempFile.writeU32(this.Offsets.MAX_STAMINA, getValue('max-stamina'));

		tempFile.writeU32(this.Offsets.RELIC_GERUDO, getValue('relic-gerudo'));
		tempFile.writeU32(this.Offsets.RELIC_GORON, getValue('relic-goron'));
		tempFile.writeU32(this.Offsets.RELIC_RITO, getValue('relic-rito'));

		tempFile.writeU32(this.Offsets.KOROK_SEED_COUNTER, getValue('koroks'));
		tempFile.writeU32(this.Offsets.DEFEATED_HINOX_COUNTER, getValue('defeated-hinox'));
		tempFile.writeU32(this.Offsets.DEFEATED_TALUS_COUNTER, getValue('defeated-talus'));
		tempFile.writeU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER, getValue('defeated-molduga'));


		/* MOTORCYCLE */
		if(this.Offsets.MOTORCYCLE){
			tempFile.writeU32(this.Offsets.MOTORCYCLE, getField('checkbox-motorcycle').checked?1:0);
		}



		/* COORDINATES */
		tempFile.writeF32(this.Offsets.PLAYER_POSITION, getValue('pos-x'));
		tempFile.writeF32(this.Offsets.PLAYER_POSITION+8, getValue('pos-y'));
		tempFile.writeF32(this.Offsets.PLAYER_POSITION+16, getValue('pos-z'));

		this._writeString(this.Offsets.MAP, getValue('pos-map'))
		this._writeString(this.Offsets.MAPTYPE, getValue('pos-maptype'))

		tempFile.writeF32(this.Offsets.HORSE_POSITION, getValue('pos-x-horse'));
		tempFile.writeF32(this.Offsets.HORSE_POSITION+8, getValue('pos-y-horse'));
		tempFile.writeF32(this.Offsets.HORSE_POSITION+16, getValue('pos-z-horse'));


		/* ITEMS */
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			if(document.getElementById('number-item'+i) || document.getElementById('select-item'+i))
				tempFile.writeU32(this._getItemQuantityOffset(i), getValue('item'+i));
			else
				break;
		}

		/* modifiers */
		var modifierCategories=['weapon','bow','shield'];
		for(var i=0; i<3; i++){
			var category = modifierCategories[i];
			var offset = this.Offsets["FLAGS_"+category.toUpperCase()];
			var valueOffset = this.Offsets["FLAGSV_"+category.toUpperCase()];
			var container = document.getElementById("container-"+category+"s");
			for(var j=0; j<container.children.length; j++){
				var row = container.children[j];
				var itemNumber = this._getItemNumberFromRow(row);
				if(row.children[2].children.length===3){ //Check that the rows we are currently at has modifier select and input
					tempFile.writeU32(offset+itemNumber*8, getValue('modifier-'+category+'s-'+itemNumber));
					tempFile.writeU32(valueOffset+itemNumber*8, getValue('modifier-'+category+'s-value-'+itemNumber));
				}
			}
		}
	}
}





/* TABS */
var availableTabs=['home','weapons','bows','shields','clothes','materials','food','other','horses','master'];


var currentTab;
function showTab(newTab){
	currentTab=newTab;
	for(var i=0; i<availableTabs.length; i++){
		document.getElementById('tab-button-'+availableTabs[i]).className=currentTab===availableTabs[i]?'tab-button active':'tab-button';
		document.getElementById('tab-'+availableTabs[i]).style.display=currentTab===availableTabs[i]?'block':'none';
	}

	document.getElementById('add-item-button').style.display=(newTab==='home' || newTab==='horses' || newTab==='master')? 'none':'block';

	if(newTab==='master'){
		if(BOTWMasterEditor.isLoaded())
			BOTWMasterEditor.refreshResults();
		else
			BOTWMasterEditor.loadHashes();
	}
}



/*
function setValueByHash(hash, val){
	var offset=SavegameEditor._searchHash(hash);
	if(offset){
		if(val.length && val.length===3){
			SavegameEditor._writeValue(offset, val[0]);
			SavegameEditor._writeValue(offset, val[1], 1);
			SavegameEditor._writeValue(offset, val[2], 2);
		}else if(typeof val==='string'){
			SavegameEditor._writeString64(offset, val);
		}else{
			SavegameEditor._writeValue(offset, val);
		}
	}else{
		alert('invalid hash '+SavegameEditor._toHexInt(hash));
	}
}*/

function setBooleans(hashTable, counterElement){
	var counter=0;
	for(var i=0;i<hashTable.length; i++){
		var offset=SavegameEditor._searchHash(hashTable[i]);
		if(offset && !tempFile.readU32(offset+4)){
			tempFile.writeU32(offset+4, 1);
			counter++;
		}
	}

	if(counterElement)
		setValue(counterElement, parseInt(getValue(counterElement))+counter);
	return counter;
}

function unlockKoroks(){
	var unlockedKoroks=setBooleans(BOTW_Data.KOROKS,'koroks');
	var offset=SavegameEditor._searchHash(0x64622a86); //HiddenKorok_Complete
	tempFile.writeU32(offset+4, 1);

	//search korok seeds in inventory
	for(var i=0; i<SavegameEditor.Constants.MAX_ITEMS; i++){
		if(SavegameEditor._loadItemName(i)==='Obj_KorokNuts'){
			setValue('item'+i, parseInt(getValue('item'+i))+unlockedKoroks);
			break;
		}
	}
	MarcDialogs.alert(unlockedKoroks+' korok seeds were added');
}

function defeatAllHinox(){
	var unlockedKoroks=setBooleans(BOTW_Data.DEFEATED_HINOX,'defeated-hinox');
	MarcDialogs.alert(unlockedKoroks+' Hinox have been defeated');
}
function defeatAllTalus(){
	var unlockedKoroks=setBooleans(BOTW_Data.DEFEATED_TALUS,'defeated-talus');
	MarcDialogs.alert(unlockedKoroks+' Talus have been defeated');
}
function defeatAllMolduga(){
	var unlockedKoroks=setBooleans(BOTW_Data.DEFEATED_MOLDUGA,'defeated-molduga');
	MarcDialogs.alert(unlockedKoroks+' Molduga have been defeated');
}
function visitAllLocations(){
	var missingLocations=setBooleans(BOTW_Data.LOCATIONS);
	MarcDialogs.alert(missingLocations+' unknown locations were visited');
}
function setCompendiumToStock(){
	var setToStock=0;
	for(var i=0; i<BOTW_Data.PICTURE_BOOK_SIZE.length; i++){
		var offset=SavegameEditor._searchHash(BOTW_Data.PICTURE_BOOK_SIZE[i]);
		if(typeof offset === 'number'){
			var val=tempFile.readU32(offset+4);
			if(val && val!==0xffffffff){
				tempFile.writeU32(offset+4, 0xffffffff);
				setToStock++;
			}
		}
	}
	MarcDialogs.alert(setToStock+' pics were reseted to stock.<br/>You can now safely remove all .jpg files under <u>pict_book</u> folder.');
}

var mapPinCount = 0;
var MAX_MAP_PINS = 100;
function loadMapPins(){
	// Read Pin Types
	var count = 0;
	iterateMapPins(function(val){
		if (val == 0xffffffff){
			return false;
		}
		count++;
		//console.log(count, val)
		return true;
	})
	// to debug saved locations
	// var i = 0;
	// iterateMapPinLocations(function(val, offset){
	// 	if (i % 3 == 0){
	// 		console.log("-----")
	// 		if (val == -100000){
	// 			return false;
	// 		}
	// 	}
	// 	i++
	// 	console.log(val)
	// 	return true
	// })
	mapPinCount = count;
	setValue('number-map-pins', count);
}

function guessMainFieldGrid() {
	if (getValue('pos-maptype') == "MainField")
		setValue("pos-map",guessMainFieldGridInternal(getValue("pos-x"), getValue("pos-z")))
}

function fixDungeonCoordinates() {
	var dungeon = getValue('pos-map')
	if (dungeon == "RemainsFire") {
		setValue('pos-x', 0)
		setValue('pos-y',16.8)
		setValue('pos-z',69.5)
	} else if (dungeon == "RemainsWater") {
		setValue('pos-x',47.7)
		setValue('pos-y',6.05)
		setValue('pos-z',6.3)
	} else if (dungeon == "RemainsWind") {
		setValue('pos-x',0)
		setValue('pos-y',3.4)
		setValue('pos-z',-77.7)
	} else if (dungeon == "RemainsElectric") {
		setValue('pos-x',0)
		setValue('pos-y',71.9)
		setValue('pos-z',3.7)
	} else if (dungeon == "FinalTrial") {
		setValue('pos-x',0)
		setValue('pos-y',-0.4)
		setValue('pos-z',64.5)
	}
}

function guessMainFieldGridInternal(xpos, zpos) {
	// A1 = -4974.629, -3974.629
	// J8 =  4974.629,  3974.629
	// X and letter part of grid: west/east
	// Z and number part of grid: north/south

	// grid also visible at https://mrcheeze.github.io/botw-object-map/

	// idea: Take position fraction out of the whole grid and divide equally.

	var gridvalX = Math.min(10, Math.max(1, Math.trunc((xpos + 4974.629) / 9949.258 * 10 + 1)))
	var gridvalZ = Math.min( 8, Math.max(1, Math.trunc((zpos + 3974.629) / 7949.258 * 8  + 1)))

	return String.fromCharCode(64 + gridvalX) + '-' + gridvalZ
}

function clearMapPins(){
	// types
	var count = 0;
	iterateMapPins(function(val,offset){
		if (val != 0xffffffff){
			count++;
			tempFile.writeU32(offset, 0xffffffff)
		}
		return true;
	})

	var count2 =0;
	var i = 0;
	iterateMapPinLocations(function(val, offset){
		var expect = i % 3 == 0 ? -100000 : 0;
		i++;
		if (val != expect){
			count2++
			tempFile.writeF32(offset, expect)
		}
		return true
	})
	if (count2 / 3 > count){
		count = count2 / 3
	}
	mapPinCount = 0;
	setValue('number-map-pins', 0);
	MarcDialogs.alert(count+' map pins removed');
}

function iterateMapPins(f){
	var offset = SavegameEditor.Offsets.MapApp_MapIconNo-4;
	for (var i = 0;; i++){
		var base = offset + (8 * i)
		var hdr = tempFile.readU32(base)
		var val = tempFile.readU32(base + 4)
		//if (hdr != SavegameEditor.Constants.MAP_ICONS){
		if (hdr != SavegameEditor.Headers.MapApp_MapIconNo){
			break
		}
		if (!f(val,base+4)){
			break
		}
	}
}
function iterateMapPinLocations(f){
	offset = SavegameEditor.Offsets.MapApp_MapIconPos-4;
	for (var i = 0;; i++){
		var base = offset + (8 * i)
		var hdr = tempFile.readU32(base)
		var val = tempFile.readF32(base + 4)
		if (hdr != SavegameEditor.Headers.MapApp_MapIconPos){
			break
		}
		if(!f(val,base+4)){
			break
		}
	}
}

function dist(px,py,pz,l){
	// 2d seems to work better than 3d
	return Math.sqrt((Math.pow(l[0]-px,2))+(Math.pow(l[2]-pz,2)))
}



function addToMap(data, icon){
	var px=tempFile.readF32(SavegameEditor.Offsets.PLAYER_POSITION);
	var py=tempFile.readF32(SavegameEditor.Offsets.PLAYER_POSITION+8);
	var pz=tempFile.readF32(SavegameEditor.Offsets.PLAYER_POSITION+16);

	var points = [];
	for (var i = 0; i<data.length; i++){
		var l = BOTW_Data.COORDS[data[i]]
		if (l){
		   points.push({H:data[i], L:l})
		}
	}
	// fill closest first
	points.sort(function(a,b){
		aDist = dist(px,py,pz,a.L);
		bDist = dist(px,py,pz,b.L);
		return aDist - bDist
	})
	var count = 0;
	for (var i = 0; i<points.length && mapPinCount<MAX_MAP_PINS; i++){
		var pt = points[i]
		var hash = pt.H;
		var offset=SavegameEditor._searchHash(hash);
		if(offset && !tempFile.readU32(offset + 4)){
			addMapPin(icon, pt.L)
			count++;
			mapPinCount++;
		}
	}
	setValue('number-map-pins', mapPinCount);
	return count;
}

function addMapPin(icon, location){
	// add pin to next availible location.
	iterateMapPins(function(val,offset){
		if (val == 0xffffffff){
			tempFile.writeU32(offset, icon)
			return false
		}
		return true;
	})
	var i = 0;
	var added = false;
	iterateMapPinLocations(function(val, offset){
		if (i%3 != 0){
			i++
			return true;
		}
		i++
		if (val == -100000){
			added = true;
			tempFile.writeF32(offset,location[0])
			tempFile.writeF32(offset+8,location[1])
			tempFile.writeF32(offset+16,location[2])
			return false;
		}
		return true;
	})
}

function addKoroksToMap(){
	var n = addToMap(BOTW_Data.KOROKS, SavegameEditor.Constants.ICON_TYPES.LEAF);
	MarcDialogs.alert(n+' pins for missing Korok seeds added to map');
}

function addHinoxToMap(){
	var n = addToMap(BOTW_Data.DEFEATED_HINOX, SavegameEditor.Constants.ICON_TYPES.SKULL);
	MarcDialogs.alert(n+' pins for missing Hinox added to map');
}

function addTalusToMap(){
	var n = addToMap(BOTW_Data.DEFEATED_TALUS, SavegameEditor.Constants.ICON_TYPES.SHIELD);
	MarcDialogs.alert(n+' pins for missing Talus added to map');
}

function addMoldugaToMap(){
	var n = addToMap(BOTW_Data.DEFEATED_MOLDUGA, SavegameEditor.Constants.ICON_TYPES.CHEST);
	MarcDialogs.alert(n+' pins for missing Molduga added to map');
}

function addLocationsToMap(){
	var n = addToMap(BOTW_Data.LOCATIONS, SavegameEditor.Constants.ICON_TYPES.STAR);
	MarcDialogs.alert(n+' pins for missing locations added to map');
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

if(typeof String.endsWith==='undefined'){
	String.prototype.endsWith=function(search){
        return (new RegExp(search+'$')).test(this)
    };
}
if(typeof String.startsWith==='undefined'){
	String.prototype.startsWith=function(search){
        return (new RegExp('^'+search)).test(this)
    };
}










var masterModeLoaded=false;
function loadMasterMode(){
	if(!masterModeLoaded){
		var script=document.createElement('script');
		script.type='text/javascript';
		script.src='./zelda-botw.master.js';
		script.onload=function(){
			masterModeLoaded=true;
			document.getElementById('tab-button-master').disabled=false;
			//BOTWMasterEditor.prepare();
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}