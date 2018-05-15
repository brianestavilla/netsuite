function validateBankAccounts(type, name){
	//if the user will change the
	if(name == 'custbody50'){ // Bank Account No. field
		try{			
			checkBankAccountNumber();
		}
		catch (err){
			alert(err.message);
		}
	}
}

function checkBankAccountNumber(){	
		
	if(nlapiGetFieldValue('customer') != "" && nlapiGetFieldValue('custbody50') !="" && nlapiGetFieldValue('custbody1') != ""){
		
		var accountFilters = new Array( // WHERE 
			new nlobjSearchFilter('custrecord757',null,'is',nlapiGetFieldValue('custbody50')), // account number = Bank Account No. field('custbody50') AND 
			new nlobjSearchFilter('custrecord35',null,'is',nlapiGetFieldValue('customer')), //customer	= Customer field('customer') AND
			new nlobjSearchFilter('custrecord36',null,'is',nlapiGetFieldValue('custbody1'))	//bank name = Bank of Payment field('custbody1')	
		);
		
		var result = nlapiSearchRecord('customrecord115','customsearch89',accountFilters,null);					
		var count = -1;
		alert((result != null ? 'Bank account number '+ result[0].getValue('custrecord757') + ' verified.' : 'Bank account not found!'));	
	}
	else{
		alert('Plase enter a valid data for "Customer", "Bank Acount No." and "Bank of Payment"  field.');		
		nlapiSetFieldValue('custbody50',"",false);
		nlapiSetFieldValue('custbody1',"",false);			
	}				
	
	if(name == 'custbody1'){ // Bank list		
		nlapiSetFieldValue('custbody50',"",false);		
	}
	
	if(name == 'customer'){	// Customer list	
		nlapiSetFieldValue('custbody50',"",false);
		nlapiSetFieldValue('custbody1',"",false);
	}
}