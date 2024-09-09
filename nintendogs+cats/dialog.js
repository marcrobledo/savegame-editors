var spriteData = {
	beagle: {path: './dogs/beagle.png', row: 6},
	golden_retriever: {path: './dogs/golden_retriever.png', row: 6},
	yorkshire_terrier: {path: './dogs/yorkshire_terrier.png', row: 6},
	miniature_dachshund: {path: './dogs/miniature_dachshund.png', row: 5},
	miniature_dachshund1: {path: './dogs/miniature_dachshund.png', row: 1},
	chihuahua: {path: './dogs/chihuahua.png', row: 6},
	chihuahua1: {path: './dogs/chihuahua.png', row: 2},
	toy_poodle: {path: './dogs/toy_poodle.png', row: 5},
	toy_poodle1: {path: './dogs/toy_poodle.png', row: 1},
	shiba: {path: './dogs/shiba.png', row: 5},
	labrador_retriever: {path: './dogs/labrador_retriever.png', row: 5},
	labrador_retriever1: {path: './dogs/labrador_retriever.png', row: 1},
	spaniel: {path: './dogs/spaniel.png', row: 5},
	pug: {path: './dogs/pug.png', row: 5},
	shih_tzu: {path: './dogs/shih_tzu.png', row: 5},
	shetland_sheepdog: {path: './dogs/shetland_sheepdog.png', row: 6},
	miniature_schnauzer: {path: './dogs/miniature_schnauzer.png', row: 5},
	miniature_schnauzer1: {path: './dogs/miniature_schnauzer.png', row: 1},
	pembroke_welsh_corgi: {path: './dogs/pembroke_welsh_corgi.png', row: 6},
	miniature_pinscher: {path: './dogs/miniature_pinscher.png', row: 5},
	german_shepherd_dog: {path: './dogs/german_shepherd_dog.png', row: 6},
	jack_russell_terrier: {path: './dogs/jack_russell_terrier.png', row: 6},
	siberian_husky: {path: './dogs/siberian_husky.png', row: 6},
	boxer: {path: './dogs/boxer.png', row: 6},
	dalmatian: {path: './dogs/dalmatian.png', row: 6},
	pomeranian: {path: './dogs/pomeranian.png', row: 6},
	pomeranian1: {path: './dogs/pomeranian.png', row: 1},
	french_bulldog: {path: './dogs/french_bulldog.png', row: 5},
	cocker_spaniel: {path: './dogs/cocker_spaniel.png', row: 5},
	maltese: {path: './dogs/maltese.png', row: 6},
	great_dane: {path: './dogs/great_dane.png', row: 6},
	bull_terrier: {path: './dogs/bull_terrier.png', row: 6},
	basset_hound: {path: './dogs/basset_hound.png', row: 6},
	robo_pup: {path: './dogs/robo_pup.png', row: 5}
}
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
		sidebar = document.getElementById('menu-sidebar'),
		content = document.getElementById('menu-content');

	var sidebar_event = function(e) {
		if (!e.target.className.startsWith('page-')) {return;}
		var old = sidebar.querySelector('div[open]');
		if (old) {
			old.removeAttribute('open');
			content.querySelector('.' + old.className).style.display = 'none';
		}
		e.target.setAttribute('open', true);
		var newContent = content.querySelector('.' + e.target.className);
		if (!newContent) {
			newContent = document.createElement('div');
			newContent.className = e.target.className;
			var offset = Number(e.target.getAttribute('image-offset'));
			var sD = spriteData[e.target.getAttribute('breed')];
			var offX = -4;
			var offY = -4 - 68*Math.ceil(offset / sD.row);
			var color = 0;
			var style = 0;
			for (var i = offset; i<offset+Number(e.target.getAttribute('image-items')); i++) {
				var ele = document.createElement('div');
				ele.style.backgroundImage = 'url(' + sD.path + ')';
				ele.className = 'sprite';
				ele.dataset.color = color;
				ele.dataset.style = style;
				ele.style.backgroundPosition = offX + 'px ' + offY + 'px';
				newContent.appendChild(ele);
				offX -= 68;
				style++;
				if (((i-offset) > 0 || sD.row === 1) && (i-offset) % sD.row == sD.row-1) {
					offX = -4;
					offY -= 68;
					color++;
					style=0;
				}
			}
			newContent.style.width = 74 * sD.row;
			content.appendChild(newContent);
		} else {
			newContent.style.removeProperty('display');
		}
		e.target.scrollIntoViewIfNeeded();
		
	};
	window._sidebar_event = sidebar_event;
	sidebar.addEventListener('click', sidebar_event, false);
	content.addEventListener('click', function(e) {
		if (!e.target.className.includes('sprite')) {return;}
		var tmp = e.target.parentElement.className.match(/\d+/g);
		_writeU8('PET_BREED_OFFSET', tmp[0]);
		_writeU8('PET_BREED_VARIANT_OFFSET', tmp[1]);
		_writeU8('PET_BREED_COLOR_OFFSET', e.target.dataset.color);
		_writeU8('PET_BREED_STYLE_OFFSET',e.target.dataset.style);
		var newImage = e.target.cloneNode();
		newImage.id = 'petimage' + (Number(get('menu').dataset.pet)+1);
		document.getElementById(newImage.id).replaceWith(newImage);
		btnClose.click();
	}, false);
	btnClose.addEventListener('click', function(e) {
		e.preventDefault();
		menu.close();
	}, false);
	sidebar_event({target: document.getElementsByClassName('page-0-0')[0]});
}, false);
