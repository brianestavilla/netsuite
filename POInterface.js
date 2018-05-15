function suiteletPO(request, response){
	if ( request.getMethod() == 'GET' ){
		var list = nlapiCreateList('Draft Receive Order');
		//list.addColumn('process', 'text', 'Process', 'left');
		list.addColumn('type', 'text', 'Transaction Type', 'left');
		var col = list.addColumn('trandate', 'date', 'Date', 'left');
		col.setURL(nlapiResolveURL('SUITELET','customscript232', 'customdeploy1'));
		col.addParamToURL('POid','id', true);
		list.addColumn('number', 'text', 'PO #', 'left');
		list.addColumn('name_display', 'text', 'Vendor Name', 'left');
		list.addColumn('memo', 'text', 'Memo', 'left');
		
		var columns = new Array(
					//new nlobjSearchColumn('process'),
					new nlobjSearchColumn('type'),
					new nlobjSearchColumn('trandate'),
					new nlobjSearchColumn('name'),
					new nlobjSearchColumn('number'),
					new nlobjSearchColumn('memo')
				);		
				
		
		var results = nlapiSearchRecord('transaction', 'customsearch127', null, columns);
		
		list.addRows(results);
		response.writePage(list);
		
	}
}