function getTotal(type, form){
	var total = 0;
	var record = nlapiGetNewRecord();
	for(var i = 1; i <= record.getLineItemCount('item'); i++){
		amt = (record.getLineItemValue('item', 'custcol32', i) == null || record.getLineItemValue('item', 'custcol32', i) == '') ? 0 : record.getLineItemValue('item', 'custcol32', i);
		total += parseFloat(amt);
	}
	record.setFieldValue('custbody159', total);
}
function hideField(type, form){
  if(type == 'view') { form.getField('total').setDisplayType('hidden'); }
  
  if(type == 'create') {
    var rec = nlapiLookupField('employee', nlapiGetUser(), ['custentity49','class']);
    nlapiSetFieldValue('custbody145', rec.custentity49 || '');
    nlapiSetFieldValue('class', rec.class || '');
  }
}