/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Sep 2017     DRANIX_JOHN
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */

function massUpdate_deleteInvoice(recType, recId) {
	//var res_credmemo = nlapiLookupField('creditmemo', '446', 'tranid');
			//nlapiLogExecution('ERROR', 'invoice', 'delete invoice ok' + recType + ';' + recId);
		try {
				var rec = nlapiLoadRecord(recType, recId);
				var res_inv = rec.getLineItemCount('links');
				//nlapiGetLineItemValue('links', 'id', 1);

				 if (res_inv==0) {
					 nlapiDeleteRecord('invoice', rec.getId());
				 }
			}
		catch (err)
			{
				nlapiLogExecution('ERROR', 'Error deleting record', 'error deleting1' + ' ' + recType + ' ; ' + recId);
			}
}