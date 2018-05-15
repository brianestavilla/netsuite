/**
*	Draft Customer Deposit
*
*	Author : Vanessa Sampang
**/
function suitelet(request, response)
{
	//GET Request
	if(request.getMethod() == 'GET')
	{
		/**### Form and fields creation ###**/
		var form = nlapiCreateForm('Draft Customer Deposit');//Creation of Form Object
		//Field groups
		form.addFieldGroup(PRIMARY_INFO, "Primary Information"); 
		form.addFieldGroup(CLASSIFICATION, "Classification");	
		
		form.addField(CUSTOMER, UI_TYPE[0], 'Salesman/Customer', CUSTOMER, PRIMARY_INFO).setMandatory(true);			//Customer Field
		form.addField(TRAN_DATE, UI_TYPE[1], 'Date', null, PRIMARY_INFO).setDefaultValue(nlapiDateToString(new Date()));//Transaction Date Field											//Memo	
		form.addField(DEPARTMENT, UI_TYPE[0], 'Department', DEPT_LIST, CLASSIFICATION).setMandatory(true); 				//Department Field
		form.addField(PAID, UI_TYPE[4], 'Paid', null, CLASSIFICATION); 													//Paid Field
		form.addField(PRINCIPAL, UI_TYPE[0], 'Principal', CLASSIFICATION, CLASSIFICATION).setMandatory(true); 			//Principal Field
		form.addField(LOCATION, UI_TYPE[0], 'Location', LOC_LIST, CLASSIFICATION).setMandatory(true); 					//Location Field
		form.addField('orno','text', 'OR No', null, CLASSIFICATION).setMandatory(true);
		//Adds tab on the form
		form.addTab(CASH_TAB, 'Cash Payment');
		form.addTab(CHECKS_TAB, 'Check Payment');
		
		//Create Sublist
		form.addField(CASH_AMT, UI_TYPE[5], 'Cash Amount', null, CASH_TAB); 											//Payment Method Field
		var sublist = form.addSubList(CHECK_SUBLIST, UI_TYPE[6], 'Checks', CHECKS_TAB);
		sublist.addField(CHECKNO, UI_TYPE[2], 'Check #').setMandatory(true);											//Check Number Field
		sublist.addField(BANK_PAYMENT, UI_TYPE[0], 'Bank of Payment', BANK_LIST).setMandatory(true);
		sublist.addField(BANK_BRANCH, UI_TYPE[0], 'Bank Branch', BANK_BRANCH_LIST).setMandatory(true);
		sublist.addField(DUE_DATE, UI_TYPE[1], 'Due Date').setMandatory(true);
		sublist.addField(BANK_CATEGORY, UI_TYPE[0], 'Bank Category', BANK_CAT_LIST).setMandatory(true);
		sublist.addField(AMOUNT, UI_TYPE[5], 'Amount').setMandatory(true);
		form.setScript('customscript503');
		form.addSubmitButton("Submit");
		form.addResetButton("Reset");
		/**### END Form and fields creation ###**/
		response.writePage(form);
	}else 
	{
		/**### GETS THE SUBMITTED FIELD VALUES ###**/
		var customer = request.getParameter(CUSTOMER),
			trandate = request.getParameter(TRAN_DATE),
			account1 = request.getParameter(UNDEP_FUNDS),
			paid = request.getParameter(PAID),
			department = request.getParameter(DEPARTMENT),
			orno = request.getParameter('orno'),
			principal = request.getParameter(PRINCIPAL),
			location = request.getParameter(LOCATION),
			cashamount = request.getParameter(CASH_AMT),
			bankbranch_cash = request.getParameter('bankbranchcash'),
		/**### END SUBMITTED FIELD VALUES ###**/
			list = nlapiCreateList('Customer Deposits'),
			internal_ids = [],
			count = 0
		;
		
		for(var i = 1; i <= request.getLineItemCount(CHECK_SUBLIST); i++)
		{
			var checkno = request.getLineItemValue(CHECK_SUBLIST, CHECKNO, i),
				bankpayment = request.getLineItemValue(CHECK_SUBLIST, BANK_PAYMENT, i),
				bankbranch = request.getLineItemValue(CHECK_SUBLIST, BANK_BRANCH, i),
				duedate = request.getLineItemValue(CHECK_SUBLIST, DUE_DATE, i),
				bankcategory = request.getLineItemValue(CHECK_SUBLIST, BANK_CATEGORY, i),
				amount  = request.getLineItemValue(CHECK_SUBLIST, AMOUNT, i)
			;
			/**
			* Creates Standard Customer Deposit in dynamic mode
			* and sets values for fields and line items
			**/
			var record = nlapiCreateRecord('customerdeposit', {recordmode: 'dynamic', entity: customer});
				record.setFieldValue(TRAN_DATE, trandate);
				record.setFieldValue(PAID, paid);
				record.setFieldValue('class', principal);
				record.setFieldValue(DEPARTMENT, department);
				record.setFieldValue(LOCATION, location);
				record.setFieldValue('custbody174', bankcategory);
				record.setFieldValue(UNDEP_FUNDS, 'T');
				record.setFieldValue('custbody1', bankpayment);
				
				record.setFieldValue('custbody173', bankbranch);
				
				record.setFieldValue('custbody150', orno);
				record.setFieldValue('payment', amount);
				record.setFieldValue('custbody61', duedate);
				record.setFieldValue('custbody141', checkno);
				record.setFieldValue('paymentmethod', '1');
			var id = nlapiSubmitRecord(record, null, true);
			internal_ids[i-1] = id;
		}
		if(cashamount > 0)
		{
			var record = nlapiCreateRecord('customerdeposit', {recordmode: 'dynamic', entity: customer});
				record.setFieldValue(TRAN_DATE, trandate);
				record.setFieldValue('class', principal);
				record.setFieldValue(DEPARTMENT, department);
				record.setFieldValue(LOCATION, location);
				record.setFieldValue(UNDEP_FUNDS, 'T');
				
				record.setFieldValue('custbody173', bankbranch_cash);
				record.setFieldValue('paymentmethod', '1');
				record.setFieldValue('custbody150', orno);
				record.setFieldValue('payment', cashamount);
				record.setFieldValue('custbody1', bankbranch_cash);
				
			var id = nlapiSubmitRecord(record, null, true); //submits the standard customer deposit
			internal_ids[internal_ids.length + 1] = id;
		}
		
		var column = list.addColumn('number', 'text', 'Number', 'left');
		column.setURL(nlapiResolveURL('RECORD','customerdeposit'));
		column.addParamToURL('id','id', true);
 
		list.addColumn('trandate', 'date', 'Date', 'left');
		list.addColumn('name_display', 'text', 'Customer', 'left');
		list.addColumn('custbody174_display', 'text', 'Bank Category', 'left');
		list.addColumn('custbody173_display', 'text', 'Bank Branch', 'right');
		list.addColumn('amount', 'currency', 'Amount', 'right');
		
		var filters = [
						new nlobjSearchFilter('internalid', null, 'anyof', internal_ids),
						new nlobjSearchFilter('mainline', null, 'is', 'T')
					];
		var columns = [
						new nlobjSearchColumn('number'),
						new nlobjSearchColumn('trandate'),
						new nlobjSearchColumn('name'),
						new nlobjSearchColumn('custbody174'),
						new nlobjSearchColumn('custbody173'),
						new nlobjSearchColumn('amount')
					];
		var record_list = nlapiSearchRecord('customerdeposit', null, filters, columns);
		list.addRows(record_list);
		response.writePage( list ); //shows all submitted customer deposits
	}
}