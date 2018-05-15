function suitelet(request, response) {
	if(request.getMethod() == 'GET') {
		//GET REQUEST
		var form = nlapiCreateForm("FILTER");
	
		form.addField('custpage_datefrom', 'date', 'From Date');		
		form.addField('custpage_dateto', 'date', 'To Date');
		form.addField('class', 'select', 'Principal','classification');	
		form.addSubmitButton('Submit' );
		
		//set session object
		nlapiGetContext().setSessionObject('status', 'GET');
		response.writePage(form);
		
	} else {
		if(nlapiGetContext().getSessionObject('status') == 'GET') {
			var from = request.getParameter('custpage_datefrom'); //FROM DATE
			var to = request.getParameter('custpage_dateto'); //TO DATE
			var principal = request.getParameter('class'); //PRINCIPAL
			
			var form = nlapiCreateForm('Deposit Slip Printout');
			form.addSubmitButton('Print');
			var acctField = form.addField('acct', 'select', 'Account ', 'account');
			var depodate = form.addField('depodate', 'date', 'Deposit Date ', null);
			
			var slipType = form.addField('sliptype', 'select', 'Slip Type', 'customlist368');
			acctField.setMandatory(true);
			slipType.setMandatory(true);
			depodate.setMandatory(true);
			var sublist = form.addSubList('sublist', 'list', 'Deposits');
			sublist.addMarkAllButtons();
			sublist.addRefreshButton();
			sublist.addField('ifprint', 'checkbox', 'Print');
			sublist.addField('tranid', 'Text', 'Deposit Number');
			sublist.addField('trandate', 'date', 'Date');
			sublist.addField('amount', 'currency', 'Amount');
			sublist.addField('internalid', 'text', 'Internal ID').setDisplayType('hidden');
			
			var columns =[
							new nlobjSearchColumn('internalid'),
							new nlobjSearchColumn('tranid'),
							new nlobjSearchColumn('trandate'),
							//new nlobjSearchColumn('currency'),
							new nlobjSearchColumn('amount')
						];
			var reportingbranch = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false); 
			
			var searchfilter = [
			                    	new nlobjSearchFilter( 'location', null, 'anyof', reportingbranch),
			                    	new nlobjSearchFilter('trandate', null, 'within', from, to),
			                    	new nlobjSearchFilter('class', null, 'anyof', principal)
			                   ];
			
			var result = nlapiSearchRecord('transaction', 'customsearch479', searchfilter, columns);
			
			sublist.setLineItemValues(result);
			
			//set session object
			nlapiGetContext().setSessionObject('status', 'POST');
			
			response.writePage(form);
		} else {
			//try {
				slip = request.getParameter('sliptype');
				html = nlapiGetContext().getSetting('SCRIPT', 'custscript23');
				accountid = request.getParameter('acct');
				acct = nlapiLoadRecord('account', accountid);
				account = acct.getFieldValue('acctname');
				account = account.split(' ');
				acctnumber = account[5];
				acctnumber = replaceall(acctnumber, '-', '');
				anlength = acctnumber.length;
				box = '';
				depositdate =  request.getParameter('depodate');
				
				for(var i = 0; i < anlength; i++) {
					if(i == 3 || i == 12) {
						box += boxes(acctnumber[i], true);
					} else {
						box += boxes(acctnumber[i], false);
					}
				}
				var checks = '';
				linecount = request.getLineItemCount('sublist');
				body = '';
				body2 = '';
				totalamount = 0;
				
				
				for(var i = 1; i <= linecount; i++) 
				{
				ifPrint = request.getLineItemValue('sublist', 'ifprint', i);
					if(ifPrint == 'T')
					{
					internalid = request.getLineItemValue('sublist', 'internalid', i);
					depositid = request.getLineItemValue('sublist', 'tranid', i);
					
					//date = request.getLineItemValue('sublist', 'trandate', i);
					
					
					nlapiSubmitField('deposit', internalid, 'tobeprinted', 'F');
					
					var column2 =	[
									new nlobjSearchColumn('paymentmethod', 'appliedtotransaction','GROUP'),
									new nlobjSearchColumn('custbody173', 'appliedtotransaction','GROUP'),
									new nlobjSearchColumn('custbody141', 'appliedtotransaction','GROUP'),
									new nlobjSearchColumn('amount', 'appliedtotransaction','SUM')
									];
					var filter2 =	new nlobjSearchFilter('internalid', null, 'anyof', internalid);
					var result2 = nlapiSearchRecord('transaction', 'customsearch477', filter2, column2);
					
					var cashtotal = 0.00;
					
					if(result2 != null) {
						var resultcount = result2.length;
							for(var o = 0; o < resultcount; o++) 
							{
								var queryresult = result2[o];
								var paymethod = queryresult.getValue('paymentmethod', 'appliedtotransaction','GROUP');
								if(paymethod == '2'){ //Check
									var bb = queryresult.getText('custbody173', 'appliedtotransaction','GROUP');
									nlapiLogExecution('ERROR', 'bank branch', bb);
									//if(bb[o] == 'undeﬁned' || bb[o] == '' || bb[o] == null || bb[o] == '- None -') {
									//	bankbranch = "redem choi";
								//	} else {
										//bb = bb.split(':');
										//bankbrach = bb[o] || '' ;
									//}
									var bankbranch = bb.substring(bb.indexOf(':')+1,100) || bb.substring(0,bb.indexOf(':')) || '';
	
									var chk = '';
									var checknumber = queryresult.getValue('custbody141', 'appliedtotransaction','GROUP');
									var amount = queryresult.getValue('amount', 'appliedtotransaction','SUM');
									var totalamount = totalamount + parseFloat(amount);
									checks += rows(bankbranch, chk, checknumber, addCommas(amount));
								}
							} // end forloop
						}
					}
				}
				sub =	"<div>" +
							"<table class='acctnumber'>" +	
								"<tr>" +
									box +
								"</tr>" +
							"</table>" +//
							"<table class='acctname'>" +
								"<tr>" +
									"<td width='400'>DRANIX DISTRIBUTORS, INCORPORATED</td>" +
								"</tr>" +
							"</table>" +//
								"<table class='totalcash'>" +
								"<tr>" +
									"<td width='400' align='right'>" + nlapiFormatCurrency(cashtotal) +
									"</td>" +
								"</tr>" +
							"</table>" +//
							"<table class='checks'>" +
								checks +
							"</table>" +//
							"<p class='count'>" + resultcount + "</p>" +
							"<p class='total'><b>" + addCommas(nlapiFormatCurrency(totalamount)) + "</b></p>" +
							"<p class='date'><b>" + depositdate + "</b></p>" +
							"</div>";
				body += sub;
				sub2 =	"<div>" +
							"<table class='acctnumber'>" +	
								"<tr>" +
									box +
								"</tr>" +
							"</table>" +
							"<table class='acctname'>" +
								"<tr>" +
									"<td width='400'>DRANIX DISTRIBUTORS, INCORPORATED</td>" +
								"</tr>" +
							"</table>" +
							/*"<table class='totalcash'>" +
								"<tr>" +
									"<td width='400' align='right'>" + nlapiFormatCurrency(cashtotal) +
									"</td>" +
								"</tr>" +
							"</table>" +*/
							"<table class='checks2'>" +
								checks +
							"</table>" +
							//"<p class='count2'>" + resultcount + "</p>" +
							"<p class='total'><b>" + addCommas(nlapiFormatCurrency(totalamount)) + "</b></p>" +
							"<p class='date'><b>" + depositdate + "</b></p>" +
						"</div>";
				body2 += sub2;
				checks = '';
				
				//var result = nlapiSearchRecord('transaction', 'customsearch479');
					
					
					totalamount = 0;
				//}
				
				if(slip == '1') {
					html = html.replace('{body}', body);
				} else {
					html = html.replace('{body}', body2);
				}
				
				var file = nlapiXMLToPDF(html);
				response.setContentType('PDF', acctnumber + '.pdf', 'inline');
				response.write(file.getValue());
			//} catch (e) {
			//	nlapiLogExecution('DEBUG', 'asdf slip', e.getDetails());
			//}
		}
	}
}
function rows(a, b, c, d) {
	return	"<tr>" +
				"<td width='110'>" + a + "</td>" +
				"<td width='50'>" + b + "</td>" +
				"<td width='125' align='center'>" + c + "</td>" +
				"<td width='100' align='right'>" + addCommas(d) + "</td>" +
			"</tr>";
}

function boxes(n, s) {
	boxnumber = '';
	if(s == true) {
		boxnumber = "<td width='34' class='push' align='center'><b>" + n + "</b></td>";
	} else {
		boxnumber = "<td width='18' align='center'><b>" + n + "</b></td>";
	}
	return boxnumber;
}

function replaceall(str, replace, with_this) {
    var str_hasil = "";
    var temp;
    for(var i = 0; i < str.length; i++) {
        if (str[i] == replace) {
            temp = with_this;
        }
        else {
			temp = str[i];
        }
        str_hasil += temp;
    }
    return str_hasil;
}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)){
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}