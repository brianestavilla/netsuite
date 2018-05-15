function PRnumberSeries(type,name){ //sample lang 
	if(type == 'create'){ 
		var newRecord = nlapiGetNewRecord();
		var internalid1 = newRecord.getId();
		var recordtype = newRecord.getRecordType();
		
		var columns = new nlobjSearchColumn('internalid');
		var result = nlapiSearchRecord('customrecord111', 'customsearch76',null,columns);
		
		if(result != null){
			for(var i = 0; i < result.length; i++){
				var recordcount = result[i];
				var interna = recordcount.getValue('internalid');
			}
			nlapiSubmitField(recordtype, internalid1, 'custrecord39', interna);
		}
	}
	
}