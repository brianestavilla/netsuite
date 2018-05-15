//Additional line for nontrade PO for total quantity (Any Unit) *noeh 07/01/2014    
function computeTotalQuantity(type, form){
	var record = nlapiGetNewRecord();
	var recordType = record.getRecordType();
	var linecount = record.getLineItemCount('item');
	var totalQuantityCS = 0;
	var totalQuantityPC = 0;
	var totalQuantityRandom = 0;
	var totalQuantityAll = 0;
	for(var i = 1; i <= linecount; i++){
		var units = record.getLineItemText('item','units',i);
		switch(units){
			case 'Cs' :
			case 'cs' :
			case 'Case' :
			case 'case' :
			case 'CASE' :
			case 'CS' : var countQuantity = record.getLineItemValue('item','quantity',i) == null ? 0 : record.getLineItemValue('item','quantity',i);
			totalQuantityCS = totalQuantityCS + parseInt(countQuantity);
			break;
			case 'Pc' :
			case 'pc' :
			case 'Piece' :
			case 'piece' :
			case 'PIECE' :
			case 'PC' :var countQuantity = record.getLineItemValue('item','quantity',i) == null ? 0 : record.getLineItemValue('item','quantity',i);
			totalQuantityPC = totalQuantityPC + parseInt(countQuantity);
			break;
			default: var countQuantity = record.getLineItemValue('item','quantity',i) == null ? 0 : record.getLineItemValue('item','quantity',i);
			totalQuantityRandom = totalQuantityRandom + parseInt(countQuantity);
			break;
		}
	}
	
	if(recordType != 'invoice'){
		if(nlapiGetFieldValue('customform') == '121'){
		totalQuantityAll = totalQuantityCS + totalQuantityRandom + totalQuantityPC;
		record.setFieldValue('custbody159', totalQuantityAll);
		}else{
		record.setFieldValue('custbody159', totalQuantityCS);
		record.setFieldValue('custbody188', totalQuantityPC);
		}
	}else{
		//nlapiLogExecution('ERROR', 'ang result', totalQuantity);
		record.setFieldValue('custbody_txtquantity', totalQuantityCS);
		record.setFieldValue('custbody_txtquantitypc', totalQuantityPC);
	}
}