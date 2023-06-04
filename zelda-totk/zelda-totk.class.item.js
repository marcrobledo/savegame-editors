/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Item class) v20230604

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Item(catId, index, id, quantity, foodEffect, foodEffectHearts, foodEffectMultiplier, foodEffectTime, foodEffectUnknown1){
	this.category=catId;
	this.index=index;
	this.removable=catId!=='arrows';

	this.id=id;
	this.quantity=typeof quantity==='number'? quantity : 1;

	if(catId==='food'){
		this.foodEffect=typeof foodEffect==='number'? foodEffect : Item.FOOD_EFFECTS[0].value;
		this.foodEffectHearts=typeof foodEffectHearts==='number'? foodEffectHearts : 4;
		this.foodEffectMultiplier=typeof foodEffectMultiplier==='number'? foodEffectMultiplier : 0;
		this.foodEffectTime=typeof foodEffectTime==='number'? foodEffectTime : 0;
		this.foodEffectUnknown1=typeof foodEffectUnknown1==='number'? foodEffectUnknown1 : 1;
	}
	Item.buildHtmlElements(this);
}

Item.prototype.getItemTranslation=function(){
	if(Locale._(this.id))
		return Locale._(this.id);
	return Item.TRANSLATIONS[this.category][this.id] || this.id;
}
Item.prototype.copy=function(index, newId){
	return new Item(
		this.category,
		index,
		typeof newId==='string'? newId : this.id,
		this.quantity,
		this.category==='food'? this.foodEffect : null,
		this.category==='food'? this.foodEffectHearts : null,
		this.category==='food'? this.foodEffectMultiplier : null,
		this.category==='food'? this.foodEffectTime : null,
		this.category==='food'? this.foodEffectUnknown1 : null
	);
}

Item.prototype.save=function(){
	var categoryHash=capitalizeCategoryId(this.category);
	SavegameEditor.writeString64('Array'+categoryHash+'Ids', this.index, this.id);
	SavegameEditor.writeU32('Array'+categoryHash+'Quantities', this.index, this.quantity);
	if(this.category==='food'){
		SavegameEditor.writeU32('ArrayFoodEffects', this.index, this.foodEffect);
		SavegameEditor.writeU32('ArrayFoodEffectsHearts', this.index, this.foodEffectHearts);
		SavegameEditor.writeU32('ArrayFoodEffectsMultiplier', this.index, this.foodEffectMultiplier);
		SavegameEditor.writeU32('ArrayFoodEffectsTime', this.index, this.foodEffectTime);
		SavegameEditor.writeU32('ArrayFoodEffectsUnknown1', this.index, this.foodEffectUnknown1);
	}
}



Item.buildHtmlElements=function(item){
	//build html elements
	var maxValue=Item.MAXIMUM_QUANTITY[item.id] || 999;
	item._htmlInputQuantity=inputNumber('item-quantity-'+item.category+'-'+item.index, 1, maxValue, item.quantity);
	item._htmlInputQuantity.addEventListener('change', function(){
		var newVal=parseInt(this.value);
		if(!isNaN(newVal) && newVal>0)
			item.quantity=newVal;
	});
	item._htmlInputQuantity.title='Quantity';


	if(item.category==='food'){
		item._htmlSelectFoodEffect=select('item-food-effects-'+item.category+'-'+item.index, Item.FOOD_EFFECTS, function(){
			item.foodEffect=parseInt(this.value);
		}, item.foodEffect);
		item._htmlSelectFoodEffect.title='Food effect';

		item._htmlInputFoodEffectHearts=inputNumber('item-food-effects-hearts-'+item.category+'-'+item.index, 0, 40*4, item.foodEffectHearts);
		item._htmlInputFoodEffectHearts.addEventListener('change', function(){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>0)
				item.foodEffectHearts=newVal;
		});
		item._htmlInputFoodEffectHearts.title='Heart quarters heal';

		item._htmlInputFoodEffectMultiplier=inputNumber('item-food-effects-multiplier-'+item.category+'-'+item.index, 1, 250, item.foodEffectMultiplier);
		item._htmlInputFoodEffectMultiplier.addEventListener('change', function(){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>0)
				item.foodEffectMultiplier=newVal;
		});
		item._htmlInputFoodEffectMultiplier.title='Multiplier';

		item._htmlInputFoodEffectTime=inputNumber('item-food-effects-time-'+item.category+'-'+item.index, 0, 59999, item.foodEffectTime);
		item._htmlInputFoodEffectTime.addEventListener('change', function(){
			var newVal=parseInt(this.value);
			if(!isNaN(newVal) && newVal>=0)
				item.foodEffectTime=newVal;
		});
		item._htmlInputFoodEffectTime.title='Duration (in seconds)';

		item._htmlSpanFoodEffectUnknownValue=span(item.foodEffectUnknown1);
		item._htmlSpanFoodEffectUnknownValue.title='Unknown value';
	}
}

