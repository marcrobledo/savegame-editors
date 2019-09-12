/*
	Super Kirby Clash savegame editor v20190912
	by Marc Robledo 2019
*/

SavegameEditor={
	Name:'Super Kirby Clash',
	Filename:'savedata.dat',

	/* Constants */
	Offsets:{
		APPLE_GEMS:0x3ef0,
		BOUGHT_APPLE_GEMS:0x3f00,
		SHARDS_RED:0x3f20,
		SHARDS_BLUE:0x3f24,
		SHARDS_YELLOW:0x3f28,
		SHARDS_RARE:0x3f2c
		//PROFILE_NAME:0x1bb4,
		//PROFILE_PLAYED_TIME:0x1b74,
		//PROFILE_COMPLETED_MISSIONS:0x1b90,
		//PROFILE_MULTIPLAYER_BATTLES:0x1b94,
		//PROFILE_MULTIPLAYER_ENCOUNTERS:0x1b64
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===54344)
	},

	/* preload function */
	preload:function(){
		setNumericRange('applegems', 0, 99999);
		setNumericRange('boughtapplegems', 0, 5000);
		setNumericRange('shards-red', 0, 9999);
		setNumericRange('shards-blue', 0, 9999);
		setNumericRange('shards-yellow', 0, 9999);
		setNumericRange('shards-rare', 0, 9999);

		//setNumericRange('encounters', 0, 65535);
		//setNumericRange('multiplayerbattles', 0, 65535);
		//setNumericRange('time', 0, 0xffffffff);
		//setNumericRange('missions', 0, 0xffffffff);
	},

	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='savedata.dat';

		/* load data */
		//setValue('name', tempFile.readU16String(this.Offsets.PROFILE_NAME, 16));
		//setValue('time', tempFile.readU32(this.Offsets.PROFILE_PLAYED_TIME));
		//setValue('missions', tempFile.readU32(this.Offsets.PROFILE_COMPLETED_MISSIONS));
		//setValue('encounters', tempFile.readU32(this.Offsets.PROFILE_MULTIPLAYER_ENCOUNTERS));
		//setValue('multiplayerbattles', tempFile.readU32(this.Offsets.PROFILE_MULTIPLAYER_BATTLES));

		setValue('applegems', tempFile.readU32(this.Offsets.APPLE_GEMS));
		setValue('boughtapplegems', tempFile.readU16(this.Offsets.BOUGHT_APPLE_GEMS));
	
		setValue('shards-red', tempFile.readU16(this.Offsets.SHARDS_RED));
		setValue('shards-blue', tempFile.readU16(this.Offsets.SHARDS_BLUE));
		setValue('shards-yellow', tempFile.readU16(this.Offsets.SHARDS_YELLOW));
		setValue('shards-rare', tempFile.readU16(this.Offsets.SHARDS_RARE));
	},

	/* save function */
	save:function(){
		//tempFile.writeU16String(this.Offsets.PROFILE_NAME, 16, getValue('name'));
		//tempFile.writeU32(this.Offsets.PROFILE_PLAYED_TIME, getValue('time'));
		//tempFile.writeU32(this.Offsets.PROFILE_COMPLETED_MISSIONS, getValue('missions'));
		//tempFile.writeU32(this.Offsets.PROFILE_MULTIPLAYER_ENCOUNTERS, getValue('encounters'));
		//tempFile.writeU32(this.Offsets.PROFILE_MULTIPLAYER_BATTLES, getValue('multiplayerbattles'));

		tempFile.writeU32(this.Offsets.APPLE_GEMS, getValue('applegems'));
		tempFile.writeU16(this.Offsets.BOUGHT_APPLE_GEMS, getValue('boughtapplegems'));

		tempFile.writeU16(this.Offsets.SHARDS_RED, getValue('shards-red'));
		tempFile.writeU16(this.Offsets.SHARDS_BLUE, getValue('shards-blue'));
		tempFile.writeU16(this.Offsets.SHARDS_YELLOW, getValue('shards-yellow'));
		tempFile.writeU16(this.Offsets.SHARDS_RARE, getValue('shards-rare'));
	}
}