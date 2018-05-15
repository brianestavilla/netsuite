function beforeLoad(){
if(type == 'view'){
nlapiInitiateWorkflow('vendorbill', nlapiGetNewRecord().getId(), 'customworkflow29_3_3_3');
}
}
function afterSubmit(type, form){
if(type == 'create'){
	record = nlapiGetNewRecord();
       parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false);
	var number = numberSeries('get', 'vendorbill', parent_location);
	nlapiSubmitField('vendorbill', record.getId(), 'custbody37', number);
	numberSeries('fix', 'vendorbill', parent_location);
}
}

function userEventBeforeSubmit(type) {
	if(type=='create') {
		var invoiceno = nlapiGetFieldValue('tranid');
		var filter = new nlobjSearchFilter('tranid', null, 'is',  invoiceno);
		var column = new nlobjSearchColumn('internalid');
		var result = nlapiSearchRecord('vendorbill', null, filter, column);
		if(result!=null)
		{
			throw nlapiCreateError('ERROR_SAVE', "Supplier's Invoice No. Already Exist.");
		}
	}
	
	/**
	** TOTAL DISCOUNT COMPUTATION
	**/
	
//	if(nlapiGetRecordType()=='vendorbill') {
//		var record = nlapiGetNewRecord();
//		var linecount = record.getLineItemCount('item');
//		var total_discount = 0;
//		var totaltax = 0;
//		
//		for(var i=1; i<=record.getLineItemCount('item'); i++) {
//			total_discount+= parseFloat(record.getLineItemValue('item', 'custcol10', i));
//			totaltax += parseFloat(record.getLineItemValue('item', 'tax1amt', i));
//		}
//		
//		record.setFieldValue('custbody127', parseFloat(total_discount).toFixed(2));
//		record.setFieldValue('taxtotal', parseFloat(totaltax).toFixed(2));
//	}
	
}