/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00        Jan 072015     IAN
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	
	var billPaymentId = request.getParameter('internalid');
	
	//load current bill payment record
	var billPayment = nlapiLoadRecord('vendorpayment', billPaymentId);	
	var results, call ={};
	
	if(billPayment.getFieldValue('custbody202') == 'T')
		{
			results = searchPCF(billPaymentId);

			call = {
					'name': function(){
						return results[int].getText('custbody201', null, 'group');
					},
					
					'account': function(){
						return results[int].getValue('custentity9', 'custbody201', 'group');
					},
					'amount': function(){
						return parseFloat(results[int].getValue('amount', null, 'sum'));
					}
			};
		}
	else
		{
			results = searchWER(billPaymentId);
			
			call = {
					'name': function(){
						return results[int].getText('custcol31', null, 'group');
					},
					
					'account': function(){
						return results[int].getValue('custentity9', 'custcol31', 'group');
					},
					'amount': function(){
						return parseFloat(results[int].getValue('debitamount', null, 'sum'));
					}
			};
		}
		
	var data='"PAYEE","CHECK NO.","CV NO.","NAME","ACCOUNT","AMOUNT"\n';
	
	for (var int = 0; results != null && int < results.length; int++) {
		
		
		var row='';
		row += billPayment.getFieldText('entity');
		row +=',';	
		row += billPayment.getFieldValue('custbody53');
		row +=',';	
		row += billPayment.getFieldValue('tranid');
		row +=',';	
		row += call.name();
		row +=',';
		row += call.account();
		row +=',';
		
		var amount = call.amount();
		
		row += amount.toFixed(2);
		row +='\n';
		
		data += row;
	}	

	var file = nlapiCreateFile('payment.csv', 'CSV', data);
	response.setContentType(file.getType(), 'payments.csv');
	response.write(file.getValue());
}


function searchWER( billPaymentId ) {
	var filter = new nlobjSearchFilter('custbody192', null, 'is', billPaymentId);					
	
	var columns = [
	               new nlobjSearchColumn('custcol31', null, 'group'),
	               new nlobjSearchColumn('custcol36', null,'group'),
	               new nlobjSearchColumn('debitamount', null, 'sum')
	               ];
	
	return nlapiSearchRecord(null, 'customsearch441', filter, columns);
}


function searchPCF( billPaymentId ){
	//BANKLISTING PCF SAVESEARCH ----> 	customsearch1184
	var filter = new nlobjSearchFilter('custbody192', null, 'is', billPaymentId);

	var columns = [
	               new nlobjSearchColumn('custbody201', null, 'group'),
	               new nlobjSearchColumn('custentity9', 'custbody201','group'),
	               new nlobjSearchColumn('amount', null, 'sum')
	               ];
	
	return nlapiSearchRecord(null, 'customsearch1184', filter, columns);
}

