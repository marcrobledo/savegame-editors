const spriteBaseURL = 'https://www.spriters-resource.com/resources/sheets/112/%0.png';
const spriteBaseURLLocal = 'sprites/%0.png';
const useLocal = false;
const spriteData = {
	// Dogs
	basset_hound: [ '114733', 6 ],
	beagle: [ '114732', 6 ],
	boxer: [ '114888', 6 ],
	bull_terrier: [ '114889', 6 ],
	chihuahua: [ '114890', 6 ],
	chihuahua1: [ '114890', 2 ],
	cocker_spaniel: [ '114893', 5 ],
	dalmatian: [ '114891', 6 ],
	french_bulldog: [ '114892', 5 ],
	german_shepherd_dog: [ '114896', 6 ],
	golden_retriever: [ '114737', 6 ],
	great_dane: [ '114895', 6 ],
	jack_russell_terrier: [ '114898', 6 ],
	labrador_retriever: [ '114900', 5 ],
	labrador_retriever1: [ '114900', 1 ],
	maltese: [ '114734', 6 ],
	miniature_dachshund: [ '114902', 5 ],
	miniature_dachshund1: [ '114902', 1 ],
	miniature_pinscher: [ '114903', 5 ],
	miniature_schnauzer: [ '114904', 5 ],
	miniature_schnauzer1: [ '114904', 1 ],
	pembroke_welsh_corgi: [ '114899', 6 ],
	pomeranian: [ '114907', 6 ],
	pomeranian1: [ '114907', 1 ],
	pug: [ '114906', 5 ],
	robo_pup: [ '114735', 5 ],
	shetland_sheepdog: [ '114912', 6 ],
	shiba: [ '114908', 5 ],
	shih_tzu: [ '114909', 5 ],
	siberian_husky: [ '114897', 6 ],
	spaniel: [ '114901', 5 ],
	toy_poodle: [ '114905', 5 ],
	toy_poodle1: [ '114905', 1 ],
	yorkshire_terrier: [ '114736', 6 ],
	// Cats
	standard: [ '114911', 6 ],
	oriental: [ '114910', 6 ],
	longhair: [ '114894', 18 ]
};
window.spriteData = spriteData;

const _writeU8 = function ( variable, value ) {
	tempFile.writeU8(
		SavegameEditor.Constants.PET_OFFSET[ get( 'menu' ).dataset.pet ] + SavegameEditor.Constants[ variable ],
		Number( value )
	);
};

