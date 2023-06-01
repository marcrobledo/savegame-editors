/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Schematics class) v20230601

	by Marc Robledo 2023
*/

var Schematics={
	count:function(){
		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Schematics.HASHES_FOUND);
		for(var i=0; i<Schematics.HASHES_FOUND.length; i++){
			var val=tempFile.readU32(offsets[Schematics.HASHES_FOUND[i]]);
			if(val===1)
				count++;
			else if(val!==0)
				console.error('invalid schematics clear value: '+val);
		}
		return count;
	},
	setAllAsFound:function(){
		var countStone=0;
		var countYiga=0;
		var offsets=SavegameEditor._getOffsetsByHashes(Schematics.HASHES_FOUND);
		for(var i=0; i<Schematics.HASHES_FOUND.length; i++){
			var val=tempFile.readU32(offsets[Schematics.HASHES_FOUND[i]]);
			if(val!==1){
				tempFile.writeU32(offsets[Schematics.HASHES_FOUND[i]], 1);
				if(i<12)
					countStone++;
				else
					countYiga++;
			}
		}

		var count=countStone + countYiga;

		MarcDialogs.alert(count+' schematics set as found.');
		if(countStone)
			SavegameEditor.addItem('key', 'Obj_AutoBuilderDraft_00', countStone);
		if(countYiga)
			SavegameEditor.addItem('key', 'Obj_AutoBuilderDraftAssassin_00', countYiga);

		SavegameEditor.refreshSchematicsCounters();
		return count;
	},

	HASHES_FOUND:[
		//0xb5480ae1,0xf1a507d7,
		0x97e22bf9, //Fanplane (Schema stone)
		//0x6302b8aa,0x546b533c,
		0xa07798a6, //Rocket Platform (Schema stone)
		//0x1cf4716c,0x53362c01,
		0xaaacf14d, //Hovercraft (Schema stone)
		//0x8a6e4694,0x3d163460,
		0x345e7150, //Bolt Boat (Schema stone)
		//0xf2256caa,0x2ae0f886,
		0x5109695f, //Bridge (Schema stone)
		//0x924bfca6,0x94e32644,
		0x542b78f1, //Dirigible (Schema stone)
		//0x556e8d23,0xe464e10c,
		0x9f4ba799, //Instant Cannon (Schema stone)
		//0xbc0135a2,0x02423fe1,
		0x2abb2df0, //Instant Scaffold (Schema stone)
		//0x99005f15,0x91f259ea,
		0x0cbea150, //Launch Pad (Schema stone)
		//0x12847cf1,0xd169bf9e,
		0xb625e1fc, //Automated Ally (Schema stone)
		//0xe6f76475,0x10ba494b,
		0x127a75c9, //Hot-Air Balloon (Schema stone)
		//0x2f938a40,0x008da3ff,
		0x8fe4140a, //Beam Cycle (Schema stone)
		//0x5024b1fb,0xed077b03,
		0x0520dea7, //Tank
		//0x998094e0,0x7ad1f011,
		0xeee1492c, //Flamethower Balloon
		//0xd426b028,0x825295da,
		0x4ce68be6, //Three Wheeler
		//0x68054688,0xbcce4cb0,
		0x8ebfc267, //Fanboat
		//0xe9477c78,0x217d1cf6,
		0x6c8fca57, //Headlight Raft
		//0xf057847f,0x20b529a1,
		0x14fd96aa, //Beam Turret
		//0x4d3063d7,0xcb9a491b,
		0x3385b6c6, //Vertical Escape
		//0x0c99c31b,0x596bfd65,
		0x8476f277, //Cargo Carrier
		//0xbe15581e,0x3abe8a33,
		0xa7ce2e78, //Big Rig
		//0xb8bc2487,0x4306aff7,
		0xd7ac3fc8, //Water Freezer
		//0xaf5eb5d5,0xdc50e532,
		0x0cddddbf, //Liftoff Glider
		//0xdcef38a7,0x18e76632,
		0xb3752c42, //Shock Trap
		//0x01206662,0x3ca7cd44,
		0xa8707e8a, //Fishing Trawler
		//0xe4b9c7a7,0x41e03a46,
		0x5fadc4e3, //Wagon
		//0x3b4db9ae,0x49fd911a,
		0x260ad4d3, //Instant Kitchen
		//0xc1ca1a74,0x16dc3d32,
		0xa7bccf88, //Super Spring
		//0xbcdbfddb,0x7e336293,
		0xaf8870c6, //Sprinkler System
		//0xcc48723f,0x0e126f18,
		0xabc30ab3, //Icebreaker
		//0x358a3fbf,0x74545504,
		0x047dd1a3, //Aerial Cannon
		//0x4b6c2155,0x9b40811a,
		0x6206da4f, //Floodlights
		//0xa1c7a545,0x21c240bb,
		0x11f75220, //Instant Scaffold (Yiga schematic)
		//0x021e8d87,0x2b70c123,
		0xd3f712cc, //Monocycle
		//0xd10f8764,0x0b91c831,
		0xfba73b41, //Raiding Plane
		//0x9f6e72f9,0x9a98c516,
		0x97c52512, //Bomb Bouquet
		//0x703b6513,0x69e31bea,
		0xee3db7d1, //Triple Cannon
		//0x809df141,0x0243bfe9,
		0x41b07b33, //Scatter Trap
		//0xaab0f0c1,0xf2d47a4f,
		0x45f95172, //Smoke Rocket
		//0xba20825f,0xa33489ed,
		0xbe350fdb, //Charged Charger
		//0xe91f1583,0xbe367566,
		0x499afa5b, //Rainmaker
		//0x2b3c1844,0x36abdcc0,
		0x732c5985, //Whirling Basher
		//0xd3119d9b,0x97e77394,
		0x3f9f61fd, //All-Purpose Raft
		//0x175eeee0,0xb0ad2b0f,
		0x7708c653, //Excavator
		//0xdadf7f9a,0x5e9f5609,
		0x29bcade1, //Assault Cart
		//0xc71fe378,0x00d72a7d,
		0x7f86e965 //Beam Spinner
	],
	
	COORDINATES:[
		[-821, -523-105, 1940], //Fanplane (Schema stone) {original: [-821, -1940, -523]}
		[-3480, -417-105, -1883], //Rocket Platform (Schema stone)
		[-3846, -487-105, 2941], //Hovercraft (Schema stone)
		[3257, -750-105, -593], //Bolt Boat (Schema stone)
		[3562, -588-105, 2209], //Bridge (Schema stone)
		[2946, -453-105, 3338], //Dirigible (Schema stone)
		[3986, -576-105, -1583], //Instant Cannon (Schema stone)
		[-3403, -482-105, 222], //Instant Scaffold (Schema stone)
		[1796, -629-105, 1226], //Launch Pad (Schema stone)
		[1641, -824-105, -2397], //Automated Ally (Schema stone)
		[-256, 20-105, -153], //Hot-Air Balloon (Schema stone)
		[-1122, 101-105, 1902], //Beam Cycle (Schema stone)
		[3261, -657-105, 1445], //Tank
		[-2822, -565-105, -902], //Flamethower Balloon
		[-1856, -527-105, 735], //Three Wheeler
		[-3075, -913-105, 1580], //Fanboat
		[4112, -611-105, -3215], //Headlight Raft
		[-2409, -394-105, 3485], //Beam Turret
		[-3262, -494-105, 3780], //Vertical Escape
		[-1332, -597-105, -1496], //Cargo Carrier
		[2667, -591-105, -1578], //Big Rig
		[417, -498-105, 3673], //Water Freezer
		[2963, -507-105, 2571], //Liftoff Glider
		[-2694, -467-105, 2882], //Shock Trap
		[-397, -623-105, -1776], //Fishing Trawler
		[3606, -478-105, -2281], //Wagon
		[1168, -408-105, -600], //Instant Kitchen
		[2542, -476-105, 544], //Super Spring
		[-1903, -682-105, -2095], //Sprinkler System
		[3618, -455-105, 569], //Icebreaker
		[-130, -634-105, -2867], //Aerial Cannon
		[-2865, -931-105, -2918], //Floodlights
		[-3210, -475-105, 2473], //Instant Scaffold (Yiga schematic)
		[-1225, -480-105, 2611], //Monocycle
		[-4546, -489-105, 2170], //Raiding Plane
		[-1620, -482-105, -247], //Bomb Bouquet
		[4412, -709-105, -637], //Triple Cannon
		[2078, -464-105, 1625], //Scatter Trap
		[-4457, -861-105, 994], //Smoke Rocket
		[622, -540-105, -3698], //Charged Charger
		[1539, -439-105, -692], //Rainmaker
		[-1751, -679-105, -3107], //Whirling Basher
		[-3380, -619-105, -665], //All-Purpose Raft
		[-3708, -782-105, -3099], //Excavator
		[3273, -660-105, -3697], //Assault Cart
		[246, -486-105, 2170] //Beam Spinner
	]
};
