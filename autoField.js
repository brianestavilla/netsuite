/*
 	Date : Feb. 22, 2014.
 	Author : Redemptor Enderes.
 	Reason : Revise Structure of Code.
  
*/

var sublist_cmItem = 'recmachcustrecord101';
var sublist_cmItem_fieldTaxCode = 'custrecord109';
var sublist_cmItem_fieldTaxRate = 'custrecord111';
var sublist_cmItem_fieldTaxAmount = 'custrecord113';
var sublist_cmItem_fieldItem = 'custrecord104';
var sublist_cmItem_fieldAmount = 'custrecord112';
var sublist_cmItem_fieldGrossAmount = 'custrecord110';

function fieldChange(type, name){
	
	switch(name){
	case sublist_cmItem_fieldAmount :
	case sublist_cmItem_fieldTaxCode :
		var itemid = nlapiGetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldItem);
		var taxcode = nlapiGetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldTaxCode);
		var amount = nlapiGetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldAmount);
		if(itemid != '' && taxcode != '' && amount != ''){
			var taxrate = getTaxRate(taxcode);
			var computation = computeGrossAndTaxAmount(parseFloat(amount),parseFloat(taxrate));
			nlapiSetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldTaxRate, taxrate);
			nlapiSetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldTaxAmount, computation.taxamount);
			nlapiSetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldGrossAmount, computation.grossamt);
		}else{
			nlapiSetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldTaxRate, '');
			nlapiSetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldTaxAmount, '');
			nlapiSetCurrentLineItemValue(sublist_cmItem, sublist_cmItem_fieldGrossAmount, '');
		}
		break;
	}
}

function computeGrossAndTaxAmount(amount,taxrate) {
	var ComputeObject = new Object();
	ComputeObject.grossamt = amount * (1 + (taxrate/100));
	ComputeObject.taxamount = amount * (taxrate/100);
	return ComputeObject;
}

function getTaxRate(taxcode) {
	return nlapiLookupField('salestaxitem', taxcode, 'rate');
}
