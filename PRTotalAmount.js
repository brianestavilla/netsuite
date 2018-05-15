/*
 * 	Author : Redemptor Enderes.
 * 	Revised Date : Feb. 27, 2014
 * 	Description : Client script for Purchase Requisition.
 */

//Sublist Item Fields
var itemSublist = 'recmachcustrecord33';
var itemSublist_fieldItem = 'custrecord34';
var itemSublist_fieldDescription = 'custrecord46';
var itemSublist_fieldQtyOnHand = 'custrecord47';
var itemSublist_fieldQtyOrder = 'custrecord48';
var itemSublist_fieldUnit = 'custrecord49';
var itemSublist_fieldUnitCost = 'custrecord58';
var itemSublist_fieldAmount = 'custrecord59';
var itemSublist_fieldFinalVendor = 'custrecord380';
var itemSublist_fieldFinalTerms = 'custrecord381';
var itemSublist_fieldTaxCode = 'custrecord607';
var itemSublist_fieldTaxRate = 'custrecord608';
var itemSublist_fieldTaxAmount = 'custrecord610';
var itemSublist_fieldGrossAmount = 'custrecord609';
var itemSublist_fieldApprove1 = 'custrecordapprove1';
var itemSublist_fieldVendor1 = 'custrecordvendor1';
var itemSublist_fieldPrice1 = 'custrecordamount1';
var itemSublist_fieldDays1 = 'custrecorddays1';
var itemSublist_fieldApprove2 = 'custrecordapprove2';
var itemSublist_fieldVendor2 = 'custrecordvendor2';
var itemSublist_fieldPrice2 = 'custrecordamount2';
var itemSublist_fieldDays2 = 'custrecorddays2';
var itemSublist_fieldApprove3 = 'custrecordapprove3';
var itemSublist_fieldVendor3 = 'custrecordvendor3';
var itemSublist_fieldPrice3 = 'custrecordamount3';
var itemSublist_fieldDays3 = 'custrecorddays3';

function PrTotalAmount(type,name){ //validate line - add
	var compute = new Object();
	compute.UnitCost = '';
	compute.Amount = '';
	compute.TaxAmount = '';
	compute.GrossAmount = '';
	var finalVendor = '';
	var finalTerms = '';
	
	var sublist_fields = getCurrentLineValue();
	var currentitem = sublist_fields.Item;
	var currentunit = sublist_fields.Unit;
	
	if(!isDuplicateItem(currentitem,currentunit)){
		if(sublist_fields.Approve1 == 'T' && sublist_fields.Vendor1 != '' && sublist_fields.Price1 != '' && sublist_fields.Days1 != ''){
			compute = computation(sublist_fields.QtyOrder,sublist_fields.Price1,sublist_fields.TaxRate);
			finalVendor = sublist_fields.Vendor1;
			finalTerms = sublist_fields.Days1;
		}else if(sublist_fields.Approve2 == 'T' && sublist_fields.Vendor2 != '' && sublist_fields.Price2 != '' && sublist_fields.Days2 != ''){
			compute = computation(sublist_fields.QtyOrder,sublist_fields.Price2,sublist_fields.TaxRate);
			finalVendor = sublist_fields.Vendor2;
			finalTerms = sublist_fields.Days2;
		}else if(sublist_fields.Approve3 == 'T' && sublist_fields.Vendor3 != '' && sublist_fields.Price3 != '' && sublist_fields.Days3 != ''){
			compute = computation(sublist_fields.QtyOrder,sublist_fields.Price3,sublist_fields.TaxRate);
			finalVendor = sublist_fields.Vendor3;
			finalTerms = sublist_fields.Days3;
		}
		
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldUnitCost, compute.UnitCost);
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldAmount, compute.Amount);
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldFinalVendor, finalVendor);
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldFinalTerms, finalTerms);
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldTaxAmount, compute.TaxAmount);
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldGrossAmount, compute.GrossAmount);
		
		return true;
	}else{
		alert('Duplicate Items and units detected!');
	}
}

function computeTotalAmount(type,name){ //field change
	var location = nlapiGetFieldValue('custrecord76');
	var currentLineValue = getCurrentLineValue();
	
	switch(name){
	case itemSublist_fieldTaxCode :
		var taxcode = nlapiGetCurrentLineItemValue(itemSublist, itemSublist_fieldTaxCode);
		nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldTaxRate, getTaxRate(taxcode));
		break;
	case 'custrecord76' : // location
		var lineValue = getLineValue();
		for(var i = 0; i < lineValue.length; i++){
			nlapiRemoveLineItem(itemSublist,i + 1);
		}
		break;
	case itemSublist_fieldItem :
		if(location != ''){
			nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldQtyOnHand, getQtyOnHand(getCurrentLineValue().Item,location));
		}else{
			alert('Location Empty!');
		}
		nlapiSetCurrentLineItemValue(itemSublist,itemSublist_fieldQtyOrder,'1');
		break;
	case itemSublist_fieldApprove1 :
		if(currentLineValue.Approve1 == 'T'){
			if(currentLineValue.Approve2 == 'T' || currentLineValue.Approve3 == 'T'){
				nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldApprove2, 'F');
				nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldApprove3, 'F');
			}
		}
		break;
	case itemSublist_fieldApprove2 :
		if(currentLineValue.Approve2 == 'T'){
			if(currentLineValue.Approve1 == 'T' || currentLineValue.Approve3 == 'T'){
				nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldApprove1, 'F');
				nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldApprove3, 'F');
			}
		}
		break;
	case itemSublist_fieldApprove3 :
		if(currentLineValue.Approve3 == 'T'){
			if(currentLineValue.Approve1 == 'T' || currentLineValue.Approve2 == 'T'){
				nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldApprove1, 'F');
				nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldApprove2, 'F');
			}
		}
		break;
	}
}

