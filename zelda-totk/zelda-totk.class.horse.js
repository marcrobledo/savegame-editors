/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Horse class) v20230519

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Horse(index){
	this.category='horses';
	this.index=index;
	this._offsets=Horses.Offsets;

	this.id=SavegameEditor.readString64Array(this._offsets.ID, index);
	this.name=SavegameEditor.readUTF8String64Array(this._offsets.NAME, index);
}
Horse.prototype.save=function(){
	SavegameEditor.writeString64Array(this._offsets.ID, this.index, this.id);
}


Horse.buildHtmlElements=function(horse){
	//build html elements
	//to-do
}

/*setHorseName:function(i,val){
	if(i<5)
		this._writeString64(this.Offsets.HORSE_NAMES, val, i);
},
setHorseSaddle:function(i,val){
	if(i<5)
		this._writeString64(this.Offsets.HORSE_SADDLES, val, i);
},
setHorseReins:function(i,val){
	if(i<5)
		this._writeString64(this.Offsets.HORSE_REINS, val, i);
},
setHorseType:function(i,val){
	if(currentEditingItem<6){
		this._writeString64(this.Offsets.HORSE_TYPES, val, i);
		// fix mane
		this._writeString64(this.Offsets.HORSE_MANES, (val==='GameRomHorse00L'?'Horse_Link_Mane_00L':'Horse_Link_Mane'), i);
	}
},
for(var i=0; i<6; i++){
	if(i<6){
		//get('select-horse'+i+'-saddles').horseIndex=i;
		//get('select-horse'+i+'-saddles').addEventListener('change', function(){SavegameEditor.setHorseSaddle(this.horseIndex, this.value)}, false);
		//get('select-horse'+i+'-reins').horseIndex=i;
		//get('select-horse'+i+'-reins').addEventListener('change', function(){SavegameEditor.setHorseReins(this.horseIndex, this.value)}, false);
	}
	get('select-horse'+i+'-type').horseIndex=i;
	get('select-horse'+i+'-type').addEventListener('change', function(){SavegameEditor.setHorseType(this.horseIndex, this.value)}, false);

	//select('horse'+i+'-saddles', this._arrayToSelectOpts(TOTK_Data.HORSE_SADDLES));
	//select('horse'+i+'-reins', this._arrayToSelectOpts(TOTK_Data.HORSE_REINS));
	//select('horse'+i+'-type', this._arrayToSelectOpts(i===6?TOTK_Data.HORSE_TYPES.concat(TOTK_Data.HORSE_TYPES_UNTAMMED):TOTK_Data.HORSE_TYPES));
}
*/
var Horses={};
Horses.readAll=function(){
	var horses=[];
	var maxHorses=SavegameEditor.readArraySize(Horses.Offsets.ID);
	for(var i=0; i<maxHorses; i++){
		var horse=new Horse(i);
		if(horse.id)
			horses.push(horse);
	}
	return horses;
}
Horses.Offsets={ //v1.0 offsets, v1.1=v1.0 + 0x38
	ID:			0x0008a0ec,
	NAME:		0x0010a148
}

Horses.HORSE_TYPES=[
	'GameRomHorse00','GameRomHorse01','GameRomHorse02','GameRomHorse03','GameRomHorse04','GameRomHorse05','GameRomHorse06','GameRomHorse07','GameRomHorse08','GameRomHorse09','GameRomHorse10','GameRomHorse11','GameRomHorse12','GameRomHorse13','GameRomHorse14','GameRomHorse15','GameRomHorse16','GameRomHorse17','GameRomHorse18','GameRomHorse19','GameRomHorse20','GameRomHorse21','GameRomHorse22','GameRomHorse23','GameRomHorse25','GameRomHorse26','GameRomHorseEpona','GameRomHorseZelda','GameRomHorse00L','GameRomHorse01L','GameRomHorseGold',

	//untested, posible freeze
	'GameRomHorseBone',
	'GameRomHorseBone_AllDay',
	'GameRomHorseForStreetVender',
	'GameRomHorseNushi'
];
Horses.HORSE_REINS=['GameRomHorseReins_00','GameRomHorseReins_01','GameRomHorseReins_02','GameRomHorseReins_03','GameRomHorseReins_04','GameRomHorseReins_05','GameRomHorseReins_06','GameRomHorseReins_00L','GameRomHorseReins_10'];
Horses.HORSE_SADDLES=['GameRomHorseSaddle_00','GameRomHorseSaddle_01','GameRomHorseSaddle_02','GameRomHorseSaddle_03','GameRomHorseSaddle_04','GameRomHorseSaddle_05','GameRomHorseSaddle_06','GameRomHorseSaddle_00L','GameRomHorseSaddle_00S','GameRomHorseSaddle_10'];
Horses.HORSE_TYPES_UNTAMMED=[];


Horses.TRANSLATIONS={
	//to-do
}


