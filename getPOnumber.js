function getPOnumber(type,name){
	if(type == 'transform'){
		var record = nlapiGetNewRecord();
		var internalid = record.getId();
		
		var getPonumber = record.getFieldValue('tranid');
		
		var trecord = nlapiTransformRecord('purchaseorder',internalid,'vendorbill');
		var setReference = trecord.setFieldValue('tranid',getPonumber);
		
		var intid = nlapiSubmitRecord(trecord,null,true);
	}
}