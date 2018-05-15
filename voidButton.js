function userEventBeforeLoad(type, form){
    try {
        var newId = nlapiGetRecordId(),
			custDeposit = nlapiGetNewRecord(),
			status = custDeposit.getFieldValue('custbody67')
		;
		if (status === null) {
			if (type == "view") {
				var voidCustDeposit = "window.location = '" + nlapiResolveURL('SUITELET', 'customscript191', 'customdeploy1') + "&internalid=" + newId  + "&l=t';";
				form.addButton("custpage_voidCustDeposit", "Void", voidCustDeposit); 
			}
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

function userEventBeforeSubmit(type)
{
	var crno = nlapiGetFieldValue('custbody150');
	if(isNaN(crno))
	{
		throw nlapiCreateError('ERROR_SAVE', 'FAILED : CR No. field must be numbers.');
	}
}