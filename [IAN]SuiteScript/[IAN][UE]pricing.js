/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Jul 2014     IAN
 *
 */

//var	BO_ALLOWANCE = '36534';//production
var	BO_ALLOWANCE = '36333'; //sandbox
var	SALES_DISCOUNT = '30362';

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
function userEventAfterSubmit(type) {
	if(type == 'create' || type == 'edit') {
		var record = nlapiGetNewRecord();
      	if(record.getRecordType()=='salesorder' && record.getFieldValue('class')=='7') {
          	nlapiSubmitField('salesorder',record.getId(),'custbody144',record.getFieldValue('entity'));
        }

		if(record.getRecordType() == 'invoice') {
				var totalAmountInWords = toWords(record.getFieldValue('total'));
				nlapiSubmitField('invoice', record.getId(),'custbody117', totalAmountInWords);
		}
	}
}
/**
 * 
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord salesorder, invoice
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                   d   markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventBeforeSubmit(type){
	try {
        //if(nlapiGetUser() == 30855) {
         // if(nlapiGetFieldValue('class') == 11 || nlapiGetFieldValue('class') == 10) { //11 = FS; 10 = GT;
         //     var integration = new INTEGRATION_API();
         //     integration.GET_INVOICES();
         // }
      	//}

      if(type == 'create' || type == 'edit') {
          var record = nlapiGetNewRecord();

          /**if(record.getRecordType() == 'salesorder' || record.getRecordType() == 'invoice') {
             if(record.getFieldValue('class')!='7') { // added by Brian 2/18/2016 - triggered if principal is not PG
                  var customerCreditInfo = DDIns.getCustomerCreditInfo(record.getFieldValue('class'), record.getFieldValue('entity'));

               if(customerCreditInfo.salesrep != null || customerCreditInfo.salesrep != '') {
                  record.setFieldValue('salesrep', customerCreditInfo.salesrep);
                 }
                  record.setFieldValue('terms', customerCreditInfo.terms); //standard terms field
                  record.setFieldValue('custbody120', customerCreditInfo.terms); //custom terms field
             }
          }**/

          if(record.getFieldValue('class') == 118 || record.getFieldValue('class') == 4) {
              applyDiscountGlobe( record ); // added by Brian 11/12/2015, GLOBE Discount Computation
          } else { applyDiscount( record ); }

      }
    } catch(err) { nlapiLogExecution('ERROR','ERROR MESSAGE', err.message); }

}

function applyDiscountGlobe( record ) {
		var totalDiscounts = 0;
		for(var i=1, linecount = record.getLineItemCount('item'); i<=linecount; i++) {
			if(record.getLineItemValue('item','custcol10',i) > 0) {
				totalDiscounts += record.getLineItemValue('item','custcol10',i);
			}
		}
		nlapiSetFieldValue('discountitem', SALES_DISCOUNT);
		nlapiSetFieldValue('discountrate', parseFloat(totalDiscounts)*-1);
}

function applyDiscount( record ){
	if(record.getFieldValue('class')!='7') { // PRINCIPAL IS PG
		var totalSalesDiscount = 0;
		var totalBadOrderDiscount = 0;
		
		var itemCount = record.getLineItemCount('item');
			
		for( var i = 1; i <= itemCount; i++ ){
			var totalDiscountInLine = parseFloat(record.getLineItemValue('item','custcol10',i)) || 0;
			totalSalesDiscount += totalDiscountInLine;
		}
		
	/*	if(totalSalesDiscount > 0)*/
		nlapiSetFieldValue('discountitem', SALES_DISCOUNT);
		nlapiSetFieldValue('discountrate', totalSalesDiscount * -1);
		
	/*	if(totalBadOrderDiscount > 0)
			setTotalDiscount(record, totalBadOrderDiscount , 'BO');*/
	}

  	if(record.getRecordType()=='salesorder' && record.getFieldValue('class')== 7) {
      var totalSalesDiscount = 0;
		var totalBadOrderDiscount = 0;
		
		var itemCount = record.getLineItemCount('item');
			
		for( var i = 1; i <= itemCount; i++ ){
			var totalDiscountInLine = parseFloat(record.getLineItemValue('item','custcol10',i)) || 0;
			totalSalesDiscount += totalDiscountInLine;
		}
	    nlapiSetFieldValue('discountitem', SALES_DISCOUNT);
		nlapiSetFieldValue('discountrate', totalSalesDiscount * -1);
    }
}

function parseToRate(number, percent){
	
	percent = parseFloat(percent)/100;
	
	return parseFloat(number) * percent;
}

function setTotalDiscount( record, totalDiscount , discountType ){
	
	lineCount = nlapiGetLineItemCount('item');
	
	switch(discountType){
	
	case 'BO':
		discountType = BO_ALLOWANCE;
		break;
	case 'DIST':
		discountType = SALES_DISCOUNT;
		break;	
	}

	nlapiSetFieldValue('discountitem', SALES_DISCOUNT);
	nlapiSetFieldValue('discountrate', totalDiscount);
/*	
	if(record.findLineItemValue('item', 'item', discountType) !== -1) return;
	
	record.setLineItemValue('item', 'item', lineCount + 1, discountType);
	record.setLineItemValue('item', 'taxcode', lineCount + 1, '5');
	record.setLineItemValue('item', 'amount', lineCount + 1, totalDiscount * -1);
	record.setLineItemValue('item', 'rate', lineCount + 1, totalDiscount * -1);	*/	

}

