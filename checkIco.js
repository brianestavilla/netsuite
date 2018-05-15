function beforeSubmit(type, form){
	var record = nlapiGetNewRecord(),
		linecount = record.getLineItemCount('item'),
		exceeds = false
	;
	
	for(var i = 1; i <= linecount; i++){
		var ifYes = record.getLineItemValue('item','custcol13',i);
		if(ifYes == 'T'){
			record.setFieldValue('custbody56', 'T');
			break;
		}
	}
}