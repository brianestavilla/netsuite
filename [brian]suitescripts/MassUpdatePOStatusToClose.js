/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Feb 2016     Dranix
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {
	var columns = [ new nlobjSearchColumn('status') ];
	filter = [ new nlobjSearchFilter('custbody121', null, 'anyof', recId) ];
	var result = nlapiSearchRecord('vendorbill',null, filter, columns);
	nlapiLogExecution('ERROR', 'STATUS', result.getValue('status'));
	if(result!=null) {
		var memo = nlapiLookupField(recType, recId, 'memo');
		var record = nlapiLoadRecord(recType, recId);
		record.setFieldValue('memo', memo);
		for(var i=1, counter=record.getLineItemCount('item'); i<=counter; i++) {
			record.setLineItemValue('item', 'isclosed', i, 'T');
		}
		nlapiSubmitRecord(record);
	}
}
