/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2016     Brian
 *
 */

/**
**	PG CLASS COMMIT 
**/

var PGClassCommit = function () {
	var API = new NETSUITE_API();
	
	// save record in netsuite
	this.STORE = function (data) {
		if(data.type=='invoice') {
			return this.INVOICE(data);
		} else if (data.type=='salesorder') {
			return this.SALES_ORDER(data);
		} else if (data.type=='purchaseorder') {
			return this.PURCHASE_ORDER(data);
		} else if (data.type=='creditmemo') {
			return this.CREDIT_MEMO(data);
		} else if (data.type=='transferorder') {
			return this.TRANSFER_ORDER_VAN_LOADING(data);
		} else if (data.type=='transferordervanreturn') {
			return this.TRANSFER_ORDER_VAN_RETURN(data);
		}
	};
	
	/*
	** INVOICE FUNCTION
	*/
	
	this.INVOICE = function (dataIn) {

		var account = 123, //101020100 Receivables : Accounts Receivable - Trade
			taxcode = 6, //6 = S_PH, 5 = UNDEF
			item = 45840, //45840=PG32001 PG SI Summary
			discitem = 30323, //30323=Sales Discount - Nonfood (CM)
			amount = 0,
			originaldata = dataIn,
			totalamountdue = 0; 
		
			try {
//				var columns = [ new nlobjSearchColumn('internalid') ];
//				var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
//				var results = nlapiSearchRecord('transaction', null, filter, columns);
//				
//				if(results == null) {
					
					var record = nlapiCreateRecord(dataIn.type);
					record.setFieldValue('entity', dataIn.customer);
					record.setFieldValue('location', dataIn.location);
					record.setFieldValue('class', dataIn.principal);
					record.setFieldValue('account', account);
					record.setFieldValue( 'custbody69', dataIn.operation);
					record.setFieldValue('salesrep', dataIn.salesrep);		
					record.setFieldValue('department', dataIn.department);
					record.setFieldValue('terms', dataIn.terms);
					record.setFieldValue('memo', dataIn.memo);
					record.setFieldValue('custbody178', dataIn.external_invoice);
					record.setFieldValue('trandate', dataIn.date);
					
					for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
						record.setLineItemValue('item', 'item', i, item); 
						record.setLineItemValue('item', 'taxcode', i, taxcode); 
						record.setLineItemValue('item', 'quantity', i, '1');
						amount = (dataIn.items[i-1].amount=='' || dataIn.items[i-1].amount==null || dataIn.items[i-1].amount==0) ? 0 : dataIn.items[i-1].amount;
		//				discamount = parseFloat(dataIn.items[i-1].discount/100 * amount).toFixed(10);
						record.setLineItemValue('item', 'amount', i, parseFloat(amount));
		//				record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
		//				record.setLineItemValue('item','custcol6',  i, dataIn.items[i-1].discount); //discount 1
		//				record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
						record.setLineItemValue('item','tax1amt',  i, parseFloat(dataIn.items[i-1].tax_amount)); //tax amount
						totalamountdue += parseFloat(amount);
					}
					
					record.setLineItemValue('item','item',dataIn.items.length+1, discitem); 
					record.setLineItemValue('item','rate',dataIn.items.length+1, '-'+dataIn.items[0].discount+'%');
					record.setLineItemValue('item', 'taxcode', dataIn.items.length+1, taxcode); //6 = S_PH, 5 = UNDEF
					
					totaldiscount = parseFloat(totalamountdue * parseFloat(dataIn.items[0].discount/100));
					totalamountdue = parseFloat(totalamountdue - parseFloat(totaldiscount));
					
		//			var outstandingARChecker = API.checkExceedCL(dataIn.customer, dataIn.principal, totalamountdue, dataIn.creditlimit);
		//			if(outstandingARChecker['error_code'] == 404) {
		//				originaldata.customer = outstandingARChecker['customer'];
		//				originaldata.error = outstandingARChecker['message'];
		//				return originaldata;
		//			} else {
						var id = nlapiSubmitRecord(record, null, true); //20
						var record = nlapiLoadRecord(dataIn.type, id);
						
						return {
							'internalid':id,
							'externalid':dataIn.externalid,
							'customer':record.getFieldText('entity'),
							'department':record.getFieldText('department'),
							'principal':record.getFieldText('class'),
							'location':record.getFieldText('location'),
							'date':dataIn.date,
						};
		//			}
						
//				} else {
//					originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
//					originaldata.error = 'Transaction already Exists.';
//					return originaldata;
//				}
		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** SALES ORDER FUNCTION
	*/
	
	this.SALES_ORDER = function (dataIn) {
		var account = 123, //101020100 Receivables : Accounts Receivable - Trade
			discitem = 30362,
			amount = 0,
			totaldisc = 0,
			taxcode = 6, //6 = S_PH, 5 = UNDEF
			originaldata = dataIn;
		
		try {
			
//			var columns = [ new nlobjSearchColumn('internalid') ];
//			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
//			var results = nlapiSearchRecord('transaction', null, filter, columns);
//			
//			if(results == null) {
				
				var record = nlapiCreateRecord(dataIn.type); //create new record
				record.setFieldValue('custbody145', dataIn.reportingbranch); //reporting branch
				record.setFieldValue('location', dataIn.location); //location
				record.setFieldValue('class', dataIn.principal); //principal
				record.setFieldValue('entity', dataIn.customer); //customer
//				record.setFieldValue('custbody144', dataIn.customer); //customer
				record.setFieldValue('account', account); //account
				record.setFieldValue( 'custbody69', dataIn.operation); //operation
				record.setFieldValue('salesrep', dataIn.salesrep); //salesrep
				record.setFieldValue('department', dataIn.department); //department
				record.setFieldValue('custbody120', dataIn.terms); //terms
				record.setFieldValue('memo', dataIn.memo); //memo
				record.setFieldValue('custbody178', dataIn.external_invoice); //external invoice
				record.setFieldValue('trandate', dataIn.date); //date
				record.setFieldValue('custbody8', nlapiGetUser()); //encoded by
				
				for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
					record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item); //item
					record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty); //qty
					record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom); //units
					record.setLineItemValue('item', 'rate', i, dataIn.items[i-1].rate); //rate
					
					amount = (dataIn.items[i-1].amount=='' || dataIn.items[i-1].amount==null || dataIn.items[i-1].amount==0) ? 0 : dataIn.items[i-1].amount;
					discamount = parseFloat(dataIn.items[i-1].discount/100 * amount).toFixed(10);
					totaldisc += parseFloat(discamount);
					
					record.setLineItemValue('item', 'amount', i, parseFloat(amount)); //amount
					record.setLineItemValue('item','custcol6',  i, dataIn.items[i-1].discount); //discount 1
					record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
					record.setLineItemValue('item','tax1amt',  i, parseFloat(dataIn.items[i-1].tax_amount)); //tax amount
					record.setLineItemValue('item', 'taxcode', i, taxcode);
					record.setLineItemValue('item', 'custcol41', i, dataIn.items[i-1].reason);
				}
				
				record.setFieldValue('discountitem',discitem); //discount item
				record.setFieldValue('discountrate', parseFloat(totaldisc * -1).toFixed(2)); //discount rate
					
				var id = nlapiSubmitRecord(record, null, true);				
				var record = nlapiLoadRecord(dataIn.type, id);
				
				return {
					'internalid':id,
					'externalid':dataIn.externalid,
					'customer':record.getFieldText('entity'),
					'department':record.getFieldText('department'),
					'principal':record.getFieldText('class'),
					'location':record.getFieldText('location'),
					'date':dataIn.date,
				};
				
