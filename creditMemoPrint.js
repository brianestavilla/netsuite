function suitelet(request, response) {
	html = nlapiGetContext().getSetting ('SCRIPT', 'custscript2');
	internalid = request.getParameter("internalid");
	creditMemo = nlapiLoadRecord('creditmemo', internalid);
	
	code = creditMemo.getId();
	customer = creditMemo.getFieldText('entity');
	date = creditMemo.getFieldValue('trandate');
	memo = (creditMemo.getFieldValue('memo') == null) ? '' : creditMemo.getFieldValue('memo');
	cmnumber = creditMemo.getFieldValue('tranid');
	totalVat = 0;
	cogs = 0;
	table = '';
	
	itemcount = creditMemo.getLineItemCount('item');
		for(var i = 1; i <= itemcount; i++) {
			itemid = creditMemo.getLineItemValue('item', 'item', i);
			try {
				record = nlapiLoadRecord('inventoryitem', itemid);
				account = record.getFieldValue('incomeaccount');
				averageCost = record.getFieldValue('averagecost');
			} catch (e) {
				try {
					record = nlapiLoadRecord('noninventoryitem', itemid);
					if (record.getFieldValue('subtype') == 'Resale' || (record.getFieldValue('subtype') == 'Purchase')) account = record.getFieldValue('incomeaccount');
					else account = '';
					averageCost = record.getFieldValue('averagecost');
				} catch (e) {
					try {
						nlapiLoadRecord('otherchargeitem', itemid);
						if((record.getFieldValue('subtype') == 'Resale') || (record.getFieldValue('subtype') == 'Purchase')) account = record.getFieldValue('incomeaccount');
						else account = '';
						averageCost = record.getFieldValue('averagecost');
					} catch (e) {
						try {
							record = nlapiLoadRecord('paymentitem', itemid);
							account = record.getFieldValue('account');
							averageCost = record.getFieldValue('averagecost');
						} catch (e) {
							record = nlapiLoadRecord('serviceitem', itemid);
							account = record.getFieldValue('incomeaccount');
							averageCost = record.getFieldValue('averagecost');
						}
					}
				}
			}
			accountload = nlapiLoadRecord('account', account);
			debitcode = accountload.getFieldValue('acctnumber');
			debitdesc = accountload.getFieldValue('acctname');
			debit = creditMemo.getLineItemValue('item', 'amount', i);
				quantity = creditMemo.getLineItemValue('item', 'quantity', i);
				cogs += quantity * averageCost;
			vat = creditMemo.getLineItemValue('item', 'tax1amt', i);
			totalVat += parseFloat(vat);
			applied = creditMemo.getFieldValue('applied');
			
			table += addRow(debitcode, debitdesc, debit, '');
	}
	arid = nlapiLoadRecord('account', '123');
	creditcode = arid.getFieldValue('acctnumber');
	creditdesc = arid.getFieldValue('acctname');
	creditdesc = '<p style="margin-left:20px">' + creditdesc + '</p>';
	credit = creditMemo.getFieldValue('total');
	table += addRow(creditcode, creditdesc, '', credit);
	
	if(applied > 0) {
		cogsacct = nlapiLoadRecord('account', '126');
		cogscode = cogsacct.getFieldValue('acctnumber');
		cogsdesc = cogsacct.getFieldValue('acctname');
		cogsdesc = '<p style="margin-left:20px">' + cogsdesc + '</p>';
		table += addRow(cogscode, cogsdesc, '', nlapiFormatCurrency(cogs));
		table += addRow('', "Inventory Asset", nlapiFormatCurrency(cogs), '');
	}
	if (totalVat > 0) {
		table += addRow('', "VAT on Purchases PH", nlapiFormatCurrency(totalVat), '');
	}

  	var preparedby = '', approvedby = '';
	var dcm_id = creditMemo.getFieldValue('custbody213');
  	var return_id = creditMemo.getFieldValue('createdfrom');

	if(dcm_id != null) {
      var dcm_rec = nlapiLoadRecord('customrecord136', dcm_id);
      preparedby = dcm_rec.getFieldText('custrecord164').replace(" (emp)", "") || '';
      approvedby = dcm_rec.getFieldText('custrecord168').replace(" (emp)", "") || '';
    } else if(return_id != null) {
      var return_rec = nlapiLoadRecord('returnauthorization', return_id);
      preparedby = return_rec.getFieldText('custbody8').replace(" (emp)", "") || '';
      approvedby = return_rec.getFieldText('custbody131').replace(" (emp)", "") || '';
    }

	html = html.replace('{preparedby1}', preparedby);
  	html = html.replace('{approvedby1}', approvedby);
	html = html.replace('{preparedby2}', preparedby);
  	html = html.replace('{approvedby2}', approvedby);

  	//html = html.replace('{code}', code);
	//html = html.replace('{code2}', code);
	html = html.replace('{customer}', customer.replace('&', ' and '));
	html = html.replace('{customer2}', customer.replace('&', ' and '));
	html = html.replace('{date}', date);
	html = html.replace('{date2}', date);
	html = html.replace('{memo}', memo);
	html = html.replace('{memo2}', memo);
	html = html.replace('{cmnumber}', cmnumber);
	html = html.replace('{location1}', creditMemo.getFieldText('location'));
	html = html.replace('{location2}', creditMemo.getFieldText('location'));
	html = html.replace('{cmnumber2}', cmnumber);
	html = html.replace('{table}', table);
	html = html.replace('{table2}', table);
	html = replaceall(html, '&', ' and ');
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', cmnumber + '.pdf', 'inline');
	response.write(file.getValue());
}
function addRow(code, description, debit, credit){
	return	"<tr>"+
				"<td width='150'>"+ code +"</td>"+
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