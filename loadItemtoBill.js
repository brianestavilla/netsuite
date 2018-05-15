function loadItemtoBill(type, form){
var cont = nlapiGetContext(); //intialize context
var poid = cont.getSessionObject('poid'); // store created session into poid
if(type == 'create' && poid != null && poid != ''){
		
		nlapiLogExecution('DEBUG', 'PO ID', poid); // execute log for tracing
		
		var loadrecord = nlapiLoadRecord('purchaseorder', poid); // load purchase order. Return internal id of the record.
		var linecount = loadrecord.getLineItemCount('item'); // count item of PO
		var poType = (loadrecord.getFieldValue('custbody55') == null || loadrecord.getFieldValue('custbody55') == '') ? '1' : '2'; //checks if Trade/Non Trade
		var ifStandard = nlapiLookupField('classification', loadrecord.getFieldValue('class'), 'custrecord797', false);
		var principal = loadrecord.getFieldValue('entity');
		var totalqty = 0;
		var totaltaxamt = 0;
		
		//nlapiSetFieldValue('custbody121', poid);//set created from PO 
		nlapiSetFieldValue('custbody62', poType);	//set Trade/Non Trade
		if(poType == '2')
		{
			form.getField('custbody51').setMandatory(true);
			form.getField('custbody51').setDisplayType('normal');
		}
		var column = new Array(
					new nlobjSearchColumn('custbody156'),
					new nlobjSearchColumn('internalid')
				);
		var search = nlapiSearchRecord('itemreceipt', null, new nlobjSearchFilter('createdfrom', null, 'anyof', poid), column);
		if(search != null){
			nlapiSetFieldValue('tranid', search[0].getValue('custbody156'));
			//nlapiSetFieldValue('custbody95', search[0].getValue('internalid'));
		}
		if(loadrecord.getFieldValue('custbody38') == '2' && ifStandard == 'F')
		{
			//set form
			nlapiSetFieldValue('customform','138');
			for(var i = 1; i <= linecount; i++){
				//get values from PO
				var item = loadrecord.getLineItemValue('item','item',i); // get item from PO
				var qtyreceived = loadrecord.getLineItemValue('item','quantityreceived',i); // get quantity from PO
				var units = loadrecord.getLineItemValue('item','units',i); // get units from PO
				var desc = loadrecord.getLineItemValue('item','description',i); // get description from PO
				var unitcost = loadrecord.getLineItemValue('item','rate',i); // get unit cost from PO
				var taxrate = loadrecord.getLineItemValue('item','taxrate1',i); // get tax rate from PO
				var grossamt = parseFloat(qtyreceived) * parseFloat(unitcost); // compute gross. (amount + taxamt
				var temptax = '1.' + parseFloat(taxrate);
				var amount = grossamt / temptax; // compute amount. (grossamt / temptax)
				var x = parseFloat(amount) / 100;
				var taxamt = x * parseFloat(taxrate);;//compute taxamt. (amount * taxrate)
				// var vatcode = loadrecord.getLineItemValue('item','taxcode',i); // get taxcode from PO
				var itemtype = loadrecord.getLineItemValue('item','itemtype',i); // get service type from PO
				
				//for item na ang type is Service
				var servicegrossamt = loadrecord.getLineItemValue('item','grossamt',i); // get gross amount from PO;
				var serviceamount = loadrecord.getLineItemValue('item','amount',i); // get amount from PO;
				var servicetaxamt = loadrecord.getLineItemValue('item','tax1amt',i); // get amount from PO;
			
				//add total quantity
				totalqty += parseFloat(qtyreceived);
				nlapiSetFieldValue('custbody159',totalqty); // set total quantity to vendor bill
				nlapiSetFieldValue('custbody161','');
			}
		}
}
}