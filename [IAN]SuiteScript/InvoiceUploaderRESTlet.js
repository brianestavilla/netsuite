/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00        Jan 032015     IAN
 *
 */


function getRESTlet(dataIn) {
	return "success";
	/*return getListId(dataIn.list.type, dataIn.value);*/
}

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function postRESTlet(dataIn) {

	var OPERATION = 'custbody69',
		EXTERNAL_INVOICE_NO = 'custbody178';
	
	var record = nlapiCreateRecord('invoice'); //20
	
	record.setFieldValue('entity', dataIn.customer);
	record.setFieldValue('location', dataIn.location);
	record.setFieldValue( OPERATION, dataIn.operation);
	record.setFieldValue('department', dataIn.department);
	record.setFieldValue(EXTERNAL_INVOICE_NO, dataIn.externalInvoice);
	record.setFieldValue('trandate', dataIn.date);
	
	var linecount = dataIn.items.length;
	
	for(var i = 1; i <= linecount; i++){
		record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
		record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].quantity);
		record.setLineItemValue('item', 'amount', i, dataIn.items[i-1].amount);
		record.setLineItemValue('item', 'taxcode', i, '6');
	}	

	return nlapiSubmitRecord(record, null, true); //20
	
}

function searchItem( itemcode )
{
	filter = new nlobjSearchFilter('custitem10', null, 'anyof', itemcode, null);
	
	column = new nlobjSearchColumn('internalid');
	
	return nlapiSearchRecord('inventoryitem', null, filter, columns); //20
}

function getListId(type, value) {
	var filter = new nlobjSearchFilter('name', null, 'anyof', value);		
	return nlapiSearchRecord(type, null, filter, null).getValue('internalid');
}
