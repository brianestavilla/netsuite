/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Apr 2014     MYMEG
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

var APPLY_SUB_TAB = 'recmachcustrecord667';

function userEventAfterSubmit(type){
  var draftPayment = nlapiGetNewRecord();
  var paymentid = 0;
  if(type == 'create')
	  {	  		  	
	  	var line = draftPayment.getLineItemCount(APPLY_SUB_TAB);
	  	
	  	for ( var int = 1; int <= line.length; int++) {
	  		paymentid = draftPayment.getLineItemValue( APPLY_SUB_TAB, 'custrecord733', line) || draftPayment.getLineItemValue( APPLY_SUB_TAB, 'custrecord732', line);
			nlapiSubmitField( 'customerpayment', paymentid, 'custbody136', draftPayment.getId(), false);
		}
	    nlapiLogExecution('Debug', 'DRAFT Payment created ' + draftPayment.getId(), 'payment ' + paymentid);
	  }
}
