function apvButton(type, form) {
	try {
		var newId = nlapiGetNewRecord();
			if(type == 'view') {
				var enterbill = "enterbill = window.open('" + nlapiResolveURL('SUITELET', 'customscript465_2', 'customdeploy1') + "&internalid=" + newId.getId() + "&l=t', 'enterbill'); enterbill.focus();";
				var status = newId.getFieldValue('status');
				var payment = newId.getFieldValue('custbody38');
				var potype = newId.getFieldValue('custbody4');
				//change aaa
				if((status == 'Pending Bill' || status == 'Pending Billing/Partially Received') && payment == '2'){
					form.addButton("custpage_bill", "Vendor Bill", enterbill);
					form.getField('tbl_bill').setDisplayType('hidden');
					
				}
			}
	} catch (e) {
		if (e instanceof nlobjError) {
			nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
		} else {
			nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
		}
	}
}