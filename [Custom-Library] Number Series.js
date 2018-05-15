/**
*	Generate Number Series
*
*	[Raffy Sucilan]
**/
function numberSeries(operation, type, location1){
	/** Record ID (Number Series) - START **/
	recNumSeries = 'customrecord206'; // Number Series
	/** Record ID (Number Series) - END **/
	
	/** Column IDs (Number Series) - START **/
	NSInternalID = 'internalid'; // Internal ID
	NSType = 'custrecord395'; // Type
	NSPrefix = 'name'; // Prefix
	NSYear = 'custrecord575'; // Year
	NSMonth = 'custrecord576'; // Month
	NSCount = 'custrecord394'; // Count
	NSLocation = 'custrecord795'; // Location
	NSPrefixLoc = 'custrecord796'; // Prefix
	NSDate = 'custrecord823'; //Date Format
	/** Column IDs (Number Series) - END **/
	
	/** Record ID (Location Code) - START **/
	recLocCode = 'customrecord231'; // Number Series
	/** Record ID (Location Code) - END **/
	
	
	if(location1 != '' && location1 != null && location1 != undefined){
		var filters = new Array(new nlobjSearchFilter(NSType, null, 'is', type), 
					  new nlobjSearchFilter(NSLocation, null, 'anyof', location1)
		);
	}
	else{
		var param = 'anyof';
		var nlocation = '@NONE@';
		var join = null;
		var filters = new Array(new nlobjSearchFilter(NSType, null, 'is', type));
	}
	
	var columns = new Array(
		new nlobjSearchColumn(NSInternalID),
		new nlobjSearchColumn(NSType),
		new nlobjSearchColumn(NSPrefix),
		new nlobjSearchColumn(NSYear),
		new nlobjSearchColumn(NSMonth),
		new nlobjSearchColumn(NSPrefixLoc),
		new nlobjSearchColumn(NSCount),
		new nlobjSearchColumn(NSDate)
	);
	
	var series = nlapiSearchRecord(recNumSeries, null, filters, columns);

	if(series == null){
		nlapiLogExecution("ERROR", "No number series found");
		return;
	}

	var month, year;

	if(series[0].getValue(NSDate) == 'T'){

		curDate = new Date();
		curYear = curDate.getFullYear().toString().slice(2);
		curMonth = curDate.getMonth() + 1;
		
		/* old script
		year = series[0].getValue(NSYear);
		month = series[0].getValue(NSMonth);
		
		year = (year == curYear) ? year : year++;
		month = (month == curMonth) ? month : month++;
		month = (month <= 12) ? month : 1;
		month = fixDigit(month, 2);*/

		// modified June 30, 2016 (DEM)
		year = curYear;
		month = fixDigit(curMonth, 2);

	}

	var count = series[0].getValue(NSCount);

	nlapiLogExecution("ERROR", "type:" + operation + " count:"+count);

	if(operation == 'get'){ // Get New Number Series
		
		prefix = series[0].getValue(NSPrefix);
		prefixLoc = series[0].getValue(NSPrefixLoc);
		prefixLoc = (prefixLoc == null || prefixLoc == '') ? '' : prefixLoc + '-' ;
		
		
		if(series[0].getValue(NSDate) == 'F')
			newSeries = prefix + count;
		else
			newSeries = prefixLoc + prefix + year + '-' + month + '-' + fixDigit(count, 5);
		return newSeries;
	}

	if(operation == 'fix'){ // Update Number Series
		seriesID = series[0].getValue(NSInternalID);
		
		count++;
		if(series[0].getValue(NSDate) == 'T'){
			nlapiSubmitField(recNumSeries, seriesID, NSYear, year);
			nlapiSubmitField(recNumSeries, seriesID, NSMonth, month);
		}
		nlapiSubmitField(recNumSeries, seriesID, NSCount, count);
	}
	
	/** Private Function - START **/
	function fixDigit(number, maxDigit){
		number = number.toString();
		
		numberLength = number.length;
		
		maxDigit--;
		
		for(i = maxDigit; i >= numberLength; i--) number = '0' + number;
		
		return number;
	}
	/** Private Function - END **/
}