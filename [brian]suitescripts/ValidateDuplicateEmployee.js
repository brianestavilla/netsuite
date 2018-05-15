/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Jan 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){
	var columns = [ new nlobjSearchColumn('firstname') ];
	var filter = [ 
	               new nlobjSearchFilter('firstname', null, 'is', nlapiGetFieldValue('firstname')),
	               new nlobjSearchFilter('lastname', null, 'is', nlapiGetFieldValue('lastname'))
	               ];
	var results = nlapiSearchRecord('employee', null, filter, columns);
    if(results!=null) {
    	alert('Employee already Exist.');
    	return false;
    } else { return true; }
}
