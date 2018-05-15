/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Jul 2015     Dranix
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type)
{
    if(type=='create' || type=='copy') {
        nlapiSetFieldValue('custbody8', nlapiGetUser()); // set received by
        var custom_form = nlapiGetFieldValue('customform');
        
        /** 167 = DDI IR - T.O Inter-Branch;
        **  177 = DDI IR - Warehouse Transfer;
        **  164 = DDI IR - T.O Good to BO;
        **  174 = DDI IR - P.O/T.O FreeGoods;
        **  166 = DDI IR - T.O Van Load / Return;
        **  110 = DDI Item Receipt;
        **/
        
        //if(nlapiGetRole()!='3') { // User Role should not be Administrator
            if(custom_form == 167 || custom_form == 177 || custom_form == 164 || custom_form == 174) {
                try {
                    var record = nlapiLoadRecord('transferorder', nlapiGetFieldValue('createdfrom'));
                    for(var i=1; i<=nlapiGetLineItemCount('item'); i++) {
                          nlapiSetLineItemValue('item', 'custcol25', i, record.getLineItemValue('item', 'rate', record.findLineItemValue('item', 'item', nlapiGetLineItemValue('item','item',i))));
                    }//end for
                } catch (e) {
                    var record = nlapiLoadRecord('purchaseorder', nlapiGetFieldValue('createdfrom'));
                    for(var i=1; i<=nlapiGetLineItemCount('item'); i++) {
                    	nlapiSetLineItemValue('item', 'custcol25', i, record.getLineItemValue('item', 'rate', record.findLineItemValue('item', 'item', nlapiGetLineItemValue('item','item',i))));
                    }//end for
                }
            } else if (custom_form == 166) {
                var record = nlapiLoadRecord('transferorder', nlapiGetFieldValue('createdfrom'));
                for(var i=1; i<=nlapiGetLineItemCount('item'); i++) {
                	nlapiSetLineItemValue('item', 'custcol25', i, record.getLineItemValue('item', 'custcol30', record.findLineItemValue('item', 'item', nlapiGetLineItemValue('item','item',i))));
                }//end for
            } else if(custom_form == 110) {
                var record = nlapiLoadRecord('purchaseorder', nlapiGetFieldValue('createdfrom'));
                for(var i=1; i<=nlapiGetLineItemCount('item'); i++) {
                      nlapiSetLineItemValue('item', 'custcol25', i, record.getLineItemValue('item', 'rate', record.findLineItemValue('item', 'item', nlapiGetLineItemValue('item','item',i))));
//                            for(var j=1; j<=record.getLineItemCount('item'); j++) {
//                                if(nlapiGetLineItemValue('item','item',i)==nlapiGetLineItemValue('item','item',j)) {
//                                    nlapiSetLineItemValue('item', 'custcol25', i, record.getLineItemValue('item', 'rate', j));
//                                    break;
//                                }
//                            }
                }//end for
            }
        //}
    }
}