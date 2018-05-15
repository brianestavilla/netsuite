/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Jul 2014     IAN
 *
 */

var DDIns = new function(){
	/**
	 * 
	 * @author IAN
	 * GET inventory item selling price
	 * 
	 * @param {integer} item id
	 * @param {integer} location id
	 * @param {integer} operation id
	 * 
	 * @return price of specific item 
	 */
	this.getItemPrice = function( item, location, operation){
		
		filters = new Array (
				new nlobjSearchFilter('custrecord13', null, 'anyof', item),	
				new nlobjSearchFilter('custrecord12', null, 'is', location),
				new nlobjSearchFilter('custrecord28', null, 'anyof', operation)
		);
		
		column = new Array(
				new nlobjSearchColumn('custrecord768')
		);
		
		return nlapiSearchRecord('customrecord102', null, filters, column);
	};
	
	/**
	 * 
	 * @author IAN
	 * GET inventory item unit type
	 * 
	 * @param {integer} item id
	 * 
	 * @returns item unit type id
	 */
	this.getInventoryItemUnitType = function(itemid){
		return nlapiLookupField('inventoryitem', itemid, 'unitstype');
	};
	
	/**
	 * 
	 * @author IAN
	 * SET item discount per line(DISC1, DISC2, DISC3, DISC4) 07/26/14
	 * 
	 * @param {array} discounts{discount1,discount2, discount3, discount4}
	 * @param {int} linenum Line item index
	 * 
	 * @returns void
	 */
	
	this.setLineItemDiscount = function( discounts , linenum){
		
		nlapiLineItemValue('item', 'custcol6', linenum, discounts.discount1);
		nlapiLineItemValue('item', 'custcol7', linenum, discounts.discount2);
		nlapiLineItemValue('item', 'custcol8', linenum, discounts.discount3);
		nlapiLineItemValue('item', 'custcol9', linenum, discounts.discount4);
	};
	
	/**
	 * 
	 * @author IAN
	 * GET customer discount 07/26/14
	 * 
	 * @param {int} principal Internal id of principal
	 * @param {int} customer Internal id of customer
	 * 
	 * @returns {object} discounts Set of discounts for specific customer
	 */
	this.getCustomerDiscount = function( principal, customer){
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
		
		search = nlapiSearchRecord('customrecord110', null, filters, column);		
	
		discounts = {
			"discount1" : search[0].getValue('custrecord365'),
			"discount2" : search[0].getValue('custrecord362'),
			"discount3" : search[0].getValue('custrecord363'),
			"discount4" : search[0].getValue('custrecord364')
		};
		
		return discounts;
	};
	
	/**
	 * @author IAN
	 * 
	 * GET customer credit information 07/26/14
	 * 
	 * @param {int} principal Internal id of principal
	 * @param {int} customer Internal id of customer
	 * 
	 * @returns {object} creditInfo Credit Information for specific customer
	 */
	this.getCustomerCreditInfo = function( principal, customer){
		
		filter = new Array(
					new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
					new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
			);
		columns = new Array(
				new nlobjSearchColumn('custrecord156'),	//Terms Column
				new nlobjSearchColumn('custrecord340')	//Sales Rep Column
		);
		
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		
		//nlapiLogExecution('Debug',customer + ':terms', creditLimit[0].getValue('custrecord156') || null);
		//nlapiLogExecution('Debug',customer + ':salesrep', creditLimit[0].getValue('custrecord340') || null);
		if(creditLimit != null) {
          return {
				"terms" : (creditLimit!=null) ? creditLimit[0].getValue('custrecord156') : '',
          	    "salesrep" : creditLimit[0].getValue('custrecord340') || ''
			};
        } else { return { 'terms':'', 'salesrep':'' }; }
		
	};
	
	/**
	 * @author IAN
	 * 
	 * Parse number to percentage rate 07/26/14
	 * 
	 * @param {int} number Number value
	 * @param {float} percent Percent value
	 * 
	 * @returns Rate
	 */
	this.parseToRate = function(number, percent){
		
		percent = parseFloat(percent)/100;
		
		var retval = parseFloat(number) * percent;
		
		return retval;
	};
};