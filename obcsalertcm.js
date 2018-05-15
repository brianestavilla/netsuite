function bugetlimitcm(type, name){
	var princ = nlapiGetFieldValue('custrecord126');
	var location = nlapiGetFieldValue('custrecord128');
	var acc = nlapiGetCurrentLineItemValue('recmachcustrecord101','custrecord104');
	var postper = nlapiGetFieldValue('custrecord118');
	var accamnt = nlapiGetCurrentLineItemValue('recmachcustrecord101','custrecord110');
	
	if((location != null && princ != null) && (location != '' && princ != ''))
	{
		var filter = [
				new nlobjSearchFilter('custrecord126', null, 'anyof', princ),
				new nlobjSearchFilter('custrecord128', null, 'anyof', location),
				new nlobjSearchFilter('custrecord104','custrecord101', 'anyof', acc),
				new nlobjSearchFilter('custrecord118',null,'anyof', postper)
			];
		var column = new nlobjSearchColumn('custrecord110','custrecord101','SUM');
		try{
		var result = nlapiSearchRecord('customrecord136','customsearch871',filter,column);
		var amnt = result[0].getValue('custrecord110','custrecord101','SUM');
		}catch(err){
			var amnt = 0;
		}
		var totalamnt = parseFloat(amnt) + parseFloat(accamnt);  	
		switch(acc){
		case '34003': //613000001 Operating Expenses : Marketing, Advertising & Promotions-Display Allow//subd(MNC
			x = new nlobjSearchColumn('custrecord_budget_sales_subdexpense');
			y = 'custrecord_budget_sales_subdexpense';
		break;
		default:
			//not in the budget list COA
			x = '';
			y= '';
		}
		
		if(x != ''){
			var filter1 = [
				new nlobjSearchFilter('custrecord_budgetprincipal', null, 'anyof', princ),
				new nlobjSearchFilter('custrecord_budgetlocation', null, 'anyof', location),
				new nlobjSearchFilter('custrecord_budgetpostingperiod', null, 'anyof', postper)
			];
			
			var result = nlapiSearchRecord('customrecord_budget', null, filter1, x);
			var budgetamnt = result[0].getValue(y);
				if(budgetamnt < totalamnt){
					alert('UNABLE TO PROCEED, EXCEEDED ALLOCATED BUDGET');
					return false;
				}else{
					return true;
				}
		}else{
			return true;
		}
	}else{
		return true;
	}
}