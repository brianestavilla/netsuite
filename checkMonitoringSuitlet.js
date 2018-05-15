function checkMonitoring(request, response){
	if(request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Pick a Check');
		form.addSubmitButton('Submit');
		
		//Check Monitoring list
		form.addField("enterempslink", "url", "").setDisplayType( "inline" ).setLinkText( "Check Monitoring List").setDefaultValue('https://system.netsuite.com/app/common/custom/custrecordentrylist.nl?rectype=381&searchtype=Custom&searchid=854&refresh=&whence=');
		
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
		
		var result = nlapiSearchRecord('vendorpayment', 'customsearch853', null, columns); // excute query
		
		//Create Sublist
		var sublist = form.addSubList('sublist', 'list', 'Bill Payments');
		sublist.addRefreshButton();
		sublist.addField('ifpick', 'checkbox', 'Pick');
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

		var counter = 1; // counter to set the line item in sublist
		
		var checkNo = new Array(); // stores the check numbers that are already been set-up.
		var checkcolumn = new nlobjSearchColumn('name');
		var checkresult = nlapiSearchRecord('customrecord381', null, null, checkcolumn); // execute query for check numbers that are already been set-up.
		for(var j = 0; checkresult != null && j < checkresult.length; j++){
			var checks = checkresult[j];
			checkNo[j] = checks.getValue('name');
		}
		
		//Display Values in Sublist
		//sublist.setLineItemValues(result);
		for(var i = 0; result != null && i < result.length; i++){
			var fields = result[i];
			var internalid = fields.getValue('internalid');
			var number = fields.getValue('number');
			var payee = fields.getText('name');
			var checknum = fields.getValue('custbody53');
			var checkdate = fields.getValue('custbody61');
			var amount = fields.getValue('amount');
			var principal = fields.getText('class');
			var location = fields.getText('location');
			var bank = fields.getText('custbody44');
			
			var checkIndex = checkNo.indexOf(checknum); // get the index of an array 'checkNo'.
			if(checkIndex == -1){ // check if check number is already been set-up. -1 meaning not in the array.
				sublist.setLineItemValue('internalid',counter,internalid);
				sublist.setLineItemValue('number',counter,number);
				sublist.setLineItemValue('custfield_payee',counter,payee);
				sublist.setLineItemValue('checknumber',counter,checknum);
				sublist.setLineItemValue('checkdate',counter,checkdate);
				sublist.setLineItemValue('totalamount',counter,Math.abs(amount));
				sublist.setLineItemValue('principal',counter,principal);
				sublist.setLineItemValue('location',counter,location);
				sublist.setLineItemValue('banks',counter,bank);
				//nlapiLogExecution('DEBUG', number);
				counter++;
			}
		}
		response.writePage(form);
	}else{
		var sublistLineCount = request.getLineItemCount('sublist');
		for(var i = 1; i <= sublistLineCount; i++){
			var checkboxxx = request.getLineItemValue('sublist', 'ifpick', i);
			if(checkboxxx == 'T'){
				var internalid = request.getLineItemValue('sublist', 'internalid', i);
				
				response.sendRedirect('RECORD','customrecord381',null,true,{iddd:internalid});
				break;
			}
		}
	}
}