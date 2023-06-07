/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Location class) v20230605

	by Marc Robledo 2023
*/

var Location={
	count:function(){
		return 0;
	},
	setAllAsFound:function(){
		return 0;
	},

	HASHES_CAVES_VISITED:[
		// IsVisitLocation.Cave_
		0x70beac89, //Akkala_0000
		0x66c28ce7, //Akkala_0003
		0xf90d206c, //Akkala_0005
		0x78648a30, //Akkala_0007
		0x220a83dd, //Akkala_0010
		0x339ef50d, //Akkala_0011
		0x3aa2f866, //Akkala_0014
		0x8d57c07e, //Akkala_0017
		0x0674a0bd, //CentralHyrule_0008
		0x885f9459, //CentralHyrule_0009
		0xd48684cb, //CentralHyrule_0011
		0xad9e75ff, //CentralHyrule_0013
		0xe713e9e7, //CentralHyrule_0017
		0x3455e476, //CentralHyrule_0018
		0x4f79eb13, //CentralHyrule_0019
		0x9d75c1d3, //CentralHyrule_0020
		0x40d1056e, //CentralHyrule_0021
		0x0abbca8f, //CentralHyrule_0022
		0x7936f57a, //CentralHyrule_0023
		0x5ba4b407, //CentralHyrule_0030
		0xbb08b046, //Eldin_0020
		0xd63a5bb7, //Eldin_0021
		0x143ca64d, //Eldin_0022
		0xe34ac191, //Eldin_0023
		0x8737b1da, //Eldin_0025
		0xc2e10c80, //Eldin_0026
		0x11977880, //Eldin_0027
		0x4ba5df57, //Eldin_0028
		0x2d40e742, //Eldin_0029
		0x313a3165, //Eldin_0030
		0xcb180972, //Eldin_0031
		0xeac550a4, //Eldin_0033
		0x07a591ce, //Eldin_0034
		0xb2ff63e5, //Eldin_0035
		0x1adb09ee, //Eldin_0037
		0xa6a3becd, //Eldin_0038
		0x2f8767d5, //Eldin_0039
		0xa10697d9, //Firone_0002
		0x59f4b0c4, //Firone_0008
		0x20f6469d, //Firone_0009
		0x65c6cc59, //Firone_0016
		0xdca5b94f, //Firone_0020
		0x38169bc9, //Firone_0022
		0xa2218cd0, //Firone_0023
		0x7a5bcdef, //Firone_0024
		0x639f8bbb, //Firone_0029
		0x274289f7, //FirstPlateau_0001
		0x25f86729, //FirstPlateau_0002
		0x9de23984, //GerudoDesert_0007
		0x067ebfcd, //GerudoDesert_0008
		0x56c80204, //GerudoDesert_0015
		0xe4b12d02, //GerudoDesert_0022
		0x4397c72c, //GerudoDesert_0030
		0x5426852a, //GerudoDesert_0031
		0x11ece482, //GerudoDesert_0032
		0x2c37415e, //GerudoDesert_0035
		0x1adcaed1, //GerudoDesert_0036
		0x77f34d3a, //GerudoDesert_0037
		0xbf72ba80, //GerudoDesert_0039
		0x1af6b3fb, //GerudoDesert_0040
		0x3cddd610, //GerudoDesert_0041
		0xfb66a60d, //GerudoDesert_0043
		0xfd2f1edf, //GerudoDesert_0044
		0xb630844a, //GerudoDesert_0045
		0xcc03b90a, //GerudoDesert_0046
		0xdd666357, //GerudoDesert_0049
		0x4de1371a, //GerudoDesert_0050
		0x849a4fba, //GerudoDesert_0051
		0x50eb446f, //GerudoHighlands_0002
		0x91b71efd, //GerudoHighlands_0008
		0x3edefac8, //GerudoHighlands_0014
		0x05ac4fed, //GerudoHighlands_0017
		0x2524e671, //HateruEast_0000
		0x8105b82b, //HateruEast_0002
		0x0e8fcc05, //HateruEast_0006
		0xd78f4377, //HateruEast_0007
		0xc380c3cb, //HateruEast_0008
		0x2abd4bc2, //HateruEast_0009
		0xbbcad815, //HateruEast_0013
		0x03bc20c2, //HateruEast_0014
		0x0f0ed7d5, //HateruEast_0016
		0xf5da77fb, //HateruWest_0002
		0x663944e6, //HateruWest_0005
		0xc4cd80f9, //HateruWest_0006
		0x350c3681, //HateruWest_0008
		0x1ada2ab2, //HateruWest_0011
		0xeff00233, //HateruWest_0012
		0xad5701c2, //Hebra_0000
		0x037182e7, //Hebra_0013
		0x21a64ff4, //Hebra_0015
		0xd1ce0a34, //Hebra_0016
		0xfcd86823, //Hebra_0019
		0x1a72bb53, //Hebra_0021
		0x3157d630, //Hebra_0022
		0xceea44a0, //Hebra_0023
		0x6815c005, //Hebra_0025
		0x2b371a15, //Hebra_0026
		0xcad2e4b0, //Hebra_0030
		0x8f91b781, //Hebra_0035
		0xb682ebc5, //Hebra_0036
		0x09df7c9e, //Hebra_0037
		0x735f2606, //Hebra_0039
		0xd9887f1c, //Hebra_0040
		0x4e34fbce, //Hebra_0041
		0xc517390c, //HyruleForest_0001
		0xa18b68b2, //HyruleForest_0006
		0xd89fb1b2, //HyruleForest_0007
		0xe48632e5, //HyruleForest_0008
		0x0fefb1eb, //HyruleRidge_0000
		0xc1e94df7, //HyruleRidge_0002
		0x42307003, //HyruleRidge_0003
		0x05911ba1, //HyruleRidge_0004
		0x382483d5, //HyruleRidge_0005
		0xa5f140bd, //HyruleRidge_0006
		0x0ca0ce73, //HyruleRidge_0007
		0xdcec204b, //HyruleRidge_0008
		0x9abc682d, //Lanayru_0006
		0x89973227, //Lanayru_0008
		0x5a61a547, //Lanayru_0014
		0x1f7e074d, //Lanayru_0019
		0xa20ffcac, //Lanayru_0024
		0x45bc9efb, //Lanayru_0032
		0x0bea01d8, //Lanayru_0033
		0x6cb6e71f, //Lanayru_0035
		0x13821c00, //Lanayru_0036
		0x89efde88, //Lanayru_0048
		0x3f894c25, //Lanayru_0049
		0xd9289883, //Lanayru_0050
		0xa84390b1, //Lanayru_0052
		0x4144f094, //Lanayru_0053
		0x22946539, //Lanayru_0055
		0xfe23935a, //Lanayru_0057
		0xee2118bf, //Lanayru_0060
		0x8f2ddec1, //Lanayru_0061
		0x9aa7f2f0, //Lanayru_0063
		0xc5c5e0be, //LanayruMountain_0002
		0x5d32a152, //LanayruMountain_0006
		0x4aeb16ce, //LanayruMountain_0008
		0x09285af2, //LanayruMountain_0010
		0x121f7ea7, //LanayruMountain_0014
		0xe00c46c2, //LanayruMountain_0016
		0x35d5115a, //LanayruMountain_0022
		0x4c6eec19, //LanayruMountain_0024
		0x17307422, //LanayruMountain_0025
		0x008c809a, //LanayruMountain_0026
		0x8b7dd33a, //Tabantha_0001
		0xcce3e817, //Tabantha_0002
		0xbe289d21 //Tabantha_0003
	],

	HASHES_WELLS_VISITED:[
		//IsVisitLocation.Well_
		0xcf49f2f4, //0001
		0xb3f29303, //0002
		0x948ee4c3, //0003
		0x22bf95a3, //0004
		0x33ed2128, //0005
		0x52288548, //0006
		0xfb24550e, //0007
		0xd5da3dc2, //0008
		0xce10c409, //0009
		0x17728ef2, //0010
		0xa79e018f, //0011
		0x1c2b453d, //0012
		0xeebfae4a, //0013
		0xaa2d64bd, //0014
		0x20345a54, //0015
		0x9a3bbae6, //0016
		0x9f5988d4, //0017
		0x6585923e, //0018
		0x5057aba2, //0019
		0x82cf89a8, //0020
		0xb34cb810, //0021
		0x6ff9ab89, //0022
		0x09824b9b, //0023
		0x2a57abc0, //0024
		0xbd04710f, //0025
		0x22c36d33, //0026
		0xeb54bec3, //0027
		0x69dbca5d, //0028
		0x7d9ad2b9, //0029
		0x40519576, //0030
		0x4f0285cc, //0031
		0xc8951de0, //0032
		0x3536ec3a, //0033
		0x68d8678c, //0034
		0xd48a39a6, //0041
		0x4046d03d, //0042
		0xc34379ae, //0043
		0x1d484a39, //0043B
		0x10358cdf, //0044
		0x52446b30, //0045
		0x0b01b135, //0046
		0xa6e5a3a5, //0047
		0xf93a7b62, //0047B
		0xc1af1bc2, //0048
		0x142f6e30, //0049
		0x84360aee, //0049B
		0x9af34b71, //0049C
		0xc6ecd904, //0049D
		0x7d075fc4, //0049E
		0x70ea3f6b, //0050
		0xed769d7f, //0051
		0x18d40c90, //0052
		0x93cf0484, //0053
		0x7651924a, //0054
		0x1cee4385, //0055
		0x1380e557, //0056
		0xd2cbb159, //0057
		0x104fc5b9, //0058
		0xbd07e84b //0059
	],

	HASHES_BOSSES_REMATCH_DEFEATED:[
		//IsDefeatBossEnemy.
		0xab170b3c, //11392603486633175579 - Enemy_DungeonBoss_Rito_Underground
		0xa0b5253d, //13478036497897348683 - Enemy_DungeonBoss_Goron_Underground
		0xa6e5f8f9, //13679657688670718412 - Enemy_DungeonBoss_Gerudo_Underground
		0x0069a6fe, //16102269431729981480 - Enemy_DungeonBoss_Gerudo_Underground
		0xf2b13c3f, //268066833160582041 - Enemy_DungeonBoss_Goron_Underground
		0x0f86acd0, //2913438567168641393 - Enemy_DungeonBoss_Rito_Underground
		0x8fd913f8, //4047783038021099072 - Enemy_DungeonBoss_Zora_Underground
		0xbc9fde5a, //5069068021545237469 - Enemy_DungeonBoss_Zora_Underground
		0x2730997d, //5210398793000277741 - Enemy_DungeonBoss_Zora_Underground
		0xe72eb42e, //6031128008877239078 - Enemy_DungeonBoss_Gerudo_Underground
		0xe18248e8, //7058364791334812681 - Enemy_DungeonBoss_Rito_Underground
		0xffb3f46b //8899164221420779612 - Enemy_DungeonBoss_Goron_Underground
	],

	HASHES_BOSSES_HINOXES_DEFEATED:[
		//IsDefeatBossEnemy.
		0x73cdc65f, //10393024982276893449 - Enemy_Giant_Junior
		0x802a685b, //10478866091159762847 - Enemy_Giant_Bone
		0xd5228754, //11391803945734372644 - Enemy_Giant_Junior
		0x6a18a1f9, //11646385671586165409 - Enemy_Giant_Junior
		0xc3244c7b, //12084395073896819946 - Enemy_Giant_Middle
		0xe1a28b21, //12156520767722928666 - Enemy_Giant_Senior
		0xc5b95329, //12172309767157242770 - Enemy_Giant_Senior
		0x186f50e4, //12189696549508944958 - Enemy_Giant_Junior
		0x548d830e, //1253417564937333245 - Enemy_Giant_Junior
		0x339ada62, //12865762981498719704 - Enemy_Giant_Middle
		0x70e03aea, //13068579721264552970 - Enemy_Giant_Junior_KeyCrystal
		0xef027e9e, //13108164403586003251 - Enemy_Giant_Senior
		0xe7d22a1e, //13182371169943433737 - Enemy_Giant_Bone_AllDay
		0x88d95135, //1324956813743135889 - Enemy_Giant_Middle
		0x09eda448, //13424713487864629086 - Enemy_Giant_Senior
		0x9cc2f318, //13573462785682957760 - Enemy_Giant_Senior
		0x6ce3aae0, //13576363668673257709 - Enemy_Giant_Junior
		0xcdd24dc3, //13814219220882276413 - Enemy_Giant_Bone_AllDay
		0x3ef68091, //14054880716782309343 - Enemy_Giant_Junior
		0x29a424d5, //14337819024733804584 - Enemy_Giant_Junior
		0x33123104, //14526639162114294278 - Enemy_Giant_Middle
		0x271e2bf0, //14621448399444931002 - Enemy_Giant_Bone
		0x0e385329, //14904586104824915761 - Enemy_Giant_Middle
		0x8751a4d7, //14944507340504403952 - Enemy_Giant_Middle
		0x4c5cbe28, //15654842093127035824 - Enemy_Giant_Middle
		0xe55fde6d, //15710848923862242406 - Enemy_Giant_Middle
		0xd1265861, //16259229493834825041 - Enemy_Giant_Bone
		0x26a34449, //1639803847665937650 - Enemy_Giant_Senior
		0x1d7597bc, //16540867052627905405 - Enemy_Giant_Bone_AllDay
		0xa735405a, //16628394918171379204 - Enemy_Giant_Senior
		0xf87c46cb, //1717235292479538693 - Enemy_Giant_Middle
		0x3b2726f4, //17244025876471935559 - Enemy_Giant_Senior
		0x69ae65f0, //17261512901323798485 - Enemy_Giant_Middle
		0x814595c9, //17535370195893647812 - Enemy_Giant_Senior
		0xf00e5eaa, //17673521661875206035 - Enemy_Giant_Junior
		0xf03a51ad, //17908814150863161599 - Enemy_Giant_Junior
		0xcefc5ebc, //18229569222017030228 - Enemy_Giant_Junior
		0x8c4d535e, //1921831016094605353 - Enemy_Giant_Middle
		0xe067fd28, //2142339064331920943 - Enemy_Giant_Middle
		0x5d3e9af6, //2143154645032902813 - Enemy_Giant_Bone_AllDay
		//0x140b46d7, //2289558621411447418 - Enemy_Giant_Junior
		0x3eafefdc, //2315581091174276245 - Enemy_Giant_Bone
		0xe4d27c11, //3314491652834871143 - Enemy_Giant_Bone_AllDay
		0x0b4dcd92, //4252180854327755778 - Enemy_Giant_Junior
		0x18295227, //4284803738149888786 - Enemy_Giant_Junior
		0x8aa89797, //4288206182804750823 - Enemy_Giant_Bone_AllDay
		0xd50dd4cb, //452419876022480148 - Enemy_Giant_Senior
		0x165f835b, //459812943559027451 - Enemy_Giant_Senior
		0x1bd37a12, //4708996257713033144 - Enemy_Giant_Bone_AllDay
		0xa09409be, //5036040187462248760 - Enemy_Giant_Senior
		0xbb68d751, //5195857299422128797 - Enemy_Giant_Bone_AllDay
		0x482c5a03, //5575787237480219164 - Enemy_Giant_Middle
		0x112d0d53, //560749391720993573 - Enemy_Giant_Bone_AllDay
		0xc78760f8, //5673364078558667333 - Enemy_Giant_Senior
		0xabc9cce6, //5769175489262689615 - Enemy_Giant_Bone_AllDay
		0x6442b9ef, //592345040742879573 - Enemy_Giant_Bone
		0x6da07e01, //6155466547645615532 - Enemy_Giant_Middle
		0xb5a837bc, //6171542648341365532 - Enemy_Giant_Senior
		0x27ce40e5, //6201413135185999006 - Enemy_Giant_Bone_AllDay
		0xd735eed8, //6324487294558236569 - Enemy_Giant_Junior
		0x15667b8e, //6417076432269543377 - Enemy_Giant_Junior
		0x42211193, //6678850075053463054 - Enemy_Giant_Senior
		0x8927dc6f, //6697862445755836219 - Enemy_Giant_Junior
		0x1401fdb3, //7020588333224438768 - Enemy_Giant_Senior
		0xcdebf5bd, //7041383940937881620 - Enemy_Giant_Bone_AllDay
		0x77761549, //7483814142761593567 - Enemy_Giant_Bone_AllDay
		0x568cc4bd, //814989563464506880 - Enemy_Giant_Bone
		0x0411bd1c, //8540332896120388188 - Enemy_Giant_Senior
		0x57070b19, //9137312690332556523 - Enemy_Giant_Middle
		0x8e1ccab1 //9316316819130700830 - Enemy_Giant_Bone_AllDay
	],

	HASHES_BOSSES_TALUSES_DEFEATED:[
		//IsDefeatBossEnemy.
		0x9f9b40d6, //10068938260813754755 - Enemy_Golem_Fort_A_Wander
		0x8b486d07, //10245753642321424701 - Enemy_Golem_Fort_A
		0x7ad63fa8, //10247711565523857438 - Enemy_Golem_Fort_A
		0xe9a2ae7f, //10455502375357747483 - Enemy_Golem_Middle
		0x905ea02e, //10618835352613211749 - Enemy_Golem_Middle
		0xd43fd092, //10892800195334423523 - Enemy_Golem_Fire_KeyCrystal
		0x4db447b9, //11443155446257060295 - Enemy_Golem_Middle
		0xa4e8e50e, //11530044562170297151 - Enemy_Golem_Senior
		0xa8756648, //11731926584831658232 - Enemy_Golem_Fort_A
		0xbe5f233a, //12380519682675677169 - Enemy_Golem_Senior
		0x9d6b4642, //12651336382394967980 - Enemy_Golem_Senior
		0xb166db6c, //13253920385584715510 - Enemy_Golem_Middle
		0xa2d4c991, //13304930093133988979 - Enemy_Golem_Middle
		0x59f1c02e, //13471164085200170448 - Enemy_Golem_Fort_A_Wander
		0xc84cbb8f, //13537057953222982457 - Enemy_Golem_Ice
		0xc6dde95b, //14186229878786082807 - Enemy_Golem_Senior
		0x0b50ee69, //14301933489819552196 - Enemy_Golem_Fort_A
		0xb31a5983, //14321487078129349713 - Enemy_Golem_Fire
		0x6fa68bac, //14365999305599602621 - Enemy_Golem_Fire
		0xb27ef16f, //14426239951359628434 - Enemy_Golem_Fort_A
		0xec2735c0, //14774490785716930628 - Enemy_Golem_Fort_A
		0xb117ffaf, //15181532392716237288 - Enemy_Golem_Fort_A
		0x95fbd37d, //15277665366631994122 - Enemy_Golem_Middle
		0xa449182a, //15285027607181791455 - Enemy_Golem_Junior
		0x7f7fa936, //1530232208606829323 - Enemy_Golem_Middle
		0x36c21c1c, //15424779878836339310 - Enemy_Golem_Senior
		0x5f379b38, //1547444985858466855 - Enemy_Golem_Fort_A_Wander
		0xd58c280b, //15513207573053888916 - Enemy_Golem_Ice
		0x889c540c, //15927226762116133840 - Enemy_Golem_Senior
		0xaf9a5195, //16190239693163851365 - Enemy_Golem_Junior_KeyCrystal
		0xbf7247d8, //16303560262861595679 - Enemy_Golem_Fire
		0x51db4541, //16420194130839672297 - Enemy_Golem_Fire
		0x6f741eef, //16595128438601429843 - Enemy_Golem_Middle
		0xa94cdb3e, //16700727111736997492 - Enemy_Golem_Junior
		0x890dca7f, //16750487341306993332 - Enemy_Golem_Fort_A
		0x874571fe, //17073066599977669906 - Enemy_Golem_Middle
		0x552acfc2, //17288738412385992381 - Enemy_Golem_Senior
		0x57392eef, //17325969905876983456 - Enemy_Golem_Senior
		0xc82b6159, //1757994764188803558 - Enemy_Golem_Middle
		0x9af270b2, //17769742489494399452 - Enemy_Golem_Fire
		0xd7119323, //18224106715969131233 - Enemy_Golem_Ice_KeyCrystal
		0x4ecbbf59, //18395733775024195032 - Enemy_Golem_Fort_A_Wander
		0xfc30fbc0, //2050956691456113054 - Enemy_Golem_Senior
		0xc45b2ccc, //2052555409109371027 - Enemy_Golem_Senior
		0x608c2d3a, //2361313891946414063 - Enemy_Golem_Middle
		0x7980d385, //2520346700240257683 - Enemy_Golem_Junior
		0x535c77bd, //2531771477704802275 - Enemy_Golem_Fort_A
		0xb7ae3986, //257806995679989693 - Enemy_Golem_Fort_A
		0xdaacc45d, //2717240242476958557 - Enemy_Golem_Junior
		0xad93f5bd, //3037055588741651274 - Enemy_Golem_Middle
		0xd791063e, //3042969628746501486 - Enemy_Golem_Fort_A_Wander
		0x803e47c2, //3116461437538472761 - Enemy_Golem_Middle
		0x8f50f2c1, //3269666100524179229 - Enemy_Golem_Fort_A
		0x61b1fbda, //3276861371055278357 - Enemy_Golem_Ice
		0xa9aa4b3c, //3588912653393884250 - Enemy_Golem_Middle
		0xe04021fa, //4536425597808032527 - Enemy_Golem_Fort_A
		0x1b7b02d4, //4645246919721611071 - Enemy_Golem_Fire
		0x12dee5a0, //5054150653061776460 - Enemy_Golem_Middle
		0x4e416702, //531774016647022976 - Enemy_Golem_Fort_A
		0x58885f47, //5587051473016743388 - Enemy_Golem_Fort_A
		0xfcc50129, //5642566669897180838 - Enemy_Golem_Middle
		0x1e6c7853, //5664120884073212404 - Enemy_Golem_Junior
		0x321a2ff1, //5669149490197538992 - Enemy_Golem_Junior
		0x8051953b, //5709325748160470100 - Enemy_Golem_Senior
		0x76147575, //5838353936759761014 - Enemy_Golem_Fire
		0xd5999747, //5901073410690925575 - Enemy_Golem_Fort_A_Wander
		0xb634393b, //6008600732561825508 - Enemy_Golem_Ice
		0x37fbb785, //6062387962514300764 - Enemy_Golem_Ice
		0x5bf863a5, //6106633361497918783 - Enemy_Golem_Senior
		0x368df7ef, //614517283498470563 - Enemy_Golem_Senior
		0x509f3803, //6363774565855950232 - Enemy_Golem_Middle
		0x50e7f4fd, //650394321314037942 - Enemy_Golem_Middle
		0x76177b24, //6617455511387048783 - Enemy_Golem_Middle
		0xb579266b, //674996768932339785 - Enemy_Golem_Fort_A
		0xeb5f3cf3, //6958531408834172139 - Enemy_Golem_Middle
		0x0dbd2e32, //7166375183008937597 - Enemy_Golem_Ice
		0x27f36153, //734898175742900540 - Enemy_Golem_Fort_A
		0x07204562, //748422554435948301 - Enemy_Golem_Middle
		0x5d9e92da, //7720265237709075418 - Enemy_Golem_Ice
		0x1b53507f, //7743906873710274373 - Enemy_Golem_Junior
		0x86041e8f, //7751318989887040996 - Enemy_Golem_Fire
		0x7a28cc7d, //7973997105951827682 - Enemy_Golem_Middle
		0x4b7cd218, //8372955289030476491 - Enemy_Golem_Junior
		0x9be62122, //8425189098582944053 - Enemy_Golem_Fort_A
		0x9ebf7572, //8738202729678699744 - Enemy_Golem_Fort_A
		0x38a9f859, //8990366834921699727 - Enemy_Golem_Senior
		0x728cddfa //9574730864949561488 - Enemy_Golem_Ice
	],

	HASHES_BOSSES_MOLDUGA_DEFEATED:[
		//IsDefeatBossEnemy.
		0x64eb3a85, //15680669918719030586 - Enemy_Sandworm
		0x4c446633, //16109259853398140926 - Enemy_Sandworm
		0x362e8f22, //720594899592278164 - Enemy_Sandworm
		0xa884f7b5 //720594901953648144 - Enemy_Sandworm
	],

	HASHES_BOSSES_FLUX_CONSTRUCT_DEFEATED:[
		//IsDefeatBossEnemy.
		0x25d4c463, //10222155126030895252 - Enemy_Zonau_BlockMaster_Junior
		0x7a5d5d0a, //10825910867985107571 - Enemy_Zonau_BlockMaster_Junior
		0x5c6a95fb, //11145583613564400356 - Enemy_Zonau_BlockMaster_Middle
		0x83c2df0c, //11586813961110368510 - Enemy_Zonau_BlockMaster_Senior
		0x62bcd3bc, //1189017656548284800 - Enemy_Zonau_BlockMaster_Middle
		0x3bad804e, //12318069930102768206 - Enemy_Zonau_BlockMaster_Senior
		0xe0caa12e, //12582822302362406274 - Enemy_Zonau_BlockMaster_Middle
		0xe58fd91e, //13645117975067836849 - Enemy_Zonau_BlockMaster_Middle
		0x36009a9a, //14066905759849320793 - Enemy_Zonau_BlockMaster_Senior
		0xeb7c4d24, //14163883612070869185 - Enemy_Zonau_BlockMaster_Middle
		0x2a2157fc, //14394590123198368495 - Enemy_Zonau_BlockMaster_Junior_Beginning
		0xa121c2c7, //14566956898059740706 - Enemy_Zonau_BlockMaster_Junior
		0xd7ed1df4, //16472864484409299518 - Enemy_Zonau_BlockMaster_Middle
		0xf5c1bafc, //16797531286285858440 - Enemy_Zonau_BlockMaster_Middle
		0xf8130875, //17179098246083532718 - Enemy_Zonau_BlockMaster_Senior
		0xfc24c532, //17241620804693571155 - Enemy_Zonau_BlockMaster_Middle
		0x2b7ba716, //17321739447049567216 - Enemy_Zonau_BlockMaster_Senior
		0xb33d6fd6, //17326521960335894535 - Enemy_Zonau_BlockMaster_Senior
		0x3fdfcf6c, //17598605949911910671 - Enemy_Zonau_BlockMaster_Middle
		0x8fbbb9bd, //17999338913107429884 - Enemy_Zonau_BlockMaster_Junior
		0x6ba4da77, //18388369626843360386 - Enemy_Zonau_BlockMaster_Middle
		0xcbef5fc1, //2610312770363458991 - Enemy_Zonau_BlockMaster_Senior
		0x9f723ee4, //3483652224929144928 - Enemy_Zonau_BlockMaster_Middle
		0x98fa3ceb, //4364014246130795469 - Enemy_Zonau_BlockMaster_Middle
		0x47b0bed9, //5031365138018829090 - Enemy_Zonau_BlockMaster_Middle
		0xd3d07ca2, //5789571879451320381 - Enemy_Zonau_BlockMaster_Senior
		0x90cf50e7, //5903652489332550636 - Enemy_Zonau_BlockMaster_Senior
		0x4ee767ab, //5961441219654151595 - Enemy_Zonau_BlockMaster_Junior
		0x3021225c, //6612854448490639651 - Enemy_Zonau_BlockMaster_Senior
		0xfbbdb439, //6675287854574112562 - Enemy_Zonau_BlockMaster_Senior
		0x9b2adde9, //8744762158735793351 - Enemy_Zonau_BlockMaster_Senior
		0xc31ba41b, //8794010902871923669 - Enemy_Zonau_BlockMaster_Junior
		0x7861acbb, //918808305345137744 - Enemy_Zonau_BlockMaster_Senior
		0x976e9085, //9376039496073809047 - Enemy_Zonau_BlockMaster_Senior
		0x9b88093e //9620017455593796058 - Enemy_Zonau_BlockMaster_Senior
	],

	HASHES_BOSSES_GLEEOKS_DEFEATED:[
		//IsDefeatBossEnemy.
		0x7f8e8d9b, //13096827551802913012 - Enemy_Drake_Fire
		0x35b7597e, //15016330217960208345 - Enemy_Drake_Mix
		0xf1d7e7d3, //16188501114549156914 - Enemy_Drake_Electric
		0x8ab15a70, //17202757845512439687 - Enemy_Drake_Ice
		0xf00adc75, //17371437495503120726 - Enemy_Drake_Mix
		0xc8d9587b, //17525482178277971341 - Enemy_Drake_Mix
		0xe430c1ee, //17618439493369911666 - Enemy_Drake_Electric
		0x09e986c6, //18215301882184071282 - Enemy_Drake_Ice
		0xf8e86923, //2677006142106004616 - Enemy_Drake_Fire
		0xd5959044, //3292507397962573828 - Enemy_Drake_Fire
		0x96f03828, //3362043677383214065 - Enemy_Drake_Mix
		0x6a8df83f, //3563560582355181031 - Enemy_Drake_Electric
		0x5c6aa7b3, //7024559691671561212 - Enemy_Drake_Fire
		0xf811d7cb, //7375109460783924447 - Enemy_Drake_Ice
	],

	HASHES_BOSSES_FROXS_DEFEATED:[
		//IsDefeatBossEnemy.
		0x169430a2, //10328270447128116576 - Enemy_Mogurudo_Junior
		0x1c9c116b, //1037511654320139812 - Enemy_Mogurudo_Middle
		0xd1dfb8cc, //11065257984001538111 - Enemy_Mogurudo_Junior
		0xe60cd4cc, //11460127974052525879 - Enemy_Mogurudo_Middle
		0x3668b8d6, //11463419723365905925 - Enemy_Mogurudo_Middle
		0x6ee4a677, //11697554953969771909 - Enemy_Mogurudo_Middle
		0xa24823eb, //12178269734113806125 - Enemy_Mogurudo_Junior
		0x9ddfabff, //12191333624691976966 - Enemy_Mogurudo_Junior
		0xef668d93, //12251528895527667485 - Enemy_Mogurudo_Middle
		0x4d0d8fe3, //12365670230816177776 - Enemy_Mogurudo_Senior
		0xe0b131e6, //12377670104334831108 - Enemy_Mogurudo_Senior
		0x49cf21a8, //12500036569524877284 - Enemy_Mogurudo_Junior
		0xa8027d0c, //12561938510478171825 - Enemy_Mogurudo_Senior
		0x5b894eb1, //12969150355366457728 - Enemy_Mogurudo_Junior
		0x754b1650, //13018743282921575560 - Enemy_Mogurudo_Senior
		0x8441dcc9, //13381008868456051578 - Enemy_Mogurudo_Middle
		0x4d890430, //13837255093514248180 - Enemy_Mogurudo_Middle
		0x5debb6a6, //13851603196554131143 - Enemy_Mogurudo_Senior
		0x082cc63a, //14407397624133737004 - Enemy_Mogurudo_Middle
		0x0441ff69, //1461859666042172890 - Enemy_Mogurudo_Senior
		0x2f9108f0, //1527772026081084599 - Enemy_Mogurudo_Middle
		0x76e36f4f, //16647980483221192829 - Enemy_Mogurudo_Middle
		0xd100a967, //16897534171235232390 - Enemy_Mogurudo_Senior
		0xd6b83f22, //1978969002134918203 - Enemy_Mogurudo_Junior
		0x11c1f160, //2789826488794643712 - Enemy_Mogurudo_Junior
		0x5c7a2882, //4220478359636022535 - Enemy_Mogurudo_Senior
		0x05b33279, //4374224543112302902 - Enemy_Mogurudo_Junior
		0xec6bdd61, //4471433317634819585 - Enemy_Mogurudo_Junior
		0x2c9f01ef, //5162969136808801268 - Enemy_Mogurudo_Middle
		0x6121697c, //5670631349020401293 - Enemy_Mogurudo_Middle
		0x0171233e, //616703579663155458 - Enemy_Mogurudo_Middle
		0xa5d53120, //6667026148310498870 - Enemy_Mogurudo_Middle
		0x9f6518c2, //7309042596103602194 - Enemy_Mogurudo_Senior
		0xc522d3a7, //9242284032603550008 - Enemy_Mogurudo_Senior
		0xef4dab11, //9533482995923962235 - Enemy_Mogurudo_Junior
		0x9c31d47b, //9534557315088646819 - Enemy_Mogurudo_Middle
		0x51a3caad, //9597483127740858165 - Enemy_Mogurudo_Senior
		0xa582c596, //9846036367288186688 - Enemy_Mogurudo_Junior
		0x06e09b0e, //9893429190146755208 - Enemy_Mogurudo_Senior
		0x8ef251a9 //9927835261964580308 - Enemy_Mogurudo_Senior
	],

	COORDINATES_CAVES:[
	],
	
	COORDINATES_WELLS:[
	]
};
