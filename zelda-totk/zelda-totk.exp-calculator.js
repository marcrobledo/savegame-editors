/*
	The legend of Zelda: Tears of the Kingdom savegame editor - Experience calculator (last update 2023-07-08)

	by Marc Robledo 2023
	research & information compiled by Echocolat and Phil
*/


const ExperienceCalculator={
	generateHashesTextActor(actorName){
		return [
			'DefeatedEnemyNum.' + actorName,
			'EnemyBattleData.' + actorName + '.DefeatedNoDamageCount',
			'EnemyBattleData.' + actorName + '.HeadShotCount',
			'EnemyBattleData.' + actorName + '.GuardJustCount',
			'EnemyBattleData.' + actorName + '.JustAvoidCount'
		];
	},
	generateHashesTextAll(){
		var hashes=[];
		for(actorName in this.SCALING_DATA){
			hashes=hashes.concat(this.generateHashesTextActor(actorName));
		}
		return hashes;
	},
	generateHashesAll(){
		return this.generateHashesTextAll().map(function(hashText){
			return hash(hashText);
		});
	},
	getPrettifiedEnemyName(actorId){
		return actorId.replace(/_/g, ' ').replace('Enemy_', '');
	},
	getPrettifiedHashLabel(hashText){
		var matches;
		if(matches=hashText.match(/^DefeatedEnemyNum.(.*?)$/)){
			return this.getPrettifiedEnemyName(matches[1])+' - Total defeated';
		}else if(matches=hashText.match(/^EnemyBattleData.(.*?).DefeatedNoDamageCount$/)){
			return this.getPrettifiedEnemyName(matches[1])+' - Damageless defeats';
		}else if(matches=hashText.match(/^EnemyBattleData.(.*?).HeadShotCount$/)){
			return this.getPrettifiedEnemyName(matches[1])+' - Head shots';
		}else if(matches=hashText.match(/^EnemyBattleData.(.*?).GuardJustCount$/)){
			return this.getPrettifiedEnemyName(matches[1])+' - Perfect Parries';
		}else if(matches=hashText.match(/^EnemyBattleData.(.*?).JustAvoidCount$/)){
			return this.getPrettifiedEnemyName(matches[1])+' - Perfect Dodges';
		}else{
			return hashText;
		}
	},



	calculate(){
		var totalExperience=0;
		for(actorName in this.SCALING_DATA){
			// Save file variable strings
			var hashTexts=this.generateHashesTextActor(actorName);
			var data=SavegameEditor._readStruct(hashTexts.map(function(hashText){
				return {hash:hashText, type:'Int'}
			}));
			var DefeatedEnemyNum = Math.min(data[hashTexts[0]],10);
			var DefeatedNoDamageCount = data[hashTexts[1]];
			var HeadShotCount = data[hashTexts[2]];
			var GuardJustCount = data[hashTexts[3]];
			var JustAvoidCount = data[hashTexts[4]];

			// All data for this actor
			var Points = this.SCALING_DATA[actorName].Points;
			var MaxNum = this.SCALING_DATA[actorName].MaxNum;
			var BossPlayerSkillPointRate = this.SCALING_DATA[actorName].BossPlayerSkillPointRate;

			// Formulas
			var DefeatPoints = Math.min(DefeatedEnemyNum, MaxNum)*Points;

			var DefeatedNoDamagePoints = Math.min(2*DefeatedEnemyNum, DefeatedNoDamageCount)*Points*0.5*BossPlayerSkillPointRate;
			var HeadshotPoints = Math.min(2*DefeatedEnemyNum, HeadShotCount)*Points*0.5*BossPlayerSkillPointRate;
			var GuardJustPoints = Math.min(1*DefeatedEnemyNum, GuardJustCount)*Points*1*BossPlayerSkillPointRate;
			var JustAvoidPoints = Math.min(1*DefeatedEnemyNum, JustAvoidCount)*Points*1*BossPlayerSkillPointRate;

			var PointSum = DefeatPoints + DefeatedNoDamagePoints + HeadshotPoints + GuardJustPoints + JustAvoidPoints;

			totalExperience += Math.min(2*DefeatPoints, PointSum);
		}
		return totalExperience;
	},
	getEnemyTiers(totalExperience){
		var currentEnemyTiers=[];
		for(var i=0; i<this.ENEMY_TIERS.length; i++){
			for(var j=0; j<this.ENEMY_TIERS[i].length; j++){
				if(totalExperience>=this.ENEMY_TIERS[i][j][1]){
					currentEnemyTiers.push(this.ENEMY_TIERS[i][j][0]);
					break;
				}
			}
		}
		return currentEnemyTiers;
	},

	SCALING_DATA:{
		'Enemy_Wizzrobe_Electric':{Points:5,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Wizzrobe_Fire':{Points:5,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Wizzrobe_Ice':{Points:5,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Golem_Junior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Giant_Junior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Assassin_Middle':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Bokoblin_Senior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Wizzrobe_Electric_Senior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Wizzrobe_Fire_Senior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Wizzrobe_Ice_Senior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Moriblin_Senior':{Points:18,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lizalfos_Electric':{Points:20,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lizalfos_Ice':{Points:20,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lizalfos_Fire':{Points:20,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lizalfos_Senior':{Points:20,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Giant_Bone':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Giant_Middle':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Bokoblin_Dark':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Golem_Middle':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Golem_Senior':{Points:30,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Golem_Fort_A':{Points:20,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Golem_Fire':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Golem_Ice':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Giant_Senior':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Moriblin_Dark':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lizalfos_Dark':{Points:40,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lynel_Junior':{Points:50,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lynel_Middle':{Points:60,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lynel_Senior':{Points:80,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Lynel_Dark':{Points:120,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Ganondorf_Miasma':{Points:800,MaxNum:10,BossPlayerSkillPointRate:0.1},
		'Enemy_Zonau_Robot_Senior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Zonau_Golem_Senior':{Points:20,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Zonau_Robot_Dark':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Zonau_Golem_Dark':{Points:40,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Horablin_Senior':{Points:18,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Horablin_Dark':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Bokoblin_Boss_Junior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Bokoblin_Boss_Middle':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Bokoblin_Boss_Senior':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Bokoblin_Boss_Dark':{Points:50,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Zonau_BlockMaster_Junior':{Points:15,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Zonau_BlockMaster_Middle':{Points:25,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Zonau_BlockMaster_Senior':{Points:35,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Drake_Mix':{Points:180,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Drake_Fire':{Points:150,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Drake_Ice':{Points:150,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Drake_Electric':{Points:150,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_MiddleBoss_Goron':{Points:100,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_LikeLike_Tar':{Points:100,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_DungeonBoss_Rito':{Points:300,MaxNum:2,BossPlayerSkillPointRate:0.1},
		'Enemy_DungeonBoss_Goron':{Points:300,MaxNum:2,BossPlayerSkillPointRate:0.1},
		'Enemy_DungeonBoss_Zora':{Points:300,MaxNum:2,BossPlayerSkillPointRate:0.1},
		'Enemy_DungeonBoss_Gerudo':{Points:300,MaxNum:2,BossPlayerSkillPointRate:0.1},
		'Enemy_DungeonBoss_Zonau':{Points:300,MaxNum:2,BossPlayerSkillPointRate:0.1},
		'Enemy_Mogurudo_Junior':{Points:30,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Mogurudo_Middle':{Points:50,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Mogurudo_Senior':{Points:70,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_PhantomGanon':{Points:30,MaxNum:10,BossPlayerSkillPointRate:1},
		'MiasmaSwarm':{Points:40,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_Sandworm':{Points:50,MaxNum:10,BossPlayerSkillPointRate:1},
		'Enemy_DungeonBoss_Rito_Underground':{Points:100,MaxNum:2,BossPlayerSkillPointRate:1},
		'Enemy_DungeonBoss_Goron_Underground':{Points:100,MaxNum:2,BossPlayerSkillPointRate:1},
		'Enemy_DungeonBoss_Zora_Underground':{Points:100,MaxNum:2,BossPlayerSkillPointRate:1},
		'Enemy_DungeonBoss_Gerudo_Underground':{Points:100,MaxNum:2,BossPlayerSkillPointRate:1}
	},
	
	ENEMY_TIERS:[
		[
			['Soldier Construct IV', 3400],
			['Soldier Construct III', 1700],
			['Soldier Construct II', 500],
			['Soldier Construct I', 0]
		],[
			['Captain Construct IV', 4800],
			['Captain Construct III', 2600],
			['Captain Construct II', 900],
			['Captain Construct I', 0]
		],[
			['Silver Bokoblin', 3400],
			['Black Bokoblin', 1700],
			['Blue Bokoblin', 800],
			['Bokoblin', 0]
		],[
			['Silver Moblin', 5200],
			['Black Moblin', 2900],
			['Blue Moblin', 1000],
			['Moblin', 0]
		],[
			['Silver Lizalfos', 5400],
			['Black Lizalfos', 3000],
			['Blue Lizalfos', 1700],
			['Lizalfos', 0]
		],[
			['Silver Horriblin', 4700],
			['Black Horriblin', 2600],
			['Blue Horriblin', 900],
			['Horriblin', 0]
		],[
			['Silver Boss Bokoblin', 5400],
			['Black Boss Bokoblin', 3800],
			['Blue Boss Bokoblin', 2700],
			['Boss Bokoblin', 0]
		],[
			['Silver Lynel', 8100],
			['White-Maned Lynel', 5500],
			['Blue-Maned Lynel', 3800],
			['Lynel', 0]
		],[
			['Silver Lynel (Armored)', 8400],
			['White-Maned Lynel (Armored)', 5600],
			['Blue-Maned Lynel (Armored)', 3900],
			['Lynel (Armored)', 0]
		]
	],

	countPristineWeapons:function(){
		return this.BROKEN_WEAPON_HASHES.length - Completism._count(this.BROKEN_WEAPON_HASHES, 0);
	},
	getMissingPristineWeapons:function(){
		var missing=[];
		for(var decayedWeaponId in Equipment.WEAPONS_DECAYED_TO_PRISTINE){
			var variable=new Variable('EquipmentDeathCount.'+decayedWeaponId, 'Int');
			if(variable.value<1){
				missing.push(Equipment.WEAPONS_DECAYED_TO_PRISTINE[decayedWeaponId]);
			}
		}
		return missing;
	},
	resetGhostStatuesSeeds:function(){
		var nChanges=0;
		for(var i=0; i<this.PRISTINE_STATUES_SEEDS.length; i++){
			var variable=new Variable(this.PRISTINE_STATUES_SEEDS[i], 'Int');
			if(variable.value){
				variable.value=0;
				variable.save();
				nChanges++;
			}
		}
		return nChanges;
	},

	BROKEN_WEAPON_HASHES:[//EquipmentDeathCount.
		0x39f93a30, // Weapon_Sword_106 (Traveler's Sword, decayed) --> Weapon_Sword_001 (pristine)
		0xa9f00300, // Weapon_Sword_112 (Soldier's Broadsword, decayed) --> Weapon_Sword_002 (pristine)
		0x50557318, // Weapon_Sword_113 (Knight's Broadsword, decayed) --> Weapon_Sword_003 (pristine)
		0x27d807b0, // Weapon_Sword_124 (Royal Broadsword, decayed) --> Weapon_Sword_024 (pristine)
		0x3dc96502, // Weapon_Sword_125 (Forest Dweller's Sword, decayed) --> Weapon_Sword_025 (pristine)
		0x1435013c, // Weapon_Sword_127 (Zora Sword, decayed) --> Weapon_Sword_027 (pristine)
		0xd6211a3b, // Weapon_Sword_129 (Gerudo Scimitar, decayed) --> Weapon_Sword_029 (pristine)
		0x47bbf37a, // Weapon_Sword_131 (Feathered Edge, decayed) --> Weapon_Sword_031 (pristine)
		0xb9fa308b, // Weapon_Sword_114 (Eightfold Blade, decayed) --> Weapon_Sword_041 (pristine)
		0x200311fb, // Weapon_Sword_147 (Royal Guard's Sword, decayed) --> Weapon_Sword_047 (pristine)
		0x416e7439, // Weapon_Sword_168 (Wooden Stick, decayed) --> Weapon_Sword_103 (pristine)

		0x6147a3f3, // Weapon_Lsword_106 (Traveler's Claymore, decayed) --> Weapon_Lsword_001 (pristine)
		0x2b53b900, // Weapon_Lsword_112 (Soldier's Claymore, decayed) --> Weapon_Lsword_002 (pristine)
		0x51eb5232, // Weapon_Lsword_113 (Knight's Claymore, decayed) --> Weapon_Lsword_003 (pristine)
		0x2a3c5306, // Weapon_Lsword_124 (Royal Claymore, decayed) --> Weapon_Lsword_024 (pristine)
		0x82bc5fce, // Weapon_Lsword_127 (Zora Longsword, decayed) --> Weapon_Lsword_027 (pristine)
		0x52d62303, // Weapon_Lsword_129 (Gerudo Claymore, decayed) --> Weapon_Lsword_029 (pristine)
		0xe8605be0, // Weapon_Lsword_136 (Cobble Crusher, decayed) --> Weapon_Lsword_036 (pristine)
		0xefc0b908, // Weapon_Lsword_114 (Eightfold Longblade, decayed) --> Weapon_Lsword_041 (pristine)
		0x8d861fa2, // Weapon_Lsword_147 (Royal Guard's Claymore, decayed) --> Weapon_Lsword_047 (pristine)
		0x9a67c31d, // Weapon_Lsword_168 (Thick Stick, decayed) --> Weapon_Lsword_103 (pristine)
		0x48978e2e, // Weapon_Lsword_174 (Giant Boomerang, decayed) --> Weapon_Lsword_051 (pristine)

		0x59b92288, // Weapon_Spear_106 (Traveler's Spear, decayed) --> Weapon_Spear_001 (pristine)
		0xa358c1f3, // Weapon_Spear_112 (Soldier's Spear, decayed) --> Weapon_Spear_002 (pristine)
		0x798d8d3c, // Weapon_Spear_113 (Knight's Halberd, decayed) --> Weapon_Spear_003 (pristine)
		0xc65605d6, // Weapon_Spear_124 (Royal Halberd, decayed) --> Weapon_Spear_024 (pristine)
		0xe5fc7340, // Weapon_Spear_125 (Forest Dweller's Spear, decayed) --> Weapon_Spear_025 (pristine)
		0x87217bec, // Weapon_Spear_127 (Zora Spear, decayed) --> Weapon_Spear_027 (pristine)
		0x07d3d4a7, // Weapon_Spear_129 (Gerudo Spear, decayed) --> Weapon_Spear_029 (pristine)
		0x4f8754a9, // Weapon_Spear_173 (Throwing Spear, decayed) --> Weapon_Spear_030 (pristine)
		0xe58b15d2, // Weapon_Spear_132 (Feathered Spear, decayed) --> Weapon_Spear_032 (pristine)
		0x82847dee, // Weapon_Spear_147 (Royal Guard's Spear, decayed) --> Weapon_Spear_047 (pristine)
		0x70be2851, // Weapon_Spear_168 (Long Stick, decayed) --> Weapon_Spear_103 (pristine)
	],

	PRISTINE_STATUES_SEEDS:[
		//MinusFieldGhostRandomSeed.
		0x3aea33b1, 0x37121d69, 0xb80ff3f2, 0xe93d56f0, 0xee1701a0, 0x5cf16947, 0x2da90fab, 0x94c3f7fb,
		0x3cc60295, 0x8c658c7b, 0xa8a9f5e8, 0xed23e2b6, 0x2b0ef11e, 0xdcb68cec, 0x5065c9ad, 0x0d4abe4c,
		0x8f632978, 0xab85c738, 0x1c3ef78f, 0x7868ba13, 0x72ee5025, 0x88a05c7b, 0x0d6a54a9, 0x0233065b,
		0x5ba61931, 0x79d9f53f, 0xaab604e1, 0x42a4027d, 0x123771fd, 0x11dc347c, 0x7973cb66, 0x2e311871,
		0x4404ff9a, 0x9145ea9e, 0x418306c5, 0xb0b35fee, 0xd4e6ea3c, 0x81c7d9e0, 0x730f6786, 0x0082a5d1,
		0x60227c8d, 0x97d249fd, 0xe2f4db0b, 0x1efc0a6f, 0x291e9388, 0x64fb43e9, 0x5c30ed65, 0x724e2ce0,
		0x90aac754, 0x0a04af23, 0x159dedce, 0x2656044e, 0xf37611ea, 0xbd396531, 0xe3d90df8, 0x2058117b,
		0x3685344a, 0x276a57d4, 0xab5e1f4d, 0x266753b6, 0x5dcf249f, 0xcf27b249, 0x07a510f3, 0xfa6f5249,
		0xa8e8cefb, 0x0a6c170a, 0xfa95d6d4, 0xe85147c8, 0x29d068a1, 0x6ef6e288, 0x80c42fcc, 0x06abfe1e,
		0x2da51738, 0x47b033be, 0x0a42e8a4, 0x04a0f26e, 0x6bda1464, 0x44457635, 0x812aa486, 0x39de9493,
		0x90221156, 0x06001794, 0x36a69f9d, 0x5e0d1779, 0xd0a40681, 0x63363e17, 0x62172557, 0xe19b60ba,
		0x6fc7622b, 0xb55472bd, 0xa8740a5b, 0xe9898ad5, 0xc37bf200, 0x1c991652, 0xa0c08bee, 0x52dd8e08,
		0x7a34f411, 0xde8dbba4, 0x2f285d51, 0xbd8cd52d, 0xb2a5cc5f, 0x2d8cdf92, 0x1a7f2eca, 0x38aa24b7,
		0xe7770604, 0x38d57f14, 0x609fcec4, 0x9afd8db8, 0x7e336176, 0x5fb7b25d, 0x8e46b0f6, 0x3c3a456f,
		0x8a0d35fe, 0x1c040fdc, 0xc5f9cf9b, 0xba5fa0f9, 0xe06f8afc, 0x22441a59, 0x38f001eb, 0x14a7b808,
		0xa3f1bc45, 0x6be133e6, 0x355eff16, 0x9254c909, 0x00099636, 0x9235cda3, 0x1979c01d, 0xf259e388,
		0xb3d39dc0, 0xa286be5f, 0x8f861a62, 0xea8875f1, 0x37bc2c0f, 0x70539632, 0x7a777984, 0x9419ff56,
		0x5d0efd1c, 0x3f303687, 0xfbe4919c, 0xc5ba679c, 0x8e415040, 0x21ff30d1, 0x3b7eece4, 0x7dc46bc3,
		0x39e575cc, 0x9760b152, 0x55fc1269, 0xd9a25576, 0xdc005497, 0xe6930155, 0x7299e972, 0xd3764c73,
		0x3b2833b6, 0x88ee2a89, 0xfd5aabbe, 0x63887a57, 0xef95ab0b, 0x4c18db00, 0x25f21cd5, 0x26d6b964,
		0x04e3198b, 0x26057007, 0x8af73e1e, 0x7fcf320c, 0x2c94bea3, 0x981bb25b, 0xe2d3c500, 0xeca2be78,
		0x045192fa, 0xa1afde1c, 0xcf7c7b18, 0xcf9048c1, 0xd4a90db2, 0xe1153091, 0x4fde58e1, 0x441b4917,
		0x5b524e49, 0xc1397883, 0x04635eba, 0xaf0bf5b5, 0x8b259120, 0xcd84fc53, 0x30940f1f, 0x09675b4e,
		0x764e6b14, 0x3320f162, 0x96b08adb, 0xa9a147d1, 0x71c730e0, 0x36075839, 0xb016b82e, 0x7969c911,
		0x03567ffc, 0x7e2b0354, 0xb5c9ae66, 0xd318e275, 0x1bdf50ba, 0x28b7ab62, 0x6aeb77fa, 0x27eb3584,
		0x550dd1ca, 0xd7235376, 0x8c45ec5c, 0x000a3a34, 0x1a10053d, 0x0495d437, 0xb3aa45b1, 0xed6a6d2a,
		0x6c706369, 0xad3d3aa0, 0x470be4d2, 0x2bb23289, 0x5d780d03, 0xe779116b, 0xfb971e11, 0x4e3377f8,
		0x2df278f7, 0x06f5848c, 0xab182590, 0x5c78db0a, 0x93f55f84, 0xc60cd8dd, 0x3067aac2, 0x8b8d9c29,
		0x87460c50, 0x778ac55a, 0xbf99c8f0, 0x7c7ee810, 0x3da01e13, 0x7dbcfefb, 0x4bcf1a08, 0x9436189e,
		0xaa285bf6, 0xa1342cef, 0x4d9959ce, 0x2e50d7a0, 0x0ef59066, 0xbf794365, 0x7b09e66e, 0x0c21cd08,
		0xf1ff55d1, 0xf7eed3ab, 0x354aa09d, 0x393e0c0d, 0x87380693, 0x26c11853, 0x75a5c803, 0x4bde422b,
		0x7378538f, 0x78422122, 0x42173b04, 0x09f34555, 0x3b0a4355, 0x0a92489f, 0x9b57679d, 0xbb582416,
		0x34f5a1dd, 0xd689ad18, 0x98a6f970, 0x85c6e936, 0x723db2ee, 0xdc4e0b5c, 0xd4b200ad, 0x86fadb63,
		0x5104397e, 0x01aeb2ed, 0x39109750, 0xb6267f06, 0xdfd7ce61, 0xaa1f0585, 0x73ef52f5, 0x5cafcece,
		0xdae10b4b, 0x8bfbc84c, 0x3e57fb03, 0x198b19e4, 0x673fb0fa, 0x0bbc5c49, 0x19727e8d, 0x20410b79,
		0xc56ca216, 0x974e819d, 0x62c7ee11, 0x62adb452, 0x03330e92, 0x2448bfac, 0x4eba25cc, 0x80aeff05,
		0x2c094899, 0x04e0f0f9, 0x52f0c03b, 0xaaf8abc3, 0xd25397b0, 0x06032090, 0xeef5a1b6, 0xd4a2e078,
		0x32d34f36, 0xa381bb82, 0x4f655557, 0x25e7f4d5, 0x6810a9df, 0x97d13b04, 0xf0e37fe0, 0x8206ed6e,
		0x13454995, 0x779dd392, 0x3167767d, 0x9962603e, 0x48524e61, 0x78e4d49c, 0xae49689c, 0x65492753,
		0x7a5044a7, 0xa20d7a09, 0x95e901c6, 0x2c94d1e4, 0x78f81eae, 0x13ba4f27, 0x2c47639b, 0x35ea79a2,
		0x92d9cb10, 0xe6ac7bfe, 0x4372af82, 0x9a7ea123, 0xbc387fdc, 0xf0305196, 0x241d60ae, 0xc9dc2f98,
		0x8c8b611c, 0x2861cfa1, 0xe02145be, 0xb134be6d, 0x7707028a, 0x429f444b, 0x2ac36489, 0x366a6373,
		0x68f003dd, 0xbe7eb0d2, 0x855ecc08, 0x649a7364, 0x8d90ae28, 0x000cd06c, 0x2b9ade0d, 0x95709686,
		0x9ead961f, 0xe0c14df7, 0x3b4a75a6, 0x0cae23ae, 0x843165e7, 0xcb9d8e37, 0xd86957ea, 0xf09d3942,
		0xe681fd24, 0xef678ceb, 0xb179c924, 0x00c5481e, 0x1deef256, 0x3f665829, 0x147ddcd4, 0xa8ef87f3,
		0x129eb5d9, 0x3ccfc84f, 0xf73f83bb, 0x6d8b9c11, 0xb4b22f2c, 0x7db0b46f, 0x9203dfdd, 0x6bc9b42d,
		0xe9538df0, 0x8dfe95ba, 0x62653cd5, 0x8473bacd, 0xf9348d12, 0x1a11ae55, 0x4ce29075, 0x78acf047,
		0x3b80ecf8, 0x0fb1e070, 0x9afcfb9e, 0xd50bc1b5, 0x1e54b30d, 0x57ff8019, 0x450abad7, 0x179f9f5e,
		0x8fd56cb3, 0x149f2948, 0x521ac3a4, 0xfe6b6cb0, 0x7383b3aa, 0x8324c098, 0x692bfb86, 0x141b4ec8,
		0x249fa1cf, 0x7dc9bcbc, 0xabf62253, 0xbe97679b, 0x17b0f517, 0x34ecbf84, 0x2520af77, 0x5d3faa84,
		0xda9a7798, 0x04e6027a, 0x58edfb1c, 0xb676607a, 0xeede2df8, 0xc1e00f64, 0xee137f5d, 0xec9525ae,
		0x7dcd1867, 0xc65217c9, 0x732fe6a2, 0x6eed47c4, 0xb1498939, 0x30679165, 0xbb05e5fb, 0x4c8c0142,
		0xa02c0606, 0x58040c83, 0x5910390b, 0x4e57cff9, 0xe3b5f6f3, 0xafe64032, 0x38ff35f3, 0x37f24e41,
		0x7c17d85d, 0x8c712f8f, 0xa12d806c, 0x49f1ecd1, 0x429c3f96, 0xcfa6417f, 0x2f83065d, 0x729d5326,
		0x22ea6a1e, 0xad8cb09a, 0x34b988af, 0x1b2ca7c5, 0x8e6c8850, 0xd27f717d, 0x36fdd1e2, 0xbde91683,
		0x2c4f7f83, 0x49eb44b8, 0x9237773f, 0x6ad6421e, 0x599b8532, 0x2e28e54c, 0x4d8009e4, 0x8f1bbcaa,
		0x6b1c16ae, 0xe19ad47a, 0x7ad38f0e, 0x4f697011, 0x34ebdd45, 0x6290e23c, 0x96e122f6, 0x20cf735a,
		0xc554926e, 0x4740c1f0, 0xdbf7e672, 0x1f665fad, 0x0525b650, 0x85dd48d4, 0x77ee42e7, 0xc5d5b8e6,
		0xe2eb4bea, 0xfc4678b9, 0x0e1bd7ff, 0x195a91ad, 0xc772396e, 0x27836967, 0xdf30efab, 0x00cffd75,
		0x6d2d4243, 0xd3e61365, 0x86a37eab, 0xdd50cd83, 0xb71cb6ce, 0x56e40aaf, 0x859701ca, 0xcffbee40,
		0xa3e587c9, 0x7688fc58, 0x048421ba, 0xbafe74ad, 0x815f47cb, 0x5f50341d, 0x0dfd2d58, 0x8476adbb,
		0x254368b0, 0x1717f4b4, 0x2c732bda, 0x9c091654, 0xd1cae118, 0x3c97b686, 0x6756b5f4, 0x7375ac92,
		0x84ecfc69, 0x6157c84b, 0xadc75224, 0xf056a37c, 0x0b469c30, 0x0bdaec95, 0x9c166a9b, 0xb18c82bb,
		0x2ed75a14, 0x37e38383, 0x098c6458, 0x5e8023a0, 0xedaf28ed, 0x2c78e899, 0x113bfe06, 0xe30455ef,
		0x342d7a14, 0x5b785906, 0x971e4abb, 0x2708920a, 0x85b65cbc, 0x405ef5b6, 0xd9152297, 0x3782b8f7,
		0x1f2e85dd, 0x246c3b17, 0x02608837, 0x55b7085c, 0xd1d58c4d, 0xef6da56a, 0xf181bcc6, 0xa236491c,
		0xf429703f, 0xc12238eb, 0xa3cd2b5e, 0x4a2a6e29, 0xa85fd376, 0x0f2986d2, 0xbb70da57, 0xacf70f6e,
		0xcd3029b0, 0xea347ed0, 0x35229e89, 0x182e3b57, 0x9520d9ee, 0x6af1fc5c, 0xe9afc5e9, 0x67bd4f2a,
		0xc8a28bb3, 0xf425c3d4, 0xd48bd7bf, 0x695e5695, 0xffe64fd2, 0x85e6ff71, 0x525e7e13, 0x96b7d88a,
		0x18b69172, 0x7e239f6d, 0x80df50a2, 0x85a56e12, 0x06e82557, 0x207cb48f, 0xac35ed51, 0xec016d31,
		0x74338ede, 0x193bdf7e, 0x486fd9b9, 0x22472334, 0xc50935ca, 0x8c5f125d, 0xeacd70d1, 0x69152e68,
		0x663834bc, 0x04b96f50, 0xe738f5c4, 0xb98dd8fc, 0x9e4405b4, 0xb9803f7d, 0x115366c3, 0x58fcab5c,
		0xeca98944, 0x50859c27, 0x6022e202, 0xff308b6a, 0x72661ed3, 0xbf509be3, 0x82c6ffc7, 0x7a1952ef,
		0x331993e9, 0x220e5150, 0x94039b4e, 0x7760231d, 0x770abc65, 0xc4e3fafe, 0xdc6b1070, 0x2a241138,
		0xebba89b5, 0x6244b1ab, 0xe396c21e, 0x5581b239, 0x59b07f02, 0x1507c911, 0xd2cbe915, 0x1ad2e3e5,
		0xa134efd2, 0x783c8838, 0xf294339e, 0x08802f30, 0x779b4f35, 0xab37cc46, 0x0ff1b04a, 0x37909370,
		0x5679cde5, 0xba9ea1dd, 0x90b1b69e, 0x46bff276, 0xf55979bf, 0x924d945c, 0xb8d93ce4, 0x69335f64,
		0x2e6e2ec0, 0x92c86cc7, 0x469dd3b9, 0xe34fd540, 0xe5aadf47, 0xd1a5856b, 0xc89419f2, 0xab7bd5db,
		0xaa2998f1, 0x8b841077, 0x49cb8db4, 0x90b01ed8, 0x36d71775, 0x6225a2b1, 0x2a613bfd, 0xb678ffc4,
		0x8bc24500, 0x4490b5b7, 0x36ba410d, 0x0b7bea88, 0xb4055bb0, 0x10bc4e4c, 0x2199676f, 0xd7b14382,
		0xe06047b4, 0xfe96b6f0, 0x3bc361e3, 0xa91363a7, 0x9a4a748f, 0xe7373cc3, 0x1644bb42, 0x2a027273,
		0xc931e865, 0xf986e936, 0xe245cab2, 0x56669750, 0xee792882, 0xef8334af, 0x54336857, 0xa65b282d,
		0x1edf7e04, 0xb1ce48b3, 0x3fc2069f, 0xb8afa49c, 0x743ebe8d, 0x014b001b, 0xea96db10, 0x84a41bba,
		0x9328c470, 0x3614ed85, 0xbab3ecfd, 0x80f54d8f, 0x12738644, 0xb28d8705, 0x72efec21, 0xeb63cedb,
		0xf2113294, 0x62728ace, 0x80bc3a1c, 0xcb058401, 0x66b4e81b, 0x914be5af, 0x702b01c8
	]
};
