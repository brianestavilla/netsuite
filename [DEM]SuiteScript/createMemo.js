/*
		Date : Feb. 24, 2014
		Author : Redemptor Enderes
		Description : To create a standard credit memo.
*/

// Main - Primary Information
var draftMain_fieldCreditNum = 'custrecord97';
var draftMain_fieldCustomerSalesman = 'custrecord99';
var draftMain_fieldDate = 'custrecord117';
var draftMain_fieldPostingPeriod = 'custrecord118';
var draftMain_fieldRemarks = 'custrecord120';
var draftMain_fieldAccount = 'custrecord824';
var draftMain_fieldSalesRep = 'custrecord122';
//Main - Classification
var draftMain_fieldDepartment = 'custrecord124';
var draftMain_fieldPrincipal = 'custrecord126';
var draftMain_fieldExternalInv = 'custrecord379';
var draftMain_fieldLocation = 'custrecord128';
var draftMain_fieldOperation = 'custrecord833';

// CM Items Sublist
var draftCmItem_sublist = 'recmachcustrecord101';
var draftCmItem_sublist_fieldItems = 'custrecord104';
var draftCmItem_sublist_fieldPrincipalorVendor = 'custrecord830';
var draftCmItem_sublist_fieldAmount = 'custrecord112';
var draftCmItem_sublist_fieldTaxCode = 'custrecord109';
var draftCmItem_sublist_fieldGrossAmount = 'custrecord110';
var draftCmItem_sublist_fieldTaxRate = 'custrecord111';
var draftCmItem_sublist_fieldTaxAmount = 'custrecord113';
var draftCmItem_sublist_fieldMemo = 'custrecord893'; //added by Brian 10/7/2016 Line Item Memo

// Apply Sublist
var draftApply_sublist = 'recmachcustrecord789_2';
var draftApply_sublist_fieldApply = 'custrecord780_2';
var draftApply_sublist_fieldDate = 'custrecord781_2';
var draftApply_sublist_fieldSubcustomer = 'custrecord782_2';
var draftApply_sublist_fieldRefNum = 'custrecord784_2';
var draftApply_sublist_fieldOrigAmt = 'custrecord785_2';
var draftApply_sublist_fieldAmtDue = 'custrecord786_2';
var draftApply_sublist_fieldCurrency = 'custrecord787_2';
var draftApply_sublist_fieldPayment = 'custrecord788_2';


// Standard CM
var standardAppy_sublist = 'apply';
var standardAppy_sublist_fieldInternalid = 'internalid';


function createMemo(){
	var record = nlapiGetNewRecord();
  	var dcm_id = record.getId();
	var mainLine = draftMainLine(record);
	var cmItem_sublist = draftSublists(record,draftCmItem_sublist);
	var apply_sublist = draftSublists(record,draftApply_sublist);
	
	var createStandardMemo = nlapiCreateRecord('creditmemo', {account : mainLine.Account,entity: mainLine.CustomerSalesman});
	//added by richie 01/04/2018
  	var todaysDate = new Date();
    var newdate = (todaysDate.getMonth() + 1) + ' ' + todaysDate.getFullYear();
  	var postDate = new Date(draftMain_fieldDate);
    var frmtpostdate = (postDate.getMonth() + 1) + ' ' + postDate.getFullYear();
  	var transdate = new Date(mainLine.Date);

  	todaysDate.setHours(todaysDate.getHours()+16); //add 16 hours to the server date to get current date and hour in the philippines
    todaysDate.setMinutes(todaysDate.getMinutes()+2); //add 2 minutes to the server date to get current date and minute in the philippines
    if(transdate.getMonth()+1 < todaysDate.getMonth()+1 && transdate.getFullYear() <= todaysDate.getFullYear() && todaysDate.getDate() == 6) {
      var dateToday =  new Date(todaysDate.setDate(todaysDate.getDate()));
      createStandardMemo.setFieldValue('trandate', dateToday.getMonth()+1+'/'+dateToday.getDate()+'/'+dateToday.getFullYear());
    } else {
      createStandardMemo.setFieldValue('trandate', mainLine.Date);
    }
		createStandardMemo.setFieldValue('trandate', mainLine.Date);
		//createStandardMemo.setFieldValue('postingperiod', mainLine.PostingPeriod);
		createStandardMemo.setFieldValue('memo', mainLine.Remarks);
		createStandardMemo.setFieldValue('department', mainLine.Department);
		createStandardMemo.setFieldValue('class', mainLine.Principal);
		createStandardMemo.setFieldValue('location', mainLine.Location);
		createStandardMemo.setFieldValue('custbody69', mainLine.Operation);
		createStandardMemo.setFieldValue('custbody178', mainLine.ExternalInv);
		createStandardMemo.setFieldValue('salesrep', mainLine.SalesRep);
        createStandardMemo.setFieldValue('custbody8', mainLine.EncodedBy); //added by brian 8/20/2015 Encoded By
  		createStandardMemo.setFieldValue('custbody213', mainLine.InternalId); //added by Brian 10/7/2015 DCM# Linking

	for(var i = 0; i < cmItem_sublist.length; i++){
		var cmItem = cmItem_sublist[i];
		createStandardMemo.setLineItemValue('item', 'item', i + 1, cmItem.Items);
		createStandardMemo.setLineItemValue('item', 'custcol34', i + 1, cmItem.PrincipalorVendor);
		createStandardMemo.setLineItemValue('item', 'taxcode', i + 1, cmItem.TaxCode);
		createStandardMemo.setLineItemValue('item', 'amount', i + 1, cmItem.Amount);
		createStandardMemo.setLineItemValue('item', 'grossamt', i + 1, cmItem.GrossAmount);
		createStandardMemo.setLineItemValue('item', 'taxrate1', i + 1, cmItem.TaxRate);
		createStandardMemo.setLineItemValue('item', 'custcol38', i + 1, cmItem.Memo); //added by brian 10/7/2016 Line Item Memo
	}
	
	var standardApply_sublist = draftSublists(createStandardMemo,standardAppy_sublist);
	
	for(var x = 0; x < standardApply_sublist.length; x++){
		var toApply = standardApply_sublist[x];
		for(var j = 0; j < apply_sublist.length; j++){
			var draftApplied = apply_sublist[j];
			if(toApply.Internalid == draftApplied.RefNum){
				createStandardMemo.setLineItemValue('apply', 'apply', x + 1, 'T');
				createStandardMemo.setLineItemValue('apply', 'refnum', x + 1, draftApplied.RefNum);
				createStandardMemo.setLineItemValue('apply', 'amount', x + 1, draftApplied.Payment);
			}else{
				createStandardMemo.setLineItemValue('apply', 'apply', x + 1, 'F');
			}
		}
	}

	memoid = nlapiSubmitRecord(createStandardMemo, null,true);
	var cmdata = nlapiLookupField('creditmemo',memoid,['tranid','trandate','postingperiod'], false);
    nlapiSubmitField(record.getRecordType(), dcm_id, ['custrecord97', 'custrecord117', 'custrecord118'], [cmdata.tranid, cmdata.trandate, cmdata.postingperiod]);
}

