/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Horse class) v20230521

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Horse(index, id, name){
	this.category='horses';
	this.index=index;

	this.id=id;
	this.name=name;
}
Horse.prototype.save=function(){
	SavegameEditor.writeString64('ArrayHorseIds', this.index, this.id);
}


Horse.buildHtmlElements=function(horse){
	//build html elements
	//to-do
}

Horse.readAll=function(){
	var horsesIds=SavegameEditor.readString64Array('ArrayHorseIds');
	var validHorses=[];
	for(var i=0; i<horsesIds.length; i++){
		if(horsesIds[i]){
			validHorses.push(new Horse(
				i,
				horsesIds[i],
				SavegameEditor.readStringUTF8('ArrayHorseNames', i)
			));
		}
	}
	return validHorses;
}

Horse.HORSE_TYPES=[
	'GameRomHorse00','GameRomHorse01','GameRomHorse02','GameRomHorse03','GameRomHorse04','GameRomHorse05','GameRomHorse06','GameRomHorse07','GameRomHorse08','GameRomHorse09','GameRomHorse10','GameRomHorse11','GameRomHorse12','GameRomHorse13','GameRomHorse14','GameRomHorse15','GameRomHorse16','GameRomHorse17','GameRomHorse18','GameRomHorse19','GameRomHorse20','GameRomHorse21','GameRomHorse22','GameRomHorse23','GameRomHorse25','GameRomHorse26','GameRomHorseEpona','GameRomHorseZelda','GameRomHorse00L','GameRomHorse01L','GameRomHorseGold',

	//untested, posible freeze
	'GameRomHorseBone',
	'GameRomHorseBone_AllDay',
	'GameRomHorseForStreetVender',
	'GameRomHorseNushi'
];
Horse.HORSE_REINS=['GameRomHorseReins_00','GameRomHorseReins_01','GameRomHorseReins_02','GameRomHorseReins_03','GameRomHorseReins_04','GameRomHorseReins_05','GameRomHorseReins_06','GameRomHorseReins_00L','GameRomHorseReins_10'];
Horse.HORSE_SADDLES=['GameRomHorseSaddle_00','GameRomHorseSaddle_01','GameRomHorseSaddle_02','GameRomHorseSaddle_03','GameRomHorseSaddle_04','GameRomHorseSaddle_05','GameRomHorseSaddle_06','GameRomHorseSaddle_00L','GameRomHorseSaddle_00S','GameRomHorseSaddle_10'];
Horse.HORSE_TYPES_UNTAMMED=[];


Horse.TRANSLATIONS={
	//to-do
};
