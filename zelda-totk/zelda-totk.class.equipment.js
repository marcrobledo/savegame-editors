/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Equipment class) v20230519

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Equipment(catId, index, read){ //Weapon, Bow or Shield
	this.category=catId;
	this.index=index;
	this._offsets=Equipment.getOffsetsByCategoryId(catId);

	if(read){
		this.id=SavegameEditor.readString64Array(this._offsets.ID, index);
		this.durability=SavegameEditor.readU32Array(this._offsets.DURABILITY, index);
		this.modifier=SavegameEditor.readU32Array(this._offsets.MODIFIER, index);
		this.modifierValue=SavegameEditor.readU32Array(this._offsets.MODIFIER_VALUE, index);
		
		if(catId==='weapons' || catId==='shields')
			this.fuseId=SavegameEditor.readString64Array(this._offsets.FUSE_ID, index);
	}else{
		this.id='\0';
		this.durability=70;
		this.modifier=Equipment.MODIFIER_NO_BONUS;
		this.modifierValue=0;

		if(catId==='weapons' || catId==='shields')
			this.fuseId='\0';
	}

	Equipment.buildHtmlElements(this);
}
Equipment.prototype.getItemTranslation=function(){
	return Equipment.TRANSLATIONS[this.category][this.id] || this.id;
}
Equipment.prototype.restoreDurability=function(){
	this.durability=this.getMaximumDurability();
	this._htmlInputDurability.value=this.durability;
}
Equipment.prototype.getMaximumDurability=function(){
	if(this.modifier===Equipment.MODIFIER_DURABILITY || this.modifier===Equipment.MODIFIER_DURABILITY2) //Durability ↑/↑↑
		return 2100000000;
	return Equipment.DEFAULT_DURABILITY[this.id] || 70;
}
Equipment.prototype.save=function(){
	SavegameEditor.writeString64Array(this._offsets.ID, this.index, this.id);
	SavegameEditor.writeU32Array(this._offsets.DURABILITY, this.index, this.durability);
	SavegameEditor.writeU32Array(this._offsets.MODIFIER, this.index, this.modifier);
	SavegameEditor.writeU32Array(this._offsets.MODIFIER_VALUE, this.index, this.modifierValue);

	/*if(this.category==='weapons' || this.category==='shields')
		SavegameEditor.writeString64Array(this._offsets.FUSE_ID, this.index, this.fuseId);*/
}


