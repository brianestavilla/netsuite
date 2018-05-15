/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       08 Jan 2016     Redemptor	 PR : To show last puchase price and vendor in line item
 *
 */

var fieldLocation = 'custrecord76';

var itemSublist = 'recmachcustrecord33';
var itemSublist_fieldItem = 'custrecord34';
var itemSublist_fieldLastPrice = 'custrecord887';
var itemSublist_fieldSource = 'custrecord888';

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum){
	
	if(name == itemSublist_fieldItem){
		var param = {
			location : nlapiGetFieldText(fieldLocation),
			item : nlapiGetCurrentLineItemValue(itemSublist, itemSublist_fieldItem)
		};
		
		var result = getLastPurchasePrice(param);
		
		if(result != null){
			var rate = result.getText('taxcode') == 'UNDEF_PH' ? parseFloat(result.getValue('rate')) : parseFloat(result.getValue('rate') * 1.12);
			nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldLastPrice, rate.toFixed(2));
			nlapiSetCurrentLineItemValue(itemSublist, 
					itemSublist_fieldSource, 
					nlapiLookupField('purchaseorder', result.getValue('internalid'), 'entity', true));
		}else{
			nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldLastPrice, 0.00);
			nlapiSetCurrentLineItemValue(itemSublist, itemSublist_fieldSource,'');
		}
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLine(type){
	
	if(nlapiGetFieldValue(fieldLocation) == ''){
		alert('Location Empty!');
		return false;
	}
	
    return true;
}


/** 
 * @param {Object} parameters
 */
function getLastPurchasePrice(parameters){

	var filters = [
	    new nlobjSearchFilter('item',null,'is', parameters.item),
	    new nlobjSearchFilter('formulatext',null,'contains', parameters.location.substring(0, 4).toUpperCase())
	];
	filters[1].setFormula('{location}');
	
	var columns = [
	    new nlobjSearchColumn('internalid'),
	    new nlobjSearchColumn('trandate'),
	    new nlobjSearchColumn('rate'),
	    new nlobjSearchColumn('taxcode')
	];
	columns[1].setSort(true);
	
	var final_result = null;

	var result = nlapiSearchRecord('purchaseorder', null, filters, columns);
	
	if(result != null){
		final_result = result[0];
	}else{
		
		filters.splice(1, 1);
		filters.push(new nlobjSearchFilter('formulatext',null,'contains', 'CEBU'));
		filters[1].setFormula('{location}');
		
		var result_2 = nlapiSearchRecord('purchaseorder', null, filters, columns);
		
		if(result_2 != null){
			final_result = result_2[0];
		}
	}

	return final_result;
}
