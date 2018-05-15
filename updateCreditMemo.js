function createMemo(record_type, record_id){
try{
	var newRecord = nlapiLoadRecord(record_type, record_id),	
		internalid1 = newRecord.getId(),
		recordtype = newRecord.getRecordType(),
		linecount = newRecord.getLineItemCount('recmachcustrecord101');
		subIdExpense = 'recmachcustrecord366';
		subIdApply = 'recmachcustrecord789_2';
		applylinecount = newRecord.getLineItemCount(subIdApply);
		// if (linecount > 0){
		var	credit = newRecord.getFieldValue('custrecord97'),
		acct = newRecord.getFieldValue('custrecord824'),
		project = newRecord.getFieldValue('custrecord99'),
		date = newRecord.getFieldValue('custrecord117'),
		post = newRecord.getFieldValue('custrecord118'),
		po = newRecord.getFieldValue('custrecord119'),
		mem = newRecord.getFieldValue('custrecord120'),
		partner = newRecord.getFieldValue('custrecord121'),
		salesrep = newRecord.getFieldValue('custrecord122'),
		effectdate = newRecord.getFieldValue('custrecord123'),
		dept = newRecord.getFieldValue('custrecord124'),
		delivdate = newRecord.getFieldValue('custrecord125'),
		principal = newRecord.getFieldValue('custrecord126'),
		typsale = newRecord.getFieldValue('custrecord127'),
		location = newRecord.getFieldValue('custrecord128'),
		credstat = newRecord.getFieldValue('custrecord129'),
		discount = newRecord.getFieldValue('custrecord790_2'),
		mainrate = newRecord.getFieldValue('custrecord791_2'),
		unapplied = newRecord.getFieldValue('custrecord792'),
		applied = newRecord.getFieldValue('custrecord793_2')
		;
	var memo = nlapiCreateRecord('creditmemo', {account : acct,entity: project});
		memo.setFieldValue('tranid', credit);
		memo.setFieldValue('trandate', date);
		memo.setFieldValue('otherrefnum', po);
		memo.setFieldValue('memo', mem);
		memo.setFieldValue('partner', partner);
		memo.setFieldValue('department', dept);
		memo.setFieldValue('class', principal);
		memo.setFieldValue('location', location);
		memo.setFieldValue('unapplied', unapplied);
		//memo.setFieldValue('applied', applied);
		memo.setFieldValue('autoapply', 'T');
		var total = 0;
		for(var i = 1; i <= linecount; i++){
			var item = newRecord.getLineItemValue('recmachcustrecord101', 'custrecord104', i),
				//desc = newRecord.getLineItemValue('recmachcustrecord101', 'custrecord106', i),
				amount = newRecord.getLineItemValue('recmachcustrecord101', 'custrecord110', i)
			;
			amount = (amount != null && amount != '') ? parseFloat(amount) : 0;
			total += amount;
			nlapiLogExecution('Error', 'ItemID', item);
			memo.setLineItemValue('item', 'item', i, item);
			memo.setLineItemValue('item', 'quantity', i, 1);
			memo.setLineItemValue('item', 'taxcode', i, '5');
			memo.setLineItemValue('item', 'grossamt', i, amount);
		}
		for (var x = 1; x <= applylinecount; x++) {
			var apply = newRecord.getLineItemValue(subIdApply, 'custrecord780_2', x),
				payment = newRecord.getLineItemValue(subIdApply, 'custrecord788_2', x)
			;
			if(apply == 'T'){
				memo.setLineItemValue('apply', 'apply', x, 'T');
				memo.setLineItemValue('apply', 'amount', x, payment);
			}else memo.setLineItemValue('apply', 'apply', x, 'F');
		}
		
		var memoid = nlapiSubmitRecord(memo, true, true);
		//nlapiSubmitField(recordtype, internalid1, 'custrecord179', total);
		nlapiSubmitField(recordtype, internalid1, 'custrecord379', memoid);
		nlapiSubmitField(recordtype, internalid1, 'custrecord172', '2');
		//memo.setFieldValue('custrecord379', memoid);
	// }
	}catch(e){
		nlapiLogExecution('Error', 'Internal ID', record_id);
	}
}