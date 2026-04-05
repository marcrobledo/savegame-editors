/*
	Hyrule Warriors: Age of Calamity v20260405
	by Marc Robledo 2026
*/

SavegameEditor={
	Name:'Hyrule Warriors: Age of Calamity',
	Filename:'svdt',

	/* Constants */
	Constants:{
		RUPEES_OFFSET:			0x2c3a4,
		MATERIALS_OFFSET:		0x2c14e,
		MATERIALS_DISCOVERED:	0x2c2dd,

		MATERIALS:[
			/* fruits */
			{index:0, category:'fruits', label:'Hearty Durian'},
			{index:1, category:'fruits', label:'Palm Fruit'},
			{index:2, category:'fruits', label:'Wildberry'},
			{index:3, category:'fruits', label:'Hydromelon'},
			{index:4, category:'fruits', label:'Spicy Pepper'},
			{index:5, category:'fruits', label:'Voltfruit'},
			{index:6, category:'fruits', label:'Fleet-Lotus Seeds'},
			{index:164, category:'fruits', label:'Mighty Bananas'},

			/* mushrooms */
			{index:7, category:'mushrooms', label:'Big Hearty Truffle'},
			{index:8, category:'mushrooms', label:'Hearty Truffle'},
			{index:9, category:'mushrooms', label:'Endura Shroom'},
			{index:10, category:'mushrooms', label:'Hylian Shroom'},
			{index:11, category:'mushrooms', label:'Stamella Shroom'},
			{index:12, category:'mushrooms', label:'Chillshroom'},
			{index:13, category:'mushrooms', label:'Sunshroom'},
			{index:14, category:'mushrooms', label:'Zapshroom'},
			{index:15, category:'mushrooms', label:'Rushroom'},
			{index:16, category:'mushrooms', label:'Razorshroom'},
			{index:17, category:'mushrooms', label:'Ironshroom'},
			{index:18, category:'mushrooms', label:'Silent Shroom'},

			/* vegetables */
			{index:19, category:'vegetables', label:'Big Hearty Radish'},
			{index:20, category:'vegetables', label:'Hearty Radish'},
			{index:21, category:'vegetables', label:'Endura Carrot'},
			{index:22, category:'vegetables', label:'Hyrule Herb'},
			{index:23, category:'vegetables', label:'Swift Carrot'},
			{index:24, category:'vegetables', label:'Fortified Pumpkin'},
			{index:25, category:'vegetables', label:'Cool Safflina'},
			{index:26, category:'vegetables', label:'Warm Safflina'},
			{index:27, category:'vegetables', label:'Electric Safflina'},
			{index:28, category:'vegetables', label:'Swift Violet'},
			{index:29, category:'vegetables', label:'Mighty Thistle'},
			{index:30, category:'vegetables', label:'Armoranth'},
			{index:31, category:'vegetables', label:'Blue Nightshade'},
			{index:32, category:'vegetables', label:'Silent Princess'},
			{index:146, category:'vegetables', label:'Wood'},

			/* meat */
			{index:33, category:'meat', label:'Raw Gourmet Meat'},
			{index:34, category:'meat', label:'Raw Whole Bird'},
			{index:35, category:'meat', label:'Raw Prime Meat'},
			{index:36, category:'meat', label:'Raw Bird Thigh'},
			{index:37, category:'meat', label:'Raw Meat'},
			{index:38, category:'meat', label:'Raw Bird Drumstick'},

			/* ingredients */
			{index:39, category:'ingredients', label:'Courser Bee Honey'},
			{index:40, category:'ingredients', label:'Hylian Rice'},
			{index:41, category:'ingredients', label:'Bird Egg'},
			{index:42, category:'ingredients', label:'Tabantha Wheat'},
			{index:43, category:'ingredients', label:'Fresh Milk'},
			{index:44, category:'ingredients', label:'Acorn'},
			{index:45, category:'ingredients', label:'Chickaloo Tree Nut'},
			{index:46, category:'ingredients', label:'Cane Sugar'},
			{index:47, category:'ingredients', label:'Goat Butter'},
			{index:48, category:'ingredients', label:'Goron Spice'},
			{index:49, category:'ingredients', label:'Rock Salt'},
			{index:50, category:'ingredients', label:'Monster Extract'},
			{index:51, category:'ingredients', label:'Star Fragment'},

			//{index:52, label:'UNUSED52'}, //unused???
			//...
			//{index:63, label:'UNUSED63'}, //unused???

			/* fish */
			{index:64, category:'fish', label:'Hearty Salmon'},
			{index:65, category:'fish', label:'Hearty Blueshell Snail'},
			{index:66, category:'fish', label:'Hearty Bass'},
			{index:67, category:'fish', label:'Hyrule Bass'},
			{index:68, category:'fish', label:'Staminoka Bass'},
			{index:69, category:'fish', label:'Chillfin Trout'},
			{index:70, category:'fish', label:'Sizzlefin Trout'},
			{index:71, category:'fish', label:'Voltfin Trout'},
			{index:72, category:'fish', label:'Stealthfin Trout'},
			{index:73, category:'fish', label:'Mighty Carp'},
			{index:74, category:'fish', label:'Armored Carp'},
			{index:75, category:'fish', label:'Sanke Carp'},
			{index:76, category:'fish', label:'Mighty Porgy'},
			{index:77, category:'fish', label:'Armored Porgy'},
			{index:78, category:'fish', label:'Sneaky River Snail'},
			{index:79, category:'fish', label:'Razorclaw Crab'},
			{index:80, category:'fish', label:'Ironshell Crab'},
			{index:81, category:'fish', label:'Bright-Eyed Crab'},

			/* insects */
			{index:82, category:'insects', label:'Fairy'},
			{index:83, category:'insects', label:'Winterwing Butterfly'},
			{index:84, category:'insects', label:'Summerwing Butterfly'},
			{index:85, category:'insects', label:'Thunderwing Butterfly'},
			{index:86, category:'insects', label:'Smotherwing Butterfly'},
			{index:87, category:'insects', label:'Cold Darner'},
			{index:88, category:'insects', label:'Warm Darner'},
			{index:89, category:'insects', label:'Electric Darner'},
			{index:90, category:'insects', label:'Restless Cricket'},
			{index:91, category:'insects', label:'Bladed Rhino Beetle'},
			{index:92, category:'insects', label:'Rugged Rhino Beetle'},
			{index:93, category:'insects', label:'Energetic Rhino Beetle'},
			{index:94, category:'insects', label:'Sunset Firefly'},
			{index:95, category:'insects', label:'Hot-Footed Frog'},
			{index:96, category:'insects', label:'Tireless Frog'},
			{index:97, category:'insects', label:'Hightail Lizard'},
			{index:98, category:'insects', label:'Hearty Lizard'},
			{index:99, category:'insects', label:'Fireproof Lizard'},

			/* minerals */
			{index:100, category:'minerals', label:'Flint'},
			{index:101, category:'minerals', label:'Amber'},
			{index:102, category:'minerals', label:'Opal'},
			{index:103, category:'minerals', label:'Luminous Stone'},
			{index:104, category:'minerals', label:'Topaz'},
			{index:105, category:'minerals', label:'Ruby'},
			{index:106, category:'minerals', label:'Sapphire'},
			{index:107, category:'minerals', label:'Diamond'},

			/* monster parts */
			{index:108, category:'monster', label:'Bokoblin Horn'},
			{index:109, category:'monster', label:'Bokoblin Fang'},
			{index:110, category:'monster', label:'Bokoblin Guts'},
			{index:111, category:'monster', label:'Moblin Horn'},
			{index:112, category:'monster', label:'Moblin Fang'},
			{index:113, category:'monster', label:'Moblin Guts'},
			{index:114, category:'monster', label:'Lizalfos Horn'},
			{index:115, category:'monster', label:'Lizalfos Talon'},
			{index:116, category:'monster', label:'Lizalfos Tail'},
			{index:117, category:'monster', label:'Icy Lizalfos Tail'},
			{index:118, category:'monster', label:'Red Lizalfos Tail'},
			{index:119, category:'monster', label:'Yellow Lizalfos Tail'},
			{index:120, category:'monster', label:'Lynel Horn'},
			{index:121, category:'monster', label:'Lynel Hoof'},
			{index:122, category:'monster', label:'Lynel Guts'},
			{index:123, category:'monster', label:'Chuchu Jelly'},
			{index:124, category:'monster', label:'White Chuchu Jelly'},
			{index:125, category:'monster', label:'Red Chuchu Jelly'},
			{index:126, category:'monster', label:'Yellow Chuchu Jelly'},
			{index:127, category:'monster', label:'Keese Wing'},
			{index:128, category:'monster', label:'Ice Keese Wing'},
			{index:129, category:'monster', label:'Fire Keese Wing'},
			{index:130, category:'monster', label:'Electric Keese Wing'},
			{index:131, category:'monster', label:'Keese Eyeball'},
			{index:132, category:'monster', label:'Octorok Tentacle'},
			{index:133, category:'monster', label:'Octorok Eyeball'},
			{index:134, category:'monster', label:'Octo Balloon'},
			{index:135, category:'monster', label:'Molduga Fin'},
			{index:136, category:'monster', label:'Molduga Guts'},
			{index:137, category:'monster', label:'Hinox Toenail'},
			{index:138, category:'monster', label:'Hinox Tooth'},
			{index:139, category:'monster', label:'Hinox Guts'},

			/* guardian parts */
			{index:140, category:'guardian', label:'Ancient Screw'},
			{index:141, category:'guardian', label:'Ancient Spring'},
			{index:142, category:'guardian', label:'Ancient Gear'},
			{index:143, category:'guardian', label:'Ancient Shaft'},
			{index:144, category:'guardian', label:'Ancient Core'},
			{index:145, category:'guardian', label:'Giant Ancient Core'},
			{index:165, category:'guardian', label:'Guardian Claw (PotA)', dlc:true},
			{index:166, category:'guardian', label:'High-Yield Ancient Furnace (PotA)', dlc:true},
			{index:167, category:'guardian', label:'Robbie\'s Maintenance Oil (PotA)', dlc:true},
			{index:168, category:'guardian', label:'Robbie\'s Machine Lubricant (PotA)', dlc:true},
			{index:169, category:'guardian', label:'Robbie\'s Curing Agent (PotA)', dlc:true},

			/* trophies */
			{index:151, category:'trophies', label:'Guardian Trophy', customCap:9999},
			{index:152, category:'trophies', label:'Molduga Trophy', customCap:9999},
			{index:153, category:'trophies', label:'Stone Talus Trophy', customCap:9999},
			{index:154, category:'trophies', label:'Hinox Trophy', customCap:9999},
			{index:155, category:'trophies', label:'Lynel Trophy', customCap:9999},
			{index:156, category:'trophies', label:'Moblin Trophy', customCap:9999},
			{index:157, category:'trophies', label:'Wizzrobe Trophy', customCap:9999},
			{index:158, category:'trophies', label:'Bokoblin Trophy', customCap:9999},
			{index:159, category:'trophies', label:'Lizalfos Trophy', customCap:9999},
			{index:160, category:'trophies', label:'Chuchu Trophy', customCap:9999},
			{index:161, category:'trophies', label:'Keese Trophy', customCap:9999},
			{index:162, category:'trophies', label:'Octorok Trophy', customCap:9999},
			{index:163, category:'trophies', label:'Stone Pebblit Trophy', customCap:9999},
			{index:170, category:'trophies', label:'Report: Monster Ecology (PotA)', customCap:9999, dlc:true},
			{index:171, category:'trophies', label:'Report: Relic Analysis (PotA)', customCap:9999, dlc:true},
			{index:172, category:'trophies', label:'Report: Battle Records (PotA)', customCap:9999, dlc:true},
			{index:173, category:'trophies', label:'Report: Material Properties (PotA)', customCap:9999, dlc:true},
			{index:174, category:'trophies', label:'Report: Vicious Monsters (PotA)', customCap:9999, dlc:true},

			/* special */
			{index:147, category:'special', label:'Korok Seed'},
			{index:149, category:'special', label:'Terrako Component'},
			{index:150, category:'special', label:'Ethereal Stone'}

			//{index:???, category:'special', label:'Report: Hidden Battles (GoR)', dlc:true}
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
			const material=this.Constants.MATERIALS[i];
			const itemCap=material.customCap || 999;
			const firstCol=col(3, label('number-material'+i, material.label));
			if(material.dlc)
				firstCol.children[0].style.fontStyle='italic';
			get('row-materials-'+material.category).appendChild(firstCol);
			get('row-materials-'+material.category).appendChild(col(1, inputNumber('material'+i, 0, itemCap, tempFile.readU16(this.Constants.MATERIALS_OFFSET+material.index*2))));
		}

		const categories=this.Constants.MATERIALS.reduce((acc, material) => {
			if(!acc.includes(material.category))
				acc.push(material.category);
			return acc;
		}, []);
		for(const category of categories){
			const container=get('row-materials-'+category);
			if(container.children.length % 3 === 1)
				container.appendChild(col(4, document.createElement('div')));
			else if(container.children.length % 3 === 2)
				container.appendChild(col(8, document.createElement('div')));
		}
	},


	/* save function */
	save:function(){
		/* MATERIALS */
		tempFile.writeU32(this.Constants.RUPEES_OFFSET, getValue('rupees'));
		for(var i=0; i<this.Constants.MATERIALS.length; i++){
			const material=this.Constants.MATERIALS[i];

			const originalValue=tempFile.readU16(this.Constants.MATERIALS_OFFSET+material.index*2);
			const changedValue=getValue('material'+i);
			if(!originalValue && changedValue){
				//set as discovered
				tempFile.writeU8(this.Constants.MATERIALS_DISCOVERED+material.index, 0x01);
				console.log(material.label + ' discovered');
			}
			tempFile.writeU16(this.Constants.MATERIALS_OFFSET+material.index*2, changedValue);
		}
	}
}