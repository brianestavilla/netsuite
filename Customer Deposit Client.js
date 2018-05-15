function fieldChange(type, name){
	if(name == CUSTOMER){
		nlapiSetFieldValue(LOCATION, nlapiLookupField('customer', nlapiGetFieldValue(CUSTOMER), 'custentity37', false));
	}
}