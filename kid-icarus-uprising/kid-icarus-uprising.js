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
				{id:0xfa2000,name:'First Blade'},
				{id:0xf9a880,name:'Burst Blade'},
				{id:0x5b2100,name:'Viper Blade'},
				{id:0x7a6180,name:'Crusader Blade'},
				{id:0x79e200,name:'Royal Blade'},
				{id:0x84e280,name:'Optical Blade'},
				{id:0x66e300,name:'Samurai Blade'},
				{id:0x926380,name:'Bullet Blade'},
				{id:0x9cec00,name:'Aquarius Blade'},
				{id:0x88ec80,name:'Aurum Blade'},
				{id:0x876500,name:'Palutena Blade'},
				{id:0x94ed80,name:'Gaol Blade'}
			]},
			{name:'Staves', weapons:[
				{id:0x49c804,name:'Insight Staff'},
				{id:0x7c4084,name:'Orb Staff'},
				{id:0x4d4904,name:'Rose Staff'},
				{id:0x684184,name:'Knuckle Staff'},
				{id:0x944204,name:'Ancient Staff'},
				{id:0x934284,name:'Lancer Staff'},
				{id:0x93c304,name:'Flintlock Staff'},
				{id:0x9bcb84,name:'Somewhat Staff'},
				{id:0xf98c04,name:'Scorpio Staff'},
				{id:0xbd8c84,name:'Laser Staff'},
				{id:0x5a0504,name:'Dark Pit Staff'},
				{id:0xfa0d84,name:'Thanatos Staff'}
			]},
			{name:'Claws', weapons:[
				{id:0x9f0888,name:'Tiger Claws'},
				{id:0x9f0888,name:'Wolf Claws'},
				{id:0xa30908,name:'Bear Claws'},
				{id:0xa2c988,name:'Brawler Claws'},
				{id:0x9e8a08,name:'Stealth Claws'},
				{id:0x9e0a88,name:'Hedgehog Claws'},
				{id:0x8d4b08,name:'Raptor Claws'},
				{id:0x7f0388,name:'Artillery Claws'},
				{id:0xf9cc08,name:'Cancer Claws'},
				{id:0xd50c88,name:'Beam Claws'},
				{id:0xa3cd08,name:'Viridi Claws'},
				{id:0xa38c88,name:'Pandora Claws'}
			]},
			{name:'Bows', weapons:[
				{id:0xaf080c,name:'Fortune Bow'},
				{id:0x81c08c,name:'Silver Bow'},
				{id:0xf9c90c,name:'Meteor Bow'},
				{id:0x96498c,name:'Divine Bow'},
				{id:0x89ca0c,name:'Darkness Bow'},
				{id:0xacca8c,name:'Crystal Bow'},
				{id:0x95cb0c,name:'Angel Bow'},
				{id:0xabcb8c,name:'Hawkeye Bow'},
				{id:0xaf4c0c,name:'Sagittarius Bow'},
				{id:0x4ccc8c,name:'Aurum Bow'},
				{id:0x67c50c,name:'Palutena Bow'},
				{id:0x50cd8c,name:'Phrosphora Bow'}
			]},
			{name:'Palms', weapons:[
				{id:0xfa0810,name:'Violet Palm'},
				{id:0xf98890,name:'Burning Palm'},
				{id:0x87c910,name:'Needle Palm'},
				{id:0x914190,name:'Midnight Palm'},
				{id:0xa9ca10,name:'Cursed Palm'},
				{id:0xaf4a90,name:'Cutter Palm'},
				{id:0x514310,name:'Pudgy Palm'},
				{id:0xaa4b90,name:'Ninja Palm (Weeaboo Palm)'},
				{id:0x674410,name:'Virgo Palm'},
				{id:0x924490,name:'Aurum Palm'},
				{id:0x99c510,name:'Viridi Palm'},
				{id:0xaecd90,name:'Great Reaper Palm'}
			]},
			{name:'Clubs', weapons:[
				{id:0xa60814,name:'Ore Club'},
				{id:0x9d8894,name:'Babel Club'},
				{id:0x9e0914,name:'Skyscraper Club'},
				{id:0x65c994,name:'Atlas Club'},
				{id:0xf9c214,name:'Earthmaul Club'},
				{id:0xa48A94,name:'Ogre Club'},
				{id:0x884b14,name:'Halo Club'},
				{id:0xa58b94,name:'Black Club'},
				{id:0xa68c14,name:'Capricorn Club'},
				{id:0x834494,name:'Aurum Club'},
				{id:0x874514,name:'Hewdraw Club'},
				{id:0xa50d94,name:'Magnus Club'}
			]},
			{name:'Cannons', weapons:[
				{id:0xaa4818,name:'EZ Cannon'},
				{id:0xa1c098,name:'Ball Cannon'},
				{id:0xf9c918,name:'Predator Cannon'},
				{id:0x51c198,name:'Poseidon Cannon'},
				{id:0xae8a18,name:'Fireworks Cannon'},
				{id:0x4aca98,name:'Rail Cannon'},
				{id:0xaecb18,name:'Dynamo Cannon'},
				{id:0x634b98,name:'Doom Cannon'},
				{id:0x9bc418,name:'Leo Cannon'},
				{id:0x5b0498,name:'Sonic Cannon'},
				{id:0x864518,name:'Twinbellows Cannon'},
				{id:0x84c598,name:'Cragalanche Cannon'}
			]},
			{name:'Orbitars', weapons:[
				{id:0xfa081c,name:'Standard Orbitars'},
				{id:0x85809c,name:'Guardian Orbitars'},
				{id:0x53a91c,name:'Shock Orbitars'},
				{id:0x4d899c,name:'Eyetrack Orbitars'},
				{id:0x534a1c,name:'Fairy Orbitars'},
				{id:0x68829c,name:'Paw Pad Orbitars'},
				{id:0x7f831c,name:'Jetstream Orbitars'},
				{id:0x69039c,name:'Boom Orbitars'},
				{id:0x898c1c,name:'Gemini Orbitars'},
				{id:0x7e049c,name:'Aurum Orbitars'},
				{id:0x7e851c,name:'Centurion Orbitars'},
				{id:0xf98d9c,name:'Arlon Orbitars'}
			]},
			{name:'Arms', weapons:[
				{id:0x9a4020,name:'Crusher Arm'},
				{id:0x8b48a0,name:'Compact Arm'},
				{id:0xf9c920,name:'Electroshock Arm'},
				{id:0xa949a0,name:'Volcano Arm'},
				{id:0x484a20,name:'Drill Arm'},
				{id:0x914aa0,name:'Bomber Arm'},
				{id:0x478b20,name:'Bowl Arm'},
				{id:0xa98ba0,name:'End-All Arm'},
				{id:0x79c420,name:'Taurus Arm'},
				{id:0x8044a0,name:'Upperdash Arm'},
				{id:0x844520,name:'Kraken Arm'},
				{id:0x83c5a0,name:'Phoenix Arm'}
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
	_readWeapon:function(i){
		currentWeapon=i;
		var offset=this._getWeaponOffset();

		var weaponType=(tempFile.readU8(offset+0x05)<<16)+(tempFile.readU8(offset+0x06)<<8)+tempFile.readU8(offset+0x07);
		get('weapon-unknown').innerHTML='0x'+weaponType.toString(16);
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
		tempFile.writeU8(offset+0x05, (weaponType & 0xff0000) >> 16);
		tempFile.writeU8(offset+0x06, (weaponType & 0x00ff00) >> 8);
		tempFile.writeU8(offset+0x07, (weaponType & 0x0000ff) >> 0);

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
				option.value=WEAPON.id;
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