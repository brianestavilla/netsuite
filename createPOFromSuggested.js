function createPO(type, form){
	var newRecord = nlapiGetNewRecord(),	//Suggested Order Record
		internalid1 = newRecord.getId(),	//Suggested Order ID
		recordtype = newRecord.getRecordType(),	//Record Type: Suggested Order
		
		po = nlapiCreateRecord('purchaseorder'),	//Creation of PO
		linecount = newRecord.getLineItemCount('recmachcustrecord86'),
		supplier = newRecord.getFieldValue('custrecord92'),
		location = newRecord.getFieldValue('custrecord87'),
		principal = newRecord.getFieldValue('custrecord88'),
		date = newRecord.getFieldValue('custrecord90'),
		department = newRecord.getFieldValue('custrecord91')
	;
	po.setFieldValue('entity', supplier);
	po.setFieldValue('trandate', date);
	po.setFieldValue('department', department);
	po.setFieldValue('class', principal);
	po.setFieldValue('location', location);
	po.setFieldValue('custbody57', internalid1);
	var count = 1;
	for(var i = 1; i <= linecount; i++){
		var item = newRecord.getLineItemValue('recmachcustrecord86', 'custrecord79', i),
			quantity = newRecord.getLineItemValue('recmachcustrecord86', 'custrecord84', i)
		;
		quantity = (quantity == null || quantity == '')? 0 : quantity;
		if(quantity > 0 && item != '450'){
			po.setLineItemValue('item', 'item', count, item);
			po.setLineItemValue('item', 'quantity', count, quantity);
			po.setLineItemValue('item', 'taxcode', count, '6');
			count++
		}
	}
	
	var poid = nlapiSubmitRecord(po, null, true);
	nlapiSubmitField(recordtype, internalid1, 'custrecord137', poid);
}