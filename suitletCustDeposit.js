function suitelet(request, response){

	internalid = request.getParameter("internalid");				
	custDeposit = nlapiLoadRecord('customerdeposit', internalid);
	
	var payment = custDeposit.getFieldValue('payment'),
		currency = custDeposit.getFieldValue('currency'),
		exchangerate = custDeposit.getFieldValue('exchangerate'),
		date = custDeposit.getFieldValue('trandate'),
		post = custDeposit.getFieldValue('postingperiod'),
		dept = custDeposit.getFieldValue('department'),
		principal = custDeposit.getFieldValue('class'),
		customer = custDeposit.getFieldValue('customer'),
		location = custDeposit.getFieldValue('location'),
		account = custDeposit.getFieldValue('account'),
		recordtype = custDeposit.getRecordType(),
		journal = nlapiCreateRecord('journalentry')
	;
	
	journal.setFieldValue('currency', currency);
	journal.setFieldValue('exchangerate', exchangerate);
	journal.setFieldValue('trandate', date);
	journal.setFieldValue('postingperiod', post);
	journal.setFieldValue('custbody140', internalid);
	
	journal.setLineItemValue('line', 'account', 1, "123");
	journal.setLineItemValue('line', 'entity', 1, customer);
	journal.setLineItemValue('line', 'debit', 1, payment);
	journal.setLineItemValue('line', 'department', 1, dept);
	journal.setLineItemValue('line', 'class', 1, principal);
	journal.setLineItemValue('line', 'location', 1, location);
	journal.setLineItemValue('line', 'account', 2, "132");
	journal.setLineItemValue('line', 'entity', 2, customer);
	journal.setLineItemValue('line', 'credit', 2, payment);
	journal.setLineItemValue('line', 'department', 2, dept);
	journal.setLineItemValue('line', 'class', 2, principal);
	journal.setLineItemValue('line', 'location', 2, location);
	
	var recordId = nlapiSubmitRecord(journal, null, true);
	nlapiSubmitField('customerdeposit', internalid, 'custbody98', recordId);
	nlapiSubmitField(recordtype, internalid, 'custbody67', 'Voided');
	nlapiSetRedirectURL('RECORD', 'journalentry', recordId);
	
	JERecord = nlapiLoadRecord('journalentry', recordId);
	tranid = JERecord.getFieldValue('tranid');
	
	paymentRecord = nlapiTransformRecord('customerdeposit', internalid, 'depositapplication');
	
	subIdinvoice = 'apply';
	
	payLinecount = paymentRecord.getLineItemCount(subIdinvoice);
	
	for (var i = 1; i <= payLinecount; i++) {
		type = paymentRecord.getLineItemValue(subIdinvoice, 'internalid', i);
		if (type == recordId) {
			paymentRecord.setLineItemValue(subIdinvoice, 'apply', i, 'T');
		}
	}
	
	var payId = nlapiSubmitRecord(paymentRecord, null, true);
	nlapiSubmitField('customerdeposit', internalid, 'custbody137', payId);
}
