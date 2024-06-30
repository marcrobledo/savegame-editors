/*
	Picross 3D round 2 for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/
var puzzles = [];
var tutorials = [];

SavegameEditor={
	Name:'Picross 3D: round 2',
	Filename:'SAVEDATA',

	AmiiboOffset:0x1a4c,

	/* Constants */
	Constants:{
		BACKGROUND_OFFSET:0x2232,
		BACKGROUND:[
			{value:0, name:'Argyle'},
			{value:1, name:'Clovers'},
			{value:2, name:'Flowers'},
			{value:3, name:'Nightshade'},
			{value:4, name:'Polka Dots'},
			{value:5, name:'Rainbow Board'},
			{value:6, name:'Vibrant Blooms'},
			{value:7, name:'Petit Fours'},
			{value:8, name:'Hearts & Diamonds'},
			{value:9, name:'Delightful Dots'},
			{value:10, name:'Lace'},
			{value:11, name:'Tiny Blooms'},
			{value:12, name:'Craft Paper'},
			{value:13, name:'Little Ducks'},
			{value:14, name:'Blocks'},
			{value:15, name:'Tartan'},
			{value:16, name:'Techno'},
			{value:17, name:'Special Puzzle'},
			{value:18, name:'Time Challenge'},
			{value:19, name:'One Chance'},
			{value:20, name:'Tutorial'},
			{value:254, name:'Random'},
			{value:255, name:'Default'}
		],
		DIFFICULTIES:[
			{value: 0, name: 'Easy'},
			{value: 1, name: 'Medium'},
			{value: 4, name: 'Hard'}
		],
		DIFFICULTY_OFFSET:0x2230,
		PROFILES:[
			{value:1, name:'Profile 1', offset: 0x0C}, // 12
			{value:2, name:'Profile 2', offset: 0x3B84}, // 15236
			{value:3, name:'Profile 3', offset: 0x76FC}, // 30460
		],
		BGM_MUSIC_OFFSET:0x2243,
		BGM_MUSIC:[
			{value:0, name:'Café'},
			{value:1, name:'Jazz'},
			{value:2, name:'Latin'},
			{value:3, name:'March'},
			{value:4, name:'Mystery'},
			{value:5, name:'Joy'},
			{value:6, name:'Fantasy'},
			{value:7, name:'Daydream'},
			{value:8, name:'Lively Forest'},
			{value:9, name:'Peaceful Beach'},
			{value:10, name:'Busy Café'},
			{value:11, name:'Tutorial'},
			{value:12, name:'Challenge'},
			{value:254, name:'Random'},
			{value:255, name:'Default'}
		]
	},
	_readU8String:function(pos,maxLength){
		var cs=new Array(maxLength);
		var str='';
		for(var i=0;i<maxLength && tempFile.readU8(pos+i*2)!=0;i++)
			str+=String.fromCharCode(tempFile.readU8(pos+i*2));
		return str
	},
	_getProfileOffset:function(){
		return this.Constants.PROFILES[Number(getValue('profile-selector')) - 1].offset;
	},
	_write_background:function(){
		tempFile.writeU8(
			this._getProfileOffset()+this.Constants.BACKGROUND_OFFSET,
			getValue('background')
		);
	},
	_write_difficulty:function(){
		tempFile.writeU8(
			this._getProfileOffset()+this.Constants.DIFFICULTY_OFFSET,
			getValue('difficulty')
		);
	},
	_write_bgm_music:function(){
		tempFile.writeU8(
			this._getProfileOffset()+this.Constants.BGM_MUSIC_OFFSET(),
			getValue('bgm-music')
		);
	},
	_update_list_values:function(){
		var profileStartOffset = SavegameEditor._getProfileOffset();
		var entry;
		for (entry of puzzles) {
			setValue('levels_' + entry[0] + '_errors', tempFile.readU8(profileStartOffset + entry[2] + 8));
			setValue('levels_' + entry[0] + '_time', tempFile.readU16(profileStartOffset + entry[2] + 12)); // ToDo: Read second byte first, then the first.
			setValue('levels_' + entry[0] + '_points', tempFile.readU8(profileStartOffset + entry[2] + 4));
		}
		for (entry of tutorials) {
			setValue('tutorials_' + entry[0] + '_errors', tempFile.readU8(profileStartOffset + entry[2] + 8));
			setValue('tutorials_' + entry[0] + '_time', tempFile.readU16(profileStartOffset + entry[2] + 12));
			setValue('tutorials_' + entry[0] + '_points', tempFile.readU8(profileStartOffset + entry[2] + 4));
		}
	},
	_load_profile:function(){
		var profileStartOffset = SavegameEditor._getProfileOffset();

		get('container-profile-name').innerHTML = '';
		get('container-profile-name').appendChild(span(SavegameEditor._readU8String(profileStartOffset, 20)));
		
		setValue('background', tempFile.readU8(profileStartOffset + SavegameEditor.Constants.BACKGROUND_OFFSET));
		setValue('bgm-music', tempFile.readU8(profileStartOffset + SavegameEditor.Constants.BGM_MUSIC_OFFSET));
		setValue('difficulty', tempFile.readU8(profileStartOffset + SavegameEditor.Constants.DIFFICULTY_OFFSET));
		var tmp = tempFile.readU8(profileStartOffset + 0x2231);
		setValue('checkbox-help', tmp > 1 ? 'checked' : '');
		setValue('checkbox-bomb', (tmp+1)%2===0 > 1 ? 'checked' : '');
		SavegameEditor._update_list_values();
	},

	unlockAmiiboPuzzles:function(){
		for(var i=0; i<9; i++){
			var offset=this.AmiiboOffset+i*16;
			var b=tempFile.readU8(offset);
			if(!(b & 0x09)){
				tempFile.writeU8(offset, b+0x09);
			}
		}
		setValue('amiibocount', 9);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==45688)
	},

	/* load function */
	load:function(){
		tempFile.fileName='SAVEDATA';

		fetch('/picross-3d-round-2/puzzles.json')
			.then(function(response) {
				return response.json();
			}).then(function(data) {
				var counter = 0;
				var rt = get('row-tutorials');
				var rl = get('row-levels');
				for (var entry of data) {
					if (entry.ID.startsWith('No.')) {
						puzzles.push([counter, entry, 0x220 + counter * 16]);
						rl.append(
							col(2, span(entry.ID)),
							col(2, span(entry.NAME)),
							col(2, checkbox('levels_'+counter+'_unlocked'), ''),
							col(2, inputNumber('levels_'+counter+'_errors', 0, 255, 0)),
							col(2, inputNumber('levels_'+counter+'_time', 0, 65535, 0)),
							col(2, inputNumber('levels_'+counter+'_points', 0, 255, 0))
						);
					} else {
						tutorials.push([entry, 0x220 + counter * 16]);
						rt.append(
							col(4, span(entry.ID)),
							col(4, span(entry.NAME)),
							col(4, checkbox('tutorials_'+counter+'_completed'), '')
						);
					}
					counter++;
				}
				SavegameEditor._update_list_values();
			}).catch(function(error) {
				console.log('[Picross Save Editor]', error);
			});

		get('toolbar').children[0].appendChild(select('profile-selector', this.Constants.PROFILES, this._load_profile));

		var unlockedAmiibos=0;
		for(var i=0; i<9; i++){
			if(tempFile.readU8(this.AmiiboOffset+i*16) & 0x09){
				unlockedAmiibos++;
			}
		}
		setValue('amiibocount', unlockedAmiibos);
		get('container-background').appendChild(select('background', SavegameEditor.Constants.BACKGROUND, SavegameEditor._write_background));
		get('container-bomb').appendChild(checkbox('checkbox-bomb'));
		get('container-difficulty').appendChild(select('difficulty', SavegameEditor.Constants.DIFFICULTIES, SavegameEditor._write_difficulty));
		get('container-help').appendChild(checkbox('checkbox-help'));
		get('container-bgm-music').appendChild(select('bgm-music', SavegameEditor.Constants.BGM_MUSIC, SavegameEditor._write_bgm_music));
		this._load_profile();
	},


	/* save function */
	save:function(){
	}
}