/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       03 Mar 2017     BRIAN
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
	
/**
** ** SAVE SEARCHES, CUSTOM RECORD, CUSTOM FIELD/COLUMNS **
**  	customsearch1869 = ACCRUED JOURNAL ENTRY
**		customsearch1873 = TO RECORD ACCRUAL REMINDER
**		customrecord427 = ACCRUAL EXPENSE RECORD
**		custcol42 = JE REFERENCE NO. COLUMN
**/

var globaldata = [];
var journalentries = [];
var entity = nlapiGetFieldValue('entity'),
principal = nlapiGetFieldValue('class'),
loc = nlapiGetFieldValue('location'),
taxcode = 6, contexttype = '';
var vendor_cats = ['10','27','21','20']; // 10 = employee; 27 = bank; 21 = branch; 20 = manpower;

function pageInitAccrued(type) {
  contexttype = type;
  if(nlapiGetRole() != 3) { nlapiDisableLineItemField('expense', 'custcol42', true) };
}

function validateLineAccrued(type) {
	
	/** TRIGGER SCRIPT IF FORM IS NONTRADE **/
	if(nlapiGetRole() != 3) {
      if(contexttype == 'create') {
        if(type == 'expense') {
              if(/nontrade/i.test(nlapiGetFieldText('customform'))) {
                var je_ref = nlapiGetCurrentLineItemValue('expense','custcol42');
                if(je_ref != '') {
                    var current_amt = nlapiGetCurrentLineItemValue('expense','amount');
                    var account = nlapiGetCurrentLineItemValue('expense','account');
                    var rec = nlapiLoadRecord('journalentry', je_ref);
                    var je_remaining_amt = rec.getFieldValue('custbody219');
                    var total_apv_amt = 0;

                    for (var i = 1; i <= nlapiGetLineItemCount('expense'); i++) {
                      if(/accrued/i.test(nlapiGetLineItemText('expense','account',i))) {
                        if(nlapiGetLineItemValue('expense','custcol42',i) == je_ref) { total_apv_amt += parseFloat(nlapiGetLineItemValue('expense','amount',i)); }
                      }
                    }

                    //if(parseFloat(parseFloat(current_amt) + total_apv_amt) > je_remaining_amt) {
                    //    alert('Amount should not greater than the JE amount');
                    //    return false;
                    //}

                }
            }
      	  }
   		}
    }
	
	
	return true;
}

function validateDeleteAccrued(type) {
  if(nlapiGetRole() != 3) {
    if(contexttype == 'edit') {
      if(type == 'expense') {
        if(/nontrade/i.test(nlapiGetFieldText('customform'))) {
          if(/accrued/i.test(nlapiGetCurrentLineItemText('expense','account')) && nlapiGetCurrentLineItemValue('expense','custcol42') != '') {
            alert('Cannot Delete Reversal of Accrued JE. Please contact administrator for assistance.');
            return false;
          }
      	}
      }
    }
}

  return true;

}

function clientFieldChangedAccrued(type, name, linenum) {
	if(name == 'class' || name == 'entity' || name == 'location') {
		
      entity = nlapiGetFieldValue('entity');
      principal = nlapiGetFieldValue('class');
      loc = nlapiGetFieldValue('location');

  	  /** TRIGGER SCRIPT IF FORM IS NONTRADE **/
      if(/nontrade/i.test(nlapiGetFieldText('customform'))) {
        if(entity != '' && principal != '' && loc != '') {
          var rec = nlapiLoadRecord('vendor', entity);
          taxcode = rec.getFieldValue('taxitem');

          getJE(entity, principal, loc);
        }
      }
      
	}
}

