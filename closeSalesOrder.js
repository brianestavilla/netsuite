function closeSalesOrder(type){ //after submit
	//if (type == 'create' || type == 'edit'){
	try{
		var recInvoice = nlapiGetNewRecord();	
		var refId = recInvoice.getFieldValue('createdfrom'); //Get value from Invoice 'Created From' Field.	
		if(refId != null && refId != ''){
			var recSalesOrder = nlapiLoadRecord('salesorder',refId);
			var itemCount = recSalesOrder.getLineItemCount('item');
			
			for(i=1; i<= itemCount; i++){			
				recSalesOrder.setLineItemValue('item','isclosed',i,'T');				
			}		
			var id = nlapiSubmitRecord(recSalesOrder,true);
var x = 0;
		}
	}catch(e){
	}
	//}	
}
