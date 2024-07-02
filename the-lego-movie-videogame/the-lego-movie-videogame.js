/*
	Picross 3D round 2 for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/

SavegameEditor={
	Name:'The Lego Movie Videogame',
	Filename:'savegame.dat',

	/* Constants */
	Constants:{
		BLUE_STONES_OFFSET:0x228, // 552
		CHALLENGE_OFFSET:0x8,
		CHARACTERS:[
			{value:1, name:'Abraham Lincoln'},
			{value:2, name:'Bad Cop'},
			{value:3, name:'Bandit'},
			{value:4, name:'Batman'},
			{value:5, name:'Benny'},
			{value:6, name:'Blaze Firefighter'},
			{value:7, name:'Bruce Wayne'},
			{value:8, name:'Calamity Drone'},
			{value:9, name:'Cardio Carrie'},
			{value:10, name:'Cavalry'},
			{value:11, name:'Caveman'},
			{value:12, name:'Cleopatra'},
			{value:13, name:'Deputron'},
			{value:14, name:'Dr McScrubs'},
			{value:15, name:'El Macho Wrestler'},
			{value:16, name:'Emmet (Piece of Resistance)'},
			{value:17, name:'Emmet (Clown)'},
			{value:18, name:'Emmet (Construction)'},
			{value:19, name:'Emmet (Lizard)'},
			{value:20, name:'Emmet (Magician)'},
			{value:21, name:'Emmet (Master Builder)'},
			{value:22, name:'Emmet (PJs)'},
			{value:23, name:'Emmet (Robin Hood)'},
			{value:24, name:'Emmet (Robot)'},
			{value:25, name:'Emmet (Shower)'},
			{value:26, name:'Emmet (Surgeon)'},
			{value:27, name:'Emmet (Old West)'},
			{value:28, name:'Foreman Frank'},
			{value:29, name:'Gail'},
			{value:30, name:'Gallanz Guard'},
			{value:31, name:'Gandalf'},
			{value:32, name:'Garbage Man Dan'},
			{value:33, name:'Good Cop'},
			{value:34, name:'Good Cop (Scribble Face)'},
			{value:35, name:'Gordon Zola'},
			{value:36, name:'Green Lantern'},
			{value:37, name:'Green Ninja'},
			{value:38, name:'Hank Haystack'},
			{value:39, name:'Ice Cream Jo'},
			{value:40, name:'Johnny Thunder'},
			{value:41, name:'Kabob Bob'},
			{value:42, name:'Lady Liberty'},
			{value:43, name:'Larry the Barrista'},
			{value:44, name:'Swamp Creature'},
			{value:45, name:'Lord Business'},
			{value:46, name:'Lord Vampyre'},
			{value:47, name:'Ma Cop'},
			{value:48, name:'Michelangelo'},
			{value:49, name:'Mrs Scratchen-Post'},
			{value:50, name:'Mummy'},
			{value:51, name:'Native Chief'},
			{value:52, name:'Native Warrior'},
			{value:53, name:'Outlaw'},
			{value:54, name:'Pa Cop'},
			{value:55, name:'Panda Guy'},
			{value:56, name:'Plumber Joe'},
			{value:57, name:'President Business'},
			{value:58, name:'Prospector'},
			{value:59, name:'Robo Construction'},
			{value:60, name:'Robo Cowboy'},
			{value:61, name:'Robo Demolition'},
			{value:62, name:'?????'},
			{value:63, name:'Robo Pilot'},
			{value:64, name:'Robo Receptionist'},
			{value:65, name:'Rootbeer Belle'},
			{value:66, name:'S.S.P Officer'},
			{value:67, name:'S.S.P Officer (Beanie)'},
			{value:68, name:'S.S.P Officer (Heavy)'},
			{value:69, name:'S.S.P Officer (SWAT)'},
			{value:70, name:'Sharon Shoehorn'},
			{value:71, name:'Sheriff Not-A-Robot'},
			{value:72, name:'Sir Stackabrick'},
			{value:73, name:'Sudds Backwash'},
			{value:74, name:'Superman'},
			{value:75, name:'Taco Tuesday Guy'},
			{value:76, name:'Test Dummy'},
			{value:77, name:'Unikitty'},
			{value:78, name:'Unikitty (Business)'},
			{value:79, name:'Unikitty (Queasy)'},
			{value:80, name:'Unikitty (Space)'},
			{value:81, name:'Velma Staplebot'},
			{value:82, name:'Vitruvius'},
			{value:83, name:'Vitruvius (Young)'},
			{value:84, name:'"Where Are My Pants?" Guy'},
			{value:85, name:'Wiley Fusebot'},
			{value:86, name:'William Shakespeare'},
			{value:87, name:'Wonder Woman'},
			{value:88, name:'Wyldstyle'},
			{value:89, name:'Wyldstyle (Hooded)'},
			{value:90, name:'Wyldstyle (Robot)'},
			{value:91, name:'Wyldstyle (Space)'},
			{value:92, name:'Wyldtyle (Old West)'}
		],
		SETTINGS_MUSIC_MICROPHONE_OFFSET:0x18, // 00=All OFF, A0=Music ON, 0A=Microphone ON, AA=All ON
		LANGUAGE_OFFSET:0x19,
		LANGUAGES:[
			{value:1, name:'English'},
			{value:2, name:'French'},
			{value:3, name:'Italian'},
			{value:4, name:'German'},
			{value:5, name:'Spanish'},
			{value:6, name:'Dutch'},
			{value:7, name:'Danish'}
		],
		LEVELS:[
			{value:1, name:'Prologue - The Prophecy'},
			{value:2, name:'Prologue - Building Site'},
			{value:3, name:'Prologue - The Piece'},
			{value:4, name:'Police Station - Melting Chamber'},
			{value:5, name:'Police Station - Alley Escape'},
			{value:6, name:'Police Station - Bike Chase'},
			{value:7, name:'Flatbush Gulch - The Portal'},
			{value:8, name:'Flatbush Gulch - Hillside Slide'},
			{value:9, name:'Flatbush Gulch - Desert Path'},
			{value:10, name:'Flatbush Town - Town Outskirts'},
			{value:11, name:'Flatbush Town - Town Entrance'},
			{value:12, name:'Flatbush Town - Saloon Showdown'},
			{value:13, name:'Flatbush Rooftops - Rooftop Ambush'},
			{value:14, name:'Flatbush Rooftops - Rooftop Escape'},
			{value:15, name:'Flatbush Rooftops - Rooftop Brawl'},
			{value:16, name:'Flatbush Chase - Flatbush Canyon'},
			{value:17, name:'Flatbush Chase - Train Escape'},
			{value:18, name:'Flatbush Chase - Train Engine'},
			{value:19, name:'Cloud Cuckoo Land - Middle Zealand'},
			{value:20, name:'Cloud Cuckoo Land - Cloud Entrance'},
			{value:21, name:'Cloud Cuckoo Land - Dance Street'},
			{value:22, name:'Cloud Under Attack - Cloud Escape'},
			{value:23, name:'Cloud Under Attack - Cuckoo Castle'},
			{value:24, name:'Cloud Under Attack - Dropship Chase'},
			{value:25, name:'Submarine - Submarine Attack'},
			{value:26, name:'Submarine - Submarine Interior'},
			{value:27, name:'Submarine - MetalBeard\'s Ship'},
			{value:28, name:'Business HQ - Octan Airlock'},
			{value:29, name:'Business HQ - Octan Hangar'},
			{value:30, name:'Business HQ - The Relic Room'},
			{value:31, name:'The Kragle - Assembly Room'},
			{value:32, name:'The Kragle - Kragle Shutdown'},
			{value:33, name:'The Kragle - Think Tank'},
			{value:34, name:'TV Station - Office Corridors'},
			{value:35, name:'TV Station - Server Room'},
			{value:36, name:'TV Station - TV Broadcast'},
			{value:37, name:'Spaceship Escape - TV Prop Room'},
			{value:38, name:'Spaceship Escape - Middle Zealand Canyons'},
			{value:39, name:'Spaceship Escape - Bricksburg Skies'},
			{value:40, name:'Attack on Bricksburg - Return to Bricksburg'},
			{value:41, name:'Attack on Bricksburg - Bricksburg Streets'},
			{value:42, name:'Attack on Bricksburg - Bricksburg Assault'},
			{value:43, name:'The Cube Ship - Battle for Bricksburg'},
			{value:44, name:'The Cube Ship - Cube Ship Approach'},
			{value:45, name:'The Cube Ship - Business Time'}
		],
		PROFILES:[
			{value:1, name:'Save slot 1', offset:0x1c}, // 28
			{value:2, name:'Save slot 2', offset:0x4fc} // 1276
		],
		PROFILE_SELECTION_OFFSET:0x1A,
		UPGRADES:[
			{value: 1, name:'X2 Stud Multiplier'},
			{value: 2, name:'X4 Stud Multiplier'},
			{value: 3, name:'X6 Stud Multiplier'},
			{value: 4, name:'X8 Stud Multiplier'},
			{value: 5, name:'Extra Heart'},
			{value: 6, name:'Bubble Effects'},
			{value: 7, name:'Confetti Effects'},
			{value: 8, name:'Stud Magnet'},
			{value: 9, name:'Health Regeneration'},
			{value: 10, name:'Invicibility'},
			{value: 11, name:'Mini Game Master'},
			{value: 12, name:'Fast Builder'},
			{value: 13, name:'Collectable Detector'},
			{value: 14, name:'Fast Use'},
			{value: 15, name:'Always Charged'}
			
		],
		YELLOW_STONE_OFFSET_UNEVEN:0x238, // 568
		YELLOW_STONE_OFFSET_EVEN:0x240 // 576
	},
	_getProfileOffset:function(){
		return this.Constants.PROFILES[Number(getValue('profile-selector')) - 1].offset;
	},
	_write_language:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.LANGUAGE_OFFSET,
			getValue('language')
		);
	},
	_get_level_stone_offset:function(){
		var profileStartOffset = SavegameEditor._getProfileOffset();
		var lvl = Number(getValue('levels'));
		if (lvl % 2 == 1) {
			return profileStartOffset + SavegameEditor.Constants.YELLOW_STONE_OFFSET_UNEVEN + ((lvl - 1) * 0.5) * 16;
		} else {
			return profileStartOffset + SavegameEditor.Constants.YELLOW_STONE_OFFSET_EVEN + lvl * 0.5 * 16 - 16;
		}
	},
	_write_level_stones:function(){
		tempFile.writeU24(
			SavegameEditor._get_level_stone_offset(),
			getValue('level-stones')
		);
	},
	_write_blue_stones:function(){
		var profileStartOffset = SavegameEditor._getProfileOffset();
		tempFile.writeU24(
			profileStartOffset + SavegameEditor.Constants.BLUE_STONES_OFFSET,
			getValue('blue-stones')
		);
	},
	_write_sound_settings:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET,
			(getField('checkbox-microphone').checked ? 10 : 0) + (getField('checkbox-music').checked ? 160 : 0)
		);
	},
	_load_level:function(){
		var profileStartOffset = SavegameEditor._getProfileOffset();
		var lvl = Number(getValue('levels'));
		setValue('level-stones', tempFile.readU24(SavegameEditor._get_level_stone_offset()));
		for (var i = 0; i < 10; i++) {
			getField('challenge-' + (i + 1) + '-unlocked').checked = tempFile.readU8(profileStartOffset + SavegameEditor.Constants.CHALLENGE_OFFSET + (lvl - 1) * 10 + i) === 1;
		}
	},
	_load_profile:function(){
		var profileStartOffset = SavegameEditor._getProfileOffset();
		
		setValue('blue-stones', tempFile.readU24(profileStartOffset + SavegameEditor.Constants.BLUE_STONES_OFFSET));
		setValue('levels', '1');
		SavegameEditor._load_level();
	},
	
	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==2524);
	},
	
	preload:function() {
		get('toolbar').children[0].appendChild(select('profile-selector', this.Constants.PROFILES, this._load_profile));
		get('container-language').appendChild(select('language', SavegameEditor.Constants.LANGUAGES, SavegameEditor._write_language));
		get('container-levelselection').appendChild(select('levels', SavegameEditor.Constants.LEVELS, SavegameEditor._load_level));
		for (var i = 0; i < 10; i++) {
			getField('challenge-' + (i + 1) + '-unlocked').addEventListener('change', function(e){
				var lvl = Number(getValue('levels'));
				tempFile.writeU8(
					SavegameEditor._getProfileOffset()+SavegameEditor.Constants.CHALLENGE_OFFSET+(lvl-1)*10+Number(e.target.dataset.challenge)-1,
					e.target.checked === true ? '1' : '0'
				);
			});
		}
		get('input-level-stones').addEventListener('change', SavegameEditor._write_level_stones);
		get('input-blue-stones').addEventListener('change', SavegameEditor._write_blue_stones);
		getField('checkbox-microphone').addEventListener('change', SavegameEditor._write_sound_settings);
		getField('checkbox-music').addEventListener('change', SavegameEditor._write_sound_settings);
		setNumericRange('blue-stones', 0, 16777215);
		var tmp1 = get('character-list');
		for (var j = 0; j < SavegameEditor.Constants.CHARACTERS.length; j++) {
			tmp1.appendChild(col(2,label('checkbox-character-'+j, SavegameEditor.Constants.CHARACTERS[j].name)));
			get('checkbox-character-'+j).className+=' text-right';
			tmp1.appendChild(col(1,checkbox('character-'+j,'')));
		}
		var tmp2 = get('upgrades-list');
		for (var k = 0; k < SavegameEditor.Constants.UPGRADES.length; k++) {
			tmp2.appendChild(col(4,label('checkbox-upgrades-'+k, SavegameEditor.Constants.UPGRADES[k].name)));
			get('checkbox-upgrades-'+k).className+=' text-right';
			tmp2.appendChild(col(2,checkbox('upgrades-'+k,'')));
		}
	},

	/* load function */
	load:function(){
		tempFile.fileName='SAVEGAME';
		tempFile.littleEndian=true;
		setValue('language', tempFile.readU8(SavegameEditor.Constants.LANGUAGE_OFFSET));
		setValue('savegame', 'Save game #' + (tempFile.readU8(SavegameEditor.Constants.PROFILE_SELECTION_OFFSET) + 1));
		getField('checkbox-microphone').checked = tempFile.readU8(SavegameEditor.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET)>0;
		getField('checkbox-music').checked = tempFile.readU8(SavegameEditor.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET)>100;
		this._load_profile();
	},


	/* save function */
	save:function(){
	}
};