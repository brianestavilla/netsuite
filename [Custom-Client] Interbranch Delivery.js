function pageInit(type, name){
	DRType = nlapiGetFieldValue('custrecord605');
	
	if(DRType == '1'){
		landedCost =  0;
		
		nlapiSetFieldValue('custrecord529', landedCost);
		
		nlapiDisableField('custrecord529', true);
	}
}

function fieldChange(type, name){
	DRSubID = 'recmachcustrecord463';
	
	if(name == 'custrecord529'){ // Landed Cost - Body
		// DRType = nlapiGetFieldValue('custrecord605');
		// landedCost = nlapiGetFieldValue(name);
		
		// if(DRType != '1'){
			// if(landedCost < 1){
				// alert('Landed Cost is empty');
			// }
		// }else{
			// nlapiSetFieldValue('custrecord529', 0);
		// }
	}
	
	if(name == 'custrecord452'){ // DR Quantity - Column
		DRQuantity = nlapiGetCurrentLineItemValue(DRSubID, name);
		TORemQuantity = nlapiGetCurrentLineItemValue(DRSubID, 'custrecord501');
		
		DRQuantity = (DRQuantity != '') ? parseFloat(DRQuantity) : 0;
		TORemQuantity = (TORemQuantity != '') ? parseFloat(TORemQuantity) : 0;
		
		if(DRQuantity > TORemQuantity) nlapiSetCurrentLineItemValue(DRSubID, name, TORemQuantity);
	}
}

function validateLine(){
	DRSubID = 'recmachcustrecord463';
	
	DRQuantity = parseFloat(nlapiGetCurrentLineItemValue(DRSubID, 'custrecord452'));
	
	TORemQuantity = parseFloat(nlapiGetCurrentLineItemValue(DRSubID, 'custrecord501'));
	
	if(DRQuantity >= TORemQuantity) nlapiSetCurrentLineItemValue(DRSubID, 'custrecord452', TORemQuantity);
	
	return true;
}