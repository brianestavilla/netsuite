/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       4 March 2014     Redemptor	
 *											
 */

var field_customer = 'custrecord99';
var field_account = 'custrecord824';
var field_location = 'custrecord128';
var field_principal = 'custrecord126';
var sublist_apply_fieldPayment = 'custrecord788_2';
var sublist_apply_fieldApply = 'custrecord780_2';
var sublist_apply = 'recmachcustrecord789_2';
var sublist_cmItem = 'recmachcustrecord101';
/** var principal =[];
principal[7] = 'PG'; //PG
principal[11] = 'DMPI'; //FS
principal[10] = 'DMPI'; //GT
principal[118] = 'GLOBE'; //GLOBE
principal[6] = 'MNC'; //MONDE
principal[3] = 'MONDELEZ'; // MONDELEZ
principal[5] = 'NAI'; // NUTRIASIA
principal[1] = 'DMPI'; // DMPI **/

function fieldChange3(type, name){

	if(name == field_customer || name == field_account) {
		var acct = nlapiGetFieldValue(field_account);
		var customer = nlapiGetFieldValue(field_customer);
		var trans_date = nlapiGetFieldValue('custrecord117');
		var trans_loc = nlapiGetFieldValue(field_location);
   		var trans_prin = nlapiGetFieldValue(field_principal);

		//if(nlapiGetFieldValue(field_principal) !== '') {
		//	nlapiSetFieldValue(field_principal, '');
		//	nlapiSetFieldValue('custrecord122','');
		//}

		if(acct != '' && customer != '' && trans_date != '') {
			nlapiSetFieldValue(field_location,nlapiLookupField('customer', nlapiGetFieldValue(field_customer), 'custentity37'));

          //var arrloc = nlapiGetFieldText(field_location).split(' : ');
          //var textloc = arrloc[0]+' : '+arrloc[1]+' : '+arrloc[2]+' : '+principal[trans_prin];

          //if(nlapiGetRole() == 3) {
          //  alert(textloc);
          //}

          var cdate = new Date(trans_date);
          var start_date = cdate.getMonth()+1+'/1/'+cdate.getFullYear();
          var end_date = cdate.getMonth()+1+'/'+cdate.getDate()+'/'+cdate.getFullYear();

			getInvoices(customer, acct, start_date, end_date);
		}
	}

 	if(name == field_customer || name == field_principal) {
        var principal = nlapiGetFieldValue(field_principal);
		var customer = nlapiGetFieldValue(field_customer);
        if(principal != '' && customer != ''){
          var creditlimit = getSalesman(customer,principal);
          nlapiSetFieldValue('custrecord122', creditlimit.salesman);
          nlapiSetFieldValue('custrecord124', creditlimit.department);
        }
      }

  	/**
    **	ADDED BY BRIAN 9/26/2017
    **  QUERY INVOICES BASED ON DATE RANGE SET
    **/

	if(name == 'custrecord904' || name == 'custrecord905') {
      var start_date = nlapiGetFieldValue('custrecord904');
      var end_date = nlapiGetFieldValue('custrecord905');
      var acct = nlapiGetFieldValue(field_account);
	  var customer = nlapiGetFieldValue(field_customer);

      if(start_date != '' && end_date != '') {
        getInvoices(customer, acct, start_date, end_date);
      }

    }

 	/** END **/

}

function saveRecFunc(){
  if(nlapiGetFieldValue('custrecord126') != 7) { // 7 = PROCTER AND GAMBLE
    if(getTotalAmount() < getTotalPayment()){
		alert('Amount applied should be equal to Total Amount');
		return false;
	}else if(getTotalPayment() <= 0){
		alert('Please apply an Invoice!');
		return false;
	} else {
		return true;
	}
  }
  return true;
}

