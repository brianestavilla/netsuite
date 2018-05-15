/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Apr 2014     Redemptor
 *
 */

var fld_customForm = 'customform';
var fld_nontradeSubtype = 'custbody51';
var fld_liquidated = 'custbody197';
var fld_name = 'entity';
var fld_linkfrom = 'custbody198';
var fld_location = 'location';
var fld_principal = 'class';
var fld_department = 'department';
var fld_billtype = 'custbody62';

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord Vendor Bill
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */

function userEventAfterSubmitCA(type){

	var record = nlapiGetNewRecord();
  
  	if(type=='create' || type=='edit') {
      var columns = [
           new nlobjSearchColumn('internalid'),
           new nlobjSearchColumn('tranid'),
           new nlobjSearchColumn('trandate'),
           new nlobjSearchColumn('account'),
           new nlobjSearchColumn('amount'),
           new nlobjSearchColumn('debitamount'),
           new nlobjSearchColumn('creditamount'),
	       new nlobjSearchColumn('custcol_4601_witaxapplies'),
	       new nlobjSearchColumn('custcol_4601_witaxcode'),
	       new nlobjSearchColumn('custcol_4601_witaxrate'),
	       new nlobjSearchColumn('custcol_4601_witaxcode_exp'),
	       new nlobjSearchColumn('custcol_4601_witaxrate_exp')
		];

      var filters = [
        new nlobjSearchFilter('internalid', null, 'anyof', record.getId()),
        new nlobjSearchFilter('mainline', null, 'is', 'F')
      ];
      var result =  nlapiSearchRecord('vendorbill',null, filters, columns);
      var wh_tax_amt = 0, input_tax = 0, base_amt = 0, taxcode='', taxrate='';
      if(result != null) {
        	for(var i in result) {
                if(/Withholding Tax/i.test(result[i].getText('account'))) {
                  var debit=0, credit=0;
                  if(result[i].getValue('debitamount') != '') {
                     debit = result[i].getValue('debitamount');
                  } else {
                    credit = parseFloat(result[i].getValue('creditamount') * -1);
                  }

                 //wh_tax_amt += parseFloat(result[i].getValue('amount'));
                  wh_tax_amt += parseFloat(debit + credit);

                } else if(/Input Tax/i.test(result[i].getText('account'))) { input_tax+=parseFloat(result[i].getValue('amount')); }

              	if(result[i].getValue('custcol_4601_witaxapplies') == 'T') { base_amt+=parseFloat(Math.abs(result[i].getValue('amount'))); }

              	if(result[i].getValue('custcol_4601_witaxcode') != '' || result[i].getValue('custcol_4601_witaxcode_exp') != '') {
                  taxcode = (result[i].getValue('custcol_4601_witaxcode') != '') ? result[i].getValue('custcol_4601_witaxcode') : result[i].getValue('custcol_4601_witaxcode_exp');
                }

              	if(result[i].getValue('custcol_4601_witaxrate') != '' || result[i].getValue('custcol_4601_witaxrate_exp') != '') {
                  taxrate = (result[i].getValue('custcol_4601_witaxrate') != '') ? result[i].getValue('custcol_4601_witaxrate') : result[i].getValue('custcol_4601_witaxrate_exp');
                }
            }
        nlapiSubmitField('vendorbill', record.getId(), ['custbody223','custbody222_2','custbody224','custbody225','custbody226'], [input_tax, wh_tax_amt, base_amt, taxcode, taxrate]);
      }

    }

	if(type == 'create'){
		var irNo = record.getFieldValue('custbody95');
		var poNo = record.getFieldValue('custbody121');
		
		var billid = record.getFieldValue(fld_linkfrom);
		var fldNames = [fld_liquidated, fld_linkfrom];
		var fldValues = ['T', record.getId().toString()];
		
		try{
			if(irNo != ""){
				nlapiSubmitField('itemreceipt', irNo, 'custbody92', 'T');
			}
			
			if(poNo != ""){
				nlapiSubmitField('purchaseorder', poNo, 'custbody92', 'T');
			}
		}catch(e){}
		
		
		if(billid != ''){
			nlapiSubmitField('vendorbill', billid, fldNames, fldValues);
			nlapiSubmitField('vendorbill', record.getId(), fld_linkfrom, '');
		}
	}
	
//  if(/tagunol/i.test(record.getFieldText('location'))) {
	  
	  /**
	  ** 10/9/2017 by BRIAN; 
	  ** This script is deployed in Tagunol Site for test;
	  ** To be run on all sites once the test is successful;
	  **/
	  
	  /**
	  ** Update JE if the APV is Approved;
	  **/
	  
	  var je_objects = [];
	  
	  if(record.getFieldValue('approvalstatus') == 2) { //approved
		for(var i=1; i<=record.getLineItemCount('expense'); i++) {
			if(/accrued/i.test(record.getLineItemText('expense','account',i))) {
				if(record.getLineItemValue('expense','custcol42',i) != null) {
					
					var found = je_objects.some(function (res) {
				      return res.je_id === record.getLineItemValue('expense','custcol42',i);
				    });
						
					if (!found) {
					//HAVEN'T FOUND IT :(
						je_objects.push({
							'je_id' : record.getLineItemValue('expense','custcol42',i),
							'je_amt' : parseFloat(record.getLineItemValue('expense','amount',i))
						});
					} else {
						//FOUND IT :)
						for(var k in je_objects) {
							if(record.getLineItemValue('expense','custcol42',i) == je_objects[k].je_id) {
								je_objects[k].je_amt += parseFloat(record.getLineItemValue('expense','amount',i));
								break;
							}
						}
					}

				}
			}
		}

		if(je_objects.length != 0){
			  for(var p in je_objects) {
				  var jes = nlapiLookupField('journalentry', je_objects[p].je_id, ['custbody219','custbody210'], false);
					var arr_refs = jes.custbody210.split(',');
					var id = record.getId();
					id = id.toString();

					if(arr_refs.indexOf(id) == -1) {
						arr_refs.push(id);

						/** CHECK IF THERE IS AN EMPTY VALUE IN THE ARRAY **/
						var index = arr_refs.indexOf('');

						/** REMOVE EMPTY VALUES IN THE ARRAY **/
						if(index > -1) { arr_refs.splice(index, 1); }
						var je_remaining_amt = parseFloat(jes.custbody219);
						nlapiSubmitField('journalentry', je_objects[p].je_id,['custbody219','custbody210'],[parseFloat(je_remaining_amt - je_objects[p].je_amt), arr_refs]);

					}

			  }
		  }

	  } // END APPROVED STATUS CONDITION

	  /** STATUS IS PENDING APPROVAL**/
	  if(record.getFieldValue('approvalstatus') == 1) {

		  for(var i=1; i<=record.getLineItemCount('expense'); i++) {
				if(/accrued/i.test(record.getLineItemText('expense','account',i))) {
					if(record.getLineItemValue('expense','custcol42',i) != null) {

						var found = je_objects.some(function (res) {
					      return res.je_id === record.getLineItemValue('expense','custcol42',i);
					    });
								
						if (!found) {
						//HAVEN'T FOUND IT :(
							je_objects.push({
								'je_id' : record.getLineItemValue('expense','custcol42',i),
								'je_amt' : record.getLineItemValue('expense','amount',i)
							});
						} else {
							//FOUND IT :)
							for(var k in je_objects) {
								if(record.getLineItemValue('expense','custcol42',i) == je_objects[k].je_id) {
									je_objects[k].je_amt += parseFloat(record.getLineItemValue('expense','amount',i));
									break;
								}
							}
						}
						
					}
				}
		  }
		  
		  if(je_objects.length != 0) {
			  for(var p in je_objects) {
				  var jes = nlapiLookupField('journalentry', je_objects[p].je_id, ['custbody219','custbody210'], false);
					var arr_refs = jes.custbody210.split(',');
					var id = record.getId();
					id = id.toString();
					
					/** CHECK IF APV ID EXIST IN THE ARRAY **/
					var index = arr_refs.indexOf(id);
					
					if(index != -1) {
						
						/** REMOVE APV ID IN THE ARRAY **/
						arr_refs.splice(index, 1); 
						
						nlapiSubmitField('journalentry', je_objects[p].je_id,['custbody219','custbody210'],[parseFloat(parseFloat(jes.custbody219) + parseFloat(je_objects[p].je_amt)), arr_refs]);
					}
			  }
		  }
		  
	  }
	  
//  } else {
//	  if(type == 'create') {
//
//	    for(var i=1; i<=record.getLineItemCount('expense'); i++) {
//	      	if(/accrued/i.test(record.getLineItemText('expense','account',i))) {
//	        	if(record.getLineItemValue('expense','custcol42',i) != null) {
//	                var jes = nlapiLookupField('journalentry', record.getLineItemValue('expense','custcol42',i), ['custbody219','custbody210'], false);
//	                var arr_refs = jes.custbody210.split(',');
//	                var id = record.getId();
//	                id = id.toString();
//
//	                if(arr_refs.indexOf(id) == -1) {
//	                  arr_refs.push(id);
//	                }
//
//	              	/** CHECK IF THERE IS AN EMPTY VALUE IN THE ARRAY **/
//	                	var index = arr_refs.indexOf('');
//
//	                /** REMOVE EMPTY VALUES IN THE ARRAY **/
//	                	if(index > -1) { arr_refs.splice(index, 1); }
//	                	var je_remaining_amt = parseFloat(jes.custbody219);
//	         			nlapiSubmitField('journalentry', record.getLineItemValue('expense','custcol42',i),['custbody219','custbody210'],[parseFloat(je_remaining_amt - //record.getLineItemValue('expense','amount',i)), arr_refs]);
//	            }
//	        }
//	    }
//	    
//	  }
//  }


}

