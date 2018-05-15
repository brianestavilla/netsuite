function beforeSubmit(type, form){
	
	if(nlapiGetFieldValue('customform') != '110')
	try{
		var record = nlapiGetNewRecord(),
			linecount = record.getLineItemCount(ITEM),
			discounts = 0,
			total_disc = 0
		;
	if(type == 'create' || type == 'edit'){
		ENTITY_VALUE =  record.getFieldValue(ENTITY);
		CLASS_VALUE =  record.getFieldValue(CLASS);
		for(var i = 1; i <= linecount; i++)
		{
			
			var discount = getDiscountPricing(ENTITY_VALUE, CLASS_VALUE);
			if(discount != null)
			{
				x1 = discount[0].getValue('custrecord365'); //Discount 1
				x2 = discount[0].getValue('custrecord362'); //Discount 2
				x3 = discount[0].getValue('custrecord363'); //Discount 3
				x4 = discount[0].getValue('custrecord364'); //Discount 4
				
				x1 = (x1 == null || x1 == '') ? 0 : parseFloat(x1)/100;
				x2 = (x2 == null || x2 == '') ? 0 : parseFloat(x2)/100;
				x3 = (x3 == null || x3 == '') ? 0 : parseFloat(x3)/100;
				x4 = (x4 == null || x4 == '') ? 0 : parseFloat(x4)/100;
				
				record.setLineItemValue(ITEM_SUBLIST, DISC1, i, x1 * 100);
				record.setLineItemValue(ITEM_SUBLIST, DISC2, i, x2 * 100);
				record.setLineItemValue(ITEM_SUBLIST, DISC3, i, x3 * 100);
				record.setLineItemValue(ITEM_SUBLIST, DISC4, i, x4 * 100);
				
				itemPricing = getPricing(discount[0].getValue('custrecord758'), i, record, record.getFieldValue(OPERATION));
				if(itemPricing != null)
				{
					price = itemPricing[0].getValue('custrecord768');
					price_no_vat = parseFloat((price)/ 1.12).toFixed(5);
					var units_type = getUnitsType(record.getLineItemValue(ITEM_SUBLIST, ITEM, i));
					var conversion_rate = conversionRate(units_type, record.getLineItemText(ITEM_SUBLIST, UNIT, i));
					record.setLineItemValue(ITEM_SUBLIST, RATE, i, (price_no_vat * parseInt(conversion_rate)));
					
					amount = parseFloat(record.getLineItemValue(ITEM_SUBLIST, GROSS_AMT, i));
					
					//d = (dis == null || dis == '') ? 0 : dis/100;
					discounts = 0;
					discounts += ((amount - discounts) * x1);
					discounts += ((amount - discounts) * x2);
					discounts += ((amount - discounts) * x3);
					discounts += ((amount - discounts) * x4);
					total_disc += discounts;
				 record.setLineItemValue(ITEM_SUBLIST, 'custcol10', i, discounts);
				}
			}
		}
		//UNCOMMENT THIS CODES TO ROLLBACK
/* 		nlapiLogExecution("Error", 'Line', record.findLineItemValue('item', 'item', '30362'));
		if(total_disc > 0 && type == 'create')
		{
			record.setLineItemValue(ITEM_SUBLIST, ITEM, linecount + 1, '30362');
			record.setLineItemValue(ITEM_SUBLIST, 'taxcode', linecount + 1, '5');
			record.setLineItemValue(ITEM_SUBLIST, AMOUNT, linecount + 1, total_disc * -1);
			record.setLineItemValue(ITEM_SUBLIST, RATE, linecount + 1, total_disc * -1); */
			
		nlapiLogExecution("Error", 'Line', record.findLineItemValue('item', 'item', '30362'));
		if(total_disc > 0 && type == 'create' && record.findLineItemValue('item', 'item', '30362') == -1)
		{
			record.setLineItemValue(ITEM_SUBLIST, ITEM, linecount + 1, '30362');
			record.setLineItemValue(ITEM_SUBLIST, 'taxcode', linecount + 1, '5');
			record.setLineItemValue(ITEM_SUBLIST, AMOUNT, linecount + 1, total_disc * -1);
			record.setLineItemValue(ITEM_SUBLIST, RATE, linecount + 1, total_disc * -1);
		}else if((type == 'edit' && record.findLineItemValue('item', 'item', '30362') > 0) && total_disc > 0){
			
			var line = record.findLineItemValue('item', 'item', '30362');
			record.setLineItemValue(ITEM_SUBLIST, ITEM, line, '30362');
			record.setLineItemValue(ITEM_SUBLIST, 'taxcode', line, '5');
			record.setLineItemValue(ITEM_SUBLIST, AMOUNT, line, total_disc * -1);
			record.setLineItemValue(ITEM_SUBLIST, RATE, line, total_disc * -1);
		}else if(type == 'edit' && total_disc > 0){
			record.setLineItemValue(ITEM_SUBLIST, ITEM, linecount + 1, '30362');
			record.setLineItemValue(ITEM_SUBLIST, 'taxcode', linecount + 1, '5');
			record.setLineItemValue(ITEM_SUBLIST, AMOUNT, linecount + 1, total_disc * -1);
			record.setLineItemValue(ITEM_SUBLIST, RATE, linecount + 1, total_disc * -1);
		}
		
		filter = new Array(
					new nlobjSearchFilter('custrecord152', null, 'is', ENTITY_VALUE),
					new nlobjSearchFilter('custrecord153', null, 'is', CLASS_VALUE)
			);
		columns = new Array(
				new nlobjSearchColumn('custrecord156'),	//Terms Column
				new nlobjSearchColumn('custrecord340')	//Sales Rep Column
		)
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		/******* ######### -------------------- END CUSTOMER SALES REP SEARCH -------------------------########## ********/
		if(creditLimit != null){
			record.setFieldValue('terms', creditLimit[0].getValue('custrecord156'));
			record.setFieldValue('salesrep', creditLimit[0].getValue('custrecord340'));
		}
	}
	}
catch(e){}
}

