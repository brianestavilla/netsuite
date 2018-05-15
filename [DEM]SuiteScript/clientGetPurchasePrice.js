/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Mar 2014     Redemptor		This script is to get and set purchase price of an item.
 *											To get and set reference number like PO or IR number.
 */

/** HIDE STANDARD TAX FIELD **/
jQuery("#taxtotal_fs_lbl_uir_label").parent().hide();

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Vendor Bill
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLine(type){
	switch(type){
	case 'item' :
		var currentLineItemValue = getCurrentLineItem();
		if(currentLineItemValue.Item != ''){
			nlapiSetCurrentLineItemValue('item', 'custcol32', getRate(currentLineItemValue.Item));
		}
		break;
	}
    return true;
}


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Vendor Bill 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit2(type){

	if(type != 'edit'){
		var reference = getReference();
		nlapiSetFieldValue('custbody121', reference.POInternalId);
		nlapiSetFieldValue('custbody95', reference.IRInternalId);
		nlapiSetFieldValue('custbody189', reference.IRDate);
		//nlapiSetFieldValue('tranid', reference.SupplierInvNumber); // by: Brian 7/14/2015
		nlapiSetFieldValue('custbody62', reference.BillType);
	}
}


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Vendor Bill
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number}  Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged2(type, name){
	
  	switch(name){
	case 'tranid' :
		var suppliersInvNo = nlapiGetFieldValue('tranid');
		if(getSupplierInvNumber(suppliersInvNo.trim()) != null && suppliersInvNo != ''){
			alert('Duplicate Suppliers Invoice Number. ');
			nlapiSetFieldValue('tranid', '');
		}
		break;
	}

  if(type == 'expense' || type == 'item') {
    	if(nlapiGetFieldValue('entity') != '') {
           var vendor_wtax_setup = nlapiLookupField('vendor', nlapiGetFieldValue('entity'), 'custentity_4601_defaultwitaxcode', false);
            if(name == 'account') {
             if(nlapiGetFieldValue('customform') != 103) { // 103 = trade
                if((/Withholding Tax/i.test(nlapiGetCurrentLineItemText('expense','account'))) || (/Input Tax/i.test(nlapiGetCurrentLineItemText('expense','account')))) {
                    nlapiSetCurrentLineItemValue('expense','custcol_4601_witaxapplies','F');
                } else {
                    if(vendor_wtax_setup != "") {
                        nlapiSetCurrentLineItemValue('expense','custcol_4601_witaxapplies','T');
                    } else { nlapiSetCurrentLineItemValue('expense','custcol_4601_witaxapplies','F'); }
                }
             } else {
                if(vendor_wtax_setup != "") {
                 nlapiSetCurrentLineItemValue('expense','custcol_4601_witaxapplies','T');
                } else { nlapiSetCurrentLineItemValue('expense','custcol_4601_witaxapplies','F'); }
             }
           } else if (name == 'item') {
             if(vendor_wtax_setup != "") {
                 nlapiSetCurrentLineItemValue('item','custcol_4601_witaxapplies','T');
             } else { nlapiSetCurrentLineItemValue('item','custcol_4601_witaxapplies','F'); }
           }
        }
    }
}
function clientLineInit2(type){
  if(type == 'item') {
  		nlapiSetCurrentLineItemValue('item','custcol_4601_witaxapplies','T');
  }
}

function clientSaveRecord2(){
	var billtype = nlapiGetFieldValue('custbody62');
	var nontrade_subtype = nlapiGetFieldValue('custbody51');
	
	//billtype = 2 - Nontrade
	//nontrade_subtype = 11 - Cash Advance BRANCH
	//nontrade_subtype = 12 - Cash Advance HO
	//This condition will execute if the Non-trade subtype is Cash Advance
	if(billtype == '2' && (nontrade_subtype == '11' || nontrade_subtype == '12')){
		var principal = nlapiGetFieldValue('class');
		var entity = nlapiGetFieldValue('entity');
		if(nlapiGetRecordId() == "" && getOutstandingCashAdvance(entity,principal) != null){
			alert('Please liquidate your previous CA!');
			return false;
		}
	}

	if(nontrade_subtype == '2' || nontrade_subtype == '14'){ // if pcf transaction or lcf transaction
		if(nlapiGetFieldValue('custbody201') == ''){
			alert('Please fill-up PCF Custodian!');
			return false;
		}
	}


	if(nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false) == '' &&
		nlapiGetFieldValue('custbody37') == "To Be Generated"){
		alert('Please set-up your Reporting Branch. Please contact the administrator!');
		return false;
	}
	
	return true;
}

function getCurrentLineItem(){
	var LineItemObject = new Object();
	LineItemObject.Item = nlapiGetCurrentLineItemValue('item', 'item');
	return LineItemObject;
}

function getRate(item){
	var rate = 0;
	
	var ratefilter = new Array(
		new nlobjSearchFilter('custrecord742',null,'is',item), //Item
		new nlobjSearchFilter('custrecord743',null,'is',nlapiLookupField('employee', nlapiGetUser(), 'custentity49')) //location
		);
	var ratecolumn = new nlobjSearchColumn('custrecord744'); // purchase price
	var searchRateResult = nlapiSearchRecord('customrecord252',null,ratefilter,ratecolumn);
	rate = searchRateResult == null ? 0 : searchRateResult[0].getValue('custrecord744');
	
	return rate;
}

function getReference(){
	var ReferenceObject = new Object();
	ReferenceObject.POInternalId = getParam('id') == null ? '' : getParam('id');
	ReferenceObject.IRInternalId = getParam('itemrcpt') == null ? '' : getParam('itemrcpt');
	
	if(ReferenceObject.POInternalId != ''){
		var billType = '';
		var customForm = nlapiLookupField('purchaseorder', ReferenceObject.POInternalId, 'customform');
		
		if(customForm == '121' || customForm == '162'){ // if equal to non-trade
			billType = '2'; // non trade
		}else{
			billType = '1'; // trade
		}
		
		ReferenceObject.BillType = billType;
	}
	
	if(ReferenceObject.IRInternalId != ''){
		ReferenceObject.IRDate = nlapiLookupField('itemreceipt', ReferenceObject.IRInternalId, 'trandate');
		ReferenceObject.SupplierInvNumber = nlapiLookupField('itemreceipt', ReferenceObject.IRInternalId, 'custbody156');
	}

	return ReferenceObject;
}

function getParam(name){
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var tmpURL = window.location.href;
  var results = regex.exec( tmpURL );
  if( results == null )
    return "";
  else
    return results[1];
}

function getSupplierInvNumber(supplierInvNo){
	var filter = new Array(
		new nlobjSearchFilter('tranid',null, 'is',supplierInvNo.trim()),
		new nlobjSearchFilter('approvalstatus',null,'noneof','3')
		);
	var column = new nlobjSearchColumn('tranid');
	var searchResult =  nlapiSearchRecord('vendorbill',null,filter,column);
	return searchResult;
}

function getOutstandingCashAdvance(entity,principal){
	var filters = new Array(
		new nlobjSearchFilter('name', null, 'anyof', entity ),
		//new nlobjSearchFilter('class', null, 'is', principal),
		new nlobjSearchFilter('custbody51', null, 'anyof', Array('11','12') ),
		new nlobjSearchFilter('custbody197', null, 'is', 'F'), //sandbox custbody198
		new nlobjSearchFilter('mainline', null, 'is', 'T'),
		new nlobjSearchFilter('approvalstatus', null, 'noneof', '3')
		);

	return nlapiSearchRecord('vendorbill', null, filters);	
}
