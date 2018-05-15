function getBillRR(type, form) {
	var record = nlapiLoadRecord('purchaseorder', '332'),
		ven = form.getField('custrecord283'),
		nameset = record.getFieldValue('entity'),
		currencyset = record.getFieldValue('currency'),
		trandateset = record.getFieldValue('trandate'),
		exchangerateset = record.getFieldValue('exchangerate')
	;
	form.setFieldValues({custrecord283:nameset, custrecord284:currencyset, custrecord286:trandateset, custrecord292:exchangerateset});
	ven.setDefaultValue(nameset);

	//var record = nlapiGetNewRecord(),
	//	internalid1 = record.getId(),
	//	recordtype = record.getRecordType(),
		//po = '3923';//nlapiGetFieldValue('custrecord285')
	
	/*filters = new Array (
			new nlobjSearchFilter('internalid', null, 'anyof', po) //po
	);
	
	result = nlapiSearchRecord('transaction', 'customsearch108', filters);
	var billId = new Array(); 	
	if(result !== null) {
		for (var i = 0; i < result.length; i++) {
		
			billId[i] = result[i].getValue('internalid', 'applyingTransaction', null);
	//item receipt#		nlapiSubmitField('vendorbill', billId[i], 'custbody72', internalid1);
			
		}
		//nlapiSubmitField(recordtype, '4044', 'custrecord290', billId);
		var billids = form.getField('custrecord290');
		//var billId = new Array();
		for (var i = 0; i < result.length; i++) {
			billId = result[i].getValue('internalid', 'applyingTransaction', null);
			billids.addSelectionOption(billId[i], "Bill ID " + billId);
			billids.addSelectionOption(billId[i], 'asdqwdwqdas');
		}*/
}