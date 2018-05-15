function updateWtaxCode(record, record_id)
{
	nlapiSubmitField(record, record_id, 'custpage_defaultwitaxfield', '11');
}