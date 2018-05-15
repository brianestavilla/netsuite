//UPDATE SALES ORDER VALUES
var SalesOrderFields = new Array();
var NewValues = new Array();

SalesOrderFields[0]='custbody47';
NewValues[0]='1';
SalesOrderFields[1]='custbody58';
NewValues[1]='F';
SalesOrderFields[2]='custbody59';
NewValues[2]='F';

//DO NOT TOUCH THE CODE BELOW
function UpdateSalesOrder(recordtype, recordid)
{
	try
	{
		nlapiSubmitField(recordtype, recordid, SalesOrderFields, NewValues);
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', e.message, 'Sales Order ID = ' + recordid);
	}
}