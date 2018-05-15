/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Dec 2015     Brian
 *
 */


function DMPI_MPI_GLB_fieldChange(type, name) {
	if(name=='units') {
		if(nlapiGetFieldValue('class')=='3' ||
			nlapiGetFieldValue('class')=='10' ||
			nlapiGetFieldValue('class')=='1'  ||
			nlapiGetFieldValue('class')=='11' ||
			nlapiGetFieldValue('class')=='118') { // MONDELEZ=3; DELMONTE GT=10; DELMONTE=1; DELMONTE FS=11; GLOBE=118;
			
			POMDG.initValues();
		
		}
//		else {
//			if(nlapiGetFieldValue('customform')=='116') {
//				var principal = nlapiGetFieldValue('class');
//				if(principal!='') {
//					if(principal != 7) {
//						getPrice();
//						var rate1 = nlapiGetCurrentLineItemValue(ITEM, RATE);
//						purchaseprice = nlapiGetCurrentLineItemValue(ITEM, PURCHASE_PRICE);
//						if(purchaseprice != null && purchaseprice != '') {
//							var total_discount = getParseDiscount(DISCOUNT1) + getParseDiscount(DISCOUNT2) +getParseDiscount(DISCOUNT3)  +getParseDiscount(DISCOUNT4) + getParseDiscount(DISCOUNT5) + getParseDiscount(DISCOUNT6),
//								purchase_disc = parseFloat(purchaseprice),
//								discount = (purchase_disc * total_discount),
//								discounted = purchase_disc - discount;
//							var discounted = discounted.toFixed(5);
//							//rate = discounted.substring(0, discounted.indexOf('.') + 3);
//								nlapiSetCurrentLineItemValue(ITEM, TOTAL_DISCOUNT, discount.toFixed(5), false);	
//								nlapiSetCurrentLineItemValue(ITEM, RATE, discounted, false);	
//						} else { nlapiSetCurrentLineItemValue(ITEM, RATE, 0, false); }
//					}
//				} else { alert('Kindly Choose Principal'); }
//			}
//		}
	}
}

/**
* FREE GOODS LOCATION
* tacloban mondelez = 1655
* paknaan mondelez = 1577
* new paknaan mondelez = 2004
* new tacloban mondelez = 1908
* new paknaan dmpi fs = 2000
* new paknaan dmpi gt = 1986
* new tacloban dmpi gt = 1879
**/

function DMPI_MPI_GLB_validateLine(type) {
    if(type == 'item') {
		if(nlapiGetFieldValue('location') == 1655 ||
           nlapiGetFieldValue('location') == 1577 ||
           nlapiGetFieldValue('location') == 2004 ||
           nlapiGetFieldValue('location') == 1908 ||
           nlapiGetFieldValue('location') == 2000 ||
           nlapiGetFieldValue('location') == 1986 ||
           nlapiGetFieldValue('location') == 1879) {
                POMDG.initValues(); // set rate, amount, discounts to zero;
        } else {
            if(nlapiGetFieldValue('customform') == 116 || nlapiGetFieldValue('customform') == 103) { // 116=DDI Trade PO; 103=DDI Vendor Bill - Trade

                if(nlapiGetFieldValue('class') == 3 ||
                   nlapiGetFieldValue('class') == 10 ||
                   nlapiGetFieldValue('class') == 1  ||
                   nlapiGetFieldValue('class') == 11 ||
                   nlapiGetFieldValue('class') == 118) { // MONDELEZ=3; DELMONTE GT=10; DELMONTE=1; DELMONTE FS=11; GLOBE=118;

                        parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false);
                        POMDG.computeAmountDue(nlapiGetCurrentLineItemValue('item', 'item'),parent_location, nlapiGetFieldValue('class'));

                } else {
                    getPrice();
                }

            }
        }
    }

	return true;
}

