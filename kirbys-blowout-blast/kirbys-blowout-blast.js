/*
	Kirby's Blowout Blast for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/

SavegameEditor={
	Name:'Kirby\'s Blowout Blast',
	Filename:'savedata.dat',

	StatuesOffset:0x07,

	unlockAmiiboPuzzles:function(){
		for(var i=0; i<5; i++)
			tempFile.writeU8(this.StatuesOffset+i*2, 0x01);
		tempFile.writeU8(this.StatuesOffset+1, 0x01);
		setValue('amiibocount', 5);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==1736)
	},

	/* load function */
	load:function(){
		tempFile.fileName='savedata.dat';

		var unlockedStatues=0;
		for(var i=0; i<5; i++){
			if(tempFile.readU8(this.StatuesOffset+i*2))
				unlockedStatues++;
		}
		setValue('amiibocount', unlockedStatues);
	},


	/* save function */
	save:function(){
	}
}