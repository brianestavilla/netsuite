/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Feb 2017     Dranix
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	if(request.getMethod()=='GET') {
		
		var col = new nlobjSearchColumn('custbody217', null, 'group');
		var fil = [
           new nlobjSearchFilter('custbody209', null, 'is', '@NONE@'), // JE REF No
           new nlobjSearchFilter('custbody217', null, 'isnot', ''), // Batch No
           new nlobjSearchFilter('custbody212', null, 'is', 'T'), // Release
           new nlobjSearchFilter('status', null, 'noneof', 'VendPymt:V'), // VendPymt:V = Void
           new nlobjSearchFilter('mainline', null, 'is', 'T')
		];		
		var result = nlapiSearchRecord('vendorpayment',null, fil, col);
		
		if(result!= null) {
			var form = nlapiCreateForm("FILTER BATCH #");
			var batchno = form.addField('batchno', 'select', 'Batch No');
			for(var i=0; i<result.length; i++) {
				batchno.addSelectOption(result[i].getValue('custbody217', null, 'group'), result[i].getValue('custbody217', null, 'group'), false);
			}
			
			//Released Check lists
			form.addField("enterempslink1", "url", "").setDisplayType( "inline" ).setLinkText("Save Bill Payments Lists").setDefaultValue('https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchid=1968&saverun=T&whence=');	

			form.addSubmitButton('SUBMIT');
		} else {
			var form = nlapiCreateForm(" ");
			var hml = form.addField('htmltotal', 'inlinehtml');
				hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
				"<h1 style='font-size:18px;'>No Save Transaction</h1><br>" +
				"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
				"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");
		}
		
		nlapiGetContext().setSessionObject('status', 'ANOTHER_GET');
		response.writePage(form);
	} else {
		if(nlapiGetContext().getSessionObject('status') == 'ANOTHER_GET') {
			var form = nlapiCreateForm('Lists of Bills to be Released');
			var batchno = request.getParameter('batchno');
			var col = new nlobjSearchColumn('internalid');
			var fil = [
	           new nlobjSearchFilter('custbody209', null, 'is', '@NONE@'), // JE REF No
	           new nlobjSearchFilter('custbody217', null, 'is', batchno), // Batch No
	           new nlobjSearchFilter('custbody212', null, 'is', 'T'), // Release
	           new nlobjSearchFilter('mainline', null, 'is', 'T')
			];
			
			var result = nlapiSearchRecord('vendorpayment',null, fil, col);
			var internalids='';
			
			for(var i=0; i<result.length; i++) {
					internalids+= result[i].getValue('internalid');
					if(i != result.length) { internalids+="_"; }
			}
			
		
			
			form.setScript('customscript671'); //production
//			form.setScript('customscript673'); //sandbox
			
			var sublist = form.addSubList('bills', 'list', 'Bills');
			
			var internal = sublist.addField('internalid', 'text', 'Internal Id'); // bill internalid
			internal.setDisplayType('hidden');
			sublist.addField('custbody214', 'text', "Account"); // bill debitting account
			sublist.addField('dm_cm_num', 'text', "DM/CM Reference #").setDisplayType('entry').setMandatory(true); //DM Reference#
			sublist.addField('location', 'text', "Location"); // bill location
			sublist.addField('amount', 'text', "Amount"); // bill total
//			sublist.addField('cmnum', 'text', "CM Reference #").setDisplayType('entry').setMandatory(true); //CM Reference#
			
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
			
			form.addSubmitButton('RELEASE');
			
			var printAPV = "printAPV = window.open('" + nlapiResolveURL('SUITELET', 'customscript675', 'customdeploy1') + "&internalid="+internalids+"&type="+'fundTransferSummary'+"&l=t', 'printAPV'); printAPV.focus();";
			form.addButton('summarybanktransfer', 'SUMMARY BANK TRANSFER', printAPV);
			
			nlapiGetContext().setSessionObject('status', 'POST');	
			nlapiGetContext().setSessionObject('internalids', internalids);
			response.writePage(form);
		} else {
			var arr = {};
			for(var i=1; i<=request.getLineItemCount('bills'); i++) {
				arr[request.getLineItemValue('bills', 'custbody214', i)]= {
						"dm_cm_num" : request.getLineItemValue('bills', 'dm_cm_num', i),	
//						"dmnum" : request.getLineItemValue('bills', 'dmnum', i)
				};
			}
			
			var payment_ids = nlapiGetContext().getSessionObject('internalids');
			
//			url = 'https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=674&deploy=1';
			url = 'https://rest.na2.netsuite.com/app/site/hosting/restlet.nl?script=674&deploy=1';
			
			var record = nlapiRequestURL(url+'&ids='+payment_ids+'&billaccounts='+JSON.stringify(arr), null, header(),null,null);
			var form = nlapiCreateForm(' ');
			var data = JSON.parse(record.getBody());

			var hml = form.addField('htmltotal', 'inlinehtml');
			
			if(data.error_code == 200) {
				hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
						"<h1 style='font-size:18px;'>"+data.message+"</h1><br>" +
						"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
						"<a href='https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchid=1913&whence='>View Released Checks</a>" +
						"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");
			
//				hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
//						"<h1 style='font-size:18px;'>"+data.message+"</h1><br>" +
//						"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
//						"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
//						"<a href='https://system.sandbox.netsuite.com/app/common/search/searchresults.nl?searchid=1860&whence='>View Released Checks</a>" +
//						"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");
			
			} else {
				
				hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#d9534f; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
						"<h1 style='font-size:18px; font-style:italic;'>"+data.message+"</h1><br>" +
						"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
						"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");
//				hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#d9534f; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
//						"<h1 style='font-size:18px; font-style:italic;'>"+data.message+"</h1><br>" +
//						"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
//						"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");
			
			}
			
			response.writePage(form);
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
