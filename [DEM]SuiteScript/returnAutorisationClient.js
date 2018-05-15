/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientPageInit(type) {
	if(type=='create') {
		var principal = nlapiLookupField('employee', nlapiGetUser(), 'class', false);
		nlapiSetFieldValue('class', principal);
	}
		
}

function clientFieldChanged(type, name){
	switch(name){
	case 'entity' :
		setSalesman(nlapiGetFieldValue('entity'), nlapiGetFieldValue('class'));
		break;
	case 'class' :
		setSalesman(nlapiGetFieldValue('entity'), nlapiGetFieldValue('class'));
		break;
	}
}

function clientSaveRecord(){

	var location = nlapiGetFieldText('location');
	
	if(nlapiGetFieldValue('subtotal') == '0.00' && location.match(/FREE/gi) == null){
		alert('Total amount should not be zero!');
		return false;
	}

	return true;
}

function setSalesman(customer,principal){
	if(customer != '' && principal != ''){
		nlapiSetFieldValue('salesrep',getSalesman(customer,principal));
	}
}

function getSalesman(customer,principal){
	try{
		var searchFilters = new Array(
			new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
			new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
			);
		var searchColumns = new nlobjSearchColumn('custrecord340');
		var result = nlapiSearchRecord('customrecord150', null, searchFilters, searchColumns);
		var salesrep = result[0].getValue('custrecord340') || '';
		return salesrep;
	} catch(e) {}
}
