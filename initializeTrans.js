function init(type, form){
	if (type == 'create'){
		var invRecord = nlapiGetNewRecord();
		var recType = nlapiGetRecordType();
		
		if (recType == 'invoice'){			
			var refId = invRecord.getFieldValue('createdfrom'); //Get value from Invoice 'Created From' Field. Field Type "List"			
			if (refId != null){
				var soRecord = nlapiLoadRecord('salesorder',refId); //get record from sales order
				var rowCount = soRecord.getLineItemCount('item'); //get sales order item total count.
				
				for(i = 1; i <= rowCount; i++){
					var qtyCommit = soRecord.getLineItemValue('item','quantitycommitted',i); //get value from Sales Order item committed qty.
					invRecord.setLineItemValue('item','quantity',i,parseInt(qtyCommit)); //set value to Invoice item quantity.					
					invRecord.setLineItemValue('item','custcol14',i,parseInt(qtyCommit)); //set value to temporary Invoice item quantity.					
				}					
			}		
		}
		else if(recType == 'itemfulfillment'){			
			var refId = invRecord.getFieldValue('createdfrom'); //Get value from Invoice 'Created From' Field. Field Type "List"				
			if (refId != null){
				var soRecord = nlapiLoadRecord('salesorder',refId); //get record from sales order
				var rowCount = soRecord.getLineItemCount('item'); //get sales order item total count.
				
				for(i = 1; i <= rowCount; i++){
					var qtyInvoiced = soRecord.getLineItemValue('item','quantitybilled',i); //get value from Sales Order item invoiced qty.
					//invRecord.setLineItemValue('item','quantity',i,parseInt(qtyInvoiced)); //set value to fulfillment item quantity.	
					//invRecord.setLineItemValue('item','custcol14',i,parseInt(qtyInvoiced)); //set value to temporary fulfillment item quantity.							
				}		
			}
		
		}
	}
}