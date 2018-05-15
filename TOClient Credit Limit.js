/*
	Updated :
		Date : Oct. 25, 2013.
		By : Redem
		Purpose : Add credit limit,outstanding ar,invty on hand fields and Set a Value.
*/

function fieldChangeCreditLimit(type, name){
	var operation = nlapiGetFieldValue('custbody69');
	var loc = nlapiGetFieldValue('transferlocation');
	if(name == 'custbody69' && loc != ''){
       // customform 176 == DDI T.O - GOOD to FREE/BTDT ; 7 = Good to Free/BTDT --richie 10/04/2017
        if(nlapiGetFieldValue('customform') == '176') {
            nlapiSetFieldValue('custbody46','7');
        }
      
		if(nlapiGetFieldValue('customform') == '142' && operation != ''){
			var	entity = nlapiGetFieldValue('custbody172'),
				principal = nlapiGetFieldValue('class'),
				
				creditlimit = 0,
				open_ar = 0,
				eoh = 0,
				branch = nlapiLookupField('customer', entity, ['custentity48','custentity37'], false);
          
			//CREDIT LIMIT
			filter = new Array(
						new nlobjSearchFilter('custrecord152', null, 'anyof', entity, null),
						new nlobjSearchFilter('custrecord153', null, 'anyof', principal, null)
						);
			columns = new nlobjSearchColumn('custrecord154');
			var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
			if(creditLimit != null)
				creditlimit = parseFloat(creditLimit[0].getValue('custrecord154'));

          	if(nlapiGetFieldValue('class') == 118) {

              //Open Accounts Receivable
              filter = [ new nlobjSearchFilter('name', null, 'anyof', entity), new nlobjSearchFilter('location', null, 'anyof', branch.custentity37) ];
              columns = new nlobjSearchColumn('amountremaining', null, 'SUM');
              var ar_amount =  nlapiSearchRecord('transaction', 'customsearch597', filter, columns);
              if(ar_amount != null){ open_ar = ar_amount[0].getValue('amountremaining', null, 'SUM'); }

            } else {

              //Open Accounts Receivable
              filter = new nlobjSearchFilter('name', null, 'anyof', entity)
              columns = new nlobjSearchColumn('amountremaining', null, 'SUM');
              var ar_amount =  nlapiSearchRecord('transaction', 'customsearch597', filter, columns);
              if(ar_amount != null){ open_ar = ar_amount[0].getValue('amountremaining', null, 'SUM'); }

            }

			open_ar = (open_ar != '' && open_ar != null)? open_ar : 0;
			//EOH Amount
			filter1 = new Array (
						new nlobjSearchFilter('internalid', 'inventoryLocation', 'anyof', loc),
						new nlobjSearchFilter('custrecord12', 'custrecord13', 'anyof', branch.custentity48),
						new nlobjSearchFilter('custrecord28', 'custrecord13', 'anyof', operation)
			);
			column1 = new nlobjSearchColumn('formulacurrency');
			var filterItem1 = nlapiSearchRecord('item', 'customsearch607', filter1, column1);
			if(filterItem1 != null) 
				for(var j = 0; j < filterItem1.length; j++){
					eoh += parseFloat(filterItem1[j].getValue('formulacurrency'));
				}
			eoh = (eoh != '' && eoh != null)? eoh : 0;
			//Deposit Balance
			deposit = parseFloat(nlapiLookupField('customer', entity, 'depositbalance'));
			var loadable = creditlimit - (parseFloat(open_ar) + parseFloat(eoh)) - parseFloat(deposit);
			nlapiSetFieldValue('custbody35', loadable);

			//set values. - REDEM
			nlapiSetFieldValue('custbody182', parseFloat(open_ar)); // set outstanding invoice
			nlapiSetFieldValue('custbody183', eoh); // set invty on hand
			nlapiSetFieldValue('custbody181', creditlimit); // set credit limit
			//nlapiSetFieldValue('custbody184', deposit); // set Unapplied Remittance 
          	nlapiSetFieldValue('custbody184', getUnappliedRemittance(entity)); // set Unapplied Remittance 
		}
	}
  
  	if(name == 'custbody172') {
      	nlapiSetFieldValue('custbody184', getUnappliedRemittance(nlapiGetFieldValue('custbody172'))); // set Unapplied Remittance 
    }
  
  	if(name == 'custbody184') {
      	var creditlimit = nlapiGetFieldValue('custbody181');
      	var open_ar = nlapiGetFieldValue('custbody182');
      	var eoh = nlapiGetFieldValue('custbody183');
      	var deposit = nlapiGetFieldValue('custbody184');
      
		var loadable = creditlimit - (parseFloat(open_ar) + parseFloat(eoh)) - parseFloat(deposit);
        nlapiSetFieldValue('custbody35', loadable);
    }
}
function checkIfExceeds(){
	if(nlapiGetFieldValue('customform') == '142'){
		var loadable = nlapiGetFieldValue('custbody35'); //Loadable Amount
		loadable = (loadable != '' && loadable != null) ? parseFloat(loadable) : 0;
		
		var amt = 0;
		var linecount = nlapiGetLineItemCount('item');
		for(var i = 1; i <= linecount; i++)
		{
			var temp = nlapiGetLineItemValue('item', 'custcol32', i);
			amt += (temp != '' && temp != null) ? parseFloat(temp) : 0;
		}
		//alert(loadable +" < "+ amt);
		if(loadable < amt){
			alert("Credit Limit Exceeded!");
			return false;
		}
	}
	return true;
}

function lineInitCreditLimit(){
	if(nlapiGetFieldValue('customform') == '142'){
		var linecount = nlapiGetLineItemCount('item');
		var amt = 0;
		for(var i = 1; i <= linecount; i++)
		{
			var temp = nlapiGetLineItemValue('item', 'custcol32', i);
			amt += (temp != '' && temp != null) ? parseFloat(temp) : 0;
		}
		nlapiSetFieldValue('custbody159',(amt));
	}
}

/*	Added :
	DAte: 10/11/13.
	By: Redem.
*/
function pageInitCreditLimit(){
	var getform = nlapiGetFieldValue('customform');
	var vanreturnform = '171';
	var vanloadingform = '142';

	if(getform == vanreturnform){
		nlapiDisableField('location', true);
	}else if(getform == vanloadingform){
		nlapiDisableField('transferlocation', true);
	}
}
/***************/

/**
** Added By Brian 5/8/2017
** GET UNAPPLIED CUSTOMER DEPOSITS
**/
function getUnappliedRemittance(salesman) {
	var column = new nlobjSearchColumn('amount');
	var filters = [
	    new nlobjSearchFilter('entity', null, 'anyof', salesman),
      	new nlobjSearchFilter('mainline', null, 'is', 'T'),
	    new nlobjSearchFilter('status', null, 'noneof', 'CustDep:C') // not Fully Applied
	];

	var result = nlapiSearchRecord('customerdeposit', null, filters, column);
	var total = 0;

	for(var i in result) { total += parseFloat(result[i].getValue('amount')); }

	return total;
}

