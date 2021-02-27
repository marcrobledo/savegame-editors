/*
    Clipboard used to store and loading item data when changing endianess.
*/
BOTW_Clipboard = {
    clipboard: {
		weapons: [],
		bows: [],
		shields: [],
		clothes: [],
		materials: [],
		food: [],
		other: []
    },
    clipboardFieldNames: {
		ITEM_NAME: "name",
		ITEM_ID: "id",
		ITEM_MODIFIER: "modifier_id",
		ITEM_MODIFIER_VALUE: "modifier_value",
		ITEM_STOCK_OR_DURABILITY: "stock/durability"
    },
    _getClipboardAsArray: function(){
		var result = [];
		for(var category in this.clipboard){
			for(var itemIndex=0;itemIndex<this.clipboard[category].length;itemIndex++){
				var itemData = this.clipboard[category][itemIndex];
				result.push(itemData);
			}
		}
		return result;
    },
	_createClipboardItem: function(itemId, name, category, modifier, modifierValue, durabilityOrStock){
		var item = {};
		item[this.clipboardFieldNames.ITEM_ID] = itemId;
		item[this.clipboardFieldNames.ITEM_NAME] = name;
		//if(modifier !== null && modifierValue !== null){
			item[this.clipboardFieldNames.ITEM_MODIFIER] = modifier;
			item[this.clipboardFieldNames.ITEM_MODIFIER_VALUE] = modifierValue;
		//}
		item[this.clipboardFieldNames.ITEM_STOCK_OR_DURABILITY] = durabilityOrStock;
		this.clipboard[category].push(item);
	},
	_pasteItemFromClipboard: function(itemData, itemNumber){
		// If not item number is specified, the item will be added to the item pool
		// By specifying an item number you can overwrite items
		if(itemNumber === null){
			itemNumber = document.getElementsByClassName("item-number").length;
		}
		if(itemNumber<SavegameEditor.Constants.MAX_ITEMS){
			//var itemData = this.clipboard[clipboardCategory][itemClipboardIndex];
			var itemId = itemData[this.clipboardFieldNames.ITEM_ID];
			var category = SavegameEditor._getItemCategory(itemId);
			var categorySingular = category.replace(/s$/,"");
			var row = SavegameEditor._createItemRow(itemNumber, category);
			document.getElementById('container-'+category).appendChild(row);
			SavegameEditor._writeItemName(itemNumber,itemId);

			SavegameEditor._setItemNameInDoc(itemNumber, itemData[this.clipboardFieldNames.ITEM_NAME]);
			SavegameEditor._setItemDurabilityInDoc(itemNumber, itemData[this.clipboardFieldNames.ITEM_STOCK_OR_DURABILITY]);

			//Add modifier select and input, since for some reason _createItemRow does not do that
			var modifierColumns=['weapons','bows','shields'];
			if(modifierColumns.indexOf(category)>=0){
				if(category === "bows" && !itemId.startsWith('Weapon_')){
					//do nothing (arrows do not have modifiers)
				}else{
					var modifierContainer=SavegameEditor._getRowFromItemNumber(itemNumber).children[2];
					var modifierSelect = select('modifier-'+category+'-'+itemNumber, BOTW_Data.MODIFIERS.concat({value:0,name:SavegameEditor._toHexInt(0)}));
					var modifierValue = inputNumber('modifier-'+category+'-value-'+itemNumber, 0, 0xffffffff, 0);
					modifierContainer.appendChild(modifierSelect);
					modifierContainer.appendChild(modifierValue);

					SavegameEditor._setItemModifierInDoc(itemNumber, category, itemData[this.clipboardFieldNames.ITEM_MODIFIER]);
					SavegameEditor._setItemModifierValueInDoc(itemNumber, category, itemData[this.clipboardFieldNames.ITEM_MODIFIER_VALUE]);
				}
			}
		}
	},
    fillClipboardWithItems: function(){
		var numberOfItems = document.getElementsByClassName("item-number").length;
		for(var i=0; i<numberOfItems; i++){
			var id = SavegameEditor._loadItemName(i);
			var name = SavegameEditor._getItemNameFromDoc(i);
			var category = SavegameEditor._getItemCategory(id);
			var modifier = SavegameEditor._getItemModifierFromDoc(i,category);
			var modifierValue = SavegameEditor._getItemModifierValueFromDoc(i,category);
			var durabilityOrStock = SavegameEditor._getItemDurabilityFromDoc(i);
			this._createClipboardItem(id, name, category, modifier, modifierValue, durabilityOrStock);
		}
	},
    overwriteItemsWithClipboard: function(){

		var clipboardAsArray = this._getClipboardAsArray();

		for (var i=0; i<clipboardAsArray.length; i++){
			var itemData = clipboardAsArray[i];
			this._pasteItemFromClipboard(itemData, i);
		}
	}

}