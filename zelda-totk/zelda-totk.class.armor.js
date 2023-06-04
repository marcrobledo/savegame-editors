/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Armor class) v20230604

	by Marc Robledo 2023
	item names compiled by Echocolat, Exincracci, HylianLZ and Karlos007
*/

function Armor(index, id, dyeColor){
	this.category='armors';
	this.index=index;
	this.removable=false;

	this.id=id;
	this.dyeColor=dyeColor || Armor.DYE_NONE;

	Armor.buildHtmlElements(this);
	this.refreshHtmlColor();
}
Armor.prototype.refreshHtmlColor=function(){
	var colorIndex=this._htmlSelectDyeColor.selectedIndex;
	var colors=['transparent','#2641ea','#ec3b18','#ffe13e','#f8f8f8','#080808','#b03af4','#4bf130','#78e7ff','#527abc','#ff9b2f','#ff85d0','#f62ba7','#ffef98','#8f3a20','#808080']
	this._htmlSpanColor.style.backgroundColor=colors[colorIndex];
}
Armor.prototype.getItemTranslation=function(){
	if(Locale._(this.id))
		return Locale._(this.id);
	return Armor.TRANSLATIONS[this.id] || this.id;
}
Armor.prototype.copy=function(index, newId){
	return new Armor(
		index,
		typeof newId==='string'? newId : this.id,
		this.dyeColor
	);
}
Armor.prototype.save=function(){
	SavegameEditor.writeString64('ArrayArmorIds', this.index, this.id);
	SavegameEditor.writeU32('ArrayArmorDyeColors', this.index, this.dyeColor);
}


Armor.buildHtmlElements=function(item){
	//build html elements
	var dyeColors=[
		{name:'Default color', value:Armor.DYE_NONE},
		{name:'Blue', value:Armor.DYE_BLUE},
		{name:'Red', value:Armor.DYE_RED},
		{name:'Yellow', value:Armor.DYE_YELLOW},
		{name:'White', value:Armor.DYE_WHITE},
		{name:'Black', value:Armor.DYE_BLACK},
		{name:'Purple', value:Armor.DYE_PURPLE},
		{name:'Green', value:Armor.DYE_GREEN},
		{name:'Light blue', value:Armor.DYE_LIGHT_BLUE},
		{name:'Navy', value:Armor.DYE_NAVY},
		{name:'Orange', value:Armor.DYE_ORANGE},
		{name:'Pink', value:Armor.DYE_PINK},
		{name:'Crimson', value:Armor.DYE_CRIMSON},
		{name:'Light yellow', value:Armor.DYE_LIGHT_YELLOW},
		{name:'Brown', value:Armor.DYE_BROWN},
		{name:'Gray', value:Armor.DYE_GRAY}
	];
	item._htmlSelectDyeColor=select('armor-dye-'+item.category+'-'+item.index, dyeColors, function(){
		item.dyeColor=parseInt(this.value);
		item.refreshHtmlColor();
	}, item.dyeColor);
	item._htmlSelectDyeColor.title='Dye color';

	item._htmlSpanColor=document.createElement('span');
	item._htmlSpanColor.className='dye-color';
}

Armor.readAll=function(){
	var armorIds=SavegameEditor.readString64Array('ArrayArmorIds');
	var validArmors=[];
	for(var i=0; i<armorIds.length; i++){
		if(armorIds[i]){
			validArmors.push(new Armor(
				i,
				armorIds[i],
				SavegameEditor.readU32Array('ArrayArmorDyeColors', i)
			));
		}
	}
	return validArmors;
}


Armor.DYE_NONE=0xb6eede09;
Armor.DYE_BLUE=0xe2911aba;
Armor.DYE_RED=0x6e1a9181;
Armor.DYE_YELLOW=0xc03f6678;
Armor.DYE_WHITE=0x4402060c;
Armor.DYE_BLACK=0x6cbc3cb4;
Armor.DYE_PURPLE=0x7f0ae256;
Armor.DYE_GREEN=0x7c9b6ddb;
Armor.DYE_LIGHT_BLUE=0x01666931;
Armor.DYE_NAVY=0xadfd3a1;
Armor.DYE_ORANGE=0x619ec353;
Armor.DYE_PINK=0xeaf26a09;
Armor.DYE_CRIMSON=0xf8bdf528;
Armor.DYE_LIGHT_YELLOW=0xdf26c6da;
Armor.DYE_BROWN=0xb364bb2c;
Armor.DYE_GRAY=0x762266bf;