function computeTotalAmountinBodyField(){ //Recalc
	
	var lineValue = getLineValue();
	var totalAmount = 0;
	var countValidateApprove = 0;
	var countValidateCanvass = 0;
	
	for(var i = 0; i < lineValue.length; i++){
		lineValueResult = lineValue[i];
		if(lineValueResult.GrossAmount != ''){
			totalAmount += parseFloat(lineValueResult.GrossAmount); 
			countValidateApprove += parseInt(validateApprove(lineValueResult.FinalVendor,lineValueResult.Amount));
		}
		countValidateCanvass += parseInt(validateCanvass(lineValueResult.Vendor1,lineValueResult.Vendor2,lineValueResult.Vendor3));
	}
	
	nlapiSetFieldValue('custrecord348',totalAmount,true,true); //set value for total amount
	setValidateApprove(countValidateApprove);
	setValidateCanvass(countValidateCanvass,lineValue);
}


function pageInit(type,name){ // pageInit
	if(type == 'create'){
		//vendor
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldVendor1, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldVendor2, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldVendor3, true);
		
		//price
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldPrice1, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldPrice2, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldPrice3, true);
		
		//days
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldDays1, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldDays2, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldDays3, true);
		
		//approve
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldApprove1, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldApprove2, true);
		nlapiDisableLineItemField(itemSublist,itemSublist_fieldApprove3, true);

		//pr number
		nlapiDisableField('name',true);
	}

	if(type == 'edit'){
		var getrole = nlapiGetRole();
		var typeee = nlapiGetFieldValue('custrecord41');
		
		// 1039 = Purchasing Clerk, 1048 = Purchasing Clerk - Branch
		if(getrole == '1048' || (getrole == '1039' && (typeee == '16' || typeee == '13' || typeee == '12' || typeee == '14' || typeee == '17'))){ 
			//approve
			nlapiDisableLineItemField(itemSublist,itemSublist_fieldApprove1, true); // check box = disabled
			nlapiDisableLineItemField(itemSublist,itemSublist_fieldApprove2, true); // check box = disabled
			nlapiDisableLineItemField(itemSublist,itemSublist_fieldApprove3, true); // check box = disabled
		}
	}
}

function getCurrentLineValue(){
	var CurrentLineValue = new Object();
	CurrentLineValue.Item = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldItem);
	CurrentLineValue.Description = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldDescription);
	CurrentLineValue.QtyOnHand = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldQtyOnHand);
	CurrentLineValue.QtyOrder = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldQtyOrder);
	CurrentLineValue.Unit = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldUnit);
	CurrentLineValue.UnitCost = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldUnitCost);
	CurrentLineValue.Amount = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldAmount);
	CurrentLineValue.FinalVendor = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldFinalVendor);
	CurrentLineValue.FinalTerms = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldFinalTerms);
	CurrentLineValue.TaxCode = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldTaxCode);
	CurrentLineValue.TaxRate = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldTaxRate);
	CurrentLineValue.TaxAmount = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldTaxAmount);
	CurrentLineValue.GrossAmount = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldGrossAmount);
	CurrentLineValue.Approve1 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldApprove1);
	CurrentLineValue.Vendor1 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldVendor1);
	CurrentLineValue.Price1 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldPrice1);
	CurrentLineValue.Days1 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldDays1);
	CurrentLineValue.Approve2 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldApprove2);
	CurrentLineValue.Vendor2 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldVendor2);
	CurrentLineValue.Price2 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldPrice2);
	CurrentLineValue.Days2 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldDays2);
	CurrentLineValue.Approve3 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldApprove3);
	CurrentLineValue.Vendor3 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldVendor3);
	CurrentLineValue.Price3 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldPrice3);
	CurrentLineValue.Days3 = nlapiGetCurrentLineItemValue(itemSublist,itemSublist_fieldDays3);
	return CurrentLineValue;
}

