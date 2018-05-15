/**
**	Accounts Payable Voucher Printout
**	Author : Brian Mae Estavilla
**	Developed Date : April 10, 2018
**/

function apv(request, response){
	subID = 'expense';
	subItemID = 'item';
	maxLine = 10;
	maxLine--;
	journalEntry = '';
	recID = request.getParameter('internalid');
	rec = nlapiLoadRecord('vendorbill', recID);
	
	subExpenseCount = rec.getLineItemCount(subID);	//Counts the Line Expense
	subItemCount = rec.getLineItemCount(subItemID);			//Counts the Line Item
	subCount = subExpenseCount + subItemCount;				//adds expense count and item count
	prin = rec.getFieldText('class');						//gets the Principal field Text
	depart = rec.getFieldText('department');		//gets the Department field Value wew
	loca = rec.getFieldText('location');
	nlapiLogExecution('ERROR', 'line item count', subCount);
	var hashtable = new Object();							//creates new object: represents as hashtable
	j = 1;
	accountTAX = nlapiLookupField('account', 110, ['number','name']);
	var account_trade = nlapiLoadRecord('account', '116');
	for(i = 1; i <= subCount; i++){							
		/***#### FOR LINE EXPENSE TAB ####****/
		if(subID == 'expense' && subExpenseCount > 0)		//if selected tab is "expense" and expense count is greater than zero
		{
			principal = rec.getLineItemText(subID, 'class', i);
			
			var split_department = rec.getLineItemText(subID, 'department', i).split(':');
			department = split_department[split_department.length - 1];
			tax1amt = parseFloat(rec.getLineItemValue(subID, 'tax1amt', i)); //gets the tax amount
			
          	//commented by Brian 2/2/2017; To include expenses with negative values;
          	//if(tax1amt > 0) {	//if tax amount is greater than zero, then add an entry named "Input Tax"
				codeType = 'account';
				//accountRec = nlapiLoadRecord('account', rec.getLineItemValue(subID, codeType, i));
				var itemCat = accountTAX.number;
				var account = accountTAX.name;
				var amount = parseFloat(rec.getLineItemValue(subID, 'amount', i));
				gross = parseFloat(rec.getLineItemValue(subID, 'grossamt', i));
				var key = itemCat + "|" + account;
				debit = (gross - amount);
				credit = '';
				if(hashtable.hasOwnProperty(key))
					hashtable[key] += parseFloat(debit);
				else
					hashtable[key] = parseFloat(debit);
			//}
          
			codeType = 'account';
			var fullacctname = rec.getLineItemText(subID, codeType, i);
			var split_fullacctname = fullacctname.split(' ');
			itemCat = split_fullacctname[0];
			delete split_fullacctname[0];
			account = replaceall(split_fullacctname.toString(), ",", " ");
			/*var split_fullacctname_colon = fullacctname.split(':');
			account = split_fullacctname_colon[split_fullacctname_colon.length - 1];*/

			debit = rec.getLineItemValue(subID, 'amount', i);
			credit = '';
			var key = itemCat + "|" + account + "|" + principal + "|" + department;
			if(i == subExpenseCount) subID = subItemID;
		}
		/***#### END LINE EXPENSE TAB ####****/
		/***#### FOR LINE ITEM TAB ####****/
		else {
			codeType = 'item'; //selects the line item tab
			subID = 'item';
			principal = (rec.getLineItemText(subID, 'class', i) == null) ? prin : rec.getLineItemText(subID, 'class', i);
			var department = (rec.getLineItemValue(subID, 'department', i) == null )? depart: rec.getLineItemText(subID, 'department', i);
			itemID = rec.getLineItemValue(subID, codeType, j);
			taxrate = parseFloat(rec.getLineItemValue(subID, 'tax1amt', j));
			if(taxrate > 0){
				/*account = nlapiLoadRecord('account', '110');
				itemCat = account.getFieldValue('acctnumber');
				account = account.getFieldValue('acctname');*/
				var itemCat = accountTAX.number;
				var account = accountTAX.name;
				amount = parseFloat(rec.getLineItemValue(subID, 'amount', j));
				gross = parseFloat(rec.getLineItemValue(subID, 'grossamt', j));
				debit = (gross - amount);
				credit = '';
				if(hashtable.hasOwnProperty(itemCat + "|" + account))
					hashtable[itemCat + "|" + account] += parseFloat(debit);
				else
					hashtable[itemCat + "|" + account] = parseFloat(debit);
			}
			
          	itemCat = nlapiLookupField('item', itemID, 'custitem4', true);
			//itemCat = rec.getFieldText('customform');
			
          	//If Transaction type is non-trade
			if(itemCat.match(/Non.*/)){
				accountID = nlapiLookupField('item', itemID, 'expenseaccount');
				account = nlapiLoadRecord('account', accountID);
				itemCat = account.getFieldValue('acctnumber');
				account = account.getFieldValue('acctname');
				account = account.replace('&', ' and ');
				debit = nlapiFormatCurrency(parseFloat(rec.getLineItemValue(subID, 'amount', j)));
				credit = '';
				
			//If Transaction type is Trade
			}else if(itemCat.match(/Trade.*/)){

				itemCat = account_trade.getFieldValue('acctnumber');
				itemCat = (itemCat !== null) ? itemCat : '';
				account = account_trade.getFieldValue('acctname');
				account = account.replace('&', ' and ');
				debit = nlapiFormatCurrency(parseFloat(rec.getLineItemValue(subID, 'amount', j)));
				credit = '';
			}else{
				if(rec.getLineItemValue('item', 'item', j) == '20773'){
					debit = '';
					account = nlapiLoadRecord('account', '1191');
					itemCat = account.getFieldValue('acctnumber');
					account = account.getFieldValue('acctname');
					account = account.replace('&', ' and ');
					credit = rec.getLineItemValue(subID, 'amount', j);
					debit = parseFloat(credit);
				}else if(rec.getLineItemValue('item', 'item', j) == '40861'){
					debit = '';
					account = nlapiLoadRecord('account', '2282');
					itemCat = account.getFieldValue('acctnumber');
					account = account.getFieldValue('acctname');
					account = account.replace('&', ' and ');
					credit = rec.getLineItemValue(subID, 'amount', j);
					debit = parseFloat(credit);
				}else if(rec.getLineItemValue('item', 'item', j) == '40865'){
					debit = '';
					account = nlapiLoadRecord('account', '2283');
					itemCat = account.getFieldValue('acctnumber');
					account = account.getFieldValue('acctname');
					account = account.replace('&', ' and ');
					credit = rec.getLineItemValue(subID, 'amount', j);
					debit = parseFloat(credit);
				}else if(rec.getLineItemValue('item', 'item', j) == '40863'){
					debit = '';
					account = nlapiLoadRecord('account', '1189');
					itemCat = account.getFieldValue('acctnumber');
					account = account.getFieldValue('acctname');
					account = account.replace('&', ' and ');
					credit = rec.getLineItemValue(subID, 'amount', j);
					debit = parseFloat(credit);
				}else if(rec.getLineItemValue('item', 'item', j) == '595'){				
					account = nlapiLoadRecord('discountitem', rec.getLineItemValue(subID, 'item', j));
					account = account.getFieldText('account');
					itemCat = account.split(' ');
					itemCat = itemCat[0];
					account = account.substring(account.indexOf(':') + 2);
					account = account.replace('&', ' and ');
					credit = '';
					debit = parseFloat(rec.getLineItemValue(subID, 'amount', j));					
				}else{
					try{
						var account = nlapiLoadRecord('serviceitem', rec.getLineItemValue('item', 'item', j));
						account = account.getFieldText('expenseaccount');
						
					}catch(e)
					{
						var account = nlapiLoadRecord('noninventoryitem', rec.getLineItemValue('item', 'item', j));
						account = account.getFieldText('expenseaccount');
					}
					itemCat = account.split(' ');
					itemCat = itemCat[0];
					account = account.substring(itemCat.length +1);
					account = account.replace('&', ' and ');
					credit = '';
					debit = parseFloat(rec.getLineItemValue(subID, 'amount', j));	
				}
			}
			j++;
		}
		//nlapiLogExecution('Error', 'Principal', itemCat + "|" + account + "|" + principal + "|" + department);
		var key = itemCat + "|" + account + "|" + principal + "|" + department;
		
		if(hashtable.hasOwnProperty(key))
			hashtable[key] += parseFloat(debit);
		else
			hashtable[key] = parseFloat(debit);
	}/** END FOR **/

	/*itemCat = rec.getFieldValue('account');
	itemCat = nlapiLoadRecord('account', itemCat.toString());
	itemCat = itemCat.getFieldValue('acctnumber');*/
	itemCat = nlapiLookupField('account',rec.getFieldValue('account'), 'number');
	account =rec.getFieldText('account');
	account = account.replace(itemCat, '');
	totalAmount = addCommas(nlapiFormatCurrency(parseFloat(rec.getFieldValue('usertotal'))));
	
	//Extracts the given values from the hashtable
	if(subCount > 0){
      	
      	/*
      	 * Added by : Redemptor Enderes
      	 * Date : 11/12/2016
      	 * Purpose : Sort the entries
        */
      	var final_obj_hashtable;
      
      	if(rec.getFieldValue('custbody62') == "1")
        {
        	//trade
          	var sorted_hashtable = [];
            for (var table in hashtable)
            {
                sorted_hashtable.push([table, hashtable[table]]);
                sorted_hashtable.sort(
                    function(a, b) {
                        return b[1] - a[1] //descending | ascending = a[1] - b[1]
                    }
                );
            }

            var obj_hashtable = {};
            sorted_hashtable.forEach(function(data){
                obj_hashtable[data[0]] = data[1]
            });
          
          	final_obj_hashtable = obj_hashtable;
        }else{
          
          	final_obj_hashtable = hashtable;
          
        }

      	/******end sorting*******/

		for(var i in final_obj_hashtable)
		{
			var full_account_name = i.split('|'),
				account_id = full_account_name[0],
				account_name = full_account_name[1],
				principal1 = (full_account_name[2] == null) ? prin : full_account_name[2]
				//department1 = (full_account_name[3] == null) ? nlapiLookupField('department', department, 'custrecord803', false) : nlapiLookupField('department', full_account_name[3], 'custrecord803', false)
				department1 = (full_account_name[3] == null) ? department : full_account_name[3];
			if(parseFloat(final_obj_hashtable[i]) > 0)
			{
				journalEntry += '<tr>';
				//journalEntry += "<td>" + department1 + "-" +account_id + '</td>';	//account code wew
				//journalEntry += "<td>"+account_id + '</td>';	//account code wew
				journalEntry += "<td>" + principal1 + '</td>'; //principal
				journalEntry += "<td align='center'>" + department1 + '</td>'; //principal
				journalEntry += "<td>" + account_name + '</td>';	//account name
				journalEntry += "<td><p align = 'right'>" + addCommas(nlapiFormatCurrency(final_obj_hashtable[i])) + '</p></td>'; //debit amount
				journalEntry += "<td><p align = 'right'></p></td>"; //credit amount
				// journalEntry += "<td><p align = 'right'>" + addCommas(nlapiFormatCurrency(hashtable[i] * -1)) + '</p></td>';//credit amount
			} else {
              	journalEntry += '<tr>';
              if(parseFloat(final_obj_hashtable[i]) != 0) {
				//journalEntry += "<td>" + department1 + "-" +account_id + '</td>';	//account code wew
				journalEntry += "<td>"+principal1+"</td>";
				journalEntry += "<td align='center'>" + department1 + '</td>'; //principal
				journalEntry += "<td><p class='indent'>" + account_name + '</p></td>';
				journalEntry += "<td></td>";
				// journalEntry += "<td><p align = 'right'>" + addCommas(nlapiFormatCurrency(hashtable[i])) + '</p></td>'; //debit amount
				journalEntry += "<td><p align = 'right'>" + addCommas(nlapiFormatCurrency(final_obj_hashtable[i] * -1)) + '</p></td>';//credit amount
              }
            }
			journalEntry += '</tr>';
		}
		
		journalEntry += '<tr>';
		//journalEntry += "<td class='account'>" + itemCat + '</td>';
		journalEntry += "<td></td>";
		journalEntry += "<td class='account'></td>";
		journalEntry += "<td><p class='wide indent'>" + account + '</p></td>';
		journalEntry += "<td></td>";
		journalEntry += "<td><p align = 'right'>" + totalAmount + '</p></td>';
		journalEntry += '</tr>';
	}
	filler = maxLine - subCount;
	for(i = filler; i > 0; i--) {
		journalEntry += '<tr>';
		journalEntry += "<td class='account'><p></p></td>";
		journalEntry += "<td class='entry'><p></p></td>";
		journalEntry += "<td class='debit'><p class='wide textRight'></p></td>";
		journalEntry += "<td class='credit'><p class='wide textRight'></p></td>";
		journalEntry += '</tr>';
	}
	
	payee = rec.getFieldText('entity');
	address0 = (rec.getFieldValue('custbody121') == '' || rec.getFieldValue('custbody121') == null) ? nlapiLoadRecord('vendor', rec.getFieldValue('entity')).getFieldValue('defaultaddress') : nlapiLookupField('purchaseorder', rec.getFieldValue('custbody121'), 'billaddress');
	var vendor = address0;
	var capitals = '';
	var adddress = vendor;
	var dranix_address = rec.getFieldValue('location');
	var da=nlapiLoadRecord('location',dranix_address);
	addressdran = da.getFieldValue('addrtext');
	/*da = nlapiLookupField('location', rec.getFieldValue('location'), ['address1', 'address2']);
	addressdran = da.address1 + ' ' + da.address2;*/
	address1 = '';
	date = rec.getFieldValue('trandate');
	APVNum = rec.getFieldValue('tranid');
	dueDate = rec.getFieldValue('duedate');
	invNum = rec.getFieldValue('custbody37');
	PONum = rec.getFieldText('custbody121');
	PONum = PONum.substring(PONum.indexOf('#') + 1);
	RRNum = rec.getFieldText('custbody95');
	particulars = rec.getFieldValue('custbody104').replace('&', '');
	particulars = (particulars == null) ? '' : particulars;
	prepared = (rec.getFieldText('custbody8') == null) ? '' : rec.getFieldText('custbody8');
	checked = (rec.getFieldText('custbody115') == null) ? '' : rec.getFieldText('custbody115');
	approved = (rec.getFieldText('custbody154') == null) ? '' : rec.getFieldText('custbody154');
	deptid = rec.getFieldValue('department');
	
	ctx = nlapiGetContext(); //gets the context value: xml value
	html = ctx.getSetting('SCRIPT', 'custscript15');
	
	/****### REPLACE ALL VALUES IN THE GIVEN CONTEXT ### ****/
	html = html.replace('{payee}', payee.replace('&', ' AND '));
	html = html.replace('{address0}', (address0 == null) ? '' : address0.replace('&', ' AND '));
	html = html.replace('{address1}', address1.replace('&', ' AND '));
	html = html.replace('{date}', date);
	html = html.replace('{APVNum}', invNum);
	html = html.replace('{dueDate}', dueDate);
	html = html.replace('{dranixaddress}',addressdran.toUpperCase());
	html = html.replace('{dept}', depart);
	html = html.replace('{mainadd}',loca.toUpperCase());
	html = html.replace('{invDate}', date);
	html = html.replace('{invNum}', (APVNum == null || APVNum == '') ? '' : APVNum);
	html = html.replace('{PONum}', PONum);
	html = html.replace('{RRNum}', (RRNum == null) ? '' : RRNum);
	html = html.replace('{amount}', totalAmount);
	html = html.replace('{particulars}', particulars);
	html = html.replace('{journalEntry}', journalEntry);
	html = html.replace('{prepared}',  prepared);
	html = html.replace('{checked}', checked);
	html = html.replace('{approved}',  approved);
	html = replaceall(html, "&", " and ");
	/****### END REPLACE ALL VALUES ### ****/
	
	pdf = nlapiXMLToPDF(html);
	response.setContentType('PDF', 'testing.pdf', 'inline');
	
	response.write(pdf.getValue());
} //END FUNCTION

//Creates a Table Row for the template
function jeRows(code, entry, debit, credit) {
	return	"<tr>" +
			"<td width='150'>" + code + "</td>" +
			"<td width='350'>" + entry + "</td>" +
			"<td width='150' align='right'>" + addCommas(debit) + "</td>" +
			"<td width='150' align='right'>" + addCommas(credit) + "</td>" +
			"</tr>";
}
//Replace the given character or string with a new one
function replaceall(str, replace, with_this) {
	var str_hasil = "";
	var temp;
	for(var i = 0; i < str.length; i++) {
		if (str[i] == replace) {
			temp = with_this;
		}
		else {
			temp = str[i];
		}
		str_hasil += temp;
	}
	return str_hasil;
}

//Add Commas to the amount and returns the string value
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