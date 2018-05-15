function populateInventoryDetail(type, name){
	var item = nlapiGetFieldValue('item'),
		quantity = nlapiGetFieldValue('quantity')
	;

	filter = new nlobjSearchFilter('internalid', null, 'is', item, null);
	columns = new Array(
				new nlobjSearchColumn('inventorynumber', 'inventorydetail', null),
				new nlobjSearchColumn('expirationdate', 'inventorynumber', null),
				new nlobjSearchColumn('quantity', 'inventorydetail', null)
			);
	var search = nlapiSearchRecord('item', 'customsearch132', filter, columns);
	if(search != null){
		quantityIn = 0;
		
		for(var i = 0; i < search.length; i++){
                                                       
                    //available = ((parseInt(search[i].getValue('quantity', 'inventorydetail', null)) + quantityIn) <= parseInt(quantity)) ? parseInt(search[i].getValue('quantity', 'inventorydetail', null)) : quantity - (parseInt(search[i].getValue('quantity', 'inventorydetail', null))+ quantityIn);
                    //alert('available2' + " " + (available * -1));
                    //available = (parseInt(search[i].getValue('quantity', 'inventorydetail', null)) * -1);
                    //alert(available);
                    //if(available > 0){
                    //alert('available3');
                     //alert(search[i].getValue('inventorynumber', 'inventorydetail', null));
                            nlapiSelectNewLineItem('inventoryassignment');
                            nlapiSetCurrentLineItemValue('inventoryassignment', 'quantity',  quantity);
                            nlapiSetCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', search[i].getValue('inventorynumber', 'inventorydetail', null));
                            nlapiSetCurrentLineItemValue('inventoryassignment', 'expirationdate', search[i].getValue('expirationdate', 'inventorynumber', null));

                            nlapiSetCurrentLineItemValue('inventoryassignment', 'quantityavailable', search[i].getValue('quantity', 'inventorydetail', null));
                            //nlapiInsertLineItem('inventoryassignment', i + 2);
                            nlapiCommitLineItem('inventoryassignment')
                            //alert(available + " " + search[i].getValue('inventorynumber', 'inventorydetail', null) + " " + search[i].getValue('expirationdate', 'inventorynumber', null) + " " + search[i].getValue('quantity', 'inventorydetail', null));
                            //quantityIn += available;	
                    //}else break;		
                     break;
		}
	}
}