/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Map pin class) v20230522

	by Marc Robledo 2023
*/

function MapPin(index, icon, vector){
	this.index=index;

	this.icon=icon;
	this.vector=vector;
}

MapPin.readAll=function(){
	var mapPins=[];
	var mapPinIcons=SavegameEditor.readU32Array('ArrayMapPinIcons');
	for(var i=0; i<mapPinIcons.length; i++){
		mapPins.push(new MapPin(
			i,
			mapPinIcons[i],
			SavegameEditor.readVector2F('ArrayMapPinCoordinates', i)
		));
	}
	return mapPins;
}
MapPin.count=function(mapPins){
	var count=0;
	for(var i=0; i<mapPins.length; i++){
		if(mapPins[i].icon!==MapPin.ICON_NONE)
			count+=mapPins[i].value;
	}
	return count;
}

MapPin.ICON_NONE=0x7e3d1e46;
MapPin.ICON_SWORD=0xb3005873;
MapPin.ICON_POT=0x9f0d8121;
MapPin.ICON_HUMAN=0x0a8749f6;
MapPin.ICON_DIAMOND=0x57bd0c79;
MapPin.ICON_HEART=0xc6aa2e79;
MapPin.ICON_STAR=0x55511229;
MapPin.ICON_CHEST=0x0aedde59;
MapPin.ICON_SKULL=0x3028107d;
MapPin.ICON_LEAF=0x51b0bed0;
MapPin.ICON_CRYSTAL=0x8093120e;