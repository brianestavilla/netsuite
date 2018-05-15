function getItemReceiptDate(type,name){
		var getPOinternalid = getParam('id'); // po internal id
		
		try{
			if(getPOinternalid != null){
				var record = nlapiLoadRecord('purchaseorder',getPOinternalid); //load po record
				
				var ponumber = record.getFieldValue('tranid'); //store poid
				var date;
				var itemreceptid;
				var invoiceno;
				var filter = new nlobjSearchFilter('createdfrom',null,'is',getPOinternalid);
				var result = nlapiSearchRecord('itemreceipt','customsearch105',filter,null);
				for(var i = 0; i < result.length; i++){
					var retdate = result[i];
					date = retdate.getValue('trandate');
					itemreceptid = retdate.getValue('internalid');
					invoiceno = retdate.getValue('custbody156');
				}
				nlapiSetFieldValue('custbody121',getPOinternalid); // set createdfrom id
				nlapiSetFieldValue('custbody95',itemreceptid); //set rr number
				nlapiSetFieldValue('trandate',date); //set rr date	
				nlapiSetFieldValue('tranid',invoiceno); //set supplier invoice number
				nlapiSetFieldValue('custbody62','2'); //set bill type
				nlapiSetFieldValue('custbody51','7'); //set nontrade type
				nlapiSetFieldValue('account','864'); //set nontrade type
			}else{
				nlapiDisableField('trandate',false);
			}
			
			document.getElementById("item_addedit").disabled=true;
		}catch(e){
		}	
		
		
}

function getParam(name) {
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var tmpURL = window.location.href;
  var results = regex.exec( tmpURL );
  if( results == null )
    return "";
  else
    return results[1];
}
