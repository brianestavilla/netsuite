function createJE(type,form){

	var record = nlapiGetNewRecord();

	var jerefno = record.getFieldValue('custbody209');

	if( type == 'create' || type == 'edit' && jerefno == ''){

		var recordid = record.getId();
		var recordtype = record.getRecordType();
		var customer = record.getFieldValue('entity');
		var department = record.getFieldValue('department');
		var principal = record.getFieldValue('class');
		var location = record.getFieldValue('location');
		var date = record.getFieldValue('trandate');
		var memo = record.getFieldValue('memo');

		var adv_to_sup = 0;
		var adv_to_emp = 0;
		var adv_to_tru = 0;
		var mda = 0;

		var counter = 0;
		
		var recordJE = nlapiCreateRecord('journalentry');
		recordJE.setFieldValue('trandate', date);
		recordJE.setFieldValue('custbody210',recordid);
		
		var linecount = record.getLineItemCount('item');

		for(var i = 1; i <= linecount; i++){

			var item = record.getLineItemText('item', 'item', i);
			var trucker = record.getLineItemValue('item', 'custcol34', i);
			var amount = record.getLineItemValue('item', 'amount', i);
			var vatcode = record.getLineItemValue('item', 'taxcode', i);
			var vatrate = record.getLineItemValue('item', 'taxrate1', i);
			var vatamt = record.getLineItemValue('item','tax1amt', i);
			var grossamt = record.getLineItemValue('item', 'grossamt', i);
			
			if(item.match(/Adv to Sup/gi) != null){

				counter++;

				//2198 adv to sup id
				recordJE.setLineItemValue('line','account',counter,'2198'); //set toaccount
				recordJE.setLineItemValue('line','entity',counter,trucker); //set trucker
				recordJE.setLineItemValue('line','debit',counter,amount); //set debit
				recordJE.setLineItemValue('line','department',counter,department);// set department
				recordJE.setLineItemValue('line','location',counter,location);// set location
				recordJE.setLineItemValue('line','class',counter,principal);// set principal
				recordJE.setLineItemValue('line','memo',counter,memo); //set memo
				recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
				recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
				recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
				recordJE.setLineItemValue('line','grossamt',counter,grossamt);// set gross amount
				recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount

				adv_to_sup += parseFloat(amount);
				

			}else if(item.match(/CHARGE TO EMP/gi) != null || item.match(/ADV TO EMP/gi) != null){

				counter++;

				//Advances to Officers and Employees - 113
				recordJE.setLineItemValue('line','account',counter,'113'); //set toaccount
				recordJE.setLineItemValue('line','entity',counter,trucker); //set trucker
				recordJE.setLineItemValue('line','debit',counter,amount); //set debit
				recordJE.setLineItemValue('line','department',counter,department);// set department
				recordJE.setLineItemValue('line','location',counter,location);// set location
				recordJE.setLineItemValue('line','class',counter,principal);// set principal
				recordJE.setLineItemValue('line','memo',counter,memo); //set memo
				recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
				recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
				recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
				recordJE.setLineItemValue('line','grossamt',counter,grossamt);// set gross amount
				recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount
			
				adv_to_emp += parseFloat(amount);

			}else if(item.match(/ADV TO TRU/gi) != null){

				counter++;

				//Advances to Trucker - 2321
				recordJE.setLineItemValue('line','account',counter,'2321'); //set toaccount
				recordJE.setLineItemValue('line','entity',counter,trucker); //set trucker
				recordJE.setLineItemValue('line','debit',counter,amount); //set debit
				recordJE.setLineItemValue('line','department',counter,department);// set department
				recordJE.setLineItemValue('line','location',counter,location);// set location
				recordJE.setLineItemValue('line','class',counter,principal);// set principal
				recordJE.setLineItemValue('line','memo',counter,memo); //set memo
				recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
				recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
				recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
				recordJE.setLineItemValue('line','grossamt',counter,grossamt);// set gross amount
				recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount

				adv_to_tru += parseFloat(amount);

			}else if(item.match(/MDA/gi) != null){

				counter++;

				//MDA - 2199
				recordJE.setLineItemValue('line','account',counter,'2199'); //set toaccount
				recordJE.setLineItemValue('line','entity',counter,trucker); //set trucker
				recordJE.setLineItemValue('line','debit',counter,amount); //set debit
				recordJE.setLineItemValue('line','department',counter,department);// set department
				recordJE.setLineItemValue('line','location',counter,location);// set location
				recordJE.setLineItemValue('line','class',counter,principal);// set principal
				recordJE.setLineItemValue('line','memo',counter,memo); //set memo
				recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
				recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
				recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
				recordJE.setLineItemValue('line','grossamt',counter,grossamt);// set gross amount
				recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount

				mda += parseFloat(amount);

			}
			
		}

		if(adv_to_sup > 0)
		{
			counter++;

			recordJE.setLineItemValue('line','account',counter,'2198'); //set fromaccount
			recordJE.setLineItemValue('line','entity',counter,customer); //set customer
			recordJE.setLineItemValue('line','credit',counter,adv_to_sup);//set credit
			recordJE.setLineItemValue('line','department',counter,department);
			recordJE.setLineItemValue('line','location',counter,location);
			recordJE.setLineItemValue('line','class',counter,principal);
			recordJE.setLineItemValue('line','memo',counter,memo); //set memo
			recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
			recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
			recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
			recordJE.setLineItemValue('line','grossamt',counter,adv_to_sup);// set gross amount
			recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount
		}

		if(adv_to_emp > 0)
		{
			counter++;

			recordJE.setLineItemValue('line','account',counter,'113'); //set fromaccount
			recordJE.setLineItemValue('line','entity',counter,customer); //set customer
			recordJE.setLineItemValue('line','credit',counter,adv_to_emp);//set credit
			recordJE.setLineItemValue('line','department',counter,department);
			recordJE.setLineItemValue('line','location',counter,location);
			recordJE.setLineItemValue('line','class',counter,principal);
			recordJE.setLineItemValue('line','memo',counter,memo); //set memo
			recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
			recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
			recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
			recordJE.setLineItemValue('line','grossamt',counter,adv_to_emp);// set gross amount
			recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount
		
		}

		if(adv_to_tru > 0)
		{
			counter++;

			recordJE.setLineItemValue('line','account',counter,'2321'); //set fromaccount
			recordJE.setLineItemValue('line','entity',counter,customer); //set customer
			recordJE.setLineItemValue('line','credit',counter,adv_to_tru);//set credit
			recordJE.setLineItemValue('line','department',counter,department);
			recordJE.setLineItemValue('line','location',counter,location);
			recordJE.setLineItemValue('line','class',counter,principal);
			recordJE.setLineItemValue('line','memo',counter,memo); //set memo
			recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
			recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
			recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
			recordJE.setLineItemValue('line','grossamt',counter,adv_to_tru);// set gross amount
			recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount

		}

		if(mda > 0)
		{
			counter++;

			recordJE.setLineItemValue('line','account',counter,'2199'); //set fromaccount
			recordJE.setLineItemValue('line','entity',counter,customer); //set customer
			recordJE.setLineItemValue('line','credit',counter,mda);//set credit
			recordJE.setLineItemValue('line','department',counter,department);
			recordJE.setLineItemValue('line','location',counter,location);
			recordJE.setLineItemValue('line','class',counter,principal);
			recordJE.setLineItemValue('line','memo',counter,memo); //set memo
			recordJE.setLineItemValue('line','taxcode',counter,vatcode);// set taxcode
			recordJE.setLineItemValue('line','taxrate1',counter,vatrate);// set taxrate
			recordJE.setLineItemValue('line','tax1amt',counter,vatamt);// set tax amount
			recordJE.setLineItemValue('line','grossamt',counter,mda);// set gross amount
			recordJE.setLineItemValue('line','tax1acct',counter,'110');// set taxaccount

		}

		if(adv_to_sup > 0 || adv_to_emp > 0 || adv_to_tru > 0 || mda > 0)
		{
			var jeinternalid = nlapiSubmitRecord(recordJE,null,true); //create journal entry
			//nlapiLogExecution('ERROR', 'je', jeinternalid);
			//set je reference number.
			//record.setFieldValue('custbody209', jeinternalid.toString());
			nlapiSubmitField(recordtype, recordid, 'custbody209', jeinternalid.toString());
		}

	}
	
	//nlapiLogExecution('DEBUG', 'result', itemIndex);
}

function getResult(result){
	var res = [];
	
	for(var i = 0; i < result.length; i++){
		res[i] = result[i].getValue('internalid');
	}
	return res;
}

