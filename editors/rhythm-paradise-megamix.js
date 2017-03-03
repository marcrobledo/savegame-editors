/*
	Rhythm Paradise Megamix for HTML5 Save Editor v20170104
	by Marc Robledo 2017
*/

SavegameEditors.RhythmParadiseMegamix={
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

		updateInput('rhythmcoins', tempFile.readShort(this.Offsets.COINS));
		updateInput('flowballs', tempFile.readShort(this.Offsets.FLOWBALLS));
		updateInput('onions1', tempFile.readByte(this.Offsets.ONIONS1));
		updateInput('onions2', tempFile.readByte(this.Offsets.ONIONS2));
		updateInput('onions3', tempFile.readByte(this.Offsets.ONIONS3));
	},


	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.COINS, getInputNumber('coins'));
		tempFile.writeShort(this.Offsets.FLOWBALLS, getInputNumber('flowballs'));
		tempFile.writeByte(this.Offsets.ONIONS1, getInputNumber('onions1'));
		tempFile.writeByte(this.Offsets.ONIONS2, getInputNumber('onions2'));
		tempFile.writeByte(this.Offsets.ONIONS3, getInputNumber('onions3'));
	}
}