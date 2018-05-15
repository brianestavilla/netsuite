/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Dec 2017     DRANIX_JOHN
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdateWTaxITax(recType, recId) {

	var record = nlapiLoadRecord(recType, recId);
	var doc_date = record.getFieldValue('custbody61');

	record.setFieldValue('custbody61','10/28/2017');
	nlapiSubmitRecord(record);

}
