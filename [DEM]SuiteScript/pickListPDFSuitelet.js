/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Oct 2014     Redemptor
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function suitelet(request, response){
    if(request.getMethod() == 'GET'){
        var form = nlapiCreateForm('Choose a location');
        
        //location filter
        form.addField('cust_location', 'select', 'Location', 'Location').setDefaultValue(nlapiLookupField('employee', nlapiGetUser(), 'custentity39'));
        form.addField('principal', 'select', 'Principal','classification'); 
      
        form.addSubmitButton('Submit');
        
        nlapiGetContext().setSessionObject('status', 'get');
        response.writePage(form);
    } else {
        var location = request.getParameter('cust_location');
        if(nlapiGetContext().getSessionObject('status') == 'get'){

            var principal = request.getParameter('principal');
            var form = nlapiCreateForm('Sales Order Item List');
            form.addSubmitButton('Pick List Preview');
            
            // Updated by : Redemptor Enderes
            // Date : Jan. 13, 2014
            // Purpose : Add filter in location
            
            //Pick List # field
            var picknumber = form.addField('pickingnumber', 'text', 'Picking List # '); 
            picknumber.setDisplayType('inline');
            picknumber.setDefaultValue('To be generated');
            
            //Truck Number field
            form.addField('trucknumber', 'text', 'Truck Plate # '); 
            
            //Trucker's Name
            form.addField('truckersname', 'text', "Trucker's Name");
            
            //Date Received
            form.addField('datereceived', 'date', 'Date Received');
            
            //Creatvalue into the current user
            var prepared = form.addField('prepared', 'select', 'Prepared By' , 'employee');
            prepared.setDefaultValue(nlapiGetUser());
            
            //Create Form Sublist
            var sublist = form.addSubList('cust_sublist', 'list', 'Items');
            sublist.addMarkAllButtons();
            sublist.addRefreshButton();
            sublist.addField('ifpick', 'checkbox', 'Pick');
            var internal = sublist.addField('internalid', 'text', 'Internal Id');
            internal.setDisplayType('hidden');
            sublist.addField('number', 'text', 'SO Number');
            sublist.addField('billaddress', 'text', 'Bill Address');
            sublist.addField('name_display', 'text', 'Customer');
            
            //shows all values of the "query result" in the interface
            sublist.setLineItemValues(getSO(location));
            
            nlapiGetContext().setSessionObject('status', 'getagain');
            nlapiGetContext().setSessionObject('principal', principal);
            //form.setScript('customscript439'); 
            response.writePage(form);
        } else {
            var form = nlapiCreateForm('Pick List Preview'),
                trucknumber = request.getParameter('trucknumber'),
                truckersname = request.getParameter('truckersname'),
                datereceived = request.getParameter('datereceived'),
                prepared = request.getParameter('prepared'),
                linecount = request.getLineItemCount('cust_sublist'),
                principal = nlapiGetContext().getSessionObject('principal');
          
            if(nlapiGetContext().getSessionObject('status') == 'getagain') {
                form.addSubmitButton('Print Pick List');
                form.addField('pickingnumber', 'text', 'Picking List # ').setDefaultValue('To be generated');
                    form.getField('pickingnumber').setDisplayType('inline');    
                form.addField('trucknumber', 'text', 'Truck # ').setDefaultValue(trucknumber);
                    form.getField('trucknumber').setDisplayType('inline');
                form.addField('truckersname', 'text', "Trucker's Name").setDefaultValue(truckersname);
                    form.getField('truckersname').setDisplayType('inline');
                form.addField('datereceived', 'date', 'Date Received').setDefaultValue(datereceived);
                    form.getField('datereceived').setDisplayType('inline');
                form.addField('prepared', 'select', 'Prepared By ', 'employee').setDefaultValue(prepared);
                    form.getField('prepared').setDisplayType('inline');
                
                var numbers = new Array();
                var ids = '';
                sonum = '';
                o = 0;
                
                //Checks all checked SO to be consolidated in Pick List report
                for(var i = 1; i <= linecount; i++){
                if(request.getLineItemValue('cust_sublist', 'ifpick', i) == 'T'){
                        numbers[o] = request.getLineItemValue('cust_sublist', 'internalid', i);
                        ids += request.getLineItemValue('cust_sublist', 'internalid', i);
                        sonum += request.getLineItemValue('cust_sublist', 'number', i);
                        if(i != linecount) {ids += "_"; sonum += ',';}
                        o++;
                    }
                }
                
                var sublist = form.addSubList('sublist', 'list', 'Items');
                	sublist.addField('number', 'text', 'SO Number');
 	                sublist.addField('name_display', 'text', 'Customer');
 	                sublist.addField('item_display', 'text', 'Item');
 	                sublist.addField('custitem10', 'text', 'Product Code');
 	                sublist.addField('custitem11', 'text', 'Description');
 	                sublist.addField('unit', 'text', 'Unit');
 	                sublist.addField('formulanumeric', 'integer', 'Quantity Per CASE');
 	                sublist.addField('formulanumericinpcs', 'text', 'Quantity Per PIECE');
              
                if(principal == '7') {
                  var columnfornumeric = new nlobjSearchColumn('formulanumericinpcs');
                  columnfornumeric.setFormula("CASE WHEN {unit} = 'IT' THEN {quantityuom}-{quantityshiprecv} ELSE 0 END");

                  var columnforCase = new nlobjSearchColumn('formulanumeric');
                  columnforCase.setFormula("CASE WHEN {unit} = 'IT' THEN 0 ELSE {quantityuom}-{quantityshiprecv} END");
                } else {
                  var columnfornumeric = new nlobjSearchColumn('formulanumericinpcs');
                  columnfornumeric.setFormula("CASE WHEN {unit} = 'PC' THEN {quantityuom}-{quantityshiprecv} ELSE 0 END");

                  var columnforCase = new nlobjSearchColumn('formulanumeric');
                  columnforCase.setFormula("CASE WHEN {unit} = 'PC' THEN 0 ELSE {quantityuom}-{quantityshiprecv} END");
                }

            	var columns = [
	                new nlobjSearchColumn('internalid'),
	                new nlobjSearchColumn('number'),
	                new nlobjSearchColumn('name'),
	                new nlobjSearchColumn('item'),
	                new nlobjSearchColumn('custitem10','item'),
	                new nlobjSearchColumn('custitem11','item'),
	                new nlobjSearchColumn('unit'),
	                columnforCase,
	                columnfornumeric
                ];
              
                var filter = new nlobjSearchFilter('internalid', null, 'anyof', numbers);
                var result = nlapiSearchRecord('transaction', 'customsearch449', filter, columns);
                
                if(result != null) {

                	for(var i=1; i<=result.length; i++) {
                    	 sublist.setLineItemValue('number', i, result[i-1].getValue('number'));
                         sublist.setLineItemValue('name_display', i, result[i-1].getText('name'));
                         sublist.setLineItemValue('item_display', i, result[i-1].getText('item'));
                         sublist.setLineItemValue('custitem10', i, result[i-1].getValue('custitem10','item'));
                         sublist.setLineItemValue('custitem11', i, result[i-1].getValue('custitem11','item'));
                         sublist.setLineItemValue('unit', i, result[i-1].getValue('unit'));
                         sublist.setLineItemValue('formulanumeric', i, result[i-1].getValue('formulanumeric'));
                         sublist.setLineItemValue('formulanumericinpcs', i, result[i-1].getValue('formulanumericinpcs'));
                	}
                	
                }

                nlapiGetContext().setSessionObject('status', 'post');
                nlapiGetContext().setSessionObject('principal', principal);
                nlapiGetContext().setSessionObject('ids', ids);
                nlapiGetContext().setSessionObject('sonum', sonum);
                response.writePage(form);
            } else {
                
                var context = nlapiGetContext();
                var numbers = context.getSessionObject('ids'); 
                var truckno = request.getParameter('trucknumber');
                var preparedby = request.getParameter('prepared') || '';
                var rows = '', principal = nlapiGetContext().getSessionObject('principal');
                var html;
                
               
                 if(principal == '7') {
                  /** PROCTER AND GAMBLE LAYOUT **/
                  
                	/** START IF  **/
                	var pgpicklist = new PG_PICKLIST_CLASS();
                 	pgpicklist.SET_IDS(numbers);
     				rows = pgpicklist._GET_DATA();
     				grandTotal = pgpicklist.GET_TOTAL();
     				html = nlapiGetContext().getSetting('SCRIPT', 'custscript38');
     				
     				/** END IF  **/
                  
                } else {
                	
                	/** START ELSE **/
                	
                    var columnfornumeric = new nlobjSearchColumn('formulanumericinpcs');
                    columnfornumeric.setFormula("CASE WHEN {unit} = 'PC' THEN {quantityuom}-{quantityshiprecv} ELSE 0 END");
                    var columnforCase = new nlobjSearchColumn('formulanumeric');
                    columnforCase.setFormula("CASE WHEN {unit} = 'PC' THEN 0 ELSE {quantityuom}-{quantityshiprecv} END");
                    
                    var formulatextItemDisp = new nlobjSearchColumn('formulatext');
                    formulatextItemDisp.setFormula("{item.displayname}");
                    var columns = new Array(
                            new nlobjSearchColumn('item'),
                            new nlobjSearchColumn('number'),
                            new nlobjSearchColumn('name'),
        	                new nlobjSearchColumn('custitem11','item'),
                            new nlobjSearchColumn('unit'),
                            columnforCase,
                            columnfornumeric
                            );
                    columns[0].setSort();
                    var filters = new Array();
                    filters[0] = new nlobjSearchFilter('internalid', null, 'anyof', numbers.split('_'));
            
                    var result = nlapiSearchRecord('transaction', 'customsearch449', filters, columns);
            
                    var items = getArrayOfItems(result);
                    var itemCount = countSpecificArrayValues(items);
                    var grandTotal = qtyGrandTotal(result);
                    
                    var itemHolder = '';
                    var itemParentArray = {};
                    var itemChildArray = [];
                    
                    for(var i = 0; i < result.length; i++){
                        var field = result[i];
                        var item = field.getValue('item');
                        
                        if(itemCount[item] > 1) {
                            
                            if(itemHolder == ''){
                                itemHolder = item; 
                            }
                            
                            if(item == itemHolder) {
                                itemParentArray = addItemParent(itemParentArray,field);
                                itemChildArray.push(addItemChild(field));
                                
                            } else {
                                rows += addRowParent(itemParentArray['item'],itemParentArray['displayname'],itemParentArray['totqtycs'],
                                        itemParentArray['totqtypc']);
                                
                                rows += printChildItem(itemChildArray);
                                
                                itemHolder = item;
                                itemParentArray = {};
                                itemChildArray = [];
                                
                                i--;
                            }
                        } else {
                            if(itemChildArray != ''){
                                rows += addRowParent(itemParentArray['item'],itemParentArray['displayname'],itemParentArray['totqtycs'], itemParentArray['totqtypc']);
                                
                                rows += printChildItem(itemChildArray);
                                
                                itemHolder = '';
                                itemParentArray = {};
                                itemChildArray = [];
                                
                            }
                            
                            rows += addRowSingle(field.getText('item'), field.getValue('custitem11','item'), field.getValue('number'), field.getText('name'), field.getValue('unit'), field.getValue('formulanumeric'), field.getValue('formulanumericinpcs'));
                            
                        }
                    }

                    var html = nlapiGetContext().getSetting('SCRIPT', 'custscript35');
                    
                    /** END ELSE **/

                }
               
                html = html.replace('{truckno}', truckno);
                html = html.replace('{preparedby}', preparedby == '' ? '' : nlapiLookupField('employee', preparedby, 'entityid'));
                html = html.replace('{grandtotalcs}', grandTotal.cs);
                html = html.replace('{grandtotalpc}', grandTotal.pc);
                html = html.replace('{rows}', rows);
                html = replaceall(html, '&', 'and');
                
                var file = nlapiXMLToPDF(html);
                response.setContentType('PDF', 'picklist.pdf', 'inline');
                response.write(file.getValue());
            }
        }
    }
}

