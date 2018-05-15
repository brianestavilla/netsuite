/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Dec 2016     Dranix
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
function clientFieldChanged(type, name, linenum) {
	if(name=='ifpick') {
		var total = 0;
		for(var i = 1; i<=nlapiGetLineItemCount('payments'); i++) {
			if(nlapiGetLineItemValue('payments','ifpick',i)=='T') {
				total += parseFloat(nlapiGetLineItemValue('payments','amount',i));
			}
		}
		
		nlapiSetFieldValue('htmltotal',"<span style='font-size:20px; float:right;'> <b>TOTAL AMOUNT:</b> Php "+total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</span>");
	}
}