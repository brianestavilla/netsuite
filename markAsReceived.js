function afterSubmit(type, form){
	var record = nlapiGetNewRecord(),
		internalid = record.getId(),
		poNumber = record.getFieldValue('createdfrom')
	;
	if(poNumber != null)
		nlapiSubmitField('purchaseorder', poNumber, 'custbody93', 'T');	
}