function getCustomerSalesman(request, response)
{
     if(request.getMethod() == 'GET')
	{
	var form = nlapiCreateForm('Choose Customer/Salesman');
	
	
	var column = new Array (
		new nlobjSearchColumn('internalid'),
		new nlobjSearchColumn('companyname')
	);
		
	var select = form.addField('selectcustsalesman','select', 'Customer/Salesman');
	select.addSelectOption('','');
	
	var filterItem1 = nlapiSearchRecord('customer', 'customsearch556_2', null, column);
	if(filterItem1 != null) {
		for(var i = 0; i < filterItem1.length; i++){
			var customer = filterItem1[i];
			select.addSelectOption(customer.getValue('internalid'),customer.getValue('companyname'));
		}
	}
	
	/*****************************************************************************************/
	
	var selectOperation = form.addField('selectoperation','select', 'Operation','customlist89');
	
	form.addSubmitButton('Submit');
	response.writePage(form);
	}else{
		var custSalesman = request.getParameter('selectcustsalesman');
		var operation = request.getParameter('selectoperation')
	
		var record = nlapiLoadRecord('customer',custSalesman); // load customer record
		var location = record.getFieldValue('custentity37'); // get location
		
		var cont = nlapiGetContext(); // intialize context
		cont.setSessionObject('custid',custSalesman); // create session object to getval
		cont.setSessionObject('opid',operation);
		cont.setSessionObject('locid',location);
		
		response.sendRedirect('RECORD','customrecord164',null,true,{custid:custSalesman,opid:operation,locid:location});
		
	}
}