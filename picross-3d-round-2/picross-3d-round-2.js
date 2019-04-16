/*
	Picross 3D round 2 for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/

SavegameEditor={
	Name:'Picross 3D: round 2',
	Filename:'SAVEDATA',

	AmiiboOffset:0x1a4c,

	unlockAmiiboPuzzles:function(){
		for(var i=0; i<9; i++){
			var offset=this.AmiiboOffset+i*16;
			var b=tempFile.readU8(offset);
			if(!(b & 0x09)){
				tempFile.writeU8(offset, b+0x09);
			}
		}
		setValue('amiibocount', 9);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==45688)
	},

	/* load function */
	load:function(){
		tempFile.fileName='SAVEDATA';

		var unlockedAmiibos=0;
		for(var i=0; i<9; i++){
			if(tempFile.readU8(this.AmiiboOffset+i*16) & 0x09){
				unlockedAmiibos++;
			}
		}
		setValue('amiibocount', unlockedAmiibos);
	},


	/* save function */
	save:function(){
	}
}