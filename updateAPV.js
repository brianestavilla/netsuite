function updateAPVNumber(record_type, record_id)
{
	//bill = nlapiLoadRecord(record_type, record_id);
	//var number = numberSeries('get', 'vendorbill', bill.getFieldText('location'));
	//numberSeries('fix', 'vendorbill', bill.getFieldText('location'));
	nlapiSubmitField(record_type, record_id, 'costingmethod', 'AVG');
}