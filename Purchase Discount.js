function fieldChange(type, name) {	
	if(name == 'units') {
			getPrice();
	}

	if(name == RATE || name == PURCHASE_PRICE) {
			var rate1 = nlapiGetCurrentLineItemValue(ITEM, RATE);
			purchaseprice = nlapiGetCurrentLineItemValue(ITEM, PURCHASE_PRICE);
			if(purchaseprice != null && purchaseprice != '') {
				var total_discount = getParseDiscount(DISCOUNT1) + getParseDiscount(DISCOUNT2) +getParseDiscount(DISCOUNT3)  +getParseDiscount(DISCOUNT4) + getParseDiscount(DISCOUNT5) + getParseDiscount(DISCOUNT6),
					purchase_disc = parseFloat(purchaseprice),
					discount = (purchase_disc * total_discount),
					discounted = purchase_disc - discount;
				var discounted = discounted.toFixed(5);
				//rate = discounted.substring(0, discounted.indexOf('.') + 3);
					nlapiSetCurrentLineItemValue(ITEM, TOTAL_DISCOUNT, discount.toFixed(5), false);	
					nlapiSetCurrentLineItemValue(ITEM, RATE, discounted, false);	
			} else {
				nlapiSetCurrentLineItemValue(ITEM, RATE, 0, false);	
			}
	}
}

function getPrice() {
	var itemid = nlapiGetCurrentLineItemValue(ITEM, ITEM),
		parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false),
		principal = nlapiGetFieldValue('class');

	if(parent_location != null && parent_location != '') {
		if(principal != '') {
			if(itemid != '') {
					
				if(principal!="7") {
					var load_discounts = getResults(itemid, parent_location, principal);
					if(load_discounts != null) {
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT1, load_discounts[0].getValue('custrecord736')); //discount1
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT2, load_discounts[0].getValue('custrecord737')); //discount2
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT3, load_discounts[0].getValue('custrecord738')); //discount3
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT4, load_discounts[0].getValue('custrecord739')); //discount4
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT5, load_discounts[0].getValue('custrecord740')); //discount5
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT6, load_discounts[0].getValue('custrecord741')); //discount6
						
						// var unitstype = getFieldID(itemid, 'unitstype');
						// conversionrate = getFieldID(itemid, 'custitem72');

						var getConversionFactorUnitType = getConversionFactorANDUnitType(itemid);

						var price_piece = parseFloat(load_discounts[0].getValue('custrecord744')) / getConversionFactorUnitType.conversionfactor;
						conversion_rate = conversionRate(getConversionFactorUnitType.unitstype, nlapiGetCurrentLineItemText('item', 'units'));
						price = price_piece * conversion_rate;
						nlapiSetCurrentLineItemValue(ITEM, 'custcol32', price); //Purchase Price

					
						var total_discount = getParseDiscount(DISCOUNT1) + getParseDiscount(DISCOUNT2) +getParseDiscount(DISCOUNT3)  +getParseDiscount(DISCOUNT4) + getParseDiscount(DISCOUNT5) + getParseDiscount(DISCOUNT6),
							discount = (price * total_discount),
							discounted = price - discount;
						var discounted = discounted.toFixed(5);
						
						nlapiSetCurrentLineItemValue(ITEM, TOTAL_DISCOUNT, discount.toFixed(5), false);	
						nlapiSetCurrentLineItemValue(ITEM, RATE, discounted, false);	
						

					} else { alert('No Purchase price found.'); }
				}
			} else { alert('No Item Choosen'); }
		} else { alert('No Principal Choosen'); }
	} else {
		alert('Currently, you have no reporting branch');
		nlapiSetCurrentLineItemValue(ITEM, PURCHASE_PRICE, 0, false);
		nlapiSetCurrentLineItemValue(ITEM, RATE, 0, false);
	}
}

