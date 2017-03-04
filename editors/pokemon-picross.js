/*
	Pokémon Picross for HTML5 Save Editor v20170304
	by Marc Robledo 2017
*/

SavegameEditors.PokemonPicross={
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

		updateInput('picrites', tempFile.readShort(this.Offsets.PICRITES));
		updateInput('boughtpicrites', tempFile.readShort(this.Offsets.BOUGHTPICRITES));
	},


	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.PICRITES, getInputNumber('picrites'));
		var boughtPicrites=getInputNumber('boughtpicrites');
		tempFile.writeShort(this.Offsets.BOUGHTPICRITES, boughtPicrites);
		var unlockedShopByte=tempFile.readByte(this.Offsets.UNLOCKEDSHOPFLAG) & ~0x01;
		tempFile.writeByte(this.Offsets.UNLOCKEDSHOPFLAG, unlockedShopByte+(boughtPicrites>=5000)?0x01:0x00);
	}
}