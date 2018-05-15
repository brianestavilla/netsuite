function suitelet (request, response) {
	if(request.getMethod() == 'GET') {
		form = nlapiCreateForm('DDI Cash Position Report');
		
		//1100 Cash In Bank and in Hand 131
		//1101 CIB BDO-PHP-004038004449 264
		//SANDBOX : Beginning Balance SS - customsearch739 ; SS for Cash Inflow - customsearch740
		//LIVE : Beginning Balance SS - customsearch817 ; SS for Cash Inflow - customsearch818
		
		var group = form.addFieldGroup('myfieldgroup', 'Primary Information');
		
		filters = [
			new nlobjSearchFilter('parent', null, 'is', '132'),
			new nlobjSearchFilter('type', null, 'is', 'Bank')
		];
		
		columns = [
			new nlobjSearchColumn('internalid'),
			new nlobjSearchColumn('name')
		];
		
		bankresult = nlapiSearchRecord('account', null, filters, columns);
		bankaccount = form.addField('bankaccount', 'select', 'Bank Account', null, 'myfieldgroup').setLayoutType('startrow');
		
		for(i = 0; i < bankresult.length; i++) {
			bankaccount.addSelectOption(bankresult[i].getValue('internalid'), bankresult[i].getValue('name'));
		}
		
		Date.prototype.addHours = function(h) {
			this.setHours(this.getHours() + h);
			return this;
		}
		
		var date = new Date();
		date.addHours(15);
		mm = date.getMonth() + 1;
		dd = date.getDate();
		yyyy = date.getFullYear();
		
		var begdate = form.addField('begdate', 'date', 'From', null, 'myfieldgroup').setMandatory(true).setLayoutType('startrow');
		begdate.setDefaultValue(mm + '/' + dd + '/' + yyyy);
		
		var enddate = form.addField('enddate', 'date', 'To', null, 'myfieldgroup').setMandatory(true).setLayoutType('endrow');
		
		form.addSubmitButton('Generate');
		response.writePage(form);
	} else {
		bankaccount =  request.getParameter('bankaccount');
		begdate = request.getParameter('begdate');
		enddate = request.getParameter('enddate');
		
		filters = [
			new nlobjSearchFilter('trandate', null, 'onorbefore', begdate),
			new nlobjSearchFilter('account', null, 'is', bankaccount)
		];
		
		columns = [
			new nlobjSearchColumn('amount')
		];
		
		bankresult = nlapiSearchRecord('transaction', 'customsearch817', filters, columns);
		totalAmount = 0;
		if(bankresult != null) {
			for(var i = 0; i < bankresult.length; i++) {
				container = parseFloat(bankresult[i].getValue('amount'));
				totalAmount = totalAmount + container;
			}
		}
		
		filter = [
			new nlobjSearchFilter('trandate', null, 'within', begdate, enddate),
			new nlobjSearchFilter('account', null, 'is', bankaccount)
		];
		
		column = [
			new nlobjSearchColumn('amount', null, 'sum')
		];
		
		inout = nlapiSearchRecord('transaction', 'customsearch818', filter, column);
		totalIn = 0;
		totalOut = 0;
		if(inout != null) {
			for(var x = 0; x < inout.length; x++) {
				temp = parseFloat(inout[x].getValue('amount', null, 'sum'));
				
				if(temp > 0) {
					totalIn = totalIn + temp;
				}
				if(temp < 0) {
					totalOut = totalOut + temp;
				}
			}
		}
		
		endingAmount = (parseFloat(totalAmount) + parseFloat(totalIn)) + parseFloat(totalOut);
		
		/*form = nlapiCreateForm('DDI Cash Position Report');
		
		var group = form.addFieldGroup('myfieldgroup', 'Primary Information');
		
		form.addField('beginning', 'currency', 'Beg. Cash on Hand', null, 'myfieldgroup').setDisplayType('inline').setDefaultValue(totalAmount);
		form.addField('cashin', 'currency', 'Cash Inflow', null, 'myfieldgroup').setDisplayType('inline').setDefaultValue(totalIn);
		form.addField('cashout', 'currency', 'Cash Outflow', null, 'myfieldgroup').setDisplayType('inline').setDefaultValue(totalOut);
		form.addField('ending', 'currency', 'Ending Cash on Hand', null, 'myfieldgroup').setDisplayType('inline').setDefaultValue(endingAmount);
		response.writePage(form);
		*/
		html = nlapiGetContext().getSetting('SCRIPT', 'custscript29');
		
		html = html.replace('{totalAmount}', addCommas(totalAmount));
		html = html.replace('{totalIn}', addCommas(totalIn));
		html = html.replace('{totalOut}', addCommas(totalOut));
		html = html.replace('{endingAmount}', addCommas(endingAmount));
		
		var file = nlapiXMLToPDF(html);
		response.setContentType('PDF', 'cashflow01.pdf', 'inline');
		response.write(file.getValue());
	}
}
function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)){
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}