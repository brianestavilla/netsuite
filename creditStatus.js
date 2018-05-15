function afterSubmit(type, form){
	var newRecord = nlapiGetNewRecord(),
		internalid1 = newRecord.getId(),
		recordtype = newRecord.getRecordType(),
		ctx = nlapiGetContext(),
		form = newRecord.getFieldValue('customform'),
		entity = ctx.getSetting('SCRIPT', 'custscript22'),
		total = parseFloat(newRecord.getFieldValue('total'));
	if(type == 'create' || type=='edit' && form != '170'){ // 170 = Free Goods   ----- old condition - if(type == 'create' && form != '119') ------- -dem ; add type edit; added by brian 12/16/2015
		//OVERDUE AMOUNT
		var filter = new Array(
					new nlobjSearchFilter('class', null, 'anyof', newRecord.getFieldValue('class'), null),
					new nlobjSearchFilter('name', null, 'anyof', newRecord.getFieldValue(entity), null)
					);
		var columns = new nlobjSearchColumn('amountremaining', null, 'sum');
		var overdue = nlapiSearchRecord(null, 'customsearch100', filter, columns);
		
		
		filter = new Array(new nlobjSearchFilter('name', null, 'anyof', newRecord.getFieldValue(entity), 'group'),
					new nlobjSearchFilter('class', null, 'anyof', newRecord.getFieldValue('class'), 'group')
					);
		columns = new nlobjSearchColumn('amountremaining', null, 'sum');
		var creditUse = nlapiSearchRecord(null, 'customsearch111', filter, columns);
		
		//LAST PURCHASE
		
		if(creditUse != null) lastpurchase = '';
		else lastpurchase = null
		
		/*if(newRecord.getFieldValue(entity) != null)
			var id = nlapiLookupField('customer', newRecord.getFieldValue(entity), 'custentity24', false);
		else id = null;
		if(id != null && id != '')
			var lastpurchase = (nlapiLookupField('invoice', id, 'amountremaining') > 0) ? nlapiLookupField('invoice', id, 'amountremaining') : null;
		else lastpurchase = null
		*/
		
		//CREDIT LIMIT
		filter = new Array(
					new nlobjSearchFilter('custrecord152', null, 'anyof', newRecord.getFieldValue(entity), null),
					new nlobjSearchFilter('custrecord153', null, 'anyof', newRecord.getFieldValue('class'), null),
					new nlobjSearchFilter('custrecord153', null, 'anyof', newRecord.getFieldValue('class'), null)
					);
		columns = new nlobjSearchColumn('custrecord154');
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		
		if(creditUse != null)
				var amount = (creditUse[0].getValue('amount', null, 'sum') == null || creditUse[0].getValue('amount', null, 'sum') == '') ? 0 : parseFloat(creditUse[0].getValue('amount', null, 'sum')); 
		else var amount = 0;
			
		if(creditLimit != null)
		if((amount + total) > parseFloat(creditLimit[0].getValue('custrecord154')) || overdue != null || lastpurchase != null)
		{
			newRecord.setFieldValue('custbody47', '2');
			((amount + total) > parseFloat(creditLimit[0].getValue('custrecord154')))  ? newRecord.setFieldValue('custbody60', 'T') : newRecord.setFieldValue('custbody60', 'F');
			(overdue != null) ? newRecord.setFieldValue('custbody58', 'T') : newRecord.setFieldValue('custbody58', 'F');
			(lastpurchase != null) ? newRecord.setFieldValue('custbody59', 'T') : newRecord.setFieldValue('custbody59', 'F');
		}
		else
		{
			newRecord.setFieldValue('custbody47', '1');
			if((amount + total) <= parseFloat(creditLimit[0].getValue('custrecord154'))) newRecord.setFieldValue('custbody60', 'F');
			if(overdue == null) newRecord.setFieldValue('custbody58', 'F');
			if(lastpurchase == null) newRecord.setFieldValue('custbody59', 'F');
		}
	}
}