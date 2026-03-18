/*
	The legend of Zelda: Breath of the wild v20180520
	by Marc Robledo 2017-2018
*/
var currentEditingItem=0;
var locationValues = {};

var shrines = {};
var towers = {};
var divineBeasts = {};
var remainingWarps = {};
var shrinesCompleted = 0;

SavegameEditor={
	Name:'The legend of Zelda: Breath of the wild',
	Filename:'game_data.sav',
	Version:20190625,

	/* Constants */
	Constants:{
		MAX_ITEMS:410,
		STRING_SIZE:0x80,

		//missing versions: 1.1.1, 1.1.2 and 1.4.1
		VERSION:				['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.3.1', 'Kiosk', 'v1.3.3','v1.3.4', 'v1.4',  'v1.5',  'v1.6',  'v1.6*', 'v1.6**','v1.6***'],
		FILESIZE:				[896976, 897160, 897112, 907824, 907824,  916576,  1020648, 1020648,   1027208, 1027208, 1027216, 1027216, 1027216, 1027216],
		HEADER:					[0x24e2, 0x24ee, 0x2588, 0x29c0, 0x2a46,  0x2f8e,  0x3ef8,  0x3ef9,    0x471a,  0x471b,  0x471e, 0x0f423d, 0x0f423e,0x0f423f],

		MAP_ICONS: 0x9383490e,
		MAP_POS: 0xea9def3f,
		ICON_TYPES:{SWORD: 27, BOW:28, SHIELD:29, POT:30, STAR:31, CHEST:32,SKULL:33,LEAF:34,TOWER:35}
	},

	/* Offsets */
	Hashes:[
		0x8a94e07a, 'KOROK_SEED_COUNTER',			
	],


	/* private functions */

	_searchHash:function(hash){
		for(var i=0x0c; i<tempFile.fileSize; i+=8)
			if(hash===tempFile.readU32(i))
				return i;
		return false;
	},

	_readFromHash:function(hash){
		var offset=this._searchHash(hash);
		if(typeof offset === 'number')
			return tempFile.readU32(offset+4);
		return false;
	},
	_writeValueAtHash:function(hash,val){
		var offset=this._searchHash(hash);
		if(typeof offset==='number')
			this._writeValue(offset+4,val);
	},

	_getOffsets:function(v){
		this.Offsets={};
		var startSearchOffset=0x0c;
		for(var i=0; i<this.Hashes.length; i+=2){
			for(var j=startSearchOffset; j<tempFile.fileSize; j+=8){
				if(this.Hashes[i]===tempFile.readU32(j)){
					this.Offsets[this.Hashes[i+1]]=j+4;
					startSearchOffset=j+8;
					break;
				}
			}
			/*if(typeof this.Offsets[this.Hashes[i+1]] === 'undefined'){
				console.log(this.Hashes[i+1]+' not found');
			}*/
		}
	},

	/* check if savegame is valid */
	_checkValidSavegameByConsole:function(switchMode){
		var CONSOLE=switchMode?'Switch':'Wii U';
		tempFile.littleEndian=switchMode;
		for(var i=0; i<this.Constants.FILESIZE.length; i++){
			var versionHash=tempFile.readU32(0);

			if(tempFile.fileSize===this.Constants.FILESIZE[i] && versionHash===this.Constants.HEADER[i] && tempFile.readU32(4)===0xffffffff){
				this._getOffsets(i);
				return true;
			}
		}

		return false
	},
	checkValidSavegame:function(){
		return this._checkValidSavegameByConsole(false) || this._checkValidSavegameByConsole(true);
	},


	preload:function(){
	},

	/* load function */
	load:function(){

		tempFile.fileName='game_data.sav';

		/* prepare viewer */
		setValue( 'span-number-koroks', tempFile.readU32( this.Offsets.KOROK_SEED_COUNTER ) );

		locationValues.notFound = {
			'koroks': {},
			'locations': {},
			'shrines': {},
			'towers': {},
			'divineBeasts': {},
		};

		locationValues.found = {
			'koroks': 0,
			'locations': 0,
			'shrines': 0,
			'towers': 0,
			'divineBeasts': 0,
		};

		// All Korok/Location Data filtered down to ones not found
		this._notFoundLocations( koroks, 'koroks' );
		this._notFoundLocations( locations, 'locations' );
		this._notFoundLocations( shrines, 'shrines' );
		this._notFoundLocations( towers, 'towers' );
		this._notFoundLocations( divineBeasts, 'divineBeasts' );
		var completedIndices = this._getCompletedShrineIndices( shrineCompletions );
		shrinesCompleted = Object.keys( completedIndices ).length;

		window.localStorage.setItem( 'botw-unexplored-viewer', JSON.stringify( locationValues ) );

		setValue( 'span-number-locations', locationValues.found.locations );
		setValue( 'span-number-total-locations', 226 );
		setValue( 'span-number-shrines', locationValues.found.shrines );
		setValue( 'span-number-total-shrines', Object.keys( shrines ).length );
		setValue( 'span-number-shrines-completed', shrinesCompleted );
		setValue( 'span-number-total-shrines-completed', Object.keys( shrineCompletions ).length );
		setValue( 'span-number-towers', locationValues.found.towers );
		setValue( 'span-number-total-towers', Object.keys( towers ).length );
		setValue( 'span-number-divine-beasts', locationValues.found.divineBeasts );
		setValue( 'span-number-total-divine-beasts', Object.keys( divineBeasts ).length );

		this.drawKorokPaths( locationValues.notFound.koroks );

		// Split shrines: completed (yellow) trumps discovered (cyan)
		var _discoveredShines = {}, _completedShrinesMap = {};
		for ( var _sh in shrines ) {
			var _idx = shrines[ _sh ].internal_name.replace( 'Location_Dungeon', '' );
			if ( completedIndices[ _idx ] ) { _completedShrinesMap[ _sh ] = shrines[ _sh ]; }
			else { _discoveredShines[ _sh ] = shrines[ _sh ]; }
		}

		this.markMap( locationValues.notFound.locations, 'location' );
		this.markMap( _discoveredShines, 'shrine' );
		this.markMap( _completedShrinesMap, 'shrine-completed' );
		this.markMap( towers, 'tower' );
		this.markMap( divineBeasts, 'divine-beast' );
		this.markMap( remainingWarps, 'warp' );
		this.markMap( locationValues.notFound.koroks, 'korok' );

		addWaypointListeners();
		applyHiddenStates();

	},

	// based on the load() method in https://github.com/marcrobledo/savegame-editors/blob/master/zelda-botw-master/zelda-botw-master.js
	_notFoundLocations:function( hashObjects, key = 'koroks' ) {

		tempFile.fileName='game_data.sav';

		var previousHashValue=0;
		for ( var offset = 0x0c; offset < tempFile.fileSize - 4; offset += 8 ) {

			var hashValue = tempFile.readU32( offset );

			if( hashValue === previousHashValue )
				continue;

			if ( hashObjects[ hashValue ] ) {

				if ( ! tempFile.readU32( offset + 4 ) ) {

					locationValues.notFound[ key ][ hashObjects[ hashValue ]['internal_name'] ] = {
						display_name: hashObjects[ hashValue ]['display_name'],
						x: hashObjects[ hashValue ]['x'],
						y: hashObjects[ hashValue ]['y'],
						offset: offset,
					};

				}
				else {

					locationValues.found[ key ]++;

				}

			}

			previousHashValue = hashValue;

		}

	},

	// Count how many entries in hashObjects have a non-zero save flag
	_countCompleted:function( hashObjects ) {
		var count = 0;
		var previousHashValue = 0;
		for ( var offset = 0x0c; offset < tempFile.fileSize - 4; offset += 8 ) {
			var hashValue = tempFile.readU32( offset );
			if ( hashValue === previousHashValue ) continue;
			if ( hashObjects[ hashValue ] ) {
				if ( tempFile.readU32( offset + 4 ) ) count++;
			}
			previousHashValue = hashValue;
		}
		return count;
	},

	// Returns an object mapping NNN → true for each Clear_DungeonNNN flag that is set
	_getCompletedShrineIndices:function( hashObjects ) {
		var indices = {};
		var previousHashValue = 0;
		for ( var offset = 0x0c; offset < tempFile.fileSize - 4; offset += 8 ) {
			var hashValue = tempFile.readU32( offset );
			if ( hashValue === previousHashValue ) continue;
			if ( hashObjects[ hashValue ] ) {
				if ( tempFile.readU32( offset + 4 ) ) {
					var idx = hashObjects[ hashValue ].internal_name.replace( 'Clear_Dungeon', '' );
					indices[ idx ] = true;
				}
			}
			previousHashValue = hashValue;
		}
		return indices;
	},

	// Mark the map with not found Koroks or Locations
	markMap( mapObjects, className ) {

		var map = document.getElementById( 'map-container' );

		for ( var internal_name in mapObjects ) {

			var waypoint = document.createElement( 'div' );

			waypoint.classList.add( 'waypoint' );
			waypoint.classList.add( className );
			waypoint.setAttribute( 'style', 'left: ' + ( 3000 + mapObjects[ internal_name ].x / 2 ) + 'px' + '; top: ' + ( 2500 + mapObjects[ internal_name ].y / 2 ) + 'px' );
			waypoint.id = internal_name;
			waypoint.setAttribute( 'data-display_name', mapObjects[ internal_name ].display_name );

			map.appendChild( waypoint );

		}

	},

	drawKorokPaths( notFoundKoroks ) {

		var group = document.getElementById( 'path-group' );

		for ( var internal_name in notFoundKoroks ) {

			if ( typeof korokPaths[ internal_name ] == 'undefined' ) continue;

			var points = korokPaths[ internal_name ].points;

			var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' ),
				d = '';

			for ( var index in points ) {

				if ( index == 0 ) {
					d = d + 'M ';
				}
				else {
					d = d + ' L';
				}

				d = d + ( 3000 + points[ index ].x/2 ) + ' ' + ( 2500 + points[ index ].y/2 );

			}

			path.setAttribute( 'd', d );

			path.setAttribute( 'class', 'line ' + internal_name );

			group.appendChild( path );

		}

	},

	/* save function */
	save:function(){
	}
}

