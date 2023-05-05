/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Icons) v20230505

	by Marc Robledo 2023
*/

var TOTK_Icons=(function(){
	var ICON_SIZE=64;
	var ICON_COLS=16;
	var IMG_PATH='./assets/';

	var ICONS={
		Armor_Head:[],
		Armor_Upper:[],
		Armor_Lower:[],

		Item_Chilled:[],
		Item_ChilledFish:[],
		Item_Enemy:[],
		Item_Material:[],
		Item_Meat:[],
		Item_Roast:[],
		Item_RoastFish:[],

		Item_FishGet:[],
		Item_Fruit:[],
		Item_InsectGet:[],
		Item_MushroomGet:[],
		Item_Ore:[],
		Item_PlantGet:[],

		Item_Cook:[],

		Weapon_Sword:[],
		Weapon_Lsword:[],
		Weapon_Spear:[],
		Weapon_Bow:[],
		Weapon_Shield:[],

		Other:[]
	}
	var REPEAT_ARMOR_ICONS_1=[];
	var REPEAT_ARMOR_ICONS_2=[];

	var loadedImages={};
	var pendingImages=0;
	var isLoaded=false;


	var canvas=document.createElement('canvas');
	canvas.width=ICON_SIZE;
	canvas.height=ICON_SIZE;
	return{
		startLoadingIcons:function(){
			if(!pendingImages){
				isLoaded=true;
				TOTK_Icons.refreshAllIcons();
			}else if(!isLoaded){
				for(fileName in ICONS){
					loadedImages[fileName]=new Image();
					loadedImages[fileName].addEventListener('load', function(){
						pendingImages--;
						if(pendingImages===0){
							isLoaded=true;
							TOTK_Icons.refreshAllIcons();
						}
					}, false);
					loadedImages[fileName].src=IMG_PATH+fileName+'.png';
				}
			}
		},

		setIcon:function(el,itemNameId, dyeColor){
			if(isLoaded){
				if(dyeColor)
					el.src=this._getItemIcon(itemNameId, dyeColor);
				else
					el.src=this._getItemIcon(itemNameId);
			}else{
				el.nextSrc={id:itemNameId};
			}
		},

		refreshIcon:function(el){
		},

		refreshAllIcons:function(){
			var iconId=0;
			while(document.getElementById('icon'+iconId)){
				document.getElementById('icon'+iconId).src=this._getItemIcon(document.getElementById('icon'+iconId).nextSrc.id);
				iconId++;
			}
		},

		_getItemIcon:function(itemNameId, clothesColor){
			var fileName,id,match;
			if(match=itemNameId.match(/^Armor_([0-9]{3})_(Head|Upper|Lower)(_Dye[0-9]{2})?/)){
				fileName='Armor_'+match[2];
				id=match[1];
				/* add dye */
				/*if(match[3])
					id+=match[3];*/

				if(match[1]==='Lower' && id==='140'){
					id='141';
				}
				var index=REPEAT_ARMOR_ICONS_1.indexOf(id);
				if(index>=0){
					id=REPEAT_ARMOR_ICONS_2[parseInt(index/4)];
				}
			}else if(match=itemNameId.match(/^Item_(Chilled|ChilledFish|Enemy|Material|Meat|Roast|RoastFish)_([0-9]{2})/)){
				fileName='Item_'+match[1];
				id=match[2];
			}else if(itemNameId==='Item_Enemy_Put_57'){
				fileName='Item_Enemy';
				id='Put_57';
			}else if(match=itemNameId.replace('Animal_Insect_','Item_InsectGet_').replace('Mushroom_','MushroomGet_').replace('Plant_','PlantGet_').match(/^Item_(FishGet|Fruit|InsectGet|MushroomGet|Ore|PlantGet)_([A-Z][A-B]?)/)){
				fileName='Item_'+match[1];
				id=match[2];

				/* fix normal (non-get) crabs */
				if((id==='K' || id==='O' || id==='Z') && itemNameId.startsWith('Animal_Insect_'))
					id='Normal'+id;
			}else if(match=itemNameId.match(/^Item_Cook_([A-P]_[0-9]{2})/)){
				fileName='Item_Cook';
				id=match[1];
			}else if(match=itemNameId.match(/^Weapon_(Sword|Lsword|Spear|Bow|Shield)_([0-9]{3})/)){
				fileName='Weapon_'+match[1];
				id=match[2];
			}else{
				fileName='Other';
				id=itemNameId;
			}

			var icon=-1;
			if(fileName)
				icon=ICONS[fileName].indexOf(id);

			if(icon===-1){
				return this.getBlankIcon()
			}

			/* add dye */
			if(itemNameId.startsWith('Armor_') && clothesColor && clothesColor<=15){
				icon+=clothesColor;
			}

			if(isLoaded){
				var img=loadedImages[fileName];
				canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
				canvas.getContext('2d').drawImage(img, (icon%ICON_COLS)*ICON_SIZE, parseInt(icon/ICON_COLS)*ICON_SIZE, ICON_SIZE, ICON_SIZE, 0, 0, ICON_SIZE, ICON_SIZE);
				return canvas.toDataURL();
			}
		},

		getBlankIcon:function(){return './assets/_blank.png'},
	}
}());