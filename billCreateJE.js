function afterSubmit(){
	var bill = nlapiGetNewRecord(),
		recordType = bill.getRecordType(),
		internalID = bill.getId()
	;
	
	charging = bill.getFieldValue('custbody106');
	vendor = bill.getFieldValue('custbody122');
	subID = 'expense';
	linecount = bill.getLineItemCount(subID);
	deptmain = bill.getFieldValue('department');
	principalmain = bill.getFieldValue('class');
	locmain = bill.getFieldValue('location');
	ctr = 1;
	if (charging == '2') {
		journal = nlapiCreateRecord('journalentry');
		subIDJE = 'line';
		totalAmt = 0;
		for (i = 1; i <= linecount; i++) {
			checkcharge = bill.getLineItemValue(subID, 'custcol21', i);
			if (checkcharge == 'T') {
				account = bill.getLineItemValue(subID, 'account', ctr);
				amount = bill.getLineItemValue(subID, 'amount', ctr);
				dept = bill.getLineItemValue(subID, 'department', ctr);
				principal = bill.getLineItemValue(subID, 'class', ctr);
				loc = bill.getLineItemValue(subID, 'location', ctr);
				taxcode = bill.getLineItemValue(subID, 'taxcode', ctr);
				grossamount = parseFloat(bill.getLineItemValue(subID, 'grossamt', ctr));
				
				
				totalAmt += grossamount;
				journal.setLineItemValue(subIDJE, 'account', ctr, account);
				journal.setLineItemValue(subIDJE, 'credit', ctr, amount);
				journal.setLineItemValue(subIDJE, 'department', ctr, dept);
				journal.setLineItemValue(subIDJE, 'class', ctr, principal);
				journal.setLineItemValue(subIDJE, 'location', ctr, loc);
				journal.setLineItemValue(subIDJE, 'taxcode', ctr, taxcode);
				journal.setLineItemValue(subIDJE, 'tax1acct', ctr, '110');
				
				ctr++;
			}
		}
		journal.setLineItemValue(subIDJE, 'account', ctr, '1166');
		journal.setLineItemValue(subIDJE, 'debit', ctr, totalAmt);
		journal.setLineItemValue(subIDJE, 'department', ctr, deptmain);
		journal.setLineItemValue(subIDJE, 'class', ctr, principalmain);
		journal.setLineItemValue(subIDJE, 'location', ctr, locmain);
		
		var id = nlapiSubmitRecord(journal, null, true);
		
		nlapiSubmitField(recordType, internalID, 'custbody124', id);
	}
}