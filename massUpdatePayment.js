// This script is to update Sales Rep and Check Due Date.

function submitFunction(recordtype, recordid){
	//try{		
		var record = nlapiLoadRecord(recordtype, recordid);
		var currentcheckNumber = record.getFieldValue('custbody141');
		var draftPaymentId = record.getFieldValue('custbody136');
		var customerid = record.getFieldValue('customer');
		var principal = record.getFieldValue('class');
		
		//var currentcheckNumber = nlapiLookupField(recordtype, recordid, 'custbody141');
		//var draftPaymentId = nlapiLookupField(recordtype, recordid, 'custbody136');
		//var customerid = nlapiLookupField(recordtype, recordid, 'customer');
		//var principal = nlapiLookupField(recordtype, recordid, 'class');
		
		
		draftPaymentRecord = nlapiLoadRecord('customrecord237', draftPaymentId);
		
		var draftPaymentCheckLineCount = draftPaymentRecord.getLineItemCount('recmachcustrecord765');
	
		for(var i = 1; draftPaymentCheckLineCount != 0 && i <= draftPaymentCheckLineCount; i++){
			var draftcheckNumber = draftPaymentRecord.getLineItemValue('recmachcustrecord765', 'custrecord762', i);
			var dueDate = draftPaymentRecord.getLineItemValue('recmachcustrecord765', 'custrecord798', i);
			
			if(draftcheckNumber == currentcheckNumber){
				//nlapiSubmitField(recordtype, recordid, 'custbody185', dueDate);
				record.setFieldValue('custbody185', dueDate);
				//nlapiLogExecution('DEBUG','duedate', dueDate);
			}
		}
		
		var invoiceInternalId = record.getLineItemValue('apply', 'internalid', 1);
		var salesRep = nlapiLookupField('invoice', invoiceInternalId, 'salesrep');
		record.setFieldValue('custbody186', salesRep);
		
		nlapiSubmitRecord(record, null, true);

		/*******-------------------- START CUSTOMER SALES REP SEARCH -------------------------********/
		/*filter = new Array(
					new nlobjSearchFilter('custrecord152', null, 'is', customerid), // customer
					new nlobjSearchFilter('custrecord153', null, 'is', principal) // principal
			);
		column = new nlobjSearchColumn('custrecord340');	//Sales Rep Column
		
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, column);*/
		/*******-------------------- END CUSTOMER SALES REP SEARCH -------------------------*******/
		/*if(creditLimit != null){
			//nlapiSubmitField(recordtype, recordid, 'custbody186', creditLimit[0].getValue('custrecord340'));
			record.setFieldValue('custbody186', creditLimit[0].getValue('custrecord340'));
		}*/
	
	//}catch(err){
	//}
	
	//nlapiLogExecution('DEBUG','result', checkNumber);
	
	
}