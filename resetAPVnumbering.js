/*
README:
-create savesearch of apv record to update apv numbers
-sort savesearch apv's according to the time and date it was created
-run update (Mass Update)

This function is designed to update apv numbering series.

notes:
	*Add the [Custom Library] Number Series in the Library Tab During Implementation

	nlapiSubmitField(record_type, record_id, field_name, value_to_set);

	// to get the last number
	var number = numberSeries('get', 'vendorbill', parent_location);
		
	// to set the new number
	numberSeries('fix', 'vendorbill', parent_location);

-IAN	
*/
var apvNumberField = 'custbody37'; //apv number series field
function resetAPVnumbering(recordtype, recordid){
	try{
		//record = nlapiGetNewRecord();
        parent_location = nlapiLookupField('employee', nlapiGetUser(), 'custentity49', false);

        //get the last number in the series
		var number = numberSeries('get', 'vendorbill', parent_location);

		nlapiSubmitField(recordtype, recordid, 'custbody37', number);

		nlapiLogExecution('DEBUG', 'Update APV Number to ' + number, 'ID = ' + recordid);

		//set the last number in the series
		numberSeries('fix', 'vendorbill', parent_location); // count++ is in here
	}catch(e){
		nlapiLogExecution('DEBUG', e.message, 'ID = ' + recordid);
	}
	
	
}

