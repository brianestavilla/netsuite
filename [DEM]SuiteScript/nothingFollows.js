/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       16 Aug 2016     Redemptor		Add ***nothing follows*** item
 *
 */


var item_nothingfollows = '56651'; //sandbox 56075 : live 56651 

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit
 *                      approve, reject, cancel (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF)
 *                      markcomplete (Call, Task)
 *                      reassign (Case)
 *                      editforecast (Opp, Estimate)
 * @returns {Void}
 */
function userEventBeforeSubmit(type){
	
	var record = nlapiGetNewRecord();
	
	//121 = DDI Non-Trade PO, 162 = DDI Non-Trade PO(transpo)
	if(record.getFieldValue('customform') == '121' || record.getFieldValue('customform') == '161')
	{
		if(record.findLineItemValue('item', 'item', item_nothingfollows) == -1)
		{
			record.selectNewLineItem('item');
			
			record.setCurrentLineItemValue('item', 'item', item_nothingfollows);
			
			record.commitLineItem('item');
		}
		
	}
 
}
