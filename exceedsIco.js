function ifExceedsIco(type, name){
	var principal = nlapiGetFieldValue('class'),
		location = nlapiGetFieldValue('location'),
		quantity = nlapiGetCurrentLineItemValue('item', 'quantity'),
		item = nlapiGetCurrentLineItemValue('item', 'item')
	;
	
	//Item ICO
	if((location != null && principal != null) && (location != '' && principal != '')){
		var filter = new Array(
					new nlobjSearchFilter('internalid', null, 'is', item, null),
					new nlobjSearchFilter('custrecord387', 'CUSTRECORD386', 'is', location, null),
					new nlobjSearchFilter('class', null, 'is', principal, null)
					);
		var columns = new Array(
					new nlobjSearchColumn('custrecord388', 'CUSTRECORD386'),	//ICO Column
					new nlobjSearchColumn('internalid')
					);
		ico = nlapiSearchRecord('item', 'customsearch185', filter, columns);
		if(ico != null)
			if(ico[0].getValue('custrecord388', 'CUSTRECORD386') < quantity)
				nlapiSetCurrentLineItemValue('item', 'custcol13', 'T');
			else 
				nlapiSetCurrentLineItemValue('item', 'custcol13', 'F');
				
		return true;
	}else{
		alert('Please put values for principal and location');
		return false;
	}
}