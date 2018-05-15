/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Jun 2015     Dranix
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
function userEventBeforeSubmit(type)
{
	if(type=='create') {
		var invoiceno = nlapiGetFieldValue('tranid');
		var filter = new nlobjSearchFilter('tranid', null, 'is',  invoiceno);
		var column = new nlobjSearchColumn('internalid');
		var result = nlapiSearchRecord('vendorbill', null, filter, column);
		if(result!=null)
		{
			throw nlapiCreateError('ERROR_SAVE', "Supplier's Invoice No. Already Exist.");
		}
	}
	
	/**
	** TOTAL DISCOUNT COMPUTATION
	**/
	
//	if(nlapiGetRecordType()=='vendorbill') {
//		var record = nlapiGetNewRecord();
//		var linecount = record.getLineItemCount('item');
//		var total_discount = 0;
//		var totaltax = 0;
//		
//		for(var i=1; i<=record.getLineItemCount('item'); i++) {
//			total_discount+= parseFloat(record.getLineItemValue('item', 'custcol10', i));
//			totaltax += parseFloat(record.getLineItemValue('item', 'tax1amt', i));
//		}
//		
//		record.setFieldValue('custbody127', parseFloat(total_discount).toFixed(2));
//		record.setFieldValue('taxtotal', parseFloat(totaltax).toFixed(2));
//	}
	
}