function filterRecord(request,response){
	if(request.getMethod() == 'GET'){
		
		var filterForm = nlapiCreateForm('FilterForm');
		filterForm.addField('ta_01','select','Filter Name: ','Customer');		
		filterForm.addSubmitButton('Get Name');
		response.writePage(filterForm);
	}
	else{
		var getName = request.getParameter('ta_01'),
			solist = nlapiCreateList('IAN List');
			
			solist.addColumn('trandate','date','Date','left');
			solist.addColumn('name_display','text','Name','left');
			solist.addColumn('amount','currency','Amount','left');
			solist.addColumn('billaddress','text','Address','right');
			
			var soColumns = new Array(
					
					new nlobjSearchColumn('trandate'),
					new nlobjSearchColumn('name'),
					new nlobjSearchColumn('amount'),
					new nlobjSearchColumn('billaddress')
			);
			var sofilter = new nlobjSearchFilter('name',null,'anyof',getName);
			var results = nlapiSearchRecord('transaction','customsearch61',sofilter,soColumns);
			solist.addRows(results);
			response.writePage(solist);
	}
}