
/**
MODIFY BY: CHRISTIAN GUMERA
DATE: 02-21-2014
DETAILS:
	-Add validation for or number field to avoid re-encoding of OR numbers	
	-Implement separation of concerns, modify field change function,
	transfer validation from field change to validate line and calculations to recalc.
 */
function clientValidateField(type, name, linenum){
	
	var FLD_ORNUMBER = 'custrecord822',
		FLD_CUSTOMER = 'custrecord644',
		FLD_LOCATION = 'custrecord653',
		FRM_DRAFTPAYMENT = 'customrecord237';

	
   if(name == FLD_ORNUMBER && FLD_ORNUMBER != '')
	{
	   if( FLD_LOCATION == '')
		   {
		   		alert('Please fill up the location to verify the OR number');
		   }
		   
	   var filters = [
	       new nlobjSearchFilter( FLD_LOCATION, null, 'anyof', nlapiGetFieldValue( FLD_LOCATION) ),
		   new nlobjSearchFilter( FLD_ORNUMBER, null, 'is', nlapiGetFieldValue( FLD_ORNUMBER) )		   
		   ];
	   	   
	   var columns = [
			new nlobjSearchColumn( 'internalid' ),
			new nlobjSearchColumn( FLD_CUSTOMER )       
	        ];	   
	   
	   var results = nlapiSearchRecord( FRM_DRAFTPAYMENT, null, filters, columns);
	
	   for(var i = 0; results != null && i < results.length ; i++)
		   {
		   		var result = results[i];
		   		var id = result.getValue( 'internalid' );
		   		var customer = result.getText( FLD_CUSTOMER );
		   		
		   		alert('The OR number '+ nlapiGetFieldValue( FLD_ORNUMBER) +' is already in used by Draft Payment #: '+ id +', Customer: ' + customer);
		   		nlapiSetFieldValue( FLD_ORNUMBER, '');
		   		return;
		   }
	}
    return true;
}

function fieldChange(type, name, linenum){

	//payment
	var FLD_ACCOUNT = 'custrecord647',
		COL_PAYAMOUNTDUE = 'custrecord661',
		FLD_CUSTOMER = 'custrecord644',
		FLD_LOCATION = 'custrecord653',
		SUB_APPLY = 'recmachcustrecord667',
		FLD_PAYMENTAMOUNT = 'custrecord760';
	
	var accountfield = nlapiGetFieldValue( FLD_ACCOUNT );	

	switch (name)
	{
	case FLD_ACCOUNT:
		var customer = nlapiGetFieldValue( FLD_CUSTOMER );
		
		var ctr1 = nlapiGetLineItemCount( SUB_APPLY );
		for (var c = 1; c <= ctr1; c++) {
			nlapiRemoveLineItem( SUB_APPLY, c);
		}
		
		if (customer == '') {
			return;
		}
		filters = new nlobjSearchFilter('name', null, 'anyof', customer);
		var result = nlapiSearchRecord('transaction', 'customsearch286', filters);
				
		for (var i = 0; result != null && i < result.length; i++) {
			var account = result[i].getValue('account');
			if (account == accountfield) {
				
				setLineItem(result[i]);					
			}
		}		
		break;
		
	case FLD_PAYMENTAMOUNT:
		cashAmount = parseFloat(nlapiGetFieldValue('custrecord761'));	 
		cashAmount = (cashAmount == 'NaN' ? 0 : cashAmount);
		
		checkAmount = parseFloat(nlapiGetFieldValue('custrecord766'));
		
		totalAmount = cashAmount + checkAmount;

		paymentTotal = parseFloat(nlapiGetFieldValue('custrecord767'));
		
		currentpay =  parseFloat(nlapiGetCurrentLineItemValue( SUB_APPLY, 'custrecord760'));

		checker = paymentTotal + currentpay;
		
		amount = parseFloat(nlapiGetCurrentLineItemValue( SUB_APPLY, name));
		amountdue = parseFloat(nlapiGetCurrentLineItemValue( SUB_APPLY, COL_PAYAMOUNTDUE));
		
		if (amount > 0) {
			nlapiSetCurrentLineItemValue( SUB_APPLY, 'custrecord655', 'T');
		} 
		else {
			nlapiSetCurrentLineItemValue( SUB_APPLY, 'custrecord655', 'F');
		}
		
		if (amountdue < amount) {
			nlapiSetCurrentLineItemValue( SUB_APPLY, 'custrecord760', amountdue);
		}
		
		if (totalAmount < checker) {
			temp1 = -1 * (totalAmount - checker);
			temp2 = currentpay - temp1;
			nlapiSetCurrentLineItemValue( SUB_APPLY, 'custrecord760', 0);
			alert('Payment Exceeds. Input Should be ' + temp2.toFixed(2) + ' and below');
		}
		break;
		
	case 'custrecord_denom1000':
	case 'custrecord_denom500':
	case 'custrecord_denom200':
	case 'custrecord_denom100':
	case 'custrecord_denom50':
	case 'custrecord_denom20':
	case 'custrecord_denomcoins':
		sumDenom();
		break;
	}	
}

