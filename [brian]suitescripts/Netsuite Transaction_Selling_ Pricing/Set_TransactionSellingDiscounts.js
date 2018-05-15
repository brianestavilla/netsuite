	/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Sep 2016     Dranix
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
		CUSTOM_CUSTOMER = 'custbody144',
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
		ERR_MESSAGE = 'Input value for ',
		discrate1 = 0,
		discrate2 = 0,
		discrate3 = 0,
		discrate4 = 0,
		principal, customer, operation, location_val, discounts = 0;

function discount_FieldChanged(type, name, linenum) {
	
	/**
	**	GET DEPARTMENT, SALESREP
	**/
	
	if(name == ENTITY || name == CLASS) {
		var customer = (nlapiGetFieldValue('custbody144') != '') ? nlapiGetFieldValue('custbody144') : nlapiGetFieldValue('entity');
		var principal = nlapiGetFieldValue('class');
			
		if(customer != '' && principal != '') {
			var creditLimit = SELLING_API._GET_SALES_REP(customer, principal);
			
			if(creditLimit!=null) {
				nlapiSetFieldValue('salesrep', creditLimit);
				nlapiSetFieldValue('department', nlapiLookupField('employee', creditLimit,'department', false));	
			} else {
				nlapiSetFieldValue('salesrep', '');
				nlapiSetFieldValue('department', '');
			}
			
		}
	}
	
	/**
	**	GET DISCOUNT RATES
	**/
	
	if(name == ITEM) {
		nlapiSetCurrentLineItemValue(ITEM_SUBLIST, RATE, 0);
		nlapiSetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT, 0);
		
	    principal = nlapiGetFieldValue(CLASS);
		customer =  nlapiGetFieldValue(ENTITY);
		operation = nlapiGetFieldValue(OPERATION);
		location_val = nlapiGetFieldValue(LOCATION);
		var itemGroup = nlapiLookupField('inventoryitem', nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM), 'custitem95');
		
		if(principal == "") { alert(ERR_MESSAGE+'principal'); };
		if(customer == "") { alert(ERR_MESSAGE+'customer'); };
		if(operation == "") { alert(ERR_MESSAGE+'operation'); };
		if(location_val == "") { alert(ERR_MESSAGE+'location'); };
		
		if(principal != "" && customer != "" && operation != "" && location_val != "") {
			discounts = SELLING_API._GET_SELLING_DISCOUNT(customer, principal, operation, location_val);
			discrate1 = parseFloat(discounts.discount1);
			discrate2 = parseFloat(discounts.discount2);
			discrate3 = parseFloat(discounts.discount3);
			discrate4 = parseFloat(discounts.discount4);
			
			/**
			** 6 = PROMO NAI
			**/
			
			if(itemGroup == 6) {
				if(discrate1 > 0) {
					discrate1 = parseFloat(nlapiLookupField('inventoryitem',nlapiGetCurrentLineItemValue('item','item'), 'custitem100'));
				}
			}
			
			/**
			** 1 = BOTTLES, 4 = MSL
			**/
			
			if(itemGroup == 1 || itemGroup == 4) {
				discrate4 = parseFloat(discounts.discount4);
			} else { discrate4 = 0; }
			
			/**
			** 11 = DMPI FS, 5 = KIKKOMAN
			**/
			
			if(principal == 11 && itemGroup == 5) {
				discrate1 = 0;
				discrate2 = 0;
				discrate3 = 0;
				discrate4 = 0;
			}
			
			nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC1, discrate1);
	        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC2, discrate2);
	        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC3, discrate3);
	        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC4, discrate4);
		}
	}
}

function discount_ValidateLine(type) {
	if(type == 'item') {
		if(typeof(SELLING_API._GET_DISCOUNTING_ERROR_MSG()) != 'undefined') {
			if(SELLING_API._GET_DISCOUNTING_ERROR_MSG() != '') {
				alert(SELLING_API._GET_DISCOUNTING_ERROR_MSG()+' Please contact the administrator for assistance.');
				return false;
			}
		}
	}
	
	return true;
	
}

