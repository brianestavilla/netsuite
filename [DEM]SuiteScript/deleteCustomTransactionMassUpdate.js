/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 May 2014     Redemptor
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {
	
	var checks = getCheck(recId);
	var apply = getApply(recId);
	
	for(var i = 0; checks != '' && i < checks.length; i++){
		nlapiDeleteRecord('customrecord139', checks[i].Internalid);
	}
	
	for(var j = 0; apply != '' && j < apply.length; j++){
		nlapiDeleteRecord('customrecord357_2', apply[j].Internalid);
	}
	
	nlapiDeleteRecord(recType, recId);
}

function getCheck(internalid){
	var check = new Array();
	
	var filter = new nlobjSearchFilter('custrecord101', null, 'anyof', internalid);
	var column = new nlobjSearchColumn('internalid');
	
	var result = nlapiSearchRecord('customrecord139', null, filter, column);
	
	for(var i = 0; result != null && i < result.length; i++){
		var checkObject = new Object();
		checkObject.Internalid = result[i].getValue('internalid');
		check.push(checkObject);
	}
	
	return check;
}


function getApply(internalid){
	var apply = [];
	
	var filter = new nlobjSearchFilter('custrecord789_2', null, 'anyof', internalid);
	var column = new nlobjSearchColumn('internalid');
	
	var result = nlapiSearchRecord('customrecord357_2', null, filter, column);
	
	for(var i = 0; result != null && i < result.length; i++){
		var applyObject = new Object();
		applyObject.Internalid = result[i].getValue('internalid');
		apply.push(applyObject);
	}
	
	return apply;
}

