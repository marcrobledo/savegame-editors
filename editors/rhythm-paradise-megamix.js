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


	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='savedataArc.txt';

		setValue('rhythm-megamix-coins', tempFile.readShort(this.Offsets.COINS), 0, 9999);
		setValue('rhythm-megamix-flowballs', tempFile.readShort(this.Offsets.FLOWBALLS), 0, 255);
		setValue('rhythm-megamix-onions1', tempFile.readByte(this.Offsets.ONIONS1), 0, 255);
		setValue('rhythm-megamix-onions2', tempFile.readByte(this.Offsets.ONIONS2), 0, 255);
		setValue('rhythm-megamix-onions3', tempFile.readByte(this.Offsets.ONIONS3), 0, 255);
	},


	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.COINS, getValue('rhythm-megamix-coins'));
		tempFile.writeShort(this.Offsets.FLOWBALLS, getValue('rhythm-megamix-flowballs'));
		tempFile.writeByte(this.Offsets.ONIONS1, getValue('rhythm-megamix-onions1'));
		tempFile.writeByte(this.Offsets.ONIONS2, getValue('rhythm-megamix-onions2'));
		tempFile.writeByte(this.Offsets.ONIONS3, getValue('rhythm-megamix-onions3'));
	}
}