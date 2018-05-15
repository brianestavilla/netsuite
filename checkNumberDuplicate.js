function fieldChanged(type, name){
	if(name == 'custbody53')
	{
		var filter = new nlobjSearchFilter('custbody53', null, 'is', nlapiGetFieldValue('custbody53'));
		var search = nlapiSearchRecord('transaction', 'customsearch412', filter);
		if(search != null)
		{ 
			if(search.length > 0)
			{
						alert('Duplicate check number detected');
						nlapiSetFieldValue('custbody53', '', false);
			}
		}
	}
}