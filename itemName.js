function setItem(type, name){
	if(name == 'custitem10' || name == 'displayname'){
		var code = (nlapiGetFieldValue('custitem10') == null) ? '' : nlapiGetFieldValue('custitem10');
		var name = (nlapiGetFieldValue('displayname') == null) ? '' : nlapiGetFieldValue('displayname');
		nlapiSetFieldValue('itemid', custitem10 + " " + displayname);
	}
	if(name == 'itemid'){
		var code = (nlapiGetFieldValue('custitem10') == null) ? '' : nlapiGetFieldValue('custitem10');
		var name = (nlapiGetFieldValue('displayname') == null) ? '' : nlapiGetFieldValue('displayname');
		if(nlapiGetFieldValue('itemid') != (custitem10 + " " + displayname)){
			nlapiSetFieldValue('itemid', custitem10 + " " + displayname);
		}

	}

}
