function suiteletSO(request, response){
	if ( request.getMethod() == 'GET' ){
		var list = nlapiCreateList('Custom Item Fulfillment');
			list.addColumn('type', 'text', 'Transaction Type', 'left');
			var col = list.addColumn('trandate', 'date', 'Date', 'left');
			col.setURL(nlapiResolveURL('SUITELET','customscript236', 'customdeploy1'));
			col.addParamToURL('SOid','id', true);
			list.addColumn('number', 'text', 'SO #', 'left');
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
				
		
		var results = nlapiSearchRecord('transaction', 'customsearch135', null, columns);
		
		list.addRows(results);
		response.writePage(list);
	}
}