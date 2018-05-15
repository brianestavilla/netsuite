function createVendorDebit(type, form){
	var newRecord = nlapiGetNewRecord(),	
		internalid1 = newRecord.getId(),
		recordtype = newRecord.getRecordType()
	;
	
	linecountitem = newRecord.getLineItemCount('recmachcustrecord573');
	linecountexpense = newRecord.getLineItemCount('recmachcustrecord556');
	var bill = nlapiCreateRecord('vendorcredit');
	
	//get main line
	vendor = newRecord.getFieldValue('custrecord530');
	supcm = newRecord.getFieldValue('custrecord531');
	accountmain = newRecord.getFieldValue('custrecord532');
	date = newRecord.getFieldValue('custrecord537');
	post = newRecord.getFieldValue('custrecord538');
	memo = newRecord.getFieldValue('custrecord539');
	boreason = newRecord.getFieldValue('custrecord540');
	amount = newRecord.getFieldValue('custrecord533');
	tax = newRecord.getFieldValue('custrecord536');
var loc = newRecord.getFieldValue('custrecord782');
	
	//set value
	bill.setFieldValue('entity', vendor);
	bill.setFieldValue('account', accountmain);
	bill.setFieldValue('trandate', date);
	bill.setFieldValue('postingperiod', post);
	bill.setFieldValue('memo', memo);
	bill.setFieldValue('custbody42', boreason);
	bill.setFieldValue('usertotal', amount);
	bill.setFieldValue('taxtotal', tax);
	bill.setFieldValue('custbody164', supcm);
	bill.setFieldValue('custbody103', internalid1);
bill.setFieldValue('location', loc);
	bill.setFieldValue('custbody8', newRecord.getFieldValue('custrecord592'));
	if (linecountexpense != 0) {
		for (i = 1; i <= linecountexpense; i++) {
			var accountexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord541', i),
				amountexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord542', i),
				taxcodeexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord543', i),
				taxrateexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord544', i),
				deptexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord549', i),
				principalexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord551', i),
				locexp = newRecord.getLineItemValue('recmachcustrecord556', 'custrecord552', i)
			;
			
			bill.setLineItemValue('expense', 'account', i, accountexp);
			bill.setLineItemValue('expense', 'taxcode', i, taxcodeexp);
			bill.setLineItemValue('expense', 'amount', i, amountexp);
			bill.setLineItemValue('expense', 'location', i, locexp);
			bill.setLineItemValue('expense', 'department', i, deptexp);
			bill.setLineItemValue('expense', 'class', i, principalexp);
		}
	}
	
	
	if (linecountitem !=0) {
		for (i = 1; i <= linecountitem; i++) {
			var item = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord557', i),
				qtyitem = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord559', i),
				taxcodeitem = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord564', i),
				taxrateitem = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord566', i),
				deptitem = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord570', i),
				principalitem = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord571', i),
				locitem = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord572', i),
				gross = newRecord.getLineItemValue('recmachcustrecord573', 'custrecord567', i)
			;
			
			bill.setLineItemValue('item', 'item', i, item);
			bill.setLineItemValue('item', 'taxcode', i, taxcodeitem);
			bill.setLineItemValue('item', 'quantity', i, qtyitem);
			bill.setLineItemValue('item', 'department', i, deptitem);
			bill.setLineItemValue('item', 'class', i, principalitem);
			bill.setLineItemValue('item', 'location', i, locitem);
			bill.setLineItemValue('item', 'grossamt', i, gross);
		}
	}
	
	
	var id = nlapiSubmitRecord(bill, null, true);
	newRecord.setFieldValue('custrecord779', id);
}