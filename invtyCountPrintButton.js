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
            var print = "print = window.open('" + nlapiResolveURL('SUITELET', 'customscript512', 'customdeploy1') + "&formtype=" + newType + "&internalId=" + newId + "&l=t', 'print', 'height=1056, width=1300, resizable=yes, scrollbars=yes, toolbar=no'); print.focus();";
            form.addButton("custpage_print", "Print Report", print);
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