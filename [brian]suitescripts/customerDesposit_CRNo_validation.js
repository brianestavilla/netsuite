/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Jun 2015     Brian
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
function clientFieldChanged_CP_CD_VALIDATION(type, name, linenum){
	
	/*
	** Triggered when the CR No. Field is changed, validates the crno input.
	*/
	if(name=='custbody150'){
	var crno = nlapiGetFieldValue('custbody150');
		if(isNaN(crno)) {
			alert('This field must be numbers');
		}
	}
	
	if(name=='customer') {
		var customer = nlapiGetFieldValue('customer');
		var principal = nlapiGetFieldValue('class');
		if(principal!='' && customer!='') {
			var filter = new Array(
					new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
					new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
			);
			
			var columns = new Array(
					new nlobjSearchColumn('custrecord340')	//Sales Rep Column
			);
		
			var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
			
			if(creditLimit!=null && creditLimit[0].getValue('custrecord340')!='') {
				nlapiSetFieldValue('custbody186',creditLimit[0].getValue('custrecord340'));
              	//nlapiSetFieldValue('department',nlapiLookupField('employee', creditLimit[0].getValue('custrecord340'), 'department', false));
			} else {
				alert('No Sales Representative Setup. Kindly Contact the Administrator');
			}
		}
	}

	if(name == 'custbody186') {
      if(nlapiGetFieldValue('custbody186') != '') {
      	nlapiSetFieldValue('department', nlapiLookupField('employee', nlapiGetFieldValue('custbody186'), 'department', false));
      }
    }

	if(name=='class') {
		var customer = nlapiGetFieldValue('customer');
		var principal = nlapiGetFieldValue('class');
		if(customer!='' && principal!='') {
			var filter = new Array(
				new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
				new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
			);
			
			var columns = new Array(
					new nlobjSearchColumn('custrecord340')	//Sales Rep Column
			);
		
			var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
			
			if(creditLimit!=null && creditLimit[0].getValue('custrecord340')!='') {
				nlapiSetFieldValue('custbody186',creditLimit[0].getValue('custrecord340'));
              	//nlapiSetFieldValue('department',nlapiLookupField('employee', creditLimit[0].getValue('custrecord340'), 'department', false));
			} else {
				alert('No Sales Representative Setup. Kindly Contact the Administrator');
			}
		} else {
			alert('Kindly Choose a Customer');
		}
	}
}