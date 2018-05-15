function printRR(request, response) {
	
	//replace aaa with html id DONE
	internalid = request.getParameter("internalid");
	rr = nlapiLoadRecord('itemreceipt', internalid);
	
	vendor = (rr.getFieldText('entity') == null) ? '' : rr.getFieldText('entity');
	cfrom = rr.getFieldValue('createdfrom');
	type = rr.getFieldValue('customform');
	ifto = false;
	try {
		var cf = nlapiLoadRecord('purchaseorder', cfrom);
		amtamount = cf.getFieldValue('custbody142');
		lastcolumn = 'UNIT COST';
		salesman = '';
		html = nlapiGetContext().getSetting('SCRIPT', 'custscript16');
	}
	catch (e){
		try {
			cf = nlapiLoadRecord('vendorreturnauthorization', cfrom);
			html = nlapiGetContext().getSetting('SCRIPT', 'custscript26');
		} catch (e) {
			cf = nlapiLoadRecord('transferorder', cfrom);
			html = nlapiGetContext().getSetting('SCRIPT', 'custscript24');
			amtamount = cf.getFieldValue('total');
			lastcolumn = 'SALES PRICE';
			salesman = cf.getFieldText('custbody172');
			ifto = true;
		}
	}
	address = (cf.getFieldValue('shipaddress') == null) ? '' : cf.getFieldValue('shipaddress');
	supinvnum = (rr.getFieldValue('custbody156') == null) ? '' : rr.getFieldValue('custbody156');
	ponum = (cf.getFieldValue('tranid') == null) ? '' : cf.getFieldValue('tranid');
	podate = (cf.getFieldValue('trandate') == null) ? '' : cf.getFieldValue('trandate');
	refnum = (rr.getFieldValue('tranid') == null) ? '' : rr.getFieldValue('tranid');
	date = (rr.getFieldValue('trandate') == null) ? '' : rr.getFieldValue('trandate');
	//tableHere
	remarks = (rr.getFieldValue('memo') == null) ? '' : rr.getFieldValue('memo');
	recby = (rr.getFieldText('custbody8') == null) ? '' : rr.getFieldText('custbody8');
	checkby = (rr.getFieldText('custbody115') == null) ? '' : rr.getFieldText('custbody115');
	released = (rr.getFieldText('custbody157') == null) ? '' : rr.getFieldText('custbody157');
	//table
	total = 0;
	tablerow = '';
	totalbulk = 0;
	totalpc = 0;
	totalquan = 0;
	totalamount = 0;
	bulk = '';
	linecount = rr.getLineItemCount('item');
	to_linecount = cf.getLineItemCount('item');
	location = '';
	if(lastcolumn == 'UNIT COST'){
	totalamountdue = 0;
		for(var i = 1; i <= linecount; i++) {
			item = rr.getLineItemText('item', 'item', i);
			location = (rr.getLineItemText('item', 'location', i) == null) ? '' : rr.getLineItemText('item', 'location', i);
			bulk = (rr.getLineItemValue('item', 'custcol22', i) == null) ? 0 : rr.getLineItemValue('item', 'custcol22', i);
			pc = (rr.getLineItemValue('item', 'custcol23', i) == null) ? 0 : rr.getLineItemValue('item', 'custcol23', i);
			ucost = (rr.getLineItemValue('item', 'custcol25', i) == null) ? 0.00 : rr.getLineItemValue('item', 'custcol25', i);
			quan = (rr.getLineItemValue('item', 'quantity', i) == null) ? 0 : rr.getLineItemValue('item', 'quantity', i);
			btotal = ucost * parseFloat(quan);
			totalamountdue += (parseFloat(ucost) * quan);
			totalquan +=  parseFloat(quan);
			totalbulk += parseFloat(bulk);
			totalpc += parseFloat(pc);
			total += parseFloat(btotal);
			totalamount += parseFloat(ucost);
			tablerow += AR(replaceall(item, '&', ' and '), location, quan, ucost);
		}
		tablerow += AR('', '<p align="right">TOTAL QTY:</p>', totalquan, '');
	}
	else {
		totalamountdue = 0;
		amountdue= 0;
		for(var i = 1; i <= to_linecount; i++) {
		
		received = (cf.getLineItemValue('item', 'quantityreceived', i) == null) ? 0 : cf.getLineItemValue('item', 'quantityreceived', i);
		
		if(received != 0) {
			item = cf.getLineItemText('item', 'item', i);
			unit = (cf.getLineItemText('item', 'units', i) == null) ? 0 : cf.getLineItemText('item', 'units', i);
			ucost = (cf.getLineItemValue('item', 'custcol30', i) == null) ? 0.00 : cf.getLineItemValue('item', 'custcol30', i);
			quan = (cf.getLineItemValue('item', 'quantity', i) == null) ? 0 : cf.getLineItemValue('item', 'quantity', i);
			amount1 = (cf.getLineItemValue('item', 'custcol32', i) == null) ? 0 : cf.getLineItemValue('item', 'custcol32', i);
			btotal = ucost * parseFloat(quan);
			totalamountdue += (parseFloat(ucost) * quan);
			totalquan +=  parseFloat(quan);
			total += parseFloat(btotal);
			totalamount += parseFloat(ucost);
			amountdue += parseFloat(amount1);
			tablerow += addRow(lastcolumn, replaceall(item, '&', ' and '), location, quan,'', addCommas(nlapiFormatCurrency(ucost)), unit, amount1);
		}
			}
		tablerow += addRow(lastcolumn, "<p align='right'>TOTAL:</p>", '', totalquan, '', '', '',amountdue);
	}
	//custscript16
	//poamt = nlapiLoadRecord('purchaseorder', cfrom);
	
	html = html.replace('{vendor}', vendor.replace('&', ' and '));
	html = html.replace('{address}', address.replace('&', ' and '));
	html = html.replace('{supinvnum}', supinvnum);
	html = html.replace('{ponum}', ponum); 
	if(type  == '141') {
		html = html.replace('{totalamount}', addCommas(nlapiFormatCurrency(totalamountdue)));
	} else {
		html = html.replace('{totalamount}', addCommas(nlapiFormatCurrency(totalamountdue)));
	}
	html = html.replace('{podate}', podate);
	html = html.replace('{refnum}', refnum);
	html = html.replace('{date}', date);
	html = html.replace('{tablerow}', tablerow);
	html = html.replace('{remarks}', remarks.replace('&', ' and '));
	html = html.replace('{recby}', recby);
	html = html.replace('{releasedby}', released);
	html = html.replace('{checkby}', checkby);
	html = html.replace('UNIT COST', lastcolumn);
	html = html.replace('{salesman}', salesman);
	html = html.replace('{salesman}', salesman);
	html = replaceall(html, '&', ' and ');
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', refnum + '.pdf', 'inline');
	response.write(file.getValue());
}

function addRow(column, item, tolocation, qty1, qty2, ucost, unit, amount) {
	if(column != 'SALES PRICE')
	return	"<tr>" +
			"<td>" + item + "</td>" +
			"<td>" + tolocation.replace('&', ' and ') + "</td>" +
			"<td align='center'>" + qty1 + "</td>" +
			"<td align='center'>" + qty2 + "</td>" +
			"<td align='right'>" + addCommas(ucost) + "</td>" +
			"</tr>";
	else 
	return "<tr>" +
			"<td>" + item + "</td>" +
			"<td align='center'>" + unit + "</td>" +
			"<td align='center'>" + qty1 + "</td>" +
			"<td align='right'>" + ucost + "</td>" +
			"<td align='right'>" + addCommas(nlapiFormatCurrency(amount)) + "</td>" +
			"</tr>";
}
function AR(item, tolocation, quan, ucost) {
	return	"<tr>" +
			"<td>" + item + "</td>" +
			"<td>" + tolocation.replace('&', ' and ') + "</td>" +
			"<td align='center'>" + quan + "</td>" +
			"<td align='right'>" + addCommas(ucost) + "</td>" +
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