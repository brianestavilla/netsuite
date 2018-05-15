function removeLineItem(recordtype, recordid){
	var record = nlapiLoadRecord(recordtype, recordid);
	
	var lineCount = record.getLineItemCount('customrecord112');

		for(var i = 1; i <= lineCount; i++){
			record.removeLineItem('customrecord112', i);
		}
		
	nlapiSubmitRecord(record, true);
}