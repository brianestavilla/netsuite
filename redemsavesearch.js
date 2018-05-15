function posavesearch(request, response){
	if(request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Filter PO');
		form.addField('selectvendor','select', 'Select Vendor', 'vendor');
		form.addSubmitButton('Get PO');
		
		response.writePage(form);
	}else{
		var vendor = request.getParameter('selectvendor'),
		list = nlapiCreateList('Purchase Order');
		
		list.addColumn('trandate', 'date', 'Date', 'left');
		list.addColumn('number', 'text', 'Number', 'left');
		list.addColumn('name_display', 'text', 'Name', 'left');
		list.addColumn('amount', 'currency', 'Amount', 'right');
		
		var columns = new Array(new nlobjSearchColumn('trandate'),		
							new nlobjSearchColumn('number'),			
							new nlobjSearchColumn('name'),	
							new nlobjSearchColumn('amount')); 	
		var filter = new nlobjSearchFilter('name', null, 'anyof', vendor);
		var results = nlapiSearchRecord('transaction', 'customsearch60', filter, columns);
		list.addRows(results);
		response.writePage(list);
	}
}