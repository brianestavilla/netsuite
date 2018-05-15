function setICO(rec_type, rec_id){
	var columns = new Array(
					new nlobjSearchColumn('item', null, 'group'),
					new nlobjSearchColumn('quantity', null, 'sum')
					);
	var icoList = nlapiSearchRecord('transaction', 'customsearch74', new nlobjSearchFilter('item', null, 'anyof', rec_id), columns);
	if(icoList != null) nlapiSubmitField(rec_type, rec_id, 'custitem3', ((parseFloat(icoList[0].getValue('quantity', null, 'sum')) * -1) / 180).toFixed(0));
	else nlapiSubmitField(rec_type, rec_id, 'custitem3', 0);
}