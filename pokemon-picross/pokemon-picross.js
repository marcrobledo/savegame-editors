/*
	Pokémon Picross for HTML5 Save Editor v20170706
	by Marc Robledo 2016-2017
*/

SavegameEditor={
	Name:'Pokémon Picross',
	Filename:'all.dat',

	Offsets:{
		PICRITES:0x0b40,
		BOUGHTPICRITES:0x0b44,
		PENDINGPICRITES:0x0b48, /* if there is an error after buying, they are queued here */
		UNLOCKEDSHOPFLAG:0x0b4c,
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===14920)
	},

	/* preload function */
	preload:function(){
		setNumericRange('picrites', 0, 9999);
		setNumericRange('boughtpicrites', 0, 5000);
	},

	/* load function */
	load:function(){
		tempFile.fileName='all.dat';

		setValue('picrites', tempFile.readU16(this.Offsets.PICRITES));
		setValue('boughtpicrites', tempFile.readU16(this.Offsets.BOUGHTPICRITES));
	},

	/* save function */
	save:function(){
		tempFile.writeU16(this.Offsets.PICRITES, getValue('picrites'));
		var boughtPicrites=getValue('boughtpicrites');
		tempFile.writeU16(this.Offsets.BOUGHTPICRITES, boughtPicrites);
		var unlockedShopByte=tempFile.readU8(this.Offsets.UNLOCKEDSHOPFLAG) & ~0x01;
		tempFile.writeU8(this.Offsets.UNLOCKEDSHOPFLAG, unlockedShopByte+(boughtPicrites>=5000)?0x01:0x00);
	}
}