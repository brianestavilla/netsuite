/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Feb 2016     user
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

var from, to, location, principal, amount, discount, net, internal_id, gross;
function suitelet(request, response)
{
	if(request.getMethod()=='GET') {
		//GET REQUEST
		var form = nlapiCreateForm("Filter Invoices");
	
		form.addField('custpage_datefrom', 'date', 'From Date');		
		form.addField('custpage_dateto', 'date', 'To Date');
		form.addField('class', 'select', 'Principal','classification');
		var loc = form.addField('location', 'select', 'Location', 'location');
		loc.setDefaultValue(nlapiLookupField('employee', nlapiGetUser(), 'custentity39'));
		
		form.addSubmitButton('Submit' );
		
		//set session object
		nlapiGetContext().setSessionObject('status', 'GET');	
		
		response.writePage(form);
	} else {
		// POST REQUEST
		if(nlapiGetContext().getSessionObject('status') =='GET') {
			//ANOTHER GET REQUEST
			from = request.getParameter('custpage_datefrom');
			to = request.getParameter('custpage_dateto');
			location = request.getParameter('location');
			principal = request.getParameter('class');
			
			var form = nlapiCreateForm('List of Invoices to be Exported');
			var sublist = form.addSubList('invoices', 'list', 'Invoices');
			sublist.addMarkAllButtons();
			sublist.addRefreshButton();
			sublist.addField('ifpick', 'checkbox', 'Pick');
			var internal = sublist.addField('internalid', 'text', 'Internal Id');
			internal.setDisplayType('hidden');
			sublist.addField('tranid', 'text', "Invoice No.");
			sublist.addField('entity_display', 'text', 'Customer');
			sublist.addField('trandate', 'date', "date");
			sublist.addField('class_display', 'text', "Principal");
			sublist.addField('custbody69_display', 'text', "Operation");
			sublist.addField('amount', 'text', "Amount");
			sublist.addField('discount', 'text', 'Discount');
			sublist.addField('net', 'text', 'Net');
			sublist.addField('gross', 'text', 'Gross');
			
			var columns = [new nlobjSearchColumn('internalid'),
			               new nlobjSearchColumn('tranid'),
			               new nlobjSearchColumn('entity'),
			               new nlobjSearchColumn('trandate'),
			               new nlobjSearchColumn('class'),
			               new nlobjSearchColumn('custbody69'),
			               new nlobjSearchColumn('amount')
			               ];
			columns[0].setSort(true);
			
			filter = [new nlobjSearchFilter('location', null, 'anyof', location),
			          new nlobjSearchFilter('trandate', null, 'within', from, to)];
			
			var result = nlapiSearchRecord(null, 'customsearch1475', filter, columns); //Performs query
			
			var object =  new Array();
		
			//check if result is null
			if(result != null) {
				//1st loop get all internal id
				for(var i=0,counter=result.length; i<counter; i++) {
					//push array object to sent to post method
					object['internal_id'] = object.push({"internal_id":result[i].getValue('internalid')});
				}
				
				//Stringifying JSON
				var myJSONText = JSON.stringify(object);
				var amount_get = getURL(myJSONText);
				var test =  amount_get.getBody();
				var json =  JSON.parse(test);
				
				var record_csv = new Array();
				//2nd loop add data to sublists
				for(var i=0,counter=result.length; i<counter; i++) {
					for(var j =0, len = json.length; j< len; j++ ){
						sublist.setLineItemValue('internalid',i+1,result[i].getValue('internalid'));
						sublist.setLineItemValue('tranid',i+1,result[i].getValue('tranid'));
						sublist.setLineItemValue('entity_display',i+1,result[i].getText('entity'));
						sublist.setLineItemValue('class_display',i+1,result[i].getText('class'));
						sublist.setLineItemValue('trandate',i+1,result[i].getValue('trandate'));
						sublist.setLineItemValue('custbody69_display',i+1,result[i].getText('custbody69'));
						//compare
						if(result[i].getValue('internalid') == json[j].internal_id) {
							sublist.setLineItemValue('amount',i+1,json[j].amount);
							sublist.setLineItemValue('discount',i+1,json[j].discount);
							sublist.setLineItemValue('net',i+1,json[j].net);
							sublist.setLineItemValue('gross',i+1,json[j].gross);
						}
					}	
				}
			}
			
			form.addSubmitButton('EXPORT DATA');
			
			var data_string = JSON.stringify(record_csv);
			//set session object
			nlapiGetContext().setSessionObject('status', 'POST');
			nlapiGetContext().setSessionObject('class', principal);
			response.writePage(form);
		} else {
			//POST REQUEST
			var principal = nlapiGetContext().getSessionObject('class');
			var invoice, customer, date, principal, operation, amount, discount, net, gross;
			var data ='"INVOICE","CUTOMER","DATE","PRINCIPAL","OPERATION","AMOUNT","DISCOUNT","NET","GROSS"\n';
			var counter = request.getLineItemCount('invoices');
			for(var i=1; i<=counter; i++) {
				
				if(request.getLineItemValue('invoices','ifpick', i)=='T') {
					invoice = request.getLineItemValue('invoices','tranid',i);
					customer = request.getLineItemValue('invoices','entity_display',i);
					date = request.getLineItemValue('invoices','trandate',i);
					principal = request.getLineItemValue('invoices','class_display',i);
					operation = request.getLineItemValue('invoices','custbody69_display',i);
					amount = request.getLineItemValue('invoices','amount',i);
					discount = request.getLineItemValue('invoices','discount',i);
					net = request.getLineItemValue('invoices','net',i);
					gross = request.getLineItemValue('invoices','gross',i);
					data += invoice;
					data += ',';
					data += customer;
					data += ',';
					data += date;
					data += ',';
					data += principal;
					data += ',';
					data += operation;
					data += ',';
					data += (amount == null) ? "" : amount;
					data += ',';
					data += (discount == null) ? "" : discount;
					data += ',';
					data += (net == null) ? "" : net;
					data += ',';
					data += (gross == null) ? "" : gross;
					data += ',';
					data +='\n';	
				}
				
			}// end for loop		
			 var file = nlapiCreateFile('result.csv', 'CSV', data);
			 response.setContentType(file.getType(), 'result.csv');
			 response.write(file.getValue());		
		}
	}
}// end function


function Log(id, value) {
	nlapiLogExecution('DEBUG', id, value);
}

var CONFIG = {
	ip: "http://",
	host: "integrator.goldenkaizen.com.ph",
	headers: {
		content_type: "application/x-www-form-urlencoded",
		//content_type: "application/json",
		//Authorization gso8412@gmail.com:discount
		authorization: "Basic Z3NvODQxMkBnbWFpbC5jb206ZGlzY291bnQ="		
	}
}

function getHeaders()
{
	var email = nlapiGetContext().getEmail();
	var headers = new Array();
		headers['Content-Type'] = CONFIG.headers.content_type;
		headers['Authorization'] = CONFIG.headers.authorization;
	return headers;
}

function getURL(internal_id)
{
	var headers = getHeaders();
	var url = "http://integrator.goldenkaizen.com.ph/api/v2/discounts/si/get/amount?internal_id="+internal_id;
	return nlapiRequestURL(url, null, headers, null, 'GET');
}


