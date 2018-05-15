function fieldChange(type, name){
	DRSubID = 'recmachcustrecord475';
	
	if(name == 'custrecord498'){
		RRQuantity1 = nlapiGetCurrentLineItemValue(DRSubID, name);
		DRQuantity1 = nlapiGetCurrentLineItemValue(DRSubID, 'custrecord479');
		
		RRQuantity1 = (RRQuantity1 != '') ? parseFloat(RRQuantity1) : 0;
		DRQuantity1 = (DRQuantity1 != '') ? parseFloat(DRQuantity1) : 0;
		
		if(RRQuantity1 <= DRQuantity1){
			variants1 = DRQuantity1 - RRQuantity1;
			nlapiSetCurrentLineItemValue(DRSubID, 'custrecord480', variants1);
		}else{
			nlapiSetCurrentLineItemValue(DRSubID, 'custrecord498', 0);
		}
	}
}

function validateLine(){
	DRSubID = 'recmachcustrecord475';
	
	RRQuantity = parseFloat(nlapiGetCurrentLineItemValue(DRSubID, 'custrecord498'));
 
	DRRemQuantity = parseFloat(nlapiGetCurrentLineItemValue(DRSubID, 'custrecord479'));
	 
	if(RRQuantity >= DRRemQuantity) nlapiSetCurrentLineItemValue(DRSubID, 'custrecord498', DRRemQuantity);
	 
	return true;
}

function reCalc(){
	subID = 'recmachcustrecord475';
	
	iCount = nlapiGetLineItemCount(subID);
	
	amountTotal = 0;
	unitTotal = 0;
	for(i = 1; i <= iCount; i++){
		amount = nlapiGetLineItemValue(subID, 'custrecord498', i);
		
		amount = (amount == '') ? 0 : parseFloat(amount);
		amountTotal += amount;
		
		cost = nlapiGetLineItemValue(subID, 'custrecord612', i);
		rrqty = nlapiGetLineItemValue(subID, 'custrecord498', i);
		cost = (cost == '') ? 0 : parseFloat(cost);
		rrqty = (rrqty == '') ? 0 : parseFloat(rrqty);
		
		temp = cost * rrqty;
		unitTotal += temp;
	}
	
	nlapiSetFieldValue('custrecord593', amountTotal);
	nlapiSetFieldValue('custrecord611', unitTotal);
}