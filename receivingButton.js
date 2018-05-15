function userEventBeforeLoad(type, form){
	try {
        var newId = nlapiGetRecordId(),
			record = nlapiGetNewRecord(),
			received = record.getFieldValue('custbody93'),
                        approved = record.getFieldText('approvalstatus')
		;
		if (type == "view" && received === 'F' && approved === 'Approved') {
			//var receiveButton = nlapiResolveURL('SUITELET', 'customscript287', 'customdeploy1') + '&internalid=' + newId + '&l=t';
			var receiveButton = "window.location = '" + nlapiResolveURL('SUITELET', 'customscript287', 'customdeploy1') + "&internalid=" + newId  + "&l=t';";
			form.addButton("custpage_receiveButton", "Receive", receiveButton); 
		}
    } catch (e) {
        if (e instanceof nlobjError) {
            nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
        }
        else {
            nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
        }
    }
}