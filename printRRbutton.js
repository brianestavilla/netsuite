function printRRbutton(type, form) {
	try {
	var newId = nlapiGetRecordId();
		if(type == 'view') {
			
			var printRR = "printRR = window.open('" + nlapiResolveURL('SUITELET', 'customscript404', 'customdeploy1') + "&internalid=" + newId + "&l=t', 'printRR'); printRR.focus();";
			//change aaa and bbb DONE
			form.addButton("custpage_prrb1", 'Print', printRR);
			nlapiLogExecution('DEBUG','<Before Load Script> type:'+type);
		}
	} catch (e) {
		if (e instanceof nlobjError) {
			nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
		} else {
			nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
		}
	}
}