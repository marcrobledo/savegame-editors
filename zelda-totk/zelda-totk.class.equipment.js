/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Equipment class) v20230521

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Equipment(catId, index, id, durability, modifier, modifierValue, fuseId){ //Weapon, Bow or Shield
	this.category=catId;
	this.index=index;

	this.id=id;
	this.durability=durability || 70;
	this.modifier=modifier || Equipment.MODIFIER_NO_BONUS;
	this.modifierValue=modifierValue || 0;
	if(this.isFusable()){
		this.fuseId=fuseId || '';
		if(this.fuseId && Equipment.FUSABLE_WITH.indexOf(this.fuseId)===-1){
			console.warn('unknown fusable item['+catId+','+index+']: '+this.fuseId);
		}
	}

	Equipment.buildHtmlElements(this);
}
Equipment.prototype.getItemTranslation=function(){
	return Equipment.TRANSLATIONS[this.category][this.id] || this.id;
}
Equipment.prototype.isFusable=function(){
	return (this.category==='weapons' || this.category==='shields')
}
Equipment.prototype.getFusableTranslation=function(){
	if(!this.fuseId)
		return null;
	//to-do
}
Equipment.prototype.restoreDurability=function(){
	this.durability=this.getMaximumDurability();
	this._htmlInputDurability.value=this.durability;
}
Equipment.prototype.getMaximumDurability=function(){
	var defaultDurability=Equipment.DEFAULT_DURABILITY[this.id] || 70;
	if(this.modifier===Equipment.MODIFIER_DURABILITY || this.modifier===Equipment.MODIFIER_DURABILITY2) //Durability ↑/↑↑
		return defaultDurability + this.modifierValue;
	return defaultDurability;
}
Equipment.prototype.copy=function(index, newId){
	return new Equipment(
		this.category,
		index,
		typeof newId==='string'? newId : this.id,
		this.durability,
		this.modifier,
		this.modifierValue,
		this.isFusable()? this.fuseId : null
	);
}
Equipment.prototype.save=function(){
	var categoryHash=capitalizeCategoryId(this.category);
	SavegameEditor.writeString64('Array'+categoryHash+'Ids', this.index, this.id);
	SavegameEditor.writeU32('Array'+categoryHash+'Durabilities', this.index, this.durability);
	SavegameEditor.writeU32('Array'+categoryHash+'Modifiers', this.index, this.modifier);
	SavegameEditor.writeU32('Array'+categoryHash+'ModifierValues', this.index, this.modifierValue);

	/*if(this.isFusable())
		SavegameEditor.writeString64('ArrayWeaponFuseIds', this.index, this.fuseId);*/
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
			item.modifierValue=0;
			item._htmlInputModifierValue.value=0;
			item.restoreDurability();
		}else if(fromNoBonus || fromModifierDurability){
			if(fromNoBonus && (item.modifier===Equipment.MODIFIER_DURABILITY || item.modifier===Equipment.MODIFIER_DURABILITY2)){
				item.modifierValue=2100000000;
				item._htmlInputModifierValue.value=2100000000;
			}
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
	
	if(item.isFusable()){
	}
}