Item.readAll=function(catId){
	var categoryHash=capitalizeCategoryId(catId);
	var itemIds=SavegameEditor.readString64Array('Array'+categoryHash+'Ids');
	var isFood=(catId==='food');
	var validItems=[];
	for(var i=0; i<itemIds.length; i++){
		if(itemIds[i]){
			validItems.push(new Item(
				catId,
				i,
				itemIds[i],
				SavegameEditor.readU32('Array'+categoryHash+'Quantities', i),
				isFood? SavegameEditor.readU32('ArrayFoodEffects', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsHearts', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsMultiplier', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsTime', i) : null,
				isFood? SavegameEditor.readU32('ArrayFoodEffectsUnknown1', i) : null
			));
		}
	}
	return validItems;
}


Item.MAXIMUM_QUANTITY={
Item_Ore_L:999999, //Zonaite
Item_Ore_M:999999, //Large Zonaite
Energy_Material_01:999999, //Crystallized Charge
//Energy_Material_03:999999, //Large Crystallized Charge
//Energy_Material_04:999999, //Huge Crystallized Charge
Obj_WarpDLC:3, //Travel Medallion
MinusRupee_00:999999 //Poe
//MinusRupee_01:999999, //Large Poe
//MinusRupee_02:999999 //Grand Poe
};



Item.FOOD_EFFECTS=[
{name:'None', value:0xb6eede09}, //None
{name:'Heat Resistance', value:0x1df7a011}, //ResistHot
{name:'Flame Guard', value:0x11383afd}, //ResistBurn
{name:'Cold Resistance', value:0x9b6d98fb}, //ResistCold
{name:'Shock Resistance', value:0x183cd822}, //ResistElectric
{name:'Lightning Proof', value:0x25293142}, //ResitLightning
{name:'UnFreezable', value:0xf5e2a20c}, //ResistFreeze
//{name:'*ResistAncient', value:0xe53962df},
{name:'Swim Speed Up', value:0x67866c6d}, //SwimSpeedUp
{name:'Swim Dash Stamina Up', value:0x87645022}, //DecreaseSwimStamina
//{name:'*SpinAttack', value:0x1e082215},
//{name:'*ClimbWaterfall', value:0x9119b797},
{name:'Climb Speed Up', value:0xdc7faf6e}, //ClimbSpeedUp
//{name:'*ClimbSpeedUpOnlyHorizontaly', value:0x81e9dab0},
{name:'Attack Up', value:0xa9384c6c}, //AttackUp
{name:'Cold Weather Attack Up', value:0x4a3e58f6}, //AttackUpCold
{name:'Hot Weather Attack Up', value:0x4c6a85d2}, //AttackUpHot
{name:'Stormy Weather Attack Up', value:0xff347a38}, //AttackUpThunderstorm
//{name:'*AttackUpDark', value:0xa2d97a77},
//{name:'*AttackUpBone', value:0x51f5ed93},
{name:'Stealth Up', value:0x74141898}, //QuietnessUp
{name:'Sand Speed Up', value:0x9add92a3}, //SandMoveUp
{name:'Snow Speed Up', value:0x33261e44}, //SnowMoveUp
//{name:'*WakeWind', value:0x29e7073a},
//{name:'*TwiceJump', value:0xca81b8ab},
//{name:'*EmergencyAvoid', value:0x8674a913},
{name:'Defense Up', value:0xa0a00c0e}, //DefenseUp
{name:'Speed Up', value:0xb3f6b87a}, //AllSpeed
{name:'Gloom Resistance', value:0x4d1e8af4}, //MiasmaGuard
//{name:'*MaskBokoblin', value:0x6b9c735f},
//{name:'*MaskMoriblin', value:0xcd1c7892},
//{name:'*MaskLizalfos', value:0x18c0a6f1},
//{name:'*MaskLynel', value:0x4d70d744},
//{name:'*YigaDisguise', value:0x2c403cd2},
//{name:'*StalDisguise', value:0x4d91c91b},
//{name:'*LifeRecover', value:0x515632a9},
{name:'Extra Heart', value:0xc1db0965}, //LifeMaxUp
{name:'Stamina Recovery', value:0xe9a30056}, //StaminaRecover
{name:'Extra Stamina', value:0x60d8315d}, //ExStaminaMaxUp
{name:'Gloom Recovery', value:0x03459853}, //LifeRepair
{name:'Skydive Mobility Up', value:0x6775f470}, //DivingMobilityUp
{name:'Slip Resistance', value:0x2b0cb1e9}, //NotSlippy
//{name:'*Moisturizing', value:0x994b605e},
{name:'Glow', value:0x4939dca1}, //LightEmission
{name:'Rupee Padding', value:0xcfd032db}, //RupeeGuard
//{name:'*FallResist', value:0x8b6e916c},
{name:'Master Sword Beam Up', value:0x59be2cc3}, //SwordBeamUp
//{name:'*VisualizeLife', value:0x5d85e03c},
{name:'Night Speed Up', value:0x82638f9d}, //NightMoveSpeedUp
//{name:'*NightGlow', value:0x7d5014ab},
{name:'Climbing Jump Stamina Up', value:0x0d1d9ef3}, //DecreaseWallJumpStamina
{name:' Charge Atk. Stamina Up', value:0x48aa5ddf}, //DecreaseChargeAttackStamina
//{name:'*EmitTerror', value:0xe6202c76},
{name:'Fireproof', value:0x2f3b7069}, //NoBurning
{name:'Impact Proof', value:0xc5def427}, //NoFallDamage
{name:'Slip Proof', value:0x346a7abc}, //NoSlip
//{name:'*RupeeGuardRate', value:0x56b27b1f},
//{name:'*MaskAll', value:0xc03cbd09},
{name:'Energy Up', value:0xa3b0355e}, //DecreaseZonauEnergy
{name:'Energy Recharge Up', value:0x52fad704}, //ZonauEnergyHealUp
//{name:'*MaskHorablin', value:0x719be063},
{name:'Gloom Attack Resist', value:0x671dbe0d}, //MiasmaDefenseUp
{name:'Cold Weather Charge', value:0xf563b129}, //ChargePowerUpCold
{name:'Hot Weather Charge', value:0x4fb7ed09}, //ChargePowerUpHot
{name:'Stormy Weather Charge', value:0x8f4fdaf4}, //ChargePowerUpThunderstorm
{name:'Shining Steps', value:0x1d249847} //LightFootprint
//{name:'*SoulPowerUpLightning', value:0xfbfc055b},
//{name:'*SoulPowerUpWater', value:0x77b8c024},
//{name:'*SoulPowerUpWind', value:0xc4cf428c},
//{name:'*SoulPowerUpFire', value:0xf149c0c0},
//{name:'*SoulPowerUpSpirit', value:0xf9c555e6},
//{name:'*EnableUseSwordBeam', value:0xaa04e165}
];




Item.fixKeyAvailabilityFlags=function(){
	var changes=0;
	SavegameEditor.currentItems.key.forEach(function(item, i){
		if(Item.AvailabilityFlags[item.id]){
			var offset=SavegameEditor._getOffsetsByHashes([Item.AvailabilityFlags[item.id]], true);
			if(offset){
				var originalValue=tempFile.readU32(offset);
				if(originalValue===0){
					tempFile.writeU32(offset, 1);
					changes++;
				}
			}
		}
	});

	if(changes){
		//console.warn(changes+' paraglider fabric availability flags have been fixed');
		MarcDialogs.alert(changes+' paraglider fabric availability flags have been fixed');
		if(currentTab==='master' && TOTKMasterEditor.isLoaded()){
			TOTKMasterEditor.refreshResults();
		}
	}
	return changes;
}

Item.AvailabilityFlags={
	/* paraglider fabrics */
	Obj_SubstituteCloth_Default:0x7ff848d1,
	Obj_SubstituteCloth_00:0xb65bc9d7,
	Obj_SubstituteCloth_01:0x41929f49,
	Obj_SubstituteCloth_02:0x084da01f,
	Obj_SubstituteCloth_03:0x31a2d1cc,
	Obj_SubstituteCloth_04:0x865f713d,
	Obj_SubstituteCloth_05:0x30669b55,
	Obj_SubstituteCloth_06:0x022aef11,
	Obj_SubstituteCloth_07:0x112734b9,
	Obj_SubstituteCloth_08:0xdbc821f2,
	Obj_SubstituteCloth_09:0x1ecc8c93,
	Obj_SubstituteCloth_10:0x405203b9,
	Obj_SubstituteCloth_11:0x7c38e018,
	Obj_SubstituteCloth_12:0x0636a9e7,
	Obj_SubstituteCloth_13:0x09865592,
	Obj_SubstituteCloth_14:0x57129d72,
	Obj_SubstituteCloth_15:0xf4035866,
	Obj_SubstituteCloth_16:0xc80d0bf1,
	Obj_SubstituteCloth_17:0x96427113,
	Obj_SubstituteCloth_18:0x8ef713e8,
	Obj_SubstituteCloth_19:0x92754bbd,
	Obj_SubstituteCloth_20:0x94d2472d,
	Obj_SubstituteCloth_21:0xe6cacf83,
	Obj_SubstituteCloth_22:0x85a4e8e3,
	Obj_SubstituteCloth_23:0xca1847dd,
	Obj_SubstituteCloth_24:0x8c007dbc,
	Obj_SubstituteCloth_25:0xa2aec992,
	Obj_SubstituteCloth_26:0x7c552e01,
	Obj_SubstituteCloth_27:0xca76a631,
	Obj_SubstituteCloth_28:0xd9c206b1,
	Obj_SubstituteCloth_29:0x6443f768,
	Obj_SubstituteCloth_30:0x397217b2,
	Obj_SubstituteCloth_31:0x6fb24dcc,
	Obj_SubstituteCloth_32:0x38267d74,
	Obj_SubstituteCloth_33:0xca2baf8b,
	Obj_SubstituteCloth_34:0x500ce8e9,
	Obj_SubstituteCloth_35:0x861db450,
	Obj_SubstituteCloth_36:0x8dbea34c,
	Obj_SubstituteCloth_37:0xd552e642,
	Obj_SubstituteCloth_38:0x6199467d,
	Obj_SubstituteCloth_39:0x6625f898,
	Obj_SubstituteCloth_40:0x63452b97,
	Obj_SubstituteCloth_41:0x53e2da50,
	Obj_SubstituteCloth_43:0xee3f78e3,
	Obj_SubstituteCloth_45:0xf2d50ecf,
	Obj_SubstituteCloth_46:0xa4bf8025,
	Obj_SubstituteCloth_48:0x0f1e166d,
	Obj_SubstituteCloth_49:0xc9ab8463,
	Obj_SubstituteCloth_51:0x21170251,
	Obj_SubstituteCloth_52:0xeaae73a3,
	Obj_SubstituteCloth_53:0xa5ecfeec,
	Obj_SubstituteCloth_55:0x93e7260f,
	Obj_SubstituteCloth_56:0x6688319b
}




Item.TRANSLATIONS={
'arrows':{
NormalArrow:'Arrow'
},

'materials':{
Item_Fruit_A:'Apple',
Item_Fruit_B:'Wildberry',
Item_Fruit_C:'Voltfruit',
Item_Fruit_E:'Fleet-Lotus Seeds',
Item_Fruit_F:'Hydromelon',
Item_Fruit_G:'Palm Fruit',
Item_Fruit_H:'Mighty Bananas',
Item_Fruit_I:'Spicy Pepper',
Item_Fruit_J:'Fortified Pumpkin',
Item_Fruit_K:'Acorn',
Item_Fruit_L:'Chickaloo Tree Nut',
Item_Fruit_M:'Hylian Tomato',
Item_Fruit_N:'Sun Pumpkin',
Item_Fruit_P:'Golden Apple',

Item_Mushroom_A:'Stamella Shroom',
Item_Mushroom_B:'Chillshroom',
Item_Mushroom_C:'Sunshroom',
Item_Mushroom_E:'Hylian Shroom',
Item_Mushroom_F:'Hearty Truffle',
Item_Mushroom_H:'Zapshroom',
Item_Mushroom_J:'Silent Shroom',
Item_Mushroom_L:'Razorshroom',
Item_Mushroom_M:'Ironshroom',
Item_Mushroom_N:'Big Hearty Truffle',
Item_Mushroom_O:'Endura Shroom',
Item_Mushroom_P:'Skyshroom',
Item_MushroomGet_D:'Rushroom',
Item_MushroomGet_K:'Brightcap',

Animal_Insect_A:'Hot-Footed Frog',
Animal_Insect_AA:'Energetic Rhino Beetle',
Animal_Insect_AB:'Smotherwing Butterfly',
Animal_Insect_AG:'Sticky Frog',
Animal_Insect_AH:'Sticky Lizard',
Animal_Insect_AI:'Deep Firefly',
Animal_Insect_B:'Tireless Frog',
Animal_Insect_C:'Cold Darner',
Animal_Insect_E:'Sunset Firefly',
Animal_Insect_F:'Fairy',
Animal_Insect_G:'Bladed Rhino Beetle',
Animal_Insect_H:'Restless Cricket',
Animal_Insect_I:'Electric Darner',
Animal_Insect_M:'Hearty Lizard',
Animal_Insect_N:'Winterwing Butterfly',
Animal_Insect_P:'Rugged Rhino Beetle',
Animal_Insect_Q:'Summerwing Butterfly',
Animal_Insect_R:'Thunderwing Butterfly',
Animal_Insect_S:'Hightail Lizard',
Animal_Insect_T:'Warm Darner',
Animal_Insect_X:'Fireproof Lizard',

Item_InsectGet_K:'Razorclaw Crab',
Item_InsectGet_O:'Ironshell Crab',
Item_InsectGet_Z:'Bright-Eyed Crab',

BombFruit:'Bomb Flower',
ConfusionFruit:'Muddle Bud',
ElectricalFruit:'Shock Fruit',
FireFruit:'Fire Fruit',
IceFruit:'Ice Fruit',
LightFruit:'Dazzlefruit',
SmokeFruit:'Puffshroom',
WaterFruit:'Splash Fruit',

Item_Enemy_01:'Bokoblin Fang',
Item_Enemy_02:'Bokoblin Guts',
Item_Enemy_04:'Lizalfos Talon',
Item_Enemy_05:'Lizalfos Tail',
Item_Enemy_07:'Moblin Fang',
Item_Enemy_08:'Moblin Guts',
Item_Enemy_13:'Lynel Hoof',
Item_Enemy_14:'Lynel Guts',
Item_Enemy_15:'Red Chuchu Jelly',
Item_Enemy_16:'Yellow Chuchu Jelly',
Item_Enemy_17:'White Chuchu Jelly',
Item_Enemy_18:'Keese Wing',
Item_Enemy_19:'Keese Eyeball',
Item_Enemy_20:'Octorok Tentacle',
Item_Enemy_21:'Octorok Eyeball',
Item_Enemy_24:'Molduga Fin',
Item_Enemy_25:'Molduga Guts',
Item_Enemy_32:'Hinox Toenail',
Item_Enemy_33:'Hinox Tooth',
Item_Enemy_34:'Hinox Guts',
Item_Enemy_38:'Dinraal\'s Scale',
Item_Enemy_39:'Dinraal\'s Claw',
Item_Enemy_40:'Chuchu Jelly',
Item_Enemy_41:'Fire-Breath Lizalfos Tail',
Item_Enemy_42:'Ice-Breath Lizalfos Tail',
Item_Enemy_43:'Electric Lizalfos Tail',
Item_Enemy_44:'Fire Keese Wing',
Item_Enemy_45:'Electric Keese Wing',
Item_Enemy_46:'Ice Keese Wing',
Item_Enemy_47:'Shard of Dinraal\'s Fang',
Item_Enemy_49:'Naydra\'s Scale',
Item_Enemy_50:'Naydra\'s Claw',
Item_Enemy_51:'Shard of Naydra\'s Fang',
Item_Enemy_53:'Farosh\'s Scale',
Item_Enemy_54:'Farosh\'s Claw',
Item_Enemy_55:'Shard of Farosh\'s Fang',
Item_Enemy_57:'Octo Balloon',
Item_Enemy_58:'Fire-Breath Lizalfos Horn',
Item_Enemy_59:'Ice-Breath Lizalfos Horn',
Item_Enemy_60:'Electric Lizalfos Horn',
Item_Enemy_64:'Boss Bokoblin Horn',
Item_Enemy_66:'Aerocuda Eyeball',
Item_Enemy_67:'Captain Construct I Horn',
Item_Enemy_69:'Gibdo Bone',
Item_Enemy_77:'Bokoblin Horn',
Item_Enemy_78:'Blue Bokoblin Horn',
Item_Enemy_79:'Black Bokoblin Horn',
Item_Enemy_80:'Silver Bokoblin Horn',
Item_Enemy_89:'Moblin Horn',
Item_Enemy_90:'Blue Moblin Horn',
Item_Enemy_91:'Black Moblin Horn',
Item_Enemy_92:'Silver Moblin Horn',
Item_Enemy_100:'Horriblin Horn',
Item_Enemy_101:'Blue Horriblin Horn',
Item_Enemy_102:'Black Horriblin Horn',
Item_Enemy_103:'Silver Horriblin Horn',
Item_Enemy_104:'Horriblin Claw',
Item_Enemy_105:'Horriblin Guts',
Item_Enemy_106:'Lizalfos Horn',
Item_Enemy_107:'Blue Lizalfos Horn',
Item_Enemy_108:'Black Lizalfos Horn',
Item_Enemy_109:'Silver Lizalfos Horn',
Item_Enemy_114:'Blue Lizalfos Tail',
Item_Enemy_115:'Black Lizalfos Tail',
Item_Enemy_116:'Silver Lizalfos Tail',
Item_Enemy_117:'Fire Keese Eyeball',
Item_Enemy_118:'Electric Keese Eyeball',
Item_Enemy_119:'Ice Keese Eyeball',
Item_Enemy_121:'Gibdo Guts',
Item_Enemy_123:'Gibdo Wing',
Item_Enemy_124:'Aerocuda Wing',
Item_Enemy_130:'Zonai Charge',
Item_Enemy_131:'Large Zonai Charge',
Item_Enemy_132:'Blue Boss Bokoblin Horn',
Item_Enemy_133:'Black Boss Bokoblin Horn',
Item_Enemy_134:'Silver Boss Bokoblin Horn',
Item_Enemy_135:'Boss Bokoblin Fang',
Item_Enemy_136:'Boss Bokoblin Guts',
Item_Enemy_142:'Hinox Horn',
Item_Enemy_143:'Blue Hinox Horn',
Item_Enemy_144:'Black Hinox Horn',
Item_Enemy_148:'Lynel Saber Horn',
Item_Enemy_149:'Blue-Maned Lynel Saber Horn',
Item_Enemy_150:'White-Maned Lynel Saber Horn',
Item_Enemy_151:'Silver Lynel Saber Horn',
Item_Enemy_153:'Gleeok Flame Horn',
Item_Enemy_154:'Gleeok Frost Horn',
Item_Enemy_155:'Gleeok Thunder Horn',
Item_Enemy_156:'Gleeok Wing',
Item_Enemy_157:'Gleeok Guts',
Item_Enemy_158:'Light Dragon\'s Scale',
Item_Enemy_159:'Light Dragon\'s Talon',
Item_Enemy_160:'Shard of Light Dragon\'s Fang',
Item_Enemy_166:'Soldier Construct Horn',
Item_Enemy_167:'Soldier Construct II Horn',
Item_Enemy_168:'Soldier Construct III Horn',
Item_Enemy_169:'Soldier Construct IV Horn',
Item_Enemy_181:'Like Like Stone',
Item_Enemy_182:'Fire Like Stone',
Item_Enemy_183:'Shock Like Stone',
Item_Enemy_184:'Ice Like Stone',
Item_Enemy_186:'Frox Fang',
Item_Enemy_187:'Obsidian Frox Fang',
Item_Enemy_188:'Blue-White Frox Fang',
Item_Enemy_189:'Frox Fingernail',
Item_Enemy_190:'Frox Guts',
Item_Enemy_191:'Captain Construct II Horn',
Item_Enemy_192:'Captain Construct III Horn',
Item_Enemy_193:'Captain Construct IV Horn',
Item_Enemy_208:'Stalnox Horn',
Item_Enemy_210:'Molduga Jaw',
Item_Enemy_211:'Dinraal\'s Horn',
Item_Enemy_212:'Naydra\'s Horn',
Item_Enemy_213:'Farosh\'s Horn',
Item_Enemy_214:'Light Dragon\'s Horn',
Item_Enemy_215:'Lynel Mace Horn',
Item_Enemy_216:'Blue-Maned Lynel Mace Horn',
Item_Enemy_217:'White-Maned Lynel Mace Horn',
Item_Enemy_218:'Silver Lynel Mace Horn',
Item_Enemy_228:'Shard of Dinraal\'s Spike',
Item_Enemy_229:'Shard of Naydra\'s Spike',
Item_Enemy_230:'Shard of Farosh\'s Spike',
Item_Enemy_231:'Shard of Light Dragon\'s Spike',

Item_Enemy_137:'Stone Talus Heart', //fusable only
Item_Enemy_138:'Luminous Stole Talus Heart', //fusable only
Item_Enemy_139:'Rare Stone Talus Heart', //fusable only
Item_Enemy_140:'Igneo Talus Heart', //fusable only
Item_Enemy_141:'Frost Talus Heart', //fusable only
Item_Enemy_220:'Colgera Jaw', //fusable only
Item_Enemy_221:'Marbled Gohma Leg', //fusable only
Item_Enemy_223:'Queen Gibdo Wing', //fusable only
Item_Enemy_225:'Flux Construct I Core', //fusable only
Item_Enemy_226:'Flux Construct II Core', //fusable only
Item_Enemy_227:'Flux Construct III Core', //fusable only

Item_FishGet_A:'Hyrule Bass',
Item_FishGet_AA:'Ancient Arowana',
Item_FishGet_AC:'Glowing Cave Fish',
Item_FishGet_B:'Hearty Bass',
Item_FishGet_C:'Chillfin Trout',
Item_FishGet_D:'Voltfin Trout',
Item_FishGet_E:'Mighty Carp',
Item_FishGet_F:'Mighty Porgy',
Item_FishGet_G:'Armored Porgy',
Item_FishGet_H:'Armored Carp',
Item_FishGet_I:'Hearty Salmon',
Item_FishGet_J:'Sizzlefin Trout',
//Item_FishGet_K:"Hearty Blueshell Snail",
Item_FishGet_L:'Staminoka Bass',
Item_FishGet_M:'Sneaky River Snail',
Item_FishGet_X:'Stealthfin Trout',
Item_FishGet_Z:'Sanke Carp',

Item_Material_01:'Cane Sugar',
Item_Material_02:'Goron Spice',
Item_Material_03:'Hylian Rice',
Item_Material_04:'Bird Egg',
Item_Material_05:'Fresh Milk',
Item_Material_06:'Goat Butter',
Item_Material_07:'Tabantha Wheat',
Item_Material_08:'Monster Extract',
Item_Material_09:'Oil Jar',
Item_Material_10:'Hateno Cheese',
Item_Material_11:'Dark Clump',

Item_Ore_A:'Diamond',
Item_Ore_B:'Ruby',
Item_Ore_C:'Sapphire',
Item_Ore_D:'Topaz',
Item_Ore_E:'Opal',
Item_Ore_F:'Amber',
Item_Ore_G:'Luminous Stone',
Item_Ore_H:'Rock Salt',
Item_Ore_I:'Flint',
Item_Ore_J:'Star Fragment',
Item_Ore_L:'Zonaite',
Item_Ore_M:'Large Zonaite',

Item_PlantGet_A:'Hyrule Herb',
Item_PlantGet_B:'Hearty Radish',
Item_PlantGet_C:'Big Hearty Radish',
Item_PlantGet_E:'Cool Safflina',
Item_PlantGet_F:'Warm Safflina',
Item_PlantGet_G:'Mighty Thistle',
Item_PlantGet_H:'Armoranth',
Item_PlantGet_I:'Blue Nightshade',
Item_PlantGet_J:'Silent Princess',
Item_PlantGet_L:'Electric Safflina',
Item_PlantGet_M:'Swift Carrot',
Item_PlantGet_O:'Swift Violet',
Item_PlantGet_Q:'Endura Carrot',
Item_PlantGet_R:'Sundelion',
Item_PlantGet_S:'Stambulb',
Item_PlantGet_U:'Korok Frond',


Item_Meat_01:'Raw Meat',
Item_Meat_02:'Raw Prime Meat',
Item_Meat_06:'Raw Bird Drumstick',
Item_Meat_07:'Raw Bird Thigh',
Item_Meat_11:'Raw Gourmet Meat',
Item_Meat_12:'Raw Whole Bird',

LightBall_Small:'Brightbloom Seed',
LightBall_Large:'Giant Brightbloom Seed',

BeeHome:'Courser Bee Honey',
FldObj_Pinecone_A_01:'Hylian Pine Cone',
Item_KingScale:'King\'s Scale',
Item_Weapon_01:'Ancient Blade',
Obj_FireWoodBundle:'Wood'
},

'food':{
Item_Boiled_01:'Hard-Boiled Egg',

Item_ChilledFish_01:'Frozen Bass',
Item_ChilledFish_02:'Frozen Hearty Salmon',
Item_ChilledFish_03:'Frozen Trout',
Item_ChilledFish_04:'Frozen Carp',
Item_ChilledFish_05:'Frozen Porgy',
Item_ChilledFish_06:'Frozen Hearty Bass',
Item_ChilledFish_07:'Frozen Crab',
Item_ChilledFish_08:'Frozen River Snail',
//Item_ChilledFish_09:"Icy Hearty Blueshell Snail",
Item_ChilledFish_16:'Frozen Arowana',
Item_ChilledFish_18:'Frozen Cave Fish',

Item_Chilled_01:'Icy Meat',
Item_Chilled_02:'Icy Prime Meat',
Item_Chilled_03:'Icy Gourmet Meat',
Item_Chilled_04:'Frozen Bird Dumstick',
Item_Chilled_05:'Frozen Bird Thigh',
Item_Chilled_06:'Frozen Whole Bird',

Item_RoastFish_01:'Roasted Bass',
Item_RoastFish_02:'Roasted Hearty Bass',
Item_RoastFish_03:'Roasted Trout',
Item_RoastFish_04:'Roasted Hearty Salmon',
Item_RoastFish_07:'Roasted Carp',
Item_RoastFish_09:'Roasted Porgy',
//Item_RoastFish_11:"Blueshell Escargot",
Item_RoastFish_13:'Sneaky River Escargot',
Item_RoastFish_15:'Blackened Crab',
Item_RoastFish_16:'Roasted Arowana',
Item_RoastFish_18:'Roasted Cave Fish',

Item_Roast_01:'Seared Steak',
Item_Roast_02:'Roasted Bird Drumstick',
Item_Roast_03:'Baked Apple',
Item_Roast_04:'Toasty Stamella Shroom',
Item_Roast_05:'Toasted Hearty Truffle',
Item_Roast_06:'Toasty Hylian Shroom',
Item_Roast_07:'Roasted Wildberry',
Item_Roast_08:'Roasted Voltfruit',
//Item_Roast_09:"Roasted Hearty Durian",
Item_Roast_10:'Baked Palm Fruit',
Item_Roast_11:'Roasted Mighty Bananas',
Item_Roast_12:'Roasted Hydromelon',
Item_Roast_13:'Charned Pepper',
Item_Roast_15:'Baked Fortified Pumpkin',
Item_Roast_16:'Roasted Lotus Seeds',
Item_Roast_18:'Roasted Radish',
Item_Roast_19:'Roasted Big Radish',
Item_Roast_24:'Roasted Swift Carrot',
Item_Roast_27:'Roasted Mighty Thistle',
Item_Roast_28:'Roasted Armoranth',
Item_Roast_31:'Toasty Chillshroom',
Item_Roast_32:'Toasty Sunshroom',
Item_Roast_33:'Toasty Zapshroom',
Item_Roast_36:'Toasty Rushroom',
Item_Roast_37:'Toasty Razorshroom',
Item_Roast_38:'Toasty Ironshroom',
Item_Roast_39:'Toasty Silent Shroom',
Item_Roast_40:'Seared Prime Steak',
Item_Roast_41:'Roasted Bird Thigh',
Item_Roast_45:'Seared Gourmet Steak',
Item_Roast_46:'Roasted Whole Bird',
Item_Roast_48:'Roasted Acorn',
Item_Roast_49:'Toasted Big Hearty Truffle',
Item_Roast_50:'Roasted Endura Carrot',
Item_Roast_51:'Campfire Egg',
Item_Roast_52:'Roasted Tree Nut',
Item_Roast_53:'Toasty Endura Shroom',
Item_Roast_54:'Roasted Hylian Tomato',
Item_Roast_55:'Baked Sun Pumpkin',
Item_Roast_56:'Toasty Skyshroom',
Item_Roast_58:'Toasty Brightcap',
Item_Roast_59:'Baked Golden Apple',



Item_Cook_A_01:'Mushroom Skewer',
Item_Cook_A_02:'Steamed Mushrooms',
Item_Cook_A_03:'Steamed Fruit',
Item_Cook_A_04:'Steamed Fish',
Item_Cook_A_05:'Steamed Meat',
Item_Cook_A_07:'Fruit and Mushroom Mix',
Item_Cook_A_08:'Fish and Mushroom Skewer',
Item_Cook_A_09:'Meat and Mushroom Skewer',
Item_Cook_A_10:'Omelet',
Item_Cook_A_11:'Glazed Mushrooms',
Item_Cook_A_12:'Glazed Meat',
Item_Cook_A_13:'Glazed Seefood',
Item_Cook_A_14:'Glazed Veggies',
Item_Cook_B_01:'Fried Wild Greens',
Item_Cook_B_02:'Simmered Fruits',
Item_Cook_B_05:'Fish Skewer',
Item_Cook_B_06:'Meat Skewer',
Item_Cook_B_11:'Copious Fried Wild Greens',
Item_Cook_B_12:'Copious Simmered Fruits',
Item_Cook_B_13:'Copious Mushroom Skewers',
Item_Cook_B_15:'Copious Seafood Skewers',
Item_Cook_B_16:'Copious Meat Skewers',
Item_Cook_B_17:'Meat and Seafood Fry',
Item_Cook_B_18:'Prime Meat and Seafood Fry',
Item_Cook_B_19:'Gourmet Meat and Seafood Fry',
Item_Cook_B_20:'Meat-Stuffed Pumpkin',
Item_Cook_B_21:'Sautéed Peppers',
Item_Cook_B_22:'Sautéed Nuts',
Item_Cook_B_23:'Seafood Skewer',
Item_Cook_C_16:'Fairy Tonic',
Item_Cook_C_17:'Elixir',
Item_Cook_D_01:'Salt-Grilled Mushrooms',
Item_Cook_D_02:'Salt-Grilled Greens',
Item_Cook_D_03:'Salt-Grilled Fish',
Item_Cook_D_04:'Salt-Grilled Meat',
Item_Cook_D_05:'Salt-Grilled Prime Meat',
Item_Cook_D_06:'Salt-Grilled Gourmet Meat',
Item_Cook_D_07:'Pepper Steak',
Item_Cook_D_08:'Pepper Seafood',
Item_Cook_D_09:'Salt-Grilled Crab',
Item_Cook_D_10:'Crab Stir-Fry',
Item_Cook_E_01:'Poultry Pilaf',
Item_Cook_E_02:'Prime Poultry Pilaf',
Item_Cook_E_03:'Gourmet Poultry Pilaf',
Item_Cook_E_04:'Fried Egg and Rice',
Item_Cook_F_01:'Creamy Meat Soup',
Item_Cook_F_02:'Creamy Seefood Soup',
Item_Cook_F_03:'Veggie Cream Soup',
Item_Cook_F_04:'Creamy Heart Soup',
Item_Cook_G_02:'Seafood Rice Balls',
Item_Cook_G_03:'Veggie Rice Balls',
Item_Cook_G_04:'Mushroom Rice Balls',
Item_Cook_G_05:'Meat and Rice Ball',
Item_Cook_G_06:'Prime Meat and Rice Ball',
Item_Cook_G_09:'Gourmet Meat and Rice Ball',
Item_Cook_G_10:'Seafood Fried Rice',
Item_Cook_G_11:'Curry Pilaf',
Item_Cook_G_12:'Mushroom Risotto',
Item_Cook_G_13:'Vegetable Risotto',
Item_Cook_G_14:'Salmon Risotto',
Item_Cook_G_15:'Meaty Rice Balls',
Item_Cook_G_16:'Crab Omelet with Rice',
Item_Cook_G_17:'Crab Risotto',
Item_Cook_H_01:'Seafood Meunière',
Item_Cook_H_02:'Porgy Meunière',
Item_Cook_H_03:'Salmon Meunière',
Item_Cook_I_01:'Fruit Pie',
Item_Cook_I_02:'Apple Pie',
Item_Cook_I_03:'Egg Tart',
Item_Cook_I_04:'Meat Pie',
Item_Cook_I_05:'Carrot Cake',
Item_Cook_I_06:'Pumpkin Pie',
Item_Cook_I_07:'Hot Buttered Apple',
Item_Cook_I_08:'Honeyed Apple',
Item_Cook_I_09:'Honeyed Fruits',
Item_Cook_I_10:'Plain Crepe',
Item_Cook_I_11:'Wildberry Crepe',
Item_Cook_I_12:'Nutcake',
Item_Cook_I_13:'Fried Bananas',
Item_Cook_I_14:'Egg Pudding',
Item_Cook_I_15:'Fish Pie',
Item_Cook_I_16:'Honey Candy',
Item_Cook_I_17:'Honey Crepe',
Item_Cook_J_01:'Curry Rice',
Item_Cook_J_02:'Vegetable Curry',
Item_Cook_J_03:'Seafood Curry',
Item_Cook_J_04:'Poultry Curry',
Item_Cook_J_05:'Prime Poultry Curry',
Item_Cook_J_06:'Meat Curry',
Item_Cook_J_07:'Prime Meat Curry',
Item_Cook_J_08:'Gourmet Poultry Curry',
Item_Cook_J_09:'Gourmet Meat Curry',
Item_Cook_K_01:'Meat Stew',
Item_Cook_K_02:'Prime Meat Stew',
Item_Cook_K_03:'Pumpkin Stew',
Item_Cook_K_04:'Snail Chowder',
Item_Cook_K_05:'Gourmet Meat Stew',
Item_Cook_K_06:'Cream of Mushroom Soup',
Item_Cook_K_07:'Cream of Vegetable Soup',
Item_Cook_K_08:'Carrot Stew',
Item_Cook_K_09:'Milk',
Item_Cook_L_01:'Monster Stew',
Item_Cook_L_02:'Monster Soup',
Item_Cook_L_03:'Monster Cake',
Item_Cook_L_04:'Monster Rice Ball',
Item_Cook_L_05:'Monster Curry',
Item_Cook_M_01:'Wheat Bread',
Item_Cook_N_01:'Seafood Paella',
Item_Cook_N_02:'Fruitcake',
Item_Cook_N_03:'Vegetable Omelet',
Item_Cook_N_04:'Mushroom Omelet',
Item_Cook_O_01:'Dubious Food',
Item_Cook_O_02:'Rock-Hard Food',
Item_Cook_P_01:'Fragrant Mushroom Sauté',
Item_Cook_P_02:'Herb Sauté',
Item_Cook_P_03:'Spiced Meat Skewer',
Item_Cook_P_04:'Prime Spiced Meat Skewer',
Item_Cook_P_05:'Gourmet Spiced Meat Skewer',

Item_Cook_Q_01:'Simmered Tomato',
Item_Cook_Q_02:'Fruity Tomato Stew',
Item_Cook_Q_03:'Steamed Tomatoes',
Item_Cook_Q_04:'Tomato Mushroom Stew',
Item_Cook_Q_05:'Tomato Seafood Soup',
Item_Cook_Q_06:'Cooked Stambulb',
Item_Cook_Q_07:'Buttered Stambulb',
Item_Cook_Q_08:'Crunchy Fried Rice',
Item_Cook_Q_09:'Cheesecake',
Item_Cook_Q_10:'Cheesy Risotto',
Item_Cook_R_01:'Cheesy Omelette',
Item_Cook_R_02:'Veggie Porridge',
Item_Cook_R_03:'Noble Pursuit',
Item_Cook_R_04:'Hylian Tomato Pizza',
Item_Cook_R_05:'Fragrant Seafood Stew',
Item_Cook_R_06:'Deep-Fried Drumstick',
Item_Cook_R_07:'Deep-Fried Thigh',
Item_Cook_R_08:'Deep-Fried Bird Roast',
Item_Cook_R_09:'Melty Cheesy Bread',
Item_Cook_R_10:'Cheesy Baked Fish',
Item_Cook_S_01:'Cheesy Curry',
Item_Cook_S_02:'Cheesy Meat Bowl',
Item_Cook_S_03:'Prime Cheesy Meat Bowl',
Item_Cook_S_04:'Gourmet Cheesy Meat Bowl',
Item_Cook_S_05:'Dark Stew',
Item_Cook_S_06:'Dark Rice Ball',
Item_Cook_S_07:'Dark Soup',
Item_Cook_S_08:'Dark Curry',
Item_Cook_S_09:'Dark Cake',
Item_Cook_S_10:'Cheesy Tomato'
},

'devices':{
SpObj_EnergyBank_Capsule_A_01:"Battery",
SpObj_EnergyBank_Capsule_A_02:"Big Battery",
SpObj_CookSet_Capsule_A_01:"Portable Pot",
SpObj_Beamos_Capsule_A_01:"Beam Emitter",
SpObj_FlameThrower_Capsule_A_01:"Flame Emitter",
SpObj_SnowMachine_Capsule_A_01:"Frost Emitter",
SpObj_ElectricBoxGenerator_Capsule_A_01:"Shock Emitter",
SpObj_BalloonEnvelope_Capsule_A_01:"Balloon",
SpObj_Cannon_Capsule_A_01:"Cannon",
SpObj_Cart_Capsule_A_01:"Cart",
SpObj_Chaser_Capsule_A_01:"Homing Cart",
SpObj_ControlStick_Capsule_A_01:"Steering Stick",
SpObj_GolemHead_Capsule_A_01:"Construct Head",
SpObj_WindGenerator_Capsule_A_01:"Fan",
SpObj_FloatingStone_Capsule_A_01:"Hover Stone",
SpObj_LiftableWaterPump_Capsule_A_01:"Hydrant",
SpObj_FlashLight_Capsule_A_01:"Light",
SpObj_LightMirror_Capsule_A_01:"Mirror",
SpObj_Rocket_Capsule_A_01:"Rocket",
SpObj_SlipBoard_Capsule_A_01:"Sled",
SpObj_SpringPiston_Capsule_A_01:"Spring",
SpObj_TiltingDoll_Capsule_A_01:"Stabilizer",
SpObj_Pile_Capsule_A_01:"Stake",
SpObj_FastWheel_Capsule_A_01:"Small Wheel",
SpObj_FastWheel_Capsule_B_01:"Big Wheel",
SpObj_LiftGeneratorWing_Capsule_A_01:"Wing",
SpObj_TimerBomb_Capsule_A_01:"Time Bomb"
},

'key':{
Obj_DRStone_Get:"Purah Pad",
Parasail:"Paraglider",
Obj_DungeonClearSeal:"Light of Blessing",
Obj_Battery_Get:"Energy Cell",
Obj_KorokNuts:"Korok Seed",
Obj_ProofKorok:"Hestu's Gift",
CaveMasterMedal:"Bubbul Gem",
Energy_Material_01:"Crystallized Charge",
//Energy_Material_03:"Large Crystallized Charge",
//Energy_Material_04:"Huge Crystallized Charge",
MinusRupee_00:"Poe",
//MinusRupee_01:"Large Poe",
//MinusRupee_02:"Grand Poe",
Obj_SageWill:"Sage's Will",
Obj_StableHostlePointCard:"Pony Points Card",

Obj_DefeatHonor_00:"Stone Talus Monster Medal",
Obj_DefeatHonor_01:"Hinox Monster Medal",
Obj_DefeatHonor_02:"Molduga Monster Medal",
Obj_DefeatHonor_03:"Frox Monster Medal",
Obj_DefeatHonor_04:"Flux Construct Monster Medal",
Obj_DefeatHonor_05:"Gleeok Monster Medal",

Obj_SageSoul_Gerudo:"Vow of Riju, Sage of Lightning",
Obj_SageSoul_Goron:"Vow of Yunobo, Sage of Fire",
Obj_SageSoul_Rito:"Vow of Tulin, Sage of Wind",
Obj_SageSoul_Zonau:"Vow of Mineru, Sage of Spirit",
Obj_SageSoul_Zora:"Vow of Sidon, Sage of Water",
Obj_SageSoulPlus_Gerudo:"Solemn Vow of Riju, Sage of Lightning",
Obj_SageSoulPlus_Goron:"Solemn Vow of Yunobo, Sage of Fire",
Obj_SageSoulPlus_Rito:"Solemn Vow of Tulin, Sage of Wind",
Obj_SageSoulPlus_Zonau:"Solemn Vow of Mineru, Sage of Spirit",
Obj_SageSoulPlus_Zora:"Solemn Vow of Sidon, Sage of Water",

GameRomHorseReins_00:"Stable Bridle",
GameRomHorseReins_01:"Traveler's Bridle",
GameRomHorseReins_02:"Royal Reins",
GameRomHorseReins_03:"Knight's Bridle",
GameRomHorseReins_04:"Monster Bridle",
GameRomHorseReins_05:"Extravagant Bridle",
GameRomHorseSaddle_00:"Stable Saddle",
GameRomHorseSaddle_01:"Traveler's Saddle",
GameRomHorseSaddle_02:"Royal Saddle",
GameRomHorseSaddle_03:"Knight's Saddle",
GameRomHorseSaddle_04:"Monster Saddle",
GameRomHorseSaddle_05:"Extravagant Saddle",
GameRomHorseSaddle_07:"Towing Harness",

Obj_Camera:"Camera",
Obj_WarpDLC:"Travel Medallion",
//Obj_WarpDLC_Prototype:"Travel Medallion",
Obj_AutoBuilder:"Autobuild",
Obj_AutoBuilderDraft_00:"Schema Stone",
Obj_Tooreroof:"Ascend",
Obj_TreasureMap_00:"Old Map",
Item_StableHostelAccommodationCoupon_A:"Sleepover Ticket",
Obj_AutoBuilder:"Autobuild",
Obj_AutoBuilderDraft_00:"Schema Stone",
Obj_AutoBuilderDraftAssassin_00:"Yiga Schematic",
Obj_CaveWellHonor_00:"All's Well",
Obj_CheckPointHonor_00:"Dispelling Darkness Medal",
Obj_EnergyUtuwa_A_01:"Energy Well",
Obj_HiddenScroll_00:"Earthwake Manual",

/*Obj_Battery_Get_Capacity03:"Energy Cell[03]",
Obj_Battery_Get_Capacity04:"Energy Cell[04]",
Obj_Battery_Get_Capacity05:"Energy Cell[05]",
Obj_Battery_Get_Capacity06:"Energy Cell[06]",
Obj_Battery_Get_Capacity07:"Energy Cell[07]",
Obj_Battery_Get_Capacity08:"Energy Cell[08]",
Obj_Battery_Get_Capacity09:"Energy Cell[09]",
Obj_Battery_Get_Capacity10:"Energy Cell[10]",
Obj_Battery_Get_Capacity11:"Energy Cell[11]",
Obj_Battery_Get_Capacity12:"Energy Cell[12]",
Obj_Battery_Get_Capacity13:"Energy Cell[13]",
Obj_Battery_Get_Capacity14:"Energy Cell[14]",
Obj_Battery_Get_Capacity15:"Energy Cell[15]",
Obj_Battery_Get_Capacity16:"Energy Cell[16]",
Obj_Battery_Get_Capacity17:"Energy Cell[17]",
Obj_Battery_Get_Capacity18:"Energy Cell[18]",
Obj_Battery_Get_Capacity19:"Energy Cell[19]",
Obj_Battery_Get_Capacity20:"Energy Cell[20]",
Obj_Battery_Get_Capacity21:"Energy Cell[21]",
Obj_Battery_Get_Capacity22:"Energy Cell[22]",
Obj_Battery_Get_Capacity23:"Energy Cell[23]",
Obj_Battery_Get_Capacity24:"Energy Cell[24]",
Obj_Battery_Get_Capacity25:"Energy Cell[25]",
Obj_Battery_Get_Capacity26:"Energy Cell[26]",
Obj_Battery_Get_Capacity27:"Energy Cell[27]",
Obj_Battery_Get_Capacity28:"Energy Cell[28]",
Obj_Battery_Get_Capacity29:"Energy Cell[29]",
Obj_Battery_Get_Capacity30:"Energy Cell[30]",
Obj_Battery_Get_Capacity31:"Energy Cell[31]",
Obj_Battery_Get_Capacity32:"Energy Cell[32]",
Obj_Battery_Get_Capacity33:"Energy Cell[33]",
Obj_Battery_Get_Capacity34:"Energy Cell[34]",
Obj_Battery_Get_Capacity35:"Energy Cell[35]",
Obj_Battery_Get_Capacity36:"Energy Cell[36]",
Obj_Battery_Get_Capacity37:"Energy Cell[37]",
Obj_Battery_Get_Capacity38:"Energy Cell[38]",
Obj_Battery_Get_Capacity39:"Energy Cell[39]",
Obj_Battery_Get_Capacity40:"Energy Cell[40]",
Obj_Battery_Get_Capacity41:"Energy Cell[41]",
Obj_Battery_Get_Capacity42:"Energy Cell[42]",
Obj_Battery_Get_Capacity43:"Energy Cell[43]",
Obj_Battery_Get_Capacity44:"Energy Cell[44]",
Obj_Battery_Get_Capacity45:"Energy Cell[45]",
Obj_Battery_Get_Capacity46:"Energy Cell[46]",
Obj_Battery_Get_Capacity47:"Energy Cell[47]",
Obj_Battery_Get_Capacity48:"Energy Cell[48]",*/

Obj_SubstituteCloth_Default:"Ordinary Fabric",
Obj_SubstituteCloth_00:"Goron Fabric",
Obj_SubstituteCloth_01:"Zora Fabric",
Obj_SubstituteCloth_02:"Gerudo Fabric",
Obj_SubstituteCloth_03:"Royal Hyrulean Fabric",
Obj_SubstituteCloth_04:"Zonai Fabric",
Obj_SubstituteCloth_05:"Sheikah Fabric",
Obj_SubstituteCloth_06:"Yiga Fabric",
Obj_SubstituteCloth_07:"Monster-Control-Crew Fabric",
Obj_SubstituteCloth_08:"Zonai Survey Team Fabric",
Obj_SubstituteCloth_09:"Horse-God Fabric",
Obj_SubstituteCloth_10:"Lurelin Village Fabric",
Obj_SubstituteCloth_11:"Lucky Clover Gazette Fabric",
Obj_SubstituteCloth_12:"Hudson Construction Fabric",
Obj_SubstituteCloth_13:"Koltin's Fabric",
Obj_SubstituteCloth_14:"Korok Fabric",
Obj_SubstituteCloth_15:"Grizzlemaw-Bear Fabric",
Obj_SubstituteCloth_16:"Robbie's Fabric",
Obj_SubstituteCloth_17:"Cece Fabric",
Obj_SubstituteCloth_18:"Aerocuda Fabric",
Obj_SubstituteCloth_19:"Eldin-Ostrich Fabric",
Obj_SubstituteCloth_20:"Cucco Fabric",
Obj_SubstituteCloth_21:"Horse Fabric",
Obj_SubstituteCloth_22:"Chuchu Fabric",
Obj_SubstituteCloth_23:"Lynel Fabric",
Obj_SubstituteCloth_24:"Gleeok Fabric",
Obj_SubstituteCloth_25:"Stalnox Fabric",
Obj_SubstituteCloth_26:"Tunic of Memories Fabric",
Obj_SubstituteCloth_27:"Hylian-Hood Fabric",
Obj_SubstituteCloth_28:"Hyrule-Princess Fabric",
Obj_SubstituteCloth_29:"Goron-Champion Fabric",
Obj_SubstituteCloth_30:"Rito-Champion Fabric",
Obj_SubstituteCloth_31:"Zora-Champion Fabric",
Obj_SubstituteCloth_32:"Gerudo-Champion Fabric",
Obj_SubstituteCloth_33:"Ancient-Sheikah Fabric",
Obj_SubstituteCloth_34:"Bokoblin Fabric",
Obj_SubstituteCloth_35:"Demon King Fabric",
Obj_SubstituteCloth_36:"King of Red Lions Fabric",
Obj_SubstituteCloth_37:"Sheik Fabric",
Obj_SubstituteCloth_38:"Mirror of Twilight Fabric",
Obj_SubstituteCloth_39:"Princess of Twilight Fabric",
Obj_SubstituteCloth_40:"Lon Lon Ranch Fabric",
Obj_SubstituteCloth_41:"Majora's Mask Fabric",
Obj_SubstituteCloth_43:"Bygone-Royal Fabric",
Obj_SubstituteCloth_45:"Sword-Spirit Fabric",
Obj_SubstituteCloth_46:"Pixel Fabric",
Obj_SubstituteCloth_48:"Egg Fabric",
Obj_SubstituteCloth_49:"Goddess Fabric",
Obj_SubstituteCloth_51:"Champion's Leathers Fabric",
Obj_SubstituteCloth_52:"Princess Zelda Fabric",
Obj_SubstituteCloth_53:"Gerudo-King Fabric",
Obj_SubstituteCloth_55:"Nostalgic Fabric",
Obj_SubstituteCloth_56:"Addison's Fabric"
}
};



/*
CookEffect0 (BOTW)
===========
0xbf800000	0x00000000 (none, only hearts?)
0x40000000	0x41000000 (two yellow hearts?)
0x41600000	0x43c80000 (1/3 stamina)
0x41600000	0x43480000 (1/4 stamina)
0x41500000	0x3f800000 (speed up)
0x41800000	0x3f800000 (fire)
0x40a00000	0x3f800000 (ice)
0x40c00000	0x3f800000 (electric)
0x41200000	0x3f800000 (strength)
0x41300000	0x3f800000 (defense)
0x41400000	0x3f800000 (stealth)
*/