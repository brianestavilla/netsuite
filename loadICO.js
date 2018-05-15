/*
customrecord196
custrecord386		item
custrecord387		location
custrecord388		ICOquantity
custrecord578		ICOdays

transaction column field ICO days(custcol28)
transaction column field ICO qty(custcol29)
*/
function loadICO(type, form) {
	if(form == 'item') {
		var itemid = nlapiGetCurrentLineItemValue('item', 'item');
		var location = nlapiGetFieldText('location');
		var parent = location.split(':');
		var parentLocation = parent[0].replace(' ', '');
			if(location == null || location == '') {
				alert('Please identify the Location first');
			} else {
				var filter = new Array (
					new nlobjSearchFilter('custrecord386', null, 'is', itemid),
					new nlobjSearchFilter('custrecord387', null, 'is', parentLocation)
				);
				var column = new Array (
					new nlobjSearchColumn('custrecord388'),//ICO quantity
					new nlobjSearchColumn('custrecord578')//ICO days
				);
				var filterItem1 = nlapiSearchRecord('customrecord196', null, filter, column);
					if(filterItem1 != null) {
						nlapiSetCurrentLineItemValue('item', 'custcol29', filterItem1[0].getValue('custrecord388'));
						nlapiSetCurrentLineItemValue('item', 'custcol28', filterItem1[0].getValue('custrecord578'));
					}
			}
	}
}