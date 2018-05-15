/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jan 2017     Dranix
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response) {
	if(request.getMethod()=='GET') {
		//GET REQUEST
		var form = nlapiCreateForm("FILTER");
	
		form.addField('custpage_datefrom', 'date', 'From Date');		
		form.addField('custpage_dateto', 'date', 'To Date');
		var reportlist = form.addField('reportlist', 'select', 'Report Type');
		reportlist.addSelectOption('withEWT', "APV's with EWT", true);
		reportlist.addSelectOption("withoutEWT", "APV's without EWT", false);
		reportlist.addSelectOption("trialbalanceWithEWT", "Trial Balance with EWT", false);
		reportlist.addSelectOption("trialbalanceWithoutEWT", "Trial Balance without EWT", false);
		
		var accounttypes = form.addField('accounttypes', 'multiselect', 'Account Type');
		accounttypes.addSelectOption('Bank', 'Bank', true);
		accounttypes.addSelectOption('AcctRec', 'Receivable', true);
		accounttypes.addSelectOption('OthCurrAsset', 'Other Current Asset', true);
		accounttypes.addSelectOption('FixedAsset', 'Fixed Asset', true);
		accounttypes.addSelectOption('OthAsset', 'Other Asset', true);
		accounttypes.addSelectOption('AcctPay', 'Account Payable', true);
		accounttypes.addSelectOption('CredCard', 'Credit Card', true);
		accounttypes.addSelectOption('OthCurrLiab', 'Other Current Liability', true);
		accounttypes.addSelectOption('LongTermLiab', 'Long Term Liability', true);
		accounttypes.addSelectOption('Equity', 'Equity', true);
		accounttypes.addSelectOption('Income', 'Income', true);
		accounttypes.addSelectOption('COGS', 'Cost of Good Sold', true);
		accounttypes.addSelectOption('Expense', 'Expense', true);
		accounttypes.addSelectOption('OthIncome', 'Other Income', true);
		accounttypes.addSelectOption('OthExpense', 'Other Expense', true);
		accounttypes.addSelectOption('NonPosting', 'Non Posting', true);
		accounttypes.addSelectOption('DeferRevenue', 'Deffered Revenue', true);
		accounttypes.addSelectOption('DeferExpense', 'Deffered Expense', true);
		accounttypes.addSelectOption('UnbilledRec', 'Unbilled Receivable', true);
		
		form.addSubmitButton('Submit');
		
		//set session object
		nlapiGetContext().setSessionObject('status', 'GET');
		response.writePage(form);
		
	} else { // POST REQUEST
			var reportlist = request.getParameter('reportlist');
			var accounts = request.getParameter('accounttypes');
			var form = nlapiCreateForm("LIST OF APV");
			var internalids='';
			var start = new Date(request.getParameter('custpage_datefrom'));
			var end = new Date(request.getParameter('custpage_dateto'));
			var query = [];	
			var impactFil;
			var impactCol;
			
			if(reportlist == 'withEWT' || reportlist == 'trialbalanceWithEWT') {
				
				/**
				**	Generate APV's with EWT 
				**/
				
				var apv_with_ewt = new APV_WITH_EWT();
				apv_with_ewt.setStartDate(start); // set start date
				apv_with_ewt.setEndDate(end); //set end date
				apv_with_ewt.setAccountTypes(accounts); // set accounts
				internalids = apv_with_ewt._GET_DATA();
				
				var recIDs = internalids.split('_');
				var index = recIDs.indexOf('');
				
				/**
				** REMOVE EMPTY VALUES IN THE ARRAY - START
				**/
				
				if(index > -1) { recIDs.splice(index, 1); }
				
				if(reportlist == 'withEWT') {
					/** REPORT LIST IS APV WITH EWT **/
					impactCol = [
		  			   new nlobjSearchColumn('internalid'),
		  			   new nlobjSearchColumn('account'),
		  			   new nlobjSearchColumn('custbody37'),
		  			   new nlobjSearchColumn('entity'),
		  			   new nlobjSearchColumn('trandate'),
		  			   new nlobjSearchColumn('class'),
		  			   new nlobjSearchColumn('department'),
		  			   new nlobjSearchColumn('location'),
		  			   new nlobjSearchColumn('amount')
		  			];
					    			
	    			impactCol[1].setSort();	
					    			
					impactFil = [
		   		     	new nlobjSearchFilter('account', null, 'anyof', apv_with_ewt.getListTypes()),
		   		     	new nlobjSearchFilter('internalid', null, 'anyof', recIDs)
		   			];
				} else {
					/** REPORT LIST IS TRIAL BALANCE **/
					impactCol = [
		  			   new nlobjSearchColumn('internalid'),
		  			   new nlobjSearchColumn('account'),
		  			   new nlobjSearchColumn('custbody37'),
		  			   new nlobjSearchColumn('entity'),
		  			   new nlobjSearchColumn('trandate'),
		  			   new nlobjSearchColumn('class'),
		  			   new nlobjSearchColumn('department'),
		  			   new nlobjSearchColumn('location'),
		  			   new nlobjSearchColumn('creditamount'),
		  			   new nlobjSearchColumn('debitamount')
		  			];
					    			
	    			impactCol[1].setSort();	
					    			
					impactFil = [
		   		     	new nlobjSearchFilter('account', null, 'anyof', apv_with_ewt.getListTypes()),
		   		     	new nlobjSearchFilter('internalid', null, 'anyof', recIDs)
		   			];
				}
				
			
			} else if(reportlist == 'withoutEWT' || reportlist == 'trialbalanceWithoutEWT') {
				
				/**
				**	Generate APV's with EWT 
				**/

				var apv_with_ewt = new APV_WITH_EWT();
				apv_with_ewt.setStartDate(start);
				apv_with_ewt.setEndDate(end);
				apv_with_ewt.setAccountTypes(accounts);
				internalids = apv_with_ewt._GET_DATA();
				
				/**
				** Generate APV's that does not exist in the first generated report 
				**/
				
				var apv_without_ewt = new APV_WITHOUT_EWT();
				apv_without_ewt.setStartDate(start);
				apv_without_ewt.setEndDate(end);
				apv_without_ewt.setWithEWTIds(internalids);
				apv_without_ewt.setAccountTypes(accounts);
				
				internalids = '';
				internalids = apv_without_ewt._GET_DATA_WITHOUT_EWT();
				
				var recIDs = internalids.split('_');
				var index = recIDs.indexOf('');
				
				/**
				** REMOVE EMPTY VALUES IN THE ARRAY - START
				**/
				
				if(index > -1) {
					recIDs.splice(index, 1);
				}
				
				if(reportlist == 'withoutEWT') {
					/** APV WITHOUT EWT**/
					impactCol = [
		  			   new nlobjSearchColumn('internalid'),
		  			   new nlobjSearchColumn('account'),
		  			   new nlobjSearchColumn('custbody37'),
		  			   new nlobjSearchColumn('entity'),
		  			   new nlobjSearchColumn('trandate'),
		  			   new nlobjSearchColumn('class'),
		  			   new nlobjSearchColumn('department'),
		  			   new nlobjSearchColumn('location'),
		  			   new nlobjSearchColumn('amount')
		  			];
					    			
	    			impactCol[1].setSort();	
					
					impactFil = [
		   		     	new nlobjSearchFilter('account', null, 'anyof', apv_without_ewt.getListTypes()),
		   		     	new nlobjSearchFilter('internalid', null, 'anyof', recIDs)
		   			];
				} else {
					/** REPORT LIST IS TRIAL BALANCE WITHOUT EWT **/
					impactCol = [
		  			   new nlobjSearchColumn('internalid'),
		  			   new nlobjSearchColumn('account'),
		  			   new nlobjSearchColumn('custbody37'),
		  			   new nlobjSearchColumn('entity'),
		  			   new nlobjSearchColumn('trandate'),
		  			   new nlobjSearchColumn('class'),
		  			   new nlobjSearchColumn('department'),
		  			   new nlobjSearchColumn('location'),
		  			   new nlobjSearchColumn('creditamount'),
		  			   new nlobjSearchColumn('debitamount')
		  			];
					    			
	    			impactCol[1].setSort();	
					    			
					impactFil = [
		   		     	new nlobjSearchFilter('account', null, 'anyof', apv_with_ewt.getListTypes()),
		   		     	new nlobjSearchFilter('internalid', null, 'anyof', recIDs)
		   			];
				}
				
				
//				var hml = form.addField('htmltotal', 'inlinehtml');
//				hml.setDefaultValue("<div>"+JSON.stringify(recIDs.length)+"</div>");
			}
	
			
  			var reportDefinition = nlapiCreateReportDefinition();
  			var title = '';
  			
  			if(reportlist == 'withoutEWT') {
  				title = 'BIR Reconciliation Report Without EWT';
  			} else if(reportlist == 'withEWT') {
  				title = 'BIR Reconciliation Report With EWT';
  			} else if(reportlist == 'trialbalanceWithEWT') {
  				title = 'Trial Balance Report With EWT';
  			} else if(reportlist == 'trialbalanceWithoutEWT') {
  				title = 'Trial Balance Report Without EWT';
  			}
  			
  			reportDefinition.setTitle(title);
  			var account = reportDefinition.addRowHierarchy('account', 'Account', 'TEXT');
  			var apvnum = reportDefinition.addColumn('custbody37', false, 'APV Number', null, 'TEXT', null);
  			var payee = reportDefinition.addColumn('entity', false, 'Payee', null, 'TEXT', null);
  			var payee = reportDefinition.addColumn('trandate', false, 'Date', null, 'TEXT', null);
  			var department = reportDefinition.addColumn('department', false, 'Department', null, 'TEXT', null);
  			var principal = reportDefinition.addColumnHierarchy('principal', 'Principal', null, 'TEXT');
  			var location = reportDefinition.addColumnHierarchy('location', 'Location', principal, 'TEXT');
  			
  			if(reportlist == 'trialbalanceWithEWT' || reportlist == 'trialbalanceWithoutEWT') {
  				var creditamount = reportDefinition.addColumn('creditamount', true, 'Credit Amount', location, 'CURRENCY', null);
  				var debitamount = reportDefinition.addColumn('debitamount', true, 'Debit Amount', location, 'CURRENCY', null);
  				
  				reportDefinition.addSearchDataSource('vendorbill', null, impactFil, impactCol, 
  		  		{'account':impactCol[1],
  				 'custbody37': impactCol[2],
  				 'entity':impactCol[3],
  				 'trandate':impactCol[4],
  				 'principal':impactCol[5],
  				 'department':impactCol[6],
  				 'location':impactCol[7],
  				 'creditamount':impactCol[8],
  				 'debitamount':impactCol[9]
  				});
  				
  			} else {
  				var amount = reportDefinition.addColumn('amount', true, 'Amount', location, 'CURRENCY', null);
  				reportDefinition.addSearchDataSource('vendorbill', null, impactFil, impactCol, 
  			  	{'account':impactCol[1], 'custbody37': impactCol[2], 'entity':impactCol[3], 'trandate':impactCol[4], 'principal':impactCol[5],'department':impactCol[6],'location':impactCol[7],'amount':impactCol[8]});	
  			}
  			
  			var form = nlapiCreateReportForm(title);		
  			reportDefinition.executeReport(form);
			response.writePage(form);
	}
}

