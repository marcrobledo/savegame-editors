/*
	The legend of Zelda: Breath of the wild v20190625
	by Marc Robledo 2017-2019
*/
var currentEditingItem=0;

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',
	Version:20190625,

	/* Constants */
	Constants:{
		MAX_ITEMS:410,
		STRING_SIZE:0x80,

		//missing versions: 1.1.1, 1.1.2 and 1.4.1
		VERSION:				['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.3.1', 'Kiosk', 'v1.3.3','v1.3.4', 'v1.4',  'v1.5',  'v1.6',  'v1.6*', 'v1.6**','v1.6***'],
		FILESIZE:				[896976, 897160, 897112, 907824, 907824,  916576,  1020648, 1020648,   1027208, 1027208, 1027216, 1027216, 1027216, 1027216],
		HEADER:					[0x24e2, 0x24ee, 0x2588, 0x29c0, 0x2a46,  0x2f8e,  0x3ef8,  0x3ef9,    0x471a,  0x471b,  0x471e, 0x0f423d, 0x0f423e,0x0f423f],

		MAP_ICONS: 0x9383490e,
		MAP_POS: 0xea9def3f,
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
		0xf1cf4807, 'RELIC_GORON',
		0xfda0cde4, 'RELIC_RITO'				
	],


	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayPos){if(arrayPos)tempFile.writeU32(offset+8*i,val?1:0);else tempFile.writeU32(offset,val?1:0)},
	_writeValue:function(offset,val,arrayPos){if(arrayPos)tempFile.writeU32(offset+8*i,val);else tempFile.writeU32(offset,val)},
	_writeString:function(offset,str){
		for(var i=0; i<16; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeU8(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},
	_writeStringShort:function(offset,str){
		for(var i=0; i<8; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeU8(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},

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

	_getOffsets:function(v){
		this.Offsets={};
		var startSearchOffset=0x0c;
		for(var i=0; i<this.Hashes.length; i+=2){
			for(var j=startSearchOffset; j<tempFile.fileSize; j+=8){
				if(this.Hashes[i]===tempFile.readU32(j)){
					this.Offsets[this.Hashes[i+1]]=j+4;
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

	_readString:function(offset){
		var txt='';
		for(var j=0; j<16; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},
	_readStringShort:function(offset){
		var txt='';
		for(var j=0; j<8; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},

	_loadItemName:function(i){
		return this._readString(this.Offsets.ITEMS+i*0x80);
	},
	_writeItemName:function(i,newItemNameId){
		this._writeString(this.Offsets.ITEMS+i*0x80, newItemNameId);
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
			this.selectItem.selectedIndex++;
			var itemNameId=this.selectItem.value;
			this._writeItemName(i,itemNameId);
			var row=this._createItemRow(i, false);
			document.getElementById('container-'+this._getItemCategory(itemNameId)).appendChild(row);
			
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
			(row.previousElementSibling || row).scrollIntoView({block:'start', behavior:'smooth'});
		}
		this._writeItemName(i, nameId);
		document.getElementById('item-name'+i).innerHTML=this._getItemTranslation(nameId);
		BOTW_Icons.setIcon(document.getElementById('icon'+i), nameId);
		if(document.getElementById('number-item'+i))
			document.getElementById('number-item'+i).maxValue=this._getItemMaximumQuantity(nameId);
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

	editHorse:function(i){
		currentEditingItem=i;
		if(currentEditingItem==5){ /* untamed horse */
			hide('row-tamed-horse');
			if(!this._readString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*5).startsWith('GameRomHorse')){
				MarcDialogs.alert('Error: this will only work if your savegame has Link on an untamed horse.');
				return false;
			}
			getField('horse-type').children[27].disabled=false;
			getField('horse-type').children[28].disabled=false;
		}else{
			show('row-tamed-horse');
			setValue('horse-name',this._readString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i));
			setValue('horse-saddles',this._readString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i));
			setValue('horse-reins',this._readString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i));
			getField('horse-type').children[27].disabled=true;
			getField('horse-type').children[28].disabled=true;
		}
		setValue('horse-type',this._readString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*i));
		MarcDialogs.open('horse');
	},
	editHorse2:function(i,name,saddles,reins,type){
		if(currentEditingItem<5){
			this._writeString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i, getValue('horse-name'));
			this._writeString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i, getValue('horse-saddles'));
			this._writeString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i, getValue('horse-reins'));
		}
		this._writeString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*i, getValue('horse-type'));

		if(getValue('horse-type')==='GameRomHorse00L'){
			this._writeString(this.Offsets.HORSE_MANES+this.Constants.STRING_SIZE*i, 'Horse_Link_Mane_00L');
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

			if(tempFile.fileSize===this.Constants.FILESIZE[i] && versionHash===this.Constants.HEADER[i] && tempFile.readU32(4)===0xffffffff){
				this._getOffsets(i);
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
		for(var i=0; i<BOTW_Data.Translations.length; i++){
			var optGroup=document.createElement('optgroup');
			optGroup.label=BOTW_Data.Translations[i].id;

			for(var item in BOTW_Data.Translations[i].items){
				var opt=document.createElement('option');
				opt.value=item;
				opt.innerHTML=BOTW_Data.Translations[i].items[item];
				optGroup.appendChild(opt);
			}
			this.selectItem.appendChild(optGroup);
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

		/* dialogs */
		select('horse-saddles', this._arrayToSelectOpts(BOTW_Data.HORSE_SADDLES));
		select('horse-reins', this._arrayToSelectOpts(BOTW_Data.HORSE_REINS));
		select('horse-type', this._arrayToSelectOpts(BOTW_Data.HORSE_TYPES));
	},

	_timeToString:function(timeVal){
		var seconds=timeVal%60;
		if(seconds<10)seconds='0'+seconds;
		var minutes=parseInt(timeVal/60)%60;
		if(minutes<10)seconds='0'+seconds;
		return parseInt(timeVal/3600)+':'+minutes+':'+seconds;
	},

	/* load function */
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

		var map=this._readStringShort(this.Offsets.MAP);
		var mapType=this._readStringShort(this.Offsets.MAPTYPE);
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
		loadMapPins()


		/* items */
		empty('container-weapons');
		empty('container-bows');
		empty('container-shields');
		empty('container-clothes');
		empty('container-materials');
		empty('container-food');
		empty('container-other');

		var modifiersArray=[0,0,0];
		var search=0; //0:weapons, 1:bows, 2:shields
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			var itemNameId=this._loadItemName(i);
			if(itemNameId==='')
				break;

			var itemCat=this._getItemCategory(itemNameId);
			document.getElementById('container-'+itemCat).appendChild(
				this._createItemRow(i, itemCat)
			);

			if(search===0 && itemCat==='bows'){
				search=1;
			}else if(search===0 && itemCat==='shields'){
				search=2;
			}else if(search===1 && itemCat==='shields'){
				search=2;
			}else if(itemCat!=='weapons' && itemCat!=='bows' && itemCat!=='shields'){
				search=3;
			}

			if(itemCat==='weapons' && search===0){
				modifiersArray[0]++;
			}else if(itemCat==='bows' && search===1 && itemNameId.startsWith('Weapon_')){
				modifiersArray[1]++;
			}else if(itemCat==='shields' && search===2){
				modifiersArray[2]++;
			}

		}
		MarcTooltips.add(document.querySelectorAll('#container-weapons input'),'Weapon durability',{position:'bottom',align:'right'});
		MarcTooltips.add(document.querySelectorAll('#container-bows input'),'Bow durability',{position:'bottom',align:'right'});
		MarcTooltips.add(document.querySelectorAll('#container-shields input'),'Shield durability',{position:'bottom',align:'right'});
		BOTW_Icons.startLoadingIcons();

		/* modifier column */
		var modifierColumns=['weapon','bow','shield'];
		for(var j=0; j<3; j++){
			var modifierColumn=modifierColumns[j];
			for(var i=0; i<modifiersArray[j]; i++){
				var modifier=tempFile.readU32(this.Offsets['FLAGS_'+modifierColumn.toUpperCase()]+i*8);
				var modifierSelect=select('modifier-'+modifierColumn+'s-'+i, BOTW_Data.MODIFIERS.concat({value:modifier,name:this._toHexInt(modifier)}));
				modifierSelect.value=modifier;

				var additional=document.getElementById('container-'+modifierColumn+'s').children[i].children[2];
				additional.appendChild(modifierSelect);
				additional.appendChild(inputNumber('modifier-'+modifierColumn+'s-value-'+i, 0, 0xffffffff, tempFile.readU32(this.Offsets['FLAGSV_'+modifierColumn.toUpperCase()]+i*8)));
			}
		}
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
		
		this._writeStringShort(this.Offsets.MAP, getValue('pos-map'))
		this._writeStringShort(this.Offsets.MAPTYPE, getValue('pos-maptype'))

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
		for(var i=0; document.getElementById('select-modifier-weapons-'+i); i++){
			tempFile.writeU32(this.Offsets.FLAGS_WEAPON+i*8, getValue('modifier-weapons-'+i));
			tempFile.writeU32(this.Offsets.FLAGSV_WEAPON+i*8, getValue('modifier-weapons-value-'+i));
		}
		for(var i=0; document.getElementById('select-modifier-bows-'+i); i++){
			tempFile.writeU32(this.Offsets.FLAGS_BOW+i*8, getValue('modifier-bows-'+i));
			tempFile.writeU32(this.Offsets.FLAGSV_BOW+i*8, getValue('modifier-bows-value-'+i));
		}
		for(var i=0; document.getElementById('select-modifier-shields-'+i); i++){
			tempFile.writeU32(this.Offsets.FLAGS_SHIELD+i*8, getValue('modifier-shields-'+i));
			tempFile.writeU32(this.Offsets.FLAGSV_SHIELD+i*8, getValue('modifier-shields-value-'+i));
		}
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
			SavegameEditor._writeString(offset, val);
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
	var offset = SavegameEditor._searchHash(SavegameEditor.Constants.MAP_ICONS)
	for (var i = 0;; i++){
		var base = offset + (8 * i)
		var hdr = tempFile.readU32(base)
		var val = tempFile.readU32(base + 4)
		if (hdr != SavegameEditor.Constants.MAP_ICONS){
			break
		}
		if (!f(val,base+4)){
			break
		}
	}
}
function iterateMapPinLocations(f){
	offset = SavegameEditor._searchHash(SavegameEditor.Constants.MAP_POS)
	for (var i = 0;; i++){
		var base = offset + (8 * i)
		var hdr = tempFile.readU32(base)
		var val = tempFile.readF32(base + 4)
		if (hdr != SavegameEditor.Constants.MAP_POS){
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


/* MarcTooltips.js v20170518 - Marc Robledo 2014-2017 - http://www.marcrobledo.com/license */
var MarcTooltips=function(){return{add:function(a,b,c){var d=document.createElement("div");d.className="tooltip",d.style.position="absolute",d.style.zIndex="9000",d.style.top="0",d.style.left="0",d.innerHTML=b,document.body.appendChild(d);var e="down",f="center";c&&c.position&&/^(up|down|left|right)$/i.test(c.position)&&(e=c.position.toLowerCase()),c&&c.align&&/^(top|bottom|left|right)$/i.test(c.align)&&(("up"!==e&&"down"!==e||"left"!==c.align&&"right"!==c.align)&&("left"!==e&&"right"!==e||"top"!==c.align&&"bottom"!==c.align)||(f=c.align.toLowerCase()));var h=document.createElement("div");h.className="arrow",d.className+=" position-"+e+" align-"+f,d.className+="left"===e||"right"===e?" position-horizontal":" position-vertical",d.appendChild(h);var i=function(){var a=document.documentElement,b=(window.pageXOffset||a.scrollLeft)-(a.clientLeft||0),c=(window.pageYOffset||a.scrollTop)-(a.clientTop||0),g=this.getBoundingClientRect(),h=d.getBoundingClientRect();d.style.top="up"===e?parseInt(g.top+c-h.height)+"px":"down"===e?parseInt(g.top+c+g.height)+"px":"top"===f?parseInt(g.top+c)+"px":"bottom"===f?parseInt(g.top+c-(h.height-g.height))+"px":parseInt(g.top+c-parseInt((h.height-g.height)/2))+"px",d.style.left="up"===e||"down"===e?"left"===f?parseInt(g.left+b)+"px":"right"===f?parseInt(g.left+b-(h.width-g.width))+"px":parseInt(g.left+b-parseInt((h.width-g.width)/2))+"px":"left"===e?parseInt(g.left+b-h.width)+"px":parseInt(g.left+b+g.width)+"px",d.className+=" visible"},j=function(){d.className=d.className.replace(" visible","")};"string"==typeof a&&(a=[a]);for(var k=0;k<a.length;k++)if("string"==typeof a[k])if(/^#[0-9a-zA-Z_\-]+$/.test(a[k])){var l=document.getElementById(a[k].replace("#",""));l.addEventListener("mouseover",i,!1),l.addEventListener("mouseout",j,!1)}else for(var m=document.querySelectorAll(a[k]),n=0;n<m.length;n++)m[n].addEventListener("mouseover",i,!1),m[n].addEventListener("mouseout",j,!1);else a[k].addEventListener("mouseover",i,!1),a[k].addEventListener("mouseout",j,!1)}}}();


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