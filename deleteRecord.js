function deleteRecord(recordtype, recordid){
	try{
		nlapiDeleteRecord(recordtype, recordid);
	}
	catch (e) {
		nlapiLogExecution( 'DEBUG', 'system error', e.getCode() + '\n' + e.getDetails() )
	}
	
}