function getLineValue(){
	var lineValue_Array = new Array();
	var linecount = nlapiGetLineItemCount(itemSublist);
	
	for(var i = 1; i <= linecount; i++){
		var LineValue = new Object();
		LineValue.Item = nlapiGetLineItemValue(itemSublist,itemSublist_fieldItem,i);
		LineValue.Description = nlapiGetLineItemValue(itemSublist,itemSublist_fieldDescription,i);
		LineValue.QtyOnHand = nlapiGetLineItemValue(itemSublist,itemSublist_fieldQtyOnHand,i);
		LineValue.QtyOrder = nlapiGetLineItemValue(itemSublist,itemSublist_fieldQtyOrder,i);
		LineValue.Unit = nlapiGetLineItemValue(itemSublist,itemSublist_fieldUnit,i);
		LineValue.UnitCost = nlapiGetLineItemValue(itemSublist,itemSublist_fieldUnitCost,i);
		LineValue.Amount = nlapiGetLineItemValue(itemSublist,itemSublist_fieldAmount,i);
		LineValue.FinalVendor = nlapiGetLineItemValue(itemSublist,itemSublist_fieldFinalVendor,i);
		LineValue.FinalTerms = nlapiGetLineItemValue(itemSublist,itemSublist_fieldFinalTerms,i);
		LineValue.TaxCode = nlapiGetLineItemValue(itemSublist,itemSublist_fieldTaxCode,i);
		LineValue.TaxRate = nlapiGetLineItemValue(itemSublist,itemSublist_fieldTaxRate,i);
		LineValue.TaxAmount = nlapiGetLineItemValue(itemSublist,itemSublist_fieldTaxAmount,i);
		LineValue.GrossAmount = nlapiGetLineItemValue(itemSublist,itemSublist_fieldGrossAmount,i);
		LineValue.Approve1 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldApprove1,i);
		LineValue.Vendor1 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldVendor1,i);
		LineValue.Price1 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldPrice1,i);
		LineValue.Days1 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldDays1,i);
		LineValue.Approve2 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldApprove2,i);
		LineValue.Vendor2 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldVendor2,i);
		LineValue.Price2 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldPrice2,i);
		LineValue.Days2 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldDays2,i);
		LineValue.Approve3 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldApprove3,i);
		LineValue.Vendor3 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldVendor3,i);
		LineValue.Price3 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldPrice3,i);
		LineValue.Days3 = nlapiGetLineItemValue(itemSublist,itemSublist_fieldDays3,i);
		lineValue_Array.push(LineValue);
	}
	
	return lineValue_Array;
}

function isDuplicateItem(item,unit){
	var result = true;
	var dupItem = nlapiFindLineItemValue(itemSublist, itemSublist_fieldItem, item);
	var dupUnits = nlapiFindLineItemValue(itemSublist, itemSublist_fieldUnit, unit);
	
	if(dupItem > 0 && dupUnits > 0){
		if(nlapiGetCurrentLineItemIndex(itemSublist) == dupItem){
			result = false;
		}else{
			nlapiSelectNewLineItem(itemSublist);
			result = true;
		}
	}else{
		result = false;
	}
	
	return result;
}

function validateApprove(vendor,amount) {
	var result = 0;
	if(vendor != '' && amount != '') // if vendor and amount is not empty then
	{
		result = 1;
	}
	
	return result;
}

function validateCanvass(vendor1,vendor2,vendor3){
	var result = 0;
	if(vendor1 != '' || vendor2 != '' || vendor3 != '') // if vendor and amount is not empty then
	{
		result = 1;
	}
	
	return result;
}

function setValidateApprove(count){
	if(count <= 0){ 
		nlapiSetFieldValue('custrecord426','F');
	}else{
		nlapiSetFieldValue('custrecord426','T');
	}
}

function setValidateCanvass(count,lineValue){
	if(count <= 0 || count != lineValue.length){
		nlapiSetFieldValue('custrecord596','F');
	}else{
		nlapiSetFieldValue('custrecord596','T');
	}
}

function computation(quantityOrder,canvassPrice,taxrate){
	var ComputeObject = new Object();
	var taxRate = '1.' + parseFloat(taxrate);
	quantityOrder = quantityOrder == '' ? 0 : quantityOrder;
	canvassPrice = canvassPrice == '' ? 0 : canvassPrice;
	ComputeObject.UnitCost = parseFloat(canvassPrice) / taxRate;
	ComputeObject.Amount = parseFloat(quantityOrder) * ComputeObject.UnitCost;
	ComputeObject.TaxAmount = ComputeObject.Amount * (parseFloat(taxrate) / 100);
	ComputeObject.GrossAmount = ComputeObject.Amount * taxRate;
	return ComputeObject;
}

function getTaxRate(taxcode) {
	return nlapiLookupField('salestaxitem', taxcode, 'rate');
}

function getQtyOnHand(item,location){
	var onhand = 0;
	var filter = new Array(
			new nlobjSearchFilter('internalid',null,'is',item),
			new nlobjSearchFilter('internalid','inventoryLocation','is',location));
		var column = new Array(
			new nlobjSearchColumn('description'),
			new nlobjSearchColumn('locationquantityonhand'));
			
		var srhrecord = nlapiSearchRecord('item', 'customsearch119', filter, column);
		if(srhrecord != null) {
			onhand = srhrecord[0].getValue('locationquantityonhand');
		}
	return onhand;
}