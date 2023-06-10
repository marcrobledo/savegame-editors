/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Horse class) v20230610

	by Marc Robledo 2023
	horse data thanks to JonJaded, Ozymandias07 and Karlos007
*/

function Horse(index, id, name, mane, saddles, reins, bond, specialType, statsStrength, statsSpeed, statsStamina, statsPull, iconPattern, iconEyeColor){
	this.category='horses';
	this.index=index;

	this.id=id;
	this.name=name;
	this.mane=mane;
	this.saddles=saddles;
	this.reins=reins;
	this.bond=bond;
	this.specialType=specialType;
	this.statsStrength=statsStrength;
	this.statsSpeed=statsSpeed;
	this.statsStamina=statsStamina;
	this.statsPull=statsPull;
	this.iconPattern=iconPattern;
	this.iconEyeColor=iconEyeColor;

	if(
		specialType!==Horse.TYPE_NORMAL && 
		specialType!==Horse.TYPE_ZELDA &&
		specialType!==Horse.TYPE_EPONA &&
		specialType!==Horse.TYPE_GIANT_BLACK &&
		specialType!==Horse.TYPE_GIANT_WHITE &&
		specialType!==Horse.TYPE_SPOT &&
		specialType!==Horse.TYPE_GOLD
	)
		console.warn('unknown horse['+index+'].specialType value: '+specialType);

	Horse.buildHtmlElements(this);
	this.fixValues(true);
}


Horse.prototype.fixValues=function(ignoreEquipment){
	if(this.id==='GameRomHorseZelda'){
		this.specialType=Horse.TYPE_ZELDA;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorse00L'){
		this.specialType=Horse.TYPE_GIANT_BLACK;
		if(!ignoreEquipment){
			this.mane=this._htmlSelectMane.value=0x9cd4f27b;
			this.saddles=this._htmlSelectSaddles.value=0xf1435392;
			this.reins=this._htmlSelectReins.value=0x4dbf2061;
		}
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorse01L'){
		this.specialType=Horse.TYPE_GIANT_WHITE;
		if(!ignoreEquipment){
			this.mane=this._htmlSelectMane.value=0x55365b10;
			this.saddles=this._htmlSelectSaddles.value=0xf1435392;
			this.reins=this._htmlSelectReins.value=0x4dbf2061;
		}
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorseSpPattern'){
		this.specialType=Horse.TYPE_SPOT;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild'; //???
	}else if(this.id==='GameRomHorseGold'){
		this.specialType=Horse.TYPE_GOLD;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild'; //???
	}else if(this.id==='GameRomHorseEpona'){
		this.specialType=Horse.TYPE_EPONA;
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild'; //???
	}else{
		this.specialType=Horse.TYPE_NORMAL;
		if(!ignoreEquipment && this.id==='GameRomHorse00S'){
			this.mane=this._htmlSelectMane.value=0xbad4c4a9;
			this.saddles=this._htmlSelectSaddles.value=0x8c5bd272;
			this.reins=this._htmlSelectReins.value=0xe8fe6ab7;
		}
		this._htmlSelectIconPattern.disabled=false;
		this._htmlSelectIconEyeColor.disabled=false;
		//this.temperament='gentle'; //???
	}
}
Horse.prototype.getItemTranslation=function(){
	return Locale._(this.id);
}
Horse.prototype.save=function(){
	SavegameEditor.writeString64('OwnedHorseList.ActorName', this.index, this.id);
	SavegameEditor.writeStringUTF8('OwnedHorseList.Name', this.index, this.name);
	SavegameEditor.writeU32('OwnedHorseList.Mane', this.index, this.mane);
	SavegameEditor.writeU32('OwnedHorseList.Saddle', this.index, this.saddles);
	SavegameEditor.writeU32('OwnedHorseList.Rein', this.index, this.reins);
	SavegameEditor.writeF32('OwnedHorseList.Familiarity', this.index, this.bond);
	SavegameEditor.writeU32('OwnedHorseList.HorseType', this.index, this.specialType);
	SavegameEditor.writeU32('OwnedHorseList.Toughness', this.index, this.statsStrength);
	SavegameEditor.writeU32('OwnedHorseList.Speed', this.index, this.statsSpeed);
	SavegameEditor.writeU32('OwnedHorseList.ChargeNum', this.index, this.statsStamina);
	SavegameEditor.writeU32('OwnedHorseList.HorsePower', this.index, this.statsPull);
	SavegameEditor.writeU32('OwnedHorseList.Body.Pattern', this.index, this.iconPattern);
	SavegameEditor.writeU32('OwnedHorseList.Body.EyeColor', this.index, this.iconEyeColor);
}

