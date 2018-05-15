/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Nov 2015     Brian
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	if(request.getMethod()=='GET') {
		//GET REQUEST
		var form = nlapiCreateForm("FILTER");
	
		form.addField('custpage_datefrom', 'date', 'From Date');		
		form.addField('custpage_dateto', 'date', 'To Date');
		var recordtype = form.addField('recordtype', 'select', 'Record Type');
		recordtype.addSelectOption('invoice', 'Invoice', true);
		recordtype.addSelectOption('returnauthorization', 'Return Authorization', false);
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
			var from = request.getParameter('custpage_datefrom');
			var to = request.getParameter('custpage_dateto');
			var location = request.getParameter('location');
			var principal = request.getParameter('class');
			var recordtype = request.getParameter('recordtype');
			var form, sublist, result;
			
			nlapiLogExecution('ERROR', 'class', principal);
			
			if(recordtype=='invoice') {
				form = nlapiCreateForm('List of Invoices to be Exported');
				sublist = form.addSubList('invoices', 'list', 'Invoices');
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
				
				result = nlapiSearchRecord(null, 'customsearch1475', filter, columns); //Performs query
				
			} else {
				form = nlapiCreateForm('List of Returns to be Exported');
				sublist = form.addSubList('returns', 'list', 'Return Authorizations');
				sublist.addMarkAllButtons();
				sublist.addRefreshButton();
				sublist.addField('ifpick', 'checkbox', 'Pick');
				var internal = sublist.addField('internalid', 'text', 'Internal Id');
				internal.setDisplayType('hidden');
				sublist.addField('tranid', 'text', "Rtn. Auth. #");
				sublist.addField('entity_display', 'text', 'Customer');
				sublist.addField('trandate', 'date', "Date");
				sublist.addField('class_display', 'text', "Principal");
				sublist.addField('custbody69_display', 'text', "Operation");
				sublist.addField('amount', 'text', "Amount");
				
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
				
				result = nlapiSearchRecord(null, 'customsearch1527', filter, columns);
				
			}
			
			sublist.setLineItemValues(result);
			form.addSubmitButton('EXPORT DATA');
			
			//set session object
			nlapiGetContext().setSessionObject('status', 'POST');
			nlapiGetContext().setSessionObject('class', principal);
			nlapiGetContext().setSessionObject('recordtype', recordtype);
			nlapiGetContext().setSessionObject('location', location);
			
			response.writePage(form);
		} else {
			//POST REQUEST
			var principal = nlapiGetContext().getSessionObject('class');
			var recordtype = nlapiGetContext().getSessionObject('recordtype');
			var location = nlapiGetContext().getSessionObject('location');
			
			var data;
			if(principal == 7) {
				exporter = new pgClassTemplate();
				data = exporter._EXPORT_DATA(request, recordtype, principal, location);
//				data = exportInvoices(request, principal);
			} else {
				exporter = new dmpiClassTemplate();
				data = exporter._EXPORT_DATA(request, recordtype, principal, location);
//				data = exportIRA(request, principal, location);
			}
				
			var file = nlapiCreateFile('result.csv', 'CSV', data);
			response.setContentType(file.getType(), 'result.csv');
			response.write(file.getValue());		
		}
	}
}// end function
