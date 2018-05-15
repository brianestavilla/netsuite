function totAmount(type,name){
	if(name == 'custrecord48'){
		var quantity = nlapiGetLineItemValue('item','custrecord48');
		var unitcost = nlapiGetLineItemValue('item','custrecord58');
	
		var totamount = parseFloat(quantity) * parseFloat(unitcost);
	
		nlapiSetLineItemValue('item', 'custrecord59', '1', totamount);
	}
}