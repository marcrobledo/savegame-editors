/*
	The legend of Zelda: Tears of the Kingdom savegame editor - variable reader/writer (last update 2023-07-08)
	by Marc Robledo 2023
*/



const RAW_COORDINATES_TRANSFORM=true;


function Struct(structId, variablesInfo, structArray){
	this._structId=structId;
	this._originalStructData=variablesInfo;
	this.variables=[];

	for(var i=0; i<variablesInfo.length; i++){
		if(typeof variablesInfo[i].structArray==='string' && typeof variablesInfo[i].variablesInfo==='object'){
			this.variables.push(new Struct(variablesInfo[i].structArray, variablesInfo[i].variablesInfo, true));
		}else{
			var variable=new Variable(variablesInfo[i].hash, variablesInfo[i].type, variablesInfo[i].enumValues);
			if(structArray && !variable.isArray()){
				throw new Error('Struct array variable['+i+'] is not an Array');
			}
			if(variablesInfo[i].label)
				variable.setLabel(variablesInfo[i].label);
			this.variables.push(variable);
		}
	}
}
Struct.prototype.buildHtmlInputRows=function(autosave){
	var inputRows=[];
	for(var i=0; i<this.variables.length; i++){
		var variableInputRows;
		if(this.variables[i]._structId){
			variableInputRows=this.variables[i].buildHtmlInputRows(autosave).sort(function(a,b){
				return a.arrayIndex - b.arrayIndex;
			});
		}else{
			variableInputRows=this.variables[i].buildHtmlInputs(autosave, true);
		}
		inputRows=inputRows.concat(variableInputRows);
	}

	return inputRows;
}
Struct.prototype.saveAll=function(){
	for(var i=0; i<this.variables.length; i++){
		if(this.variables[i]._structId){
			this.variables[i].saveAll();
		}else{
			this.variables[i].save();
		}
	}
}
Struct.prototype.export=function(arrayIndex){
	var jsonObject={totkStruct:this._structId};

	for(var i=0; i<this.variables.length; i++){
		var propertyName;
		if(this.variables[i]._structId)
			propertyName=this.variables[i]._structId;
		else if(typeof this._originalStructData[i].propertyName==='string')
			propertyName=this._originalStructData[i].propertyName;
		else if(typeof this._originalStructData[i].hash==='string')
			propertyName=this._originalStructData[i].hash;
		else
			throw new Error('invalid JSON object property name while exporting');

		if(this.variables[i]._structId){
			var arrayLen=this.variables[i].variables[0].value.length;
			var objs=new Array(arrayLen);
			for(var j=0; j<arrayLen; j++){
				objs[j]={};
				for(var k=0; k<this.variables[i].variables.length; k++){
					var propertyName2;
					if(this.variables[i].variables[k]._structId)
						propertyName2=this.variables[i].variables[k]._structId;
					else if(typeof this.variables[i]._originalStructData[k].propertyName==='string')
						propertyName2=this.variables[i]._originalStructData[k].propertyName;
					else if(typeof this.variables[i]._originalStructData[k].hash==='string')
						propertyName2=this.variables[i]._originalStructData[k].hash;
					else
						throw new Error('invalid JSON object property name while exporting');
					if(this.variables[i].variables[k]._structId){
						objs[j][propertyName2]=this.variables[i].variables[k].export();
					}else{
		
						if(typeof this.variables[i]._originalStructData[k].arrayPartitionSize==='number'){
							var arrayPartitionSize=this.variables[i]._originalStructData[k].arrayPartitionSize;
							if(arrayPartitionSize<2 || this.variables[i].variables[0].value.length%arrayPartitionSize!==0){
								throw new Error('Invalid arrayPartitionSize for '+this.variables[i].variablesInfo[k].propertyName);
							}
							objs[j][propertyName2]=(this.variables[i].variables[k].export()).slice(j*arrayPartitionSize, j*arrayPartitionSize + arrayPartitionSize);
						}else{
							objs[j][propertyName2]=(this.variables[i].variables[k].export())[j];
						}
					}
				}
			}
			jsonObject[propertyName]=objs;
		}else{
			jsonObject[propertyName]=this.variables[i].export();
		}
	}
	return jsonObject;
}
Struct.prototype.import=function(jsonObject){
	if(this._structId !== jsonObject.totkStruct)
		throw new Error('Struct ids don\'t match');

	var nChanges=0;

	for(var i=0; i<this.variables.length; i++){
		var propertyName;
		if(this.variables[i]._structId)
			propertyName=this.variables[i]._structId;
		else if(typeof this._originalStructData[i].propertyName==='string')
			propertyName=this._originalStructData[i].propertyName;
		else if(typeof this._originalStructData[i].hash==='string')
			propertyName=this._originalStructData[i].hash;
		else
			throw new Error('invalid JSON object property name while importing');

		if(typeof jsonObject[propertyName] === 'undefined'/* || (typeof jsonObject[propertyName]!==typeof this.variables[i].value && this.variables[i].type!=='Enum')*/)
			continue;

		if(this.variables[i]._structId){
			nChanges+=this.variables[i].import(jsonObject[propertyName]);
		}else{
			var newValue=this.variables[i].type==='Enum' && typeof this.variables[i].value==='string'? hash() : this.variables[i].value;
			var changed=(this.variables[i].value !== jsonObject[propertyName]);
			this.variables[i].value=jsonObject[propertyName];
			if(changed){
				nChanges++;
				this.variables[i].updateHtmlInputValue();
			}
		}
	}

	return nChanges;
}

