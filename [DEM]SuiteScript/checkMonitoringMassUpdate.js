/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       31 Mar 2014     Redemptor		To mass update the Link from CV# field.
 *
 */

/**
 * @param {String} recType Record type internal id
 * @param {Number} recId Record internal id
 * @returns {Void}
 */
function massUpdate(recType, recId) {
	/*var fields = ['name','custrecord_txtcvnumber'];
	var lookupValue = nlapiLookupField(recType, recId, fields);
	var checkNumber = lookupValue.name;
	var cvnumber = lookupValue.custrecord_txtcvnumber;
	
	var filter = [new nlobjSearchFilter('tranid',null, 'is' , cvnumber), 
	          new nlobjSearchFilter('custbody53', null, 'is', checkNumber)];
	
	var column = new nlobjSearchColumn('internalid');
	
	var getResult = nlapiSearchRecord('vendorpayment', null, filter, column);
	
	nlapiSubmitField(recType, recId, 'custrecord877', getResult[0].getValue('internalid'));*/
	
	//var record = nlapiLoadRecord(recType, recId);
	//nlapiSubmitRecord(record, null, true);
	
	nlapiSubmitField(recType, recId, 'custrecord846', 'F');
	
}
