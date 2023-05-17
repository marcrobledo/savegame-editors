/*
	The legend of Zelda: Tears of the Kingdom savegame editor v20230516
	by Marc Robledo 2017-2020
*/
var currentEditingItem;

SavegameEditor={
	Name:'The legend of Zelda: Tears of the Kingdom',
	Filename:['progress.sav','caption.sav'],
	Version:20230511,
	noDemo:true,

	/* Constants */
	Constants:{
		MAX_ITEMS:420,
		STRING_SIZE:0x20,
		STRING64_SIZE:0x80,

		VERSION:				['v1.0', 'v1.1'],
		FILESIZE:				[2307552, 2307656],
		HEADER:					[0x0046c3c8, 0x0047e0f4],

		ICON_TYPES:{SWORD: 27, BOW:28, SHIELD:29, POT:30, STAR:31, CHEST:32,SKULL:33,LEAF:34,TOWER:35},
		
		BLANK_ICON_PATH:'./assets/_blank.png'
	},
	currentGameVersionIndex:null,
	_getCurrentGameVersionOffset:function(){
		return this.currentGameVersionIndex===1? 0x38 : 0x00;
	},

	/* Hashes */
	Hashes:[
		0xa77921d7, 'TempRupees',
		//0xfbe01da1, 'TempHearts',
		0x31ab5580, 'TempMaxHearts',
		0xf9212c74, 'TempStamina',
		0xa3db7114, 'TempItemData' //???
	],

	/* temporarily hardcoded offset */
	/* to-do: find the correct hash key */
	/* v1.1 adds +0x38 to all offsets */
	OffsetsItems:{
		'pouchSword':{
			'id':0x04aa64,
			'type':'integer'
		},
		'pouchBow':{
			'id':0x047630,
			'type':'integer'
		},
		'pouchShield':{
			'id':0x04d080,
			'type':'integer'
		},
		'shields':{
			'id':			0x000760f0,
			'durability':	0x0004a3b0,
			'power':		0x0004ba54,
			'modifier':		0x00051070
		},
		'bows':{
			'id':			0x0007b4e4,
			'durability':	0x0004aab8,
			'power':		0x0004cafc,
			'modifier':		0x0005252c
		},
		'weapons':{
			'id':			0x000c3b58,
			'durability':	0x0004d1c0,
			'power':		0x0004eed4,
			'modifier':		0x000515bc
		},
		'arrows':{
			'id':0x000820ec,
			'quantity':0x00046ff4
		},
		'materials':{
			'id':0x000afbf4,
			'quantity':0x000477a4
		},
		'armors':{
			'id':0x00061bbc,
			'quantity':false
		},
		'food':{
			'id':0x00087ca4,
			'quantity':0x0004e984
		},
		'devices':{
			'id':0x0009cb70,
			'quantity':0x00046148
		},
		'key':{
			'id':0x000b9488,
			'quantity':0x0004eb98
		}
	},
	_readItemsNew:function(){
		var offset=Offsets.TempItemData;
		var arrays=[];
		
		var i=0;
		var offsetEnd=tempFile.readU32(offset);
		i++;
		offset+=4;
		while(offset<offsetEnd){
			var len=tempFile.readU32(offset);
			var elems=new Array(len);
			elems
			arrays.push({
			})
			offset+=4*len;
			i+=len;
		}
		
		return arrays;
	},
	_readItemsAll:function(){
		return {
			'shields':this._readItemsComplex('shields'),
			'bows':this._readItemsComplex('bows'),
			'weapons':this._readItemsComplex('weapons'),
			'arrows':this._readItemsSimple('arrows'),
			'materials':this._readItemsSimple('materials'),
			'armors':this._readItemsSimple('armors'),
			'food':this._readItemsSimple('food'),
			'devices':this._readItemsSimple('devices'),
			'key':this._readItemsSimple('key'),

			'pouchSword':this._readItemsSimple('pouchSword'),
			'pouchBow':this._readItemsSimple('pouchBow'),
			'pouchShield':this._readItemsSimple('pouchShield')
		}
	},
	_writeItemsAll:function(items){
		this._writeItemsComplex(items.shields, this.OffsetsItems.shields);
		this._writeItemsComplex(items.bows, this.OffsetsItems.bows);
		this._writeItemsComplex(items.weapons, this.OffsetsItems.weapons);
		this._writeItemsSimple(items.arrows, this.OffsetsItems.arrows);
		this._writeItemsSimple(items.materials, this.OffsetsItems.materials);
		this._writeItemsSimple(items.armors, this.OffsetsItems.armors);
		this._writeItemsSimple(items.food, this.OffsetsItems.food);
		this._writeItemsSimple(items.devices, this.OffsetsItems.devices);
		this._writeItemsSimple(items.key, this.OffsetsItems.key);
		
		this._writeItemsSimple(items.pouchSword, this.OffsetsItems.pouchSword);
		this._writeItemsSimple(items.pouchBow, this.OffsetsItems.pouchBow);
		this._writeItemsSimple(items.pouchShield, this.OffsetsItems.pouchShield);
	},
	_readItemsComplex:function(catId){
		var offsets=this.OffsetsItems[catId];
		var offsetShift=this._getCurrentGameVersionOffset();

		var nItems=offsets.count=tempFile.readU32(offsetShift + offsets.id);
		var items=[];
		offsetShift+=0x04;
		for(var i=0; i<nItems; i++){
			var item={
				'index':i,
				'category':catId,
				'id':tempFile.readString(offsetShift + offsets.id + i*0x40, 0x40),
				'modifier':tempFile.readU32(offsetShift + offsets.modifier + i*0x04),
				'power':tempFile.readU32(offsetShift + offsets.power + i*0x04),
				'durability':tempFile.readU32(offsetShift + offsets.durability + i*0x04)
			};
			if(item.id)
				items.push(item);
		}
		return items;
	},
	_writeItemsComplex:function(items, offsets){
		var offsetShift=this._getCurrentGameVersionOffset();

		offsetShift+=0x04;
		for(var i=0; i<items.length; i++){
			var item=items[i];			
			tempFile.writeString(offsetShift + offsets.id + item.index * 0x40, item.id, 0x40);
			tempFile.writeU32(offsetShift + offsets.modifier + item.index * 0x04, item.modifier);
			tempFile.writeU32(offsetShift + offsets.power + item.index * 0x04, item.power);
			tempFile.writeU32(offsetShift + offsets.durability + item.index * 0x04, item.durability);
		}
		return items;
	},
	_readItemsSimple:function(catId){
		var offsets=this.OffsetsItems[catId];
		var offsetShift=this._getCurrentGameVersionOffset();

		var nItems=offsets.count=tempFile.readU32(offsetShift + offsets.id);
		var items=[];
		var readQuantity=offsets.quantity && tempFile.readU32(offsetShift + offsets.quantity)===offsets.count;
		offsetShift+=0x04;
		var modeInteger=offsets.type==='integer';
		for(var i=0; i<nItems; i++){
			if(modeInteger){
				var item={
					'index':i,
					'category':catId,
					'value':tempFile.readU32(offsetShift + offsets.id + i*0x04)
				};
				items.push(item);
			}else{
				var item={
					'index':i,
					'category':catId,
					'id':tempFile.readString(offsetShift + offsets.id + i*0x40, 0x40),
					'quantity':readQuantity? tempFile.readU32(offsetShift + offsets.quantity + i*0x04) : 1
				};
				if(item.id)
					items.push(item);
			}
		}
		return items;
	},
	_writeItemsSimple:function(items, offsets){
		var offsetShift=this._getCurrentGameVersionOffset();
		var writeQuantity=offsets.quantity && tempFile.readU32(offsetShift + offsets.quantity)===offsets.count;
		var modeInteger=offsets.type==='integer';

		for(var i=0; i<items.length; i++){
			var item=items[i];
			if(modeInteger){
				tempFile.writeU32(0x04 + offsetShift + offsets.id + item.index * 0x04, item.value);
			}else{
				tempFile.writeString(0x04 + offsetShift + offsets.id + item.index * 0x40, item.id, 0x40);
				if(writeQuantity)
					tempFile.writeU32(0x04 + offsetShift + offsets.quantity + item.index*0x04, item.quantity);
			}
		}
		return items;
	},

	/* private functions */
	_toHexInt:function(i){var s=i.toString(16);while(s.length<8)s='0'+s;return '0x'+s},
	_writeBoolean:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeU32(offset+8*arrayIndex,val?1:0);else tempFile.writeU32(offset,val?1:0)},
	_writeValue:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeU32(offset+8*arrayIndex,val);else tempFile.writeU32(offset,val)},
	_writeFloat32:function(offset,val,arrayIndex){if(arrayIndex)tempFile.writeF32(offset+8*arrayIndex,val);else tempFile.writeF32(offset,val)},
	_writeString:function(offset,str,len){
		len=len || 8;
		for(var i=0; i<len; i++){
			tempFile.writeBytes(offset,[0,0,0,0]);
			var fourBytes=str.substr(i*4, 4);
			for(j=0; j<fourBytes.length; j++){
				tempFile.writeU8(offset+j, fourBytes.charCodeAt(j));
			}
			offset+=8;
		}
	},
	_writeString64:function(offset,str,arrayIndex){if(typeof arrayIndex==='number')offset+=this.Constants.STRING64_SIZE*arrayIndex;this._writeString(offset,str, 16);},
	_writeString256:function(offset,str){this._writeString(offset,str, 64);},

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
			/*if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.log(this.Hashes[i+1]+' not found');
			}*/
		}
	},


	_getItemTranslation:function(itemId){
		for(var i=0; i<TOTK_Data.Translations.length; i++)
			if(TOTK_Data.Translations[i].items[itemId])
				return TOTK_Data.Translations[i].items[itemId];
		return '<span style="color:red">'+itemId+'</span>'
	},

	/*_readStringBOTW:function(offset, len){
		len=len || 8;
		var txt='';
		for(var j=0; j<len; j++){
			txt+=tempFile.readString(offset,4);
			offset+=8;
		}
		return txt
	},
	_readString64BOTW:function(offset,arrayIndex){
		if(typeof arrayIndex==='number')
			offset+=this.Constants.STRING64_SIZE*arrayIndex;
		return this._readString(offset, 16);
	},
	_readString256BOTW:function(offset,){
		return this._readString(offset, 64);
	},*/

	_createItemRow:function(item){
		var img=new Image();
		img.id='icon-'+item.category+'-'+item.index;
		img.loading='lazy';
		img.onerror=function(){
			this.removeEventListener('error', this.onerror);
			//console.error('icon '+this.src+' not found');
			img.src=SavegameEditor.Constants.BLANK_ICON_PATH;
		}
		if(TOTK_Data.ALTERNATE_ICONS[item.id])
			img.src='./assets/icons/'+item.category+'/'+TOTK_Data.ALTERNATE_ICONS[item.id]+'.png';
		else
			img.src='./assets/icons/'+item.category+'/'+item.id+'.png';

		var itemNumber=document.createElement('span');
		itemNumber.className='item-number';
		itemNumber.innerHTML='#'+item.index;

		var span=document.createElement('span');
		span.className='item-name clickable';
		span.id='item-name-'+item.category+'-'+item.index;
		span.innerHTML=this._getItemTranslation(item.id);
		span.addEventListener('click', function(){
			SavegameEditor.editItem(item);
		}, false);


		var lastColumn=document.createElement('div');
		if(item.category==='weapons' || item.category==='bows' || item.category==='shields'){
			var maxDurability=TOTK_Data.DEFAULT_DURABILITY[item.id] || 70;
			var input1=inputNumber('item-durability-'+item.category+'-'+item.index, 1, maxDurability, item.durability);
			input1.addEventListener('change', function(){
				var newVal=parseInt(this.value);
				if(!isNaN(newVal) && newVal>0)
					item.durability=newVal;
			});
			input1.title='Durability';

			var input2=inputNumber('item-power-'+item.category+'-'+item.index, 1, 6553500, item.power);
			input2.addEventListener('change', function(){
				var newVal=parseInt(this.value);
				if(!isNaN(newVal) && newVal>0)
					item.power=newVal;
			});
			input2.title='Power';
			input2.disabled=true;

			var modifiers=[
				{name:'No bonus', value:0xb6eede09},
				{name:'Attack ↑', value:0xa9384c6c},
				{name:'Attack ↑↑', value:0xdad10617},
				{name:'Durability ↑', value:0xd5cad39b},
				{name:'Durability ↑↑', value:0xb2c943ee}
			];
			if(item.category==='weapons'){
				modifiers.push({name:'Throw ↑↑', value:0x9659c804});
			}else if(item.category==='bows'){
				modifiers.push({name:'Quick Shot', value:0x7d505bc4});
				modifiers.push({name:'Arrow Shot x5', value:0x934069cd});
			}else if(item.category==='shields'){
				modifiers.push({name:'Block ↑↑', value:0xb3c94e5});
			}
			var unknownModifier=true;
			modifiers.forEach(function(modifier){
				if(item.modifier===modifier.value){
					unknownModifier=false;
				}
			});
			if(unknownModifier){
				modifiers.push({name:'Unknown: '+item.modifier.toString(16), value:item.modifier});
			}
			var selectModifier=select('item-modifier-'+item.category+'-'+item.index, modifiers, function(){
				item.modifier=parseInt(this.value);
			});
			selectModifier.title='Modifier';
			if(unknownModifier)
				selectModifier.disabled=false;
			selectModifier.value=item.modifier;
			
			lastColumn.appendChild(input1);
			lastColumn.appendChild(input2);
			lastColumn.appendChild(selectModifier);
		}else if(item.quantity!==0xffffffff && (item.category==='arrows' || item.category==='materials' || item.category==='food' || item.category==='devices' || item.category==='key')){
			var maxValue=TOTK_Data.MAXIMUM_QUANTITY[item.id] || 999;
			var input=inputNumber('item-quantity-'+item.category+'-'+item.index, 1, maxValue, item.quantity);
			input.addEventListener('change', function(){
				var newVal=parseInt(this.value);
				if(!isNaN(newVal) && newVal>0)
					item.quantity=newVal;
			});
			input.title='Quantity';
			
			lastColumn.appendChild(input);
		}
		/*
		if(item.category && item.category==='armors'){
			input=select('item'+item.index, TOTK_Data.DYE_COLORS, function(){
				TOTK_Icons.setIcon(img, SavegameEditor._loadItemName(item.index), parseInt(this.value));
			});
			input.value=itemVal;

			TOTK_Icons.setIcon(img, item.id, itemVal);
		}else{
			input=inputNumber('item-quantity-'+item.category+'-'+item.index, 0, this._getItemMaximumQuantity(item.id), item.quantity);
			input.addEventListener('change', function(){
				var newVal=parseInt(this.value);
				if(!isNaN(newVal) && newVal>0)
					item.quantity=newVal;
			});
			TOTK_Icons.setIcon(img, item.id);
		}*/

		var r=row([1,6,3,2],
			img,
			span,
			document.createElement('div'), /* modifier column */
			lastColumn
		);
		r.className+=' row-items';
		r.id='row-item-'+item.category+'-'+item.index;
		r.children[1].appendChild(itemNumber);
		
		return r;
	},

	addItem:function(catId){
		var itemIds;
		for(var i=0; i<TOTK_Data.Translations.length && !itemIds; i++){
			if(TOTK_Data.Translations[i].id===catId)
				itemIds=Object.keys(TOTK_Data.Translations[i].items);
		}
		if(!itemIds)
			return false;

		var lastItem=null;
		for(var i=0; i<this.currentItems[catId].length; i++){
			/* find last index just in case */
			if(!lastItem || (this.currentItems[catId][i].index > lastItem.index	))
				lastItem=this.currentItems[catId][i];
		}
		if(!lastItem){
			lastItem={
				index:0,
				category:catId,
				id:itemIds[0],
				quantity:1,
			}
		}

		var offsetShift=this._getCurrentGameVersionOffset();
		var maxItems=tempFile.readU32(offsetShift + this.OffsetsItems[catId].id);
		if(lastItem.index===(maxItems -1))
			return false;


		var nextIndexId=itemIds.indexOf(lastItem.id)+1;
		if(nextIndexId===itemIds.length)
			nextIndexId=0;


		var newItem={
			index:lastItem.index+1,
			category:lastItem.category,
			id:itemIds[nextIndexId],
			quantity:lastItem.quantity,
			removable:true
		}
		this.currentItems[catId].push(newItem);
		var row=this._createItemRow(newItem);
		document.getElementById('container-'+newItem.category).appendChild(row);
		row.scrollIntoView({behavior:'smooth',block:'center'});
	},

	editItem:function(item){
		currentEditingItem=item;
		/* prepare edit item selector */
		this.selectItem.innerHTML='';
		var foundItemId=false;
		for(var i=0; i<TOTK_Data.Translations.length; i++){
			if(TOTK_Data.Translations[i].id===item.category){
				for(var itemId in TOTK_Data.Translations[i].items){
					var opt=document.createElement('option');
					opt.value=itemId;
					opt.innerHTML=TOTK_Data.Translations[i].items[itemId];
					
					if(itemId===item.id)
						foundItemId=true;

					this.selectItem.appendChild(opt);
				}
			}
		}
		if(!foundItemId){
			var opt=document.createElement('option');
			opt.value=item.id;
			opt.innerHTML=item.id;
			this.selectItem.appendChild(opt);
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
	
	restoreDurability:function(catId){
		this.currentItems[catId].forEach(function(item){
			var durability=TOTK_Data.DEFAULT_DURABILITY[item.id] || 70;
			item.durability=durability;
			document.getElementById('number-item-durability-'+item.category+'-'+item.index).value=durability;
		});		
	},

	filterItems:function(category){
	},

	_getModifierOffset1:function(type){
		if(type==='bows')
			return this.Offsets.FLAGS_BOW;
		else if(type==='shields')
			return this.Offsets.FLAGS_SHIELDS;
		else
			return this.Offsets.FLAGS_WEAPON;
	},
	_getModifierOffset2:function(type){
		if(type==='bows')
			return this.Offsets.FLAGSV_BOW;
		else if(type==='shields')
			return this.Offsets.FLAGSV_SHIELD;
		else
			return this.Offsets.FLAGSV_WEAPON;
	},

	editModifier2:function(type,i,modifier,val){
		tempFile.writeU32(this._getModifierOffset1(type)+i*0x08, modifier);
		tempFile.writeU32(this._getModifierOffset2(type)+i*0x08, val);
	},

	setHorseName:function(i,val){
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
			/* fix mane */
			this._writeString64(this.Offsets.HORSE_MANES, (val==='GameRomHorse00L'?'Horse_Link_Mane_00L':'Horse_Link_Mane'), i);
		}
	},

	_arrayToSelectOpts:function(arr){
		var arr2=[];
		for(var i=0; i<arr.length; i++){
			var name=TOTK_Data.Translations[6].items[arr[i]] || arr[i];
			arr2.push({name:name, value:arr[i]});
		}
		return arr2;
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
					this.currentGameVersionIndex=i;
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
				SavegameEditor.currentItems.pouchSword[0].value=newVal;
		});
		getField('pouch-size-bows').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=5)
				SavegameEditor.currentItems.pouchBow[0].value=newVal;
		});
		getField('pouch-size-shields').addEventListener('change', function(evt){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=4)
				SavegameEditor.currentItems.pouchShield[0].value=newVal;
		});


		var armorIdByName={};
		for(var id in TOTK_Data.Translations[4].items){
			var name=TOTK_Data.Translations[4].items[id];

			if(name.indexOf('★')===-1){
				armorIdByName[name]=id;
			}else{
				TOTK_Data.ALTERNATE_ICONS[id]=armorIdByName[name.replace(/ ★+$/,'')];
			}
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


		/* horses */
		/*for(var i=0; i<6; i++){
			if(i<5){
				get('input-horse'+i+'-name').horseIndex=i;
				get('input-horse'+i+'-name').addEventListener('change', function(){SavegameEditor.setHorseName(this.horseIndex, this.value)}, false);
				get('select-horse'+i+'-saddles').horseIndex=i;
				get('select-horse'+i+'-saddles').addEventListener('change', function(){SavegameEditor.setHorseSaddle(this.horseIndex, this.value)}, false);
				get('select-horse'+i+'-reins').horseIndex=i;
				get('select-horse'+i+'-reins').addEventListener('change', function(){SavegameEditor.setHorseReins(this.horseIndex, this.value)}, false);
			}
			get('select-horse'+i+'-type').horseIndex=i;
			get('select-horse'+i+'-type').addEventListener('change', function(){SavegameEditor.setHorseType(this.horseIndex, this.value)}, false);

			select('horse'+i+'-saddles', this._arrayToSelectOpts(TOTK_Data.HORSE_SADDLES));
			select('horse'+i+'-reins', this._arrayToSelectOpts(TOTK_Data.HORSE_REINS));
			select('horse'+i+'-type', this._arrayToSelectOpts(i===5?TOTK_Data.HORSE_TYPES.concat(TOTK_Data.HORSE_TYPES_UNTAMMED):TOTK_Data.HORSE_TYPES));
		}*/
		
		
		
		MarcTooltips.add('.tab-button',{className:'dark',fixed:true});
	},

	_timeToString:function(timeVal){
		var seconds=timeVal%60;
		if(seconds<10)seconds='0'+seconds;
		var minutes=parseInt(timeVal/60)%60;
		if(minutes<10)seconds='0'+seconds;
		return parseInt(timeVal/3600)+':'+minutes+':'+seconds;
	},

	/* load function */
	load:function(){
		tempFile.fileName='progress.sav';



		/* items */
		this.currentItems=this._readItemsAll();
		//this.currentItemsTest=this._readItemsNew();

		/* prepare editor */
		setValue('rupees', tempFile.readU32(this.Offsets.TempRupees));
		/*setValue('mons', tempFile.readU32(this.Offsets.MONS));*/
		setValue('max-hearts', tempFile.readU32(this.Offsets.TempMaxHearts));
		setValue('max-stamina', tempFile.readU32(this.Offsets.TempStamina));

		setValue('number-pouch-size-swords', this.currentItems.pouchSword[0].value);
		setValue('number-pouch-size-bows', this.currentItems.pouchBow[0].value);
		setValue('number-pouch-size-shields', this.currentItems.pouchShield[0].value);


		/*setValue('relic-gerudo', tempFile.readU32(this.Offsets.RELIC_GERUDO));
		setValue('relic-goron', tempFile.readU32(this.Offsets.RELIC_GORON));
		setValue('relic-rito', tempFile.readU32(this.Offsets.RELIC_RITO));

		setValue('koroks', tempFile.readU32(this.Offsets.KOROK_SEED_COUNTER));
		setValue('defeated-hinox', tempFile.readU32(this.Offsets.DEFEATED_HINOX_COUNTER));
		setValue('defeated-talus', tempFile.readU32(this.Offsets.DEFEATED_TALUS_COUNTER));
		setValue('defeated-molduga', tempFile.readU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER));
		setValue('playtime',this._timeToString(tempFile.readU32(this.Offsets.PLAYTIME)));*/


		/* motorcycle */
		/*document.getElementById('checkbox-motorcycle').checked=!!tempFile.readU32(this.Offsets.MOTORCYCLE);
		if(this.Offsets.MOTORCYCLE){
			document.getElementById('row-motorcycle').style.display='flex';
		}else{
			document.getElementById('row-motorcycle').style.display='none';
		}*/


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

		/*var modifiersArray=[0,0,0];*/
		var ITEM_CATS=['weapons','arrows','bows','shields','armors','materials','food','devices','key'];
		
		for(var i=0; i<ITEM_CATS.length; i++){
			var itemCat=ITEM_CATS[i];

			empty('container-'+itemCat);
			for(var j=0; j<this.currentItems[itemCat].length; j++){
				document.getElementById('container-'+itemCat).appendChild(
					this._createItemRow(this.currentItems[itemCat][j])
				);
			}
		}
		MarcTooltips.add('#container-weapons input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-arrows input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-bows input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-shields input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-materials input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-food input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-devices input',{position:'bottom',align:'right'});
		MarcTooltips.add('#container-key input',{position:'bottom',align:'right'});

		/* modifier column */
		/*var modifierColumns=['weapon','bow','shield'];
		for(var j=0; j<3; j++){
			var modifierColumn=modifierColumns[j];
			for(var i=0; i<modifiersArray[j]; i++){
				var modifier=tempFile.readU32(this.Offsets['FLAGS_'+modifierColumn.toUpperCase()]+i*8);
				var modifierSelect=select('modifier-'+modifierColumn+'s-'+i, TOTK_Data.MODIFIERS.concat({value:modifier,name:this._toHexInt(modifier)}));
				modifierSelect.value=modifier;

				var additional=document.getElementById('container-'+modifierColumn+'s').children[i].children[2];
				additional.appendChild(modifierSelect);
				additional.appendChild(inputNumber('modifier-'+modifierColumn+'s-value-'+i, 0, 0xffffffff, tempFile.readU32(this.Offsets['FLAGSV_'+modifierColumn.toUpperCase()]+i*8)));
			}
		}*/


		/* horses */
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

		/*tempFile.writeU32(this.Offsets.RELIC_GERUDO, getValue('relic-gerudo'));
		tempFile.writeU32(this.Offsets.RELIC_GORON, getValue('relic-goron'));
		tempFile.writeU32(this.Offsets.RELIC_RITO, getValue('relic-rito'));
		
		tempFile.writeU32(this.Offsets.KOROK_SEED_COUNTER, getValue('koroks'));
		tempFile.writeU32(this.Offsets.DEFEATED_HINOX_COUNTER, getValue('defeated-hinox'));
		tempFile.writeU32(this.Offsets.DEFEATED_TALUS_COUNTER, getValue('defeated-talus'));
		tempFile.writeU32(this.Offsets.DEFEATED_MOLDUGA_COUNTER, getValue('defeated-molduga'));*/
		

		/* MOTORCYCLE */
		/*if(this.Offsets.MOTORCYCLE){
			tempFile.writeU32(this.Offsets.MOTORCYCLE, getField('checkbox-motorcycle').checked?1:0);
		}*/



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
		this._writeItemsAll(this.currentItems);

		/* modifiers */
		/*for(var i=0; document.getElementById('select-modifier-weapons-'+i); i++){
			tempFile.writeU32(this.Offsets.FLAGS_WEAPON+i*8, getValue('modifier-weapons-'+i));
			tempFile.writeU32(this.Offsets.FLAGSV_WEAPON+i*8, getValue('modifier-weapons-value-'+i));
		}
		for(var i=0; document.getElementById('select-modifier-bows-'+i); i++){
			tempFile.writeU32(this.Offsets.FLAGS_BOW+i*8, getValue('modifier-bows-'+i));
			tempFile.writeU32(this.Offsets.FLAGSV_BOW+i*8, getValue('modifier-bows-value-'+i));
		}
		for(var i=0; document.getElementById('select-modifier-shields-'+i); i++){
			tempFile.writeU32(this.Offsets.FLAGS_SHIELD+i*8, getValue('modifier-shields-'+i));
			tempFile.writeU32(this.Offsets.FLAGSV_SHIELD+i*8, getValue('modifier-shields-value-'+i));
		}*/
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



/*
function setValueByHash(hash, val){
	var offset=SavegameEditor._searchHash(hash);
	if(offset){
		if(val.length && val.length===3){
			SavegameEditor._writeValue(offset, val[0]);
			SavegameEditor._writeValue(offset, val[1], 1);
			SavegameEditor._writeValue(offset, val[2], 2);
		}else if(typeof val==='string'){
			SavegameEditor._writeString64(offset, val);
		}else{
			SavegameEditor._writeValue(offset, val);
		}
	}else{
		alert('invalid hash '+SavegameEditor._toHexInt(hash));
	}
}*/

function setBooleans(hashTable, counterElement){
	var counter=0;
	for(var i=0;i<hashTable.length; i++){
		var offset=SavegameEditor._searchHash(hashTable[i]);
		if(offset && !tempFile.readU32(offset+4)){
			tempFile.writeU32(offset+4, 1);
			counter++;
		}
	}

	if(counterElement)
		setValue(counterElement, parseInt(getValue(counterElement))+counter);
	return counter;
}

function unlockKoroks(){
	var unlockedKoroks=setBooleans(TOTK_Data.KOROKS,'koroks');
	var offset=SavegameEditor._searchHash(0x64622a86); //HiddenKorok_Complete
	tempFile.writeU32(offset+4, 1);

	//search korok seeds in inventory
	for(var i=0; i<SavegameEditor.Constants.MAX_ITEMS; i++){
		if(SavegameEditor._loadItemName(i)==='Obj_KorokNuts'){
			setValue('item'+i, parseInt(getValue('item'+i))+unlockedKoroks);
			break;
		}
	}
	MarcDialogs.alert(unlockedKoroks+' korok seeds were added');
}

function defeatAllHinox(){
	var unlockedKoroks=setBooleans(TOTK_Data.DEFEATED_HINOX,'defeated-hinox');
	MarcDialogs.alert(unlockedKoroks+' Hinox have been defeated');
}
function defeatAllTalus(){
	var unlockedKoroks=setBooleans(TOTK_Data.DEFEATED_TALUS,'defeated-talus');
	MarcDialogs.alert(unlockedKoroks+' Talus have been defeated');
}
function defeatAllMolduga(){
	var unlockedKoroks=setBooleans(TOTK_Data.DEFEATED_MOLDUGA,'defeated-molduga');
	MarcDialogs.alert(unlockedKoroks+' Molduga have been defeated');
}
function visitAllLocations(){
	var missingLocations=setBooleans(TOTK_Data.LOCATIONS);
	MarcDialogs.alert(missingLocations+' unknown locations were visited');
}
function setCompendiumToStock(){
	var setToStock=0;
	for(var i=0; i<TOTK_Data.PICTURE_BOOK_SIZE.length; i++){
		var offset=SavegameEditor._searchHash(TOTK_Data.PICTURE_BOOK_SIZE[i]);
		if(typeof offset === 'number'){
			var val=tempFile.readU32(offset+4);
			if(val && val!==0xffffffff){
				tempFile.writeU32(offset+4, 0xffffffff);
				setToStock++;
			}
		}
	}
	MarcDialogs.alert(setToStock+' pics were reseted to stock.<br/>You can now safely remove all .jpg files under <u>pict_book</u> folder.');
}

var mapPinCount = 0;
var MAX_MAP_PINS = 100;
function loadMapPins(){
	// Read Pin Types
	var count = 0;
	iterateMapPins(function(val){
		if (val == 0xffffffff){
			return false;
		}
		count++;
		//console.log(count, val)
		return true;
	})
	// to debug saved locations
	// var i = 0;
	// iterateMapPinLocations(function(val, offset){
	// 	if (i % 3 == 0){
	// 		console.log("-----")
	// 		if (val == -100000){
	// 			return false;
	// 		}
	// 	}
	// 	i++
	// 	console.log(val)
	// 	return true
	// })
	mapPinCount = count;
	setValue('number-map-pins', count);
}

function guessMainFieldGrid() {
	if (getValue('pos-maptype') == "MainField")
		setValue("pos-map",guessMainFieldGridInternal(getValue("pos-x"), getValue("pos-z")))
}

function fixDungeonCoordinates() {
	var dungeon = getValue('pos-map')
	if (dungeon == "RemainsFire") {
		setValue('pos-x', 0)
		setValue('pos-y',16.8)
		setValue('pos-z',69.5)
	} else if (dungeon == "RemainsWater") {
		setValue('pos-x',47.7)
		setValue('pos-y',6.05)
		setValue('pos-z',6.3)
	} else if (dungeon == "RemainsWind") {
		setValue('pos-x',0)
		setValue('pos-y',3.4)
		setValue('pos-z',-77.7)
	} else if (dungeon == "RemainsElectric") {
		setValue('pos-x',0)
		setValue('pos-y',71.9)
		setValue('pos-z',3.7)
	} else if (dungeon == "FinalTrial") {
		setValue('pos-x',0)
		setValue('pos-y',-0.4)
		setValue('pos-z',64.5)
	}
}

function guessMainFieldGridInternal(xpos, zpos) {
	// A1 = -4974.629, -3974.629
	// J8 =  4974.629,  3974.629
	// X and letter part of grid: west/east
	// Z and number part of grid: north/south

	// grid also visible at https://mrcheeze.github.io/botw-object-map/

	// idea: Take position fraction out of the whole grid and divide equally.

	var gridvalX = Math.min(10, Math.max(1, Math.trunc((xpos + 4974.629) / 9949.258 * 10 + 1)))
	var gridvalZ = Math.min( 8, Math.max(1, Math.trunc((zpos + 3974.629) / 7949.258 * 8  + 1)))

	return String.fromCharCode(64 + gridvalX) + '-' + gridvalZ
}

function clearMapPins(){
	// types
	var count = 0;
	iterateMapPins(function(val,offset){
		if (val != 0xffffffff){
			count++;
			tempFile.writeU32(offset, 0xffffffff)
		}
		return true;
	})

	var count2 =0; 
	var i = 0;
	iterateMapPinLocations(function(val, offset){
		var expect = i % 3 == 0 ? -100000 : 0;
		i++;
		if (val != expect){
			count2++
			tempFile.writeF32(offset, expect)
		}
		return true
	})
	if (count2 / 3 > count){
		count = count2 / 3
	}
	mapPinCount = 0;
	setValue('number-map-pins', 0);
	MarcDialogs.alert(count+' map pins removed');
}

function iterateMapPins(f){
	var offset = SavegameEditor.Offsets.MapApp_MapIconNo-4;
	for (var i = 0;; i++){
		var base = offset + (8 * i)
		var hdr = tempFile.readU32(base)
		var val = tempFile.readU32(base + 4)
		//if (hdr != SavegameEditor.Constants.MAP_ICONS){
		if (hdr != SavegameEditor.Headers.MapApp_MapIconNo){
			break
		}
		if (!f(val,base+4)){
			break
		}
	}
}
function iterateMapPinLocations(f){
	offset = SavegameEditor.Offsets.MapApp_MapIconPos-4;
	for (var i = 0;; i++){
		var base = offset + (8 * i)
		var hdr = tempFile.readU32(base)
		var val = tempFile.readF32(base + 4)
		if (hdr != SavegameEditor.Headers.MapApp_MapIconPos){
			break
		}
		if(!f(val,base+4)){
			break
		}
	}
}

function dist(px,py,pz,l){
	// 2d seems to work better than 3d
	return Math.sqrt((Math.pow(l[0]-px,2))+(Math.pow(l[2]-pz,2)))
}



function addToMap(data, icon){
	var px=tempFile.readF32(SavegameEditor.Offsets.PLAYER_POSITION);
	var py=tempFile.readF32(SavegameEditor.Offsets.PLAYER_POSITION+8);
	var pz=tempFile.readF32(SavegameEditor.Offsets.PLAYER_POSITION+16);

	var points = [];
	for (var i = 0; i<data.length; i++){
		var l = TOTK_Data.COORDS[data[i]]
		if (l){
		   points.push({H:data[i], L:l})
		}
	}
	// fill closest first
	points.sort(function(a,b){
		aDist = dist(px,py,pz,a.L);
		bDist = dist(px,py,pz,b.L);
		return aDist - bDist
	})
	var count = 0;
	for (var i = 0; i<points.length && mapPinCount<MAX_MAP_PINS; i++){
		var pt = points[i]
		var hash = pt.H;
		var offset=SavegameEditor._searchHash(hash);
		if(offset && !tempFile.readU32(offset + 4)){
			addMapPin(icon, pt.L)
			count++;
			mapPinCount++;
		}
	}
	setValue('number-map-pins', mapPinCount);
	return count;
}

function addMapPin(icon, location){
	// add pin to next availible location.
	iterateMapPins(function(val,offset){
		if (val == 0xffffffff){
			tempFile.writeU32(offset, icon)
			return false
		}
		return true;
	})
	var i = 0;
	var added = false;
	iterateMapPinLocations(function(val, offset){
		if (i%3 != 0){
			i++
			return true;
		}
		i++
		if (val == -100000){
			added = true;
			tempFile.writeF32(offset,location[0])
			tempFile.writeF32(offset+8,location[1])
			tempFile.writeF32(offset+16,location[2])
			return false;
		}
		return true;
	})
}

function addKoroksToMap(){
	var n = addToMap(TOTK_Data.KOROKS, SavegameEditor.Constants.ICON_TYPES.LEAF);
	MarcDialogs.alert(n+' pins for missing Korok seeds added to map');
}

function addHinoxToMap(){
	var n = addToMap(TOTK_Data.DEFEATED_HINOX, SavegameEditor.Constants.ICON_TYPES.SKULL);
	MarcDialogs.alert(n+' pins for missing Hinox added to map');
}

function addTalusToMap(){
	var n = addToMap(TOTK_Data.DEFEATED_TALUS, SavegameEditor.Constants.ICON_TYPES.SHIELD);
	MarcDialogs.alert(n+' pins for missing Talus added to map');
}

function addMoldugaToMap(){
	var n = addToMap(TOTK_Data.DEFEATED_MOLDUGA, SavegameEditor.Constants.ICON_TYPES.CHEST);
	MarcDialogs.alert(n+' pins for missing Molduga added to map');
}

function addLocationsToMap(){
	var n = addToMap(TOTK_Data.LOCATIONS, SavegameEditor.Constants.ICON_TYPES.STAR);
	MarcDialogs.alert(n+' pins for missing locations added to map');
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

if(typeof String.prototype.endsWith==='undefined'){
	String.prototype.endsWith=function(search){
        return (new RegExp(search+'$')).test(this)
    };
}
if(typeof String.prototype.startsWith==='undefined'){
	String.prototype.startsWith=function(search){
        return (new RegExp('^'+search)).test(this)
    };
}










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
