var spriteBaseURL = 'https://www.spriters-resource.com/resources/sheets/112/%0.png';
var spriteBaseURLLocal = 'sprites/%0.png';
var useLocal = false;
var spriteData = {
	// Dogs
	basset_hound: {sprite_id: '114733', row: 6},
	beagle: {sprite_id: '114732', row: 6},
	boxer: {sprite_id: '114888', row: 6},
	bull_terrier: {sprite_id: '114889', row: 6},
	chihuahua: {sprite_id: '114890', row: 6},
	chihuahua1: {sprite_id: '114890', row: 2},
	cocker_spaniel: {sprite_id: '114893', row: 5},
	dalmatian: {sprite_id: '114891', row: 6},
	french_bulldog: {sprite_id: '114892', row: 5},
	german_shepherd_dog: {sprite_id: '114896', row: 6},
	golden_retriever: {sprite_id: '114737', row: 6},
	great_dane: {sprite_id: '114895', row: 6},
	jack_russell_terrier: {sprite_id: '114898', row: 6},
	labrador_retriever: {sprite_id: '114900', row: 5},
	labrador_retriever1: {sprite_id: '114900', row: 1},
	maltese: {sprite_id: '114734', row: 6},
	miniature_dachshund: {sprite_id: '114902', row: 5},
	miniature_dachshund1: {sprite_id: '114902', row: 1},
	miniature_pinscher: {sprite_id: '114903', row: 5},
	miniature_schnauzer: {sprite_id: '114904', row: 5},
	miniature_schnauzer1: {sprite_id: '114904', row: 1},
	pembroke_welsh_corgi: {sprite_id: '114899', row: 6},
	pomeranian: {sprite_id: '114907', row: 6},
	pomeranian1: {sprite_id: '114907', row: 1},
	pug: {sprite_id: '114906', row: 5},
	robo_pup: {sprite_id: '114735', row: 5},
	shetland_sheepdog: {sprite_id: '114912', row: 6},
	shiba: {sprite_id: '114908', row: 5},
	shih_tzu: {sprite_id: '114909', row: 5},
	siberian_husky: {sprite_id: '114897', row: 6},
	spaniel: {sprite_id: '114901', row: 5},
	toy_poodle: {sprite_id: '114905', row: 5},
	toy_poodle1: {sprite_id: '114905', row: 1},
	yorkshire_terrier: {sprite_id: '114736', row: 6},
	// Cats
	standard: {sprite_id: '114911', row: 6},
	oriental: {sprite_id: '114910', row: 6},
	longhair: {sprite_id: '114894', row: 18}
};
window.spriteData = spriteData;

var _writeU8 = function(variable, value) {
	tempFile.writeU8(
		SavegameEditor.Constants.PET_OFFSET[get('menu').dataset.pet]+SavegameEditor.Constants[variable],
		Number(value)
	);
};

