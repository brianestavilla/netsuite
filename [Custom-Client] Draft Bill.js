function pageInit(type){
	if(type == 'create'){
	try{
		termID = nlapiLookupField('vendor', nlapiGetFieldValue('custbody120'), 'terms');
		nlapiSetFieldValue('custrecord726', termID);
	}catch(e){}
	}
}

function fieldChange(type, name){
	/*if(name == 'custrecord726'){
		termDue = nlapiLookupField('term', nlapiGetFieldValue(name), 'daysuntilnetdue');
		
		curDate = new Date();
		curDate.setDate(curDate.getDate() + parseInt(termDue));
		
		termDue =  curDate.getMonth() + '/'+ curDate.getDate() + '/'+ curDate.getFullYear();
		
		nlapiSetFieldValue('custrecord724', termDue);
	}*/
}

function reCalc(){
	subID = 'recmachcustrecord710';
	
	amount = 0;
	
	for(a = 1; a <= nlapiGetLineItemCount(subID); a++){
		amount = amount + parseFloat(nlapiGetLineItemValue(subID, 'custrecord709', a));
	}
	
	nlapiSetFieldValue('custrecord693', amount);
}