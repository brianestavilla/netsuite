/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jul 2016     Brian
 */


/**
**	GLOBE CLASS VERIFIER 
**/

var GLOBEClassVerifier = function () {
	var API = new NETSUITE_API();
	
	this.VERIFY = function(data) {
		if(data.type=='invoice') {
			return this.INVOICE(data);
		} else if (data.type=='cashslip') {
			return this.CASH_SLIP(data);
		}
	};
	
	/*
	** INVOICE FUNCTION
	*/
	
	this.INVOICE = function (dataIn) {
		var data = {}, department = '', errorText = '', originaldata = dataIn;
		
		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/
				
				principal = API.getListId('classification', dataIn.principal);
				
				if(principal['error_code']==200) {
					customer = 	API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
					if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
					
					if(customer['error_code']==200) {
						creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
						if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
						if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';
						
						if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
							department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
							department = (department=='' || department==null) ? 1038 : department;
						} else { department = 1038; }
					
					}
				}
				
				operation = API.getListId('customlist89', dataIn.operation);
				location = API.getListId('location', dataIn.location);
				terms = API.getListId('term', dataIn.terms);
				item = API.getItemId('inventoryitem',dataIn.item, dataIn.principaltype);
				
				if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
				if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
				if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
				if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				
				if(item['error_code']==200) {
					uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
					if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';				
					
					//GET THE UNIT PRICE WITHOUT VAT
					if(location['error_code']==200 && operation['error_code']==200) {
						itempricing = API.getPricing(item['internalid'], location['internalid'], operation['internalid']);
						if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
					}
				}
		
				//if all data pass the validation return internal id of each records
				if(principal['error_code']==200 &&
				customer['error_code']==200 &&
				creditlimit['error_code']==200 &&
				location['error_code']==200 &&
				operation['error_code']==200 &&
				item['error_code']==200 &&
				terms['error_code']==200 &&
				uom['error_code']==200) {
					
					data.department = department;
					data.type = dataIn.type;
					data.externalid = dataIn.externalid;
					data.customer=customer['internalid'];
					data.customer_name = customer['customer_name'];
					data.salesrep = creditlimit['salesrep'];
					data.date=dataIn.date;
					data.memo = dataIn.memo;
					data.principal=principal['internalid'];
					data.principaltype = dataIn.principaltype;
					data.location=location['internalid'];
					data.operation=operation['internalid'];
					data.external_invoice=dataIn.external_invoice;
					data.item=item['internalid'];	
					data.item_name=item['item_name'];
					data.terms = terms['internalid'];
					
					if(itempricing!=null) {
						price_no_vat = parseFloat((itempricing[0].getValue('custrecord768')) / 1.12).toFixed(10);
						var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = parseFloat(price_no_vat * parseInt(conversion_factor)).toFixed(10);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
						data.discount_amount = dataIn.discount_amount;
					} else {
						originaldata.error = errorText;
						originaldata.itemString = dataIn.item;
						return originaldata;
					}
					
					data.itemString = dataIn.item;
					return data;
				} else { //return original data with error
					originaldata.error = errorText;
					originaldata.itemString = dataIn.item;
					return originaldata;
				}
			
			/************ DATA NOT EXIST IN NETSUITE - END ************/	
			} else {
				originaldata.error = 'Transaction already Exists in Netsuite.';
				originaldata.itemString = dataIn.item;
				return originaldata;
			}
			
		} catch(err) {
			originaldata.error = err.message;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	/********** END FUNCTION **********/
	
	/*
	** CASH SLIP FUNCTION
	*/
	
	this.CASH_SLIP = function (dataIn) {
		var data = {}, department = '', errorText = '', originaldata = dataIn, account;
		
		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/	

				principal = API.getListId('classification', dataIn.principal);
				
				if(principal['error_code']==200) {
					customer = 	API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
					if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
					
					if(customer['error_code']==200) {
						creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
						if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
						if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';
						
						if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
							department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
							department = (department=='' || department==null) ? 1038 : department;
						} else { department = 1038; }
					
					}
				}
				
				operation = API.getListId('customlist89', dataIn.operation);
				location = API.getListId('location', dataIn.location);
				account =  API.getListId('account', dataIn.account);
				item = API.getItemId('inventoryitem',dataIn.item, dataIn.principaltype);
				
				if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
				if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
				if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
				if(account['error_code']==404) errorText += account['name']+' '+account['message']+'.'+' ';
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				
				if(item['error_code']==200) {
					uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
					if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';				
					
					//GET THE UNIT PRICE WITHOUT VAT
					if(location['error_code']==200 && operation['error_code']==200) {
						itempricing = API.getPricing(item['internalid'], location['internalid'], operation['internalid']);
						if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
					}
				}
		
				//if all data pass the validation return internal id of each records
				if(principal['error_code']==200 &&
				customer['error_code']==200 &&
				creditlimit['error_code']==200 &&
				location['error_code']==200 &&
				operation['error_code']==200 &&
				item['error_code']==200 &&
				uom['error_code']==200 &&
				account['error_code']==200) {
					
					data.department = department;
					data.type = dataIn.type;
					data.externalid = dataIn.externalid;
					data.customer = customer['internalid'];
					data.customer_name = customer['customer_name'];
					data.salesrep = creditlimit['salesrep'];
					data.terms = creditlimit['terms'];
					data.date = dataIn.date;
					data.memo = dataIn.memo;
					data.principal = principal['internalid'];
					data.account = account['internalid'];
					data.principaltype = dataIn.principaltype;
					data.location = location['internalid'];
					data.operation = operation['internalid'];
					data.external_invoice = dataIn.external_invoice;
					data.item = item['internalid'];	
					data.item_name = item['item_name'];
					
					if(itempricing!=null) {
						price_no_vat = parseFloat((itempricing[0].getValue('custrecord768')) / 1.12).toFixed(10);
						var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = parseFloat(price_no_vat * parseInt(conversion_factor)).toFixed(10);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
						data.discount_amount = dataIn.discount_amount;
					} else {
						
						originaldata.error = errorText;
						originaldata.itemString = dataIn.item;
						return originaldata;
					}
					
					data.itemString = dataIn.item;
					return data;
				} else { //return original data with error
					originaldata.error = errorText;
					originaldata.itemString = dataIn.item;
					return originaldata;
				}

			/************ DATA NOT EXIST IN NETSUITE - END ************/
			} else {
				originaldata.error = 'Transaction already Exists in Netsuite.';
				originaldata.itemString = dataIn.item;
				return originaldata;
			}
			
		} catch(err) {
			originaldata.error = err.message;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	/********** END FUNCTION **********/
	
};
	