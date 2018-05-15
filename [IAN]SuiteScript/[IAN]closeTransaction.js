function closeTransaction(type){ //after submit
	var record = nlapiGetNewRecord();
	if(type == 'create')
	try{
		var ifStandard = nlapiLookupField('classification', record.getFieldValue('class'), 'custrecord797', false);
		//close sales order
		if(nlapiGetRecordType() == 'invoice'){
			var recInvoice = nlapiGetNewRecord();	
			var refId = recInvoice.getFieldValue('createdfrom'); //Get value from Invoice 'Created From' Field.	
			if(refId != null && refId != ''){
				var recSalesOrder = nlapiLoadRecord('salesorder',refId);
				var itemCount = recSalesOrder.getLineItemCount('item');
				
				for(i=1; i<= itemCount; i++){			
					recSalesOrder.setLineItemValue('item','isclosed',i,'T');				
				}		
				var id = nlapiSubmitRecord(recSalesOrder,true);
				//var x = 0;
			}
		//close purchase order
		}else if(nlapiGetRecordType() == 'vendorbill' && ifStandard == 'F') 
		{
			var recVendorBill = nlapiGetNewRecord();	
			var refId = recVendorBill.getFieldValue('createdfrom'); //Get value from Invoice 'Created From' Field.	
			if(refId != null && refId != ''){
				var recSalesOrder = nlapiLoadRecord('purchaseorder',refId);
				var itemCount = recSalesOrder.getLineItemCount('item');
				
				for(i=1; i<= itemCount; i++){			
					recSalesOrder.setLineItemValue('item','isclosed',i,'T');				
				}		
				var id = nlapiSubmitRecord(recSalesOrder,true);
				//var x = 0;
			}
		}
	}		
	catch(e){
	}
}