function Variable(hashText, type, enumValues){
	if(typeof hashText==='string'){
		this.hash=hash(hashText);
		this.hashHex=Variable.toHexString(this.hash);
		this.hashText=hashText;
	}else if(typeof hashText==='number'){
		this.hash=(hashText & 0xffffffff) >>> 0;
		this.hashHex=Variable.toHexString(this.hash);
		this.hashText=this.hashHex;
	}
	this.setLabel(this.hashText);

	this.type=type;
	if(Variable.cachedOffsets[this.hash]){
		this.offset=Variable.cachedOffsets[this.hash];
	}else{
		var offset=Variable._getHashOffset(this.hash);
		if(this.isPointer())
			offset=Variable._read(offset, 'UInt');
		this.offset=Variable.cachedOffsets[this.hash]=offset;
	}

	this.enumValues=enumValues || [];
	if(this.isEnum()){
		this.enumValues.forEach(function(enumValue){
			if(typeof enumValue==='string')
				hash(enumValue);
		});
	}

	this.read();
}
Variable.prototype.export=function(){
	return this.value;
}
Variable.prototype.isPointer=function(){
	return /Array|Vector|String|UInt64/.test(this.type);
}
Variable.prototype.isVector=function(){
	return /Vector/.test(this.type);
}
Variable.prototype.isArray=function(){
	return /Array/.test(this.type);
}
Variable.prototype.isEnum=function(){
	return /Enum/.test(this.type);
}
Variable.prototype.getTypeSingle=function(){
	return this.type.replace('Array','');
}
Variable.prototype.setLabel=function(label){
	this.label=label;
}
Variable.prototype.read=function(){
	if(!this.isArray()){
		this.value=Variable._read(this.offset, this.type);
	}else{
		var typeSingle=this.getTypeSingle();
		var typeSize=Variable.getVariableSize(typeSingle);
		var offset=this.offset + 4;
		var maxLen=Variable._read(this.offset, 'UInt');
		this.value=new Array(maxLen);
		for(var i=0; i<maxLen && i<this.value.length; i++){
			this.value[i]=Variable._read(offset, typeSingle);
			offset+=typeSize;
		}
	}
}
Variable.prototype.secondsToTime=function(){
	var seconds=this.value%60;
	if(seconds<10) seconds='0'+seconds;
	var minutes=parseInt(this.value/60)%60;
	if(minutes<10) minutes='0'+minutes;
	return {
		hours: parseInt(this.value/3600),
		minutes: minutes,
		seconds: seconds
	};
}
Variable.prototype.save=function(){
	if(!this.isArray()){
		Variable._save(this.offset, this.type, this.value);
	}else{
		var typeSingle=this.getTypeSingle();
		var typeSize=Variable.getVariableSize(typeSingle);
		var offset=this.offset + 4;
		var maxLen=Variable._read(this.offset, 'UInt');
		for(var i=0; i<maxLen && i<this.value.length; i++){
			Variable._save(offset, typeSingle, this.value[i]);
			offset+=typeSize;
		}
	}
}


