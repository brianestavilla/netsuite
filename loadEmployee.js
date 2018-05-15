function loadEmployee(type, name) {
	if(name == 'custrecord787'){
		empName = nlapiGetCurrentLineItemValue('recmachcustrecord790', 'custrecord787');
		/*
		department = nlapiLookupField('vendor', empName, 'custentity29', false);
		principal = nlapiLookupField('vendor', empName, 'custentity23', false);
		location1 = nlapiLookupField('vendor', empName, 'custentity30');
		nlapiSetFieldValue('custrecord159', department);
		nlapiSetFieldValue('custrecord160', principal);
		nlapiSetFieldValue('custrecord161', location1);
		*/
		var tempcash = nlapiLookupField('vendor', empName, 'custentity8', false);
		cashbond = (tempcash == null || tempcash == '') ? 0.00 : tempcash;
		nlapiSetCurrentLineItemValue('recmachcustrecord790','custrecord789', cashbond, false);
		nlapiSetCurrentLineItemValue('recmachcustrecord790', 'custrecord788', 0, false);
	}
	else if(name == 'custrecord788' || name == 'custrecord789'){
		incentive = nlapiGetCurrentLineItemValue('recmachcustrecord790', 'custrecord788');
		cashbond = nlapiGetCurrentLineItemValue('recmachcustrecord790', 'custrecord789');
		if(parseFloat(incentive) <= parseFloat(cashbond)) 
		{
			alert('Incentive value should be greater than Cash Bond');
			nlapiSetCurrentLineItemValue('recmachcustrecord790', 'custrecord788', 0, false);
		}else{
			nlapiSetCurrentLineItemValue('recmachcustrecord790', 'custrecord791', (incentive-cashbond), false);
		}
	}
}