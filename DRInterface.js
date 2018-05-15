function DRInterface(request, response){
	if ( request.getMethod() == 'GET' ){
		var list = nlapiCreateList('Draft Interbranch Receiving Report');
		
		list.addColumn('custrecord459_display', 'text', 'From', 'left');
		var col = list.addColumn('custrecord464', 'date', 'Date', 'left');
		col.setURL(nlapiResolveURL('RECORD','customrecord216', null));//test
		col.addParamToURL('DRid','id', true);
		var id = nlapiGetContext().getSessionObject('ITOID');
		
		filter = new nlobjSearchFilter('custrecord460', null, 'is', id, null);
		var columns = new Array(
					new nlobjSearchColumn('custrecord459'),
					new nlobjSearchColumn('custrecord464')
		);
		
		var results = nlapiSearchRecord('customrecord214', 'customsearch227', null, columns);
		list.addRows(results);
		response.writePage(list);
	}
}

function getURLParameter(name, givenstring) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(givenstring)||[,null])[1]
    );
}