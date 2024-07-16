/*
	Picross 3D round 2 for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/
function convert_to_bit(d){
	return ('00000000' + (d >>> 0).toString(2)).slice(-8).split('');
}
SavegameEditor={
	Name:'The Lego Movie Videogame',
	Filename:'savegame.dat',

	/* Constants */
	Constants:{
		BLUE_STONES_OFFSET:0x228, // 552
		CHALLENGE_OFFSET:0x8,
		CHARACTER_OFFSET:0x47C, // 1148
		CHARACTER_OPTIONS:[
			{value:0, name:'Locked'},
			{value:1, name:'Unlocked'},
			{value:2, name:'Unlocked+Bought'}
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
	/* CRC32 - from Alex - https://stackoverflow.com/a/18639999 */
	/* Combined with CRC32-Version by Slattz (https://github.com/Slattz/POTC3D_Rehash) */
	CRC32_TABLE:(function(){
		var c,crcTable=[];
		for(var n=0;n<256;n++){
			c=n;
			for(var k=0;k<8;k++)
				c=((c&1)?(0xedb88320^(c>>>1)):(c>>>1));
			crcTable[n]=(c>>>0);
		}
		return crcTable;
	}()),
	crc32:function(file, len, offset){
		var data=file.readBytes(offset, len-offset);
		var checksum=0xFF;
		var byte= 0b0;
		for (var i = 0; i < data.length; i++) {
			[byte]=new Int8Array([data[i]]);
			var [cs_] = new Int8Array([checksum]);
			byte^=cs_;
			byte&=0xff;
			var cs___ = (i===0 ? cs_ : checksum);
			var a = SavegameEditor.CRC32_TABLE[byte];
			checksum = a ^ (cs___>>>8);
		}
		console.log(checksum);
		return ((checksum>>>0)<<0)
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
	_write_character:function(e){
		var profileStartOffset = SavegameEditor._getProfileOffset();
		var offset = profileStartOffset + SavegameEditor.Constants.CHARACTER_OFFSET + Number(e.target.dataset.offset);
		var bits = convert_to_bit(tempFile.readU8(offset));
		var val = getValue(e.target.id);
		bits[e.target.dataset.offset_*2]=(val==='2' ? '1' : '0');
		bits[e.target.dataset.offset_*2+1]=(val!=='0' ? '1' : '0');
		tempFile.writeU8(
			offset,
			parseInt(bits.join(''), 2)
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
		var profileStartOffset = SavegameEditor._getProfileOffset();
		for (var c = 0; c < SavegameEditor.Constants.CHARACTERS.length; c++) {
			var field = getField('select-character-'+c);
			var a = convert_to_bit(tempFile.readU8(profileStartOffset + SavegameEditor.Constants.CHARACTER_OFFSET + Number(field.dataset.offset)));
			var b = (a[field.dataset.offset_*2]==='1') ? '2' : ((a[field.dataset.offset_*2+1]==='1') ? '1' : '0');
			setValue('character-'+c, Number(b));
		}
		SavegameEditor._load_level();
	},
	
	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==2524)
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
			tmp1.appendChild(col(2,span(SavegameEditor.Constants.CHARACTERS[j])));
			var sel=select('character-'+j,SavegameEditor.Constants.CHARACTER_OPTIONS, SavegameEditor._write_character);
			sel.dataset.offset=Math.floor(j*0.25);
			sel.dataset.offset_=3-(j-sel.dataset.offset*4);
			tmp1.appendChild(col(4,sel));
		}
		var tmp2 = get('upgrades-list');
		for (var k = 0; k < SavegameEditor.Constants.UPGRADES.length; k++) {
			tmp2.appendChild(col(4,label('checkbox-upgrades-'+k, SavegameEditor.Constants.UPGRADES[k].name)));
			tmp2.appendChild(col(2,checkbox('upgrades-'+k,'')));
			get('checkbox-upgrades-'+k).className+=' text-right';
		}
	},

	/* load function */
	load:function(){
		tempFile.fileName='savegame.dat';
		tempFile.littleEndian=true;
		console.log("Old CRC32 ",  tempFile.readU32(0));
		console.log("Calced CRC32 ", SavegameEditor.crc32(tempFile, tempFile.fileSize, 24));

		setValue('language', tempFile.readU8(SavegameEditor.Constants.LANGUAGE_OFFSET));
		setValue('savegame', 'Save game #' + (tempFile.readU8(SavegameEditor.Constants.PROFILE_SELECTION_OFFSET) + 1));
		getField('checkbox-microphone').checked = tempFile.readU8(SavegameEditor.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET)>0;
		getField('checkbox-music').checked = tempFile.readU8(SavegameEditor.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET)>100;
		this._load_profile();
	},


	/* save function */
	save:function(){
		console.log("New CRC32 ", SavegameEditor.crc32(tempFile, tempFile.fileSize, 24));
		tempFile.writeU32(
			0,
			SavegameEditor.crc32(tempFile, tempFile.fileSize, 24)
		)
	}
};
