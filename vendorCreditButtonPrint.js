function userEventBeforeLoad(type, form){
	try {
		var newId = nlapiGetRecordId();
		if (type == "view") {
			var printVendorCredit = "printVendorCredit = window.open('" + nlapiResolveURL('SUITELET', 'customscriptvcp1', 'customdeploy1') + "&internalid=" + newId + "&l=t', 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printVendorCredit.focus();";
			form.addButton("custpage_vcp1", "Print Vendor Credit", printVendorCredit);
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