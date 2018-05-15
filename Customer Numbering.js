function beforeSubmit(type, name){
	var location = nlapiGetFieldValue('custentity48');
	if(type == 'create'){
		/** Generate Number Series - START **/		
		newSeries = numberSeries('get', nlapiGetRecordType(), location);
		nlapiSetFieldValue('custentity12', newSeries); // Customer Code
		/** Generate Number Series - END **/
	}
}

function afterSubmit(type, name){
	if(type == 'create'){
		/** Fix Number Series - START **/
		numberSeries('fix', nlapiGetRecordType(), nlapiGetNewRecord().getFieldValue('custentity48'));
		/** Fix Number Series - END **/
	}
}