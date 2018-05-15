function beforeSub(type, name){
	var operation = nlapiGetFieldValue('custbody69');
        var principal = nlapiGetFieldValue('class');
	if(nlapiGetFieldValue('customform') == '142' && operation != '' && principal !='7'){ //principal should not PG
		var	entity = nlapiGetFieldValue('custbody172');
		
		filter = new nlobjSearchFilter('name', null, 'anyof', entity);
		var creditLimit = nlapiSearchRecord('transaction', 'customsearch611', filter);
		if(creditLimit != null){
			newRecord.setFieldValue('custbody60', 'T');
				throw nlapiCreateError('ERR_TO_TRANSFER', "Previous Transfer Order for this salesman must be received first");
		}
	}
}