var POMDG = new function () {
	this.initValues = function () {
		nlapiSetCurrentLineItemValue('item', 'custcol6', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol7', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol8', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol9', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol11', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol12', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol32', 0);
		nlapiSetCurrentLineItemValue('item', 'rate', 0);
		nlapiSetCurrentLineItemValue('item', 'amount', 0);
		nlapiSetCurrentLineItemValue('item', 'custcol10', 0);
	};
	
	//----------------------------------------------------//
	this.computeAmountDue = function(item, location, principal) {
		var discamt1 = 0,
			discamt2 = 0,
			discamt3 = 0,
			discamt4 = 0,
			discamt5 = 0,
			discamt6 = 0,
			total_discount = 0,
			gross = 0;
		
		var discounts = POMDG.getCustomerDiscounts(item, location, principal);
		if(discounts!=null) {
			var unitTypeAndConversionRate = POMDG.getItemUnitTypeConversionRate(item);
			var price_piece = parseFloat(discounts.purchase_price) / parseFloat(unitTypeAndConversionRate.conversionRate); //Compute Purchase price in pieces
			conversion_rate = POMDG.getConversionRate(unitTypeAndConversionRate.unitType, nlapiGetCurrentLineItemText('item', 'units')); //gets the Conversion factor based on the unit selected
			price = (price_piece * conversion_rate).toFixed(10); //Compute purchase price based on units
			
			gross = parseFloat(price * nlapiGetCurrentLineItemValue('item', 'quantity')).toFixed(10);
			
			discamt1 = parseFloat(parseFloat(discounts.dist_disc)/100) * gross;
			gross-=discamt1;
			discamt2 = parseFloat(parseFloat(discounts.bo_allow)/100) * gross;
			gross-=discamt2;
			discamt3 = parseFloat(parseFloat(discounts.prompt_disc)/100) * gross;
			gross-=discamt3;
			discamt4 = parseFloat(parseFloat(discounts.tra)/100) * gross;
			gross-=discamt4;
			discamt5 = parseFloat(parseFloat(discounts.merch_support)/100) * gross;
			gross-=discamt5;
			discamt6 = parseFloat(parseFloat(discounts.slog_disc)/100) * gross;
			gross-=discamt6;
			
			total_discount = discamt1 + discamt2 + discamt3 + discamt4 + discamt5 + discamt6;
			nlapiSetCurrentLineItemValue('item', 'custcol6', discounts.dist_disc);
			nlapiSetCurrentLineItemValue('item', 'custcol7', discounts.bo_allow);
			nlapiSetCurrentLineItemValue('item', 'custcol8', discounts.prompt_disc);
			nlapiSetCurrentLineItemValue('item', 'custcol9', discounts.tra);
			nlapiSetCurrentLineItemValue('item', 'custcol11', discounts.merch_support);
			nlapiSetCurrentLineItemValue('item', 'custcol12', discounts.slog_disc);
			nlapiSetCurrentLineItemValue('item', 'custcol32', price);
			//nlapiSetCurrentLineItemValue('item', 'rate', price);
          	nlapiSetCurrentLineItemValue('item', 'rate', parseFloat(gross / nlapiGetCurrentLineItemValue('item', 'quantity')));
			nlapiSetCurrentLineItemValue('item', 'amount', gross.toFixed(2));
			nlapiSetCurrentLineItemValue('item', 'custcol10', total_discount.toFixed(10));
		}

	};
	//----------END COMPUTE AMOUNT DUE----------------//
	
	//----------------------------------------------------//
	this.getCustomerDiscounts = function(item, location, principal) {
		
		var columns = [
				new nlobjSearchColumn('custrecord736'),//dist disc
				new nlobjSearchColumn('custrecord737'),//bo allow
				new nlobjSearchColumn('custrecord738'),//prompt disc
				new nlobjSearchColumn('custrecord739'),//tra
				new nlobjSearchColumn('custrecord740'),//merch and support
				new nlobjSearchColumn('custrecord741'),//slog disc
				new nlobjSearchColumn('custrecord744')//purchase price
			];
		
		var filter = [
				new nlobjSearchFilter('custrecord742', null, 'is', item),
				new nlobjSearchFilter('custrecord802', null, 'anyof', principal),
				new nlobjSearchFilter('custrecord743', null, 'anyof', location),
				new nlobjSearchFilter('isinactive', null, 'is', 'F')
			];
			
		var results = nlapiSearchRecord('customrecord252', null, filter, columns); //Executes Query and returns the query results
		
		if(results!=null) {
			return {
				'dist_disc':( results[0].getValue('custrecord736') == null || results[0].getValue('custrecord736')=='' ) ? 0 : results[0].getValue('custrecord736'),
				'bo_allow':( results[0].getValue('custrecord737') == null || results[0].getValue('custrecord737')=='' ) ? 0 : results[0].getValue('custrecord737'),
				'prompt_disc':( results[0].getValue('custrecord738') == null || results[0].getValue('custrecord738')=='' ) ? 0 : results[0].getValue('custrecord738'),
				'tra':( results[0].getValue('custrecord739') == null || results[0].getValue('custrecord739')=='' ) ? 0 : results[0].getValue('custrecord739'),
				'merch_support':( results[0].getValue('custrecord740') == null || results[0].getValue('custrecord740')=='' ) ? 0 : results[0].getValue('custrecord740'),
				'slog_disc':( results[0].getValue('custrecord741') == null || results[0].getValue('custrecord741')=='' ) ? 0 : results[0].getValue('custrecord741'),
				'purchase_price':results[0].getValue('custrecord744')
			};
			
		} else { return null; }
		
	};
	//----------END GET CUSTOMER DISCOUNTS----------------//
	
	//----------------------------------------------------//
	this.getConversionRate = function(unitstype, unitname) {
		filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
				new nlobjSearchFilter('abbreviation', null, 'is', unitname)
		);

		search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
		return search[0].getValue('conversionrate');
	};
	//----------END GET CONVERSION RATE----------------//
	
	//----------------------------------------------------//
	this.getItemUnitTypeConversionRate = function(item) {
		var columns = [
						new nlobjSearchColumn('unitstype'), //unit type
						new nlobjSearchColumn('custitem72') //conversion factor
					  ];
		var filter = [
		              	new nlobjSearchFilter('internalid', null, 'is', item)
		             ];
		var results = nlapiSearchRecord('inventoryitem', null, filter, columns);
		if(results != null) {
			return {
				'unitType': results[0].getValue('unitstype'),
				'conversionRate': results[0].getValue('custitem72')
			};
		} else { return null; }
	};
	//----------END GET ITEM UNIT TYPE AND CONVERSION RATE----------------//
};

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
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT1, load_discounts[0].getValue('custrecord736') || 0); //discount1
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT2, load_discounts[0].getValue('custrecord737') || 0); //discount2
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT3, load_discounts[0].getValue('custrecord738') || 0); //discount3
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT4, load_discounts[0].getValue('custrecord739') || 0); //discount4
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT5, load_discounts[0].getValue('custrecord740') || 0); //discount5
						nlapiSetCurrentLineItemValue(ITEM, DISCOUNT6, load_discounts[0].getValue('custrecord741') || 0); //discount6
						
						// var unitstype = getFieldID(itemid, 'unitstype');
						// conversionrate = getFieldID(itemid, 'custitem72');

						var getConversionFactorUnitType = getConversionFactorANDUnitType(itemid);

						var price_piece = parseFloat(load_discounts[0].getValue('custrecord744')) / getConversionFactorUnitType.conversionfactor;
						conversion_rate = conversionRate(getConversionFactorUnitType.unitstype, nlapiGetCurrentLineItemText('item', 'units'));
						price = price_piece * conversion_rate;
                      
						nlapiSetCurrentLineItemValue(ITEM, 'custcol32', price); //Purchase Price

                      	if(principal == 6) { // 6 = MONDE NISSIN; added by Brian 2/4/2017; for comparing purposes;
	                        nlapiSetCurrentLineItemValue(ITEM, 'custcol24', parseFloat(price * 1.12)); //rate w/VAT
                        }

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