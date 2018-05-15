function pageInitAcctValidation(type) {
  var item_nothingfollows = '56651'; //sandbox 56075 : live 56651

	var line = nlapiFindLineItemValue('item', 'item', item_nothingfollows);
	if(parseInt(line) > 0) {
		nlapiRemoveLineItem('item', line);
	}
}

function empaccvalidation(type, name){
	var custf = nlapiGetFieldValue('customform');
	var nonsub = nlapiGetFieldValue('custbody51');
	var billtype = nlapiGetFieldValue('custbody62');
	var custforms = new Array();
	custforms[0] = '8';
	custforms[1] = '3';
	custforms[2] = '13';
	for(var i = 0 ; i <= 1; i++){
		if(custf == 138 && nonsub == custforms[i]  && billtype == 2) {
			var vend = nlapiGetCurrentLineItemValue('expense','custcol31');
			if(vend == '' || vend == 'null') {
				alert('you must fill the employee field');
				return false;
			} else {
				empacc = nlapiLookupField('vendor',vend, 'custentity9', false);
				if(empacc == 'null' || empacc == '' || empacc == 'undefined') {
					alert('Unable to proceed! No Account No. found for this payee.. Please submit IT request form with the correct Account# of employee to Administrator');
					return false;
				} else{ return true; }
			}
		}
	}
  
  	/**
  	** ADDED 4/18/2017 by BRIAN ESTAVILLA
    **	VALIDATION IF ACCOUNT ENCODED EXISTS IN PAYROLL ENTRIES
    **	customrecord428 = CUSTOM RECORD PAYROLL ENTRIES
    **/

  	//if(type == 'expense') {
     //   if((/nontrade/i.test(nlapiGetFieldText('customform'))) && (/payroll/i.test(nlapiGetFieldText('custbody51')))) {
     //       var columns = new nlobjSearchColumn('internalid');
     //       var filters = new nlobjSearchFilter('custrecord903', null, 'anyof', nlapiGetCurrentLineItemValue('expense','account'));
     //       var result =  nlapiSearchRecord('customrecord428', null, filters, columns);
      //      if(result == null) {
      //        alert('Account is not in the Lists of Payroll Entries. Please contact administrator for assistance.');
       //       return false;
       //     }
       // }
    //}

	return true;

}

//function clientSaveEmployeeAcctValidation(){
//  return true;
//}