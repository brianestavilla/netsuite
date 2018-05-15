function apvButton(type, form) {
	try {
		var newId = nlapiGetNewRecord();
			if(type == 'view') {
				var printAPV = "printAPV = window.open('" + nlapiResolveURL('SUITELET', 'customscript413', 'customdeploy1') + "&internalid=" + newId.getId() + "&l=t', 'printAPV'); printAPV.focus();";
				//change aaa
				form.addButton("custpage_papv", "Print Voucher", printAPV);
              if(nlapiGetUser()==30855) {
                var printAPV2 = "printAPV2 = window.open('" + nlapiResolveURL('SUITELET', 'customscript755', 'customdeploy1') + "&internalid=" + newId.getId() + "&l=t', 'printAPV2'); printAPV.focus();";
				//change aaa
				form.addButton("custpage_papv2", "Print Voucher Update", printAPV2);
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