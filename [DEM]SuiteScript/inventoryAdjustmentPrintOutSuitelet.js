/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Sep 2014     Redemptor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	var internalid = request.getParameter('internalid');
	var record = nlapiLoadRecord('inventoryadjustment', internalid);
	
	var refNo = record.getFieldValue('tranid');
	var estimatedTotalValue = record.getFieldValue('estimatedtotalvalue');
	var date = record.getFieldValue('trandate');
	var memo = record.getFieldValue('memo') || '';
	var principal = record.getFieldText('class');
	var adjustmentLocation = record.getFieldText('adjlocation');
	var rows = '';
	var count = record.getLineItemCount('inventory');
	
	for(var i = 1; i <= count; i++){
		var item = record.getLineItemText('inventory', 'item', i);
		var location = record.getLineItemText('inventory', 'location', i);
		var units = record.getLineItemText('inventory', 'units', i);
		var qtyonhand = record.getLineItemValue('inventory', 'quantityonhand', i);
		var currentvalue = record.getLineItemValue('inventory', 'currentvalue', i);
		var adjustqtyby = record.getLineItemValue('inventory', 'adjustqtyby', i);
		var newqty = record.getLineItemValue('inventory', 'newquantity', i);
		var estunitcost = record.getLineItemValue('inventory', 'unitcost', i);
		rows += addRow(item, location, units, qtyonhand, currentvalue, adjustqtyby, newqty, estunitcost);
	}
	
	var html = nlapiGetContext().getSetting('SCRIPT', 'custscript36'); // sandbox = custscript35
	html = html.replace('{refNo}', refNo);
	html = html.replace('{estimatedTotalValue}', addCommas(estimatedTotalValue));
	html = html.replace('{date}', date);
	html = html.replace('{memo}', memo);
	html = html.replace('{principal}', principal);
	html = html.replace('{adjustmentLocation}', adjustmentLocation);
	html = html.replace('{rows}', rows);
	html = replaceall(html, '&', ' and ');
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', refNo + '.pdf', 'inline');
	response.write(file.getValue());
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

function addRow(item, location, units, qtyonhand,currentvalue,adjustqtyby,newqty,estunitcost) {
	return	"<tr class='tableContent'>" +
			"<td>" + item + "</td>" +
			"<td>" + location.replace('&', ' and ') + "</td>" +
			"<td align='center'>" + units + "</td>" +
			"<td align='right'>" + addCommas(qtyonhand) + "</td>" +
			"<td align='right'>" + addCommas(currentvalue) + "</td>" +
			"<td align='right'>" + addCommas(adjustqtyby) + "</td>" +
			"<td align='right'>" + addCommas(newqty) + "</td>" +
			"<td align='right'>" + addCommas(estunitcost) + "</td>" +
			"</tr>";
}