/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jul 2016     Brian
 */


/**
**	PG CLASS VERIFIER
**/

var PGClassVerifier = function () {
	var API = new NETSUITE_API();
	
	this.VERIFY = function(data) {
		if(data.type=='invoice') {
			return this.INVOICE(data);
		} else if (data.type == 'salesorder') {
			return this.SALES_ORDER(data);
		} else if (data.type == 'purchaseorder') {
			return this.PURCHASE_ORDER(data);
		} else if (data.type == 'creditmemo') {
			return this.CREDIT_MEMO(data);
		} else if (data.type == 'transferorder') {
			return this.TRANSFER_ORDER_VAN_LOADING(data);
		} else if (data.type == 'transferordervanreturn') {
			return this.TRANSFER_ORDER_VAN_RETURN(data);
		}
	};
	
	/*
	** INVOICE FUNCTION
	*/
	this.INVOICE = function (dataIn) {
		var data = {}, department = '', errorText = '', originaldata = dataIn, checkCL = 0;

		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);

			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/

				principal = API.getListId('classification', dataIn.principal);

				if(principal['error_code']==200) {
					customer = 	API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
					if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';

					if(customer['error_code']==200) {
						creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
						if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
						if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';
						
						if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
							department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
							department = (department=='' || department==null) ? 1038 : department;
						} else { department = 1038; }

					}

				}
				
				operation = API.getListId('customlist89', dataIn.operation);
				location = API.getListId('location', dataIn.location);
				terms = API.getListId('term', dataIn.terms);
				
				if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
				if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
				if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
				if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		
				//if all data pass the validation return internal id of each records
				if(principal['error_code']==200 &&
				customer['error_code']==200 &&
				location['error_code']==200 &&
				operation['error_code']==200 &&
				terms['error_code']==200 &&
				creditlimit['error_code']==200) {
					
					data.type = dataIn.type;
					data.externalid = dataIn.externalid;
					data.customer=customer['internalid'];
					data.customer_name = customer['customer_name'];
					data.salesrep = creditlimit['salesrep'];
					data.creditlimit = creditlimit['creditlimit'];
					data.department = department;
					data.date=dataIn.date;
					data.memo = dataIn.memo;
					data.principal=principal['internalid'];
					data.principaltype = dataIn.principaltype;
					data.location=location['internalid'];
					data.operation=operation['internalid'];
					data.external_invoice=dataIn.external_invoice;
					data.terms = terms['internalid'];
					data.amount = dataIn.amount;
					
					/** get the discount rate and disregard texts **/
					var re = /[0-9.]{1,}/g;
					var disc = re.exec(dataIn.discount);
					data.discount = (disc==null) ? 0 : disc[0];
					
					data.discount_amount = dataIn.discount_amount;
					data.tax_amount = dataIn.tax_amount;
					data.net_amount = dataIn.net_amount;
					
					return data;
				} else { //return original data with error			
					originaldata.error = errorText;
					originaldata.itemString = dataIn.item;
					return originaldata;
				}
				
			/************ DATA NOT EXIST IN NETSUITE - END ************/	
			} else {
				originaldata.error = 'Transaction already Exists in Netsuite.';
				originaldata.itemString = dataIn.item;
				return originaldata;
			}
		} catch(err) {
			originaldata.error = err.message;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** SALES ORDER FUNCTION
	*/
	
	this.SALES_ORDER = function (dataIn) {
		var data = {}, department = '', errorText = '', originaldata = dataIn;
		
		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.external_invoice) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/
				
				principal = API.getListId('classification', dataIn.principal);
				
				if(principal['error_code']==200) {
					customer = 	API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
					if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';
					
					if(customer['error_code']==200) {
						creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
						if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
						if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';
						
						if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
							department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
							department = (department=='' || department==null) ? 1038 : department;
						} else { department = 1038; }
					
					}
				}
				
				operation = API.getListId('customlist89', dataIn.operation);
				location = API.getListId('location', dataIn.location);
				terms = API.getListId('term', dataIn.terms);
				
				if(terms['error_code']==404) errorText += terms['name']+' '+terms['message']+'.'+' ';
				if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
				if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
				if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
		
				item = API.getItemId('inventoryitem',dataIn.item, dataIn.principaltype);
				if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
				if(item['error_code']==200) uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
				if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
		
				//if all data pass the validation return internal id of each records
				if(principal['error_code'] == 200 &&
				customer['error_code'] == 200 &&
				location['error_code'] == 200 &&
				operation['error_code'] == 200 &&
				terms['error_code'] == 200 &&
				creditlimit['error_code'] == 200 &&
				item['error_code'] == 200 &&
				uom['error_code'] == 200) {
					
					data.type = dataIn.type;
					data.externalid = dataIn.externalid;
					data.customer = customer['internalid'];
					data.customer_name = customer['customer_name'];
					data.reporting_branch = customer['reporting_branch'];
					data.salesrep = creditlimit['salesrep'];
					data.department = department;
					data.date = dataIn.date;
					data.memo = dataIn.memo;
					data.principal = principal['internalid'];
					data.principaltype = dataIn.principaltype;
					data.location = location['internalid'];
					data.operation = operation['internalid'];
					data.external_invoice = dataIn.external_invoice;
					data.item = item['internalid'];
					data.item_name = item['item_name'];
					data.uom = uom['internalid'];
					data.qty = dataIn.quantity;
					data.rate = dataIn.rate;
					data.terms = terms['internalid'];
					data.amount = dataIn.amount;
					data.reason = dataIn.reason;
					
					/** get the discount rate and disregard texts **/
					var re = /[0-9.]{1,}/g;
					var disc = re.exec(dataIn.discount);
					data.discount = (disc==null) ? 0 : disc[0];
					
					data.tax_amount = dataIn.tax_amount;
					data.itemString = dataIn.item;
					return data;
				} else { //return original data with error
					originaldata.error = errorText;
					originaldata.itemString = dataIn.item;
					return originaldata;
				}
			
			/************ DATA DOES NOT EXIST IN NETSUITE - END ************/
			} else {
				originaldata.error = 'Transaction already Exists in Netsuite.';
				originaldata.itemString = dataIn.item;
				return originaldata;
			}
			
		} catch(err) {
			originaldata.error = err.message;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** PURCHASE ORDER FUNCTION
	*/
	
	this.PURCHASE_ORDER = function (dataIn) {
		var vendor = 719, //vendor id 719 = PROCTER & GAMBLE DISTRIBUTING (PHILS.), INC
        //var vendor = 16142, //vendor id 16142 = RPG DISTRIBUTION SERVICES, INC.
			terms = 5, //COD
			paymenttype = 2, //Later Payment
			data = {},
			originaldata = dataIn,
			errorText = ''; 
		
		try {
			principal = API.getListId('classification', dataIn.principal);
			location = API.getListId('location', dataIn.location);
			
			item = API.getItemId('item',dataIn.item, dataIn.principaltype);
			if(item['error_code']==200) uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
			if(item['error_code']==200 && uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';
	
			if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';
			if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
			if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
			
			if(principal['error_code']==200 &&
			   location['error_code']==200 &&
			   item['error_code']==200 &&
			   uom['error_code']==200) { 	
				
				data.type = dataIn.type;
				data.principaltype = dataIn.principaltype;
				data.externalid = dataIn.externalid;
				data.vendor = vendor; 
				data.vendor_name = dataIn.vendor;
				data.date = dataIn.date;
				data.remarks = dataIn.remarks;
				data.terms = terms;
				data.principal = principal['internalid'];
				data.location = location['internalid'];
				data.paymenttype = paymenttype;
				data.lineid = dataIn.lineid;
				data.item = item['internalid'];
				data.item_name = item['item_name'];
				data.itemString = dataIn.item;
				data.receivinglocation = location['internalid'];
				data.qty=dataIn.quantity;
				data.uom = uom['internalid'];
				data.unit_cost = dataIn.unit_cost;
				data.amount = dataIn.amount;
				data.discount_amount = dataIn.discount_amount;
				return data;
				
			} else { //return original data with error
				originaldata.itemString = dataIn.item;
				originaldata.error = errorText;
				return originaldata;
			}
		} catch(err) {
			originaldata.error = err.message;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** CREDIT MEMO FUNCTION
	*/
	
	this.CREDIT_MEMO = function (dataIn) {
		var department = '', data = {}, errorText = '', originaldata = dataIn;
		
		try {
			var columns = [ new nlobjSearchColumn('internalid') ];
			var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.externalid) ];
			var results = nlapiSearchRecord('transaction', null, filter, columns);
			
			if(results == null) {
			/************ DATA NOT EXIST IN NETSUITE - START ************/
			
				principal = API.getListId('classification', dataIn.principal);
				if(principal['error_code']==200) {
					customer = API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
					if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';	
					
					if(customer['error_code']==200) {
						creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
						if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
						if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';
						
						if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
							department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
							department = (department=='' || department==null) ? 1038 : department;
						} else { department = 1038; }
					}
				}
				
				operation = API.getListId('customlist89', dataIn.operation);
				location = API.getListId('location', dataIn.location);
				
				if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';		
				if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';
				if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';
				
				if(principal['error_code']==200 &&
				customer['error_code']==200 &&
				location['error_code']==200 &&
				operation['error_code']==200 &&
				creditlimit['error_code'] == 200) {
					
					data.type = dataIn.type;
					data.principaltype = dataIn.principaltype;
					data.externalid = dataIn.externalid;
					data.principal = principal['internalid'];
					data.customer = customer['internalid'];
					data.salesrep = creditlimit['salesrep'];
					data.department = department;
					data.date = dataIn.date;
					data.memo = dataIn.memo;
					data.location = location['internalid'];
					data.operation = operation['internalid'];
					data.amount = dataIn.amount;
					data.discount_amount = dataIn.discount_amount;
					data.tax_amount = dataIn.tax_amount;
					return data;
				} else { //return original data with error
					originaldata.error = errorText;
					originaldata.itemString = dataIn.item;
					return originaldata;
				}
			
			/************ DATA DOES NOT EXIST IN NETSUITE - END ************/
			} else {
				originaldata.error = 'Transaction already Exists in Netsuite.';
				originaldata.itemString = dataIn.item;
				return originaldata;
			}
			
		} catch(err) {
			originaldata.error = err.message;
			originaldata.itemString = dataIn.item;
			return originaldata;
		}
	};
	
	/********** END FUNCTION **********/
	
	/*
	** TRANSFER ORDER ( VAN LOADING ) FUNCTION
	*/
	
	this.TRANSFER_ORDER_VAN_LOADING = function (dataIn) {
		var department = '', data = {}, errorText = '', originaldata = dataIn, salesman = {};
		var columns = [ new nlobjSearchColumn('internalid') ];
        var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.externalid) ];
        var results = nlapiSearchRecord('transaction', null, filter, columns);

        if(results == null) {
          /************ DATA DOES NOT EXIST IN NETSUITE - START ************/

          try {
              principal = API.getListId('classification', dataIn.principal);
              location = API.getListId('location', dataIn.location);		
              operation = API.getListId('customlist89', dataIn.operation);

              if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
              if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';	
              if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';

              if(principal['error_code']==200) {
                  customer = API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
                  if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';

                  if(customer['error_code']==200) {
                      creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
                      if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
                      if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';

                      if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
                          department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
                          department = (department=='' || department==null) ? 1038 : department;
                      } else { department = 1038; }

                      item = API.getItemId('inventoryitem',dataIn.item, dataIn.principaltype);
                      if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';

                      if(item['error_code']==200) {
                          uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
                          if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

  //						if(customer['error_code']==200) {
                              salesman = API.getSalesManAndLocation('customer', customer['internalid']);
                              if(salesman['error_code']==200 && salesman['reportingbranch']=='') errorText += customer['customer_name']+' does not have reporting branch setup. ';
                              if(salesman['error_code']==200 && salesman['customerlocation']=='') errorText += customer['customer_name']+' does not have customer location setup. ';

                              if(salesman['error_code']==200 && salesman['reportingbranch']!='' && operation['error_code']==200) {
                                  //GET THE UNIT PRICE WITHOUT VAT
                                  //itempricing = API.getPricing(item['internalid'], salesman['reportingbranch'], operation['internalid']);
                                  //if(itempricing==null) {
                                  //	errorText += dataIn.item+' '+"does not have pricing setup. Kindly check customer's reporting branch and item pricelist. ";
                                  //} else {
                                      //var price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
                                 //   	var price_no_vat = parseFloat(parseFloat(dataIn.rate)/ 1.12).toFixed(10);
                                  //	var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
                                  //	var unit_price = price_no_vat * parseInt(conversion_factor);
                                  //}
                                      var price_no_vat = parseFloat(parseFloat(dataIn.rate)/ 1.12).toFixed(10);
                                      var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
                                      var unit_price = price_no_vat * parseInt(conversion_factor);
                              }
  //						}
                      }
                  }

              }

              if(principal['error_code']==200 &&
                 customer['error_code']==200 &&
                 operation['error_code']==200 &&
                 creditlimit['error_code']==200 &&
                 location['error_code']==200 &&
                 salesman['error_code']==200 &&
                 item['error_code']==200 &&
                 uom['error_code']==200) {

                  data.type = dataIn.type;
                  data.principaltype = dataIn.principaltype;
                  data.externalid = dataIn.externalid;
                  data.principal = principal['internalid'];
                  data.department = department;
                  data.customer = customer['internalid'];
                  data.date = dataIn.date;
                  data.memo = dataIn.memo;
                  data.fromlocation = location['internalid'];
                  data.customerlocation = salesman['customerlocation'];
                  data.reportingbranch = salesman['reportingbranch'];
                  data.operation = operation['internalid'];
                  data.item=item['internalid'];	
                  data.item_name=item['item_name'];
                  data.itemString = dataIn.item;
                  data.uom = uom['internalid'];
                  data.qty = dataIn.quantity;
                  data.unit_price = unit_price;

                  return data;
              } else { //return original data with error
                  originaldata.error = errorText;
                  originaldata.itemString = dataIn.item;
                  return originaldata;
              }
          } catch(err) { // EXCEPTION HANDLING
              originaldata.error = err.message;
              originaldata.itemString = dataIn.item;
              return originaldata;
          }
    	
          /************ DATA DOES NOT EXIST IN NETSUITE - END ************/
        } else {
          originaldata.error = 'Transaction already Exists in Netsuite.';
          originaldata.itemString = dataIn.item;
          return originaldata;
        }
      
	};
	
	/********** END FUNCTION **********/
	
	/*
	** TRANSFER ORDER ( VAN RETURN ) FUNCTION
	*/
	
	this.TRANSFER_ORDER_VAN_RETURN = function (dataIn) {
		var department = '', data = {}, errorText = '', originaldata = dataIn, salesman = {};
		var columns = [ new nlobjSearchColumn('internalid') ];
        var filter = [ new nlobjSearchFilter('custbody178', null, 'is', dataIn.externalid) ];
        var results = nlapiSearchRecord('transaction', null, filter, columns);

        if(results == null) {
          /************ DATA DOES NOT EXIST IN NETSUITE - START ************/

          try {
              principal = API.getListId('classification', dataIn.principal);
              location = getListId('location', dataIn.location);		
              operation = getListId('customlist89', dataIn.operation);

              if(principal['error_code']==404) errorText += principal['name']+' '+principal['message']+'.'+' ';
              if(location['error_code']==404) errorText += location['name']+' '+location['message']+'.'+' ';	
              if(operation['error_code']==404) errorText += operation['name']+' '+operation['message']+'.'+' ';

              if(principal['error_code']==200) {
                  customer = API.getCustomerId('customrecord400', dataIn.customer, dataIn.principal);
                  if(customer['error_code']==404) errorText += customer['name']+' '+customer['message']+'.'+' ';

                  if(customer['error_code']==200) {
                      creditlimit = API.customerCreditLimit(customer['internalid'],principal['internalid']);
                      if(creditlimit['error_code']==404) errorText+= creditlimit['message']+'.'+' ';
                      if(creditlimit['error_code']==200 && creditlimit['salesrep']=='') errorText+= customer['customer_name']+'does not have sales representative setup. ';

                      if(creditlimit['error_code']==200 && creditlimit['salesrep']!='') {
                          department = nlapiLookupField('employee', creditlimit['salesrep'], 'department', false);
                          department = (department=='' || department==null) ? 1038 : department;
                      } else { department = 1038; }

                      item = API.getItemId('inventoryitem',dataIn.item, dataIn.principaltype);
                      if(item['error_code']==404) errorText += item['name']+' '+item['message']+'.'+' ';

                      if(item['error_code']==200) {
                          uom = API.getUOM('unitstype', item['unit'], dataIn.uom);
                          if(uom['error_code']==404) errorText += uom['name']+' '+uom['message']+'.'+' ';

  //						if(customer['error_code']==200) {
                              salesman = API.getSalesManAndLocation('customer', customer['internalid']);
                              if(salesman['error_code']==200 && salesman['reportingbranch']=='') errorText += customer['customer_name']+' does not have reporting branch setup. ';
                              if(salesman['error_code']==200 && salesman['customerlocation']=='') errorText += customer['customer_name']+' does not have customer location setup. ';

                              if(salesman['error_code']==200 && salesman['reportingbranch']!='' && operation['error_code']==200) {
                                  //GET THE UNIT PRICE WITHOUT VAT
                                  //itempricing = API.getPricing(item['internalid'], salesman['reportingbranch'], operation['internalid']);
                                  //if(itempricing==null) {
                                  //	errorText += dataIn.item+' '+"does not have pricing setup. Kindly check customer's reporting branch and item pricelist. ";
                                  //} else {
                                      //var price_no_vat = parseFloat((itempricing[0].getValue('custrecord768'))/ 1.12).toFixed(10);
                                  //  	var price_no_vat = parseFloat(parseFloat(dataIn.rate)/ 1.12).toFixed(10);
                                  //	var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
                                  //	var unit_price = price_no_vat * parseInt(conversion_factor);
                                  //}
                                      var price_no_vat = parseFloat(parseFloat(dataIn.rate)/ 1.12).toFixed(10);
                                      var conversion_factor = API.conversionRate(item['unit'], uom['abbreviation']);
                                      var unit_price = price_no_vat * parseInt(conversion_factor);
                              }
  //						}
                      }
                  }

              }


              if(principal['error_code']==200 &&
                 customer['error_code']==200 &&
                 operation['error_code']==200 &&
                 creditlimit['error_code']==200 &&
                 location['error_code']==200 &&
                 salesman['error_code']==200 &&
                 item['error_code']==200 &&
                 uom['error_code']==200) {

                  data.type = dataIn.type;
                  data.principaltype = dataIn.principaltype;
                  data.externalid = dataIn.externalid;
                  data.principal = principal['internalid'];
                  data.department = department;
                  data.customer = customer['internalid'];
                  data.date = dataIn.date;
                  data.memo = dataIn.memo;
                  data.fromlocation = location['internalid'];
                  data.customerlocation = salesman['customerlocation'];
                  data.reportingbranch = salesman['reportingbranch'];
                  data.operation = operation['internalid'];
                  data.item=item['internalid'];	
                  data.item_name=item['item_name'];
                  data.itemString = dataIn.item;
                  data.uom = uom['internalid'];
                  data.qty = dataIn.quantity;
                  data.unit_price = unit_price;

                  return data;
              } else { //return original data with error
                  originaldata.error = errorText;
                  originaldata.itemString = dataIn.item;
                  return originaldata;
              }
          } catch(err) { // EXCEPTION HANDLING
              originaldata.error = err.message;
              originaldata.itemString = dataIn.item;
              return originaldata;
          }
            /************ DATA DOES NOT EXIST IN NETSUITE - END ************/
        } else {
          originaldata.error = 'Transaction already Exists in Netsuite.';
          originaldata.itemString = dataIn.item;
          return originaldata;
        }
      
	};

};
