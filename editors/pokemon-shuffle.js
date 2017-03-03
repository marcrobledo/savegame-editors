/*
	Pokemon Shuffle for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/

SavegameEditors.PokemonShuffle={
	Name:'Pokémon Shuffle',
	Filename:'savedata.bin',
	Offsets:{
		Coins:{
			ADDRESS: 0x68,
			NBYTES: 4,
			BITOFFSET: 3,
			NBITS: 17,
		},

		Jewels:{
			ADDRESS: 0x6a,
			NBYTES: 2,
			BITOFFSET: 4,
			NBITS: 8,
		},

		Hearts:{
			ADDRESS: 0x2d4a,
			NBYTES: 2,
			BITOFFSET: 7,
			NBITS: 7,
		},

		Items:{
			ADDRESS: 0xd0,
			NBYTES: 2,
			BITOFFSET: 7,
			NBITS: 7,
		},

		Enhancements:{
			ADDRESS: 0x2d4c,
			NBYTES: 1,
			BITOFFSET: 1,
			NBITS: 7,
		},

		CurrentScalationLevel:{
			ADDRESS: 0x2d59,
			NBYTES: 2,
			BITOFFSET: 2,
			NBITS: 10,
		}
	},

	/* private functions */
	_readBytes(address, numBytes){
		var num;
		if(numBytes==4){
			num=tempFile.readInt(address);
		}else if(numBytes==2){
			num=tempFile.readShort(address);
		}else{
			num=tempFile.readByte(address);
		}
		return num;
	},
	_readVariable(v,addOffset){
		var num=this._readBytes(v.ADDRESS+addOffset, v.NBYTES);
		num=num >> v.BITOFFSET;

		return num & (Math.pow(2,v.NBITS)-1);
	},
	_storeVariable(v,addOffset,newValInput){
		/* << to shift mask,     ~ to bitwise,     >>> 0 forces unsigned values */
		var inverseMask=~((Math.pow(2,v.NBITS)-1) << v.BITOFFSET) >>> 0;
		var originalBytes=this._readBytes(v.ADDRESS+addOffset, v.NBYTES);

		var newValue=(originalBytes & inverseMask) + (parseInt(newValInput) << v.BITOFFSET) >>> 0;
		
		if(v.NBYTES==4){
			tempFile.writeInt(v.ADDRESS+addOffset, newValue);
		}else if(v.NBYTES==2){
			tempFile.writeShort(v.ADDRESS+addOffset, newValue);
		}else{
			tempFile.writeByte(v.ADDRESS+addOffset, newValue);
		}
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==42039 || tempFile.fileSize==74807)
	},


	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='savedata.bin';

		updateInput('coins', this._readVariable(this.Offsets.Coins, 0));
		updateInput('jewels', this._readVariable(this.Offsets.Jewels, 0));
		updateInput('hearts', this._readVariable(this.Offsets.Hearts, 0));

		for(var i=0; i<7; i++)
			updateInput('item'+i, this._readVariable(this.Offsets.Items, i));

		var maxEnhancements;
		if(tempFile.fileSize==42039)
			maxEnhancements=1;
		else if(tempFile.fileSize==74807)
			maxEnhancements=10;
		for(var i=0; i<maxEnhancements; i++)
			updateInput('enhancement'+i, this._readVariable(this.Offsets.Enhancements, i));

		updateInput('scalationlvl', this._readVariable(this.Offsets.CurrentScalationLevel, 0));
	},


	/* save function */
	save:function(){
		 this._storeVariable(this.Offsets.Coins, 0, getInputNumber('coins', 0, 99999));
		 this._storeVariable(this.Offsets.Jewels, 0, getInputNumber('jewels', 0, 150));
		 this._storeVariable(this.Offsets.Hearts, 0, getInputNumber('hearts', 0, 99));

		for(var i=0; i<7; i++)
			 this._storeVariable(this.Offsets.Items, i, getInputNumber('item'+i, 0, 99));

		var maxEnhancements;
		if(tempFile.fileSize==42039)
			maxEnhancements=1;
		else if(tempFile.fileSize==74807)
			maxEnhancements=10;
		for(var i=0; i<maxEnhancements; i++)
			this._storeVariable(this.Offsets.Enhancements, i, getInputNumber('enhancement'+i, 0, 99));

		this._storeVariable(this.Offsets.CurrentScalationLevel, 0, getInputNumber('scalationlvl', 1, 999));
	}
}