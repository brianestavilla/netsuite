function beforeLoad(type, form){
	if(type == 'create'){
		recordType = nlapiGetRecordType();
		series = numberSeries('get', recordType);
		nlapiSetFieldValue('custrecord471', series);
		
		//get DR value
		var ctx = nlapiGetContext(),
			drid = ctx.getSessionObject('IDRID'),
			drrecord = nlapiLoadRecord('customrecord214', drid),//test
			drlinecount = drrecord.getLineItemCount('recmachcustrecord463'),
			drcreateted = drrecord.getId()
			iTOID = drrecord.getFieldValue('custrecord460');
		;
		iTOrecord = nlapiLoadRecord('customrecord160', iTOID);
		
		branch = drrecord.getFieldValue('custrecord459');
		date = drrecord.getFieldValue('custrecord464');
		
		for (i = 1; i <= drlinecount; i++) {
			//get DR lines
			var item = drrecord.getLineItemValue('recmachcustrecord463', 'custrecord444', i),
				qty1 = drrecord.getLineItemValue('recmachcustrecord463', 'custrecord452', i),
				unit1 = drrecord.getLineItemValue('recmachcustrecord463', 'custrecord453', i),
				tocost = iTOrecord.getLineItemValue('recmachcustrecord232', 'custrecord429', i)
			;
			
			//set DR lines
			if (qty1 != 0) {
				nlapiSelectNewLineItem('recmachcustrecord475');
				nlapiSetCurrentLineItemValue('recmachcustrecord475', 'custrecord477', item);
				nlapiSetCurrentLineItemValue('recmachcustrecord475', 'custrecord479', qty1);
				nlapiSetCurrentLineItemValue('recmachcustrecord475', 'custrecord480', qty1);
				nlapiSetCurrentLineItemValue('recmachcustrecord475', 'custrecord484', unit1);
				nlapiSetCurrentLineItemValue('recmachcustrecord475', 'custrecord484', unit1);
				nlapiSetCurrentLineItemValue('recmachcustrecord475', 'custrecord612', tocost);
				nlapiCommitLineItem('recmachcustrecord475');
			}
		}
		
		//set DR value
		nlapiSetFieldValue('custrecord466', branch);
		nlapiSetFieldValue('custrecord469', date);
		nlapiSetFieldValue('custrecord468', drcreateted);
	}
	if (type == 'view') {
		newId = nlapiGetRecordId();
		createRR = "window.location = '" + nlapiResolveURL('SUITELET', 'customscript353', 'customdeploy1') + "&internalid=" + newId  + "&l=t';";
		
		form.addButton("custpage_create", "Create RR", createRR);
	}
}


function beforeSubmit(type, form){
	if (type == 'create') {
		recordType = nlapiGetRecordType();
		numberSeries('fix', recordType);
	}
}