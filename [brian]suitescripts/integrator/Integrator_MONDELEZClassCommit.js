/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2016     Brian
 *
 */

/**
**	MONDELEZ CLASS COMMIT 
**/

var MONDELEZClassCommit = function () {
	var API = new NETSUITE_API();
	
	// save record in netsuite
	this.STORE = function (data) {
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
		
		var account = 123, // 101020100 Receivables : Accounts Receivable - Trade
			customform = 179, // Trade Invoice - with Code
			taxcode = 6, // S_PH
			originaldata = dataIn;
		
		try {
			
//			var columns = [ new nlobjSearchColumn('internalid') ];
//			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
//			var results = nlapiSearchRecord('transaction', null, filter, columns);
//			
//			if(results == null) {
			
				var record = nlapiCreateRecord(dataIn.type);
				record.setFieldValue('customform', customform); 
				record.setFieldValue('entity', dataIn.customer);
				record.setFieldValue('location', dataIn.location);
				record.setFieldValue('class', dataIn.principal);
				record.setFieldValue('account', account);
				record.setFieldValue('salesrep', dataIn.salesrep);
				record.setFieldValue('custbody69', dataIn.operation);
				record.setFieldValue('department', dataIn.department); 
				record.setFieldValue('memo', dataIn.memo);
				record.setFieldValue('custbody178', dataIn.external_invoice);
				record.setFieldValue('trandate', dataIn.date);
				record.setFieldValue('terms', dataIn.terms);
				
				discounts = API.getCustomerDiscount(dataIn.customer, dataIn.principal, dataIn.operation, dataIn.location);
				for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
					record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
					record.setLineItemValue('item', 'taxcode', i, taxcode);
					record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
					var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2); //Net amount, not vat and discount
					record.setLineItemValue('item', 'amount', i, amount); 
					record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
					record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
					API.setLineItemDiscount(record, i, discounts, dataIn);
				}
				
				var id = nlapiSubmitRecord(record, null, true);			
				var record = nlapiLoadRecord(dataIn.type, id);
				
				return {
					'internalid':id,
					'externalid':dataIn.externalid,
					'customer':record.getFieldText('entity'),
					'department':record.getFieldText('department'),
					'principal':record.getFieldText('class'),
					'location':record.getFieldText('location'),
					'date':dataIn.date
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
		var customform = 116, // PO FORM : DDI Trade PO
			ordertype = 2, // ORDER TYPE : Manual/Filler Order/ Additional Order
			department = 1018, // DEPARTMENT - BRANCHES : LOGISTICS
			taxcode = 6, // S_PH
			originaldata = dataIn;
		
		try {
			
			var record = nlapiCreateRecord(dataIn.type); //20
			
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
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);	
				record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
				record.setLineItemValue('item', 'taxcode', i, taxcode);
			}
			
			var id = nlapiSubmitRecord(record, null, true);
			var result = nlapiLoadRecord(dataIn.type, id);
			
			return {
				'internalid':id,
				'externalid':dataIn.externalid,
				'vendor':result.getFieldText('entity'),
				'department':result.getFieldText('department'),
				'principal':result.getFieldText('class'),
				'location':result.getFieldText('location'),
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
	** RETURN AUTHORIZATION FUNCTION
	*/
	
	this.RETURN_AUTHORIZATION = function (dataIn) {
		var taxcode = 6, // S_PH
			originaldata = dataIn;
		
		try {
			
//			var columns = [ new nlobjSearchColumn('internalid') ];
//			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
//			var results = nlapiSearchRecord('transaction', null, filter, columns);
//			
//			if(results == null) {
			
				var record = nlapiCreateRecord(dataIn.type);
				record.setFieldValue('entity', dataIn.customer);
				record.setFieldValue('trandate', dataIn.date);
				record.setFieldValue('memo', dataIn.memo);
				record.setFieldValue('custbody69', dataIn.operation);
				record.setFieldValue('salesrep', dataIn.salesrep);
				record.setFieldValue('location', dataIn.location);
				record.setFieldValue('class', dataIn.principal);
				record.setFieldValue('department', dataIn.department); 
				record.setFieldValue('custbody178', dataIn.external_invoice);
				record.setFieldValue('custbody8', nlapiGetUser());
				
				var discounts = API.getCustomerDiscount(dataIn.customer, dataIn.principal);
				for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {		
					record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
					record.setLineItemValue('item', 'taxcode', i, taxcode);
					record.setLineItemValue('item', 'custcol35', i, dataIn.items[i-1].reason);	
					record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
					var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2); //Net amount, not vat and discount 
					record.setLineItemValue('item', 'amount', i, amount);
					record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
					record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
					record.setLineItemValue('item', 'custcol37', i, dataIn.items[i-1].bbd);
					API.setLineItemDiscount(record, i, discounts, dataIn);
				}
				
				var id = nlapiSubmitRecord(record, null, true);
				var record = nlapiLoadRecord(dataIn.type, id);
				
				return {
					'internalid':id,
					'externalid':dataIn.externalid,
					'customer':record.getFieldText('entity'),
					'department':record.getFieldText('department'),
					'principal':record.getFieldText('class'),
					'location':record.getFieldText('location'),
					'date':dataIn.date
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
	
};