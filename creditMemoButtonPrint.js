function userEventBeforeLoad(type, form) {
	try {
		var newId = nlapiGetRecordId();
		if (type == "view") {
			var printCreditMemo = "printCreditMemo = window.open('" + nlapiResolveURL('SUITELET', 'customscriptcmp1', 'customdeploy1') + "&internalid=" + newId + "&l=t', 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printCrediMemo.focus();";
			//get script and deployment id
			form.addButton("custpage_cmp1", "Print Credit Memo", printCreditMemo);
		}
	}
	catch (e) {
		if (e instanceof nlobjError) {
			nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
		}
		else {
			nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
		}
	}
}