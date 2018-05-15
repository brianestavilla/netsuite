function populateInventoryDetail(type, form){
	columns = new Array(
			new nlobjSearchColumn('inventorynumber', 'inventorydetail', null),
			new nlobjSearchColumn('expirationdate', 'inventorynumber', null),
			new nlobjSearchColumn('quantity', 'inventorydetail', null)
		);
	
	for(var i = 0; i < nlapiGetLineItemCount('item'); i++){
		nlapiSelectLineItem('item', i+1);
		var inputted_qty = parseInt(nlapiGetLineItemValue('item', 'quantity', i + 1));
		filter = new nlobjSearchFilter('internalid', null, 'is', nlapiGetLineItemValue('item', 'item', i + 1), null);
		var search = nlapiSearchRecord('item', 'customsearch132', filter, columns);			
		if(search != null){
			var inventorydetail = nlapiEditCurrentLineItemSubrecord('item','inventorydetail');
			qty = 0;
			for(var j = 0; j < search.length; j++){
				var quantity = search[j].getVa4lue('quantity', 'inventorydetail', null);
				quantity = (quantity == null || quantity == '') ? 0 : parseInt(quantity);
				var need = inputted_qty - (qty + quantity);
				inventorydetail.selectNewLineItem('inventoryassignment');
				if(need >= 0){
					inventorydetail.setCurrentLineItemValue('inventoryassignment', 'quantity', quantity);
					qty += quantity;
				}else
					inventorydetail.setCurrentLineItemValwue('inventoryassignment', 'quantity', inputted_qty - qty);	
					
				inventorydetail.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', search[j].getValue('inventorynumber', 'inventorydetail', null));
				inventorydetail.setCurrentLineItemValue('inventoryassignment', 'expirationdate', search[j].getValue('expirationdate', 'inventorynumber', null));
				inventorydetail.setCurrentLineItemValue('inventoryassignment', 'quantityavailable', search[j].getValue('quantity', 'inventorydetail', null));
				inventorydetail.commitLineItem('inventoryassignment');
			}
		}
		nlapiCommitLineItem('item');
	}
} 