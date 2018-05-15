/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       31 Mar 2014     MYMEG
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
	var vendorpayment = nlapiGetNewRecord();
	
	var internalid = vendorpayment.getId();
	
	if(type == 'view')
		{	
			var script1 = "window.open('"+ nlapiResolveURL('SUITELET','customscript_banklisting_report','customdeploy_banklisting_deploy') +"&internalid="+ internalid +"')";
			/*nlapiSetRedirectURL('SUITELET', 'customscript_banklisting_report', 'customdeploy_banklisting_deploy', false, null)*/
			
			var script2 = "window.open('"+ nlapiResolveURL('SUITELET','customscript_banklisting_csv','customdeploy_banklisting_csv') +"&internalid="+ internalid +"')";
			
			form.addButton('custpage_btn_banklisting', 'Print Bank List', script1 );
			form.addButton('custpage_btn_banklisting_csv', 'Export Bank List', script2 );
		}
}
