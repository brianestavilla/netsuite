function createPOtoCustRR(request, response){
		internalid = request.getParameter("internalid");				
		ctx = nlapiGetContext();
		ctx.setSessionObject('iPOID', internalid);
		response.sendRedirect('RECORD', 'customrecord168', null);
}