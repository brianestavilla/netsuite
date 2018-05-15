/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Jun 2015     Dranix
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
function userEventBeforeSubmit(type){
	if(nlapiGetFieldValue('customform')=='126') // DDI journal form
	{
        for(var i=1; i<=nlapiGetLineItemCount('line'); i++)
        {
            if(nlapiGetLineItemValue('line','entity',i)==null)
            {
                 throw nlapiCreateError('ERROR_SAVE', 'FAILED : Name is required | ROW : '+i);
            }
        }
    }
}
