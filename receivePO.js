function afterSubmit(type, form){
	try{
		var RR = nlapiGetNewRecord();
		iPOID = RR.getFieldValue('createdfrom');
		nlapiSubmitField('purchaseorder', iPOID, 'custbody93', 'T');
	}catch(e){}
}