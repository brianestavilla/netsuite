//suitelet journalEntry.js
function journalEntry(request, response) {
	
	var html = nlapiGetContext().getSetting('SCRIPT', 'custscript10');
	var intnalid = request.getParameter('internalid');
	
	var journal = nlapiLoadRecord('journalentry', intnalid);
	
	
	address = '';
	payee = (journal.getLineItemText('line', 'entity', 1) == null) ? '' : journal.getLineItemText('line', 'entity', 1);
	//empId = journal.getLineItemValue('line', 'entity', 1);
		//if(empId != null){
		//try{
		//	employee = nlapiLoadRecord('vendor', empId);
		//}catch(err){
		//	try{
		//		employee = nlapiLoadRecord('employee', empId);
		//	}catch(err){
		//		employee = nlapiLoadRecord('customer', empId);
		//	}
		//}
	
		//address = (employee.getFieldValue('defaultaddress') == null) ? '' : employee.getFieldValue('defaultaddress');
		//}
	
	//address = (journal.getFieldValue('custbody113') == null) ? '' : journal.getFieldValue('custbody113');
	date = (journal.getFieldValue('trandate') == null) ? '' : journal.getFieldValue('trandate');
	jvno = (journal.getFieldValue('tranid') == null) ? '' : journal.getFieldValue('tranid');
	comment = (journal.getFieldValue('custbody119') == null) ? '' : journal.getFieldValue('custbody119');
	preparedby = (journal.getFieldText('custbody114') == null) ? '' : journal.getFieldText('custbody114');
	checkedby = (journal.getFieldText('custbody115') == null) ? '' : journal.getFieldText('custbody115');
	approvedby = (journal.getFieldText('custbody116') == null) ? '' : journal.getFieldText('custbody116');
	
	jeTable = '';
	totaltax = 0;
	linecount = journal.getLineItemCount('line');
	for(var i = 1; i <= linecount; i++) {
		tempacct = journal.getLineItemText('line', 'account', i)
		account = tempacct;
		accountcode = tempacct.split(' ');
		accountcode = accountcode[0];
		name = (journal.getLineItemValue('line', 'entity', i) == null) ? '' : journal.getLineItemText('line', 'entity', i);
		debit = (journal.getLineItemValue('line', 'debit', i) == null) ? '' : journal.getLineItemValue('line', 'debit', i);
		credit = (journal.getLineItemValue('line', 'credit', i) == null) ? '' : journal.getLineItemValue('line', 'credit', i);
		tax = (journal.getLineItemValue('line', 'tax1amt', i) == null) ? 0 : journal.getLineItemValue('line', 'tax1amt', i);
		totaltax += parseFloat(tax);
		jeTable += addRows(accountcode, account, name, debit, credit);
	}
	if(totaltax > 0) {
		jeTable += addRows("124001", "Input Tax", '','', nlapiFormatCurrency(totaltax));
	}
	
	html = html.replace('{payee}', payee);
	//html = html.replace('{address}', address);
	html = html.replace('{date}', date);
	html = html.replace('{jvno}', jvno);
	html = html.replace('{duedate}', date);
	html = html.replace('{comment}', comment);
	html = html.replace('{preparedby}', preparedby);
	html = html.replace('{checkedby}', checkedby);
	html = html.replace('{approvedby}', approvedby);
	html = html.replace('{jeTable}', jeTable);
	html = replaceall(html, '&', ' and ');
	
	//temp
	if(linecount > 5){
	html = html.replace('height: 180px;', 'height: 640px;');
	html = html.replace('[1]', '1');
	html = html.replace('[1]', '1');
}
	
	for(var x = 1; x <= linecount; x++){
	html = html.replace('&', 'and');
	}
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', jvno + '.pdf', 'inline');
	response.write(file.getValue());
}
function addRows(code, entry, name, debit, credit) {
	return	"<tr>" +
			"<td width='150'>" + code + "</td>" +
			"<td width='350'>" + entry + "</td>" +
			"<td width='200' style='font-size:9px'>" + name + "</td>" +
			"<td width='150' align='right'>" + addCommas(debit) + "</td>" +
			"<td width='150' align='right'>" + addCommas(credit) + "</td>" +
			"</tr>"
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