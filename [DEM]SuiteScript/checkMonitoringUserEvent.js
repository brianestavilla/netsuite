function checkbeforeLoad(type,form,request){
	var dateclearedField = form.getField('custrecord_txtdatecleared');
	if(type == 'create'){
		var billPaymentValue = getBillPayment(request.getParameter('iddd'));
		nlapiSetFieldValue('custrecord877',billPaymentValue.internalid);
		nlapiSetFieldValue('name',billPaymentValue.checknumber);
		nlapiSetFieldValue('custrecord_txtcheckdate',billPaymentValue.checkdate);
		nlapiSetFieldValue('custrecord_txtcvnumber',billPaymentValue.cvnumber);
		nlapiSetFieldValue('custrecord842',billPaymentValue.payee);
		nlapiSetFieldValue('custrecord843',billPaymentValue.principal);
		nlapiSetFieldValue('custrecord844',billPaymentValue.location);
		nlapiSetFieldValue('custrecord_txtamount',Math.abs(billPaymentValue.amount));
		nlapiSetFieldValue('custrecord849',billPaymentValue.account);
	}
	
	if(nlapiGetRole() != '1061'){
		dateclearedField.setDisplayType('disabled');
	}
}

function checkbeforeSubmit(type,form){
	if(type == 'xedit' || type == 'edit'){
		var datecleared = nlapiGetFieldValue('custrecord_txtdatecleared');
		if(datecleared != ""){
			nlapiSetFieldValue('custrecord846', 'T');
		}else{
			nlapiSetFieldValue('custrecord846', 'F');
		}
	}
}

function checkAfterSubmit(type){
	if(type == 'create' || type == 'edit'){
		var record = nlapiGetNewRecord();
		var checkMonitoringValue = getCheckMonitoring(record);
		var fields = ['custbody150','custbody151','custbody152','custbody193','custbody194','custbody195'];
		var values = [checkMonitoringValue.OrNumber,checkMonitoringValue.OrDate,checkMonitoringValue.ReceivedBy,checkMonitoringValue.DateReleased,checkMonitoringValue.DateCleared,checkMonitoringValue.CheckMonitoringInternalid];
		nlapiSubmitField('vendorpayment', checkMonitoringValue.BillPaymentInternalid, fields, values);
	}
}

function getBillPayment(internalid){
	var BillPaymentObject = new Object();
	try{
		var fields = ['custbody53','custbody61','tranid','entity','class','location','total','account'];
		var lookupFields = nlapiLookupField('vendorpayment', internalid, fields);
		BillPaymentObject.internalid = internalid;
		BillPaymentObject.checknumber = lookupFields.custbody53;
		BillPaymentObject.checkdate = lookupFields.custbody61;
		BillPaymentObject.cvnumber = lookupFields.tranid;
		BillPaymentObject.payee = lookupFields.entity;
		BillPaymentObject.principal = lookupFields.class;
		BillPaymentObject.location = lookupFields.location;
		BillPaymentObject.amount = lookupFields.total;
		BillPaymentObject.account = lookupFields.account;
	}catch(e){
	}
	
	return BillPaymentObject;
}

function getCheckMonitoring(record){
	var CheckMonitoringObject = new Object();
	CheckMonitoringObject.CheckMonitoringInternalid = record.getId();
	CheckMonitoringObject.BillPaymentInternalid = record.getFieldValue('custrecord877');
	CheckMonitoringObject.DateReleased = record.getFieldValue('custrecord_txtdatereleased');
	CheckMonitoringObject.DateCleared = record.getFieldValue('custrecord_txtdatecleared');
	CheckMonitoringObject.OrNumber = record.getFieldValue('custrecord845');
	CheckMonitoringObject.OrDate = record.getFieldValue('custrecord847');
	CheckMonitoringObject.ReceivedBy = record.getFieldValue('custrecord848');
	return CheckMonitoringObject;
}