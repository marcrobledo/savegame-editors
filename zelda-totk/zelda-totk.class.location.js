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
	
	COORDINATES_CAVES:[
	],
	
	COORDINATES_WELLS:[
	]
};
