	/***********************************/
		//Updated By : Redemptor Enderes
		// Date : Jan. 15, 2014
		// Issue : Wrong quantity in column 'Quantity Per Case' if Unit is in PC.
		// Solution : Add formula in column 'Quantity Per Case'.
	/***********************************/
	
function suitelet(request, response){
	
	if(request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Choose a location');
		
		//location filter
		var location = form.addField('cust_location', 'select', 'Location', 'Location').setDefaultValue(nlapiLookupField('employee', nlapiGetUser(), 'custentity39'));

		form.addSubmitButton('Submit');
		
		nlapiGetContext().setSessionObject('status', 'get');
		response.writePage(form);
	}else{
		var location = request.getParameter('cust_location');
		if(nlapiGetContext().getSessionObject('status') == 'get'){
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
			//form.setScript('customscript439'); 
			response.writePage(form);
		}else{
			var form = nlapiCreateForm('Pick List Preview'),
				trucknumber = request.getParameter('trucknumber'),
				truckersname = request.getParameter('truckersname'),
				datereceived = request.getParameter('datereceived'),
				prepared = request.getParameter('prepared'),
				linecount = request.getLineItemCount('cust_sublist')
			;
			if(nlapiGetContext().getSessionObject('status') == 'getagain'){
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
				if(request.getLineItemValue('cust_sublist', 'ifpick', i) == 'T'){
						numbers[o] = request.getLineItemValue('cust_sublist', 'internalid', i);
						ids += request.getLineItemValue('cust_sublist', 'internalid', i);
						sonum += request.getLineItemValue('cust_sublist', 'number', i);
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
			}else{
				var context = nlapiGetContext(), 
				numbers = context.getSessionObject('ids'); 
			
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
			reportDefinition.setTitle('Truck Plate # : ' + trucknumber + ' | ' + "Trucker's Name : " + truckersname + ' | ' + 'Date Received : ' + datereceived);
			//var unit = unit = reportDefinition.addColumn('unit', false, 'Unit', null, 'TEXT', null);
			reportDefinition.addRowHierarchy('item', 'Item', 'TEXT');
			reportDefinition.addColumn('number', false, 'SO Number', null, 'TEXT', null);
			reportDefinition.addColumn('formulanumeric', true, 'Quantity PER CASE', null, 'INTEGER', null);
			reportDefinition.addColumn('formulanumericinpcs', true, 'Quantity PER PIECE', null, 'INTEGER', null);
			
			//Maps the query results into the report definition columns
			reportDefinition.addSearchDataSource('transaction', 'customsearch449', filter, columns, 
			{'item':columns[0], 'number': columns[1], 'formulanumeric':columns[2],'formulanumericinpcs':columns[3]});
			//	{'unit':columns[1],'item':columns[0], 'number': columns[2], 'formulanumeric':columns[3],'formulanumericinpcs':columns[5]});
			
			 //Create a form to build the report on
			var form = nlapiCreateReportForm('Pick List Summary');     
		 
			//Build the form from the report definition
			reportDefinition.executeReport(form); 
			
			//Write the form to the browser
			response.writePage(form);
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
