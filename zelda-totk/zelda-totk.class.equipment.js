/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Equipment class) v20230604

	by Marc Robledo 2023
	research and item names compiled by Echocolat, Exincracci, HylianLZ, Karlos007 and ApacheThunder
*/

function Equipment(catId, index, id, durability, modifier, modifierValue, fuseId){ //Weapon, Bow or Shield
	this.category=catId;
	this.index=index;
	this.removable=false;

	this.id=id;
	this.durability=durability || 70;
	this.modifier=modifier || Equipment.MODIFIER_NO_BONUS;
	this.modifierValue=modifierValue || 0;
	if(this.isFusable()){
		this.fuseId=fuseId || '';
	}

	Equipment.buildHtmlElements(this);
}
Equipment.prototype.getItemTranslation=function(){
	if(Locale._(this.id))
		return Locale._(this.id);
	return Equipment.TRANSLATIONS[this.category][this.id] || this.id;
}
Equipment.prototype.isFusable=function(){
	return (this.category==='weapons' || this.category==='shields')
}
Equipment.prototype.fixValues=function(){
	this._htmlInputDurability.maxValue=this.getMaximumDurability();
}
Equipment.prototype.restoreDurability=function(){
	this.durability=this.getMaximumDurability();
	this._htmlInputDurability.value=this.durability;
}
Equipment.prototype.getMaximumDurability=function(){
	var defaultDurability=Equipment.DEFAULT_DURABILITY[this.id] || 70;
	if(this.isFusable() && this.fuseId){
		if(Equipment.DEFAULT_DURABILITY[this.fuseId]){
			defaultDurability+=Equipment.DEFAULT_DURABILITY[this.fuseId];
		}else{
			defaultDurability+=25;
		}
	}

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

	if(this.isFusable())
		SavegameEditor.writeString64('Array'+categoryHash+'FuseIds', this.index, this.fuseId);
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

		item.fixValues();

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

	//build html elements
	if(item.isFusable()){
		item._htmlSelectFusion=select('item-fusion-'+item.category+'-'+item.index, Equipment.FUSABLE_ITEMS, function(){
			item.fuseId=this.value;
			item.restoreDurability();
			item.fixValues();
		}, item.fuseId);
		item._htmlSelectFusion.title='Fusion';
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
	Npc_Zelda_Torch:8,

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

Npc_Zelda_Torch:'*Zelda\'s intro torch (unused)',

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

Equipment.FUSABLE_ITEMS=[
{value:'',name:'No fusion'}
];


Equipment.KNOWN_FUSABLE_MATERIALS=[
	'Item_Enemy_137',
	'Item_Enemy_138',
	'Item_Enemy_139',
	'Item_Enemy_140',
	'Item_Enemy_141',
	'Item_Enemy_220',
	'Item_Enemy_221',
	'Item_Enemy_223',
	'Item_Enemy_225',
	'Item_Enemy_226',
	'Item_Enemy_227'
];
Equipment.KNOWN_FUSABLE_OBJECTS=[
	'AsbObj_Assassin_BaloonkeyPlate_01',
	'AsbObj_Assassin_Raft_01',
	'AsbObj_BoneStick_A_01',
	'AsbObj_HyliaWoodRuinShelter_Wood_B_01',
	'AsbObj_HyliaWoodRuinShelter_Wood_C_01',
	'AsbObj_HyliaWoodRuinShelter_Wood_C_02',
	'AsbObj_Icicle_A_01',
	'AsbObj_Icicle_A_02',
	'AsbObj_MetalPole_A_LL_01',
	'AsbObj_MetalRectangle_A_LL_01',
	'AsbObj_MetalRectangle_A_M_01',
	'AsbObj_MetalSquare_A_M_01',
	'AsbObj_RockParts_C_L_01',
	'AsbObj_RockParts_C_S_01',
	'AsbObj_RockParts_C_S_05',
	'AsbObj_RopewayArm_A_01',
	'AsbObj_RopewayArm_A_03',
	'AsbObj_SharpRock_A_S_01',
	'AsbObj_SpikeDynamic_A_01',
	'AsbObj_StoneLightSquare_A_M_01',
	'AsbObj_StoneLightSquare_A_M_02',
	'AsbObj_StoneRectangle_B_LL_01',
	'AsbObj_StoneRectangle_B_LL_02',
	'AsbObj_StoneRectangle_B_LL_03',
	'AsbObj_StoneRectangle_B_M_01',
	'AsbObj_StoneSquare_B_M_01',
	'AsbObj_WhiteWoodRectangle_A_LL_01',
	'AsbObj_WhiteWoodRectangle_A_M_01',
	'AsbObj_WhiteWoodSquare_A_M_01',
	'AsbObj_WhiteWoodStick_A_LL_01',
	'AsbObj_WoodRectangle_A_LL_01',
	'AsbObj_WoodRectangle_A_M_01',
	'AsbObj_WoodRectangle_QuickSand_A_LL_01',
	'AsbObj_WoodSail_A_01',
	'AsbObj_WoodSail_A_01_ForAttachment',
	'AsbObj_WoodSail_A_02',
	'AsbObj_WoodSail_A_02_ForAttachment',
	'AsbObj_WoodSquare_A_M_01',
	'AsbObj_WoodSquare_A_M_01_WellCover',
	'AsbObj_WoodSquare_QuickSand_A_M_01',
	'AsbObj_WoodStableHostelShed_A_01',
	'AsbObj_WoodStick_A_LL_01',
	'AsbObj_WoodWheel_A_01',
	'Barrel',
	'BarrelBomb',
	'BarrelBomb2',
	'BarrelBomb3',
	'Barrel_CDungeon',
	'Barrel_SkyObj',
	'Barrel_SkyObjOld_A_01',
	'BrokenSnowBall',
	'BrokenSnowBallForAttachmentLarge',
	'BrokenSnowBallForAttachmentSmall',
	'BrokenSnowBallForDrake',
	'Cave_LanayruMountain_0008_StoneBall',
	'DgnObj_BoardFloat_A',
	'DgnObj_BoardIron_A',
	'DgnObj_BoardIron_E',
	'DgnObj_BoardIron_E_Cart',
	'DgnObj_BoardIron_E_Cart_02',
	'DgnObj_BoardLight_A',
	'DgnObj_BoardStone_A',
	'DgnObj_BoardStone_B',
	'DgnObj_BoardWood_A',
	'DgnObj_BoxNet_A',
	'DgnObj_BoxStone_A',
	'DgnObj_Candle',
	'DgnObj_Dish_A_01',
	'DgnObj_ElectricBoxStone_A_02',
	'DgnObj_ElectricPot_A_LL_Act_01',
	'DgnObj_ElectricStoneBoard_A_01',
	'DgnObj_ElectricStoneBoard_A_02',
	'DgnObj_ElectricSwitchCapstan_A_02',
	'DgnObj_Fire_Train_A_01',
	'DgnObj_FloatingWater_A_01',
	'DgnObj_FloatingWater_A_01_ForAttachment',
	'DgnObj_FloatingWater_A_02',
	'DgnObj_FloatingWater_A_02_ForAttachment',
	'DgnObj_Float_A_01',
	'DgnObj_IceBlock',
	'DgnObj_LargeDungeonWind_Debris_A_01',
	'DgnObj_LargeDungeonWind_Grate_A_01',
	'DgnObj_MetalBarrel_A',
	'DgnObj_Motor_A_01',
	'DgnObj_PropellerAndWind',
	'DgnObj_SecretBox_A',
	'DgnObj_SeesawExtend_A',
	'DgnObj_Small_BarrelBomb_A_01',
	'DgnObj_Small_BarrelBomb_A_02',
	'DgnObj_Small_BoardIron_A_04',
	'DgnObj_Small_BoardNet_A_02',
	'DgnObj_Small_BoardNet_A_04',
	'DgnObj_Small_BoardNet_A_05',
	'DgnObj_Small_BoardStone_A_02',
	'DgnObj_Small_BoardStone_A_03',
	'DgnObj_Small_BoardStone_A_04',
	'DgnObj_Small_BoardStone_A_06',
	'DgnObj_Small_BoardStone_A_07',
	'DgnObj_Small_BoardWood_B_02',
	'DgnObj_Small_BoardWood_B_03',
	'DgnObj_Small_BoardWood_B_04',
	'DgnObj_Small_BoardWood_B_05',
	'DgnObj_Small_BoxIron_B_03',
	'DgnObj_Small_BoxIron_B_04',
	'DgnObj_Small_BoxIron_B_06',
	'DgnObj_Small_BoxStone_A_02',
	'DgnObj_Small_BoxStone_A_03',
	'DgnObj_Small_BoxStone_A_04',
	'DgnObj_Small_BoxWood_A_02',
	'DgnObj_Small_floatFortParts_A_01',
	'DgnObj_Small_floatFortParts_A_02',
	'DgnObj_Small_floatFortParts_A_03',
	'DgnObj_Small_floatFortParts_A_04',
	'DgnObj_Small_Grate_A_01',
	'DgnObj_Small_IronBall_02',
	'DgnObj_Small_IronBall_03',
	'DgnObj_Small_IronBall_04',
	'DgnObj_Small_IronBall_05',
	'DgnObj_Small_IronStick_A_01',
	'DgnObj_Small_Lift_A_01',
	'DgnObj_Small_PuzzleBlock_A_01',
	'DgnObj_Small_PuzzleBlock_A_02',
	'DgnObj_Small_PuzzleBlock_A_03',
	'DgnObj_Small_PuzzleRing_A_01',
	'DgnObj_Small_PuzzleRing_B_01',
	'DgnObj_Small_RaftWood_A_01',
	'DgnObj_Small_SpikeDynamic_A_01',
	'DgnObj_Small_StoneBallL_02',
	'DgnObj_Small_StonePole_A_01',
	'DgnObj_Small_StonePole_A_02',
	'DgnObj_Small_StonePole_A_03',
	'DgnObj_Small_WaterWheel_A_02',
	'DgnObj_Small_WoodPole_A_02',
	'DgnObj_SpikeBallWood_A',
	'DgnObj_SpikeBall_A',
	'DgnObj_SpikeBall_B',
	'DgnObj_StoneBall_Fire',
	'DgnObj_StoneBall_NoFire',
	'DgnObj_StoneBarrel_A',
	'DgnObj_SwitchElectric_Dynamic',
	'DgnObj_Train_A_01',
	'DgnObj_Train_A_02',
	'DgnObj_WoodPole_A',
	'Drake_Icicle',
	'Drake_IcicleForAttachment',
	'DungeonBoss_Goron_Rock_Weapon',
	'DungeonBoss_Goron_Rock_Weapon_Large',
	'FldObj_DeathMtArtifactTrain_A_02',
	'FldObj_DeathMtArtifactTrain_A_03',
	'FldObj_DeathMtArtifactTrain_A_03_BP',
	'FldObj_DeathMtArtifactTrain_B_01',
	'FldObj_DeathMtArtifactTrain_B_01_MiniGame',
	'FldObj_DeathMtArtifactTrain_B_02',
	'FldObj_DeathMtArtifactTrain_B_02_BP',
	'FldObj_EnemyLookoutBanana_A_01_Trunk',
	'FldObj_FallingRock_A_01',
	'FldObj_FallingRock_A_02',
	'FldObj_FallingRock_B_01',
	'FldObj_FallingRock_B_02',
	'FldObj_PushRockIron_A_M_01',
	'FldObj_PushRock_A_M_01',
	'FldObj_ScaffoldWood_A_03_Trunk',
	'FldObj_SignboardWood_A_01_Trunk',
	'FldObj_SignboardWood_A_02_Trunk',
	'FldObj_ZonauFallingParts_B_Block_Fall_A_01',
	'IceWall_Piece',
	'IronBall',
	'IronBall_Light',
	'KibakoDesert_Contain_01',
	'KibakoDungeon',
	'KibakoGerudo_Contain_01',
	'KibakoJungle_Contain_01',
	'KibakoSeaside_Contain_01',
	'KibakoSky_Contain_01',
	'KibakoSnowMountain_Contain_01',
	'KibakoVolcano_Contain_01',
	'KibakoZora_Contain_01',
	'Kibako_Contain_01',
	'Kibako_Contain_01_NoRespawn',
	'LikeLikeRock',
	'LikeLikeRock_ForAttachment',
	'MiniGame_Basketball_Ball',
	'MiniGame_Basketball_Ball_HighScore',
	'MinusObj_TreeGeneralleaf_A_01_Treant_ForAttachment',
	'MinusObj_TreeGeneralleaf_A_01_Trent_Trunk',
	'MinusObj_TreeGeneralleaf_A_01_Trunk',
	'MinusObj_TreeGeneralleaf_A_01_Trunk_Aligned',
	'MinusObj_TreeGeneralleaf_B_01_Trunk',
	'MinusObj_TreeGeneralleaf_B_01_Trunk_Aligned',
	'MinusObj_TreeGeneralleaf_C_01_Trunk',
	'MinusObj_TreeGeneralleaf_C_01_Trunk_Aligned',
	'MinusObj_TreeGeneralleaf_D_01_Trunk',
	'MinusObj_TreeGeneralleaf_D_01_Trunk_Aligned',
	'MinusObj_UDSpot_StoneBoard_B_01',
	'Obj_ArmorSpike_A',
	'Obj_ArmorSpike_B',
	'Obj_BarrelOld_A_01',
	'Obj_BoardIron_A_01',
	'Obj_BoxIron_A_M_01',
	'Obj_BoxIron_B_2x2x2_01',
	'Obj_BoxIron_B_M_01',
	'Obj_BoxIron_MtDeath',
	'Obj_BreakBoxIron',
	'Obj_CageIron_A_01',
	'Obj_DesertRuinTomb_A_01',
	'Obj_EnemyLookoutBanana_A_01_ForAttachment',
	'Obj_FallFloor_A_01',
	'Obj_FallFloor_A_02',
	'Obj_FallFloor_A_03',
	'Obj_FallFloor_A_04',
	'Obj_FallFloor_A_05',
	'Obj_FallFloor_A_06',
	'Obj_FallFloor_A_07',
	'Obj_FallFloor_A_10',
	'Obj_FallFloor_A_11',
	'Obj_FallFloor_A_12',
	'Obj_FallFloor_A_13',
	'Obj_FallFloor_A_14',
	'Obj_FallFloor_A_15',
	'Obj_FallFloor_HyruleCastle_A_01',
	'Obj_FallFloor_HyruleCastle_A_02',
	'Obj_FallFloor_HyruleCastle_A_03',
	'Obj_FallFloor_HyruleCastle_A_04',
	'Obj_FallFloor_HyruleCastle_B_02',
	'Obj_FreezeBoard_A_01',
	'Obj_FreezeBoard_A_02',
	'Obj_GerudoHoleCover_A_01',
	'Obj_GerudoHoleCover_A_02',
	'Obj_GerudoHoleCover_A_03',
	'Obj_HardLavaBlock_A_01',
	'Obj_HardLavaBlock_A_02',
	'Obj_LiftRockEldin_A_01',
	'Obj_LiftRockEldin_Korok_A_01',
	'Obj_LiftRockGerudo_A_01',
	'Obj_LiftRockGerudo_Korok_A_01',
	'Obj_LiftRockWhite_A_01',
	'Obj_LiftRockWhite_Korok_A_01',
	'Obj_MeatRock',
	'Obj_MeatRock_Miasma_A_01',
	'Obj_ScaffoldWood_A_01_ForAttachment',
	'Obj_SheikerWakkaCharm_A_01',
	'Obj_SheikerWakkaCharm_A_02',
	'Obj_SheikerWakkaCharm_A_03',
	'Obj_ShieldFenceWood_A_M_01',
	'Obj_ShieldFenceWood_A_M_02',
	'Obj_ShieldFenceWood_A_M_03',
	'Obj_SkyFallenBox_A_01',
	'Obj_SkyFallenBox_A_02',
	'Obj_SkyFallenBox_A_03',
	'Obj_SpikeBall_B',
	'Obj_SpikeBall_B_Mercenary',
	'Obj_TreeApple_A_L_01_Trunk',
	'Obj_TreeApple_A_L_01_Trunk_Aligned',
	'Obj_TreeApple_A_M_01_Treant_Trunk',
	'Obj_TreeApple_A_M_01_Trunk',
	'Obj_TreeBanana_A_01_Trunk',
	'Obj_TreeBroadleafDead_B_L_01_Trunk',
	'Obj_TreeBroadleaf_A_L_Treant_Trunk',
	'Obj_TreeBroadleaf_A_L_Trunk',
	'Obj_TreeBroadleaf_A_L_Trunk_Aligned',
	'Obj_TreeBurned_A_01_Trunk',
	'Obj_TreeBurned_A_01_Trunk_Aligned',
	'Obj_TreeBurned_B_01_Trunk',
	'Obj_TreeBurned_B_02_Trunk',
	'Obj_TreeConiferousDead_A_01_Trunk',
	'Obj_TreeConiferousDead_A_01_Trunk_Aligned',
	'Obj_TreeConiferousDead_A_02_Trunk',
	'Obj_TreeConiferousDead_A_Snow_01_Trunk',
	'Obj_TreeConiferousDead_A_Snow_01_Trunk_Aligned',
	'Obj_TreeConiferous_A_01_ForAttachment',
	'Obj_TreeConiferous_A_01_Trunk',
	'Obj_TreeConiferous_A_01_Trunk_Aligned',
	'Obj_TreeConiferous_A_02_Trunk',
	'Obj_TreeConiferous_A_03_Trunk',
	'Obj_TreeConiferous_A_Snow_01_Trunk',
	'Obj_TreeConiferous_A_Snow_01_Trunk_Aligned',
	'Obj_TreeConiferous_A_Snow_02_Trunk',
	'Obj_TreeConiferous_A_Snow_03_Trunk',
	'Obj_TreeConiferous_C_01_Trunk',
	'Obj_TreeConiferous_C_01_Trunk_Aligned',
	'Obj_TreeConiferous_C_02_Trunk',
	'Obj_TreeConiferous_C_03_Trunk',
	'Obj_TreeDeadLeaf_A_01_Trunk',
	'Obj_TreeDead_A_01_Trunk',
	'Obj_TreeDead_A_Snow_01_Trunk',
	'Obj_TreeDragonblood_A_03_Trunk',
	'Obj_TreeGeneralleaf_C_01_ForAttachment',
	'Obj_TreeGeneralleaf_D_01_ForAttachment',
	'Obj_TreeGhost_A_03_Trunk',
	'Obj_TreeMaple_A_01_ForAttachment',
	'Obj_TreeMaple_A_01_Trunk',
	'Obj_TreeMaple_A_01_Trunk_Aligned',
	'Obj_TreeMaple_A_02_Trunk',
	'Obj_TreeMaple_B_01_Trunk',
	'Obj_TreeMaple_B_02_Trunk',
	'Obj_TreeMaple_C_01_Trunk',
	'Obj_TreeMaple_C_02_Trunk',
	'Obj_TreePalmBeach_A_01_ForAttachment',
	'Obj_TreePalmBeach_A_01_Trunk',
	'Obj_TreePalmBeach_A_01_Trunk_Aligned',
	'Obj_TreePalmBeach_A_02_Trunk',
	'Obj_TreePalm_A_01_Trunk',
	'Obj_TreePalm_A_02_Trunk',
	'Obj_TreePine_A_01_Trunk',
	'Obj_TreeSkyApple_A_L_01_Trunk',
	'Obj_TreeSkyApple_A_L_01_Trunk_Aligned',
	'Obj_TreeSkyApple_A_M_01_Trunk',
	'Obj_TreeSkyBroadleaf_A_L_Trunk',
	'Obj_TreeSkyBroadleaf_A_L_Trunk_Aligned',
	'Obj_TreeSkyBroadleaf_A_L_Trunk_NoDamage',
	'Obj_TreeSkyDead_A_Snow_01_Trunk',
	'Obj_TreeWhiteBirch_A_01_ForAttachment',
	'Obj_TreeWhiteBirch_A_01_Trunk',
	'Obj_TreeWhiteBirch_A_01_Trunk_Aligned',
	'Obj_TreeWhiteBirch_A_02_Trunk',
	'Obj_TreeWhiteBirch_A_03_Trunk',
	'Obj_TreeWhiteBirch_A_04_Trunk',
	'Obj_TreeWhiteWood_A_01_ForAttachment',
	'Obj_TreeWillow_A_01_ForAttachment',
	'Obj_TreeWillow_A_01_Trunk',
	'Obj_TreeWood_A_01_ForAttachment',
	'Obj_TreeWood_A_L_Treant_ForAttachment',
	'Obj_Tumbleweed_A_01',
	'Obj_Village_IchikaraEnokidaCutout_A_01',
	'Obj_Village_IchikaraEnokidaCutout_A_02',
	'Pot',
	'RockBall',
	'RockRollA',
	'SkyObj_Pot_A_M_Act_01',
	'SkyObj_Pot_A_S_Act_01',
	'SkyObj_Remains_Block_Fall_A_01',
	'SkyObj_Rito_Block_Fall_A_01',
	'SpObj_BalloonEnvelope_A_01',
	'SpObj_BalloonEnvelope_A_05',
	'SpObj_BalloonEnvelope_A_06',
	'SpObj_BalloonEnvelope_Capsule_A_01',
	'SpObj_Beamos_A_01',
	'SpObj_Beamos_Capsule_A_01',
	'SpObj_Cannon_A_01',
	'SpObj_Cannon_Capsule_A_01',
	'SpObj_Cart_A_01',
	'SpObj_Cart_Capsule_A_01',
	'SpObj_Chaser_A_01',
	'SpObj_Chaser_Capsule_A_01',
	'SpObj_ControlStick_A_01',
	'SpObj_ControlStick_A_02',
	'SpObj_ControlStick_A_03',
	'SpObj_ControlStick_Capsule_A_01',
	'SpObj_CookSetOnFire_A_01',
	'SpObj_CookSet_Capsule_A_01',
	'SpObj_ElectricBoxGenerator',
	'SpObj_ElectricBoxGenerator_Capsule_A_01',
	'SpObj_EnergyBank_A_01',
	'SpObj_EnergyBank_A_02',
	'SpObj_EnergyBank_Capsule_A_01',
	'SpObj_EnergyBank_Capsule_A_02',
	'SpObj_FastWheel_A_01',
	'SpObj_FastWheel_Capsule_A_01',
	'SpObj_FastWheel_Capsule_B_01',
	'SpObj_FlameThrower_A_01',
	'SpObj_FlameThrower_Capsule_A_01',
	'SpObj_FlashLight_A_01',
	'SpObj_FlashLight_A_02',
	'SpObj_FlashLight_Capsule_A_01',
	'SpObj_FloatingStone_A_01',
	'SpObj_FloatingStone_Capsule_A_01',
	'SpObj_GolemHead_A_01',
	'SpObj_GolemHead_Capsule_A_01',
	'SpObj_LiftableWaterPump_Capsule_A_01',
	'SpObj_LiftGeneratorWing_A_01',
	'SpObj_LiftGeneratorWing_A_01_MiniGame',
	'SpObj_LiftGeneratorWing_Capsule_A_01',
	'SpObj_LightMirror_A_01',
	'SpObj_LightMirror_Capsule_A_01',
	'SpObj_Pile_A_01',
	'SpObj_Pile_Capsule_A_01',
	'SpObj_Rocket_A_01',
	'SpObj_Rocket_Capsule_A_01',
	'SpObj_SlipBoard_A_01',
	'SpObj_SlipBoard_Capsule_A_01',
	'SpObj_SnowMachine_A_01',
	'SpObj_SnowMachine_Capsule_A_01',
	'SpObj_SpringPiston_A_01',
	'SpObj_SpringPiston_Capsule_A_01',
	'SpObj_SwitchWheel_B_01',
	'SpObj_TiltingDoll_A_01',
	'SpObj_TiltingDoll_Capsule_A_01',
	'SpObj_TimerBomb_A_01',
	'SpObj_TimerBomb_Capsule_A_01',
	'SpObj_WaterPump_A_01',
	'SpObj_WindGenerator_A_01',
	'SpObj_WindGenerator_A_03',
	'SpObj_WindGenerator_Capsule_A_01',
	'StoneBall',
	'TimerBarrelBomb',
	'TwnObj_City_GerudoPot_A_LL_Act_02',
	'TwnObj_City_GerudoPot_A_M_Act_01',
	'TwnObj_City_GerudoPot_A_S_Act_01',
	'TwnObj_City_GerudoWoodBox_B_01',
	'TwnObj_City_GoronPot_A_M_Act_01',
	'TwnObj_GerudoDollBlue_A_02',
	'TwnObj_GerudoDollBlue_A_02_CollectObject',
	'TwnObj_GerudoDollGreen_A_02',
	'TwnObj_GerudoDollSmallGreen_A_01',
	'TwnObj_GerudoDollSmallGreen_A_01_CollectObject',
	'TwnObj_GerudoDollSmallGreen_A_01_FindSunaNui',
	'TwnObj_GerudoDollSmallRed_A_01',
	'TwnObj_GerudoDollSmallRed_A_01_CollectObject',
	'TwnObj_HyruleCastleObject_BookShelf_Iron_A_01',
	'TwnObj_HyruleCastleObject_Shelf_A_01',
	'TwnObj_Village_FishingPot_A_M_Act_01',
	'TwnObj_Village_Fishing_Boat_A_02',
	'TwnObj_Village_Fishing_Boat_A_02_ForAttachment',
	'TwnObj_Village_HatenoGuidePost_A_01_Trunk',
	'TwnObj_Village_HatenoPot_A_L_Act_01',
	'TwnObj_Village_HatenoPot_A_M_Act_01',
	'TwnObj_Village_HatenoPot_A_S_Act_01',
	'TwnObj_Village_HatenoSchoolSignboard_A_01_Trunk',
	'TwnObj_Village_KorokPot_A_S_Act_01',
	'TwnObj_Village_RitoPot_A_M_Act_01',
	'TwnObj_Village_RitoPot_A_M_Act_02',
	'TwnObj_Village_RitoPot_A_S_Act_01',
	'TwnObj_Village_RitoPot_A_S_Act_02',
	'TwnObj_Village_SheikerPot_A_LL_Act_01',
	'TwnObj_Village_SheikerPot_A_L_Act_01',
	'TwnObj_Village_SheikerPot_A_M_Act_02',
	'TwnObj_Village_SheikerPot_A_S_Act_01',
	'TwnObj_Village_ZoraPot_A_M_Act_01',
	'WoodBall_Golf',
	'Zonau_BlockMaster_Block',
	'Zonau_BlockMaster_Block_ForAttachment',
	'Zonau_BlockMaster_Block_Middle',
	'Zonau_BlockMaster_Block_Middle_ForAttachment',
	'Zonau_BlockMaster_Block_Senior',
	'Zonau_BlockMaster_Block_Senior_ForAttachment'
];