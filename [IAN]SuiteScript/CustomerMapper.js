/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00        Jan 032015     IAN
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */

function userEventBeforeSubmit(type){
		
	//load record
	var record = nlapiGetNewRecord();	
	
	//if source is CSV
	//if(record.getFieldValue('source') != 'CSV')	return;
	
	//get del monte customer
	var principalCustomer = record.getFieldText('entity');
	nlapiLogExecution('DEBUG', 'FALSE CUSTOMER', principalCustomer);
		
	//match mapping record
	var netsuiteCustomer = getNetsuiteCustomer( principalCustomer );
	
	//replace customer field with netsuite customer id
	nlapiSetFieldValue('entity', netsuiteCustomer);
	
	nlapiLogExecution('DEBUG', "Netsuite Customer", principalCustomer);
}

function getNetsuiteCustomer( principalCustomerId)
{
	var MAPPING_TABLE_ID = 'customrecord405';
	var CUSTOMER_PRINCIPAL_CODE_FIELD = 'custrecord881';
	var MAPPING_TABLE_CUSTOMER_FIELD = 'custrecord883';
	
	var filters = new Array(
			new nlobjSearchFilter(CUSTOMER_PRINCIPAL_CODE_FIELD , null, 'anyof', principalCustomerId)	
	);
	
	var columns = new Array(
			new nlobjSearchColumn(MAPPING_TABLE_CUSTOMER_FIELD)
	);
	
	return nlapiSearchRecord(MAPPING_TABLE_ID, null, filters, columns); 
}