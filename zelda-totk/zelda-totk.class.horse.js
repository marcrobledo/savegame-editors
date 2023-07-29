/*
	The legend of Zelda: Tears of the Kingdom savegame editor - Horse class (last update 2023-07-29)

	by Marc Robledo 2023
	horse data thanks to JonJaded, Ozymandias07 and Karlos007
*/

function Horse(itemData, overrideId){
	this.category='horses';

	this.id=itemData.id;
	this.name=itemData.name;
	this.mane=typeof itemData.mane==='string'? hash(itemData.mane): itemData.mane;
	this.saddles=typeof itemData.saddles==='string'? hash(itemData.saddles): itemData.saddles;
	this.reins=typeof itemData.reins==='string'? hash(itemData.reins): itemData.reins;
	this.bond=itemData.bond;
	this.bondChecked=itemData.bondChecked;
	this.statsStrength=itemData.statsStrength;
	this.statsSpeed=itemData.statsSpeed;
	this.statsStamina=itemData.statsStamina;
	this.statsPull=itemData.statsPull;
	this.horseType=itemData.horseType;
	this.colorType=itemData.colorType;
	this.footType=itemData.footType;
	this.amiiboUidHash=typeof itemData.amiiboUidHash==='string'? BigInt(itemData.amiiboUidHash) : itemData.amiiboUidHash;
	this.roomId=itemData.roomId;

	this.iconPattern=itemData.iconPattern;
	this.iconEyeColor=itemData.iconEyeColor;
	this.iconPrimaryColorRed=itemData.iconPrimaryColorRed;
	this.iconPrimaryColorGreen=itemData.iconPrimaryColorGreen;
	this.iconPrimaryColorBlue=itemData.iconPrimaryColorBlue;
	this.iconSecondaryColorRed=itemData.iconSecondaryColorRed;
	this.iconSecondaryColorGreen=itemData.iconSecondaryColorGreen;
	this.iconSecondaryColorBlue=itemData.iconSecondaryColorBlue;
	this.iconNoseColorRed=itemData.iconNoseColorRed;
	this.iconNoseColorGreen=itemData.iconNoseColorGreen;
	this.iconNoseColorBlue=itemData.iconNoseColorBlue;
	this.iconHairPrimaryColorRed=itemData.iconHairPrimaryColorRed;
	this.iconHairPrimaryColorGreen=itemData.iconHairPrimaryColorGreen;
	this.iconHairPrimaryColorBlue=itemData.iconHairPrimaryColorBlue;
	this.iconHairSecondaryColorRed=itemData.iconHairSecondaryColorRed;
	this.iconHairSecondaryColorGreen=itemData.iconHairSecondaryColorGreen;
	this.iconHairSecondaryColorBlue=itemData.iconHairSecondaryColorBlue;
	
	if(this.horseType===6 || this.horseType===11 || this.horseType>13)
		console.warn('unknown horse horseType value: '+this.horseType);
}

