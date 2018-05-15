function beforeLoad(type, form){
	if (type == 'create') {
		recordType = nlapiGetRecordType();
		series = numberSeries('get', recordType);
		nlapiSetFieldValue('custbody37', series);
	}	
}