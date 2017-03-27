/*
	Pokémon Picross for HTML5 Save Editor v20170304
	by Marc Robledo 2017
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
		return (tempFile.fileSize==14920)
	},

	/* load function */
	load:function(){
		tempFile.fileName='all.dat';

		setValue('pokemonpicross-picrites', tempFile.readShort(this.Offsets.PICRITES), 0, 9999);
		setValue('pokemonpicross-boughtpicrites', tempFile.readShort(this.Offsets.BOUGHTPICRITES), 0, 5000);
	},


	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.PICRITES, getValue('pokemonpicross-picrites'));
		var boughtPicrites=getValue('pokemonpicross-boughtpicrites');
		tempFile.writeShort(this.Offsets.BOUGHTPICRITES, boughtPicrites);
		var unlockedShopByte=tempFile.readByte(this.Offsets.UNLOCKEDSHOPFLAG) & ~0x01;
		tempFile.writeByte(this.Offsets.UNLOCKEDSHOPFLAG, unlockedShopByte+(boughtPicrites>=5000)?0x01:0x00);
	}
}