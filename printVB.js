function vanBalancing(request, response) {
	html = nlapiGetContext().getSetting('SCRIPT', 'custscript25');
	//change aaa ID done
	internalid = request.getParameter("internalid");
	vb = nlapiLoadRecord('customrecord164', internalid);
  
	vbno = (vb.getFieldValue('recordid') == null) ? '' : vb.getFieldValue('recordid');
	series = (vb.getFieldValue('custrecord237') == null) ? '' : vb.getFieldValue('custrecord237');
	customer = (vb.getFieldText('custrecord235') == null) ? '' : vb.getFieldText('custrecord235');
	date = (vb.getFieldValue('custrecord236') == null) ? '' : vb.getFieldValue('custrecord236');
	invoiceno = (vb.getFieldText('custrecord306') == null || vb.getFieldText('custrecord306') == '') ? 'Invoice # :' : vb.getFieldText('custrecord306');
	
	department = (vb.getFieldText('custrecord265') == null) ? '' : vb.getFieldText('custrecord265');
	principal = (vb.getFieldText('custrecord268') == null) ? '' : vb.getFieldText('custrecord268');
	location = (vb.getFieldText('custrecord269') == null) ? '' : vb.getFieldText('custrecord269');
	
	unapplied = (vb.getFieldValue('custrecord815_2') == null) ? '' : vb.getFieldValue('custrecord815_2');
	cash = (vb.getFieldValue('custrecord270') == null) ? '' : vb.getFieldValue('custrecord270');
	check = (vb.getFieldValue('custrecord271') == null) ? '' : vb.getFieldValue('custrecord271');
	totalamt = (vb.getFieldValue('custrecord272') == null) ? '' : vb.getFieldValue('custrecord272');
	totalsales = (vb.getFieldValue('custrecord273') == null) ? '' : vb.getFieldValue('custrecord273');
	over = (vb.getFieldValue('custrecord274') == null) ? '' : vb.getFieldValue('custrecord274');
	other = (vb.getFieldValue('custrecord816') == null) ? '' : vb.getFieldValue('custrecord816');
	
	preparedby = vb.getFieldText('custrecord817');
	checkedby = (vb.getFieldText('custrecord873') == null) ? '' : vb.getFieldText('custrecord873');
	
	//join recmachcustrecord275
	table = '';
	totaleoh = 0;
	totalgross = 0;
	linecount = vb.getLineItemCount('recmachcustrecord275');
	for(var i = 1; i <= linecount; i++) {
		item = vb.getLineItemText('recmachcustrecord275', 'custrecord276', i);
		desc = (vb.getLineItemValue('recmachcustrecord275', 'custrecord308', i) == null) ? '' : vb.getLineItemValue('recmachcustrecord275', 'custrecord308', i);
		eoh = vb.getLineItemValue('recmachcustrecord275', 'custrecord278', i);
      	unitcost = parseFloat(parseFloat(vb.getLineItemValue('recmachcustrecord275','custrecord280',i)) * 1.12).toFixed(2);
		amt = vb.getLineItemValue('recmachcustrecord275', 'custrecord280', i);
		grossamt = parseFloat(amt * 1.12).toFixed(2);
		gross = parseFloat(eoh * grossamt).toFixed(2);
		totaleoh += parseFloat(eoh);
		totalgross += parseFloat(gross);
		if(eoh != 0) {
			table += rows(item, desc, unitcost, (eoh), addCommas(nlapiFormatCurrency(gross)));
		}
	}
	table += rows('', '','', 'Total EOH : <b>' + (totaleoh) + '</b>', 'Total Amount : <b>' + addCommas(nlapiFormatCurrency(totalgross)) + '</b>');

	html = html.replace('{vbno}', vbno);
	html = html.replace('{series}', series);
	html = html.replace('{customer}', customer);
	html = html.replace('{date}', date);
	html = html.replace('{invoiceno}', invoiceno);

	html = html.replace('{department}', department);
	html = html.replace('{principal}', principal);
	html = html.replace('{location}', location);

	html = html.replace('{unapplied}', unapplied);
	html = html.replace('{cash}', addCommas(cash));
	html = html.replace('{check}', addCommas(check));
	html = html.replace('{totalamt}', addCommas(totalamt));
	html = html.replace('{totalsales}', addCommas(totalsales));
	html = html.replace('{over}', addCommas(over));
	html = html.replace('{other}', addCommas(other));

	html = html.replace('{preparedby}', preparedby);
	html = html.replace('{salesman}', customer);
	html = html.replace('{checkedby}', checkedby);

	html = html.replace('{body}', table);
	html = replaceall(html, '&', ' and ');

	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', internalid + '.pdf', 'inline');
	response.write(file.getValue());
}
function rows(item, desc, unitcost, eoh, gross) {
	return	"<tr>" +
			"<td class='subfour'>" + item + "</td>" +
			"<td class='subfour'>" + desc + "</td>" +
			"<td class='subfour' align='center'>" + unitcost + "</td>" +
			"<td class='subfour' align='center'>" + eoh + "</td>" +
			"<td class='sub2four' align='right'>" + gross + "</td>" +
			"</tr>"
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