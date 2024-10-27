/*
	Nintendogs + Cats for HTML5 Save Editor v?
	by Marc Robledo 2016
*/
var reg = /\d+/;

var diffs = [1056964607, 12582913, 6291456, 4194304];
for (var i = 0; i < 30; i++) {
    diffs.push(diffs[diffs.length-2]*0.5);
}
var value = 0;
var level_borders = [];
for (var j = 0; j < 34; j++) {
    var amount = 1;
    if (j > 3 && j%2==1) {
        amount = Math.pow(2, (j-1)*0.5)-1;
    }
    for (var k = 0; k < amount; k++) {
        level_borders.push([value, value + diffs[j] - 1]);
		
		value += diffs[j];
    }
	if (level_borders.length > 99999) {
		level_borders.length = 100000;
		break;
	}
}
level_borders[99999][1] = 1203982336;


SavegameEditor={
	Name:'Nintendogs + Cats',
	Filename:'sysdata.dat',

	/* Constants */
	Constants:{
		MONEY_OFFSET:0xA0,
		LASTSAVED_OFFSET:0x10,
		GENDERS:[
			{value:0, name:'Male'},
			{value:1, name:'Female'}
		],
		STREETPASS_MET_OFFSET: 0x98,
		OWNER_POINTS_OFFSET: 0x9C,
		PEDOMETER_OFFSET: 0x218,
		PET_OFFSET:[
			0x026A, //    618
			0x1E6A, //  7,786
			0x3A6A, // 14,954
			0x566A, // 22,122
			0x726A, // 29,290
			0x8E6A  // 36,458
		],
		PET_NAME_OFFSET: 0x42,            //  66
		PET_GENDER_OFFSET: 0x56,          //  86
		PET_POINTS_OFFSET_CAT: 0x5A,      //  90
		PET_POINTS_OFFSET_DOG: 0x62,      //  98
		PET_BREED_OFFSET: 0x32,           //  50
		PET_BREED_VARIANT_OFFSET: 0x33,   //  51 = Variant (e.g. Spaniel = 0:Blentheim, 1:Tricolour, 2:Ruby)
		PET_BREED_STYLE_OFFSET: 0x34,     //  52 = Hairstyle
		PET_BREED_EYE_COLOR_OFFSET: 0x35, //  53 = Eye Color (Cats: 0=gray, 1=yellow, 2=blue; Dogs: 255)
		PET_BREED_COLOR_OFFSET: 0x36,     //  54 = Fur Color
		PET1_COMP_DISC_PLAYED: 0x24E,
		PET1_COMP_OBED_PLAYED: 0x24F,
		PET1_COMP_LURE_PLAYED: 0x250,
		PET2_COMP_DISC_PLAYED: 0x251,
		PET2_COMP_OBED_PLAYED: 0x252,
		PET2_COMP_LURE_PLAYED: 0x253,
		PET3_COMP_DISC_PLAYED: 0x254,
		PET3_COMP_OBED_PLAYED: 0x255,
		PET3_COMP_LURE_PLAYED: 0x256,
		PET4_COMP_DISC_PLAYED: 0x257,
		PET4_COMP_OBED_PLAYED: 0x258,
		PET4_COMP_LURE_PLAYED: 0x259,
		PET5_COMP_DISC_PLAYED: 0x25A,
		PET5_COMP_OBED_PLAYED: 0x25B,
		PET5_COMP_LURE_PLAYED: 0x25C,
		PET6_COMP_DISC_PLAYED: 0x25D,
		PET6_COMP_OBED_PLAYED: 0x25E,
		PET6_COMP_LURE_PLAYED: 0x25F,
		PET_PERSONALITIES_OFFSET_DOG1: 0x1F6,
		PET_PERSONALITIES_OFFSET_DOG2: 0x1FA,
		PET_PERSONALITIES_OFFSET_CAT1: 0x1EE,
		PET_PERSONALITIES_OFFSET_CAT2: 0x1F2,
		WALKING_COUNTER_OFFSET: 0x215
	},
	
	_write_money:function(){
		tempFile.writeU32(
			SavegameEditor.Constants.MONEY_OFFSET,
			getValue('money')
		);
	},
	_write_streetpass_met:function(){
		tempFile.writeU32(
			SavegameEditor.Constants.STREETPASS_MET_OFFSET,
			getValue('streetpass-met')
		);
	},
	_write_pedometer:function(){
		tempFile.writeU32(
			SavegameEditor.Constants.PEDOMETER_OFFSET,
			getValue('pedometer')
		);
	},
	_write_walking_counter:function(){
		tempFile.writeU8(
			SavegameEditor.Constants.WALKING_COUNTER_OFFSET,
			getValue('walking-counter')
		);
	},
	_write_supply_amount:function(e){
		tempFile.writeU8(
			Number(e.target.dataset.offset),
			getValue(e.target.id)
		);
	},
	_write_pet_name:function(e){
		var index = Number((e.target.id).match(reg)[0]);
		var offset = SavegameEditor.Constants.PET_OFFSET[index-1]+SavegameEditor.Constants.PET_NAME_OFFSET;
		tempFile.writeU16String(
			offset,
			10,
			getValue(e.target.id)
		);

		document.getElementsByClassName('pet' + index + '_name')[0].innerText = getValue(e.target.id);
	},
	_write_u_number:function(e, n, o, g){
		var index = Number((e.target.id).match(reg)[0]);
		var pet_offset = SavegameEditor.Constants.PET_OFFSET[index-1];
		if (g) {
			pet_offset = 0;
		}
		var offset = pet_offset+SavegameEditor.Constants[o];
		tempFile['writeU' + n](
			offset,
			Number(getValue(e.target.id))
		);
	},
	_write_pet_value:function(e){
		SavegameEditor._write_u_number(e, Number(e.target.parentElement.dataset.size), e.target.parentElement.dataset.var, e.target.parentElement.dataset.global);
	},
	_getPetData(petOffset, value, size) {
		return tempFile['readU' + (size || 8)](SavegameEditor.Constants.PET_OFFSET[petOffset]+SavegameEditor.Constants[value]);
	},
	_mark_as_changed(e) {
		e.target.dataset.data_changed=true;
	},
	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==60936);
	},
	
	preload:function() {
		var btn_last_saved = document.getElementById('update-lastsaved');
		btn_last_saved.addEventListener('click', function(e) {
			tempFile.writeU32(
				SavegameEditor.Constants.LASTSAVED_OFFSET,
				Math.floor(Date.now() * 0.001)
			);
			var a = new Date (Number(tempFile.readU32(SavegameEditor.Constants.LASTSAVED_OFFSET)) * 1000);
			a.setHours(a.getHours() - a.getTimezoneOffset()/60);
			setValue('lastsaved', a.toLocaleString("en-GB", {
				day: "numeric",
				month: "short",
				year: "numeric",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			  }));
		}, false);
		get('number-money').addEventListener('change', SavegameEditor._write_money);
		get('number-streetpass-met').addEventListener('change', SavegameEditor._write_streetpass_met);
		get('number-pedometer').addEventListener('change', SavegameEditor._write_pedometer);
		get('number-walking-counter').addEventListener('change', SavegameEditor._write_walking_counter);
		fetch('/savegame-editors/nintendogs+cats/supplies.json')
			.then(function(response) {
				return response.json();
			}).then(function(data) {
				var counter = 0;
				for (var rowtype of [
					['fooddrink', 'food & drink'],
					['toys', 'toys'],
					['accessories', 'accessories'],
					['furniture', 'furnitures'],
					['leashes', 'leashes'],
					['skins', 'skins']
				]){
					var rt = get('row-'+rowtype[0]);
					counter = 0;
					for (var entry of data[rowtype[1]]) {
						rt.append(
							col(3, span(entry[1])),
							col(1, inputNumber('supplies_' + rowtype[0] + '_'+counter+'_amount', 0, 99, tempFile.readU8(Number(entry[0]))))
						);
						get('number-supplies_' + rowtype[0] + '_'+counter+'_amount').dataset.offset = entry[0];
						get('number-supplies_' + rowtype[0] + '_'+counter+'_amount').addEventListener('change', SavegameEditor._write_supply_amount);
						counter++;
					}
					var lastRow = counter%3;
					if (lastRow !== 0) {
						rt.append(col((3-lastRow) * 4, span('')));
					}
				}
			}).catch(function(error) {
				console.log('[Picross Save Editor]', error);
			});
	},

	/* load function */
	load:function(){
		tempFile.fileName='sysdata.dat';
		tempFile.littleEndian=true;

		setValue('money', tempFile.readU32(SavegameEditor.Constants.MONEY_OFFSET));
		setNumericRange('money', 0, 9999999);

		setValue('streetpass-met', tempFile.readU32(SavegameEditor.Constants.STREETPASS_MET_OFFSET));
		setNumericRange('streetpass-met', 0, 9999999);

		setValue('pedometer', tempFile.readU32(SavegameEditor.Constants.PEDOMETER_OFFSET));
		setNumericRange('pedometer', 0, 9999999);

		setValue('walking-counter', tempFile.readU8(SavegameEditor.Constants.WALKING_COUNTER_OFFSET));
		setNumericRange('walking-counter', 0, 255);

		setNumericRange('owner-points', 0, 99999);
		var owner_points = tempFile.readU32(SavegameEditor.Constants.OWNER_POINTS_OFFSET);
		for (var k = 0; k < level_borders.length; k++) {
			if (owner_points >= level_borders[k][0] && owner_points <= level_borders[k][1]) {
				setValue('owner-points', k);
				break;
			}
		}
		var level_ele_ = get('number-owner-points');
		level_ele_.addEventListener('change', SavegameEditor._mark_as_changed);

		var a = new Date (Number(tempFile.readU32(SavegameEditor.Constants.LASTSAVED_OFFSET)) * 1000);
		setValue('lastsaved', a.toLocaleString("en-GB", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timezone: "Europe/London"
		  }));
		var template = document.getElementById("template-row-pet");
		var pet_tabs = document.getElementById('pet_tabs');
		pet_tabs.innerText = '';
		var pet_tabs_content_seperator = document.createElement('div');
		pet_tabs.appendChild(pet_tabs_content_seperator);
		var first_pet = true;
		for (var i=1; i<7; i++){
			var pet_present = tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]) > 0;
			if (!pet_present) {continue;}
			var pet_tab_input = document.createElement('input');
			pet_tab_input.name = 'pet_tabgroup';
			pet_tab_input.type = 'radio';
			pet_tab_input.id = 'pet_tab' + i;
			if (first_pet) {
				pet_tab_input.checked = true;
				first_pet = false;
			}
			pet_tab_input.className = 'pet_tab';
			pet_tabs.insertBefore(pet_tab_input, pet_tabs_content_seperator);
			var pet_tab_label = document.createElement('label');
			pet_tab_label.className = 'pet_label';
			pet_tab_label.setAttribute('for', 'pet_tab' + i);
			pet_tabs.insertBefore(pet_tab_label, pet_tabs_content_seperator);

			var templateClone = template.content.cloneNode(true);
			templateClone.querySelector('.row').id="row-pet"+i;
			for (var ele of templateClone.querySelectorAll('.update-name')) {
				if ((ele.id || '').includes('petX')) {
					ele.id = ele.id.replaceAll('petX', 'pet' + i);
				}
				if (ele.getAttribute('for')) {
					ele.setAttribute('for', ele.getAttribute('for').replaceAll('petX', 'pet' + i));
				}
				if ((ele.dataset && ele.dataset.var || '').includes('PETX')) {
					ele.dataset.var = ele.dataset.var.replaceAll('PETX', 'PET' + i);
				}
			}
			var breed = SavegameEditor._getPetData(i-1, 'PET_BREED_OFFSET');
			var isDog = true;
			if (breed > 28 && breed < 32)
				isDog = false;
			pet_tabs.appendChild(templateClone);
			var dialogClassName = 'page-' + 
				breed +
				'-' +
				SavegameEditor._getPetData(i-1, 'PET_BREED_VARIANT_OFFSET');
			const dialogEle = document.getElementsByClassName(
				dialogClassName
			)[0];
			if (!isDog) {
				document.getElementById('eyecolor').querySelector('[data-offset="' + SavegameEditor._getPetData(i-1, 'PET_BREED_EYE_COLOR_OFFSET') + '"]').checked=true;
			}
			window._sidebar_event({
				target: dialogEle
			});
			var breedImg = document.createElement('img');
			var breedImgTmp = document
				.getElementById('menu-content')
				.getElementsByClassName(dialogClassName)[0]
				.querySelector('div[data-color="' + SavegameEditor._getPetData(i-1, 'PET_BREED_COLOR_OFFSET') + '"][data-style="' + SavegameEditor._getPetData(i-1, 'PET_BREED_STYLE_OFFSET') + '"]'
				);
			if (breedImgTmp) {
				breedImg = breedImgTmp.cloneNode();
				breedImg.id='petimage'+i;
			}
			get('container-pet' + i + '-breed').appendChild(breedImg);
			var breedImg2 = breedImg.cloneNode();
			breedImg2.id = '';
			pet_tab_label.appendChild(breedImg2);

			var dialogbtn = document.createElement('button');
			dialogbtn.dataset.pet = i - 1;
			dialogbtn.onclick = function(e) {
				e.preventDefault();
				get('menu').dataset.pet = e.target.dataset.pet;
				get('menu').showModal();
				var breed = SavegameEditor._getPetData(e.target.dataset.pet, 'PET_BREED_OFFSET');
				var dialogClassName_ = 'page-' + 
					breed +
					'-' +
					SavegameEditor._getPetData(e.target.dataset.pet, 'PET_BREED_VARIANT_OFFSET');
				var dialogEle_ = document.getElementsByClassName(
					dialogClassName_
				)[0];
				if (breed > 28 && breed < 32) {
					document.getElementById('eyecolor').querySelector('[data-offset="' + SavegameEditor._getPetData(e.target.dataset.pet, 'PET_BREED_EYE_COLOR_OFFSET') + '"]').checked=true;
				}
				window._sidebar_event({
					target: dialogEle_
				});
			};
			dialogbtn.innerText = 'Change';
			get('container-pet' + i + '-breed').appendChild(dialogbtn);
			
			get('container-pet' + i + '-gender').appendChild(select('pet' + i + '-gender', SavegameEditor.Constants.GENDERS, SavegameEditor._write_pet_value));

			setValue('pet' + i + '-name', tempFile.readU16String(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_NAME_OFFSET, 10));
			var pet_tab_label_name = document.createElement('span');
			pet_tab_label_name.innerText = getValue('pet' + i + '-name');
			pet_tab_label_name.className = 'pet' + i + '_name';
			pet_tab_label.appendChild(pet_tab_label_name);
			setValue('pet' + i + '-gender', SavegameEditor._getPetData(i-1, 'PET_GENDER_OFFSET'));
			get('input-pet' + i + '-name').addEventListener('change', SavegameEditor._write_pet_name);

			setNumericRange('pet' + i + '-disc-played', 0, 2);
			setValue('pet' + i + '-disc-played', tempFile.readU8(SavegameEditor.Constants['PET' + i + '_COMP_DISC_PLAYED']));
			get('number-pet' + i + '-disc-played').addEventListener('change', SavegameEditor._write_pet_value);
			setNumericRange('pet' + i + '-lure-played', 0, 2);
			setValue('pet' + i + '-lure-played', tempFile.readU8(SavegameEditor.Constants['PET' + i + '_COMP_LURE_PLAYED']));
			get('number-pet' + i + '-lure-played').addEventListener('change', SavegameEditor._write_pet_value);
			setNumericRange('pet' + i + '-obed-played', 0, 2);
			setValue('pet' + i + '-obed-played', tempFile.readU8(SavegameEditor.Constants['PET' + i + '_COMP_OBED_PLAYED']));
			get('number-pet' + i + '-obed-played').addEventListener('change', SavegameEditor._write_pet_value);

			var personality = window.personalities[SavegameEditor._getPetData(i-1, 'PET_PERSONALITIES_OFFSET_' + (isDog ? 'DOG' : 'CAT') + '1', 8)][SavegameEditor._getPetData(i-1, 'PET_PERSONALITIES_OFFSET_' + (isDog ? 'DOG' : 'CAT') + '2', 8)];
			setValue('pet' + i + '-personality', personality[Number(SavegameEditor._getPetData(i-1, 'PET_GENDER_OFFSET'))]);

			setNumericRange('pet' + i + '-level', 0, 99999);
			var points = SavegameEditor._getPetData(i-1, (isDog ? 'PET_POINTS_OFFSET_DOG' : 'PET_POINTS_OFFSET_CAT'), 32);
			for (var j = 0; j < level_borders.length; j++) {
				if (points >= level_borders[j][0] && points <= level_borders[j][1]) {
					setValue('pet' + i + '-level', j);
					break;
				}
			}
			var level_ele = get('number-pet' + i + '-level');
			level_ele.dataset.is_dog = isDog;
			level_ele.addEventListener('change', SavegameEditor._mark_as_changed);
		}
		pet_tabs.removeChild(pet_tabs_content_seperator);
	},

	/* save function */
	save:function(){
		var changed_levels = document.querySelectorAll('[data-data_changed]');
		for (var i = 0; i < changed_levels.length; i++) {
			var value_old = changed_levels[i].value;
			setNumericRange(changed_levels[i].id.substring(7));
			changed_levels[i].value = level_borders[changed_levels[i].value][0];
			if (changed_levels[i].id === 'number-owner-points') {
				tempFile.writeU32(
					SavegameEditor.Constants.OWNER_POINTS_OFFSET,
					getValue('owner-points')
				);
			} else {
				SavegameEditor._write_u_number(
					{target: {id: changed_levels[i].id}},
					32,
					changed_levels[i].dataset.is_dog ? 'PET_POINTS_OFFSET_DOG' : 'PET_POINTS_OFFSET_CAT'
				);
			}
			changed_levels[i].value = value_old;
			delete changed_levels[i].dataset.data_changed;
			setNumericRange(changed_levels[i].id.substring(0, 99999));
		}
	}
};
