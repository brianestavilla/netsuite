	/***********************************/
		//Updated By : Redemptor Enderes
		// Date : Jan. 15, 2014
		// Issue : Wrong quantity in column 'Quantity Per Case' if Unit is in PC.
		// Solution : Add formula in column 'Quantity Per Case'.
	/***********************************/
	
	function suitelet(request, response){
		if(request.getMethod() == 'GET'){
			var form = nlapiCreateForm('Sales Order Item List');
			form.addSubmitButton('Pick List Preview');
			
			// Updated by : Redemptor Enderes
			// Date : Jan. 13, 2014
			// Purpose : Add filter in location
			var empId = nlapiGetUser();
			var location = nlapiLookupField('employee', empId, 'custentity39'); // get Fulfillment Location: Sales in Employee Record
			
			//Pick List # field
			var picknumber = form.addField('pickingnumber', 'text', 'Picking List # '); 
			picknumber.setDisplayType('inline');
			picknumber.setDefaultValue('To be generated');
			
			//Truck Number field
			form.addField('trucknumber', 'text', 'Truck # '); 
			
			//Creatvalue into the current user
			var prepared = form.addField('prepared', 'select', 'Pre "Prepared by" field and sets default epared By ', 'employee');
			prepared.setDefaultValue(nlapiGetUser());
			
			//Specific Columns for the List
			var columns = [new nlobjSearchColumn('internalid'),
							new nlobjSearchColumn('number'),
							new nlobjSearchColumn('name'),
							new nlobjSearchColumn('billaddress')
							];
							
			filter = new nlobjSearchFilter('location', null, 'anyof', location); // location
			
			var result = nlapiSearchRecord('transaction', 'customsearch456', filter, columns); //Performs query
			
			//Create Form Sublist
			var sublist = form.addSubList('sublist', 'list', 'Items');
			sublist.addMarkAllButtons();
			sublist.addRefreshButton();
			sublist.addField('ifpick', 'checkbox', 'Pick');
			var internal = sublist.addField('internalid', 'text', 'Internal Id');
			internal.setDisplayType('hidden');
			sublist.addField('number', 'text', 'SO Number');
			sublist.addField('billaddress', 'text', 'Bill Address');
			sublist.addField('name_display', 'text', 'Customer');
			
			//shows all values of the "query result" in the interface
			sublist.setLineItemValues(result);
			
			nlapiGetContext().setSessionObject('status', 'get');
			form.setScript('customscript439');
			response.writePage(form);
		}
		else{
			var context = nlapiGetContext(),
					form = nlapiCreateForm('Pick List Preview'),
					trucknumber = request.getParameter('trucknumber'),
					prepared = request.getParameter('prepared'),
					pickingnumber = request.getParameter('pickingnumber'),
					linecount = request.getLineItemCount('sublist'),
					pick_list = new Object(),
					line_item = new Object(),
					line_item_array = new Array(),
					j = 1
			;
			if(nlapiGetContext().getSessionObject('status') == 'get'){
				form.addSubmitButton('Print Pick List');
				var number1 = form.addField('pickingnumber', 'text', 'Picking List # ').setDefaultValue('To be generated');
				form.getField('pickingnumber').setDisplayType('inline');	
				var tnumber = form.addField('trucknumber', 'text', 'Truck # ').setDefaultValue(trucknumber);
				form.getField('trucknumber').setDisplayType('inline');
				var prepared = form.addField('prepared', 'select', 'Prepared By ', 'employee').setDefaultValue(nlapiGetUser());
				form.getField('prepared').setDisplayType('inline');
				
				var sublist = form.addSubList('sublist', 'list', 'Items');
				sublist.addField('number', 'text', 'SO Number');
				sublist.addField('item_display', 'text', 'Item');
				//sublist.addField('unit', 'text', 'Units');
				sublist.addField('formulanumeric', 'integer', 'Quantity Per CASE');
				sublist.addField('formulanumericinpcs', 'text', 'Quantity Per PIECE');
				
				var numbers = new Array();
				var ids = '';
				sonum = '';
				o = 0;
				
				//Checks all checked SO to be consolidated in Pick List report
				for(var i = 1; i <= linecount; i++){
				if(request.getLineItemValue('sublist', 'ifpick', i) == 'T'){
						numbers[o] = request.getLineItemValue('sublist', 'internalid', i);
						ids += request.getLineItemValue('sublist', 'internalid', i);
						sonum += request.getLineItemValue('sublist', 'number', i);
						if(i != linecount) {ids += "_"; sonum += ',';}
						o++;
					}
				}
				var columnfornumeric = new nlobjSearchColumn('formulanumericinpcs');
				columnfornumeric.setFormula("CASE WHEN {unit} = 'PC' THEN {quantityuom}-{quantityshiprecv} ELSE 0 END");
				
				var columnforCase = new nlobjSearchColumn('formulanumeric');
				columnforCase.setFormula("CASE WHEN {unit} = 'PC' THEN 0 ELSE {quantityuom}-{quantityshiprecv} END");

				var columns = [new nlobjSearchColumn('internalid'),
							new nlobjSearchColumn('number'),
							new nlobjSearchColumn('name'),
							new nlobjSearchColumn('item'),
							//new nlobjSearchColumn('unit'),
							columnforCase,
							columnfornumeric
							];
				var filter = new nlobjSearchFilter('internalid', null, 'anyof', numbers);
				var result = nlapiSearchRecord('transaction', 'customsearch449', filter, columns);
				sublist.setLineItemValues(result);


				nlapiGetContext().setSessionObject('status', 'post');
				nlapiGetContext().setSessionObject('ids', ids);
				nlapiGetContext().setSessionObject('sonum', sonum);
				response.writePage(form);
				
			}
			else{
				var context = nlapiGetContext(), 
					html = context.getSetting('SCRIPT', 'custscript21'),
					numbers = context.getSessionObject('ids'),
					sonum = context.getSessionObject('sonum'),
					units = '',
					tablerow = "",
					total = 0
				;
				var columnfornumeric = new nlobjSearchColumn('formulanumericinpcs');
				columnfornumeric.setFormula("CASE WHEN {unit} = 'PC' THEN {quantityuom}-{quantityshiprecv} ELSE 0 END");
				
				var columnforCase = new nlobjSearchColumn('formulanumeric');
				columnforCase.setFormula("CASE WHEN {unit} = 'PC' THEN 0 ELSE {quantityuom}-{quantityshiprecv} END");
				
				var columns = new Array(
							new nlobjSearchColumn('item'),
							//new nlobjSearchColumn('unit'),
							new nlobjSearchColumn('number'),
							columnforCase,
							columnfornumeric
							);
			
				var filter = new Array(new nlobjSearchFilter('internalid', null, 'anyof', numbers.split('_')));
				
				var reportDefinition = nlapiCreateReportDefinition();
				reportDefinition.setTitle('Truck #: ' + trucknumber);
				//var unit = unit = reportDefinition.addColumn('unit', false, 'Unit', null, 'TEXT', null);
				var item = reportDefinition.addRowHierarchy('item', 'Item', 'TEXT');
				var number = reportDefinition.addColumn('number', false, 'SO Number', null, 'TEXT', null);
				var quantity = reportDefinition.addColumn('formulanumeric', true, 'Quantity PER CASE', null, 'INTEGER', null);
				var quantity1 = reportDefinition.addColumn('formulanumericinpcs', true, 'Quantity PER PIECE', null, 'INTEGER', null);
				
									
				
				//Maps the query results into the report definition columns
				reportDefinition.addSearchDataSource('transaction', 'customsearch449', filter, columns, 
				{'item':columns[0], 'number': columns[1], 'formulanumeric':columns[2],'formulanumericinpcs':columns[3]});
				//	{'unit':columns[1],'item':columns[0], 'number': columns[2], 'formulanumeric':columns[3],'formulanumericinpcs':columns[5]});
				
				 //Create a form to build the report on
				var form = nlapiCreateReportForm('Pick List Summary');     
			 
				//Build the form from the report definition
				var pvtTable = reportDefinition.executeReport(form); 
				
				//Write the form to the browser
				response.writePage(form);
				
			}
		}
	}
	function rows(itemname, unit, quantity, type) {
			if(type == 'total')
				tr = "<tr class='total'>";
			else tr = "<tr>";
			return	tr +
					"<td width='150'>" + itemname + "</td>" +
					"<td align='center' width='150'>" + unit + "</td>" +
					"<td align='right' width='150'>" + addCommas(quantity) + "</td>" +
					"</tr>"
					;
				
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