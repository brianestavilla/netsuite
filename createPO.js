function AutoCreatePO() {
	var getrecord = nlapiGetNewRecord(); //get current record
	
	var internalid1 = getrecord.getId();
	var recordtype = getrecord.getRecordType();
	
	//var vendor = getrecord.getFieldValue('custrecord53');
	var date = getrecord.getFieldValue('custrecord40'); // get date
	var department = getrecord.getFieldValue('custrecord38');// get department
	var typeofpo = getrecord.getFieldValue('custrecord41');// get type of PO
	var location = getrecord.getFieldValue('custrecord76');// get location
	var principal = getrecord.getFieldValue('custrecord130'); // get principal
	//var prnumber = getrecord.getFieldValue('custrecord39');// 
	var canvassedby = getrecord.getFieldValue('custrecord62'); // get canvassedby
	var updatedby = getrecord.getFieldValue('custrecord190');// get updated by
	var requester = getrecord.getFieldValue('custrecord773'); // get requester
	var remarks = getrecord.getFieldValue('custrecord42'); // get remarks
	var jobno = getrecord.getFieldValue('custrecord673'); // get job order number
	var assetname = getrecord.getFieldValue('custrecord681'); // get asset name
	
	var tempvendor = '';
	var counter = 1;
	var countnumofPO = 0;
	var ponumbers = new Array();
	var ponum = '';
	
	var linecount = getrecord.getLineItemCount('recmachcustrecord33');
	
	var columns = new Array(new nlobjSearchColumn('custrecord34','custrecord33'), //item code
		new nlobjSearchColumn('custrecord46','custrecord33'), //description
		new nlobjSearchColumn('custrecord48','custrecord33'), // quantity order
		new nlobjSearchColumn('custrecord58','custrecord33'), // unit cost
		new nlobjSearchColumn('custrecord59','custrecord33'), // amount
		new nlobjSearchColumn('custrecord380','custrecord33'), //vendor
		new nlobjSearchColumn('custrecord381','custrecord33'),// terms
		//new nlobjSearchColumn('custrecord382','custrecord33')// PO number
		new nlobjSearchColumn('custrecord607','custrecord33'), // tax code
		new nlobjSearchColumn('custrecord608','custrecord33'), // tax rate
		new nlobjSearchColumn('custrecord610','custrecord33'), // tax amount
		new nlobjSearchColumn('custrecord609','custrecord33') // gross amount
	);
		columns[5].setSort();
	
	var filter = new nlobjSearchFilter('internalid',null,'is',internalid1); //filter by internalid
	var result = nlapiSearchRecord('customrecord111','customsearch130',filter,columns);
	
	var createRecord = nlapiCreateRecord('purchaseorder');

	createRecord.setFieldValue('trandate',date); //set date
	createRecord.setFieldValue('department',department); //set department
	createRecord.setFieldValue('custbody4',typeofpo); // set type
	createRecord.setFieldValue('location',location); // set location
	createRecord.setFieldValue('class',principal); // set principal
	createRecord.setFieldValue('custbody55',internalid1); // set pr number to PO
	createRecord.setFieldValue('customform','121');// set custom form
	createRecord.setFieldValue('custbody38','2'); //set payment type
	createRecord.setFieldValue('memo',remarks); //set remarks
	createRecord.setFieldValue('custbody162',jobno); //set jono
	createRecord.setFieldValue('custbody163',assetname); //set assetname
	
	
	/*if(canvassedby == '' || canvassedby == null){
		createRecord.setFieldValue('custbody8',updatedby); //set encoded by to updatedby
	}else{
		createRecord.setFieldValue('custbody8',canvassedby); //set encoded by to canvass by
	}*/
	
	if(canvassedby != null){
		createRecord.setFieldValue('custbody8',canvassedby); //set encoded by to canvass by
	}else{
		createRecord.setFieldValue('custbody8',updatedby); //set encoded by to updatedby
	}
	
	//get result of items
	for(var i = 0; result !=null && i < result.length; i++) {
		//get result values
		var searchresult = result[i];
		
		var itemcode = searchresult.getValue('custrecord34','custrecord33'); //get itemcode
		var desc = searchresult.getValue('custrecord46','custrecord33'); //get description
		var quantityorder = searchresult.getValue('custrecord48','custrecord33'); //get quantity order
		var unitcost = searchresult.getValue('custrecord58','custrecord33'); //get unitcost
		var amount = searchresult.getValue('custrecord59','custrecord33'); //get amount
		var vendor = searchresult.getValue('custrecord380','custrecord33'); //get vendor
		var terms = searchresult.getValue('custrecord381','custrecord33'); //get terms
		//var ponumber = searchresult.getValue('custrecord382','custrecord33'); //get PO number
		var taxcode = searchresult.getValue('custrecord607','custrecord33'); //tax code
		var taxrate = searchresult.getValue('custrecord608','custrecord33'); //tax rate
		var taxamt = searchresult.getValue('custrecord610','custrecord33'); //tax amt
		var grossamt = searchresult.getValue('custrecord609','custrecord33'); //gross amt
		
		
		
		if(amount != '' && vendor != ''){
		var totalamount = 0;
			if(tempvendor == '' || vendor == tempvendor){
				createRecord.setLineItemValue('item','item',counter,itemcode);
				createRecord.setLineItemValue('item','description',counter,desc);
				createRecord.setLineItemValue('item','quantity',counter,quantityorder);
				createRecord.setLineItemValue('item','rate',counter,unitcost);
				createRecord.setLineItemValue('item','amount',counter,amount);
				createRecord.setLineItemValue('item','taxcode',counter,taxcode);// tax code
				createRecord.setLineItemValue('item','taxrate',counter,taxrate);// tax rate
				createRecord.setLineItemValue('item','taxamount',counter,taxamt);// tax amount
				createRecord.setLineItemValue('item','grossamount',counter,grossamt);// gross amount
				createRecord.setFieldValue('entity',vendor); //set vendor
				createRecord.setFieldValue('custbody120',terms); //terms
				createRecord.setFieldValue('custbody157',requester); //name of requester
				
				var totalamount = totalamount + parseFloat(grossamt);
				createRecord.setFieldValue('custbody35',totalamount); //set totalamount
				tempvendor = vendor; //first loop vendor
				counter++;
			}else{
				var id = nlapiSubmitRecord(createRecord, true);
				var ponumber = nlapiLookupField('purchaseorder',id,'tranid'); //get PO number
				
				ponumbers[countnumofPO] = id;
				ponum += id + "; ";
				countnumofPO++;
				
				
					//create new record
					createRecord = null;
					createRecord = nlapiCreateRecord('purchaseorder');
					
					var totalamount = 0;
					counter = 1;
					
					createRecord.setFieldValue('trandate',date); //set date
					createRecord.setFieldValue('department',department); //set department
					createRecord.setFieldValue('custbody4',typeofpo); // set type
					createRecord.setFieldValue('location',location); // set location
					createRecord.setFieldValue('class',principal); // set principal
					createRecord.setFieldValue('custbody55',internalid1); // set pr number to PO
					createRecord.setFieldValue('customform','121');// set custom form
					createRecord.setFieldValue('custbody38','2'); //set payment type
					createRecord.setFieldValue('custbody157',requester); //name of requester
					createRecord.setFieldValue('memo',remarks); //set remarks
					createRecord.setFieldValue('custbody162',jobno); //set jono
					createRecord.setFieldValue('custbody163',assetname); //set assetname
	
					if(canvassedby != null){
						createRecord.setFieldValue('custbody8',canvassedby); //set encoded by to canvass by
					}else{
						createRecord.setFieldValue('custbody8',updatedby); //set encoded by to updatedby
					}
					
					createRecord.setLineItemValue('item','item',counter,itemcode);
					createRecord.setLineItemValue('item','description',counter,desc);
					createRecord.setLineItemValue('item','quantity',counter,quantityorder);
					createRecord.setLineItemValue('item','rate',counter,unitcost);
					createRecord.setLineItemValue('item','amount',counter,amount);
					createRecord.setLineItemValue('item','taxcode',counter,taxcode);// tax code
					createRecord.setLineItemValue('item','taxrate',counter,taxrate);// tax rate
					createRecord.setLineItemValue('item','taxamount',counter,taxamt);// tax amount
					createRecord.setLineItemValue('item','grossamount',counter,grossamt);// gross amount
					createRecord.setFieldValue('entity',vendor); //set vendor
					createRecord.setFieldValue('custbody120',terms); //terms
					
					var totalamount = totalamount + parseFloat(grossamt);
					createRecord.setFieldValue('custbody35',totalamount); //set totalamount
					
					counter++;
					tempvendor = vendor;
			}
		
		}
	}
	
	if(result !=null){
		var id = nlapiSubmitRecord(createRecord, true);
		var ponumber = nlapiLookupField('purchaseorder',id,'tranid'); //get PO number
		var podate = nlapiLookupField('purchaseorder',id,'trandate'); //get PO date
		
		ponumbers[countnumofPO] = id;
		ponum += id + "; ";
		countnumofPO++;
		
		//nlapiSubmitField(recordtype,internalid1,'custrecord391',ponumbers);//update po numbers
		//nlapiSubmitField(recordtype,internalid1,'custrecord56',podate);//update po date
		getrecord.setFieldValue('custrecord391', ponumbers);
		getrecord.setFieldValue('custrecord56', podate);
		return ponum;
		//return podate;
	}
}