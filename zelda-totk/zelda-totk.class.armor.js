/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Armor class) v20230605

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Armor(index, id, dyeColor){
	this.category='armors';
	this.index=index;
	this.removable=false;

	this.id=id;
	this.dyeColor=dyeColor || Armor.DYE_NONE;

	this.refreshUpgradeData();
	Armor.buildHtmlElements(this);
	this.refreshHtmlColor();
}
Armor.prototype.isUpgradeable=function(){
	return this.id !== '' && (this?.armorUpgrades || this?.armorBase?.upgrades);
}
Armor.prototype.refreshHtmlColor=function(){
	var colorIndex=this._htmlSelectDyeColor.selectedIndex;
	var colors=['transparent','#2641ea','#ec3b18','#ffe13e','#f8f8f8','#080808','#b03af4','#4bf130','#78e7ff','#527abc','#ff9b2f','#ff85d0','#f62ba7','#ffef98','#8f3a20','#808080']
	this._htmlSpanColor.style.backgroundColor=colors[colorIndex];
}
Armor.prototype.refreshUpgradeData=function(){
	if(this.id === '') return;
	// Base armor is the item itself if not upgraded
	this.armorBase = Armor.AVAILABILITY.find(armor => armor.upgrades?.includes(this.id) || armor.base === this.id);
	// List the available upgrades for a base armor
	this.armorUpgrades = Armor.AVAILABILITY.find(armor => armor.base === this.id)?.upgrades;
	// Find the current upgrade level depending on the index of the item in the upgrades array
	this.armorUpgradeLevel = this.armorBase.upgrades?.indexOf(this.id) + 1 || 0;
}
Armor.prototype.getItemTranslation=function(){
	return Locale._(this.id);
}
Armor.prototype.copy=function(index, newId){
	return new Armor(
		index,
		typeof newId === 'string' ? newId : this.id,
		this.dyeColor
	);
}
Armor.prototype.save=function(){
	SavegameEditor.writeString64('Pouch.Armor.Content.Name', this.index, this.id);
	SavegameEditor.writeU32('Pouch.Armor.Content.ColorVariation', this.index, this.dyeColor);
}
Armor.prototype.fixValues=function(){
	this.refreshUpgradeData();
	Armor.buildHtmlElements(this);
}
Armor.prototype.setUpgradeLevel=function(upgradeLevel){
	if(this.armorBase.upgrades){
		var targetUpgradeId = upgradeLevel > -1 ? this.armorBase.upgrades[upgradeLevel] : this.armorBase.base;
		if(this.id!==targetUpgradeId){
			SavegameEditor.editItem2(this, targetUpgradeId);
		}
	}
}


