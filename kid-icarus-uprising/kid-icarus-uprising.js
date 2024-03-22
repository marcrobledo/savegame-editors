/*
	Kid Icarus: Uprising for HTML5 Save Editor v20190411
	by Marc Robledo 2016-2019
*/

var currentWeapon=0
SavegameEditor={
	Name:'Kid Icarus: Uprising',
	Filename:'0x.sav',

	/* Constants */
	Constants:{
		NUM_TREASURE:	120*3,
		NUM_TROPHIES:	412,
		NUM_WEAPONS:	1000,
		NUM_LEVELS:		25,
		WEAPON_SIZE:	0x20,
		MODIFIERS:[
			'-',
			'Standing ch. shot +1',
			'Standing ch. shot +2',
			'Standing ch. shot +3',
			'Standing ch. shot +4',
			'Standing ch. shot -1',
			'Standing ch. shot -2',
			'Dash ch. shot +1',
			'Dash ch. shot +2',
			'Dash ch. shot +3',
			'Dash ch. shot +4',
			'Dash ch. shot -1',
			'Dash ch. shot -2',
			'Forward-dash ch. shot +1',
			'Forward-dash ch. shot +2',
			'Forward-dash ch. shot +3',
			'Forward-dash ch. shot +4',
			'Side-dash ch. shot +1',
			'Side-dash ch. shot +2',
			'Side-dash ch. shot +3',
			'Side-dash ch. shot +4',
			'Backward-dash ch. shot +1',
			'Backward-dash ch. shot +2',
			'Backward-dash ch. shot +3',
			'Backward-dash ch. shot +4',
			'Standing cont. fire +1',
			'Standing cont. fire +2',
			'Standing cont. fire +3',
			'Standing cont. fire +4',
			'Standing cont. fire -1',
			'Standing cont. fire -2',
			'Dash cont. fire +1',
			'Dash cont. fire +2',
			'Dash cont. fire +3',
			'Dash cont. fire +4',
			'Dash cont. fire -1',
			'Dash cont. fire -2',
			'Forward-dash cont. fire +1',
			'Forward-dash cont. fire +2',
			'Forward-dash cont. fire +3',
			'Forward-dash cont. fire +4',
			'Side-dash cont. fire +1',
			'Side-dash cont. fire +2',
			'Side-dash cont. fire +3',
			'Side-dash cont. fire +4',
			'Backward-dash cont. fire +1',
			'Backward-dash cont. fire +2',
			'Backward-dash cont. fire +3',
			'Backward-dash cont. fire +4',
			'Melee Combo +1',
			'Melee Combo +2',
			'Melee Combo +3',
			'Melee Combo +4',
			'Melee Combo -1',
			'Melee Combo -2',
			'Melee Dash Attack +1',
			'Melee Dash Attack +2',
			'Melee Dash Attack +3',
			'Melee Dash Attack +4',
			'Melee Dash Attack -1',
			'Melee Dash Attack -2',
			'Item Attack +1',
			'Item Attack +2',
			'Item Attack +3',
			'Item Attack +4',
			'Power Attack +1',
			'Power Attack +2',
			'Power Attack +3',
			'Power Attack +4',
			'Health +1',
			'Health +2',
			'Health +3',
			'Health +4',
			'Health +5',
			'Health +6',
			'Health -1',
			'Health -2',
			'Health -3',
			'Health -4',
			'Stamina +1',
			'Stamina +2',
			'Stamina +3',
			'Stamina +4',
			'Speed +1',
			'Speed +2',
			'Speed +3',
			'Speed +4',
			'Speed -1',
			'Speed -2',
			'Speed -3',
			'Speed -4',
			'Walking Speed +1',
			'Walking Speed +2',
			'Walking Speed +3',
			'Walking Speed +4',
			'Running speed +1',
			'Running speed +2',
			'Running speed +3',
			'Running speed +4',
			'Evasion +1',
			'Evasion +2',
			'Evasion +3',
			'Evasion +4',
			'Shot Defense +1',
			'Shot Defense +2',
			'Shot Defense +3',
			'Shot Defense +4',
			'Shot Defense -1',
			'Shot Defense -2',
			'Melee defense +1',
			'Melee defense +2',
			'Melee defense +3',
			'Melee defense +4',
			'Melee defense -1',
			'Melee defense -2',
			'Knockback Defense +1',
			'Knockback Defense +2',
			'Knockback Defense +3',
			'Knockback Defense +4',
			'Status resistance +1',
			'Status resistance +2',
			'Status resistance +3',
			'Status resistance +4',
			'Status resistance -1',
			'Status resistance -2',
			'Status resistance -3',
			'Status resistance -4',
			'Overall Defense +1',
			'Overall Defense +2',
			'Overall Defense +3',
			'Overall Defense +4',
			'Overall Defense +5',
			'Overall Defense +6',
			'Overall Defense +7',
			'Overall Defense +8',
			'Overall Defense -1',
			'Overall Defense -2',
			'Overall Defense -3',
			'Overall Defense -4',
			'Recovery Effect +1',
			'Recovery Effect +2',
			'Recovery Effect +3',
			'Recovery Effect +4',
			'Effect Duration +1',
			'Effect Duration +2',
			'Effect Duration +3',
			'Effect Duration +4',
			'Poison +1',
			'Poison +2',
			'Poison +3',
			'Poison +4',
			'Paralyse +1',
			'Paralyse +2',
			'Paralyse +3',
			'Paralyse +4',
			'Weakening +1',
			'Weakening +2',
			'Weakening +3',
			'Weakening +4',
			'Petrify +1',
			'Petrify +2',
			'Petrify +3',
			'Petrify +4',
			'Shaking +1',
			'Shaking +2',
			'Shaking +3',
			'Shaking +4',
			'Confusion +1',
			'Confusion +2',
			'Confusion +3',
			'Confusion +4',
			'Burning +1',
			'Burning +2',
			'Burning +3',
			'Burning +4',
			'Freezing +1',
			'Freezing +2',
			'Freezing +3',
			'Freezing +4',
			'Shot Range +1',
			'Shot Range +2',
			'Shot Range +3',
			'Shot Range -1',
			'Shot Range -2',
			'Shot Range -3',
			'Shot Homing +1',
			'Shot Homing +2',
			'Shot Homing +3',
			'Shot Homing -1',
			'Shot Homing -2',
			'Shot Homing -3',
			'Shot Cancellation +1',
			'Knockback Recovery +1',
			'Self Injury -1',
			'Self Injury -2',
			'Self Injury -3',
			'Full-health boost +1',
			'Full-health boost +2',
			'Full-health boost +3',
			'Full-health boost +4',
			'Full-health boost +5',
			'Full-health boost +6',
			'In Peril Auto-Dodge +1',
			'In Peril Auto-Dodge +2',
			'In Peril Auto-Dodge +3',
			'In Peril Attack Boost +1',
			'In Peril Attack Boost +2',
			'In Peril Attack Boost +3',
			'In Peril Attack Boost +4',
			'In Peril Attack Boost +5',
			'In Peril Attack Boost +6',
			'In Peril Attack Boost -1',
			'In Peril Attack Boost -2',
			'In Peril Attack Boost -3',
			'In Peril Attack Boost -4',
			'Heart Bonus +1',
			'Heart Bonus +2',
			'Heart Bonus +3',
			'Heart Bonus -1',
			'Heart Bonus -2',
			'Heart Bonus -3'
		],
		MODIFIERS_VALUES:[
			0.0,
			9.2, 15.8, 22.4, 29, /* Standing Ch. Shot+ */
			-6.4, -12.8, /* Standing Ch. Shot- */
			13.2, 23.3, 33.4, 43.6, /* Dash Ch. Shot+ */
			-11.1, -22.1, /* Dash Ch. Shot- */
			11.2, 19.1, 26.9, 34.8, /* Fwd-Dash Ch. Shot+ */
			9.9, 16.7, 23.5, 30.4, /* Side-Dash Ch. Shot+ */
			10.6, 17.9, 25.2, 32.6, /* Bkwd-Dash Ch. Shot+ */
			7.9, 13, 18, 23.1, /* Standing Cont. Fire+ */
			-5.1, -10.1, /* Standing Cont. Fire- */
			10.6, 17.2, 23.8, 30.4, /* Dash Cont. Fire+ */
			-9.2, -18.5, /* Dash Cont. Fire- */
			8.6, 14.2, 19.7, 25.3, /* Fwd-Dash Cont. Fire+ */
			8.6, 14.2, 19.7, 25.3, /* Side-Dash Cont. Fire+ */
			8.6, 14.2, 19.7, 25.3, /* Bkwd-Dash Cont. Fire+ */
			9.2, 15.3, 21.4, 27.5, /* Melee Combo+ */
			-6.4, -12.8, /* Melee Combo- */
			7.9, 12.6, 17.3, 22, /* Melee Dash Attack+ */
			-5.5, -11, /* Melee Dash Attack- */
			14.5, 27.7, 40.9, 54.1, /* Item Attack+ */
			23.8, 40.3, 56.8, 73.3, /* Power Attack+ */
			9, 18.4, 27.9, 37.3, 46.7, 56.1, /* Health+ */
			-8.1, -15.8, -23.5, -31.1, /* Health- */
			11.9, 17.9, 23.9, 29.9, /* Stamina+ */
			9.2, 17.2, 25.1, 33, /* Speed+ */
			-11, -17.6, -24.2, -30.8, /* Speed- */
			6.6, 9.9, 13.2, 16.5, /* Walking Speed+ */
			7.9, 13.4, 18.9, 24.4, /* Running Speed+ */
			10.8, 17.2, 23.5, 29.9, /* Evasion+ */
			15, 29.8, 44.7, 59.6, /* Shot Defense+ */
			-14.9, -31.2, /* Shot Defense- */
			9.9, 18.5, 27.1, 35.6, /* Melee Defense+ */
			-8.9, -20.8, /* Melee Defense- */
			6.6, 13.2, 19.8, 26.4, /* Knockback Defense+ */
			12.8, 21.3, 29.8, 38.3, /* Status Resistance+ */
			-7.7, -10.7, -13.6, -16.6, /* Status Resistance- */
			15, 25.8, 36.6, 47.5, 58.3, 69.2, 80, 90.9, /* Overall Defense+ */
			-16.5, -25.7, -34.8, -44, /* Overall Defense- */
			15.8, 21.1, 26.4, 31.7, /* Recovery Effect+ */
			10.6, 20.2, 29.9, 39.6, /* Effect Duration+ */
			6.2, 10, 13.9, 17.8, /* Poison+ */
			7.9, 14.5, 21.1, 27.7, /* Paralysis+ */
			9.2, 16.4, 23.5, 30.6, /* Weakening+ */
			16.9, 20.9, 24.9, 28.8, /* Petrification+ */
			7.3, 14.1, 20.9, 27.7, /* Shaking+ */
			7.3, 14.1, 20.9, 27.7, /* Confusion+ */
			7.9, 13.9, 19.8, 25.7, /* Burning+ */
			20.2, 25.5, 30.8, 36.1, /* Freezing+ */
			13.9, 24.3, 34.8, /* Shot Range+ */
			-5.9, -9.2, -12.5, /* Shot Range- */
			11.9, 18.7, 25.5, /* Shot Homing+ */
			-4.6, -8.1, -11.7, /* Shot Homing- */
			42.5, /* Shot Cancellation+ */
			10.6, /* Knockback Recovery+ */
			-8.8, -13.2, -17.6, /* Self Injury- */
			8.6, 12.3, 16.1, 19.8, 23.5, 27.3, /* Full Health Boost+ */
			7.7, 11.6, 15.4, /* In-peril Auto-dodge+ */
			9.9, 16, 22, 28.1, 34.2, 40.3, /* In-peril Attack Boost+ */
			-10.7, -14.2, -17.8, -21.3, /* In-peril Attack Boost- */
			8.8, 17.6, 26.4, /* Heart Bonus+ */
			-3.3, -5, -6.6 /* Heart Bonus- */
		],
		STAR_RANGED_VALUES:[
			0.0, 14.9, 23.2, 31.5, 39.8, 48.1, 56.4, 64.7, 73.0, 81.3, 89.6, 98.2, 106.2, -11.75, -23.5, -35.25, -47.0
		],
		STAR_MELEE_VALUES:[
			0.0, 9.4, 15.2, 21.0, 26.8, 32.6, 38.4, 44.2, 50.0, 55.8, 61.6, 67.4, 73.2, -8.5, -17, -25.5, -34
		],
		DEFAULT_MODIFIERS:[
			0x4a, 0x86, 0x8e, 0x1c, 0xbe, 0xdc
		],
		STARS:[
			'-',
			'☆',
			'★',
			'★☆',
			'★★',
			'★★☆',
			'★★★',
			'★★★☆',
			'★★★★',
			'★★★★☆',
			'★★★★★',
			'★★★★★☆',
			'★★★★★★',
			'-☆',
			'-★',
			'-★☆',
			'-★★'
		],
		STATS:[
			/* BASIC */
			'Times played',
			'Total play time (in seconds)',
			'Total Solo play time (in seconds)',
			'Hearts acquired',
			'Weapons acquired',
			'Powers acquired',
			'UNKNOWN_1',
			'Enemies defeated',
			'Bosses defeated',
			'Ranged attacks',
			'Melee attacks',
			'Attacks evaded',
			'Knockback recoveries',
			'Shots narrowly avoided',
			'Special Attacks used',
			'Times finished',
			'Powers used',
			'Items used',
			'Times eggplanted',
			'Times tempuraed',
			'Centurions summoned',

			/* SOLO */
			'Chapters cleared',
			'Total score',
			'Chapters cleared at max Intensity',
			'Avg. Intensity *FLOAT*',
			'Avg. Intensity for cleared chapters *FLOAT*',
			'Hearts bet in the Fiend\'s cauldron',
			'Hearts lost',
			'Most hearts acquired',
			'Most weapons acquired',
			'Most powers acquired',
			'Weapons purchased',
			'Weapons converted to hearts',
			'Hearts offered in the Vault',
			'UNKNOWN_2',
			'UNKNOWN_3',
			'UNKNOWN_4',
			'UNKNOWN_5',
			'Weapons fusions',
			'Treasure boxes opened',
			'Times pickpocketed',
			'Souflees defeated',
			'Rare Treasurefish defeated',
			'Exo Tank uses',
			'Aether Ring uses',
			'Cherubot uses',
			'Three Sacred Treasures uses',
			'Lightning Chariot uses',
			'Great Sacred Treasure uses',
			'Time playes as Magnus (in seconds)',
			'Time playes as Dark Pit (in seconds)',
			'Practice Range uses',

			/* TOGETHER */
			'Nearby matches played',
			'Nearby time played (in seconds)',
			'Total Nearby participants',
			'Far Away matches played',
			'Total Far Away participants',
			'Time played With Friends',
			'Time played With Anyone',
			'Light vs. Dark matches played',
			'Light vs. Dark matches won',
			'Free-for-All matches played',
			'Free-for-All matches won',
			'Opponents defeated',
			'Matches suspended',
			'Times you became an angel',
			'Times you won as an angel',
			'Angels defeated',
			'Weapons rewarded',
			'Powers rewarded',
			'Hearts rewarded',

			/* STREETPASS */
			'Weapon gems created',
			'Weapon-gem-exchange partners',
			'UNKNOWN_6',
			'Weapons fused from gems',
			'Hearts acquired by gems'
		],
		WEAPON_TYPES:[
			{name:'Blades', weapons:[
				{bitmap:0x0000,name:'First Blade'},
				{bitmap:0x8000,name:'Burst Blade'},
				{bitmap:0x0001,name:'Viper Blade'},
				{bitmap:0x8001,name:'Crusader Blade'},
				{bitmap:0x0002,name:'Royal Blade'},
				{bitmap:0x8002,name:'Optical Blade'},
				{bitmap:0x0003,name:'Samurai Blade'},
				{bitmap:0x8003,name:'Bullet Blade'},
				{bitmap:0x0004,name:'Aquarius Blade'},
				{bitmap:0x8004,name:'Aurum Blade'},
				{bitmap:0x0005,name:'Palutena Blade'},
				{bitmap:0x8005,name:'Gaol Blade'}
			]},
			{name:'Staves', weapons:[
				{bitmap:0x0400,name:'Insight Staff'},
				{bitmap:0x8400,name:'Orb Staff'},
				{bitmap:0x0401,name:'Rose Staff'},
				{bitmap:0x8401,name:'Knuckle Staff'},
				{bitmap:0x0402,name:'Ancient Staff'},
				{bitmap:0x8402,name:'Lancer Staff'},
				{bitmap:0x0403,name:'Flintlock Staff'},
				{bitmap:0x8403,name:'Somewhat Staff'},
				{bitmap:0x0404,name:'Scorpio Staff'},
				{bitmap:0x8404,name:'Laser Staff'},
				{bitmap:0x0405,name:'Dark Pit Staff'},
				{bitmap:0x8405,name:'Thanatos Staff'}
			]},
			{name:'Claws', weapons:[
				{bitmap:0x8800,name:'Tiger Claws'},
				{bitmap:0x8800,name:'Wolf Claws'},
				{bitmap:0x0801,name:'Bear Claws'},
				{bitmap:0x8801,name:'Brawler Claws'},
				{bitmap:0x0802,name:'Stealth Claws'},
				{bitmap:0x8802,name:'Hedgehog Claws'},
				{bitmap:0x0803,name:'Raptor Claws'},
				{bitmap:0x8803,name:'Artillery Claws'},
				{bitmap:0x0804,name:'Cancer Claws'},
				{bitmap:0x8804,name:'Beam Claws'},
				{bitmap:0x0805,name:'Viridi Claws'},
				{bitmap:0x8805,name:'Pandora Claws'}
			]},
			{name:'Bows', weapons:[
				{bitmap:0x0c00,name:'Fortune Bow'},
				{bitmap:0x8c00,name:'Silver Bow'},
				{bitmap:0x0c01,name:'Meteor Bow'},
				{bitmap:0x8c01,name:'Divine Bow'},
				{bitmap:0x0c02,name:'Darkness Bow'},
				{bitmap:0x8c02,name:'Crystal Bow'},
				{bitmap:0x0c03,name:'Angel Bow'},
				{bitmap:0x8c03,name:'Hawkeye Bow'},
				{bitmap:0x0c04,name:'Sagittarius Bow'},
				{bitmap:0x8c04,name:'Aurum Bow'},
				{bitmap:0x0c05,name:'Palutena Bow'},
				{bitmap:0x8c05,name:'Phrosphora Bow'}
			]},
			{name:'Palms', weapons:[
				{bitmap:0x1000,name:'Violet Palm'},
				{bitmap:0x9000,name:'Burning Palm'},
				{bitmap:0x1001,name:'Needle Palm'},
				{bitmap:0x9001,name:'Midnight Palm'},
				{bitmap:0x1002,name:'Cursed Palm'},
				{bitmap:0x9002,name:'Cutter Palm'},
				{bitmap:0x1003,name:'Pudgy Palm'},
				{bitmap:0x9003,name:'Ninja Palm (Weeaboo Palm)'},
				{bitmap:0x1004,name:'Virgo Palm'},
				{bitmap:0x9004,name:'Aurum Palm'},
				{bitmap:0x1005,name:'Viridi Palm'},
				{bitmap:0x9005,name:'Great Reaper Palm'}
			]},
			{name:'Clubs', weapons:[
				{bitmap:0x1400,name:'Ore Club'},
				{bitmap:0x9400,name:'Babel Club'},
				{bitmap:0x1401,name:'Skyscraper Club'},
				{bitmap:0x9401,name:'Atlas Club'},
				{bitmap:0x1402,name:'Earthmaul Club'},
				{bitmap:0x9402,name:'Ogre Club'},
				{bitmap:0x1403,name:'Halo Club'},
				{bitmap:0x9403,name:'Black Club'},
				{bitmap:0x1404,name:'Capricorn Club'},
				{bitmap:0x9404,name:'Aurum Club'},
				{bitmap:0x1405,name:'Hewdraw Club'},
				{bitmap:0x9405,name:'Magnus Club'}
			]},
			{name:'Cannons', weapons:[
				{bitmap:0x1800,name:'EZ Cannon'},
				{bitmap:0x9800,name:'Ball Cannon'},
				{bitmap:0x1801,name:'Predator Cannon'},
				{bitmap:0x9801,name:'Poseidon Cannon'},
				{bitmap:0x1802,name:'Fireworks Cannon'},
				{bitmap:0x9802,name:'Rail Cannon'},
				{bitmap:0x1803,name:'Dynamo Cannon'},
				{bitmap:0x9803,name:'Doom Cannon'},
				{bitmap:0x1804,name:'Leo Cannon'},
				{bitmap:0x9804,name:'Sonic Cannon'},
				{bitmap:0x1805,name:'Twinbellows Cannon'},
				{bitmap:0x9805,name:'Cragalanche Cannon'}
			]},
			{name:'Orbitars', weapons:[
				{bitmap:0x1c00,name:'Standard Orbitars'},
				{bitmap:0x9c00,name:'Guardian Orbitars'},
				{bitmap:0x1c01,name:'Shock Orbitars'},
				{bitmap:0x9c01,name:'Eyetrack Orbitars'},
				{bitmap:0x1c02,name:'Fairy Orbitars'},
				{bitmap:0x9c02,name:'Paw Pad Orbitars'},
				{bitmap:0x1c03,name:'Jetstream Orbitars'},
				{bitmap:0x9c03,name:'Boom Orbitars'},
				{bitmap:0x1c04,name:'Gemini Orbitars'},
				{bitmap:0x9c04,name:'Aurum Orbitars'},
				{bitmap:0x1c05,name:'Centurion Orbitars'},
				{bitmap:0x9c05,name:'Arlon Orbitars'}
			]},
			{name:'Arms', weapons:[
				{bitmap:0x2000,name:'Crusher Arm'},
				{bitmap:0xa000,name:'Compact Arm'},
				{bitmap:0x2001,name:'Electroshock Arm'},
				{bitmap:0xa001,name:'Volcano Arm'},
				{bitmap:0x2002,name:'Drill Arm'},
				{bitmap:0xa002,name:'Bomber Arm'},
				{bitmap:0x2003,name:'Bowl Arm'},
				{bitmap:0xa003,name:'End-All Arm'},
				{bitmap:0x2004,name:'Taurus Arm'},
				{bitmap:0xa004,name:'Upperdash Arm'},
				{bitmap:0x2005,name:'Kraken Arm'},
				{bitmap:0xa005,name:'Phoenix Arm'}
			]}
		]
	},
	Offsets:{
		TREASURE_HUNT:				0x0c,
		CURRENT_HEARTS:				0x01e8,
		HEARTS_OFFERED_TO_PALUTENA:	0x01ec,
		HEARTS_OFFERED_TO_VIRIDI:	0x01f0,
		TROPHIES:					0x046c,
		WEAPONS:					0x0670,
		WEAPONS_TYPE:				0x05,
		WEAPONS_STARS1:				0x08,
		WEAPONS_STARS2:				0x0a,
		WEAPONS_MODIFIERS:			0x14,
		LEVEL_ENEMIES_DEFEATED:		0x8370,
		LEVEL_SCORE:				0x010068,
		LEVEL_INTENSITY:			0x0100ec,
		STATS:						0x0101b8,
	},

	// Define a variable to store currentWeaponID.
	_currWeaponID: null,

	/* private functions */
	_checkIfMissingAnyUnreleasedTrophy:function(){
		var missing=false;
		for(var i=404; i<412 && !missing; i++){
			if(tempFile.readU8(this.Offsets.TROPHIES+i)==0){
				missing=true;
			}
		}
		return missing
	},
	_disableUnlockUnreleasedTrophiesButton:function(){
		get('button-unlock-trophies').disabled=true;
		get('button-unlock-trophies').value='OK!';
	},
	_getWeaponOffset:function(){
		return this.Offsets.WEAPONS+currentWeapon*this.Constants.WEAPON_SIZE
	},

	_fetchWeaponName:function() {
		// Interested in bits 1011 1100 = 0xBC
		var classBitMap = 0xBC;

		// Interested in bits 0000 0111 - 0x07
		var weaponBitMap = 0x07;

		// Get weapon signature
		var signature = ((this._currWeaponID[0] & classBitMap) << 8) + (this._currWeaponID[1] & weaponBitMap);

		// Loop through weapons until signature matches bitmap
		for(var i = 0; i < this.Constants.WEAPON_TYPES.length; i++){
			var GROUP = this.Constants.WEAPON_TYPES[i];
			for(var j = 0; j<GROUP.weapons.length; j++){
				var WEAPON=GROUP.weapons[j];
				if (WEAPON.bitmap === signature) {
					return WEAPON.name
				}
			}
		}
	},

	_readWeapon:function(i){
		currentWeapon=i;
		var offset=this._getWeaponOffset();

		var weaponType=(tempFile.readU8(offset+0x05)<<16)+(tempFile.readU8(offset+0x06)<<8)+tempFile.readU8(offset+0x07);
		this._currWeaponID = new Uint8Array([tempFile.readU8(offset+0x05), tempFile.readU8(offset+0x06)]);
		var weaponName = this._fetchWeaponName();
		get('weapon-unknown').innerHTML=weaponName;
		get('weapon-unknown').value=weaponType;

		get('select-weapon-type').value=weaponType;

		var starsRanged=tempFile.readU16(offset+0x08);
		var starsMelee=tempFile.readU16(offset+0x0a);
		if((starsRanged>=0x11 && starsRanged<=0x16) && starsMelee==0x00){ /* unknown fix for some weapons? */
			starsMelee=starsRanged;
			starsRanged=0;
		}else if((starsRanged>=0x17 && starsRanged<=0x17) && starsMelee==0x00){ /* unknown fix for some weapons? */
			starsMelee=starsRanged-0x06;
			starsRanged=starsRanged-0x16;
		}
		get('select-weapon-stars-ranged').value=starsRanged;
		get('select-weapon-stars-melee').value=starsMelee;

		for(var i=0; i<6; i++){
			get('select-weapon-modifier'+i).value=tempFile.readU16(offset+0x14+i*2);
		}

		this._calculateWeaponValue();
	},
	_writeWeapon:function(){
		var offset=SavegameEditor._getWeaponOffset();

		var weaponType=parseInt(getValue('weapon-type'));
		
		// Only write weapon to file slot has been changed.
		if (this._currWeaponID) {
			// Add back original information (when weapon was retrieved) to the data
			// To do this we need this bitmap: 0100 0011 1111 1000
			var retrievedData = ((this._currWeaponID[0] << 8) | (this._currWeaponID[1])) & 0x43F8;

			// Combine weaponType and original arbitrary data.
			var result = weaponType | retrievedData;

			tempFile.writeU8(offset+0x05, (result & 0xff00) >> 8);
			tempFile.writeU8(offset+0x06, (result & 0x00ff) >> 0);
		}

		tempFile.writeU16(offset+0x08, getValue('weapon-stars-ranged'));
		tempFile.writeU16(offset+0x0a, getValue('weapon-stars-melee'));

		for(var i=0; i<6; i++)
			tempFile.writeU16(offset+0x14+i*2, getValue('weapon-modifier'+i));

		SavegameEditor._calculateWeaponValue();
	},
	_calculateWeaponValue:function(){
		var val=100;
		for(var i=0; i<6; i++){
			val+=this.Constants.MODIFIERS_VALUES[get('select-weapon-modifier'+i).value];
		}
		val+=this.Constants.STAR_RANGED_VALUES[get('select-weapon-stars-ranged').selectedIndex];
		val+=this.Constants.STAR_MELEE_VALUES[get('select-weapon-stars-melee').selectedIndex];

		//val=parseInt(val);
		val=Math.ceil(val);
		if(val<351){
			get('weapon-value').style.color='default';
			get('weapon-value').innerHTML=val;
		}else{
			get('weapon-value').style.color='red';
			get('weapon-value').innerHTML=val+' (invalid weapon!)';
		}
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==66296)
	},


	/* preload function */
	preload:function(){
		setNumericRange('hearts', 0, 9999999);
		setNumericRange('hearts-for-palutena', 0, 9999999);
		setNumericRange('hearts-for-viridi', 0, 9999999);
	},


	/* load function */
	load:function(){	
		tempFile.littleEndian=true;

		setValue('hearts', tempFile.readU32(this.Offsets.CURRENT_HEARTS));
		setValue('hearts-for-palutena', tempFile.readU32(this.Offsets.HEARTS_OFFERED_TO_PALUTENA));
		setValue('hearts-for-viridi', tempFile.readU32(this.Offsets.HEARTS_OFFERED_TO_VIRIDI));

		if(!this._checkIfMissingAnyUnreleasedTrophy())
			this._disableUnlockUnreleasedTrophiesButton();

		/* STATS */
		for(var i=0; i<this.Constants.STATS.length; i++){
			var val,input;
			if(i==24 || i==25){
				val=tempFile.readF32(this.Offsets.STATS+i*4);
				//console.log((this.Offsets.STATS+i*4).toString(16));
				input=inputFloat('stat'+i, 0.0, 9.0, val);
			}else{
				val=tempFile.readU32(this.Offsets.STATS+i*4);
				input=inputNumber('stat'+i, 0, 0xffffffff, val);
			}

			document.getElementById('stats').appendChild(
				row(
					[8,4],
					label('stat'+i, this.Constants.STATS[i]),
					input
				)
			);
		}


		/* WEAPONS */
		var selectWeaponType=get('select-weapon-type');
		for(var i=0; i<this.Constants.WEAPON_TYPES.length; i++){
			var GROUP=this.Constants.WEAPON_TYPES[i];
			var optGroup=document.createElement('optgroup');
			optGroup.label=GROUP.name;
			selectWeaponType.appendChild(optGroup);
			for(var j=0; j<GROUP.weapons.length; j++){
				var WEAPON=GROUP.weapons[j];
				var option=document.createElement('option');
				option.value=WEAPON.bitmap;
				option.innerHTML=(j+1)+'. '+WEAPON.name;
				optGroup.appendChild(option);
			}
		}
		var optionUnknown=document.createElement('option');
		optionUnknown.value=0x000000;
		optionUnknown.innerHTML='???';
		optionUnknown.id='weapon-unknown';
		selectWeaponType.appendChild(optionUnknown);

		var validWeapons=[];
		for(var i=0; i<this.Constants.NUM_WEAPONS; i++){
			currentWeapon=i;
			var offset=this._getWeaponOffset();
			if((tempFile.readU8(offset+0x05)<<16)+(tempFile.readU8(offset+0x06)<<8)+tempFile.readU8(offset+0x07)!==0x000000)
				validWeapons.push(i);
		}

		var selectWeapon=select('weapon', validWeapons);
		selectWeapon.className+=' medium';
		selectWeapon.addEventListener('change', function(){SavegameEditor._readWeapon(this.value)}, false);

		get('container-select-weapon').appendChild(selectWeapon);

		//currentWeapon=m('#select-weapon').children().first().get().value;
		currentWeapon=get('select-weapon').children[0].value;

		var selectStarsRanged=select('weapon-stars-ranged', this.Constants.STARS);
		selectStarsRanged.addEventListener('change', this._writeWeapon, false);
		get('container-weapon-stars-ranged').appendChild(selectStarsRanged);

		var MELEE_STARS=[];
		for(var i=0; i<this.Constants.STARS.length; i++){
			if(i==0){
				MELEE_STARS.push({value:0x00, name:'-'});
			}else{
				MELEE_STARS.push({value:0x10+i, name:this.Constants.STARS[i]});
			}
		}
		var selectStarsMelee=select('weapon-stars-melee', MELEE_STARS);		
		selectStarsMelee.addEventListener('change', this._writeWeapon, false);
		get('container-weapon-stars-melee').appendChild(selectStarsMelee);

		for(var i=0; i<6; i++){
			var selectWeaponModifier=select('weapon-modifier'+i, this.Constants.MODIFIERS);
			selectWeaponModifier.addEventListener('change', this._writeWeapon, false);
			get('container-weapon-modifier'+i).appendChild(selectWeaponModifier);
		}
		this._readWeapon(0);
	},


	/* save function */
	save:function(){
		tempFile.writeU32(this.Offsets.CURRENT_HEARTS, getValue('hearts'));
		tempFile.writeU32(this.Offsets.HEARTS_OFFERED_TO_PALUTENA, getValue('hearts-for-palutena'));
		tempFile.writeU32(this.Offsets.HEARTS_OFFERED_TO_VIRIDI, getValue('hearts-for-viridi'));

		/* STATS */
		for(var i=0; i<this.Constants.STATS.length; i++){
			if(i==24 || i==25){
				tempFile.writeF32(this.Offsets.STATS+i*4, getValue('stat'+i));
			}else{
				tempFile.writeU32(this.Offsets.STATS+i*4, getValue('stat'+i));
			}
		}
	}
}
