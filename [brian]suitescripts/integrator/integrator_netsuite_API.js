/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jul 2016     Brian
 *
 */
var NETSUITE_API = function () {
	var filter, column;
	
	//ITEM
	this.getItemId = function (type, value, principal) {
		if(principal=='procterandgamble'){
			filter = [
			          	new nlobjSearchFilter('itemid', null, 'is', value), // item code and description
			          	new nlobjSearchFilter('isinactive', null, 'is', 'F') //is active
			         ];
		} else {
			filter = [
		             	new nlobjSearchFilter('custitem10', null, 'is', value), //item code
			            new nlobjSearchFilter('isinactive', null, 'is', 'F') //is active
				     ];
		}
			
		column = [
          	new nlobjSearchColumn('internalid'),
			new nlobjSearchColumn('unitstype'),
			new nlobjSearchColumn('itemid'),
			new nlobjSearchColumn('custitem72')		
		];
		
		var result = nlapiSearchRecord(type, null, filter, column); //20
		
		if(result==null) {
				return {
						"name":value,
						"error_code":404,
						"message":"NOT FOUND"
					   };
		}
		
		return{
			"error_code":200,
			"internalid": result[0].getValue('internalid'),
			"unit":result[0].getValue('unitstype'),
			"item_name":result[0].getValue('itemid'),
			"conversion_factor":result[0].getValue('custitem72')
		};
	};
	
	//VENDOR
	this.getVendorId = function (type, value) {
		filter = new nlobjSearchFilter('entityid', null, 'is', value);
		column = new nlobjSearchColumn('internalid');
		
		var result = nlapiSearchRecord(type, null, filter, column);
		if(result==null) {
			return {
					"name":value,
					"error_code":404,
					"message":"NOT FOUND"};
		}
		
		return {
		"error_code":200,
		"internalid": result[0].getValue('internalid'),
		"vendor_name":result[0].getText('internalid')
		};
		
	};
	
	//CUSTOMER
	this.getCustomerId = function (type, customer, principal) {
		filter = [ 
		           new nlobjSearchFilter('custrecord883', null, 'is', customer),
		           new nlobjSearchFilter('custrecord884', null, 'is', principal)
				 ];
		column = [
		          new nlobjSearchColumn('custrecord882'),
		          new nlobjSearchColumn('custrecord885')
		         ];
		
		var result = nlapiSearchRecord(type, null, filter, column); //20
		
		if(result==null) {
			return {
					"name":customer,
					"error_code":404,
					"message":"NOT FOUND"
					};
		} else if(result!=null && result[0].getValue('custrecord882')==''){
			return {
				"name":customer,
				"error_code":404,
				"message":"CODE IS NOT MAPPED TO A CUSTOMER"
				};
		} else if(result!=null && result[0].getValue('custrecord885')=='') {
			return {
				"name":customer,
				"error_code":404,
				"message":"NO LOCATION SETUP IN CUSTOMER PER PRINCIPAL"
				};
		} else {
			return {
				"error_code": 200,
				"internalid": result[0].getValue('custrecord882'),
				"customer_name": result[0].getText('custrecord882'),
				"reporting_branch": result[0].getValue('custrecord885')	
				};
		}
	};
	
	//LIST
	this.getListId = function (type, value) {
		var filter_field = 'name';
		
		if(type=='vendor' || type=='customer' || type=='employee') filter_field = 'entityid';
		
		filter = new nlobjSearchFilter(filter_field, null, 'is', value);
		column = new nlobjSearchColumn('internalid');
		
		var result = nlapiSearchRecord(type, null, filter, column); //20
		
		if(result==null) {
			return {
				"name":value,
				"error_code":404,
				"message":"NOT FOUND"
			};
		}
		
		return {
			"error_code":200,
			"internalid": result[0].getValue('internalid')
			};
	};
	
	//CUSTOMER LOCATION
	this.getSalesManAndLocation = function (type, customer) {
		filter = new nlobjSearchFilter('internalid', null, 'is', customer);
		column = [
	              	new nlobjSearchColumn('custentity37'),	// customer location
	              	new nlobjSearchColumn('custentity48')	// reporting branch
		         ];
		
		var result = nlapiSearchRecord(type, null, filter, column); //20
		
		if(result==null) {
			return { "error_code":404 };
		} else {
			return {
				"error_code":200,
				"customerlocation": result[0].getValue('custentity37'),
				"reportingbranch": result[0].getValue('custentity48')
			};
		}
	};
	
	this.getPaymentType = function(type) {
		var paymenttype = {
			'Later Payment' : 2,
			'Advance Payment': 1
		};
		
		if(typeof(paymenttype) == 'undefined') {
			return { "name":type, "error_code":404, "message":"NOT FOUND" };
		} else {
			return { 'error_code': 200, 'internalid':paymenttype[type] };
		}
		
	};
	
	//PURCHASE DISCOUNT MONDE
	this.getPurchaseDiscountMonde = function (item, location, principal) {
		var parent_location = 0;
		switch(location) {
		case '1782': //CENTRAL : CEBU : AS.FORTUNA : MNC : GOOD (ASF_MNC)
			parent_location = '2341'; //CENTRAL : CEBU : AS.FORTUNA
			break;
		case '1772': //CENTRAL : BOHOL : MNC : GOOD (BOH_MNC)
			parent_location = '1728'; //CENTRAL : BOHOL
			break;
		case '1906' : //EAST : TACLOBAN : MNC : GOOD (TAC_MNC)
			parent_location = '1733'; //EAST : TACLOBAN
			break;
		}
		
		filter = [
					new nlobjSearchFilter('custrecord743', null, 'is', parent_location),
					new nlobjSearchFilter('custrecord802', null, 'is', principal),
					new nlobjSearchFilter('custrecord742', null, 'is', item)
		         ];
		
		column = [
	              	new nlobjSearchColumn('custrecord736'),// DIST DISC
	              	new nlobjSearchColumn('custrecord744') // PURCHASE PRICE
		         ];
		
		var result = nlapiSearchRecord('customrecord252', null, filter, column); //20
		
		if(result != null) {
			return {
				"error_code":200,
				"dist_disc": (result[0].getValue('custrecord736') == null || result[0].getValue('custrecord736') == '') ? 0 : result[0].getValue('custrecord736'),
				"purchase_price": (result[0].getValue('custrecord744') == null || result[0].getValue('custrecord744') == '') ? 0 : result[0].getValue('custrecord744')
			};
		} else { return { "error_code":404 }; }
		
	};

	//UOM
	this.getUOM = function (type, record_internalid, unitname) {
		if(record_internalid==null || record_internalid=='') {
			return {
				"name":unitname,
				"error_code":404,
				"message":"NOT FOUND. NO UNIT TYPE SETUP IN ITEM RECORD."
			};
		} else {
			var unitrecord = nlapiLoadRecord(type, record_internalid);
			if(unitrecord==null) {
				return {
					"name":unitname,
					"error_code":404,
					"message":"NOT FOUND. NO UNIT TYPE SETUP"
				};
			} else {
				var cases = ['CASE','Case','case','CASES','Cases','cases','CS','Cs','cs','cS'];
				var pieces = ['PIECE','Piece','piece','PIECES','Pieces','pieces','PC','Pc','pc','pC','PCS','Pcs','pcs'];
				var globe = ['PESO','Peso','peso','pesos','PESOS','Pesos'];
				var packs = ['PACKS','Packs','packs','pack','Pack','PACK','PCK','Pck','pck','PK','Pk','pk','Pks','PKS','pks','PCKS','Pcks','pcks'];
	            var dozens = ['DOZENS','Dozens','dozens','DOZEN','Dozen','dozen','DZN','Dzn','dzn'];
				var sw = ['sw','SW','sW','Sw'];
				var it = ['it','IT','It','iT'];
				var found = false;
				
				for(var i=1, linecount = unitrecord.getLineItemCount('uom'); i<=linecount; i++) {
					if(this.existInArray(cases,unitname)==true) { //check if the data is CASE
						//get the internalid of the unit
						if(this.existInArray(cases,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": cases,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}
					} else if(this.existInArray(pieces,unitname)==true) { //check if the data is PIECE
						//get the internalid of the unit
						if(this.existInArray(pieces,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": pieces,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}	
					} else if(this.existInArray(globe,unitname)==true) { //check if the data is PESO
						//get the internalid of the unit
						if(this.existInArray(globe,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": globe,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}
					} else if(this.existInArray(packs,unitname)==true) {
						//get the internalid of the unit
						if(this.existInArray(packs,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": packs,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}
					} else if(this.existInArray(dozens,unitname)==true) {
						//get the internalid of the unit
						if(this.existInArray(dozens,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": dozens,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}
					} else if(this.existInArray(sw,unitname)==true) {
						//get the internalid of the unit
						if(this.existInArray(sw,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": sw,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}
					} else if(this.existInArray(it,unitname)==true) {
						//get the internalid of the unit
						if(this.existInArray(it,unitrecord.getLineItemValue('uom','unitname',i))==true) {
							found = true;
							return {
								"internalid":unitrecord.getLineItemValue('uom', 'internalid', i),
								"error_code":200,
								"uom_array": it,
								"abbreviation":unitrecord.getLineItemValue('uom', 'abbreviation', i)
							};
						}
					} else { //UNIT is not specified in the array declaration above
						return {
							"name":unitname,
							"error_code":404,
							"message":"NOT FOUND"
						};
					}	
				}//end of for loop
	
				if(found==false) {
					return {
						"name":unitname,
						"error_code":404,
						"message":"NOT FOUND"
					};
				}		
			}
		}
	};
	
	//CONVERSION RATE
	this.conversionRate = function (unitstype, unitname) {
	    filters = new Array (
	                new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
	                new nlobjSearchFilter('abbreviation', null, 'startswith', unitname)
	        );

	    search = nlapiSearchRecord('unitstype', null, filters,  new nlobjSearchColumn('conversionrate'));
	    if(search!=null) {
	    	return search[0].getValue('conversionrate');
	    } else { return null; }
	};
	
	//PRICING
	this.getPricing = function (itemid, locationid, operationid) {
	    /******* ######### ------------------- START TRANSACTION PRICING SEARCH -------------------------########## ********/
	        filters = new Array (
                new nlobjSearchFilter('custrecord13', null, 'anyof', itemid), //ITEM ID
                new nlobjSearchFilter('custrecord12', null, 'is', locationid),  //LOCATION ID
                //new nlobjSearchFilter(PRICELIST, null, 'is', pricelist),  //PRICELIST ID
                new nlobjSearchFilter('custrecord28', null, 'anyof', operationid) //OPERATION ID custrecord768
	        );
	        column = new Array(
                new nlobjSearchColumn('custrecord768', null, null)
	        );
	        itemPricing = nlapiSearchRecord('customrecord102', null, filters, column); // save search id : customsearch68
	    /******* ######### ------------------- END TRANSACTION PRICING SEARCH -------------------------########## ********/
	    return itemPricing;
	};
	
	//CREDIT LIMIT
	this.customerCreditLimit = function (customer, principal) {
		filter = new Array(
			new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
			new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
		);
		
		columns = new Array(
			new nlobjSearchColumn('custrecord340'),	// Sales Rep Column
			new nlobjSearchColumn('custrecord156'),	// Terms
			new nlobjSearchColumn('custrecord152'), // Customer
			new nlobjSearchColumn('custrecord154')	// Credit Limit
		);
		
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		
		if(creditLimit!=null) {
			return {
					"error_code" : 200,
					"salesrep" : creditLimit[0].getValue('custrecord340'),
					"customer" : creditLimit[0].getValue('custrecord152'),
					"terms" : creditLimit[0].getValue('custrecord156'),
					"creditlimit" : (creditLimit[0].getValue('custrecord154') =="") ? 0 : creditLimit[0].getValue('custrecord154')
			};
		} else {
			return {
				"error_code":404,
				"message":"No Sales Representative and Credit Limit Setup for this Customer"
			};
		}
	};
	
	//EXCEED CL CHECKER
	this.checkExceedCL = function (customer, principal, amount, creditlimit) {
		filter = new Array(
			new nlobjSearchFilter('name', null, 'anyof', customer, 'group'),
			new nlobjSearchFilter('class', null, 'anyof', principal, 'group')
		);
		
		columns = new nlobjSearchColumn('amountremaining', null, 'sum');

		var creditUse = nlapiSearchRecord(null, 'customsearch1751', filter, columns);
		if(creditUse != null) {
			var totalAR = parseFloat(creditUse[0].getValue('amountremaining', null, 'sum') + amount);
			
			if(totalAR > creditlimit) {
				var customername = nlapiLookupField('customer', dataIn.customer, 'entityid', false);
				return {
					"error_code" : 404,
					"message" : customername + " has an Outstanding AR. Please Settle it first. ",
					"customer" : customername
				};
			} else {
				return { "error_code" : 200 };
			}
			
		} else {
			return { "error_code" : 200 };
		}

	};
	
	//CUSTOMER DISCOUNT
	this.getCustomerDiscount = function (customer, principal, operation, location) {
		
		filters = new Array (
			new nlobjSearchFilter('custrecord30', null, 'anyof', principal), //Principal
			new nlobjSearchFilter('custrecord29', null, 'anyof', customer), //Customer
			new nlobjSearchFilter('custrecord754', null, 'anyof', location), //location
			new nlobjSearchFilter('custrecord_disc_prin_operation', null, 'anyof', operation) //operation
		);
	
		column = new Array(
			new nlobjSearchColumn('custrecord365'), //Discount 1
			new nlobjSearchColumn('custrecord362'), //Discount 2
			new nlobjSearchColumn('custrecord363'), //Discount 3
			new nlobjSearchColumn('custrecord364') //Discount 4
		);
	
		var search = nlapiSearchRecord('customrecord110', null, filters, column);		
		
		//if(!search) return null;
		
		parseToDecimal = function(value){
			
			var rate = parseFloat(value.replace(/%/)) / 100;
						
			if(isNaN(rate)) return 0;
			
			return rate;
		};
		
		if(search != null) {
			return {
				'error_code' : 200,
				'trade' : parseToDecimal(search[0].getValue('custrecord365')),
				'bo' : parseToDecimal(search[0].getValue('custrecord362')),
				'disc3' : parseToDecimal(search[0].getValue('custrecord363')),
				'disc4' : parseToDecimal(search[0].getValue('custrecord364'))
			};
		} else {
			return {
				'error_code': 404,
				'message': 'No Discounting and Pricelist Setup'
			};
		}
	};
	
	// SET DISCOUNT
	this.setLineItemDiscount = function (record, i, discount, dataIn) {
		
		if(discount['error_code'] == 404) return;
		
//		if(dataIn.principal=='3'){ //MONDELEZ
//			var discamount = 0;
//			var discrate = parseFloat(dataIn.items[i-1].discount) / 100;
//			var unDiscountedAmount = record.getLineItemValue('item', 'amount', i);
//			
//			discamount = unDiscountedAmount * discrate;
//			record.setLineItemValue('item','custcol7',i,dataIn.items[i-1].discount);
//			record.setLineItemValue('item', 'custcol10', i, (parseFloat(discamount)).toFixed(2));
//			
//		} else{ // OTHER PRINCIPAL

		//get undiscounted amount
		var unDiscountedAmount = record.getLineItemValue('item', 'amount', i);
		
		var balAmount = parseFloat(unDiscountedAmount), 
		totalDiscount=0, 
		discAmount=0, 
		disc1=0,
		disc2=0,
		disc3=0,
		disc4=0;
		
		record.setLineItemValue('item','custcol6', i, discount['trade'] * 100);
		disc1 = balAmount * discount['trade'];
		balAmount -= disc1;
		var itemgroup = nlapiLookupField('inventoryitem', dataIn.items[i-1].item, 'custitem95'); //item group
		
		record.setLineItemValue('item','custcol8', i, discount['disc3'] * 100);
		disc3 = balAmount * discount['disc3'];
		balAmount -= disc3;
		
		
		if(dataIn.principal == 5) { // NUTRIASIA
			if(itemgroup == 1){ // 1 = bottles
				record.setLineItemValue('item','custcol9', i, discount['disc4'] * 100);
				disc4 = balAmount * discount['disc4'];
				balAmount -= disc4;
        	}
		} else {
			record.setLineItemValue('item','custcol9', i, discount['disc4'] * 100);
			disc4 = balAmount * discount['disc4'];
			balAmount -= disc4;
		}
		
		if(dataIn.principal == 3) { // MONDELEZ
          	if(itemgroup == 4) { // MSL
          		record.setLineItemValue('item','custcol7', i, discount['bo'] * 100);
        		disc2 = balAmount * discount['bo'];
        		balAmount -= disc2;
            }
        } else {
        	record.setLineItemValue('item','custcol7', i, discount['bo'] * 100);
    		disc2 = balAmount * discount['bo'];
    		balAmount -= disc2;
        }
		
		
//		if(itemgroup == '1' || itemgroup=='4') { //1 = bottles, 4 = MSL
//			record.setLineItemValue('item','custcol9', i, discount['disc4'] * 100);
//			disc4 = balAmount * discount['disc4'];
//			balAmount -= disc4;
//		}
		
		totalDiscount = disc1 + disc2 + disc3 + disc4;
		//set value to discount amount column
		record.setLineItemValue('item', 'custcol10', i, (parseFloat(totalDiscount)).toFixed(8)); 

		
//		}
	};	
	
	//INTERNAL FUNCTIONS
	this.existInArray = function (array, value) {
		for(var i=0, linecount = array.length; i<linecount; i++) {
			if(array[i]==value) {
				return true;
			}
		}
		
		return false;
	};
};
