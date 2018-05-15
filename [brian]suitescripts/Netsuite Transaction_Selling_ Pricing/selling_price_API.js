/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Sep 2016     Brian
 *
 */

var SELLING_PRICING_API = function() {
	var filters, columns;
	
	/** GET LOCATION PRICING OF THE ITEM(S) **/
	this._GET_SELLING_PRICE = function (item, location, operation) {
		if(item == '' || item == null) return null;
		if(location == '' || location == null) return null;
		if(operation == '' || operation == null) return null;
		
        filters = [
            new nlobjSearchFilter('custrecord13', null, 'anyof', item), //ITEM ID
            new nlobjSearchFilter('custrecord12', null, 'is', location),  //LOCATION ID
            new nlobjSearchFilter('custrecord28', null, 'anyof', operation), //OPERATION ID custrecord768  //LOCATION ID
            new nlobjSearchFilter('isinactive', null, 'is', 'F')
        ];
        
        columns = new nlobjSearchColumn('custrecord768');
        itemPricing = nlapiSearchRecord('customrecord102', 'customsearch68', filters, columns);
        
        if(itemPricing != null) {
        	return itemPricing[0].getValue('custrecord768');
        } else { return null; }
        
	};
	
	/** GET DISCOUNT(S) OF THE ITEM(S) **/
	this._GET_SELLING_DISCOUNT = function (customer, principal, operation, location) {
		if(customer == '' || customer == null) return { "discount1" : 0, "discount2" : 0, "discount3" : 0, "discount4" : 0 };
		if(principal == '' || principal == null) return { "discount1" : 0, "discount2" : 0, "discount3" : 0, "discount4" : 0 };
		if(operation == '' || operation == null) return { "discount1" : 0, "discount2" : 0, "discount3" : 0, "discount4" : 0 };
		
        filters = [
            new nlobjSearchFilter('custrecord30', null, 'anyof', principal),
            new nlobjSearchFilter('custrecord29', null, 'anyof', customer),
            new nlobjSearchFilter('custrecord_disc_prin_operation', null, 'anyof', operation),
            new nlobjSearchFilter('custrecord754', null, 'anyof', location),
            new nlobjSearchFilter('isinactive', null, 'anyof', 'F')
        ];
        
        columns = [
            new nlobjSearchColumn('custrecord365'), //Discount 1
            new nlobjSearchColumn('custrecord362'), //Discount 2
            new nlobjSearchColumn('custrecord363'), //Discount 3
            new nlobjSearchColumn('custrecord364') //Discount 4
        ];
        
        search = nlapiSearchRecord('customrecord110', null, filters, columns);
        if(search != null) {
        	
        	this._SET_DISCOUNTING_ERROR_MSG('');
        	return {
            	"discount1" : (search[0].getValue('custrecord365') == '') ? 0 : search[0].getValue('custrecord365'),
            	"discount2" : (search[0].getValue('custrecord362') == '') ? 0 : search[0].getValue('custrecord362'),
            	"discount3" : (search[0].getValue('custrecord363') == '') ? 0 : search[0].getValue('custrecord363'),
            	"discount4" : (search[0].getValue('custrecord364') == '') ? 0 : search[0].getValue('custrecord364')
            };
            
        } else {
        	
        	this._SET_DISCOUNTING_ERROR_MSG('No Discounting and Pricelist Setup.');
        	alert('No Discounting and Pricelist Setup. Kindly contact the administrator for assistance.');
        	return { "discount1" : 0, "discount2" : 0, "discount3" : 0, "discount4" : 0 };
        
        }

	};
	
	/** GET UNIT TYPE, CONVERSION FACTOR, CONVERSION RATE **/
	this._GET_ITEM_UNIT_TYPE_CONVERSION_FACTOR_CONVERSION_RATE = function(item) {
		
	};
	
	/** GET CONVERSION FACTOR & UNIT TYPE **/
	this._GET_CONVERSION_FACTOR_UNIT_TYPE = function (item) {
		if(item == '' || item == null) return null;
		var result = nlapiLookupField('inventoryitem', item, ['unitstype','custitem72'], false);
		if(result != null) {
			return {
				"unitstype" : result.unitstype,
				"conversionfactor" : result.custitem72
			};	
		} else { return null; }
	};
	
	/** GET CONVERSION RATE  **/
	this._GET_CONVERSION_RATE = function (unitstype, unitname) {
		filters = new Array (
	                new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
	                new nlobjSearchFilter('abbreviation', null, 'is', unitname)
	        );
		columns = new Array (new nlobjSearchColumn('conversionrate'));
		
	    var search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters, columns);
	  
	    if(search != null && search[0].getValue('conversionrate') != '') {
		    return search[0].getValue('conversionrate');    	
	    } else { return 0; }

	};
	
	/** GET SALES REP **/
	this._GET_SALES_REP = function(customer, principal) {
		filter = [
			new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
			new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
		];
		
		columns = new nlobjSearchColumn('custrecord340'); //Sales Rep
		
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		if(creditLimit != null && creditLimit[0].getValue('custrecord340')!='') {
			return creditLimit[0].getValue('custrecord340');
		} else { return null; }
	};
	
	this._DISABLE_FIELDS = function() {
		nlapiDisableLineItemField(ITEM_SUBLIST, AMOUNT, true);
	    nlapiDisableLineItemField(ITEM_SUBLIST, GROSS_AMT, true);
	    nlapiDisableLineItemField(ITEM_SUBLIST, DISC1, true);
	    nlapiDisableLineItemField(ITEM_SUBLIST, DISC2, true);
	    nlapiDisableLineItemField(ITEM_SUBLIST, DISC3, true);
	    nlapiDisableLineItemField(ITEM_SUBLIST, DISC4, true);
	    nlapiDisableLineItemField(ITEM_SUBLIST, 'tax1amt', true);
		nlapiDisableLineItemField(ITEM_SUBLIST, 'description', true);
	    
	    if(nlapiGetFieldValue('customform') == 170 || nlapiGetFieldValue('class') == 7) {
	    	/** 170 = free goods; 7 = PG; **/
		    nlapiDisableLineItemField(ITEM_SUBLIST, RATE, false);
		    nlapiDisableLineItemField(ITEM_SUBLIST, 'custcol10', false); // discount amount
		} else {
			nlapiDisableLineItemField(ITEM_SUBLIST, RATE, true);
		    nlapiDisableLineItemField(ITEM_SUBLIST, 'custcol10', true); // discount amount
		}
	};

	/** SET ERROR MESSAGES **/
	this._SET_DISCOUNTING_ERROR_MSG = function(dmsg) {
		this.disc_msg = dmsg;
	};
	
	/** GET ERROR MESSAGES **/
	this._GET_DISCOUNTING_ERROR_MSG = function() {
		return this.disc_msg;
	};

};