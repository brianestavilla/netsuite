/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Feb 2016     Dranix
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {
	var column = [ new nlobjSearchColumn('internalid') ];
	var filter = [ new nlobjSearchFilter('custrecord528', null, 'anyof', recId) ];
	var result = nlapiSearchRecord('customrecord224',null, filter, column);
	if(result!=null) {
		for(var i=0, counter=result.length ; i<counter; i++) {
			nlapiDeleteRecord('customrecord224', result[i].getValue('internalid'));
		}
	}
	nlapiDeleteRecord(recType, recId);
}
