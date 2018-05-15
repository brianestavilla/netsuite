/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Jul 2014     Redemptor
 *
 */

var record = nlapiGetNewRecord();

//journal entry fields
var fld_name = 'custbody112';
//var fld_linkfrom = 'custbody200';
var fld_linkfrom = 'custbody210';

//vendor bill
var fld_liquidated = 'custbody197';
var fld_journalentryref = 'custbody198';

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function userEventBeforeLoadJELoadAPV(type, form, request){
	try {
		var billid = request.getParameter('billid');
      	//var params_data = request.getParameter('compid').split('?'), //compid=3625074?billid=4836216
        //bill_data = params_data[1].split('='), // billid=4836216
        //billid = bill_data[1]; //4836216

		if(billid != null) {
			nlapiSetFieldValue(fld_name, nlapiLookupField('vendorbill', billid, 'entity'));
			nlapiSetFieldValue(fld_linkfrom, billid);
		}

	} catch(e) {}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmitJELoadAPV(type){
	if(type == 'create'){
		try{
			var billid = record.getFieldValue(fld_linkfrom);
			var fldNames = [fld_liquidated, fld_journalentryref];
			var fldValues = ['T', record.getId().toString()];
			
			if(billid != ''){ nlapiSubmitField('vendorbill', billid, fldNames, fldValues); }
		}catch(e){}
	}
}


/**
**	User Event - Before Submit
**	Added by Brian 5/5/2017
**	Compute Accrued Total Amount
**/
function beforeUserSubmitJELoadAPV(type) {
    var rec = nlapiGetNewRecord();

  /** TRIGGER UPON EDITTING **/
  if(rec.getFieldValue('approved') == 'F' && rec.getFieldValue('custbody210') == '') {
      var tot_accrued_amt = 0;
      for(var i = 1; i<=rec.getLineItemCount('line'); i++) {
        if(/accrued/i.test(rec.getLineItemText('line','account',i))) {
          tot_accrued_amt += parseFloat(rec.getLineItemValue('line','credit',i)) || parseFloat(rec.getLineItemValue('line','debit',i));
        }
      }
      rec.setFieldValue('custbody219',tot_accrued_amt);
  }

}
