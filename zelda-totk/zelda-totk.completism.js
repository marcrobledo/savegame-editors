/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Completism) v20230608

	by Marc Robledo 2023
	research & information compiled by MacSpazzy, Karlos007 and Echocolat
	korok unused hashes filtered by Karlos007
*/

var Completism={
	_count:function(booleanHashes, valueTrue){
		if(typeof valueTrue==='string')
			valueTrue=murmurHash3.x86.hash32(valueTrue);
		else if(typeof valueTrue==='number')
			valueTrue=valueTrue;
		else
			valueTrue=1;

		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(booleanHashes);
		for(var i=0; i<booleanHashes.length; i++){
			var val=tempFile.readU32(offsets[booleanHashes[i]]);
			if(val===valueTrue)
				count++;
		}
		return count;
	},
	_countReverse:function(booleanHashes, valueFalse){
		return booleanHashes.length - this._count(booleanHashes, valueFalse);
	},
	countShrinesFound:function(){
		return this._count(CompletismHashes.SHRINES_FOUND);
	},
	countShrinesClear:function(){
		return this._count(CompletismHashes.SHRINES_STATUS, 'Clear'); //possible values: Hidden,Appear,Open,Enter,Clear
	},
	countLightrootsFound:function(){
		return this._count(CompletismHashes.LIGHTROOTS_FOUND);
	},
	countLightrootsClear:function(){
		return this._count(CompletismHashes.LIGHTROOTS_STATUS, 'Open'); //possible values: Close,Open
	},
	countKoroksHidden:function(){
		return this._count(CompletismHashes.KOROKS_HIDDEN);
	},
	countKoroksCarry:function(){
		return this._count(CompletismHashes.KOROKS_CARRY, 'Clear'); //possible values: NotClear,Clear
	},
	countBubbuls:function(){
		return this._count(CompletismHashes.BUBBULS_DEFEATED);
	},
	countLocationCaves:function(){
		return this._count(CompletismHashes.LOCATION_CAVES_VISITED);
	},
	countLocationWells:function(){
		return this._count(CompletismHashes.LOCATION_WELLS_VISITED);
	},
	countBossesHinox:function(){
		return this._count(CompletismHashes.BOSSES_HINOXES_DEFEATED);
	},
	countBossesTalus:function(){
		return this._count(CompletismHashes.BOSSES_TALUSES_DEFEATED);
	},
	countBossesMolduga:function(){
		return this._count(CompletismHashes.BOSSES_MOLDUGAS_DEFEATED);
	},
	countBossesFlux:function(){
		return this._count(CompletismHashes.BOSSES_FLUX_CONSTRUCT_DEFEATED);
	},
	countBossesFrox:function(){
		return this._count(CompletismHashes.BOSSES_FROXS_DEFEATED);
	},
	countBossesGleeok:function(){
		return this._count(CompletismHashes.BOSSES_GLEEOKS_DEFEATED);
	},
	countSchematicsStone:function(){
		return this._count(CompletismHashes.SCHEMATICS_STONE_FOUND);
	},
	countSchematicsYiga:function(){
		return this._count(CompletismHashes.SCHEMATICS_YIGA_FOUND);
	},
	countCompendium:function(){
		return this._countReverse(CompletismHashes.COMPENDIUM_STATUS, 'Unopened'); //possible values: Unopened,TakePhoto,Buy
	},


	_set:function(booleanHashes, limit, valueTrue, onlyWhen){
		if(typeof valueTrue==='string')
			valueTrue=murmurHash3.x86.hash32(valueTrue);
		else if(typeof valueTrue==='number')
			valueTrue=valueTrue;
		else
			valueTrue=1;

		if(typeof onlyWhen==='string')
			onlyWhen=murmurHash3.x86.hash32(onlyWhen);
		else if(typeof onlyWhen==='number')
			onlyWhen=onlyWhen;
		else
			onlyWhen=0;

		var count=0;
		var offsets=SavegameEditor._getOffsetsByHashes(booleanHashes);
		for(var i=0; i<booleanHashes.length; i++){
			var val=tempFile.readU32(offsets[booleanHashes[i]]);
			if(val!==valueTrue && (!onlyWhen || val===onlyWhen)){
				tempFile.writeU32(offsets[booleanHashes[i]], valueTrue);
				count++;
				if(limit && count===limit)
					break;
			}
		}

		return count;
	},
	setShrinesAsFound:function(limit){
		var changes=this._set(CompletismHashes.SHRINES_FOUND, limit);
		MarcDialogs.alert(changes+' shrines set as found.');
		//console.info(this._set(CompletismHashes.SHRINES_STATUS, limit, 'Open', 'Hidden')+' shrines switched from Hidden to Open');
		//console.info(this._set(CompletismHashes.SHRINES_STATUS, limit, 'Open', 'Appear')+' shrines switched from Appear to Open');
		SavegameEditor.refreshCounterShrinesFound();
		return changes;
	},
	setShrinesAsClear:function(limit){
		var changes=this._set(CompletismHashes.SHRINES_STATUS, limit, 'Clear'); //possible values: Hidden,Appear,Open,Enter,Clear
		MarcDialogs.alert(changes+' shrines set as clear.');
		if(changes)
			SavegameEditor.addItem('key', 'Obj_DungeonClearSeal', changes);
		SavegameEditor.refreshCounterShrinesClear();
		return changes;
	},
	setLightrootsAsFound:function(limit){
		var changes=this._set(CompletismHashes.LIGHTROOTS_FOUND, limit);
		MarcDialogs.alert(changes+' lightroots set as found.');
		SavegameEditor.refreshCounterLighrootsFound();
		return changes;
	},
	setLightrootsAsClear:function(limit){
		var changes=this._set(CompletismHashes.LIGHTROOTS_STATUS, limit, 'Open'); //possible values: Close,Open
		MarcDialogs.alert(changes+' lightroots set as clear.');
		if(changes)
			SavegameEditor.addItem('key', 'Obj_DungeonClearSeal', changes);
		SavegameEditor.refreshCounterLighrootsClear();
		return changes;
	},
	setKoroksAsFound:function(limit){
		var changes=this._set(CompletismHashes.KOROKS_HIDDEN, limit);
		MarcDialogs.alert(changes+' koroks set as found.');
		if(changes)
			SavegameEditor.addItem('key', 'Obj_KorokNuts', changes);
		SavegameEditor.refreshCounterKoroksHidden();
		return changes;
	},
	setKoroksAsCarried:function(limit){
		var changes=this._set(CompletismHashes.KOROKS_CARRY, limit, 'Clear'); //possible values: NotClear,Clear
		MarcDialogs.alert(changes+' koroks set as carried.');
		if(changes)
			SavegameEditor.addItem('key', 'Obj_KorokNuts', changes*2);
		SavegameEditor.refreshCounterKoroksCarry();
		return changes;
	},
	defeatBubbuls:function(limit){
		var changes=this._set(CompletismHashes.BUBBULS_DEFEATED, limit);
		MarcDialogs.alert(changes+' bubbuls set as defeated.');
		if(changes)
			SavegameEditor.addItem('key', 'CaveMasterMedal', changes);
		SavegameEditor.refreshCounterBubbuls();
		return changes;
	},
	visitLocationCaves:function(limit){
		var changes=this._set(CompletismHashes.LOCATION_CAVES_VISITED, limit);
		MarcDialogs.alert(changes+' caves set as visited.');
		SavegameEditor.refreshCounterLocationCaves();
		return changes;
	},
	visitLocationWells:function(limit){
		var changes=this._set(CompletismHashes.LOCATION_WELLS_VISITED, limit);
		MarcDialogs.alert(changes+' wells set as visited.');
		SavegameEditor.refreshCounterLocationWells();
		this._set(CompletismHashes.LOCATION_WELLS_VISITED2, limit);
		return changes;
	},
	defeatBossesHinox:function(limit){
		var changes=this._set(CompletismHashes.BOSSES_HINOXES_DEFEATED, limit);
		MarcDialogs.alert(changes+' hinoxes set as defeated.');
		SavegameEditor.refreshCounterBossesHinox();
		return changes;
	},
	defeatBossesTalus:function(limit){
		var changes=this._set(CompletismHashes.BOSSES_TALUSES_DEFEATED, limit);
		MarcDialogs.alert(changes+' taluses set as defeated.');
		SavegameEditor.refreshCounterBossesTalus();
		return changes;
	},
	defeatBossesMolduga:function(limit){
		var changes=this._set(CompletismHashes.BOSSES_MOLDUGAS_DEFEATED, limit);
		MarcDialogs.alert(changes+' moldugas set as defeated.');
		SavegameEditor.refreshCounterBossesMolduga();
		return changes;
	},
	defeatBossesFlux:function(limit){
		var changes=this._set(CompletismHashes.BOSSES_FLUX_CONSTRUCT_DEFEATED, limit);
		MarcDialogs.alert(changes+' flux constructs set as defeated.');
		SavegameEditor.refreshCounterBossesFlux();
		return changes;
	},
	defeatBossesFrox:function(limit){
		var changes=this._set(CompletismHashes.BOSSES_FROXS_DEFEATED, limit);
		MarcDialogs.alert(changes+' froxs set as defeated.');
		SavegameEditor.refreshCounterBossesFrox();
		return changes;
	},
	defeatBossesGleeok:function(limit){
		var changes=this._set(CompletismHashes.BOSSES_GLEEOKS_DEFEATED, limit);
		MarcDialogs.alert(changes+' gleoks set as defeated.');
		SavegameEditor.refreshCounterBossesGleeok();
		return changes;
	},
	setSchematicStonesAsFound:function(limit){
		var changes=this._set(CompletismHashes.SCHEMATICS_STONE_FOUND, limit);
		MarcDialogs.alert(changes+' schematic stones set as found.');
		if(changes)
			SavegameEditor.addItem('key', 'Obj_AutoBuilderDraft_00', changes);
		SavegameEditor.refreshCounterSchematicsStone();
		return changes;
	},
	setSchematicYigaAsFound:function(limit){
		var changes=this._set(CompletismHashes.SCHEMATICS_YIGA_FOUND, limit);
		MarcDialogs.alert(changes+' yiga schematics set as found.');
		if(changes)
			SavegameEditor.addItem('key', 'Obj_AutoBuilderDraftAssassin_00', changes);
		SavegameEditor.refreshCounterSchematicsYiga();
		return changes;
	},
	setCompendiumAsStockCurrentOnly:function(limit){
		var changes=this._set(CompletismHashes.COMPENDIUM_STATUS, limit, 'Buy', 'TakePhoto'); //possible values: Unopened,TakePhoto,Buy
		MarcDialogs.alert(changes+' pictures set to stock.<br/>You can now delete all .jpg images in /picturebook/ folder.');
		return changes;
	},
	setCompendiumAsBought:function(limit){
		var changes=this._set(CompletismHashes.COMPENDIUM_STATUS, limit, 'Buy'); //possible values: Unopened,TakePhoto,Buy
		MarcDialogs.alert(changes+' pictures unlocked');
		SavegameEditor.refreshCounterCompendium();
		return changes;
	},
};

