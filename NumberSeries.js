var NumberSeries = (function(){
	var record = {
		NUMBER_SERIES: 'customrecord206'
	};

	var column = {
		RECORD_TYPE: 'custrecord395',
		LOCATION: 'custrecord795',
		COUNT: 'custrecord394',
		PREFIX: 'name',
		PREFIXLOC: 'custrecord796',
		HASDATE: 'customrecord206'
	};

	var number = null,
		recSeriesNumber = null,
		count = null;

	var generate = function(recordType, location){

		recSeriesNumber = _getNumberSeries(recordType, location);
		nlapiLogExecution("ERROR", "search result", recSeriesNumber);
		if(recSeriesNumber == null){
			throw nlapiCreateError('ERROR_SAVE', "No number series found");
		}

		var currentYear, currentMonth;

		var lastNumber = recSeriesNumber[0].getValue(column.COUNT);
			count = parseInt(lastNumber) + 1
		var prefix = recSeriesNumber[0].getValue(column.PREFIX);
		var prefixLocation = recSeriesNumber[0].getValue(column.PREFIXLOC);

		if(recSeriesNumber[0].getValue(column.HASDATE) === 'T'){

			var currentDate = new Date();
			currentYear = currentDate.getFullYear().toString().slice(2);
			currentMonth = currentDate.getMonth() + 1;

			number = prefixLocation;
			number += prefix;
			number += currentYear;
			number += '-';
			number += currentMonth;
			number += '-';
			number += count;
		}

		number = prefix;
		number += count;

		//_commitNewCount( lastNumber );

		return {
			count: number,
			save: save
		}; 
	};

	var _getNumberSeries = function(recordType, location){
		var filters = new Array();

		if(recordType !== null){
			filters.push(new nlobjSearchFilter(column.RECORD_TYPE, null, 'is', recordType));
		}

		if(location !== null){
			filters.push(new nlobjSearchFilter(column.LOCATION, null, 'any', location));
		}

		var columns = new Array();
		columns[0] = new nlobjSearchColumn(column.COUNT);
		columns[1] = new nlobjSearchColumn(column.PREFIX);
		columns[2] = new nlobjSearchColumn(column.PREFIXLOC);

		return nlapiSearchRecord(record.NUMBER_SERIES, null, filters, columns);
	};

	var _commitNewCount = function(number){
		nlapiSubmitField(record.NUMBER_SERIES, recSeriesNumber[0].getId(), column.COUNT, number);
	};

	var save = function(){
		_commitNewCount( count );	
	};

	var isDuplicate = function(itemcode){
		
	};

	return {
		generate: generate,
	};
})();