function updateName(record_type, record_id)
{
	try{
		//var purchasedescription = nlapiLookupField(record_type, record_id, 'purchasedescription');
		nlapiSubmitField(record_type, record_id, 'trandate', '06/30/2013');
		nlapiSubmitField(record_type, record_id, 'duedate', '06/30/2013');
	}catch(e){}
}