function pageInit(type, name){
	try{
		var emp = nlapiLoadRecord('employee', nlapiGetUser()),
			solocation = emp.getFieldValue('custentity39'),
			vlocation = emp.getFieldValue('custentity26');
		
		try{
			rec = nlapiLoadRecord('salesorder',nlapiGetFieldValue('createdfrom'));
			rectype = 'salesorder';
		}catch(e){
			rectype = '';
		}
		
		if(rectype == 'salesorder'){
			if(solocation == null || solocation == '')alert("Please contact your administrator for the Fulfillment Location");
		}else{
			if(vlocation == null || vlocation == '')alert("Please contact your administrator for the Return Location");
		}

	}catch(e){
	}
}
function fieldChanged(type, name){
	if(name == 'location'){
		var clocation = nlapiGetCurrentLineItemValue('item', 'custcol3');
		if(clocation != nlapiGetCurrentLineItemValue('item', 'location') && nlapiGetCurrentLineItemValue('item', 'location') != null)
			nlapiSetCurrentLineItemValue('item', 'location', clocation);
	}
}