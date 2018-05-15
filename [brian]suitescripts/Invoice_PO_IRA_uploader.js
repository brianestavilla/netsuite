/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Feb 2015     Brian
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {
	if(dataIn.principaltype=='procterandgamble') {
		
		var pgverifier = new PGClassVerifier();
		return pgverifier.VERIFY(dataIn);
//		return pgValidation(dataIn);
		
	} else if(dataIn.principaltype=='mondelez') {
		
		var mondelezverifier = new MONDELEZClassVerifier();
		return mondelezverifier.VERIFY(dataIn);	
//		return mondelezValidation(dataIn);
		
	} else if(dataIn.principaltype=='globe') {
		
		var globeverifier =  new GLOBEClassVerifier();
		return globeverifier.VERIFY(dataIn);
//		return globeValidation(dataIn);
		
	} else if(dataIn.principaltype=='monde') {
		
		var mondeverifier = new MONDEClassVerifier();
		return mondeverifier.VERIFY(dataIn);
//		return mondeValidation(dataIn);
		
	}
}
	
/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function postRESTlet(dataIn) { 
	if(typeof dataIn.actiontype!='undefined' && dataIn.actiontype=='delete') {
		return nlapiDeleteRecord(dataIn.recordtype, dataIn.internalid);
	} else {
		var commit;
		if(dataIn.principaltype=='procterandgamble') {
			
			commit = new PGClassCommit();
			return commit.STORE(dataIn);	
//			return pgPostData(dataIn);	
			
		} else if(dataIn.principaltype=='mondelez') {
			
			commit = new MONDELEZClassCommit();
			return commit.STORE(dataIn);
//			return mondelezPostData(dataIn);	
			
		} else if(dataIn.principaltype=='globe') {

			commit = new GLOBEClassCommit(); 
			return commit.STORE(dataIn);
//			return globePostData(dataIn);
			
		} else if(dataIn.principaltype=='monde') {
			
			commit = new MONDEClassCommit();
			return commit.STORE(dataIn);
//			return mondePostData(dataIn);
			
		}
	}
}


/** 
 * @param dataIn
 * @returns validated data
 **/
function mondeValidation(dataIn) {
	var data = {};
	var errorText = '';
	var originaldata = dataIn;

	var customer, 
		operation,
		principal, 
		location,
		terms;
	if(dataIn.type=="invoice") {
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200) {
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';	
		}
		
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		terms = getListId('term', dataIn.terms);
		
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';

		//if all data pass the validation return internal id of each records
		if(principal['error_code']==200 && customer['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && terms['error_code']==200) {
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
			data.amount = dataIn.amount;
			data.discount_amount = dataIn.discount_amount;
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	} else if (dataIn.type=='purchaseorder') {
//		vendor = getVendorId('vendor', dataIn.vendor);
		terms = getListId('term', dataIn.terms);
		paymenttype = getListId('customlist108', dataIn.paymenttype);
//		receivinglocation = getListId('location', dataIn.receivinglocation);
		principal = getListId('classification', dataIn.principal);
		location = getListId('location', dataIn.location);
		
		item = getItemId('item',dataIn.item);
		if(item['error_code']==200) uom = getUOM('unitstype', item['unit'], dataIn.uom);
		if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';		
//		if(vendor['error_code']==404) errorText += vendor['name']+' '+vendor['message']+'.'+' ';
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(paymenttype['error_code']==404) errorText += paymenttype['name']+' '+paymenttype['message']+'.'+' ';
//		if(receivinglocation['error_code']==404) errorText += receivinglocation['name']+' '+receivinglocation['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
	
		if(location['error_code']==200 && item['error_code']==200 && principal['error_code']==200) {
			var purchasediscounting = getPurchaseDiscountMonde(item['internalid'], location['internalid'], principal['internalid']);
			if(purchasediscounting['error_code']==404) errorText += dataIn.item+' '+'does not have purchase price setup for '+dataIn.location;
		}
		
		if(purchasediscounting['error_code']==200 && terms['error_code']==200 && paymenttype['error_code']==200 && principal['error_code']==200 && location['error_code']==200 && item['error_code']==200 && uom['error_code']==200) { 	
			
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
			data.purchase_price = purchasediscounting.purchase_price;
			return data;
		} else { //return original data with error
			originaldata.itemString = dataIn.item;
			originaldata.error = errorText;
			return originaldata;
		}
	} else if(dataIn.type=='creditmemo') {
		principal = getListId('classification', dataIn.principal);
		if(principal['error_code']==200) {
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';	
			
			if(customer['error_code']==200) {
				var creditinfo = getCreditLimitInfo(principal['internalid'], customer['internalid']);
			}
			
		}
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		
		if(principal['error_code']==200 && customer['error_code']==200 && location['error_code']==200 && operation['error_code']==200) {
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
	}
}

function getPurchaseDiscountMonde(item, location, principal) {
	var parent_location = 0;
	switch(location) {
	case '848': //CEBU : AS.FORTUNA : MNC : GOOD (AS.FORT_MNC)
		parent_location = '42'; //CEBU : AS.FORTUNA
		break;
	case '333': //EAST : BAL : TACLOBAN : MNC : GOOD (TAC_MNC)
		parent_location = '23'; //EAST : BAL : TACLOBAN
		break;
	case '31' : //EAST : BAL : CALBAYOG : MNC : GOOD (CAL_MNC)
		parent_location = '6'; //EAST : BAL : CALBAYOG
		break;
	}
	
	var filter = [
					new nlobjSearchFilter('custrecord743', null, 'is', parent_location),
					new nlobjSearchFilter('custrecord802', null, 'is', principal),
					new nlobjSearchFilter('custrecord742', null, 'is', item)
	             ];
	
	var column = [
	              	new nlobjSearchColumn('custrecord736'),// DIST DISC
	              	new nlobjSearchColumn('custrecord744') // PURCHASE PRICE
	             ];
	
	var result = nlapiSearchRecord('customrecord252', null, filter, column); //20
	
	if(result!=null) {
		return {
			"error_code":200,
			"dist_disc": (result[0].getValue('custrecord736') == null || result[0].getValue('custrecord736') == '') ? 0 : result[0].getValue('custrecord736'),
			"purchase_price": (result[0].getValue('custrecord744') == null || result[0].getValue('custrecord744') == '') ? 0 : result[0].getValue('custrecord744')
		};
	} else { return { "error_code":404 }; }
	
}

function mondePostData(dataIn) {
	var account;
	if(dataIn.type=='invoice') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '8'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		
		record.setFieldValue('terms', dataIn.terms);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('custbody178', dataIn.external_invoice);
		record.setFieldValue('trandate', dataIn.date);

		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, '46459'); //46459 = MNC32001 MONDE SI Summary
			record.setLineItemValue('item', 'taxcode', i, '6'); //6 = S_PH, 5 = UNDEF
			record.setLineItemValue('item', 'quantity', i, '1');
			record.setLineItemValue('item', 'amount', i, parseFloat(dataIn.items[i-1].amount) / 1.12); //set amount without VAT
		}
		
		record.setLineItemValue('item','item',dataIn.items.length+1, '46229'); //46229=Sales Discount-MNC
		record.setLineItemValue('item','rate',dataIn.items.length+1, '-'+parseFloat(dataIn.items[0].discount_amount)/1.12);
		record.setLineItemValue('item', 'taxcode', dataIn.items.length+1, '6'); //6 = S_PH, 5 = UNDEF
			
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
	} else if (dataIn.type=='purchaseorder') {
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('customform','116'); // PO FORM : DDI Trade PO
		record.setFieldValue('custbody43','2'); // ORDER TYPE : Manual/Filler Order/ Additional Order
		
		record.setFieldValue('entity', dataIn.vendor);
		record.setFieldValue('custbody120', dataIn.terms);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.remarks);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('department', '9'); // DEPARTMENT - BRANCHES : OPERATIONS : LOGISTICS : GOOD STOCK WAREHOUSE
		record.setFieldValue('custbody38', dataIn.paymenttype);
		
		for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);	
			record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
			record.setLineItemValue('item', 'taxcode', i, '6');
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
	} else if(dataIn.type=='creditmemo') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
		
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('customform', '125'); // 125 = DDI Credit Memo;
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '8'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		record.setFieldValue('salesrep', dataIn.salesrep);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('trandate', dataIn.date);
			
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, '45840'); //45840=PG32001 PG SI Summary
			record.setLineItemValue('item', 'taxcode', i, '6'); //6 = S_PH, 5 = UNDEF
			record.setLineItemValue('item', 'quantity', i, '1');
