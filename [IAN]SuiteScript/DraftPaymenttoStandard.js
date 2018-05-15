//ENUMERATION
DEPARTMENT = 'custrecord651';
PRINCIPAL = 'custrecord652';
LOCATION = 'custrecord653';
OR_NUMBER = 'custrecord822';
TOTAL_CASH_AMOUNT = 'custrecord761';
MEMO = 'custrecord650';

DATE = 'custrecord648';


//apply subtab
APPLY_SUB_TAB = 'recmachcustrecord667';	
CHECK_SUB_TAB = 'recmachcustrecord765'; // check tab

var internalID = null;

function DraftPayment_BeforeSubmit(){

 	if (type != 'create')	
		return; 

	var newRecord = nlapiGetNewRecord();
		//internalID = newRecord.getId();

	dept = newRecord.getFieldValue( DEPARTMENT );
	principal = newRecord.getFieldValue( PRINCIPAL );
	loc = newRecord.getFieldValue( LOCATION );
	orNo = newRecord.getFieldValue( OR_NUMBER );
	orDate = newRecord.getFieldValue('custrecord_ordate');
	cashAmount = parseFloat(newRecord.getFieldValue( TOTAL_CASH_AMOUNT )); //cash tab

	//bankcategory = newRecord.getFieldValue('custrecord800');
	memo = newRecord.getFieldValue( MEMO ); // get memo
	date = newRecord.getFieldValue( DATE ); // get date

	subApply = 'apply';	

	//get all checks in check sub tab
	var checks = getAllChecks( newRecord );
	//get all invoices to apply
	invoices = getAllAppliedInvoices( newRecord );

	//initiate variables
	var check = null;
	var amountApplication = 0;

	var totalAmountApplication = cashAmount;
	var index = 0;
	
	//get session context
	var context = nlapiGetContext();
	
	//initialize session array
	var paymentsCreated = new Array();
	for (var i = 0; i < invoices.length; i++) 
	{
		ISCHECK = false;
		amountApplication = invoices[i].PaidAmount;
		//total amount to apply is not empty
		if (totalAmountApplication <= 0)
		{

			if(index < checks.length)
			{
				totalAmountApplication = checks[index].Amount;
				check = checks[index];
			}
			index ++;
		}

		if(totalAmountApplication < invoices[i].PaidAmount)
		{
			amountApplication = totalAmountApplication;
			totalAmountApplication = 0;
		}
		var paymentRetVal = null;
		try{
			paymentRetVal = createStrandardPayment(newRecord.getFieldValue('custrecord644'), invoices[i], amountApplication, check);
		}
		catch (e)
		{
			if(e instanceof nlobjError)
				nlapiLogExecution('Debug', 'Error', e.getCode(), e.getDetails());
			else
				nlapiLogExecution('Debug', 'Unexpected Error', e.toString());
		}

		//push session object to array
		paymentsCreated.push( paymentRetVal);
		
		//overwrite invoice paid amount value with the remaining balance		
		invoices[i].PaidAmount = invoices[i].PaidAmount - amountApplication;

		var FIELD;
		//if check
		if (ISCHECK) 
			{
				FIELD = 'custrecord733';//check
			}
		else //if cash
			{
				FIELD = 'custrecord732';//cash
			}		
		
		nlapiSetLineItemValue( APPLY_SUB_TAB, FIELD, invoices[i].Index, paymentRetVal );	
		
		//if invoice has remaining balance
		if(invoices[i].PaidAmount > 0)
			i--; //hold current invoice 
	}
	context.setSessionObject('payments', paymentsCreated);
}

function createStrandardPayment( customer, invoice, amountToApply, check ){	
		
	payment = nlapiCreateRecord('customerpayment', { entity : customer});
	
	payment.setFieldValue('customform', '123');

	payment.setFieldValue('paymentmethod', '1');

	if (typeof(check) == 'object' && check != null) 
	{	
		payment.setFieldValue('custbody1', check.Account);
		payment.setFieldValue('custbody141', check.CheckNumber);
		payment.setFieldValue('checknum', check.CheckNumber); //standard check number
		payment.setFieldValue('custbody174', check.Category);
		payment.setFieldValue('custbody173', check.Branch);
		payment.setFieldValue('custbody185', check.DueDate);
		payment.setFieldValue('paymentmethod', '2');
		ISCHECK = true;
	}
	
	payment.setFieldValue('department', dept);
	payment.setFieldValue('class', principal);
	payment.setFieldValue('location', loc);	
	payment.setFieldValue('undepfunds', 'T');
	payment.setFieldValue('custbody150', orNo);
	payment.setFieldValue('memo', memo);
	payment.setFieldValue('trandate', date);
	payment.setFieldValue( 'custbody186', invoice.SalesRep );
	payment.setFieldValue('custbody151', orDate);
	
	var line = payment.getLineItemCount('apply');
	for ( var int = 1; int <= line; int++) {
		var paymentInvoice = payment.getLineItemValue('apply', 'internalid', int);
		if(paymentInvoice == invoice.Refference)
			{				
				payment.setLineItemValue('apply', 'amount', int, amountToApply);
			}		
	}
	
	return nlapiSubmitRecord(payment, null, true);
}

function getAllAppliedInvoices( record ){

	//get line item count
	linecount = record.getLineItemCount( APPLY_SUB_TAB );

	var invoices = [];
	for (var i = 1; i <= linecount; i++) {

		var Invoice = {
			Index: i,
			IsApplied: record.getLineItemValue(APPLY_SUB_TAB, 'custrecord655', i),
			PaidAmount: parseFloat(record.getLineItemValue(APPLY_SUB_TAB, 'custrecord760', i)),
			Refference: record.getLineItemValue(APPLY_SUB_TAB, 'custrecord659', i), 
			InvoiceAmount: record.getLineItemValue(APPLY_SUB_TAB, 'custrecord660', i),
			InvoiceDate: record.getLineItemValue(APPLY_SUB_TAB, 'custrecord656', i),
			SalesRep: record.getLineItemValue(APPLY_SUB_TAB, 'custrecord850', i)

		};

		if( Invoice.IsApplied == 'T' && Invoice.PaidAmount != 0) invoices.push(Invoice);
	}

	return invoices;
}

function getAllChecks( record ){

	linecount = record.getLineItemCount( CHECK_SUB_TAB ); // line item count in check tab

	var checks = [];
	for (var i = 1; i <= linecount; i++) {

		var Check = {

			Amount: parseFloat(record.getLineItemValue(CHECK_SUB_TAB, 'custrecord764', i)),
			Category: record.getLineItemValue(CHECK_SUB_TAB, 'custrecord821', i),
			CheckNumber: record.getLineItemValue(CHECK_SUB_TAB, 'custrecord762', i),
			Account: record.getLineItemValue(CHECK_SUB_TAB, 'custrecord763', i),
			Branch: record.getLineItemValue(CHECK_SUB_TAB, 'custrecord799', i),
			DueDate: record.getLineItemValue(CHECK_SUB_TAB, 'custrecord798', i)
		};

		checks.push(Check);	
	}

	return checks;
}

function AfterSubmit(type, form) {
	if(type != 'create') return;
	
	var context = nlapiGetContext();		
	var paymentId = context.getSessionObject('payments');
	var id = paymentId.split(',');
	for(var i=0; i < id.length; i++){
		nlapiSubmitField('customerpayment', id[i], 'custbody136', nlapiGetRecordId());
		nlapiLogExecution('Debug', 'Payment id ', id[i]);
		nlapiLogExecution('Debug', 'Draft Payment id ', nlapiGetRecordId());
	}
}

