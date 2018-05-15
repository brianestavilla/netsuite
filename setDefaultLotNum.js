function setDefaultLotNum(type, name){		
	if (name == 'quantity'){
		initInventoryDetail();	
	}
}

function initInventoryDetail(){	

			var fulfillrec = nlapiGetNewRecord();
			//var i =fulfillrec.getCurrentLineItemIndex('item')				
			var itemCount = fulfillrec.getLineItemCount();
			var lotNo;
			var onHand;								
			 var expDate; 
			 var ctr = -1;
			 
			for(i = 1; i < itemCount; i++){
				var itemid = fulfillrec.getCurrentLineItemValue('item','item');
				
				var filters= new nlobjSearchFilter('internalid',null,'is',itemid); //filter save search base on internalid 
				var itemSearch = nlapiSearchRecord('item','customsearch132',filters,null);				
				if (itemSearch != null){
					for(x = 0; itemSearch != null && x < itemSearch.length;x++){ // get save search result
						var result = itemSearch[x];
						lotNo = result.getValue('inventorynumber');
						onHand = result.getValue('quantity');// col id to be check
						expDate = result.getValue('expirationdate');// col id to be check		
						alert(lotNo+' '+onHand+' '+expDate);
						ctr = x;
					}
				}
			}			
			
			if(ctr >=0){			
				var subRec = fulfillrec.createCurrentLineItemSubrecord('inventorydetail');				
				subRec.selectNewLineItem('inventoryassignment');	
				subRec.setCurrentLineItemValue('inventoryassignment','issueinventorynumber',lotNo);
				subRec.setCurrentLineItemValue('inventoryassignment','quantity',onHand);
				subRec.setCurrentLineItemValue('inventoryassignment','expirationdate',expDate);
				subRec.commit('inventoryassignment');
				
				fulfillrec.commitLineItem('item');
			}
			else{
				alert('No data has been retrieve');
			}
				
		var id = nlapiSubmitRecord(fulfillrec,true)
}