Armor.buildHtmlElements=function(item){
	//build html elements
	var dyeColors=[
		{name:Locale._('Default color'), value:Armor.DYE_NONE},
		{name:Locale._('Blue'), value:Armor.DYE_BLUE},
		{name:Locale._('Red'), value:Armor.DYE_RED},
		{name:Locale._('Yellow'), value:Armor.DYE_YELLOW},
		{name:Locale._('White'), value:Armor.DYE_WHITE},
		{name:Locale._('Black'), value:Armor.DYE_BLACK},
		{name:Locale._('Purple'), value:Armor.DYE_PURPLE},
		{name:Locale._('Green'), value:Armor.DYE_GREEN},
		{name:Locale._('Light blue'), value:Armor.DYE_LIGHT_BLUE},
		{name:Locale._('Navy'), value:Armor.DYE_NAVY},
		{name:Locale._('Orange'), value:Armor.DYE_ORANGE},
		{name:Locale._('Pink'), value:Armor.DYE_PINK},
		{name:Locale._('Crimson'), value:Armor.DYE_CRIMSON},
		{name:Locale._('Light yellow'), value:Armor.DYE_LIGHT_YELLOW},
		{name:Locale._('Brown'), value:Armor.DYE_BROWN},
		{name:Locale._('Gray'), value:Armor.DYE_GRAY}
	];
	item._htmlSelectDyeColor=select('armor-dye-'+item.category+'-'+item.index, dyeColors, function(){
		item.dyeColor=parseInt(this.value);
		item.refreshHtmlColor();
	}, item.dyeColor);
	item._htmlSelectDyeColor.dataset.translateTitle='Dye color';
	item._htmlSelectDyeColor.title=Locale._('Dye color');

	item._htmlSpanColor=document.createElement('span');
	item._htmlSpanColor.className='dye-color';

	// Regroup the dye-color elements in a div to align the color indicator with the <select>
	item._htmlSelecDyeContainer=document.createElement('div');
	item._htmlSelecDyeContainer.className='dye-color-container';
	item._htmlSelecDyeContainer.appendChild(item._htmlSpanColor);
	item._htmlSelecDyeContainer.appendChild(item._htmlSelectDyeColor);

	// Generate the <select> for the armor upgrade if applicable
	if(item.isUpgradeable()){
		var itemUpgrades = (item.armorUpgrades || item.armorBase.upgrades);
		var baseArmorElement = {name:Locale._('No upgrade'), value: item.armorBase.base }; // First element = the base armor
		var itemUpgradeValues = [
			baseArmorElement,
			...itemUpgrades?.map(
				(upgrade, index) => ({
					name: '★'.repeat(index + 1), // First option = 1 star, 2nd option = 2 stars, etc.
					value: upgrade
				})
			)
		];
		item._htmlSelectArmorUpgrade = select('armor-upgrade-' + item.category + '-' + item.index + '-' + item.id, itemUpgradeValues, function (){
			SavegameEditor.editItem2(item, this.value);
		}, item.id);
		item._htmlSelectArmorUpgrade.dataset.translateTitle='Upgrade level';
		item._htmlSelectArmorUpgrade.title=Locale._('Upgrade level');
	}
}

Armor.readAll=function(){
	var armorIds=SavegameEditor.readString64Array('Pouch.Armor.Content.Name');
	var validArmors=[];
	for(var i=0; i<armorIds.length; i++){
		if(armorIds[i]){
			validArmors.push(new Armor(
				i,
				armorIds[i],
				SavegameEditor.readU32Array('Pouch.Armor.Content.ColorVariation', i)
			));
		}
	}
	return validArmors;
}


Armor.DYE_NONE=0xb6eede09; //None
Armor.DYE_BLUE=0xe2911aba; //Blue
Armor.DYE_RED=0x6e1a9181; //Red
Armor.DYE_YELLOW=0xc03f6678; //Yellow
Armor.DYE_WHITE=0x4402060c; //White
Armor.DYE_BLACK=0x6cbc3cb4; //Black
Armor.DYE_PURPLE=0x7f0ae256; //Purple
Armor.DYE_GREEN=0x7c9b6ddb; //Green
Armor.DYE_LIGHT_BLUE=0x01666931; //LightBlue
Armor.DYE_NAVY=0xadfd3a1; //Navy
Armor.DYE_ORANGE=0x619ec353; //Orange
Armor.DYE_PINK=0xeaf26a09; //Pink
Armor.DYE_CRIMSON=0xf8bdf528; //Crimson
Armor.DYE_LIGHT_YELLOW=0xdf26c6da; //LightYellow
Armor.DYE_BROWN=0xb364bb2c; //Brown
Armor.DYE_GRAY=0x762266bf; //Gray