Horse.buildHtmlElements=function(item){
	//build html elements
	item._htmlInputName=input('name-'+item.category+'-'+item.index, item.name);
	item._htmlInputName.addEventListener('change', function(){
		var newVal=this.value;
		if(newVal.length>9)
			newVal=newVal.substr(0,9);
		if(!newVal)
			newVal='a';
		item.name=newVal;
	});
	item._htmlInputName.title=Locale._('Horse name');
	item._htmlInputName.maxLength=9;

	item._htmlSelectMane=select('horse-mane-'+item.index, Horse.MANES, function(){
		item.mane=this.value;
	}, item.mane);
	item._htmlSelectMane.title=Locale._('Mane');

	item._htmlSelectSaddles=select('horse-saddles-'+item.index, Horse.SADDLES, function(){
		item.saddles=this.value;
	}, item.saddles);
	item._htmlSelectSaddles.title=Locale._('Saddle');

	item._htmlSelectReins=select('horse-reins-'+item.index, Horse.REINS, function(){
		item.reins=this.value;
	}, item.reins);
	item._htmlSelectReins.title=Locale._('Reins');

	item._htmlInputBond=inputFloat('bond-'+item.category+'-'+item.index,0,100,item.bond*100);
	item._htmlInputBond.addEventListener('change', function(){
		item.bond=parseFloat(this.value) / 100;
	});
	item._htmlInputBond.title=Locale._('Bond');


	var stats=[
		{value:1, name:'★★'},
		{value:2, name:'★★★'},
		{value:3, name:'★★★★'},
		{value:4, name:'★★★★★'}
	];
	var statsStamina=[
		{value:2, name:'★★'},
		{value:3, name:'★★★'},
		{value:4, name:'★★★★'},
		{value:5, name:'★★★★★'},
		{value:0, name:'Infinite'}
	];
	item._htmlInputStatsStrength=inputNumber('horse-stats-strength-'+item.index,100,350,item.statsStrength);
	item._htmlInputStatsStrength.addEventListener('change', function(){
		item.statsStrength=parseInt(this.value);
	});
	item._htmlInputStatsStrength.title=Locale._('Stats: Strength');
	item._htmlSelectStatsSpeed=select('horse-stats-speed-'+item.index, stats, function(){
		item.statsSpeed=parseInt(this.value);
	}, item.statsSpeed);
	item._htmlSelectStatsSpeed.title=Locale._('Stats: Speed');
	item._htmlSelectStatsStamina=select('horse-stats-stamina-'+item.index, statsStamina, function(){
		item.statsStamina=parseInt(this.value);
	}, item.statsStamina);
	item._htmlSelectStatsStamina.title=Locale._('Stats: Stamina');
	item._htmlSelectStatsPull=select('horse-stats-pull-'+item.index, stats, function(){
		item.statsPull=parseInt(this.value);
	}, item.statsPull);
	item._htmlSelectStatsPull.title=Locale._('Stats: Pull');




	item._htmlSelectIconPattern=select('horse-icon-pattern-'+item.index, Horse.ICON_PATTERNS, function(){
		item.iconPattern=parseInt(this.value);
	}, item.iconPattern);
	item._htmlSelectIconPattern.title=Locale._('Icon: pattern');

	item._htmlSelectIconEyeColor=select('horse-icon-eye-color-'+item.index, Horse.ICON_EYE_COLORS, function(){
		item.iconEyeColor=parseInt(this.value);
	}, item.iconEyeColor);
	item._htmlSelectIconEyeColor.title=Locale._('Icon: eye color');
}

