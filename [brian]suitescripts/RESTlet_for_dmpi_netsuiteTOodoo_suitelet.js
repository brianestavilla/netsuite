/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Mar 2016     Brian			   this script is the restful way to increase number of invoices to be exported before it exceed the usage limit.
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {
	if(dataIn.type=="invoice") {
		var record = loadRecord(dataIn.type,dataIn.invoice_internalid);
		var lineitems=[];
		for(var i=1,counter=record.getLineItemCount('item'); i<=counter; i++) {
			lineitems.push({
				internalid: record.getLineItemValue('item', 'item', i),
				unit: record.getLineItemText('item', 'units', i),
				itemcode: getItemCode(record.getLineItemValue('item', 'item', i)),
             	itemid: nlapiLookupField('inventoryitem', record.getLineItemValue('item', 'item', i), 'itemid'),
				quantity: record.getLineItemValue('item', 'quantity', i),
                discount1: record.getLineItemValue('item', 'custcol6', i)
			});
		}
		
		return {
			entityid : record.getFieldValue('entity'),
			entityname : record.getFieldText('entity'),
			externalinvoice : record.getFieldValue('custbody178'),
			transdate : record.getFieldValue('trandate'),
			lineitems : lineitems
		};
	}
	
	if(dataIn.type=='returnauthorization') {
		var record = loadRecord(dataIn.type,dataIn.ira_internalid);
		var lineitems=[];
		for(var i=1,counter=record.getLineItemCount('item'); i<=counter; i++) {
			lineitems.push({
				internalid: record.getLineItemValue('item','item',i),
				unit: record.getLineItemText('item','units',i),
				reason: record.getLineItemText('item','custcol35',i),
				itemcode: getItemCode(record.getLineItemValue('item','item',i)),
				quantity: record.getLineItemValue('item','quantity',i),
			});
		}
		
		return {
			entityid : record.getFieldValue('entity'),
			entityname : record.getFieldText('entity'),
			externalinvoice : record.getFieldValue('custbody178'),
			transdate : record.getFieldValue('trandate'),
			lineitems : lineitems
		};
	}
	
}

/**
 * GET ITEM CODE
 * @param item
 * @returns
 */
function getItemCode(item){
	return nlapiLookupField('inventoryitem', item, 'custitem10');
}

/**
 * LOAD INVOICE
 * @param item
 * @returns
 */
function loadRecord(type, internalid) {
	return nlapiLoadRecord(type, internalid);
}