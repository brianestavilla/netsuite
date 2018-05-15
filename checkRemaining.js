function checkRemaining(type, name) {
	if (name ==  'custrecord300') {
		var remaining = nlapiGetCurrentLineItemValue('recmachcustrecord291', 'custrecord299'),
			quantity = nlapiGetCurrentLineItemValue('recmachcustrecord291', 'custrecord300')
		;
		
		if (quantity !== 0) {
			if (parseInt(quantity) > parseInt(remaining)) {
				alert('Quantity shouldnt exceed the remaining quantity');
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord300', 0);
			}
		}
	}
}
