function pageInit(type, name)
{
	var linecount = nlapiGetLineItemCount('apply');
	var refnum = '';
	for(var i = 1; i <= linecount; i++){
		//if(nlapiGetLineItemValue('apply', 'apply', i) == 'T')
		refnum = nlapiGetLineItemValue('apply', 'refnum', i);
		if(refnum != '')
		{
			var filter = [
							new nlobjSearchFilter('tranid', null, 'startswith', refnum),
							new nlobjSearchFilter('mainline', null, 'is', 'T')
						];
			var columns = [
							new nlobjSearchColumn('location'),
							new nlobjSearchColumn('department'),
							new nlobjSearchColumn('class')
						];
			try{
				var search = nlapiSearchRecord('vendorbill', null, filter, columns);
				if(search != null)
				{
					nlapiSetFieldValue('department', search[0].getValue('department'));
					nlapiSetFieldValue('location', search[0].getValue('location'));
					nlapiSetFieldValue('class', search[0].getValue('class'));
				}
			}catch(e){}
		}
	}
}

function beforeLoad(type, name)
{
if(type == 'create')
{
	var record = nlapiGetNewRecord();
	var linecount = record.getLineItemCount('apply');
	var refnum = '';
	for(var i = 1; i <= linecount; i++)
		if(record.getLineItemValue('apply', 'apply', i) == 'T')
			refnum = record.getLineItemValue('apply', 'refnum', i);
	
	if(refnum != '')
	{
		var filter = [
						new nlobjSearchFilter('tranid', null, 'startswith', refnum),
						new nlobjSearchFilter('mainline', null, 'is', 'T')
					];
		var columns = [
						new nlobjSearchColumn('location'),
						new nlobjSearchColumn('department'),
						new nlobjSearchColumn('class')
					];
		var search = nlapiSearchRecord('vendorbill', null, filter, columns);
		if(search != null)
		{
			record.setFieldValue('department', search[0].getValue('department'));
			record.setFieldValue('location', search[0].getValue('location'));
			record.setFieldValue('class', search[0].getValue('class'));
		}
	}
}
}