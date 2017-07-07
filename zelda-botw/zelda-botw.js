/*
	The legend of Zelda: Breath of the wild v20170707
	by Marc Robledo 2017
*/
var currentEditingItem=0;

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',
	Version:20170707,

	/* Constants */
	Constants:{
		MAX_ITEMS:410,
		STRING_SIZE:0x80,

		/*						 v1.0    v1.1    v1.2    v1.3  */
		FILESIZE:				[896976, 897160, 897112, 907824],
		HEADER:					[0x24e2, 0x24ee, 0x2588, 0x29c0],
	},

	/* Offsets */
	OffsetsAll:{
		/*						 hash        v1.0      v1.1      v1.2      v1.3    */
		RUPEES:					[0x23149bf8, 0x00e0a0, 0x00e110, 0x00e110, 0x00e678],
		MONS:					[0xce7afed3, 0x0bc480, 0x0bc558, 0x0bc538, 0x0be728],
		ITEMS:					[0x5f283289, 0x052828, 0x0528d8, 0x0528c0, 0x053890],
		ITEMS_QUANTITY:			[0x6a09fc59, 0x063340, 0x0633f0, 0x0633d8, 0x064550],

		FLAGS_WEAPON:			[0x57ee221d, 0x050328, 0x0503d8, 0x0503c0, 0x051270],
		FLAGSV_WEAPON:			[0xa6d926bc, 0x0a9ca8, 0x0a9d78, 0x0a9d58, 0x0ab8d0],
		FLAGS_BOW:				[0x0cbf052a, 0x0045f0, 0x0045f8, 0x0045f8, 0x0047e8],
		FLAGSV_BOW:				[0x1e3fd294, 0x00a8e0, 0x00a940, 0x00a940, 0x00ae08],
		FLAGS_SHIELD:			[0xc5238d2b, 0x0b5810, 0x0b58e8, 0x0b58c8, 0x0b7910],
		FLAGSV_SHIELD:			[0x69f17e8a, 0x063218, 0x0632c8, 0x0632b0, 0x064420],

		HORSE_SADDLES:			[0x333aa6e5, 0x03d0e8, 0x03d190, 0x03d190, 0x03d9d8],
		HORSE_REINS:			[0x6150c6be, 0x060508, 0x0605b8, 0x0605a0, 0x0615d0],
		HORSE_NAMES:			[0x7b74e117, 0x070320, 0x0703c0, 0x0703a8, 0x071820],
		HORSE_MANES:			[0x9c6cfd3f, 0x0a6478, 0x0a6538, 0x0a6520, 0x0a7f18],
		HORSE_TYPES:			[0xc247b696, 0x0b46f8, 0x0b47d8, 0x0b47b8, 0x0b6780],
		HORSE_BONDS:			[0xe1a0ca54, 0x0c3670, 0x0c3738, 0x0c3710, 0x0c5bb0], /* max=0x3f80 */

		KOROK_SEED_COUNTER:		[0x8a94e07a, 0x076148, 0x0761f8, 0x0761e0, 0x0778f8],
		DEFEATED_HINOX_COUNTER:	[0x54679940, 0x04d2b8, 0x04d368, 0x04d358, 0x04e158],
		DEFEATED_TALUS_COUNTER:	[0x698266be, 0x063010, 0x0630c0, 0x0630a8, 0x064218],
		DEFEATED_MOLDUGA_COUNTER:[0x441b7231, 0x0466d0, 0x046788, 0x046780, 0x0472a8],

		PLAYTIME:				[0x73c29681, 0x067888, 0x067920, 0x067908, 0x068c40],

		RELIC_GERUDO:			[0x97f925c3, 0x07adc0, 0x07ae80, 0x07ae68, 0x07c7e0],
		RELIC_GORON:			[0xf1cf4807, 0x0cb3c0, 0x0cb488, 0x0cb460, 0x0cdbf8],
		RELIC_RITO:				[0xfda0cde4, 0x0da0d8, 0x0da190, 0x0da160, 0x0dcac0]
	},



	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayPos){if(arrayPos)tempFile.writeInt(offset+8*i,val?1:0);else tempFile.writeInt(offset,val?1:0)},
	_writeValue:function(offset,val,arrayPos){if(arrayPos)tempFile.writeInt(offset+8*i,val);else tempFile.writeInt(offset,val)},
	_writeString:function(offset,str){
		for(var i=0; i<16; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeByte(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},

	_searchHash:function(hash){
		for(var i=0x0c; i<tempFile.fileSize; i+=8)
			if(hash===tempFile.readInt(i))
				return i;
		return false;
	},
	_readFromHash:function(hash){
		var offset=this._searchHash(hash);
		if(typeof offset === 'number')
			return tempFile.readInt(offset+4);
		return false;
	},
	_writeValueAtHash:function(hash,val){
		var offset=this._searchHash(hash);
		if(typeof offset==='number')
			this._writeValue(offset+4,val);
	},

	_getOffsets(v){
		this.Offsets={};
		if(v<=3){
			for(prop in this.OffsetsAll){
				this.Offsets[prop]=this.OffsetsAll[prop][v+1];
			}
		}else{ /* unknown version */
			var textarea=document.createElement('textarea');
			for(prop in this.OffsetsAll){
				var offset=this._searchHash(this.OffsetsAll[prop][0]);
				if(offset){
					textarea.value+=prop+':0x'+(offset+4).toString(16)+',\n';
					this.Offsets[prop]=offset+4;
				}
			}
			document.body.appendChild(textarea);
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
	_getItemRow(i){
		return getField('number-item'+i).parentElement.parentElement
	},
	_createItemRow(i,itemCat){
		var itemNameId=this._loadItemName(i);
		var itemVal=tempFile.readInt(this._getItemQuantityOffset(i));

		var img=new Image();
		img.id='icon'+i;
		img.className='clickable';
		img.src=BOTW_Icons.getBlankIcon();

		img.addEventListener('click', function(){
			SavegameEditor.editItem(i);
		}, false);
		/*img.addEventListener('error', function(){
			img.src=BOTW_Icons.getBlankIcon();
		}, false);*/

		var itemNumber=document.createElement('span');
		itemNumber.className='item-number';
		itemNumber.innerHTML='#'+i;

		var span=document.createElement('span');
		span.id='item-name'+i;
		span.innerHTML=this._getItemTranslation(itemNameId);


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
			this._writeItemName(i,'Item_Fruit_A');
			document.getElementById('container-materials').appendChild(this._createItemRow(i, false));
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
			document.getElementById('container-'+newCat).appendChild(row);
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
		tempFile.writeInt(this._getModifierOffset1(type)+i*0x08, modifier);
		tempFile.writeInt(this._getModifierOffset2(type)+i*0x08, val);
	},

	editHorse:function(i){
		currentEditingItem=i;
		if(currentEditingItem==5){ /* untamed horse */
			hide('row-tamed-horse');
			if(!this._readString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*5).startsWith('GameRomHorse')){
				MarcDialogs.alert('Error: this will only work if your savegame has Link on an untamed horse.');
				return false;
			}
		}else{
			show('row-tamed-horse');
			setValue('horse-name',this._readString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i));
			setValue('horse-saddles',this._readString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i));
			setValue('horse-reins',this._readString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i));
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


	/* check if savegame is valid */
	checkValidSavegame:function(){
		tempFile.littleEndian=false;
		for(var i=0; i<this.Constants.FILESIZE.length; i++){
			if(tempFile.fileSize===this.Constants.FILESIZE[i] && tempFile.readInt(0)===this.Constants.HEADER[i] && tempFile.readInt(4)===0xffffffff){
				this._getOffsets(i);
				setValue('version', 'v1.'+i+'.x (Wii U)');
				return true;
			}
		}

		tempFile.littleEndian=true;
		for(var i=0; i<this.Constants.FILESIZE.length; i++){
			if(tempFile.fileSize===this.Constants.FILESIZE[i] && tempFile.readInt(0)===this.Constants.HEADER[i] && tempFile.readInt(4)===0xffffffff){
				this._getOffsets(i);
				setValue('version', 'v1.'+i+'.x (Switch)');
				return true;
			}
		}

		return false
	},


	preload:function(){
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
			get('select-item').appendChild(optGroup);
		}

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
		setValue('rupees', tempFile.readInt(this.Offsets.RUPEES));
		setValue('mons', tempFile.readInt(this.Offsets.MONS));

		setValue('relic-gerudo', tempFile.readInt(this.Offsets.RELIC_GERUDO));
		setValue('relic-goron', tempFile.readInt(this.Offsets.RELIC_GORON));
		setValue('relic-rito', tempFile.readInt(this.Offsets.RELIC_RITO));

		setValue('koroks', tempFile.readInt(this.Offsets.KOROK_SEED_COUNTER));
		setValue('defeated-hinox', tempFile.readInt(this.Offsets.DEFEATED_HINOX_COUNTER));
		setValue('defeated-talus', tempFile.readInt(this.Offsets.DEFEATED_TALUS_COUNTER));
		setValue('defeated-molduga', tempFile.readInt(this.Offsets.DEFEATED_MOLDUGA_COUNTER));
		setValue('playtime',this._timeToString(tempFile.readInt(this.Offsets.PLAYTIME)));		

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
				var modifier=tempFile.readInt(this.Offsets['FLAGS_'+modifierColumn.toUpperCase()]+i*8);
				var modifierSelect=select('modifier-'+modifierColumn+'s-'+i, BOTW_Data.MODIFIERS.concat({value:modifier,name:this._toHexInt(modifier)}));
				modifierSelect.value=modifier;

				var additional=document.getElementById('container-'+modifierColumn+'s').children[i].children[2];
				additional.appendChild(modifierSelect);
				additional.appendChild(inputNumber('modifier-'+modifierColumn+'s-value-'+i, 0, 0xffffffff, tempFile.readInt(this.Offsets['FLAGSV_'+modifierColumn.toUpperCase()]+i*8)));
			}
		}
	},

	/* save function */
	save:function(){
		/* STATS */
		tempFile.writeInt(this.Offsets.RUPEES, getValue('rupees'));
		tempFile.writeInt(this.Offsets.MONS, getValue('mons'));

		tempFile.writeInt(this.Offsets.RELIC_GERUDO, getValue('relic-gerudo'));
		tempFile.writeInt(this.Offsets.RELIC_GORON, getValue('relic-goron'));
		tempFile.writeInt(this.Offsets.RELIC_RITO, getValue('relic-rito'));
		
		tempFile.writeInt(this.Offsets.KOROK_SEED_COUNTER, getValue('koroks'));
		tempFile.writeInt(this.Offsets.DEFEATED_HINOX_COUNTER, getValue('defeated-hinox'));
		tempFile.writeInt(this.Offsets.DEFEATED_TALUS_COUNTER, getValue('defeated-talus'));
		tempFile.writeInt(this.Offsets.DEFEATED_MOLDUGA_COUNTER, getValue('defeated-molduga'));

		/* ITEMS */
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			if(document.getElementById('number-item'+i) || document.getElementById('select-item'+i))
				tempFile.writeInt(this._getItemQuantityOffset(i), getValue('item'+i));
			else
				break;
		}

		/* modifiers */
		for(var i=0; document.getElementById('select-modifier-weapons-'+i); i++){
			tempFile.writeInt(this.Offsets.FLAGS_WEAPON+i*8, getValue('modifier-weapons-'+i));
			tempFile.writeInt(this.Offsets.FLAGSV_WEAPON+i*8, getValue('modifier-weapons-value-'+i));
		}
		for(var i=0; document.getElementById('select-modifier-bows-'+i); i++){
			tempFile.writeInt(this.Offsets.FLAGS_BOW+i*8, getValue('modifier-bows-'+i));
			tempFile.writeInt(this.Offsets.FLAGSV_BOW+i*8, getValue('modifier-bows-value-'+i));
		}
		for(var i=0; document.getElementById('select-modifier-shields-'+i); i++){
			tempFile.writeInt(this.Offsets.FLAGS_SHIELD+i*8, getValue('modifier-shields-'+i));
			tempFile.writeInt(this.Offsets.FLAGSV_SHIELD+i*8, getValue('modifier-shields-value-'+i));
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
		if(offset && !tempFile.readInt(offset+4)){
			tempFile.writeInt(offset+4, 1);
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
	tempFile.writeInt(offset+4, 1);

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
			var val=tempFile.readInt(offset+4);
			if(val && val!==0xffffffff){
				tempFile.writeInt(offset+4, 0xffffffff);
				setToStock++;
			}
		}
	}
	MarcDialogs.alert(setToStock+' pics were reseted to stock.<br/>You can now safely remove all .jpg files under <u>pict_book</u> folder.');
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

window.addEventListener('load',function(){
	window.addEventListener('scroll',onScroll,false);
}, false);