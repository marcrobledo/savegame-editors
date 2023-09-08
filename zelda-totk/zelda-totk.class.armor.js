/*
	The legend of Zelda: Tears of the Kingdom savegame editor - Armor class (last update 2023-09-08)

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Armor(itemData, overrideId){
	this.category='armors';

	this.id=overrideId || itemData.id;
	this.dyeColor=Variable.enumToInt(itemData.dyeColor);
}
Armor.prototype.getBaseId=function(){
	return Armor.INFO[this.id]?.base;
}
Armor.prototype.canBeUpgraded=function(){
	return Armor.INFO[this.id]?.upgradeable;
}
Armor.prototype.upgrade=function(){
	var upgradeId=this.canBeUpgraded();
	if(upgradeId)
		this.id=upgradeId;

	return upgradeId;
}
Armor.prototype.canBeDyed=function(){
	return Armor.INFO[this.id]?.dyeable;
}
Armor.prototype.getItemTranslation=function(){
	return _(this.id);
}
Armor.prototype.export=function(){
	return{
		totkStruct:Pouch.getCategoryItemStructId(this.category),
		id:this.id,
		dyeColor:this.dyeColor
	}
}
Armor.prototype.refreshHtmlInputs=function(fixValues){
	this._htmlInputs.dyeColor.disabled=!this.canBeDyed();
	Pouch.updateItemIcon(this);
}



Armor.buildHtmlElements=function(item){
	item._htmlInputs={
		dyeColor:Pouch.createItemInput(item, 'dyeColor', 'Enum', {enumValues:Armor.OPTIONS_DYE_COLORS, label:_('Dye color')})
	};
}



Armor.OPTIONS_DYE_COLORS=[
	{originalName:'Default color', value:hash('None')},
	{originalName:'Blue', value:hash('Blue')},
	{originalName:'Red', value:hash('Red')},
	{originalName:'Yellow', value:hash('Yellow')},
	{originalName:'White', value:hash('White')},
	{originalName:'Black', value:hash('Black')},
	{originalName:'Purple', value:hash('Purple')},
	{originalName:'Green', value:hash('Green')},
	{originalName:'Light blue', value:hash('LightBlue')},
	{originalName:'Navy', value:hash('Navy')},
	{originalName:'Orange', value:hash('Orange')},
	{originalName:'Pink', value:hash('Pink')},
	{originalName:'Crimson', value:hash('Crimson')},
	{originalName:'Light yellow', value:hash('LightYellow')},
	{originalName:'Brown', value:hash('Brown')},
	{originalName:'Gray', value:hash('Gray')}
];
Armor.AVAILABILITY=[
	'Armor_001_Head','Armor_002_Head','Armor_003_Head','Armor_004_Head','Armor_015_Head', //Hylian Hood
	'Armor_1152_Head','Armor_1153_Head','Armor_1154_Head','Armor_1155_Head','Armor_1156_Head', //Hylian Hood (lowered)
	'Armor_001_Upper','Armor_002_Upper','Armor_003_Upper','Armor_004_Upper','Armor_015_Upper', //Hylian Tunic
	'Armor_001_Lower','Armor_002_Lower','Armor_003_Lower','Armor_004_Lower','Armor_015_Lower', //Hylian Trousers

	'Armor_005_Head','Armor_035_Head','Armor_039_Head','Armor_060_Head','Armor_061_Head', //Cap of the Wild
	'Armor_005_Upper','Armor_035_Upper','Armor_039_Upper','Armor_060_Upper','Armor_061_Upper', //Tunic of the Wild
	'Armor_005_Lower','Armor_035_Lower','Armor_039_Lower','Armor_060_Lower','Armor_061_Lower', //Trousers of the Wild

	'Armor_006_Head','Armor_007_Head','Armor_062_Head','Armor_063_Head','Armor_064_Head', //Zora Helm
	'Armor_006_Upper','Armor_007_Upper','Armor_062_Upper','Armor_063_Upper','Armor_064_Upper', //Zora Armor
	'Armor_006_Lower','Armor_007_Lower','Armor_062_Lower','Armor_063_Lower','Armor_064_Lower', //Zora Greaves

	'Armor_008_Head','Armor_040_Head','Armor_065_Head','Armor_066_Head','Armor_067_Head', //Desert Voe Headband
	'Armor_008_Upper','Armor_040_Upper','Armor_065_Upper','Armor_066_Upper','Armor_067_Upper', //Desert Voe Spaulder
	'Armor_008_Lower','Armor_040_Lower','Armor_065_Lower','Armor_066_Lower','Armor_067_Lower', //Desert Voe Trousers

	'Armor_009_Head','Armor_036_Head','Armor_071_Head','Armor_072_Head','Armor_073_Head', //Snowquill Headdress
	'Armor_009_Upper','Armor_036_Upper','Armor_071_Upper','Armor_072_Upper','Armor_073_Upper', //Snowquill Tunic
	'Armor_009_Lower','Armor_036_Lower','Armor_071_Lower','Armor_072_Lower','Armor_073_Lower', //Snowquill Trousers

	'Armor_011_Head','Armor_037_Head','Armor_074_Head','Armor_075_Head','Armor_076_Head', //Flamebreaker Helm
	'Armor_011_Upper','Armor_037_Upper','Armor_074_Upper','Armor_075_Upper','Armor_076_Upper', //Flamebreaker Armor
	'Armor_011_Lower','Armor_037_Lower','Armor_074_Lower','Armor_075_Lower','Armor_076_Lower', //Flamebreaker Boots

	'Armor_012_Head','Armor_042_Head','Armor_077_Head','Armor_078_Head','Armor_079_Head', //Stealth Mask
	'Armor_012_Upper','Armor_042_Upper','Armor_077_Upper','Armor_078_Upper','Armor_079_Upper', //Stealth Chest Guard
	'Armor_012_Lower','Armor_042_Lower','Armor_077_Lower','Armor_078_Lower','Armor_079_Lower', //Stealth Tights

	'Armor_014_Head','Armor_083_Head','Armor_084_Head','Armor_085_Head','Armor_086_Head', //Climber's Bandanna
	'Armor_014_Upper','Armor_083_Upper','Armor_084_Upper','Armor_085_Upper','Armor_086_Upper', //Climbing Gear
	'Armor_014_Lower','Armor_083_Lower','Armor_084_Lower','Armor_085_Lower','Armor_086_Lower', //Climbing Boots

	'Armor_017_Head','Armor_087_Head','Armor_088_Head','Armor_089_Head','Armor_090_Head', //Radiant Mask
	'Armor_017_Upper','Armor_087_Upper','Armor_088_Upper','Armor_089_Upper','Armor_090_Upper', //Radiant Shirt
	'Armor_017_Lower','Armor_087_Lower','Armor_088_Lower','Armor_089_Lower','Armor_090_Lower', //Radiant Tights

	'Armor_020_Head','Armor_095_Head','Armor_096_Head','Armor_097_Head','Armor_098_Head', //Soldier's Helm
	'Armor_020_Upper','Armor_095_Upper','Armor_096_Upper','Armor_097_Upper','Armor_098_Upper', //Soldier's Armor
	'Armor_020_Lower','Armor_095_Lower','Armor_096_Lower','Armor_097_Lower','Armor_098_Lower', //Soldier's Greaves

	'Armor_024_Head','Armor_117_Head','Armor_118_Head','Armor_119_Head','Armor_120_Head', //Diamond Circlet
	'Armor_025_Head','Armor_121_Head','Armor_122_Head','Armor_123_Head','Armor_124_Head', //Ruby Circlet
	'Armor_026_Head','Armor_125_Head','Armor_126_Head','Armor_127_Head','Armor_128_Head', //Sapphire Circlet
	'Armor_027_Head','Armor_129_Head','Armor_130_Head','Armor_131_Head','Armor_132_Head', //Topaz Earrings
	'Armor_028_Head','Armor_133_Head','Armor_134_Head','Armor_135_Head','Armor_136_Head', //Opal Earrings
	'Armor_029_Head','Armor_137_Head','Armor_138_Head','Armor_139_Head','Armor_140_Head', //Amber Earrings

	'Armor_046_Head','Armor_103_Head','Armor_104_Head','Armor_105_Head','Armor_106_Head', //Rubber Helm
	'Armor_046_Upper','Armor_103_Upper','Armor_104_Upper','Armor_105_Upper','Armor_106_Upper', //Rubber Armor
	'Armor_046_Lower','Armor_103_Lower','Armor_104_Lower','Armor_105_Lower','Armor_106_Lower', //Rubber Tights

	'Armor_048_Head','Armor_111_Head','Armor_112_Head','Armor_113_Head','Armor_114_Head', //Barbarian Helm
	'Armor_048_Upper','Armor_111_Upper','Armor_112_Upper','Armor_113_Upper','Armor_114_Upper', //Barbarian Armor
	'Armor_048_Lower','Armor_111_Lower','Armor_112_Lower','Armor_113_Lower','Armor_114_Lower', //Barbarian Leg Wraps

	'Armor_049_Lower','Armor_152_Lower','Armor_153_Lower','Armor_154_Lower','Armor_155_Lower', //Sand Boots

	'Armor_022_Head', //Bokoblin Mask
	'Armor_045_Head', //Moblin Mask
	'Armor_055_Head', //Lizalfos Mask
	'Armor_056_Head', //Lynel Mask
	'Armor_1125_Head', //Horriblin Mask

	'Armor_115_Head', //Lightning Helm

	'Armor_116_Upper','Armor_148_Upper','Armor_149_Upper','Armor_150_Upper','Armor_151_Upper', //Tunic of Memories

	'Armor_141_Lower','Armor_156_Lower','Armor_157_Lower','Armor_158_Lower','Armor_159_Lower', //Snow Boots

	'Armor_160_Head', //Dark Hood
	'Armor_160_Upper', //Dark Tunic
	'Armor_160_Lower', //Dark Trousers

	'Armor_171_Head', //Phantom Helmet
	'Armor_171_Upper', //Phantom Armor
	'Armor_171_Lower', //Phantom Greaves

	'Armor_172_Head', //Majora's Mask

	'Armor_173_Head', //Midna's Helmet

	'Armor_174_Head', //Tingle's Hood
	'Armor_174_Upper', //Tingle's Shirt
	'Armor_174_Lower', //Tingle's Tights

	'Armor_175_Upper', //Island Lobster Shirt

	'Armor_176_Head', //Korok Mask

	'Armor_177_Head', //Ravio's Hood

	'Armor_178_Head', //Zant's Helmet

	'Armor_179_Head','Armor_1146_Head','Armor_1147_Head','Armor_1148_Head','Armor_1149_Head', //Royal Guard Cap
	'Armor_179_Upper','Armor_1146_Upper','Armor_1147_Upper','Armor_1148_Upper','Armor_1149_Upper', //Royal Guard Uniform
	'Armor_179_Lower','Armor_1146_Lower','Armor_1147_Lower','Armor_1148_Lower','Armor_1149_Lower', //Royal Guard Boots



	'Armor_180_Head', //Evil Spirit Mask
	'Armor_180_Upper', //Evil Spirit Armor
	'Armor_180_Lower', //Evil Spirit Greaves

	'Armor_181_Head','Armor_186_Head','Armor_187_Head','Armor_188_Head','Armor_189_Head', //Vah Ruta Divine Helm
	'Armor_182_Head','Armor_190_Head','Armor_191_Head','Armor_192_Head','Armor_193_Head', //Vah Medoh Divine Helm
	'Armor_183_Head','Armor_194_Head','Armor_195_Head','Armor_196_Head','Armor_197_Head', //Vah Rudania Divine Helm
	'Armor_184_Head','Armor_198_Head','Armor_199_Head','Armor_168_Head','Armor_169_Head', //Vah Naboris Divine Helm

	'Armor_200_Head','Armor_201_Head','Armor_202_Head','Armor_203_Head','Armor_204_Head', //Cap of Time
	'Armor_200_Upper','Armor_201_Upper','Armor_202_Upper','Armor_203_Upper','Armor_204_Upper', //Tunic of Time
	'Armor_200_Lower','Armor_201_Lower','Armor_202_Lower','Armor_203_Lower','Armor_204_Lower', //Trousers of Time

	'Armor_205_Head','Armor_206_Head','Armor_207_Head','Armor_208_Head','Armor_209_Head', //Cap of the Wind
	'Armor_205_Upper','Armor_206_Upper','Armor_207_Upper','Armor_208_Upper','Armor_209_Upper', //Tunic of the Wind
	'Armor_205_Lower','Armor_206_Lower','Armor_207_Lower','Armor_208_Lower','Armor_209_Lower', //Trousers of the Wind

	'Armor_210_Head','Armor_211_Head','Armor_212_Head','Armor_213_Head','Armor_214_Head', //Cap of Twilight
	'Armor_210_Upper','Armor_211_Upper','Armor_212_Upper','Armor_213_Upper','Armor_214_Upper', //Tunic of Twilight
	'Armor_210_Lower','Armor_211_Lower','Armor_212_Lower','Armor_213_Lower','Armor_214_Lower', //Trousers of Twilight

	'Armor_215_Head','Armor_216_Head','Armor_217_Head','Armor_218_Head','Armor_219_Head', //Cap of the Sky
	'Armor_215_Upper','Armor_216_Upper','Armor_217_Upper','Armor_218_Upper','Armor_219_Upper', //Tunic of the Sky
	'Armor_215_Lower','Armor_216_Lower','Armor_217_Lower','Armor_218_Lower','Armor_219_Lower', //Trousers of the Sky

	'Armor_220_Head','Armor_221_Head','Armor_222_Head','Armor_223_Head','Armor_224_Head', //Sheik's Mask

	'Armor_225_Head','Armor_226_Head','Armor_227_Head','Armor_228_Head','Armor_229_Head', //Fierce Deity Mask
	'Armor_225_Upper','Armor_226_Upper','Armor_227_Upper','Armor_228_Upper','Armor_229_Upper', //Fierce Deity Armor
	'Armor_225_Lower','Armor_226_Lower','Armor_227_Lower','Armor_228_Lower','Armor_229_Lower', //Fierce Deity Boots

	'Armor_230_Head','Armor_231_Head','Armor_232_Head','Armor_233_Head','Armor_234_Head', //Cap of the Hero
	'Armor_230_Upper','Armor_231_Upper','Armor_232_Upper','Armor_233_Upper','Armor_234_Upper', //Tunic of the Hero
	'Armor_230_Lower','Armor_231_Lower','Armor_232_Lower','Armor_233_Lower','Armor_234_Lower', //Trousers of the Hero



	'Armor_1006_Head','Armor_1007_Head','Armor_1008_Head','Armor_1009_Head','Armor_1010_Head', //Glide Mask
	'Armor_1006_Upper','Armor_1007_Upper','Armor_1008_Upper','Armor_1009_Upper','Armor_1010_Upper', //Glide Shirt
	'Armor_1006_Lower','Armor_1007_Lower','Armor_1008_Lower','Armor_1009_Lower','Armor_1010_Lower', //Glide Tights

	'Armor_1036_Head','Armor_1037_Head','Armor_1038_Head','Armor_1039_Head','Armor_1040_Head', //Ancient Hero's Aspect

	'Armor_1043_Upper', //Archaic Tunic
	'Armor_1043_Lower', //Archaic Legwear
	'Armor_1044_Lower', //Archaic Warm Greaves

	'Armor_1046_Head','Armor_1047_Head','Armor_1048_Head','Armor_1049_Head','Armor_1050_Head', //Froggy Hood
	'Armor_1046_Upper','Armor_1047_Upper','Armor_1048_Upper','Armor_1049_Upper','Armor_1050_Upper', //Froggy Sleeve
	'Armor_1046_Lower','Armor_1047_Lower','Armor_1048_Lower','Armor_1049_Lower','Armor_1050_Lower', //Froggy Leggings

	'Armor_1051_Head','Armor_1052_Head','Armor_1053_Head','Armor_1054_Head','Armor_1055_Head', //Miner's Mask
	'Armor_1051_Upper','Armor_1052_Upper','Armor_1053_Upper','Armor_1054_Upper','Armor_1055_Upper', //Miner's Top
	'Armor_1051_Lower','Armor_1052_Lower','Armor_1053_Lower','Armor_1054_Lower','Armor_1055_Lower', //Miner's Trousers

	'Armor_1061_Head','Armor_1062_Head','Armor_1063_Head','Armor_1064_Head','Armor_1065_Head', //Ember Headdress
	'Armor_1061_Upper','Armor_1062_Upper','Armor_1063_Upper','Armor_1064_Upper','Armor_1065_Upper', //Ember Shirt
	'Armor_1061_Lower','Armor_1062_Lower','Armor_1063_Lower','Armor_1064_Lower','Armor_1065_Lower', //Ember Trousers

	'Armor_1066_Head','Armor_1067_Head','Armor_1068_Head','Armor_1069_Head','Armor_1070_Head', //Charged Headdress
	'Armor_1066_Upper','Armor_1067_Upper','Armor_1068_Upper','Armor_1069_Upper','Armor_1070_Upper', //Charged Shirt
	'Armor_1066_Lower','Armor_1067_Lower','Armor_1068_Lower','Armor_1069_Lower','Armor_1070_Lower', //Charged Trousers

	'Armor_1071_Head','Armor_1072_Head','Armor_1073_Head','Armor_1074_Head','Armor_1075_Head', //Frostbite Headdress
	'Armor_1071_Upper','Armor_1072_Upper','Armor_1073_Upper','Armor_1074_Upper','Armor_1075_Upper', //Frostbite Shirt
	'Armor_1071_Lower','Armor_1072_Lower','Armor_1073_Lower','Armor_1074_Lower','Armor_1075_Lower', //Frostbite Trousers

	'Armor_1076_Head', //Cece Hat

	'Armor_1086_Head', //Mystic Headpiece
	'Armor_1086_Upper', //Mystic Robe
	'Armor_1086_Lower', //Mystic Trousers

	'Armor_1091_Head','Armor_1092_Head','Armor_1093_Head','Armor_1094_Head','Armor_1095_Head', //Zonaite Helm
	'Armor_1091_Upper','Armor_1092_Upper','Armor_1093_Upper','Armor_1094_Upper','Armor_1095_Upper', //Zonaite Waistguard
	'Armor_1091_Lower','Armor_1092_Lower','Armor_1093_Lower','Armor_1094_Lower','Armor_1095_Lower', //Zonaite Shin Guards

	'Armor_1096_Head','Armor_1097_Head','Armor_1098_Head','Armor_1099_Head','Armor_1100_Head', //Mask of Awakening
	'Armor_1096_Upper','Armor_1097_Upper','Armor_1098_Upper','Armor_1099_Upper','Armor_1100_Upper', //Tunic of Awakening
	'Armor_1096_Lower','Armor_1097_Lower','Armor_1098_Lower','Armor_1099_Lower','Armor_1100_Lower', //Trousers of Awakening

	'Armor_1106_Upper','Armor_1107_Upper','Armor_1108_Upper','Armor_1109_Upper','Armor_1110_Upper', //Champion's Leather

	'Armor_1141_Head','Armor_1142_Head','Armor_1143_Head','Armor_1144_Head','Armor_1145_Head', //Hood of the Depths
	'Armor_1141_Upper','Armor_1142_Upper','Armor_1143_Upper','Armor_1144_Upper','Armor_1145_Upper', //Tunic of the Depths
	'Armor_1141_Lower','Armor_1142_Lower','Armor_1143_Lower','Armor_1144_Lower','Armor_1145_Lower', //Gaiters of the Depths

	'Armor_1151_Head', //Well-Worn Hair Band

	'Armor_1300_Head','Armor_1301_Head','Armor_1302_Head','Armor_1303_Head','Armor_1304_Head', //Yiga Mask
	'Armor_1300_Upper','Armor_1301_Upper','Armor_1302_Upper','Armor_1303_Upper','Armor_1304_Upper', //Yiga Armor
	'Armor_1300_Lower','Armor_1301_Lower','Armor_1302_Lower','Armor_1303_Lower','Armor_1304_Lower', //Yiga Tight

	'Armor_1150_Upper' //*Tunic of memories (intro, unused)
];

Armor.INFO=(function(upgrades, dyeables){
	var info={};
	Armor.AVAILABILITY.forEach(function(itemId){
		var numberId=itemId.replace(/[^\d]/g,'');

		var level=null;
		var base=itemId;
		var upgradeable=false;
		for(var i=0; i<upgrades.length; i++){
			var index=upgrades[i].indexOf(numberId);
			if(index!==-1){
				level=index;
				base=itemId.replace(/\d+/, upgrades[i][0]);
				if(index<4)
					upgradeable=itemId.replace(/\d+/, upgrades[i][index+1]);
				break;
			}
		}

		var dyeable=dyeables.indexOf(base.replace(/[^\d]/g,''))!==-1;

		info[itemId]={
			base:base,
			level:level,
			upgradeable:upgradeable,
			dyeable:dyeable
		}
	});
	return info;
}([
	/* upgrades */
	['1152','1153','1154','1155','1156'], //Hylian Hood (lowered)
	['001','002','003','004','015'], //Hylian Hood/Tunic/Hylian Trousers
	['005','035','039','060','061'], //Cap/Tunic/Trousers of the Wild
	['006','007','062','063','064'], //Zora Helm/Armor/Greaves
	['008','040','065','066','067'], //Desert Voe Headband/Spaulder/Trousers
	['009','036','071','072','073'], //Snowquill Headdress/Tunic/Trousers
	['011','037','074','075','076'], //Flamebreaker Helm/Armor/Boots
	['012','042','077','078','079'], //Stealth Mask/Chest Guard/Tights
	['014','083','084','085','086'], //Climbers Bandanna/Gear/Boots
	['017','087','088','089','090'], //Radiant Mask/Shirt/Tights
	['020','095','096','097','098'], //Soldiers Helm/Armor/Greaves
	['024','117','118','119','120'], //Diamond Circlet
	['025','121','122','123','124'], //Ruby Circlet
	['026','125','126','127','128'], //Sapphire Circlet
	['027','129','130','131','132'], //Topaz Earrings
	['028','133','134','135','136'], //Opal Earrings
	['029','137','138','139','140'], //Amber Earrings
	['046','103','104','105','106'], //Rubber Helm/Armor/Tights
	['048','111','112','113','114'], //Barbarian Helm/Armor/Leg Wraps
	['049','152','153','154','155'], //Sand Boots
	['116','148','149','150','151'], //Tunic of Memories
	['141','156','157','158','159'], //Snow Boots
	['179','1146','1147','1148','1149'], //Royal Guard Cap/Uniform/Boots
	['181','186','187','188','189'], //Vah Ruta Divine Helm
	['182','190','191','192','193'], //Vah Medoh Divine Helm
	['183','194','195','196','197'], //Vah Rudania Divine Helm
	['184','198','199','168','169'], //Vah Naboris Divine Helm
	['200','201','202','203','204'], //Cap/Tunic/Trousers of Time
	['205','206','207','208','209'], //Cap/Tunic/Trousers of the Wind
	['210','211','212','213','214'], //Cap/Tunic/Trousers of Twilight
	['215','216','217','218','219'], //Cap/Tunic/Trousers of the Sky
	['220','221','222','223','224'], //Sheiks Mask
	['225','226','227','228','229'], //Fierce Deity Mask/Armor/Boots
	['230','231','232','233','234'], //Cap/Tunic/Trousers of the Hero
	['1006','1007','1008','1009','1010'], //Glide Mask/Shirt/Tights
	['1036','1037','1038','1039','1040'], //Ancient Heros Aspect
	['1046','1047','1048','1049','1050'], //Froggy Hood/Sleeve/Leggings
	['1051','1052','1053','1054','1055'], //Miners Mask/Top/Trousers
	['1061','1062','1063','1064','1065'], //Ember Headdress/Shirt/Trousers
	['1066','1067','1068','1069','1070'], //Charged Headdress/Shirt/Trousers
	['1071','1072','1073','1074','1075'], //Frostbite Headdress/Shirt/Trousers
	['1091','1092','1093','1094','1095'], //Zonaite Helm/Waistguard/Shin Guards
	['1096','1097','1098','1099','1100'], //Mask/Tunic/Trousers of Awakening
	['1106','1107','1108','1109','1110'], //Champions Leather
	['1141','1142','1143','1144','1145'], //Hood/Tunic/Gaiters of the Depths
	['1300','1301','1302','1303','1304'] //Yiga Mask/Armor/Tight
], [
	/* dyeable */
	'1043', //Archaic Tunic/Legwear
	'1044', //Archaic Warm Greaves

	'1152', //Hylian Hood (lowered)
	'001', //Hylian Hood/Tunic/Trousers

	'020', //Soldier's Helm/Armor/Greaves
	'009', //Snowquill Headdress/Tunic/Trousers
	'011', //Flamebreaker Helm/Armor/Boots
	'006', //Zora Helm/Armor/Greaves
	'008', //Desert Voe Headband/Spaulde/Trousers
	'046', //Rubber Helm/Armor/Tights
	'012', //Stealth Mask/Chest Guard/Tights
	'014', //Climber's Bandanna/Gear/Boots
	'048', //Barbarian Helm/Armor/Leg Wraps
	'017', //Radiant Mask/Shirt/Tights
	'1046', //Froggy Hood/Sleeve/Leggings
	'1006', //Glide Mask/Shirt/Tights
	'1141', //Hood/Tunic/Gaiters of the Depths
	'1051', //Miner's Mask/Top/Trousers
	'1086', //Mystic Headpiece/Robe/Trousers
	'1061', //Ember Headdress/Shirt/Trousers
	'1066', //Charged Headdress/Shirt/Trousers
	'1071', //Frostbite Headdress/Shirt/Trousers
	'1300', //Yiga Mask/Armor/Tights

	'181', //Vah Ruta Divine Helm
	'182', //Vah Medoh Divine Helm
	'183', //Vah Rudania Divine Helm
	'184', //Vah Naboris Divine Helm

	'1091', //Zonaite Helm/Waistguard/Shin Guards

	'049', //Sand Boots
	'141', //Snow Boots

	'005' //Cap/Tunic/Trousers of the Wild
]));