function setLineItem( transaction){
		
	var SUB_APPLY = 'recmachcustrecord667',
		FLD_CUSTOMER = 'custrecord644',
		COL_PAYDATE = 'custrecord656',
		COL_PAYCUSTOMER = 'custrecord657',
		COL_PAYREF = 'custrecord659',
		COL_PAYINVOICEAMOUNT = 'custrecord660',
		COL_PAYAMOUNTDUE = 'custrecord661',
		COL_PAYCURRENCY = 'custrecord662',
		COL_PAYSALESREP =  'custrecord850';
	
	var custText = nlapiGetFieldText( FLD_CUSTOMER );
	
	nlapiSelectNewLineItem( SUB_APPLY );
	nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYDATE, transaction.getValue('trandate'));
	if (custText != transaction.getValue('companyname', 'customer')) 
	{
		nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYCUSTOMER, transaction.getValue('companyname', 'customer'));
	}
	nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYREF, transaction.getValue('internalid'));
	nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYINVOICEAMOUNT, parseFloat(transaction.getValue('amount')));
	
	amountdue = parseFloat(transaction.getValue('amount')) - parseFloat(transaction.getValue('amountpaid'));
	nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYAMOUNTDUE, amountdue);
	nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYCURRENCY, transaction.getValue('currency'));
	nlapiSetCurrentLineItemValue( SUB_APPLY, COL_PAYSALESREP, transaction.getValue('salesrep'));
	nlapiCommitLineItem( SUB_APPLY );
}

function sumDenom(){
	var get1000 = nlapiGetFieldValue('custrecord_denom1000') == '' ? 0 : nlapiGetFieldValue('custrecord_denom1000');
	var get500 = nlapiGetFieldValue('custrecord_denom500') == '' ? 0 : nlapiGetFieldValue('custrecord_denom500');
	var get200 = nlapiGetFieldValue('custrecord_denom200') == '' ? 0 : nlapiGetFieldValue('custrecord_denom200');
	var get100 = nlapiGetFieldValue('custrecord_denom100') == '' ? 0 : nlapiGetFieldValue('custrecord_denom100');
	var get50 = nlapiGetFieldValue('custrecord_denom50') == '' ? 0 : nlapiGetFieldValue('custrecord_denom50');
	var get20 = nlapiGetFieldValue('custrecord_denom20') == '' ? 0 : nlapiGetFieldValue('custrecord_denom20');
	var getCoinsAmount = nlapiGetFieldValue('custrecord_denomcoins') == '' ? 0 : nlapiGetFieldValue('custrecord_denomcoins');
	
	var amount1000 = parseInt(get1000) * 1000;
	var amount500 = parseInt(get500) * 500;
	var amount200 = parseInt(get200) * 200;
	var amount100 = parseInt(get100) * 100;
	var amount50 = parseInt(get50) * 50;
	var amount20 = parseInt(get20) * 20;
	
	var totalAmount = amount1000 + amount500 + amount200 + amount100 + amount50 + amount20 + parseFloat(getCoinsAmount);
	
	nlapiSetFieldValue('custrecord761', totalAmount);
}

