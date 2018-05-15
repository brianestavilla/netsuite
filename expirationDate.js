function checkExpiration(type, name){
	if(name == 'expirationdate')
	{
		var date = new Date();
		var enddate = nlapiStringToDate(nlapiGetCurrentLineItemValue('inventoryassignment', 'expirationdate'));
		if(countMonths(date, enddate) <= 5){
			alert('Expiration date should be more than 5 months from now');
			return false;
		}else return true;
	}else return true;
}

function checkExpiration1(type){
	if(type == 'item'){
			var date = new Date();
			var enddate = nlapiStringToDate(nlapiGetCurrentLineItemValue('inventoryassignment', 'expirationdate'));
			if(countMonths(date, enddate) <= 5){
				alert('Expiration date should be more than 5 months from now');
				return false;
			}
	}
	return true
}

function countMonths(someDate, someOtherDate)
{
	var a = someDate;
	var b = someOtherDate;
	// Months between years.
	var months = (b.getFullYear() - a.getFullYear()) * 12;
	 
	// Months between... months.
	months += b.getMonth() - a.getMonth();
	 
	// Subtract one month if b's date is less that a's.
	if (b.getDate() < a.getDate())
	{
		months--;
	}
	return months;
}