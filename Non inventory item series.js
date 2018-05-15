(function(){

	this.beforeSubmit = function(type){
		if(type == 'create')
		{
			var record = nlapiGetNewRecord();
			var number = NumberSeries.generate(record.getRecordType());
			nlapiLogExecution("ERROR", record.getRecordType());
			var displayName = record.getFieldValue('displayname') || '';

			record.setFieldValue("custitem10", number.count);
			record.setFieldValue("itemid", number.count +' '+ displayName);

			number.save();
		}
	};

	return this;
})();