function addline(type, name){
	
	if(type != sublist_apply){
		var princ = nlapiGetFieldValue('custrecord126');
		var location = nlapiGetFieldValue('custrecord128');
		var acc = nlapiGetCurrentLineItemValue('recmachcustrecord101','custrecord104');
		var postper = nlapiGetFieldValue('custrecord118');
		var accamnt = nlapiGetCurrentLineItemValue('recmachcustrecord101','custrecord110');
		
		switch(acc){
			case '34003': //613000001 Operating Expenses : Marketing, Advertising & Promotions-Display Allow//subd(MNC
				var x = new nlobjSearchColumn('custrecord_budget_sales_subdexpense');
				var y = 'custrecord_budget_sales_subdexpense';
			break;
			default:
				//not in the budget list COA
				//addline1();
				return true;
			}
		if((location != null && princ != null) && (location != '' && princ != '')){
			var filter = [
					new nlobjSearchFilter('custrecord126', null, 'anyof', princ),
					new nlobjSearchFilter('custrecord128', null, 'anyof', location),
					new nlobjSearchFilter('custrecord104','custrecord101', 'anyof', acc),
					new nlobjSearchFilter('custrecord118',null,'anyof', postper)
				];
			var column = new nlobjSearchColumn('custrecord110','custrecord101','SUM');
			var result = nlapiSearchRecord('customrecord136','customsearch871',filter,column);
			var amnt = 0;
			if(result != null){
				amnt = result[0].getValue('custrecord110','custrecord101','SUM');	
			}
			alert(amnt);
			var totalamnt = parseFloat(amnt) + parseFloat(accamnt);
			
			
		
			var filter1 = [
				new nlobjSearchFilter('custrecord_budgetprincipal', null, 'anyof', princ),
				new nlobjSearchFilter('custrecord_budgetlocation', null, 'anyof', location),
				new nlobjSearchFilter('custrecord_budgetpostingperiod', null, 'anyof', postper)
			];
			
			var result = nlapiSearchRecord('customrecord_budget', null, filter1, x);
			
			if(result != null){
				var budgetamnt = result[0].getValue(y);
			}else{
				//addline1();
				return true;
			}
			
			if(budgetamnt < totalamnt){
				alert('UNABLE TO PROCEED, EXCEEDED ALLOCATED BUDGET');
				return false;
			}else{
				//addline1();
				return true;
			}
			
		}else{
			alert("FILL UP THE MANDATORY FIELDS FIRST");
			return false;
		}
	} else {
		var amountdue = nlapiGetCurrentLineItemValue(sublist_apply,'custrecord786_2');
		var currentlinepayment = nlapiGetCurrentLineItemValue(sublist_apply,'custrecord788_2');
		if(parseFloat(amountdue) < parseFloat(currentlinepayment)){
			alert('Payment should be equal or less than Amount Due');
			nlapiSetCurrentLineItemValue('recmachcustrecord789_2','custrecord788_2', '', false);
			return false;
		}else{
			checkBox_CheckUncheck(currentlinepayment);
			return true;
		}
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
   if(type == 'create'){
	   nlapiSetFieldValue(field_account,'123');
   }
}

function getInvoices(customer, account, start_date, end_date) {

	removeLineItem();
	
	var filter = [
				new nlobjSearchFilter('name', null, 'anyof', customer),
				new nlobjSearchFilter('mainline', null, 'is', 'T'),
      			new nlobjSearchFilter('trandate', null, 'within', start_date, end_date),
				new nlobjSearchFilter('account', null, 'anyof', account)
				];
	var columns = [
				new nlobjSearchColumn('trandate'),
				new nlobjSearchColumn('internalid'),
				new nlobjSearchColumn('amount'),
				new nlobjSearchColumn('amountremaining'),
				new nlobjSearchColumn('location'),
      			new nlobjSearchColumn('custbody178')
				];

	var result = nlapiSearchRecord(null, 'customsearch565', filter, columns);

  	if(result != null) {
      for(var i = 0; result != null && i < result.length; i++) {
          nlapiSelectNewLineItem(sublist_apply);
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord781_2',result[i].getValue('trandate'));
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord784_2',result[i].getValue('internalid'));
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord785_2',result[i].getValue('amount'));
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord786_2',result[i].getValue('amountremaining'));
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord787_2','1');
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord891',result[i].getValue('location'));
          nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord892',result[i].getValue('custbody178'));
          nlapiCommitLineItem(sublist_apply);
		}
    }

	//added July 1, 2016 (DEM)
	getJournal(customer);
}

//added July 1, 2016 (DEM)
function  getJournal(customer) {

	var filters = [
		new nlobjSearchFilter('name', null, 'anyof', customer),
		new nlobjSearchFilter('account', null, 'anyof', '123'),
		new nlobjSearchFilter('applyingtransaction', null, 'anyof', '@NONE@')
	];

	var columns = [
		new nlobjSearchColumn('trandate'),
		new nlobjSearchColumn('internalid'),
		new nlobjSearchColumn('amount'),
		new nlobjSearchColumn('amountremaining'),
		new nlobjSearchColumn('location')
	];

	var result = nlapiSearchRecord('journalentry', null, filters, columns);

	for(var i = 0; result != null && i < result.length; i++){
		nlapiSelectNewLineItem(sublist_apply);
		nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord781_2',result[i].getValue('trandate'));
		nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord784_2',result[i].getValue('internalid'));
		nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord785_2',result[i].getValue('amount'));
		nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord786_2',result[i].getValue('amountremaining'));
		nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord787_2','1');
		nlapiSetCurrentLineItemValue('recmachcustrecord789_2', 'custrecord891',result[i].getValue('location'));
		nlapiCommitLineItem(sublist_apply);
	}
}

function removeLineItem() {
	var linecount = nlapiGetLineItemCount(sublist_apply);
	for(var ai = 1; ai <= linecount; ai++){
		nlapiRemoveLineItem(sublist_apply, ai);
	}
}

function getTotalAmount() {
	var totalAmount = 0;
	for(var i = 1; i <= nlapiGetLineItemCount(sublist_cmItem); i++){
		var amt = nlapiGetLineItemValue(sublist_cmItem, 'custrecord110', i) != '' ? nlapiGetLineItemValue(sublist_cmItem, 'custrecord110', i) : 0;
		totalAmount += parseFloat(amt);
	}
	return parseFloat(totalAmount.toFixed(2));
}

function getTotalPayment() {
	var totalPayment = 0;
	for(var i = 1; i <= nlapiGetLineItemCount(sublist_apply); i++){
		if(nlapiGetLineItemValue(sublist_apply, sublist_apply_fieldApply, i) == 'T'){
			var apply = nlapiGetLineItemValue(sublist_apply, 'custrecord788_2', i) == '' ? 0 : nlapiGetLineItemValue(sublist_apply, 'custrecord788_2', i);
			totalPayment += parseFloat(apply);
		}
	}
	return parseFloat(totalPayment.toFixed(2));
}

function checkBox_CheckUncheck(currentPayment) {
	if(currentPayment == '' || currentPayment == '0.00'){
		nlapiSetCurrentLineItemValue(sublist_apply, sublist_apply_fieldApply,'F');
	}else{
		nlapiSetCurrentLineItemValue(sublist_apply, sublist_apply_fieldApply,'T');
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientRecalc(type){
	if(type == sublist_cmItem){
		nlapiSetFieldValue('custrecord792', getTotalAmount());
	}
}

function getSalesman(customer,principal){
	try{
		var searchFilters = new Array(
			new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
			new nlobjSearchFilter('custrecord153', null, 'is', principal)
			);
		var searchColumns = [new nlobjSearchColumn('custrecord340'), new nlobjSearchColumn('department','custrecord340')];
		var result = nlapiSearchRecord('customrecord150', null, searchFilters, searchColumns);
		//return result === null ? '' : result[0].getValue('custrecord340');
      	if(result!=null) {
          return {
            "salesman": result === null ? '' : result[0].getValue('custrecord340'),
            "department": result === null ? '' : result[0].getValue('department','custrecord340'),
          };
        } else { return {"salesman":"", "department":""}; }

	}catch(e){}
}