window.addEventListener('load', function() {
	'use strict';
	const btnClose = document.getElementById('menu-close'),
		menu = document.getElementById('menu'),
		sidebar_dog = document.getElementById('menu-sidebar-dog'),
		sidebar_cat = document.getElementById('menu-sidebar-cat'),
		content = document.getElementById('menu-content'),
		eyecolor = document.getElementById('eyecolor');

	var sidebar_event = function(e) {
		if (!e.target || !e.target.className || !e.target.className.startsWith('page-')) {return;}
		var old = sidebar_dog.querySelector('div[open]');
		if (old) {
			old.removeAttribute('open');
			content.querySelector('.' + old.className).style.display = 'none';
		}
		old = sidebar_cat.querySelector('div[open]');
		if (old) {
			old.removeAttribute('open');
			content.querySelector('.' + old.className).style.display = 'none';
		}
		var tmp = e.target.className.match(/\d+/g);
		if (tmp[0] >= 29 && tmp[0] <= 31) {
			menu.dataset.type = 'cat';
		} else {
			menu.dataset.type = 'dog';
		}
		e.target.setAttribute('open', true);
		var eye_color_offset = 255;
		if (menu.dataset.type === 'cat')
			eye_color_offset = Number(document.getElementById('eyecolor').querySelector(':checked').dataset.offset);
		var newContent = content.querySelector('.' + e.target.className);
		if (newContent && menu.dataset.type === 'cat') {
			newContent.parentElement.removeChild(newContent);
			newContent = undefined;
		}
		if (!newContent) {
			newContent = document.createElement('div');
			newContent.className = e.target.className;
			var offset = Number(e.target.getAttribute('image-offset'));
			var sD = spriteData[e.target.getAttribute('breed')];
			var offX = -4;
			var offY = -4 - 68 * Math.ceil(offset / sD.row);
			var color = 0;
			var style = 0;
			var i_max = offset+Number(e.target.getAttribute('image-items'));
			var correctionXOffset = 0;
			var correctionYOffset = 0;
			for (var i = offset; i<i_max; i++) {
				if (newContent.className === 'page-9-1' && color === 2) { // Fix for Labrador Retriever - Black
					correctionYOffset = 68;
				} else if (newContent.className === 'page-17-22') { // Fix for German Shepherd Dog - White
					correctionXOffset = 340;
				} else if (newContent.className === 'page-14-2') { // Fix for Miniature Schnauzer - Surprise Me #1
					if (i === 12) { // Correct image 1
						correctionYOffset = 68 * 3;
					} else if (i === 13) { // Correct image 2
						correctionYOffset = 68 * 7;
					} else if (i === 14 || i === 15 || i === 16) { // Correct images 3, 4 and 5
						correctionYOffset = -(68 * 2);
					}
				} else if (newContent.className === 'page-14-12') { // Fix for Miniature Schnauzer - Surprise Me #2
					if (i === 21) { // Correct image 5
						correctionYOffset = 0;
					} else {
						correctionYOffset = -68;
					}
				}
				if (menu.dataset.type === 'dog' || (i-offset) % 3 === eye_color_offset) {
					var ele = document.createElement('div');
					var baseURL = useLocal && spriteBaseURLLocal || spriteBaseURL;
					ele.style.backgroundImage = 'url(' + baseURL.replaceAll('%0', sD.sprite_id) + ')';
					ele.className = 'sprite';
					ele.dataset.color = color;
					ele.dataset.eye_color = eye_color_offset;
					ele.dataset.style = style;
					ele.style.backgroundPosition = (offX - correctionXOffset) + 'px ' + (offY - correctionYOffset) + 'px';
					newContent.appendChild(ele);
					style++;
				}
				offX -= 68;
				if (((i-offset) > 0 || sD.row === 1) && (i-offset) % sD.row == sD.row-1) {
					offX = -4;
					offY -= 68;
				}
				if (style >= (e.target.dataset.percolor || 6)) {
					color++;
					style=0;
				}
			}
			newContent.style.width = 74 * (e.target.dataset.percolor || 6) + 'px';
			content.appendChild(newContent);
		} else {
			newContent.style.removeProperty('display');
		}
		e.target.scrollIntoViewIfNeeded();
		
	};
	window._sidebar_event = sidebar_event;
	sidebar_dog.addEventListener('click', sidebar_event, false);
	sidebar_cat.addEventListener('click', sidebar_event, false);
	eyecolor.addEventListener('change', function(e) {
		sidebar_cat.querySelector('[open]').click();
	}, false);

	content.addEventListener('click', function(e) {
		if (!e.target.className.includes('sprite')) {return;}
		var tmp = e.target.parentElement.className.match(/\d+/g);
		_writeU8('PET_BREED_OFFSET', tmp[0]);
		_writeU8('PET_BREED_VARIANT_OFFSET', tmp[1]);
		_writeU8('PET_BREED_COLOR_OFFSET', e.target.dataset.color);
		_writeU8('PET_BREED_EYE_COLOR_OFFSET', e.target.dataset.eye_color);
		_writeU8('PET_BREED_STYLE_OFFSET',e.target.dataset.style);
		var newImage = e.target.cloneNode();
		var newImage2 = e.target.cloneNode();
		newImage.id = 'petimage' + (Number(get('menu').dataset.pet)+1);
		document.getElementById(newImage.id).replaceWith(newImage);
		document.querySelector('label[for="pet_tab' + (Number(get('menu').dataset.pet)+1) + '"] .sprite').replaceWith(newImage2);
		btnClose.click();
	}, false);
	btnClose.addEventListener('click', function(e) {
		e.preventDefault();
		menu.close();
	}, false);
	sidebar_event({target: document.getElementsByClassName('page-0-0')[0]});
}, false);
