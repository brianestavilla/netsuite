/**
*	Check Line Items for Duplicates
*
*	[Raffy Sucilan]
*/
function duplicateItem(){
	itemCount = nlapiGetLineItemCount('item');
	
	if(itemCount === 0) return true;
	
	if(nlapiGetCurrentLineItemIndex('item') <= itemCount) return true;
		
	checkDuplicate = nlapiFindLineItemValue('item', 'item', nlapiGetCurrentLineItemValue('item', 'item'));
	// checkDuplicateUnit = nlapiFindLineItemValue('item', 'units', nlapiGetCurrentLineItemValue('item', 'units'));
	
	// if((checkDuplicate == -1 || checkDuplicate > itemCount) && (checkDuplicateUnit == -1 || checkDuplicateUnit > itemCount)) return true;
	if((checkDuplicate == -1 || checkDuplicate > itemCount)) return true;
	
	alert('Duplicate item is entered on line (last line)');
	
	nlapiSelectNewLineItem('item');
}

function fieldChanged(type, name){
	if(name == 'quantity'){
		quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
		
		try{
			nlapiSetCurrentLineItemValue('item', 'quantity', parseInt(quantity), false);
		}catch(e){
			alert('Quantity must be a whole number');
			quantity1 = quantity.split('.');
			nlapiSetCurrentLineItemValue('item', 'quantity', parseInt(quantity1[0]), false);
		}
	}
}