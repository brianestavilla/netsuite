function fieldChange(type, name) {
    if(name=='custbody144') {
    	nlapiLookupField(recType, recId, fldNames, isText)
		nlapiDisableField('custbody144', true);
     }
    if(name==ENTITY || name==CLASS || name==LOCATION || name==OPERATION) {
    	if(nlapiGetFieldValue(ENTITY)!='' && nlapiGetFieldValue(CLASS)!='' && nlapiGetFieldValue(LOCATION)!='' && nlapiGetFieldValue(OPERATION)!='')
    	{
            nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, false);
        }
    	else
    	{
    		nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, true);
    	}
    }

    if(name == ITEM){
        if(!ifInc()){ 
            alert(ERR_MESSAGE_INC); 
            ERR_MESSAGE_INC = "Please put value(s) for ";
        }
    }
    if(name == 'custbody172')
        alert(nlapiGetFieldValue('custbody172'));
    
    if(name == UNIT){
        if(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT) == ''){
            if(!ifInc()){ 
                alert(ERR_MESSAGE_INC); 
                ERR_MESSAGE_INC = "Please put value(s) for ";
            }else{ setPrice(true);}
        }else{
            setPrice(true);
        }
    }
    
    if(name == RATE)
        if(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, UNIT) == '') {
            if(!ifInc()){ 
                alert(ERR_MESSAGE_INC); 
                ERR_MESSAGE_INC = "Please put value(s) for ";
            }else
                setPrice(false);
        }
        else
            setPrice(true);

    if(name == 'custpage_customerlocation'){
        nlapiSetFieldValue('location', nlapiGetFieldValue('custpage_customerlocation'));
    }
}

function ifInc(){
    ENTITY_VALUE =  nlapiGetFieldValue(ENTITY);
    CLASS_VALUE =  nlapiGetFieldValue(CLASS);
    LOCATION_VALUE = nlapiGetFieldValue(LOCATION);
    OPERATION_VALUE = nlapiGetFieldValue(OPERATION);
    
    if(ENTITY_VALUE == '') {ERR_MESSAGE_INC += 'Customer '; return false;}
    else if(CLASS_VALUE == ''){ ERR_MESSAGE_INC += 'Principal '; return false;}
    else if(LOCATION_VALUE == ''){ ERR_MESSAGE_INC += 'Warehouse Location '; return false;}
    else if(OPERATION_VALUE == ''){ ERR_MESSAGE_INC += 'Operation'; return false;}
    else return true;
}

function validateLine(){

    var d1 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC1))/100,
        d2 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC2))/100,
        d3 = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC3))/100,
        d4 =  parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, DISC4))/100,
        amount = parseFloat(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT)),
        itemid = nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM),
        record = 0;
    ;
    //record = nlapiLookupField('inventoryitem', itemid, 'custitem31'); 
    
    d = (record == null || record == '') ? 0 : record/100;
    discount = amount * d;
    discount += ((amount - discount) * d1);
    discount += ((amount - discount) * d2);
    discount += ((amount - discount) * d3);
    discount += ((amount - discount) * d4);

    
    nlapiSetCurrentLineItemValue(ITEM_SUBLIST, 'custcol10', discount);
    return true;
}

function getPricing()
{
    /******* ######### ------------------- START TRANSACTION PRICING SEARCH -------------------------########## ********/
        filters = new Array (
                new nlobjSearchFilter('custrecord13', null, 'anyof', nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM)), //ITEM ID
                new nlobjSearchFilter('custrecord12', null, 'is', LOCATION_VALUE),  //LOCATION ID
                //new nlobjSearchFilter(PRICELIST, null, 'is', pricelist),  //PRICELIST ID
                new nlobjSearchFilter('custrecord28', null, 'anyof', nlapiGetFieldValue(OPERATION)) //OPERATION ID custrecord768
        );
        column = new Array(
                new nlobjSearchColumn('custrecord768', null, null)
        );
        itemPricing = nlapiSearchRecord('customrecord102', 'customsearch68', filters, column);
    /******* ######### ------------------- END TRANSACTION PRICING SEARCH -------------------------########## ********/
    return itemPricing;
}