Variable._onChangeInputNumberFix=function(evt){
	var val=this.value.replace(/[^0-9\-\.]/g, '');
	if(this.floatValue)
		val=parseFloat(val);
	else
		val=parseInt(val);

	if(isNaN(val) || val<this.minValue)
		val=this.minValue;
	else if(val > this.maxValue)
		val=this.maxValue;

	if(val===-0)
		val=0; //avoid negative zero
	this.value=val;

	if(this.variable.isArray())
		if(this.vectorCoordinate)
			this.variable.value[this.arrayIndex][this.vectorCoordinate]=val;
		else
			this.variable.value[this.arrayIndex][this.vectorCoordinate]=val;
	else
		if(this.vectorCoordinate)
			this.variable.value[this.vectorCoordinate]=val;
		else
			this.variable.value=val;
}

Variable.prototype.buildHtmlInputs=function(autosave, row){
	var typeSingle=this.getTypeSingle();
	var inputElements;
	if(typeSingle==='Bool'){
		inputElements=Variable._buildHtmlInput(this, 'checkbox', this.value, autosave);
	}else if(typeSingle==='Int'){
		inputElements=Variable._buildHtmlInput(this, 'integer', this.value, autosave);
	}else if(typeSingle==='UInt'){
		inputElements=Variable._buildHtmlInput(this, 'unsigned_integer', this.value, autosave);
	}else if(typeSingle==='Float'){
		inputElements=Variable._buildHtmlInput(this, 'float', this.value, autosave);
	}else if(typeSingle==='Enum'){
		inputElements=Variable._buildHtmlInput(this, 'select', this.value, autosave, this.enumValues);
	}else if(typeSingle==='Vector2'){
		inputElements=Variable._buildHtmlInput(this, 'float2', this.value, autosave);
	}else if(typeSingle==='Vector3'){
		inputElements=Variable._buildHtmlInput(this, 'float3', this.value, autosave);
	}else if(typeSingle==='UInt64'){
		inputElements=$('<span></span>').html(this.value.toString()).get(0);
	}else if(typeSingle==='String64'){
		inputElements=Variable._buildHtmlInput(this, 'string', this.value, autosave, this.enumValues);
	}else if(typeSingle==='WString16'){
		inputElements=Variable._buildHtmlInput(this, 'string', this.value, autosave);
	}else{
		inputElements=$('<span></span>').html('Type: '+typeSingle).get(0);
	}
	
	this._htmlInputs=inputElements;
	if(row){
		if(!this.isArray())
			inputElements=[inputElements];

		var rows=new Array(inputElements.length);

		for(var i=0; i<inputElements.length; i++){
			var offset=this.offset;
			var fieldId='variable_'+this.hashHex;
			var labelText=this.label;
			if(this.isArray()){
				fieldId+='_'+i;
				offset+=4 + i*Variable.getVariableSize(typeSingle);
				labelText='<span class="mono">['+i+'] </span>'+labelText;
			}


			var label=$('<label></label>')
				.html(labelText)
				.prop('for', fieldId)
				.prop('title', 'Hash: '+this.hashHex+' - Offset: '+Variable.toHexString(offset))
				.get(0);

			if(this.isVector()){
				inputElements[i][0].id=fieldId;
				$(inputElements[i]).addClass('coordinate');
			}else{
				inputElements[i].id=fieldId;
			}

			rows[i]=$('<div></div>')
				.addClass('row mb-5 row-master-mini')
				.append(label)
				.append($('<div></div>').addClass('text-right').append(inputElements[i]))
				.get(0);
			rows[i].arrayIndex=i;
		}

		return this.isArray()? rows : rows[0];
	}else{
		return inputElements;
	}
}
Variable.prototype.updateHtmlInputValue=function(){
	if(!this._htmlInputs)
		return false;

	if(this.type==='Bool'){
		var newValue=!!this.value;
		if(this._htmlInputs.checked!==newValue){
			$(this._htmlInputs).prop('checked', newValue).addClass('changed');
			return true;
		}else{
			$(this._htmlInputs).removeClass('changed');
			return false;
		}
	}else if(this.type==='Vector2'){
		this._htmlInputs[0].value=this.value.x;
		this._htmlInputs[1].value=this.value.y;
	}else if(this.type==='Vector3'){
		var nChanges=0;
		var newValueX=this.value.x;
		var newValueY=this.value.y;
		var newValueZ=this.value.z;

		if(this._htmlInputs[0].value!=newValueX){
			$(this._htmlInputs[0]).val(newValueX).addClass('changed');
			nChanges++;
		}else{
			$(this._htmlInputs[0]).removeClass('changed');
		}
		if(this._htmlInputs[1].value!=newValueY){
			$(this._htmlInputs[1]).val(newValueY).addClass('changed');
			nChanges++;
		}else{
			$(this._htmlInputs[1]).removeClass('changed');
		}
		if(this._htmlInputs[2].value!=newValueZ){
			$(this._htmlInputs[2]).val(newValueZ).addClass('changed');
			nChanges++;
		}else{
			$(this._htmlInputs[2]).removeClass('changed');
		}

		return nChanges;
	}else{ //Int, UInt, Float, Enum, String64, WString16
		var newValue=this.value;
		if(this.type==='Enum' && typeof newValue==='string')
			newValue=hash(newValue);

		if(this._htmlInputs.value!=newValue){
			$(this._htmlInputs).val(newValue).addClass('changed');
			return true;
		}else{
			$(this._htmlInputs).removeClass('changed');
			return false;
		}
	}
}