Equipment.readAll=function(catId){
	var categoryHash=capitalizeCategoryId(catId);
	var equipmentIds=SavegameEditor.readString64Array('Array'+categoryHash+'Ids');
	var isFusable=(catId==='weapons' || catId==='shields');
	var validEquipment=[];
	for(var i=0; i<equipmentIds.length; i++){
		if(equipmentIds[i]){
			validEquipment.push(new Equipment(
				catId,
				i,
				equipmentIds[i],
				SavegameEditor.readU32('Array'+categoryHash+'Durabilities', i),
				SavegameEditor.readU32('Array'+categoryHash+'Modifiers', i),
				SavegameEditor.readU32('Array'+categoryHash+'ModifierValues', i),
				isFusable? SavegameEditor.readString64('Array'+categoryHash+'FuseIds', i) : null
			));
		}
	}
	return validEquipment;
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
	Weapon_Sword_077:30,

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
Weapon_Sword_106:'Traveler\'s Sword (decayed)',
Weapon_Sword_107:'Lizal Boomerang',
Weapon_Sword_108:'Sturdy Wooden Stick',
Weapon_Sword_109:'Gnarled Wooden Stick',
Weapon_Sword_112:'Soldier\'s Broadsword (decayed)',
Weapon_Sword_113:'Knight\'s Broadsword (decayed)',
Weapon_Sword_114:'Eightfold Blade (decayed)',
Weapon_Sword_124:'Royal Broadsword (decayed)',
Weapon_Sword_125:'Forest Dweller\'s Sword (decayed)',
Weapon_Sword_127:'Zora Sword (decayed)',
Weapon_Sword_129:'Gerudo Scimitar (decayed)',
Weapon_Sword_131:'Feathered Edge (decayed)',
Weapon_Sword_147:'Royal Guard\'s Sword (decayed)',
Weapon_Sword_161:'Magic Rod',
Weapon_Sword_163:'Strong Zonaite Sword',
Weapon_Sword_164:'Mighty Zonaite Sword',
Weapon_Sword_166:'Gloom Sword',
Weapon_Sword_167:'Tree Branch (sky)',
Weapon_Sword_168:'Wooden Stick (decayed)',
Weapon_Sword_077:'Master Sword (glitched)',

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
Weapon_Lsword_106:'Traveler\'s Claymore (decayed)',
Weapon_Lsword_108:'Sturdy Thick Stick',
Weapon_Lsword_109:'Gnarled Thick Stick',
Weapon_Lsword_112:'Soldier\'s Claymore (decayed)',
Weapon_Lsword_113:'Knight\'s Claymore (decayed)',
Weapon_Lsword_114:'Eightfold Longblade (decayed)',
Weapon_Lsword_124:'Royal Claymore (decayed)',
Weapon_Lsword_127:'Zora Longsword (decayed)',
Weapon_Lsword_129:'Gerudo Claymore (decayed)',
Weapon_Lsword_136:'Cobble Crusher (decayed)',
Weapon_Lsword_147:'Royal Guard\'s Claymore (decayed)',
Weapon_Lsword_161:'Magic Scepter',
Weapon_Lsword_163:'Strong Zonaite Longsword',
Weapon_Lsword_164:'Mighty Zonaite Longsword',
Weapon_Lsword_166:'Gloom Club',
Weapon_Lsword_168:'Thick Stick (decayed)',
Weapon_Lsword_174:'Giant Boomerang (decayed)',

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
Weapon_Spear_106:'Traveler\'s Spear (decayed)',
Weapon_Spear_108:'Sturdy Long Stick',
Weapon_Spear_109:'Gnarled Long Stick',
Weapon_Spear_112:'Soldier\'s Spear (decayed)',
Weapon_Spear_113:'Knight\'s Halberd (decayed)',
Weapon_Spear_124:'Royal Halberd (decayed)',
Weapon_Spear_125:'Forest Dweller\'s Spear (decayed)',
Weapon_Spear_127:'Zora Spear (decayed)',
Weapon_Spear_129:'Gerudo Spear (decayed)',
Weapon_Spear_132:'Feathered Spear (decayed)',
Weapon_Spear_147:'Royal Guard\'s Spear (decayed)',
Weapon_Spear_161:'Magic Staff',
Weapon_Spear_163:'Strong Zonaite Spear',
Weapon_Spear_164:'Mighty Zonaite Spear',
Weapon_Spear_166:'Gloom Spear',
Weapon_Spear_168:'Long Stick (decayed)',
Weapon_Spear_173:'Throwing Spear (decayed)'
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

Equipment.TRANSLATIONS_FUSE_ONLY={
}

Equipment.FUSABLE_WITH=[
'AsbObj_RockParts_C_S_01',
'AsbObj_SharpRock_A_S_01',
'AsbObj_WhiteWoodRectangle_A_LL_01',
'Barrel_SkyObj',
'DgnObj_BoardIron_E',
'DgnObj_SpikeBallWood_A',
'IceWall_Piece',
'Item_Enemy_106',
'Item_Enemy_109',
'Item_Enemy_134',
'Item_Enemy_137',
'Item_Enemy_138',
'Item_Enemy_139',
'Item_Enemy_141',
'Item_Enemy_142',
'Item_Enemy_149',
'Item_Enemy_150',
'Item_Enemy_151',
'Item_Enemy_153',
'Item_Enemy_166',
'Item_Enemy_168',
'Item_Enemy_192',
'Item_Enemy_193',
'Item_Enemy_225',
'Item_Enemy_227',
'Item_Enemy_58',
'Item_Enemy_59',
'Item_Enemy_60',
'Item_Enemy_77',
'Item_Ore_B',
'Item_Ore_C',
'Item_Ore_D',
'Obj_GerudoHoleCover_A_03',
'Obj_LiftRockWhite_A_01',
'Obj_SpikeBall_B',
'SpObj_Cannon_A_01',
'SpObj_ElectricBoxGenerator',
'SpObj_FlameThrower_A_01',
'SpObj_SlipBoard_A_01',
'SpObj_SpringPiston_A_01',
'Weapon_Bow_036',
'Weapon_Lsword_041',
'Weapon_Shield_002',
'Weapon_Shield_006',
'Weapon_Shield_103',
'Weapon_Sword_019',
'Weapon_Sword_101',
'Weapon_Sword_112',
'Weapon_Sword_124'
];