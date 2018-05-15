var DDI_ITEM_RECEIPT = '110';
var ITEMSUBLIST = 'item';

function setValueToUnit1(type, name){
	if(nlapiGetFieldValue('customform') == DDI_ITEM_RECEIPT){
		
		//get line item total count
		var lineCount = nlapiGetLineItemCount(ITEMSUBLIST);		
		
		//loop through all line item to get the data;
		for(x = 1;x <= lineCount;x++){
			nlapiSelectLineItem(ITEMSUBLIST, x);			

			//define list column
			var fields = ['purchaseunit','custitem71','custitem72'];	

			//load item record
			var colResult = nlapiLookupField(ITEMSUBLIST,nlapiGetLineItemValue(ITEMSUBLIST,'item', x),fields);
			
			//get custom unit type id
			var CUSTOM_UNITYPE = colResult.custitem71;
			//get conversion factor
			var CONVERSION_FACTOR = colResult.custitem72;			
			
			
			//set custom unitype id to unit type line item field
			nlapiSetCurrentLineItemValue(ITEMSUBLIST, 'custcol26', CUSTOM_UNITYPE,true,true);			
			
			//nlapiSetLineItemValue(ITEMSUBLIST, 'custcol22', x, nlapiGetLineItemValue(ITEMSUBLIST,'quantityremaining',x)); 

		}	
	}
}