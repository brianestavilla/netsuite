function generateDocument(type,form){

	if(type == 'create'){
		var cont = nlapiGetContext(); //intialize context
		var principal = cont.getSessionObject('principal'); // store created session into operation id
		var location = cont.getSessionObject('location');
		var dateOfCount = cont.getSessionObject('dateofcount');
		var monthEndCutOff = cont.getSessionObject('monthendcutoff');
		
		var datesplit = monthEndCutOff.split('/');
		var finalmonthEndCutOff = datesplit[0] + '/' + '1' + '/' + datesplit[2];
		
		//set values to a fields
		nlapiSetFieldValue('custrecord837',principal);
		nlapiSetFieldValue('custrecord836',location);
		nlapiSetFieldValue('custrecord834',dateOfCount);
		nlapiSetFieldValue('custrecord835',monthEndCutOff);
		
		generate(principal,location,monthEndCutOff,finalmonthEndCutOff);
	}
	
}

function generate(principal,location,monthEndCutOff,finalmonthEndCutOff){
	//recmachcustrecord838 - Sublist ID
	//custrecord839 - Document Type
	//custrecord840 - Document Number
	//custrecord841 - Date
	
	var filter = new Array(
		new nlobjSearchFilter('location', null, 'anyof', location),
		new nlobjSearchFilter('class', null, 'anyof', principal),
		new nlobjSearchFilter('trandate', null, 'within', [finalmonthEndCutOff,monthEndCutOff])
	);
	
	var column = new Array (
		new nlobjSearchColumn('internalid'),
		new nlobjSearchColumn('type'),
		new nlobjSearchColumn('trandate'),
		new nlobjSearchColumn('location'),
		new nlobjSearchColumn('class'),
		new nlobjSearchColumn('customform')
		);
		
	var result = nlapiSearchRecord('transaction','customsearch815', filter, column);
	if(result != null){
	
		var internalid = new Array();
		var countDoc = 0;
		var validateType = '';
		var validateDate = '';
		var validateForm = '';
		
		var internalidBO = new Array();
		var countDocBO = 0;
		var typeForBO = '';
		var dateForBO = '';
		var formForBO = '';
		
		for(var i = 0; i < result.length; i++){
			
			var resultfields = result[i];
			var resultType = resultfields.getText('type');
			var resultDocNum = resultfields.getValue('internalid');
			var resultDate = resultfields.getValue('trandate');
			var resultForm = resultfields.getText('customform');
			
			if(resultType != validateType){
				if(resultForm == 'DDI Van Returns'){
					internalidBO[countDocBO] = resultDocNum;
					countDocBO++;
					typeForBO = resultType;
					dateForBO = resultDate;
					formForBO = resultForm;
				}else{
					if(internalid != ''){
						var lastTransaction = Math.max.apply(Math, internalid);
						nlapiSelectNewLineItem('recmachcustrecord838');
						nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord839',validateType + ' - ' + validateForm);
						nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord840',lastTransaction);
						nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord841',validateDate);
						nlapiCommitLineItem('recmachcustrecord838');
					}
					validateType = resultType;
					validateDate = resultDate;
					validateForm = resultForm;
					internalid.length = 0;
					countDoc = 0;
					internalid[countDoc] = resultDocNum;
					countDoc++;
				}
				
			}else{ //if equal
				if(resultForm == 'DDI Van Returns'){
					internalidBO[countDocBO] = resultDocNum;
					countDocBO++;
					typeForBO = resultType;
					dateForBO = resultDate;
					formForBO = resultForm;
				}else{
					internalid[countDoc] = resultDocNum;
					countDoc++;
				}
				
			}
		}
		var lastTransaction = Math.max.apply(Math, internalid);
		nlapiSelectNewLineItem('recmachcustrecord838');
		nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord839',validateType + ' - ' + validateForm);
		nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord840',lastTransaction);
		nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord841',validateDate);
		nlapiCommitLineItem('recmachcustrecord838');
		if(internalidBO != ''){
			var lastTransactionBO = Math.max.apply(Math, internalidBO);
			nlapiSelectNewLineItem('recmachcustrecord838');
			nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord839',typeForBO + ' - ' + formForBO);
			nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord840',lastTransactionBO);
			nlapiSetCurrentLineItemValue('recmachcustrecord838','custrecord841',dateForBO);
			nlapiCommitLineItem('recmachcustrecord838');
			internalidBO.length = 0;
			countDocBO = 0;
		}
	}
}
