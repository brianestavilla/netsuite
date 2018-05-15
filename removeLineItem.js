function removeDiscount(type, name)
{

		var line = nlapiFindLineItemValue('item', 'item', '595');
		if(parseInt(line) > -1)
		{
			nlapiRemoveLineItem('item', line+1);
			nlapiRemoveLineItem('item', line);
		}

}

function remove(){
if(nlapiGetCurrentLineItemValue('item', 'item') == '595')
{
nlapiRemoveLineItem('item', nlapiGetCurrentLineItemIndex('item'));
}
}