/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Jun 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeSubmit(type, form, request) {
	var record = nlapiGetNewRecord();
	var total_discount = 0;
	var totaltax = 0;
	
	for(var i=1; i<=record.getLineItemCount('item'); i++) {
		total_discount+= parseFloat(record.getLineItemValue('item', 'custcol10', i));
		totaltax += parseFloat(record.getLineItemValue('item', 'tax1amt', i));
	}
	
	record.setFieldValue('custbody127', parseFloat(total_discount).toFixed(2));
	record.setFieldValue('taxtotal', parseFloat(totaltax).toFixed(2));
}
