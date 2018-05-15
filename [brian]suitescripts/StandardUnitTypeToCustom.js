/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Jan 2015     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type)
{
	if(type=="create")
	{
		var id = nlapiGetRecordId();
		var record = nlapiLoadRecord('unitstype', id);
		
				var rectype = 'customrecord223'; //internal id of the custom unit type
				var new_record = nlapiCreateRecord(rectype);
				new_record.setFieldValue('name', record.getFieldValue('name'));

				//nlapiLogExecution("DEBUG", "name name name custom", nlapiGetFieldValue('name'));
				
				new_record.setFieldValue('custrecord682', id); // field id of unit type
				var customsublist = 'recmachcustrecord528'; //internal id custom unit type sublist
				var count = nlapiGetLineItemCount('uom'); //internal id for standard sublist
				for(var i=1; i<= count; i++)
				{
					new_record.setLineItemValue(customsublist, 'name', i, record.getLineItemValue('uom','abbreviation',i)); //Custom Unit Name
					new_record.setLineItemValue(customsublist, 'custrecord526', i, record.getLineItemValue('uom','conversionrate',i)); //Custom Conversion
					new_record.setLineItemValue(customsublist, 'custrecord527', i, record.getLineItemValue('uom','baseunit',i)); //Custom Base Unit/Check Box
				}
				nlapiSubmitRecord(new_record, true);
	}
}
