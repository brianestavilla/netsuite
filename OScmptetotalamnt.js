function computetotalamount(type,name){
	
	var currenteoh = nlapiGetCurrentLineItemValue('recmachcustrecord810','custrecord814'); //current quantity
	var currentpurchaseprice = nlapiGetCurrentLineItemValue('recmachcustrecord810','custrecord813'); //current price

	if(name == 'custrecord811'){
		var getitem = nlapiGetCurrentLineItemValue('recmachcustrecord810','custrecord811');
		var filter =  new nlobjSearchFilter('internalid',null, 'is', getitem);
		var column =  new nlobjSearchColumn('formulanumeric');
		var filterprice = nlapiSearchRecord('item','customsearch612', filter,column);//Last Purchase Price of Nontrade Item
		
		if(filterprice != null){	
			var result = filterprice[0].getValue('formulanumeric');
			nlapiSetCurrentLineItemValue('recmachcustrecord810','custrecord813',result);
			
		}else{
		alert('No Last Purchase Price');
		nlapiSetCurrentLineItemValue('recmachcustrecord810','custrecord813','0.00'); 
		}
	}  
	
	if(name == 'custrecord814'){
		if(parseFloat(currentpurchaseprice) != 0.00){
			var total = parseFloat(currentpurchaseprice) * currenteoh;
			nlapiSetCurrentLineItemValue('recmachcustrecord810','custrecord815',total); //set value for total amount
		}else{
			alert('Invalid current price. Must be greater than 0');
		}	
	}
}
