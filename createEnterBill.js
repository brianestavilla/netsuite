function createEnterBill() {
		var newRecord = nlapiGetNewRecord(),
		internalid1 = newRecord.getId(),
		recordtype = newRecord.getRecordType(),
		//ctx = nlapiGetContext(),
		//payee = ctx.getSetting('SCRIPT', 'custscript18'), //custscript17
		bill = nlapiCreateRecord('vendorbill'),
		employee = newRecord.getFieldValue('custrecord157'),
		account = newRecord.getFieldValue('custrecord158'),
		department = newRecord.getFieldValue('custrecord159'),
		principal = newRecord.getFieldValue('custrecord160'),
		location = newRecord.getFieldValue('custrecord161'),
		//incentive = newRecord.getFieldValue('custrecord162'),
		//cashbond = newRecord.getFieldValue('custrecord163'),
		empName = newRecord.getFieldValue('custrecord157')
		;
		//employeeid = (empName == '' || empName == null) ? '' : nlapiLookupField('vendor', empName, 'custentity34', false);
		ap = 0;
		cb = 0;
		incentive = 0
		for(var i = 1; i <= newRecord.getLineItemCount('recmachcustrecord790'); i++){
			ap += parseFloat(newRecord.getLineItemValue('recmachcustrecord790', 'custrecord791', i));
			cb += parseFloat(newRecord.getLineItemValue('recmachcustrecord790', 'custrecord789', i));
			incentive += parseFloat(newRecord.getLineItemValue('recmachcustrecord790', 'custrecord788', i));
		}
		
		
		bill.setFieldValue('customform', '138');
		bill.setFieldValue('custbody62', '2');
		bill.setFieldValue('custbody167', internalid1);
		bill.setFieldValue('custbody51', '3');
		bill.setFieldValue('entity', empName); //Metropolitan Bank & Trust Co.
		bill.setFieldValue('account', account);
		bill.setFieldValue('department', department);
		bill.setFieldValue('class', principal);
		bill.setFieldValue('location', location);
		bill.setFieldValue('usertotal', ap);
		bill.setFieldValue('custbody85', internalid1);
		bill.setFieldValue('terms', '5');
		
		bill.setLineItemValue('expense', 'account', 1, '142');
		bill.setLineItemValue('expense', 'amount', 1, incentive);
		bill.setLineItemValue('expense', 'taxcode', 1, '5');
		bill.setLineItemValue('expense', 'department', 1, department);
		bill.setLineItemValue('expense', 'class', 1, principal);
		bill.setLineItemValue('expense', 'location', 1, location);
		
		bill.setLineItemValue('expense', 'account', 2, '1063');
		bill.setLineItemValue('expense', 'amount', 2, cb * -1);
		bill.setLineItemValue('expense', 'taxcode', 2, '5');
		bill.setLineItemValue('expense', 'department', 2, department);
		bill.setLineItemValue('expense', 'class', 2, principal);
		bill.setLineItemValue('expense', 'location', 2, location);
		
		billID = nlapiSubmitRecord(bill, null, true);
		newRecord.setFieldValue('custrecord184', billID);
		//nlapiSubmitField(recordtype, internalid1, 'custrecord184', billID);
}