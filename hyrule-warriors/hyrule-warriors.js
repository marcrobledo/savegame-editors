/*
	Hyrule Warriors v20161101
	by Marc Robledo 2016
*/
/* reference: http://gbatemp.net/threads/hyrule-warriors-save-editing.425943/ */

var currentWeapon=0;
var weaponFilters=[
	null
];
SavegameEditor={
	Name:'Hyrule Warriors',
	Filename:'APP.BIN',

	/* Constants */
	Constants:{
		CHARACTER_SIZE: 0x38,
		CHARACTER_LEVEL_OFFSET:0x07,
		CHARACTER_EXP_OFFSET:0x08,
		CHARACTER_PACKS:[
			{
				Offset:0x8c184,
				Names:[
					'Link',
					'Zelda',
					'Sheik',
					'Impa',
					'Ganondorf',
					'Darunia',
					'Ruto',
					'Agitha',
					'Midna',
					'Fi',
					'Girahim',
					'Zant',
					null,
					'Lana'
				]
			},{
				Offset:0x8cb24,
				Names:[
					'Cia',
					'Volga',
					'Wizzro',
					'Twili Midna',
					'Young Link',
					'Tingle',
					'Ganon',
					'Cucco',
					'Linkle',
					'Skull Kid',
					'Toon Link',
					'Tetra',
					'King Daphnes',
					'Medli',
					'Marin',
					'Toon Zelda',
					'Ravio',
					'Yuga'
				]
			}
		],

		MAPS:[
			{
				Title:'Adventure Map',
				Offset:0x141e8,
				Items:[
					'Compass',
					'Bombs',
					'Candle',
					'Ladder',
					'Power Bracelet',
					'Water Bombs',
					'Digging Mitts',
					'Ice Arrows',
					'Raft',
					'Hookshot',
					'Recorder',
					'Goddess\'s Harp'
				]
			},{
				Title:'Master Quest Map',
				Offset: 0x19240,
				Items:[
					'Compass',
					'Bombs',
					'Candle',
					'Ladder',
					'Power Bracelet',
					'Water Bombs',
					'Digging Mitts',
					'Ice Arrows',
					'Raft',
					'Hookshot',
					'Recorder',
					'Goddess\'s Harp'
				]
			},{
				Title:'Twilight Map',
				Offset: 0x1Ba6c,
				Items:[
					'Compass',
					'Bombs',
					null,
					null,
					null,
					'Water Bombs',
					'Digging Mitts',
					null,
					null,
					null,
					null,
					null,
					'Lantern',
					'Jar',
					'Fishing Rod',
					'Clawshot',
					'Spinner',
					'Ooccoo',
					'Tears of Light',
					'Tears of Twilight'
				]
			},{
				Title:'Termina Map',
				Offset:0x1e298,
				Items:[
					'Compass',
					'Bombs',
					null,
					null,
					null,
					null,
					null,
					'Ice Arrows',
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					'Song of Time',
					'Inverted Song of Time',
					'Deku Stick',
					'Deku Mask',
					'Goron Mask',
					'Zora Mask',
					'Mask of Truth',
					'Majora\'s Mask',
					'Giant Summon'
				]
			}
		],


		RUPEES_OFFSET:			0x14c,
		MATERIALS_OFFSET:		0x13d2c,
		MATERIALS_DISCOVERED:	0x13e2c,
		MATERIALS_DISCOVERED_ALL:[
			0xff, 0xff, 0xff, 0xff,
			0xff, 0xff, 0xff, 0xff,
			0xff, 0x1f, 0x00, 0x00
		],
		MATERIALS:[
			'Metal Plate',
			'Monster Tooth',
			'Old Rag',
			'Soldier\'s Uniform',
			'Rock',
			'Aeralfos Leather',
			'Fiery Aeralfos Leather',
			'Gibdo Bandage',
			'ReDead Bandage',
			'Lizalfos Scale',
			'Dinolfos Fang',
			'Moblin Flank',
			'Shield-Moblin Helmet',
			'Piece of Darknut Armor',
			'Stalmaster Wrist Bone',
			'Big Poe Necklace',
			'Essence of Icy Big Poe',
			'Hylian Captain Gauntlet',
			'Goron Armor Breastplate',
			'Ganon\'s Mane',
			'King Dodongo\'s Claws',
			'Gohma\'s Acid',
			'Manhandla\'s Toxic Dust',
			'Argorok\'s Embers',
			'The Imprisoned\'s Scales',
			'Cia\'s Bracelet',
			'Volga\'s Helmet',
			'Wizzro\'s Robe',
			'Link\'s Boots',
			'Lana\'s Hair Clip',
			'Zelda\'s Brooch',
			'Impa\'s Hair Band',
			'Ganondorf\'s Gauntlet',
			'Sheik\'s Kunai',
			'Darunia\'s Spikes',
			'Ruto\'s Earrings',
			'Agitha\'s Basket',
			'Midna\'s Hair',
			'Fi\'s Heels',
			'Ghirahim\'s Sash',
			'Zant\'s Magic Gem',
			'Round Aeralfos Shield',
			'Fiery Aeralfos Wing',
			'Heavy Gibdo Sword',
			'ReDead Knight Ashes',
			'Lizalfos Gauntlet',
			'Dinolfos Arm Guard',
			'Moblin Spear',
			'Metal Moblin Shield',
			'Large Darknut Sword',
			'Stalmaster\'s Skull',
			'Big Poe\'s Lantern',
			'Icy Big Poe\'s Talisman',
			'Holy Hylian Shield',
			'Thick Goron Helmet',
			'Ganon\'s Fang',
			'King Dodongo\'s Crystal',
			'Gohma\'s Lens',
			'Manhandla\'s Sapling',
			'Argorok\'s Stone',
			'The Imprisoned\'s Pillar',
			'Cia\'s Staff',
			'Volga\'s Dragon Spear',
			'Wizzro\'s Ring',
			'Link\'s Scarf',
			'Lana\'s Cloak',
			'Zelda\'s Tiara',
			'Impa\'s Breastplate',
			'Ganondorf\'s Jewel',
			'Sheik\'s Turban',
			'Darunia\'s Bracelet',
			'Ruto\'s Scale',
			'Agitha\'s Pendant',
			'Midna\'s Fused Shadow',
			'Fi\'s Crystal',
			'Ghirahim\'s Cape',
			'Zant\'s Helmet'
		],

		MAX_WEAPONS:1030,
		WEAPONS_OFFSET:0x8d74c,
		WEAPON_SIZE:0x4c,
		WEAPON_TYPES:[
			{value:0, name:'(no weapon)'},
			{value:1, name:'Normal weapon (blank?)'},
			{value:2, name:'Normal weapon (NEW)'},
			{value:3, name:'Normal weapon'},
			{value:9, name:'Master Sword (blank?)'},
			{value:10, name:'Master sword (NEW)'},
			{value:11, name:'Master sword'},
			{value:17, name:'Legendary skill (blank?)'},
			{value:18, name:'Legendary skill (NEW)'},
			{value:19, name:'Legendary skill'},
			{value:25, name:'MS+LS (hack, blank?)'},
			{value:26, name:'MS+LS (hack, NEW)'},
			{value:27, name:'MS+LS (hack)'}
		],
		WEAPON_IDS:[
			'Knight\'s Sword (Link - Hylian Sword Level 1)',
			'White Sword (Link - Hylian Sword Level 2)',
			'Magical Sword (Link - Hylian Sword Level 3)',
			'Fire Rod (Link - Magic Rod Level 1)',
			'Prism Rod (Link - Magic Rod Level 2)',
			'Magical Rod (Link - Magic Rod Level 3)',
			'Great Fountain Fairy (Link - Great Fairy Level 1)',
			'Great Forest Fairy (Link - Great Fairy Level 2)',
			'Great Sky Fairy (Link - Great Fairy Level 3)',
			'Silver Gauntlets (Link - Gauntlets Level 1)',
			'Golden Gauntlets (Link - Gauntlets Level 2)',
			'Power Gloves (Link - Gauntlets Level 3)',
			'Spirit\'s Tome (Lana - Book of Sorcery Level 1)',
			'Sealing Tome (Lana - Book of Sorcery Level 2)',
			'Sorceress Tome (Lana - Book of Sorcery Level 3)',
			'Deku Spear (Lana - Spear Level 1)',
			'Kokiri Spear (Lana - Spear Level 2)',
			'Faron Spear (Lana - Spear Level 3)',
			'Gate of Time (Lana - Summoning Gate Level 1)',
			'Guardian\'s Gate (Lana - Summoning Gate Level 2)',
			'Gate of Souls (Lana - Summoning Gate Level 3)',
			'Polished Rapier (Zelda - Rapier Level 1)',
			'Glittering Rapier (Zelda - Rapier Level 2)',
			'Gleaming Rapier (Zelda - Rapier Level 3)',
			'Wind Waker (Zelda - Baton Level 1)',
			'Sacred Baton (Zelda - Baton Level 2)',
			'Glorious Baton (Zelda - Baton Level 3)',
			'Giant\'s Knife (Impa - Giant Blade Level 1)',
			'Biggoron\'s Knife (Impa - Giant Blade Level 2)',
			'Biggoron\'s Sword (Impa - Giant Blade Level 3)',
			'Guardian Naginata (Impa - Naginata Level 1)',
			'Scorching Naginata (Impa - Naginata Level 2)',
			'Sheikah Naginata (Impa - Naginata Level 3)',
			'Swords of Despair (Ganondorf - Great Swords Level 1)',
			'Swords of Darkness (Ganondorf - Great Swords Level 2)',
			'Swords of Demise (Ganondorf - Great Swords Level 3)',
			'Goddess\'s Harp (Sheik - Harp Level 1)',
			'Typhoon Harp (Sheik - Harp Level 2)',
			'Triforce Harp (Sheik - Harp Level 3)',
			'Magic Hammer (Darunia - Hammer Level 1)',
			'Igneous Hammer (Darunia - Hammer Level 2)',
			'Megaton Hammer (Darunia - Hammer Level 3)',
			'Silver Scale (Ruto - Zora Scale Level 1)',
			'Golden Scale (Ruto - Zora Scale Level 2)',
			'Water Dragon Scale (Ruto - Zora Scale Level 3)',
			'Butterfly Parasol (Agitha - Parasol Level 1)',
			'Luna Parasol (Agitha - Parasol Level 2)',
			'Princess Parasol (Agitha - Parasol Level 3)',
			'Cursed Shackle (Midna - Shackle Level 1)',
			'Twilight Shackle (Midna - Shackle Level 2)',
			'Sol Shackle (Midna - Shackle Level 3)',
			'Goddess Sword (Fi - Goddess Blade Level 1)',
			'Goddess Longsword (Fi - Goddess Blade Level 2)',
			'True Goddess Blade (Fi - Goddess Blade Level 3)',
			'Demon Tribe Sword (Ghirahim - Demon Blade Level 1)',
			'Demon Longsword (Ghirahim - Demon Blade Level 2)',
			'True Demon Blade (Ghirahim - Demon Blade Level 3)',
			'Usurper\'s Scimitars (Zant - Scimitars Level 1)',
			'Shadow Scimitars (Zant - Scimitars Level 2)',
			'Scimitars of Twilight (Zant - Scimitars Level 3)',
			'[unknown weapon]',
			'Master Sword (Link - Master Sword)',
			'8-Bit Wooden Sword (Link - Hylian Sword Level 3)',
			'8-Bit Candle (Link - Magic Rod Level 3)',
			'8-Bit Fairy (Link - Great Fairy Level 3)',
			'8-Bit Power Bracelets (Link - Gauntlets Level 3)',
			'8-Bit Book of Magic (Lana - Book of Sorcery Level 3)',
			'8-Bit Magical Rod? (Lana - Spear Level 3)',
			'8-Bit Compass (Lana - Summoning Gate Level 3)',
			'8-Bit White Sword? (Zelda - Rapier Level 3)',
			'8-Bit Recorder (Zelda - Baton Level 3)',
			'8-Bit Boomerang? (Impa - Giant Blade Level 3)',
			'8-Bit Magical Sword? (Impa - Naginata Level 3)',
			'8-Bit Magical Keys (Ganondorf - Great Swords Level 3)',
			'8-Bit Stepladder (Sheik - Harp Level 3)',
			'8-Bit Food (Darunia - Hammer Level 3)',
			'8-Bit Clock (Ruto - Zora Scale Level 3)',
			'8-Bit Rupee (Agitha - Parasol Level 3)',
			'8-Bit Red Ring (Midna - Shackle Level 3)',
			'8-Bit Silver Arrow (Fi - Goddess Blade Level 3)',
			'8-Bit Arrow (Ghirahim - Demon Blade Level 3)',
			'8-Bit Magic Boomerangs (Zant - Scimitars Level 3)',
			'Scepter of Time (Cia - Scepter Level 1)',
			'Guardian\'s Scepter (Cia - Scepter Level 2)',
			'Scepter of Souls (Cia - Scepter Level 3)',
			'Dragonbone Pike (Volga - Dragon Spear Level 1)',
			'Stonecleaver Claw (Volga - Dragon Spear Level 2)',
			'Flesh-Render Fang (Volga - Dragon Spear Level 3)',
			'Blue Ring (Wizzro - Ring Level 1)',
			'Red Ring (Wizzro - Ring Level 2)',
			'Magical Ring (Wizzro - Ring Level 3)',
			'Epona (Link - Horse Level 1)',
			'Twilight Epona (Link - Horse Level 2)',
			'Epona of Time (Link - Horse Level 3)',
			'Mirror of Shadows (Twili Midna - Mirror Level 1)',
			'Mirror of Silence (Twili Midna - Mirror Level 2)',
			'Mirror of Twilight (Twili Midna - Mirror Level 3)',
			'Ancient Spinner (Link - Spinner Level 1)',
			'Enhanced Spinner (Link - Spinner Level 2)',
			'Triforce Spinner (Link - Spinner Level 3)',
			'Old Dominion Rod (Zelda - Dominion Rod Level 1)',
			'High Dominion Rod (Zelda - Dominion Rod Level 2)',
			'Royal Dominion Rod (Zelda - Dominion Rod Level 3)',
			'Fierce Deity Mask (Young Link - Mask Level 1)',
			'Furious Deity Mask (Young Link - Mask Level 2)',
			'Vengeful Deity Mask (Young Link - Mask Level 3)',
			'Rosy Balloon (Tingle - Balloon Level 1)',
			'Love-Filled Balloon (Tingle - Balloon Level 2)',
			'Mr. Fairy Balloon (Tingle - Balloon Level 3)',
			'*** Ganon\'s Rage (Ganon) RESERVED, DO NOT USE ***',
			'*** Cucco\'s Spirit (Cucco) RESERVED, DO NOT USE ***',
			'Thief\'s Trident (Ganondorf - Trident Level 1)',
			'King of Evil Trident (Ganondorf - Trident Level 2)',
			'Trident of Demise (Ganondorf - Trident Level 3)',
			'Simple Crossbows (Linkle - Crossbows Level 1)',
			'Hylian Crossbows (Linkle - Crossbows Level 2)',
			'Legend\'s Crossbows (Linkle - Crossbows Level 3)',
			'Fairy Ocarina (Skull Kid - Ocarina Level 1)',
			'Lunar Ocarina (Skull Kid - Ocarina Level 2)',
			'Majora\'s Ocarina (Skull Kid - Ocarina Level 3)',
			'Hero\'s Sword (Toon Link - Light Sword Level 1)',
			'Phantom Sword (Toon Link - Light Sword Level 2)',
			'Lokomo Sword (Toon Link - Light Sword Level 3)',
			'Pirate Cutlass (Tetra - Cutlass Level 1)',
			'Jeweled Cutlass (Tetra - Cutlass Level 2)',
			'Regal Cutlass (Tetra - Cutlass Level 3)',
			'Windfall Sail (King Daphnes - Sail Level 1)',
			'Swift Sail (King Daphnes - Sail Level 2)',
			'Sail of Red Lions (King Daphnes - Sail Level 3)',
			'Sacred Harp (Medli - Rito Harp Level 1)',
			'Earth God\'s Harp (Medli - Rito Harp Level 2)',
			'Din\'s Harp (Medli - Rito Harp Level 3)',
			'Sea Lily\'s Bell (Marin - Bell Level 1)',
			'Wavelet Bell (Marin - Bell Level 2)',
			'Awakening Bell (Marin - Bell Level 3)',
			'Winged Boots (Linkle - Boots Level 1)',
			'Roc Boots (Linkle - Boots Level 2)',
			'Pegasus Boots (Linkle - Boots Level 3)',
			'Protector Sword (Toon Zelda - Sword Level 1)',
			'Warp Sword (Toon Zelda - Sword Level 2)',
			'Wrecker Sword (Toon Zelda - Sword Level 3)',
			'Sand Wand (Toon Link - Wand Level 1)',
			'Jeweled Sand Wand (Toon Link - Wand Level 2)',
			'Nice Sand Wand (Toon Link - Wand Level 3)',
			'Wooden Hammer (Ravio - Rental Hammer Level 1)',
			'White Bunny Hammer (Ravio - Rental Hammer Level 2)',
			'Nice Hammer (Ravio - Rental Hammer Level 3)',
			'Wooden Frame (Yuga - Picture Frame Level 1)',
			'Frame of Sealing (Yuga - Picture Frame Level 2)',
			'Demon King\'s Frame (Yuga - Picture Frame Level 3)',
			'Unknown (Unk - Unk Level 1)',
			'Unknown (Unk - Unk Level 2)',
			'Unknown (Unk - Unk Level 3)',
			{value:4294967295,name:'-'}
		],
		WEAPON_SKILLS:[
			'(blank)',
			'Strong Att.+',
			'Strength II',
			'Strength III',
			'Strength IV',
			'Strength V',
			'Strength VI',
			'Fire+',
			'Water+',
			'Lightning+',
			'Light+',
			'Darkness+',
			'VS Legend',
			'VS Time',
			'VS Twilight',
			'VS Skyward',
			'VS Sorceress',
			'VS Beast',
			'VS Dragon',
			'VS Undead',
			'VS Soldier',
			'VS Ganon',
			'EXP+',
			'Rupees+',
			'Materials+',
			'Slots+',
			'Stars+',
			'Hearts+',
			'Health+',
			'Special+',
			'Bombs+',
			'Arrows+',
			'Boomerang+',
			'Hookshot+',
			'One-Hit Kill',
			'Sturdy Feet',
			'Regen',
			'Defenseless',
			'No Healing',
			'Adversity',
			'Compatriot',
			'Evil\'s Bane',
			'Legendary',
			'Special Attack+',
			'Finishing Blow+',
			'Regular Attack+',
			'Heart-strong',
			'Focus Spirit+',
			'Hasty Attacks',
			{value:4294967295,name:'-'}
		]
	},

	/* private functions */
	discoverMaterials:function(){
		hide('button-discover-materials'); 	
		for(var i=0; i<this.Constants.MATERIALS_DISCOVERED_ALL.length; i++){
			tempFile.writeU8(this.Constants.MATERIALS_DISCOVERED+i, this.Constants.MATERIALS_DISCOVERED_ALL[i]);
		}
		MarcDialogs.alert('All materials are now discovered (won\'t appear as ??? in-game)');
	},
	_getWeaponOffset:function(){
		return this.Constants.WEAPONS_OFFSET+this.Constants.WEAPON_SIZE*currentWeapon
	},
	_selectWeapon:function(i){
		currentWeapon=i;

		var offset=this._getWeaponOffset();
		setValue('weapon-type', tempFile.readU8(offset+0x00));
		setValue('weapon-id', tempFile.readU32(offset+0x04));
		setValue('weapon-base-power', tempFile.readU16(offset+0x08));
		setValue('weapon-stars', tempFile.readU16(offset+0x0a));
		for(var i=0; i<8; i++){
			setValue('weapon-skill'+i, tempFile.readU32(offset+0x0c+0x04*i));
			setValue('weapon-koskill'+i, tempFile.readU32(offset+0x2c+0x04*i));
		}

		SavegameEditor._calculateWeaponPower();
	},
	_writeWeapon:function(){
		var offset=SavegameEditor._getWeaponOffset();
		tempFile.writeU8(offset+0x00, getValue('weapon-type'));
		tempFile.writeU32(offset+0x04, getValue('weapon-id'));
		tempFile.writeU16(offset+0x08, getValue('weapon-base-power'));
		tempFile.writeU16(offset+0x0a, getValue('weapon-stars'));
		for(var i=0; i<8; i++){
			tempFile.writeU32(offset+0x0c+0x04*i, getValue('weapon-skill'+i));
			tempFile.writeU32(offset+0x2c+0x04*i, getValue('weapon-koskill'+i));
		}

		SavegameEditor._calculateWeaponPower();
	},
	_calculateWeaponPower:function(){
		var legendaryType=getValue('weapon-type') & 0x10;
		var legendarySkill=false;
		var evilsBane=getValue('weapon-type') & 0x20;
		var evilsBaneSkill=false;
		for(var i=0;i<8;i++){
			if(getValue('weapon-skill'+i)==0x2a && getValue('weapon-koskill'+i)==0){
				legendarySkill=true;
			}else if(getValue('weapon-skill'+i)==0x29 && getValue('weapon-koskill'+i)==0){
				evilsBaneSkill=true;
			}
		}
		var actualBasePower=0;
		var basePower=parseInt(getValue('weapon-base-power'));

		if(legendaryType && legendarySkill){
			actualBasePower=300
		}else{
			actualBasePower=basePower
		}

		var stars=parseInt(getValue('weapon-stars'));
		var starBonus=actualBasePower/10;

		if(evilsBane && evilsBaneSkill){
			actualBasePower+=200
		}
		var finalPower = Math.ceil(actualBasePower+(starBonus*stars))

		setValue('weapon-power', finalPower);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==3145728)
	},


	/* load function */
	load:function(){
		tempFile.littleEndian=false;
		tempFile.fileName='APP.BIN';


		/* MATERIALS */
		setValue('rupees', tempFile.readU32(this.Constants.RUPEES_OFFSET), 0, 9999999);
		for(var i=0; i<this.Constants.MATERIALS.length; i++){
			get('row-materials').appendChild(col(3, label('number-material'+i, this.Constants.MATERIALS[i])));
			get('row-materials').appendChild(col(1, inputNumber('material'+i, 0, 999, tempFile.readU16(this.Constants.MATERIALS_OFFSET+i*2))));
		}


		/* CHARACTERS */
		for(var i=0; i<this.Constants.CHARACTER_PACKS.length; i++){
			var names=this.Constants.CHARACTER_PACKS[i].Names;

			for(var j=0; j<names.length; j++){
				var offset=this.Constants.CHARACTER_PACKS[i].Offset+j*this.Constants.CHARACTER_SIZE;
				var level=tempFile.readU8(offset+this.Constants.CHARACTER_LEVEL_OFFSET);
				if(level==0xf00){
					this.Constants.CHARACTER_PACKS[i].Names[j]=null; //set this character to null, so it won't be updated on saving
				}else if(names[j]){
					get('row-characters').appendChild(
						col(3, span(names[j]))
					);
					get('row-characters').appendChild(
						col(3, inputNumber('characters'+i+'_damage'+j, 0, 99999999, tempFile.readU16(offset)))
					);
					get('row-characters').appendChild(
						col(3, inputNumber('characters'+i+'_level'+j, 1, 255, level+1))
					);
					get('row-characters').appendChild(
						col(3, inputNumber('characters'+i+'_exp'+j, 0, 12842457, tempFile.readU32(offset+this.Constants.CHARACTER_EXP_OFFSET)))
					);

					var regexName=new RegExp(' \\('+names[j]+' - ');
					var weaponsByName=[];
					for(var k=0; k<this.Constants.WEAPON_IDS.length;k++){
						if(regexName.test(this.Constants.WEAPON_IDS[k])){
							weaponsByName.push(k);
						}
					}
					weaponFilters.push(weaponsByName);
				}
			}
		}


		/* MAPS */
		var maps=[];
		for(var i=0; i<this.Constants.MAPS.length; i++){
			var map=this.Constants.MAPS[i];
			maps.push(map.Title);

			var mapDiv=row([]);
			mapDiv.style.display=(i==0)?'flex':'none';

			get('maps').appendChild(mapDiv);
			
			for(var j=0; j<map.Items.length; j++){
				if(map.Items[j]){
					mapDiv.appendChild(col(4, label('number-map'+i+'-item'+j, map.Items[j])));
					mapDiv.appendChild(col(2, inputNumber('map'+i+'-item'+j, 0, 5, tempFile.readU8(map.Offset+j))));
				}
			}
		}
		var selectMap=select('map', maps, function(){
			for(var i=0; i<SavegameEditor.Constants.MAPS.length; i++){
				get('maps').children[i].style.display=(this.value==i)?'flex':'none';
			}
		});
		selectMap.className='';
		get('container-select-map').appendChild(selectMap);

		/* WEAPONS */
		for(var i=0; i<8; i++){
			var KOsToUnlockInput=inputNumber('weapon-koskill'+i, 0, 9999999);
			KOsToUnlockInput.addEventListener('change', this._writeWeapon, false);

			document.getElementById('weapons-skills-container').appendChild(
				row(
					[3,3,3,3],
					label('weapon-skill'+i, 'Skill '+(i+1)),
					select('weapon-skill'+i, this.Constants.WEAPON_SKILLS, this._writeWeapon),
					label('weapon-koskill'+i, 'KOs to unlock'),
					KOsToUnlockInput
				)
			);
		}
		get('container-select-weapon').appendChild(select('weapon', genRange(0,this.Constants.MAX_WEAPONS-1), function(){SavegameEditor._selectWeapon(this.value)}));
		get('container-weapon-type').appendChild(select('weapon-type', this.Constants.WEAPON_TYPES, this._writeWeapon));
		get('container-weapon-id').appendChild(select('weapon-id', this.Constants.WEAPON_IDS, this._writeWeapon));
		get('container-weapon-base-power').appendChild(select('weapon-base-power', ['-', {value:80,name:'Level 1 (80)'}, {value:150,name:'Level 2 (150)'}, {value:280,name:'Level 3 (280)'}, {value:300,name:'Master Sword (300)'}], this._writeWeapon));
		get('container-weapon-stars').appendChild(select('weapon-stars', genRange(0,5), this._writeWeapon));
		


		this._selectWeapon(0);
	},


	/* save function */
	save:function(){
		/* MATERIALS */
		tempFile.writeU32(this.Constants.RUPEES_OFFSET, getValue('rupees'));
		for(var i=0; i<this.Constants.MATERIALS.length; i++){
			tempFile.writeU16(this.Constants.MATERIALS_OFFSET+i*2, getValue('material'+i));
		}


		/* CHARACTERS */
		for(var i=0; i<this.Constants.CHARACTER_PACKS.length; i++){
			var names=this.Constants.CHARACTER_PACKS[i].Names;
			for(var j=0; j<names.length; j++){
				if(names[j]){
					var offset=this.Constants.CHARACTER_PACKS[i].Offset+j*this.Constants.CHARACTER_SIZE;

					tempFile.writeU16(offset, getValue('characters'+i+'_damage'+j));
					tempFile.writeU8(offset+this.Constants.CHARACTER_LEVEL_OFFSET, getValue('characters'+i+'_level'+j)-1);
					tempFile.writeU32(offset+this.Constants.CHARACTER_EXP_OFFSET, getValue('characters'+i+'_exp'+j));
				}
			}
		}


		/* MAPS */
		var maps=[];
		for(var i=0; i<this.Constants.MAPS.length; i++){
			var map=this.Constants.MAPS[i];
			
			for(var j=0; j<map.Items.length; j++){
				if(map.Items[j]){
					tempFile.writeU8(map.Offset+j, getValue('map'+i+'-item'+j));
				}
			}
		}
	}
}