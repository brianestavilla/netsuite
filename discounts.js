function removeDiscount()
{
		var line = nlapiFindLineItemValue('item', 'item', '595');
		if(line > -1)
		{
			nlapiRemoveLineItem('item', line);
		}
}function loadDiscounts(type, form) {
		var itemid = nlapiGetCurrentLineItemValue('item', 'item');
		var location = nlapiGetFieldText('location');
		var principal = nlapiGetFieldValue('class');
		var parent = location.split(':');
		var parentLocation = parent[0].replace(' ', '');
			if(location == null || location == '') {
				alert('Please identify the Location first');
			} else {
				var filter = new Array (
					new nlobjSearchFilter('custrecord742', null, 'is', itemid),
					new nlobjSearchFilter('custrecord743', null, 'is', parentLocation)
				);
				var column = new Array (
					new nlobjSearchColumn('custrecord734'),
					new nlobjSearchColumn('custrecord735'),
					new nlobjSearchColumn('custrecord736'),//d1
					new nlobjSearchColumn('custrecord737'),//d2
					new nlobjSearchColumn('custrecord738'),//d3
					new nlobjSearchColumn('custrecord739'),//d4
					new nlobjSearchColumn('custrecord740'),//d5
					new nlobjSearchColumn('custrecord741'),//d6
					new nlobjSearchColumn('custrecord744')//purchase price
				);
				
				var filterItem1 = nlapiSearchRecord('customrecord252', null, filter, column);
					if(filterItem1 != null) {
						nlapiSetCurrentLineItemValue('item', 'custcol6', filterItem1[0].getValue('custrecord736'));
						nlapiSetCurrentLineItemValue('item', 'custcol7', filterItem1[0].getValue('custrecord737'));
						nlapiSetCurrentLineItemValue('item', 'custcol8', filterItem1[0].getValue('custrecord738'));
						nlapiSetCurrentLineItemValue('item', 'custcol9', filterItem1[0].getValue('custrecord739'));
						nlapiSetCurrentLineItemValue('item', 'custcol11', filterItem1[0].getValue('custrecord740'));
						nlapiSetCurrentLineItemValue('item', 'custcol12', filterItem1[0].getValue('custrecord741'));
						if(principal == '4') {
								nlapiSetCurrentLineItemValue('item', 'rate', Math.round(filterItem1[0].getValue('custrecord744')));
						} else {
								nlapiSetCurrentLineItemValue('item', 'rate', nlapiFormatCurrency(filterItem1[0].getValue('custrecord744')));

						}
					}
			}
}
function addLine(){
//amountDue custcol30
	var itemid = nlapiGetCurrentLineItemValue('item', 'item');
	var location = nlapiGetFieldText('location');
	var principal = nlapiGetFieldValue('class');
	var parent = location.split(':');
	var parentLocation = parent[0].replace(' ', '');
				var filter = new Array (
					new nlobjSearchFilter('custrecord742', null, 'is', itemid),
					new nlobjSearchFilter('custrecord743', null, 'is', parentLocation)
				);
				var column = new Array (
					new nlobjSearchColumn('custrecord734'),
					new nlobjSearchColumn('custrecord735')
				);
				
			var filterItem1 = nlapiSearchRecord('customrecord252', null, filter, column);
	
	if(filterItem1 != null) {
			disctype = filterItem1[0].getValue('custrecord734');//multilevel - 1; Single - 2
			vat = filterItem1[0].getValue('custrecord735');//inclusive - 1; exclusive - 2
			vatamt = 0.12;
			amt = 0;
			discount = 0;
			amountdue = 0;
			
			d1 = (nlapiGetCurrentLineItemValue('item', 'custcol6') == null || nlapiGetCurrentLineItemValue('item', 'custcol6') == '') ? 0 : nlapiGetCurrentLineItemValue('item', 'custcol6');
			d2 = (nlapiGetCurrentLineItemValue('item', 'custcol7') == null || nlapiGetCurrentLineItemValue('item', 'custcol7') == '') ? 0 : nlapiGetCurrentLineItemValue('item', 'custcol7');
			d3 = (nlapiGetCurrentLineItemValue('item', 'custcol8') == null || nlapiGetCurrentLineItemValue('item', 'custcol8') == '') ? 0 : nlapiGetCurrentLineItemValue('item', 'custcol8');
			d4 = (nlapiGetCurrentLineItemValue('item', 'custcol9') == null || nlapiGetCurrentLineItemValue('item', 'custcol9') == '') ? 0 : nlapiGetCurrentLineItemValue('item', 'custcol9');
			d5 = (nlapiGetCurrentLineItemValue('item', 'custcol11') == null || nlapiGetCurrentLineItemValue('item', 'custcol11') == '') ? 0 : nlapiGetCurrentLineItemValue('item', 'custcol11');
			d6 = (nlapiGetCurrentLineItemValue('item', 'custcol12') == null || nlapiGetCurrentLineItemValue('item', 'custcol12') == '') ? 0 : nlapiGetCurrentLineItemValue('item', 'custcol12');
				d1 = parseFloat(d1) / 100;
				d2 = parseFloat(d2) / 100;
				d3 = parseFloat(d3) / 100;
				d4 = parseFloat(d4) / 100;
				d5 = parseFloat(d5) / 100;
				d6 = parseFloat(d6) / 100;
			//amount = parseFloat(nlapiGetCurrentLineItemValue('item', 'grossamt'));
			
			if(vat == '1') {
				amt = parseFloat(nlapiGetCurrentLineItemValue('item', 'grossamt'));
				//amt = amount + (amount * vatamt);
			} else if(vat == '2') {
				amt = parseFloat(nlapiGetCurrentLineItemValue('item', 'amount'));
				//amt = amount;
			} else {
				alert('INVENTORY ITEM: VAT should be identified if it is included or excluded.');
			}
			
			if(disctype == '1') {
				if(d1 == 0) {
					level1 = 0;
				} else {
					level1 = amt * d1;
				}
				l1 = amt - level1;
				if(d2 == 0) {
					level2 = 0;
				} else {
					level2 = l1 * d2;
				}
				l2 = level1 - level2;
				if(d3 == 0) {
					level3 = 0;
				} else {
					level3 = l2 * d3;
				}
				l3 = level2 - level3;
				if(d4 == 0) {
					level4 = 0;
				} else {
					level4 = l3 * d4;
				}
				l4 = level3 - level4;
				if(d5 == 0) {
					level5 = 0;
				} else {
					level5 = l4 * d5;
				}
				l5 = level4 - level5;
				if(d6 == 0) {
					level6 = 0;
				} else {
					level6 = l5 * d6;
				}
				discount = level1 + level2 + level3 + level4 + level5 + level6;
				
			} else if(disctype == '2') {
				ds = d1 + d2 + d3 + d4 + d5 + d6;
				discount = amt * ds;
			} else if(disctype == '3') {
				distDisc = amt * d1;
				ddNet = amt - distDisc;
				fl = d2 + d3 + d4 + d5 + d6;
				fiveLevels = ddNet * fl;
				discount = distDisc + fiveLevels;
			} else {
				alert('INVENTORY ITEM: Discounting should be identified if it is multi-level, single or is based on the net of Dist Discount.');
			}
			gross = nlapiGetCurrentLineItemValue('item', 'grossamt');
			aaa = nlapiGetCurrentLineItemValue('item', 'amount');
			
			/*
			if(vat == '1') {
				amt = parseFloat(nlapiGetCurrentLineItemValue('item', 'grossamt'));
				//amt = amount + (amount * vatamt);
			} else if(vat == '2') {
				amt = parseFloat(nlapiGetCurrentLineItemValue('item', 'amount'));
				//amt = amount;
			} */
			exTax = nlapiGetCurrentLineItemValue('item', 'taxrate1');
			exTax = parseFloat(exTax) / 100;
			ad = gross - discount;
			if(vat == '1') {
				amountdue = ad;
			} else if(vat == '2'){
				//temp = aaa * exTax;
				//bbb = aaa + parseFloat(temp);
				//amountdue = parseFloat(bbb) - discount;
				one = aaa - discount;
				temp = one * exTax;
				amountdue = one + temp;
			}
			//alert(ad + ' ' + exTax);
			if(principal == '4') {
				nlapiSetCurrentLineItemValue('item', 'custcol10', Math.round(discount));
				nlapiSetCurrentLineItemValue('item', 'custcol30', Math.round(amountdue));
			} else {
				nlapiSetCurrentLineItemValue('item', 'custcol10', discount);
				nlapiSetCurrentLineItemValue('item', 'custcol30', amountdue);
			}
			
			return true;
		}
		else {
			alert('Purchase Discount is not Available');
			return false;
		}
}
function disable(){
	nlapiDisableLineItemField('item', 'units', true);
	nlapiDisableLineItemField('item', 'description', true);
	nlapiDisableLineItemField('item', 'rate', true);
	nlapiDisableLineItemField('item', 'amount', true);
	nlapiDisableLineItemField('item', 'grossamt', true);
	nlapiDisableLineItemField('item', 'tax1amt', true);
	nlapiDisableLineItemField('item', 'custcol29', true);
	nlapiDisableLineItemField('item', 'custcol28', true);
}