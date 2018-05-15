/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jul 2016     Brian
 */


/**
**	MONDELEZ CLASS VERIFIER 
**/

var MONDELEZClassVerifier = function () {
	var API = new NETSUITE_API();
	
	this.VERIFY = function(data) {
		if(data.type=='invoice') {
			return this.INVOICE(data);
		} else if (data.type=='purchaseorder') {
			return this.PURCHASE_ORDER(data);
		} else if (data.type=='returnauthorization') {
			return this.RETURN_AUTHORIZATION(data);
		}
	};
	
	/*
	** INVOICE FUNCTION
	*/
	
	this.INVOICE = function (dataIn) {
		var data = {}, department = '', errorText = '', originaldata = dataIn, customer_discount = {};
		
		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/
				
				principal = API.getListId('classification', dataIn.principal);
				
				if(principal['error_code']==200) {
					customer = API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
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
				
				if(principal['error_code']==200 && customer['error_code']==200 &&
				   location['error_code']==200 && operation['error_code']==200) {
					customer_discount = API.getCustomerDiscount(customer['internalid'], principal['internalid'], operation['internalid'], location['internalid']);
					if(customer_discount['error_code']==404) errorText += customer_discount['message']+'.'+' ';
				}
				
				//if all data pass the validation return internal id of each records
				if(principal['error_code']==200 &&
				customer['error_code']==200 &&
				creditlimit['error_code']==200 &&
				location['error_code']==200 &&
				operation['error_code']==200 &&
				item['error_code']==200 &&
				terms['error_code']==200 &&
				uom['error_code']==200 &&
				customer_discount['error_code']==200) {
					
					data.department = department;
					data.type = dataIn.type;
					data.externalid = dataIn.externalid;
					data.customer=customer['internalid'];
					data.customer_name = customer['customer_name'];
					data.salesrep = creditlimit['salesrep'];
					data.date=dataIn.date;
					data.memo = dataIn.memo;
					data.principal = principal['internalid'];
					data.principaltype = dataIn.principaltype;
					data.location = location['internalid'];
					data.operation = operation['internalid'];
					data.external_invoice = dataIn.external_invoice;
					data.item = item['internalid'];	
					data.item_name = item['item_name'];
					data.terms = terms['internalid'];
					
					if(itempricing!=null) {
						price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
						var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
						data.itempricing = JSON.stringify(itempricing);
						data.conversion_factor = JSON.stringify(conversion_factor);
						var unit_price = price_no_vat * parseInt(conversion_factor);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
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
	** PURCHASE ORDER FUNCTION
	*/
	
	this.PURCHASE_ORDER = function (dataIn) {
		vendor = API.getVendorId('vendor', dataIn.vendor);
		terms = API.getListId('term', dataIn.terms);
		paymenttype = API.getListId('customlist108', dataIn.paymenttype);
		receivinglocation = API.getListId('location', dataIn.receivinglocation);
		principal = API.getListId('classification', dataIn.principal);
		location = API.getListId('location', dataIn.location);
		
		item = API.getItemId('item',dataIn.item, dataIn.principaltype);
		if(item['error_code']==200) uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
		if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';		
		if(vendor['error_code']==404) errorText += vendor['name']+' '+vendor['message']+'.'+' ';
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(paymenttype['error_code']==404) errorText += paymenttype['name']+' '+paymenttype['message']+'.'+' ';
		if(receivinglocation['error_code']==404) errorText += receivinglocation['name']+' '+receivinglocation['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		
		if(vendor['error_code']==200 &&
		   terms['error_code']==200 &&
		   paymenttype['error_code']==200 &&
		   receivinglocation['error_code']==200 &&
		   principal['error_code']==200 &&
		   location['error_code']==200 &&
		   item['error_code']==200 &&
		   uom['error_code']==200) {
			
			data.type = dataIn.type;
			data.principaltype = dataIn.principaltype;
			data.externalid = dataIn.externalid;
			data.vendor = vendor['internalid'];
			data.vendor_name = dataIn.vendor;
			data.date = dataIn.date;
			data.remarks = dataIn.remarks;
			data.terms = terms['internalid'];
			data.principal = principal['internalid'];
			data.location = location['internalid'];
			data.paymenttype = paymenttype['internalid'];
			data.item = item['internalid'];
			data.item_name = item['item_name'];
			data.itemString = dataIn.item;
			data.receivinglocation = receivinglocation['internalid'];
			data.qty=dataIn.quantity;
			data.uom = uom['internalid'];
			
			return data;
		} else { //return original data with error
			originaldata.itemString = dataIn.item;
			originaldata.error = errorText;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** RETURN AUTHORIZATION FUNCTION
	*/
	
	this.RETURN_AUTHORIZATION = function (dataIn) {
		var data = {}, department = '', errorText = '', originaldata = dataIn;
		
		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/	
				
				principal = API.getListId('classification', dataIn.principal);
	
				if(principal['error_code']==200) {
					customer = API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
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
				principal = API.getListId('classification', dataIn.principal);
				location = API.getListId('location', dataIn.location);
				reason = API.getListId('customlist120', dataIn.reason);
				 
				if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
				if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
				if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
				if(reason['error_code']==404) errorText += reason['name']+' '+reason['message']+'.'+' ';
				
				item = API.getItemId('item',dataIn.item, dataIn.principaltype);
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				
				if(item['error_code']==200) {
					uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
					if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
					
					// GET THE UNIT PRICE WITHOUT VAT
					if(location['error_code']==200 && operation['error_code']==200) {
						itempricing = API.getPricing(item['internalid'], location['internalid'], operation['internalid']);
						if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
					}
				}
				 
				if(principal['error_code']==200 &&
			    customer['error_code']==200 &&
			    creditlimit['error_code']==200 &&
			    location['error_code']==200 &&
			    operation['error_code']==200 &&
			    item['error_code']==200 &&
			    uom['error_code']==200 &&
			    reason['error_code']==200) {
					
					data.department = department;
					data.type = dataIn.type;	
					data.externalid = dataIn.externalid;
					data.customer = customer['internalid'];
					data.salesrep = creditlimit['salesrep'];
					data.date = dataIn.date;
					data.memo = dataIn.memo;
					data.principal = principal['internalid'];
					data.principaltype = dataIn.principaltype;
					data.location = location['internalid'];
					data.operation = operation['internalid'];
					data.external_invoice = dataIn.external_invoice;
					data.item = item['internalid'];
					data.bbd = dataIn.bbd;
					data.item_name=item['item_name'];
					data.itemString = dataIn.item;
					data.reason = reason['internalid'];
					
					if(itempricing!=null) {
						price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
						var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = price_no_vat * parseInt(conversion_factor);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
					} else {
						originaldata.error = errorText;
						originaldata.itemString = dataIn.item;
						return originaldata;
					}
						
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
