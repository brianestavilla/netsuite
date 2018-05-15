function CreateJournal(type,name){
	if(type == 'create'){
		var transferRecord = nlapiGetNewRecord();
		
		var internalid = transferRecord.getId();
		var recordtype = transferRecord.getRecordType();
		
		var fromaccount = transferRecord.getFieldValue('custrecord183'); //get from account value
		var toaccount = transferRecord.getFieldValue('custrecord185'); //get to account value
		var amount = transferRecord.getFieldValue('custrecord188'); // get amount
		var department = transferRecord.getFieldValue('custrecord206'); //get department
		var location = transferRecord.getFieldValue('custrecord207'); //get location
		var principal = transferRecord.getFieldValue('custrecord211'); //get pricipal
		
		var createJournalRecord = nlapiCreateRecord('journalentry'); // create record for journal entry
		
		createJournalRecord.setLineItemValue('line','account',1,toaccount); //set toaccount
		createJournalRecord.setLineItemValue('line','debit',1,parseFloat(amount)); //set debit
		createJournalRecord.setLineItemValue('line','department',1,department);// set department
		createJournalRecord.setLineItemValue('line','location',1,location);// set location
		createJournalRecord.setLineItemValue('line','class',1,principal);// set principal
		
		createJournalRecord.setLineItemValue('line','account',2,fromaccount); //set fromaccount
		createJournalRecord.setLineItemValue('line','credit',2,parseFloat(amount));//set credit
		createJournalRecord.setLineItemValue('line','department',2,department);
		createJournalRecord.setLineItemValue('line','location',2,location);
		createJournalRecord.setLineItemValue('line','class',2,principal);
		
		var id = nlapiSubmitRecord(createJournalRecord,null,true); //create journal entry
		var jeno = nlapiLookupField('journalentry',id,'tranid'); //get je no
		
		nlapiSubmitField(recordtype,internalid,'custrecord210',jeno); //update JE number in PR form
		
	}
}