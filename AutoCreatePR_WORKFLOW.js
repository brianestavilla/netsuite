function AutoCreatePR_WORKFLOW(){
	// initialize pr number
	//series = numberSeries('get', 'customrecord111'); // get pr series
	//nlapiSetFieldValue('custrecord715', series); // set pr number
	
	//try{
	var getrecord = nlapiGetNewRecord(); //get current record JO
	var internalid1 = getrecord.getId();
	var recordtype = getrecord.getRecordType();
	//var currentuser = nlapiGetUser();
			
	var customform = '21';
	//var prnumber = getrecord.getFieldValue('custrecord715');  // get pr number
	var reqDepartment = getrecord.getFieldValue('custrecord727'); //get department
	var location = getrecord.getFieldValue('custrecord513'); //get location
	var date = getrecord.getFieldValue('custrecord508'); //get date
	var type = getrecord.getFieldValue('custrecord729'); //get type
	var jonumber = internalid1; //get jo number
	var relatedasset = getrecord.getFieldValue('custrecord577'); //get related asset;
	var purpose = getrecord.getFieldValue('custrecord730'); //get purpose
	//var totalamount = getrecord.getFieldValue('custrecord40'); //get total amount
	var principal = getrecord.getFieldValue('custrecord731'); //get principal
	var nameofrequester = getrecord.getFieldValue('custrecord783'); //get name of requester
	var plateno = getrecord.getFieldValue('custrecord512'); // get plateno
	
	var linecounter = 1;
			
	var createPR = nlapiCreateRecord('customrecord111'); // create PR
			
	createPR.setFieldValue('customform',customform); //set custom form
	//createPR.setFieldValue('name',prnumber); //set prnumber
	createPR.setFieldValue('custrecord38',reqDepartment); //set requesting department
	createPR.setFieldValue('custrecord76',location); //set location
	createPR.setFieldValue('custrecord40',date); //set date
	createPR.setFieldValue('custrecord41',type); //set type
	createPR.setFieldValue('custrecord673',jonumber); //set jo number
	createPR.setFieldValue('custrecord681',relatedasset); //set related asset
	createPR.setFieldValue('custrecord42',purpose); //set purpose
	createPR.setFieldValue('custrecord130',principal); //set principal
	createPR.setFieldValue('custrecord773',nameofrequester); //set name of requester
	createPR.setFieldValue('custrecord879',plateno); //set plateno
			
	var materialcostlinecount = getrecord.getLineItemCount('recmachcustrecord636'); // material cost line item count
	
	for(var i = 1; i <= materialcostlinecount; i++){
		var itemcode = getrecord.getLineItemValue('recmachcustrecord636','custrecord638',i); //get itemcode
		var desc = getrecord.getLineItemValue('recmachcustrecord636','custrecord639',i); //get desciption
		var qty = getrecord.getLineItemValue('recmachcustrecord636','custrecord635',i); //get quantity
		//var unitcost = getrecord.getLineItemValue('recmachcustrecord636','custrecord642',i); //get unitcost
		//var amount = getrecord.getLineItemValue('recmachcustrecord636','custrecord643',i); //get amount
		var repairtype = getrecord.getLineItemValue('recmachcustrecord636','custrecord712',i); //get repair type
				
			//if(repairtype == '2'){ //1 = In-house, 2 = Job out
				createPR.setLineItemValue('recmachcustrecord33','custrecord34',linecounter,itemcode); //set itemcode to pr
				createPR.setLineItemValue('recmachcustrecord33','custrecord46',linecounter,desc); //set description to pr
				createPR.setLineItemValue('recmachcustrecord33','custrecord48',linecounter,qty); //set quantity to pr
				//createPR.setLineItemValue('recmachcustrecord33','custrecord58',linecounter,unitcost); //set unitcost to pr
				//createPR.setLineItemValue('recmachcustrecord33','custrecord59',linecounter,amount); //set amount to pr
					
					linecounter++;
			//}	
	}
			
		var laborcostlinecount = getrecord.getLineItemCount('recmachcustrecord523'); // labor cost line item count
			
			for(var j = 1; j <= laborcostlinecount; j++){
				var jobcode = getrecord.getLineItemValue('recmachcustrecord523','custrecord520',j); //get jobcode
				var jobdesc = getrecord.getLineItemValue('recmachcustrecord523','custrecord521',j); //get job desciption
				//var noofdays = getrecord.getLineItemValue('recmachcustrecord523','custrecord668',j); //get number of days
				//var rate = getrecord.getLineItemValue('recmachcustrecord523','custrecord522',j); //get rate
				//var laboramount = getrecord.getLineItemValue('recmachcustrecord523','custrecord669',j); //get amount
				var laborrepairtype = getrecord.getLineItemValue('recmachcustrecord523','custrecord713',j); //get repair type
				
			if(laborrepairtype == '2'){ //1 = In-house, 2 = Job out
				createPR.setLineItemValue('recmachcustrecord33','custrecord34',linecounter,jobcode); //set itemcode to pr
				createPR.setLineItemValue('recmachcustrecord33','custrecord46',linecounter,jobdesc); //set description to pr
				createPR.setLineItemValue('recmachcustrecord33','custrecord48',linecounter,1); //set number of days
				//createPR.setLineItemValue('recmachcustrecord33','custrecord58',linecounter,rate); //set rate
				//createPR.setLineItemValue('recmachcustrecord33','custrecord59',linecounter,laboramount); //set amount to pr
					
					linecounter++;
				}
		}
			
		if(linecounter > 1){
			var prid = nlapiSubmitRecord(createPR, true);
			var prnumberrr = nlapiLookupField('customrecord111',prid,'id');
			getrecord.setFieldValue('custrecord715',prnumberrr);
			//numberSeries('fix', 'customrecord111'); // increment pr series
		}
	//}catch(err){}
}
