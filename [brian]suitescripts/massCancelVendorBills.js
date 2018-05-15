/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2015     Dranix
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function suitelet(request, response){

	if(request.getMethod()=='GET') {
		var form = nlapiCreateForm("Filter By Date");
	
		form.addField('custpage_datefrom', 'date', 'From Date');		
		form.addField('custpage_dateto', 'date', 'To Date');		
		
		form.addSubmitButton('Submit' );
		
		//set session object
		nlapiGetContext().setSessionObject('status', 'GET');	
		
		response.writePage(form);
	} else {
		//PARENT POST CALL
			if(nlapiGetContext().getSessionObject('status') =='GET') {
				var from = request.getParameter('custpage_datefrom');
				var to = request.getParameter('custpage_dateto');
				var form = nlapiCreateForm('Mass Cancellation of Vendor Bill');
				
				//Create Sub List
			
				var sublist = form.addSubList('pendingsublist', 'list', 'Pending Bills');
				sublist.addMarkAllButtons();
				sublist.addRefreshButton();
				sublist.addField('ifpick', 'checkbox', 'Pick');
				var internal = sublist.addField('internalid', 'text', 'Internal Id');
				internal.setDisplayType('hidden');
				sublist.addField('custbody37', 'text', 'APV No.');
				sublist.addField('name_display', 'text', 'Name');
				sublist.addField('tranid', 'text', "Supplier's Invoice No.");
				sublist.addField('custbody51_display', 'text', 'Nontrade Subtype');
				sublist.addField('trandate', 'date', "date");
				sublist.addField('amount', 'text', "Amount");
				sublist.addField('status_display', 'text', "Status");
				
				var savesearchid = 'customsearch1419';// sandbox internalid = customsearch1413
					
				//Specific Columns for the List
				var columns = [new nlobjSearchColumn('internalid'),
								new nlobjSearchColumn('custbody37'),
								new nlobjSearchColumn('name'),
								new nlobjSearchColumn('tranid'),
								new nlobjSearchColumn('custbody51'),
								new nlobjSearchColumn('trandate'),
								new nlobjSearchColumn('amount'),
								new nlobjSearchColumn('status')
								];
				columns[0].setSort(true);
				filter = [new nlobjSearchFilter('approvalstatus', null, 'anyof', '1'),
							new nlobjSearchFilter('trandate', null, 'within', from,to)]; // pending approval
				var result = nlapiSearchRecord(null, savesearchid, filter, columns); //Performs query
				
				sublist.setLineItemValues(result);
				
				form.addSubmitButton('Submit' );
				
				//set session object
				nlapiGetContext().setSessionObject('status', 'POST');	
				
				response.writePage(form);
			} else {
				var recordtype = 'vendorbill';
				var pendingcount = request.getLineItemCount('pendingsublist');
				var recordidpending = 0;
				
				/**
				**	Cancel/Reject Pending Bills
				**/
				
				if(pendingcount>0)
				{
					
					for(var i=1; i<=pendingcount; i++)
					{
						if(request.getLineItemValue('pendingsublist', 'ifpick', i) == 'T') {
							recordidpending = request.getLineItemValue('pendingsublist', 'internalid', i);
							var record = nlapiLoadRecord(recordtype,recordidpending);
							var approvedbypending = record.getFieldValue('custbody154');
							var checkedbypending = record.getFieldValue('custbody115');
							
							record.setFieldValue('custbody154', approvedbypending);
							record.setFieldValue('custbody115', checkedbypending);
							record.setFieldValue('status', 'Cancelled');
							record.setFieldValue('approvalstatus', '3');
							nlapiSubmitRecord(record, true);	
						}
					}
				}
				
				response.write('Record(s) successfully cancelled.');
//				
				//set session object
//				nlapiGetContext().setSessionObject('status', 'GET');	
			}
	}
}
