/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Apr 2016     Brian
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function beforeSubmit(type, form)
{
	/**
	***  MODIFIED BY CHRISTIAN GUMERA 12/1/2015
	** exit script during approval.
	**/	
	//if(type != 'create') return;

	/**
	***  MODIFIED BY BRIAN 10/2/2015
	**/
	
	if(nlapiGetFieldValue('class')=='6') { // MONDE=6;
		if(nlapiGetFieldValue('location')=='1655' || nlapiGetFieldValue('location')=='1577') { // location is FREE GOODS; 1655=mondelez tacloban, 1577=mondelez paknaan
			var record = nlapiGetNewRecord();
			for(var i=1, counter = record.getLineItemCount('item'); i<=counter; i++) {
				record.setLineItemValue('item', 'custcol6', i, 0);
				record.setLineItemValue('item', 'custcol7', i, 0);
				record.setLineItemValue('item', 'custcol8', i, 0);
				record.setLineItemValue('item', 'custcol9', i, 0);
				record.setLineItemValue('item', 'custcol11', i, 0);
				record.setLineItemValue('item', 'custcol12', i, 0);
				record.setLineItemValue('item', 'custcol32', i, 0);
				record.setLineItemValue('item', 'rate', i, 0);
				record.setLineItemValue('item', 'amount', i, 0);
				record.setLineItemValue('item', 'custcol10', i, 0);
			}
		} else {
              //compute_monde_nissin();		
		}
	} else if(nlapiGetFieldValue('class')=='7') { // PG=7;
		if(nlapiGetFieldValue('location')=='1655' || nlapiGetFieldValue('location')=='1577') { // location is FREE GOODS; 1655=mondelez tacloban, 1577=mondelez paknaan
			var record = nlapiGetNewRecord();
			for(var i=1, counter = record.getLineItemCount('item'); i<=counter; i++) {
				record.setLineItemValue('item', 'custcol6', i, 0);
				record.setLineItemValue('item', 'custcol7', i, 0);
				record.setLineItemValue('item', 'custcol8', i, 0);
				record.setLineItemValue('item', 'custcol9', i, 0);
				record.setLineItemValue('item', 'custcol11', i, 0);
				record.setLineItemValue('item', 'custcol12', i, 0);
				record.setLineItemValue('item', 'custcol32', i, 0);
				record.setLineItemValue('item', 'rate', i, 0);
				record.setLineItemValue('item', 'amount', i, 0);
				record.setLineItemValue('item', 'custcol10', i, 0);
			}
		} else {
			compute_pg();
		}
	}
}
function compute_pg() {
	var record = nlapiGetNewRecord(),	//gets the current record being submitted
	linecount = record.getLineItemCount(ITEM), //number of line items
	form1 = record.getFieldValue('customform'), //gets the custom form ID used
	total_discounts = 0,
	total_grossamt = 0,
	total_vatamt = 0,
	tempamt = 0,
	gross = 0;
	
	if(form1 == '116' || form1== '103' && nlapiGetRole() != '1031') {
		for(var i = 1; i <= linecount; i++) {
			//total_discounts+= parseFloat(record.getLineItemValue('item','custcol10',i));
			total_grossamt+= parseFloat(record.getLineItemValue('item','amount',i));
			total_vatamt+= parseFloat(record.getLineItemValue('item','tax1amt',i));
		}
		record.setFieldValue('custbody142', total_grossamt);
		//record.setFieldValue('custbody127', total_discounts);
		record.setFieldValue('custbody166', total_vatamt);
	}
}

