/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 May 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum){
	if(name=='entity') {
		var customer = nlapiGetFieldValue('entity');
		var customer_category = nlapiLookupField('customer', customer, 'custentity13', true);
		var department='',
			operation='';

		if(customer_category=='Extruck') {
			var principal = nlapiGetFieldValue('class');
			var filter = new Array(
					new nlobjSearchFilter('custrecord152', null, 'is', customer),
					new nlobjSearchFilter('custrecord153', null, 'is', principal)
			);

			var columns = new nlobjSearchColumn('custrecord340'); //Sales Rep Column

			var creditlimit = nlapiSearchRecord('customrecord150', null, filter, columns);

			department = nlapiLookupField('employee', (creditlimit==null) ? 0 : creditlimit[0].getValue('custrecord340'), 'department', false); // department;			
			operation='4'; //Extruck
            nlapiSetFieldValue('department', department);
            nlapiSetFieldValue('custbody69', operation);
		}
	}
}

function CM_pageinit(type) {
	if(type == 'create') {
		nlapiSetFieldValue('custbody8',nlapiGetUser());
    }
}