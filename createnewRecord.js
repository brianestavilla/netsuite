function createnewRecord(type,form){
	var empval = nlapiGetFieldText('employee');
	var addressval = nlapiGetFieldValue('memo');
	var datebirthval = nlapiGetFieldValue('trandate');

	if(type == 'create'){
	
	var createrec = nlapiCreateRecord('customrecord97');
	
	createrec.setFieldValue('custrecord7',empval);
	createrec.setFieldValue('custrecord8',addressval);//address
	createrec.setFieldValue('custrecord9',datebirthval);//date of birth
	createrec.setFieldValue('custrecord10','T');//employee
	
	var id = nlapiSubmitRecord(createrec);
	}
}