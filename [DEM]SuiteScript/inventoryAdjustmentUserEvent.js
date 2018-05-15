/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Sep 2014     Redemptor
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
	if(type == 'view')	
	{
		try {
			var record = nlapiGetNewRecord();
			var print = "window.open('"+ nlapiResolveURL('SUITELET', 'customscript566', 'customdeploy1') + "&internalid=" + record.getId() +"')"; 
			form.addButton("custpage_btnprint", "Print", print);
		} catch (e) {}
	}
}
