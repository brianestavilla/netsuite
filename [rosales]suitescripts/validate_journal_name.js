function validate_name_journal(type) {

	if(nlapiGetCurrentLineItemValue('line','entity') == '' || nlapiGetCurrentLineItemValue('line','entity') == null) {
		alert('Please Input value for name');
		return false;
	}
	return true;
}
/****Start chiboi - validation for reversal JE****/
function validate_reversal_date(type) {
    if(nlapiGetFieldValue('reversaldate') != ''){
         var x = confirm('Are you sure to reverse this transaction? if YES, click OK otherwise remove reversal date');
       if(x == false) {
        	 return false;
   		 } else { return true; }
	} else {  return true; }
}
/****End chiboi - validation for reversal JE****/