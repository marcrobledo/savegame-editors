/*
	Mario Kart 7 for HTML5 Save Editor v20190410
	by Marc Robledo 2019
*/

SavegameEditor={
	Name:'Mario Kart 7',
	Filename:'system0.dat',

	Offsets:{
		NAME:0x22,
		COINS:0x4c28,
		STREETPASS:0x4e24,
		WINS:0x4e34,
		LOSES:0x4e38,
		VR_POINTS:0x4e3c,
		UNLOCKED_CUPS:0x4e3f,
		UNLOCKED_CHARACTERS:0x4e42,
		UNLOCKED_KARTS:0x4e48,
		UNLOCKED_TIRES:0x4e4c,
		UNLOCKED_GLIDERS:0x4e50
	},
	Unlocks:{
		ALL_CUPS:[0x3f],
		ALL_CHARACTERS:[0xff,0x01,0xff,0x01],
		ALL_KARTS:[0xff,0x3f],
		ALL_TIRES:[0x7f],
		ALL_GLIDERS:[0x3f]
	},

	/* CRC32 - from Alex - https://stackoverflow.com/a/18639999 */
	CRC32_TABLE:(function(){
		var c,crcTable=[];
		for(var n=0;n<256;n++){
			c=n;
			for(var k=0;k<8;k++)
				c=((c&1)?(0xedb88320^(c>>>1)):(c>>>1));
			crcTable[n]=c;
		}
		return crcTable;
	}()),
	crc32:function(file, len){
		var data=file.readBytes(0, len);

		var crc=0^(-1);

		for(var i=0;i<len;i++){
			crc=(crc>>>8)^this.CRC32_TABLE[(crc^data[i])&0xff];
		}

		return ((crc^(-1))>>>0);
	},

	/* compare byte arrays */
	compareUnlockArrays(id){
		var idUpper=id.toUpperCase();
		var bytes=tempFile.readBytes(this.Offsets['UNLOCKED_'+idUpper], this.Unlocks['ALL_'+idUpper].length);

		var compare=true;
		for(var i=0; i<bytes.length && compare; i++){
			if(bytes[i]!==this.Unlocks['ALL_'+idUpper][i])
				compare=false;
		}
		
		getField('unlock-'+id).checked=compare;
	},

	/* unlock */
	unlock(id){
		var idUpper=id.toUpperCase();
		if(getField('unlock-'+id).checked)
			tempFile.writeBytes(this.Offsets['UNLOCKED_'+idUpper], this.Unlocks['ALL_'+idUpper]);
	},


	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===20692)
	},

	/* preload function */
	preload:function(){
		setNumericRange('coins', 0, 99999);
		setNumericRange('streetpass', 0, 99999);
		setNumericRange('wins', 0, 99999);
		setNumericRange('loses', 0, 99999);
		setNumericRange('vrpoints', 0, 99999);
	},

	/* load function */
	load:function(){
		tempFile.littleEndian=true;

		setValue('name', tempFile.readU16String(this.Offsets.NAME, 10));
		setValue('coins', tempFile.readU24(this.Offsets.COINS));
		setValue('streetpass', tempFile.readU24(this.Offsets.STREETPASS));
		setValue('wins', tempFile.readU16(this.Offsets.WINS));
		setValue('loses', tempFile.readU16(this.Offsets.LOSES));
		setValue('vrpoints', tempFile.readU16(this.Offsets.VR_POINTS));

		this.compareUnlockArrays('cups');
		this.compareUnlockArrays('characters');
		this.compareUnlockArrays('karts');
		this.compareUnlockArrays('tires');
		this.compareUnlockArrays('gliders');
	},


	/* save function */
	save:function(){
		tempFile.writeU16String(this.Offsets.NAME, 10, getValue('name'));
		tempFile.writeU24(this.Offsets.COINS, getValue('coins'));
		tempFile.writeU24(this.Offsets.STREETPASS, getValue('streetpass'));
		tempFile.writeU16(this.Offsets.WINS, getValue('wins'));
		tempFile.writeU16(this.Offsets.LOSES, getValue('loses'));
		tempFile.writeU16(this.Offsets.VR_POINTS, getValue('vrpoints'));

		this.unlock('cups');
		this.unlock('characters');
		this.unlock('karts');
		this.unlock('tires');
		this.unlock('gliders');

		tempFile.writeU32(20688, this.crc32(tempFile, 20692-4));
	}
}