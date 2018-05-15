  if(nlapiGetFieldValue('custbody17') != '') {
    jQuery('#tbl_return').hide();
    jQuery('#tbl_closeremaining').hide();
  } else {
    jQuery('#tbl_return').show();
    jQuery('#tbl_closeremaining').show();
  }

function addLineItem(type, name){
	nlapiSetCurrentLineItemValue('expense', 'location', nlapiGetFieldValue('location'));
	return true;
}