Variable._read=function(offset, type){
	if(type==='Bool'){
		return tempFile.readU32(offset);
	}else if(type==='Int'){
		return tempFile.readS32(offset);
	}else if(type==='UInt'){
		return tempFile.readU32(offset);
	}else if(type==='Enum'){
		var value=tempFile.readU32(offset);
		return Variable.cachedHashesReverse[value] || value;
	}else if(type==='Float'){
		return tempFile.readF32(offset);
	}else if(type==='Vector2'){
		return {
			x: tempFile.readF32(offset),
			y: tempFile.readF32(offset+4)
		};
	}else if(type==='Vector3'){
		if(RAW_COORDINATES_TRANSFORM){
			return {
				x: tempFile.readF32(offset),
				y: -tempFile.readF32(offset+8),
				z: tempFile.readF32(offset+4)-105
			};
		}else{
			return {
				x: tempFile.readF32(offset),
				y: tempFile.readF32(offset+4),
				z: tempFile.readF32(offset+8)
			};
		}
	}else if(type==='UInt64'){
		var lower=Variable.toHexString(tempFile.readU32(offset)).replace('0x','');
		var upper=Variable.toHexString(tempFile.readU32(offset+4));
		return BigInt(upper+lower);
	}else if(type==='String64'){
		return tempFile.readString(offset, 0x40);
	}else if(type==='WString16'){
		var str='';
		for(var i=0; i<0x20; i+=2){
			var charCode=tempFile.readU16(offset+i);
			if(!charCode)
				break;
			str+=String.fromCharCode(charCode);
		}
		return str.replace(/\u0000+$/g,'');
	}else{
		throw new Error('Invalid variable type: '+type);
	}
}
Variable._save=function(offset, type, value){
	if(type==='Bool'){
		tempFile.writeU32(offset, !!value? 1: 0);
	}else if(type==='Int'){
		tempFile.writeS32(offset, value);
	}else if(type==='UInt'){
		tempFile.writeU32(offset, value);
	}else if(type==='Enum'){
		if(typeof value==='string')
			tempFile.writeU32(offset, hash(value));
		else
			tempFile.writeU32(offset, value);
	}else if(type==='Float'){
		tempFile.writeF32(offset, value);
	}else if(type==='Vector2'){
		tempFile.writeF32(offset, value.x);
		tempFile.writeF32(offset+4, value.y);
	}else if(type==='Vector3'){
		if(RAW_COORDINATES_TRANSFORM){
			tempFile.writeF32(offset, value.x);
			tempFile.writeF32(offset+4, value.z+105);
			tempFile.writeF32(offset+8, -value.y);
		}else{
			tempFile.writeF32(offset, value.x);
			tempFile.writeF32(offset+4, value.y);
			tempFile.writeF32(offset+8, value.z);
		}
	}else if(type==='UInt64' && typeof value==='bigint'){
		var hex=value.toString(16);
		while(hex.length<16)
			hex='0'+hex;
		tempFile.writeU32(offset, parseInt(hex.substr(8,8), 16));
		tempFile.writeU32(offset+4, parseInt(hex.substr(0,8), 16));
	}else if(type==='String64'){
		tempFile.writeString(offset, value, Math.min(value.length+1, 0x40));
	}else if(type==='WString16'){
		var bytes=new Array(0x20);
		for(var i=0; i<value.length; i++){
			var charCode=value.charCodeAt(i);
			bytes[i*2 + 0]=charCode & 0xff;
			bytes[i*2 + 1]=charCode >>> 8;
		}
		for(i=i*2; i<bytes.length; i++){
			bytes[i]=0;
		}
		tempFile.writeBytes(offset, bytes);
	}else{
		throw new Error('Invalid variable type: '+type);
	}
}

