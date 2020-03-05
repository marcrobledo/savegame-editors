/*
	Sushi Striker for HTML5 Save Editor v20200305
	by Marc Robledo 2019-20
*/

SavegameEditor={
	Name:'Sushi Striker',
	Filename:'backup_slot1.dat',

	ITEMS_OFFSET:0x1808,
	MAX_ITEMS:47,

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===9296)
	},

	/* preload function */
	preload:function(){
		for(var i=0; i<this.MAX_ITEMS; i++){
			if(get('input-item'+i))
				setNumericRange('item'+i, 0, 0xffff);
		}
	},

	/* load function */
	load:function(){
		tempFile.littleEndian=true;

		for(var i=0; i<this.MAX_ITEMS; i++){
			if(get('input-item'+i)){
				setValue('item'+i, tempFile.readU32(this.ITEMS_OFFSET+i*8));
				get('input-item'+i).originalValue=parseInt(getValue('item'+i));
			}
		}
	},


	/* save function */
	save:function(){
		for(var i=0; i<this.MAX_ITEMS; i++){
			if(get('input-item'+i)){
				var amount=parseInt(getValue('item'+i));
				tempFile.writeU32(this.ITEMS_OFFSET+i*8, amount);

				if(get('input-item'+i).originalValue!==amount){
					if(get('input-item'+i).originalValue===0){
						tempFile.writeU8(this.ITEMS_OFFSET+i*8+4, 1); //new=1
					}else if(amount===0){
						tempFile.writeU8(this.ITEMS_OFFSET+i*8+4, 0); //new=0
					}
					get('input-item'+i).originalValue=amount;
				}
			}
		}
	}
}