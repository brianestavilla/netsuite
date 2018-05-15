function updatedSO_Status  (type){ //after submit
	if (type == 'create'){
		var invRecord = nlapiGetNewRecord();	
		var refId = invRecord.getFieldValue('createdfrom'); //Get value from Invoice 'Created From' Field.	
		var soRecord = nlapiLoadRecord('salesorder',refId);
		var itemCount = nlapiGetLineItemCount('item');
		
		for(i=1; 1<= itemCount; i++){
			soRecord.setLineItemValue('item','isClosed',i,'T');		
		}
		
		var id = nlapiSubmitRecord(soRecord,true);		
		var rec_id = soRecord.getId();
		nlapiSetRedirectURL('RECORD','salesorder',rec_id,false);
		//prompt('Please click the "Close Order" button to close the sales order transaction');
	}	
}
