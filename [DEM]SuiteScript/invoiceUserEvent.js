/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Aug 2014     Redemptor
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
  if (type == 'create'){
	var record = nlapiGetNewRecord();
	var count = record.getLineItemCount('item');

	for(var i = 1; i <= count; i++){
		record.setLineItemValue('item', 'custcol33', i, nlapiLookupField('inventoryitem', record.getLineItemValue('item', 'item', i), 'custitem10'));
	}

  	var customerid = nlapiGetFieldValue('entity');
  	nlapiSetFieldValue('custbody218', nlapiLookupField('customer',customerid,'custentity13'));
}
}
