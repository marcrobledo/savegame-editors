/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Autobuilder class) v20230603

	by Marc Robledo 2023
	thanks to SuperSpazzy's hash crack
*/
function AutoBuilder(_index, index, combinedActorInfo, cameraPos, cameraAt, isFavorite){
	this._index=_index;
	this.index=index;
	this.combinedActorInfo=combinedActorInfo;
	this.cameraPos=cameraPos;
	this.cameraAt=cameraAt;
	this.isFavorite=isFavorite;
}
AutoBuilder.prototype.export=function(){
	var file=new MarcFile(AutoBuilder.FILE_SIZE + this.combinedActorInfo.length);
	file.fileName='my_autobuilder.totkdata';
	var offset=0;
	file.writeString(offset, AutoBuilder.EXPORTED_HEADER, AutoBuilder.EXPORTED_HEADER.length);
	offset+=AutoBuilder.EXPORTED_HEADER.length;
	file.writeU32(offset, this.index);
	offset+=4;
	file.writeF32(offset+0, this.cameraPos.x);
	file.writeF32(offset+4, this.cameraPos.y);
	file.writeF32(offset+8, this.cameraPos.z);
	offset+=12;
	file.writeF32(offset+0, this.cameraAt.x);
	file.writeF32(offset+4, this.cameraAt.y);
	file.writeF32(offset+8, this.cameraAt.z);
	offset+=12;
	file.writeS32(offset, this.isFavorite);
	offset+=4;
	file.writeBytes(offset, this.combinedActorInfo);
	
	file.save();
}
AutoBuilder.prototype.import=function(file){
	if(file.length!==(AutoBuilder.FILE_SIZE + this.combinedActorInfo.length)){
		return AutoBuilder.ERROR_UNKNOWN;
	}else if(file.readString(0, AutoBuilder.EXPORTED_HEADER.length)!==AutoBuilder.EXPORTED_HEADER){
		return AutoBuilder.ERROR_INVALID_HEADER;
	}

	var offset=AutoBuilder.EXPORTED_HEADER.length;

	offset+=4; //skip index
	this.cameraPos.x=file.readF32(offset+0);
	this.cameraPos.y=file.readF32(offset+4);
	this.cameraPos.z=file.readF32(offset+8);
	offset+=12;
	this.cameraAt.x=file.readF32(offset+0);
	this.cameraAt.y=file.readF32(offset+4);
	this.cameraAt.z=file.readF32(offset+8);
	offset+=12;
	offset+=4; //skip isFavorite
	this.combinedActorInfo=file.readBytes(offset, this.combinedActorInfo.length);

	//this.save();
	return 0;
}
AutoBuilder.prototype.save=function(){
	SavegameEditor.writeU32('AutoBuilder.Draft.Content.Index', this._index, this.index);
	SavegameEditor.writeDynamicData('AutoBuilder.Draft.Content.CombinedActorInfo', this._index, this.combinedActorInfo);
	SavegameEditor.writeVector3F('AutoBuilder.Draft.Content.CameraPos', this._index, this.cameraPos);
	SavegameEditor.writeVector3F('AutoBuilder.Draft.Content.CameraAt', this._index, this.cameraAt);
	SavegameEditor.writeS32('AutoBuilder.Draft.Content.IsFavorite', this._index, this.isFavorite);
}

AutoBuilder.ERROR_UNKNOWN=1;
AutoBuilder.ERROR_INVALID_HEADER=2;
AutoBuilder.EXPORTED_HEADER='TOTKAutoBuilder1';
AutoBuilder.FILE_SIZE=(AutoBuilder.EXPORTED_HEADER.length + 4 + 12 + 12 + 4);
AutoBuilder.readAll=function(){
	var index=SavegameEditor.readU32Array('AutoBuilder.Draft.Content.Index');
	var combinedActorInfo=SavegameEditor.readDynamicDataArray('AutoBuilder.Draft.Content.CombinedActorInfo');
	var cameraPos=SavegameEditor.readVector3FArray('AutoBuilder.Draft.Content.CameraPos');
	var cameraAt=SavegameEditor.readVector3FArray('AutoBuilder.Draft.Content.CameraAt');
	var isFavorite=SavegameEditor.readS32Array('AutoBuilder.Draft.Content.IsFavorite');

	var autobuilders=[];
	for(var i=0; i<combinedActorInfo.length; i++){
		autobuilders.push(new AutoBuilder(
			i,
			index[i],
			combinedActorInfo[i],
			cameraPos[i],
			cameraAt[i],
			isFavorite[i]
		));
	}
	return autobuilders.sort(function(a,b){
		return a.index - b.index;
	});
}

AutoBuilder.findByIndex=function(index){
	for(var i=0; i<SavegameEditor.currentItems.autobuilders.length; i++){
		if(SavegameEditor.currentItems.autobuilders[i].index===index)
			return SavegameEditor.currentItems.autobuilders;
	}
	return null;
}