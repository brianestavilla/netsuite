function checkUC(type, form) {
	var _customform = nlapiGetFieldValue('customform'); 
	linecount = nlapiGetLineItemCount('item');
	condition =  true;
	
	if(_customform != 174){ //if not free goods
		if(_customform != 173){ //and return autorization
			for(var i = 1; i <= linecount; i++) {
				check = nlapiGetLineItemValue('item', 'itemreceive', i);
				if(check == 'T') {
					uc = nlapiGetLineItemValue('item', 'custcol25', i);
					if(uc == 0 || uc == '' || uc == null) {
						condition = false;
						break;
					}
				}
			}
			if(!condition) {
				alert('Item cannot be received. Please provide the Unit Cost.');
				return false;
			} else {
				return true;
			}
		}else{
			return true;
		}
	}else{
		return true;
	}
}
//custcol30 RR quantity ID; UNITCOST = custcol25
function fieldChanged(type, name){
	principal = nlapiGetFieldValue('class');
	if(name == 'custcol25') 
	{
		unitcost = nlapiFormatCurrency(nlapiGetLineItemValue('item', 'custcol25', nlapiGetCurrentLineItemIndex('item')));
		itemid = nlapiGetLineItemValue('item', 'item', nlapiGetCurrentLineItemIndex('item'));
		var units = nlapiGetLineItemText('item', 'custcol17', nlapiGetCurrentLineItemIndex('item'));
		var po = nlapiGetFieldValue('createdfrom');
		var filter = new Array (
			new nlobjSearchFilter('internalid', null, 'is', po),
			new nlobjSearchFilter('item', null, 'is', itemid)
		);
		var column = new Array (
			new nlobjSearchColumn('custcol32'),//purchase price 
			new nlobjSearchColumn('custcol10')
		);
		var filterItem1 = nlapiSearchRecord('purchaseorder', null, filter, column);
		if(filterItem1 != null && (units != null && units != '')) {
				var units_type = getFieldID(itemid, 'unitstype');
				conversionrate = getFieldID(itemid, 'custitem72');
				
				var price_piece = filterItem1[0].getValue('custcol32');// conversionrate;
				conversion_rate = conversionRate(units_type, units);
				price = price_piece * conversion_rate;
			//purchasePrice = (price);
			var wew = (parseFloat(price) * 1.12).toFixed(5);
			if(principal == '6') {
				pp = nlapiFormatCurrency(wew);
			} else {
				pp = nlapiFormatCurrency(price);
			}
			
			// Validate unitcost from PO price
			if(unitcost != pp) {
				alert('Unit Cost does not match with Purchase Price.');
				nlapiSetLineItemValue('item', 'custcol25', nlapiGetCurrentLineItemIndex('item'), 0, false);
			}
		}
	}
}

function getFieldID(itemid, field_id){
	try{
		record = nlapiLookupField('inventoryitem', itemid, field_id);
	}catch(e) {
		try{
			record = nlapiLookupField('noninventoryitem', itemid, field_id);
		}catch(e){
			try{
				record = nlapiLookupField('otherchargeitem', itemid, field_id);
			}catch(e){
				try{
					record = nlapiLookupField('paymentitem', itemid, field_id);
				}catch(e){
					record = nlapiLookupField('serviceitem', itemid, field_id);
				}
			}
		}
	}
	return record;
}

function conversionRate(unitstype, unitname){
	filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
				new nlobjSearchFilter('abbreviation', null, 'is', unitname)
		);

	search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
	return search[0].getValue('conversionrate');
}