/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2016     Brian
 *
 */

/**
**	GLOBE CLASS COMMIT 
**/

var GLOBEClassCommit = function () {
	
	// save record in netsuite
	this.STORE = function (data) {
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
		var account = 123, //101020100 Receivables : Accounts Receivable - Trade
			taxcode = 6, //S_PH
			originaldata = dataIn;

		try {
				var record = nlapiCreateRecord(dataIn.type);
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
				record.setFieldValue('custbody120', dataIn.terms);

				for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
					record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
					record.setLineItemValue('item', 'taxcode', i, 6); // S_PH
					record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price)); 
					record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
					record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
					record.setLineItemValue('item', 'custcol10', i, dataIn.items[i-1].discount_amount);
		
					if(dataIn.operation=='14') {
						// 2nd approach
						amount = parseFloat(parseFloat(dataIn.items[i-1].unit_price * 1.12) * dataIn.items[i-1].qty / 1.12).toFixed(10);
						record.setLineItemValue('item', 'amount', i, amount); //Net amount, no vat and discount				
					} else {
						amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2);
						record.setLineItemValue('item', 'amount', i, amount); //Net amount, no vat and discount
					}
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

		} catch(err) {
			originaldata.customer = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
			originaldata.error = err.message;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** CASH SLIP FUNCTION
	*/
	
	this.CASH_SLIP = function (dataIn) {
		var taxcode = 6, //S_PH
			originaldata = dataIn,
			totaldisc = 0,
			discitem = 30362, //Item Discount for Sales
			typeofsale = 1; //Cash Slip
		
		try {

//			var columns = [ new nlobjSearchColumn('internalid') ];
//			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
//			var results = nlapiSearchRecord('transaction', null, filter, columns);
//			
//			if(results == null) {
			
				var record = nlapiCreateRecord('cashsale');
				record.setFieldValue('entity', dataIn.customer);
				record.setFieldValue('location', dataIn.location);
				record.setFieldValue('class', dataIn.principal);
				record.setFieldValue( 'custbody69', dataIn.operation);
				record.setFieldValue('department', dataIn.department);
				record.setFieldValue('memo', dataIn.memo);
				record.setFieldValue('salesrep', dataIn.salesrep);
				record.setFieldValue('custbody120', dataIn.terms);
				record.setFieldValue('custbody178', dataIn.external_invoice);
				record.setFieldValue('trandate', dataIn.date);
				record.setFieldValue('custbody45', typeofsale);
				record.setFieldValue('account', dataIn.account);
				
				for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
					record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
					record.setLineItemValue('item', 'taxcode', i, taxcode);
					record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price)); 
					record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
					record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
	//				record.setLineItemValue('item', 'custcol10', i, dataIn.items[i-1].discount_amount);
					totaldisc += parseFloat(dataIn.items[i-1].discount_amount).toFixed(10);
					
					if(dataIn.operation=='14') {				
						// 2nd approach
						amount = parseFloat(parseFloat(dataIn.items[i-1].unit_price * 1.12) * dataIn.items[i-1].qty / 1.12).toFixed(10);
						record.setLineItemValue('item', 'amount', i, amount); //Net amount, no vat and discount				
					} else {
						amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2);
						record.setLineItemValue('item', 'amount', i, amount); //Net amount, no vat and discount
					}
				}
				
				record.setFieldValue('discountitem', discitem);
				record.setFieldValue('discountrate', totaldisc * -1);
				
				var id = nlapiSubmitRecord(record, null, true);				
				var record = nlapiLoadRecord('cashsale', id);
				
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