window.addEventListener( 'load', () => {
	'use strict';
	const btnClose = document.getElementById( 'menu-close' ),
		content = document.getElementById( 'menu-content' ),
		eyecolor = document.getElementById( 'eyecolor' ),
		menu = document.getElementById( 'menu' ),
		sidebar_cat = document.getElementById( 'menu-sidebar-cat' ),
		sidebar_dog = document.getElementById( 'menu-sidebar-dog' );

	const sidebar_event = function ( e ) {
		if ( !e.target || !e.target.className || !e.target.className.startsWith( 'page-' ) ) {
			return;
		}
		let old = sidebar_dog.querySelector( 'div[open]' );
		if ( old ) {
			old.removeAttribute( 'open' );
			content.querySelector( '.' + old.className ).style.display = 'none';
		}
		old = sidebar_cat.querySelector( 'div[open]' );
		if ( old ) {
			old.removeAttribute( 'open' );
			content.querySelector( '.' + old.className ).style.display = 'none';
		}
		const tmp = e.target.className.match( /\d+/g );
		menu.dataset.type = ( tmp[ 0 ] >= 29 && tmp[ 0 ] <= 31 ) ? 'cat' : 'dog';
		e.target.setAttribute( 'open', true );
		let eye_color_offset = 255;
		if ( menu.dataset.type === 'cat' ) {
			eye_color_offset = Number( document.getElementById( 'eyecolor' ).querySelector( ':checked' ).dataset.offset );
		}
		let newContent = content.querySelector( '.' + e.target.className );
		if ( newContent && menu.dataset.type === 'cat' ) {
			newContent.parentElement.removeChild( newContent );
			newContent = undefined;
		}
		if ( !newContent ) {
			newContent = content.appendChild( document.createElement( 'div' ) );
			newContent.className = e.target.className;
			const offset = Number( e.target.getAttribute( 'image-offset' ) );
			const sD = spriteData[ e.target.getAttribute( 'breed' ) ];
			let correctionXOffset = 0,
				correctionYOffset = 0,
				offX = -4,
				offY = -4 - 68 * Math.ceil( offset / sD[ 1 ] ),
				color = 0,
				style = 0;
			const i_max = offset + Number( e.target.getAttribute( 'image-items' ) );
			for ( let i = offset; i < i_max; i++ ) {
				if ( newContent.className === 'page-9-1' && color === 2 ) { // Fix for Labrador Retriever - Black
					correctionYOffset = 68;
				} else if ( newContent.className === 'page-17-22' ) { // Fix for German Shepherd Dog - White
					correctionXOffset = 340;
				} else if ( newContent.className === 'page-14-2' ) { // Fix for Miniature Schnauzer - Surprise Me #1
					if ( i === 12 ) { // Correct image 1
						correctionYOffset = 68 * 3;
					} else if ( i === 13 ) { // Correct 2
						correctionYOffset = 68 * 7;
					} else if ( i === 14 || i === 15 || i === 16 ) { // Correct 3, 4 and 5
						correctionYOffset = -( 68 * 2 );
					}
				} else if ( newContent.className === 'page-14-12' ) { // Fix for Miniature Schnauzer - Surprise Me #2
					if ( i === 21 ) { // Correct image 5
						correctionYOffset = 0;
					} else {
						correctionYOffset = -68;
					}
				}
				if ( menu.dataset.type === 'dog' || ( i - offset ) % 3 === eye_color_offset ) {
					const baseURL = useLocal && spriteBaseURLLocal || spriteBaseURL,
						ele = newContent.appendChild( document.createElement( 'div' ) );
					ele.className = 'sprite';
					ele.dataset.color = color;
					ele.dataset.eye_color = eye_color_offset;
					ele.dataset.style = style;
					ele.style.backgroundImage = 'url(' + baseURL.replaceAll( '%0', sD[ 0 ] ) + ')';
					ele.style.backgroundPosition = ( offX - correctionXOffset ) + 'px ' + ( offY - correctionYOffset ) + 'px';
					style++;
				}
				offX -= 68;
				if (
					( ( i - offset ) > 0 || sD[ 1 ] === 1 ) &&
					( i - offset ) % sD[ 1 ] === sD[ 1 ] - 1
				) {
					offX = -4;
					offY -= 68;
				}
				if ( style >= ( e.target.dataset.percolor || 6 ) ) {
					color++;
					style = 0;
				}
			}
			newContent.style.width = 74 * ( e.target.dataset.percolor || 6 ) + 'px';
		} else {
			newContent.style.removeProperty( 'display' );
		}
		e.target.scrollIntoView();
	};
	window._sidebar_event = sidebar_event;
	sidebar_dog.addEventListener( 'click', sidebar_event, false );
	sidebar_cat.addEventListener( 'click', sidebar_event, false );
	eyecolor.addEventListener( 'change', () => {
		sidebar_cat.querySelector( '[open]' ).click();
	}, false );

	content.addEventListener( 'click', ( e ) => {
		if ( !e.target.className.includes( 'sprite' ) ) {
			return;
		}
		const tmp = e.target.parentElement.className.match( /\d+/g ),
			newImage = e.target.cloneNode(),
			newImage2 = e.target.cloneNode();
		_writeU8( 'PET_BREED_OFFSET', tmp[ 0 ] );
		_writeU8( 'PET_BREED_VARIANT_OFFSET', tmp[ 1 ] );
		_writeU8( 'PET_BREED_COLOR_OFFSET', e.target.dataset.color );
		_writeU8( 'PET_BREED_EYE_COLOR_OFFSET', e.target.dataset.eye_color );
		_writeU8( 'PET_BREED_STYLE_OFFSET', e.target.dataset.style );
		newImage.id = 'petimage' + ( Number( get( 'menu' ).dataset.pet ) + 1 );
		document.getElementById( newImage.id ).replaceWith( newImage );
		document.querySelector( 'label[for="pet_tab' + ( Number( get( 'menu' ).dataset.pet ) + 1 ) + '"] .sprite' ).replaceWith( newImage2 );
		btnClose.click();
	}, false );
	btnClose.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		menu.close();
	}, false );
	sidebar_event( { target: document.getElementsByClassName( 'page-0-0' )[ 0 ] } );
}, false );
