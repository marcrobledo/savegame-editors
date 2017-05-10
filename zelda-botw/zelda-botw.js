/*
	The legend of Zelda: Breath of the wild v20170508
	by Marc Robledo 2017
*/

var currentEditingItem=0;
SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',

	/* Constants */
	Constants:{
		MAX_ITEMS:410,
		STRING_SIZE:0x80
	},

	/* Offsets */
	OffsetsAll:{
		FILESIZE:				[896976, 897160, 897112],
		/*						 header      v1.0      v1.1      v1.2    */
		RUPEES:					[0x23149bf8, 0x00e0a0, 0x00e110, 0x00e110],
		MONS:					[0xce7afed3, 0x0bc480, 0x0bc558, 0x0bc538],
		ITEMS:					[0x5f283289, 0x052828, 0x0528d8, 0x0528c0],
		ITEMS_QUANTITY:			[0x6a09fc59, 0x063340, 0x0633f0, 0x0633d8],

		MOD_WEAPON_TYPES:		[0x57ee221d, 0x050328, 0x0503d8, 0x0503c0],
		MOD_WEAPON_VALUES:		[0xa6d926bc, 0x0a9ca8, 0x0a9d78, 0x0a9d58],
		MOD_BOW_TYPES:			[0x0cbf052a, 0x0045f0, 0x0045f8, 0x0045f8],
		MOD_BOW_VALUES:			[0x1e3fd294, 0x00a8e0, 0x00a940, 0x00a940],
		MOD_SHIELD_TYPES:		[0xc5238d2b, 0x0b5810, 0x0b58e8, 0x0b58c8],
		MOD_SHIELD_VALUES:		[0x69f17e8a, 0x063218, 0x0632c8, 0x0632b0],

		HORSE_SADDLES:			[0x333aa6e5, 0x03d0e8, 0x03d190, 0x03d190],
		HORSE_REINS:			[0x6150c6be, 0x060508, 0x0605b8, 0x0605a0],
		HORSE_NAMES:			[0x7b74e117, 0x070320, 0x0703c0, 0x0703a8],
		HORSE_MANES:			[0x9c6cfd3f, 0x0a6478, 0x0a6538, 0x0a6520],
		HORSE_TYPES:			[0xc247b696, 0x0b46f8, 0x0b47d8, 0x0b47b8],
		HORSE_BONDS:			[0xe1a0ca54, 0x0c3670, 0x0c3738, 0x0c3710], /* max=0x3f80 */

		KOROK_SEED_COUNTER:		[0x8a94e07a, 0x076148, 0x0761f8, 0x0761e0]
	},



	/* private functions */
	_searchHeader:function(hdr){
		for(var i=0x14; i<tempFile.fileSize; i+=8){
			if(hdr===tempFile.readInt(i))
				return i+4;
		}
		return false;
	},
	_getOffsets(v){
		this.Offsets={};
		if(v<=2){
			for(prop in this.OffsetsAll){
				this.Offsets[prop]=this.OffsetsAll[prop][v+1];
			}
		}else{ /* unknown version */
			var textarea=document.createElement('textarea');
			for(prop in this.OffsetsAll){
				var offset=this._searchHeader(this.OffsetsAll[prop][0]);
				if(offset){
					textarea.value+=prop+':0x'+(offset+4).toString(16)+',\n';
					this.Offsets[prop]=offset+4;
				}
			}
			get('debug').appendChild(textarea);
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

	_writeString:function(offset,str){
		for(var j=0; j<16; j++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(j*4, 4);
			for(k=0; k<fourBytes.length; k++){
				tempFile.writeByte(offset+k, fourBytes.charCodeAt(k));
			}
			offset+=8;
		}
	},
	_readString:function(offset){
		var txt='';
		for(var j=0; j<16; j++){
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
		}else{
			return 0xffffffff;
		}
	},
	_getItemQuantityOffset:function(i){
		return this.Offsets.ITEMS_QUANTITY+i*0x08;
	},
	_getItemRow(i){
		return getField('number-item'+i).parentElement.parentElement
	},
	_createItemRow(i){
		var itemNameId=this._loadItemName(i);
		return row([10,2],
			label('number-item'+i,'<b class="mono"><small>#'+i+'</small> </b><span id="item-name'+i+'">'+this._getItemTranslation(itemNameId)+'</span> <button class="with-icon icon10 colored transparent" onclick="SavegameEditor.editItem('+i+')"></button>'),
			inputNumber('item'+i, 0, this._getItemMaximumQuantity(itemNameId), tempFile.readInt(this._getItemQuantityOffset(i)))
		)
	},

	addItem:function(){
		var i=0;
		while(document.getElementById('number-item'+i)){
			i++;
		}
		if(i<this.Constants.MAX_ITEMS){
			this._writeItemName(i,'Item_Fruit_A');
			document.getElementById('card-materials').appendChild(this._createItemRow(i));
			this.editItem(i);
		}
	},

	editItem:function(i){
		currentEditingItem=i;
		document.getElementById('select-item').value=this._loadItemName(i);
		MarcDialogs.open('item');
	},
	editItem2:function(i,nameId){
		var oldCat=this._getItemCategory(this._loadItemName(i));
		var newCat=this._getItemCategory(nameId);

		if(oldCat!==newCat){
			var row=this._getItemRow(i);
			row.parentElement.removeChild(row);
			document.getElementById('card-'+newCat).appendChild(row);
		}
		this._writeItemName(i, nameId);
		document.getElementById('item-name'+i).innerHTML=this._getItemTranslation(nameId);
		document.getElementById('number-item'+i).maxValue=this._getItemMaximumQuantity(nameId);
	},

	_getModifierOffset1:function(type){
		if(type==='bows')
			return this.Offsets.MOD_BOW_TYPES;
		else if(type==='shields')
			return this.Offsets.MOD_SHIELD_TYPES;
		else
			return this.Offsets.MOD_WEAPON_TYPES;
	},
	_getModifierOffset2:function(type){
		if(type==='bows')
			return this.Offsets.MOD_BOW_VALUES;
		else if(type==='shields')
			return this.Offsets.MOD_SHIELD_VALUES;
		else
			return this.Offsets.MOD_WEAPON_VALUES;
	},
	editModifier:function(type,i){
		currentEditingItem={type:type,order:i};

		var offset1=this._getModifierOffset1(type);
		var offset2=this._getModifierOffset2(type);

		getField('modifier').children[0].value=0xffffffff;
		getField('modifier').children[0].innerHTML='unknown';

		var modifier=tempFile.readInt(offset1+i*0x08);
		setValue('modifier', modifier);
		setValue('modifier-value', tempFile.readInt(offset2+i*0x08));

		getField('modifier').children[0].value=modifier;
		getField('modifier').children[0].innerHTML='unknown 0x'+modifier.toString(16);

		if(getValue('modifier')==='')
			setValue('modifier', modifier);

		MarcDialogs.open('modifier');
	},
	editModifier2:function(type,i,modifier,val){
		tempFile.writeInt(this._getModifierOffset1(type)+i*0x08, modifier);
		tempFile.writeInt(this._getModifierOffset2(type)+i*0x08, val);
	},

	editHorse:function(i){
		currentEditingItem=i;
		setValue('horse-name',this._readString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i));
		setValue('horse-saddles',this._readString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i));
		setValue('horse-reins',this._readString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i));
		setValue('horse-type',this._readString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*i));
		MarcDialogs.open('horse');
	},
	editHorse2:function(i,name,saddles,reins,type){
		this._writeString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i, getValue('horse-name'));
		this._writeString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i, getValue('horse-saddles'));
		this._writeString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i, getValue('horse-reins'));
		this._writeString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*i, getValue('horse-type'));

		if(getValue('horse-type')==='GameRomHorse00L'){
			this._writeString(this.Offsets.HORSE_MANES+this.Constants.STRING_SIZE*i, 'Horse_Link_Mane_00L');
		}
	},
	cheatEpona:function(i){
		if(this._readString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*5).startsWith('GameRomHorse')){
			this._writeString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*5, 'GameRomHorseEpona');
			MarcDialogs.alert('Untammed horse has been changed to Epona. Go to any stable to get it legitly.');
		}else{
			MarcDialogs.alert('Error: this will only work if your savegame has Link on an untammed horse.');
		}
	},

	_arrayToSelectOpts:function(arr){
		var arr2=[];
		for(var i=0; i<arr.length; i++){
			arr2.push({name:arr[i], value:arr[i]});
		}
		return arr2;
	},


	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===896976 || tempFile.fileSize===897160 || tempFile.fileSize===897112)
	},


	preload:function(){
		setNumericRange('koroks', 0, 900);
		setNumericRange('rupees', 0, 999999);
		setNumericRange('mons', 0, 999999);

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
			get('select-item').appendChild(optGroup);
		}

		/* dialogs */
		var MODIFIER_FLAGS=[
			{value:0xffffffff, name:'unknown'},
			{value:0x00000000, name:'(none)'},
			{value:0x00000001, name:'Attack up'},
			{value:0x80000001, name:'Attack up ★'},
			{value:0x00000002, name:'Durability up'},
			{value:0x80000002, name:'Durability up ★'},
			{value:0x00000004, name:'Critical hit up'},
			{value:0x80000004, name:'Critical hit up ★'},
			{value:0x00000008, name:'(Weapon only) Long throw'},
			{value:0x80000008, name:'(Weapon only) Long throw ★'},
			{value:0x00000010, name:'(Bow only) unknown 1?'},
			{value:0x80000010, name:'(Bow only) unknown 1? ★'},
			{value:0x00000020, name:'(Bow only) unknown 2?'},
			{value:0x80000020, name:'(Bow only) unknown 2? ★'},
			{value:0x00000040, name:'(Bow only) Quick shot'},
			{value:0x80000040, name:'(Bow only) Quick shot ★'},
			{value:0x00000080, name:'(Shield only) Shield surf up'},
			{value:0x80000080, name:'(Shield only) Shield surf up ★'},
			{value:0x00000100, name:'(Shield only) Shield guard up'},
			{value:0x80000100, name:'(Shield only) Shield guard up ★'},
		];
		select('modifier', MODIFIER_FLAGS);
		setNumericRange('modifier-value', 0, 0xffffffff);
		select('horse-saddles', this._arrayToSelectOpts(BOTW_Data.HORSE_SADDLES));
		select('horse-reins', this._arrayToSelectOpts(BOTW_Data.HORSE_REINS));
		select('horse-type', this._arrayToSelectOpts(BOTW_Data.HORSE_TYPES));
	},

	/* load function */
	load:function(){
		tempFile.littleEndian=false;
		tempFile.fileName='game_data.sav';

		/* check savegame version */
		if(tempFile.fileSize===896976){
			this._getOffsets(0);
			setValue('version', 'v1.0.x');
		}else if(tempFile.fileSize===897160){
			this._getOffsets(1);
			setValue('version', 'v1.1.x');
		}else if(tempFile.fileSize===897112){
			this._getOffsets(2);
			setValue('version', 'v1.2.x');
		}


		/* prepare editor */
		setValue('rupees', tempFile.readInt(this.Offsets.RUPEES));
		setValue('mons', tempFile.readInt(this.Offsets.MONS));
		setValue('koroks', tempFile.readInt(this.Offsets.KOROK_SEED_COUNTER));
		

		/* items */
		empty('card-items');
		for(var i=0; i<BOTW_Data.Translations.length; i++){
			var card=document.createElement('div');
			card.id='card-'+BOTW_Data.Translations[i].id;
			get('card-items').appendChild(card);
			var h3=document.createElement('h3');
			h3.innerHTML=BOTW_Data.Translations[i].id;
			card.appendChild(h3);
		}
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			var itemNameId=this._loadItemName(i);
			if(itemNameId==='')
				break;

			document.getElementById('card-'+this._getItemCategory(itemNameId)).appendChild(
				this._createItemRow(i)
			);
		}

		/* modifier buttons */
		var editModifierFunc=function(){SavegameEditor.editModifier(this.weaponType,this.weaponOrder);}
		var sortedWeapons=0;
		var sortedBows=0;
		var sortedShields=0;
		for(var i=0; i<60; i++){
			var itemName=this._loadItemName(i);
			var cat=this._getItemCategory(itemName);

			if(cat==='weapons'){
				sortedWeapons++;
			}else if(cat==='bows' && !(itemName.endsWith('Arrow') || itemName.endsWith('Arrow_A'))){
				sortedBows++;
			}else if(cat==='shields'){
				sortedShields++;
			}
		}
		for(var i=0; i<sortedWeapons; i++){
			var b=button('', 'colored transparent with-icon icon1', editModifierFunc);
			b.weaponType='weapons';
			b.weaponOrder=i;
			document.getElementById('card-weapons').children[i+1].children[0].appendChild(b);
		}
		for(var i=0; i<sortedBows; i++){
			var b=button('', 'colored transparent with-icon icon1', editModifierFunc);
			b.weaponType='bows';
			b.weaponOrder=i;
			document.getElementById('card-bows').children[i+1].children[0].appendChild(b);
		}
		for(var i=0; i<sortedShields; i++){
			var b=button('', 'colored transparent with-icon icon1', editModifierFunc);
			b.weaponType='shields';
			b.weaponOrder=i;
			document.getElementById('card-shields').children[i+1].children[0].appendChild(b);
		}


		/* koroks */
		if(typeof korokDebug !== 'undefined'){
			korokDebug();
		}
	},

	/* save function */
	save:function(){
		/* RUPEES */
		tempFile.writeInt(this.Offsets.RUPEES, getValue('rupees'));
		tempFile.writeInt(this.Offsets.MONS, getValue('mons'));

		/* ITEMS */
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			if(document.getElementById('number-item'+i))
				tempFile.writeInt(this._getItemQuantityOffset(i), getValue('item'+i));
			else
				break;
		}
	}
}