function getSO(location){
    var result = null;
    
    //Specific Columns for the List
    var columns = [new nlobjSearchColumn('internalid'),
                    new nlobjSearchColumn('number'),
                    new nlobjSearchColumn('name'),
                    new nlobjSearchColumn('billaddress')
                    ];  
    filter = new nlobjSearchFilter('location', null, 'anyof', location); // location
    result = nlapiSearchRecord('transaction', 'customsearch456', filter, columns); //Performs query
    
    return result;
}

function replaceall(str, replace, with_this) {
    var str_hasil = "";
    var temp;
    for(var i = 0; i < str.length; i++) {
        if (str[i] == replace) {
            temp = with_this;
        }
        else {
            temp = str[i];
        }
        str_hasil += temp;
    }
    return str_hasil;
}

function addCommas(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)){
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function addRowChild(number,name, qtyincs,qtyinpc) {
  return  "<tr class='rowStyle'>" +
		    "<td class='noBorder'></td>" +
		    "<td class='noBorder'></td>" +
	        "<td align='center'>" + number + "</td>" +
	        "<td align='center'>" + name + "</td>" +
	        "<td align='right'>" + addCommas(qtyincs) + "</td>" +
	        "<td align='right'>" + addCommas(qtyinpc) + "</td>" +
	        "</tr>";
}

function addRowParent(item,displayname,totqtyincs,totqtyinpc){
    return  "<tr class='rowContent'>" +
            "<td style='text-align:center; font-size:10px;'>" + item + "</td>" +
            "<td style='text-align:center; font-size:10px;'>" + displayname + "</td>" +
            "<td style='text-align:center; font-size:10px;'></td>" +
            "<td style='text-align:center; font-size:10px;'></td>" +
            "<td style='text-align:center; font-size:10px;'></td>" +
            "<td style='text-align:right; font-size:10px;'>" + addCommas(totqtyincs) + "</td>" +
            "<td style='text-align:right; font-size:10px;'>" + addCommas(totqtyinpc) + "</td>" +
            "</tr>";
}

function addRowSingle(item,displayname,number,name,unit,qtyincs,qtyinpc){
    return  "<tr>" +
            "<td style='font-size:10px;'>" + item + "</td>" +
      "<td style='text-align:center; font-size:10px;'>" + displayname + "</td>" +
      "<td style='text-align:center; font-size:10px;'>" + number + "</td>" +
            "<td style='text-align:center; font-size:10px;'>" + name + "</td>" +
      "<td style='text-align:center; font-size:10px;'>" + unit + "</td>" +
            "<td style='text-align:right; font-size:10px;'>" + addCommas(qtyincs) + "</td>" +
            "<td style='text-align:right; font-size:10px;'>" + addCommas(qtyinpc) + "</td>" +
            "</tr>";
}

function printChildItem(itemChildArray){
    var rows = '';
    for(var i = 0; i < itemChildArray.length; i++){
        rows += addRowChild(itemChildArray[i].number,itemChildArray[i].name, itemChildArray[i].qtycs,itemChildArray[i].qtypc);
    }
    return rows;
}

function getArrayOfItems(result){
    var items = [];
    for(var i = 0; i < result.length; i++){
        items.push(result[i].getValue('item'));
    }
    return items;
}

function countSpecificArrayValues(arrayOfItems){
    
    var counts = {};
    
    for(var i = 0; i < arrayOfItems.length; i++){
        var key = arrayOfItems[i];
        counts[key] = (counts[key]) ? counts[key] + 1 : 1;
    }
    return counts;
}

function qtyGrandTotal(result){
    
    var grandTotal = {};
    
    for(var i = 0; i < result.length; i++){
        field = result[i];
        grandTotal.cs = grandTotal.cs || 0;
        grandTotal.pc = grandTotal.pc || 0;
        grandTotal.cs += parseInt(field.getValue('formulanumeric'));
        grandTotal.pc += parseInt(field.getValue('formulanumericinpcs'));
    }
    
    return grandTotal;
}

function addItemParent(items,field){
    var item = items;
    
    item['totqtycs'] = item['totqtycs'] || 0;
    item['totqtypc'] = item['totqtypc'] || 0;
    
    item['item'] = field.getText('item');
    item['displayname'] = field.getValue('custitem11','item');
    item['unit'] = field.getValue('unit');
    item['totqtycs'] += parseInt(field.getValue('formulanumeric'));
    item['totqtypc'] += parseInt(field.getValue('formulanumericinpcs'));
    
    return item;
}

function addItemChild(field){
    var itemChildObject = {};
	    itemChildObject.number = field.getValue('number');
	    itemChildObject.name = field.getText('name');
        itemChildObject.qtycs = field.getValue('formulanumeric');
        itemChildObject.qtypc = field.getValue('formulanumericinpcs');
        
    return itemChildObject;
}

var PG_PICKLIST_CLASS = function() {
	var internalids = '', total = {};
	
	this._GET_DATA = function() {
		var result = this._GET_SO();
		
		var rows = '';
		var grandTotal = {};
		
		if(result != null) {
			for(var i in result) {
				
				for(var j in result[i].items) {
					rows +="<tr>";
					rows += "<td style='font-size:10px;'>" + result[i].items[j].item + "</td>" +
		            "<td style='text-align:center; font-size:10px;'>" + result[i].items[j].productcode + "</td>" +
		            "<td style='text-align:center; font-size:10px;'>" + result[i].items[j].description + "</td>" +
		            "<td style='text-align:center; font-size:10px;'>" + result[i].externalinvoicenum + "</td>" +
		            "<td style='text-align:center; font-size:10px;'>" + result[i].name + "</td>" +
		            "<td style='text-align:center; font-size:10px;'>" + result[i].items[j].unit + "</td>" +
		            "<td style='text-align:right; font-size:10px;'>" + addCommas(result[i].items[j].qty_cs) + "</td>" +
		            "<td style='text-align:right; font-size:10px;'>" + addCommas(result[i].items[j].qty_pc) + "</td>";
					rows += "</tr>";
					grandTotal.cs = grandTotal.cs || 0;
				    grandTotal.pc = grandTotal.pc || 0;
					grandTotal.cs += parseInt(result[i].items[j].qty_cs);
					grandTotal.pc += parseInt(result[i].items[j].qty_pc);
				}
			}
			
			this.SET_TOTAL(grandTotal);
		}
		
		return rows;
		
	};
	
	
	this._GET_SO = function() {
		var columnfornumeric = new nlobjSearchColumn('formulanumericinpcs');
        columnfornumeric.setFormula("CASE WHEN {unit} = 'PC' THEN {quantityuom}-{quantityshiprecv} ELSE 0 END");

        var columnforCase = new nlobjSearchColumn('formulanumeric');
        columnforCase.setFormula("CASE WHEN {unit} = 'PC' THEN 0 ELSE {quantityuom}-{quantityshiprecv} END");
        
        var columns = new Array(
            new nlobjSearchColumn('item'),
            new nlobjSearchColumn('number'), //so number
            new nlobjSearchColumn('custbody178'), //so external invoice #
            new nlobjSearchColumn('name'),
            new nlobjSearchColumn('custitem10','item'),
            new nlobjSearchColumn('custitem11','item'),
            new nlobjSearchColumn('unit'),
            columnforCase,
            columnfornumeric
        );
        
        columns[1].setSort();
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - START **/

        var ids = this.GET_IDS();
        var index = ids.indexOf('');
		if(index > -1) { ids.splice(index, 1); }
		
		/** REMOVE EMPTY VALUES IN THE ARRAY - END **/
		
        var filters = [ new nlobjSearchFilter('internalid', null, 'anyof', ids) ];
        var result = nlapiSearchRecord('transaction', 'customsearch449', filters, columns);
        var data = [];
        
        if(result != null) {
        	
        	for(var i in result) {
        		var found = data.some(function (res) {
        		    return res.sonum === result[i].getValue('number');
        		  });
        	
	        	if(!found) {
	        	    var temp = [];
	        	    
	        	    temp.push({
	        	    	'item' : result[i].getText('item'),
	        	    	'unit' : result[i].getValue('unit'),
	        	    	'description' : result[i].getValue('custitem11','item'),
	        	    	'productcode' : result[i].getValue('custitem10','item'),
	        	    	'qty_cs' : result[i].getValue('formulanumeric'),
	        	    	'qty_pc' : result[i].getValue('formulanumericinpcs'),
	        	    });
	        	    
	        	    data.push({
		    	    	'sonum':result[i].getValue('number'),
		    	    	'externalinvoicenum':result[i].getValue('custbody178'),
		    	    	'name':result[i].getText('name'),
		    	    	'items':temp
	        	    });
	        	    
	        	} else {
	        		
					for(var j in data) {
						if(data[j].sonum == result[i].getValue('number')) {
							data[j].items.push({
			        	    	'item':result[i].getText('item'),
			        	    	'unit':result[i].getValue('unit'),
			        	    	'description':result[i].getValue('custitem11','item'),
			        	    	'productcode':result[i].getValue('custitem10','item'),
			        	    	'qty_cs' : result[i].getValue('formulanumeric'),
			        	    	'qty_pc' : result[i].getValue('formulanumericinpcs'),
			        	    });
						}
					} //END FOR LOOP
					
	        	} //END ELSE
        	
        	} //END FOR LOOP
        } //END IF
        return data;
        
	};
	
	/** SETTERS **/
	this.SET_IDS = function(ids) { this.internalids = ids; };
	
	this.SET_TOTAL = function(tot) { this.total = tot; };
	
	/** GETTERS **/
	
	this.GET_IDS = function() { return this.internalids.split('_'); };
	
	this.GET_TOTAL = function() { return this.total; };
};



