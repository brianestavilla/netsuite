/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Apr 2014     Redemptor
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
		var internalid = nlapiGetNewRecord();
		var nextApproverRole = internalid.getFieldValue('custbody17');
		var approvalStatus = internalid.getFieldValue('approvalstatus');
		
			if(type == 'view' && approvalStatus == '1' && nextApproverRole == nlapiGetRole()) {
				var reject = "reject = window.open('" + nlapiResolveURL('SUITELET', 'customscript551', 'customdeploy1') + "&internalid=" + internalid.getId() + "&recordtype=" + internalid.getRecordType() + "&l=t', '_self'); reject.focus();";
				form.addButton("custpage_btnreject", "Reject", reject);
			}
	} catch (e) {}
}
