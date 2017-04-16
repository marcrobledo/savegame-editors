/*
	Team Kirby Clash Deluxe savegame editor v20170416
	by Marc Robledo 2017
*/

var currentBOTWItem=0;
SavegameEditor={
	Name:'Team Kirby Clash Deluxe',
	Filename:'savedata.dat',

	/* Constants */
	Offsets:{
		APPLE_GEMS:0x199c,
		BOUGHT_APPLE_GEMS:0x19b8,
		SHARDS_RED:0x19bc,
		SHARDS_BLUE:0x19c0,
		SHARDS_YELLOW:0x19c4,
		SHARDS_RARE:0x19c8 /* not tested? */
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===8464)
	},


	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='savedata.dat';

		/* prepare editor */
		card(
			'Apple gems',
			row([9,3],
				label('number-applegems', 'Apple gems'),
				inputNumber('applegems', 0, 65535, tempFile.readShort(this.Offsets.APPLE_GEMS))
			),
			row([9,3],
				label('number-boughtapplegems', 'Bought apple gems (affects tree)'),
				inputNumber('boughtapplegems', 0, 3000, tempFile.readShort(this.Offsets.BOUGHT_APPLE_GEMS))
			)
		);
		card(
			'Crystal shards',
			row([9,3],
				label('number-shards-red', 'Fire shards'),
				inputNumber('shards-red', 0, 999, tempFile.readShort(this.Offsets.SHARDS_RED))
			),
			row([9,3],
				label('number-shards-blue', 'Water shards'),
				inputNumber('shards-blue', 0, 999, tempFile.readShort(this.Offsets.SHARDS_BLUE))
			),
			row([9,3],
				label('number-shards-yellow', 'Light shards'),
				inputNumber('shards-yellow', 0, 999, tempFile.readShort(this.Offsets.SHARDS_YELLOW))
			),
			row([9,3],
				label('number-shards-rare', 'Rare shards'),
				inputNumber('shards-rare', 0, 999, tempFile.readShort(this.Offsets.SHARDS_RARE))
			)
		);
	},

	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.APPLE_GEMS, getValue('applegems'));
		tempFile.writeShort(this.Offsets.BOUGHT_APPLE_GEMS, getValue('boughtapplegems'));

		tempFile.writeShort(this.Offsets.SHARDS_RED, getValue('shards-red'));
		tempFile.writeShort(this.Offsets.SHARDS_BLUE, getValue('shards-blue'));
		tempFile.writeShort(this.Offsets.SHARDS_YELLOW, getValue('shards-yellow'));
		tempFile.writeShort(this.Offsets.SHARDS_RARE, getValue('shards-rare'));
	}
}