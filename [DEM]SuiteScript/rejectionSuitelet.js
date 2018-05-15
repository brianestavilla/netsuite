/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Apr 2014     Redemptor
 *
 */

var vendorbill_fld_approvalstatus = 'approvalstatus';
var vendorbill_fld_nextapproverrole = 'custbody17';
var vendorbill_fld_reasonforrejection = 'custbody25';

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
	
	if(request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Reject');
		form.addSubmitButton('Submit');
		form.addField('txtreason', 'textarea', 'Reason for Rejection', null, null).setMandatory(true);
		var fieldInternalid = form.addField('txtinternalid', 'text', '');
			fieldInternalid.setDefaultValue(request.getParameter('internalid'));
			fieldInternalid.setDisplayType('hidden');
		var fieldRecordType = form.addField('txtrecordtype', 'text', '');
			fieldRecordType.setDefaultValue(request.getParameter('recordtype'));
			fieldRecordType.setDisplayType('hidden');
		
		response.writePage(form);
	}else{
		var internalid = request.getParameter('txtinternalid');
		var recordType = request.getParameter('txtrecordtype');

		switch(recordType){
		case 'vendorbill' :
			var fields = [vendorbill_fld_approvalstatus,
			              vendorbill_fld_nextapproverrole,
			              vendorbill_fld_reasonforrejection
			              ];
			var fieldValues = ['3',
			                   '',
			                   request.getParameter('txtreason') + ' - ' + 
				                   nlapiLookupField('employee', nlapiGetUser(), 'entityid')
			                   ];
			nlapiSubmitField(recordType, internalid, fields, fieldValues);
			break;
		}
		response.sendRedirect('RECORD', recordType, internalid, false);
	}
}
