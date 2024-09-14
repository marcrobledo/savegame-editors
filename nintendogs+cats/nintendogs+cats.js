/*
	Nintendogs + Cats for HTML5 Save Editor v?
	by Marc Robledo 2016
*/
var reg = /\d+/;
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
		PET_NAME_OFFSET: 0x42,         //  66
		PET_POINTS_OFFSET: 0x3E,       //  62
		PET_GENDER_OFFSET: 0x56,       //  86
		PET_HUNGER_OFFSET: 0x84,       // 132
		PET_THIRST_OFFSET: 0x88,       // 136
		PET_COAT_OFFSET: 0x8C,         // 140
		PET_BREED_OFFSET: 0x32,        //  50
		PET_BREED_VARIANT_OFFSET: 0x33,//  51 = Variant (e.g. Spaniel = 0:Blentheim, 1:Tricolour, 2:Ruby)
		PET_BREED_STYLE_OFFSET: 0x34,  //  52 = Hairstyle
		PET_BREED_COLOR_OFFSET: 0x36   //  54 = Fur Color
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
	_write_pet_gender:function(e){
		SavegameEditor._write_u_number(e, 8, 'PET_GENDER_OFFSET');
	},
	_write_pet_points:function(e){
		SavegameEditor._write_u_number(e, 24, 'PET_POINTS_OFFSET');
	},
	_write_pet_hunger:function(e){
		SavegameEditor._write_u_number(e, 16, 'PET_HUNGER_OFFSET');
	},
	_write_pet_thirst:function(e){
		SavegameEditor._write_u_number(e, 16, 'PET_THIRST_OFFSET');
	},
	_write_pet_coat:function(e){
		SavegameEditor._write_u_number(e, 16, 'PET_COAT_OFFSET');
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
			)
			var a = new Date (Number(tempFile.readU32(SavegameEditor.Constants.LASTSAVED_OFFSET)) * 1000)
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
		var a = new Date (Number(tempFile.readU32(SavegameEditor.Constants.LASTSAVED_OFFSET)) * 1000)
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
			console.log(template);
			var templateClone = template.content.cloneNode(true);
			console.log(templateClone);
			templateClone.querySelector('.orange').innerText = 'Pet ' + i;
			templateClone.querySelector('.row').id="row-pet"+i;
			for (var ele of templateClone.querySelectorAll('.update-name')) {
				if ((ele.id || '').includes('petX')) {
					ele.id = ele.id.replaceAll('petX', 'pet' + i);
				} else if (ele.getAttribute('for')) {
					ele.setAttribute('for', ele.getAttribute('for').replaceAll('petX', 'pet' + i));
				}
			}
			outer_ele.appendChild(templateClone);

			var dialogClassName = 'page-' + 
				tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_BREED_OFFSET) +
				'-' +
				tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_BREED_VARIANT_OFFSET);
			const dialogEle = document.getElementsByClassName(
				dialogClassName
			)[0];

			window._sidebar_event({
				target: dialogEle
			});
			var breedImg = document
				.getElementById('menu-content')
				.getElementsByClassName(dialogClassName)[0]
				.querySelector('div[data-color="' + tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_BREED_COLOR_OFFSET) + '"][data-style="' + tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_BREED_STYLE_OFFSET) + '"]')
				.cloneNode();
			breedImg.id='petimage'+i;
			get('container-pet' + i + '-breed').appendChild(breedImg);

			var dialogbtn = document.createElement('button');
			dialogbtn.dataset.pet = i - 1;
			dialogbtn.onclick = function(e) {
				e.preventDefault()
				get('menu').dataset.pet = e.target.dataset.pet;
				get('menu').showModal();
				window._sidebar_event({
					target: dialogEle
				});
			};
			dialogbtn.innerText = 'Change';
			get('container-pet' + i + '-breed').appendChild(dialogbtn);
			
			get('container-pet' + i + '-gender').appendChild(select('pet' + i + '-gender', SavegameEditor.Constants.GENDERS, SavegameEditor._write_pet_gender));
			
			setValue('pet' + i + '-name', tempFile.readU16String(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_NAME_OFFSET, 10));
			setValue('pet' + i + '-gender', tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_GENDER_OFFSET));
			get('input-pet' + i + '-name').addEventListener('change', SavegameEditor._write_pet_name);
			
			// Experimental
			/*
			setNumericRange('pet' + i + '-hunger', 0, 17529);
			setNumericRange('pet' + i + '-thirst', 0, 17529);
			setNumericRange('pet' + i + '-coat', 0, 17529);
			setValue('pet' + i + '-hunger', tempFile.readU16(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_HUNGER_OFFSET));
			setValue('pet' + i + '-thirst', tempFile.readU16(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_THIRST_OFFSET));
			setValue('pet' + i + '-coat', tempFile.readU16(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_COAT_OFFSET));
			get('number-pet' + i + '-hunger').addEventListener('change', SavegameEditor._write_pet_hunger);
			get('number-pet' + i + '-thirst').addEventListener('change', SavegameEditor._write_pet_thirst);
			get('number-pet' + i + '-coat').addEventListener('change', SavegameEditor._write_pet_coat);
			*/
		}
	},

	/* save function */
	save:function(){
	}
};
