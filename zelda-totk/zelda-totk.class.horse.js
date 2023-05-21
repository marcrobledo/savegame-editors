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

	Horse.buildHtmlElements(this);
}
Horse.prototype.getItemTranslation=function(){
	return Horse.TRANSLATIONS[this.id] || this.id;
}
Horse.prototype.save=function(){
	SavegameEditor.writeString64('ArrayHorseIds', this.index, this.id);
	SavegameEditor.writeStringUTF8('ArrayHorseNames', this.index, this.name);
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
	'GameRomHorseSpPattern',
	'GameRomHorseBone',
	'GameRomHorseBone_AllDay',
	'GameRomHorseForStreetVender',
	'GameRomHorseNushi'
];
Horse.HORSE_REINS=['GameRomHorseReins_00','GameRomHorseReins_01','GameRomHorseReins_02','GameRomHorseReins_03','GameRomHorseReins_04','GameRomHorseReins_05','GameRomHorseReins_06','GameRomHorseReins_00L','GameRomHorseReins_10'];
Horse.HORSE_SADDLES=['GameRomHorseSaddle_00','GameRomHorseSaddle_01','GameRomHorseSaddle_02','GameRomHorseSaddle_03','GameRomHorseSaddle_04','GameRomHorseSaddle_05','GameRomHorseSaddle_06','GameRomHorseSaddle_00L','GameRomHorseSaddle_00S','GameRomHorseSaddle_10'];
Horse.HORSE_TYPES_UNTAMMED=[];


Horse.TRANSLATIONS=(function(horseTypes){
	var names={};
	horseTypes.forEach(function(id, i){
		names[id]=id.replace('GameRom', '');
	});
	return names;
}(Horse.HORSE_TYPES));