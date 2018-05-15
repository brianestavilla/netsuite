/*
*
* Description: Load Purchase Price and Discount for CSV Upload
* Author: Vanessa Sampang
* 
*/

function updatePO(record_type, record_id)
{
	record = nlapiLoadRecord(record_type, record_id);
	nlapiSubmitRecord();
}//USER EVENT SCRIPT FUNCTION
function beforeSubmit(type, form)
{
  if(nlapiGetRole() == 3 || nlapiGetRole() == 1083) {
      /**
      ***  MODIFIED BY CHRISTIAN GUMERA 12/1/2015
      ** exit script during approval.
      **/	
      //if(type != 'create') return;

      /**
      ***  MODIFIED BY BRIAN 10/2/2015
      **/

      if(nlapiGetFieldValue('class')=='3' || nlapiGetFieldValue('class')=='10' || nlapiGetFieldValue('class')=='1'  || nlapiGetFieldValue('class')=='11' || nlapiGetFieldValue('class')=='118') { // MONDELEZ=3; DELMONTE GT=10; DELMONTE=1; DELMONTE FS=11; GLOBE=118;
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
              compute_mondelez();		
          }
      } else { //PRINCIPAL IS NUTRIASIA
          compute_nutriasia(); //legacy code is in this function
      };
	}
}

function getParseDiscount(record, i, column)
{
	var discount =(record.getLineItemValue(ITEM, column, i) == null || record.getLineItemValue(ITEM, column, i) == '') ? 0 : parseFloat(record.getLineItemValue(ITEM, column, i))/100;
	return discount;
}

function getResults(itemid, parent_location, columns, record)
{
	//SQL WHERE STATEMENT
	//WHERE itemid is itemid and principal is record.getFieldValue('class') and branch is parent_location
	var filter = new Array (
		new nlobjSearchFilter('custrecord742', null, 'is', itemid),
		new nlobjSearchFilter('custrecord802', null, 'anyof', record.getFieldValue('class')),
		new nlobjSearchFilter('custrecord743', null, 'anyof', parent_location),
      	new nlobjSearchFilter('isinactive', null, 'is', 'F')
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