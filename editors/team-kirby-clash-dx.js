/*
	Team Kirby Clash Deluxe savegame editor v20170415
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
	},

	/* private functions */
	//none?

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
			row([9,3],
				label('number-applegems', 'Apple gems'),
				inputNumber('applegems', 0, 65535, tempFile.readShort(this.Offsets.APPLE_GEMS))
			),
			row([9,3],
				label('number-boughtapplegems', 'Bought apple gems (affects tree)'),
				inputNumber('boughtapplegems', 0, 3000, tempFile.readShort(this.Offsets.BOUGHT_APPLE_GEMS))
			)
		);
	},

	/* save function */
	save:function(){
		tempFile.writeShort(this.Offsets.APPLE_GEMS, getValue('applegems'));
		tempFile.writeShort(this.Offsets.BOUGHT_APPLE_GEMS, getValue('boughtapplegems'));
	}
}