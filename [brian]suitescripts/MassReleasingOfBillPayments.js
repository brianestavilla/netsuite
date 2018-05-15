/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Dec 2016     Dranix
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

	/**
	** SAVE SEARCHES SANDBOX
	**	customsearch1860 = Release Checks with JE
	** 	customsearch1859 = Mass Releasing of Bill Payment Save Search
	**	customsearch1862 = Bill for Release Report
	**/ 

	/**
	** SAVE SEARCHES PRODUCTION
	**	customsearch1860 = Release Checks with JE
	** 	customsearch1859_2 = Mass Releasing of Bill Payment Save Search
	**	customsearch1862_2 = Bill for Release Report
	**/ 

function suitelet(request, response) {
	if(request.getMethod()=='GET') {
		//GET REQUEST
		var form = nlapiCreateForm("FILTER");

		form.addField('custpage_datefrom', 'date', 'From Date');		
		form.addField('custpage_dateto', 'date', 'To Date');
		form.addField('account', 'select', 'Account','account').setDefaultValue('1405');//.setDisplayType('inline');
		
		//Released Check lists
		form.addField("enterempslink", "url", "").setDisplayType( "inline" ).setLinkText("Released Checks Lists").setDefaultValue('https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchid=1993&whence=');
		form.addField("enterempslink1", "url", "").setDisplayType( "inline" ).setLinkText(" ").setDefaultValue('');
				
		form.addSubmitButton('SUBMIT');
		
		var printAPV = "printAPV = window.open('" + nlapiResolveURL('SUITELET', 'customscript677', 'customdeploy1') + "&l=t', 'printAPV'); printAPV.focus();";
		form.addButton('summarybanktransfer', 'RELEASE SAVED BILL PAYMENTS', printAPV);
		
		//set session object
		nlapiGetContext().setSessionObject('status', 'GET');
		response.writePage(form);
	} else {
		// POST REQUEST
		if(nlapiGetContext().getSessionObject('status') =='GET') {
			var from = request.getParameter('custpage_datefrom');
			var to = request.getParameter('custpage_dateto');
			var account = request.getParameter('account');
			var form, sublist;
			
			form = nlapiCreateForm('Lists of Bill Payment to be Released');
			sublist = form.addSubList('payments', 'list', 'Bill Payments');
			sublist.addMarkAllButtons();
			sublist.addRefreshButton();
			sublist.addField('ifpick', 'checkbox', 'Pick');
			var internal = sublist.addField('internalid', 'text', 'Internal Id');
			internal.setDisplayType('hidden');
			sublist.addField('tranid', 'text', "Bill Payment#");
			sublist.addField('entity_display', 'text', 'Vendor');
			sublist.addField('trandate', 'date', "date");
			sublist.addField('department_display', 'text', "Department");
			sublist.addField('class_display', 'text', "Principal");
			sublist.addField('location_display', 'text', "Location");
			sublist.addField('account_display', 'text', "Account");
			sublist.addField('amount', 'text', "Amount");
			
			var columns = [
	           new nlobjSearchColumn('internalid'),
	           new nlobjSearchColumn('tranid'),
	           new nlobjSearchColumn('entity'),
	           new nlobjSearchColumn('trandate'),
	           new nlobjSearchColumn('department'),
	           new nlobjSearchColumn('class'),
	           new nlobjSearchColumn('location'),
	           new nlobjSearchColumn('account'),
	           new nlobjSearchColumn('amount')
            ];
			
			columns[0].setSort(true);	
			
			filter = [
	          new nlobjSearchFilter('account', null, 'anyof', account),
	          new nlobjSearchFilter('trandate', null, 'within', from, to),
	          new nlobjSearchFilter('custbody217', null, 'is', ''),
	        ];
			
			result = nlapiSearchRecord(null, 'customsearch1859_2', filter, columns); //production : customsearch1859_2; sandbox : customsearch1859
			
			var internalids = '', total = 0;
			if(result != null) {
				for(var i=0; i<result.length; i++) {
					sublist.setLineItemValue('ifpick', i+1, 'T');
					sublist.setLineItemValue('internalid', i+1, result[i].getValue('internalid'));
					sublist.setLineItemValue('tranid', i+1, result[i].getValue('tranid'));
					sublist.setLineItemValue('entity_display', i+1, result[i].getText('entity'));
					sublist.setLineItemValue('trandate', i+1, result[i].getValue('trandate'));
					sublist.setLineItemValue('department_display', i+1, result[i].getText('department'));
					sublist.setLineItemValue('class_display', i+1, result[i].getText('class'));
					sublist.setLineItemValue('location_display', i+1, result[i].getText('location'));
					sublist.setLineItemValue('account_display', i+1, result[i].getText('account'));
					sublist.setLineItemValue('amount', i+1, Math.abs(result[i].getValue('amount')));
					total += Math.abs(result[i].getValue('amount'));
					internalids+= result[i].getValue('internalid');
					if(i != result.length) { internalids+="_"; }
				}
				var hml = form.addField('htmltotal', 'inlinehtml');
				hml.setDefaultValue("<span style='font-size:20px; float:right;'> <b>TOTAL AMOUNT:</b> Php "+parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</span>");

				form.setScript('customscript671'); //production
//				form.setScript('customscript673'); //sandbox
				
				form.addSubmitButton('PREVIEW BILLS');
			} else {
				form.addSubmitButton('PREVIEW BILLS').setDisabled(true);
			}			
			
			//set session object
			nlapiGetContext().setSessionObject('status', 'ANOTHER_GET');			
			response.writePage(form);
			
		} else {
			var form, url, internalids = '', arr = [];
			
			if(nlapiGetContext().getSessionObject('status') =='ANOTHER_GET') {
				for(var i=1; i<=request.getLineItemCount('payments'); i++) {
					if(request.getLineItemValue('payments', 'ifpick', i) == 'T') {
						internalids+= request.getLineItemValue('payments','internalid',i);
						if(i != request.getLineItemCount('payments')) { internalids+="_"; }
					}
				}
				
				form = nlapiCreateForm('Lists of Bills to be Released');
				
//				form.setScript('customscript671'); //production
				form.setScript('customscript673'); //sandbox
				
				var sublist = form.addSubList('bills', 'list', 'Bills');
				
				var internal = sublist.addField('internalid', 'text', 'Internal Id'); // bill internalid
				internal.setDisplayType('hidden');
				sublist.addField('custbody214', 'text', "Account"); // bill debitting account
				sublist.addField('dm_cm_num', 'text', "DM/CM Reference #").setDisplayType('entry').setMandatory(true); //DM Reference#
				sublist.addField('location', 'text', "Location"); // bill location
				sublist.addField('amount', 'text', "Amount"); // bill total
//				sublist.addField('cmnum', 'text', "CM Reference #").setDisplayType('entry').setMandatory(true); //CM Reference#
				
				var columns = new Array (
					new nlobjSearchColumn('custbody214'), //bill debitting account
					new nlobjSearchColumn('amount'), //bill total
					new nlobjSearchColumn('location') //bill location
				);
				
				var recIDs = internalids.split('_');
				var index = recIDs.indexOf('');
				
				/**
				** REMOVE EMPTY VALUES IN THE ARRAY - START
				**/
				
				if(index > -1) {
					recIDs.splice(index, 1);
				}
				
				var filter = [ new nlobjSearchFilter('custbody192', null, 'anyof', recIDs) ];
				
				var result = nlapiSearchRecord(null, 'customsearch1862_2', filter, columns);
				var data_array = [];
				
				/** GROUP PER ACCOUNTS - START **/
				
				if(result != null) {
					for(var j=0; j<result.length; j++) {				
						var found = data_array.some(function (res) { return res.custbody214 === result[j].getText('custbody214'); });
						
						  if(found) {
						  	for(var i=0; i<data_array.length; i++) {
						        if(data_array[i].custbody214 == result[j].getText('custbody214')) {
						        	data_array[i].amount += parseFloat(result[j].getValue('amount'));
						          break;
						        }
						    }
						  } else {
							  data_array.push({
								  	'custbody214': result[j].getText('custbody214'),
								  	'location': result[j].getText('location'),
									'amount' : parseFloat(result[j].getValue('amount'))
								});
						  }
						
					}
					sublist.setLineItemValues(data_array);
				}
				
				/** GROUP PER ACCOUNTS - END **/
				
				form.addSubmitButton('RELEASE');
				var printAPV = "printAPV = window.open('" + nlapiResolveURL('SUITELET', 'customscript675', 'customdeploy1') + "&internalid="+internalids+"&type="+'fundTransferSummary'+"&l=t', 'printAPV'); printAPV.focus();";
				form.addButton('summarybanktransfer', 'SUMMARY BANK TRANSFER', printAPV);
				var printSavePayment = "var conf = confirm('Are you sure you want to save this Transaction?'); if(conf) { printSavePayment = window.open('" + nlapiResolveURL('SUITELET', 'customscript675', 'customdeploy1') + "&internalid="+internalids+"&type="+'saveTransaction'+"&l=t', 'printSavePayment'); window.location.href='https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=672&deploy=1&compid=3625074&whence='; }";
				form.addButton('savetransaction', 'SAVE', printSavePayment);
				
				//set session object
				nlapiGetContext().setSessionObject('status', 'POST');	
				nlapiGetContext().setSessionObject('internalids', internalids);
				
				response.writePage(form);
			} else {
				//POST
				var arr = {};
				for(var i=1; i<=request.getLineItemCount('bills'); i++) {
					arr[request.getLineItemValue('bills', 'custbody214', i)]= {
							"dm_cm_num" : request.getLineItemValue('bills', 'dm_cm_num', i),	
//							"dmnum" : request.getLineItemValue('bills', 'dmnum', i)
					};
				}
				
				var payment_ids = nlapiGetContext().getSessionObject('internalids');
				
				//url = 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=674&deploy=1';
				url = 'https://rest.na2.netsuite.com/app/site/hosting/restlet.nl?script=674&deploy=1';
				
				var record = nlapiRequestURL(url+'&ids='+payment_ids+'&billaccounts='+JSON.stringify(arr), null, header(),null,null);
				form = nlapiCreateForm(' ');
				var data = JSON.parse(record.getBody());

				var hml = form.addField('htmltotal', 'inlinehtml');
				
				if(data.error_code == 200) {
					hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
							"<h1 style='font-size:18px;'>"+data.message+"</h1><br>" +
							"<a href='https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=672&deploy=1&compid=3625074&whence='>Back</a>"+
							"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
							"<a href='https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchid=1913&whence='>View Released Checks</a>" +
							"</div>");
				
//					hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
//							"<h1 style='font-size:18px;'>"+data.message+"</h1><br>" +
//							"<a href='https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=672&deploy=1&compid=3625074&whence='>Back</a>"+
//							"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
//							"<a href='https://system.sandbox.netsuite.com/app/common/search/searchresults.nl?searchid=1860&whence='>View Released Checks</a>" +
//							"</div>");
				} else {
					hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#d9534f; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
							"<h1 style='font-size:18px; font-style:italic;'>"+data.message+"</h1><br>" +
							"<a href='https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=672&deploy=1&compid=3625074&whence='>Back</a>"+
							"</div>");
//					hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#d9534f; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
//							"<h1 style='font-size:18px; font-style:italic;'>"+data.message+"</h1><br>" +
//							"<a href='https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=672&deploy=1&compid=3625074&whence='>Back</a>"+
//							"</div>");
				}
				
				response.writePage(form);
			}
		}
	}
	
}

function header() {
	return {
		"User-Agent-x": "SuiteScript-Call",
        "Authorization": "NLAuth nlauth_account=3625074, nlauth_email=brianestavilla@gmail.com, nlauth_signature=March21993, nlauth_role=3",
        "Content-Type": "application/json"
    };	
}

