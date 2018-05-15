function total(type, name)
{
	try{
		var record = nlapiGetNewRecord(),
			linecount = record.getLineItemCount('recmachcustrecord810'),
			total = 0; 
			totalf = 'custrecord815';
		for(var i = 1; i <= linecount; i++)
		{
			var quantity1 = (record.getLineItemValue('recmachcustrecord810', totalf, i) == null || record.getLineItemValue('recmachcustrecord810', totalf, i) == '') ? 0 : record.getLineItemValue('recmachcustrecord810', totalf, i);
			total += parseFloat(quantity1);
		}
		
		record.setFieldValue('custrecord826', total);//total
	}catch(e){}
}