Horse.prototype.getItemTranslation=function(){
	return _(this.id);
}
Horse.prototype.export=function(){
	return{
		totkStruct:Pouch.getCategoryItemStructId(this.category),
		id:this.id,
		name:this.name,
		mane:this.mane,
		saddles:this.saddles,
		reins:this.reins,
		bond:this.bond,
		bondChecked:this.bondChecked,
		statsStrength:this.statsStrength,
		statsSpeed:this.statsSpeed,
		statsStamina:this.statsStamina,
		statsPull:this.statsPull,
		horseType:this.horseType,
		colorType:this.colorType,
		footType:this.footType,
		amiiboUidHash:this.amiiboUidHash.toString(),
		roomId:this.roomId,

		iconPattern:this.iconPattern,
		iconEyeColor:this.iconEyeColor,
		iconPrimaryColorRed:this.iconPrimaryColorRed,
		iconPrimaryColorGreen:this.iconPrimaryColorGreen,
		iconPrimaryColorBlue:this.iconPrimaryColorBlue,
		iconSecondaryColorRed:this.iconSecondaryColorRed,
		iconSecondaryColorGreen:this.iconSecondaryColorGreen,
		iconSecondaryColorBlue:this.iconSecondaryColorBlue,
		iconNoseColorRed:this.iconNoseColorRed,
		iconNoseColorGreen:this.iconNoseColorGreen,
		iconNoseColorBlue:this.iconNoseColorBlue,
		iconHairPrimaryColorRed:this.iconHairPrimaryColorRed,
		iconHairPrimaryColorGreen:this.iconHairPrimaryColorGreen,
		iconHairPrimaryColorBlue:this.iconHairPrimaryColorBlue,
		iconHairSecondaryColorRed:this.iconHairSecondaryColorRed,
		iconHairSecondaryColorGreen:this.iconHairSecondaryColorGreen,
		iconHairSecondaryColorBlue:this.iconHairSecondaryColorBlue
	}
}
Horse.prototype.refreshHtmlInputs=function(fixValues, ignoreEquipment){
	if(fixValues){
		var defaultValues=Horse.DEFAULT_VALUES[this.id] || Horse.DEFAULT_VALUES['GameRomHorse'];
		if(defaultValues.horseType)
			this.horseType=defaultValues.horseType;
		if(defaultValues.mane)
			this.mane=defaultValues.mane;
		if(defaultValues.saddles)
			this.saddles=defaultValues.saddles;
		if(defaultValues.reins)
			this.reins=defaultValues.reins;
	}
	this._htmlInputs.colorType.disabled=(this.horseType!==Horse.TYPE_NORMAL);
	this._htmlInputs.footType.disabled=(this.horseType!==Horse.TYPE_NORMAL);
}



Horse.buildHtmlElements=function(item){
	item._htmlInputs={
		name:Pouch.createItemInput(item, 'name', 'WString16', {maxLength:9, label:_('Horse name')}),
		mane:Pouch.createItemInput(item, 'mane', 'Enum', {enumValues:Horse.MANES, label:_('Mane')}),
		saddles:Pouch.createItemInput(item, 'saddles', 'Enum', {enumValues:Horse.SADDLES, label:_('Saddle')}),
		reins:Pouch.createItemInput(item, 'reins', 'Enum', {enumValues:Horse.REINS, label:_('Reins')}),
		bond:Pouch.createItemInput(item, 'bond', 'Float', {min:0, max:100, label:_('Bond')}),
		statsStrength:Pouch.createItemInput(item, 'statsStrength', 'Int', {min:100, max:350, label:_('Stats: Strength')}),
		statsSpeed:Pouch.createItemInput(item, 'statsSpeed', 'Int', {enumValues:Horse.OPTIONS_STATS, label:_('Stats: Speed')}),
		statsStamina:Pouch.createItemInput(item, 'statsStamina', 'Int', {enumValues:Horse.OPTIONS_STATS_STAMINA, label:_('Stats: Stamina')}),
		statsPull:Pouch.createItemInput(item, 'statsPull', 'Int', {enumValues:Horse.OPTIONS_STATS, label:_('Stats: Pull')}),
		colorType:Pouch.createItemInput(item, 'colorType', 'Int', {min:0, max:40, label:_('Horse color')}),
		footType:Pouch.createItemInput(item, 'footType', 'Int', {min:0, max:1, label:_('Foot type')})
	};
}


Horse.OPTIONS_STATS=[
	{value:1, name:'★★'},
	{value:2, name:'★★★'},
	{value:3, name:'★★★★'},
	{value:4, name:'★★★★★'}
];
Horse.OPTIONS_STATS_STAMINA=[
	{value:2, name:'★★'},
	{value:3, name:'★★★'},
	{value:4, name:'★★★★'},
	{value:5, name:'★★★★★'},
	{value:0, originalName:'Infinite'}
];
Horse.AVAILABILITY=[
	'GameRomHorse',
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
];



