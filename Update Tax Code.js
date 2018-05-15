function updateTaxcode(record_type, record_id)
{
	var rec = nlapiLoadRecord(record_type, record_id);
	var line = rec.findLineItemValue('item', 'item', '22884');
	count = rec.getLineItemCount('item');
	for(var i = 1; i <= count; i++)
	{
		rec.setLineItemValue('item', 'taxcode', i, '6');
	}
	nlapiSubmitRecord(rec, null, true);
}