function calculate(type, name){
	//*****LABOR COST SUBLIST****** recmachcustrecord523
	//No. of Days = custrecord668
	//Rate	= 	custrecord522
	//Amount	 = custrecord669
	//Job Code = custrecord520
	
	//*****MATERIAL COST SUBLIST**** recmachcustrecord636  
	//Quantity = custrecord635
	//Unit Cost = custrecord642
	//Amount = custrecord643
	//Item Code = custrecord638
	
	//Description field = custrecord676
	//Description Tab = recmachcustrecord675
	
	//Labor Cost	
	
		if(nlapiGetCurrentLineItemValue('recmachcustrecord523','custrecord522') != '' && nlapiGetCurrentLineItemValue('recmachcustrecord523','custrecord668') != ''){
		
			nlapiSetCurrentLineItemValue('recmachcustrecord523','custrecord669',nlapiGetCurrentLineItemValue('recmachcustrecord523','custrecord522')*nlapiGetCurrentLineItemValue('recmachcustrecord523','custrecord668'));
			return true;
		}
	
	//Material Cost
	
		else if(nlapiGetCurrentLineItemValue('recmachcustrecord636','custrecord635') != '' && nlapiGetCurrentLineItemValue('recmachcustrecord636','custrecord642') != ''){
		
			nlapiSetCurrentLineItemValue('recmachcustrecord636','custrecord643',nlapiGetCurrentLineItemValue('recmachcustrecord636','custrecord635')*nlapiGetCurrentLineItemValue('recmachcustrecord636','custrecord642'));
			return true;
		}
	
	//Description
		else if(nlapiGetCurrentLineItemValue('recmachcustrecord675','custrecord676') != ''){
			return true;
		}
		
	//Prompt error message	
		else{
			alert('some fields are empty');
			return false;		
		}	
	
}

function checkingBeforeSave(){
		var locationid = nlapiGetFieldValue('custrecord513');
	if(locationid != ''){
		var isActive = nlapiLookupField('location', locationid, 'isinactive');
		if(isActive == 'T'){
			alert('Location is inactive. Please contact administrator.');
			return false;
		}else{
			return true;
		}
	}
}
