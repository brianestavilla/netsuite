/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Aug 2016     Redemptor
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientPageInitRemoveNothingFollow(type) {
	var item_nothingfollows = '56651'; //sandbox 56075 : live 56651

	var line = nlapiFindLineItemValue('item', 'item', item_nothingfollows);
	if(parseInt(line) > 0) {
		nlapiRemoveLineItem('item', line);
	}
}
