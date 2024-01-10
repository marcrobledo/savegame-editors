/*
	The legend of Zelda: Tears of the Kingdom savegame editor - Item class (last update 2024-01-10)

	by Marc Robledo 2023-2024
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Item(catId, itemData, overrideId){
	this.category=catId;

	this.id=overrideId || itemData.id;
	this.quantity=typeof itemData.quantity==='number'? itemData.quantity : 1;

	if(catId==='materials'){
		this.getOrder=typeof itemData.getOrder==='number'? itemData.getOrder : 0;
		this.useOrder=typeof itemData.useOrder==='number'? itemData.useOrder : 0;
	}else if(catId==='devices'){
		this.useOrder=typeof itemData.useOrder==='number'? itemData.useOrder : 0;
	}else if(catId==='food'){
		this.heartsHeal=typeof itemData.heartsHeal==='number'? itemData.heartsHeal : 4;
		this.effect=Variable.enumToInt(itemData.effect);
		this.effectMultiplier=typeof itemData.effectMultiplier==='number'? itemData.effectMultiplier : 0;
		this.effectTime=typeof itemData.effectTime==='number'? itemData.effectTime : 0;
		this.price=typeof itemData.price==='number'? itemData.price : 1;
		this.recipe=typeof itemData.recipe==='object' && itemData.recipe.length===5? itemData.recipe : ['','','','',''];
	}
}

Item.prototype.getItemTranslation=function(){
	return _(this.id);
}
Item.prototype.export=function(){
	if(this.category==='materials'){
		return{
			totkStruct:Pouch.getCategoryItemStructId(this.category),
			id:this.id,
			quantity:this.quantity,
			getOrder:this.getOrder,
			useOrder:this.useOrder
		}
	}else if(this.category==='devices'){
		return{
			totkStruct:Pouch.getCategoryItemStructId(this.category),
			id:this.id,
			quantity:this.quantity,
			useOrder:this.useOrder
		}
	}else if(this.category==='arrows' || this.category==='key'){
		return{
			totkStruct:Pouch.getCategoryItemStructId(this.category),
			id:this.id,
			quantity:this.quantity
		}
	}else if(this.category==='food'){
		return{
			totkStruct:Pouch.getCategoryItemStructId(this.category),
			id:this.id,
			quantity:this.quantity,
			heartsHeal:this.heartsHeal,
			effect:this.effect,
			effectMultiplier:this.effectMultiplier,
			effectTime:this.effectTime,
			price:this.price,
			recipe:this.recipe
		}
	}else{
		throw new Error('Invalid item category');
	}
}
Item.prototype.refreshHtmlInputs=function(fixValues){
	var isCountable=this.category !== 'key' || Item.KEY_COUNTABLE.indexOf(this.id)!==-1;
	if(fixValues){
		if(this.category==='food'){
			if(this.lastInputChanged==='effect'){
				if(this.id==='Item_Cook_C_17' && Item.VALID_ELIXIR_EFFECTS.indexOf(hashReverse(this.effect))!==-1)
					Pouch.updateItemIcon(this);
				if(this.effect===hash('None')){
					this.effectMultiplier=0;
					this.effectTime=0;
				}
			}
		}else if(this.category==='key'){
			if(isCountable && this.quantity<1)
				this.quantity=1;
			else if(!isCountable && this.lastInputChanged==='id')
				this.quantity=-1;
		}
	}


	this._htmlInputs.quantity.disabled=!isCountable;
	//this._htmlInputs.quantity.style.visibility=this._htmlInputs.quantity.disabled? 'hidden':'visible';
	if(this.category==='key'){
		var maxValue=Item.getMaximumQuantity(this.id);
		this._htmlInputs.quantity.maxValue=maxValue;
		if(fixValues && this.quantity>maxValue){
			this.quantity=maxValue;
		}
	}

	if(this.category==='food' && (!fixValues || this.lastInputChanged==='effect')){
		var effectText;
		try{
			effectText=hashReverse(this.effect);
		}catch(err){
			effectText='None';
		}

		if(effectText && effectText!=='None')
			this._htmlInputs.effectMultiplier.style.backgroundImage='url(assets/tokt_ui_icons/bonus_'+effectText+'.svg)';
		else
			this._htmlInputs.effectMultiplier.style.backgroundImage='none';

		this._htmlInputs.effectMultiplier.disabled=this._htmlInputs.effectTime.disabled=(!effectText || effectText==='None');
	}
}




Item.getMaximumQuantity=function(itemId){
	return Item.MAXIMUM_QUANTITY[itemId] || 999;
}
Item.buildHtmlElements=function(item){
	var maxQuantity=Item.getMaximumQuantity(item.id);

	if(item.category==='food'){
		item._htmlInputs={
			quantity:Pouch.createItemInput(item, 'quantity', 'Int', {min:1, max:maxQuantity, label:_('Quantity')}),
			heartsHeal:Pouch.createItemInput(item, 'heartsHeal', 'Int', {min:-1, max:40*4, label:_('Heart quarters heal')}),
			effect:Pouch.createItemInput(item, 'effect', 'Enum', {enumValues:Item.FOOD_EFFECTS, label:_('Food effect')}),
			effectMultiplier:Pouch.createItemInput(item, 'effectMultiplier', 'Int', {min:-1, max:250, label:_('Multiplier')}),
			effectTime:Pouch.createItemInput(item, 'effectTime', 'Int', {min:-1, max:59999, label:_('Duration (in seconds)')}),
			price:Pouch.createItemInput(item, 'price', 'Int', {min:1, max:999999, label:_('Price')})
		};
		item._htmlInputs.effectMultiplier.className+=' with-icon';
	}else{
		item._htmlInputs={
			quantity:Pouch.createItemInput(item, 'quantity', 'Int', {min:-1, max:maxQuantity, label:_('Quantity')})
		};
	}
}


Item.MAXIMUM_QUANTITY={
	Item_Ore_L:999999, //Zonaite
	Item_Ore_M:999999, //Large Zonaite
	Energy_Material_01:999999, //Crystallized Charge
	Obj_WarpDLC:3, //Travel Medallion
	Obj_KorokNuts:1000, //Travel Medallion
	MinusRupee_00:999999
};
Item.KEY_COUNTABLE=[
	'Obj_DungeonClearSeal',
	'Obj_SageWill',
	'Obj_KorokNuts',
	'CaveMasterMedal',
	'Energy_Material_01',
	'Item_Ore_L',
	'Item_Ore_M',
	'MinusRupee_00',
	'Obj_WarpDLC',
	'Obj_TreasureMap_00',
	'Obj_AutoBuilderDraft_00',
	'Obj_AutoBuilderDraftAssassin_00',
	'Item_StableHostelAccommodationCoupon_A'
];



Item.FOOD_EFFECTS_RAW=[
'ResistHot', 'ResistBurn', 'ResistCold', 'ResistElectric', 'ResitLightning', 'ResistFreeze', 'SwimSpeedUp',
'ClimbSpeedUp', 'AttackUp', 'AttackUpCold', 'AttackUpHot', 'AttackUpThunderstorm', 'QuietnessUp', 'SandMoveUp',
'SnowMoveUp', 'DefenseUp', 'AllSpeed', 'MiasmaGuard', 'LifeMaxUp', 'StaminaRecover', 'ExStaminaMaxUp', 'LifeRepair',
'DivingMobilityUp', 'NotSlippy', 'LightEmission', 'RupeeGuard', 'SwordBeamUp', 'NightMoveSpeedUp', 'DecreaseWallJumpStamina', 'DecreaseChargeAttackStamina',
'NoBurning', 'NoFallDamage', 'NoSlip', 'DecreaseZonauEnergy', 'ZonauEnergyHealUp', 'MiasmaDefenseUp', 'ChargePowerUpCold', 'ChargePowerUpHot',
'ChargePowerUpThunderstorm', 'LightFootprint'
//unusable in food?
//ResistFreeze, ResitLightning, RupeeGuard
//ResistAncient, SpinAttack, ClimbWaterfall, ClimbSpeedUpOnlyHorizontaly, AttackUpDark, AttackUpBone, WakeWind, TwiceJump
//EmergencyAvoid, MaskBokoblin, MaskMoriblin, MaskLizalfos, MaskLynel, YigaDisguise, StalDisguise, LifeRecover
//Moisturizing, FallResist, VisualizeLife, NightGlow, EmitTerror, RupeeGuardRate, MaskAll, MaskHorablin
//SoulPowerUpLightning, SoulPowerUpWater, SoulPowerUpWind, SoulPowerUpFire, SoulPowerUpSpirit, EnableUseSwordBeam
];
Item.FOOD_EFFECTS=[
{originalName:'None', value:hash('None')},
{originalName:'Heat Resistance', value:hash('ResistHot')},
{originalName:'Flame Guard', value:hash('ResistBurn')},
{originalName:'Cold Resistance', value:hash('ResistCold')},
{originalName:'Shock Resistance', value:hash('ResistElectric')},
{originalName:'Swim Speed Up', value:hash('SwimSpeedUp')},
{originalName:'Climb Speed Up', value:hash('ClimbSpeedUp')},
{originalName:'Attack Up', value:hash('AttackUp')},
{originalName:'Cold Weather Attack Up', value:hash('AttackUpCold')},
{originalName:'Hot Weather Attack Up', value:hash('AttackUpHot')},
{originalName:'Stormy Weather Attack Up', value:hash('AttackUpThunderstorm')},
{originalName:'Stealth Up', value:hash('QuietnessUp')},
{originalName:'Sand Speed Up', value:hash('SandMoveUp')},
{originalName:'Snow Speed Up', value:hash('SnowMoveUp')},
{originalName:'Defense Up', value:hash('DefenseUp')},
{originalName:'Speed Up', value:hash('AllSpeed')},
{originalName:'Gloom Resistance', value:hash('MiasmaGuard')},
{originalName:'Extra Heart', value:hash('LifeMaxUp')},
{originalName:'Stamina Recovery', value:hash('StaminaRecover')},
{originalName:'Extra Stamina', value:hash('ExStaminaMaxUp')},
{originalName:'Gloom Recovery', value:hash('LifeRepair')},
{originalName:'Skydive Mobility Up', value:hash('DivingMobilityUp')},
{originalName:'Slip Resistance', value:hash('NotSlippy')},
{originalName:'Glow', value:hash('LightEmission')}
];

/*
Item.PARASAIL_FABRICS=[
{value:hash('Default'), originalName:'Obj_SubstituteCloth_Default'},
{value:hash('Pattern00'), originalName:'Obj_SubstituteCloth_00'},
{value:hash('Pattern01'), originalName:'Obj_SubstituteCloth_01'},
{value:hash('Pattern02'), originalName:'Obj_SubstituteCloth_02'},
{value:hash('Pattern03'), originalName:'Obj_SubstituteCloth_03'},
{value:hash('Pattern04'), originalName:'Obj_SubstituteCloth_04'},
{value:hash('Pattern05'), originalName:'Obj_SubstituteCloth_05'},
{value:hash('Pattern06'), originalName:'Obj_SubstituteCloth_06'},
{value:hash('Pattern07'), originalName:'Obj_SubstituteCloth_07'},
{value:hash('Pattern08'), originalName:'Obj_SubstituteCloth_08'},
{value:hash('Pattern09'), originalName:'Obj_SubstituteCloth_09'},
{value:hash('Pattern10'), originalName:'Obj_SubstituteCloth_10'},
{value:hash('Pattern11'), originalName:'Obj_SubstituteCloth_11'},
{value:hash('Pattern12'), originalName:'Obj_SubstituteCloth_12'},
{value:hash('Pattern13'), originalName:'Obj_SubstituteCloth_13'},
{value:hash('Pattern14'), originalName:'Obj_SubstituteCloth_14'},
{value:hash('Pattern15'), originalName:'Obj_SubstituteCloth_15'},
{value:hash('Pattern16'), originalName:'Obj_SubstituteCloth_16'},
{value:hash('Pattern17'), originalName:'Obj_SubstituteCloth_17'},
{value:hash('Pattern18'), originalName:'Obj_SubstituteCloth_18'},
{value:hash('Pattern19'), originalName:'Obj_SubstituteCloth_19'},
{value:hash('Pattern20'), originalName:'Obj_SubstituteCloth_20'},
{value:hash('Pattern21'), originalName:'Obj_SubstituteCloth_21'},
{value:hash('Pattern22'), originalName:'Obj_SubstituteCloth_22'},
{value:hash('Pattern23'), originalName:'Obj_SubstituteCloth_23'},
{value:hash('Pattern24'), originalName:'Obj_SubstituteCloth_24'},
{value:hash('Pattern25'), originalName:'Obj_SubstituteCloth_25'},
{value:hash('Pattern26'), originalName:'Obj_SubstituteCloth_26'},
{value:hash('Pattern27'), originalName:'Obj_SubstituteCloth_27'},
{value:hash('Pattern28'), originalName:'Obj_SubstituteCloth_28'},
{value:hash('Pattern29'), originalName:'Obj_SubstituteCloth_29'},
{value:hash('Pattern30'), originalName:'Obj_SubstituteCloth_30'},
{value:hash('Pattern31'), originalName:'Obj_SubstituteCloth_31'},
{value:hash('Pattern32'), originalName:'Obj_SubstituteCloth_32'},
{value:hash('Pattern33'), originalName:'Obj_SubstituteCloth_33'},
{value:hash('Pattern34'), originalName:'Obj_SubstituteCloth_34'},
{value:hash('Pattern35'), originalName:'Obj_SubstituteCloth_35'},
{value:hash('Pattern36'), originalName:'Obj_SubstituteCloth_36'},
{value:hash('Pattern37'), originalName:'Obj_SubstituteCloth_37'},
{value:hash('Pattern38'), originalName:'Obj_SubstituteCloth_38'},
{value:hash('Pattern39'), originalName:'Obj_SubstituteCloth_39'},
{value:hash('Pattern40'), originalName:'Obj_SubstituteCloth_40'},
{value:hash('Pattern41'), originalName:'Obj_SubstituteCloth_41'},
{value:hash('Pattern43'), originalName:'Obj_SubstituteCloth_43'},
{value:hash('Pattern45'), originalName:'Obj_SubstituteCloth_45'},
{value:hash('Pattern46'), originalName:'Obj_SubstituteCloth_46'},
{value:hash('Pattern48'), originalName:'Obj_SubstituteCloth_48'},
{value:hash('Pattern49'), originalName:'Obj_SubstituteCloth_49'},
{value:hash('Pattern51'), originalName:'Obj_SubstituteCloth_51'},
{value:hash('Pattern52'), originalName:'Obj_SubstituteCloth_52'},
{value:hash('Pattern53'), originalName:'Obj_SubstituteCloth_53'},
{value:hash('Pattern55'), originalName:'Obj_SubstituteCloth_55'},
{value:hash('Pattern56'), originalName:'Obj_SubstituteCloth_56'}
];
*/

