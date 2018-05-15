function suitelet(request, response){
	var context = nlapiGetContext(), 
		html = context.getSetting('SCRIPT', 'custscript19'),
		picklist = context.getSessionObject('picklist'),
		item_list = picklist.itemsublist,
		tablerow = ""
	;
	for(i in item_list)
	{
		var split = i.split('_');
		tablerow += rows(split[0], split[1], item_list[i].toFixed(0));
	}
	html = html.replace('{trucknumber}', picklist.trucknumber);
	html = html.replace('{preparedby}', picklist.preparedby);
	html = html.replace('{picknumber}', picklist.pickingnumber);
	html = html.replace('{body}', tablerow);
	
	var file = nlapiXMLToPDF(html);
	response.setContentType('PDF', 'picklist'+ picklist.pickingnumber +'.pdf', 'inline');
	response.write(file.getValue());
}

function rows(itemname, unit, quantity) {
	return	"<tr>" +
			"<td width='300'>" + itemname + "</td>" +
			"<td width='150'>" + unit + "</td>" +
			"<td width='150'>" + quantity + "</td>" +
			"</tr>"
			;
			
}