Horse.TYPE_NORMAL=1; //normal
Horse.TYPE_ZELDA=3; //Royal White Stallion
Horse.TYPE_EPONA=4; //Epona
Horse.TYPE_GIANT_BLACK=2; //00L (Giant Black Stallion)
Horse.TYPE_GIANT_WHITE=13; //01L (Giant White Stallion)
Horse.TYPE_GOLD=12; //Gold
Horse.TYPE_SPOT=8; //SpPattern

Horse.TYPE_DEER=0; //deer
Horse.TYPE_DONKEY=7; //Donkey
Horse.TYPE_STALHORSE=5; //Stalhorse
Horse.TYPE_LORD=9; //Lord of the mountain
Horse.TYPE_BEAR=10; //Bear

Horse.DEFAULT_VALUES={
	GameRomHorse:{
		horseType:Horse.TYPE_NORMAL
	},
	GameRomHorseZelda:{
		horseType:Horse.TYPE_ZELDA
	},
	GameRomHorseSpPattern:{
		horseType:Horse.TYPE_SPOT,
		iconPattern: '05',
		iconEyeColor: 'Black',
		iconPrimaryColorRed: 2,
		iconPrimaryColorGreen: 3,
		iconPrimaryColorBlue: 2,
		iconSecondaryColorRed: 51,
		iconSecondaryColorGreen: 41,
		iconSecondaryColorBlue: 29,
		iconNoseColorRed: 42,
		iconNoseColorGreen: 32,
		iconNoseColorBlue: 23,
		iconHairPrimaryColorRed: 255,
		iconHairPrimaryColorGreen: 255,
		iconHairPrimaryColorBlue: 255,
		iconHairSecondaryColorRed: 3,
		iconHairSecondaryColorGreen: 3,
		iconHairSecondaryColorBlue: 3
	},
	GameRomHorseGold:{
		horseType:Horse.TYPE_GOLD
	},
	GameRomHorseEpona:{
		horseType:Horse.TYPE_EPONA,
		mane: hash('Horse_Link_Mane'),
		saddles: hash('GameRomHorseSaddle_06') ,
		reins: hash('GameRomHorseReins_06'),
		statsStrength: 220,
		statsSpeed: 3,
		statsStamina: 4,
		statsPull: 2,
		horseType: 4,
		colorType: 0,
		footType: 0,
		iconPattern: '01',
		iconEyeColor: 'Black',
		iconPrimaryColorRed: 14,
		iconPrimaryColorGreen: 5,
		iconPrimaryColorBlue: 3,
		iconSecondaryColorRed: 168,
		iconSecondaryColorGreen: 149,
		iconSecondaryColorBlue: 104,
		iconNoseColorRed: 5,
		iconNoseColorGreen: 4,
		iconNoseColorBlue: 3,
		iconHairPrimaryColorRed: 255,
		iconHairPrimaryColorGreen: 255,
		iconHairPrimaryColorBlue: 255,
		iconHairSecondaryColorRed: 197,
		iconHairSecondaryColorGreen: 179,
		iconHairSecondaryColorBlue: 136
	},
	GameRomHorse00L:{
		horseType:Horse.TYPE_GIANT_BLACK,
		mane:hash('Horse_Link_Mane_00L'),
		saddles:hash('GameRomHorseSaddle_00L'),
		reins:hash('GameRomHorseReins_00L')
	},
	GameRomHorse01L:{
		horseType:Horse.TYPE_GIANT_WHITE,
		mane:hash('Horse_Link_Mane_01L'),
		saddles:hash('GameRomHorseSaddle_00L'),
		reins:hash('GameRomHorseReins_00L')
	},
	GameRomHorse00S:{
		//horseType:Horse.TYPE_DONKEY,
		horseType:Horse.TYPE_NORMAL,
		mane:hash('Horse_Link_Mane_00S'),
		saddles:hash('GameRomHorseSaddle_00S'),
		reins:hash('GameRomHorseReins_00S')
	},
	GameRomHorseBone:{
		horseType:Horse.TYPE_STALHORSE
	},
	GameRomHorseBone_AllDay:{
		horseType:Horse.TYPE_STALHORSE
	},
	GameRomHorseNushi:{
		horseType:Horse.TYPE_LORD
	}
}