function onScroll(){
	var h=document.getElementById('header-top').getBoundingClientRect().height;
	if(window.scrollY>h){
		document.getElementById('header').style.position='fixed';
		document.getElementById('header').style.top='-'+h+'px';
	}else{
		document.getElementById('header').style.position='fixed';
		document.getElementById('header').style.top='0px';
	}
}

window.addEventListener('load',function(){

	// Hide drag-and-drop zone immediately — save file is always auto-loaded from server
	hide('dragzone');

	// Split warps into shrines and towers — must run after map-locations.js is loaded
	for (var _warpHash in warps) {
		if (warps[_warpHash].internal_name.indexOf('Location_Dungeon') === 0) {
			shrines[_warpHash] = warps[_warpHash];
		} else if (warps[_warpHash].internal_name.indexOf('Location_MapTower') === 0) {
			towers[_warpHash] = warps[_warpHash];
		} else if (warps[_warpHash].internal_name.indexOf('Location_Remains') === 0) {
			divineBeasts[_warpHash] = warps[_warpHash];
		} else {
			remainingWarps[_warpHash] = warps[_warpHash];
		}
	}

	window.addEventListener('scroll',onScroll,false);

	// Fetch the save file from the server and re-render the map
	var lastMtime = null;
	function loadSaveFromServer() {
		fetch('/data/game_data.sav', { cache: 'no-store' })
			.then(function(response) {
				if (!response.ok) throw new Error('Save file not found');
				var mtime = parseFloat(response.headers.get('X-File-Mtime')) || null;
				return response.arrayBuffer().then(function(buf) { return { buf: buf, mtime: mtime }; });
			})
			.then(function(result) {
				removeAllWaypoints();
				loadSavegameFromArrayBuffer(result.buf, 'game_data.sav');
				lastMtime = result.mtime;
				if (result.mtime) updateSaveTimestamp(result.mtime);
			})
			.catch(function() {
				console.log('Waiting for save file...');
			});
	}

	// Set up toolbar hover highlighting — labels are always in DOM
	setupToolbarHover();

	// Initial load
	loadSaveFromServer();

	// Poll /api/mtime every 10 seconds; re-render only when the file has changed
	function pollMtime() {
		fetch('/api/mtime', { cache: 'no-store' })
			.then(function(r) { return r.json(); })
			.then(function(data) {
				setServerOnline(true);
				if (data.mtime) updateSaveTimestamp(data.mtime);
				if (data.mtime && data.mtime !== lastMtime) {
					loadSaveFromServer();
				}
			})
			.catch(function() {
				setServerOnline(false);
			});
	}
	pollMtime();
	setInterval(pollMtime, 10000);

	function setServerOnline(online) {
		var dot = document.getElementById('server-status-dot');
		if (dot) dot.className = 'server-status-dot ' + (online ? 'online' : 'offline');
	}

	function updateSaveTimestamp(mtime) {
		var el = document.getElementById('save-timestamp');
		if (!el) return;
		var d = new Date(mtime);
		var pad = function(n) { return n < 10 ? '0' + n : n; };
		el.innerHTML = pad(d.getMonth()+1) + '/' + pad(d.getDate()) + '/' + d.getFullYear()
			+ '<br>' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
	}

	// Empty data for a clear map
	document.getElementById( 'clear' ).addEventListener( 'click', function() {
		
		locationValues.notFound = {
			'koroks': {},
			'locations': {},
			'shrines': {},
			'towers': {},
			'divineBeasts': {},
		};

		locationValues.found = {
			'koroks': 0,
			'locations': 0,
			'shrines': 0,
			'towers': 0,
			'divineBeasts': 0,
		};

		for ( var hash in koroks ) {

			locationValues.notFound.koroks[ koroks[ hash ]['internal_name'] ] = {
				display_name: koroks[ hash ]['display_name'],
				x: koroks[ hash ]['x'],
				y: koroks[ hash ]['y'],
				offset: null, // Not loaded from a save
			};

		}

		for ( var hash in locations ) {

			locationValues.notFound.locations[ locations[ hash ]['internal_name'] ] = {
				display_name: locations[ hash ]['display_name'],
				x: locations[ hash ]['x'],
				y: locations[ hash ]['y'],
				offset: null, // Not loaded from a save
			};

		}

		window.localStorage.setItem( 'botw-unexplored-viewer', JSON.stringify( locationValues ) );

		setValue( 'span-number-koroks', locationValues.found.koroks );
		setValue( 'span-number-locations', locationValues.found.locations );
		setValue( 'span-number-total-locations', 226 );
		setValue( 'span-number-shrines', locationValues.found.shrines );
		setValue( 'span-number-total-shrines', Object.keys( shrines ).length );
		setValue( 'span-number-shrines-completed', 0 );
		setValue( 'span-number-total-shrines-completed', Object.keys( shrineCompletions ).length );
		setValue( 'span-number-towers', locationValues.found.towers );
		setValue( 'span-number-total-towers', Object.keys( towers ).length );
		setValue( 'span-number-divine-beasts', locationValues.found.divineBeasts );
		setValue( 'span-number-total-divine-beasts', Object.keys( divineBeasts ).length );

		SavegameEditor.drawKorokPaths( locationValues.notFound.koroks );

		SavegameEditor.markMap( locationValues.notFound.locations, 'location' );
		SavegameEditor.markMap( shrines, 'shrine' );
		SavegameEditor.markMap( towers, 'tower' );
		SavegameEditor.markMap( divineBeasts, 'divine-beast' );
		SavegameEditor.markMap( remainingWarps, 'warp' );
		SavegameEditor.markMap( locationValues.notFound.koroks, 'korok' );

		hide('dragzone');
		show('the-editor');
		show('toolbar', 'flex');

		addWaypointListeners();
		applyHiddenStates();

	} );

}, false);