//			var discamt = (dataIn.items[i-1].discount_amount=='' || dataIn.items[i-1].discount_amount==null) ? 0 : dataIn.items[i-1].discount_amount;
//			var discounted = parseFloat(dataIn.items[i-1].amount) - parseFloat(discamt);
			record.setLineItemValue('item', 'rate', i, dataIn.items[i-1].amount);
//			var disctax = parseFloat(discamt) * 0.12;
//			var tax = parseFloat(dataIn.items[i-1].tax_amount) - parseFloat(disctax);
//			record.setLineItemValue('item', 'tax1amt', i, tax);
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
	}
}

function pgValidation(dataIn) {
	var data = {};
	var errorText = '';
	var originaldata = dataIn;
	
	var customer, 
		operation,
		principal, 
		location, 
		item, 
		terms,  
		creditlimit,
		salesman;
	if(dataIn.type=="invoice") {
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200) {
			customer = 	getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
			
//			if(customer['error_code']==200 && principal['error_code']==200) {
//				creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
//				if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
//			}
		}
		
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		terms = getListId('term', dataIn.terms);
		
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';

//		item = getItemId('inventoryitem',dataIn.item);
//		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
	

		//if all data pass the validation return internal id of each records
		if(principal['error_code']==200 && customer['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && terms['error_code']==200)
		{
			data.type = dataIn.type;
			data.externalid = dataIn.externalid;
			data.customer=customer['internalid'];
			data.customer_name = customer['customer_name'];
			//data.salesrep = creditlimit['salesrep'];
			data.date=dataIn.date;
			data.memo = dataIn.memo;
			data.principal=principal['internalid'];
			data.principaltype = dataIn.principaltype;
			data.location=location['internalid'];
			data.operation=operation['internalid'];
			data.external_invoice=dataIn.external_invoice;
//			data.item=item['internalid'];	
//			data.item_name=item['item_name'];
			data.terms = terms['internalid'];

			data.amount = dataIn.amount;
			
			/** check if discount contains number **/
			var re = /[0-9.]{1,}/g;
			var disc = re.exec(dataIn.discount);
			data.discount = (disc==null) ? 0 : disc[0];
			
			data.discount_amount = dataIn.discount_amount;
			data.tax_amount = dataIn.tax_amount;
			data.net_amount = dataIn.net_amount;
//			data.itemString = dataIn.item;
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	} else if(dataIn.type=='salesorder') {
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200) {
			customer = 	getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
			
			if(customer['error_code']==200 && principal['error_code']==200) {
				creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
				if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
			}
		}
		
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		terms = getListId('term', dataIn.terms);
		
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';

		item = getItemIdPG('inventoryitem',dataIn.item);
		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
		if(item['error_code']==200) uom = getUOM('unitstype', item['unit'], dataIn.uom);
		if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

		//if all data pass the validation return internal id of each records
		if(principal['error_code'] == 200 &&
		   customer['error_code'] == 200 &&
		   location['error_code'] == 200 &&
		   operation['error_code'] == 200 &&
		   terms['error_code'] == 200 &&
		   creditlimit['error_code'] == 200 &&
		   item['error_code'] == 200 &&
		   uom['error_code'] == 200) {
			
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
			data.uom = uom['internalid'];
			data.qty=dataIn.quantity;
			data.terms = terms['internalid'];
			data.amount = dataIn.amount;
			
			/** check if discount contains number **/
			var re = /[0-9.]{1,}/g;
			var disc = re.exec(dataIn.discount);
			data.discount = (disc==null) ? 0 : disc[0];
			
			data.tax_amount = dataIn.tax_amount;
			data.itemString = dataIn.item;
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	} else if(dataIn.type=='purchaseorder') {
//		terms = getListId('term', dataIn.terms);
//		paymenttype = getListId('customlist108', dataIn.paymenttype);
		principal = getListId('classification', dataIn.principal);
		location = getListId('location', dataIn.location);
		
		item = getItemIdPG('item',dataIn.item);
		if(item['error_code']==200) uom = getUOM('unitstype', item['unit'], dataIn.uom);
		if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
//		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
//		if(paymenttype['error_code']==404) errorText += paymenttype['name']+' '+paymenttype['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		
		if(principal['error_code']==200 && location['error_code']==200 && item['error_code']==200 && uom['error_code']==200) { 	
			
			data.type = dataIn.type;
			data.principaltype = dataIn.principaltype;
			data.externalid = dataIn.externalid;
			data.vendor = '719'; //vendor id 719 = PROCTER & GAMBLE DISTRIBUTING (PHILS.), INC;
			data.vendor_name = dataIn.vendor;
			data.date = dataIn.date;
			data.remarks = dataIn.remarks;
//			data.terms = terms['internalid'];
			data.terms = '5'; //COD
			data.principal = principal['internalid'];
			data.location = location['internalid'];
//			data.paymenttype = paymenttype['internalid'];
			data.paymenttype = '2'; //paymenttype id 2 = Later Payment;
			
			data.item = item['internalid'];
			data.item_name = item['item_name'];
			data.itemString = dataIn.item;
			data.receivinglocation = location['internalid'];
			data.qty=dataIn.quantity;
			data.uom = uom['internalid'];
			data.unit_cost = dataIn.unit_cost;
			data.amount = dataIn.amount;
			data.discount_amount = dataIn.discount_amount;
			return data;
			
		} else { //return original data with error
			originaldata.itemString = dataIn.item;
			originaldata.error = errorText;
			return originaldata;
		}
	} else if(dataIn.type=='creditmemo') {
		principal = getListId('classification', dataIn.principal);
		if(principal['error_code']==200) {
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';	
			
			if(customer['error_code']==200) {
				var creditinfo = getCreditLimitInfo(principal['internalid'], customer['internalid']);
			}

		}
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		
		if(principal['error_code']==200 && customer['error_code']==200 && location['error_code']==200 && operation['error_code']==200) {
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
			data.discount_amount = dataIn.discount_amount;
			data.tax_amount = dataIn.tax_amount;
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	} else if(dataIn.type=='transferorder') {
		principal = getListId('classification', dataIn.principal);
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		
		customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
		if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
		var department = '';
		if(customer['error_code']==200 && principal['error_code']==200) {
			salesman = getSalesManAndLocation('customer', customer['internalid']);
			creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
			
			if(creditlimit['error_code']==200) {
				department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);				
			}
			
			if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
		}
		
		location = getListId('location', dataIn.location);		
		operation = getListId('customlist89', dataIn.operation);
		item = getItemIdPG('inventoryitem',dataIn.item);
		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';	
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
		
		if(item['error_code']==200) {
			uom = getUOM('unitstype', item['unit'], dataIn.uom);
			if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
			if(customer['error_code']==200) {
				if(salesman['error_code']==200 && operation['error_code']==200) {
					//GET THE UNIT PRICE WITHOUT VAT
					itempricing = getPricing(item['internalid'], salesman['reportingbranch'], operation['internalid']);
					if(itempricing==null) {
						errorText += dataIn.item+' '+"does not have pricing setup. Kindly check customer's reporting branch and item pricelist. ";
					} else {
						var price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
						var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = price_no_vat * parseInt(conversion_factor);
					}
				}
			}
		}
		
		if(principal['error_code']==200 && customer['error_code']==200 && operation['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && item['error_code']==200 && uom['error_code']==200 && itempricing!=null) {
			data.type = dataIn.type;
			data.principaltype = dataIn.principaltype;
			data.externalid = dataIn.externalid;
			data.principal = principal['internalid'];
			data.department = department;
			data.customer = customer['internalid'];
			data.date = dataIn.date;
			data.memo = dataIn.memo;
			data.fromlocation = location['internalid'];
			data.customerlocation = salesman['customerlocation'];
			data.reportingbranch = salesman['reportingbranch'];
			data.operation = operation['internalid'];
			data.item=item['internalid'];	
			data.item_name=item['item_name'];
			data.itemString = dataIn.item;
			data.uom = uom['internalid'];
			data.qty = dataIn.quantity;
			data.unit_price = unit_price;
			
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	} else if(dataIn.type=='transferordervanreturn') {
		principal = getListId('classification', dataIn.principal);
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		
		customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
		if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
		var department='';
		if(customer['error_code']==200 && principal['error_code']==200) {
			salesman = getSalesManAndLocation('customer', customer['internalid']);
			creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
			if(creditlimit['error_code']==200) {
				department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);				
			}
			if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
		}
		
		location = getListId('location', dataIn.location);		
		operation = getListId('customlist89', dataIn.operation);
		item = getItemIdPG('inventoryitem',dataIn.item);
		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';	
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
		
		if(item['error_code']==200) {
			uom = getUOM('unitstype', item['unit'], dataIn.uom);
			if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
			if(customer['error_code']==200) {
				if(salesman['error_code']==200 && operation['error_code']==200) {
					//GET THE UNIT PRICE WITHOUT VAT
					itempricing = getPricing(item['internalid'], salesman['reportingbranch'], operation['internalid']);
					if(itempricing==null) {
						errorText += dataIn.item+' '+"does not have pricing setup. Kindly check customer's reporting branch and item pricelist. ";
					} else {
						var price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
						var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = price_no_vat * parseInt(conversion_factor);
					}
				}
			}
		}
		
		if(principal['error_code']==200 && customer['error_code']==200 && operation['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && item['error_code']==200 && uom['error_code']==200 && itempricing!=null) {
			data.type = dataIn.type;
			data.principaltype = dataIn.principaltype;
			data.externalid = dataIn.externalid;
			data.principal = principal['internalid'];
			data.department = department;
			data.customer = customer['internalid'];
			data.date = dataIn.date;
			data.memo = dataIn.memo;
			data.fromlocation = location['internalid'];
			data.customerlocation = salesman['customerlocation'];
			data.reportingbranch = salesman['reportingbranch'];
			data.operation = operation['internalid'];
			data.item=item['internalid'];	
			data.item_name=item['item_name'];
			data.itemString = dataIn.item;
			data.uom = uom['internalid'];
			data.qty = dataIn.quantity;
			data.unit_price = unit_price;
			
			return data;
		} else { //return original data with error
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	}
}

function getSalesManAndLocation(type, customer) {
	var filter = new nlobjSearchFilter('internalid', null, 'is', customer);
	var column = [
	              	new nlobjSearchColumn('custentity37'),	// customer location
	              	new nlobjSearchColumn('custentity48')	// reporting branch
	             ];
	var result = nlapiSearchRecord(type, null, filter, column); //20
	if(result==null) {
		return { "error_code":404 };
	} else {
		return {
			"error_code":200,
			"customerlocation": result[0].getValue('custentity37'),
			"reportingbranch": result[0].getValue('custentity48')
		};
	}
}

function pgPostData(dataIn) {
	var account;
	if(dataIn.type=='invoice') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
//		var subtotal=0;
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '1038'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		
		record.setFieldValue('terms', dataIn.terms);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('custbody178', dataIn.external_invoice);
		record.setFieldValue('trandate', dataIn.date);
		
		var amount;
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, '45840'); //45840=PG32001 PG SI Summary
			record.setLineItemValue('item', 'taxcode', i, '6'); //6 = S_PH, 5 = UNDEF
			record.setLineItemValue('item', 'quantity', i, '1');
			amount = (dataIn.items[i-1].amount=='' || dataIn.items[i-1].amount==null || dataIn.items[i-1].amount==0) ? 0 : dataIn.items[i-1].amount;
			discamount = parseFloat(dataIn.items[i-1].discount/100 * amount).toFixed(10);
			record.setLineItemValue('item', 'amount', i, parseFloat(amount));
//			record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
		
//			record.setLineItemValue('item','custcol6',  i, dataIn.items[i-1].discount); //discount 1
//			record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
			record.setLineItemValue('item','tax1amt',  i, parseFloat(dataIn.items[i-1].tax_amount)); //tax amount
		}
		
		record.setLineItemValue('item','item',dataIn.items.length+1, '30323'); //30323=Sales Discount - Nonfood (CM)
		record.setLineItemValue('item','rate',dataIn.items.length+1, '-'+dataIn.items[0].discount+'%');
		record.setLineItemValue('item', 'taxcode', dataIn.items.length+1, '6'); //6 = S_PH, 5 = UNDEF
			
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
	} else if(dataIn.type=='salesorder') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
//		var subtotal=0;
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '8'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		
		record.setFieldValue('terms', dataIn.terms);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('custbody178', dataIn.external_invoice);
		record.setFieldValue('trandate', dataIn.date);
		
		var amount, totaldisc=0;
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			amount = (dataIn.items[i-1].amount=='' || dataIn.items[i-1].amount==null || dataIn.items[i-1].amount==0) ? 0 : dataIn.items[i-1].amount;
			discamount = parseFloat(dataIn.items[i-1].discount/100 * amount).toFixed(10);
			
			totaldisc += parseFloat(discamount);
			
			record.setLineItemValue('item', 'amount', i, parseFloat(amount));
			record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
		
			record.setLineItemValue('item','custcol6',  i, dataIn.items[i-1].discount); //discount 1
//			record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
			record.setLineItemValue('item','tax1amt',  i, parseFloat(dataIn.items[i-1].tax_amount)); //tax amount
		}
		record.setFieldValue('discountitem','30362');
		record.setFieldValue('discountrate', parseFloat(totaldisc * -1).toFixed(2));
//		record.setLineItemValue('item','item',dataIn.items.length+1, '30323'); //30323=Sales Discount - Nonfood (CM)
//		record.setLineItemValue('item','rate',dataIn.items.length+1, '-'+dataIn.items[0].discount+'%');
//		record.setLineItemValue('item', 'taxcode', dataIn.items.length+1, '6'); //6 = S_PH, 5 = UNDEF
			
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
	} else if(dataIn.type=='purchaseorder') {
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('customform','116'); // PO FORM : DDI Trade PO
		record.setFieldValue('custbody43','2'); // ORDER TYPE : Manual/Filler Order/ Additional Order
		
		record.setFieldValue('entity', dataIn.vendor);
		record.setFieldValue('custbody120', dataIn.terms);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.remarks);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('department', '1018'); // DEPARTMENT - BRANCHES : OPERATIONS : LOGISTICS : GOOD STOCK WAREHOUSE
		record.setFieldValue('custbody38', dataIn.paymenttype);
		record.setFieldValue('custbody37', dataIn.externalid);
		
		for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			record.setLineItemValue('item', 'custcol32', i, dataIn.items[i-1].unit_cost); //purchase price
			record.setLineItemValue('item', 'rate', i, dataIn.items[i-1].unit_cost); // unit cost
			record.setLineItemValue('item', 'amount', i, dataIn.items[i-1].amount);
			record.setLineItemValue('item', 'custcol10', i, dataIn.items[i-1].discount_amount);
			record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
			record.setLineItemValue('item', 'taxcode', i, '6');
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
	} else if(dataIn.type=='creditmemo') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
		
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('customform', '125'); // 125 = DDI Credit Memo;
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '1038'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		record.setFieldValue('salesrep', dataIn.salesrep);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('custbody178', dataIn.externalid);
		
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, '45840'); //45840=PG32001 PG SI Summary
			record.setLineItemValue('item', 'taxcode', i, '6'); //6 = S_PH, 5 = UNDEF
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
	} else if(dataIn.type=='transferorder') {
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('customform', '142'); // 142 = DDI T.O - Van Loading;
		record.setFieldValue('custbody172', dataIn.customer); //salesman
		record.setFieldValue('location', dataIn.fromlocation); //from location
		record.setFieldValue('transferlocation', dataIn.customerlocation); //to location / van location
		record.setFieldValue('custbody145', dataIn.reportingbranch); //reporting branchv
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue( 'custbody69', dataIn.operation); //operation
		record.setFieldValue('department', dataIn.department); //department
		
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'description', i, nlapiLookupField('item', dataIn.items[i-1].item, 'displayname', false));
			record.setLineItemValue('item', 'custcol30', i, dataIn.items[i-1].unit_price); // custcol30 = SALES PRICE(EX-VAT);
			record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
			
			var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price) * 1.12).toFixed(2); //Net amount, not vat and discount
			record.setLineItemValue('item', 'custcol32', i, amount); // custcol32 = TOTAL(W/VAT);
			
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
		}
		
		var id = nlapiSubmitRecord(record, null, true); //20				
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
	} else if(dataIn.type=='transferordervanreturn') {
		var record = nlapiCreateRecord('transferorder'); //20
		record.setFieldValue('customform', '171'); // 171 = DDI T.O - Van Returns;
		record.setFieldValue('custbody172', dataIn.customer); //salesman
		record.setFieldValue('location', dataIn.customerlocation); //from location
		record.setFieldValue('transferlocation', dataIn.fromlocation); //to location / van location
		record.setFieldValue('custbody145', dataIn.reportingbranch); //reporting branchv
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue( 'custbody69', dataIn.operation); //operation
		record.setFieldValue('department', dataIn.department); //department
		
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'description', i, nlapiLookupField('item', dataIn.items[i-1].item, 'displayname', false));
			record.setLineItemValue('item', 'custcol30', i, dataIn.items[i-1].unit_price); // custcol30 = SALES PRICE(EX-VAT);
			record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
			
			var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price) * 1.12).toFixed(2); //Net amount, not vat and discount
			record.setLineItemValue('item', 'custcol32', i, amount); // custcol32 = TOTAL(W/VAT);
			
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
		}
		
		var id = nlapiSubmitRecord(record, null, true); //20				
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
	}
}