function getDiscountPricing(ENTITY_VALUE, CLASS_VALUE)
{
    /******* ######### -------------------- START CUSTOMER DISCOUNT SEARCH -------------------------########## ********/
        filters = new Array (
                new nlobjSearchFilter('custrecord30', null, 'anyof', CLASS_VALUE), //Principal
                new nlobjSearchFilter('custrecord29', null, 'anyof', ENTITY_VALUE) //Entity
        );
        column = new Array(
                //new nlobjSearchColumn('custrecord758'), //Price List
                new nlobjSearchColumn('custrecord365'), //Discount 1
                new nlobjSearchColumn('custrecord362'), //Discount 2
                new nlobjSearchColumn('custrecord363'), //Discount 3
                new nlobjSearchColumn('custrecord364') //Discount 4
        );
        search = nlapiSearchRecord('customrecord110', null, filters, column);
    /******* ######### ------------------- END CUSTOMER DISCOUNT SEARCH -------------------------########## ********/
    return search;

}
function setPrice(condition){
    ENTITY_VALUE =  nlapiGetFieldValue(ENTITY);
    CLASS_VALUE =  nlapiGetFieldValue(CLASS);
    var discount = getDiscountPricing(ENTITY_VALUE, CLASS_VALUE);
    if(discount != null)
    {
        x1 = discount[0].getValue('custrecord365'); //Discount 1
        x2 = discount[0].getValue('custrecord362'); //Discount 2
        x3 = discount[0].getValue('custrecord363'); //Discount 3
        
        itemGroup = nlapiLookupField('inventoryitem', nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM), 'custitem95');
        
        if(itemGroup == '1'){
            x4 = discount[0].getValue('custrecord364'); //Discount 4
        }else{
            x4 = null;
        }
        
        x1 = (x1 == null || x1 == '') ? 0 : x1;
        x2 =(x2 == null || x2 == '') ? 0 : x2;
        x3 =(x3 == null || x3 == '') ? 0 : x3;
        x4 =(x4 == null || x4 == '') ? 0 : x4;
        
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC1, x1);
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC2, x2);
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC3, x3);
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, DISC4, x4);      
        
        x1 = parseFloat(x1);
        x2 = parseFloat(x2);
        x3 = parseFloat(x3);
        x4 = parseFloat(x4);
        
        itemPricing = getPricing();
        if(itemPricing != null)     {
            
            price = itemPricing[0].getValue('custrecord768');
            price_no_vat = parseFloat((price)/ 1.12).toFixed(5);
            var units_type = getUnitsType(nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM));
            var conversion_rate = (condition == true) ? conversionRate(units_type, nlapiGetCurrentLineItemText(ITEM_SUBLIST, UNIT)) : 1;
            var rate = (price_no_vat * parseInt(conversion_rate));
            if(condition){
                nlapiSetCurrentLineItemValue(ITEM_SUBLIST, RATE, rate, false);
                var gross = (nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT) == '' || nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT) == null) ? 0 : nlapiGetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT);
                var amount = parseFloat(gross),
                    itemid = nlapiGetCurrentLineItemValue(ITEM_SUBLIST, ITEM),
                    record = 0;
                
                    //record = nlapiLookupField('inventoryitem', itemid, 'custitem31');
                    
                    //d = (record == null || record == '') ? 0 : record/100;
                
                    discount = 0;
                    discount += ((amount - discount) * (x1/100));
                    discount += ((amount - discount) * (x2/100));
                    discount += ((amount - discount) * (x3/100));
                    discount += ((amount - discount) * (x4/100));
                    
                    nlapiSetCurrentLineItemValue(ITEM_SUBLIST, 'custcol10', discount);
            }
        }
        else 
            alert(ERR_MESSAGE_NO_PRICING);
    }
}

