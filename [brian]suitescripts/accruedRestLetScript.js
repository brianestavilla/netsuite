/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jul 2017     brian
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {
		var data = [];
		var rec = nlapiLoadRecord('vendorbill', dataIn.id);

  if(record.getLineItemCount('expense') > 0) {
		try {
          return { code : 200 };
	    for(var i=1; i<=record.getLineItemCount('expense'); i++) {
	      if(/accrued/i.test(record.getLineItemText('expense','account',i))) {

	          var found = data.some(function (d) {
	            return d.id == record.getLineItemValue('expense','custcol42',i);
	          });
	          if (!found) {
	              data.push({id:record.getLineItemValue('expense','custcol42',i), amount:parseFloat(record.getLineItemValue('expense','amount',i))});
	          } else {
	              for(var j in data) {
	                  if(data[j].id == record.getLineItemValue('expense','custcol42',i)) {
	                      data[j].amount += parseFloat(record.getLineItemValue('expense','amount',i));
                      break;
	                  }
	              }
	          }
	      }
	    }

       if(data.length > 0) {
	    for(var k in data) {
	        var jes = nlapiLookupField('journalentry', data[k].id, ['custbody219','custbody210'], false);
	          var arr_refs = jes.custbody210.split(',');
	          var id = data[k].id;
	          id = id.toString();

	          if(arr_refs.indexOf(id) == -1) {
	            arr_refs.splice(arr_refs.indexOf(dataIn.id),1);
	          }

	      /** CHECK IF THERE IS AN EMPTY VALUE IN THE ARRAY **/
	      var index = arr_refs.indexOf('');

	      /** REMOVE EMPTY VALUES IN THE ARRAY **/
	      if(index > -1) { arr_refs.splice(index, 1); }

	      var je_amt = parseFloat(parseFloat(jes.custbody219 || 0) + data[k].amount);
	      nlapiSubmitField('journalentry',data[k].id,['custbody210','custbody219'], [arr_refs, je_amt]);
	    }

	  }

	//return data;
        }catch(ex){
          return { code : 404, message: ex.message };
        }
	}
  }
 	/** if(rec.getLineItemCount('expense') != -1){
	    for(var i=1; i<=rec.getLineItemCount('expense'); i++) {
	      if(/accrued/i.test(rec.getLineItemText('expense','account',i))) {

	          var found = data.some(function (d) {
	            return d.id == rec.getLineItemValue('expense','custcol42',i);
	          });

	          if (!found) {
	              data.push({id:rec.getLineItemValue('expense','custcol42',i), amount:parseFloat(rec.getLineItemValue('expense','amount',i))});
	          } else {
	              for(var j in data) {
	                  if(data[j].id == rec.getLineItemValue('expense','custcol42',i)) {
	                      data[j].amount += parseFloat(rec.getLineItemValue('expense','amount',i));
                        break;
	                  }
	              }
	          }
	      }
	    }
     }
		if(data.length > 0) {
	    for(var k in data) {
	        var jes = nlapiLookupField('journalentry', data[k].id, ['custbody219','custbody210'], false);
	          var arr_refs = jes.custbody210.split(',');
	          var id = data[k].id;
	          id = id.toString();

	          if(arr_refs.indexOf(id) == -1) {
	            arr_refs.splice(arr_refs.indexOf(dataIn.id),1); /**4823739/
	          }

	      /** CHECK IF THERE IS AN EMPTY VALUE IN THE ARRAY /
	      var index = arr_refs.indexOf('');

	      / REMOVE EMPTY VALUES IN THE ARRAY /
	      if(index > -1) { arr_refs.splice(index, 1); }

	      var je_amt = parseFloat(parseFloat(jes.custbody219) + data[k].amount);
	      nlapiSubmitField('journalentry',data[k].id,['custbody210','custbody219'], [arr_refs, je_amt]);
	    }

	  }

	return data;**/
/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function postRESTlet(dataIn) {

	return {};
}