function mondelezValidation(dataIn) {
	var data = {};
	var errorText = '';
	var originaldata = dataIn;
	
	var customer, 
		operation,
		principal, 
		location, 
		item, 
		vendor, 
		terms, 
		paymenttype, 
		receivinglocation, 
		uom, 
		customerGP, 
		price_no_vat = 0,
		itempricing,
		salesrep,
		creditlimit;
	
	if(dataIn.type=='invoice') {
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200) {
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
			
			if(customer['error_code']==200 && principal['error_code']==200) {
				creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
				if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
			}
		}
		
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		terms = getListId('term', dataIn.terms);
		item = getItemId('inventoryitem',dataIn.item);
		
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
		
		if(item['error_code']==200) {
			uom = getUOM('unitstype', item['unit'], dataIn.uom);
			if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';				
			
			//GET THE UNIT PRICE WITHOUT VAT
			if(location['error_code']==200 && operation['error_code']==200) {
				itempricing = getPricing(item['internalid'], location['internalid'], operation['internalid']);
				if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
			}
		}
	
		//if all data pass the validation return internal id of each records
		if(principal['error_code']==200 && customer['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && item['error_code']==200 && terms['error_code']==200 && uom['error_code']==200)
		{
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
				price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
				var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
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
	} else if(dataIn.type=='purchaseorder') {
		vendor = getVendorId('vendor', dataIn.vendor);
		terms = getListId('term', dataIn.terms);
		paymenttype = getListId('customlist108', dataIn.paymenttype);
		receivinglocation = getListId('location', dataIn.receivinglocation);
		principal = getListId('classification', dataIn.principal);
		location = getListId('location', dataIn.location);
		
		item = getItemId('item',dataIn.item);
		if(item['error_code']==200) uom = getUOM('unitstype', item['unit'], dataIn.uom);
		if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';		
		if(vendor['error_code']==404) errorText += vendor['name']+' '+vendor['message']+'.'+' ';
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(paymenttype['error_code']==404) errorText += paymenttype['name']+' '+paymenttype['message']+'.'+' ';
		if(receivinglocation['error_code']==404) errorText += receivinglocation['name']+' '+receivinglocation['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		
		if(vendor['error_code']==200 && terms['error_code']==200 && paymenttype['error_code']==200 && receivinglocation['error_code']==200 && principal['error_code']==200 && location['error_code']==200 && item['error_code']==200 && uom['error_code']==200)
		{ 
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
	} else if(dataIn.type=='returnauthorization') {
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200){
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
			
			if(customer['error_code']==200 && principal['error_code']==200) {
				creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
				if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
			}
		}
		 operation = getListId('customlist89', dataIn.operation);
		 principal = getListId('classification', dataIn.principal);
		 location = getListId('location', dataIn.location);
		 reason = getListId('customlist120', dataIn.reason);
		 
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		if(reason['error_code']==404) errorText += reason['name']+' '+reason['message']+'.'+' ';
		
		item = getItemId('item',dataIn.item);
		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
		
		if(item['error_code']==200) {
			uom = getUOM('unitstype', item['unit'], dataIn.uom);
			if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
			
			// GET THE UNIT PRICE WITHOUT VAT
			if(location['error_code']==200 && operation['error_code']==200) {
				itempricing = getPricing(item['internalid'], location['internalid'], operation['internalid']);
				if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
			}
		}
		 
		if(principal['error_code']==200 && customer['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && item['error_code']==200 && uom['error_code']==200 && reason['error_code']==200)
		{
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
				var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
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
	}
}

function mondelezPostData(dataIn) {
	var account;
	if(dataIn.type=='invoice') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
		
		var record = nlapiCreateRecord(dataIn.type); //20
		record.setFieldValue('customform', '179'); // 179 = Trade Invoice - with Code
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue('custbody69', dataIn.operation);
		
		var creditlimit = customerCreditLimit(dataIn.customer,dataIn.principal);
		if(creditlimit['error_code']==200) {
			var dept = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
			(dept!='' || dept!=null) ? record.setFieldValue('department', dept) : record.setFieldValue('department', '1038');
		}
		
		
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('custbody178', dataIn.external_invoice);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('terms', dataIn.terms);
		
		discounts = getCustomerDiscount(dataIn.customer, dataIn.principal);
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'taxcode', i, '6');
			record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
			var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2); //Net amount, not vat and discount
			record.setLineItemValue('item', 'amount', i, amount); 
			record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			setLineItemDiscount(record, i, discounts, dataIn);
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
			'date':dataIn.date
		};
	} else if(dataIn.type=='purchaseorder') {	
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('customform','116'); // PO FORM : DDI Trade PO
		record.setFieldValue('custbody43','2'); // ORDER TYPE : Manual/Filler Order/ Additional Order
		
		record.setFieldValue('entity', dataIn.vendor);
		record.setFieldValue('custbody120', dataIn.terms);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.remarks);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('department', '9'); // DEPARTMENT - BRANCHES : OPERATIONS : LOGISTICS : GOOD STOCK WAREHOUSE
		record.setFieldValue('custbody38', dataIn.paymenttype);
		
		for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);	
			record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
			record.setLineItemValue('item', 'taxcode', i, '6');
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
	}  else if(dataIn.type=='returnauthorization') {	
		var OPERATION = 'custbody69';
		var EXTERNAL_INVOICE = 'custbody178';
		
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue( OPERATION, dataIn.operation);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
//		record.setFieldValue('department', '5'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES
		var creditlimit = customerCreditLimit(dataIn.customer,dataIn.principal);
		if(creditlimit['error_code']==200) {
			var dept = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
			(dept!='' || dept!=null) ? record.setFieldValue('department', dept) : record.setFieldValue('department', '1038');
		}
		
		record.setFieldValue(EXTERNAL_INVOICE, dataIn.external_invoice);
		record.setFieldValue('custbody8', nlapiGetUser());
		
		var discounts = getCustomerDiscount(dataIn.customer, dataIn.principal);
		for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++) {		
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'taxcode', i, '6');
			record.setLineItemValue('item', 'custcol35', i, dataIn.items[i-1].reason);	
			record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
			var amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2); //Net amount, not vat and discount 
			record.setLineItemValue('item', 'amount', i, amount);
			record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			record.setLineItemValue('item', 'custcol37', i, dataIn.items[i-1].bbd);
			setLineItemDiscount(record, i, discounts, dataIn);
		}
		var id = nlapiSubmitRecord(record, null, true); //20
		var record = nlapiLoadRecord(dataIn.type, id);
		return {
			'internalid':id, //ira#
			'externalid':dataIn.externalid,
			'customer':record.getFieldText('entity'),
			'department':record.getFieldText('department'),
			'principal':record.getFieldText('class'),
			'location':record.getFieldText('location'),
			'date':dataIn.date
		};
	}
}

