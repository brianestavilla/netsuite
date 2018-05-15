function initFulfillment(type, name){
	if(name == 'custbody36'){
		var invoiceid = nlapiGetFieldValue('custbody36');
		alert(invoiceid);		
		var invoiceRec = nlapiLoadRecord('invoice',invoiceid);
		var rowCount = invoiceRec.getLineItemCount('item');
		for(i = 1; i <= rowCount; i++){
			var quantity = invoiceRec.getLineItemValue('item','quantity',i);
			nlapiSetLineItemValue('item','quantity',i,parseFloat(quantity));
		}
	}	
}