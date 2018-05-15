/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Jan 2016     Dranix
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
function userEventBeforeSubmit(type) {
	if(type=='create') {
		var columns = [ new nlobjSearchColumn('firstname') ];
		var filter = [ 
		               new nlobjSearchFilter('firstname', null, 'is', nlapiGetFieldValue('firstname')),
		               new nlobjSearchFilter('lastname', null, 'is', nlapiGetFieldValue('lastname'))
		               ];
		var results = nlapiSearchRecord('employee', null, filter, columns);
	    if(results!=null) {
	    	throw nlapiCreateError('ERROR_SAVE', "Employee Already Exist.");
	    }
	}
}
