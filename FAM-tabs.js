function beforeLoadTab(type, form)
{
	var currentContext = nlapiGetContext();
	var currentUserID = currentContext.getUser();
	var id = nlapiGetRecordId();
	if(( currentContext.getExecutionContext() == 'userinterface') && (type == 'edit' | type == 'view'))
	{     
		var fuel_tab = form.addTab('custpage_fuel_tab', 'Fuel'),
			battery_tab = form.addTab('custpage_battery_tab', 'Battery'),
			tires_tab = form.addTab('custpage_tires_tab', 'Tires'),
			engineoil_tab = form.addTab('custpage_engineoil_tab', 'Engine Oil'),
			lubricants_tab = form.addTab('custpage_lubricants_tab', 'Lubricants')
		;
		var columns = new Array(
					new nlobjSearchColumn('trandate'),
					new nlobjSearchColumn('number'),
					//new nlobjSearchColumn('entity', 'vendor'),
					new nlobjSearchColumn('memo'),
					new nlobjSearchColumn('amount')
		);
		var tabs = new Array(
						form.addSubList('custpage_battery_list', 'list', 'FAM-Battery', 'custpage_battery_tab'),
						form.addSubList('custpage_engineoil_list', 'list', 'FAM-Engine Oil', 'custpage_engineoil_tab'),
						form.addSubList('custpage_fuel_list', 'list', 'FAM-Fuel', 'custpage_fuel_tab'),
						form.addSubList('custpage_lubricants_list', 'list', 'FAM-Lubricants', 'custpage_lubricants_tab'),
						form.addSubList('custpage_tires_list', 'list', 'FAM-Tires', 'custpage_tires_tab')
		);
		var searches = new Array(
						'customsearch304', //Battery
						'customsearch306', //Oil
						'customsearch250',// Fuel
						'customsearch307', //lubricants
						'customsearch305' //Tires
		);
		for(var i = 0; i < tabs.length; i++){
			var rows = getRows(id, columns, searches[i]);
			if(rows != null) showResults(tabs[i], rows);
		}
			
	}
}
function showResults(tab, rows){
	tab.addField('trandate', 'date', 'Date');
	tab.addField('number', 'text', 'Number');
	//fuel_list.addField('fuel_vendor', 'text', 'Vendor');
	tab.addField('memo', 'text', 'Memo');
	tab.addField('amount', 'currency', 'Debit Amount');
	tab.setLineItemValues(rows);
}

function getRows(fam_id, columns, saved_search){
	var filter = new nlobjSearchFilter('custcol_far_trn_relatedasset', null, 'is', fam_id); 
	var row = nlapiSearchRecord('vendorbill', saved_search, filter, columns);
	return row;
}