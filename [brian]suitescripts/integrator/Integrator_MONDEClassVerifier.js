/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jul 2016     Brian
 */


/**
**	MONDE CLASS VERIFIER 
**/

var MONDEClassVerifier = function () {
	var API = new NETSUITE_API();
	
	this.VERIFY = function(data) {
		if(data.type=='invoice') {
			return this.INVOICE(data);
		} else if (data.type=='creditmemo') {
			return this.CREDIT_MEMO(data);
		} else if (data.type=='purchaseorder') {
			return this.PURCHASE_ORDER(data);
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
					
					if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
					if(item['error_code']==200) {
						uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
						if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
					}
					
					if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
					if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
					if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
					if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
			
					//if all data pass the validation return internal id of each records
					if(principal['error_code']==200 &&
					customer['error_code']==200 &&
					location['error_code']==200 &&
					creditlimit['error_code']==200 &&
					operation['error_code']==200 &&
					terms['error_code']==200 &&
					item['error_code']==200 &&
					uom['error_code']==200) {
						
						data.department = department;
						data.type = dataIn.type;
						data.externalid = dataIn.externalid;
						data.customer=customer['internalid'];
						data.customer_name = customer['customer_name'];
						data.date=dataIn.date;
						data.memo = dataIn.memo;
						data.principal=principal['internalid'];
						data.principaltype = dataIn.principaltype;
						data.location=location['internalid'];
						data.operation=operation['internalid'];
						data.external_invoice=dataIn.external_invoice;
						data.terms = terms['internalid'];
						data.item=item['internalid'];
						data.item_name=item['item_name'];
						data.itemString = dataIn.item;
						data.uom = uom['internalid'];
						data.rate = dataIn.rate;
						data.qty = dataIn.quantity;
						data.amount = dataIn.amount;
						data.discount_amount = dataIn.discount_amount;
						data.tax_amount = dataIn.tax_amount;
						
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
		var errorText = '', purchasediscounting = {}, originaldata = dataIn, data = {},
			terms = {}, paymenttype = {}, principal = {}, location = {}, item = {}, uom = {},
			conversionrate_unittypes = {}, conversion_factor = 0, price_pc = 0, price = 0;
		
		try {
			terms = API.getListId('term', dataIn.terms);
			//paymenttype = API.getListId('customlist108', dataIn.paymenttype);
			paymenttype = API.getPaymentType(dataIn.paymenttype);
			principal = API.getListId('classification', dataIn.principal);
			location = API.getListId('location', dataIn.location);
			
			item = API.getItemId('item',dataIn.item, dataIn.principaltype);
			if(item['error_code']==200) {
				uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
				if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';		
				conversionrate_unittypes = nlapiLookupField('inventoryitem', item['internalid'], ['unitstype','custitem72'], false);
			}

	
			if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';		
			if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
			if(paymenttype['error_code']==404) errorText += paymenttype['name']+' '+paymenttype['message']+'.'+' ';
			if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
			if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		
			if(location['error_code']==200 && item['error_code']==200 && principal['error_code']==200) {
				purchasediscounting = API.getPurchaseDiscountMonde(item['internalid'], location['internalid'], principal['internalid']);
				if(purchasediscounting['error_code']==404) errorText += dataIn.item+' '+'does not have purchase price setup for '+dataIn.location;
			}
			
			price_pc = parseFloat(purchasediscounting.purchase_price /  conversionrate_unittypes.custitem72);
			conversion_factor = API.conversionRate(conversionrate_unittypes.unitstype, uom['abbreviation']);
			price = parseFloat(price_pc * conversion_factor).toFixed(8);
			
			if(terms['error_code']==200 &&
			   paymenttype['error_code']==200 &&
			   principal['error_code']==200 &&
			   location['error_code']==200 &&
			   item['error_code']==200 &&
			   uom['error_code']==200 && 
			   purchasediscounting['error_code']==200) {
				
				data.type = dataIn.type;
				data.principaltype = dataIn.principaltype;
				data.externalid = dataIn.externalid;
				data.vendor = '722'; //vendor id 722 = MONDE NISSIN CORPORATION;
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
				data.receivinglocation = location['internalid'];
				data.qty=dataIn.quantity;
				data.uom = uom['internalid'];
				data.discount_percent = purchasediscounting.dist_disc;
				data.purchase_price = price;
				
				return data;
				
			} else { //return original data with error
				originaldata.itemString = dataIn.item;
				originaldata.error = errorText;
				
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
	** CREDIT MEMO FUNCTION
	*/
	
	this.CREDIT_MEMO = function (dataIn) {
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
		
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		
		if(principal['error_code']==200 &&
		   customer['error_code']==200 &&
		   location['error_code']==200 &&
		   operation['error_code']==200) {
			
			data.department = department;
			data.type = dataIn.type;
			data.principaltype = dataIn.principaltype;
			data.externalid = dataIn.externalid;
			data.principal = principal['internalid'];
			data.customer = customer['internalid'];
			data.salesrep = creditinfo.salesrep;
			data.date = dataIn.date;
			data.memo = dataIn.memo;
			data.location = location['internalid'];
			data.operation = operation['internalid'];
			data.amount = dataIn.amount;
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	/********** END FUNCTION **********/
	
};
