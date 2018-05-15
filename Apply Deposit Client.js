function getDeposits(type, name){
	//customerdeposit
	if(name == 'customer'){
		var filter = [
					new nlobjSearchFilter('name', null, 'anyof', nlapiGetFieldValue('customer')),
					new nlobjSearchFilter('mainline', null, 'is', 'T')
					];
		var columns = [
					new nlobjSearchColumn('paymentmethod'),
					new nlobjSearchColumn('number'),
					new nlobjSearchColumn('custbody1'),
					new nlobjSearchColumn('amount')
					];
		var search = nlapiSearchRecord('customerdeposit', null, filter, columns);
		if(search != null){
			for(var i = 0; i < search.length; i++)
			{
				nlapiSelectNewLineItem('deposits');
				nlapiSetCurrentLineItemValue('deposits', 'paymentmethod', search[i].getText('paymentmethod'));
				nlapiSetCurrentLineItemValue('deposits', 'tranid', search[i].getValue('number'));
				nlapiSetCurrentLineItemValue('deposits', 'custbody1', search[i].getText('custbody1'));
				nlapiSetCurrentLineItemValue('deposits', 'paymentamount', search[i].getValue('amount'));
				nlapiCommitLineItem('deposits');
			}
		}
	}
}