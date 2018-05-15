function loadItemtoVanBalancing(type, form, request){
  	form.setScript('customscript697');

	if(type == 'create'){
		var operationid = request.getParameter('opid'); // store created session into operation id
		var customerid = request.getParameter('custid');
		var locationid = request.getParameter('locid');

		//try{
			if(operationid != '' || customerid != ''){

				nlapiSetFieldValue('custrecord815_2', getUnappliedRemittance(customerid));

				var branch = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false); // get reporting branch
//				nlapiSetFieldValue('custrecord815_2',nlapiLookupField('customer', customerid, 'consoldepositbalance')); // set the value of deposit balance
				//nlapiLogExecution('DEBUG', 'balance', nlapiLookupField('customer', customerid, 'depositbalance'));
              	nlapiSetFieldValue('custrecord235',customerid); // set customer;
				nlapiSetFieldValue('custrecord269',locationid); // set location;
				nlapiSetFieldValue('custrecord268',nlapiLookupField('customer', customerid, 'custentity50', false)); // set principal
				nlapiSetFieldValue('custrecord804',operationid); // set operation
				nlapiSetFieldValue('custrecord242', getSalesman(customerid)); // set salesman
				
				var filter = new Array (
					new nlobjSearchFilter('internalid', 'inventoryLocation', 'anyof', locationid),
                  	new nlobjSearchFilter('locationquantityonhand', null, 'greaterthan', 0),
                  	new nlobjSearchFilter('isinactive', null, 'is', 'F')
					//new nlobjSearchFilter('custrecord12', 'custrecord13', 'anyof', branch), // location pricing : location
					//new nlobjSearchFilter('custrecord28', 'custrecord13', 'anyof', operationid), // location pricing : operation
                  	//new nlobjSearchFilter('isinactive', 'custrecord13', 'is', 'F') // location pricing : operation
                  	
				);
					
				var column = new Array (
					new nlobjSearchColumn('internalid'), // item 
					new nlobjSearchColumn('displayname'), // item display name
					new nlobjSearchColumn('locationquantityonhand'), // qty on hand
					new nlobjSearchColumn('internalid', 'custitem71'), // default unit type
					//new nlobjSearchColumn('formulanumeric'), //price
					new nlobjSearchColumn('stockunit') // stock unit
					
				);
               	column[1].setSort();
				var filterItem1 = nlapiSearchRecord('item',null, filter, column); //save search customsearch533
				if(filterItem1 != null) {
				var i = 0;
					while(filterItem1[i])
					{
						var result = filterItem1[i];
						var itemid = result.getValue('internalid');
						var displayname = result.getValue('displayname');
						var locationonhand = result.getValue('locationquantityonhand');
						var conversion_rate = 1;//result.getValue('custitem72', null, 'group');
						var unitstype = result.getValue('internalid', 'custitem71');
						var units = result.getText('stockunit');
						var price = 0;//result.getValue('formulanumeric');
                      
                      	price = getPricing(itemid, operationid, branch);
						
						nlapiSelectNewLineItem('recmachcustrecord275');
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord276', itemid); // item code
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord308', displayname); // display name
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord278', locationonhand); // eoh
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord277',locationonhand); //boh
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord581', conversion_rate.toFixed(0)); //factor
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord414', unitstype); // unit type
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord603', '6');
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord600', 12);
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord602', 0.00);
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord279', 0); // Quantity
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord281', 0.00); // Vatable amount
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord601', 0.00); // Tax Amount
						nlapiSetCurrentLineItemText('recmachcustrecord275','custrecord504', units); // Stock unit
						nlapiSetCurrentLineItemValue('recmachcustrecord275', 'custrecord280', parseFloat(price/1.12)); //.toFixed(5)
						nlapiCommitLineItem('recmachcustrecord275');
						i++;
					}//end while loop
				}
			}
		//}catch(e){}
	}
}

function getPricing(item, operation, location) {
	/******* ######### ------------------- START TRANSACTION PRICING SEARCH -------------------------########## ********/
		filters = new Array (
				new nlobjSearchFilter('custrecord13', null, 'anyof', item),	//ITEM
				new nlobjSearchFilter('custrecord12', null, 'anyof', location),	//LOCATION
				new nlobjSearchFilter('custrecord28', null, 'anyof', operation)	//OPERATION
				//new nlobjSearchFilter('custrecord753', null, 'anyof', principal)	//PRINCIPAL
		);
		column = new nlobjSearchColumn('custrecord768');
  
		var itemPricing = nlapiSearchRecord('customrecord102', null, filters, column);
  
  		return (itemPricing == null) ? 0 : itemPricing[0].getValue('custrecord768');

  /******* ######### ------------------- END TRANSACTION PRICING SEARCH -------------------------########## ********/
}

function getSalesman(customer){
	var salesman = '';
	var filter = new nlobjSearchFilter('custrecord152', null, 'anyof', customer);
	var column = new nlobjSearchColumn('custrecord340');
	var result = nlapiSearchRecord('customrecord150', null, filter, column);
	
	if(result != null){
		salesman = result[0].getValue('custrecord340');
	}
	return salesman;
}

/**
** Added By Brian 5/8/2017
** GET UNAPPLIED CUSTOMER DEPOSITS
**/
function getUnappliedRemittance(salesman) {
	
	var column = new nlobjSearchColumn('amount');
	var filters = [
	    new nlobjSearchFilter('name', null, 'anyof', salesman),
      	new nlobjSearchFilter('mainline', null, 'is', 'T'),
	    new nlobjSearchFilter('status', null, 'noneof', 'CustDep:C') // CustDep:C = Fully Applied;
	];
	
	var result = nlapiSearchRecord('customerdeposit', null, filters, column);
	var total = 0;
	
	for(var i in result) { total += parseFloat(result[i].getValue('amount')); }
	
	return total;
}