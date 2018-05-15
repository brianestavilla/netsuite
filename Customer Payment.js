function fieldChange(type, name){
}

function hideFields(type, form){
if(type == 'create'){
	form.getField('payment').setDisplayType('hidden');
	form.getField('autoapply').setDisplayType('hidden');
form.getSubList('credit').setDisplayType('hidden');
}
}

function checkifBalance(){
	invoice_amount = 0;
	deposit_amount = 0;
	var invoice_count = nlapiGetLineItemCount('apply');
	var deposit = nlapiGetLineItemCount('deposit');
	for(var i = 1; i <= invoice_count; i++){
		if(nlapiGetLineItemValue('apply', 'apply', i) == 'T')
			invoice_amount += parseFloat(nlapiGetLineItemValue('apply', 'amount', i));
	}
	for(var i = 1; i <= deposit; i++){
		if(nlapiGetLineItemValue('deposit', 'apply', i) == 'T')
			deposit_amount += parseFloat(nlapiGetLineItemValue('deposit', 'amount', i));
	}
	if(deposit_amount < invoice_amount){
		alert('Invoice Amount should be equal to the total Deposit Amount');
		return false;
	}
	return true;
	
		
}