/***************************** REPORT CLASSES *****************************/

/**** APV's WITH EWT CLASS ****/

var APV_WITH_EWT = function() {
	var start_date, end_date, accounttypes='';
	
	/**
	**	GET REPORT
	**/
	this._GET_DATA = function() {
		var internalids = '';
		var query = this.setDateDivisibleByTen(this.getStartDate(), this.getEndDate());
				
		for(var r=0; r<query.length; r++) {
			result = this.getDataWithEWT(query[r].start, query[r].end);
			
			if(result!= null) {
				for(var i=0; i<result.length; i++) {
					internalids+= result[i].getValue('internalid', null, 'group');
					if(i < result.length) { internalids+="_"; }
				}
			}
			
		}
		
		return internalids;
		
	};
	
	/**
	** CUSTOM FUNCTIONS
	**/
	this.getListTypes = function () {
		var data = [];
		var accounts = this.getAccountTypes();
		
		var column = new nlobjSearchColumn('internalid');
		var filters = [ new nlobjSearchFilter('isinactive', null, 'is', 'F'),
		                new nlobjSearchFilter('type', null, 'anyof', accounts.split('\u0005')) ]; 
		results = nlapiSearchRecord('account', null, filters, column);
		
		for(var i=0; i<results.length; i++) {
			data.push(results[i].getValue('internalid'));
		}
		
		return data;
		
	};
	
	this.setDateDivisibleByTen = function(start, end) {
		var query = [];
		var temp = [];
		start = new Date(start);
		end = new Date(end);
		
		for (var i = start; i <= end; i.setDate(i.getDate() + 1)) {
			temp.push(i.getMonth()+1+'/'+i.getDate()+'/'+i.getFullYear());
			
			if(temp.length == 10) {
				query.push({'start': temp[0], 'end': temp[9]});
			    temp.length = 0;
			}
			
			if(i.getMonth()+1 == end.getMonth()+1 && i.getDate() == end.getDate() && i.getFullYear() == end.getFullYear()) {
				if(temp.length > 0) {
					query.push({'start': temp[0], 'end': temp[temp.length-1] });
				    temp.length = 0;
				}
			}
		}
		
		return query;
	};
	
	this.getDataWithEWT = function(start, end) {
		var column = new nlobjSearchColumn('internalid', null, 'group');		
		var filters = [
	       new nlobjSearchFilter('trandate', null, 'within', start, end),
	       new nlobjSearchFilter('status', null, 'anyof', ['VendBill:A','VendBill:B']) //VendBill:A : Open; VendBill:B : Paid in Full 
       ];
		
		//sandbox = customsearch1863; production = customsearch1863_2;
		return nlapiSearchRecord(null, 'customsearch1863_2', filters, column); 
		
	};
	
	/**
	** SETTERS 
	**/
	
	this.setStartDate = function(sdate) {
		var d = new Date(sdate);
		this.start_date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	};
	
	this.setEndDate = function(edate) {
		var d = new Date(edate);
		this.end_date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	};
	
	this.setAccountTypes = function(types) {
		this.accounttypes = types;
	};
	
	/**
	** GETTERS 
	**/
	
	this.getStartDate = function() {
		return this.start_date;
	};
	
	this.getEndDate = function() {
		return this.end_date;
	};
	
	this.getAccountTypes = function() {
		return this.accounttypes;
	};
	
};


