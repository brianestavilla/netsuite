function beforeLoad(type, form) {

    try {
        var newRecord = nlapiGetNewRecord();
        var newId = nlapiGetRecordId();
        var newType = nlapiGetRecordType();
		//var form = nlapiGetFieldValue('customform');
		nlapiLogExecution('DEBUG', 'newtype', newType);
        var ctxtObj = nlapiGetContext();
        var executionContext = ctxtObj.getExecutionContext();


        if (type == "view") {
            var printOR = "printOR = window.open('" + nlapiResolveURL('SUITELET', 'customscript223', 'customdeploy1') + "&formtype=" + newType + "&internalId=" + newId + "&l=t', 'printOR', 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printOR.focus();";
            form.addButton("custpage_printOR", "Print Voucher", printOR);
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