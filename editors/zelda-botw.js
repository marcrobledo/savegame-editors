/*
	The legend of Zelda: Breath of the wild v20170326
	by Marc Robledo 2017
*/
/* reference: http://http://gbatemp.net/threads/zelda-breath-of-the-wild-save-editing.465753/ */

var currentWeapon=0;
var weaponFilters=[
	null
];
SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',

	/* Constants */
	Constants:{
		MAX_ITEMS:256
	},
	Offsets:{
		RUPEES:0xe110,
		ITEMS:0x0528d8,
		ITEMS_QUANTITY:0x0633f0,
	},
	Translations:{

		/* weapons */
		Weapon_Sword_002:'Soldier\'s Broadsword',
		Weapon_Sword_009:'Lizal Tri-Boomerang',
		Weapon_Sword_025:'Forest Dweller\'s Sword',
		Weapon_Sword_033:'Flameblade',
		Weapon_Sword_043:'Torch',
		Weapon_Sword_061:'Ice Rod',
		Weapon_Lsword_003:'Knight\'s Claymore',
		Weapon_Lsword_013:'Ancient Battle Axe',
		Weapon_Lsword_024:'Royal Claymore',
		Weapon_Lsword_034:'Great Frostblade',
		Weapon_Lsword_037:'Stone Smasher',
		Weapon_Spear_031:'Drillshaft',
		Weapon_Spear_050:'Lightscale Trident',

		/* bows */
		Weapon_Bow_011:'Strengthened Lizal Bow',
		Weapon_Bow_017:'Falcon Bow',
		Weapon_Bow_030:'Steel Lizal Bow',
		Weapon_Bow_035:'Knight\'s Bow',
		Weapon_Bow_036:'Royal Bow',
		NormalArrow:'Arrow',
		FireArrow:'Fire Arrow',
		IceArrow:'Ice Arrow',
		ElectricArrow:'Shock Arrow',
		BombArrow_A:'Bomb Arrow',
		AncientArrow:'Ancient Arrow',

		/* shields */
		Weapon_Shield_003:'Knight\'s Shield',
		Weapon_Shield_008:'Reinforced Lizal Shield',
		Weapon_Shield_013:'Guardian Shield',
		Weapon_Shield_025:'Silver Shield',

		/* armor */
		Armor_002_Upper:'Hylian Tunic',
		Armor_003_Head:'Hylian Hood',
		Armor_003_Lower:'Hylian Trousers',
		Armor_007_Upper:'Zora Armor',
		Armor_011_Upper:'Flamebreaker Armor',
		Armor_043_Lower:'Well-Worn Trousers',
		Armor_043_Upper:'Old Shirt',
		Armor_044_Upper:'Warm Doublet',
		Armor_083_Head:'Climber\'s Bandana',
		Armor_148_Upper:'Champion\'s Tunic',
		Armor_205_Lower:'Trousers of the Wind',
		Armor_205_Upper:'Tunic of the Wind',

		/* materials */
		Animal_Insect_A:'Hot-Footed Frog',
		Animal_Insect_B:'Tireless Frog',
		Animal_Insect_E:'Sunset Firefly',
		Animal_Insect_H:'Restless Cricket',
		Animal_Insect_N:'Winterwing Butterfly',
		Animal_Insect_Q:'Summerwing Butterfly',
		Animal_Insect_R:'Thunderwing Butterfly',
		Animal_Insect_S:'Hightail Lizard',
		Animal_Insect_T:'Warm Darner',
		Animal_Insect_X:'Fireproof Lizard',
		BeeHome:'Courser Bee Honey',
		Item_Enemy_00:'Bokoblin Horn',
		Item_Enemy_01:'Bokoblin Fang',
		Item_Enemy_02:'Bokoblin Guts',
		Item_Enemy_03:'Lizalfos Horn',
		Item_Enemy_04:'Lizalfos Talon',
		Item_Enemy_05:'Lizalfos Tail',
		Item_Enemy_06:'Moblin Horn',
		Item_Enemy_07:'Moblin Fang',
		Item_Enemy_08:'Moblin Guts',
		Item_Enemy_15:'Red Chuchu Jelly',
		Item_Enemy_17:'White Chuchu Jelly',
		Item_Enemy_18:'Keese Wing',
		Item_Enemy_19:'Keese Eyeball',
		Item_Enemy_20:'Octorok Tentacle',
		Item_Enemy_21:'Octorok Eyeball',
		Item_Enemy_26:'Ancient Gear',
		Item_Enemy_27:'Ancient Screw',
		Item_Enemy_28:'Ancient Spring',
		Item_Enemy_29:'Ancient Shaft',
		Item_Enemy_30:'Ancient Core',
		Item_Enemy_31:'Giant Ancient Core',
		Item_Enemy_40:'Chuchu Jelly',
		Item_Enemy_41:'Red Lizalfos Tail',
		Item_Enemy_43:'Yellow Lizalfos Tail',
		Item_Enemy_44:'Fire Keese Wing',
		Item_Enemy_45:'Electric Keese Wing',
		Item_Enemy_46:'Ice Keese Wing',
		Item_Enemy_57:'Octo Balloon',
		Item_FishGet_A:'Hyrule Bass',
		Item_FishGet_B:'Hearty Bass',
		Item_FishGet_C:'Chillfin Trout',
		Item_FishGet_E:'Mighty Carp',
		Item_FishGet_F:'Mighty Porgy',
		Item_FishGet_G:'Armored Porgy',
		Item_FishGet_H:'Armored Carp',
		Item_FishGet_I:'Hearty Salmon',
		Item_FishGet_J:'Sizzlefin Trout',
		Item_FishGet_L:'Staminoka Bass',
		Item_FishGet_M:'Sneaky River Snail',
		Item_FishGet_X:'Stealthfin Trout',
		Item_Fruit_A:'Apple',
		Item_Fruit_E:'Fleet-Lotus Seeds',
		Item_Fruit_G:'Palm Fruit',
		Item_Fruit_H:'Mighty Bananas',
		Item_Fruit_I:'Spicy Pepper',
		Item_Fruit_J:'Fortified Pumpkin',
		Item_Fruit_K:'Acorn',
		Item_Fruit_L:'Chickaloo Tree Nut',
		Item_InsectGet_Z:'Bright-Eyed Crab',
		Item_Material_01:'Cane Sugar',
		Item_Material_03:'Hylian Rice',
		Item_Material_04:'Bird Egg',
		Item_Material_05:'Fresh Milk',
		Item_Material_06:'Goat Butter',
		Item_Material_08:'Monster Extract',
		Item_Meat_01:'Raw Meat',
		Item_Meat_02:'Raw Prime Meat',
		Item_Meat_06:'Raw Bird Drumstick',
		Item_Meat_07:'Raw Bird Thigh',
		Item_MushroomGet_D:'Rushroom',
		Item_Mushroom_A:'Stamella Shroom',
		Item_Mushroom_C:'Sunshroom',
		Item_Mushroom_E:'Hylian Shroom',
		Item_Mushroom_F:'Hearty Truffle',
		Item_Mushroom_H:'Zapshroom',
		Item_Mushroom_J:'Silent Shroom',
		Item_Mushroom_L:'Razorshroom',
		Item_Mushroom_M:'Ironshroom',
		Item_Mushroom_O:'Endura Shroom',
		Item_Ore_B:'Ruby',
		Item_Ore_C:'Sapphire',
		Item_Ore_D:'Topaz',
		Item_Ore_E:'Opal',
		Item_Ore_F:'Amber',
		Item_Ore_G:'Luminous Stone',
		Item_Ore_H:'Rock Salt',
		Item_Ore_I:'Flint',
		Item_PlantGet_A:'Hyrule Herb',
		Item_PlantGet_B:'Hearty Radish',
		Item_PlantGet_C:'Big Hearty Radish',
		Item_PlantGet_E:'Cool Safflina',
		Item_PlantGet_F:'Warm Safflina',
		Item_PlantGet_G:'Mighty Thistle',
		Item_PlantGet_H:'Armoranth',
		Item_PlantGet_I:'Blue Nightshade',
		Item_PlantGet_J:'Silent Princess',
		Item_PlantGet_O:'Swift Violet',
		Item_PlantGet_Q:'Endura Carrot',
		Obj_FireWoodBundle:'Wood',

		/* food */
		Item_Chilled_05:'Frozen Bird Thigh',
		Item_Cook_A_04:'Mighty Steamed Fish',
		Item_Cook_A_05:'Sneaky Steamed Meat',
		Item_Cook_A_09:'Hearty Meat and Mushroom Skewer',
		Item_Cook_B_02:'Simmered Fruit',
		Item_Cook_B_06:'Meat Skewer',
		Item_Cook_C_17:'Mighty Elixir',
		Item_Cook_D_03:'Salt-Grilled Fish',
		Item_Cook_D_07:'Spicy Pepper Steak',
		Item_Cook_G_05:'Mighty Meat and Rice Bowl',
		Item_RoastFish_01:'Roasted Bass',
		Item_RoastFish_03:'Roasted Trout',
		Item_RoastFish_15:'Blackened Crab',
		Item_Roast_01:'Seared Steak',
		Item_Roast_02:'Roasted Bird Drumstick',
		Item_Roast_03:'Baked Apple',
		Item_Roast_05:'Toasted Hearty Truffle',
		Item_Roast_06:'Toasty Hylian Shroom',
		Item_Roast_41:'Roasted Bird Thigh',
		Item_Roast_48:'Roasted Acorn',
		Item_Roast_52:'Roasted Tree Nut',

		/* other */
		Obj_DRStone_Get:'Sheikah Slate',
		PlayerStole2:'Paraglider',
		Obj_KorokNuts:'Korok Seed',
		Obj_HeroSoul_Zora:'Mipha\'s Grace',
		Obj_DungeonClearSeal:'Spirit Orb'
	},

	/* private functions */
	_loadItemName:function(i){
		var offset=this.Offsets.ITEMS+i*0x80;
		var txt='';
		for(var j=0; j<16; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},
	_getItemQuantityOffset:function(i){
		return this.Offsets.ITEMS_QUANTITY+i*0x08;
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==897160)
	},


	/* load function */
	load:function(){
		tempFile.littleEndian=false;
		tempFile.fileName='game_data.sav';


		/* RUPEES */
		setValue('botw-rupees', tempFile.readInt(this.Offsets.RUPEES), 0, 99999);


		/* ITEMS */
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			var itemNameId=this._loadItemName(i);
			var container;
			if(itemNameId===''){
				break;
			}else if(itemNameId.startsWith('Weapon_') || itemNameId.startsWith('Shield_') || itemNameId.endsWith('Arrow') || itemNameId.endsWith('Arrow_A')){
				container='weapons';
			}else if(itemNameId.startsWith('Armor')){
				container='clothes';
			}else if(itemNameId.startsWith('Item_Fruit_') || itemNameId.startsWith('Item_Mushroom') || itemNameId.startsWith('Item_Plant') || itemNameId.startsWith('Item_Meat_') || itemNameId.startsWith('Item_Material') || itemNameId.startsWith('Item_Fish') || itemNameId.startsWith('Item_Insect') || itemNameId.startsWith('Item_Ore_') || itemNameId.startsWith('Item_Enemy_') || itemNameId.startsWith('Animal_') || itemNameId==='BeeHome' || itemNameId==='Obj_FireWoodBundle'){
				container='materials';
			}else if(itemNameId.startsWith('Item_Cook_') || itemNameId.startsWith('Item_Roast') || itemNameId.startsWith('Item_Chilled_')){
				container='food';
			}else{
				container='other';
			}
			var itemName=this.Translations[itemNameId] || '<span style="color:red">!!! '+itemNameId+' !!!</span>';

			document.getElementById('row-botw-'+container).appendChild(row([10,2], create('label','number-botw-item'+i,'<b class="mono"><small>#'+i+'</small> </b>'+itemName), create('number', 'botw-item'+i, 0, 4294967295, tempFile.readInt(this._getItemQuantityOffset(i)))));
		}


	},


	/* save function */
	save:function(){
		/* RUPEES */
		tempFile.writeInt(this.Offsets.RUPEES, getValue('botw-rupees'));

		/* ITEMS */
		for(var i=0; i<this.Constants.MAX_ITEMS; i++){
			if(document.getElementById('number-botw-item'+i))
				tempFile.writeInt(this._getItemQuantityOffset(i), getValue('botw-item'+i));
			else
				break;
		}
	}
}