function validateLine_script(){
	// if(nlapiGetCurrentLineItemValue(ITEM, PURCHASE_PRICE) == null || nlapiGetCurrentLineItemValue(ITEM, PURCHASE_PRICE) == '') {
	// 	return false;
	// } else { return true; };
	
	//var itemid = nlapiGetCurrentLineItemValue(ITEM, ITEM),
		//parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false),
		//principal = nlapiGetFieldValue('class');

	// if(parent_location != '') {
	// 	if(principal != '') {
	// 		if(itemid != '') {
				getPrice();
				return true;
	// 		} else {
	// 			alert('No Item Selected');
	// 			return false;
	// 		}

	// 	} else {
	// 		alert('No Principal Selected');
	// 		return false;
	// 	}
		
	// } else {
	// 	alert('Currently, you have no reporting branch');
	// 	return false;
	// }

}

function disable(){
	//nlapiDisableLineItemField('item', 'units', true);
	nlapiDisableLineItemField('item', 'description', true);
	//nlapiDisableLineItemField('item', 'rate', true);
	nlapiDisableLineItemField('item', 'amount', true);
	nlapiDisableLineItemField('item', 'grossamt', true);
	nlapiDisableLineItemField('item', 'tax1amt', true);
	nlapiDisableLineItemField('item', 'custcol29', true);
	nlapiDisableLineItemField('item', 'custcol28', true);
	
  	//if(nlapiGetFieldValue('class')==7) {
      nlapiDisableLineItemField('item', 'custcol10', false);
    //} else { nlapiDisableLineItemField('item', 'custcol10', true); }
}

function getParseDiscount(column) {
	var discount =(nlapiGetCurrentLineItemValue(ITEM, column) == null || nlapiGetCurrentLineItemValue(ITEM, column) == '') ? 0 : parseFloat(nlapiGetCurrentLineItemValue(ITEM, column))/100;
	return discount;
}

function conversionRate(unitstype, unitname) {
	filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
				new nlobjSearchFilter('abbreviation', null, 'startswith', unitname)
		);

	search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
	return search[0].getValue('conversionrate');
}

function getConversionFactorANDUnitType(itemid) {
	var filters = new Array (
		new nlobjSearchFilter('internalid', null, 'anyof', itemid)
	);
	
	var columns = new Array (
		new nlobjSearchColumn('unitstype'),
		new nlobjSearchColumn('custitem72')
	);

	search = nlapiSearchRecord('inventoryitem',null, filters, columns);
	if(search!=null) {
		return {
			'conversionfactor' : search[0].getValue('custitem72'),
			'unitstype' : search[0].getValue('unitstype')
		};
	} else { 
		return {
			'conversionfactor' : 0,
			'unitstype' : null
		};
	}
}

function getFieldID(itemid, field_id) {
	try{
		record = nlapiLookupField('inventoryitem', itemid, field_id);
	}catch(e) {
		try{
			record = nlapiLookupField('noninventoryitem', itemid, field_id);
		}catch(e){
			try{
				record = nlapiLookupField('otherchargeitem', itemid, field_id);
			}catch(e){
				try{
					record = nlapiLookupField('paymentitem', itemid, field_id);
				}catch(e){
					record = nlapiLookupField('serviceitem', itemid, field_id);
				}
			}
		}
	}
	return record;
}

function getResults(itemid, parent_location, principal) {
	var columns = new Array (
			new nlobjSearchColumn('custrecord743'),
			new nlobjSearchColumn('custrecord736'),//d1
			new nlobjSearchColumn('custrecord737'),//d2
			new nlobjSearchColumn('custrecord738'),//d3
			new nlobjSearchColumn('custrecord739'),//d4
			new nlobjSearchColumn('custrecord740'),//d5
			new nlobjSearchColumn('custrecord741'),//d6
			new nlobjSearchColumn('custrecord744')//purchase price
	);

	var filter = new Array (
		new nlobjSearchFilter('custrecord742', null, 'anyof', itemid),
		new nlobjSearchFilter('custrecord802', null, 'anyof', principal),
		new nlobjSearchFilter('custrecord743', null, 'anyof', parent_location)
	);

	var results = nlapiSearchRecord('customrecord252', null, filter, columns);
	return results;
}