Variable._buildHtmlInput=function(variable, inputType, defaultValue, autosave, enumValues, arrayIndex){
	var input;
	if(variable.isArray() && typeof arrayIndex!=='number'){
		var inputs=new Array(variable.value.length);
		for(var i=0; i<variable.value.length; i++){
			inputs[i]=Variable._buildHtmlInput(variable, inputType, defaultValue[i], autosave, enumValues, i);
		}
		return inputs;
	}else if(inputType==='checkbox'){
		input=$('<input></input>')
			.prop('type','checkbox')
			.prop('checked', !!defaultValue)
			.on('change', function(){
				if(variable.isArray())
					this.variable.value[arrayIndex]=this.checked;
				else
					this.variable.value=this.checked;
			})
			.get(0);
	}else if(inputType==='integer' || inputType==='unsigned_integer'){
		input=$('<input></input>')
			.prop('type','text')
			.val(defaultValue)
			.addClass('text-right')
			.on('change', Variable._onChangeInputNumberFix)
			/*.on('change', function(evt){
				if(variable.isArray())
					this.variable.value[arrayIndex]=parseInt(this.value);
				else
					this.variable.value=parseInt(this.value);
			})*/
			.get(0);

		input.floatValue=false;
		if(inputType==='unsigned_integer'){
			input.minValue=0;
			input.maxValue=4294967295;
		}else{
			input.minValue=-2147483648;
			input.maxValue=2147483647;
		}
	}else if(inputType==='float'){
		input=$('<input></input>')
			.prop('type','text')
			.val(defaultValue)
			.addClass('text-right')
			.on('change', Variable._onChangeInputNumberFix)
			/*.on('change', function(evt){
				if(variable.isArray())
					if(typeof enumValues==='string')
						this.variable.value[arrayIndex][enumValues]=parseFloat(this.value);
					else
						this.variable.value[arrayIndex]=parseFloat(this.value);
				else
					if(typeof enumValues==='string')
						this.variable.value[enumValues]=parseFloat(this.value);
					else
						this.variable.value=parseFloat(this.value);

			})*/
			.get(0);

		input.floatValue=true;
		if(enumValues)
			input.vectorCoordinate=enumValues;
		input.minValue=-2147483648;
		input.maxValue=2147483647;
	}else if(inputType==='float2'){
		input=[
			Variable._buildHtmlInput(variable, 'float', defaultValue.x, autosave, 'x', arrayIndex),
			Variable._buildHtmlInput(variable, 'float', defaultValue.y, autosave, 'y', arrayIndex)
		];
	}else if(inputType==='float3'){
		input=[
			Variable._buildHtmlInput(variable, 'float', defaultValue.x, autosave, 'x', arrayIndex),
			Variable._buildHtmlInput(variable, 'float', defaultValue.y, autosave, 'y', arrayIndex),
			Variable._buildHtmlInput(variable, 'float', defaultValue.z, autosave, 'z', arrayIndex)
		];
	}else if(inputType==='select'){
		input=$('<select></select>')
			.val(this.value)
			.on('change', function(){
				if(variable.isArray())
					this.variable.value[arrayIndex]=this.value;
				else
					this.variable.value=this.value;
			})
			.get(0);

		var found=false;
		if(enumValues){
			for(var i=0; i<enumValues.length; i++){
				if(enumValues[i]===defaultValue)
					found=true;
				input.appendChild(
					$('<option></option>').val(hash(enumValues[i])).html(enumValues[i]).get(0)
				);
			}
		}
		if(!found){
			input.appendChild(
				$('<option></option>').val(defaultValue).html('['+Variable.toHexString(defaultValue)+']').get(0)
			);
		}
		input.value=typeof defaultValue==='string'? hash(defaultValue) : defaultValue;
	}else if(inputType==='text'){
		//to-do
	}else{
		throw new Error('Invalid HTML input type');
	}

	input.variable=variable;
	input.arrayIndex=arrayIndex;
	if(autosave){
		$(input).on('change', function(){
			this.variable.save();
		});
	}

	return input;
}
Variable.getVariableSize=function(type){
	if(type==='Bool' || type==='Int' || type==='UInt' || type==='Enum' || type==='Float'){
		return 4;
	}else if(type==='Vector2' || type==='UInt64'){
		return 8;
	}else if(type==='Vector3'){
		return 12;
	}else if(type==='String64'){
		return 0x40;
	}else if(type==='WString16'){
		return 0x20;
	}else{
		throw new Error('Invalid array type: '+type);
	}
};
Variable.getArraySize=function(hash){
	var offset=tempFile.readU32(Variable._getHashOffset(hash));
	return tempFile.readU32(offset)
};
Variable._getHashOffset=function(hashInt){
	if(typeof hashInt==='string')
		hashInt=hash(hashInt);
	else if(typeof hashInt!=='number')
		throw new Error('Invalid integer hash passed to Variable._getHashOffset');

	if(Variable.cachedOffsets[hashInt])
		return Variable.cachedOffsets[hashInt];

	for(var i=0x000028; i<0x03c800; i+=8){
		var currentHash=tempFile.readU32(i);
		if(currentHash===hashInt){
			return i+4;
		}else if(hashInt===0xa3db7114){ //found MetaData.SaveTypeHash
			break;
		}
	}
	throw new Error('Hash '+Variable.toHexString(hashInt)+' not found');
};
Variable.toHexString=function(u32){
	var str=u32.toString(16);
	while(str.length<8)
		str='0'+str;
	return '0x'+str;
};
Variable.enumToInt=function(param, defaultValue){
	if(typeof param==='string')
		return hash(param);
	else if(typeof param==='number')
		return param;
	return Variable.enumToInt(defaultValue || 'None');
};
Variable.enumToString=function(param){
	if(typeof param==='number'){
		try{
			return hashReverse(param);
		}catch(err){
		}
	}
	return param;
};


Variable.cachedOffsets={};
Variable.resetCache=function(){
	Variable.cachedOffsets={};
};



Variable.cachedHashes={};
Variable.cachedHashesReverse={};
function hash(hashText){
	if(!Variable.cachedHashes[hashText]){
		var hashedEnumValue=murmurHash3.x86.hash32(hashText);
		Variable.cachedHashes[hashText]=hashedEnumValue;
		Variable.cachedHashesReverse[hashedEnumValue]=hashText;
	}
	return Variable.cachedHashes[hashText];
}
function hashReverse(hash){
	if(Variable.cachedHashesReverse[hash])
		return Variable.cachedHashesReverse[hash];
	throw new Error('Hash '+Variable.toHexString(hash)+' has no precalculated reverse hash');
}