/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Horse class) v20230526

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
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
	if(this.id==='GameRomHorse00L'){
		this.specialType=Horse.TYPE_GIANT_BLACK;
		if(!ignoreEquipment){
			this.mane=0x9cd4f27b;
			this.saddles=0xf1435392;
			this.reins=0x4dbf2061;
		}
		this._htmlSelectIconPattern.disabled=true;
		this._htmlSelectIconEyeColor.disabled=true;
		//this.temperament='wild';
	}else if(this.id==='GameRomHorse01L'){
		this.specialType=Horse.TYPE_GIANT_WHITE;
		if(!ignoreEquipment){
			this.mane=0x55365b10;
			this.saddles=0xf1435392;
			this.reins=0x4dbf2061;
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
		this._htmlSelectIconPattern.disabled=false;
		this._htmlSelectIconEyeColor.disabled=false;
		//this.temperament='gentle'; //???
	}
}
Horse.prototype.getItemTranslation=function(){
	return Horse.TRANSLATIONS[this.id] || this.id;
}
Horse.prototype.save=function(){
	SavegameEditor.writeString64('ArrayHorseIds', this.index, this.id);
	SavegameEditor.writeStringUTF8('ArrayHorseNames', this.index, this.name);
	SavegameEditor.writeU32('ArrayHorseManes', this.index, this.mane);
	SavegameEditor.writeU32('ArrayHorseSaddles', this.index, this.saddles);
	SavegameEditor.writeU32('ArrayHorseReins', this.index, this.reins);
	SavegameEditor.writeF32('ArrayHorseBonds', this.index, this.bond);
	SavegameEditor.writeU32('ArrayHorseSpecialTypes', this.index, this.specialType);
	SavegameEditor.writeU32('ArrayHorseStatsStrength', this.index, this.statsStrength);
	SavegameEditor.writeU32('ArrayHorseStatsSpeed', this.index, this.statsSpeed);
	SavegameEditor.writeU32('ArrayHorseStatsStamina', this.index, this.statsStamina);
	SavegameEditor.writeU32('ArrayHorseStatsPull', this.index, this.statsPull);
	SavegameEditor.writeU32('ArrayHorseIconPatterns', this.index, this.iconPattern);
	SavegameEditor.writeU32('ArrayHorseIconEyeColors', this.index, this.iconEyeColor);
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
	item._htmlInputName.title='Horse name';
	item._htmlInputName.maxLength=9;

	item._htmlSelectMane=select('horse-mane-'+item.index, Horse.MANES, function(){
		item.mane=this.value;
	}, item.mane);
	item._htmlSelectMane.title='Mane';

	item._htmlSelectSaddles=select('horse-saddles-'+item.index, Horse.SADDLES, function(){
		item.saddles=this.value;
	}, item.saddles);
	item._htmlSelectSaddles.title='Saddles';

	item._htmlSelectReins=select('horse-reins-'+item.index, Horse.REINS, function(){
		item.reins=this.value;
	}, item.reins);
	item._htmlSelectReins.title='Reins';

	item._htmlInputBond=inputFloat('bond-'+item.category+'-'+item.index,0,100,item.bond*100);
	item._htmlInputBond.addEventListener('change', function(){
		item.bond=parseFloat(this.value) / 100;
	});
	item._htmlInputBond.title='Bond';


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
		{value:5, name:'★★★★★'}
	];
	item._htmlInputStatsStrength=inputNumber('horse-stats-strength-'+item.index,100,350,item.statsStrength);
	item._htmlInputStatsStrength.addEventListener('change', function(){
		item.statsStrength=parseInt(this.value);
	});
	item._htmlInputStatsStrength.title='Stats: Strength';
	item._htmlSelectStatsSpeed=select('horse-stats-speed-'+item.index, stats, function(){
		item.statsSpeed=parseInt(this.value);
	}, item.statsSpeed);
	item._htmlSelectStatsSpeed.title='Stats: Speed';
	item._htmlSelectStatsStamina=select('horse-stats-stamina-'+item.index, statsStamina, function(){
		item.statsStamina=parseInt(this.value);
	}, item.statsStamina);
	item._htmlSelectStatsStamina.title='Stats: Stamina';
	item._htmlSelectStatsPull=select('horse-stats-pull-'+item.index, stats, function(){
		item.statsPull=parseInt(this.value);
	}, item.statsPull);
	item._htmlSelectStatsPull.title='Stats: Pull';




	item._htmlSelectIconPattern=select('horse-icon-pattern-'+item.index, Horse.ICON_PATTERNS, function(){
		item.iconPattern=parseInt(this.value);
	}, item.iconPattern);
	item._htmlSelectIconPattern.title='Icon pattern';

	item._htmlSelectIconEyeColor=select('horse-icon-eye-color-'+item.index, Horse.ICON_EYE_COLORS, function(){
		item.iconEyeColor=parseInt(this.value);
	}, item.iconEyeColor);
	item._htmlSelectIconEyeColor.title='Icon eye color';
}

