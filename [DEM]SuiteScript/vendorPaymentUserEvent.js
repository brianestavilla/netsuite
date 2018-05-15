/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Mar 2014     Redemptor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Vendor Payment
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
	if(type == 'create' || type == 'edit'){ 
		var record = nlapiGetNewRecord();
		var internalid = record.getId();
		var bills = getBills(record);
		if(bills != ''){
			for(var i = 0; i < bills.length; i++){
				nlapiSubmitField('vendorbill', bills[i].Internalid, 'custbody192', internalid);
			}	
		}
	}
}

function getBills(record){
	var billArray = new Array();
	
	for(var i = 1; i <= record.getLineItemCount('apply'); i++){
		var billObject = new Object();
		billObject.Apply = record.getLineItemValue('apply', 'apply', i);
		if(billObject.Apply == 'T'){
			billObject.Internalid = record.getLineItemValue('apply', 'internalid', i);
			billArray.push(billObject);
		}
	}
	
	return billArray;
}
