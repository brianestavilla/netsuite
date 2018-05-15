function fieldChanged(type, name)
{
	if(name == 'amount')
	{
		var index = nlapiGetCurrentLineItemIndex('item');
		var disc = nlapiGetLineItemValue('item', 'disc', index);
		disc = (disc == null || disc == '') ? 0 : parseFloat(disc);
		var payment = nlapiGetLineItemValue('item', 'amount', index);
		payment = (payment == null || payment == '') ? 0 : parseFloat(payment);
		
		nlapiSetLineItemValue('item', 'amount', index, payment - disc);
		alert(payment - disc);
	}
}