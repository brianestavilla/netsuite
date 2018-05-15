/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Jan 2013     Vanessa Sampang
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
function beforeLoad(type, form) {

    try {
        var newRecord = nlapiGetNewRecord();
        var newId = nlapiGetRecordId();
        var newType = nlapiGetRecordType();
		//var form = nlapiGetFieldValue('customform');
		nlapiLogExecution('DEBUG', 'newtype', newType);
        var ctxtObj = nlapiGetContext();
        var executionContext = ctxtObj.getExecutionContext();
		var bank = nlapiGetFieldValue('custbody44');
		var approv = nlapiGetFieldText('custbody84');
		var checkprinted = nlapiGetFieldValue('custbody190');
		
         if (type == 'view' && approv == 'Approved' && checkprinted == 'F') {
          	var loc = nlapiGetFieldText('location').match(/BOHOL/i);
           	
          	if(loc != null) {
            	var jerefno = nlapiGetFieldValue('custbody209');
             	var acct = nlapiGetFieldValue('account');
              	
              	// 1405 = 101010438 Cash and Cash Equivalents : Cash in Bank : MBTC 7028-51706-4 (DDI_Disb)

              	if(acct == 1405) {
                  if(jerefno != null) {
                    var printCheck = "printCheck = window.open('" + nlapiResolveURL('SUITELET', 'customscript326', 'customdeploy1') + "&formtype=" + newType + "&internalId=" + newId + "&bank=" + bank + "&l=t', 'printCheck', 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printCheck.focus();";
            		form.addButton("custpage_printCheck", "Print Check", printCheck);
                  }
                } else {
                  	var printCheck = "printCheck = window.open('" + nlapiResolveURL('SUITELET', 'customscript326', 'customdeploy1') + "&formtype=" + newType + "&internalId=" + newId + "&bank=" + bank + "&l=t', 'printCheck', 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printCheck.focus();";
            		form.addButton("custpage_printCheck", "Print Check", printCheck);
                }
           } else {
              	var printCheck = "printCheck = window.open('" + nlapiResolveURL('SUITELET', 'customscript326', 'customdeploy1') + "&formtype=" + newType + "&internalId=" + newId + "&bank=" + bank + "&l=t', 'printCheck', 'height=1056, width=1100, resizable=yes, scrollbars=yes, toolbar=no'); printCheck.focus();";
            	form.addButton("custpage_printCheck", "Print Check", printCheck);
            }
            
        }

    } catch (e) {
        if (e instanceof nlobjError) {
            nlapiLogExecution('DEBUG', 'beforeLoad', e.getCode() + '\n' + e.getDetails());
        }
        else {
            nlapiLogExecution('DEBUG', 'beforeLoad - unexpected', e.toString());
        }
    }

}