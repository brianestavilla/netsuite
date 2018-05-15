function checkMonitoring(request, response){
	if(request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Cheque Monitoring Set-up');
		form.addSubmitButton('Submit');
		
		//Check Date
		form.addField('checkdatefrom', 'date', 'Check Date From');
		form.addField('checkdateto', 'date', 'To');
		
		nlapiGetContext().setSessionObject('status', 'get');
		response.writePage(form);
	}else{
		if(nlapiGetContext().getSessionObject('status') == 'get'){
			var form = nlapiCreateForm('Pick a Check');
			form.addSubmitButton('Submit');
			
			//Check Monitoring list
			form.addField("enterempslink", "url", "").setDisplayType( "inline" ).setLinkText( "Check Monitoring List").setDefaultValue('/app/common/custom/custrecordentrylist.nl?rectype=381&searchtype=Custom&searchid=854&refresh=&whence=');
			
			//Create Sublist
			var sublist = form.addSubList('custfield_sublist', 'list', 'Bill Payments');
			sublist.addRefreshButton();
			sublist.addField('custfield_ifpick', 'checkbox', 'Pick');
			var internal = sublist.addField('internalid', 'text', 'Internal Id');
			internal.setDisplayType('hidden');
			sublist.addField('number', 'text', 'Document Number');
			sublist.addField('custfield_payee', 'text', 'Payee');
			sublist.addField('checknumber', 'text', 'Check Number');
			sublist.addField('checkdate', 'text', 'Check Date');
			sublist.addField('totalamount', 'currency', 'Amount');
			sublist.addField('principal', 'text', 'Principal');
			sublist.addField('location', 'text', 'Location');
			sublist.addField('banks', 'text', 'Banks');
			
			//Display Values in Sublist
			//sublist.setLineItemValues(result);
			var billPaymentValue = getBillPayment(request.getParameter('checkdatefrom'),request.getParameter('checkdateto'));
			var counter = 1; // counter to set the line item in sublist
			var checkNumbers = getCheckNum();
			for(var i = 0; i < billPaymentValue.length; i++){
				var billPaymentResult = billPaymentValue[i];
				var checkIndex = checkNumbers.indexOf(billPaymentResult.Checknum); // get the index of an array 'checkNo'.
				if(checkIndex == -1){ // check if check number is already been set-up. -1 meaning not in the array.
					sublist.setLineItemValue('internalid',counter,billPaymentResult.Internalid);
					sublist.setLineItemValue('number',counter,billPaymentResult.Number);
					sublist.setLineItemValue('custfield_payee',counter,billPaymentResult.Payee);
					sublist.setLineItemValue('checknumber',counter,billPaymentResult.Checknum);
					sublist.setLineItemValue('checkdate',counter,billPaymentResult.Checkdate);
					sublist.setLineItemValue('totalamount',counter,Math.abs(billPaymentResult.Amount));
					sublist.setLineItemValue('principal',counter,billPaymentResult.Principal);
					sublist.setLineItemValue('location',counter,billPaymentResult.Location);
					sublist.setLineItemValue('banks',counter,billPaymentResult.Bank);
					//nlapiLogExecution('DEBUG', number);
					counter++;
				}
			}
			nlapiGetContext().setSessionObject('status', 'post');
			response.writePage(form);
		}else{
			var sublistLineCount = request.getLineItemCount('custfield_sublist');
			for(var i = 1; i <= sublistLineCount; i++){
				var checkboxxx = request.getLineItemValue('custfield_sublist', 'custfield_ifpick', i);
				if(checkboxxx == 'T'){
					var internalid = null;
					internalid = request.getLineItemValue('custfield_sublist', 'internalid', i);
					response.sendRedirect('RECORD','customrecord381',null,true,{iddd:internalid});
					break;
				}
			}
		}
	}
}

function getBillPayment(datefrom,dateto){
	var billPaymentArray = new Array();
	
	//Column for Sublist
	var columns = [new nlobjSearchColumn('internalid'), //internalid of a record
					new nlobjSearchColumn('number'), //document number
					new nlobjSearchColumn('name'), // Payee/ Vendor
					new nlobjSearchColumn('custbody53'), // Check number
					new nlobjSearchColumn('custbody61'), // Check date
					new nlobjSearchColumn('amount'), //Amount
					new nlobjSearchColumn('class'), // Principal
					new nlobjSearchColumn('location'), // Location
					new nlobjSearchColumn('custbody44') // Banks
					];
	
	var filter = datefrom === '' && dateto === '' ? null : new nlobjSearchFilter('custbody61', null, 'within', datefrom, dateto);
	
	var result = nlapiSearchRecord('vendorpayment', 'customsearch853', filter, columns); // excute query
	
	for(var i = 0; result != null && i < result.length; i++){
		var BillPaymentObject = new Object();
		//var fields = result[i];
		BillPaymentObject.Internalid = result[i].getValue('internalid');
		BillPaymentObject.Number = result[i].getValue('number');
		BillPaymentObject.Payee = result[i].getText('name');
		BillPaymentObject.Checknum = result[i].getValue('custbody53');
		BillPaymentObject.Checkdate = result[i].getValue('custbody61');
		BillPaymentObject.Amount = result[i].getValue('amount');
		BillPaymentObject.Principal = result[i].getText('class');
		BillPaymentObject.Location = result[i].getText('location');
		BillPaymentObject.Bank = result[i].getText('custbody44');
		billPaymentArray.push(BillPaymentObject);
	}
	
	return billPaymentArray;
}

function getCheckNum(){
	var checkNo = new Array(); // stores the check numbers that are already been set-up.
	var checkcolumn = new nlobjSearchColumn('name');
	var checkresult = nlapiSearchRecord('customrecord381', null, null, checkcolumn); // execute query for check numbers that are already been set-up.
	for(var j = 0; checkresult != null && j < checkresult.length; j++){
		checkNo.push(checkresult[j].getValue('name'));
	}
	return checkNo;
}