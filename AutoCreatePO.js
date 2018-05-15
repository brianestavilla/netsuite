function AutoCreatePO(type,name){
	
	if(type == 'create'){
	
	var getrecord = nlapiGetNewRecord();
	
	var internalid1 = getrecord.getId();
	var recordtype = getrecord.getRecordType();
	
	var vendor = getrecord.getFieldValue('custrecord53');
	var date = getrecord.getFieldValue('custrecord40');
	var department = getrecord.getFieldValue('custrecord38');
	var typeofpo = getrecord.getFieldValue('custrecord41');
	var location = getrecord.getFieldValue('custrecord76');
	var principal = getrecord.getFieldValue('custrecord130');
	
	var linecount = getrecord.getLineItemCount('recmachcustrecord33');
	
	var record = nlapiCreateRecord('purchaseorder');
	
	//record.setFieldValue('tranid', '300'); // PO#
	record.setFieldValue('entity',vendor); //supplier
	record.setFieldValue('trandate',date); //date
	record.setFieldValue('department',department); //department
	record.setFieldValue('custbody4',typeofpo); // type
	record.setFieldValue('location',location); // location
	record.setFieldValue('class',principal);
	
	for(var i = 1; i <= linecount; i++){
		var itemcode = getrecord.getLineItemValue('recmachcustrecord33','custrecord34',i);
			record.setLineItemValue('item', 'item',i,itemcode); //item code (custrecord34)
		var descip = getrecord.getLineItemValue('recmachcustrecord33','custrecord46',i);
			record.setLineItemValue('item', 'description',i,descip); //Description (custrecord46)
		var quantity = getrecord.getLineItemValue('recmachcustrecord33','custrecord48',i);
			record.setLineItemValue('item', 'quantity',i,quantity); // Quantity order (custrecord48)
		var unitcost = getrecord.getLineItemValue('recmachcustrecord33','custrecord58',i);
			record.setLineItemValue('item', 'rate',i,unitcost); // Unit COst (custrecord58)
		var amount = getrecord.getLineItemValue('recmachcustrecord33','custrecord59',i);
			record.setLineItemValue('item', 'amount',i,amount); // Amount (custrecord59)
	}
	
		var id = nlapiSubmitRecord(record, null, true); //submit record	
		var ponumber = nlapiLookupField('purchaseorder',id,'tranid'); //get PO number
		nlapiSubmitField(recordtype,internalid1,'custrecord52',ponumber); //update PO number in PR form
		
		
		//auto PR number
		var columns = new nlobjSearchColumn('internalid');
		var result = nlapiSearchRecord('customrecord111', 'customsearch76',null,columns);
		
		if(result != null){
			for(var i = 0; i < result.length; i++){
				var recordcount = result[i];
				var interna = recordcount.getValue('internalid');
			}
			nlapiSubmitField(recordtype, internalid1, 'custrecord39', interna);
		}
	}
	
	
	/*var column = new nlobjSearchColumn('number');
	var ponumber = nlapiSearchRecord('purchaseorder', null,null,column);
	var po;
	for(var i = 0; i < ponumber.length; i++){
		var pocount = ponumber[i];
		po = pocount.getValue(column);
	}*/
}