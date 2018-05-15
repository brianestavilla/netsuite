function amountInWords(type, form){
	if(type == 'create' || type == 'edit'){
		var record = nlapiGetNewRecord();
		var amount = record.getFieldValue('total');
		record.setFieldValue('custbody117', toWords(amount));
	}
}