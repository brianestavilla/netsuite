function journalEntryButton(type, form) {
	try {
		var newId = nlapiGetRecordId();
		if(type == "view") {
			var printJE = "printJE = window.open('" + nlapiResolveURL('SUITELET', 'customscript343', 'customdeploy1') + "&internalid=" + newId + "&l=t', 'printJE'); printJE.focus();";//, 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no
			form.addButton("custpage_pcv1", "Print Journal Voucher", printJE);
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