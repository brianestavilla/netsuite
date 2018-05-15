function suitelet(request, response){
	
	html = nlapiGetContext().getSetting('SCRIPT', 'custscripthtml1');
	internalid = request.getParameter("internalid");
	vendorCredit = nlapiLoadRecord('vendorcredit', internalid);

	//code = vendorCredit.getId();
	code = vendorCredit.getFieldValue('entity');
	customerName = vendorCredit.getFieldText('entity');
	date = vendorCredit.getFieldValue('trandate');
	explanation = (vendorCredit.getFieldValue('memo') == null) ? '' : vendorCredit.getFieldValue('memo');
	printedby = vendorCredit.getFieldText('custbody8');
	dmnumber = (vendorCredit.getFieldValue('tranid') == null) ? '' : vendorCredit.getFieldValue('tranid');
	cmnumber = (vendorCredit.getFieldValue('custbody164') == null) ? '' : vendorCredit.getFieldValue('custbody164');
	totalVat = 0;
	itemVat =0;
	
	locationid = vendorCredit.getFieldValue('location');
	if(locationid == null || locationid == '') {
		address = '';
		tin = '';
	} else {
		lid = nlapiLoadRecord('location', locationid);
		address = lid.getFieldValue('addrtext');
		tin = lid.getFieldValue('custrecord770');
	}
	//table
	tablerow = '';
	//debitDescription = vendorCredit.getFieldText('account');
	debitaccountid = vendorCredit.getFieldValue('account');
	daid = nlapiLoadRecord('account', debitaccountid);
	debitcode = daid.getFieldValue('acctnumber');
	debitDescription = debitcode + ' ' + daid.getFieldValue('acctname');
	debit = vendorCredit.getFieldValue('usertotal');
	tablerow += addRow(debitcode, debitDescription, debit, '');
	
  	var gl_results = getGL(internalid);
  	for (var r = 0; r < gl_results.length; r++)
    {
    	var gl = gl_results[r];
      	var code = gl.getValue('number','account','group');
      	var desc = gl.getText('account', null, 'group');
      	var withMarginDescription = '<p style="margin-left:20px">' + desc + '</p>'
        if(gl.getValue('debitamount',null,'sum') != '')
        {
			tablerow += addRow(code, desc, gl.getValue('debitamount', null, 'sum') ,'');
        }else{
          	tablerow += addRow(code, withMarginDescription, '', gl.getValue('creditamount', null, 'sum'));
        }
      	
    }
  
  	//expense
	/*linecount = vendorCredit.getLineItemCount('expense');
	for (var i = 1; i <= linecount; i++){
		creditaccountid = vendorCredit.getLineItemValue('expense', 'account', i);
		caid = nlapiLoadRecord('account', creditaccountid);
		creditcode = caid.getFieldValue('acctnumber');
		creditDescription = caid.getFieldValue('acctname');
		creditDescription = '<p style="margin-left:20px">' + creditDescription + '</p>';
		credit = vendorCredit.getLineItemValue('expense', 'grossamt', i);
		vat = vendorCredit.getLineItemValue('expense', 'tax1amt', i);
		tablerow += addRow(creditcode, creditDescription, '', credit);
		totalVat += parseFloat(vat);
	}
	//items
	itemline = vendorCredit.getLineItemCount('item');
	for(var i = 1; i <= itemline; i++) {
		itemid = vendorCredit.getLineItemValue('item', 'item', i);
		accountID = nlapiLookupField('item', itemid, 'expenseaccount');
		account = nlapiLoadRecord('account', accountID);
		itemcode = account.getFieldValue('acctnumber');
		itemdesc = account.getFieldValue('acctname');
		itemdesc = itemdesc.replace('&', ' and ');
		itemdesc = '<p style="margin-left:20px">' + itemdesc + '</p>';
		itemcredit = vendorCredit.getLineItemValue('item', 'grossamt', i);
		ivat = vendorCredit.getLineItemValue('item', 'tax1amt', i);
		tablerow += addRow(itemcode, itemdesc, '', itemcredit);
		itemVat += parseFloat(ivat);
	}*/

	html = html.replace('{address}', address.replace('&', ' and '));
	html = html.replace('{tin}', tin);
	html = html.replace('{code}', code);
	html = html.replace('{customer}', customerName.replace('&', ' and '));
	html = html.replace('{date}', date);
	html = html.replace('{explanation}', explanation);
	html = html.replace('{body}', tablerow);
	html = html.replace('{printed}', printedby);
	html = html.replace('{dmnumber}', dmnumber);
	html = html.replace('{cmnumber}', cmnumber);
	html = replaceall(html, '&', ' and ');
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', dmnumber + '.pdf', 'inline');
	response.write(file.getValue());
}
function addRow(code, description, debit, credit){
	return	"<tr>"+
				/*"<td width='150'>"+ code +"</td>"+*/
				"<td width='350' align='left'>"+ description +"</td>"+
				"<td width='150' align='right'>"+ addCommas(debit) +"</td>"+
				"<td width='150' align='right'>"+ addCommas(credit) +"</td>"+
			"</tr>";
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

//added by Redem 01.11.17
function getGL(tran_internalid)
{
  	var filters = [
      
    	new nlobjSearchFilter('internalid', null, 'anyof', tran_internalid)

    ];
  	filters[1] = new nlobjSearchFilter('formulatext', null, 'doesnotcontain', 'Accounts Payable');
  	filters[1].setFormula('{account}');
  	
  	var columns = [
      
   		new nlobjSearchColumn('number', 'account', 'group'),
      	new nlobjSearchColumn('account', null, 'group'),
      	new nlobjSearchColumn('debitamount', null, 'sum'),
      	new nlobjSearchColumn('creditamount', null, 'sum')
      
    ];
  
	var result = nlapiSearchRecord('vendorcredit', null, filters, columns);
  	
  	return result;
}