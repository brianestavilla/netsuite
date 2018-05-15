/**
 * Author: Vanessa Sampang
 * vpsampang@cloudtecherp.com 
 * Mass Update for Price
 * Date Created: 4-17-2013
 */
function updatePrice(){

	/******* ######### -------------------- START UPDATE OF PRICES SEARCH -------------------------########## ********/
	column = [
		new nlobjSearchColumn(ITEM), 		//Item List
		new nlobjSearchColumn(DATE),		//Date for update
		new nlobjSearchColumn(LOCATION), 	//Location
		new nlobjSearchColumn(OPERATION), 	//Operation
		new nlobjSearchColumn(AREA), 		//Area
		new nlobjSearchColumn(PRICE),		//Price
		new nlobjSearchColumn(REMARKS) 		//Remarks
	];
	filter = new nlobjSearchFilter(DATE, null, 'within', 'today');
	search = nlapiSearchRecord('customrecord243', null, filter, column);
	/******* ######### -------------------- END UPDATE OF PRICES SEARCH -------------------------########## ********/
	
	if(search != null){
	
		for(var i = 0; i < search.length; i++){
			filters = new Array (
				new nlobjSearchFilter(PRICING_ITEM, null, 'anyof', search[i].getValue(ITEM)),			//Item
				new nlobjSearchFilter(PRICING_LOCATION, null, 'anyof', search[i].getValue(LOCATION)),	//Location
				new nlobjSearchFilter(PRICING_OPERATION, null, 'anyof', search[i].getValue(OPERATION))	//Operation
			);
			
			column = new nlobjSearchColumn('internalid');
			record = nlapiSearchRecord('customrecord102', null, filters, column);
			
			if(record != null) {
				nlapiSubmitField('customrecord102', record[0].getValue('internalid'), PRICING_PRICE, search[i].getValue(PRICE));
				nlapiSubmitField('customrecord102', record[0].getValue('internalid'), DATE_UPDATED, nlapiDateToString(new Date()));
			}
		}
	}
}