function updateName(recordtype, recordid){
        var record = nlapiLoadRecord(recordtype, recordid);
	nlapiSubmitRecord(record, null, true);
}