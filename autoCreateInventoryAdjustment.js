//script for workflow

//init
var ITEMSUBLIST = 'recmachcustrecord_col_reference';
var RRDATE = 'custrecord_field_date';
var RRDEPT = 'custrecord_field_department';
var RRLOCATION = 'custrecord_field_location';
var RRPRINCIPAL = 'custrecord_field_principal';
var RRCOL_ITEM = 'custrecord_col_item';
var RRCOL_QTY = 'custrecord_col_quantity';
var RR_REFNO = 'custrecord_field_reference_no';
var COST_OF_SALES = 126;
var VALUE = 0;
var RRPURPOSE_FIELD = 'custrecord_field_purpose';
var PURPOSE_RECORD = 'customrecord_freegood_purpose';
var ENCODER = '';

function autoCreateInventoryAdjustment(){

	//load free goods rr data
	var freeGoodsRR = nlapiGetNewRecord();
	var rrDate = freeGoodsRR.getFieldValue(RRDATE);
	var department = freeGoodsRR.getFieldValue(RRDEPT);
	var location = freeGoodsRR.getFieldValue(RRLOCATION);
	var principal = freeGoodsRR.getFieldValue(RRPRINCIPAL);
	var freeGoodsRRLineCount = freeGoodsRR.getLineItemCount(ITEMSUBLIST);
	var purpose_id = freeGoodsRR.getFieldValue(RRPURPOSE_FIELD);
	ENCODER = freeGoodsRR.getFieldValue('owner');
	var withValue = nlapiLookupField(PURPOSE_RECORD, purpose_id, 'custrecord_col_withvalue');
	
	//create record of inventory adjustment
	var inventoryAdjustment = nlapiCreateRecord('inventoryadjustment');
	
	//populate main line data to record
	inventoryAdjustment.setFieldValue('account', COST_OF_SALES); //113000 Inventories
	inventoryAdjustment.setFieldValue('trandate', rrDate);
	inventoryAdjustment.setFieldValue('department', department);
	inventoryAdjustment.setFieldValue('class', principal);
	inventoryAdjustment.setFieldValue('adjlocation', location);
	
	//var inventoryAdjustmentLineCount = inventoryAdjustment.getLineItemCount('inventory');
	
	//populate line item data to record
	for(x = 1; x <= freeGoodsRRLineCount; x++){
				
		var freeItem = freeGoodsRR.getLineItemValue(ITEMSUBLIST, RRCOL_ITEM, x);
		var freeQuantity = freeGoodsRR.getLineItemValue(ITEMSUBLIST, RRCOL_QTY, x);
		var unitsId = freeGoodsRR.getLineItemValue(ITEMSUBLIST,'custrecord_col_units',x);
				
		inventoryAdjustment.setLineItemValue('inventory','item', x, freeItem);
		inventoryAdjustment.setLineItemValue('inventory','units', x, unitsId);
		inventoryAdjustment.setLineItemValue('inventory','adjustqtyby', x, freeQuantity);
		inventoryAdjustment.setLineItemValue('inventory','location', x, location);	
		//inventoryAdjustment.setLineItemValue('inventory','unitcost', x, 100);
		//(withValue = T) ? getStockValue(freeItem) : 0);
		
	}
	var id = nlapiSubmitRecord(inventoryAdjustment, true);
	
	//set value to reference number in free goods rr data
	freeGoodsRR.setFieldValue(RR_REFNO, id);

}
getStockValue(stock_id){
	
	var reportingBranchID = nlapiLookupField('employee',ENCODER,'custentity49');
	
	filters = new Array (
			new nlobjSearchFilter('custrecord742', null, 'anyof', stock_id),
			new nlobjSearchFilter('custrecord743', null, 'is', reportingBranchID)
	);

	search = nlapiSearchRecord('customrecord252', 'customsearch524', filters,  new nlobjSearchColumn('custrecord744'));
	return search[0].getValue('custrecord744');
}