Armor.TRANSLATIONS={
Armor_001_Head:'Hylian Hood',
Armor_002_Head:'Hylian Hood ★',
Armor_003_Head:'Hylian Hood ★★',
Armor_004_Head:'Hylian Hood ★★★',
Armor_015_Head:'Hylian Hood ★★★★',
Armor_1152_Head:'Hylian Hood (lowered)',
Armor_1153_Head:'Hylian Hood (lowered) ★',
Armor_1154_Head:'Hylian Hood (lowered) ★★',
Armor_1155_Head:'Hylian Hood (lowered) ★★★',
Armor_1156_Head:'Hylian Hood (lowered) ★★★★',
Armor_001_Upper:'Hylian Tunic',
Armor_002_Upper:'Hylian Tunic ★',
Armor_003_Upper:'Hylian Tunic ★★',
Armor_004_Upper:'Hylian Tunic ★★★',
Armor_015_Upper:'Hylian Tunic ★★★★',
Armor_001_Lower:'Hylian Trousers',
Armor_002_Lower:'Hylian Trousers ★',
Armor_003_Lower:'Hylian Trousers ★★',
Armor_004_Lower:'Hylian Trousers ★★★',
Armor_015_Lower:'Hylian Trousers ★★★★',

Armor_005_Head:'Cap of the Wild',
Armor_035_Head:'Cap of the Wild ★',
Armor_039_Head:'Cap of the Wild ★★',
Armor_060_Head:'Cap of the Wild ★★★',
Armor_061_Head:'Cap of the Wild ★★★★',
Armor_005_Upper:'Tunic of the Wild',
Armor_035_Upper:'Tunic of the Wild ★',
Armor_039_Upper:'Tunic of the Wild ★★',
Armor_060_Upper:'Tunic of the Wild ★★★',
Armor_061_Upper:'Tunic of the Wild ★★★★',
Armor_005_Lower:'Trousers of the Wild',
Armor_035_Lower:'Trousers of the Wild ★',
Armor_039_Lower:'Trousers of the Wild ★★',
Armor_060_Lower:'Trousers of the Wild ★★★',
Armor_061_Lower:'Trousers of the Wild ★★★★',

Armor_006_Head:'Zora Helm',
Armor_007_Head:'Zora Helm ★',
Armor_062_Head:'Zora Helm ★★',
Armor_063_Head:'Zora Helm ★★★',
Armor_064_Head:'Zora Helm ★★★★',
Armor_006_Upper:'Zora Armor',
Armor_007_Upper:'Zora Armor ★',
Armor_062_Upper:'Zora Armor ★★',
Armor_063_Upper:'Zora Armor ★★★',
Armor_064_Upper:'Zora Armor ★★★★',
Armor_006_Lower:'Zora Greaves',
Armor_007_Lower:'Zora Greaves ★',
Armor_062_Lower:'Zora Greaves ★★',
Armor_063_Lower:'Zora Greaves ★★★',
Armor_064_Lower:'Zora Greaves ★★★★',

Armor_008_Head:'Desert Voe Headband',
Armor_040_Head:'Desert Voe Headband ★',
Armor_065_Head:'Desert Voe Headband ★★',
Armor_066_Head:'Desert Voe Headband ★★★',
Armor_067_Head:'Desert Voe Headband ★★★★',
Armor_008_Upper:'Desert Voe Spaulder',
Armor_040_Upper:'Desert Voe Spaulder ★',
Armor_065_Upper:'Desert Voe Spaulder ★★',
Armor_066_Upper:'Desert Voe Spaulder ★★★',
Armor_067_Upper:'Desert Voe Spaulder ★★★★',
Armor_008_Lower:'Desert Voe Trousers',
Armor_040_Lower:'Desert Voe Trousers ★',
Armor_065_Lower:'Desert Voe Trousers ★★',
Armor_066_Lower:'Desert Voe Trousers ★★★',
Armor_067_Lower:'Desert Voe Trousers ★★★★',

Armor_009_Head:'Snowquill Headdress',
Armor_036_Head:'Snowquill Headdress ★',
Armor_071_Head:'Snowquill Headdress ★★',
Armor_072_Head:'Snowquill Headdress ★★★',
Armor_073_Head:'Snowquill Headdress ★★★★',
Armor_009_Upper:'Snowquill Tunic',
Armor_036_Upper:'Snowquill Tunic ★',
Armor_071_Upper:'Snowquill Tunic ★★',
Armor_072_Upper:'Snowquill Tunic ★★★',
Armor_073_Upper:'Snowquill Tunic ★★★★',
Armor_009_Lower:'Snowquill Trousers',
Armor_036_Lower:'Snowquill Trousers ★',
Armor_071_Lower:'Snowquill Trousers ★★',
Armor_072_Lower:'Snowquill Trousers ★★★',
Armor_073_Lower:'Snowquill Trousers ★★★★',

Armor_011_Head:'Flamebreaker Helm',
Armor_037_Head:'Flamebreaker Helm ★',
Armor_074_Head:'Flamebreaker Helm ★★',
Armor_075_Head:'Flamebreaker Helm ★★★',
Armor_076_Head:'Flamebreaker Helm ★★★★',
Armor_011_Upper:'Flamebreaker Armor',
Armor_037_Upper:'Flamebreaker Armor ★',
Armor_074_Upper:'Flamebreaker Armor ★★',
Armor_075_Upper:'Flamebreaker Armor ★★★',
Armor_076_Upper:'Flamebreaker Armor ★★★★',
Armor_011_Lower:'Flamebreaker Boots',
Armor_037_Lower:'Flamebreaker Boots ★',
Armor_074_Lower:'Flamebreaker Boots ★★',
Armor_075_Lower:'Flamebreaker Boots ★★★',
Armor_076_Lower:'Flamebreaker Boots ★★★★',

Armor_012_Head:'Stealth Mask',
Armor_042_Head:'Stealth Mask ★',
Armor_077_Head:'Stealth Mask ★★',
Armor_078_Head:'Stealth Mask ★★★',
Armor_079_Head:'Stealth Mask ★★★★',
Armor_012_Upper:'Stealth Chest Guard',
Armor_042_Upper:'Stealth Chest Guard ★',
Armor_077_Upper:'Stealth Chest Guard ★★',
Armor_078_Upper:'Stealth Chest Guard ★★★',
Armor_079_Upper:'Stealth Chest Guard ★★★★',
Armor_012_Lower:'Stealth Tights',
Armor_042_Lower:'Stealth Tights ★',
Armor_077_Lower:'Stealth Tights ★★',
Armor_078_Lower:'Stealth Tights ★★★',
Armor_079_Lower:'Stealth Tights ★★★★',

Armor_014_Head:'Climber\'s Bandanna',
Armor_083_Head:'Climber\'s Bandanna ★',
Armor_084_Head:'Climber\'s Bandanna ★★',
Armor_085_Head:'Climber\'s Bandanna ★★★',
Armor_086_Head:'Climber\'s Bandanna ★★★★',
Armor_014_Upper:'Climbing Gear',
Armor_083_Upper:'Climbing Gear ★',
Armor_084_Upper:'Climbing Gear ★★',
Armor_085_Upper:'Climbing Gear ★★★',
Armor_086_Upper:'Climbing Gear ★★★★',
Armor_014_Lower:'Climbing Boots',
Armor_083_Lower:'Climbing Boots ★',
Armor_084_Lower:'Climbing Boots ★★',
Armor_085_Lower:'Climbing Boots ★★★',
Armor_086_Lower:'Climbing Boots ★★★★',

Armor_017_Head:'Radiant Mask',
Armor_087_Head:'Radiant Mask ★',
Armor_088_Head:'Radiant Mask ★★',
Armor_089_Head:'Radiant Mask ★★★',
Armor_090_Head:'Radiant Mask ★★★★',
Armor_017_Upper:'Radiant Shirt',
Armor_087_Upper:'Radiant Shirt ★',
Armor_088_Upper:'Radiant Shirt ★★',
Armor_089_Upper:'Radiant Shirt ★★★',
Armor_090_Upper:'Radiant Shirt ★★★★',
Armor_017_Lower:'Radiant Tights',
Armor_087_Lower:'Radiant Tights ★',
Armor_088_Lower:'Radiant Tights ★★',
Armor_089_Lower:'Radiant Tights ★★★',
Armor_090_Lower:'Radiant Tights ★★★★',

Armor_020_Head:'Soldier\'s Helm',
Armor_095_Head:'Soldier\'s Helm ★',
Armor_096_Head:'Soldier\'s Helm ★★',
Armor_097_Head:'Soldier\'s Helm ★★★',
Armor_098_Head:'Soldier\'s Helm ★★★★',
Armor_020_Upper:'Soldier\'s Armor',
Armor_095_Upper:'Soldier\'s Armor ★',
Armor_096_Upper:'Soldier\'s Armor ★★',
Armor_097_Upper:'Soldier\'s Armor ★★★',
Armor_098_Upper:'Soldier\'s Armor ★★★★',
Armor_020_Lower:'Soldier\'s Greaves',
Armor_095_Lower:'Soldier\'s Greaves ★',
Armor_096_Lower:'Soldier\'s Greaves ★★',
Armor_097_Lower:'Soldier\'s Greaves ★★★',
Armor_098_Lower:'Soldier\'s Greaves ★★★★',

Armor_021_Head:'Ancient Helm',
Armor_099_Head:'Ancient Helm ★',
Armor_100_Head:'Ancient Helm ★★',
Armor_101_Head:'Ancient Helm ★★★',
Armor_102_Head:'Ancient Helm ★★★★',
Armor_021_Upper:'Ancient Cuirass',
Armor_099_Upper:'Ancient Cuirass ★',
Armor_100_Upper:'Ancient Cuirass ★★',
Armor_101_Upper:'Ancient Cuirass ★★★',
Armor_102_Upper:'Ancient Cuirass ★★★★',
Armor_021_Lower:'Ancient Greaves',
Armor_099_Lower:'Ancient Greaves ★',
Armor_100_Lower:'Ancient Greaves ★★',
Armor_101_Lower:'Ancient Greaves ★★★',
Armor_102_Lower:'Ancient Greaves ★★★★',

Armor_024_Head:'Diamond Circlet',
Armor_117_Head:'Diamond Circlet ★',
Armor_118_Head:'Diamond Circlet ★★',
Armor_119_Head:'Diamond Circlet ★★★',
Armor_120_Head:'Diamond Circlet ★★★★',
Armor_025_Head:'Ruby Circlet',
Armor_121_Head:'Ruby Circlet ★',
Armor_122_Head:'Ruby Circlet ★★',
Armor_123_Head:'Ruby Circlet ★★★',
Armor_124_Head:'Ruby Circlet ★★★★',
Armor_026_Head:'Sapphire Circlet',
Armor_125_Head:'Sapphire Circlet ★',
Armor_126_Head:'Sapphire Circlet ★★',
Armor_127_Head:'Sapphire Circlet ★★★',
Armor_128_Head:'Sapphire Circlet ★★★★',
Armor_027_Head:'Topaz Earrings',
Armor_129_Head:'Topaz Earrings ★',
Armor_130_Head:'Topaz Earrings ★★',
Armor_131_Head:'Topaz Earrings ★★★',
Armor_132_Head:'Topaz Earrings ★★★★',
Armor_028_Head:'Opal Earrings',
Armor_133_Head:'Opal Earrings ★',
Armor_134_Head:'Opal Earrings ★★',
Armor_135_Head:'Opal Earrings ★★★',
Armor_136_Head:'Opal Earrings ★★★★',
Armor_029_Head:'Amber Earrings',
Armor_137_Head:'Amber Earrings ★',
Armor_138_Head:'Amber Earrings ★★',
Armor_139_Head:'Amber Earrings ★★★',
Armor_140_Head:'Amber Earrings ★★★★',

Armor_046_Head:'Rubber Helm',
Armor_103_Head:'Rubber Helm ★',
Armor_104_Head:'Rubber Helm ★★',
Armor_105_Head:'Rubber Helm ★★★',
Armor_106_Head:'Rubber Helm ★★★★',
Armor_046_Upper:'Rubber Armor',
Armor_103_Upper:'Rubber Armor ★',
Armor_104_Upper:'Rubber Armor ★★',
Armor_105_Upper:'Rubber Armor ★★★',
Armor_106_Upper:'Rubber Armor ★★★★',
Armor_046_Lower:'Rubber Tights',
Armor_103_Lower:'Rubber Tights ★',
Armor_104_Lower:'Rubber Tights ★★',
Armor_105_Lower:'Rubber Tights ★★★',
Armor_106_Lower:'Rubber Tights ★★★★',

Armor_048_Head:'Barbarian Helm',
Armor_111_Head:'Barbarian Helm ★',
Armor_112_Head:'Barbarian Helm ★★',
Armor_113_Head:'Barbarian Helm ★★★',
Armor_114_Head:'Barbarian Helm ★★★★',
Armor_048_Upper:'Barbarian Armor',
Armor_111_Upper:'Barbarian Armor ★',
Armor_112_Upper:'Barbarian Armor ★★',
Armor_113_Upper:'Barbarian Armor ★★★',
Armor_114_Upper:'Barbarian Armor ★★★★',
Armor_048_Lower:'Barbarian Leg Wraps',
Armor_111_Lower:'Barbarian Leg Wraps ★',
Armor_112_Lower:'Barbarian Leg Wraps ★★',
Armor_113_Lower:'Barbarian Leg Wraps ★★★',
Armor_114_Lower:'Barbarian Leg Wraps ★★★★',

Armor_049_Lower:'Sand Boots',
Armor_152_Lower:'Sand Boots ★',
Armor_153_Lower:'Sand Boots ★★',
Armor_154_Lower:'Sand Boots ★★★',
Armor_155_Lower:'Sand Boots ★★★★',


Armor_022_Head:'Bokoblin Mask',
Armor_045_Head:'Moblin Mask',
Armor_055_Head:'Lizalfos Mask',
Armor_056_Head:'Lynel Mask',

Armor_115_Head:'Lightning Helm',

Armor_116_Upper:'Tunic of Memories',
Armor_148_Upper:'Tunic of Memories ★',
Armor_149_Upper:'Tunic of Memories ★★',
Armor_150_Upper:'Tunic of Memories ★★★',
Armor_151_Upper:'Tunic of Memories ★★★★',

Armor_141_Lower:'Snow Boots',
Armor_156_Lower:'Snow Boots ★',
Armor_157_Lower:'Snow Boots ★★',
Armor_158_Lower:'Snow Boots ★★★',
Armor_159_Lower:'Snow Boots ★★★★',

Armor_160_Head:'Dark Hood',
Armor_160_Upper:'Dark Tunic',
Armor_160_Lower:'Dark Trousers',

Armor_171_Head:'Phantom Helmet',
Armor_171_Upper:'Phantom Armor',
Armor_171_Lower:'Phantom Greaves',

Armor_172_Head:'Majora\'s Mask',

Armor_173_Head:'Midna\'s Helmet',

Armor_174_Head:'Tingle\'s Hood',
Armor_174_Upper:'Tingle\'s Shirt',
Armor_174_Lower:'Tingle\'s Tights',

Armor_175_Upper:'Island Lobster Shirt',

Armor_176_Head:'Korok Mask',

Armor_177_Head:'Ravio\'s Hood',

Armor_178_Head:'Zant\'s Helmet',

Armor_179_Head:'Royal Guard Cap',
Armor_1146_Head:'Royal Guard Cap ★',
Armor_1147_Head:'Royal Guard Cap ★★',
Armor_1148_Head:'Royal Guard Cap ★★★',
Armor_1149_Head:'Royal Guard Cap ★★★★',
Armor_179_Upper:'Royal Guard Uniform',
Armor_1146_Upper:'Royal Guard Uniform ★',
Armor_1147_Upper:'Royal Guard Uniform ★★',
Armor_1148_Upper:'Royal Guard Uniform ★★★',
Armor_1149_Upper:'Royal Guard Uniform ★★★★',
Armor_179_Lower:'Royal Guard Boots',
Armor_1146_Lower:'Royal Guard Boots ★',
Armor_1147_Lower:'Royal Guard Boots ★★',
Armor_1148_Lower:'Royal Guard Boots ★★★',
Armor_1149_Lower:'Royal Guard Boots ★★★★',



Armor_180_Head:'Evil Spirit Mask',
Armor_180_Upper:'Evil Spirit Armor',
Armor_180_Lower:'Evil Spirit Greaves',

Armor_181_Head:'Vah Ruta Divine Helm',
Armor_186_Head:'Vah Ruta Divine Helm ★',
Armor_187_Head:'Vah Ruta Divine Helm ★★',
Armor_188_Head:'Vah Ruta Divine Helm ★★★',
Armor_189_Head:'Vah Ruta Divine Helm ★★★★',
Armor_182_Head:'Vah Medoh Divine Helm',
Armor_190_Head:'Vah Medoh Divine Helm ★',
Armor_191_Head:'Vah Medoh Divine Helm ★★',
Armor_192_Head:'Vah Medoh Divine Helm ★★★',
Armor_193_Head:'Vah Medoh Divine Helm ★★★★',
Armor_183_Head:'Vah Rudania Divine Helm',
Armor_194_Head:'Vah Rudania Divine Helm ★',
Armor_195_Head:'Vah Rudania Divine Helm ★★',
Armor_196_Head:'Vah Rudania Divine Helm ★★★',
Armor_197_Head:'Vah Rudania Divine Helm ★★★★',
Armor_184_Head:'Vah Naboris Divine Helm',
Armor_198_Head:'Vah Naboris Divine Helm ★',
Armor_199_Head:'Vah Naboris Divine Helm ★★',
Armor_168_Head:'Vah Naboris Divine Helm ★★★',
Armor_169_Head:'Vah Naboris Divine Helm ★★★★',

Armor_200_Head:'Cap of Time',
Armor_201_Head:'Cap of Time ★',
Armor_202_Head:'Cap of Time ★★',
Armor_203_Head:'Cap of Time ★★★',
Armor_204_Head:'Cap of Time ★★★★',
Armor_200_Upper:'Tunic of Time',
Armor_201_Upper:'Tunic of Time ★',
Armor_202_Upper:'Tunic of Time ★★',
Armor_203_Upper:'Tunic of Time ★★★',
Armor_204_Upper:'Tunic of Time ★★★★',
Armor_200_Lower:'Trousers of Time',
Armor_201_Lower:'Trousers of Time ★',
Armor_202_Lower:'Trousers of Time ★★',
Armor_203_Lower:'Trousers of Time ★★★',
Armor_204_Lower:'Trousers of Time ★★★★',

Armor_205_Head:'Cap of the Wind',
Armor_206_Head:'Cap of the Wind ★',
Armor_207_Head:'Cap of the Wind ★★',
Armor_208_Head:'Cap of the Wind ★★★',
Armor_209_Head:'Cap of the Wind ★★★★',
Armor_205_Upper:'Tunic of the Wind',
Armor_206_Upper:'Tunic of the Wind ★',
Armor_207_Upper:'Tunic of the Wind ★★',
Armor_208_Upper:'Tunic of the Wind ★★★',
Armor_209_Upper:'Tunic of the Wind ★★★★',
Armor_205_Lower:'Trousers of the Wind',
Armor_206_Lower:'Trousers of the Wind ★',
Armor_207_Lower:'Trousers of the Wind ★★',
Armor_208_Lower:'Trousers of the Wind ★★★',
Armor_209_Lower:'Trousers of the Wind ★★★★',

Armor_210_Head:'Cap of Twilight',
Armor_211_Head:'Cap of Twilight ★',
Armor_212_Head:'Cap of Twilight ★★',
Armor_213_Head:'Cap of Twilight ★★★',
Armor_214_Head:'Cap of Twilight ★★★★',
Armor_210_Upper:'Tunic of Twilight',
Armor_211_Upper:'Tunic of Twilight ★',
Armor_212_Upper:'Tunic of Twilight ★★',
Armor_213_Upper:'Tunic of Twilight ★★★',
Armor_214_Upper:'Tunic of Twilight ★★★★',
Armor_210_Lower:'Trousers of Twilight',
Armor_211_Lower:'Trousers of Twilight ★',
Armor_212_Lower:'Trousers of Twilight ★★',
Armor_213_Lower:'Trousers of Twilight ★★★',
Armor_214_Lower:'Trousers of Twilight ★★★★',

Armor_215_Head:'Cap of the Sky',
Armor_216_Head:'Cap of the Sky ★',
Armor_217_Head:'Cap of the Sky ★★',
Armor_218_Head:'Cap of the Sky ★★★',
Armor_219_Head:'Cap of the Sky ★★★★',
Armor_215_Upper:'Tunic of the Sky',
Armor_216_Upper:'Tunic of the Sky ★',
Armor_217_Upper:'Tunic of the Sky ★★',
Armor_218_Upper:'Tunic of the Sky ★★★',
Armor_219_Upper:'Tunic of the Sky ★★★★',
Armor_215_Lower:'Trousers of the Sky',
Armor_216_Lower:'Trousers of the Sky ★',
Armor_217_Lower:'Trousers of the Sky ★★',
Armor_218_Lower:'Trousers of the Sky ★★★',
Armor_219_Lower:'Trousers of the Sky ★★★★',

Armor_220_Head:'Sheik\'s Mask',
Armor_221_Head:'Sheik\'s Mask ★',
Armor_222_Head:'Sheik\'s Mask ★★',
Armor_223_Head:'Sheik\'s Mask ★★★',
Armor_224_Head:'Sheik\'s Mask ★★★★',

Armor_225_Head:'Fierce Deity Mask',
Armor_226_Head:'Fierce Deity Mask ★',
Armor_227_Head:'Fierce Deity Mask ★★',
Armor_228_Head:'Fierce Deity Mask ★★★',
Armor_229_Head:'Fierce Deity Mask ★★★★',
Armor_225_Upper:'Fierce Deity Armor',
Armor_226_Upper:'Fierce Deity Armor ★',
Armor_227_Upper:'Fierce Deity Armor ★★',
Armor_228_Upper:'Fierce Deity Armor ★★★',
Armor_229_Upper:'Fierce Deity Armor ★★★★',
Armor_225_Lower:'Fierce Deity Boots',
Armor_226_Lower:'Fierce Deity Boots ★',
Armor_227_Lower:'Fierce Deity Boots ★★',
Armor_228_Lower:'Fierce Deity Boots ★★★',
Armor_229_Lower:'Fierce Deity Boots ★★★★',

Armor_230_Head:'Cap of the Hero',
Armor_231_Head:'Cap of the Hero ★',
Armor_232_Head:'Cap of the Hero ★★',
Armor_233_Head:'Cap of the Hero ★★★',
Armor_234_Head:'Cap of the Hero ★★★★',
Armor_230_Upper:'Tunic of the Hero',
Armor_231_Upper:'Tunic of the Hero ★',
Armor_232_Upper:'Tunic of the Hero ★★',
Armor_233_Upper:'Tunic of the Hero ★★★',
Armor_234_Upper:'Tunic of the Hero ★★★★',
Armor_230_Lower:'Trousers of the Hero',
Armor_231_Lower:'Trousers of the Hero ★',
Armor_232_Lower:'Trousers of the Hero ★★',
Armor_233_Lower:'Trousers of the Hero ★★★',
Armor_234_Lower:'Trousers of the Hero ★★★★',



Armor_1006_Head:'Glide Mask',
Armor_1007_Head:'Glide Mask ★',
Armor_1008_Head:'Glide Mask ★★',
Armor_1009_Head:'Glide Mask ★★★',
Armor_1010_Head:'Glide Mask ★★★★',
Armor_1006_Upper:'Glide Shirt',
Armor_1007_Upper:'Glide Shirt ★',
Armor_1008_Upper:'Glide Shirt ★★',
Armor_1009_Upper:'Glide Shirt ★★★',
Armor_1010_Upper:'Glide Shirt ★★★★',
Armor_1006_Lower:'Glide Tights',
Armor_1007_Lower:'Glide Tights ★',
Armor_1008_Lower:'Glide Tights ★★',
Armor_1009_Lower:'Glide Tights ★★★',
Armor_1010_Lower:'Glide Tights ★★★★',

Armor_1036_Head:'Ancient Hero\'s Aspect',
Armor_1037_Head:'Ancient Hero\'s Aspect ★',
Armor_1038_Head:'Ancient Hero\'s Aspect ★★',
Armor_1039_Head:'Ancient Hero\'s Aspect ★★★',
Armor_1040_Head:'Ancient Hero\'s Aspect ★★★★',

Armor_1043_Upper:'Archaic Tunic',
Armor_1043_Lower:'Archaic Legwear',
Armor_1044_Lower:'Archaic Warm Greaves',

Armor_1046_Head:'Froggy Hood',
Armor_1047_Head:'Froggy Hood ★',
Armor_1048_Head:'Froggy Hood ★★',
Armor_1049_Head:'Froggy Hood ★★★',
Armor_1050_Head:'Froggy Hood ★★★★',
Armor_1046_Upper:'Froggy Sleeve',
Armor_1047_Upper:'Froggy Sleeve ★',
Armor_1048_Upper:'Froggy Sleeve ★★',
Armor_1049_Upper:'Froggy Sleeve ★★★',
Armor_1050_Upper:'Froggy Sleeve ★★★★',
Armor_1046_Lower:'Froggy Leggings',
Armor_1047_Lower:'Froggy Leggings ★',
Armor_1048_Lower:'Froggy Leggings ★★',
Armor_1049_Lower:'Froggy Leggings ★★★',
Armor_1050_Lower:'Froggy Leggings ★★★★',

Armor_1051_Head:'Miner\'s Mask',
Armor_1052_Head:'Miner\'s Mask ★',
Armor_1053_Head:'Miner\'s Mask ★★',
Armor_1054_Head:'Miner\'s Mask ★★★',
Armor_1055_Head:'Miner\'s Mask ★★★★',
Armor_1051_Upper:'Miner\'s Top',
Armor_1052_Upper:'Miner\'s Top ★',
Armor_1053_Upper:'Miner\'s Top ★★',
Armor_1054_Upper:'Miner\'s Top ★★★',
Armor_1055_Upper:'Miner\'s Top ★★★★',
Armor_1051_Lower:'Miner\'s Trousers',
Armor_1052_Lower:'Miner\'s Trousers ★',
Armor_1053_Lower:'Miner\'s Trousers ★★',
Armor_1054_Lower:'Miner\'s Trousers ★★★',
Armor_1055_Lower:'Miner\'s Trousers ★★★★',

Armor_1061_Head:'Ember Headdress',
Armor_1062_Head:'Ember Headdress ★',
Armor_1063_Head:'Ember Headdress ★★',
Armor_1064_Head:'Ember Headdress ★★★',
Armor_1065_Head:'Ember Headdress ★★★★',
Armor_1061_Upper:'Ember Shirt',
Armor_1062_Upper:'Ember Shirt ★',
Armor_1063_Upper:'Ember Shirt ★★',
Armor_1064_Upper:'Ember Shirt ★★★',
Armor_1065_Upper:'Ember Shirt ★★★★',
Armor_1061_Lower:'Ember Trousers',
Armor_1062_Lower:'Ember Trousers ★',
Armor_1063_Lower:'Ember Trousers ★★',
Armor_1064_Lower:'Ember Trousers ★★★',
Armor_1065_Lower:'Ember Trousers ★★★★',

Armor_1066_Head:'Charged Headdress',
Armor_1067_Head:'Charged Headdress ★',
Armor_1068_Head:'Charged Headdress ★★',
Armor_1069_Head:'Charged Headdress ★★★',
Armor_1070_Head:'Charged Headdress ★★★★',
Armor_1066_Upper:'Charged Shirt',
Armor_1067_Upper:'Charged Shirt ★',
Armor_1068_Upper:'Charged Shirt ★★',
Armor_1069_Upper:'Charged Shirt ★★★',
Armor_1070_Upper:'Charged Shirt ★★★★',
Armor_1066_Lower:'Charged Trousers',
Armor_1067_Lower:'Charged Trousers ★',
Armor_1068_Lower:'Charged Trousers ★★',
Armor_1069_Lower:'Charged Trousers ★★★',
Armor_1070_Lower:'Charged Trousers ★★★★',

Armor_1071_Head:'Frostbite Headdress',
Armor_1072_Head:'Frostbite Headdress ★',
Armor_1073_Head:'Frostbite Headdress ★★',
Armor_1074_Head:'Frostbite Headdress ★★★',
Armor_1075_Head:'Frostbite Headdress ★★★★',
Armor_1071_Upper:'Frostbite Shirt',
Armor_1072_Upper:'Frostbite Shirt ★',
Armor_1073_Upper:'Frostbite Shirt ★★',
Armor_1074_Upper:'Frostbite Shirt ★★★',
Armor_1075_Upper:'Frostbite Shirt ★★★★',
Armor_1071_Lower:'Frostbite Trousers',
Armor_1072_Lower:'Frostbite Trousers ★',
Armor_1073_Lower:'Frostbite Trousers ★★',
Armor_1074_Lower:'Frostbite Trousers ★★★',
Armor_1075_Lower:'Frostbite Trousers ★★★★',

Armor_1076_Head:'Cece Hat',

Armor_1086_Head:'Mystic Headpiece',
Armor_1086_Upper:'Mystic Robe',
Armor_1086_Lower:'Mystic Trousers',

Armor_1091_Head:'Zonaite Helm',
Armor_1092_Head:'Zonaite Helm ★',
Armor_1093_Head:'Zonaite Helm ★★',
Armor_1094_Head:'Zonaite Helm ★★★',
Armor_1095_Head:'Zonaite Helm ★★★★',
Armor_1091_Upper:'Zonaite Waistguard',
Armor_1092_Upper:'Zonaite Waistguard ★',
Armor_1093_Upper:'Zonaite Waistguard ★★',
Armor_1094_Upper:'Zonaite Waistguard ★★★',
Armor_1095_Upper:'Zonaite Waistguard ★★★★',
Armor_1091_Lower:'Zonaite Shin Guards',
Armor_1092_Lower:'Zonaite Shin Guards ★',
Armor_1093_Lower:'Zonaite Shin Guards ★★',
Armor_1094_Lower:'Zonaite Shin Guards ★★★',
Armor_1095_Lower:'Zonaite Shin Guards ★★★★',

Armor_1096_Head:'Mask of Awakening',
Armor_1097_Head:'Mask of Awakening ★',
Armor_1098_Head:'Mask of Awakening ★★',
Armor_1099_Head:'Mask of Awakening ★★★',
Armor_1100_Head:'Mask of Awakening ★★★★',
Armor_1096_Upper:'Tunic of Awakening',
Armor_1097_Upper:'Tunic of Awakening ★',
Armor_1098_Upper:'Tunic of Awakening ★★',
Armor_1099_Upper:'Tunic of Awakening ★★★',
Armor_1100_Upper:'Tunic of Awakening ★★★★',
Armor_1096_Lower:'Trousers of Awakening',
Armor_1097_Lower:'Trousers of Awakening ★',
Armor_1098_Lower:'Trousers of Awakening ★★',
Armor_1099_Lower:'Trousers of Awakening ★★★',
Armor_1100_Lower:'Trousers of Awakening ★★★★',

Armor_1106_Upper:'Champion\'s Leather',
Armor_1107_Upper:'Champion\'s Leather ★',
Armor_1108_Upper:'Champion\'s Leather ★★',
Armor_1109_Upper:'Champion\'s Leather ★★★',
Armor_1110_Upper:'Champion\'s Leather ★★★★',

Armor_1125_Head:'Horriblin Mask',

Armor_1141_Head:'Hood of the Depths',
Armor_1142_Head:'Hood of the Depths ★',
Armor_1143_Head:'Hood of the Depths ★★',
Armor_1144_Head:'Hood of the Depths ★★★',
Armor_1145_Head:'Hood of the Depths ★★★★',
Armor_1141_Upper:'Tunic of the Depths',
Armor_1142_Upper:'Tunic of the Depths ★',
Armor_1143_Upper:'Tunic of the Depths ★★',
Armor_1144_Upper:'Tunic of the Depths ★★★',
Armor_1145_Upper:'Tunic of the Depths ★★★★',
Armor_1141_Lower:'Gaiters of the Depths',
Armor_1142_Lower:'Gaiters of the Depths ★',
Armor_1143_Lower:'Gaiters of the Depths ★★',
Armor_1144_Lower:'Gaiters of the Depths ★★★',
Armor_1145_Lower:'Gaiters of the Depths ★★★★',

Armor_1151_Head:'Well-Worn Hair Band',

Armor_1300_Head:'Yiga Mask',
Armor_1301_Head:'Yiga Mask ★',
Armor_1302_Head:'Yiga Mask ★★',
Armor_1303_Head:'Yiga Mask ★★★',
Armor_1304_Head:'Yiga Mask ★★★★',
Armor_1300_Upper:'Yiga Armor',
Armor_1301_Upper:'Yiga Armor ★',
Armor_1302_Upper:'Yiga Armor ★★',
Armor_1303_Upper:'Yiga Armor ★★★',
Armor_1304_Upper:'Yiga Armor ★★★★',
Armor_1300_Lower:'Yiga Tights',
Armor_1301_Lower:'Yiga Tights ★',
Armor_1302_Lower:'Yiga Tights ★★',
Armor_1303_Lower:'Yiga Tights ★★★',
Armor_1304_Lower:'Yiga Tights ★★★★'
};

Armor.ICONS=(function(armorNames){
	var armorIdByName={};
	for(var id in armorNames){
		armorIdByName[armorNames[id]]=id;
	}

	var armorIcons={};
	for(var name in armorIdByName){
		armorIcons[armorIdByName[name]]=armorIdByName[name.replace(/ ★+$/,'')];
	}

	return armorIcons
}(Armor.TRANSLATIONS));