/*function userEventBeforeSubmit(type) {
	if(type == 'create' || type == 'edit'){
		var record = nlapiGetNewRecord();
		var customForm = record.getFieldValue(fld_customForm);
		var nontradeSubtype = record.getFieldValue(fld_nontradeSubtype);
		var linecount = record.getLineItemCount('expense');
		
		if(customForm == '138' && (nontradeSubtype == '8' || nontradeSubtype == '3' || nontradeSubtype == '13')){ // 138 = DDI Vendor Bill - Nontrade, 8 = WER
			for(var i = 1; linecount != 0 && i <= linecount; i++){
				record.setLineItemValue('expense', 'custcol36', i, 
						getAccountNo(record.getLineItemValue('expense', 'custcol31', i)));
			}
		}
	}
}*/

function userEventBeforeLoadCA(type, form, request){
	var record = nlapiGetNewRecord();
	var nontradeSubtype = record.getFieldValue(fld_nontradeSubtype);
	var status = record.getFieldValue('status');
	var liquidated = record.getFieldValue(fld_liquidated);
	
  	//load accrual script to trigger javascript code in view state
  	form.setScript('customscript678_2');
  	form.setScript('customscript534');
  
	// 11 = cash advance - branch, 12 = cash advance - ho
	if(type == 'view' && status == 'Paid In Full' && liquidated == 'F' && (nontradeSubtype == '11' || nontradeSubtype == '12')) {

		//var liquidate = "window.open('"+ nlapiResolveURL('RECORD', 'journalentry') + "?billid=" + record.getId() +"','_self');";
		//var refund = "window.open('"+ nlapiResolveURL('RECORD', 'vendorbill') +	"?billid=" + record.getId() +"','_self');";
		var liquidate = "window.open('https://system.na2.netsuite.com/app/accounting/transactions/journal.nl?billid=" + record.getId() +"','_self');";
		var refund = "window.open('https://system.na2.netsuite.com/app/accounting/transactions/vendbill.nl?billid=" + record.getId() +"','_self');";

		form.addButton("custpage_btnreturn", "Return", liquidate);
		form.addButton("custpage_btnrefund", "Refund", refund);
	}

	try {
       	//nlapiLogExecution('ERROR', 'BILL ID', request.getParameter('billid'));
		var billid = request.getParameter('billid');
		//var params_data = request.getParameter('compid').split('?'), //compid=3625074?billid=4836216
          //bill_data = params_data[1].split('='), // billid=4836216
          //billid = bill_data[1]; //4836216

      if(billid != null) {

			var fields = [ fld_name, fld_location, fld_principal, fld_department, fld_billtype ];

			var columns = nlapiLookupField('vendorbill', billid, fields);

			nlapiSetFieldValue(fld_name,columns.entity);

			nlapiSetFieldValue(fld_linkfrom, billid);
				var fldLinkfrom = nlapiGetField(fld_linkfrom);
				fldLinkfrom.setDisplayType('hidden');
			
			nlapiSetFieldValue(fld_location,columns.location);
			
			nlapiSetFieldValue(fld_principal,columns.class);
			
			nlapiSetFieldValue(fld_department,columns.department);
			
			nlapiSetFieldValue(fld_billtype,columns.custbody62);

			nlapiSetFieldValue(fld_customForm,'138');

			nlapiSetFieldValue(fld_nontradeSubtype,'9');
		}
	} catch(e) { nlapiLogExecution('ERROR', 'EXCEPTION', e.getMessage); }
}

// This function will return the account number of an employee/vendor
/*function getAccountNo(vendor){
	var accountNo = '';
	
	if(vendor === null){
		accountNo;
	}else{
		accountNo = nlapiLookupField('vendor', vendor, 'custentity9');
	}
	
	return accountNo;
}*/


