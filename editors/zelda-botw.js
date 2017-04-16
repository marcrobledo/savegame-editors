/*
	The legend of Zelda: Breath of the wild v20170416b
	by Marc Robledo 2017
*/

var currentBOTWItem=0;
SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',

	/* Constants */
	Constants:{
		MAX_ITEMS:410,

		STRING_SIZE:0x80,

		HORSE_REINS:[
			'GameRomHorseReins_00',
			'GameRomHorseReins_01',
			'GameRomHorseReins_02',
			'GameRomHorseReins_03',
			'GameRomHorseReins_04',
			'GameRomHorseReins_05',
			'GameRomHorseReins_06', /* Epona? */
			'GameRomHorseReins_00L'
		],
		HORSE_SADDLES:[
			'GameRomHorseSaddle_00',
			'GameRomHorseSaddle_01',
			'GameRomHorseSaddle_02',
			'GameRomHorseSaddle_03',
			'GameRomHorseSaddle_04',
			'GameRomHorseSaddle_05',
			'GameRomHorseSaddle_06', /* Epona? */
			'GameRomHorseSaddle_00L',
			'GameRomHorseSaddle_00S',
		],
		HORSE_TYPES:[
			'GameRomHorse00',
			'GameRomHorse01',
			'GameRomHorse02',
			'GameRomHorse03',
			'GameRomHorse04',
			'GameRomHorse05',
			'GameRomHorse06',
			'GameRomHorse07',
			'GameRomHorse08',
			'GameRomHorse09',
			'GameRomHorse10',
			'GameRomHorse11',
			'GameRomHorse12',
			'GameRomHorse13',
			'GameRomHorse14',
			'GameRomHorse15',
			'GameRomHorse16',
			'GameRomHorse17',
			'GameRomHorse18',
			'GameRomHorse19',
			'GameRomHorse20',
			'GameRomHorse21',
			'GameRomHorse22',
			'GameRomHorse23',
			'GameRomHorseEpona',
			'GameRomHorseZelda',
			'GameRomHorse00L',
			'GameRomHorseNushi',
			'GameRomHorseBone'
		],
	},
	Offsets1_0:{
		RUPEES:0xe0a0,
		MONS:0x0bc480,
		ITEMS:0x52988,
		ITEMS_QUANTITY:0x063358,

		MOD_WEAPON_TYPES:0x050328,
		MOD_WEAPON_VALUES:0x0a9ca8,
		MOD_BOW_TYPES:0x45f0,
		MOD_BOW_VALUES:0x0a8e0,
		MOD_SHIELD_TYPES:0x0b5810,
		MOD_SHIELD_VALUES:0x063218,

		HORSE_SADDLES:0x3d0e8,
		HORSE_REINS:0x60508,
		HORSE_NAMES:0x70320,
		HORSE_MANES:0xa6478,
		HORSE_TYPES:0xb46f8,
		HORSE_BONDS:0xc3670,

		KOROK_SEED_COUNTER:0x76148
	},
	Offsets1_1:{
		RUPEES:0xe110,
		MONS:0x0bc558,
		ITEMS:0x0528d8,
		ITEMS_QUANTITY:0x0633f0,

		MOD_WEAPON_TYPES:0x0503d8,
		MOD_WEAPON_VALUES:0x0a9d78,
		MOD_BOW_TYPES:0x45f8,
		MOD_BOW_VALUES:0x0a940,
		MOD_SHIELD_TYPES:0x0b58e8,
		MOD_SHIELD_VALUES:0x0632c8,
		
		HORSE_SADDLES:0x3d190,
		HORSE_REINS:0x605b8,
		HORSE_NAMES:0x703c0,
		HORSE_MANES:0xa6538,
		HORSE_TYPES:0xb47d8,
		HORSE_BONDS:0xc3738, /* max=0x3f80 */

		KOROK_SEED_COUNTER:0x761f8
	},

	/* item list extracted from https://github.com/joffnerd/botw-trainer/blob/master/items.json , thank you! */
	Translations:[
{id:'weapons',items:{
Weapon_Sword_001:"Traveler's Sword",
Weapon_Sword_002:"Soldier's Broadsword",
Weapon_Sword_003:"Knight's Broadsword",
Weapon_Sword_004:"Boko Club",
Weapon_Sword_005:"Spiked Boko Club",
Weapon_Sword_006:"Dragonbone Boko Club",
Weapon_Sword_007:"Lizal Boomerand",
Weapon_Sword_008:"Lizal Forked Boomerang",
Weapon_Sword_009:"Lizal Tri-Boomerang",
Weapon_Sword_013:"Guardian Sword",
Weapon_Sword_014:"Guardian Sword+",
Weapon_Sword_015:"Guardian Sword++",
Weapon_Sword_016:"Lynel Sword",
Weapon_Sword_017:"Mighty Lynel Sword",
Weapon_Sword_018:"Savage Lynel Sword",
Weapon_Sword_019:"Bokoblin Arm",
Weapon_Sword_020:"Lizalfos Arm",
Weapon_Sword_021:"Rusty Broadsword",
Weapon_Sword_022:"Soup ladle",
Weapon_Sword_023:"Ancient Short Sword",
Weapon_Sword_024:"Royal Broadsword",
Weapon_Sword_025:"Forest Dweller's Sword",
Weapon_Sword_027:"Zora Sword",
Weapon_Sword_029:"Gerudo Scimitar",
Weapon_Sword_030:"Moonlight Scimitar",
Weapon_Sword_031:"Feathered Edge",
Weapon_Sword_033:"Flameblade",
Weapon_Sword_034:"Frostblade",
Weapon_Sword_035:"Thunderblade",
Weapon_Sword_040:"Spring-Loaded Hammer",
Weapon_Sword_041:"Eightfold Blade",
Weapon_Sword_043:"Torch",
Weapon_Sword_044:"Tree Branch",
Weapon_Sword_047:"Royal Guard's Sword",
Weapon_Sword_048:"Meteor Rod",
Weapon_Sword_049:"Blizzard Rod",
Weapon_Sword_050:"Thunderstorm Rod",
Weapon_Sword_051:"Boomerang",
Weapon_Sword_052:"Scimitar of the Seven",
Weapon_Sword_053:"Vicious Sickle",
Weapon_Sword_056:"Master Sword (Broken/Unequippable)",
Weapon_Sword_057:"Goddess Sword",
Weapon_Sword_058:"Hero's Sword (8-bit Link)",
Weapon_Sword_059:"Sea-Breeze Boomerang (Wind Waker)",
Weapon_Sword_060:"Fire Rod",
Weapon_Sword_061:"Ice Rod",
Weapon_Sword_062:"Lightning Rod",
Weapon_Sword_070:"Master Sword",
Weapon_Sword_071:"Master Sword (no near malice, no charge)",
Weapon_Sword_072:"Master Sword (near malice, no charge)",
Weapon_Sword_073:"Demon Carver",
Weapon_Sword_500:"Lantern",
Weapon_Lsword_001:"Traveler's Claymore",
Weapon_Lsword_002:"Soldier's Claymore",
Weapon_Lsword_003:"Knight's Claymore",
Weapon_Lsword_004:"Boko Bat",
Weapon_Lsword_005:"Spiked Boko Bat",
Weapon_Lsword_006:"Dragonbone Boko Bat",
Weapon_Lsword_010:"Moblin Club",
Weapon_Lsword_011:"Spiked Moblin Club",
Weapon_Lsword_012:"Dragonbone Moblin Club",
Weapon_Lsword_013:"Ancient Battle Axe",
Weapon_Lsword_014:"Ancient Battle Axe+",
Weapon_Lsword_015:"Ancient Battle Axe++",
Weapon_Lsword_016:"Lynel Crusher",
Weapon_Lsword_017:"Mighty Lynel Crusher",
Weapon_Lsword_018:"Savage Lynel Crusher",
Weapon_Lsword_019:"Moblin Arm",
Weapon_Lsword_020:"Rusty Claymore",
Weapon_Lsword_023:"Ancient Bladesaw",
Weapon_Lsword_024:"Royal Claymore",
Weapon_Lsword_027:"Silver Longsword",
Weapon_Lsword_029:"Golden Claymore",
Weapon_Lsword_030:"Double Axe",
Weapon_Lsword_031:"Iron Sledgehammer",
Weapon_Lsword_032:"Woodcutter's Axe",
Weapon_Lsword_033:"Great Flameblade",
Weapon_Lsword_034:"Great Frostblade",
Weapon_Lsword_035:"Great Thunderblade",
Weapon_Lsword_036:"Cobble Crusher",
Weapon_Lsword_037:"Stone Smasher",
Weapon_Lsword_038:"Boat Oar",
Weapon_Lsword_041:"Eightfold Longblade",
Weapon_Lsword_045:"Farming Hoe",
Weapon_Lsword_047:"Royal Guard's Claymore",
Weapon_Lsword_051:"Giant Boomerang",
Weapon_Lsword_054:"Boulder Breaker",
Weapon_Lsword_055:"Edge of Duality",
Weapon_Lsword_056:"Korok Leaf",
Weapon_Lsword_057:"Sword of the Six Sages (Twilight Princess)",
Weapon_Lsword_059:"Biggoron's Sword (Ocarina of Time)",
Weapon_Lsword_060:"Fierce Deity Sword (Majora's Mask)",
Weapon_Lsword_074:"Windcleaver",
Weapon_Spear_001:"Traveler's Spear",
Weapon_Spear_002:"Soldier's Spear",
Weapon_Spear_003:"Knight's Halberd",
Weapon_Spear_004:"Boko Spear",
Weapon_Spear_005:"Spiked Boko Spear",
Weapon_Spear_006:"Dragonbone Boko Spear",
Weapon_Spear_007:"Lizal Spear",
Weapon_Spear_008:"Enhanced Lizal Spear",
Weapon_Spear_009:"Forked Lizal Spear",
Weapon_Spear_010:"Moblin Spear",
Weapon_Spear_011:"Spiked Moblin Spear",
Weapon_Spear_012:"Dragonbone Moblin Spear",
Weapon_Spear_013:"Guardian Spear",
Weapon_Spear_014:"Guardian Spear+",
Weapon_Spear_015:"Guardian Spear++",
Weapon_Spear_016:"Lynel Spear",
Weapon_Spear_017:"Mighty Lynel Spear",
Weapon_Spear_018:"Savage Lynel Spear",
Weapon_Spear_021:"Rusty Halberd",
Weapon_Spear_022:"Farmer's Pichfork",
Weapon_Spear_023:"Ancient Spear",
Weapon_Spear_024:"Royal Halberd",
Weapon_Spear_025:"Forest Dweller's Spear",
Weapon_Spear_027:"Zora Spear",
Weapon_Spear_028:"Silverscale Spear",
Weapon_Spear_029:"Gerudo Spear",
Weapon_Spear_030:"Throwing Spear",
Weapon_Spear_031:"Drillshaft",
Weapon_Spear_032:"Feathered Spear",
Weapon_Spear_033:"Flamespear",
Weapon_Spear_034:"Frostspear",
Weapon_Spear_035:"Thunderspear",
Weapon_Spear_036:"Wooden Mop",
Weapon_Spear_037:"Serpentine Spear",
Weapon_Spear_038:"Fishing Harpoon",
Weapon_Spear_047:"Royal Guard's Spear",
Weapon_Spear_049:"Ceremonial Trident",
Weapon_Spear_050:"Lightscale Trident"
}},

{id:'bows',items:{
Weapon_Bow_001:"Traveler's Bow",
Weapon_Bow_002:"Soldier's Bow",
Weapon_Bow_003:"Spiked Boko Bow",
Weapon_Bow_004:"Boko Bow",
Weapon_Bow_006:"Lizal Bow",
Weapon_Bow_009:"Lynel Bow",
Weapon_Bow_011:"Strengthened Lizal Bow",
Weapon_Bow_013:"Forest Dweller's Bow",
Weapon_Bow_014:"Silver Bow",
Weapon_Bow_015:"Golden Bow",
Weapon_Bow_016:"Swallow Bow",
Weapon_Bow_017:"Falcon Bow",
Weapon_Bow_023:"Ancient Bow",
Weapon_Bow_026:"Mighty Lynel Bow",
Weapon_Bow_027:"Dragon Bone Boko Bow",
Weapon_Bow_028:"Great Eagle Bow",
Weapon_Bow_029:"Phrenic Bow",
Weapon_Bow_030:"Steel Lizal Bow",
Weapon_Bow_032:"Savage Lynel Bow",
Weapon_Bow_033:"Royal Guard's Bow",
Weapon_Bow_035:"Knight's Bow",
Weapon_Bow_036:"Royal Bow",
Weapon_Bow_038:"Wooden Bow",
Weapon_Bow_040:"Duplex Bow",
Weapon_Bow_071:"Bow of Light",
Weapon_Bow_072:"Twilight Bow (Twilight Princess)",
NormalArrow:"Arrow",
FireArrow:"Fire Arrow",
IceArrow:"Ice Arrow",
ElectricArrow:"Shock Arrow",
BombArrow_A:"Bomb Arrow",
AncientArrow:"Ancient Arrow"
}},

{id:'shields',items:{
Weapon_Shield_001:"Wooden Shield",
Weapon_Shield_002:"Soldier's Shield",
Weapon_Shield_003:"Knight's Shield",
Weapon_Shield_004:"Boko Shield",
Weapon_Shield_005:"Spiked Boko Shield",
Weapon_Shield_006:"Dragonbone Boko Shield",
Weapon_Shield_007:"Lizal Shield",
Weapon_Shield_008:"Reinforced Lizal Shield",
Weapon_Shield_009:"Steel Lizal Shield",
Weapon_Shield_013:"Guardian Shield",
Weapon_Shield_014:"Guardian Shield+",
Weapon_Shield_015:"Guardian Shield++",
Weapon_Shield_016:"Lynel Shield",
Weapon_Shield_017:"Mighty Lynel Shield",
Weapon_Shield_018:"Savage Lynel Shield",
Weapon_Shield_021:"Rusty Shield",
Weapon_Shield_022:"Royal Shield",
Weapon_Shield_023:"Forest Dweller's Shield",
Weapon_Shield_025:"Silver Shield",
Weapon_Shield_026:"Gerudo Shield",
Weapon_Shield_030:"Hylian Shield",
Weapon_Shield_031:"Hunter's Shield",
Weapon_Shield_032:"Fisherman's Shield",
Weapon_Shield_033:"Royal Guard's Shield",
Weapon_Shield_034:"Emblazoned Shield",
Weapon_Shield_035:"Traveler's Shield",
Weapon_Shield_036:"Radiant Shield",
Weapon_Shield_037:"Daybreaker",
Weapon_Shield_038:"Ancient Shield",
Weapon_Shield_040:"Pot Lid",
Weapon_Shield_041:"Shield of the Mind's Eye",
Weapon_Shield_042:"Kite Shield",
Weapon_Shield_057:"Hero's Shield (Wind Waker)"
}},

{id:'clothes',items:{
Armor_001_Head:"Hylian Hood",
Armor_002_Head:"Hylian Hood ★",
Armor_003_Head:"Hylian Hood ★★",
Armor_004_Head:"Hylian Hood ★★★",
Armor_015_Head:"Hylian Hood ★★★★",
Armor_001_Upper:"Hylian Tunic",
Armor_002_Upper:"Hylian Tunic ★",
Armor_003_Upper:"Hylian Tunic ★★",
Armor_004_Upper:"Hylian Tunic ★★★",
Armor_015_Upper:"Hylian Tunic ★★★★",
Armor_001_Lower:"Hylian Trousers",
Armor_002_Lower:"Hylian Trousers ★",
Armor_003_Lower:"Hylian Trousers ★★",
Armor_004_Lower:"Hylian Trousers ★★★",
Armor_015_Lower:"Hylian Trousers ★★★★",
Armor_005_Head:"Cap of the Wild",
Armor_035_Head:"Cap of the Wild ★",
Armor_039_Head:"Cap of the Wild ★★",
Armor_060_Head:"Cap of the Wild ★★★",
Armor_061_Head:"Cap of the Wild ★★★★",
Armor_005_Upper:"Tunic of the Wild",
Armor_035_Upper:"Tunic of the Wild ★",
Armor_039_Upper:"Tunic of the Wild ★★",
Armor_060_Upper:"Tunic of the Wild ★★★",
Armor_061_Upper:"Tunic of the Wild ★★★★",
Armor_005_Lower:"Trousers of the Wild",
Armor_035_Lower:"Trousers of the Wild ★",
Armor_039_Lower:"Trousers of the Wild ★★",
Armor_060_Lower:"Trousers of the Wild ★★★",
Armor_061_Lower:"Trousers of the Wild ★★★★",
Armor_006_Head:"Zora Helm",
Armor_007_Head:"Zora Helm ★",
Armor_062_Head:"Zora Helm ★★",
Armor_063_Head:"Zora Helm ★★★",
Armor_064_Head:"Zora Helm ★★★★",
Armor_006_Upper:"Zora Armor",
Armor_007_Upper:"Zora Armor ★",
Armor_062_Upper:"Zora Armor ★★",
Armor_063_Upper:"Zora Armor ★★★",
Armor_064_Upper:"Zora Armor ★★★★",
Armor_006_Lower:"Zora Greaves",
Armor_007_Lower:"Zora Greaves ★",
Armor_062_Lower:"Zora Greaves ★★",
Armor_063_Lower:"Zora Greaves ★★★",
Armor_064_Lower:"Zora Greaves ★★★★",
Armor_008_Head:"Desert Voe Headband",
Armor_040_Head:"Desert Voe Headband ★",
Armor_065_Head:"Desert Voe Headband ★★",
Armor_066_Head:"Desert Voe Headband ★★★",
Armor_067_Head:"Desert Voe Headband ★★★★",
Armor_008_Upper:"Desert Voe Spaulder",
Armor_040_Upper:"Desert Voe Spaulder ★",
Armor_065_Upper:"Desert Voe Spaulder ★★",
Armor_066_Upper:"Desert Voe Spaulder ★★★",
Armor_067_Upper:"Desert Voe Spaulder ★★★★",
Armor_008_Lower:"Desert Voe Trousers",
Armor_040_Lower:"Desert Voe Trousers ★",
Armor_065_Lower:"Desert Voe Trousers ★★",
Armor_066_Lower:"Desert Voe Trousers ★★★",
Armor_067_Lower:"Desert Voe Trousers ★★★★",
Armor_009_Head:"Snowquill Headdress",
Armor_036_Head:"Snowquill Headdress ★",
Armor_071_Head:"Snowquill Headdress ★★",
Armor_072_Head:"Snowquill Headdress ★★★",
Armor_073_Head:"Snowquill Headdress ★★★★",
Armor_009_Upper:"Snowquill Tunic",
Armor_036_Upper:"Snowquill Tunic ★",
Armor_071_Upper:"Snowquill Tunic ★★",
Armor_072_Upper:"Snowquill Tunic ★★★",
Armor_073_Upper:"Snowquill Tunic ★★★★",
Armor_009_Lower:"Snowquill Trousers",
Armor_036_Lower:"Snowquill Trousers ★",
Armor_071_Lower:"Snowquill Trousers ★★",
Armor_072_Lower:"Snowquill Trousers ★★★",
Armor_073_Lower:"Snowquill Trousers ★★★★",
Armor_011_Head:"Flamebreaker Helm",
Armor_037_Head:"Flamebreaker Helm ★",
Armor_074_Head:"Flamebreaker Helm ★★",
Armor_075_Head:"Flamebreaker Helm ★★★",
Armor_076_Head:"Flamebreaker Helm ★★★★",
Armor_011_Upper:"Flamebreaker Armor",
Armor_037_Upper:"Flamebreaker Armor ★",
Armor_074_Upper:"Flamebreaker Armor ★★",
Armor_075_Upper:"Flamebreaker Armor ★★★",
Armor_076_Upper:"Flamebreaker Armor ★★★★",
Armor_011_Lower:"Flamebreaker Boots",
Armor_037_Lower:"Flamebreaker Boots ★",
Armor_074_Lower:"Flamebreaker Boots ★★",
Armor_075_Lower:"Flamebreaker Boots ★★★",
Armor_076_Lower:"Flamebreaker Boots ★★★★",
Armor_012_Head:"Stealth Mask",
Armor_042_Head:"Stealth Mask ★",
Armor_077_Head:"Stealth Mask ★★",
Armor_078_Head:"Stealth Mask ★★★",
Armor_079_Head:"Stealth Mask ★★★★",
Armor_012_Upper:"Stealth Chest Guard",
Armor_042_Upper:"Stealth Chest Guard ★",
Armor_077_Upper:"Stealth Chest Guard ★★",
Armor_078_Upper:"Stealth Chest Guard ★★★",
Armor_079_Upper:"Stealth Chest Guard ★★★★",
Armor_012_Lower:"Stealth Tights",
Armor_042_Lower:"Stealth Tights ★",
Armor_077_Lower:"Stealth Tights ★★",
Armor_078_Lower:"Stealth Tights ★★★",
Armor_079_Lower:"Stealth Tights ★★★★",
Armor_014_Head:"Climber's Bandanna",
Armor_083_Head:"Climber's Bandanna ★",
Armor_084_Head:"Climber's Bandanna ★★",
Armor_085_Head:"Climber's Bandanna ★★★",
Armor_086_Head:"Climber's Bandanna ★★★★",
Armor_014_Upper:"Climbing Gear",
Armor_083_Upper:"Climbing Gear ★",
Armor_084_Upper:"Climbing Gear ★★",
Armor_085_Upper:"Climbing Gear ★★★",
Armor_086_Upper:"Climbing Gear ★★★★",
Armor_014_Lower:"Climbing Boots",
Armor_083_Lower:"Climbing Boots ★",
Armor_084_Lower:"Climbing Boots ★★",
Armor_085_Lower:"Climbing Boots ★★★",
Armor_086_Lower:"Climbing Boots ★★★★",
Armor_017_Head:"Radiant Mask",
Armor_087_Head:"Radiant Mask ★",
Armor_088_Head:"Radiant Mask ★★",
Armor_089_Head:"Radiant Mask ★★★",
Armor_090_Head:"Radiant Mask ★★★★",
Armor_017_Upper:"Radiant Shirt",
Armor_087_Upper:"Radiant Shirt ★",
Armor_088_Upper:"Radiant Shirt ★★",
Armor_089_Upper:"Radiant Shirt ★★★",
Armor_090_Upper:"Radiant Shirt ★★★★",
Armor_017_Lower:"Radiant Tights",
Armor_087_Lower:"Radiant Tights ★",
Armor_088_Lower:"Radiant Tights ★★",
Armor_089_Lower:"Radiant Tights ★★★",
Armor_090_Lower:"Radiant Tights ★★★★",
Armor_020_Head:"Soldier's Helm",
Armor_095_Head:"Soldier's Helm ★",
Armor_096_Head:"Soldier's Helm ★★",
Armor_097_Head:"Soldier's Helm ★★★",
Armor_098_Head:"Soldier's Helm ★★★★",
Armor_020_Upper:"Soldier's Armor",
Armor_095_Upper:"Soldier's Armor ★",
Armor_096_Upper:"Soldier's Armor ★★",
Armor_097_Upper:"Soldier's Armor ★★★",
Armor_098_Upper:"Soldier's Armor ★★★★",
Armor_020_Lower:"Soldier's Greaves",
Armor_095_Lower:"Soldier's Greaves ★",
Armor_096_Lower:"Soldier's Greaves ★★",
Armor_097_Lower:"Soldier's Greaves ★★★",
Armor_098_Lower:"Soldier's Greaves ★★★★",
Armor_021_Head:"Ancient Helm",
Armor_099_Head:"Ancient Helm ★",
Armor_100_Head:"Ancient Helm ★★",
Armor_101_Head:"Ancient Helm ★★★",
Armor_102_Head:"Ancient Helm ★★★★",
Armor_021_Upper:"Ancient Cuirass",
Armor_099_Upper:"Ancient Cuirass ★",
Armor_100_Upper:"Ancient Cuirass ★★",
Armor_101_Upper:"Ancient Cuirass ★★★",
Armor_102_Upper:"Ancient Cuirass ★★★★",
Armor_021_Lower:"Ancient Greaves",
Armor_099_Lower:"Ancient Greaves ★",
Armor_100_Lower:"Ancient Greaves ★★",
Armor_101_Lower:"Ancient Greaves ★★★",
Armor_102_Lower:"Ancient Greaves ★★★★",
Armor_022_Head:"Bokoblin Mask",
Armor_043_Upper:"Old Shirt",
Armor_043_Lower:"Well-Worn Trousers",
Armor_044_Upper:"Warm Doublet",
Armor_045_Head:"Moblin Mask",
Armor_046_Head:"Rubber Helm",
Armor_103_Head:"Rubber Helm ★",
Armor_104_Head:"Rubber Helm ★★",
Armor_105_Head:"Rubber Helm ★★★",
Armor_106_Head:"Rubber Helm ★★★★",
Armor_046_Upper:"Rubber Armor",
Armor_103_Upper:"Rubber Armor ★",
Armor_104_Upper:"Rubber Armor ★★",
Armor_105_Upper:"Rubber Armor ★★★",
Armor_106_Upper:"Rubber Armor ★★★★",
Armor_046_Lower:"Rubber Tights",
Armor_103_Lower:"Rubber Tights ★",
Armor_104_Lower:"Rubber Tights ★★",
Armor_105_Lower:"Rubber Tights ★★★",
Armor_106_Lower:"Rubber Tights ★★★★",
Armor_048_Head:"Barbarian Helm",
Armor_111_Head:"Barbarian Helm ★",
Armor_112_Head:"Barbarian Helm ★★",
Armor_113_Head:"Barbarian Helm ★★★",
Armor_114_Head:"Barbarian Helm ★★★★",
Armor_048_Upper:"Barbarian Armor",
Armor_111_Upper:"Barbarian Armor ★",
Armor_112_Upper:"Barbarian Armor ★★",
Armor_113_Upper:"Barbarian Armor ★★★",
Armor_114_Upper:"Barbarian Armor ★★★★",
Armor_048_Lower:"Barbarian Wraps",
Armor_111_Lower:"Barbarian Wraps ★",
Armor_112_Lower:"Barbarian Wraps ★★",
Armor_113_Lower:"Barbarian Wraps ★★★",
Armor_114_Lower:"Barbarian Wraps ★★★★",
Armor_053_Head:"Gerudo Veil",
Armor_053_Upper:"Gerudo Top",
Armor_053_Lower:"Gerudo Sirwal",
Armor_055_Head:"Lizalfos Mask",
Armor_056_Head:"Lynel Mask",
Armor_115_Head:"Thunder Helm",
Armor_024_Head:"Diamond Circlet",
Armor_117_Head:"Diamond Circlet ★",
Armor_118_Head:"Diamond Circlet ★★",
Armor_119_Head:"Diamond Circlet ★★★",
Armor_120_Head:"Diamond Circlet ★★★★",
Armor_025_Head:"Ruby Circlet",
Armor_121_Head:"Ruby Circlet ★",
Armor_122_Head:"Ruby Circlet ★★",
Armor_123_Head:"Ruby Circlet ★★★",
Armor_124_Head:"Ruby Circlet ★★★★",
Armor_026_Head:"Sapphire Circlet",
Armor_125_Head:"Sapphire Circlet ★",
Armor_126_Head:"Sapphire Circlet ★★",
Armor_127_Head:"Sapphire Circlet ★★★",
Armor_128_Head:"Sapphire Circlet ★★★★",
Armor_027_Head:"Topaz Earrings",
Armor_129_Head:"Topaz Earrings ★",
Armor_130_Head:"Topaz Earrings ★★",
Armor_131_Head:"Topaz Earrings ★★★",
Armor_132_Head:"Topaz Earrings ★★★★",
Armor_028_Head:"Opal Earrings",
Armor_133_Head:"Opal Earrings ★",
Armor_134_Head:"Opal Earrings ★★",
Armor_135_Head:"Opal Earrings ★★★",
Armor_136_Head:"Opal Earrings ★★★★",
Armor_029_Head:"Amber Earrings",
Armor_137_Head:"Amber Earrings ★",
Armor_138_Head:"Amber Earrings ★★",
Armor_139_Head:"Amber Earrings ★★★",
Armor_140_Head:"Amber Earrings ★★★★",
Armor_116_Upper:"Champion's Tunic",
Armor_148_Upper:"Champion's Tunic ★",
Armor_149_Upper:"Champion's Tunic ★★",
Armor_150_Upper:"Champion's Tunic ★★★",
Armor_151_Upper:"Champion's Tunic ★★★★",
Armor_049_Lower:"Sand Boots",
Armor_152_Lower:"Sand Boots ★",
Armor_153_Lower:"Sand Boots ★★",
Armor_154_Lower:"Sand Boots ★★★",
Armor_155_Lower:"Sand Boots ★★★★",
Armor_140_Lower:"Snow Boots",
Armor_141_Lower:"Snow Boots",
Armor_156_Lower:"Snow Boots ★",
Armor_157_Lower:"Snow Boots ★★",
Armor_158_Lower:"Snow Boots ★★★",
Armor_159_Lower:"Snow Boots ★★★★",
Armor_160_Head:"Dark Hood",
Armor_160_Upper:"Dark Tunic",
Armor_160_Lower:"Dark Trousers",
Armor_170_Upper:"Nintendo Switch Shirt",
Armor_200_Head:"Cap of Time",
Armor_201_Head:"Cap of Time ★",
Armor_202_Head:"Cap of Time ★★",
Armor_203_Head:"Cap of Time ★★★",
Armor_204_Head:"Cap of Time ★★★★",
Armor_200_Upper:"Tunic of Time",
Armor_201_Upper:"Tunic of Time ★",
Armor_202_Upper:"Tunic of Time ★★",
Armor_203_Upper:"Tunic of Time ★★★",
Armor_204_Upper:"Tunic of Time ★★★★",
Armor_200_Lower:"Trousers of Time",
Armor_201_Lower:"Trousers of Time ★",
Armor_202_Lower:"Trousers of Time ★★",
Armor_203_Lower:"Trousers of Time ★★★",
Armor_204_Lower:"Trousers of Time ★★★★",
Armor_205_Head:"Cap of Wind",
Armor_206_Head:"Cap of Wind ★",
Armor_207_Head:"Cap of Wind ★★",
Armor_208_Head:"Cap of Wind ★★★",
Armor_209_Head:"Cap of Wind ★★★★",
Armor_205_Upper:"Tunic of Wind",
Armor_206_Upper:"Tunic of Wind ★",
Armor_207_Upper:"Tunic of Wind ★★",
Armor_208_Upper:"Tunic of Wind ★★★",
Armor_209_Upper:"Tunic of Wind ★★★★",
Armor_205_Lower:"Trousers of Wind",
Armor_206_Lower:"Trousers of Wind ★",
Armor_207_Lower:"Trousers of Wind ★★",
Armor_208_Lower:"Trousers of Wind ★★★",
Armor_209_Lower:"Trousers of Wind ★★★★",
Armor_210_Head:"Cap of Twilight",
Armor_211_Head:"Cap of Twilight ★",
Armor_212_Head:"Cap of Twilight ★★",
Armor_213_Head:"Cap of Twilight ★★★",
Armor_214_Head:"Cap of Twilight ★★★★",
Armor_210_Upper:"Tunic of Twilight",
Armor_211_Upper:"Tunic of Twilight ★",
Armor_212_Upper:"Tunic of Twilight ★★",
Armor_213_Upper:"Tunic of Twilight ★★★",
Armor_214_Upper:"Tunic of Twilight ★★★★",
Armor_210_Lower:"Trousers of Twilight",
Armor_211_Lower:"Trousers of Twilight ★",
Armor_212_Lower:"Trousers of Twilight ★★",
Armor_213_Lower:"Trousers of Twilight ★★★",
Armor_214_Lower:"Trousers of Twilight ★★★★",
Armor_215_Head:"Cap of the Sky",
Armor_216_Head:"Cap of the Sky ★",
Armor_217_Head:"Cap of the Sky ★★",
Armor_218_Head:"Cap of the Sky ★★★",
Armor_219_Head:"Cap of the Sky ★★★★",
Armor_215_Upper:"Tunic of the Sky",
Armor_216_Upper:"Tunic of the Sky ★",
Armor_217_Upper:"Tunic of the Sky ★★",
Armor_218_Upper:"Tunic of the Sky ★★★",
Armor_219_Upper:"Tunic of the Sky ★★★★",
Armor_215_Lower:"Trousers of the Sky",
Armor_216_Lower:"Trousers of the Sky ★",
Armor_217_Lower:"Trousers of the Sky ★★",
Armor_218_Lower:"Trousers of the Sky ★★★",
Armor_219_Lower:"Trousers of the Sky ★★★★",
Armor_220_Head:"Sheik's Mask",
Armor_221_Head:"Sheik's Mask ★",
Armor_222_Head:"Sheik's Mask ★★",
Armor_223_Head:"Sheik's Mask ★★★",
Armor_224_Head:"Sheik's Mask ★★★★",
Armor_225_Head:"Fierce Deity's Mask",
Armor_226_Head:"Fierce Deity's Mask ★",
Armor_227_Head:"Fierce Deity's Mask ★★",
Armor_228_Head:"Fierce Deity's Mask ★★★",
Armor_229_Head:"Fierce Deity's Mask ★★★★",
Armor_225_Upper:"Fierce Deity's Armor",
Armor_226_Upper:"Fierce Deity's Armor ★",
Armor_227_Upper:"Fierce Deity's Armor ★★",
Armor_228_Upper:"Fierce Deity's Armor ★★★",
Armor_229_Upper:"Fierce Deity's Armor ★★★★",
Armor_225_Lower:"Fierce Deity's Boots",
Armor_226_Lower:"Fierce Deity's Boots ★",
Armor_227_Lower:"Fierce Deity's Boots ★★",
Armor_228_Lower:"Fierce Deity's Boots ★★★",
Armor_229_Lower:"Fierce Deity's Boots ★★★★",
Armor_230_Head:"Cap of the Hero",
Armor_231_Head:"Cap of the Hero ★",
Armor_232_Head:"Cap of the Hero ★★",
Armor_233_Head:"Cap of the Hero ★★★",
Armor_234_Head:"Cap of the Hero ★★★★",
Armor_230_Upper:"Tunic of the Hero",
Armor_231_Upper:"Tunic of the Hero ★",
Armor_232_Upper:"Tunic of the Hero ★★",
Armor_233_Upper:"Tunic of the Hero ★★★",
Armor_234_Upper:"Tunic of the Hero ★★★★",
Armor_230_Lower:"Trousers of the Hero",
Armor_231_Lower:"Trousers of the Hero ★",
Armor_232_Lower:"Trousers of the Hero ★★",
Armor_233_Lower:"Trousers of the Hero ★★★",
Armor_234_Lower:"Trousers of the Hero ★★★★",
Armor_500_Upper:"Mini?",
Armor_501_Lower:"Mini?",
Armor_501_Upper:"Mini?",
Armor_502_Upper:"Mini?"
}},

{id:'materials',items:{
Item_Fruit_A:"Apple",
Item_Fruit_B:"Wildberry",
Item_Fruit_C:"Voltfruit",
Item_Fruit_D:"Hearty Durian",
Item_Fruit_E:"Fleet-Lotus Seeds",
Item_Fruit_E_00:"Fleet-Lotus Seeds x0",
Item_Fruit_F:"Hydromelon",
Item_Fruit_G:"Palm Fruit",
Item_Fruit_H:"Mighty Bananas",
Item_Fruit_I:"Spicy Pepper",
Item_Fruit_J:"Fortified Pumpkin",
Item_Fruit_K:"Acorn",
Item_Fruit_L:"Chickaloo Tree Nut",
Item_Mushroom_A:"Stamella Mushroom",
Item_MushroomGet_A:"Stamella Mushroom",
Item_Mushroom_B:"Chillshroom",
Item_MushroomGet_B:"Chillshroom",
Item_Mushroom_C:"Sunshroom",
Item_MushroomGet_C:"Sunshroom",
Item_Mushroom_D:"Rushroom",
Item_MushroomGet_D:"Rushroom",
Item_Mushroom_E:"Hylian Mushroom",
Item_MushroomGet_E:"Hylian Mushroom",
Item_Mushroom_F:"Hearty Truffle",
Item_Mushroom_F_00:"Hearty Truffle x0",
Item_MushroomGet_F:"Hearty Truffle",
Item_Mushroom_H:"Zapshroom",
Item_MushroomGet_H:"Zapshroom",
Item_Mushroom_J:"Silent Shroom",
Item_MushroomGet_J:"Silent Shroom",
Item_Mushroom_L:"Razorshroom",
Item_MushroomGet_L:"Razorshroom",
Item_Mushroom_M:"Ironshroom",
Item_MushroomGet_M:"Ironshroom",
Item_Mushroom_N:"Big Hearty Truffle",
Item_MushroomGet_N:"Big Hearty Truffle",
Item_Mushroom_N_00:"Big Hearty Truffle x0",
Item_Mushroom_O:"Endura Shroom",
Item_MushroomGet_O:"Endura Shroom",
Item_Plant_A:"Hyrule Herb",
Item_PlantGet_A:"Hyrule Herb",
Item_Plant_B:"Hearty Radish",
Item_PlantGet_B:"Hearty Radish",
Item_Plant_C:"Big Hearty Radish",
Item_PlantGet_C:"Big Hearty Radish",
Item_Plant_E:"Cool Safflina",
Item_PlantGet_E:"Cool Safflina",
Item_Plant_F:"Warm Safflina",
Item_PlantGet_F:"Warm Safflina",
Item_Plant_G:"Mighty Thistle",
Item_PlantGet_G:"Mighty Thistle",
Item_Plant_H:"Armoranth",
Item_PlantGet_H:"Armoranth",
Item_Plant_I:"Blue Nightshade",
Item_PlantGet_I:"Blue Nightshade",
Item_Plant_J:"Silent Princess",
Item_PlantGet_J:"Silent Princess",
Item_Plant_L:"Electric Safflina",
Item_PlantGet_L:"Electric Safflina",
Item_Plant_M:"Swift Carrot",
Item_PlantGet_M:"Swift Carrot",
Item_Plant_O:"Swift Violet",
Item_PlantGet_O:"Swift Violet",
Item_Plant_Q:"Endura Carrot",
Item_PlantGet_Q:"Endura Carrot",
Item_Meat_01:"Raw Meat",
Item_Meat_02:"Raw Prime Meat",
Item_Meat_06:"Raw Bird Drumstick",
Item_Meat_07:"Raw Bird Thigh",
Item_Meat_11:"Raw Gourmet Meat",
Item_Meat_12:"Raw Whole Meat",
Item_FishGet_A:"Hylian Bass",
Item_FishGet_B:"Hearty Bass",
Item_FishGet_C:"Chillfin Trout",
Item_FishGet_D:"Voltfin Trout",
Item_FishGet_E:"Mighty Carp",
Item_FishGet_F:"Mighty Porgy",
Item_FishGet_G:"Armored Porgy",
Item_FishGet_H:"Armored Carp",
Item_FishGet_I:"Hearty Salmon",
Item_FishGet_J:"Sizzlefin Trout",
Item_FishGet_K:"Hearty Blueshell Snail",
Item_FishGet_L:"Staminoka Bass",
Item_FishGet_M:"Sneaky River Snail",
Item_FishGet_X:"Stealthfin Trout",
Item_FishGet_Z:"Sanke Carp",
Animal_Insect_A:"Hot-Footed Frog",
Item_InsectGet_A:"Hot-Footed Frog",
Animal_Insect_B:"Tireless Frog",
Item_InsectGet_B:"Tireless Frog",
Animal_Insect_C:"Cold Darner",
Item_InsectGet_C:"Cold Darner",
Animal_Insect_E:"Sunset Firefly",
Item_InsectGet_E:"Sunset Firefly",
Animal_Insect_F:"Fairy",
Item_InsectGet_F:"Fairy",
Animal_Insect_G:"Bladed Rhino Beetle",
Item_InsectGet_G:"Bladed Rhino Beetle",
Animal_Insect_H:"Restless Cricket",
Item_InsectGet_H:"Restless Cricket",
Animal_Insect_I:"Electric Darner",
Item_InsectGet_I:"Electric Darner",
Animal_Insect_K:"Razorclaw Crab",
Item_InsectGet_K:"Razorclaw Crab",
Animal_Insect_M:"Hearty Lizard",
Item_InsectGet_M:"Hearty Lizard",
Animal_Insect_N:"Winterwing Butterfly",
Item_InsectGet_N:"Winterwing Butterfly",
Animal_Insect_O:"Ironshell Crab",
Item_InsectGet_O:"Ironshell Crab",
Animal_Insect_P:"Rugged Rhino Beetle",
Item_InsectGet_P:"Rugged Rhino Beetle",
Animal_Insect_Q:"Summerwing Butterfly",
Item_InsectGet_Q:"Summerwing Butterfly",
Animal_Insect_R:"Thunderwing Butterfly",
Item_InsectGet_R:"Thunderwing Butterfly",
Animal_Insect_S:"Hightail Lizard",
Item_InsectGet_S:"Hightail Lizard",
Animal_Insect_T:"Warm Darner",
Item_InsectGet_T:"Warm Darner",
Animal_Insect_X:"Fireproof Lizard",
Item_InsectGet_X:"Fireproof Lizard",
Animal_Insect_Z:"Bright-Eyed Crab",
Item_InsectGet_Z:"Bright-Eyed Crab",
Animal_Insect_AA:"Energetic Rhino Beetle",
Item_InsectGet_AA:"Energetic Rhino Beetle",
Animal_Insect_AB:"Smotherwing Butterfly",
Item_InsectGet_AB:"Smotherwing Butterfly",
BeeHome:"Courser Bee Honey",
Obj_FireWoodBundle:"Wood",
Item_Enemy_00:"Bokoblin Horn",
Item_Enemy_01:"Bokoblin Fang",
Item_Enemy_02:"Bokoblin Guts",
Item_Enemy_03:"Lizalfos Horn",
Item_Enemy_04:"Lizalfos Talon",
Item_Enemy_05:"Lizalfos Tail",
Item_Enemy_06:"Moblin Horn",
Item_Enemy_07:"Moblin Fang",
Item_Enemy_08:"Moblin Guts",
Item_Enemy_12:"Lynel Horn",
Item_Enemy_13:"Lynel Hoof",
Item_Enemy_14:"Lynel Guts",
Item_Enemy_15:"Red Chuchu Jelly",
Item_Enemy_16:"Yellow Chuchu Jelly",
Item_Enemy_17:"White Chuchu Jelly",
Item_Enemy_18:"Keese Wing",
Item_Enemy_19:"Keese Eyeball",
Item_Enemy_20:"Octorok Tentacle",
Item_Enemy_21:"Tentacle Eyeball",
Item_Enemy_24:"Molduga Fin",
Item_Enemy_25:"Molduga Guts",
Item_Enemy_26:"Ancient Gear",
Item_Enemy_27:"Ancient Screw",
Item_Enemy_28:"Ancient Spring",
Item_Enemy_29:"Ancient Shaft",
Item_Enemy_30:"Ancient Core",
Item_Enemy_31:"Giant Ancient Core",
Item_Enemy_32:"Hinox Toenail",
Item_Enemy_33:"Hinox Tooth",
Item_Enemy_34:"Hinox Guts",
Item_Enemy_38:"Dinraal's Scale",
Item_Enemy_39:"Dinraal's Claw",
Item_Enemy_40:"Chuchu Jelly",
Item_Enemy_41:"Red Lizalfos Tail",
Item_Enemy_42:"Icy Lizalfos Tail",
Item_Enemy_43:"Yellow Lizalfos Tail",
Item_Enemy_44:"Fire Keese Wing",
Item_Enemy_45:"Electric Keese Wing",
Item_Enemy_46:"Ice Keese Wing",
Item_Enemy_47:"Shard of Dinraal's Fang",
Item_Enemy_48:"Shard of Dinraal's Horn",
Item_Enemy_49:"Naydra's Scale",
Item_Enemy_50:"Naydra's Claw",
Item_Enemy_51:"Shard of Naydra's Fang",
Item_Enemy_52:"Shard of Naydra's Horn",
Item_Enemy_53:"Farosh's Scale",
Item_Enemy_54:"Farosh's Claw",
Item_Enemy_55:"Shard of Farosh's Fang",
Item_Enemy_56:"Shard of Farosh's Horn",
Item_Enemy_57:"Octo Balloon",
Item_Enemy_Put_57:"Octo Balloon",
Item_Material_01:"Cane Sugar",
Item_Material_02:"Goron Spice",
Item_Material_03:"Hylian Rice",
Item_Material_04:"Bird Egg",
Item_Material_05:"Fresh Milk",
Item_Material_06:"Goat Butter",
Item_Material_07:"Tabantha Wheat",
Item_Material_08:"Monster Extract",
Item_Ore_A:"Diamond",
Item_Ore_A_00:"Diamant x0",
Item_Ore_B:"Ruby",
Item_Ore_C:"Sapphire",
Item_Ore_D:"Topaz",
Item_Ore_E:"Opal",
Item_Ore_F:"Amber",
Item_Ore_G:"Luminous Stone",
Item_Ore_H:"Rock Salt",
Item_Ore_I:"Flint",
Item_Ore_J:"Star Fragment"
}},

{id:'food',items:{
Item_Boiled_01:"Hard-Boiled Egg",
Item_ChilledFish_01:"Frozen Bass",
Item_ChilledFish_02:"Frozen Hearty Salmon",
Item_ChilledFish_03:"Frozen Trout",
Item_ChilledFish_04:"Frozen Carp",
Item_ChilledFish_05:"Frozen Porgy",
Item_ChilledFish_06:"Frozen Hearty Bass",
Item_ChilledFish_07:"Frozen Crab",
Item_ChilledFish_08:"Frozen River Snail",
Item_ChilledFish_09:"Icy Hearty Blueshell Snail",
Item_RoastFish_01:"Roasted Bass",
Item_RoastFish_02:"Roasted Hearty Bass",
Item_RoastFish_03:"Roasted Trout",
Item_RoastFish_04:"Roasted Hearty Salmon",
Item_RoastFish_07:"Roasted Carp",
Item_RoastFish_09:"Roasted Porgy",
Item_RoastFish_11:"Blueshell Escargot",
Item_RoastFish_13:"Sneaky River Escargot",
Item_RoastFish_15:"Blackened Crab",
Item_Roast_01:"Seared Steak",
Item_Roast_02:"Roasted Bird Drumstick",
Item_Roast_03:"Baked Apple",
Item_Roast_04:"Toasty Stamella Shroom",
Item_Roast_05:"Toasted Hearty Truffle",
Item_Roast_06:"Toasty Hylian Shroom",
Item_Roast_07:"Roasted Wildberry",
Item_Roast_08:"Roasted Voltfruit",
Item_Roast_09:"Roasted Hearty Durian",
Item_Roast_10:"Baked Palm Fruit",
Item_Roast_11:"Roasted Mighty Bananas",
Item_Roast_12:"Roasted Hydromelon",
Item_Roast_13:"Charred Pepper",
Item_Roast_15:"Baked Fortified Pumpkin",
Item_Roast_16:"Roasted Lotus Seed",
Item_Roast_18:"Roasted Radish",
Item_Roast_19:"Roasted Big Radish",
Item_Roast_24:"Roasted Swift Carrot",
Item_Roast_27:"Roasted Mighty Thistle",
Item_Roast_28:"Roasted Armoranth",
Item_Roast_31:"Toasty Chillshroom",
Item_Roast_32:"Toasty Sunshroom",
Item_Roast_33:"Toasty Zapshroom",
Item_Roast_36:"Toasty Rushroom",
Item_Roast_37:"Toasty Razorshroom",
Item_Roast_38:"Toasty Ironshroom",
Item_Roast_39:"Toasty Silent Shroom",
Item_Roast_40:"Seared Prime Steak",
Item_Roast_41:"Roasted Bird Thigh",
Item_Roast_45:"Seared Gourmet Steak",
Item_Roast_46:"Roasted Whole Bird",
Item_Roast_48:"Roasted Acorn",
Item_Roast_49:"Toasted Big Heart Truffle",
Item_Roast_50:"Roasted Endura Carrot",
Item_Roast_51:"Campfire Egg",
Item_Roast_52:"Roasted Tree Nut",
Item_Roast_53:"Toasty Endura Shroom",
Item_Chilled_01:"Icy Meat",
Item_Chilled_02:"Icy Prime Meat",
Item_Chilled_03:"Icy Gourmet Meat",
Item_Chilled_04:"Frozen Bird Drumstick",
Item_Chilled_05:"Frozen Bird Thigh",
Item_Chilled_06:"Frozen Whole Bird",
Item_Cook_A_01:"Mushroom Skewer",
Item_Cook_A_02:"Steamed Mushrooms",
Item_Cook_A_03:"Steamed Fruit",
Item_Cook_A_04:"Steamed Fish",
Item_Cook_A_05:"Steamed Meat",
Item_Cook_A_07:"Fruit and Mushroom Mix",
Item_Cook_A_08:"Fish and Mushroom Skewer",
Item_Cook_A_09:"Meat and Mushroom Skewer",
Item_Cook_A_10:"Omelet",
Item_Cook_A_11:"Glazed Mushroom",
Item_Cook_A_12:"Glazed Meat",
Item_Cook_A_13:"Glazed Seafood",
Item_Cook_A_14:"Glazed Veggies",
Item_Cook_B_01:"Fried Wild Greens",
Item_Cook_B_02:"Simmered Fruits",
Item_Cook_B_05:"Fish Skewer",
Item_Cook_B_06:"Meat Skewer",
Item_Cook_B_11:"Copious Fried Wild Greens",
Item_Cook_B_12:"Copious Simmered Fruits",
Item_Cook_B_13:"Copious Mushroom Skewers",
Item_Cook_B_15:"Copious Seafood Skewers",
Item_Cook_B_16:"Copious Meat Skewers",
Item_Cook_B_17:"Meat and Seafood Fry",
Item_Cook_B_18:"Prime Meat and Seafood Fry",
Item_Cook_B_19:"Gourmet Meat and Seafood Fry",
Item_Cook_B_20:"Meat-Stuffed Pumpkin",
Item_Cook_B_21:"Sautéed Peppers",
Item_Cook_B_22:"Sautéed Nuts",
Item_Cook_B_23:"Seafood Skewers",
Item_Cook_C_16:"Fairy Tonic",
Item_Cook_C_17:"Elixir",
Item_Cook_D_01:"Salt-Grilled Mushrooms",
Item_Cook_D_02:"Salt-Grilled Greens",
Item_Cook_D_03:"Salt-Grilled Fish",
Item_Cook_D_04:"Salt-Grilled Meat",
Item_Cook_D_05:"Salt-Grilled Prime Meat",
Item_Cook_D_06:"Salt-Grilled Gourmet Meat",
Item_Cook_D_07:"Pepper Steak",
Item_Cook_D_08:"Pepper Seafood",
Item_Cook_D_09:"Salt-Grilled Crab",
Item_Cook_D_10:"Crab Stir-Fry",
Item_Cook_E_01:"Poultry Pilaf",
Item_Cook_E_02:"Prime Poultry Pilaf",
Item_Cook_E_03:"Gourmet Poultry Pilaf",
Item_Cook_E_04:"Fried Egg and Rice",
Item_Cook_F_01:"Creamy Meat Soup",
Item_Cook_F_02:"Creamy Seafood Soup",
Item_Cook_F_03:"Veggie Cream Soup",
Item_Cook_F_04:"Creamy Heart Soup",
Item_Cook_G_02:"Seafood Rice Balls",
Item_Cook_G_03:"Veggie Rice Balls",
Item_Cook_G_04:"Mushroom Rice Balls",
Item_Cook_G_05:"Meat and Rice Bowl",
Item_Cook_G_06:"Prime Meat and Rice Bowl",
Item_Cook_G_09:"Gourmet Meat and Rice Bowl",
Item_Cook_G_10:"Seafood Fried Rice",
Item_Cook_G_11:"Curry Pilaf",
Item_Cook_G_12:"Mushroom Risotto",
Item_Cook_G_13:"Vegetable Risotto",
Item_Cook_G_14:"Salmon Risotto",
Item_Cook_G_15:"Meaty Rice Balls",
Item_Cook_G_16:"Crab Omelet with Rice",
Item_Cook_G_17:"Crab Risotto",
Item_Cook_H_01:"Seafood Meunière",
Item_Cook_H_02:"Porgy Meunière",
Item_Cook_H_03:"Salmon Meunière",
Item_Cook_I_01:"Fruit Pie",
Item_Cook_I_02:"Apple Pie",
Item_Cook_I_03:"Egg Tart",
Item_Cook_I_04:"Meat Pie",
Item_Cook_I_05:"Carrot Cake",
Item_Cook_I_06:"Pumpkin Pie",
Item_Cook_I_07:"Hot Buttered Apple",
Item_Cook_I_08:"Honeyed Apple",
Item_Cook_I_09:"Honeyed Fruits",
Item_Cook_I_10:"Plain Crepe",
Item_Cook_I_11:"Wildberry Crepe",
Item_Cook_I_12:"Nutcake",
Item_Cook_I_13:"Fried Bananas",
Item_Cook_I_14:"Egg Pudding",
Item_Cook_I_15:"Fish Pie",
Item_Cook_I_16:"Honey Candy",
Item_Cook_I_17:"Honey Crepe",
Item_Cook_J_01:"Curry Rice",
Item_Cook_J_02:"Vegetable Curry",
Item_Cook_J_03:"Seafood Curry",
Item_Cook_J_04:"Poultry Curry",
Item_Cook_J_05:"Prime Poultry Curry",
Item_Cook_J_06:"Meat Curry",
Item_Cook_J_07:"Prime Meat Curry",
Item_Cook_J_08:"Gourmet Poultry Curry",
Item_Cook_J_09:"Gourmet Meat Curry",
Item_Cook_K_01:"Meat Stew",
Item_Cook_K_02:"Prime Meat Stew",
Item_Cook_K_03:"Pumpkin Stew",
Item_Cook_K_04:"Clam Chowder",
Item_Cook_K_05:"Gourmet Meat Stew",
Item_Cook_K_06:"Cream of Mushroom Soup",
Item_Cook_K_07:"Cream of Vegetable Soup",
Item_Cook_K_08:"Carrot Stew",
Item_Cook_K_09:"Milk",
Item_Material_05_00:"Milk x0",
Item_Cook_L_01:"Monster Stew",
Item_Cook_L_02:"Monster Soup",
Item_Cook_L_03:"Monster Cake",
Item_Cook_L_04:"Monster Rice Balls",
Item_Cook_L_05:"Monster Curry",
Item_Cook_M_01:"Wheat Bread",
Item_Cook_N_01:"Seafood Paella",
Item_Cook_N_02:"Fruitcake",
Item_Cook_N_03:"Vegetable Omelet",
Item_Cook_N_04:"Mushroom Omelet",
Item_Cook_O_01:"Dubious Food",
Item_Cook_O_02:"Rock-Hard Food",
Item_Cook_P_01:"Fragrant Mushroom Sauté",
Item_Cook_P_02:"Herb Sauté",
Item_Cook_P_03:" Spiced Meat Skewer",
Item_Cook_P_04:"Prime Spiced Meat Skewer",
Item_Cook_P_05:"Gourmet Spiced Meat Skewer"
}},

{id:'other',items:{
Obj_DungeonClearSeal:"Spirit Orb",
Obj_KorokNuts:"Korok Seed",
PlayerStole2:"Paraglider",
Obj_ProofBook:"Classified Envelope",
Obj_DRStone_Get:"Sheikah Slate",
Obj_HeroSoul_Zora:"Mipha's Grace",
Obj_HeroSoul_Gerudo:"Urbosa's Fury",
Obj_HeroSoul_Goron:"Daruk's Protection",
Obj_HeroSoul_Rito:"Revali's Gale",
Obj_Maracas:"Hestu's Maracas",
Obj_ProofKorok:"Hestu's Gift",
Obj_ProofSandwormKiller:"Medal of Honor: Molduga",
Obj_ProofGiantKiller:"Medal of Honor: Hinox",
Obj_ProofGolemKiller:"Medal of Honor: Talus",
KeySmall:"Small Key",
Obj_Armor_115_Head:"Thunder Helm",
GameRomHorseReins_00:"Stable Bridle",
GameRomHorseReins_01:"Traveler's Bridle",
GameRomHorseReins_02:"Royal Reins",
GameRomHorseReins_03:"Knight's Bridle",
GameRomHorseReins_04:"Monster Bridle",
GameRomHorseReins_05:"Extravagant Bridle",
GameRomHorseSaddle_00:"Stable Saddle",
GameRomHorseSaddle_01:"Traveler's Saddle",
GameRomHorseSaddle_02:"Royal Saddle",
GameRomHorseSaddle_03:"Knight's Saddle",
GameRomHorseSaddle_04:"Monster Saddle",
GameRomHorseSaddle_05:"Extravagant Saddle",

GameRomHorse00S:"Donkey",
GameRomHorseNushi:"Lord of the Mountain",
WolfLink:"Wolf Link",
GameRomHorseEpona:"Epona",
GameRomHorseBone:"Stalhorse",
Animal_Bear_B:"Grizzlemaw Bear",
Animal_Bear_A:"Honeyvore Bear",
GameRomHorse00L:"Giant Horse",
GameRomHorseZelda:"Royal White Stallion",
Obj_HeartUtuwa_A_01:"Heart Container",
Obj_StaminaUtuwa_A_01:"Stamina Vessel",
Obj_Mineral_A_01:"Mineral Deposit",
Obj_Mineral_B_01:"Rare Mineral Deposit",
Obj_Mineral_C_01:"Luminous Stone Deposit",
Dm_Npc_Zelda_Sibyl :"Zelda NPC (White Dress)"
}}
],

	/* private functions */
	_getItemTranslation:function(itemId){
		for(var i=0; i<this.Translations.length; i++)
			if(this.Translations[i].items[itemId])
				return this.Translations[i].items[itemId];
		return '<span style="color:red">'+itemId+'</span>'
	},
	_getItemCategory:function(itemId){
		for(var i=0; i<this.Translations.length; i++)
			if(this.Translations[i].items[itemId])
				return this.Translations[i].id;
		return 'other'
	},

	_writeString:function(offset,str){
		for(var j=0; j<16; j++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(j*4, 4);
			for(k=0; k<fourBytes.length; k++){
				tempFile.writeByte(offset+k, fourBytes.charCodeAt(k));
			}
			offset+=8;
		}
	},
	_readString:function(offset){
		var txt='';
		for(var j=0; j<16; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},

	_loadItemName:function(i){
		return this._readString(this.Offsets.ITEMS+i*0x80);
	},
	_writeItemName:function(i,newItemNameId){
		this._writeString(this.Offsets.ITEMS+i*0x80, newItemNameId);
	},
	_getItemMaximumQuantity:function(itemId){
		var cat=this._getItemCategory(itemId);
		if(itemId.endsWith('Arrow') || itemId.endsWith('Arrow_A') || cat==='materials' || cat==='food'){
			return 999;
		}else if(cat==='weapons' || cat==='bows' || cat==='shields'){
			return 6553500;
		}else if(itemId==='Obj_DungeonClearSeal'){
			return 120
		}else{
			return 0xffffffff;
		}
	},
	_getItemQuantityOffset:function(i){
		return this.Offsets.ITEMS_QUANTITY+i*0x08;
	},
	_getItemRow(i){
		return getField('number-item'+i).parentElement.parentElement
	},
	_createItemRow(i){
		var itemNameId=this._loadItemName(i);
		return row([10,2],
			label('number-item'+i,'<b class="mono"><small>#'+i+'</small> </b><span id="item-name'+i+'">'+this._getItemTranslation(itemNameId)+'</span> <button class="with-icon icon10 colored transparent" onclick="SavegameEditor.editItem('+i+')"></button>'),
			inputNumber('item'+i, 0, this._getItemMaximumQuantity(itemNameId), tempFile.readInt(this._getItemQuantityOffset(i)))
		)
	},

	addItem:function(){
		var i=0;
		while(document.getElementById('number-item'+i)){
			i++;
		}
		if(i<this.Constants.MAX_ITEMS){
			this._writeItemName(i,'Item_Fruit_A');
			document.getElementById('card-materials').appendChild(this._createItemRow(i));
			this.editItem(i);
		}
	},

	editItem:function(i){
		currentBOTWItem=i;
		document.getElementById('select-item').value=this._loadItemName(i);
		MarcDialogs.open('item');
	},
	editItem2:function(i,nameId){
		var oldCat=this._getItemCategory(this._loadItemName(i));
		var newCat=this._getItemCategory(nameId);

		if(oldCat!==newCat){
			var row=this._getItemRow(i);
			row.parentElement.removeChild(row);
			document.getElementById('card-'+newCat.clean()).appendChild(row);
		}
		this._writeItemName(i, nameId);
		document.getElementById('item-name'+i).innerHTML=this._getItemTranslation(nameId);
		document.getElementById('number-item'+i).maxValue=this._getItemMaximumQuantity(nameId);
	},

	_getModifierOffset1:function(type){
		if(type==='bows')
			return this.Offsets.MOD_BOW_TYPES;
		else if(type==='shields')
			return this.Offsets.MOD_SHIELD_TYPES;
		else
			return this.Offsets.MOD_WEAPON_TYPES;
	},
	_getModifierOffset2:function(type){
		if(type==='bows')
			return this.Offsets.MOD_BOW_VALUES;
		else if(type==='shields')
			return this.Offsets.MOD_SHIELD_VALUES;
		else
			return this.Offsets.MOD_WEAPON_VALUES;
	},
	editModifier:function(type,i){
		currentBOTWItem={type:type,order:i};

		var offset1=this._getModifierOffset1(type);
		var offset2=this._getModifierOffset2(type);

		getField('modifier').children[0].value=0xffffffff;
		getField('modifier').children[0].innerHTML='unknown';

		var modifier=tempFile.readInt(offset1+i*0x08);
		setValue('modifier', modifier);
		setValue('modifier-value', tempFile.readInt(offset2+i*0x08));

		getField('modifier').children[0].value=modifier;
		getField('modifier').children[0].innerHTML='unknown 0x'+modifier.toString(16);

		if(getValue('modifier')==='')
			setValue('modifier', modifier);

		MarcDialogs.open('modifier');
	},
	editModifier2:function(type,i,modifier,val){
		tempFile.writeInt(this._getModifierOffset1(type)+i*0x08, modifier);
		tempFile.writeInt(this._getModifierOffset2(type)+i*0x08, val);
	},

	editHorse:function(i){
		currentBOTWItem=i;
		setValue('horse-name',this._readString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i));
		setValue('horse-saddles',this._readString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i));
		setValue('horse-reins',this._readString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i));
		setValue('horse-type',this._readString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*i));
		MarcDialogs.open('horse');
	},
	editHorse2:function(i,name,saddles,reins,type){
		this._writeString(this.Offsets.HORSE_NAMES+this.Constants.STRING_SIZE*i, getValue('horse-name'));
		this._writeString(this.Offsets.HORSE_SADDLES+this.Constants.STRING_SIZE*i, getValue('horse-saddles'));
		this._writeString(this.Offsets.HORSE_REINS+this.Constants.STRING_SIZE*i, getValue('horse-reins'));
		this._writeString(this.Offsets.HORSE_TYPES+this.Constants.STRING_SIZE*i, getValue('horse-type'));

		if(getValue('horse-type')==='GameRomHorse00L'){
			this._writeString(this.Offsets.HORSE_MANES+this.Constants.STRING_SIZE*i, 'Horse_Link_Mane_00L');
		}
	},

	_arrayToSelectOpts:function(arr){
		var arr2=[];
		for(var i=0; i<arr.length; i++){
			arr2.push({name:arr[i], value:arr[i]});
		}
		return arr2;
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize===896976 || tempFile.fileSize===897160)
	},


	/* load function */
	load:function(){
		tempFile.littleEndian=false;
		tempFile.fileName='game_data.sav';

		/* check if savegame is v1.0 or v1.1 */
		this.Offsets=(tempFile.fileSize===896976)?this.Offsets1_0:this.Offsets1_1;

		/* prepare edit item dialog */
		var optGroups=[];
		for(var i=0; i<this.Translations.length; i++){
			optGroups.push(document.createElement('optgroup'));
			optGroups[i].label=this.Translations[i].id;

			for(var item in this.Translations[i].items){
				var opt=document.createElement('option');
				opt.value=item;
				opt.innerHTML=this.Translations[i].items[item];
				optGroups[i].appendChild(opt);
			}
		}
		dialog('item',
			select('item', optGroups),
			div('buttons',
				button('Change item',false,function(){
					SavegameEditor.editItem2(currentBOTWItem, getValue('item'));
					MarcDialogs.close();
				})
			)
		);
		dialog('modifier',
			row([4,8],
				label('select-modifier', 'Modifier flag'),
				select('modifier', [
					{value:0xffffffff, name:'unknown'},
					{value:0x00000000, name:'(none)'},
					{value:0x00000001, name:'Attack up'},
					{value:0x80000001, name:'Attack up ★'},
					{value:0x00000002, name:'Durability up'},
					{value:0x80000002, name:'Durability up ★'},
					{value:0x00000004, name:'Critical hit up'},
					{value:0x80000004, name:'Critical hit up ★'},
					{value:0x00000008, name:'(Weapon only) Long throw'},
					{value:0x80000008, name:'(Weapon only) Long throw ★'},
					{value:0x00000010, name:'(Bow only) unknown 1?'},
					{value:0x80000010, name:'(Bow only) unknown 1? ★'},
					{value:0x00000020, name:'(Bow only) unknown 2?'},
					{value:0x80000020, name:'(Bow only) unknown 2? ★'},
					{value:0x00000040, name:'(Bow only) Quick shot'},
					{value:0x80000040, name:'(Bow only) Quick shot ★'},
					{value:0x00000080, name:'(Shield only) Shield surf up'},
					{value:0x80000080, name:'(Shield only) Shield surf up ★'},
					{value:0x00000100, name:'(Shield only) Shield guard up'},
					{value:0x80000100, name:'(Shield only) Shield guard up ★'},
				])
			),
			row([4,8],
				label('number-modifier-value', 'Value'),
				inputNumber('modifier-value', 0, 0xffffffff, 0)
			),

			div('buttons',
				button('Save changes',false,function(){
					SavegameEditor.editModifier2(
						currentBOTWItem.type,
						currentBOTWItem.order,
						getValue('modifier'),
						getValue('modifier-value')
					);
					MarcDialogs.close();
				})
			)
		);
		dialog('horse',
			row([4,8],
				label('input-horse-name', 'Name:'),
				input('horse-name','')
			),

			row([4,8],
				label('select-horse-saddles', 'Saddles:'),
				select('horse-saddles', this._arrayToSelectOpts(this.Constants.HORSE_SADDLES))
			),

			row([4,8],
				label('select-horse-reins', 'Reins:'),
				select('horse-reins', this._arrayToSelectOpts(this.Constants.HORSE_REINS))
			),

			row([4,8],
				label('select-horse-type', 'Type:'),
				select('horse-type', this._arrayToSelectOpts(this.Constants.HORSE_TYPES))
			),

			div('buttons',
				button('Change horse',false,function(){
					SavegameEditor.editHorse2(currentBOTWItem, getValue('horse-name'), getValue('horse-saddles'), getValue('horse-reins'), getValue('horse-type'));
					MarcDialogs.close();
				})
			)
		);

		/* prepare editor */
		card('Rupees',
			row([9,3],
				label('number-rupees', 'Rupees'),
				inputNumber('rupees', 0, 999999, tempFile.readInt(this.Offsets.RUPEES))
			),
			row([9,3],
				label('number-mons', 'Mons'),
				inputNumber('mons', 0, 999999, tempFile.readInt(this.Offsets.MONS))
			)
		);

		/* items */
		for(var i=0; i<this.Translations.length; i++){
			card(this.Translations[i].id);
		}
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			var itemNameId=this._loadItemName(i);
			if(itemNameId==='')
				break;

			document.getElementById('card-'+this._getItemCategory(itemNameId).clean()).appendChild(
				this._createItemRow(i)
			);
		}

		/* modifier buttons */
		var editModifierFunc=function(){SavegameEditor.editModifier(this.weaponType,this.weaponOrder);}
		var sortedWeapons=0;
		var sortedBows=0;
		var sortedShields=0;
		for(var i=0; i<60; i++){
			var itemName=this._loadItemName(i);
			var cat=this._getItemCategory(itemName);

			if(cat==='weapons'){
				sortedWeapons++;
			}else if(cat==='bows' && !(itemName.endsWith('Arrow') || itemName.endsWith('Arrow_A'))){
				sortedBows++;
			}else if(cat==='shields'){
				sortedShields++;
			}
		}
		for(var i=0; i<sortedWeapons; i++){
			var b=button('', 'colored transparent with-icon icon1', editModifierFunc);
			b.weaponType='weapons';
			b.weaponOrder=i;
			document.getElementById('card-weapons').children[i+1].children[0].appendChild(b);
		}
		for(var i=0; i<sortedBows; i++){
			var b=button('', 'colored transparent with-icon icon1', editModifierFunc);
			b.weaponType='bows';
			b.weaponOrder=i;
			document.getElementById('card-bows').children[i+1].children[0].appendChild(b);
		}
		for(var i=0; i<sortedShields; i++){
			var b=button('', 'colored transparent with-icon icon1', editModifierFunc);
			b.weaponType='shields';
			b.weaponOrder=i;
			document.getElementById('card-shields').children[i+1].children[0].appendChild(b);
		}
		



		/* add new item card */
		card(
			div(
				'text-center',
				button('Add item', 'with-icon icon1', function(){SavegameEditor.addItem()})
			)
		);

		/* horse editor card */
		card(
			'Horses',
			div(
				'text-center',
				button('Edit horse 0', 'with-icon icon10', function(){SavegameEditor.editHorse(0)})
			),
			div(
				'text-center',
				button('Edit horse 1', 'with-icon icon10', function(){SavegameEditor.editHorse(1)})
			),
			div(
				'text-center',
				button('Edit horse 2', 'with-icon icon10', function(){SavegameEditor.editHorse(2)})
			),
			div(
				'text-center',
				button('Edit horse 3', 'with-icon icon10', function(){SavegameEditor.editHorse(3)})
			),
			div(
				'text-center',
				button('Edit horse 4', 'with-icon icon10', function(){SavegameEditor.editHorse(4)})
			)
		);
	},

	/* save function */
	save:function(){
		/* RUPEES */
		tempFile.writeInt(this.Offsets.RUPEES, getValue('rupees'));
		tempFile.writeInt(this.Offsets.MONS, getValue('mons'));

		/* ITEMS */
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			if(document.getElementById('number-item'+i))
				tempFile.writeInt(this._getItemQuantityOffset(i), getValue('item'+i));
			else
				break;
		}
	}
}