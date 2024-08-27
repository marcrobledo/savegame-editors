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
		PET_BREEDS:[ // variant is used inside variant_dog.js
			{value:0, name:'Beagle', variant:'beagle'},
			{value:1, name:'Golden Retriever', variant:'golden_retriever'},
			{value:2, name:'Yorkshire Terrier', variant:'yorkshire_terrier'},
			{value:3, name:'Miniature Dachshund', variant:'miniature_dachshund'},
			{value:4, name:'Chihuahua #1', variant:'chihuahua1'},
			{value:5, name:'Chihuahua #2', variant:'chihuahua2'},
			{value:6, name:'Toy Poodle #1', variant:'toy_poodle1'},
			{value:7, name:'Toy Poodle #2', variant:'toy_poodle2'},
			{value:8, name:'Shiba', variant:'shiba'},
			{value:9, name:'Labrador Retriever', variant:'labrador_retriever'},
			{value:10, name:'Spaniel', variant:'spaniel'},
			{value:11, name:'Pug', variant:'pug'},
			{value:12, name:'Shih Tzu', variant:'shih_tzu'},
			{value:13, name:'Shetland Sheepdog', variant:'shetland_sheepdog'},
			{value:14, name:'Miniature Schnauzer', variant:'miniature_schnauzer'},
			{value:15, name:'Pembroke Welsh Corgi', variant:'pembroke_welsh_corgi'},
			{value:16, name:'Miniature Pinscher', variant:'miniature_pinscher'},
			{value:17, name:'German Shepherd Dog', variant:'german_shepherd_dog'},
			{value:18, name:'Jack Russell Terrier', variant:'jack_russell_terrier'},
			{value:19, name:'Siberian Husky', variant:'siberian_husky'},
			{value:20, name:'Boxer', variant:'boxer'},
			{value:21, name:'Dalmatian', variant:'dalmatian'},
			{value:22, name:'Pomeranian', variant:'pomeranian'},
			{value:23, name:'French Bulldog', variant:'french_bulldog'},
			{value:24, name:'Maltese', variant:'maltese'},
			{value:25, name:'Cocker Spaniel', variant:'cocker_spaniel'},
			{value:26, name:'Great Dane', variant:'great_dane'},
			{value:27, name:'Bull Terrier', variant:'bull_terrier'},
			{value:28, name:'Basset Hound', variant:'basset_hound'},
			{value:32, name:'RoboPup', variant:'robo_pup'}
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
	_write_pet_breed:function(e){
		SavegameEditor._write_u_number(e, 8, 'PET_BREED_OFFSET');
	},
	_write_pet_breed_color:function(e){
		SavegameEditor._write_u_number(e, 8, 'PET_BREED_COLOR_OFFSET');
	},
	_write_pet_breed_style:function(e){
		SavegameEditor._write_u_number(e, 8, 'PET_BREED_STYLE_OFFSET');
	},
	_write_pet_breed_variant:function(e){
		SavegameEditor._write_u_number(e, 8, 'PET_BREED_VARIANT_OFFSET');
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
			second: "2-digit"
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
			
			get('container-pet' + i + '-breed').appendChild(select('pet' + i + '-breed', SavegameEditor.Constants.PET_BREEDS, SavegameEditor._write_pet_breed));
			get('container-pet' + i + '-gender').appendChild(select('pet' + i + '-gender', SavegameEditor.Constants.GENDERS, SavegameEditor._write_pet_gender));
			
			getField('select-pet' + i + '-gender').removeAttribute('disabled');
			getField('select-pet' + i + '-breed').removeAttribute('disabled');
			get('container-pet' + i + '-breed').addEventListener('change', function() {
				var reset_dummy = {
					target: {
						id: 'select-pet'+i+'-breed-variant'
					}
				}
				var cpbv = get('container-pet'+i+'-breed-variant')
				cpbv.innerText = '';
				cpbv.appendChild(select('pet'+i+'-breed-variant', window.variants.dog.breeds[SavegameEditor.Constants.PET_BREEDS[getField('pet1-breed').selectedIndex].variant], SavegameEditor._write_pet_breed_variant));
				SavegameEditor._write_pet_breed_variant(reset_dummy);
			});

			setValue('pet' + i + '-name', tempFile.readU16String(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_NAME_OFFSET, 10));
			setValue('pet' + i + '-gender', tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_GENDER_OFFSET));
			setValue('pet' + i + '-breed', tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i-1]+SavegameEditor.Constants.PET_BREED_OFFSET));
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
		
		get('number-pet1-breed-color').addEventListener('change', SavegameEditor._write_pet_breed_color);
		get('number-pet1-breed-style').addEventListener('change', SavegameEditor._write_pet_breed_style);
	},

	/* save function */
	save:function(){
	}
};
