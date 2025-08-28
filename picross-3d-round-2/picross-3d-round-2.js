/*
	Picross 3D round 2 for HTML5 Save Editor v20160704
	by Marc Robledo 2016
*/
const hexPos = [];
const textEle = [];
const reg = /\d+/;

SavegameEditor = {
	Name: 'Picross 3D: round 2',
	Filename: 'SAVEDATA',

	/* Constants */
	Constants: {
		BACKGROUND_OFFSET: 0x2232,
		BACKGROUND: [
			{ value: 0, name: 'Argyle' },
			{ value: 1, name: 'Clovers' },
			{ value: 2, name: 'Flowers' },
			{ value: 3, name: 'Nightshade' },
			{ value: 4, name: 'Polka Dots' },
			{ value: 5, name: 'Rainbow Board' },
			{ value: 6, name: 'Vibrant Blooms' },
			{ value: 7, name: 'Petit Fours' },
			{ value: 8, name: 'Hearts & Diamonds' },
			{ value: 9, name: 'Delightful Dots' },
			{ value: 10, name: 'Lace' },
			{ value: 11, name: 'Tiny Blooms' },
			{ value: 12, name: 'Craft Paper' },
			{ value: 13, name: 'Little Ducks' },
			{ value: 14, name: 'Blocks' },
			{ value: 15, name: 'Tartan' },
			{ value: 16, name: 'Techno' },
			{ value: 17, name: 'Special Puzzle' },
			{ value: 18, name: 'Time Challenge' },
			{ value: 19, name: 'One Chance' },
			{ value: 20, name: 'Tutorial' },
			{ value: 254, name: 'Random' },
			{ value: 255, name: 'Default' }
		],
		CONTROLS: [
			{ value: 0, name: 'Hammer' },
			{ value: 1, name: 'Blue Paint' },
			{ value: 2, name: 'Orange Paint' },
			{ value: 3, name: 'Orange Pencil' },
			{ value: 4, name: 'Blue Pencil' }
		],
		CONTROLS_CIRCLE_OFFSET: 0x223E,
		CONTROLS_CROSS_OFFSET: 0x2234,
		CONTROLS_CROSS_ABXY_OFFSET: 0x2238,
		CONTROLS_LR_OFFSET: 0x223C,
		DIFFICULTIES: [
			{ value: 0, name: 'Easy' },
			{ value: 1, name: 'Medium' },
			{ value: 4, name: 'Hard' }
		],
		DIFFICULTY_OFFSET: 0x2230,
		PROFILES: [
			{ value: 1, name: 'Membership Card 1', offset: 0x0C }, // 12
			{ value: 2, name: 'Membership Card 2', offset: 0x3B84 }, // 15236
			{ value: 3, name: 'Membership Card 3', offset: 0x76FC } // 30460
		],
		BGM_MUSIC_OFFSET: 0x2243,
		BGM_MUSIC: [
			{ value: 0, name: 'Café' },
			{ value: 1, name: 'Jazz' },
			{ value: 2, name: 'Latin' },
			{ value: 3, name: 'March' },
			{ value: 4, name: 'Mystery' },
			{ value: 5, name: 'Joy' },
			{ value: 6, name: 'Fantasy' },
			{ value: 7, name: 'Daydream' },
			{ value: 8, name: 'Lively Forest' },
			{ value: 9, name: 'Peaceful Beach' },
			{ value: 10, name: 'Busy Café' },
			{ value: 11, name: 'Tutorial' },
			{ value: 12, name: 'Challenge' },
			{ value: 254, name: 'Random' },
			{ value: 255, name: 'Default' }
		],
		LEVEL_STATUS: [
			{ value: 8, name: 'Locked' },
			{ value: 9, name: 'Unlocked' },
			{ value: 13, name: 'Solved' },
			{ value: 29, name: 'Solved (Read)' }
		],
		locale: {}
	},
	_getProfileOffset: function () {
		return this.Constants.PROFILES[ Number( getValue( 'profile-selector' ) ) - 1 ].offset;
	},
	_write_background: function () {
		tempFile.writeU8(
			this._getProfileOffset() + this.Constants.BACKGROUND_MUSIC_OFFSET,
			getValue( 'background' )
		);
	},
	_write_controls_circle: function () {
		const offset = SavegameEditor._getProfileOffset();
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CIRCLE_OFFSET,
			getValue( 'circle-up' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CIRCLE_OFFSET + 3,
			getValue( 'circle-left' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CIRCLE_OFFSET + 4,
			getValue( 'circle-right' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CIRCLE_OFFSET + 1,
			getValue( 'circle-bottom-left' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CIRCLE_OFFSET + 2,
			getValue( 'circle-bottom-right' )
		);
	},
	_write_controls_cross: function () {
		const offset = SavegameEditor._getProfileOffset();
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_OFFSET,
			getValue( 'cross-up' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_OFFSET + 1,
			getValue( 'cross-down' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_OFFSET + 2,
			getValue( 'cross-left' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_OFFSET + 3,
			getValue( 'cross-right' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_LR_OFFSET,
			getValue( 'cross-lr' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_LR_OFFSET + 1,
			getValue( 'cross-lr' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_ABXY_OFFSET + 2,
			getValue( 'cross-up' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_ABXY_OFFSET + 3,
			getValue( 'cross-left' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_ABXY_OFFSET,
			getValue( 'cross-right' )
		);
		tempFile.writeU8(
			offset + this.Constants.CONTROLS_CROSS_ABXY_OFFSET + 1,
			getValue( 'cross-bottom' )
		);
	},
	_write_difficulty: function () {
		tempFile.writeU8(
			this._getProfileOffset() + this.Constants.DIFFICULTY_OFFSET,
			getValue( 'difficulty' )
		);
	},
	_write_bgm_music: function () {
		tempFile.writeU8(
			this._getProfileOffset() + this.Constants.SFX_OFFSET(),
			getValue( 'bgm-music' )
		);
	},
	_update_list_values: function () {
		const profileStartOffset = SavegameEditor._getProfileOffset();
		hexPos.forEach( ( pos, index ) => {
			if ( pos[ 0 ] === 'puzzle' ) {
				setValue( `levels_${ index }_status`, tempFile.readU8( profileStartOffset + pos[ 1 ] ) );
				setValue( `levels_${ index }_difficulty`, tempFile.readU8( profileStartOffset + pos[ 1 ] + 7 ) );
				setValue( `levels_${ index }_errors`, tempFile.readU8( profileStartOffset + pos[ 1 ] + 8 ) );
				setValue( `levels_${ index }_time`, tempFile.readU16( profileStartOffset + pos[ 1 ] + 12 ) );
				setValue( `levels_${ index }_points`, tempFile.readU16( profileStartOffset + pos[ 1 ] + 4 ) );
			} else if ( pos[ 0 ] === 'tutorial' ) {
				setValue( `tutorials_${ index }_status`, tempFile.readU8( profileStartOffset + pos[ 2 ] ) );
				setValue( `tutorials_${ index }_difficulty`, tempFile.readU8( profileStartOffset + pos[ 2 ] + 7 ) );
			} else if ( pos[ 0 ] === 'skill' ) {
				setValue( `skills_${ index }_status`, tempFile.readU8( profileStartOffset + pos[ 1 ] ) );
				setValue( `skills_${ index }_difficulty`, tempFile.readU8( profileStartOffset + pos[ 1 ] + 7 ) );
			}
		} );
	},
	_write_level_errors: function ( e ) {
		const index = Number( ( e.target.id ).match( reg )[ 0 ] );
		const offset = SavegameEditor._getProfileOffset() + 0x220 + index * 16 + 8;
		tempFile.writeU8(
			offset,
			getValue( e.target.id )
		);
	},
	_write_level_time: function ( e ) {
		const index = Number( ( e.target.id ).match( reg )[ 0 ] );
		const offset = SavegameEditor._getProfileOffset() + 0x220 + index * 16 + 12;
		tempFile.writeU16(
			offset,
			getValue( e.target.id )
		);
	},
	_write_level_points: function ( e ) {
		const index = Number( ( e.target.id ).match( reg )[ 0 ] );
		const offset = SavegameEditor._getProfileOffset() + 0x220 + index * 16 + 4;
		tempFile.writeU16(
			offset,
			getValue( e.target.id )
		);
	},
	_write_level_status: function ( e ) {
		const index = Number( ( e.target.id ).match( reg )[ 0 ] );
		const offset = SavegameEditor._getProfileOffset() + 0x220 + index * 16;
		tempFile.writeU8(
			offset,
			getValue( e.target.id )
		);
	},
	_write_level_difficulty: function ( e ) {
		const index = Number( ( e.target.id ).match( reg )[ 0 ] );
		const offset = SavegameEditor._getProfileOffset() + 0x220 + index * 16 + 7;
		tempFile.writeU8(
			offset,
			getValue( e.target.id )
		);
	},
	_load_profile: function () {
		const profileStartOffset = SavegameEditor._getProfileOffset();

		setValue( 'background', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.BACKGROUND_OFFSET ) );
		setValue( 'bgm-music', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.BGM_MUSIC_OFFSET ) );
		setValue( 'difficulty', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.DIFFICULTY_OFFSET ) );

		setValue( 'cross-up', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CROSS_OFFSET ) );
		setValue( 'cross-left', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CROSS_OFFSET + 2 ) );
		setValue( 'cross-right', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CROSS_OFFSET + 3 ) );
		setValue( 'cross-bottom', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CROSS_OFFSET + 1 ) );
		setValue( 'cross-lr', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_LR_OFFSET ) );

		setValue( 'circle-up', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CIRCLE_OFFSET ) );
		setValue( 'circle-left', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CIRCLE_OFFSET + 3 ) );
		setValue( 'circle-right', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CIRCLE_OFFSET + 4 ) );
		setValue( 'circle-bottom-left', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CIRCLE_OFFSET + 1 ) );
		setValue( 'circle-bottom-right', tempFile.readU8( profileStartOffset + SavegameEditor.Constants.CONTROLS_CIRCLE_OFFSET + 2 ) );

		setValue( 'profile-name', tempFile.readU16String( profileStartOffset, 10 ) );
		const tmp = tempFile.readU8( profileStartOffset + 0x2231 );
		setValue( 'checkbox-help', tmp > 1 ? 'checked' : '' );
		setValue( 'checkbox-bomb', ( tmp + 1 ) % 2 === 0 > 1 ? 'checked' : '' );
		SavegameEditor._update_list_values();
	},

	/* check if savegame is valid */
	checkValidSavegame: function () {
		return ( tempFile.fileSize === 45688 );
	},

	getI18n: function ( loc, name ) {
		const all = SavegameEditor.Constants.locale[ loc ] || SavegameEditor.Constants.locale.en,
			tmp = all[ name ];
		return loc === 'qqx' ? name : ( typeof tmp === 'string' ? tmp : tmp[ 0 ] );
	},

	preload: function () {
		get( 'container-profile-name' ).appendChild( input( 'profile-name', 10 ) );
		get( 'input-profile-name' ).addEventListener( 'change', function () {
			tempFile.writeU16String(
				this._getProfileOffset(),
				10,
				getValue( 'profile-name' )
			);
		} );

		get( 'container-background' ).appendChild( select( 'background', SavegameEditor.Constants.BACKGROUND, SavegameEditor._write_background ) );
		get( 'container-bomb' ).appendChild( checkbox( 'checkbox-bomb' ) );
		get( 'container-difficulty' ).appendChild( select( 'difficulty', SavegameEditor.Constants.DIFFICULTIES, SavegameEditor._write_difficulty ) );
		get( 'container-help' ).appendChild( checkbox( 'checkbox-help' ) );
		get( 'container-bgm-music' ).appendChild( select( 'bgm-music', SavegameEditor.Constants.BGM_MUSIC, SavegameEditor._write_bgm_music ) );

		get( 'container-cross-up' ).appendChild( select( 'cross-up', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_cross ) );
		get( 'container-cross-left' ).appendChild( select( 'cross-left', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_cross ) );
		get( 'container-cross-right' ).appendChild( select( 'cross-right', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_cross ) );
		get( 'container-cross-bottom' ).appendChild( select( 'cross-bottom', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_cross ) );
		get( 'container-cross-lr' ).appendChild( select( 'cross-lr', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_cross ) );

		get( 'container-circle-up' ).appendChild( select( 'circle-up', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_circle ) );
		get( 'container-circle-left' ).appendChild( select( 'circle-left', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_circle ) );
		get( 'container-circle-right' ).appendChild( select( 'circle-right', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_circle ) );
		get( 'container-circle-bottom-left' ).appendChild( select( 'circle-bottom-left', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_circle ) );
		get( 'container-circle-bottom-right' ).appendChild( select( 'circle-bottom-right', SavegameEditor.Constants.CONTROLS, SavegameEditor._write_controls_circle ) );

		const rt = get( 'row-tutorials' ),
			rl = get( 'row-levels' ),
			rs = get( 'row-skills' );
		SavegameEditor.Constants.puzzles.forEach( ( puzzle, index ) => {
			const idEle = span( '' );
			const nameEle = span( '' );
			if ( puzzle.startsWith( 'puzzle' ) ) {
				const id = puzzle.replace( 'puzzle_', '' );
				textEle.push( [ 'p', id, idEle, nameEle ] );
				hexPos.push( [ 'puzzle', 0x220 + index * 16 ] );
				rl.append(
					col( 1, idEle ),
					col( 2, nameEle ),
					col( 2, select( `levels_${ index }_status`, SavegameEditor.Constants.LEVEL_STATUS, SavegameEditor._write_level_status ) ),
					col( 2, select( `levels_${ index }_difficulty`, SavegameEditor.Constants.DIFFICULTIES, SavegameEditor._write_level_difficulty ) ),
					col( 1, inputNumber( `levels_${ index }_errors`, 0, 255, 0 ) ),
					col( 2, inputNumber( `levels_${ index }_time`, 0, 65535, 0 ) ),
					col( 2, inputNumber( `levels_${ index }_points`, 0, 255, 0 ) )
				);
				getField( `number-levels_${ index }_errors` ).addEventListener( 'change', SavegameEditor._write_level_errors );
				getField( `number-levels_${ index }_time` ).addEventListener( 'change', SavegameEditor._write_level_time );
				getField( `number-levels_${ index }_points` ).addEventListener( 'change', SavegameEditor._write_level_points );
			} else if ( puzzle.startsWith( 'tutorial' ) ) {
				const id = puzzle.replace( 'tutorial_', '' ).replace( /^0/g, ' ' );
				textEle.push( [ 't', id, idEle, nameEle ] );
				hexPos.push( [ 'tutorial', 0x220 + index * 16 ] );
				rt.append(
					col( 1, idEle ),
					col( 4, nameEle ),
					col( 4, select( `tutorials_${ index }_status`, SavegameEditor.Constants.LEVEL_STATUS, SavegameEditor._write_level_status ) ),
					col( 3, select( `tutorials_${ index }_difficulty`, SavegameEditor.Constants.DIFFICULTIES, SavegameEditor._write_level_difficulty ) )
				);
			} else if ( puzzle.startsWith( 'skill' ) ) {
				const id = puzzle.replace( 'skill_', '' ).replace( /^0/g, ' ' );
				textEle.push( [ 's', id, idEle, nameEle ] );
				hexPos.push( [ 'skill', 0x220 + index * 16 ] );
				rs.append(
					col( 1, idEle ),
					col( 4, nameEle ),
					col( 4, select( `skills_${ index }_status`, SavegameEditor.Constants.LEVEL_STATUS, SavegameEditor._write_level_status ) ),
					col( 3, select( `skills_${ index }_difficulty`, SavegameEditor.Constants.DIFFICULTIES, SavegameEditor._write_level_difficulty ) )
				);
			}
		} );
		get( 'toolbar' ).children[ 0 ].appendChild( select( 'profile-selector', this.Constants.PROFILES, this._load_profile ) );
	},

	unload: function () {
		document.getElementById( 'container-startup' ).style.removeProperty( 'display' );
	},

	/* load function */
	load: function () {
		document.getElementById( 'container-startup' ).style.display = 'none';
		tempFile.fileName = 'SAVEDATA';
		tempFile.littleEndian = true;

		const loc = document.getElementById( 'select-language' ).value,
			i18n = {
				p: SavegameEditor.getI18n( loc, 'prefix_puzzle' ),
				s: SavegameEditor.getI18n( loc, 'prefix_skill' ),
				t: SavegameEditor.getI18n( loc, 'prefix_tutorial' ),
				easy: SavegameEditor.getI18n( loc, 'style_001' ),
				medium: SavegameEditor.getI18n( loc, 'style_002' ),
				hard: SavegameEditor.getI18n( loc, 'style_003' )
			};
		SavegameEditor.Constants.puzzles.forEach( ( puzzle, index ) => {
			const tmp = textEle[ index ];
			tmp[ 2 ].textContent = `${ i18n[ tmp[ 0 ] ] }${ tmp[ 1 ] }`;
			tmp[ 3 ].textContent = SavegameEditor.getI18n( loc, puzzle );
		} );

		this._load_profile();
	},

	/* save function */
	save: function () {
	}
};
