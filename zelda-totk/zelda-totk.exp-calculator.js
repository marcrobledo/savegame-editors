/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Experience calculator) v20230616

	by Marc Robledo 2023
	research & information compiled by Echocolat and Phil
*/


const ExperienceCalculator={
	calculate(){
		var totalExperience=0;
		for(actorName in this.SCALING_DATA){
			// All data for this actor
			var Points = this.SCALING_DATA[actorName].Points;
			var MaxNum = this.SCALING_DATA[actorName].MaxNum;
			var BossPlayerSkillPointRate = this.SCALING_DATA[actorName].BossPlayerSkillPointRate;

			// Save file variable strings
			var data=SavegameEditor._readStruct(
				[
					{hash:'DefeatedEnemyNum.' + actorName, type:'Int'},
					{hash:'EnemyBattleData.' + actorName + '.DefeatedNoDamageCount', type:'Int'},
					{hash:'EnemyBattleData.' + actorName + '.HeadShotCount', type:'Int'},
					{hash:'EnemyBattleData.' + actorName + '.GuardJustCount', type:'Int'},
					{hash:'EnemyBattleData.' + actorName + '.JustAvoidCount', type:'Int'}
				]
			);
			var DefeatedEnemyNum = data['DefeatedEnemyNum.' + actorName];
			var DefeatedNoDamageCount = data['EnemyBattleData.' + actorName + '.DefeatedNoDamageCount'];
			var HeadShotCount = data['EnemyBattleData.' + actorName + '.HeadShotCount'];
			var GuardJustCount = data['EnemyBattleData.' + actorName + '.GuardJustCount'];
			var JustAvoidCount = data['EnemyBattleData.' + actorName + '.JustAvoidCount'];
			
			// Formulas
			var DefeatPoints = Math.min(DefeatedEnemyNum, MaxNum)*Points;

			var DefeatedNoDamagePoints = Math.min(2*DefeatedEnemyNum, DefeatedNoDamageCount)*Points*0.5*BossPlayerSkillPointRate;
			var HeadshotPoints = Math.min(2*DefeatedEnemyNum, HeadShotCount)*Points*0.5*BossPlayerSkillPointRate;
			var GuardJustPoints = Math.min(1*DefeatedEnemyNum, GuardJustCount)*Points*1*BossPlayerSkillPointRate;
			var JustAvoidPoints = Math.min(1*DefeatedEnemyNum, JustAvoidCount)*Points*1*BossPlayerSkillPointRate;

			var PointSum = DefeatPoints + DefeatedNoDamagePoints + HeadshotPoints + GuardJustPoints + JustAvoidPoints;

			totalExperience += Math.min(2*MaxNum*Points, PointSum);
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
	generateHashes(){
		var hashes=[];
		for(actorName in this.SCALING_DATA){
			hashes.push(murmurHash3.x86.hash32('DefeatedEnemyNum.' + actorName));
			hashes.push(murmurHash3.x86.hash32('EnemyBattleData.' + actorName + '.DefeatedNoDamageCount'));
			hashes.push(murmurHash3.x86.hash32('EnemyBattleData.' + actorName + '.HeadShotCount'));
			hashes.push(murmurHash3.x86.hash32('EnemyBattleData.' + actorName + '.GuardJustCount'));
			hashes.push(murmurHash3.x86.hash32('EnemyBattleData.' + actorName + '.JustAvoidCount'));
		}
		return hashes;
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
	]
};