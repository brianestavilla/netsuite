function beforeLoad(type,form,request){
try{
	if(type == 'create'){
	var vendbill = request.getParameter('bill');
	var princ = nlapiLookupField('vendorbill',vendbill,'class');
	var dept = nlapiLookupField('vendorbill',vendbill,'department');
	var loc = nlapiLookupField('vendorbill',vendbill,'location');
	
	nlapiSetFieldValue('class',princ);
	nlapiSetFieldValue('department',dept);
	nlapiSetFieldValue('location',loc);
	nlapiLogExecution('DEBUG','<Before Load Script> type:'+vendbill);
	}
}catch(err){}
}