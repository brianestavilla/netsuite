function updateUnitsType(recordtype, recordid){
	recordload = nlapiLoadRecord(recordtype, recordid);
	recordload.setLineItemValue('uom', 'conversionrate', 2, 12);
	nlapiSubmitRecord(recordload, null, true);
}