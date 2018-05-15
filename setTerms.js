function setTerms(type, name)
{
try{
	var po_id = nlapiLookupField('purchaseorder', getParam('id'), 'custbody120');
	nlapiSetFieldValue('terms', po_id);
//nlapiSetCurrentLineItemValue('item', 'custcol_4601_witaxapplies', 'T');
}catch(e){}
}
function setWtax(){
	//nlapiSetCurrentLineItemValue('item', 'custcol_4601_witaxapplies', 'T');
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