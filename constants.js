/**
 * 
 * Author: Vanessa Sampang
 * vpsampang@cloudtecherp.com 
 * Library Variables: Transaction Type is Sales Order
 *
 */

/** ##### START MAINLINE IDS ##### **/
var ENTITY = 'entity',
	CLASS = 'class',
	LOCATION = 'location',
	PRICELIST = 'custrecord352',
	OPERATION = 'custbody69',
/** ##### END MAINLINE IDS ##### **/

	ENTITY_VALUE = nlapiGetFieldValue('entity'),
	CLASS_VALUE = nlapiGetFieldValue('class'),
	LOCATION_VALUE = nlapiGetFieldValue('location'),
	
/** ##### START SUBLIST IDS ##### **/
	ITEM = 'item',
	ITEM_SUBLIST = 'item',
	ITEM_CATEGORY = 'custitem7',
	QUANTITY = 'quantity',
	UNIT = 'units',
	GROSS_AMT = 'grossamt',
	RATE = 'rate',
	TO_SALESPRICE = 'custcol25',
	DISC1 = 'custcol6',
	DISC2 = 'custcol7',
	DISC3 = 'custcol8',
	DISC4 = 'custcol9',
	AMOUNT = 'amount',
	TAXRATE = 'taxrate1',
/** ##### END SUBLIST IDS ##### **/
	


/** ##### START ERROR MESSAGES ##### **/
	ERR_MESSAGE_CUSTOMER = 'Please choose a Customer',
	ERR_MESSAGE_LOCATION = 'Select the Location of the Customer',
	ERR_MESSAGE_PRINCIPAL = 'Select a Principal for this transaction',
	ERR_MESSAGE_AREA = 'Please Setup you customer properly, provide a value for Area',
	ERR_MESSAGE_NO_PRICING = 'No available item pricing for this customer. \r\n Please setup your customer record and items properly.',
	ERR_MESSAGE_INC = "Please put value(s) for "
;
/** ##### END ERROR MESSAGES ##### **/