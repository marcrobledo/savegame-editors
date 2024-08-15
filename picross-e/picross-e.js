/*
	PICROSS e for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/
var picrossData = [];
var version = 0;
var pl;
var pt;
function convert_to_bit(d) {
	return ('00000000' + (d >>> 0).toString(2)).slice(-8).split('').reverse();
}
SavegameEditor={
	Name:'PICROSS e',
	Filename:'all.dat',
	Constants:{},
	_write_medal:function(e){
		var current = convert_to_bit(tempFile.readU8(Number(e.target.dataset.offset)));
		current[e.target.dataset.offset_] = e.target.checked ? '1': '0';
		tempFile.writeU8(
			Number(e.target.dataset.offset),
			parseInt(current.reverse().join(''), 2)
		);
	},
	_write_settings:function(e){
		if (e.target.type === 'checkbox') {
			tempFile.writeU8(
				Number(e.target.dataset.offset),
				getField(e.target.dataset.id).checked ? 1 : 0
			);
		} else {
			tempFile.writeU8(
				Number(e.target.dataset.offset),
				getValue(e.target.dataset.id)
			);
		}
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
		if (tempFile.fileSize==740) { // Picross e
			version = 0;
			return true;
		} else if (tempFile.fileSize==1880) { // Picross e2
			version = 1;
			return true;
		} else if (tempFile.fileSize==828) { // Picross e3
			version = 2;
			return true;
		} else if (tempFile.fileSize==1436) { // Picross e4
			version = 3;
			return true;
		} else if (tempFile.fileSize==1688) { // Picross e5
			version = 4;
			return true;
		} else if (tempFile.fileSize==2228) { // Picross e6
			version = 5;
			return true;
		} else if (tempFile.fileSize==2328) { // Picross e7 - e9
			version = 6;
			return true;
		} else if (tempFile.fileSize==988) { // Club Nintendo Picross
			version = 7;
			return true;
		} else if (tempFile.fileSize==920) { // My Nintendo PICROSS
			version = 8;
			return true;
		}
		return false;
	},
	_generateList:function(){
		var offset = picrossData[version].modes_start || 0;
		for (var difficulty of picrossData[version].modes) {
			var c = pt.content.cloneNode(true);
			c.getElementById('puzzles-header').innerText = difficulty[2];
			c.getElementById('puzzles-header').id='';
			c.getElementById('puzzles-placeholder').id='puzzles-'+difficulty[1];
			pl.append(c);
			var ce = get('puzzles-' + difficulty[1]);
			for (var i = difficulty[3]; i < difficulty[4]; i++) {
				var date = new Date(0);
				date.setSeconds(Math.floor(tempFile.readU32(4*i+offset)/60));
				var timeString = date.toISOString().substring(11, 19);
				var time_ele = document.createElement('input');
				time_ele.type='time';
				time_ele.min='00:00:00';
				time_ele.max='23:59:59';
				time_ele.step='1';
				time_ele.value=timeString;
				time_ele.dataset.offset=4*i+offset;
				time_ele.addEventListener('change', SavegameEditor._write_puzzle_time);
				var name = difficulty[0] + ('0' + String(i-difficulty[3]+1)).slice(-2);
				ce.append(
					col(1, span(name)),
					col(2, time_ele)
				);
				if (picrossData[version].medals_offset) {
					var tmp = Math.floor(i / 8);
					var box = checkbox('medal_'+name, '');
					box.dataset.offset=Number(picrossData[version].medals_offset) + tmp;
					box.dataset.offset_ = i-tmp*8;
					box.addEventListener('change', SavegameEditor._write_medal);
					box.checked = convert_to_bit(tempFile.readU8(box.dataset.offset))[box.dataset.offset_]==='1' ? 'checked' : '';
					ce.append(col(1, box));
				} else {
					ce.append(col(1, span('')));
				}
				if (i%3===2){
					ce.append(col(1, span('')));
				}
			}
		}
		var settings_ele = document.getElementById('settings');
		var s_offset = picrossData[version].settings_offset;
		for (var setting in s_offset) {
			var setting_data = s_offset[setting];
			if (setting_data[0]==='checkbox') {
				var checkbox_ele=checkbox('settings-'+setting, 'checked');
				checkbox_ele.dataset.offset=setting_data[3];
				checkbox_ele.dataset.id='settings-'+setting;
				var label_ele=label('checkbox-settings-'+setting, setting_data[1]);
				settings_ele.append(
					col(8, label_ele),
					col(4, checkbox_ele)
				);
				checkbox_ele.addEventListener('change', SavegameEditor._write_settings);
				getField('checkbox-settings-'+setting).checked = tempFile.readU8(Number(setting_data[3]))>0;
			} else if (setting_data[0]==='select'){
				var select_ele=select('settings-'+setting, picrossData[version][setting_data[2]], SavegameEditor._write_settings);
				select_ele.dataset.offset=setting_data[3];
				select_ele.dataset.id='settings-'+setting;
				settings_ele.append(
					col(8, span(setting_data[1])),
					col(4, select_ele)
				);
				setValue('settings-'+setting, tempFile.readU8(Number(setting_data[3])));
			}
		}
		
		var unlockables_ele = document.getElementById('unlockables');
		var unlockable_content = picrossData[version].unlockables || [];
		for (var index=0; index<unlockable_content.length; index++) {
			var checkbox_ele_=checkbox('unlockable-'+index, '');
			unlockables_ele.append(
				col(8, label('checkbox-unlockable-'+index, unlockable_content[index][0])),
				col(4, checkbox_ele_)
			);
			checkbox_ele_.dataset.offset=unlockable_content[index][1];
			checkbox_ele_.dataset.id='unlockable-'+index;
			checkbox_ele_.addEventListener('change', SavegameEditor._write_settings);
			checkbox_ele_.checked = tempFile.readU8(Number(unlockable_content[index][1])) === 1 ? 'checked' : '';
		}
	},
	preload:function(){
		pl = get('puzzle-list');
		pt = get('picross-template');
		pl.innerHTML = '';
		fetch('/savegame-editors/picross-e/versions.json')
		.then(function(response) {
			return response.json();
		}).then(function(data) {
			picrossData = data;
		}).catch(function(error) {
			console.log('[Picross Save Editor]', error);
		});
	},
	
	/* load function */
	load:function(){
		tempFile.fileName='all.dat';
		tempFile.littleEndian=true;

		setTimeout(SavegameEditor._generateList, 300);
	},


	/* save function */
	save:function(){
	}
};
