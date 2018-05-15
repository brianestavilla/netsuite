/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Mar 2014     Redemptor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Check Monitoring 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
	nlapiDisableField('name', true); // disable check number field.
}

function clientSaveRecord(){
	var record = nlapiGetRecordId();
	if(record === ""){ //if on create
		var searchFilters = new Array(
				new nlobjSearchFilter('custrecord_txtcvnumber', null, 'is', 
						nlapiGetFieldValue('custrecord_txtcvnumber')),
				new nlobjSearchFilter('name', null, 'is', nlapiGetFieldValue('name'))
				);
		
		if(nlapiSearchRecord('customrecord381', null, searchFilters, null) != null){
			alert('Check Number duplicate!');
			return false;
		}
	}
	return true;
}