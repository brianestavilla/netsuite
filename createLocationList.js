function createList(type, form){
	if(type == 'create') {
		var ENTITY = nlapiGetFieldValue('entity');
		if(ENTITY != null && ENTITY != ''){
			var LOCATIONS = form.addField('custpage_customerlocation', 'select', 'Customer Location');
			LOCATIONS.addSelectOption('', '');
			var filter = new nlobjSearchFilter('custrecord29', null, 'anyof', ENTITY, null);
			var customer_locations = nlapiSearchRecord('customrecord110', null, filter, new nlobjSearchColumn('custrecord754'));
			if(customer_locations != null)
			for(var i = 0; i < customer_locations.length; i++){
				try{
					LOCATIONS.addSelectOption(customer_locations[i].getValue('custrecord754'), customer_locations[i].getText('custrecord754'));
				}catch(e){}
			}
		}
		//form.getField('location').setDisplayType('disabled');
	}
	
}

function amountInWords(type, form){
	if(type == 'create' || type == 'edit'){
		var record = nlapiGetNewRecord();
		var amount = record.getFieldValue('total');
		record.setFieldValue('custbody117', toWords(amount));
	}
}
