function InitialDate(type,name){
	if(type == 'view'){
		var record = nlapiGetNewRecord();
		var internalid = record.getId();
		
		
		
		//var getdate = record.getFieldValue('');
		
		var trecord = nlapiTransformRecord('purchaseorder',internalid,'vendorbill');
		
		var setDate = trecord.setFieldValue('trandate','2/24/2014');
		
		var intid = nlapiSubmitRecord(trecord);
	}
}