Armor.AVAILABILITY=[
	{ base: 'Armor_001_Head', upgrades: [ 'Armor_002_Head','Armor_003_Head','Armor_004_Head','Armor_015_Head' ] }, //Hylian Hood
	{ base: 'Armor_1152_Head', upgrades: [ 'Armor_1153_Head','Armor_1154_Head','Armor_1155_Head','Armor_1156_Head' ] }, //Hylian Hood (lowered)
	{ base: 'Armor_001_Upper', upgrades: [ 'Armor_002_Upper','Armor_003_Upper','Armor_004_Upper','Armor_015_Upper' ] }, //Hylian Tunic
	{ base: 'Armor_001_Lower', upgrades: [ 'Armor_002_Lower','Armor_003_Lower','Armor_004_Lower','Armor_015_Lower' ] }, //Hylian Trousers

	{ base: 'Armor_005_Head', upgrades: [ 'Armor_035_Head','Armor_039_Head','Armor_060_Head','Armor_061_Head' ] }, //Cap of the Wild
	{ base: 'Armor_005_Upper', upgrades: [ 'Armor_035_Upper','Armor_039_Upper','Armor_060_Upper','Armor_061_Upper' ] }, //Tunic of the Wild
	{ base: 'Armor_005_Lower', upgrades: [ 'Armor_035_Lower','Armor_039_Lower','Armor_060_Lower','Armor_061_Lower' ] }, //Trousers of the Wild

	{ base: 'Armor_006_Head', upgrades: [ 'Armor_007_Head','Armor_062_Head','Armor_063_Head','Armor_064_Head' ] }, //Zora Helm
	{ base: 'Armor_006_Upper', upgrades: [ 'Armor_007_Upper','Armor_062_Upper','Armor_063_Upper','Armor_064_Upper' ] }, //Zora Armor
	{ base: 'Armor_006_Lower', upgrades: [ 'Armor_007_Lower','Armor_062_Lower','Armor_063_Lower','Armor_064_Lower' ] }, //Zora Greaves

	{ base: 'Armor_008_Head', upgrades: [ 'Armor_040_Head','Armor_065_Head','Armor_066_Head','Armor_067_Head' ] }, //Desert Voe Headband
	{ base: 'Armor_008_Upper', upgrades: [ 'Armor_040_Upper','Armor_065_Upper','Armor_066_Upper','Armor_067_Upper' ] }, //Desert Voe Spaulder
	{ base: 'Armor_008_Lower', upgrades: [ 'Armor_040_Lower','Armor_065_Lower','Armor_066_Lower','Armor_067_Lower' ] }, //Desert Voe Trousers

	{ base: 'Armor_009_Head', upgrades: [ 'Armor_036_Head','Armor_071_Head','Armor_072_Head','Armor_073_Head' ] }, //Snowquill Headdress
	{ base: 'Armor_009_Upper', upgrades: [ 'Armor_036_Upper','Armor_071_Upper','Armor_072_Upper','Armor_073_Upper' ] }, //Snowquill Tunic
	{ base: 'Armor_009_Lower', upgrades: [ 'Armor_036_Lower','Armor_071_Lower','Armor_072_Lower','Armor_073_Lower' ] }, //Snowquill Trousers

	{ base: 'Armor_011_Head', upgrades: [ 'Armor_037_Head','Armor_074_Head','Armor_075_Head','Armor_076_Head' ] }, //Flamebreaker Helm
	{ base: 'Armor_011_Upper', upgrades: [ 'Armor_037_Upper','Armor_074_Upper','Armor_075_Upper','Armor_076_Upper' ] }, //Flamebreaker Armor
	{ base: 'Armor_011_Lower', upgrades: [ 'Armor_037_Lower','Armor_074_Lower','Armor_075_Lower','Armor_076_Lower' ] }, //Flamebreaker Boots

	{ base: 'Armor_012_Head', upgrades: [ 'Armor_042_Head','Armor_077_Head','Armor_078_Head','Armor_079_Head' ] }, //Stealth Mask
	{ base: 'Armor_012_Upper', upgrades: [ 'Armor_042_Upper','Armor_077_Upper','Armor_078_Upper','Armor_079_Upper' ] }, //Stealth Chest Guard
	{ base: 'Armor_012_Lower', upgrades: [ 'Armor_042_Lower','Armor_077_Lower','Armor_078_Lower','Armor_079_Lower' ] }, //Stealth Tights

	{ base: 'Armor_014_Head', upgrades: [ 'Armor_083_Head','Armor_084_Head','Armor_085_Head','Armor_086_Head' ] }, //Climber's Bandanna
	{ base: 'Armor_014_Upper', upgrades: [ 'Armor_083_Upper','Armor_084_Upper','Armor_085_Upper','Armor_086_Upper' ] }, //Climbing Gear
	{ base: 'Armor_014_Lower', upgrades: [ 'Armor_083_Lower','Armor_084_Lower','Armor_085_Lower','Armor_086_Lower' ] }, //Climbing Boots

	{ base: 'Armor_017_Head', upgrades: [ 'Armor_087_Head','Armor_088_Head','Armor_089_Head','Armor_090_Head' ] }, //Radiant Mask
	{ base: 'Armor_017_Upper', upgrades: [ 'Armor_087_Upper','Armor_088_Upper','Armor_089_Upper','Armor_090_Upper' ] }, //Radiant Shirt
	{ base: 'Armor_017_Lower', upgrades: [ 'Armor_087_Lower','Armor_088_Lower','Armor_089_Lower','Armor_090_Lower' ] }, //Radiant Tights

	{ base: 'Armor_020_Head', upgrades: [ 'Armor_095_Head','Armor_096_Head','Armor_097_Head','Armor_098_Head' ] }, //Soldier's Helm
	{ base: 'Armor_020_Upper', upgrades: [ 'Armor_095_Upper','Armor_096_Upper','Armor_097_Upper','Armor_098_Upper' ] }, //Soldier's Armor
	{ base: 'Armor_020_Lower', upgrades: [ 'Armor_095_Lower','Armor_096_Lower','Armor_097_Lower','Armor_098_Lower' ] }, //Soldier's Greaves

	{ base: 'Armor_021_Head', upgrades: [ 'Armor_099_Head','Armor_100_Head','Armor_101_Head','Armor_102_Head' ] }, //Ancient Helm
	{ base: 'Armor_021_Upper', upgrades: [ 'Armor_099_Upper','Armor_100_Upper','Armor_101_Upper','Armor_102_Upper' ] }, //Ancient Cuirass
	{ base: 'Armor_021_Lower', upgrades: [ 'Armor_099_Lower','Armor_100_Lower','Armor_101_Lower','Armor_102_Lower' ] }, //Ancient Greaves

	{ base: 'Armor_024_Head', upgrades: [ 'Armor_117_Head','Armor_118_Head','Armor_119_Head','Armor_120_Head' ] }, //Diamond Circlet
	{ base: 'Armor_025_Head', upgrades: [ 'Armor_121_Head','Armor_122_Head','Armor_123_Head','Armor_124_Head' ] }, //Ruby Circlet
	{ base: 'Armor_026_Head', upgrades: [ 'Armor_125_Head','Armor_126_Head','Armor_127_Head','Armor_128_Head' ] }, //Sapphire Circlet
	{ base: 'Armor_027_Head', upgrades: [ 'Armor_129_Head','Armor_130_Head','Armor_131_Head','Armor_132_Head' ] }, //Topaz Earrings
	{ base: 'Armor_028_Head', upgrades: [ 'Armor_133_Head','Armor_134_Head','Armor_135_Head','Armor_136_Head' ] }, //Opal Earrings
	{ base: 'Armor_029_Head', upgrades: [ 'Armor_137_Head','Armor_138_Head','Armor_139_Head','Armor_140_Head' ] }, //Amber Earrings

	{ base: 'Armor_046_Head', upgrades: [ 'Armor_103_Head','Armor_104_Head','Armor_105_Head','Armor_106_Head' ] }, //Rubber Helm
	{ base: 'Armor_046_Upper', upgrades: [ 'Armor_103_Upper','Armor_104_Upper','Armor_105_Upper','Armor_106_Upper' ] }, //Rubber Armor
	{ base: 'Armor_046_Lower', upgrades: [ 'Armor_103_Lower','Armor_104_Lower','Armor_105_Lower','Armor_106_Lower' ] }, //Rubber Tights

	{ base: 'Armor_048_Head', upgrades: [ 'Armor_111_Head','Armor_112_Head','Armor_113_Head','Armor_114_Head' ] }, //Barbarian Helm
	{ base: 'Armor_048_Upper', upgrades: [ 'Armor_111_Upper','Armor_112_Upper','Armor_113_Upper','Armor_114_Upper' ] }, //Barbarian Armor
	{ base: 'Armor_048_Lower', upgrades: [ 'Armor_111_Lower','Armor_112_Lower','Armor_113_Lower','Armor_114_Lower' ] }, //Barbarian Leg Wraps

	{ base: 'Armor_049_Lower', upgrades: [ 'Armor_152_Lower','Armor_153_Lower','Armor_154_Lower','Armor_155_Lower' ] }, //Sand Boots

	{ base: 'Armor_022_Head' }, //Bokoblin Mask
	{ base: 'Armor_045_Head' }, //Moblin Mask
	{ base: 'Armor_055_Head' }, //Lizalfos Mask
	{ base: 'Armor_056_Head' }, //Lynel Mask
	{ base: 'Armor_1125_Head' }, //Horriblin Mask

	{ base: 'Armor_115_Head' }, //Lightning Helm

	{ base: 'Armor_116_Upper', upgrades: [ 'Armor_148_Upper','Armor_149_Upper','Armor_150_Upper','Armor_151_Upper' ] }, //Tunic of Memories

	{ base: 'Armor_141_Lower', upgrades: [ 'Armor_156_Lower','Armor_157_Lower','Armor_158_Lower','Armor_159_Lower' ] }, //Snow Boots

	{ base: 'Armor_160_Head' }, //Dark Hood
	{ base: 'Armor_160_Upper' }, //Dark Tunic
	{ base: 'Armor_160_Lower' }, //Dark Trousers

	{ base: 'Armor_171_Head' }, //Phantom Helmet
	{ base: 'Armor_171_Upper' }, //Phantom Armor
	{ base: 'Armor_171_Lower' }, //Phantom Greaves

	{ base: 'Armor_172_Head' }, //Majora's Mask

	{ base: 'Armor_173_Head' }, //Midna's Helmet

	{ base: 'Armor_174_Head' }, //Tingle's Hood
	{ base: 'Armor_174_Upper' }, //Tingle's Shirt
	{ base: 'Armor_174_Lower' }, //Tingle's Tights

	{ base: 'Armor_175_Upper' }, //Island Lobster Shirt

	{ base: 'Armor_176_Head' }, //Korok Mask

	{ base: 'Armor_177_Head' }, //Ravio's Hood

	{ base: 'Armor_178_Head' }, //Zant's Helmet

	{ base: 'Armor_179_Head', upgrades: [ 'Armor_1146_Head','Armor_1147_Head','Armor_1148_Head','Armor_1149_Head' ] }, //Royal Guard Cap
	{ base: 'Armor_179_Upper', upgrades: [ 'Armor_1146_Upper','Armor_1147_Upper','Armor_1148_Upper','Armor_1149_Upper' ] }, //Royal Guard Uniform
	{ base: 'Armor_179_Lower', upgrades: [ 'Armor_1146_Lower','Armor_1147_Lower','Armor_1148_Lower','Armor_1149_Lower' ] }, //Royal Guard Boots

	{ base: 'Armor_180_Head' }, //Evil Spirit Mask
	{ base: 'Armor_180_Upper' }, //Evil Spirit Armor
	{ base: 'Armor_180_Lower' }, //Evil Spirit Greaves

	{ base: 'Armor_181_Head', upgrades: [ 'Armor_186_Head','Armor_187_Head','Armor_188_Head','Armor_189_Head' ] }, //Vah Ruta Divine Helm
	{ base: 'Armor_182_Head', upgrades: [ 'Armor_190_Head','Armor_191_Head','Armor_192_Head','Armor_193_Head' ] }, //Vah Medoh Divine Helm
	{ base: 'Armor_183_Head', upgrades: [ 'Armor_194_Head','Armor_195_Head','Armor_196_Head','Armor_197_Head' ] }, //Vah Rudania Divine Helm
	{ base: 'Armor_184_Head', upgrades: [ 'Armor_198_Head','Armor_199_Head','Armor_168_Head','Armor_169_Head' ] }, //Vah Naboris Divine Helm

	{ base: 'Armor_200_Head', upgrades: [ 'Armor_201_Head','Armor_202_Head','Armor_203_Head','Armor_204_Head' ] }, //Cap of Time
	{ base: 'Armor_200_Upper', upgrades: [ 'Armor_201_Upper','Armor_202_Upper','Armor_203_Upper','Armor_204_Upper' ] }, //Tunic of Time
	{ base: 'Armor_200_Lower', upgrades: [ 'Armor_201_Lower','Armor_202_Lower','Armor_203_Lower','Armor_204_Lower' ] }, //Trousers of Time

	{ base: 'Armor_205_Head', upgrades: [ 'Armor_206_Head','Armor_207_Head','Armor_208_Head','Armor_209_Head' ] }, //Cap of the Wind
	{ base: 'Armor_205_Upper', upgrades: [ 'Armor_206_Upper','Armor_207_Upper','Armor_208_Upper','Armor_209_Upper' ] }, //Tunic of the Wind
	{ base: 'Armor_205_Lower', upgrades: [ 'Armor_206_Lower','Armor_207_Lower','Armor_208_Lower','Armor_209_Lower' ] }, //Trousers of the Wind

	{ base: 'Armor_210_Head', upgrades: [ 'Armor_211_Head','Armor_212_Head','Armor_213_Head','Armor_214_Head' ] }, //Cap of Twilight
	{ base: 'Armor_210_Upper', upgrades: [ 'Armor_211_Upper','Armor_212_Upper','Armor_213_Upper','Armor_214_Upper' ] }, //Tunic of Twilight
	{ base: 'Armor_210_Lower', upgrades: [ 'Armor_211_Lower','Armor_212_Lower','Armor_213_Lower','Armor_214_Lower' ] }, //Trousers of Twilight

	{ base: 'Armor_215_Head', upgrades: [ 'Armor_216_Head','Armor_217_Head','Armor_218_Head','Armor_219_Head' ] }, //Cap of the Sky
	{ base: 'Armor_215_Upper', upgrades: [ 'Armor_216_Upper','Armor_217_Upper','Armor_218_Upper','Armor_219_Upper' ] }, //Tunic of the Sky
	{ base: 'Armor_215_Lower', upgrades: [ 'Armor_216_Lower','Armor_217_Lower','Armor_218_Lower','Armor_219_Lower' ] }, //Trousers of the Sky

	{ base: 'Armor_220_Head', upgrades: [ 'Armor_221_Head','Armor_222_Head','Armor_223_Head','Armor_224_Head' ] }, //Sheik's Mask

	{ base: 'Armor_225_Head', upgrades: [ 'Armor_226_Head','Armor_227_Head','Armor_228_Head','Armor_229_Head' ] }, //Fierce Deity Mask
	{ base: 'Armor_225_Upper', upgrades: [ 'Armor_226_Upper','Armor_227_Upper','Armor_228_Upper','Armor_229_Upper' ] }, //Fierce Deity Armor
	{ base: 'Armor_225_Lower', upgrades: [ 'Armor_226_Lower','Armor_227_Lower','Armor_228_Lower','Armor_229_Lower' ] }, //Fierce Deity Boots

	{ base: 'Armor_230_Head', upgrades: [ 'Armor_231_Head','Armor_232_Head','Armor_233_Head','Armor_234_Head' ] }, //Cap of the Hero
	{ base: 'Armor_230_Upper', upgrades: [ 'Armor_231_Upper','Armor_232_Upper','Armor_233_Upper','Armor_234_Upper' ] }, //Tunic of the Hero
	{ base: 'Armor_230_Lower', upgrades: [ 'Armor_231_Lower','Armor_232_Lower','Armor_233_Lower','Armor_234_Lower' ] }, //Trousers of the Hero

	{ base: 'Armor_1006_Head', upgrades: [ 'Armor_1007_Head','Armor_1008_Head','Armor_1009_Head','Armor_1010_Head' ] }, //Glide Mask
	{ base: 'Armor_1006_Upper', upgrades: [ 'Armor_1007_Upper','Armor_1008_Upper','Armor_1009_Upper','Armor_1010_Upper' ] }, //Glide Shirt
	{ base: 'Armor_1006_Lower', upgrades: [ 'Armor_1007_Lower','Armor_1008_Lower','Armor_1009_Lower','Armor_1010_Lower' ] }, //Glide Tights

	{ base: 'Armor_1036_Head', upgrades: [ 'Armor_1037_Head','Armor_1038_Head','Armor_1039_Head','Armor_1040_Head' ] }, //Ancient Hero's Aspect

	{ base: 'Armor_1043_Upper' }, //Archaic Tunic
	{ base: 'Armor_1043_Lower' }, //Archaic Legwear
	{ base: 'Armor_1044_Lower' }, //Archaic Warm Greaves

	{ base: 'Armor_1046_Head', upgrades: [ 'Armor_1047_Head','Armor_1048_Head','Armor_1049_Head','Armor_1050_Head' ] }, //Froggy Hood
	{ base: 'Armor_1046_Upper', upgrades: [ 'Armor_1047_Upper','Armor_1048_Upper','Armor_1049_Upper','Armor_1050_Upper' ] }, //Froggy Sleeve
	{ base: 'Armor_1046_Lower', upgrades: [ 'Armor_1047_Lower','Armor_1048_Lower','Armor_1049_Lower','Armor_1050_Lower' ] }, //Froggy Leggings

	{ base: 'Armor_1051_Head', upgrades: [ 'Armor_1052_Head','Armor_1053_Head','Armor_1054_Head','Armor_1055_Head' ] }, //Miner's Mask
	{ base: 'Armor_1051_Upper', upgrades: [ 'Armor_1052_Upper','Armor_1053_Upper','Armor_1054_Upper','Armor_1055_Upper' ] }, //Miner's Top
	{ base: 'Armor_1051_Lower', upgrades: [ 'Armor_1052_Lower','Armor_1053_Lower','Armor_1054_Lower','Armor_1055_Lower' ] }, //Miner's Trousers

	{ base: 'Armor_1061_Head', upgrades: [ 'Armor_1062_Head','Armor_1063_Head','Armor_1064_Head','Armor_1065_Head' ] }, //Ember Headdress
	{ base: 'Armor_1061_Upper', upgrades: [ 'Armor_1062_Upper','Armor_1063_Upper','Armor_1064_Upper','Armor_1065_Upper' ] }, //Ember Shirt
	{ base: 'Armor_1061_Lower', upgrades: [ 'Armor_1062_Lower','Armor_1063_Lower','Armor_1064_Lower','Armor_1065_Lower' ] }, //Ember Trousers

	{ base: 'Armor_1066_Head', upgrades: [ 'Armor_1067_Head','Armor_1068_Head','Armor_1069_Head','Armor_1070_Head' ] }, //Charged Headdress
	{ base: 'Armor_1066_Upper', upgrades: [ 'Armor_1067_Upper','Armor_1068_Upper','Armor_1069_Upper','Armor_1070_Upper' ] }, //Charged Shirt
	{ base: 'Armor_1066_Lower', upgrades: [ 'Armor_1067_Lower','Armor_1068_Lower','Armor_1069_Lower','Armor_1070_Lower' ] }, //Charged Trousers

	{ base: 'Armor_1071_Head', upgrades: [ 'Armor_1072_Head','Armor_1073_Head','Armor_1074_Head','Armor_1075_Head' ] }, //Frostbite Headdress
	{ base: 'Armor_1071_Upper', upgrades: [ 'Armor_1072_Upper','Armor_1073_Upper','Armor_1074_Upper','Armor_1075_Upper' ] }, //Frostbite Shirt
	{ base: 'Armor_1071_Lower', upgrades: [ 'Armor_1072_Lower','Armor_1073_Lower','Armor_1074_Lower','Armor_1075_Lower' ] }, //Frostbite Trousers

	{ base: 'Armor_1076_Head' }, //Cece Hat

	{ base: 'Armor_1086_Head' }, //Mystic Headpiece
	{ base: 'Armor_1086_Upper' }, //Mystic Robe
	{ base: 'Armor_1086_Lower' }, //Mystic Trousers

	{ base: 'Armor_1091_Head', upgrades: [ 'Armor_1092_Head','Armor_1093_Head','Armor_1094_Head','Armor_1095_Head' ] }, //Zonaite Helm
	{ base: 'Armor_1091_Upper', upgrades: [ 'Armor_1092_Upper','Armor_1093_Upper','Armor_1094_Upper','Armor_1095_Upper' ] }, //Zonaite Waistguard
	{ base: 'Armor_1091_Lower', upgrades: [ 'Armor_1092_Lower','Armor_1093_Lower','Armor_1094_Lower','Armor_1095_Lower' ] }, //Zonaite Shin Guards

	{ base: 'Armor_1096_Head', upgrades: [ 'Armor_1097_Head','Armor_1098_Head','Armor_1099_Head','Armor_1100_Head' ] }, //Mask of Awakening
	{ base: 'Armor_1096_Upper', upgrades: [ 'Armor_1097_Upper','Armor_1098_Upper','Armor_1099_Upper','Armor_1100_Upper' ] }, //Tunic of Awakening
	{ base: 'Armor_1096_Lower', upgrades: [ 'Armor_1097_Lower','Armor_1098_Lower','Armor_1099_Lower','Armor_1100_Lower' ] }, //Trousers of Awakening

	{ base: 'Armor_1106_Upper', upgrades: [ 'Armor_1107_Upper','Armor_1108_Upper','Armor_1109_Upper','Armor_1110_Upper' ] }, //Champion's Leather

	{ base: 'Armor_1141_Head', upgrades: [ 'Armor_1142_Head','Armor_1143_Head','Armor_1144_Head','Armor_1145_Head' ] }, //Hood of the Depths
	{ base: 'Armor_1141_Upper', upgrades: [ 'Armor_1142_Upper','Armor_1143_Upper','Armor_1144_Upper','Armor_1145_Upper' ] }, //Tunic of the Depths
	{ base: 'Armor_1141_Lower', upgrades: [ 'Armor_1142_Lower','Armor_1143_Lower','Armor_1144_Lower','Armor_1145_Lower' ] }, //Gaiters of the Depths

	{ base: 'Armor_1151_Head' }, //Well-Worn Hair Band

	{ base: 'Armor_1300_Head', upgrades: [ 'Armor_1301_Head','Armor_1302_Head','Armor_1303_Head','Armor_1304_Head' ] }, //Yiga Mask
	{ base: 'Armor_1300_Upper', upgrades: [ 'Armor_1301_Upper','Armor_1302_Upper','Armor_1303_Upper','Armor_1304_Upper' ] }, //Yiga Armor
	{ base: 'Armor_1300_Lower', upgrades: [ 'Armor_1301_Lower','Armor_1302_Lower','Armor_1303_Lower','Armor_1304_Lower' ] }, //Yiga Tight

	{ base: 'Armor_1150_Upper' } //*Tunic of memories (intro, unused)
];

Armor.ICONS=(function(){
	var icons={};
	Armor.AVAILABILITY.forEach(function(armor, i){
		icons[armor.base] = armor.base;
		if(armor.upgrades){
			for(const upgradeId of armor.upgrades){
				icons[upgradeId] = armor.base;
			}
		}
	});
	return icons;
}());
