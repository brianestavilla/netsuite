/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Oct 2015     Brian
 *
 */

function compute_mondelez() {
//if(type == 'create' || type == 'edit'){
var record = nlapiGetNewRecord(),	//gets the current record being submitted
	linecount = record.getLineItemCount(ITEM), //number of line items
	form1 = record.getFieldValue('customform'), //gets the custom form ID used
	total_discounts = 0,
	total_grossamt = 0,
	total_vatamt = 0,
	tempamt = 0,
	gross = 0;

//gets the reporting branch(Location ID) of the current user
parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false); 

//if Trade PO and not role is not Branch Finance Manager
	if(form1 == '116' || form1== '103' && parent_location != null && parent_location != '' && nlapiGetRole() != '1031') {
		for(var i = 1; i <= linecount; i++)
		{
			//SLQ Query for Netsuite
			//SELECT discount1, discount2, discount3, discount4, discount5, discount6, purchaseprice FROM PurchaseDiscounting
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
			var load_discounts = getResults(record.getLineItemValue(ITEM, ITEM, i), parent_location, columns, record); //Query Result
			if(load_discounts != null) //if query result is greater than zero
			{
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
				
				//Total all discounts except prompt discount
//				total_discount = (parseFloat(d1)/100) + (parseFloat(d2)/100) + (parseFloat(d3)/100) + (parseFloat(d4)/100) + (parseFloat(d5)/100) + (parseFloat(d6)/100);
				
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
				price = (price_piece * conversion_rate).toFixed(10); //Compute purchase price based on units
				
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
				record.setLineItemValue(ITEM, RATE, i,  parseFloat(gross / record.getLineItemValue(ITEM, 'quantity', i)));
				record.setLineItemValue(ITEM, 'amount', i,  gross.toFixed(2));
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
        nlapiLogExecution('ERROR', 'TOTAL DISCOUNT', total_discounts);
	}
}

