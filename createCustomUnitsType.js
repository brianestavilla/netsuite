function createUnitType(type, form){
	if(type == 'create'){
		try{
			//Item Details
			var record = nlapiGetNewRecord(),
				record_type = record.getRecordType(),
				record_id = record.getId(),
			//Units Type 
				units_type_id = record.getFieldValue('unitstype'),
				units_type = nlapiLoadRecord('unitstype', units_type_id),
				utype_name = units_type.getFieldValue('name'),
				
				linecount = units_type.getLineItemCount('uom')
			;
			var search = nlapiSearchRecord('customrecord223', null, new nlobjSearchFilter('name', null, 'is', utype_name), new nlobjSearchColumn('internalid'));
			if(search == null){
				var custom_unitstype = nlapiCreateRecord('customrecord223');
				custom_unitstype.setFieldValue('name', utype_name);
				custom_unitstype.setFieldValue('custrecord682', units_type_id);
				for(var i = 1; i <= linecount; i++){
					var unitsName = units_type.getLineItemValue('uom', 'abbreviation', i),
						conversion = units_type.getLineItemValue('uom', 'conversionrate', i),
						base = units_type.getLineItemValue('uom', 'baseunit', i)
					;
					custom_unitstype.setLineItemValue('recmachcustrecord528', 'name', i, unitsName);
					custom_unitstype.setLineItemValue('recmachcustrecord528', 'custrecord526', i, conversion);
					custom_unitstype.setLineItemValue('recmachcustrecord528', 'custrecord714', i, units_type_id);
					if(base == 'T')custom_unitstype.setLineItemValue('recmachcustrecord528', 'custrecord527', i, 'T');
				}
				var custom_unit_id = nlapiSubmitRecord(custom_unitstype, null, true);
				nlapiSubmitField(record_type, record_id, 'custitem71', custom_unit_id);
			}else
				nlapiSubmitField(record_type, record_id, 'custitem71', search[0].getValue('internalid'));
		}
		catch(e){
		}
	}
}