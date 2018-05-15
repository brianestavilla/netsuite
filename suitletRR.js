function suiteletRR(request, response){
	if (request.getMethod() == 'GET'){
		id = request.getParameter("POid");
		rr = nlapiLoadRecord('purchaseorder', id);
		paytype = rr.getFieldText('custbody38');
		var form = nlapiCreateForm('Draft Item Receipt'),
			ven = rr.getFieldValue('entity'),
			tranid = rr.getFieldValue('tranid'),
			date = rr.getFieldValue('trandate'),
			memo = rr.getFieldValue('memo'),
			currency = rr.getFieldValue('exchangerate'),
			dept = rr.getFieldValue('department'),
			principal = rr.getFieldValue('class'),
			location = rr.getFieldValue('location')
		;
		form.addSubmitButton("Next");
		
		var group = form.addFieldGroup( 'myfieldgroup', 'Primary Information');
		form.addField('vendor', 'select', 'Vendor', 'vendor','myfieldgroup').setDisplayType('inline');
		form.addField('datefield','date', 'Date', null,'myfieldgroup' ).setDisplayType('inline');
		form.addField('memo','text', 'Memo', null,'myfieldgroup' ).setDisplayType('inline');
		form.addField('pay','text', 'Pay Type', null,'myfieldgroup' ).setDisplayType('inline');
		form.addField('poidlinemain','text', 'PO#', null,'myfieldgroup' ).setDisplayType('inline');
		form.addField('poidline','text', 'PO#', null,'myfieldgroup' ).setDisplayType('hidden');
		form.addField('currencyfield','text', 'Currency', null,'myfieldgroup').setDisplayType('hidden');
		form.addField('depthide','text', 'Department', null,'myfieldgroup' ).setDisplayType('hidden');
		form.addField('locationline','text', 'Location', null,'myfieldgroup' ).setDisplayType('hidden');
		form.addField('principal','text', 'Principal', null,'myfieldgroup' ).setDisplayType('hidden');
		
		if (paytype == 'Advance Payment') {
			var bills = form.addField('bill', 'multiselect', 'Bill #', null,'myfieldgroup');
			filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', id) //po
			);
			
			result = nlapiSearchRecord('transaction', 'customsearch108', filters);
			var billId = new Array();
			var billIdinternal = new Array();
			if(result !== null) {
				for (var i = 0; i < result.length; i++) {
					billId[i] = result[i].getValue('number', 'applyingTransaction', 'group');
					billIdinternal[i] = result[i].getValue('internalid', 'applyingTransaction', 'group');
					bills.addSelectOption(billIdinternal[i], "Bill #" + billId[i]);
				}
			}
		} else {
			var bills = form.addField('billrr', 'multiselect', 'Item Receipt #', null,'myfieldgroup');
			filters = new Array (
				new nlobjSearchFilter('internalid', null, 'anyof', id) //po
			);
			result = nlapiSearchRecord('transaction', 'customsearch147', filters);
			var billId = new Array();
			var billIdinternal = new Array();
			if(result !== null) {
				for (var i = 0; i < result.length; i++) {
					billId[i] = result[i].getValue('number', 'applyingTransaction', 'group');
					billIdinternal[i] = result[i].getValue('internalid', 'applyingTransaction', 'group');
					bills.addSelectOption(billIdinternal[i], "Item Receipt #" + billId[i]);
				}
			}
		}
		
		group.setShowBorder(true);
		form.setFieldValues({vendor:ven, datefield:date, memo:memo, currencyfield:currency, pay:paytype, poidlinemain:tranid, poidline:id, depthide:dept, locationline:location, principal:principal});
		response.writePage(form);
		
	} else {
		idline = request.getParameter("poidline");
		var venpara = request.getParameter('vendor'),
			billrr = request.getParameter("billrr"),
			deptline = request.getParameter('depthide'),
			locationline = request.getParameter('locationline'),
			principalline = request.getParameter('principal'),
			create = request.getParameter('create'),
			date = request.getParameter('datefield'),
			post = request.getParameter('post'),
			ponum = request.getParameter('poidlinemain'),
			memo = request.getParameter('memo'),
			currency = parseFloat(request.getParameter('currencyfield')),
			type = request.getParameter('pay'),
			billparam = request.getParameter('bill')
		;
		var temp = new Array();
			temp = request.getParameter("billrr");
		if ((billparam !== null && billparam !== "") || (billrr !== null && billrr !== "")) {
			if (type == 'Advance Payment') {
				var ir = nlapiCreateRecord('customrecord168');
				recordtype = ir.getRecordType();
				userId = nlapiGetUser();
				empRecord = nlapiLoadRecord('employee', userId);
				recloc = empRecord.getFieldValue('custentity38');
				ponumf = ir.getFieldValue(ponum);
				ir.setFieldValue('custrecord283', venpara);
				ir.setFieldValue('custrecord284', currency);
				ir.setFieldValue('custrecord285', idline);
				ir.setFieldValue('custrecord286', date);
				ir.setFieldValue('custrecord289', memo);
				if (billparam !== null) {
					ir.setFieldValue('custrecord290', billparam);
				}

				filters = new Array (
					new nlobjSearchFilter('internalid', null, 'is', idline)
				);
				
				resultline = nlapiSearchRecord('transaction', 'customsearch108', filters);
				
				if(resultline !== null) {
					for (var c = 1; c <= resultline.length; c++) {
						item = resultline[c-1].getValue('item', 'applyingTransaction', 'group');
						name = resultline[c-1].getValue('vendorname', 'vendor', 'group');
						unit = resultline[c-1].getValue('units', 'applyingTransaction', 'group');
						options = resultline[c-1].getValue('options', 'applyingTransaction', null);
						currency = resultline[c-1].getValue('currency', 'applyingTransaction', null);
						desc = resultline[c-1].getValue('description', 'item', 'group');
						quantity = resultline[c-1].getValue('quantity', null, 'max');
						quantityfullfill = resultline[c-1].getValue('quantityreceived', null, 'max');
						onhand = resultline[c-1].getValue('quantityonhand', 'item', 'max');
						
						remaining = quantity - quantityfullfill;
						
						ir.setLineItemValue('recmachcustrecord291', 'custrecord297', c, recloc);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord294', c, item);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord295', c, name);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord296', c, desc);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord301', c, unit);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord303', c, options);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord305', c, currency);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord298', c, onhand);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord300', c, quantity);
						ir.setLineItemValue('recmachcustrecord291', 'custrecord299', c, remaining);
						
					}
				}
				var recordid= nlapiSubmitRecord(ir, null, true);
				response.sendRedirect('RECORD', 'customrecord168', recordid, true);
			}
			
			if (type == 'Later Payment') {
				var ctx = nlapiGetContext();
				ctx.setSessionObject('rrid', billrr);
				ctx.setSessionObject('poid', idline);
				test1 = ctx.getSessionObject('rrid');
				test2 = ctx.getSessionObject('poid');
				var param = new Array();
				param['poid'] = test2;
				param['rr'] = test1;
				response.sendRedirect('RECORD', 'vendorbill', null, true, param);
			}
		} else {
			if (type == 'Advance Payment') {
				html = '<html><head><body><center><strong><h1>Error. Please Select Bill #</h1></strong></center></body></head></html>';
			} else {
				html = '<html><head><body><center><strong><h1>Error. Please Select Item Receipt #</h1></strong></center></body></head></html>';
			}
			response.write(html);
		}
	}
}