function draftMainLine(record){
	var MainLineObject = new Object();
	MainLineObject.InternalId = record.getId();
	MainLineObject.RecordType = record.getRecordType();
	MainLineObject.CustomerSalesman = record.getFieldValue(draftMain_fieldCustomerSalesman);
	MainLineObject.Date = record.getFieldValue(draftMain_fieldDate);
	//MainLineObject.PostingPeriod = record.getFieldValue(draftMain_fieldPostingPeriod);
	MainLineObject.Remarks = record.getFieldValue(draftMain_fieldRemarks);
	MainLineObject.Account = record.getFieldValue(draftMain_fieldAccount);
	MainLineObject.Department = record.getFieldValue(draftMain_fieldDepartment);
	MainLineObject.Principal = record.getFieldValue(draftMain_fieldPrincipal);
	MainLineObject.ExternalInv = record.getFieldValue(draftMain_fieldExternalInv);
	MainLineObject.Location = record.getFieldValue(draftMain_fieldLocation);
	MainLineObject.Operation = record.getFieldValue(draftMain_fieldOperation);
	MainLineObject.SalesRep = record.getFieldValue(draftMain_fieldSalesRep);
        MainLineObject.EncodedBy = record.getFieldValue('custrecord164'); //added by brian 8/20/2015
	return MainLineObject;
}

function draftSublists(record,sublist){
	var sublists_Array = new Array();
	
	var sublistLineCount = record.getLineItemCount(sublist);
	
	switch(sublist){
	case 'recmachcustrecord101' : // CM Item Sublist
		for(var i = 1; i <= sublistLineCount; i++){
			var SublistsObject = new Object();
			SublistsObject.Items = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldItems, i);
			SublistsObject.PrincipalorVendor = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldPrincipalorVendor, i);
			SublistsObject.Amount = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldAmount, i);
			SublistsObject.TaxCode = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldTaxCode, i);
			SublistsObject.GrossAmount = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldGrossAmount, i);
			SublistsObject.TaxRate = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldTaxRate, i);
			SublistsObject.TaxAmount = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldTaxAmount, i);
			SublistsObject.Memo = record.getLineItemValue(draftCmItem_sublist, draftCmItem_sublist_fieldMemo, i); // added by brian 10/7/2016 Line Item Memo
			sublists_Array.push(SublistsObject);
		}
		break;
	case 'recmachcustrecord789_2' : // Apply Sublist
		for(var x = 1; x <= sublistLineCount; x++){
			var SublistsObject = new Object();
			SublistsObject.Apply = record.getLineItemValue(draftApply_sublist, draftApply_sublist_fieldApply, x);
			SublistsObject.RefNum = record.getLineItemValue(draftApply_sublist, draftApply_sublist_fieldRefNum, x);
			SublistsObject.SubCustomer = record.getLineItemValue(draftApply_sublist, draftApply_sublist_fieldSubcustomer, x);
			SublistsObject.Payment = record.getLineItemValue(draftApply_sublist, draftApply_sublist_fieldPayment, x);
			
			if(SublistsObject.Apply != 'F'){
				sublists_Array.push(SublistsObject);
			}
		}
		
		break;
	case 'apply' :
		for(var y = 1; y <= sublistLineCount; y++){
			var SublistsObject = new Object(); 
			SublistsObject.Internalid = record.getLineItemValue(standardAppy_sublist, standardAppy_sublist_fieldInternalid, y);
			sublists_Array.push(SublistsObject);
		}
	}

	return sublists_Array;
}