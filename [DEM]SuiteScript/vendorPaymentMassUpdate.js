/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Mar 2014     Redemptor
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {
	var record = nlapiLoadRecord(recType, recId);
	var internalid = record.getId();
	var bills = getBills(record);
	if(bills != ''){
		for(var i = 0; i < bills.length; i++){
			nlapiLogExecution('DEBUG', 'Bills', bills[i]);
			//custbody193 = sandbox
			//custbody192 = live
			nlapiSubmitField('vendorbill', bills[i].Internalid, 'custbody192', internalid);
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
