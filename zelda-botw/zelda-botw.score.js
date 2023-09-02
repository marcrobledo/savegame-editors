/*
	The legend of Zelda: Breath of the wild Savegame Editor (Experience/score calculation) v20230708

	by cutecryptid 2019

	based on https://www.reddit.com/r/Breath_of_the_Wild/comments/8fchiq/about_difficulty_scaling_for_enemies_and_weapons/
*/


var BOTWScoreCalculator=(function(){
	const ENEMY_POINTS={
		Defeated_Enemy_Wizzrobe_Electric_Num: 5.0,
		Defeated_Enemy_Wizzrobe_Fire_Num: 5.0,
		Defeated_Enemy_Wizzrobe_Ice_Num: 5.0,
		Defeated_Enemy_Guardian_A_Fixed_Moss_Num: 12.0,
		Defeated_Enemy_Golem_Junior_Num: 15.0,
		Defeated_Enemy_Giant_Junior_Num: 15.0,
		Defeated_Enemy_Assassin_Middle_Num: 15.0,
		Defeated_Enemy_Bokoblin_Senior_Num: 15.0,
		Defeated_Enemy_Wizzrobe_Ice_Senior_Num: 15.0,
		Defeated_Enemy_Wizzrobe_Fire_Senior_Num: 15.0,
		Defeated_Enemy_Wizzrobe_Electric_Senior_Num: 15.0,
		Defeated_RemainsFire_Drone_A_01_Num: 15.0,
		Defeated_Enemy_Moriblin_Senior_Num: 18.0,
		Defeated_Enemy_Guardian_Mini_Middle_Num: 20.0,
		Defeated_Enemy_Lizalfos_Electric_Num: 20.0,
		Defeated_Enemy_Lizalfos_Ice_Num: 20.0,
		Defeated_Enemy_Lizalfos_Senior_Num: 20.0,
		Defeated_Enemy_Lizalfos_Fire_Num: 20.0,
		Defeated_Enemy_Bokoblin_Gold_Num: 25.0,
		Defeated_Enemy_Giant_Bone_Num: 25.0,
		Defeated_Enemy_Bokoblin_Dark_Num: 25.0,
		Defeated_Enemy_Golem_Middle_Num: 25.0,
		Defeated_Enemy_Giant_Middle_Num: 25.0,
		Defeated_Enemy_Golem_Senior_Num: 30.0,
		Defeated_Enemy_Golem_Fire_Num: 35.0,
		Defeated_Enemy_Moriblin_Gold_Num: 35.0,
		Defeated_Enemy_Guardian_Mini_Senior_Num: 35.0,
		Defeated_Enemy_Guardian_B_Num: 35.0,
		Defeated_Enemy_Golem_Ice_Num: 35.0,
		Defeated_Enemy_Moriblin_Dark_Num: 35.0,
		Defeated_Enemy_Golem_Fire_R_Num: 35.0,
		Defeated_Enemy_Giant_Senior_Num: 35.0,
		Defeated_Enemy_Lizalfos_Dark_Num: 40.0,
		Defeated_Enemy_Lizalfos_Gold_Num: 40.0,
		Defeated_Enemy_SandwormR_Num: 50.0,
		Defeated_Enemy_Guardian_A_Num: 50.0,
		Defeated_Enemy_Guardian_C_Num: 50.0,
		Defeated_Enemy_Sandworm_Num: 50.0,
		Defeated_Enemy_Lynel_Junior_Num: 50.0,
		Defeated_Enemy_Lynel_Middle_Num: 60.0,
		Defeated_Enemy_Lynel_Senior_Num: 80.0,
		Defeated_Enemy_Assassin_Senior_Num: 100.0,
		Defeated_Enemy_Lynel_Gold_Num: 120.0,
		Defeated_Enemy_Lynel_Dark_Num: 120.0,
		Defeated_Enemy_SiteBoss_Lsword_Num: 300.0,
		Defeated_Enemy_SiteBoss_Spear_Num: 300.0,
		Defeated_Enemy_SiteBoss_Sword_Num: 300.0,
		Defeated_Enemy_SiteBoss_Bow_Num: 300.0,
		Defeated_Priest_Boss_Normal_Num: 500.0,
		Defeated_Enemy_GanonBeast_Num: 800.0
	};



	/* crc32 from https://stackoverflow.com/a/18639999 */
	const CRC32_TABLE=(function(){
		var c;
		var crcTable = [];
		for(var n =0; n < 256; n++){
			c = n;
			for(var k =0; k < 8; k++){
				c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
			}
			crcTable[n] = c;
		}
		return crcTable;
	}());

	var crc32=function(str){
		var crc = 0 ^ (-1);

		for (var i = 0; i < str.length; i++ ) {
			crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ str.charCodeAt(i)) & 0xFF];
		}

		return (crc ^ (-1)) >>> 0;
	};


	var findHashesIn;

	return {
		calculate:function(){
			if(!findHashesIn){
				findHashesIn=[];
				Object.keys(ENEMY_POINTS).forEach(function(hashId){
					findHashesIn[crc32(hashId)]=ENEMY_POINTS[hashId];
				});
			}

			var scaleScore = 0
			var previousHashValue=0;
			for(var i=0x0c; i<tempFile.fileSize-4; i+=8){
				var hashValue=tempFile.readU32(i);

				if(hashValue===previousHashValue)
					continue;
				previousHashValue=hashValue;

				if(findHashesIn[hashValue]){
					defeated = tempFile.readU32(i+4);
					enepoints = findHashesIn[hashValue];
					scaleScore += enepoints*defeated;
				}
			}

			return scaleScore;
		}
	}
}());