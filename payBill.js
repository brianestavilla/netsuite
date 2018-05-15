function suiteletPOPayBill(request, response){
	if ( request.getMethod() == 'GET' ){
		var list = nlapiCreateList('Custom Pay Bill');
		list.addColumn('type', 'text', 'Transaction Type', 'left');
		var col = list.addColumn('trandate', 'date', 'Date', 'left');
		col.setURL(nlapiResolveURL('SUITELET','customscript232', 'customdeploy1'));
		col.addParamToURL('POid','id', true);
		list.addColumn('number', 'text', 'PO #', 'left');
		list.addColumn('name_display', 'text', 'Vendor Name', 'left');
		list.addColumn('memo', 'text', 'Memo', 'left');
		
		var columns = new Array(
					new nlobjSearchColumn('type'),
					new nlobjSearchColumn('trandate'),
					new nlobjSearchColumn('name'),
					new nlobjSearchColumn('number'),
					new nlobjSearchColumn('memo'),
					new nlobjSearchColumn('entity')
				);		
				
		
		var results = nlapiSearchRecord('transaction', 'customsearch204', null, columns);
		
		list.addRows(results);
		response.writePage(list);
		
	}
}