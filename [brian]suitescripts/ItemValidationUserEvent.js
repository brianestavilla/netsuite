/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Mar 2016     Dranix
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
function userEventBeforeSubmit(type) {	
	if(type=='create') {
            if(nlapiGetFieldValue('class')!='7') {
		if(nlapiGetRecordType()=='inventoryitem') {
			//var itemcode = nlapiGetFieldValue('custitem10');
			//var filter = new nlobjSearchFilter('custitem10', null, 'is',  itemcode);
			//var column = new nlobjSearchColumn('internalid');
			//var result = nlapiSearchRecord('item', null, filter, column);
			//if(result!=null) {
			//	throw nlapiCreateError('ERROR', 'Item Code already Exist.',true);
			//}
			
		} else if(nlapiGetRecordType()=='noninventoryitem') {
			var display_name = nlapiGetFieldValue('displayname');
			var filter = new nlobjSearchFilter('displayname', null, 'is',  display_name);
			var column = new nlobjSearchColumn('internalid');
			var result = nlapiSearchRecord('item', null, filter, column);
			
			if(result!=null) {
				throw nlapiCreateError('ERROR_SAVE', 'Item Name already Exist.',true);
			}
		}
          }
	}//end if
}//end function