/**** APV's WITHOUT EWT CLASS ****/

var APV_WITHOUT_EWT = function() {
	var start_date, end_date, withEWTIds = '', accounttypes='';
	
	/**
	**	GET REPORT
	**/
	this._GET_DATA_WITHOUT_EWT = function() {
		var query = this.setDateDivisibleByTen(this.getStartDate(), this.getEndDate());
		var withoutids = '';
		
		for(var r=0; r<query.length; r++) {
			results = this.getDataWithoutEWT(query[r].start, query[r].end, this.getWithEWTIds());

			if(results!= null) {
				for(var i=0; i<results.length; i++) {
					withoutids+= results[i].getValue('internalid', null, 'group');
					if(i < results.length) { withoutids+="_"; }
				}
			}
			
		}
		
		return withoutids;
	
	};
	
	/**
	** CUSTOM FUNCTIONS
	**/
	this.getListTypes = function () {
		var data = [];
		var accounts = this.getAccountTypes();
		
		var column = new nlobjSearchColumn('internalid');
		var filters = [
           new nlobjSearchFilter('type', null, 'anyof', accounts.split('\u0005')),
           new nlobjSearchFilter('name', null, 'doesnotcontain', 'withholding')
		];
		
		results = nlapiSearchRecord('account', null, filters, column);
		
		if(results != null) {
			for(var i=0; i<results.length; i++) {
				data.push(results[i].getValue('internalid'));
			}
		}
		
		return data;
		
	};
	this.getDataWithoutEWT = function(start, end, internalids) {
		var column = new nlobjSearchColumn('internalid', null, 'group');
		var recIDs = internalids.split('_');
		var index = recIDs.indexOf('');
		
		/**
		** REMOVE EMPTY VALUES IN THE ARRAY - START
		**/
		
		if(index > -1) {
			recIDs.splice(index, 1);
		}
		
		var filters = [
	       	new nlobjSearchFilter('internalid', null, 'noneof', recIDs),
	       	new nlobjSearchFilter('trandate', null, 'within', start, end),
	       	new nlobjSearchFilter('status', null, 'anyof', ['VendBill:A','VendBill:B']) //VendBill:A : Open; VendBill:B : Paid in Full
       	];
		
		return nlapiSearchRecord('vendorbill', null, filters, column);
		
	};
	
	this.setDateDivisibleByTen = function(start, end) {
		var query = [];
		var temp = [];
		start = new Date(start);
		end = new Date(end);
		for (var i = start; i <= end; i.setDate(i.getDate() + 1)) {
			temp.push(i.getMonth()+1+'/'+i.getDate()+'/'+i.getFullYear());
			
			if(temp.length == 10) {
				query.push({'start': temp[0], 'end': temp[9]});
				temp.length = 0;
			}
			
			if(i.getMonth()+1 == end.getMonth()+1 && i.getDate() == end.getDate() && i.getFullYear() == end.getFullYear()) {
				if(temp.length > 0) {
					query.push({'start': temp[0], 'end': temp[temp.length-1] });
				    temp.length = 0;
				}
			}
		}
		
		return query;
		
	};
	
	/**
	** SETTERS 
	**/
	
	this.setStartDate = function(sdate) {
		var d = new Date(sdate);
		this.start_date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	};
	
	this.setEndDate = function(edate) {
		var d = new Date(edate);
		this.end_date = d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear();
	};
	
	this.setWithEWTIds = function(withIds) {
		this.withEWTIds = withIds;
	};
	
	this.setAccountTypes = function(types) {
		this.accounttypes = types;
	};
	
	/**
	** GETTERS 
	**/
	
	this.getStartDate = function() {
		return this.start_date;
	};
	
	this.getEndDate = function() {
		return this.end_date;
	};
	
	this.getWithEWTIds = function() {
		return this.withEWTIds;
	};
	
	this.getAccountTypes = function() {
		return this.accounttypes;
	};
};



