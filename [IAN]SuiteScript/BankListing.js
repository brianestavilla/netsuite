/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       31 Mar 2014     IAN 
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
/*	var context = nlapiGetContext();
		html = context.getSetting('SCRIPT', 'custscript33');*/
	
	//get current bill payment transaction id
	var billPaymentId = request.getParameter('internalid');
	
	//load current bill payment record
	var billPayment = nlapiLoadRecord('vendorpayment', billPaymentId);	
	
	//initialized report parameters
	var main = {
			'payee' : billPayment.getFieldText('entity'),
			'checknum' : billPayment.getFieldValue('custbody53'),
			'cvno' : billPayment.getFieldValue('tranid'),
			'paymentId' : billPaymentId
	};
	
	nlapiLogExecution('Error', billPaymentId +' is PCF', billPayment.getFieldValue('custbody202'));
	//render report 
	var file = renderReport(main, billPayment.getFieldValue('custbody202'));	

	//fire response to server
	response.setContentType('PDF', 'test.pdf', 'inline');
	response.write(file.getValue());	
}

function renderReport( main, isPCF) {
	var results;	
	
	if(isPCF == 'T'){
		results = searchPCF( main.paymentId );

	}
	else
	{
		results = searchWER( main.paymentId );	
	
	}
	
	var rowData = {};	
	
	var tablerow= '';

	var total_amount = 0;
	for ( var i = 0; results != null && i < results.length; i++) {
		var result = results[i];

		//if Vendor Payment for Petty Cash Fund
		if(isPCF == 'T'){
			
			/*nlapiLogExecution('Error', 'vendor', nlapiLookupField('vendor', result.getValue('custbody201'), 'custentity9', true));*/	
			rowData = {
					'count' : i + 1,
					'name'	: result.getText('custbody201', null, 'group'),
					'account': result.getValue('custentity9', 'custbody201', 'group'), 
					'amount' : result.getValue('amount', null, 'sum')
			};

			total_amount += parseFloat(result.getValue('amount', null, 'sum'));
		}
		else{
			
			rowData = {
					'count' : i + 1,
					'name'	: result.getText('custcol31', null, 'group'),
					'account': result.getValue('custentity9', 'custcol31', 'group'),
					'amount' : result.getValue('debitamount', null, 'sum')
					
			};
			total_amount += parseFloat(result.getValue('debitamount', null, 'sum'));
		}
		
		tablerow += addRow(rowData);
			
	}

	var htmlfile = nlapiLoadFile('SuiteScripts/[IAN]SuiteScript/banklist.html').getValue();
	
	htmlfile = htmlfile.replace('{lineitem}', tablerow);
	htmlfile = htmlfile.replace('{payee}', nlapiEscapeXML(main.payee));
	htmlfile = htmlfile.replace('{checknum}', main.checknum);
	htmlfile = htmlfile.replace('{cvno}', main.cvno);
	htmlfile = htmlfile.replace('{totalamount}', total_amount.toFixed(2));
	
	return nlapiXMLToPDF(htmlfile);
}

function searchPCF( billPaymentId ){
	//BANKLISTING PCF SAVESEARCH ----> 	customsearch1184
	var filter = new nlobjSearchFilter('custbody192', null, 'is', billPaymentId);

	var columns = [
	               new nlobjSearchColumn('custbody201', null, 'group'),
	               new nlobjSearchColumn('custentity9', 'custbody201','group'),
	               new nlobjSearchColumn('amount', null, 'sum')
	               ];
	
	return nlapiSearchRecord(null, 'customsearch1184', filter, columns);
}

/**
 * Searches for Warehouse Expense Report(WER)
 * 
 * @param {intiger} billPaymentId - Netsuite internal Id of Bill Payment transaction
 * @returns {searchObject} - Netsuite Search Objects
 */
function searchWER( billPaymentId ){
	//BANKLISTING WER SAVESEARCH ----> 	customsearch441
	var filter = new nlobjSearchFilter('custbody192', null, 'is', billPaymentId);					
	
	var columns = [
	               new nlobjSearchColumn('custcol31', null, 'group'),
	               new nlobjSearchColumn('custcol36', null,'group'),
	               new nlobjSearchColumn('debitamount', null, 'sum')
	               ];
	
	return nlapiSearchRecord(null, 'customsearch441', filter, columns);
}

/**
 * Add row to HTML report line item
 * 
 * @param {object} row
 * 
 */
function addRow(row){
	return	"<tr>"+
				"<td width='80'>"+ row.count.toString() +"</td>"+
				"<td width='350' align='left'>"+ row.name +"</td>"+
				"<td width='150' align='center'>"+ row.account +"</td>"+
				"<td width='150' align='right'>"+ row.amount +"</td>"+
			"</tr>";
}