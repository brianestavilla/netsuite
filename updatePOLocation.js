function updatePOLocation(recordtype, recordid){
	var record = nlapiLoadRecord(recordtype, recordid);
record.setFieldValue('custbody55','');
	nlapiSubmitRecord(record, null, true);
}