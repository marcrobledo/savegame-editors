/*
	Rhythm Paradise Megamix for HTML5 Save Editor v20170104
	by Marc Robledo 2017
*/

SavegameEditor={
	Name:'Rhythm Heaven/Paradise Megamix',
	Filename:'savedataArc.txt',

	Offsets:{
		COINS:0x2dbc,
		FLOWBALLS:0x2dbe,
		ONIONS1:0x3006,
		ONIONS2:0x3007,
		ONIONS3:0x3008
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==30040)
	},


	/* preload function */
	preload:function(){
		setNumericRange('coins', 0, 9999);
		setNumericRange('flowballs', 0, 255);
		setNumericRange('onions1', 0, 255);
		setNumericRange('onions2', 0, 255);
		setNumericRange('onions3', 0, 255);
	},

	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='savedataArc.txt';

		setValue('coins', tempFile.readU16(this.Offsets.COINS), 0, 9999);
		setValue('flowballs', tempFile.readU16(this.Offsets.FLOWBALLS), 0, 255);
		setValue('onions1', tempFile.readU8(this.Offsets.ONIONS1), 0, 255);
		setValue('onions2', tempFile.readU8(this.Offsets.ONIONS2), 0, 255);
		setValue('onions3', tempFile.readU8(this.Offsets.ONIONS3), 0, 255);
	},


	/* save function */
	save:function(){
		tempFile.writeU16(this.Offsets.COINS, getValue('coins'));
		tempFile.writeU16(this.Offsets.FLOWBALLS, getValue('flowballs'));
		tempFile.writeU8(this.Offsets.ONIONS1, getValue('onions1'));
		tempFile.writeU8(this.Offsets.ONIONS2, getValue('onions2'));
		tempFile.writeU8(this.Offsets.ONIONS3, getValue('onions3'));
	}
}