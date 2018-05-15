/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Mar 2017     Dranix
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function scheduledAccrued(type) {
	var d = new Date();
	var ACCRUED_CLASS = new ACCRUED_REMINDER();
	
	/** SET DATE **/
	ACCRUED_CLASS._SET_CURRENT_DATE(d.getMonth()+1+'/'+d.getDate()+'/'+d.getFullYear());
	
	/** EXECUTE SCRIPT **/
	ACCRUED_CLASS._EXECUTE_SCRIPT();
}

var ACCRUED_REMINDER = function() {
	var currentdate;
	
	this._EXECUTE_SCRIPT = function() {
		var data = [], entries = this._GET_ACCRUED_JE(), currentdate = new Date(this._GET_CURRENT_DATE());
		
		/** RESET COUNTER EVERY 20TH DAY OF THE MONTH **/
		
		if(currentdate.getDate() == 20) {
			this._RESET_COUNTER();
		}
		
		/**********************************************/
		
		if(entries.length > 0) {
			var fil = new nlobjSearchFilter('internalid', null, 'anyof', entries);
			var col = [
			    new nlobjSearchColumn('account'),
			    new nlobjSearchColumn('internalid'),
			    new nlobjSearchColumn('class'),
			    new nlobjSearchColumn('location'),
			    new nlobjSearchColumn('trandate')
			];
			
			var jes = nlapiSearchRecord('journalentry', null, fil, col);
			
			for(var j in jes) {
				if(!(/accrued/i.test(jes[j].getText('account')))) {
					var fil_rem =  [
					  new nlobjSearchFilter('custrecord898', null, 'anyof', jes[j].getValue('account')),
					  new nlobjSearchFilter('custrecord899', null, 'is', jes[j].getValue('class')),
					  new nlobjSearchFilter('custrecord900', null, 'is', jes[j].getValue('location')) ];
					
					var col_rem = [
					  new nlobjSearchColumn('custrecord902'), //month
					  new nlobjSearchColumn('custrecord901'), //counter
					  new nlobjSearchColumn('internalid') ]; //counter 
					
					var res_rem = nlapiSearchRecord('customrecord427', null, fil_rem, col_rem);
					for(var k in res_rem) {
						if(parseInt(res_rem[k].getValue('custrecord901')) == 0) {
							if(currentdate.getMonth()+1 == res_rem[k].getValue('custrecord902')) {
							nlapiSubmitField('customrecord427',res_rem[k].getValue('internalid'),'custrecord901',1);
							} else {
							nlapiSubmitField('customrecord427',res_rem[k].getValue('internalid'),'custrecord902', currentdate.getMonth()+1);
							nlapiSubmitField('customrecord427',res_rem[k].getValue('internalid'),'custrecord901', 1);
							}
						}
					}
				    
				}
			
			}
		}
	};
	
	/** GET ACCRUED ACCOUNTS **/
	this._GET_ACCRUED_ACCOUNTS = function() {
		var accounts=[];
		var fil_acct = [
	        new nlobjSearchFilter('name', null, 'contains', 'accrued'),
	        new nlobjSearchFilter('isinactive', null, 'is', 'F')
		];
		
		var col_acct = new nlobjSearchColumn('internalid');
		var result_acct = nlapiSearchRecord('account', null, fil_acct,col_acct);
		
		for(var i in result_acct) {
			accounts.push(result_acct[i].getValue('internalid'));
		}
		
		return accounts;
	
	};
	
	/** GET JE WITH ACCRUED ENTRIES **/
	this._GET_ACCRUED_JE = function() {
		var currentdate = new Date( this._GET_CURRENT_DATE() );
		
		if(currentdate.getDate() == 20) {
			var start_date = currentdate.getMonth()+1+'/'+currentdate.getDate()+'/'+currentdate.getFullYear();
			var end_date = currentdate.getMonth()+1+'/'+currentdate.getDate()+'/'+currentdate.getFullYear();
		} else {
			var start_date = currentdate.getMonth()+1+'/1/'+currentdate.getFullYear();
			var end_date = currentdate.getMonth()+1+'/'+currentdate.getDate()+'/'+currentdate.getFullYear();
		}
		
		var col =  new nlobjSearchColumn('internalid');
		
		var fil = [
		   new nlobjSearchFilter('account', null, 'anyof', this._GET_ACCRUED_ACCOUNTS()),
		   new nlobjSearchFilter('trandate', null, 'within', start_date, end_date),
		   new nlobjSearchFilter('mainline', null, 'is', 'F')
		];
		
		var result =  nlapiSearchRecord('journalentry', null, fil, col);
		
		var data = [];
		
		for(var j in result) {
			data.push(result[j].getValue('internalid'));
		}
		
		return data;
		
	};
	
	/** FUNCTION TO RESET COUNTER **/
	this._RESET_COUNTER = function() {
		var result =  nlapiSearchRecord('customrecord427', null, new nlobjSearchFilter('isinactive', null, 'is', 'F'), [ new nlobjSearchColumn('internalid'), new nlobjSearchColumn('custrecord901') ]);
		for(var i in result) {
		   if(parseInt(result[i].getValue('custrecord901')) != 0) {
		     nlapiSubmitField('customrecord427',result[i].getValue('internalid'),'custrecord901', 0);
		   }
		}
	};
	
	/** SETTERS **/
	this._SET_CURRENT_DATE = function(cdate) {
		this.currentdate = cdate;
	};
	
	/** GETTERS **/
	this._GET_CURRENT_DATE = function() {
		return this.currentdate;
	};
	
};
