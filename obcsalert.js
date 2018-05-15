function bugetlimit(type, name){
	var princ = nlapiGetFieldValue('class');
	var location = nlapiGetFieldValue('location');
	var acc = nlapiGetCurrentLineItemValue('expense','account');
	var postper = nlapiGetFieldValue('postingperiod');
	var billtype = nlapiGetFieldValue('custbody62');
	var x = '',y = '';
	var linenum = nlapiGetLineItemCount('expense');
	var prevtotal = 0;
	var currgross = nlapiGetCurrentLineItemValue('expense','grossamt');
	
	
	
	
	if((billtype == '2' && location != null && princ != null) && (billtype == '2' && location != '' && princ != ''))
	{
	
		switch(acc){
				case '2264'://613000001 Operating Expenses : Marketing, Advertising & Promotions-Display Allow.
					x = new nlobjSearchColumn('custrecord_budget_office_displayallow'); 
					y = 'custrecord_budget_office_displayallow';	
					
				break;
				case '2265'://613000002 Operating Expenses : Marketing, Advertising & Promotions-SubD Allow.
					x = new nlobjSearchColumn('custrecord_budget_sales_subdexpense'); 
					y = 'custrecord_budget_sales_subdexpense';
				break;
				case '2273'://601040000 Operating Expenses : Employee Costs & Benefits : Salaries & Wages : Logistics
					x = new nlobjSearchColumn('custrecord_budget_wh_salaries'); 
					y = 'custrecord_budget_wh_salaries';
				break;
				case '2272'://601050000 Operating Expenses : Employee Costs & Benefits : Salaries & Wages : Sales
					x = new nlobjSearchColumn('custrecord_budget_sales_salaries');
					y = 'custrecord_budget_sales_salaries';
				break;
				case '142'://602040000 Operating Expenses : Employee Costs & Benefits : Incentives & Commissions
					x = new nlobjSearchColumn('custrecord_budget_sales_incentives');
					y = 'custrecord_budget_sales_incentives';
				break;
				case '2099'://602080100 Operating Expenses : Employee Costs & Benefits : Other Employees Benefits : Meal Allowance
					x = new nlobjSearchColumn('custrecord_budget_sales_mealallowance');
					y = 'custrecord_budget_sales_mealallowance';
				break;
				case '2086'://604010000 Operating Expenses : Transportation & Travel : Transportation expenses
					x = new nlobjSearchColumn('custrecord_budget_sales_transpoallowance'); 
					y = 'custrecord_budget_sales_transpoallowance';
				break;
				case '2087'://604020000 Operating Expenses : Transportation & Travel : Parking & Toll fees
					x = new nlobjSearchColumn('custrecord_budget_sales_parkingfee');
					y='custrecord_budget_sales_parkingfee';
				break;
				case '2271'://606020001 Operating Expenses : Repairs and Maintenance : Maintenance-Delivery Truck & Equipments
					x = new nlobjSearchColumn('custrecord_budget_sales_maintenancetruck');
					y='custrecord_budget_sales_maintenancetruck';
				break;
				case '2274'://606020003 Operating Expenses : Repairs and Maintenance : Repairs-Delivery Truck & Equipments
					x = new nlobjSearchColumn('custrecordcustrecord_budget_sales_delive');
					y='custrecordcustrecord_budget_sales_delive';
				break;
				case '2110'://606020100 Operating Expenses : Repairs and Maintenance : Delivery Truck & Equipments : Tires
					x = new nlobjSearchColumn('custrecord_budget_sales_tireexpensetruck'); 
					y='custrecord_budget_sales_tireexpensetruck';
				break;
				case '2268'://606020101 Operating Expenses : Repairs and Maintenance : Delivery Truck & Equipments : Batteries
					x = new nlobjSearchColumn('custrecord_budget_sales_batteryexpensetr');
					y='custrecord_budget_sales_batteryexpensetr';
				break;
				case '2269'://606020102 Operating Expenses : Repairs and Maintenance : Delivery Truck & Equipments : Accessories
					x = new nlobjSearchColumn('custrecord_budget_sales_pushcart');
					y='custrecord_budget_sales_pushcart';
				break;
				case '2270'://606020002 Operating Expenses : Repairs and Maintenance : Maintenance-Service Vehicle
					x = new nlobjSearchColumn('custrecord_budget_sales_maintenance');
					y='custrecord_budget_sales_maintenance';
				break;
				case '2275'://606020004 Operating Expenses : Repairs and Maintenance : Repairs-Service Vehicle
					x = new nlobjSearchColumn('custrecord_budget_sales_servicerepairs'); 
					y ='custrecord_budget_sales_servicerepairs';
				break;
				case '2187'://606030100 Operating Expenses : Repairs and Maintenance : Service Vehicle : Tires
					x = new nlobjSearchColumn('custrecord_budget_sales_tireexpense'); 
					y='custrecord_budget_sales_tireexpense';
				break;
				case '2266'://606030101 Operating Expenses : Repairs and Maintenance : Service Vehicle : Batteries
					x = new nlobjSearchColumn('custrecord_budget_sales_batteryexpense');
					y='custrecord_budget_sales_batteryexpense';
				break;
				case '2186'://607000000 Operating Expenses : Fuel, Oil and Lubricants
					x = new nlobjSearchColumn('custrecord_budget_sales_fuelexpense');
					y='custrecord_budget_sales_fuelexpense';
				break;
				case '748'://608020000 Operating Expenses : Depreciation Expenses : Depreciation expense-Delivery Truck, Tools & Equipments
					x = new nlobjSearchColumn('custrecord_budget_sales_deptruck');
					y='custrecord_budget_sales_deptruck';
				break;
				case '2106'://608030000 Operating Expenses : Depreciation Expenses : Depreciation expense-Service Vehicle
					x = new nlobjSearchColumn('custrecord_budget_sales_depservice'); 
					y='custrecord_budget_sales_depservice';
				break;
				case '2263'://608040000 Operating Expenses : Depreciation Expenses : Depreciation expense-Warehouse Equipment
					x = new nlobjSearchColumn('custrecord_budget_wh_equipmentdepreciati'); 
					y='custrecord_budget_wh_equipmentdepreciati';
				break;
				case '1207'://609010000 Operating Expenses : Insurance Expenses : Insurance Expenses - Warehouse building
					x = new nlobjSearchColumn('custrecord_budget_wh_insurance');
					y='custrecord_budget_wh_insurance';
				break;
				case '1206'://609020000 Operating Expenses : Insurance Expenses : Insurance Expenses - Delivery Truck & Equipments
					x = new nlobjSearchColumn('custrecord_budget_sales_vehicleinsur2');
					y='custrecord_budget_sales_vehicleinsur2';
				break;
				case '2107'://609030000 Operating Expenses : Insurance Expenses : Insurance Expenses - Service Vehicle
					x = new nlobjSearchColumn('custrecord_budget_sales_vehicleinsurance');
					y='custrecord_budget_sales_vehicleinsurance';
				break;
				case '767'://610000000 Operating Expenses : Telecommunications expense
					x = new nlobjSearchColumn('custrecord_budget_wh_telecomm'); 
					y='custrecord_budget_wh_telecomm';
				break;
				case '891'://612010000 Operating Expenses : Utilities Expenses : Light, Power & Water
					x = new nlobjSearchColumn('custrecord_budget_wh_lightpowerwater'); 
					y='custrecord_budget_wh_lightpowerwater';
				break;
				case '1680'://616000000 Operating Expenses : Rent Expense
					x = new nlobjSearchColumn('custrecord_budget_wh_rentexpense');
					y='custrecord_budget_wh_rentexpense';
				break;
				case '2245'://618010000 Operating Expenses : Taxes & Licenses : Permits & Licenses
					x = new nlobjSearchColumn('custrecord_budget_sales_registration');
					y='custrecord_budget_sales_registration';
				break;
				case '2185'://701000000 Administrative Expenses : Salaries & Wages
					x = new nlobjSearchColumn('custrecord_budget_office_salaries');
					y='custrecord_budget_office_salaries';
				break;
				case '2242'://702050000 Administrative Expenses : Employee Costs & Benefits : Meals Expenses
					x = new nlobjSearchColumn('custrecord_budget_office_mealallowance'); 
					y='custrecord_budget_office_mealallowance';
				break;
				case '2113'://702080300 Administrative Expenses : Employee Costs & Benefits : Other Employee benefits : Communication Allowance
					x = new nlobjSearchColumn('custrecord_budget_office_cellphonesubsid');
					y='custrecord_budget_office_cellphonesubsid';
				break;
				case '901'://704010000 Administrative Expenses : Transportation & Travel : Transportation expenses
					x = new nlobjSearchColumn('custrecord_budget_office_transpoallowanc');
					y='custrecord_budget_office_transpoallowanc';
				break;
				case '646'://707020000 Administrative Expenses : Depreciation Expenses : Depreciation expense - Office equipment
					x = new nlobjSearchColumn('custrecord_budget_office_officeequipment'); 
					y='custrecord_budget_office_officeequipment';
				break;
				case '647'://707030000 Administrative Expenses : Depreciation Expenses : Depreciation expense - Office Furniture & fixtures
					x = new nlobjSearchColumn('custrecord_budget_office_furnitures'); 
					y='custrecord_budget_office_furnitures';
				break;
				case '2092'://709020000 Administrative Expenses : Insurance Expenses : Insurance expense  - Office building & equipment
					x = new nlobjSearchColumn('custrecord_budget_office_bldginsurance');
					y='custrecord_budget_office_bldginsurance';
				break;
				case '2094'://711010000 Administrative Expenses : Supplies Expenses : Office supplies
					x = new nlobjSearchColumn('custrecord_budget_office_officesupplies'); 
					y='custrecord_budget_office_officesupplies';
				break;
				case '776'://713000000 Administrative Expenses : Rent expense
					x = new nlobjSearchColumn('custrecord_budget_office_rental');
					y='custrecord_budget_office_rental';
				break;
				case '783'://714000000 Administrative Expenses : Professional & Legal Fees
					x = new nlobjSearchColumn('custrecord_budget_office_proretainersfee'); 
					y='custrecord_budget_office_proretainersfee';
				break;
				case '912'://717010000 Administrative Expenses : Taxes & Licenses : Permits & Licenses
					x = new nlobjSearchColumn('custrecord_budget_office_taxlicenses'); 
					y='custrecord_budget_office_taxlicenses';
				break;
				default:
					return true;
			}
			
	var filter1 = [
		new nlobjSearchFilter('custrecord_budgetprincipal', null, 'anyof', princ),
		new nlobjSearchFilter('custrecord_budgetlocation', null, 'anyof', location),
		new nlobjSearchFilter('custrecord_budgetpostingperiod', null, 'anyof', postper)
	];
			
	var result = nlapiSearchRecord('customrecord_budget', null, filter1, x);
	
	for(var t = 0; t <= linenum; t++){
		var prevlineacc = nlapiGetLineItemValue('expense','account',t);
		if(prevlineacc == acc){
			var prevlinegross = nlapiGetLineItemValue('expense','grossamt',t);
			prevtotal = parseFloat(prevtotal) + parseFloat(prevlinegross);
		}
	}	
	//budget	
	if(result != null){
		var budgetamnt = result[0].getValue(y);
	}else if(result == null){
		var budgetamnt = 0;
	}
	
	
	currgross = parseFloat(currgross) +  prevtotal;
	alert(currgross + " " + budgetamnt);
	/*if(currgross > budgetamnt){
		alert('UNABLE TO PROCEED, EXCEEDED ALLOCATED BUDGET');
		return false;
	}*/
	
		var filter = [
				new nlobjSearchFilter('class', null, 'anyof', princ),
				new nlobjSearchFilter('location', null, 'anyof', location),
				new nlobjSearchFilter('postingperiod', null, 'anyof', postper),
				new nlobjSearchFilter('account', null, 'anyof', acc)
			];
		var column = [
				new nlobjSearchColumn('account',null,'GROUP'),
				new nlobjSearchColumn('amount',null,'SUM')
			];	
		//previous doc search
		var result1 = nlapiSearchRecord('transaction','customsearch852', filter, column);
		if(result1 != null){
			var amnt = (result1[0].getValue('amount',null,'SUM')* -1);	
		}else if(result1 == null){
			var amnt = 0;
		}
			
		var totalamnt = parseFloat(amnt) + parseFloat(currgross);  
		alert(totalamnt);
		if(totalamnt <= budgetamnt){
			return true;
		}else if(totalamnt > budgetamnt){
			alert('UNABLE TO PROCEED, EXCEEDED ALLOCATED BUDGET');
			return false;
		}	
		
	}else{
		alert("FILL UP THE MANDATORY FIELDS FIRST");
	}
	
	return true;
}
	
	
