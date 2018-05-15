/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Nov 2017     DRANIX_JOHN
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
// AR role = 1054 : BFS role = "1037"
function myBeforeLoadbillingdate(type, form, request)
{
	var roleID = nlapiGetContext().getRole();
	var deliverd = nlapiGetFieldValue('custbody_tt_delivered_field');
	var bill_Date = nlapiGetFieldValue('custbody220');
    if(type == 'view')
    {
        if(roleID == "1054" || roleID == "3" || roleID == "1037")
        {
            if(deliverd == "F" && bill_Date == null || bill_Date == "")
            {
              form.addButton('custpage_btnbillingdate','Billing Date','client_btnbillingdate()');
              form.setScript('customscript750');
            }
            else
            {
              if(roleID == "3")
              {
                form.addButton('custpage_btnbillingdate','Billing Date','client_btnbillingdate()');
                form.setScript('customscript750');
              }
              else
              {
                form.setScript('customscript750');
              }
            }
        }
    }
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
function userEventAfterSubmitbillingdate(type)
{
  	nlapiLogExecution('ERROR','CONTEXT', nlapiGetContext().getExecutionContext());
	var recID = nlapiGetRecordId();
	var billdate = nlapiLookupField('invoice', recID, 'custbody220', false);
	if(billdate!="")
	{
		var payterm = nlapiLookupField('invoice', recID, 'terms', true);
		var intTerm = '';
			if (payterm=="COD" || payterm=="CWO")
			{
				intTerm = 0;
		    	getdate(billdate, intTerm, recID);
			}
			else if (payterm=="PDC 30 days")
			{
				intTerm = 30;
		    	getdate(billdate, intTerm, recID);
			}
			else if (payterm=="PDC 45 Days")
			{
				intTerm = 45;
				getdate(billdate, intTerm, recID);
			}
			else
			{
        		if(payterm=="" || payterm==null){payterm='COD'}
				var stringArray = new Array();
				var string = payterm.split(" ");
				for(var i =0; i < string.length; i++)
				{
				    stringArray.push(string[i]);
				    if(i != string.length-1)
				    {
				        stringArray.push(" ");
				        intTerm =stringArray.join("");
				        getdate(billdate, intTerm, recID);
				    }
				}
			}
	}
	else
	{
		nlapiSubmitField('invoice', recID, 'custbody_tt_delivered_field', 'F');
	}
}

function getdate(sdate, addDays, id)
{
	var newdate = new Date(sdate);

    newdate.setDate(newdate.getDate() +  parseFloat(addDays));

    var dd = newdate.getDate();
    var mm = newdate.getMonth() + 1;
    var y = newdate.getFullYear();

	var FormattedDate = mm + '/' + dd + '/' + y;
	nlapiSubmitField('invoice', id, 'duedate', FormattedDate);
	nlapiSubmitField('invoice', id, 'custbody_tt_delivered_field', 'T');
}