/*Horse.ICON_PATTERNS=[
	{value:hash('00'), name:'00'},
	{value:hash('01'), name:'01'},
	{value:hash('02'), name:'02'},
	{value:hash('03'), name:'03'},
	{value:hash('04'), name:'04'},
	{value:hash('05'), name:'05 (Spotted?)'},
	{value:hash('06'), name:'06 (Special: Gold)'}
];*/
Horse.MANES=[
	{value:hash('None'), originalName:'None'},
	{value:hash('Horse_Link_Mane'), originalName:'Normal Mane'},
	{value:hash('Horse_Link_Mane_01'), originalName:'Mane 01'},
	{value:hash('Horse_Link_Mane_02'), originalName:'Mane 02'},
	{value:hash('Horse_Link_Mane_03'), originalName:'Mane 03'},
	{value:hash('Horse_Link_Mane_04'), originalName:'Mane 04'},
	{value:hash('Horse_Link_Mane_05'), originalName:'Mane 05'},
	{value:hash('Horse_Link_Mane_06'), originalName:'Mane 06'},
	{value:hash('Horse_Link_Mane_07'), originalName:'Mane 07'},
	{value:hash('Horse_Link_Mane_08'), originalName:'Mane 08'},
	{value:hash('Horse_Link_Mane_09'), originalName:'Mane 09'},
	{value:hash('Horse_Link_Mane_10'), originalName:'Mane 10'},
	{value:hash('Horse_Link_Mane_11'), originalName:'Mane 11'},
	{value:hash('Horse_Link_Mane_12'), originalName:'Mane 12'},
	{value:hash('Horse_Link_Mane_00L'), originalName:'Giant black mane'},
	{value:hash('Horse_Link_Mane_01L'), originalName:'Giant white mane'},
	{value:hash('Horse_Link_Mane_00S'), originalName:'*Donkey mane'}
];

Horse.SADDLES=[
	{value:hash('None'), originalName:'None'},
	{value:hash('GameRomHorseSaddle_00'), originalName:'GameRomHorseSaddle_00'},
	{value:hash('GameRomHorseSaddle_01'), originalName:'GameRomHorseSaddle_01'},
	{value:hash('GameRomHorseSaddle_02'), originalName:'GameRomHorseSaddle_02'},
	{value:hash('GameRomHorseSaddle_03'), originalName:'GameRomHorseSaddle_03'},
	{value:hash('GameRomHorseSaddle_04'), originalName:'GameRomHorseSaddle_04'},
	{value:hash('GameRomHorseSaddle_05'), originalName:'GameRomHorseSaddle_05'},
	{value:hash('GameRomHorseSaddle_06'), originalName:'GameRomHorseSaddle_06'},
	{value:hash('GameRomHorseSaddle_07'), originalName:'GameRomHorseSaddle_07'},
	{value:hash('GameRomHorseSaddle_00L'), originalName:'GameRomHorseSaddle_00L'},
	{value:hash('GameRomHorseSaddle_00S'), originalName:'GameRomHorseSaddle_00S'}
];
Horse.REINS=[
	{value:hash('None'), originalName:'None'},
	{value:hash('GameRomHorseReins_00'), originalName:'GameRomHorseReins_00'},
	{value:hash('GameRomHorseReins_01'), originalName:'GameRomHorseReins_01'},
	{value:hash('GameRomHorseReins_02'), originalName:'GameRomHorseReins_02'},
	{value:hash('GameRomHorseReins_03'), originalName:'GameRomHorseReins_03'},
	{value:hash('GameRomHorseReins_04'), originalName:'GameRomHorseReins_04'},
	{value:hash('GameRomHorseReins_05'), originalName:'GameRomHorseReins_05'},
	{value:hash('GameRomHorseReins_06'), originalName:'GameRomHorseReins_06'},
	{value:hash('GameRomHorseReins_00L'), originalName:'GameRomHorseReins_00L'},
	{value:hash('GameRomHorseReins_00S'), originalName:'GameRomHorseReins_00S'}
];