//suitelet checkVoucher.js

function checkVoucher(request, response) {
	
	html = nlapiGetContext().getSetting('SCRIPT', 'custscript8');
	//change aaa to html script id
	internalid = request.getParameter("internalid");
	check = nlapiLoadRecord('vendorpayment', internalid);
	
	payee = (check.getFieldText('entity') == null) ? '' : check.getFieldText('entity');
	address = (check.getFieldValue('address') == null) ? '' : check.getFieldValue('address');
	checkno = (check.getFieldValue('custbody53') == null) ? '' : check.getFieldValue('custbody53');
	date = (check.getFieldValue('trandate') == null) ? '' : check.getFieldValue('trandate');
	//wrong cvno pulled. cvno = check.getId();
	cvno = (check.getFieldValue('tranid') == null) ? '' : check.getFieldValue('tranid');
	checkdate = (check.getFieldValue('custbody61') == null) ? '' : check.getFieldValue('custbody61');
	mem = (check.getFieldValue('memo') == null) ? '' : check.getFieldValue('memo');
	preparedby = (check.getFieldText('custbody8') == null) ? '' : check.getFieldText('custbody8');
	checkedby = (check.getFieldText('custbody115') == null) ? '' : check.getFieldText('custbody115');
	approvedby = (check.getFieldText('custbody154') == null) ? '' : check.getFieldText('custbody154');
	deptid = check.getFieldValue('department');
	dept = nlapiLoadRecord('department', deptid);
	deptcode = (dept.getFieldValue('custrecord803') == null) ? '' : dept.getFieldValue('custrecord803');
	
	totalCredit = 0;
	var totalDebit = 0;
	apvTable = '';
	jeTable = '';
	linecount = check.getLineItemCount('apply');
	for(var i = 1; i <= linecount; i++) {
		if(check.getLineItemValue('apply', 'apply', i) == 'T') {
			apvdue = (check.getLineItemValue('apply', 'applydate', i) == null) ? '' : check.getLineItemValue('apply', 'applydate', i);
			invoice = check.getLineItemValue('apply', 'internalid', i);
			invoiceref = (check.getLineItemValue('apply', 'refnum', i) == null) ? '' : check.getLineItemValue('apply', 'refnum', i);
			//get apv number series searchRecord
				if(invoice != null) {
					var filter = new Array (
						new nlobjSearchFilter('internalid', null, 'anyof', invoice)
					);
					var column = new Array (
						new nlobjSearchColumn('custbody37'),//apv number
						new nlobjSearchColumn('custbody95'),//rr number
						new nlobjSearchColumn('account') //account
					);
					var filterbill = nlapiSearchRecord('vendorbill', null, filter, column);
						if(filterbill != null) {
							apvno = filterbill[0].getValue('custbody37')
							rr = filterbill[0].getText('custbody95').split(' ');
							debitDesc = filterbill[0].getText('account');//.split(',');
							debit = debitDesc.split(' ');
							debitCode = debit[0];
							debitDesc = debitDesc.substring(debitCode.length + 1);
							rr1 = rr[2];
							try{
								rrno = rr1.substring(1);
							}catch(e){rrno = '';}
						}
				}
			//end
			//get wr/rr no.
			amount = check.getLineItemValue('apply','amount',i);
			apvTable += apvRows(apvno, apvdue, invoiceref, rrno, amount);
			totalDebit += amount;
		}
	}

	ac = check.getFieldValue('account');
	acct = nlapiLoadRecord('account', ac);
	accountcode = acct.getFieldValue('acctnumber');
	creditDesc = acct.getFieldValue('acctname');
	//dc = nlapiLoadRecord('account', '114');
	//debitCode = dc.getFieldValue('acctnumber');
	//debitDesc = 'Accounts Payable';
	totalCredit = check.getFieldValue('total');
	jeTable += jeRows(debitCode, debitDesc, nlapiFormatCurrency(totalCredit), '');
	creditDesc = '<p style="margin-left:20px">' + creditDesc + '</p>';
	jeTable += jeRows(accountcode, creditDesc, '', totalCredit);
	// jeTable = '<p style="margin-left:10px">' + jeTable + '</p>';
//var dranix_address = check.getFieldText('location').split(':');
dranix_address = check.getFieldText('location');

html = html.replace('{payee}', payee.replace('&', ' and '));
html = html.replace('{address}', address.replace('&', ' and '));
//html = html.replace('{dranixaddress}', dranix_address[0].toUpperCase());
html = html.replace('{dranixaddress}', dranix_address.toUpperCase());
html = html.replace('{checkno}', checkno);
html = html.replace('{date}', date);
html = html.replace('{cvno}', cvno);
html = html.replace('{checkdate}', checkdate);
html = html.replace('{apv}', apvTable);
html = html.replace('{je}', jeTable);
html = html.replace('{memo}', mem.replace('&', ' and '));
html = html.replace('{preparedby}', preparedby);
html = html.replace('{checkedby}', checkedby);
html = html.replace('{approvedby}', approvedby);
html = html.replace('{deptcode}', deptcode);
html = replaceall(html, '&', ' and ');

if(linecount > 7){
	html = html.replace('height: 130px;', 'height: 590px;');
	html = html.replace('[1]', '1');
	html = html.replace('[1]', '1');
}

var file = nlapiXMLToPDF(html);
response.setContentType('PDF', cvno + '.pdf', 'inline');
response.write(file.getValue());
}
function apvRows(apvnum, duedate, invoicenum, rrno, amt) {
	return	"<tr>" +
			"<td width='160'>" + apvnum + "</td>" +
			"<td width='160' align='center'>" + duedate + "</td>" +
			"<td width='160' align='center'>" + invoicenum + "</td>" +
			"<td width='160' align='center'>" + rrno + "</td>" +
			"<td width='160' align='right'>" + addCommas(amt) + "</td>" +
			"</tr>";
}
function jeRows(code, entry, debit, credit) {
	return	"<tr>" +
			"<td width='200'>" + deptcode + "-" + code + "</td>" +
			"<td width='300'>" + entry + "</td>" +
			"<td width='150' align='right'>" + addCommas(debit) + "</td>" +
			"<td width='150' align='right'>" + addCommas(credit) + "</td>" +
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