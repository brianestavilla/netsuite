function AutoCreatePO(type, form){ //sample lang.. pr auto generated number 
	if(type == 'create'){		
		recType = nlapiGetRecordType();
		rec = nlapiGetNewRecord();
		series = numberSeries('get', recType, null);
		
		nlapiSetFieldValue('custrecord39', series);
		nlapiSetFieldValue('name', series);
	}

}

function afterSubmit(type, form){
	if(type == 'create'){		
		recType = nlapiGetRecordType();
		rec = nlapiGetNewRecord();
		numberSeries('fix', recType, null);
	}
}

function beforeLoad(type, form){
	if(type == 'create'){
		nlapiSetFieldValue('name', 'To be Generated');
	}
}