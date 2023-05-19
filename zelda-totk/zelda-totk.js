/*
	The legend of Zelda: Tears of the Kingdom savegame editor v20230519
	by Marc Robledo 2017-2020
*/
var currentEditingItem;

SavegameEditor={
	Name:'The legend of Zelda: Tears of the Kingdom',
	Filename:['progress.sav','caption.sav'],
	Version:20230519,
	noDemo:true,

	/* Constants */
	Constants:{
		STRING_SIZE:0x20,
		STRING64_SIZE:0x40,

		VERSION:				['v1.0', 'v1.1'],
		FILESIZE:				[2307552, 2307656],
		HEADER:					[0x0046c3c8, 0x0047e0f4],

		//ICON_TYPES:{SWORD: 27, BOW:28, SHIELD:29, POT:30, STAR:31, CHEST:32,SKULL:33,LEAF:34,TOWER:35},
		
		BLANK_ICON_PATH:'./assets/_blank.png'
	},
	currentItemOffset:null,

	/* Hashes */
	Hashes:[
		0xfbe01da1, 'TempMaxHearts',
		0xa77921d7, 'TempRupees',
		//0x31ab5580, 'TempHearts',
		0xf9212c74, 'TempStamina',
		0xe573f564, 'TempPlaytime',
		0xa3db7114, 'TempItemData' //???
	],

	OffsetsItems:{
		'pouchSword':0x04aa64,
		'pouchBow':0x047630,
		'pouchShield':0x04d080
	},

	/* read/write data */
	readArraySize:function(arrayOffset){
		return tempFile.readU32(this.currentItemOffset + arrayOffset);
	},
	readU32Array:function(arrayOffset, index){
		return tempFile.readU32(this.currentItemOffset + 0x04 + arrayOffset + index*4);
	},
	readString64Array:function(arrayOffset, index){
		return tempFile.readString(this.currentItemOffset + 0x04 + arrayOffset + index*this.Constants.STRING64_SIZE, this.Constants.STRING64_SIZE);
	},
	readUTF8String64Array:function(arrayOffset, index){
		var str='';
		var offset=this.currentItemOffset + 0x04 + arrayOffset + index*this.Constants.STRING_SIZE;
		for(var i=0; i<this.Constants.STRING_SIZE/2; i++){
			var charCode=tempFile.readU16(offset);
			if(!charCode)
				break;
			str+=String.fromCharCode(charCode);
			offset+=2;
		}
		return str;
	},
	writeU32Array:function(arrayOffset, index, value){
		tempFile.writeU32(this.currentItemOffset + 0x04 + arrayOffset + index*4, value);
	},
	writeString64Array:function(arrayOffset, index, value){
		tempFile.writeString(this.currentItemOffset + 0x04 + arrayOffset + index*this.Constants.STRING64_SIZE, value, this.Constants.STRING64_SIZE);
	},

	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeU32(offset+8*arrayIndex,val?1:0);else tempFile.writeU32(offset,val?1:0)},
	_writeValue:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeU32(offset+8*arrayIndex,val);else tempFile.writeU32(offset,val)},
	/*_writeFloat32:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeF32(offset+8*arrayIndex,val);else tempFile.writeF32(offset,val)},*/



	/* private functions */
	_searchHash:function(hash){
		for(var i=0x0c; i<tempFile.fileSize; i+=8)
			if(hash===tempFile.readU32(i))
				return i;
		return false;
	},
	_readFromHash:function(hash){
		var offset=this._searchHash(hash);
		if(typeof offset === 'number')
			return tempFile.readU32(offset+4);
		return false;
	},
	_writeValueAtHash:function(hash,val){
		var offset=this._searchHash(hash);
		if(typeof offset==='number')
			this._writeValue(offset+4,val);
	},

	_getOffsets:function(){
		this.Offsets={};
		this.Headers={};
		var startSearchOffset=0x28;
		for(var i=0; i<this.Hashes.length; i+=2){
			for(var j=startSearchOffset; j<tempFile.fileSize; j+=8){
				if(this.Hashes[i]===tempFile.readU32(j)){
					this.Offsets[this.Hashes[i+1]]=j+4;
					this.Headers[this.Hashes[i+1]]=this.Hashes[i];
					startSearchOffset=j+8;
					break;
				}
			}
			if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.log(this.Hashes[i+1]+' not found');
			}
		}
	},

	_createItemRow:function(item){
		var img=new Image();
		img.id='icon-'+item.category+'-'+item.index;
		img.loading='lazy';
		img.onerror=function(){
			this.removeEventListener('error', this.onerror);
			//console.error('icon '+this.src+' not found');
			img.src=SavegameEditor.Constants.BLANK_ICON_PATH;
		}
		if(item.category==='armors')
			img.src='./assets/icons/'+item.category+'/'+Armor.ICONS[item.id]+'.png';
		else
			img.src='./assets/icons/'+item.category+'/'+item.id+'.png';

		var itemNumber=document.createElement('span');
		itemNumber.className='item-number';
		itemNumber.innerHTML='#'+item.index;

		var spanItemId=document.createElement('span');
		spanItemId.className='item-name clickable';
		spanItemId.id='item-name-'+item.category+'-'+item.index;
		spanItemId.innerHTML=item.getItemTranslation();
		spanItemId.addEventListener('click', function(){
			SavegameEditor.editItem(item);
		}, false);
		if(typeof item.fuseId==='string' && item.fuseId){
			spanItemId.innerHTML+=' <small style="color:#3d5b50">(fused: '+item.fuseId+')</small>';
		}


		var lastColumn=document.createElement('div');
		if(item.category==='weapons' || item.category==='bows' || item.category==='shields'){
			lastColumn.appendChild(item._htmlInputDurability);
			lastColumn.appendChild(item._htmlSelectModifier);
			lastColumn.appendChild(item._htmlInputModifierValue);
		}else if(item.quantity!==0xffffffff && (item.category==='arrows' || item.category==='materials' || item.category==='food' || item.category==='devices' || item.category==='key')){
			lastColumn.appendChild(item._htmlInputQuantity);
		}

		var r=row([1,6,3,2],
			img,
			spanItemId,
			document.createElement('div'), /* modifier column */
			lastColumn
		);
		r.className+=' row-items';
		r.id='row-item-'+item.category+'-'+item.index;
		r.children[1].appendChild(itemNumber);
		
		return r;
	},

	addItem:function(catId){
		var lastItem=this.getLastItem(catId);
		var newItem, maxItems;
		if(catId==='weapons' || catId==='bows' || catId==='shields'){
			newItem=new Equipment(catId, lastItem? lastItem.index+1 : 0);
			if(lastItem){
				newItem.durability=lastItem.durability;
				newItem.modifier=lastItem.modifier;
				newItem.modifierValue=lastItem.modifierValue;
				newItem.fuseId=lastItem.fuseId;
			}
			maxItems=Equipment.readMaxCapacity(catId);
		}else if(catId==='armors'){
			newItem=new Armor(lastItem? lastItem.index+1 : 0);
			if(lastItem){
				newItem.dyeColor=lastItem.dyeColor;
			}
			maxItems=Armor.readMaxCapacity();
		}else if(catId==='arrows' || catId==='materials' || catId==='food' || catId==='devices' || catId==='key'){
			newItem=new Item(catId, lastItem? lastItem.index+1 : 0);
			if(lastItem){
				newItem.quantity=lastItem.quantity;
			}
			maxItems=Items.readMaxCapacity(catId);
		}

		if(lastItem.index===(maxItems -1))
			return false;

	
		var itemList=this.getTranslationHash(newItem);
		var itemListArray=[];
		for(var id in itemList){
			itemListArray.push(id);
		}


		var nextIndexId=itemListArray.indexOf(lastItem.id)+1;
		if(nextIndexId===itemListArray.length)
			nextIndexId=0;
		newItem.id=itemListArray[nextIndexId];

		this.currentItems[catId].push(newItem);
		var row=this._createItemRow(newItem);
		document.getElementById('container-'+newItem.category).appendChild(row);
		row.scrollIntoView({behavior:'smooth',block:'center'});
	},


	getLastItem:function(catId){
		var lastIndex=-1;
		for(var i=0; i<SavegameEditor.currentItems[catId].length; i++){
			if(SavegameEditor.currentItems[catId][i].index > lastIndex)
				lastIndex=SavegameEditor.currentItems[catId][i].index;
		}
		if((lastIndex+1)===SavegameEditor.currentItems[catId].length)
			return SavegameEditor.currentItems[catId][lastIndex];
		console.error('invalid '+catId+' index');
		return null;
	},

	getTranslationHash:function(item){
		if(typeof item.durability==='number') //weapons, bows or shields
			return Equipment.TRANSLATIONS[item.category];
		else if(item.category==='armors')
			return Armor.TRANSLATIONS;
		else if(typeof item.quantity==='number') //arrows, materials, food, devices or key
			return Items.TRANSLATIONS[item.category];
		return null;
	},

	editItem:function(item){
		currentEditingItem=item;

		/* prepare edit item selector */		
		if(this.selectItem.lastCategory !== item.category){
			this.selectItem.innerHTML='';
			var foundItemId=false;
			var itemList=this.getTranslationHash(item);
			for(var itemId in itemList){
				var opt=document.createElement('option');
				opt.value=itemId;
				opt.innerHTML=itemList[itemId];
				
				if(itemId===item.id)
					foundItemId=true;

				this.selectItem.appendChild(opt);
			}
			if(!foundItemId){
				var opt=document.createElement('option');
				opt.value=item.id;
				opt.innerHTML=item.id;
				this.selectItem.appendChild(opt);
			}

			this.selectItem.lastCategory=item.category;
		}
		this.selectItem.value=item.id;

		document.getElementById('item-name-'+item.category+'-'+item.index).innerHTML='';
		document.getElementById('item-name-'+item.category+'-'+item.index).parentElement.appendChild(this.selectItem);
		this.selectItem.focus();
		this.selectItem.click();
	},
	editItem2:function(item, newId){
		item.id=newId;

		var oldRow=document.getElementById('row-item-'+item.category+'-'+item.index);
		var newRow=this._createItemRow(item);
		oldRow.parentElement.replaceChild(newRow, oldRow)

		//TOTK_Icons.setIcon(document.getElementById('icon'+i), newId);
		//if(document.getElementById('number-item'+i))
		//	document.getElementById('number-item'+i).maxValue=this._getItemMaximumQuantity(newId);
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		tempFile.littleEndian=true;
		//if(tempFile.fileName==='caption.sav'){
		if(/caption/.test(tempFile.fileName)){
			var startOffset=0x0474;
			if(tempFile.readU32(startOffset)===0xe0ffd8ff){
				var endOffset=startOffset+4;
				var found=false;
				while(endOffset<(tempFile.fileSize-2) && !found){
					if(tempFile.readU8(endOffset)===0xff && tempFile.readU8(endOffset + 1)===0xd9){
						found=true;
					}else{
						endOffset++;
					}
				}
				
				if(found){
					var arrayBuffer=tempFile._u8array.buffer.slice(startOffset, endOffset+2);
					var blob=new Blob([arrayBuffer], {type:'image/jpeg'});
					var imageUrl=(window.URL || window.webkitURL).createObjectURL(blob);
					var img=new Image();
					img.src=imageUrl;
					document.getElementById('dialog-caption').innerHTML='';
					document.getElementById('dialog-caption').appendChild(img);
					window.setTimeout(function(){
						MarcDialogs.open('caption')
					}, 100);
				}
			}
		}else{
			for(var i=0; i<this.Constants.FILESIZE.length; i++){
				var dummyHeader=tempFile.readU32(0);
				var versionHash=tempFile.readU32(4);

				if(tempFile.fileSize===this.Constants.FILESIZE[i] && dummyHeader===0x01020304 && versionHash===this.Constants.HEADER[i]){
					this._getOffsets();
					this.currentItemOffset=(SavegameEditor.Offsets.TempItemData - 0x04) - 0x3c048;
					setValue('version', this.Constants.VERSION[i]);
					return true;
				}
			}
		}

		return false
	},


	preload:function(){
		this.selectItem=document.createElement('select');
		this.selectItem.addEventListener('blur', function(){
			//console.log('blur');
			SavegameEditor.editItem2(currentEditingItem, this.value);
			//document.getElementById('item-name-'+currentEditingItem.category+'-'+currentEditingItem.index).innerHTML=SavegameEditor._getItemTranslation(currentEditingItem.id);
			//this.parentElement.removeChild(this);
			currentEditingItem=null;
		}, false);

		setNumericRange('rupees', 0, 999999);

		setNumericRange('pouch-size-swords', 9, 18);
		setNumericRange('pouch-size-bows', 5, 13);
		setNumericRange('pouch-size-shields', 4, 20);
		getField('pouch-size-swords').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=9)
				SavegameEditor.currentItems.pouchSword=newVal;
		});
		getField('pouch-size-bows').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=5)
				SavegameEditor.currentItems.pouchBow=newVal;
		});
		getField('pouch-size-shields').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=4)
				SavegameEditor.currentItems.pouchShield=newVal;
		});
		
		var horseTypes=[];
		Horses.HORSE_TYPES.forEach(function(id){
			horseTypes.push({name:id, value:id});
		});
		for(var i=0; i<6; i++){
			select('horse'+i+'-type', horseTypes, function(){
				SavegameEditor.currentItems.horses[this.horseIndex].id=this.value;
			});
			get('select-horse'+i+'-type').horseIndex=i;

			get('input-horse'+i+'-name').addEventListener('change', function(){
				SavegameEditor.currentHorses[this.horseIndex].name=this.value.trim();
			});
			get('input-horse'+i+'-name').horseIndex=i;
			get('input-horse'+i+'-name').disabled=true;
		}


		/*setNumericRange('mons', 0, 999999);
		setNumericRange('relic-gerudo', 0, 99);
		setNumericRange('relic-goron', 0, 99);
		setNumericRange('relic-rito', 0, 99);*/

		/* map position selectors */
		/*select(
			'pos-maptype',
			[
				'?',
				{value:'MainField',name:'MainField'},
				{value:'MainFieldDungeon',name:'MainFieldDungeon'}
			],
			function(){
				if(this.value==='MainField'){
					setValue('pos-map','A-1');
				}else if(this.value==='MainFieldDungeon'){
					setValue('pos-map','RemainsElectric');
					fixDungeonCoordinates();
				}
			}
		);*/

		/*var maps=['?'];
		for(var i=0; i<10; i++){
			for(var j=0; j<8; j++){
				var map=(String.fromCharCode(65+i))+'-'+(j+1);
				maps.push({value:map,name:map});
			}
		}
		for(var i=0; i<120; i++){
			var map='Dungeon'
			if(i<100)
				map+='0';
			if(i<10)
				map+='0';
			map+=i;
			maps.push({value:map,name:map});
		}
		maps.push({value:'RemainsElectric',name:'RemainsElectric'});
		maps.push({value:'RemainsFire',name:'RemainsFire'});
		maps.push({value:'RemainsWater',name:'RemainsWater'});
		maps.push({value:'RemainsWind',name:'RemainsWind'});
		select('pos-map', maps, function(){
			if(/^.-\d$/.test(this.value)){
				setValue('pos-maptype','MainField');
			}else if(/^Remains/.test(this.value)){
				setValue('pos-maptype','MainFieldDungeon');
				fixDungeonCoordinates();
			}else if(/^Dungeon/.test(this.value)){
				setValue('pos-maptype','MainFieldDungeon');
			}
		});*/

		
		
		MarcTooltips.add('.tab-button',{className:'dark',fixed:true});
	},

	_timeToString:function(timeVal){
		var seconds=timeVal%60;
		if(seconds<10)seconds='0'+seconds;
		var minutes=parseInt(timeVal/60)%60;
		if(minutes<10)minutes='0'+minutes;
		return parseInt(timeVal/3600)+':'+minutes+':'+seconds;
	},

	/* load function */
	load:function(){
		tempFile.fileName='progress.sav';

		/* empty item containers */
		var ITEM_CATS=['weapons','bows','shields','armors','arrows','materials','food','devices','key'];
		ITEM_CATS.forEach(function(catId, i){
			empty('container-'+catId);
		});

		/* read items */
		this.currentItems={
			'weapons':Equipment.readAll('weapons'),
			'bows':Equipment.readAll('bows'),
			'shields':Equipment.readAll('shields'),
			'armors':Armor.readAll(),
			'arrows':Items.readAll('arrows'),
			'materials':Items.readAll('materials'),
			'food':Items.readAll('food'),
			'devices':Items.readAll('devices'),
			'key':Items.readAll('key'),
			
			'horses':Horses.readAll(),
			
			'pouchSword':SavegameEditor.readU32Array(SavegameEditor.OffsetsItems.pouchSword, 0),
			'pouchBow':SavegameEditor.readU32Array(SavegameEditor.OffsetsItems.pouchBow, 0),
			'pouchShield':SavegameEditor.readU32Array(SavegameEditor.OffsetsItems.pouchShield, 0)
		};

		/* prepare editor */
		setValue('rupees', tempFile.readU32(this.Offsets.TempRupees));
		/*setValue('mons', tempFile.readU32(this.Offsets.MONS));*/
		setValue('max-hearts', tempFile.readU32(this.Offsets.TempMaxHearts));
		setValue('max-stamina', tempFile.readU32(this.Offsets.TempStamina));

		setValue('number-pouch-size-swords', this.currentItems.pouchSword);
		setValue('number-pouch-size-bows', this.currentItems.pouchBow);
		setValue('number-pouch-size-shields', this.currentItems.pouchShield);

		setValue('playtime', this._timeToString(tempFile.readU32(this.Offsets.TempPlaytime)));

		/*setValue('relic-gerudo', tempFile.readU32(this.Offsets.RELIC_GERUDO));
		setValue('relic-goron', tempFile.readU32(this.Offsets.RELIC_GORON));
		setValue('relic-rito', tempFile.readU32(this.Offsets.RELIC_RITO));

		setValue('koroks', tempFile.readU32(this.Offsets.KOROK_SEED_COUNTER));
		setValue('defeated-hinox', tempFile.readU32(this.Offsets.DEFEATED_HINOX_COUNTER));
		setValue('defeated-talus', tempFile.readU32(this.Offsets.DEFEATED_TALUS_COUNTER));
		setValue('defeated-molduga', tempFile.readU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER));*/


		/* coordinates */
		/*setValue('pos-x', tempFile.readF32(this.Offsets.PLAYER_POSITION));
		setValue('pos-y', tempFile.readF32(this.Offsets.PLAYER_POSITION+8));
		setValue('pos-z', tempFile.readF32(this.Offsets.PLAYER_POSITION+16));*/

		/*var map=this._readString(this.Offsets.MAP);
		var mapType=this._readString(this.Offsets.MAPTYPE);
		getField('pos-map').children[0].value=map;
		getField('pos-map').children[0].innerHTML='* '+map+' *';
		getField('pos-maptype').children[0].value=mapType;
		getField('pos-maptype').children[0].innerHTML='* '+mapType+' *';
		setValue('pos-map',map)
		setValue('pos-maptype',mapType)

		setValue('pos-x-horse', tempFile.readF32(this.Offsets.HORSE_POSITION));
		setValue('pos-y-horse', tempFile.readF32(this.Offsets.HORSE_POSITION+8));
		setValue('pos-z-horse', tempFile.readF32(this.Offsets.HORSE_POSITION+16));*/


		/* map pins */
		/*loadMapPins();*/

		/* build item containers */
		ITEM_CATS.forEach(function(catId, i){
			SavegameEditor.currentItems[catId].forEach(function(item, j){
				document.getElementById('container-'+item.category).appendChild(
					SavegameEditor._createItemRow(item)
				);
			});
			MarcTooltips.add('#container-'+catId+' select',{position:'bottom',align:'right'});
			MarcTooltips.add('#container-'+catId+' input',{position:'bottom',align:'right'});
		});


		/* horses */
		for(var i=0; i<6; i++){
			hide('row-horse'+i);

			var horse=this.currentItems.horses[i];
			if(horse && horse.id && horse.name){
				get('row-horse'+horse.index).style.display='flex';
				get('select-horse'+horse.index+'-type').value=horse.id;
				get('input-horse'+horse.index+'-name').value=horse.name;
			}
		}
		/*for(var i=0; i<6; i++){
			if(i<5){
				setValue('horse'+i+'-name',this._readString64(this.Offsets.HORSE_NAMES, i));
				setValue('horse'+i+'-saddles',this._readString64(this.Offsets.HORSE_SADDLES, i));
				setValue('horse'+i+'-reins',this._readString64(this.Offsets.HORSE_REINS, i));
			}
			var horseType=this._readString64(this.Offsets.HORSE_TYPES, i);
			if(horseType){
				setValue('horse'+i+'-type',horseType);
				get('row-horse'+i).style.visibility='visible';
			}else{
				get('row-horse'+i).style.visibility='hidden';
			}
		}*/






		showTab('home');
	},

	/* save function */
	save:function(){
		/* STATS */
		tempFile.writeU32(this.Offsets.TempRupees, getValue('rupees'));
		/*tempFile.writeU32(this.Offsets.MONS, getValue('mons'));*/
		tempFile.writeU32(this.Offsets.TempMaxHearts, getValue('max-hearts'));
		tempFile.writeU32(this.Offsets.TempStamina, getValue('max-stamina'));

		SavegameEditor.writeU32Array(this.OffsetsItems.pouchSword, 0, this.currentItems.pouchSword);
		SavegameEditor.writeU32Array(this.OffsetsItems.pouchBow, 0, this.currentItems.pouchBow);
		SavegameEditor.writeU32Array(this.OffsetsItems.pouchShield, 0, this.currentItems.pouchShield);
	
		/*tempFile.writeU32(this.Offsets.RELIC_GERUDO, getValue('relic-gerudo'));
		tempFile.writeU32(this.Offsets.RELIC_GORON, getValue('relic-goron'));
		tempFile.writeU32(this.Offsets.RELIC_RITO, getValue('relic-rito'));
		
		tempFile.writeU32(this.Offsets.KOROK_SEED_COUNTER, getValue('koroks'));
		tempFile.writeU32(this.Offsets.DEFEATED_HINOX_COUNTER, getValue('defeated-hinox'));
		tempFile.writeU32(this.Offsets.DEFEATED_TALUS_COUNTER, getValue('defeated-talus'));
		tempFile.writeU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER, getValue('defeated-molduga'));*/


		/* COORDINATES */
		/*tempFile.writeF32(this.Offsets.PLAYER_POSITION, getValue('pos-x'));
		tempFile.writeF32(this.Offsets.PLAYER_POSITION+8, getValue('pos-y'));
		tempFile.writeF32(this.Offsets.PLAYER_POSITION+16, getValue('pos-z'));
		
		this._writeString(this.Offsets.MAP, getValue('pos-map'))
		this._writeString(this.Offsets.MAPTYPE, getValue('pos-maptype'))

		tempFile.writeF32(this.Offsets.HORSE_POSITION, getValue('pos-x-horse'));
		tempFile.writeF32(this.Offsets.HORSE_POSITION+8, getValue('pos-y-horse'));
		tempFile.writeF32(this.Offsets.HORSE_POSITION+16, getValue('pos-z-horse'));*/


		/* ITEMS */
		['weapons','bows','shields','armors','arrows','materials','food','devices','key'].forEach(function(catId, i){
			SavegameEditor.currentItems[catId].forEach(function(item, j){
				item.save();
			});
		});


		/* HORSES */
		SavegameEditor.currentItems.horses.forEach(function(horse, j){
			horse.save();
		});
	}
}





