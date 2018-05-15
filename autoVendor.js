function fieldChange(type, name){
	id = 'recmachcustrecord573';
	itemid = nlapiGetCurrentLineItemValue(id, 'custrecord557');
	//item
	if (name == 'custrecord557') {
	try{
		record = nlapiLoadRecord('inventoryitem', itemid);
		} catch (e) {
			try {
				record = nlapiLoadRecord('noninventoryitem', itemid);
			} catch (e) {
				try {
					record = nlapiLoadRecord('otherchargeitem', itemid);
				} catch (e) {
						try {
							record = nlapiLoadRecord('paymentitem', itemid);
						} catch (e) {
							record = nlapiLoadRecord('serviceitem', itemid);
							}
						}
					}
				}
	
		desc = record.getFieldValue('displayname');
		if(desc == null){
		 desc = '';
		}
		
		rate = record.getFieldValue('lastpurchaseprice');
		if(rate == null){
		 rate = record.getFieldValue('cost');
		 if (rate == null) {
			rate = 0;
		 }
		}
		
		taxcode = record.getFieldValue('custitem80');
		if(taxcode == null){
		 taxcode = '';
		}
		
		
		dept = record.getFieldValue('department');
		if (dept == null) {
		dept = '';
		}
		
		principal = record.getFieldValue('class');
		if (principal == null) {
		principal = '';
		}
		
		loc = record.getFieldValue('location');
		if (loc == null) {
		loc = '';
		}
		
		nlapiSetCurrentLineItemValue(id, 'custrecord563', rate);
		nlapiSetCurrentLineItemValue(id, 'custrecord562', desc);
		nlapiSetCurrentLineItemValue(id, 'custrecord570', dept);
		nlapiSetCurrentLineItemValue(id, 'custrecord571', principal);
		nlapiSetCurrentLineItemValue(id, 'custrecord572', loc);
		nlapiSetCurrentLineItemValue(id, 'custrecord564', taxcode);
		nlapiSetCurrentLineItemValue(id, 'custrecord559', 1);
	}
	
	
	//qty
	if (name == 'custrecord559') {
		itemid = nlapiGetCurrentLineItemValue(id, 'custrecord557');
		if (itemid !== '') {
			qty = nlapiGetCurrentLineItemValue(id, name);
			rate = nlapiGetCurrentLineItemValue(id, 'custrecord563');
			amountTotal = qty * rate;
			nlapiSetCurrentLineItemValue(id, 'custrecord565', amountTotal);
			
		} else {
			alert('Please select first an item.');
		}
	}
	
	//amount
	if (name == 'custrecord565') {
		itemid = nlapiGetCurrentLineItemValue(id, 'custrecord565');
		if (itemid !== '') {
			amount = nlapiGetCurrentLineItemValue(id, 'custrecord565');
			
			
			taxrate = parseFloat(nlapiGetCurrentLineItemValue(id, 'custrecord566'));
			grossAmount = amount * (1 + (taxrate/100));
			nlapiSetCurrentLineItemValue(id, 'custrecord567', grossAmount);
			
			taxAmount = amount * (taxrate/100);
			nlapiSetCurrentLineItemValue(id, 'custrecord568', taxAmount);
		} else {
			alert('Please select first an item.');
		}
	}
	
	//taxcode
	if (name == 'custrecord564') {
		itemid = nlapiGetCurrentLineItemValue(id, 'custrecord557');
		if (itemid !== '') {
			var taxcode = nlapiGetCurrentLineItemValue(id, 'custrecord564');
			if(taxcode != ''){
				taxRecord = nlapiLookupField('salestaxitem', taxcode, 'rate');
			} else {
				taxRecord = 0;
			}
			
			nlapiSetCurrentLineItemValue(id, 'custrecord566', taxRecord);
			
			amount = nlapiGetCurrentLineItemValue(id, 'custrecord565');
			
			taxrate = parseFloat(nlapiGetCurrentLineItemValue(id, 'custrecord566'));
			grossAmount = amount * (1 + (taxrate/100));
			nlapiSetCurrentLineItemValue(id, 'custrecord567', grossAmount);
			
			taxAmount = amount * (taxrate/100);
			nlapiSetCurrentLineItemValue(id, 'custrecord568', taxAmount);
		} else {
			alert('Please select first an item.');
		}
	}
	
	
	
	//expense line item
	expenseID = 'recmachcustrecord556';
	iExpense = nlapiGetFieldValue('custrecord530');
	
	if (name == 'custrecord541') {
		if (iExpense != '') {
			record = nlapiLoadRecord('vendor', iExpense);
			taxcode = record.getFieldValue('taxitem');
			
			if (taxcode == null) {
				taxcode = '';
			}
			nlapiSetCurrentLineItemValue(expenseID, 'custrecord543', taxcode);
		} else {
			alert('Please select a vendor');
		}
	}
	//taxcode expense
	if (name == 'custrecord543') {
		var taxcode = nlapiGetCurrentLineItemValue(expenseID, 'custrecord543');
		if(taxcode != ''){
			taxRecord = nlapiLookupField('salestaxitem', taxcode, 'rate');
		} else {
			taxRecord = 0;
		}
		
		nlapiSetCurrentLineItemValue(expenseID, 'custrecord544', taxRecord);
		
		amount = nlapiGetCurrentLineItemValue(expenseID, 'custrecord542');
		taxrate = parseFloat(nlapiGetCurrentLineItemValue(expenseID, 'custrecord544'));
		grossAmountex = amount * (1 + (taxrate/100));
		nlapiSetCurrentLineItemValue(expenseID, 'custrecord546', grossAmountex);
		
		taxAmountex = amount * (taxrate/100);
		nlapiSetCurrentLineItemValue(expenseID, 'custrecord545', taxAmountex);
	}
	
	//amount expense
	if (name == 'custrecord542') {
		account = nlapiGetCurrentLineItemValue(expenseID, 'custrecord541');
		taxcode = nlapiGetCurrentLineItemValue(expenseID, 'custrecord543');
		if (taxcode !== '') {
			if (account !== '') {
				amount = nlapiGetCurrentLineItemValue(expenseID, 'custrecord542');
					
					taxrate = parseFloat(nlapiGetCurrentLineItemValue(expenseID, 'custrecord544'));
					grossAmountex = amount * (1 + (taxrate/100));
					nlapiSetCurrentLineItemValue(expenseID, 'custrecord546', grossAmountex);
					
					taxAmountex = amount * (taxrate/100);
					nlapiSetCurrentLineItemValue(expenseID, 'custrecord545', taxAmountex);
			} else {
				alert('Please select first an account.');
			}
		} else {
			alert('Please fill up the mandatory fields.');
		}
	}
}

