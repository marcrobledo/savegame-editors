/*
	Final Fantasy Explorers for HTML5 Save Editor v20180708
	by Marc Robledo 2018
*/

SavegameEditor={
	Name:'Final Fantasy Explorers',
	Filename:'game0',

	Offsets:{
		GIL:0x031424,
		CP:0x03142c,
		ITEMS:0x023140,
		MATERIALS:0x02ff98,
		ATMALITHS:0x030128
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===201816)
	},


	/* preload function */
	preload:function(){
		setNumericRange('gil', 0, 9999999);
		setNumericRange('cp', 0, 9999999);

		createInventoryTable('material', MATERIALS);
		createInventoryTable('atmalith', ATMALITHS);
		createInventoryTable('item', ITEMS);
	},

	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='game0';

		setValue('gil', tempFile.readU24(this.Offsets.GIL), 0, 9999999);
		setValue('cp', tempFile.readU24(this.Offsets.CP), 0, 9999999);

		readInventoryFromTable('material', MATERIALS, this.Offsets.MATERIALS);
		readInventoryFromTable('atmalith', ATMALITHS, this.Offsets.ATMALITHS);
		readInventoryFromTable('item', ITEMS, this.Offsets.ITEMS);
	},


	/* save function */
	save:function(){
		tempFile.writeU24(this.Offsets.GIL, getValue('gil'));
		tempFile.writeU24(this.Offsets.CP, getValue('cp'));

		writeToInventory('material', MATERIALS, this.Offsets.MATERIALS);
		writeToInventory('atmalith', ATMALITHS, this.Offsets.ATMALITHS);
		writeToInventory('item', ITEMS, this.Offsets.ITEMS);
	}
}



function readInventoryFromTable(container, table, offset){
	for(var i=0; i<table.length; i++){
		setValue(container+table[i][0], tempFile.readU8(offset+table[i][0]));
		checkQuantity(getField(container+table[i][0]));
	}
}
function writeToInventory(container, table, offset){
	for(var i=0; i<table.length; i++){
		tempFile.writeU8(offset+table[i][0], getValue(container+table[i][0]))
	}
}
function createInventoryTable(container, table){
	for(var i=0; i<table.length; i++){
		var input=inputNumber(container+table[i][0], 0, 99);
		input.addEventListener('change', checkQuantityEvent, false);
		get('container-'+container+'s').appendChild(row(
			[11,1],
			label('number-'+container+table[i][0], '<span class="fficon fficon'+table[i][1]+'"></span> '+table[i][2]),
			input
		));
	}
}


function checkQuantity(el){
	el.parentElement.parentElement.children[0].children[0].style.opacity=parseInt(el.value)?1:.2;
}
function checkQuantityEvent(){
	return checkQuantity(this);
}

/*
function getWeaponName(i){return WEAPONS[i][2]}
function getWeaponType(i){return WEAPONS[i][0]}
function getWeaponPassiveTrait(i){return WEAPONS[i][1]}
function getArmorName(i){return ARMOR[i][1]}
function getArmorType(i){return ARMOR[i][0]}


function Weapon(offset){
	this.offset=offset;
	this.hash=tempFile.readInt(offset);
	this.pAttack=tempFile.readShort(offset+4);
	this.mAttack=tempFile.readShort(offset+6);
	this.pAccuracy=tempFile.readShort(offset+8);
	this.mAccuracy=tempFile.readShort(offset+10);
	this.mRecovery=tempFile.readShort(offset+12);
	this.trait=tempFile.readInt(offset+14);
	this.traitValue=tempFile.readInt(offset+18);
}*/