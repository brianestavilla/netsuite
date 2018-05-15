function suitelet(request, response){
	if(request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Sales Order Item List');
		form.addSubmitButton('Generate Report');
		form.addField('pickingnumber', 'text', 'Picking List # ');
		form.addField('trucknumber', 'text', 'Truck # ');
		form.setScript('customscript439');
		var prepared = form.addField('prepared', 'select', 'Prepared By ', 'employee');
		prepared.setDefaultValue(nlapiGetUser());
		//Specific Columns for the List
		var columns = [new nlobjSearchColumn('number'),
						new nlobjSearchColumn('name'),
						new nlobjSearchColumn('item'),
						new nlobjSearchColumn('quantity'),
						new nlobjSearchColumn('unit'),
						new nlobjSearchColumn('billaddress')
						];
		var result = nlapiSearchRecord('transaction', 'customsearch449', null, columns);
		//Create Form Sublist
		var sublist = form.addSubList('sublist', 'list', 'Items');
		sublist.addMarkAllButtons();
		sublist.addRefreshButton();
		sublist.addField('ifpick', 'checkbox', 'Pick');
		sublist.addField('number', 'integer', 'SO Number');
		sublist.addField('billaddress', 'text', 'Bill Address');
		sublist.addField('name_display', 'text', 'Customer');
		sublist.addField('item_display', 'text', 'Item');
		sublist.addField('unit', 'text', 'Units');
		sublist.addField('quantity', 'integer', 'Quantity');
		sublist.setLineItemValues(result);
		nlapiGetContext().setSessionObject('status', 'get');
		response.writePage(form);
	}else{
		var context = nlapiGetContext(),
				form = nlapiCreateForm('Pick List Preview'),
				trucknumber = request.getParameter('trucknumber'),
				prepared = request.getParameter('prepared'),
				pickingnumber = request.getParameter('pickingnumber'),
				linecount = request.getLineItemCount('sublist'),
				pick_list = new Object(),
				line_item = new Object(),
				line_item_array = new Array(),
				j = 1
		;
		if(nlapiGetContext().getSessionObject('status') == 'get'){
			form.addSubmitButton('Print Pick List');
			var number1 = form.addField('pickingnumber', 'text', 'Picking List # ').setDefaultValue(pickingnumber);
			form.getField('pickingnumber').setDisplayType('inline');	
			var tnumber = form.addField('trucknumber', 'text', 'Truck # ').setDefaultValue(trucknumber);
			form.getField('trucknumber').setDisplayType('inline');
			var prepared = form.addField('prepared', 'select', 'Prepared By ', 'employee').setDefaultValue(nlapiGetUser());
			form.getField('prepared').setDisplayType('inline');
			
			var sublist = form.addSubList('sublist', 'list', 'Items');
			sublist.addField('item_display', 'text', 'Item');
			sublist.addField('unit', 'text', 'Units');
			sublist.addField('quantity', 'integer', 'Quantity');
			
			for(var i = 1; i <= linecount; i++)
			{
				if(request.getLineItemValue('sublist', 'ifpick', i) == 'T')
				{
					var itemname = request.getLineItemValue('sublist', 'item_display', i),
						unit = request.getLineItemValue('sublist', 'unit', i),
						quantity = request.getLineItemValue('sublist', 'quantity', i)
					;
					if(line_item.hasOwnProperty(itemname + "_" +unit))
						line_item[itemname + "_" + unit] += parseInt(quantity);
					else line_item[itemname + "_" + unit] = parseInt(quantity);
				}
			}
			for(var i in line_item)
			{
				var split = i.split('_');
				sublist.setLineItemValue('item_display', j, split[0]);
				sublist.setLineItemValue('unit', j, split[1]);
				sublist.setLineItemValue('quantity', j, line_item[i].toFixed(0));
				j++
			}
			pick_list.itemsublist = line_item;
			nlapiGetContext().setSessionObject('status', 'post')
			response.writePage(form);
			
		}else{
			var context = nlapiGetContext(), 
				html = context.getSetting('SCRIPT', 'custscript20'),
				linecount = 
				tablerow = ""
			;
			for(var i = 1; i <= request.getLineItemCount('sublist'); i++)
			{
				var itemname = request.getLineItemValue('sublist', 'item_display', i),
						unit = request.getLineItemValue('sublist', 'unit', i),
						quantity = request.getLineItemValue('sublist', 'quantity', i)
				;
				tablerow += rows(itemname, unit, quantity);
			}
			html = html.replace('{trucknumber}', trucknumber);
			html = html.replace('{preparedby}', nlapiLookupField('employee', nlapiGetUser(), 'entityid', false));
			html = html.replace('{picknumber}', pickingnumber);
			html = html.replace('{body}', tablerow);
			
			var file = nlapiXMLToPDF(html);
			response.setContentType('PDF', 'picklist'+ pickingnumber +'.pdf', 'inline');
			response.write(file.getValue());
		}
	}
}
function rows(itemname, unit, quantity) {
	return	"<tr>" +
			"<td width='150'>" + itemname + "</td>" +
			"<td align='center' width='150'>" + unit + "</td>" +
			"<td align='right' width='150'>" + addCommas(quantity) + "</td>" +
			"</tr>"
			;
			
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