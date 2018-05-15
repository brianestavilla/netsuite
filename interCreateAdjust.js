function interAutoAdjust(request, response) {
	internalid = request.getParameter("internalid");
	var newRecord = nlapiLoadRecord('customrecord216', internalid),
		rrlinecount = newRecord.getLineItemCount('recmachcustrecord475'),
		iDRID = newRecord.getFieldValue('custrecord468'),
		drrecord = nlapiLoadRecord('customrecord214', iDRID),
		freight = parseFloat(drrecord.getFieldValue('custrecord529'))
	;
	totalqty = parseFloat(newRecord.getFieldValue('custrecord611'));
	freight = (freight != '') ? parseFloat(freight) : 0;
	totalqty = (totalqty != '') ? parseFloat(totalqty) : 0;
	adjustInventory = nlapiCreateRecord('inventoryadjustment');
	// drrecord.setFieldValue('custrecord465', 4);
	
	//get dr values to load record to
	toid = drrecord.getFieldValue('custrecord460');
	var torecord = nlapiLoadRecord('customrecord160', toid),
		topost = torecord.getFieldValue('custrecord224'),
		toloc = torecord.getFieldValue('custrecord229'),
		todept = torecord.getFieldValue('custrecord230'),
		//tolinecount = torecord.getLineItemCount('recmachcustrecord232'),
		toprincipal = torecord.getFieldValue('custrecord231')
	;
	
	//get rr line item
	for(i = 1; i <= rrlinecount; i++){
		var rritem = newRecord.getLineItemValue('recmachcustrecord475', 'custrecord477', i),
			drqty1 = parseFloat(newRecord.getLineItemValue('recmachcustrecord475', 'custrecord479', i)),
			rrunit1 = newRecord.getLineItemValue('recmachcustrecord475', 'custrecord484', i),
			rrqty1 = parseFloat(newRecord.getLineItemValue('recmachcustrecord475', 'custrecord498', i)),
			tocost = parseFloat(newRecord.getLineItemValue('recmachcustrecord475', 'custrecord612', i))
		;
		
		
		//create adjust inventory lineitems
		adjustInventory.setLineItemValue('inventory', 'item', i, rritem);
		adjustInventory.setLineItemValue('inventory', 'location', i, toloc);
		adjustInventory.setLineItemValue('inventory', 'adjustqtyby', i, rrqty1);
		//adjustInventory.setLineItemValue('inventory', 'item', i, drqty1);
		torecord.setLineItemValue('recmachcustrecord232', 'custrecord439', i , rrqty1);
		
		if (freight == 0) {
			adjustInventory.setLineItemValue('inventory', 'unitcost', i, tocost);
		} else {
			
			totalunit = ((((rrqty1*tocost)/totalqty)*freight)/rrqty1);
			unitcost = tocost + totalunit;
			unitcost = Math.round(unitcost * 100)/100;
			adjustInventory.setLineItemValue('inventory', 'unitcost', i, unitcost);
		}
		
	}
	
	//custrecord439 to lineitem recmachcustrecord232
	/*for (i = 1; i <= tolinecount; i++) {
		var drqty = parseInt(newRecord.getLineItemValue('recmachcustrecord475', 'custrecord479', i)),
			rrqty = parseInt(newRecord.getLineItemValue('recmachcustrecord475', 'custrecord498', i))
		;
		
	}*/
	//create adjust invetory main line
	adjustInventory.setFieldValue('account', '1165');
	adjustInventory.setFieldValue('adjlocation', toloc);
	adjustInventory.setFieldValue('department', todept);
	adjustInventory.setFieldValue('class', toprincipal);
	adjustInventory.setFieldValue('custbody108', 2);
	var iAdjust = nlapiSubmitRecord(adjustInventory, null, true);
	
	nlapiSubmitField('customrecord216', internalid, 'custrecord595', iAdjust);
	try {
		nlapiSubmitRecord(torecord);
	} catch (e) {
	}
	nlapiSubmitField('customrecord214', iDRID, 'custrecord465', 4);
	
	nlapiSetRedirectURL('RECORD', 'customrecord216', internalid);
}