Horse.readAll=function(){
	var horsesIds=SavegameEditor.readString64Array('ArrayHorseIds');
	var validHorses=[];
	for(var i=0; i<horsesIds.length; i++){
		if(horsesIds[i]){
			validHorses.push(new Horse(
				i,
				horsesIds[i],
				SavegameEditor.readStringUTF8('ArrayHorseNames', i),
				SavegameEditor.readU32('ArrayHorseManes', i),
				SavegameEditor.readU32('ArrayHorseSaddles', i),
				SavegameEditor.readU32('ArrayHorseReins', i),
				SavegameEditor.readF32('ArrayHorseBonds', i),
				SavegameEditor.readU32('ArrayHorseSpecialTypes', i),
				SavegameEditor.readU32('ArrayHorseStatsStrength', i),
				SavegameEditor.readU32('ArrayHorseStatsSpeed', i),
				SavegameEditor.readU32('ArrayHorseStatsStamina', i),
				SavegameEditor.readU32('ArrayHorseStatsPull', i),
				SavegameEditor.readU32('ArrayHorseIconPatterns', i),
				SavegameEditor.readU32('ArrayHorseIconEyeColors', i)
			));
		}
	}
	return validHorses;
}

Horse.TRANSLATIONS={
	'GameRomHorse00':'Horse 00',
	'GameRomHorse01':'Horse 01',
	'GameRomHorse02':'Horse 02',
	'GameRomHorse03':'Horse 03',
	'GameRomHorse04':'Horse 04',
	'GameRomHorse05':'Horse 05',
	'GameRomHorse06':'Horse 06',
	'GameRomHorse07':'Horse 07',
	'GameRomHorse08':'Horse 08',
	'GameRomHorse09':'Horse 09',
	'GameRomHorse10':'Horse 10',
	'GameRomHorse11':'Horse 11',
	'GameRomHorse12':'Horse 12',
	'GameRomHorse13':'Horse 13',
	'GameRomHorse14':'Horse 14',
	'GameRomHorse15':'Horse 15',
	'GameRomHorse16':'Horse 16',
	'GameRomHorse17':'Horse 17',
	'GameRomHorse18':'Horse 18',
	'GameRomHorse19':'Horse 19',
	'GameRomHorse20':'Horse 20',
	'GameRomHorse21':'Horse 21',
	'GameRomHorse22':'Horse 22',
	'GameRomHorse23':'Horse 23',
	'GameRomHorse25':'Horse 25',
	'GameRomHorse26':'Horse 26',
	'GameRomHorseEpona':'Epona (amiibo)',
	'GameRomHorseZelda':'Royal White Stallion',
	'GameRomHorse00L':'Giant Black Stallion',
	'GameRomHorse01L':'Giant White Stallion',
	'GameRomHorseGold':'Golden',
	'GameRomHorseSpPattern':'Spot',

	//untammable	
	'GameRomHorseBone':'Stalhorse*',
	'GameRomHorseBone_AllDay':'Stalhorse* (daytime)',
	'GameRomHorseForStreetVender':'Merchant*',
	'GameRomHorseNushi':'Lord of the Mountain*'
};




Horse.TYPE_NORMAL=1; //normal
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
	{value:0xb93d9e3b, name:'Mane'}, //Horse_Link_Mane
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
	{value:0x9cd4f27b, name:'Mane 00L'}, //Horse_Link_Mane_00L
	{value:0x55365b10, name:'Mane 01L'}, //Horse_Link_Mane_01L
	{value:0xbad4c4a9, name:'Mane 00S'} //Horse_Link_Mane_00S
];
Horse.SADDLES=[
	{value:0xb6eede09, name:'None'}, //None
	{value:0x8573ae34, name:'Saddle 00'}, //GameRomHorseSaddle_00
	{value:0x04c6c17b, name:'Saddle 01'}, //GameRomHorseSaddle_01
	{value:0x47d0c84e, name:'Saddle 02'}, //GameRomHorseSaddle_02
	{value:0xaeab565a, name:'Saddle 03'}, //GameRomHorseSaddle_03
	{value:0xcf167805, name:'Saddle 04'}, //GameRomHorseSaddle_04
	{value:0x6e2db559, name:'Saddle 05'}, //GameRomHorseSaddle_05
	{value:0x7feaa5c0, name:'Saddle 06'}, //GameRomHorseSaddle_06
	{value:0xb926ed8b, name:'Saddle 07'}, //GameRomHorseSaddle_07
	{value:0xf1435392, name:'Saddle 00L'}, //GameRomHorseSaddle_00L
	{value:0x8c5bd272, name:'Saddle 00S'} //GameRomHorseSaddle_00S
];
Horse.REINS=[
	{value:0xb6eede09, name:'None'}, //None
	{value:0x1864234b, name:'Reins 00'}, //GameRomHorseReins_00
	{value:0x094f807a, name:'Reins 01'}, //GameRomHorseReins_01
	{value:0xe54abe55, name:'Reins 02'}, //GameRomHorseReins_02
	{value:0x0200441d, name:'Reins 03'}, //GameRomHorseReins_03
	{value:0x85610de7, name:'Reins 04'}, //GameRomHorseReins_04
	{value:0xbdc6a58b, name:'Reins 05'}, //GameRomHorseReins_05
	{value:0x79c2c72f, name:'Reins 06'}, //GameRomHorseReins_06
	{value:0x4dbf2061, name:'Reins 00L'}, //GameRomHorseReins_00L
	{value:0xe8fe6ab7, name:'Reins 00S'} //GameRomHorseReins_00S
];
