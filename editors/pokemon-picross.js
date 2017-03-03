/*
	Pokémon Picross for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/

SavegameEditors.PokemonPicross={
	Name:'Pokémon Picross',
	Filename:'all.dat',

	Offsets:{
		PICRITES:0x0b40,
		BOUGHTPICRITES:0x0b42,
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==14920)
	},

	/* load function */
	load:function(){
		tempFile.fileName='all.dat';

		updateInput('picrites', tempFile.readShort(this.Offsets.PICRITES));
		//updateInput('boughtpicrites', tempFile.readShort(this.Offsets.BOUGHTPICRITES));
	},


	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.PICRITES, getInputNumber('picrites'));
		//tempFile.writeShort(this.Offsets.BOUGHTPICRITES, getInputNumber('boughtpicrites'));
	}
}