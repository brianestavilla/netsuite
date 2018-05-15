function loadItemtoVanBalancing(type, form){
	if(type == 'create'){
		var cont = nlapiGetContext(); //intialize context
		var operationid = cont.getSessionObject('opid'); // store created session into operation id
		var customerid = cont.getSessionObject('custid');
		var locationid = cont.getSessionObject('locid');
		try{
			if(operationid != '' || customerid != ''){
				var record = nlapiLoadRecord('customer',customerid); // load customer record
				var depositBalance = record.getFieldValue('depositbalance'); // get the value of deposit balance of customer/salesman
				//var principal = record.getFieldValue('custentity50'); // get principal
				
				nlapiSetFieldValue('custrecord817',depositBalance); // set the value of deposit balance
				nlapiSetFieldValue('custrecord235',customerid); // set salesman;
				nlapiSetFieldValue('custrecord269',locationid); // set location;
				nlapiSetFieldValue('custrecord804',operationid); // set operation;
				//nlapiSetFieldValue('custrecord268',principal); // set operation;
			
				var filter = new Array (
					new nlobjSearchFilter('internalid', 'inventoryLocation', 'is', locationid)
				);
					
				var column = new Array (
					new nlobjSearchColumn('custentity50'),
					new nlobjSearchColumn('internalid'),
					new nlobjSearchColumn('displayname'),
					new nlobjSearchColumn('locationquantityonhand')
				);
			
				var filterItem1 = nlapiSearchRecord('item','customsearch543', filter, column);
				if(filterItem1 != null) {
				nlapiSetFieldValue('custrecord268',filterItem1[0].getValue('custentity50'));
				var counter = 1;
					for(var i = 0; i < filterItem1.length; i++)
					{
						var result = filterItem1[i];
						var itemid = result.getValue('internalid');
						var displayname = result.getValue('displayname');
						var locationonhand = result.getValue('locationquantityonhand');
						var conversion_rate = 1; //nlapiLookupField('inventoryitem', itemid, 'custitem72', false);
						var unitstype = nlapiLookupField('inventoryitem', itemid, 'custitem71', false);
						
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord276',counter, itemid); // item code
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord308',counter, displayname); // display name
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord278',counter, locationonhand); // eoh
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord277',counter, locationonhand); //boh
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord581',counter, conversion_rate.toFixed(0)); //factor
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord414',counter, unitstype); // unit type
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord603',counter, '6');
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord600',counter, 12);
						nlapiSetLineItemValue('recmachcustrecord275', 'custrecord602',counter, 0.00);
						
						
						/****Pricing****/
						var itemPricing = getPricing(counter, operationid);
						if(itemPricing != null)
						{
							price = itemPricing[0].getValue('custrecord768');
							price_no_vat = parseFloat((price)/ 1.12).toFixed(2);
							nlapiSetLineItemValue('recmachcustrecord275', 'custrecord280', counter, (price_no_vat * parseInt(conversion_rate)));
						}else nlapiSetLineItemValue('recmachcustrecord275', 'custrecord280', counter, 0.00);
						/********************/
						
						/*****Default units****/
						var filter = new Array (
						new nlobjSearchFilter('custrecord528', null, 'is', unitstype),
						new nlobjSearchFilter('custrecord527', null, 'is', 'T')
						);
					
						var column = new nlobjSearchColumn('internalid');
						
						var result = nlapiSearchRecord('customrecord224',null,filter,column);
						if(result != null){
							defaultunit = result[0].getValue('internalid');
						}
						nlapiSetLineItemValue('recmachcustrecord275','custrecord504',counter,defaultunit);
						/************************/
						
						counter++;
					}
				}
			}
		}catch(e){}
	}
}

function getPricing(counter, operation)
{
	/******* ######### ------------------- START TRANSACTION PRICING SEARCH -------------------------########## ********/
		filters = new Array (
				new nlobjSearchFilter('custrecord13', null, 'anyof', nlapiGetLineItemValue('recmachcustrecord275', 'custrecord276', counter)),	//ITEM ID
				//new nlobjSearchFilter(PRICELIST, null, 'is', pricelist),	//PRICELIST ID
				new nlobjSearchFilter('custrecord28', null, 'anyof', operation)	//OPERATION ID custrecord768
		);
		if(operation == '4' || operation == '7'){
			var location_text = nlapiGetFieldText('custrecord269').split(' : ');
			filters[2] = new nlobjSearchFilter('name', 'custrecord12', 'startswith', location_text[0]);
		}
		else 
			filters[2] = new nlobjSearchFilter('custrecord12', null, 'anyof', nlapiGetFieldValue('custrecord269'));
		column = new Array(
				new nlobjSearchColumn('custrecord768', null, null)
		);
		var itemPricing = nlapiSearchRecord('customrecord102', 'customsearch68', filters, column);
	/******* ######### ------------------- END TRANSACTION PRICING SEARCH -------------------------########## ********/
	return itemPricing;
}