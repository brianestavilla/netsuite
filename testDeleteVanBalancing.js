/**
 * Module Description
 * 
 * Version    Date           		 Author           Remarks
 * 1.00     28 November 2014         Brian
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {

	var VAN_BALANCING_REC = 'customrecord164',
		PURCHASE_REQUEST_REC = 'customrecord111',
		JOB_ORDER_REC = 'customrecord220',
		VAN_BALANCING_LINE_REC = 'customrecord167',
		PURCHASE_REQUEST_LINE_REC = 'customrecord112 ';


	var internalid = nlapiLookupField(recType, recId, 'internalid');
	if(recType == VAN_BALANCING_REC)
	{

		var records = searchDependencyRecords(VAN_BALANCING_LINE_REC, internalid);

		deleteChild( records, VAN_BALANCING_LINE_REC);
	}
	else if(recType == PURCHASE_REQUEST_REC)
	{

		deleteChild(searchDependencyRecords(PURCHASE_REQUEST_LINE_REC, internalid), PURCHASE_REQUEST_LINE_REC);
	}

	nlapiDeleteRecord(recType, recId);
}
function deleteChild(childRecords, recType)
{
	
	for(var i = 0; childRecords != '' && i < childRecords.length; i++)
	{
		nlapiDeleteRecord(recType, childRecords[i].Internalid);
	}
}
function searchDependencyRecords(childTable, primaryKey)
{
	var foreign_key_field;
	
	if(childTable == 'customrecord167') foreign_key_field = 'custrecord275';
	if(childTable == 'customrecord112') foreign_key_field = 'custrecord33';
		
	var record = [];
	var filter = new nlobjSearchFilter(foreign_key_field, null, 'anyof', primaryKey);
	var column = new nlobjSearchColumn('internalid');
	var result = nlapiSearchRecord( childTable, null, filter, column);
	for(var i = 0; result != null && i < result.length; i++){
		var recordObject = new Object();
		recordObject.Internalid = result[i].getValue('internalid');
		record.push(recordObject);
	}
	nlapiLogExecution('DEBUG', 'Record Type', childTable);
	return record;		
}