Item.AVAILABILITY={
	'arrows':[
		'NormalArrow'
	],

	'materials':[
		'Item_Fruit_A', //Apple
		'Item_Fruit_B', //Wildberry
		'Item_Fruit_C', //Voltfruit
		'Item_Fruit_E', //Fleet-Lotus Seeds
		'Item_Fruit_F', //Hydromelon
		'Item_Fruit_G', //Palm Fruit
		'Item_Fruit_H', //Mighty Bananas
		'Item_Fruit_I', //Spicy Pepper
		'Item_Fruit_J', //Fortified Pumpkin
		'Item_Fruit_K', //Acorn
		'Item_Fruit_L', //Chickaloo Tree Nut
		'Item_Fruit_M', //Hylian Tomato
		'Item_Fruit_N', //Sun Pumpkin
		'Item_Fruit_P', //Golden Apple

		'Item_Mushroom_A', //Stamella Shroom
		'Item_Mushroom_B', //Chillshroom
		'Item_Mushroom_C', //Sunshroom
		'Item_Mushroom_E', //Hylian Shroom
		'Item_Mushroom_F', //Hearty Truffle
		'Item_Mushroom_H', //Zapshroom
		'Item_Mushroom_J', //Silent Shroom
		'Item_Mushroom_L', //Razorshroom
		'Item_Mushroom_M', //Ironshroom
		'Item_Mushroom_N', //Big Hearty Truffle
		'Item_Mushroom_O', //Endura Shroom
		'Item_Mushroom_P', //Skyshroom
		'Item_MushroomGet_D', //Rushroom
		'Item_MushroomGet_K', //Brightcap

		'Animal_Insect_A', //Hot-Footed Frog
		'Animal_Insect_AA', //Energetic Rhino Beetle
		'Animal_Insect_AB', //Smotherwing Butterfly
		'Animal_Insect_AG', //Sticky Frog
		'Animal_Insect_AH', //Sticky Lizard
		'Animal_Insect_AI', //Deep Firefly
		'Animal_Insect_B', //Tireless Frog
		'Animal_Insect_C', //Cold Darner
		'Animal_Insect_E', //Sunset Firefly
		'Animal_Insect_F', //Fairy
		'Animal_Insect_G', //Bladed Rhino Beetle
		'Animal_Insect_H', //Restless Cricket
		'Animal_Insect_I', //Electric Darner
		'Animal_Insect_M', //Hearty Lizard
		'Animal_Insect_N', //Winterwing Butterfly
		'Animal_Insect_P', //Rugged Rhino Beetle
		'Animal_Insect_Q', //Summerwing Butterfly
		'Animal_Insect_R', //Thunderwing Butterfly
		'Animal_Insect_S', //Hightail Lizard
		'Animal_Insect_T', //Warm Darner
		'Animal_Insect_X', //Fireproof Lizard

		'Item_InsectGet_K', //Razorclaw Crab
		'Item_InsectGet_O', //Ironshell Crab
		'Item_InsectGet_Z', //Bright-Eyed Crab

		'BombFruit', //Bomb Flower
		'ConfusionFruit', //Muddle Bud
		'ElectricalFruit', //Shock Fruit
		'FireFruit', //Fire Fruit
		'IceFruit', //Ice Fruit
		'LightFruit', //Dazzlefruit
		'SmokeFruit', //Puffshroom
		'WaterFruit', //Splash Fruit

		'Item_Enemy_01', //Bokoblin Fang
		'Item_Enemy_02', //Bokoblin Guts
		'Item_Enemy_04', //Lizalfos Talon
		'Item_Enemy_05', //Lizalfos Tail
		'Item_Enemy_07', //Moblin Fang
		'Item_Enemy_08', //Moblin Guts
		'Item_Enemy_13', //Lynel Hoof
		'Item_Enemy_14', //Lynel Guts
		'Item_Enemy_15', //Red Chuchu Jelly
		'Item_Enemy_16', //Yellow Chuchu Jelly
		'Item_Enemy_17', //White Chuchu Jelly
		'Item_Enemy_18', //Keese Wing
		'Item_Enemy_19', //Keese Eyeball
		'Item_Enemy_20', //Octorok Tentacle
		'Item_Enemy_21', //Octorok Eyeball
		'Item_Enemy_24', //Molduga Fin
		'Item_Enemy_25', //Molduga Guts
		'Item_Enemy_32', //Hinox Toenail
		'Item_Enemy_33', //Hinox Tooth
		'Item_Enemy_34', //Hinox Guts
		'Item_Enemy_38', //Dinraal's Scale
		'Item_Enemy_39', //Dinraal's Claw
		'Item_Enemy_40', //Chuchu Jelly
		'Item_Enemy_41', //Fire-Breath Lizalfos Tail
		'Item_Enemy_42', //Ice-Breath Lizalfos Tail
		'Item_Enemy_43', //Electric Lizalfos Tail
		'Item_Enemy_44', //Fire Keese Wing
		'Item_Enemy_45', //Electric Keese Wing
		'Item_Enemy_46', //Ice Keese Wing
		'Item_Enemy_47', //Shard of Dinraal's Fang
		'Item_Enemy_49', //Naydra's Scale
		'Item_Enemy_50', //Naydra's Claw
		'Item_Enemy_51', //Shard of Naydra's Fang
		'Item_Enemy_53', //Farosh's Scale
		'Item_Enemy_54', //Farosh's Claw
		'Item_Enemy_55', //Shard of Farosh's Fang
		'Item_Enemy_57', //Octo Balloon
		'Item_Enemy_58', //Fire-Breath Lizalfos Horn
		'Item_Enemy_59', //Ice-Breath Lizalfos Horn
		'Item_Enemy_60', //Electric Lizalfos Horn
		'Item_Enemy_64', //Boss Bokoblin Horn
		'Item_Enemy_66', //Aerocuda Eyeball
		'Item_Enemy_67', //Captain Construct I Horn
		'Item_Enemy_69', //Gibdo Bone
		'Item_Enemy_77', //Bokoblin Horn
		'Item_Enemy_78', //Blue Bokoblin Horn
		'Item_Enemy_79', //Black Bokoblin Horn
		'Item_Enemy_80', //Silver Bokoblin Horn
		'Item_Enemy_89', //Moblin Horn
		'Item_Enemy_90', //Blue Moblin Horn
		'Item_Enemy_91', //Black Moblin Horn
		'Item_Enemy_92', //Silver Moblin Horn
		'Item_Enemy_100', //Horriblin Horn
		'Item_Enemy_101', //Blue Horriblin Horn
		'Item_Enemy_102', //Black Horriblin Horn
		'Item_Enemy_103', //Silver Horriblin Horn
		'Item_Enemy_104', //Horriblin Claw
		'Item_Enemy_105', //Horriblin Guts
		'Item_Enemy_106', //Lizalfos Horn
		'Item_Enemy_107', //Blue Lizalfos Horn
		'Item_Enemy_108', //Black Lizalfos Horn
		'Item_Enemy_109', //Silver Lizalfos Horn
		'Item_Enemy_114', //Blue Lizalfos Tail
		'Item_Enemy_115', //Black Lizalfos Tail
		'Item_Enemy_116', //Silver Lizalfos Tail
		'Item_Enemy_117', //Fire Keese Eyeball
		'Item_Enemy_118', //Electric Keese Eyeball
		'Item_Enemy_119', //Ice Keese Eyeball
		'Item_Enemy_121', //Gibdo Guts
		'Item_Enemy_123', //Gibdo Wing
		'Item_Enemy_124', //Aerocuda Wing
		'Item_Enemy_130', //Zonai Charge
		'Item_Enemy_131', //Large Zonai Charge
		'Item_Enemy_132', //Blue Boss Bokoblin Horn
		'Item_Enemy_133', //Black Boss Bokoblin Horn
		'Item_Enemy_134', //Silver Boss Bokoblin Horn
		'Item_Enemy_135', //Boss Bokoblin Fang
		'Item_Enemy_136', //Boss Bokoblin Guts
		'Item_Enemy_142', //Hinox Horn
		'Item_Enemy_143', //Blue Hinox Horn
		'Item_Enemy_144', //Black Hinox Horn
		'Item_Enemy_148', //Lynel Saber Horn
		'Item_Enemy_149', //Blue-Maned Lynel Saber Horn
		'Item_Enemy_150', //White-Maned Lynel Saber Horn
		'Item_Enemy_151', //Silver Lynel Saber Horn
		'Item_Enemy_153', //Gleeok Flame Horn
		'Item_Enemy_154', //Gleeok Frost Horn
		'Item_Enemy_155', //Gleeok Thunder Horn
		'Item_Enemy_156', //Gleeok Wing
		'Item_Enemy_157', //Gleeok Guts
		'Item_Enemy_158', //Light Dragon's Scale
		'Item_Enemy_159', //Light Dragon's Talon
		'Item_Enemy_160', //Shard of Light Dragon's Fang
		'Item_Enemy_166', //Soldier Construct Horn
		'Item_Enemy_167', //Soldier Construct II Horn
		'Item_Enemy_168', //Soldier Construct III Horn
		'Item_Enemy_169', //Soldier Construct IV Horn
		'Item_Enemy_181', //Like Like Stone
		'Item_Enemy_182', //Fire Like Stone
		'Item_Enemy_183', //Shock Like Stone
		'Item_Enemy_184', //Ice Like Stone
		'Item_Enemy_186', //Frox Fang
		'Item_Enemy_187', //Obsidian Frox Fang
		'Item_Enemy_188', //Blue-White Frox Fang
		'Item_Enemy_189', //Frox Fingernail
		'Item_Enemy_190', //Frox Guts
		'Item_Enemy_191', //Captain Construct II Horn
		'Item_Enemy_192', //Captain Construct III Horn
		'Item_Enemy_193', //Captain Construct IV Horn
		'Item_Enemy_208', //Stalnox Horn
		'Item_Enemy_210', //Molduga Jaw
		'Item_Enemy_211', //Dinraal's Horn
		'Item_Enemy_212', //Naydra's Horn
		'Item_Enemy_213', //Farosh's Horn
		'Item_Enemy_214', //Light Dragon's Horn
		'Item_Enemy_215', //Lynel Mace Horn
		'Item_Enemy_216', //Blue-Maned Lynel Mace Horn
		'Item_Enemy_217', //White-Maned Lynel Mace Horn
		'Item_Enemy_218', //Silver Lynel Mace Horn
		'Item_Enemy_228', //Shard of Dinraal's Spike
		'Item_Enemy_229', //Shard of Naydra's Spike
		'Item_Enemy_230', //Shard of Farosh's Spike
		'Item_Enemy_231', //Shard of Light Dragon's Spike

		'Item_FishGet_A', //Hyrule Bass
		'Item_FishGet_AA', //Ancient Arowana
		'Item_FishGet_AC', //Glowing Cave Fish
		'Item_FishGet_B', //Hearty Bass
		'Item_FishGet_C', //Chillfin Trout
		'Item_FishGet_D', //Voltfin Trout
		'Item_FishGet_E', //Mighty Carp
		'Item_FishGet_F', //Mighty Porgy
		'Item_FishGet_G', //Armored Porgy
		'Item_FishGet_H', //Armored Carp
		'Item_FishGet_I', //Hearty Salmon
		'Item_FishGet_J', //Sizzlefin Trout
		'Item_FishGet_L', //Staminoka Bass
		'Item_FishGet_M', //Sneaky River Snail
		'Item_FishGet_X', //Stealthfin Trout
		'Item_FishGet_Z', //Sanke Carp

		'Item_Material_01', //Cane Sugar
		'Item_Material_02', //Goron Spice
		'Item_Material_03', //Hylian Rice
		'Item_Material_04', //Bird Egg
		'Item_Material_05', //Fresh Milk
		'Item_Material_06', //Goat Butter
		'Item_Material_07', //Tabantha Wheat
		'Item_Material_08', //Monster Extract
		'Item_Material_09', //Oil Jar
		'Item_Material_10', //Hateno Cheese
		'Item_Material_11', //Dark Clump

		'Item_Ore_A', //Diamond
		'Item_Ore_B', //Ruby
		'Item_Ore_C', //Sapphire
		'Item_Ore_D', //Topaz
		'Item_Ore_E', //Opal
		'Item_Ore_F', //Amber
		'Item_Ore_G', //Luminous Stone
		'Item_Ore_H', //Rock Salt
		'Item_Ore_I', //Flint
		'Item_Ore_J', //Star Fragment
		'Item_Ore_L', //Zonaite
		'Item_Ore_M', //Large Zonaite

		'Item_PlantGet_A', //Hyrule Herb
		'Item_PlantGet_B', //Hearty Radish
		'Item_PlantGet_C', //Big Hearty Radish
		'Item_PlantGet_E', //Cool Safflina
		'Item_PlantGet_F', //Warm Safflina
		'Item_PlantGet_G', //Mighty Thistle
		'Item_PlantGet_H', //Armoranth
		'Item_PlantGet_I', //Blue Nightshade
		'Item_PlantGet_J', //Silent Princess
		'Item_PlantGet_L', //Electric Safflina
		'Item_PlantGet_M', //Swift Carrot
		'Item_PlantGet_O', //Swift Violet
		'Item_PlantGet_Q', //Endura Carrot
		'Item_PlantGet_R', //Sundelion
		'Item_PlantGet_S', //Stambulb
		'Item_PlantGet_U', //Korok Frond


		'Item_Meat_01', //Raw Meat
		'Item_Meat_02', //Raw Prime Meat
		'Item_Meat_06', //Raw Bird Drumstick
		'Item_Meat_07', //Raw Bird Thigh
		'Item_Meat_11', //Raw Gourmet Meat
		'Item_Meat_12', //Raw Whole Bird

		'LightBall_Small', //Brightbloom Seed
		'LightBall_Large', //Giant Brightbloom Seed

		'BeeHome', //Courser Bee Honey
		'FldObj_Pinecone_A_01', //Hylian Pine Cone
		'Item_KingScale', //King's Scale
		'Item_Weapon_01', //Ancient Blade
		'Obj_FireWoodBundle', //Wood
	],

		'food':[
		'Item_Boiled_01', //Hard-Boiled Egg

		'Item_ChilledFish_01', //Frozen Bass
		'Item_ChilledFish_02', //Frozen Hearty Salmon
		'Item_ChilledFish_03', //Frozen Trout
		'Item_ChilledFish_04', //Frozen Carp
		'Item_ChilledFish_05', //Frozen Porgy
		'Item_ChilledFish_06', //Frozen Hearty Bass
		'Item_ChilledFish_07', //Frozen Crab
		'Item_ChilledFish_08', //Frozen River Snail
		'Item_ChilledFish_16', //Frozen Arowana
		'Item_ChilledFish_18', //Frozen Cave Fish

		'Item_Chilled_01', //Icy Meat
		'Item_Chilled_02', //Icy Prime Meat
		'Item_Chilled_03', //Icy Gourmet Meat
		'Item_Chilled_04', //Frozen Bird Dumstick
		'Item_Chilled_05', //Frozen Bird Thigh
		'Item_Chilled_06', //Frozen Whole Bird

		'Item_RoastFish_01', //Roasted Bass
		'Item_RoastFish_02', //Roasted Hearty Bass
		'Item_RoastFish_03', //Roasted Trout
		'Item_RoastFish_04', //Roasted Hearty Salmon
		'Item_RoastFish_07', //Roasted Carp
		'Item_RoastFish_09', //Roasted Porgy
		'Item_RoastFish_13', //Sneaky River Escargot
		'Item_RoastFish_15', //Blackened Crab
		'Item_RoastFish_16', //Roasted Arowana
		'Item_RoastFish_18', //Roasted Cave Fish

		'Item_Roast_01', //Seared Steak
		'Item_Roast_02', //Roasted Bird Drumstick
		'Item_Roast_03', //Baked Apple
		'Item_Roast_04', //Toasty Stamella Shroom
		'Item_Roast_05', //Toasted Hearty Truffle
		'Item_Roast_06', //Toasty Hylian Shroom
		'Item_Roast_07', //Roasted Wildberry
		'Item_Roast_08', //Roasted Voltfruit
		'Item_Roast_10', //Baked Palm Fruit
		'Item_Roast_11', //Roasted Mighty Bananas
		'Item_Roast_12', //Roasted Hydromelon
		'Item_Roast_13', //Charned Pepper
		'Item_Roast_15', //Baked Fortified Pumpkin
		'Item_Roast_16', //Roasted Lotus Seeds
		'Item_Roast_18', //Roasted Radish
		'Item_Roast_19', //Roasted Big Radish
		'Item_Roast_24', //Roasted Swift Carrot
		'Item_Roast_27', //Roasted Mighty Thistle
		'Item_Roast_28', //Roasted Armoranth
		'Item_Roast_31', //Toasty Chillshroom
		'Item_Roast_32', //Toasty Sunshroom
		'Item_Roast_33', //Toasty Zapshroom
		'Item_Roast_36', //Toasty Rushroom
		'Item_Roast_37', //Toasty Razorshroom
		'Item_Roast_38', //Toasty Ironshroom
		'Item_Roast_39', //Toasty Silent Shroom
		'Item_Roast_40', //Seared Prime Steak
		'Item_Roast_41', //Roasted Bird Thigh
		'Item_Roast_45', //Seared Gourmet Steak
		'Item_Roast_46', //Roasted Whole Bird
		'Item_Roast_48', //Roasted Acorn
		'Item_Roast_49', //Toasted Big Hearty Truffle
		'Item_Roast_50', //Roasted Endura Carrot
		'Item_Roast_51', //Campfire Egg
		'Item_Roast_52', //Roasted Tree Nut
		'Item_Roast_53', //Toasty Endura Shroom
		'Item_Roast_54', //Roasted Hylian Tomato
		'Item_Roast_55', //Baked Sun Pumpkin
		'Item_Roast_56', //Toasty Skyshroom
		'Item_Roast_58', //Toasty Brightcap
		'Item_Roast_59', //Baked Golden Apple



		'Item_Cook_A_01', //Mushroom Skewer
		'Item_Cook_A_02', //Steamed Mushrooms
		'Item_Cook_A_03', //Steamed Fruit
		'Item_Cook_A_04', //Steamed Fish
		'Item_Cook_A_05', //Steamed Meat
		'Item_Cook_A_07', //Fruit and Mushroom Mix
		'Item_Cook_A_08', //Fish and Mushroom Skewer
		'Item_Cook_A_09', //Meat and Mushroom Skewer
		'Item_Cook_A_10', //Omelet
		'Item_Cook_A_11', //Glazed Mushrooms
		'Item_Cook_A_12', //Glazed Meat
		'Item_Cook_A_13', //Glazed Seefood
		'Item_Cook_A_14', //Glazed Veggies
		'Item_Cook_B_01', //Fried Wild Greens
		'Item_Cook_B_02', //Simmered Fruits
		'Item_Cook_B_05', //Fish Skewer
		'Item_Cook_B_06', //Meat Skewer
		'Item_Cook_B_11', //Copious Fried Wild Greens
		'Item_Cook_B_12', //Copious Simmered Fruits
		'Item_Cook_B_13', //Copious Mushroom Skewers
		'Item_Cook_B_15', //Copious Seafood Skewers
		'Item_Cook_B_16', //Copious Meat Skewers
		'Item_Cook_B_17', //Meat and Seafood Fry
		'Item_Cook_B_18', //Prime Meat and Seafood Fry
		'Item_Cook_B_19', //Gourmet Meat and Seafood Fry
		'Item_Cook_B_20', //Meat-Stuffed Pumpkin
		'Item_Cook_B_21', //Sautéed Peppers
		'Item_Cook_B_22', //Sautéed Nuts
		'Item_Cook_B_23', //Seafood Skewer
		'Item_Cook_C_16', //Fairy Tonic
		'Item_Cook_C_17', //Elixir
		'Item_Cook_D_01', //Salt-Grilled Mushrooms
		'Item_Cook_D_02', //Salt-Grilled Greens
		'Item_Cook_D_03', //Salt-Grilled Fish
		'Item_Cook_D_04', //Salt-Grilled Meat
		'Item_Cook_D_05', //Salt-Grilled Prime Meat
		'Item_Cook_D_06', //Salt-Grilled Gourmet Meat
		'Item_Cook_D_07', //Pepper Steak
		'Item_Cook_D_08', //Pepper Seafood
		'Item_Cook_D_09', //Salt-Grilled Crab
		'Item_Cook_D_10', //Crab Stir-Fry
		'Item_Cook_E_01', //Poultry Pilaf
		'Item_Cook_E_02', //Prime Poultry Pilaf
		'Item_Cook_E_03', //Gourmet Poultry Pilaf
		'Item_Cook_E_04', //Fried Egg and Rice
		'Item_Cook_F_01', //Creamy Meat Soup
		'Item_Cook_F_02', //Creamy Seefood Soup
		'Item_Cook_F_03', //Veggie Cream Soup
		'Item_Cook_F_04', //Creamy Heart Soup
		'Item_Cook_G_02', //Seafood Rice Balls
		'Item_Cook_G_03', //Veggie Rice Balls
		'Item_Cook_G_04', //Mushroom Rice Balls
		'Item_Cook_G_05', //Meat and Rice Ball
		'Item_Cook_G_06', //Prime Meat and Rice Ball
		'Item_Cook_G_09', //Gourmet Meat and Rice Ball
		'Item_Cook_G_10', //Seafood Fried Rice
		'Item_Cook_G_11', //Curry Pilaf
		'Item_Cook_G_12', //Mushroom Risotto
		'Item_Cook_G_13', //Vegetable Risotto
		'Item_Cook_G_14', //Salmon Risotto
		'Item_Cook_G_15', //Meaty Rice Balls
		'Item_Cook_G_16', //Crab Omelet with Rice
		'Item_Cook_G_17', //Crab Risotto
		'Item_Cook_H_01', //Seafood Meunière
		'Item_Cook_H_02', //Porgy Meunière
		'Item_Cook_H_03', //Salmon Meunière
		'Item_Cook_I_01', //Fruit Pie
		'Item_Cook_I_02', //Apple Pie
		'Item_Cook_I_03', //Egg Tart
		'Item_Cook_I_04', //Meat Pie
		'Item_Cook_I_05', //Carrot Cake
		'Item_Cook_I_06', //Pumpkin Pie
		'Item_Cook_I_07', //Hot Buttered Apple
		'Item_Cook_I_08', //Honeyed Apple
		'Item_Cook_I_09', //Honeyed Fruits
		'Item_Cook_I_10', //Plain Crepe
		'Item_Cook_I_11', //Wildberry Crepe
		'Item_Cook_I_12', //Nutcake
		'Item_Cook_I_13', //Fried Bananas
		'Item_Cook_I_14', //Egg Pudding
		'Item_Cook_I_15', //Fish Pie
		'Item_Cook_I_16', //Honey Candy
		'Item_Cook_I_17', //Honey Crepe
		'Item_Cook_J_01', //Curry Rice
		'Item_Cook_J_02', //Vegetable Curry
		'Item_Cook_J_03', //Seafood Curry
		'Item_Cook_J_04', //Poultry Curry
		'Item_Cook_J_05', //Prime Poultry Curry
		'Item_Cook_J_06', //Meat Curry
		'Item_Cook_J_07', //Prime Meat Curry
		'Item_Cook_J_08', //Gourmet Poultry Curry
		'Item_Cook_J_09', //Gourmet Meat Curry
		'Item_Cook_K_01', //Meat Stew
		'Item_Cook_K_02', //Prime Meat Stew
		'Item_Cook_K_03', //Pumpkin Stew
		'Item_Cook_K_04', //Snail Chowder
		'Item_Cook_K_05', //Gourmet Meat Stew
		'Item_Cook_K_06', //Cream of Mushroom Soup
		'Item_Cook_K_07', //Cream of Vegetable Soup
		'Item_Cook_K_08', //Carrot Stew
		'Item_Cook_K_09', //Milk
		'Item_Cook_L_01', //Monster Stew
		'Item_Cook_L_02', //Monster Soup
		'Item_Cook_L_03', //Monster Cake
		'Item_Cook_L_04', //Monster Rice Ball
		'Item_Cook_L_05', //Monster Curry
		'Item_Cook_M_01', //Wheat Bread
		'Item_Cook_N_01', //Seafood Paella
		'Item_Cook_N_02', //Fruitcake
		'Item_Cook_N_03', //Vegetable Omelet
		'Item_Cook_N_04', //Mushroom Omelet
		'Item_Cook_O_01', //Dubious Food
		'Item_Cook_O_02', //Rock-Hard Food
		'Item_Cook_P_01', //Fragrant Mushroom Sauté
		'Item_Cook_P_02', //Herb Sauté
		'Item_Cook_P_03', //Spiced Meat Skewer
		'Item_Cook_P_04', //Prime Spiced Meat Skewer
		'Item_Cook_P_05', //Gourmet Spiced Meat Skewer

		'Item_Cook_Q_01', //Simmered Tomato
		'Item_Cook_Q_02', //Fruity Tomato Stew
		'Item_Cook_Q_03', //Steamed Tomatoes
		'Item_Cook_Q_04', //Tomato Mushroom Stew
		'Item_Cook_Q_05', //Tomato Seafood Soup
		'Item_Cook_Q_06', //Cooked Stambulb
		'Item_Cook_Q_07', //Buttered Stambulb
		'Item_Cook_Q_08', //Crunchy Fried Rice
		'Item_Cook_Q_09', //Cheesecake
		'Item_Cook_Q_10', //Cheesy Risotto
		'Item_Cook_R_01', //Cheesy Omelette
		'Item_Cook_R_02', //Veggie Porridge
		'Item_Cook_R_03', //Noble Pursuit
		'Item_Cook_R_04', //Hylian Tomato Pizza
		'Item_Cook_R_05', //Fragrant Seafood Stew
		'Item_Cook_R_06', //Deep-Fried Drumstick
		'Item_Cook_R_07', //Deep-Fried Thigh
		'Item_Cook_R_08', //Deep-Fried Bird Roast
		'Item_Cook_R_09', //Melty Cheesy Bread
		'Item_Cook_R_10', //Cheesy Baked Fish
		'Item_Cook_S_01', //Cheesy Curry
		'Item_Cook_S_02', //Cheesy Meat Bowl
		'Item_Cook_S_03', //Prime Cheesy Meat Bowl
		'Item_Cook_S_04', //Gourmet Cheesy Meat Bowl
		'Item_Cook_S_05', //Dark Stew
		'Item_Cook_S_06', //Dark Rice Ball
		'Item_Cook_S_07', //Dark Soup
		'Item_Cook_S_08', //Dark Curry
		'Item_Cook_S_09', //Dark Cake
		'Item_Cook_S_10' //Cheesy Tomat
	],

	'devices':[
		'SpObj_WindGenerator_Capsule_A_01', //Fan
		'SpObj_LiftGeneratorWing_Capsule_A_01', //Wing
		'SpObj_Cart_Capsule_A_01', //Cart
		'SpObj_BalloonEnvelope_Capsule_A_01', //Balloon
		'SpObj_Rocket_Capsule_A_01', //Rocket
		'SpObj_TimerBomb_Capsule_A_01', //Time Bomb
		'SpObj_CookSet_Capsule_A_01', //Portable Pot
		'SpObj_FlameThrower_Capsule_A_01', //Flame Emitter
		'SpObj_SnowMachine_Capsule_A_01', //Frost Emitter
		'SpObj_ElectricBoxGenerator_Capsule_A_01', //Shock Emitter
		'SpObj_Beamos_Capsule_A_01', //Beam Emitter
		'SpObj_LiftableWaterPump_Capsule_A_01', //Hydrant
		'SpObj_ControlStick_Capsule_A_01', //Steering Stick
		'SpObj_FastWheel_Capsule_B_01', //Big Wheel
		'SpObj_FastWheel_Capsule_A_01', //Small Wheel
		'SpObj_SlipBoard_Capsule_A_01', //Sled
		'SpObj_EnergyBank_Capsule_A_01', //Battery
		'SpObj_EnergyBank_Capsule_A_02', //Big Battery
		'SpObj_SpringPiston_Capsule_A_01', //Spring
		'SpObj_Cannon_Capsule_A_01', //Cannon
		'SpObj_TiltingDoll_Capsule_A_01', //Stabilizer
		'SpObj_FloatingStone_Capsule_A_01', //Hover Stone
		'SpObj_FlashLight_Capsule_A_01', //Light
		'SpObj_Pile_Capsule_A_01', //Stake
		'SpObj_LightMirror_Capsule_A_01', //Mirror
		'SpObj_Chaser_Capsule_A_01', //Homing Cart
		'SpObj_GolemHead_Capsule_A_01' //Construct Head
	],

	'key':[
		'Obj_DRStone_Get', //Purah Pad
		'Parasail', //Paraglider
		'Obj_Battery_Get', //Energy Cell
		//Obj_Battery_Get_Capacity[03-48]:"Energy Cell[48]
		//'Obj_EnergyUtuwa_A_01', //Energy Well
		'Obj_DungeonClearSeal', //Light of Blessing
		'Obj_SageWill', //Sage's Will
		'CaveMasterMedal', //Bubbul Gem
		'Obj_KorokNuts', //Korok Seed
		'Obj_ProofKorok', //Hestu's Gift
		'Energy_Material_01', //Crystallized Charge
		'MinusRupee_00', //Poe
		'Obj_StableHostlePointCard', //Pony Points Card

		'Obj_DefeatHonor_00', //Stone Talus Monster Medal
		'Obj_DefeatHonor_01', //Hinox Monster Medal
		'Obj_DefeatHonor_02', //Molduga Monster Medal
		'Obj_DefeatHonor_03', //Frox Monster Medal
		'Obj_DefeatHonor_04', //Flux Construct Monster Medal
		'Obj_DefeatHonor_05', //Gleeok Monster Medal

		'Obj_SageSoul_Gerudo', //Vow of Riju, Sage of Lightning
		'Obj_SageSoul_Goron', //Vow of Yunobo, Sage of Fire
		'Obj_SageSoul_Rito', //Vow of Tulin, Sage of Wind
		'Obj_SageSoul_Zonau', //Vow of Mineru, Sage of Spirit
		'Obj_SageSoul_Zora', //Vow of Sidon, Sage of Water
		'Obj_SageSoulPlus_Gerudo', //Solemn Vow of Riju, Sage of Lightning
		'Obj_SageSoulPlus_Goron', //Solemn Vow of Yunobo, Sage of Fire
		'Obj_SageSoulPlus_Rito', //Solemn Vow of Tulin, Sage of Wind
		'Obj_SageSoulPlus_Zonau', //Solemn Vow of Mineru, Sage of Spirit
		'Obj_SageSoulPlus_Zora', //Solemn Vow of Sidon, Sage of Water

		//'GameRomHorseReins_00', //Stable Bridle
		'GameRomHorseReins_01', //Traveler's Bridle
		'GameRomHorseReins_02', //Royal Reins
		'GameRomHorseReins_03', //Knight's Bridle
		'GameRomHorseReins_04', //Monster Bridle
		'GameRomHorseReins_05', //Extravagant Bridle
		//'GameRomHorseSaddle_00', //Stable Saddle
		'GameRomHorseSaddle_01', //Traveler's Saddle
		'GameRomHorseSaddle_02', //Royal Saddle
		'GameRomHorseSaddle_03', //Knight's Saddle
		'GameRomHorseSaddle_04', //Monster Saddle
		'GameRomHorseSaddle_05', //Extravagant Saddle
		'GameRomHorseSaddle_07', //Towing Harness

		'Obj_Camera', //Camera
		'Obj_WarpDLC', //Travel Medallion
		'Obj_WarpDLC_Prototype', //Travel Medallion prototype
		//'Obj_AutoBuilder', //Autobuild
		//'Obj_Tooreroof', //Ascend
		'Obj_TreasureMap_00', //Old Map
		'Item_StableHostelAccommodationCoupon_A', //Sleepover Ticket
		'Obj_CaveWellHonor_00', //All's Well
		'Obj_CheckPointHonor_00', //Dispelling Darkness Medal
		'Obj_AutoBuilderDraft_00', //Schema Stone
		'Obj_AutoBuilderDraftAssassin_00', //Yiga Schematic
		'Obj_HiddenScroll_00', //Earthwake Manual

		'Obj_SubstituteCloth_Default', //Ordinary Fabric
		'Obj_SubstituteCloth_00', //Goron Fabric
		'Obj_SubstituteCloth_01', //Zora Fabric
		'Obj_SubstituteCloth_02', //Gerudo Fabric
		'Obj_SubstituteCloth_03', //Royal Hyrulean Fabric
		'Obj_SubstituteCloth_04', //Zonai Fabric
		'Obj_SubstituteCloth_05', //Sheikah Fabric
		'Obj_SubstituteCloth_06', //Yiga Fabric
		'Obj_SubstituteCloth_07', //Monster-Control-Crew Fabric
		'Obj_SubstituteCloth_08', //Zonai Survey Team Fabric
		'Obj_SubstituteCloth_09', //Horse-God Fabric
		'Obj_SubstituteCloth_10', //Lurelin Village Fabric
		'Obj_SubstituteCloth_11', //Lucky Clover Gazette Fabric
		'Obj_SubstituteCloth_12', //Hudson Construction Fabric
		'Obj_SubstituteCloth_13', //Koltin's Fabric
		'Obj_SubstituteCloth_14', //Korok Fabric
		'Obj_SubstituteCloth_15', //Grizzlemaw-Bear Fabric
		'Obj_SubstituteCloth_16', //Robbie's Fabric
		'Obj_SubstituteCloth_17', //Cece Fabric
		'Obj_SubstituteCloth_18', //Aerocuda Fabric
		'Obj_SubstituteCloth_19', //Eldin-Ostrich Fabric
		'Obj_SubstituteCloth_20', //Cucco Fabric
		'Obj_SubstituteCloth_21', //Horse Fabric
		'Obj_SubstituteCloth_22', //Chuchu Fabric
		'Obj_SubstituteCloth_23', //Lynel Fabric
		'Obj_SubstituteCloth_24', //Gleeok Fabric
		'Obj_SubstituteCloth_25', //Stalnox Fabric
		'Obj_SubstituteCloth_26', //Tunic of Memories Fabric
		'Obj_SubstituteCloth_27', //Hylian-Hood Fabric
		'Obj_SubstituteCloth_28', //Hyrule-Princess Fabric
		'Obj_SubstituteCloth_29', //Goron-Champion Fabric
		'Obj_SubstituteCloth_30', //Rito-Champion Fabric
		'Obj_SubstituteCloth_31', //Zora-Champion Fabric
		'Obj_SubstituteCloth_32', //Gerudo-Champion Fabric
		'Obj_SubstituteCloth_33', //Ancient-Sheikah Fabric
		'Obj_SubstituteCloth_34', //Bokoblin Fabric
		'Obj_SubstituteCloth_35', //Demon King Fabric
		'Obj_SubstituteCloth_36', //King of Red Lions Fabric
		'Obj_SubstituteCloth_37', //Sheik Fabric
		'Obj_SubstituteCloth_38', //Mirror of Twilight Fabric
		'Obj_SubstituteCloth_39', //Princess of Twilight Fabric
		'Obj_SubstituteCloth_40', //Lon Lon Ranch Fabric
		'Obj_SubstituteCloth_41', //Majora's Mask Fabric
		'Obj_SubstituteCloth_43', //Bygone-Royal Fabric
		'Obj_SubstituteCloth_45', //Sword-Spirit Fabric
		'Obj_SubstituteCloth_46', //Pixel Fabric
		'Obj_SubstituteCloth_48', //Egg Fabric
		'Obj_SubstituteCloth_49', //Goddess Fabric
		'Obj_SubstituteCloth_51', //Champion's Leathers Fabric
		'Obj_SubstituteCloth_52', //Princess Zelda Fabric
		'Obj_SubstituteCloth_53', //Gerudo-King Fabric
		'Obj_SubstituteCloth_55', //Nostalgic Fabric
		'Obj_SubstituteCloth_56' //Addison's Fabric
	]
};


Item.VALID_ELIXIR_EFFECTS=['AllSpeed','AttackUp','DefenseUp','ExStaminaMaxUp','LifeMaxUp','LightEmission','NotSlippy','QuietnessUp','ResistBurn','ResistCold','ResistElectric','ResistHot','StaminaRecover'];
Item.VALID_ELIXIR_EFFECTS.forEach(hash);