// Toolbar label hover — highlight matching map icons
function setupToolbarHover() {
	[].forEach.call( document.querySelectorAll( '#toolbar label[data-type]' ), function( label ) {
		var type = label.getAttribute( 'data-type' );
		label.addEventListener( 'mouseenter', function() {
			[].forEach.call( document.querySelectorAll( '.waypoint.' + type ), function( wp ) {
				wp.classList.add( 'highlighted' );
			} );
		} );
		label.addEventListener( 'mouseleave', function() {
			[].forEach.call( document.querySelectorAll( '.waypoint.highlighted' ), function( wp ) {
				wp.classList.remove( 'highlighted' );
			} );
		} );
		label.addEventListener( 'click', function() {
			var isHidden = label.getAttribute( 'data-hidden' ) === 'true';
			if ( isHidden ) {
				label.removeAttribute( 'data-hidden' );
				[].forEach.call( document.querySelectorAll( '.waypoint.' + type ), function( wp ) {
					wp.style.display = '';
				} );
			} else {
				label.setAttribute( 'data-hidden', 'true' );
				[].forEach.call( document.querySelectorAll( '.waypoint.' + type ), function( wp ) {
					wp.style.display = 'none';
				} );
			}
		} );
	} );
}

// Re-apply hidden states after waypoints are recreated on reload
function applyHiddenStates() {
	[].forEach.call( document.querySelectorAll( '#toolbar label[data-hidden="true"]' ), function( label ) {
		var type = label.getAttribute( 'data-type' );
		[].forEach.call( document.querySelectorAll( '.waypoint.' + type ), function( wp ) {
			wp.style.display = 'none';
		} );
	} );
}

