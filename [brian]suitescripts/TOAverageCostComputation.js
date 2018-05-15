/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Feb 2016     user
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLineTOAverageCost(type){
	
	var location, principal, item, quantity, units, amount, unit_type, conversionrate, price, net, purchase_price, conversion_factor;
	
	var custom_form = nlapiGetFieldValue('customform');
	//119=Good to BO; 176=Good to Free; 165=Interbranch; 181=Warehouse Transfer;
	if(custom_form == 165 || custom_form == 181 || custom_form == 176 || custom_form == 119)
	{
		principal = nlapiGetFieldValue('class');
		if(principal == null || principal == "") {
			alert("Principal is required!...");
			return false;
		} else {
			
			location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49');
			item = nlapiGetCurrentLineItemValue('item', 'item');
			quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
			units = nlapiGetCurrentLineItemText('item', 'units');
			amount = nlapiGetCurrentLineItemValue('item', 'amount');
			
//			purchase_price = getPurchasePrice(location, principal, item);
			
			warehouse_location = nlapiGetFieldValue('location');
			// AVERAGE COST PER ITEM
			var avgcost = getAverageCost(warehouse_location, nlapiGetCurrentLineItemText('item', 'item'));
			
			var result_item = getUnitTypeId(item);
//			conversion_factor = result_item.conversionRate;
			unit_type = result_item.unitType;
			
//			nlapiLogExecution('ERROR', 'CONVERSION FACTOR', conversion_factor);
			
			//CALL METHOD CONVERTION RATE TO GET CONVERSIONRATE
			conversionrate = getConversionRate(unit_type, units);
//			nlapiLogExecution('ERROR', 'CONVERSION RATE', conversionrate);
			
			//COMPUTATION FOR PRICE
//			price = (parseFloat(purchase_price) / parseFloat(conversion_factor)) * parseFloat(conversionrate);
			price = parseFloat((avgcost==null || avgcost=='') ? 0 : avgcost).toFixed(10) * parseFloat(conversionrate);
			
			//COMPUTATION FOR NET
//			net = parseFloat(price) * parseFloat(quantity).toFixed(5);
			
			//nlapiSetCurrentLineItemValue('item','amount',net);
			//change the amount to rate and net or price
			//change date April 4, 2016
			nlapiSetCurrentLineItemValue('item','rate',price);
		
			return true;
		}
		
	}

return true;
  
}
/**
 * Added By Brian 5/13/2016
 * return average cost per item
 */
function getAverageCost(location, item) {
	var filter = [
		new nlobjSearchFilter('name', null, 'is', item),
		new nlobjSearchFilter('inventorylocation', null, 'is',location)
	];
	
	var column = new nlobjSearchColumn('locationaveragecost');
	
	var result = nlapiSearchRecord('item', null, filter, column); //customsearch935 = stock balance report
	
	if(result != null) {
		return result[0].getValue('locationaveragecost');
	} else { return 0; }

}

//RETURN PURCHASE PRICE
function getPurchasePrice(location, principal, item)
{
	
	var columns = [
					new nlobjSearchColumn('custrecord744'), 
				  ];
	var filter = [
	              	new nlobjSearchFilter('custrecord743', null, 'is', location),
	              	new nlobjSearchFilter('custrecord802', null, 'is', principal),
	              	new nlobjSearchFilter('custrecord742', null, 'is', item)
	             ];
	var results = nlapiSearchRecord('customrecord252', null, filter, columns);
	if(results != null)
	{
		return results[0].getValue('custrecord744');;
	} 
	else
	{
		return 0.00;
	}
}

//RETURN CONVERTION FACTOR AND UNIT PRICE
function getUnitTypeId(item)
{
	var columns = [
					new nlobjSearchColumn('custitem72'),
					new nlobjSearchColumn('unitstype')
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
	} else { return 0.00; }

}

//RETURN CONVERSTION RATE
function getConversionRate(unit_type, units)
{
	filters = new Array (
			new nlobjSearchFilter('internalid', null, 'anyof', unit_type),
			new nlobjSearchFilter('abbreviation', null, 'is', units)
	);

	search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
	if(search != null) {
		return search[0].getValue('conversionrate');
	} else { return 0.00; }
}
//3rd parameter type
function Log(id, value) {
	nlapiLogExecution('DEBUG', id, value);
}