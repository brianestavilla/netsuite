function fieldChangeRestriction(type, name){
	
	if(nlapiGetFieldValue('createdfrom') != null){
			
			if(name == 'quantity'){				
				var tempQty = nlapiGetCurrentLineItemValue('item','custcol14');
				var qty = nlapiGetCurrentLineItemValue('item','quantity');
				if (qty != tempQty){
					alert('Editing quantity in not allowed at this instance.');
					nlapiSetCurrentLineItemValue('item','quantity',tempQty);
				}
			}
		
	}
}