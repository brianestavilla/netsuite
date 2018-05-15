/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Jul 2015     Dranix
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
	if(type=='create')
	{
               if(nlapiGetFieldValue('customform')=='110') { // 110 = DDI Item Receipt;
		   var invoiceno = nlapiGetFieldValue('custbody156');
		
		  var filter = new nlobjSearchFilter('custbody156', null, 'is',  invoiceno);
	 	  var column = new nlobjSearchColumn('internalid');
	 	  var result = nlapiSearchRecord('itemreceipt', null, filter, column);
		
		  if(result!=null) {
			throw nlapiCreateError('ERROR_SAVE', "Supplier's Invoice No. Already Exist.");
		}
            }
	}
}
