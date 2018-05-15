/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 May 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoad(type, form, request){
	try {
		if(type == 'view') {
          	if(nlapiGetRole() == 3 || nlapiGetRole() == 1084 || nlapiGetRole() == 1054) { // 3 = Administrator; 1084 = Cashier; 1054 = AR;
              var internalid = nlapiGetRecordId();
              var customerpayment = "window.location = '/app/accounting/transactions/custpymt.nl?whence=&entity="+internalid+"';";
              var customerdeposit = "window.location = '/app/accounting/transactions/custdep.nl?whence=&entity="+internalid+"';";
              form.addButton("custpage_papv", "Accept Customer Payment", customerpayment);
              form.addButton("custpage_papv", "Record Customer Deposit", customerdeposit);
            }
        }
	} catch (e) {
		if (e instanceof nlobjError) {
			nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
		} else {
			nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
		}
	}
}
