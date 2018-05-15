function getOperation_fieldChange(type, name)
{
	if(name == "selectcustsalesman")
	{
		var column = new Array (
				new nlobjSearchColumn('custrecord_disc_prin_operation')//operation
		);
      
		var getOperationFilter = new nlobjSearchFilter('custrecord29', null, 'anyof', nlapiGetFieldValue('selectcustsalesman')); //customer
      
        var getOperation = nlapiSearchRecord('customrecord110', null, getOperationFilter,  column);
		
      	if(getOperation != null)
        {
        	nlapiSetFieldValue('selectoperation',getOperation[0].getValue('custrecord_disc_prin_operation'));
        }
	}
}