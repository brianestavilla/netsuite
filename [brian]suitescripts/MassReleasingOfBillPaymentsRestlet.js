/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Dec 2016     Dranix
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {
	
	try {
		var ids = dataIn.ids.split('_');
		var index = ids.indexOf('');
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - START **/
		
		if(index > -1) { ids.splice(index, 1); }
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - END **/
		
		var billaccounts = JSON.parse(dataIn.billaccounts);
		
//		var columns = new Array (
//			new nlobjSearchColumn('custbody214'), //bill debitting account
//			new nlobjSearchColumn('account'), //bill account
//			new nlobjSearchColumn('custbody37'), //bill apv
//			new nlobjSearchColumn('entity'), // bill payee
//			new nlobjSearchColumn('memo'), // bill memo
//			new nlobjSearchColumn('custbody192'), //bill payment refrence in bill
//			new nlobjSearchColumn('amount'), //bill total
//			new nlobjSearchColumn('class'), //bill class
//			new nlobjSearchColumn('department'), //bill department
//			new nlobjSearchColumn('location'), //bill location
//			new nlobjSearchColumn('account','custbody192'),
//			new nlobjSearchColumn('amount','custbody192'),
//			new nlobjSearchColumn('class','custbody192'),
//			new nlobjSearchColumn('department','custbody192'),
//			new nlobjSearchColumn('location','custbody192')
//		);
		
		var columns = new Array (
			new nlobjSearchColumn('custbody214','appliedtotransaction'), //bill debitting account
			new nlobjSearchColumn('account','appliedtotransaction'), //bill account
			new nlobjSearchColumn('custbody37','appliedtotransaction'), //bill apv
			new nlobjSearchColumn('entity','appliedtotransaction'), // bill payee
			new nlobjSearchColumn('memo','appliedtotransaction'), // bill memo
			new nlobjSearchColumn('appliedtolinkamount'), //bill total
			new nlobjSearchColumn('class','appliedtotransaction'), //bill class
			new nlobjSearchColumn('department','appliedtotransaction'), //bill department
			new nlobjSearchColumn('location','appliedtotransaction'), //bill location
			new nlobjSearchColumn('account'),
			new nlobjSearchColumn('amount'),
			new nlobjSearchColumn('class'),
			new nlobjSearchColumn('department'),
			new nlobjSearchColumn('location'),
			new nlobjSearchColumn('internalid')
		);			
		
		var filter = [
  		    new nlobjSearchFilter('internalid', null, 'anyof', ids),
		    new nlobjSearchFilter('mainline', null, 'is', 'F'),
		    new nlobjSearchFilter('custbody212', null, 'anyof', 'T'),
		    new nlobjSearchFilter('custbody209', null, 'anyof', '@NONE@')];
		
		var result = nlapiSearchRecord('vendorpayment', null, filter, columns);
		
		var mainline = [];
		
		/**
		** 	ONE DISBURSING ACCOUNT
		**	1405 = 101010438 Cash and Cash Equivalents : Cash in Bank : MBTC 7028-51706-4 (DDI_Disb)
		**/
		
		if(result!= null) {
			for(var i=0; i<result.length; i++) {
				var found = mainline.some(function (res) {
			      return res.paymentnum == result[i].getValue('internalid');
			    });
				
				if (!found) {
					
//					mainline.push({
//						'paymentnum': result[i].getValue('custbody192'),
//						'lineitems': [{
//								'account':result[i].getValue('account'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								//'credit':result[i].getValue('amount','custbody192'),
//								'credit':Math.abs(parseFloat(result[i].getValue('amount','custbody192'))),
//								'debit':0,
//								'principal':result[i].getValue('class','custbody192'),
//								'department':result[i].getValue('department','custbody192'),
//								'location':result[i].getValue('location','custbody192')
//							}, {
//								'account':result[i].getValue('account','custbody192'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								'credit':0,
//								'debit':parseFloat(result[i].getValue('amount')),
//								'principal':result[i].getValue('class','custbody192'),
//								'department':result[i].getValue('department','custbody192'),
//								'location':result[i].getValue('location','custbody192')
//							}, {
//								'account':result[i].getValue('custbody214'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								'credit':parseFloat(result[i].getValue('amount')),
//								'debit':0,
//								'principal':result[i].getValue('class'),
//								'department':result[i].getValue('department'),
//								'location':result[i].getValue('location')
//							}, {
//								'account':result[i].getValue('account'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								'credit':0,
//								'debit':parseFloat(result[i].getValue('amount')),
//								'principal':result[i].getValue('class'),
//								'department':result[i].getValue('department'),
//								'location':result[i].getValue('location')
//							}]
//					});
					
					mainline.push({
						'paymentnum': result[i].getValue('internalid'),
						'lineitems': [{
							'account':result[i].getValue('account','appliedtotransaction'),
							'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
							'entity':result[i].getValue('entity','appliedtotransaction'),
							'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
							'credit':Math.abs(parseFloat(result[i].getValue('amount'))),
							'debit':0,
							'principal':result[i].getValue('class'),
							'department':result[i].getValue('department'),
							'location':result[i].getValue('location')
						}, {
							'account':1405,
							'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
							'entity':result[i].getValue('entity','appliedtotransaction'),
							'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
							'credit':0,
							'debit':parseFloat(result[i].getValue('appliedtolinkamount')),
							'principal':result[i].getValue('class'),
							'department':result[i].getValue('department'),
							'location':result[i].getValue('location')
						}, {
							'account':result[i].getValue('custbody214','appliedtotransaction'),
							'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
							'entity':result[i].getValue('entity','appliedtotransaction'),
							'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
							'credit':parseFloat(result[i].getValue('appliedtolinkamount')),
							'debit':0,
							'principal':result[i].getValue('class','appliedtotransaction'),
							'department':result[i].getValue('department','appliedtotransaction'),
							'location':result[i].getValue('location','appliedtotransaction')
						}, {
							'account':result[i].getValue('account','appliedtotransaction'),
							'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
							'entity':result[i].getValue('entity','appliedtotransaction'),
							'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
							'credit':0,
							'debit':parseFloat(result[i].getValue('appliedtolinkamount')),
							'principal':result[i].getValue('class','appliedtotransaction'),
							'department':result[i].getValue('department','appliedtotransaction'),
							'location':result[i].getValue('location','appliedtotransaction')
						}]
					});
	
				} else {
					for(var k=0; k<mainline.length; k++) {
						if(mainline[k].paymentnum == result[i].getValue('internalid')) {
//							mainline[k].lineitems.push({
//								'account':result[i].getValue('account','custbody192'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								'credit':0,
//								'debit':parseFloat(result[i].getValue('amount')),
//								'principal':result[i].getValue('class','custbody192'),
//								'department':result[i].getValue('department','custbody192'),
//								'location':result[i].getValue('location','custbody192')
//							});
//							
//							mainline[k].lineitems.push({
//								'account':result[i].getValue('custbody214'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								'credit':parseFloat(result[i].getValue('amount')),
//								'debit':0,
//								'principal':result[i].getValue('class'),
//								'department':result[i].getValue('department'),
//								'location':result[i].getValue('location'),
//							});
//							
//							mainline[k].lineitems.push({
//								'account':result[i].getValue('account'),
//								'apvnum':result[i].getValue('custbody37'),
//								'entity':result[i].getValue('entity'),
//								'memo':billaccounts[result[i].getText('custbody214')].dm_cm_num,
//								'credit':0,
//								'debit':parseFloat(result[i].getValue('amount')),
//								'principal':result[i].getValue('class'),
//								'department':result[i].getValue('department'),
//								'location':result[i].getValue('location')
//							});
							
							mainline[k].lineitems.push({
								'account':1405,
								'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
								'entity':result[i].getValue('entity','appliedtotransaction'),
								'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
								'credit':0,
								'debit':parseFloat(result[i].getValue('appliedtolinkamount')),
								'principal':result[i].getValue('class'),
								'department':result[i].getValue('department'),
								'location':result[i].getValue('location')
							});
							
							mainline[k].lineitems.push({
								'account':result[i].getValue('custbody214','appliedtotransaction'),
								'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
								'entity':result[i].getValue('entity','appliedtotransaction'),
								'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
								'credit':parseFloat(result[i].getValue('appliedtolinkamount')),
								'debit':0,
								'principal':result[i].getValue('class','appliedtotransaction'),
								'department':result[i].getValue('department','appliedtotransaction'),
								'location':result[i].getValue('location','appliedtotransaction'),
							});
							
							mainline[k].lineitems.push({
								'account':result[i].getValue('account','appliedtotransaction'),
								'apvnum':result[i].getValue('custbody37','appliedtotransaction'),
								'entity':result[i].getValue('entity','appliedtotransaction'),
								'memo':billaccounts[result[i].getText('custbody214','appliedtotransaction')].dm_cm_num,
								'credit':0,
								'debit':parseFloat(result[i].getValue('appliedtolinkamount')),
								'principal':result[i].getValue('class','appliedtotransaction'),
								'department':result[i].getValue('department','appliedtotransaction'),
								'location':result[i].getValue('location','appliedtotransaction')
							});
							
						}
					}
				}
			}
		}

		var array_id=[];
		for(var e = 0; e<mainline.length; e++) {
			var record = nlapiCreateRecord('journalentry');
			record.setFieldValue('approved', 'T');
			record.setFieldValue('custbody210', mainline[e].paymentnum);
			record.setFieldValue('custbody17', '');
			
			for(var w=0; w<mainline[e].lineitems.length; w++) {
				record.setLineItemValue('line', 'account', w+1, mainline[e].lineitems[w].account);
				record.setLineItemValue('line', 'entity', w+1, mainline[e].lineitems[w].entity);
				record.setLineItemValue('line', 'memo', w+1, mainline[e].lineitems[w].memo);
				record.setLineItemValue('line', 'credit', w+1, mainline[e].lineitems[w].credit);
				record.setLineItemValue('line', 'debit', w+1, mainline[e].lineitems[w].debit);
				record.setLineItemValue('line', 'class', w+1, mainline[e].lineitems[w].principal);
				record.setLineItemValue('line', 'department', w+1, mainline[e].lineitems[w].department);
				record.setLineItemValue('line', 'location', w+1, mainline[e].lineitems[w].location);
			}
			
			var id = nlapiSubmitRecord(record, null, true);
			nlapiSubmitField('vendorpayment', mainline[e].paymentnum, 'custbody209', id);
			array_id.push(id);
		}
		
//		return mainline;
		
		if(array_id.length>0) {
			return {
				'error_code': 200,
				'message':'Checks are Released Successfully',
				'data' : array_id
			};
		} else {
			return {
				'error_code': 404,
				'message' : 'There was an error. No JE created.'
			};
		}
	} catch(err) {
		return {
			'error_code' :404,
			'message': err.message
		};
	};

}


