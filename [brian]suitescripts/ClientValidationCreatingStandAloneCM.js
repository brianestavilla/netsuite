/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Sep 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function standAloneCM_saveRecord(){
	var userrole = nlapiGetRole();

	if(nlapiGetRecordId() == '' || nlapiGetRecordId() == null) {
	
		/**
		 * 1054 - Accounts Receivable Clerk
		 * 1089 - Encoder
		 * 1081 - Jobber Fund Clerk
		 */
	
		if(userrole == 1054 || userrole == 1089 || userrole == 1081) {
			if(nlapiGetFieldValue('createdfrom') == '' || nlapiGetFieldValue('createdfrom') == null) {
				alert('Please Refrain from creating Stand Alone Credit Memo Transaction. Kindly Choose Draft Credit Memo Transaction');
				return false;
			}
		}
		
	}
	
    return true;
}
