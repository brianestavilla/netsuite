/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2016     Brian
 *
 */

/**
**	MONDE CLASS COMMIT 
**/

var MONDEClassCommit = function () {
	
	// save record in netsuite
	this.STORE = function (data) {
		if(data.type=='invoice') {
			return this.INVOICE(data);
		} else if (data.type=='purchaseorder') {
			return this.PURCHASE_ORDER(data);
		} else if (data.type=='creditmemo') {
			return this.CREDIT_MEMO(data);
		}
	};
	
	/*
	** INVOICE FUNCTION
	*/
	
	this.INVOICE = function (dataIn) {
		
		var account = 123, // 101020100 Receivables : Accounts Receivable - Trade
			taxcode = 6, // S_PH
			item = 46459, // 46459 = MNC32001 MONDE SI Summary
			discitem = 46229, // 46229=Sales Discount-MNC
			originaldata = dataIn;
		
		try {
			
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
				
				var record = nlapiCreateRecord(dataIn.type);
				record.setFieldValue('entity', dataIn.customer);
				record.setFieldValue('location', dataIn.location);
				record.setFieldValue('class', dataIn.principal);
				record.setFieldValue('account', account);
				record.setFieldValue('custbody69', dataIn.operation);
				record.setFieldValue('department', dataIn.department);
				record.setFieldValue('terms', dataIn.terms);
				record.setFieldValue('memo', dataIn.memo);
				record.setFieldValue('custbody178', dataIn.external_invoice);
				record.setFieldValue('trandate', dataIn.date);
		
				for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
					record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item); 
					record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
					record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
					record.setLineItemValue('item', 'taxcode', i, taxcode);
					record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].rate) / 1.12);
					record.setLineItemValue('item', 'amount', i, parseFloat(dataIn.items[i-1].amount) / 1.12); //set amount without VAT
					record.setLineItemValue('item', 'custcol10', i, parseFloat(dataIn.items[i-1].discount_amount)/1.12); 
//					record.setLineItemValue('item','tax1amt',  i, parseFloat(dataIn.items[i-1].tax_amount)); //tax amount
				}
				
//				record.setLineItemValue('item','item',dataIn.items.length+1, discitem); 
//				record.setLineItemValue('item','rate',dataIn.items.length+1, '-'+parseFloat(dataIn.items[0].discount_amount)/1.12);
//				record.setLineItemValue('item', 'taxcode', dataIn.items.length+1, taxcode);
					
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
				
			} else {
				originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
				originaldata.error = 'Transaction already Exists in Netsuite.';
				return originaldata;
			}
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
		var customform = 116, // PO FORM : DDI Trade PO
			ordertype = 2, // ORDER TYPE : Manual/Filler Order/ Additional Order
			department = 1018, // DEPARTMENT - BRANCHES : LOGISTICS
			taxcode = 6, // S_PH
			originaldata = dataIn;
		
		try {
			var record = nlapiCreateRecord(dataIn.type);
			
			record.setFieldValue('customform',customform);
			record.setFieldValue('custbody43',ordertype);
			record.setFieldValue('entity', dataIn.vendor);
			record.setFieldValue('custbody120', dataIn.terms);
			record.setFieldValue('trandate', dataIn.date);
			record.setFieldValue('memo', dataIn.remarks);
			record.setFieldValue('location', dataIn.location);
			record.setFieldValue('class', dataIn.principal);
			record.setFieldValue('department', department);
			record.setFieldValue('custbody38', dataIn.paymenttype);
		
			for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {
				var gross = parseFloat(dataIn.items[i-1].purchase_price * dataIn.items[i-1].qty);
				var disc_amt = parseFloat(parseFloat(dataIn.items[i-1].discount_percent)/100) * gross;
				gross -= disc_amt;
				
				var discrate = parseFloat(parseFloat(dataIn.items[i-1].discount_percent)/100) * dataIn.items[i-1].purchase_price;
				var grossrate =  dataIn.items[i-1].purchase_price - discrate; 
				
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);	
				record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
				record.setLineItemValue('item', 'taxcode', i, taxcode);
				record.setLineItemValue('item', 'custcol24', i, dataIn.items[i-1].purchase_price * 1.12);
				record.setLineItemValue('item', 'rate', i, grossrate);
				record.setLineItemValue('item', 'custcol32', i, dataIn.items[i-1].purchase_price);
				//record.setLineItemValue('item', 'amount', i, gross);
				record.setLineItemValue('item', 'custcol6', i, dataIn.items[i-1].discount_percent);
				record.setLineItemValue('item', 'custcol10', i, disc_amt);
			}
			
			var id = nlapiSubmitRecord(record, null, true); //20
			var record = nlapiLoadRecord(dataIn.type, id);
			return {
				'internalid':id,
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
			customform = 125, // 125 = DDI Credit Memo
			department = 1038, // DEPARTMENT > BRANCHES : SALES : BOOKING 01
			taxcode = 6, //6 = S_PH, 5 = UNDEF
			item = 45840, //45840=PG32001 PG SI Summary
			originaldata = dataIn;
		
		try {	
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
				
			for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
				record.setLineItemValue('item', 'item', i, item); 
				record.setLineItemValue('item', 'taxcode', i, taxcode); 
				record.setLineItemValue('item', 'quantity', i, '1');
				record.setLineItemValue('item', 'rate', i, dataIn.items[i-1].amount);
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
		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
};