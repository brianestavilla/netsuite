function invtyCountCutOff(request, response) {
	html = nlapiGetContext().getSetting('SCRIPT', 'custscript27');
	//change aaa ID done
	internalid = request.getParameter("internalId");
	doc = nlapiLoadRecord('customrecord379', internalid);

	principal = (doc.getFieldText('custrecord837') == null) ? '' : doc.getFieldText('custrecord837');
	location = (doc.getFieldText('custrecord836') == null) ? '' : doc.getFieldText('custrecord836');
	dateofcount = (doc.getFieldValue('custrecord834') == null) ? '' : doc.getFieldValue('custrecord834');
	monthendcutoff = (doc.getFieldValue('custrecord835') == null) ? '' : doc.getFieldValue('custrecord835');
	
	//join recmachcustrecord33
	table = '';
	//totaleoh = 0;
	//totalgross = 0;
	linecount = doc.getLineItemCount('recmachcustrecord838');
	for(var i = 1; i <= linecount; i++) {
		doctype = doc.getLineItemValue('recmachcustrecord838', 'custrecord839', i);
		docnum = doc.getLineItemText('recmachcustrecord838', 'custrecord840', i);
		date = doc.getLineItemValue('recmachcustrecord838', 'custrecord841', i);
		
			table += rows(doctype, docnum, date);
		
	}
	//table += rows('Total Count : <b>' + (linecount) + '</b>','','','');
	
	html = html.replace('{principal}', principal);
	html = html.replace('{location}', location);
	html = html.replace('{dateofcount}', dateofcount);
	html = html.replace('{monthendcutoff}', monthendcutoff);
	
	html = html.replace('{body}', table);
	html = replaceall(html, '&', ' and ');
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', internalid + '.pdf', 'inline');
	response.write(file.getValue());
}
function rows(doctype, docnum, date) {
	return	"<tr>" +
			"<td class='subfour'>" + doctype + "</td>" +
			"<td class='subfour'>" + docnum + "</td>" +
			"<td class='subfour' align='center'>" + date + "</td>" +
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