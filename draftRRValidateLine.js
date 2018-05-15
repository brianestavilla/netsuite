function fieldChange(type, name){
	subID = 'recmachcustrecord291';
	if (name == 'custrecord598') {
		cost = nlapiGetCurrentLineItemValue(subID, name);
		costPO = nlapiGetCurrentLineItemValue(subID, 'custrecord304');
		
		if (costPO != cost) {
			alert('Unit Cost does not match Purchase Price');
		}
	}
}

function pageInit() {
	nlapiSelectLineItem('recmachcustrecord291', 1);
}

function validateLine(){
	subID = 'recmachcustrecord291';
	cost = nlapiGetCurrentLineItemValue(subID, 'custrecord598');
	costPO = nlapiGetCurrentLineItemValue(subID, 'custrecord304');
	if (costPO != cost) {
		alert('Unit Cost does not match Purchase Price');
	} else {
		return true;
	}
}