var nextrole = '';


function setReturnLocation(type, form){
  	form.setScript('customscript354');

	var record = nlapiGetNewRecord();
	nextrole = record.getFieldValue('custbody17');

  	try{
		var totype = nlapiLoadRecord('vendorreturnauthorization', nlapiGetFieldValue('createdfrom'));
		wlocation = nlapiLookupField('employee', nlapiGetUser(), 'custentity26', false);
	}catch(e){
		try{
			var totype = nlapiLoadRecord('salesorder', nlapiGetFieldValue('createdfrom'));
			wlocation = nlapiLookupField('employee', nlapiGetUser(), 'custentity39', false);
		}catch(e){
			var totype = nlapiGetFieldValue('createdfrom');
			wlocation = nlapiLookupField('employee', nlapiGetUser(), 'custentity38', false);
		}
	}
	if(totype != null){
		try{

			
			if(type == 'vendorreturnauthorization'){
				location_field = form.getField('location');
				location_field.setDefaultValue(wlocation);
				
				var count = record.getLineItemCount('item');
				for(var i = 1; i <= count; i++){
					record.setLineItemValue('item', 'location', i, wlocation);
					record.setLineItemValue('item', 'custcol3', i, wlocation);
				}
			}else if(type == 'salesorder'){
				if(wlocation != null){
					var count = record.getLineItemCount('item');
					for(var i = 1; i <= count; i++){
						record.setLineItemValue('item', 'location', i, wlocation);
						record.setLineItemValue('item', 'custcol3', i, wlocation);
					}
				}else nlapiLogExecution('Error', 'beforeLoad', 'Please contact your administrator \r\n for the value of Return Location field in your Employee Record');
			}else{
				if(wlocation != null){
					var count = record.getLineItemCount('item');
					for(var i = 1; i <= count; i++){
						record.setLineItemValue('item', 'location', i, wlocation);
						record.setLineItemValue('item', 'custcol3', i, wlocation);
					}
				}else nlapiLogExecution('Error', 'beforeLoad', 'Please contact your administrator \r\n for the value of Return Location field in your Employee Record');
			}
		}catch(e){
			nlapiLogExecution('Error', 'beforeLoad', 'Please contact your administrator \r\n for the value of Return Location field in your Employee Record');
		}
	}
}