/* TABS */
var availableTabs=['home','weapons','bows','shields','armors','materials','food','devices','key','horses','master'];


var currentTab;
function showTab(newTab){
	currentTab=newTab;
	for(var i=0; i<availableTabs.length; i++){
		document.getElementById('tab-button-'+availableTabs[i]).className=currentTab===availableTabs[i]?'tab-button active':'tab-button';
		document.getElementById('tab-'+availableTabs[i]).style.display=currentTab===availableTabs[i]?'block':'none';
	}

	if(newTab==='master'){
		if(TOTKMasterEditor.isLoaded())
			TOTKMasterEditor.refreshResults();
		else
			TOTKMasterEditor.loadHashes();
	}
}



/* MarcTooltips.js v20200216 - Marc Robledo 2014-2020 - http://www.marcrobledo.com/license */
var MarcTooltips=function(){var n=/MSIE 8/.test(navigator.userAgent);function d(t,e,o){n?t.attachEvent("on"+e,o):t.addEventListener(e,o,!1)}function u(t){void 0!==t.stopPropagation?t.stopPropagation():t.cancelBubble=!0}function g(t){if(/^#[0-9a-zA-Z_\-]+$/.test(t))return[document.getElementById(t.replace("#",""))];var e=document.querySelectorAll(t);if(n){for(var o=[],i=0;i<e.length;i++)o.push(e[i]);return o}return Array.prototype.slice.call(e)}var h=function(t,e,o){t.className=t.className.replace(/position-\w+/,"position-"+e.position).replace(/align-\w+/,"align-"+e.align);var i=(window.pageXOffset||document.documentElement.scrollLeft)-(document.documentElement.clientLeft||0),n=(window.pageYOffset||document.documentElement.scrollTop)-(document.documentElement.clientTop||0);e.fixed&&(n=i=0);var l=t.attachedTo.getBoundingClientRect().left,a=t.attachedTo.getBoundingClientRect().top,s=t.attachedTo.offsetWidth,p=t.attachedTo.offsetHeight;if("up"===e.position?t.style.top=parseInt(a+n-t.offsetHeight)+"px":"down"===e.position?t.style.top=parseInt(a+n+p)+"px":"top"===e.align?t.style.top=parseInt(a+n)+"px":"bottom"===e.align?t.style.top=parseInt(a+n-(t.offsetHeight-p))+"px":t.style.top=parseInt(a+n-parseInt((t.offsetHeight-p)/2))+"px","up"===e.position||"down"===e.position?"left"===e.align?t.style.left=parseInt(l+i)+"px":"right"===e.align?t.style.left=parseInt(l+i-(t.offsetWidth-s))+"px":t.style.left=parseInt(l+i-parseInt((t.offsetWidth-s)/2))+"px":"left"===e.position?t.style.left=parseInt(l+i-t.offsetWidth)+"px":"right"===e.position&&(t.style.left=parseInt(l+i+s)+"px"),o){var r={position:e.position,align:e.align,fixed:e.fixed},c=parseInt(t.style.left.replace("px","")),f=parseInt(t.style.top.replace("px","")),d=c+t.offsetWidth,u=f+t.offsetHeight,g=(i=window.scrollX,n=window.scrollY,Math.max(document.documentElement.clientWidth,window.innerWidth||0)),m=Math.max(document.documentElement.clientHeight,window.innerHeight||0);"up"===e.position||"down"===e.position?(g<d?r.align="right":c<i&&(r.align="left"),f<n?r.position="down":n+m<u&&(r.position="up")):(m<u?r.align="bottom":f<n&&(r.align="top"),c<i?r.position="right":i+g<d&&(r.position="left")),h(t,r,!1)}},m={};d(window,"load",function(){d(n?document:window,"click",function(){for(key in m)/ visible$/.test(m[key].className)&&/:true:/.test(key)&&(m[key].className=m[key].className.replace(" visible",""))}),d(window,"resize",function(){for(key in m)/ visible$/.test(m[key].className)&&m[key].attachedTo&&h(m[key],m[key].tooltipInfo,!0)})});function y(t){var e=t.currentTarget||t.srcElement;e.title&&(e.setAttribute("data-tooltip",e.title),e.title=""),(e.tooltip.attachedTo=e).tooltip.innerHTML=e.getAttribute("data-tooltip"),e.tooltip.className+=" visible",h(e.tooltip,e.tooltip.tooltipInfo,!0)}function w(t){var e=t.currentTarget||t.srcElement;e.tooltip.className=e.tooltip.className.replace(" visible","")}return{add:function(t,e){var o="down",i="center",n=!1,l=!1,a=!1,s=!1,p=!1;e&&(e.position&&/^(up|down|left|right)$/i.test(e.position)&&(o=e.position.toLowerCase()),e.align&&/^(top|bottom|left|right)$/i.test(e.align)&&(("up"!==o&&"down"!==o||"left"!==e.align&&"right"!==e.align)&&("left"!==o&&"right"!==o||"top"!==e.align&&"bottom"!==e.align)||(i=e.align.toLowerCase())),l=e.clickable||e.onClick||e.onclick||!1,a=e.focusable||e.onFocus||e.onfocus||!1,s=e.fixed||e.positionFixed||!1,n=e.class||e.className||e.customClass||e.customClassName||!1,p=e.text||e.customText||!1);for(var r=function(t){if("string"==typeof t)return g(t);if(t.length){for(var e=[],o=0;o<t.length;o++)"string"==typeof t[o]?e=e.concat(g(t[o])):e.push(t[o]);return e}return[t]}(t),c=function(t,e,o,i,n){var l=t+":"+e+":"+o+":"+i;if(m[l])return m[l];var a=document.createElement("div");return a.className="tooltip position-"+t+" align-"+e,a.className+="left"===t||"right"===t?" position-horizontal":" position-vertical",i&&(a.className+=" "+i),a.style.position=n?"fixed":"absolute",a.style.zIndex="9000",a.style.top="0",a.style.left="0",a.attachedTo=null,a.tooltipInfo={position:t,align:e,fixed:n},o&&d(a,"click",u),m[l]=a,document.body.appendChild(a),a}(o,i,l||a,n,s),f=0;f<r.length;f++)p?r[f].setAttribute("data-tooltip",p):r[f].title&&r[f].setAttribute("data-tooltip",r[f].title),r[f].title="",r[f].tooltip=c,a?(d(r[f],"focus",y),d(r[f],"blur",w),d(r[f],"click",u)):l?(d(r[f],"click",y),d(r[f],"click",u)):(d(r[f],"mouseover",y),d(r[f],"mouseout",w))}}}();

function onScroll(){
	var h=document.getElementById('header-top').getBoundingClientRect().height;
	if(window.scrollY>h){
		document.getElementById('header').style.position='fixed';
		document.getElementById('header').style.top='-'+h+'px';
	}else{
		document.getElementById('header').style.position='absolute';
		document.getElementById('header').style.top='0px';
	}
}
window.addEventListener('scroll', onScroll, false);











var masterModeLoaded=false;
function loadMasterMode(){
	if(!masterModeLoaded){
		var script=document.createElement('script');
		script.type='text/javascript';
		script.src='./zelda-totk.master.js';
		script.onload=function(){
			masterModeLoaded=true;
			document.getElementById('tab-button-master').disabled=false;
			//TOTKMasterEditor.prepare();
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}
