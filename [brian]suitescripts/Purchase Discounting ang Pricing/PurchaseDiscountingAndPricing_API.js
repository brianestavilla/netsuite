/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Mar 2017     BRIAN ESTAVILLA
 *
 */

var PURCHASE_DISCOUNTING_PRICING_API = function() {
	var user_location = '',
		conversion_rate = '',
		conversion_factor = '',
		unit_type = '';
	
	/** SET DEFAULT VALUES **/
	this._INIT_VALUES = function () {
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
	
	/** GET CUSTOMER DISCOUNTS AND PURCHASE PRICE **/
	this._GET_CUSTOMER_DISCOUNTS_PURCHASE_PRICE = function(item, location, principal) {
		
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
				new nlobjSearchFilter('custrecord743', null, 'anyof', location)
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
	
	/** GET CONVERSION RATE **/
	this._GET_CONVERSION_RATE = function(unitstype, unitname) {
		filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
				new nlobjSearchFilter('abbreviation', null, 'is', unitname)
		);

		search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
		return search[0].getValue('conversionrate');
	};
	
	/** GET UNIT TYPE AND CONVERSION FACTOR **/
	this._GET_ITEM_UNIT_TYPE_CONVERSION_FACTOR = function(item) {
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
				'conversionFactor': results[0].getValue('custitem72')
			};
		} else { return null; }
	};
	
	/** SETTERS **/
	this._SET_USER_LOCATION = function(location) {
		this.user_location = location;
	};

	this._SET_CONVERSION_RATE = function(crate) {
		this.conversion_rate = crate;
	};

	this._SET_CONVERSION_FACTOR = function(cfactor) {
		this.conversion_factor = cfactor;
	};

	this._SET_UNIT_TYPE = function(unittype) {
		this.unit_type = unittype;
	};
	
	/** GETTERS **/
	this._GET_USER_LOCATION = function() {
		return this.user_location;
	};
	
	this._GET_CONVERSION_RATE = function() {
		return this.conversion_rate;
	};
	
	this._GET_CONVERSION_FACTOR = function() {
		return this.conversion_factor;
	};
	
	this._GET_UNIT_TYPE = function() {
		return this.unit_type;
	};
	
};