Equipment.buildHtmlElements=function(item){
	//build html elements
	item._htmlInputDurability=inputNumber('item-durability-'+item.category+'-'+item.index, 1, 70, item.durability);
	item._htmlInputDurability.addEventListener('change', function(){
		var newVal=parseInt(this.value);
		if(!isNaN(newVal) && newVal>0)
			item.durability=newVal;
	});
	item._htmlInputDurability.title='Durability';
	item._htmlInputDurability.maxValue=item.getMaximumDurability();
	item._htmlInputDurability.value=item.durability;

	//build html elements
	var modifiers=[
		{name:'No bonus', value:Equipment.MODIFIER_NO_BONUS},
		{name:'Attack ↑', value:Equipment.MODIFIER_ATTACK},
		{name:'Attack ↑↑', value:Equipment.MODIFIER_ATTACK2},
		{name:'Durability ↑', value:Equipment.MODIFIER_DURABILITY},
		{name:'Durability ↑↑', value:Equipment.MODIFIER_DURABILITY2}
	];
	if(item.category==='weapons'){
		modifiers.push({name:'Critical Hit↑', value:Equipment.MODIFIER_CRITICAL_HIT});
		modifiers.push({name:'Throw ↑↑', value:Equipment.MODIFIER_THROW});
	}else if(item.category==='bows'){
		modifiers.push({name:'Quick Shot', value:Equipment.MODIFIER_QUICK_SHOT});
		//modifiers.push({name:'Arrow Shot x3', value:Equipment.MODIFIER_ARROWX3}); //???
		modifiers.push({name:'Arrow Shot x5', value:Equipment.MODIFIER_ARROWX5});
	}else if(item.category==='shields'){
		modifiers.push({name:'Block ↑', value:Equipment.MODIFIER_BLOCK});
		modifiers.push({name:'Block ↑↑', value:Equipment.MODIFIER_BLOCK2});
	}
	var unknownModifier=[
		Equipment.MODIFIER_NO_BONUS,
		Equipment.MODIFIER_ATTACK,
		Equipment.MODIFIER_ATTACK2,
		Equipment.MODIFIER_DURABILITY,
		Equipment.MODIFIER_DURABILITY2,
		Equipment.MODIFIER_CRITICAL_HIT,
		Equipment.MODIFIER_THROW,
		Equipment.MODIFIER_QUICK_SHOT,
		Equipment.MODIFIER_ARROWX3,
		Equipment.MODIFIER_ARROWX5,
		Equipment.MODIFIER_BLOCK,
		Equipment.MODIFIER_BLOCK2
	].indexOf(item.modifier)===-1;
	if(unknownModifier){
		modifiers.push({name:'Unknown: '+item.modifier.toString(16), value:item.modifier});
	}
	item._htmlSelectModifier=select('item-modifier-'+item.category+'-'+item.index, modifiers, function(){
		var fromNoBonus=item.modifier===Equipment.MODIFIER_NO_BONUS;
		var fromModifierDurability=item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2;
		item.modifier=parseInt(this.value);
		
		var maximumDurability=item.getMaximumDurability();
		get('number-item-durability-'+item.category+'-'+item.index).maxValue=maximumDurability;

		if(item.modifier===Equipment.MODIFIER_NO_BONUS){
			item.restoreDurability();
			item.modifierValue=0;
			item._htmlInputModifierValue.value=0;
		}else if(fromNoBonus && (item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2)){
			item.restoreDurability();
			item.modifierValue=maximumDurability;
			item._htmlInputModifierValue.value=maximumDurability;
		}else if(fromNoBonus || fromModifierDurability){
			item.restoreDurability();
		}
	}, item.modifier);
	item._htmlSelectModifier.title='Modifier';
	item._htmlSelectModifier.disabled=unknownModifier;

	//build html elements
	item._htmlInputModifierValue=inputNumber('item-modifier-value-'+item.category+'-'+item.index, 0, 2100000000, item.modifierValue);
	item._htmlInputModifierValue.addEventListener('change', function(){
		var newVal=parseInt(this.value);
		if(!isNaN(newVal) && newVal>0){
			item.modifierValue=newVal;
			if((item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2)){
				item.restoreDurability();
			}
		}
	});
	item._htmlInputModifierValue.title='Modifier value';
}

Equipment.readMaxCapacity=function(catId){
	return SavegameEditor.readArraySize(Equipment.getOffsetsByCategoryId(catId).ID);
}
Equipment.readAll=function(catId){
	var offsets=Equipment.getOffsetsByCategoryId(catId);

	var items=[];
	var maxItems=Equipment.readMaxCapacity(catId);
	for(var i=0; i<maxItems; i++){
		var item=new Equipment(catId, i, true);
		if(item.id)
			items.push(item);
	}
	return items;
}
Equipment.getOffsetsByCategoryId=function(catId){
	if(catId==='weapons')
		return Equipment.Offsets.Weapons;
	else if(catId==='bows')
		return Equipment.Offsets.Bows;
	else if(catId==='shields')
		return Equipment.Offsets.Shields;

	return null;
}
Equipment.remove=function(index){
	if(typeof index==='object')
		index=Equipment.items.indexOf(index);

	Equipment.items.splice(index, 1);
	for(var i=index; i<Equipment.items.length; i++){
		Equipment.items[i].index--;
	}

	SavegameEditor.writeString64Array(this._offsets.ID, '\0', Equipment.items.length);
}
Equipment.Offsets={ //v1.0 offsets, v1.1=v1.0 + 0x38
	Weapons:{
		ID:				0x000c3b58,
		DURABILITY:		0x0004d1c0,
		MODIFIER:		0x000515bc,
		MODIFIER_VALUE:	0x0004eed4,
		FUSE_ID:		0x000a65d4
	},
	Bows:{
		ID:				0x0007b4e4,
		DURABILITY:		0x0004aab8,
		MODIFIER:		0x0005252c,
		MODIFIER_VALUE:	0x0004cafc
	},
	Shields:{
		ID:				0x000760f0,
		DURABILITY:		0x0004a3b0,
		MODIFIER:		0x00051070,
		MODIFIER_VALUE:	0x0004ba54,
		FUSE_ID:		0x000aa07c
	}
}
Equipment.MODIFIER_NO_BONUS=0xb6eede09;
Equipment.MODIFIER_ATTACK=0xa9384c6c;
Equipment.MODIFIER_ATTACK2=0xdad10617;
Equipment.MODIFIER_DURABILITY=0xd5cad39b;
Equipment.MODIFIER_DURABILITY2=0xb2c943ee;
Equipment.MODIFIER_CRITICAL_HIT=0xd0efac53; //Weapon only
Equipment.MODIFIER_THROW=0x9659c804; //Weapon only
Equipment.MODIFIER_QUICK_SHOT=0x7d505bc4; //Bow only
Equipment.MODIFIER_ARROWX3=0x54535b3c; //Bow only
Equipment.MODIFIER_ARROWX5=0x934069cd; //Bow only
Equipment.MODIFIER_BLOCK=0x37eae30f; //Shield only
Equipment.MODIFIER_BLOCK2=0xb3c94e5; //Shield only

