/*
	The legend of Zelda: Breath of the wild (DEPRECATED) v20170521
	by Marc Robledo 2017
*/

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===896976 || tempFile.fileSize===897160 || tempFile.fileSize===897112)
	},


	/* load function */
	load:function(){
		window.location.href = 'http://www.marcrobledo.com/savegame-editors/zelda-botw/';
	},

	/* save function */
	save:function(){}
}