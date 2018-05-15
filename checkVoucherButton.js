function checkVoucherButton(type, form) {
	try {
		var newId = nlapiGetRecordId();
		if (type == "view") {
			//var printCheckVoucher = "printCheckVoucher = window.open('" + nlapiResolveURL('SUITELET', 'customscript335', 'customdeploy1') + "&internalid=" + newId + "&l=t','printCheckVoucher', 'height=1056', width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printCheckVoucher.focus();";
			var printCheck = "printCheck = window.open('" + nlapiResolveURL('SUITELET', 'customscript335', 'customdeploy1') + "&internalid=" + newId + "&l=t', 'printCheck'); printCheck.focus();"; //, 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'
			form.addButton("custpage_pcv1", "Print Check Voucher", printCheck);
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