function getUnitsType(itemid){
    try{
        record = nlapiLookupField('inventoryitem', itemid, 'unitstype');
    }catch(e) {
        try{
            record = nlapiLookupField('noninventoryitem', itemid, 'unitstype');
        }catch(e){
            try{
                record = nlapiLookupField('otherchargeitem', itemid, 'unitstype');
            }catch(e){
                try{
                    record = nlapiLookupField('paymentitem', itemid, 'unitstype');
                }catch(e){
                    record = nlapiLookupField('serviceitem', itemid, 'unitstype');
                }
            }
        }
    }
    return record;
}
function setAmount(type, name){
    if(name == UNIT || name == AMOUNT){
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, RATE, 0, false);
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, AMOUNT, 0, false);
        nlapiSetCurrentLineItemValue(ITEM_SUBLIST, 'taxcode', '5', false);
    }
}

function pageInit(){
if(nlapiGetFieldValue('customform') != '170'){ //170 = free goods
    nlapiDisableLineItemField(ITEM_SUBLIST, GROSS_AMT, true);
    nlapiDisableLineItemField(ITEM_SUBLIST, RATE, true);
    nlapiDisableLineItemField(ITEM_SUBLIST, AMOUNT, true);
    nlapiDisableLineItemField(ITEM_SUBLIST, 'description', true);
    nlapiDisableLineItemField(ITEM_SUBLIST, 'tax1amt', true);
    //nlapiDisableLineItemField(ITEM_SUBLIST, 'isclosed', true);
    //nlapiDisableLineItemField(ITEM_SUBLIST, 'taxcode', true);
    nlapiDisableLineItemField(ITEM_SUBLIST, 'custcol10', true);
}else{
    nlapiDisableLineItemField(ITEM_SUBLIST, RATE, false);
    nlapiDisableLineItemField(ITEM_SUBLIST, GROSS_AMT, true);
    nlapiDisableLineItemField(ITEM_SUBLIST, AMOUNT, true);
    nlapiDisableLineItemField(ITEM_SUBLIST, 'description', true);
    nlapiDisableLineItemField(ITEM_SUBLIST, 'tax1amt', true);
    //nlapiDisableLineItemField(ITEM_SUBLIST, 'isclosed', true);
    //nlapiDisableLineItemField(ITEM_SUBLIST, 'taxcode', true);
    nlapiDisableLineItemField(ITEM_SUBLIST, 'custcol10', true);
}

    /*added 10/10/13. By Redem*/
    currentuser = nlapiGetUser();
    warehouselocation = nlapiLookupField('employee', currentuser, 'custentity39');
    if(warehouselocation == null || warehouselocation == ''){
        alert('Please provide the Fulfillment Location from your record. Contact your administrator.');
    }else{
        nlapiSetFieldValue('location', warehouselocation);
    }
    /*********************/
    
    /*added 7/7/2015 By Brian*/
    if(ENTITY_VALUE=='' || CLASS_VALUE=='' || LOCATION_VALUE=='' || nlapiGetFieldValue(OPERATION)=='') {
        nlapiDisableLineItemField(ITEM_SUBLIST, ITEM, true);
    }
    /*************************/

}
function lineInit(){
    if(nlapiGetFieldValue('customform') != '170'){ //170 = free goods
        nlapiDisableLineItemField(ITEM_SUBLIST, RATE, true);
        nlapiDisableLineItemField(ITEM_SUBLIST, AMOUNT, true);
        //nlapiDisableLineItemField(ITEM_SUBLIST, 'isclosed', true);
    }else{
        nlapiDisableLineItemField(ITEM_SUBLIST, RATE, false);
        nlapiDisableLineItemField(ITEM_SUBLIST, AMOUNT, true);
        //nlapiDisableLineItemField(ITEM_SUBLIST, 'isclosed', true);
    }
}

function conversionRate(unitstype, unitname){
    filters = new Array (
                new nlobjSearchFilter('internalid', null, 'anyof', unitstype),
                new nlobjSearchFilter('abbreviation', null, 'is', unitname)
        );

    search = nlapiSearchRecord('unitstype', 'customsearch_conversion_units', filters,  new nlobjSearchColumn('conversionrate'));
    return search[0].getValue('conversionrate');
}

function validateLineforReason(type, name){

    if(nlapiGetRecordType() != 'salesorder'){
    
        var reason = nlapiGetCurrentLineItemValue('item', 'custcol35');
        
        if(reason == ""){
            alert('Please Enter Value for Reason!');
            return false;
        }
    }
    
    return true;
}