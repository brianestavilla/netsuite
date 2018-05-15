function beforeSubmit(type, name)
{
	var TRADE_TYPE_BILL = '103';
	
	if(type == 'create'){
		var record = nlapiGetNewRecord(),
		linecount = record.getLineItemCount('apply')
		;
	
		for(var i = 1; i <= linecount; i++)
		{
			var apply = record.getLineItemValue('apply', 'apply', i);
			var duedate = record.getLineItemValue('apply', 'applydate', i);
			if(apply == 'T')	
			{
				var sourceBillId = record.getLineItemValue('apply','doc',i);
				
				var BillFormType = nlapiLookupField('vendorbill', sourceBillId, 'customform');
				
				if(BillFormType == TRADE_TYPE_BILL){

					//
					var hours = nlapiStringToDate(duedate);
					if(hours.getTime() >= nlapiStringToDate(nlapiGetFieldValue('trandate')).getTime())
					{
						var amount = record.getLineItemValue('apply', 'amount', i);
						var percent = 0;
						try{
							percent =  nlapiLookupField('vendor', record.getFieldValue('entity'), 'custentity51', false);

							percent = (percent == null || percent == '') ? 0 : parseFloat(percent)/100;
						}catch(e)
						{
							percent = 0;
						}
						var discount = parseFloat(amount) * percent;
						record.setLineItemValue('apply', 'disc', i, discount);
						record.setLineItemValue('apply', 'amount', i, parseFloat(amount) - discount);
					}
				}
			}
		}
	}
}