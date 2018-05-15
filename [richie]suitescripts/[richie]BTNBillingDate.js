/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 Nov 2017     DRANIX_JOHN
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */

function client_btnbillingdate(type, form)
{
	var getrec = nlapiGetRecordId();
	var datenow = new Date();
	var formatted = (datenow.getMonth()+1) + '/' + datenow.getDate() + '/' + datenow.getFullYear();
	var res = prompt('Date : Note: Format for date MM/DD/YYYY', formatted);
	
	nlapiSubmitField('invoice', getrec, 'custbody220', res);
	location.reload();
}

//AR role = 1054 : BFS role = "1037"
var roleID = nlapiGetContext().getRole();
var rec_tranID = nlapiGetFieldValue('tranid');
if(roleID == 1054 || roleID == 1037)
{
	if(rec_tranID != "To Be Generated")
	{
		jQuery("#tbl_edit").hide(); //edit button
		jQuery("#tbl_secondaryedit").hide(); //secondary edit button
		jQuery("#tbl__back").hide(); //hide back button
		jQuery("#tbl_secondary_back").hide(); //secondary back button
		jQuery(".pgBntY.pgBntB ").hide(); //save & drop-down button
		//jQuery("#spn_multibutton_submitter").hide(); //hide save button
		//jQuery("#tdbody_resetter").hide(); //reset button
		//jQuery("#tdbody__cancel").hide(); //cancel button
		//jQuery(".uir-header-buttons").hide(); //all table row
	}
}

function pageinit() {
  nlapiDisableField('custbody220',true);
}