//			} else {
//				originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
//				originaldata.error = 'Transaction already Exists.';
//				return originaldata;
//			}
				
		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** PURCHASE ORDER FUNCTION
	*/
	
	this.PURCHASE_ORDER = function (dataIn) {
		var department = 1018, // DEPARTMENT - BRANCHES : OPERATIONS : LOGISTICS : GOOD STOCK WAREHOUSE
			customform = 116, // PO FORM : DDI Trade PO
			ordertype = 2, // ORDER TYPE : Manual/Filler Order/ Additional Order
			taxcode = 6, //S_PH
			originaldata = dataIn;
		
		try {
			var record = nlapiCreateRecord(dataIn.type); //20
			
			record.setFieldValue('customform', customform); 
			record.setFieldValue('custbody43', ordertype); 
			
			record.setFieldValue('entity', dataIn.vendor);
			record.setFieldValue('custbody120', dataIn.terms);
			record.setFieldValue('trandate', dataIn.date);
			record.setFieldValue('memo', dataIn.remarks);
			record.setFieldValue('location', dataIn.location);
			record.setFieldValue('class', dataIn.principal);
			record.setFieldValue('department', department); 
			record.setFieldValue('custbody38', dataIn.paymenttype);
			record.setFieldValue('custbody37', dataIn.externalid);
			
			for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				record.setLineItemValue('item', 'custcol32', i, parseFloat(dataIn.items[i-1].unit_cost).toFixed(5)); //purchase price
				record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_cost).toFixed(5)); // unit cost
				record.setLineItemValue('item', 'amount', i, dataIn.items[i-1].amount);
				record.setLineItemValue('item', 'custcol10', i, dataIn.items[i-1].discount_amount);
				record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
				record.setLineItemValue('item', 'taxcode', i, taxcode);
			}
			
			var id = nlapiSubmitRecord(record, null, true); //20
			var record = nlapiLoadRecord(dataIn.type, id);
			return {
				'internalid':id, //po#
				'externalid':dataIn.externalid,
				'vendor':record.getFieldText('entity'),
				'department':record.getFieldText('department'),
				'principal':record.getFieldText('class'),
				'location':record.getFieldText('location'),
				'date':dataIn.date
			};
		} catch(err) {
			originaldata.vendor = nlapiLookupField('vendor', dataIn.vendor, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** CREDIT MEMO FUNCTION
	*/
	
	this.CREDIT_MEMO = function (dataIn) {
		var account=123, //101020100 Receivables : Accounts Receivable - Trade
			customform = 125, // DDI Credit Memo
			department = 1038, // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
			taxcode = 6, //6 = S_PH, 5 = UNDEF
			item = 45840, //45840=PG32001 PG SI Summary
			originaldata = dataIn;
		
		try {
			
//			var columns = [ new nlobjSearchColumn('internalid') ];
//			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.externalid) ];
//			var results = nlapiSearchRecord('transaction', null, filter, columns);
//			
//			if(results == null) {
				
				var record = nlapiCreateRecord(dataIn.type); //20
				record.setFieldValue('customform', customform); 
				record.setFieldValue('entity', dataIn.customer);
				record.setFieldValue('location', dataIn.location);
				record.setFieldValue('class', dataIn.principal);
				record.setFieldValue('account', account);
				record.setFieldValue( 'custbody69', dataIn.operation);
				record.setFieldValue('department', department); 
				record.setFieldValue('salesrep', dataIn.salesrep);
				record.setFieldValue('memo', dataIn.memo);
				record.setFieldValue('trandate', dataIn.date);
				record.setFieldValue('custbody178', dataIn.externalid);
				
				for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
					record.setLineItemValue('item', 'item', i, item); 
					record.setLineItemValue('item', 'taxcode', i, taxcode); 
					record.setLineItemValue('item', 'quantity', i, '1');
					var discamt = (dataIn.items[i-1].discount_amount=='' || dataIn.items[i-1].discount_amount==null) ? 0 : dataIn.items[i-1].discount_amount;
					var discounted = parseFloat(dataIn.items[i-1].amount) - parseFloat(discamt);
					record.setLineItemValue('item', 'rate', i, discounted);
					var disctax = parseFloat(discamt) * 0.12;
					var tax = parseFloat(dataIn.items[i-1].tax_amount) - parseFloat(disctax);
					record.setLineItemValue('item', 'tax1amt', i, tax);
				}
					
				var id = nlapiSubmitRecord(record, null, true); //20				
				var record = nlapiLoadRecord(dataIn.type, id);
				
				return {
					'internalid':id,
					'externalid':dataIn.externalid,
					'customer':record.getFieldText('entity'),
					'department':record.getFieldText('department'),
					'principal':record.getFieldText('class'),
					'location':record.getFieldText('location'),
					'date':dataIn.date,
				};
				
//			} else {
//				originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
//				originaldata.error = 'Transaction already Exists.';
//				return originaldata;
//			}
				
		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** TRANSFER ORDER ( VAN LOADING ) FUNCTION
	*/
	
	this.TRANSFER_ORDER_VAN_LOADING = function (dataIn) {
		var customform = 142, // 142 = DDI T.O - Van Loading
			originaldata = dataIn; 
		
		try {
			var record = nlapiCreateRecord('transferorder');
			record.setFieldValue('customform', customform);
          	record.setFieldValue('custbody145', dataIn.reportingbranch); //reporting branchv
			record.setFieldValue('class', dataIn.principal);
			record.setFieldValue('location', dataIn.fromlocation); //from location
			record.setFieldValue('transferlocation', dataIn.customerlocation); //to location / van location
			record.setFieldValue('trandate', dataIn.date);
			record.setFieldValue('memo', dataIn.memo);
			record.setFieldValue( 'custbody69', dataIn.operation); //operation
			record.setFieldValue('department', dataIn.department); //department
			record.setFieldValue('custbody178', dataIn.externalid); //external source doc.
			record.setFieldValue('custbody172', dataIn.customer); //salesman
          
			for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'description', i, nlapiLookupField('item', dataIn.items[i-1].item, 'displayname', false));
				record.setLineItemValue('item', 'custcol30', i, dataIn.items[i-1].unit_price); // custcol30 = SALES PRICE(EX-VAT);
				record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
				
				var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price) * 1.12).toFixed(2); //Net amount, not vat and discount
				record.setLineItemValue('item', 'custcol32', i, amount); // custcol32 = TOTAL(W/VAT);
				
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			}
			
			var id = nlapiSubmitRecord(record, null, true);			
			var record = nlapiLoadRecord(dataIn.type, id);
			
			return {
				'internalid':id,
				'externalid':dataIn.externalid,
				'customer':record.getFieldText('custbody172'),
				'department':record.getFieldText('department'),
				'principal':record.getFieldText('class'),
				'location':record.getFieldText('location'),
				'date':dataIn.date
			};
		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** TRANSFER ORDER ( VAN RETURN ) FUNCTION
	*/
	
	this.TRANSFER_ORDER_VAN_RETURN = function (dataIn) {
		var customform = 171, // 171 = DDI T.O - Van Returns
			originaldata = dataIn; 
		
		try {
			var record = nlapiCreateRecord('transferorder');
			record.setFieldValue('customform', customform); 
			record.setFieldValue('custbody172', dataIn.customer); //salesman
			record.setFieldValue('location', dataIn.customerlocation); //from location
			record.setFieldValue('transferlocation', dataIn.fromlocation); //to location / van location
			record.setFieldValue('custbody145', dataIn.reportingbranch); //reporting branchv
			record.setFieldValue('class', dataIn.principal);
			record.setFieldValue('trandate', dataIn.date);
			record.setFieldValue('memo', dataIn.memo);
			record.setFieldValue( 'custbody69', dataIn.operation); //operation
			record.setFieldValue('department', dataIn.department); //department
			record.setFieldValue('custbody178', dataIn.externalid); //external source doc.

			for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'description', i, nlapiLookupField('item', dataIn.items[i-1].item, 'displayname', false));
				record.setLineItemValue('item', 'custcol30', i, dataIn.items[i-1].unit_price); // custcol30 = SALES PRICE(EX-VAT);
				record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));

				var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price) * 1.12).toFixed(2); //Net amount, not vat and discount
				record.setLineItemValue('item', 'custcol32', i, amount); // custcol32 = TOTAL(W/VAT);
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			}
			
			var id = nlapiSubmitRecord(record, null, true);			
			var record = nlapiLoadRecord('transferorder', id);
			
			return {
				'internalid':id,
				'externalid':dataIn.externalid,
				'customer':record.getFieldText('custbody172'),
				'department':record.getFieldText('department'),
				'principal':record.getFieldText('class'),
				'location':record.getFieldText('location'),
				'date':dataIn.date
			};
		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
};