function setSession(type,form){
//if(type == 'edit'){
	var record = nlapiGetNewRecord(); // get the currrent record
	var poid = record.getId(); // get the record id
	nlapiLogExecution('DEBUG', 'POID', poid);
	var cont = nlapiGetContext(); // intialize context
	var getval = cont.setSessionObject('poid',poid); // create session object to getval

//}
}