function validateLine(type){

	var SUBTAB_APPLY = 'recmachcustrecord667',
		FIELD_TOTALPAYMENT = 'custrecord767',
		FIELD_TOTALCASH = 'custrecord761',
		COL_PAYAMOUNT = 'custrecord760',
		FIELD_TOTALCHECK = 'custrecord766';
	
	if(type == SUBTAB_APPLY)
	{
		cashAmount = parseFloat(nlapiGetFieldValue( FIELD_TOTALCASH ));
		paymentAmount = parseFloat(nlapiGetFieldValue( FIELD_TOTALPAYMENT ));
		checkAmount = parseFloat(nlapiGetFieldValue( FIELD_TOTALCHECK ));
		
		totalCashCheck = cashAmount + checkAmount;
		
		var diffAmount = (cashAmount + checkAmount) - paymentAmount;
		if(diffAmount < 0)
		{			
			alert("The current amount left is: " + (diffAmount * -1) );
			nlapiSetCurrentLineItemValue(SUBTAB_APPLY, COL_PAYAMOUNT, (diffAmount * -1) );
			return;
		}
	}
	return true;
}

function recalc(type){
	
	//check
	var SUBTAB_CHECK = 'recmachcustrecord765',
		SUBTAB_APPLY = 'recmachcustrecord667',
		COL_CHKAMOUNT = 'custrecord764',
		FLD_TOTALCHECKAMOUNT = 'custrecord766',
		COL_PAYAMOUNT = 'custrecord760',
		FLD_TOTALPAYAMOUNT = 'custrecord767';

	if(type == SUBTAB_CHECK)
	{
		//for check tab		
		updateField(SUBTAB_CHECK, COL_CHKAMOUNT, FLD_TOTALCHECKAMOUNT);
		
		return;
	}
		
	//for apply tab		
	updateField(SUBTAB_APPLY, COL_PAYAMOUNT, FLD_TOTALPAYAMOUNT);
}

//update target field
function updateField(tabId, colId, targetFieldId)
{
	totalAmount = 0;
	for ( var i = 1; i <= nlapiGetLineItemCount(tabId); i++) {
		if(tabId == 'recmachcustrecord667' && nlapiGetLineItemValue(tabId,'custrecord655',i)!= 'T')
			break;
		
		totalAmount += parseFloat(nlapiGetLineItemValue(tabId, colId, i));
	}
	nlapiSetFieldValue(targetFieldId, totalAmount);	
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
		return false;
	}
}

function InitializeDraftPayment(type){
	if(type == 'create'){
		nlapiDisableLineItemField('recmachcustrecord667', 'custrecord760', true); //Payment amount
		nlapiDisableLineItemField('recmachcustrecord667', 'custrecord655', true); // Apply		
	}
	
	var USER_ARCLERK = '1054';
	
	var	FLD_ACCOUNT = 'custrecord647',
		FLD_CUSTOMER = 'custrecord644',
		FLD_LOCATION = 'custrecord653',
		SUB_APPLY = 'recmachcustrecord667';
	
	var accountfield = nlapiGetFieldValue( FLD_ACCOUNT );
	
	if(type == 'edit' && nlapiGetRole() == USER_ARCLERK)
	{
		var customer = nlapiGetFieldValue( FLD_CUSTOMER );
		//alert(customer);
		var ctr = nlapiGetLineItemCount( SUB_APPLY );
		for (var d = 1; d <= ctr; d++) {
			nlapiRemoveLineItem( SUB_APPLY, d);
		}
		
		if (customer == '') {
			return;
		}
		
		var bal = nlapiLookupField('customer', customer, 'balance', false);
		var consolidated = nlapiLookupField('customer', customer, 'consolbalance');
		var location = nlapiLookupField('customer', customer, 'custentity37');
	
		filters = new nlobjSearchFilter('name', null, 'anyof', customer);
		var result = nlapiSearchRecord('transaction', 'customsearch286', filters);
	
		for (var i = 0; result != null && i < result.length; i++) {
			var account = result[i].getValue('account');
			
			if (account == accountfield) { //accountfield is not define
				setLineItem(result[i]);
			}				 
		}
		
		nlapiSetFieldValue('custrecord645', bal);
		nlapiSetFieldValue('custrecord646', consolidated);
		nlapiSetFieldValue( FLD_LOCATION, location);
	}
}
