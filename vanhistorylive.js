function suitelet(request, response){
		if ( request.getMethod() == 'GET' ){
			var form = nlapiCreateForm('Generate Post Dated Checks for Advance Deposit');
			form.addSubmitButton('Preview');
			var fromdate =  form.addField('custpage_fromdate','date', 'From : ');
			var todate =  form.addField('custpage_todate','date', 'To : ');
			
		
			nlapiGetContext().setSessionObject('status', 'get');
			response.writePage(form);
		}else
		{
			var context = nlapiGetContext(),
			form = nlapiCreateForm('Post Dated Checks for Advance Deposit Preview');
			if(context.getSessionObject('status') == 'get'){
				var fromdateview = request.getParameter('custpage_fromdate'),
				todateview = request.getParameter('custpage_todate');
												
				var sublistc = form.addSubList('custpage_results','list', 'Results');
				sublistc.addField('custpage_a','text','Record Value');
				sublistc.addField('custpage_b','text','Subscriber Name');
				sublistc.addField('custpage_c','text','Subscriber Number');
				sublistc.addField('custpage_d','text','Reference Number');
				sublistc.addField('custpage_e','currency','Check Amount');
				sublistc.addField('custpage_f','date','Check Date');
				sublistc.addField('custpage_g','date','Check Posting Date');
				sublistc.addField('custpage_h','text','Check Number');
				sublistc.addField('custpage_i','text','Drawee Bank');
				sublistc.addField('custpage_j','text','BRSTN');
				sublistc.addField('custpage_k','text','Field 1');
				sublistc.addField('custpage_l','text','Field 2');
				sublistc.addField('custpage_m','text','Field 3');
				sublistc.addField('custpage_n','text','Field 4');
				sublistc.addField('custpage_o','text','Field 5');
				sublistc.addField('custpage_p','text','Field 6');
				sublistc.addField('custpage_q','text','Field 7');
				sublistc.addField('custpage_r','text','Field 8');
				sublistc.addField('custpage_s','text','Field 9');
				sublistc.addField('custpage_t','text','Field 10');
				sublistc.addField('custpage_u','text','Filler');
				sublistc.addField('custpage_v','text','FileControlNumber');		
				
			var filterresults = new Array(
							new nlobjSearchFilter('type', null, 'anyof', 'Payment'),
							//new nlobjSearchFilter('custbody185', null, 'between', fromdateview,todateview),
							new nlobjSearchFilter('paymentmethod', null, 'anyof', 'Check')
							
							);
			var columnresults = [
						new nlobjSearchColumn('custbody185',null,'GROUP')
					];	
					
			var resultsq = nlapiSearchRecord('transaction',null,filterresults,null);

			if(resultsq != null){

					sublistc.setLineItemValues(resultsq);

			}
			
			
			nlapiGetContext().setSessionObject('status', 'post');
			response.writePage(form);
			}else{	
				html = nlapiGetContext().getSetting('SCRIPT', 'custscript31');
			}
	}
}