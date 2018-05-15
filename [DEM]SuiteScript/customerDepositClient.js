/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Aug 2014     Redemptor
 *
 */

function clientSaveRecord(){
	if(nlapiGetFieldValue('undepfunds')  != 'T'){
		alert('Please select Undeposited Funds');
		return false;
	}
	
	return true;
}

function clienPageInit(){
	
	nlapiSetFieldValue('undepfunds', 'T');
}