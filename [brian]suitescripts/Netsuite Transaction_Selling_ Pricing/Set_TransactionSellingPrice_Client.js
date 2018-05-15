/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Sep 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
	var ENTITY = 'entity',
		CLASS = 'class',
		LOCATION = 'location',
		OPERATION = 'custbody69',
		ITEM = 'item',
		ITEM_SUBLIST = 'item',
		ITEM_CATEGORY = 'custitem7',
		QUANTITY = 'quantity',
		UNIT = 'units',
		GROSS_AMT = 'grossamt',
		RATE = 'rate',
		TO_SALESPRICE = 'custcol25',
		DISC1 = 'custcol6',
		DISC2 = 'custcol7',
		DISC3 = 'custcol8',
		DISC4 = 'custcol9',
		AMOUNT = 'amount',
		TAXRATE = 'taxrate1',
		SELLING_API = new SELLING_PRICING_API(),
		ERR_MESSAGE = 'Input Value for ',
		discamt1 = 0,
		discamt2 = 0,
		discamt3 = 0,
		discamt4 = 0,
		rate_val = 0,
		item, location_val, operation_val, price = 0, priceNoVAT = 0, unittype, conversion_rate = 0, units;

function price_FieldChanged(type, name, linenum) {
	
	/** SET DEFAULT VALUES, DISABLE FIELDS **/
	
	if(name == ITEM) {
		SELLING_API._DISABLE_FIELDS();
	}
	
	/** ENABLE ITEM FIELD IF PRINCIPAL, OPERATION, LOCATION, CUSTOMER IS NOT EMPTY **/
	
	if(name == ENTITY || name == CLASS || name == LOCATION || name == OPERATION) {
		var customer = (nlapiGetFieldValue('custbody144') != '') ? nlapiGetFieldValue('custbody144') : nlapiGetFieldValue('entity');
		var operation = nlapiGetFieldValue(OPERATION);
		var location = nlapiGetFieldValue(LOCATION);
		var principal = nlapiGetFieldValue(CLASS);
		
		if(customer == '' || operation =='' || principal == '' || location == '') {
			nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, true);
		} else { nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, false); }
		
	}
	
	/** COMPUTE NET AMOUNT, TOTAL DISCOUNTS **/
	
	if(name == UNIT || name == QUANTITY) {
		item_val = nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM);
		units_val = nlapiGetCurrentLineItemText(ITEM_SUBLIST, UNIT);
		location_val = nlapiGetFieldValue(LOCATION);
		operation_val = nlapiGetFieldValue(OPERATION),
		principal = nlapiGetFieldValue(CLASS);

		if(principal != 7) { //7 = PG;
			if(item_val != '' && location_val != '' && operation_val != '') {
				price = SELLING_API._GET_SELLING_PRICE(item_val, location_val, operation_val);
				if(price != null) {
					unittype = SELLING_API._GET_CONVERSION_FACTOR_UNIT_TYPE(item_val);
					if(unittype != null) {
						conversion_rate = SELLING_API._GET_CONVERSION_RATE(unittype.unitstype, units_val);
						priceNoVAT = parseFloat(price / 1.12).toFixed(10);
						rate_val = parseFloat(priceNoVAT * parseInt(conversion_rate)).toFixed(2);
						
						var delay = 0;
						if(name == UNIT) { delay = 10; }
						
						setTimeout(function(){
							nlapiSetCurrentLineItemValue(ITEM_SUBLIST, RATE, rate_val);
							
							discamt1 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC1));
							discamt2 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC2));
							discamt3 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC3));
							discamt4 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC4));
							
							var amount = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT)),
							discount = 0;
					        discount += ((amount - discount) * (discamt1/100));
					        discount += ((amount - discount) * (discamt2/100));
					        discount += ((amount - discount) * (discamt3/100));
					        discount += ((amount - discount) * (discamt4/100));
					        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, 'custcol10', discount);
					        
						}, delay);
						
					} else {
						
						SELLING_API._SET_DISCOUNTING_ERROR_MSG(SELLING_API._GET_DISCOUNTING_ERROR_MSG()+' No Unit Type Setup. ');
						alert('No Unit Type Setup. Kindly contact the adminstrator for assistance.');
					
					}
				} else {
					
					SELLING_API._SET_DISCOUNTING_ERROR_MSG(SELLING_API._GET_DISCOUNTING_ERROR_MSG()+' No Price Setup. ');
					alert('No Price Setup. Kindly contact the administrator for assistance.');
					nlapiSetCurrentLineItemValue(ITEM_SUBLIST, RATE, 0);
					nlapiSetCurrentLineItemValue(ITEM_SUBLIST, 'custcol10', 0);
					
				}
				
			} //endif
		} //endif
	} //endif

}

function price_validateLine(type) {
	if(type == 'item') {
		var discamt1 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC1)),
		discamt2 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC2)),
		discamt3 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC3)),
		discamt4 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC4));
		amount = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT)),
		discount = 0;
        
		discount += ((amount - discount) * (discamt1/100));
        discount += ((amount - discount) * (discamt2/100));
        discount += ((amount - discount) * (discamt3/100));
        discount += ((amount - discount) * (discamt4/100));
        
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, 'custcol10', discount);
	}
	
	return true;

}

function pageInitPrice(type) {
	/** SET DISABLED FIELDS **/
	SELLING_API._DISABLE_FIELDS();
	
	/** added 10/10/13. By Redem **/
    if(!(currentuser = nlapiGetUser()));
        warehouselocation = nlapiLookupField('employee', currentuser, 'custentity39');
        
    if(warehouselocation == null || warehouselocation == '') {
        alert('Please provide the Fulfillment Location from your record. Contact your administrator.');
    } else { nlapiSetFieldValue('location', warehouselocation); }
    
    /*********************/

    /** added 7/7/2015 By Brian **/

    if(nlapiGetFieldValue('custbody144')=='' || nlapiGetFieldValue('class')=='' || nlapiGetFieldValue('location')=='' || nlapiGetFieldValue('custbody69')=='') {
        nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, true);
    }
    
    /*************************/
    
    if(type == 'edit') {
    	nlapiDisableField('custbody144', 'T');
    	nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, false);
    }
       
}