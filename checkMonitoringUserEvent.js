function checkbeforeLoad(type,form,request){
	if(type == 'create'){
		//var cont = nlapiGetContext();
		try{
			var internalid = request.getParameter('iddd'); // get internalid of a billpayment
			var checknumber = nlapiLookupField('vendorpayment',internalid,'custbody53');
			var checkdate = nlapiLookupField('vendorpayment',internalid,'custbody61');
			var cvnumber = nlapiLookupField('vendorpayment',internalid,'tranid');
			var payee = nlapiLookupField('vendorpayment',internalid,'entity');
			var principal = nlapiLookupField('vendorpayment',internalid,'class');
			var location = nlapiLookupField('vendorpayment',internalid,'location');
			var amount = nlapiLookupField('vendorpayment',internalid,'total');
			var account = nlapiLookupField('vendorpayment',internalid,'account');
			
			nlapiSetFieldValue('name',checknumber);
			nlapiSetFieldValue('custrecord_txtcheckdate',checkdate);
			nlapiSetFieldValue('custrecord_txtcvnumber',cvnumber);
			nlapiSetFieldValue('custrecord842',payee);
			nlapiSetFieldValue('custrecord843',principal);
			nlapiSetFieldValue('custrecord844',location);
			nlapiSetFieldValue('custrecord_txtamount',Math.abs(amount));
			nlapiSetFieldValue('custrecord849',account);
		}catch(e){
		}
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

function disableCheckNumber(type,name){ // deployed in the form.
	nlapiDisableField('name', true); // disable check number field.
}