Equipment.DEFAULT_DURABILITY={
	Weapon_Sword_001:20,
	Weapon_Sword_002:23,
	Weapon_Sword_003:27,
	Weapon_Sword_019:5,
	Weapon_Sword_020:5,
	Weapon_Sword_021:6,
	Weapon_Sword_022:5,
	Weapon_Sword_024:35,
	Weapon_Sword_025:27,
	Weapon_Sword_027:27,
	Weapon_Sword_029:14,
	Weapon_Sword_031:27,
	Weapon_Sword_041:26,
	Weapon_Sword_043:8,
	Weapon_Sword_044:4,
	Weapon_Sword_047:12,
	Weapon_Sword_051:18,
	Weapon_Sword_052:60,
	Weapon_Sword_057:45,
	Weapon_Sword_058:27,
	Weapon_Sword_059:20,
	Weapon_Sword_070:40,
	Weapon_Sword_101:15,
	Weapon_Sword_103:12,
	Weapon_Sword_105:16,
	Weapon_Sword_106:16,
	Weapon_Sword_107:17,
	Weapon_Sword_108:24,
	Weapon_Sword_109:14,
	Weapon_Sword_112:17,
	Weapon_Sword_113:18,
	Weapon_Sword_114:16,
	Weapon_Sword_124:20,
	Weapon_Sword_125:17,
	Weapon_Sword_127:20,
	Weapon_Sword_129:10,
	Weapon_Sword_131:18,
	Weapon_Sword_147:10,
	Weapon_Sword_161:14,
	Weapon_Sword_163:16,
	Weapon_Sword_164:18,
	Weapon_Sword_166:15,
	Weapon_Sword_167:4,
	Weapon_Sword_168:12,
	Weapon_Lsword_001:20,
	Weapon_Lsword_002:25,
	Weapon_Lsword_003:30,
	Weapon_Lsword_019:5,
	Weapon_Lsword_020:8,
	Weapon_Lsword_024:40,
	Weapon_Lsword_027:30,
	Weapon_Lsword_029:14,
	Weapon_Lsword_036:30,
	Weapon_Lsword_038:8,
	Weapon_Lsword_041:25,
	Weapon_Lsword_045:6,
	Weapon_Lsword_047:12,
	Weapon_Lsword_051:40,
	Weapon_Lsword_054:40,
	Weapon_Lsword_057:50,
	Weapon_Lsword_059:60,
	Weapon_Lsword_060:35,
	Weapon_Lsword_101:15,
	Weapon_Lsword_103:14,
	Weapon_Lsword_106:16,
	Weapon_Lsword_108:26,
	Weapon_Lsword_109:16,
	Weapon_Lsword_112:17,
	Weapon_Lsword_113:18,
	Weapon_Lsword_114:18,
	Weapon_Lsword_124:20,
	Weapon_Lsword_127:20,
	Weapon_Lsword_129:10,
	Weapon_Lsword_136:18,
	Weapon_Lsword_147:11,
	Weapon_Lsword_161:14,
	Weapon_Lsword_163:16,
	Weapon_Lsword_164:18,
	Weapon_Lsword_166:14,
	Weapon_Lsword_168:14,
	Weapon_Lsword_174:18,
	Weapon_Spear_001:30,
	Weapon_Spear_002:35,
	Weapon_Spear_003:40,
	Weapon_Spear_021:12,
	Weapon_Spear_022:12,
	Weapon_Spear_024:50,
	Weapon_Spear_025:35,
	Weapon_Spear_027:40,
	Weapon_Spear_029:20,
	Weapon_Spear_030:26,
	Weapon_Spear_032:35,
	Weapon_Spear_036:8,
	Weapon_Spear_038:12,
	Weapon_Spear_047:15,
	Weapon_Spear_050:70,
	Weapon_Spear_101:22,
	Weapon_Spear_103:18,
	Weapon_Spear_106:24,
	Weapon_Spear_108:34,
	Weapon_Spear_109:22,
	Weapon_Spear_112:25,
	Weapon_Spear_113:26,
	Weapon_Spear_124:30,
	Weapon_Spear_125:24,
	Weapon_Spear_127:26,
	Weapon_Spear_129:15,
	Weapon_Spear_132:25,
	Weapon_Spear_147:14,
	Weapon_Spear_161:14,
	Weapon_Spear_163:24,
	Weapon_Spear_164:27,
	Weapon_Spear_166:16,
	Weapon_Spear_168:18,
	Weapon_Spear_173:20,

	Weapon_Bow_001:22,
	Weapon_Bow_002:36,
	Weapon_Bow_003:20,
	Weapon_Bow_004:16,
	Weapon_Bow_006:25,
	Weapon_Bow_009:30,
	Weapon_Bow_011:35,
	Weapon_Bow_013:35,
	Weapon_Bow_014:40,
	Weapon_Bow_015:40,
	Weapon_Bow_016:30,
	Weapon_Bow_017:35,
	Weapon_Bow_026:35,
	Weapon_Bow_027:30,
	Weapon_Bow_028:60,
	Weapon_Bow_029:45,
	Weapon_Bow_030:50,
	Weapon_Bow_032:45,
	Weapon_Bow_033:20,
	Weapon_Bow_035:48,
	Weapon_Bow_036:60,
	Weapon_Bow_038:20,
	Weapon_Bow_040:18,
	Weapon_Bow_072:40,
	Weapon_Bow_101:50,
	Weapon_Bow_104:18,
	Weapon_Bow_105:26,
	Weapon_Bow_106:34,
	Weapon_Bow_107:20,
	Weapon_Bow_166:42,

	Weapon_Shield_001:12,
	Weapon_Shield_002:16,
	Weapon_Shield_003:23,
	Weapon_Shield_004:5,
	Weapon_Shield_005:7,
	Weapon_Shield_006:8,
	Weapon_Shield_007:8,
	Weapon_Shield_008:12,
	Weapon_Shield_009:15,
	Weapon_Shield_016:12,
	Weapon_Shield_017:15,
	Weapon_Shield_018:20,
	Weapon_Shield_021:16,
	Weapon_Shield_022:29,
	Weapon_Shield_023:18,
	Weapon_Shield_025:20,
	Weapon_Shield_026:20,
	Weapon_Shield_030:800,
	Weapon_Shield_031:10,
	Weapon_Shield_032:10,
	Weapon_Shield_033:14,
	Weapon_Shield_034:12,
	Weapon_Shield_035:12,
	Weapon_Shield_036:26,
	Weapon_Shield_037:60,
	Weapon_Shield_040:10,
	Weapon_Shield_041:16,
	Weapon_Shield_042:16,
	Weapon_Shield_057:90,
	Weapon_Shield_101:15,
	Weapon_Shield_102:15,
	Weapon_Shield_103:20,
	Weapon_Shield_107:12,
};

