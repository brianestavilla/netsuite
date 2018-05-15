function suitelet(request, response){
	subExpenseID = 'expense';
	subItemID = 'item';
	
	maxLine = 10;
	maxLine--;
	
	journalEntry = '';
	
	recID = request.getParameter('recID');
	rec = nlapiLoadRecord('vendorbill', recID);
	
	subExpenseCount = rec.getLineItemCount(subExpenseID);
	subItemCount = rec.getLineItemCount(subItemID);
	
	var subID = subItemID;
	var subCount = subExpenseCount + subItemCount;
	var debit = 0;
	var expensedebit = 0;
	var j = 1;
	
	for(i = 1; i <= subCount; i++) { // 2
		if(subID == 'item') {
			codeType = 'item';
			
			itemID = rec.getLineItemValue(subID, codeType, i);
			itemCat = nlapiLookupField('item', itemID, 'custitem4', true);
			
			if(itemCat.match(/Non.*/)){
				accountID = nlapiLookupField('item', itemID, 'expenseaccount');
				account = nlapiLoadRecord('account', accountID);
				itemCat = account.getFieldValue('acctnumber');
				account = account.getFieldValue('acctname');
				account = account.replace('&', ' and ');
				amount = parseFloat(rec.getLineItemValue(subID, 'amount', i));
				credit = '';
			} else if(itemCat.match(/Trade.*/)){
				account = nlapiLoadRecord('account', '116');
				itemCat = account.getFieldValue('acctnumber');
				itemCat = (itemCat !== null) ? itemCat : '';
				account = account.getFieldValue('acctname');
				account = account.replace('&', ' and ');
				amount = parseFloat(rec.getLineItemValue(subID, 'amount', i));
				credit = '';
			}
			else{
				amount = 0;
				account = nlapiLoadRecord('account', '1191');
				itemCat = account.getFieldValue('acctnumber');
				account = account.getFieldValue('acctname');
				account = account.replace('&', ' and ');
				credit = rec.getLineItemValue(subID, 'amount', i);
				credit = credit.replace('-', '');
				credit = addCommas(parseFloat(credit));
			}
			if(i <= subItemCount) {
				subID = subExpenseID;
			}
		}else{
			codeType = 'account';
			accountRec = nlapiLoadRecord('account',rec.getLineItemValue(subID, codeType, j)); // 
			expcat = accountRec.getFieldValue('acctnumber');
			expacct = accountRec.getFieldValue('acctname');
			expensedebit = rec.getLineItemValue(subID, 'amount', j);
			credit = '';
			j++;
		}
		
		debit += parseFloat(amount);
		expensedebit += parseFloat(expensedebit);
		//nlapiLogExecution('DEBUG', 'CSV Import', debit);
		taxrate = rec.getFieldValue('taxtotal');
		/*
		amountx = parseFloat(rec.getLineItemValue(subID, 'amount', i));
		grossx = parseFloat(rec.getLineItemValue(subID, 'grossamt', i));*/
			accountx = nlapiLoadRecord('account', '110');
			itemCatx = accountx.getFieldValue('acctnumber');
			accountx = accountx.getFieldValue('acctname');
			/*debitx = grossx - amountx;
			debitx += debitx;
			debitx = nlapiFormatCurrency(debitx);*/
			creditx = '';
	}
		journalEntry += '<tr>';
		journalEntry += "<td class='account'>" + expcat + '</td>';
		journalEntry += "<td class='entry'>" + expacct + '</td>';
		journalEntry += "<td class='debit'><p class='wide textRight'>" + addCommas(nlapiFormatCurrency(expensedebit)) + '</p></td>';
		journalEntry += "<td class='debit'><p class='wide textRight'>" + addCommas(credit) + '</p></td>';
		journalEntry += '</tr>';
		
		journalEntry += '<tr>';
		journalEntry += "<td class='account'>" + itemCat + '</td>';
		journalEntry += "<td class='entry'>" + account + '</td>';
		journalEntry += "<td class='debit'><p class='wide textRight'>" + addCommas(nlapiFormatCurrency(debit)) + '</p></td>';
		journalEntry += "<td class='debit'><p class='wide textRight'>" + addCommas(credit) + '</p></td>';
		journalEntry += '</tr>';
		
	if(taxrate > 0){
			debitx = rec.getFieldValue('taxtotal');
			journalEntry += '<tr>';
			journalEntry += "<td class='account'>" + itemCatx + '</td>';
			journalEntry += "<td class='entry'>" + accountx + '</td>';
			journalEntry += "<td class='debit'><p class='wide textRight'>" + addCommas(debitx) + '</p></td>';
			journalEntry += "<td class='debit'><p class='wide textRight'>" + creditx + '</p></td>';
			journalEntry += '</tr>';
		}
		
	ic = rec.getFieldValue('account');
	ic = nlapiLoadRecord('account', ic.toString());
	ic = ic.getFieldValue('acctnumber');
	ac = rec.getFieldText('account');
	ac = ac.replace(ic, '');
	totalAmount = addCommas(parseFloat(rec.getFieldValue('usertotal')));
	
	journalEntry += '<tr>';
	journalEntry += "<td class='account'>" + ic + '</td>';
	journalEntry += "<td class='entry'><p class='indent'>" + ac + '</p></td>';
	journalEntry += "<td class='debit'></td>";
	journalEntry += "<td class='credit'><p class='wide textRight'>" + totalAmount + '</p></td>';
	journalEntry += '</tr>';
	
	filler = maxLine - subCount;
	
	for(i = filler; i > 0; i--){
		journalEntry += '<tr>';
		journalEntry += "<td class='account'><p></p></td>";
		journalEntry += "<td class='entry'><p></p></td>";
		journalEntry += "<td class='debit'><p class='wide textRight'></p></td>";
		journalEntry += "<td class='credit'><p class='wide textRight'></p></td>";
		journalEntry += '</tr>';
	}
	
	payee = rec.getFieldText('entity');
	address0 = rec.getFieldText('location');
	address1 = '';
	date = rec.getFieldValue('trandate');
	APVNum = rec.getFieldValue('tranid');
	dueDate = (rec.getFieldValue('duedate') == null) ? '' : rec.getFieldValue('duedate');
	invNum = rec.getFieldValue('custbody37');
	PONum = rec.getFieldText('custbody121');
	RRNum = rec.getFieldValue('custbody95');
	particulars = rec.getFieldValue('custbody104');
	
	ctx = nlapiGetContext();
	
	html = ctx.getSetting('SCRIPT', 'custscript9');
	
	html = html.replace('{payee}', payee);
	html = html.replace('{address0}', address0);
	html = html.replace('{address1}', address1);
	html = html.replace('{date}', date);
	html = html.replace('{APVNum}', APVNum);
	html = html.replace('{dueDate}', dueDate);
	html = html.replace('{invDate}', date);
	html = html.replace('{invNum}', invNum);
	html = html.replace('{PONum}', PONum);
	html = html.replace('{RRNum}', RRNum);
	html = html.replace('{amount}', totalAmount);
	html = html.replace('{particulars}', particulars);
	html = html.replace('{journalEntry}', journalEntry);
	
	pdf = nlapiXMLToPDF(html);
	
	response.setContentType('PDF', 'testing.pdf', 'inline');
	
	response.write(pdf.getValue());
}