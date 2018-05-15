//TODO create a separate function for searching credits
//	   search should allow 2 types: Sales Order and Invoice

//CONSTANTS
var FLD_PRINCIPAL = 'custrecord153',
	FLD_CUSTOMER = 'custrecord152',
	FLD_CREDITSTATUS = 'custbody47',
	FLD_CREDITLIMIT = 'custrecord154',
	CHK_EXCEEDCREDITLIMIT = 'custbody60',
	CHK_OVERDUEBALANCE = 'custbody58',
	CHK_UNPAIDBALANCE = 'custbody59',
	REC_CREDITLIMIT = 'customrecord150',
	ONHOLDSTATUS = '2';

function afterSubmit(type, form){
	var currentRecord = nlapiGetNewRecord(), //newRecord
		//internalid1 = currentRecord.getId(),
		//recordtype = currentRecord.getRecordType(),
		//ctx = nlapiGetContext(),
		//form = newRecord.getFieldValue('customform'),
		//entity = ctx.getSetting('SCRIPT', 'custscript22'),
		total = parseFloat(currentRecord.getFieldValue('total'));
		currentRecordCustomer = currentRecord.getFieldValue( 'custbody144' );
		currentRecordPrincipal = currentRecord.getFieldValue('class');
		
		nlapiLogExecution('Debug', 'Customer', nlapiGetFieldValue('class'));	
	if(type != 'create' && form == '170') return;		
	
	//OVERDUE AMOUNT
	var filter = new Array(
				new nlobjSearchFilter('class', null, 'anyof', currentRecord.getFieldValue('class'), null),
				new nlobjSearchFilter('entity', null, 'anyof', currentRecord.getFieldValue( 'entity' ), null)
				);
	
	var columns = new nlobjSearchColumn('amount', null, 'sum');
	//get all overdue transactions
	var overdue = nlapiSearchRecord('invoice', 'customsearch100', filter, columns);			
	
	var filter = new Array(
			new nlobjSearchFilter('class', null, 'anyof', currentRecord.getFieldValue('class'), null),
			new nlobjSearchFilter('entity', null, 'anyof', currentRecord.getFieldValue( 'entity' ), null)
			);

	var columns = new nlobjSearchColumn('amount', null, 'sum');	
	
	var creditUse = nlapiSearchRecord('transaction', 'customsearch111', filter, columns);
	
	//LAST PURCHASE		
	if(creditUse != null) lastpurchase = '';
	else lastpurchase = null;
	
	//CREDIT LIMIT
	filter = new Array(
				new nlobjSearchFilter( FLD_CUSTOMER , null , 'anyof' , currentRecordCustomer , null ),
				new nlobjSearchFilter( FLD_PRINCIPAL , null, 'anyof', currentRecordPrincipal, null )
				);
	
	columns = new nlobjSearchColumn( FLD_CREDITLIMIT );
	var creditLimit = nlapiSearchRecord( REC_CREDITLIMIT , null, filter, columns);
	
	var amount = 0;
	if(creditUse != null)
			amount = (creditUse[0].getValue('amountremaining', null, 'sum') == null || creditUse[0].getValue('amountremaining', null, 'sum') == '') ? 0 : parseFloat(creditUse[0].getValue('amountremaining', null, 'sum')); 
	else var amount = 0;
		
	if(creditLimit != null)
	{		
		if((amount + total) > parseFloat(creditLimit[0].getValue( FLD_CREDITLIMIT ))) 
			currentRecord.setFieldValue( CHK_EXCEEDCREDITLIMIT , 'T');
		
		if(overdue != null)
			currentRecord.setFieldValue( CHK_OVERDUEBALANCE , 'T');

		if(lastpurchase != null)
			currentRecord.setFieldValue( CHK_UNPAIDBALANCE , 'T');

		currentRecord.setFieldValue( FLD_CREDITSTATUS , ONHOLDSTATUS );
	}
}

function hasOverDueInvoice( customer, principal )
{	
	var filters = [
	               new nlobjSearchFilter('class', null, 'anyof', currentRecord.getFieldValue( principal ), null),
	               new nlobjSearchFilter('entity', null, 'anyof', currentRecord.getFieldValue( customer ), null)
	               ];
	
	var columns = [
	              new nlobjSearchColumn('entity', null, 'group'),
	              new nlobjSearchColumn('amount', null, 'sum')
	              ];
	
	var overdue = nlapiCreateSearch( 'invoice', filters, columns );
	
	if(overdue != null)
		return true;
		
	return; //return false
}

function isExceedCreditLimit( customer, principal )
{
	var filters = [
					new nlobjSearchFilter('class', null, 'anyof', currentRecord.getFieldValue( principal ), null),
					new nlobjSearchFilter('entity', null, 'anyof', currentRecord.getFieldValue( customer ), null)
	               ];
	
	var columns = [
	              new nlobjSearchColumn('entity', null, 'group'),
	              new nlobjSearchColumn('amount', null, 'sum')
	              ];
	
	var result = nlapiCreateSearch( 'transaction', filters, columns );
	
	//TODO: -get the customer credit limit
	//		-get the total credit used
	//		-validate if customer has exceed its credit limit
	//		-if exceed return true
	
	return;//return false
}

function getCreditUsed( customer, principal)
{
	var REC_CREDITLIMIT = 'customrecord150';
	var filters = [
	               	new nlobjSearchFilter('type', null, 'anyof', currentRecord.getFieldValue( principal ), null),
					new nlobjSearchFilter('class', null, 'anyof', currentRecord.getFieldValue( principal ), null),
					new nlobjSearchFilter('entity', null, 'anyof', currentRecord.getFieldValue( customer ), null)
	               ];
	
	var columns = [
	              new nlobjSearchColumn('entity', null, 'group'),
	              new nlobjSearchColumn('amount', null, 'sum')
	              ];
	
	var result = nlapiCreateSearch( REC_CREDITLIMIT, filters, columns);
}
