function applyWT(type, form){
		if(name == 'item')
		try{
			var apply = nlapiLookupField('vendor', nlapiGetFieldValue('entity'), 'custentity52', false);		
			nlapiSetCurrentLineItemValue('item', 'custcol_4601_witaxapplies',apply ); 
			nlapiSetCurrentLineItemValue('expense', 'custcol_4601_witaxapplies', apply); 
		}catch(e)
		{
			alert('Please provide a vendor first');
		}
return true;
}
function beforeSave()
{
	alert(nlapiGetLineItemCount('expense'));
	alert(nlapiGetLineItemCount('item'));
	return true;
}