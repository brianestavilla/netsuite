/*
 * Author : Redemptor Enderes
 * Date Revised : March 14, 2014
 * */

function clientSaveRecord(){
	if(executeValidation()){
		alert('Duplicate check number detected');
		nlapiSetFieldValue('custbody53', '', false);
		return false;
	}
	
	// check date validation - Redem : Jan 13, 2016
	if(nlapiGetRecordId() == ''){
		var checkdate = nlapiGetFieldValue('custbody61');
		var now = new Date();
		now.setHours(0,0,0,0);

		if(checkdate != ''){
			
			if(new Date(checkdate) < now){
				alert('Invalid Check Date!')
				return false;
			}
		}
	}
	//----------------
	
	return true;
}

function fieldChanged(type, name){
	switch(name){
	case 'custbody53' :
		 if(executeValidation()){
			 alert('Duplicate check number detected');
			nlapiSetFieldValue('custbody53', '', false);
		 }
		break;
	case 'account' :
		var account = nlapiGetFieldValue('account');
		nlapiSetFieldValue('custbody191',getLastCheckNumber(account));
		break;
	}
}

function clientPageInit(){
	var account = nlapiGetFieldValue('account');
	nlapiSetFieldValue('custbody191',getLastCheckNumber(account));

	var entity = nlapiGetFieldValue('entity');
	if(entity == '17518' || entity == '723'){
		nlapiSetFieldValue('custbody203','T');
	}
}


function getLastCheckNumber(account){
	var checkNumber = '';
	var column = new Array(
			new nlobjSearchColumn('internalid'), 
			new nlobjSearchColumn('custbody53'));
	column[0].setSort(true);
	var filter = new nlobjSearchFilter('account', null, 'anyof', account);
	var result = getListCheckNumber(filter,column);
	checkNumber = result != '' ? result[0].CheckNumber : '';
	return checkNumber;
}

function getListCheckNumber(filter,column){
	var checkNumberArray = new Array();
	
	var search = nlapiSearchRecord('vendorpayment', null, filter,column);
	for(var i = 0; search != null && i < search.length; i++){
		var CheckNumberObject = new Object();
		CheckNumberObject.CheckNumber = search[i].getValue('custbody53'); //check number
		CheckNumberObject.Account = search[i].getValue('account');
		CheckNumberObject.Status = search[i].getValue('status');
		CheckNumberObject.CheckPrinted = search[i].getValue('custbody190');
		checkNumberArray.push(CheckNumberObject);
	}
	
	return checkNumberArray;
}

function executeValidation(){
	var result = false;
	var recordId = nlapiGetRecordId() || 'null';
	var recordType = nlapiGetRecordType();
	var currentCheckNo = nlapiLookupField(recordType, recordId, 'custbody53') || '';

	var filter = [
      new nlobjSearchFilter('custbody53', null, 'is', nlapiGetFieldValue('custbody53').trim()), 
      new nlobjSearchFilter('account', null, 'is', nlapiGetFieldValue('account'))
    ];

   var columns = new Array(
		new nlobjSearchColumn('status'),
		new nlobjSearchColumn('custbody190')
	);
	
	var checkNumber = getListCheckNumber(filter,columns);
	if(checkNumber.length > 0 && currentCheckNo != nlapiGetFieldValue('custbody53').trim()){
		if(checkNumber[0].Status != 'voided'){ //|| checkNumber[0].CheckPrinted == 'T'){
			//alert('Duplicate check number detected');
			//nlapiSetFieldValue('custbody53', '', false);
			result = true;
		}
	}
	
	return result;
}