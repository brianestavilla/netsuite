function beforeSubmitTotalQuantity(type) {
	try{
		var record = nlapiGetNewRecord(),
			linecount = record.getLineItemCount('item'),
			total = 0, quantity;
		if(record.getRecordType() == 'itemreceipt') {
			quantity = 'quantity';
		} else {
			quantity = 'quantity';
			var duedate = nlapiStringToDate(record.getFieldValue('trandate'));
			var terms = record.getFieldValue('terms');
			if(record.getRecordType() == 'vendorbill') {
			var days = parseInt(nlapiLookupField('term', terms, 'daysuntilnetdue', false));
				if(days > 0)duedate.setDate(duedate.getDate() + days);
				record.setFieldValue('duedate', nlapiDateToString(duedate));//nlapiDateToString(duedate));
			}
          
          	/** SET TOTAL GROSS AMOUNT, TOTAL DISCOUNT AMOUNT, TOTAL TAX AMOUNT **/
          	var total_grossamt = 0, total_discounts = 0, total_vatamt = 0;
            for(var i = 1; i <= record.getLineItemCount('item'); i++) {
				total_grossamt += parseFloat(nlapiGetLineItemValue('item', 'grossamt', i));
                total_discounts += parseFloat(nlapiGetLineItemValue('item', 'custcol10', i));
                total_vatamt += parseFloat(nlapiGetLineItemValue('item', 'tax1amt', i));
            }

          	record.setFieldValue('custbody142', total_grossamt);
            record.setFieldValue('custbody127', total_discounts);
            record.setFieldValue('custbody166', total_vatamt);
			/***********************************************************************************/
        }

		for(var i = 1; i <= linecount; i++) {
			var quantity1 = (record.getLineItemValue('item', quantity, i) == null || record.getLineItemValue('item', quantity, i) == '') ? 0 : record.getLineItemValue('item', quantity, i);
			total += parseFloat(quantity1);//noeh
		}
		record.setFieldValue('custbody159', total);//total
	}catch(e){}
}