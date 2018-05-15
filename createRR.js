function beforeLoad(type, form){
	if (type == 'create') {
		ctx = nlapiGetContext(),
		iPOID = ctx.getSessionObject('iPOID'),
		newRecord = nlapiLoadRecord('purchaseorder', iPOID);
		
		linecount = newRecord.getLineItemCount('item');
	
		venname = newRecord.getFieldValue('entity');
		//date = newRecord.getFieldValue('trandate');
		po = newRecord.getId();
		memo = newRecord.getFieldValue('memo');
		dept = newRecord.getFieldValue('department');
		principal = newRecord.getFieldValue('class');
		loc = newRecord.getFieldValue('location');
		currency = newRecord.getFieldValue('currency');
		paytype = newRecord.getFieldValue('custbody38');
		rate = newRecord.getFieldValue('exchangerate');
		custRR = nlapiCreateRecord('customrecord168');
		
		nlapiSetFieldValue('custrecord283', venname);
		nlapiSetFieldValue('custrecord284', currency);
		nlapiSetFieldValue('custrecord289', memo);
		nlapiSetFieldValue('custrecord292', rate);
		nlapiSetFieldValue('custrecord285', po);
		
		userId = nlapiGetUser();
		empRecord = nlapiLoadRecord('employee', userId);
		recloc = empRecord.getFieldValue('custentity38');
		
		for(var i = 1; i <= linecount; i++){
			var item = newRecord.getLineItemValue('item', 'item', i),
				name = newRecord.getLineItemValue('item', 'vendorname', i),
				quantityreceived = newRecord.getLineItemValue('item', 'quantityreceived', i),
				quantitybilled = newRecord.getLineItemValue('item', 'quantitybilled', i),
				quantity = newRecord.getLineItemValue('item', 'quantity', i),
				units = newRecord.getLineItemValue('item', 'units', i),
				desc = newRecord.getLineItemValue('item', 'description', i),
				rateline = newRecord.getLineItemValue('item', 'rate', i),
				options = newRecord.getLineItemValue('item', 'options', i)
			;
			
			remaining = parseInt(quantity) - parseInt(quantityreceived);
			if(remaining > 0)
			{
				nlapiSelectNewLineItem('recmachcustrecord291');
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord297', recloc);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord294', item);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord295', name);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord299', remaining);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord300', remaining);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord301', units);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord296', desc);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord304', rateline);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord303', options);
				nlapiSetCurrentLineItemValue('recmachcustrecord291', 'custrecord598', 0);
				nlapiCommitLineItem('recmachcustrecord291');
			}
		}
	}
}