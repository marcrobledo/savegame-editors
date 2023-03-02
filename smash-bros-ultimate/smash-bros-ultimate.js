/*
	Super Smash Bros. Ultimate for HTML5 Save Editor v2019-2023
	by Marc Robledo 2019-2023
	
	
	
	INFO: https://github.com/CapitanRetraso/Ultimate-Smasher
*/

SavegameEditor={
	Name:'Super Smash Bros. Ultimate',
	Filename:'system_data.bin',

	Offsets:{
		ITEMS_SHUFFLE_ALL:0x4831c0,
		ITEMS_ALL_PRIMARIES:0x4831c1,
		ITEMS_ALL_SUPPORTS:0x4831c2,
		ITEMS_FILLER:0x4831c3,
		ITEMS_REMATCH:0x4831c4,
		ITEMS_50_DAMAGE:0x4831c6,
		ITEMS_SLOW_FS_CHARGING:0x4831c7,
		ITEMS_WEAKEN_MINIONS:0x4831c8,
		ITEMS_HEALTH_DRAIN:0x4831c9,
		ITEMS_DISABLE_ITEMS:0x4831ca,
		ITEMS_SHIELD_SPACER:0x4831cb,
		ITEMS_SLUGGISH_SHIELD:0x4831cc,
		SNACK_S:		0x4831ce,
		SNACK_M:		0x4831d0,
		SNACK_L:		0x4831d2,
		SPIRIT_POINTS:	0x4831e4,
		TICKETS:		0x5506cc,
		GOLD:			0x5506dc,
		HAMMERS:		0x555e5c
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===5982968)
	},

	/* preload function */
	preload:function(){
		setNumericRange('items-shuffle-all', 0, 99);
		setNumericRange('items-all-primaries', 0, 99);
		setNumericRange('items-all-supports', 0, 99);
		setNumericRange('items-filler', 0, 99);
		setNumericRange('items-rematch', 0, 99);
		setNumericRange('items-50-damage', 0, 99);
		setNumericRange('items-slow-fs-charging', 0, 99);
		setNumericRange('items-weaken-minions', 0, 99);
		setNumericRange('items-health-drain', 0, 99);
		setNumericRange('items-disable-items', 0, 99);
		setNumericRange('items-shield-spacer', 0, 99);
		setNumericRange('items-sluggish-shield', 0, 99);
		setNumericRange('snacks-s', 0, 999);
		setNumericRange('snacks-m', 0, 999);
		setNumericRange('snacks-l', 0, 999);
		setNumericRange('sp', 0, 999999);
		setNumericRange('tickets', 0, 99);
		setNumericRange('gold', 0, 999999);
		setNumericRange('hammers', 0, 9);
	},

	/* load function */
	load:function(){
		tempFile.fileName='system_data.bin';
		tempFile.littleEndian=true;

		setValue('items-shuffle-all', tempFile.readU8(this.Offsets.ITEMS_SHUFFLE_ALL));
		setValue('items-all-primaries', tempFile.readU8(this.Offsets.ITEMS_ALL_PRIMARIES));
		setValue('items-all-supports', tempFile.readU8(this.Offsets.ITEMS_ALL_SUPPORTS));
		setValue('items-filler', tempFile.readU8(this.Offsets.ITEMS_FILLER));
		setValue('items-rematch', tempFile.readU8(this.Offsets.ITEMS_REMATCH));
		setValue('items-50-damage', tempFile.readU8(this.Offsets.ITEMS_50_DAMAGE));
		setValue('items-slow-fs-charging', tempFile.readU8(this.Offsets.ITEMS_SLOW_FS_CHARGING));
		setValue('items-weaken-minions', tempFile.readU8(this.Offsets.ITEMS_WEAKEN_MINIONS));
		setValue('items-health-drain', tempFile.readU8(this.Offsets.ITEMS_HEALTH_DRAIN));
		setValue('items-disable-items', tempFile.readU8(this.Offsets.ITEMS_DISABLE_ITEMS));
		setValue('items-shield-spacer', tempFile.readU8(this.Offsets.ITEMS_SHIELD_SPACER));
		setValue('items-sluggish-shield', tempFile.readU8(this.Offsets.ITEMS_SLUGGISH_SHIELD));

		setValue('snacks-s', tempFile.readU16(this.Offsets.SNACK_S));
		setValue('snacks-m', tempFile.readU16(this.Offsets.SNACK_M));
		setValue('snacks-l', tempFile.readU16(this.Offsets.SNACK_L));
		setValue('sp', tempFile.readU32(this.Offsets.SPIRIT_POINTS));
		setValue('tickets', tempFile.readU8(this.Offsets.TICKETS));
		setValue('gold', tempFile.readU32(this.Offsets.GOLD));
		setValue('hammers', tempFile.readU8(this.Offsets.HAMMERS));
	},

	/* save function */
	save:function(){
		tempFile.writeU8(this.Offsets.ITEMS_SHUFFLE_ALL, getValue('items-shuffle-all'));
		tempFile.writeU8(this.Offsets.ITEMS_ALL_PRIMARIES, getValue('items-all-primaries'));
		tempFile.writeU8(this.Offsets.ITEMS_ALL_SUPPORTS, getValue('items-all-supports'));
		tempFile.writeU8(this.Offsets.ITEMS_FILLER, getValue('items-filler'));
		tempFile.writeU8(this.Offsets.ITEMS_REMATCH, getValue('items-rematch'));
		tempFile.writeU8(this.Offsets.ITEMS_50_DAMAGE, getValue('items-50-damage'));
		tempFile.writeU8(this.Offsets.ITEMS_SLOW_FS_CHARGING, getValue('items-slow-fs-charging'));
		tempFile.writeU8(this.Offsets.ITEMS_WEAKEN_MINIONS, getValue('items-weaken-minions'));
		tempFile.writeU8(this.Offsets.ITEMS_HEALTH_DRAIN, getValue('items-health-drain'));
		tempFile.writeU8(this.Offsets.ITEMS_DISABLE_ITEMS, getValue('items-disable-items'));
		tempFile.writeU8(this.Offsets.ITEMS_SHIELD_SPACER, getValue('items-shield-spacer'));
		tempFile.writeU8(this.Offsets.ITEMS_SLUGGISH_SHIELD, getValue('items-sluggish-shield'));

		tempFile.writeU16(this.Offsets.SNACK_S, getValue('snacks-s'));
		tempFile.writeU16(this.Offsets.SNACK_M, getValue('snacks-m'));
		tempFile.writeU16(this.Offsets.SNACK_L, getValue('snacks-l'));
		tempFile.writeU32(this.Offsets.SPIRIT_POINTS, getValue('sp'));
		tempFile.writeU8(this.Offsets.TICKETS, getValue('tickets'));
		tempFile.writeU32(this.Offsets.GOLD, getValue('gold'));
		tempFile.writeU8(this.Offsets.HAMMERS, getValue('hammers'));
	}
}