function compute_monde_nissin() {
	//if(type == 'create' || type == 'edit'){
	var record = nlapiGetNewRecord(),	//gets the current record being submitted
		linecount = record.getLineItemCount(ITEM), //number of line items
		form1 = record.getFieldValue('customform'), //gets the custom form ID used
		total_discounts = 0,
		total_grossamt = 0,
		total_vatamt = 0,
		gross = 0;

	//gets the reporting branch(Location ID) of the current user
	parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false); 

	//if Trade PO and not role is not Branch Finance Manager
	if(form1 == '116' || form1== '103' && parent_location != null && parent_location != '' && nlapiGetRole() != '1031') {
		for(var i = 1; i <= linecount; i++) {
			var load_discounts = getResults(record.getLineItemValue(ITEM, ITEM, i), parent_location, record.getFieldValue('class')); //Query Result
			if(load_discounts != null) {
				/******#### Assign the discount values to variables #### *******/
				d1 = load_discounts[0].getValue('custrecord736'); 
				d2 = load_discounts[0].getValue('custrecord737');
				d3 = load_discounts[0].getValue('custrecord738');
				d4 = load_discounts[0].getValue('custrecord739');
				d5 = load_discounts[0].getValue('custrecord740');
				d6 = load_discounts[0].getValue('custrecord741');
				
				d1 = (d1 == null || d1 == '') ? 0 : d1;
				d2 = (d2 == null || d2 == '') ? 0 : d2;
				d3 = (d3 == null || d3 == '') ? 0 : d3;
				d4 = (d4 == null || d4 == '') ? 0 : d4;
				d5 = (d5 == null || d5 == '') ? 0 : d5;
				d6 = (d6 == null || d6 == '') ? 0 : d6;
				/*************###### END discount values ###### **************/
				
				var discamt1 = 0,
					discamt2 = 0,
					discamt3 = 0,
					discamt4 = 0,
					discamt5 = 0,
					discamt6 = 0;
				
				var itemid = record.getLineItemValue(ITEM, ITEM, i); //gets Item ID
				var units_type = getFieldID(itemid, 'unitstype');	//gets Item Units type
				conversionrate = getFieldID(itemid, 'custitem72');	//gets the Item Conversion Rate
				
				var price_piece = parseFloat(load_discounts[0].getValue('custrecord744')) / conversionrate; //Compute Purchase price in pieces
				conversion_rate = conversionRate(units_type, record.getLineItemText('item', 'units', i));  //gets the Conversion factor based on the unit selected
				price = (price_piece * conversion_rate).toFixed(8); //Compute purchase price based on units
				//price = parseFloat(price * 1.12);
				
				gross = price * record.getLineItemValue(ITEM, 'quantity', i);				
				
				discamt1 = parseFloat(parseFloat(d1)/100) * gross;
				gross-=discamt1;
				discamt2 = parseFloat(parseFloat(d2)/100) * gross;
				gross-=discamt2;
				discamt3 = parseFloat(parseFloat(d3)/100) * gross;
				gross-=discamt3;
				discamt4 = parseFloat(parseFloat(d4)/100) * gross;
				gross-=discamt4;
				discamt5 = parseFloat(parseFloat(d5)/100) * gross;
				gross-=discamt5;
				discamt6 = parseFloat(parseFloat(d6)/100) * gross;
				gross-=discamt6;
				
				total_discount = discamt1 + discamt2 + discamt3 + discamt4 + discamt5 + discamt6;
				
				total_discounts += parseFloat(total_discount);//sums up all purchase discounts computed
				
				//Sets all the values in the line item
				record.setLineItemValue(ITEM, DISCOUNT1, i, d1); //discount1
				record.setLineItemValue(ITEM, DISCOUNT2, i,  d2); //discount2
				record.setLineItemValue(ITEM, DISCOUNT3, i,  d3); //discount3
				record.setLineItemValue(ITEM, DISCOUNT4, i,  d4); //discount4
				record.setLineItemValue(ITEM, DISCOUNT5, i,  d5); //discount5
				record.setLineItemValue(ITEM, DISCOUNT6, i,  d6); //discount6
				record.setLineItemValue(ITEM, PURCHASE_PRICE, i,  price); //Purchase Price
				record.setLineItemValue(ITEM, RATE, i,  price);
				record.setLineItemValue(ITEM, 'amount', i,  parseFloat(gross).toFixed(2));
				record.setLineItemValue(ITEM, TOTAL_DISCOUNT, i,  total_discount.toFixed(10));					
			} else {
				record.setLineItemValue(ITEM, RATE, i, 0);	
				record.setLineItemValue(ITEM, GROSS_AMT, i, 0);	
			}
			
			total_grossamt += parseFloat(gross);
			total_vatamt += gross - (parseFloat(gross)/1.12);
		}
		record.setFieldValue('custbody142', total_grossamt);
		record.setFieldValue('custbody127', total_discounts);
		record.setFieldValue('custbody166', total_vatamt);
	}
}
function getParseDiscount(record, i, column)
{
	var discount =(record.getLineItemValue(ITEM, column, i) == null || record.getLineItemValue(ITEM, column, i) == '') ? 0 : parseFloat(record.getLineItemValue(ITEM, column, i))/100;
	return discount;
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
		new nlobjSearchFilter('custrecord742', null, 'is', itemid),
		new nlobjSearchFilter('custrecord802', null, 'anyof', principal),
		new nlobjSearchFilter('custrecord743', null, 'anyof', parent_location)
	);
	
	var results = nlapiSearchRecord('customrecord252', null, filter, columns); //Executes Query and returns the query results
	return results;
}
function conversionRate(unitstype, unitname){
	filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
				new nlobjSearchFilter('abbreviation', null, 'is', unitname)
		);

	search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
	return search[0].getValue('conversionrate');
}

function getFieldID(itemid, field_id){
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