function saveRecordAccrued() {
	
	/** TRIGGER SCRIPT IF FORM IS NONTRADE **/
  if(nlapiGetRole() != 3) {
      if(contexttype == 'create') {
            if(/nontrade/i.test(nlapiGetFieldText('customform'))) {
                var flag=0;
                var vendor_category = nlapiLookupField('vendor', nlapiGetFieldValue('entity'), 'category', false);
              
                /** VENDOR CATEGORY SHOULD NOT BE EMPLOYEE, BANK, BRANCH **/
                if(vendor_cats.indexOf(vendor_category) == -1) {

                    /** CHECK IF THERE IS AN ACCRUAL ENTRY THAT NEEDS TO BE REVERSE **/
                    if(globaldata.length > 0) {
                      for(var i=1; i<=nlapiGetLineItemCount('expense'); i++) {
                          for(var j=0; j<globaldata.length; j++) {
                              if(nlapiGetLineItemValue('expense','custcol42',i) == globaldata[j].internalid) {
                                  flag += 1;
                              } //endif
                          } //endfor
                      } //endfor

                      if(flag == 0) {
                          alert('Kindly Reverse Accrued Journal Entries.');
                          return false;
                      } //endif
                      
                    } //endif


                } //endif

            } //endif
      }
  }
  	/*** Added By Brian; 2/21/2018; Validate WH Tax Code Choosen ***/
	if(nlapiGetFieldValue('custpage_4601_witaxcode') != '') {
      var conf = confirm('WH Tax Code Choosen is: '+nlapiGetFieldText('custpage_4601_witaxcode')+'. is this correct? if YES then click OK, if not then click CANCEL.');
      if(conf) { return true; } else { return false; }
    } else {
      var conf = confirm('No WH Tax Code Choosen. Are you sure about this? if YES then click OK, if not then click CANCEL and add WH Tax code.');
      if(conf) { return true; } else { return false; }
    }
	/************ END ************/

  	if(nlapiGetFieldValue('customform') == 138 && nlapiGetFieldValue('custbody62') == 2 &&
       nlapiGetFieldValue('custbody51') == 8 || nlapiGetFieldValue('custbody51') == 3 ||
       nlapiGetFieldValue('custbody51') == 13) {
		var employee_counter = 0, account_counter = 0, error_message = 'No Account Found for the Following Payee. ';
        if(nlapiGetLineItemCount('expense') != 0) {
	        for(var i = 1; i<=nlapiGetLineItemCount('expense'); i++) {
				var vend = nlapiGetCurrentLineItemValue('expense','custcol31');
              	if(vend == '' || vend == 'null') {
					employee_counter += 1;
				} else {
					var empacc = nlapiLookupField('vendor',vend, 'custentity9', false);
                    if(empacc == 'null' || empacc == '' || empacc == 'undefined') {
                      account_counter += 1;
                      error_message = error_message + nlapiGetCurrentLineItemText('expense','custcol31')+', ';
                    }
                }
        	}

            if(employee_counter != 0) {
              alert('One or more Employee Field is empty. Please Fill it up.');
              return false;
            }

          	if(account_counter != 0) {
              alert(error_message);
              return false;
            }
        }
    }

  return true;

}

function getJE(entity, principal, location) {
  //if(nlapiGetFieldValue('entity') != '' || nlapiGetFieldValue('entity') != null) {
    //var vendor_category = nlapiLookupField('vendor', nlapiGetFieldValue('entity'), 'category');
   	//var arr_cats = ['10','27','21','5']; // 10 = employee; 27 = bank; 21 = branch; 5 = trade supplier;
              
    /** VENDOR CATEGORY SHOULD NOT BE EMPLOYEE, BANK, BRANCH **/
    //if(vendor_cats.indexOf(vendor_category) == -1) {
      
	var data_arr = [];
	var columns = [
	   new nlobjSearchColumn('internalid'),
	   new nlobjSearchColumn('tranid'),
	   new nlobjSearchColumn('trandate'),
	   new nlobjSearchColumn('account'),
	   new nlobjSearchColumn('amount'),
	   new nlobjSearchColumn('custbody219')
	];
	
	var filters = [
	  new nlobjSearchFilter('entity', null, 'anyof', entity),
	  new nlobjSearchFilter('class', null, 'anyof', principal),
	  new nlobjSearchFilter('location', null, 'anyof', location),
	  new nlobjSearchFilter('reversaldate', null, 'isempty','@NONE@'),
	  new nlobjSearchFilter('isreversal', null, 'is','F'),
      new nlobjSearchFilter('custbody219', null, 'greaterthan', 0),
	  new nlobjSearchFilter('custbody211', null, 'is', 'F'), //not rejected
      new nlobjSearchFilter('status', null, 'is', 'Journal:B'), //approved
	  new nlobjSearchFilter('trandate', null, 'after', '4/1/2017')];
	
	var result =  nlapiSearchRecord(null, 'customsearch1869', filters, columns);
	
	if(result != null) {
		var select = document.getElementById('selectbxx');
		while (select.firstChild) { select.removeChild(select.firstChild); };
		
		var option = document.createElement('option');
		option.text = ' ';
		option.style = 'padding-top:5px;';
		option.value = 0;
		select.add(option);
		
		for(var i=0; i<result.length; i++) {
          if(!(/memorized/i.test(result[i].getValue('tranid')))) {
              data_arr.push({
                  'internalid' : result[i].getValue('internalid'),
                  'tranid' : result[i].getValue('tranid'),
                  'account' : result[i].getValue('account'),
                  'amount' : result[i].getValue('amount'),
  				  'custbody219' : result[i].getValue('custbody219') //accrued total amount remaining
              });

              journalentries.push(result[i].getValue('internalid'));

              var option = document.createElement('option');
              option.text = 'JE#'+result[i].getValue('tranid') + ' - Php '+result[i].getValue('custbody219') + ' - '+result[i].getValue('trandate');
              option.value = result[i].getValue('internalid');
              if(i!=0) option.style = 'padding-top:5px;';
              select.add(option);
      	  	}
		}
		
	} else {
		var select = document.getElementById('selectbxx');
		while (select.firstChild) { select.removeChild(select.firstChild); };
	}
	
	globaldata = data_arr;
    //}
  //}
}