Horse.readAll=function(){
	var horsesIds=SavegameEditor.readString64Array('OwnedHorseList.ActorName');
	var validHorses=[];
	for(var i=0; i<horsesIds.length; i++){
		if(horsesIds[i]){
			validHorses.push(new Horse(
				i,
				horsesIds[i],
				SavegameEditor.readStringUTF8('OwnedHorseList.Name', i),
				SavegameEditor.readU32('OwnedHorseList.Mane', i),
				SavegameEditor.readU32('OwnedHorseList.Saddle', i),
				SavegameEditor.readU32('OwnedHorseList.Rein', i),
				SavegameEditor.readF32('OwnedHorseList.Familiarity', i),
				SavegameEditor.readU32('OwnedHorseList.HorseType', i),
				SavegameEditor.readU32('OwnedHorseList.Toughness', i),
				SavegameEditor.readU32('OwnedHorseList.Speed', i),
				SavegameEditor.readU32('OwnedHorseList.ChargeNum', i),
				SavegameEditor.readU32('OwnedHorseList.HorsePower', i),
				SavegameEditor.readU32('OwnedHorseList.Body.Pattern', i),
				SavegameEditor.readU32('OwnedHorseList.Body.EyeColor', i)
			));
		}
	}
	return validHorses;
}

Horse.AVAILABILITY=[
	'GameRomHorse00',
	'GameRomHorse01',
	'GameRomHorse02',
	'GameRomHorse03',
	'GameRomHorse04',
	'GameRomHorse05',
	'GameRomHorse06',
	'GameRomHorse07',
	'GameRomHorse08',
	'GameRomHorse09',
	'GameRomHorse10',
	'GameRomHorse11',
	'GameRomHorse12',
	'GameRomHorse13',
	'GameRomHorse14',
	'GameRomHorse15',
	'GameRomHorse16',
	'GameRomHorse17',
	'GameRomHorse18',
	'GameRomHorse19',
	'GameRomHorse20',
	'GameRomHorse21',
	'GameRomHorse22',
	'GameRomHorse23',
	'GameRomHorse25',
	'GameRomHorse26',
	'GameRomHorseEpona',
	'GameRomHorseZelda',
	'GameRomHorse00L',
	'GameRomHorse01L',
	'GameRomHorseGold',
	'GameRomHorseSpPattern',

	//untammable
	'GameRomHorseBone',
	'GameRomHorseBone_AllDay',
	'GameRomHorseForStreetVender',
	'GameRomHorseNushi'
	//'Animal_Bear_A',
	//'Animal_Bear_B'
];


Horse.TYPE_NORMAL=1; //normal
Horse.TYPE_ZELDA=3; //Royal White Stallion
Horse.TYPE_EPONA=4; //Epona
Horse.TYPE_GIANT_BLACK=2; //00L (Giant Black Stallion)
Horse.TYPE_GIANT_WHITE=13; //01L (Giant White Stallion)
Horse.TYPE_GOLD=12; //Gold
Horse.TYPE_SPOT=8; //SpPattern

