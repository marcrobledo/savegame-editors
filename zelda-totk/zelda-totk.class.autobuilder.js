/*
	The legend of Zelda: Tears of the Kingdom savegame editor - Autobuilder class (last update 2023-08-02)

	by Marc Robledo 2023
	thanks to SuperSpazzy's hash crack
*/
function AutoBuilder(_index, index, combinedActorInfo, cameraPos, cameraAt){
	this._index=_index;
	this.index=index;
	this.combinedActorInfo=combinedActorInfo;
	this.cameraPos=cameraPos;
	this.cameraAt=cameraAt;
}
AutoBuilder.prototype.export=function(){
	var file=new MarcFile(AutoBuilder.CAI_EDITOR_SIZE);
	file.fileName='my_autobuilder_'+(this.index+1)+'.cai';
	file.littleEndian=true;
	file.writeBytes(0, this.combinedActorInfo);
	file.writeF32(AutoBuilder.CAI_SIZE+0, this.cameraPos.x);
	file.writeF32(AutoBuilder.CAI_SIZE+4, this.cameraPos.y);
	file.writeF32(AutoBuilder.CAI_SIZE+8, this.cameraPos.z);
	file.writeF32(AutoBuilder.CAI_SIZE+12, this.cameraAt.x);
	file.writeF32(AutoBuilder.CAI_SIZE+16, this.cameraAt.y);
	file.writeF32(AutoBuilder.CAI_SIZE+20, this.cameraAt.z);

	return file;
}
AutoBuilder.prototype.save=function(){
	SavegameEditor.writeU32('AutoBuilder.Draft.Content.Index', this._index, this.index);
	SavegameEditor.writeBinary('AutoBuilder.Draft.Content.CombinedActorInfo', this._index, this.combinedActorInfo);
	SavegameEditor.writeVector3F('AutoBuilder.Draft.Content.CameraPos', this._index, this.cameraPos);
	SavegameEditor.writeVector3F('AutoBuilder.Draft.Content.CameraAt', this._index, this.cameraAt);
}

AutoBuilder.CAI_HEADER='CmbAct';
AutoBuilder.CAI_SIZE=6688;
AutoBuilder.CAI_DRAFT_SIZE=AutoBuilder.CAI_SIZE + 1152; //yiga schematic + schema stones internal files
AutoBuilder.CAI_EDITOR_SIZE=AutoBuilder.CAI_SIZE + 12 + 12; //cameraPos + cameraAt


AutoBuilder.readSingle=function(autobuilderIndex){
	var _index=AutoBuilder.getIndexByAutobuilderIndex(autobuilderIndex);
	if(_index===-1)
		return null;
	var index=SavegameEditor.readU32Array('AutoBuilder.Draft.Content.Index', _index);
	var combinedActorInfo=SavegameEditor.readBinaryArray('AutoBuilder.Draft.Content.CombinedActorInfo', _index);
	var cameraPos=SavegameEditor.readVector3FArray('AutoBuilder.Draft.Content.CameraPos', _index);
	var cameraAt=SavegameEditor.readVector3FArray('AutoBuilder.Draft.Content.CameraAt', _index);

	return new AutoBuilder(
		_index,
		index,
		combinedActorInfo,
		cameraPos,
		cameraAt
	);
}
AutoBuilder.fromFile=function(file){
	file.littleEndian=true;
	if((file.fileSize===AutoBuilder.CAI_SIZE || file.fileSize===AutoBuilder.CAI_DRAFT_SIZE || file.fileSize===AutoBuilder.CAI_EDITOR_SIZE) && file.readString(0, 6)===AutoBuilder.CAI_HEADER){
		var cameraPos={x:0,y:0,z:0};
		var cameraAt={x:0,y:0,z:0};
		var caiData=file.readBytes(0, AutoBuilder.CAI_SIZE);
		
		if(file.fileSize===AutoBuilder.CAI_EDITOR_SIZE){
			cameraPos={
				x:file.readF32(AutoBuilder.CAI_SIZE+0),
				y:file.readF32(AutoBuilder.CAI_SIZE+4),
				z:file.readF32(AutoBuilder.CAI_SIZE+8),
			}
			cameraAt={
				x:file.readF32(AutoBuilder.CAI_SIZE+12),
				y:file.readF32(AutoBuilder.CAI_SIZE+16),
				z:file.readF32(AutoBuilder.CAI_SIZE+20),
			}
		}

		return new AutoBuilder(
			null,
			null,
			caiData,
			cameraPos,
			cameraAt
		);
	}
	return null;
}
AutoBuilder.getIndexByAutobuilderIndex=function(autobuilderIndex){
	return SavegameEditor.readU32Array('AutoBuilder.Draft.Content.Index').indexOf(autobuilderIndex);
}