function getJELineItems(data) {
   // if(nlapiGetFieldValue('entity') != '' || nlapiGetFieldValue('entity') != null) {
   // var vendor_category = nlapiLookupField('vendor', nlapiGetFieldValue('entity'), 'category');
    //var arr_cats = ['10','27','21','5']; // 10 = employee; 27 = bank; 21 = branch; 5 = trade supplier;
      
    /** VENDOR CATEGORY SHOULD NOT BE EMPLOYEE, BANK, BRANCH **/
    //if(vendor_cats.indexOf(vendor_category) == -1) {
      for(var j=1; j<=nlapiGetLineItemCount('expense'); j++) { nlapiRemoveLineItem('expense', j); }
      for(var i=1; i<=nlapiGetLineItemCount('expense'); i++) { nlapiRemoveLineItem('expense', i); }
      for(var k=1; k<=nlapiGetLineItemCount('expense'); k++) { nlapiRemoveLineItem('expense', k); }

      var columns = [
         new nlobjSearchColumn('internalid'),
         new nlobjSearchColumn('tranid'),
         new nlobjSearchColumn('account'),
         new nlobjSearchColumn('amount'),
  	   	 new nlobjSearchColumn('custbody219'), // accrued total amount remaining
         new nlobjSearchColumn('class'),
         new nlobjSearchColumn('department'),
         new nlobjSearchColumn('location'),
      ];

      var filters = new nlobjSearchFilter('internalid', null, 'anyof', data);
      var result =  nlapiSearchRecord('journalentry', null, filters, columns);
      if(result != null) {
          for(var k=0; k<result.length; k++) {

              if(/accrued/i.test(result[k].getText('account'))) {
                  nlapiSelectNewLineItem('expense');
                  nlapiSetCurrentLineItemValue('expense', 'amount', result[k].getValue('custbody219'), true, true);	
                  nlapiSetCurrentLineItemValue('expense', 'account', result[k].getValue('account'), true, true);
                  nlapiSetCurrentLineItemValue('expense', 'taxcode', taxcode, true, true); //S_PH = 6;
                  nlapiSetCurrentLineItemValue('expense', 'custcol42', result[k].getValue('internalid'), true, true);
                  nlapiSetCurrentLineItemValue('expense', 'memo', 'JE#'+result[k].getValue('tranid'), true, true);
                  nlapiSetCurrentLineItemValue('expense', 'class', result[k].getValue('class'), true, true);
                  nlapiSetCurrentLineItemValue('expense', 'department', result[k].getValue('department'), true, true);
                  nlapiSetCurrentLineItemValue('expense', 'location', result[k].getValue('location'), true, true);
                  nlapiCommitLineItem('expense');
              }

          }
      }
	//}
//}
}

/*******************************************/
/************* JAVASCRIPT CODE *************/
/*******************************************/
if(/nontrade/i.test(nlapiGetFieldText('customform'))) {    
    jQuery("<br/> <span id='custbody218_lbl_uir_label' class='smallgraytextnolink uir-label '> <span class='smallgraytextnolink'>ACCRUED EXPENSE</span><br/> <select name='selectbxx' id='selectbxx' multiple style='width:280px; margin-bottom:10px;'></select></span>").insertAfter('#class_fs');
}


if(entity != '' && principal != '' && loc != '') {
	if(/nontrade/i.test(nlapiGetFieldText('customform'))) {
		getJE(entity, principal, loc);
	}
}

jQuery("#selectbxx").change(debounce(function (event) {
	var selected = [];
	event.preventDefault();	
	
	jQuery("#selectbxx option:selected").each(function() {
	    selected.push(jQuery(this).val());
	});

	getJELineItems(selected);
}, 1000));

jQuery("cancelbill").removeAttr('onclick');

jQuery('#cancelbill').click(function(event) {
	var conf = confirm('Are you sure you want to cancel this Bill? ');
  	if(conf) {
		url = 'https://rest.na2.netsuite.com/app/site/hosting/restlet.nl?script=698&deploy=1';
		nlapiRequestURL(url+'&id='+nlapiGetRecordId(), null, header(),null,null);

       var ret_Val = nlapiRequestURL(url+'&id='+nlapiGetRecordId(), null, header(),null,null); //added 10/12/17 chiboi
		 var data = JSON.parse(ret_Val.getBody());
      		if (data.code == 404){
              nlapiCreateError('Error',data.message, true);
              return false;
            } else {
	  		  cancel_approve_order(nlapiGetRecordId(),'cancel');
  			  return false;
            }

      	/** STANDARD FUNCTION OF CANCEL BUTTON **/
	  	/**cancel_approve_order(nlapiGetRecordId(),'cancel');
  		return false;**/
      	/** END STANDARD FUNCTION **/

    } else { return false; }
});

function header() {
	return {
		"User-Agent-x": "SuiteScript-Call",
        "Authorization": "NLAuth nlauth_account=3625074, nlauth_email=brianestavilla@gmail.com, nlauth_signature=March21993, nlauth_role=3",
        "Content-Type": "application/json"
    };
}

/****** GET DATA IF IDLE AT A GIVEN SECONDS ******/
function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}