function reCalc(){
	itemID = 'recmachcustrecord573';
	expenseID = 'recmachcustrecord556';
	
	iCount = nlapiGetLineItemCount(itemID);
	ieCount = nlapiGetLineItemCount(expenseID);
	amountTotal = 0;
	examountTotal = 0;
	
	amountTotaltax = 0;
	examountTotaltax = 0;
	
	for(i = 1; i <= iCount; i++){
		amount = nlapiGetLineItemValue(itemID, 'custrecord567', i);
		amount = (amount == '') ? 0 : parseFloat(amount);
		amountTotal += amount;
		
		amounttax = nlapiGetLineItemValue(itemID, 'custrecord568', i);
		amounttax = (amounttax == '') ? 0 : parseFloat(amounttax);
		amountTotaltax += amounttax;
	}
	
	for(i = 1; i <= ieCount; i++){
		amount = nlapiGetLineItemValue(expenseID, 'custrecord546', i);
		amount = (amount == '') ? 0 : parseFloat(amount);
		examountTotal += amount;
		
		amounttax = nlapiGetLineItemValue(expenseID, 'custrecord545', i);
		amounttax = (amounttax == '') ? 0 : parseFloat(amounttax);
		examountTotaltax += amounttax;
	}
	
	finaltotal = amountTotal + examountTotal;
	finaltotaltax = parseFloat(amountTotaltax) + parseFloat(examountTotaltax);
	nlapiSetFieldValue('custrecord533', finaltotal);
	nlapiSetFieldValue('custrecord536', finaltotaltax);
}