Horse.ICON_PATTERNS=[
	{value:0x8ff7b62d, name:'00'}, //00
	{value:0x61ec6600, name:'01'}, //01
	{value:0x43caa47b, name:'02'}, //02
	{value:0xb8872476, name:'03'}, //03
	{value:0xfdcaa775, name:'04'}, //04
	{value:0xb28f2118, name:'05'}, //05
	{value:0xe7fc193e, name:'06 (Special: Gold)'}, //06	
];
Horse.ICON_EYE_COLORS=[
	{value:0x6cbc3cb4, name:'Black'},
	{value:0xe2911aba, name:'Blue'}
];
Horse.MANES=[
	{value:0xb6eede09, name:'None'}, //None
	{value:0xb93d9e3b, name:'Normal Mane'}, //Horse_Link_Mane
	{value:0x3a84d601, name:'Mane 01'}, //Horse_Link_Mane_01
	{value:0x0bffd92a, name:'Mane 02'}, //Horse_Link_Mane_02
	{value:0xe8125091, name:'Mane 03'}, //Horse_Link_Mane_03
	{value:0xfdb103b2, name:'Mane 04'}, //Horse_Link_Mane_04
	{value:0x75677ada, name:'Mane 05'}, //Horse_Link_Mane_05
	{value:0x9cbf81f2, name:'Mane 06'}, //Horse_Link_Mane_06
	{value:0x8140f2f9, name:'Mane 07'}, //Horse_Link_Mane_07
	{value:0xd749201c, name:'Mane 08'}, //Horse_Link_Mane_08
	{value:0xac2a896d, name:'Mane 09'}, //Horse_Link_Mane_09
	{value:0x87d9391f, name:'Mane 10'}, //Horse_Link_Mane_10
	{value:0xd6a61738, name:'Mane 11'}, //Horse_Link_Mane_11
	{value:0x12dd95d6, name:'Mane 12'}, //Horse_Link_Mane_12
	{value:0x9cd4f27b, name:'Giant black mane'}, //Horse_Link_Mane_00L
	{value:0x55365b10, name:'Giant white mane'}, //Horse_Link_Mane_01L
	{value:0xbad4c4a9, name:'*Donkey mane'} //Horse_Link_Mane_00S
];
Horse.SADDLES=[
	//{value:0xb6eede09, name:'None'}, //None
	{value:0x8573ae34, name:'Stable Saddle'}, //GameRomHorseSaddle_00
	{value:0x04c6c17b, name:'Traveler\'s Saddle'}, //GameRomHorseSaddle_01
	{value:0x47d0c84e, name:'Royal Saddle'}, //GameRomHorseSaddle_02
	{value:0xaeab565a, name:'Knight\'s Saddle'}, //GameRomHorseSaddle_03
	{value:0xcf167805, name:'Monster Saddle'}, //GameRomHorseSaddle_04
	{value:0x6e2db559, name:'Extravagant Saddle'}, //GameRomHorseSaddle_05
	{value:0xb926ed8b, name:'Towing Harness'}, //GameRomHorseSaddle_07
	{value:0xf1435392, name:'Giant Saddle'}, //GameRomHorseSaddle_00L
	{value:0x7feaa5c0, name:'*Saddle 06'}, //GameRomHorseSaddle_06
	{value:0x8c5bd272, name:'*Donkey Saddle'} //GameRomHorseSaddle_00S
	//{value:0xdeadbeef, name:'*Saddle 07_ExternalCoupler'}, //GameRomHorseSaddle_07_ExternalCoupler
	//{value:0xdeadbeef, name:'*Towing Harness (+ wagon)'}, //GameRomHorseSaddle_07_WithWagon
	//{value:0xdeadbeef, name:'*Saddle 00S_AncientAssistant'} //GameRomHorseSaddle_00S_AncientAssistant
];
Horse.REINS=[
	//{value:0xb6eede09, name:'None'}, //None
	{value:0x1864234b, name:'Stable Bridle'}, //GameRomHorseReins_00
	{value:0x094f807a, name:'Traveler\'s Bridle'}, //GameRomHorseReins_01
	{value:0xe54abe55, name:'Royal Reins'}, //GameRomHorseReins_02
	{value:0x0200441d, name:'Knight\'s Bridle'}, //GameRomHorseReins_03
	{value:0x85610de7, name:'Monster Bridle'}, //GameRomHorseReins_04
	{value:0xbdc6a58b, name:'Extravagant Bridle'}, //GameRomHorseReins_05
	{value:0x4dbf2061, name:'Giant Bridle'}, //GameRomHorseReins_00L
	{value:0x79c2c72f, name:'*Bridle 06'}, //GameRomHorseReins_06
	{value:0xe8fe6ab7, name:'*Donkey Bridle'} //GameRomHorseReins_00S
];
