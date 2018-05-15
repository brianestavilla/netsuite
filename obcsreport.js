function suitelet(request, response){
		if ( request.getMethod() == 'GET' ){
			var form = nlapiCreateForm('OBCS Reports');
			form.addSubmitButton('Preview');
			
			var period = form.addField('custpage_selectperiod','select', 'Posting Period: ').setMandatory(true);
			period.addSelectOption('','');
			var principal = form.addField('custpage_selectprincipal','select', 'Principal: ').setMandatory(true);
			principal.addSelectOption('','');
			var location = form.addField('custpage_selectlocation','select', 'Location: ').setMandatory(true);
			location.addSelectOption('','');
			var column1 = [
				new nlobjSearchColumn('internalid'),
				new nlobjSearchColumn('name')
			];
			var filter = new nlobjSearchFilter('isinactive', null, 'anyof', false);
			var result1 = nlapiSearchRecord('location', null, filter, column1);
			if(result1 != null) {
				for(var i = 0; i < result1.length; i++){
					var loca = result1[i];
				location.addSelectOption(loca.getValue('internalid'),loca.getValue('name'));
				}
			}
			var result2 = nlapiSearchRecord('classification', null, null, column1);
			if(result2 != null) {
				for(var i = 0; i < result2.length; i++){
					var prin = result2[i];
					principal.addSelectOption(prin.getValue('internalid'),prin.getValue('name'));
				}
			}
			var column2 = [
				new nlobjSearchColumn('internalid'),
				new nlobjSearchColumn('periodname')
			];
			var result3 = nlapiSearchRecord('taxperiod', null, filter, column2);
			if(result3 != null) {
				for(var i = 0; i < result3.length; i++){
					var per = result3[i];
					period.addSelectOption(per.getValue('internalid'),per.getValue('periodname'));
				}
			}
			nlapiGetContext().setSessionObject('status', 'get');
			response.writePage(form);
		}else
		{
			var context = nlapiGetContext(),
			form = nlapiCreateForm('OBCS Report Preview');
			if(context.getSessionObject('status') == 'get'){
				var princ = request.getParameter('custpage_selectprincipal'),
				princp = nlapiLookupField('classification', princ, 'name', false),
				locas = request.getParameter('custpage_selectlocation'),
				locat = nlapiLookupField('location', locas, 'name', false),
				peri = request.getParameter('custpage_selectperiod'),
				perio = nlapiLookupField('taxperiod', peri,'periodname', false);
				var periodsel = form.addField('custpage_period','text', 'Posting Period: ').setDisplayType('inline');
				periodsel.setDefaultValue(perio);
				var principalsel = form.addField('custpage_principal','text', 'Principal: ').setDisplayType('inline');
				principalsel.setDefaultValue(princp);//wew
				var locationsel = form.addField('custpage_location','text', 'Location: ').setDisplayType('inline');
				locationsel.setDefaultValue(locat);
				
				var sublist = form.addSubList('custpage_sublistsales', 'list', 'Sales Office Fixed Cost');
				sublist.addField('custpage_particular','text','PARTICULARS');
				sublist.addField('custpage_deparment','text','DEPARTMENT');
				sublist.addField('custpage_budget','currency','OBCS BUDGET');
				sublist.addField('custpage_actual','currency','ACTUAL EXPENSE');
				sublist.addField('custpage_varnce','currency','VARIANCE');
				
				sublist.setLineItemValue('custpage_particular',1,'SALES OFFICE FIXED COST');
				sublist.setLineItemValue('custpage_particular',2,'Display Allowance');
				sublist.setLineItemValue('custpage_particular',3,'Salaries (Office)');
				sublist.setLineItemValue('custpage_particular',4,'Meal Allowance');
				sublist.setLineItemValue('custpage_particular',5,'Cellphone subsidy');
				sublist.setLineItemValue('custpage_particular',6,'Transportation Allowance');
				sublist.setLineItemValue('custpage_particular',7,'Office Equipment');
				sublist.setLineItemValue('custpage_particular',8,'Furnitures & Fixtures');
				sublist.setLineItemValue('custpage_particular',9,'Office / Building Insurance');
				sublist.setLineItemValue('custpage_particular',10,'Office Supplies');
				sublist.setLineItemValue('custpage_particular',11,'Office Rental');
				sublist.setLineItemValue('custpage_particular',12,'Professional Retainers Fee');
				sublist.setLineItemValue('custpage_particular',13,'Tax & Licenses');
				sublist.setLineItemValue('custpage_deparment',1,'');
				sublist.setLineItemValue('custpage_deparment',2,'Branches : Operations : Sales');
				sublist.setLineItemValue('custpage_deparment',3,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',4,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',5,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',6,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',7,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',8,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',9,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',10,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',11,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',12,'Branches : Finance : General Accounting');
				sublist.setLineItemValue('custpage_deparment',13,'Branches : Finance : General Accounting');
				
				var sublistop = form.addSubList('custpage_sublistsalescost', 'list', 'Sales Operating Cost');
				sublistop.addField('custpage_particularop','text','PARTICULARS');
				sublistop.addField('custpage_deparmentop','text','DEPARTMENT');
				sublistop.addField('custpage_budgetop','currency','OBCS BUDGET');
				sublistop.addField('custpage_actualop','currency','ACTUAL EXPENSE');
				sublistop.addField('custpage_varnceop','currency','VARIANCE');
				
				sublistop.setLineItemValue('custpage_particularop',1,'SALES OPERATING COST');
				sublistop.setLineItemValue('custpage_particularop',2,'Sub D Allowance');
				sublistop.setLineItemValue('custpage_particularop',3,'Salaries (Sales)');
				sublistop.setLineItemValue('custpage_particularop',4,'Salesmans Incentives');
				sublistop.setLineItemValue('custpage_particularop',5,'Meal Allowance (Sales)');
				sublistop.setLineItemValue('custpage_particularop',6,'Transportation Allowance (Sales)');
				sublistop.setLineItemValue('custpage_particularop',7,'Parking, Toll Fee, & Permits');
				sublistop.setLineItemValue('custpage_particularop',8,'Maintenance Delivery Truck');
				sublistop.setLineItemValue('custpage_particularop',9,'Tire Expense Delivery Truck');
				sublistop.setLineItemValue('custpage_particularop',10,'Battery Expense Delivery Truck');
				sublistop.setLineItemValue('custpage_particularop',11,'Push Cart');
				sublistop.setLineItemValue('custpage_particularop',12,'Maintenance Service Vehicle');
				sublistop.setLineItemValue('custpage_particularop',13,'Service & Repairs');
				sublistop.setLineItemValue('custpage_particularop',14,'Tire Expense Service Vehicle');
				sublistop.setLineItemValue('custpage_particularop',15,'Battery Expense Service Vehicle');
				sublistop.setLineItemValue('custpage_particularop',16,'Fuel Expense');
				sublistop.setLineItemValue('custpage_particularop',17,'Depreciation Delivery Truck');
				sublistop.setLineItemValue('custpage_particularop',18,'Depreciation Service Vehicle');
				sublistop.setLineItemValue('custpage_particularop',19,'Vehicle Insurance Delivery Truck');
				sublistop.setLineItemValue('custpage_particularop',20,'Vehicle Insurance');
				sublistop.setLineItemValue('custpage_particularop',21,'Registration');
				sublistop.setLineItemValue('custpage_deparmentop',1,'');
				sublistop.setLineItemValue('custpage_deparmentop',2,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',3,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',4,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',5,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',6,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',7,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',8,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',9,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',10,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',11,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',12,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',13,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',14,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',15,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',16,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',17,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',18,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',19,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',20,'Branches : Operations : Sales');
				sublistop.setLineItemValue('custpage_deparmentop',21,'Branches : Operations : Sales');
				
				var subliswr = form.addSubList('custpage_sublistwarehouse', 'list', 'Warehouse Fixed Cost');
				subliswr.addField('custpage_particularwr','text','PARTICULARS');
				subliswr.addField('custpage_deparmentwr','text','DEPARTMENT');
				subliswr.addField('custpage_budgetwr','currency','OBCS BUDGET');
				subliswr.addField('custpage_actualwr','currency','ACTUAL EXPENSE');
				subliswr.addField('custpage_varncewr','currency','VARIANCE');
				
				subliswr.setLineItemValue('custpage_particularwr',1,'WAREHOUSE FIXED COST');
				subliswr.setLineItemValue('custpage_particularwr',2,'Salaries');
				subliswr.setLineItemValue('custpage_particularwr',3,'Service & Repairs-Delivery Truck');
				subliswr.setLineItemValue('custpage_particularwr',4,'Warehouse Equipment Depreciation');
				subliswr.setLineItemValue('custpage_particularwr',5,'Insurance - Warehouse');
				subliswr.setLineItemValue('custpage_particularwr',6,'Telecommunication Expense');
				subliswr.setLineItemValue('custpage_particularwr',7,'Light, Power & Water');
				subliswr.setLineItemValue('custpage_particularwr',8,'Rent and Expense');
				
				subliswr.setLineItemValue('custpage_deparmentwr',1,' ');
				subliswr.setLineItemValue('custpage_deparmentwr',2,'Branches : Operations : Logistics');
				subliswr.setLineItemValue('custpage_deparmentwr',3,'Branches : Operations : Sales');
				subliswr.setLineItemValue('custpage_deparmentwr',4,'Branches : Operations : Logistics');
				subliswr.setLineItemValue('custpage_deparmentwr',5,'Branches : Operations : Logistics');
				subliswr.setLineItemValue('custpage_deparmentwr',6,'Branches : Operations : Logistics');
				subliswr.setLineItemValue('custpage_deparmentwr',7,'Branches : Operations : Logistics');
				subliswr.setLineItemValue('custpage_deparmentwr',8,'Branches : Operations : Logistics');
				
				var filterbudget = new Array(
									new nlobjSearchFilter('isinactive', null, 'anyof', false),
									new nlobjSearchFilter('custrecord_budgetprincipal', null, 'anyof', princ),
									new nlobjSearchFilter('custrecord_budgetlocation', null, 'anyof', locas),
									new nlobjSearchFilter('custrecord_budgetpostingperiod', null, 'anyof', perio)
									);
				var columnbudget = new Array(
									new nlobjSearchColumn('custrecord_budget_wh_rentexpense'),
									new nlobjSearchColumn('custrecord_budget_wh_lightpowerwater'),
									new nlobjSearchColumn('custrecord_budget_wh_telecomm'),
									new nlobjSearchColumn('custrecord_budget_wh_salaries'),
									new nlobjSearchColumn('custrecord_budget_wh_insurance'),
									new nlobjSearchColumn('custrecord_budget_wh_equipmentdepreciati'),
									new nlobjSearchColumn('custrecordcustrecord_budget_sales_delive'),
									new nlobjSearchColumn('custrecord_budget_office_officesupplies'),
									new nlobjSearchColumn('custrecord_budget_office_salaries'),
									new nlobjSearchColumn('custrecord_budget_office_transpoallowanc'),
									new nlobjSearchColumn('custrecord_budget_office_mealallowance'),
									new nlobjSearchColumn('custrecord_budget_office_cellphonesubsid'),
									new nlobjSearchColumn('custrecord_budget_office_proretainersfee'),
									new nlobjSearchColumn('custrecord_budget_office_furnitures'),
									new nlobjSearchColumn('custrecord_budget_office_officeequipment'),
									new nlobjSearchColumn('custrecord_budget_office_displayallow'),
									new nlobjSearchColumn('custrecord_budget_office_taxlicenses'),
									new nlobjSearchColumn('custrecord_budget_office_rental'),
									new nlobjSearchColumn('custrecord_budget_office_bldginsurance'),
									new nlobjSearchColumn('custrecord_budget_sales_salaries'),
									new nlobjSearchColumn('custrecord_budget_sales_transpoallowance'),
									new nlobjSearchColumn('custrecord_budget_sales_mealallowance'),
									new nlobjSearchColumn('custrecord_budget_sales_depservice'),
									new nlobjSearchColumn('custrecord_budget_sales_tireexpense'),
									new nlobjSearchColumn('custrecord_budget_sales_batteryexpense'),
									new nlobjSearchColumn('custrecord_budget_sales_pushcart'),
									new nlobjSearchColumn('custrecord_budget_sales_vehicleinsurance'),
									new nlobjSearchColumn('custrecord_budget_sales_fuelexpense'),
									new nlobjSearchColumn('custrecord_budget_sales_registration'),
									new nlobjSearchColumn('custrecord_budget_sales_parkingfee'),
									new nlobjSearchColumn('custrecord_budget_sales_maintenance'),
									new nlobjSearchColumn('custrecord_budget_sales_servicerepairs'),
									new nlobjSearchColumn('custrecord_budget_sales_subdexpense'),
									new nlobjSearchColumn('custrecord_budget_sales_incentives'),
									new nlobjSearchColumn('custrecord_budget_sales_deptruck'),
									new nlobjSearchColumn('custrecord_budget_sales_tireexpensetruck'),
									new nlobjSearchColumn('custrecord_budget_sales_batteryexpensetr'),
									new nlobjSearchColumn('custrecord_budget_sales_vehicleinsur2'),
									new nlobjSearchColumn('custrecord_budget_sales_maintenancetruck')
								); 
				var resultbudget = nlapiSearchRecord('customrecord_budget', null, filterbudget, columnbudget);
				if(resultbudget != null){
					var sublistoffice_displayallow = resultbudget[0].getValue('custrecord_budget_office_displayallow');
					sublist.setLineItemValue('custpage_budget',2,sublistoffice_displayallow);
					var sublistoffice_salaries=resultbudget[0].getValue('custrecord_budget_office_salaries');
					sublist.setLineItemValue('custpage_budget',3,sublistoffice_salaries);
					var sublistoffice_mealallowance = resultbudget[0].getValue('custrecord_budget_office_mealallowance');
					sublist.setLineItemValue('custpage_budget',4,sublistoffice_mealallowance);
					var sublistoffice_cellphonesubsid = resultbudget[0].getValue('custrecord_budget_office_cellphonesubsid');
					sublist.setLineItemValue('custpage_budget',5,sublistoffice_cellphonesubsid);
					var sublistoffice_transpoallowanc = resultbudget[0].getValue('custrecord_budget_office_transpoallowanc');
					sublist.setLineItemValue('custpage_budget',6,sublistoffice_transpoallowanc);
					var sublistoffice_officeequipment = resultbudget[0].getValue('custrecord_budget_office_officeequipment');
					sublist.setLineItemValue('custpage_budget',7,sublistoffice_officeequipment);
					var sublistoffice_furnitures = resultbudget[0].getValue('custrecord_budget_office_furnitures');
					sublist.setLineItemValue('custpage_budget',8,sublistoffice_furnitures);
					var sublistoffice_bldginsurance = resultbudget[0].getValue('custrecord_budget_office_bldginsurance');
					sublist.setLineItemValue('custpage_budget',9,sublistoffice_bldginsurance);
					var sublistoffice_officesupplies = resultbudget[0].getValue('custrecord_budget_office_officesupplies');
					sublist.setLineItemValue('custpage_budget',10,sublistoffice_officesupplies);
					var sublistoffice_rental = resultbudget[0].getValue('custrecord_budget_office_rental');
					sublist.setLineItemValue('custpage_budget',11,sublistoffice_rental);
					var sublistoffice_proretainersfee = resultbudget[0].getValue('custrecord_budget_office_proretainersfee');
					sublist.setLineItemValue('custpage_budget',12,sublistoffice_proretainersfee);
					var sublistoffice_taxlicenses = resultbudget[0].getValue('custrecord_budget_office_taxlicenses');
					sublist.setLineItemValue('custpage_budget',13,sublistoffice_taxlicenses);
					var sublistopsales_subdexpense = resultbudget[0].getValue('custrecord_budget_sales_subdexpense');
					sublistop.setLineItemValue('custpage_budgetop',2,sublistopsales_subdexpense);
					var sublistopsales_salaries = resultbudget[0].getValue('custrecord_budget_sales_salaries');
					sublistop.setLineItemValue('custpage_budgetop',3,sublistopsales_salaries);
					var sublistopsales_incentives = resultbudget[0].getValue('custrecord_budget_sales_incentives');
					sublistop.setLineItemValue('custpage_budgetop',4,sublistopsales_incentives);
					var sublistopsales_mealallowance = resultbudget[0].getValue('custrecord_budget_sales_mealallowance');
					sublistop.setLineItemValue('custpage_budgetop',5,sublistopsales_mealallowance);
					var sublistopsales_transpoallowance = resultbudget[0].getValue('custrecord_budget_sales_transpoallowance');
					sublistop.setLineItemValue('custpage_budgetop',6,sublistopsales_transpoallowance);
					var sublistopsales_parkingfee = resultbudget[0].getValue('custrecord_budget_sales_parkingfee');
					sublistop.setLineItemValue('custpage_budgetop',7,sublistopsales_parkingfee);
					var sublistopsales_maintenancetruck = resultbudget[0].getValue('custrecord_budget_sales_maintenancetruck');
					sublistop.setLineItemValue('custpage_budgetop',8,sublistopsales_maintenancetruck);
					var sublistopsales_tireexpensetruck = resultbudget[0].getValue('custrecord_budget_sales_tireexpensetruck');
					sublistop.setLineItemValue('custpage_budgetop',9,sublistopsales_tireexpensetruck);
					var sublistopsales_batteryexpensetr = resultbudget[0].getValue('custrecord_budget_sales_batteryexpensetr');
					sublistop.setLineItemValue('custpage_budgetop',10,sublistopsales_batteryexpensetr);
					var sublistopsales_pushcart = resultbudget[0].getValue('custrecord_budget_sales_pushcart');
					sublistop.setLineItemValue('custpage_budgetop',11,sublistopsales_pushcart);
					var sublistopsales_maintenance = resultbudget[0].getValue('custrecord_budget_sales_maintenance');
					sublistop.setLineItemValue('custpage_budgetop',12,sublistopsales_maintenance);
					var sublistopsales_servicerepairs = resultbudget[0].getValue('custrecord_budget_sales_servicerepairs');
					sublistop.setLineItemValue('custpage_budgetop',13,sublistopsales_servicerepairs);
					var sublistopsales_tireexpense = resultbudget[0].getValue('custrecord_budget_sales_tireexpense');
					sublistop.setLineItemValue('custpage_budgetop',14,sublistopsales_tireexpense);
					var sublistopsales_batteryexpense = resultbudget[0].getValue('custrecord_budget_sales_batteryexpense');
					sublistop.setLineItemValue('custpage_budgetop',15,sublistopsales_batteryexpense);
					var sublistopsales_fuelexpense = resultbudget[0].getValue('custrecord_budget_sales_fuelexpense');
					sublistop.setLineItemValue('custpage_budgetop',16,sublistopsales_fuelexpense);
					var sublistopsales_deptruck = resultbudget[0].getValue('custrecord_budget_sales_deptruck');
					sublistop.setLineItemValue('custpage_budgetop',17,sublistopsales_deptruck);
					var sublistopsales_depservice = resultbudget[0].getValue('custrecord_budget_sales_depservice');
					sublistop.setLineItemValue('custpage_budgetop',18,sublistopsales_depservice);
					var sublistopsales_vehicleinsur2 = resultbudget[0].getValue('custrecord_budget_sales_vehicleinsur2');
					sublistop.setLineItemValue('custpage_budgetop',19,sublistopsales_vehicleinsur2);
					var sublistopsales_vehicleinsurance = resultbudget[0].getValue('custrecord_budget_sales_vehicleinsurance');
					sublistop.setLineItemValue('custpage_budgetop',20,sublistopsales_vehicleinsurance);
					var sublistopsales_registration = resultbudget[0].getValue('custrecord_budget_sales_registration');
					sublistop.setLineItemValue('custpage_budgetop',21,sublistopsales_registration);
					var subliswrwh_salaries = resultbudget[0].getValue('custrecord_budget_wh_salaries');
					subliswr.setLineItemValue('custpage_budgetwr',2,subliswrwh_salaries);
					var subliswrsales_delive = resultbudget[0].getValue('custrecordcustrecord_budget_sales_delive');
					subliswr.setLineItemValue('custpage_budgetwr',3,subliswrsales_delive);
					var subliswrwh_equipmentdepreciati = resultbudget[0].getValue('custrecord_budget_wh_equipmentdepreciati');
					subliswr.setLineItemValue('custpage_budgetwr',4,subliswrwh_equipmentdepreciati);
					var subliswrwh_insurance = resultbudget[0].getValue('custrecord_budget_wh_insurance');
					subliswr.setLineItemValue('custpage_budgetwr',5,subliswrwh_insurance);
					var subliswrwh_telecomm = resultbudget[0].getValue('custrecord_budget_wh_telecomm');
					subliswr.setLineItemValue('custpage_budgetwr',6,subliswrwh_telecomm);
					var subliswrwh_lightpowerwater = resultbudget[0].getValue('custrecord_budget_wh_lightpowerwater');
					subliswr.setLineItemValue('custpage_budgetwr',7,subliswrwh_lightpowerwater);
					var subliswrwh_rentexpense = resultbudget[0].getValue('custrecord_budget_wh_rentexpense');
					subliswr.setLineItemValue('custpage_budgetwr',8,subliswrwh_rentexpense);
					form.addSubmitButton('PRINT');
				}
				//var accnttest = ['1680','891','767','2273','1207','2263','2274','2094','2185','901','2242','2113','783','647','646','2264','912','776','2092','2272','2086','2099','2106','2187','2266','2269','2107','2186','2245','2087','2270','2275','2265','142','748','2110','2268','1206','2271'];
				var pestingperiod = new nlobjSearchFilter('formulatext',null,'startswith',perio);
				pestingperiod.setFormula('{postingperiod}');
				var filteractual =[
						new nlobjSearchFilter('class', null, 'anyof', princ),
						new nlobjSearchFilter('location', null, 'anyof', locas),
						pestingperiod
					];
				var columnactual = [
						new nlobjSearchColumn('account',null,'GROUP'),
						new nlobjSearchColumn('amount',null,'SUM')
					];	
				var resultactual = nlapiSearchRecord('transaction','customsearch852', filteractual, columnactual);
				if(resultactual != null){
					for(var ui = 0; ui < resultactual.length; ui++){
						var amnt = (resultactual[ui].getValue('amount',null,'SUM')* -1);	
						var accnttest = resultactual[ui].getValue('account',null,'GROUP');	
						switch(accnttest){
							case '1680':
								subliswr.setLineItemValue('custpage_actualwr',8,amnt);	
								subliswr.setLineItemValue('custpage_varncewr',8,subliswrwh_rentexpense - amnt);	
							break;
							case '891':
								subliswr.setLineItemValue('custpage_actualwr',7,amnt);
								subliswr.setLineItemValue('custpage_varncewr',7,subliswrwh_lightpowerwater - amnt);
							break;
							case '767':
								subliswr.setLineItemValue('custpage_actualwr',6,amnt);
								subliswr.setLineItemValue('custpage_varncewr',6,subliswrwh_telecomm - amnt);
							break;
							case '2273':
								subliswr.setLineItemValue('custpage_actualwr',2,amnt);
								subliswr.setLineItemValue('custpage_varncewr',2,subliswrwh_salaries - amnt);
							break;
							case '1207':
								subliswr.setLineItemValue('custpage_actualwr',5,amnt);
								subliswr.setLineItemValue('custpage_varncewr',5,subliswrwh_insurance - amnt);
							break;
							case '2263':
								subliswr.setLineItemValue('custpage_actualwr',4,amnt);
								subliswr.setLineItemValue('custpage_varncewr',4, subliswrwh_equipmentdepreciati - amnt);
							break;
							case '2274':
								subliswr.setLineItemValue('custpage_actualwr',3,amnt);
								subliswr.setLineItemValue('custpage_varncewr',3,subliswrsales_delive - amnt);
							break;
							case '2094':
								sublist.setLineItemValue('custpage_actual',10,amnt);
								sublist.setLineItemValue('custpage_varnce',10,sublistoffice_officesupplies - amnt);
							break;
							case '2185':
								sublist.setLineItemValue('custpage_actual',3,amnt);
								sublist.setLineItemValue('custpage_varnce',3,sublistoffice_salaries - amnt);
							break;
							case '901':
								sublist.setLineItemValue('custpage_actual',6,amnt);
								sublist.setLineItemValue('custpage_varnce',6,sublistoffice_transpoallowanc - amnt);
							break;
							case '2242':
								sublist.setLineItemValue('custpage_actual',4,amnt);
								sublist.setLineItemValue('custpage_varnce',4,sublistoffice_mealallowance - amnt);
							break;
							case '2113':
								sublist.setLineItemValue('custpage_actual',5,amnt);
								sublist.setLineItemValue('custpage_varnce',5,sublistoffice_cellphonesubsid - amnt);
							break;
							case '783':
								sublist.setLineItemValue('custpage_actual',12,amnt);
								sublist.setLineItemValue('custpage_varnce',12,sublistoffice_proretainersfee - amnt);
							break;
							case '647':
								sublist.setLineItemValue('custpage_actual',8,amnt);
								sublist.setLineItemValue('custpage_varnce',8,sublistoffice_furnitures - amnt);
							break;
							case '646':
								sublist.setLineItemValue('custpage_actual',7,amnt);
								sublist.setLineItemValue('custpage_varnce',7,sublistoffice_officeequipment - amnt);
							break;
							case '2264':
								sublist.setLineItemValue('custpage_actual',2,amnt);
								sublist.setLineItemValue('custpage_varnce',2,sublistoffice_displayallow - amnt);
							break;
							case '912':
								sublist.setLineItemValue('custpage_actual',13,amnt);
								sublist.setLineItemValue('custpage_varnce',13,sublistoffice_taxlicenses - amnt);
							break;
							case '776':
								sublist.setLineItemValue('custpage_actual',11,amnt);
								sublist.setLineItemValue('custpage_varnce',11,sublistoffice_rental - amnt);
							break;
							case '2092':
								sublist.setLineItemValue('custpage_actual',9,amnt);
								sublist.setLineItemValue('custpage_varnce',9,sublistoffice_bldginsurance - amnt);
							break;
							case '2272':
								sublistop.setLineItemValue('custpage_actualop',3,amnt);
								sublistop.setLineItemValue('custpage_varnceop',3,sublistopsales_salaries - amnt);
							break;
							case '2086':
								sublistop.setLineItemValue('custpage_actualop',6,amnt);
								sublistop.setLineItemValue('custpage_varnceop',6,sublistopsales_transpoallowance - amnt);
							break;
							case '2099':
								sublistop.setLineItemValue('custpage_actualop',5,amnt);							
								sublistop.setLineItemValue('custpage_varnceop',5,sublistopsales_mealallowance - amnt);							
							break;
							case '2106':
								sublistop.setLineItemValue('custpage_actualop',18,amnt);
								sublistop.setLineItemValue('custpage_varnceop',18,sublistopsales_depservice - amnt);
							break;
							case '2187':
								sublistop.setLineItemValue('custpage_actualop',14,amnt);
								sublistop.setLineItemValue('custpage_varnceop',14,sublistopsales_tireexpense - amnt);
							break;
							case '2266':
								sublistop.setLineItemValue('custpage_actualop',15,amnt);
								sublistop.setLineItemValue('custpage_varnceop',15,sublistopsales_batteryexpense - amnt);
							break;
							case '2269':
								sublistop.setLineItemValue('custpage_actualop',11,amnt);
								sublistop.setLineItemValue('custpage_varnceop',11,sublistopsales_pushcart - amnt);
							break;
							case '2107':
								sublistop.setLineItemValue('custpage_actualop',20,amnt);
								sublistop.setLineItemValue('custpage_varnceop',20,sublistopsales_vehicleinsurance - amnt);
							break;
							case '2186':
								sublistop.setLineItemValue('custpage_actualop',16,amnt);
								sublistop.setLineItemValue('custpage_varnceop',16,sublistopsales_fuelexpense - amnt);
							break;
							case '2245':
								sublistop.setLineItemValue('custpage_actualop',21,amnt);
								sublistop.setLineItemValue('custpage_varnceop',21,sublistopsales_registration - amnt);
							break;
							case '2087':
								sublistop.setLineItemValue('custpage_actualop',7,amnt);								
								sublistop.setLineItemValue('custpage_varnceop',7,sublistopsales_parkingfee - amnt);								
							break;
							case '2270':
								sublistop.setLineItemValue('custpage_actualop',12,amnt);
								sublistop.setLineItemValue('custpage_varnceop',12,sublistopsales_maintenance - amnt);
							break;
							case '2275':
								sublistop.setLineItemValue('custpage_actualop',13,amnt);
								sublistop.setLineItemValue('custpage_varnceop',13,sublistopsales_servicerepairs - amnt);
							break;
							case '2265':
								sublistop.setLineItemValue('custpage_actualop',2,amnt);	
								sublistop.setLineItemValue('custpage_varnceop',2,sublistopsales_subdexpense - amnt);	
							break;									
							case '142':
								sublistop.setLineItemValue('custpage_actualop',4,amnt);
								sublistop.setLineItemValue('custpage_varnceop',4,sublistopsales_incentives - amnt);
							break;
							case '748':
								sublistop.setLineItemValue('custpage_actualop',17,amnt);									
								sublistop.setLineItemValue('custpage_varnceop',17,sublistopsales_deptruck - amnt);									
							break;
							case '2110':
								sublistop.setLineItemValue('custpage_actualop',9,amnt);
								sublistop.setLineItemValue('custpage_varnceop',9,sublistopsales_tireexpensetruck - amnt);
							break;
							case '2268':
								sublistop.setLineItemValue('custpage_actualop',10,amnt);
								sublistop.setLineItemValue('custpage_varnceop',10,sublistopsales_batteryexpensetr - amnt);
							break;
							case '1206':
								sublistop.setLineItemValue('custpage_actualop',19,amnt);
								sublistop.setLineItemValue('custpage_varnceop',19,sublistopsales_vehicleinsur2 - amnt);
							break;
							case '2271':
								sublistop.setLineItemValue('custpage_actualop',8,amnt);
								sublistop.setLineItemValue('custpage_varnceop',8,sublistopsales_maintenancetruck - amnt);
							break;	
						}
					}
				}
			nlapiGetContext().setSessionObject('status', 'post');
			response.writePage(form);
			}else{	
			html = nlapiGetContext().getSetting('SCRIPT', 'custscript31');
			printprinc = request.getParameter('custpage_principal');
			printloca = request.getParameter('custpage_location');
			printperiod = request.getParameter('custpage_period');

			var loopparticular = "";//particulars
				loopdepartment = "",//payments
				loopbudget=0,//invoice
				loopactual = 0,//additon
				loopvariance=0,//deduction
				table = '';
				
				linesublist = request.getLineItemCount('custpage_sublistsales');
				linesublistop = request.getLineItemCount('custpage_sublistsalescost');
				linesubliswr = request.getLineItemCount('custpage_sublistwarehouse');
				totaltwo = linesublist + linesublistop;
				
				for(var iv = 1; iv <= linesublist; iv++) {
					loopparticular = request.getLineItemValue('custpage_sublistsales', 'custpage_particular', iv);
					loopdepartment = request.getLineItemValue('custpage_sublistsales', 'custpage_deparment', iv);
					loopbudget = request.getLineItemValue('custpage_sublistsales', 'custpage_budget', iv);
					loopactual =request.getLineItemValue('custpage_sublistsales', 'custpage_varnce', iv);
					loopvariance =request.getLineItemValue('custpage_sublistsales', 'custpage_varnce', iv);
					if(loopdepartment == null){
						loopdepartment = ' ';
						loopbudget = ' ';
						loopactual = ' ';
						loopvariance = ' ';
					}		
					if(loopbudget == null){ 
						loopbudget = 0.00;
						loopvariance = loopactual;
					}		
					if(loopactual == null && loopvariance == null){
						loopactual = '';
						loopvariance = loopbudget;
					}
					table += rows(loopparticular,loopdepartment,loopbudget,loopactual,loopvariance);
				}
				for(var ivy = 1 ; ivy <= linesublistop; ivy++) {
					loopparticular = request.getLineItemValue('custpage_sublistsalescost', 'custpage_particularop', ivy);
					loopdepartment = request.getLineItemValue('custpage_sublistsalescost', 'custpage_deparmentop', ivy);
					loopbudget = request.getLineItemValue('custpage_sublistsalescost', 'custpage_budgetop', ivy);
					loopactual =request.getLineItemValue('custpage_sublistsalescost', 'custpage_actualop', ivy);
					loopvariance =request.getLineItemValue('custpage_sublistsalescost', 'custpage_varnceop', ivy);
					if(loopdepartment == null){
						loopdepartment = ' ';
						loopbudget = ' ';
						loopactual = ' ';
						loopvariance = ' ';
					}		
					if(loopbudget == null){ 
						loopbudget = 0.00;
						loopvariance = loopactual;
					}		
					if(loopactual == null && loopvariance == null){
						loopactual = '';
						loopvariance = loopbudget;
					}
					table += rows(loopparticular,loopdepartment,loopbudget,loopactual,loopvariance);
				}
				for(var noeh = 1; noeh <= linesubliswr; noeh++) {
					loopparticular = request.getLineItemValue('custpage_sublistwarehouse', 'custpage_particularwr', noeh);
					loopdepartment = request.getLineItemValue('custpage_sublistwarehouse', 'custpage_deparmentwr', noeh);
					loopbudget = request.getLineItemValue('custpage_sublistwarehouse', 'custpage_budgetwr', noeh);
					loopactual =request.getLineItemValue('custpage_sublistwarehouse', 'custpage_actualwr', noeh);
					loopvariance =request.getLineItemValue('custpage_sublistwarehouse', 'custpage_varncewr', noeh);
					
					if(loopbudget == null){ 
						loopbudget = 0.00;
						loopvariance = loopactual;
					}		
					if(loopactual == null && loopvariance == null){
						loopactual = '';
						loopvariance = loopbudget;
					}
					if(loopdepartment == null){
						loopdepartment = '-';
						loopbudget = '';
						loopactual = 0.00 ;
						loopvariance = '';
					}		
					table += rows(loopparticular,loopdepartment,loopbudget,loopactual,loopvariance);
				}
			html = html.replace('{obcsprinc}', printprinc);
			html = html.replace('{obcsloc}', printloca);
			html = html.replace('{obcsperiod}', printperiod);
			html = html.replace('{body}', table);
			html = replaceall(html, '&', ' and ');
			var file = nlapiXMLToPDF(html);
			response.setContentType('PDF', printprinc + '.pdf', 'inline');
			response.write(file.getValue());
			}	
		}
	}
function rows(loopparticular,loopdepartment,loopbudget,loopactual,loopvariance) {
	return	"<tr>" +
			"<td class='subfour'>" + loopparticular + "</td>" +
			"<td class='subfour' align='center'>" + loopdepartment + "</td>" +
			"<td class='subfour' align='center'>" + loopbudget + "</td>" +
			"<td class='subfour' align='center'>" + loopactual + "</td>" +
			"<td class='subfour' align='right'>" + loopvariance + "</td>" +
			"</tr>"
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