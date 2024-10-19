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
		PET_HUNGER_OFFSET: 0x82,          // 130
		PET_THIRST_OFFSET: 0x86,          // 134
		PET_COAT_OFFSET: 0x8A,            // 138
		PET_BREED_OFFSET: 0x32,           //  50
		PET_BREED_VARIANT_OFFSET: 0x33,   //  51 = Variant (e.g. Spaniel = 0:Blentheim, 1:Tricolour, 2:Ruby)
		PET_BREED_STYLE_OFFSET: 0x34,     //  52 = Hairstyle
		PET_BREED_EYE_COLOR_OFFSET: 0x35, //  53 = Eye Color (Cats: 0=gray, 1=yellow, 2=blue; Dogs: 255)
		PET_BREED_COLOR_OFFSET: 0x36,     //  54 = Fur Color
		PET_COMP_CURL_OFFSET3: 0x59,      //  89 = Curling Competition
		PET_COMP_CURL_OFFSET2: 0x5A,      //  90 = Curling Competition
		PET_COMP_CURL_OFFSET: 0x5B,       //  91 = Curling Competition
		PET_COMP_HIGHEST_PLAYED1: 0x5C,   //  92 = Highest played difficulty at 'Disc Competition'
		PET_COMP_HIGHEST_PLAYED2: 0x5D,   //  93 = Highest played difficulty at 'Obedience Competition'
		PET_COMP_HIGHEST_PLAYED3: 0x5E,   //  94 = Highest played difficulty at 'Lure Competition'
		PET_COMP_RANKS:[
			{value:0, name:'Nothing'},
			{value:1, name:'Junior Cup'},
			{value:3, name:'Amateur Cup'},
			{value:7, name:'Pro Cup'},
			{value:15, name:'Nintendogs Cup'}
		],
		PET_PERSONALITIES_OFFSET_DOG1: 0x1F6,
		PET_PERSONALITIES_OFFSET_DOG2: 0x1FA,
		PET_PERSONALITIES_OFFSET_CAT1: 0x1EE,
		PET_PERSONALITIES_OFFSET_CAT2: 0x1F2,
	},
	
	_write_money:function(){
		tempFile.writeU32(
			SavegameEditor.Constants.MONEY_OFFSET,
			getValue('money')
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
	},
	_write_u_number:function(e, n, o){
		var index = Number((e.target.id).match(reg)[0]);
		var offset = SavegameEditor.Constants.PET_OFFSET[index-1]+SavegameEditor.Constants[o];
		tempFile['writeU' + n](
			offset,
			Number(getValue(e.target.id))
		);
	},
	_write_pet_value:function(e){
		SavegameEditor._write_u_number(e, Number(e.target.parentElement.dataset.size), e.target.parentElement.dataset.var);
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
		var outer_ele = document.getElementById('row-pet-outer');
		outer_ele.innerText = '';
		for (var i=1; i<7; i++){
			var pet_present = tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]) > 0;
			if (!pet_present) {continue;}
			var templateClone = template.content.cloneNode(true);
			templateClone.querySelector('.orange').innerText = 'Pet ' + i;
			templateClone.querySelector('.row').id="row-pet"+i;
			for (var ele of templateClone.querySelectorAll('.update-name')) {
				if ((ele.id || '').includes('petX')) {
					ele.id = ele.id.replaceAll('petX', 'pet' + i);
				} else if (ele.getAttribute('for')) {
					ele.setAttribute('for', ele.getAttribute('for').replaceAll('petX', 'pet' + i));
				}
			}
			var breed = SavegameEditor._getPetData(i-1, 'PET_BREED_OFFSET');
			var isDog = true;
			if (breed > 28 && breed < 32)
				isDog = false;
			outer_ele.appendChild(templateClone);
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
			setValue('pet' + i + '-gender', SavegameEditor._getPetData(i-1, 'PET_GENDER_OFFSET'));
			get('input-pet' + i + '-name').addEventListener('change', SavegameEditor._write_pet_name);
			if (isDog) {
				get('container-pet' + i + '-disc').appendChild(select('pet' + i + '-disc', SavegameEditor.Constants.PET_COMP_RANKS, SavegameEditor._write_pet_value));
				setValue('pet' + i + '-disc', SavegameEditor._getPetData(i-1, 'PET_COMP_HIGHEST_PLAYED1'));
				get('container-pet' + i + '-lure').appendChild(select('pet' + i + '-lure', SavegameEditor.Constants.PET_COMP_RANKS, SavegameEditor._write_pet_value));
				setValue('pet' + i + '-lure', SavegameEditor._getPetData(i-1, 'PET_COMP_HIGHEST_PLAYED3'));
				get('container-pet' + i + '-obedience').appendChild(select('pet' + i + '-obedience', SavegameEditor.Constants.PET_COMP_RANKS, SavegameEditor._write_pet_value));
				setValue('pet' + i + '-obedience', SavegameEditor._getPetData(i-1, 'PET_COMP_HIGHEST_PLAYED2'));
			} else {
				get('pet' + i + '_comp_outer').style.display='none';
			}
			var personality = window.personalities[SavegameEditor._getPetData(i-1, 'PET_PERSONALITIES_OFFSET_' + (isDog ? 'DOG' : 'CAT') + '1', 8)][SavegameEditor._getPetData(i-1, 'PET_PERSONALITIES_OFFSET_' + (isDog ? 'DOG' : 'CAT') + '2', 8)];
			setValue('pet' + i + '-personality', personality[Number(SavegameEditor._getPetData(i-1, 'PET_GENDER_OFFSET'))]);
			// Experimental
			setNumericRange('pet' + i + '-hunger', 0, 17529);
			setNumericRange('pet' + i + '-thirst', 0, 17529);
			setNumericRange('pet' + i + '-coat', 0, 17529);
			setValue('pet' + i + '-hunger', SavegameEditor._getPetData(i-1, 'PET_HUNGER_OFFSET', 16));
			setValue('pet' + i + '-thirst', SavegameEditor._getPetData(i-1, 'PET_THIRST_OFFSET', 16));
			setValue('pet' + i + '-coat', SavegameEditor._getPetData(i-1, 'PET_COAT_OFFSET', 16));
			get('number-pet' + i + '-hunger').addEventListener('change', SavegameEditor._write_pet_value);
			get('number-pet' + i + '-thirst').addEventListener('change', SavegameEditor._write_pet_value);
			get('number-pet' + i + '-coat').addEventListener('change', SavegameEditor._write_pet_value);

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
	},

	/* save function */
	save:function(){
		var changed_levels = document.querySelectorAll('[data-data_changed]');
		for (var i = 0; i < changed_levels.length; i++) {
			var value_old = changed_levels[i].value;
			setNumericRange(changed_levels[i].id.substring(7));
			changed_levels[i].value = level_borders[changed_levels[i].value][0];
			SavegameEditor._write_u_number(
				{target: {id: changed_levels[i].id}},
				32,
				changed_levels[i].dataset.is_dog ? 'PET_POINTS_OFFSET_DOG' : 'PET_POINTS_OFFSET_CAT'
			);
			changed_levels[i].value = value_old;
			delete changed_levels[i].dataset.data_changed;
			setNumericRange(changed_levels[i].id.substring(0, 99999));
		}
	}
};
