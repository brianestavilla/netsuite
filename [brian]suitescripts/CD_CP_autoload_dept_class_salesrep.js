/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Jun 2016     Dranix
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
function CD_CP_AutoLoad_userEventBeforeLoad(type, form, request) {
	if(type=='create') {
		if(nlapiGetRecordType()=='deposit') {
			//RECORD IS DEPOSIT
			if(nlapiGetRole() != 3) {
              	var currentuser = nlapiGetUser();
                var principal = nlapiLookupField('employee', currentuser, 'class', false);
                var department = nlapiLookupField('employee', currentuser, 'department', false);
                var reportingbranch = nlapiLookupField('employee', currentuser, 'custentity49', false);

                if(department!='') nlapiSetFieldValue('department', department);
                if(principal!='') nlapiSetFieldValue('class', principal);
                if(reportingbranch!='') nlapiSetFieldValue('location', reportingbranch);

                //1452 = CEBU : TAGUNOL
                //1745 = CENTRAL : CEBU : TAGUNOL 
                if(nlapiGetFieldValue('location') == 1452 || nlapiGetFieldValue('location')==1745) {
                    nlapiSetFieldValue('account', 1377); // 1377 = mbtc 7028-51712-9
                }
            }
          
		} else {
			// RECORD IS CUSTOMER DEPOSIT, CUSTOMER PAYMENT
			
			if(nlapiGetRole() != 3) { // User Role should not be Administrator
				var customer = request.getParameter('entity') || '';
              	var location = nlapiLookupField('employee', nlapiGetUser(), 'location', false) || ''; // location/branch assigned;
				var principal = nlapiLookupField('employee', nlapiGetUser(), 'class', false) || ''; // principal;
				
				if(location!='') nlapiSetFieldValue('location', location);
				if(principal!='') nlapiSetFieldValue('class', principal);
				
				if(customer != '' && principal != '') {
					var filter = [
                      new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
                      new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
					];
					
					var columns = new nlobjSearchColumn('custrecord340'); //Sales Rep Column
				
					var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
					if(creditLimit!=null && creditLimit[0].getValue('custrecord340')!='') {
						var department =  nlapiLookupField('employee', creditLimit[0].getValue('custrecord340'), 'department', false) || 1019;

						nlapiSetFieldValue('custbody186',creditLimit[0].getValue('custrecord340'));
						nlapiSetFieldValue('department', department);
					}
				}
			}

		}
	}
}


function depositAfterSubmit(type) {
  var record = nlapiGetNewRecord();
  if(record.getRecordType() == 'deposit') {
    for(var i=1; i<=record.getLineItemCount('payment'); i++) {
      if(record.getLineItemValue('payment','deposit',i) == 'T'){
          try {
              nlapiSubmitField('customerpayment', record.getLineItemValue('payment','id',i), 'custbody216', record.getId());
          } catch(err){
              nlapiSubmitField('customerdeposit', record.getLineItemValue('payment','id',i), 'custbody216', record.getId());
          }
      }
    }
  }
}