function globeValidation(dataIn) {
	var data = {};
	var errorText = '';
	var originaldata = dataIn;
	
	var customer, 
		operation,
		principal, 
		location, 
		item, 
		vendor, 
		terms, 
		paymenttype, 
		receivinglocation, 
		uom, 
		customerGP, 
		price_no_vat = 0,
		itempricing,
		salesrep,
		creditlimit;
	if(dataIn.type=='invoice') {
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200) {
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
			
			if(customer['error_code']==200 && principal['error_code']==200) {
				creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
				if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
			}
		}
		
		operation = getListId('customlist89', dataIn.operation);
		location = getListId('location', dataIn.location);
		terms = getListId('term', dataIn.terms);
		item = getItemId('inventoryitem',dataIn.item);
		
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
		
		if(item['error_code']==200) {
			uom = getUOM('unitstype', item['unit'], dataIn.uom);
			if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';				
			
			//GET THE UNIT PRICE WITHOUT VAT
			if(location['error_code']==200 && operation['error_code']==200) {
				itempricing = getPricing(item['internalid'], location['internalid'], operation['internalid']);
				if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
			}
		}

		//if all data pass the validation return internal id of each records
		if(principal['error_code']==200 && customer['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && item['error_code']==200 && terms['error_code']==200 && uom['error_code']==200)
		{
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
				var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
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
	}
}

function globePostData(dataIn) {
	var account;
	if(dataIn.type=='invoice') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
		
		var totaldiscount = 0,
		totalamount = 0,
		totaltax = 0,
		grossamount = 0;
		
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '1038'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('custbody178', dataIn.external_invoice);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('terms', dataIn.terms);
		
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++)
		{
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'taxcode', i, '6');
			record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price)); 
			record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
			record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
			record.setLineItemValue('item', 'custcol10', i, dataIn.items[i-1].discount_amount);

			if(dataIn.operation=='14') {
				// 1st approach
				//amount = parseFloat(parseFloat(parseFloat(parseFloat(parseFloat(dataIn.items[i-1].unit_price * 1.12) * dataIn.items[i-1].qty) - dataIn.items[i-1].discount_amount) / 1.12) + parseFloat(dataIn.items[i-1].discount_amount)).toFixed(2);
				
				// 2nd approach
				amount = parseFloat(parseFloat(dataIn.items[i-1].unit_price * 1.12) * dataIn.items[i-1].qty / 1.12).toFixed(10);
				
//				record.setLineItemValue('item', 'custcol10', i, discamt);
				record.setLineItemValue('item', 'amount', i, amount); //Net amount, no vat and discount				
			} else {
				amount = parseFloat(parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)).toFixed(2);
				record.setLineItemValue('item', 'amount', i, amount); //Net amount, no vat and discount
			}
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
			'date':dataIn.date
		};
	}
}
function validateData(dataIn)
{
	var data = {};
	var errorText = '';
	var originaldata = dataIn;
	
	var customer, 
		operation,
		principal, 
		location, 
		item, 
		vendor, 
		terms, 
		paymenttype, 
		receivinglocation, 
		uom, 
		customerGP, 
		price_no_vat = 0,
		itempricing,
		salesrep,
		creditlimit;
	
	if(dataIn.type=='invoice')
	{
		if(dataIn.principaltype=='procterandgamble') { 
			pgValidation(dataIn);
		} else{
			principal = getListId('classification', dataIn.principal);
			
			if(principal['error_code']==200) {
				customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
				if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
				
				if(customer['error_code']==200 && principal['error_code']==200) {
					creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
					if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
				}
			}
			
			operation = getListId('customlist89', dataIn.operation);
			location = getListId('location', dataIn.location);
			terms = getListId('term', dataIn.terms);
			
			if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
			if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
			if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
			if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
			
			if(dataIn.principaltype=='procterandgamble') { // P&G Principal
				item = getItemId('inventoryitem',dataIn.item);
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				
			} else { // Other Principals
				
				item = getItemId('inventoryitem',dataIn.item);
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				
				if(item['error_code']==200) {
					uom = getUOM('unitstype', item['unit'], dataIn.uom);
					if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';				
					
					//GET THE UNIT PRICE WITHOUT VAT
					if(location['error_code']==200 && operation['error_code']==200) {
						itempricing = getPricing(item['internalid'], location['internalid'], operation['internalid']);
						if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
					}
				}
			}
		
	//		if(department['error_code']==404) errorText += department['name']+' '+department['message']+'.'+' ';
	
			//if all data pass the validation return internal id of each records
			if(principal['error_code']==200 && customer['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && item['error_code']==200 && terms['error_code']==200) //&& uom['error_code']==200)
			{
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
				
				if(dataIn.principaltype=='procterandgamble') { //PROCTER AND GAMBLE
					data.amount = dataIn.amount;
					data.discount = dataIn.discount;
				} else if(dataIn.principaltype=='mondelez') { //MONDELEZ
					if(itempricing!=null) {
						price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
						var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = price_no_vat * parseInt(conversion_factor);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
	//					data.discount = dataIn.discount;
					} else {
						originaldata.error = errorText;
						originaldata.itemString = dataIn.item;
						return originaldata;
					}
					
				} else if(dataIn.principaltype=='globe') { //GLOBE
					
					if(itempricing!=null) {
						price_no_vat = (itempricing[0].getValue('custrecord768'))/ 1.12;
						var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = price_no_vat * parseInt(conversion_factor);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
						data.discount_amount = dataIn.discount_amount;
					} else {
						originaldata.error = errorText;
						originaldata.itemString = dataIn.item;
						return originaldata;
					}
					
				} else { //NUTRIASIA
					if(itempricing!=null) {
						price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(5);
						var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
						var unit_price = price_no_vat * parseInt(conversion_factor);
						data.unit_price = unit_price;
						data.qty = dataIn.quantity;
						data.uom = uom['internalid'];
					} else {
						originaldata.error = errorText;
						originaldata.itemString = dataIn.item;
						return originaldata;
					}
				}
				
				data.itemString = dataIn.item;
				return data;
			} else { //return original data with error
				originaldata.error = errorText;
				originaldata.itemString = dataIn.item;
				return originaldata;
			}
		}
	}
	if(dataIn.type=='purchaseorder')
	{
		vendor = getVendorId('vendor', dataIn.vendor);
		terms = getListId('term', dataIn.terms);
		paymenttype = getListId('customlist108', dataIn.paymenttype);
		receivinglocation = getListId('location', dataIn.receivinglocation);
		principal = getListId('classification', dataIn.principal);
		location = getListId('location', dataIn.location);
		
		if(dataIn.principaltype=='procterandgamble') { // P&G Principal
			item = getItemId('inventoryitem',dataIn.item);
			if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
			
		} else { // Other Principals
			item = getItemId('item',dataIn.item);
			if(item['error_code']==200) uom = getUOM('unitstype', item['unit'], dataIn.uom);
			
//			itempricing = getPricePO(item, location, dataIn.uom, principal, dataIn.quantity);
//			if(itempricing['error_code']==404) errorText += itempricing['message'];
			
			if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
			if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
		}
		
		if(vendor['error_code']==404) errorText += vendor['name']+' '+vendor['message']+'.'+' ';
		if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
		if(paymenttype['error_code']==404) errorText += paymenttype['name']+' '+paymenttype['message']+'.'+' ';
		if(receivinglocation['error_code']==404) errorText += receivinglocation['name']+' '+receivinglocation['message']+'.'+' ';
//		if(department['error_code']==404) errorText += department['name']+' '+department['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
//		if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
//		if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
		
		if(vendor['error_code']==200 && terms['error_code']==200 && paymenttype['error_code']==200 && receivinglocation['error_code']==200 && principal['error_code']==200 && location['error_code']==200 && item['error_code']==200 && uom['error_code']==200)
		{ 
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
			
			if(dataIn.principaltype=='procterandgamble') {
				data.amount = dataIn.amount;
				data.discount = dataIn.discount;
			} else {
//				if(itempricing['error_code']==200) {
//					data.unit_price = itempricing['unit_price'];
					data.qty=dataIn.quantity;
					data.uom = uom['internalid'];
//					data.dist_disc = itempricing['dist_disc'];
//					data.bo_allow_disc = itempricing['bo_allow'];
//					data.prompt_disc = itempricing['prompt_disc'];
//					data.tra_disc = itempricing['tra'];
//					data.merch_support_disc = itempricing['merch_support'];
//					data.slog_disc = itempricing['slog_disc'];
//				} else {
//					originaldata.error = errorText;
//					originaldata.itemString = dataIn.item;
//					return originaldata;
//				}
			}
			
			return data;
		}	
		else //return original data with error
		{
			originaldata.itemString = dataIn.item;
			originaldata.error = errorText;
			return originaldata;
		}
	}
	if(dataIn.type=='returnauthorization')
	{
		principal = getListId('classification', dataIn.principal);
		
		if(principal['error_code']==200){
			customer = getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
			if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
			
			if(customer['error_code']==200 && principal['error_code']==200) {
				creditlimit = customerCreditLimit(customer['internalid'],principal['internalid']);
				if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
			}
		}
		 operation = getListId('customlist89', dataIn.operation);
		 principal = getListId('classification', dataIn.principal);
		 location = getListId('location', dataIn.location);
		 reason = getListId('customlist120', dataIn.reason);
		 
//		if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
//		if(salesrep['error_code']==404) errorText += salesrep['name']+' '+salesrep['message']+'.'+' ';
		if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
		if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
		if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		if(reason['error_code']==404) errorText += reason['name']+' '+reason['message']+'.'+' ';
			
		 if(dataIn.principaltype=='procterandgamble') { // P&G Principal
				item = getItemId('inventoryitem',dataIn.item);
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
			} else { // Other Principals
				
				item = getItemId('item',dataIn.item);
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				
				if(item['error_code']==200) {
					uom = getUOM('unitstype', item['unit'], dataIn.uom);
					if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
					
					// GET THE UNIT PRICE WITHOUT VAT
					if(location['error_code']==200 && operation['error_code']==200) {
						itempricing = getPricing(item['internalid'], location['internalid'], operation['internalid']);
						if(itempricing==null) errorText += dataIn.item+' '+'does not have pricing in '+dataIn.location;
					}
					
				}
			}
		 
		 
		if(principal['error_code']==200 && customer['error_code']==200 && creditlimit['error_code']==200 && location['error_code']==200 && operation['error_code']==200 && item['error_code']==200 && uom['error_code']==200 && reason['error_code']==200)
		{
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
//			data.qty = dataIn.quantity;
//			data.uom = uom['internalid'];
			data.reason = reason['internalid'];
			
			if(dataIn.principaltype=='procterandgamble') {
				data.amount = dataIn.amount;
				data.discount = dataIn.discount;
			} else {
				if(itempricing!=null) {
					price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
					var conversion_factor = conversionRate(item['unit'], uom['abbreviation']);
					var unit_price = price_no_vat * parseInt(conversion_factor);
					data.unit_price = unit_price;
					data.qty = dataIn.quantity;
					data.uom = uom['internalid'];
//					data.discount = dataIn.discount;
				} else {
					originaldata.error = errorText;
					originaldata.itemString = dataIn.item;
					return originaldata;
				}
			}
				
			return data;
		}
		else //return original data with error
		{
			originaldata.error = errorText;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	}
}
function getUOM(type, record_internalid, unitname)
{
	var unitrecord = nlapiLoadRecord(type, record_internalid);
	if(unitrecord==null)
	{
		return {
			"name":unitname,
			"error_code":404,
			"message":"NOT FOUND"
		};
	} else {
		var cases = ['CASE','Case','case','CASES','Cases','cases','CS','Cs','cs','cS'];
		var pieces = ['PIECE','Piece','piece','PIECES','Pieces','pieces','PC','Pc','pc','pC','PCS','Pcs','pcs'];
		var globe = ['PESO','Peso','peso','pesos','PESOS','Pesos'];
		var packs = ['PACKS','Packs','packs','pack','Pack','PACK','PCK','Pck','pck','PK','Pk','pk','PCKS','Pcks','pcks'];
		var sw = ['sw','SW','sW','Sw'];
		var it = ['it','IT','It','iT'];
		var found = false;
		
		for(var i=1, linecount = unitrecord.getLineItemCount('uom'); i<=linecount; i++)
		{
			if(existInArray(cases,unitname)==true) { //check if the data is CASE
				//get the internalid of the unit
				if(existInArray(cases,unitrecord.getLineItemValue('uom','unitname',i))==true) {
					found = true;
					return {
						"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
						"error_code":200,
						"uom_array": cases,
						"abbreviation":'CS'
					};
				}	
			} else if(existInArray(pieces,unitname)==true) { //check if the data is PIECE
				//get the internalid of the unit
				if(existInArray(pieces,unitrecord.getLineItemValue('uom','unitname',i))==true)
				{
					found = true;
					return {
						"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
						"error_code":200,
						"uom_array": pieces,
						"abbreviation":'PC'
					};
				}	
			} else if(existInArray(globe,unitname)==true) { //check if the data is PESO
				//get the internalid of the unit
				if(existInArray(globe,unitrecord.getLineItemValue('uom','unitname',i))==true) {
					found = true;
					return {
						"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
						"error_code":200,
						"uom_array": globe,
						"abbreviation":'Peso'
					};
				}
			} else if(existInArray(packs,unitname)==true) {
				//get the internalid of the unit
				if(existInArray(packs,unitrecord.getLineItemValue('uom','unitname',i))==true) {
					found = true;
					return {
						"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
						"error_code":200,
						"uom_array": packs,
						"abbreviation":'Pck'
					};
				}
			} else if(existInArray(sw,unitname)==true) {
				//get the internalid of the unit
				if(existInArray(sw,unitrecord.getLineItemValue('uom','unitname',i))==true) {
					found = true;
					return {
						"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
						"error_code":200,
						"uom_array": sw,
						"abbreviation":'SW'
					};
				}
			} else if(existInArray(it,unitname)==true) {
				//get the internalid of the unit
				if(existInArray(it,unitrecord.getLineItemValue('uom','unitname',i))==true) {
					found = true;
					return {
						"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
						"error_code":200,
						"uom_array": it,
						"abbreviation":'IT'
					};
				}
			} else { //UNIT is not CS or PC
				return {
					"name":unitname,
					"error_code":404,
					"message":"NOT FOUND"
				};
			}	
		}//end of for loop

		if(found==false) {
			return {
				"name":unitname,
				"error_code":404,
				"message":"NOT FOUND"
			};
		}
		
	}
}

function getCreditLimitInfo(principal, customer) {
	
	filter = new Array(
				new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
				new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
		);
	columns = new Array(
			new nlobjSearchColumn('custrecord340')	//Sales Rep Column
	);
	
	var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
	
	return creditInfo = {
			"salesrep" : (creditLimit!=null) ? creditLimit[0].getValue('custrecord340') : ''
	};
}

function customerGroupPricing(customerID,itemGroupPricingID)
{
	var customer = nlapiLoadRecord('customer', customerID);
	for(var i = 1, linecount = customer.getLineItemCount('grouppricing'); i<=linecount; i++)
	{
		if(customer.getLineItemValue('grouppricing', 'group', i)==itemGroupPricingID)
		{
			return true;
		}
	}
	return false;
}
function existInArray(array, value)
{
	for(var i=0, linecount = array.length; i<linecount; i++)	
	{
		if(array[i]==value)
		{
			return true;
		}
	}
	return false;
}
function getListId(type, value)
{
	var filter_field = 'name';
	
	if(type=='vendor' || type=='customer' || type=='employee') filter_field = 'entityid';
	
	var filter = new nlobjSearchFilter(filter_field, null, 'is', value);
	var column = new nlobjSearchColumn('internalid');
	var result = nlapiSearchRecord(type, null, filter, column); //20
	if(result==null)
	{
		return {
			"name":value,
			"error_code":404,
			"message":"NOT FOUND"
		};
	}
	return {
		"error_code":200,
		"internalid": result[0].getValue('internalid')
		};
}
function getCustomerId(type, customer, principal)
{
		filter = [new nlobjSearchFilter('custrecord883', null, 'is', customer),
		          new nlobjSearchFilter('custrecord884', null, 'is', principal)
				 ];
		var column = new nlobjSearchColumn('custrecord882');
		var result = nlapiSearchRecord(type, null, filter, column); //20
		if(result==null)
		{
			return {
					"name":customer,
					"error_code":404,
					"message":"NOT FOUND"
					};
		} else if(result[0].getValue('custrecord882')==''){
			return {
				"name":customer,
				"error_code":404,
				"message":"CODE IS NOT MAPPED TO A CUSTOMER"
				};
		} else {
			return {
				"error_code":200,
				"internalid": result[0].getValue('custrecord882'),
				"customer_name":result[0].getText('custrecord882')
				};
		}
}
function getVendorId(type, value)
{
		filter = new nlobjSearchFilter('entityid', null, 'is', value);
		var column = new nlobjSearchColumn('internalid');
		var result = nlapiSearchRecord(type, null, filter, column); //20
		if(result==null)
		{
			return {
					"name":value,
					"error_code":404,
					"message":"NOT FOUND"};
		}
			return{
			"error_code":200,
			"internalid": result[0].getValue('internalid'),
			"vendor_name":result[0].getText('internalid')
			};
}

function getItemIdPG(type, value) {
//	filter = new nlobjSearchFilter('custitem10', null, 'is', value); //item code
	filter = new nlobjSearchFilter('itemid', null, 'is', value); // item code and description
	var column = new Array();
	column[0] = new nlobjSearchColumn('internalid');
	column[1] = new nlobjSearchColumn('unitstype');
	column[2] = new nlobjSearchColumn('itemid');
	column[3] = new nlobjSearchColumn('custitem72');
//	column[3] = new nlobjSearchColumn('pricinggroup');
	
	var result = nlapiSearchRecord(type, null, filter, column); //20
	if(result==null)
	{
			return {
					"name":value,
					"error_code":404,
					"message":"NOT FOUND"
				   };
	}
	return{
		"error_code":200,
		"internalid": result[0].getValue('internalid'),
		"unit":result[0].getValue('unitstype'),
		"item_name":result[0].getValue('itemid'),
		"conversion_factor":result[0].getValue('custitem72')
//		"group_pricing":result[0].getValue('pricinggroup')
		};
}

function getItemId(type, value) {
	filter = new nlobjSearchFilter('custitem10', null, 'is', value); //item code
//	filter = new nlobjSearchFilter('itemid', null, 'is', value); // item code and description
	var column = new Array();
	column[0] = new nlobjSearchColumn('internalid');
	column[1] = new nlobjSearchColumn('unitstype');
	column[2] = new nlobjSearchColumn('itemid');
	column[3] = new nlobjSearchColumn('custitem72');
//	column[3] = new nlobjSearchColumn('pricinggroup');
	
	var result = nlapiSearchRecord(type, null, filter, column); //20
	if(result==null)
	{
			return {
					"name":value,
					"error_code":404,
					"message":"NOT FOUND"
				   };
	}
	return{
		"error_code":200,
		"internalid": result[0].getValue('internalid'),
		"unit":result[0].getValue('unitstype'),
		"item_name":result[0].getValue('itemid'),
		"conversion_factor":result[0].getValue('custitem72')
//		"group_pricing":result[0].getValue('pricinggroup')
		};
}
function submitData(dataIn)
{
	var account;
	
	if(dataIn.type=='invoice') {
		//DEFAULT INVOICE ACCOUNT= 101020100 Receivables : Accounts Receivable - Trade //
		// INTERNAL ID is 123 //
		account=123;
		
		var totaldiscount = 0,
		totalamount = 0,
		totaltax = 0,
		grossamount = 0;
		
		var record = nlapiCreateRecord(dataIn.type); //20
		
		if(dataIn.principaltype=='mondelez') {
			record.setFieldValue('customform', '179'); // 179 = Trade Invoice - with Code
		}
		
		record.setFieldValue('entity', dataIn.customer);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('account', account);
		record.setFieldValue( 'custbody69', dataIn.operation);
		record.setFieldValue('department', '8'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES : BOOKING
		
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue('custbody178', dataIn.external_invoice);
		record.setFieldValue('trandate', dataIn.date);
//		record.setFieldValue('salesrep', dataIn.salesrep);
		
		// PRINCIPAL TYPE SHOULD NOT BE GLOBE.
		if(dataIn.principaltype!='globe') {
			discounts = getCustomerDiscount(dataIn.customer, dataIn.principal);
		}
		
		if(dataIn.principaltype!='procterandgamble') {
			record.setFieldValue('terms', dataIn.terms);
		}
		
		for(var i = 1,linecount = dataIn.items.length; i <= linecount; i++)
		{
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'taxcode', i, '6');
			// for PG //
			if(dataIn.principaltype=='procterandgamble') {
				record.setLineItemValue('item', 'quantity', i, '1');
				record.setLineItemValue('item', 'amount', i, dataIn.items[i-1].amount);
				var discamount = parseFloat(dataIn.items[i-1].discount/100 * dataIn.items[i-1].amount).toFixed(2);
				record.setLineItemValue('item','custcol6',  i, dataIn.items[i-1].discount); //discount 1
				record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
			} else if(dataIn.principaltype=='mondelez') { // MONDELEZ
//				setLineItemDiscount(record, i, discounts, dataIn);
//				totaldiscount+=parseFloat(record.getLineItemValue('item','custcol10',i)).toFixed(2);
//				totalamount+=parseFloat(record.getLineItemValue('item','amount',i)).toFixed(2);
				record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
				record.setLineItemValue('item', 'amount', i, parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)); //Net amount, not vat and discount 
				record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				setLineItemDiscount(record, i, discounts, dataIn);
			} else if(dataIn.principaltype=='globe') { // GLOBE
				var amount = 0;
				record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price)); 
				record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				record.setLineItemValue('item', 'custcol10', i, dataIn.items[i-1].discount_amount);
				record.setLineItemValue('item', 'amount', i, parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)); //Net amount, not vat and discount
//				amount = parseFloat(parseFloat(parseFloat(parseFloat(parseFloat(dataIn.items[i-1].unit_price * 1.12) * dataIn.items[i-1].qty) - dataIn.items[i-1].discount_amount) / 1.12) + dataIn.items[i-1].discount_amount).toFixed(2);
//				record.setLineItemValue('item', 'amount', i, amount); //Net amount, not vat and discount
			} else { //NUTRIASIA
				record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
				record.setLineItemValue('item', 'amount', i, parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)); //Net amount, not vat and discount 
				record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				setLineItemDiscount(record, i, discounts, dataIn);
			}
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
			'date':dataIn.date
		};
	} else if(dataIn.type=='purchaseorder') {	
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('customform','116'); // PO FORM : DDI Trade PO
		record.setFieldValue('custbody43','2'); // ORDER TYPE : Manual/Filler Order/ Additional Order
		
		record.setFieldValue('entity', dataIn.vendor);
		record.setFieldValue('custbody120', dataIn.terms);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.remarks);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('department', '9'); // DEPARTMENT - BRANCHES : OPERATIONS : LOGISTICS : GOOD STOCK WAREHOUSE
		record.setFieldValue('custbody38', dataIn.paymenttype);
		var linecount = dataIn.items.length;
		
		for(var i = 1; i <= linecount; i++){
			//for PG //
			if(dataIn.principaltype!='procterandgamble') {
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
				record.setLineItemValue('item', 'taxcode', i, '6');
			} else { // for OTHER PRINCIPAL
//				var disc_amount_1 = 0, 
//					disc_amount_2 = 0, 
//					disc_amount_3 = 0, 
//					disc_amount_4 = 0, 
//					disc_amount_5 = 0, 
//					disc_amount_6 = 0, 
//					net_amount = 0, 
//					total_discount = 0, 
//					discounted_amount = 0;
//				
//				net_amount = parseFloat(dataIn.items[i-1].unit_price)*parseFloat(dataIn.items[i-1].qty);
//				disc_amount_1 = parseFloat(parseFloat(dataIn.items[i-1].dist_disc) / 100) * net_amount;
//				disc_amount_2 = parseFloat(parseFloat(dataIn.items[i-1].bo_allow_disc) / 100) * net_amount;
//				disc_amount_3 = parseFloat(parseFloat(dataIn.items[i-1].prompt_disc) / 100) * net_amount;
//				disc_amount_4 = parseFloat(parseFloat(dataIn.items[i-1].tra_disc) / 100) * net_amount;
//				disc_amount_5 = parseFloat(parseFloat(dataIn.items[i-1].merch_support_disc) / 100) * net_amount;
//				disc_amount_6 = parseFloat(parseFloat(dataIn.items[i-1].slog_disc) / 100) * net_amount;
//				total_discount = disc_amount_1 + disc_amount_2 + disc_amount_3 + disc_amount_4 + disc_amount_5 + disc_amount_6;
//				
//				discounted_amount = net_amount - total_discount;
				
				record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
				record.setLineItemValue('item', 'quantity', i, dataIn.items[i-1].qty);
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				
//				nlapiDisableLineItemField('item', 'custcol6', false);
//				nlapiDisableLineItemField('item', 'custcol7', false);
//				nlapiDisableLineItemField('item', 'custcol8', false);
//				nlapiDisableLineItemField('item', 'custcol9', false);
//				nlapiDisableLineItemField('item', 'custcol11', false);
//				nlapiDisableLineItemField('item', 'custcol12', false);
				
//				record.setLineItemValue('item', 'custcol6', i, dataIn.items[i-1].dist_disc); //discount 1
//				record.setLineItemValue('item', 'custcol7', i, parseFloat(dataIn.items[i-1].bo_allow_disc)); //discount 2
//				record.setLineItemValue('item', 'custcol8', i, dataIn.items[i-1].prompt_disc); //discount 3
//				record.setLineItemValue('item', 'custcol9', i, dataIn.items[i-1].tra_disc); //discount 4
//				record.setLineItemValue('item', 'custcol11', i, dataIn.items[i-1].merch_support_disc); //discount 5
//				record.setLineItemValue('item', 'custcol12', i, dataIn.items[i-1].slog_disc); //discount 6	
				
//				record.setLineItemValue('item', 'rate', i, dataIn.items[i-1].unit_price);
//				record.setLineItemValue('item', 'custcol32', i, dataIn.items[i-1].unit_price); //purchase price
//				record.setLineItemValue('item', 'amount', i, discounted_amount.toFixed(5));
//				record.setLineItemValue('item', 'custcol10', i, '1000');
				
				record.setLineItemValue('item', 'location', i, dataIn.items[i-1].receivinglocation);
				record.setLineItemValue('item', 'taxcode', i, '6');
			}
		}
		
		var id = nlapiSubmitRecord(record, null, true); //20
				
		nlapiLogExecution('ERROR', dataIn.externalid+'record created', 'record id - '+id);
		
		var record = nlapiLoadRecord(dataIn.type, id);
		return {
			'internalid':id, //po#
			'externalid':dataIn.externalid,
			'vendor':record.getFieldText('entity'),
			'department':record.getFieldText('department'),
			'principal':record.getFieldText('class'),
			'location':record.getFieldText('location'),
			'date':dataIn.date,
			'discount1':record.getLineItemValue('item','custcol7',1)
		};	
	} else if(dataIn.type=='returnauthorization') {	
		var OPERATION = 'custbody69';
		var EXTERNAL_INVOICE = 'custbody178';
		
		var record = nlapiCreateRecord(dataIn.type); //20
		
		record.setFieldValue('entity', dataIn.customer);
		//record.setFieldValue('orderstatus', dataIn.status);
		record.setFieldValue('trandate', dataIn.date);
		record.setFieldValue('memo', dataIn.memo);
		record.setFieldValue( OPERATION, dataIn.operation);
		record.setFieldValue('location', dataIn.location);
		record.setFieldValue('class', dataIn.principal);
		record.setFieldValue('department', '5'); // DEPARTMENT > BRANCHES : OPERAITONS : SALES
		record.setFieldValue(EXTERNAL_INVOICE, dataIn.external_invoice);
		
		var discounts = getCustomerDiscount(dataIn.customer, dataIn.principal);
		for(var i = 1, linecount = dataIn.items.length; i <= linecount; i++)
		{		
			record.setLineItemValue('item', 'item', i, dataIn.items[i-1].item);
			record.setLineItemValue('item', 'taxcode', i, '6');
			record.setLineItemValue('item', 'custcol35', i, dataIn.items[i-1].reason);
			
			// for PG //
			if(dataIn.principaltype=='procterandgamble')
			{
				record.setLineItemValue('item', 'quantity', i, '1');
				record.setLineItemValue('item', 'amount', i, dataIn.items[i-1].amount);
				var discamount = parseFloat(dataIn.items[i-1].discount/100 * dataIn.items[i-1].amount).toFixed(2);
				record.setLineItemValue('item','custcol6',  i, dataIn.items[i-1].discount); //discount 1
				record.setLineItemValue('item','custcol10',  i, discamount); //discount amount
			} else { // for NUTRIASIA, MONDELEZ				
				record.setLineItemValue('item', 'rate', i, parseFloat(dataIn.items[i-1].unit_price));
				record.setLineItemValue('item', 'amount', i, parseInt(dataIn.items[i-1].qty) * parseFloat(dataIn.items[i-1].unit_price)); //Net amount, not vat and discount 
				record.setLineItemValue('item', 'quantity', i, parseInt(dataIn.items[i-1].qty));
				record.setLineItemValue('item', 'units', i, dataIn.items[i-1].uom);
				record.setLineItemValue('item', 'custcol37', i, dataIn.items[i-1].bbd);
				setLineItemDiscount(record, i, discounts, dataIn);
				
			}
			
		}	
		var id = nlapiSubmitRecord(record, null, true); //20
				
//		nlapiLogExecution('ERROR', dataIn.externalid+'record created', 'record id - '+id);
		var record = nlapiLoadRecord(dataIn.type, id);
		return {
			'internalid':id, //ira#
			'externalid':dataIn.externalid,
			'customer':record.getFieldText('entity'),
			'department':record.getFieldText('department'),
			'principal':record.getFieldText('class'),
			'location':record.getFieldText('location'),
			'date':dataIn.date
		};
	}
}