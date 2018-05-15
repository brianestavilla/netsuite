function numberSeries(type, form) {
	if(type == 'create') {
		record = nlapiGetNewRecord();
		internalid1 = record.getId();
		recordtype = record.getRecordType();
		
		bank = nlapiGetFieldValue('custbody44');
		filters = new Array (
			new nlobjSearchFilter('custrecord93', null, 'anyof', bank)
		);
		column = new Array (
					new nlobjSearchColumn('custrecord94'),
					new nlobjSearchColumn('internalid')
					);
		
		numberSeries = nlapiSearchRecord('customrecord135', null, filters, column);
		if(numberSeries != null) {
			nlapiSubmitField(recordtype, internalid1, 'custbody53', fixDigit(numberSeries[0].getValue('custrecord94'), 10));
			nlapiSubmitField('customrecord135', numberSeries[0].getValue('internalid'), 'custrecord94', parseInt(numberSeries[0].getValue('custrecord94')) + 1);
		}
		
		
	}
}

function fixDigit(number, maxDigit){
	maxDigit--;
		
	for(i = maxDigit; i >= number.length; i--) number = '0' + number;
		
	return number;
}