function suitelet(request, response){
	POID = request.getParameter('POID');
	
	ctx = nlapiGetContext();
	ctx.setSessionObject('POID', POID);
	
	URL = '/app/accounting/transactions/vendbill.nl?transform=purchord&whence=&id=' + ctx.getSessionObject('POID') + '&e=T&memdoc=0';
	
	response.write('<script>window.location=\'' + URL + '\';</script>');
}