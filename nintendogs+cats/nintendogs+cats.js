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
		GENDERS:[
			{value:0, name:'Male'},
			{value:1, name:'Female'}
		],
		PET_BREEDS:[
			{value:0, name:'Beagle'},
			{value:1, name:'Golden Retriever'},
			{value:2, name:'Yorkshire Terrier'},
			{value:3, name:'Miniature Dachshund'},
			{value:4, name:'Chihuahua'},
			{value:5, name:'Chihuahua'},
			{value:6, name:'Toy Poodle #1'},
			{value:7, name:'Toy Poodle #2'},
			{value:8, name:'Shiba'},
			{value:9, name:'Labrador Retriever'},
			{value:10, name:'Spaniel'},
			{value:11, name:'Pug'},
			{value:12, name:'Shih Tzu'},
			{value:13, name:'Shetland Sheepdog'},
			{value:14, name:'Miniature Schnauzer'},
			{value:15, name:'Pembroke Welsh Corgi'},
			{value:16, name:'Miniature Pinscher'},
			{value:17, name:'German Shepherd Dog'},
			{value:18, name:'Jack Russell Terrier'},
			{value:19, name:'Siberian Husky'},
			{value:20, name:'Boxer'},
			{value:21, name:'Dalmatiner'},
			{value:22, name:'Pomeranian'},
			{value:23, name:'French Bulldog'},
			{value:25, name:'Cocker Spaniel'},
			{value:26, name:'Great Dane'},
			{value:27, name:'Bull Terrier'},
			{value:28, name:'Basset Hound'},
			{value:32, name:'RoboPup'}
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
		PET_BREED_COLOR_OFFSET: 0x33   //  51
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
			getValue(e.target.id)
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
	
	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==60936)
	},
	
	preload:function() {
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
		
		for (var i=0; i<6; i++){
			var pet_present = tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i]) > 0;
			getField('checkbox-pet' + (i+1) + '-active').checked = pet_present;
			
			get('container-pet' + (i+1) + '-breed').appendChild(select('pet'+(i+1)+'-breed', SavegameEditor.Constants.PET_BREEDS, SavegameEditor._write_pet_breed));
			get('container-pet' + (i+1) + '-gender').appendChild(select('pet' + (i+1) + '-gender', SavegameEditor.Constants.GENDERS, SavegameEditor._write_pet_gender));
			
			getField('checkbox-pet' + (i+1) + '-active').setAttribute('disabled', '');
			getField('input-pet' + (i+1) + '-name').readOnly = !pet_present;
			if (pet_present) {
				getField('select-pet' + (i+1) + '-gender').removeAttribute('disabled');
				getField('select-pet' + (i+1) + '-breed').removeAttribute('disabled');
			} else {
				getField('select-pet' + (i+1) + '-gender').setAttribute('disabled', '');
				getField('select-pet' + (i+1) + '-breed').setAttribute('disabled', '');
			}
			setValue('pet' + (i+1) + '-name', tempFile.readU16String(SavegameEditor.Constants.PET_OFFSET[i]+SavegameEditor.Constants.PET_NAME_OFFSET, 10));
			setValue('pet' + (i+1) + '-gender', tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i]+SavegameEditor.Constants.PET_GENDER_OFFSET));
			setValue('pet' + (i+1) + '-breed', tempFile.readU8(SavegameEditor.Constants.PET_OFFSET[i]+SavegameEditor.Constants.PET_BREED_OFFSET));
			get('input-pet' + (i+1) + '-name').addEventListener('change', SavegameEditor._write_pet_name);
			
			// Experimental
			/*
			getField('number-pet' + (i+1) + '-hunger').readOnly = !pet_present;
			getField('number-pet' + (i+1) + '-thirst').readOnly = !pet_present;
			getField('number-pet' + (i+1) + '-coat').readOnly = !pet_present;
			setNumericRange('pet' + (i+1) + '-hunger', 0, 17529);
			setNumericRange('pet' + (i+1) + '-thirst', 0, 17529);
			setNumericRange('pet' + (i+1) + '-coat', 0, 17529);
			setValue('pet' + (i+1) + '-hunger', tempFile.readU16(SavegameEditor.Constants.PET_OFFSET[i]+SavegameEditor.Constants.PET_HUNGER_OFFSET));
			setValue('pet' + (i+1) + '-thirst', tempFile.readU16(SavegameEditor.Constants.PET_OFFSET[i]+SavegameEditor.Constants.PET_THIRST_OFFSET));
			setValue('pet' + (i+1) + '-coat', tempFile.readU16(SavegameEditor.Constants.PET_OFFSET[i]+SavegameEditor.Constants.PET_COAT_OFFSET));
			get('number-pet' + (i+1) + '-hunger').addEventListener('change', SavegameEditor._write_pet_hunger);
			get('number-pet' + (i+1) + '-thirst').addEventListener('change', SavegameEditor._write_pet_thirst);
			get('number-pet' + (i+1) + '-coat').addEventListener('change', SavegameEditor._write_pet_coat);
			*/
		}
	},

	/* save function */
	save:function(){
	}
}
