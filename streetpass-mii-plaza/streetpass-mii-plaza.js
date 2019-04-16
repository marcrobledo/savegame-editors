/*
	Streetpass Mii Plaza for HTML5 Save Editor v20170706
	by Marc Robledo 2016-2017
*/

SavegameEditor={
	Name:'Streetpass Mii Plaza',
	Filename:'meet.dat',

	/* Constants */
	Constants:{
		ALL_SPEECH_BUBBLES:[0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff],
		ALL_SPEECH_BUBBLES2:[0xf8],
		ALL_HATS2:[0xef,0xfb,0xff,0xff,0xff,0xff,0xff,0xff],
		ALL_HATS3:[0xff,0xff,0xff,0x7f,0x00,0xfe,0x3f,0xfc,0x01],

		HATS_GAMES:[
			//Battleground Z?
			//Mii Force?
			//Flower Town?
			//Warrior's Way?
			//Market Crashers?
			//Ninja Launcher?

			[0x05b348, 0xc0],
			[0x05b348, 0x30],	
			[0x05b348, 0x0c],	
			[0x05b348, 0x03],	
			[0x05b34a, 0xc0],	//Monster Manor
			[0x05b34b, 0x03],	//Ultimate Angler
			[0x05b34c, 0x06],	//Slot Car Rivals
			[0x05b34c, 0x18],	
			[0x05b34c, 0x60],	//Feed Mii
			[0x05b34c, 0x80, 0x05b34d,0x01], //Mii Trek	
			[0x05b34d, 0x06]
		],

		NO_PIECES_15:[0x00,0x00],
		NO_PIECES_SPOTPASS_15:[0x00,0x00],
		NO_PIECES_SPOTPASS_24:[0x00,0x00,0x00],
		NO_PIECES_SPOTPASS_40:[0x00,0x00,0x00,0x00,0x00],
		MOST_PIECES_15:[0xff,0x3f],
		MOST_PIECES_SPOTPASS_15:[0xff,0xfc],
		MOST_PIECES_SPOTPASS_24:[0xff,0xff,0xfe],
		MOST_PIECES_SPOTPASS_40:[0xff,0xff,0xff,0xff,0xfe],
		ALL_PIECES_15:[0xff,0x7f],
		ALL_PIECES_SPOTPASS_15:[0xff,0xfe],
		ALL_PIECES_SPOTPASS_24:[0xff,0xff,0xff],
		ALL_PIECES_SPOTPASS_40:[0xff,0xff,0xff,0xff,0xff],


		PANELS:[
			{Size:15,Name:'Metroid: Other M'},
			{Size:15,Name:'Mario and Bowser'},
			{Size:15,Name:'Super Mario Galaxy 2'},
			{Size:15,Name:'The Legend of Zelda'},
			{Size:15,Name:'Kirby\'s Dream Land'},
			{Size:15,Name:'Pikmin'},
			{Size:15,Name:'New Super Mario Bros. Wii'},
			{Size:24,Name:'The Legend of Zelda: Ocarina of Time 3D'},
			{Size:24,Name:'Star Fox 64 3D'},
			{Size:40,Name:'Super Mario 3D Land'},
			{Size:40,Name:'Mario Kart 7'},
			{Size:24,Name:'Rhythm Heaven Fever'},
			{Size:24,Name:'Donkey Kong Country Returns'},
			{Size:24,Name:'Pilotwings Resort'},
			{Size:40,Name:'Kid Icarus: Uprising'},
			{Size:40,Name:'Fire Emblem Awakening'},
			{Size:40,Name:'Mario Tennis Open'},
			{Size:40,Name:'Kirby\'s 20th Anniversary'},
			{Size:24,Name:'Brain Age: Concentration Training'},
			{Size:15,Name:'All Nippon Airways*'},
			{Size:15,Name:'Mac de DS Big Mac*'},
			{Size:40,Name:'New Super Mario Bros. 2'},
			{Size:40,Name:'Kirby\'s Return to Dream Land'},
			{Size:40,Name:'Animal Crossing: New Leaf'},
			{Size:40,Name:'Luigi\'s Mansion: Dark Moon'},
			{Size:40,Name:'Dillon\'s Rolling Western: The Last Ranger'},
			{Size:40,Name:'Nintendo Starlets'},
			{Size:40,Name:'Xenoblade Chronicles'},
			{Size:40,Name:'New SUPER MARIO BROS. U + New SUPER LUIGI U'},
			{Size:40,Name:'The Legend of Zelda: Skyward Sword'},
			{Size:40,Name:'Mario & Luigi: Dream Team'},
			{Size:40,Name:'Chibi-Robo! Photo Finder'},
			{Size:24,Name:'Darumeshi Sports Store*'},
			{Size:40,Name:'Pokémon X and Pokémon Y'},
			{Size:40,Name:'MONSTER HUNTER'},
			{Size:40,Name:'Kirby: Triple Deluxe'},
			{Size:40,Name:'SUPER MARIO 3D WORLD'},
			{Size:40,Name:'YOSHI\'S New ISLAND'},
			{Size:24,Name:'Rusty\'s Real Deal Baseball'},
			{Size:24,Name:'Dalgu ne seupocheu yagu pyeon*'},
			{Size:15,Name:'Nintendo Pocket Football Club'},
			{Size:40,Name:'Mega Man'},
			{Size:24,Name:'Kirby Fighters Deluxe/DeDeDe\'s Drum Dash Deluxe'},
			{Size:40,Name:'Daigasso! Band Brothers P*'},
			{Size:40,Name:'FANTASY LIFE'},
			{Size:15,Name:'PIKMIN Short Movies 3D: The Night Juicer'},
			{Size:15,Name:'PIKMIN Short Movies 3D: Treasure in a Bottle'},
			{Size:15,Name:'PIKMIN Short Movies 3D: Occupational Hazards'},
			{Size:40,Name:'Sonic Boom'},
			{Size:40,Name:'Captain Toad: Treasure Tracker'},
			{Size:40,Name:'ULTIMATE NES REMIX'},
			{Size:40,Name:'Super Smash Bros. for 3DS / Wii U'},
			{Size:40,Name:'MONSTER HUNTER'},
			{Size:24,Name:'Tomodachi Life Friendship Fiesta'},
			{Size:15,Name:'Picross 3D Round 2'},
			{Size:24,Name:'Mario & Happy*'},
			{Size:40,Name:'YO-KAI WATCH'},
			{Size:15,Name:'Mario & Luigi: Paper Jam'},
			{Size:40,Name:'Animal Crossing: Happy Home Designer'},
			{Size:40,Name:'FINAL FANTASY EXPLORERS'},
			{Size:15,Name:'Kirby: Planet Robobot'},
			{Size:15,Name:'Culdcept Revolt'},
			{Size:15,Name:'METROID PRIME  FEDERATION FORCE'}
		]
	},
	Offsets:{
		STREETPASS_TAGS:		0x043e70,
		PANELS:					0x044bdc,
		PANEL_SIZE:				0x02,
		SPOTPASS_PANELS:		0x045578,
		SPOTPASS_PANEL_SIZE:	0x44,
		ACCOMPLISHMENTS:		0x04555a,
		SHOP_UNLOCKED:			0x05b358,
		TICKETS:				0x05b366,
		FANTASTIC_RATINGS:		0x05b4d6,
		SPEECH_BUBBLES:			0x05bfe9,
		SPEECH_BUBBLES2:		0x05cec6,
		HATS2:					0x05b314,
		HATS3:					0x05b344
	},

	/* private functions */
	_getPanelOffset:function(){
		var panelOffset,panelSize,panelId;
		if(get('select-panel').selectedIndex<=6){
			panelOffset=SavegameEditor.Offsets.PANELS;
			panelSize=SavegameEditor.Offsets.PANEL_SIZE;
			panelId=getValue('panel');
		}else{
			panelOffset=SavegameEditor.Offsets.SPOTPASS_PANELS;
			panelSize=SavegameEditor.Offsets.SPOTPASS_PANEL_SIZE;
			panelId=getValue('panel')-7;
		}
		
		return panelOffset+parseInt(panelId)*panelSize;
	},
	_countCurrentPanelPieces:function(){
		var panelSize=SavegameEditor.Constants.PANELS[getValue('panel')].Size;
		var offset=SavegameEditor._getPanelOffset();


		var usedBytes;
		if(panelSize==15){
			usedBytes=SavegameEditor.Constants.ALL_PIECES_SPOTPASS_15.length
		}else if(panelSize==24){
			usedBytes=SavegameEditor.Constants.ALL_PIECES_SPOTPASS_24.length
		}else{
			usedBytes=SavegameEditor.Constants.ALL_PIECES_SPOTPASS_40.length
		}
		
		var count=0;
		for(var i=0; i<usedBytes; i++){
			var myByte=tempFile.readU8(offset+i);
			for(var j=0; j<8; j++){
				var mask=Math.pow(2, (7-(j%8)));

				if(myByte & mask){
					count++;
				}
			}

		}

		var color;
		if(count==panelSize){
			color='green'
		}else if(count>=panelSize){
			color='red';
		}else{
			color='initial';
		}

		setValue('pieces',count);
		getField('pieces').style.color=color;
		
	},
	_setPiecesFromCurrentPanel:function(status){
		var arrayStr;
		if(status===false){
			arrayStr='NO_PIECES_';
		}else if(status===-1){
			arrayStr='MOST_PIECES_';
		}else{
			arrayStr='ALL_PIECES_';
		}
		if(get('select-panel').selectedIndex>=7){
			arrayStr+='SPOTPASS_';
		}
		arrayStr+=SavegameEditor.Constants.PANELS[parseInt(getValue('panel'))].Size;

		tempFile.writeBytes(SavegameEditor._getPanelOffset(), SavegameEditor.Constants[arrayStr]);

		SavegameEditor._countCurrentPanelPieces();
	},
	_unlockTicketShop:function(){
		var originalByte=tempFile.readU8(this.Offsets.SHOP_UNLOCKED);
		if(!(originalByte & 0x01)){
			tempFile.writeU8(this.Offsets.SHOP_UNLOCKED, originalByte+0x01);
			getField('button-unlockticketshop').disabled=true;
			MarcDialogs.alert('Ticket shop is open now.');
		}
	},
	_unlockSpeechBubbles:function(){
		tempFile.writeBytes(this.Offsets.SPEECH_BUBBLES, this.Constants.ALL_SPEECH_BUBBLES);
		getField('button-unlockspeechbubbles').disabled=true;
		MarcDialogs.alert('Speech bubbles 1-16 were unlocked.');
	},
	_unlockSpeechBubbles2:function(){
		tempFile.writeBytes(this.Offsets.SPEECH_BUBBLES2, this.Constants.ALL_SPEECH_BUBBLES2);
		getField('button-unlockspeechbubbles2').disabled=true;
		MarcDialogs.alert('Speech bubbles 17-22 were unlocked.');
	},
	_unlockHats2:function(){
		tempFile.writeBytes(this.Offsets.HATS2, this.Constants.ALL_HATS2);
		getField('button-unlockhats2').disabled=true;
		MarcDialogs.alert('All hats (pack 2) were unlocked.');
	},
	_unlockHats3:function(){
		tempFile.writeBytes(this.Offsets.HATS3, this.Constants.ALL_HATS3);
		getField('button-unlockhats3').disabled=true;
		MarcDialogs.alert('All hats (pack 3) were unlocked.');
	},
	_unlockHatsGame:function(i){
		for(var j=0; j<this.Constants.HATS_GAMES[i].length; j+=2){
			var offset=this.Constants.HATS_GAMES[i][j];
			var mask=this.Constants.HATS_GAMES[i][j+1];
			var byteRead=tempFile.readU8(offset);

			tempFile.writeU8(offset, (byteRead & ~mask)+mask);
		}
		getField('button-unlockhatsgame'+i).disabled=true;
		MarcDialogs.alert('Game '+i+' hats were unlocked.');
	},

	/* check if savegame is valid */
	checkValidSavegame:function(){
		return (tempFile.fileSize==393216)
	},



	/* preload function */
	preload:function(){
		setNumericRange('sptags', 0, 65535);
		setNumericRange('tickets', 0, 156);
		setNumericRange('fantastic', 0, 65535);
	},
	/* load function */
	load:function(){
		tempFile.littleEndian=true;

		setValue('sptags', tempFile.readU32(this.Offsets.STREETPASS_TAGS));
		setValue('tickets', tempFile.readU16(this.Offsets.TICKETS));
		setValue('fantastic', tempFile.readU16(this.Offsets.FANTASTIC_RATINGS));

		var panels=[];
		for(var i=0; i<this.Constants.PANELS.length; i++)
			panels.push((i+1)+'. '+this.Constants.PANELS[i].Name);

		var containerSelectPanel=get('container-select-panel');
		var selectPanel=select('panel',panels,this._countCurrentPanelPieces);
		selectPanel.style.width='auto';
		containerSelectPanel.appendChild(selectPanel);

		getField('button-unlockticketshop').disabled=(tempFile.readU8(this.Offsets.SHOP_UNLOCKED) & 0x01);
		getField('button-unlockspeechbubbles').disabled=(compareBytes(this.Offsets.SPEECH_BUBBLES, this.Constants.ALL_SPEECH_BUBBLES));
		getField('button-unlockspeechbubbles2').disabled=(compareBytes(this.Offsets.SPEECH_BUBBLES2, this.Constants.ALL_SPEECH_BUBBLES2));
		getField('button-unlockhats2').disabled=(compareBytes(this.Offsets.HATS2, this.Constants.ALL_HATS2));
		getField('button-unlockhats3').disabled=(compareBytes(this.Offsets.HATS3, this.Constants.ALL_HATS3));

		/*for(var i=0; i<11; i++){
			var enabled=this.Constants.HATS_GAMES[i].length/2;
			for(var j=0; j<this.Constants.HATS_GAMES[i].length; j+=2){
				var offset=this.Constants.HATS_GAMES[i][j];
				var mask=this.Constants.HATS_GAMES[i][j+1];

				var byteRead=tempFile.readByte(offset);
				if((byteRead & mask) === mask)
					enabled--;
			}
			m('#button-unlockhatsgame'+i).get().disabled=!enabled;
		}*/

		this._countCurrentPanelPieces();
	},


	/* save function */
	save:function(){
		tempFile.writeU32(this.Offsets.STREETPASS_TAGS, getValue('sptags'));
		tempFile.writeU16(this.Offsets.TICKETS, getValue('tickets'));
		tempFile.writeU16(this.Offsets.FANTASTIC_RATINGS, getValue('fantastic'));
	}
}