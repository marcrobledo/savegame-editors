/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Map pin class) v20230522

	by Marc Robledo 2023
*/

function MapPin(index, icon, coordinates, map){
	this.index=index;

	this.icon=icon;
	this.coordinates=coordinates;
	this.map=map;
}
MapPin.prototype.clear=function(){
	if(!this.isFree()){
		this.icon=MapPin.ICON_NONE;
		this.coordinates={x:0.0, y:0.0};
		this.map=MapPin.MAP_MAIN;
		return true;
	}
	return false;
}
MapPin.prototype.isFree=function(){
	return this.icon===MapPin.ICON_NONE;
}
MapPin.prototype.save=function(){
	SavegameEditor.writeU32('ArrayMapPinIcons', this.index, this.icon);
	SavegameEditor.writeVector2F('ArrayMapPinCoordinates', this.index, this.coordinates);
	SavegameEditor.writeU32('ArrayMapPinMap', this.index, this.map);
}

MapPin.readAll=function(){
	var mapPins=[];
	var mapPinIcons=SavegameEditor.readU32Array('ArrayMapPinIcons');
	for(var i=0; i<mapPinIcons.length; i++){
		mapPins.push(new MapPin(
			i,
			mapPinIcons[i],
			SavegameEditor.readVector2F('ArrayMapPinCoordinates', i),
			SavegameEditor.readU32Array('ArrayMapPinMap', i)
		));
	}
	return mapPins;
}
MapPin.count=function(mapPins){
	var count=0;
	for(var i=0; i<mapPins.length; i++){
		if(!mapPins[i].isFree())
			count++;
	}
	return count;
}
MapPin.find=function(mapPins, x, y, z){
	for(var i=0; i<mapPins.length; i++){
		if(mapPins[i].coordinates.x===x && mapPins[i].coordinates.y===y && mapPins[i].map===MapPin.getMapByZ(z))
			return true;
	}
	return false;
}
MapPin.getMapByZ=function(z){
	return z>800? MapPin.MAP_SKY : MapPin.MAP_MAIN;
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

MapPin.MAP_SKY=0xb1085c38;
MapPin.MAP_MAIN=0x24950135;
MapPin.MAP_MINUS=0xf0235d8d;

MapPin.MAX=300;