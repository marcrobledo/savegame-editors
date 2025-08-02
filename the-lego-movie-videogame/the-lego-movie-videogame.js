/* eslint-disable no-console */
/* eslint-disable max-len */
/*
	The Lego Movie Videogame for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/
'use_strict';
function convert_to_bit( d, l ) {
	return ( '0000000000000000' + ( d >>> 0 ).toString( 2 ) ).slice( 0 - l ).split( '' );
}
SavegameEditor = {
	Name: 'The Lego Movie Videogame',
	Filename: 'savegame.dat',

	/* Constants */
	Constants: {
		BLUE_STONES_OFFSET: 0x228, // 552
		CHALLENGE_OFFSET: 0x8,
		CHARACTER_OFFSET: 0x47C, // 1148
		CHARACTER_OPTIONS: [
			{ value: 0, name: 'Locked' },
			{ value: 1, name: 'Unlocked' },
			{ value: 2, name: 'Unlocked+Bought' }
		],
		SETTINGS_MUSIC_MICROPHONE_OFFSET: 0x18, // 00=All OFF, A0=Music ON, 0A=Microphone ON, AA=All ON
		LANGUAGE_OFFSET: 0x19,
		LANGUAGES: [
			{ value: 1, name: 'English' },
			{ value: 2, name: 'French' },
			{ value: 3, name: 'Italian' },
			{ value: 4, name: 'German' },
			{ value: 5, name: 'Spanish' },
			{ value: 6, name: 'Dutch' },
			{ value: 7, name: 'Danish' }
		],
		LEVEL_LAST_PLAYED_OFFSET: 0x6, // 6
		LEVEL_LAST_PLAYED_OFFSET2: 0x454, // 1108
		PROFILES: [
			{ value: 1, name: 'Save slot 1', offset: 0x1c }, // 28
			{ value: 2, name: 'Save slot 2', offset: 0x4fc } // 1276
		],
		PROFILE_SELECTION_OFFSET: 0x1A,
		SECTION_UNLOCK_OFFSET: 0x4A4, // 1188
		SECTION_UNLOCK_STATUS: [
			{ value: 0, name: 'Locked, Locked, Locked' },
			{ value: 1, name: 'Unlocked - Locked - Locked' },
			{ value: 21, name: 'Played - Unlocked - Locked' },
			{ value: 341, name: 'Played - Played - Unlocked' },
			{ value: 1911, name: 'Played - Played - Played' }
		],
		UPGRADES_OFFSET: 0x475, // 1141
		YELLOW_STONE_OFFSET: 0x238 // 568
	},
	/* CRC32 - from Alex - https://stackoverflow.com/a/18639999 */
	/* Combined with CRC32-Version by Slattz (https://github.com/Slattz/POTC3D_Rehash) */
	CRC32_TABLE: ( function () {
		let c;
		const crcTable = [];
		for ( let n = 0; n < 256; n++ ) {
			c = n;
			for ( let k = 0; k < 8; k++ ) {
				c = ( ( c & 1 ) ? ( 0xedb88320 ^ ( c >>> 1 ) ) : ( c >>> 1 ) );
			}
			crcTable[ n ] = ( c >>> 0 );
		}
		return crcTable;
	}() ),
	setPos: function ( node, tiles, pos ) {
		const size = 128, // Sprite height
			scale = 0.25, // height scaled down to 32px
			left = pos % tiles * size * scale,
			top = Math.floor( pos / tiles ) * size * scale;
		node.style.backgroundPosition = `-${ left }px -${ top }px`;
	},
	crc32: function ( file, len, offset ) {
		const self = this,
			data = file.readBytes( offset, len - offset );
		let byte = 0b0,
			checksum = 0xFF;
		for ( let i = 0; i < data.length; i++ ) {
			[ byte ] = new Int8Array( [ data[ i ] ] );
			const [ cs_ ] = new Int8Array( [ checksum ] );
			byte ^= cs_;
			byte &= 0xff;
			const cs___ = ( i === 0 ? cs_ : checksum );
			const a = self.CRC32_TABLE[ byte ];
			checksum = a ^ ( cs___ >>> 8 );
		}
		return ( ( checksum >>> 0 ) << 0 ) >>> 0;
	},
	_getProfileOffset: function () {
		return SavegameEditor.Constants.PROFILES[ Number( getValue( 'profile-selector' ) ) - 1 ].offset;
	},
	_get_section_status: function ( s ) {
		const offset = SavegameEditor._getProfileOffset() + SavegameEditor.Constants.SECTION_UNLOCK_OFFSET,
			amount = Math.ceil( 1.5 * s );
		let result = '';
		for ( let i = 0; i < amount; i++ ) {
			result = convert_to_bit( tempFile.readU8( offset + i ), 8 ).join( '' ) + result;
		}
		result = result.slice( 0, Math.max( 0, result.length - 12 * ( s - 1 ) ) ).slice( -12 );
		return parseInt( result, 2 );
	},
	_write_section_status: function ( e ) {
		const s = e.target.dataset.section,
			status = getValue( 'section-status-' + s ),
			offset = SavegameEditor._getProfileOffset() + SavegameEditor.Constants.SECTION_UNLOCK_OFFSET,
			to_write = [],
			amount = Math.ceil( 1.5 * s );
		let result = '';
		for ( let i = 0; i < amount; i++ ) {
			result = convert_to_bit( tempFile.readU8( offset + i ), 8 ).join( '' ) + result;
		}
		result = result.slice( 0, Math.max( 0, result.length - 12 * ( s ) ) ) + convert_to_bit( status, 12 ).join( '' ) + result.slice( result.length - 12 * ( s - 1 ), result.length );
		for ( let j = 0; j < result.length; j += 8 ) {
			to_write.unshift( result.slice( j, j + 8 ) );
		}
		for ( let k = 0; k < to_write.length; k++ ) {
			tempFile.writeU8(
				offset + k,
				parseInt( to_write[ k ], 2 )
			);
		}
	},
	_write_language: function () {
		tempFile.writeU8(
			SavegameEditor.Constants.LANGUAGE_OFFSET,
			getValue( 'language' )
		);
	},
	_get_level_stone_offset: function () {
		const profileStartOffset = SavegameEditor._getProfileOffset();
		return profileStartOffset + SavegameEditor.Constants.YELLOW_STONE_OFFSET + Number( getValue( 'levels' ) ) * 8;
	},
	_write_level_stones: function () {
		tempFile.writeU24(
			SavegameEditor._get_level_stone_offset(),
			getValue( 'level-stones' )
		);
	},
	_write_blue_stones: function () {
		const profileStartOffset = SavegameEditor._getProfileOffset();
		tempFile.writeU24(
			profileStartOffset + SavegameEditor.Constants.BLUE_STONES_OFFSET,
			getValue( 'blue-stones' )
		);
	},
	_write_sound_settings: function () {
		tempFile.writeU8(
			SavegameEditor.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET,
			( getField( 'checkbox-microphone' ).checked ? 10 : 0 ) + ( getField( 'checkbox-music' ).checked ? 160 : 0 )
		);
	},
	_write_last_played: function () {
		tempFile.writeU8(
			SavegameEditor.Constants.LEVEL_LAST_PLAYED_OFFSET,
			getValue( 'last-played' )
		);
		tempFile.writeU8(
			SavegameEditor.Constants.LEVEL_LAST_PLAYED_OFFSET2,
			getValue( 'last-played' )
		);
	},
	_write_character: function ( e ) {
		const profileStartOffset = SavegameEditor._getProfileOffset(),
			offset = profileStartOffset + SavegameEditor.Constants.CHARACTER_OFFSET + Number( e.target.dataset.offset ),
			bits = convert_to_bit( tempFile.readU8( offset ), 8 ),
			val = getValue( e.target.id );
		bits[ e.target.dataset.offset_ * 2 ] = ( val === '2' ? '1' : '0' );
		bits[ e.target.dataset.offset_ * 2 + 1 ] = ( val !== '0' ? '1' : '0' );
		tempFile.writeU8(
			offset,
			parseInt( bits.join( '' ), 2 )
		);
	},
	_write_challenge: function ( e ) {
		const lvl = Number( getValue( 'levels' ) );
		tempFile.writeU8(
			SavegameEditor._getProfileOffset() + SavegameEditor.Constants.CHALLENGE_OFFSET + ( lvl ) * 10 + Number( e.target.dataset.challenge ),
			e.target.checked === true ? '1' : '0'
		);
	},
	_write_upgrade: function ( e ) {
		const profileStartOffset = SavegameEditor._getProfileOffset(),
			offset = profileStartOffset + SavegameEditor.Constants.UPGRADES_OFFSET,
			bitsUnlocked = convert_to_bit( tempFile.readU16( offset ), 16 ),
			bitsBought = convert_to_bit( tempFile.readU16( offset + 2 ), 16 ),
			val = getValue( e.target.id );
		bitsBought[ e.target.dataset.offset ] = ( val === '2' ? '1' : '0' );
		bitsUnlocked[ e.target.dataset.offset ] = ( val !== '0' ? '1' : '0' );
		tempFile.writeU16(
			offset,
			parseInt( bitsUnlocked.join( '' ), 2 )
		);
		tempFile.writeU16(
			offset + 2,
			parseInt( bitsBought.join( '' ), 2 )
		);
	},
	_load_level: function () {
		const profileStartOffset = SavegameEditor._getProfileOffset(),
			lvl = Number( getValue( 'levels' ) );
		setValue( 'level-stones', tempFile.readU24( SavegameEditor._get_level_stone_offset() ) );
		for ( let i = 0; i < 10; i++ ) {
			const data = SavegameEditor.Constants.CHALLENGES[ lvl ][ i ];
			SavegameEditor.setPos( document.querySelector( `.challenge-icon[data-id="${ i + 1 }"]` ), 12, data[ 1 ] - 1 );
			document.querySelector( 'label[for="checkbox-challenge-' + ( i + 1 ) + '-unlocked"]' ).innerText = data[ 0 ];
			getField( 'challenge-' + ( i + 1 ) + '-unlocked' ).checked = tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CHALLENGE_OFFSET + ( lvl ) * 10 + i ) === 1;
		}
	},
	_create_mission_select: function ( id, func ) {
		const missionSelect = document.createElement( 'select' );
		missionSelect.id = `select-${ id }`;
		missionSelect.className = 'full-width';
		missionSelect.addEventListener( 'change', func, false );
		SavegameEditor.Constants.CHAPTERS.forEach( ( chapter, index ) => {
			const optgroup = missionSelect.appendChild( document.createElement( 'optgroup' ) );
			optgroup.label = chapter;
			for ( let i = 0; i < 3; i++ ) {
				const selectEle = optgroup.appendChild( document.createElement( 'option' ) );
				selectEle.value = String( index * 3 + i );
				selectEle.textContent = SavegameEditor.Constants.MISSIONS[ index * 3 + i ];
			}
		} );
		return missionSelect;
	},
	_load_profile: function () {
		const self = SavegameEditor,
			profileStartOffset = self._getProfileOffset();

		setValue( 'blue-stones', tempFile.readU24( profileStartOffset + self.Constants.BLUE_STONES_OFFSET ) );
		setValue( 'levels', '1' );
		let field, a, b, c;
		for ( c = 0; c < self.Constants.CHARACTERS.length; c++ ) {
			field = getField( 'select-character-' + c );
			a = convert_to_bit( tempFile.readU8( profileStartOffset + self.Constants.CHARACTER_OFFSET + Number( field.dataset.offset ) ), 8 );
			b = ( a[ field.dataset.offset_ * 2 ] === '1' ) ? '2' : ( ( a[ field.dataset.offset_ * 2 + 1 ] === '1' ) ? '1' : '0' );
			setValue( 'character-' + c, Number( b ) );
		}
		const bought = convert_to_bit( tempFile.readU16( profileStartOffset + self.Constants.UPGRADES_OFFSET + 2 ), 16 ),
			unlocked = convert_to_bit( tempFile.readU16( profileStartOffset + self.Constants.UPGRADES_OFFSET ), 16 );
		for ( c = 0; c < self.Constants.UPGRADES.length; c++ ) {
			field = getField( 'select-upgrade-' + c );
			b = ( bought[ field.dataset.offset ] === '1' ) ? '2' : ( ( unlocked[ field.dataset.offset ] === '1' ) ? '1' : '0' );
			setValue( 'upgrade-' + c, Number( b ) );
		}
		setValue( 'last-played', tempFile.readU8( profileStartOffset + self.Constants.LEVEL_LAST_PLAYED_OFFSET ) );
		self._load_level();
		for ( let l = 1; l < 16; l++ ) {
			setValue( 'section-status-' + l, self._get_section_status( l ) );
		}
	},

	/* check if savegame is valid */
	checkValidSavegame: function () {
		return ( tempFile.fileSize === 2524 );
	},

	preload: function () {
		const self = this;
		get( 'toolbar' ).children[ 0 ].appendChild( select( 'profile-selector', this.Constants.PROFILES, this._load_profile ) );
		get( 'container-language' ).appendChild( select( 'language', self.Constants.LANGUAGES, self._write_language ) );
		get( 'container-levelselection' ).appendChild( this._create_mission_select( 'levels', self._load_level ) );
		for ( let i = 0; i < 10; i++ ) {
			getField( 'challenge-' + ( i + 1 ) + '-unlocked' ).addEventListener( 'change', self._write_challenge );
		}
		get( 'container-last-played' ).appendChild( this._create_mission_select( 'last-played', self._write_last_played ) );
		get( 'input-level-stones' ).addEventListener( 'change', self._write_level_stones );
		get( 'input-blue-stones' ).addEventListener( 'change', self._write_blue_stones );
		getField( 'checkbox-microphone' ).addEventListener( 'change', self._write_sound_settings );
		getField( 'checkbox-music' ).addEventListener( 'change', self._write_sound_settings );
		setNumericRange( 'blue-stones', 0, 16777215 );
		const tmp1 = get( 'character-list' );
		for ( let j = 0; j < self.Constants.CHARACTERS.length; j++ ) {
			const name = self.Constants.CHARACTERS[ j ],
				characterIcon = document.createElement( 'span' ),
				characterCol = tmp1.appendChild( col( 3, characterIcon ) ),
				characterName = characterCol.appendChild( span( name ) );
			SavegameEditor.setPos( characterIcon, 10, j );
			characterName.className = 'character-name';
			characterIcon.className = 'character-icon';
			const sel = select( 'character-' + j, self.Constants.CHARACTER_OPTIONS, self._write_character );
			sel.dataset.offset = Math.floor( j * 0.25 );
			sel.dataset.offset_ = 3 - ( j - sel.dataset.offset * 4 );
			tmp1.appendChild( col( 3, sel ) );
		}
		const tmp2 = get( 'upgrades-list' );
		for ( let k = 0; k < self.Constants.UPGRADES.length; k++ ) {
			const name = self.Constants.UPGRADES[ k ],
				upgradeIcon = document.createElement( 'span' ),
				upgradeCol = tmp2.appendChild( col( 3, upgradeIcon ) ),
				upgradeName = upgradeCol.appendChild( span( name ) );
			SavegameEditor.setPos( upgradeIcon, 4, k );
			upgradeName.className = 'upgrade-name';
			upgradeIcon.className = 'upgrade-icon';
			const sel_ = select( 'upgrade-' + k, self.Constants.CHARACTER_OPTIONS, self._write_upgrade );
			sel_.dataset.offset = k;
			tmp2.appendChild( col( 3, sel_ ) );
		}
		tmp2.appendChild( col( 6, span( '' ) ) );
		const tmp3 = get( 'sections-list' );
		for ( let l = 1; l < 16; l++ ) {
			const sel__ = select( 'section-status-' + l, self.Constants.SECTION_UNLOCK_STATUS, self._write_section_status );
			sel__.dataset.section = l;
			tmp3.append(
				col( 2, span( 'S' + l + ' (Level ' + ( ( l - 1 ) * 3 + 1 ) + '-' + ( l * 3 ) + ')' ) ),
				col( 4, sel__ )
			);
		}
		tmp3.appendChild( col( 6, span( '' ) ) );
	},

	/* load function */
	load: function () {
		const self = this;
		tempFile.fileName = 'savegame.dat';
		tempFile.littleEndian = true;
		console.log( 'Old CRC32 ', tempFile.readU32( 0 ) );
		console.log( 'Calced CRC32 ', self.crc32( tempFile, tempFile.fileSize, 24 ) );

		setValue( 'language', tempFile.readU8( self.Constants.LANGUAGE_OFFSET ) );
		setValue( 'savegame', 'Save game #' + ( tempFile.readU8( self.Constants.PROFILE_SELECTION_OFFSET ) + 1 ) );
		getField( 'checkbox-microphone' ).checked = tempFile.readU8( self.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET ) > 0;
		getField( 'checkbox-music' ).checked = tempFile.readU8( self.Constants.SETTINGS_MUSIC_MICROPHONE_OFFSET ) > 100;
		this._load_profile();
	},

	/* save function */
	save: function () {
		const self = this;
		console.log( 'New CRC32 ', self.crc32( tempFile, tempFile.fileSize, 24 ) );
		tempFile.writeU32(
			0,
			self.crc32( tempFile, tempFile.fileSize, 24 )
		);
	}
};
