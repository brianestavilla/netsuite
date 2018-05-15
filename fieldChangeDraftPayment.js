function fieldChange(type, name){
	//payment
	var subID = 'recmachcustrecord667';
	var accountfield = nlapiGetFieldValue('custrecord647');
	var custText = nlapiGetFieldText('custrecord644');
	
	if (name == 'custrecord644') {
		var iCustID = nlapiGetFieldValue('custrecord644');
		
		var ctr = nlapiGetLineItemCount(subID);
		for (var d = 1; d <= ctr; d++) {
			nlapiRemoveLineItem(subID, d);
		}
		
		if (iCustID != '') {
			//customer = nlapiLoadRecord('customer', iCustID);
			//bal = customer.getFieldValue('balance');
			//consolidated = customer.getFieldValue('consolbalance');
			
			var bal = nlapiLookupField('customer', iCustID, 'balance');
			var consolidated = nlapiLookupField('customer', iCustID, 'consolbalance');
			var location = nlapiLookupField('customer', iCustID, 'custentity37');
		
				filters = new nlobjSearchFilter('name', null, 'anyof', iCustID);
				var result = nlapiSearchRecord('transaction', 'customsearch286', filters);
			
				for (var i = 0; result != null && i < result.length; i++) {
					var account = result[i].getValue('account');
					
					//nlapiLogExecution('DEBUG','account from save search', account);
					//nlapiLogExecution('DEBUG','account from form', accountfield);
					//nlapiLogExecution('DEBUG','amount', result[i].getValue('amount'));
					
					if (account == accountfield) {
						var date = result[i].getValue('trandate');
						var iInvoiceID = result[i].getValue('internalid');
						var name = result[i].getValue('companyname', 'customer');
						var type = result[i].getValue('type');
						var tranid = result[i].getValue('tranid');
						var amount = parseFloat(result[i].getValue('amount'));
						var currency = result[i].getValue('currency');
						var amountpaid = parseFloat(result[i].getValue('amountpaid'));
						var salesRep = result[i].getValue('salesrep');
							
						var amountdue = amount - amountpaid;
							
						nlapiSelectNewLineItem(subID);
						nlapiSetCurrentLineItemValue(subID, 'custrecord656', date);
						if (custText != name) {
							nlapiSetCurrentLineItemValue(subID, 'custrecord657', name);
						}
						nlapiSetCurrentLineItemValue(subID, 'custrecord659', iInvoiceID);
						nlapiSetCurrentLineItemValue(subID, 'custrecord660', amount);
						nlapiSetCurrentLineItemValue(subID, 'custrecord661', amountdue);
						nlapiSetCurrentLineItemValue(subID, 'custrecord662', currency);
						nlapiSetCurrentLineItemValue(subID, 'custrecord850', salesRep);
						nlapiCommitLineItem(subID);
					}
						
				}
				nlapiSetFieldValue('custrecord645', bal);
				nlapiSetFieldValue('custrecord646', consolidated);
				nlapiSetFieldValue('custrecord653', location);
		}
	}
	
	else if (name == 'custrecord647') {
		var iCustID = nlapiGetFieldValue('custrecord644');
		
		var ctr1 = nlapiGetLineItemCount(subID);
		for (var c = 1; c <= ctr1; c++) {
			nlapiRemoveLineItem(subID, c);
		}
		
		if (iCustID != '') {
			filters = new nlobjSearchFilter('name', null, 'anyof', iCustID);
			var result = nlapiSearchRecord('transaction', 'customsearch286', filters);
				
				for (var i = 0; result != null && i < result.length; i++) {
					var account = result[i].getValue('account');
					if (account == accountfield) {
						date = result[i].getValue('trandate');
						iInvoiceID = result[i].getValue('internalid');
						name = result[i].getValue('companyname', 'customer');
						type = result[i].getValue('type');
						tranid = result[i].getValue('tranid');
						amount = parseFloat(result[i].getValue('amount'));
						currency = result[i].getValue('currency');
						amountpaid = parseFloat(result[i].getValue('amountpaid'));
						var salesRep = result[i].getValue('salesrep');
							
						amountdue = amount - amountpaid;
							
						nlapiSelectNewLineItem(subID);
						nlapiSetCurrentLineItemValue(subID, 'custrecord656', date);
							if (custText != name) {
								nlapiSetCurrentLineItemValue(subID, 'custrecord657', name);
							}
							nlapiSetCurrentLineItemValue(subID, 'custrecord659', iInvoiceID);
							nlapiSetCurrentLineItemValue(subID, 'custrecord660', amount);
							nlapiSetCurrentLineItemValue(subID, 'custrecord661', amountdue);
							nlapiSetCurrentLineItemValue(subID, 'custrecord662', currency);
							nlapiSetCurrentLineItemValue(subID, 'custrecord850', salesRep);
							nlapiCommitLineItem(subID);
						}
					}
				
		}
	}
	
	else if(name == 'custrecord760') {
		/*cashAmount = parseFloat((nlapiGetFieldValue('custrecord761') == null || nlapiGetFieldValue('custrecord761') == '') ? 0: nlapiGetFieldValue('custrecord761'));
		checkAmount = parseFloat(nlapiGetFieldValue('custrecord766'));
		totalAmount = cashAmount + checkAmount;
		
		paymentTotal = parseFloat(nlapiGetFieldValue('custrecord767'));
		
		currentpay =  parseFloat(nlapiGetCurrentLineItemValue(subID, 'custrecord760'));
		
		checker = paymentTotal + currentpay;
		
		alert('Total amount' + totalAmount);
		alert('Current Payment' + currentpay);
		alert('Total Payment' + paymentTotal);
		*/
		
		amount = parseFloat(nlapiGetCurrentLineItemValue(subID, name));
		amountdue = parseFloat(nlapiGetCurrentLineItemValue(subID, 'custrecord661'));
		
		if (amount > 0) {
			nlapiSetCurrentLineItemValue(subID, 'custrecord655', 'T');
		} else {
			nlapiSetCurrentLineItemValue(subID, 'custrecord655', 'F');
		}
		/*
		if (amountdue < amount) {
			nlapiSetCurrentLineItemValue(subID, 'custrecord760', amountdue);
		}
		
		if (totalAmount.toFixed(2) < checker.toFixed(2)) {
			temp1 = -1 * (totalAmount - checker);
			temp2 = currentpay - temp1;
			nlapiSetCurrentLineItemValue(subID, 'custrecord760', 0);
			alert('Payment Exceeds. Input Should be ' + temp2.toFixed(2) + 'and below');
		}*/
	}
}

