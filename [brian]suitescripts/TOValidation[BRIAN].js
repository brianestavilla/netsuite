/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Oct 2015     Dranix
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
function clientFieldChangedValidation(type, name, linenum) {
	if(nlapiGetFieldValue('customform')=='142' || nlapiGetFieldValue('customform')=='171') { // FORM : 142 = DDI T.O - Van Loading, 171 = DDI T.O - Van Return
		
		if(name=='custbody172') {
			var salesman = nlapiGetFieldValue('custbody172');
			var location = nlapiLookupField('customer', nlapiGetFieldValue('custbody172'), 'custentity48', false); //reporting branch
			//var location = nlapiGetFieldValue('custbody145');
			var principal = nlapiGetFieldValue('class');
			
			//nlapiSetFieldValue('custbody145',(location!=null || location!='') ? location : ''); //set reporting branch
			if(location!=null || location!='') {
				var filters = new Array(
					new nlobjSearchFilter('custrecord29', null, 'anyof', salesman),
					new nlobjSearchFilter('custrecord754', null, 'anyof', location),
					new nlobjSearchFilter('custrecord30', null, 'anyof', principal)
				);
			
				var columns = new nlobjSearchColumn('custrecord_disc_prin_operation'); //operation
				
				var operation = nlapiSearchRecord('customrecord110', null, filters, columns); // discounting per principal operation
				nlapiSetFieldValue('custbody69',(operation!=null) ? operation[0].getValue('custrecord_disc_prin_operation') : '4');
				nlapiDisableField('custbody69', true);

			} else {
				alert('Kindly Setup Reporting Branch for this Salesman');
			}
		
		}
	}
}

function pageinitValidation(type) {
  	if(type == 'create') {
		nlapiSetFieldValue('custbody145', nlapiLookupField('employee', nlapiGetUser(), 'custentity49'));
    }
/**** added 10/05/2017 - richie *****/
  var arr = {
      "DDI T.O - InterBranch": 1,
      "DDI T.O - Good to BO": 2,
      "DDI T.O - Van Loading": 3,
      "DDI T.O - Mother Sim to IOTA": 4, //deactivated
      "DDI T.O - Van Returns": 5,
      "DDI T.O - Warehouse Transfer": 6,
      "DDI T.O - GOOD to FREE/BTDT": 7, //DDI T.O - GOOD to FREEGOODS < sanbox name
      "DDI T.O - Free to Good/B.O/Qrtn": 8
    };
	  nlapiSetFieldValue('custbody46', arr[ nlapiGetFieldText('customform') ]);

}