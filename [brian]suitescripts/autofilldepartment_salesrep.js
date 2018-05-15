/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Jul 2016     Dranix
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
	if(name=='custbody144' || name=='class') {
		setDepartmentAndSalesMan();
	}
}

function setDepartmentAndSalesMan() {
	var customer = nlapiGetFieldValue('custbody144');
	var principal = nlapiGetFieldValue('class');
	
	if(customer!='' && principal!='') {
		
		filter = [
          new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
          new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
		];

		columns = [
          new nlobjSearchColumn('custrecord340'), //Sales Rep Column
          new nlobjSearchColumn('custrecord156') //Terms
        ];

		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		if(creditLimit != null && creditLimit[0].getValue('custrecord340')!='') {
			nlapiSetFieldValue('salesrep', creditLimit[0].getValue('custrecord340') || '');
			nlapiSetFieldValue('custbody120', creditLimit[0].getValue('custrecord156') || '');
			nlapiSetFieldValue('department', nlapiLookupField('employee', creditLimit[0].getValue('custrecord340'),'department', false) || '');
		}
	}
}