Equipment.TRANSLATIONS={
'weapons':{
Weapon_Sword_001:'Traveler\'s Sword',
Weapon_Sword_002:'Soldier\'s Broadsword',
Weapon_Sword_003:'Knight\'s Broadsword',
Weapon_Sword_019:'Bokoblin Arm',
Weapon_Sword_020:'Lizalfos Arm',
Weapon_Sword_021:'Rusty Broadsword',
Weapon_Sword_022:'Soup Ladle',
Weapon_Sword_024:'Royal Broadsword',
Weapon_Sword_025:'Forest Dweller\'s Sword',
Weapon_Sword_027:'Zora Sword',
Weapon_Sword_029:'Gerudo Scimitar',
Weapon_Sword_031:'Feathered Edge',
Weapon_Sword_041:'Eightfold Blade',
Weapon_Sword_043:'Torch',
Weapon_Sword_044:'Tree Branch',
Weapon_Sword_047:'Royal Guard\'s Sword',
Weapon_Sword_051:'Boomerang',
Weapon_Sword_052:'Scimitar of the Seven',
Weapon_Sword_057:'White Sword of the Sky',
Weapon_Sword_058:'Sword of the Hero',
Weapon_Sword_059:'Sea-Breeze Boomerang',
Weapon_Sword_070:'Master Sword',
Weapon_Sword_101:'Zonaite Sword',
Weapon_Sword_103:'Wooden Stick',
Weapon_Sword_105:'Boomerang',
Weapon_Sword_106:'Traveler\'s Sword *',
Weapon_Sword_107:'Lizal Boomerang',
Weapon_Sword_108:'Sturdy Wooden Stick',
Weapon_Sword_109:'Gnarled Wooden Stick',
Weapon_Sword_112:'Soldier\'s Broadsword *',
Weapon_Sword_113:'Knight\'s Broadsword *',
Weapon_Sword_114:'Eightfold Blade *',
Weapon_Sword_124:'Royal Broadsword *',
Weapon_Sword_125:'Forest Dweller\'s Sword *',
Weapon_Sword_127:'Zora Sword *',
Weapon_Sword_129:'Gerudo Scimitar *',
Weapon_Sword_131:'Feathered Edge *',
Weapon_Sword_147:'Royal Guard\'s Sword *',
Weapon_Sword_161:'Magic Rod',
Weapon_Sword_163:'Strong Zonaite Sword',
Weapon_Sword_164:'Mighty Zonaite Sword',
Weapon_Sword_166:'Gloom Sword',
Weapon_Sword_167:'Tree Branch *',
Weapon_Sword_168:'Wooden Stick *',

Weapon_Lsword_001:'Traveler\'s Claymore',
Weapon_Lsword_002:'Soldier\'s Claymore',
Weapon_Lsword_003:'Knight\'s Claymore',
Weapon_Lsword_019:'Moblin Arm',
Weapon_Lsword_020:'Rusty Claymore',
Weapon_Lsword_024:'Royal Claymore',
Weapon_Lsword_027:'Zora Longsword',
Weapon_Lsword_029:'Gerudo Claymore',
Weapon_Lsword_036:'Cobble Crusher',
Weapon_Lsword_038:'Boat Oar',
Weapon_Lsword_041:'Eightfold Longblade',
Weapon_Lsword_045:'Farming Hoe',
Weapon_Lsword_047:'Royal Guard\'s Claymore',
Weapon_Lsword_051:'Giant Boomerang',
Weapon_Lsword_054:'Boulder Breaker',
Weapon_Lsword_057:'Dusk Claymore',
Weapon_Lsword_059:'Biggoron\'s Sword',
Weapon_Lsword_060:'Fierce Deity Sword',
Weapon_Lsword_101:'Zonaite Longsword',
Weapon_Lsword_103:'Thick Stick',
Weapon_Lsword_106:'Traveler\'s Claymore *',
Weapon_Lsword_108:'Sturdy Thick Stick',
Weapon_Lsword_109:'Gnarled Thick Stick',
Weapon_Lsword_112:'Soldier\'s Claymore *',
Weapon_Lsword_113:'Knight\'s Claymore *',
Weapon_Lsword_114:'Eightfold Longblade *',
Weapon_Lsword_124:'Royal Claymore *',
Weapon_Lsword_127:'Zora Longsword *',
Weapon_Lsword_129:'Gerudo Claymore *',
Weapon_Lsword_136:'Cobble Crusher *',
Weapon_Lsword_147:'Royal Guard\'s Claymore *',
Weapon_Lsword_161:'Magic Scepter',
Weapon_Lsword_163:'Strong Zonaite Longsword',
Weapon_Lsword_164:'Mighty Zonaite Longsword',
Weapon_Lsword_166:'Gloom Club',
Weapon_Lsword_168:'Thick Stick *',
Weapon_Lsword_174:'Giant Boomerang *',

Weapon_Spear_001:'Traveler\'s Spear',
Weapon_Spear_002:'Soldier\'s Spear',
Weapon_Spear_003:'Knight\'s Halberd',
Weapon_Spear_021:'Rusty Halberd',
Weapon_Spear_022:'Farmer\'s Pitchfork',
Weapon_Spear_024:'Royal Halberd',
Weapon_Spear_025:'Forest Dweller\'s Spear',
Weapon_Spear_027:'Zora Spear',
Weapon_Spear_029:'Gerudo Spear',
Weapon_Spear_030:'Throwing Spear',
Weapon_Spear_032:'Feathered Spear',
Weapon_Spear_036:'Wooden Mop',
Weapon_Spear_038:'Fishing Harpoon',
Weapon_Spear_047:'Royal Guard\'s Spear',
Weapon_Spear_050:'Lightscale Trident',
Weapon_Spear_101:'Zonaite Spear',
Weapon_Spear_103:'Long Stick',
Weapon_Spear_106:'Traveler\'s Spear *',
Weapon_Spear_108:'Sturdy Long Stick',
Weapon_Spear_109:'Gnarled Long Stick',
Weapon_Spear_112:'Soldier\'s Spear *',
Weapon_Spear_113:'Knight\'s Halberd *',
Weapon_Spear_124:'Royal Halberd *',
Weapon_Spear_125:'Forest Dweller\'s Spear *',
Weapon_Spear_127:'Zora Spear *',
Weapon_Spear_129:'Gerudo Spear *',
Weapon_Spear_132:'Feathered Spear *',
Weapon_Spear_147:'Royal Guard\'s Spear *',
Weapon_Spear_161:'Magic Staff',
Weapon_Spear_163:'Strong Zonaite Spear',
Weapon_Spear_164:'Mighty Zonaite Spear',
Weapon_Spear_166:'Gloom Spear',
Weapon_Spear_168:'Long Stick *',
Weapon_Spear_173:'Throwing Spear *'
},

'bows':{
Weapon_Bow_001:'Traveler\'s Bow',
Weapon_Bow_002:'Soldier\'s Bow',
Weapon_Bow_003:'Spiked Boko Bow',
Weapon_Bow_004:'Boko Bow',
Weapon_Bow_006:'Lizal Bow',
Weapon_Bow_009:'Lynel Bow',
Weapon_Bow_011:'Strengthened Lizal Bow',
Weapon_Bow_013:'Forest Dweller\'s Bow',
Weapon_Bow_014:'Zora Bow',
Weapon_Bow_015:'Gerudo Bow',
Weapon_Bow_016:'Swallow Bow',
Weapon_Bow_017:'Falcon Bow',
Weapon_Bow_026:'Mighty Lynel Bow',
Weapon_Bow_027:'Dragonbone Boko Bow',
Weapon_Bow_028:'Great Eagle Bow',
Weapon_Bow_029:'Phrenic Bow',
Weapon_Bow_030:'Steel Lizal Bow',
Weapon_Bow_032:'Savage Lynel Bow',
Weapon_Bow_033:'Royal Guard\'s Bow',
Weapon_Bow_035:'Knight\'s Bow',
Weapon_Bow_036:'Royal Bow',
Weapon_Bow_038:'Wooden Bow',
Weapon_Bow_040:'Duplex Bow',
Weapon_Bow_072:'Dusk Bow',
Weapon_Bow_101:'Zonaite Bow',
Weapon_Bow_104:'Construct Bow',
Weapon_Bow_105:'Strong Construct Bow',
Weapon_Bow_106:'Mighty Construct Bow',
Weapon_Bow_107:'Old Wooden Bow',
Weapon_Bow_166:'Demon King\'s Bow'
},

'shields':{
Weapon_Shield_001:'Wooden Shield',
Weapon_Shield_002:'Soldier\'s Shield',
Weapon_Shield_003:'Knight\'s Shield',
Weapon_Shield_004:'Boko Shield',
Weapon_Shield_005:'Spiked Boko Shield',
Weapon_Shield_006:'Dragonbone Boko Shield',
Weapon_Shield_007:'Lizal Shield',
Weapon_Shield_008:'Reinforced Lizal Shield',
Weapon_Shield_009:'Steel Lizal Shield',
Weapon_Shield_016:'Lynel Shield',
Weapon_Shield_017:'Mighty Lynel Shield',
Weapon_Shield_018:'Savage Lynel Shield',
Weapon_Shield_021:'Rusty Shield',
Weapon_Shield_022:'Royal Shield',
Weapon_Shield_023:'Forest Dweller\'s Shield',
Weapon_Shield_025:'Zora Shield',
Weapon_Shield_026:'Gerudo Shield',
Weapon_Shield_030:'Hylian Shield',
Weapon_Shield_031:'Hunter\'s Shield',
Weapon_Shield_032:'Fisherman\'s Shield',
Weapon_Shield_033:'Royal Guard\'s Shield',
Weapon_Shield_034:'Emblazoned Shield',
Weapon_Shield_035:'Traveler\'s Shield',
Weapon_Shield_036:'Radiant Shield',
Weapon_Shield_037:'Daybreaker',
Weapon_Shield_040:'Pot Lid',
Weapon_Shield_041:'Shield of the Mind\'s Eye',
Weapon_Shield_042:'Kite Shield',
Weapon_Shield_057:'Sea-Breeze Shield',
Weapon_Shield_101:'Zonaite Shield',
Weapon_Shield_102:'Strong Zonaite Shield',
Weapon_Shield_103:'Mighty Zonaite Shield',
Weapon_Shield_107:'Old Wooden Shield'
}
};