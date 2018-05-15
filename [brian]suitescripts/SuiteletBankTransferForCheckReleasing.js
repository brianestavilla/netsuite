	/**
	*	Fund Transfer Print Out
	*
	*	Author : Brian Mae Estavilla
	**/
function bankTransfer(request, response) {
	var type = request.getParameter('type');
	if(type == 'fundTransferSummary') {
		var recIDs = request.getParameter('internalid').split('_');
		var index = recIDs.indexOf('');
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - START **/
		
		if(index > -1) { recIDs.splice(index, 1); }
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - END **/
		
		var columns = new Array(
			new nlobjSearchColumn('custbody214'),
			new nlobjSearchColumn('custbody37'),
			new nlobjSearchColumn('entity'),
			new nlobjSearchColumn('custbody192'),
			new nlobjSearchColumn('amount')
		);

		var filter = new Array(new nlobjSearchFilter('custbody192', null, 'anyof', recIDs));
		
		var reportDefinition = nlapiCreateReportDefinition();
		reportDefinition.setTitle('Summary for Fund Transfer Per Account');
		reportDefinition.addRowHierarchy('custbody214', 'Account', 'TEXT');
		reportDefinition.addColumn('custbody37', false, 'APV Number', null, 'TEXT', null);
		reportDefinition.addColumn('entity', false, 'Payee', null, 'TEXT', null);
		reportDefinition.addColumn('custbody192', false, 'Bill Payment Ref No.', null, 'TEXT', null);
		reportDefinition.addColumn('amount', true, 'Amount', null, 'CURRENCY', null);
		
		//Maps the query results into the report definition columns
		reportDefinition.addSearchDataSource('transaction', 'customsearch1862_2', filter, columns, 
		{'custbody214':columns[0], 'custbody37': columns[1], 'entity':columns[2],'custbody192':columns[3],'amount':columns[4]});
		
		 //Create a form to build the report on
		var form = nlapiCreateReportForm('SUMMARY FOR FUND TRANSFER');     
		
		//Build the form from the report definition
		reportDefinition.executeReport(form); 
		
		//Write the form to the browser
		response.writePage(form);
	} else if(type == 'saveTransaction') {
		var curDate = new Date(),
		curDay = fixDigit(curDate.getDate(),2),
		curMonth = fixDigit(curDate.getMonth()+1,2),
		curYear = curDate.getFullYear(),
		recIDs = request.getParameter('internalid').split('_'),
		form = nlapiCreateForm(' ');
		
		var index = recIDs.indexOf('');
		
		/**
		** REMOVE EMPTY VALUES IN THE ARRAY - START
		**/
		
		if(index > -1) {
			recIDs.splice(index, 1);
		}
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - END **/
		
		var col = [
	           new nlobjSearchColumn('internalid'), //internalid
	           new nlobjSearchColumn('custrecord394'), //counter
		];
		var fil = new nlobjSearchFilter('custrecord395', null, 'is', 'checkreleasing');
		var result = nlapiSearchRecord('customrecord206',null, fil, col); // Number Series
		
		var batchno = curMonth+'-'+curDay+'-'+curYear+'-'+result[0].getValue('custrecord394');
		
		for(var i=0; i<recIDs.length; i++) {
			nlapiSubmitField('vendorpayment', recIDs[i], 'custbody217', batchno);
		}
		
		nlapiSubmitField('customrecord206', result[0].getValue('internalid'), 'custrecord394', parseInt(result[0].getValue('custrecord394'))+1);
		var hml = form.addField('htmltotal', 'inlinehtml');
		
		hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
		"<h1 style='font-size:18px;'> Transaction Successfully Saved </h1><br>" +
		"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
		"<a href='https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchid=1968&saverun=T&whence='>View Saved Transaction</a>" +
		"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");

//		hml.setDefaultValue("<div style='margin: auto; padding: 10px; color: #ffffff;text-align:center;  background-color:#5cb85c; width:500px; border-radius: 5px; border: 1px solid #5b5b5b;'>" +
//		"<h1 style='font-size:18px;'> Transaction Successfully Saved </h1><br>" +
//		"<a href='#' onclick='NS.form.setChanged(false); window.close(); return false;'>Back</a>"+
//		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
//		"<a href='https://system.sandbox.netsuite.com/app/common/search/searchresults.nl?searchid=1860&whence='>View Saved Transaction</a>" +
//		"</div><script>document.getElementById('tr_close').style.visibility = 'hidden';</script>");
	
		response.writePage(form);
	}
}

function fixDigit(number, maxDigit){
	number = number.toString();
	
	numberLength = number.length;
	maxDigit--;
	
	for(var i = maxDigit; i >= numberLength; i--) number = '0' + number;
	
	return number;
}
