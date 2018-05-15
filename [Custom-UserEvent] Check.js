/**
*	Write Cheque Events
*
*	[Raffy Sucilan]
*/

function beforeLoad(type, name){
	if(type == 'create'){
		recordType = nlapiGetRecordType();
		
		newNumberSeries = numberSeries('get', recordType);
		
		nlapiSetFieldValue('custbody96', newNumberSeries);
	}
}

function afterSubmit(type, name){
	if(type == 'create'){
		recordType = nlapiGetRecordType();
		
		numberSeries('fix', recordType);
	}
}