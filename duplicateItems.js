/*
* Description: Check duplicate items and units
* Author : Vanessa Sampang
*
	Updated by : Redem
        Date : Jan. 25, 2014.
	Reason : Edit script in detecting duplicate item.
			 Add function to auto fill up memo if Free Goods
			 Add function before saving to check if amount is not 0.00 if Free Goods.
*/

function validateLineDup()
{

	var currentitem = nlapiGetCurrentLineItemValue('item', 'item'); //gets Item ID
	var currentunit = nlapiGetCurrentLineItemValue('item', 'units'); // gets unit ID
	var linecount = nlapiGetLineItemCount('item');
	var dupItem = nlapiFindLineItemValue('item', 'item', currentitem);
	var dupUnits = nlapiFindLineItemValue('item', 'units', currentunit);
  	var _dupUnits = nlapiGetLineItemValue('item', 'units', dupItem);
  
	if(dupItem > 0 && _dupUnits == currentunit){
		if(nlapiGetCurrentLineItemIndex('item') == dupItem){
			return true;
		}else{
			alert('Duplicate Items and units detected!');
			nlapiSelectNewLineItem('item');
			return false;
		}
	}else{
		return true;
	}
	
	
	/* OLD script for detecting duplicate Item
	var hash = new Object();	
	var item = nlapiGetCurrentLineItemValue('item', 'item'); //gets Item ID
	var unit = nlapiGetCurrentLineItemValue('item', 'units'); // gets unit ID
	hash[item + unit] = item + unit; //concatenate Item ID and Unit ID
	for(var i = 1; i <= nlapiGetLineItemCount('item'); i++)
	{
		item = nlapiGetLineItemValue('item', 'item', i);
		unit = nlapiGetLineItemValue('item', 'units', i);
		if(hash.hasOwnProperty(item + unit) && !(nlapiIsLineItemChanged('item'))) //Checks if Item ID and Unit ID already exist
		{
			alert("Duplicate Items and units detected");
			return false; //return false to deny adding line item
		}
		else hash[item + unit] = item + unit;
	}
	return true;
	*/
}

function freeGoodsDup(){
	var form = nlapiGetFieldValue('customform');
		if(form == '170'){ // 170 = free goods form
			nlapiSetFieldValue('memo', 'Free Goods'); // memo
		}
}

function beforeSaveDup(){
	var totalamt = nlapiGetFieldValue('total');

	if(nlapiGetRecordType() == 'salesorder') { //|| nlapiGetRecordType() == 'invoice') {
		if(nlapiGetFieldValue('customform') == '170'){ //170 = free goods
			if(totalamt > 0.00){
				alert('Amount should be zero (0.00).');
				return false;
			}else{
				return true;
			}
		}else{

			if(totalamt == 0.00){
				alert('Total amount should not be zero (0.00)!');
				return false;
			}
			return true;
		}
	}

	if(nlapiGetRecordType() == 'purchaseorder')
	{
		var location = nlapiGetFieldText('location');
		
		if(totalamt == '0.00' && location.match(/FREE/gi) == null){
			alert('Total amount should not be zero!');
			return false;
		}

		return true;
	}
  
  return true;
}