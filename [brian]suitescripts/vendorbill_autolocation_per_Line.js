/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Mar 2015     Brian
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
function clientFieldChangedLocation(type, name, linenum) {
  	if(nlapiGetRecordType() == 'vendorbill') {
  		/** VENDOR BILL **/
  		
      	if(nlapiGetUser() == 30855) {
          	if(name == 'custbody104') {
              var data = nlapiGetFieldValue('custbody104').split(',');
              var index = data.indexOf('');
              var temp = [];
			  if(index > -1) { data.splice(index, 1); }
              for(var i in data) {
                if(typeof data !='undefined') {
                  temp.push(parseInt(data[i]));
                }
              }
              console.log(temp);
              
            }
        }
      
  		/** SET LOCATION AND PRINCIPAL **/
        if(name=='account' && type=='expense') {
          var location = nlapiGetFieldValue('location');
          var principal = nlapiGetFieldValue('class');
          nlapiSetCurrentLineItemValue('expense', 'location',location);
          nlapiSetCurrentLineItemValue('expense', 'class',principal);
        }
        /** END CONDITION  **/
        
        /** SET DEBITTING ACCOUNT **/
        if(name == 'location' || name == 'class') {
        	var location = nlapiGetFieldValue('location');
        	var principal = nlapiGetFieldValue('class');
          
			if(location != '' && principal != '') {
				var column = new nlobjSearchColumn('custrecord894');
				var filter = [
				  new nlobjSearchFilter('custrecord895', null, 'anyof', principal),
				  new nlobjSearchFilter('custrecord896', null, 'anyof', location)
				];
				var results = nlapiSearchRecord('customrecord426', null, filter, column); //customrecord426 = bank accounts per branch record;
				
				if(results != null && results[0].getValue('custrecord894')) {
				  nlapiSetFieldValue('custbody214',results[0].getValue('custrecord894'));
				} else { nlapiSetFieldValue('custbody214',''); }
			  
			}
          
        }
        /** END CONDITION  **/
        
    } else if(nlapiGetRecordType() == 'inventoryadjustment') {
        /** INVENTORY ADJUSTMENT **/
        
    	if(name == 'item') {
		  var location = nlapiGetFieldValue('adjlocation');
          var principal = nlapiGetFieldValue('class');
          var department = nlapiGetFieldValue('department');
        
          nlapiSetCurrentLineItemValue('inventory', 'location',location);
          nlapiSetCurrentLineItemValue('inventory', 'department',department);
          nlapiSetCurrentLineItemValue('inventory', 'class',principal);
        
        }
        
    } else if(nlapiGetRecordType() == 'purchaseorder') {
    	/** PURCHASE ORDER **/
    	if(nlapiGetFieldValue('customform') == 116) { //116 = TRADE PO;
    		if(name == 'item') {
      		  	var location = nlapiGetFieldValue('location');
                nlapiSetCurrentLineItemValue('item', 'location',location);
              
            }
    	}
    }
}

