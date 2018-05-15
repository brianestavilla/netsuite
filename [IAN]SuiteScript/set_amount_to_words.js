/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Jul 2014     MYMEG
 *
 */
var	BO_ALLOWANCE = '36534';//'36333',
	SALES_DISCOUNT = '30362';
/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord invoice 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
   
	if(nlapiGetFieldValue('createdfrom') == null) return;
	
	updateAmountInWords();
	
	var lineCount = nlapiGetLineItemCount('item');
	
	for(var i = 1; i<=lineCount;i++){
		reapplyDiscount(i);
	}
	
	removeDiscounts();
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientRecalc(type){
	
	if(type != 'item') return;
	
	updateAmountInWords();
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){

	updateAmountInWords();
    return true;
}
function updateAmountInWords(){
	
	var totalAmountInWords = toWords(nlapiGetFieldValue('total'));
	
	nlapiSetFieldValue('custbody117', totalAmountInWords);
}

function removeDiscounts(){	

	nlapiRemoveLineItem('item', nlapiFindLineItemValue('item', 'item', BO_ALLOWANCE));
	nlapiRemoveLineItem('item', nlapiFindLineItemValue('item', 'item', SALES_DISCOUNT));

}

function reapplyDiscount(line){

	var d1 = parseFloat(nlapiGetLineItemValue('item', 'custcol6', line))/100,
		d2 = parseFloat(nlapiGetLineItemValue('item', 'custcol7', line))/100,
		d3 = parseFloat(nlapiGetLineItemValue('item', 'custcol8', line))/100,
		d4 =  parseFloat(nlapiGetLineItemValue('item', 'custcol9', line))/100,
		amount = parseFloat(nlapiGetLineItemValue('item', 'amount', line)),
		//itemid = nlapiGetLineItemValue('item', 'item', line),
		record = 0;
	;
	//record = nlapiLookupField('inventoryitem', itemid, 'custitem31');	
	
	d = (record == null || record == '') ? 0 : record/100;
	discount = amount * d;
	discount += ((amount - discount) * d1);
	discount += ((amount - discount) * d2);
	discount += ((amount - discount) * d3);
	discount += ((amount - discount) * d4);

	
	nlapiSetLineItemValue(ITEM_SUBLIST, 'custcol10', line, discount);
	return true;
}
