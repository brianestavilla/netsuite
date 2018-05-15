function afterSubmit(type, form)
{
	if(type == 'create')
	{
		var record = nlapiGetNewRecord(),
			record_type = record.getRecordType(),
			record_id = record.getId(),
			location = record.getFieldText('location'),
			branch = location.substring(0, 3).toUpperCase(),
			filter = new nlobjSearchFilter('custrecord780', null, 'startswith', branch),
			column = new Array(new nlobjSearchColumn('custrecord781'), new nlobjSearchColumn('internalid'))
		;
		nlapiLogExecution('DEBUG', 'Branch', branch);
		var search = nlapiSearchRecord('customrecord357', null, filter, column);
		nlapiLogExecution('DEBUG', 'Branch', branch + " " + 'test');
		if(search != null)
		{
			//record.setFieldValue('tranid', branch + "-00" + search[0].getValue('custrecord781'));
			
			var prefix = location.split(':')[1].substring(0, 4).toUpperCase();
			
			record.setFieldValue('tranid', prefix  + "-00" + search[0].getValue('custrecord781'));
			
			nlapiSubmitField('customrecord357', search[0].getValue('internalid'), 'custrecord781', 

			parseInt(search[0].getValue('custrecord781')) + 1);
			
			nlapiLogExecution('DEBUG', 'Branch', branch + "-00" + search[0].getValue('custrecord781'));
		}
		
	}
}