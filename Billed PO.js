function billedPO(){
	var record = nlapiGetNewRecord();
	//var custForm = record.getFieldValue('customform');
	var createdfrom = record.getFieldValue('custbody121');
	//if(custForm != 138){
	//	nlapiSubmitField('purchaseorder', record.getFieldValue('custbody121'), 'custbody92', 'T');
	//}

	if(createdfrom != '')
	{
		nlapiSubmitField('purchaseorder', record.getFieldValue('custbody121'), 'custbody92', 'T');
	}
}