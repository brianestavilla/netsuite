/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Sep 2016     Dranix
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
function clientFieldChanged_setLegalName(type, name, linenum) {
	if(name == 'companyname') {
		nlapiSetFieldValue('legalname', nlapiGetFieldValue('entityid'));
	}
}
