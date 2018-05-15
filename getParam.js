function fieldChanged(type, name){
	if(name == 'custrecord84'){
		var suggestedOrder = nlapiGetCurrentLineItemValue('recmachcustrecord86', 'custrecord82');
		var forPO = nlapiGetCurrentLineItemValue('recmachcustrecord86', 'custrecord84');
		
		suggestedOrder = (suggestedOrder == null) ? 0 : suggestedOrder;
		forPO = (forPO == null) ? 0 : forPO;
		nlapiSetCurrentLineItemValue('recmachcustrecord86', 'custrecord85', suggestedOrder - forPO);
	}
}

function pageInit(){
	//nlapiSetFieldValue('custrecord88', getParam('class'));
	//if(getParam('class') != '')var supplier = nlapiSearchRecord('vendor', null, new nlobjSearchFilter('custentity23', null, 'anyof', getParam('class')), new nlobjSearchColumn('internalid'));
	
	//if(supplier != null)nlapiSetFieldValue('custrecord92', supplier[0].getValue('internalid'));
	
	/*document.getElementById('recmachcustrecord86_addedit').style.visibility = 'hidden';
	document.getElementById('recmachcustrecord86_remove').style.visibility = 'hidden';
	document.getElementById('recmachcustrecord86_clear').style.visibility = 'hidden';
	document.getElementById('recmachcustrecord86_insert').style.visibility = 'hidden';*/
}

function getParam(name) {
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var tmpURL = window.location.href;
  var results = regex.exec( tmpURL );
  if( results == null )
    return "";
  else
    return results[1];
}