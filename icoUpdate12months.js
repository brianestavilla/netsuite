function setICO(rec_type, rec_id)
{
	columns = new Array(
					new nlobjSearchColumn('internalid', 'custrecord386'),
					new nlobjSearchColumn('internalid'),
					new nlobjSearchColumn('custrecord387', 'custrecord386'),
					new nlobjSearchColumn('custrecord578', 'custrecord386')
					);	
	var filter = nlobjSearchFilter('internalid', null, 'anyof', rec_id);
	
	var icoList = nlapiSearchRecord('item', 'customsearch185', filter, columns);
	if(icoList != null)
	for(var i = 0; i < icoList.length; i++){	
		columns = new Array(
					new nlobjSearchColumn('internalid', 'item', 'group'),
					new nlobjSearchColumn('internalid', null, 'group'),
					new nlobjSearchColumn('location', null, 'group'),
					new nlobjSearchColumn('quantity', null, 'sum')
					);	
		var loc = (icoList[i].getValue('custrecord387', 'custrecord386') == null || icoList[i].getValue('custrecord387', 'custrecord386') == '') ? '' : icoList[i].getValue('custrecord387', 'custrecord386');
		if(loc != ''){
			filter = new Array(
					new nlobjSearchFilter('location', null, 'is', loc),
					new nlobjSearchFilter('internalid', 'item', 'is', rec_id)
				);
			var icoQuantity = nlapiSearchRecord('transaction', 'customsearch241', filter, columns);	
			if(icoQuantity != null)
			{
				var quantity = (icoQuantity[0].getValue('quantity', null, 'sum')/12); // monthly average sales 
				var daily_sales = quantity / 26;
				var ico_quantity = daily_sales * parseInt(icoList[i].getValue('custrecord578', 'custrecord386'));
				if(ico_quantity > 0)
					nlapiSubmitField('customrecord196', icoList[i].getValue('internalid', 'custrecord386'), 'custrecord388', ico_quantity.toFixed(0));
				else nlapiSubmitField('customrecord196', icoList[i].getValue('internalid', 'custrecord386'), 'custrecord388', 0);
			}
			else
				nlapiSubmitField('customrecord196', icoList[i].getValue('internalid', 'custrecord386'), 'custrecord388', 0);
		}
	}
}