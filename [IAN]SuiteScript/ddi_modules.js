function applyTransactionDiscount( rec ) {
	//constants;
	
	var BOOKING = '1', OSDO = '2', record = rec || nlapiGetNewRecord(),
		operation = record.getFieldValue('custbody69');
	
	if (operation === BOOKING || operation === OSDO){
			
		var discounts = getCustomerDiscount(record.getFieldValue('entity'), record.getFieldValue('class'));
	
		var lineCount = record.getLineItemCount('item');	
	
		for(var i =1; i<=lineCount; i++){
			setLineItemDiscount(record, i, discounts);
		
		}
		
	}
}

function setLineItemDiscount(record, i, discount, dataIn){
	
	if(!discount) return;
	
//	if(dataIn.principal=='3'){ //MONDELEZ
//		var discamount = 0;
//		var discrate = parseFloat(dataIn.items[i-1].discount) / 100;
//		var unDiscountedAmount = record.getLineItemValue('item', 'amount', i);
//		
//		discamount = unDiscountedAmount * discrate;
//		record.setLineItemValue('item','custcol7',i,dataIn.items[i-1].discount);
//		record.setLineItemValue('item', 'custcol10', i, (parseFloat(discamount)).toFixed(2));
//		
//	} else{ // OTHER PRINCIPAL

	//get undiscounted amount
	var unDiscountedAmount = record.getLineItemValue('item', 'amount', i);
	
	var balAmount = parseFloat(unDiscountedAmount), 
	totalDiscount=0, 
	discAmount=0, 
	disc1=0,
	disc2=0,
	disc3=0,
	disc4=0;
	
	record.setLineItemValue('item','custcol6', i, discount['trade'] * 100);
//	discAmount += balAmount * discount['trade'];
	disc1 = balAmount * discount['trade'];
	balAmount -= disc1;
	var itemgroup = nlapiLookupField('inventoryitem', dataIn.items[i-1].item, 'custitem95'); //item group
	
	record.setLineItemValue('item','custcol7', i, discount['bo'] * 100);
//	discAmount += balAmount * discount['bo'];
	disc2 = balAmount * discount['bo'];
	balAmount -= disc2;
	
	record.setLineItemValue('item','custcol8', i, discount['disc3'] * 100);
//	discAmount += balAmount * discount['disc3'];	
	disc3 = balAmount * discount['disc3'];
	balAmount -= disc3;
	
	if(itemgroup == '1' || itemgroup=='4') { //1 = bottles, 4 = MSL
		record.setLineItemValue('item','custcol9', i, discount['disc4'] * 100);
//		discAmount += balAmount * discount['disc4'];
		disc4 = balAmount * discount['disc4'];
		balAmount -= disc4;
	}
	
	totalDiscount = disc1 + disc2 + disc3 + disc4;
	//set value to discount amount column
	record.setLineItemValue('item', 'custcol10', i, (parseFloat(totalDiscount)).toFixed(8)); 
//	record.setLineItemValue('item', 'amount', i, balAmount);
	
//	}
}

function getCustomerDiscount(customer, principal){
	
	filters = new Array (
			new nlobjSearchFilter('custrecord30', null, 'anyof', principal), //Principal
			new nlobjSearchFilter('custrecord29', null, 'anyof', customer) //Customer
		);
	
		column = new Array(
				//new nlobjSearchColumn('custrecord758'), //Price List
				new nlobjSearchColumn('custrecord365'), //Discount 1
				new nlobjSearchColumn('custrecord362'), //Discount 2
				new nlobjSearchColumn('custrecord363'), //Discount 3
				new nlobjSearchColumn('custrecord364') //Discount 4
		);
	
		var search = nlapiSearchRecord('customrecord110', null, filters, column);		
		
		if(!search) return null;
		
		parseToDecimal = function(value){
			
			
			var rate = parseFloat(value.replace(/%/)) / 100;
						
			if(isNaN(rate)) return 0;
			
			return rate;
		};
		
		if(search){
			return {
				trade : parseToDecimal(search[0].getValue('custrecord365')),
				bo : parseToDecimal(search[0].getValue('custrecord362')),
				disc3 : parseToDecimal(search[0].getValue('custrecord363')),
				disc4 : parseToDecimal(search[0].getValue('custrecord364'))
			};
		}
		
		//return nlapiLogExecution('DEBUG','discount not found','customer: '+ nlapiGetFieldValue('entity'));
}

function getPricing(itemid, locationid, operationid)
{
    /******* ######### ------------------- START TRANSACTION PRICING SEARCH -------------------------########## ********/
        filters = new Array (
                new nlobjSearchFilter('custrecord13', null, 'anyof', itemid), //ITEM ID
                new nlobjSearchFilter('custrecord12', null, 'is', locationid),  //LOCATION ID
                //new nlobjSearchFilter(PRICELIST, null, 'is', pricelist),  //PRICELIST ID
                new nlobjSearchFilter('custrecord28', null, 'anyof', operationid) //OPERATION ID custrecord768
        );
        column = new Array(
                new nlobjSearchColumn('custrecord768', null, null)
        );
        itemPricing = nlapiSearchRecord('customrecord102', null, filters, column); // save search id : customsearch68
    /******* ######### ------------------- END TRANSACTION PRICING SEARCH -------------------------########## ********/
    return itemPricing;
}

function conversionRate(unitstype, unitname)
{
    filters = new Array (
                new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
                new nlobjSearchFilter('abbreviation', null, 'startswith', unitname)
        );

    search = nlapiSearchRecord('unitstype', null, filters,  new nlobjSearchColumn('conversionrate'));
    if(search!=null) {
    	return search[0].getValue('conversionrate');
    } else { return null; }
}

function customerCreditLimit(customer, principal) {
	filter = new Array(
			new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
			new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
	);
	
	columns = new Array(
			new nlobjSearchColumn('custrecord340'),	//Sales Rep Column
			new nlobjSearchColumn('custrecord152')
	);
	
	var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
	
	if(creditLimit!=null){
		return{
				"error_code" : 200,
				"salesrep" : creditLimit[0].getValue('custrecord340'),
				"customer":	creditLimit[0].getValue('custrecord152')
		};
	} else {
		return {
			"error_code":404,
			"message":"No Sales Representative and Credit Limit Setup for this Customer"
		};
	}
}