// Add event Listeners for Waypoints
function addWaypointListeners() {

	[].forEach.call( document.querySelectorAll( '.waypoint:not(.warp)' ), function( element ) {
		element.addEventListener( 'click', function() {
			removeWaypoint( element );
		} );
	} );

}

// Remove an individual Waypoint and save that change in localStorage
function removeWaypoint( element ) {

	var type;

	if ( element.classList.contains( 'korok' ) ) {
		type = 'koroks';
	}
	else {
		type = 'locations';
	}

	delete locationValues.notFound[ type ][ element.id ];

	locationValues.found[ type ]++;

	setValue( 'span-number-' + type, locationValues.found[ type ] );

	window.localStorage.setItem( 'botw-unexplored-viewer', JSON.stringify( locationValues ) );

	element.remove();

	if ( type == 'koroks' ) {

		// Remove lines when necessary
		[].forEach.call( document.querySelectorAll( '.line.' + element.id ), function( line ) {
			line.remove();
		} );

	}

}

// Remove all Waypoints
function removeAllWaypoints() {

	[].forEach.call( document.querySelectorAll( '.waypoint, .line' ), function( element ) {
		element.remove();
	} );

}

// Map pan and zoom functionality
(function() {
	var scale = 1;
	var panX = 0;
	var panY = 0;
	var isPanning = false;
	var startX = 0;
	var startY = 0;
	var mapContainer = null;
	var mapViewport = null;

	function initMapPanZoom() {
		mapViewport = document.getElementById('map-viewport');
		mapContainer = document.getElementById('map-container');

		if (!mapViewport || !mapContainer) return;

		// Calculate zoom limits based on map dimensions (6000x5000px) vs viewport
		var mapWidth = 6000;
		var mapHeight = 5000;
		var viewportWidth = mapViewport.clientWidth || window.innerWidth;
		var viewportHeight = mapViewport.clientHeight || (window.innerHeight);
		var minZoom = Math.min(viewportWidth / mapWidth, viewportHeight / mapHeight);
		var maxZoom = mapHeight / viewportHeight;

		// Wrap map-container in viewport if not already
		if (mapContainer.parentElement !== mapViewport) {
			mapViewport.appendChild(mapContainer);
		}

		// Start fully zoomed out
		scale = minZoom;
		panX = 0;
		panY = 0;
		updateTransform();

		// Mouse wheel for zoom
		mapViewport.addEventListener('wheel', function(e) {
			e.preventDefault();

			var zoomFactor = 0.1;
			var delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
			var newScale = Math.max(minZoom, Math.min(maxZoom, scale + delta));

			// Zoom toward mouse position
			var rect = mapViewport.getBoundingClientRect();
			var mouseX = e.clientX - rect.left;
			var mouseY = e.clientY - rect.top;

			// Calculate the point in map coordinates before zoom
			var mapX = (mouseX - panX) / scale;
			var mapY = (mouseY - panY) / scale;

			// Calculate new pan to keep mouse position stable
			panX = mouseX - mapX * newScale;
			panY = mouseY - mapY * newScale;

			scale = newScale;
			updateTransform();
		}, { passive: false });

		// Middle mouse button for pan
		mapViewport.addEventListener('mousedown', function(e) {
			if (e.button === 1) { // Middle mouse button
				e.preventDefault();
				isPanning = true;
				startX = e.clientX - panX;
				startY = e.clientY - panY;
				mapViewport.style.cursor = 'grabbing';
			}
		});

		document.addEventListener('mousemove', function(e) {
			if (isPanning) {
				panX = e.clientX - startX;
				panY = e.clientY - startY;
				updateTransform();
			}
		});

		document.addEventListener('mouseup', function(e) {
			if (e.button === 1 && isPanning) {
				isPanning = false;
				mapViewport.style.cursor = 'default';
			}
		});

		// Prevent context menu on middle click
		mapViewport.addEventListener('contextmenu', function(e) {
			if (e.button === 1) {
				e.preventDefault();
			}
		});
	}

	function updateTransform() {
		// Calculate bounds to prevent showing blank space around map edges
		var mapWidth = 6000;
		var mapHeight = 5000;
		var viewportWidth = mapViewport.clientWidth || window.innerWidth;
		var viewportHeight = mapViewport.clientHeight || (window.innerHeight);
		var scaledMapWidth = mapWidth * scale;
		var scaledMapHeight = mapHeight * scale;

		// Calculate min/max pan values
		var maxPanX = 0;
		var maxPanY = 0;
		var minPanX = viewportWidth - scaledMapWidth;
		var minPanY = viewportHeight - scaledMapHeight;

		// If map fits entirely in viewport, center it
		if (scaledMapWidth < viewportWidth) {
			minPanX = maxPanX = (viewportWidth - scaledMapWidth) / 2;
		}
		if (scaledMapHeight < viewportHeight) {
			minPanY = maxPanY = (viewportHeight - scaledMapHeight) / 2;
		}

		// Clamp pan values
		panX = Math.min(maxPanX, Math.max(minPanX, panX));
		panY = Math.min(maxPanY, Math.max(minPanY, panY));

		mapContainer.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initMapPanZoom);
	} else {
		initMapPanZoom();
	}
})();