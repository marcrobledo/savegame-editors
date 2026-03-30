/*
	Hyrule Warriors: Age of Calamity v20260330
	by Marc Robledo 2026
*/

var currentWeapon=0;
var weaponFilters=[
	null
];
SavegameEditor={
	Name:'Hyrule Warriors: Age of Calamity',
	Filename:'svdt',

	/* Constants */
	Constants:{
		RUPEES_OFFSET:			0x2c3a4,
		MATERIALS_OFFSET:		0x2c14e,
		MATERIALS_DISCOVERED:	0x2c2dd,
		MATERIALS:[
			'Hearty Durian',
			'Palm Fruit',
			'Wildberry',
			'Hydromelon',
			'Spicy Pepper',
			'Voltfruit',
			'Fleet-Lotus Seeds',

			'Big Hearty Truffle',
			'Hearty Truffle',
			'Endura Shroom',
			'Hylian Shroom',
			'Stamella Shroom',
			'Chillshroom',
			'Sunshroom',
			'Zapshroom',
			'Rushroom',
			'Razorshroom',
			'Ironshroom',
			'Silent Shroom',

			'Big Hearty Radish',
			'Hearty Radish',
			'Endura Carrot',
			'Hyrule Herb',
			'Swift Carrot',
			'Fortified Pumpkin',
			'Cool Safflina',
			'Warm Safflina',
			'Electric Safflina',
			'Swift Violet',
			'Mighty Thistle',
			'Armoranth',
			'Blue Nightshade',
			'Silent Princess',

			'Raw Gourmet Meat',
			'Raw Whole Bird',
			'Raw Prime Meat',
			'Raw Bird Thigh',
			'Raw Meat',
			'Raw Bird Drumstick',

			'Courser Bee Honey',
			'Hylian Rice',
			'Bird Egg',
			'Tabantha Wheat',
			'Fresh Milk',
			'Acorn',
			'Chickaloo Tree Nut',
			'Cane Sugar',
			'Goat Butter',
			'Goron Spice',
			'Rock Salt',
			'Monster Extract',
			'Star Fragment',

			//DLC could be also here???
			'MATERIAL52',
			'MATERIAL53',
			'MATERIAL54',
			'MATERIAL55',
			'MATERIAL56',
			'MATERIAL57',
			'MATERIAL58',
			'MATERIAL59',
			'MATERIAL60',
			'MATERIAL61',
			'MATERIAL62',
			'MATERIAL63',

			'Hearty Salmon',
			'Hearty Blueshell Snail',
			'Hearty Bass',
			'Hyrule Bass',
			'Staminoka Bass',
			'Chillfin Trout',
			'Sizzlefin Trout',
			'Voltfin Trout',
			'Stealthfin Trout',
			'Mighty Carp',
			'Armored Carp',
			'Sanke Carp',
			'Mighty Porgy',
			'Armored Porgy',
			'Sneaky River Snail',
			'Razorclaw Crab',
			'Ironshell Crab',
			'Bright-Eyed Crab',

			'Fairy',
			'Winterwing Butterfly',
			'Summerwing Butterfly',
			'Thunderwing Butterfly',
			'Smotherwing Butterfly',
			'Cold Darner',
			'Warm Darner',
			'Electric Darner',
			'Restless Cricket',
			'Bladed Rhino Beetle',
			'Rugged Rhino Beetle',
			'Energetic Rhino Beetle',
			'Sunset Firefly',
			'Hot-Footed Frog',
			'Tireless Frog',
			'Hightail Lizard',
			'Hearty Lizard',
			'Fireproof Lizard',

			'Flint',
			'Amber',
			'Opal',
			'Luminous Stone',
			'Topaz',
			'Ruby',
			'Sapphire',
			'Diamond',

			'Bokoblin Horn',
			'Bokoblin Fang',
			'Bokoblin Guts',
			'Moblin Horn',
			'Moblin Fang',
			'Moblin Guts',
			'Lizalfos Horn',
			'Lizalfos Talon',
			'Lizalfos Tail',
			'Icy Lizalfos Tail',
			'Red Lizalfos Tail',
			'Yellow Lizalfos Tail',
			'Lynel Horn',
			'Lynel Hoof',
			'Lynel Guts',
			'Chuchu Jelly',
			'White Chuchu Jelly',
			'Red Chuchu Jelly',
			'Yellow Chuchu Jelly',
			'Keese Wing',
			'Ice Keese Wing',
			'Fire Keese Wing',
			'Electric Keese Wing',
			'Keese Eyeball',
			'Octorok Tentacle',
			'Octorok Eyeball',
			'Octo Balloon',
			'Molduga Fin',
			'Molduga Guts',
			'Hinox Toenail',
			'Hinox Tooth',
			'Hinox Guts',

			'Ancient Screw',
			'Ancient Spring',
			'Ancient Gear',
			'Ancient Shaft',
			'Ancient Core',
			'Giant Ancient Core',
			'Wood',

			'Korok Seed',
			'MATERIAL148', //???
			'Terrako Component',
			'Ethereal Stone',

			'Guardian Trophy',
			'Molduga Trophy',
			'Stone Talus Trophy',
			'Hinox Trophy',
			'Lynel Trophy',
			'Moblin Trophy',
			'Wizzrobe Trophy',
			'Bokoblin Trophy',
			'Lizalfos Trophy',
			'Chuchu Trophy',
			'Keese Trophy',
			'Octorok Trophy',
			'Stone Pebblit Trophy',
			'Mighty Bananas',

			//DLC starts here???
			'MATERIAL165',
			'MATERIAL166',
			'MATERIAL167',
			'MATERIAL168',
			'MATERIAL169',
			'MATERIAL170',
			'MATERIAL171',
			'MATERIAL172',
			'MATERIAL173',
			'MATERIAL174',
			'MATERIAL175'
/*
			'Guardian Claw (PotA)',
			'High-Yield Ancient Furnace (PotA)',
			'Robbie\'s Maintenance Oil (PotA)',
			'Robbie\'s Machine Lubricant (PotA)',
			'Robbie\'s Curing Agent (PotA)',
			'Report: Monster Ecology (PotA)',
			'Report: Relic Analysis (PotA)',
			'Report: Battle Records (PotA)',
			'Report: Material Properties (PotA)',
			'Report: Vicious Monsters (PotA)',
			'Report: Hidden Battles (GoR)'
*/
		]
	},


	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==1048576)
	},


	/* load function */
	load:function(){
		tempFile.littleEndian=true;
		tempFile.fileName='svdt';

		/* MATERIALS */
		setValue('rupees', tempFile.readU32(this.Constants.RUPEES_OFFSET), 0, 9999999);
		for(var i=0; i<this.Constants.MATERIALS.length; i++){
			get('row-materials').appendChild(col(3, label('number-material'+i, this.Constants.MATERIALS[i])));
			get('row-materials').appendChild(col(1, inputNumber('material'+i, 0, 999, tempFile.readU16(this.Constants.MATERIALS_OFFSET+i*2))));
		}
	},


	/* save function */
	save:function(){
		/* MATERIALS */
		tempFile.writeU32(this.Constants.RUPEES_OFFSET, getValue('rupees'));
		for(var i=0; i<this.Constants.MATERIALS.length; i++){
			const originalValue=tempFile.readU16(this.Constants.MATERIALS_OFFSET+i*2);
			const changedValue=getValue('material'+i);
			if(!originalValue && changedValue){
				//set as discovered
				tempFile.writeU8(this.Constants.MATERIALS_DISCOVERED+i, 0x01);
				console.log(this.Constants.MATERIALS[i] + ' discovered');
			}
			tempFile.writeU16(this.Constants.MATERIALS_OFFSET+i*2, changedValue);
		}
	}
}