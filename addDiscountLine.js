function totalDiscount(type, name){
	var record = nlapiGetNewRecord(),
		linecount = record.getLineItemCount('item'),
		discount = 0; //record.getFieldValue('custbody127')
	for(var i = 1; i <= linecount; i++)
	{
		if(record.getLineItemValue('item', 'item', i) != '595')
		{
			var count = (record.getLineItemValue('item', 'custcol10', i) == null || record.getLineItemValue('item', 'custcol10', i) == '') ? 0 : record.getLineItemValue('item', 'custcol10', i);
			discount += parseFloat(count);
		}
	}
	var principal = record.getFieldValue('class');
	if(principal == '3' || principal == '13' || principal == '12' || principal == '7')
	{
		var line = nlapiFindLineItemValue('item', 'item', '20777');
		itemid = '20777';
	}
	else{
		var line = nlapiFindLineItemValue('item', 'item', '595');
		itemid = '595';
	}
	if((line > -1) && (discount > 0))
	{
		record.removeLineItem('item', line);
		
		record.setLineItemValue('item', 'item', linecount, itemid);
		record.setLineItemValue('item', 'rate', linecount, discount * -1);
		record.setLineItemValue('item', 'taxcode', linecount, '5');
		record.setLineItemValue('item', 'amount', linecount, discount* -1);
		record.setLineItemValue('item', 'grossamt', linecount, discount* -1);
		record.setLineItemValue('item', 'custcol10', linecount, discount* -1);
	}
	else if(discount > 0)
	{
		record.setLineItemValue('item', 'item', linecount + 1, itemid);
		record.setLineItemValue('item', 'rate', linecount + 1, discount* -1);
		record.setLineItemValue('item', 'taxcode', linecount + 1, '5');
		record.setLineItemValue('item', 'amount', linecount + 1, discount* -1);
		record.setLineItemValue('item', 'grossamt', linecount + 1, discount* -1);
		record.setLineItemValue('item', 'custcol10', linecount + 1, discount* -1);
	}
}