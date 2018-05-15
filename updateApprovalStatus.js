function updateToApprovePO(record_type, record_id)
{
	nlapiSubmitField(record_type, record_id, 'approvalstatus', '2');
	nlapiSubmitField(record_type, record_id, 'custbody17', '');
}