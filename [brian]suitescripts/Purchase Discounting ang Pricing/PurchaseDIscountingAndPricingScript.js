/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Mar 2017     BRIAN ESTAVILLA
 *
 */

var PURCHASE_DISCOUNTING_PRICING = new PURCHASE_DISCOUNTING_PRICING_API();


function clientPageInitDiscountingAndPricing(type){
	var user_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false);
	
	PURCHASE_DISCOUNTING_PRICING._SET_USER_LOCATION(user_location);
}


function clientFieldChangedDiscountingAndPricing(type, name, linenum){
	if(name == 'class') {
		alert(PURCHASE_DISCOUNTING_PRICING._GET_USER_LOCATION());
	}
}