var CompletismHashes={
	SHRINES_FOUND:[
		// IsVisitLocation.DungeonXXX (000-151)
		0xa487c021,0xab281eb6,0xda2de4a7,0x4e2394a9,0x3ccbcd89,0xf736a246,0x9c9e1c68,0xa091a056,0x39afd018,0x180db7f3,
		0x39c9d1d4,0x13cc9bd7,0xa540ccd2,0x01dd0595,0xd580cb86,0x67c337b0,0x107d9629,0xe0e3ff58,0x3f03af01,0xb6fc752d,
		0x4ee4f23f,0x3a35c441,0x724b3238,0x569730c6,0x5e531088,0x7cc25004,0x5dc9e001,0x84d38c3c,0xc139022d,0x2e7c10e5,
		0x298deca4,0xa70e70d9,0xae9406f6,0x96b9c41d,0xa70ef442,0xec088269,0x29e63d24,0x48d9a29f,0x1070fba4,0x503465a8,
		0xcbfa18c1,0x821453d0,0xc85630ec,0x9165b447,0x6ef0a41c,0x879a218f,0x5add5c20,0xfa982dbe,0xfb362b82,0x4c436d40,
		0xb2a10197,0xe3be1265,0xa9ed9e29,0x07044ad8,0x8b7c26bf,0xfedda4fc,0xd0fee17c,0x7c21361d,0x771d3ccf,0x39e0db9c,
		0x5f6180d7,0xa157e40f,0xdf539d50,0x69dfea08,0x5b469590,0x4e6a1638,0xd56689f4,0xf7353b01,0xaa40992e,0x477a5925,
		0x4b867efc,0x74932295,0x8db68a3e,0x4d237a04,0x8a25ecfd,0x755e6fb9,0x5ab40b4c,0xd1ece5c8,0x42659e1a,0xb8f77bba,
		0x13efa92f,0x838a107b,0x4f7b0efc,0xfdb67136,0x9fd9c53c,0x47a34677,0x62a921fa,0xc76dd98f,0xe8ed3cbc,0xe7624117,
		0x31a1e31a,0xffb918b2,0x550c112e,0x87f8cee6,0x7be84fb7,0xd7cf23e7,0xe6483308,0xb9c6e801,0xef1fab75,0x6ebb8cf7,
		0x61612bc6,0x64e6ceb6,0x43d851e9,0x56ba76fc,0x7d7311e9,0x9367ab72,0xfd985cf2,0x2f6a787e,0x242c6acc,0x09cd13e8,
		0xc7f643f5,0x34ef0752,0xbf8e91ac,0xe5ac2a19,0xdc08634e,0xe11e7651,0xffe9a5f0,0x16096020,0x335381c5,0xa9f3ecfb,
		0xa223778b,0x0503fe33,0x441d05cd,0xd00ee7d1,0x16105bfe,0xba365dab,0x0a28eee4,0x8c62ab9f,0x392b0114,0xdcb9a2bf,
		0x224c4765,0x54c7c108,0x4f77d09f,0x7feca57b,0x021ab370,0x03afdbbb,0xa9086479,0x9795be29,0xce206725,0x688d9322,
		0xe32a554e,0xe82db3c3,0xddba6a33,0x337949fc,0xfd51c2cf,0x8a7be5a2,0x8658418d,0x589b2de1,0xeb5995d4,0xd8b78288,
		0xeb0fdc1b,0x70dc6f25
	],
	SHRINES_STATUS:[
		// DungeonState.DungeonXXX (000-151)
		0x3eb899d5,0xaba78c20,0x71f66c0a,0x188708f8,0xdc567b20,0x8b0f3d4e,0xc589e54a,0x0a71a913,0xbd9c3f11,0x1603e634,
		0x0897a195,0x50b05884,0x47310fe8,0x5ba580f7,0xdcfddda0,0xb0a1f717,0x19a6c29d,0x2636f89f,0xf583efb8,0x310a78d5,
		0x2cc8206e,0xcd9c47d9,0xc0001b13,0xa90dfa37,0xc66641dc,0xa1d0b517,0xb3421b7c,0x9f98fdf6,0x0243b01f,0xf8e6d311,
		0xda4b2bbe,0x3b219b4b,0xd1c47602,0x00e03162,0x23717d79,0x158d9363,0x40111fde,0x80ab4ea1,0xe3f7931d,0xc64d0291,
		0x75b0ce50,0xb3d4db5c,0x9feb4c99,0x1f210d1c,0x3d7e72eb,0xe5461c22,0x9039c6ac,0x4b6d77ff,0x9ae206d3,0x6e1e89e4,
		0xe956c974,0xe4a03313,0x4f8c7d71,0x9a92991a,0x61f39b77,0x0ce573ff,0x5dc2a1cc,0x882a6a8a,0xc3e555ab,0x1fe4e7d7,
		0x03b85cae,0xeb662ff7,0x635a7fec,0x75a7866a,0x7adf647f,0xf41c214f,0x20f9ea11,0xa19ef491,0x0400707c,0xd01b6667,
		0x60ddaf28,0xf4798f96,0xd1851f63,0x1a60a05b,0x6b5651e2,0x9356b9cf,0x0bbf88b9,0xcc216ab8,0x00c44710,0x8def4fd2,
		0x4479d9b4,0x4ce116fc,0x5821879f,0x52ab2c2c,0x559e494f,0xcac370bc,0x4381d3e3,0x4e1d51cc,0x10d6706c,0xf85d93b1,
		0x764f2259,0xc2b95f42,0x46d3a5cf,0xe4e38bc0,0xb9bc74f4,0xf3e20435,0x62db5348,0xf38397b5,0xc2261966,0xa0126c26,
		0x830c71b5,0x0f9410ba,0xcd3d992a,0xe8882446,0xbe035f89,0x2131d53e,0x3603e898,0xc3322c01,0x7445c20c,0xabe8b158,
		0x4554c022,0xeeb938f5,0x4983cb33,0x98d0cad4,0xcc69e5e9,0x8a4f5f90,0x11c67990,0xe8d56c4f,0x2c54c4cd,0x7bd07e53,
		0xfdc7415b,0x9ff1d245,0xb4a0dafe,0xb9b82618,0x5ab62997,0x20b07ac7,0x01779d8d,0x66974794,0x0ee473d5,0xcf7c5633,
		0xd644e361,0x69217c8f,0x22786cb5,0xa727f3e7,0x2f152a5a,0x05641932,0x90a2bcd3,0xab6f6cac,0x0cee37a9,0xe8a5ab17,
		0xec2bccf3,0x8d1db823,0x7869ca50,0x28c279e4,0xeb216531,0xd1c8656a,0x740e2ded,0x7757a518,0x76780513,0x0b0a7e4e,
		0x7996beaa,0x4d1ef1f3
	],
	LIGHTROOTS_FOUND:[
		// IsVisitLocation.CheckPointXXX (000~147)
		0x7bce687d,0x8b69cec8,0xe7047303,0x597513c5,0x858d2ac0,0x5b5dfc20,0x8526bec2,0x8f91b33d,0x8233a664,0x67035946,
		0x88223fe5,0xb32c32c4,0xf3159456,0x17ecb8a2,0xe3e167d7,0x095e8a69,0x363464a8,0x599a3903,0x2b120f63,0x2a63694c,
		0xf5542404,0x1cb7eefa,0x2dfd5b6d,0x03832844,0x90634724,0x8329ff03,0xeee83601,0xbec33040,0x74b151b7,0xc15b2932,
		0x3e61c140,0xb4d06edb,0x6f5b6bad,0xb2f2865a,0xa2f31755,0xde268d00,0xd164048f,0xbbcb892e,0x36cbfed5,0x1a4d4c9b,
		0x052984ec,0x12ce4c4e,0x5b98f982,0xeaafe8c7,0x57b56abb,0x9dea19d8,0x9b06160b,0xbf9a10a2,0x949b655d,0x7332fddd,
		0x755f89d1,0x322f5f60,0x595521e7,0x4559b3ea,0x86e60d1c,0xf9850baf,0x6228c14c,0x1e879413,0xb13eda28,0x19754dd2,
		0xdb7d503d,0x2cd6c29b,0x6df0207f,0x51da3fdb,0x9ecde07d,0x453bb9a4,0x883dfe55,0x64ccbf17,0xa97795f2,0x58b1cb6c,
		0x258a7039,0xc3cc3a88,0x73b842c2,0x8f4d1cc3,0x04726d00,0x597963c3,0x63bdcf90,0x298b16a1,0x4c001ff4,0x6b49c8be,
		0xa812d7ab,0x122c88ec,0x0f6fca9e,0x699b3fd0,0x27d89912,0xd790a3f3,0x6728886d,0xbd38a8dc,0x5263d4af,0x296492f7,
		0xa5a1ca6f,0x3d777c0b,0x622a66b6,0xede17222,0x1909c91e,0x079c2dc3,0x961acc33,0x1de99fcb,0x10437217,0x62c0aef5,
		0xeebc2ef6,0x72844204,0x5d93b985,0x6df73ff1,0xfa0bbe02,0xfe77e85e,0x852ee934,0x6618c85d,0x9f9b6dc5,0x832bbf51,
		0xa8074bca,0xc301c569,0x721c18d9,0x571f855a,0xc103e463,0x587392b1,0x7f8fec03,0x8f6298c5,0xfbad4e18,0xb59ac43c
	],
	LIGHTROOTS_STATUS:[
		// ArrivalPointState.CheckPointXXX (000~147)
		0x7983cce0,0x33333cf3,0x6ce18207,0x7501c055,0x9c33c0ee,0x95d2e545,0x530db3b0,0x9bd202cc,0xab0e7ef8,0x723b6d8e,
		0xeccad937,0x4116fa3e,0xaed0da21,0x0a2fdbc3,0xb31f1425,0xbee71ef6,0x4ac984db,0x86e292a9,0xf8b91db5,0xdb81082f,
		0xd4c93cc9,0xc7cb0492,0xc61ba8df,0x0bb75174,0x6201c8ac,0xa9a431cb,0xbbc09a60,0x13bc2e90,0xba91b753,0xaf882235,
		0xc2cd7915,0x9d2db8a6,0x2ec46dd2,0x0a33d50c,0x2793d5bb,0x49392f92,0x84355f56,0xfb2f476e,0xbe46eba7,0xb8d409fd,
		0xee57ca34,0x232909ae,0xc390c14c,0xabaea27b,0xc6bc55d7,0x4075b322,0x24328c5c,0xa0085daf,0x77799f4a,0x33d16080,
		0xbbf762e5,0x94086d71,0xfb6e8e6c,0xdac90992,0x006e7a5a,0xf5d75e0a,0x61e2866e,0x7bae4c8e,0xadf9154f,0x31c50a5f,
		0x140d736b,0xbfdd8d3f,0xb14fc97b,0xc181f676,0xa63867fd,0xa001d192,0x3b45aa8d,0x41fa367a,0xaa8adcf2,0x5ecd7ea3,
		0xec233a4a,0xb9611cee,0x35efab4e,0x283ee0a6,0x6a7ac761,0x4cf98564,0xb89fb0cd,0xd954340d,0x23695bda,0x6f55e393,
		0x2ff4ebb3,0x0d5ea2fd,0x6702abaa,0x53507726,0x74950956,0x9c935dcb,0x0d4edad3,0x719e8143,0xf3a643b9,0x5044e2d8,
		0xed5acc20,0x98dd1df6,0x713eebd5,0x5fa57783,0x530886a7,0x157c9e81,0xd70f9780,0xcf10361e,0x83c3d803,0xde71e3e3,
		0x6aa3fa2c,0x62c43124,0xc6b1451f,0x6507c376,0x5a3d6726,0x2141d33d,0xd93514dc,0x8e2c31ea,0xa994a428,0x043414d5,
		0x8d9c0736,0x620231c3,0x32b32061,0xa0e5c6ec,0xa014ed46,0xb54c7930,0x9b9723ae,0x643e2a3f,0xfc5e195a,0x1dd1086a
	],
	/*LIGHTROOTS_DISPLAY_FOLIAGE:[
		// CheckPoint_IsDisplayFoliage.CheckPointXXX (000~147)
		0x0e7aeb1b,0x44f8c5ee,0xe9e39c0a,0x74acd11b,0x3cc2cd3f,0x89a21d18,0xc218ae9e,0x2926ed79,0x725bff6a,0x032b9123,
		0xda29f470,0x723f746f,0xfb01c1a7,0x641b9634,0x5b3fe625,0x0bd80c6c,0x2ec0d656,0xfc063553,0x8f4f97fa,0xb1b28103,
		0x5ec74ae8,0xd618386f,0x26b858fa,0xf422d6b7,0x9fc07ec7,0x24872bb3,0x6036408d,0xe49bfb8c,0xba171c26,0xf45335a8,
		0xb94fcf02,0xb03d548d,0x5b1cf0d3,0xf0d5728a,0x3dddbe98,0x37487d18,0x8793153f,0x3d668881,0x774b40ac,0x4aba4a05,
		0x788dd669,0x5ff0812b,0x58b2987a,0xca3bdd35,0x25bffb14,0x218857e9,0xe02ec552,0x9e2696bb,0xf5b2e7be,0xc94e54bb,
		0x6ab75159,0xec04023f,0x9565ace9,0xbf05cf73,0xf8f0ec24,0xfa0cf870,0x770cbe7c,0x2c1cd132,0xc098fb56,0x63219451,
		0x1605bd79,0xbdc58806,0xb446e1e1,0xacbbb523,0x8f9b8139,0xe17d3aa7,0xee4caeef,0x05eddd99,0x5f18a8d2,0xa0985c87,
		0xbc1bacd4,0xe3de91f5,0xf0e0d349,0xe3287ae0,0xf9fac1cb,0x7d90a83a,0xa548bf82,0xe3884a76,0xba062b89,0x6ffee3f9,
		0x17207ca5,0xd050d299,0x0c293091,0xb100339a,0x77671bcf,0x141dc69f,0xd9bd0e35,0x4c31d012,0x96fde534,0x34904a73,
		0x5a54149f,0x6cc92d32,0x7e611213,0x425f2379,0xc1068384,0xe378b5cb,0xe3edfa09,0x8f786300,0x09af145c,0x6424c778,
		0x99429cff,0x751c425c,0xed15393e,0x957cce85,0x23b2998b,0x9f378df1,0x170bca6e,0x1e83422a,0xb793e72a,0x6b8970a6,
		0xd7349109,0x910a4c6b,0x91422099,0x16b93d79,0xdb933d99,0x95b5e34c,0xe02932a4,0x661503c9,0x1ae8f540,0x87784090
	],*/



	KOROKS_HIDDEN:[
		// IsAppearKorok.
		0x865134f7,0x43a84d09,0x89830c69,0xfddd4242,0x2facd2d0,0x6873103b,0x0f4d0002,0xfb1c0822,0x43aedac0,0x68ad27ba,
		0x9243b590,0x673a6172,0x786f1961,0x76bbb480,0xb3d6c02d,0xc53706ef,0xd18258a4,0x5f38f557,0xa3a973fb,0xc4d4d7b8,
		0xe9b1c895,0x9ef83928,0xea27eab9,0xfd2d1303,0x99316c9d,0x928687ec,0x7b8dc6ca,0xb953b77c,0x5c5d22cf,0xe428ec4b,
		0x835b7e1c,0xafb76fe6,0x2d186ae9,0xc992f65a,0xd4e574af,0x4aab361e,0x684bdb5c,0x29d2e607,0x6c7aa137,0x361af384,
		0xcb71a63b,0x4a50d6c6,0x3a83e677,0xb4d2111f,0xd30ece2c,0x7e89c6c4,0x72b672ef,0xd43eaa43,0x6e83b011,0x8a69f9e7,
		0x03b3f52d,0xd1d920bd,0x2664e817,0x8dc6b079,0x9ec01992,0x5d5701fd,0x4393e95f,0xe8af22fb,0xa530d5a6,0x16b40482,
		0x4107fb43,0x66b78bca,0x5f8b2c8c,0x66fae1aa,0x07f6c973,0x5aca2d3f,0x985a07f9,0xd454c203,0x7fa6e25d,0x9814eedb,
		0x6665a057,0x482fcd1d,0xee391d28,0xe055d5ad,0x66ef92ab,0xc0623171,0x5ef13209,0xc38249fc,0x565282ed,0x4cf7c862,
		0xdeb9b841,0xbe759820,0xb16ed570,0x0b39d863,0xddfa346c,0x13476999,0x4869ed13,0x38111006,0x6f88b8ec,0x5caf6ae1,
		0x202f442e,0xa3d01f32,0x7860de3a,0x61f6493a,0xa26a20ed,0x281c1434,0x7667a2af,0x95bfab1d,0x9fd2a5b0,0xb6b5c1c2,
		0x58b405e7,0xeb9f88af,0x5afd2d6b,0x7aa69b76,0xf98d2468,0xaeebbf2b,0xebdbfb8f,0xf48ed32c,0xeb65c526,0xe64370ee,
		0x4f9e4bd5,0xd5490716,0x3519de68,0x8f7624a9,0x2ee56865,0x49826d11,0x6d8ac334,0x9127a52f,0x48f6a390,0xa95e2967,
		0xddd3dc54,0xc83433d5,0x94d7ed40,0x93ec745e,0xff4d3b63,0x7f3ba575,0x2f82f5b4,0xffc94fc9,0x6798cbbe,0x96573023,
		0xb8e02767,0x6014c97a,0x49b0a2b2,0x9ae4a2bc,0xd15486b2,0x096c2aa5,0x5f422674,0x31295d7e,0xf9c8425a,0xb5cc197c,
		0x98441d5f,0x91b8ad87,0xd2846a74,0xafa82118,0x73d241ea,0x9eb2b140,0x13588b22,0x32b358e2,0x4ff28b2a,0x35b46f76,
		0x448424f8,0x99da3209,0x0002a21a,0xb546dbc0,0xfe65eb3c,0xaa728fd7,0xe802667f,0x296abb68,0xf6160031,0xd42c6086,
		0xf189d5eb,0x92c9490c,0x5f78e273,0xa3b90f41,0x1b4767b6,0x5c630682,0x61acedbf,0x58ccb384,0xba6d8714,0xf4e49766,
		0x8a78b233,0x0e1c2580,0x1582746c,0x68741cf4,0x1dbb0290,0xe20a4a44,0x707e371a,0x9d66a11b,0x08996c9e,0x5ebf5d11,
		0x21e47dd2,0xf91afea2,0xccda573e,0xcb474084,0xc1864771,0x465aba38,0x821dac63,0x8defd074,0x83c2755a,0x8210f87a,
		0xcc577306,0x38fbccd8,0xd7374ad1,0xbb7a3971,0x51810eb1,0xe36ea7c1,0xdade1556,0xe58cf90f,0xf120d78a,0x56c4413c,
		0x9dbcfd33,0xab67c51b,0x5d82ede3,0xefa97212,0xf4b5b1d3,0x95ecfe71,0x94a30fae,0x70bcd777,0x7fb030fa,0x77d59230,
		0x55acf4aa,0x9f8ad829,0x9dcd3382,0xb33c6725,0xc9e2f53a,0xb73a941e,0x9d217cab,0x0b8bd765,0x7aed11b6,0x99aaad36,
		0x0918fc03,0xc2229aba,0x3dcfc5b1,0xc473ae8f,0x6f3642f9,0xfa20c4a7,0x35751ffe,0x8db05cf8,0xde431b1c,0xa7014096,
		0xce758546,0xabd5a31a,0x94bd0ad6,0x53cbacef,0x61fa40e4,0xfdadeb4e,0x533f4bdf,0x303ea124,0x44f21fe3,0x8e06c360,
		0x2b3bc094,0xb36baf13,0x45b0448f,0x75820145,0x4d85a3e8,0x08dd478d,0x8ff442a8,0xf9b12557,0x6b3ba922,0xd2501d7c,
		0xa5e8caed,0xc665a37e,0xd60fa8be,0xc908fb91,0x087fc0cc,0xc6e26acb,0x3d2acad4,0x11ad66f4,0x122afb1b,0xee083b14,
		0x60ce7bed,0xd4346012,0x71730a65,0x9c5a9800,0x1dd5af26,0xecbae61a,0x1b0f5626,0xd309507f,0xc1965457,0x13f25962,
		0xba22d572,0xf8ad2615,0xa4c0e214,0x2df04a2f,0x90d93436,0x247498e5,0x01102f1e,0xcbfbcc61,0xbdeef796,0x1674caab,
		0x22da58f3,0xd815bba0,0x9eb6c2cf,0x7dba397f,0xb109319f,0xf22def77,0xa384cf92,0x710d7dc4,0x7d27c106,0x0c70e302,
		0x7dfe0c26,0x4b0676be,0x6e7d4c07,0x114fe3b5,0xc9ca7cd2,0x57ce3d25,0xb3401df6,0x66cd0f7b,0xf1aaba45,0x470509f2,
		0xfd5ab59c,0xde37db6b,0xdc56e463,0xf1b58b4a,0xff21b531,0xd4e328e4,0x6ae80b72,0xeeef717d,0x813fde56,0x6c2bdadb,
		0xde14829f,0x5ce131a9,0x9b450a3c,0x3b84dc16,0x48b7181e,0xee3ec008,0x3ce5677b,0xa983eb47,0xb24b01ba,0x777dd1e4,
		0x770548cd,0xbed0bf80,0xf3962161,0x54c17924,0x9b06892b,0xdc1a209e,0x06c31519,0xdc4e0873,0xc185cb4a,0x143303a2,
		0xb5f9ec78,0x4799f37e,0xb1d98d5c,0x224a2254,0xb72fb0d0,0x41b14a44,0x24a0faf6,0x92d2ce81,0x37828748,0x6afd9445,
		0x3842d9e2,0xd3560308,0xd1c6c83c,0x273a57fc,0xea5c1079,0xe745c983,0x5f0391cb,0x8f6ea117,0x83de3a68,0x2d5738ff,
		0x2ce3a429,0xc6a2e864,0x5fe72299,0x0db017ac,0x864522fc,0x1c55cfaa,0xd53a5b76,0x871049b8,0xc19d0c58,0x399897ac,
		0x921ab9be,0xdd745cba,0xab8cebf1,0x67ed06d2,0x9fa5d670,0x821f7dbb,0x12ec4ddd,0xb6ed13c1,0x8d69b4ae,0xa7a7ccca,
		0x5e8a5a34,0x0610f317,0x0c9ad789,0xcc3c333a,0xc43ee7cc,0x9a0baabe,0xe194dbb4,0xe23f48bb,0x22252769,0xf56c3378,
		0xa26a1833,0x90bd0b64,0xfcd5522c,0x23a6aca1,0xa49d0e2f,0xffb8af38,0x49ffcac6,0x020922ee,0xf095c412,0x1e5826d2,
		0x7531f38b,0x348097f2,0x8dc171c9,0x23d8a3d4,0xdbbe9265,0xa83a30fb,0x0e0f6ce5,0x69517da0,0x3c40751f,0x401a677f,
		0xcf05200c,0xc91eb0bf,0xaf4b71e2,0x88fc8372,0x35da8f3e,0x5c09b4c1,0x23540456,0x302a12ff,0xd06eb149,0x71ccc6ab,
		0xed202ebb,0x5ad06b9c,0x97b4d81e,0x5e0d6507,0x9d020e86,0xed7d33a4,0xbdc9f62b,0xff32a312,0x88d9065b,0x97b15591,
		0x3fb6f6ea,0xa1199e76,0xe5793eae,0xd853ecf5,0xb72585ea,0x435a4f4f,0x422c0842,0x4ca24fba,0x001fed55,0x74b4491c,
		0x5f17d4df,0x73e911d0,0x2b65a8c6,0x799444dc,0xa43cafb1,0x6901d090,0x80aadabb,0x1d645134,0x54398438,0xc1781562,
		0x8d0eb23c,0xe29ec082,0x5989c7ba,0x1695f69d,0xae3f3df1,0xaf8751cf,0xb41a53d3,0xef6224c1,0xfdb15d00,0xeec59eb6,
		0x01c9e59b,0xf9e59ae8,0x9f5966cc,0x50276a77,0x721f53b3,0x50b066aa,0x3afe7b53,0xdb51ed81,0x5e1ff11d,0x98995ffb,
		0x5f6ac32d,0x352fd128,0x1b8c8a00,0xd7cdca8d,0x8d96a5d7,0x70916dde,0xc22698b1,0x15d4e182,0x6aac7202,0xf88d27e7,
		0xb2483fe4,0xde7ec45e,0x004e504f,0x10944b46,0xa1b1c8e7,0x6d915427,0xe5203d31,0xdcbba17c,0x3507f731,0x7529063f,
		0xedcef0a2,0xed4e491c,0x2deaad0b,0x60d529b8,0x3d4b6033,0x4d285674,0xbf515c41,0xe0a5bd71,0xbba19e4f,0xf369c400,
		0x5f08bf0b,0x712a709d,0x5d333eb4,0xeae8f08f,0x49de90a2,0x379a2dc3,0x9619f656,0x982cb437,0x14b0fd66,0x20be71cc,
		0xf66e2cbd,0xb246217e,0xb7b33ded,0x6774b494,0x1d9abf57,0x90f29af6,0xc584bc54,0xd1ad8f8f,0x5858d126,0x95595663,
		0x1357dfbf,0xb081828a,0x05f9461e,0x29c1f602,0x36a6d937,0xf7b50b77,0x9bd9ecae,0x3aaa3165,0x32780e48,0xe9e0ab81,
		0x1a3660b6,0x26f297cb,0x6f3cee24,0xae94706b,0x85e184e1,0x26fe73d2,0x3bafd364,0x09710330,0x47d71d7d,0x5e05faf4,
		0x30802cab,0xcd9b92ae,0xc0382714,0x5509c7ad,0x88943a0d,0xa6346974,0x46cf5503,0xdff3cb3b,0x52cb0ee6,0xd32e7550,
		0xd03ba3ab,0x551b27fd,0x7d53d67c,0x84f2f1c8,0xba41d8aa,0x781656a9,0xb2628953,0xeff42057,0x398fc894,0xe8e3af61,
		0x11a40a2f,0x8f4ec44f,0xae50d28b,0x1af1972b,0xa04046ce,0xf0da7b5e,0x90b9e7b5,0xe5926868,0x76391a3f,0xeac0df3c,
		0x8ae183af,0x7dae13f6,0x9adc36b9,0xa809268f,0xb10839ef,0xf6d06ede,0x4b5bab7f,0x40377018,0x4a270cc1,0x20342c53,
		0x9c191836,0xadb47437,0x724fb0b5,0xa8e67718,0x23096434,0xdb6080d3,0x1df874b5,0x5d462c29,0x93d69a76,0xddb5a823,
		0xb6bc7430,0xfe167dc0,0x2f3d0070,0x3b73040e,0xd61fb0a9,0x204842fb,0xe07018c6,0xdc15b8b9,0x060224ce,0xb3f00105,
		0xa81fb8f0,0x193f499b,0x4f212a29,0x708c9ec5,0xe7fa42e4,0xe5deb668,0x1eec39f3,0x4bae77eb,0x27660bfb,0x0f10ed2c,
		0xea3bc1b5,0xfc64c78d,0x87bb7b3f,0x0e0fcf9a,0xbf905d72,0x4b0eb28d,0x57476108,0xe8c264d6,0x73a3911a,0x46ac5420,
		0xdb60bb89,0xe1eaf716,0x9a7503dd,0x0d75a65e,0x4e58d512,0x5979aa93,0x2e5458f8,0xe658f2eb,0x21c73468,0x98b38107,
		0xcee5272a,0xe6b4735b,0xac758e35,0xc1469931,0xef7434bc,0x8ae2f96d,0x0e41100a,0x37fb97bc,0xd1ee076a,0xbb262ef4,
		0x3fbbf35b,0xbfdc6372,0x1aade81c,0xd0b01c67,0x60fe0284,0xa6c5a988,0x88b5632c,0x7bdcbffa,0x96f61ad4,0x119d3bc1,
		0x7c3e126c,0x298ecd93,0x195b806d,0x88898186,0x31b855fb,0x905ba3b3,0xdf4f9d85,0xc084ad2c,0x4fc2ae3d,0x21a7a21f,
		0x924cfafe,0x79b3480c,0x09cb1ef6,0xe5460850,0x2261eecd,0xbe857c26,0x2f52e7b7,0x030ff002,0x7587fcf4,0x77a13c3b,
		0x35474823,0x35e72922,0xa1b77233,0x40a23592,0x72be73ee,0x602b1a90,0xd2aa5165,0x230625fc,0x07de698b,0x93cf3f5f,
		0x66a17944,0x97363eb7,0x063fcea3,0x530356cc,0x8a3a22b1,0xce90d4bc,0x5dba834a,0xe2af9c72,0xaece9d99,0x3a3b9a81,
		0x39d592e1,0xa18c33bf,0x1b2e3573,0x29c5d794,0x682a4440,0xf9822345,0x6ada18a0,0xb6947d8a,0x0e84e692,0x2cfb591e,
		0xc96e818b,0x99dd3e7d,0xf2c33e29,0x95656f84,0xbbee2a48,0xe452fad4,0xd2b30709,0xdc3f2642,0x7419d23b,0xd7a58346,
		0xb34d13bc,0xe57a6bab,0xa72f3021,0x54a21540,0x9dc76772,0xae147124,0xde49334d,0x69e933d8,0xb47a1aa6,0xec7e0734,
		0xdee9d280,0x213eb124,0x6772ac66,0x21ad1c72,0xc967e2de,0xe96b0474,0x13890bab,0x9673fd93,0xd17f887e,0xb84d3457,
		0x98f0e9fc,0x6db2bb12,0xec9a9715,0xf1ab4865,0x79f9c410,0xf492701a,0xec56429c,0x660f7af0,0xdcae2b20,0xf43f3b6a,
		0x32d95ff0,0xff0e8c44,0x427fdb6a,0xf69a7c23,0x737e24f4,0x3fb260ef,0x7697a5a9,0xee65a99e,0x4dfe5a70,0x7b211666,
		0xb1f68e05,0x941d370f,0x8c39d7b2,0x926b2d98,0x63c8ab28,0x91aac0de,0x3ec9723c,0x8466a6a6,0xfa20f6e6,0xca55f0d6,
		0x64388431,0x2231cf8b,0x3aaad8c3,0xcf0c470f,0x354ce93d,0xf4adeb32,0x62b64035,0x2bb626ad,0x1cf1e638,0xcd42e323,
		0xf5c77544,0x52337376,0x062b8caa,0x2e01efd9,0x3f67ea52,0x4237b24d,0xa1879895,0x6990b0e8,0x938674c9,0xdcd538c7,
		0x0bd9f995,0x441af9ee,0xc6b2672d,0x6fbd94d8,0x27774128,0xcaeee6a5,0xdfc1ebe6,0xe8e56187,0xaa5f46f6,0x8da291b2,
		0x7a3e9e48,0xe4de67d8,0x423bb6cc,0xb4cf4681,0xc0b0f899,0x97d732c6,0xc28f7bcc,0x1784089e,0x7b5245a4,0x64bcee3f,
		0x4bd8883a,0x9bbf5c29,0x526a12a1,0x225fd744,0xd00fc6b7,0x8c062246,0xb5fe3455,0x1d3414af,0xaa6f1ed9,0xa478e5b4
	],
	KOROKS_CARRY:[
		//KorokCarryProgress.
		0x3cb982aa,0x5edc5dd8,0xfba408c6,0x36f4db74,0x1c896cb6,0x5546fb7c,0xd7892e5f,0xaee235b1,0x444a9935,0x93099b8d,
		0xc95e1b19,0x7433e3b6,0x2378f79e,0x603e2b23,0x806d03fa,0x0fc7d184,0x2f641302,0x5c15afd9,0xf7711bc5,0xc0647f18,
		0xd534b437,0x75111918,0xe5ef09a4,0x9b238d13,0xd3384f6f,0x35d7b73a,0x1f6f5594,0x77eefd81,0x24dd7307,0x8c50a6e6,
		0xc636740a,0xa46061b3,0x83c9a618,0x320e2f92,0xd1bac1a3,0x98a8ea6e,0xe81c25dc,0x8403cd39,0x1945f1ed,0x1bf36240,
		0x59b2d344,0x7484835e,0xf7587343,0xbd349337,0x79ee2b64,0xa1ca6bc5,0x2d36e2b3,0x795ce59e,0x79233e89,0x4f678b19,
		0xab9d58a9,0x4e840184,0x953b7301,0x6df2bb19,0xe98baf17,0x1bb2e064,0xb9b66c74,0x95456ad9,0x09163939,0xd665fa2d,
		0x83ad37d1,0x1a16b03b,0x26a3f326,0xeb2e5cdb,0x789e98ba,0x12471f7a,0x3813078c,0xdeea959f,0xf94361f0,0x77fd5fd2,
		0xc68205e3,0x5fa3b730,0x94b7d100,0x6dcb0444,0x09b38c59,0x8713591b,0x2668ebd0,0x34ff575e,0x98653d23,0x64400f10,
		0xf9763d6e,0x52ceed49,0x8a42ea55,0x5131eb97,0x8b3060c3,0xee82f9fa,0x21b5e04c,0x8486a7ed,0x7291c3e6,0xfa6a7e0e,
		0x6900bece,0xbeb9d2f1,0xc53b6047,0x14fa8ee9,0xce9d0eae,0x71f5d0fd,0xfc767553,0x5b313433,0xfc2ba0f2,0xa6c32a38
	],



	LOCATION_CAVES_VISITED:[
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
	LOCATION_WELLS_VISITED:[
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
		//0x1d484a39, //IsVisitLocation.Well_0043B //counts as Komo Shoreline Cave
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
	LOCATION_WELLS_VISITED2:[
		//seems to be needed in order for the icon to appear in map and also to count towards 100%
		//IsVisitLocationArea_CaveEntrance.
		0x45b30297, //13194262444821253016 - Well_0001
		0xed8c6c70, //17178703360531207997 - Well_0002
		0xb91f743d, //7062249617308613387 - Well_0003
		0xd81c08d6, //11933224307091230694 - Well_0004
		0x0ef1efca, //17490979021949379359 - Well_0005
		0xbad036bf, //3812226219033581199 - Well_0006
		0xcf474c86, //11200109829905050648 - Well_0007
		0xc50cdfb7, //9877532556918825502 - Well_0008
		0x73d3b6a1, //17331489093918561059 - Well_0009
		0x0a623984, //5433239543305108333 - Well_0010
		0xbe134c79, //18374843825268348839 - Well_0011
		0x321a53c1, //5573801400564842698 - Well_0012
		0x52fc93c7, //8464135276822714214 - Well_0013
		0x10d31a20, //8343852468912327656 - Well_0014
		0x50b7ff7c, //6244318697190485736 - Well_0015
		0xf2369d24, //14008184576550557030 - Well_0016
		0x7b698cff, //2682661287366618580 - Well_0017
		0x9d8c9e37, //18292467756691799253 - Well_0018
		0x8d94eccf, //15263783675053925142 - Well_0019
		0x8aec454c, //14294001447745603636 - Well_0020
		0x4362cf69, //483243831094194862 - Well_0021
		0x84260607, //16136047310243677537 - Well_0022
		0xaa692d8f, //14203679129553496960 - Well_0023
		0x097d69f4, //15539656917565867470 - Well_0024
		0xd65c76bd, //3409760176723313861 - Well_0025
		0xcaa22279, //7162466888885758692 - Well_0026
		0x6efd054e, //4504342832330418540 - Well_0027
		0x1a1d2dc4, //3624902666293548976 - Well_0028
		0x33c242cf, //8973258028144868802 - Well_0029
		0xfc42a6b8, //1154334463393842455 - Well_0030
		0xd97f0bf2, //11738989003295390645 - Well_0031
		0xaff27cb8, //2155917192954298383 - Well_0032
		0x8433b864, //5334751970332889797 - Well_0033
		0x9c102b50, //8216510434135260539 - Well_0034
		0x2dba628c, //5631944481270506220 - Well_0041
		0x307478a2, //1774279682527688702 - Well_0042
		0xaf2751bc, //6433184824016975873 - Well_0043
		0xf281fcdf, //5021182011261805087 - Well_0044
		0xf790f14c, //16477279299337157907 - Well_0045
		0x146228ba, //9000359301995578366 - Well_0046
		0xd0e99318, //16802610989801911938 - Well_0047
		0xdb05738a, //13473655612253629489 - Well_0047B
		0x324e7abe, //11679239074233164527 - Well_0048
		0xcc574d89, //12969905487474250827 - Well_0049
		0x51ca4ba7, //13777722591245673954 - Well_0049B
		0x91c7b29b, //17171302321035659098 - Well_0049C
		0xbe2e98c8, //9327423028890108170 - Well_0049D
		0xbdb49eca, //5906427813420395857 - Well_0049E
		0x96a89582, //10040443261155710972 - Well_0050
		0x91d5dbc4, //9559166076253669217 - Well_0051
		0x933ef2da, //1662241179931426393 - Well_0052
		0xde9778a1, //18270657436817135448 - Well_0053
		0xca3759a0, //5515697063015506333 - Well_0054
		0xd2e03aab, //3244074412902120610 - Well_0055
		0x9b585a39, //10430103283884318777 - Well_0056
		0x657ad3df, //7517110108375739855 - Well_0057
		0x295a5e07, //15893213395873888747 - Well_0058
		0x580b10e3 //9748532938243040102 - Well_0059
	],


	BUBBULS_DEFEATED:[
		//IsGetCaveMasterMedal.Cave_
		0x3a4892fd, //Akkala_0000
		0xb3ce2279, //Akkala_0003
		0x5c12f666, //Akkala_0005
		0xd9e04dd4, //Akkala_0007
		0x0c144ba9, //Akkala_0010
		0x4b352a68, //Akkala_0011
		0x9c3bc68e, //Akkala_0014
		0xe23763f3, //Akkala_0017
		0x9c154963, //CentralHyrule_0008
		0x36966a7b, //CentralHyrule_0009
		0x8aedd1dc, //CentralHyrule_0011
		0x05db09b4, //CentralHyrule_0013
		0x3a8438f6, //CentralHyrule_0017
		0x694d3922, //CentralHyrule_0018
		0x057aae24, //CentralHyrule_0019
		0x91b93260, //CentralHyrule_0020
		0xa9425920, //CentralHyrule_0021
		0xb377534f, //CentralHyrule_0022
		0xc51c271c, //CentralHyrule_0023
		0x9ec19a00, //CentralHyrule_0030
		0xee968d65, //Eldin_0020
		0xefe12df2, //Eldin_0021
		0x0b90d147, //Eldin_0022
		0xe168d362, //Eldin_0023
		0x97a8995f, //Eldin_0025
		0x6ec69925, //Eldin_0026
		0x921f2755, //Eldin_0027
		0x74ad5d43, //Eldin_0028
		0x109acbe3, //Eldin_0029
		0x9462567e, //Eldin_0030
		0x98a1676d, //Eldin_0031
		0x093281e3, //Eldin_0033
		0xe7bc5beb, //Eldin_0034
		0xfed5cd46, //Eldin_0035
		0x89e6d2e9, //Eldin_0037
		0xe65ffe1d, //Eldin_0038
		0xcf7e6457, //Eldin_0039
		0xcd316527, //Firone_0002
		0xaecb682e, //Firone_0008
		0x4349c90d, //Firone_0009
		0x785fd37d, //Firone_0016
		0x7419780f, //Firone_0020
		0x91a70897, //Firone_0022
		0xfd1576bf, //Firone_0023
		0xeb336b37, //Firone_0024
		0x9a70291f, //Firone_0029
		0x75796c16, //FirstPlateau_0001
		0x47d4dc0f, //FirstPlateau_0002
		0x7f61cdfd, //GerudoDesert_0007
		0x6510f426, //GerudoDesert_0008
		0x4ca1fdd2, //GerudoDesert_0015
		0x3c499ceb, //GerudoDesert_0022
		0x58028ec0, //GerudoDesert_0030
		0xffe03687, //GerudoDesert_0031
		0x7be30826, //GerudoDesert_0032
		0x20a60062, //GerudoDesert_0035
		0x3d235262, //GerudoDesert_0036
		0x06750ea3, //GerudoDesert_0037
		0x542a183e, //GerudoDesert_0039
		0x173aaee7, //GerudoDesert_0040
		0x6728247e, //GerudoDesert_0041
		0x29e4a302, //GerudoDesert_0043
		0xa8c973a3, //GerudoDesert_0044
		0xb8f1f3c1, //GerudoDesert_0045
		0x393e032c, //GerudoDesert_0046
		0x3d59ac0e, //GerudoDesert_0049
		0x12cdc1f2, //GerudoDesert_0050
		0xa7a7d61d, //GerudoDesert_0051
		0xe7b3e8fd, //GerudoHighlands_0002
		0x4d4df44a, //GerudoHighlands_0008
		0x48b72033, //GerudoHighlands_0014
		0xe6e7de47, //GerudoHighlands_0017
		0x28ea1102, //HateruEast_0000
		0xb1c7be06, //HateruEast_0002
		0x1abd365f, //HateruEast_0006
		0x46d1603b, //HateruEast_0007
		0x5d305283, //HateruEast_0008
		0xa913a912, //HateruEast_0009
		0x5ff05676, //HateruEast_0013
		0xd1a3108a, //HateruEast_0014
		0x6d406e0f, //HateruEast_0016
		0x65f30245, //HateruWest_0002
		0x9155a62e, //HateruWest_0005
		0x86cda846, //HateruWest_0006
		0xc52025ad, //HateruWest_0008
		0x2affeb89, //HateruWest_0011
		0xd40717b8, //HateruWest_0012
		0x9c02adf9, //Hebra_0000
		0xee23a63d, //Hebra_0013
		0xaea53961, //Hebra_0015
		0x3bffd5b7, //Hebra_0016
		0x4087bd4e, //Hebra_0019
		0xde0f7c34, //Hebra_0021
		0x72fbb2c6, //Hebra_0022
		0xa6ede8f8, //Hebra_0023
		0xb3dba045, //Hebra_0025
		0xf764bed9, //Hebra_0026
		0x91522a83, //Hebra_0030
		0x4e3ab0d4, //Hebra_0035
		0xed1deb3b, //Hebra_0036
		0xaf73d942, //Hebra_0037
		0xd884bf98, //Hebra_0039
		0x9a9260d0, //Hebra_0040
		0xec56a695, //Hebra_0041
		0x8ae4b8fb, //HyruleForest_0001
		0x02829324, //HyruleForest_0006
		0x95dd6439, //HyruleForest_0007
		0x965bb738, //HyruleForest_0008
		0x0c4fa74c, //HyruleRidge_0000
		0x52b7f157, //HyruleRidge_0002
		0x67acbeb9, //HyruleRidge_0003
		0xca24f955, //HyruleRidge_0004
		0xe6e5f556, //HyruleRidge_0005
		0xc7aa5ca0, //HyruleRidge_0006
		0x1f24ce09, //HyruleRidge_0007
		0x20ea3880, //HyruleRidge_0008
		0xdcd9a527, //Lanayru_0006
		0xcd578915, //Lanayru_0008
		0x46bbf652, //Lanayru_0014
		0x09bf0c1d, //Lanayru_0019
		0x0d21fe8f, //Lanayru_0024
		0x52ba8073, //Lanayru_0032
		0x070b77a4, //Lanayru_0033
		0x09007d0e, //Lanayru_0035
		0xbf93c5f7, //Lanayru_0036
		0xfbe18fd6, //Lanayru_0048
		0x0aadbad2, //Lanayru_0049
		0x6ade83b3, //Lanayru_0050
		0x61cabc09, //Lanayru_0052
		0xe6a0230a, //Lanayru_0053
		0x8d797c20, //Lanayru_0055
		0xe349a05c, //Lanayru_0057
		0xa05c2ee9, //Lanayru_0060
		0x6df6538a, //Lanayru_0061
		0x52e5cfba, //Lanayru_0063
		0xae1f8688, //LanayruMountain_0002
		0xe9fd11b0, //LanayruMountain_0006
		0xd99ae420, //LanayruMountain_0008
		0x5a87eef9, //LanayruMountain_0010
		0x6ea55e80, //LanayruMountain_0014
		0xaf6d0f65, //LanayruMountain_0016
		0xbf5b8586, //LanayruMountain_0022
		0x18602fad, //LanayruMountain_0024
		0xc2e43cc6, //LanayruMountain_0025
		0x57acfa65, //LanayruMountain_0026
		0x801e08e3, //Tabantha_0001
		0x891f9219, //Tabantha_0002
		0xf8017f51 //Tabantha_0003
	],

	DEPTHS_GHOSTS_HOLDING_WEAPONS:[
		//MinusFieldGhostRandomSeed.
		0x3aea33b1, //10017256136729147220
		0x37121d69, //10038605108307690347
		0xb80ff3f2, //10108928729121549874
		0xe93d56f0, //10148163039323826523
		0xee1701a0, //1015408167533456156
		0x5cf16947, //10172584386616758135
		0x2da90fab, //10234870084294500169
		0x94c3f7fb, //10247909168705794995
		0x3cc60295, //10259159253350408277
		0x8c658c7b, //1028818156993051283
		0xa8a9f5e8, //10326293983786353421
		0xed23e2b6, //10337313691683231120
		0x2b0ef11e, //10371562793768650604
		0xdcb68cec, //10373034744995764963
		0x5065c9ad, //10488455345662602511
		0x0d4abe4c, //10524268790543487398
		0x8f632978, //10548145597878410488
		0xab85c738, //10582094883315309693
		0x1c3ef78f, //10626084117006922981
		0x7868ba13, //10635286699054132683
		0x72ee5025, //10642258167030345791
		0x88a05c7b, //10659395460097691705
		0x0d6a54a9, //10665548772936367335
		0x0233065b, //10687577306085496011
		0x5ba61931, //10696354879747314062
		0x79d9f53f, //10696634900634949777
		0xaab604e1, //10718955799641758645
		0x42a4027d, //10790878469886290308
		0x123771fd, //10819244817632614200
		0x11dc347c, //10820968927558292252
		0x7973cb66, //10847183574871958974
		0x2e311871, //10863076768214636497
		0x4404ff9a, //10881321229365358300
		0x9145ea9e, //10888032323798619517
		0x418306c5, //10888811579097901353
		0xb0b35fee, //10926058719961057836
		0xd4e6ea3c, //10939431017236365025
		0x81c7d9e0, //10993282139510142821
		0x730f6786, //11042628689615600781
		0x0082a5d1, //11120028700713217102
		0x60227c8d, //11125300577412009646
		0x97d249fd, //11176577411100172206
		0xe2f4db0b, //11189866916078148170
		0x1efc0a6f, //11198808778879143119
		0x291e9388, //11217192728258169347
		0x64fb43e9, //11230569842998692957
		0x5c30ed65, //11272430497580449230
		0x724e2ce0, //1127897383881046034
		0x90aac754, //11307387939263399843
		0x0a04af23, //11341586708032546369
		0x159dedce, //11421639374443380874
		0x2656044e, //11445958603179300726
		0xf37611ea, //11459660235575172099
		0xbd396531, //11480784566755090701
		0xe3d90df8, //11534671277168642483
		0x2058117b, //11582552434673682572
		0x3685344a, //11624925688279578770
		0x276a57d4, //11628509034048160832
		0xab5e1f4d, //11674995214980051380
		0x266753b6, //11691306453420267320
		0x5dcf249f, //11757802415906043723
		0xcf27b249, //11758637002208460860
		0x07a510f3, //11768429064558683558
		0xfa6f5249, //11776723680303695419
		0xa8e8cefb, //11784110049738142714
		0x0a6c170a, //11788671973371901183
		0xfa95d6d4, //11791216374729228931
		0xe85147c8, //11806099310789688212
		0x29d068a1, //11819739226880322358
		0x6ef6e288, //1182442752434509652
		0x80c42fcc, //11872927675990764084
		0x06abfe1e, //11930319718064309974
		0x2da51738, //1194114608066210078
		0x47b033be, //11943079698597289332
		0x0a42e8a4, //11952699809488219197
		0x04a0f26e, //11965165054496341716
		0x6bda1464, //11996645644873455373
		0x44457635, //12007941992066891962
		0x812aa486, //12025372538579107315
		0x39de9493, //12032638687294368110
		0x90221156, //12034158290967312167
		0x06001794, //12061564712409781342
		0x36a69f9d, //12072193905268595251
		0x5e0d1779, //12096631282525822221
		0xd0a40681, //12098975762986036411
		0x63363e17, //1211457463871715056
		0x62172557, //12137660946937955259
		0xe19b60ba, //12201583751569193492
		0x6fc7622b, //12211861505551136510
		0xb55472bd, //12236808969420606132
		0xa8740a5b, //12247176037965888469
		0xe9898ad5, //12266528152944061713
		0xc37bf200, //12273743600253259759
		0x1c991652, //1230237588930077971
		0xa0c08bee, //12305946037238385169
		0x52dd8e08, //12330268326787618439
		0x7a34f411, //12332430238214111255
		0xde8dbba4, //12335909606352519401
		0x2f285d51, //12342335444395728198
		0xbd8cd52d, //12389725667990023602
		0xb2a5cc5f, //12426065447846724694
		0x2d8cdf92, //12431719081949508002
		0x1a7f2eca, //12457885844134650062
		0x38aa24b7, //12476148049600075056
		0xe7770604, //12479020020390198238
		0x38d57f14, //124878585428242829
		0x609fcec4, //1252161368263597787
		0x9afd8db8, //12539625929334539370
		0x7e336176, //12621033405698902640
		0x5fb7b25d, //12723836076961948774
		0x8e46b0f6, //1274644443523679916
		0x3c3a456f, //12753127173285830803
		0x8a0d35fe, //1275370715424656243
		0x1c040fdc, //12777369512329311227
		0xc5f9cf9b, //12792499491735309765
		0xba5fa0f9, //12794689575982484578
		0xe06f8afc, //12842184847948222059
		0x22441a59, //12874157974894955796
		0x38f001eb, //12890027711129357739
		0x14a7b808, //12950521601430736387
		0xa3f1bc45, //1296411025781905125
		0x6be133e6, //13012960665498884544
		0x355eff16, //1311004617494556028
		0x9254c909, //13121876345112155460
		0x00099636, //13199138968805849553
		0x9235cda3, //13267570116010325002
		0x1979c01d, //13357301479165269130
		0xf259e388, //13454882143004237840
		0xb3d39dc0, //13455004245823089508
		0xa286be5f, //13488923531929700667
		0x8f861a62, //13491366165874871666
		0xea8875f1, //13537772842157885062
		0x37bc2c0f, //13540657639684497635
		0x70539632, //13562221046968303857
		0x7a777984, //13568229152059868211
		0x9419ff56, //13582319204822985722
		0x5d0efd1c, //1358764618146159523
		0x3f303687, //13596371020478454491
		0xfbe4919c, //1360912499771232258
		0xc5ba679c, //13612894318783506779
		0x8e415040, //13721477348183015595
		0x21ff30d1, //13738684264403147691
		0x3b7eece4, //137456037904809103
		0x7dc46bc3, //13758536218137416411
		0x39e575cc, //13767484004172015065
		0x9760b152, //1377287149636764511
		0x55fc1269, //13775565250574064469
		0xd9a25576, //13792390612784509932
		0xdc005497, //13835389684128177745
		0xe6930155, //13848483329210587042
		0x7299e972, //13856439296330293293
		0xd3764c73, //13888514469137879803
		0x3b2833b6, //13927847889669314518
		0x88ee2a89, //13989779553750329057
		0xfd5aabbe, //13999998617305149719
		0x63887a57, //14000433386579023705
		0xef95ab0b, //14007260800163482667
		0x4c18db00, //1404209208677421820
		0x25f21cd5, //14097899621528629014
		0x26d6b964, //1411284882969817907
		0x04e3198b, //14118979997018647864
		0x26057007, //14126249014202856395
		0x8af73e1e, //14152896103960269229
		0x7fcf320c, //14167151377831509893
		0x2c94bea3, //14229434053497205352
		0x981bb25b, //14247569557749512167
		0xe2d3c500, //14250253786853585509
		0xeca2be78, //14253199102634201107
		0x045192fa, //14259882502369428063
		0xa1afde1c, //1426732144315214417
		0xcf7c7b18, //14276585653662015634
		0xcf9048c1, //14277754767942782998
		0xd4a90db2, //14288326474748785185
		0xe1153091, //14296443595127653926
		0x4fde58e1, //14307134795204882998
		0x441b4917, //14324664347253503019
		0x5b524e49, //14355590403535464166
		0xc1397883, //14363926901092740326
		0x04635eba, //14373705655952249782
		0xaf0bf5b5, //1440248769139327361
		0x8b259120, //14408829886252901860
		0xcd84fc53, //14430922447935639892
		0x30940f1f, //14462482842893244764
		0x09675b4e, //14471569277260008641
		0x764e6b14, //14485784558329981437
		0x3320f162, //14539001568398593903
		0x96b08adb, //14560566238885641566
		0xa9a147d1, //14598061474265150130
		0x71c730e0, //14629970742293972862
		0x36075839, //14640888328278300248
		0xb016b82e, //14650098578445551446
		0x7969c911, //14699400833257817327
		0x03567ffc, //14699984471349776410
		0x7e2b0354, //14732534059450088436
		0xb5c9ae66, //147459102077565737
		0xd318e275, //14791238518066490603
		0x1bdf50ba, //14841191250731956689
		0x28b7ab62, //1484432656998143465
		0x6aeb77fa, //15004395236480659143
		0x27eb3584, //15032979988809842826
		0x550dd1ca, //15042696533530341155
		0xd7235376, //15072120897006924712
		0x8c45ec5c, //15083617166523681777
		0x000a3a34, //15087370921631583707
		0x1a10053d, //15130041444016311098
		0x0495d437, //15140036132893070782
		0xb3aa45b1, //15162900688518457478
		0xed6a6d2a, //15186843230523349027
		0x6c706369, //15194394914591346166
		0xad3d3aa0, //15217384730984687267
		0x470be4d2, //15217673862672470829
		0x2bb23289, //15238983750545927594
		0x5d780d03, //15273107708207893652
		0xe779116b, //15309681911530664927
		0xfb971e11, //15347512591290482567
		0x4e3377f8, //15354220881325377795
		0x2df278f7, //15396110373687339186
		0x06f5848c, //15428118620599539943
		0xab182590, //15430659698519969491
		0x5c78db0a, //1543341709898621670
		0x93f55f84, //15450538569203496572
		0xc60cd8dd, //15486194936683234118
		0x3067aac2, //15504314459170095610
		0x8b8d9c29, //15521736250149071337
		0x87460c50, //15576757567476494358
		0x778ac55a, //1557899021746164430
		0xbf99c8f0, //15700133868313371258
		0x7c7ee810, //1570525393861302505
		0x3da01e13, //15715151200355298677
		0x7dbcfefb, //15732288183925421504
		0x4bcf1a08, //15744183467779258804
		0x9436189e, //15812399559483263052
		0xaa285bf6, //15816201220871241124
		0xa1342cef, //1582379907936480459
		0x4d9959ce, //15829823237619540428
		0x2e50d7a0, //1585386066510733685
		0x0ef59066, //15854488925960475678
		0xbf794365, //15958815449901751301
		0x7b09e66e, //15963173824567161308
		0x0c21cd08, //15974707618135237142
		0xf1ff55d1, //15980863488904010448
		0xf7eed3ab, //1599198868960354152
		0x354aa09d, //16024731322981728015
		0x393e0c0d, //16067627625916349192
		0x87380693, //16086078860947816075
		0x26c11853, //16087262598830790156
		0x75a5c803, //16088540257354480319
		0x4bde422b, //16126559151903402472
		0x7378538f, //16165657884444885008
		0x78422122, //1617369809566718785
		0x42173b04, //16211215759030010648
		0x09f34555, //16224429163637023437
		0x3b0a4355, //1624187440213626441
		0x0a92489f, //16259440271796593186
		0x9b57679d, //16287616278273104574
		0xbb582416, //16299881439257893531
		0x34f5a1dd, //16366648905518809368
		0xd689ad18, //16373270564797586417
		0x98a6f970, //16381253313978849522
		0x85c6e936, //16427752679279367002
		0x723db2ee, //16446245318689278772
		0xdc4e0b5c, //16480674657010617230
		0xd4b200ad, //1648515784073790540
		0x86fadb63, //16518607703884587238
		0x5104397e, //16525494991917671743
		0x01aeb2ed, //16531625606439314262
		0x39109750, //16533207045859453585
		0xb6267f06, //16536506099823051573
		0xdfd7ce61, //16572480348336424542
		0xaa1f0585, //16576114892079247801
		0x73ef52f5, //1657763995555758115
		0x5cafcece, //16579320159467255172
		0xdae10b4b, //1658631708925071179
		0x8bfbc84c, //16596044495603380263
		0x3e57fb03, //16652345066046283409
		0x198b19e4, //16703214922718693417
		0x673fb0fa, //16769464352991333601
		0x0bbc5c49, //16775617950457627421
		0x19727e8d, //16780425991023887965
		0x20410b79, //16798403873557810205
		0xc56ca216, //16811767750964794011
		0x974e819d, //16832084492949197769
		0x62c7ee11, //16832607125845751049
		0x62adb452, //1688664827344910347
		0x03330e92, //16903605359610748695
		0x2448bfac, //16906017988485500070
		0x4eba25cc, //16933413230458676445
		0x80aeff05, //16941736456456335860
		0x2c094899, //16958167406740950160
		0x04e0f0f9, //1697238737499913787
		0x52f0c03b, //16990945183446892212
		0xaaf8abc3, //17015261976770930590
		0xd25397b0, //17031800156624437390
		0x06032090, //17058761956863507097
		0xeef5a1b6, //17065605565021020507
		0xd4a2e078, //17097714338102372375
		0x32d34f36, //17130599697201425242
		0xa381bb82, //17151019825590022238
		0x4f655557, //17172635255619215368
		0x25e7f4d5, //17184491807892450772
		0x6810a9df, //17200723464922047836
		0x97d13b04, //1736242714486422708
		0xf0e37fe0, //17363836263196107187
		0x8206ed6e, //17370490638658084278
		0x13454995, //17391040926907236671
		0x779dd392, //17398852172640678195
		0x3167767d, //17406573752595605065
		0x9962603e, //17429300406322199993
		0x48524e61, //17437267693753876981
		0x78e4d49c, //17447690377076750235
		0xae49689c, //17450205375610969228
		0x65492753, //17473348277992075872
		0x7a5044a7, //1749318607186152743
		0xa20d7a09, //17498053365273807820
		0x95e901c6, //17530266308166686001
		0x2c94d1e4, //1759269013187365446
		0x78f81eae, //1760009940087311302
		0x13ba4f27, //1761491770872884738
		0x2c47639b, //17635921265456612363
		0x35ea79a2, //17636250027932317076
		0x92d9cb10, //17640376957600512711
		0xe6ac7bfe, //17719851713343772336
		0x4372af82, //17731805658371924768
		0x9a7ea123, //17748028269316218060
		0xbc387fdc, //17764608086779182328
		0xf0305196, //17789949121207310013
		0x241d60ae, //17812737647539709805
		0xc9dc2f98, //17837573289452425319
		0x8c8b611c, //17839575778888067937
		0x2861cfa1, //17847126202314638794
		0xe02145be, //17850515172862399332
		0xb134be6d, //17944156760358724439
		0x7707028a, //17963014884989981393
		0x429f444b, //17979164983978521951
		0x2ac36489, //18005402697544271727
		0x366a6373, //18019887466695436813
		0x68f003dd, //18088403427311203943
		0xbe7eb0d2, //1809280478829812108
		0x855ecc08, //18093294495654479210
		0x649a7364, //18113105989495751816
		0x8d90ae28, //18118792074322499012
		0x000cd06c, //18175228750270474468
		0x2b9ade0d, //18179687462845617930
		0x95709686, //18211331014196527822
		0x9ead961f, //18220040748164158243
		0xe0c14df7, //18284112462889559130
		0x3b4a75a6, //18287122191315373925
		0x0cae23ae, //18342102476091061600
		0x843165e7, //18343920258721022566
		0xcb9d8e37, //18373769141841440011
		0xd86957ea, //18375946095112532461
		0xf09d3942, //18394538091821957410
		0xe681fd24, //18416214188234669066
		0xef678ceb, //1844991735782051779
		0xb179c924, //1857907807901311174
		0x00c5481e, //1997953351491187725
		0x1deef256, //2011904594159704891
		0x3f665829, //2070264755303353120
		0x147ddcd4, //2123167471974443663
		0xa8ef87f3, //2163689806601103267
		0x129eb5d9, //2215749689021667177
		0x3ccfc84f, //2272648885679986065
		0xf73f83bb, //2354117469629324548
		0x6d8b9c11, //2357035542808048842
		0xb4b22f2c, //2374963250985373552
		0x7db0b46f, //2397829545733199101
		0x9203dfdd, //2464884518681479126
		0x6bc9b42d, //2481065473635264106
		0xe9538df0, //2489610960664745973
		0x8dfe95ba, //2492473111179992207
		0x62653cd5, //2508331093947087037
		0x8473bacd, //2533637192213292258
		0xf9348d12, //2534724394735837394
		0x1a11ae55, //2552653283634153582
		0x4ce29075, //256297148703129900
		0x78acf047, //2563686075204046057
		0x3b80ecf8, //2568100918137912773
		0x0fb1e070, //2619484608633042162
		0x9afcfb9e, //2641280587882097840
		0xd50bc1b5, //2672248434240279476
		0x1e54b30d, //2736535122026684026
		0x57ff8019, //2768254371332434088
		0x450abad7, //2795053510490261180
		0x179f9f5e, //2833706949875053188
		0x8fd56cb3, //2847601527716501346
		0x149f2948, //2860622407201135085
		0x521ac3a4, //2864736688494963356
		0xfe6b6cb0, //2919222990495481862
		0x7383b3aa, //2937751729419608703
		0x8324c098, //2945710666828081877
		0x692bfb86, //2946729286477961225
		0x141b4ec8, //2954953938636818886
		0x249fa1cf, //2957135699512350372
		0x7dc9bcbc, //2969734335829956802
		0xabf62253, //2974425774951480731
		0xbe97679b, //2980089017304011444
		0x17b0f517, //3062701384298249208
		0x34ecbf84, //3071230980570292066
		0x2520af77, //3073782436664844892
		0x5d3faa84, //3100219089899608910
		0xda9a7798, //3114382691973062085
		0x04e6027a, //3127035690985489382
		0x58edfb1c, //3146872659287494169
		0xb676607a, //3164863577510227625
		0xeede2df8, //3237333889690302667
		0xc1e00f64, //3263113888408385562
		0xee137f5d, //331242694679602894
		0xec9525ae, //3319604891909779112
		0x7dcd1867, //3363700703618754409
		0xc65217c9, //3387583798362915082
		0x732fe6a2, //3391622489092604245
		0x6eed47c4, //3414147559741059227
		0xb1498939, //3447191117813166611
		0x30679165, //3455634347173221960
		0xbb05e5fb, //3483306074484514344
		0x4c8c0142, //3535532508301359688
		0xa02c0606, //353673438889108676
		0x58040c83, //3594607106106731329
		0x5910390b, //374347078528520364
		0x4e57cff9, //3748382091370218167
		0xe3b5f6f3, //3831090867970867606
		0xafe64032, //3887869747043888832
		0x38ff35f3, //3900469986838393581
		0x37f24e41, //3904769209330134023
		0x7c17d85d, //3922258502583328068
		0x8c712f8f, //395468049134936462
		0xa12d806c, //3981086829355131715
		0x49f1ecd1, //3987905543232885004
		0x429c3f96, //4006063415412338059
		0xcfa6417f, //4089789258885846067
		0x2f83065d, //4090733368157881589
		0x729d5326, //4096601582988057134
		0x22ea6a1e, //4115875860892728016
		0xad8cb09a, //4166315904417516766
		0x34b988af, //4178848021661416203
		0x1b2ca7c5, //4188201114247709536
		0x8e6c8850, //4189717956056817318
		0xd27f717d, //4203392599452845128
		0x36fdd1e2, //4208698678095493396
		0xbde91683, //4211918415944442796
		0x2c4f7f83, //4258881835285380362
		0x49eb44b8, //4299585949662468499
		0x9237773f, //4318095884451521853
		0x6ad6421e, //4321969082434394242
		0x599b8532, //4390481529895925264
		0x2e28e54c, //4410864614390281908
		0x4d8009e4, //4414861408847985384
		0x8f1bbcaa, //4442185519123722408
		0x6b1c16ae, //4500192296415874834
		0xe19ad47a, //4570427971042434251
		0x7ad38f0e, //4573250968270804472
		0x4f697011, //4650424242020435977
		0x34ebdd45, //4677601166932722334
		0x6290e23c, //4715358050553799110
		0x96e122f6, //4732338543699866233
		0x20cf735a, //4777369396096422262
		0xc554926e, //4779145389042142937
		0x4740c1f0, //4801318499624540705
		0xdbf7e672, //482740033835484428
		0x1f665fad, //4834049905307515742
		0x0525b650, //4841759091785309111
		0x85dd48d4, //4849927658002481031
		0x77ee42e7, //4859819075484863219
		0xc5d5b8e6, //4860561639608331352
		0xe2eb4bea, //4868257796968766023
		0xfc4678b9, //4873084491414235881
		0x0e1bd7ff, //4927700405659208173
		0x195a91ad, //5000085915148545621
		0xc772396e, //5016111616599027668
		0x27836967, //5042458897452905994
		0xdf30efab, //5054421830864446035
		0x00cffd75, //5151799494715572494
		0x6d2d4243, //5164356944589582584
		0xd3e61365, //5165355305183851629
		0x86a37eab, //5180360558456232906
		0xdd50cd83, //5195438860944684310
		0xb71cb6ce, //5201942908067458276
		0x56e40aaf, //522372166379427210
		0x859701ca, //5274856901606980809
		0xcffbee40, //5294825307474294268
		0xa3e587c9, //5332834041453482462
		0x7688fc58, //5339073346876660002
		0x048421ba, //5345225449717796093
		0xbafe74ad, //5357128209317699093
		0x815f47cb, //5379210913192461975
		0x5f50341d, //5423758430553124585
		0x0dfd2d58, //5457471013161208545
		0x8476adbb, //5466864189380386781
		0x254368b0, //5469109231751620481
		0x1717f4b4, //5475459138576295626
		0x2c732bda, //5552465821592218386
		0x9c091654, //561426695648908652
		0xd1cae118, //5617800802702369495
		0x3c97b686, //5652209959087918545
		0x6756b5f4, //5667727021322365524
		0x7375ac92, //5682336000135343350
		0x84ecfc69, //5715633743278189106
		0x6157c84b, //5753843918004296284
		0xadc75224, //5810239413408174921
		0xf056a37c, //5813979732850081212
		0x0b469c30, //5852037368835687757
		0x0bdaec95, //5858336516016929887
		0x9c166a9b, //5875901741726217348
		0xb18c82bb, //5891947363597107707
		0x2ed75a14, //6021093981433499922
		0x37e38383, //6043850506895333683
		0x098c6458, //6083393752839826014
		0x5e8023a0, //6108984423952988836
		0xedaf28ed, //6148495616545067084
		0x2c78e899, //6169538415574947680
		0x113bfe06, //6183986514307020651
		0xe30455ef, //6201320510617983807
		0x342d7a14, //6213254379043240600
		0x5b785906, //625001695463072583
		0x971e4abb, //6275515220135450402
		0x2708920a, //6276386904696073488
		0x85b65cbc, //6298704862218940672
		0x405ef5b6, //6387513836809183924
		0xd9152297, //640407412851619165
		0x3782b8f7, //644260527725010576
		0x1f2e85dd, //6444063509944061318
		0x246c3b17, //647245483074553806
		0x02608837, //6490971030873689850
		0x55b7085c, //6527432569564463043
		0xd1d58c4d, //6558037497652635088
		0xef6da56a, //656746443450451717
		0xf181bcc6, //6580338553162967632
		0xa236491c, //6593676035535371052
		0xf429703f, //6599991932081302077
		0xc12238eb, //6622680195408951122
		0xa3cd2b5e, //6705691147440356652
		0x4a2a6e29, //6750883075635405887
		0xa85fd376, //6767503317103007727
		0x0f2986d2, //677792298034058086
		0xbb70da57, //6780966326648412734
		0xacf70f6e, //6829861443769367418
		0xcd3029b0, //6841570536050674864
		0xea347ed0, //6861234613345795990
		0x35229e89, //6864100947476501285
		0x182e3b57, //6944097811305878118
		0x9520d9ee, //6945878647340144911
		0x6af1fc5c, //6958061756946534978
		0xe9afc5e9, //6967800787026225353
		0x67bd4f2a, //7033964401187682082
		0xc8a28bb3, //7057513314326125592
		0xf425c3d4, //7143119242232712708
		0xd48bd7bf, //7172029296212016789
		0x695e5695, //7181513685167466403
		0xffe64fd2, //7187438543191984468
		0x85e6ff71, //724131585439814273
		0x525e7e13, //7254147893211014903
		0x96b7d88a, //7265067275060399867
		0x18b69172, //7286557613191848197
		0x7e239f6d, //731520186163729453
		0x80df50a2, //7327955411324704703
		0x85a56e12, //7328506700335659578
		0x06e82557, //7331181549058089572
		0x207cb48f, //7361833405964338128
		0xac35ed51, //7407608590750567591
		0xec016d31, //7415854146339150577
		0x74338ede, //7421414509452971831
		0x193bdf7e, //7422230087423765053
		0x486fd9b9, //7444777987279902052
		0x22472334, //7445709812183511118
		0xc50935ca, //7447561708558501414
		0x8c5f125d, //7451738260268112056
		0xeacd70d1, //7471387447697939957
		0x69152e68, //7489317375614888660
		0x663834bc, //753142387992253367
		0x04b96f50, //7552010938176533934
		0xe738f5c4, //756583848544043414
		0xb98dd8fc, //7610637127040763488
		0x9e4405b4, //7647029247797897440
		0xb9803f7d, //7664905845978936498
		0x115366c3, //7717572093916427631
		0x58fcab5c, //772474518218893174
		0xeca98944, //7767032519979113824
		0x50859c27, //784475193526978859
		0x6022e202, //7847534932486017440
		0xff308b6a, //7859255235072509756
		0x72661ed3, //7912820482219323230
		0xbf509be3, //7927756186504898397
		0x82c6ffc7, //7932524306431366567
		0x7a1952ef, //7977299148527116183
		0x331993e9, //8036022716703898859
		0x220e5150, //8068284464011414637
		0x94039b4e, //8091619766319518806
		0x7760231d, //8117758286224241428
		0x770abc65, //8118522378085415995
		0xc4e3fafe, //8140198643642684128
		0xdc6b1070, //8149206447927338913
		0x2a241138, //8150797666012950448
		0xebba89b5, //8168286812223111822
		0x6244b1ab, //8186077043878151351
		0xe396c21e, //8189183915476556754
		0x5581b239, //8221233559392136959
		0x59b07f02, //8225087005034681666
		0x1507c911, //8252108926889408843
		0xd2cbe915, //8279428532775101411
		0x1ad2e3e5, //8289988423106999880
		0xa134efd2, //8305766418302710548
		0x783c8838, //8306920245247438050
		0xf294339e, //8307197319887431138
		0x08802f30, //832435276484306798
		0x779b4f35, //8330296769077842204
		0xab37cc46, //8371865758630638416
		0x0ff1b04a, //8385646165394298170
		0x37909370, //8426543691065381826
		0x5679cde5, //8456762340055745815
		0xba9ea1dd, //8463322794583696249
		0x90b1b69e, //849832149650280060
		0x46bff276, //8517225359104841282
		0xf55979bf, //8539757147325294424
		0x924d945c, //8558268597892899823
		0xb8d93ce4, //8565928299113134856
		0x69335f64, //8570355974029347309
		0x2e6e2ec0, //8574493581351976981
		0x92c86cc7, //8578808046774220164
		0x469dd3b9, //8585303269238554794
		0xe34fd540, //8590105707067141391
		0xe5aadf47, //8631400246869000917
		0xd1a5856b, //8648035184727965719
		0xc89419f2, //868428579836441035
		0xab7bd5db, //8686472687039362665
		0xaa2998f1, //8792705956708763696
		0x8b841077, //8794217292063053056
		0x49cb8db4, //8829974551912631272
		0x90b01ed8, //8846644446485464395
		0x36d71775, //8868858149938861922
		0x6225a2b1, //8927482048893626645
		0x2a613bfd, //8929940075552050408
		0xb678ffc4, //8934896283409878145
		0x8bc24500, //8999939783009594821
		0x4490b5b7, //9000894900216936450
		0x36ba410d, //9020299017494335376
		0x0b7bea88, //9036699093109144131
		0xb4055bb0, //9079416195063983979
		0x10bc4e4c, //9089118642552946178
		0x2199676f, //9096812378619430679
		0xd7b14382, //9127792923282630634
		0xe06047b4, //9137301655888049477
		0xfe96b6f0, //9165955036879574741
		0x3bc361e3, //9169500414517335075
		0xa91363a7, //9187341036155915185
		0x9a4a748f, //9193603011626109375
		0xe7373cc3, //9202475202601228932
		0x1644bb42, //9202934979734919790
		0x2a027273, //9218383120363261712
		0xc931e865, //927254490659363479
		0xf986e936, //928949774885747309
		0xe245cab2, //9298439293738094055
		0x56669750, //931551165766812831
		0xee792882, //931671582809128534
		0xef8334af, //9337776398328902274
		0x54336857, //9378038815031200792
		0xa65b282d, //9393690983021833343
		0x1edf7e04, //9395394630334473129
		0xb1ce48b3, //9402749130109731160
		0x3fc2069f, //9403780886235054564
		0xb8afa49c, //9430146290897395186
		0x743ebe8d, //9475195377823750498
		0x014b001b, //9491939217776666171
		0xea96db10, //9512429195415444804
		0x84a41bba, //9584513224145484657
		0x9328c470, //9591571667134750867
		0x3614ed85, //9602398137440690542
		0xbab3ecfd, //9602502002396191864
		0x80f54d8f, //9605014903038342773
		0x12738644, //9625702214758644518
		0xb28d8705, //9626447825018176707
		0x72efec21, //9650703218896448429
		0xeb63cedb, //9672255477473896334
		0xf2113294, //9699696387807111789
		0x62728ace, //9744232626003965852
		0x80bc3a1c, //9819742854703354309
		0xcb058401, //9864732156436848252
		0x66b4e81b, //9936846976041627972
		0x914be5af, //9948821709715757516
		0x702b01c8 //9981719693658787153
	],

	SCHEMATICS_STONE_FOUND:[
		//0xb5480ae1,0xf1a507d7, //isFavorite/isNew
		0x97e22bf9, //Fanplane (Schema stone)
		//0x6302b8aa,0x546b533c,
		0xa07798a6, //Rocket Platform (Schema stone)
		//0x1cf4716c,0x53362c01,
		0xaaacf14d, //Hovercraft (Schema stone)
		//0x8a6e4694,0x3d163460,
		0x345e7150, //Bolt Boat (Schema stone)
		//0xf2256caa,0x2ae0f886,
		0x5109695f, //Bridge (Schema stone)
		//0x924bfca6,0x94e32644,
		0x542b78f1, //Dirigible (Schema stone)
		//0x556e8d23,0xe464e10c,
		0x9f4ba799, //Instant Cannon (Schema stone)
		//0xbc0135a2,0x02423fe1,
		0x2abb2df0, //Instant Scaffold (Schema stone)
		//0x99005f15,0x91f259ea,
		0x0cbea150, //Launch Pad (Schema stone)
		//0x12847cf1,0xd169bf9e,
		0xb625e1fc, //Automated Ally (Schema stone)
		//0xe6f76475,0x10ba494b,
		0x127a75c9, //Hot-Air Balloon (Schema stone)
		//0x2f938a40,0x008da3ff,
		0x8fe4140a //Beam Cycle (Schema stone)
	],
	SCHEMATICS_YIGA_FOUND:[
		//0x5024b1fb,0xed077b03, //isFavorite/isNew
		0x0520dea7, //Tank
		//0x998094e0,0x7ad1f011,
		0xeee1492c, //Flamethower Balloon
		//0xd426b028,0x825295da,
		0x4ce68be6, //Three Wheeler
		//0x68054688,0xbcce4cb0,
		0x8ebfc267, //Fanboat
		//0xe9477c78,0x217d1cf6,
		0x6c8fca57, //Headlight Raft
		//0xf057847f,0x20b529a1,
		0x14fd96aa, //Beam Turret
		//0x4d3063d7,0xcb9a491b,
		0x3385b6c6, //Vertical Escape
		//0x0c99c31b,0x596bfd65,
		0x8476f277, //Cargo Carrier
		//0xbe15581e,0x3abe8a33,
		0xa7ce2e78, //Big Rig
		//0xb8bc2487,0x4306aff7,
		0xd7ac3fc8, //Water Freezer
		//0xaf5eb5d5,0xdc50e532,
		0x0cddddbf, //Liftoff Glider
		//0xdcef38a7,0x18e76632,
		0xb3752c42, //Shock Trap
		//0x01206662,0x3ca7cd44,
		0xa8707e8a, //Fishing Trawler
		//0xe4b9c7a7,0x41e03a46,
		0x5fadc4e3, //Wagon
		//0x3b4db9ae,0x49fd911a,
		0x260ad4d3, //Instant Kitchen
		//0xc1ca1a74,0x16dc3d32,
		0xa7bccf88, //Super Spring
		//0xbcdbfddb,0x7e336293,
		0xaf8870c6, //Sprinkler System
		//0xcc48723f,0x0e126f18,
		0xabc30ab3, //Icebreaker
		//0x358a3fbf,0x74545504,
		0x047dd1a3, //Aerial Cannon
		//0x4b6c2155,0x9b40811a,
		0x6206da4f, //Floodlights
		//0xa1c7a545,0x21c240bb,
		0x11f75220, //Instant Scaffold (Yiga schematic)
		//0x021e8d87,0x2b70c123,
		0xd3f712cc, //Monocycle
		//0xd10f8764,0x0b91c831,
		0xfba73b41, //Raiding Plane
		//0x9f6e72f9,0x9a98c516,
		0x97c52512, //Bomb Bouquet
		//0x703b6513,0x69e31bea,
		0xee3db7d1, //Triple Cannon
		//0x809df141,0x0243bfe9,
		0x41b07b33, //Scatter Trap
		//0xaab0f0c1,0xf2d47a4f,
		0x45f95172, //Smoke Rocket
		//0xba20825f,0xa33489ed,
		0xbe350fdb, //Charged Charger
		//0xe91f1583,0xbe367566,
		0x499afa5b, //Rainmaker
		//0x2b3c1844,0x36abdcc0,
		0x732c5985, //Whirling Basher
		//0xd3119d9b,0x97e77394,
		0x3f9f61fd, //All-Purpose Raft
		//0x175eeee0,0xb0ad2b0f,
		0x7708c653, //Excavator
		//0xdadf7f9a,0x5e9f5609,
		0x29bcade1, //Assault Cart
		//0xc71fe378,0x00d72a7d,
		0x7f86e965 //Beam Spinner
	],



	BOSSES_HINOXES_DEFEATED:[
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
	BOSSES_TALUSES_DEFEATED:[
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
	BOSSES_MOLDUGAS_DEFEATED:[
		//IsDefeatBossEnemy.
		0x64eb3a85, //15680669918719030586 - Enemy_Sandworm
		0x4c446633, //16109259853398140926 - Enemy_Sandworm
		0x362e8f22, //720594899592278164 - Enemy_Sandworm
		0xa884f7b5 //720594901953648144 - Enemy_Sandworm
	],
	BOSSES_FLUX_CONSTRUCT_DEFEATED:[
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
	BOSSES_FROXS_DEFEATED:[
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
	BOSSES_GLEEOKS_DEFEATED:[
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
	BOSSES_REMATCH_DEFEATED:[
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



	COMPENDIUM_STATUS:[
		//PictureBookData.XXX.State
		0xbbf256d3,0x9ff57115,0x20a5ace9,0x35fc77fb,0xc5b45cc3,0x67386b44,0x1f2816d2,0x493a7ea3,0x68b56527,0x6cb0007b,
		0x8ffb9003,0x02679e6b,0x6e07db97,0xc07f48ea,0x6da0cf5e,0xfc25d4cd,0xa4d56e2a,0x2ad49566,0xe1f15720,0x3e602b46,
		0xec235bfa,0x84d32b47,0x01490087,0x3c2fb3ee,0x3642c73c,0xf920e70e,0x15a33b87,0x75464337,0xcd8c3c57,0x55382e37,
		0x1858e8dd,0x6757a6de,0x44f1f621,0x3828b66d,0x22651add,0x75d00262,0xabf2a04b,0x6f86c8b9,0xd472a12f,0x19599dd4,
		0xde35c394,0xf0236290,0xc8bb96c7,0xc3a304ce,0xa1d8dcb4,0x0d58f543,0xa7df9c3b,0xfc0f6a2b,0x63c5ae50,0x2b00690e,
		0x253b60a7,0x2e9545fe,0x9b647c91,0x9a51e52f,0x21fc60d6,0xfc74cc86,0xbffa39cb,0xbcc8c897,0xd2ea1926,0xfbe1a117,
		0x3ce769f7,0xeaf99d94,0xc77de65d,0x75136d15,0x8c8ad39d,0x6f9cc89f,0x88ce0934,0xe924b49a,0x5b8c4548,0x555ae72f,
		0x72d8d162,0x5db54071,0xccfec897,0x8055ec45,0x963d2101,0xea75017d,0xac883102,0x8f2873a2,0x57c928a5,0x9e3167de,
		0x1f00344d,0xb957a2fe,0x82b59987,0xeb6de132,0x2365eeeb,0xe47c543f,0x1175e981,0x173ba2f0,0x49898008,0xb413e809,
		0xb112aeb9,0xf45d1d19,0xff3031d8,0xbe16c7e0,0x0c245c74,0x5808e0be,0x8d99b51e,0x56073084,0xc4321da7,0xe6cc7624,
		0xd6f66f72,0xfe0bb89a,0xfd23c479,0xf394c10d,0x37016c65,0x906bb450,0x5552aa25,0xa92d4e29,0x8d3f4383,0x2dfe9bf4,
		0x4dd087a4,0x850c4b5c,0x239b0555,0x0102f72d,0xbafb3b52,0x0d667900,0xa4fb851a,0x5a8da868,0x4b0fab2d,0xdaeb7c3e,
		0x6fdcee17,0xd0a74c91,0x9a33bfc9,0xf7859470,0x37096b43,0x5196eb4e,0xdc0b441f,0x573a526d,0x0cdcd04b,0x0c02c64a,
		0x59b5e1c6,0x55c27208,0x23d94985,0x55d6125a,0xea2991c4,0x2e029532,0xe397589e,0x31faa0e4,0x8e25a0ce,0xe1056c6d,
		0x51f683ed,0xa99a62b6,0xabaff9ad,0x9293a6a6,0x197415c3,0x05bdd321,0x6d904649,0x3c8a71a0,0xf45ab07f,0x83bb7e9c,
		0x60ac8c69,0x579481a0,0xd5dac147,0x34d6584c,0xb2c2ac62,0xd29597f5,0x01e19529,0xdaf10794,0xa5d1a436,0x8a9062d0,
		0x6ac879b4,0xea7b209b,0x32b6585d,0x278ed7f7,0x316fc0e7,0xc885774b,0x10ed97c2,0x244a3293,0xd9a58129,0x2b73f5d2,
		0xa61ae2af,0xc5657979,0x2680889b,0x67a37207,0xee20304b,0x0e90e7ba,0x3b3aecad,0x82c9e4fe,0xe531ba22,0x9e717af0,
		0x50922e11,0x3a87563a,0xb3bda8db,0x696a05be,0xf16260cf,0xb237fe07,0x36876763,0x63d8ed36,0x2e74e2bb,0xcde7bb16,
		0x16f34cd4,0xb8db0aa5,0x2a6fb429,0xe095cc2a,0x24a8c17f,0x82fde6eb,0x15d4e07d,0xa7d72e93,0xdc016f78,0x43fba1d0,
		0x9fbcadec,0xd31bfdeb,0xb8ce35ac,0xbd7f8fac,0x679f5e3b,0x8f6104e2,0x289b770d,0xf58ed663,0x91f94b7b,0xd23cc404,
		0x0b94350d,0x3b58d40e,0xab3e9ffc,0xb52b1fbb,0x423a6d9d,0x7a97e08d,0x58d389e0,0x093e348e,0xfce0c986,0xd550e487,
		0x780fd0f5,0xbf011907,0x4b7c6001,0x1b37c2c9,0x1f87aa41,0x99d05bb4,0xe0fc57d2,0x03e9fdf4,0x484e35ed,0xb3309765,
		0x87db27a0,0x4cd238f2,0x257e13b2,0x87834862,0x8787c477,0xacbd7a7d,0x0fa65a4c,0x1155491d,0x770242b1,0x4601b30e,
		0x37e10a3f,0x528381a0,0x6fba0162,0x2f9df402,0x4e79ebaf,0x92d53fd6,0xfe657a94,0x79906655,0x5f7b067f,0x4027851d,
		0x90d3efe9,0x198e9c1d,0xd18a0a62,0xccb23b90,0x04a01831,0xc9d75295,0xb0e8d8bf,0x46cc8cb3,0xdc7bce05,0x32dd2638,
		0xb433e385,0x1d5668a0,0x8b87d599,0x872d7f1f,0x0bd40497,0xd878474c,0x74f5c7e8,0xe6eadc89,0x36d0ede2,0x3f8496e7,
		0x1b3a9be5,0x28d46680,0x657c16ae,0x1c603046,0x7434267c,0x818f5bfb,0x20ad257b,0x8f7dc71a,0x51fb9b55,0x1f325b54,
		0x708a0b74,0x5f85be00,0x8506f030,0x5bc81607,0x7b264eb5,0xe7d31dce,0x4a87f5ef,0xd877fd9d,0x5fec19b9,0x6a47ac80,
		0x5f0b9728,0xfa478599,0x45e8f779,0x64506bab,0xf9e6054e,0x7ffab325,0x4e773b46,0x9dee7aa8,0xd4cecf02,0xb330315a,
		0x4adaf59a,0x1151f05b,0x1e38132d,0xbd9709ab,0x27f5ff56,0xfddd2a59,0xc5060686,0x9ecd61a8,0x8d89329a,0x0f0ae12c,
		0x0b28103c,0xefc08e37,0x978c4e34,0xe895260d,0xec284207,0x71451f4d,0x4a8c7c25,0x8b033c0d,0x700bc62f,0x9039e0c8,
		0xac85e805,0x5a83b363,0x4819dccd,0x1c66f16f,0x799ac1ac,0x88106c97,0x2a3b35a1,0x415fa2e9,0x5cd1ba6a,0xb4a2920a,
		0xf57187e7,0x2ca13ad0,0x05012601,0x5f902760,0x5ef0e7f5,0xdf03d54a,0x98a3b62f,0xfdd8dc3a,0xe16ab457,0x0112568a,
		0x030469d8,0xe545e2a4,0x5b756769,0x5547650c,0xda3f9276,0x185e360a,0xeb19768e,0x73a5aa4a,0x6dea7e15,0x95dcd251,
		0x7e734f5d,0x1b4cb647,0xd02e8f8a,0xb0371d15,0xf073249b,0xf0d6b92f,0x5b80fd10,0x84f66e79,0xb229b841,0xbc92c563,
		0x02842f06,0x6d476246,0xe4ac2257,0xa35edab0,0xdd8752b5,0x56289d29,0x783175a4,0x42d033bb,0x8ac112d2,0x6cab9f5b,
		0xad360b3b,0x1efd490b,0x3d094bbb,0x75d301bf,0x9c64daf3,0x2d9701ae,0x39db9816,0x890ad720,0xdd641497,0x6e98878a,
		0xd3555b68,0x31cfe8fb,0xb85d6edf,0xf140f20e,0x809bbfb9,0x5c82563a,0x25a271c3,0xb46bb968,0xc8e985bb,0x0db36bbf,
		0x7cf50779,0xff665863,0x4182a6d6,0x6f864868,0xb1bc25db,0x6dfa7ecb,0xdc7d4767,0x3e87f458,0x1e37a076,0xea4ee734,
		0x196829d9,0xc5866cff,0x95fb09f5,0x39a60d3b,0x69b44761,0x0aaf5498,0x9af2af6d,0x5133aa6c,0x6aea3c23,0x33e250f7,
		0xf4aab6f4,0xae2a7ded,0x1414aed0,0x6a7de12a,0xd35d2bb2,0xb38ffafb,0x792a5ec0,0x2a037682,0xee1db1bc,0xdfeb2e80,
		0xb78feb8b,0x85f862ea,0x695af4f6,0x126ca7f2,0x13207bcc,0x8bb9d774,0xb6b881ba,0x0118107e,0xcb4b52e2,0xd9ad3906,
		0x9ceb5a30,0xe21c9abf,0x35a4be45,0x51c3c55d,0xee187589,0x1e9668ed,0xbb39460d,0x61906d1c,0x526e9423,0x2d889b61,
		0x65d9cffb,0x9de31ad4,0x00d63d4b,0x6dc9d131,0xdacaa4e9,0xbca58bda,0xd52cff76,0xec1e60d5,0xcdee3052,0x25089680,
		0x05f65fb4,0x625835d7,0x75f32973,0x299c0203,0xb54aec01,0x157db793,0xdd8860ba,0xf99bcd4f,0x29a9cfbb,0xa7f74017,
		0x985f02c5,0xf0e20bcd,0xdfe95eb0,0xacaf6ca5,0xd63f0a6a,0x1696e9d9,0x70dc2dba,0x3389df22,0x97625c5b,0x1755d43b,
		0x453aeeb1,0xd530c3dc,0xa29e03ee,0xa8edcfb2,0x835d8b66,0x5ee05f4c,0xfad43bc1,0x394b1b7a,0xb528ed2b,0x0e243b82,
		0x34816bfb,0x73325594,0xf7bd2d2b,0x0a2f2fa1,0xecfa5766,0x8c52dacd,0xb9627088,0xe5cc93b7,0x2668e51f,0x8a8c8570,
		0xb23944dd,0xf43a072a,0xfbbd3492,0x5b09bacb,0x27a3778d,0x617ebcb4,0x3390f921,0x67bb6a7c,0xe7204752,0xa5383c88,
		0x3c4b7b8d,0x827ea767,0xa8a2e7b8,0x6dd46b75,0xdf76d934,0x5c906c16,0x9820338e,0x50446d5d,0xd471103a
	]
}
