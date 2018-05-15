function updateInvoiced(type, form){
	if(type == 'create'){
		var newRecord = nlapiGetNewRecord();
		var internalid1 = newRecord.getId();
   		var recordtype = newRecord.getRecordType();

		var soId = newRecord.getFieldValue('createdfrom');
		nlapiSubmitField('salesorder', soId, 'custbody75', 'T');
nlapiSubmitField('customer', newRecord.getFieldValue('entity'), 'custentity24', internalid1);
	}
}