function validateLine(){
	
	subID = 'recmachcustrecord667';
	
	currentPaymentAmount = parseFloat(nlapiGetCurrentLineItemValue(subID, 'custrecord760'));
	cashAmount = parseFloat((nlapiGetFieldValue('custrecord761') == null || nlapiGetFieldValue('custrecord761') == '') ? 0: nlapiGetFieldValue('custrecord761'));
	checkAmount = parseFloat(nlapiGetFieldValue('custrecord766'));
	totalAmount = cashAmount + checkAmount;
	
	totalPaymentAmount = 0;
	x = parseFloat(nlapiGetFieldValue('custrecord767'));
	
	check = currentPaymentAmount + x;
	for(i = 1; i <= nlapiGetLineItemCount(subID); i++){
		if(i != nlapiGetCurrentLineItemIndex(subID)){
			paymentAmount = parseFloat(nlapiGetLineItemValue(subID, 'custrecord760', i));
			paymentAmount = (paymentAmount == null || paymentAmount == '') ? 0 : paymentAmount;
			totalPaymentAmount = totalPaymentAmount + paymentAmount;
		}else{
			totalPaymentAmount = totalPaymentAmount + currentPaymentAmount;
		}
	}
	
	// if(totalPaymentAmount.toFixed(2) > totalAmount.toFixed(2)){
		// totalPaymentAmount = 0;
		
		// for(i = 1; i <= nlapiGetLineItemCount(subID); i++){
			// if(i != nlapiGetCurrentLineItemIndex(subID)){
				// paymentAmount = parseFloat(nlapiGetLineItemValue(subID, 'custrecord760', i));
				// totalPaymentAmount = totalPaymentAmount + paymentAmount;
			// }
		// }
		
		// totalPaymentAmount = -1 * (totalAmount - totalPaymentAmount);
		
		// nlapiSetCurrentLineItemValue(subID, 'custrecord760', totalPaymentAmount);
		
		// return false;
	// }
	
	return true;
}

function recalc(){
	//check
	subId = 'recmachcustrecord765';
	iCount = nlapiGetLineItemCount(subId);
	
	checkTotal = 0;
	for (i = 1; i <= iCount; i++) {
		check = nlapiGetLineItemValue(subId, 'custrecord764', i);
		
		check = (check == '') ? 0 : parseFloat(check);
		checkTotal += check;
	}
	
	nlapiSetFieldValue('custrecord766', checkTotal.toFixed(2));
	
	//payment
	subIdpay = 'recmachcustrecord667';
	iCountpay = nlapiGetLineItemCount(subIdpay);
	
	paymentTotal = 0;
	for (x = 1; x <= iCountpay; x++) {
		payment = nlapiGetLineItemValue(subIdpay, 'custrecord760', x);
		
		payment = (payment == '') ? 0 : parseFloat(payment);
		paymentTotal += payment;
	}
	
	nlapiSetFieldValue('custrecord767', paymentTotal.toFixed(2));
}


function validateInsert(){
	return false;
}

function validateSaveRecord(){
	amount = nlapiFormatCurrency(nlapiGetFieldValue('custrecord767'));
	cashAmount = parseFloat(nlapiGetFieldValue('custrecord761'));
	checkAmount = parseFloat(nlapiGetFieldValue('custrecord766'));
	totalAmount = nlapiFormatCurrency(cashAmount + checkAmount);
	
	if (amount == 0) {
		return false;
	}
	
	if (amount == totalAmount) {
		return true;
	} else {
		alert("Total Payment is not equal to invoices paid. Review before saving");
		return false
	}
}