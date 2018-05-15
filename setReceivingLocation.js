function setLocation()
{
	wlocation = nlapiLookupField('employee', nlapiGetUser(), 'custentity38', false);
	for(var i = 1; i <= nlapiGetLineItemCount('item'); i++){
		nlapiSelectLineItem('item', i);
		setTimeout(
			function (){
				nlapiSetCurrentLineItemValue('item', 'location', wlocation)
			}, 50);
	}
}


function saveRecordReceivingLocation() {

	if(nlapiGetFieldValue('customform') == '110'){ //DDI Item Receipt
		for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) {
			var location = nlapiGetLineItemText('item','location',i);
			if(!location.match(/GOOD/gi)){
				alert('Receiving location must be GOOD.');
				return false;
			}
		};
	}

	/**
	**	Added By Brian 7/11/2017
    ** 	Role Validation in Receiving Stocks
    **/

	
	if(nlapiGetRole() == 1063) { //1063 = BO in-charge
	  var error_indicator = 0;
      //for(var i = 1; i<=nlapiGetLineItemCount('item'); i++) { if(/good/i.test(nlapiGetLineItemText('item','location',i))) { error_indicator = 1; } }

      	//if(error_indicator == 1) {
        //  alert('BO in-charge role cannot receive GOOD Stocks');
         // return false;
       // }

    } else if(nlapiGetRole() == 1045) { // 1045 = Warehouse Custodian
	  	var error_indicator = 0;
      
      	//for(var i = 1; i<=nlapiGetLineItemCount('item'); i++) { if(/bo/i.test(nlapiGetLineItemText('item','location',i))) { error_indicator = 1; } }

      	//if(error_indicator == 1) {
        //  alert('Warehouse Custodian role cannot receive BO Stocks');
        //  return false;
        //}

    }

  return true;
}

function setLocationUE(type, form)
{
	wlocation = nlapiLookupField('employee', nlapiGetUser(), 'custentity38', false);
	//form.getSubList('item').setLineItemValue('location', 1, wlocation);
	for(var i = 1; i <= form.getSubList('item').getLineItemCount(); i++){
		//nlapiSelectLineItem('item', i);
		//setTimeout(
		//	function (){
		//		form.getSubList('item').setLineItemValue('location', 1, wlocation);
		//	}, 50);
	}
}