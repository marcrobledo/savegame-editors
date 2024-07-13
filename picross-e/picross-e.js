/*
	PICROSS e for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/

SavegameEditor={
	Name:'PICROSS e',
	Filename:'all.dat',
	Constants:{
		SETTINGS_CONTROL_METHOD_OFFSET: 0x258, // 0=Button, 1=Stylus
		SETTINGS_HINT_NUMBER_OFFSET: 0x259, // 0=OFF, 1=ON
		SETTINGS_NAVIGATION_OFFSET: 0x25A, //0=OFF, 1=ON
		SETTINGS_BGM_OFFSET: 0x25D, // 0=OFF, 1-5
		SETTINGS_EFFECTS_OFFSET: 0x25E, // 0=OFF, 1-5
		BGM_EFFECTS:[
			{value:0, name:'OFF'},
			{value:1, name:'1'},
			{value:2, name:'2'},
			{value:3, name:'3'},
			{value:4, name:'4'},
			{value:5, name:'5'},
		],
		CONTROL_METHOD:[
			{value:0, name:'Stylus Controls'},
			{value:1, name:'Button Controls'}
		]
	},

	_write_settings_control_method:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_CONTROL_METHOD_OFFSET,
			getValue('settings-control-method')
		);
	},
	_write_hint_number:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_HINT_NUMBER_OFFSET,
			getValue('settings-hint-number-auto-check')
		);
	},
	_write_navigation:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_NAVIGATION_OFFSET,
			getValue('settings-navigation')
		);
	},
	_write_settings_bgm:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_BGM_OFFSET,
			getValue('settings-bgm')
		);
	},
	_write_settings_effects:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_EFFECTS_OFFSET,
			getValue('settings-effects')
		);
	},
	_write_puzzle_time:function(e){
		if (e.target.valueAsNumber > 86399000) {return;} // Filter invalid values
		tempFile.writeU32(
			Number(e.target.dataset.offset),
			Math.floor(e.target.valueAsNumber / 1000) * 60
		);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==740)
	},

	preload:function(){
		get('container-settings-control-method').appendChild(select('settings-control-method', SavegameEditor.Constants.CONTROL_METHOD, SavegameEditor._write_settings_control_method));
		get('checkbox-settings-hint-number-auto-check').addEventListener('change', SavegameEditor._write_hint_number);
		get('checkbox-settings-navigation').addEventListener('change', SavegameEditor._write_navigation);
		get('container-settings-bgm').appendChild(select('settings-bgm', SavegameEditor.Constants.BGM_EFFECTS, SavegameEditor._write_settings_bgm));
		get('container-settings-effects').appendChild(select('settings-effects', SavegameEditor.Constants.BGM_EFFECTS, SavegameEditor._write_settings_effects));
	},

	/* load function */
	load:function(){
		tempFile.fileName='all.dat';
		tempFile.littleEndian=true;

		for (var difficulty of [
			['E', 'easy', 0, 15],
			['N', 'normal', 15, 75],
			['F', 'free', 75, 135],
			['X', 'extra', 135, 150],
		]) {
			var ce = get('puzzles-' + difficulty[1]);
			for (var i = difficulty[2]; i < difficulty[3]; i++) {
				var date = new Date(0);
				date.setSeconds(Math.floor(tempFile.readU32(4*i)/60));
				var timeString = date.toISOString().substring(11, 19);
				var time_ele = document.createElement('input');
				time_ele.type='time';
				time_ele.min='00:00:00';
				time_ele.max='23:59:59';
				time_ele.step='1';
				time_ele.value=timeString;
				time_ele.dataset.offset=4*i;
				time_ele.addEventListener('change', SavegameEditor._write_puzzle_time);
				ce.append(
					col(1, span(difficulty[0] + ('0' + String(i-difficulty[2]+1)).slice(-2))),
					col(3, time_ele)
				);
			}
		}
		setValue('settings-control-method', tempFile.readU8(SavegameEditor.Constants.SETTINGS_CONTROL_METHOD_OFFSET));
		getField('checkbox-settings-hint-number-auto-check').checked = tempFile.readU8(SavegameEditor.Constants.SETTINGS_HINT_NUMBER_OFFSET)>0;
		getField('checkbox-settings-navigation').checked = tempFile.readU8(SavegameEditor.Constants.SETTINGS_NAVIGATION_OFFSET)>0;
		setValue('settings-bgm', tempFile.readU8(SavegameEditor.Constants.SETTINGS_BGM_OFFSET));
		setValue('settings-effects', tempFile.readU8(SavegameEditor.Constants.SETTINGS_EFFECTS_OFFSET));
	},


	/* save function */
	save:function(){
	}
}