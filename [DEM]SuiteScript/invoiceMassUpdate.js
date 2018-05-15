/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 May 2014     Redemptor
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {	
	//var customer = nlapiLookupField(recType, recId, 'entity');
	//var salesman = getSalesman(customer);
	//nlapiSubmitField(recType, recId, 'salesrep', salesman);
	var record = nlapiLoadRecord(recType, recId);
	
	nlapiSubmitRecord(record, null, true);
}

function getSalesman(customer){
	var salesman = '';
	var filter = new nlobjSearchFilter('custrecord152', null, 'anyof', customer);
	var column = new nlobjSearchColumn('custrecord340');
	var result = nlapiSearchRecord('customrecord150', null, filter, column);
	
	if(result != null){
		salesman = result[0].getValue('custrecord340');
	}
	
	return salesman;
}