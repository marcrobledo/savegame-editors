/*
	The Legend of Zelda: Tears of the Kingdom - Shrines Tracker
	Integrates with Marc Robledo's Savegame Editor
*/

var TOTKShrines = {
	shrines: [],
	filterText: '',
	filterRegion: '',
	filterStatus: 'all',
	initialized: false,

	init: function() {
		this.shrines = (typeof TOTK_SHRINES !== 'undefined') ? TOTK_SHRINES : [];
	},

	/* Read shrine states from tempFile */
	load: function() {
		this.init();

		var clearHash = 1654019904; // MurmurHash3('Clear')
		var openHash = 404286466;   // MurmurHash3('Open')

		// Gather all status and visit hashes to query offsets in one pass
		var allHashes = [];
		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			if (s.statusHash) allHashes.push(s.statusHash);
			if (s.visitHash) allHashes.push(s.visitHash);
		}

		var offsets = SavegameEditor._getOffsetsByHashes(allHashes);

		for (var j = 0; j < this.shrines.length; j++) {
			var item = this.shrines[j];
			item.statusOffset = offsets[item.statusHash] || null;
			item.visitOffset = offsets[item.visitHash] || null;

			var statusVal = item.statusOffset ? tempFile.readU32(item.statusOffset) : 0;
			var visitVal = item.visitOffset ? tempFile.readU32(item.visitOffset) : 0;

			item.statusVal = statusVal;
			item.isCleared = (statusVal === clearHash);
			item.isDiscovered = (visitVal === 1 || statusVal === clearHash || statusVal === openHash);
		}

		this.populateRegionDropdown();
		this.render();
		this.updateStats();
		this.initialized = true;
	},

	populateRegionDropdown: function() {
		var select = document.getElementById('shrines-region-select');
		if (!select || select.children.length > 1) return;

		var regions = [];
		for (var i = 0; i < this.shrines.length; i++) {
			var r = this.shrines[i].region;
			if (r && !regions.includes(r)) {
				regions.push(r);
			}
		}
		regions.sort();
		for (var j = 0; j < regions.length; j++) {
			var opt = document.createElement('option');
			opt.value = regions[j];
			opt.innerText = regions[j];
			select.appendChild(opt);
		}
	},

	/* Write shrine states back to tempFile */
	save: function() {
		var clearHash = 1654019904; // 'Clear'
		var openHash = 404286466;   // 'Open'

		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			var chk = document.getElementById('shrine-chk-' + s.id);
			if (chk) {
				s.isCleared = chk.checked;
			}

			if (s.statusOffset) {
				var currentStatus = tempFile.readU32(s.statusOffset);
				if (s.isCleared) {
					tempFile.writeU32(s.statusOffset, clearHash);
					// Also ensure discovered/visit flag is set
					if (s.visitOffset) {
						tempFile.writeU32(s.visitOffset, 1);
					}
				} else {
					// If was cleared, downgrade to Open so player doesn't lose discovery
					if (currentStatus === clearHash) {
						tempFile.writeU32(s.statusOffset, openHash);
					}
				}
			}
		}

		// Refresh completion counters
		if (typeof SavegameEditor.refreshCounterShrinesFound === 'function') {
			SavegameEditor.refreshCounterShrinesFound();
		}
		if (typeof SavegameEditor.refreshCounterShrinesClear === 'function') {
			SavegameEditor.refreshCounterShrinesClear();
		}
	},

	updateStats: function() {
		var surfaceCompleted = 0;
		var surfaceTotal = 0;
		var skyCompleted = 0;
		var skyTotal = 0;

		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			if (s.isSky) {
				skyTotal++;
				if (s.isCleared) skyCompleted++;
			} else {
				surfaceTotal++;
				if (s.isCleared) surfaceCompleted++;
			}
		}

		var totalCompleted = surfaceCompleted + skyCompleted;
		var totalShrines = surfaceTotal + skyTotal;

		var elTotal = document.getElementById('shrines-stat-total');
		var elSurface = document.getElementById('shrines-stat-surface');
		var elSky = document.getElementById('shrines-stat-sky');
		var elPercent = document.getElementById('shrines-stat-percent');

		if (elTotal) elTotal.innerText = totalCompleted + ' / ' + totalShrines;
		if (elSurface) elSurface.innerText = surfaceCompleted + ' / ' + surfaceTotal;
		if (elSky) elSky.innerText = skyCompleted + ' / ' + skyTotal;
		if (elPercent) elPercent.innerText = (totalShrines > 0 ? Math.round((totalCompleted / totalShrines) * 100) : 0) + '%';
	},

	render: function() {
		var list = document.getElementById('shrines-list');
		if (!list) return;

		list.innerHTML = '';

		var query = this.filterText.toLowerCase().trim();
		var region = this.filterRegion;
		var status = this.filterStatus;

		var visibleCount = 0;

		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];

			// Region filter
			if (region && s.region !== region) continue;

			// Status filter
			if (status === 'completed' && !s.isCleared) continue;
			if (status === 'uncompleted' && s.isCleared) continue;
			if (status === 'surface' && s.isSky) continue;
			if (status === 'sky' && !s.isSky) continue;

			// Search query
			if (query) {
				var match = s.name.toLowerCase().includes(query) ||
					s.id.toLowerCase().includes(query) ||
					s.region.toLowerCase().includes(query) ||
					(s.trial && s.trial.toLowerCase().includes(query));
				if (!match) continue;
			}

			visibleCount++;

			var card = document.createElement('div');
			card.className = 'shrine-card' + (s.isCleared ? ' completed' : ' uncompleted') + (s.isSky ? ' is-sky' : '');
			card.id = 'shrine-card-' + s.id;

			var badgeSky = s.isSky ? '<span class="shrine-badge sky">SKY</span>' : '<span class="shrine-badge surface">SURFACE</span>';
			var statusBadge = s.isCleared ? '<span class="shrine-status-tag clear">Completed</span>' : '<span class="shrine-status-tag pending">Incomplete</span>';

			card.innerHTML = 
				'<div class="shrine-main-info">' +
					'<label class="shrine-checkbox-wrapper">' +
						'<input type="checkbox" id="shrine-chk-' + s.id + '" ' + (s.isCleared ? 'checked' : '') + ' onchange="TOTKShrines.toggleShrine(\'' + s.id + '\', this.checked)">' +
						'<span class="shrine-checkmark"></span>' +
					'</label>' +
					'<div class="shrine-names">' +
						'<div class="shrine-title">' + s.name + ' ' + badgeSky + '</div>' +
						'<div class="shrine-subtitle">' + (s.trial ? s.trial : 'Shrine of Light') + ' &bull; <span class="shrine-region-name">' + s.region + '</span> <span class="shrine-id-tag">[' + s.id + ']</span></div>' +
					'</div>' +
				'</div>' +
				'<div class="shrine-actions">' +
					statusBadge +
				'</div>';

			list.appendChild(card);
		}

		var countEl = document.getElementById('shrines-visible-count');
		if (countEl) {
			countEl.innerText = visibleCount + ' shrine' + (visibleCount === 1 ? '' : 's') + ' shown';
		}
	},

	toggleShrine: function(id, checked) {
		var s = this.shrines.find(function(item) { return item.id === id; });
		if (s) {
			s.isCleared = checked;
			var card = document.getElementById('shrine-card-' + s.id);
			if (card) {
				if (checked) {
					card.classList.remove('uncompleted');
					card.classList.add('completed');
					var tag = card.querySelector('.shrine-status-tag');
					if (tag) {
						tag.className = 'shrine-status-tag clear';
						tag.innerText = 'Completed';
					}
				} else {
					card.classList.remove('completed');
					card.classList.add('uncompleted');
					var tag = card.querySelector('.shrine-status-tag');
					if (tag) {
						tag.className = 'shrine-status-tag pending';
						tag.innerText = 'Incomplete';
					}
				}
			}
			this.updateStats();
		}
	},

	setAll: function(state, skyFilter) {
		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			if (skyFilter === 'sky' && !s.isSky) continue;
			if (skyFilter === 'surface' && s.isSky) continue;

			s.isCleared = state;
			var chk = document.getElementById('shrine-chk-' + s.id);
			if (chk) chk.checked = state;

			var card = document.getElementById('shrine-card-' + s.id);
			if (card) {
				if (state) {
					card.classList.remove('uncompleted');
					card.classList.add('completed');
					var tag = card.querySelector('.shrine-status-tag');
					if (tag) {
						tag.className = 'shrine-status-tag clear';
						tag.innerText = 'Completed';
					}
				} else {
					card.classList.remove('completed');
					card.classList.add('uncompleted');
					var tag = card.querySelector('.shrine-status-tag');
					if (tag) {
						tag.className = 'shrine-status-tag pending';
						tag.innerText = 'Incomplete';
					}
				}
			}
		}
		this.updateStats();
	},

	onSearchInput: function(val) {
		this.filterText = val;
		this.render();
	},

	onRegionSelect: function(val) {
		this.filterRegion = val;
		this.render();
	},

	onStatusSelect: function(val) {
		this.filterStatus = val;
		this.render();
	}
};
