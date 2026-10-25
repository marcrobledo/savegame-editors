/*
	The Legend of Zelda: Breath of the Wild - Shrines Tracker
	Integrates with Marc Robledo's Savegame Editor
*/

var BOTWShrines = {
	shrines: [],
	offsets: {},
	filterText: '',
	filterRegion: '',
	filterStatus: 'all',

	init: function() {
		this.shrines = (typeof BOTW_SHRINES !== 'undefined') ? BOTW_SHRINES : [];
	},

	// Read shrine flags from tempFile
	load: function() {
		this.init();
		this.offsets = {};

		// Build fast hash lookup map for tempFile
		var hashOffsetMap = new Map();
		for (var offset = 0x0c; offset <= tempFile.fileSize - 8; offset += 8) {
			var h = tempFile.readU32(offset);
			hashOffsetMap.set(h, offset + 4);
		}

		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			var clearOffset = hashOffsetMap.get(s.clearHash);
			var locOffset = hashOffsetMap.get(s.locHash);

			s.clearOffset = clearOffset || null;
			s.locOffset = locOffset || null;

			// Read current values
			s.isCleared = clearOffset ? (tempFile.readU32(clearOffset) === 1) : false;
			s.locValue = locOffset ? tempFile.readU32(locOffset) : 0;
			s.isDiscovered = s.locValue > 0 || s.isCleared;
		}

		this.populateRegionDropdown();
		this.render();
		this.updateStats();
	},

	populateRegionDropdown: function() {
		var select = document.getElementById('shrines-region-select');
		if (!select || select.children.length > 1) return;

		var regions = [];
		for (var i = 0; i < this.shrines.length; i++) {
			if (!regions.includes(this.shrines[i].region)) {
				regions.push(this.shrines[i].region);
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

	// Write changes back to tempFile
	save: function() {
		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			var chk = document.getElementById('shrine-chk-' + s.id);
			if (chk) {
				s.isCleared = chk.checked;
			}

			if (s.clearOffset) {
				tempFile.writeU32(s.clearOffset, s.isCleared ? 1 : 0);
			}

			// If marked completed and location is 0, bump location flag so game marks it discovered
			if (s.isCleared && s.locOffset) {
				var currentLoc = tempFile.readU32(s.locOffset);
				if (currentLoc === 0) {
					tempFile.writeU32(s.locOffset, 1);
				}
			}
		}
	},

	updateStats: function() {
		var baseCompleted = 0;
		var baseTotal = 0;
		var dlcCompleted = 0;
		var dlcTotal = 0;

		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			if (s.dlc) {
				dlcTotal++;
				if (s.isCleared) dlcCompleted++;
			} else {
				baseTotal++;
				if (s.isCleared) baseCompleted++;
			}
		}

		var totalCompleted = baseCompleted + dlcCompleted;
		var totalShrines = baseTotal + dlcTotal;

		var elBase = document.getElementById('shrines-stat-base');
		var elDlc = document.getElementById('shrines-stat-dlc');
		var elTotal = document.getElementById('shrines-stat-total');
		var elPercent = document.getElementById('shrines-stat-percent');

		if (elBase) elBase.innerText = baseCompleted + ' / ' + baseTotal;
		if (elDlc) elDlc.innerText = dlcCompleted + ' / ' + dlcTotal;
		if (elTotal) elTotal.innerText = totalCompleted + ' / ' + totalShrines;
		if (elPercent) elPercent.innerText = Math.round((totalCompleted / totalShrines) * 100) + '%';
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
			if (status === 'dlc' && !s.dlc) continue;
			if (status === 'base' && s.dlc) continue;

			// Search query
			if (query) {
				var match = s.name.toLowerCase().includes(query) ||
					s.id.toLowerCase().includes(query) ||
					s.region.toLowerCase().includes(query) ||
					s.trial.toLowerCase().includes(query) ||
					(s.quest && s.quest.toLowerCase().includes(query));
				if (!match) continue;
			}

			visibleCount++;

			var card = document.createElement('div');
			card.className = 'shrine-card' + (s.isCleared ? ' completed' : ' uncompleted') + (s.dlc ? ' is-dlc' : '');
			card.id = 'shrine-card-' + s.id;

			var badgeDlc = s.dlc ? '<span class="shrine-badge dlc">DLC</span>' : '';
			var badgeQuest = s.quest ? '<span class="shrine-badge quest" title="Quest: ' + s.quest.replace(/"/g, '&quot;') + '">Quest</span>' : '';
			var statusBadge = s.isCleared ? '<span class="shrine-status-tag clear">Completed</span>' : '<span class="shrine-status-tag pending">Incomplete</span>';

			card.innerHTML = 
				'<div class="shrine-main-info">' +
					'<label class="shrine-checkbox-wrapper">' +
						'<input type="checkbox" id="shrine-chk-' + s.id + '" ' + (s.isCleared ? 'checked' : '') + ' onchange="BOTWShrines.toggleShrine(\'' + s.id + '\', this.checked)">' +
						'<span class="shrine-checkmark"></span>' +
					'</label>' +
					'<div class="shrine-names">' +
						'<div class="shrine-title">' + s.name + ' ' + badgeDlc + badgeQuest + '</div>' +
						'<div class="shrine-subtitle">' + (s.trial ? 'Trial: ' + s.trial : s.monk) + ' &bull; <span class="shrine-region-name">' + s.region + '</span> <span class="shrine-id-tag">[' + s.id + ']</span></div>' +
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

	setAll: function(state, dlcOnly) {
		for (var i = 0; i < this.shrines.length; i++) {
			var s = this.shrines[i];
			if (dlcOnly === true && !s.dlc) continue;
			if (dlcOnly === false && s.dlc) continue;

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
