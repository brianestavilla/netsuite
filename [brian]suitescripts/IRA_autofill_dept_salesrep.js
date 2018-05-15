/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Jul 2016     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum){
	if(name=='entity' || name=='class') {
		setDepartmentAndSalesMan();
	}
}

function saveRecordDMPIValidation() {
  var dmpi_reason_checker = 0;

  if(nlapiGetRole() != 3) {
       if(/DMPI/i.test(nlapiGetFieldText('class'))) {
         var loc = nlapiGetFieldText('location');
          for(var i=1; i<= nlapiGetLineItemCount('item'); i++) {
              if(!(/DMPI/i.test(nlapiGetLineItemText('item','custcol35',i)))) {
                  dmpi_reason_checker = 1;
              }

            if(!(/QRTN/i.test(loc))) {
              if((/DMPI/i.test(nlapiGetLineItemText('item','custcol35',i)))) {
                var return_type = nlapiGetLineItemText('item','custcol35',i).split('_'); //['DMPI','BO','WEEVILS','38']
                var re = new RegExp(return_type[1], 'i');
                if(!(re.test(loc))) { dmpi_reason_checker = 1; }
              }
            }
          }

          if(dmpi_reason_checker != 0) {
            alert("One or More Item(s) is using a wrong reason code. Please Choose the Reason that has DMPI Prefix and Check the Type of Return and use the reason code that corresponds to the type of return.");
            return false;
          }
      }
  }

  return true;

}

function validateLineDMPIValidation(type) {
  if(nlapiGetRole() == 3) {
    if(/DMPI/i.test(nlapiGetFieldText('class'))) {
        if(!(/DMPI/i.test(nlapiGetCurrentLineItemText('item','custcol35')))) {
           alert("One or More Item(s) is using a wrong reason code. Please Choose the Reason that has DMPI Prefix and Check the Type of Return and use the reason code that corresponds to the type of return.");
              return false;
        }

        if((/DMPI/i.test(nlapiGetCurrentLineItemText('item','custcol35')))) {
           if(!(/QRTN/i.test(nlapiGetFieldText('location')))) {
                 var return_type = nlapiGetCurrentLineItemText('item','custcol35').split('_'); //['DMPI','BO','WEEVILS','38']
                 var re = new RegExp(return_type[1], 'i');
                 if(!(re.test(nlapiGetFieldText('location')))) {
                   alert("One or More Item(s) is using a wrong reason code. Please Choose the Reason that has DMPI Prefix and Check the Type of Return and use the reason code that corresponds to the type of return.");
                    return false;
                 }
           }
        }
    }
  }
  return true;
}

function setDepartmentAndSalesMan() {
	var customer = nlapiGetFieldValue('entity');
	var principal = nlapiGetFieldValue('class');
	
	if(customer!='' && principal!='') {
		
		filter = new Array(
				new nlobjSearchFilter('custrecord152', null, 'anyof', customer),
				new nlobjSearchFilter('custrecord153', null, 'anyof', principal)
		);
		columns = new nlobjSearchColumn('custrecord340'); //Sales Rep Column
		
		var creditLimit = nlapiSearchRecord('customrecord150', null, filter, columns);
		if(creditLimit != null && creditLimit[0].getValue('custrecord340')!='') {
			nlapiSetFieldValue('salesrep', creditLimit[0].getValue('custrecord340'));
			nlapiSetFieldValue('department', nlapiLookupField('employee', creditLimit[0].getValue('custrecord340'),'department', false));	
		}
	}
}

function IRA_pageinit(type) {
	if(type == 'create') {
		nlapiSetFieldValue('custbody8',nlapiGetUser());
    }
}