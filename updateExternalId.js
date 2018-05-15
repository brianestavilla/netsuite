function updateToApprove(record_type, record_id)
{
	var fieldId = new Array();
	var fieldValue = new Array();
	
	fieldId[0] = 'custbody84'; // Approval Status
	fieldId[1] = 'custbody17'; // Next Approver
	fieldValue[0] = '2';
	fieldValue[1] = '';
	
	nlapiSubmitField(record_type, record_id, fieldId, fieldValue);
}