function saverecordLocation() {
  if(nlapiGetRecordType() == 'vendorbill') {
	  /** VENDOR BILL **/
	  
	  /** CHECK IF DEBITTING ACCOUNT NOT EMPTY OR NULL **/
	  if(nlapiGetFieldValue('custbody214') == '') {
	     alert('No Bank Account Setup for '+nlapiGetFieldText('location')+'. Kindly contact administrator for assistance.');
	     return false;
	  }
	  /** END CONDITION **/

	  /** CHECK IF MAINLINE LOCATION IS THE SAME WITH LINE ITEM LOCATION **/
      var location = nlapiGetFieldValue('location');
      var err_indicator = 0;

      for(var i = 1; i<= nlapiGetLineItemCount('expense'); i++) {
        if(nlapiGetLineItemValue('expense','location',i) != location) { err_indicator = 1; }
      }
      
      if(err_indicator == 1) {
        alert('One or More Line Item Location is not equal to the Mainline Location');
        err_indicator = 0;
        return false;
      }
    
	  /** END CONDITION **/
      
  } else if(nlapiGetRecordType() == 'purchaseorder') {
	if(nlapiGetFieldValue('customform') == 116) { //116 = TRADE PO;
    
      /** CHECK IF MAINLINE LOCATION IS THE SAME WITH LINE ITEM LOCATION **/
      var location = nlapiGetFieldValue('location');
      var err_indicator = 0;

      for(var i = 1; i<= nlapiGetLineItemCount('item'); i++) {
        if(nlapiGetLineItemValue('item','location',i) != location) { err_indicator = 1; }
      }

      if(err_indicator == 1) {
        alert('One or More Line Item Location is not equal to the Mainline Location');
        err_indicator = 0;
        return false;
      }
      /** END CONDITION **/
    }
  } else if(nlapiGetRecordType() == 'inventoryadjustment') {

    /** CHECK IF MAINLINE LOCATION IS THE SAME WITH LINE ITEM LOCATION **/
    var location = nlapiGetFieldValue('adjlocation');
    var err_indicator = 0;

    for(var i = 1; i<= nlapiGetLineItemCount('inventory'); i++) {
      if(nlapiGetLineItemValue('inventory','location',i) != location) { err_indicator = 1; }
    }

    if(err_indicator == 1) {
      alert('One or More Line Item Location is not equal to the Mainline Location');
      err_indicator = 0;
      return false;
    }
    /** END CONDITION **/

  }

  return true; 

}

function validateLineLocation(type) {
	if(nlapiGetRecordType() == 'inventoryadjustment'){
		/** INVENTORY ADJUSTMENT **/
		
		/** CHECK IF MAINLINE LOCATION IS EQUAL TO LINE ITEM LOCATION **/
		if(type == 'inventory') {
			if(nlapiGetFieldValue('adjlocation') != nlapiGetCurrentLineItemValue('inventory','location')) {
			   alert('Line Item Location is not equal to the Adjustment Location');
	    	   return false;
		    }
		}
       /** END CONDITION **/
    } else if(nlapiGetRecordType() == 'vendorbill') {
    	/** CHECK IF MAINLINE LOCATION IS EQUAL TO LINE ITEM LOCATION **/
    	if(type == 'expense') {
    		if(nlapiGetFieldValue('location') != nlapiGetCurrentLineItemValue('expense','location')) {
        		alert('Expense Sublist Location is not equal to the Mainline Location');
        		return false;
        	}
    	}
    	/** END CONDITION **/
    } else if(nlapiGetRecordType() == 'purchaseorder') {
    	/** CHECK IF MAINLINE LOCATION IS EQUAL TO LINE ITEM LOCATION **/
    	if(nlapiGetFieldValue('customform') == 116) { //116 = TRADE PO;
	    	if(type == 'item') {
	    		if(nlapiGetFieldValue('location') != nlapiGetCurrentLineItemValue('item','location')) {
	        		alert('Line Item Location is not equal to the Mainline Location');
	        		return false;
	        	}
	    	}
    	}
    	/** END CONDITION **/
    }
  
	return true;

}

function pageInitLocation(type) {
	if(nlapiGetRecordType() == 'vendorbill') {
		/** VENDOR BILL **/
		
		/** SET DEBITTING ACCOUNT **/
		var location = nlapiGetFieldValue('location');
    	var principal = nlapiGetFieldValue('class');
      
		if(location != '' && principal != '') {
			var column = new nlobjSearchColumn('custrecord894');
			var filter = [
			  new nlobjSearchFilter('custrecord895', null, 'anyof', principal),
			  new nlobjSearchFilter('custrecord896', null, 'anyof', location)
			];
			var results = nlapiSearchRecord('customrecord426', null, filter, column); //customrecord426 = bank accounts per branch record;
			
			if(results != null && results[0].getValue('custrecord894')) {
			  nlapiSetFieldValue('custbody214',results[0].getValue('custrecord894'));
			} else { nlapiSetFieldValue('custbody214',''); }
		  
		}
		/** END CONDITION **/
	}
}