function beforeLoad(type){
	if(type == 'edit'){
		var record = nlapiGetNewRecord(),
			linecount = record.getLineItemCount(ITEM)
		;
		record.removeLineItem(ITEM, linecount);
	}
}

// For Transfer Order : Item Receipt Sales Price
function beforeRecordLoad1(type, form){
	try{
		var record = nlapiGetNewRecord(),
			linecount = record.getLineItemCount(ITEM),
			form_id = record.getFieldValue('customform'),
			from_to = record.getFieldValue('createdfrom')
		;

		if((type == 'create' || type == 'edit') && form_id == '166'){

            ENTITY_VALUE =  record.getFieldValue(ENTITY);
			CLASS_VALUE =  nlapiLookupField('transferorder', from_to, 'class', false);		
			operation_tran = '4';

			for(var i = 1; i <= linecount; i++)
			{
				var itemPricing = getPricing('', i, record, operation_tran);
				if(itemPricing != null)
				{
					price = itemPricing[0].getValue('custrecord768');
					//price_no_vat = parseFloat((price)/ 1.12).toFixed(5);
					price_no_vat = parseFloat((price)).toFixed(5);
					var conversion_rate = conversionFactor(record.getLineItemValue(ITEM_SUBLIST, ITEM, i));
					record.setLineItemValue(ITEM_SUBLIST, TO_SALESPRICE, i, (price_no_vat * parseInt(conversion_rate)));
				}else record.setLineItemValue(ITEM_SUBLIST, TO_SALESPRICE, i, 0.00);
			}
		}
	}
	catch(e){}
}

function getUnitsType(itemid){
	try{
		record = nlapiLookupField('inventoryitem', itemid, 'unitstype');
	}catch(e) {
		try{
			record = nlapiLookupField('noninventoryitem', itemid, 'unitstype');
		}catch(e){
			try{
				record = nlapiLookupField('otherchargeitem', itemid, 'unitstype');
			}catch(e){
				try{
					record = nlapiLookupField('paymentitem', itemid, 'unitstype');
				}catch(e){
					record = nlapiLookupField('serviceitem', itemid, 'unitstype');
				}
			}
		}
	}
	return record;
}

function getPricing(pricelist, i, record, operation)
{
	var itemPricing = null;
	if(record.getLineItemValue(ITEM_SUBLIST, ITEM, i) != '30362' ){
	/******* ######### ------------------- START TRANSACTION PRICING SEARCH -------------------------########## ********/
		filters = new Array (
				new nlobjSearchFilter('custrecord13', null, 'anyof', record.getLineItemValue(ITEM_SUBLIST, ITEM, i)),	//ITEM ID
				//new nlobjSearchFilter(PRICELIST, null, 'is', pricelist),	//PRICELIST ID
				new nlobjSearchFilter('custrecord28', null, 'anyof', operation)	//OPERATION ID custrecord768
		);
		if(operation == '4'){
			var location_text = record.getLineItemText(ITEM_SUBLIST, LOCATION, i).split(' : ');
			filters[2] = new nlobjSearchFilter('name', 'custrecord12', 'startswith', location_text[0]);
		}
		else 
			filters[2] = new nlobjSearchFilter('custrecord12', null, 'anyof', record.getFieldValue(LOCATION));
		column = new Array(
				new nlobjSearchColumn('custrecord768', null, null)
		);
		var itemPricing = nlapiSearchRecord('customrecord102', 'customsearch68', filters, column);
	/******* ######### ------------------- END TRANSACTION PRICING SEARCH -------------------------########## ********/
	}
	return itemPricing;
}

function getDiscountPricing(ENTITY_VALUE, CLASS_VALUE)
{
	/******* ######### -------------------- START CUSTOMER DISCOUNT SEARCH -------------------------########## ********/
		filters = new Array (
				new nlobjSearchFilter('custrecord30', null, 'anyof', CLASS_VALUE), //Principal
				new nlobjSearchFilter('custrecord29', null, 'anyof', ENTITY_VALUE) //Entity
		);
		column = new Array(
				//new nlobjSearchColumn('custrecord758'), //Price List
				new nlobjSearchColumn('custrecord365'), //Discount 1
				new nlobjSearchColumn('custrecord362'), //Discount 2
				new nlobjSearchColumn('custrecord363'), //Discount 3
				new nlobjSearchColumn('custrecord364') //Discount 4
		);
		search = nlapiSearchRecord('customrecord110', null, filters, column);
	/******* ######### ------------------- END CUSTOMER DISCOUNT SEARCH -------------------------########## ********/
	return search;

}
function conversionFactor(itemid){
	try{
		record = nlapiLookupField('inventoryitem', itemid, 'custitem72');
	}catch(e) {
		try{
			record = nlapiLookupField('noninventoryitem', itemid, 'custitem72');
		}catch(e){
			try{
				record = nlapiLookupField('otherchargeitem', itemid, 'custitem72');
			}catch(e){
				try{
					record = nlapiLookupField('paymentitem', itemid, 'custitem72');
				}catch(e){
					record = nlapiLookupField('serviceitem', itemid, 'custitem72');
				}
			}
		}
	}
	return record;
}

function conversionRate(unitstype, unitname){
	filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
				new nlobjSearchFilter('abbreviation', null, 'is', unitname)
		);

	search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
	return search[0].getValue('conversionrate');
}