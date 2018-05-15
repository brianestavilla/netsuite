/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jan 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
	if(type=='create' || type=='edit') {
		var record = nlapiGetNewRecord();
		nlapiSubmitField('customrecord136', record.getId(),'custrecord889', record.getId());
	}  
}
